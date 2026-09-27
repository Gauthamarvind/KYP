import React from 'react';
import { Calendar, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { PhraseEntry } from '../types/phrase';
import { hapticBookmark, hapticSelection } from '../utils/haptics';
import { motion } from 'motion/react';

interface DailyPhraseCardProps {
  phrase: PhraseEntry;
  onOpenDetail: (phrase: PhraseEntry) => void;
  isBookmarked: boolean;
  onToggleBookmark: (phrase: PhraseEntry) => void;
}

export const DailyPhraseCard: React.FC<DailyPhraseCardProps> = ({
  phrase,
  onOpenDetail,
  isBookmarked,
  onToggleBookmark
}) => {
  const handleBookmark = () => {
    hapticBookmark();
    onToggleBookmark(phrase);
  };

  const handleOpen = () => {
    hapticSelection();
    onOpenDetail(phrase);
  };

  return (
    <motion.div 
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-3xl glass-panel-elevated border border-white/[0.1] p-6 sm:p-7 shadow-xl group"
    >
      {/* Soft warm ambient lighting inside card */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/20">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-400 block">
              Featured Restored Phrase of the Day
            </span>
            <span className="text-[11px] text-zinc-400 font-serif-literary">
              Uncovering forgotten wisdom every 24 hours
            </span>
          </div>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-2 rounded-full transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
            isBookmarked 
              ? 'bg-amber-400/20 text-amber-300' 
              : 'bg-white/[0.04] text-zinc-400 hover:text-white'
          }`}
          title="Bookmark daily phrase"
        >
          {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
        <div className="md:col-span-8 space-y-1.5">
          <div className="text-xs text-zinc-400">
            Commonly Truncated: <span className="line-through decoration-rose-400/60">"{phrase.common_phrase}"</span>
          </div>
          <p className="text-base sm:text-xl font-serif-literary font-medium text-zinc-100 italic leading-snug">
            "{phrase.authentic_phrase}"
          </p>
          <p className="text-xs text-zinc-400 font-serif-literary">
            <span className="text-emerald-400 font-medium">True Intent: </span>
            {phrase.original_intent}
          </p>
        </div>

        <div className="md:col-span-4 flex md:justify-end">
          <button
            onClick={handleOpen}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all min-h-[40px]"
          >
            <span>Explore Backstory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
