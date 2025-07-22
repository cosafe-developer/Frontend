import { HomeIcon } from '@heroicons/react/24/outline';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_ADMIN = '/admin'

const path = (root, item) => `${root}${item}`;

export const admin = {
  id: 'admin',
  type: NAV_TYPE_ROOT,
  path: '/admin',
  title: 'Secciones',
  transKey: 'nav.admin.sections',
  Icon: DashboardsIcon,
  childs: [
    {
      id: 'admin.listado',
      path: path(ROOT_ADMIN, '/listado'),
      type: NAV_TYPE_ITEM,
      title: 'Listado de listado',
      transKey: 'nav.admin.listado',
      Icon: HomeIcon,
    },
    {
      id: 'admin.agentes',
      path: path(ROOT_ADMIN, '/agentes'),
      type: NAV_TYPE_ITEM,
      title: 'Agentes',
      transKey: 'nav.admin.agentes',
      Icon: HomeIcon,
    },
    {
      id: 'admin.empresas',
      path: path(ROOT_ADMIN, '/empresas'),
      type: NAV_TYPE_ITEM,
      title: 'Empresas',
      transKey: 'nav.admin.empresas',
      Icon: HomeIcon,
    },
  ]
}
