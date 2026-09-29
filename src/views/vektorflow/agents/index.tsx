import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { getContentNode } from 'src/content/vektorflow-content';

const contentNode = getContentNode('vf-agents');
const pageTitle = contentNode?.title ?? 'VektorFlow Agents';
import { VEKTORFLOW_API_BASE, vektorflowGet, vektorflowPost } from 'src/api/vektorflow';

const API_BASE = VEKTORFLOW_API_BASE;

type Agent = { name: string; description: string; status?: string; tools?: string[] };
type Message = { role: 'user' | 'agent'; text: string };

function AgentsPage() {
  const { agentName } = useParams();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [connection, setConnection] = useState('Checking Render backend…');
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const selectedName = useMemo(() => {
    if (!agentName) return '';
    return decodeURIComponent(agentName).toLowerCase();
  }, [agentName]);

  const selected = agents.find((agent) => agent.name.toLowerCase() === selectedName);

  useEffect(() => {
    fetch(`${API_BASE}/api/agents`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Agents API returned ${res.status}`);
        return res.json();
      })
      .then((roster) => {
        const nextAgents = roster.agents || [];
        setAgents(nextAgents);
        setConnection(`Render API + 15-agent orchestrator connected (${roster.count || nextAgents.length} agents)`);
        if (!agentName && nextAgents[0]) navigate(`/vektorflow/agents/${encodeURIComponent(nextAgents[0].name)}`, { replace: true });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setConnection('Render connection failed');
      });
  }, [agentName, navigate]);

  useEffect(() => {
    if (selected) {
      setMessages([{ role: 'agent', text: `I am ${selected.name}. ${selected.description} What would you like me to work on?` }]);
      setInput('');
    }
  }, [selected?.name]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || !selected || sending) return;
    setSending(true);
    setMessages((current) => [...current, { role: 'user', text: message }]);
    setInput('');
    try {
      const history = messages.map((item) => ({ role: item.role, content: item.text }));
      const res = await fetch(`${API_BASE}/api/agents/${encodeURIComponent(selected.name)}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversation_history: history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || `Agent returned ${res.status}`);
      const result = data.result || {};
      const text = result.message || result.response || JSON.stringify(result, null, 2);
      setMessages((current) => [...current, { role: 'agent', text }]);
    } catch (err) {
      setMessages((current) => [...current, { role: 'agent', text: `Error: ${err instanceof Error ? err.message : String(err)}` }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <BreadcrumbComp title={pageTitle} />
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <section className="rounded-xl border bg-card p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Agents</h2>
            <p className="text-sm text-muted-foreground">{connection}</p>
          </div>
          <div className="grid gap-2">
            {agents.map((agent) => {
              const active = agent.name.toLowerCase() === selectedName;
              return (
                <Link
                  key={agent.name}
                  to={`/vektorflow/agents/${encodeURIComponent(agent.name)}`}
                  className={`rounded-lg border p-3 transition ${active ? 'bg-muted' : 'hover:bg-muted/50'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-xs text-muted-foreground">{agent.status || 'idle'}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{agent.description}</p>
                </Link>
              );
            })}
          </div>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        </section>

        <section className="flex min-h-[650px] flex-col rounded-xl border bg-card">
          {selected ? (
            <>
              <div className="border-b p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{selected.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{selected.description}</p>
                  </div>
                  <span className="rounded-full border px-3 py-1 text-xs">{selected.status || 'idle'}</span>
                </div>
                {selected.tools?.length ? (
                  <p className="mt-3 text-xs text-muted-foreground">Tools: {selected.tools.join(' · ')}</p>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">Reasoning agent · connected to the VektorFlow LLM gateway</p>
                )}
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.map((message, index) => (
                  <div key={index} className={`max-w-[85%] rounded-xl p-3 text-sm ${message.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                ))}
                {sending && <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">Working…</div>}
              </div>

              <form onSubmit={sendMessage} className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={`Talk directly to ${selected.name}…`}
                    className="min-w-0 flex-1 rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2"
                    disabled={sending}
                  />
                  <button type="submit" disabled={sending || !input.trim()} className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50">
                    {sending ? 'Working…' : 'Send'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground">
              Select an agent to open its individual workspace.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AgentsPage;
