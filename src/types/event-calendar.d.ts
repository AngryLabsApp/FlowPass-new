declare module "@event-calendar/core" {
  // Export default para compatibilidad con instanciación manual
  const EventCalendar: any;
  export default EventCalendar;

  // Exportaciones nuevas para soporte Svelte 5
  export const Calendar: any;
  export const TimeGrid: any;
  export const DayGrid: any;
  export const List: any;
  export const ResourceTimeline: any;
  export const ResourceTimeGrid: any;
  export const Interaction: any;
}

declare module "@event-calendar/daygrid" {
  const dayGridPlugin: any;
  export default dayGridPlugin;
}

declare module "@event-calendar/interaction" {
  const interactionPlugin: any;
  export default interactionPlugin;
}
