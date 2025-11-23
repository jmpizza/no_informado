import { ValidationException } from "../exceptions/ValidationException";

export default class CreatePaymentMethodDTO {
    constructor(name, description){
        this.name = name;
        this.description = description;
    }

    validate(){
        const errors = [];

        if (this.name.length() < 1){
            errors.push("Nombre valido es requerido");
        }

        if (this.name.length() < 1){
            errors.push("El método de pago debe tener una descrición")
        }

        if (errors.length > 0) {
            throw new ValidationException(errors);
        }
    }
}