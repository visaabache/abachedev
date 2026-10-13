# Builds assets/disc-text-ar.svg: the Arabic phrase around the hero disc as vector outlines.
# Shaped with HarfBuzz (Cairo Bold), so the letters join the same way in every browser
# (WebKit breaks Arabic joining on SVG <textPath>).
#
# Run: pip install uharfbuzz fonttools brotli && python3 tools/disc-text-ar.py
# The Cairo Bold files (Arabic and Latin subsets from Google Fonts) are downloaded into tools/fonts/ on first run.
import math, os
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'assets', 'disc-text-ar.svg')
FONTS = {
    'cairo-ar.woff2': 'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hAc5a1biLD-H.woff2',
    'cairo-lat.woff2': 'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hAc5a1PiLA.woff2',
}
os.makedirs(os.path.join(HERE, 'fonts'), exist_ok=True)
for name, url in FONTS.items():
    dest = os.path.join(HERE, 'fonts', name)
    if not os.path.exists(dest):
        import urllib.request
        urllib.request.urlretrieve(url, dest)
SIZE = 32            # px in the 1000-unit viewBox, as the French text
R = 468              # radius of the text path
C = 500
REPS = 4
COLOR = '#4f46e5'

class Face:
    def __init__(self, path, wght=700):
        self.tt = TTFont(path)
        self.tt.flavor = None
        import io
        buf = io.BytesIO(); self.tt.save(buf); raw = buf.getvalue()
        self.face = hb.Face(raw)
        self.font = hb.Font(self.face)
        if 'fvar' in self.tt:
            self.font.set_variations({'wght': wght})
        self.upem = self.face.upem
        self.gs = self.tt.getGlyphSet(location={'wght': wght} if 'fvar' in self.tt else None)
        self.order = self.tt.getGlyphOrder()

    def shape(self, text, direction):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.direction = direction
        buf.script = 'Arab' if direction == 'rtl' else 'Latn'
        buf.language = 'ar' if direction == 'rtl' else 'en'
        hb.shape(self.font, buf, {'kern': True, 'liga': True})
        k = SIZE / self.upem
        # HarfBuzz returns right-to-left runs in visual (left to right) order
        return [dict(face=self, name=self.order[i.codepoint], adv=p.x_advance * k, dx=p.x_offset * k, dy=p.y_offset * k,
                     space=self.order[i.codepoint] in ('space', 'uni0020'))
                for i, p in zip(buf.glyph_infos, buf.glyph_positions)]

ar = Face(os.path.join(HERE, 'fonts', 'cairo-ar.woff2'))
lat = Face(os.path.join(HERE, 'fonts', 'cairo-lat.woff2'))

def gap(w):
    return dict(face=None, name=None, adv=w, dx=0, dy=0, space=True)

def star():
    # the ✦ separator (not in Cairo), drawn as a four-point star
    return dict(face=None, name='star', adv=SIZE * 0.78, dx=0, dy=0, space=False)

phrase = ar.shape('مواقع إلكترونية تجلب لك العملاء', 'rtl')
brand = lat.shape('AbacheDev', 'ltr')
sp = SIZE * 0.26
unit = phrase + [gap(sp), star(), gap(sp)] + brand + [gap(sp), star(), gap(sp)]
seq = unit * REPS
total = 2 * math.pi * R
natural = sum(g['adv'] for g in seq)
spaces = [g for g in seq if g['space']]
extra = (total - natural) / len(spaces)
assert extra > -2, (natural, total)
print(f'natural {natural:.0f} / {total:.0f}, extra per space {extra:.2f}')

def fmt(v):
    s = f'{v:.1f}'
    return s[:-2] if s.endswith('.0') else s

class RoundPen(SVGPathPen):
    def __init__(self, gs):
        super().__init__(gs, ntos=fmt)

pen = RoundPen(None)
s = 0.0
for g in unit:  # one quarter; the other three are rotated copies
    adv = g['adv'] + (extra if g['space'] else 0)
    mid = s + adv / 2
    phi = mid / R
    px, py = C - R * math.cos(phi), C - R * math.sin(phi)
    rot = phi - math.pi / 2          # tangent direction of the clockwise path
    cs, sn = math.cos(rot), math.sin(rot)
    if g['name'] == 'star':
        # star centred on the x-height, points in glyph-local coords (y up)
        h = SIZE * 0.36; w = SIZE * 0.3; cy = SIZE * 0.32; t = SIZE * 0.07
        pts = [(0, cy + h), (t, cy + t), (w, cy), (t, cy - t), (0, cy - h), (-t, cy - t), (-w, cy), (-t, cy + t)]
        def tr(x, y):
            y = -y
            return (px + x * cs - y * sn, py + x * sn + y * cs)
        q = [tr(*p) for p in pts]
        pen.moveTo(q[0]); [pen.lineTo(p) for p in q[1:]]; pen.closePath()
    elif g['face'] is not None and not g['space']:
        f = g['face']; k = SIZE / f.upem
        ox = -g['adv'] / 2 + g['dx']; oy = g['dy']
        # glyph units -> local (y up, origin at the advance start) -> page (y down) on the circle
        a, b = k * cs, k * sn
        c_, d = k * sn, -k * cs
        e = px + (ox * cs + oy * sn)
        ff = py + (ox * sn - oy * cs)
        tp = TransformPen(pen, (a, b, c_, d, e, ff))
        rec = DecomposingRecordingPen(f.gs)
        f.gs[g['name']].draw(rec)
        rec.replay(tp)
    s += adv

d = pen.getCommands()
uses = ''.join(f'<use href="#q" transform="rotate({a} 500 500)"/>' for a in (90, 180, 270))
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 1040 1040" width="1040" height="1040">'
       f'<g fill="{COLOR}"><path id="q" d="{d}"/>{uses}</g></svg>\n')
open(OUT, 'w').write(svg)
print(len(svg), 'bytes')
