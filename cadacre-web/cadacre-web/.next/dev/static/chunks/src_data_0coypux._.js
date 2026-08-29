(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/data/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllTowns",
    ()=>getAllTowns,
    "getSydneyMetroTowns",
    ()=>getSydneyMetroTowns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$towns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/towns.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$nswSuburbs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/nswSuburbs.ts [app-client] (ecmascript)");
;
;
;
function getAllTowns() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$towns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["towns"].map((town)=>{
        const psiGrowthHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$nswSuburbs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPsiGrowthHistory"])(town.name);
        return psiGrowthHistory ? {
            ...town,
            psiGrowthHistory
        } : town;
    });
}
function getSydneyMetroTowns() {
    return getAllTowns().filter((town)=>town.region === "Sydney Metro");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/nswSuburbs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findPsiGrowthHistory",
    ()=>findPsiGrowthHistory,
    "getUncuratedNswSuburbs",
    ()=>getUncuratedNswSuburbs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$generated$2f$nswSuburbs$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/generated/nswSuburbs.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$towns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/towns.ts [app-client] (ecmascript)");
;
;
const allSuburbs = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$generated$2f$nswSuburbs$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
function normalizeName(name) {
    return name.toUpperCase().replace(/\(NSW\)/g, "").replace(/\s*-\s*/g, " ").replace(/[^A-Z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}
const curatedNames = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$towns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["towns"].map((town)=>normalizeName(town.name)));
function getUncuratedNswSuburbs() {
    return allSuburbs.filter((suburb)=>!curatedNames.has(normalizeName(suburb.name)));
}
function findPsiGrowthHistory(townName) {
    const norm = normalizeName(townName);
    return allSuburbs.find((suburb)=>normalizeName(suburb.name) === norm)?.growthHistory;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/towns.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Town dataset for the Cadacre shortlist engine.
//
// Every numeric field is wrapped in `SourcedField<T>` so a source/date travels
// with the individual figure, not just the record as a whole — different
// fields for the same town often come from different reports/dates.
// `value: null` means genuinely unavailable; AGENTS.md forbids guessing a
// plausible-looking number to fill the gap, so null is expected and handled
// by the ranking engine (excluded from results) rather than faked.
//
// Sourcing pass (2026-08-27): NSW regional centres only, gross yield taken
// from each report's own published house rental yield figure where stated
// (derivedYield: false); derived via (weekly rent * 52 / median price * 100)
// only where a report didn't publish yield directly.
//
// Towns researched but dropped for lack of a credible per-town figure this
// pass: Taree (2422) and Nowra (2540) — YIP suburb-profile URLs 404'd and no
// alternate single-source report was found in time; revisit later.
__turbopack_context__.s([
    "towns",
    ()=>towns
]);
const yip = (period)=>({
        source: "Your Investment Property Mag — CoreLogic suburb data",
        asOf: period
    });
const towns = [
    {
        id: "bathurst-nsw",
        name: "Bathurst",
        state: "NSW",
        coordinates: {
            lat: -33.4193,
            lng: 149.5775
        },
        population: {
            value: {
                estimate: 43653,
                growthPct: 3.34
            },
            source: "ABS Estimated Resident Population (LGA: Bathurst Regional), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 787,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Bathurst)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 6.0,
                participationRatePct: 58.3
            },
            source: "ABS Education and Employment by LGA (LGA: Bathurst Regional)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 24.9,
                avgWinterMinC: 2.1,
                annualRainfallMm: 792
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        amenities: {
            value: {
                schools: 16,
                hospitals: 3,
                supermarkets: 9,
                radiusKm: 5
            },
            source: "OpenStreetMap Overpass API — count within 5km of town centroid",
            sourceUrl: "https://overpass-api.de/api/interpreter",
            asOf: "2026-08-28"
        },
        medianPrice: {
            value: 665000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2795-bathurst"
        },
        medianRent: {
            value: 540,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2795-bathurst"
        },
        grossYieldPct: {
            value: 4.47,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2795-bathurst"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "Moderate",
            source: "NSW SES — Bathurst Regional Local Flood Emergency Sub Plan",
            sourceUrl: "https://www.ses.nsw.gov.au/sites/default/files/document/bathurst-regional-lfp-aug-2024-endorsed.pdf",
            asOf: "August 2024"
        },
        infrastructureProjects: [
            {
                text: "Bathurst Hospital Redevelopment — $200 million, construction underway (source: NSW Health Infrastructure)",
                sourceUrl: "https://www.nsw.gov.au/health-and-wellbeing/health-infrastructure-projects/bathurst-hospital-redevelopment"
            }
        ]
    },
    {
        id: "orange-nsw",
        name: "Orange",
        state: "NSW",
        coordinates: {
            lat: -33.2839,
            lng: 149.1000
        },
        population: {
            value: {
                estimate: 43736,
                growthPct: 6.13
            },
            source: "ABS Estimated Resident Population (LGA: Orange), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 1178,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Orange)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 6.3,
                participationRatePct: 59.8
            },
            source: "ABS Education and Employment by LGA (LGA: Orange)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 23.5,
                avgWinterMinC: 2.7,
                annualRainfallMm: 936
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 730000,
            source: "PRD Orange Property Market Update, 1st Half 2026 (Q4 2025 data)",
            sourceUrl: "https://www.prd.com.au/orange/research-hub/article/orange-market-update-1st-half-2026/",
            asOf: "Q4 2025"
        },
        medianRent: {
            value: 590,
            source: "PRD Orange Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/orange/research-hub/article/orange-market-update-1st-half-2026/",
            asOf: "Q4 2025"
        },
        grossYieldPct: {
            value: 3.8,
            source: "PRD Orange Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/orange/research-hub/article/orange-market-update-1st-half-2026/",
            asOf: "December 2025"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: 1.0,
            source: "PRD Orange Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/orange/research-hub/article/orange-market-update-1st-half-2026/",
            asOf: "December 2025"
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "Moderate",
            source: "Orange City Council flood study — Blackmans Swamp Creek; 1-in-100-yr event modelled to inundate 129 dwellings, 66 commercial buildings above floor level",
            sourceUrl: "https://www.orange.nsw.gov.au/councils-updated-orange-flood-study-is-open-for-community-comment/",
            asOf: "council flood study update (publication date not stated on source page)"
        },
        infrastructureProjects: [
            {
                text: "Orange Health Service palliative care redevelopment — part of the $93 million World Class End of Life Care Program, targeted 2026 (source: NSW Health Infrastructure)",
                sourceUrl: "https://www.nsw.gov.au/departments-and-agencies/health-infrastructure/news/orange-health-service-palliative-care"
            }
        ]
    },
    {
        id: "dubbo-nsw",
        name: "Dubbo",
        state: "NSW",
        coordinates: {
            lat: -32.2569,
            lng: 148.6011
        },
        population: {
            value: {
                estimate: 55518,
                growthPct: 8.00
            },
            source: "ABS Estimated Resident Population (LGA: Dubbo Regional), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 1671,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Dubbo)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 5.9,
                participationRatePct: 59.3
            },
            source: "ABS Education and Employment by LGA (LGA: Dubbo Regional)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 29.6,
                avgWinterMinC: 5.1,
                annualRainfallMm: 827
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        amenities: {
            value: {
                schools: 21,
                hospitals: 3,
                supermarkets: 6,
                radiusKm: 5
            },
            source: "OpenStreetMap Overpass API — count within 5km of town centroid",
            sourceUrl: "https://overpass-api.de/api/interpreter",
            asOf: "2026-08-28"
        },
        medianPrice: {
            value: 665000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2830-dubbo"
        },
        medianRent: {
            value: 580,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2830-dubbo"
        },
        grossYieldPct: {
            value: 4.53,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2830-dubbo"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: "Moderate",
            source: "NSW Reconstruction Authority — Natural Disaster Declarations FY2025-26 (Dubbo and Warrumbungle bushfire)",
            sourceUrl: "https://www.nsw.gov.au/departments-and-agencies/nsw-reconstruction-authority/about-us/recovery/disaster-recovery-support/dubbo-and-warrumbungle-bushfire-from-27-november-2025",
            asOf: "27 November 2025"
        },
        floodRisk: {
            level: "High",
            source: "Dubbo Flood Study Report / NSW SES Flood Data Portal — Macquarie/Talbragar River (Sept/Nov 2022 peaks over 7.3m; flood study models up to 2.9m inundation depth)",
            sourceUrl: "https://flooddata.ses.nsw.gov.au/flood-projects/dubbo-flood-study",
            asOf: "2022 events"
        },
        infrastructureProjects: [
            {
                text: "Dubbo Base Hospital Redevelopment — $150 million, Stages 1–4 (source: NSW Health Infrastructure)",
                sourceUrl: "https://napop.gov.au/Project/Details?ProjectId=f9d82cb7-7100-43a8-910b-be7fa45d54ee"
            }
        ]
    },
    {
        id: "wagga-wagga-nsw",
        name: "Wagga Wagga",
        state: "NSW",
        coordinates: {
            lat: -35.1082,
            lng: 147.3598
        },
        population: {
            value: {
                estimate: 67860,
                growthPct: 6.19
            },
            source: "ABS Estimated Resident Population (LGA: Wagga Wagga), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 1995,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Wagga Wagga)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 5.5,
                participationRatePct: 63.5
            },
            source: "ABS Education and Employment by LGA (LGA: Wagga Wagga)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 28.7,
                avgWinterMinC: 4.7,
                annualRainfallMm: 879
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 705000,
            source: "PRD Wagga Wagga Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/research-hub/article/wagga-wagga-market-update-1st-half-2026/",
            asOf: "Q1 2026"
        },
        medianRent: {
            value: 550,
            source: "PRD Wagga Wagga Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/research-hub/article/wagga-wagga-market-update-1st-half-2026/",
            asOf: "12 months to Q1 2026"
        },
        grossYieldPct: {
            value: 3.5,
            source: "PRD Wagga Wagga Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/research-hub/article/wagga-wagga-market-update-1st-half-2026/",
            asOf: "March 2026"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: 1.0,
            source: "PRD Wagga Wagga Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/research-hub/article/wagga-wagga-market-update-1st-half-2026/",
            asOf: "March 2026"
        },
        bushfireRisk: {
            level: "High",
            source: "NSW Rural Fire Service updated Bush Fire Prone Land mapping — almost the entire Wagga Wagga LGA designated bushfire prone (grassland now mandatorily included as medium bushfire-risk vegetation)",
            sourceUrl: "https://www.dailyadvertiser.com.au/story/7893141/almost-entire-wagga-region-dubbed-bushfire-prone-in-updated-mapping/",
            asOf: "2023"
        },
        floodRisk: {
            level: "High",
            source: "NSW SES / Murrumbidgee River flood history — November 2022 flood peaked 9.72m (major flooding, highest in 10 years, evacuations); Main City levee upgraded 2020 for 1-in-100-yr protection",
            sourceUrl: "https://www.abc.net.au/news/2022-11-05/wagga-flooding-forces-hundreds-to-evacuate/101618590",
            asOf: "November 2022"
        },
        infrastructureProjects: [
            {
                text: "Riverina Redevelopment Program (RAAF Base Wagga & Blamey Barracks Kapooka) — $800 million Defence infrastructure upgrade, construction from mid-2025, completion by mid-2033 (source: Department of Defence)",
                sourceUrl: "https://www.defence.gov.au/about/locations-property/infrastructure-projects/riverina-redevelopment-program"
            }
        ]
    },
    {
        id: "tamworth-nsw",
        name: "Tamworth",
        state: "NSW",
        coordinates: {
            lat: -31.0927,
            lng: 150.9294
        },
        population: {
            value: {
                estimate: 63652,
                growthPct: 4.37
            },
            source: "ABS Estimated Resident Population (LGA: Tamworth Regional), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 2338,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Tamworth)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 5.8,
                participationRatePct: 58.1
            },
            source: "ABS Education and Employment by LGA (LGA: Tamworth Regional)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 28.9,
                avgWinterMinC: 4.3,
                annualRainfallMm: 920
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 650000,
            source: "PRD Tamworth Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/tamworth/research-hub/article/tamworth-market-update-1st-half-2026/",
            asOf: "Q1 2026"
        },
        medianRent: {
            value: 530,
            source: "PRD Tamworth Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/tamworth/research-hub/article/tamworth-market-update-1st-half-2026/",
            asOf: "12 months to Q1 2026"
        },
        grossYieldPct: {
            value: 3.3,
            source: "PRD Tamworth Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/tamworth/research-hub/article/tamworth-market-update-1st-half-2026/",
            asOf: "March 2026"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: 1.6,
            source: "PRD Tamworth Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/tamworth/research-hub/article/tamworth-market-update-1st-half-2026/",
            asOf: "March 2026"
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "Moderate",
            source: "Tamworth Regional Council / NSW SES Flood Data Portal — Peel River flooding; Tamworth City-Wide Floodplain Risk Management Study & Plan, Flood Early Warning System in operation",
            sourceUrl: "https://www.tamworth.nsw.gov.au/ArticleDocuments/1058/ECM_2382059_v1_Tamworth%20Floodplain%20Risk%20Management%20Study%20and%20Plan%20vol1.pdf.aspx",
            asOf: "2019 base investigation, plan ongoing"
        },
        infrastructureProjects: [
            {
                text: "Tamworth Hospital Nioka Palliative Care Unit expansion — doubling capacity from 6 to 12 beds, part of the $93 million World Class End of Life Care Program, expected early 2027 (source: NSW Health Infrastructure)",
                sourceUrl: "https://www.nsw.gov.au/departments-and-agencies/health-infrastructure/news/construction-starts-on-tamworth-hospital-palliative-care-unit-expansion"
            }
        ]
    },
    {
        id: "armidale-nsw",
        name: "Armidale",
        state: "NSW",
        coordinates: {
            lat: -30.5106,
            lng: 151.6656
        },
        population: {
            value: {
                estimate: 29332,
                growthPct: 0.08
            },
            source: "ABS Estimated Resident Population (LGA: Armidale Regional), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 810,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Armidale)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 7.6,
                participationRatePct: 55.8
            },
            source: "ABS Education and Employment by LGA (LGA: Armidale Regional)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 23.2,
                avgWinterMinC: 2.7,
                annualRainfallMm: 907
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 625000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2350-armidale"
        },
        medianRent: {
            value: 510,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2350-armidale"
        },
        grossYieldPct: {
            value: 4.44,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2350-armidale"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "Moderate",
            source: "NSW SES Flood Data Portal — Armidale Flood Study / Flood Mitigation Study (Dumaresq Creek catchment)",
            sourceUrl: "https://flooddata.ses.nsw.gov.au/flood-projects/armidale-flood-study",
            asOf: "2004 (mitigation study 1999)"
        },
        infrastructureProjects: [
            {
                text: "Armidale Hospital redevelopment — completed, new Emergency, ICU, surgical and medical inpatient units (source: Health Infrastructure NSW)",
                sourceUrl: "https://www.hinfra.health.nsw.gov.au/news/latest/latest/armidale-hospital-redevelopment-officially-open"
            }
        ]
    },
    {
        id: "albury-nsw",
        name: "Albury",
        state: "NSW",
        coordinates: {
            lat: -36.0737,
            lng: 146.9135
        },
        population: {
            value: {
                estimate: 56036,
                growthPct: 7.41
            },
            source: "ABS Estimated Resident Population (LGA: Albury), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 1921,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Albury)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 6.8,
                participationRatePct: 59.3
            },
            source: "ABS Education and Employment by LGA (LGA: Albury)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 27.8,
                avgWinterMinC: 4.8,
                annualRainfallMm: 989
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 668000,
            source: "PRD Albury Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/albury/research-hub/article/albury-market-update-1st-half-2026/",
            asOf: "Q4 2025"
        },
        medianRent: {
            value: 580,
            source: "PRD Albury Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/albury/research-hub/article/albury-market-update-1st-half-2026/",
            asOf: "Q4 2025"
        },
        grossYieldPct: {
            value: 3.5,
            source: "PRD Albury Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/albury/research-hub/article/albury-market-update-1st-half-2026/",
            asOf: "December 2025"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: 1.5,
            source: "PRD Albury Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/albury/research-hub/article/albury-market-update-1st-half-2026/",
            asOf: "December 2025"
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "Moderate",
            source: "NSW SES Flood Data Portal — Albury Floodplain Management Plan / Murray River Flood Study (engineered/levee-mitigated exposure)",
            sourceUrl: "https://flooddata.ses.nsw.gov.au/flood-projects/albury-floodplain-management-plan",
            asOf: "Murray River Flood Study, 2012 base"
        },
        infrastructureProjects: [
            {
                text: "Albury Wodonga Regional Hospital — business case approved January 2025, early works underway (source: NSW Government / Health Infrastructure NSW)",
                sourceUrl: "https://www.nsw.gov.au/departments-and-agencies/health-infrastructure/news/albury-wodonga-regional-hospital-project-final-business-case-summary-released"
            }
        ]
    },
    {
        id: "coffs-harbour-nsw",
        name: "Coffs Harbour",
        state: "NSW",
        coordinates: {
            lat: -30.2963,
            lng: 153.1157
        },
        population: {
            value: {
                estimate: 78738,
                growthPct: 5.45
            },
            source: "ABS Estimated Resident Population (LGA: Coffs Harbour), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 1803,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Coffs Harbour)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 7.3,
                participationRatePct: 53.6
            },
            source: "ABS Education and Employment by LGA (LGA: Coffs Harbour)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 25.9,
                avgWinterMinC: 10.3,
                annualRainfallMm: 1817
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 950000,
            source: "PRD Coffs Harbour Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/coffsharbour/research-hub/article/coffs-harbour-market-update-1st-half-2026/",
            asOf: "Q1 2026"
        },
        medianRent: {
            value: 720,
            source: "PRD Coffs Harbour Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/coffsharbour/research-hub/article/coffs-harbour-market-update-1st-half-2026/",
            asOf: "12 months to Q1 2026"
        },
        grossYieldPct: {
            value: 3.4,
            source: "PRD Coffs Harbour Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/coffsharbour/research-hub/article/coffs-harbour-market-update-1st-half-2026/",
            asOf: "March 2026"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: 1.1,
            source: "PRD Coffs Harbour Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/coffsharbour/research-hub/article/coffs-harbour-market-update-1st-half-2026/",
            asOf: "March 2026"
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "Moderate",
            source: "Bureau of Meteorology (Coffs Creek flood warnings) and City of Coffs Harbour — Coffs Creek Floodplain Risk Management Study and Plan",
            sourceUrl: "https://www.coffsharbour.nsw.gov.au/Environment/Flooding/Flood-risk-management-plans-and-studies/Coffs-Creek-and-Park-Beach",
            asOf: "Plan endorsed 19 June 2025"
        },
        infrastructureProjects: [
            {
                text: "Coffs Harbour Bypass (Pacific Highway) — $2.20 billion, opening to traffic expected late 2026, full completion late 2027 (source: Transport for NSW)",
                sourceUrl: "https://www.nsw.gov.au/ministerial-releases/bridging-ahead-coffs-harbour-bypass-hits-new-milestones"
            }
        ]
    },
    {
        id: "lismore-nsw",
        name: "Lismore",
        state: "NSW",
        coordinates: {
            lat: -28.8135,
            lng: 153.2777
        },
        population: {
            value: {
                estimate: 44344,
                growthPct: 0.50
            },
            source: "ABS Estimated Resident Population (LGA: Lismore), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 1000,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Lismore)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 7.8,
                participationRatePct: 55.6
            },
            source: "ABS Education and Employment by LGA (LGA: Lismore)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 28.2,
                avgWinterMinC: 9.7,
                annualRainfallMm: 1462
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 695000,
            source: "PRD Lismore Property Market Update, 2nd Half 2025",
            sourceUrl: "https://www.prd.com.au/northernrivers/research-hub/article/lismore-market-update-2nd-half-2025/",
            asOf: "Q3 2025"
        },
        medianRent: {
            value: 700,
            source: "PRD Lismore Property Market Update, 2nd Half 2025",
            sourceUrl: "https://www.prd.com.au/northernrivers/research-hub/article/lismore-market-update-2nd-half-2025/",
            asOf: "September 2025"
        },
        grossYieldPct: {
            value: 4.0,
            source: "PRD Lismore Property Market Update, 2nd Half 2025",
            sourceUrl: "https://www.prd.com.au/northernrivers/research-hub/article/lismore-market-update-2nd-half-2025/",
            asOf: "September 2025"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: 0.5,
            source: "PRD Lismore Property Market Update, 2nd Half 2025",
            sourceUrl: "https://www.prd.com.au/northernrivers/research-hub/article/lismore-market-update-2nd-half-2025/",
            asOf: "September 2025"
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "High",
            source: "NSW SES Lismore flood guides — Feb 2022 catastrophic flood (Wilsons River record peak, 13 deaths, 4,055 properties uninhabitable; 155 recorded floods since 1850)",
            sourceUrl: "https://www.ses.nsw.gov.au/sites/default/files/document/nsw-ses_flood-guide_lismore-cbd_v07_digital.pdf",
            asOf: "February 2022 event; guide v07"
        },
        infrastructureProjects: [
            {
                text: "Lismore Base Hospital Redevelopment — $312 million, two new hospital towers and expanded emergency department (source: NSW Health Infrastructure)",
                sourceUrl: "https://www.nsw.gov.au/health-and-wellbeing/health-infrastructure-projects/lismore-base-hospital-redevelopment-stage-3b"
            }
        ]
    },
    {
        id: "tweed-heads-nsw",
        name: "Tweed Heads",
        state: "NSW",
        coordinates: {
            lat: -28.1774,
            lng: 153.5468
        },
        population: {
            value: {
                estimate: 97151,
                growthPct: 3.64
            },
            source: "ABS Estimated Resident Population (LGA: Tweed), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 1648,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Tweed)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 7.1,
                participationRatePct: 50.6
            },
            source: "ABS Education and Employment by LGA (LGA: Tweed)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 26.8,
                avgWinterMinC: 11,
                annualRainfallMm: 1545
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 1333500,
            source: "PRD Tweed Heads Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/coolangatta/research-hub/article/tweed-heads-market-update-1st-half-2026/",
            asOf: "Q4 2025"
        },
        medianRent: {
            value: 1200,
            source: "PRD Tweed Heads Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/coolangatta/research-hub/article/tweed-heads-market-update-1st-half-2026/",
            asOf: "Q4 2025"
        },
        grossYieldPct: {
            value: 4.3,
            source: "PRD Tweed Heads Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/coolangatta/research-hub/article/tweed-heads-market-update-1st-half-2026/",
            asOf: "December 2025"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: 0.9,
            source: "PRD Tweed Heads Property Market Update, 1st Half 2026",
            sourceUrl: "https://www.prd.com.au/coolangatta/research-hub/article/tweed-heads-market-update-1st-half-2026/",
            asOf: "December 2025"
        },
        bushfireRisk: {
            level: "Low",
            source: "Tweed Shire Council / NSW RFS — certified Bush Fire Prone Land map update explicitly excludes the urban Tweed Heads area (surrounding rural Shire remains High)",
            sourceUrl: "https://www.tweed.nsw.gov.au/development-business/land-use-planning-controls/land-constraints/bushfire-prone-land",
            asOf: "certified 24 May 2023"
        },
        floodRisk: {
            level: "High",
            source: "NSW SES Flood Data Portal — Post-2022 Event Flood Behaviour Analysis, Tweed River (Feb–Mar 2022 disaster, 2,100+ homes damaged shirewide)",
            sourceUrl: "https://flooddata.ses.nsw.gov.au/flood-projects/post-2022-event-flood-behaviour-analysis-tweed-river-report-only",
            asOf: "February–March 2022 event"
        },
        infrastructureProjects: [
            {
                text: "Tweed Valley Hospital — new $723.3 million hospital at Cudgen, opened to patients 14 May 2024 (source: NSW Health)",
                sourceUrl: "https://www.health.nsw.gov.au/news/Pages/20231128_00.aspx"
            }
        ],
        notes: "High median price relative to other towns in this list — will only surface for larger budgets."
    },
    {
        id: "goulburn-nsw",
        name: "Goulburn",
        state: "NSW",
        coordinates: {
            lat: -34.7544,
            lng: 149.7166
        },
        population: {
            value: {
                estimate: 32138,
                growthPct: 6.20
            },
            source: "ABS Estimated Resident Population (LGA: Goulburn Mulwaree), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 583,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Goulburn Mulwaree)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 6.3,
                participationRatePct: 56.0
            },
            source: "ABS Education and Employment by LGA (LGA: Goulburn Mulwaree)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 23.6,
                avgWinterMinC: 3.2,
                annualRainfallMm: 862
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 685000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2580-goulburn"
        },
        medianRent: {
            value: 500,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2580-goulburn"
        },
        grossYieldPct: {
            value: 4.06,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2580-goulburn"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        priceHistory: {
            value: [
                {
                    year: 2022,
                    medianPrice: 672500
                },
                {
                    year: 2023,
                    medianPrice: 665500
                }
            ],
            source: "Ray White Goulburn (principal Justin Gay), quoted in About Regional",
            sourceUrl: "https://aboutregional.com.au/goulburn-property-market-catches-its-breath-in-2023/441152/",
            asOf: "2023"
        },
        bushfireRisk: {
            level: "High",
            source: "Goulburn Mulwaree Council draft Bush Fire Prone Land map (NSW RFS-certified process) — reported almost all non-urban land in the LGA reclassified as bushfire prone",
            sourceUrl: "https://www.goulburnpost.com.au/story/5233247/map-shows-an-increased-bushfire-risk/",
            asOf: "2018"
        },
        floodRisk: {
            level: "Moderate",
            source: "NSW SES Flood Data Portal — Goulburn Flood Study Report / Wollondilly and Mulwaree Rivers Flood Study, reviewed after 2010 and 2012 floods",
            sourceUrl: "https://flooddata.ses.nsw.gov.au/flood-projects/goulburn-flood-study-report",
            asOf: "study series 1986–2003, reviewed post-2012"
        },
        infrastructureProjects: [
            {
                text: "Goulburn Hospital and Health Service Redevelopment — $165 million, completed June 2024 (source: NSW Health)",
                sourceUrl: "https://www.health.nsw.gov.au/news/Pages/20240620_02.aspx"
            }
        ]
    },
    {
        id: "griffith-nsw",
        name: "Griffith",
        state: "NSW",
        coordinates: {
            lat: -34.2874,
            lng: 146.0537
        },
        population: {
            value: {
                estimate: 27182,
                growthPct: 3.13
            },
            source: "ABS Estimated Resident Population (LGA: Griffith), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 566,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Griffith)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 4.7,
                participationRatePct: 60.6
            },
            source: "ABS Education and Employment by LGA (LGA: Griffith)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 30.6,
                avgWinterMinC: 6.1,
                annualRainfallMm: 665
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 660000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2680-griffith"
        },
        medianRent: {
            value: 535,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2680-griffith"
        },
        grossYieldPct: {
            value: 4.71,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2680-griffith"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "Moderate",
            source: "NSW SES Flood Data Portal — Griffith CBD Catchment Overland Flow Flood Study (~168 properties flood-liable in a 1% AEP event; no mainstream river flooding)",
            sourceUrl: "https://flooddata.ses.nsw.gov.au/related-dataset/griffith_cbd-overland-flow-flood-study-2012",
            asOf: "2011 study, updated following 2012 floods"
        },
        infrastructureProjects: [
            {
                text: "Griffith Base Hospital Redevelopment — $250 million, on track for completion 2025 (source: NSW Government)",
                sourceUrl: "https://www.nsw.gov.au/media-releases/250-million-new-griffith-base-hospital-on-track-for-completion-2025"
            }
        ]
    },
    {
        id: "queanbeyan-nsw",
        name: "Queanbeyan",
        state: "NSW",
        coordinates: {
            lat: -35.3538,
            lng: 149.2331
        },
        population: {
            value: {
                estimate: 63364,
                growthPct: 9.64
            },
            source: "ABS Estimated Resident Population (LGA: Queanbeyan-Palerang Regional), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 751,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Queanbeyan-Palerang)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 4.0,
                participationRatePct: 67.9
            },
            source: "ABS Education and Employment by LGA (LGA: Queanbeyan-Palerang Regional)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 24.7,
                avgWinterMinC: 3,
                annualRainfallMm: 942
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 873500,
            source: "Your Investment Property Mag — CoreLogic suburb data",
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2620-queanbeyan",
            asOf: "12 months to May 2026"
        },
        medianRent: {
            value: 650,
            source: "Your Investment Property Mag — CoreLogic suburb data",
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2620-queanbeyan",
            asOf: "12 months to May 2026"
        },
        grossYieldPct: {
            value: 4.2,
            source: "Your Investment Property Mag — CoreLogic suburb data",
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2620-queanbeyan",
            asOf: "12 months to May 2026"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "Moderate",
            source: "Queanbeyan Floodplain Risk Management Study & Plan (Queanbeyan-Palerang Regional Council) — Queanbeyan and Molonglo Rivers",
            sourceUrl: "https://www.qprc.nsw.gov.au/files/assets/public/v/4/building-and-development/planning-docs/flood-risk-management-plans-and-studies/queanbeyan-floodplain-risk-management-study-and-plan-2020-report.pdf",
            asOf: "December 2020"
        },
        infrastructureProjects: [
            {
                text: "Monaro Highway safety upgrade — approx. $20 million, expected completion mid-2026 (source: Transport for NSW)",
                sourceUrl: "https://www.transport.nsw.gov.au/projects/current-projects/monaro-highway-safety-upgrade"
            }
        ],
        notes: "Just across the border from Canberra rather than a Sydney-commute town — kept for yield/data-quality diversity. Bushfire risk here covers the Queanbeyan town centre only; the wider Queanbeyan-Palerang LGA (toward Braidwood/Lake George) is materially more bushfire-affected — see the 2025 draft Lake George Bush Fire Risk Management Plan."
    },
    {
        id: "mudgee-nsw",
        name: "Mudgee",
        state: "NSW",
        coordinates: {
            lat: -32.5946,
            lng: 149.5871
        },
        population: {
            value: {
                estimate: 25704,
                growthPct: 4.72
            },
            source: "ABS Estimated Resident Population (LGA: Mid-Western Regional), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 406,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Mid-Western)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 6.6,
                participationRatePct: 54.1
            },
            source: "ABS Education and Employment by LGA (LGA: Mid-Western Regional)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 26.6,
                avgWinterMinC: 3.5,
                annualRainfallMm: 833
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 737500,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2850-mudgee"
        },
        medianRent: {
            value: 630,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2850-mudgee"
        },
        grossYieldPct: {
            value: 4.78,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2850-mudgee"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: "High",
            source: "Mid-Western Regional LGA (contains Mudgee) included in Australian Government Disaster Recovery Payment declarations tied to the Gospers Mountain \"megafire\" — the largest single fire in Australian history, Black Summer 2019-20",
            sourceUrl: "https://www.rfs.nsw.gov.au/about-us/our-districts/cudgegong/latest-news/draft-bush-fire-risk-management-plan-for-mid-western-regional-council-now-on-public-exhibition",
            asOf: "2019–20 Black Summer; BFRMP dated 13 October 2020"
        },
        floodRisk: {
            level: "Moderate",
            source: "NSW SES Flood Data Portal — Mudgee Flood Study 2021 Final Report (Cudgegong River / Lawsons Creek confluence; most of town on higher ground, documented risk in low-lying areas)",
            sourceUrl: "https://flooddata.ses.nsw.gov.au/dataset/mudgee-flood-study-2021-final-report",
            asOf: "2021"
        },
        infrastructureProjects: [
            {
                text: "Mudgee Hospital Redevelopment — $70.7 million, completed (source: NSW Health Infrastructure)",
                sourceUrl: "https://www.nsw.gov.au/health-and-wellbeing/health-infrastructure-projects/mudgee-hospital-redevelopment"
            }
        ]
    },
    {
        id: "maitland-nsw",
        name: "Maitland",
        state: "NSW",
        coordinates: {
            lat: -32.7326,
            lng: 151.5556
        },
        population: {
            value: {
                estimate: 90553,
                growthPct: 14.53
            },
            source: "ABS Estimated Resident Population (LGA: Maitland), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 2017,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Maitland)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 7.3,
                participationRatePct: 62.0
            },
            source: "ABS Education and Employment by LGA (LGA: Maitland)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 28.1,
                avgWinterMinC: 8.2,
                annualRainfallMm: 929
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 672500,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2320-maitland"
        },
        medianRent: {
            value: 570,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2320-maitland"
        },
        grossYieldPct: {
            value: 4.56,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2320-maitland"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "High",
            source: "NSW SES local flood information for Maitland; Maitland City Council flood planning — Hunter River floodplain, July 2022 event (~10.5m at Maitland), one of the most extensively flood-studied LGAs in NSW",
            sourceUrl: "https://www.ses.nsw.gov.au/local-information/maitland",
            asOf: "flood plan review ongoing; most recent major event July 2022"
        },
        infrastructureProjects: [
            {
                text: "New Maitland Hospital — $470 million redevelopment, officially opened June 2025 (source: NSW Health Infrastructure)",
                sourceUrl: "https://www.nsw.gov.au/departments-and-agencies/health-infrastructure/news/470-million-maitland-hospital-officially-open"
            }
        ]
    },
    {
        id: "cessnock-nsw",
        name: "Cessnock",
        state: "NSW",
        coordinates: {
            lat: -32.8337,
            lng: 151.3550
        },
        population: {
            value: {
                estimate: 64082,
                growthPct: 12.98
            },
            source: "ABS Estimated Resident Population (LGA: Cessnock), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 1758,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Cessnock)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 8.7,
                participationRatePct: 53.6
            },
            source: "ABS Education and Employment by LGA (LGA: Cessnock)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 26.9,
                avgWinterMinC: 7.3,
                annualRainfallMm: 974
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 720000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2325-cessnock"
        },
        medianRent: {
            value: 580,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2325-cessnock"
        },
        grossYieldPct: {
            value: 4.34,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2325-cessnock"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: "High",
            source: "Australian Disaster Resilience Knowledge Hub (AIDR) — 2019-20 Black Summer fire complexes directly in the Cessnock LGA (Little L Complex ~65,000 ha, Crumps Road ~5,000 ha, Owendale ~1,000 ha)",
            sourceUrl: "https://knowledge.aidr.org.au/resources/black-summer-bushfires-nsw-2019-20/",
            asOf: "2019–20 Black Summer"
        },
        floodRisk: {
            level: "High",
            source: "NSW SES Flood Data Portal — Black Creek Floodplain Risk Management Study and Plan; South Cessnock Flood Study (Gillieston Heights regularly isolated by flooding)",
            sourceUrl: "https://flooddata.ses.nsw.gov.au/organization/cessnock-city-council",
            asOf: "Black Creek plan finalised June 2010"
        },
        infrastructureProjects: [
            {
                text: "Cessnock Hospital Redevelopment — $138 million, under construction (source: NSW Government)",
                sourceUrl: "https://www.nsw.gov.au/ministerial-releases/foundations-being-laid-for-138-million-cessnock-hospital-redevelopment"
            }
        ]
    },
    {
        id: "cowra-nsw",
        name: "Cowra",
        state: "NSW",
        coordinates: {
            lat: -33.8362,
            lng: 148.6900
        },
        population: {
            value: {
                estimate: 12753,
                growthPct: 0.74
            },
            source: "ABS Estimated Resident Population (LGA: Cowra), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 343,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Cowra)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 6.6,
                participationRatePct: 50.0
            },
            source: "ABS Education and Employment by LGA (LGA: Cowra)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 28.7,
                avgWinterMinC: 4.4,
                annualRainfallMm: 898
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 480000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2794-cowra"
        },
        medianRent: {
            value: 400,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2794-cowra"
        },
        grossYieldPct: {
            value: 4.87,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2794-cowra"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: "Moderate",
            source: "NSW SES Flood Data Portal — Cowra and Gooloogong Flood Studies / Cowra Overland Flood Study and Plan (Lachlan River downstream of Wyangala Dam)",
            sourceUrl: "https://flooddata.ses.nsw.gov.au/flood-projects/cowra-gooloogong-flood-studies",
            asOf: "updates a 1983 baseline study"
        },
        infrastructureProjects: [
            {
                text: "Cowra Hospital Redevelopment — $110.2 million (source: NSW Health Infrastructure)",
                sourceUrl: "https://www.nsw.gov.au/departments-and-agencies/health-infrastructure/news/cowra-hospital-redevelopment-designs-finalised"
            }
        ]
    },
    {
        id: "port-macquarie-nsw",
        name: "Port Macquarie",
        state: "NSW",
        coordinates: {
            lat: -31.4333,
            lng: 152.9094
        },
        population: {
            value: {
                estimate: 86585,
                growthPct: 8.13
            },
            source: "ABS Estimated Resident Population (LGA: Port Macquarie-Hastings), 2016 vs 2021",
            sourceUrl: "https://geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0",
            asOf: "2021"
        },
        crimeRate: {
            value: {
                propertyOffencesPer100k: 1571,
                period: "Apr 2025 – Mar 2026"
            },
            source: "NSW BOCSAR — LGA property-crime rate (LGA: Port Macquarie-Hastings)",
            sourceUrl: "https://bocsar.nsw.gov.au/content/dam/dcj/bocsar/documents/open-datasets/LGA_trends.xlsx",
            asOf: "Apr 2025 – Mar 2026"
        },
        employment: {
            value: {
                unemploymentRatePct: 6.7,
                participationRatePct: 48.6
            },
            source: "ABS Education and Employment by LGA (LGA: Port Macquarie-Hastings)",
            sourceUrl: "https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/ArcGIS/rest/services/ABS_Education_and_employment_by_2021_LGA/FeatureServer/0",
            asOf: "2016"
        },
        climate: {
            value: {
                avgSummerMaxC: 25.2,
                avgWinterMinC: 9.9,
                annualRainfallMm: 1274
            },
            source: "Open-Meteo historical weather archive, 2021–2023 daily average",
            sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
            asOf: "2021–2023"
        },
        medianPrice: {
            value: 922000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2444-port-macquarie"
        },
        medianRent: {
            value: 690,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2444-port-macquarie"
        },
        grossYieldPct: {
            value: 3.97,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2444-port-macquarie"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: "Very High",
            source: "NSW RFS Bush Fire Danger Period declarations for Port Macquarie-Hastings LGA (declared 1 September 2021, among the earliest starts); Black Summer 2019-20 burned >30% of the combined Mid Coast/Port Macquarie-Hastings LGAs",
            sourceUrl: "https://www.rfs.nsw.gov.au/fire-information/BFDP",
            asOf: "2019–20 Black Summer; BFDP reporting 2021"
        },
        floodRisk: {
            level: "Moderate",
            source: "Port Macquarie-Hastings Council — draft Hastings River Flood Study extension (2025); Camden Haven River and Lakes System Flood Study (2013); Hastings River Floodplain Risk Management Plan (2014)",
            sourceUrl: "https://haveyoursay.pmhc.nsw.gov.au/hastings-river-flood-extension-study",
            asOf: "draft study 2025"
        },
        infrastructureProjects: [
            {
                text: "Port Macquarie Base Hospital upgrade — $265 million redevelopment including a new four-storey inpatient building and ED expansion (source: NSW Government)",
                sourceUrl: "https://www.nsw.gov.au/ministerial-releases/first-look-at-265-million-port-macquarie-base-hospital-upgrade"
            }
        ]
    },
    // --- Sydney Metro suburbs (added 2026-08-29) ---
    // A separate cohort from the regional-NSW towns above: the product's core
    // pitch (AGENTS.md §1/§2) is a *regional* rentvesting shortlist, so these
    // carry `region: "Sydney Metro"` and are excluded from the paid ranked
    // shortlist (see the region filter in src/lib/rankTowns.ts) — they exist
    // for free browsing/comparison on the dashboard map only, e.g. so a user
    // can see how a regional town stacks up against the Sydney suburb they're
    // currently priced out of. Same sourcing rules as every other town: real,
    // sourced figures only, `null`/omitted where no credible source was found.
    // House medians (not units) from Your Investment Property Mag — CoreLogic
    // suburb data, 12 months to May 2026, same source pattern as the existing
    // dataset. Vacancy rate wasn't published on any of these suburb pages
    // (null across the board, matching most of the regional YIP-sourced towns
    // per §6's caveat); no credible per-suburb NSW RFS/SES bushfire/flood
    // source was quickly found for these established metro suburbs either.
    {
        id: "parramatta-nsw",
        name: "Parramatta",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.8151,
            lng: 151.0011
        },
        medianPrice: {
            value: 1582500,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2150-parramatta"
        },
        medianRent: {
            value: 720,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2150-parramatta"
        },
        grossYieldPct: {
            value: 2.36,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2150-parramatta"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: [
            {
                text: "Sydney Metro West — Parramatta station, tunnelling complete 2026, line targeted to open 2032 (source: Sydney Metro / NSW Government)",
                sourceUrl: "https://www.sydneymetro.info/"
            }
        ]
    },
    {
        id: "blacktown-nsw",
        name: "Blacktown",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.7688,
            lng: 150.9061
        },
        medianPrice: {
            value: 1175000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2148-blacktown"
        },
        medianRent: {
            value: 650,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2148-blacktown"
        },
        grossYieldPct: {
            value: 3.06,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2148-blacktown"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: []
    },
    {
        id: "liverpool-nsw",
        name: "Liverpool",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.92,
            lng: 150.9236
        },
        medianPrice: {
            value: 1300000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2170-liverpool"
        },
        medianRent: {
            value: 650,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2170-liverpool"
        },
        grossYieldPct: {
            value: 3.03,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2170-liverpool"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: [
            {
                text: "Liverpool Health and Academic Precinct — $830 million Liverpool Hospital redevelopment, Stage 2 (Integrated Services Building, expanded Emergency Department) under construction (source: NSW Government / Health Infrastructure)",
                sourceUrl: "https://www.health.nsw.gov.au/"
            }
        ]
    },
    {
        id: "penrith-nsw",
        name: "Penrith",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.7507,
            lng: 150.6877
        },
        medianPrice: {
            value: 1110500,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2750-penrith"
        },
        medianRent: {
            value: 630,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2750-penrith"
        },
        grossYieldPct: {
            value: 3.12,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2750-penrith"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: [
            {
                text: "Sydney Metro — Western Sydney Airport Line (St Marys–Orchard Hills–Luddenham–Bradfield–Airport Terminal–Airport Business Park), targeted to open 2027; Orchard Hills station near Penrith under construction (source: Sydney Metro / NSW Government)",
                sourceUrl: "https://www.sydneymetro.info/western-sydney-airport"
            }
        ]
    },
    {
        id: "campbelltown-nsw",
        name: "Campbelltown",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -34.0634,
            lng: 150.8143
        },
        medianPrice: {
            value: 1017000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2560-campbelltown"
        },
        medianRent: {
            value: 620,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2560-campbelltown"
        },
        grossYieldPct: {
            value: 3.33,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2560-campbelltown"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: []
    },
    {
        id: "mount-druitt-nsw",
        name: "Mount Druitt",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.7667,
            lng: 150.8167
        },
        medianPrice: {
            value: 1082000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2770-mount-druitt"
        },
        medianRent: {
            value: 620,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2770-mount-druitt"
        },
        grossYieldPct: {
            value: 3.02,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2770-mount-druitt"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: [
            {
                text: "Sydney Metro — Western Sydney Airport Line, St Marys station (interchange with T1 line) under construction, targeted to open 2027; new bus network linking Mount Druitt to the airport line (source: Sydney Metro / NSW Government)",
                sourceUrl: "https://www.sydneymetro.info/western-sydney-airport"
            }
        ]
    },
    {
        id: "bankstown-nsw",
        name: "Bankstown",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.9171,
            lng: 151.0345
        },
        medianPrice: {
            value: 1600000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2200-bankstown"
        },
        medianRent: {
            value: 810,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2200-bankstown"
        },
        grossYieldPct: {
            value: 2.78,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2200-bankstown"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: [
            {
                text: "Sydney Metro City & Southwest — conversion of the T3 Bankstown Line to metro standard; Bankstown Station becoming the 'central station of the southwest,' new Southwest Metro targeted to open second half of 2026 (source: Sydney Metro / NSW Government)",
                sourceUrl: "https://www.sydneymetro.info/city-southwest"
            }
        ]
    },
    {
        id: "chatswood-nsw",
        name: "Chatswood",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.7969,
            lng: 151.1806
        },
        medianPrice: {
            value: 3590000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2067-chatswood"
        },
        medianRent: {
            value: 1450,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2067-chatswood"
        },
        grossYieldPct: {
            value: 2.1,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2067-chatswood"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: []
    },
    {
        id: "fairfield-nsw",
        name: "Fairfield",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.872,
            lng: 150.9553
        },
        medianPrice: {
            value: 1328000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2165-fairfield"
        },
        medianRent: {
            value: 680,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2165-fairfield"
        },
        grossYieldPct: {
            value: 3.11,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2165-fairfield"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: []
    },
    {
        id: "auburn-nsw",
        name: "Auburn",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.8497,
            lng: 151.0328
        },
        medianPrice: {
            value: 1580000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2144-auburn"
        },
        medianRent: {
            value: 750,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2144-auburn"
        },
        grossYieldPct: {
            value: 2.68,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2144-auburn"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: []
    },
    {
        id: "merrylands-nsw",
        name: "Merrylands",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.8347,
            lng: 150.9878
        },
        medianPrice: {
            value: 1425000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2160-merrylands"
        },
        medianRent: {
            value: 750,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2160-merrylands"
        },
        grossYieldPct: {
            value: 2.9,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2160-merrylands"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: []
    },
    {
        id: "hurstville-nsw",
        name: "Hurstville",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.9673,
            lng: 151.1023
        },
        medianPrice: {
            value: 2276000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2220-hurstville"
        },
        medianRent: {
            value: 850,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2220-hurstville"
        },
        grossYieldPct: {
            value: 2.39,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2220-hurstville"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: []
    },
    {
        id: "st-marys-nsw",
        name: "St Marys",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.7657,
            lng: 150.7757
        },
        medianPrice: {
            value: 1200000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2760-st-marys"
        },
        medianRent: {
            value: 580,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2760-st-marys"
        },
        grossYieldPct: {
            value: 2.88,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2760-st-marys"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: [
            {
                text: "Sydney Metro — Western Sydney Airport Line — St Marys becomes a major interchange connecting the new metro to the existing suburban rail network; target opening April 2027 (source: NSW Government / Sydney Metro)",
                sourceUrl: "https://www.sydneymetro.info/western-sydney-airport"
            }
        ]
    },
    {
        id: "bondi-nsw",
        name: "Bondi",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.8915,
            lng: 151.2767
        },
        medianPrice: {
            value: 4905000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2026-bondi"
        },
        medianRent: {
            value: 1972,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2026-bondi"
        },
        grossYieldPct: {
            value: 2.08,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2026-bondi"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: []
    },
    {
        id: "manly-nsw",
        name: "Manly",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.7969,
            lng: 151.2879
        },
        medianPrice: {
            value: 5180000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2095-manly"
        },
        medianRent: {
            value: 2100,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2095-manly"
        },
        grossYieldPct: {
            value: 1.69,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2095-manly"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: []
    },
    {
        id: "mosman-nsw",
        name: "Mosman",
        state: "NSW",
        region: "Sydney Metro",
        coordinates: {
            lat: -33.8281,
            lng: 151.2413
        },
        medianPrice: {
            value: 5325000,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2088-mosman"
        },
        medianRent: {
            value: 2200,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2088-mosman"
        },
        grossYieldPct: {
            value: 1.81,
            ...yip("12 months to May 2026"),
            sourceUrl: "https://www.yourinvestmentpropertymag.com.au/top-suburbs/nsw/2088-mosman"
        },
        derivedYield: false,
        vacancyRatePct: {
            value: null
        },
        bushfireRisk: {
            level: null
        },
        floodRisk: {
            level: null
        },
        infrastructureProjects: []
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_data_0coypux._.js.map