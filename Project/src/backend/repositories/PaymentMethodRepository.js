import DatabaseSingle from "../../../electron/db/DatabaseSingle.js";

const dbConnection = DatabaseSingle.getInstance().prisma;

export async function paymentMethodExists(name) {
  const method = await dbConnection.payment_method.findUnique({
    where: { name },
  });
  return !!method;
}

export async function savePaymentMethod(name, description) {
  try {
    await dbConnection.payment_method.create({
      data: {
        name,
        description: description || null,
        active: true, // default active
      },
    });
    return true;
  } catch (error) {
    console.error("Error saving payment method:", error);
    return false;
  }
}

export async function getPaymentMethods() {
  return await dbConnection.payment_method.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      active: true,
    },
  });
}

export async function updatePaymentMethodStatus(name, status) {
  try {
    await dbConnection.payment_method.update({
      where: { name },
      data: { active: status },
    });
    return true;
  } catch (error) {
    console.error("Error updating payment method status:", error);
    return false;
  }
}
