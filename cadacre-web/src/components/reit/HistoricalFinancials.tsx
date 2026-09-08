import { ReitHistoricalFinancial } from "@/db/schema";
import { formatCurrency } from "@/lib/utils";

interface HistoricalFinancialsProps {
  data: ReitHistoricalFinancial[];
}

export function HistoricalFinancials({ data }: HistoricalFinancialsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 border border-slate-200 rounded-xl bg-slate-50 text-center">
        <p className="text-slate-500 font-medium">Historical financials not disclosed.</p>
      </div>
    );
  }

  // Ensure sorted chronologically
  const sortedData = [...data].sort((a, b) => a.financialYear.localeCompare(b.financialYear));
  
  const years = sortedData.map(d => d.financialYear);

  const formatVal = (val: number | null | undefined, type: "currency" | "percent" | "number" | "years") => {
    if (val == null) return "Not disclosed";
    if (type === "currency") return formatCurrency(val);
    if (type === "percent") return `${val.toFixed(1)}%`;
    if (type === "years") return `${val.toFixed(1)} yrs`;
    return val.toString();
  };

  const rows = [
    { label: "Operating Earnings", key: "operatingEarnings", type: "currency" as const },
    { label: "EPS (cents)", key: "eps", type: "number" as const },
    { label: "Distribution (cents)", key: "distribution", type: "number" as const },
    { label: "NTA per security", key: "nta", type: "currency" as const },
    { label: "Gearing", key: "gearing", type: "percent" as const },
    { label: "Occupancy", key: "occupancy", type: "percent" as const },
    { label: "WALE", key: "wale", type: "years" as const },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-3 px-4 font-bold text-slate-700 w-1/4">Metric</th>
            {years.map(year => (
              <th key={year} className="py-3 px-4 font-bold text-slate-700 text-right">{year}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={row.key} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4 font-medium text-slate-600">{row.label}</td>
              {sortedData.map(d => {
                const val = d[row.key as keyof ReitHistoricalFinancial] as number | null;
                const formatted = formatVal(val, row.type);
                const isMissing = formatted === "Not disclosed";
                
                return (
                  <td key={`${d.financialYear}-${row.key}`} className={`py-3 px-4 text-right font-mono ${isMissing ? 'text-slate-400 italic text-xs' : 'text-slate-900 font-medium'}`}>
                    {isMissing ? "-" : formatted}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
