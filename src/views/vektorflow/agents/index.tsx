import { useEffect, useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { getContentNode } from 'src/content/vektorflow-content';

const contentNode = getContentNode('vf-agents');
const pageTitle = contentNode?.title ?? 'vf-agents';
const API_BASE = 'https://vektorflow-15xr.onrender.com';

type Agent = { name: string; description: string; status?: string };

const DEPLOYED_AGENTS: Agent[] = [
  { name: 'Scout', description: 'Discovers winning products and market trends.' },
  { name: 'Source', description: 'Finds reliable suppliers and compares prices.' },
  { name: 'Price', description: 'Optimizes product pricing for maximum profit.' },
  { name: 'Fulfill', description: 'Manages inventory and automates order fulfillment.' },
  { name: 'Analyze', description: 'Analyzes sales, revenue, and business performance.' },
];

function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [connection, setConnection] = useState('Checking Render backend…');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/info`).then((res) => {
        if (!res.ok) throw new Error(`API info returned ${res.status}`);
        return res.json();
      }),
      fetch(`${API_BASE}/api/agent/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'status', params: {} }),
      }).then((res) => {
        if (!res.ok) throw new Error(`Agent command returned ${res.status}`);
        return res.json();
      }),
    ])
      .then(() => {
        setAgents(DEPLOYED_AGENTS.map((agent) => ({ ...agent, status: 'connected' })));
        setConnection('Render API + agent orchestrator connected');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setConnection('Render connection failed');
      });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <BreadcrumbComp title={pageTitle} />
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-2xl font-semibold">{pageTitle}</h2>
        <p className="mt-2 text-muted-foreground">
          Manage and monitor the agents deployed behind the VektorFlow Render API.
        </p>
        <p className="mt-4 text-sm font-medium">{connection}</p>
        {error && <p className="mt-2 text-destructive">{error}</p>}
        <div className="mt-6 grid gap-3">
          {agents.map((agent) => (
            <div key={agent.name} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="font-medium">{agent.name}</div>
                <span className="text-sm text-muted-foreground">{agent.status}</span>
              </div>
              <div className="text-sm text-muted-foreground">{agent.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgentsPage;
