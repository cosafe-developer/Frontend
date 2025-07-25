import {
  ArrowPathIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/20/solid";

const ListadoCards = ({ stats }) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-4 2xl:gap-6">
      <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
        <div className="flex justify-between space-x-1">
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            {stats.listados_activos}
          </p>
          <CurrencyDollarIcon className="size-5 text-secondary" />
        </div>
        <p className="mt-1 text-xs-plus">Listados Activos</p>
      </div>
      <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
        <div className="flex justify-between space-x-1">
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            {stats.agentes_asignados}
          </p>
          <CheckBadgeIcon className="size-5 text-success" />
        </div>
        <p className="mt-1 text-xs-plus">Agentes Asignados</p>
      </div>
      <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
        <div className="flex justify-between space-x-1">
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            {stats.empresas_listados_activos}
          </p>
          <ArrowPathIcon className="size-5 text-primary-500" />
        </div>
        <p className="mt-1 text-xs-plus">Empresas con Listados Activos</p>
      </div>
      <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
        <div className="flex justify-between space-x-1">
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            {stats.empresas_listados_pendientes}
          </p>
          <ClockIcon className="size-5 text-warning" />
        </div>
        <p className="mt-1 text-xs-plus">Empresas Pendientes de Llenado</p>
      </div>
    </div>
  )
}
export default ListadoCards;