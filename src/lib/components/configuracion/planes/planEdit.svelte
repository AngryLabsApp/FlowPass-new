<script lang="ts">
    import type { Plan } from "$lib/types/planes";
    import { Label, Input, Checkbox, Button, Toggle } from "flowbite-svelte";
    import { slide } from "svelte/transition";

    let { plan, updatePlan }: { plan: Plan; updatePlan: (plan: Plan) => void } =
        $props();
    // estado local reactivo
    let localPlan = $state({
        ...plan,
    });

    const onSave = async () => {
        await updatePlan(localPlan);
    };
</script>

<div class="px-2 py-3" transition:slide={{ duration: 300, axis: "y" }}>
    <div class="mb-6 grid gap-6 md:grid-cols-3">
        <div>
            <Label for="nombre" class="mb-2">Nombre del Plan</Label>
            <Input
                type="text"
                id="nombre"
                placeholder=""
                bind:value={localPlan.label}
                required
            />
        </div>
        <div>
            <Label for="costo" class="mb-2">Costo</Label>
            <Input
                type="number"
                id="costo"
                placeholder="0"
                required
                bind:value={localPlan.amount}
            />
        </div>
        <div>
            <Label for="costo" class="mb-2">Prioridad</Label>
            <Input
                type="number"
                id="costo"
                placeholder="0"
                required
                bind:value={localPlan.order}
            />
        </div>
    </div>
    <div class="mb-6 grid gap-6 md:grid-cols-4">
        <div>
            <Label for="duracion" class="mb-2">Duración (días)</Label>
            <Toggle color="red" bind:checked={localPlan.neverExpires}
                >No expira</Toggle
            >
        </div>
        {#if !localPlan.neverExpires}
            <div>
                <Label for="duracion" class="mb-2">Duración (días)</Label>
                <Input
                    type="number"
                    id="duracion"
                    placeholder="0"
                    required
                    bind:value={localPlan.dias_mes}
                />
            </div>
        {/if}
    </div>
    <div class="mb-6 grid gap-6 md:grid-cols-4">
        <div>
            <Label for="duracion" class="mb-2">Límite de accesos</Label>
            <Toggle color="red" bind:checked={localPlan.ilimitado}
                >Sin limite</Toggle
            >
        </div>
        {#if !localPlan.ilimitado}
            <div>
                <Label for="duracion" class="mb-2">Límite de accesos</Label>
                <Input
                    type="number"
                    id="limite_accesos"
                    placeholder="0"
                    required
                    bind:value={localPlan.limite_clases}
                />
            </div>
        {/if}
    </div>
    <div class="mb-6 grid gap-6 md:grid-cols-4">
        <div>
            <Label for="duracion" class="mb-2">¿Permite parejas?</Label>
            <Toggle color="red" bind:checked={localPlan.partners}></Toggle>
        </div>
    </div>
    <Button onclick={() => onSave()}>Actualizar</Button>
</div>
