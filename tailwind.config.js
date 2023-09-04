/** @type {import('tailwindcss').Config} */
import { withMaterialColors } from "tailwind-material-colors";

module.exports = withMaterialColors(
    {
        content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
        plugins: [],
    },
    {
        primary: "#7FFD4F",
    },
);
