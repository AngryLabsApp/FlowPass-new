<script lang="ts">
  // Monthpicker.svelte — Svelte 5 (runes) → value: Date|null
  // - bind:value        : Date | null   (1er día del mes, 00:00 local)
  // - min / max         : Date | null
  // - name              : string (para forms; genera input hidden con "YYYY-MM")
  // - on:change         : CustomEvent<{ value: Date | null, yyyymm: string }>
  // - preferNative      : boolean (default true)
  // - monthLocale       : string ("es-PE" por defecto)
  // - class, id, disabled, required, placeholder

  type YYYYMM = `${number}-${string}`;

  let {
    value = $bindable<Date | null>(null),
    min = null as Date | null,
    max = null as Date | null,
    disabled = false,
    required = false,
    name = "",
    id = "",
    class: className = "",
    placeholder = "YYYY-MM",
    preferNative = true,
    monthLocale = "es-PE",
    onChange, // opcional callback
  } = $props();

  // ───────────── Helpers de fecha ─────────────
  const pad2 = (n: number) => String(n).padStart(2, "0");

  function normalizeToMonthStart(d: Date): Date {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    nd.setDate(1);
    return nd;
  }

  function toYYYYMM(d: Date | null): YYYYMM | "" {
    if (!d) return "";
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    return `${y}-${m}`;
  }

  function fromYYYYMM(str: string): Date | null {
    if (!/^\d{4}-\d{2}$/.test(str)) return null;
    const y = Number(str.slice(0, 4));
    const m = Number(str.slice(5, 7)); // 01..12
    if (m < 1 || m > 12) return null;
    return new Date(y, m - 1, 1, 0, 0, 0, 0);
  }

  function yyyymmNumber(d: Date): number {
    return Number(`${d.getFullYear()}${pad2(d.getMonth() + 1)}`);
  }

  function clampDateToRange(d: Date): Date {
    const dd = normalizeToMonthStart(d);
    if (min && yyyymmNumber(dd) < yyyymmNumber(normalizeToMonthStart(min))) {
      return normalizeToMonthStart(min);
    }
    if (max && yyyymmNumber(dd) > yyyymmNumber(normalizeToMonthStart(max))) {
      return normalizeToMonthStart(max);
    }
    return dd;
  }

  // ───────────── Detección nativa ─────────────
  let nativeSupported = false;
  if (preferNative && typeof document !== "undefined") {
    const test = document.createElement("input");
    test.setAttribute("type", "month");
    nativeSupported = test.type === "month";
  }

  // ───────────── Estado derivado ─────────────
  // string que usa el <input type="month">
  let valueStr: YYYYMM | "" = toYYYYMM(value);

  $effect(() => {
    // si cambian value/min/max desde fuera, recalcula el string
    valueStr = toYYYYMM(value);
  });

  function emit(v: Date | null) {
    value = v ? normalizeToMonthStart(v) : null;
    const yyyymm = toYYYYMM(value);
    onChange?.(value); // si te gusta usar callback imperativo
  }

  // ───────────── Fallback (selects) ─────────────
  let root: HTMLDivElement | null = null;
  const today = normalizeToMonthStart(new Date());

  function coalesceInitial(): Date {
    if (value) return clampDateToRange(value);
    return clampDateToRange(today);
  }

  let sel = coalesceInitial(); // Date siempre 1er día de mes
  let selYear = sel.getFullYear();
  let selMonth = sel.getMonth() + 1; // 1..12

  $effect(() => {
    // si value cambia externamente, sincroniza selects
    const base = value ? clampDateToRange(value) : coalesceInitial();
    selYear = base.getFullYear();
    selMonth = base.getMonth() + 1;
  });

  // límites de años para el fallback
  const curY = today.getFullYear();
  const minY = min ? normalizeToMonthStart(min).getFullYear() : curY - 10;
  const maxY = max ? normalizeToMonthStart(max).getFullYear() : curY + 10;

  function allowedMonthsFor(year: number) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    return months.filter((m) => {
      const d = new Date(year, m - 1, 1);
      const n = yyyymmNumber(d);
      const minN = min ? yyyymmNumber(normalizeToMonthStart(min)) : -Infinity;
      const maxN = max ? yyyymmNumber(normalizeToMonthStart(max)) : Infinity;
      return n >= minN && n <= maxN;
    });
  }

  function onSelectChange() {
    const d = clampDateToRange(new Date(selYear, selMonth - 1, 1));
    selYear = d.getFullYear();
    selMonth = d.getMonth() + 1;
    emit(d);
  }

  // nombres de meses localizados
  let monthNames = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(2024, i, 1);
    return new Intl.DateTimeFormat(monthLocale, { month: "short" }).format(d);
  });
</script>

{#if nativeSupported}
  <!-- Modo nativo -->
  <div bind:this={root} class={className}>
    <input
      type="month"
      bind:value={valueStr}
      {name}
      {id}
      class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:bg-gray-100"
      min={min ? toYYYYMM(normalizeToMonthStart(min)) : undefined}
      max={max ? toYYYYMM(normalizeToMonthStart(max)) : undefined}
      {placeholder}
      {disabled}
      {required}
      on:change={(e) => {
        const str = (e.currentTarget as HTMLInputElement).value;
        const d = str ? clampDateToRange(fromYYYYMM(str)!) : null;
        // asegúrate de reflejar el clamp visualmente
        valueStr = toYYYYMM(d);
        emit(d);
      }}
    />

    {#if name}
      <!-- Para formularios (asegura YYYY-MM) -->
      <input type="hidden" {name} value={valueStr} {required} />
    {/if}
  </div>
{:else}
  <!-- Fallback: selects -->
  <div bind:this={root} class={`flex items-center gap-2 ${className}`}>
    <select
      class="border w-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:bg-gray-100"
      bind:value={selMonth}
      on:change={onSelectChange}
      {disabled}
      aria-label="Mes"
    >
      {#each allowedMonthsFor(selYear) as m}
        <option value={m}>
          {pad2(m)} — {monthNames[m - 1]}
        </option>
      {/each}
    </select>

    <select
      class="w-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:bg-gray-100"
      bind:value={selYear}
      on:change={() => {
        const allowed = allowedMonthsFor(selYear);
        if (!allowed.includes(selMonth)) {
          selMonth = allowed[0] ?? 1;
        }
        onSelectChange();
      }}
      {disabled}
      aria-label="Año"
    >
      {#each Array.from({ length: maxY - minY + 1 }, (_, i) => minY + i) as y}
        <option value={y}>{y}</option>
      {/each}
    </select>

    {#if name}
      <input
        type="hidden"
        {name}
        value={toYYYYMM(new Date(selYear, selMonth - 1, 1))}
        {required}
      />
    {/if}
  </div>
{/if}
