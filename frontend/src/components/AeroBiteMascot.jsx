export default function AeroBiteMascot({ size = 64 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="AeroBite mascot"
        >
            {/* Background circle */}
            <circle cx="60" cy="60" r="56" fill="#22c55e" />

            {/* Plate */}
            <circle cx="60" cy="68" r="26" fill="#ffffff" />
            <circle cx="60" cy="68" r="18" fill="#15803d" opacity="0.2" />

            {/* Fork */}
            <rect x="30" y="32" width="6" height="32" rx="3" fill="#ffffff" />
            <rect x="30" y="26" width="6" height="6" rx="2" fill="#ffffff" />

            {/* Spoon */}
            <rect x="84" y="32" width="6" height="32" rx="3" fill="#ffffff" />
            <circle cx="87" cy="26" r="6" fill="#ffffff" />

            {/* F Letter */}
            <text
                x="60"
                y="74"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                fill="#22c55e"
                fontFamily="var(--font-sans)"
            >
                F
            </text>
        </svg>
    );
}
