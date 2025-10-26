<script lang="ts">
  import type { CatalogItem } from "$lib/types/catalogItem";
  import { AccordionItem, Button } from "flowbite-svelte";
  import type { User } from "$lib/types/user";
  import { EditOutline } from "flowbite-svelte-icons";
  import { CurrencyKeys } from "$lib/enums/currency_keys";

  let {
    title,
    items,
    user,
    formated_user,
    editField,
    setLoadingModal,
    setToast,
    open,
  } = $props<{
    open?: boolean;
    title: string;
    items: CatalogItem[];
    user: User;
    formated_user: User;
    editField: (item: CatalogItem) => void;
    setLoadingModal: (loading: boolean, title?: string) => void;
    setToast: (title: string, success: boolean) => void;
  }>();

  function canEditField(item: CatalogItem) {
    if (item.edit_only_with_plan) {
      if (user.is_plan_partner) return item.editable && user.is_plan_principal;
      return item.editable && user.plan != "" && user.plan != null;
    }

    return item.editable;
  }
</script>

<AccordionItem
  {open}
  headerClass="py-1.5 px-5"
>
  {#snippet header()}
    <div class= "flex w-full justify-between items-center">
      <p class="text-sm/6">
        {title}
      </p>
      <slot></slot>
    </div>
  {/snippet}

  <div
    class="grid gap-x-3 gap-y-4 text-sm/6
         [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]"
  >
    {#each items as item}
      <div class="flex flex-col space-y-1x">
        <div
          class="flex items-start gap-2 text-gray-900 dark:text-gray-100 font-semibold"
        >
          <div class="flex gap-1">
            <item.icon />
            <span class="wrap-break-word">{item.label}</span>
          </div>

          {#if canEditField(item)}
            <Button
              color="secondary"
              pill={true}
              outline={true}
              class="p-1"
              onclick={() => editField(item)}
            >
              <EditOutline size="sm" />
            </Button>
          {/if}
        </div>
        <div class="text-gray-500 dark:text-gray-400 flex gap-2 justify-start">
          {#if item.key === "monto"}
            {CurrencyKeys.PEN}{formated_user[item.key as keyof User] || "-"}
          {:else}
            {formated_user[item.key as keyof User] || "-"}
          {/if}

          {#if item.actionComponent}
            <item.actionComponent {user} {setLoadingModal} {setToast} />
          {/if}
        </div>
      </div>
    {/each}
  </div>
</AccordionItem>
