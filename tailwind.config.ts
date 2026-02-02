import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
    ],
    prefix: "",
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
                border: "hsl(214, 32%, 91%)", // #E5E7EB
                input: "hsl(214, 32%, 91%)",
                ring: "hsl(221, 83%, 53%)", // #2563EB
                background: "hsl(0, 0%, 100%)", // #FFFFFF
                foreground: "hsl(222, 47%, 11%)",
                surface: "hsl(210, 20%, 98%)", // #F9FAFB
                primary: {
                    DEFAULT: "hsl(221, 83%, 53%)", // #2563EB Electric Blue
                    foreground: "hsl(0, 0%, 100%)",
                },
                secondary: {
                    DEFAULT: "hsl(243, 75%, 59%)", // #4F46E5 Deep Indigo
                    foreground: "hsl(0, 0%, 100%)",
                },
                success: {
                    DEFAULT: "hsl(158, 64%, 52%)", // #10B981 Emerald Green
                    foreground: "hsl(0, 0%, 100%)",
                },
                destructive: {
                    DEFAULT: "hsl(0, 84%, 60%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                muted: {
                    DEFAULT: "hsl(210, 40%, 96%)",
                    foreground: "hsl(215, 16%, 47%)",
                },
                accent: {
                    DEFAULT: "hsl(210, 40%, 96%)",
                    foreground: "hsl(222, 47%, 11%)",
                },
                popover: {
                    DEFAULT: "hsl(0, 0%, 100%)",
                    foreground: "hsl(222, 47%, 11%)",
                },
                card: {
                    DEFAULT: "hsl(0, 0%, 100%)",
                    foreground: "hsl(222, 47%, 11%)",
                },
            },
            borderRadius: {
                lg: "0.5rem",
                md: "calc(0.5rem - 2px)",
                sm: "calc(0.5rem - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "slide-in": {
                    from: { transform: "translateX(-100%)" },
                    to: { transform: "translateX(0)" },
                },
                "shake": {
                    "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
                    "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
                    "30%, 50%, 70%": { transform: "translate3d(-3px, 0, 0)" },
                    "40%, 60%": { transform: "translate3d(3px, 0, 0)" }
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "slide-in": "slide-in 0.3s ease-out",
                "shake": "shake 2s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
