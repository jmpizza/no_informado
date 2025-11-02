import { useState } from "react";
import Login from "./renderer/Login";
import Dashboard from "./renderer/Dashboard";
import LeftPanel from "./renderer/LeftPanel";
import MediosPago from "./renderer/MediosPago";


function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [view, setView] = useState("dashboard");

    return (
        <div>
            {!loggedIn ? (
                <Login onLogin={() => setLoggedIn(true)} />
            ) : (
                <div className="flex h-screen w-screen">
                    <LeftPanel setView={setView} />
                    <div className="bg-black flex-1 p-6">
                        {view === "dashboard" && <Dashboard />}
                        {view === "mediosPago" && <MediosPago />}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
