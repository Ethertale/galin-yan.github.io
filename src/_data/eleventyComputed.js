// Per page: hand the templates their language's strings and content (see l10n.js).
// `lang` comes from the page's pagination (alias: lang) and defaults to English (src/_data/lang.js),
// so templates keep using t.*, home.*, about.* and projects as before.
const pick = (key) => (data) => data.l10n[data.lang][key];

export default {
  t: pick('t'),
  home: pick('home'),
  about: pick('about'),
  projects: pick('projects'),
};
