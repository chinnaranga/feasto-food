/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                background: '#0B0F14',
                surface: '#121821',
                elevated: '#161D27',
                border: '#1F2937',
                primary: '#FF6B00',
                'primary-start': '#FF6B00',
                'primary-end': '#FF3D00',
                success: '#22C55E',
                muted: '#9CA3AF',
                white: '#F9FAFB',

                // Legacy support mapping (maps old green theme to new orange/dark theme where appropriate)
                feasto: {
                    bg: '#0B0F14',
                    card: '#121821',
                    primary: '#FF6B00', // Mapped to new orange
                    accent: '#FF3D00',
                    soft: '#F9FAFB',
                    danger: '#EF4444',
                    text: '#F9FAFB',
                    muted: '#9CA3AF',
                },
                brand: {
                    green: '#16A34A',
                    dark: '#14532D',
                    light: '#22C55E',
                    accent: '#FF6B00',
                },
            },
            borderRadius: {
                xl: "1rem",
                '2xl': "1.25rem",
                '3xl': "1.75rem",
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                'neon': '0 0 20px rgba(255, 107, 0, 0.5)',
                soft: "0 8px 30px rgba(0,0,0,0.45)",
                card: "0 12px 40px rgba(0,0,0,0.6)",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'Satoshi', 'sans-serif'],
            },
            backgroundImage: {
                'primary-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF3D00 100%)',
                'glass-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            },
        },
    },
    plugins: [],
}
