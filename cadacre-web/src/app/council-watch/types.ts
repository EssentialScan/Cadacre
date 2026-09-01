export type WatchKind = "address" | "suburb" | "lga";

export type Watch = {
  id: string;
  kind: WatchKind;
  label: string;
  lgaName: string;
  suburbName: string | null;
  addressLine: string | null;
  createdAt: string; // ISO
};

export type WatchMatch = {
  id: string;
  watchId: string;
  matchReason: string;
  matchedAt: string; // ISO
  aiSummary: string | null;
  viewedAt: string | null;
  application: {
    id: string;
    address: string;
    suburb: string | null;
    description: string | null;
    applicationType: string | null;
    status: string | null;
    lodgedDate: string | null;
    decisionDate: string | null;
    sourceUrl: string;
    councilName: string | null;
  };
};

export type WatchWithMatches = Watch & { matches: WatchMatch[] };
