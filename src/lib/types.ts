

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
