import React from "react";
import {
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineRefresh,
  HiOutlineClock,
} from "react-icons/hi";

const StatsCards = () => {
  const stats = [
    {
      value: 7,
      label: "Listados Activos",
      icon: <HiOutlineCurrencyDollar className="text-pink-500" size={20} />,
    },
    {
      value: 14,
      label: "Agentes Asignados",
      icon: <HiOutlineCheckCircle className="text-green-500" size={20} />,
    },
    {
      value: 7,
      label: "Empresas con Listados Activos",
      icon: <HiOutlineRefresh className="text-blue-500" size={20} />,
    },
    {
      value: 2,
      label: "Empresas Pendientes de Llenado",
      icon: <HiOutlineClock className="text-yellow-500" size={20} />,
    },
    
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-[#1e1f24] rounded-md px-4 py-6 flex justify-between items-center min-h-[100px]"
        >
          <div className="flex flex-col justify-center">
            <p className="text-white font-semibold text-[25px]">{item.value}</p>
            <p className="text-gray-400 text-[12px]">{item.label}</p>
          </div>
          <div className="bg-[#2c2d33] p-2 rounded-full relative -translate-y-5">
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
export default StatsCards;
