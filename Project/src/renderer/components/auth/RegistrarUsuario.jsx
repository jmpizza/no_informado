import { useState } from "react";
import { UserPlus, PanelLeft } from "lucide-react";

export default function RegistrarUsuario() {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [cedula, setCedula] = useState("");
    const [confirmCedula, setConfirmCedula] = useState("");

    const handleSubmit = (e) => {
        console.log(name, surname, email, cedula);
    };


    const ItemRegister = [{ title: "Nombre", placeholder: "Ingrese los nombres", type: "text", fun: setName },
    { title: "Apellidos", placeholder: "Ingrese los apellidos", type: "text", fun: setSurname },
    { title: "Correo electronico", placeholder: "correo@ejemplo.com", type: "email", fun: setEmail },
    { title: "Confirmar correo electronico", placeholder: "Confirmar el correo electronico", type: "email", fun: setConfirmEmail },
    { title: "Cedula", placeholder: "Ingrese el nummero de cedula", type: "text", fun: setCedula },
    { title: "Confirmar la cedula", placeholder: "Confirmar el numero de cedula", type: "text", fun: setConfirmCedula },
    ];

    return (
        <div>
            <div className="flex flex-row gap-2 p-4 shadow items-center">
                <PanelLeft className="text-black p-3" size={60} />
                <div className="flex flex-col">
                    <span className="text-black">Panel de administracion</span>
                    <span className="text-sm text-gray-700">Gestion de usuarios y control de caja</span>
                </div>
            </div>
            <div className="flex flex-col h-full p-20">
                <div className="bg-white flex flex-col shadow-2xl rounded-2xl">
                    <div className="flex flex-row px-10 pt-2 items-center gap-4 mt-4">
                        <UserPlus className="flex-none text-blue-800 row-span-2 bg-blue-100 rounded-2xl p-3" size={60} />
                        <div>
                            <span className="text-black flex items-center font-bold">Registrar nuevo usuario</span>
                            <span className="flex items-center text-gray-700 text-sm">
                                Complete el formulario para crear un nuevo usuario cajero
                            </span>
                        </div>
                    </div>
                    <hr className="text-gray-300 mt-5" />
                    <div className="grid grid-cols-2 gap-8 p-10">
                        {ItemRegister.map((item, index) => {
                            return (

                                <div
                                    key={index}
                                    className="flex flex-col">
                                    <span className="text-black text-sm mb-1 font-bold">{item.title}</span>
                                    <input
                                        className="w-full text-black border border-gray-400 rounded-xl p-2 pr-10 text-sm"
                                        type={item.type}
                                        placeholder={item.placeholder}
                                        onChange={(e) => item.fun && item.fun(e.target.value)}
                                    />

                                </div>
                            )
                        })}
                    </div>

                    <div className="w-full flex-1 px-10 pb-6 flex text-center justify-center flex-col gap-4">
                        < div
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Confirmar
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}









