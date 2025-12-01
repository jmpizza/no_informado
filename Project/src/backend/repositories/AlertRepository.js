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
    const parameters = await this.db.alert_parameter.findMany()
    return parameters
  }

  async setParameters(Parameters){
    const closingCrit = await this.db.alert_parameter.update({
      where: {id: 1},
       data:{
        setting: Parameters.closureDifferenceThreshold
       }
    })

    const closingWarn = await this.db.alert_parameter.update({
      where: {id: 2},
       data:{
        setting: Parameters.minorDifferenceThreshold
       }
    })

    const timeInt = await this.db.alert_parameter.update({
      where: {id: 3},
       data:{
        setting: Parameters.anomalousMovementInterval
       }
    })

    const irregularAmm = await this.db.alert_parameter.update({
      where: {id: 4},
       data:{
        setting: Parameters.irregularAmountLimit
       }
    })
  
    const NumberAnomalous = await this.db.alert_parameter.update({
      where: {id: 5},
       data:{
        setting: Parameters.maxAnomalousMovementsPerDay
       }
    })
  }

  async create(alertData) {
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

  async getAlerts(){
    return this.db.alert.findMany()
  }

  async getAllAlerts() {
    const alerts = await this.db.alert.findMany({
      orderBy: { created_at: "desc" },

      include: {
        user: true,        
        movement: true,    
        closing: true      
      }
    });

    return alerts;
  }

}
