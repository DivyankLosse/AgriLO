/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#11d421",
                "primary-dark": "#0ea61b",
                "background-light": "#f6f8f6",
                "background-dark": "#102212",
                "surface-light": "#ffffff",
                "surface-dark": "#1a2e1d", // Unified surface dark color
                "text-main": "#111812", // Authentications text-main
                "text-main-light": "#111812", // Upload page text-main-light
                "text-main-dark": "#e0e6e1", // Upload page text-main-dark
                "text-light": "#618965", // Auth text-light
                "text-secondary-light": "#618965", // Upload text-secondary-light
                "text-secondary-dark": "#9ab09c", // Upload text-secondary-dark
                "border-light": "#dbe6dc",
                "border-dark": "#2a402d",
                "text-primary-light": "#111812", // Landing page compat
                "text-primary-dark": "#f0f4f0",  // Landing page compat
            },
            fontFamily: {
                "display": ["Lexend", "Noto Sans", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
