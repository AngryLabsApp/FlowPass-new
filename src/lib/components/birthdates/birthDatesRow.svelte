<script lang="ts">
    import { getUsersByBirthDay } from "$lib/services/api/users";
    import type { User } from "$lib/types/user";
    import { fmtUser } from "$lib/utils/utils";
    import { Avatar, Card, Skeleton } from "flowbite-svelte";
    import { onMount, setContext } from "svelte";

    let loading = $state(true);
    let users: User[] = $state([]);
    let currentAbort: AbortController | null = null;
    onMount(async () => {
        currentAbort?.abort();
        const abort = new AbortController();
        currentAbort = abort;
        try {
            loading = true;
            const members = await getUsersByBirthDay(abort, {});
            users = members.users.map((item) => fmtUser(item));

            console.log("CUMPLES", members);
            if (currentAbort !== abort) return;
        } catch (err: any) {
            if (err?.name === "AbortError") return;
        } finally {
            if (currentAbort === abort) loading = false;
        }
    });

    const getAge = (date: string): number => {
        if (!date) return 0; // manejo básico por si viene vacío o null

        const birthDate = new Date(date);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
                today.getDate() >= birthDate.getDate());

        if (!hasHadBirthdayThisYear) {
            age -= 1;
        }

        return age;
    };
    const restingDays = (date: string): string => {
        if (!date) return "";

        const today = new Date();

        // Extraemos correctamente los componentes de la fecha (YYYY-MM-DD)
        const [day, month, year] = date.split("-").map(Number);

        // Normalizamos la hora (medianoche local)
        const todayMidnight = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
        );

        // Creamos la fecha del cumpleaños para este año
        let nextBirthday = new Date(today.getFullYear(), month - 1, day);

        // Si ya pasó este año, movemos al siguiente
        if (nextBirthday < todayMidnight) {
            nextBirthday = new Date(today.getFullYear() + 1, month - 1, day);
        }

        const diffTime = nextBirthday.getTime() - todayMidnight.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return "Es hoy!";
        return "faltan " + diffDays + " días";
    };

    const getMonth = (date: string): string => {
        if (!date) return "";

        // Parseamos manualmente para evitar desfases de zona horaria
        const [day, month, year] = date.split("-").map(Number);

        // Nombres de meses en español
        const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];

        return `${day} de ${meses[month - 1]}`;
    };
</script>

<div
    class="flex overflow-x-auto gap-3 p-3 scrollbar-hide snap-x snap-mandatory"
>
    {#if loading}
        {#each [1, 2, 3, 4, 5, 6, 7] as repeat}
            <Card
                class="p-3 flex gap-1.5 justify-center w-50 h-40 flex-none"
                size="xs"
            >
                <Skeleton size="sm" class="w-35" />
            </Card>
        {/each}
    {:else if users.length > 0}
        {#each users as u}
            <Card
                class="p-3 flex gap-1.5 justify-center w-50 h-40 flex-none"
                size="xs"
            >
                <div class="flex flex-col items-center pb-2">
                    <h5
                        class="mb-1 text-xl font-medium text-gray-900 dark:text-white"
                    >
                        {u.full_name}
                    </h5>
                    <span class="text-sm text-gray-500 dark:text-gray-400"
                        >{getMonth(u.cumpleanos as string)}</span
                    >
                    <div
                        class="mt-4 flex space-x-3 lg:mt-6 rtl:space-x-reverse"
                    >
                        Cumple: {getAge(u.cumpleanos as string)} Años!
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400"
                        >{restingDays(u.cumpleanos as string)}</span
                    >
                </div>
            </Card>
        {/each}
    {:else}
        <Card
            class="p-3 flex gap-1.5 justify-center w-50 h-40 flex-none"
            size="xs"
        >
            <div class="flex flex-col items-center pb-4">
                <h5
                    class="mb-1 text-xl font-medium text-gray-900 dark:text-white"
                >
                    No hay cumpleaños proximos
                </h5>
            </div>
        </Card>
    {/if}
</div>
