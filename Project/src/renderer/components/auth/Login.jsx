import { useState } from "react";
import { useAuth } from "./authContext";

export default function Login() {
    const [cedula, setCedula] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await login(Number(cedula), password);

            if (!result.success) {
                setError(result.error || "Error al iniciar sesión");
            }
            // Si es exitoso, el AuthContext y ProtectedRoute se encargan del resto
        } catch (err) {
            setError("Error de conexión. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen bg-[#1E40AF] flex items-center justify-center">
            <div className="grid max-w-md w-full rounded-xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="place-self-center p-6 text-center">
                    <div className="flex w-[100px] h-[100px] bg-[#155dfc] shadow-lg rounded-2xl text-5xl justify-center items-center text-white mx-auto">
                        $
                    </div>

                    <h2 className="text-white text-xl mt-5 font-semibold">CajaControl Pro</h2>
                    <p className="text-gray-300 mt-2">Sistema de Control de Caja</p>
                </div>

                {/* Login Form */}
                <div className="bg-white p-6">
                    <span className="block text-gray-950 font-medium">Iniciar Sesión</span>
                    <span className="block text-gray-600 text-sm mb-6">
                        Ingrese sus credenciales para continuar
                    </span>

                    <form onSubmit={handleLogin}>
                        {/* Cédula */}
                        <label className="block text-sm text-black mb-0.5">Cédula</label>
                        <input
                            type="number"
                            placeholder="1234567890"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            className="w-full text-black border pl-4 p-2 rounded-xl mt-1 mb-3 border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                            required
                            disabled={loading}
                        />

                        {/* Password */}
                        <label className="block text-sm text-black mb-0.5">Contraseña</label>
                        <div className="relative mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full text-black border border-gray-400 rounded-xl p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                                required
                                disabled={loading}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center text-gray-500 hover:text-gray-700" aria-label="Toggle password visibility"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
