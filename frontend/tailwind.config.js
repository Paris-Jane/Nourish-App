/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nourish: {
          bg: "#FAF8F5",
          sage: "#7C9E87",
          terracotta: "#C4714F",
          ink: "#2C2416",
          muted: "#8C7B6B",
          card: "#FFFFFF",
          border: "#EAE4DC",
          amber: "#F0A500",
          success: "#7C9E87",
        },
      },
      fontFamily: {
        heading: ["'DM Serif Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 18px rgba(44, 36, 22, 0.06)",
      },
      backgroundImage: {
        "warm-gradient":
          "radial-gradient(circle at top left, rgba(196, 113, 79, 0.12), transparent 34%), radial-gradient(circle at top right, rgba(124, 158, 135, 0.14), transparent 32%)",
      },
    },
  },
  plugins: [],
};
