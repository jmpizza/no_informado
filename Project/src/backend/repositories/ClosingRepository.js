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

  async createClosingDetails(detailsArray) {
    return await this.db.closing_details.createMany({
      data: detailsArray.map(d => ({
        comments: d.comments,
        expected_balance: d.expected_balance,
        counted: d.counted,
        difference: d.expected_balance - d.counted,
        payment_method_id: d.payment_method_id || null,
        closing_id: d.closing_id,
        created_at: d.created_at,
        name: d.name
      }))
    });
  }

  async getClosureWithDetails(id) {
    return await this.db.closing.findUnique({
      where: { id },
      select: {
        id: true,
        created_at: true,
        expected_balance: true,
        counted: true,
        difference: true,
        user: {
          select: {
            name: true,
            last_name: true
          }
        },
        closing_details: {
          select: {
            id: true,
            expected_balance: true,
            counted: true,
            comments: true,
            difference: true,
            payment_method: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
  }


}