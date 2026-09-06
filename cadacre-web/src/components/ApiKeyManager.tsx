"use client";

import { useState, useTransition } from "react";
import { Key, Trash2, Copy, Check, Plus } from "lucide-react";

interface ApiKeyRecord {
  id: string;
  keyPrefix: string;
  tier: string;
  requestCount: number;
  lastUsedAt: string | null;
  createdAt: string;
}

export function ApiKeyManager({ initialKeys }: { initialKeys: ApiKeyRecord[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [isPending, startTransition] = useTransition();
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadKeys = async () => {
    const res = await fetch("/api/apikeys");
    if (res.ok) setKeys(await res.json());
  };

  const handleGenerate = () => {
    startTransition(async () => {
      const res = await fetch("/api/apikeys", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setNewKeyValue(data.key);
        loadKeys();
      }
    });
  };

  const handleRevoke = (id: string) => {
    startTransition(async () => {
      await fetch(`/api/apikeys?id=${id}`, { method: "DELETE" });
      setKeys(prev => prev.filter(k => k.id !== id));
    });
  };

  const handleCopy = async () => {
    if (newKeyValue) {
      await navigator.clipboard.writeText(newKeyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {newKeyValue && (
        <div className="rounded-lg border border-data-green/30 bg-data-green/5 p-4">
          <p className="text-sm font-semibold text-data-green mb-2">
            ✓ New API key generated — copy it now, it won't be shown again
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-white border border-border rounded px-3 py-2 font-mono break-all">
              {newKeyValue}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 rounded hover:bg-muted transition-colors shrink-0"
            >
              {copied ? <Check className="h-4 w-4 text-data-green" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
            </button>
          </div>
        </div>
      )}

      {keys.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground text-xs">Key</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground text-xs">Tier</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Requests</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Last used</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {keys.map(k => (
                <tr key={k.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-muted-foreground" />
                      <code className="text-xs text-foreground">{k.keyPrefix}…</code>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.tier === "paid" ? "bg-brand-blue/10 text-brand-blue" : "bg-muted text-muted-foreground"}`}>
                      {k.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono-figure text-xs">{k.requestCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                    {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString("en-AU") : "Never"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRevoke(k.id)}
                      className="p-1.5 rounded text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        {isPending ? "Generating…" : "Generate new API key"}
      </button>

      <p className="text-xs text-muted-foreground">
        Free tier: 100 requests. <a href="mailto:hello@reitcompare.com.au" className="underline hover:text-foreground">Contact us</a> to upgrade to a paid tier.
      </p>
    </div>
  );
}
