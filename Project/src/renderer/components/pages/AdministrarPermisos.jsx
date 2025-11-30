import { PanelLeft, KeyRound, Search } from 'lucide-react';
import { useEffect, useState } from "react";
import PermisosTable from "../auxiliary/PermisosTabla";

export default function AdministrarPermisos() {
  const [busqueda, setBusqueda] = useState("");
  const [cedulaBusqueda, setCedulaBusqueda] = useState("");
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const fetchUsers = async () => {
    const res = await window.api.getUsers();
    if (res.success) {
      setUsers(res.users);
      setFiltered(res.users);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    const f = users.filter(u =>
      (busqueda === "" || u.name.toLowerCase().includes(busqueda.toLowerCase())) &&
      (cedulaBusqueda === "" || u.id.toString().includes(cedulaBusqueda))
    );
    setFiltered(f);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-row gap-2 p-4 shadow items-center bg-white">
        <PanelLeft className="text-black p-3" size={60} />
        <div className="flex flex-col">
          <span className="text-black font-semibold">Panel de administración</span>
          <span className="text-sm text-gray-700">Gestión de permisos y control de accesos</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="bg-white flex flex-col shadow-2xl rounded-2xl w-full max-w-3xl">
          <div className="flex flex-row px-10 pt-6 items-center gap-4">
            <KeyRound className="flex-none text-blue-600 row-span-2 bg-blue-400/20 p-2" size={48} />
            <div className="flex flex-col">
              <span className="text-black font-semibold">Administrar permisos de usuario</span>
              <span className="text-sm text-gray-700">Busca un usuario y modifica sus permisos dentro del sistema</span>
            </div>
          </div>

          <div className='grid grid-cols-2 grid-rows-[min-content_1fr] text-black px-8 py-4 gap-x-6'>
            <span className="text-black text-sm mb-1 font-bold">Nombre o apellido</span>
            <span className="text-black text-sm mb-1 font-bold">Cédula</span>

            <input
              type="text"
              className="w-full text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese nombre o apellido"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <input
              type="number"
              className="w-full text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese la cédula"
              value={cedulaBusqueda}
              onChange={(e) => setCedulaBusqueda(e.target.value)}
            />
          </div>

          <div onClick={handleSearch} className="px-8 mb-4 w-fit">
            <div className='flex cursor-pointer items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg'>
              <Search size={16} />
              <span>Buscar usuario</span>
            </div>
          </div>

          <PermisosTable users={filtered} reload={fetchUsers} />
        </div>
      </div>
    </div>
  );
}
