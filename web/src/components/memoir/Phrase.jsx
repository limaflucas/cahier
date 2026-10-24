import HeadwordMark from '../HeadwordMark.jsx';

export default function Phrase({ text, blank = false }) {
  return text.split('**').map((part, i) => {
    if (i % 2 === 0) return part;
    if (!blank) return <HeadwordMark key={i}>{part}</HeadwordMark>;
    return (
      <span key={i} className="inline-block w-20 border-b-2 border-stone-400">
        <span className="sr-only">mot manquant</span>
      </span>
    );
  });
}
