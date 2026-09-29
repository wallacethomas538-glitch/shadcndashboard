import { useEffect, useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

import { vektorflowGet } from 'src/api/vektorflow';

export default function HermesPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { vektorflowGet('/health').then(setHealth).catch(() => setHealth({ status: 'unreachable' })).finally(() => setLoading(false)); }, []);
  return <div className="flex flex-col gap-5">
    <BreadcrumbComp title="Hermes" />
    <div className="rounded-2xl border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Local AI Executive / Automation</p>
      <h1 className="mt-1 text-3xl font-bold">Hermes Control</h1>
      <p className="mt-2 max-w-3xl text-muted-foreground">Monitor the VektorFlow connection without pretending local-device state is cloud state.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">VektorFlow backend</p><p className="mt-2 text-2xl font-semibold">{loading ? 'Checking…' : health?.status || 'Unknown'}</p></div>
      <div className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">Backend version</p><p className="mt-2 text-2xl font-semibold">{health?.version || '—'}</p></div>
      <div className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">Service</p><p className="mt-2 text-2xl font-semibold">{health?.powered_by || '—'}</p></div>
    </div>
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="text-lg font-semibold">Connection boundary</h2>
      <p className="mt-2 text-sm text-muted-foreground">Hermes remains the local executive/automation layer. VektorFlow remains the cloud orchestration backend. This page reports only what the public backend confirms.</p>
      <pre className="mt-4 overflow-auto rounded-lg bg-muted p-4 text-xs">{JSON.stringify(health, null, 2)}</pre>
    </div>
  </div>;
}
