// Import Dependencies
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import SimpleBar from "simplebar-react";

// Local Imports
import { isRouteActive } from "utils/isRouteActive";
import {
  useDataScrollOverflow,
  useDidUpdate,
  useIsomorphicEffect,
} from "hooks";
import { CollapsibleItem } from "./CollapsibleItem";
import { Accordion } from "components/ui";
import { MenuItem } from "./MenuItem";
import { Divider } from "./Divider";
import {
  NAV_TYPE_COLLAPSE,
  NAV_TYPE_DIVIDER,
  NAV_TYPE_ITEM,
} from "constants/app.constant";
import { HomeIcon } from "@heroicons/react/24/outline";

// ----------------------------------------------------------------------

export function Menu({ nav, pathname }) {
  const initialActivePath = useMemo(() => {
    return nav.find((item) => isRouteActive(item.path, pathname))?.path;
  }, [nav, pathname]);

  const { ref, recalculate } = useDataScrollOverflow();
  const [expanded, setExpanded] = useState(initialActivePath || "");

  useDidUpdate(recalculate, [nav]);

  useDidUpdate(() => {
    const activePath = nav.find((item) =>
      isRouteActive(item.path, pathname),
    )?.path;

    if (activePath && expanded !== activePath) {
      setExpanded(activePath);
    }
  }, [nav, pathname]);

  useIsomorphicEffect(() => {
    const activeItem = ref?.current.querySelector("[data-menu-active=true]");
    activeItem?.scrollIntoView({ block: "center" });
  }, []);

  const extendedNav = useMemo(() => {
    const clonedNav = [...nav];

    if (pathname.includes("/admin/listado/completo")) {
      clonedNav.push({
        id: "admin.llenar-listado",
        path: "/admin/listado/completo",
        type: NAV_TYPE_ITEM,
        title: "Llenar Listado",
        transKey: "nav.admin.llenar-listado",
        Icon: HomeIcon,
      });
    }

    if (pathname.includes("/admin/listado/crear")) {
      clonedNav.push({
        id: "admin.crear-listado",
        path: "/admin/listado/crear",
        type: NAV_TYPE_ITEM,
        title: "Crear nuevo Listado",
        transKey: "nav.admin.crear-listado",
        Icon: HomeIcon,
      });
    }

    if (pathname.includes("/admin/agentes/editar")) {
      clonedNav.push({
        id: "admin.editar-agente",
        path: "/admin/agentes/editar",
        type: NAV_TYPE_ITEM,
        title: "Editar  agente",
        transKey: "nav.admin.editar-agente",
        Icon: HomeIcon,
      });
    }

    if (pathname.includes("/admin/agentes/crear")) {
      clonedNav.push({
        id: "admin.crear-agente",
        path: "/admin/agentes/crear",
        type: NAV_TYPE_ITEM,
        title: "Crear nuevo agente",
        transKey: "nav.admin.crear-agente",
        Icon: HomeIcon,
      });
    }
    return clonedNav;
  }, [nav, pathname]);


  return (
    <Accordion
      value={expanded}
      onChange={setExpanded}
      className="flex flex-col overflow-hidden"
    >
      <SimpleBar
        scrollableNodeProps={{ ref }}
        className="h-full overflow-x-hidden pb-6"
        style={{ "--scroll-shadow-size": "32px" }}
      >
        <div className="flex h-full flex-1 flex-col px-4">
          {(() => {
            const itemsWithDivider = [];

            const lastItemIndex = extendedNav
              .map((item, idx) => (item.type === NAV_TYPE_ITEM ? idx : null))
              .filter((idx) => idx !== null)
              .pop();

            extendedNav.forEach((item, idx) => {
              if (
                pathname.includes("/admin/listado/completo") &&
                idx === lastItemIndex
              ) {
                itemsWithDivider.push(<Divider key="custom-divider" />);
              }

              if (
                pathname.includes("/admin/listado/crear") &&
                idx === lastItemIndex
              ) {
                itemsWithDivider.push(<Divider key="custom-divider" />);
              }


              if (
                pathname.includes("/admin/agentes/editar") &&
                idx === lastItemIndex
              ) {
                itemsWithDivider.push(<Divider key="custom-divider" />);
              }

              if (
                pathname.includes("/admin/agentes/crear") &&
                idx === lastItemIndex
              ) {
                itemsWithDivider.push(<Divider key="custom-divider" />);
              }

              switch (item.type) {
                case NAV_TYPE_COLLAPSE:
                  itemsWithDivider.push(
                    <CollapsibleItem key={item.path} data={item} />
                  );
                  break;
                case NAV_TYPE_ITEM:
                  itemsWithDivider.push(
                    <MenuItem key={item.path} data={item} />
                  );
                  break;
                case NAV_TYPE_DIVIDER:
                  itemsWithDivider.push(<Divider key={item.id} />);
                  break;
                default:
                  break;
              }
            });

            return itemsWithDivider;
          })()}
        </div>
      </SimpleBar>
    </Accordion>
  );
}

Menu.propTypes = {
  nav: PropTypes.array,
  pathname: PropTypes.string,
};
