<script lang="ts">
  import { Card, Avatar, Button, Heading, Label, Input } from "flowbite-svelte";
  import {
    ArrowLeftOutline,
    LockOutline,
    TrashBinOutline,
  } from "flowbite-svelte-icons";
</script>

<div class="grid grid-cols-2 gap-4 mb-5">
  <Heading tag="h3">Ingreso</Heading>
</div>

<div class="flex items-center justify-center">
  <Card class="p-4 sm:p-5 md:p-7" size="lg">
    <div class="flex justify-end">
      <Button pill={true} outline={true} class="p-2!" size="xl">
        <LockOutline class="text-primary-700 h-6 w-6" />
      </Button>
    </div>
    <div class="flex flex-col items-center pb-4">
      <Avatar size="lg" src="/images/profile-picture-3.webp" />
      <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
        ¡Bienvenido!
      </h5>
    </div>
    <form>
      <Label class="space-y-2">
        <div>Ingresa tu código:</div>
        <Input type="text" placeholder="Ej. 0001" size="lg" />
      </Label>

      <div class="md:grid-cols-2 flex items-center justify-center pt-7">
        <Button size="xl" outline>1</Button>
        <Button size="xl" outline>2</Button>
        <Button size="xl" outline>3</Button>
      </div>

      <div class="md:grid-cols-2 flex items-center justify-center">
        <Button size="xl" outline>4</Button>
        <Button size="xl" outline>5</Button>
        <Button size="xl" outline>6</Button>
      </div>

      <div class="md:grid-cols-2 flex items-center justify-center">
        <Button size="xl" outline>7</Button>
        <Button size="xl" outline>8</Button>
        <Button size="xl" outline>9</Button>
      </div>

      <div class="md:grid-cols-2 flex items-center justify-center">
        <Button size="xl" outline><TrashBinOutline /></Button>
        <Button size="xl" outline>0</Button>
        <Button size="xl" outline><ArrowLeftOutline /></Button>
      </div>

      <div class="mt-4 flex space-y-2 lg:mt-6 rtl:space-x-reverse">
        <Button size="xl" type="submit">Registrar ingreso</Button>
      </div>
    </form>
  </Card>
</div>
