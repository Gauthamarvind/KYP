import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  FlaskConical, 
  Clock,
  Share2
} from 'lucide-react';
import { PhraseEntry } from '../types/phrase';
import { speakPhrase } from '../utils/speech';
import { hapticTap, hapticBookmark, hapticSuccess, hapticSelection } from '../utils/haptics';
import { motion } from 'motion/react';

interface PhraseCardProps {
  phrase: PhraseEntry;
  isBookmarked: boolean;
  onToggleBookmark: (phrase: PhraseEntry) => void;
  onOpenDetail: (phrase: PhraseEntry) => void;
  onTestInLab: (phrase: PhraseEntry) => void;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  isBookmarked,
  onToggleBookmark,
  onOpenDetail,
  onTestInLab
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [showFullIntent, setShowFullIntent] = useState(false);

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleCopyQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticSuccess();
    navigator.clipboard.writeText(`"${phrase.authentic_phrase}" — Authentic restoration via Know Your Phrases`);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticSuccess();

    const shareData = {
      title: `Know Your Phrases: "${phrase.authentic_phrase}"`,
      text: `📜 "${phrase.authentic_phrase}"\n\n❌ Commonly Truncated: "${phrase.common_phrase}"\n💡 True Intent: ${phrase.key_takeaway}\n🏛️ Origin: ${phrase.historical_origin}\n\nRestored via Know Your Phrases`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setHasShared(true);
        setTimeout(() => setHasShared(false), 2500);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return; // User dismissed share sheet
      }
    }

    // Fallback: Copy rich formatted text to clipboard
    try {
      await navigator.clipboard.writeText(
        `📜 KNOW YOUR PHRASES RESTORATION\n\n"${phrase.authentic_phrase}"\n\n❌ Truncated: "${phrase.common_phrase}"\n💡 Original Intent: ${phrase.original_intent}\n🏛️ Origin: ${phrase.historical_origin} (${phrase.source_citation})\n\nRestored via Know Your Phrases`
      );
      setHasShared(true);
      setTimeout(() => setHasShared(false), 2500);
    } catch {
      // Ignore clipboard fallback failure
    }
  };

  const handleCardClick = () => {
    hapticSelection();
    onOpenDetail(phrase);
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticBookmark();
    onToggleBookmark(phrase);
  };

  const handleLabJump = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticTap();
    onTestInLab(phrase);
  };

  const getShiftBadge = (type: string) => {
    switch (type) {
      case 'Reversed':
        return { label: '180° Inverted Meaning', color: 'text-rose-400' };
      case 'Truncated':
        return { label: 'Crucial Lost Half', color: 'text-amber-400' };
      case 'Misattributed':
        return { label: 'Misattributed Root', color: 'text-purple-400' };
      default:
        return { label: 'Historical Semantic Shift', color: 'text-sky-400' };
    }
  };

  const badgeInfo = getShiftBadge(phrase.meaning_shift_type);

  return (
    <motion.div 
      whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between relative group cursor-pointer border border-white/[0.08] h-full"
      onClick={handleCardClick}
    >
      <div className="flex-1 flex flex-col">
        {/* Top Clean Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-medium text-zinc-300 truncate max-w-[110px] sm:max-w-[160px]">{phrase.category}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className={`font-medium truncate ${badgeInfo.color}`}>{badgeInfo.label}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className={`p-1.5 rounded-full transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                hasShared 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'text-zinc-400 hover:text-amber-300 hover:bg-white/[0.06]'
              }`}
              title="Share restored idiom with friends"
            >
              {hasShared ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleBookmarkToggle}
              className={`p-1.5 rounded-full transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                isBookmarked 
                  ? 'bg-amber-400/20 text-amber-300' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
              }`}
              title={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Truncated / Modern Version Contrast */}
        <div className="mb-2.5 sm:mb-3 px-3 py-2 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.04]">
          <div className="text-[10px] sm:text-[11px] text-zinc-500 font-medium mb-0.5">
            Commonly Truncated
          </div>
          <p className="text-zinc-400 font-serif-literary line-through decoration-rose-400/50 decoration-1 text-xs sm:text-sm">
            "{phrase.common_phrase}"
          </p>
        </div>

        {/* Complete Authentic Restored Version */}
        <div className="mb-3 sm:mb-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-950/20 via-zinc-900/60 to-zinc-950/80 border border-amber-400/25 shadow-inner relative overflow-hidden group/quote">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Authentic Restoration</span>
            </div>

            {/* Apple-style Sound Wave button */}
            <button
              type="button"
              onClick={handleAudioPlay}
              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all min-h-[28px] shrink-0 ${
                isPlayingAudio 
                  ? 'bg-amber-400 text-zinc-950' 
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white'
              }`}
              title="Listen to phrase"
            >
              {isPlayingAudio ? (
                <div className="flex items-end gap-0.5 h-3 px-0.5">
                  <span className="w-0.5 bg-zinc-950 rounded-full animate-wave-1" />
                  <span className="w-0.5 bg-zinc-950 rounded-full animate-wave-2" />
                  <span className="w-0.5 bg-zinc-950 rounded-full animate-wave-3" />
                  <span className="w-0.5 bg-zinc-950 rounded-full animate-wave-4" />
                </div>
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              <span className="text-[10px]">{isPlayingAudio ? 'Playing' : 'Listen'}</span>
            </button>
          </div>

          <p className="text-zinc-100 font-serif-literary text-sm sm:text-base font-medium leading-relaxed italic">
            "{phrase.authentic_phrase}"
          </p>
        </div>

        {/* Revelation Takeaway */}
        <div className="mb-2.5 sm:mb-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-300 leading-normal">
            <span className="text-amber-300 font-medium">True Intent: </span>
            {phrase.key_takeaway}
          </p>
        </div>

        {/* Intent Description snippet */}
        <div className="text-xs text-zinc-400 mb-3 sm:mb-4 flex-1">
          <p className="line-clamp-2">
            {phrase.original_intent}
          </p>
        </div>

        {/* Origin Metadata */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-2.5 sm:pt-3 border-t border-white/[0.06]">
          <Clock className="w-3 h-3 text-zinc-500 shrink-0" />
          <span className="truncate">{phrase.historical_origin}</span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-2.5 sm:pt-3 mt-2.5 sm:mt-3 border-t border-white/[0.06] flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className={`px-2 sm:px-2.5 py-1.5 rounded-full border transition-all text-xs flex items-center gap-1 min-h-[32px] ${
              hasShared
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-amber-200 border-white/[0.06] hover:border-amber-400/20'
            }`}
            title="Share restored idiom with friends"
          >
            {hasShared ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Shared</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3 text-amber-400" />
                <span className="text-[11px] hidden xs:inline">Share</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyQuote}
            className="px-2 sm:px-2.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] transition-all text-xs flex items-center gap-1 min-h-[32px]"
            title="Copy authentic phrase"
          >
            {hasCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[11px] hidden xs:inline">Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleLabJump}
            className="px-2 sm:px-2.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 hover:text-amber-200 border border-white/[0.06] hover:border-amber-400/20 transition-all text-xs flex items-center gap-1 min-h-[32px]"
            title="Test in Sentence Lab"
          >
            <FlaskConical className="w-3 h-3 text-amber-400" />
            <span className="text-[11px]">Lab</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetail(phrase)}
          className="px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-zinc-950 font-medium text-xs flex items-center gap-1 transition-all min-h-[32px] shrink-0 active:scale-95"
        >
          <span>Deep Dive</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};
