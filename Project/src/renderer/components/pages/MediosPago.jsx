import { useState, useEffect } from "react";
import {
    DollarSign,
    CreditCard,
    Wallet,
    Smartphone,
    Building,
    QrCode,
    Landmark,
    Receipt,
} from "lucide-react";

export default function MediosPago() {
    // 💡 Valor pre-llenado de la imagen
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [activeTab, setActiveTab] = useState("add");

    // ✅ Reemplazado Modal por Popover 
    const [showPopover, setShowPopover] = useState(false);

    const iconOptions = [
        { label: "Efectivo", icon: DollarSign, color: "text-green-600" },
        { label: "Tarjeta", icon: CreditCard, color: "text-blue-600" },
        { label: "Transferencia", icon: Landmark, color: "text-gray-700" },
        { label: "Datáfono", icon: Receipt, color: "text-indigo-600" },
        { label: "Nequi", icon: Smartphone, color: "text-purple-600" },
        { label: "Daviplata", icon: Wallet, color: "text-red-500" },
        { label: "Billetera", icon: Wallet, color: "text-orange-500" },
        { label: "QR", icon: QrCode, color: "text-pink-600" },
        { label: "Bancolombia", icon: Building, color: "text-yellow-500" },
    ];

    // 💡 Icono seleccionado por defecto para coincidir con la imagen: DollarSign (Efectivo)
    const defaultIcon = iconOptions.find(item => item.label === "Efectivo");
    const [selectedIcon, setSelectedIcon] = useState(defaultIcon);



    const [data, setData] = useState([]);

    const fetchData = async () => {
        const datos = [
            { icon: DollarSign, Nombre: "Efectivo", Edad: "Pago en efectivo", Ciudad: "Activo", Correo: "Bloqueado" },
            { icon: Building, Nombre: "María", Edad: 32, Ciudad: "Medellín", Correo: "maria@mail.com" },
            { icon: CreditCard, Nombre: "Juan", Edad: 28, Ciudad: "Bogotá", Correo: "juan@mail.com" },
        ];
        setData(datos);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const headers = ["Icono", "Nombre", "Descripcion", "Estado", "Accion"]; // primera columna vacía para icono

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            return alert("Debes ingresar un nombre");
        }

        // Cierra el popover si está abierto
        setShowPopover(false);

        alert(`Medio de pago agregado: ${name}`);
        console.log({
            name,
            description,
            icon: selectedIcon?.label,
        });
    };

    const handleIconSelect = (item) => {
        setSelectedIcon(item);
        setShowPopover(false); // Cierra el popover al seleccionar un ícono
    }


    return (
        <div className="flex flex-col h-screen p-20 bg-gray-100">
            <div>
                <span className="text-black text-2xl font-semibold">Configuración</span>
                <span className="block text text-gray-700">Medios de Pago</span>
            </div>

            <div className="bg-white rounded-xl shadow-lg mt-8">
                {/* --- Tabs --- */}
                <div className="flex flex-row border-b border-gray-200 px-8">
                    <span
                        onClick={() => setActiveTab("add")}
                        className={`p-4 text-center border-b-2 text-sm flex justify-center items-center cursor-pointer font-medium ${activeTab === "add" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-700 hover:text-black"
                            }`}
                    >
                        Agregar medio de pago
                    </span>

                    <span
                        onClick={() => setActiveTab("disable")}
                        className={`p-4 text-center border-b-2 text-sm flex justify-center items-center cursor-pointer font-medium ${activeTab === "disable" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-700 hover:text-black"
                            }`}
                    >
                        Deshabilitar medio de pago
                    </span>
                </div>

                {/* --- Contenido del Tab --- */}
                {activeTab === "add" ? (
                    <form onSubmit={handleSubmit}>
                        {/* Encabezado */}
                        <div className="flex flex-row px-10 pt-8 items-center gap-4">
                            <CreditCard className="flex-none text-green-600 row-span-2 bg-green-400/20 rounded-full p-2" size={48} />
                            <div>
                                <span className="text-black flex items-center font-medium">Agregar nuevo medio de pago</span>
                                <span className="flex items-center text-gray-500 text-sm">
                                    Complete la información para crear un nuevo medio de pago
                                </span>
                            </div>
                        </div>

                        {/* Campos de Formulario e Icono */}
                        <div className="flex flex-row gap-8 px-10 py-8">

                            {/* ✅ ICON PICKER (Popover) */}
                            <div className="relative flex flex-col items-start gap-1">
                                <span className="text-sm text-gray-700">Icono</span>
                                <div
                                    className="rounded-xl border border-gray-300 w-32 aspect-square flex-none cursor-pointer flex items-center justify-center p-2"
                                    onClick={() => setShowPopover(!showPopover)}
                                    // Borde azul si está seleccionado/activo, como en la imagen
                                    style={{ borderColor: showPopover ? '#2563EB' : selectedIcon ? selectedIcon.color.replace('text-', '').replace('-600', '-500') : '#d1d5db' }}
                                >
                                    {selectedIcon ? (
                                        <selectedIcon.icon className={selectedIcon.color} size={64} />
                                    ) : (
                                        <DollarSign className="text-gray-500" size={64} /> // Ícono por defecto sin seleccionar
                                    )}
                                </div>

                                {showPopover && (
                                    <div className="absolute top-full left-0 mt-2 z-10 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 w-60">
                                        <span className="block font-medium text-sm text-black mb-3">Selecciona un ícono</span>
                                        <div className="grid grid-cols-3 gap-2">
                                            {iconOptions.map((item) => (
                                                <button
                                                    type="button" // Evita el envío del formulario
                                                    key={item.label}
                                                    onClick={() => handleIconSelect(item)}
                                                    className={`flex flex-col items-center p-2 rounded-lg transition ${selectedIcon?.label === item.label ? 'bg-blue-100 border border-blue-400' : 'hover:bg-gray-100'}`}
                                                >
                                                    <item.icon className={item.color} size={32} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>


                            <div className="flex flex-col gap-4 grow">
                                {/* Campo Nombre */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-700">Nombre del medio de pago</span>
                                    <input
                                        type="text"
                                        className="w-full text-black border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ej: Nequi, Bancolombia, Efectivo..."
                                        required
                                    />
                                </div>

                                {/* Campo Descripción */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-700">Descripción</span>
                                    <input
                                        type="text"
                                        className="w-full text-black border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Ingresa una descripción (opcional)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botón Confirmar */}
                        <div className="w-full flex-1 px-10 pb-6 flex text-center justify-center flex-col gap-4">
                            <div
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Confirmar
                            </div>
                        </div>
                    </form>
                ) : (
                    // Placeholder para la pestaña de Deshabilitar
                    <div className="p-8 text-gray-500">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {headers.map((header, index) => (
                                            <th
                                                key={index}
                                                className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((row, index) => {
                                        const Icon = row.icon; // obtener el componente del icono dinámicamente
                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="w-10 max-w-10 px-6 py-4 text-gray-700">
                                                    <Icon className="w-5 h-5" />
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{row.Nombre}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{row.Edad}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{row.Ciudad}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{row.Correo}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
