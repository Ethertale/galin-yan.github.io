// Computed front matter for src/project-pages.njk (one page per project).
// Fancybox is loaded only on pages that have a screenshot gallery.
export default {
  eleventyComputed: {
    title: (data) => `${data.p.title} - Galin Yan`,
    description: (data) => data.p.summary,
    libs: (data) => (data.p.gallery ? ['fancybox'] : []),
    scripts: (data) => ['/js/project.js', ...(data.p.liveCheck ? ['/js/site-status.js'] : [])],
  },
};
