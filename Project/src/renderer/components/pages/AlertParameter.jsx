import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function AlertParameter({ parameters = {}, onSave = () => {} }) {

  const defaultValues = {
    closureDifferenceThreshold: 15000,
    minorDifferenceThreshold: 0,
    irregularAmountLimit: 500000,
    anomalousMovementInterval: 5,
    maxAnomalousMovementsPerDay: 10,
  };
  
  const [formData, setFormData] = useState({ ...defaultValues, ...parameters });
  const [success, setSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const updateCurrentConfiguration = async () => {
    try {
    const params = await window.api.getParameters()
    setFormData(params.parameters)
    } catch (err) {
      console.error("Error al colocar los parametros:", err);
    }
  }

  useEffect(() => {
    updateCurrentConfiguration()
  }, []);

  
  const handleChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    
    const response = await window.api.setParameters(formData)
    const respons = (await window.api.getParameters()).Parameters

    onSave(formData);
    setSuccess(true);
    setShowConfirmModal(false);


    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => setSuccess(false), 3000);
  };

  const handleCancelSave = () => {
    setShowConfirmModal(false);
  };

  return (
<div className="p-8 min-h-screen bg-white mx-auto ">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-orange-600" />
          </div>
          <h1 className="text-gray-900">Parámetros de alertas</h1>
        </div>
        <p className="text-gray-600">
          Configura los umbrales y límites para la detección automática de inconsistencias
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-green-800">Parámetros actualizados correctamente</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Closure Parameters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Parámetros de cierre de caja</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="closureDifferenceThreshold">
                Umbral de diferencia crítica (COP)
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                Diferencia que genera alerta crítica (roja) en cierres de caja
              </p>
              <Input
                id="closureDifferenceThreshold"
                type="number"
                value={formData.closureDifferenceThreshold}
                onChange={(e) => handleChange('closureDifferenceThreshold', e.target.value)}
                className="mt-1.5 text-black"
                placeholder="15000"
              />
            </div>

            <div>
              <Label htmlFor="minorDifferenceThreshold">
                Umbral de diferencia menor (COP)
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                Diferencia que genera alerta de advertencia (amarilla)
              </p>
              <Input
                id="minorDifferenceThreshold"
                type="number"
                value={formData.minorDifferenceThreshold}
                onChange={(e) => handleChange('minorDifferenceThreshold', e.target.value)}
                className="mt-1.5 text-black"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Movement Parameters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Parámetros de movimientos</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="irregularAmountLimit">
                Límite de monto irregular (COP)
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                Transacciones que superen este monto generarán una alerta
              </p>
              <Input
                id="irregularAmountLimit"
                type="number"
                value={formData.irregularAmountLimit}
                onChange={(e) => handleChange('irregularAmountLimit', e.target.value)}
                className="mt-1.5 text-black"
                placeholder="500000"
              />
            </div>

            <div>
              <Label htmlFor="anomalousMovementInterval">
                Intervalo para movimientos anómalos (minutos)
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                Tiempo mínimo entre transacciones consecutivas del mismo tipo
              </p>
              <Input
                id="anomalousMovementInterval"
                type="number"
                value={formData.anomalousMovementInterval}
                onChange={(e) => handleChange('anomalousMovementInterval', e.target.value)}
                className="mt-1.5 text-black"
                placeholder="5"
              />
            </div>

            <div>
              <Label htmlFor="maxAnomalousMovementsPerDay">
                Máximo de movimientos anómalos por día
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                Cantidad máxima de transacciones irregulares permitidas en un día
              </p>
              <Input
                id="maxAnomalousMovementsPerDay"
                type="number"
                value={formData.maxAnomalousMovementsPerDay}
                onChange={(e) => handleChange('maxAnomalousMovementsPerDay', e.target.value)}
                className="mt-1.5 text-black"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-blue-900 mb-4">Resumen de configuración actual</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Diferencia crítica:</p>
              <p className="text-blue-900">
                ≥ $ {formData.closureDifferenceThreshold.toLocaleString('es-CO')}
              </p>
            </div>

            <div>
              <p className="text-blue-700">Diferencia menor:</p>
              <p className="text-blue-900">
                $ 0 - $ {formData.closureDifferenceThreshold.toLocaleString('es-CO')}
              </p>
            </div>

            <div>
              <p className="text-blue-700">Monto irregular:</p>
              <p className="text-blue-900">
                ≥ $ {formData.irregularAmountLimit.toLocaleString('es-CO')}
              </p>
            </div>

            <div>
              <p className="text-blue-700">Movimientos anómalos max:</p>
              <p className="text-blue-900">
                {formData.maxAnomalousMovementsPerDay} por día
              </p>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-6">
          <Save className="w-5 h-5 mr-2" />
          Guardar parámetros
        </Button>
      </form>

      {/* Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-gray-900">Confirmar cambios en parámetros</h3>
              </div>

              <button onClick={handleCancelSave} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Estás a punto de modificar los parámetros de detección de alertas.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <h4 className="text-gray-900">Resumen de cambios:</h4>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Umbral crítico de cierre:</span>
                    <span className="text-gray-900">
                      $ {formData.closureDifferenceThreshold.toLocaleString('es-CO')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Umbral menor:</span>
                    <span className="text-gray-900">
                      $ {formData.minorDifferenceThreshold.toLocaleString('es-CO')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Límite monto irregular:</span>
                    <span className="text-gray-900">
                      $ {formData.irregularAmountLimit.toLocaleString('es-CO')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Intervalo movimientos:</span>
                    <span className="text-gray-900">{formData.anomalousMovementInterval} minutos</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Movimientos anómalos máx/día:</span>
                    <span className="text-gray-900">{formData.maxAnomalousMovementsPerDay}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Los nuevos parámetros se aplicarán inmediatamente.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCancelSave} variant="outline" className="flex-1">
                Cancelar
              </Button>

              <Button onClick={handleConfirmSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
