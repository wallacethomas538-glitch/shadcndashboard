import { FormEvent, useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

import { vektorflowPost } from 'src/api/vektorflow';

export default function AdsPage() {
  const [prompt, setPrompt] = useState('Create a premium commercial advertisement for VektorFlow AI, an autonomous AI commerce operating system. Show a sleek futuristic command center with multiple AI agents working together across glowing digital dashboards, product analytics, marketing automation, and business operations. Cinematic professional advertising style, polished technology aesthetic, high-end SaaS campaign quality, clean composition, visually striking, realistic advertising artwork. No people, no clutter, no watermark.');
  const [model, setModel] = useState('flux');
  const [size, setSize] = useState('1024x1024');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState('');

  async function generate(event: FormEvent) {
    event.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true); setError(''); setImage('');
    try {
      const data = await vektorflowPost('/api/ads/generate-image', { prompt: prompt.trim(), model, size });
      const url = data?.data?.[0]?.url;
      if (!url) throw new Error('The backend returned no image URL.');
      setImage(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  }

  return <div className="flex flex-col gap-5">
    <BreadcrumbComp title="Ad Studio" />
    <div className="rounded-2xl border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">AdSpecialist · Pollinations</p>
      <h1 className="mt-1 text-3xl font-bold">VektorFlow Ad Studio</h1>
      <p className="mt-2 max-w-3xl text-muted-foreground">Generate production-ready advertising imagery through the dedicated AdSpecialist capability. The Pollinations credential stays server-side and is never sent to the dashboard.</p>
    </div>
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={generate} className="rounded-2xl border bg-card p-5">
        <label className="text-sm font-medium">Campaign prompt</label>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="mt-2 min-h-56 w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Model<select value={model} onChange={e => setModel(e.target.value)} className="mt-2 w-full rounded-lg border bg-background p-2"><option value="flux">Flux</option></select></label>
          <label className="text-sm">Size<select value={size} onChange={e => setSize(e.target.value)} className="mt-2 w-full rounded-lg border bg-background p-2"><option>1024x1024</option><option>1536x1024</option><option>1024x1536</option></select></label>
        </div>
        <button disabled={loading || !prompt.trim()} className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50">{loading ? 'Generating…' : 'Generate advertisement'}</button>
        {error && <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
      </form>
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between"><h2 className="font-semibold">Creative output</h2>{image && <a className="text-sm underline" href={image} target="_blank" rel="noreferrer">Open image</a>}</div>
        <div className="mt-4 flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
          {image ? <img src={image} alt="Generated VektorFlow advertisement" className="h-auto max-h-[620px] w-full object-contain" /> : <p className="p-6 text-center text-sm text-muted-foreground">Your generated advertisement will appear here.</p>}
        </div>
      </div>
    </div>
  </div>;
}
