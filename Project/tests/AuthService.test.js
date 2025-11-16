import { describe, it, expect, beforeEach, vi } from "vitest";
import AuthService from "../src/backend/services/AuthService.js";
import { ValidationException } from "../src/backend/exceptions/ValidationException.js";
import bcrypt from "bcryptjs";

vi.mock("bcryptjs", () => ({
  default: { compare: vi.fn() },
}));

describe("AuthService - AuthUser", () => {
  let authService, mockUserRepo;

  /*
   Usuario válido para casos de prueba exitosos
   Contiene todos los campos requeridos con valores válidos
   */

  const validUser = {
    id: 666,
    name: "David",
    last_name: "Cortes",
    email: "correo@mail.com",
    password: "ValidPass123",
    status: true,
    rol_id: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepo = {
      findById: vi.fn(),
    };
    authService = new AuthService(mockUserRepo);
  });

  /*
   Caso: Autenticación válida
   
   Condiciones:
   - Usuario existe en base de datos
   - Usuario tiene status = true
   - Contraseña coincide con el hash almacenado
   
   Resultado:
   - Retorna el objeto usuario completo
   - bcrypt.compare es llamado con los parámetros correctos
   - El usuario retornado tiene status = true
   */

  it("Autentica usuario exitosamente", async () => {
    mockUserRepo.findById.mockResolvedValue(validUser);
    bcrypt.compare.mockResolvedValue(true);

    const result = await authService.AuthUser(666, "password123");

    expect(result).toBeDefined();
    expect(result.id).toBe(666);
    expect(result.status).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", validUser.password);
  });

  /*
   Caso: Usuario no existe
   
   Condiciones:
   - El ID no existe en la base de datos
   - mockUserRepo.findById retorna null
   
   Resultado:
   - Lanza ValidationException
   - Mensaje: "Usuario no encontrado"
   - No intenta comparar contraseña
   */

  it("Rechaza usuario que no existe", async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(authService.AuthUser(777, "password123")).rejects.toThrow(
      "Usuario no encontrado"
    );
  });

  /*
   Caso: Usuario inactivo
   
   Condiciones:
   - Usuario existe en la base de datos
   - El campo status del usuario es false
   - Contraseña es valida pero usuario esta inactivo
   
   Resultado:
   - Lanza ValidationException
   - Mensaje: "Usuario inactivo"
   - No valida contraseña
   */

  it("Rechaza usuario inactivo", async () => {
    const inactiveUser = { ...validUser, status: false };
    mockUserRepo.findById.mockResolvedValue(inactiveUser);

    await expect(authService.AuthUser(666, "password123")).rejects.toThrow(
      "Usuario inactivo"
    );
  });

  /*
   Caso: Contraseña incorrecta
   
   Condiciones:
   - Usuario existe en base de datos
   - Usuario tiene status = true
   - bcrypt.compare retorna false
   
   Resultado:
   - Lanza ValidationException
   - Mensaje: "Contraseña incorrecta"
   - bcrypt.compare es llamado con los parámetros correctos
   */

  it("Rechaza contraseña incorrecta", async () => {
    mockUserRepo.findById.mockResolvedValue(validUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.AuthUser(666, "wrongpassword")).rejects.toThrow(
      "Contraseña incorrecta"
    );
  });

  /*
   Caso limite: parametros nulos
   
   Condiciones:
   - ID es null o contraseña es null
   
   Resultado:
   - Lanza ValidationException
   - Se valida antes de consultar la base de datos
   */

  it("No autentica con id = null", async () => {
    await expect(authService.AuthUser(null, "password123")).rejects.toThrow(
      ValidationException
    );
  });
  
  it("No autentica con password = null", async () => {
    await expect(authService.AuthUser(666, null)).rejects.toThrow(
      ValidationException
    );
  });
  
});