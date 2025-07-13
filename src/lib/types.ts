

export type Annotation = {
  id: string;
  selection: string;
  comment: string;
  targetId: string;
};

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
