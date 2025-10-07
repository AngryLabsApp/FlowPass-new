<script lang="ts">
  import type { CatalogItem } from "$lib/types/catalogItem";
  import { AccordionItem, Button } from "flowbite-svelte";
  import type { User } from "$lib/types/user";
  import { EditOutline } from "flowbite-svelte-icons";

  let { title, items, user, formated_user, editField } = $props<{
    title: string;
    items: CatalogItem[];
    user: User;
    formated_user: User;
    editField: (item: CatalogItem) => void;
  }>();

  function canEditField(item: CatalogItem) {
    if (item.edit_only_with_plan) {
      if (user.is_plan_partner) return item.editable && user.is_plan_principal;
      return item.editable && user.plan != "" && user.plan != null;
    }

    return item.editable;
  }
</script>

<AccordionItem open>
  {#snippet header()}
    {title}
  {/snippet}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
    {#each items as item}
      <div class="space-y-1">
        <div
          class="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold"
        >
          <item.icon class="w-5 h-5" />
          <span>{item.label}</span>
          {#if canEditField(item)}
            <Button
              pill={true}
              outline={true}
              class="p-3! h-5 w-5"
              onclick={() => editField(item)}
            >
              <EditOutline />
            </Button>
          {/if}
        </div>
        <div class="text-gray-500 dark:text-gray-400">
          {formated_user[item.key as keyof User] || "-"}
        </div>
      </div>
    {/each}
  </div>
</AccordionItem>
