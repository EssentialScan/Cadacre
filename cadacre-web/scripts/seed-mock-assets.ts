import { getDb } from "../src/db/client";
import { reits, reitAssets } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const db = getDb();
  if (!db) {
    console.error("No db");
    process.exit(1);
  }

  const allReits = await db.select().from(reits);
  
  if (allReits.length === 0) {
    console.log("No REITs found to seed assets for.");
    process.exit(0);
  }

  console.log(`Seeding 1 mock asset for each of the ${allReits.length} REITs...`);

  let count = 0;
  for (const reit of allReits) {
    // Generate some random coordinates roughly in Australia
    // Lat: -12 to -40
    // Lng: 115 to 150
    const lat = -40 + Math.random() * 28;
    const lng = 115 + Math.random() * 35;
    
    await db.insert(reitAssets).values({
      reitId: reit.id,
      address: `Mock Property for ${reit.ticker}`,
      suburb: "Sydney",
      lat,
      lng,
      propertyType: reit.sector,
      bookValue: 100000000 + Math.random() * 500000000,
    });
    count++;
  }

  console.log(`Seeded ${count} mock assets!`);
  process.exit(0);
}
main();
