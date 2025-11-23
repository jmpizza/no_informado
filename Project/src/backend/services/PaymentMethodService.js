import {
  paymentMethodExists,
  savePaymentMethod,
  getPaymentMethods,
  updatePaymentMethodStatus,
} from "../repositories/PaymentMethodRepository.js";

export default class PaymentMethodService {
  constructor(paymentMethodRepository) {
    this.paymentMethodRepository = paymentMethodRepository;
  }

  validatePaymentMethodName(name) {
    const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]{3,50}$/;
    return regex.test(name);
  }

  async registerPaymentMethod(name, description) {
    if (!this.validatePaymentMethodName(name)) {
      return { success: false, message: "Invalid name." };
    }

    const alreadyExists = await this.paymentMethodRepository.paymentMethodExists(name);
    if (alreadyExists) {
      return { success: false, message: "Payment method already exists." };
    }

    const saved = await this.paymentMethodRepository.savePaymentMethod(name, description);
    if (!saved) {
      return { success: false, message: "Error saving payment method." };
    }

    return { success: true, message: "Payment method successfully registered." };
  }

  async listPaymentMethods() {
    try {
      const methods = await this.paymentMethodRepository.getPaymentMethods();

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

  async changePaymentMethodStatus(name, action) {
    const status = action === "enable";

    const updated = await this.paymentMethodRepository.updatePaymentMethodStatus(name, status);

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
}