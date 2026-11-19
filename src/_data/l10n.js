// Everything a page needs in its own language, keyed by language code: l10n.en, l10n.bg.
//   .t        interface strings: src/_l10n/<lang>.json
//   .home .about .projects   content: src/_data/<name>.json (English), with src/_l10n/<lang>/<name>.json
//                            laid over it (only the translated fields; links, images and slugs stay shared)
//   .projectPages            one entry per project page to build: { lang, p, next }
// src/_data/eleventyComputed.js hands the right language to each page as t / home / about / projects.
//
// Build check (1.6.2.4): a language listed in site.json "langs" is published, so it must have every
// interface key that English has. A missing key fails the build; content gaps only fall back to English.
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const site = read('src/_data/site.json');
const CONTENT = ['home', 'about', 'projects'];
const LANGS = ['en', 'bg'];

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

// Lay `over` on `base`. Objects merge by key; arrays of objects merge by "slug" when they have one,
// otherwise by position; anything else (strings, string lists) is replaced.
function merge(base, over) {
  if (over === undefined) return base;
  if (isObj(base) && isObj(over)) {
    const out = { ...base };
    for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
    return out;
  }
  if (Array.isArray(base) && Array.isArray(over) && base.every(isObj)) {
    if (base.every((x) => x.slug)) return base.map((x) => merge(x, over.find((o) => o.slug === x.slug)));
    return base.map((x, i) => merge(x, over[i]));
  }
  return over;
}

// "a.b.c" paths of every string leaf, to compare languages.
const leaves = (o, pre = '') => Object.entries(o).flatMap(([k, v]) =>
  k.startsWith('_') ? [] : isObj(v) ? leaves(v, pre + k + '.') : [pre + k]);

const en = {
  t: read('src/_l10n/en.json'),
  ...Object.fromEntries(CONTENT.map((n) => [n, read(`src/_data/${n}.json`)])),
};

const out = { en };
for (const lang of LANGS.filter((l) => l !== 'en')) {
  const uiPath = `src/_l10n/${lang}.json`;
  const ui = existsSync(uiPath) ? read(uiPath) : {};
  const missing = leaves(en.t).filter((k) => !leaves(ui).includes(k));
  if (missing.length && site.langs.includes(lang)) {
    throw new Error(`l10n: ${uiPath} is missing ${missing.length} key(s): ${missing.join(', ')}`);
  }
  out[lang] = { t: merge(en.t, ui) };
  for (const n of CONTENT) {
    const p = `src/_l10n/${lang}/${n}.json`;
    out[lang][n] = existsSync(p) ? merge(en[n], read(p)) : en[n];
  }
}

// Project pages for every published language, each knowing the next project for the "Next" link.
out.projectPages = site.langs.flatMap((lang) => out[lang].projects.map((p, i, all) =>
  ({ lang, p, next: all[(i + 1) % all.length] })));

export default out;
