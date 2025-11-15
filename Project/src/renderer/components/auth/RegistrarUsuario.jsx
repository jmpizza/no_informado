import { useState } from "react";
import { UserPlus, PanelLeft } from "lucide-react";

export default function RegistrarUsuario() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [cedula, setCedula] = useState("");
    const [confirmCedula, setConfirmCedula] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rol, setRol] = useState("");

    const handleChange = (event) => {
        setRol(event.target.value);
    };

    const handleSubmit = (e) => {
        console.log(name, surname, email, cedula, rol);
    };

    const ItemRegister = [
        { title: "Nombre", placeholder: "Ingrese los nombres", type: "text", fun: setName },
        { title: "Apellidos", placeholder: "Ingrese los apellidos", type: "text", fun: setSurname },
        { title: "Correo electrónico", placeholder: "correo@ejemplo.com", type: "email", fun: setEmail },
        { title: "Confirmar correo electrónico", placeholder: "Confirmar el correo electrónico", type: "email", fun: setConfirmEmail },
        { title: "Cédula", placeholder: "Ingrese el número de cédula", type: "text", fun: setCedula },
        { title: "Confirmar la cédula", placeholder: "Confirmar el número de cédula", type: "text", fun: setConfirmCedula },
        { title: "Contraseña", placeholder: "Ingrese la contraseña", type: "password", fun: setPassword },
        { title: "Confirmar la contraseña", placeholder: "Confirmar la contraseña", type: "password", fun: setConfirmPassword },
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
                                Complete el formulario para crear un nuevo usuario cajero
                            </span>
                        </div>
                    </div>

                    <hr className="text-gray-300 mt-5" />

                    {/* Campos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                        {ItemRegister.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <span className="text-black text-sm mb-1 font-bold">{item.title}</span>
                                <input
                                    className="w-full text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type={item.type}
                                    placeholder={item.placeholder}
                                    onChange={(e) => item.fun && item.fun(e.target.value)}
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
                        >
                            <option value="">-- Seleccione un rol --</option>
                            <option value="operador">Operador de caja</option>
                            <option value="administrador">Administrador</option>
                            <option value="cajero">Cajero</option>
                        </select>
                    </div>

                    {/* Botón */}
                    <div className="w-full flex px-10 pb-6 justify-center">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 w-full md:w-auto px-6 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
