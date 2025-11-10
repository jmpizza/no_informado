import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import bcrypt from "bcryptjs";

export function setupUserHandlers() {
  ipcMain.handle(
    "user:create",
    async (event, { id, name, last_name, email, password, rol_id }) => {
      try {
        const db = DatabaseSingle.getInstance().prisma;

        const existingUserById = await db.user.findUnique({
          where: { id: parseInt(id, 10) }
        });

        if (existingUserById) {
          return { success: false, error: "El ID ya esta en uso" };
        };

        const existingUserByEmail = await db.user.findUnique({
          where: { email }
        });

        if (existingUserByEmail) {
          return { success: false, error: "El email ya esta registrado" };
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await db.user.create({
          data: {
            id: parseInt(id, 10),
            name,
            last_name,
            email,
            password: hashedPassword,
            rol_id,
            status: true,
            created_at: new Date()
          },
          include: { rol: true}
        });

        return {
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            last_name: newUser.last_name,
            email: newUser.email,
            rol: newUser.rol.name,
            rol_id: newUser.rol_id,
            status: newUser.status
          }
        };

      } catch (err) {
        console.error("Error creando usuario:", err);
        return { success: false, error: "Error del servidor" };
      }
    }
  );
}
