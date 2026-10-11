"""Genera el HTML de las piezas RRSS 02-16 de Revelao.

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


# ====================================================================== 02
def p02():
    css = """
.stack { position:absolute; left:0; right:0; top:1010px; height:900px; }
.stack .polaroid { position:absolute; left:50%; width:560px; }
.stack .ph { width:516px; height:600px; overflow:hidden; position:relative; }
.stack .ph img { width:100%; height:100%; object-fit:cover; filter: blur(26px) saturate(1.2); transform: scale(1.25); }
.stack .cap { position:absolute; left:0; right:0; bottom:26px; text-align:center; font-size:26px; font-weight:600; color:#666; }
.lockchip { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); display:flex; align-items:center; gap:14px;
  background:rgba(255,255,255,.94); border-radius:9999px; padding:18px 30px; font-size:28px; font-weight:700; white-space:nowrap;
  box-shadow:0 18px 40px -20px rgba(0,0,0,.5); }
.lockchip svg { width:32px; height:32px; color:var(--primary); }
"""
    body = head("El Revelado", '¿Qué pasó en tu boda?<br><span class="red">Lo sabrás mañana.</span>',
                "Tus invitados lo capturan todo, pero nadie ve nada<br>hasta el día siguiente. <strong>Ahí empieza la magia.</strong>", "sm")
    body += cta(label="Ver más")
    body += f"""<div class="stack">
  <div class="polaroid" style="transform:translateX(-50%) translateX(-250px) rotate(-9deg);top:40px"><div class="ph"><img src="{I}s03.jpg"></div></div>
  <div class="polaroid" style="transform:translateX(-50%) translateX(250px) rotate(8deg);top:30px"><div class="ph"><img src="{I}s09.jpg"></div></div>
  <div class="polaroid" style="transform:translateX(-50%);top:0"><div class="ph"><img src="{I}s02.jpg">
    <div class="lockchip">{IC_LOCK}Se revela mañana · 12:00</div></div><div class="cap">Boda de Ana &amp; Luis · 26.09</div></div>
</div>"""
    write("02-revelado-manana", "revelado-manana", page("Revelao · Lo sabrás mañana", body, css))


# ====================================================================== 03
def p03():
    css = """
.qrphoto { position:absolute; left:70px; top:1050px; width:520px; height:700px; transform:rotate(-5deg); }
.qrphoto img { width:100%; height:100%; object-fit:cover; }
"""
    body = head("Sin descargar nada", 'Escanean el QR.<br><span class="red">Y listo.</span>',
                "Fotos, vídeos y audios desde cualquier móvil.<br><strong>Sin apps, sin registros, sin líos.</strong>")
    body += cta(label="Pruébalo gratis")
    body += f'<div class="photo qrphoto"><img src="{I}Plantilla1.png"></div>'
    body += phone(app_upload(), "position:absolute;right:70px;top:1000px;transform:rotate(4deg) scale(.86);transform-origin:top right")
    write("03-qr-sin-app", "qr-sin-app", page("Revelao · Escanean y listo", body, css))


# ====================================================================== 04
def p04():
    css = """
.vs { position:absolute; top:1000px; left:48px; right:48px; display:flex; gap:28px; }
.vs .card { flex:1; height:880px; position:relative; overflow:visible; }
.chat, .gal { border-radius:28px; overflow:hidden; }
.tag { position:absolute; top:-26px; left:50%; transform:translateX(-50%); display:inline-flex; align-items:center; gap:10px; white-space:nowrap;
  padding:12px 24px; border-radius:9999px; font-size:26px; font-weight:700; color:#fff; z-index:3; box-shadow:0 12px 24px -12px rgba(0,0,0,.5); }
.tag svg { width:26px; height:26px; }
.tag.bad { background:#1c1c1c; } .tag.good { background:var(--primary); }
.chat { background:#f3efe9; height:100%; padding:56px 20px 20px; display:flex; flex-direction:column; gap:14px; }
.chat .hdr { font-size:22px; font-weight:700; color:#555; text-align:center; margin-bottom:6px; }
.bub { background:#fff; border-radius:22px 22px 22px 6px; padding:14px 18px; font-size:23px; line-height:1.3; max-width:92%; box-shadow:0 1px 2px rgba(0,0,0,.08); }
.bub b { display:block; font-size:19px; color:var(--primary); margin-bottom:4px; }
.bub.me { align-self:flex-end; background:#e4e4e4; border-radius:22px 22px 6px 22px; }
.bub .blur { width:220px; height:140px; border-radius:12px; overflow:hidden; margin-top:6px; }
.bub .blur img { width:100%; height:100%; object-fit:cover; filter:blur(5px); transform:scale(1.1); }
.bub small { display:block; font-size:18px; color:#888; margin-top:6px; }
.gal { padding:56px 14px 14px; height:100%; display:flex; flex-direction:column; }
.gal .hdr { font-family:"Pinyon Script",cursive; font-size:52px; text-align:center; }
.gal .st { font-size:21px; font-weight:600; color:#555; text-align:center; margin:6px 0 14px; }
.gal .g { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.gal .g div { aspect-ratio:1; border-radius:10px; overflow:hidden; } .gal .g img { width:100%; height:100%; object-fit:cover; }
"""
    body = head("Adiós al caos", 'Tu grupo de la boda<br><span class="red">vs. Revelao</span>',
                "Deja de perseguir fotos durante semanas.<br><strong>Todas juntas, al día siguiente.</strong>", "md")
    body += cta(label="Ver más")
    photos = ["s04.jpg", "s05.jpg", "s08.jpg", "s11.jpg", "s14.jpg", "s15.jpg", "s06.jpg", "s16.jpg", "s18.jpg", "s03.jpg", "s12.jpg", "s07.jpg", "s17.jpg", "s10.jpg", "s01.jpg"]
    cells = "".join(f'<div><img src="{I}{p}"></div>' for p in photos)
    body += f"""<div class="vs">
  <div class="card"><span class="tag bad">{IC_X}Tu grupo de la boda</span>
    <div class="chat"><div class="hdr">Boda Ana &amp; Luis 💍 · 148 participantes</div>
      <div class="bub"><b>Tía Carmen</b>¿Alguien tiene la foto del baile? 🙏</div>
      <div class="bub"><b>Javi</b>Pasadme las del cóctel porfa</div>
      <div class="bub"><b>Lucía</b><div class="blur"><img src="{I}s09.jpg"></div><small>IMG_4829.jpg · 38 KB</small></div>
      <div class="bub me">Se me han comprimido todas 😩</div>
      <div class="bub"><b>Primo Dani</b>¿Quién tenía la del brindis??</div>
    </div></div>
  <div class="card"><span class="tag good">{CHECK}Revelao</span>
    <div class="gal"><div class="hdr">Ana &amp; Luis</div><div class="st">847 fotos · 112 vídeos · 64 audios</div><div class="g">{cells}</div></div></div>
</div>"""
    write("04-grupo-vs-revelao", "grupo-vs-revelao", page("Revelao · Grupo vs Revelao", body, css))


# ====================================================================== 05
def p05():
    css = """
.quote { margin:44px auto 0; max-width:940px; font-size:64px; line-height:1.14; font-weight:700; letter-spacing:-.025em; }
.quote .q { color:var(--primary); }
.author { margin-top:30px; font-size:32px; font-weight:600; color:var(--muted); }
.stars { color:#f5b301; letter-spacing:4px; }
.trio { position:absolute; left:0; right:0; top:1010px; }
.trio .photo { position:absolute; left:50%; }
"""
    body = f"""<header class="head">
  <img class="logo" src="{I}logo.png" alt="Revelao.cam">
  <div class="pill"><span class="stars">★★★★★</span>Boda de Laura y Carlos</div>
  <p class="quote"><span class="q">“</span>Al día siguiente todos estábamos <span class="red">pegados al móvil</span> esperando el revelado.<span class="q">”</span></p>
  <p class="author">Laura M. · se casó con Revelao</p>
</header>"""
    body += cta(checks=("Fotos", "Vídeos", "Mensajes de voz"), label="Ver más")
    body += f"""<div class="trio">
  <div class="photo" style="width:400px;height:560px;transform:translateX(-50%) translateX(-300px) rotate(-7deg);top:60px"><img class="ph" src="{I}s16.jpg"></div>
  <div class="photo" style="width:400px;height:560px;transform:translateX(-50%) translateX(300px) rotate(7deg);top:60px"><img class="ph" src="{I}s05.jpg"></div>
  <div class="photo" style="width:480px;height:660px;transform:translateX(-50%);top:0"><img class="ph" src="{I}s10.jpg"></div>
</div>"""
    write("05-testimonio", "testimonio", page("Revelao · Testimonio", body, css))


# ====================================================================== 06
def p06():
    css = """
.clock { display:flex; justify-content:center; align-items:flex-start; gap:18px; margin-top:44px; }
.clock .u { text-align:center; }
.clock .d { width:228px; height:200px; border-radius:36px; background:var(--ink); color:#fff; font-size:140px; font-weight:700;
  display:grid; place-items:center; letter-spacing:-.04em; font-variant-numeric:tabular-nums; box-shadow:0 26px 50px -26px rgba(0,0,0,.6); }
.clock .d.r { background:var(--primary); }
.clock .l { margin-top:14px; font-size:26px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.1em; }
.clock .sep { font-size:110px; font-weight:700; line-height:200px; color:#ccc; }
.h2 { margin-top:40px; font-size:60px; line-height:1.08; font-weight:700; letter-spacing:-.03em; }
.blurgrid img { filter: blur(20px) saturate(1.15); transform:scale(1.2); }
.lock { position:absolute; left:50%; top:1330px; transform:translateX(-50%); z-index:4; display:flex; align-items:center; gap:16px;
  background:#fff; border-radius:9999px; padding:22px 36px; font-size:32px; font-weight:700; white-space:nowrap; box-shadow:0 24px 50px -20px rgba(0,0,0,.5); }
.lock svg { width:38px; height:38px; color:var(--primary); }
"""
    body = f"""<header class="head">
  <img class="logo" src="{I}logo.png" alt="Revelao.cam">
  <div class="clock">
    <div class="u"><div class="d">12</div><div class="l">horas</div></div><div class="sep">:</div>
    <div class="u"><div class="d">47</div><div class="l">min</div></div><div class="sep">:</div>
    <div class="u"><div class="d r">09</div><div class="l">seg</div></div>
  </div>
  <p class="h2">para ver todas las fotos<br><span class="red">de tu boda</span></p>
</header>"""
    body += cta(checks=("Todo oculto", "Se revela a la vez", "Pura emoción"), label="Pruébalo gratis")
    rows = [(330, -70, [("s03.jpg", .72), ("s02.jpg", .62), ("s09.jpg", .82), ("s04.jpg", .66), ("s05.jpg", .76)]),
            (320, -190, [("s12.jpg", .64), ("s07.jpg", .8), ("s08.jpg", .7), ("s16.jpg", .6), ("s10.jpg", .78)]),
            (330, -20, [("s13.jpg", .78), ("s14.jpg", .66), ("s15.jpg", .62), ("s18.jpg", .84), ("s17.jpg", .7)])]
    body += mosaic(rows, 980).replace('class="grid fade"', 'class="grid fade blurgrid"')
    body += f'<div class="lock">{IC_LOCK}Se revela mañana a las 12:00</div>'
    write("06-cuenta-atras", "cuenta-atras", page("Revelao · Cuenta atrás", body, css))


# ====================================================================== 07
def p07():
    css = """
.plans { position:absolute; left:64px; right:64px; top:600px; display:flex; flex-direction:column; gap:22px; }
.plan { display:flex; align-items:center; justify-content:space-between; padding:34px 44px; border-radius:32px; background:#fff;
  border:2px solid var(--border); box-shadow:0 20px 50px -36px rgba(0,0,0,.4); position:relative; }
.plan .t { font-size:44px; font-weight:700; letter-spacing:-.02em; }
.plan .s { font-size:26px; color:var(--muted); margin-top:6px; }
.plan .p { font-size:84px; font-weight:700; letter-spacing:-.04em; }
.plan .p small { font-size:26px; font-weight:500; color:var(--muted); letter-spacing:0; }
.plan.feat { border:4px solid var(--primary); transform:scale(1.03); }
.plan .badge { position:absolute; top:-22px; left:44px; background:var(--primary); color:#fff; font-size:22px; font-weight:700; padding:8px 20px; border-radius:9999px; }
.plan.free .p { color:var(--primary); }
"""
    body = head("Precios claros", 'Tu galería de boda<br><span class="red">desde 0€</span>', "", "md")
    plans = [("Demo", "10 fotos · 3 vídeos · 6 audios", "0€", "free"),
             ("Start", "200 fotos · 30 vídeos · 60 audios", "39€", ""),
             ("Plus", "5.000 fotos · 200 vídeos · 500 audios", "79€", "feat"),
             ("Pro", "Fotos, vídeos y audios ilimitados", "149€", "")]
    items = ""
    for t, s, p, cls in plans:
        badge = '<span class="badge">Más popular</span>' if cls == "feat" else ""
        per = "" if cls == "free" else "<small> /evento</small>"
        items += f'<div class="plan {cls}">{badge}<div><div class="t">{t}</div><div class="s">{s}</div></div><div class="p">{p}{per}</div></div>'
    body += f'<div class="plans">{items}</div>'
    body += cta(top=1390, checks=("Pago único", "Sin suscripción", "Sin tarjeta para probar"), label="Ver planes")
    body += mosaic([(300, -60, [("s03.jpg", .72), ("s01.jpg", .62), ("s02.jpg", .82), ("s04.jpg", .66), ("s05.jpg", .76)])], 1680)
    write("07-precios", "precios", page("Revelao · Precios", body, css))


# ====================================================================== 08
def p08():
    css = """
.fan { position:absolute; left:0; right:0; top:1010px; }
.fan .photo { position:absolute; left:50%; width:470px; height:620px; }
"""
    body = head("Plantillas QR", 'Pon esto<br><span class="red">en cada mesa</span>',
                "Elige un diseño y ponle vuestros nombres.<br><strong>Descárgalo o te lo imprimimos.</strong>")
    body += cta(checks=("Personalizable", "Listo para imprimir", "Envío a casa"), label="Ver plantillas")
    body += f"""<div class="fan">
  <div class="photo" style="transform:translateX(-50%) translateX(-290px) rotate(-8deg);top:70px"><img class="ph" src="{I}Plantilla2.png"></div>
  <div class="photo" style="transform:translateX(-50%) translateX(290px) rotate(8deg);top:70px"><img class="ph" src="{I}Plantilla3.png"></div>
  <div class="photo" style="transform:translateX(-50%);top:0;width:520px;height:690px"><img class="ph" src="{I}Plantilla1.png"></div>
</div>"""
    write("08-plantillas-qr", "plantillas-qr", page("Revelao · Plantillas QR", body, css))


# ====================================================================== 09 carrusel
def p09():
    F, N = "09-carrusel-como-funciona", 6
    css = """
.c { position:absolute; left:72px; right:72px; top:270px; }
.c h1 { margin-top:36px; }
.c .sub { margin:26px 0 0; max-width:none; }
.shot { position:absolute; left:-50px; right:-50px; top:720px; }
.shot img { width:100%; }
"""
    cover = topbar(1, N) + f"""<div class="c" style="text-align:center"><div class="kicker">Guía rápida</div>
<h1 class="md">Cómo funciona<br><span class="red">Revelao</span></h1>
<p class="sub" style="margin:26px auto 0">De crear tu evento a revelar todos los<br>recuerdos, <strong>en 4 pasos.</strong></p></div>
<div class="shot" style="top:700px;left:40px;right:40px"><img src="{I}how-step-reveal-new.png"></div>""" + swipe("Desliza para verlo", 1640)
    write(F, "1-portada", page("Cómo funciona 1", cover, css))
    steps = [
        ("Creas tu evento", "Ponle nombre, foto y fecha. En pocos minutos<br>tendrás tu <strong>QR exclusivo</strong> listo.", "how-step-create-new.png"),
        ("Compartes el QR", "Envíalo por mensaje o ponlo en mesas, carteles<br>y pantallas con <strong>nuestras plantillas.</strong>", "how-step-share-new.png"),
        ("Tus invitados lo capturan", "Lo escanean y suben fotos, vídeos y audios.<br><strong>Sin apps ni registros.</strong>", "how-step-upload-new.png"),
        ("Llega el Revelado", "Durante el evento todo queda oculto. Al día<br>siguiente <strong>se revela para todos a la vez.</strong>", "how-step-reveal-new.png"),
    ]
    for k, (t, d, img) in enumerate(steps, 1):
        b = topbar(k + 1, N) + f"""<div class="c"><div class="step-num">{k}</div>
<h1 class="sm">{t}</h1><p class="sub">{d}</p></div>
<div class="shot"><img src="{I}{img}"></div>"""
        write(F, f"{k+1}-paso-{k}", page(f"Cómo funciona {k+1}", b, css))
    write(F, "6-cierre", close_slide(6, N, 'Tu boda, contada<br><span class="red">por tus invitados</span>',
                                     "Crea tu evento en minutos.<br><strong>Y pruébalo gratis.</strong>", label="Prueba gratis"))


# ====================================================================== 10 carrusel
def p10():
    F, N = "10-carrusel-5-fotos", 7
    css = """
.c { position:absolute; left:72px; right:72px; top:270px; }
.big { font-size:150px; font-weight:800; color:var(--primary); letter-spacing:-.05em; line-height:.9; }
.pol { position:absolute; left:50%; top:700px; width:820px; transform:translateX(-50%) rotate(var(--r)); }
.pol .ph { width:776px; height:800px; }
.pol .cap { position:absolute; left:0; right:0; bottom:26px; text-align:center; font-size:28px; font-weight:600; color:#777; }
.pile { position:absolute; left:0; right:0; top:900px; }
.pile .polaroid { position:absolute; left:50%; width:480px; }
.pile .ph { width:436px; height:500px; overflow:hidden; } .pile img { filter:blur(18px); transform:scale(1.2); }
.q { font-size:170px; font-weight:800; color:var(--primary); position:absolute; left:50%; top:1100px; transform:translateX(-50%); z-index:5; text-shadow:0 10px 30px rgba(0,0,0,.25); }
"""
    pile = "".join(
        f'<div class="polaroid" style="transform:translateX(-50%) translateX({x}px) rotate({r}deg);top:{t}px"><div class="ph"><img class="ph" src="{I}{p}"></div></div>'
        for x, r, t, p in [(-230, -12, 60, "s09.jpg"), (230, 10, 50, "s15.jpg"), (-90, -4, 20, "s05.jpg"), (100, 5, 0, "s03.jpg")])
    cover = topbar(1, N) + f"""<div class="c" style="text-align:center"><div class="kicker">Lo que tu fotógrafo no verá</div>
<h1 class="md" style="margin-top:36px">5 fotos que nunca<br>tendrás de tu boda</h1>
<p class="sub" style="margin:28px auto 0;font-size:44px;color:var(--primary);font-weight:700">(salvo que uses Revelao)</p></div>
<div class="pile">{pile}</div><div class="q">?</div>""" + swipe("Desliza", 1660)
    write(F, "1-portada", page("5 fotos 1", cover, css))
    shots = [("Tu abuelo dándolo<br>todo en la pista", "grandpa_red.jpg", "01:47", -2),
             ("La pista a las<br>3 de la mañana", "hands_up.jpg", "03:04", 2),
             ("El selfie<br>del baño", "mirror_selfie.jpg", "23:58", -2),
             ("El brindis improvisado<br>de tus amigos", "s07.jpg", "22:31", 2),
             ("Tú, a hombros, sin saber<br>que te grababan", "s02.jpg", "02:16", -2)]
    for k, (t, img, hr, r) in enumerate(shots, 1):
        b = topbar(k + 1, N) + f"""<div class="c"><div class="big">0{k}</div><h1 class="sm" style="margin-top:22px">{t}</h1></div>
<div class="polaroid pol" style="--r:{r}deg"><img class="ph" src="{I}{img}"><div class="cap">📸 Subida por un invitado · {hr}</div></div>"""
        write(F, f"{k+1}-foto-{k}", page(f"5 fotos {k+1}", b, css))
    write(F, "7-cierre", close_slide(7, N, '1 fotógrafo.<br><span class="red">150 invitados.</span>',
                                     "Recoge cada momento desde cada móvil.<br><strong>Y descúbrelo todo al día siguiente.</strong>", label="Pruébalo gratis"))


# ====================================================================== 11 carrusel
def p11():
    F, N = "11-carrusel-mensajes-voz", 5
    css = """
.c { position:absolute; left:72px; right:72px; top:270px; }
.pic { position:absolute; left:60px; right:60px; top:620px; height:820px; }
.pic .au { position:absolute; left:40px; right:40px; bottom:-60px; }
.stackau { position:absolute; left:90px; right:90px; top:930px; display:flex; flex-direction:column; gap:30px; }
.stackau .audio:nth-child(2) { margin-left:80px; } .stackau .audio:nth-child(3) { margin-right:80px; }
.tagline { font-size:26px; font-weight:600; color:var(--muted); margin:0 0 -14px 20px; }
"""
    cover = topbar(1, N) + f"""<div class="c" style="text-align:center"><div class="kicker">Mensajes de voz</div>
<h1 class="md" style="margin-top:36px">Lo que nadie te<br>cuenta de los <span class="red">audios</span></h1>
<p class="sub" style="margin:28px auto 0">Además de fotos y vídeos, tus invitados<br>pueden dejarte <strong>mensajes de voz anónimos.</strong></p></div>
<div class="stackau"><div class="tagline">🔊 Audio anónimo</div>{audio("0:24", 3, .45)}{audio("0:41", 5, .2)}{audio("0:18", 9, .7)}</div>""" + swipe("Desliza", 1560)
    write(F, "1-portada", page("Audios 1", cover, css))
    items = [("Tu abuela diciéndote<br><span class=\"red\">lo guapa que ibas.</span>", "granny_phone.jpg", "0:24", 11),
             ("Tus amigos a las 4am<br><span class=\"red\">cantando fatal.</span>", "hands_up2.jpg", "0:41", 12),
             ("Lo que nadie se atrevió<br><span class=\"red\">a decir en el micro.</span>", "man_phone.jpg", "0:18", 13)]
    for k, (t, img, dur, seed) in enumerate(items, 2):
        b = topbar(k, N) + f"""<div class="c"><div class="kicker">Audio anónimo</div><h1 class="sm" style="margin-top:26px">{t}</h1></div>
<div class="photo pic"><img class="ph" src="{I}{img}"></div>
<div style="position:absolute;left:100px;right:100px;top:1380px;z-index:4">{audio(dur, seed, .4)}</div>"""
        write(F, f"{k}-audio-{k-1}", page(f"Audios {k}", b, css))
    write(F, "5-cierre", close_slide(5, N, 'Fotos, vídeos y audios.<br><span class="red">Y todo a la vez.</span>',
                                     "Tus invitados graban, hablan y capturan.<br><strong>Tú lo descubres al día siguiente.</strong>", label="Pruébalo gratis"))


# ====================================================================== 12 carrusel
def p12():
    F, N = "12-carrusel-no-solo-bodas", 7
    css = """
.c { position:absolute; left:72px; right:72px; top:270px; }
.pic { position:absolute; left:60px; right:60px; top:560px; height:900px; }
.quote { position:absolute; left:100px; right:100px; top:1360px; padding:40px 44px; z-index:4; }
.quote p { font-size:32px; line-height:1.4; font-weight:500; }
.quote p::before { content:"“"; color:var(--primary); font-weight:800; font-size:60px; line-height:0; vertical-align:-18px; margin-right:6px; }
.quote .a { margin-top:18px; font-size:26px; font-weight:700; color:var(--muted); }
.stars { color:#f5b301; letter-spacing:3px; margin-right:10px; }
.chips { position:absolute; left:60px; right:60px; top:760px; display:grid; grid-template-columns:1fr 1fr; gap:26px; }
.chip { position:relative; height:300px; }
.chip span { position:absolute; left:18px; bottom:18px; background:#fff; border-radius:9999px; padding:10px 22px; font-size:28px; font-weight:700; }
"""
    events = [("Bodas", "s13.jpg", "En nuestra boda los invitados se engancharon al momento del revelado. Fue emocionante verlo todo aparecer a la vez.", "Claudia T. · Boda"),
              ("Cumpleaños", "birthday.jpg", "No saber qué había capturado cada uno hizo la espera insoportable (en el buen sentido).", "Diego R. · Cumpleaños de 30"),
              ("Eventos de empresa", "dinner_toast.jpg", "El nivel de participación con fotos, vídeos y mensajes de voz fue increíble. Todo el equipo involucrado.", "Ana S. · HR Manager"),
              ("Fiestas de pueblo", "street_night.jpg", "Todo el mundo escaneó el QR y subió fotos sin parar. Al día siguiente fue un espectáculo verlo todo junto.", "María G. · Fiesta de pueblo"),
              ("Aniversarios", "anniv_couple.jpg", "Una forma única de capturar momentos especiales. Nuestros invitados no pararon en toda la celebración.", "Roberto P. · 25 aniversario")]
    chips = "".join(f'<div class="photo chip"><img class="ph" src="{I}{p}"><span>{t}</span></div>' for t, p, _, _ in events[1:])
    cover = topbar(1, N) + f"""<div class="c" style="text-align:center"><div class="kicker">Para cualquier celebración</div>
<h1 class="md" style="margin-top:36px">Revelao no es<br><span class="red">solo para bodas</span></h1></div>
<div class="chips">{chips}</div>""" + swipe("Desliza", 1470)
    write(F, "1-portada", page("No solo bodas 1", cover, css))
    for k, (t, img, q, a) in enumerate(events, 2):
        b = topbar(k, N) + f"""<div class="c"><div class="kicker">Revelao para</div><h1 class="md" style="margin-top:22px">{t}</h1></div>
<div class="photo pic"><img class="ph" src="{I}{img}"></div>
<div class="card quote"><p>{q}</p><div class="a"><span class="stars">★★★★★</span>{a}</div></div>"""
        write(F, f"{k}-{t.lower().replace(' ', '-')}", page(f"No solo bodas {k}", b, css))
    write(F, "7-cierre", close_slide(7, N, 'Si hay invitados,<br><span class="red">hay Revelao</span>',
                                     "Bodas, cumpleaños, empresas, fiestas…<br><strong>Crea tu evento en minutos.</strong>", label="Crear mi evento"))


# ====================================================================== 13 carrusel
def p13():
    F, N = "13-carrusel-universo-revelao", 6
    css = """
.c { position:absolute; left:72px; right:72px; top:270px; }
.c .sub { margin:26px 0 0; max-width:none; }
.stage { position:absolute; left:60px; right:60px; top:760px; height:760px; border-radius:36px; overflow:hidden;
  background:#d8cbb3; display:grid; place-items:center; }
.stage::before { content:""; position:absolute; inset:0; background:radial-gradient(#241c18 1.4px,transparent 1.4px); background-size:12px 12px; opacity:.18; }
.stage > * { position:relative; }
.strip { width:230px; background:#fffdf6; padding:14px 14px 0; border:1px solid rgba(0,0,0,.15); box-shadow:10px 12px 0 rgba(36,28,24,.25); }
.strip div { aspect-ratio:4/3; overflow:hidden; margin-bottom:10px; } .strip img { width:100%; height:100%; object-fit:cover; }
.strip p { font-family:ui-monospace,Menlo,monospace; font-size:15px; font-weight:900; text-align:center; letter-spacing:.06em; padding:6px 0 16px; }
.env { width:640px; height:500px; border-radius:24px; overflow:hidden; position:relative; box-shadow:0 30px 60px -30px rgba(0,0,0,.6); }
.env img { width:100%; height:100%; object-fit:cover; filter:saturate(.9); }
.env .seal { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); background:#fff; border-radius:28px; padding:30px 40px; text-align:center; }
.env .seal svg { width:52px; height:52px; color:var(--primary); }
.env .seal b { display:block; font-size:30px; margin-top:10px; } .env .seal span { font-size:24px; color:var(--muted); }
.quad { position:absolute; left:60px; right:60px; top:720px; display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.quad .card { height:330px; position:relative; }
.quad .card img { width:100%; height:100%; object-fit:cover; }
.quad .card span { position:absolute; left:18px; bottom:18px; background:#fff; border-radius:9999px; padding:10px 22px; font-size:28px; font-weight:700; box-shadow:0 6px 16px -6px rgba(0,0,0,.3); }
"""
    strip = lambda ps, rot: f'<div class="strip" style="transform:rotate({rot}deg)">' + "".join(f'<div><img src="{I}{p}"></div>' for p in ps) + "<p>PHOTOSTRIP · REVELAO</p></div>"
    strips = f'<div style="display:flex;gap:50px;align-items:center">{strip(["s08.jpg","s15.jpg","s16.jpg","bride_friends.jpg"], -5)}{strip(["s11.jpg","friends_toast.jpg","s06.jpg","bach.jpg"], 4)}</div>'
    env = f'<div class="env"><img src="{I}s12.jpg"><div class="seal">{IC_LOCK}<b>Se abre el 26/09/2031</b><span>32 vídeos de vuestros invitados</span></div></div>'
    quad = (f'<div class="card"><img src="{I}how-step-reveal-new.png" style="object-fit:contain;background:#f6f6f6"><span>Revelao</span></div>'
            f'<div class="card"><img src="{I}capitanes-paso-ranking-v2.png" style="object-position:50% 48%"><span>Capitanes</span></div>'
            f'<div class="card"><img src="{I}s12.jpg"><span>Cápsula del tiempo</span></div>'
            f'<div class="card" style="background:#d8cbb3;display:grid;place-items:center"><div style="transform:scale(.55)">{strip(["s08.jpg","s15.jpg","s16.jpg","bride_friends.jpg"], -4)}</div><span>Photostrip</span></div>')
    cover = topbar(1, N) + f"""<div class="c" style="text-align:center"><div class="kicker">Universo Revelao</div>
<h1 class="md" style="margin-top:36px">Mucho más que<br><span class="red">una galería</span></h1>
<p class="sub" style="margin:26px auto 0">4 experiencias para que tu boda<br>sea <strong>todavía más especial.</strong></p></div>
<div class="quad">{quad}</div>""" + swipe("Desliza", 1470)
    write(F, "1-portada", page("Universo 1", cover, css))
    prods = [("Galería con QR", "Revelao", "Tus invitados suben fotos, vídeos y audios.<br><strong>Al día siguiente, se revela todo.</strong>",
              f'<img src="{I}how-step-reveal-new.png" style="width:100%">', "background:#f6f6f6"),
             ("Juego para mesas", "Capitanes", "Retos, pruebas y un ranking en directo para que<br><strong>cada mesa compita y participe.</strong>",
              '<div style="display:flex;align-items:center;justify-content:center">'
              f'<img src="{I}capitanes-paso-retos.png" style="width:330px;border-radius:36px;box-shadow:0 30px 60px -30px rgba(0,0,0,.45);transform:rotate(-7deg) translateX(80px)">'
              f'<img src="{I}capitanes-paso-ranking-v2.png" style="width:400px;border-radius:42px;box-shadow:0 40px 70px -30px rgba(0,0,0,.5);position:relative;z-index:2">'
              f'<img src="{I}capitanes-paso-capitan.png" style="width:330px;border-radius:36px;box-shadow:0 30px 60px -30px rgba(0,0,0,.45);transform:rotate(7deg) translateX(-80px)">'
              '</div>', "background:#fff5f4"),
             ("Recuerdos a futuro", "Cápsula del tiempo", "Tus invitados graban vídeos en la boda y<br><strong>los descubrís juntos años después.</strong>", env, ""),
             ("Fotomatón digital", "Photostrip", "Cada invitado crea su tira de 4 fotos desde el<br>móvil y <strong>la comparte en el mural de la boda.</strong>", strips, "")]
    for k, (kick, t, d, vis, st) in enumerate(prods, 2):
        extra = "" if not st else f' style="{st}"'
        cls = "stage" + (" plain" if st else "")
        vis_html = f'<div class="{cls}"{extra}>{vis}</div>'
        if st:
            vis_html = vis_html.replace('class="stage plain"', 'class="stage" data-plain')
        b = topbar(k, N) + f"""<div class="c"><div class="kicker">{kick}</div><h1 class="md" style="margin-top:22px">{t}</h1><p class="sub">{d}</p></div>{vis_html}"""
        css_k = css + ('.stage[data-plain]::before{display:none}' if st else "")
        write(F, f"{k}-{t.lower().replace(' ', '-').replace('á','a')}", page(f"Universo {k}", b, css_k))
    write(F, "6-cierre", close_slide(6, N, 'Tu boda,<br><span class="red">a otro nivel</span>',
                                     "Descubre todas las experiencias<br>en <strong>revelao.cam</strong>", "Universo Revelao", label="Ver más"))


# ====================================================================== 14 carrusel
def p14():
    F, N = "14-carrusel-faq", 6
    css = """
.c { position:absolute; left:72px; right:72px; top:270px; }
.qchip { display:inline-grid; place-items:center; width:84px; height:84px; border-radius:24px; background:var(--ink); color:#fff; font-size:44px; font-weight:800; }
.ans { margin-top:34px; font-size:100px; font-weight:800; color:var(--primary); letter-spacing:-.04em; line-height:1; }
.expl { margin-top:22px; font-size:36px; line-height:1.38; color:var(--muted); } .expl strong { color:var(--ink); font-weight:600; }
.qs { position:absolute; left:80px; right:80px; top:760px; display:flex; flex-direction:column; gap:26px; }
.qs .card { padding:30px 36px; font-size:34px; font-weight:700; display:flex; align-items:center; gap:22px; }
.qs .card i { font-style:normal; width:56px; height:56px; flex:0 0 auto; border-radius:16px; background:var(--primary-soft); color:var(--primary); display:grid; place-items:center; font-size:30px; }
.vis { position:absolute; left:0; right:0; top:930px; display:flex; justify-content:center; }
.blurg { width:920px; height:720px; position:relative; }
.blurg .app-grid img { filter:blur(14px); transform:scale(1.2); }
.blurg .lk { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); background:#fff; border-radius:9999px; padding:22px 36px; display:flex; gap:14px; align-items:center; font-size:30px; font-weight:700; white-space:nowrap; box-shadow:0 20px 40px -20px rgba(0,0,0,.5); }
.blurg .lk svg { width:36px; height:36px; color:var(--primary); }
.prices { display:flex; gap:26px; } .prices .card { width:300px; padding:70px 20px; text-align:center; }
.prices b { display:block; font-size:110px; letter-spacing:-.04em; } .prices span { font-size:34px; color:var(--muted); font-weight:600; }
"""
    qs = [("¿Mis invitados tienen que descargar una app?", "No.", "Escanean el QR y suben sus fotos desde<br>el navegador del móvil. <strong>Nada más.</strong>",
           phone(app_upload(), "transform:scale(.8);transform-origin:top center")),
          ("¿Quién puede ver las fotos?", "Solo tus invitados.", "La galería es privada: <strong>solo entra quien<br>tiene tu QR.</strong>",
           f'<div class="card blurg"><div class="app-grid">' + "".join(f'<div><img src="{I}s{n:02d}.jpg"></div>' for n in range(1, 13)) + f'</div><div class="lk">{IC_LOCK}Galería privada</div></div>'),
          ("¿Cuándo se ven las fotos?", "Al día siguiente.", "Durante el evento todo queda oculto.<br>Luego <strong>se revela para todos a la vez.</strong>",
           f'<div class="card" style="width:920px;padding:70px 40px;text-align:center"><div style="font-size:34px;color:var(--muted);font-weight:600">Las fotos se revelarán</div><div style="font-size:100px;font-weight:800;margin-top:14px;letter-spacing:-.03em">Mañana · 12:00</div><div style="margin-top:30px;font-size:36px;font-weight:600">Quedan 12 horas y 59 minutos.<br>¡Qué nervios! 🤞</div></div>'),
          ("¿Cuánto cuesta?", "Pruébalo gratis.", "Y cuando lo tengas claro, <strong>planes desde<br>39€ por evento.</strong> Pago único.",
           '<div class="prices"><div class="card"><b class="red">0€</b><span>Demo</span></div><div class="card"><b>39€</b><span>Start</span></div><div class="card" style="border:4px solid var(--primary)"><b>79€</b><span>Plus</span></div></div>')]
    items = "".join(f'<div class="card"><i>?</i>{q}</div>' for q, _, _, _ in qs)
    cover = topbar(1, N) + f"""<div class="c" style="text-align:center"><div class="kicker">Preguntas frecuentes</div>
<h1 class="md" style="margin-top:36px">Resolvemos<br><span class="red">tus dudas</span></h1></div>
<div class="qs">{items}</div>""" + swipe("Guárdalo y desliza", 1470)
    write(F, "1-portada", page("FAQ 1", cover, css))
    for k, (q, a, e, vis) in enumerate(qs, 2):
        b = topbar(k, N) + f"""<div class="c"><span class="qchip">?</span><h1 class="sm" style="margin-top:30px">{q}</h1>
<div class="ans">{a}</div><p class="expl">{e}</p></div><div class="vis">{vis}</div>"""
        write(F, f"{k}-pregunta-{k-1}", page(f"FAQ {k}", b, css))
    write(F, "6-cierre", close_slide(6, N, '¿Más dudas?<br><span class="red">Pruébalo gratis</span>',
                                     "Crea un evento de prueba en 30 segundos.<br><strong>Sin registro y sin tarjeta.</strong>", "Sin compromiso", label="Prueba gratis"))


# ====================================================================== 15
def p15():
    css = """
.conf { position:absolute; width:22px; height:22px; border-radius:5px; z-index:1; }
"""
    body = head("POV", 'Es el día después<br>de tu boda y<br><span class="red">abres esto</span>', "", "md")
    body += cta(checks=("Fotos", "Vídeos", "Audios"), label="Ver más")
    photos = ["s02.jpg", "s10.jpg", "s05.jpg", "s03.jpg", "s14.jpg", "s08.jpg", "s15.jpg", "s04.jpg", "s11.jpg", "s18.jpg", "s06.jpg", "s16.jpg"]
    body += phone(app_gallery(photos), "position:absolute;left:50%;top:1000px;transform:translateX(-50%) scale(1.05);transform-origin:top center;z-index:2")
    rnd = random.Random(4)
    cols = ["hsl(0 84% 60%)", "#f5b301", "#111", "#7cc4a4", "#ff9fb0"]
    for _ in range(26):
        x = rnd.choice([rnd.randint(40, 200), rnd.randint(880, 1040)])
        y = rnd.randint(1000, 1800)
        body += f'<span class="conf" style="left:{x}px;top:{y}px;background:{rnd.choice(cols)};transform:rotate({rnd.randint(0,90)}deg)"></span>'
    write("15-pov-galeria", "pov-galeria", page("Revelao · POV", body, css))


# ====================================================================== 16
def p16():
    css = """
.notis { position:absolute; left:70px; right:70px; top:1000px; display:flex; flex-direction:column; gap:20px; }
.noti { display:flex; gap:22px; align-items:center; background:rgba(245,245,245,.96); border-radius:34px; padding:24px 28px; box-shadow:0 14px 30px -24px rgba(0,0,0,.5); }
.noti i { width:74px; height:74px; border-radius:20px; background:#e3e3e3; display:grid; place-items:center; flex:0 0 auto; color:#555; }
.noti i svg { width:38px; height:38px; }
.noti .t { flex:1; } .noti b { font-size:27px; } .noti p { font-size:27px; color:#333; margin-top:4px; }
.noti small { font-size:22px; color:#888; align-self:flex-start; }
"""
    body = head("🚩 Red flag", 'Tu boda sin<br><span class="red">galería compartida</span>',
                "Y pasarte semanas preguntando:<br><strong>“¿alguien tiene la foto de…?”</strong>", "md", dot=False)
    body += cta(checks=("Un QR", "Todas las fotos", "Cero persecuciones"), label="Pruébalo gratis")
    notis = [("Mamá", "¿Te han pasado ya las fotos del baile?", "hace 3 d"),
             ("Tía Carmen", "Yo solo tengo 3 y salen movidas 😅", "hace 5 d"),
             ("Javi", "Las mías se borraron sin querer 🙃", "hace 1 sem"),
             ("Lucía", "¿Alguien grabó el discurso del padrino?", "hace 2 sem"),
             ("Primo Dani", "Pasadme todo por un drive porfa", "hace 3 sem")]
    items = "".join(f'<div class="noti"><i>{IC_CHAT}</i><div class="t"><b>{n}</b><p>{m}</p></div><small>{t}</small></div>' for n, m, t in notis)
    body += f'<div class="notis">{items}</div>'
    write("16-red-flag", "red-flag", page("Revelao · Red flag", body, css))


if __name__ == "__main__":
    for f in (p02, p03, p04, p05, p06, p07, p08, p09, p10, p11, p12, p13, p14, p15, p16):
        f()
    print("HTML generado")
