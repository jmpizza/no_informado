import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  registerPaymentMethod,
  listPaymentMethods,
  changePaymentMethodStatus,
} from "../src/backend/services/PaymentMethodService.js";

import {
  paymentMethodExists,
  savePaymentMethod,
  getPaymentMethods,
  updatePaymentMethodStatus,
} from "../src/backend/repositories/PaymentMethodRepository.js";
    
// --- MOCKS ---
vi.mock("../src/backend/repositories/PaymentMethodRepository.js", () => ({
  paymentMethodExists: vi.fn(),
  savePaymentMethod: vi.fn(),
  getPaymentMethods: vi.fn(),
  updatePaymentMethodStatus: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// --------------------------------------------------
// 1. TESTS registrarPaymentMethod()
// --------------------------------------------------

describe("Register Payment Method", () => {
  test("falla si el nombre es inválido", async () => {
    const result = await registerPaymentMethod("a", "bad");
    expect(result.success).toBe(false);
    expect(result.message).toContain("Invalid name.");

  });

  test("falla si el método ya existe", async () => {
    paymentMethodExists.mockResolvedValue(true);

    const result = await registerPaymentMethod("Nequi", );
    expect(result.success).toBe(false);
    expect(result.message).toContain("Payment method already exists.");
  });

  test("registra correctamente si no existe y el nombre es válido", async () => {
    paymentMethodExists.mockResolvedValue(false);
    savePaymentMethod.mockResolvedValue(true);

    const result = await registerPaymentMethod("PSE", );
    expect(result.success).toBe(true);
    expect(result.message).toContain("Payment method successfully registered.");
  });
});


// --------------------------------------------------
// 2. TESTS listPaymentMethods()
// --------------------------------------------------

describe("List Payment Methods", () => {
  
  test("retorna success false si no hay métodos", async () => {
    getPaymentMethods.mockResolvedValue([]);

    const response = await listPaymentMethods();

    expect(response).toEqual({
      success: false,
      message: "No hay métodos de pago disponibles.",
      data: null
    });
  });

  test("retorna éxito y los métodos cuando existen", async () => {
    const mockData = [
      { name: "Nequi", active: true },
      { name: "Efectivo", active: true },
    ];

    getPaymentMethods.mockResolvedValue(mockData);

    const response = await listPaymentMethods();

    expect(response.success).toBe(true);
    expect(response.data.length).toBe(2);
    expect(response.data).toEqual(mockData);
  });

  test("cada item del data debe tener name y active", async () => {
    const mockData = [{ name: "Tarjeta", active: false }];

    getPaymentMethods.mockResolvedValue(mockData);

    const response = await listPaymentMethods();

    expect(response.success).toBe(true);
    expect(response.data[0]).toHaveProperty("name");
    expect(response.data[0]).toHaveProperty("active");
  });

});


// --------------------------------------------------
// 3. TESTS changePaymentMethodStatus()
// --------------------------------------------------

describe("Change Payment Method Status", () => {
  test("habilita método correctamente", async () => {
    updatePaymentMethodStatus.mockResolvedValue(true);

    const result = await changePaymentMethodStatus("Nequi", "enable");
    expect(result.success).toBe(true);
    expect(result.message).toContain("Payment method enabled");
  });

  test("deshabilita método correctamente", async () => {
    updatePaymentMethodStatus.mockResolvedValue(true);

    const result = await changePaymentMethodStatus("Nequi", "disable");
    expect(result.success).toBe(true);
    expect(result.message).toContain("Payment method disabled");
  });

  test("falla si no se pudo actualizar", async () => {
    updatePaymentMethodStatus.mockResolvedValue(false);

    const result = await changePaymentMethodStatus("Nequi", "enable");
    expect(result.success).toBe(false);
  });
});
