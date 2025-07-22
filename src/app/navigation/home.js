import { HomeIcon } from '@heroicons/react/24/outline';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_DASHBOARDS = ''

const path = (root, item) => `${root}${item}`;

export const home = {
  id: 'listado-requerimientos',
  type: NAV_TYPE_ROOT,
  path: '/listado-requerimientos',
  title: 'Secciones',
  transKey: 'nav.home.sections',
  Icon: DashboardsIcon,
  childs: [
    {
      id: 'listado-requerimientos',
      path: path(ROOT_DASHBOARDS, '/listado-requerimientos'),
      type: NAV_TYPE_ITEM,
      title: 'Listado de Requerimientos',
      transKey: 'nav.home.requirementsList',
      Icon: HomeIcon,
    }
  ]
}

