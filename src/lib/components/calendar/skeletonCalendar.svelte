<script lang="ts">
  import { Skeleton } from "flowbite-svelte";
</script>

<!-- Contenedor principal del calendario -->
<div class="w-full p-4 animate-pulse">
  <!-- Barra superior (selector mes, botones, etc.) -->
  <div class="flex items-center justify-between mb-4">
    <Skeleton size="md" class="w-40 h-6 rounded-md" />
    <div class="flex gap-2">
      <Skeleton size="sm" class="w-8 h-8 rounded-md" />
      <Skeleton size="sm" class="w-8 h-8 rounded-md" />
    </div>
  </div>

  <!-- Grid del calendario -->
  <div class="grid grid-cols-7 gap-2">
    {#each Array(35) as _} <!-- 5 semanas × 7 días -->
      <Skeleton
        size="lg"
        class="h-20 rounded-lg"
      />
    {/each}
  </div>
</div>
