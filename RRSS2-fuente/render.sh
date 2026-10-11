#!/bin/sh
# Exporta a PNG 1080x1920 todas las piezas de RRSS2 en paralelo:
# sin botón en la carpeta de la pieza y con botón en su subcarpeta con-botones/.
# Uso:  sh RRSS2/render.sh          -> todas
#       sh RRSS2/render.sh 07 12    -> solo las que empiezan por esos números
cd "$(dirname "$0")"
list=""
for dir in [0-9][0-9]-*/; do
  dir=${dir%/}
  if [ $# -gt 0 ]; then
    match=0; for p in "$@"; do case "$dir" in "$p"*) match=1;; esac; done
    [ $match -eq 0 ] && continue
  fi
  mkdir -p "$dir/con-botones"
  for html in "$dir"/src/*.html "$dir"/src/con-botones/*.html; do
    name=$(basename "$html" .html)
    out="$dir/$name.png"
    case "$html" in */con-botones/*) out="$dir/con-botones/$name.png";; esac
    list="$list$html $out
"
  done
done
printf "%s" "$list" | xargs -n 2 -P 6 sh _shared/shot.sh
