import { kana } from "./kana";
export const AUDIO_BASE =
  "https://github.com/djtguide/djtguide.github.io/raw/refs/heads/main/learn/kana/audio";
export const audioMap: Record<string, string> = Object.values(kana)
  .flatMap((set) =>
    Object.values(set).map(
      (reading) => [reading, `${AUDIO_BASE}/${reading}.mp3`] as const,
    ),
  )
  .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
