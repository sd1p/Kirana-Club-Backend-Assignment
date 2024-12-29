import { PrismaClient } from "@prisma/client";

class PrismaClientInstance {
  private static prisma: PrismaClient;

  private constructor() {}

  public static getPrismaClient(): PrismaClient {
    if (!this.prisma) {
      this.prisma = new PrismaClient();

      process.on("beforeExit", () => {
        this.prisma.$disconnect();
      });
    }

    return this.prisma;
  }
}

export default PrismaClientInstance;
