import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import MovementService from "../../src/backend/services/MovementService.js";
import MovementRepository from "../../src/backend/repositories/MovementRepository.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";
import AlertRepository from "../../src/backend/repositories/AlertRepository.js";
import AlertService from "../../src/backend/services/AlertService.js";
import ClosingService from "../../src/backend/services/ClosingServiceC.js";
import ClosingRepository from "../../src/backend/repositories/ClosingRepository.js";
import { getAuthenticatedUser } from "../../src/backend/utils/SessionContext.js";
import PaymentMethodService from "../../src/backend/services/PaymentMethodService.js";

export function setupAlertHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const movementRepository = new MovementRepository(db);
  const userRepository = new UserRepository(db);
  const alertRepository = new AlertRepository(db)
  const closingRepository = new ClosingRepository(db);
  const paymentMethodRepository = new PaymentMethodRepository(db);

  const alertService = new AlertService(alertRepository)
  const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
  const movementService = new MovementService(
    movementRepository,
    userRepository,
    paymentMethodRepository
  );
  const closingService = new ClosingService(
      closingRepository,
      userRepository,
      paymentMethodService,
      movementRepository,
      paymentMethodRepository
    );

  ipcMain.handle("alert:setParameters", async (event, paramPayload) => {
    try {
        const Parameters = await alertService.setNewParameters(paramPayload)
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  })

  ipcMain.handle("alert:checkIrregularMovement", async (event, alertMovementData) => {
    try {
      const isIrregular = await alertService.checkIrregularMovement(alertMovementData.ammount);
      const movement = await movementService.getLatestMovement()

      if (!isIrregular) {
        return { success: true, data: null }; 
      }
      
      const alert = await alertService.createAlertMovement(
        alertMovementData.user_id,
        movement.id,
        alertMovementData.closing_id
      );

      return { success: true, data: alert };

    } catch (error) {
      console.log("ERROR en alert:generateMovementAlert:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("alert:checkTimeInterval", async (event) => {
    try {
      const movement = await movementService.getLatestMovement();
      const time = movement.created_at


      if (await alertService.checkTimeInterval(time)){
        console.log("intervalo")
        const user = getAuthenticatedUser()
        const alert = await alertService.createAlertTime(user)
      }
    
      return { success: true };

    } catch (error) {
      console.log("ERROR en alert:checkTimeInterval", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("alert:checkClosing", async (event, alertClosingData) => {
    try {
      const checkClosing = await alertService.checkClosing(alertClosingData.total);

      if (checkClosing === 0) {
        return { success: true, data: null };
      }

      let description;
      if (checkClosing === 3) {
        description = "Este cierre pasa el umbral critico";
      } else {
        description = "Este cierre paso el umbral de advertencia";
      }

      const lastClosing = await closingService.getLastClosing();

      const user = getAuthenticatedUser();
      if (!user) {
        throw new Error("No hay usuario autenticado");
      }

      const alert = await alertService.createAlertClosing(
        user,            
        description,
        lastClosing.id
      );

      return { success: true, data: alert };

    } catch (error) {
      console.error("Error en alert:checkClosing:", error);
      return { success: false, error: error.message };
    }
  });
}