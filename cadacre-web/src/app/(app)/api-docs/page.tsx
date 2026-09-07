import Link from "next/link";

export const metadata = {
  title: "API Documentation | REITCompare",
  description: "Documentation for the REITCompare Data API.",
};

export default function ApiDocsPage() {
  return (
    <div className="bg-parchment/30 pt-12 pb-24 h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink-navy mb-4">
            Data API Documentation
          </h1>
          <p className="text-muted-foreground text-lg">
            The REITCompare API provides REST access to normalised REIT data, pricing, and national asset geocoding.
          </p>
        </div>

        <div className="space-y-12">
          {/* Authentication */}
          <section className="rounded-xl border border-border bg-white shadow-premium p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Authentication</h2>
            <p className="text-muted-foreground mb-4">
              All requests to the API must include an API key in the `Authorization` header. You can generate an API key from your <Link href="/account" className="text-brand-blue hover:underline">Account dashboard</Link>.
            </p>
            <div className="bg-slate-900 rounded-md p-4 overflow-x-auto text-sm text-slate-300">
              <pre><code>Authorization: Bearer reit_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></pre>
            </div>
          </section>

          {/* Rate Limits */}
          <section className="rounded-xl border border-border bg-white shadow-premium p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Rate Limits</h2>
            <p className="text-muted-foreground mb-4">
              Rate limits are based on your subscription tier. Limits are returned in the response headers.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
              <li><strong>Free Tier:</strong> 100 requests (Lifetime limit, strictly for evaluation)</li>
              <li><strong>Paid Tier:</strong> 10,000 requests</li>
            </ul>
            <div className="bg-slate-900 rounded-md p-4 overflow-x-auto text-sm text-slate-300">
              <pre><code>x-ratelimit-tier: paid</code></pre>
            </div>
          </section>

          {/* Endpoints */}
          <section className="space-y-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">Endpoints (v1)</h2>

            {/* GET /api/v1/reits */}
            <div className="rounded-xl border border-border bg-white shadow-premium p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                <span className="text-data-green mr-2">GET</span> /api/v1/reits
              </h3>
              <p className="text-muted-foreground mb-4">
                Returns a list of all supported REITs and their current top-level metrics.
              </p>
              <div className="bg-slate-900 rounded-md p-4 overflow-x-auto text-sm text-slate-300">
                <pre><code>{`curl -X GET https://cadacre.com/api/v1/reits \\
  -H "Authorization: Bearer reit_your_api_key"`}</code></pre>
              </div>
            </div>

            {/* GET /api/v1/reits/[ticker] */}
            <div className="rounded-xl border border-border bg-white shadow-premium p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                <span className="text-data-green mr-2">GET</span> /api/v1/reits/{"{ticker}"}
              </h3>
              <p className="text-muted-foreground mb-4">
                Returns detailed metrics and metadata for a specific REIT (e.g., `GPT`, `SCG`).
              </p>
              <div className="bg-slate-900 rounded-md p-4 overflow-x-auto text-sm text-slate-300">
                <pre><code>{`curl -X GET https://cadacre.com/api/v1/reits/GPT \\
  -H "Authorization: Bearer reit_your_api_key"`}</code></pre>
              </div>
            </div>

            {/* GET /api/v1/reits/[ticker]/assets */}
            <div className="rounded-xl border border-border bg-white shadow-premium p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                <span className="text-data-green mr-2">GET</span> /api/v1/reits/{"{ticker}"}/assets
              </h3>
              <p className="text-muted-foreground mb-4">
                Returns all geocoded property assets owned by a specific REIT.
              </p>
            </div>

            {/* GET /api/v1/assets */}
            <div className="rounded-xl border border-border bg-white shadow-premium p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                <span className="text-data-green mr-2">GET</span> /api/v1/assets
              </h3>
              <p className="text-muted-foreground mb-4">
                Returns all geocoded property assets across all REITs globally. 
                Useful for building national property exposure maps.
              </p>
            </div>

            {/* GET /api/v1/prices */}
            <div className="rounded-xl border border-border bg-white shadow-premium p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                <span className="text-data-green mr-2">GET</span> /api/v1/prices
              </h3>
              <p className="text-muted-foreground mb-4">
                Returns the latest closing prices for all tracked REITs.
              </p>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}
