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
      Renovar Plan
    </h3>
    <Label class="space-y-2">
      <span>Plan</span>
      <Select size="md" items={[]} placeholder="Selecciona..." onchange={() => {}} required />
    </Label>

    <Label class="space-y-2">
      <span>Monto de pago</span>
      <Input type="number" name="monto" placeholder="0.0" required />
    </Label>

    <Label class="space-y-2">
      <span>Días de gracia</span>
      <Input type="number" name="dias_gracia" placeholder="0" />
    </Label>

    <Label class="space-y-2">
      <span>Método de pago</span>
      <Select size="md" items={[]} placeholder="Selecciona..." onchange={() => {}} />
    </Label>
    <Label class="space-y-2">
      <span>Estado de pago</span>
      <Select
        size="md"
        items={[]}
        placeholder="Selecciona..."
        onchange={() => {}}
        required
      />
    </Label>

    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
