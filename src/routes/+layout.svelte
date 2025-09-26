<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav class="sidebar">
  <a href="/alumnos" class="sidebar__link">Alumnos</a>
  <a href="/ingresos" class="sidebar__link">Ingresos</a>
  <a href="/pagos" class="sidebar__link">Pagos</a>
</nav>

<main class="content">
  <slot />
</main>
