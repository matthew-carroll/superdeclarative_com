#!/usr/bin/env bash
#
# Builds the website into build/jaspr.

set -euo pipefail
cd "$(dirname "$0")/.."

./tailwindcss -i styles/tailwind.css -o web/styles/tailwind.css --minify
dart run jaspr_cli:jaspr build

# Files that build_runner leaves next to the website, which aren't part of it.
rm -rf build/jaspr/packages build/jaspr/.dart_tool build/jaspr/.build.manifest
