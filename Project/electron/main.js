import { app, Menu, BrowserWindow, globalShortcut } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { setupAuthHandlers } from "./ipc/authHandlers.js";
import { setupUserHandlers } from "./ipc/userHandlers.js";
import { setupRoleHandlers } from "./ipc/roleHandlers.js";
import { setupPaymentMethodHandlers } from "./ipc/paymentMethodHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);

  if (!app.isPackaged) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist-react/index.html"));
  }
};

app.whenReady().then(() => {
  setupAuthHandlers();
  setupUserHandlers();
  setupRoleHandlers();
  setupPaymentMethodHandlers();
  createWindow();

  // Registrar Ctrl + Q
  globalShortcut.register("CommandOrControl+Q", () => {
    app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
