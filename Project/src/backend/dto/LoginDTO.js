import { ValidationException } from "../exceptions/ValidationException.js";

export default class LoginDTO {
    constructor(id, password) {
        this.id = id;
        this.password = password;
    }

    validate(){
        const errors = [];
        
        if (!this.id || this.id < 0) {
            errors.push("ID valido es requerido");
        }

        if (!this.password || this.password.length < 7) {
            errors.push("Contraseña debe tener minimo 8 caracteres");
        }

        if (errors.length > 0) {
            throw new ValidationException(errors);
        }
    }
}