import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import ClosingService from "../../src/backend/services/ClosingServiceC.js";
import ClosingRepository from "../../src/backend/repositories/ClosingRepository.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";
import PaymentMethodService from "../../src/backend/services/PaymentMethodService.js";
import MovementRepository from "../../src/backend/repositories/MovementRepository.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";

export function setupClosingHandlers() {
  const db = DatabaseSingle.getInstance().prisma;

  const closingRepository = new ClosingRepository(db);
  const userRepository = new UserRepository(db);
  const paymentMethodRepository = new PaymentMethodRepository(db);
  const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
  const movementRepository = new MovementRepository(db);

  const closingService = new ClosingService(
    closingRepository,
    userRepository,
    paymentMethodService,
    movementRepository,
    paymentMethodRepository
  );

  ipcMain.handle("closing:fetchData", async (event, status) => {
    try {
      const closingData = await closingService.fetchClosingData(status);
      return { success: true, data: closingData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}
