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
import LogsService from "../../src/backend/services/LogsService.js";
import LogsRepository from "../../src/backend/repositories/LogsRepository.js";

export function setupMovementHandlers() {
  const db = DatabaseSingle.getInstance().prisma;
  const movementRepository = new MovementRepository(db);
  const userRepository = new UserRepository(db);
  const alertRepository = new AlertRepository(db)

  const alertService = new AlertService(alertRepository)
  const paymentMethodRepository = new PaymentMethodRepository(db);
  const closingRepository = new ClosingRepository(db);
  const closingService = new ClosingService(
    closingRepository,
    userRepository,
    paymentMethodRepository,
    movementRepository,
    paymentMethodRepository
  );

  const movementService = new MovementService(
    movementRepository,
    userRepository,
    paymentMethodRepository,
    closingService,
    closingRepository
  );
  
  const logsRepository = new LogsRepository(db);
  const logsService = new LogsService(logsRepository);

  ipcMain.handle("movement:create", async (event, movementData) => {
    try {
      const movement = await movementService.createMovement(
        movementData.ammount,
        movementData.type,
        movementData.user_id,
        movementData.payment_method_id,
        movementData.closing_id
      );
      if (await alertService.checkIrregularMovement(movementData.ammount)){
      
        const alert = await alertService.createAlertMovement(
          movementData.user_id,
          movement.id,
          movement.closing_id,
        )
      }

      await logsService.log(
        'create_movement',
        `Se creo el movimiento con id ${movement.id}`
      );

      return { success: true, data: movement };
    } catch (error) {

      await logsService.log(
        'create_movement_failed',
        `Intento fallido de crear movimiento: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:getById", async (event, id) => {
    try {
      const movement = await movementService.getMovementById(id);
      
      await logsService.log(
        'get_movement',
        `Se obtuvo el movimiento con id ${id}`
      );

      return { success: true, data: movement };
    } catch (error) {

      await logsService.log(
        'get_movement_failed',
        `Intento fallido de obtener movimiento con id ${id}: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:getAll", async (event, filters) => {
    try {
      const movements = await movementService.listMovements(filters);

      await logsService.log(
        'list_movements',
        `Se listaron todos los movimientos`
      );

      return { success: true, data: movements };
    } catch (error) {

      await logsService.log(
        'list_movements_failed',
        `Intento fallido de listar todos los movimientos: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:update", async (event, { id, movementData }) => {
    try {
      const updatedMovement = await movementService.updateMovement(id, movementData);

      await logsService.log(
        'update_movement',
        `Se actualizo el movimiento con id ${id}`
      );

      return { success: true, data: updatedMovement };
    } catch (error) {

      await logsService.log(
        'update_movement_failed',
        `Intento fallido de actualizar movimiento con id ${id}: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:delete", async (event, id) => {
    try {
      const deletedMovement = await movementService.deleteMovement(id);

      await logsService.log(
        'delete_movement',
        `Se elimino el movimiento con id ${id}`
      );

      return { success: true, data: deletedMovement };
    } catch (error) {

      await logsService.log(
        'user_delete_movement_failed',
        `Intento fallido de eliminar movimiento con id ${id}: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:getTotalByPaymentMethod", async (event, { payment_method_id, type }) => {
    try {
      const total = await movementService.getTotalByPaymentMethod(payment_method_id, type);

      await logsService.log(
        'get_total_by_payment_method',
        `Se obtuvo el total de movimientos para el metodo de pago con id ${payment_method_id}`
      );

      return { success: true, data: total };
    } catch (error) {

      await logsService.log(
        'get_total_by_payment_method_failed',
        `Intento fallido de obtener total de movimientos para el metodo de pago con id ${payment_method_id}: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("movement:getTotalByUser", async (event, { user_id, type }) => {
    try {
      const total = await movementService.getTotalByUser(user_id, type);

      await logsService.log(
        'get_total_by_user',
        `Se obtuvo el total de movimientos para el usuario con id ${user_id}`
      );

      return { success: true, data: total };
    } catch (error) {

      await logsService.log(
        'get_total_by_user_failed',
        `Intento fallido de obtener total de movimientos para el usuario con id ${user_id}: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("movement:getInitialBalancesByPaymentMethods", async (event) => {
    try {
      const balances = await closingService.getInitialBalancesByPaymentMethods();

      await logsService.log(
        'get_initial_balances_by_payment_methods',
        `Se obtuvo los balances iniciales por método de pago`
      );

      return { success: true, data: balances };
    } catch (error) {

      await logsService.log(
        'get_initial_balances_by_payment_methods_failed',
        `Intento fallido de obtener balances iniciales por método de pago: ${error.message}`
      );

      return { success: false, error: error.message };
    }
  });
}