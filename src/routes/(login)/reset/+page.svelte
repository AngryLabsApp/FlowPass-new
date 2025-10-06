<script lang="ts">
  import { onMount } from "svelte";
  import { Card, Label, Input, Button, Alert } from "flowbite-svelte";
  import { EyeOutline, EyeSlashOutline } from "flowbite-svelte-icons";
  import { createClient, type SupabaseClient } from "@supabase/supabase-js";
  import LOGO from "$lib/assets/logo-flowpass.svg";
  import PartyICON from "$lib/assets/party.webp";

  // === TUS CONSTANTES (puedes moverlas a variables de entorno) ===
  const BD_PUBLIC_URL = "https://nujwzmwnptrsqojdjyjl.supabase.co";
  const BD_API_PUBLIC = "sb_publishable_xoykhydSmDArWUQydl_oLw_Ho0g1C64";

  let supabase: SupabaseClient | null = null;

  // UI state
  let loading = $state(true);              // "Validando enlace…"
  let formVisible = $state(false);         // mostrar/ocultar formulario
  let error_message = $state("");          // alert rojo (enlace inválido u otros errores)
  let msg =  $state("");                         // mensaje inferior ("Coinciden", "No coinciden", etc.)
  let msgClass: "ok" | "error" | "" = $state("");   ; // estilo para msg
  let submitting =  $state(false);  
  let success = $state(false);   

  // Campos
  let password = $state("");  
  let confirm = $state("");  

  // Toggles
  let showPassword = $state(false); 
  let showConfirm = $state(false); 

  // “Usuario verificado” (si viene email en la sesión)
  let verifiedEmail: string | null =  $state(null);

  // Refs a inputs para focus
  let passEl = $state() as HTMLInputElement;
  let confEl = $state() as HTMLInputElement;

  // Link de login (si tienes un global LOGIN_PATH puedes leerlo en onMount)
  let loginHref = "/login";

  const MIN = 8;

  function updateValidationMessage() {
    const p1 = password;
    const p2 = confirm;

    if (!p1 && !p2) { msg = ""; msgClass = ""; return; }
    if (!p2) { msg = ""; msgClass = ""; return; }

    if (p1 === p2) {
      msg = "Coinciden";
      msgClass = "ok";
    } else {
      msg = "Las contraseñas no coinciden.";
      msgClass = "error";
    }
  }

  function togglePass() { showPassword = !showPassword; }
  function toggleConfirm() { showConfirm = !showConfirm; }

  // === Bootstrap de sesión (port del vanilla) ===
  async function bootstrapSession() {
    if (!supabase) throw new Error("Supabase no inicializado.");

    const qs = new URLSearchParams(location.search);
    const hash = new URLSearchParams(location.hash.slice(1));

    const code = qs.get("code");
    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      return data.session;
    }

    if (access_token && refresh_token) {
      const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) throw error;
      return data.session;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session) return session;

    throw new Error("El enlace no contiene credenciales válidas (code o access/refresh token). Solicita otro correo de recuperación.");
  }

  onMount(async () => {
    // Crea el cliente una vez en cliente
    supabase = createClient(BD_PUBLIC_URL, BD_API_PUBLIC);

    // Si tienes un global LOGIN_PATH en una etiqueta <script> inline:
    // @ts-ignore
    if (typeof window !== "undefined" && (window as any).LOGIN_PATH) {
      // @ts-ignore
      loginHref = (window as any).LOGIN_PATH || "/login";
    }

    try {
      const session = await bootstrapSession();
      verifiedEmail = session?.user?.email ?? null;

      // Mostrar formulario ya validado
      formVisible = true;
      error_message = "";
      // focus al password
      setTimeout(() => passEl?.focus(), 0);
    } catch (err: any) {
      error_message = err?.message || "No pudimos validar el enlace. Pide otro desde 'Olvidé mi contraseña'.";
      formVisible = false;
    } finally {
      loading = false;
    }
  });

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!supabase) return;

    msg = ""; msgClass = "";

    const p1 = password;
    const p2 = confirm;

    if (!p1 || p1.length < MIN) {
      msg = `La contraseña debe tener al menos ${MIN} caracteres.`;
      msgClass = "error";
      return;
    }
    if (p1 !== p2) {
      msg = "Las contraseñas no coinciden.";
      msgClass = "error";
      return;
    }

    submitting = true;
    try {
      const { error } = await supabase.auth.updateUser({ password: p1 });
      if (error) throw error;

      msg = "Contraseña actualizada ✅";
      msgClass = "ok";
      formVisible = false;
      success = true;
    } catch (err: any) {
      msg = err?.message || "No pudimos actualizar la contraseña.";
      msgClass = "error";
    } finally {
      submitting = false;
    }
  }
</script>

<Card class="p-4 sm:p-6 md:p-8 max-w-md mx-auto" size="md">
  <!-- Header -->
  <header class="text-center mb-6">
    <a href="/" class="flex items-center justify-center gap-2 text-xl font-bold text-gray-800">
      <img src={LOGO} alt="FlowPass" class="h-8 w-8" />
      <span>FlowPass</span>
    </a>
    <h1 class="text-2xl font-semibold mt-4">Restablecer contraseña</h1>
  </header>

  <!-- Step / Estado superior -->
  {#if loading}
    <div class="text-sm text-gray-500 mb-4 text-center">Validando enlace…</div>
  {:else}
    {#if verifiedEmail}
      <div class="text-sm text-gray-700 mb-4 text-center">
        Usuario verificado:
        <span class="text-rose-600 font-medium">{verifiedEmail}</span>.
      </div>
    {/if}
  {/if}

  {#if error_message}
    <Alert color="red" class="mb-4">
      <div class="flex items-start gap-2">
        <span class="font-medium">Ups!</span>
        <span class="flex-1">{error_message}</span>
      </div>
    </Alert>
  {/if}

  <!-- Formulario -->
  {#if formVisible}
    <form class="flex flex-col gap-4" on:submit={onSubmit} novalidate>
      <div>
        <Label for="password" class="mb-1">Nueva contraseña</Label>
        <div class="relative">
          <Input
            id="password"
            name="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Nueva contraseña"
            bind:value={password}
            minlength={MIN}
            required
            autocomplete="new-password"
            spellcheck="false"
            class="pr-10"
            bind:elementRef={passEl}
            onInput={updateValidationMessage}
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            on:click={togglePass}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
          >
            {#if showPassword}
              <EyeSlashOutline class="w-5 h-5" />
            {:else}
              <EyeOutline class="w-5 h-5" />
            {/if}
          </button>
        </div>
        <small class="text-gray-400 text-xs">Mínimo {MIN} caracteres.</small>
      </div>

      <div>
        <Label for="confirm" class="mb-1">Confirmar contraseña</Label>
        <div class="relative">
          <Input
            id="confirm"
            name="confirm-password"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirma la contraseña"
            bind:value={confirm}
            minlength={MIN}
            required
            autocomplete="new-password"
            spellcheck="false"
            class="pr-10"
            bind:elementRef={confEl}
            onInput={updateValidationMessage}
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            on:click={toggleConfirm}
            aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
            aria-pressed={showConfirm}
          >
            {#if showConfirm}
              <EyeSlashOutline class="w-5 h-5" />
            {:else}
              <EyeOutline class="w-5 h-5" />
            {/if}
          </button>
        </div>
      </div>

      <!-- Mensaje inferior (igual que tu #msg del HTML) -->
      {#if msg}
        <div class="text-sm mt-1 {msgClass === 'ok' ? 'text-green-600' : msgClass === 'error' ? 'text-rose-600' : 'text-gray-500'}">
          {msg}
        </div>
      {/if}

      <Button color="blue" size="lg" class="mt-2 w-full" type="submit" disabled={submitting}>
        {#if submitting}Guardando…{:else}Guardar contraseña{/if}
      </Button>
    </form>
  {/if}

  <!-- Éxito: party.webp + texto + botón -->
  {#if success}
    <section class="mt-4">
      <div class="flex flex-col items-center">
        <img
          src={PartyICON}
          alt="Contraseña restablecida"
          width="150"
          height="150"
          decoding="async"
          class="block my-2"
        />
        <div class="text-center text-gray-700">
          {#if verifiedEmail}
            La contraseña del usuario <strong>{verifiedEmail}</strong> ha sido restablecida exitosamente.
          {:else}
            La contraseña ha sido restablecida exitosamente.
          {/if}
        </div>
        <a href={loginHref} class="mt-4 w-full">
          <Button color="pink" class="w-full">Ir a la plataforma</Button>
        </a>
      </div>
    </section>
  {/if}
</Card>
