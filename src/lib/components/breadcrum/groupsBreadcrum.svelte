<script lang="ts">
    import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
    import { Users } from "@lucide/svelte";

    // Props recibidos desde el padre
    let { groupName = "Nombre del grupo", maxItems = 2, setLevel } = $props();

    let breadcrumb = $derived([
        { label: "Lista de Grupos", icon: Users },
        { label: `Info detallada del grupo ${groupName}` },
    ]);
</script>

<Breadcrumb aria-label="Ruta de navegación de grupos" class="px-0 py-0">
    {#each breadcrumb.slice(0, maxItems) as item, i}
        <BreadcrumbItem home={i === 0} onclick={()=>{setLevel(i+1)}}>
            {#if item.icon}
                {#snippet icon()}
                    <item.icon class="me-2 h-4 w-4" />
                {/snippet}
            {/if}

            {item.label}
        </BreadcrumbItem>
    {/each}
</Breadcrumb>
