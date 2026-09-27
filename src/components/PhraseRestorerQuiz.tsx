import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { QuizQuestion } from '../types/phrase';
import { motion, AnimatePresence } from 'motion/react';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    phraseId: 'jack-of-all-trades',
    commonPhrase: 'Jack of all trades, master of none...',
    question: 'What is the full historically authentic ending to "Jack of all trades, master of none"?',
    options: [
      '...is always a fool in the long run.',
      '...though ofttimes better than a master of one.',
      '...until he learns the master’s craft.',
      '...is rich in coin but poor in skill.'
    ],
    correctIndex: 1,
    explanation: 'The full proverb is "Jack of all trades, master of none, though ofttimes better than a master of one," intended as a high praise of versatile polymaths!',
    authenticPhrase: 'Jack of all trades, master of none, though ofttimes better than a master of one.'
  },
  {
    id: 'q2',
    phraseId: 'blood-is-thicker-than-water',
    commonPhrase: 'Blood is thicker than water...',
    question: 'What was the original covenant phrasing that completely inverts the modern meaning of "Blood is thicker than water"?',
    options: [
      'The blood of the covenant is thicker than the water of the womb.',
      'Blood flows thicker than spring water in winter.',
      'The blood of kings is thicker than the water of peasants.',
      'Pure blood runs thicker than poisoned water.'
    ],
    correctIndex: 0,
    explanation: 'Ancient blood covenants bound warriors and friends in sacred loyalty that surpassed biological accident ("water of the womb").',
    authenticPhrase: 'The blood of the covenant is thicker than the water of the womb.'
  },
  {
    id: 'q3',
    phraseId: 'curiosity-killed-the-cat',
    commonPhrase: 'Curiosity killed the cat...',
    question: 'How did Victorian writers restore the redemptive ending to "Curiosity killed the cat"?',
    options: [
      '...and dogs buried the bones.',
      '...but satisfaction brought it back.',
      '...yet wisdom saved the ninth life.',
      '...so keep your silence.'
    ],
    correctIndex: 1,
    explanation: '"...but satisfaction brought it back!" Although inquiry carries risk, obtaining true knowledge revives and rewards the seeker.',
    authenticPhrase: 'Curiosity killed the cat, but satisfaction brought it back.'
  },
  {
    id: 'q4',
    phraseId: 'great-minds-think-alike',
    commonPhrase: 'Great minds think alike...',
    question: 'What is the witty, sarcastic second half of "Great minds think alike"?',
    options: [
      '...and speak with one tongue.',
      '...though fools seldom differ.',
      '...until truth divides them.',
      '...in matters of virtue.'
    ],
    correctIndex: 1,
    explanation: '"...though fools seldom differ." The quip mocks lazy consensus, noting that fools agree with each other just as easily as geniuses.',
    authenticPhrase: 'Great minds think alike, though fools seldom differ.'
  },
  {
    id: 'q5',
    phraseId: 'the-customer-is-always-right',
    commonPhrase: 'The customer is always right...',
    question: 'What was department store pioneer Harry Selfridge’s crucial qualifying condition for "The customer is always right"?',
    options: [
      '...when paying with gold.',
      '...in matters of taste.',
      '...unless proven dishonest.',
      '...during holiday trade.'
    ],
    correctIndex: 1,
    explanation: 'It strictly applied "in matters of taste" (aesthetic preferences like color and fabric), never validating fraud or abuse of staff.',
    authenticPhrase: 'The customer is always right, in matters of taste.'
  },
  {
    id: 'q6',
    phraseId: 'my-country-right-or-wrong',
    commonPhrase: 'My country, right or wrong...',
    question: 'How did Senator Carl Schurz finish the famous patriotic maxim in 1872?',
    options: [
      '...unto death and victory.',
      '...if right, to be kept right; and if wrong, to be set right.',
      '...above all foreign kingdoms.',
      '...shall ever be defended.'
    ],
    correctIndex: 1,
    explanation: 'Carl Schurz affirmed that true patriotism means correcting your country when it errs: "if right, to be kept right; and if wrong, to be set right."',
    authenticPhrase: 'My country, right or wrong; if right, to be kept right; and if wrong, to be set right.'
  }
];

export const PhraseRestorerQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);
    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Quiz Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-amber-300 text-xs font-medium mb-3 backdrop-blur-md">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>The Lost Half Challenge</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold font-display text-zinc-100">
          Restore the Missing Proverb
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 font-serif-literary">
          Test how well you know the authentic, un-shortened endings of world-famous sayings.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6"
          >
            {/* Progress Header */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-3 border-b border-white/[0.06]">
              <span>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="text-amber-400 font-semibold">Score: {score}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-950/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div>
              <div className="text-amber-400/90 text-xs font-medium mb-1">
                Commonly truncated: "{currentQ.commonPhrase}"
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-100 font-display leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                let optionStyle = 'bg-white/[0.03] border-white/[0.06] text-zinc-200 hover:bg-white/[0.07] hover:border-amber-400/30';

                if (hasAnswered) {
                  if (idx === currentQ.correctIndex) {
                    optionStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-medium';
                  } else if (idx === selectedOption) {
                    optionStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-200 font-medium';
                  } else {
                    optionStyle = 'bg-white/[0.02] border-white/[0.04] text-zinc-500 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-serif-literary transition-all flex items-center justify-between gap-3 min-h-[48px] ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {hasAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {hasAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Banner */}
            {hasAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2"
              >
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Historical Context</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-serif-literary leading-relaxed">
                  {currentQ.explanation}
                </p>
                <div className="pt-1 text-xs text-emerald-300 font-medium">
                  Full quote: <span className="italic">"{currentQ.authenticPhrase}"</span>
                </div>
              </motion.div>
            )}

            {/* Next Button */}
            {hasAnswered && (
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-zinc-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-98 transition-all min-h-[44px]"
              >
                <span>{currentIdx === QUIZ_QUESTIONS.length - 1 ? 'View Final Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ) : (
          /* Final Score Card */
          <motion.div 
            key="final"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel-elevated p-8 rounded-3xl border border-white/[0.08] text-center space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-2xl font-semibold font-display text-zinc-100">Quiz Completed</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-serif-literary mt-1">
                You scored <span className="text-amber-400 font-semibold">{score}</span> out of {QUIZ_QUESTIONS.length}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] max-w-md mx-auto text-xs text-zinc-300 font-serif-literary leading-relaxed">
              {score === QUIZ_QUESTIONS.length ? (
                <span className="text-emerald-300 font-medium">
                  🌟 Master Polymath! You understand the authentic intent behind every proverb with precision.
                </span>
              ) : score >= 4 ? (
                <span className="text-amber-300 font-medium">
                  ✨ Astute Scholar! You uncovered most of the missing halves and restored meanings.
                </span>
              ) : (
                <span>
                  📚 Fascinating discoveries await! Explore the Lexicon to see how culture transformed these sayings.
                </span>
              )}
            </div>

            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md active:scale-98 transition-all min-h-[40px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Challenge</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
