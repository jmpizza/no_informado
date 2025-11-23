const { contextBridge, ipcRenderer } = require("electron");

try {
  contextBridge.exposeInMainWorld("api", {
    login: (id, password) => ipcRenderer.invoke("auth:login", { id, password }),
    createUser: (userData) => ipcRenderer.invoke("user:create", userData),
    
    createPaymentMethod: (paymentMethodData) =>
      ipcRenderer.invoke("payment-method:create", paymentMethodData),
    getPaymentMethods: (status = null) =>
      ipcRenderer.invoke("payment-method:getAll", status),
    updatePaymentMethodStatus: (name, status) =>
      ipcRenderer.invoke("payment-method:updateStatus", { name, status }),
  });
} catch (error) {
  console.error("Error en preload script:", error);
}
