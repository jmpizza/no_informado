import { getPaymentMethod, insertMovement} from "../repositories/CajaRepository.js"
import { findUser } from "../repositories/MovementUserRepository.js"

async function isCajero(usuarioRol){
    const cajeroRol = 2

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

async function doPaymentMethodExist(paymentId){
  const payment = await getPaymentMethod(paymentId)

  if (payment == null){
    return false
  }
  return true
}

async function isAbovezero(ammount){
    if (Number.isInteger(ammount) == false){
      return false
    }
    return ammount > 0
  }

async function validMovement(payloadMovement, user){
  
  if (typeof(payloadMovement) != typeof({})){
    return false
  }
  if (await isAbovezero(payloadMovement.ammount) == false ){
    return false
  }
  if (payloadMovement.user_id != user.id){
    return false 
  }
  
  if (await isCajero(user) == false){
    return false
  }

  return true
}

async function Movement(payloadMovement) {
  if (validMovement(payloadMovement) == false){
    return false
  }

  const movement = insertMovement(payloadMovement)
}


export {isCajero, doPaymentMethodExist, validMovement, isAbovezero, movement}
