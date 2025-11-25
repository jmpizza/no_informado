// App.jsx - CORREGIDO
import { useState } from "react";
import { AuthProvider, useAuth } from "./renderer/components/auth/AuthContext";
import Login from "./renderer/components/auth/Login";
import Dashboard from "./renderer/components/layout/Dashboard";
import LeftPanel from "./renderer/components/layout/LeftPanel";
import MediosPago from "./renderer/components/pages/MediosPago";
import MovimientoCaja from "./renderer/components/pages/MovimientoCaja";
import UserRegister from "./renderer/components/auth/UserRegister";
import AdministrarRoles from "./renderer/components/auth/AdministrarRoles";
import Cierre from "./renderer/components/pages/Ciere";
import AlertParameter from "./renderer/components/pages/AlertParameter";
import CloseHistory from "./renderer/components/pages/CloseHistory"

function AppContent() {
    const [view, setView] = useState("dashboard");
    const { user } = useAuth();

    return (
        <div>
            {!user ? (
                <Login />
            ) : (
                <div className="flex h-screen w-screen">

                    <LeftPanel setView={setView} />

                    <div className="bg-white flex-1 ml-64">
                        {view === "dashboard" && <Dashboard />}
                        {view === "mediosPago" && <MediosPago />}
                        {view === "registrarUsuario" && <UserRegister />}
                        {view === "movimientoCaja" && <MovimientoCaja />}
                        {view === "administrarRoles" && <AdministrarRoles />}
                        {view === "cierre" && <Cierre />}
                        {view === "alertParameter" && <AlertParameter />}
                        {view === "closeHistory" && <CloseHistory/>}
                        
                    </div>

                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
