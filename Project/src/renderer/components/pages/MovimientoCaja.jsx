import { useEffect, useState } from "react";
import { X , ArrowUp, AlertCircle, Rocket } from "lucide-react";


export default function MovimientoCaja() {
    const [selected, setSelected] = useState(null);
    const [monto, setMonto] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);

    const [metodoPago, setMetodoPago] = useState("");
    const [metodosPago, setMetodosPago] = useState([]);

    const [saldoActual, setSaldoActual] = useState(0);
    const [saldoDespues, setSaldoDespues] = useState(0);
    const [toasts, setToasts] = useState([]);


    const opciones = [
        { id: "ingreso", titulo: "Ingreso", desc: "Entrada de dinero a caja", color: "green" },
        { id: "egreso", titulo: "Egreso", desc: "Salida de dinero a caja", color: "red" },
    ];

    useEffect(() => {
        fetchMetodosPago();
        fetchSaldoActual();
    }, []);

    const showToast = (type, message) => {
        const id = Date.now();

        setToasts(prev => {
            if (prev.some(t => t.message === message)) return prev;
            return [...prev, { id, type, message }];
        });

        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };


    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const fetchMetodosPago = async () => {
        try {
            const response = await window.api.getPaymentMethods(true);
            
            if (response.success && response.data) {
                setMetodosPago(response.data);
            } else {
                showToast("error", "Error al cargar métodos de pago: " + (response.error || "Error desconocido"));
            }
        } catch (error) {
            console.error("Error fetching payment methods:", error);
            showToast("error", "Error al cargar métodos de pago");
        }
    };



    const fetchSaldoActual = async () => {
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                showToast("error", "No hay usuario autenticado");
                return;
            }

            const user = JSON.parse(userStr);
            const response = await window.api.getMovements({ user_id: user.id });

            if (response.success && response.data) {
                const movements = response.data;
                let total = 0;

                movements.forEach(movement => {
                    if (movement.type) {
                        total += movement.ammount;
                    } else {
                        total -= movement.ammount;
                    }
                });

                setSaldoActual(total);
                setSaldoDespues(total);
            }
        } catch (error) {
            console.error("Error calculating balance:", error);
        }
    };

    useEffect(() => {
        const valor = Number(monto) || 0;

        if (selected === "ingreso") {
            setSaldoDespues(saldoActual + valor);
        } else if (selected === "egreso") {
            setSaldoDespues(saldoActual - valor);
        } else {
            setSaldoDespues(saldoActual);
        }
    }, [monto, selected, saldoActual]);

    const handleSubmit = async () => {
        if (!selected) {
            return showToast("error", "Debe seleccionar el tipo de movimiento");
        }

        if (!metodoPago) {
            return showToast("error", "Debe seleccionar un método de pago");
        }

        if (!monto || Number(monto) <= 0) {
            return showToast("error", "Debe ingresar un monto válido");
        }

        const userStr = localStorage.getItem("user");
        if (!userStr) {
            return showToast("error", "No hay usuario autenticado");
        }

        const user = JSON.parse(userStr);
        const metodoSeleccionado = metodosPago.find(m => m.name === metodoPago);

        if (!metodoSeleccionado) {
            return showToast("error", "Método de pago no válido");
        }

        setLoading(true);

        try {
            const movementData = {
                ammount: Number(monto),
                type: selected === "ingreso",
                user_id: user.id,
                payment_method_id: metodoSeleccionado.id,
                closing_id: null,
            };

            const response = await window.api.createMovement(movementData);

            if (response.success) {
                showToast("success", `Movimiento registrado exitosamente`);
                setSelected(null);
                setMonto("");
                setDesc("");
                setMetodoPago("");
                await fetchSaldoActual();
            } else {
                showToast("error", "Error al registrar movimiento: " + response.error);
            }
        } catch (error) {
            console.error("Error creating movement:", error);
            showToast("error", "Error al registrar movimiento");
        } finally {
            setLoading(false);
        }
    };

    const handleLimpiar = () => {
        setSelected(null);
        setMonto("");
        setDesc("");
        setMetodoPago("");
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center flex-1 p-6">
                <div className="bg-white flex flex-col shadow-2xl rounded-2xl w-full max-w-3xl">

                    <div className="grid p-8">
                        <span className="text-black font-semibold mb-2">
                            Registrar Movimiento de Caja
                        </span>

                        <span className="mb-5 flex items-center text-gray-700 text-sm">
                            Complete el formulario para registrar un ingreso o egreso de caja
                        </span>

                        <span className="text-sm text-black font-semibold mb-2">
                            Tipo de Movimiento *
                        </span>

                        <div className="flex flex-row gap-4 w-full">
                            {opciones.map((op) => {
                                const activo = selected === op.id;

                                return (
                                    <div
                                        key={op.id}
                                        onClick={() => !loading && setSelected(op.id)}
                                        className={`w-full rounded-xl p-6 flex flex-col items-center cursor-pointer border-2 transition-all
                                            ${activo ? `border-${op.color}-500` : "border-gray-300"}
                                            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <div
                                            className={`mb-3 rounded-full border-4 p-2
                                                ${activo
                                                    ? `border-${op.color}-500 text-${op.color}-600`
                                                    : "border-gray-300 text-gray-500"
                                                }`}
                                        >
                                            <ArrowUp size={40} strokeWidth={1.5} />
                                        </div>

                                        <h2
                                            className={`text-lg font-semibold
                                                ${activo ? `text-${op.color}-700` : "text-gray-800"}`}
                                        >
                                            {op.titulo}
                                        </h2>

                                        <p className="text-sm text-gray-500">{op.desc}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
                            <span className="text-black text-sm font-bold">
                                Método de pago *
                            </span>

                            <select
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                                className="w-full md:w-auto flex-1 text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                <option value="">Seleccione...</option>

                                {metodosPago.map((item) => (
                                    <option key={item.id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <span className="text-black font-semibold text-sm mt-4 mb-2">
                            Monto *
                        </span>

                        <input
                            className="w-full text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="number"
                            placeholder="Ingrese el monto"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            disabled={loading}
                        />

                        <span className="text-black font-semibold text-sm mt-4 mb-2">Descripción</span>

                        <input
                            className="w-full text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Ingrese una descripción del movimiento"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            disabled={loading}
                        />

                        <div className="grid grid-cols-[min-content_1fr] grid-rows-[min-content_1fr] border-2 border-gray-300 rounded-xl mt-6">
                            <div className="p-2">
                                <AlertCircle className="w-4 h-4 text-gray-500" />
                            </div>

                            <span className="text-gray-500 items-center p-1 font-semibold w-full flex">
                                Saldo actual: {saldoActual.toLocaleString()}
                            </span>

                            <span className="col-start-2 flex items-center p-1 font-semibold text-green-700 text-sm">
                                Saldo después del movimiento: {saldoDespues.toLocaleString()}
                            </span>

                            <span className="col-start-2 flex items-center p-1 text-gray-700 text-sm">
                                La fecha y hora se registrarán automáticamente al guardar
                            </span>
                        </div>

                        <div className="w-full pt-5 pb-6 flex text-center flex-row gap-4">
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white py-2 rounded-lg w-full hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Confirmar"}
                            </button>

                            <button
                                onClick={handleLimpiar}
                                className="bg-white border-gray-400 border text-white py-2 rounded-lg w-3/12 hover:bg-gray-700 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                Limpiar
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`flex justify-between items-center p-3 shadow-lg max-w-xs w-full
                                    ${t.type === "success" ? "bg-green-500" : "bg-red-500"} 
                                    text-white rounded-2xl`}
                    >
                        <span className="mr-2">{t.message}</span>
                        <button 
                            onClick={() => removeToast(t.id)} 
                            className="p-1 rounded-full hover:bg-red-500/20 flex items-center justify-center"
                        >
                            <X size={14} strokeWidth={2} className="text-white" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}