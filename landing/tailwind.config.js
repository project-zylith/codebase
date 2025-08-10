/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Green and blue cosmic palette
        cosmic: {
          // Primary backgrounds
          "deep-black": "#0A1A0F",
          "dark-green": "#064E3B",
          "card-dark": "#1A2F23",
          "space-black": "#0A0A1A",
          "cosmic-teal": "#0A2A1A",

          // Text colors
          "off-white": "#F0FDF4",
          "pure-white": "#FFFFFF",
          "light-green": "#A7F3D0",
          cyan: "#00D4FF",

          // Accent colors
          "main-teal": "#14B8A6",
          emerald: "#10B981",
          "vibrant-blue": "#3B82F6",
          "electric-cyan": "#00D4FF",
          mint: "#6EE7B7",
        },
        // Additional gradients for cosmic effects
        gradient: {
          "cosmic-start": "#0A1A0F",
          "cosmic-end": "#064E3B",
          "nebula-start": "#0A0A1A",
          "nebula-end": "#0A2A1A",
        },
      },
      backgroundImage: {
        "cosmic-gradient": "linear-gradient(135deg, #0A1A0F 0%, #064E3B 100%)",
        "nebula-gradient":
          "linear-gradient(135deg, #0A0A1A 0%, #1A1A3A 30%, #0A2A1A 60%, #0A1A0F 100%)",
        "star-glow":
          "radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)" },
          "100%": { boxShadow: "0 0 30px rgba(124, 58, 237, 0.8)" },
        },
      },
      fontFamily: {
        cosmic: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
