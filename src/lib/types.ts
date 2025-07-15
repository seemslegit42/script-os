

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

// Defines the available types of Micro-Apps that can be registered and launched.
export type MicroAppType = 'Terminal' | 'UsageMonitor' // Add other app types here as they are created

// Represents the structure of a Micro-App instance on the Canvas.
export type MicroApp = {
    id: string; // Unique instance ID
    type: MicroAppType; // The type of the app, used to look up the component in the registry
    title: string;
    // Position and size are managed by the windowing component
    // x: number;
    // y: number;
    // width: number;
    // height: number;
    zIndex: number;
};
