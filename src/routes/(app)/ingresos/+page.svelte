<script lang="ts">
  import Loader from "$lib/components/loader/loader.svelte";
  import Image_GYM from "$lib/assets/push-ups.webp";
  import Image_Salsa from "$lib/assets/salsa.webp";
  import IngresoModal from "$lib/components/modal/ingreso_modal.svelte";
  import { ingresoByCode } from "$lib/services/api/ingreso";
  import type {
    IngresoResponse,
    IngresoUser,
  } from "$lib/types/ingresoResponse";
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
    LockOpenOutline,
  } from "flowbite-svelte-icons";
  import { getContext, tick } from "svelte";
  import type { Writable } from "svelte/store";
  import { getCustomEnv } from "$lib/utils/env_utils";

  const lock = getContext<Writable<boolean>>("lock");
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
    focusInputSafely();
  };

  const onClean = (type: "all" | "single") => {
    if (type == "all") {
      code_value = "";
    }
    if (type == "single") {
      code_value = code_value.slice(0, -1);
    }
    focusInputSafely();
  };

  $effect(() => {
    if (!loading && !openModal) {
      focusInputSafely();
    }
  });

  async function focusInputSafely() {
    await tick();
    elementRef.focus({ preventScroll: true });
    requestAnimationFrame(() =>
      setTimeout(() => {
        elementRef.focus({ preventScroll: true });
      }, 200)
    );
  }

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
    e.preventDefault();

    error_message = "";

    if (code_value && (code_value.length < 4 || code_value.length > 6)) {
      //condigo no existe
      showError("El código no existe.");
      onClean("all");
      return;
    }
    const queryParams: QueryParams = { code: code_value };
    let user: IngresoUser = {} as IngresoUser;

    try {
      openModal = false;
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
          return;
        }

        showIngresoModal();
        user_selected = user;

        onClean("all");
      } else {
        throw new Error(response.reason);
      }
      onClean("all");
    } catch (error: any) {
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

  function showIngresoModal(duration = 4000) {
    openModal = true;

    // limpiar cualquier timeout previo
    clearTimeout((showIngresoModal as any).timeout);
    (showIngresoModal as any).timeout = setTimeout(async () => {
      openModal = false;
    }, duration);
  }

  function togleLock() {
    lock.update((v) => !v);
    focusInputSafely();
  }

  const btn_class = "w-full g-3 sm:g-5 h-15 sm:h-17 text-xl";
  const Image =
    getCustomEnv("business_type") == "salsa" ? Image_Salsa : Image_GYM;
</script>

<div class="p-4">
  <div class="grid grid-cols-2 gap-4 mb-5">
    <Heading tag="h3">Ingreso</Heading>
  </div>

  <div class="p-0 sm:px-8 flex items-center justify-center">
    <Card class="w-100 px-4 py-2 sm:px-8 sm:py-4 transition-colors duration-500 ease-in-out {error_message && error_message.length > 0 ? "bg-red-100" :""}" size="lg">
      <div class="flex justify-end">
        <Button
          pill={true}
          outline={true}
          class="p-2!"
          onclick={() => togleLock()}
          color="secondary"
        >
          {#if $lock}
            <LockOutline class="text-secondary-700 h-6 w-6" />
          {:else}
            <LockOpenOutline class="text-secondary-700 h-6 w-6" />
          {/if}
        </Button>
      </div>
      <div class="flex flex-col items-center pb-4">
        <Avatar size="lg" src={Image} />
        <h5 class="mb-1 text-md sm:text-xl font-medium text-gray-900 dark:text-white">
          ¡Bienvenido!
        </h5>
      </div>
      <form onsubmit={(e) => onSubmit(e)}>
        <Label class="space-y-2 text-md sm:text-xl">
          <div>Ingresa tu código:</div>
          <Input
            bind:elementRef
            type="text"
            placeholder="Ej. 0001"
            class="h-12 sm:h-17 text-xl sm:text-2xl text-center"
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
          <Alert color="red" class="bg-red-200 mt-2 h-auto text-xl text-center">
            <span class="font-medium">Ups!</span>
            {error_message}
          </Alert>
        {/if}
        <div class="flex flex-col space-y-2">
          <div
            class="md:grid-cols-2 flex items-center justify-center pt-7 gap-2"
          >
            {#each ["1", "2", "3"] as str_number}
              <Button
                class={btn_class}
                size="xl"
                outline
                onclick={() => onClickPad(str_number)}
                color="secondary">{str_number}</Button
              >
            {/each}
          </div>

          <div class="md:grid-cols-2 flex items-center justify-center gap-2">
            {#each ["4", "5", "6"] as str_number}
              <Button
                class={btn_class}
                size="xl"
                outline
                onclick={() => onClickPad(str_number)}
                color="secondary">{str_number}</Button
              >
            {/each}
          </div>

          <div class="md:grid-cols-2 flex items-center justify-center gap-2">
            {#each ["7", "8", "9"] as str_number}
              <Button
                class={btn_class}
                size="xl"
                outline
                onclick={() => onClickPad(str_number)}
                color="secondary">{str_number}</Button
              >
            {/each}
          </div>

          <div class="md:grid-cols-2 flex items-center justify-center gap-2">
            <Button
              class={btn_class}
              size="xl"
              outline
              onclick={() => onClean("all")}
              color="secondary"><TrashBinOutline /></Button
            >
            <Button
              class={btn_class}
              size="xl"
              outline
              onclick={() => onClickPad("0")}
              color="secondary">0</Button
            >
            <Button
              class={btn_class}
              size="xl"
              outline
              onclick={() => onClean("single")}
              color="secondary"><ArrowLeftOutline /></Button
            >
          </div>
        </div>
        <div class="mt-4 flex space-y-2 lg:mt-6 rtl:space-x-reverse">
          <Button
            size="xl"
            type="submit"
            disabled={code_value.length <= 0}
            class="w-full h-17 text-xl">Registrar ingreso</Button
          >
        </div>
      </form>
    </Card>
  </div>
  <IngresoModal bind:openModal user={user_selected}></IngresoModal>
  <Loader bind:openModal={loading} title={"Registrando ingreso"}></Loader>
</div>
