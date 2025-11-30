import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import LogsService from "../../src/backend/services/LogsService.js";
import LogsRepository from "../../src/backend/repositories/LogsRepository.js";

export function setupRoleHandlers() {
    
    const db = DatabaseSingle.getInstance().prisma;

    const logsRepository = new LogsRepository(db);
    const logsService = new LogsService(logsRepository);

    ipcMain.handle("role:getAll", async () => {
    try {
      const db = DatabaseSingle.getInstance().prisma;
      const roles = await db.rol.findMany({
        select: {
          id: true,
          name: true,
          description: true
        },
        orderBy: { id: 'asc' }
      });

      await logsService.log(
        'role_get_all',
        `Se obtuvieron todos los roles: ${JSON.stringify(roles)}`
      );

      return { success: true, roles };
    } catch (err) {

      await logsService.log(
        'role_get_all_failed',
        `Error al obtener roles: ${err.message}`
      );
      
      console.error("Error obteniendo roles:", err);
      return { success: false, error: "Error del servidor" };
    }
  });
}
