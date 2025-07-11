import type { SVGProps } from "react";

export const ScribeGlyph = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3v18" />
    <path d="m19 4-7 4-7-4" />
    <path d="m5 20 7-4 7 4" />
    <path d="M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
  </svg>
);

export const AnnotationGlyph = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 2 2.8 5.6L21 9l-4.2 4.1.9 5.9L12 16.1l-5.7 2.9.9-5.9L3 9l6.2-1.4z" />
  </svg>
);
