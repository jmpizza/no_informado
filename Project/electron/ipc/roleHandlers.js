import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";

export function setupRoleHandlers() {
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

      return { success: true, roles };
    } catch (err) {
      console.error("Error obteniendo roles:", err);
      return { success: false, error: "Error del servidor" };
    }
  });
}
