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

    async getAlertParameters() {
        const parameters = await this.AlertRepository.getParameters();

        if (!parameters || parameters.length === 0) {
            throw new NotFoundException("No se encontraron parámetros de alertas");
        }

        // Transformar array → objeto estructurado
        const formatted = parameters.reduce((acc, param) => {
            acc[param.variable] = param.setting;
            return acc;
        }, {});

        return {
            closureDifferenceThreshold: formatted.closureDifferenceThreshold,
            minorDifferenceThreshold: formatted.minorDifferenceThreshold,
            irregularAmountLimit: formatted.irregularAmountLimit,
            anomalousMovementInterval: formatted.anomalousMovementInterval,
            maxAnomalousMovementsPerDay: formatted.maxAnomalousMovementsPerDay
        };
        }
    async getAllAlerts() {
        const alertsTable = await this.AlertRepository.getAllAlerts();

        return alertsTable.map((alert) => {
            // Determinar tipo
            const type = alert.closing_id
                ? 'closure'
                : alert.movement_id
                ? 'movement'
                : 'info';

            // Determinar severidad
            let severity;
            if (type === 'closure') severity = 'critical';
            else if (type === 'movement') severity = 'warning';
            else severity = 'info';

            // Determinar título
            let title;
            if (type === 'closure') title = 'Diferencia en cierre';
            else if (type === 'movement') title = 'Movimiento inusual';
            else title = 'Notificación informativa';

            // Formatear descripción personalizada
            let description;
            if (type === 'closure') {
                description = `Se detectó una diferencia de $${alert.closing?.difference?.toLocaleString('es-CO')} en el cierre de caja #${alert.closing_id}.`;
            } else if (type === 'movement') {
                description = `Se registró un movimiento inusual de alto valor en el movimiento #${alert.movement_id}.`;
            } else {
                description = alert.description || 'Información general';
            }

            return {
                id: alert.id.toString(),
                type,
                severity,
                title,
                description,
                amount: alert.movement?.ammount ?? alert.closing?.difference ?? null,
                date: alert.created_at ? new Date(alert.created_at).toISOString() : null,
                operator: `${alert.user.name} ${alert.user.last_name}`,
                relatedId:
                    type === 'closure'
                        ? `CLOSURE-${alert.closing_id}`
                        : type === 'movement'
                        ? `MOV-${alert.movement_id}`
                        : `ALERT-${alert.id}`,
            };
        });
    }


    async formatAlerts(alerts){
        const formatedAlerts = []
        for (let i = 0; i < alerts.length; i++) {
            const alert = {
                id: alerts[i].id,
                type: 'info',
                severity: 'warning',
                title: 'Notificación informativa',
                description: alerts[i].description,
                date: (alerts[i].created_at).toISOString(),
                operator: alerts[i].user_id,
                relatedId: alerts[i].movement_id,
                }
            formatedAlerts.push(alert)
            }
        return formatedAlerts
    }

}