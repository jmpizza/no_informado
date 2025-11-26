import { useState, useEffect, use } from 'react';
import { DollarSign, CreditCard, Smartphone, Wallet, Lock, CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ICON_MAP } from '../../../constants/iconMap.js';


export default function Cierre({ lastClosure, onClosureConfirmed }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [closureCompleted, setClosureCompleted] = useState(false);
  const [lastClosureData, setLastClosureData] = useState(null);



  const fetchClosingData = async () => {
    try {
      const response = await window.api.fetchClosingData(true);

      if (!response.success) throw new Error(response.error);

      const formatted = response.data.map((method) => ({
        id: method.payment_method_id,
        name: method.name,
        icon: ICON_MAP[method.name] ?? Info,
        expectedAmount: method.balance,
        countedAmount: "",
        observations: "",
      }));

      setPaymentMethods(formatted);

    } catch (err) {
      console.error("Error al obtener cierre:", err);
    }
  };

    // Al montar el componente, cargamos los datos del cierre
  useEffect(() => {
    fetchClosingData();
  }, []);





  const fetchLastClosing = async () => {
    try {
      const response = await window.api.getLastClosing();

      if (!response.success) throw new Error(response.error);

      const lastClosure = response.data;

      setLastClosureData(lastClosure);

    } catch (err) {
      console.error("Error al obtener el último cierre:", err);
    }
  };


  useEffect(() => {
    fetchLastClosing();
  }, []);


 
  const handleAmountChange = (id, value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPaymentMethods(prev =>
        prev.map(pm => pm.id === id ? { ...pm, countedAmount: value } : pm)
      );
    }
  };

  const handleObservationsChange = (id, value) => {
    setPaymentMethods(prev =>
      prev.map(pm => pm.id === id ? { ...pm, observations: value } : pm)
    );
  };

  const calculateDifference = (expected, counted) => {
    const countedNum = parseFloat(counted) || 0;
    return countedNum - expected;
  };

  const getStatusColor = (difference) => {
    if (difference <= -15000) {
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    } else if (difference < 0) {
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    } else {
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    }
  };

  const calculateTotals = () => {
    const totalExpected = paymentMethods.reduce((sum, pm) => sum + pm.expectedAmount, 0);
    const totalCounted = paymentMethods.reduce((sum, pm) => sum + (parseFloat(pm.countedAmount) || 0), 0);
    const totalDifference = totalCounted - totalExpected;
    return { totalExpected, totalCounted, totalDifference };
  };

  const handleFinalizeClosure = () => {
    setShowConfirmationModal(true);
  };

  const totals = calculateTotals();

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) + ', ' + currentDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleConfirmClosure = async () => {
    const currentDate = new Date();
    const methodsCount = paymentMethods.length;


    const closingData = {
      total: totals.totalCounted,
      counted: totals.totalCounted,
      expected_balance: totals.totalExpected,
      difference: totals.totalDifference,
      comments: `Cierre realizado con ${methodsCount} medios de pago.`,
      created_at: currentDate,
      user_id: 1000000000
    };

  


    try {

      const response = await window.api.createClosing(closingData);
      

      if (!response.success) throw new Error(response.error);

      const newClosingId = response.data.id;

      const closingDetails = paymentMethods.map(pm => ({
        name: pm.name, 
        closing_id: newClosingId,
        expected_balance: Number(pm.expectedAmount) || 0,
        counted: Number(pm.countedAmount) || 0,
        comments: pm.observations || null,
        created_at: currentDate.toISOString()
      }));

      console.log("closingDetails =>", closingDetails);

      

      const responseDetails = await window.api.createClosingDetails(closingDetails);

      if (!responseDetails.success) throw new Error(responseDetails.error);


      setShowConfirmationModal(false);
      setClosureCompleted(true);

      await resetModule();

    } catch (err) {
      console.error("Error al guardar cierre:", err);
    }
  };



  const handleCancelClosure = () => {
    setShowConfirmationModal(false);
  };

  const resetModule = async () => {
    setPaymentMethods([]);
    setLastClosureData(null);
    setClosureCompleted(false);

    await fetchClosingData();
    await fetchLastClosing();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalStatusColor = getStatusColor(totals.totalDifference);

  return (
    <div className=''>
            <div className="p-8 w-full overflow-x-hidden mx-auto h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-gray-900">Cierre de caja</h1>
        </div>
        <p className="text-gray-600">
          Ingresa los montos contados por medio de pago para realizar el cierre del día
        </p>
      </div>

      {/* Success */}
      {closureCompleted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <p className="text-green-800">Cierre de caja finalizado correctamente.</p>
        </div>
      )}

      {/* Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <p className="text-blue-800">
          Los cierres de caja son registros inmutables y no podrán ser modificados una vez confirmados.
        </p>
      </div>

      {/* Last closure */}
      
      {lastClosureData && (
        <div className="mb-6">
          <h3 className="text-gray-500 mb-3">Último cierre registrado</h3>
          <div className={`rounded-lg border p-4 ${getStatusColor(lastClosureData.difference).border} ${getStatusColor(lastClosureData.difference).bg}`}>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Cierre #{lastClosureData.id}</p>
                <p className="text-gray-900">
                  {lastClosureData?.date ? new Date(lastClosureData.date).toLocaleString('es-CO') : "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Operador</p>
                <p className="text-blue-600">
                  {lastClosureData.user.name} {lastClosureData.user.last_name}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Estado</p>
                <p className={getStatusColor(lastClosureData.difference).text}>
                  {lastClosureData.totalDifference === 0 ? 'Cuadrada' :
                  lastClosureData.totalDifference > 0 ? 'Sobrante' : 'Faltante'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Diferencia</p>
                <p className={getStatusColor(lastClosureData.difference).text}>
                  {lastClosureData.difference >= 0 ? '+' : ''} $
                  {lastClosureData.difference.toLocaleString('es-CO')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Payment table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Medio</th>
              <th className="px-6 py-3 text-left">Esperado</th>
              <th className="px-6 py-3 text-left">Contado</th>
              <th className="px-6 py-3 text-left">Diferencia</th>
              <th className="px-6 py-3 text-left">Observaciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {paymentMethods.map(pm => {
              const Icon = pm.icon;
              const difference = calculateDifference(pm.expectedAmount, pm.countedAmount);
              const statusColor = getStatusColor(difference);
              const showObservations =
                parseFloat(pm.countedAmount || '0') < pm.expectedAmount &&
                pm.countedAmount !== '';

              return (
                <tr key={pm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span>{pm.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    $ {pm.expectedAmount.toLocaleString('es-CO')}
                  </td>

                  <td className="px-6 py-4">
                    <Input
                      type="text"
                      value={pm.countedAmount}
                      onChange={e => handleAmountChange(pm.id, e.target.value)}
                      placeholder="0"
                      className="max-w-xs"
                    />
                  </td>

                  <td className="px-6 py-4">
                    {pm.countedAmount !== '' && (
                      <span className={`inline-flex items-center px-3 py-1 rounded border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                        {difference >= 0 ? '+' : ''} $
                        {difference.toLocaleString('es-CO')}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {showObservations && (
                      <Textarea
                        value={pm.observations}
                        onChange={e => handleObservationsChange(pm.id, e.target.value)}
                        placeholder="Introduzca observación"
                        className="min-h-[60px]"
                      />
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Totals */}
            <tr className="bg-gray-100">
              <td className="px-6 py-4 font-medium">Total</td>
              <td className="px-6 py-4 font-medium">
                $ {totals.totalExpected.toLocaleString('es-CO')}
              </td>
              <td className="px-6 py-4 font-medium">
                $ {totals.totalCounted.toLocaleString('es-CO')}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded border ${totalStatusColor.bg} ${totalStatusColor.text} ${totalStatusColor.border}`}>
                  {totals.totalDifference >= 0 ? '+' : ''} $
                  {totals.totalDifference.toLocaleString('es-CO')}
                </span>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Info cierre */}
      <div className="bg-gray-50 rounded-lg border p-6 mb-6">
        <h3 className="text-gray-500 mb-4">Información del cierre</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">Operador</p>
            <p className="text-blue-600">Juan Pérez (Cajero)</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Fecha y hora</p>
            <p className="text-gray-900">{formattedDate}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Estado</p>
            <p className={totalStatusColor.text}>
              {totals.totalDifference === 0 ? 'Cuadrada' :
              totals.totalDifference > 0 ? 'Sobrante' : 'Faltante'}
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleFinalizeClosure}
        className="w-full bg-blue-600 hover:bg-blue-700 py-6"
      >
        <Lock className="w-5 h-5 mr-2" />
        Finalizar cierre
      </Button>

      {/* Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-gray-900">Confirmación de cierre</h2>
              </div>

              <button
                onClick={handleCancelClosure}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Resumen */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Operador</p>
                    <p className="text-blue-600">Juan Pérez (Cajero)</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Fecha y hora</p>
                    <p className="text-gray-900">{formattedDate}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Total esperado</p>
                      <p>$ {totals.totalExpected.toLocaleString('es-CO')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Total contado</p>
                      <p>$ {totals.totalCounted.toLocaleString('es-CO')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Diferencia</p>
                      <p className={totalStatusColor.text}>
                        {totals.totalDifference >= 0 ? '+' : ''} $
                        {totals.totalDifference.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalle por medio */}
              <div>
                <h3 className="mb-4 text-gray-900">Detalle por medio de pago</h3>
                <div className="space-y-3">
                  {paymentMethods.map(pm => {
                    const counted = parseFloat(pm.countedAmount) || 0;
                    const difference = counted - pm.expectedAmount;
                    const statusColor = getStatusColor(difference);

                    return (
                      <div key={pm.id} className={`p-4 rounded-lg border ${statusColor.border} ${statusColor.bg}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <pm.icon className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-900">{pm.name}</span>
                          </div>
                          <span className={statusColor.text}>
                            {difference >= 0 ? '+' : ''} $
                            {difference.toLocaleString('es-CO')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Esperado: </span>
                            <span>$ {pm.expectedAmount.toLocaleString('es-CO')}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Contado: </span>
                            <span>$ {counted.toLocaleString('es-CO')}</span>
                          </div>
                        </div>

                        {pm.observations && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-gray-600 text-sm mb-1">Observaciones:</p>
                            <p className="text-gray-900 text-sm">{pm.observations}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mensajes finales */}
              {totals.totalDifference < 0 ? (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <p className="text-orange-800">
                    Faltante de $ {Math.abs(totals.totalDifference).toLocaleString('es-CO')}.
                  </p>
                </div>
              ) : totals.totalDifference > 0 ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-blue-800">
                    Sobrante de $ {totals.totalDifference.toLocaleString('es-CO')}.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-green-800">La caja está cuadrada.</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t">
              <Button onClick={handleCancelClosure} variant="outline" className="flex-1">
                Cancelar
              </Button>

              <Button onClick={handleConfirmClosure} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar cierre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
