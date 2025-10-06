<script lang="ts">
  import { Card, Label, Input, Button, Alert, Spinner } from "flowbite-svelte";
  import {
    loginWithEmail,
    sendResetPasswordEmail,
  } from "$lib/services/supabase/auth";

  let email = "";
  let password = "";
  let loading = false;
  let msg = "";
  let msgType: "success" | "error" | "" = "";

  async function onSubmit(e: Event) {
    e.preventDefault();
    msg = "";
    msgType = "";
    loading = true;
    try {
      await loginWithEmail(email.trim().toLowerCase(), password);
      // Si tu helper hace goto('/alumnos'), no hace falta setear success aquí.
      msg = "✅ Sesión iniciada";
      msgType = "success";
    } catch (err: any) {
      msg = err?.message ?? "No pudimos iniciar sesión.";
      msgType = "error";
    } finally {
      loading = false;
    }
  }

  async function onForgot() {
    const value = prompt("Escribe tu correo para restablecer contraseña:");
    if (!value) return;
    try {
      msg = "Enviando correo…";
      msgType = "";
      msg = await sendResetPasswordEmail(value.trim().toLowerCase());
      msgType = "success";
    } catch (err: any) {
      msg = err?.message ?? "No se pudo enviar el correo.";
      msgType = "error";
    }
  }
</script>

<Card class="w-full max-w-md p-4 sm:p-6 md:p-8">
  <form class="flex flex-col space-y-6" on:submit={onSubmit} novalidate>
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Acceso al panel
    </h3>

    {#if msg}
      <Alert color={msgType === "error" ? "red" : "green"} class="text-sm">
        {msg}
      </Alert>
    {/if}

    <Label class="space-y-2">
      <span>Correo</span>
      <Input
        type="email"
        name="email"
        placeholder="name@company.com"
        required
        bind:value={email}
        class="focus:ring-2 focus:ring-emerald-200"
      />
    </Label>

    <Label class="space-y-2">
      <span>Contraseña</span>
      <Input
        type="password"
        name="password"
        placeholder="•••••"
        required
        bind:value={password}
        class="focus:ring-2 focus:ring-emerald-200"
      />
    </Label>

    <div class="flex items-start">
      <button
        type="button"
        class="ms-auto text-sm text-primary-700 dark:text-primary-500 hover:underline"
        on:click={onForgot}
      >
        ¿Olvidaste tu contraseña?
      </button>
    </div>

    <Button type="submit" class="w-full" disabled={loading}>
      {#if loading}
        <span class="inline-flex items-center gap-2">
          <Spinner size="4" />
          Entrando…
        </span>
      {:else}
        Entrar
      {/if}
    </Button>
  </form>
</Card>
