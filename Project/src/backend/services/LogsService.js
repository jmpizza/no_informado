export default class LogsService {
    constructor(logsRepository) {
        this.logsRepository = logsRepository;
    }

    //Crea un log en la base de datos
    async log(action, userId = null, details = null) {
        if (!action || typeof action !== 'string' || action.trim() === '') {
            throw new Error('La acción del log es requerida y debe ser un string válido');
        }

        const logData = {
            action: action.trim(),
            user_id: userId,
            details: details,
            created_at: new Date(),
        };

        return await this.logsRepository.create(logData);
    }

    //Obtiene todos los logs con filtros opcionales
    async getAllLogs(filters = {}) {
        return await this.logsRepository.findAll(filters);
    }

    //Obtiene logs de un usuario específico
    async getLogsByUser(userId) {
        if (!userId || !Number.isInteger(userId)) {
            throw new Error('El ID del usuario debe ser un número entero válido');
        }
        return await this.logsRepository.findByUserId(userId);
    }

    //Obtiene logs por tipo de acción
    async getLogsByAction(action) {
        if (!action || typeof action !== 'string') {
            throw new Error('La acción debe ser un string válido');
        }
        return await this.logsRepository.findByAction(action);
    }


    //Obtiene los logs más recientes
    async getRecentLogs(limit = 10) {
        return await this.logsRepository.findRecent(limit);
    }
}
