import React, { useEffect, useState } from 'react';
import obtenerEmpresas from '../../../api/empresa/getempresas';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

const agentColors = [
  'bg-purple-600',
  'bg-orange-500',
  'bg-green-500',
  'bg-pink-500',
  'bg-blue-500',
  'bg-yellow-500',
  'bg-red-500',
];

export default function EmpresasTable() {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState({
    empresa: '',
    estudios: '',
    agentes: '',
  });

  const columns = [
    {
      id: 'select',
      header: () => (
        <input
          type="checkbox"
          className="w-3.5 h-3.5 bg-[#1a1a1a] border-[#444] rounded focus:ring-0"
        />
      ),
      cell: () => (
        <input
          type="checkbox"
          className="w-3.5 h-3.5 bg-[#1a1a1a] border-[#444] rounded focus:ring-0"
        />
      ),
      size: 20,
    },
    {
      accessorKey: 'empresa',
      header: () => 'EMPRESA',
      cell: (info) => (
        <div className="flex items-center gap-2 min-w-[220px]">
          <div className="w-6 h-6 rounded-md bg-[#232429] text-white flex items-center justify-center text-[10px]  ">
            {info.row.original.initials}
          </div>
          <span className="font-semibold text-[16px]">
            {info.getValue()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'estudios',
      header: () => 'ESTUDIOS',
      cell: (info) => (
        <div className="flex gap-1 flex-wrap">
          {info.getValue().map((e, i) => (
            <a
              key={i}
              href="#"
              className="text-[#60A5FA] hover:underline text-[14px]"
            >
              {e}
            </a>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'agentes',
      header: () => 'AGENTES ASIGNADOS',
      cell: (info) => (
        <div className="flex -space-x-2">
          {info.getValue().map((a, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full text-white text-[10px] font-medium flex items-center justify-center border-2 border-[#0E0F11] ${agentColors[i % agentColors.length]}`}
            >
              {a}
            </div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'list',
      header: () => 'LIST ASIGNADOS',
      cell: (info) => (
        <span className="text-[14px] text-[#cccccc]">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: 'telefono',
      header: () => 'TELÉFONO',
      cell: (info) => (
        <span className="text-[14px] text-[#cccccc]">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: 'email',
      header: () => 'EMAIL',
      cell: (info) => (
        <span className="text-[14px] text-[#cccccc]">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: 'password',
      header: () => (
        <span className="hidden md:inline text-[#cccccc]">CONTRASEÑA</span>
      ),
      cell: () => <span className="hidden md:inline">************</span>,
    },
    {
      id: 'acciones',
      header: () => (
        <span className="hidden md:inline text-[#cccccc]">ACCIONES</span>
      ),
      cell: () => (
        <button className="hidden md:inline text-gray-400 hover:text-white">
          ⋮
        </button>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empresas = await obtenerEmpresas();

        const mapped = empresas.map((item) => ({
          empresa: item.tradeName,
          initials: getInitials(item.tradeName),
          estudios: item.estudios?.length ? item.estudios : ['PIPC'],
          agentes: item.agentes?.length ? item.agentes : ['AC', 'DM'],
          list: item.list ?? Math.floor(Math.random() * 100),
          telefono: item.phone || '',
          email: item.email || '',
          password: '************',
        }));

        setTableData(mapped);
        setFilteredData(mapped);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // ✅ Filtrado corregido
  useEffect(() => {
    let filtered = [...tableData];

    if (filters.empresa) {
      filtered = filtered.filter((item) =>
        item.empresa?.toLowerCase().includes(filters.empresa.toLowerCase())
      );
    }

    if (filters.estudios) {
      filtered = filtered.filter((item) =>
        item.estudios?.some((e) =>
          e.toLowerCase().includes(filters.estudios.toLowerCase())
        )
      );
    }

    if (filters.agentes) {
      filtered = filtered.filter((item) =>
        item.agentes?.some((a) =>
          a.toLowerCase().includes(filters.agentes.toLowerCase())
        )
      );
    }

    setFilteredData(filtered);
  }, [filters, tableData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-[#0E0F11] text-white p-4 min-h-screen font-sans">
      {/* FILTROS */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="bg-[#2A2C32] px-3 py-1 rounded hover:bg-[#333] text-sm">
          Todos
        </button>
        <button className="bg-[#1c1c1c] px-3 py-1 rounded hover:bg-[#333] text-sm">
          Activos
        </button>
        <button className="bg-[#1c1c1c] px-3 py-1 rounded hover:bg-[#333] text-sm">
          Inactivos
        </button>
      </div>

      {/* TABLA */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm bg-[#0E0F11]">
          <thead className="bg-[#15161A] text-[#cccccc] border-b border-[#2a2a2a]">
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                <tr>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-3 text-left whitespace-nowrap font-semibold text-[13px]"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
                <tr>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-2 py-2">
                      {['empresa', 'estudios', 'agentes'].includes(
                        header.column.id
                      ) && (
                        <input
                          type="text"
                          placeholder="Buscar..."
                          value={filters[header.column.id] || ''}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              [header.column.id]: e.target.value,
                            }))
                          }
                          className="
                            w-full
                            bg-transparent
                            text-[#cccccc]
                            placeholder-[#999999]
                            text-[12px]
                            py-0.5
                            border-b-2 border-[#383A41]
                            focus:outline-none
                          "
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#161616]">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-3 align-top whitespace-nowrap text-[#cccccc]"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex flex-wrap justify-between items-center mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          Show
          <select
            value={pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="bg-[#1a1a1a] px-1 py-0.5 rounded text-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          entries
        </div>

        <div className="flex gap-1 mt-2 sm:mt-0">
          {Array.from({ length: table.getPageCount() }).map((_, i) => (
            <button
              key={i}
              onClick={() => table.setPageIndex(i)}
              className={`px-2 py-1 rounded ${
                i === table.getState().pagination.pageIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1c1c1c] text-[#cccccc] hover:bg-[#2a2a2a]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="mt-2 sm:mt-0">
          {pagination.pageIndex * pagination.pageSize + 1} -{' '}
          {Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            filteredData.length
          )}{' '}
          de {filteredData.length} Listados
        </div>
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}
