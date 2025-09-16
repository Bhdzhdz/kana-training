import { kana } from '../assets/kana';
import { useState } from 'react';

type Props = {
  onStart: (selectedGroups: string[]) => void;
};

export default function Selector({ onStart }: Props) {
  const groupKeys = Object.keys(kana);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (group: string) => {
    setSelected((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Select Kana Groups to Study</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {groupKeys.map((group) => {
          const isSelected = selected.includes(group);
          const groupKana = Object.entries(kana[group]);

          return (
            <button
              key={group}
              onClick={() => toggle(group)}
              aria-pressed={isSelected}
              className={`border rounded-lg p-3 text-left shadow-sm transition-all duration-150 ${
                isSelected ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300' : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-lg mb-2 capitalize">{group}</div>
              <div className="flex flex-wrap gap-2 text-xl">
                {groupKana.map(([kanaChar, romaji]) => (
                  <span
                    key={kanaChar}
                    className="bg-white border border-gray-300 rounded px-2 py-1 text-center"
                    title={romaji}
                  >
                    {kanaChar}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <button
          disabled={!selected.length}
          onClick={() => onStart(selected)}
          className={`px-6 py-2 rounded text-white font-medium transition-colors ${
            selected.length
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Start
        </button>
      </div>
    </div>
  );
}
