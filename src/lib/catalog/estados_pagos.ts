  export const ESTADO_PAGOS = [
    { value: "all", name: "Estado de pago: Todos" },
    { value: "Pagado", name: "Pagado" },
    { value: "Pendiente", name: "Pendiente" },
  ];

    export const GET_ESTADO_PAGOS = () =>{
      return ESTADO_PAGOS.filter(item => item.value != "all");
    }