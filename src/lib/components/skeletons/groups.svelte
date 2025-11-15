<script lang="ts">
    import { Skeleton } from "flowbite-svelte";
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each Array(9) as _}
        <div
            class="bg-white rounded-2xl shadow-sm p-4 h-[100px] flex items-center justify-between overflow-hidden"
        >
            <!-- IZQUIERDA -->
            <div class="flex items-center gap-4">
                <!-- Avatar fijo -->
                <Skeleton class="w-12 h-12 rounded-full" />

                <!-- Textos -->
                <div class="flex flex-col gap-2">
                    <Skeleton class="h-4 w-28 rounded-md" />
                    <Skeleton class="h-3 w-20 rounded-md" />
                </div>
            </div>
        </div>
    {/each}
</div>
