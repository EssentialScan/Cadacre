"use client";

import { useState, useEffect, useTransition } from "react";
import { Bell, Trash2, Plus, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlertCondition, AlertChannel } from "@/db/schema";

interface AlertRecord {
  id: string;
  name: string;
  conditions: AlertCondition[];
  channels: AlertChannel[];
  isActive: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
  reitTicker: string | null;
  reitName: string | null;
}

const METRIC_LABELS: Record<AlertCondition["metric"], string> = {
  yield: "Yield (%)",
  ntaDiscount: "NTA Discount (%)",
  gearing: "Gearing (%)",
  wale: "WALE (yrs)",
  marketCap: "Market Cap ($)",
};

const OPERATOR_LABELS: Record<AlertCondition["operator"], string> = {
  gt: ">",
  lt: "<",
  gte: "≥",
  lte: "≤",
};

export function AlertsManager() {
  const [alertList, setAlertList] = useState<AlertRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [metric, setMetric] = useState<AlertCondition["metric"]>("yield");
  const [operator, setOperator] = useState<AlertCondition["operator"]>("lt");
  const [value, setValue] = useState("");
  const [channelType, setChannelType] = useState<AlertChannel["type"]>("email");
  const [channelDest, setChannelDest] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/alerts");
      if (res.ok) setAlertList(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          reitTicker: ticker || undefined,
          conditions: [{ metric, operator, value: Number(value) }] as AlertCondition[],
          channels: [{ type: channelType, destination: channelDest }] as AlertChannel[],
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to create alert");
      } else {
        setName(""); setTicker(""); setValue(""); setChannelDest("");
        setShowForm(false);
        load();
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
      setAlertList(prev => prev.filter(a => a.id !== id));
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-border shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 pt-5 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-blue" />
            My Alerts
          </CardTitle>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-brand-blue/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New alert
          </button>
        </CardHeader>

        {showForm && (
          <div className="border-b border-border/50 p-5 bg-muted/10">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Alert name</label>
                  <input
                    value={name} onChange={e => setName(e.target.value)} required
                    placeholder="e.g. GMG NTA discount alert"
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">REIT ticker (optional — leave blank for any)</label>
                  <input
                    value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())}
                    placeholder="e.g. GMG"
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 uppercase"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Condition — trigger when:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={metric} onChange={e => setMetric(e.target.value as AlertCondition["metric"])}
                    className="border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  >
                    {Object.entries(METRIC_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <select
                    value={operator} onChange={e => setOperator(e.target.value as AlertCondition["operator"])}
                    className="border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  >
                    {Object.entries(OPERATOR_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <input
                    type="number" step="any" required value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="15.0"
                    className="w-28 border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Alert copy will state the fact only — e.g. "NTA discount crossed 15.0%". No buy/sell characterisation.
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Delivery channel</p>
                <div className="flex items-center gap-2">
                  <select
                    value={channelType} onChange={e => setChannelType(e.target.value as AlertChannel["type"])}
                    className="border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  >
                    <option value="email">Email</option>
                    <option value="webhook">Webhook (Discord/Slack)</option>
                  </select>
                  <input
                    required value={channelDest} onChange={e => setChannelDest(e.target.value)}
                    placeholder={channelType === "email" ? "you@example.com" : "https://hooks.slack.com/..."}
                    type={channelType === "email" ? "email" : "url"}
                    className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="submit" disabled={isPending}
                  className="px-5 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Creating…" : "Create alert"}
                </button>
                <button
                  type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-border text-sm rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading alerts…</div>
          ) : alertList.length === 0 ? (
            <div className="p-10 text-center">
              <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No alerts configured</p>
              <p className="text-sm text-muted-foreground">Create an alert above to be notified when a REIT metric crosses a threshold you define.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {alertList.map(a => (
                <li key={a.id} className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground">{a.name}</span>
                      {a.reitTicker && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue">
                          {a.reitTicker}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${a.isActive ? "bg-data-green/10 text-data-green" : "bg-muted text-muted-foreground"}`}>
                        {a.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(a.conditions as AlertCondition[]).map((c, i) => (
                        <span key={i}>
                          {METRIC_LABELS[c.metric]} {OPERATOR_LABELS[c.operator]} {c.value}
                          {i < a.conditions.length - 1 && " AND "}
                        </span>
                      ))}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      via {(a.channels as AlertChannel[]).map(c => `${c.type}`).join(", ")}
                      {a.lastTriggeredAt && ` · Last triggered ${new Date(a.lastTriggeredAt).toLocaleDateString("en-AU")}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-1.5 rounded text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 mt-0.5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Alerts state facts only — e.g. "GMG NTA discount crossed 15.0%". No buy/sell characterisation.
        Alerts are checked on each daily data update. General information, not financial advice.
      </p>
    </div>
  );
}
