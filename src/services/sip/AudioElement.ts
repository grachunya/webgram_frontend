const audioElements = new Map<string, HTMLAudioElement>();

export const getOrCreateAudioElement = (
  id: string,
  muted: boolean,
): HTMLAudioElement => {
  if (audioElements.has(id)) {
    return audioElements.get(id)!;
  }

  let audio = document.getElementById(id) as HTMLAudioElement | null;
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = id;
    audio.autoplay = true;
    audio.muted = muted;
    audio.volume = 1.0;
    document.body.appendChild(audio);
  }

  audioElements.set(id, audio);
  return audio;
};
