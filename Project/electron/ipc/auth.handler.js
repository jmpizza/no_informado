import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import AuthService from "../../src/backend/services/AuthService.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";

export function setupAuthHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const userRepository = new UserRepository(db);
  const authService = new AuthService(userRepository);

  ipcMain.handle("auth:login", async (event, data) => {
    try {
      const { id, password } = data;
      const user = await authService.authUser(id, password);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}
