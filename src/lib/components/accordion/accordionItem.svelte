<script lang="ts">
  import type { CatalogItem } from "$lib/types/catalogItem";
  import { AccordionItem, Button } from "flowbite-svelte";
  import type { User } from "$lib/types/user";
  import { EditOutline } from "flowbite-svelte-icons";

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

<AccordionItem {open} headerClass="py-2 px-5">
  {#snippet header()}
    <p>
      {title}
    </p>
  {/snippet}

  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-sm"
  >
    {#each items as item}
      <div class="space-y-1x">
        <div
          class="flex items-start justify-between gap-1 text-gray-900 dark:text-gray-100 font-semibold"
        >
          <div class="flex gap-1">
            <item.icon class="w-5 h-5" />
            <span class="wrap-break-word"
              >{item.label}</span
            >
          </div>

          {#if canEditField(item)}
            <Button
              color="secondary"
              pill={true}
              outline={true}
              class=" h-2 w-2"
              onclick={() => editField(item)}
            >
              <EditOutline size="sm" />
            </Button>
          {/if}
        </div>
        <div class="text-gray-500 dark:text-gray-400">
          {formated_user[item.key as keyof User] || "-"}
          {#if item.actionComponent}
            <item.actionComponent {user} {setLoadingModal} {setToast} />
          {/if}
        </div>
      </div>
    {/each}
  </div>
</AccordionItem>
