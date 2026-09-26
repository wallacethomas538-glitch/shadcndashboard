import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Agents' },
];

function AgentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <BreadcrumbComp title="Agents" items={BCrumb} />

      <div className="rounded-xl
border bg-card p-6">
        <h2 className="text-2xl font-semibold">VektorFlow Agents</h2>
        <p className="mt-2 text-muted-foreground">
          Manage and monitor your AI agents from one command center.
        </p>
      </div>
    </div>
  );
}

export default AgentsPage;
