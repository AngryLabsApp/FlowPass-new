<script lang="ts">
  import type { User } from "$lib/types/user";
  import { Accordion, AccordionItem } from "flowbite-svelte";
  import {
    fmtUser,
  } from "$lib/utils/utils";
  import { Button, Modal, type ModalProps } from "flowbite-svelte";
  import RenovarPlan from "$lib/components/form/RenovarPlan.svelte";
  import { DATOS_INFO, PAGO_INFO, PLAN_INFO } from "$lib/catalog/user_info_catalogs";

  let { openModal = $bindable(false), user } = $props<{
    openModal: boolean;
    user: User;
  }>();
  let size: ModalProps["size"] = $state("lg"); // Set default value

  const formated_user = $derived.by<User>(() => {
    if (!user?.id) return {} as User;
    return fmtUser(user);
  });

  let show_renovar_plan = $state(false);
</script>

<Modal title={formated_user.full_name} bind:open={openModal} {size}>
  <div class="flex items-up justify-between gap-3">
    {#if user.id && user.id.length > 0}
      <Accordion multiple>
        <AccordionItem open>
          {#snippet header()}
            Plan actual
          {/snippet}
          <!-- GRID responsivo -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6"
          >
            {#each PLAN_INFO as item}
              <div class="space-y-1">
                <div
                  class="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold"
                >
                  <span class="shrink-0">⛔</span>
                  <span>{item.label}</span>
                </div>
                <div class="text-gray-500 dark:text-gray-400">
                  {formated_user[item.key as keyof User] || "-"}
                </div>
              </div>
            {/each}
          </div>
        </AccordionItem>
        <AccordionItem open>
          {#snippet header()}
            Datos personales
          {/snippet}
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6"
          >
            {#each DATOS_INFO as item}
              <div class="space-y-1">
                <div
                  class="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold"
                >
                  <span class="shrink-0">⛔</span>
                  <span>{item.label}</span>
                </div>
                <div class="text-gray-500 dark:text-gray-400">
                  {formated_user[item.key as keyof User] || "-"}
                </div>
              </div>
            {/each}
          </div>
        </AccordionItem>
        <AccordionItem open>
          {#snippet header()}
            Detalle del ultimo pago
          {/snippet}
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6"
          >
            {#each PAGO_INFO as item}
              <div class="space-y-1">
                <div
                  class="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold"
                >
                  <span class="shrink-0">⛔</span>
                  <span>{item.label}</span>
                </div>
                <div class="text-gray-500 dark:text-gray-400">
                  {formated_user[item.key as keyof User] || "-"}
                </div>
              </div>
            {/each}
          </div>
        </AccordionItem>
      </Accordion>
    {/if}
    {#if show_renovar_plan}
      <RenovarPlan></RenovarPlan>
    {/if}
  </div>

  {#snippet footer()}
    <Button type="submit">Registrar ingreso</Button>
    <Button
      color="alternative"
      onclick={() => {
        console.log("ACTUALIZO");
        show_renovar_plan = !show_renovar_plan

      }}
      >Renovar plan</Button
    >
  {/snippet}
</Modal>
