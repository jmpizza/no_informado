import { expect, test } from 'vitest'
import {isCajero, doPaymentMethodExist, validMovement } from '../service/movementHandler.js'

test("Verificacion de cajero", async () => {
  expect(await isCajero(2)).toBe(false)
  expect(await isCajero(99999)).toBe(false)
  expect(await isCajero(1)).toBe(true)
})

test("El metodo de pago existe", async () => {
    expect(await doPaymentMethodExist(1)).toBe(true)
    expect(await doPaymentMethodExist(99)).toBe(false)
})

const badMovementPayload = {
            id:"a",
            ammount: 10000,
            type: true,
            closing_id: 1,
            created_at: new Date(),
            user_id: 2, //mal user_id
            payment_method_id: 1,
        }

const badMovementPayload2 = {
            id:"a",
            ammount: 10000,
            type: true,
            closing_id: 1,
            created_at: new Date(),
            user_id: 2, //mal user_id
            payment_method_id: 1,
        }

const goodMovementPayload = {
            id:1,
            ammount: 10000,
            type: false,
            closing_id: 1,
            created_at: new Date(),
            user_id: 1,
            payment_method_id: 1,
}

test("Es un movimiento valido", async () => {
    expect(await validMovement(1)).toBe(false)
    expect(await validMovement(badMovementPayload)).toBe(false)
    expect(await validMovement(badMovementPayload2)).toBe(false)
    expect(await validMovement(goodMovementPayload)).toBe(true)
})
