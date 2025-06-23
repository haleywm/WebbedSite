#!/bin/bash

# Quit on error
set -e

# Build
JEKYLL_ENV=production jekyll build

rsync --archive --verbose --delete www/ haleywm@192.168.0.3:internet-caddy/www/
