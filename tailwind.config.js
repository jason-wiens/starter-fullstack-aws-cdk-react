/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      white: "#fff",
      black: "#000",
      primary: {
        100: "#025D9C",
        500: "#01385E",
        900: "#001A2B",
      },
      secondary: {
        100: "#00BEC4",
        500: "#00999E",
        900: "#006063",
      },
      accent: {
        100: "#FF00AC",
        500: "#E10098",
        900: "#A5006F",
      },
      green: {
        100: "#EBF9EB",
        500: "#1CB651",
      },
      yellow: {
        100: "#FEF8E8",
        500: "#F2C858",
      },
      red: {
        100: "#F39F8D",
        500: "#EA350E",
      },
      gray: {
        100: "#F6F6F6",
        200: "#D5D5D5",
        400: "#9A9A9A",
        600: "#747474",
        800: "#282828",
      },
    },
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      serif: ["Cardo", "serif"],
    },
    fontSize: {
      xs: "0.5rem",
      sm: "0.75rem",
      base: "0.875rem",
      lg: "1rem",
      xl: "1.125rem",
      "2xl": "1.25rem",
      "3xl": "1.5rem",
      "4xl": "1.875rem",
      "5xl": "2.25rem",
      "6xl": "3rem",
      "7xl": "4rem",
    },
    extend: {
      screens: {
        "2xl": "1536px",
      },
    },
    boxShadow: {
      dark1: [
        "0px 2px 1px -1px rgba(0,0,0,0.2)",
        "0px 1px 1px 0px rgba(0,0,0,0.14)",
        "0px 1px 3px 0px rgba(0,0,0,0.12)",
      ],
      dark2: [
        "0px 3px 1px -2px rgba(0,0,0,0.2)",
        "0px 2px 2px 0px rgba(0,0,0,0.14)",
        "0px 1px 5px 0px rgba(0,0,0,0.12)",
      ],
      dark3: [
        "0px 3px 3px -2px rgba(0,0,0,0.2)",
        "0px 3px 4px 0px rgba(0,0,0,0.14)",
        "0px 1px 8px 0px rgba(0,0,0,0.12)",
      ],
      dark4: [
        "0px 2px 4px -1px rgba(0,0,0,0.2)",
        "0px 4px 5px 0px rgba(0,0,0,0.14)",
        "0px 1px 10px 0px rgba(0,0,0,0.12)",
      ],
      dark5: [
        "0px 3px 5px -1px rgba(0,0,0,0.2)",
        "0px 5px 8px 0px rgba(0,0,0,0.14)",
        "0px 1px 14px 0px rgba(0,0,0,0.12)",
      ],
      dark6: [
        "0px 4px 5px -2px rgba(0,0,0,0.2)",
        "0px 7px 10px 1px rgba(0,0,0,0.14)",
        "0px 2px 16px 1px rgba(0,0,0,0.12)",
      ],
      dark7: [
        "0px 6px 6px -3px rgba(0,0,0,0.2)",
        "0px 10px 14px 1px rgba(0,0,0,0.14)",
        "0px 4px 18px 3px rgba(0,0,0,0.12)",
      ],
      dark8: [
        "0px 8px 9px -5px rgba(0,0,0,0.2)",
        "0px 15px 22px 2px rgba(0,0,0,0.14)",
        "0px 6px 28px 5px rgba(0,0,0,0.12)",
      ],
      dark9: [
        "0px 10px 13px -6px rgba(0,0,0,0.2)",
        "0px 20px 31px 3px rgba(0,0,0,0.14)",
        "0px 8px 38px 7px rgba(0,0,0,0.12)",
      ],
      dark10: [
        "0px 11px 15px -7px rgba(0,0,0,0.2)",
        "0px 24px 38px 3px rgba(0,0,0,0.14)",
        "0px 9px 46px 8px rgba(0,0,0,0.12)",
      ],
    },
  },
  plugins: [],
};
