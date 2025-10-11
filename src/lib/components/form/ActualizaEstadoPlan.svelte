<script lang="ts">
  import {
    Button,
    Card,
    Label,
    Input,
    Select,
  } from "flowbite-svelte";
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form class="flex flex-col space-y-6" action="/">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Estado del Plan
    </h3>
    <Label class="space-y-2">
      <span>Estado</span>
      <Select size="md" items={[]} placeholder="Selecciona..." onchange={() => {}} required />
    </Label>

    <Label class="space-y-2">
      <span>Agregar días extra</span>
      <Input type="number" name="dias_extra" placeholder="0" required />
    </Label>

    

    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
