const fs = require('fs');
let content = fs.readFileSync('scripts/seed-mock-assets.ts', 'utf8');

content = content.replace(
  '  propertyType: string;\n  bookValue: number;\n}',
  '  propertyType: string;\n  bookValue: number;\n  occupancyRate?: number;\n  wale?: number;\n  capRate?: number;\n  gla?: number;\n  majorTenant?: string;\n}'
);

content = content.replace(/propertyType: "Industrial", bookValue: 320000000/g, 'propertyType: "Industrial", bookValue: 320000000, occupancyRate: 99.5, wale: 4.8, capRate: 4.5, gla: 45000, majorTenant: "Woolworths Group"');
content = content.replace(/propertyType: "Industrial", bookValue: 750000000/g, 'propertyType: "Industrial", bookValue: 750000000, occupancyRate: 100, wale: 6.2, capRate: 4.2, gla: 125000, majorTenant: "Amazon"');
content = content.replace(/propertyType: "Industrial", bookValue: 410000000/g, 'propertyType: "Industrial", bookValue: 410000000, occupancyRate: 98.2, wale: 5.1, capRate: 4.6, gla: 68000, majorTenant: "Coles Group"');
content = content.replace(/propertyType: "Industrial", bookValue: 280000000/g, 'propertyType: "Industrial", bookValue: 280000000, occupancyRate: 100, wale: 7.5, capRate: 4.4, gla: 52000, majorTenant: "Toll Group"');
content = content.replace(/propertyType: "Industrial", bookValue: 195000000/g, 'propertyType: "Industrial", bookValue: 195000000, occupancyRate: 96.5, wale: 3.8, capRate: 5.1, gla: 38000, majorTenant: "Linfox"');
content = content.replace(/propertyType: "Industrial", bookValue: 165000000/g, 'propertyType: "Industrial", bookValue: 165000000, occupancyRate: 100, wale: 4.2, capRate: 5.3, gla: 31000, majorTenant: "DHL"');
content = content.replace(/propertyType: "Industrial", bookValue: 520000000/g, 'propertyType: "Industrial", bookValue: 520000000, occupancyRate: 99.0, wale: 5.5, capRate: 4.7, gla: 85000, majorTenant: "Australia Post"');

content = content.replace(/propertyType: "Retail", bookValue: 3200000000/g, 'propertyType: "Retail", bookValue: 3200000000, occupancyRate: 99.8, wale: 4.1, capRate: 4.0, gla: 168000, majorTenant: "Myer / David Jones"');
content = content.replace(/propertyType: "Retail", bookValue: 2400000000/g, 'propertyType: "Retail", bookValue: 2400000000, occupancyRate: 99.5, wale: 3.9, capRate: 4.1, gla: 132000, majorTenant: "David Jones"');
content = content.replace(/propertyType: "Retail", bookValue: 1800000000/g, 'propertyType: "Retail", bookValue: 1800000000, occupancyRate: 98.7, wale: 4.3, capRate: 4.8, gla: 125000, majorTenant: "Myer"');
content = content.replace(/propertyType: "Retail", bookValue: 2100000000/g, 'propertyType: "Retail", bookValue: 2100000000, occupancyRate: 99.2, wale: 4.0, capRate: 4.5, gla: 115000, majorTenant: "Target"');
content = content.replace(/propertyType: "Retail", bookValue: 1100000000/g, 'propertyType: "Retail", bookValue: 1100000000, occupancyRate: 97.5, wale: 3.5, capRate: 5.2, gla: 95000, majorTenant: "Kmart"');
content = content.replace(/propertyType: "Retail", bookValue: 1650000000/g, 'propertyType: "Retail", bookValue: 1650000000, occupancyRate: 98.9, wale: 4.2, capRate: 4.9, gla: 108000, majorTenant: "Big W"');
content = content.replace(/propertyType: "Retail", bookValue: 1900000000/g, 'propertyType: "Retail", bookValue: 1900000000, occupancyRate: 99.1, wale: 3.8, capRate: 4.6, gla: 137000, majorTenant: "Myer"');

content = content.replace(/propertyType: "Office", bookValue: 1200000000/g, 'propertyType: "Office", bookValue: 1200000000, occupancyRate: 94.5, wale: 5.2, capRate: 5.1, gla: 55000, majorTenant: "Commonwealth Bank"');
content = content.replace(/propertyType: "Office", bookValue: 1800000000/g, 'propertyType: "Office", bookValue: 1800000000, occupancyRate: 96.8, wale: 6.1, capRate: 4.9, gla: 84000, majorTenant: "Macquarie Group"');
content = content.replace(/propertyType: "Office", bookValue: 580000000/g, 'propertyType: "Office", bookValue: 580000000, occupancyRate: 92.1, wale: 4.5, capRate: 5.8, gla: 38000, majorTenant: "BHP"');
content = content.replace(/propertyType: "Office", bookValue: 960000000/g, 'propertyType: "Office", bookValue: 960000000, occupancyRate: 97.2, wale: 5.8, capRate: 5.3, gla: 62000, majorTenant: "PwC"');
content = content.replace(/propertyType: "Office", bookValue: 320000000/g, 'propertyType: "Office", bookValue: 320000000, occupancyRate: 89.5, wale: 3.2, capRate: 6.5, gla: 28000, majorTenant: "Rio Tinto"');
content = content.replace(/propertyType: "Office", bookValue: 450000000/g, 'propertyType: "Office", bookValue: 450000000, occupancyRate: 93.4, wale: 4.1, capRate: 6.0, gla: 34000, majorTenant: "Telstra"');

content = content.replace(/propertyType: "Office", bookValue: 1100000000/g, 'propertyType: "Office", bookValue: 1100000000, occupancyRate: 95.5, wale: 5.5, capRate: 5.0, gla: 68000, majorTenant: "King & Wood Mallesons"');
content = content.replace(/propertyType: "Retail", bookValue: 1750000000/g, 'propertyType: "Retail", bookValue: 1750000000, occupancyRate: 99.4, wale: 3.7, capRate: 4.5, gla: 110000, majorTenant: "Hoyts"');
content = content.replace(/propertyType: "Retail", bookValue: 1200000000/g, 'propertyType: "Retail", bookValue: 1200000000, occupancyRate: 98.1, wale: 4.4, capRate: 5.0, gla: 92000, majorTenant: "Myer"');
content = content.replace(/propertyType: "Industrial", bookValue: 45000000/g, 'propertyType: "Industrial", bookValue: 45000000, occupancyRate: 100, wale: 3.1, capRate: 5.5, gla: 18000, majorTenant: "FedEx"');
content = content.replace(/propertyType: "Retail", bookValue: 680000000/g, 'propertyType: "Retail", bookValue: 680000000, occupancyRate: 96.5, wale: 4.8, capRate: 5.4, gla: 70000, majorTenant: "Woolworths"');
content = content.replace(/propertyType: "Office", bookValue: 310000000/g, 'propertyType: "Office", bookValue: 310000000, occupancyRate: 91.2, wale: 3.9, capRate: 6.2, gla: 25000, majorTenant: "Samsung"');

content = content.replace(/propertyType: "Retail", bookValue: 5500000000/g, 'propertyType: "Retail", bookValue: 5500000000, occupancyRate: 99.9, wale: 4.5, capRate: 3.8, gla: 240000, majorTenant: "Myer / David Jones"');
content = content.replace(/propertyType: "Retail", bookValue: 750000000/g, 'propertyType: "Retail", bookValue: 750000000, occupancyRate: 98.5, wale: 3.2, capRate: 5.1, gla: 15000, majorTenant: "Boutique Retailers"');
content = content.replace(/propertyType: "Retail", bookValue: 420000000/g, 'propertyType: "Retail", bookValue: 420000000, occupancyRate: 100, wale: 2.8, capRate: 5.5, gla: 12000, majorTenant: "JB Hi-Fi"');
content = content.replace(/propertyType: "Retail", bookValue: 380000000/g, 'propertyType: "Retail", bookValue: 380000000, occupancyRate: 97.4, wale: 4.1, capRate: 5.8, gla: 45000, majorTenant: "Nike"');

content = content.replace(/bookValue: a\.bookValue/g, 'bookValue: a.bookValue,\n        occupancyRate: a.occupancyRate || 95.0,\n        wale: a.wale || 5.0,\n        capRate: a.capRate || 5.0,\n        gla: a.gla || 50000,\n        majorTenant: a.majorTenant || "Multiple"');

fs.writeFileSync('scripts/seed-mock-assets.ts', content, 'utf8');
console.log('updated seed-mock-assets.ts');
