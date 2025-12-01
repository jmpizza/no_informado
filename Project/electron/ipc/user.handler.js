import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import UserService from "../../src/backend/services/UserService.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";
import RoleRepository from "../../src/backend/repositories/RoleRepository.js";
import { getAuthenticatedUser } from "../../src/backend/utils/SessionContext.js";
import LogsService from "../../src/backend/services/LogsService.js";
import LogsRepository from "../../src/backend/repositories/LogsRepository.js";


export function setupUserHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const userRepository = new UserRepository(db);
  const roleRepository = new RoleRepository(db);
  const userService = new UserService(userRepository, roleRepository);

  const logsRepository = new LogsRepository(db);
  const logsService = new LogsService(logsRepository);

  ipcMain.handle("user:create", async (event, data) => {
    try {
      const user = await userService.createUser(data);

      await logsService.log(
        "user_create",
        `Usuario creado: ${JSON.stringify(user)}`
      );

      return { success: true, user };
    } catch (error) {

      await logsService.log(
        "user_create_error",
        `Error al crear usuario: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('user:getAll', async () => {
    try {
      const users = await userRepository.findAll();

      await logsService.log(
        "user_get_all",
        `Se obtuvieron todos los usuarios: ${JSON.stringify(users)}`
      );

      return { success: true, users };
    } catch (error) {

      await logsService.log(
        "user_get_all_failed",
        `Error al obtener usuarios: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("user:getUserInfo", async (event) => {
    try {
      const userInfo = await userService.getUserInfo(getAuthenticatedUser());

      await logsService.log(
        "user_get_info",
        `Se obtuvo la información del usuario: ${JSON.stringify(userInfo)}`
      );

      return { success: true, data: userInfo };
    } catch (error) {

      await logsService.log(
        "user_get_info_failed",
        `Error al obtener información del usuario: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

    ipcMain.handle("user:update", async (event, data) => {
    try{
      const user = await userService.update(data);

      await logsService.log(
        "user_update",
        `Usuario actualizado: ${JSON.stringify(user)}`
      );

      return { success: true, user };
    } catch (error) {

      await logsService.log(
        "user_update_error",
        `Error al actualizar usuario: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("user:getId", async (event) => {
    try {
      const userId = getAuthenticatedUser();

      await logsService.log(
        "user_get_id",
        `Se obtuvo el ID del usuario: ${userId}`
      );

      return { success: true, userId };
    } catch (error) {

      await logsService.log(
        "user_get_id_failed",
        `Error al obtener ID del usuario: ${error.message}`
      );
      
      return { success: false, error: error.message };
    }
  });
}