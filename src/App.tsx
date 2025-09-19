import { useState, useCallback, useRef, type FC } from "react";
import { flattenKanaSets, getAudioUrl } from "./assets/kana";
import KanaButton from "./components/KanaButton";
import Feedback from "./components/Feedback";
import Selector from "./components/Selector";

// For better readability, let's define a type for our kana pairs
type KanaPair = {
  kana: string;
  romaji: string;
};

type GameState = "waiting" | "answered";

// A constant for the number of choices
const NUM_CHOICES = 5;

const App: FC = () => {
  const [kanaSet, setKanaSet] = useState<KanaPair[]>([]);
  const [currentKana, setCurrentKana] = useState<KanaPair | null>(null);
  const [choices, setChoices] = useState<KanaPair[]>([]);
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Use a ref to hold the Audio object so it persists across renders
  const audioRef = useRef<HTMLAudioElement>(
    typeof Audio !== "undefined" ? new Audio() : undefined,
  );

  // A stable function to play audio, wrapped in useCallback
  const playAudio = useCallback((romaji: string) => {
    if (audioRef.current) {
      audioRef.current.src = getAudioUrl(romaji);
      audioRef.current.play();
    }
  }, []);

  // Generates a new set of choices for the user
  const generateChoices = useCallback(
    (allKana: KanaPair[], correctAnswer: KanaPair): KanaPair[] => {
      // Filter out the correct answer to avoid duplicates
      const otherKana = allKana.filter(
        (k) => k.romaji !== correctAnswer.romaji,
      );

      // Shuffle the remaining kana
      otherKana.sort(() => 0.5 - Math.random());

      // Take a slice for the other choices
      const otherChoices = otherKana.slice(0, NUM_CHOICES - 1);

      // Combine and shuffle the final set of choices
      const finalChoices = [correctAnswer, ...otherChoices];
      finalChoices.sort(() => 0.5 - Math.random());

      return finalChoices;
    },
    [],
  );

  // Sets up the next question
  const setNextQuestion = useCallback(
    (currentSet: KanaPair[] = kanaSet) => {
      if (currentSet.length === 0) return;

      // 1. Pick a new kana
      const nextKana =
        currentSet[Math.floor(Math.random() * currentSet.length)];

      // 2. Generate choices based on the new kana
      const nextChoices = generateChoices(currentSet, nextKana);

      // 3. Update state
      setCurrentKana(nextKana);
      setChoices(nextChoices);
      setGameState("waiting");
      setFeedback(null);

      // 4. Play the audio for the new question
      playAudio(nextKana.romaji);
    },
    [kanaSet, generateChoices, playAudio],
  );

  const startGame = useCallback(
    (selectedGroups: string[]) => {
      // We convert to the KanaPair object structure here
      const pairs = flattenKanaSets(selectedGroups).map(([kana, romaji]) => ({
        kana,
        romaji,
      }));
      setKanaSet(pairs);
      setNextQuestion(pairs);
    },
    [setNextQuestion],
  );

  const handleAnswer = useCallback(
    (answeredKana: string) => {
      if (!currentKana) return;

      const { kana: correctKana, romaji: correctRomaji } = currentKana;
      const isCorrect = answeredKana === correctKana;

      setFeedback(
        isCorrect ? "Correct! 🎉" : `Incorrect. The answer was ${correctKana}.`,
      );
      setGameState("answered");

      // Play audio if the answer was incorrect
      if (!isCorrect) {
        playAudio(correctRomaji);
      }
    },
    [currentKana, playAudio],
  );

  const handleDontKnow = useCallback(() => {
    if (!currentKana) return;

    const { kana: correctKana, romaji: correctRomaji } = currentKana;
    setFeedback(`The answer was ${correctKana}.`);
    setGameState("answered");

    // Play audio when the user doesn't know the answer
    playAudio(correctRomaji);
  }, [currentKana, playAudio]);

  const gameStarted = currentKana && choices.length > 0;

  return (
    <main className="p-6 max-w-xl mx-auto text-center">
      {!gameStarted ? (
        <Selector onStart={startGame} />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">What kana is this?</h1>

          {/* Replay Audio Button */}
          <div className="mb-6">
            <button
              onClick={() => playAudio(currentKana.romaji)}
              disabled={gameState === "answered"}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg flex items-center justify-center mx-auto"
              aria-label="Replay audio"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 5.858a9 9 0 0112.728 0m-2.828 9.9a5 5 0 01-7.072 0"
                />
              </svg>
              Play Sound
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 justify-center my-4">
            {choices.map(({ kana, romaji }) => (
              <KanaButton
                key={romaji}
                kana={kana}
                disabled={gameState === "answered"}
                onClick={() => handleAnswer(kana)}
              />
            ))}
          </div>

          <button
            onClick={handleDontKnow}
            disabled={gameState === "answered"}
            className="border-2 w-full mt-4 text-lg p-3 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            I don't know
          </button>

          {gameState === "answered" && (
            <div className="mt-6">
              <Feedback text={feedback!} />
              <button
                className="mt-4 bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors text-lg"
                onClick={() => setNextQuestion()}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default App;
