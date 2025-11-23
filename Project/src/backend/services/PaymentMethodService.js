import CreatePaymentMethodDTO from "../dto/CreatePaymentMethodDTO.js";
import UpdatePaymentMethodDTO from "../dto/UpdatePaymentMethodDTO.js";
import { ValidationException } from "../exceptions/ValidationException.js";

export default class PaymentMethodService {
  constructor(paymentMethodRepository) {
    this.paymentMethodRepository = paymentMethodRepository;
  }

  async createPaymentMethod(name, description) {
    const dto = new CreatePaymentMethodDTO(name, description);
    dto.validate();

    const existingMethod = await this.paymentMethodRepository.paymentMethodExists(name);
    if (existingMethod) {
      throw new ValidationException("El método de pago ya existe");
    }

    const paymentMethodData = {
      name: dto.name,
      description: dto.description,
    };

    return await this.paymentMethodRepository.create(paymentMethodData);
  }

  async listPaymentMethods(status) {
    return await this.paymentMethodRepository.findAll(status);
  }

  async updatePaymentMethodStatus(name, action) {
    const status = action === "enable";

    const dto = new UpdatePaymentMethodDTO(name);
    dto.validate();

    return await this.paymentMethodRepository.updateStatus(name, status);
  }
}