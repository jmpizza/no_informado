export default class UserRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async create(userData) {
    return await this.db.user.create({
      data: userData,
      include: { rol: true },
    });
  }

  async findById(id) {
    return await this.db.user.findUnique({
      where: { id },
      include: { rol: true },
    });
  }

  async findByEmail(email) {
    return await this.db.user.findUnique({
      where: { email },
    });
  }

  async findAll(filters = {}) {
    return await this.db.user.findMany({
      where: filters,
      include: { rol: true },
      orderBy: { created_at: 'desc' }
    });
  }

  async update(id, userData) {
    return await this.db.user.update({
      where: { id },
      data: userData,
      include: { rol: true }
    });
  }

  async delete(id) {
    return await this.db.user.delete({
      where: { id }
    });
  }
}
