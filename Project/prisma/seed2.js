// prisma/seed.js
import bcrypt from "bcryptjs";
import DatabaseSingle from "../electron/db/DatabaseSingle.js";

let db;

async function main() {
  db = DatabaseSingle.getInstance().prisma;

  const defaultRoles = [
    { id: 1, name: "admin", description: "Administrador del sistema" },
    { id: 2, name: "cajero", description: "Cajero encargado de generar los distintos registros de movimientos" },
    { id: 3, name: "operador", description: "Operador encargado de generar los cierres al final del dia" },
  ];

  await db.rol.createMany({
    data: defaultRoles,
    skipDuplicates: true,
  });

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const existingAdmin = await db.user.findUnique({
    where: { email: "admin@cajacontrol.com" },
  });

  if (!existingAdmin) {
    await db.user.create({
      data: {
        id: 1000000000,
        name: "Administrador",
        last_name: "Sistema",
        email: "admin@cajacontrol.com",
        password: hashedPassword,
        status: true,
        created_at: new Date(),
        rol: { connect: { id: 1 } },
      },
    });
    console.log("Admin creado");
  } else {
    console.log("Admin ya existe");
  }

  // -------------------------
  //   MÉTODOS DE PAGO
  // -------------------------

  const paymentMethods = [
    { name: "Efectivo", active: true, account_number: null },
    { name: "Tarjeta", active: true, account_number: null },
    { name: "Transferencia", active: true, account_number: null },
    { name: "Datáfono", active: true, account_number: null },
    { name: "Billetera digital", active: true, account_number: null },
  ];

  for (const method of paymentMethods) {
    let paymentMethod = await db.payment_method.findFirst({
      where: { name: method.name },
    });

    if (!paymentMethod) {
      paymentMethod = await db.payment_method.create({
        data: method,
      });
      console.log(`Método de pago creado: ${method.name}`);
    } else {
      console.log(`Método de pago ya existe: ${method.name}`);
    }

    // ---------------------------------------------------------
    // Crear 5 movimientos iniciales por cada método de pago
    // ---------------------------------------------------------

    const existingMovements = await db.movement.findMany({
      where: { payment_method_id: paymentMethod.id },
    });

    if (existingMovements.length === 0) {
      console.log(`Generando movimientos para: ${method.name}`);

      for (let i = 0; i < 5; i++) {
        const movementData = {
          ammount: Math.floor(Math.random() * (50000 - 5000 + 1)) + 5000,
          type: Math.random() < 0.5,       // true = ingreso, false = egreso
          user_id: 1000000000,            // Admin
          payment_method_id: paymentMethod.id,
          closing_id: null,
          created_at: new Date(),
        };

        await db.movement.create({
          data: movementData,
        });

        console.log(`Movimiento #${i + 1} creado para ${method.name}`);
      }
    } else {
      console.log(`Ya existían movimientos para: ${method.name}`);
    }
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

