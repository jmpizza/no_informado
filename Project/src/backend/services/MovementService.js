import CreateMovementDTO from "../dto/CreateMovementDTO.js";
import { ValidationException } from "../exceptions/ValidationException.js";
import { NotFoundException } from "../exceptions/NotFoundException.js";

export default class MovementService {
  constructor(movementRepository, userRepository, paymentMethodRepository) {
    this.movementRepository = movementRepository;
    this.userRepository = userRepository;
    this.paymentMethodRepository = paymentMethodRepository;
  }

  async createMovement(ammount, type, user_id, payment_method_id, closing_id = null) {
    const dto = new CreateMovementDTO(ammount, type, user_id, payment_method_id, closing_id);
    dto.validate();

    const userExists = await this.userRepository.findById(user_id);
    if (!userExists) {
      throw new NotFoundException(`Usuario con id ${user_id} no encontrado`);
    }

    const paymentMethodExists = await this.paymentMethodRepository.findById(payment_method_id);
    if (!paymentMethodExists) {
      throw new NotFoundException(`Método de pago con id ${payment_method_id} no encontrado`);
    }

    if (!paymentMethodExists.active) {
      throw new ValidationException("El método de pago está inactivo");
    }

    const movementData = {
      ammount: dto.ammount,
      type: dto.type,
      user_id: dto.user_id,
      payment_method_id: dto.payment_method_id,
      closing_id: dto.closing_id,
    };

    return await this.movementRepository.create(movementData);
  }

  async getMovementById(id) {
    const movement = await this.movementRepository.findById(id);
    
    if (!movement) {
      throw new NotFoundException(`Movimiento con id ${id} no encontrado`);
    }

    return movement;
  }

  async listMovements(filters = {}) {
    return await this.movementRepository.findAll(filters);
  }

  async updateMovement(id, movementData) {
    const existingMovement = await this.movementRepository.findById(id);
    
    if (!existingMovement) {
      throw new NotFoundException(`Movimiento con id ${id} no encontrado`);
    }

    return await this.movementRepository.update(id, movementData);
  }

  async deleteMovement(id) {
    const existingMovement = await this.movementRepository.findById(id);
    
    if (!existingMovement) {
      throw new NotFoundException(`Movimiento con id ${id} no encontrado`);
    }

    return await this.movementRepository.delete(id);
  }

  async getTotalByPaymentMethod(payment_method_id, type = null) {
    const paymentMethodExists = await this.paymentMethodRepository.findById(payment_method_id);
    
    if (!paymentMethodExists) {
      throw new NotFoundException(`Método de pago con id ${payment_method_id} no encontrado`);
    }

    return await this.movementRepository.getTotalByPaymentMethod(payment_method_id, type);
  }

  async getTotalByUser(user_id, type = null) {
    const userExists = await this.userRepository.findById(user_id);
    
    if (!userExists) {
      throw new NotFoundException(`Usuario con id ${user_id} no encontrado`);
    }

    return await this.movementRepository.getTotalByUser(user_id, type);
  }
}