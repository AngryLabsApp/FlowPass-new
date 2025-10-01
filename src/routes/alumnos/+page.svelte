<script>
  // @ts-ignore
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { Alert } from "flowbite-svelte";
  import Navbar from '../../lib/components/navbar/navbar.svelte';
</script>

<Navbar />
<h1>Hola Mundo 👋 desde Alumnos!!!!! porfin prueba holiii </h1>
<p>Esta es tu primera página en FlowPass con SvelteKit.</p>

<p>API Base URL: {PUBLIC_API_BASE_URL}</p>

<div class="p-8">
  <Alert>
    <span class="font-medium">Info alert!</span>
    Change a few things up and try submitting again.
  </Alert>
</div>