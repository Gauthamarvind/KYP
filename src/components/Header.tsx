import React from 'react';
import { BookOpen, Sparkles, CheckCircle2, Bookmark, HelpCircle, Shuffle, Smartphone, Monitor } from 'lucide-react';
import { motion } from 'motion/react';
import { hapticTap, hapticSelection } from '../utils/haptics';

interface HeaderProps {
  activeTab: 'explore' | 'validator' | 'quiz' | 'bookmarks';
  setActiveTab: (tab: 'explore' | 'validator' | 'quiz' | 'bookmarks') => void;
  onRandomPhrase: () => void;
  bookmarkCount: number;
  isMobileDeviceView: boolean;
  setIsMobileDeviceView: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRandomPhrase,
  bookmarkCount,
  isMobileDeviceView,
  setIsMobileDeviceView
}) => {
  const tabs = [
    { id: 'explore' as const, label: 'Explore', icon: Sparkles },
    { id: 'validator' as const, label: 'Usage Lab', icon: CheckCircle2 },
    { id: 'quiz' as const, label: 'Lost Half Quiz', icon: HelpCircle },
    { id: 'bookmarks' as const, label: 'Saved', icon: Bookmark, badge: bookmarkCount > 0 ? bookmarkCount : null }
  ];

  const handleTabSelect = (tabId: 'explore' | 'validator' | 'quiz' | 'bookmarks') => {
    hapticTap();
    setActiveTab(tabId);
  };

  const handleRandom = () => {
    hapticSelection();
    onRandomPhrase();
  };

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 pt-3 pb-2 transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-lg shadow-black/20 border border-white/[0.08]">
          
          {/* Brand Logo & Wordmark (Apple-style minimalism) */}
          <button 
            onClick={() => handleTabSelect('explore')}
            className="flex items-center gap-3 group text-left transition-transform active:scale-98 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display tracking-wider text-base sm:text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  Know Your Phrases
                </span>
                <span className="text-[10px] uppercase font-mono-code font-medium tracking-widest text-amber-300/80 hidden lg:inline-block">
                  · Authentic Edition
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-serif-literary italic hidden sm:block leading-none mt-0.5">
                Restoring the lost halves & true origins of idioms
              </p>
            </div>
          </button>

          {/* Desktop Fluid Segmented Control (Apple HIG pattern) */}
          <nav className="hidden md:flex items-center p-1 bg-zinc-950/60 rounded-full border border-white/[0.06] relative">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-colors duration-200 z-10 min-h-[36px] ${
                    isActive ? 'text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-pill"
                      className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-code ${
                        isActive ? 'bg-zinc-950/20 text-zinc-950' : 'bg-amber-400/20 text-amber-300'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Island */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandom}
              title="Reveal a random restored phrase"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800/90 text-amber-300 hover:text-amber-200 border border-white/[0.08] hover:border-amber-400/30 text-xs font-medium transition-all active:scale-95 min-h-[36px]"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Random</span>
            </button>

            {/* Desktop / Mobile Switcher */}
            <button
              onClick={() => {
                hapticTap();
                setIsMobileDeviceView(prev => !prev);
              }}
              title={isMobileDeviceView ? "Switch to Desktop Layout" : "Switch to Mobile Device Preview"}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-medium transition-all min-h-[36px]"
            >
              {isMobileDeviceView ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-amber-400" />
                  <span>Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mobile View</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Fluid Bottom Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-50">
        <div className="glass-panel-elevated rounded-2xl px-2 py-2 flex items-center justify-around border border-white/[0.12] shadow-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[10px] transition-all min-w-[58px] min-h-[44px] ${
                  isActive ? 'text-amber-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-tab"
                    className="absolute inset-0 bg-white/[0.08] rounded-xl"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <div className="relative">
                  <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <span className="relative z-10 leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
