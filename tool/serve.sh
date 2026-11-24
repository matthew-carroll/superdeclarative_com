#!/usr/bin/env bash
#
# Runs the website at http://localhost:8080, and recompiles its stylesheet when styles,
# components, scripts, or SVGs change.
#
# Any extra args are passed straight through to `jaspr serve`.

set -euo pipefail
cd "$(dirname "$0")/.."

# Compile once up front, so that the first page load is styled.
./tailwindcss -i styles/tailwind.css -o web/styles/tailwind.css
./tailwindcss -i styles/tailwind.css -o web/styles/tailwind.css --watch=always &
trap 'kill $! 2>/dev/null || true' EXIT

# The proxy port differs from the default (5567) so that this site can run next to other Jaspr sites.
dart run jaspr_cli:jaspr serve --proxy-port 5569 "$@"
