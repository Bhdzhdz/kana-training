import type { KanaSet } from "../data/kana";

interface Props {
  kana: Record<string, KanaSet>;
  selectedSets: string[];
}
export default function KanaGrid({ kana, selectedSets }: Props) {
  const chars = selectedSets.flatMap((key) => Object.keys(kana[key]));
  return (
    <div className="grid grid-cols-8 gap-2 overflow-auto max-h-32">
      {chars.map((c) => (
        <div
          key={c}
          className="flex items-center justify-center p-1 bg-gray-200 rounded"
        >
          {c}
        </div>
      ))}
    </div>
  );
}
