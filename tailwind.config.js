/* eslint-env node */

/** @type {import('tailwindcss').Config} */
import { withMaterialColors } from 'tailwind-material-colors';

export default withMaterialColors(
  {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    plugins: [],
  },
  {
    primary: '#7FFD4F',
  },
);
