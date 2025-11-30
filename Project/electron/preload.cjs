const { contextBridge, ipcRenderer } = require("electron");

try {
  contextBridge.exposeInMainWorld("api", {
    login: (id, password) => ipcRenderer.invoke("auth:login", { id, password }),
    createUser: (userData) => ipcRenderer.invoke("user:create", userData),
    updateUser: (userData) => ipcRenderer.invoke("user:update", userData),
    getUsers: (filters) => ipcRenderer.invoke("user:getAll", filters),
    getUserInfo: () => ipcRenderer.invoke("user:getUserInfo"),

    getRoles: () => ipcRenderer.invoke("role:getAll"),

    createPaymentMethod: (paymentMethodData) =>
      ipcRenderer.invoke("payment-method:create", paymentMethodData),
    getPaymentMethods: (status = null) =>
      ipcRenderer.invoke("payment-method:getAll", status),
    updatePaymentMethodStatus: (name, status) =>
      ipcRenderer.invoke("payment-method:updateStatus", { name, status }),

    createMovement: (movementData) =>
      ipcRenderer.invoke("movement:create", movementData),
    getMovementById: (id) => ipcRenderer.invoke("movement:getById", id),
    getMovements: (filters) => ipcRenderer.invoke("movement:getAll", filters),
    updateMovement: (id, movementData) =>
      ipcRenderer.invoke("movement:update", { id, movementData }),
    deleteMovement: (id) => ipcRenderer.invoke("movement:delete", id),
    getTotalByPaymentMethod: (payment_method_id, type = null) =>
      ipcRenderer.invoke("movement:getTotalByPaymentMethod", {
        payment_method_id,
        type,
      }),
    getTotalByUser: (user_id, type = null) =>
      ipcRenderer.invoke("movement:getTotalByUser", { user_id, type }),

    fetchClosingData: (status = null) =>
      ipcRenderer.invoke("closing:fetchData", status),
    createClosing: (closingData) =>
      ipcRenderer.invoke("closing:create", closingData),
    getLastClosing: () => ipcRenderer.invoke("closing:getLastClosing"),
    createClosingDetails: (closingDetails) =>
      ipcRenderer.invoke("closing:createDetails", closingDetails),

    generateClosingAlert: (alertClosingData) =>
      ipcRenderer.invoke("alert:generateClosingAlert", alertClosingData),
    generateMomvementAlert: (alertMovementData) =>
      ipcRenderer.invoke("alert:generateMovementAlert", alertMovementData),
    setParameters: (alertData) =>
      ipcRenderer.invoke("alert:setParameters", alertData),
    getParameters: () => ipcRenderer.invoke("alert:getParameters"),
    checkIrregularMovement: (movementData) =>
      ipcRenderer.invoke("alert:checkIrregularMovement", movementData),
    checkClosing: (movementData) =>
      ipcRenderer.invoke("alert:checkClosing", movementData),
    checkTimeInterval: () => 
      ipcRenderer.invoke("alert:checkTimeInterval"),
    getClosures: () => 
      ipcRenderer.invoke("closing:getAllClosures"),
    calculateDifference: (expected, counted) =>
      ipcRenderer.invoke("closing:calculateDifference", {
        expected: Number(expected),
        counted: Number(counted),
      }),
    getClosureDetails: (closing_id) =>
      ipcRenderer.invoke("closing:getClosureDetails", closing_id),
    exportToPdf: (closure) => 
      ipcRenderer.invoke("export:exportToPdf", closure),
    exportAllClosings: (closure) => 
      ipcRenderer.invoke("export:exportAllClosings", closure),
    getInitialBalancesByPaymentMethods: () => 
      ipcRenderer.invoke("movement:getInitialBalancesByPaymentMethods"),
    getAuthenticatedUser: () => 
      ipcRenderer.invoke("user:getId"),
  });
} catch (error) {
  console.error("Error en preload script:", error);
}
