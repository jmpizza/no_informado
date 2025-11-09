const { contextBridge, ipcRenderer } = require('electron');

try {
  contextBridge.exposeInMainWorld('api', {
    login: (id, password) => ipcRenderer.invoke('auth:login', { id, password })
  });
  
} catch (error) {
  console.error("Error en preload script:", error);
}