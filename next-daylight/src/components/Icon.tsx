export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const shapes: Record<string, React.ReactNode> = {
    right: (
      <>
        <path d="M4 12h15m-6-6 6 6-6 6" />
      </>
    ),
    up: <path d="M6 18 18 6M6 6h12v12" />,
    play: <path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none" />,
    pause: (
      <>
        <path d="M8 5v14M16 5v14" strokeWidth="3" />
      </>
    ),
    sound: (
      <>
        <path d="M3 10h3l5-4v12l-5-4H3Z" />
        <path d="M15 8q4 4 0 8m3-11q7 7 0 14" />
      </>
    ),
    mute: (
      <>
        <path d="M3 10h3l5-4v12l-5-4H3Z" />
        <path d="m16 9 5 6m0-6-5 6" />
      </>
    ),
    menu: <path d="M3 8h18M3 16h18" />,
    close: <path d="m5 5 14 14m0-14L5 19" />,
    peel: (
      <>
        <path d="M5 3h14v11l-6 6H5Zm8 17v-6h6" />
      </>
    ),
    headphones: (
      <>
        <path d="M4 14v-2a8 8 0 1 1 16 0v2" />
        <rect x="3" y="12" width="4" height="8" rx="1" />
        <rect x="17" y="12" width="4" height="8" rx="1" />
      </>
    ),
    folder: <path d="M3 6h7l2 3h9v11H3Z" />,
    left: <path d="M20 12H5l6-6m-6 6 6 6" />,
  };
  return (
    <svg
      width={size}
      height={size}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[name]}
    </svg>
  );
}
export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 36 36" aria-hidden="true">
      <g fill="#B81D18">
        <path d="M1 7 12 4l14 3 9-3v6l-9 3-14-3-11 3zM1 17l11-3 14 3 9-3v6l-9 3-14-3-11 3zM1 27l11-3 14 3 9-3v6l-9 3-14-3-11 3z" />
      </g>
    </svg>
  );
}
