<script lang="ts">
  import type { User } from "$lib/types/user";
  import {
    Accordion,
    Badge,
    Button,
    Modal,
    type ModalProps,
  } from "flowbite-svelte";
  import { fmtUser, toTitleCase } from "$lib/utils/utils";
  import AccordionUserItem from "$lib/components/accordion/accordionItem.svelte";
  import {
    DATOS_INFO,
    PAGO_INFO,
    PLAN_INFO,
  } from "$lib/catalog/user_info_catalogs";
  import {
    ExclamationCircleOutline,
    UsersOutline,
  } from "flowbite-svelte-icons";
  import type { CatalogItem } from "$lib/types/catalogItem";
  import { getFieldComponent } from "$lib/catalog/form_component_catalog";
  import { UserKeys } from "$lib/enums/user_keys";
  import { ArrowRight, ClipboardClock } from "@lucide/svelte";
  import { useMediaQuery } from "flowbite-svelte";
  import { useUi } from "$lib/hooks/useUIFunctions.svelte";
  import { ChevronsLeft } from "@lucide/svelte";

  // Props
  let {
    openModal = $bindable(false),
    user,
    registrarIngreso,
    onUpdateUser,
  } = $props<{
    openModal: boolean;
    user: User;
    registrarIngreso: (user: User) => void;
    onUpdateUser: () => void;
  }>();

  // UI hooks
  const { setLoadingModal, setToast } = useUi();

  // State
  let form_selected: { key: UserKeys; form: any } | null = $state(null);
  let show_form = $state(false);
  let showAccordion = $state(true);

  // Media queries unificadas
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 640px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const device = $derived(() => {
    if (isDesktop()) return "desktop";
    if (isTablet()) return "tablet";
    return "mobile";
  });

  let modalSize = $derived((): ModalProps["size"] => {
    const current = device();
    if (current === "desktop") return "lg";
    if (current === "tablet") return "sm";
    return "xs";
  });

  // User formatting
  const formated_user = $derived.by<User>(() => {
    if (!user?.id) return {} as User;
    return fmtUser(user);
  });

  // Cambia entre vistas: "accordion" | "form" | "reset"
  function setView(mode: "accordion" | "form" | "reset") {
    if (mode === "accordion") {
      show_form = false;
      showAccordion = true;
    } else if (mode === "form") {
      show_form = true;
      showAccordion = !isMobile(); // en desktop deja ambos
    } else {
      // reset
      show_form = false;
      showAccordion = true;
      form_selected = null;
    }
  }

  // Acciones principales
  function editField(item: CatalogItem) {
    selectForm(item.key);
  }

  function selectForm(key: UserKeys) {
    if (form_selected?.key === key && show_form) return;

    form_selected = {
      key,
      form: getFieldComponent(key, user, setLoadingModal, setToast, onUpdate),
    };

    setView("form");
  }

  function onUpdate(reload?: boolean) {
    setView("accordion");
    onUpdateUser();

    if (reload) {
      openModal = false;
    }
  }

  // Helpers
  function isClassLimitFull() {
    const { limite_clases, clases_tomadas } = formated_user;
    if (!limite_clases || !clases_tomadas) return false;
    return clases_tomadas >= limite_clases;
  }

  function userHasPlan() {
    return formated_user.plan !== null;
  }

  function isActivePlan() {
    return formated_user.estado === "Activo";
  }
</script>

<Modal
  bind:open={openModal}
  size={modalSize()}
  onclose={() => setView("reset")}
>
  {#snippet header()}
    <div class="flex items-center gap-2 flex-wrap">
      <div>{formated_user.full_name}</div>

      {#if formated_user.is_plan_partner}
        {#if formated_user.is_plan_principal}
          <Badge large color="green">Principal</Badge>
        {/if}
        <Badge large color="gray">
          <UsersOutline />
          Compañero:
          {toTitleCase(formated_user.partner_nombre || "")}
          {toTitleCase(formated_user.partner_apellidos || "")}
        </Badge>
      {/if}

      {#if isClassLimitFull()}
        <Badge large color="yellow">
          <ExclamationCircleOutline />
          Límite de clases alcanzado ({formated_user.clases_tomadas}/{formated_user.limite_clases})
        </Badge>
      {/if}
    </div>
  {/snippet}

  <div class="flex flex-col md:flex-row items-start justify-between gap-3">
    <!-- Panel Izquierdo -->
    {#if (!isMobile() || showAccordion) && user?.id}
      <Accordion multiple>
        <AccordionUserItem
          open={true}
          title="Plan actual"
          items={PLAN_INFO}
          {user}
          {formated_user}
          {editField}
          {setLoadingModal}
          {setToast}
        />
        <AccordionUserItem
          open={true}
          title="Datos personales"
          items={DATOS_INFO}
          {user}
          {formated_user}
          {editField}
          {setLoadingModal}
          {setToast}
        />
        <AccordionUserItem
          open={true}
          title="Detalle del último pago"
          items={PAGO_INFO}
          {user}
          {formated_user}
          {editField}
          {setLoadingModal}
          {setToast}
        />
      </Accordion>
    {/if}

    <!-- Panel Derecho -->
    {#if form_selected && show_form && (!isMobile() || !showAccordion)}
      <div class="w-full md:w-2xl">
        <button
          class="text-sm text-gray-500 mb-2 flex items-center gap-1 font-black"
          on:click={() => setView("accordion")}
        >
          <ChevronsLeft size="24" /> Volver
        </button>

        <form_selected.form.component {...form_selected.form.props} />
      </div>
    {/if}
  </div>

  {#snippet footer()}
    <div class="flex justify-between w-full gap-4">
      <Button
        onclick={() => registrarIngreso(user)}
        class="flex gap-2 items-center w-full"
        disabled={isClassLimitFull() || !userHasPlan() || !isActivePlan()}
      >
        <ClipboardClock size="18" />
        Registrar ingreso
      </Button>

      <Button
        color="secondary"
        onclick={() => selectForm(UserKeys.PLAN)}
        class="flex gap-2 items-center w-full"
        disabled={show_form}
      >
        Renovar plan
        <ArrowRight size="18" />
      </Button>
    </div>
  {/snippet}
</Modal>
