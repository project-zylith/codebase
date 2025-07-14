/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./adapters/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode color palette based on #202C31
        dark: {
          // Primary backgrounds
          primary: "#202C31", // Main dark color
          secondary: "#2A3A40", // Slightly lighter for cards/sections
          tertiary: "#354049", // Even lighter for elevated elements

          // Surface colors
          surface: "#1A252A", // Darker than primary for deep backgrounds
          elevated: "#3A4A51", // For floating elements like dropdowns

          // Text colors
          text: {
            primary: "#E8F0F5", // Main text color
            secondary: "#B8C8D3", // Secondary text
            muted: "#8A9BA6", // Muted text
            disabled: "#5A6B76", // Disabled text
          },

          // Border colors
          border: {
            primary: "#3A4A51", // Main border color
            secondary: "#2A3A40", // Subtle borders
            accent: "#4A5A61", // Highlighted borders
          },

          // Accent colors
          accent: {
            blue: "#4A9EFF", // Adjusted blue for dark mode
            green: "#52C878", // Success color
            yellow: "#FFD93D", // Warning color
            red: "#FF6B6B", // Error color
            purple: "#A78BFA", // Purple accent
          },

          // Input and interactive elements
          input: {
            background: "#2A3A40",
            border: "#3A4A51",
            placeholder: "#6A7B86",
            focus: "#4A5A61",
          },

          // Shadow colors for elevation
          shadow: {
            light: "rgba(0, 0, 0, 0.2)",
            medium: "rgba(0, 0, 0, 0.3)",
            heavy: "rgba(0, 0, 0, 0.4)",
          },
        },

        // Light mode colors (keeping your existing palette)
        light: {
          primary: "#ffffff",
          secondary: "#f8f9fa",
          tertiary: "#e9ecef",

          text: {
            primary: "#333333",
            secondary: "#6c757d",
            muted: "#adb5bd",
            disabled: "#dee2e6",
          },

          border: {
            primary: "#e0e0e0",
            secondary: "#f1f3f4",
            accent: "#007AFF",
          },

          accent: {
            blue: "#007AFF",
            green: "#28a745",
            yellow: "#ffc107",
            red: "#dc3545",
            purple: "#6f42c1",
          },

          shadow: {
            light: "rgba(0, 0, 0, 0.1)",
            medium: "rgba(0, 0, 0, 0.15)",
            heavy: "rgba(0, 0, 0, 0.2)",
          },
        },
      },

      // Custom font weights for better typography
      fontWeight: {
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },

      // Custom spacing for consistent layouts
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },

      // Custom border radius for consistent rounded corners
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },

      // Custom shadows for depth
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.1)",
        medium: "0 4px 12px rgba(0, 0, 0, 0.15)",
        strong: "0 8px 24px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
