/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'discord-dark': '#36393f',
                'discord-sidebar': '#202225',
                'discord-gray': '#2f3136',
                'discord-light': '#40444b',
                'discord-blue': '#5865F2',
                'discord-green': '#57F287',
                'discord-red': '#ED4245',
                'discord-gold': '#FEE75C',
                'discord-text': '#dcddde',
                'discord-text-muted': '#72767d',
            },
            fontFamily: {
                sans: ['gg sans', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
