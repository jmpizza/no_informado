import DatabaseSingle from "../../electron/db/DatabaseSingle.js"

const conexionDB = DatabaseSingle.getInstance().prisma;

async function findUser(userId){
    const usuarioRol = await conexionDB.user.findUnique({
    where: {
        id: userId
        }
    })

    return usuarioRol
}

export {findUser}
