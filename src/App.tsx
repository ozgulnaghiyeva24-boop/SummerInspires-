import { ArrowRight, Compass, Loader2, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnglesExplorer } from './components/AnglesExplorer';
import { ArchiveView } from './components/ArchiveView';
import { FewShotManager } from './components/FewShotManager';
import { Header } from './components/Header';
import { ReelOutputView } from './components/ReelOutputView';
import { ReelPreviewPanel } from './components/ReelPreviewPanel';
import {
  DEFAULT_FEW_SHOT_EXAMPLES,
  FUNNEL_GOAL_META,
  INITIAL_SAVED_REELS,
  PILLAR_META,
  QUICK_PROMPTS,
} from './data/presets';
import {
  ActiveTab,
  ContentPillar,
  EditSuggestion,
  FewShotExample,
  FunnelGoal,
  ReelPackage,
  ScenarioAngle,
} from './types';

const STORAGE_FEWSHOT_KEY = 'summer_inspires_fewshot_v2';
const STORAGE_ARCHIVE_KEY = 'summer_inspires_archive_v3';
const INSTRUCTOR_AVATAR = '/src/assets/images/avatar_summer_instructor_1795348960396.jpg';

const INITIAL_EDIT_IDEAS: EditSuggestion[] = [
  {
    id: 'edit-demo-1',
    category: 'Meme / Reaksiya Kadrı',
    title: 'Üst-üstə kitab yığılan tələbə reaksiyası',
    description:
      '"15 kitab bitirmişəm, yenə 6.0-da qalıram" cümləsini deyərkən tələbənin masada kitabların altında qaldığı məzəli meme-i göstərin — izləyici dərhal özünü tanıyacaq.',
    capcutSearchKeyword: 'stressed student books meme',
    durationSeconds: '1.5 san',
    soundHint: 'Yüngül ah çəkmə / vərəq səsi',
  },
  {
    id: 'edit-demo-2',
    category: 'Real B-Roll / Çəkiliş Kadrı',
    title: 'Markerlə açar sözlərin altından xətt çəkmək',
    description:
      'Səs arxada davam edərkən kameranı dəftərə tutub IELTS Listening mətnində "actually / however" sözlərini qələmlə dairəyə aldığınız 3 saniyəlik kadrı qoyun.',
    capcutSearchKeyword: 'highlighting text pen',
    durationSeconds: '2.5 san',
    soundHint: 'Marker səsi (yüngül)',
  },
  {
    id: 'edit-demo-3',
    category: 'Sosial Sübut / Ekran Görüntüsü',
    title: 'Tələbənin WhatsApp rəyi (Adı gizlədilmiş)',
    description:
      '"Bu dəfə Part 3-də tələləri tutdum, müəllim!" mesajını ekranın ortasına gətirib kənarlarını yumşaq bulanıqlaşdırın.',
    capcutSearchKeyword: 'chat bubble pop up',
    durationSeconds: '1.8 san',
    soundHint: 'WhatsApp / pop səsi',
  },
  {
    id: 'edit-demo-4',
    category: 'Dinamik Montaj Fəndi',
    title: '100% -> 115% kəsim + Qırmızı X / Yaşıl Tik',
    description:
      'Yanlış metodu ("15 test") deyəndə kadrı yaxınlaşdırıb solda kiçik ❌, düzgün metodu ("1 transkript analizi") deyəndə ✅ yazısını ekrana çıxarın.',
    capcutSearchKeyword: 'red x green check',
    durationSeconds: '1.2 san',
    soundHint: 'Zəif klik / ding',
  },
];

const INITIAL_ANGLES: ScenarioAngle[] = [
  {
    id: 'angle-1',
    angleTitle: 'Dərsdə real səhv düzəlişi (Teaching Proof)',
    pillar: 'results',
    funnelGoal: 'trust_lesson',
    targetAudience: 'Müəllimin real dərs metodunu və səbirli yanaşmasını görmək istəyən tələbələr',
    corePainPoint: '"Görəsən bu müəllim mənim zəif tərəfimi tapa və düzəldə biləcəkmi?" şübhəsi',
    strategyHook: 'Tələbənin tipik Band 6.0 cavabını 20 saniyədə necə Band 7.5 səviyyəsinə çevirdiyini göstərmək',
    samplePrompt:
      'Dərsdə tələbəmin Speaking Part 2 cavabını 20 saniyədə Band 6.0-dan 7.5 səviyyəsinə necə düzəltdik',
  },
  {
    id: 'angle-2',
    angleTitle: 'Əvvəlki kurslardan məyus qalan tələbə',
    pillar: 'traps',
    funnelGoal: 'objection_breaker',
    targetAudience: 'Daha əvvəl 1–2 kursa gedib yenə 5.5–6.0 balda qalan namizədlər',
    corePainPoint: '"Məndən alınmır, yəqin dil qabiliyyətim yoxdur" ümidsizliyi',
    strategyHook: 'Problemin tələbədə deyil, səhv analizi olmayan kütləvi proqramlarda olduğunu empatiya ilə izah etmək',
    samplePrompt:
      'Daha əvvəl kursa gedib yenə 6.0-da qalan tələbələr niyə özlərini günahlandırır, amma problem sistemdədir?',
  },
  {
    id: 'angle-3',
    angleTitle: 'Speaking qorxusunu aşan tələbə',
    pillar: 'results',
    funnelGoal: 'trust_lesson',
    targetAudience: 'Qrammatikanı bilən, lakin danışanda səhv etməkdən çəkinib susan tələbələr',
    corePainPoint: 'İmtahan həyəcanı ucbatından bildiyi sözləri belə xatırlamamaq',
    strategyHook: 'Təhlükəsiz dərs mühiti və səsli feedback ilə həyəcanın 6 həftədə 7.5-ə çevrilməsi',
    samplePrompt:
      'Speaking-də həyəcandan cümlə qura bilməyən tələbəmin 6 həftədə 5.5-dən 7.5-ə yüksəlmə hekayəsi',
  },
  {
    id: 'angle-4',
    angleTitle: 'Səmimi kiçik qrup dəvəti',
    pillar: 'results',
    funnelGoal: 'warm_enrollment',
    targetAudience: 'Qrup dərsində diqqətdən kənarda qalmaqdan qorxan tələbələr və valideynlər',
    corePainPoint: '15–20 nəfərlik qruplarda müəllimin tələbəyə vaxt ayıra bilməməsi',
    strategyHook: 'Niyə qruplara cəmi 5–6 nəfər götürdüyünü və hər tələbənin səsinə ayrı qulaq asdığını izah etmək',
    samplePrompt:
      'Növbəti ayın qrupuna niyə cəmi 5-6 nəfər götürürəm və kimlər bu dərs formatında ən tez nəticə alır?',
  },
  {
    id: 'angle-5',
    angleTitle: 'Əzbər niyə yetmir? (Satışa bağlanan ipucu)',
    pillar: 'tips',
    funnelGoal: 'smart_educational',
    targetAudience: 'Instagramdan yüzlərlə söz əzbərləyib yenə imtahanda 6.0 alanlar',
    corePainPoint: 'Məlumat çoxdur, amma real danışıqda tətbiq və düzəliş yoxdur',
    strategyHook: '2 güclü Band 8.0 əvəzləməsini verib təbii işlətmək üçün canlı mentor rəyinin rolunu göstərmək',
    samplePrompt:
      'Band 8.0 sözlərini əzbərləyib imtahanda yenə 6.0 almağın səbəbi — kontekst və feedback boşluğu',
  },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [avatarError, setAvatarError] = useState(false);

  // Composer state
  const [pillar, setPillar] = useState<ContentPillar>('results');
  const [funnelGoal, setFunnelGoal] = useState<FunnelGoal>('trust_lesson');
  const [topic, setTopic] = useState(
    'Dərsdə tələbəmin Speaking Part 2 cavabını 20 saniyədə Band 6.0-dan 7.5 səviyyəsinə necə düzəltdik'
  );
  const [targetBand, setTargetBand] = useState('Band 7.5+');
  const [classFormat, setClassFormat] = useState('Fərdi və kiçik qrup dərsləri');
  const [extraContext, setExtraContext] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Active reel & preview sync
  const [currentReel, setCurrentReel] = useState<ReelPackage | null>(
    INITIAL_SAVED_REELS[0]
  );
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);
  const [selectedScreenTextIndex, setSelectedScreenTextIndex] = useState(0);

  // Interactive Sentence -> Edit/Meme Ideas state
  const [editSentence, setEditSentence] = useState(
    'Müəllim, 15 kitab bitirmişəm, yenə Part 3-də itirəm'
  );
  const [editIdeas, setEditIdeas] = useState<EditSuggestion[]>(INITIAL_EDIT_IDEAS);
  const [isEditIdeasLoading, setIsEditIdeasLoading] = useState(false);
  const [editIdeasError, setEditIdeasError] = useState<string | null>(null);

  // Loading & errors
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Angles state
  const [angles, setAngles] = useState<ScenarioAngle[]>(INITIAL_ANGLES);
  const [isAnglesLoading, setIsAnglesLoading] = useState(false);
  const [anglesError, setAnglesError] = useState<string | null>(null);

  // Persisted Few-Shot examples & Saved Archive
  const [fewShotExamples, setFewShotExamples] = useState<FewShotExample[]>(() =>
    loadFromStorage(STORAGE_FEWSHOT_KEY, DEFAULT_FEW_SHOT_EXAMPLES)
  );
  const [savedReels, setSavedReels] = useState<ReelPackage[]>(() =>
    loadFromStorage(STORAGE_ARCHIVE_KEY, INITIAL_SAVED_REELS)
  );

  const topicInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_FEWSHOT_KEY,
        JSON.stringify(fewShotExamples)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [fewShotExamples]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_ARCHIVE_KEY, JSON.stringify(savedReels));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedReels]);

  const activeFewShots = fewShotExamples.filter((ex) => ex.active);

  const handleRequestEditIdeas = async (sentence: string) => {
    const clean = sentence.trim();
    if (!clean) return;
    setIsEditIdeasLoading(true);
    setEditIdeasError(null);

    try {
      const res = await fetch('/api/reels/edit-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: clean,
          contextTopic: currentReel?.title || topic,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Montaj ideyaları yaradılarkən xəta baş verdi.');
      }
      if (Array.isArray(data.ideas)) {
        setEditIdeas(data.ideas);
      }
    } catch (err) {
      setEditIdeasError(
        err instanceof Error ? err.message : 'Montaj ideyaları yüklənmədi.'
      );
    } finally {
      setIsEditIdeasLoading(false);
    }
  };

  const handleGenerateAngles = async (focusArea: string) => {
    setIsAnglesLoading(true);
    setAnglesError(null);
    try {
      const res = await fetch('/api/reels/angles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusArea,
          fewShotExamples: activeFewShots,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ssenari bucaqları yaradılarkən xəta baş verdi.');
      }
      if (Array.isArray(data.angles) && data.angles.length > 0) {
        setAngles(data.angles);
      }
    } catch (err) {
      setAnglesError(
        err instanceof Error ? err.message : 'Ssenari bucaqları yüklənmədi.'
      );
    } finally {
      setIsAnglesLoading(false);
    }
  };

  const generateReelScript = async (params: {
    topicText: string;
    pillarType: ContentPillar;
    funnelType?: FunnelGoal;
    band?: string;
    format?: string;
    notes?: string;
  }) => {
    const cleanTopic = params.topicText.trim();
    if (!cleanTopic) {
      setError('Zəhmət olmasa bir mövzu və ya tələbə nəticəsi daxil edin.');
      return;
    }

    const normalized = cleanTopic.toLowerCase();
    if (
      normalized.includes('tələbə nəticəsi üçün ideya ver') ||
      normalized.includes('ideya ver')
    ) {
      setActiveTab('angles');
      await handleGenerateAngles(cleanTopic);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/reels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: cleanTopic,
          pillar: params.pillarType,
          funnelGoal: params.funnelType ?? funnelGoal,
          targetBand: params.band ?? targetBand,
          classFormat: params.format ?? classFormat,
          extraContext: params.notes ?? extraContext,
          fewShotExamples: activeFewShots,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ssenari yaradılarkən xəta baş verdi.');
      }

      const newPackage: ReelPackage = {
        ...data,
        id: `reel-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      setCurrentReel(newPackage);
      setSelectedHookIndex(0);
      setSelectedScreenTextIndex(0);
      if (newPackage.scriptSegments?.[1]?.spokenText) {
        setEditSentence(newPackage.scriptSegments[1].spokenText);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Reels paketi yaradılarkən gözlənilməz xəta baş verdi.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateReelScript({
      topicText: topic,
      pillarType: pillar,
      funnelType: funnelGoal,
    });
  };

  const handleRefine = async (instruction: string) => {
    if (!currentReel) return;
    setIsRefining(true);
    setError(null);

    try {
      const res = await fetch('/api/reels/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentReel,
          instruction,
          fewShotExamples: activeFewShots,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ssenari yenilənərkən xəta baş verdi.');
      }
      setCurrentReel({
        ...data,
        id: `reel-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
      setSelectedHookIndex(0);
      setSelectedScreenTextIndex(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Təkmilləşdirmə zamanı xəta baş verdi.'
      );
    } finally {
      setIsRefining(false);
    }
  };

  const handleNewScript = () => {
    setActiveTab('studio');
    setTopic('');
    setExtraContext('');
    setError(null);
    window.setTimeout(() => {
      topicInputRef.current?.focus();
    }, 60);
  };

  const handleSaveToArchive = (reel: ReelPackage) => {
    setSavedReels((prev) => {
      if (prev.some((item) => item.id === reel.id)) return prev;
      return [reel, ...prev];
    });
  };

  const handleSelectAngleToWrite = async (angle: ScenarioAngle) => {
    const nextPillar: ContentPillar =
      angle.pillar === 'results' || angle.pillar === 'traps' || angle.pillar === 'tips'
        ? angle.pillar
        : 'results';
    const nextFunnel: FunnelGoal =
      angle.funnelGoal && angle.funnelGoal in FUNNEL_GOAL_META
        ? angle.funnelGoal
        : 'trust_lesson';

    setPillar(nextPillar);
    setFunnelGoal(nextFunnel);
    setTopic(angle.samplePrompt);
    setExtraContext(`Bucaq: ${angle.angleTitle}. Strategiya: ${angle.strategyHook}`);
    setActiveTab('studio');
    await generateReelScript({
      topicText: angle.samplePrompt,
      pillarType: nextPillar,
      funnelType: nextFunnel,
      notes: `Bucaq: ${angle.angleTitle}. Hədəf: ${angle.targetAudience}. Strategiya: ${angle.strategyHook}`,
    });
  };

  const isCurrentSaved = currentReel
    ? savedReels.some((item) => item.id === currentReel.id)
    : false;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNewScript={handleNewScript}
        savedCount={savedReels.length}
      />

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {activeTab === 'studio' ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            {/* Left / Main Studio Column */}
            <div className="space-y-6 min-w-0">
              {/* Instructor Context & Composer */}
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    {!avatarError ? (
                      <img
                        src={INSTRUCTOR_AVATAR}
                        alt="Özgül (Summer) — İngilis dili və IELTS müəllimi"
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="h-12 w-12 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                        ÖS
                      </div>
                    )}
                    <div className="min-w-0">
                      <h1 className="text-lg font-bold tracking-tight text-slate-900">
                        Reels və Səmimi Tələbə Cəlbi Studiyası
                      </h1>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Özgül (Summer) · 6+ il təcrübə · Ssenari, Montaj Kadrları və Təzyiqsiz Satış
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('angles');
                      handleGenerateAngles('Dərs içi etibar və səmimi satış bucaqları');
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-white whitespace-nowrap shrink-0"
                  >
                    <Compass className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                    <span>Etibar & satış ideyaları ver</span>
                  </button>
                </div>

                {/* 1. Content Pillar Selector */}
                <div className="mt-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-700">
                      1. Kontent Pilları (Mövzu istiqaməti)
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('fewshot')}
                      className="cursor-pointer text-xs font-medium text-blue-700 hover:underline underline-offset-4"
                    >
                      Aktiv üslub nümunələri: {activeFewShots.length} ssenari (Redaktə et)
                    </button>
                  </div>

                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {(['results', 'traps', 'tips'] as ContentPillar[]).map((key) => {
                      const meta = PILLAR_META[key];
                      const active = pillar === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPillar(key)}
                          className={`cursor-pointer rounded-lg border p-3 text-left transition-colors ${
                            active
                              ? 'border-blue-600 bg-blue-50/50 text-slate-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <p className="text-xs font-bold">{meta.shortLabel}</p>
                          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-500">
                            {meta.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Funnel Goal Selector */}
                <div className="mt-5">
                  <span className="block text-xs font-semibold text-slate-700">
                    2. Kontent Məqsədi (İzləyicidə nə yaratmalı?)
                  </span>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {(
                      [
                        'trust_lesson',
                        'objection_breaker',
                        'warm_enrollment',
                        'smart_educational',
                      ] as FunnelGoal[]
                    ).map((key) => {
                      const meta = FUNNEL_GOAL_META[key];
                      const active = funnelGoal === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFunnelGoal(key)}
                          className={`cursor-pointer rounded-lg border p-3 text-left transition-colors ${
                            active
                              ? 'border-blue-600 bg-blue-50/50 text-slate-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <p className="text-xs font-bold">{meta.shortLabel}</p>
                          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-500">
                            {meta.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brief Form */}
                <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="reel-topic-input"
                        className="text-xs font-semibold text-slate-700"
                      >
                        3. İdeya, tələbə nəticəsi və ya dərs içi hekayə
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAdvanced((v) => !v)}
                        className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{showAdvanced ? 'Detalları gizlət' : 'Hədəf bal və dərs formatı'}</span>
                      </button>
                    </div>

                    <textarea
                      id="reel-topic-input"
                      ref={topicInputRef}
                      rows={3}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder='Məsələn: "Dərsdə tələbəmin Speaking cavabını 20 saniyədə necə düzəltdik" və ya "Daha əvvəl kursa gedib nəticə almayanlar..."'
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                    />
                  </div>

                  {showAdvanced ? (
                    <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600">
                          Hədəf IELTS Balı
                        </label>
                        <input
                          type="text"
                          value={targetBand}
                          onChange={(e) => setTargetBand(e.target.value)}
                          placeholder="Band 7.5+"
                          className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600">
                          Dərs Formatı (CTA üçün)
                        </label>
                        <input
                          type="text"
                          value={classFormat}
                          onChange={(e) => setClassFormat(e.target.value)}
                          placeholder="Fərdi və kiçik qrup dərsləri"
                          className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600">
                          Konkret metod qeydi
                        </label>
                        <input
                          type="text"
                          value={extraContext}
                          onChange={(e) => setExtraContext(e.target.value)}
                          placeholder="Məs: Səs yazısı analizi və fərdi feedback"
                          className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 mr-1">Nümunələr:</span>
                      {QUICK_PROMPTS.map((q) => (
                        <button
                          key={q.label}
                          type="button"
                          onClick={() => {
                            setPillar(q.pillar);
                            setFunnelGoal(q.funnelGoal);
                            setTopic(q.topic);
                            setTargetBand(q.targetBand);
                          }}
                          className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-white"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span>Reels Paketi Hazırlanır...</span>
                        </>
                      ) : (
                        <>
                          <span>Reels Paketi Yarat</span>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {error ? (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                  </div>
                ) : null}
              </section>

              {/* Loading Skeleton or Generated 5-Part Output */}
              {isGenerating ? (
                <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 w-2/3">
                      <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
                      <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
                    </div>
                    <div className="h-8 w-28 animate-pulse rounded-lg bg-slate-100" />
                  </div>
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
                    <div className="h-14 w-full animate-pulse rounded-lg bg-slate-100" />
                    <div className="h-14 w-full animate-pulse rounded-lg bg-slate-100" />
                    <div className="h-14 w-full animate-pulse rounded-lg bg-slate-100" />
                  </div>
                </section>
              ) : currentReel ? (
                <ReelOutputView
                  reel={currentReel}
                  selectedHookIndex={selectedHookIndex}
                  onSelectHook={setSelectedHookIndex}
                  selectedScreenTextIndex={selectedScreenTextIndex}
                  onSelectScreenText={setSelectedScreenTextIndex}
                  onSaveToArchive={handleSaveToArchive}
                  isSaved={isCurrentSaved}
                  onRefine={handleRefine}
                  isRefining={isRefining}
                  editIdeas={editIdeas}
                  isEditIdeasLoading={isEditIdeasLoading}
                  editIdeasError={editIdeasError}
                  editSentence={editSentence}
                  onEditSentenceChange={setEditSentence}
                  onRequestEditIdeas={handleRequestEditIdeas}
                />
              ) : null}
            </div>

            {/* Right Sticky Column: 9:16 Reels Frame Preview + 45s Teleprompter */}
            <div className="lg:sticky lg:top-20">
              <ReelPreviewPanel
                reel={currentReel}
                selectedHookIndex={selectedHookIndex}
                selectedScreenTextIndex={selectedScreenTextIndex}
              />
            </div>
          </div>
        ) : null}

        {activeTab === 'angles' ? (
          <AnglesExplorer
            angles={angles}
            isLoading={isAnglesLoading}
            error={anglesError}
            onGenerateAngles={handleGenerateAngles}
            onSelectAngleToWrite={handleSelectAngleToWrite}
          />
        ) : null}

        {activeTab === 'fewshot' ? (
          <FewShotManager
            examples={fewShotExamples}
            onToggleActive={(id) =>
              setFewShotExamples((prev) =>
                prev.map((item) =>
                  item.id === id ? { ...item, active: !item.active } : item
                )
              )
            }
            onAddExample={(newEx) =>
              setFewShotExamples((prev) => [
                {
                  ...newEx,
                  id: `fs-${Date.now()}`,
                  active: true,
                },
                ...prev,
              ])
            }
            onDeleteExample={(id) =>
              setFewShotExamples((prev) => prev.filter((item) => item.id !== id))
            }
            onResetDefaults={() => setFewShotExamples(DEFAULT_FEW_SHOT_EXAMPLES)}
          />
        ) : null}

        {activeTab === 'archive' ? (
          <ArchiveView
            savedReels={savedReels}
            onOpenReel={(reel) => {
              setCurrentReel(reel);
              setSelectedHookIndex(0);
              setSelectedScreenTextIndex(0);
              setActiveTab('studio');
            }}
            onDeleteReel={(id) =>
              setSavedReels((prev) => prev.filter((item) => item.id !== id))
            }
            onGoToStudio={() => setActiveTab('studio')}
          />
        ) : null}
      </main>
    </div>
  );
}
