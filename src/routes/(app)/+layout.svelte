<script lang="ts">
  import { onMount } from "svelte";
  import {
    initAuthListener,
    ensureSessionOrRedirect,
  } from "$lib/services/supabase/session";

  onMount(async () => {
    initAuthListener(); // ← se registra una sola vez
    await ensureSessionOrRedirect(); // ← verifica sesión al entrar
  });

  import logo_flowpass from "$lib/assets/logo-flowpass.svg";
  import logo_invertido from "$lib/assets/logo-flowpass-invertido.svg";
  import default_icon from "$lib/assets/default.png";
  import "../../app.css";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import {
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarButton,
    uiHelpers,
    SidebarBrand,
  } from "flowbite-svelte";
  import { page } from "$app/state";
  let activeUrl = $state(page.url.pathname);
  import {
    CashOutline,
    UsersGroupOutline,
    UndoOutline,
  } from "flowbite-svelte-icons";

  import { KeyRound } from "@lucide/svelte";

  const spanClass = "flex-1 ms-3 whitespace-nowrap";
  const MenuItems = [
    {
      label: "Alumnos",
      href: "/alumnos",
      icon: UsersGroupOutline,
    },
    {
      label: "Ingresos",
      href: "/ingresos",
      icon: KeyRound,
    },
    {
      label: "Pagos",
      href: "/pagos",
      icon: CashOutline,
    },
  ];

  const demoSidebarUi = uiHelpers();
  let isDemoOpen = $state(false);
  const closeDemoSidebar = demoSidebarUi.close;
  $effect(() => {
    isDemoOpen = demoSidebarUi.isOpen;
    activeUrl = page.url.pathname;
  });

  // estado compartido SOLO bajo este layout
  const lock = writable(false);
  setContext("lock", lock);
  $effect(() => {
    if (lock) return;
  });
</script>

<svelte:head>
  <link rel="icon" href={logo_flowpass} />
  <title>FlowPass</title>
</svelte:head>

<SidebarButton onclick={demoSidebarUi.toggle} class="mb-2" />
<div class="relative h-screen">
  {#if !$lock}
    <Sidebar
      {activeUrl}
      backdrop={false}
      isOpen={isDemoOpen}
      closeSidebar={closeDemoSidebar}
      params={{ x: 0, duration: 0 }}
      class="z-50 h-full"
      position="absolute"
      classes={{ nonactive: "p-2", active: "p-2" }}
    >
      <SidebarGroup>
        <SidebarBrand>
          <div
            class="p-1 rounded-md"
            style="background-color: var(--color-primary-500)"
          >
            <img src={logo_invertido} alt="FlowPass" class="h-6 w-6" />
          </div>

          <span
            class="ml-2 self-center text-xl font-semibold whitespace-nowrap dark:text-white"
            >FlowPass</span
          >
          &nbsp;+&nbsp;
          <img src={default_icon} alt="FlowPass" class="h-6 w-6" />
        </SidebarBrand>
        {#each MenuItems as { label, href, icon: Icon }}
          <SidebarItem {label} {href} {spanClass}>
            {#snippet icon()}
              <Icon
                class="h-5 w-5 text-gray-600 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
              ></Icon>
            {/snippet}
          </SidebarItem>
        {/each}
      </SidebarGroup>
      <SidebarGroup border>
        <SidebarItem label="Salir" {spanClass} href="/logout">
          {#snippet icon()}
            <UndoOutline
              class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
            />
          {/snippet}
        </SidebarItem>
      </SidebarGroup>
    </Sidebar>
  {/if}
  <div class="h-full overflow-auto {!$lock && 'px-4 md:ml-64'}">
    <div class="rounded-lg p-4">
      <slot />
    </div>
  </div>
</div>
