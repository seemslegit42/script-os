

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
    creditBalance: number;
  };
  
  // Represents the structure of a Micro-App instance on the Canvas.
  export type MicroApp = {
    id: string; // Unique instance ID
    type: string; // e.g., 'Terminal', 'UsageMonitor'
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
  };
