// Computed front matter for src/project-pages.njk (one page per project per language).
// Pagination hands each page pp = { lang, p, next } from src/_data/l10n.js.
// Fancybox is loaded only on pages that have a screenshot gallery.
export default {
  eleventyComputed: {
    lang: (data) => data.pp.lang,
    title: (data) => data.pp.p.title + data.l10n[data.pp.lang].t.meta.projectSuffix,
    description: (data) => data.pp.p.summary,
    libs: (data) => (data.pp.p.gallery ? ['fancybox'] : []),
    scripts: (data) => ['/js/project.js', ...(data.pp.p.liveCheck ? ['/js/site-status.js'] : [])],
  },
};
