import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Share2, 
  Check, 
  FlaskConical, 
  History, 
  Quote
} from 'lucide-react';
import { PhraseEntry } from '../types/phrase';
import { speakPhrase } from '../utils/speech';
import { hapticTap, hapticBookmark, hapticSuccess } from '../utils/haptics';
import { motion, AnimatePresence } from 'motion/react';

interface PhraseDetailModalProps {
  phrase: PhraseEntry | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (phrase: PhraseEntry) => void;
  onTestInLab: (phrase: PhraseEntry) => void;
}

export const PhraseDetailModal: React.FC<PhraseDetailModalProps> = ({
  phrase,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onTestInLab
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasCopiedShare, setHasCopiedShare] = useState(false);

  if (!phrase) return null;

  const handleAudioPlay = () => {
    hapticTap();
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    speakPhrase(phrase.authentic_phrase, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleShare = () => {
    hapticSuccess();
    const shareText = `📜 KNOW YOUR PHRASES: RESTORATION
    
❌ Modern Truncated: "${phrase.common_phrase}"
✅ Authentic Restored: "${phrase.authentic_phrase}"

💡 Original Intent: ${phrase.original_intent}
⚠️ Modern Misconception: ${phrase.modern_misconception}

🏛️ Origin: ${phrase.historical_origin} (${phrase.source_citation})
✨ Key Takeaway: ${phrase.key_takeaway}

Restored via Know Your Phrases`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setHasCopiedShare(true);
      setTimeout(() => setHasCopiedShare(false), 2500);
    }
  };

  const handleBookmark = () => {
    hapticBookmark();
    onToggleBookmark(phrase);
  };

  const handleLabJump = () => {
    hapticTap();
    onClose();
    onTestInLab(phrase);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()} 
          className="relative w-full max-w-3xl glass-panel-elevated rounded-t-3xl sm:rounded-3xl border border-white/[0.12] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* iOS Grab handle on mobile */}
          <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1" />

          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between gap-3 sticky top-0 bg-zinc-950/70 backdrop-blur-xl z-10">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">{phrase.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-medium">{phrase.meaning_shift_type} Shift</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                  isBookmarked 
                    ? 'bg-amber-400/20 text-amber-300' 
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                }`}
                title="Save to bookmarks"
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-amber-300 border border-white/[0.06] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                title="Share restored card"
              >
                {hasCopiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-white/[0.06] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
            {/* Main Highlight Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/30 via-zinc-900/80 to-zinc-950 border border-amber-400/30 shadow-lg relative overflow-hidden">
              <Quote className="absolute -right-4 -bottom-4 w-28 h-28 text-amber-400/5 pointer-events-none" />
              
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Historically Authentic Restoration
                </span>

                <button
                  onClick={handleAudioPlay}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isPlayingAudio 
                      ? 'bg-amber-400 text-zinc-950' 
                      : 'bg-white/[0.08] hover:bg-white/[0.15] text-amber-300 hover:text-amber-200'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop Recitation</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Recite Aloud</span>
                    </>
                  )}
                </button>
              </div>

              <h2 className="text-lg sm:text-2xl font-serif-literary font-medium text-zinc-100 leading-relaxed italic mb-4">
                "{phrase.authentic_phrase}"
              </h2>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                  {phrase.key_takeaway}
                </p>
              </div>
            </div>

            {/* Side-by-Side Comparative Contrast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Modern Distortion */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-rose-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Modern Truncated Distortion</span>
                  </div>
                  <p className="text-zinc-400 font-serif-literary line-through decoration-rose-400/60 mb-2.5 text-sm">
                    "{phrase.common_phrase}"
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {phrase.modern_misconception}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-zinc-400">
                  <span className="font-medium text-rose-300">Common Misuse: </span>
                  <span className="italic font-serif-literary">"{phrase.modern_flawed_example}"</span>
                </div>
              </div>

              {/* Original Intent */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-emerald-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Original Historical Intent</span>
                  </div>
                  <p className="text-emerald-200 font-serif-literary mb-2.5 text-sm font-medium">
                    {phrase.original_intent}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-zinc-400">
                  <span className="font-medium text-emerald-300">Proper Authentic Usage: </span>
                  <span className="italic font-serif-literary">"{phrase.authentic_usage_example}"</span>
                </div>
              </div>
            </div>

            {/* Etymology & Backstory Deep Dive */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm sm:text-base">
                <History className="w-4 h-4 text-amber-400" />
                <span>Etymology & Historical Evolution</span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 font-serif-literary leading-relaxed">
                {phrase.etymology_deep_dive}
              </p>

              {/* Citation Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/[0.06] text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-zinc-500 block text-[11px] font-medium">Historical Era & Origin</span>
                  <span className="text-zinc-300 font-medium">{phrase.historical_origin}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-zinc-500 block text-[11px] font-medium">First Recorded Source</span>
                  <span className="text-zinc-300 font-medium">{phrase.source_citation}</span>
                </div>
              </div>
            </div>

            {/* Tags (Zero-Pill clean inline list) */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
              <span className="text-zinc-500 font-medium mr-1">Tags:</span>
              {phrase.tags.map((tag, idx) => (
                <span key={tag} className="text-zinc-400">
                  #{tag}{idx < phrase.tags.length - 1 && <span className="ml-1 text-zinc-600">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-zinc-950/70 backdrop-blur-md flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors min-h-[40px]"
            >
              {hasCopiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
              <span>{hasCopiedShare ? 'Card Copied!' : 'Copy Formatted Card'}</span>
            </button>

            <button
              type="button"
              onClick={handleLabJump}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-zinc-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-96 transition-all min-h-[40px]"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Test In Usage Lab</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
