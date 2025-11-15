import { useState } from "react";
import { useAuth } from "../auth/authContext.jsx";
import {
    Home,
    DollarSign,
    Users,
    BarChart3,
    AlertTriangle,
    CreditCard,
    Settings,
    Brain,
    LogOut,
    ChevronDown,
    ChevronUp
} from "lucide-react";

export default function LeftPanel({ setView }) {
    const { logout } = useAuth(); // ← Obtener función de logout

    const menuItems = [
        { title: "Inicio", icon: Home, view: "home", children: null },
        { title: "Operacion de Caja", icon: DollarSign, view: null, children: [{ title: "Registrar movimiento", view: "movimientoCaja" }] },
        { title: "Administrar usuarios", icon: Users, view: null, children: [{ title: "Registrar usuario", view: "registrarUsuario" }, { title: "Administrar permisos", view: null }, { title: "Administrar roles", view: null }] },
        { title: "Reportes y analisis", icon: BarChart3, view: "reports", children: null },
        { title: "Alertas e inconsistencias", icon: AlertTriangle, view: "alerts", children: null },
        { title: "Medios de pago", icon: CreditCard, view: "mediosPago", children: null },
        { title: "Configuracion del negocio", icon: Settings, view: "settings", children: null },
        { title: "Predicciones / inteligencia", icon: Brain, view: "ai", children: null }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleLogout = () => {
        const confirmed = window.confirm("¿Está seguro que desea cerrar sesión?");
        if (confirmed) {
            logout();
        }
    };

    return (
        <div className="bg-[#1c398e] min-h-screen flex flex-col">

            <div className="flex w-64 p-4 bg-[#1c398e] text-white gap-5">
                <div className="h-20 flex gap-4 items-center justify-center w-full">
                    <div className="flex w-[50px] h-[50px] bg-[#155dfc] shadow-lg rounded-2xl text-3xl justify-center items-center text-white ">
                        $
                    </div>
                    <div className="flex flex-col ">
                        <span>CajaControl Pro</span>
                        <span className="text-sm text-gray-300">Panel administrativo</span>
                    </div>
                </div>
            </div>

            <div>
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isOpen = openIndex === index;

                    return (
                        <div key={index}>
                            <div
                                onClick={() => {
                                    toggle(index);
                                    if (!(item.view == null)) {
                                        setView(item.view);
                                    }
                                }}
                                className="flex items-center justify-between text-sm text-white p-3 cursor-pointer hover:bg-[#0037a3] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} />
                                    <span>{item.title}</span>
                                </div>
                                {item.children && (
                                    isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />
                                )}
                            </div>

                            {isOpen && item.children && (
                                <div className="ml-10 space-y-1">
                                    {item.children.map((child, i) => (
                                        <span
                                            key={i}
                                            onClick={() => {
                                                setView(child.view)
                                            }}
                                            className="block text-xs text-gray-200 p-2 cursor-pointer hover:text-white"
                                        >
                                            {child.title}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div
                onClick={handleLogout}
                className="mt-auto p-3 flex items-center gap-3 text-white cursor-pointer hover:bg-red-600 hover:text-red-200 transition-colors"
            >
                <LogOut size={20} />
                <span>Cerrar sesión</span>
            </div>
        </div>
    );
}
