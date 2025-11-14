<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { getUsers, getUsersByBirthDay } from "$lib/services/api/users";
  import { Tabs, TabItem } from "flowbite-svelte";
  import Navbar from "../../../lib/components/navbar/navbar.svelte";
  import type { User } from "$lib/types/user";
  import type { QueryParams } from "$lib/types/queryparams";
  import { BuildQueryParams, MapPlanCatalog } from "$lib/utils/utils";
  import { FilterKeys } from "$lib/enums/filter_keys";
  import type { DashboardFilters } from "$lib/types/dashboardFilters";
  import { getPlanes } from "$lib/services/api/planes";
  import { getCustomUserTableHeaders } from "$lib/catalog/user_table_columns";
  import { ingresoById } from "$lib/services/api/ingreso";
  import type { ToastInterface } from "$lib/types/toast";
  import { LOADING_CTX, TOAST_CTX } from "$lib/hooks/useUIFunctions.svelte";
  import { getCustomEnv } from "$lib/utils/env_utils";
  import { MODULES } from "$lib/enums/modules_enum";
  import { Blocks, Users } from "@lucide/svelte";
  import type { UserBirthday } from "$lib/types/userBirthday";
  import { UserKeys } from "$lib/enums/user_keys";
  import AlumnosTab from "$lib/components/alumnos/AlumnosTab.svelte";
  import GruposTab from "$lib/components/alumnos/GruposTab.svelte";

  const HIDE_MODULES = getCustomEnv("hide_modules") || [];
  const BIRTHDAYS_MODULE_ACTIVE = !HIDE_MODULES.includes(MODULES.BIRTHDAY);

  const TAB_ACTIVE_CLASS =
    "px-4 py-3 text-sm font-semibold text-[var(--color-primary-800)] border-b-2 border-[var(--color-primary-800)] bg-transparent";
  const TAB_INACTIVE_CLASS =
    "px-4 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-[var(--color-gray-400)] hover:border-gray-400";

  let pagination_values = $state({ total: 1, start: 0, end: 0, totalPages: 1 });
  let page = $state(1);
  let error = $state("");
  let loading = $state(true);
  let showBirthdays = $state(false);
  let birthdaysOfTheWeek: number = $state(0);
  let userBirthdays: UserBirthday[] = $state([]);
  let CUSTOM_HEADERS = getCustomUserTableHeaders();

  let modal_loading = $state({ loading: false, title: "" });

  setContext(LOADING_CTX, { setLoadingModal });
  setContext(TOAST_CTX, { setToast });

  let users: User[] = $state([]);
  let planes_catalog: { value: string; name: string }[] = $state([
    { value: "all", name: "Planes: Todos" },
  ]);
  let toast: ToastInterface = $state({
    type: "success",
    text: "",
    show: false,
  });

  const getbirthDays = async () => {
    if (!BIRTHDAYS_MODULE_ACTIVE) return;
    const abort = new AbortController();
    const members = await getUsersByBirthDay(abort, {});
    userBirthdays = members.users;
    birthdaysOfTheWeek = members.users.length;
  };
  onMount(async () => {
    const planes = await getPlanes();
    planes_catalog = MapPlanCatalog(planes);
    await fetchAlumnos();
    getbirthDays();
  });

  let openModal: boolean = $state(false);
  let openDeleteUserModal: boolean = $state(false);
  let selected_user: User = $state({} as User);
  const tableOnclick = (user: User) => {
    openModal = true;
    selected_user = user;
  };

  let sort_type = $state("created_desc");
  let filters: DashboardFilters = {
    page: 1,
    estado: "",
    plan: "",
    search: "",
    sort: "created_desc",
  };
  let currentAbort: AbortController | null = null;

  async function setValue(key: FilterKeys, value: string | Date) {
    if (key === FilterKeys.SEARCH) {
      page = 1;
      filters.search = value;
    }
    if (key === FilterKeys.ESTADO) {
      page = 1;
      filters.estado = value;
    }
    if (key === FilterKeys.PLAN) {
      page = 1;
      filters.plan = value;
    }
    if (key === FilterKeys.SORT) {
      page = 1;
      filters.sort = value;
    }

    filters.page = page;
    await fetchAlumnos();
  }

  async function fetchAlumnos() {
    currentAbort?.abort();
    const abort = new AbortController();
    currentAbort = abort;

    let queryParams: QueryParams = BuildQueryParams(filters);

    try {
      loading = true;
      const res = await getUsers(abort, queryParams);

      if (currentAbort !== abort) return;

      users = res.users;
      const pageSize = 10;

      const start = res.total ? (page - 1) * pageSize + 1 : 0;
      const end = Math.min(page * pageSize, res.total);
      const totalPages = Math.max(1, Math.ceil(res.total / pageSize));
      pagination_values = {
        total: res.total,
        totalPages,
        start,
        end,
      };
    } catch (err: any) {
      if (err?.name === "AbortError") return;

      error = err?.message ?? "❌ Error al cargar usuarios";
    } finally {
      if (currentAbort === abort) loading = false;
    }
  }

  const registrarIngreso = async (user: User) => {
    const tomadas = Number(user.clases_tomadas) || 0;
    const limite = Number(user.limite_clases);
    const estadoPlan = String(user.estado || "")
      .trim()
      .toLowerCase();

    if (estadoPlan !== "activo") {
      return;
    }

    const limiteValido = Number.isFinite(limite) && limite > 0;
    if (limiteValido && tomadas >= limite) {
      return;
    }

    const nuevasTomadas = tomadas + 1;
    setLoadingModal(true, "Registrando ingreso");
    try {
      const response = await ingresoById(user.id, nuevasTomadas);
      if (response?.id) {
        setToast("¡Se registró el ingreso correctamente!", true);
        selected_user.clases_tomadas = nuevasTomadas;
        openModal = false;
        fetchAlumnos();
      }
    } catch (error) {
      setToast(
        "Hubo un problema al actualizar. Reintenta en unos segundos.",
        false
      );
    } finally {
      setLoadingModal(false);
    }
  };

  async function onUpdateUser(type?: UserKeys) {
    fetchAlumnos();
    if ([UserKeys.CUMPLEANOS, UserKeys.DELETE].includes(type as UserKeys)) {
      getbirthDays();
    }
  }

  function setLoadingModal(loading: boolean, title?: string) {
    modal_loading = { loading, title: title || "" };
  }

  function setToast(title?: string, success: boolean = true) {
    toast = {
      type: success ? "success" : "error",
      text: title || "",
      show: true,
    };
  }

  function onClickDeleteUser(user: User) {
    openDeleteUserModal = true;
    selected_user = user;
  }

  function toggleBirthdays() {
    showBirthdays = !showBirthdays;
  }
</script>

<div class="w-full p-4 bg-gray-50 shadow-xs">
  <Navbar
    onSearch={(key: FilterKeys, val: string | Date) => setValue(key, val)}
    PLANES_CATALOG={planes_catalog}
  />
</div>

<div class="p-4">
  <Tabs
    tabStyle="underline"
    divider={false}
    class="flex-wrap gap-4 text-sm font-medium text-gray-500"
    classes={{
      active: TAB_ACTIVE_CLASS,
      content: "mt-6 p-0 bg-transparent"
    }}
  >
    <TabItem open inactiveClass={TAB_INACTIVE_CLASS}>
      {#snippet titleSlot()}
        <div class="flex items-center gap-2">
          <Users />
          Alumnos
        </div>
      {/snippet}
      <AlumnosTab
        {BIRTHDAYS_MODULE_ACTIVE}
        {showBirthdays}
        {toggleBirthdays}
        {birthdaysOfTheWeek}
        {sort_type}
        {setValue}
        bind:openDeleteUserModal
        {selected_user}
        {onUpdateUser}
        bind:openModal
        {registrarIngreso}
        {userBirthdays}
        {loading}
        {error}
        {CUSTOM_HEADERS}
        {users}
        {tableOnclick}
        {onClickDeleteUser}
        {pagination_values}
        bind:page
        {modal_loading}
        bind:toast
      />
    </TabItem>
    <TabItem inactiveClass={TAB_INACTIVE_CLASS}>
      {#snippet titleSlot()}
        <div class="flex items-center gap-2">
          <Blocks />
          Grupos
        </div>
      {/snippet}
      <GruposTab />
    </TabItem>
  </Tabs>
</div>
