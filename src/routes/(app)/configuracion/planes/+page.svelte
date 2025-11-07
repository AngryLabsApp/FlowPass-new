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
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
    import { onMount } from "svelte";
    import PlanEdit from "$lib/components/configuracion/planes/planEdit.svelte";
    import { EditOutline } from "flowbite-svelte-icons";
    import type { Column } from "$lib/types/column";
    import { UserRoundPlus } from "@lucide/svelte";
    let planes: Plan[] = $state([]);

    let openRow: number | null | undefined = $state();
    let details: Plan | undefined = $state();
    let isloading: boolean = $state(true);
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

    const addPlan = ()=>{
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
            order: currentSize+1
        };
        planes.unshift(newPlan);
        openRow = 0;
    }

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
</script>

<h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Planes</h1>
{#if isloading}
    <SkeletonTable rows={10} cellHeights="h-4" headers={HEADERS} />
{:else}
         <Button
            color="secondary"
            size="lg"
            onclick={()=>{addPlan()}}
            class="flex gap-2 items-center"
          >
            Nuevo
            <UserRoundPlus size="22" />
          </Button>
    <Table>
        <TableHead>
            {#each HEADERS as col}
                  <TableHeadCell>{col.header}</TableHeadCell>
            {/each}
        </TableHead>
        <TableBody>
            {#each planes as plan, i}
                <TableBodyRow onclick={() => toggleRow(i)}>
                    <TableBodyCell>{plan.label} 
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
                        /></TableBodyCell
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
