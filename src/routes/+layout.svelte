
<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "../app.css";
  
  import { Alert } from "flowbite-svelte";

  
</script>


<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav class="sidebar">
  <a href="/alumnos" class="sidebar__link">Alumnos</a>
  <a href="/ingresos" class="sidebar__link">Ingresos</a>
  <a href="/pagos" class="sidebar__link">Pagos</a>
   <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</nav>
<div class="p-8">
  <Alert>
    <span class="font-medium">Info alert!</span>
    Change a few things up and try submitting again.
  </Alert>
</div>
<main class="content">
  <slot />
</main>
