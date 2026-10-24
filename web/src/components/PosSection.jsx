import { tagLabel } from '../labels.js';
import Classification from './Classification.jsx';
import Gloss from './Gloss.jsx';
import LevelBadge from './LevelBadge.jsx';

function Sense({ sense }) {
  return (
    <Gloss text={sense.definition} translation={sense.translations.join(', ')} examples={sense.examples.map((example) => example.fr)}>
      <div className="flex flex-wrap items-center gap-1.5">
        {sense.level && <LevelBadge level={sense.level} />}
        {sense.tags.map((tag) => (
          <span key={tag} className="text-xs italic text-stone-500">{tagLabel(tag)}</span>
        ))}
      </div>
    </Gloss>
  );
}

export default function PosSection({ section }) {
  return (
    <section className="mt-8">
      <h2 className="border-b border-stone-200 pb-1 text-sm">
        <Classification pos={section.pos} gender={section.gender} />
      </h2>
      <ol className="mt-4 list-decimal space-y-5 pl-6">
        {section.senses.map((sense, i) => <Sense key={i} sense={sense} />)}
      </ol>
    </section>
  );
}
