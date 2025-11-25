import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import PaymentMethodService from "../../src/backend/services/PaymentMethodService.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";
import LogsService from "../../src/backend/services/LogsService.js";
import LogsRepository from "../../src/backend/repositories/LogsRepository.js";
import { getAuthenticatedUser } from "../../src/backend/utils/SessionContext.js";

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
        getAuthenticatedUser(),
        `Método de pago creado: ${JSON.stringify(paymentMethod)}`
      );

      return { success: true, data: paymentMethod };
    } catch (error) {

      await logsService.log(
        "payment_method_create_failed",
        getAuthenticatedUser(),
        `Error al crear método de pago: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("payment-method:updateStatus", async (event, { name, status }) => {
    try {
      const action = status ? "enable" : "disable";
      const updatedPaymentMethod = await paymentMethodService.updatePaymentMethodStatus(name, action);
      return { success: true, data: updatedPaymentMethod };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("payment-method:getAll", async (event, status) => {
    try {
      const paymentMethods = await paymentMethodService.listPaymentMethods(status);
      return { success: true, data: paymentMethods };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}