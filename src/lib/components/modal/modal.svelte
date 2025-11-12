<script lang="ts">
  import type { User } from "$lib/types/user";
  import { Accordion, Button, Modal, type ModalProps } from "flowbite-svelte";
  import { fmtUser } from "$lib/utils/utils";
  import AccordionUserItem from "$lib/components/accordion/accordionItem.svelte";
  import {
    DATOS_INFO,
    PAGO_INFO,
    PLAN_INFO,
  } from "$lib/catalog/user_info_catalogs";
  import type { CatalogItem } from "$lib/types/catalogItem";
  import { getFieldComponent } from "$lib/catalog/form_component_catalog";
  import { UserKeys } from "$lib/enums/user_keys";
  import { ArrowRight, ClipboardClock, Pencil } from "@lucide/svelte";
  import { useMediaQuery } from "flowbite-svelte";
  import { useUi } from "$lib/hooks/useUIFunctions.svelte";
  import { ChevronsLeft, CalendarClock } from "@lucide/svelte";
  import { fly } from "svelte/transition";
  import UserModalHeader from "$lib/components/modal/modal_user_header.svelte";
  import { getCachedPlanes } from "$lib/services/api/planes";
  import type { Plan } from "$lib/types/planes";
  import { onMount } from "svelte";

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
    onUpdateUser: (type?: UserKeys) => void;
  }>();

  // UI hooks
  const { setLoadingModal, setToast } = useUi();

  let USER_PLAN: Plan = $state({} as Plan);
  let preview_value = $state(false);
  onMount(() => {});

  $effect(() => {
    if (openModal == preview_value) return;
    preview_value = openModal;
    if (openModal) {
      if (user?.plan_id) {
        const planes = getCachedPlanes();
        USER_PLAN = planes.find((plan) => plan.id == user.plan_id) as Plan;
      }
    }
  });

  // State
  let form_selected: {
    key: UserKeys;
    form: any;
    full_screen?: boolean;
  } | null = $state(null);
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
      showAccordion = false; // en desktop deja ambos
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
    onUpdateUser(form_selected?.key);

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

  function showPrincipalSeccion() {
    if (show_form && form_selected?.form?.full_screen) {
      return false;
    }
    return (!isMobile() || showAccordion) && user?.id;
  }
  const stop = (e: Event) => e.stopPropagation();

  function getUserInitials(name: string, lastname: string) {
    const firstInitial = name ? name.charAt(0).toUpperCase() : "";
    const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  }
</script>

{#snippet buttonLastIngresos()}
  {#if showAccordion}
    <div class="p-0 flex justify-end">
      <Button
        color="secondary"
        size="xs"
        onclick={(e: any) => {
          stop(e);
          selectForm(UserKeys.ULTIMOS_INGRESOS);
        }}
        class="border flex gap-2 items-center w-45 mr-2 sm:mr-4"
        disabled={show_form}
      >
        Ver asistencias
        <CalendarClock size="18" />
      </Button>
    </div>
  {/if}
{/snippet}

<Modal
  bind:open={openModal}
  size={modalSize()}
  onclose={() => setView("reset")}
>
  {#snippet header()}
    <UserModalHeader
      plan={USER_PLAN as Plan}
      {formated_user}
      {getUserInitials}
      onEditName={() => selectForm(UserKeys.NOMBRE)}
    />
  {/snippet}

  <div class="flex flex-col md:flex-row items-start justify-between gap-3">
    <!-- Panel Izquierdo -->
    {#if showPrincipalSeccion()}
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
        >
          {@render buttonLastIngresos()}
        </AccordionUserItem>
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
      <div class="w-full flex flex-col items-center gap-2 p-2 lg:p-4">
        <button
          class=" self-start text-sm text-gray-500 mb-2 flex items-center gap-1 font-black"
          onclick={() => setView("accordion")}
        >
          <ChevronsLeft size="24" /> Volver
        </button>

        <form_selected.form.component {...form_selected.form.props} />
      </div>
    {/if}
  </div>

  {#snippet footer()}
    <div
      class="relative overflow-hidden w-full transition-[min-height] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
      style="min-height: {showAccordion ? '40px' : '0px'};"
    >
      {#if showAccordion}
        <div
          in:fly={{
            y: 24,
            duration: 160,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          }}
          out:fly={{ y: 24, duration: 130, easing: (t) => t * t }}
          class="flex justify-between w-full gap-2 backdrop-blur-sm px-2 py-2"
        >
          <Button
            onclick={() => registrarIngreso(user)}
            class="flex gap-2 items-center w-full"
            disabled={isClassLimitFull() || !userHasPlan() || !isActivePlan()}
          >
            <ClipboardClock size="18" />
            Registrar Asistencia
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
      {/if}
    </div>
  {/snippet}
</Modal>
