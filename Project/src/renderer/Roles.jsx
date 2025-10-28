// src/renderer/components/Roles.jsx
import React, { useEffect, useState } from 'react';

export default function Roles() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Obtener la API de Electron (preload script)
    const api = window?.api || window?.electronAPI;

    async function fetchRoles() {
        setLoading(true);
        setError(null);
        try {
            if (!api) {
                const errorMsg = 'API no disponible. Asegúrate de estar ejecutando en Electron.';
                console.error("DEBUG:", errorMsg);
                setError(errorMsg);
                setLoading(false);
                return;
            }
            const res = await api.getRoles();
            if (res.success) setRoles(res.data || []);
            else setError(res.error || 'Error al obtener roles');
        } catch (e) {
            console.error("DEBUG: Error en fetchRoles:", e);
            setError(String(e));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRoles();
    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!form.name) {
            setError('El nombre es requerido');
            return;
        }
        try {
            if (!api) {
                setError('API no disponible. Asegúrate de estar ejecutando en Electron.');
                return;
            }
            const payload = {
                name: form.name,
                description: form.description || null
            };
            const res = await api.createRole(payload);
            if (res.success) {
                setRoles(prev => [res.data, ...prev]);
                setForm({ name: '', description: '' });
                setSuccess(`Rol "${res.data.name}" creado exitosamente`);
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(res.error || 'Error al crear rol');
            }
        } catch (e) {
            setError(String(e));
        }
    }

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestión de Roles</h1>
                    <p className="text-slate-600">Crea y visualiza los roles del sistema</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Crear Nuevo Rol</h2>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Nombre del Rol
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Administrador, Usuario, Operador"
                                value={form.name}
                                onChange={(ev) => setForm({ ...form, name: ev.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Descripción
                            </label>
                            <input
                                type="text"
                                placeholder="Describe qué hace este rol"
                                value={form.description}
                                onChange={(ev) => setForm({ ...form, description: ev.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                        >
                            Crear Rol
                        </button>
                    </form>

                    {/* Messages */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}
                    {success && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            <span className="font-medium">Éxito:</span> {success}
                        </div>
                    )}
                </div>

                {/* Roles List Card */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        Roles Existentes ({roles.length})
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-slate-600">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                <p>Cargando roles...</p>
                            </div>
                        </div>
                    ) : roles.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No hay roles registrados</p>
                    ) : (
                        <ul className="space-y-3">
                            {roles.map((r) => (
                                <li
                                    key={r.id || r.name}
                                    className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{r.name}</h3>
                                            <p className="text-slate-600 text-sm mt-1">{r.description}</p>
                                        </div>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                            ID: {r.id}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
