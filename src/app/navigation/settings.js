// Import Dependencies
import { UserIcon } from "@heroicons/react/24/outline";
import { TbPalette } from "react-icons/tb";

// Local Imports
import SettingIcon from "assets/dualicons/setting.svg?react";
import { NAV_TYPE_ITEM } from "constants/app.constant";

// ----------------------------------------------------------------------

export const settings = {
  id: 'settings',
  type: NAV_TYPE_ITEM,
  path: '/configuracion',
  title: 'Configuración',
  Icon: SettingIcon,
  childs: [
    {
      id: 'general',
      type: NAV_TYPE_ITEM,
      path: '/configuracion/general',
      title: 'General',
      Icon: UserIcon,
    },
    {
      id: 'apariencia',
      type: NAV_TYPE_ITEM,
      path: '/configuracion/apariencia',
      title: 'Apariencia',
      Icon: TbPalette,
    },
  ]
}