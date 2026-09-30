import { useEffect, useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import VektorFlowNav from 'src/views/vektorflow/VektorFlowNav';

import { vektorflowGet } from 'src/api/vektorflow';

const HERMES_URL =
  (import.meta.env.VITE_HERMES_URL || 'https://hermes-cloud-fup1.onrender.com').replace(/\/+$/, '');

export default function HermesPage() {
  const [health, setHealth] = useState<any>(null);
  const [hermesOnline, setHermesOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vektorflowGet('/health')
      .then(setHealth)
      .catch(() => setHealth({ status: 'unreachable' }))
      .finally(() => setLoading(false));

    fetch(HERMES_URL, { method: 'GET', mode: 'no-cors' })
      .then(() => setHermesOnline(true))
      .catch(() => setHermesOnline(false));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <VektorFlowNav />
      <BreadcrumbComp title="Hermes" />

      <div className="rounded-2xl border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Hermes Cloud / VektorFlow Executive
        </p>
        <h1 className="mt-1 text-3xl font-bold">Hermes Control</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Live VektorFlow and Hermes controls. Hermes remains separately authenticated while
          this dashboard provides the operational connection point.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={HERMES_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Open Hermes Cloud
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">VektorFlow backend</p>
          <p className="mt-2 text-2xl font-semibold">
            {loading ? 'Checking…' : health?.status || 'Unknown'}
          </p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Backend version</p>
          <p className="mt-2 text-2xl font-semibold">{health?.version || '—'}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Hermes Cloud</p>
          <p className="mt-2 text-2xl font-semibold">
            {hermesOnline === null ? 'Checking…' : hermesOnline ? 'Online' : 'Unavailable'}
          </p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Service</p>
          <p className="mt-2 text-2xl font-semibold">{health?.powered_by || '—'}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Hermes Cloud Interface</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The live Hermes UI is hosted by Hermes Cloud. Use the authenticated interface below
              or open it in a new tab if the browser blocks cross-origin embedding.
            </p>
          </div>
          <a
            href={HERMES_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            New tab
          </a>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border bg-muted">
          <iframe
            title="Hermes Cloud"
            src={HERMES_URL}
            className="h-[720px] w-full"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <h2 className="text-lg font-semibold">VektorFlow connection</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The dashboard uses the deployed VektorFlow backend rather than localhost. Hermes Cloud
          is exposed separately so its credentials never have to be placed in the browser bundle.
        </p>
        <pre className="mt-4 overflow-auto rounded-lg bg-muted p-4 text-xs">
          {JSON.stringify({ vektorflow: health, hermes: HERMES_URL }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
