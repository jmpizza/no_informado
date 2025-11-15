import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import bcrypt from "bcryptjs";

export function setupAuthHandlers() {
  ipcMain.handle("auth:login", async (event, { id, password }) => {
    try {
      const db = DatabaseSingle.getInstance().prisma;

      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        return { success: false, error: "ID inválido" };
      }

      const user = await db.user.findUnique({
        where: { id: userId },
        include: { rol: true },
      });

      if (!user) {
        return { success: false, error: "Usuario no encontrado" };
      }

      if (user.status === false) {
        return { success: false, error: "Usuario inactivo" };
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return { success: false, error: "Contraseña incorrecta" };
      }

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          last_name: user.last_name,
          email: user.email,
          rol: user.rol.name,
          rol_id: user.rol_id,
          isTemporary: false
        },
      };
    } catch (err) {
      console.error("Error en login:", err);
      return { success: false, error: "Error del servidor" };
    }
  });
}