<script lang="ts">
  import { Card, Avatar, Button, Heading, Label, Input } from "flowbite-svelte";
  import {
    ArrowLeftOutline,
    LockOutline,
    TrashBinOutline,
  } from "flowbite-svelte-icons";

  let code_value = $state("");
  let elementRef = $state() as HTMLInputElement;
  const onClickPad = (value: string) => {
    if (/^\d$/.test(value)) {
      code_value += value;
    }
  };

  const onClean = (type: "all" | "single") => {
    if (type == "all") {
      code_value = "";
    }
    if (type == "single") {
      code_value = code_value.slice(0, -1);
    }
  };

  const onInput = (e: any) => {
    const input = e.currentTarget as HTMLInputElement;
    const value = input.value;

    const sanitized = value
      .split("")
      .filter((ch) => /^\d$/.test(ch)) // sólo deja pasar dígitos (tu validación)
      .join("")
      .slice(0, 15); // límite de longitud

    // si cambia, lo forzamos visualmente en el input
    if (sanitized !== value) {
      input.value = sanitized;
    }

    code_value = sanitized;
  };
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
        <Input
          bind:elementRef
          type="text"
          placeholder="Ej. 0001"
          size="lg"
          bind:value={code_value}
          oninput={(e) => onInput(e)}
          onkeydown={(e) => {
            if (e.key === "Enter") {
              console.log("Enter pressed");
            }

            if (e.key === "Delete") {
              onClean("all");
            }
          }}
        />
      </Label>

      <div class="md:grid-cols-2 flex items-center justify-center pt-7">
        <Button size="xl" outline onclick={() => onClickPad("1")}>1</Button>
        <Button size="xl" outline onclick={() => onClickPad("2")}>2</Button>
        <Button size="xl" outline onclick={() => onClickPad("3")}>3</Button>
      </div>

      <div class="md:grid-cols-2 flex items-center justify-center">
        <Button size="xl" outline onclick={() => onClickPad("4")}>4</Button>
        <Button size="xl" outline onclick={() => onClickPad("5")}>5</Button>
        <Button size="xl" outline onclick={() => onClickPad("6")}>6</Button>
      </div>

      <div class="md:grid-cols-2 flex items-center justify-center">
        <Button size="xl" outline onclick={() => onClickPad("7")}>7</Button>
        <Button size="xl" outline onclick={() => onClickPad("8")}>8</Button>
        <Button size="xl" outline onclick={() => onClickPad("9")}>9</Button>
      </div>

      <div class="md:grid-cols-2 flex items-center justify-center">
        <Button size="xl" outline onclick={() => onClean("all")}
          ><TrashBinOutline /></Button
        >
        <Button size="xl" outline onclick={() => onClickPad("0")}>0</Button>
        <Button size="xl" outline onclick={() => onClean("single")}
          ><ArrowLeftOutline /></Button
        >
      </div>

      <div class="mt-4 flex space-y-2 lg:mt-6 rtl:space-x-reverse">
        <Button size="xl" type="submit">Registrar ingreso</Button>
      </div>
    </form>
  </Card>
</div>
