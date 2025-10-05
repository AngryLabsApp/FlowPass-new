<script lang="ts">
  import { Modal, Spinner } from "flowbite-svelte";
  let { openModal = $bindable(false), title  } = $props<{
    openModal: boolean;
    title: string;
  }>();
</script>

<Modal form title={title} bind:open={openModal} size="xs" permanent={true} dismissable={true} outsideclose={false}>
  <Spinner size="8" />
</Modal>
