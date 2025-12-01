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

  async getLastClosing() {
    const last = await this.closingRepository.findLast();

    if (!last) return null;

    return {
      id: last.id,
      date: last.created_at.toISOString(),
      user: last.user,
      difference: last.difference,
      totalDifference: last.difference, 
    };
  }

  async createClosingDetails(closingDetails) {
    //console.log("👉 closingDetails recibido en SERVICE:", closingDetails);

    const enriched = [];

    for (const detail of closingDetails) {
      const paymentMethod = await this.paymentMethodRepository.findByName(detail.name);

      enriched.push({
        comments: detail.comments || null,
        expected_balance: detail.expected_balance,
        counted: detail.counted,
        difference: detail.counted - detail.expected_balance,
        payment_method_id: paymentMethod.id,
        closing_id: detail.closing_id,
        created_at: detail.created_at,
      });
    }

    //console.log("👉 closingDetails salido en SERVICE:", enriched);

    return await this.closingRepository.createClosingDetails(enriched);
  }

  async getAllClosures(filters = {}) {
    const rawClosures = await this.closingRepository.findAll(filters);

    const formattedClosures = rawClosures.map(c => ({
      closureNumber: c.id,
      date: new Date(c.created_at).toLocaleString("es-CO"), 
      operator: c.user.name,
      totalDifference: c.difference,
    }));
    
    return formattedClosures;
}

calculateDifference(expected, counted) {
  const exp = Number(expected) || 0;
  const cnt = Number(counted) || 0;
  return cnt - exp;
}


async getClosureWithDetails(id) {
  const closure = await this.closingRepository.getClosureWithDetails(id);

  if (!closure) {
    throw new NotFoundException(`Cierre con id ${id} no encontrado`);
  }

  //console.log("🔴 closure obtenido:", closure);

  return {
    id: closure.id,
    closureNumber: closure.id, // si tienes un campo real, cámbialo
    operator: `${closure.user.name} ${closure.user.last_name}`,
    date: (closure.created_at).toLocaleString("es-CO"),
    totalExpected: closure.expected_balance,
    totalCounted: closure.counted,
    totalDifference: closure.difference,

    paymentMethods: closure.closing_details.map((d) => ({
      id: d.id,
      paymentMethodId: d.payment_method.id,
      name: d.payment_method.name,
      expectedAmount: d.expected_balance,
      countedAmount: d.counted,
      observations: d.comments,
      difference: d.difference
    }))
  };
}

async getInitialBalancesByPaymentMethods() {
    const lastClosure = await this.getLastClosing();

    if (!lastClosure) {
      throw new NotFoundException("No hay cierres registrados para calcular el balance inicial");
    }

    const lastClosureDetails = await this.getClosureWithDetails(lastClosure.id);


    return lastClosureDetails.paymentMethods.map(pm => ({
      id: pm.paymentMethodId,
      name: pm.name,
      expectedAmount: pm.expectedAmount,
      countedAmount: pm.countedAmount
    }));
  }

}  