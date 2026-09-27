import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { PhraseEntry } from '../types/phrase';
import { PhraseCard } from './PhraseCard';
import { motion } from 'motion/react';

interface BookmarksViewProps {
  bookmarks: PhraseEntry[];
  onToggleBookmark: (phrase: PhraseEntry) => void;
  onOpenDetail: (phrase: PhraseEntry) => void;
  onTestInLab: (phrase: PhraseEntry) => void;
  onClearAll: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onToggleBookmark,
  onOpenDetail,
  onTestInLab,
  onClearAll
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-semibold font-display text-zinc-100">
              Saved Restorations
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
              {bookmarks.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 font-serif-literary mt-0.5">
            Your personal treasury of authentic proverbs and corrected idioms.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-rose-500/10 text-zinc-400 hover:text-rose-300 border border-white/[0.06] hover:border-rose-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors min-h-[36px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl glass-panel border border-white/[0.06]">
          <Bookmark className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-zinc-300 font-semibold text-base">No Saved Phrases Yet</h3>
          <p className="text-xs sm:text-sm text-zinc-500 font-serif-literary max-w-sm mx-auto mt-1">
            Tap the bookmark icon on any restored phrase card to collect and review them here anytime.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((phrase, index) => (
            <motion.div
              key={phrase.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.45,
                delay: (index % 3) * 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="h-full flex flex-col"
            >
              <PhraseCard
                phrase={phrase}
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
                onOpenDetail={onOpenDetail}
                onTestInLab={onTestInLab}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
