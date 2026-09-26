import { useEffect, useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Agents' },
];

type Agent = Record<string, unknown>;

function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_VEKTORFLOW_API_URL}/api/v1/agents`)
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then((data) => setAgents(Array.isArray(data) ? data : data.agents ?? []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <BreadcrumbComp title="Agents" items={BCrumb} />

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-2xl font-semibold">VektorFlow Agents</h2>
        <p className="mt-2 text-muted-foreground">
          Manage and monitor your AI agents from one command center.
        </p>

        {error && <p className="mt-4 text-destructive">{error}</p>}

        <div className="mt-6 grid gap-3">
          {agents.map((agent, index) => (
            <div key={String(agent.id ?? agent.name ?? index)} className="rounded-lg border p-4">
              <div className="font-medium">
                {String(agent.name ?? agent.id ?? `Agent ${index + 1}`)}
              </div>
              <div className="text-sm text-muted-foreground">
                {String(agent.description ?? 'VektorFlow agent')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgentsPage;
