import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import ClosingService from "../../src/backend/services/ClosingServiceC.js";
import ClosingRepository from "../../src/backend/repositories/ClosingRepository.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";
import PaymentMethodService from "../../src/backend/services/PaymentMethodService.js";
import MovementRepository from "../../src/backend/repositories/MovementRepository.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";
import { getAuthenticatedUser } from "../../src/backend/utils/SessionContext.js";
import LogsService from "../../src/backend/services/LogsService.js";
import LogsRepository from "../../src/backend/repositories/LogsRepository.js";


export function setupClosingHandlers() {
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

  ipcMain.handle("closing:fetchData", async (event, status) => {
    try {
      const closingData = await closingService.fetchClosingData(status);

      await logsService.log(
        'fetch_closing_data',
        `Se obtuvo los datos de cierre con estado ${status}`
      );

      return { success: true, data: closingData };
    } catch (error) {

      await logsService.log(
        'fetch_closing_data_failed',
        `Intento fallido de obtener datos de cierre: ${error.message}`
      );

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

      await logsService.log(
        'create_closing',
        `Se creó un nuevo cierre con ID ${closing.id}`
      );

      return { success: true, data: closing };
    } catch (error) {

      await logsService.log(
        'create_closing_failed',
        `Intento fallido de crear cierre: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("closing:createDetails", async (event, closingDetails) => {
    //console.log("🔥🔥 closingDetails recibido en HANDLER:", closingDetails);

    try {
      const result = await closingService.createClosingDetails(closingDetails); 

      await logsService.log(
        'create_closing_details',
        `Se creó detalles de cierre para el cierre ID ${closingDetails[0].closing_id}`
      );

      return { success: true, data: result };
    } catch (error) {

      await logsService.log(
        'create_closing_details_failed',
        `Intento fallido de crear detalles de cierre: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("closing:getLastClosing", async (event) => {
    try {
      const lastClosing = await closingService.getLastClosing();

      await logsService.log(
        'get_last_closing',
        `Se obtuvo el último cierre realizado`
      );

      return { success: true, data: lastClosing };
    } catch (error) {

      
      await logsService.log(
        'get_last_closing_failed',
        `Intento fallido de obtener el último cierre: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("closing:getAllClosures", async (event) => {
    try {
      const closures = await closingService.getAllClosures();
            
      await logsService.log(
        'get_all_closures',
        `Se obtuvo todos los cierres`
      );

      return { success: true, data: closures };
    } catch (error) {

      await logsService.log(
        'get_all_closures_failed',
        `Intento fallido de obtener todos los cierres: ${error.message}`
      );

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

      await logsService.log(
        'get_closure_details',
        `Se obtuvo detalles del cierre ${closing_id}`
      );

      return { success: true, data: closureDetails };
    } catch (error) {

      await logsService.log(
        'get_closure_details_failed',
        `Intento fallido de obtener detalles del cierre ${closing_id}: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });
}