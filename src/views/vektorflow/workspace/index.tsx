import { useLocation } from 'react-router';
import { ArrowUpRight, Boxes, ChartNoAxesCombined, FlaskConical, GitBranch, KeyRound, LineChart, Package, Search, Settings, ShieldCheck, ShoppingCart, Store, TrendingUp, WalletCards, Workflow } from 'lucide-react';

const pages: Record<string,{title:string;description:string;icon:any;group:string}> = {
 '/vektorflow/products':{title:'Products',description:'Catalog intelligence, product discovery, opportunities, and product operations.',icon:Package,group:'Commerce'},
 '/vektorflow/inventory':{title:'Inventory',description:'Inventory visibility, alerts, replenishment planning, and operational readiness.',icon:Boxes,group:'Commerce'},
 '/vektorflow/sales':{title:'Sales',description:'Orders, revenue, conversion, customer demand, and sales operations.',icon:ShoppingCart,group:'Commerce'},
 '/vektorflow/stores':{title:'Stores',description:'Connected commerce platforms and store operations.',icon:Store,group:'Commerce'},
 '/vektorflow/marketing':{title:'Marketing',description:'Campaign planning, channel operations, and growth intelligence.',icon:TrendingUp,group:'Commerce'},
 '/vektorflow/content':{title:'Content',description:'Product copy, social content, offers, and conversion assets.',icon:LineChart,group:'Commerce'},
 '/vektorflow/trends':{title:'Trends',description:'Demand signals, emerging markets, and trend intelligence.',icon:LineChart,group:'Commerce'},
 '/vektorflow/competition':{title:'Competition',description:'Competitive intelligence, market gaps, and competitor monitoring.',icon:Search,group:'Intelligence'},
 '/vektorflow/finance':{title:'Profit & Finance',description:'Margins, unit economics, budgets, and financial control.',icon:WalletCards,group:'Commerce'},
 '/vektorflow/experiments':{title:'Experiments',description:'Controlled experiments, optimization, and pivot planning.',icon:FlaskConical,group:'Intelligence'},
 '/vektorflow/knowledge':{title:'Knowledge & Memory',description:'Shared context, memory, research, and cross-agent knowledge.',icon:BrainIcon,group:'Intelligence'},
 '/vektorflow/security':{title:'Security',description:'Security posture, access controls, and operational protection.',icon:ShieldCheck,group:'System'},
 '/vektorflow/governance':{title:'Governance',description:'Approval gates, policies, compliance, and decision controls.',icon:GitBranch,group:'Intelligence'},
 '/vektorflow/oracle':{title:'Oracle',description:'Forecasting, prioritization, and executive synthesis.',icon:ChartNoAxesCombined,group:'Intelligence'},
 '/vektorflow/integrations':{title:'Integrations',description:'Platforms, APIs, model providers, and external connections.',icon:Workflow,group:'System'},
 '/vektorflow/settings':{title:'Settings',description:'VektorFlow configuration and operating preferences.',icon:Settings,group:'System'},
};
function BrainIcon(){return <span/>}
export default function Workspace(){
 const {pathname}=useLocation(); const p=pages[pathname]??pages['/vektorflow/products']; const Icon=p.icon;
 return <div className="space-y-6">
  <div className="rounded-3xl border bg-card p-7 md:p-9"><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{p.group} · VEKTORFLOW 15XR</p><h1 className="mt-2 text-3xl font-bold">{p.title}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{p.description}</p></div><span className="rounded-2xl bg-muted p-3"><Icon className="h-6 w-6"/></span></div></div>
  <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border bg-card p-5"><p className="text-sm text-muted-foreground">Interface</p><p className="mt-2 text-xl font-semibold">Designed</p><p className="mt-1 text-xs text-muted-foreground">Live data wiring is intentionally deferred.</p></div><div className="rounded-2xl border bg-card p-5"><p className="text-sm text-muted-foreground">Data source</p><p className="mt-2 text-xl font-semibold">Not connected</p><p className="mt-1 text-xs text-muted-foreground">No fabricated metrics are displayed.</p></div><div className="rounded-2xl border bg-card p-5"><p className="text-sm text-muted-foreground">Next layer</p><p className="mt-2 text-xl font-semibold">Backend wiring</p><p className="mt-1 text-xs text-muted-foreground">Ready after the UI is approved.</p></div></div>
  <div className="rounded-2xl border bg-card p-6"><h2 className="text-lg font-semibold">Workspace template</h2><p className="mt-1 text-sm text-muted-foreground">This control surface is ready to receive real VektorFlow data, actions, tables, charts, and agent outputs without changing the navigation structure.</p><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{['Overview','Live data','Actions','History'].map((x)=><div key={x} className="rounded-xl border border-dashed p-5"><p className="font-medium">{x}</p><p className="mt-1 text-xs text-muted-foreground">Reserved interface</p><ArrowUpRight className="mt-5 h-4 w-4 text-muted-foreground"/></div>)}</div></div>
 </div>;
}