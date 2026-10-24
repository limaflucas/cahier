const canSynthesize = typeof window !== 'undefined' && 'speechSynthesis' in window;

function frenchVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === 'fr-FR' && v.localService) ?? voices.find((v) => v.lang.startsWith('fr'));
}

function synthesize(text) {
  if (!canSynthesize) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.voice = frenchVoice() ?? null;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

let current = null;

export function speak(text) {
  current?.pause();
  if (canSynthesize) window.speechSynthesis.cancel();
  const audio = new Audio(`/api/audio/${encodeURIComponent(text)}`);
  current = audio;
  audio.play().catch(() => {
    if (current === audio) synthesize(text);
  });
}
