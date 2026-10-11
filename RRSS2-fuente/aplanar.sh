#!/bin/sh
# Copia todos los PNG a ../RRSS2 sin subcarpetas.
# Sin botón:  <pieza>[-<slide>].png      Con botón: <pieza>[-<slide>]-conboton.png
cd "$(dirname "$0")"
DEST=../RRSS2
mkdir -p "$DEST"
for dir in [0-9][0-9]-*/; do
  dir=${dir%/}
  n=$(ls "$dir"/*.png | wc -l | tr -d ' ')
  for f in "$dir"/*.png; do
    s=$(basename "$f" .png)
    if [ "$n" -eq 1 ]; then base="$dir"; else base="$dir-$s"; fi
    cp "$f" "$DEST/$base.png"
    cp "$dir/con-botones/$s.png" "$DEST/$base-conboton.png"
  done
done
