import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                sepia: {
                    bg: "#F9F7F1", // Cleaner warm white
                    text: "#151515", // Ink black
                    link: "#1E6091", // Classic blue link
                    accent: "#8A785D", // Warm brown accent
                    secondary: "#78716c", // Warm stone for secondary text/borders
                    // Dark mode colors
                    "dark-bg": "#1a1614",
                    "dark-text": "#e8e0d5",
                    "dark-link": "#5ca4d4",
                    "dark-accent": "#b8a583",
                    "dark-secondary": "#a8a29e",
                },
            },
            boxShadow: {
                soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)", // Soft, diffused shadow
                card: "0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0,0,0,0.1)", // Subtle card shadow
            },
            borderRadius: {
                lg: "0.75rem",
                xl: "1rem",
            },
        },
    },
    plugins: [],
};
export default config;
