<script lang="ts">
  import { Timeline, TimelineItem } from "flowbite-svelte";
  import dayjs from "dayjs";
  import "dayjs/locale/es.js";
  dayjs.locale("es");

  import { Cake, ChevronLeft, ChevronRight } from "@lucide/svelte";
  import { toTitleCase } from "$lib/utils/utils";
  let { userBirthdays }: any = $props();
  console.log("userBirthdays -->", userBirthdays);
  let scrollContainer: HTMLDivElement;

  function getAge(dateString: string) {
    const birthDate = dayjs(dateString);
    return dayjs().diff(birthDate, "year");
  }

  const today = dayjs();

  // 🎈 Convertimos los datos a formato Timeline
  const birthdays = $derived(
    userBirthdays.map((u: any) => {
      const date = dayjs(u.cumpleanos).year(today.year()).startOf("day");
      const diffDays = date.diff(today.startOf("day"), "day");

      const status = diffDays === 0 ? "hoy" : "proximo";
      const description =
        status === "hoy"
          ? `🎉 ¡Hoy cumple ${getAge(u.cumpleanos!)}!`
          : `Cumple ${getAge(u.cumpleanos!) + 1} años`;
      const descriptionDiffDays =
        status === "hoy"
          ? "Día especial 🎈"
          : `Faltan ${diffDays} ${diffDays === 1 ? "día" : "días"} 🎉`;

      return {
        id: u.id,
        name: `${toTitleCase(u.nombre)} ${toTitleCase(u.apellidos)}`.trim(),
        dateFormatted: date.format("D [de] MMMM"),
        description,
        descriptionDiffDays,
        status,
        diffDays,
      };
    })
  );

  function getColor(status: string) {
    return status === "hoy" ? "orange" : "blue";
  }

  function getBadgeClass(status: string) {
    return status === "hoy"
      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  }

  function scrollLeft() {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
    }
  }

  function scrollRight() {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
    }
  }
</script>

{#if birthdays.length > 0}
  <div class="relative">
    <!-- Viewport scrollable -->
    <div
      bind:this={scrollContainer}
      class="overflow-x-auto scroll-smooth snap-x snap-mandatory px-8 scrollbar-hide scroll-px-8"
    >
      <Timeline order="horizontal" class="flex py-2">
        {#each birthdays as b, index}
          {@const isLastItem = index === birthdays.length - 1}
          {@const color = getColor(b.status)}

          <TimelineItem
            class="text-wrap shrink-0 snap-start max-w-[150px] [&>h3]:text-sm [&>h3]:mt-2 [&>time]:text-xs"
            title={b.name}
            date={b.dateFormatted}
            {color}
            isLast={isLastItem}
          >
            {#snippet orientationSlot()}
              <div class="flex items-center">
                <div
                  class="bg-pink-200 dark:bg-pink-800 flex h-6 w-6 p-1 shrink-0 items-center justify-center rounded-full ring-0 ring-white sm:ring-8 dark:ring-gray-900"
                >
                  <Cake />
                </div>
                {#if !isLastItem}
                  <div
                    class="hidden h-0.5 w-full bg-gray-200 sm:flex dark:bg-gray-700"
                  ></div>
                {/if}
              </div>
            {/snippet}

            <div class="pr-10 h-fit flex flex-col justify-start">
              <p class="text-xs font-normal text-gray-500 dark:text-gray-400">
                {b.description}
              </p>

              <span
                class="w-fit mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getBadgeClass(
                  b.status
                )}"
              >
                {b.descriptionDiffDays}
              </span>
            </div>
          </TimelineItem>
        {/each}
      </Timeline>
    </div>

    <!-- Botones de navegación -->
    <button
      onclick={scrollLeft}
      class="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/70 rounded-full shadow p-1 hover:bg-white z-10"
    >
      <ChevronLeft size="20" />
    </button>

    <button
      onclick={scrollRight}
      class="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/70 rounded-full shadow p-1 hover:bg-white z-10"
    >
      <ChevronRight size="20" />
    </button>
  </div>
{:else}
  <div class="flex items-center justify-center h-16">
    <p class="text-gray-500 dark:text-gray-400 text-sm">
      No hay cumpleaños próximos 🎈
    </p>
  </div>
{/if}
