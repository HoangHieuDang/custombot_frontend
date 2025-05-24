// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" }, // Start off-screen right
          "100%": { transform: "translateX(-100%)" }, // Move off-screen left
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite", // Use the keyframes above
      },
    },
  },
  plugins: [],
};
