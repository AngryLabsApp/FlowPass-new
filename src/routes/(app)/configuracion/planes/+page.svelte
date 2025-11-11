<script lang="ts">
    import {
        getPlanesWithOutCache,
        updateOrCreatePlan,
    } from "$lib/services/api/planes";
    import SkeletonTable from "$lib/components/skeletons/table.svelte";
    import type { Plan } from "$lib/types/planes";
    import {
        Badge,
        Button,
        Modal,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
    import { onMount } from "svelte";
    import PlanEdit from "$lib/components/configuracion/planes/planEdit.svelte";
    import {
        EditOutline,
        PlusOutline,
        TrashBinOutline,
    } from "flowbite-svelte-icons";
    import type { Column } from "$lib/types/column";
    import { CircleAlert } from "@lucide/svelte";
    let planes: Plan[] = $state([]);

    let openRow: number | null | undefined = $state();
    let details: Plan | undefined = $state();
    let isloading: boolean = $state(true);
    let openEditEventModal: boolean = $state(false);
    const HEADERS: Column<any>[] = [
        {
            header: "Nombre",
            key: "nombre",
        },
        {
            header: "Costo",
            key: "costo",
        },
        {
            header: "Duración (días)",
            key: "duracion",
        },
        {
            header: "Límite de accesos",
            key: "limite",
        },
        {
            header: "Prioridad",
            key: "prioridad",
        },
        {
            header: "",
            key: "edit",
        },
    ];
    const toggleRow = (i: number) => {
        openRow = openRow === i ? null : i;
    };

    onMount(async () => {
        refresh();
    });

    const addPlan = () => {
        const currentSize = planes.length;
        let newPlan: Plan = {
            id: "",
            value: "Nuevo",
            label: "Nuevo",
            amount: 0,
            partners: false,
            ilimitado: false,
            neverExpires: false,
            dias_mes: 0,
            limite_clases: 0,
            is_free: false,
            updated_at: "",
            created_at: "",
            order: currentSize + 1,
        };
        planes.unshift(newPlan);
        openRow = 0;
    };

    const refresh = async () => {
        toggleRow(-1);
        isloading = true;
        const _planes = (await getPlanesWithOutCache()) || [];
        planes = _planes.sort((a, b) => a.order - b.order);
        isloading = false;
    };

    const updatePlan = async (plan: Plan) => {
        isloading = true;
        const response = await updateOrCreatePlan(plan);
        await refresh();
    };

    const stop = (e: Event) => e.stopPropagation();

    const onDeleteButton = (plan:Plan, index: number) => {
        if (plan.id){
            openEditEventModal = true;
        } else {
            toggleRow(-1);
            planes.splice(index, 1);
        }
    };
    const onDeleteAccept = () => {
        openEditEventModal= false;
    };
</script>

<h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Planes</h1>
{#if isloading}
    <SkeletonTable rows={10} cellHeights="h-4" headers={HEADERS} />
{:else}
    <Button
        color="secondary"
        size="lg"
        onclick={() => {
            addPlan();
        }}
        class="flex gap-2 items-center"
    >
        Nuevo Plan
        <PlusOutline />
    </Button>
    <Table>
        <TableHead>
            {#each HEADERS as col}
                <TableHeadCell>{col.header}</TableHeadCell>
            {/each}
        </TableHead>
        <TableBody>
            {#each planes as plan, i}
                <TableBodyRow>
                    <TableBodyCell
                        >{plan.label}
                        {#if !plan.id}
                            <Badge large color="yellow">Sin guardar</Badge>
                        {/if}
                    </TableBodyCell>
                    <TableBodyCell>{plan.amount}</TableBodyCell>
                    <TableBodyCell>{plan.dias_mes}</TableBodyCell>
                    <TableBodyCell>{plan.limite_clases}</TableBodyCell>
                    <TableBodyCell>{plan.order}</TableBodyCell>
                    <TableBodyCell>
                        <EditOutline
                            class="h-7 w-7 text-primary-900  dark:text-gray-400"
                            onclick={(e) => {
                                stop(e);
                                toggleRow(i);
                            }}
                        />
                        {#if !plan.id}
                        <TrashBinOutline
                            onclick={(e) => {
                                stop(e);
                                onDeleteButton(plan, i);
                            }}
                        ></TrashBinOutline>
                        {/if}
                        </TableBodyCell
                    >
                </TableBodyRow>
                {#if openRow === i}
                    <TableBodyRow
                        onclick={() => {
                            details = plan;
                        }}
                    >
                        <TableBodyCell colspan={HEADERS.length} class="p-0">
                            <PlanEdit {plan} {updatePlan} />
                        </TableBodyCell>
                    </TableBodyRow>
                {/if}
            {/each}
        </TableBody>
    </Table>
{/if}

<Modal bind:open={openEditEventModal} size="xs" permanent>
    <div class="flex flex-col items-center text-center">
        <!-- Icono de advertencia -->
        <div class="p-2 bg-yellow-100 rounded-full">
            <CircleAlert size={28} class="text-yellow-500" />
        </div>

        <!-- Texto -->
        <div class="mt-3 flex flex-col gap-2">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                ¿Deseas eliminar este plan?
            </h3>

            <p
                class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto"
            >
                Esta acción eliminará permanentemente este plan de la
                plataforma. No podrás deshacerlo.
                Los alumnos que tengan este plan seguirán viendo su información vigente, pero ya no podrán renovarlo nuevamente.
            </p>
        </div>

        <!-- Acciones -->
        <div class="flex flex-col sm:flex-row gap-2 mt-5 w-full">
            <Button class="w-full" color="red" onclick={() => onDeleteAccept()}>
                Eliminar registro
            </Button>

            <Button
                class="w-full"
                color="alternative"
                onclick={() => (openEditEventModal = false)}
            >
                Cancelar
            </Button>
        </div>
    </div>
</Modal>
