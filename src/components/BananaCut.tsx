import { memo } from "react";

/**
 * BananaCut — flat vector illustration of a banana being sliced.
 * Pure SVG + CSS keyframes. Loops every 5.5s.
 */
export const BananaCut = memo(function BananaCut({
  className = "",
  ariaLabel = "Animated banana being sliced",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  // Slice x positions along the banana (viewBox 0 0 400 500)
  const slices = [130, 175, 220, 265, 305];

  return (
    <div
      className={`banana-cut-root relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      {/* soft ground shadow */}
      <div className="banana-cut-shadow" aria-hidden />

      <svg
        viewBox="0 0 400 500"
        className="banana-cut-svg h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="banana-clip">
            {/* banana body path used as clip so slice gaps look clean */}
            <path d="M70 300 C 90 200, 180 130, 320 150 C 330 170, 320 200, 300 205 C 200 210, 140 260, 130 320 C 128 335, 105 340, 88 335 C 74 331, 66 318, 70 300 Z" />
          </clipPath>
        </defs>

        {/* whole banana body (with slice separations) */}
        <g className="banana-body">
          {/* banana fill */}
          <g clipPath="url(#banana-clip)">
            <rect x="0" y="0" width="400" height="500" fill="#F4C531" />
            {/* subtle highlight */}
            <path
              d="M95 295 C 115 215, 200 155, 305 170"
              stroke="#F9DD68"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            {/* subtle lower shade */}
            <path
              d="M95 322 C 160 300, 240 240, 310 205"
              stroke="#D9A81C"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              opacity="0.35"
            />

            {/* slice cut gaps (revealed one-by-one) */}
            {slices.map((x, i) => (
              <rect
                key={i}
                x={x - 3}
                y={100}
                width={6}
                height={260}
                fill="#F1EDE3"
                className={`slice-gap slice-gap-${i}`}
              />
            ))}
          </g>

          {/* banana outline */}
          <path
            d="M70 300 C 90 200, 180 130, 320 150 C 330 170, 320 200, 300 205 C 200 210, 140 260, 130 320 C 128 335, 105 340, 88 335 C 74 331, 66 318, 70 300 Z"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* stem */}
          <path
            d="M312 152 L 328 132 L 340 138 L 326 158"
            fill="#7a5a2b"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* tip */}
          <circle cx="78" cy="332" r="6" fill="#4a3418" />
        </g>

        {/* knife */}
        <g className="knife">
          {/* blade */}
          <polygon
            points="0,0 180,0 200,22 180,44 0,44"
            fill="#dfe3e8"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinejoin="round"
            transform="translate(0,0)"
          />
          {/* blade shine */}
          <line x1="10" y1="10" x2="175" y2="10" stroke="#ffffff" strokeWidth="3" opacity="0.7" />
          {/* handle */}
          <rect x="-90" y="4" width="90" height="36" fill="#4a2f1a" stroke="#1a1a1a" strokeWidth="3" />
          <circle cx="-70" cy="22" r="3" fill="#1a1a1a" />
          <circle cx="-30" cy="22" r="3" fill="#1a1a1a" />
        </g>
      </svg>

      <style>{`
        .banana-cut-root { background: #F1EDE3; }
        .banana-cut-shadow {
          position: absolute;
          left: 12%;
          right: 12%;
          bottom: 18%;
          height: 14px;
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 70%);
          filter: blur(2px);
          animation: banana-shadow 5500ms ease-in-out infinite;
        }
        @keyframes banana-shadow {
          0%,100% { transform: scaleX(1); opacity: 0.9; }
          50% { transform: scaleX(0.94); opacity: 0.7; }
        }

        .banana-body {
          transform-origin: 200px 250px;
          animation: banana-bob 5500ms ease-in-out infinite;
        }
        @keyframes banana-bob {
          0%, 100% { transform: translateY(0); }
          14%, 30%, 46%, 62%, 78% { transform: translateY(2px); }
          16%, 32%, 48%, 64%, 80% { transform: translateY(-1px); }
        }

        .knife {
          transform-origin: 200px 22px;
          animation: knife-cycle 5500ms cubic-bezier(.6,.05,.4,.95) infinite;
        }
        /* knife choreography: slide in from top-right, chop 5 times moving left, exit */
        @keyframes knife-cycle {
          0%    { transform: translate(360px, -140px) rotate(-10deg); }
          8%    { transform: translate(285px,  40px) rotate(-6deg); }
          /* chop 1 */
          12%   { transform: translate(285px, 110px) rotate(-6deg); }
          16%   { transform: translate(285px,  55px) rotate(-6deg); }
          /* move to next slice */
          20%   { transform: translate(245px,  55px) rotate(-6deg); }
          /* chop 2 */
          24%   { transform: translate(245px, 120px) rotate(-6deg); }
          28%   { transform: translate(245px,  55px) rotate(-6deg); }
          32%   { transform: translate(200px,  55px) rotate(-6deg); }
          /* chop 3 */
          36%   { transform: translate(200px, 140px) rotate(-6deg); }
          40%   { transform: translate(200px,  55px) rotate(-6deg); }
          44%   { transform: translate(155px,  55px) rotate(-6deg); }
          /* chop 4 */
          48%   { transform: translate(155px, 165px) rotate(-6deg); }
          52%   { transform: translate(155px,  55px) rotate(-6deg); }
          56%   { transform: translate(110px,  55px) rotate(-6deg); }
          /* chop 5 */
          60%   { transform: translate(110px, 195px) rotate(-6deg); }
          64%   { transform: translate(110px,  55px) rotate(-6deg); }
          /* exit up-left */
          78%   { transform: translate( 20px, -60px) rotate(-24deg); }
          100%  { transform: translate(360px, -140px) rotate(-10deg); }
        }

        .slice-gap { opacity: 0; }
        .slice-gap-0 { animation: slice-appear 5500ms linear infinite; animation-delay: 0ms; }
        .slice-gap-1 { animation: slice-appear 5500ms linear infinite; animation-delay: 0ms; }
        .slice-gap-2 { animation: slice-appear 5500ms linear infinite; animation-delay: 0ms; }
        .slice-gap-3 { animation: slice-appear 5500ms linear infinite; animation-delay: 0ms; }
        .slice-gap-4 { animation: slice-appear 5500ms linear infinite; animation-delay: 0ms; }
        /* Each gap uses its own keyframes so it appears exactly at its chop moment */
        .slice-gap-4 { animation-name: slice-appear-1; }
        .slice-gap-3 { animation-name: slice-appear-2; }
        .slice-gap-2 { animation-name: slice-appear-3; }
        .slice-gap-1 { animation-name: slice-appear-4; }
        .slice-gap-0 { animation-name: slice-appear-5; }

        @keyframes slice-appear-1 { 0%,13% { opacity: 0 } 14%,74% { opacity: 1 } 75%,100% { opacity: 0 } }
        @keyframes slice-appear-2 { 0%,25% { opacity: 0 } 26%,74% { opacity: 1 } 75%,100% { opacity: 0 } }
        @keyframes slice-appear-3 { 0%,37% { opacity: 0 } 38%,74% { opacity: 1 } 75%,100% { opacity: 0 } }
        @keyframes slice-appear-4 { 0%,49% { opacity: 0 } 50%,74% { opacity: 1 } 75%,100% { opacity: 0 } }
        @keyframes slice-appear-5 { 0%,61% { opacity: 0 } 62%,74% { opacity: 1 } 75%,100% { opacity: 0 } }

        @media (prefers-reduced-motion: reduce) {
          .knife, .banana-body, .banana-cut-shadow, .slice-gap { animation: none !important; }
          .slice-gap { opacity: 1; }
        }
      `}</style>
    </div>
  );
});
