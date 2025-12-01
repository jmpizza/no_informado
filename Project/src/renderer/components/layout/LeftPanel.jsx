import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import {
    Home,
    DollarSign,
    Users,
    BarChart3,
    AlertTriangle,
    CreditCard,
    Settings,
    LogOut,
    ChevronDown,
    ChevronUp
} from "lucide-react";

export default function LeftPanel({ setView }) {
    const { user, logout } = useAuth();
    const role = user?.rol?.name?.toLowerCase();

    const menuItems = [
        { title: "Inicio", icon: Home, view: "home", children: null, roles: ["admin", "cajero", "usuario", "operador"] },

        { 
            title: "Operacion de Caja", 
            icon: DollarSign, 
            view: null, 
            roles: ["admin", "cajero", "operador"],
            children: [
                { title: "Registrar movimiento", view: "movimientoCaja", roles: ["admin", "cajero", "operador"] },
                { title: "Realizar Cierre", view:"cierre", roles: ["admin", "cajero", "operador"] },
                { title:"Historial de cierres", view:"closeHistory", roles: ["admin"] },
                { title:"Saldos Iniciales", view:"saldosIniciales", roles: ["admin"] }
            ] 
        },

        { 
            title: "Administrar usuarios", 
            icon: Users, 
            view: null, 
            roles: ["admin"],
            children: [
                { title: "Registrar usuario", view: "registrarUsuario", roles: ["admin"] },
                { title: "Administrar permisos", view: "administrarPermisos", roles: ["admin"] },
                { title: "Administrar roles", view: "administrarRoles", roles: ["admin"] }
            ] 
        },

        { title: "Reportes y analisis", icon: BarChart3, view: "reports", children: null, roles: ["admin", "operador"] },

        { 
            title: "Alertas e inconsistencias", 
            icon: AlertTriangle, 
            view: null, 
            roles: ["admin", "operador"],
            children: [
                {title:"Parametros de alertas", view:"alertParameter", roles: ["admin"]},
                {title:"Historial de alertas", view:"alertHistory", roles: ["admin", "operador"]}
            ]
        },

        { title: "Medios de pago", icon: CreditCard, view: "mediosPago", children: null, roles: ["admin", "operador"] },

        { title: "Configuracion del negocio", icon: Settings, view: "settings", children: null, roles: ["admin"] },
    ];

    const [openIndex, setOpenIndex] = useState(null);
    const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

    const handleLogout = () => {
        const confirmed = window.confirm("¿Está seguro que desea cerrar sesión?");
        if (confirmed) logout();
    };

    if (!user || !role) {
        return (
            <div className="bg-[#1c398e] text-white w-64 h-screen flex items-center justify-center">
                Cargando...
            </div>
        );
    }

    return (
        <div className="bg-[#1c398e] fixed left-0 top-0 w-64 h-screen flex flex-col">

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
                {menuItems
                    .filter(item => item.roles.includes(role))
                    .map((item, index) => {
                        const Icon = item.icon;
                        const isOpen = openIndex === index;

                        return (
                            <div key={index}>
                                <div
                                    onClick={() => {
                                        toggle(index);
                                        if (item.view) setView(item.view);
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
                                        {item.children
                                            .filter(child => child.roles.includes(role))
                                            .map((child, i) => (
                                                <span
                                                    key={i}
                                                    onClick={() => setView(child.view)}
                                                    className="block text-xs text-gray-200 p-2 cursor-pointer hover:text-white"
                                                >
                                                    {child.title}
                                                </span>
                                            ))
                                        }
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
