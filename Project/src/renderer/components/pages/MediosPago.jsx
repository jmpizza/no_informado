import { useState, useEffect, useRef } from "react";
import {
  DollarSign,
  CreditCard,
  Wallet,
  Smartphone,
  Building,
  QrCode,
  Landmark,
  Receipt,
  X
} from "lucide-react";

import { ICON_MAP, addIcon } from "../../../constants/iconMap.js";

export default function MediosPago() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const [showPopover, setShowPopover] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const iconRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (iconRef.current && !iconRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const defaultIcon = iconOptions.find(item => item.label === "Efectivo");
  const [selectedIcon, setSelectedIcon] = useState(defaultIcon);

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

  const fetchData = async () => {
  setLoading(true);
  try {
    const response = await window.api.getPaymentMethods(null);

    if (response.success && response.data && Array.isArray(response.data)) {
      const formattedData = response.data.map(pm => {
        // Obtenemos el ícono según el nombre
        const Icon = ICON_MAP[pm.name] || DollarSign;

        // Color según iconOptions o default
        const color = iconOptions.find(opt => opt.label === pm.name)?.color || "text-gray-700";

        // Si es Efectivo o Tarjeta, el botón de deshabilitar se desactiva
        const disableButton = pm.name === "Efectivo" || pm.name === "Tarjeta";

        return {
          id: pm.id,
          icon: Icon,
          color: color,
          Nombre: pm.name,
          Descripcion: pm.account_number ? `Cuenta: ${pm.account_number}` : "-",
          Estado: pm.active ? "Activo" : "Inactivo",
          active: pm.active,
          disableButton, // nuevo campo
        };
      });
      setData(formattedData);
    } else {
      console.error("Response:", response);
      showToast("error", "Error al cargar medios de pago: " + (response.error || "Respuesta inválida"));
      setData([]);
    }
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    showToast("error", "Error al cargar medios de pago");
    setData([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const headers = ["Icono", "Nombre", "Descripción", "Estado", "Acción"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return alert("Debes ingresar un nombre");
    }

    setLoading(true);

    try {
      const paymentMethodData = {
        name: name.trim(),
        description: description.trim() || null,
        icon: selectedIcon?.label,
      };

      const response = await window.api.createPaymentMethod(paymentMethodData);

      if (response.success) {
        showToast("success", `Medio de pago agregado: ${name}`);

        addIcon(paymentMethodData.name, selectedIcon.icon);


        setName("");
        setDescription("");
        setSelectedIcon(defaultIcon);
        setShowPopover(false);

        await fetchData();

      } else {
        showToast("error", "Error al agregar medio de pago: " + response.error);
      }
    } catch (error) {
      console.error("Error creating payment method:", error);
      showToast("error", "Error al agregar medio de pago");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (paymentMethod) => {
  const newStatus = !paymentMethod.active;

  setLoading(true);
  try {
    // Llamada al servidor
    const response = await window.api.updatePaymentMethodStatus(
      paymentMethod.Nombre,
      newStatus
    );

    if (response.success) {
      // Actualizamos localmente sin volver a fetchData
      setData(prevData =>
      prevData.map(p =>
        p.id === paymentMethod.id
          ? { ...p, active: newStatus, Estado: newStatus ? "Activo" : "Inactivo" }
          : p
      )
    );

      showToast("success", `Medio de pago ${newStatus ? 'activado' : 'desactivado'} correctamente`);
    } else {
      showToast("error", "Error al actualizar estado: " + response.error);
    }
  } catch (error) {
    console.error("Error updating payment method:", error);
    showToast("error", "Error al actualizar estado");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex flex-col h-screen p-20 bg-gray-100">

      <div>
        <span className="text-black text-2xl font-semibold">Configuración</span>
        <span className="block text text-gray-700">Medios de Pago</span>
      </div>

      <div className="bg-white rounded-xl shadow-lg mt-8">

        <div className="flex flex-row border-b border-gray-200 px-8">
          <span
            onClick={() => setActiveTab("add")}
            className={`p-4 text-center border-b-2 text-sm flex justify-center items-center cursor-pointer font-medium 
                            ${activeTab === "add" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-700 hover:text-black"}`}
          >
            Agregar medio de pago
          </span>

          <span
            onClick={() => setActiveTab("disable")}
            className={`p-4 text-center border-b-2 text-sm flex justify-center items-center cursor-pointer font-medium 
                            ${activeTab === "disable" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-700 hover:text-black"}`}
          >
            Gestionar medios de pago
          </span>
        </div>

        {activeTab === "add" ? (
          <form onSubmit={handleSubmit}>

            <div className="flex flex-row px-10 pt-6 items-center gap-4">
              <CreditCard className="flex-none text-green-600 row-span-2 bg-green-400/20 p-2" size={48} />
              <div>
                <span className="text-black flex items-center font-medium">Agregar nuevo medio de pago</span>
                <span className="flex items-center text-gray-500 text-sm">
                  Complete la información para crear un nuevo medio de pago
                </span>
              </div>
            </div>

            <div className="flex flex-row gap-8 px-10 py-8">

              <div ref={iconRef} className="relative flex flex-col items-start gap-1">
                <span className="text-sm text-gray-700">Icono</span>

                <div
                  onClick={() => setShowPopover(!showPopover)}
                  className={`relative rounded-xl border-2 w-32 aspect-square cursor-pointer
                                        flex items-center justify-center p-2 transition
                                        ${showPopover ? "border-blue-600" : "border-gray-300"}`}
                >
                  {selectedIcon ? (
                    <selectedIcon.icon className={selectedIcon.color} size={64} />
                  ) : (
                    <DollarSign className="text-gray-500" size={64} />
                  )}

                  <div className={`absolute bottom-2 right-2 transition-transform duration-300 
                                            ${showPopover ? "rotate-180" : "rotate-0"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500" fill="none"
                      viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {showPopover && (
                  <div className="absolute top-full left-0 mt-2 z-10 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 w-60">
                    <span className="block font-medium text-sm text-black mb-3">
                      Selecciona un ícono
                    </span>

                    <div className="grid grid-cols-3 gap-2">
                      {iconOptions.map((item) => (
                        <div
                          key={item.label}
                          onClick={() => {
                            setSelectedIcon(item);
                            setShowPopover(false);
                          }}
                          className={`flex flex-col items-center p-2 rounded-lg transition cursor-pointer
                                                        ${selectedIcon?.label === item.label ?
                              "bg-blue-100 border border-blue-400" :
                              "hover:bg-gray-300"
                            }`}
                        >
                          <item.icon className={item.color} size={32} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 grow">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">Nombre del medio de pago</span>
                  <input
                    type="text"
                    className="w-full text-black border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Nequi, Bancolombia, Efectivo..."
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">Descripción</span>
                  <input
                    type="text"
                    className="w-full text-black border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ingresa una descripción (opcional)"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex-1 px-10 pb-6 flex text-center justify-center flex-col gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-gray-500">
            {loading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      {headers.map((header, index) => (
                        <th key={index}
                          className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No hay medios de pago registrados
                        </td>
                      </tr>
                    ) : (
                      data.map((row, index) => {
                        const Icon = row.icon;
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="w-10 px-6 py-4">
                              <Icon className={`w-5 h-5 ${row.color}`} />
                            </td>
                            <td className="px-4 py-2 text-black">{row.Nombre}</td>
                            <td className="px-4 py-2 text-black">{row.Descripcion}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium
                                                                ${row.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {row.Estado}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <button
                              onClick={() => handleToggleStatus(row)}
                              className={`px-3 py-1 rounded text-xs font-medium transition
                                ${
                                  row.disableButton
                                    ? 'bg-gray-700 text-gray-575 cursor-not-allowed pointer-events-none'
                                    : row.active
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              disabled={loading || row.disableButton}
                            >
                              {row.disableButton ? 'Deshabilitado' : row.active ? 'Desactivar' : 'Activar'}
                            </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    {/* Toasts */}
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