import HeadwordMark from '../HeadwordMark.jsx';

const BLANK = /_{2,}/;

/**
 * A sentence with a blank (___): empty while the learner answers, then filled with the answer.
 * @param {{ text: string, filler?: string | null, missing: string }} props filler: null while unanswered,
 *   '' when nothing goes in the blank; missing: what the blank stands for, for screen readers
 */
export default function GapSentence({ text, filler = null, missing }) {
  const [before, after] = text.split(BLANK);
  if (filler === '') return `${before.trimEnd()} ${after.trimStart()}`;
  return (
    <>
      {before}
      {filler === null ? (
        <span className="inline-block w-14 border-b-2 border-stone-400">
          <span className="sr-only">{missing}</span>
        </span>
      ) : (
        <HeadwordMark>{filler}</HeadwordMark>
      )}
      {after}
    </>
  );
}
