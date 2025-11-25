import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import AuthService from "../../src/backend/services/AuthService.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";
import LogsService from "../../src/backend/services/LogsService.js";
import LogsRepository from "../../src/backend/repositories/LogsRepository.js";
import { setAuthenticatedUser, clearAuthenticatedUser } from "../../src/backend/utils/SessionContext.js";

export function setupAuthHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const userRepository = new UserRepository(db);
  const authService = new AuthService(userRepository);

  const logsRepository = new LogsRepository(db);
  const logsService = new LogsService(logsRepository);

  ipcMain.handle("auth:login", async (event, data) => {
    try {
      const { id, password } = data;
      const user = await authService.authUser(id, password);

      setAuthenticatedUser(user.id);

      await logsService.log(
        'user_login',
        user.id,
        `Usuario ${user.name} ${user.last_name} inició sesión exitosamente`
      );

      return { success: true, user };
    } catch (error) {

      await logsService.log(
        'user_login_failed',
        data.id,
        `Intento de login fallido: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });


  ipcMain.handle("auth:logout", async () => {
    try {

      clearAuthenticatedUser();

      await logsService.log('user_logout', null, 'Usuario cerró sesión');

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}
