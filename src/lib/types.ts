

/**
 * Represents a single annotation made by a user on a piece of content.
 * @property {string} id - A unique identifier for the annotation.
 * @property {string} selection - The specific text that was selected and annotated.
 * @property {string} comment - The user's comment or insight about the selection.
 * @property {string} targetId - The ID of the scripture or document this annotation belongs to.
 */
export type Annotation = {
  id: string;
  selection: string;
  comment: string;
  targetId: string;
};

/**
 * Represents a single scripture, which can be either canonical or user-forged.
 * @property {string} id - A unique identifier for the scripture.
 * @property {string} [title] - The title of a canonical scripture.
 * @property {string} [query] - The user query that generated a forged scripture.
 * @property {string} [fileName] - The original filename for a canonical scripture.
 * @property {string} [html] - The HTML content of a canonical scripture.
 * @property {string} [markdown] - The Markdown content of a canonical scripture.
 * @property {string} [why] - The 'Why' part of a forged scripture's content.
 * @property {string} [how] - The 'How' part of a forged scripture's content.
 * @property {string} [imageUrl] - The URL of the sigil image for a forged scripture.
 * @property {any} [createdAt] - The timestamp of when a scripture was created.
 * @property {Annotation[]} [annotations] - An array of annotations associated with this scripture.
 */
export type Scripture = {
    id: string;
    title?: string;
    query?: string;
    fileName?: string;
    html?: string;
    markdown?: string;
    why?: string;
    how?: string;
    imageUrl?: string;
    createdAt?: any;
    annotations?: Annotation[];
};
