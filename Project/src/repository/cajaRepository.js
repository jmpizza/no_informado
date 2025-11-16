import DatabaseSingle from "../../electron/db/DatabaseSingle.js"

const conexionDB = DatabaseSingle.getInstance().prisma;



export async function insertMovement(payloadMovement){

    const movement = await conexionDB.movement.create({
        data: {
            id: payloadMovement.id,
            ammount: payloadMovement.ammount,
            type: payloadMovement.type,
            closing_id: payloadMovement.closing_id,
            created_at: payloadMovement.created_at,
            user_id: payloadMovement.user_id,
            payment_method_id: payloadMovement.payment_method_id,
        }
    })
}

export async function getTodayMovements(){
    const today = new Date()
    today.setHours(0, 0, 0, 0) //Dia de hoy, 00:00:00:000

    const todayMovements = await conexionDB.movement.findMany({
        where: {
        created_at:{
            gte: today
        }
        }
    });

    return todayMovements
    }

//Closings

export async function addClosing(payloadClosing) {
    const closing = await conexionDB.closing.create({
            data: {
            id: 3,
            total: payloadClosing.total,
            comments: payloadClosing.comments,
            expected_balance: payloadClosing.expected_balance,
            counted: payloadClosing.counted,
            difference: payloadClosing.difference,
            created_at: new Date(),
            user_id: payloadClosing.user_id,
            }
        })
}

export async function getLastClosing(){
    const lastClosing = await conexionDB.closing.findMany({
    orderBy: {
        created_at: 'desc',
        },
    take: 1,
    });
    return lastClosing

}

//Method payment

export async function getPaymentMethod(paymentMethod) {
    const payment = await conexionDB.user.findUnique({
      where: {
        id: paymentMethod,
      }
    })

    return payment
}

export async function disablePaymentMethod(paymentId) {
    const paymentMethod = await conexionDB.payment_method.update({
        where: {
            id: paymentId,
        },
        data: {
            active: false
        }
    })
}

export async function enablePaymentMethod(paymentId) {
    const paymentMethod = await conexionDB.payment_method.update({
        where: {
            id: paymentId,
        },
        data: {
            active: true
        }
    })
}
