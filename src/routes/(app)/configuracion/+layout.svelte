<script lang="ts">
  import { Sidebar, SidebarGroup, SidebarItem } from "flowbite-svelte";
  import { CogSolid, BellSolid, UserSolid, ShieldCheckSolid } from "flowbite-svelte-icons";

  // Sidebar activo (opcional, para resaltar la ruta actual)
  import { page } from "$app/state";
  let activeUrl = $state(page.url.pathname);
</script>

<div class="flex min-h-screen bg-gray-50">
  <!-- Sidebar secundario -->
  <Sidebar
    alwaysOpen
    {activeUrl}
    backdrop={false}
    position="static"
    class="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    classes={{ nonactive: "p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md", active: "p-2 bg-primary-100 text-primary-700 rounded-md" }}
  >
    <SidebarGroup>
      <SidebarItem label="Planes" href="/configuracion/planes">
        {#snippet icon()}
          <CogSolid class="h-5 w-5 text-gray-500 dark:text-gray-400" />
        {/snippet}
      </SidebarItem>
   <!--     <SidebarItem label="Notificaciones" href="/">
        {#snippet icon()}
          <BellSolid class="h-5 w-5 text-gray-500 dark:text-gray-400" />
        {/snippet}
      </SidebarItem>-->
     
    </SidebarGroup>
  </Sidebar>

  <!-- Contenido principal -->
  <main class="flex-1 p-6">
    <slot /> <!-- aquí renderizas el contenido dinámico de cada sección -->
  </main>
</div>
