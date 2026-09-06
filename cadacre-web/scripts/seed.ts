import { getDb } from "../src/db/client";
import { reits, reitAssets } from "../src/db/schema";
import { seedReits } from "../src/data/reitSeed";
import { seedAssets } from "../src/data/assetSeed";

async function main() {
  const db = getDb();
  if (!db) {
    console.error("Database connection failed. Ensure DATABASE_URL is set in .env.local.");
    process.exit(1);
  }

  console.log("Seeding database...");

  try {
    for (const mockReit of seedReits) {
      console.log(`Inserting REIT: ${mockReit.ticker}...`);
      
      const insertedReit = await db.insert(reits).values({
        ticker: mockReit.ticker,
        name: mockReit.name,
        sector: mockReit.sector,
        marketCap: mockReit.marketCap,
        yield: mockReit.yield,
        ntaDiscount: mockReit.ntaDiscount,
        gearing: mockReit.gearing,
        wale: mockReit.wale,
      }).returning({ id: reits.id });

      const reitId = insertedReit[0].id;

      const assets = seedAssets.filter(a => a.reitTicker === mockReit.ticker);
      for (const asset of assets) {
        console.log(`  Inserting Asset: ${asset.address}...`);
        await db.insert(reitAssets).values({
          reitId,
          address: asset.address,
          suburb: asset.suburb,
          lat: asset.lat,
          lng: asset.lng,
          propertyType: asset.propertyType,
          bookValue: asset.bookValue,
        });
      }
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  }
}

main();
