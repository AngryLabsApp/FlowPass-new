<!-- src/routes/login/+layout.svelte -->
<script>
  import "../../app.css";
  import favicon from "$lib/assets/favicon.svg";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>FlowPass</title>
</svelte:head>
<main class="min-h-screen flex items-center justify-center bg-gray-100">

  <slot /> <!-- Renderiza solo el login -->
</main>

