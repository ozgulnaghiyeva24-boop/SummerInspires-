export type ContentPillar = 'results' | 'traps' | 'tips';

export type FunnelGoal =
  | 'trust_lesson'
  | 'objection_breaker'
  | 'warm_enrollment'
  | 'smart_educational';

export interface ScriptSegment {
  timeRange: string;
  label: string;
  spokenText: string;
  deliveryNote: string;
  editDirection?: string;
  visualInsertType?: string;
  visualInsertIdea?: string;
  searchKeyword?: string;
  soundEffect?: string;
}

export interface EditSuggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  capcutSearchKeyword: string;
  durationSeconds: string;
  soundHint: string;
}

export interface VisualAndBroll {
  socialProof: string[];
  onScreenText: string[];
  brollIdeas: string[];
}

export interface DmReplyFlow {
  firstReply: string;
  followUpQuestion: string;
  bookingInvite: string;
}

export interface CtaSection {
  spokenCta: string;
  dmKeyword: string;
  leadNote: string;
  dmReplies?: DmReplyFlow;
}

export interface CaptionSection {
  caption: string;
  hashtags: string[];
}

export interface ReelPackage {
  id: string;
  title: string;
  pillar: ContentPillar;
  pillarLabel: string;
  funnelGoal?: FunnelGoal;
  funnelGoalLabel?: string;
  estimatedDuration: string;
  sourceTopic: string;
  targetBand?: string;
  createdAt: string;
  hooks: string[];
  scriptSegments: ScriptSegment[];
  visualAndBroll: VisualAndBroll;
  cta: CtaSection;
  captionAndHashtags: CaptionSection;
}

export interface FewShotExample {
  id: string;
  title: string;
  pillar: ContentPillar;
  inputTopic: string;
  hookSample: string;
  scriptSample: string;
  ctaSample: string;
  active: boolean;
}

export interface ScenarioAngle {
  id: string;
  angleTitle: string;
  pillar: ContentPillar;
  funnelGoal?: FunnelGoal;
  targetAudience: string;
  corePainPoint: string;
  strategyHook: string;
  samplePrompt: string;
}

export type ActiveTab = 'studio' | 'angles' | 'fewshot' | 'archive';
