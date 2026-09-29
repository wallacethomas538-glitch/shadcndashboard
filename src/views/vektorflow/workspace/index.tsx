import { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

import { VEKTORFLOW_API_BASE, vektorflowGet, vektorflowPost } from 'src/api/vektorflow';

const API_BASE = VEKTORFLOW_API_BASE;

type ApiState = { loading: boolean; error: string; data: any };

const pages: Record<string, { title: string; description: string; endpoint?: string; method?: 'GET' | 'POST'; agent?: string }> = {
  '/': { title: 'Command Center', description: 'The VektorFlow 15XR operating view: live system state, agent coordination, tasks, alerts, and decisions.' },
  '/vektorflow/products': { title: 'Products', description: 'Product discovery, catalog research, niche analysis, and product opportunities.', endpoint: '/api/products/search', method: 'POST', agent: 'Scout' },
  '/vektorflow/inventory': { title: 'Inventory', description: 'Inventory checks, alerts, and reorder intelligence from the live VektorFlow backend.', endpoint: '/api/inventory/check', method: 'GET', agent: 'Rook' },
  '/vektorflow/sales': { title: 'Sales', description: 'Sales performance and order economics. Live sales data will appear when a commerce store is connected.' },
  '/vektorflow/marketing': { title: 'Marketing', description: 'Campaign planning, performance, and marketing operations.', endpoint: '/api/campaign/generate', method: 'POST', agent: 'ViralDet' },
  '/vektorflow/content': { title: 'Content', description: 'Organic content, product copy, offers, and conversion assets.', endpoint: '/api/content/organic', method: 'POST', agent: 'DaVinci' },
  '/vektorflow/trends': { title: 'Trends', description: 'Live trend intelligence and emerging demand signals.', endpoint: '/api/trends', method: 'GET', agent: 'ViralDet' },
  '/vektorflow/competition': { title: 'Competition', description: 'Competitive intelligence and market-gap monitoring powered by Shadow.', agent: 'Shadow' },
  '/vektorflow/finance': { title: 'Profit & Finance', description: 'Unit economics, margins, budgets, and treasury decisions owned by Smaug.', agent: 'Smaug' },
  '/vektorflow/stores': { title: 'Stores', description: 'Connected commerce platforms and store operations. No store data is shown until a real connection exists.', endpoint: '/api/info', method: 'GET', agent: 'Rook' },
  '/vektorflow/experiments': { title: 'Experiments', description: 'Controlled experiments, pivots, and optimization decisions.', agent: 'Pivot' },
  '/vektorflow/knowledge': { title: 'Knowledge & Memory', description: 'Shared context, memory, and cross-agent synthesis.', agent: 'Cerebrum' },
  '/vektorflow/security': { title: 'Security', description: 'Security, risk, authentication, and operational protection.', endpoint: '/health', method: 'GET', agent: 'Aegis / Sentinel' },
  '/vektorflow/governance': { title: 'Governance', description: 'Approval gates, policy review, compliance, and decision controls.', agent: 'Arbiter' },
  '/vektorflow/oracle': { title: 'Oracle', description: 'Forecasts, priorities, and executive synthesis from team evidence.', agent: 'Oracle' },
  '/vektorflow/integrations': { title: 'Integrations', description: 'External platforms, APIs, model providers, and commerce connections.' },
  '/vektorflow/settings': { title: 'Settings', description: 'VektorFlow configuration and operational preferences.' },
};

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">{text}</div>;
}

function Workspace() {
  const location = useLocation();
  const config = pages[location.pathname] ?? pages['/'];
  const [state, setState] = useState<ApiState>({ loading: false, error: '', data: null });
  const [command, setCommand] = useState('');
  const [result, setResult] = useState<any>(null);

  const isCommandCenter = location.pathname === '/';

  const load = async (endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
    setState({ loading: true, error: '', data: null });
    try {
      const data = method === 'POST' ? await vektorflowPost(endpoint, body ?? {}) : await vektorflowGet(endpoint);
      setState({ loading: false, error: '', data });
      return data;
    } catch (e) {
      setState({ loading: false, error: e instanceof Error ? e.message : String(e), data: null });
    }
  };

  useEffect(() => {
    if (isCommandCenter) {
      Promise.all([
        vektorflowGet('/health'),
        vektorflowGet('/api/info'),
        vektorflowGet('/api/agents'),
        vektorflowGet('/api/tasks').catch(() => null),
        vektorflowGet('/api/inventory/alerts').catch(() => null),
      ]).then(([health, info, agents, tasks, alerts]) => setState({ loading: false, error: '', data: { health, info, agents, tasks, alerts } }))
        .catch(e => setState({ loading: false, error: e instanceof Error ? e.message : String(e), data: null }));
    } else if (config.endpoint && config.method === 'GET') {
      load(config.endpoint, config.method);
    }
  }, [location.pathname]);

  const agentCount = state.data?.agents?.count ?? state.data?.info?.agent_count ?? '—';

  const runCommand = async () => {
    if (!command.trim()) return;
    setResult(null);
    try {
      const data = await vektorflowPost('/api/agents/run', { goal: command.trim() });
      setResult(data);
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : String(e) });
    }
  };

  const quickLinks = useMemo(() => [
    ['Products', '/vektorflow/products'], ['Inventory', '/vektorflow/inventory'], ['Sales', '/vektorflow/sales'],
    ['Marketing', '/vektorflow/marketing'], ['Trends', '/vektorflow/trends'], ['Profit & Finance', '/vektorflow/finance'], ['Ad Studio', '/vektorflow/ads'],
  ], []);

  return (
    <div className="flex flex-col gap-5">
      <BreadcrumbComp title={config.title} />
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">VektorFlow 15XR</p>
            <h1 className="mt-1 text-3xl font-bold">{config.title}</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">{config.description}</p>
          </div>
          {config.agent && <span className="rounded-full border px-3 py-1 text-xs font-medium">Primary agent: {config.agent}</span>}
        </div>
      </div>

      {isCommandCenter ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Backend', state.data?.health?.status ?? 'Checking…', 'Live health endpoint'],
              ['Agents', agentCount, 'Registered in backend'],
              ['Service', state.data?.info?.service ?? '—', 'Backend identity'],
              ['Mode', state.data?.info?.demo_mode === true ? 'Demo' : 'Live / configured', 'Reported by API'],
            ].map(([label, value, note]) => <div key={label} className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold">{String(value)}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div>)}
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h2 className="text-lg font-semibold">Command the team</h2>
            <p className="mt-1 text-sm text-muted-foreground">Send a real goal to the VektorFlow team orchestrator. Results are shown only when the backend executes them.</p>
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <input value={command} onChange={e => setCommand(e.target.value)} onKeyDown={e => e.key === 'Enter' && runCommand()} className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2" placeholder="Example: research a promising product niche" />
              <button onClick={runCommand} className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground">Run team goal</button>
            </div>
            {result && <pre className="mt-4 max-h-72 overflow-auto rounded-lg bg-muted p-4 text-xs">{JSON.stringify(result, null, 2)}</pre>}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-5">
              <h2 className="font-semibold">Operational signals</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span>Tasks endpoint</span><span>{state.data?.tasks ? 'Available' : 'No task data reported'}</span></div>
                <div className="flex justify-between"><span>Inventory alerts</span><span>{state.data?.alerts ? 'Available' : 'No alert data reported'}</span></div>
                <div className="flex justify-between"><span>Agent roster</span><span>{state.data?.agents ? `${state.data.agents.count ?? 0} registered` : 'Unavailable'}</span></div>
              </div>
            </div>
            <div className="rounded-xl border p-5">
              <h2 className="font-semibold">Business control surfaces</h2>
              <div className="mt-4 flex flex-wrap gap-2">{quickLinks.map(([label, href]) => <Link key={href} to={href} className="rounded-lg border px-3 py-2 text-sm hover:bg-muted">{label}</Link>)}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {state.loading && <EmptyState text="Loading live VektorFlow data…" />}
          {state.error && <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 text-sm text-destructive">{state.error}</div>}
          {state.data && <pre className="max-h-[28rem] overflow-auto rounded-xl border bg-muted p-5 text-xs">{JSON.stringify(state.data, null, 2)}</pre>}
          {!state.loading && !state.error && !state.data && !config.endpoint && (
            <EmptyState text="This control surface is ready, but no live data source is connected yet. VektorFlow will not display fabricated business metrics." />
          )}
          {config.endpoint && config.method === 'POST' && (
            <div className="rounded-xl border p-5">
              <h2 className="font-semibold">Execute {config.title.toLowerCase()} action</h2>
              <p className="mt-1 text-sm text-muted-foreground">This sends a real request to the VektorFlow backend. No fake result is generated in the dashboard.</p>
              <button onClick={() => load(config.endpoint!, 'POST', {
                ...(config.endpoint === '/api/products/search' ? { keyword: 'current product opportunities' } : {}),
                ...(config.endpoint === '/api/campaign/generate' ? { product_type: 'ecommerce product', goal: 'create a campaign', target_audience: 'online shoppers', channels: ['social'], budget: 1000, timeline_days: 30 } : {}),
                ...(config.endpoint === '/api/content/organic' ? { product_name: 'VektorFlow product', product_description: 'AI commerce operating system', platforms: ['instagram'], tone: 'professional', number_of_options: 3 } : {}),
              })} className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground">Run backend action</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Workspace;
