import { Link, useLocation } from 'react-router';

const pages = [
  ['Command Center', '/'],
  ['Agents', '/vektorflow/agents'],
  ['Hermes', '/vektorflow/hermes'],
  ['Models', '/vektorflow/models'],
  ['Ad Studio', '/vektorflow/ads'],
  ['Products', '/vektorflow/products'],
  ['Inventory', '/vektorflow/inventory'],
  ['Sales', '/vektorflow/sales'],
  ['Stores', '/vektorflow/stores'],
  ['Marketing', '/vektorflow/marketing'],
  ['Content', '/vektorflow/content'],
  ['Trends', '/vektorflow/trends'],
  ['Competition', '/vektorflow/competition'],
  ['Finance', '/vektorflow/finance'],
  ['Experiments', '/vektorflow/experiments'],
  ['Knowledge', '/vektorflow/knowledge'],
  ['Security', '/vektorflow/security'],
  ['Governance', '/vektorflow/governance'],
  ['Oracle', '/vektorflow/oracle'],
  ['Integrations', '/vektorflow/integrations'],
  ['Settings', '/vektorflow/settings'],
] as const;

export default function VektorFlowNav() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="VektorFlow pages" className="w-full rounded-xl border bg-background p-2">
      <div className="flex gap-1 overflow-x-auto whitespace-nowrap">
        {pages.map(([label, path]) => {
          const active = path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
