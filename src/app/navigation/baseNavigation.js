import { NAV_TYPE_ITEM, } from "constants/app.constant";
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'

export const baseNavigation = [
  {
    id: 'admin',
    type: NAV_TYPE_ITEM,
    path: '/admin',
    title: 'Secciones',
    Icon: DashboardsIcon,
  },
]
