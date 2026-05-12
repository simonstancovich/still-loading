import * as Tone from 'tone'

let initialized = false

export async function initAudio(): Promise<void> {
  if (initialized) return
  await Tone.start()
  initialized = true
}

export function isAudioInitialized(): boolean {
  return initialized
}

export function getMasterBus(): Tone.Gain {
  return Tone.getDestination() as unknown as Tone.Gain
}
