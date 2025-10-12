<!-- src/routes/login/+layout.svelte -->
<script>
  import "../../app.css";
  import logo_flowpass from "$lib/assets/logo-flowpass.svg";
</script>

<svelte:head>
  <link rel="icon" href={logo_flowpass} />
  <title>FlowPass</title>
</svelte:head>
<main class="min-h-screen flex items-center justify-center bg-gray-100">

  <slot /> <!-- Renderiza solo el login -->
</main>

