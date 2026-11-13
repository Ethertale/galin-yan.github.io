// Eleventy build for galin-yan.com: src/ -> _site/ (deployed by Cloudflare Pages, see scripts/cf-build.sh).
import Image from '@11ty/eleventy-img';

// Responsive images: originals stay in src/rsc/, resized copies go to _site/img/.
// AVIF and WebP for current browsers, the original format as the <img> fallback.
const IMAGE_OPTIONS = {
  outputDir: '_site/img/',
  urlPath: '/img/',
  formats: ['svg', 'avif', 'webp', 'auto'],
  svgShortCircuit: true,                         // an SVG is already resolution-independent: keep it as-is
};
const imageMeta = (src, widths) => Image(`src${src}`, { ...IMAGE_OPTIONS, widths });

export default function (eleventyConfig) {
  // {% image "/rsc/x.png", "Alt text", "(min-width: 992px) 400px, 100vw", { loading: "lazy" } %}
  // -> <picture> with AVIF/WebP sources and an <img> carrying width/height (no layout shift).
  // Widths larger than the original are skipped automatically.
  eleventyConfig.addAsyncShortcode('image', async (src, alt, sizes, attrs = {}, widths = [400, 800, 1200]) => {
    const meta = await imageMeta(src, widths);
    const extra = Object.fromEntries(Object.entries(attrs).filter(([, v]) => v != null && v !== ''));
    return Image.generateHTML(meta, { alt, sizes, ...extra });
  });

  // URL of a single WebP rendition, for images set from JS (the projects modal reads data-img).
  eleventyConfig.addAsyncShortcode('imageUrl', async (src, width = 800) => {
    const meta = await imageMeta(src, [width]);
    return (meta.svg || meta.webp)[0].url;
  });

  // Static files are copied as-is. The R&D page and its demo are legacy hand-written HTML,
  // so the whole projects/ folder is passthrough (only .njk files are templates, see below).
  for (const path of [
    'src/css', 'src/js', 'src/rsc', 'src/projects',
    'src/favicon.ico', 'src/favicon.svg', 'src/apple-touch-icon.png',
    'src/fonts', 'src/_redirects', 'src/robots.txt',
  ]) eleventyConfig.addPassthroughCopy(path);

  // Pages are written as /about.html (not /about/index.html): Cloudflare Pages serves
  // that file at the clean URL /about. A folder would make /about redirect to /about/.
  // cleanUrl turns the output path back into the public URL for canonicals and the sitemap.
  eleventyConfig.addFilter('cleanUrl', (url) => url.replace(/(index)?\.html$/, ''));

  // [{url: 'a'}, {url: 'b'}] | pluck('url') -> ['a', 'b']  (e.g. socials -> JSON-LD sameAs)
  eleventyConfig.addFilter('pluck', (list, key) => list.map((item) => item[key]));

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    templateFormats: ['njk'],          // plain .html in src/ is never processed
    htmlTemplateEngine: 'njk',
  };
}
