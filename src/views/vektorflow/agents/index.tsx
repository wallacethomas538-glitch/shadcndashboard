import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import VektorFlowNav from 'src/views/vektorflow/VektorFlowNav';
import { vektorflowGet, vektorflowPost } from 'src/api/vektorflow';

type Agent = { name: string; description: string; status?: string; tools?: string[] };
type Message = { role: 'user' | 'agent'; text: string };
type ToolResult = { tool: string; result: unknown; status: string };

export default function AgentsPage() {
  const { agentName } = useParams();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [connection, setConnection] = useState('Checking VektorFlow backend…');
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [toolRunning, setToolRunning] = useState('');
  const [toolResults, setToolResults] = useState<ToolResult[]>([]);

  const selectedName = useMemo(() => agentName ? decodeURIComponent(agentName).toLowerCase() : '', [agentName]);
  const selected = agents.find((agent) => agent.name.toLowerCase() === selectedName);

  useEffect(() => {
    vektorflowGet('/api/agents').then((roster) => {
      const next = roster.agents || [];
      setAgents(next);
      setConnection(`Live backend · ${roster.count || next.length} agents`);
      if (!agentName && next[0]) navigate(`/vektorflow/agents/${encodeURIComponent(next[0].name)}`, { replace: true });
    }).catch((err) => {
      setError(err instanceof Error ? err.message : String(err));
      setConnection('Backend connection failed');
    });
  }, [agentName, navigate]);

  useEffect(() => {
    if (selected) {
      setMessages([{ role: 'agent', text: `I am ${selected.name}. ${selected.description} What would you like me to work on?` }]);
      setToolResults([]);
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
      const data = await vektorflowPost(`/api/agents/${encodeURIComponent(selected.name)}/chat`, { message, conversation_history: history });
      const result = data?.result || {};
      setMessages((current) => [...current, { role: 'agent', text: result.message || result.response || JSON.stringify(result, null, 2) }]);
    } catch (err) {
      setMessages((current) => [...current, { role: 'agent', text: `Error: ${err instanceof Error ? err.message : String(err)}` }]);
    } finally {
      setSending(false);
    }
  };

  const runTool = async (tool: string) => {
    if (!selected || toolRunning) return;
    setToolRunning(tool);
    try {
      const data = await vektorflowPost(`/api/agents/${encodeURIComponent(selected.name)}/tools/${encodeURIComponent(tool)}`, { arguments: {} });
      setToolResults((current) => [{ tool, result: data?.result, status: 'completed' }, ...current]);
    } catch (err) {
      setToolResults((current) => [{ tool, result: err instanceof Error ? err.message : String(err), status: 'failed' }, ...current]);
    } finally {
      setToolRunning('');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <VektorFlowNav />
      <BreadcrumbComp title="VektorFlow Agents" />
      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <section className="rounded-xl border bg-card p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">15-Agent Command Team</h2>
            <p className="text-sm text-muted-foreground">{connection}</p>
          </div>
          <div className="grid max-h-[720px] gap-2 overflow-y-auto">
            {agents.map((agent) => {
              const active = agent.name.toLowerCase() === selectedName;
              return <Link key={agent.name} to={`/vektorflow/agents/${encodeURIComponent(agent.name)}`}
                className={`rounded-lg border p-3 transition ${active ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-xs text-muted-foreground">{agent.status || 'idle'}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{agent.description}</p>
              </Link>;
            })}
          </div>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        </section>

        <section className="flex min-h-[720px] flex-col gap-4">
          {selected ? <>
            <div className="rounded-xl border bg-card p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Agent Workspace</p>
                  <h2 className="mt-1 text-2xl font-semibold">{selected.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.description}</p></div>
                <span className="rounded-full border px-3 py-1 text-xs">{selected.status || 'idle'}</span>
              </div>
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Operational tools</p>
                <div className="flex flex-wrap gap-2">
                  {(selected.tools || []).map((tool) => <button key={tool} onClick={() => runTool(tool)} disabled={!!toolRunning}
                    className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50">
                    {toolRunning === tool ? 'Running…' : tool}
                  </button>)}
                  {!selected.tools?.length && <span className="text-xs text-muted-foreground">No executable tools reported by backend.</span>}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
              <section className="flex min-h-[560px] flex-col rounded-xl border bg-card">
                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                  {messages.map((message, index) => <div key={index} className={`max-w-[85%] rounded-xl p-3 text-sm ${message.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'}`}><p className="whitespace-pre-wrap">{message.text}</p></div>)}
                  {sending && <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">Working…</div>}
                </div>
                <form onSubmit={sendMessage} className="border-t p-4">
                  <div className="flex gap-2">
                    <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={`Talk directly to ${selected.name}…`} className="min-w-0 flex-1 rounded-lg border bg-background px-4 py-3 text-sm outline-none" disabled={sending} />
                    <button type="submit" disabled={sending || !input.trim()} className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50">{sending ? 'Working…' : 'Send'}</button>
                  </div>
                </form>
              </section>

              <section className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold">Tool activity</h3>
                <p className="mt-1 text-xs text-muted-foreground">Real executions returned by the VektorFlow backend.</p>
                <div className="mt-4 space-y-3">
                  {toolResults.map((item, index) => <div key={index} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between"><span className="text-xs font-semibold">{item.tool}</span><span className="text-xs text-muted-foreground">{item.status}</span></div>
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-[11px]">{JSON.stringify(item.result, null, 2)}</pre>
                  </div>)}
                  {!toolResults.length && <div className="rounded-lg border border-dashed p-5 text-center text-xs text-muted-foreground">Run a tool above to see its live result.</div>}
                </div>
              </section>
            </div>
          </> : <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Loading the live agent roster…</div>}
        </section>
      </div>
    </div>
  );
}
