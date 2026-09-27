/**
 * Browser speech synthesis helper with a warm, easygoing, and playful female voice persona.
 */

// Well-known warm, outgoing, and cheerful female voice names across platforms (Apple, Google, Microsoft, Android)
const FEMALE_VOICE_NAMES = [
  'Samantha',
  'Victoria',
  'Ava',
  'Jenny',
  'Aria',
  'Karen',
  'Moira',
  'Fiona',
  'Tessa',
  'Serena',
  'Allison',
  'Susan',
  'Zoe',
  'Nicky',
  'Libby',
  'Sonia',
  'Mia',
  'Google UK English Female',
  'Google US English',
  'Microsoft Zira',
  'Microsoft Jenny',
  'Microsoft Aria'
];

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Finds the best warm, outgoing female voice available on the user's platform.
 */
export function getWarmFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices().length > 0 ? loadVoices() : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);
  if (!voices || voices.length === 0) return null;

  // 1. Try matching known warm / cheerful female voice names (Natural or High Quality first)
  for (const name of FEMALE_VOICE_NAMES) {
    const match = voices.find(
      v => v.name.toLowerCase().includes(name.toLowerCase()) && v.lang.startsWith('en')
    );
    if (match) return match;
  }

  // 2. Try any voice explicitly labeled female
  const femaleTaggedVoice = voices.find(
    v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
  );
  if (femaleTaggedVoice) return femaleTaggedVoice;

  // 3. Fallback to natural English voices
  const naturalEnglish = voices.find(
    v => (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en-AU')) && v.name.includes('Natural')
  );
  if (naturalEnglish) return naturalEnglish;

  // 4. Any English voice
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
}

export function speakPhrase(text: string, onEnd?: () => void): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    if (onEnd) onEnd();
    return () => {};
  }

  // Cancel any previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Warm, easy-going, upbeat and playful voice modulation:
  // - Slightly higher pitch (1.18) for a friendly, cheerful, warm female timbre
  // - Breezy natural rate (1.03) for an easygoing, animated delivery
  utterance.pitch = 1.18;
  utterance.rate = 1.03;
  utterance.volume = 1.0;

  const femaleVoice = getWarmFemaleVoice();
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

