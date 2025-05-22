'use server';

/**
 * @fileOverview A flow to calculate the AI Rival's XP gain based on the user's incomplete quests.
 *
 * - calculateRivalXp - A function that calculates the AI Rival's XP gain.
 * - CalculateRivalXpInput - The input type for the calculateRivalXp function.
 * - CalculateRivalXpOutput - The return type for the calculateRivalXp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateRivalXpInputSchema = z.object({
  incompleteQuests: z.array(
    z.object({
      xpValue: z.number().describe('The XP value of the incomplete quest.'),
      durationMinutes: z
        .number()
        .describe('The duration of the quest in minutes.'),
      timeRemainingMinutes: z
        .number()
        .describe('The time remaining for the quest in minutes.'),
    })
  ).describe('The list of incomplete quests with their XP values and remaining times.'),
});
export type CalculateRivalXpInput = z.infer<typeof CalculateRivalXpInputSchema>;

const CalculateRivalXpOutputSchema = z.object({
  rivalXpGain: z
    .number()
    .describe('The calculated XP gain for the AI Rival based on incomplete quests.'),
});
export type CalculateRivalXpOutput = z.infer<typeof CalculateRivalXpOutputSchema>;

export async function calculateRivalXp(input: CalculateRivalXpInput): Promise<CalculateRivalXpOutput> {
  return calculateRivalXpFlow(input);
}

const calculateRivalXpFlow = ai.defineFlow(
  {
    name: 'calculateRivalXpFlow',
    inputSchema: CalculateRivalXpInputSchema,
    outputSchema: CalculateRivalXpOutputSchema,
  },
  async input => {
    const {
incompleteQuests
} = input;

    // Calculate the total potential XP gain from incomplete quests
    const totalPotentialXp = incompleteQuests.reduce((sum, quest) => sum + quest.xpValue, 0);

    // Calculate the weighted XP gain based on the remaining time for each quest.
    const rivalXpGain = incompleteQuests.reduce((sum, quest) => {
      const weight = 1 - (quest.timeRemainingMinutes / quest.durationMinutes);
      return sum + quest.xpValue * weight;
    }, 0);

    return {
      rivalXpGain: rivalXpGain,
    };
  }
);
