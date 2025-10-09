<script lang="ts">
    import type { ToastInterface } from "$lib/types/toast";
    import { Toast } from "flowbite-svelte";
    import {
        CheckCircleSolid,
        FireOutline,
    } from "flowbite-svelte-icons";

    let {
        toast = $bindable({
            type: "error",
            text: "asdasdasd",
            show: true,
        }),
    } = $props<{
        toast: ToastInterface;
    }>();
</script>

{#if toast.type == "success"}
    <Toast color="green" bind:toastStatus={toast.show}>
        {#snippet icon()}
            <CheckCircleSolid class="h-5 w-5" />
            <span class="sr-only">Check icon</span>
        {/snippet}
        {toast.text}
    </Toast>
{/if}
{#if toast.type == "error"}
    <Toast
        bind:toastStatus={toast.show}
        color={undefined}
        class="bg-pink-100 text-pink-500 dark:bg-pink-800 dark:text-pink-200"
    >
        {#snippet icon()}
            <FireOutline class="h-6 w-6" />
        {/snippet}
        {toast.text}
    </Toast>
{/if}
