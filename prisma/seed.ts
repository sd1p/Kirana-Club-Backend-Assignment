import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function main() {
  const csvFilePath = path.join(__dirname, "../data/StoreMasterAssignment.csv");

  const stores: { AreaCode: string; StoreName: string; StoreID: string }[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      stores.push({
        AreaCode: row.AreaCode,
        StoreName: row.StoreName,
        StoreID: row.StoreID,
      });
    })
    .on("end", async () => {
      for (const store of stores) {
        await prisma.store.create({
          data: {
            areaCode: store.AreaCode,
            storeName: store.StoreName,
            storeId: store.StoreID,
          },
        });
      }
      console.log("done");
      await prisma.$disconnect();
    });
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
