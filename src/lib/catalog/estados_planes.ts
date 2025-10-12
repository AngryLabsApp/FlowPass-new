  export const ESTADO_PLANES = [
    { value: "all", name: "Estado: Todos" },
    { value: "Activo", name: "Activo" },
    { value: "Inactivo", name: "Inactivo" },
    { value: "Pausado", name: "Pausado" },
  ];

  export const GET_ESTADO_PLANES = (only_values:boolean = false) =>{
    return ESTADO_PLANES.filter(item => item.value != "all");
  }