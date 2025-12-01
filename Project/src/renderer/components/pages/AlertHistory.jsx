// AlertHistoryView.jsx
// Componente en JSX (sin TypeScript)

import { useEffect, useState } from 'react';
import { AlertTriangle, Search, Filter, Download, X, FileText, FileSpreadsheet, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';



export default function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showExportModal, setShowExportModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message) => {
        const id = Date.now();

        setToasts(prev => {
            if (prev.some(t => t.message === message)) return prev;
            return [...prev, { id, type, message }];
        });

        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };


const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
};

  useEffect(() => {
    fetchAlerts();
  }, []);


  const fetchAlerts = async () => {
    setLoading(true); 
    const response = await window.api.getAllAlerts();

    setAlerts(response.data);
    setLoading(false); 
  } 

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-500' };
      case 'warning':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-500' };
      case 'info':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-500' };
      default:
        return {};
    }
  };

  const filterAndSortAlerts = () => {
    let filtered = [...alerts];

    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.operator.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(alert => {
        const alertDate = new Date(alert.date);
        switch (dateFilter) {
          case 'today':
            return alertDate.toDateString() === now.toDateString();
          case 'week':
            return alertDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          case 'month':
            return alertDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          default:
            return true;
        }
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return (b.amount || 0) - (a.amount || 0);
        case 'amount-asc':
          return (a.amount || 0) - (b.amount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredAlerts = filterAndSortAlerts();

  const handleExport = (format) => {
    showToast("success", `Exportando ${filteredAlerts.length} alertas en formato ${format.toUpperCase()}`);
    setShowExportModal(false);
  };

  return (
    <div className="p-8 flex flex-col min-h-screen bg-gray-100">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h1 className="text-gray-900">Historial de alertas</h1>
            </div>
            <p className="text-gray-600">Visualiza y gestiona todas las alertas detectadas</p>
          </div>
          <Button onClick={() => setShowExportModal(true)} variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm text-gray-700 mb-1.5 block">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 text-gray-700" />
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-700 mb-1.5 block">Filtrar por fecha</Label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-700 mb-1.5 block">Ordenar por</Label>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Fecha (reciente)</SelectItem>
                <SelectItem value="date-asc">Fecha (antigua)</SelectItem>
                <SelectItem value="amount-desc">Monto (alto a bajo)</SelectItem>
                <SelectItem value="amount-asc">Monto (bajo a alto)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-gray-500 text-center py-10">Cargando alertas...</p>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No hay alertas</h3>
          <p className="text-gray-600">No se encontraron alertas con los filtros aplicados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const colors = getSeverityColor(alert.severity);
            return (
              <div key={alert.id} className={`bg-white rounded-lg border ${colors.border} p-4`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${colors.badge} rounded-lg flex items-center justify-center`}>
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{alert.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${colors.bg} ${colors.text}`}>{alert.type}</span>
                    </div>

                    <p className="text-gray-600 mb-3">{alert.description}</p>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Fecha</p>
                        <p className="text-gray-900">
                          {alert.date ? new Date(alert.date).toLocaleString('es-CO') : '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Operador</p>
                        <p className="text-blue-600">{alert.operator}</p>
                      </div>

                      {alert.amount !== undefined && (
                        <div>
                          <p className="text-gray-500">Monto</p>
                          <p className={colors.text}>
                            $ {alert.amount != null ? alert.amount.toLocaleString('es-CO') : '-'}
                          </p>

                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal export */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Exportar alertas</h3>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">Selecciona el formato para exportar {filteredAlerts.length} alertas</p>

            <div className="space-y-3">
              <Button onClick={() => handleExport('pdf')} variant="outline" className="w-full justify-start gap-3">
                <FileText className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <p className="text-gray-900">Exportar como PDF</p>
                  <p className="text-sm text-gray-600">Documento imprimible</p>
                </div>
              </Button>

              <Button onClick={() => handleExport('excel')} variant="outline" className="w-full justify-start gap-3">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="text-gray-900">Exportar como Excel</p>
                  <p className="text-sm text-gray-600">Formato .xlsx</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`flex justify-between items-center p-3 shadow-lg max-w-xs w-full
                                    ${t.type === "success" ? "bg-green-500" : "bg-red-500"} 
                                    text-white rounded-2xl`}
                    >
                        <span className="mr-2">{t.message}</span>
                        <button 
                            onClick={() => removeToast(t.id)} 
                            className="p-1 rounded-full hover:bg-red-500/20 flex items-center justify-center"
                        >
                            <X size={14} strokeWidth={2} className="text-white" />
                        </button>
                    </div>
                ))}
            </div>
    </div>
  );
}
