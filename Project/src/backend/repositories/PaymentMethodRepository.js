export default class PaymentMethodRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async findByName(name) {
    return await this.db.payment_method.findUnique({
      where: { name },
    });
  }

  async exists(name) {
    const method = await this.findByName(name);
    return !!method;
  }

  async create(paymentMethodData) {
    return await this.db.payment_method.create({
      data: {
        ...paymentMethodData,
        active: paymentMethodData.active ?? true,
      },
    });
  }

  async findAll(status = null) {
    const where = status !== null ? { active: status } : {};
    
    return await this.db.payment_method.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
      },
    });
  }

  async update(name, paymentMethodData) {
    return await this.db.payment_method.update({
      where: { name },
      data: paymentMethodData,
    });
  }

  async updateStatus(name, status) {
    return await this.update(name, { active: status });
  }

  async delete(name) {
    return await this.db.payment_method.delete({
      where: { name },
    });
  }
}