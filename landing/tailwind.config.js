/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark space grey palette inspired by Camille Mormal
        dark: {
          // Primary backgrounds
          "bg-primary": "#0A0A0A",
          "bg-secondary": "#1A1A1A",
          "bg-tertiary": "#2A2A2A",
          "bg-card": "#1A1A1A",
          "bg-hover": "#2A2A2A",

          // Text colors
          "text-primary": "#FFFFFF",
          "text-secondary": "#B3B3B3",
          "text-tertiary": "#808080",
          "text-muted": "#666666",

          // Accent colors
          "accent-blue": "#4A9EFF",
          "accent-purple": "#8B5CF6",
          "accent-green": "#10B981",
          "accent-orange": "#F59E0B",
          "accent-red": "#EF4444",
          "accent-cyan": "#06B6D4",

          // Borders and dividers
          "border-light": "#333333",
          "border-medium": "#404040",
          "border-dark": "#555555",
        },
        // Dark space grey gradients
        gradient: {
          "dark-subtle": "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
          "dark-card": "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)",
        },
      },
      backgroundImage: {
        "dark-subtle": "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
        "dark-card": "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "hover-lift": "hoverLift 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        hoverLift: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-2px)" },
        },
      },
      fontFamily: {
        notion: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
