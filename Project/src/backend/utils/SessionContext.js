// Módulo para mantener el estado del usuario autenticado en el backend
// Este es el equivalente del AuthContext pero para el backend

let currentAuthenticatedUser = null;

export function setAuthenticatedUser(userId) {
    currentAuthenticatedUser = userId;
}

export function getAuthenticatedUser() {
    return currentAuthenticatedUser;
}

export function clearAuthenticatedUser() {
    currentAuthenticatedUser = null;
}
