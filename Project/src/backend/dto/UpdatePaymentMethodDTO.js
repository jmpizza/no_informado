import { ValidationException } from "../exceptions/ValidationException.js";

export default class UpdatePaymentMethodDTO {
  constructor(name) {
    this.name = name;
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 1) {
      errors.push("Nombre válido requerido");
    }

    if (this.name === "Efectivo") {
      errors.push("No se puede modificar el estado del método Efectivo");
    }

    if (this.name === "Tarjeta") {
      errors.push("No se puede modificar el estado del método Tarjeta");
    }

    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
  }
}