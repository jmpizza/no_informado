import { ValidationException } from "../exceptions/ValidationException.js";

export default class UpdateUserDTO {
  constructor(data) {
    this.id = data.id;
    this.name = data.name?.trim();
    this.last_name = data.last_name?.trim();
    this.email = data.email?.toLowerCase().trim();
    this.status = data.status;
    this.rol_id = data.rol_id;
  }

  validate(){
    const errors = [];

    if (!this.name || this.name.length === 0) {
      errors.push("Nombre es requerido");
    }

    if (!this.last_name || this.last_name.length === 0) {
        errors.push("Apellido es requerido");
    }

    if (!this.email || !this.email.includes("@")) {
      errors.push("Email invalido");
    }

    if (!this.rol_id) {
      errors.push("Rol es requerido");
    }

    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
  }
}