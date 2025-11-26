import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import AlertRepository from "../../src/backend/repositories/AlertRepository.js";
import AlertService from "../../src/backend/services/AlertService.js";
import { getAuthenticatedUser } from "../../src/backend/utils/SessionContext.js";

export function setupAlertHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const alertRepository = new AlertRepository(db)
  const alertService = new AlertService(alertRepository)

  ipcMain.handle("alert:setParameters", async (event, paramPayload) => {
    try {
        const Parameters = await alertService.setNewParameters(paramPayload)
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  })

  ipcMain.handle("alert:generateMovementAlert", async (event, alertMovementData) => {
    try {
      const isIrregular = await alertService.checkIrregularMovement(alertMovementData.ammount);

      if (!isIrregular) {
        return { success: true, data: null }; 
      }

      const alert = await alertService.createAlertMovement(
        alertClosingData.user_id,
        alertClosingData.movement_id,
        alertClosingData.closing_id
      );

      return { success: true, data: alert };

    } catch (error) {
      console.log("ERROR en alert:generateMovementAlert:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("alert:generateClosingAlert", async (event, alertClosingData) => {
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
      console.error("Error en alert:generateClosingAlert:", error);
      return { success: false, error: error.message };
    }
  });
}