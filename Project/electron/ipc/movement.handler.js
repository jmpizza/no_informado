import { ipcMain } from "electron";
import DatabaseSingle from "../db/DatabaseSingle.js";
import MovementService from "../../src/backend/services/MovementService.js";
import MovementRepository from "../../src/backend/repositories/MovementRepository.js";
import UserRepository from "../../src/backend/repositories/UserRepository.js";
import PaymentMethodRepository from "../../src/backend/repositories/PaymentMethodRepository.js";

export function setupMovementHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const movementRepository = new MovementRepository(db);
  const userRepository = new UserRepository(db);
  const paymentMethodRepository = new PaymentMethodRepository(db);
  const movementService = new MovementService(
    movementRepository,
    userRepository,
    paymentMethodRepository
  );

  ipcMain.handle("movement:create", async (event, movementData) => {
    try {
      const movement = await movementService.createMovement(
        movementData.ammount,
        movementData.type,
        movementData.user_id,
        movementData.payment_method_id,
        movementData.closing_id
      );
      return { success: true, data: movement };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:getById", async (event, id) => {
    try {
      const movement = await movementService.getMovementById(id);
      return { success: true, data: movement };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:getAll", async (event, filters) => {
    try {
      const movements = await movementService.listMovements(filters);
      return { success: true, data: movements };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:update", async (event, { id, movementData }) => {
    try {
      const updatedMovement = await movementService.updateMovement(id, movementData);
      return { success: true, data: updatedMovement };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:delete", async (event, id) => {
    try {
      const deletedMovement = await movementService.deleteMovement(id);
      return { success: true, data: deletedMovement };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:getTotalByPaymentMethod", async (event, { payment_method_id, type }) => {
    try {
      const total = await movementService.getTotalByPaymentMethod(payment_method_id, type);
      return { success: true, data: total };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:getTotalByUser", async (event, { user_id, type }) => {
    try {
      const total = await movementService.getTotalByUser(user_id, type);
      return { success: true, data: total };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}