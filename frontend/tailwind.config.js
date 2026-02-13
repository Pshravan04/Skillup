/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#6366f1', // Indigo 500
                    secondary: '#a855f7', // Purple 500
                    accent: '#f43f5e', // Rose 500
                    dark: '#0f172a',    // Slate 900
                    darker: '#020617',  // Slate 950
                    surface: 'rgba(30, 41, 59, 0.7)', // Slate 800 with transparency
                },
                'discord-dark': '#0f172a',
                'discord-sidebar': '#020617',
                'discord-gray': '#1e293b',
                'discord-light': '#334155',
                'discord-blue': '#6366f1',
                'discord-text': '#f1f5f9',
                'discord-text-muted': '#94a3b8',
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
            },
            backgroundImage: {
                'aurora-gradient': 'radial-gradient(circle at top left, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.15), transparent 40%)',
            },
        },
    },
    plugins: [],
}
