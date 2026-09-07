export interface ReitAssetMock {
  id: string;
  reitTicker: string;
  address: string;
  suburb: string;
  state: string;
  lat: number;
  lng: number;
  propertyType: string;
  bookValue: number;
}

export const seedAssets: ReitAssetMock[] = [
  // GMG (Goodman Group) - Industrial (Warehouses)
  {
    id: "asset-gmg-1",
    reitTicker: "GMG",
    address: "1-3 Burrows Road",
    suburb: "Alexandria",
    state: "NSW",
    lat: -33.911,
    lng: 151.191,
    propertyType: "Logistics Facility",
    bookValue: 45000000,
  },
  {
    id: "asset-gmg-2",
    reitTicker: "GMG",
    address: "Oakdale Industrial Estate",
    suburb: "Horsley Park",
    state: "NSW",
    lat: -33.844,
    lng: 150.865,
    propertyType: "Distribution Centre",
    bookValue: 120000000,
  },
  {
    id: "asset-gmg-3",
    reitTicker: "GMG",
    address: "5-17 Rothschild Avenue",
    suburb: "Rosebery",
    state: "NSW",
    lat: -33.916,
    lng: 151.202,
    propertyType: "Business Park",
    bookValue: 35000000,
  },

  // SCG (Scentre Group) - Retail (Westfield)
  {
    id: "asset-scg-1",
    reitTicker: "SCG",
    address: "188 Pitt Street",
    suburb: "Sydney",
    state: "NSW",
    lat: -33.868,
    lng: 151.208,
    propertyType: "Shopping Centre",
    bookValue: 3200000000,
  },
  {
    id: "asset-scg-2",
    reitTicker: "SCG",
    address: "500 Oxford Street",
    suburb: "Bondi Junction",
    state: "NSW",
    lat: -33.891,
    lng: 151.248,
    propertyType: "Shopping Centre",
    bookValue: 2800000000,
  },
  {
    id: "asset-scg-3",
    reitTicker: "SCG",
    address: "159-175 Church Street",
    suburb: "Parramatta",
    state: "NSW",
    lat: -33.816,
    lng: 151.002,
    propertyType: "Shopping Centre",
    bookValue: 1900000000,
  },

  // DXS (Dexus) - Office
  {
    id: "asset-dxs-1",
    reitTicker: "DXS",
    address: "1 Farrer Place",
    suburb: "Sydney",
    state: "NSW",
    lat: -33.864,
    lng: 151.211,
    propertyType: "Premium Office Tower",
    bookValue: 1100000000,
  },
  {
    id: "asset-dxs-2",
    reitTicker: "DXS",
    address: "100 Harris Street",
    suburb: "Pyrmont",
    state: "NSW",
    lat: -33.871,
    lng: 151.194,
    propertyType: "A-Grade Office",
    bookValue: 350000000,
  },
  {
    id: "asset-dxs-3",
    reitTicker: "DXS",
    address: "14 Lee Street",
    suburb: "Haymarket",
    state: "NSW",
    lat: -33.882,
    lng: 151.203,
    propertyType: "A-Grade Office",
    bookValue: 420000000,
  },

  // CQR (Charter Hall Retail) - Retail
  {
    id: "asset-cqr-1",
    reitTicker: "CQR",
    address: "112-122 Belmore Road",
    suburb: "Randwick",
    state: "NSW",
    lat: -33.916,
    lng: 151.240,
    propertyType: "Convenience Retail",
    bookValue: 65000000,
  },
  {
    id: "asset-cqr-2",
    reitTicker: "CQR",
    address: "24-32 Lexington Drive",
    suburb: "Bella Vista",
    state: "NSW",
    lat: -33.737,
    lng: 150.957,
    propertyType: "Convenience Retail",
    bookValue: 55000000,
  },

  // CIP (Centuria Industrial) - Industrial
  {
    id: "asset-cip-1",
    reitTicker: "CIP",
    address: "10 Williamson Road",
    suburb: "Ingleburn",
    state: "NSW",
    lat: -34.004,
    lng: 150.864,
    propertyType: "Cold Storage Facility",
    bookValue: 38000000,
  },
  {
    id: "asset-cip-2",
    reitTicker: "CIP",
    address: "37-51 Scrivener Street",
    suburb: "Warwick Farm",
    state: "NSW",
    lat: -33.921,
    lng: 150.938,
    propertyType: "Manufacturing Facility",
    bookValue: 42000000,
  },

  // Expansion - Melbourne (VIC)
  {
    id: "asset-gmg-4",
    reitTicker: "GMG",
    address: "Port Melbourne Industrial Estate",
    suburb: "Port Melbourne",
    state: "VIC",
    lat: -37.828,
    lng: 144.922,
    propertyType: "Logistics Facility",
    bookValue: 85000000,
  },
  {
    id: "asset-scg-4",
    reitTicker: "SCG",
    address: "Westfield Doncaster",
    suburb: "Doncaster",
    state: "VIC",
    lat: -37.787,
    lng: 145.123,
    propertyType: "Shopping Centre",
    bookValue: 1500000000,
  },
  {
    id: "asset-dxs-4",
    reitTicker: "DXS",
    address: "180 Lonsdale Street",
    suburb: "Melbourne",
    state: "VIC",
    lat: -37.811,
    lng: 144.966,
    propertyType: "A-Grade Office",
    bookValue: 450000000,
  },

  // Expansion - Brisbane (QLD)
  {
    id: "asset-gmg-5",
    reitTicker: "GMG",
    address: "Brisbane Airport Industrial",
    suburb: "Brisbane Airport",
    state: "QLD",
    lat: -27.383,
    lng: 153.118,
    propertyType: "Distribution Centre",
    bookValue: 95000000,
  },
  {
    id: "asset-scg-5",
    reitTicker: "SCG",
    address: "Westfield Chermside",
    suburb: "Chermside",
    state: "QLD",
    lat: -27.385,
    lng: 153.032,
    propertyType: "Shopping Centre",
    bookValue: 1800000000,
  },
  {
    id: "asset-dxs-5",
    reitTicker: "DXS",
    address: "480 Queen Street",
    suburb: "Brisbane City",
    state: "QLD",
    lat: -27.463,
    lng: 153.031,
    propertyType: "Premium Office Tower",
    bookValue: 620000000,
  }
];
