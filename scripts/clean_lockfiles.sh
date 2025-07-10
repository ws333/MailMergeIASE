#!/bin/sh
# Remove all pnpm, npm, and yarn lockfiles recursively from the project root

find . -type f \( -name 'pnpm-lock.yaml' -o -name 'package-lock.json' -o -name 'yarn.lock' \) -exec rm -f '{}' +
echo "All lockfiles have been removed."
