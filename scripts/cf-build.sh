#!/usr/bin/env bash
# Cloudflare Pages build for galin-yan.com.
#
# Dashboard (Settings -> Builds & deployments), shared by ALL branches:
#   Build command:  if [ -f scripts/cf-build.sh ]; then bash scripts/cf-build.sh; else mkdir -p _site && git ls-files -z | xargs -0 cp --parents -t _site; fi
#   Output dir:     _site
# Branches without this script (main, until v2.0) take the `else` path:
# a plain copy of every tracked file - exactly what was deployed before.
#
# Stage 1.2.3.0: same plain copy, minus repo-only files that should never be public.
# Stage 1.2.3.1+: replaced by the Eleventy build.
set -euo pipefail

OUT=_site
rm -rf "$OUT"
mkdir -p "$OUT"

# Repo-only files: tooling and config, not website content.
EXCLUDE='^(\.gitignore|scripts/|package(-lock)?\.json$|README\.md$)'

git ls-files -z \
  | grep -zvE "$EXCLUDE" \
  | xargs -0 cp --parents -t "$OUT"

echo "cf-build: copied $(find "$OUT" -type f | wc -l) files into $OUT/ (branch: ${CF_PAGES_BRANCH:-local})"
