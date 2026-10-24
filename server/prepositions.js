import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

export const PrepositionList = z.object({
  constructions: z.array(
    z.object({
      pattern: z.string().describe('e.g. "penser à qqn/qqch"'),
      meaning: z.string().describe('Brazilian Portuguese meaning'),
      example: z.string().describe('natural French sentence using the construction'),
    }),
  ),
});

const prompt = (verb) =>
  `List the prepositional constructions of the French verb « ${verb} »: each preposition the verb commonly takes to introduce a complement (à, de, en, par, pour, sur, avec, contre, dans, chez, etc.).
For each construction give:
- pattern: the verb + preposition + complement type, using qqn, qqch or inf. (e.g. "penser à qqn/qqch", "penser de qqch").
- meaning: its meaning in Brazilian Portuguese.
- example: one natural French sentence using it.
List distinct uses separately when the same preposition changes the meaning. Skip rare or archaic uses. Return an empty list if the verb takes no preposition.`;

export function createPrepositionFinder({ client, model = 'claude-sonnet-5-5' }) {
  return async function findPrepositions(verb) {
    const message = await client.messages.parse({
      model,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt(verb) }],
      output_config: { format: zodOutputFormat(PrepositionList) },
    });
    if (!message.parsed_output) throw new Error(`No prepositions parsed for "${verb}" (${message.stop_reason})`);
    return message.parsed_output.constructions;
  };
}
