<script lang="ts">
  import { Modal } from "flowbite-svelte";
  let { openModal = $bindable(false) } = $props<{
    openModal: boolean;
    }>();

</script>

<Modal open={openModal} placement={"center"}>
  <figure class="flex flex-col items-center justify-center rounded-t-lg  bg-white p-8 text-center md:rounded-t-none md:rounded-tl-lg  dark:border-gray-700 dark:bg-gray-800">
    <blockquote class="mx-auto mb-4 max-w-2xl text-gray-500 dark:text-gray-400">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Very easy this was to integrate</h3>
      <p class="my-4 font-light">If you care for your time, I hands down would go with this."</p>
    </blockquote>
    <figcaption class="flex items-center justify-center space-x-3 rtl:space-x-reverse">
      <img class="h-9 w-9 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png" alt="Karen profile" />
      <div class="space-y-0.5 text-left font-medium dark:text-white">
        <div>Bonnie Green</div>
        <div class="text-sm font-light text-gray-500 dark:text-gray-400">Developer at Open AI</div>
      </div>
    </figcaption>
  </figure>

</Modal>