// App.jsx - CORREGIDO
import { useState } from "react";
import { AuthProvider, useAuth } from "./renderer/components/auth/AuthContext"; 
import Login from "./renderer/components/auth/Login";
import Dashboard from "./renderer/components/layout/Dashboard";
import LeftPanel from "./renderer/components/layout/LeftPanel";
import MediosPago from "./renderer/components/pages/MediosPago";
import RegistrarUsuario from "./renderer/components/auth/RegistrarUsuario";

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
                    <div className="bg-white flex-1 ">
                        {view === "dashboard" && <Dashboard />}
                        {view === "mediosPago" && <MediosPago />}
                        {view === "registrarUsuario" && <RegistrarUsuario />}
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
