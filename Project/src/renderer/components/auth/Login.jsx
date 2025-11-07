import { useState } from "react";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        console.log("Email:", email);
        console.log("Password:", password);
        onLogin()
    };

    return (
        <div className="w-screen h-screen bg-[#1E40AF] flex items-center justify-center">
            <div className="grid max-w-md w-full rounded-xl shadow-2xl overflow-hidden ">

                {/* Header */}
                <div className="place-self-center p-6 text-center">
                    <div className="flex w-[100px] h-[100px] bg-[#155dfc] shadow-lg rounded-2xl text-5xl justify-center items-center text-white mx-auto">$
                    </div>

                    <h2 className="text-white text-xl mt-5 font-semibold">CajaControl Pro</h2>
                    <p className="text-gray-300 mt-2">Sistema de Control de Caja</p>
                </div>

                {/* Login Form */}
                <div className="bg-white p-6">
                    <span className="block text-gray-950 font-medium">Iniciar Sesión</span>
                    <span className="block text-gray-600 text-sm mb-6">Ingrese sus credenciales para continuar</span>

                    {/* Email */}
                    <label className="block text-sm text-black mb-0.5">Usuario</label>
                    <input
                        type="email"
                        placeholder="Your Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-black border pl-4 p-2 rounded-xl mt-1 mb-3 border-gray-400"
                    />

                    {/* Password */}
                    <label className="block text-sm text-black mb-0.5">Contraseña</label>
                    <div className="relative mb-6">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-black border border-gray-400 rounded-xl p-3 pr-10 text-sm"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center text-gray-500"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}
