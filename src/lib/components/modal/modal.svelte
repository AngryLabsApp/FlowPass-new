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
  import { getFieldComponent, type FormFieldCatalogItem } from "$lib/catalog/form_component_catalog";
  import { UserKeys } from "$lib/enums/user_keys";

  let {
    openModal = $bindable(false),
    user,
    registrarIngreso,
  } = $props<{
    openModal: boolean;
    user: User;
    registrarIngreso: (user: User) => void;
  }>();
  let size: ModalProps["size"] = $state("lg"); // Set default value
  let form_selected: {key:UserKeys, form: any} | null= $state(null);
  let show_form = $state(false);

  const formated_user = $derived.by<User>(() => {
    if (!user?.id) return {} as User;
    return fmtUser(user);
  });

  function editField(item: CatalogItem) {
    selectForm(item.key);
  }
  function selectForm(key: UserKeys){
    if (show_form && form_selected && form_selected.key == key) {
      show_form= false;
      return;
    }
    form_selected = {key, form: getFieldComponent(key)};
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
</script>

<Modal bind:open={openModal} {size}>
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
          title="Plan actual"
          items={PLAN_INFO}
          {user}
          {formated_user}
          {editField}
        />
        <AccordionUserItem
          title="Datos personales"
          items={DATOS_INFO}
          {user}
          {formated_user}
          {editField}
        />
        <AccordionUserItem
          title="Detalle del ultimo pago"
          items={PAGO_INFO}
          {user}
          {formated_user}
          {editField}
        />
      </Accordion>
    {/if}
    {#if form_selected && show_form}
        <form_selected.form.component {...form_selected.form.props} />
    {/if}
  </div>

  {#snippet footer()}
    <Button onclick={() => registrarIngreso(user)}>Registrar ingreso</Button>
    <Button
      color="secondary"
      onclick={() => {
        selectForm(UserKeys.PLAN);
      }}>Renovar plan</Button
    >
  {/snippet}
</Modal>
