#!/bin/bash

./scripts/clean_lockfiles.sh
./scripts/clean_node_modules.sh
pnpm i
cd addon && pnpm run clean && pnpm i && pnpm run build && cd ..
cd webapp && pnpm i && cd ..
