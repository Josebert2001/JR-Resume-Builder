interface TaloryIconProps {
  size?: number;
  className?: string;
}

export function TaloryIcon({ size = 28, className }: TaloryIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Talory logo"
    >
      {/* T-mark crossbar */}
      <rect x="2" y="4" width="18" height="6" rx="2" fill="#2d6a4f" />
      {/* T-mark stem */}
      <rect x="8" y="4" width="6" height="23" rx="2" fill="#2d6a4f" />
      {/* 4-point sparkle — top-right, left point aligns with crossbar end */}
      <path
        d="M25,1 L26.3,5.3 L30,7 L26.3,8.7 L25,13 L23.7,8.7 L20,7 L23.7,5.3 Z"
        fill="#c05621"
      />
    </svg>
  );
}
