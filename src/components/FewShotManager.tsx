import { Check, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PILLAR_META } from '../data/presets';
import { ContentPillar, FewShotExample } from '../types';

interface FewShotManagerProps {
  examples: FewShotExample[];
  onToggleActive: (id: string) => void;
  onAddExample: (example: Omit<FewShotExample, 'id' | 'active'>) => void;
  onDeleteExample: (id: string) => void;
  onResetDefaults: () => void;
}

export function FewShotManager({
  examples,
  onToggleActive,
  onAddExample,
  onDeleteExample,
  onResetDefaults,
}: FewShotManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState<ContentPillar>('results');
  const [inputTopic, setInputTopic] = useState('');
  const [hookSample, setHookSample] = useState('');
  const [scriptSample, setScriptSample] = useState('');
  const [ctaSample, setCtaSample] = useState('');

  const activeCount = examples.filter((ex) => ex.active).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !hookSample.trim() || !scriptSample.trim()) return;
    onAddExample({
      title: title.trim(),
      pillar,
      inputTopic: inputTopic.trim() || title.trim(),
      hookSample: hookSample.trim(),
      scriptSample: scriptSample.trim(),
      ctaSample: ctaSample.trim() || 'DM-ə "IELTS" yaz, səviyyəni yoxlayaq.',
    });
    setTitle('');
    setInputTopic('');
    setHookSample('');
    setScriptSample('');
    setCtaSample('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Few-Shot Prompting</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums font-semibold text-blue-700">
              {activeCount} aktiv nümunə
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
            Özgülün danışıq tərzi və ssenari yaddaşı
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Burada aktiv saxladığınız 2–3 uğurlu ssenari nümunəsi hər yeni Reels yaradılarkən
            modelə göndərilir. Beləliklə, süni intellekt şablon cümlələr deyil, məhz{' '}
            <strong className="font-semibold text-slate-800">@summer.inspires</strong> üslubunda
            — səmimi, strategiyayönümlü və inandırıcı tonda yazır.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onResetDefaults}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Varsayılanlara qaytar</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm((s) => !s)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{showAddForm ? 'Formu bağla' : 'Öz Ssenarimi Əlavə Et'}</span>
          </button>
        </div>
      </section>

      {showAddForm ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-slate-900">
            Yeni Few-Shot Ssenari Nümunəsi
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Nümunə başlığı *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Məs: Speaking 6.0 -> 7.5 (3 həftə)"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Kontent Pilları
              </label>
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value as ContentPillar)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="results">Tələbə Nəticələri və Case Study-lər</option>
                <option value="traps">İmtahan Tələləri və Həllər</option>
                <option value="tips">Sürətli Bal Artıran İpucları</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              İstifadəçi ideyası / Giriş mövzusu
            </label>
            <input
              type="text"
              value={inputTopic}
              onChange={(e) => setInputTopic(e.target.value)}
              placeholder="Məs: Tələbəm imtahan stresini yenib Speaking-dən 7.5 aldı"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              İlk 3 saniyə Hook cümləsi *
            </label>
            <input
              type="text"
              required
              value={hookSample}
              onChange={(e) => setHookSample(e.target.value)}
              placeholder="Məs: Tələbəm ingilis dilini bildiyi halda niyə 6.0-da qalırdı?"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Uğurlu ssenari mətni (30–45 saniyə) *
            </label>
            <textarea
              required
              rows={4}
              value={scriptSample}
              onChange={(e) => setScriptSample(e.target.value)}
              placeholder="0–3 san: ... &#10;3–15 san: ... &#10;15–30 san: ... &#10;30–45 san: ..."
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              CTA nümunəsi
            </label>
            <input
              type="text"
              value={ctaSample}
              onChange={(e) => setCtaSample(e.target.value)}
              placeholder='Məs: Rəyə "IELTS" yaz, səviyyəni birlikdə yoxlayaq.'
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Üslub Yaddaşına Əlavə Et
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {examples.map((ex) => {
          const pillarInfo = PILLAR_META[ex.pillar];
          return (
            <article
              key={ex.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-colors ${
                ex.active
                  ? 'border-blue-600/40 bg-white'
                  : 'border-slate-200 bg-slate-50/60 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs text-slate-500">
                    <span>{pillarInfo.shortLabel}</span>
                    <span aria-hidden="true"> · </span>
                    <span className={ex.active ? 'font-semibold text-blue-700' : 'text-slate-500'}>
                      {ex.active ? 'Aktivdir' : 'Deaktiv'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteExample(ex.id)}
                    aria-label="Nümunəni sil"
                    className="cursor-pointer rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>

                <h2 className="mt-1.5 text-base font-bold text-slate-900">{ex.title}</h2>

                <div className="mt-3 space-y-2.5 text-xs">
                  <div>
                    <p className="font-semibold text-slate-500">Hook:</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-900">“{ex.hookSample}”</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">Ssenari ritmi:</p>
                    <p className="mt-0.5 whitespace-pre-line leading-relaxed text-slate-700">
                      {ex.scriptSample}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">CTA:</p>
                    <p className="mt-0.5 text-slate-800">{ex.ctaSample}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3.5">
                <button
                  type="button"
                  onClick={() => onToggleActive(ex.id)}
                  className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    ex.active
                      ? 'border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {ex.active ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Aktiv nümunədir (Deaktiv et)</span>
                    </>
                  ) : (
                    <span>Promptda İstifadə Et</span>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
