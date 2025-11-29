import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import ClosingService from "../../src/backend/services/ClosingServiceC.js";
import ClosingRepository from "../../src/backend/repositories/ClosingRepository.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";
import PaymentMethodService from "../../src/backend/services/PaymentMethodService.js";
import MovementRepository from "../../src/backend/repositories/MovementRepository.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";
import { getAuthenticatedUser } from "../../src/backend/utils/SessionContext.js";
import ExportService from "../../src/backend/services/ExportService.js";

export function setupExportHandlers() {
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
  const exportService = new ExportService()

  ipcMain.handle("export:exportToPdf", async (event, closure_id) => {
    try {
        const closure = await closingService.getClosureWithDetails(closure_id)

        const exportClosing = await exportService.exportClosing(closure)
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
    
  })

  ipcMain.handle("export:exportAllClosings", async (event, closures) => {
    try {
      const exportClosing = await exportService.exportAllClosings(closures)
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  })
}