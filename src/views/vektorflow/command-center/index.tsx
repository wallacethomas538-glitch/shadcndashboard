import { Link } from 'react-router';
import type { ComponentType } from 'react';
import { ArrowUpRight, Bot, BrainCircuit, Image, MessageSquare, Network, ShieldCheck, Sparkles, Activity, Boxes, Workflow } from 'lucide-react';

const agents = ['Hawk','Smaug','Architect','DaVinci','Rook','Aegis','Arbiter','Sentinel','Echo','Cerebrum','ViralDet','Shadow','Bundler','Pivot','Oracle'];

const surfaces: Array<[string, string, string, ComponentType<{ className?: string }>]> = [
  ['Agents','Coordinate the 15-agent operating team.','/vektorflow/agents',Bot],
  ['LLM Studio','Talk directly with a selected model — separate from agents.','/vektorflow/llm',MessageSquare],
  ['Ad Studio','Create, review, and organize generated advertising creatives.','/vektorflow/ads',Image],
  ['Models','Model catalog, routing, context, and provider readiness.','/vektorflow/models',BrainCircuit],
  ['Workflows','Design and monitor repeatable commerce operations.','/vektorflow/experiments',Workflow],
  ['Commerce','Products, inventory, sales, stores, and financial control.','/vektorflow/products',Boxes],
];

export default function CommandCenter() {
  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-3xl border bg-card p-7 md:p-9">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-4 w-4" /> VEKTORFLOW 15XR · COMMAND CENTER
        </div>
        <div className="mt-4 max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Autonomous commerce, one control surface.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">A unified workspace for intelligence, agents, models, creative generation, workflows, and commerce operations. This UI is intentionally ready before live wiring.</p>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/vektorflow/llm" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><MessageSquare className="h-4 w-4"/> Open LLM Studio</Link>
          <Link to="/vektorflow/agents" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold hover:bg-muted"><Bot className="h-4 w-4"/> View agent team</Link>
        </div>
      </div>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[['System','Ready for wiring','Architecture surface'],['Agents','15 defined','Agent roster'],['LLM','Standalone studio','Direct model chat'],['Creative','Ad generation','Creative workspace']].map(([a,b,c],i)=><div key={a} className="rounded-2xl border bg-card p-5"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{a}</span>{[Activity,Bot,BrainCircuit,Image][i] && <span className="rounded-lg bg-muted p-2"><span className="sr-only">{a}</span>{(() => {const I=[Activity,Bot,BrainCircuit,Image][i]; return <I className="h-4 w-4"/>})()}</span>}</div><div className="mt-3 text-2xl font-bold">{b}</div><div className="mt-1 text-xs text-muted-foreground">{c}</div></div>)}
    </section>

    <section>
      <div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Control surfaces</p><h2 className="mt-1 text-2xl font-bold">Everything in one workspace</h2></div></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {surfaces.map(([name,desc,to,Icon])=><Link key={String(name)} to={String(to)} className="group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:bg-muted/40"><div className="flex items-start justify-between"><span className="rounded-xl bg-muted p-3"><Icon className="h-5 w-5"/></span><ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></div><h3 className="mt-5 font-semibold">{name}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{desc}</p></Link>)}
      </div>
    </section>

    <section className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
      <div className="rounded-2xl border bg-card p-5"><div className="flex items-center gap-2"><Network className="h-5 w-5"/><h2 className="font-semibold">Agent network</h2></div><p className="mt-1 text-sm text-muted-foreground">The complete 15-agent roster is represented here without pretending any live status is connected yet.</p><div className="mt-5 flex flex-wrap gap-2">{agents.map(a=><span key={a} className="rounded-full border px-3 py-1.5 text-xs font-medium">{a}</span>)}</div></div>
      <div className="rounded-2xl border bg-card p-5"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5"/><h2 className="font-semibold">Control principle</h2></div><p className="mt-3 text-sm leading-6 text-muted-foreground">The dashboard separates direct LLM conversation from agent execution. Live integrations will be wired only after this interface is approved.</p></div>
    </section>
  </div>;
}
