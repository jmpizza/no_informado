// src/electron/ipc/roleHandler.js
const { ipcMain } = require('electron');
// Ajusta la ruta al archivo donde esté tu DatabaseSingle.js
const DatabaseSingle = require('../db/DatabaseSingle'); // <-- ruta desde src/electron

function setupRoleHandlers() {
  // Obtener todos los roles
  ipcMain.handle('roles:getAll', async () => {
    try {
      const db = DatabaseSingle.getInstance().prisma;
      const roles = await db.rol.findMany();
      return { ok: true, data: roles };
    } catch (err) {
      console.error('roles:getAll error', err);
      return { ok: false, error: err.message || String(err) };
    }
  });

  // Crear un rol
  ipcMain.handle('roles:create', async (event, payload) => {
    try {
      // payload: { id?, name, description }
      const db = DatabaseSingle.getInstance().prisma;
      const created = await db.rol.create({
        data: payload,
      });
      return { ok: true, data: created };
    } catch (err) {
      console.error('roles:create error', err);
      return { ok: false, error: err.message || String(err) };
    }
  });
}

module.exports = { setupRoleHandlers };
