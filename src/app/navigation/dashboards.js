import { HomeIcon } from '@heroicons/react/24/outline';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_DASHBOARDS = '/secciones'

const path = (root, item) => `${root}${item}`;

export const dashboards = {
  id: 'secciones',
  type: NAV_TYPE_ROOT,
  path: '/secciones',
  title: 'Secciones',
  Icon: DashboardsIcon,
  childs: [
    {
      id: 'secciones.listado',
      path: path(ROOT_DASHBOARDS, '/listado'),
      type: NAV_TYPE_ITEM,
      title: 'Listado de listado',
      Icon: HomeIcon,
    },

  ]
}
