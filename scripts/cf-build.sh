#!/usr/bin/env bash
# Cloudflare Pages build for galin-yan.com.
#
# Dashboard (Settings -> Builds & deployments), shared by ALL branches:
#   Build command:  if [ -f scripts/cf-build.sh ]; then bash scripts/cf-build.sh; else mkdir -p _site && git ls-files -z | xargs -0 cp --parents -t _site; fi
#   Output dir:     _site
# Branches without this script (main, until v2.0) take the `else` path:
# a plain copy of every tracked file - exactly what was deployed before.
#
# Stage 1.2.3+: Eleventy builds src/ into _site/ (config: eleventy.config.js).
# Only what's in src/ can reach the site, so repo files (scripts/, package.json,
# .gitignore...) are never public.
set -euo pipefail

# Pages installs dependencies itself when it sees package.json; this covers local runs.
[ -d node_modules/@11ty/eleventy ] || npm ci

rm -rf _site
npx @11ty/eleventy

echo "cf-build: $(find _site -type f | wc -l) files in _site/ (branch: ${CF_PAGES_BRANCH:-local})"
