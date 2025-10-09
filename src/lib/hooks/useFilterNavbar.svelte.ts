import { FilterKeys } from "$lib/enums/filter_keys";
import { debounce } from "$lib/utils/utils";
import { onMount, tick } from "svelte";

export type FilterState = {
  status: string;
  plan: string;
  query: string;
  date: Date | undefined;
};

type UIState = {
  filtersCollapsed: boolean;
  hasInteracted: boolean;
};

interface UseFilterNavbarOptions {
  onSearch?: (key: FilterKeys, value: string | Date) => void;
  debounceMs?: number;
  defaultValues?: Partial<FilterState>;
  filterKeys?: Partial<{
    status: FilterKeys;
    plan: FilterKeys;
    search: FilterKeys;
    date: FilterKeys;
  }>;
}

const DEFAULT_CONFIG = {
  desktopBreakpoint: "(min-width: 1024px)",
  defaultFilterValues: {
    status: "all",
    plan: "all",
    date: new Date(),
    query: "",
  },
} as const;

const DEFAULT_FILTER_KEYS = {
  status: FilterKeys.ESTADO,
  plan: FilterKeys.PLAN,
  search: FilterKeys.SEARCH,
  date: FilterKeys.DATE,
} as const;

/**
 * ====================================
 * CUSTOM HOOK
 * ====================================
 */

export function useFilterNavbar(options: UseFilterNavbarOptions = {}) {
  const {
    onSearch,
    debounceMs = 350,
    defaultValues = {},
    filterKeys = {},
  } = options;

  const resolvedFilterKeys = {
    ...DEFAULT_FILTER_KEYS,
    ...filterKeys,
  };

  let filterState = $state<FilterState>({
    ...DEFAULT_CONFIG.defaultFilterValues,
    ...defaultValues,
  });

  let uiState = $state<UIState>({
    filtersCollapsed: true,
    hasInteracted: false,
  });

  let filterContainerRef = $state<HTMLDivElement>();
  let measureRef = $state<HTMLDivElement>();
  let inputRef = $state<HTMLInputElement>();

  const notifyFilterChange = (key: FilterKeys, value: string) => {
    onSearch?.(key, value);
  };

  const notifyDateChange = (selectedDate?: Date) => {
    if (!selectedDate) return;
    onSearch?.(resolvedFilterKeys.date, selectedDate);
  };

  const filterHandlers = {
    search: debounce(
      (searchText) => notifyFilterChange(resolvedFilterKeys.search, searchText),
      debounceMs
    ),
    status: () =>
      notifyFilterChange(resolvedFilterKeys.status, filterState.status),
    plan: () => notifyFilterChange(resolvedFilterKeys.plan, filterState.plan),
    date: () => notifyDateChange(filterState.date),
  };

  function resetFilters() {
    filterState = {
      ...DEFAULT_CONFIG.defaultFilterValues,
      ...defaultValues,
    };

    notifyFilterChange(resolvedFilterKeys.status, filterState.status);
    notifyFilterChange(resolvedFilterKeys.plan, filterState.plan);
    notifyFilterChange(resolvedFilterKeys.search, filterState.query);
    if (filterState.date) notifyDateChange(filterState.date);
  }

  function setupInputListeners(input: HTMLInputElement) {
    function handleInput() {
      if (!uiState.hasInteracted) uiState.hasInteracted = true;
      filterHandlers.search(filterState.query);
    }

    function handleKeydown(event: KeyboardEvent) {
      if (!uiState.hasInteracted) uiState.hasInteracted = true;
      if (event.key === "Enter") {
        event.preventDefault();
        notifyFilterChange(resolvedFilterKeys.search, filterState.query);
      }
    }

    input.addEventListener("input", handleInput);
    input.addEventListener("keydown", handleKeydown);

    return () => {
      input.removeEventListener("input", handleInput);
      input.removeEventListener("keydown", handleKeydown);
    };
  }

  $effect(() => {
    if (!inputRef) return;
    return setupInputListeners(inputRef);
  });

  function shouldCollapseFilters(): boolean {
    const isDesktop = window.matchMedia(
      DEFAULT_CONFIG.desktopBreakpoint
    ).matches;

    if (!isDesktop) return true;
    if (!filterContainerRef || !measureRef) return false;

    const espacioDisponible = filterContainerRef.clientWidth;
    const espacioNecesario = measureRef.scrollWidth;

    return espacioNecesario > espacioDisponible;
  }

  function updateCollapseState() {
    if (typeof window === "undefined") return;
    uiState.filtersCollapsed = shouldCollapseFilters();
  }

  function setupResizeObserver() {
    const observer = new ResizeObserver(updateCollapseState);

    if (filterContainerRef) {
      observer.observe(filterContainerRef);
    }

    return observer;
  }

  onMount(() => {
    let resizeObserver: ResizeObserver | undefined;

    tick().then(() => {
      updateCollapseState();
      resizeObserver = setupResizeObserver();
      window.addEventListener("resize", updateCollapseState);
    });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateCollapseState);
    };
  });

  $effect(() => {
    updateCollapseState();
  });


  function onMonthChange(value: Date){    
    onSearch?.(resolvedFilterKeys.date, value);
  }
  // API pública del hook
  return {
    onMonthChange,
    // Estado
    filterState,
    uiState,
    // Referencias
    refs: {
      filterContainer: {
        get current() {
          return filterContainerRef;
        },
        set current(value) {
          filterContainerRef = value;
        },
      },
      measurementRow: {
        get current() {
          return measureRef;
        },
        set current(value) {
          measureRef = value;
        },
      },
      input: {
        get current() {
          return inputRef;
        },
        set current(value) {
          inputRef = value;
        },
      },
    },
    // Handlers
    handlers: filterHandlers,
    // Acciones
    resetFilters,
  };
}
