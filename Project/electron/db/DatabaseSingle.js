import { PrismaClient } from "@prisma/client";

class DatabaseSingle {
  static instance;
  prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance() {
    if (!DatabaseSingle.instance) {
      DatabaseSingle.instance = new DatabaseSingle();
    }
    return DatabaseSingle.instance;
  }
}

export default DatabaseSingle;
