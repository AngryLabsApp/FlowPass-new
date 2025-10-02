<!-- src/routes/login/+page.svelte -->
<script>
  let email = '';
  let password = '';
</script>

<div class="w-full max-w-sm bg-white p-6 rounded shadow">
  <h1 class="text-xl font-bold mb-4">Iniciar sesión</h1>
  <form>
    <input class="border w-full p-2 mb-3" placeholder="Email" bind:value={email} />
    <input class="border w-full p-2 mb-3" type="password" placeholder="Password" bind:value={password} />
    <button class="bg-blue-600 text-white w-full py-2 rounded">Entrar</button>
  </form>
</div>
