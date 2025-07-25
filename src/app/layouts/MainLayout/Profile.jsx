// Import Dependencies
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { TbUser } from "react-icons/tb";
// import { TbCoins, TbUser } from "react-icons/tb";

// Local Imports
import { Avatar, AvatarDot, Button } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { useState } from "react";

// ----------------------------------------------------------------------

const links = [
  {
    id: "1",
    title: "Perfil",
    description: "",
    to: "/configuracion/general",
    Icon: TbUser,
    color: "warning",
  },
  {
    id: "5",
    title: "Configuración",
    description: "",
    to: "/configuracion/apariencia",
    Icon: Cog6ToothIcon,
    color: "success",
  },
];

export function Profile() {
  const { logout } = useAuthContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Popover className="relative">
      <PopoverButton
        as={Avatar}
        size={12}
        role="button"
        src="/images/100x100.png"
        alt="Profile"
        indicator={
          <AvatarDot color="success" className="ltr:right-0 rtl:left-0" />
        }
        classNames={{
          root: "cursor-pointer",
        }}
      />
      <Transition
        enter="duration-200 ease-out"
        enterFrom="translate-x-2 opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="duration-200 ease-out"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-2 opacity-0"
      >
        <PopoverPanel
          anchor={{ to: "right end", gap: 12 }}
          className="border-gray-150 shadow-soft dark:border-dark-600 dark:bg-dark-700 z-70 flex w-64 flex-col rounded-lg border bg-white transition dark:shadow-none"
        >
          {({ close }) => (
            <>
              <div className="dark:bg-dark-800 flex items-center gap-4 rounded-t-lg bg-gray-100 px-4 py-5">
                <Avatar
                  size={14}
                  src="/images/100x100.png"
                  alt="Profile"
                />
                <div>
                  <Link
                    className="hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400 text-base font-medium text-gray-700"
                    to="/configuracion/general"
                  >
                    Admin
                  </Link>

                  <p className="dark:text-dark-300 mt-0.5 text-xs text-gray-400">
                    admin
                  </p>
                </div>
              </div>
              <div className="flex flex-col pt-2 pb-5">
                {links.map((link) => (
                  <Link
                    key={link.id}
                    to={link.to}
                    onClick={close}
                    className="group dark:hover:bg-dark-600 dark:focus:bg-dark-600 flex items-center gap-3 px-4 py-2 tracking-wide outline-hidden transition-all hover:bg-gray-100 focus:bg-gray-100"
                  >
                    <Avatar
                      size={8}
                      initialColor={link.color}
                      classNames={{ display: "rounded-lg" }}
                    >
                      <link.Icon className="size-4.5" />
                    </Avatar>
                    <div>
                      <h2 className="group-hover:text-primary-600 group-focus:text-primary-600 dark:text-dark-100 dark:group-hover:text-primary-400 dark:group-focus:text-primary-400 font-medium text-gray-800 transition-colors">
                        {link.title}
                      </h2>
                      <div className="dark:text-dark-300 truncate text-xs text-gray-400">
                        {link.description}
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="px-4 pt-4">
                  <Button
                    className="w-full gap-2"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <ArrowLeftStartOnRectangleIcon className="size-4.5" />
                    <span>{isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
