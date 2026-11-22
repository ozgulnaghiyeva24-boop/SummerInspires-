import { ContentPillar, FewShotExample, FunnelGoal, ReelPackage } from '../types';

export const PILLAR_META: Record<
  ContentPillar,
  { label: string; shortLabel: string; description: string }
> = {
  results: {
    label: 'Tələbə Nəticələri və Case Study-lər',
    shortLabel: 'Tələbə Nəticələri',
    description:
      'Əvvəlki bal, qarşılaşdığı çətinlik, dərsdə tətbiq olunan konkret metod və final IELTS nəticəsi.',
  },
  traps: {
    label: 'İmtahan Tələləri və Həllər',
    shortLabel: 'İmtahan Tələləri',
    description:
      'Speaking həyəcanı, Listening diqqət dağınıqlığı, vaxt bölgüsü və praktik çıxış yolları.',
  },
  tips: {
    label: 'Sürətli Bal Artıran İpucları',
    shortLabel: 'Sürətli İpucları',
    description:
      'Band 6.0 ifadələrini Band 8.0 səviyyəsinə qaldıran əvəzləmələr və açar sözlər.',
  },
};

export const FUNNEL_GOAL_META: Record<
  FunnelGoal,
  { label: string; shortLabel: string; description: string }
> = {
  trust_lesson: {
    label: 'Etibar və Dərs İçi Sübut',
    shortLabel: 'Dərs İçi Sübut',
    description:
      'Müəllimin real dərsdə tələbənin səhvini necə düzəltdiyini göstərərək peşəkar güvən yaradır.',
  },
  objection_breaker: {
    label: 'Şübhə və Qorxuları Qıran',
    shortLabel: 'Şübhə Qıran',
    description:
      '"Daha əvvəl kursa getdim alınmadı" və ya "Səviyyəm zəifdir" tərəddüdünə səmimi cavab verir.',
  },
  warm_enrollment: {
    label: 'Səmimi Dərs və Qrup Dəvəti',
    shortLabel: 'Səmimi Dəvət',
    description:
      'Aqressiv reklam olmadan, niyə az yer götürdüyünü və dərs sistemini izah edərək DM-ə yönəldir.',
  },
  smart_educational: {
    label: 'Satışa Bağlanan Öyrədici',
    shortLabel: 'Öyrədici + Mentor',
    description:
      'Dəyərli ipucu verir, amma tək əzbərin niyə yetmədiyini və fərdi rəyin önəmini göstərir.',
  },
};

export const QUICK_PROMPTS: Array<{
  label: string;
  pillar: ContentPillar;
  funnelGoal: FunnelGoal;
  topic: string;
  targetBand: string;
}> = [
  {
    label: 'Dərs içi real səhv düzəlişi',
    pillar: 'results',
    funnelGoal: 'trust_lesson',
    topic:
      'Dərsdə tələbəmin Speaking Part 2 cavabını 20 saniyədə Band 6.0-dan 7.5 səviyyəsinə necə düzəltdik',
    targetBand: 'Band 7.5+',
  },
  {
    label: 'Əvvəlki kursda alınmayanlar',
    pillar: 'traps',
    funnelGoal: 'objection_breaker',
    topic:
      'Daha əvvəl kursa gedib yenə 6.0-da qalan tələbələr niyə özlərini günahlandırır, amma problem sistemdədir?',
    targetBand: 'Band 7.0–8.0',
  },
  {
    label: 'Listening: 6.0 -> 8.0 (2 ay)',
    pillar: 'results',
    funnelGoal: 'trust_lesson',
    topic: 'Tələbəm 2 aya Listening-i 6.0-dan 8.0-a qaldırdı',
    targetBand: 'Band 8.0',
  },
  {
    label: 'Səmimi qrup dəvəti',
    pillar: 'results',
    funnelGoal: 'warm_enrollment',
    topic:
      'Növbəti ayın qrupuna niyə cəmi 5-6 nəfər götürürəm və kimlər bu dərs formatında ən tez nəticə alır?',
    targetBand: 'Band 7.5+',
  },
];

export const DEFAULT_FEW_SHOT_EXAMPLES: FewShotExample[] = [
  {
    id: 'fs-1',
    title: 'Dərs İçi Etibar: Speaking 5.5 -> 7.5',
    pillar: 'results',
    inputTopic: 'Tələbəm 6 həftəyə Speaking-i 5.5-dən 7.5-ə qaldırdı',
    hookSample:
      'Dünən dərsdə bir tələbəm mənə "müəllim, mən ingiliscə bilirəm, amma danışanda beynim donur" dedi — 6 həftə əvvəl eyni cümləni 5.5 alan başqa tələbəm də demişdi.',
    scriptSample:
      '0–3 san: "İngiliscə bilirəm, amma imtahanda danışanda beynim donur" — bu cümləni dərsdə az qala hər həftə eşidirəm.\n3–15 san: 6 həftə əvvəl yanıma gələn tələbəm də 5.5-də ilişib qalmışdı. Səbəb söz bilməməyi deyildi; hər cümlədə qrammatik səhv etməkdən qorxub səsini itirirdi.\n15–30 san: Biz dərslərdə əzbər mövzuları kənara qoyduq. Hər dərs onun real səs yazısını açıb birlikdə 2 xırda düzəliş etdik və "Fikir + Səbəb + Şəxsi misal" strukturunu vərdişə çevirdik.\n30–45 san: Ötən həftə rəsmi nəticəsi 7.5 gəldi. Əgər sən də bildiyini danışa bilməməkdən yorulmusansa, rəyə "SPEAKING" yaz, qısa səsli səviyyə yoxlaması üçün sənə yazım.',
    ctaSample: 'Rəyə "SPEAKING" yaz, qısa səviyyə yoxlaması üçün sənə yazım.',
    active: true,
  },
  {
    id: 'fs-2',
    title: 'Şübhə Qıran: Niyə tək test işləmək işə yaramır?',
    pillar: 'traps',
    inputTopic: 'Listening Part 3-də düzgün cavabı eşidib yenə səhv yazmaq',
    hookSample:
      'Hər gün 2 Cambridge testi işləyib yenə Listening-də 6.0 alırsansa, zəhmət olmasa özünü "məndən alınmır" deyib günahlandırma.',
    scriptSample:
      '0–3 san: Hər gün test işləyib yenə 6.0 alırsansa, problem səndə deyil — metodundadır.\n3–15 san: Mənə müraciət edən tələbələrin çoxu "artıq ümidim qalmayıb" deyir. Çünki testdə səhv çıxan sualın niyə səhv olduğunu bilmədən növbəti testə keçirlər.\n15–30 san: Biz dərsdə 10 test işlətmirik; 1 testin transkriptini açıb spikerin "actually" deyib fikrini harada dəyişdiyini tək-tək tapırıq. Tələbə səhvini gözlə görəndə bir daha o tələyə düşmür.\n30–45 san: 6 ildə gördüyüm ən böyük fərq elə budur. Sənə də belə aydın yol xəritəsi lazımdırsa, DM-ə "YOL" yaz, harada ilişdiyini birlikdə baxaq.',
    ctaSample: 'DM-ə "YOL" yaz, harada ilişdiyini birlikdə baxaq.',
    active: true,
  },
  {
    id: 'fs-3',
    title: 'Satışa Bağlanan İpucu: Əzbər niyə yetmir?',
    pillar: 'tips',
    inputTopic: 'Band 6.0 ifadələrini Band 8.0-a çevirmək, amma təbii işlətmək',
    hookSample:
      'Sənə indi Band 8.0 verən 2 ifadə deyəcəyəm, amma dürüst olum: təkcə bunu videodan əzbərləmək imtahanda balını qaldırmaya bilər.',
    scriptSample:
      '0–3 san: Dürüst olum: təkcə Instagram-dan "Band 8.0 sözləri" yadda saxlamaqla bal qalxmır.\n3–15 san: Çünki "very important" yerinə "pivotal", "very common" yerinə "widespread" deməyi əzbərləyirsən, amma Speaking-də həyəcanlananda yenə köhnə vərdişinə qayıdırsan.\n15–30 san: Sözü real bala çevirən şey onu kimsənin səni dinlədiyi anda — məsələn, dərsdə müəllimin dərhal "burada yerinə düşmədi, belə desən daha təbii olar" deməsi ilə məşq etməkdir.\n30–45 san: Bu iki ifadəni bu gün sına, əgər danışanda yerində işlətməyə çətinlik çəkirsənsə, rəyə "IELTS" yaz — dərslərimizdə bunu necə avtomatlaşdırdığımızı izah edim.',
    ctaSample: 'Rəyə "IELTS" yaz, dərslərimizdə bunu necə avtomatlaşdırdığımızı paylaşım.',
    active: true,
  },
];

export const INITIAL_SAVED_REELS: ReelPackage[] = [
  {
    id: 'saved-demo-1',
    title: '2 aya Listening 6.0 -> 8.0: Test sayını azaldıb nəticəni necə qaldırdıq?',
    pillar: 'results',
    pillarLabel: PILLAR_META.results.label,
    funnelGoal: 'trust_lesson',
    funnelGoalLabel: FUNNEL_GOAL_META.trust_lesson.label,
    estimatedDuration: '40 saniyə',
    sourceTopic: 'Tələbəm 2 aya Listening-i 6.0-dan 8.0-a qaldırdı',
    targetBand: 'Band 8.0',
    createdAt: '2026-11-20T10:30:00Z',
    hooks: [
      'Tələbəm hər gün test işləyib 6.0-da qalırdı — biz test sayını yarıya endirib 2 aya necə 8.0 aldıq?',
      'Listening-də 6.0-da ilişib qalmağın səbəbi qulağının zəif olması deyil; dərsdə bunu 10 dəqiqəyə sübut edirik.',
      'Düzünü desəm, "çox test işlə, düzələcək" məsləhəti tələbələrin ən çox vaxt itirdiyi mifdir.',
    ],
    scriptSegments: [
      {
        timeRange: '0–3 san',
        label: 'Nəticə / Səmimi Hook',
        spokenText:
          'Tələbəm hər gün test işləyib 6.0-da qalırdı — biz test sayını yarıya endirib 2 aya necə 8.0 aldıq?',
        deliveryNote: 'Kameraya yaxın, səmimi və sakit inamlı tonla danış.',
        editDirection: 'İlk 0.5 san boşluğu kəs, 100% -> 114% yavaş zoom-in et',
        visualInsertType: 'Ekran Yazısı + Nəticə',
        visualInsertIdea: 'Yuxarıda iri ağ yazı: "6.0 -> 8.0 (2 AYA)". Kadrda dinamika üçün kəsim.',
        searchKeyword: '6.0 to 8.0 badge',
        soundEffect: 'Yüngül whoosh / pop',
      },
      {
        timeRange: '3–15 san',
        label: 'Tələbənin əsl problemi',
        spokenText:
          'Yanıma gələndə artıq yorulmuşdu: "Müəllim, 15 kitab bitirmişəm, yenə Part 3-də itirəm" deyirdi. Səbəb səhv etdiyi sualın niyə səhv olduğunu analiz etməməyi idi.',
        deliveryNote: 'Tələbənin yaşadığı məyusluğu empatiya ilə ifadə et.',
        editDirection: 'Voiceover üstündə 1.5 san meme / kadr keçidi',
        visualInsertType: 'Meme + Tələbə Mesajı',
        visualInsertIdea:
          '"15 kitab bitirmişəm" deyəndə ekrana üst-üstə kitab yığılmış yorğun tələbə meme-i (və ya tələbənin WhatsApp mesajı) 1.5 san çıxsın.',
        searchKeyword: 'tired student books meme',
        soundEffect: 'Kağız vərəqləmə səsi',
      },
      {
        timeRange: '15–30 san',
        label: 'Dərsdə nəyi dəyişdik?',
        spokenText:
          'Biz sınaq sayını azaltdıq və dərslərdə "Transkript + Tələ Analizi"nə keçdik. Hər dərsdə audiosu bitmiş testin mətnini açıb spikerin fikrini harada dəyişdiyini birlikdə işarələdik.',
        deliveryNote: 'Masada qələmlə transkript üzərində qeyd apardığın kadrı göstər.',
        editDirection: 'Danışarkən 3 san real dərs B-roll kadrı üzərinə keç',
        visualInsertType: 'Real Dərs Kadrı (B-Roll)',
        visualInsertIdea:
          'Qırmızı və ya sarı markerlə IELTS test vərəqəsində "actually / however" sözlərini işarələdiyin yaxın plan kadr.',
        searchKeyword: 'highlighting notes closeup',
        soundEffect: 'Marker çəkmə / klik səsi',
      },
      {
        timeRange: '30–45 san',
        label: 'Nəticə və Səmimi Dəvət',
        spokenText:
          'Öz səhvini görməyə başlayanda tələbəmin özünəinamı qayıtdı və 8 həftədə rəsmi Listening balı 8.0 gəldi. Sən də aylardır eyni balda ilişmisənsə, rəyə "IELTS" yaz, hazırkı vəziyyətinə birlikdə baxaq.',
        deliveryNote: 'Sertifikat screenshot-u ekrana gəlir, isti gülümsəmə ilə bitir.',
        editDirection: 'Sertifikat şəklini 2 san overlay et, sonda 0.5 san gülümsəmə saxla',
        visualInsertType: 'Sosial Sübut + CTA',
        visualInsertIdea:
          'Rəsmi IELTS sertifikatında "Listening: 8.0" bölməsini yaxınlaşdırıb göstər, aşağıda "Rəyə IELTS yaz" alt yazısı çıxsın.',
        searchKeyword: 'certificate highlight arrow',
        soundEffect: 'Yüngül təsdiq ding səsi',
      },
    ],
    visualAndBroll: {
      socialProof: [
        'Tələbənin rəsmi IELTS sertifikatının ekran görüntüsü (Listening: 8.0 bölməsi)',
        'Dərs zamanı tələbənin WhatsApp-da yazdığı "Müəllim, bu dəfə Part 3-də tələləri tutdum" mesajı',
        'İlk diaqnostik bal (6.0) ilə son nəticənin (8.0) sadə müqayisəsi',
      ],
      onScreenText: ['6.0 -> 8.0 LISTENING', 'PROBLEM TEST SAYINDA DEYİL', '2 AYA REAL NƏTİCƏ'],
      brollIdeas: [
        '0–3 san: Müəllim kameraya səmimi şəkildə danışır (təbii pəncərə işığı)',
        '15–28 san: Dəftərdə açar sözlərin və distraktor siqnallarının altından xətt çəkilməsi',
        '30–40 san: Rəsmi nəticə vərəqəsinin kadrda görünməsi',
      ],
    },
    cta: {
      spokenCta:
        'Sən də aylardır eyni balda ilişib qalmısansa, rəyə "IELTS" yaz — sənə uyğun yol xəritəsini DM-də sakitcə danışaq.',
      dmKeyword: 'IELTS',
      leadNote:
        'Təzyiqsiz ("sakitcə danışaq") ifadəsi tələbə və valideynlərdə satış qorxusunu azaldır və səmimi söhbət başladır.',
      dmReplies: {
        firstReply:
          'Salam! Rəydə "IELTS" yazdığın üçün təşəkkür edirəm. Mən Özgül. Hazırda imtahana hazırlaşırsan, yoxsa yeni başlamağı düşünürsən?',
        followUpQuestion:
          'Anladım, səni çox yaxşı başa düşürəm — çox tələbə məhz bu mərhələdə yorulur. Hədəf balın neçədir və ən çox hansı bölmədə (Listening, Speaking, Writing) çətinlik çəkirsən?',
        bookingInvite:
          'Əla, onda gəl belə edək: sənə yük olmadan 15 dəqiqəlik qısa səviyyə tanışlığı edək, harada bal itirdiyini deyim. Uyğun olsa, fərdi və ya kiçik qrup dərslərimiz haqqında da detalları paylaşaram. Bu həftə hansı gün sənə rahatdır?',
      },
    },
    captionAndHashtags: {
      caption:
        'Çox vaxt tələbələrim mənə ilk dərsdə eyni cümləni deyir: "Müəllim, çox çalışıram, amma balım qalxmır."\n\nBu tələbəmlə 2 ayda Listening-i 6.0-dan 8.0-a qaldıranda test sayını artırmadıq — əksinə, azaltdıq. Çünki səhvin səbəbini görmədən işlənən hər yeni test sadəcə yorğunluq yaradır.\n\nƏgər sən də hazırda hansısa balda ilişib qalmısansa və yanında səhvlərini aydın göstərəcək bir mentor axtarırsansa, rəyə "IELTS" yaz və ya DM-ə keç — fərdi/qrup dərslərimizin sənə uyğun olub-olmadığını birlikdə dəyərləndirək.',
      hashtags: [
        '#ieltsbaku',
        '#ieltshazirliq',
        '#ieltslistening',
        '#xaricdetehsil',
        '#ingilisdili',
        '#ieltsazerbaijan',
        '#ieltsmentor',
        '#band8',
        '#teqaud',
      ],
    },
  },
];
