/**
 * The Orenda mark: a single sprout leaving a stem. Drawn rather than imported
 * so it inherits `currentColor` and never costs a network request.
 */
export function LeafMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 21.5V11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12 11.5c0-4.2 2.8-7.6 7-8.5.6 4.6-1.4 8.6-5.2 9.4-.7.2-1.3.1-1.8-.1a1.2 1.2 0 0 1 0-.8Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M11.6 15.4c-.5-3.1-2.6-5.3-5.7-5.9-.3 3.3 1.2 6 4 6.6.5.1 1 .1 1.4-.1a.9.9 0 0 0 .3-.6Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
    </svg>
  );
}
