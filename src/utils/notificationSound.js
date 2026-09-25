let newIpSound = null;
let updateSound = null;

export function prepareNotificationSounds() {
  if (typeof window === "undefined") return;
  if (!newIpSound) {
    newIpSound = new Audio("/sounds/new-ip.wav");
    newIpSound.preload = "auto";
  }
  if (!updateSound) {
    updateSound = new Audio("/sounds/new-data.wav");
    updateSound.preload = "auto";
  }
}

/** Call inside a user gesture (e.g. login click) to satisfy autoplay policy */
export function unlockNotificationAudio() {
  prepareNotificationSounds();
  [newIpSound, updateSound].forEach((audio) => {
    if (!audio) return;
    const prevVolume = audio.volume;
    audio.volume = 0.01;
    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = prevVolume;
      })
      .catch(() => {
        audio.volume = prevVolume;
      });
  });
}

function playSound(audio) {
  if (!audio || typeof window === "undefined") return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

export function playNewUserSound() {
  prepareNotificationSounds();
  playSound(newIpSound);
}

export function playNewDataSound() {
  prepareNotificationSounds();
  playSound(updateSound);
}

export function playNotificationSound(isNewUser = false) {
  if (isNewUser) playNewUserSound();
  else playNewDataSound();
}

if (typeof window !== "undefined") {
  prepareNotificationSounds();
}
