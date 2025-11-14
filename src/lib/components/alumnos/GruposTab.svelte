<script lang="ts">
  import GroupModal from "$lib/components/modal/group_modal.svelte";
  import { Grid2X2Plus } from "@lucide/svelte";
  import { Button, Heading } from "flowbite-svelte";

  let openGroupModal = $state(false);

  const handleCreateGroup = () => {
    openGroupModal = true;
  };
</script>

<div class="flex flex-col gap-4">
  <div class="flex justify-between">
    <Heading tag="h3">Grupos de tus Alumnos</Heading>
    <div class="flex gap-4 items-center w-fit">
      <Button class="w-fit flex gap-2 items-center" onclick={()=>handleCreateGroup()}>
        Crear Grupo
        <Grid2X2Plus size={20} />
      </Button>
    </div>
  </div>
  <GroupModal bind:openModal={openGroupModal} />
</div>
