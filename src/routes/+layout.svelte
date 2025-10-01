
<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import logo_invertido from "$lib/assets/logo-flowpass-invertido.svg";
  import "../app.css";
  
  import { Sidebar, SidebarGroup, SidebarItem, SidebarButton, uiHelpers ,SidebarBrand} from "flowbite-svelte";
  import { page } from "$app/state";
  let activeUrl = $state(page.url.pathname);
  import { ChartOutline, GridSolid, MailBoxSolid, UserSolid } from "flowbite-svelte-icons";
 
  const spanClass = "flex-1 ms-3 whitespace-nowrap";
  const sidebarEx1 = [
    {
      label: "Alumnos",
      href: "/alumnos",
      icon: ChartOutline
    },
    {
      label: "Ingresos",
      href: "/ingresos",
      icon: GridSolid,
      subContent: "Pro"
    },
    {
      label: "Pagos",
      href: "/pagos",
      icon: MailBoxSolid,
      subContent: "3"
    },
    {
      label: "Salir",
      href: "/",
      icon: UserSolid
    }
  ];
  const site = {
    name: "FlowPass",
    href: "/",
    img: logo_invertido,
  };
  const imgClass = "h-6 w-6";
  const demoSidebarUi = uiHelpers();
  let isDemoOpen = $state(false);
  const closeDemoSidebar = demoSidebarUi.close;
  $effect(() => {
    isDemoOpen = demoSidebarUi.isOpen;
    activeUrl = page.url.pathname;
  });
    
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>


<SidebarButton onclick={demoSidebarUi.toggle} class="mb-2" />
<div class="relative h-screen">
  <Sidebar {activeUrl} backdrop={false} isOpen={isDemoOpen} closeSidebar={closeDemoSidebar} params={{ x: 0, duration: 0 }} class="z-50 h-full" position="absolute" classes={{ nonactive: "p-2", active: "p-2" }}>
    <SidebarGroup>
      <SidebarBrand {site} {imgClass} />
      {#each sidebarEx1 as { label, href, icon: Icon, subContent }}
        <SidebarItem {label} {href} {spanClass}>
          {#snippet icon()}
            <Icon class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"></Icon>
          {/snippet}
          {#snippet subtext()}
            <span class="ms-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {subContent}
            </span>
          {/snippet}
        </SidebarItem>
      {/each}
    </SidebarGroup>
  </Sidebar>
  <div class="h-96 overflow-auto px-4 md:ml-64">
    <div class="rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
        <slot />
    </div>
  </div>
</div>



