<script lang="ts">
  import { Button, Card, Label, Input, Select } from "flowbite-svelte";
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form class="flex flex-col space-y-6" action="/">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      DNI/Pasaporte/CE
    </h3>
    <Label class="space-y-2">
      <Input type="text" name="identificacion" placeholder="" required />
    </Label>

    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
