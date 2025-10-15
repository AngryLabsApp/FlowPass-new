<script lang="ts">
  import { Button, Modal, Spinner } from "flowbite-svelte";
  let { openModal = $bindable(false), title } = $props<{
    openModal: boolean;
    title: string;
  }>();
</script>

<Modal
  form
  bind:open={openModal}
  size="xs"
  permanent={true}
  dismissable={true}
  outsideclose={false}
  class=" text-center"
>
  <div class="flex flex-col items-center pb-4">
    <div
      class="mt-4 flex space-x-3 lg:mt-6 rtl:space-x-reverse text-center items-center"
    >
      <Spinner size="16" class="text-center" color="primary" />
      <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
        {title}
      </h5>
    </div>
  </div>
</Modal>
