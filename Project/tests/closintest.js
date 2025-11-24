// testClosing.js
import DatabaseSingle from "../electron/db/DatabaseSingle.js";
import ClosingService from "./src/backend/services/ClosingServiceC.js";
import ClosingRepository from "./src/backend/repositories/ClosingRepository.js";
import UserRepository from "./src/backend/repositories/UserRepository.js";
import PaymentMethodService from "./src/backend/services/PaymentMethodService.js";
import MovementRepository from "./src/backend/repositories/MovementRepository.js";
import PaymentMethodRepository from "./src/backend/repositories/PaymentMethodRepository.js";

async function test() {
  const db = DatabaseSingle.getInstance().prisma;
  const closingRepository = new ClosingRepository(db);
  const userRepository = new UserRepository(db);
  const paymentMethodService = new PaymentMethodService(db);
  const movementRepository = new MovementRepository(db);
  const paymentMethodRepository = new PaymentMethodRepository(db);

  const closingService = new ClosingService(
    closingRepository,
    userRepository,
    paymentMethodService,
    movementRepository,
    paymentMethodRepository
  );

  const results = await closingService.fetchClosingData(true);
  console.log("📦 RESULTADOS DEL CIERRE HOY:", results);
}

test().catch(err => {
  console.error("ERROR EJECUTANDO EL CLOSING SERVICE:", err);
});
