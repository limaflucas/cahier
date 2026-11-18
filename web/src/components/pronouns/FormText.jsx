/**
 * A pronoun with its elided form, if any: me (m').
 * @param {{ form: { form: string, elided?: string } }} props
 */
export default function FormText({ form }) {
  return (
    <>
      {form.form}
      {form.elided && <span className="font-sans text-xs text-stone-500"> ({form.elided})</span>}
    </>
  );
}
