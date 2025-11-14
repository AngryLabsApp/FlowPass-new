<script lang="ts">
  import { Button, Indicator, Select, Label } from "flowbite-svelte";
  import DeleteUserModal from "$lib/components/modal/delete_user_modal.svelte";
  import UserModal from "$lib/components/modal/modal.svelte";
  import BirthDatesRow from "$lib/components/birthdates/birthDatesRow.svelte";
  import SkeletonTable from "$lib/components/skeletons/table.svelte";
  import UserTable from "$lib/components/table/table.svelte";
  import Pagination from "$lib/components/pagination/pagination.svelte";
  import Loader from "$lib/components/loader/loader.svelte";
  import Toast from "$lib/components/toast/toast.svelte";
  import { Gift } from "@lucide/svelte";
  import { FilterKeys } from "$lib/enums/filter_keys";
  import { SORT_CATALOG } from "$lib/catalog/sort_catalog";
  import type { User } from "$lib/types/user";
  import type { ToastInterface } from "$lib/types/toast";
  import type { UserBirthday } from "$lib/types/userBirthday";
  import type { UserKeys } from "$lib/enums/user_keys";

  export let BIRTHDAYS_MODULE_ACTIVE: boolean;
  export let showBirthdays: boolean;
  export let toggleBirthdays: () => void;
  export let birthdaysOfTheWeek: number;
  export let sort_type: string;
  export let setValue: (key: FilterKeys, value: string | Date) => Promise<void>;
  export let openDeleteUserModal: boolean;
  export let selected_user: User;
  export let onUpdateUser: (type?: UserKeys) => void;
  export let openModal: boolean;
  export let registrarIngreso: (user: User) => Promise<void>;
  export let userBirthdays: UserBirthday[];
  export let loading: boolean;
  export let error: string;
  export let CUSTOM_HEADERS;
  export let users: User[];
  export let tableOnclick: (user: User) => void;
  export let onClickDeleteUser: (user: User) => void;
  export let pagination_values: {
    total: number;
    totalPages: number;
    start: number;
    end: number;
  };
  export let page: number;
  export let modal_loading: { loading: boolean; title: string };
  export let toast: ToastInterface;
</script>

<div>
  <div
    class="sm:grid sm:grid-cols-2 sm:gap-4 sm:mb-5 flex flex-col gap-1.5 mb-5"
  >
    <div class="flex flex-col lg:flex-row gap-4">
      {#if BIRTHDAYS_MODULE_ACTIVE}
        <Button
          onclick={toggleBirthdays}
          size="sm"
          color="light"
          outline
          class="shrink-0 justify-start gap-1 w-fit overflow-hidden whitespace-nowrap"
        >
          {#if showBirthdays}
            <Gift size={18} /> Ocultar cumpleaños
          {:else}
            <Gift size={18} />
            Ver cumpleaños
            <Indicator
              class="p-2 bg-pink-200 text-pink-800 text-xs font-semibold"
              size="lg">{birthdaysOfTheWeek}</Indicator
            >
          {/if}
        </Button>
      {/if}
    </div>

    <div class="flex items-center gap-3 justify-end">
      <Label for="order-by" class="sm:w-fit sm:w-max-[150px] sm:mb-0 w-1/2 "
        >Ordenar por:</Label
      >
      <Select
        id="order-by"
        class="w-full max-w-xs"
        items={SORT_CATALOG}
        bind:value={sort_type}
        onchange={() => {
          setValue(FilterKeys.SORT, sort_type);
        }}
      />
    </div>
  </div>
  <DeleteUserModal
    bind:openModal={openDeleteUserModal}
    user={selected_user}
    onDeleted={onUpdateUser}
  ></DeleteUserModal>
  <UserModal
    bind:openModal
    user={selected_user}
    {registrarIngreso}
    {onUpdateUser}
  />
  {#if BIRTHDAYS_MODULE_ACTIVE && showBirthdays}
    <div
      class="w-full mb-5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
             rounded-2xl shadow-sm p-2"
    >
      <BirthDatesRow {userBirthdays} />
    </div>
  {/if}
  {#if loading}
    <SkeletonTable rows={10} cellHeights="h-4" headers={CUSTOM_HEADERS} />
  {:else if error}
    <p class="text-red-600">{error}</p>
  {:else}
    <div class="mb-4">
      <UserTable
        data={users}
        onClick={tableOnclick}
        onDelete={onClickDeleteUser}
        headers={CUSTOM_HEADERS}
        dropdownActions={true}
      />
    </div>

    <Pagination
      {pagination_values}
      bind:page
      onSearch={(key: FilterKeys, val: string) => setValue(key, val)}
    />
  {/if}
  <Loader bind:openModal={modal_loading.loading} title={modal_loading.title}
  ></Loader>
  <Toast bind:toast></Toast>
</div>
