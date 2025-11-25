// ClosingRepository.js
export default class ClosingRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async findById(id) {
    return await this.db.closing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findLast() {
    return await this.db.closing.findFirst({
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { id: true, name: true, last_name: true, email: true },
        },
      },
    });
  }

  async findAll(filters = {}) {
    const where = {};
    if (filters.user_id) where.user_id = filters.user_id;
    if (filters.date_from || filters.date_to) {
      where.created_at = {};
      if (filters.date_from) where.created_at.gte = new Date(filters.date_from);
      if (filters.date_to) where.created_at.lte = new Date(filters.date_to);
    }

    return await this.db.closing.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { created_at: "desc" },
    });
  }

  async create(closingData) {
    return await this.db.closing.create({
      data: {
        total: closingData.total,
        comments: closingData.comments || null,
        expected_balance: closingData.expected_balance,
        counted: closingData.counted,
        difference: closingData.difference,
        user_id: closingData.user_id,
        created_at: closingData.created_at || new Date(),
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async update(id, data) {
    return await this.db.closing.update({
      where: { id },
      data,
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async delete(id) {
    return await this.db.closing.delete({ where: { id } });
  }
}
