import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'LLM / Models' },
];

function ModelsPage() {
  return (
    <div className="flex flex-col gap-4">
      <BreadcrumbComp title="LLM / Models" items={BCrumb} />

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-2xl font-semibold">VektorFlow LLM / Models</h2>
        <p className="mt-2 text-muted-foreground">
          Manage AI models, providers, routing, and fallback settings.
        </p>
      </div>
    </div>
  );
}

export default ModelsPage;
