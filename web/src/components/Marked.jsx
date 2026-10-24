export default function Marked({ text, strongClassName = 'font-semibold text-stone-900' }) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i} className={strongClassName}>{part}</strong> : part,
  );
}
