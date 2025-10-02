<script lang="ts">
  import { onMount } from 'svelte';
  import { loginWithEmail, redirectIfSession, sendResetPasswordEmail } from '$lib/services/supabase/auth';

  let email = '';
  let password = '';
  let showPassword = false;
  let loading = false;
  let message = '';

  onMount(() => { redirectIfSession(); });

  async function onSubmit(e: Event) {
    e.preventDefault();
    message = '';
    loading = true;
    try {
      await loginWithEmail(email.trim().toLowerCase(), password);
      // si todo ok, loginWithEmail hará goto('/alumnos')
    } catch (err: any) {
      message = `❌ ${err?.message ?? 'No pudimos iniciar sesión.'}`;
    } finally {
      loading = false;
    }
  }

  async function onReset() {
    const value = prompt('Escribe tu correo para restablecer contraseña:');
    if (!value) return;
    try {
      message = 'Enviando correo…';
      message = await sendResetPasswordEmail(value.trim().toLowerCase());
    } catch (err: any) {
      message = `❌ ${err?.message ?? 'No se pudo enviar el correo.'}`;
    }
  }

  function togglePassword() { showPassword = !showPassword; }
</script>

<main class="min-h-screen grid place-items-center bg-gray-50 px-4">
  <section class="w-full max-w-md rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6" aria-label="Acceso al panel">
    <header class="mb-6">
      <a href="/" class="flex items-center gap-3 text-gray-900 hover:opacity-90" aria-label="FlowPass">
        <span class="inline-grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
          <svg class="h-6 w-6" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M156.7 256H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h142.2c15.9 0 30.8 10.9 33.4 26.6 3.3 20-12.1 37.4-31.6 37.4-14.1 0-26.1-9.2-30.4-21.9-2.1-6.3-8.6-10.1-15.2-10.1H81.6c-9.8 0-17.7 8.8-15.9 18.4 8.6 44.1 47.6 77.6 94.2 77.6 57.1 0 102.7-50.1 95.2-108.6C249 291 205.4 256 156.7 256zM16 224h336c59.7 0 106.8-54.8 93.8-116.7-7.6-36.2-36.9-65.5-73.1-73.1-55.4-11.6-105.1 24.9-114.9 75.5-1.9 9.6 6.1 18.3 15.8 18.3h32.8c6.7 0 13.1-3.8 15.2-10.1C325.9 105.2 337.9 96 352 96c19.4 0 34.9 17.4 31.6 37.4-2.6 15.7-17.4 26.6-33.4 26.6H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16zm384 32H243.7c19.3 16.6 33.2 38.8 39.8 64H400c26.5 0 48 21.5 48 48s-21.5 48-48 48c-17.9 0-33.3-9.9-41.6-24.4-2.9-5-8.7-7.6-14.5-7.6h-33.8c-10.9 0-19 10.8-15.3 21.1 17.8 50.6 70.5 84.8 129.4 72.3 41.2-8.7 75.1-41.6 84.7-82.7C526 321.5 470.5 256 400 256z"/>
          </svg>
        </span>
        <span class="font-bold text-xl tracking-tight">FlowPass</span>
      </a>
      <h1 class="mt-4 text-2xl font-semibold text-gray-900">Acceso al panel</h1>
    </header>

    <form class="space-y-5" on:submit={onSubmit} novalidate id="login-form">
      <div>
        <label for="email" class="mb-1 block text-sm font-medium text-gray-700">Correo</label>
        <input id="email" type="email" placeholder="tu@email.com" bind:value={email}
               required class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200" />
      </div>

      <div>
        <label for="password" class="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
        <div class="relative">
          <input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" bind:value={password}
                 required class="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 outline-none focus:ring-2 focus:ring-emerald-200" />
          <button type="button" class="absolute inset-y-0 right-0 grid w-10 place-items-center text-gray-500 hover:text-gray-800"
                  on:click={togglePassword}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            {#if showPassword}
              <!-- ojo abierto -->
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3" stroke-width="2"/>
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke-width="2"/>
              </svg>
            {:else}
              <!-- ojo tachado -->
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M2 2l20 20" stroke-width="2"/>
                <path d="M22 12s-4-7-10-7S2 12 2 12a18.6 18.6 0 003.2 3.8" stroke-width="2"/>
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <div class="pt-1">
        <button id="submit" type="submit"
                class="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                disabled={loading}>
          {#if loading}
            <span class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {/if}
          Entrar
        </button>
      </div>

      <div id="msg" class="min-h-6 text-sm text-gray-700" role="status" aria-live="polite">{message}</div>

      <div class="pt-2 text-right">
        <button type="button" class="text-sm font-medium text-emerald-700 hover:underline" on:click={onReset} id="resetLink">
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </form>
  </section>
</main>
