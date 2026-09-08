import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  label: string;
  value: string | number | null;
  unit?: string;
  sourceTitle?: string | null;
  sourceDate?: string | null;
  methodology?: string | null;
  isCalculated?: boolean | null;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  sourceTitle,
  sourceDate,
  methodology,
  isCalculated,
  className,
}: MetricCardProps) {
  const isMissing = value === null || value === undefined || value === "";

  return (
    <div className={cn("flex flex-col p-4 bg-white border border-slate-200 rounded-lg shadow-sm relative group", className)}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        
        {/* Provenance Tooltip */}
        {!isMissing && sourceTitle && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="text-slate-300 hover:text-brand-blue transition-colors outline-none">
                <Info className="w-3.5 h-3.5" />
              </TooltipTrigger>
              <TooltipContent className="w-64 p-3 bg-slate-900 text-slate-50 border-none shadow-xl" side="bottom" align="end">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-start border-b border-slate-700 pb-2 mb-2">
                    <span className="font-semibold text-slate-300">Data Source</span>
                    {isCalculated ? (
                      <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider">Calculated</span>
                    ) : (
                      <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider">Reported</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Source</span>
                    <span className="font-medium text-white">{sourceTitle}</span>
                  </div>
                  {sourceDate && (
                    <div>
                      <span className="text-slate-400 block mb-0.5">As of</span>
                      <span className="font-medium text-white">{sourceDate}</span>
                    </div>
                  )}
                  {methodology && (
                    <div>
                      <span className="text-slate-400 block mb-0.5">Methodology</span>
                      <span className="font-medium text-white font-mono text-[10px] leading-relaxed break-all bg-slate-800 p-1 rounded inline-block mt-1">{methodology}</span>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="flex items-baseline gap-1 mt-auto">
        {isMissing ? (
          <span className="text-lg font-medium text-slate-400 italic">Not disclosed</span>
        ) : (
          <>
            <span className="font-display font-bold text-slate-900 text-2xl leading-none">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-semibold text-slate-500 leading-none">
                {unit}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
