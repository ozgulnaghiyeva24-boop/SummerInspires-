import { ArrowUpRight, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PILLAR_META } from '../data/presets';
import { ContentPillar, ReelPackage } from '../types';

interface ArchiveViewProps {
  savedReels: ReelPackage[];
  onOpenReel: (reel: ReelPackage) => void;
  onDeleteReel: (id: string) => void;
  onGoToStudio: () => void;
}

export function ArchiveView({
  savedReels,
  onOpenReel,
  onDeleteReel,
  onGoToStudio,
}: ArchiveViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pillarFilter, setPillarFilter] = useState<'all' | ContentPillar>('all');

  const filteredReels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return savedReels.filter((item) => {
      const matchesPillar = pillarFilter === 'all' || item.pillar === pillarFilter;
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.sourceTopic.toLowerCase().includes(q) ||
        item.hooks.some((h) => h.toLowerCase().includes(q));
      return matchesPillar && matchesSearch;
    });
  }, [savedReels, searchQuery, pillarFilter]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Saxlanılan Reels Ssenariləri
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Çəkilişə hazır ssenariləriniz, Hook variantları və caption arxivi.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ssenari və ya mövzu axtar..."
                className="w-full sm:w-64 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'Hamısı' },
                  { id: 'results', label: 'Nəticələr' },
                  { id: 'traps', label: 'Tələlər' },
                  { id: 'tips', label: 'İpucları' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPillarFilter(tab.id)}
                  className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    pillarFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {filteredReels.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-base font-bold text-slate-900">
            {savedReels.length === 0
              ? 'Hələ saxlanılan Reels ssenarisi yoxdur'
              : 'Axtarışa uyğun ssenari tapılmadı'}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {savedReels.length === 0
              ? 'Studiyada yeni ssenari yaradın və "Arxivə Saxla" düyməsi ilə bura əlavə edin.'
              : 'Axtarış sözünü və ya pillar filtrini dəyişin.'}
          </p>
          <button
            type="button"
            onClick={onGoToStudio}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Ssenari Studiyasına Keç
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredReels.map((item) => {
            const pillarShort = PILLAR_META[item.pillar]?.shortLabel ?? item.pillarLabel;
            const dateText = new Date(item.createdAt).toLocaleDateString('az-AZ', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{pillarShort}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{item.estimatedDuration}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{dateText}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteReel(item.id)}
                      aria-label="Ssenarini sil"
                      className="cursor-pointer rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    Hook: “{item.hooks[0]}”
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500">
                    CTA: <span className="font-mono font-semibold text-slate-800">{item.cta.dmKeyword}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenReel(item)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    <span>Studiyada Aç</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
