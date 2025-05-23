import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/googleai'; // Removed to avoid API key requirement for local dev

export const ai = genkit({
  plugins: [
    // googleAI() // Removed
  ],
  // model: 'googleai/gemini-2.0-flash', // Removed as it depends on the Google AI plugin
});
