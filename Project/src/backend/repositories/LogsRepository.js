export default class LogsRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async create(logData) {
    return await this.db.logs.create({
      data: {
        action: logData.action,
        user_id: logData.user_id,
        details: logData.details,
        created_at: logData.created_at || new Date(),
      },
    });
  }

  async findAll(filters = {}) {
    return await this.db.logs.findMany({
      where: filters,
      orderBy: { created_at: 'desc' },
    });
  }

  async findByUserId(userId) {
    return await this.db.logs.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByAction(action) {
    return await this.db.logs.findMany({
      where: { action },
      orderBy: { created_at: 'desc' },
    });
  }

  async findRecent(limit = 10) {
    return await this.db.logs.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
    });
  }
}
