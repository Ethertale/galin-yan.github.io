// Eleventy build for galin-yan.com: src/ -> _site/ (deployed by Cloudflare Pages, see scripts/cf-build.sh).
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import Image from '@11ty/eleventy-img';

// Third-party libraries, self-hosted from node_modules (exact versions in package.json,
// integrity-checked by npm via package-lock.json). Served from /vendor/<pkg>@<version>/,
// so an upgrade changes the URL and the long cache in src/headers.njk stays safe.
const VENDOR = {
  bootstrap: { pkg: 'bootstrap',     css: 'dist/css/bootstrap.min.css',  js: 'dist/js/bootstrap.bundle.min.js' },
  aos:       { pkg: 'aos',           css: 'dist/aos.css',                js: 'dist/aos.js' },
  fancybox:  { pkg: '@fancyapps/ui', css: 'dist/fancybox/fancybox.css',  js: 'dist/fancybox/fancybox.umd.js' },
};
const pkgVersion = (pkg) => JSON.parse(readFileSync(`node_modules/${pkg}/package.json`, 'utf8')).version;

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
  // vendor.bootstrap.css -> '/vendor/bootstrap@5.3.8/bootstrap.min.css' (+ the matching passthrough copy)
  const vendor = {};
  for (const [name, lib] of Object.entries(VENDOR)) {
    const dir = `vendor/${name}@${pkgVersion(lib.pkg)}`;
    vendor[name] = {};
    for (const kind of ['css', 'js']) {
      const file = lib[kind].split('/').pop();
      eleventyConfig.addPassthroughCopy({ [`node_modules/${lib.pkg}/${lib[kind]}`]: `${dir}/${file}` });
      vendor[name][kind] = `/${dir}/${file}`;
    }
  }
  eleventyConfig.addGlobalData('vendor', vendor);

  // '/css/main.css' | bust -> '/css/main.css?v=1a2b3c4d' (hash of the file's content).
  // /css and /js are cached for a year (src/headers.njk): a changed file gets a new URL.
  eleventyConfig.addFilter('bust', (url) =>
    `${url}?v=${createHash('sha256').update(readFileSync(`src${url}`)).digest('hex').slice(0, 8)}`);

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

  // '#6B6B6B' | contrast('#FAFAFA') -> '5.10' (WCAG 2 contrast ratio; AA = 4.5 for text, 3 for large text)
  const luminance = (hex) => {
    const [r, g, b] = hex.replace('#', '').match(/../g).map((h) => {
      const v = parseInt(h, 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  eleventyConfig.addFilter('contrast', (fg, bg) => {
    const [a, b] = [luminance(fg), luminance(bg)];
    return ((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);
  });

  // 'https://mdoil.bg/' | origin -> 'https://mdoil.bg'  (CSP source lists in src/headers.njk)
  eleventyConfig.addFilter('origin', (url) => new URL(url).origin);

  // [{url: 'a'}, {url: 'b'}] | pluck('url') -> ['a', 'b']  (e.g. socials -> JSON-LD sameAs)
  eleventyConfig.addFilter('pluck', (list, key) => list.map((item) => item[key]));

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    templateFormats: ['njk'],          // plain .html in src/ is never processed
    htmlTemplateEngine: 'njk',
  };
}
