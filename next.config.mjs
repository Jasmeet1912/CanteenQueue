/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { dangerouslyAllowSVG: true }, // food.svg placeholder
  // Turns on Tailwind CSS for every .css file (needed for the styling to work).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
