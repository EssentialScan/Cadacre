export type Sector = "Industrial" | "Retail" | "Office" | "Diversified" | "Specialized";

export interface TopTenant {
  name: string;
  percentage: number;
}

export interface GeoExposure {
  state: string;
  percentage: number;
}

export interface DistributionHistory {
  year: number;
  centsPerUnit: number;
}

export interface ReitMock {
  id: string;
  ticker: string;
  name: string;
  sector: Sector;
  marketCap: number | null;
  yield: number | null;
  ntaDiscount: number | null;
  gearing: number | null;
  wale: number | null;
  description: string;
  topTenants: TopTenant[];
  geoExposure: GeoExposure[];
  distributionHistory: DistributionHistory[];
}

export const seedReits: ReitMock[] = [
  {
    id: "uuid-gmg",
    ticker: "GMG",
    name: "Goodman Group",
    sector: "Industrial",
    marketCap: null,
    yield: null,
    ntaDiscount: null,
    gearing: null,
    wale: null,
    description: "Goodman Group is an integrated commercial and industrial property group that owns, develops and manages real estate including warehouses, large scale logistics facilities, business and office parks globally.",
    topTenants: [
      { name: "Amazon", percentage: 8.2 },
      { name: "DHL", percentage: 4.1 },
      { name: "Coles", percentage: 3.5 },
      { name: "Woolworths", percentage: 2.8 },
      { name: "Toll", percentage: 2.5 },
    ],
    geoExposure: [
      { state: "NSW", percentage: 45 },
      { state: "VIC", percentage: 30 },
      { state: "QLD", percentage: 15 },
      { state: "WA", percentage: 10 },
    ],
    distributionHistory: [
      { year: 2020, centsPerUnit: 30.0 },
      { year: 2021, centsPerUnit: 30.0 },
      { year: 2022, centsPerUnit: 30.0 },
      { year: 2023, centsPerUnit: 30.0 },
      { year: 2024, centsPerUnit: 30.0 },
    ]
  },
  {
    id: "uuid-scg",
    ticker: "SCG",
    name: "Scentre Group",
    sector: "Retail",
    marketCap: null,
    yield: null,
    ntaDiscount: null,
    gearing: null,
    wale: null,
    description: "Scentre Group is the owner and operator of Westfield in Australia and New Zealand.",
    topTenants: [
      { name: "Woolworths", percentage: 5.2 },
      { name: "Coles", percentage: 4.8 },
      { name: "Myer", percentage: 3.1 },
      { name: "David Jones", percentage: 2.9 },
      { name: "Kmart", percentage: 2.5 },
    ],
    geoExposure: [
      { state: "NSW", percentage: 50 },
      { state: "VIC", percentage: 25 },
      { state: "QLD", percentage: 15 },
      { state: "SA", percentage: 10 },
    ],
    distributionHistory: [
      { year: 2020, centsPerUnit: 14.0 },
      { year: 2021, centsPerUnit: 14.2 },
      { year: 2022, centsPerUnit: 15.7 },
      { year: 2023, centsPerUnit: 16.6 },
      { year: 2024, centsPerUnit: 17.2 },
    ]
  },
  {
    id: "uuid-dxs",
    ticker: "DXS",
    name: "Dexus",
    sector: "Office",
    marketCap: null,
    yield: null,
    ntaDiscount: null,
    gearing: null,
    wale: null,
    description: "Dexus is an Australasian real estate group, managing a high-quality Australian property portfolio valued at $31.8 billion.",
    topTenants: [
      { name: "Commonwealth Bank", percentage: 6.2 },
      { name: "Westpac", percentage: 5.1 },
      { name: "IBM", percentage: 4.2 },
      { name: "State Government", percentage: 3.8 },
      { name: "Federal Government", percentage: 3.5 },
    ],
    geoExposure: [
      { state: "NSW", percentage: 60 },
      { state: "VIC", percentage: 20 },
      { state: "QLD", percentage: 10 },
      { state: "WA", percentage: 10 },
    ],
    distributionHistory: [
      { year: 2020, centsPerUnit: 50.3 },
      { year: 2021, centsPerUnit: 51.8 },
      { year: 2022, centsPerUnit: 53.2 },
      { year: 2023, centsPerUnit: 51.6 },
      { year: 2024, centsPerUnit: 48.0 },
    ]
  },
  {
    id: "uuid-cqr",
    ticker: "CQR",
    name: "Charter Hall Retail REIT",
    sector: "Retail",
    marketCap: null,
    yield: null,
    ntaDiscount: null,
    gearing: null,
    wale: null,
    description: "Charter Hall Retail REIT is the leading owner of property for convenience retailers. The REIT's portfolio comprises 499 properties.",
    topTenants: [
      { name: "Coles", percentage: 15.2 },
      { name: "Woolworths", percentage: 14.8 },
      { name: "Aldi", percentage: 8.1 },
      { name: "Bunnings", percentage: 5.9 },
      { name: "Kmart", percentage: 4.5 },
    ],
    geoExposure: [
      { state: "NSW", percentage: 40 },
      { state: "QLD", percentage: 25 },
      { state: "VIC", percentage: 20 },
      { state: "WA", percentage: 15 },
    ],
    distributionHistory: [
      { year: 2020, centsPerUnit: 24.5 },
      { year: 2021, centsPerUnit: 24.5 },
      { year: 2022, centsPerUnit: 25.8 },
      { year: 2023, centsPerUnit: 26.1 },
      { year: 2024, centsPerUnit: 27.4 },
    ]
  },
  {
    id: "uuid-cip",
    ticker: "CIP",
    name: "Centuria Industrial REIT",
    sector: "Industrial",
    marketCap: null,
    yield: null,
    ntaDiscount: null, // Premium
    gearing: null,
    wale: null,
    description: "Centuria Industrial REIT is Australia's largest domestic pure-play industrial REIT. CIP's portfolio includes 88 high-quality, fit-for-purpose industrial assets.",
    topTenants: [
      { name: "Woolworths", percentage: 9.2 },
      { name: "Arnott's", percentage: 7.8 },
      { name: "Visy", percentage: 6.1 },
      { name: "Green's", percentage: 4.9 },
      { name: "Australia Post", percentage: 4.5 },
    ],
    geoExposure: [
      { state: "NSW", percentage: 35 },
      { state: "VIC", percentage: 35 },
      { state: "QLD", percentage: 20 },
      { state: "WA", percentage: 10 },
    ],
    distributionHistory: [
      { year: 2020, centsPerUnit: 17.0 },
      { year: 2021, centsPerUnit: 17.3 },
      { year: 2022, centsPerUnit: 16.0 },
      { year: 2023, centsPerUnit: 16.0 },
      { year: 2024, centsPerUnit: 16.0 },
    ]
  }
];
