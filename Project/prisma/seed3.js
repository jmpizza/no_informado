// prisma/seed_closing.js
import DatabaseSingle from "../electron/db/DatabaseSingle.js";

let db;

async function main() {
  db = DatabaseSingle.getInstance().prisma;

  // ---------------------------------------------
  //   GENERAR CIERRES SOLO SI NO EXISTEN
  // ---------------------------------------------

  const existingClosings = await db.closing.findMany();

  if (existingClosings.length === 0) {
    console.log("No existían cierres. Generando datos iniciales...");

    const closingsToCreate = [];

    for (let i = 0; i < 5; i++) {
      const expected = Math.floor(Math.random() * (300000 - 50000 + 1)) + 50000;
      const counted = expected + Math.floor(Math.random() * 20000 - 10000); // +/- 10k

      closingsToCreate.push({
        total: expected, // o algún otro cálculo tuyo
        comments: `Cierre automático de prueba #${i + 1}`,
        expected_balance: expected,
        counted: counted,
        difference: counted - expected,
        created_at: new Date(Date.now() - i * 86400000), // días hacia atrás
        user_id: 1000000000,
      });
    }

    await db.closing.createMany({
      data: closingsToCreate,
    });

    console.log("Cierres generados correctamente.");
  } else {
    console.log("Ya existen cierres. No se crearán nuevos.");
  }
}

try {
  await main();
} catch (e) {
  console.error("Seed failed:", e);
  process.exit(1);
} finally {
  if (db?.$disconnect) {
    await db.$disconnect();
  }
}
