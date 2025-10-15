<script lang="ts">
    import type { ToastInterface } from "$lib/types/toast";
    import { Toast } from "flowbite-svelte";
    import {
        CheckCircleSolid,
        ExclamationCircleSolid,
    } from "flowbite-svelte-icons";
    import { fly } from "svelte/transition";

    let {
        toast = $bindable({
            type: "success",
            text: "",
            show: false,
        }),
    } = $props<{
        toast: ToastInterface;
    }>();

    let counter = 6;
    function timeout() {
        if (--counter > 0) return setTimeout(timeout, 1000);
        toast.show = false;
    }
    $effect(() => {
        if (toast.show) {
            counter = 6;
            timeout();
        }
    });
</script>

{#if toast.type == "success"}
    <Toast
        color="green"
        bind:toastStatus={toast.show}
        position="top-right"
        transition={fly}
        params={{ x: 200 }}
        class="bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
    >
        {#snippet icon()}
            <CheckCircleSolid class="h-5 w-5 " />
            <span class="sr-only">Check icon</span>
        {/snippet}
        {toast.text}
    </Toast>
{/if}
{#if toast.type == "error"}
    <Toast
        transition={fly}
        params={{ x: 200 }}
        position="top-right"
        bind:toastStatus={toast.show}
        color={"red"}
        class="bg-pink-100 text-pink-500 dark:bg-pink-800 dark:text-pink-200"
    >
        {#snippet icon()}
            <ExclamationCircleSolid class="h-6 w-6" />
        {/snippet}
        {toast.text}
    </Toast>
{/if}
