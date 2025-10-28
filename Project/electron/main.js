import { app, Menu, BrowserWindow, globalShortcut, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import DatabaseSingle from "./db/DatabaseSingle.js";

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

    Menu.setApplicationMenu(null)

    if (!app.isPackaged) {
        win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, "../dist-react/index.html"));
    }
};

app.whenReady().then(() => {
    createWindow();

    // Registrar Ctrl + Q
    globalShortcut.register('CommandOrControl+Q', () => {
        app.quit()
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

const conexionDB = DatabaseSingle.getInstance().prisma;

ipcMain.handle("get-roles", async () => {
    try {
        const roles = await conexionDB.rol.findMany();
        return { success: true, data: roles };
    } catch (error) {
        console.error("Error getting roles:", error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle("create-role", async (_, data) => {
    try {
        const newRole = await conexionDB.rol.create({
            data: {
                name: data.name,
                description: data.description,
            },
        });
        return { success: true, data: newRole };
    } catch (error) {
        console.error("Error creating role:", error);
        return { success: false, error: error.message };
    }
});
