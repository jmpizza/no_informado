import DatabaseSingle from "../db/DatabaseSingle.js"

const conexionDB = DatabaseSingle.getInstance().prisma;

function isAbovezero(amount){
  if (Number.isInteger(amount) == false){
    return false
  }
  return amount > 0
}

async function isCajero(user_id){
  const cajeroRol = 2
  const usuarioRol = await conexionDB.user.findUnique({
    where: {
      id: user_id
    }
  })

  if (usuarioRol == null){
    return false
  }
  const identificacionDeRol = usuarioRol.rol_id
  if (identificacionDeRol == cajeroRol){
    return true
  } else {
    return false
  }
}

async function doPaymentMethodExist(paymentMethod){
  const payment= await conexionDB.user.findUnique({
    where: {
      id: paymentMethod,
    }
  })
  if (payment.active == true){
    return true
  }
  
}

async function validMovimiento(payload){

  if (isAbovezero(payload.amount) == false){
    return false
  }
  
  if (await isCajero(payload.user_id) == false){
    return false
  }

  if (await doPaymentMethodExist(payload.payment_method_id) == false){
    return false
  }
  return true
}

async function addMovimiento(payload) {
  const veredicto = await validMovimiento(payload)
  if (veredicto == false){
    return console.log("No es valido")
  }

  console.log("Es valido")
  //Convierte el monto a negativo por ser egreso
  if (payload.type == false){
    payload.amount = (-1)*payload.amount
  } 

  // eslint-disable-next-line no-unused-vars
  const crea = await conexionDB.movement.create(payload)
}


async function main() {
  const payload = {} // Completar con datos
  addMovimiento(payload)
}

main().catch((e) => {
  console.error(e);
});