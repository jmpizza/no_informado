// prisma/seed_alert_parameters.js
import DatabaseSingle from "../electron/db/DatabaseSingle.js";

let db;

async function main() {
  db = DatabaseSingle.getInstance().prisma;

  // ---------------------------------------------
  //   GENERAR ALERT PARAMETERS SOLO SI NO EXISTEN
  // ---------------------------------------------

  const existing = await db.alert_parameter.findMany();

  if (existing.length === 0) {
    console.log("No existían alert parameters. Generando datos iniciales...");

    const paramsToCreate = [
      { variable: "closureDifferenceThreshold", setting: 15000 },
      { variable: "minorDifferenceThreshold", setting: 0 },
      { variable: "irregularAmountLimit", setting: 500000 },
      { variable: "anomalousMovementInterval", setting: 5 },
      { variable: "maxAnomalousMovementsPerDay", setting: 10 },
    ];

    await db.alert_parameter.createMany({
      data: paramsToCreate,
    });

    console.log("Alert parameters generados correctamente.");
  } else {
    console.log("Ya existen alert parameters. No se crearán nuevos.");
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
