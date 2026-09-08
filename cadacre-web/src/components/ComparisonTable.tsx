"use client";

import { useState } from "react";
import { Reit } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortKey = keyof Reit;
type SortOrder = "asc" | "desc";

export function ComparisonTable({ reits }: { reits: Reit[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc"); // Default to desc for new keys
    }
  };

  const sortedReits = [...reits].sort((a, b) => {
    const valA = a[sortKey] ?? 0;
    const valB = b[sortKey] ?? 0;
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const formatCurrency = (val: number | null) => {
    if (val == null) return "-";
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const formatPercent = (val: number | null) => val == null ? "-" : `${val.toFixed(1)}%`;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-white shadow-sm transition-all hover:shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-border/50">
            <TableHead className="cursor-pointer transition-colors hover:text-primary" onClick={() => handleSort("ticker")}>
              Ticker {sortKey === "ticker" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer transition-colors hover:text-primary" onClick={() => handleSort("sector")}>
              Sector {sortKey === "sector" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer text-right transition-colors hover:text-primary" onClick={() => handleSort("marketCap")}>
              Market Cap {sortKey === "marketCap" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer text-right transition-colors hover:text-primary" onClick={() => handleSort("yield")}>
              Yield {sortKey === "yield" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer text-right transition-colors hover:text-primary" onClick={() => handleSort("ntaDiscount")}>
              NTA Disc/Prem {sortKey === "ntaDiscount" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer text-right transition-colors hover:text-primary" onClick={() => handleSort("gearing")}>
              Gearing {sortKey === "gearing" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer text-right transition-colors hover:text-primary" onClick={() => handleSort("wale")}>
              WALE (yrs) {sortKey === "wale" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedReits.map((reit) => (
            <TableRow key={reit.id} className="transition-colors hover:bg-muted/50 border-b-border/50">
              <TableCell className="font-display font-bold text-foreground">
                {reit.ticker}
                <div className="text-xs font-normal text-muted-foreground">{reit.name}</div>
              </TableCell>
              <TableCell>{reit.sector}</TableCell>
              <TableCell className="text-right font-mono-figure text-foreground">
                {formatCurrency(reit.marketCap)}
              </TableCell>
              <TableCell className="text-right font-mono-figure text-brand-blue">
                {formatPercent(reit.yield)}
              </TableCell>
              <TableCell className="text-right font-mono-figure">
                <span className={(reit.ntaDiscount || 0) > 0 ? "text-data-red" : "text-data-green"}>
                  {(reit.ntaDiscount || 0) > 0 ? "-" : "+"}{formatPercent(Math.abs(reit.ntaDiscount || 0))}
                </span>
              </TableCell>
              <TableCell className="text-right font-mono-figure text-muted-foreground">
                {formatPercent(reit.gearing)}
              </TableCell>
              <TableCell className="text-right font-mono-figure text-muted-foreground">
                {reit.wale?.toFixed(1) || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
