/**
 * Vibration API Haptic Feedback Utility
 * Provides subtle tactile sensations for touch interactions on supported mobile devices and browsers.
 */

export const triggerHaptic = (pattern: number | number[] = 15) => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors on devices where permission is restricted or unsupported
    }
  }
};

/** Light crisp tap for UI button presses (15ms) */
export const hapticTap = () => triggerHaptic(15);

/** Satisfying double-pulse for bookmarking/saving (20ms, pause 40ms, 20ms) */
export const hapticBookmark = () => triggerHaptic([20, 40, 20]);

/** Success pulse for copy actions or completion */
export const hapticSuccess = () => triggerHaptic([15, 30, 25]);

/** Soft pulse for modal presentation or selection (20ms) */
export const hapticSelection = () => triggerHaptic(20);
