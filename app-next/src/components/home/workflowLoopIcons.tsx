// 1. Import
export const WorkflowImportIcon = ({ size = 72 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 72 72"
    aria-label="Import data icon"
  >
    <defs>
      <linearGradient id="import-top" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4F8DF5" />
        <stop offset="100%" stopColor="#2A5CD8" />
      </linearGradient>
      <linearGradient id="import-side" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2649A8" />
        <stop offset="100%" stopColor="#182C6E" />
      </linearGradient>
      <linearGradient id="import-funnel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#71C4FF" />
        <stop offset="100%" stopColor="#2B8BEA" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="20" rx="14" ry="6" fill="url(#import-top)" />
    <path
      d="M10 20v16c0 3.3 6.3 6 14 6s14-2.7 14-6V20"
      fill="url(#import-side)"
    />
    <ellipse cx="24" cy="36" rx="14" ry="6" fill="#1B3A90" opacity="0.9" />
    <path
      d="M40 18h20c1.7 0 2.6 2.1 1.4 3.4l-7.5 8.1a5 5 0 0 0-1.3 3.4v8.3l-5.5 6.5a1.5 1.5 0 0 1-2.7-1V33a5 5 0 0 0-1.3-3.4l-7.5-8.1C37.4 20.1 38.3 18 40 18z"
      fill="url(#import-funnel)"
    />
    <path
      d="M50 10v10"
      stroke="#E9F3FF"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M46 18l4 4 4-4"
      fill="none"
      stroke="#E9F3FF"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 2. Buil and Run
export const WorkflowRunIcon = ({ size = 72 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 72 72"
    aria-label="Build and run models icon"
  >
    <defs>
      <linearGradient id="cube-top" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#66CCFF" />
        <stop offset="100%" stopColor="#2C9FE8" />
      </linearGradient>
      <linearGradient id="cube-side-left" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2157C5" />
        <stop offset="100%" stopColor="#163578" />
      </linearGradient>
      <linearGradient id="cube-side-right" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2E6BE0" />
        <stop offset="100%" stopColor="#1A3F96" />
      </linearGradient>
    </defs>
    <polygon points="24,14 40,20 24,26 8,20" fill="url(#cube-top)" />
    <polygon points="8,20 24,26 24,44 8,38" fill="url(#cube-side-left)" />
    <polygon points="40,20 24,26 24,44 40,38" fill="url(#cube-side-right)" />
    <circle
      cx="44"
      cy="42"
      r="14"
      fill="none"
      stroke="#99D6FF"
      strokeWidth="2.2"
      strokeDasharray="4 3"
    />
    <path
      d="M44 30c4 0 7.5 2.1 9.5 5.4"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M53 34.5l1 4.5-4.2-1.7"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M44 54c-4 0-7.5-2.1-9.5-5.4"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M35 49.5l-1-4.5 4.2 1.7"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 3. Export & Publish
export const WorkflowExportIcon = ({ size = 72 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 72 72"
    aria-label="Export and publish results icon"
  >
    <defs>
      <linearGradient id="stack-top" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7DE3FF" />
        <stop offset="100%" stopColor="#33B5E5" />
      </linearGradient>
      <linearGradient id="stack-mid" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5DA6F5" />
        <stop offset="100%" stopColor="#356DE0" />
      </linearGradient>
      <linearGradient id="stack-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2646A5" />
        <stop offset="100%" stopColor="#162F73" />
      </linearGradient>
    </defs>
    <polygon points="16,30 40,22 56,28 32,36" fill="url(#stack-top)" />
    <polygon points="14,38 38,30 54,36 30,44" fill="url(#stack-mid)" />
    <polygon points="12,46 36,38 52,44 28,52" fill="url(#stack-bottom)" />
    {/* Arrow Up */}
    <path
      d="M36 55V39"
      stroke="#2A5CD8"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <polygon points="32,42 36,39 40,42" fill="#2A5CD8" />
  </svg>
);

// Usage: as a row or grid
export const WorkflowLoopIcons = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 32,
    }}
  >
    <span>
      <WorkflowImportIcon />
      <div style={{ textAlign: "center" }}>Import</div>
    </span>
    <span>
      <WorkflowRunIcon />
      <div style={{ textAlign: "center" }}>Build & Run</div>
    </span>
    <span>
      <WorkflowExportIcon />
      <div style={{ textAlign: "center" }}>Export & Publish</div>
    </span>
  </div>
);
