import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import AlertRepository from "../../src/backend/repositories/AlertRepository.js";
import AlertService from "../../src/backend/services/AlertService.js";

export function setupAlertHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const alertRepository = new AlertRepository(db)
  const alertService = new AlertService(alertRepository)

  ipcMain.handle("alert:setParameters", async (event, paramPayload) => {
    try {
        console.log(paramPayload)
        const Parameters = await alertService.setNewParameters(paramPayload)
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  })

}