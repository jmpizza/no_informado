import { expect, test } from 'vitest'
import { commonClosingAlerts, isOperador, isTodayClosingAble, thereAreMovementsForClosing } from "../service/closingHandler.js"

/*
id |  name   | last_name |  email   |  password  | status |       created_at        | rol_id 
----+---------+-----------+----------+------------+--------+-------------------------+--------
  1 | Antoine | tere      | Kindness | ASDASD     | t      | 2025-11-09 04:23:08.229 |      2
  2 | Tea     | tere      | Kina     | ASDSD      | t      | 2025-11-09 04:23:34.485 |      1
  3 | Cali    | Med       | Kia      | ASDSD      | t      | 2025-11-09 04:24:05.091 |      2
  4 | Cart    | vivi      | gha      | ASDSD      | t      | 2025-11-09 04:44:39.628 |      3
  5 | Cart    | vivi      | caroasd  | Caroline12 | t      | 2025-11-11 22:37:14.95  |      1
(5 rows)
*/

test("Verificacion de Operador", async () => {
  expect(await isOperador(1)).toBe(false)
  expect(await isOperador(999)).toBe(false)
  expect(await isOperador(4)).toBe(true)
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

test("Verificacion del movimiento del dia de hoy", async () => {
  expect(await isTodayClosingAble(todayClosing)).toBe(false)
  expect(await isTodayClosingAble(yesterdayClosing)).toBe(true)
})

test("Hay movmientos disponibles para hacer cierre", async () => {
  expect(await thereAreMovementsForClosing()).toBe(false)
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

const closingtrigger2 = {
    id:1,
    total: 600000,
    comments: "Este no es un cierre",
    expected_balance: 400000,
    counted: 50000,
    difference: 1212,
    created_at: yesterday,
    user_id: 3
}

const rightClosing = {
    id:1,
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
  expect(await commonClosingAlerts(closingtrigger2, 0.3)).toBe(true)
  expect(await commonClosingAlerts(rightClosing, 0.4)).toBe(false)
})