import { ValidationException } from "../exceptions/ValidationException.js";

export default class CreateMovementDTO {
  constructor(ammount, type, user_id, payment_method_id, closing_id) {
    this.ammount = ammount;
    this.type = type;
    this.user_id = user_id;
    this.payment_method_id = payment_method_id;
    this.closing_id = closing_id;
  }

  validate() {
    const errors = [];

    if (this.ammount === undefined || this.ammount === null) {
      errors.push("El monto es requerido");
    }

    if (typeof this.ammount !== 'number' || this.ammount <= 0) {
      errors.push("El monto debe ser un número mayor a 0");
    }

    if (this.type === undefined || this.type === null) {
      errors.push("El tipo de movimiento es requerido");
    }

    if (typeof this.type !== 'boolean') {
      errors.push("El tipo de movimiento debe ser un valor booleano");
    }

    if (!this.user_id) {
      errors.push("El ID del usuario es requerido");
    }

    if (typeof this.user_id !== 'number' || this.user_id <= 0) {
      errors.push("El ID del usuario debe ser un número válido");
    }

    if (!this.payment_method_id) {
      errors.push("El ID del método de pago es requerido");
    }

    if (typeof this.payment_method_id !== 'number' || this.payment_method_id <= 0) {
      errors.push("El ID del método de pago debe ser un número válido");
    }

    if (this.closing_id !== null && this.closing_id !== undefined) {
      if (typeof this.closing_id !== 'number' || this.closing_id <= 0) {
        errors.push("El ID del cierre debe ser un número válido");
      }
    }

    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
  }
}