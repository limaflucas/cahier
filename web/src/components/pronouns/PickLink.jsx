/**
 * A link to an anchor of the page that lets the page move there and highlight a form.
 * @param {{ to: string, formKey?: string, onPick: (id: string, key?: string) => void,
 *   className?: string, style?: object, children: import('react').ReactNode }} props
 */
export default function PickLink({ to, formKey, onPick, className, style, children }) {
  return (
    <a
      href={`#${to}`}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onPick(to, formKey);
      }}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
