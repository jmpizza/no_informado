import { getPaymentMethod, insertMovement} from "../repositories/CajaRepository.js"
import { findUser } from "../repositories/MovementUserRepository.js"

async function isCajero(userId){
    const cajeroRol = 2
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

async function validMovement(payloadMovement){
  
  if (typeof(payloadMovement) != typeof({})){
    return false
  }
  if (await isAbovezero(payloadMovement.ammount) == false ){
    return false
  }
  if (await isCajero(payloadMovement.user_id) == false){
    return false
  }
  
  if (await doPaymentMethodExist(payloadMovement.payment_method_id) == false){
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


export {isCajero, doPaymentMethodExist, validMovement, isAbovezero}
