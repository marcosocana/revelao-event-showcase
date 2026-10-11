"""Componentes compartidos (copiados de RRSS/_shared/build.py) para las piezas de RRSS2.

Uso:  python3 RRSS/_shared/build.py   (después:  sh RRSS/render.sh)
Todos los textos están aquí: edita este fichero y vuelve a generar.
La pieza 01 es independiente (RRSS/01-carrete-invitados).
"""
import os, random, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
I = "../../_shared/img/"

# ---------------------------------------------------------------- iconos
SVG = lambda d, w=2.4: f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round">{d}</svg>'
CHECK = SVG('<path d="M20 6 9 17l-5-5"/>', 3)
ARROW = SVG('<path d="M5 12h14M13 6l6 6-6 6"/>')
PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>'
IC_PHOTO = SVG('<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L6 21"/>', 2)
IC_VIDEO = SVG('<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3z"/>', 2)
IC_MIC = SVG('<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/>', 2)
IC_LOCK = SVG('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', 2.4)
IC_CHAT = SVG('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>', 2)
IC_X = SVG('<path d="M18 6 6 18M6 6l12 12"/>', 3)


def page(title, body, css=""):
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>{title}</title>
<link rel="stylesheet" href="../../_shared/base.css">
<style>{css}</style></head>
<body>
{body}
</body></html>
"""


def head(pill, h1, sub="", h1cls="", dot=True):
    d = '<span class="dot"></span>' if dot else ""
    s = f'<p class="sub">{sub}</p>' if sub else ""
    return f"""<header class="head">
  <img class="logo" src="{I}logo.png" alt="Revelao.cam">
  <div class="pill">{d}{pill}</div>
  <h1 class="{h1cls}">{h1}</h1>
  {s}
</header>"""


def cta(top=780, checks=("Sin app", "100% anónimo", "Sin registro"), label="Prueba gratis"):
    items = "".join(f"<span>{CHECK}{c}</span>" for c in checks)
    return f"""<div class="cta-wrap" style="top:{top}px">
  <div class="cta-space" data-label="{label}"></div>
  <div class="checks">{items}</div>
</div>"""


def mosaic(rows, top, fade=True, extra=""):
    """rows = [(alto, desplazamiento, [(foto, proporción), ...]), ...]"""
    out = []
    for h, off, tiles in rows:
        t = "".join(f'<div class="tile" style="width:{round(h*r)}px"><img src="{I}{p}"></div>' for p, r in tiles)
        out.append(f'<div class="row" style="height:{h}px;transform:translateX({off}px)">{t}</div>')
    return f'<div class="grid{" fade" if fade else ""}" style="top:{top}px{extra}"><div class="rows">{"".join(out)}</div></div>'


CLOSE_ROWS = [
    (330, -70, [("s03.jpg", .72), ("s01.jpg", .62), ("s02.jpg", .82), ("s04.jpg", .66), ("s05.jpg", .76)]),
    (320, -190, [("s12.jpg", .64), ("s07.jpg", .8), ("s08.jpg", .7), ("s09.jpg", .6), ("s10.jpg", .78)]),
    (330, -20, [("s13.jpg", .78), ("s14.jpg", .66), ("s15.jpg", .62), ("s18.jpg", .84), ("s17.jpg", .7)]),
]


def topbar(i, n):
    return f"""<div class="topbar"><img class="logo" src="{I}logo.png" alt="Revelao.cam"><span class="count">{i}/{n}</span></div>"""


def swipe(text="Desliza", top=1430):
    return f'<div style="position:absolute;left:0;right:0;top:{top}px;text-align:center;z-index:6"><span class="swipe">{text}{ARROW}</span></div>'


def phone(screen, style=""):
    return f'<div class="phone" style="{style}"><div class="island"></div><div class="screen">{screen}</div></div>'


def app_hero(names="Marcos &amp; María", photo="s13.jpg", stats="📷 0 fotos / 🎬 0 vídeos / 🔊 0 audios", h=560):
    return f"""<div class="app-hero" style="height:{h}px"><img src="{I}{photo}">
  <div class="info"><div class="names">{names}</div><div class="date">26/09/2026</div>
  <div class="welcome">¡Bienvenidos a nuestra boda!</div><div class="stats">{stats}</div></div></div>"""


def app_upload(photo="s13.jpg"):
    return app_hero(photo=photo, stats="📷 31 fotos / 🎬 6 vídeos / 🔊 4 audios") + f"""
<div class="app-body"><div class="app-q">¿Qué quieres hacer?</div>
  <div class="app-btns">
    <div class="app-btn"><i>{IC_PHOTO}</i>Foto</div>
    <div class="app-btn"><i>{IC_VIDEO}</i>Vídeo</div>
    <div class="app-btn"><i>{IC_MIC}</i>Audio</div>
  </div>
  <div class="app-note">Puedes subir todas las fotos que quieras hasta mañana a las 10:00. ¡Solo quedan 11 horas!</div>
</div>"""


def app_gallery(photos, stats="📷 847 fotos / 🎬 112 vídeos / 🔊 64 audios", banner=True):
    cells = "".join(f'<div><img src="{I}{p}"></div>' for p in photos)
    b = ('<div style="margin:18px 16px 6px;background:var(--primary);color:#fff;border-radius:18px;padding:14px;'
         'text-align:center;font-weight:700;font-size:24px">✨ ¡Ya se ha revelado todo!</div>') if banner else ""
    return app_hero(stats=stats, h=440) + b + f'<div class="app-grid">{cells}</div>'


def audio(dur="0:24", seed=1, on=.35, width=None):
    rnd = random.Random(seed)
    bars = []
    n = 26
    for k in range(n):
        h = rnd.randint(14, 66)
        bars.append(f'<b class="{"on" if k < n*on else ""}" style="height:{h}px"></b>')
    w = f"width:{width}px;" if width else ""
    return f'<div class="audio" style="{w}"><div class="play">{PLAY}</div><div class="wave">{"".join(bars)}</div><div class="meta">{dur}</div></div>'


def write(folder, name, html):
    """Escribe la versión sin botón (src/) y la versión con botón (src/con-botones/)."""
    d = os.path.join(ROOT, folder, "src")
    os.makedirs(os.path.join(d, "con-botones"), exist_ok=True)
    with open(os.path.join(d, name + ".html"), "w") as f:
        f.write(html)
    btn = re.sub(r'<div class="cta-space" data-label="([^"]*)"></div>',
                 lambda m: f'<div class="cta-btn">{m.group(1)}{ARROW}</div>', html)
    with open(os.path.join(d, "con-botones", name + ".html"), "w") as f:
        f.write(btn.replace("../../_shared/", "../../../_shared/"))


def close_slide(i, n, h1, sub, pill="Pruébalo gratis", label="Prueba gratis"):
    """Última slide de los carruseles: mismo esquema que la pieza 01."""
    return page("Revelao", head(pill, h1, sub, "md") + cta(label=label) + mosaic(CLOSE_ROWS, 980)
                + f'<span class="count" style="position:absolute;top:120px;right:72px">{i}/{n}</span>')


