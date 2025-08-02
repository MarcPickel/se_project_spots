// Connect plugins to the file
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

module.exports = {
  // Connects plugins to PostCSS
  plugins: [autoprefixer, cssnano({ preset: "default" })],
};
