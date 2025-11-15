<script lang="ts">
  import GroupModal from "$lib/components/modal/group_modal.svelte";
  import { GRADIENTS } from "$lib/constants/gradients";
  import {
    createUpdateGroup,
    deleteGroup,
    getGroups,
  } from "$lib/services/api/groups";
  import { EllipsisVertical, Grid2X2Plus, Users } from "@lucide/svelte";
  import { Button, Card, Dropdown, DropdownItem } from "flowbite-svelte";
  import { onMount } from "svelte";
  import type { Group } from "$lib/types/group";
  import Loader from "../loader/loader.svelte";
  import { getInitials } from "$lib/utils/utils";
  import BreadCrum from "$lib/components/breadcrum/groupsBreadcrum.svelte";
  import type { FilterKeys } from "$lib/enums/filter_keys";
  import type { User } from "$lib/types/user";
  import type { UserKeys } from "$lib/enums/user_keys";
  import type { ToastInterface } from "$lib/types/toast";
  import Grupo from "$lib/components/grupos/grupo.svelte";
  import GroupsSkeleton from "$lib/components/skeletons/groups.svelte";
  let {
    sort_type,
    setValue,
    openDeleteUserModal = $bindable(false),
    selected_user,
    onUpdateUser,
    openModal = $bindable(false),
    registrarIngreso,
    loading,
    error,
    CUSTOM_HEADERS,
    users,
    tableOnclick,
    onClickDeleteUser,
    pagination_values,
    page = $bindable(1),
    modal_loading,
    toast = $bindable({
      type: "success",
      text: "",
      show: false,
    }),
  }: {
    sort_type: string;
    setValue: (key: FilterKeys, value: string | Date) => Promise<void>;
    openDeleteUserModal: boolean;
    selected_user: User;
    onUpdateUser: (type?: UserKeys) => void;
    openModal: boolean;
    registrarIngreso: (user: User) => Promise<void>;
    loading: boolean;
    error: string;
    CUSTOM_HEADERS: any; // dime el tipo y lo ajusto
    users: User[];
    tableOnclick: (user: User) => void;
    onClickDeleteUser: (user: User) => void;
    pagination_values: {
      total: number;
      totalPages: number;
      start: number;
      end: number;
    };
    page: number;
    modal_loading: { loading: boolean; title: string };
    toast: ToastInterface;
  } = $props();
  let isLoadingGroups = $state(true);
  let openGroupModal = $state(false);
  let group_data: Group[] = $state([]);
  let event_loading = $state({ loading: false, title: "" });
  const stopEvent = (event: Event) => event.stopPropagation();
  let current_breadcrum_level = $state(1);
  let group_selected = $state({ title: "" });

  const selectGroup = (group: Group) => {
    group_selected = group;
    current_breadcrum_level = 2;
  };
  const setBreadCrumLevel = (level: number) => {
    if (level <= 0) level = 1;

    current_breadcrum_level = level;
  };
  const handleCreateGroup = () => {
    openGroupModal = true;
  };

  const fetchGroups = async () => {
    isLoadingGroups= true;
    const groups: Group[] = await getGroups();
    group_data = groups as Group[];
    isLoadingGroups = false;
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
  <BreadCrum
    maxItems={current_breadcrum_level}
    groupName={group_selected.title}
    setLevel={setBreadCrumLevel}
  ></BreadCrum>

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
{#if isLoadingGroups}
<GroupsSkeleton></GroupsSkeleton>
{/if}

{#if !isLoadingGroups && current_breadcrum_level <= 1}
  <div class="">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {#each group_data as group, index}
        <Card
          size="md"
          class="relative p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
          onclick={() => {
            selectGroup(group);
          }}
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
{/if}
{#if current_breadcrum_level == 2}
  <Grupo
    {sort_type}
    {setValue}
    bind:openDeleteUserModal
    {selected_user}
    {onUpdateUser}
    bind:openModal
    {registrarIngreso}
    {loading}
    {error}
    {CUSTOM_HEADERS}
    {users}
    {tableOnclick}
    {onClickDeleteUser}
    {pagination_values}
    bind:page
    {modal_loading}
    bind:toast
  ></Grupo>
{/if}

<Loader bind:openModal={event_loading.loading} title={event_loading.title}
></Loader>
