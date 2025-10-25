<script lang="ts">
  import type { FormProps } from "$lib/catalog/form_component_catalog";
  import { getIngresos } from "$lib/services/api/ingreso";
  import type { GetIngresosResponse } from "$lib/types/ingresoResponse";
  import type { QueryParams } from "$lib/types/queryparams";

  import {
    Button,
    Card,
    Label,
    Input,
    Select,
    Listgroup,
    ListgroupItem,
    ListPlaceholder,
  } from "flowbite-svelte";
  import { onMount } from "svelte";

  let { user, setLoadingModal, setToast, closeForm }: FormProps = $props();
  let loading = $state(false);

  let currentAbort: AbortController | null = null;
  let ingresos: GetIngresosResponse = $state({ ingresos: [], total: 0 });

  onMount(async () => {
    currentAbort?.abort();
    const abort = new AbortController();
    currentAbort = abort;

    console.log("Componente montado, user:", user);
    const query_params: QueryParams = {
      id: user.id,
      size: 10,
      page: 1,
      field1:"pago_id",
      value1: user.pago_id?.toString() || "",
    };
    try {
      loading = true;
      const data = await getIngresos(abort, query_params);
      if (currentAbort !== abort) return;
      ingresos = data;
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      if (currentAbort === abort) loading = false;
    }
  });
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <h3 class="text-xl font-medium text-gray-900 dark:text-white">
    Ultimos ingresos
  </h3>

  {#if loading}
    <ListPlaceholder />
  {:else}
    {#if ingresos.total > 0}
      <Listgroup active class="w-48">
      {#each ingresos.ingresos as ingreso}
        <ListgroupItem class="gap-2 text-base font-semibold">
          {new Date(ingreso.created_at).toLocaleDateString()}
        </ListgroupItem>
     {/each}
    </Listgroup>
      {:else}
        <p class="text-gray-500 mt-4">No se encontraron ingresos recientes.</p>
    {/if}

      

    
  {/if}
</Card>
