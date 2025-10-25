import DatabaseSingle from "../electron/db/DatabaseSingle.js";


async function main() {
  const conexionDB = DatabaseSingle.getInstance().prisma;

  // Crear un registro en la base de datos
  const crea = await conexionDB.rol.create({
    data: {
      id: 1,
      name: "Administrador",
      description: "Rol de admin",
    },
  });

  // Consultar todos los roles
  const rols = await conexionDB.rol.findMany();
  console.log(rols);
}

main().catch((e) => {
  console.error(e);
});
