import { getAuthenticatedUser } from "../utils/SessionContext.js";

export default class LogsService {
    constructor(logsRepository) {
        this.logsRepository = logsRepository;
    }

    async log(action, details = null) {
        if (!action || typeof action !== 'string' || action.trim() === '') {
            throw new Error('La acción del log es requerida y debe ser un string válido');
        }

        const finalUserId = getAuthenticatedUser();

        const logData = {
            action: action.trim(),
            user_id: finalUserId,
            details: details,
            created_at: new Date(),
        };

        return await this.logsRepository.create(logData);
    }

    async getAllLogs(filters = {}) {
        return await this.logsRepository.findAll(filters);
    }

    async getLogsByUser(userId) {
        if (!userId || !Number.isInteger(userId)) {
            throw new Error('El ID del usuario debe ser un número entero válido');
        }
        return await this.logsRepository.findByUserId(userId);
    }

    async getLogsByAction(action) {
        if (!action || typeof action !== 'string') {
            throw new Error('La acción debe ser un string válido');
        }
        return await this.logsRepository.findByAction(action);
    }

    async getRecentLogs(limit = 10) {
        return await this.logsRepository.findRecent(limit);
    }
}
