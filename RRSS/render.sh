#!/bin/sh
# Exporta a PNG 1080x1920 todas las piezas generadas (02-16),
# sin botón (carpeta de la pieza) y con botón (subcarpeta con-botones/).
# Uso:  sh RRSS/render.sh            -> todas
#       sh RRSS/render.sh 09 10      -> solo las que empiezan por esos números
# La pieza 01 tiene su propio render.sh.
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for dir in [0-9][0-9]-*/; do
  dir=${dir%/}
  [ -f "$dir/render.sh" ] && continue
  if [ $# -gt 0 ]; then
    match=0; for p in "$@"; do case "$dir" in "$p"*) match=1;; esac; done
    [ $match -eq 0 ] && continue
  fi
  mkdir -p "$dir/con-botones"
  for html in "$dir"/src/*.html "$dir"/src/con-botones/*.html; do
    name=$(basename "$html" .html)
    out="$dir/$name.png"
    case "$html" in */con-botones/*) out="$dir/con-botones/$name.png";; esac
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
      --window-size=1080,1920 --force-device-scale-factor=1 --virtual-time-budget=8000 \
      --screenshot="$PWD/$out" "file://$PWD/$html" >/dev/null 2>&1
    echo "$out"
  done
done
