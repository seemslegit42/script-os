
import { z } from 'zod';

/**
 * Represents a single scripture, which can be either canonical or user-forged.
 * @property {string} id - A unique identifier for the scripture.
 * @property {string} [title] - The title of a canonical scripture.
 * @property {string} [html] - The HTML content of a canonical scripture.
 * @property {string} [markdown] - The Markdown content of a canonical scripture.
 */
export type Scripture = {
    id: string;
    title?: string;
    html?: string;
    markdown?: string;
};


// Represents the structure of a user account in the system.
export type User = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl?: string;
  };
  
// Represents a workspace (or tenant) in the multi-tenant architecture.
export type Workspace = {
    id: string;
    name: string;
    aetherBalance: number; // Canon: Aether (Ξ) is the currency.
};

// Defines the available types of Micro-Apps that can be registered and launched.
export type MicroAppType = 
    | 'Terminal'
    | 'FinancialAdvisor';

// Represents the structure of a Micro-App instance on the Canvas.
export type MicroApp = {
    id: string; // Unique instance ID
    type: MicroAppType; // The type of the app, used to look up the component in the registry
    title: string;
    zIndex: number;
};

// Defines the schema for inputs to the BEEP agent.
export const BeepInputSchema = z.object({
    command: z.string().describe('The natural language command from the user.'),
});
export type BeepInput = z.infer<typeof BeepInputSchema>;

// Defines the schema for the structured output from the BEEP agent.
export const BeepOutputSchema = z.object({
  response: z.string().describe('The natural language response for the user.'),
  appToLaunch: z.object({
      type: z.custom<MicroAppType>(),
      title: z.string(),
  }).optional().describe('The Micro-App to launch, if any.'),
});
export type BeepOutput = z.infer<typeof BeepOutputSchema>;
