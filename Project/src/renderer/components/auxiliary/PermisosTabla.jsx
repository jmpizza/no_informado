import { useEffect, useState } from "react";

export default function PermisosTable({ users, reload }) {
  const [permisos, setPermisos] = useState([]);

  const fetchPermisos = async () => {
    const res = await window.api.getPermissions(); // <- Necesitas esta API
    if (res.success) setPermisos(res.permissions);
  };

  useEffect(() => {
    fetchPermisos();
  }, []);

  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(users.length / pageSize);
  const usersToShow = users.slice((page - 1) * pageSize, page * pageSize);

  const next = () => page < totalPages && setPage(page + 1);
  const prev = () => page > 1 && setPage(page - 1);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPermissions, setNewPermissions] = useState([]);

  const openModal = (u) => {
    setSelectedUser(u);
    setNewPermissions(u.permissions.map(p => p.id)); // usuario ya trae permisos
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  const togglePermission = (pid) => {
    setNewPermissions(prev =>
      prev.includes(pid)
        ? prev.filter(id => id !== pid)
        : [...prev, pid]
    );
  };

  const saveChanges = async () => {
    await window.api.updateUserPermissions({
      user_id: selectedUser.id,
      permissions: newPermissions,
    });

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
            <th className="p-2 font-semibold">Permisos</th>
            <th className="p-2 font-semibold">Acción</th>
          </tr>
        </thead>
        <tbody>
          {usersToShow.map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="p-2 text-sm">{u.name}</td>
              <td className="p-2 text-sm">{u.id}</td>
              <td className="p-2 text-sm">
                {u.permissions?.length > 0
                  ? u.permissions.map(p => p.name).join(", ")
                  : "Sin permisos"}
              </td>
              <td className="p-2">
                <div
                  className="cursor-pointer px-3 py-1 text-xs text-black font-semibold border border-gray-300 bg-white hover:bg-gray-300 rounded-lg flex justify-center items-center"
                  onClick={() => openModal(u)}
                >
                  Modificar permisos
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINACIÓN */}
      <div className="flex justify-between items-center mt-4">
        <div
          onClick={prev}
          className={`px-6 py-3 bg-blue-700 rounded-lg text-sm ${
            page === 1
              ? "bg-gray-300 text-black cursor-not-allowed font-semibold"
              : "hover:bg-blue-900 text-white cursor-pointer"
          }`}
        >
          Anterior
        </div>

        <span className="text-sm">Página {page} de {totalPages}</span>

        <div
          onClick={next}
          className={`px-6 py-3 bg-blue-700 rounded-lg text-sm ${
            page === totalPages
              ? "bg-gray-300 text-black cursor-not-allowed font-semibold"
              : "hover:bg-blue-900 text-white cursor-pointer"
          }`}
        >
          Siguiente
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-bluebg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-xl p-6 shadow-xl">

            <h2 className="text-lg font-semibold mb-2">Modificar permisos</h2>
            <p className="text-sm text-gray-600 mb-4">
              Edita los permisos de <b>{selectedUser.name}</b>
            </p>

            <div className="max-h-56 overflow-y-auto border rounded-lg p-3">
              {permisos.map(p => (
                <label key={p.id} className="flex items-center gap-2 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={newPermissions.includes(p.id)}
                    onChange={() => togglePermission(p.id)}
                  />
                  {p.name}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <div
                onClick={closeModal}
                className="cursor-pointer px-4 py-2 rounded-lg border hover:bg-gray-300"
              >
                Cancelar
              </div>

              <div
                onClick={saveChanges}
                className="cursor-pointer px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-900"
              >
                Guardar cambios
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
