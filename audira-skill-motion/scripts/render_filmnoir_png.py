"""
Script to render high-fidelity 3D PNG still of FILMNOIR (Style 32).
Chiaroscuro Monochrome, Wet Pavement, Venetian Blinds Shadows, Detective Silhouette, Tungsten Lamppost.
"""
import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

WIDTH, HEIGHT = 1080, 1920

# 1. Base Pitch Black Void Canvas
img = Image.new("RGBA", (WIDTH, HEIGHT), (6, 7, 9, 255))
draw = ImageDraw.Draw(img)

# Radial spotlight illumination from streetlight (X=780, Y=560)
bg_np = np.zeros((HEIGHT, WIDTH, 4), dtype=np.float32)
y_indices, x_indices = np.indices((HEIGHT, WIDTH))
lamp_x, lamp_y = 780, 560
dist_lamp = np.sqrt((x_indices - lamp_x) ** 2 + (y_indices - lamp_y) ** 2)
falloff = np.exp(-dist_lamp / 420.0)

# Warm tungsten ambient glow on brick wall behind
r_bg = 6 + falloff * 42
g_bg = 7 + falloff * 36
b_bg = 9 + falloff * 24

bg_np[..., 0] = r_bg
bg_np[..., 1] = g_bg
bg_np[..., 2] = b_bg
bg_np[..., 3] = 255.0
img = Image.fromarray(bg_np.astype(np.uint8), "RGBA")
draw = ImageDraw.Draw(img)

# 2. Brick Alley Wall (Left Side, High-Contrast Masonry)
brick_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
b_draw = ImageDraw.Draw(brick_layer)
wall_poly = [(0, 200), (480, 340), (480, 1260), (0, 1360)]
b_draw.polygon(wall_poly, fill=(28, 31, 38, 255))

# Mortar brick lines
for y_b in range(240, 1340, 36):
    b_draw.line([(0, y_b), (480, y_b - 60)], fill=(15, 17, 21, 200), width=2)
for x_b in range(40, 480, 50):
    b_draw.line([(x_b, 280), (x_b, 1300)], fill=(15, 17, 21, 140), width=1)

img = Image.alpha_composite(img, brick_layer)
draw = ImageDraw.Draw(img)

# 3. Venetian Blinds Slanted Shadow Gobo Bars Across Brick Wall
gobo_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
g_draw = ImageDraw.Draw(gobo_layer)
for y_gobo in range(260, 1200, 75):
    # Slanted black shadow band
    g_draw.polygon([(0, y_gobo), (490, y_gobo - 50), (490, y_gobo - 15), (0, y_gobo + 35)], fill=(0, 0, 0, 230))

gobo_blur = gobo_layer.filter(ImageFilter.GaussianBlur(6))
img = Image.alpha_composite(img, gobo_blur)
draw = ImageDraw.Draw(img)

# 4. Wet Reflective Asphalt Ground Plane (Pavement)
street_y = 1240
# Base wet pavement
draw.rectangle([0, street_y, WIDTH, HEIGHT], fill=(16, 19, 24, 255))

# Wet rain sheen & specular reflection of lamp
sheen_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
sh_draw = ImageDraw.Draw(sheen_layer)
# Long vertical streak reflection of street lamp
sh_draw.polygon([(720, street_y), (840, street_y), (880, HEIGHT), (680, HEIGHT)], fill=(255, 227, 160, 65))
# Rain Puddle with selective red neon reflection
sh_draw.ellipse([420, 1380, 680, 1500], fill=(40, 47, 59, 210), outline=(255, 43, 67, 180), width=3)
# Neon red reflection streak inside puddle
sh_draw.ellipse([480, 1410, 620, 1470], fill=(255, 43, 67, 95))
# Tungsten specular highlight in puddle center
sh_draw.ellipse([530, 1425, 570, 1455], fill=(255, 245, 210, 190))

sheen_blur = sheen_layer.filter(ImageFilter.GaussianBlur(8))
img = Image.alpha_composite(img, sheen_blur)
draw = ImageDraw.Draw(img)

# Pavement perspective lines
for i in range(-8, 9):
    draw.line([(540 + i * 40, street_y), (540 + i * 160, HEIGHT)], fill=(25, 30, 38, 90), width=1)

# 5. Vintage Cast-Iron Lamppost with Volumetric Light Beam
# Cast-iron post
draw.rectangle([lamp_x - 12, lamp_y, lamp_x + 12, street_y], fill=(10, 12, 15, 255))
# Base ornamental molding
draw.rounded_rectangle([lamp_x - 30, street_y - 80, lamp_x + 30, street_y], radius=8, fill=(14, 16, 20, 255))
# Lantern bracket
draw.arc([lamp_x - 120, lamp_y - 80, lamp_x + 40, lamp_y + 80], start=180, end=320, fill=(12, 14, 18, 255), width=10)
# Lantern hood
draw.polygon([(lamp_x - 110, lamp_y - 50), (lamp_x - 30, lamp_y - 50), (lamp_x - 70, lamp_y - 95)], fill=(12, 14, 18, 255))

# Volumetric Light Cone Layer
vol_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
v_draw = ImageDraw.Draw(vol_layer)
cone_poly = [(lamp_x - 70, lamp_y - 45), (lamp_x - 360, street_y + 120), (lamp_x + 220, street_y + 120)]
v_draw.polygon(cone_poly, fill=(255, 227, 160, 42))

# Intense glowing bulb
v_draw.ellipse([lamp_x - 90, lamp_y - 45, lamp_x - 50, lamp_y - 5], fill=(255, 235, 175, 255))
v_draw.ellipse([lamp_x - 80, lamp_y - 35, lamp_x - 60, lamp_y - 15], fill=(255, 255, 245, 255))

vol_glow = vol_layer.filter(ImageFilter.GaussianBlur(18))
vol_glow_wide = vol_layer.filter(ImageFilter.GaussianBlur(45))
img = Image.alpha_composite(img, vol_glow_wide)
img = Image.alpha_composite(img, vol_glow)
img = Image.alpha_composite(img, vol_layer)
draw = ImageDraw.Draw(img)

# 6. Brooding Detective Silhouette (Center-Left in Alley)
det_cx, det_cy = 380, 1020

# Contact Shadow on wet street
d_shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
ds_draw = ImageDraw.Draw(d_shadow)
ds_draw.ellipse([det_cx - 160, street_y - 20, det_cx + 160, street_y + 60], fill=(0, 0, 0, 240))
d_shadow = d_shadow.filter(ImageFilter.GaussianBlur(10))
img = Image.alpha_composite(img, d_shadow)
draw = ImageDraw.Draw(img)

# Trench Coat Body (Pitch Black Silhouette)
trench_poly = [(det_cx - 85, det_cy - 120), (det_cx + 85, det_cy - 120), (det_cx + 140, street_y - 40), (det_cx - 140, street_y - 40)]
draw.polygon(trench_poly, fill=(8, 10, 13, 255))

# Upturned Collar
collar_poly = [(det_cx - 75, det_cy - 130), (det_cx - 95, det_cy - 210), (det_cx - 20, det_cy - 140), (det_cx + 60, det_cy - 140), (det_cx + 95, det_cy - 210), (det_cx + 75, det_cy - 130)]
draw.polygon(collar_poly, fill=(12, 15, 20, 255))

# Cold Moonlight Rim Light on Right Shoulder (Separation Rim)
draw.line([(det_cx + 85, det_cy - 120), (det_cx + 140, street_y - 40)], fill=(163, 191, 219, 190), width=4)
draw.line([(det_cx + 75, det_cy - 130), (det_cx + 95, det_cy - 210)], fill=(163, 191, 219, 210), width=4)

# Fedora Hat
hat_y = det_cy - 220
# Slanted Brim
draw.polygon([(det_cx - 150, hat_y + 15), (det_cx + 130, hat_y - 25), (det_cx + 120, hat_y - 12), (det_cx - 140, hat_y + 28)], fill=(6, 8, 11, 255))
# Hat Crown (Creased)
crown_poly = [(det_cx - 75, hat_y + 10), (det_cx - 60, hat_y - 80), (det_cx - 10, hat_y - 70), (det_cx + 40, hat_y - 95), (det_cx + 60, hat_y - 15)]
draw.polygon(crown_poly, fill=(8, 10, 13, 255))
# Crown Rim Highlight from streetlight
draw.line([(det_cx - 10, hat_y - 70), (det_cx + 40, hat_y - 95), (det_cx + 60, hat_y - 15)], fill=(255, 227, 160, 160), width=3)

# Glowing Cigarette Ember in the dark shadow
ember_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
em_draw = ImageDraw.Draw(ember_layer)
em_x, em_y = det_cx + 25, det_cy - 165
em_draw.ellipse([em_x - 5, em_y - 5, em_x + 5, em_y + 5], fill=(255, 69, 0, 255))
em_draw.ellipse([em_x - 2, em_y - 2, em_x + 2, em_y + 2], fill=(255, 210, 150, 255))
em_glow = ember_layer.filter(ImageFilter.GaussianBlur(12))
img = Image.alpha_composite(img, em_glow)
img = Image.alpha_composite(img, ember_layer)
draw = ImageDraw.Draw(img)

# Cigarette Smoke Curling Upward
smoke_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
sm_draw = ImageDraw.Draw(smoke_layer)
smoke_poly = [(em_x, em_y), (em_x + 20, em_y - 60), (em_x - 10, em_y - 120), (em_x + 35, em_y - 190), (em_x + 15, em_y - 260)]
for i in range(len(smoke_poly) - 1):
    sm_draw.line([smoke_poly[i], smoke_poly[i+1]], fill=(220, 226, 235, 75), width=14)
smoke_blur = smoke_layer.filter(ImageFilter.GaussianBlur(16))
img = Image.alpha_composite(img, smoke_blur)
draw = ImageDraw.Draw(img)

# 7. Editorial Case File Header & Typographic Overlay
header_y = 120
try:
    f_kicker = ImageFont.truetype("courbd.ttf", 16)
    f_hero = ImageFont.truetype("timesbd.ttf", 38)
    f_badge = ImageFont.truetype("courbd.ttf", 15)
    f_quote = ImageFont.truetype("timesi.ttf", 20)
    f_sub = ImageFont.truetype("cour.ttf", 14)
except:
    f_kicker = f_hero = f_badge = f_quote = f_sub = None

draw.text((64, header_y), "● CASE FILE // 1947", fill=(255, 227, 160, 255), font=f_kicker)
draw.text((64, header_y + 30), "MIDNIGHT SHADOWS", fill=(241, 245, 249, 255), font=f_hero)

# Badge
draw.rectangle([WIDTH - 280, header_y + 6, WIDTH - 64, header_y + 54], fill=(10, 12, 16, 220), outline=(255, 227, 160, 180), width=2)
draw.text((WIDTH - 260, header_y + 18), "CHIAROSCURO // 32", fill=(255, 227, 160, 255), font=f_badge)

# Bottom Quote Card
quote_y = 1580
draw.rectangle([64, quote_y, WIDTH - 64, quote_y + 140], fill=(8, 10, 13, 230), outline=(255, 227, 160, 120), width=2)
draw.rectangle([64, quote_y, 72, quote_y + 140], fill=(255, 227, 160, 255)) # Accent bar

draw.text((96, quote_y + 24), "\"The city was drowning in rain, and every shadow had a story.\"", fill=(248, 250, 252, 255), font=f_quote)
draw.text((96, quote_y + 70), "CLASSIC 1940S FILM NOIR // VENETIAN BLINDS // REFLECTIVE ASPHALT", fill=(148, 163, 184, 255), font=f_sub)

# Closing Credit
try:
    f_credit = ImageFont.truetype("timesbd.ttf", 20)
    f_credit_sub = ImageFont.truetype("courbd.ttf", 16)
except:
    f_credit = f_credit_sub = None

draw.text((WIDTH // 2 - 110, 1820), "Creator: AUDIRA", fill=(255, 255, 255, 180), font=f_credit)
draw.text((WIDTH // 2 - 130, 1850), "Created by: Agus Dwi R.", fill=(255, 227, 160, 220), font=f_credit_sub)

# Ensure output directory exists
out_dir = "references/quality-bar"
os.makedirs(out_dir, exist_ok=True)
output_path = os.path.join(out_dir, "filmnoir.png")

# Also save showcase copy
os.makedirs("out", exist_ok=True)
out_copy = os.path.join("out", "filmnoir-showcase.png")

img.save(output_path, "PNG", optimize=True)
img.save(out_copy, "PNG", optimize=True)

print(f"[SUCCESS] High-fidelity PNG generated at: {output_path}")
print(f"[SUCCESS] Showcase copy saved at: {out_copy}")

