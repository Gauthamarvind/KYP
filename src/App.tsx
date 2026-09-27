import React, { useState, useEffect, useMemo } from 'react';
import { CURATED_PHRASES } from './data/curatedPhrases';
import { PhraseEntry } from './types/phrase';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { PhraseCard } from './components/PhraseCard';
import { PhraseDetailModal } from './components/PhraseDetailModal';
import { SentenceValidator } from './components/SentenceValidator';
import { PhraseRestorerQuiz } from './components/PhraseRestorerQuiz';
import { DailyPhraseCard } from './components/DailyPhraseCard';
import { BookmarksView } from './components/BookmarksView';
import { RecentlyViewedSection } from './components/RecentlyViewedSection';
import { MobileFrameSimulator } from './components/MobileFrameSimulator';
import { Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'validator' | 'quiz' | 'bookmarks'>('explore');
  const [phrases, setPhrases] = useState<PhraseEntry[]>(CURATED_PHRASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Phrases');
  const [selectedShiftType, setSelectedShiftType] = useState('All');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [activeDetailPhrase, setActiveDetailPhrase] = useState<PhraseEntry | null>(null);
  const [labTargetPhrase, setLabTargetPhrase] = useState<PhraseEntry | null>(null);
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(false);
  const [bookmarks, setBookmarks] = useState<PhraseEntry[]>(() => {
    try {
      const saved = localStorage.getItem('know_your_phrases_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [recentlyViewed, setRecentlyViewed] = useState<PhraseEntry[]>(() => {
    try {
      const saved = localStorage.getItem('know_your_phrases_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('know_your_phrases_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to persist bookmarks', e);
    }
  }, [bookmarks]);

  // Persist recently viewed
  useEffect(() => {
    try {
      localStorage.setItem('know_your_phrases_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (e) {
      console.error('Failed to persist recently viewed', e);
    }
  }, [recentlyViewed]);

  // Track recently viewed when opening detail modal
  const handleOpenDetail = (phrase: PhraseEntry) => {
    setActiveDetailPhrase(phrase);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== phrase.id);
      return [phrase, ...filtered].slice(0, 5);
    });
  };

  const handleClearRecents = () => {
    setRecentlyViewed([]);
  };

  const handleRemoveRecent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentlyViewed((prev) => prev.filter((item) => item.id !== id));
  };

  // Featured Daily Phrase
  const dailyPhrase = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return CURATED_PHRASES[dayOfYear % CURATED_PHRASES.length];
  }, []);

  const toggleBookmark = (phrase: PhraseEntry) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === phrase.id);
      if (exists) {
        return prev.filter((b) => b.id !== phrase.id);
      } else {
        return [...prev, phrase];
      }
    });
  };

  const handleTestInLab = (phrase: PhraseEntry) => {
    setLabTargetPhrase(phrase);
    setActiveTab('validator');
  };

  const handleRandomPhrase = () => {
    const random = phrases[Math.floor(Math.random() * phrases.length)];
    handleOpenDetail(random);
  };

  // AI Phrase Resolver Search
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase().trim();
    const localMatch = phrases.find(
      (p) =>
        p.common_phrase.toLowerCase().includes(q) ||
        p.authentic_phrase.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );

    if (localMatch && !q.includes('solve') && !q.includes('ai')) {
      return;
    }

    setIsAiSearching(true);
    try {
      const res = await fetch('/api/phrases/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          category: selectedCategory !== 'All Phrases' ? selectedCategory : undefined
        })
      });

      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();
      if (data.resolved_phrase) {
        const newEntry: PhraseEntry = {
          ...data.resolved_phrase,
          id: data.resolved_phrase.id || `custom-${Date.now()}`,
          isCustomAiGenerated: true
        };

        setPhrases((prev) => {
          const existingIdx = prev.findIndex((p) => p.id === newEntry.id || p.common_phrase === newEntry.common_phrase);
          if (existingIdx !== -1) {
            const updated = [...prev];
            updated[existingIdx] = newEntry;
            return updated;
          }
          return [newEntry, ...prev];
        });

        handleOpenDetail(newEntry);
      }
    } catch (err) {
      console.error('AI search failed', err);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Filtered Phrases
  const filteredPhrases = useMemo(() => {
    return phrases.filter((p) => {
      if (selectedCategory !== 'All Phrases' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedShiftType !== 'All' && p.meaning_shift_type !== selectedShiftType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPhrase =
          p.common_phrase.toLowerCase().includes(q) ||
          p.authentic_phrase.toLowerCase().includes(q) ||
          p.original_intent.toLowerCase().includes(q) ||
          p.modern_misconception.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesPhrase) return false;
      }
      return true;
    });
  }, [phrases, selectedCategory, selectedShiftType, searchQuery]);

  return (
    <MobileFrameSimulator isActive={isMobileDeviceView}>
      <div className="min-h-screen flex flex-col bg-[#08090d] text-zinc-100 selection:bg-amber-400/20 selection:text-amber-200">
        {/* Navigation & App Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onRandomPhrase={handleRandomPhrase}
          bookmarkCount={bookmarks.length}
          isMobileDeviceView={isMobileDeviceView}
          setIsMobileDeviceView={setIsMobileDeviceView}
        />

        {/* Tab Content with Fluid Motion Transitions */}
        <AnimatePresence mode="wait">
          {/* Tab 1: Explore */}
          {activeTab === 'explore' && (
            <motion.main 
              key="explore"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex-1 pb-20"
            >
              <HeroSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedShiftType={selectedShiftType}
                setSelectedShiftType={setSelectedShiftType}
                onSearchSubmit={handleSearchSubmit}
                isAiSearching={isAiSearching}
                onSelectSuggestion={(phraseText) => {
                  setSearchQuery(phraseText);
                }}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-7">
                {/* Featured Daily Widget */}
                {!searchQuery && selectedCategory === 'All Phrases' && (
                  <DailyPhraseCard
                    phrase={dailyPhrase}
                    onOpenDetail={handleOpenDetail}
                    isBookmarked={bookmarks.some((b) => b.id === dailyPhrase.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                )}

                {/* Recently Viewed Section (Last 5 clicked phrases) */}
                <RecentlyViewedSection
                  recentPhrases={recentlyViewed}
                  onOpenDetail={handleOpenDetail}
                  onClearRecents={handleClearRecents}
                  onRemoveRecent={handleRemoveRecent}
                />

                {/* Lexicon Grid Section */}
                <div>
                  <div className="flex items-center justify-between mb-5 pb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <h2 className="text-base font-semibold font-display text-zinc-200">
                        Restored Lexicon Catalog
                      </h2>
                      <span className="text-xs text-zinc-500 font-medium">
                        · {filteredPhrases.length} {filteredPhrases.length === 1 ? 'phrase' : 'phrases'}
                      </span>
                    </div>

                    {isAiSearching && (
                      <div className="flex items-center gap-2 text-xs text-amber-300 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Resolving fragment...</span>
                      </div>
                    )}
                  </div>

                  {filteredPhrases.length === 0 ? (
                    <div className="text-center py-16 px-4 rounded-3xl glass-panel border border-white/[0.06] space-y-4">
                      <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                      <div>
                        <h3 className="text-base font-semibold text-zinc-200">
                          No Direct Matches for "{searchQuery}"
                        </h3>
                        <p className="text-xs text-zinc-400 font-serif-literary max-w-md mx-auto mt-1">
                          Use the Decode button to prompt the restoration engine to identify the authentic phrase and etymology.
                        </p>
                      </div>
                      <button
                        onClick={() => handleSearchSubmit()}
                        disabled={isAiSearching}
                        className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs inline-flex items-center gap-2 shadow-md active:scale-98 transition-all min-h-[38px]"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Decode "{searchQuery}" with AI</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredPhrases.map((phrase, index) => (
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
                            isBookmarked={bookmarks.some((b) => b.id === phrase.id)}
                            onToggleBookmark={toggleBookmark}
                            onOpenDetail={handleOpenDetail}
                            onTestInLab={handleTestInLab}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.main>
          )}

          {/* Tab 2: Usage Lab */}
          {activeTab === 'validator' && (
            <motion.main 
              key="validator"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex-1 pb-20"
            >
              <SentenceValidator
                initialPhrase={labTargetPhrase}
                onClearInitialPhrase={() => setLabTargetPhrase(null)}
              />
            </motion.main>
          )}

          {/* Tab 3: The Lost Half Quiz */}
          {activeTab === 'quiz' && (
            <motion.main 
              key="quiz"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex-1 pb-20"
            >
              <PhraseRestorerQuiz />
            </motion.main>
          )}

          {/* Tab 4: Saved Bookmarks */}
          {activeTab === 'bookmarks' && (
            <motion.main 
              key="bookmarks"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex-1 pb-20"
            >
              <BookmarksView
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
                onOpenDetail={handleOpenDetail}
                onTestInLab={handleTestInLab}
                onClearAll={() => setBookmarks([])}
              />
            </motion.main>
          )}
        </AnimatePresence>

        {/* Phrase Detail Modal */}
        <PhraseDetailModal
          phrase={activeDetailPhrase}
          onClose={() => setActiveDetailPhrase(null)}
          isBookmarked={activeDetailPhrase ? bookmarks.some((b) => b.id === activeDetailPhrase.id) : false}
          onToggleBookmark={toggleBookmark}
          onTestInLab={handleTestInLab}
        />

        {/* Quiet Minimalist Footer */}
        <footer className="mt-auto border-t border-white/[0.04] py-6 px-4 text-center text-xs text-zinc-500 font-serif-literary">
          <p>
            Know Your Phrases · Restoring historical nuance and forgotten wisdom.
          </p>
        </footer>
      </div>
    </MobileFrameSimulator>
  );
}
