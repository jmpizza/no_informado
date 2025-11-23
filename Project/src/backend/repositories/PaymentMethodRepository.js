export default class PaymentMethodRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async findByName(name) {
    return await this.db.payment_method.findFirst({
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
        name: paymentMethodData.name,
        active: paymentMethodData.active ?? true,
        account_number: paymentMethodData.account_number || null,
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
        active: true,
        account_number: true,
      },
    });
  }

  async update(id, paymentMethodData) {
    return await this.db.payment_method.update({
      where: { id },
      data: paymentMethodData,
    });
  }

  async updateStatus(name, status) {
    const method = await this.findByName(name);
    if (!method) {
      throw new Error(`Payment method '${name}' not found`);
    }
    return await this.update(method.id, { active: status });
  }

  async delete(id) {
    return await this.db.payment_method.delete({
      where: { id },
    });
  }
}