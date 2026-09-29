import { useEffect, useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

import { VEKTORFLOW_API_BASE, vektorflowGet } from 'src/api/vektorflow';

const API_BASE = VEKTORFLOW_API_BASE;
const GATEWAY_BASE = import.meta.env.VITE_LLM_GATEWAY_URL || '';

export default function ModelsPage() {
  const [health, setHealth] = useState<any>(null);
  useEffect(() => { vektorflowGet('/health').then(setHealth).catch(() => setHealth({ status: 'unreachable' })); }, []);
  return <div className="flex flex-col gap-5">
    <BreadcrumbComp title="Models & Providers" />
    <div className="rounded-2xl border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">AI Control Plane</p>
      <h1 className="mt-1 text-3xl font-bold">Models, Providers & Routing</h1>
      <p className="mt-2 text-muted-foreground">Provider credentials stay behind the backend/gateway. The dashboard selects capabilities and displays verified service state.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">VektorFlow API</p><p className="mt-2 text-xl font-semibold">{health?.status || 'Checking…'}</p><p className="mt-1 text-xs text-muted-foreground">{API_BASE}</p></div>
      <div className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">LLM Gateway</p><p className="mt-2 text-xl font-semibold">{GATEWAY_BASE ? 'Configured' : 'Not configured'}</p><p className="mt-1 text-xs text-muted-foreground">Set VITE_LLM_GATEWAY_URL when the gateway is live.</p></div>
      <div className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">AdSpecialist</p><p className="mt-2 text-xl font-semibold">Pollinations · Flux</p><p className="mt-1 text-xs text-muted-foreground">Dedicated server-side ad image credential.</p></div>
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-2xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Provider architecture</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-lg border p-3"><b>VektorFlow agents</b><p className="text-muted-foreground">Agents request model capabilities through the backend routing layer.</p></div>
          <div className="rounded-lg border p-3"><b>Free LLM Gateway</b><p className="text-muted-foreground">OpenAI-compatible gateway for configured providers; keys remain server-side.</p></div>
          <div className="rounded-lg border p-3"><b>Pollinations / AdSpecialist</b><p className="text-muted-foreground">Image generation is isolated from general LLM routing.</p></div>
        </div>
      </section>
      <section className="rounded-2xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Poe workspace</h2>
        <p className="mt-2 text-sm text-muted-foreground">Poe supports API Bots that can point at a Chat Completions or Responses-compatible endpoint. The VektorFlow gateway can therefore serve as the secure integration boundary without exposing provider credentials in the browser.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => window.open('https://' + 'poe.com', '_blank', 'noopener,noreferrer')} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Open Poe</button>
          <button onClick={() => window.open('https://' + 'creator.poe.com/docs/api-bots/overview', '_blank', 'noopener,noreferrer')} className="rounded-lg border px-4 py-2 text-sm font-medium">Poe API Bot docs</button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">No Poe secret is stored in this Vite client. A Poe bot should target the gateway/server endpoint with its credential held server-side.</p>
      </section>
    </div>
  </div>;
}
