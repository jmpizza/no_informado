import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import UserService from "../../src/backend/services/UserService.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";
import RoleRepository from "../../src/backend/repositories/RoleRepository.js";

export function setupUserHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const userRepository = new UserRepository(db);
  const roleRepository = new RoleRepository(db);
  const userService = new UserService(userRepository, roleRepository);

  ipcMain.handle("user:create", async (event, data) => {
    try {
      const user = await userService.createUser(data);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('user:getAll', async () => {
    try {
      const users = await userRepository.findAll();
      return { success: true, users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}