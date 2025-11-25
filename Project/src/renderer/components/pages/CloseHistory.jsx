"use client";

import { useState, useEffect } from 'react';
import { History, Lock, X, AlertCircle, Search, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

function Label({ children, className }) {
return <label className={className}>{children}</label>;
}

export default function CloseHistory({ closures = [], preselectedClosureId, onClosureViewed }) {
const [selectedClosure, setSelectedClosure] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
const [dateFilter, setDateFilter] = useState('all');
const [sortBy, setSortBy] = useState('date-desc');
const [showExportModal, setShowExportModal] = useState(false);
const [showClosureExportModal, setShowClosureExportModal] = useState(false);

const getStatusColor = (difference) => {
if (difference <= -15000) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
if (difference < 0) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
};

const getStatusText = (difference) => {
if (difference === 0) return 'Cuadrada';
return difference > 0 ? 'Sobrante' : 'Faltante';
};

const getStatusBadgeColor = (difference) => {
if (difference <= -15000) return 'bg-red-500';
if (difference < 0) return 'bg-yellow-500';
if (difference === 0) return 'bg-green-500';
return 'bg-green-500';
};

const filterAndSortClosures = () => {
if (!closures || !Array.isArray(closures)) return [];

let filtered = [...closures]; // copiar array antes de sort

if (searchTerm) {
  filtered = filtered.filter((closure) =>
    closure.closureNumber.toString().includes(searchTerm) ||
    closure.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    closure.date.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

if (dateFilter !== 'all') {
  const now = new Date();
  filtered = filtered.filter((closure) => {
    const closureDate = new Date(closure.date);
    switch (dateFilter) {
      case 'today':
        return closureDate.toDateString() === now.toDateString();
      case 'week':
        return closureDate >= new Date(now.getTime() - 7 * 86400000);
      case 'month':
        return closureDate >= new Date(now.getTime() - 30 * 86400000);
      default:
        return true;
    }
  });
}

filtered.sort((a, b) => {
  switch (sortBy) {
    case 'date-desc': return b.closureNumber - a.closureNumber;
    case 'date-asc': return a.closureNumber - b.closureNumber;
    case 'amount-desc': return Math.abs(b.totalDifference) - Math.abs(a.totalDifference);
    case 'amount-asc': return Math.abs(a.totalDifference) - Math.abs(b.totalDifference);
    default: return 0;
  }
});

return filtered;


};

const filteredClosures = filterAndSortClosures();

const handleExportAll = (format) => {
alert(`Exportando ${filteredClosures.length} cierres en formato ${format.toUpperCase()}`);
setShowExportModal(false);
};

const handleExportClosure = (format) => {
if (selectedClosure) {
alert(`Exportando cierre #${selectedClosure.closureNumber} en formato ${format.toUpperCase()}`);
setShowClosureExportModal(false);
}
};

useEffect(() => {
if (preselectedClosureId && closures.length > 0) {
const closure = closures.find((c) => c.id === preselectedClosureId);
if (closure) {
setSelectedClosure(closure);
if (onClosureViewed) onClosureViewed();
}
}
}, [preselectedClosureId, closures, onClosureViewed]);

return ( <div className="p-8 max-w-7xl mx-auto">
{/* HEADER */} <div className="mb-8"> <div className="flex items-center justify-between"> <div> <div className="flex items-center gap-3 mb-2"> <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"> <History className="w-5 h-5 text-blue-600" /> </div> <h1 className="text-gray-900">Historial de cajas</h1> </div> <p className="text-gray-600">Visualiza todos los cierres de caja registrados en el sistema</p> </div>
<Button onClick={() => setShowExportModal(true)} variant="outline" className="gap-2"> <Download className="w-4 h-4" /> Exportar </Button> </div> </div>

```
  {/* ALERTA */}
  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
    <p className="text-blue-800">
      Los cierres de caja son registros inmutables y no pueden ser modificados.
    </p>
  </div>

  {/* FILTROS */}
  {closures.length > 0 && (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-3 gap-4">
        {/* BUSCAR */}
        <div>
          <Label className="text-sm text-gray-700 mb-1.5 block">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por #, operador, fecha..."
              className="pl-9"
            />
          </div>
        </div>

        {/* FECHA */}
        <div>
          <Label className="text-sm text-gray-700 mb-1.5 block">Filtrar por fecha</Label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fechas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ORDEN */}
        <div>
          <Label className="text-sm text-gray-700 mb-1.5 block">Ordenar por</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Más reciente</SelectItem>
              <SelectItem value="date-asc">Más antiguo</SelectItem>
              <SelectItem value="amount-desc">Diferencia (mayor a menor)</SelectItem>
              <SelectItem value="amount-asc">Diferencia (menor a mayor)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )}

  {/* LISTADO */}
  {filteredClosures.length > 0 && (
    <div className="space-y-4">
      {filteredClosures.map((closure) => {
        const statusColor = getStatusColor(closure.totalDifference);
        const badgeColor = getStatusBadgeColor(closure.totalDifference);

        return (
          <button
            key={closure.id}
            onClick={() => setSelectedClosure(closure)}
            className="w-full bg-white rounded-lg border p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 ${badgeColor} rounded-lg flex items-center justify-center`}>
                  <span className="text-white">#{closure.closureNumber}</span>
                </div>

                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Fecha y hora</p>
                    <p className="text-gray-900">{closure.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Operador</p>
                    <p className="text-blue-600">{closure.operator}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Estado</p>
                    <span className={`inline-flex px-3 py-1 rounded ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                      {getStatusText(closure.totalDifference)}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-gray-500 text-sm mb-1">Diferencia</p>
                  <p className={statusColor.text}>
                    {closure.totalDifference >= 0 ? '+' : ''} $ {closure.totalDifference.toLocaleString('es-CO')}
                  </p>
                </div>

              </div>
            </div>
          </button>
        );
      })}
    </div>
  )}

  {/* MODALES (no tocados, JSX igual a TSX) */}
  {/* ... */}
</div>


);
}
