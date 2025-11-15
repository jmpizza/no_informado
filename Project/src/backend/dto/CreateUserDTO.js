import { ValidationException } from "../exceptions/ValidationException.js";

export default class CreateUserDTO {
  constructor(data) {
    this.id = data.id;
    this.name = data.name?.trim();
    this.last_name = data.last_name?.trim();
    this.email = data.email?.toLowerCase().trim();
    this.password = data.password;
    this.rol_id = data.rol_id;
  }

  validate(){
    const errors = [];

    if (!this.id || this.id < 0) {
      errors.push("ID es requerido");
    }

    if (!this.name || this.name.length === 0) {
      errors.push("Nombre es requerido");
    }

    if (!this.email || !this.email.includes("@")) {
      errors.push("Email invalido");
    }

    if (!this.password || this.password.length < 8) {
      errors.push("Contraseña debe tener minimo 8 caracteres");
    }

    if (!this.rol_id) {
      errors.push("Rol es requerido");
    }

    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
  }
}