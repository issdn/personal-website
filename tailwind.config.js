/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",

  theme: {
    extend: {
      backgroundImage: {
        "special-gradient":
          "linear-gradient(60deg, rgba(108,145,56,1) 30%, rgba(93,56,145,1) 40%, rgba(93,56,145,1) 60%, rgba(108,145,56,1) 70%)",
      },
      transitionProperty: {
        width: "width",
        wh: "width, height",
      },
      keyframes: {
        width: {
          0: { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        background: {
          "0%": {
            "background-position": "0% 50%",
          },
          "100%": {
            "background-position": "100% 50%",
          },
        },
      },
      animation: {
        background: "background 2s linear infinite",
      },
      fontFamily: {
        primary: "Inter, arial, sans-serif",
        secondary: "Roboto Mono",
      },
      colors: {
        primary: "#5D3891",
        "primary-tint-10": "#6d4c9c",
        "primary-tint-20": "#7d60a7",
        accent: "#F99417",
        "accent-secondary": "#D9D9D9",
        light: "#E8E2E2",
        "light-tint-80": "#faf9f9",
        "light-tint-30": "#efebeb",
        "light-tint-20": "#ede8e8",
        dark: "#1a1a1a",
        "dark-tint-10": "#313131",
        "accent-secondary-dark": "#232323",
        special: "#6c9138",
      },
      dropShadow: {
        "md-light": [
          "0 4px 3px rgb(232 226 226 / 0.07)",
          "0 2px 2px rgb(232 226 226 / 0.06)",
        ],
      },
      boxShadow: {
        "indication-sm": "0 0 0 5px rgba(232, 226, 226, 0.25)",
        "indication-sm-dark": "0 0 0 5px rgba(26, 26, 26, 0.25)",
        "indication-md": "0 0 0 8px rgba(232, 226, 226, 0.25)",
        "indication-md-dark": "0 0 0 8px rgba(26, 26, 26, 0.25)",
        "special-primary": "3px 3px 0 rgba(93, 56, 145, 1)",
        "special-dark": "3px 3px 0 rgba(26, 26, 26, 1)",
        "special-light": "3px 3px 0 rgba(232, 226, 226, 1)",
      },
    },
  },
  plugins: [],
};
