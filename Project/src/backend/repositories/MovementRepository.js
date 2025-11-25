export default class MovementRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async findById(id) {
    return await this.db.movement.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        payment_method: {
          select: {
            id: true,
            name: true,
            active: true,
          }
        },
        closing: {
          select: {
            id: true,
            created_at: true,
          }
        }
      },
    });
  }

  async create(movementData) {
    return await this.db.movement.create({
      data: {
        ammount: movementData.ammount,
        type: movementData.type,
        user_id: movementData.user_id,
        payment_method_id: movementData.payment_method_id,
        closing_id: movementData.closing_id || null,
        created_at: movementData.created_at || new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        payment_method: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    });
  }

  async findAll(filters = {}) {
    const where = {};

    if (filters.user_id) {
      where.user_id = filters.user_id;
    }

    if (filters.payment_method_id) {
      where.payment_method_id = filters.payment_method_id;
    }

    if (filters.type !== undefined && filters.type !== null) {
      where.type = filters.type;
    }

    if (filters.closing_id) {
      where.closing_id = filters.closing_id;
    }

    if (filters.date_from || filters.date_to) {
      where.created_at = {};
      if (filters.date_from) {
        where.created_at.gte = new Date(filters.date_from);
      }
      if (filters.date_to) {
        where.created_at.lte = new Date(filters.date_to);
      }
    }

    return await this.db.movement.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        payment_method: {
          select: {
            id: true,
            name: true,
          }
        },
        closing: {
          select: {
            id: true,
            created_at: true,
          }
        }
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async update(id, movementData) {
    return await this.db.movement.update({
      where: { id },
      data: movementData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        payment_method: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    });
  }

  async delete(id) {
    return await this.db.movement.delete({
      where: { id },
    });
  }

  async getTotalByPaymentMethod(payment_method_id, type = null) {
    const where = { payment_method_id };
    
    if (type !== null) {
      where.type = type;
    }

    const result = await this.db.movement.aggregate({
      where,
      _sum: {
        ammount: true,
      },
    });

    return result._sum.ammount || 0;
  }

  async getTotalByPaymentMethodToday(payment_method_id, type = null) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const where = {
      payment_method_id,
      created_at: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (type !== null) {
      where.type = type;
    }

    const result = await this.db.movement.aggregate({
      where,
      _sum: {
        ammount: true,
      },
    });

    return result._sum.ammount || 0;
  }


  async getTotalByUser(user_id, type = null) {
    const where = { user_id };
    
    if (type !== null) {
      where.type = type;
    }

    const result = await this.db.movement.aggregate({
      where,
      _sum: {
        ammount: true,
      },
    });

    return result._sum.ammount || 0;
  }

  async findLatestMovement() {
    return this.db.movement.findFirst({
      orderBy: {id: 'desc'}
    })
  }
}