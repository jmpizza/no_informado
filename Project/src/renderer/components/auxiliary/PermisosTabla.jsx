import { useEffect, useState } from "react";

export default function PermisosTable({ users, reload }) {
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(users.length / pageSize);
  const usersToShow = users.slice((page - 1) * pageSize, page * pageSize);
  
  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {}; 

  const next = () => page < totalPages && setPage(page + 1);
  const prev = () => page > 1 && setPage(page - 1);

  const toggleStatus = async (user) => {
    if (loggedInUser.id === user.id) {
      alert("No se puede desactivar a si mismo.");
      return;
    }

    const updatedUser = { 
      id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      status: !user.status,
      rol_id: user.rol_id
    };

    await window.api.updateUser(updatedUser);
    reload();
  };

  return (
    <div className="text-black px-6 pb-6 bg-white rounded-xl shadow-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 font-semibold">Nombre completo</th>
            <th className="p-2 font-semibold">Cédula</th>
            <th className="p-2 font-semibold">Estado</th>
            <th className="p-2 font-semibold">Acción</th>
          </tr>
        </thead>
        <tbody>
          {usersToShow.map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="p-2 text-sm">{u.name}</td>
              <td className="p-2 text-sm">{u.id}</td>
              <td className="p-2 text-sm">
                {u.status ? "Activo" : "Inactivo"}
              </td>
              <td className="p-2">
                <div
                  className={`cursor-pointer px-3 py-1 text-xs font-semibold rounded-lg flex justify-center items-center
                    ${u.status ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"}`}
                  onClick={() => toggleStatus(u)}
                >
                  {u.status ? "Desactivar" : "Activar"}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div
          onClick={prev}
          className={`px-6 py-3 bg-blue-700 rounded-lg text-sm ${page === 1 ? "bg-gray-300 text-black cursor-not-allowed font-semibold" : "hover:bg-blue-900 text-white cursor-pointer"}`}
        >
          Anterior
        </div>

        <span className="text-sm">Página {page} de {totalPages}</span>

        <div
          onClick={next}
          className={`px-6 py-3 bg-blue-700 rounded-lg text-sm ${page === totalPages ? "bg-gray-300 text-black cursor-not-allowed font-semibold" : "hover:bg-blue-900 text-white cursor-pointer"}`}
        >
          Siguiente
        </div>
      </div>
    </div>
  );
}
