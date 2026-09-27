import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  RefreshCw, 
  BookOpen, 
  Lightbulb, 
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { PhraseEntry, SentenceValidationResult } from '../types/phrase';
import { CURATED_PHRASES } from '../data/curatedPhrases';
import { speakPhrase } from '../utils/speech';
import { motion, AnimatePresence } from 'motion/react';

interface SentenceValidatorProps {
  initialPhrase?: PhraseEntry | null;
  onClearInitialPhrase?: () => void;
}

export const SentenceValidator: React.FC<SentenceValidatorProps> = ({
  initialPhrase,
  onClearInitialPhrase
}) => {
  const [selectedPhrase, setSelectedPhrase] = useState<string>(
    initialPhrase ? initialPhrase.common_phrase : 'Jack of all trades, master of none.'
  );
  const [userSentence, setUserSentence] = useState<string>(
    initialPhrase ? initialPhrase.modern_flawed_example : 'Don’t hire him for this role; he’s just a jack of all trades, master of none.'
  );
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<SentenceValidationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (initialPhrase) {
      setSelectedPhrase(initialPhrase.common_phrase);
      setUserSentence(initialPhrase.modern_flawed_example);
      setResult(null);
    }
  }, [initialPhrase]);

  const handleValidate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userSentence.trim()) return;

    setIsValidating(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/phrases/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phrase: selectedPhrase,
          userSentence: userSentence.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to validate sentence. Please try again.');
      }

      const data: SentenceValidationResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with validation engine.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSelectPreset = (curated: PhraseEntry, type: 'flawed' | 'authentic') => {
    setSelectedPhrase(curated.common_phrase);
    setUserSentence(type === 'flawed' ? curated.modern_flawed_example : curated.authentic_usage_example);
    setResult(null);
  };

  const handleSpeakImproved = () => {
    if (!result?.improved_sentence) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    speakPhrase(result.improved_sentence, () => {
      setIsPlayingAudio(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-amber-300 text-xs font-medium mb-3 backdrop-blur-md">
          <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Phrase Usage Lab</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold font-display text-zinc-100">
          Sentence Validator & Intent Checker
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-serif-literary leading-relaxed">
          Verify whether your sentences adhere to the authentic historical intent or perpetuate modern misconceptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Card */}
        <div className="lg:col-span-6 space-y-5">
          <div className="glass-panel-elevated p-5 sm:p-6 rounded-3xl border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Configure Test Sentence
            </h3>

            {/* Target Idiom Selector */}
            <div>
              <label className="block text-xs text-zinc-400 font-medium mb-1.5">
                Target Idiom
              </label>
              <select
                value={selectedPhrase}
                onChange={(e) => {
                  setSelectedPhrase(e.target.value);
                  const found = CURATED_PHRASES.find(p => p.common_phrase === e.target.value);
                  if (found) {
                    setUserSentence(found.modern_flawed_example);
                  }
                  setResult(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] text-zinc-200 text-xs sm:text-sm font-medium focus:border-amber-400/50 focus:outline-none"
              >
                {CURATED_PHRASES.map((p) => (
                  <option key={p.id} value={p.common_phrase}>
                    {p.common_phrase}
                  </option>
                ))}
              </select>
            </div>

            {/* Sample Benchmarks */}
            <div>
              <span className="block text-[11px] text-zinc-400 mb-1.5 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                Quick Test Benchmarks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const found = CURATED_PHRASES.find(p => p.common_phrase === selectedPhrase) || CURATED_PHRASES[0];
                    handleSelectPreset(found, 'flawed');
                  }}
                  className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[11px] font-medium transition-colors"
                >
                  Load Common Misuse
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const found = CURATED_PHRASES.find(p => p.common_phrase === selectedPhrase) || CURATED_PHRASES[0];
                    handleSelectPreset(found, 'authentic');
                  }}
                  className="px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium transition-colors"
                >
                  Load Authentic Intent
                </button>
              </div>
            </div>

            {/* User Sentence Textarea */}
            <div>
              <label className="block text-xs text-zinc-400 font-medium mb-1.5">
                Sentence Under Evaluation:
              </label>
              <textarea
                rows={4}
                value={userSentence}
                onChange={(e) => setUserSentence(e.target.value)}
                placeholder="Type or paste the sentence you want to test..."
                className="w-full p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-serif-literary text-sm leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleValidate}
              disabled={isValidating || !userSentence.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 disabled:opacity-50 text-zinc-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-98 transition-all min-h-[44px]"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Evaluating Historical Intent...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Validate Intent & Phrasing</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Right Result Card */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`glass-panel-elevated p-5 sm:p-6 rounded-3xl border space-y-4 ${
                  result.usage_validity === 'Correct'
                    ? 'border-emerald-500/30'
                    : 'border-rose-500/30'
                }`}
              >
                {/* Validity Header */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    {result.usage_validity === 'Correct' ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <AlertOctagon className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase font-medium">Verdict</span>
                      <span className={`text-base font-semibold ${
                        result.usage_validity === 'Correct' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {result.usage_validity === 'Correct' ? 'Historically Authentic' : 'Modern Misconception'}
                      </span>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    result.usage_validity === 'Correct'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {result.usage_validity}
                  </span>
                </div>

                {/* Critique Breakdown */}
                <div className="space-y-1">
                  <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Usage Analysis:
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-200 font-serif-literary leading-relaxed bg-white/[0.02] p-3.5 rounded-2xl border border-white/[0.05]">
                    {result.usage_critique}
                  </p>
                </div>

                {/* Detected Authentic Root */}
                <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-400/20">
                  <span className="text-[10px] text-amber-300 block uppercase font-medium mb-0.5">
                    Authentic Root:
                  </span>
                  <p className="text-xs text-zinc-200 font-serif-literary italic">
                    "{result.original_phrase_detected}"
                  </p>
                </div>

                {/* Exemplar Sentence */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wide flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Exemplar Authentic Usage:
                    </span>
                    <button
                      onClick={handleSpeakImproved}
                      className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1"
                    >
                      {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100 font-serif-literary italic bg-emerald-950/20 p-3 rounded-2xl border border-emerald-500/20">
                    "{result.improved_sentence}"
                  </p>
                </div>

                {/* Historical Note */}
                <div className="pt-2 text-[11px] text-zinc-500 border-t border-white/[0.06] flex items-start gap-1">
                  <span className="text-zinc-400 font-medium shrink-0">Note:</span>
                  <span>{result.historical_context_note}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[300px] rounded-3xl glass-panel border border-white/[0.06] p-8 flex flex-col items-center justify-center text-center"
              >
                <FlaskConical className="w-10 h-10 text-zinc-600 mb-3" />
                <h4 className="text-zinc-300 font-medium text-sm">Awaiting Evaluation</h4>
                <p className="text-xs text-zinc-500 max-w-xs mt-1 font-serif-literary">
                  Enter a sentence on the left or select a benchmark to observe the precision analysis.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
