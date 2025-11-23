import { ValidationException } from "../exceptions/ValidationException.js";

export default class UpdatePaymentMethodDTO {
  constructor(name) {
    this.name;
  }
  validate() {
    const errors = [];

    if (this.name.length < 1){
      errors.push("Nombre valido requerido");
    }

    if (this.name === "Efectivo") {
      errors.push("No se puede modificar el estado del metodo Efectivo");
    }

    if (this.name === "Tarjeta") {
      errors.push("No se puede modificar el estado del metodo Tarjeta")
    }

    if (errors.length > 0){
      throw new ValidationException(errors);
    }
  }
}
