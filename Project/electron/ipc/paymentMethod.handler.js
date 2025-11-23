import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import PaymentMethodService from "../../src/backend/services/PaymentMethodService.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";

export function setupPaymentMethodHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const paymentMethodRepository = new PaymentMethodRepository(db);
  const paymentMethodService = new PaymentMethodService(paymentMethodRepository);

  ipcMain.handle("payment-method:create", async(event, paymentMethodData) => {
    try{
      const paymentMethod = await paymentMethodService.createPaymentMethod(
        paymentMethodData.name, 
        paymentMethodData.account_number
      );
      return { success: true, data: paymentMethod };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("payment-method:updateStatus", async (event, { name, status }) => {
    try{
      const action = status ? "enable" : "disable";
      const updatedPaymentMethod = await paymentMethodService.updatePaymentMethodStatus(name, action);
      return { success: true, data: updatedPaymentMethod };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle("payment-method:getAll", async (event, status) => {
    try{
      const paymentMethods = await paymentMethodService.listPaymentMethods(status);
      return { success: true, data: paymentMethods };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}