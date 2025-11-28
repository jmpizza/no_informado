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
        
        const parameters = await this.AlertRepository.getParameters()
        const closingCritical = await parameters[0].setting
        const closingWarning = await parameters[1].setting

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
        const parameters = await this.AlertRepository.getParameters()
        const irregularAmmount = await parameters[3].setting

        if (ammount > irregularAmmount){
            return true
        }
        if (ammount < -(irregularAmmount)){
            return true
        }

        return false

    }

    async setNewParameters(parametersData){
    const parameters = await this.AlertRepository.setParameters(parametersData)
    }
}