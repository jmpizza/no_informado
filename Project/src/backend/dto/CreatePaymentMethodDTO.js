import { ValidationException } from "../exceptions/ValidationException.js";

export default class CreatePaymentMethodDTO {
  constructor(name, account_number) {
    this.name = name;
    this.account_number = account_number;
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 1) {
      errors.push("Nombre válido es requerido");
    }

    if (this.account_number !== null && this.account_number !== undefined) {
      if (isNaN(this.account_number) || this.account_number < 0) {
        errors.push("El número de cuenta debe ser un número válido");
      }
    }

    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
  }
}