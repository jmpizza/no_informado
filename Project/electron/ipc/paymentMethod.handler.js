import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import PaymentMethodService from "../../src/backend/services/PaymentMethodService.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";

export function setupPaymentMethodHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const paymentMethodRepository = new PaymentMethodRepository(db);
  const paymentMethodService = new PaymentMethodService(paymentMethodRepository);

  ipcMain.handle("paymentMethod:create", async(event, data) => {
    try{
      const paymentMethod = await paymentMethodService.createPaymentMethod(data);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("paymentMethod:update", async (event, data) => {
    try{
      const updatedPaymentMethodStatus = await paymentMethodService.updatePaymentMethodStatus(data);
      return { success: true, updatedPaymentMethodStatus };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle("paymentMethod:getAll", async (event, data) => {
    try{
      const paymentMethods = await paymentMethodService.listPaymentMethods(data);
      return { success: true, paymentMethods };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}