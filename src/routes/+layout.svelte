
<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import logo_invertido from "$lib/assets/logo-flowpass-invertido.svg";
  import default_icon from "$lib/assets/default.png";
  import "../app.css";
  
  import { Sidebar, SidebarGroup, SidebarItem, SidebarButton, uiHelpers ,SidebarBrand} from "flowbite-svelte";
  import { page } from "$app/state";
  let activeUrl = $state(page.url.pathname);
  import { ApiKeyOutline, CashOutline, UsersGroupOutline,UndoOutline } from "flowbite-svelte-icons";

  const spanClass = "flex-1 ms-3 whitespace-nowrap";
  const sidebarEx1 = [
    {
      label: "Alumnos",
      href: "/alumnos",
      icon: UsersGroupOutline
    },
    {
      label: "Ingresos",
      href: "/ingresos",
      icon: ApiKeyOutline,
      subContent: "Pro"
    },
    {
      label: "Pagos",
      href: "/pagos",
      icon: CashOutline,
      subContent: "3"
    }
  ];

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
       <SidebarBrand>
        <img src={logo_invertido} alt="FlowPass" class="h-6 w-6" />
        <span class="ml-2 self-center text-xl font-semibold whitespace-nowrap dark:text-white">FlowPass</span>
        +
        <img src={default_icon} alt="FlowPass" class="h-6 w-6" />
      </SidebarBrand>
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
    <SidebarGroup border>
        <SidebarItem label="Salir" {spanClass} href="/logout">
        {#snippet icon()}
          <UndoOutline class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
        {/snippet}
      </SidebarItem>

    </SidebarGroup>
  </Sidebar>
  <div class="h-96 overflow-auto px-4 md:ml-64">
    <div class="rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
        <slot />
    </div>
  </div>
</div>



