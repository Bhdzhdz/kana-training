import { useState, useEffect } from "react";
import { kana } from "../data/kana";
import { audioMap } from "../data/audioMap";
import KanaGrid from "./KanaGrid";
import Settings from "./Settings";

export default function KanaGame() {
  const [activeSets, setActiveSets] = useState<string[]>(["hsingle"]);
  const [pool, setPool] = useState<[string, string][]>([]);
  const [current, setCurrent] = useState<[string, string] | null>(null);
  const [choices, setChoices] = useState<[string, string][]>([]);
  const [feedback, setFeedback] = useState<null | boolean>(null);
  const [showNext, setShowNext] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const list = activeSets.flatMap((key) => Object.entries(kana[key]));
    setPool(shuffle(list));
  }, [activeSets]);

  useEffect(() => {
    if (pool.length > 0) {
      console.log("Loading next item");
      loadNext(pool[0]);
      setPool((prev) => prev.slice(1));
    }
  }, [pool]);

  function shuffle<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function loadNext(item: [string, string]) {
    setCurrent(item);
    setFeedback(null);
    setShowNext(false);

    const fullPool = activeSets.flatMap((key) => Object.entries(kana[key]));
    const options = shuffle([
      item,
      ...shuffle(fullPool.filter(([_, r]) => r !== item[1])).slice(0, 3),
    ]);
    setChoices(options);

    const audio = new Audio(audioMap[item[1]]);
    console.log("New audio object created");
    console.log(audio);
    audio.play();
  }

  function handleChoice(selected: string) {
    if (!current || feedback !== null) return;
    const isCorrect = selected === current[1];
    setFeedback(isCorrect);
    setTotal((t) => t + 1);
    if (isCorrect) setCorrect((c) => c + 1);
    setShowNext(true);
  }

  function next() {
    console.debug("next function")
    if (pool.length === 0) return;
    loadNext(pool[0]);
    setPool((prev) => prev.slice(1));
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full space-y-4">
      <Settings
        sets={Object.keys(kana)}
        selected={activeSets}
        onChange={setActiveSets}
      />
      {current && (
        <div className="text-center">
          <div className="text-6xl mb-4">🎵</div>
          <div className="grid grid-cols-2 gap-2">
            {choices.map(([char, reading]) => (
              <button
                key={reading}
                className={`p-3 rounded-xl border text-xl font-bold ${feedback !== null && reading === current[1] ? "bg-green-300" : ""} ${feedback !== null && reading !== current[1] && reading === choices.find((c) => c[1] === reading)?.[1] ? "bg-red-300" : "bg-white"}`}
                onClick={() => handleChoice(reading)}
                disabled={feedback !== null}
              >
                {char}
              </button>
            ))}
          </div>
          {feedback !== null && (
            <div className="mt-2 text-lg font-semibold">
              {feedback ? "Correct!" : "Wrong!"}
            </div>
          )}
          {showNext && (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl"
              onClick={next}
            >
              Next
            </button>
          )}
          <div className="mt-2 text-sm">
            Score: {correct}/{total}
          </div>
        </div>
      )}
      <KanaGrid kana={kana} selectedSets={activeSets} />
    </div>
  );
}
