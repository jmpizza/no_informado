// UserService.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import UserService from "../src/backend/services/UserService.js";
import { ValidationException } from "../src/backend/exceptions/ValidationException.js";
import bcrypt from "bcryptjs";

vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn() },
}));

describe("UserService - CreateUser", () => {
  let userService, mockUserRepo, mockRoleRepo;

  const validData = {
    id: 123456789,
    name: "Juan",
    last_name: "Pérez",
    email: "juan@example.com",
    password: "password123",
    rol_id: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepo = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
    };
    mockRoleRepo = { findById: vi.fn() };
    userService = new UserService(mockUserRepo, mockRoleRepo);
  });

  it("Creacion de usuario exitosa", async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockRoleRepo.findById.mockResolvedValue({ id: 1 });
    bcrypt.hash.mockResolvedValue("hashed");
    mockUserRepo.create.mockResolvedValue({ ...validData, password: "hashed" });

    const result = await userService.CreateUser(validData);

    expect(result).toBeDefined();
    expect(bcrypt.hash).toHaveBeenCalledWith(validData.password, 10);
  });

  it("Rechazo por usuario existente", async () => {
    mockUserRepo.findById.mockResolvedValue({ id: validData.id });

    await expect(userService.CreateUser(validData)).rejects.toThrow(
      "El usuario ya existe"
    );
  });

  it("Rechazo por email duplicado", async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    mockUserRepo.findByEmail.mockResolvedValue({ email: validData.email });

    await expect(userService.CreateUser(validData)).rejects.toThrow(
      "El email ya esta registrado"
    );
  });

  it("Rechazo por rol inexistente", async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockRoleRepo.findById.mockResolvedValue(null);

    await expect(userService.CreateUser(validData)).rejects.toThrow(
      "El rol no existe"
    );
  });

  it("Rechazo por datos inválidos", async () => {
    await expect(
      userService.CreateUser({ ...validData, password: "123" })
    ).rejects.toThrow(ValidationException);
  });
});
