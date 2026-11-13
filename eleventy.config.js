// Eleventy build for galin-yan.com: src/ -> _site/ (deployed by Cloudflare Pages, see scripts/cf-build.sh).
export default function (eleventyConfig) {
  // Static files are copied as-is. The R&D page and its demo are legacy hand-written HTML,
  // so the whole projects/ folder is passthrough (only .njk files are templates, see below).
  for (const path of [
    'src/css', 'src/js', 'src/rsc', 'src/projects',
    'src/favicon.ico', 'src/favicon.svg', 'src/apple-touch-icon.png',
    'src/Good-Times-Regular.otf', 'src/_redirects', 'src/robots.txt',
  ]) eleventyConfig.addPassthroughCopy(path);

  // Pages are written as /about.html (not /about/index.html): Cloudflare Pages serves
  // that file at the clean URL /about. A folder would make /about redirect to /about/.
  // cleanUrl turns the output path back into the public URL for canonicals and the sitemap.
  eleventyConfig.addFilter('cleanUrl', (url) => url.replace(/(index)?\.html$/, ''));

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    templateFormats: ['njk'],          // plain .html in src/ is never processed
    htmlTemplateEngine: 'njk',
  };
}
