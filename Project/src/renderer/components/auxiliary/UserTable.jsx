import { useState } from "react";

export default function UserTable() {

    // ====== Datos simulados (mock) ======
    const mockUsers = [
        { id: 1, nombre: "Juan Pérez García", cedula: "1234567890", rol: "Cajero" },
        { id: 2, nombre: "María González López", cedula: "9876543210", rol: "Supervisor" },
        { id: 3, nombre: "Ana Torres Ruiz", cedula: "1111111111", rol: "Administrador" },
        { id: 4, nombre: "Pedro Duarte", cedula: "2222222222", rol: "Cajero" },
        { id: 5, nombre: "Sandra Beltrán", cedula: "3333333333", rol: "Supervisor" },
        { id: 6, nombre: "Luis Cárdenas", cedula: "4444444444", rol: "Cajero" },
        { id: 7, nombre: "Carolina Herrera", cedula: "5555555555", rol: "Administrador" },
        { id: 8, nombre: "Óscar Prieto", cedula: "6666666666", rol: "Cajero" },
        { id: 9, nombre: "Lucía Ramírez", cedula: "7777777777", rol: "Supervisor" },
        { id: 10, nombre: "Mateo Vargas", cedula: "8888888888", rol: "Cajero" },
    ];

    // ========= PAGINACIÓN =========
    const [page, setPage] = useState(1);
    const pageSize = 4;
    const totalPages = Math.ceil(mockUsers.length / pageSize);

    const usersToShow = mockUsers.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const next = () => page < totalPages && setPage(page + 1);
    const prev = () => page > 1 && setPage(page - 1);

    // ====== Colores de roles ======
    const roleColors = {
        "Cajero": "bg-gray-200 text-black",
        "Supervisor": "bg-gray-200 text-black",
        "Administrador": "bg-yellow-700 text-white"
    };

    // ========= MODAL =========
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState("");

    const openModal = (user) => {
        setSelectedUser(user);
        setNewRole(user.rol);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedUser(null);
    };

    const saveChanges = () => {
        const payload = {
            id: selectedUser.id,
            rolAnterior: selectedUser.rol,
            rolNuevo: newRole
        };

        console.log("Enviar a backend:", payload);

        closeModal();
    };

    return (
        <div className="text-black px-6 pb-6 bg-white rounded-xl shadow-md">

            {/* ================= TABLA (NO SE MODIFICÓ NADA) ================= */}
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="">
                        <th className="p-2 font-semibold">Nombre completo</th>
                        <th className="p-2 font-semibold">Cédula</th>
                        <th className="p-2 font-semibold">Rol actual</th>
                        <th className="p-2 font-semibold">Acción</th>
                    </tr>
                </thead>

                <tbody>
                    {usersToShow.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="p-2 text-sm">{user.nombre}</td>
                            <td className="p-2 text-sm">{user.cedula}</td>
                            <td className="p-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs ${roleColors[user.rol]}`}
                                >
                                    {user.rol}
                                </span>
                            </td>
                            <td className="p-2">
                                <div
                                    className="cursor-pointer px-3 py-1 text-xs text-black font-semibold border border-gray-300 bg-white hover:bg-gray-300 rounded-lg flex justify-center items-center"
                                    onClick={() => openModal(user)}
                                >
                                    Modificar rol
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ========= CONTROLES DE PAGINACIÓN ========= */}
            <div className="flex justify-between items-center mt-4">
                <div
                    disabled={page === 1}
                    onClick={prev}
                    className={`px-6 py-3 flex justify-center items-center bg-blue-700 rounded-lg text-sm ${page === 1
                        ? "bg-gray-300 text-black cursor-not-allowed font-semibold"
                        : "hover:bg-blue-900 text-white cursor-pointer"
                        }`}
                >
                    Anterior
                </div>

                <span className="text-sm">
                    Página {page} de {totalPages}
                </span>

                <div
                    disabled={page === totalPages}
                    onClick={next}
                    className={`px-6 py-3 flex justify-center items-center bg-blue-700 rounded-lg text-sm ${page === totalPages
                        ? "bg-gray-300 text-black cursor-not-allowed font-semibold"
                        : "hover:bg-blue-900 text-white cursor-pointer"
                        }`}
                >
                    Siguiente
                </div>
            </div>

            {/* ================= MODAL ================= */}
            {isOpen && (
                <div className="fixed inset-0 bg-bluebg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[420px] rounded-xl p-6 shadow-xl">

                        <h2 className="text-lg font-semibold mb-2">
                            Modificar rol de usuario
                        </h2>

                        <p className="text-sm text-gray-600 mb-4">
                            Selecciona el nuevo rol para <b>{selectedUser.nombre}</b>
                        </p>

                        <label className="text-sm font-medium">Rol actual</label>

                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="w-full mt-1 mb-4 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Cajero">Cajero</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Administrador">Administrador</option>
                        </select>

                        <div className="flex justify-end gap-3">
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
