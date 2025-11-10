import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";

export function setupPaymentMethodHandlers() {
  ipcMain.handle("paymentMethod:getAll", async () => {
    try {
      const db = DatabaseSingle.getInstance().prisma;

      const paymentMethods = await db.payment_method.findMany({
        orderBy: { id: "asc" },
      });

      return { success: true, paymentMethods };
    } catch (err) {
      console.error("Error obteniendo métodos de pago:", err);
      return { success: false, error: "Error del servidor" };
    }
  });

  ipcMain.handle(
    "paymentMethod:create",
    async (event, { name, account_number }) => {
      try {
        const db = DatabaseSingle.getInstance().prisma;

        name = name.charAt(0).toUpperCase() + name.slice(1);

        const existing = await db.payment_method.findFirst({
          where: { name },
        });

        if (existing) {
          return {
            success: false,
            error: "Ya existe un método de pago con ese nombre",
          };
        }

        const newPaymentMethod = await db.payment_method.create({
          data: {
            name,
            account_number: account_number || null,
            active: true
          },
        });

        return {
          success: true,
          paymentMethod: newPaymentMethod,
        };
      } catch (err) {
        console.error("Error creando método de pago:", err);
        return { success: false, error: "Error del servidor" };
      }
    }
  );

  ipcMain.handle("paymentMethod:toggleActive", async (event, { id }) => {
    try {
      const db = DatabaseSingle.getInstance().prisma;
      const paymentMethodId = parseInt(id, 10);

      const existing = await db.payment_method.findUnique({
        where: { id: paymentMethodId },
      });

      if (!existing) {
        return { success: false, error: "Método de pago no encontrado" };
      }

      if (existing.name === "efectivo" || existing.name === "tarjeta"){
        return { success: false, error: "No se puede desactivar este método de pago"}
      }

      const updated = await db.payment_method.update({
        where: { id: paymentMethodId },
        data: { active: !existing.active },
      });

      return {
        success: true,
        paymentMethod: updated,
        message: updated.active
          ? "Método de pago activado"
          : "Método de pago desactivado",
      };
    } catch (err) {
      console.error("Error cambiando estado del método de pago:", err);
      return { success: false, error: "Error del servidor" };
    }
  });
}
