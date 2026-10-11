#!/bin/sh
# Exporta la pieza a PNG 1080x1920
cd "$(dirname "$0")"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1080,1920 --force-device-scale-factor=1 --virtual-time-budget=8000 \
  --screenshot="$PWD/carrete-invitados-1080x1920.png" "file://$PWD/src/index.html"
mkdir -p con-botones
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1080,1920 --force-device-scale-factor=1 --virtual-time-budget=8000 \
  --screenshot="$PWD/con-botones/carrete-invitados-1080x1920.png" "file://$PWD/src/con-botones/index.html"
