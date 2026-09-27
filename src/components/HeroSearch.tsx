import React, { useState } from 'react';
import { Search, Sparkles, Filter, X, ArrowRight, Lightbulb } from 'lucide-react';
import { CATEGORIES } from '../data/curatedPhrases';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedShiftType: string;
  setSelectedShiftType: (type: string) => void;
  onSearchSubmit: (e?: React.FormEvent) => void;
  isAiSearching: boolean;
  onSelectSuggestion: (phrase: string) => void;
}

const POPULAR_SUGGESTIONS = [
  'Jack of all trades',
  'Blood is thicker than water',
  'Curiosity killed the cat',
  'The customer is always right',
  'Great minds think alike',
  'Rome wasn’t built in a day',
  'Early bird gets the worm',
  'Carpe Diem',
  'Money is the root of all evil'
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedShiftType,
  setSelectedShiftType,
  onSearchSubmit,
  isAiSearching,
  onSelectSuggestion
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="relative overflow-hidden pt-4 sm:pt-6 pb-5 sm:pb-6 border-b border-white/[0.06]">
      {/* Ambient Apple-style soft lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Editorial Heading */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-amber-300 text-[11px] sm:text-xs font-medium mb-2.5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Historical Idiom Restoration Engine</span>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-semibold font-display tracking-tight text-zinc-100 text-balance leading-tight">
            Uncover the <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">True Half</span> of Famous Sayings
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-serif-literary leading-relaxed px-1">
            Centuries of cultural truncation have inverted the original intent of timeless proverbs. Type any fragment, proverb, or keyword to restore the authentic wording.
          </p>
        </div>

        {/* Apple-style Frosted Search Bar */}
        <form onSubmit={onSearchSubmit} className="relative group max-w-2xl mx-auto mb-3.5">
          <div className="relative flex items-center glass-panel-elevated rounded-2xl p-1 sm:p-1.5 focus-within:border-amber-400/50 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all duration-300 gap-1">
            <div className="pl-3 text-zinc-400 group-focus-within:text-amber-400 transition-colors pointer-events-none shrink-0">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fragment or keyword (e.g. 'blood thicker', 'jack of all')..."
              className="flex-1 min-w-0 px-2 py-2 sm:py-2.5 bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none text-xs sm:text-sm font-medium"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-full hover:bg-white/[0.08] transition-colors shrink-0"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              disabled={isAiSearching}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 disabled:opacity-50 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-96 transition-all shrink-0 min-h-[36px]"
            >
              {isAiSearching ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Decoding...</span>
                </>
              ) : (
                <>
                  <span>Decode</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips (Smooth Swipe Rail) */}
        <div className="max-w-2xl mx-auto mb-4 flex items-center gap-1.5 overflow-x-auto pb-1.5 text-xs no-scrollbar -mx-4 px-4 sm:mx-auto sm:px-0">
          <div className="flex items-center gap-1 text-zinc-400 shrink-0 font-serif-literary text-[11px] mr-0.5">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>Popular:</span>
          </div>
          {POPULAR_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSelectSuggestion(suggestion)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-amber-200 border border-white/[0.06] hover:border-amber-400/20 transition-all text-[11px] whitespace-nowrap active:scale-95"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Categories Segmented Rail */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all font-medium min-h-[32px] whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full border text-xs font-medium flex items-center gap-1 shrink-0 transition-all min-h-[32px] ${
                showFilters || selectedShiftType !== 'All'
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                  : 'bg-white/[0.04] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
              }`}
              title="Filter by shift type"
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          {/* Filter Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 glass-panel rounded-2xl border border-white/[0.08] flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-zinc-400 font-medium mr-1">Shift Type:</span>
                  {['All', 'Reversed', 'Truncated', 'Shifted', 'Misattributed', 'Refined'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedShiftType(type)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                        selectedShiftType === type
                          ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm'
                          : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      {type === 'All' ? 'All Types' : type}
                    </button>
                  ))}
                  {selectedShiftType !== 'All' && (
                    <button
                      onClick={() => setSelectedShiftType('All')}
                      className="text-amber-400 hover:underline text-[11px] ml-auto font-medium"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
