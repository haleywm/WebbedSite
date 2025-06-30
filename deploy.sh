#!/bin/bash

# Quit on error
set -e

# Build
JEKYLL_ENV=production bundle exec jekyll build

# Compress
zstd -v -r www

rsync --archive --verbose --delete www/ haleywm@192.168.0.3:internet-caddy/www/
