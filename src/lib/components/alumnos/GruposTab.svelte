<script lang="ts">
  import GroupModal from "$lib/components/modal/group_modal.svelte";
  import { GRADIENTS } from "$lib/constants/gradients";
  import {
    createUpdateGroup,
    deleteGroup,
    getGroups,
  } from "$lib/services/api/groups";
  import { EllipsisVertical, Grid2X2Plus, Users } from "@lucide/svelte";
  import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    Dropdown,
    DropdownItem,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import type { Group } from "$lib/types/group";
  import Loader from "../loader/loader.svelte";
  import { getInitials } from "$lib/utils/utils";

  let openGroupModal = $state(false);
  let group_data: Group[] = $state([]);
  let event_loading = $state({ loading: false, title: "" });
  const stopEvent = (event: Event) => event.stopPropagation();

  const handleCreateGroup = () => {
    openGroupModal = true;
  };

  const fetchGroups = async () => {
    const groups: Group[] = await getGroups();
    group_data = groups as Group[];
    console.log(groups);
  };

  const createGroup = async (group: Group): Promise<Group> => {
    const texto = group.id
      ? "Actualizando el grupo…"
      : "Creando tu nuevo grupo…";

    event_loading = { loading: true, title: texto };
    try {
      const new_group = await createUpdateGroup(group);
      event_loading = { loading: false, title: "" };
      if (group.id) {
        let index = group_data.findIndex((item) => item.id == group.id);
        if (index >= 0) {
          group_data[index] = { ...group_data[index], ...new_group };
        }
      } else {
        group_data.push({ ...new_group, member_count: 0, members: [] });
      }
      return new_group;
    } catch (error) {
    } finally {
      event_loading = { loading: false, title: "" };
    }
    throw "ERROR";
  };

  const onDeleteGroup = async (group: Group): Promise<boolean> => {
    event_loading = { loading: true, title: "Eliminando el grupo…" };
    try {
      const reponse = await deleteGroup(group.id);
      if (reponse?.success) {
        group_data = group_data.filter((item) => item.id != group.id);
      }
      return reponse?.success;
    } catch (error) {
    } finally {
      event_loading = { loading: false, title: "" };
    }
    return false;
  };

  onMount(async () => {
    await fetchGroups();
  });

  const MAX_VISIBLE_MEMBERS = 3;

  const getVisibleMembers = (members: string[]) =>
    members.slice(0, MAX_VISIBLE_MEMBERS);

  const calculateExtraMembers = (membersQuantity: number) => {
    return membersQuantity - MAX_VISIBLE_MEMBERS;
  };

  const getGradient = (index: number) =>
    GRADIENTS[index % GRADIENTS.length]?.css ??
    "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)";
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb aria-label="Ruta de navegación de grupos" class="px-0 py-0">
    <BreadcrumbItem href="/" home>
      {#snippet icon()}
        <Users class="me-2 h-4 w-4" />
      {/snippet}
      Lista de Grupos</BreadcrumbItem
    >
    <BreadcrumbItem href="/alumnos"
      >Info detallada del grupo xxx
    </BreadcrumbItem>
  </Breadcrumb>
  <div class="flex mb-4 justify-end">
    <Button
      class="w-fit flex gap-2 items-center"
      onclick={() => handleCreateGroup()}
    >
      Crear Grupo
      <Grid2X2Plus size={20} />
    </Button>
  </div>
  <GroupModal
    bind:openModal={openGroupModal}
    APIcreateGroup={createGroup}
    {onDeleteGroup}
  />
</div>
<div class="">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    {#each group_data as group, index}
      <Card
        size="md"
        class="relative p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div
          class="flex flex-col gap-4 pr-0 sm:flex-row sm:items-start sm:gap-4 sm:pr-12"
        >
          <!-- Avatar Grupo -->
          <div
            class="h-16 w-16 rounded-full flex justify-center items-center text-xl font-bold text-white shadow-inner mx-auto sm:mx-0 sm:flex-shrink-0"
            style={`background:${getGradient(index)}`}
          >
            {getInitials(group.title)}
          </div>

          <!-- Texto -->
          <div class="flex-1 space-y-1 text-center sm:text-left">
            <p class="text-base font-semibold text-gray-900 break-words">
              {group.title}
            </p>
            <p class="text-sm text-gray-600">
              Miembros: <span class="font-medium">{group?.member_count}</span>
            </p>

            <!-- Avatares -->
            {#if group.member_count > 0}
              <div class="flex items-center mt-2">
                <div class="flex -space-x-2">
                  {#each getVisibleMembers(group.members) as member}
                    <div
                      class="h-7 w-7 rounded-full bg-gray-100 border border-white text-[10px] font-medium
                     flex items-center justify-center shadow-sm"
                    >
                      {getInitials(member)}
                    </div>
                  {/each}

                  {#if group.member_count > MAX_VISIBLE_MEMBERS}
                    <div
                      class="h-7 w-7 rounded-full bg-gray-300 border border-white text-[10px] font-medium
                     flex items-center justify-center shadow-sm"
                    >
                      +{calculateExtraMembers(group.member_count)}
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>

          <!-- Botón menú -->
          <div
            class="flex items-center justify-end absolute right-2.5 top-1 mt-2 sm:mt-0 sm:absolute sm:right-3 sm:top-3"
          >
            <Button
              outline
              type="button"
              class="inline-flex items-center justify-center rounded-full p-2 border-none"
              color="secondary"
              onclick={stopEvent}
              aria-label="Abrir menú del grupo"
            >
              <EllipsisVertical class="h-5 w-5" />
            </Button>
            <Dropdown simple trigger="click" placement="bottom-end">
              <DropdownItem
                class="hover:bg-red-800 text-red-700 hover:text-red-100"
                onclick={async (event: MouseEvent) => {
                  event.stopPropagation();
                  await onDeleteGroup(group);
                }}>Eliminar grupo</DropdownItem
              >
            </Dropdown>
          </div>
        </div>
      </Card>
    {/each}
  </div>
</div>

<Loader bind:openModal={event_loading.loading} title={event_loading.title}
></Loader>
