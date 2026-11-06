import os
import math
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "references", "quality-bar")
os.makedirs(OUT_DIR, exist_ok=True)

W, H = 1080, 1920

def get_font(size, bold=False):
    for name in (["arialbd.ttf", "segoeuib.ttf", "consolab.ttf"] if bold else ["arial.ttf", "segoeui.ttf", "consola.ttf"]):
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            pass
    return ImageFont.load_default()

def draw_hud_frame(draw, tag, title, badge, quote, meta, accent=(255, 179, 0)):
    f_tag = get_font(22, bold=True)
    f_title = get_font(52, bold=True)
    f_badge = get_font(22, bold=True)
    f_quote = get_font(28, bold=True)
    f_meta = get_font(20, bold=False)

    txt_col = (236, 239, 244)
    draw.text((68, 86), tag, fill=accent, font=f_tag)
    draw.text((68, 122), title, fill=txt_col, font=f_title)

    # Badge box top right
    bx1, by1, bx2, by2 = W - 350, 86, W - 68, 146
    draw.rectangle([bx1, by1, bx2, by2], fill=(15, 18, 24), outline=accent, width=3)
    draw.text((bx1 + 24, by1 + 16), badge, fill=(255, 255, 255), font=f_badge)

    # Bottom quote panel
    qx1, qy1, qx2, qy2 = 68, H - 310, W - 68, H - 140
    draw.rectangle([qx1, qy1, qx2, qy2], fill=(12, 16, 22))
    draw.rectangle([qx1, qy1, qx1 + 8, qy2], fill=accent)
    draw.text((qx1 + 32, qy1 + 26), quote[:58], fill=(248, 250, 252), font=f_quote)
    if len(quote) > 58:
        draw.text((qx1 + 32, qy1 + 64), quote[58:], fill=(248, 250, 252), font=f_quote)
    draw.text((qx1 + 32, qy2 - 42), meta, fill=accent, font=f_meta)

# 1. TRADINGTERMINAL (#41)
def render_tradingterminal():
    img = Image.new("RGB", (W, H), (6, 8, 11))
    draw = ImageDraw.Draw(img)
    
    # Grid lines
    for y in range(360, 1460, 140):
        draw.line([(68, y), (W - 68, y)], fill=(255, 255, 255, 18), width=1)
    for x in range(120, W - 68, 140):
        draw.line([(x, 360), (x, 1460)], fill=(255, 255, 255, 18), width=1)
        
    # Order Book Depth Wall Background (Left green bids, Right red asks)
    draw.polygon([(68, 1260), (320, 1260), (380, 1140), (450, 960), (450, 1460), (68, 1460)], fill=(12, 45, 28))
    draw.polygon([(630, 960), (700, 1140), (760, 1260), (W - 68, 1260), (W - 68, 1460), (630, 1460)], fill=(45, 16, 22))

    # Candlesticks
    candles = [
        (160, 1080, 1160, 1020, 1210, True),
        (240, 1120, 1040, 980, 1170, False),
        (320, 1050, 1180, 990, 1230, True),
        (400, 1170, 1280, 1120, 1340, True),
        (480, 1260, 1200, 1150, 1310, False),
        (560, 1210, 1350, 1160, 1400, True),
        (640, 1330, 1280, 1240, 1370, False),
        (720, 1290, 1440, 1220, 1480, True),
    ]
    for x, o, c, l, h, is_bull in candles:
        col = (0, 230, 118) if is_bull else (255, 23, 68)
        # Wick
        draw.line([(x, 1600 - h), (x, 1600 - l)], fill=col, width=3)
        # Body
        by1, by2 = min(1600 - o, 1600 - c), max(1600 - o, 1600 - c)
        draw.rectangle([x - 22, by1, x + 22, by2], fill=col)

    # Hero Breakout Candle (Big Bullish Candle)
    hx = 820
    draw.line([(hx, 1600 - 1580), (hx, 1600 - 1380)], fill=(0, 230, 118), width=5)
    draw.rectangle([hx - 28, 1600 - 1540, hx + 28, 1600 - 1400], fill=(0, 230, 118))
    # Breakout price line laser
    draw.line([(68, 1600 - 1540), (W - 68, 1600 - 1540)], fill=(0, 229, 255), width=2)
    draw.rectangle([W - 280, 1600 - 1565, W - 68, 1600 - 1515], fill=(0, 229, 255))
    draw.text((W - 265, 1600 - 1558), "BTC $94,520 ▲", fill=(6, 8, 11), font=get_font(22, bold=True))

    draw_hud_frame(
        draw,
        "● BLOOMBERG CYBER // BTC/USDT 1D CHART",
        "BREAKOUT RESISTANCE $94,500",
        "TERMINAL // 41",
        '"Order book depth wall absorbs 1,420 BTC buy orders at key pivot."',
        "RSI 68.4 // EMA 20/50 CROSS // 20X LEVERAGE",
        accent=(0, 230, 118),
    )
    img.save(os.path.join(OUT_DIR, "tradingterminal.png"))

# 2. HISTORYMAP (#42)
def render_historymap():
    img = Image.new("RGB", (W, H), (27, 32, 40))
    draw = ImageDraw.Draw(img)
    
    # Basemap continental terrain
    draw.rectangle([68, 340, W - 68, 1460], fill=(46, 54, 66), outline=(212, 175, 55), width=3)
    
    # Curved Danube River Blue Ribbon
    river_points = [(100, 880), (280, 920), (460, 860), (680, 930), (880, 890), (1000, 940)]
    draw.line(river_points, fill=(37, 75, 119), width=18)
    
    # Roman Empire Territory Shading (Crimson Red)
    draw.polygon([(68, 920), (320, 940), (520, 900), (680, 960), (840, 920), (W - 68, 960), (W - 68, 1460), (68, 1460)], fill=(139, 30, 30))
    draw.text((120, 1120), "IMPERIVM ROMANVM", fill=(212, 175, 55), font=get_font(44, bold=True))
    
    # Dacia Territory (Gold / Ochre)
    draw.polygon([(260, 480), (740, 480), (820, 840), (220, 840)], fill=(75, 62, 42), outline=(197, 160, 89), width=3)
    draw.text((450, 620), "DACIA", fill=(197, 160, 89), font=get_font(42, bold=True))

    # Tactical Pincer Attack Arrows (Curved Red)
    draw.line([(320, 940), (420, 820), (480, 740)], fill=(255, 51, 68), width=16)
    draw.polygon([(470, 705), (515, 750), (455, 765)], fill=(255, 51, 68)) # North arrow head
    
    draw.line([(680, 950), (620, 830), (560, 750)], fill=(255, 51, 68), width=16)
    draw.polygon([(545, 715), (585, 765), (525, 755)], fill=(255, 51, 68)) # South arrow head

    draw_hud_frame(
        draw,
        "● FRONT TIMELINE // 117 AD - ROMAN EMPIRE",
        "IMPERIAL ADVANCE ACROSS DANUBE",
        "WAR HISTORY // 42",
        '"Legio XIII Gemina crosses the bridgehead in a classic pincer envelopment."',
        "DANUBE BASIN // PINCER ENCIRCLEMENT // YEAR 117 AD",
        accent=(255, 51, 68),
    )
    img.save(os.path.join(OUT_DIR, "historymap.png"))

# 3. ISLAMICDOCUMENTARY (#43)
def render_islamicdocumentary():
    img = Image.new("RGB", (W, H), (20, 32, 50))
    draw = ImageDraw.Draw(img)
    
    # Lapis Lazuli Arch Portal
    draw.rectangle([100, 340, W - 100, 1460], fill=(26, 54, 93), outline=(212, 175, 55), width=4)
    
    # Grand Islamic 8-Point Star (Rub el Hizb)
    cx, cy = W // 2, 780
    r1 = 220
    # Box 1
    draw.rectangle([cx - r1, cy - r1, cx + r1, cy + r1], outline=(212, 175, 55), width=8)
    # Box 2 (Rotated 45 deg represented as diamond)
    d = int(r1 * 1.414)
    draw.polygon([(cx, cy - d), (cx + d, cy), (cx, cy + d), (cx - d, cy)], outline=(212, 175, 55), width=8)
    # Inner emerald octagon
    draw.ellipse([cx - 110, cy - 110, cx + 110, cy + 110], fill=(15, 76, 58), outline=(243, 229, 171), width=4)
    
    # Mosque Skyline Silhouette (Golden Dome + Minarets)
    draw.chord([cx - 280, 1120, cx + 280, 1440], 180, 360, fill=(212, 175, 55)) # Dome
    # Left Minaret
    draw.rectangle([180, 920, 230, 1460], fill=(230, 213, 172))
    draw.polygon([(170, 920), (205, 820), (240, 920)], fill=(212, 175, 55))
    # Right Minaret
    draw.rectangle([W - 230, 920, W - 180, 1460], fill=(230, 213, 172))
    draw.polygon([(W - 240, 920), (W - 205, 820), (W - 170, 920)], fill=(212, 175, 55))

    draw_hud_frame(
        draw,
        "● BAITUL HIKMAH // BAGHDAD 830 M",
        "ERA KEEMASAN ILMU PENGETAHUAN",
        "FOLK ISLAM // 43",
        '"Di kota bundar Baghdad, naskah sains diterjemahkan ke dalam tinta emas."',
        "GEOMETRI GIRIH // ADAB VISUAL SHAHIH // OUD AKUSTIK",
        accent=(212, 175, 55),
    )
    img.save(os.path.join(OUT_DIR, "islamicdocumentary.png"))

if __name__ == "__main__":
    render_tradingterminal()
    render_historymap()
    render_islamicdocumentary()
    print("Successfully rendered 3 benchmark stills to references/quality-bar/!")

