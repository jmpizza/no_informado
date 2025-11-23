import {
  paymentMethodExists,
  savePaymentMethod,
  getPaymentMethods,
  updatePaymentMethodStatus,
} from "../repositories/PaymentMethodRepository.js";

function validatePaymentMethodName(name) {
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]{3,50}$/;
  return regex.test(name);
}

export async function registerPaymentMethod(name, description) {
  if (!validatePaymentMethodName(name)) {
    return { success: false, message: "Invalid name." };
  }

  const alreadyExists = await paymentMethodExists(name);
  if (alreadyExists) {
    return { success: false, message: "Payment method already exists." };
  }

  const saved = await savePaymentMethod(name, description);
  if (!saved) {
    return { success: false, message: "Error saving payment method." };
  }

  return { success: true, message: "Payment method successfully registered." };
}

export async function listPaymentMethods() {
  try {
    const methods = await getPaymentMethods();

    if (!methods || methods.length === 0) {
      return {
        success: false,
        message: "No hay métodos de pago disponibles.",
        data: null,
      };
    }

    return {
      success: true,
      message: "Métodos de pago obtenidos correctamente.",
      data: methods,
    };
  } catch (err) {
    return {
      success: false,
      message: `Error al obtener métodos de pago: ${err.message}`,
      data: null,
    };
  }
}

export async function changePaymentMethodStatus(name, action) {
  const status = action === "enable";

  const updated = await updatePaymentMethodStatus(name, status);

  if (!updated) {
    return { success: false, message: "Could not update status." };
  }

  return {
    success: true,
    message: action === "enable"
      ? "Payment method enabled."
      : "Payment method disabled.",
  };
}
