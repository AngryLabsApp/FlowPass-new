<script lang="ts">
  import GroupModal from "$lib/components/modal/group_modal.svelte";
  import { GRADIENTS } from "$lib/constants/gradients";
  import { EllipsisVertical, Grid2X2Plus } from "@lucide/svelte";
  import { Button, Card, Heading } from "flowbite-svelte";

  let openGroupModal = $state(false);

  const handleCreateGroup = () => {
    openGroupModal = true;
  };

  const group_data = [
    {
      name: "Grupo 5 años",
      cantidad: 6,
      members: [
        {
          name: "Grecia Delgado",
          initials: "GD",
          plan: "Plan 12 meses",
          estado: "activo",
        },
        {
          name: "María José",
          initials: "MJ",
          plan: "Plan trimestral",
          estado: "activo",
        },
        {
          name: "Luis Pérez",
          initials: "LP",
          plan: "Plan mensual",
          estado: "activo",
        },
        {
          name: "Daniela Soto",
          initials: "DS",
          plan: "Plan 6 meses",
          estado: "activo",
        },
        {
          name: "Carlos Díaz",
          initials: "CD",
          plan: "Plan mensual",
          estado: "activo",
        },
        {
          name: "Ana Torres",
          initials: "AT",
          plan: "Plan trimestral",
          estado: "activo",
        },
      ],
    },
    {
      name: "Básico Salsa",
      cantidad: 4,
      members: [
        {
          name: "Jorge Ramírez",
          initials: "JR",
          plan: "Plan mensual",
          estado: "activo",
        },
        {
          name: "Lucía Campos",
          initials: "LC",
          plan: "Plan 3 meses",
          estado: "activo",
        },
        {
          name: "Pedro López",
          initials: "PL",
          plan: "Plan 6 meses",
          estado: "activo",
        },
        {
          name: "Karla Quintana",
          initials: "KQ",
          plan: "Plan mensual",
          estado: "activo",
        },
      ],
    },
    {
      name: "Intermedio Bachata",
      cantidad: 7,
      members: [
        {
          name: "Fernando Salazar",
          initials: "FS",
          plan: "Plan mensual",
          estado: "activo",
        },
        {
          name: "Valeria Medina",
          initials: "VM",
          plan: "Plan trimestral",
          estado: "activo",
        },
        {
          name: "Samuel Torres",
          initials: "ST",
          plan: "Plan mensual",
          estado: "activo",
        },
        {
          name: "Gabriela Ríos",
          initials: "GR",
          plan: "Plan 6 meses",
          estado: "activo",
        },
        {
          name: "Ricardo Vargas",
          initials: "RV",
          plan: "Plan anual",
          estado: "activo",
        },
        {
          name: "Marcos Silva",
          initials: "MS",
          plan: "Plan mensual",
          estado: "activo",
        },
        {
          name: "Nicole Zurita",
          initials: "NZ",
          plan: "Plan mensual",
          estado: "activo",
        },
      ],
    },
  ];

  const MAX_VISIBLE_MEMBERS = 4;

  const getVisibleMembers = (members: { initials: string }[]) =>
    members.slice(0, MAX_VISIBLE_MEMBERS);

  const getExtraMembersCount = (members: { initials: string }[]) =>
    Math.max(0, members.length - MAX_VISIBLE_MEMBERS);

  const getGroupInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

  const getGradient = (index: number) =>
    GRADIENTS[index % GRADIENTS.length]?.css ??
    "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)";
</script>

<div class="flex flex-col gap-4">
  <div class="flex justify-between mb-4">
    <Heading tag="h3">Grupos de tus Alumnos</Heading>
    <div class="flex gap-4 items-center w-fit">
      <Button
        class="w-fit flex gap-2 items-center"
        onclick={() => handleCreateGroup()}
      >
        Crear Grupo
        <Grid2X2Plus size={20} />
      </Button>
    </div>
  </div>
  <GroupModal bind:openModal={openGroupModal} />
</div>
<div class="">
  <div class="grid  lg:grid-cols-3 grid-cols-1 gap-4">
    {#each group_data as group, index}
      <Card
        size="md"
        class="relative p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div class="flex items-start gap-4">
          <!-- Avatar Grupo -->
          <div
            class="h-16 w-16 rounded-full flex justify-center items-center text-xl font-bold text-white flex-shrink-0 shadow-inner"
            style={`background:${getGradient(index)}`}
          >
            {getGroupInitials(group.name)}
          </div>

          <!-- Texto -->
          <div class="flex-1 space-y-1">
            <p class="text-base font-semibold text-gray-900">
              {group.name}
            </p>
            <p class="text-sm text-gray-600">
              Miembros: <span class="font-medium">{group.cantidad}</span>
            </p>

            <!-- Avatares -->
            <div class="flex items-center mt-2">
              <div class="flex -space-x-2">
                {#each getVisibleMembers(group.members) as member}
                  <div
                    class="h-7 w-7 rounded-full bg-gray-100 border border-white text-[10px] font-medium
                     flex items-center justify-center shadow-sm"
                  >
                    {member.initials}
                  </div>
                {/each}

                {#if getExtraMembersCount(group.members) > 0}
                  <div
                    class="h-7 w-7 rounded-full bg-gray-300 border border-white text-[10px] font-medium
                     flex items-center justify-center shadow-sm"
                  >
                    +{getExtraMembersCount(group.members)}
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Botón menú -->
          <EllipsisVertical
            color="gray"
            class="absolute right-3 top-3.5 cursor-pointer hover:text-gray-700"
          />
        </div>
      </Card>
    {/each}
  </div>
</div>
