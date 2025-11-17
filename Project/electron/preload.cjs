const { contextBridge, ipcRenderer } = require('electron');

try {
  contextBridge.exposeInMainWorld('api', {
    login: (id, password) => ipcRenderer.invoke('auth:login', { id, password }),
    createUser: (userData) => ipcRenderer.invoke('user:create', userData)
  });
  
} catch (error) {
  console.error("Error en preload script:", error);
}