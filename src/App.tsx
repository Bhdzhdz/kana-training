import { useEffect, useState } from "react";
import { flattenKanaSets, getAudioUrl } from "./assets/kana";
import KanaButton from "./components/KanaButton";
import Feedback from "./components/Feedback";
import Selector from "./components/Selector";

type GameState = "waiting" | "answered";

export default function App() {
  const [kanaPairs, setKanaPairs] = useState<[string, string][]>([]);
  const [current, setCurrent] = useState<[string, string] | null>(null);
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (current) {
      const [, romaji] = current;
      const audio = new Audio(getAudioUrl(romaji));
      audio.play();
    }
  }, [current]);

  const startGame = (selectedGroups: string[]) => {
    const pairs = flattenKanaSets(selectedGroups);
    setKanaPairs(pairs);
    setNextQuestion(pairs);
  };

  const setNextQuestion = (pairs = kanaPairs) => {
    const next = pairs[Math.floor(Math.random() * pairs.length)];
    setCurrent(next);
    setGameState("waiting");
    setFeedback(null);
  };

  const handleAnswer = (answer: string) => {
    if (!current) return;
    const [correctKana] = current;
    const isCorrect = answer === correctKana;
    setFeedback(isCorrect ? "Correct!" : `Incorrect. It was "${correctKana}"`);
    setGameState("answered");
  };

  const handleDontKnow = () => {
    if (!current) return;
    const [correctKana] = current;
    setFeedback(`It was "${correctKana}"`);
    setGameState("answered");
  };
  /*
  function getSubset(
    entries: [string, string][],
    subsetSize: number,
  ): [string, string][] {
    if (!current) {
      return [];
    }
    const remainingValues = entries.filter((value) => value !== current);
    const shuffled = remainingValues.sort(() => 0.5 - Math.random());
    const additionalValues = shuffled.slice(0, subsetSize - 1);
    const ans = [current, ...additionalValues].sort(() => 0.5 - Math.random());
    return ans;
  }
  */

  return (
    <main className="p-6 max-w-xl mx-auto text-center">
      {!kanaPairs.length ? (
        <Selector onStart={startGame} />
      ) : (
        <>
          <h1 className="text-2xl mb-4">What kana is this?</h1>

          <div className="grid grid-cols-5 gap-2 justify-center my-4">
            {kanaPairs.map(([kana]) => (
              <KanaButton
                key={kana}
                kana={kana}
                disabled={gameState === "answered"}
                onClick={() => handleAnswer(kana)}
              />
            ))}
            {/* Don't Know button */}
            <button
              onClick={handleDontKnow}
              disabled={gameState === "answered"}
              className="border text-xl p-3 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 col-span-5"
            >
              Don’t know
            </button>
          </div>

          {gameState === "answered" && (
            <>
              <Feedback text={feedback!} />
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setNextQuestion()}
              >
                Next
              </button>
            </>
          )}
        </>
      )}
    </main>
  );
}
