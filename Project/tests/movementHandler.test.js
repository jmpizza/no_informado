import { expect, test } from 'vitest'
import {isCajero, doPaymentMethodExist, validMovement } from '../src/backend/services/MovementService.js'

const mockUser = {
    id:64,
    rol_id:2
}

const mockBadUser = {
    id:64,
    rol_id:3
}

test("Verificacion de cajero", async () => {
  expect(await isCajero(mockBadUser)).toBe(false)
  expect(await isCajero(99999)).toBe(false)
  expect(await isCajero(mockUser)).toBe(true)
})

const badMovementPayload = {
            ammount: 10000,
            type: true,
            closing_id: 1,
            created_at: new Date(),
            user_id: 2, //mal user_id
            payment_method_id: 1,
        }

const badMovementPayload2 = {
            ammount: 10000,
            type: true,
            closing_id: 1,
            created_at: new Date(),
            user_id: 2, 
            payment_method_id: 1,
        }

const goodMovementPayload = {
            ammount: 10000,
            type: false,
            closing_id: 1,
            created_at: new Date(),
            user_id: 64,
            payment_method_id: 1,
}

test("Es un movimiento valido", async () => {
    expect(await validMovement()).toBe(false)
    expect(await validMovement(badMovementPayload,mockBadUser)).toBe(false)
    expect(await validMovement(badMovementPayload2,mockUser)).toBe(false)
    expect(await validMovement(goodMovementPayload,mockUser)).toBe(true)
})
