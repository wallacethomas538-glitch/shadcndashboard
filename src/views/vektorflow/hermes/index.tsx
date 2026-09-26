import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Hermes' },
];

function HermesPage() {
  return (
    <div className="flex flex-col gap-4">
      <BreadcrumbComp title="Hermes" items={BCrumb} />

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-2xl font-semibold">Hermes AI Executive</h2>
        <p className="mt-2 text-muted-foreground">
          Monitor Hermes, local automation, tools, model routing, and agent communication.
        </p>
      </div>
    </div>
  );
}

export default HermesPage;
