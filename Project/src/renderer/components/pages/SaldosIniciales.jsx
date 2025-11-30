import { useEffect, useState } from 'react';
import { DollarSign, CreditCard, Smartphone, Wallet, Lock, CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ICON_MAP } from '../../../constants/iconMap.js';


export default function SaldosIniciales() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [errors, setErrors] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [hasWarningBeenShown, setHasWarningBeenShown] = useState(false);
  const [success, setSuccess] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
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


  const fetchInitialBalances = async () => {
    try {
      const initialBalances = await window.api.getInitialBalancesByPaymentMethods();

      if (!initialBalances.success) throw new Error(initialBalances.error);

      const formatted = initialBalances.data.map(pm => ({
        id: pm.id, 
        icon: ICON_MAP[pm.name] ?? Info, 
        name: pm.name,
        expectedAmount: pm.countedAmount,
        initialAmount: "",
      }));

      setPaymentMethods(formatted);
    } catch (error) {
      console.error("Error fetching initial balances:", error);
    }
  };

  useEffect(() => {
    fetchInitialBalances();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await window.api.getUserInfo();
      if (!response.success) throw new Error(response.error);
      setCurrentUserInfo(response.data);
    } catch (err) {
      console.error("Error al obtener información del usuario:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleAmountChange = (id, value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPaymentMethods(prev =>
        prev.map(pm => pm.id === id ? { ...pm, initialAmount: value } : pm)
      );

      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });

      setSuccess(false);
      setShowWarning(false);
      setHasWarningBeenShown(false);
    }
  };

  const validateAmounts = () => {
    const newErrors = {};

    paymentMethods.forEach(pm => {
      const amount = parseFloat(pm.initialAmount) || 0;
      if (amount < 0) {
        newErrors[pm.id] = 'El valor debe ser un número no negativo.';
      }
    });

    return newErrors;
  };

  const checkDiscrepancies = () => {
    return paymentMethods.some(pm => {
      const amount = parseFloat(pm.initialAmount) || 0;
      return amount !== pm.expectedAmount;
    });
  };

  const calculateTotal = () => {
    return paymentMethods.reduce((sum, pm) => {
      return sum + (parseFloat(pm.initialAmount) || 0);
    }, 0);
  };

  const handleConfirm = async () => {
  const validationErrors = validateAmounts();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setErrors({});

  const hasDiscrepancies = checkDiscrepancies();

  if (hasDiscrepancies && !hasWarningBeenShown) {
    setShowWarning(true);
    setHasWarningBeenShown(true);
    return;
  }

  const now = new Date();
  const formattedDate =
    now.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) +
    ", " +
    now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

  setSavedData({
    date: formattedDate,
    user: currentUserInfo
      ? `${currentUserInfo.name} ${currentUserInfo.lastName} (${currentUserInfo.rol.name})`
      : "Cargando usuario...",
    totals: [...paymentMethods],
  });

  for (const pm of paymentMethods) {
    const amount = Number(pm.initialAmount) || 0;

    if (amount === 0) continue;

    const userIdResponse = await window.api.getAuthenticatedUser();

    const movementData = {
      ammount: amount,
      type: true,
      user_id: userIdResponse.userId,
      payment_method_id: pm.id, 
    };

    const response = await window.api.createMovement(movementData);

    if (!response.success) {
      showToast("error", "Error al registrar movimiento: " + response.error);
      return; 
    }
  }

  setSuccess(true);
  setShowWarning(false);

  window.scrollTo({ top: 0, behavior: "smooth" });
};


  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Registrar saldos iniciales</h1>
        <p className="text-gray-600">
          Ingresa los montos iniciales por medio de pago para iniciar el turno
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-green-800">Saldos iniciales registrados correctamente.</p>
        </div>
      )}

      {showWarning && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-orange-800">
              Los montos ingresados difieren de los esperados. Presiona confirmar nuevamente
              para continuar.
            </p>
            <p className="text-orange-700 text-sm mt-1">Se generará una alerta al administrador.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Medio de pago</th>
              <th className="px-6 py-3 text-left text-gray-700">Monto esperado</th>
              <th className="px-6 py-3 text-left text-gray-700">Monto inicial</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paymentMethods.map(pm => {
              const Icon = pm.icon;
              const hasError = !!errors[pm.id];

              return (
                <tr key={pm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900">{pm.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    $ {pm.expectedAmount.toLocaleString('es-CO')}
                  </td>

                  <td className="px-6 py-4">
                    <div className='text-gray-700'>
                      <Input
                        type="text"
                        value={pm.initialAmount}
                        onChange={e => handleAmountChange(pm.id, e.target.value)}
                        placeholder="0"
                        className={`max-w-xs ${hasError ? 'border-red-500' : ''}`}
                      />
                      {hasError && (
                        <p className="text-red-600 text-sm mt-1">{errors[pm.id]}</p>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            <tr className="bg-gray-50">
              <td className="px-6 py-4 text-gray-900">Total</td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-gray-900">
                $ {calculateTotal().toLocaleString('es-CO')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Button onClick={handleConfirm} className="w-full bg-blue-600 hover:bg-blue-700 py-6">
        <CheckCircle className="w-5 h-5 mr-2" />
        Confirmar saldos iniciales
      </Button>

      {savedData && (
        <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-500 mb-4">Registro guardado</h3>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">Fecha y hora</p>
              <p className="text-gray-900">{savedData.date}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Usuario</p>
              <p className="text-blue-600">{savedData.user}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-3">Totales por medio de pago</p>
            <div className="space-y-2">
              {savedData.totals.map(pm => {
                const amount = parseFloat(pm.initialAmount) || 0;
                if (amount === 0) return null;

                return (
                  <div key={pm.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{pm.name}:</span>
                    <span className="text-gray-900">
                      $ {amount.toLocaleString('es-CO')}
                    </span>
                  </div>
                );
              })}

              <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">
                  $
                  {savedData.totals
                    .reduce((sum, pm) => sum + (parseFloat(pm.initialAmount) || 0), 0)
                    .toLocaleString('es-CO')}
                </span>
              </div>
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
