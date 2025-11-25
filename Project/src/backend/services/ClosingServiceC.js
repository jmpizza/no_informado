import { NotFoundException } from "../exceptions/NotFoundException.js";

export default class ClosingService {
  constructor(closingRepository, userRepository, paymentMethodService, movementRepository, paymentMethodRepository) {
    this.closingRepository = closingRepository;
    this.userRepository = userRepository;
    this.paymentMethodService = paymentMethodService;
    this.movementRepository = movementRepository; 
    this.paymentMethodRepository = paymentMethodRepository;
  }

  async fetchClosingData(status) {
    
    const paymentMethods = await this.paymentMethodService.listPaymentMethods(status);

    const results = [];

    for (const method of paymentMethods) {

      const totalIncome = await this.totalByPaymentMethodToday(method.id, true);

      const totalOutcome = await this.totalByPaymentMethodToday(method.id, false);

      const balance = totalIncome - totalOutcome;

      results.push({
        payment_method_id: method.id,
        name: method.name,
        balance: balance
      });
    }

    return results;
}

  async totalByPaymentMethodToday(payment_method_id, type) {
  
    const paymentMethodExists = await this.paymentMethodRepository.findById(payment_method_id);
    
    if (!paymentMethodExists) {
      throw new NotFoundException(`Método de pago con id ${payment_method_id} no encontrado`);
    }
    return await this.movementRepository.getTotalByPaymentMethodToday(payment_method_id, type);
  }

  async createClosing(total,comment, expected_balance, counted, difference, created_at, user_id) {

    const userExists = await this.userRepository.findById(user_id);
    if (!userExists) {
      throw new NotFoundException(`Usuario con id ${user_id} no encontrado`);
    }

    const closingData = {
      total: total,
      comments: comment,
      expected_balance: expected_balance,
      counted: counted,
      difference: difference,
      created_at: created_at,
      user_id: user_id
    };

    return await this.closingRepository.create(closingData);
  }

/*  async getLastClosing() {

    const lastClosing = await this.closingRepository.findLast();

    if (!lastClosing) {
      throw new NotFoundException("No se encontró ningún cierre previo");
    }
    return lastClosing;
  } */
}   