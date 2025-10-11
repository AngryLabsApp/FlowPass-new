<script lang="ts">
  import {
    Button,
    Card,
    Label,
    Input,
  } from "flowbite-svelte";
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form class="flex flex-col space-y-6" action="/">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Clases
    </h3>
   
    <Label class="space-y-2">
      <span>Clases realizadas</span>
      <Input type="number" name="clases_realizadas" placeholder="0" required />
    </Label>

    <Label class="space-y-2">
      <span>Limite de clases</span>
      <Input type="number" name="limite_calses" placeholder="0" />
    </Label>

  

    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
