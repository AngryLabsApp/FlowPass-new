<script lang="ts">
  import Loader from "$lib/components/loader/loader.svelte";
  import IngresoModal from "$lib/components/modal/ingreso_modal.svelte";
  import { ingresoByCode } from "$lib/services/api/ingreso";
  import type { IngresoResponse, IngresoUser } from "$lib/types/ingresoResponse";
  import type { QueryParams } from "$lib/types/queryparams";
  import { fmtDate } from "$lib/utils/utils";
  import {
    Card,
    Avatar,
    Button,
    Heading,
    Label,
    Input,
    Alert,
  } from "flowbite-svelte";
  import {
    ArrowLeftOutline,
    LockOutline,
    TrashBinOutline,
  } from "flowbite-svelte-icons";

  let error_message = $state("");
  let openModal = $state(false);
  let code_value = $state("");
  let elementRef = $state() as HTMLInputElement;
  let loading = $state(false);
  let user_selected: IngresoUser = $state({} as IngresoUser);

  function buildNonActiveMsg(user: any) {
    const estado = String(user?.estado || "").trim();
    const estadoMostrar = estado || "desconocido";
    return `Tu suscripción está en estado ${estadoMostrar}. Por favor activa tu suscripción de nuevo.`;
  }

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

  const onSubmit = async (e: any) => {
    error_message = "";

    if (code_value && (code_value.length < 4 || code_value.length > 6)) {
      //condigo no existe
      showError("El código no existe.");
      onClean("all");
      elementRef?.focus();
      return;
    }
    const queryParams: QueryParams = { code: code_value };
    let user: IngresoUser = {} as IngresoUser;

    try {
      openModal= false;
      loading = true;
      const response: IngresoResponse = await ingresoByCode(queryParams);
      const ok = !response.error;
      user = response.user as IngresoUser;
      if (ok) {
        const estado = String(user?.estado || "")
          .trim()
          .toLowerCase();
        // Validación SIEMPRE: si no está activo, mostrar mensaje y no abrir modal
        if (user && estado && estado !== "activo") {
          const text = buildNonActiveMsg(user);
          showError(text);
          onClean("all");
          elementRef?.focus();
          return;
        }

     
        showIngresoModal();
        user_selected = user;

        onClean("all");
        elementRef?.focus();
      } else {
        throw new Error(response.reason);
      }
      onClean("all");
      elementRef?.focus();
    } catch (error: any) {
      console.log(error.message);
      let message = error.message;
      let text = "El código no existe.";

      // Prioriza errores por estado cuando el backend responde error
      const estado = String(user?.estado || "")
        .trim()
        .toLowerCase();
      if (user && estado && estado !== "activo") {
        text = buildNonActiveMsg(user);
      } else {
        // Si el estado es activo (o desconocido), cae a razones específicas
        switch (message) {
          case "PLAN_VENCIDO":
            console.log("entro");
            text = `El plan de ${user?.nombre || ""} ${
              user?.apellidos || ""
            } venció el ${fmtDate(user?.proxima_fecha_pago as string)}.`.trim();
            break;
          case "LIMITE_CLASES_SUPERADO":
            text = `Has usado todas tus clases disponibles (${user?.clases_tomadas} de ${user?.limite_clases}).`;
            break;
          default:
            // deja el mensaje por defecto si no matchea
            break;
        }
      }
      showError(text);
      onClean("all");
      elementRef?.focus();
    } finally {
      loading = false;
    }
  };


  function showError(message: string, duration = 3000) {
    error_message = message;

    // limpiar cualquier timeout previo
    clearTimeout((showError as any).timeout);
    (showError as any).timeout = setTimeout(() => {
      error_message = "";
    }, duration);
  }

  function showIngresoModal(duration = 5000) {
    openModal = true;
    
    // limpiar cualquier timeout previo
    clearTimeout((showIngresoModal as any).timeout);
    (showIngresoModal as any).timeout = setTimeout(() => {
      //openModal = false;
    }, duration);
  }
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
      <Avatar size="lg" src="src/lib/assets/push-ups.webp" />
      <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
        ¡Bienvenido!
      </h5>
    </div>
    <form onsubmit={(e) => onSubmit(e)}>
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
            if (e.key === "Delete") {
              onClean("all");
            }
          }}
        />
      </Label>
      {#if error_message && error_message.length > 0}
        <Alert color="red" class="mt-2">
          <span class="font-medium">Ups!</span>
          {error_message}
        </Alert>
      {/if}
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
        <Button size="xl" type="submit" disabled={code_value.length <= 0}>Registrar ingreso</Button>
      </div>
    </form>
  </Card>
</div>
<IngresoModal bind:openModal user={user_selected}></IngresoModal>
<Loader bind:openModal={loading} title={"Registrando ingreso"}></Loader>
