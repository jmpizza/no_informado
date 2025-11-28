import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import ClosingService from "../../src/backend/services/ClosingServiceC.js";
import ClosingRepository from "../../src/backend/repositories/ClosingRepository.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";
import PaymentMethodService from "../../src/backend/services/PaymentMethodService.js";
import MovementRepository from "../../src/backend/repositories/MovementRepository.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";
import { getAuthenticatedUser } from "../../src/backend/utils/SessionContext.js";


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

  ipcMain.handle("closing:create", async (event, closingData) => {
    try {
      const closing = await closingService.createClosing(
        closingData.total,
        closingData.comments,
        closingData.expected_balance,
        closingData.counted,
        closingData.difference,
        closingData.created_at,
        getAuthenticatedUser()
      );
      return { success: true, data: closing };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("closing:createDetails", async (event, closingDetails) => {
    //console.log("🔥🔥 closingDetails recibido en HANDLER:", closingDetails);

    try {
      const result = await closingService.createClosingDetails(closingDetails); 
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("closing:getLastClosing", async (event) => {
    try {
      const lastClosing = await closingService.getLastClosing();
      return { success: true, data: lastClosing };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("closing:getAllClosures", async (event) => {
    try {
      const closures = await closingService.getAllClosures();
      return { success: true, data: closures };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("closing:calculateDifference", (event, { expected, counted }) => {
    try {
      const difference = closingService.calculateDifference(expected, counted);
      return { success: true, data: difference };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("closing:getClosureDetails", async (event, closing_id) => {
    try {
      const closureDetails = await closingService.getClosureWithDetails(closing_id);
      return { success: true, data: closureDetails };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}