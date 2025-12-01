import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import ClosingService from "../../src/backend/services/ClosingServiceC.js";
import ClosingRepository from "../../src/backend/repositories/ClosingRepository.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";
import PaymentMethodService from "../../src/backend/services/PaymentMethodService.js";
import MovementRepository from "../../src/backend/repositories/MovementRepository.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";
import ExportService from "../../src/backend/services/ExportService.js";
import LogsService from "../../src/backend/services/LogsService.js";
import LogsRepository from "../../src/backend/repositories/LogsRepository.js";

export function setupExportHandlers() {
  const db = DatabaseSingle.getInstance().prisma;

  const closingRepository = new ClosingRepository(db);
  const userRepository = new UserRepository(db);
  const paymentMethodRepository = new PaymentMethodRepository(db);
  const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
  const movementRepository = new MovementRepository(db);
  
  const logsRepository = new LogsRepository(db);
  const logsService = new LogsService(logsRepository);

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

      await logsService.log(
        'export_closing',
        `Se exporto el cierre con id ${closure_id}`
      );

      return { success: true };
    } catch (error) {

      await logsService.log(
        'export_closing_failed',
        `Intento fallido de exportar cierre con id ${closure_id}: ${error.message}`
      );

      return { success: false, error: error.message };
    }
    
  })

  ipcMain.handle("export:exportAllClosings", async (event, closures) => {
    try {
      const exportClosing = await exportService.exportAllClosings(closures)

      await logsService.log(
        'export_all_closings',
        `Se exporto todos los cierres`
      );

      return { success: true };
    } catch (error) {

      await logsService.log(
        'export_all_closings_failed',
        `Intento fallido de exportar todos los cierres: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  })
}