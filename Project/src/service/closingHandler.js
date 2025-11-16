import { expect } from "vitest"
import { getLastClosing, getTodayMovements } from "../repository/cajaRepository.js"
import { findUser } from "../repository/userRepository.js"

export async function isOperador(userId){
    const cajeroRol = 3
    const usuarioRol = await findUser(userId)

    if ( usuarioRol == null){
      return false
    }
    
    const identificacionDeRol = usuarioRol.rol_id
  
    if (identificacionDeRol == cajeroRol){
      return true
    } else {
      return false
    }
}

export async function isTodayClosingAble(lastClosing){ //Cierre diario
    const today = new Date()
    const dayOfClosing = lastClosing.created_at.getDate()
    const monthOfClosing = lastClosing.created_at.getMonth()

    if (today.getDate() == dayOfClosing && 
        today.getMonth() == monthOfClosing) {
      console.log("No se puede realizar Closing, ya hay un Closing con el dia de hoy")
      return false
    }

    console.log("Si se puede hacer closing")
    return true
}

export async function thereAreMovementsForClosing() {
  const movements = await getTodayMovements()
  if (movements.length == 0){
    return false
  }
  return true
}

export async function commonClosingAlerts(potentialClosing, percentage){
  
  if (potentialClosing.total <= 0){
    return true
  }

  if (potentialClosing.expected_balance == 0 && potentialClosing.total != 0){
    return true
  }

  const upperBound = percentage + 1
  const lowerBound = 1 - percentage

  const ratio = potentialClosing.expected_balance/potentialClosing.total

  if (ratio < lowerBound) {
    return true
  } 

  if (ratio > upperBound){
    return true
  }

  return false
}


export { isCajero }