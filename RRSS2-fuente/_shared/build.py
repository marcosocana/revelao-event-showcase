"""Genera las 50 publicaciones de RRSS2 (25 imágenes sueltas + 25 carruseles).

Uso:  python3 RRSS2/_shared/build.py   (después:  sh RRSS2/render.sh)
Cada pieza se escribe en RRSS2/<nn-nombre>/src/ (sin botón) y src/con-botones/ (con botón).
Todos los textos están aquí: edita y vuelve a generar.
"""
import os, sys, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa: F401,F403  (page, head, cta, mosaic, phone, app_*, audio, write, iconos…)

IC_DL = SVG('<path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16"/>', 2.6)
def svgst(svg, st):
    return svg.replace("<svg", f"<svg style='{st}'", 1)


IC_STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z"/></svg>'

# ------------------------------------------------------------------ visuales reutilizables
PAT = [[.72, .62, .82, .66, .76, .7], [.64, .8, .7, .6, .78, .68], [.78, .66, .62, .84, .7, .64]]


def v_mosaic(photos, top=980, blur=False, h=330):
    k = 0
    rows = []
    for r, (off, pat) in enumerate(zip((-70, -190, -20), PAT)):
        tiles = []
        for ratio in pat[:5]:
            tiles.append((photos[k % len(photos)], ratio)); k += 1
        rows.append((h - 10 * (r % 2), off, tiles))
    html = mosaic(rows, top)
    return html.replace('class="grid fade"', 'class="grid fade blur"') if blur else html


def v_fan(a, b, c, top=1010, side=(400, 560), center=(480, 660), rot=7, spread=300):
    sw, sh = side
    cw, ch = center
    return f"""<div class="fan abs" style="left:0;right:0;top:{top}px">
  <div class="photo" style="width:{sw}px;height:{sh}px;transform:translateX(-50%) translateX(-{spread}px) rotate(-{rot}deg);top:60px"><img class="ph" src="{I}{a}"></div>
  <div class="photo" style="width:{sw}px;height:{sh}px;transform:translateX(-50%) translateX({spread}px) rotate({rot}deg);top:60px"><img class="ph" src="{I}{c}"></div>
  <div class="photo" style="width:{cw}px;height:{ch}px;transform:translateX(-50%);top:0"><img class="ph" src="{I}{b}"></div>
</div>"""


def v_polar(a, b, c, top=1010, blur=False, caption="", chip=""):
    bl = "filter:blur(22px) saturate(1.2);transform:scale(1.25);" if blur else ""
    def pol(p, st, extra=""):
        return (f'<div class="polaroid" style="width:520px;{st}"><div style="width:476px;height:560px;overflow:hidden;position:relative;border-radius:4px">'
                f'<img src="{I}{p}" style="width:100%;height:100%;object-fit:cover;{bl}">{extra}</div>'
                f'<div style="position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:26px;font-weight:600;color:#666">{caption}</div></div>')
    ch = f'<div class="lchip" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">{chip}</div>' if chip else ""
    return f"""<div class="fan abs" style="left:0;right:0;top:{top}px">
  {pol(a, "transform:translateX(-50%) translateX(-250px) rotate(-9deg);top:40px")}
  {pol(c, "transform:translateX(-50%) translateX(250px) rotate(8deg);top:30px")}
  {pol(b, "transform:translateX(-50%);top:0", ch)}
</div>"""


def v_phone(screen, top=1000, scale=1.0):
    return phone(screen, f"position:absolute;left:50%;top:{top}px;transform:translateX(-50%) scale({scale});transform-origin:top center;z-index:2")


def v_phone_photo(screen, photo, top=1000):
    return (f'<div class="photo abs" style="left:70px;top:{top+50}px;width:520px;height:700px;transform:rotate(-5deg)"><img class="ph" src="{I}{photo}"></div>'
            + phone(screen, f"position:absolute;right:70px;top:{top}px;transform:rotate(4deg) scale(.86);transform-origin:top right"))


def v_list(items, top=1000, left=80, right=80, gap=22):
    """items: (tipo 'ok'|'no'|'todo', texto, destacado)"""
    icons = {"ok": CHECK, "no": IC_X, "todo": ""}
    out = "".join(f'<div class="card item{" hl" if hl else ""}"><i class="{t}">{icons[t]}</i><div>{txt}</div></div>' for t, txt, hl in items)
    return f'<div class="abs" style="left:{left}px;right:{right}px;top:{top}px;display:flex;flex-direction:column;gap:{gap}px">{out}</div>'


def v_audio_photo(photo, dur, seed, top=1000, h=640):
    return (f'<div class="photo abs" style="left:60px;right:60px;top:{top}px;height:{h}px"><img class="ph" src="{I}{photo}"></div>'
            f'<div class="abs" style="left:100px;right:100px;top:{top+h-60}px;z-index:4">{audio(dur, seed, .4)}</div>')


def v_blurgrid(top=1000, label="Galería privada", photos=None):
    photos = photos or [f"s{n:02d}.jpg" for n in range(1, 13)]
    cells = "".join(f'<div><img src="{I}{p}"></div>' for p in photos)
    return (f'<div class="card abs" style="left:80px;right:80px;top:{top}px;height:720px"><div class="app-grid blur">{cells}</div>'
            f'<div class="lchip" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:32px;padding:22px 36px">{IC_LOCK}{label}</div></div>')


def strip(ps, rot=0, scale=1):
    return (f'<div class="strip" style="transform:rotate({rot}deg) scale({scale})">' + "".join(f'<div><img src="{I}{p}"></div>' for p in ps)
            + "<p>PHOTOSTRIP · REVELAO</p></div>")


def plan_card(t, s, p, feat=False, per=True):
    badge = '<span style="position:absolute;top:-22px;left:44px;background:var(--primary);color:#fff;font-size:22px;font-weight:700;padding:8px 20px;border-radius:9999px">Más popular</span>' if feat else ""
    border = "border:4px solid var(--primary);" if feat else "border:2px solid var(--border);"
    small = '<small style="font-size:26px;font-weight:500;color:var(--muted);letter-spacing:0"> /evento</small>' if per else ""
    return (f'<div style="position:relative;display:flex;align-items:center;justify-content:space-between;padding:34px 44px;border-radius:32px;background:#fff;{border}box-shadow:0 20px 50px -36px rgba(0,0,0,.4)">{badge}'
            f'<div><div style="font-size:44px;font-weight:700">{t}</div><div style="font-size:26px;color:var(--muted);margin-top:6px">{s}</div></div>'
            f'<div style="font-size:84px;font-weight:700;letter-spacing:-.04em">{p}{small}</div></div>')


# ------------------------------------------------------------------ plantillas de página
def single(folder, pill, h1, sub, visual, label, checks=("Sin app", "100% anónimo", "Sin registro"), h1cls="", css="", head_html=None, cta_top=780, dot=True):
    hd = head_html if head_html is not None else head(pill, h1, sub, h1cls, dot)
    write(folder, folder.split("-", 1)[1], page("Revelao", hd + cta(cta_top, checks, label) + visual, css))


def cover(kicker, h1, sub, visual, swipe_top=1600, swipe_text="Desliza", h1cls="md"):
    s = f'<p class="sub">{sub}</p>' if sub else ""
    return lambda i, n: ("1-portada", topbar(i, n) + f'<div class="c center"><div class="kicker">{kicker}</div><h1 class="{h1cls}">{h1}</h1>{s}</div>'
                         + visual + swipe(swipe_text, swipe_top))


def slide(name, kicker, title, desc, visual, num=None, big=None, h1cls="sm"):
    def f(i, n):
        top = f'<div class="step-num">{num}</div>' if num is not None else (f'<div class="bignum">{big}</div>' if big else f'<div class="kicker">{kicker}</div>')
        d = f'<p class="sub">{desc}</p>' if desc else ""
        return (f"{i}-{name}", topbar(i, n) + f'<div class="c">{top}<h1 class="{h1cls}">{title}</h1>{d}</div>' + visual)
    return f


def closing(h1, sub, label, pill="Pruébalo gratis", photos=None):
    photos = photos or ["s03.jpg", "s01.jpg", "s02.jpg", "s04.jpg", "s05.jpg", "s12.jpg", "s07.jpg", "s08.jpg", "s09.jpg", "s10.jpg", "s13.jpg", "s14.jpg", "s15.jpg", "s18.jpg", "s17.jpg"]
    return lambda i, n: (f"{i}-cierre", head(pill, h1, sub, "md") + cta(label=label) + v_mosaic(photos)
                         + f'<span class="count" style="position:absolute;top:120px;right:72px">{i}/{n}</span>')


def carousel(folder, parts, css=""):
    n = len(parts)
    for i, p in enumerate(parts, 1):
        name, body = p(i, n)
        write(folder, name, page(f"Revelao {i}/{n}", body, css))


# visuales de slide (zona 620-1500)
def pic(photo, top=640, h=820, pos="50% 45%"):
    return f'<div class="photo abs" style="left:60px;right:60px;top:{top}px;height:{h}px"><img class="ph" src="{I}{photo}" style="object-position:{pos}"></div>'


def polaroid_big(photo, caption, rot=-2, top=680):
    return (f'<div class="polaroid abs" style="left:50%;top:{top}px;width:820px;transform:translateX(-50%) rotate({rot}deg)">'
            f'<img class="ph" src="{I}{photo}" style="width:776px;height:780px"><div style="position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:28px;font-weight:600;color:#777">{caption}</div></div>')


def shot(img, top=720, pad=40):
    return f'<div class="abs" style="left:{pad}px;right:{pad}px;top:{top}px"><img src="{I}{img}" style="width:100%"></div>'


def screen_card(img, top=660, w=520):
    return (f'<div class="abs" style="left:0;right:0;top:{top}px;display:flex;justify-content:center">'
            f'<img src="{I}{img}" style="width:{w}px;border-radius:44px;box-shadow:0 40px 80px -36px rgba(0,0,0,.5)"></div>')


def quote_card(q, a, top=1300):
    return (f'<div class="card abs" style="left:100px;right:100px;top:{top}px;padding:40px 44px;z-index:4">'
            f'<p style="font-size:32px;line-height:1.4;font-weight:500"><span style="color:var(--primary);font-weight:800;font-size:60px;line-height:0;vertical-align:-18px;margin-right:6px">“</span>{q}</p>'
            f'<div style="margin-top:18px;font-size:26px;font-weight:700;color:var(--muted)"><span style="color:#f5b301;letter-spacing:3px;margin-right:10px">★★★★★</span>{a}</div></div>')


def center_card(inner, top=760, w=900, pad="60px 50px"):
    return f'<div class="abs" style="left:0;right:0;top:{top}px;display:flex;justify-content:center"><div class="card" style="width:{w}px;padding:{pad};text-align:center">{inner}</div></div>'


# ======================================================================== PIEZAS
def build():
    # 01 ------------------------------------------------------------ suelta
    single("01-cientos-de-fotos", "Dato incómodo", 'Cientos de fotos.<br><span class="red">¿Cuántas te llegarán?</span>',
           "Tus invitados no paran de hacer fotos.<br><strong>Con Revelao te llegan todas.</strong>",
           v_mosaic(["phone_record.jpg", "s01.jpg", "phone_friends.jpg", "sunflower_phones.jpg", "s06.jpg", "s11.jpg", "friends_selfie.jpg", "s14.jpg", "s04.jpg", "s15.jpg", "booth_couple.jpg", "s07.jpg", "hands_up.jpg", "s16.jpg", "s08.jpg"]),
           "Ver más", h1cls="sm")

    # 02 ------------------------------------------------------------ carrusel
    tips = [("Pon un QR en cada mesa", "Que nadie tenga que buscarlo:<br><strong>a la vista y a mano.</strong>", "Plantilla3.png"),
            ("Que lo anuncie el DJ", "Un aviso a mitad de fiesta<br><strong>dispara las subidas.</strong>", "disco.jpg"),
            ("Menciónalo en el discurso", "Si lo pedís vosotros,<br><strong>todo el mundo participa.</strong>", "speech_mic.jpg"),
            ("Añádelo a la invitación", "Llegarán a la boda<br><strong>sabiendo cómo funciona.</strong>", "invite.jpg"),
            ("Recuerda el revelado", "Saber que al día siguiente se verá todo<br><strong>es la mejor motivación.</strong>", "s03.jpg")]
    parts = [cover("Guía práctica", 'Cómo conseguir que<br><span class="red">todos suban fotos</span>', "",
                   v_polar("s11.jpg", "phone_friends.jpg", "s04.jpg", top=820), 1660)]
    for k, (t, d, p) in enumerate(tips, 1):
        parts.append(slide(f"tip-{k}", "", t, d, pic(p, 800, 720), num=k))
    parts.append(closing('Un QR.<br><span class="red">Todas las fotos.</span>', "Crea tu evento en minutos.<br><strong>Y pruébalo gratis.</strong>", "Prueba gratis"))
    carousel("02-carrusel-que-todos-suban", parts)

    # 03 ------------------------------------------------------------ suelta
    single("03-sin-excusas", "Tan fácil como hacer una foto", 'Sin app. Sin registro.<br><span class="red">Sin excusas.</span>',
           "Tus invitados escanean y suben en segundos.<br><strong>Hasta la abuela.</strong>",
           v_phone_photo(app_upload("sparkler_kiss.jpg"), "granny_phone.jpg"), "Pruébalo gratis", h1cls="sm")

    # 04 ------------------------------------------------------------ carrusel
    moments = [("La entrada de la novia,<br>desde la última fila", "s16.jpg", "12:31"),
               ("El discurso que hizo<br>llorar a medio salón", "speech_laugh.jpg", "15:47"),
               ("El corte de la tarta<br>desde 20 ángulos", "cake_cut.jpg", "18:05"),
               ("Las bengalas<br>del primer baile", "sparkler_dance.jpg", "23:12"),
               ("El photocall<br>a las 2 de la mañana", "booth_girls.jpg", "02:03")]
    parts = [cover("Tus invitados lo verán por ti", '5 momentos que<br><span class="red">te vas a perder</span>', "Y que tus invitados sí capturarán.",
                   v_polar("s09.jpg", "s12.jpg", "s15.jpg", top=860, blur=True, chip=f"{IC_LOCK}Se revela mañana"), 1660)]
    for k, (t, p, hr) in enumerate(moments, 1):
        parts.append(slide(f"momento-{k}", "", t, "", polaroid_big(p, f"📸 Subida por un invitado · {hr}", -2 if k % 2 else 2), big=f"0{k}"))
    parts.append(closing('Tú disfruta.<br><span class="red">Ellos lo capturan.</span>', "Y al día siguiente, lo descubres todo.<br><strong>Pruébalo gratis.</strong>", "Pruébalo gratis"))
    carousel("04-carrusel-momentos-que-te-pierdes", parts)

    # 05 ------------------------------------------------------------ suelta
    single("05-fotografo-e-invitados", "Se complementan", 'Tu fotógrafo capta la boda.<br><span class="red">Tus invitados, la fiesta.</span>',
           "Uno no sustituye al otro:<br><strong>juntos no se pierde nada.</strong>",
           v_fan("speech_laugh.jpg", "s02.jpg", "sparkler_dance.jpg"), "Ver más", h1cls="sm")

    # 06 ------------------------------------------------------------ carrusel
    spots = [("En cada mesa", "El sitio estrella: todos lo tienen delante<br><strong>durante la comida.</strong>", "Plantilla3.png"),
             ("En la barra", "Donde todo el mundo pasa<br><strong>(varias veces).</strong>", "Plantilla2.png"),
             ("En la entrada", "Un caballete de bienvenida<br><strong>para empezar desde el minuto uno.</strong>", "Plantilla1.png"),
             ("En el photocall", "Foto en el photocall y, en el momento,<br><strong>subida a la galería.</strong>", "booth_couple.jpg"),
             ("En la pantalla", "Si hay proyector,<br><strong>el QR a lo grande.</strong>", "Plantilla4.png")]
    parts = [cover("Plantillas QR", 'Dónde poner<br><span class="red">el QR de tu boda</span>', "5 sitios donde nadie se lo pierde.",
                   v_fan("Plantilla2.png", "Plantilla1.png", "Plantilla3.png", top=780), 1640)]
    for k, (t, d, p) in enumerate(spots, 1):
        parts.append(slide(f"sitio-{k}", "", t, d, pic(p, 800, 720), num=k))
    parts.append(closing('Elige tu plantilla<br><span class="red">y ponle nombre</span>', "Descárgala o te la imprimimos.<br><strong>Lista en minutos.</strong>", "Ver plantillas", "Plantillas QR"))
    carousel("06-carrusel-donde-poner-el-qr", parts)

    # 07 ------------------------------------------------------------ suelta
    single("07-la-mejor-foto-es-un-audio", "Mensajes de voz", 'La mejor foto de tu boda<br><span class="red">puede ser un audio</span>',
           "Tus invitados también pueden dejarte<br><strong>mensajes de voz anónimos.</strong>",
           v_audio_photo("granny_call.jpg", "0:32", 21), "Ver más", checks=("Fotos", "Vídeos", "Audios"), h1cls="sm")

    # 08 ------------------------------------------------------------ carrusel
    retos = [("Una foto con alguien<br>que no conocías", "friends_selfie.jpg"),
             ("Tu mejor paso<br>de baile", "hands_up2.jpg"),
             ("Un brindis por<br>los novios", "friends_cocktail.jpg"),
             ("La foto más<br>disparatada del photocall", "booth_girls.jpg"),
             ("Un consejo en audio<br>para los novios", "man_phone.jpg")]
    parts = [cover("Ideas para tu boda", '5 retos para<br><span class="red">tus invitados</span>', "Ponlos en las tarjetas QR y mira<br>cómo se llena la galería.",
                   v_fan("booth_couple.jpg", "friends_selfie.jpg", "hands_up2.jpg", top=820), 1650)]
    for k, (t, p) in enumerate(retos, 1):
        parts.append(slide(f"reto-{k}", "", t, "", polaroid_big(p, "Reto de la boda · súbelo con el QR", 2 if k % 2 else -2), big=f"#{k}"))
    parts.append(closing('Retos + QR =<br><span class="red">galería llena</span>', "Y todo aparece junto al día siguiente.<br><strong>Pruébalo gratis.</strong>", "Pruébalo gratis"))
    carousel("08-carrusel-retos-para-invitados", parts)

    # 09 ------------------------------------------------------------ suelta
    single("09-checklist-boda", "Checklist", 'Checklist<br><span class="red">de tu boda</span>', "",
           v_list([("ok", "Lugar", False), ("ok", "Vestido y traje", False), ("ok", "Música", False), ("ok", "Fotógrafo", False),
                   ("todo", 'Las fotos de <span class="red">tus invitados</span>', True)], top=990), "Pruébalo gratis")

    # 10 ------------------------------------------------------------ carrusel
    tl = [("Durante el evento", "Tus invitados suben fotos, vídeos y audios.<br><strong>Nadie ve nada.</strong>", phone(app_upload("s10.jpg"), "position:absolute;left:50%;top:790px;transform:translateX(-50%) scale(.8);transform-origin:top center")),
          ("Se cierra la subida", "A la hora que tú elijas.<br><strong>Empieza la espera.</strong>", screen_card("how-step-esperando.png", 800, 900).replace("border-radius:44px", "border-radius:30px")),
          ("La cuenta atrás", "Todos pendientes del móvil.<br><strong>¡Qué nervios!</strong>", center_card('<div style="font-size:34px;color:var(--muted);font-weight:600">Las fotos se revelarán</div><div style="font-size:110px;font-weight:800;letter-spacing:-.04em;margin-top:10px">12:00</div><div style="font-size:36px;font-weight:600;margin-top:16px">Quedan 2 horas y 14 minutos</div>', 800)),
          ("¡Revelado!", "Todo aparece a la vez para todos.<br><strong>Ver, descargar, compartir.</strong>", phone(app_gallery(["s02.jpg", "s10.jpg", "s05.jpg", "s03.jpg", "s14.jpg", "s08.jpg", "s15.jpg", "s04.jpg", "s11.jpg"]), "position:absolute;left:50%;top:790px;transform:translateX(-50%) scale(.8);transform-origin:top center"))]
    parts = [cover("Paso a paso", 'Así es el día<br><span class="red">del Revelado</span>', "Del último baile a la galería completa.",
                   shot("how-step-reveal-new.png", 720), 1640)]
    for k, (t, d, v) in enumerate(tl, 1):
        parts.append(slide(f"momento-{k}", "", t, d, v, num=k))
    parts.append(closing('La espera<br><span class="red">también es parte</span>', "Así se vive una boda con Revelao.<br><strong>Pruébalo gratis.</strong>", "Prueba gratis"))
    carousel("10-carrusel-el-dia-del-revelado", parts)

    # 11 ------------------------------------------------------------ suelta
    steps = "".join(f'<div class="card" style="flex:1;padding:34px 20px;text-align:center"><div class="step-num" style="width:84px;height:84px;font-size:44px;margin:0 auto 18px">{k}</div><div style="font-size:30px;font-weight:700">{t}</div></div>'
                    for k, t in enumerate(["Nombre", "Foto", "QR listo"], 1))
    single("11-evento-en-30-segundos", "Demo gratuita", 'Crea tu evento<br><span class="red">en 30 segundos</span>',
           "Sin registro y sin tarjeta.<br><strong>Pruébalo y compruébalo.</strong>",
           f'<div class="abs" style="left:80px;right:80px;top:1000px;display:flex;gap:24px">{steps}</div>'
           + f'<div class="photo abs" style="left:50%;top:1290px;width:520px;height:680px;transform:translateX(-50%) rotate(-3deg)"><img class="ph" src="{I}template-1.png"></div>',
           "Crear evento gratis", checks=("Sin registro", "Sin tarjeta", "QR al momento"))

    # 12 ------------------------------------------------------------ carrusel
    errs = [("Depender del grupo de WhatsApp", "Fotos comprimidas, perdidas<br><strong>y desordenadas.</strong>", "phone_friends.jpg"),
            ("Pedir que suban a un Drive", "Nadie lo hace. Y el enlace<br><strong>acaba caducando.</strong>", "s01.jpg"),
            ("Obligar a descargar una app", "La mitad de los invitados<br><strong>no lo hará.</strong>", "granny_phone.jpg"),
            ("Esconder el QR", "Si no se ve,<br><strong>no se escanea.</strong>", "Plantilla3.png"),
            ("Olvidarte de los audios", "Las voces de los tuyos<br><strong>también son recuerdos.</strong>", "man_phone.jpg")]
    parts = [cover("Evítalos", '5 errores con<br><span class="red">las fotos de tu boda</span>', "",
                   v_list([("no", t, False) for t, _, _ in errs], top=720), 1600)]
    for k, (t, d, p) in enumerate(errs, 1):
        parts.append(slide(f"error-{k}", "", t, d, pic(p, 800, 720), big=f"✕{k}"))
    parts.append(closing('Un QR y<br><span class="red">cero errores</span>', "Todas las fotos, vídeos y audios<br><strong>en una galería privada.</strong>", "Pruébalo gratis"))
    carousel("12-carrusel-errores-con-las-fotos", parts)

    # 13 ------------------------------------------------------------ suelta
    single("13-asi-puede-ser-tu-revelado", "Así puede ser tu revelado", '847 fotos.<br>112 vídeos.<br><span class="red">64 audios.</span>', "",
           v_phone(app_gallery(["s02.jpg", "s10.jpg", "s05.jpg", "s03.jpg", "s14.jpg", "s08.jpg", "s15.jpg", "s04.jpg", "s11.jpg", "s18.jpg", "s06.jpg", "s16.jpg"])),
           "Ver más", checks=("Fotos", "Vídeos", "Audios"), h1cls="md")

    # 14 ------------------------------------------------------------ carrusel
    plans = [("Demo", "0€", "Para probarlo", "10 fotos · 3 vídeos · 6 audios", False),
             ("Start", "39€", "Eventos pequeños", "200 fotos · 30 vídeos · 60 audios", False),
             ("Plus", "79€", "El más elegido", "5.000 fotos · 200 vídeos · 500 audios<br>y subida desde la galería del móvil", True),
             ("Pro", "149€", "Sin límites", "Fotos, vídeos y audios ilimitados", False)]
    parts = [cover("Precios", 'Elige tu plan<br><span class="red">en 5 segundos</span>', "Pago único por evento. Sin suscripciones.",
                   '<div class="abs" style="left:64px;right:64px;top:720px;display:flex;flex-direction:column;gap:22px">'
                   + "".join(plan_card(t, s, p, f, p != "0€") for t, p, _, s, f in plans) + "</div>", 1560)]
    for k, (t, p, kick, s, f) in enumerate(plans, 1):
        inner = (f'<div style="font-size:200px;font-weight:800;letter-spacing:-.06em;line-height:1" class="{"red" if f or p == "0€" else ""}">{p}</div>'
                 f'<div style="font-size:30px;color:var(--muted);font-weight:600;margin-top:8px">{"gratis" if p == "0€" else "por evento · pago único"}</div>'
                 f'<div style="font-size:36px;font-weight:600;margin-top:40px;line-height:1.4">{s}</div>')
        parts.append(slide(f"plan-{t.lower()}", kick, f'Plan {t}' + (' <span class="red">★</span>' if f else ""), "", center_card(inner, 640, 940, "80px 50px"), h1cls="md"))
    parts.append(closing('Empieza<br><span class="red">por la demo</span>', "Gratis, sin registro y sin tarjeta.<br><strong>Lista en 30 segundos.</strong>", "Ver planes", "Precios claros"))
    carousel("14-carrusel-planes-explicados", parts)

    # 15 ------------------------------------------------------------ suelta
    antes = v_list([("no", "Fotos comprimidas por mensajería", False), ("no", "Enlaces que caducan", False), ("no", "Semanas pidiendo fotos", False)], top=1060, gap=14)
    despues = v_list([("ok", "Todo en alta calidad", False), ("ok", "En una sola galería", False), ("ok", "Al día siguiente", False)], top=1480, gap=14)
    single("15-antes-y-despues", "Antes y después", 'Antes vs.<br><span class="red">después de Revelao</span>', "",
           f'<div class="abs" style="left:80px;top:1000px"><span class="tagpill dark">{IC_X}Antes</span></div>' + antes.replace("font-size:36px", "")
           + f'<div class="abs" style="left:80px;top:1420px"><span class="tagpill red">{CHECK}Con Revelao</span></div>' + despues,
           "Pruébalo gratis", h1cls="md", css=".item{padding:22px 30px;font-size:32px}")

    # 16 ------------------------------------------------------------ carrusel
    tests = [("Boda de Laura y Carlos", "Las fotos, vídeos y mensajes de voz anónimos crearon un ambiente mágico. Al día siguiente todos estábamos pegados al móvil esperando el revelado.", "Laura M.", "s13.jpg"),
             ("Cumpleaños de 30", "Mis amigos se volvieron locos subiendo fotos, vídeos y audios. No saber qué había capturado cada uno hizo la espera insoportable (en el buen sentido).", "Diego R.", "birthday.jpg"),
             ("Cena de empresa", "El nivel de participación con fotos, vídeos y mensajes de voz fue increíble, todo el equipo involucrado.", "Ana S., HR Manager", "dinner_toast.jpg"),
             ("Fiesta de pueblo", "Todo el mundo escaneó el QR y subió fotos, vídeos y audios sin parar. Al día siguiente fue un espectáculo verlo y escucharlo todo junto.", "María G.", "street_night.jpg"),
             ("Aniversario de 25 años", "Una forma única de capturar momentos especiales. Nuestros invitados no pararon de subir fotos, vídeos y mensajes de voz.", "Roberto P.", "anniv_couple.jpg")]
    stars = f'<div class="abs" style="left:0;right:0;top:760px;text-align:center;color:#f5b301;font-size:120px;letter-spacing:10px">★★★★★</div>'
    parts = [cover("Opiniones", 'Lo que dicen<br><span class="red">de Revelao</span>', "Bodas, cumpleaños, empresas y fiestas.",
                   stars + v_fan("birthday.jpg", "s13.jpg", "street_night.jpg", top=980, side=(340, 460), center=(400, 540), spread=260), 1600)]
    for k, (ev, q, a, p) in enumerate(tests, 1):
        parts.append(slide(f"opinion-{k}", "Opinión", ev, "", pic(p, 520, 860) + quote_card(q, a, 1260), h1cls="sm"))
    parts.append(closing('Tu evento,<br><span class="red">la próxima historia</span>', "Crea el tuyo en minutos.<br><strong>Pruébalo gratis.</strong>", "Pruébalo gratis"))
    carousel("16-carrusel-opiniones", parts)

    # 17 ------------------------------------------------------------ suelta
    single("17-cena-de-empresa", "Eventos de empresa", 'Tu cena de empresa,<br><span class="red">contada por el equipo</span>',
           "Fotos, vídeos y audios de todos.<br><strong>Con la imagen de tu marca.</strong>",
           v_fan("office_dance.jpg", "dinner_toast.jpg", "team_toast.jpg"), "Ver más", checks=("Sin app", "Galería privada", "Tu marca"), h1cls="sm")

    # 18 ------------------------------------------------------------ carrusel
    wp = [("Un extra que tus parejas<br>recordarán", "La experiencia del revelado<br><strong>hace hablar de la boda.</strong>", "s10.jpg"),
          ("Cero trabajo<br>para ti", "Se crea en minutos<br><strong>y funciona solo.</strong>", "how-step-create-new.png"),
          ("QR a juego con<br>la decoración", "Plantillas personalizables<br><strong>o impresas por nosotros.</strong>", "Plantilla1.png"),
          ("Todo el contenido<br>al día siguiente", "Fotos, vídeos y audios<br><strong>en una galería privada.</strong>", "how-step-reveal-new.png")]
    parts = [cover("Para wedding planners", 'Un detalle que<br><span class="red">eleva tus bodas</span>', "Suma Revelao a tus servicios.",
                   v_fan("Plantilla2.png", "s13.jpg", "Plantilla3.png", top=780), 1640)]
    for k, (t, d, p) in enumerate(wp, 1):
        v = shot(p, 800) if p.endswith("new.png") else pic(p, 800, 720)
        parts.append(slide(f"ventaja-{k}", "", t, d, v, num=k))
    parts.append(closing('¿Trabajamos<br><span class="red">juntos?</span>', "Condiciones para profesionales.<br><strong>Escríbenos y te contamos.</strong>", "¿Hablamos?", "Profesionales"))
    carousel("18-carrusel-wedding-planners", parts)

    # 19 ------------------------------------------------------------ suelta
    single("19-tu-cumple", "Cumpleaños", 'Tu cumple merece<br><span class="red">más que 3 stories</span>',
           "Que tus amigos suban todo lo que capturan.<br><strong>Y descúbrelo al día siguiente.</strong>",
           v_fan("friends_selfie.jpg", "birthday.jpg", "candles.jpg"), "Pruébalo gratis", h1cls="md")

    # 20 ------------------------------------------------------------ carrusel
    emp = [("Cenas de Navidad", "dinner_toast.jpg"), ("Team building", "office_dance.jpg"), ("Congresos y convenciones", "speech_mic.jpg"), ("Fiestas de empresa", "disco.jpg")]
    parts = [cover("Revelao para empresas", 'Tus eventos,<br><span class="red">desde cada móvil</span>', "Más participación, más contenido<br>y <strong>con tu marca.</strong>",
                   v_fan("office_dance.jpg", "team_toast.jpg", "office_hats.jpg", top=900), 1660)]
    for k, (t, p) in enumerate(emp, 1):
        parts.append(slide(f"evento-{k}", "Revelao para", t, "", pic(p, 560, 900), h1cls="md"))
    parts.append(closing('Tu equipo,<br><span class="red">tu contenido</span>', "Galería privada con tu marca.<br><strong>Te preparamos una propuesta.</strong>", "¿Hablamos?", "Empresas"))
    carousel("20-carrusel-empresas", parts)

    # 21 ------------------------------------------------------------ suelta
    single("21-fiestas-de-pueblo", "Fiestas de pueblo", 'Todo el pueblo.<br><span class="red">Un solo QR.</span>',
           "Las fotos de las fiestas, por fin<br><strong>en el mismo sitio.</strong>",
           v_mosaic(["street_night.jpg", "grandpa_red.jpg", "bunting.jpg", "hands_up.jpg", "elderly_dance.jpg", "friends_dance.jpg", "grandpa_carry.jpg", "hands_up2.jpg", "friends_laugh.jpg", "disco2.jpg", "friends_bar.jpg", "street_night.jpg", "bunting.jpg", "grandpa_red.jpg", "hands_up.jpg"]),
           "Ver más")

    # 22 ------------------------------------------------------------ carrusel
    myths = [("Hay que descargar una app", "Funciona desde el navegador del móvil.<br><strong>Escanear y listo.</strong>"),
             ("Solo sirve para bodas", "Cumpleaños, empresas, fiestas,<br><strong>graduaciones… y más.</strong>"),
             ("Las fotos pierden calidad", "Se descargan<br><strong>en alta calidad.</strong>"),
             ("Cualquiera puede verlas", "Solo quien tiene tu QR.<br><strong>Galería privada.</strong>")]
    parts = [cover("Mitos", 'Mitos sobre<br><span class="red">Revelao</span>', "Y lo que pasa de verdad.",
                   v_list([("no", t, False) for t, _ in myths], top=760), 1500)]
    for k, (m, r) in enumerate(myths, 1):
        v = (center_card(f'<span class="tagpill dark">{IC_X}Mito</span><div style="font-size:60px;font-weight:700;margin-top:30px;text-decoration:line-through;color:#999;line-height:1.15">{m}</div>', 640, 940, "70px 50px")
             + center_card(f'<span class="tagpill red">{CHECK}Realidad</span><div style="font-size:48px;line-height:1.35;margin-top:30px">{r}</div>', 1100, 940, "70px 50px"))
        parts.append(slide(f"mito-{k}", "", f"Mito #{k}", "", v, h1cls="md"))
    parts.append(closing('Menos mitos,<br><span class="red">más fotos</span>', "Compruébalo tú mismo.<br><strong>Pruébalo gratis.</strong>", "Pruébalo gratis"))
    carousel("22-carrusel-mitos", parts)

    # 23 ------------------------------------------------------------ suelta
    qcss = ".quote{margin:44px auto 0;max-width:940px;font-size:64px;line-height:1.14;font-weight:700;letter-spacing:-.025em}.quote .q{color:var(--primary)}.author{margin-top:30px;font-size:32px;font-weight:600;color:var(--muted)}"
    qhead = (f'<header class="head"><img class="logo" src="{I}logo.png"><div class="pill"><span style="color:#f5b301;letter-spacing:4px">★★★★★</span>Cumpleaños de 30</div>'
             '<p class="quote"><span class="q">“</span>Mis amigos se volvieron <span class="red">locos subiendo</span> fotos, vídeos y audios.<span class="q">”</span></p>'
             '<p class="author">Diego R. · celebró con Revelao</p></header>')
    single("23-opinion-diego", "", "", "", v_fan("friends_selfie.jpg", "birthday.jpg", "friends_laugh.jpg"), "Ver más",
           checks=("Fotos", "Vídeos", "Audios"), css=qcss, head_html=qhead)

    # 24 ------------------------------------------------------------ carrusel
    wk = [("Crea tu evento", "Nombre, foto de portada<br><strong>y hora del revelado.</strong>", shot("how-step-create-new.png", 800)),
          ("Imprime tus tarjetas QR", "Una por mesa<br><strong>y alguna de sobra.</strong>", pic("Plantilla3.png", 800, 720)),
          ("Avisa al DJ", "Que lo anuncie<br><strong>cuando la pista esté a tope.</strong>", pic("disco2.jpg", 800, 720)),
          ("Compártelo por mensaje", "Mándalo al grupo<br><strong>la mañana de la boda.</strong>", pic("phone_friends.jpg", 800, 720)),
          ("Y a disfrutar", "Mañana, <strong>el revelado.</strong>", pic("s12.jpg", 800, 720))]
    parts = [cover("La semana antes", 'Tu checklist QR<br><span class="red">antes de la boda</span>', "5 pasos y listo.",
                   v_list([("todo", t, False) for t, _, _ in wk], top=720), 1600)]
    for k, (t, d, v) in enumerate(wk, 1):
        parts.append(slide(f"paso-{k}", "", t, d, v, num=k))
    parts.append(closing('Todo listo<br><span class="red">para el gran día</span>', "Crea tu evento hoy.<br><strong>Es gratis probarlo.</strong>", "Crear mi evento"))
    carousel("24-carrusel-checklist-semana-antes", parts)

    # 25 ------------------------------------------------------------ suelta
    single("25-nadie-sabe-quien-subio-que", "100% anónimo", 'Nadie sabe<br><span class="red">quién subió qué</span>',
           "Por eso tus invitados se atreven con todo.<br><strong>Y ahí están las mejores fotos.</strong>",
           v_polar("mirror_selfie.jpg", "bach_laugh.jpg", "booth_girls.jpg", caption="🤫 Subida por: anónimo"), "Ver más")

    # 26 ------------------------------------------------------------ carrusel
    ideas = [("Un consejo para<br>el matrimonio", "elderly_dance.jpg", "0:28"), ("Vuestra primera<br>anécdota juntos", "friends_laugh.jpg", "0:45"),
             ("Una canción<br>(aunque cantes fatal)", "hands_up2.jpg", "0:37"), ("Lo que nunca te<br>atreviste a decirles", "man_phone.jpg", "0:19"),
             ("Una predicción para<br>dentro de 10 años", "granny_phone.jpg", "0:24")]
    parts = [cover("Para tus invitados", '5 ideas de audios<br><span class="red">para los novios</span>', "Graba un mensaje de voz desde el QR.<br><strong>Es anónimo.</strong>",
                   f'<div class="abs" style="left:90px;right:90px;top:900px;display:flex;flex-direction:column;gap:30px">{audio("0:28", 31, .5)}{audio("0:45", 32, .2)}{audio("0:19", 33, .7)}</div>', 1560)]
    for k, (t, p, dur) in enumerate(ideas, 1):
        parts.append(slide(f"audio-{k}", "", t, "", v_audio_photo(p, dur, 40 + k, 790, 680), big=f"0{k}"))
    parts.append(closing('Fotos, vídeos<br><span class="red">y voces</span>', "Todo se revela a la vez.<br><strong>Pruébalo gratis.</strong>", "Pruébalo gratis"))
    carousel("26-carrusel-ideas-de-audios", parts)

    # 27 ------------------------------------------------------------ suelta
    single("27-galeria-privada", "Galería privada", 'Tus recuerdos,<br><span class="red">solo para los tuyos</span>',
           "Solo entra quien tiene tu QR.<br><strong>Nada público.</strong>", v_blurgrid(990), "Ver más",
           checks=("Privado", "Con tu QR", "Tú decides"), h1cls="md")

    # 28 ------------------------------------------------------------ carrusel
    gx = [("Escanea el QR", "Con la cámara del móvil.<br><strong>Sin descargar nada.</strong>", pic("phone_record.jpg", 800, 720)),
          ("Elige qué subir", "Foto, vídeo<br><strong>o mensaje de voz.</strong>", phone(app_upload("s05.jpg"), "position:absolute;left:50%;top:790px;transform:translateX(-50%) scale(.8);transform-origin:top center")),
          ("Captura la fiesta", "Todo lo que quieras<br><strong>mientras dure el evento.</strong>", pic("s06.jpg", 800, 720)),
          ("Espera al revelado", "Nadie ve nada<br><strong>hasta el día siguiente.</strong>", screen_card("how-step-esperando.png", 800, 900).replace("border-radius:44px", "border-radius:30px")),
          ("¡Descúbrelo todo!", "Ver, descargar, dar likes<br><strong>y compartir.</strong>", shot("how-step-reveal-new.png", 800))]
    parts = [cover("La experiencia del invitado", 'Del QR al revelado<br><span class="red">en 5 pasos</span>', "", v_phone_photo(app_upload("sparkler_kiss.jpg"), "Plantilla1.png", 700), 1790)]
    for k, (t, d, v) in enumerate(gx, 1):
        parts.append(slide(f"paso-{k}", "", t, d, v, num=k))
    parts.append(closing('Así de fácil<br><span class="red">para todos</span>', "Y así de emocionante al día siguiente.<br><strong>Pruébalo gratis.</strong>", "Prueba gratis"))
    carousel("28-carrusel-del-qr-al-revelado", parts)

    # 29 ------------------------------------------------------------ suelta
    dl = (v_phone(app_gallery(["s02.jpg", "s10.jpg", "s05.jpg", "s03.jpg", "s14.jpg", "s08.jpg", "s15.jpg", "s04.jpg", "s11.jpg"], banner=False))
          + f'<div class="abs" style="left:50%;top:1500px;transform:translateX(-50%);z-index:5"><span class="lchip" style="background:var(--ink);color:#fff;font-size:32px;padding:24px 40px">{svgst(IC_DL, "color:#fff")}Descargar todo</span></div>')
    single("29-descarga-en-alta-calidad", "Alta calidad", 'Descárgalo todo<br><span class="red">en alta calidad</span>',
           "Olvídate de las fotos pixeladas del grupo.<br><strong>Guárdalas todas como se hicieron.</strong>", dl, "Ver planes",
           checks=("Fotos", "Vídeos", "Audios"), h1cls="md")

    # 30 ------------------------------------------------------------ carrusel
    tipos = [("Graduaciones", "grad_throw.jpg"), ("Despedidas", "bach_girls.jpg"), ("Quinceañeras", "quince_girl.jpg"), ("Fiestas temáticas", "disco.jpg"), ("Aniversarios", "anniv_couple.jpg")]
    chips = "".join(f'<div class="photo" style="position:relative;height:250px"><img class="ph" src="{I}{p}"><span style="position:absolute;left:14px;bottom:14px;background:#fff;border-radius:9999px;padding:8px 18px;font-size:24px;font-weight:700">{t}</span></div>' for t, p in tipos[:4])
    parts = [cover("Más ideas", 'Revelao para<br><span class="red">cualquier fiesta</span>', "", f'<div class="abs" style="left:60px;right:60px;top:660px;display:grid;grid-template-columns:1fr 1fr;gap:24px">{chips}</div>', 1300)]
    for k, (t, p) in enumerate(tipos, 1):
        parts.append(slide(f"fiesta-{k}", "Revelao para", t, "", pic(p, 560, 900), h1cls="md"))
    parts.append(closing('Si hay fiesta,<br><span class="red">hay revelado</span>', "Crea tu evento en minutos.<br><strong>Pruébalo gratis.</strong>", "Pruébalo gratis"))
    carousel("30-carrusel-tipos-de-fiesta", parts)

    # 31 ------------------------------------------------------------ suelta
    opts = "".join(f'<span class="lchip" style="font-size:26px;padding:14px 24px">{t}</span>' for t in ["✍️ Nombres", "🖼️ Portada", "🔤 Tipografía", "⏰ Hora del revelado"])
    single("31-personaliza-tu-galeria", "Personalizable", 'Con vuestros nombres<br><span class="red">y vuestra foto</span>',
           "Personaliza la galería de tu evento<br><strong>en pocos minutos.</strong>",
           v_phone(app_hero("Paula &amp; Dani", "sparkler_kiss.jpg", "📷 0 fotos / 🎬 0 vídeos / 🔊 0 audios") + '<div class="app-body"><div class="app-q">¿Qué quieres hacer?</div></div>', 1060, .95)
           + f'<div class="abs" style="left:40px;right:40px;top:990px;display:flex;flex-wrap:wrap;justify-content:center;gap:14px;z-index:5">{opts}</div>',
           "Ver más", h1cls="sm")

    # 32 ------------------------------------------------------------ carrusel
    pl = [("Clásica, en caballete", "Para recibir a los invitados<br><strong>en la entrada.</strong>", "Plantilla1.png"),
          ("Elegante, para la barra", "Con marco y a la vista<br><strong>de todo el mundo.</strong>", "Plantilla2.png"),
          ("En cada plato", "La tarjeta QR como<br><strong>detalle de mesa.</strong>", "Plantilla3.png"),
          ("Mediterránea", "Azul, fresca<br><strong>y muy de verano.</strong>", "boda-qr.png"),
          ("En pantalla gigante", "Para eventos grandes<br><strong>y fiestas multitudinarias.</strong>", "Plantilla4.png")]
    parts = [cover("Plantillas QR", 'Elige el diseño<br><span class="red">de tu QR</span>', "Personalízalo con tus nombres.",
                   v_fan("Plantilla4.png", "boda-qr.png", "Plantilla2.png", top=800), 1640)]
    for k, (t, d, p) in enumerate(pl, 1):
        parts.append(slide(f"plantilla-{k}", f"Diseño {k}", t, d, pic(p, 800, 720), h1cls="sm"))
    parts.append(closing('¿Cuál es<br><span class="red">la tuya?</span>', "Descárgala o te la imprimimos<br><strong>y te la enviamos a casa.</strong>", "Ver plantillas", "Plantillas QR"))
    carousel("32-carrusel-plantillas-qr", parts)

    # 33 ------------------------------------------------------------ suelta
    single("33-plan-plus", "El más elegido", 'Plan Plus<br><span class="red">79€ por evento</span>',
           "5.000 fotos, 200 vídeos y 500 audios.<br><strong>Y subida desde la galería del móvil.</strong>",
           f'<div class="abs" style="left:64px;right:64px;top:1030px">{plan_card("Plus", "5.000 fotos · 200 vídeos · 500 audios", "79€", True)}</div>'
           + v_fan("s08.jpg", "s13.jpg", "s14.jpg", top=1250, side=(340, 480), center=(400, 560), spread=260),
           "Ver planes", checks=("Pago único", "Sin suscripción", "Alta calidad"), h1cls="md")

    # 34 ------------------------------------------------------------ carrusel
    pr = [("Tú decides cuándo<br>se revela", "Elige el día y la hora.<br><strong>Hasta entonces, todo oculto.</strong>", screen_card("how-step-esperando.png", 800, 900).replace("border-radius:44px", "border-radius:30px")),
          ("Galería privada", "Solo entra quien tiene tu QR.<br><strong>Nada público.</strong>", v_blurgrid(800)),
          ("Descarga todo", "Fotos, vídeos y audios<br><strong>en alta calidad.</strong>", center_card(f'<div style="color:var(--primary)">{svgst(IC_DL, "width:140px;height:140px")}</div><div style="font-size:56px;font-weight:800;margin-top:20px">Descargar todo</div><div style="font-size:30px;color:var(--muted);margin-top:10px">847 fotos · 112 vídeos · 64 audios</div>', 820)),
          ("20 días de galería", "Tiempo de sobra para verlo,<br><strong>descargarlo y compartirlo.</strong>", center_card('<div style="font-size:220px;font-weight:800;letter-spacing:-.06em;line-height:1" class="red">20</div><div style="font-size:44px;font-weight:700">días de galería privada</div>', 820))]
    parts = [cover("Privacidad y control", 'Tu evento,<br><span class="red">tus reglas</span>', "", v_list([("ok", t.replace("<br>", " "), False) for t, _, _ in pr], top=700), 1500)]
    for k, (t, d, v) in enumerate(pr, 1):
        parts.append(slide(f"regla-{k}", "", t, d, v, num=k))
    parts.append(closing('Privado, sencillo<br><span class="red">y emocionante</span>', "Así es Revelao.<br><strong>Pruébalo gratis.</strong>", "Pruébalo gratis"))
    carousel("34-carrusel-privacidad-y-control", parts)

    # 35 ------------------------------------------------------------ suelta
    single("35-el-selfie-del-bano", "Momentos inéditos", 'El selfie del baño<br><span class="red">también cuenta</span>',
           "Las fotos que nunca te pasarían<br><strong>ahora salen en el revelado.</strong>",
           v_polar("mirror_round.jpg", "mirror_selfie.jpg", "bach_laugh.jpg", caption="📸 Subida por un invitado · 01:12"), "Ver más", h1cls="md")

    # 36 ------------------------------------------------------------ carrusel
    seal = lambda t, s: center_card(f'<div style="color:var(--primary)">{svgst(IC_LOCK, "width:110px;height:110px")}</div><div style="font-size:60px;font-weight:800;margin-top:20px">{t}</div><div style="font-size:32px;color:var(--muted);margin-top:12px">{s}</div>', 830)
    cap = [("Tus invitados<br>graban un vídeo", "Un mensaje para vosotros<br><strong>desde su móvil.</strong>", pic("speech_bride.jpg", 800, 720)),
           ("Queda guardado<br>y sellado", "Nadie lo ve.<br><strong>Ni siquiera vosotros.</strong>", seal("Cápsula sellada", "32 vídeos de vuestros invitados")),
           ("Elegís la fecha<br>de apertura", "Vuestro aniversario,<br><strong>dentro de 1, 5 o 10 años.</strong>", seal("Se abre el 26/09/2031", "Aniversario de boda")),
           ("Lo descubrís juntos,<br>años después", "Un regalo<br><strong>para vuestro yo del futuro.</strong>", pic("anniv_couple.jpg", 800, 720))]
    parts = [cover("Cápsula del tiempo", 'Un mensaje<br><span class="red">para el futuro</span>', "Vídeos de tus invitados que abriréis<br><strong>años después.</strong>",
                   f'<div class="photo abs" style="left:120px;right:120px;top:820px;height:640px"><img class="ph" src="{I}s12.jpg"><div class="lchip" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">{IC_LOCK}Se abre en 2031</div></div>', 1560)]
    for k, (t, d, v) in enumerate(cap, 1):
        parts.append(slide(f"capsula-{k}", "", t, d, v, num=k))
    parts.append(closing('Vuestra boda,<br><span class="red">también en 2031</span>', "Descubre la Cápsula del tiempo<br>en <strong>revelao.cam</strong>", "Ver más", "Cápsula del tiempo"))
    carousel("36-carrusel-capsula-del-tiempo", parts)

    # 37 ------------------------------------------------------------ suelta
    single("37-el-qr-en-la-invitacion", "Invitaciones", 'Pon tu QR<br><span class="red">en la invitación</span>',
           "Así tus invitados llegan a la boda<br><strong>sabiendo cómo compartir sus fotos.</strong>",
           f'<div class="photo abs" style="left:60px;right:60px;top:1000px;height:900px"><img class="ph" src="{I}invite_blank.jpg"></div>'
           + f'<div class="photo abs" style="left:50%;top:1110px;width:440px;height:620px;transform:translateX(-50%) rotate(-4deg);z-index:3"><img class="ph" src="{I}template-1.png"></div>',
           "Ver plantillas", checks=("Personalizable", "Descargable", "Imprimible"), h1cls="md")

    # 38 ------------------------------------------------------------ carrusel
    cp = [("Cada mesa tiene<br>un capitán", "Elige quién eres<br><strong>y lidera a tu mesa.</strong>", "capitanes-paso-capitan.png"),
          ("Retos para<br>toda la mesa", "Vídeos, fotos y preguntas<br><strong>que suman puntos.</strong>", "capitanes-paso-retos.png"),
          ("Los novios<br>reparten puntos", "Y comentan cada reto<br><strong>en directo.</strong>", "capitanes-paso-comentarios.png"),
          ("Ranking<br>en directo", "¿Qué mesa se llevará<br><strong>la gloria?</strong>", "capitanes-paso-ranking-v2.png")]
    fan3 = ('<div class="abs" style="left:0;right:0;top:760px;height:760px;display:flex;align-items:center;justify-content:center">'
            f'<img src="{I}capitanes-paso-retos.png" style="width:330px;border-radius:36px;box-shadow:0 30px 60px -30px rgba(0,0,0,.45);transform:rotate(-7deg) translateX(80px)">'
            f'<img src="{I}capitanes-paso-ranking-v2.png" style="width:400px;border-radius:42px;box-shadow:0 40px 70px -30px rgba(0,0,0,.5);position:relative;z-index:2">'
            f'<img src="{I}capitanes-paso-capitan.png" style="width:330px;border-radius:36px;box-shadow:0 30px 60px -30px rgba(0,0,0,.45);transform:rotate(7deg) translateX(-80px)"></div>')
    parts = [cover("Capitanes by Revelao", 'El juego que une<br><span class="red">a todas las mesas</span>', "Retos, puntos y ranking en directo.", fan3, 1620)]
    for k, (t, d, img) in enumerate(cp, 1):
        parts.append(slide(f"capitanes-{k}", "", t, d, screen_card(img, 800, 500), num=k))
    parts.append(closing('Que empiece<br><span class="red">el juego</span>', "Descubre Capitanes<br>en <strong>revelao.cam</strong>", "Ver más", "Capitanes"))
    carousel("38-carrusel-capitanes", parts)

    # 39 ------------------------------------------------------------ suelta
    single("39-te-casas-en-2027", "Bodas 2027", '¿Te casas en 2027?<br><span class="red">Apunta esto</span>',
           "Un QR en cada mesa y todas las fotos<br>de tus invitados <strong>al día siguiente.</strong>",
           v_fan("Plantilla3.png", "sparkler_kiss.jpg", "s13.jpg"), "Pruébalo gratis", h1cls="md")

    # 40 ------------------------------------------------------------ carrusel
    an = [("En el discurso<br>de bienvenida", "speech_mic.jpg"), ("Que lo diga<br>el DJ", "disco2.jpg"),
          ("En la pantalla<br>del salón", "Plantilla4.png"), ("En la invitación", "invite.jpg"), ("En el grupo de la boda", "phone_friends.jpg")]
    parts = [cover("Guía", 'Cómo anunciar<br><span class="red">el QR en tu boda</span>', "5 momentos perfectos.",
                   v_fan("speech_mic.jpg", "disco.jpg", "invite.jpg", top=800), 1640)]
    for k, (t, p) in enumerate(an, 1):
        parts.append(slide(f"anuncio-{k}", "", t, "", pic(p, 640, 860), num=k))
    parts.append(closing('Anúncialo<br><span class="red">y deja que fluya</span>', "Tus invitados harán el resto.<br><strong>Pruébalo gratis.</strong>", "Pruébalo gratis"))
    carousel("40-carrusel-como-anunciar-el-qr", parts)

    # 41 ------------------------------------------------------------ suelta
    single("41-graduaciones", "Graduaciones", 'Tu graduación,<br><span class="red">desde todos los móviles</span>',
           "Compañeros, familia y amigos<br><strong>en una misma galería.</strong>",
           v_fan("grad_blow.jpg", "grad_throw.jpg", "grad_hug.jpg"), "Ver más", h1cls="sm")

    # 42 ------------------------------------------------------------ carrusel
    up = [("Fotos", "Del móvil de cada invitado<br><strong>a tu galería.</strong>", pic("s04.jpg", 800, 720)),
          ("Vídeos", "El baile, el discurso,<br><strong>la liada del final.</strong>", pic("sparkler_dance.jpg", 800, 720)),
          ("Mensajes de voz", "Anónimos<br><strong>y llenos de emoción.</strong>", v_audio_photo("granny_phone.jpg", "0:24", 51, 800, 680)),
          ("Desde la galería", "Sube también las que hiciste antes<br><strong>(desde el plan Plus).</strong>", pic("friends_selfie.jpg", 800, 720))]
    parts = [cover("Qué se puede subir", 'Mucho más<br><span class="red">que fotos</span>', "",
                   f'<div class="abs" style="left:80px;right:80px;top:700px;display:flex;gap:22px">'
                   + "".join(f'<div class="card" style="flex:1;padding:44px 10px;text-align:center"><i style="display:grid;place-items:center;width:110px;height:110px;border-radius:50%;background:#111;margin:0 auto 20px;color:#fff">{svgst(ic, "width:52px;height:52px")}</i><div style="font-size:32px;font-weight:700">{t}</div></div>'
                             for t, ic in [("Fotos", IC_PHOTO), ("Vídeos", IC_VIDEO), ("Audios", IC_MIC)]) + "</div>"
                   + v_fan("s04.jpg", "s06.jpg", "s11.jpg", top=1040, side=(300, 400), center=(360, 480), spread=250), 1600)]
    for k, (t, d, v) in enumerate(up, 1):
        parts.append(slide(f"formato-{k}", "", t, d, v, num=k, h1cls="md"))
    parts.append(closing('Fotos, vídeos<br><span class="red">y audios</span>', "Todo en un sitio.<br><strong>Todo al día siguiente.</strong>", "Prueba gratis"))
    carousel("42-carrusel-que-se-puede-subir", parts)

    # 43 ------------------------------------------------------------ suelta
    single("43-despedidas", "Despedidas", 'Lo que pasa<br>en la despedida…<br><span class="red">se revela mañana</span>', "",
           v_fan("bach_toast.jpg", "bach_girls.jpg", "bach_brides.jpg"), "Pruébalo gratis", h1cls="md")

    # 44 ------------------------------------------------------------ carrusel
    qr = [("Que se vea bien", "Tamaño generoso<br><strong>y a la altura de los ojos.</strong>", "Plantilla1.png"),
          ("Con buen contraste", "QR oscuro sobre fondo claro<br><strong>se lee a la primera.</strong>", "template-1.png"),
          ("Con una frase que invite", "“Escanéame y sube tus fotos”<br><strong>funciona mejor que un QR solo.</strong>", "Plantilla3.png"),
          ("Con buena luz", "En la barra o junto a una lámpara,<br><strong>nunca en un rincón oscuro.</strong>", "Plantilla2.png"),
          ("Pruébalo antes", "Escanéalo tú mismo<br><strong>antes de imprimir.</strong>", "phone_record.jpg")]
    parts = [cover("Consejos", 'Un QR que<br><span class="red">todos escanean</span>', "5 claves para que funcione.",
                   v_fan("Plantilla2.png", "template-1.png", "Plantilla3.png", top=800), 1640)]
    for k, (t, d, p) in enumerate(qr, 1):
        parts.append(slide(f"clave-{k}", "", t, d, pic(p, 800, 720), num=k))
    parts.append(closing('Tu QR,<br><span class="red">listo para imprimir</span>', "Elige plantilla y personalízala.<br><strong>O te la imprimimos.</strong>", "Ver plantillas", "Plantillas QR"))
    carousel("44-carrusel-un-qr-que-todos-escanean", parts)

    # 45 ------------------------------------------------------------ suelta
    single("45-quince-anos", "XV años", 'Tus XV, contados<br><span class="red">por todos tus invitados</span>',
           "Cada baile, cada sorpresa y cada brindis<br><strong>en una galería que se revela al día siguiente.</strong>",
           v_fan("quince_cake.jpg", "quince_girl.jpg", "friends_dance.jpg"), "Ver más", h1cls="sm")

    # 46 ------------------------------------------------------------ carrusel
    wall = "".join(strip(ps, r, .72) for ps, r in [(["s08.jpg", "s15.jpg", "s16.jpg", "bride_friends.jpg"], -4), (["s11.jpg", "friends_toast.jpg", "s06.jpg", "bach.jpg"], 3),
                                                  (["booth_girls.jpg", "booth_couple.jpg", "friends_selfie.jpg", "bach_laugh.jpg"], -2)])
    ps = [("Cada invitado hace<br>4 fotos", "Desde su móvil,<br><strong>como en un fotomatón.</strong>", f'<div class="beige abs" style="left:60px;right:60px;top:800px;height:720px;border-radius:36px;display:grid;place-items:center"><div style="position:relative">{strip(["booth_girls.jpg", "booth_couple.jpg", "friends_selfie.jpg", "bach_laugh.jpg"], -3, 1)}</div></div>'),
          ("Su tira,<br>al momento", "Lista para guardar<br><strong>y compartir.</strong>", pic("booth_couple.jpg", 800, 720)),
          ("Todas las tiras,<br>en un mural", "El mural de la boda<br><strong>se llena en directo.</strong>", f'<div class="beige abs" style="left:60px;right:60px;top:800px;height:720px;border-radius:36px;display:flex;align-items:center;justify-content:center;gap:10px"><div style="position:relative;display:flex;gap:0;margin:0 -40px">{wall}</div></div>')]
    parts = [cover("Photostrip by Revelao", 'El fotomatón<br><span class="red">en el móvil</span>', "Sin cabina, sin app y sin complicaciones.",
                   f'<div class="beige abs" style="left:60px;right:60px;top:760px;height:760px;border-radius:36px;display:flex;align-items:center;justify-content:center"><div style="position:relative;display:flex;gap:40px">{strip(["s08.jpg", "s15.jpg", "s16.jpg", "bride_friends.jpg"], -5)}{strip(["s11.jpg", "friends_toast.jpg", "s06.jpg", "bach.jpg"], 4)}</div></div>', 1600)]
    for k, (t, d, v) in enumerate(ps, 1):
        parts.append(slide(f"photostrip-{k}", "", t, d, v, num=k))
    parts.append(closing('Sonríe,<br><span class="red">4 veces</span>', "Descubre Photostrip<br>en <strong>revelao.cam</strong>", "Ver más", "Photostrip"))
    carousel("46-carrusel-photostrip", parts)

    # 47 ------------------------------------------------------------ suelta
    single("47-la-fiesta-empieza", "Fiestas", 'La fiesta empieza<br><span class="red">cuando escaneas</span>',
           "Fotos, vídeos y audios de toda la noche,<br><strong>revelados a la mañana siguiente.</strong>",
           v_mosaic(["disco.jpg", "friends_dance.jpg", "hands_up.jpg", "friends_bar.jpg", "disco2.jpg", "friends_laugh.jpg", "hands_up2.jpg", "friends_cocktail.jpg", "s09.jpg", "sparklers_night.jpg", "bach_girls.jpg", "s05.jpg", "friends_selfie.jpg", "disco.jpg", "s03.jpg"]),
           "Pruébalo gratis", h1cls="md")

    # 48 ------------------------------------------------------------ carrusel
    fq = [("¿Pueden subir fotos de la galería del móvil?", "Sí.", "Desde el <strong>plan Plus</strong>, durante<br>y después del evento.", pic("friends_selfie.jpg", 920, 560)),
          ("¿Funciona en iPhone y Android?", "Sí.", "Y en ordenador. Solo hace falta<br><strong>un navegador actualizado.</strong>", pic("phone_friends.jpg", 920, 560)),
          ("¿Qué pasa cuando se revela?", "Todo aparece.", "Ver, <strong>descargar, dar likes</strong><br>y compartir.", shot("how-step-reveal-new.png", 900, 120)),
          ("¿Hace falta internet?", "Sí.", "Para subir el contenido.<br><strong>Nada más.</strong>", pic("phone_record.jpg", 920, 560))]
    fcss = ".ans{margin-top:30px;font-size:100px;font-weight:800;color:var(--primary);letter-spacing:-.04em;line-height:1}"
    parts = [cover("Más preguntas", 'Más dudas,<br><span class="red">resueltas</span>', "",
                   v_list([("todo", q, False) for q, _, _, _ in fq], top=680).replace('class="todo"></i>', 'class="ok">?</i>'), 1560)]
    for k, (q, a, e, v) in enumerate(fq, 1):
        parts.append(slide(f"pregunta-{k}", "", q, "", f'<div class="abs" style="left:72px;right:72px;top:{540 if len(q) < 30 else 620}px"><div class="ans">{a}</div><p class="sub" style="margin:22px 0 0;max-width:none">{e}</p></div>' + v, h1cls="sm"))
    parts.append(closing('¿Alguna duda<br><span class="red">más?</span>', "Escríbenos y te respondemos.<br><strong>O pruébalo gratis.</strong>", "Prueba gratis", "Estamos aquí"))
    carousel("48-carrusel-mas-preguntas", parts, fcss)

    # 49 ------------------------------------------------------------ suelta
    single("49-el-corte-de-la-tarta", "Momentos clave", 'El corte de la tarta<br><span class="red">desde 20 ángulos</span>',
           "Cada invitado lo vio a su manera.<br><strong>Ahora lo verás todo.</strong>",
           v_mosaic(["cake_cut.jpg", "cake_slice.jpg", "s04.jpg", "cake_cut2.jpg", "s07.jpg", "s14.jpg", "cake_cut.jpg", "friends_cocktail.jpg", "cake_slice.jpg", "s18.jpg", "cake_cut2.jpg", "s16.jpg", "s08.jpg", "cake_cut.jpg", "s13.jpg"]),
           "Ver más", h1cls="sm")

    # 50 ------------------------------------------------------------ carrusel
    why = [("Sin app", "Escanear y subir.<br><strong>Nada más.</strong>", v_phone_photo(app_upload("s10.jpg"), "Plantilla1.png", 790)),
           ("100% anónimo", "Nadie sabe quién subió qué.<br><strong>Libertad total.</strong>", v_polar("mirror_selfie.jpg", "bach_laugh.jpg", "booth_girls.jpg", 830, caption="🤫 anónimo")),
           ("El revelado", "Todo oculto hasta el día siguiente.<br><strong>Pura emoción.</strong>", v_polar("s03.jpg", "s02.jpg", "s09.jpg", 830, blur=True, chip=f"{IC_LOCK}Mañana · 12:00")),
           ("Alta calidad", "Descarga todo<br><strong>tal y como se hizo.</strong>", pic("s13.jpg", 800, 720)),
           ("Desde 0€", "Pruébalo gratis<br><strong>sin registro ni tarjeta.</strong>", center_card('<div style="font-size:220px;font-weight:800;letter-spacing:-.06em;line-height:1" class="red">0€</div><div style="font-size:44px;font-weight:700">para probarlo</div>', 820))]
    parts = [cover("Resumen", '5 razones para<br><span class="red">usar Revelao</span>', "", v_list([("ok", t, False) for t, _, _ in why], top=680), 1540)]
    for k, (t, d, v) in enumerate(why, 1):
        parts.append(slide(f"razon-{k}", "", t, d, v, num=k, h1cls="md"))
    parts.append(closing('¿Empezamos?<br><span class="red">Es gratis</span>', "Crea tu evento en 30 segundos.<br><strong>Sin registro y sin tarjeta.</strong>", "Prueba gratis", "Pruébalo hoy"))
    carousel("50-carrusel-5-razones", parts)


if __name__ == "__main__":
    build()
    print("HTML generado")
