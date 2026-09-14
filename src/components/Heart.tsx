import { useId } from "react";
export const heartPath =
  "M120 211 C102 193 20 139 20 78 C20 23 88 12 120 60 C152 12 220 23 220 78 C220 139 138 193 120 211Z";
export function Heart({
  progress = 24,
  side,
}: {
  progress?: number;
  side?: "left" | "right";
}) {
  const id = useId().replaceAll(":", "");
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <linearGradient
          id={`${id}g`}
          gradientUnits="userSpaceOnUse"
          x1="35"
          y1="25"
          x2="205"
          y2="205"
        >
          <stop stopColor="#e99aab" />
          <stop offset=".25" stopColor="#b94560" />
          <stop offset=".58" stopColor="#71192f" />
          <stop offset="1" stopColor="#340914" />
        </linearGradient>
        <clipPath id={`${id}h`}>
          <path d={heartPath} />
        </clipPath>
        <clipPath id={`${id}s`}>
          <rect
            x={side === "right" ? 120 : 0}
            y="0"
            width={side ? 120 : 240}
            height="240"
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}s)`}>
        <path d={heartPath} fill="#211017" stroke="#79414e" strokeWidth=".6" />
        <g clipPath={`url(#${id}h)`}>
          {Array.from({ length: 24 }, (_, i) => (
            <rect
              key={i}
              className="heart-fragment"
              x="0"
              y={211 - (i + 1) * 8}
              width="240"
              height="8.5"
              fill={`url(#${id}g)`}
              style={{ opacity: i < progress ? 1 : 0 }}
            />
          ))}
        </g>
        <path
          d="M38 79C36 39 86 29 108 61"
          fill="none"
          stroke="#ffd4dd"
          strokeOpacity=".35"
          strokeWidth="1.5"
        />
        <path
          d={heartPath}
          fill="none"
          stroke="#ed99aa"
          strokeOpacity=".3"
          strokeWidth=".7"
        />
      </g>
    </svg>
  );
}
