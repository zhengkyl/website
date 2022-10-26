import styled from "@emotion/styled";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { css, keyframes, SerializedStyles } from "@emotion/react";

const grey = "#abb2bf";
const yellow = "#e5c07b";
const green = "#98c379";
// const black = "#282c24";
// const white = "#ffffff";

const flash = keyframes`
  from {
    color: ${grey};
  }
  to {
    color: white;
  }
`;

const wordleStyles = css`
  font-size: 250%;
  font-weight: 700;
  color: white;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em 1.2em;
  user-select: none;
`;

const WordBox = styled.div`
  display: flex;
  gap: 0.2em;
`;

const LetterBox = styled.div`
  background-color: transparent;
  border: 2px solid ${grey};
  padding: 0.75em;
  line-height: 0;
  width: 0;
  display: flex;
  justify-content: center;
`;

const blinkStyles = css`
  animation: ${flash} 1s steps(2, jump-none) infinite;
`;

const yellowStyles = css`
  background-color: ${yellow};
  border-color: ${yellow};
`;
const greenStyles = css`
  background-color: ${green};
  border-color: ${green};
`;
const greyStyles = css`
  background-color: ${grey};
  border-color: ${grey};
`;

const indicatorStyles = css`
  transition: opacity 200ms ease;
`;
const hide = css`
  opacity: 0;
`;
const inputStyles = css`
  opacity: 0;
  padding: 0;
  height: 0;
  width: 0;
`;
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

  const [letterOcc, setLetterOcc] = useState<Record<string, number>>({});
  const [guessResult, setGuessResult] = useState<(SerializedStyles | null)[]>(
    []
  );
  const [guessWord, setGuessWord] = useState("");
  const [combinedWord, setCombinedWord] = useState("");

  // Create map with letter to letter occurrences as key values
  useEffect(() => {
    const combined = words.join("");
    setLetterOcc(
      [...combined].reduce(
        (obj, letter) => (obj[letter] ? obj[letter]++ : (obj[letter] = 1), obj),
        {} as Record<string, number>
      )
    );
    setCombinedWord(combined);
  }, [words]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawGuess = e.target.value;

    // get uppercase latin letters w/ length equal to word
    const cleanGuess = rawGuess
      .replace(/[^A-Za-z]/g, "")
      .slice(0, combinedWord.length)
      .toUpperCase();

    setGuessWord(cleanGuess);

    const guessOcc: Record<string, number> = {};

    // Set all correct values first
    const firstPass = [...cleanGuess].reduce((result, letter, index) => {
      if (letter === combinedWord[index]) {
        result.push(greenStyles);
        guessOcc[letter] ? guessOcc[letter]++ : (guessOcc[letter] = 1);
      } else {
        result.push(null);
      }
      return result;
    }, [] as (SerializedStyles | null)[]);

    // Correctly set incorrect values
    const secondPass: (SerializedStyles | null)[] = [...cleanGuess].reduce(
      (result, letter, index) => {
        if (result[index]) return result;

        guessOcc[letter] ? guessOcc[letter]++ : (guessOcc[letter] = 1);

        // Determine letter color based on occ
        if (guessOcc[letter] > (letterOcc[letter] || 0)) {
          result[index] = greyStyles;
        } else {
          result[index] = yellowStyles;
        }
        return result;
      },
      firstPass
    );
    setGuessResult(secondPass);
  };
  const guessAt = (i: number) => {
    if (i > guessWord.length) {
      return "";
    }
    if (i === guessWord.length) {
      return "｜";
    }
    return guessWord[i];
  };

  return (
    <>
      <input
        type="text"
        value={guessWord}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        css={inputStyles}
        ref={inputRef}
      />
      <span
        css={css`
          ${indicatorStyles};
          ${focused ? hide : null}
        `}
      >
        Tap to focus
      </span>
      <div css={wordleStyles} onClick={focusInput}>
        {words.map((word, i) => {
          const offset = words.reduce(
            (sum, word, index) => (i > index ? sum + word.length : sum),
            0
          );
          return (
            <WordBox key={i}>
              {[...word].map((_, j) => {
                const realIndex = j + offset;
                const guessLetter = guessAt(realIndex);
                const color =
                  realIndex < guessResult.length
                    ? guessResult[realIndex]
                    : null;
                return (
                  <LetterBox
                    key={realIndex}
                    css={css`
                      ${color};
                      ${focused && realIndex === guessResult.length
                        ? blinkStyles
                        : null}
                    `}
                  >
                    {guessLetter}
                  </LetterBox>
                );
              })}
            </WordBox>
          );
        })}
      </div>
    </>
  );
}
