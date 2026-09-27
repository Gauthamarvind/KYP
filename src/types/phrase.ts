export type MeaningShiftType = 'Reversed' | 'Weakened' | 'Truncated' | 'Misattributed' | 'Shifted' | 'Refined';

export interface PhraseEntry {
  id: string;
  common_phrase: string;
  authentic_phrase: string;
  shortened_fragment?: string;
  category: string;
  original_intent: string;
  modern_misconception: string;
  meaning_shift_type: MeaningShiftType;
  historical_origin: string;
  source_citation: string;
  etymology_deep_dive: string;
  authentic_usage_example: string;
  modern_flawed_example: string;
  tags: string[];
  key_takeaway: string;
  isCustomAiGenerated?: boolean;
}

export interface SentenceValidationResult {
  phrase: string;
  user_sentence: string;
  usage_validity: 'Correct' | 'Incorrect';
  usage_critique: string;
  original_phrase_detected: string;
  intended_meaning_applied: boolean;
  improved_sentence: string;
  historical_context_note: string;
}

export interface QuizQuestion {
  id: string;
  phraseId: string;
  commonPhrase: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  authenticPhrase: string;
}
