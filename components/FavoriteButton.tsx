export function FavoriteButton({
  active,
  onClick,
  size = 22,
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      className="shrink-0 p-1 text-amber-500"
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path
          d="M12 2.5 L15 9.1 L22 9.9 L16.8 14.6 L18.2 21.5 L12 18 L5.8 21.5 L7.2 14.6 L2 9.9 L9 9.1 Z"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
