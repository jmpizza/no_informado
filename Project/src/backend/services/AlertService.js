export default class AlertService {
    constructor(AlertRepository) {
        this.AlertRepository = AlertRepository;
    }

    async createAlertMovement(user, movement_id, closing_id){

        const alertData = {
            description: "Hubo un movimiento irregular",
            parameter: 1,
            created_at: new Date(),
            user_id: user,
            movement_id: movement_id,
            closing_id: closing_id,
        }

        const alert = await this.AlertRepository.create(alertData)
    }

    async createAlertClosing (user, description, closing_id){

        const alertData = {
            description: description,
            parameter: 1,
            created_at: new Date(),
            user_id: user,
            movement_id: null,
            closing_id: closing_id,
        }

        const alert = await this.AlertRepository(alertData)
        
    }

    async checkClosing(Total){
        
        const parameters = (await this.AlertRepository.getParameters()).split(" ")
        const closingCritical = Number(parameters[0])
        const closingWarning = Number(parameters[1])
        console.log(closingCritical)
        console.log(closingWarning)

        if (Total < 0){
            return 3
        }

        if (Total > closingCritical){ 
            return 3
        }

        if (closingWarning <= Total <= closingCritical){ 
            return 2
        }

        return 0
    }

    async checkIrregularMovement(ammount){
        console.log("asd")
        const parameters = (await this.AlertRepository.getParameters()).split(" ")
        const irregularAmmount = Number(parameters[2])
        console.log(irregularAmmount)

        if (ammount > irregularAmmount){
            return true
        }
        if (ammount < -(irregularAmmount)){
            return true
        }

        return false

    }

    async setNewParameters(parametersData){
    const params = {
        closingCritical:parametersData.closureDifferenceThreshold,
        closingWarning:parametersData.minorDifferenceThreshold,
        Timeinterval:parametersData.anomalousMovementInterval,
        irregularAmmount:parametersData.irregularAmountLimit,
        AnomalousMovements:parametersData.maxAnomalousMovementsPerDay
    }
    const parameters = await this.AlertRepository.setParameters(params)
    }
}