import React from 'react';
import { History, X, ArrowRight, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { PhraseEntry } from '../types/phrase';
import { motion } from 'motion/react';
import { speakPhrase } from '../utils/speech';
import { hapticTap, hapticSelection } from '../utils/haptics';

interface RecentlyViewedSectionProps {
  recentPhrases: PhraseEntry[];
  onOpenDetail: (phrase: PhraseEntry) => void;
  onClearRecents: () => void;
  onRemoveRecent: (id: string, e: React.MouseEvent) => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  recentPhrases,
  onOpenDetail,
  onClearRecents,
  onRemoveRecent
}) => {
  const [playingId, setPlayingId] = React.useState<string | null>(null);

  if (recentPhrases.length === 0) return null;

  const handleSpeech = (phrase: PhraseEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    hapticTap();
    if (playingId === phrase.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }
    setPlayingId(phrase.id);
    speakPhrase(phrase.authentic_phrase, () => {
      setPlayingId(null);
    });
  };

  const handleCardClick = (phrase: PhraseEntry) => {
    hapticSelection();
    onOpenDetail(phrase);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    hapticTap();
    onRemoveRecent(id, e);
  };

  const handleClear = () => {
    hapticTap();
    onClearRecents();
  };

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5 pb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20">
            <History className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold font-display text-zinc-200">
              Recently Viewed
            </h3>
            <span className="text-[11px] text-zinc-500 font-medium">
              · Last {recentPhrases.length}
            </span>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="text-xs text-zinc-400 hover:text-rose-300 hover:underline transition-colors font-medium flex items-center gap-1 px-2 py-1 rounded-full hover:bg-white/[0.04]"
          title="Clear recent history"
        >
          <span>Clear</span>
        </button>
      </div>

      {/* Horizontal Fluid Carousel / Snap Rail */}
      <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
        {recentPhrases.map((phrase, idx) => (
          <motion.div
            key={phrase.id}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.35,
              delay: idx * 0.05,
              ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            onClick={() => handleCardClick(phrase)}
            className="w-[280px] sm:w-[310px] shrink-0 glass-card rounded-2xl p-4 border border-white/[0.08] hover:border-amber-400/30 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-lg transition-all"
          >
            <div>
              {/* Top info and delete */}
              <div className="flex items-center justify-between gap-1.5 mb-2 text-[11px]">
                <span className="text-zinc-400 font-medium truncate max-w-[170px]">
                  {phrase.category}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-amber-400/90 font-medium">
                    {phrase.meaning_shift_type}
                  </span>
                  <button
                    onClick={(e) => handleRemove(phrase.id, e)}
                    className="p-1 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.08] transition-colors"
                    title="Remove from recents"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Truncated line */}
              <div className="text-[11px] text-zinc-500 line-through decoration-rose-400/50 mb-1.5 truncate">
                "{phrase.common_phrase}"
              </div>

              {/* Restored quote */}
              <p className="text-xs sm:text-sm font-serif-literary text-zinc-200 font-medium italic line-clamp-2 leading-relaxed mb-2 group-hover:text-zinc-100 transition-colors">
                "{phrase.authentic_phrase}"
              </p>
            </div>

            {/* Bottom mini bar */}
            <div className="pt-2.5 mt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={(e) => handleSpeech(phrase, e)}
                className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-full transition-colors ${
                  playingId === phrase.id 
                    ? 'bg-amber-400 text-zinc-950 font-medium' 
                    : 'text-zinc-400 hover:text-amber-300 hover:bg-white/[0.06]'
                }`}
                title="Listen"
              >
                {playingId === phrase.id ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
                <span>{playingId === phrase.id ? 'Playing' : 'Audio'}</span>
              </button>

              <span className="text-amber-400 text-[11px] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
