import { Pause, Play, RotateCcw, Smartphone, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReelPackage } from '../types';

interface ReelPreviewPanelProps {
  reel: ReelPackage | null;
  selectedHookIndex: number;
  selectedScreenTextIndex: number;
}

const BACKDROP_STUDIO = '/src/assets/images/reel_studio_backdrop_1795348959776.jpg';
const BACKDROP_PORTRAIT = '/src/assets/images/avatar_summer_instructor_1795348960396.jpg';

export function ReelPreviewPanel({
  reel,
  selectedHookIndex,
  selectedScreenTextIndex,
}: ReelPreviewPanelProps) {
  const [mode, setMode] = useState<'frame' | 'teleprompter'>('frame');
  const [backdropType, setBackdropType] = useState<'studio' | 'portrait'>('studio');
  const [imageError, setImageError] = useState(false);

  // Teleprompter stopwatch state (0 to 45 seconds)
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSeconds(0);
    setIsRunning(false);
  }, [reel?.id]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setSeconds((prev) => {
        if (prev >= 45) {
          setIsRunning(false);
          return 45;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  const activeHook =
    reel?.hooks?.[selectedHookIndex] ??
    reel?.hooks?.[0] ??
    'Tələbəm cəmi 2 aya IELTS Listening balını 6.0-dan 8.0-a necə qaldırdı?';

  const activeScreenText =
    reel?.visualAndBroll?.onScreenText?.[selectedScreenTextIndex] ??
    reel?.visualAndBroll?.onScreenText?.[0] ??
    '6.0 -> 8.0';

  const activeDmKeyword = reel?.cta?.dmKeyword || 'IELTS';
  const activeCaptionSnippet =
    reel?.captionAndHashtags?.caption?.split('\n')[0] ||
    'Real nəticənin arxasındakı konkret strategiya — tələbə case study.';

  const getSegmentIsActive = (index: number) => {
    if (seconds === 0 && !isRunning) return false;
    if (index === 0) return seconds <= 3;
    if (index === 1) return seconds > 3 && seconds <= 15;
    if (index === 2) return seconds > 15 && seconds <= 30;
    return seconds > 30;
  };

  const backdropSrc = backdropType === 'studio' ? BACKDROP_STUDIO : BACKDROP_PORTRAIT;

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 w-full">
          <button
            type="button"
            onClick={() => setMode('frame')}
            className={`flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              mode === 'frame'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>9:16 Kadr Önizləmə</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('teleprompter')}
            className={`flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              mode === 'teleprompter'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Teleprompter (45s)</span>
          </button>
        </div>
      </div>

      {mode === 'frame' ? (
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Kadr fonu</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setBackdropType('studio');
                  setImageError(false);
                }}
                className={`cursor-pointer transition-colors ${
                  backdropType === 'studio'
                    ? 'font-semibold text-blue-700 underline underline-offset-4'
                    : 'hover:text-slate-800'
                }`}
              >
                Masa çəkilişi
              </button>
              <button
                type="button"
                onClick={() => {
                  setBackdropType('portrait');
                  setImageError(false);
                }}
                className={`cursor-pointer transition-colors ${
                  backdropType === 'portrait'
                    ? 'font-semibold text-blue-700 underline underline-offset-4'
                    : 'hover:text-slate-800'
                }`}
              >
                Müəllim kadrı
              </button>
            </div>
          </div>

          <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
            {!imageError ? (
              <img
                src={backdropSrc}
                alt="@summer.inspires Reels kadr önizləməsi"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-center text-slate-300">
                <Video className="mb-2 h-8 w-8 text-slate-400" aria-hidden="true" />
                <p className="text-sm font-semibold text-white">@summer.inspires</p>
                <p className="mt-1 text-xs text-slate-400">9:16 Reels Kadr Önizləməsi</p>
              </div>
            )}

            {/* Measured dark contrast scrim for WCAG AA legibility */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/45" />

            {/* Top frame metadata */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-4 text-[11px] font-medium text-white/90">
              <span>Reels · 9:16</span>
              <span className="font-mono tabular-nums">
                {reel?.estimatedDuration || '38 saniyə'}
              </span>
            </div>

            {/* Center/Upper On-Screen Text Overlay */}
            <div className="absolute inset-x-4 top-14 flex flex-col items-center text-center">
              <div className="rounded-md bg-white px-3 py-1.5 text-xs font-extrabold tracking-wide text-slate-950 shadow-sm">
                {activeScreenText}
              </div>

              <div className="mt-3 rounded-lg bg-slate-950/75 px-3 py-2 backdrop-blur-xs border border-white/15">
                <p className="text-[12px] leading-snug font-semibold text-white">
                  “{activeHook}”
                </p>
              </div>
            </div>

            {/* Bottom Instagram Reels caption & CTA preview */}
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <div className="flex items-center gap-2.5">
                <img
                  src={BACKDROP_PORTRAIT}
                  alt="Özgül (Summer)"
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-full object-cover border border-white/40"
                />
                <span className="text-xs font-bold tracking-tight">@summer.inspires</span>
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-white/90">
                {activeCaptionSnippet}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold text-blue-300">
                Rəyə yaz: {activeDmKeyword}
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            Sol paneldə Hook və ya ekran yazısını seçərək önizləməni yeniləyin.
          </p>
        </div>
      ) : (
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Çəkiliş taymeri</p>
              <p className="font-mono text-xl font-bold tabular-nums text-slate-900">
                00:{String(seconds).padStart(2, '0')} <span className="text-xs font-normal text-slate-400">/ 00:45</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Dayandır</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Başlat</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setSeconds(0);
                }}
                aria-label="Taymeri sıfırla"
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {reel ? (
            <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
              {reel.scriptSegments.map((seg, idx) => {
                const active = getSegmentIsActive(idx);
                const textToRead = idx === 0 ? activeHook : seg.spokenText;
                return (
                  <div
                    key={seg.timeRange}
                    className={`rounded-lg border p-3.5 transition-colors ${
                      active
                        ? 'border-blue-600 bg-blue-50/70'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold tabular-nums text-blue-700">
                        {seg.timeRange}
                      </span>
                      <span className="text-slate-500">{seg.label}</span>
                    </div>
                    <p className="mt-1.5 text-[15px] leading-relaxed font-medium text-slate-900">
                      {textToRead}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
              Teleprompter mətnini görmək üçün əvvəlcə ssenari yaradın və ya arxivdən seçin.
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
