import DatabaseSingle  from "../../../electron/db/DatabaseSingle.js"

export default class AlertRepository {
  constructor(prismaClient) {
    this.db = prismaClient;

  }
  async findById(id) {
      return await this.db.alert.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              parameter: true,
              user_id: true,
            },
          },
        },
      });
    }

  async getParameters() {
  }

  async setParameters(Parameters){
    const params = [
      Parameters.closingCritical,
      Parameters.closingWarning,
      Parameters.Timeinterval,
      Parameters.irregularAmmount,
      Parameters.AnomalousMovements
    ]
  }

  async create(alertData) {
    console.log(alertData)
    return await this.db.alert.create({
      data: {
        description: alertData.description,
        parameter: alertData.parameter,
        created_at: alertData.created_at,
        user_id: alertData.user_id,
        movement_id: alertData.movement_id,
        closing_id: alertData.closing_id,
      },
    });
  }
}
