import { useEffect, useState } from "react";
import { ArrowUp, AlertCircle } from "lucide-react";

export default function MovimientoCaja() {
    const [selected, setSelected] = useState(null);
    const [monto, setMonto] = useState("");
    const [desc, setDesc] = useState("");

    const [metodoPago, setMetodoPago] = useState("");     // Seleccionado
    const [metodosPago, setMetodosPago] = useState([]);   // Lista de métodos

    const [saldoActual, setSaldoActual] = useState(0);
    const [saldoDespues, setSaldoDespues] = useState(0);

    const opciones = [
        { id: "ingreso", titulo: "Ingreso", desc: "Entrada de dinero a caja", color: "green" },
        { id: "egreso", titulo: "Egreso", desc: "Salida de dinero a caja", color: "red" },
    ];

    // Obtener métodos de pago simulados
    useEffect(() => {
        const dataSimulada = [
            { id: 1, nombre: "Efectivo" },
            { id: 2, nombre: "Nequi" },
            { id: 3, nombre: "Daviplata" },
            { id: 4, nombre: "Transferencia" },
        ];

        setTimeout(() => {
            setMetodosPago(dataSimulada);
        }, 500);
    }, []);

    // Obtener saldos simulados
    useEffect(() => {
        const data = {
            saldoAntes: 120000,
            saldoNuevo: 120000,
        };

        setSaldoActual(data.saldoAntes);
        setSaldoDespues(data.saldoNuevo);
    }, []);

    // Recalcular saldo con monto + tipo de movimiento
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


    const handleSubmit = () => {
        console.log("Tipo:", selected);
        console.log("Método de pago:", metodoPago);
        console.log("Monto:", monto);
        console.log("Descripción:", desc);
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

                        {/* Tipo de movimiento */}
                        <span className="text-sm text-black font-semibold mb-2">
                            Tipo de Movimiento *
                        </span>

                        <div className="flex flex-row gap-4 w-full">
                            {opciones.map((op) => {
                                const activo = selected === op.id;

                                return (
                                    <div
                                        key={op.id}
                                        onClick={() => setSelected(op.id)}
                                        className={`w-full rounded-xl p-6 flex flex-col items-center cursor-pointer border-2 transition-all
                                            ${activo ? `border-${op.color}-500` : "border-gray-300"}`}
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

                        {/* Método de pago */}
                        <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
                            <span className="text-black text-sm font-bold">
                                Método de pago *
                            </span>

                            <select
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                                className="w-full md:w-auto flex-1 text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccione...</option>

                                {metodosPago.map((item) => (
                                    <option key={item.id} value={item.nombre}>
                                        {item.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Monto */}
                        <span className="text-black font-semibold text-sm mt-4 mb-2">
                            Monto *
                        </span>

                        <input
                            className="w-full text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="number"
                            placeholder="Ingrese el monto"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                        />

                        {/* Descripción */}
                        <span className="text-black font-semibold text-sm mt-4 mb-2">Descripción</span>

                        <input
                            className="w-full text-black border border-gray-400 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Ingrese una descripción del movimiento"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />

                        {/* Saldos */}
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

                        {/* Botones */}
                        <div className="w-full pt-5 pb-6 flex text-center flex-row gap-4">
                            <div
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white py-2 rounded-lg w-full hover:bg-blue-700 transition"
                            >
                                Confirmar
                            </div>

                            <div
                                onClick={() => { setSelected(null); setMonto(""); setDesc(""); setMetodoPago(""); }}
                                className="bg-white border-gray-400 border text-black py-2 rounded-lg w-3/12 hover:bg-gray-700 hover:text-white transition"
                            >
                                Limpiar
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
