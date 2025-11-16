import { expect, test } from 'vitest'
import { commonClosingAlerts, isOperador, isTodayClosingAble, thereAreMovementsForClosing } from "../src/backend/services/ClosingService.js"

const goodOperator = { 
  id: 93,
  name: 'vin',
  last_name: 'vin',
  email: 's@s',
  password: 'QWeoi6',
  status: true,
  created_at: null,
  rol_id: 3
}

test("Verificacion de Operador", async () => {
  expect(await isOperador(5)).toBe(false)
  expect(await isOperador(goodOperator.id)).toBe(true)
})

//12 de noviembre hoy
const today = new Date()
const todayClosing= {
    id:1,
    total: 10000,
    comments: "Este no es un cierre",
    expected_balance: 40000,
    counted: 50000,
    difference: 1212,
    created_at: today,
    user_id: 3
}

const yesterday = new Date()
yesterday.setDate(yesterday.getDate()-1)

const yesterdayClosing = {
    id:1,
    total: 10000,
    comments: "Este no es un cierre",
    expected_balance: 40000,
    counted: 50000,
    difference: 1212,
    created_at: yesterday,
    user_id: 3
}

test("Verificacion del cierre del dia de hoy", async () => {
  expect(await isTodayClosingAble(todayClosing)).toBe(false)
  expect(await isTodayClosingAble(yesterdayClosing)).toBe(true)
})

 const validMovements = [{
    id: 37,
    ammount: 10000,
    type: true,
    created_at: new Date(),
    user_id: 64,
    closing_id: 3,
    payment_method_id: 1
  }
]

const nonValidMovements = [
  {
    id: 37,
    ammount: 10000,
    type: true,
    created_at: new Date(),
    user_id: 64,
    closing_id: 3,
    payment_method_id: 1
  },{
    id: 37,
    ammount: 10000,
    type: true,
    created_at: yesterday,
    user_id: 64,
    closing_id: 3,
    payment_method_id: 1
  }
]

 //la funcion getTodayMovements no retorno movimientos

test("Hay movmientos disponibles para hacer cierre", async () => {
  expect(await thereAreMovementsForClosing(validMovements)).toBe(true) //si se crearon movimientos hoy
  expect(await thereAreMovementsForClosing(nonValidMovements)).toBe(false) 
})

const closingtrigger1 = {
    id:1,
    total: -1000,
    comments: "Este no es un cierre",
    expected_balance: 40000,
    counted: 50000,
    difference: 1212,
    created_at: yesterday,
    user_id: 3
}

const closingtrigger10 = {
    id:1,
    total: 1,
    comments: "Este no es un cierre",
    expected_balance: 0,
    counted: 50000,
    difference: 1212,
    created_at: yesterday,
    user_id: 3
}
const closingtrigger2 = {
    id:1,
    total: 600,
    comments: "Este no es un cierre",
    expected_balance: 400,
    counted: 50000,
    difference: 1212,
    created_at: yesterday,
    user_id: 3
}

const closingtrigger3 = {
    id:1,
    total: 600,
    comments: "Este no es un cierre",
    expected_balance: 359,
    counted: 50000,
    difference: 1212,
    created_at: yesterday,
    user_id: 3
}
const closingtrigger4 = {
    id:1,
    total: 6000,
    comments: "Este no es un cierre",
    expected_balance: 8401,
    counted: 50000,
    difference: 1212,
    created_at: yesterday,
    user_id: 3
}

const rightClosing = {
    total: 600000,
    comments: "Este no es un cierre",
    expected_balance: 400000,
    counted: 50000,
    difference: 1212,
    created_at: yesterday,
    user_id: 3
}

test("Funciona las alertas comunes", async () => {
  expect(await commonClosingAlerts(closingtrigger1, 1)).toBe(true)
  expect(await commonClosingAlerts(closingtrigger10, 0.9)).toBe(true)
  expect(await commonClosingAlerts(closingtrigger2, 0.3)).toBe(true)
  expect(await commonClosingAlerts(closingtrigger3, 0.4)).toBe(true)
  expect(await commonClosingAlerts(closingtrigger4, 0.4)).toBe(true)
  expect(await commonClosingAlerts(rightClosing, 0.4)).toBe(false)
})