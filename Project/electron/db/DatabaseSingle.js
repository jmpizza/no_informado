import pkg from '@prisma/client';
const { PrismaClient } = pkg;

class DatabaseSingle {
  constructor() {
    if (!DatabaseSingle.instance) {
      this.prisma = new PrismaClient();
      DatabaseSingle.instance = this;
    }
    return DatabaseSingle.instance;
  }

  static getInstance() {
    if (!DatabaseSingle.instance) {
      DatabaseSingle.instance = new DatabaseSingle();
    }
    return DatabaseSingle.instance;
  }

  async disconnect() {
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
  }
}

export default DatabaseSingle;