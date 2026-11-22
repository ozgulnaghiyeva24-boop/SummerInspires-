import {
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  Film,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { EditSuggestion, ReelPackage } from '../types';

interface ReelOutputViewProps {
  reel: ReelPackage;
  selectedHookIndex: number;
  onSelectHook: (idx: number) => void;
  selectedScreenTextIndex: number;
  onSelectScreenText: (idx: number) => void;
  onSaveToArchive: (reel: ReelPackage) => void;
  isSaved: boolean;
  onRefine: (instruction: string) => Promise<void>;
  isRefining: boolean;
  editIdeas: EditSuggestion[];
  isEditIdeasLoading: boolean;
  editIdeasError: string | null;
  editSentence: string;
  onEditSentenceChange: (value: string) => void;
  onRequestEditIdeas: (sentence: string) => Promise<void>;
}

export function ReelOutputView({
  reel,
  selectedHookIndex,
  onSelectHook,
  selectedScreenTextIndex,
  onSelectScreenText,
  onSaveToArchive,
  isSaved,
  onRefine,
  isRefining,
  editIdeas,
  isEditIdeasLoading,
  editIdeasError,
  editSentence,
  onEditSentenceChange,
  onRequestEditIdeas,
}: ReelOutputViewProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const editFinderRef = useRef<HTMLDivElement>(null);

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1800);
    } catch {
      // Clipboard fallback ignored silently if blocked
    }
  };

  const activeHook = reel.hooks[selectedHookIndex] ?? reel.hooks[0] ?? '';

  const buildFullText = () => {
    const hooksBlock = reel.hooks.map((h, i) => `${i + 1}) ${h}`).join('\n');
    const scriptBlock = reel.scriptSegments
      .map((seg, i) => {
        const text = i === 0 ? activeHook : seg.spokenText;
        const editLine = seg.visualInsertIdea
          ? `\n(Montaj: ${seg.editDirection || ''} | Kadr/Meme: ${seg.visualInsertIdea} | Axtarış: ${seg.searchKeyword || ''})`
          : '';
        return `[${seg.timeRange} — ${seg.label}]\n${text}\n(Qeyd: ${seg.deliveryNote})${editLine}`;
      })
      .join('\n\n');

    const dmRepliesBlock = reel.cta.dmReplies
      ? `\n\nSəmimi DM Cavab Dialoqu:\n1) İlk cavab: ${reel.cta.dmReplies.firstReply}\n2) Sual: ${reel.cta.dmReplies.followUpQuestion}\n3) Dəvət: ${reel.cta.dmReplies.bookingInvite}`
      : '';

    return `${reel.title}
Kontent Pilları: ${reel.pillarLabel}${reel.funnelGoalLabel ? ` · Məqsəd: ${reel.funnelGoalLabel}` : ''} · Müddət: ${reel.estimatedDuration}

1. HOOK (İlk 3 saniyə)
${hooksBlock}

2. VİDEO SSENARİSİ VƏ MONTAJ XƏRİTƏSİ (30-45 saniyə)
${scriptBlock}

3. VİZUAL VƏ KADR QEYDLƏRİ
Sosial Sübut:
${reel.visualAndBroll.socialProof.map((item) => `- ${item}`).join('\n')}

Ekranda Yazılacaq Mətnlər:
${reel.visualAndBroll.onScreenText.map((item) => `- ${item}`).join('\n')}

B-Roll / Kadr İdeyaları:
${reel.visualAndBroll.brollIdeas.map((item) => `- ${item}`).join('\n')}

4. CTA (Tələbə Cəlbi)
${reel.cta.spokenCta}
Açar söz: ${reel.cta.dmKeyword}${dmRepliesBlock}

5. CAPTION VƏ HƏŞTƏQLƏR
${reel.captionAndHashtags.caption}

${reel.captionAndHashtags.hashtags.join(' ')}`;
  };

  const renderCopyButton = (key: string, text: string, label = 'Kopyala') => {
    const copied = copiedKey === key;
    return (
      <button
        type="button"
        onClick={() => copyText(key, text)}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap shrink-0"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span className="text-emerald-700">Kopyalandı</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  };

  const handleFindEditForSentence = async (sentence: string) => {
    onEditSentenceChange(sentence);
    editFinderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await onRequestEditIdeas(sentence);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      {/* Top Result Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{reel.pillarLabel}</span>
            {reel.funnelGoalLabel ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-blue-700">{reel.funnelGoalLabel}</span>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{reel.estimatedDuration}</span>
            {reel.targetBand ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{reel.targetBand}</span>
              </>
            ) : null}
          </div>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900">
            {reel.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => copyText('full', buildFullText())}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            {copiedKey === 'full' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700">Tam Paket Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                <span>Tam Paketi Kopyala</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSaveToArchive(reel)}
            disabled={isSaved}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              isSaved
                ? 'border border-slate-200 bg-slate-50 text-slate-600 cursor-default'
                : 'cursor-pointer bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span>Arxivdədir</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Arxivə Saxla</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Refinement Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-3">
        <span className="text-xs font-medium text-slate-600">
          Sürətli redaktə:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {[
            {
              label: 'Daha səmimi və təbii et',
              instruction:
                'Ssenarini və CTA-nı daha da səmimi, qayğıkeş və insanı yormayan təbii danışıq tonuna gətir. Satış cümləsi hiss olunmasın, mentor qayğısı hiss olunsun.',
            },
            {
              label: 'Dərs içi etibarı gücləndir',
              instruction:
                'Müəllimin real dərsdə tələbənin səhvini necə gördüyünü və düzəltdiyini daha aydın göstər ki, izləyici niyə məhz Özgül müəllimlə hazırlaşmalı olduğunu anlasın.',
            },
            {
              label: 'Daha qısa et (30 san)',
              instruction:
                'Ssenarini daha dinamik və yığcam et, ümumi oxunuş müddəti 30 saniyəni keçməsin.',
            },
            {
              label: 'Yeni 3 Hook yaz',
              instruction:
                'Ssenarinin əsasını saxla, amma ilk 3 saniyə üçün empatiya və etibar yaradan tam fərqli 3 yeni Hook təklif et.',
            },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              disabled={isRefining}
              onClick={() => onRefine(action.instruction)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw
                className={`h-3 w-3 text-slate-500 ${isRefining ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {/* 1. HOOK */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                01. Hook — İlk 3 saniyə (Diqqət və Etibar)
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Önizləmədə və ssenarinin girişində görmək istədiyiniz variantı seçin.
              </p>
            </div>
            {renderCopyButton(
              'hooks',
              reel.hooks.map((h, i) => `${i + 1}. ${h}`).join('\n'),
              'Hamısını kopyala'
            )}
          </div>

          <div className="mt-4 space-y-2.5">
            {reel.hooks.map((hook, idx) => {
              const isSelected = idx === selectedHookIndex;
              return (
                <div
                  key={`${idx}-${hook.slice(0, 16)}`}
                  className={`flex items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectHook(idx)}
                    className="flex flex-1 cursor-pointer items-start gap-3 text-left"
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-mono font-semibold tabular-nums ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed font-medium text-slate-900">
                      “{hook}”
                    </span>
                  </button>
                  {renderCopyButton(`hook-${idx}`, hook, 'Kopyala')}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. VİDEO SSENARİSİ + MONTAJ XƏRİTƏSİ */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                02. Video Ssenarisi və Saniyə-Saniyə Montaj Bələdçisi (30–45 san)
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Hər cümləni deyərkən hansı kəsim, kadr və ya meme göstərməli olduğunuzu görün.
              </p>
            </div>
            {renderCopyButton(
              'script',
              reel.scriptSegments
                .map((seg, i) => `[${seg.timeRange}] ${i === 0 ? activeHook : seg.spokenText}`)
                .join('\n\n'),
              'Ssenarini kopyala'
            )}
          </div>

          <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
            {reel.scriptSegments.map((seg, idx) => {
              const spoken = idx === 0 ? activeHook : seg.spokenText;
              return (
                <div
                  key={`${seg.timeRange}-${idx}`}
                  className="grid gap-4 p-4 sm:grid-cols-[140px_1fr]"
                >
                  <div>
                    <p className="font-mono text-xs font-semibold tabular-nums text-blue-700">
                      {seg.timeRange}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-600">
                      {seg.label}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[15px] leading-relaxed text-slate-900">
                        {spoken}
                      </p>
                      <p className="mt-1.5 text-xs text-slate-500">
                        Danışıq tonu: {seg.deliveryNote}
                      </p>
                    </div>

                    {seg.visualInsertIdea ? (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2 text-slate-600">
                            <span className="font-semibold text-slate-900">
                              {seg.visualInsertType || 'Kadr / Meme İdeyası'}
                            </span>
                            {seg.editDirection ? (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{seg.editDirection}</span>
                              </>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleFindEditForSentence(spoken)}
                            className="inline-flex cursor-pointer items-center gap-1 font-semibold text-blue-700 hover:underline underline-offset-4 whitespace-nowrap"
                          >
                            <Film className="h-3 w-3" aria-hidden="true" />
                            <span>4 yeni meme/kadr tap</span>
                          </button>
                        </div>

                        <p className="mt-1.5 leading-relaxed text-slate-700">
                          {seg.visualInsertIdea}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                          {seg.searchKeyword ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span>CapCut/GIPHY axtarış:</span>
                              <button
                                type="button"
                                onClick={() => copyText(`kw-${idx}`, seg.searchKeyword!)}
                                className="cursor-pointer font-mono font-semibold text-slate-800 hover:text-blue-700"
                                title="Axtarış sözünü kopyala"
                              >
                                “{seg.searchKeyword}”
                                {copiedKey === `kw-${idx}` ? ' (Kopyalandı)' : ''}
                              </button>
                            </span>
                          ) : null}
                          {seg.soundEffect ? (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Səs: {seg.soundEffect}</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => handleFindEditForSentence(spoken)}
                          className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-700 hover:underline underline-offset-4"
                        >
                          <Film className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Bu cümlə üçün meme / kadr ideyası tap</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. VİZUAL, MONTAJ VƏ MEME BƏLƏDÇİSİ */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              03. Vizual, Montaj və Meme Bələdçisi (Sosial Sübut & Text on Screen)
            </h3>

            <div className="mt-4 grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Ekranda Sosial Sübut
                </p>
                <ul className="mt-2.5 space-y-2 text-sm leading-relaxed text-slate-600">
                  {reel.visualAndBroll.socialProof.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Ekranda Böyük Yazılar (Önizləmə üçün seçin)
                </p>
                <div className="mt-2.5 space-y-2">
                  {reel.visualAndBroll.onScreenText.map((text, idx) => {
                    const isSelected = idx === selectedScreenTextIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectScreenText(idx)}
                        className={`block w-full cursor-pointer rounded-md border px-3 py-2 text-left text-xs font-bold tracking-wide transition-colors ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  B-Roll və Çəkiliş Qeydləri
                </p>
                <ul className="mt-2.5 space-y-2 text-sm leading-relaxed text-slate-600">
                  {reel.visualAndBroll.brollIdeas.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Sentence-to-Meme/Edit Generator */}
          <div
            ref={editFinderRef}
            className="border-t border-slate-200 pt-6"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  İstənilən cümlə üçün Şəkil / Video / Meme İdeyası Tap
                </h4>
                <p className="mt-0.5 text-xs text-slate-500">
                  Videoda deyəcəyiniz konkret cümləni yazın — hansı meme, B-roll və ya ekran kadrı qoymalı olduğunuzu çıxaraq.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onRequestEditIdeas(editSentence);
              }}
              className="mt-3 flex flex-col gap-2.5 sm:flex-row"
            >
              <input
                type="text"
                value={editSentence}
                onChange={(e) => onEditSentenceChange(e.target.value)}
                placeholder='Məs: "Speaking-də həyəcanlananda bildiyin bütün sözlər yaddan çıxır..."'
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
              />
              <button
                type="submit"
                disabled={isEditIdeasLoading || !editSentence.trim()}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
              >
                {isEditIdeasLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    <span>Axtarılır...</span>
                  </>
                ) : (
                  <>
                    <Film className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Montaj / Meme Tap</span>
                  </>
                )}
              </button>
            </form>

            {editIdeasError ? (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-800">
                {editIdeasError}
              </div>
            ) : null}

            {isEditIdeasLoading ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[0, 1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-28 animate-pulse rounded-lg border border-slate-200 bg-slate-50"
                  />
                ))}
              </div>
            ) : editIdeas.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {editIdeas.map((idea, idx) => (
                  <div
                    key={idea.id || idx}
                    className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50/70 p-3.5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-blue-700">
                          {idea.category}
                        </span>
                        <span className="font-mono tabular-nums">
                          {idea.durationSeconds}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {idea.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {idea.description}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-2.5 text-[11px] text-slate-500">
                      <span>Səs: {idea.soundHint}</span>
                      <button
                        type="button"
                        onClick={() =>
                          copyText(`idea-kw-${idx}`, idea.capcutSearchKeyword)
                        }
                        className="inline-flex cursor-pointer items-center gap-1 font-mono font-semibold text-slate-800 hover:text-blue-700"
                      >
                        <Copy className="h-3 w-3" aria-hidden="true" />
                        <span>
                          {copiedKey === `idea-kw-${idx}`
                            ? 'Kopyalandı'
                            : idea.capcutSearchKeyword}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* 4. CTA + SƏMİMİ DM DİALOQU */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900">
              04. CTA — Tələbə Cəlbi və Səmimi DM Dialoqu
            </h3>
            {renderCopyButton('cta', reel.cta.spokenCta, 'CTA-nı kopyala')}
          </div>

          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-[15px] font-semibold leading-relaxed text-slate-900">
              “{reel.cta.spokenCta}”
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span>
                Açar söz: <strong className="font-mono text-slate-900">{reel.cta.dmKeyword}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>{reel.cta.leadNote}</span>
            </div>
          </div>

          {reel.cta.dmReplies ? (
            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-700">
                İzləyici “{reel.cta.dmKeyword}” yazanda göndəriləcək səmimi DM cavabları
              </p>
              <div className="mt-2.5 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                {[
                  {
                    key: 'dm-1',
                    step: '01. İlk səmimi salam',
                    text: reel.cta.dmReplies.firstReply,
                  },
                  {
                    key: 'dm-2',
                    step: '02. Tələbəni anlayan sual',
                    text: reel.cta.dmReplies.followUpQuestion,
                  },
                  {
                    key: 'dm-3',
                    step: '03. Təzyiqsiz dərs / tanışlıq dəvəti',
                    text: reel.cta.dmReplies.bookingInvite,
                  },
                ].map((dm) => (
                  <div
                    key={dm.key}
                    className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-blue-700">{dm.step}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-800">{dm.text}</p>
                    </div>
                    {renderCopyButton(dm.key, dm.text, 'Mesajı kopyala')}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* 5. CAPTION VƏ HƏŞTƏQLƏR */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900">
              05. Caption (Paylaşım mətni) və Həştəqlər
            </h3>
            {renderCopyButton(
              'caption',
              `${reel.captionAndHashtags.caption}\n\n${reel.captionAndHashtags.hashtags.join(' ')}`,
              'Caption + Həştəq kopyala'
            )}
          </div>

          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">
              {reel.captionAndHashtags.caption}
            </p>
            <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed font-medium text-blue-700">
              {reel.captionAndHashtags.hashtags.join(' ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
