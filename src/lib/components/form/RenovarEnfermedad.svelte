<script lang="ts">
  import { Button, Card, Label, Textarea } from "flowbite-svelte";
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form class="flex flex-col space-y-6" action="/">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Enfermedad / Patología
    </h3>
    <Label class="space-y-2">
      <Textarea name="enfermedad" placeholder=""   class="w-full" required />
    </Label>

    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
