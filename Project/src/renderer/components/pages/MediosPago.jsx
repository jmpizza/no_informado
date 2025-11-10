import { useState } from "react";
import { DollarSign, CreditCard, Wallet, ChevronDown } from "lucide-react";

export default function MediosPago() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            return alert("Debes ingresar un nombre");
        }
        alert(`Medio de pago agregado: ${name}`);
        // Tambien gestionar el apartado de guardar la imagen
    };

    function getFile(event) {
        const img = event.target.files?.[0];
        if (!img) return;
        setFile(URL.createObjectURL(img));
    }

    const [activeTab, setActiveTab] = useState("add");

    return (
        <div className="flex flex-col h-full p-20">
            <div>
                <span className="text-black text-2xl">Configuracion</span>
                <span className="block text text-gray-700">Medio de pago</span>
            </div>

            <div className="rounded-2xl shadow-2xl mt-10">

                <div className="flex flex-row">
                    <span
                        onClick={() => setActiveTab("add")}
                        className={`p-4 text-center border-b-2 text-sm flex justify-center items-center cursor-pointer
        ${activeTab === "add" ? "border-blue-600 text-blue-600" : "border-transparent text-black"}`}
                    >
                        Agregar medio de pago
                    </span>

                    <span
                        onClick={() => setActiveTab("disable")}
                        className={`p-4 text-center border-b-2 text-sm flex justify-center items-center cursor-pointer
        ${activeTab === "disable" ? "border-blue-600 text-blue-600" : "border-transparent text-black"}`}
                    >
                        Deshabilitar medio de pago
                    </span>
                </div>


                {activeTab === "add" ? (
                    <div>
                        <div className="flex flex-row px-10 pt-2 items-center gap-4 mt-4">
                            <CreditCard className="flex-none text-green-600 row-span-2 bg-green-400/30 rounded-full p-3" size={60} />
                            <div>
                                <span className="text-black flex items-center font-medium">Agregar nuevo medio de pago</span>
                                <span className="flex items-center text-gray-700 text-sm">
                                    Complete la informacion para crear un nuevo medio de pago
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-row gap-4 px-10 py-5">
                            <div className="hover:bg-gray-300 rounded-lg bg-gray-200 relative w-40 aspect-square flex-none">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={getFile}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                <div className="rounded-lg flex items-center justify-center w-full h-full overflow-hidden">
                                    {file ? (
                                        <img
                                            src={file}
                                            alt="preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <DollarSign className="text-green-600 p-3" size={80} />
                                    )}
                                </div>

                                {/* Flechita abajo a la derecha */}
                                <ChevronDown className="absolute bottom-1 right-1 text-gray-500" size={18} />
                            </div>


                            <div className="flex flex-col gap-3 w-full">
                                <span className="text-sm text-black">Medio de pago</span>
                                <input
                                    type="text"
                                    className="w-full text-black border border-gray-400 rounded-xl p-2 pr-10 text-sm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Nequi, Bancolombia, Efectivo..."
                                />

                                <span className="text-sm text-black">Descripcion</span>
                                <input
                                    type="text"
                                    className="w-full text-black border border-gray-400 rounded-xl p-2 pr-10 text-sm"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descripción breve"
                                />
                            </div>
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
                ) : (
                    <div className="w-full h-20 bg-red-200 rounded-xl mt-4"></div>
                )}






            </div>
        </div>
    );
}








