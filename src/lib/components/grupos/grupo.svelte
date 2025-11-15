<script lang="ts">
    import { Button, Label, Select } from "flowbite-svelte";
    import DeleteUserModal from "$lib/components/modal/delete_user_modal.svelte";
    import UserModal from "$lib/components/modal/modal.svelte";
    import type { Group } from "$lib/types/group";
    import Loader from "../loader/loader.svelte";
    import { FilterKeys } from "$lib/enums/filter_keys";
    import type { User } from "$lib/types/user";
    import type { UserKeys } from "$lib/enums/user_keys";
    import type { ToastInterface } from "$lib/types/toast";
    import { SORT_CATALOG } from "$lib/catalog/sort_catalog";
    import SkeletonTable from "$lib/components/skeletons/table.svelte";
    import UserTable from "$lib/components/table/table.svelte";
    import Pagination from "$lib/components/pagination/pagination.svelte";
    import Toast from "$lib/components/toast/toast.svelte";
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
</script>

<div>
    <div
        class="sm:grid sm:grid-cols-2 sm:gap-4 sm:mb-5 flex flex-col gap-1.5 mb-5"
    >
        <div class="flex flex-col lg:flex-row gap-4"></div>
        <div class="flex items-center gap-3 justify-end">
            <Label
                for="order-by"
                class="sm:w-fit sm:w-max-[150px] sm:mb-0 w-1/2 "
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
