import { useEffect, useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import VektorFlowNav from 'src/views/vektorflow/VektorFlowNav';
import { vektorflowGet } from 'src/api/vektorflow';

const GATEWAY_BASE = import.meta.env.VITE_LLM_GATEWAY_URL || '';

export default function ModelsPage() {
  const [health, setHealth] = useState<any>(null);
  useEffect(() => { vektorflowGet('/health').then(setHealth).catch(() => setHealth({ status: 'unreachable' })); }, []);
  return <div className="flex flex-col gap-5">
      <VektorFlowNav />
    <BreadcrumbComp title="Models & Providers" />
    <div className="rounded-2xl border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">AI Control Plane</p>
      <h1 className="mt-1 text-3xl font-bold">Models, Providers & Routing</h1>
      <p className="mt-2 text-muted-foreground">Provider credentials stay behind the backend/gateway. The dashboard selects capabilities and displays verified service state.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">VektorFlow API</p><p className="mt-2 text-xl font-semibold">{health?.status || 'Checking…'}</p></div>
      <div className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">LLM Gateway</p><p className="mt-2 text-xl font-semibold">{GATEWAY_BASE ? 'Configured' : 'Not configured'}</p><p className="mt-1 text-xs text-muted-foreground">Set VITE_LLM_GATEWAY_URL when the gateway is live.</p></div>
      <div className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">AdSpecialist</p><p className="mt-2 text-xl font-semibold">Pollinations · Flux</p><p className="mt-1 text-xs text-muted-foreground">Dedicated server-side ad image credential.</p></div>
    </div>
  </div>;
}
