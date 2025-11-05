<script lang="ts">
  import UserModal from "../../../lib/components/modal/modal.svelte";
  import { onMount, setContext } from "svelte";
  import { getUsers } from "$lib/services/api/users";
  import { Heading } from "flowbite-svelte";
  import Navbar from "../../../lib/components/navbar/navbar.svelte";
  import Pagination from "../../../lib/components/pagination/pagination.svelte";
  import UserTable from "../../../lib/components/table/table.svelte";
  import SkeletonTable from "$lib/components/skeletons/table.svelte";
  import { Select, Label } from "flowbite-svelte";
  import type { User } from "$lib/types/user";
  import type { QueryParams } from "$lib/types/queryparams";
  import { BuildQueryParams, MapPlanCatalog } from "$lib/utils/utils";
  import { FilterKeys } from "$lib/enums/filter_keys";
  import type { DashboardFilters } from "$lib/types/dashboardFilters";
  import { SORT_CATALOG } from "$lib/catalog/sort_catalog";
  import { getPlanes } from "$lib/services/api/planes";
  import { getCustomUserTableHeaders } from "$lib/catalog/user_table_columns";
  import { ingresoById } from "$lib/services/api/ingreso";
  import Loader from "$lib/components/loader/loader.svelte";
  import Toast from "$lib/components/toast/toast.svelte";
  import type { ToastInterface } from "$lib/types/toast";
  import { LOADING_CTX, TOAST_CTX } from "$lib/hooks/useUIFunctions.svelte";
  import DeleteUserModal from "$lib/components/modal/delete_user_modal.svelte";
  import BirthDatesRow from "$lib/components/birthdates/birthDatesRow.svelte";

  let pagination_values = $state({ total: 1, start: 0, end: 0, totalPages: 1 });
  let page = $state(1);
  let error = $state("");
  let loading = $state(true);
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

  onMount(async () => {
    const planes = await getPlanes();
    planes_catalog = MapPlanCatalog(planes);
    await fetchAlumnos();
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

    // Si el plan no está activo, no permitir registrar
    if (estadoPlan !== "activo") {
      //setCheckInButtonDisabled(true);
      return;
    }

    // Validación: bloquear y mostrar chip desde que llega al límite (>=)
    const limiteValido = Number.isFinite(limite) && limite > 0; // solo aplica si hay límite positivo
    if (limiteValido && tomadas >= limite) {
      //setCheckInWarning(true, `El usuario llegó al máximo de clases que puede tomar (${tomadas}/${limite})`);
      //setCheckInButtonDisabled(true);
      return;
    }

    const nuevasTomadas = tomadas + 1;
    setLoadingModal(true, "Registrando ingreso");
    try {
      const response = await ingresoById(user.id, nuevasTomadas);
      if (response.response == "Success") {
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

  function onUpdateUser() {
    fetchAlumnos();
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
</script>

<div class="w-full p-4 bg-gray-50 shadow-xs">
  <Navbar
    onSearch={(key: FilterKeys, val: string | Date) => setValue(key, val)}
    PLANES_CATALOG={planes_catalog}
  />
</div>

<div class="p-4">

  <BirthDatesRow></BirthDatesRow>

  <div class="sm:grid sm:grid-cols-2 sm:gap-4 sm:mb-5 flex flex-col gap-1.5 mb-5">
    <Heading tag="h3">Alumnos</Heading>
    <div class="flex items-center gap-3 justify-end">
      <Label for="order-by" class="sm:w-fit sm:w-max-[150px] sm:mb-0 w-1/2 ">Ordenar por:</Label>
      <Select
        id="order-by"
        class="w-full max-w-xs"
        items={SORT_CATALOG}
        bind:value={sort_type}
        onchange={() => {
          setValue(FilterKeys.SORT, sort_type);
        }}
      />
    </div>
  </div>
  <DeleteUserModal
    bind:openModal={openDeleteUserModal}
    user={selected_user}
    onDeleted={onUpdateUser}
  ></DeleteUserModal>
  <UserModal
    bind:openModal
    user={selected_user}
    {registrarIngreso}
    {onUpdateUser}
  />
  {#if loading}
    <SkeletonTable rows={10} cellHeights="h-4" headers={CUSTOM_HEADERS} />
  {:else if error}
    <p class="text-red-600">{error}</p>
  {:else}
    <div class="mb-4">
      <UserTable
        data={users}
        onClick={tableOnclick}
        onDelete={onClickDeleteUser}
        headers={CUSTOM_HEADERS}
        dropdownActions={true}
      />
    </div>

    <Pagination
      {pagination_values}
      bind:page
      onSearch={(key: FilterKeys, val: string) => setValue(key, val)}
    />
  {/if}
  <Loader bind:openModal={modal_loading.loading} title={modal_loading.title}
  ></Loader>
  <Toast bind:toast></Toast>
</div>
