import { useState } from "react";
import { UserPlus, PanelLeft } from "lucide-react";
import { useAuth } from "./AuthContext";

export default function UserRegister() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [cedula, setCedula] = useState("");
    const [confirmCedula, setConfirmCedula] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rol, setRol] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const { createUser } = useAuth();

    const handleChange = (event) => {
        setRol(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validaciones básicas
        if (!name || !surname || !email || !cedula || !password || !rol) {
            setError("Todos los campos son obligatorios");
            return;
        }

        if (email !== confirmEmail) {
            setError("Los correos electrónicos no coinciden");
            return;
        }

        if (cedula !== confirmCedula) {
            setError("Las cédulas no coinciden");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        setLoading(true);

        try {
            const userData = {
                id: Number(cedula),
                name,
                last_name: surname,  // Cambiado a last_name
                email,
                password,
                rol_id: Number(rol)  // Enviar directamente el número del rol
            };

            const result = await createUser(userData);

            if (result.success) {
                setSuccess("Usuario creado exitosamente");
                setName("");
                setSurname("");
                setEmail("");
                setConfirmEmail("");
                setCedula("");
                setConfirmCedula("");
                setPassword("");
                setConfirmPassword("");
                setRol("");
            } else {
                setError(result.error || "Error al crear usuario");
            }
        } catch (err) {
            setError("Error al crear usuario. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const ItemRegister = [
        { title: "Nombre", placeholder: "Ingrese los nombres", type: "text", fun: setName, value: name },
        { title: "Apellidos", placeholder: "Ingrese los apellidos", type: "text", fun: setSurname, value: surname },
        { title: "Correo electrónico", placeholder: "correo@ejemplo.com", type: "email", fun: setEmail, value: email },
        { title: "Confirmar correo electrónico", placeholder: "Confirmar el correo electrónico", type: "email", fun: setConfirmEmail, value: confirmEmail },
        { title: "Cédula", placeholder: "Ingrese el número de cédula", type: "number", fun: setCedula, value: cedula },
        { title: "Confirmar la cédula", placeholder: "Confirmar el número de cédula", type: "number", fun: setConfirmCedula, value: confirmCedula },
        { title: "Contraseña", placeholder: "Ingrese la contraseña", type: "password", fun: setPassword, value: password },
        { title: "Confirmar la contraseña", placeholder: "Confirmar la contraseña", type: "password", fun: setConfirmPassword, value: confirmPassword },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <div className="flex flex-row gap-2 p-4 shadow items-center bg-white">
                <PanelLeft className="text-black p-3" size={60} />
                <div className="flex flex-col">
                    <span className="text-black font-semibold">Panel de administración</span>
                    <span className="text-sm text-gray-700">
                        Gestión de usuarios y control de caja
                    </span>
                </div>
            </div>

            {/* Contenedor principal centrado */}
            <div className="flex flex-col items-center justify-center flex-1 p-6">
                <div className="bg-white flex flex-col shadow-2xl rounded-2xl w-full max-w-3xl">
                    {/* Encabezado */}
                    <div className="flex flex-row px-10 pt-4 items-center gap-4 mt-4">
                        <UserPlus
                            className="flex-none text-blue-800 bg-blue-100 rounded-2xl p-3"
                            size={60}
                        />
                        <div>
                            <span className="text-black flex items-center font-semibold text-lg">
                                Registrar nuevo usuario
                            </span>
                            <span className="flex items-center text-gray-700 text-sm">
                                Complete el formulario para crear un nuevo usuario
                            </span>
                        </div>
                    </div>

                    <hr className="text-gray-300 mt-5" />

                    <form onSubmit={handleSubmit}>
                        {/* Campos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                            {ItemRegister.map((item, index) => (
                                <div key={index} className="flex flex-col">
                                    <span className="text-black text-sm mb-1 font-bold">{item.title}</span>
                                    <input
                                        className="w-full text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type={item.type}
                                        placeholder={item.placeholder}
                                        value={item.value}
                                        onChange={(e) => item.fun && item.fun(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Rol */}
                        <div className="flex flex-col md:flex-row justify-center mx-10 items-center gap-4 mb-6">
                            <span className="text-black text-sm font-bold">Rol</span>
                            <select
                                value={rol}
                                onChange={handleChange}
                                className="w-full md:w-auto flex-1 text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={loading}
                            >
                                <option value="">-- Seleccione un rol --</option>
                                <option value="1">Administrador</option>
                                <option value="2">Cajero</option>
                                <option value="3">Operador</option>
                            </select>
                        </div>

                        {/* Mensajes de error/éxito */}
                        {error && (
                            <div className="mx-10 mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mx-10 mb-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        {/* Botón */}
                        <div className="w-full flex px-10 pb-6 justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 w-full md:w-auto px-6 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creando usuario..." : "Confirmar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
