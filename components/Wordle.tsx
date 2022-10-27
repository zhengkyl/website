import classnames from "classnames";
import { ChangeEvent, useMemo, useRef, useState } from "react";

enum LetterMode {
  GREEN,
  YELLOW,
  GREY,
  WHITE,
}

/**
 * Takes an array of uppercase words and makes a multi-word wordle-thing
 */
export default function Wordle({ words }: { words: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const focusInput = () => {
    if (inputRef.current == null) return;
    inputRef.current.focus();
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const [guessResult, setGuessResult] = useState<LetterMode[]>([]);
  const [guessWord, setGuessWord] = useState("");
  const combinedWord = words.join("");

  const letterOcc = useMemo(() => {
    const dict = {};
    for (const letter of combinedWord) {
      dict[letter] ? dict[letter]++ : (dict[letter] = 1);
    }
    return dict;
  }, [combinedWord]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawGuess = e.target.value;

    // get uppercase latin letters w/ length equal to word
    const cleanGuess = rawGuess
      .replace(/[^A-Za-z]/g, "")
      .slice(0, combinedWord.length)
      .toUpperCase();

    setGuessWord(cleanGuess);

    const guessOcc: Record<string, number> = {};
    const indexColor = Array(combinedWord.length).fill(LetterMode.WHITE);

    // Set all correct values first
    [...cleanGuess].forEach((letter, i) => {
      if (letter === combinedWord[i]) {
        indexColor[i] = LetterMode.GREEN;
        guessOcc[letter] ? guessOcc[letter]++ : (guessOcc[letter] = 1);
      }
    });

    [...cleanGuess].forEach((letter, i) => {
      if (indexColor[i] === LetterMode.GREEN) return;

      guessOcc[letter] ? guessOcc[letter]++ : (guessOcc[letter] = 1);

      if (guessOcc[letter] > (letterOcc[letter] ?? 0)) {
        indexColor[i] = LetterMode.GREY;
        return;
      }

      indexColor[i] = LetterMode.YELLOW;
    });

    setGuessResult(indexColor);
  };
  const guessAt = (i: number) => {
    if (i > guessWord.length) {
      return "";
    }
    return guessWord[i];
  };

  return (
    <>
      <div
        onClick={focusInput}
        className="text-white font-bold text-3xl sm:text-5xl flex flex-wrap justify-center gap-x-12 gap-y-4 mt-8"
      >
        {words.map((word, i) => {
          const offset = words.reduce(
            (sum, word, index) => (i > index ? sum + word.length : sum),
            0
          );
          return (
            <div key={i} className="flex gap-2">
              {[...word].map((_, j) => {
                const comboIndex = j + offset;
                const guessLetter = guessAt(comboIndex);
                const color = guessResult[comboIndex];
                const currentLetter = comboIndex === guessWord.length;
                return (
                  <div
                    key={comboIndex}
                    className={classnames(
                      "border-2 rounded-sm border-slate-400 h-0 w-0 p-6 sm:p-8 flex justify-center items-center",
                      {
                        "bg-green-400 border-green-400":
                          color === LetterMode.GREEN,
                        "bg-orange-300 border-orange-300":
                          color === LetterMode.YELLOW,
                        "bg-slate-400": color === LetterMode.GREY,
                        "before:content-['｜'] before:text-slate-300 before:animate-[blink_1s_steps(2,start)_infinite]":
                          focused && currentLetter,
                      }
                    )}
                  >
                    {guessLetter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <input
        type="text"
        value={guessWord}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputRef}
        className="opacity-0 w-0 h-0"
      />
    </>
  );
}
