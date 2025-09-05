#!/bin/bash

# Quit on error
set -e

# Build
JEKYLL_ENV=production bundle exec jekyll build

# Compress
zstd -v -r www
find www -type f -not -path "*.zst" -not -path "*.br" | xargs brotli -v

rsync --archive --verbose --delete www/ haleywm@poggers.au:internet-caddy/www/
