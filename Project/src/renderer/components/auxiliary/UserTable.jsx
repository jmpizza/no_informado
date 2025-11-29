import { useEffect, useState } from "react";

export default function UserTable({ users, reload }) {
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    const res = await window.api.getRoles();
    if (res.success) setRoles(res.roles);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(users.length / pageSize);
  const usersToShow = users.slice((page - 1) * pageSize, page * pageSize);

  const next = () => page < totalPages && setPage(page + 1);
  const prev = () => page > 1 && setPage(page - 1);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const openModal = (u) => {
    setSelectedUser(u);
    setNewRole(u.rol_id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  const saveChanges = async () => {
    const updatedUser = {
      id: selectedUser.id,
      name: selectedUser.name,
      last_name: selectedUser.last_name,
      email: selectedUser.email,
      status: selectedUser.status,
      rol_id: Number(newRole),
    };

    await window.api.updateUser(updatedUser);
    reload();
    closeModal();
  };

  return (
    <div className="text-black px-6 pb-6 bg-white rounded-xl shadow-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 font-semibold">Nombre completo</th>
            <th className="p-2 font-semibold">Cédula</th>
            <th className="p-2 font-semibold">Rol actual</th>
            <th className="p-2 font-semibold">Acción</th>
          </tr>
        </thead>
        <tbody>
          {usersToShow.map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="p-2 text-sm">{u.name}</td>
              <td className="p-2 text-sm">{u.id}</td>
              <td className="p-2 text-sm">{u.rol?.name}</td>
              <td className="p-2">
                <div
                  className="cursor-pointer px-3 py-1 text-xs text-black font-semibold border border-gray-300 bg-white hover:bg-gray-300 rounded-lg flex justify-center items-center"
                  onClick={() => openModal(u)}
                >
                  Modificar rol
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div onClick={prev} className={`px-6 py-3 bg-blue-700 rounded-lg text-sm ${page === 1 ? "bg-gray-300 text-black cursor-not-allowed font-semibold" : "hover:bg-blue-900 text-white cursor-pointer"}`}>Anterior</div>

        <span className="text-sm">Página {page} de {totalPages}</span>

        <div onClick={next} className={`px-6 py-3 bg-blue-700 rounded-lg text-sm ${page === totalPages ? "bg-gray-300 text-black cursor-not-allowed font-semibold" : "hover:bg-blue-900 text-white cursor-pointer"}`}>Siguiente</div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-bluebg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-xl p-6 shadow-xl">

            <h2 className="text-lg font-semibold mb-2">Modificar rol de usuario</h2>
            <p className="text-sm text-gray-600 mb-4">Selecciona el nuevo rol para <b>{selectedUser.name}</b></p>

            <label className="text-sm font-medium">Rol actual</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full mt-1 mb-4 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <div onClick={closeModal} className="cursor-pointer px-4 py-2 rounded-lg border hover:bg-gray-300">Cancelar</div>
              <div onClick={saveChanges} className="cursor-pointer px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-900">Guardar cambios</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}