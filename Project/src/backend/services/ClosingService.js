//import { expect } from "vitest"  
//import { getLastClosing, getTodayMovements } from "../repositories/CajaRepository.js"
//import { findUser } from "../repositories/MovementUserRepository.js"

export async function isOperador(usuarioRol){
    const cajeroRol = 3

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

export async function thereAreMovementsForClosing(movements) {

  if (movements.length == 0){
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (const element of movements) {
        if (element.created_at < today) {
          return false; // Exits the function and returns the value
        }
  };
  
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


//export { isCajero }