<script lang="ts">
  import GroupModal from "$lib/components/modal/group_modal.svelte";
  import { GRADIENTS } from "$lib/constants/gradients";
  import {
    createUpdateGroup,
    deleteGroup,
    getGroups,
  } from "$lib/services/api/groups";
  import { EllipsisVertical, Grid2X2Plus } from "@lucide/svelte";
  import { Button, Card, group, Heading } from "flowbite-svelte";
  import { onMount } from "svelte";
  import type { Group } from "$lib/types/group";
  import Loader from "../loader/loader.svelte";

  let openGroupModal = $state(false);
  let group_data: Group[] = $state([]);
  let event_loading = $state({ loading: false, title: "" });

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
          group_data[index] = { ...new_group };
        }
      } else {
        group_data.push(new_group);
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

  const MAX_VISIBLE_MEMBERS = 4;

  const getVisibleMembers = (members: string[]) =>
    members.slice(0, MAX_VISIBLE_MEMBERS);

  const getExtraMembersCount = (members: string[]) =>
    Math.max(0, members.length - MAX_VISIBLE_MEMBERS);

  const getGroupInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

  const getGradient = (index: number) =>
    GRADIENTS[index % GRADIENTS.length]?.css ??
    "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)";
</script>

<div class="flex flex-col gap-4">
  <div class="flex justify-between mb-4">
    <Heading tag="h3">Grupos de tus Alumnos</Heading>
    <div class="flex gap-4 items-center w-fit">
      <Button
        class="w-fit flex gap-2 items-center"
        onclick={() => handleCreateGroup()}
      >
        Crear Grupo
        <Grid2X2Plus size={20} />
      </Button>
    </div>
  </div>
  <GroupModal
    bind:openModal={openGroupModal}
    APIcreateGroup={createGroup}
    {onDeleteGroup}
  />
</div>
<div class="">
  <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
    {#each group_data as group, index}
      <Card
        size="md"
        class="relative p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div class="flex items-start gap-4">
          <!-- Avatar Grupo -->
          <div
            class="h-16 w-16 rounded-full flex justify-center items-center text-xl font-bold text-white flex-shrink-0 shadow-inner"
            style={`background:${getGradient(index)}`}
          >
            {getGroupInitials(group.title)}
          </div>

          <!-- Texto -->
          <div class="flex-1 space-y-1">
            <p class="text-base font-semibold text-gray-900">
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
                      {member}
                    </div>
                  {/each}

                  {#if getExtraMembersCount(group.members) > 0}
                    <div
                      class="h-7 w-7 rounded-full bg-gray-300 border border-white text-[10px] font-medium
                     flex items-center justify-center shadow-sm"
                    >
                      +{getExtraMembersCount(group.members)}
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>

          <!-- Botón menú -->
          <EllipsisVertical
            color="gray"
            class="absolute right-3 top-3.5 cursor-pointer hover:text-gray-700"
          />
        </div>
      </Card>
    {/each}
  </div>
</div>

<Loader bind:openModal={event_loading.loading} title={event_loading.title}
></Loader>
