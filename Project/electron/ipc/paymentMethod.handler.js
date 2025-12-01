import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import PaymentMethodService from "../../src/backend/services/PaymentMethodService.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";
import LogsService from "../../src/backend/services/LogsService.js";
import LogsRepository from "../../src/backend/repositories/LogsRepository.js";

export function setupPaymentMethodHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const paymentMethodRepository = new PaymentMethodRepository(db);
  const paymentMethodService = new PaymentMethodService(paymentMethodRepository);

  const logsRepository = new LogsRepository(db);
  const logsService = new LogsService(logsRepository);

  ipcMain.handle("payment-method:create", async (event, paymentMethodData) => {
    try {
      const paymentMethod = await paymentMethodService.createPaymentMethod(
        paymentMethodData.name,
        paymentMethodData.account_number
      );

      await logsService.log(
        "payment_method_create",
        `Método de pago creado: ${JSON.stringify(paymentMethod)}`
      );

      return { success: true, data: paymentMethod };
    } catch (error) {

      await logsService.log(
        "payment_method_create_failed",
        `Error al crear método de pago: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("payment-method:updateStatus", async (event, { name, status }) => {
    try {
      const action = status ? "enable" : "disable";
      const updatedPaymentMethod = await paymentMethodService.updatePaymentMethodStatus(name, action);

      await logsService.log(
        "payment_method_update_status",
        `Estado del método de pago actualizado: ${JSON.stringify(updatedPaymentMethod)}`
      );

      return { success: true, data: updatedPaymentMethod };
    } catch (error) {

      await logsService.log(
        "payment_method_update_status_failed",
        `Error al actualizar estado del método de pago: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("payment-method:getAll", async (event, status) => {
    try {
      const paymentMethods = await paymentMethodService.listPaymentMethods(status);

      await logsService.log(
        "payment_method_get_all",
        `Lista de métodos de pago obtenida: ${JSON.stringify(paymentMethods)}`
      );

      return { success: true, data: paymentMethods };
    } catch (error) {

      await logsService.log(
        "payment_method_get_all_failed",
        `Error al obtener lista de métodos de pago: ${error.message}`
      );
      
      return { success: false, error: error.message };
    }
  });
}