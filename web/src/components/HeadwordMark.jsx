export default function HeadwordMark({ children }) {
  return (
    <mark className="rounded-sm bg-transparent bg-linear-to-t from-amber-200 from-40% to-transparent to-40% px-1 text-inherit">
      {children}
    </mark>
  );
}
