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

def draw_hud_frame(draw, tag, title, badge, quote, meta, dark_text=False, accent=(255, 190, 85)):
    f_tag = get_font(22, bold=True)
    f_title = get_font(54, bold=True)
    f_badge = get_font(22, bold=True)
    f_quote = get_font(28, bold=True)
    f_meta = get_font(20, bold=False)

    txt_col = (37, 33, 74) if dark_text else (236, 239, 244)
    draw.text((68, 86), tag, fill=accent, font=f_tag)
    draw.text((68, 122), title, fill=txt_col, font=f_title)

    # Badge box top right
    bx1, by1, bx2, by2 = W - 340, 86, W - 68, 146
    draw.rectangle([bx1, by1, bx2, by2], fill=(15, 18, 24), outline=accent, width=3)
    draw.text((bx1 + 24, by1 + 16), badge, fill=(255, 255, 255), font=f_badge)

    # Bottom quote panel
    qx1, qy1, qx2, qy2 = 68, H - 310, W - 68, H - 140
    draw.rectangle([qx1, qy1, qx2, qy2], fill=(12, 14, 18))
    draw.rectangle([qx1, qy1, qx1 + 8, qy2], fill=accent)
    draw.text((qx1 + 32, qy1 + 26), quote[:58], fill=(248, 250, 252), font=f_quote)
    if len(quote) > 58:
        draw.text((qx1 + 32, qy1 + 64), quote[58:], fill=(248, 250, 252), font=f_quote)
    draw.text((qx1 + 32, qy2 - 42), meta, fill=accent, font=f_meta)

# 1. FLUIDFORGE (#34)
def render_fluidforge():
    img = Image.new("RGB", (W, H), (5, 6, 10))
    draw = ImageDraw.Draw(img)
    cx, cy = W // 2, H // 2 - 40
    # Iridescent rings
    for r, col in [(390, (0, 240, 255)), (320, (255, 0, 122)), (250, (112, 0, 255))]:
        draw.ellipse([cx - r, cy - int(r * 0.55), cx + r, cy + int(r * 0.55)], outline=col, width=8)
    # Central liquid metal sphere with specular highlights
    R = 175
    for i in range(R, 0, -2):
        t = 1 - (i / R)
        c = int(40 + 205 * (t ** 1.6))
        draw.ellipse([cx - i, cy - i, cx + i, cy + i], fill=(min(255, c), min(255, int(c * 1.02)), min(255, int(c * 1.08))))
    # Orbiting droplets
    for k in range(8):
        ang = k * math.pi / 4
        dx = int(cx + math.cos(ang) * 285)
        dy = int(cy + math.sin(ang) * 180)
        col = (0, 240, 255) if k % 2 == 0 else (255, 0, 122)
        draw.ellipse([dx - 32, dy - 32, dx + 32, dy + 32], fill=col, outline=(255, 255, 255), width=3)
    draw_hud_frame(
        draw,
        "● CHROMATIC FERROFLUID // ZERO-G",
        "LIQUID METAL HARMONICS",
        "FLUIDFORGE // 34",
        '"Surface tension binds liquid chrome into weightless acoustic geometry."',
        "IRIDESCENT CHROME // 60FPS HARMONIC",
        accent=(0, 240, 255),
    )
    img.save(os.path.join(OUT_DIR, "fluidforge.png"))

# 2. HD2D (#35)
def render_hd2d():
    img = Image.new("RGB", (W, H), (11, 14, 20))
    draw = ImageDraw.Draw(img)
    # Cobblestone diorama stage
    draw.polygon([(140, 1180), (940, 1180), (1020, 1360), (60, 1360)], fill=(42, 50, 66), outline=(229, 169, 60), width=3)
    # Timber buildings left & right
    draw.rectangle([160, 680, 440, 1180], fill=(30, 36, 51), outline=(61, 41, 26), width=8)
    draw.rectangle([230, 820, 350, 960], fill=(229, 169, 60))
    draw.rectangle([640, 640, 920, 1180], fill=(24, 32, 47), outline=(61, 41, 26), width=8)
    draw.rectangle([720, 790, 840, 940], fill=(229, 169, 60))
    # Warm 2400K lantern glow aura
    lx, ly = 480, 860
    for r in range(140, 10, -10):
        c = int(229 * (1 - r / 150))
        draw.ellipse([lx - r, ly - r, lx + r, ly + r], outline=(c, int(c * 0.7), 20), width=4)
    # Pixel art hero billboard in center
    px, py = 540, 1040
    draw.rectangle([px - 48, py - 120, px + 48, py + 40], fill=(31, 58, 96), outline=(255, 255, 255), width=4)
    draw.rectangle([px - 64, py - 140, px + 72, py - 105], fill=(255, 74, 61))  # Scarlet pixel scarf
    draw.rectangle([px - 40, py - 210, px + 40, py - 140], fill=(243, 198, 165))
    draw_hud_frame(
        draw,
        "● TILT-SHIFT PIXEL DIORAMA // 2400K LANTERNS",
        "EMBERGATE CROSSING",
        "HD-2D // 35",
        '"Crisp 16-bit pixel sprites cast real 3D contact shadows on cobblestones."',
        "8FPS SPRITE STEP // 60FPS 3D CAMERA",
        accent=(229, 169, 60),
    )
    img.save(os.path.join(OUT_DIR, "hd2d.png"))

# 3. MEMPHISDIORAMA (#36)
def render_memphisdiorama():
    img = Image.new("RGB", (W, H), (255, 252, 246))
    draw = ImageDraw.Draw(img)
    # Hard cool-purple shadow
    draw.polygon([(240, 1180), (960, 1180), (1030, 1340), (310, 1340)], fill=(112, 88, 144))
    # White terrazzo plinth
    draw.polygon([(160, 1120), (880, 1120), (940, 1270), (100, 1270)], fill=(244, 239, 230), outline=(37, 33, 74), width=6)
    # Canary yellow pedestal
    draw.rectangle([240, 860, 480, 1120], fill=(255, 210, 52), outline=(37, 33, 74), width=6)
    # Coral pink arch columns
    draw.rectangle([560, 700, 650, 1120], fill=(255, 90, 95), outline=(37, 33, 74), width=6)
    draw.rectangle([760, 700, 850, 1120], fill=(255, 90, 95), outline=(37, 33, 74), width=6)
    draw.rectangle([530, 620, 880, 700], fill=(37, 33, 74))
    # Sky blue sphere & mint ring
    draw.ellipse([640, 880, 770, 1010], fill=(92, 200, 255), outline=(37, 33, 74), width=6)
    draw.ellipse([260, 620, 460, 820], outline=(94, 223, 176), width=24)
    draw_hud_frame(
        draw,
        "● MILANO 1981 // SOTTSASS TABLETOP",
        "TERRAZZO TOTEM",
        "MEMPHIS // 36",
        '"Bold geometric primitives cast crisp violet shadows across archival paper."',
        "FLAT SHADED // ZERO DOF BLUR",
        dark_text=True,
        accent=(255, 90, 95),
    )
    img.save(os.path.join(OUT_DIR, "memphisdiorama.png"))

# 4. DATAPHYSICAL (#37)
def render_dataphysical():
    img = Image.new("RGB", (W, H), (28, 29, 32))
    draw = ImageDraw.Draw(img)
    # Walnut plinth base
    draw.rectangle([140, 1180, 940, 1300], fill=(42, 27, 20), outline=(210, 176, 122), width=4)
    # Columns
    heights = [220, 310, 400, 280, 460, 680, 350]
    for idx, h in enumerate(heights):
        x1 = 180 + idx * 102
        x2 = x1 + 78
        y2 = 1180
        y1 = y2 - h
        col = (212, 82, 28) if idx == 5 else (200, 204, 209)
        draw.rectangle([x1, y1, x2, y2], fill=col, outline=(255, 255, 255), width=2)
        draw.rectangle([x1, y1 - 14, x2, y1], fill=(210, 176, 122))
    # Teal acrylic benchmark bar
    draw.rectangle([150, 740, 930, 764], fill=(159, 211, 214), outline=(255, 255, 255), width=2)
    draw_hud_frame(
        draw,
        "● SCULPTURAL TELEMETRY // PHYSICAL METRICS",
        "Q4 CAPEX MONOLITH",
        "DATA PHYSICAL // 37",
        '"Every plate is a countable unit machined into physical brass and acrylic."',
        "WALNUT & BRUSHED ALUMINUM // MACRO STUDIO",
        accent=(212, 82, 28),
    )
    img.save(os.path.join(OUT_DIR, "dataphysical.png"))

# 5. SATELLITEBRIEFING (#38)
def render_satellitebriefing():
    img = Image.new("RGB", (W, H), (7, 11, 14))
    draw = ImageDraw.Draw(img)
    # Deep ocean & analyst grey landmass
    draw.rectangle([80, 360, 1000, 1460], fill=(16, 42, 69), outline=(46, 112, 206), width=3)
    draw.polygon([(120, 480), (680, 520), (620, 980), (140, 920)], fill=(74, 83, 88), outline=(242, 245, 246), width=2)
    draw.polygon([(580, 1040), (940, 980), (920, 1380), (620, 1340)], fill=(62, 70, 75), outline=(242, 245, 246), width=2)
    # Grid lines
    for g in range(200, 1000, 160):
        draw.line([(g, 360), (g, 1460)], fill=(46, 112, 206), width=1)
    for g in range(480, 1460, 160):
        draw.line([(80, g), (1000, g)], fill=(46, 112, 206), width=1)
    # Amber OSINT target reticles
    for tx, ty, lbl in [(420, 740, "VESSEL-A01 // 294M"), (760, 1160, "BERTH-04 // ACTIVE")]:
        draw.rectangle([tx - 55, ty - 55, tx + 55, ty + 55], outline=(255, 190, 85), width=4)
        draw.line([(tx, ty - 55), (tx, ty - 140)], fill=(255, 190, 85), width=3)
        draw.text((tx + 12, ty - 145), lbl, fill=(255, 190, 85), font=get_font(20, bold=True))
    draw_hud_frame(
        draw,
        "● SENTINEL-2 OPTICAL // 0.5M GSD NADIR",
        "STRAIT RECONNAISSANCE",
        "OSINT GEO // 38",
        '"Desaturated satellite terrain isolates amber target reticles and vectors."',
        "LAT 01°17'N LON 103°51'E // ELEV 420KM",
        accent=(255, 190, 85),
    )
    img.save(os.path.join(OUT_DIR, "satellitebriefing.png"))

# 6. BACKROOMS (#39)
def render_backrooms():
    img = Image.new("RGB", (W, H), (10, 11, 9))
    draw = ImageDraw.Draw(img)
    # Ceiling & carpet perspective corridor
    draw.polygon([(0, 320), (W, 320), (780, 680), (300, 680)], fill=(200, 194, 168))
    draw.polygon([(0, 1480), (W, 1480), (780, 1120), (300, 1120)], fill=(140, 118, 60))
    # Yellow wallpaper corridor partitions
    draw.polygon([(0, 320), (300, 680), (300, 1120), (0, 1480)], fill=(213, 189, 102), outline=(77, 61, 38), width=4)
    draw.polygon([(W, 320), (780, 680), (780, 1120), (W, 1480)], fill=(198, 174, 88), outline=(77, 61, 38), width=4)
    draw.rectangle([300, 680, 780, 1120], fill=(165, 144, 72), outline=(77, 61, 38), width=4)
    # Dark inner doorway
    draw.rectangle([450, 760, 630, 1120], fill=(18, 16, 12))
    # Overhead fluorescent panels
    draw.polygon([(420, 420), (660, 420), (620, 500), (460, 500)], fill=(245, 242, 220))
    draw.polygon([(465, 560), (615, 560), (595, 610), (485, 610)], fill=(245, 242, 220))
    draw_hud_frame(
        draw,
        "● PLAY ▶ // SP 02:14:09 // SEP 14 1996",
        "LEVEL 0 THRESHOLD",
        "LIMINAL // 39",
        '"Six hundred million square miles of empty rooms and buzzing fluorescent tubes."',
        "VHS HI-8 CAMCORDER // 30FPS STEP",
        accent=(245, 242, 220),
    )
    img.save(os.path.join(OUT_DIR, "backrooms.png"))

# 7. VISUALINVESTIGATION (#40)
def render_visualinvestigation():
    img = Image.new("RGB", (W, H), (11, 12, 14))
    draw = ImageDraw.Draw(img)
    # Left Panel: Courtroom Architectural Plan with Named Speakers
    draw.rectangle([68, 340, 510, 1380], fill=(20, 22, 25), outline=(46, 50, 56), width=3)
    draw.text((96, 372), "DENAH RUANG SIDANG // POSISI SAKSI", fill=(236, 234, 228), font=get_font(20, bold=True))
    # Judge bench
    draw.rectangle([160, 460, 420, 550], fill=(56, 65, 82), outline=(236, 234, 228), width=2)
    draw.text((210, 492), "MAJELIS HAKIM", fill=(255, 255, 255), font=get_font(20, bold=True))
    # Prosecutor & Defense
    draw.rectangle([96, 680, 230, 880], fill=(38, 44, 54), outline=(160, 170, 185), width=2)
    draw.text((116, 765), "JAKSA", fill=(220, 225, 235), font=get_font(18, bold=True))
    draw.rectangle([350, 680, 484, 880], fill=(38, 44, 54), outline=(160, 170, 185), width=2)
    draw.text((365, 765), "KUASA HUKUM", fill=(220, 225, 235), font=get_font(16, bold=True))
    # Active Witness Podium (Evidence Red)
    draw.rectangle([215, 960, 365, 1110], fill=(255, 74, 46), outline=(255, 255, 255), width=4)
    draw.text((232, 1020), "SAKSI AHLI", fill=(255, 255, 255), font=get_font(20, bold=True))

    # Right Panel: Archival Document Scan with Red Highlighter Wipe
    draw.rectangle([550, 340, 1012, 1380], fill=(228, 224, 212), outline=(255, 74, 46), width=4)
    draw.text((585, 385), "BERITA ACARA PEMERIKSAAN // EX-A04", fill=(29, 29, 27), font=get_font(20, bold=True))
    for i, y in enumerate(range(470, 1260, 95)):
        if i == 3:
            # Red highlighter wipe over key verbatim evidence line
            draw.rectangle([580, y - 12, 980, y + 48], fill=(255, 74, 46))
            draw.text((595, y + 4), "TERCATAT PUKUL 14:32:08 WIB", fill=(255, 255, 255), font=get_font(22, bold=True))
        else:
            draw.rectangle([585, y, 965, y + 24], fill=(45, 45, 42))
            draw.rectangle([585, y + 36, 860, y + 54], fill=(110, 110, 105))

    draw_hud_frame(
        draw,
        "● COURTROOM RECONSTRUCTION // 14:32:08 WIB",
        "EXHIBIT A-04: VERBATIM TRANSCRIPT",
        "FORENSIC // 40",
        '"SAKSI AHLI (DR. R. SURYADI): Metadata dokumen asli tercatat pukul 14:32 WIB."',
        "MUTE-TEST VERIFIED // WHO + WHAT + WHEN",
        accent=(255, 74, 46),
    )
    img.save(os.path.join(OUT_DIR, "visualinvestigation.png"))

if __name__ == "__main__":
    render_fluidforge()
    render_hd2d()
    render_memphisdiorama()
    render_dataphysical()
    render_satellitebriefing()
    render_backrooms()
    render_visualinvestigation()
    print("Successfully rendered 7 benchmark stills (1080x1920) to references/quality-bar/!")

