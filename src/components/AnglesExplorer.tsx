import { ArrowRight, Compass, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FUNNEL_GOAL_META, PILLAR_META } from '../data/presets';
import { ContentPillar, FunnelGoal, ScenarioAngle } from '../types';

interface AnglesExplorerProps {
  angles: ScenarioAngle[];
  isLoading: boolean;
  error: string | null;
  onGenerateAngles: (focusArea: string) => Promise<void>;
  onSelectAngleToWrite: (angle: ScenarioAngle) => void;
}

export function AnglesExplorer({
  angles,
  isLoading,
  error,
  onGenerateAngles,
  onSelectAngleToWrite,
}: AnglesExplorerProps) {
  const [focusArea, setFocusArea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateAngles(focusArea);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Etibar və səmimi satış gətirən ssenari bucaqları
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Yalnız quru qayda izah edən postlar əvəzinə, tələbə və valideynlərdə etibar yaradan
            bucaqları seçin: dərs içi real düzəlişlər, əvvəlki kurslardan məyus qalanların
            şübhələri və səmimi qrup dəvətləri.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            placeholder="Məsələn: Dərs içi etibar yaradan ideya ver, yaxud kursa inamı qırılan tələbələr..."
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Bucaqlar hazırlanır...</span>
              </>
            ) : (
              <>
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>5 Fərqli Bucaq Təklif Et</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Tez fokuslar:</span>
          {[
            'Dərs içi real səhv düzəlişi',
            'Əvvəlki kursdan məyus olan tələbələr',
            'Tələbə nəticəsi üçün ideya ver',
            'Səmimi qrup elanı və valideyn etibarı',
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setFocusArea(preset);
                onGenerateAngles(preset);
              }}
              className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-white"
            >
              {preset}
            </button>
          ))}
        </div>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {angles.map((angle, idx) => {
          const pillarInfo = PILLAR_META[angle.pillar as ContentPillar] ?? PILLAR_META.results;
          const funnelInfo = angle.funnelGoal
            ? FUNNEL_GOAL_META[angle.funnelGoal as FunnelGoal]
            : null;
          return (
            <article
              key={angle.id || idx}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-semibold tabular-nums text-blue-700">
                    0{idx + 1}.
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{pillarInfo.shortLabel}</span>
                  {funnelInfo ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-700">{funnelInfo.shortLabel}</span>
                    </>
                  ) : null}
                </div>

                <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-900">
                  {angle.angleTitle}
                </h2>

                <dl className="mt-4 space-y-2.5 text-sm">
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">Hədəf tələbə</dt>
                    <dd className="mt-0.5 text-slate-800">{angle.targetAudience}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">Əsas qorxu / problem</dt>
                    <dd className="mt-0.5 text-slate-600">{angle.corePainPoint}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">Etibar yaradan xətt</dt>
                    <dd className="mt-0.5 text-slate-700">{angle.strategyHook}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => onSelectAngleToWrite(angle)}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  <span>Bu bucaqla ssenari yaz</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
