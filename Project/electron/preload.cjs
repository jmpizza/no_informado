try {
  const { contextBridge, ipcRenderer } = require("electron");

  contextBridge.exposeInMainWorld("api", {
    getRoles: () => ipcRenderer.invoke("get-roles"),
    createRole: (data) => ipcRenderer.invoke("create-role", data),
  });

  console.log("✅ Preload script cargado correctamente");
} catch (error) {
  console.error("❌ Error en preload script:", error);
}
