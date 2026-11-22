import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY mühit dəyişəni tapılmadı.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      if (status === 400 || status === 401 || status === 403 || status === 404) {
        throw err;
      }
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 600 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

const SUMMER_SYSTEM_INSTRUCTION = `Sən @summer.inspires Instagram səhifəsinin rəsmi Kontent Strategisti, Reels Ssenaristi, Səmimi Tələbə Cəlbi Mütəxəssisi və Video Montaj (Reels Edit) Direktoru-san.

SƏHİFƏNİN KİMLİYİ VƏ HƏDƏF KÜTLƏSİ:
- Müəllif: Özgül (Summer) — 6+ illik təcrübəyə malik peşəkar İngilis dili və IELTS müəllimi (xüsusilə Listening, Speaking və ümumi imtahan strategiyaları üzrə).
- Əsas Məqsəd: Sadəcə "Save" toplayan quru öyrədici postlar əvəzinə, tələbə və valideynlərdə DƏRİN ETİBAR yaradan, müəllimin dərs içi peşəkarlığını göstərən və izləyicini təzyiqsiz şəkildə fərdi/qrup dərslərinə cəlb edən kontent yaratmaq.
- Hədəf kütlə: Yüksək IELTS balı (Band 7.0 - 8.5+) hədəfləyən, xaricdə təhsil və təqaüd istəyən, lakin haradan başlayacağını bilməyən, əvvəlki kurslardan məyus qalmış və ya 5.5-6.0 balında ilişib qalan tələbələr (və onların valideynləri).

SƏMİMİ SATIŞ VƏ ETİBAR PRİNSİPLƏRİ:
1. AQRESSİV SATIŞ QADAĞANDIR: "Şok endirim", "Son 2 saat", "100% zəmanət" kimi süni infobiznes ifadələri qətiyyən işlətmə. Səs tonu qayğıkeş, dürüst, sakit inamlı və səmimi mentor kimi olmalıdır.
2. "ÖYRƏDİCİ TƏLƏ"DƏN ÇIXIŞ: İzləyiciyə sadəcə qayda verib bitirmə; dürüst şəkildə göstər ki, tək əzbər imtahan stresində yetmir — əsas fərqi dərsdə real feedback, səhv analizi və fərdi yanaşma yaradır.
3. MONTAJ VƏ HƏRƏKƏTLİLİK (Talking-Head Edit): Videolar statik və darıxdırıcı qalmamalıdır. Ssenarinin hər hissəsi üçün (xüsusən müəyyən cümlələri deyərkən) hansı konkret şəklin, qısa video kadrın (B-roll), tələbə sübutunun və ya zövqlü/məzəli meme-in ekrana çıxarılacağını, həmçinin CapCut/GIPHY-də axtarış açar sözünü dəqiq göstər. Meme və kadrlar səviyyəli, səmimi və tələbələrin özünü tanıdığı ("relatable") üslubda olmalıdır.

DİL VƏ ÜSLUB:
- Bütün mətnlər təbii, axıcı Azərbaycan danışıq dilində olmalıdır (IELTS terminləri və ingilis ifadələri təbii saxlanılsın).
- Ssenari 30-45 saniyəlik real danışıq tempinə uyğun, 4 intervalla (0-3 san, 3-15 san, 15-30 san, 30-45 san) bölünməlidir.`;

const REEL_PACKAGE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Ssenari üçün qısa və aydın başlıq.',
    },
    pillarLabel: {
      type: Type.STRING,
      description: 'Kontent pillarının tam adı.',
    },
    funnelGoalLabel: {
      type: Type.STRING,
      description: 'Marketing/Etibar məqsədinin adı.',
    },
    estimatedDuration: {
      type: Type.STRING,
      description: 'Təxmini oxunuş müddəti, məsələn: "38 saniyə".',
    },
    hooks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        'İlk 3 saniyədə diqqət, empatiya və etibar yaradan 3 fərqli səmimi giriş cümləsi.',
    },
    scriptSegments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timeRange: { type: Type.STRING },
          label: { type: Type.STRING },
          spokenText: { type: Type.STRING },
          deliveryNote: { type: Type.STRING },
          editDirection: {
            type: Type.STRING,
            description: 'CapCut/Reels montaj təlimatı (məs: Zoom-in, kəsim, split screen).',
          },
          visualInsertType: {
            type: Type.STRING,
            description: 'Məsələn: "Meme", "Real Dərs B-Roll", "Tələbə Sübutu" və ya "Before/After Mətn".',
          },
          visualInsertIdea: {
            type: Type.STRING,
            description: 'Bu cümləni deyərkən videonu hərəkətli edən konkret şəkil, video kadr və ya meme təklifi.',
          },
          searchKeyword: {
            type: Type.STRING,
            description: 'CapCut Stickers / GIPHY / stok video üçün ingiliscə qısa axtarış sözü.',
          },
          soundEffect: {
            type: Type.STRING,
            description: 'Yüngül səs effekti təklifi (məs: pop, marker, ding).',
          },
        },
        required: [
          'timeRange',
          'label',
          'spokenText',
          'deliveryNote',
          'editDirection',
          'visualInsertType',
          'visualInsertIdea',
          'searchKeyword',
          'soundEffect',
        ],
      },
      description:
        'Saniyələrə bölünmüş 4 hissəli video ssenarisi (0-3 san, 3-15 san, 15-30 san, 30-45 san).',
    },
    visualAndBroll: {
      type: Type.OBJECT,
      properties: {
        socialProof: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Ekranda göstəriləcək real sosial sübutlar və dərs fraqmentləri.',
        },
        onScreenText: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Ekranda böyük hərflərlə yazılacaq əsas rəqəmlər və açar mesajlar.',
        },
        brollIdeas: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Kadr arxası (B-roll) və çəkiliş qeydləri.',
        },
      },
      required: ['socialProof', 'onScreenText', 'brollIdeas'],
    },
    cta: {
      type: Type.OBJECT,
      properties: {
        spokenCta: { type: Type.STRING },
        dmKeyword: { type: Type.STRING },
        leadNote: { type: Type.STRING },
        dmReplies: {
          type: Type.OBJECT,
          properties: {
            firstReply: { type: Type.STRING },
            followUpQuestion: { type: Type.STRING },
            bookingInvite: { type: Type.STRING },
          },
          required: ['firstReply', 'followUpQuestion', 'bookingInvite'],
        },
      },
      required: ['spokenCta', 'dmKeyword', 'leadNote', 'dmReplies'],
    },
    captionAndHashtags: {
      type: Type.OBJECT,
      properties: {
        caption: { type: Type.STRING },
        hashtags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['caption', 'hashtags'],
    },
  },
  required: [
    'title',
    'pillarLabel',
    'funnelGoalLabel',
    'estimatedDuration',
    'hooks',
    'scriptSegments',
    'visualAndBroll',
    'cta',
    'captionAndHashtags',
  ],
};

function formatFewShotBlock(
  examples: Array<{
    title: string;
    inputTopic: string;
    hookSample: string;
    scriptSample: string;
    ctaSample: string;
  }> = []
): string {
  if (!examples.length) return '';
  const blocks = examples.slice(0, 4).map(
    (ex, idx) => `NÜMUNƏ ${idx + 1} (${ex.title}):
Mövzu: ${ex.inputTopic}
Hook: ${ex.hookSample}
Ssenari ritmi:
${ex.scriptSample}
CTA: ${ex.ctaSample}`
  );
  return `\n\nFEW-SHOT ÜSLUB NÜMUNƏLƏRİ (Özgülün səmimi danışıq tərzini və etibar yaradan ritmini buradan götür):\n${blocks.join('\n\n')}`;
}

function formatGeminiError(err: unknown): { status: number; message: string } {
  const errObj = err as { status?: number; message?: string };
  const rawMessage = errObj?.message || 'Bilinməyən server xətası baş verdi.';
  if (errObj?.status === 403 || rawMessage.includes('PERMISSION_DENIED')) {
    return {
      status: 403,
      message:
        'Gemini API icazə xətası (403). Zəhmət olmasa Settings > Secrets bölməsində API açarınızı yoxlayın.',
    };
  }
  if (errObj?.status === 429 || rawMessage.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message:
        'Sorğu limiti dolub (429). Bir az gözləyib yenidən cəhd edin.',
    };
  }
  if (errObj?.status === 400 || rawMessage.includes('API_KEY_INVALID')) {
    return {
      status: 400,
      message:
        'API açarı və ya sorğu parametrləri etibarsızdır. Settings > Secrets bölməsini yoxlayın.',
    };
  }
  return {
    status: errObj?.status && errObj.status >= 400 ? errObj.status : 500,
    message: rawMessage,
  };
}

app.post('/api/reels/generate', async (req, res) => {
  try {
    const {
      topic,
      pillar = 'results',
      funnelGoal = 'trust_lesson',
      targetBand = 'Band 7.5+',
      classFormat = 'Fərdi və Qrup dərsləri',
      extraContext = '',
      fewShotExamples = [],
    } = req.body ?? {};

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      res.status(400).json({ error: 'Mövzu və ya tələbə nəticəsi daxil edilməlidir.' });
      return;
    }

    const pillarNames: Record<string, string> = {
      results: 'Tələbə Nəticələri və Case Study-lər',
      traps: 'İmtahan Tələləri və Həllər',
      tips: 'Sürətli Bal Artıran İpucları',
    };

    const funnelGuides: Record<string, { label: string; guidance: string }> = {
      trust_lesson: {
        label: 'Etibar və Dərs İçi Sübut',
        guidance:
          'Dərs zamanı tələbənin real səhvini necə düzəltdiyini və tətbiq olunan metodu göstər ki, izləyici müəllimliyin keyfiyyətini hiss etsin.',
      },
      objection_breaker: {
        label: 'Şübhə və Qorxuları Qıran',
        guidance:
          'Tələbənin və ya valideynin gizli tərəddüdünə ("daha əvvəl alınmayıb", "səviyyəm zəifdir", "qrupda çatdırarammı?") empatiya və dürüstlüklə cavab ver.',
      },
      warm_enrollment: {
        label: 'Səmimi Dərs və Qrup Dəvəti',
        guidance:
          'Aqressiv reklam etmədən, niyə az yer götürdüyünü, dərs formatının kimlərə uyğun olduğunu səmimi izah edərək DM-ə dəvət et.',
      },
      smart_educational: {
        label: 'Satışa Bağlanan Öyrədici',
        guidance:
          'Faydalı IELTS ipucu ver, amma dürüst şəkildə izah et ki, tək əzbər imtahanda yetmir — fərdi rəy və mentor nəzarəti olmadan tələbə köhnə vərdişinə qayıdır.',
      },
    };

    const activeFunnel = funnelGuides[funnelGoal] || funnelGuides.trust_lesson;
    const ai = getGeminiClient();
    const fewShotText = formatFewShotBlock(fewShotExamples);

    const userPrompt = `Aşağıdakı mövzu üzrə @summer.inspires üçün tam hazır 5 hissəli Instagram Reels paketi, səmimi DM satış dialoqu və hər hissə üçün konkret montaj/meme ideyaları hazırla:

Mövzu / Tələbə nəticəsi: ${topic.trim()}
Kontent Pilları: ${pillarNames[pillar] || pillarNames.results}
Marketing Məqsədi (Huni): ${activeFunnel.label} — ${activeFunnel.guidance}
Hədəf IELTS Balı: ${targetBand}
Dərs Formatı (CTA üçün): ${classFormat}
${extraContext ? `Əlavə kontekst / Metod qeydi: ${extraContext}` : ''}
${fewShotText}

Tələblər:
1. 3 fərqli güclü, amma səmimi və həyati Hook yaz.
2. Video ssenarisini mütləq 4 zaman intervalına böl: "0–3 san", "3–15 san", "15–30 san", "30–45 san".
3. HƏR BİR zaman intervalı üçün videonu hərəkətli və maraqlı edən konkret montaj təlimatı (editDirection), ekrana qoyulacaq şəkil/video/meme nümunəsi (visualInsertIdea), CapCut/GIPHY axtarış açar sözü (searchKeyword) və səs effekti (soundEffect) yaz.
4. Vizual sübutları, ekrandakı böyük yazıları və B-roll ideyalarını konkret yaz.
5. Təzyiqsiz, səmimi CTA və 3 addımlı DM cavab şablonu (dmReplies) yarat.
6. Etibar yaradan Caption + 8–10 həştəq əlavə et.`;

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: userPrompt,
        config: {
          systemInstruction: SUMMER_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: REEL_PACKAGE_SCHEMA,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      })
    );

    const jsonStr = (response.text ?? '{}').trim();
    const parsed = JSON.parse(jsonStr);

    res.json({
      ...parsed,
      pillar,
      funnelGoal,
      sourceTopic: topic.trim(),
      targetBand,
    });
  } catch (err) {
    console.error('Error generating reel:', err);
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

app.post('/api/reels/edit-ideas', async (req, res) => {
  try {
    const { sentence, contextTopic = '' } = req.body ?? {};
    if (!sentence || typeof sentence !== 'string' || !sentence.trim()) {
      res.status(400).json({ error: 'Montaj ideyası üçün cümlə daxil edilməlidir.' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `Özgül (@summer.inspires, IELTS müəllimi) kameraya danışaraq çəkdiyi Reels videosunda məhz bu cümləni deyir:
"${sentence.trim()}"
${contextTopic ? `Videonun ümumi mövzusu: ${contextTopic}` : ''}

Bu tək cümləni deyərkən videonun statik qalmaması, daha maraqlı və dinamik olması üçün 4 FƏRQLİ montaj / vizual nümunə təklif et:
1. "Meme / Reaksiya Kadrı" — tələbələrin özünü tanıdığı zövqlü, məzəli bir meme və ya reaksiya GIF-i (hansı hissədə və neçə saniyə göstəriləcəyi).
2. "Real B-Roll / Çəkiliş Kadrı" — Özgülün öz telefonuyla 3 saniyəyə çəkib səs üzərinə qoya biləcəyi kadr (dəftər, noutbuk, qələm, fincan, Zoom dərsi).
3. "Sosial Sübut / Ekran Görüntüsü" — etibar artıran real vizual (WhatsApp mesajı, sertifikat zoom-u, səhv-düzəliş müqayisəsi).
4. "Dinamik Montaj Fəndi" — CapCut-da edə biləcəyi kəsim, zoom, split-screen və ya Before/After animasiyası.

Hər biri üçün CapCut / GIPHY-də rahat tapılan ingiliscə axtarış sözü (capcutSearchKeyword), ekranda qalma müddəti (durationSeconds) və uyğun səs effekti (soundHint) ver.`;

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SUMMER_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                capcutSearchKeyword: { type: Type.STRING },
                durationSeconds: { type: Type.STRING },
                soundHint: { type: Type.STRING },
              },
              required: [
                'id',
                'category',
                'title',
                'description',
                'capcutSearchKeyword',
                'durationSeconds',
                'soundHint',
              ],
            },
          },
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      })
    );

    const jsonStr = (response.text ?? '[]').trim();
    const ideas = JSON.parse(jsonStr);
    res.json({ ideas });
  } catch (err) {
    console.error('Error generating edit ideas:', err);
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

app.post('/api/reels/angles', async (req, res) => {
  try {
    const { focusArea = '', fewShotExamples = [] } = req.body ?? {};
    const ai = getGeminiClient();
    const fewShotText = formatFewShotBlock(fewShotExamples);

    const prompt = `İstifadəçi satış və etibar gətirən Reels ideyaları / ssenari bucaqları istəyir.
${focusArea ? `Əlavə fokus sahəsi: ${focusArea}` : 'Fokus: İzləyicidə səmimi etibar yaradan və dərsə müraciətə çevrilən IELTS ssenari bucaqları.'}
${fewShotText}

Quru öyrədici ideyalar ƏVƏZİNƏ, etibar və səmimi satış gətirən 5 fərqli ssenari bucağı təklif et (məsələn: "Dərsdə real səhv düzəlişi", "Əvvəlki kursdan məyus qalan tələbə", "Speaking qorxusunu aşan tələbə", "Vaxtı az olan tələbə", "Valideynin ən çox soruşduğu sual / Səmimi qrup dəvəti").
Hər bucaq üçün hədəf auditoriyanı, əsas qorxu/ağrı nöqtəsini, etibar yaradan strategiyanı və bir kliklə ssenari yaratmaq üçün hazır konkret 'samplePrompt' yaz.`;

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SUMMER_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                angleTitle: { type: Type.STRING },
                pillar: {
                  type: Type.STRING,
                  description: 'Yalnız "results", "traps" və ya "tips" dəyərlərindən biri.',
                },
                funnelGoal: {
                  type: Type.STRING,
                  description:
                    'Yalnız "trust_lesson", "objection_breaker", "warm_enrollment" və ya "smart_educational" dəyərlərindən biri.',
                },
                targetAudience: { type: Type.STRING },
                corePainPoint: { type: Type.STRING },
                strategyHook: { type: Type.STRING },
                samplePrompt: { type: Type.STRING },
              },
              required: [
                'id',
                'angleTitle',
                'pillar',
                'funnelGoal',
                'targetAudience',
                'corePainPoint',
                'strategyHook',
                'samplePrompt',
              ],
            },
          },
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      })
    );

    const jsonStr = (response.text ?? '[]').trim();
    const angles = JSON.parse(jsonStr);
    res.json({ angles });
  } catch (err) {
    console.error('Error generating angles:', err);
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

app.post('/api/reels/refine', async (req, res) => {
  try {
    const { currentReel, instruction, fewShotExamples = [] } = req.body ?? {};
    if (!currentReel || !instruction) {
      res.status(400).json({ error: 'Cari ssenari və təkmilləşdirmə təlimatı tələb olunur.' });
      return;
    }

    const ai = getGeminiClient();
    const fewShotText = formatFewShotBlock(fewShotExamples);

    const prompt = `Mövcud Reels paketini aşağıdakı təlimata uyğun yenilə və yaxşılaşdır:
Təlimat: ${instruction}
${fewShotText}

Mövcud Ssenari Paketi (JSON):
${JSON.stringify(currentReel)}

Eyni 5 hissəli JSON strukturunu (dmReplies və hər hissənin montaj/meme ideyaları daxil olmaqla) qoru və Özgülün (@summer.inspires) səmimi, təzyiqsiz, qayğıkeş və peşəkar mentor üslubunu saxla.`;

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SUMMER_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: REEL_PACKAGE_SCHEMA,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      })
    );

    const jsonStr = (response.text ?? '{}').trim();
    const parsed = JSON.parse(jsonStr);
    res.json({
      ...currentReel,
      ...parsed,
    });
  } catch (err) {
    console.error('Error refining reel:', err);
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
