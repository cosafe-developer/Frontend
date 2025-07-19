import { ArrowPathIcon, CheckBadgeIcon, ClockIcon, TruckIcon, XCircleIcon } from "@heroicons/react/24/outline";

export const orderStatusOptions = [
  {
    value: 'shipping',
    label: 'Shipping',
    color: 'info',
    icon: TruckIcon
  },
  {
    value: 'pending',
    label: 'Pending',
    color: 'warning',
    icon: ClockIcon
  },
  {
    value: 'completed',
    label: 'Completed',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'processing',
    label: 'Processing',
    color: 'primary',
    icon: ArrowPathIcon
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    color: 'error',
    icon: XCircleIcon
  }
]

export const ordersList = [
  {
    estudio: "PIPC",
    empresa: {
      name: "OXXO",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Administrador",
    },
    prioridad: "Urgente",
    progress: 77,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "FEMSA",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Agente",
    },
    prioridad: "Urgente",
    progress: 17,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "CFE",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Media",
    progress: 46,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Soriana",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      }
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Media",
    progress: 88,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Coppel",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Media",
    progress: 100,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Santander",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Media",
    progress: 100,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "BBVA",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Media",
    progress: 66,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Walmart",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Urgente",
    progress: 30,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Costco",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Urgente",
    progress: 30,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Cervecería Modelo",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Urgente",
    progress: 30,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Farmacia del Ahorro",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Administrador",
    },
    prioridad: "Urgente",
    progress: 77,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "FEMSA",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Agente",
    },
    prioridad: "Urgente",
    progress: 17,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "CFE",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Media",
    progress: 46,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Soriana",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      }
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Media",
    progress: 88,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Coppel",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Media",
    progress: 100,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Santander",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Media",
    progress: 100,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "BBVA",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Media",
    progress: 66,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Walmart",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Urgente",
    progress: 30,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Costco",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Urgente",
    progress: 30,
  },
  {
    estudio: "PIPC",
    empresa: {
      name: "Heineken",
      avatar_img: null,
    },
    agentes: [
      {
        avatar: null,
        name: "Gilberto Barrios"
      },
      {
        avatar: null,
        name: "Teofilo Velazquez"
      },
      {
        avatar: null,
        name: "Dario Martinez"
      },
    ],
    fecha_inicio: 1679684400000,
    fecha_entrega: 1708801200000,
    creador: {
      rol: "Empresa",
    },
    prioridad: "Urgente",
    progress: 30,
  },
];
