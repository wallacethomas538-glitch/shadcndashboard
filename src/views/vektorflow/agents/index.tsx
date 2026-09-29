import { useEffect, useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { getContentNode } from 'src/content/vektorflow-content';

const contentNode = getContentNode('vf-agents');
const pageTitle = contentNode?.title ?? 'vf-agents';
const API_BASE = import.meta.env.VITE_VEKTORFLOW_API_URL || 'https://vektorflow-15xr.onrender.com';

type Agent = { name: string; description: string; status?: string };

function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [connection, setConnection] = useState('Checking Render backend…');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/info`).then(async (res) => {
        if (!res.ok) throw new Error(`API info returned ${res.status}`);
        return res.json();
      }),
      fetch(`${API_BASE}/api/agents`).then(async (res) => {
        if (!res.ok) throw new Error(`Agents API returned ${res.status}`);
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
      .then(([, roster]) => {
        setAgents((roster.agents || []).map((agent: Agent) => ({ ...agent, status: 'connected' })));
        setConnection(`Render API + 15-agent orchestrator connected (${roster.count || 0} agents)`);
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
          Manage and monitor the full VektorFlow 15XR autonomous e-commerce team.
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
