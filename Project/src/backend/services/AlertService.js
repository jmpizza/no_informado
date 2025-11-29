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

    async checkTimeInterval(time){

        console.log(time)
        const parameters = await this.AlertRepository.getParameters()
        const timeIntervalInMiliseconds = (parameters[2].setting) * (1000 * 60)

        const nowTime = (new Date())
        const timeInterval = nowTime - time


        if (timeInterval < timeIntervalInMiliseconds){
            return true
        }
        return false
    }

    async createAlertTime(user){

        const alertData = {
            description: "Esta dentro del intervalo de tiempo anomalo",
            parameter: 1,
            created_at: new Date(),
            user_id: user,
            movement_id: null,
            closing_id: null,
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

        const alert = await this.AlertRepository.create(alertData)
        
    }

    async checkClosing(Total){
        
        const parameters = await this.AlertRepository.getParameters()
        const closingCritical =  parameters[0].setting
        const closingWarning = parameters[1].setting

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

    async getNewParameters(){
        return await this.AlertRepository.getParameters()
    }
}