<script lang="ts">
  import { Button, Input, Label, Modal } from "flowbite-svelte";
  import { Pen, Trash2 } from "@lucide/svelte";
  import type { Group } from "$lib/types/group";

  let {
    openModal = $bindable(false),
    APIcreateGroup,
    onDeleteGroup,
  } = $props<{
    openModal: boolean;
    APIcreateGroup: (group: Group) => Promise<Group>;
    onDeleteGroup: (group: Group) => Promise<boolean>;
  }>();

  let groupName = $state("");
  let groups: Group[] = $state([]);
  let error = $state("");
  let editingIndex: number | null = $state(null);
  let editingValue = $state("");

  const totalGroups = $derived(() => groups.length);
  const hasGroups = $derived(() => groups.length > 0);
  const isEditing = (index: number) => editingIndex === index;

  const resetForm = () => {
    groupName = "";
    error = "";
  };

  const resetEditing = () => {
    editingIndex = null;
    editingValue = "";
  };

  const resetModalState = () => {
    resetForm();
    resetEditing();
  };

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    createGroup();
  }

  async function createGroup() {
    const formattedName = groupName.trim();

    if (!formattedName) {
      error = "Ingresa un nombre para el grupo.";
      return;
    }

    let newGroup: Partial<Group> = {
      title: formattedName,
      color: "",
    };
    const created = await APIcreateGroup(newGroup as Group);
    newGroup.id = created.id;
    groups = [...groups, { ...newGroup } as Group];
    resetForm();
  }

  function handleCancel() {
    resetModalState();
    openModal = false;
  }

  async function removeGroup(index: number) {
    const group = groups[index];

    const response = await onDeleteGroup(group);
    if (response) {
      groups = groups.filter((_, currentIndex) => currentIndex !== index);
      resetEditing();
    }
  }

  function startEditing(index: number, currentName: string) {
    editingIndex = index;
    editingValue = currentName;
  }

  function handleEditingKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEditing();
    } else if (event.key === "Escape") {
      resetEditing();
    }
  }

  function handleEditingBlur(event: FocusEvent) {
    const nextTarget = event.relatedTarget as HTMLElement | null;
    if (nextTarget?.dataset?.action === "save-group-edit") {
      return;
    }
    saveEditing({ closeOnly: true });
  }

  async function saveEditing(options?: { closeOnly?: boolean }) {
    if (editingIndex === null) return;
    const { closeOnly = false } = options ?? {};
    const trimmed = editingValue.trim();

    if (closeOnly || !trimmed) {
      resetEditing();
      return;
    }
    const group = groups[editingIndex];
    let newGroup: Partial<Group> = {
      id: group.id,
      title: trimmed,
      color: "",
    };
    const edited = await APIcreateGroup(newGroup as Group);
    console.log(edited);

    groups[editingIndex].title = trimmed;

    //groups = groups.map((group, idx) =>
    //  idx === editingIndex ? { ...group, title: trimmed } : group,
    //);
    resetEditing();
    error = "";
  }
</script>

<Modal
  title="Crear grupo"
  bind:open={openModal}
  class="max-w-lg"
  onclose={resetModalState}
>
  <form class="flex flex-col gap-4" onsubmit={(e) => handleSubmit(e)}>
    <Label class="space-y-2">
      <span class="text-sm font-medium text-gray-700">Nombre del grupo</span>
      <Input
        placeholder="Ej. Equipo de mañana"
        bind:value={groupName}
        required
      />
    </Label>
    {#if error}
      <p class="text-sm text-red-600">{error}</p>
    {/if}

    <div class="flex justify-end gap-3 pt-2">
      <Button type="button" color="light" onclick={handleCancel}
        >Cancelar</Button
      >
      <Button type="submit">Guardar grupo</Button>
    </div>
  </form>

  {#if hasGroups()}
    <div class="mt-6 border-t border-gray-200 pt-4">
      <div
        class="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-gray-500"
      >
        <p>Grupos creados (temporal)</p>
        <span>Total: {totalGroups()}</span>
      </div>
      <div class="max-h-60 overflow-y-auto pr-1">
        <ul class="space-y-2">
          {#each groups as group, i}
            <li
              class="flex items-center justify-between gap-3 rounded border border-gray-200 px-3 py-2 text-sm text-gray-700"
            >
              <div class="flex flex-1 min-w-0 flex-col gap-1">
                {#if isEditing(i)}
                  <div class="flex items-center gap-2">
                    <Input
                      bind:value={editingValue}
                      autofocus
                      size="sm"
                      onblur={handleEditingBlur}
                      onkeydown={handleEditingKeydown}
                      class="w-full"
                    />
                    <Button
                      size="xs"
                      color="primary"
                      type="button"
                      data-action="save-group-edit"
                      onclick={() => saveEditing()}
                    >
                      Guardar
                    </Button>
                  </div>
                {:else}
                  <span class="font-medium truncate">{group.title}</span>
                {/if}
                <span class="text-[11px] text-gray-400">Grupo #{i + 1}</span>
              </div>

              <div class="flex shrink-0 gap-2">
                <button
                  type="button"
                  class="text-gray-500 transition hover:text-gray-800"
                  onclick={() => startEditing(i, group.title)}
                >
                  <Pen size={18} />
                </button>
                <button
                  type="button"
                  class="text-red-500 transition hover:text-red-600"
                  onclick={() => removeGroup(i)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</Modal>
