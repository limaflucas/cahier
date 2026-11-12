import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

export const PrepositionList = z.object({
  constructions: z.array(
    z.object({
      pattern: z.string().describe('e.g. "penser à qqn/qqch"'),
      meaning: z.string().describe('Brazilian Portuguese meaning'),
      example: z.string().describe('natural French sentence using the construction'),
      gap: z.string().describe('the example with its preposition replaced by ___'),
      answer: z.string().describe('the preposition as the example writes it (à, au, d\'…), or "" for none'),
      portuguese: z.string().describe('the Brazilian Portuguese construction, e.g. "pensar em alguém/algo"'),
      differsFromPortuguese: z.boolean().describe('whether translating the Portuguese word for word gets the preposition wrong'),
    }),
  ),
});

const prompt = (verb) =>
  `List the prepositional constructions of the French verb « ${verb} »: each preposition the verb commonly takes to introduce a complement (à, de, en, par, pour, sur, avec, contre, dans, chez, etc.).
Also list the constructions of this verb where Brazilian Portuguese puts a preposition but French puts none (as "gostar de algo" → "aimer qqch").
For each construction give:
- pattern: the verb + preposition + complement type, using qqn, qqch or inf. (e.g. "penser à qqn/qqch", "penser de qqch", "aimer qqch").
- meaning: its meaning in Brazilian Portuguese.
- example: one natural French sentence using it.
- gap: the example with its preposition replaced by "___", nothing else changed. Without a preposition, put "___" where Portuguese would put one.
- answer: the preposition exactly as the example writes it, contracted or elided (à, au, aux, de, du, des, d', en…), or "" when there is none.
- portuguese: the Brazilian Portuguese construction with the same meaning (e.g. "pensar em alguém/algo").
- differsFromPortuguese: true when translating the Portuguese construction word for word gets the French preposition wrong.
List distinct uses separately when the same preposition changes the meaning. Skip rare or archaic uses. Return an empty list when there is nothing to list.`;

export function createPrepositionFinder({ client, model = 'claude-sonnet-5-5' }) {
  return async function findPrepositions(verb) {
    const message = await client.messages.parse({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt(verb) }],
      output_config: { format: zodOutputFormat(PrepositionList) },
    });
    if (!message.parsed_output) throw new Error(`No prepositions parsed for "${verb}" (${message.stop_reason})`);
    return message.parsed_output.constructions;
  };
}
