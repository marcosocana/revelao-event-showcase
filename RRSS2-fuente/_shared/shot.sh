#!/bin/sh
# Captura un HTML a PNG 1080x1920.  Uso: shot.sh <html> <png>
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1080,1920 --force-device-scale-factor=1 --virtual-time-budget=8000 \
  --screenshot="$PWD/$2" "file://$PWD/$1" >/dev/null 2>&1 && echo "$2"
