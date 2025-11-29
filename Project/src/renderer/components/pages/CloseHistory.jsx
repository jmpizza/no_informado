"use client";

import { useState, useEffect, use } from 'react';
import { History, Lock, X, AlertCircle, Search, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ICON_MAP } from "../../../constants/iconMap.js";


function Label({ children, className }) {
return <label className={className}>{children}</label>;
}

export default function CloseHistory({ clousures, preselectedClosureId, onClosureViewed }) {
const [clousuresList, setclousuresList] = useState(clousures || []);
const [selectedClosure, setSelectedClosure] = useState(null);
const [selectedClosureDetails, setSelection] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
const [dateFilter, setDateFilter] = useState('all');
const [sortBy, setSortBy] = useState('date-desc');
const [showExportModal, setShowExportModal] = useState(false);
const [showClosureExportModal, setShowClosureExportModal] = useState(false);
const [parametersDetails, setParameters] = useState(null);


useEffect(() => {
}, [selectedClosure]);

const fectParameters = async () => {
    try {
      const response = await window.api.getParameters();
      if (!response.success) throw new Error(response.error);
      setParameters(response.parameters);
    } catch (err) {
      console.error("Error al obtener parámetros:", err);
    }
  };

  useEffect(() => {
    fectParameters();
  }, []);

const exportAllClousuresList =  async () => {
  try {

    const response = await window.api.getClosures();
    if (!response.success) throw new Error(response.error);

    setclousuresList(response.data);
   
  } catch (err) {
      console.error("Error al obtener cierres:", err);
  }  

}

useEffect(() => {
    exportAllClousuresList();
  }, []);

const getClousureDetails = async (closing_id) => {
  try {
    const response = await window.api.getClosureDetails(closing_id);
    if (!response.success) throw new Error(response.error);

    setSelection(response.data);
   
  } catch (err) {
    console.error("Error al obtener detalles del cierre:", err);
  }
};

useEffect(() => {
  if (selectedClosureDetails) {
    setSelectedClosure((prev) => ({
      ...prev,
      ...selectedClosureDetails
    }));

  }
}, [selectedClosureDetails]);


const getStatusColor = (difference) => {
  const safeParams = {
    closureDifferenceThreshold: parametersDetails?.closureDifferenceThreshold ?? 15000,
    minorDifferenceThreshold: parametersDetails?.minorDifferenceThreshold ?? 5000,
  };

  if (difference <= -(safeParams.closureDifferenceThreshold)) {
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  }

  if (difference <= -(safeParams.minorDifferenceThreshold)) {
    return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
  }

  return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
};

const getStatusText = (difference) => {
if (difference === 0) return 'Cuadrada';
return difference > 0 ? 'Sobrante' : 'Faltante';
};

const getStatusBadgeColor = (difference) => {

  const safeParams = {
    closureDifferenceThreshold: parametersDetails?.closureDifferenceThreshold ?? 15000,
    minorDifferenceThreshold: parametersDetails?.minorDifferenceThreshold ?? 5000,
  };

  if (difference <= -(safeParams.closureDifferenceThreshold)) return 'bg-red-500';
  if (difference < safeParams.minorDifferenceThreshold) return 'bg-yellow-500';
  if (difference === 0) return 'bg-green-500';
  return 'bg-green-500';
};

// Constante para capturar la fecha de inicio y fin separadas por un guion
const DATE_RANGE_REGEX = /^(.*?)(\s*-\s*)(.*)$/; 

const parseClosureDate = (str) => {
  // str puede ser "26/11/2025, 2:12:45 a. m." o "26/11/2025"
  const [datePart, timePart] = str.split(",");
  const parts = datePart.trim().split("/");

  if (parts.length < 3) return null;

  const [d, m, y] = parts.map(p => parseInt(p, 10));

  // CORRECCIÓN CLAVE: Usamos Date.UTC para que la fecha sea consistente
  // (m - 1 porque el mes es 0-indexado)
  let date = new Date(Date.UTC(y, m - 1, d)); // La fecha se crea a medianoche UTC

  if (timePart) {
    try {
      let [h, min, sec] = timePart.trim().split(":");
      h = parseInt(h, 10);

      const isPM = timePart.toLowerCase().includes("p");
      const isAM = timePart.toLowerCase().includes("a");

      // Conversión a 24h
      if (isPM && h !== 12) h += 12;
      if (isAM && h === 12) h = 0; // 12 a.m. (medianoche) es 0 horas

      // CORRECCIÓN CLAVE: Usamos setUTCHours para aplicar la hora sin desviarnos
      date.setUTCHours(h, parseInt(min, 10), parseInt(sec, 10));
    } catch (e) {
      console.error("Error al parsear la hora:", timePart, e);
    }
  }

  return date;
};

const filterAndSortclousuresList = () => {
  if (!clousuresList || !Array.isArray(clousuresList)) return [];

  let filtered = [...clousuresList];

  // ----------------------------------------------------
  // --- 1. BÚSQUEDA Y FILTRADO INICIAL (RANGO ESPECÍFICO) ---
  // ----------------------------------------------------
  if (searchTerm) {
    const trimmed = searchTerm.trim();

    // Caso 1: búsqueda por número de cierre (#123)
    if (trimmed.startsWith("#")) {
      const num = parseInt(trimmed.slice(1), 10);
      if (!isNaN(num)) {
        filtered = filtered.filter(closure => closure.closureNumber === num);
      }
    } 
    // ✅ Caso 2: RANGO ESPECÍFICO (usando REGEX para detectar y filtrar)
    else if (DATE_RANGE_REGEX.test(trimmed)) {
      
      const match = trimmed.match(DATE_RANGE_REGEX);
      if (match && match.length >= 4) {
        const startStr = match[1].trim(); 
        const endStr = match[3].trim();  

        const startDate = parseClosureDate(startStr);
        let endDate = parseClosureDate(endStr);
        
        if (startDate && endDate) {
          
          // Si no se especificó la hora en la fecha de fin, asumimos hasta el final del día.
          if (!endStr.includes(',')) {
            endDate.setUTCHours(23, 59, 59, 999);
          }

          filtered = filtered.filter(closure => {
            const closureDate = parseClosureDate(closure.date);
            return closureDate && closureDate.getTime() >= startDate.getTime() && closureDate.getTime() <= endDate.getTime();
          });
        }
      }
    } 
    // Caso 3: búsqueda normal por operador o texto en la fecha
    else {
      filtered = filtered.filter(closure =>
        closure.operator.toLowerCase().includes(trimmed.toLowerCase()) ||
        closure.date.toLowerCase().includes(trimmed.toLowerCase())
      );
    }
  }

  // ----------------------------------------------------
  // --- 2. FILTRO POR FECHA PRESELECCIONADA (Hoy, Semana, Mes) ---
  // ----------------------------------------------------
  if (dateFilter !== 'all') {
    const now = new Date();

    filtered = filtered.filter((closure) => {
      const closureDate = parseClosureDate(closure.date);
      if (!closureDate || isNaN(closureDate.getTime())) return false;

      switch (dateFilter) {
        case 'today': {
          const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
          
          // Medianoche UTC de HOY (según el calendario local)
          const todayStart = new Date(Date.UTC(y, m, d));
          
          // Medianoche UTC de MAÑANA (según el calendario local)
          const tomorrowStart = new Date(todayStart);
          tomorrowStart.setUTCDate(todayStart.getUTCDate() + 1);

          return closureDate.getTime() >= todayStart.getTime() && closureDate.getTime() < tomorrowStart.getTime();
        }

        case 'week': {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          weekAgo.setHours(0, 0, 0, 0);
          return closureDate.getTime() >= weekAgo.getTime() && closureDate.getTime() <= now.getTime();
        }

        case 'month': {
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          monthAgo.setHours(0, 0, 0, 0);
          return closureDate.getTime() >= monthAgo.getTime() && closureDate.getTime() <= now.getTime();
        }

        default:
          return true;
      }
    });
  }

  // ----------------------------------------------------
  // --- 3. ORDENAMIENTO FINAL ---
  // ----------------------------------------------------
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc': return b.closureNumber - a.closureNumber;
      case 'date-asc': return a.closureNumber - b.closureNumber;
      case 'amount-desc': return b.totalDifference - a.totalDifference;
      case 'amount-asc': return a.totalDifference - b.totalDifference;
      default: return 0;
    }
  });

  return filtered;
};

const filteredclousuresList = filterAndSortclousuresList();

const handleExportAll = (format) => {
alert(`Exportando ${filteredclousuresList.length} cierres en formato ${format.toUpperCase()}`);
setShowExportModal(false);
};

const handleExportClosure = async (format) => {
  const exportopdf = await window.api.exportToPdf(selectedClosure.closureNumber)
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
console.log("🔵 closure preseleccionado:", closure);
if (onClosureViewed) onClosureViewed();
}
}
}, [preselectedClosureId, clousures, onClosureViewed]);








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
  {clousuresList.length > 0 && (
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
  {filteredclousuresList.length > 0 && (
    <div className="space-y-4">
      {filteredclousuresList.map((closure) => {
        const statusColor = getStatusColor(closure.totalDifference);
        const badgeColor = getStatusBadgeColor(closure.totalDifference);

        return (
          <button
            key={closure.closureNumber}
            onClick={() => {
              setSelectedClosure(closure);
              getClousureDetails(closure.closureNumber);
            }}
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
  {/* Detail Modal */}
      {selectedClosureDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${getStatusBadgeColor(selectedClosureDetails.totalDifference)} rounded-lg flex items-center justify-center`}>
                  <span className="text-white">#{selectedClosureDetails.closureNumber}</span>
                </div>
                <h2 className="text-gray-900">Detalle del cierre de caja</h2>
              </div>
              <button
                onClick={() => {
                  setSelectedClosure(null);
                  setSelection(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Summary Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Operador de cierre</p>
                    <p className="text-blue-600">{selectedClosureDetails.operator}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Fecha y hora</p>
                    <p className="text-gray-900">{selectedClosureDetails.date}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Total esperado</p>
                      <p className="text-gray-900">$ {selectedClosureDetails.totalExpected.toLocaleString('es-CO')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Total contado</p>
                      <p className="text-gray-900">$ {selectedClosureDetails.totalCounted.toLocaleString('es-CO')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Diferencia neta</p>
                      <p className={getStatusColor(selectedClosureDetails.totalDifference).text}>
                        {selectedClosureDetails.totalDifference >= 0 ? '+' : ''} $ {selectedClosureDetails.totalDifference.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div>
                <h3 className="mb-4 text-gray-900">Detalle por medio de pago</h3>
                <div className="space-y-3">
                  {selectedClosureDetails.paymentMethods.map((pm) => {
                    const difference = pm.countedAmount - pm.expectedAmount;
                    const statusColor = getStatusColor(difference);
                    const Icon = ICON_MAP[pm.name] || AlertCircle;
                    
                    return (
                      <div key={pm.id} className={`p-4 rounded-lg border ${statusColor.border} ${statusColor.bg}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-900">{pm.name}</span>
                          </div>
                          <span className={`${statusColor.text}`}>
                            {difference >= 0 ? '+' : ''} $ {difference.toLocaleString('es-CO')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Esperado: </span>
                            <span className="text-gray-900">$ {pm.expectedAmount.toLocaleString('es-CO')}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Contado: </span>
                            <span className="text-gray-900">$ {pm.countedAmount.toLocaleString('es-CO')}</span>
                          </div>
                        </div>

                        {pm.observations && (
                          <div className="mt-2 pt-2 border-t border-gray-300">
                            <p className="text-gray-600 text-sm mb-1">Observaciones:</p>
                            <p className="text-gray-900 text-sm">{pm.observations}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Message */}
              {selectedClosureDetails.totalDifference < 0 ? (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-orange-800">
                      Faltante registrado de $ {Math.abs(selectedClosureDetails.totalDifference).toLocaleString('es-CO')}.
                    </p>
                  </div>
                </div>
              ) : selectedClosureDetails.totalDifference > 0 ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800">
                      Sobrante registrado de $ {selectedClosureDetails.totalDifference.toLocaleString('es-CO')}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800">
                      Caja cuadrada. Sin diferencias registradas.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <Button
                onClick={() => setShowClosureExportModal(true)}
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar
              </Button>
              <Button
                onClick={() => {
                  setSelectedClosure(null);
                  setSelection(null);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Export All Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Exportar cierres</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Selecciona el formato para exportar {filteredClosures.length} cierres
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => handleExportAll('pdf')}
                variant="outline"
                className="w-full justify-start gap-3"
              >
                <FileText className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <p className="text-gray-900">Exportar como PDF</p>
                  <p className="text-sm text-gray-600">Documento imprimible</p>
                </div>
              </Button>

              <Button
                onClick={() => handleExportAll('excel')}
                variant="outline"
                className="w-full justify-start gap-3"
              >
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="text-gray-900">Exportar como Excel</p>
                  <p className="text-sm text-gray-600">Hoja de cálculo editable</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Single Closure Modal */}
      {showClosureExportModal && selectedClosure && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Exportar cierre</h3>
              <button
                onClick={() => setShowClosureExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Exportar cierre #{selectedClosure.closureNumber}
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => handleExportClosure('pdf')}
                variant="outline"
                className="w-full justify-start gap-3"
              >
                <FileText className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <p className="text-gray-900">Exportar como PDF</p>
                  <p className="text-sm text-gray-600">Documento imprimible</p>
                </div>
              </Button>

              <Button
                onClick={() => handleExportClosure('excel')}
                variant="outline"
                className="w-full justify-start gap-3"
              >
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="text-gray-900">Exportar como Excel</p>
                  <p className="text-sm text-gray-600">Hoja de cálculo editable</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  