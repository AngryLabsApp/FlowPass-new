<script lang="ts">
  import type { User } from "$lib/types/user";
  import { Accordion, Badge } from "flowbite-svelte";
  import { fmtUser, toTitleCase } from "$lib/utils/utils";
  import { Button, Modal, type ModalProps } from "flowbite-svelte";
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

  const { setLoadingModal, setToast } = useUi();

  // let size: ModalProps["size"] = $state("xs"); // Set default value
  let form_selected: { key: UserKeys; form: any } | null = $state(null);
  let show_form = $state(false);

  const formated_user = $derived.by<User>(() => {
    if (!user?.id) return {} as User;
    return fmtUser(user);
  });

  function editField(item: CatalogItem) {
    selectForm(item.key);
  }
  function selectForm(key: UserKeys) {
    if (show_form && form_selected && form_selected.key == key) {
      show_form = false;
      return;
    }
    form_selected = {
      key,
      form: getFieldComponent(key, user, setLoadingModal, setToast, onUpdate),
    };
    show_form = true;
  }

  function isClassLimitFull() {
    if (
      formated_user.limite_clases == null ||
      formated_user.limite_clases == 0 ||
      formated_user.clases_tomadas == null
    )
      return false;
    return formated_user.clases_tomadas >= formated_user.limite_clases;
  }

  function userHasPlan() {
    return formated_user.plan !== null;
  }

  function isActivePlan() {
    console.log(formated_user.estado);
    return formated_user.estado === "Activo";
  }

  function closeForm() {
    show_form = false;
  }

  function onUpdate(reload?: boolean) {
    closeForm();
    if (reload) {
      openModal = false;
    }
    onUpdateUser();
  }

  const isTablet = useMediaQuery("(min-width: 640px)"); // tablet (sm)
  const isDesktop = useMediaQuery("(min-width: 1024px)"); // desktop (lg)

  let modalSize = $state<ModalProps["size"]>("md");

  $effect(() => {
    if (isDesktop())
      modalSize = "lg"; // desktop
    else if (isTablet())
      modalSize = "sm"; // tablet
    else modalSize = "xs"; // mobile
  });
</script>

<Modal bind:open={openModal} size={modalSize} onclose={() => closeForm()}>
  {#snippet header()}
    <div class="flex items-center gap-2">
      {formated_user.full_name}
      {#if formated_user.is_plan_partner}
        {#if formated_user.is_plan_principal}
          <Badge large color="green">Principal</Badge>
        {/if}
        <Badge large color="gray">
          <UsersOutline />Compañero: {toTitleCase(
            formated_user.partner_nombre || "",
          )}
          {toTitleCase(formated_user.partner_apellidos || "")}</Badge
        >
      {/if}
      {#if isClassLimitFull()}
        <Badge large color="yellow">
          <ExclamationCircleOutline />
          Límite de clases alcanzado ({formated_user.clases_tomadas}/{formated_user.limite_clases})
        </Badge>
      {/if}
    </div>
  {/snippet}

  <div class="flex items-up justify-between gap-3">
    {#if user.id && user.id.length > 0}
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
          open={false}
          title="Datos personales"
          items={DATOS_INFO}
          {user}
          {formated_user}
          {editField}
          {setLoadingModal}
          {setToast}
        />
        <AccordionUserItem
          open={false}
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
    {#if form_selected && show_form}
      <form_selected.form.component {...form_selected.form.props} />
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
        onclick={() => {
          selectForm(UserKeys.PLAN);
        }}
        class="flex gap-2 items-center w-full"
        >Renovar plan
        <ArrowRight size="18" />
      </Button>
    </div>
  {/snippet}
</Modal>
