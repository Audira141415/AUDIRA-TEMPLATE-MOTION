"""
Script to render high-fidelity 3D PNG still of TOYDIORAMA (Style 31).
Miniature Theatrical Stage, Stylized Blocky Toy Character, Matte Plastic & Soft Clay, Taped Paper Label.
"""
import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

WIDTH, HEIGHT = 1080, 1920

# 1. Base Cinematic Theatrical Background Canvas (Vignette)
img = Image.new("RGBA", (WIDTH, HEIGHT), (14, 20, 29, 255))
bg_np = np.zeros((HEIGHT, WIDTH, 4), dtype=np.float32)
y_indices, x_indices = np.indices((HEIGHT, WIDTH))
center_x, center_y = WIDTH / 2, HEIGHT * 0.44
dist_from_center = np.sqrt((x_indices - center_x) ** 2 + (y_indices - center_y) ** 2)
max_dist = np.sqrt(WIDTH**2 + HEIGHT**2) * 0.65
norm_dist = np.clip(dist_from_center / max_dist, 0.0, 1.0)

# Deep stage void gradient: #1A2433 center to #0A0D14 at vignette borders
r_bg = 24 * (1 - norm_dist * 0.65)
g_bg = 32 * (1 - norm_dist * 0.65)
b_bg = 46 * (1 - norm_dist * 0.65)

bg_np[..., 0] = r_bg
bg_np[..., 1] = g_bg
bg_np[..., 2] = b_bg
bg_np[..., 3] = 255.0
img = Image.fromarray(bg_np.astype(np.uint8), "RGBA")
draw = ImageDraw.Draw(img)

# 2. Scenery Flats (Cardboard / Clay cutouts held by beech dowels)
# Dowel rods
dowel_color = (200, 161, 101, 255)
# Dowel for distant mountain
draw.rectangle([WIDTH//2 - 8, 480, WIDTH//2 + 8, 1100], fill=dowel_color)
# Dowel for rolling hill
draw.rectangle([WIDTH//2 + 220, 560, WIDTH//2 + 234, 1100], fill=dowel_color)
# Dowel for sun disc
draw.rectangle([WIDTH//2 - 280, 320, WIDTH//2 - 268, 1100], fill=dowel_color)

# Distant Mountain flat cutout (Dark Pine Green #243E33)
m_poly = [(WIDTH//2 - 320, 920), (WIDTH//2, 490), (WIDTH//2 + 320, 920)]
draw.polygon(m_poly, fill=(36, 62, 51, 255))
draw.line(m_poly + [m_poly[0]], fill=(48, 82, 68, 255), width=3)

# Sun Disc flat cutout (Warm Ochre #F3C969)
draw.ellipse([WIDTH//2 - 330, 260, WIDTH//2 - 210, 380], fill=(243, 201, 105, 255), outline=(220, 175, 80, 255), width=3)

# Rolling Hill flat cutout (Moss Green #4A7C59)
draw.pieslice([WIDTH//2 + 80, 680, WIDTH//2 + 460, 1060], start=180, end=360, fill=(74, 124, 89, 255), outline=(90, 145, 105, 255), width=3)

# Soft Clay Cloud on wire (Bone White #F4EFEA)
cloud_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
c_draw = ImageDraw.Draw(cloud_layer)
# Hanging string
c_draw.line([(WIDTH//2 - 160, 0), (WIDTH//2 - 160, 390)], fill=(200, 200, 200, 120), width=2)
# Fluffy cloud puff spheres
c_draw.ellipse([WIDTH//2 - 240, 360, WIDTH//2 - 130, 460], fill=(244, 239, 234, 255))
c_draw.ellipse([WIDTH//2 - 170, 330, WIDTH//2 - 70, 440], fill=(250, 246, 242, 255))
c_draw.ellipse([WIDTH//2 - 110, 370, WIDTH//2 - 30, 450], fill=(238, 232, 226, 255))
cloud_layer = cloud_layer.filter(ImageFilter.GaussianBlur(1))
img = Image.alpha_composite(img, cloud_layer)
draw = ImageDraw.Draw(img)

# 3. Wooden Stage Platform & Floor Planks
stage_top_y = 1100
stage_bottom_y = 1420

# Perspective wooden planks
plank_colors = [
    (58, 41, 30, 255), (78, 54, 40, 255), (55, 38, 28, 255),
    (74, 52, 38, 255), (58, 41, 30, 255), (80, 56, 42, 255),
    (56, 39, 29, 255), (72, 50, 36, 255)
]

for i, col in enumerate(plank_colors):
    x_left_top = int(40 + i * (WIDTH - 80) / 8)
    x_right_top = int(40 + (i + 1) * (WIDTH - 80) / 8)
    x_left_bot = int(10 + i * (WIDTH - 20) / 8)
    x_right_bot = int(10 + (i + 1) * (WIDTH - 20) / 8)
    
    plank_poly = [(x_left_top, stage_top_y), (x_right_top, stage_top_y), (x_right_bot, stage_bottom_y), (x_left_bot, stage_bottom_y)]
    draw.polygon(plank_poly, fill=col)
    draw.line([(x_left_top, stage_top_y), (x_left_bot, stage_bottom_y)], fill=(30, 20, 14, 255), width=3)

# Stage Apron Front Trim
draw.rectangle([0, stage_bottom_y, WIDTH, stage_bottom_y + 90], fill=(34, 22, 15, 255))
draw.line([(0, stage_bottom_y), (WIDTH, stage_bottom_y)], fill=(200, 161, 101, 200), width=4)

# 4. Golden Glowing Footlights on Stage Apron Rim
foot_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
f_draw = ImageDraw.Draw(foot_layer)

footlight_xs = [120, 260, 400, 540, 680, 820, 960]
for fx in footlight_xs:
    # Wood base socket
    draw.rounded_rectangle([fx - 24, stage_bottom_y - 20, fx + 24, stage_bottom_y], radius=6, fill=(45, 30, 20, 255))
    # Glowing warm bulb
    f_draw.ellipse([fx - 18, stage_bottom_y - 48, fx + 18, stage_bottom_y - 12], fill=(255, 171, 64, 255))
    # Soft filament center
    f_draw.ellipse([fx - 8, stage_bottom_y - 40, fx + 8, stage_bottom_y - 22], fill=(255, 230, 180, 255))

foot_glow = foot_layer.filter(ImageFilter.GaussianBlur(16))
foot_glow_wide = foot_layer.filter(ImageFilter.GaussianBlur(38))
img = Image.alpha_composite(img, foot_glow_wide)
img = Image.alpha_composite(img, foot_glow)
img = Image.alpha_composite(img, foot_layer)
draw = ImageDraw.Draw(img)

# 5. Velvet Burgundy Side Teaser Drapes
draw.rectangle([0, 0, 90, 1300], fill=(110, 27, 36, 255))
draw.rectangle([WIDTH - 90, 0, WIDTH, 1300], fill=(110, 27, 36, 255))
# Pleat shadows
for dx in [25, 55, 80]:
    draw.line([(dx, 0), (dx, 1300)], fill=(70, 16, 22, 200), width=4)
for dx in [WIDTH - 80, WIDTH - 55, WIDTH - 25]:
    draw.line([(dx, 0), (dx, 1300)], fill=(70, 16, 22, 200), width=4)

# 6. Render 3D Stylized Blocky Toy Character with Soft Studio Lighting
char_cx = WIDTH // 2 + 10
char_cy = 920

# Contact Shadow on wooden floor
shadow_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
s_draw = ImageDraw.Draw(shadow_layer)
s_draw.ellipse([char_cx - 180, 1140, char_cx + 180, 1220], fill=(15, 10, 7, 210))
shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(14))
img = Image.alpha_composite(img, shadow_layer)
draw = ImageDraw.Draw(img)

# Chunky Boots & Pants
# Left Boot & Leg
draw.rounded_rectangle([char_cx - 95, 1050, char_cx - 30, 1130], radius=12, fill=(47, 80, 97, 255)) # Petrol pants
draw.rounded_rectangle([char_cx - 105, 1120, char_cx - 20, 1175], radius=14, fill=(27, 42, 50, 255), outline=(45, 65, 75, 255), width=2) # Boot
# Right Boot & Leg
draw.rounded_rectangle([char_cx + 30, 1050, char_cx + 95, 1130], radius=12, fill=(47, 80, 97, 255))
draw.rounded_rectangle([char_cx + 20, 1120, char_cx + 105, 1175], radius=14, fill=(27, 42, 50, 255), outline=(45, 65, 75, 255), width=2)

# Blocky Trapezoidal Torso (Terracotta Coral Sweater #D95D39)
# Soft PBR shading on sweater
torso_poly = [(char_cx - 120, 870), (char_cx + 120, 870), (char_cx + 100, 1060), (char_cx - 100, 1060)]
draw.polygon(torso_poly, fill=(217, 93, 57, 255))
# Collar Rim
draw.rounded_rectangle([char_cx - 55, 855, char_cx + 55, 885], radius=10, fill=(244, 239, 234, 255))

# Left Arm (Resting at side)
draw.rounded_rectangle([char_cx - 165, 880, char_cx - 115, 990], radius=22, fill=(217, 93, 57, 255))
draw.ellipse([char_cx - 160, 975, char_cx - 118, 1025], fill=(246, 200, 164, 255)) # Peach mitten hand

# Articulated Right Arm (Friendly Waving Gesture!)
# Upper Arm angled up
draw.line([(char_cx + 115, 890), (char_cx + 185, 830)], fill=(217, 93, 57, 255), width=42)
# Forearm pointing high
draw.line([(char_cx + 185, 830), (char_cx + 215, 740)], fill=(217, 93, 57, 255), width=38)
# Peach Mitten Hand waving
draw.ellipse([char_cx + 195, 705, char_cx + 245, 755], fill=(246, 200, 164, 255))
draw.ellipse([char_cx + 185, 725, char_cx + 210, 750], fill=(246, 200, 164, 255)) # Thumb

# Rounded Cube Head (Soft Peach Matte Vinyl #F6C8A4)
head_box = [char_cx - 135, 620, char_cx + 135, 865]
draw.rounded_rectangle(head_box, radius=48, fill=(246, 200, 164, 255))

# Matte Chocolate Hair Piece with Rounded Tufts
hair_top = [char_cx - 142, 605, char_cx + 142, 725]
draw.rounded_rectangle(hair_top, radius=46, fill=(56, 35, 21, 255))
# Chunky Hair Bangs
draw.rounded_rectangle([char_cx - 85, 695, char_cx + 40, 750], radius=18, fill=(56, 35, 21, 255))

# Shiny Bead Black Eyes
eye_w, eye_h = 24, 32
left_eye = (char_cx - 52, 775)
right_eye = (char_cx + 52, 775)

for ex, ey in [left_eye, right_eye]:
    draw.ellipse([ex - eye_w//2, ey - eye_h//2, ex + eye_w//2, ey + eye_h//2], fill=(17, 24, 39, 255))
    # Specular white catchlight
    draw.ellipse([ex - 4, ey - 10, ex + 4, ey - 2], fill=(255, 255, 255, 240))

# Soft Blushing Cheeks (Clay pink circle)
draw.ellipse([char_cx - 92, 800, char_cx - 56, 836], fill=(234, 140, 123, 200))
draw.ellipse([char_cx + 56, 800, char_cx + 92, 836], fill=(234, 140, 123, 200))

# Friendly Curved Smile
draw.arc([char_cx - 24, 805, char_cx + 24, 840], start=10, end=170, fill=(61, 40, 30, 255), width=5)

# 7. Interactive 3D Toy Prop: Golden Gift Box / Trophy on Table
prop_x = char_cx + 210
prop_y = 1040
draw.rectangle([prop_x - 45, prop_y - 45, prop_x + 45, prop_y + 45], fill=(229, 169, 60, 255), outline=(195, 140, 40, 255), width=3)
# Coral Ribbon Bands
draw.rectangle([prop_x - 10, prop_y - 45, prop_x + 10, prop_y + 45], fill=(217, 93, 57, 255))
draw.rectangle([prop_x - 45, prop_y - 10, prop_x + 45, prop_y + 10], fill=(217, 93, 57, 255))
# Top Bow
draw.ellipse([prop_x - 16, prop_y - 65, prop_x + 16, prop_y - 40], fill=(217, 93, 57, 255))

# 8. Pinned 3D Taped Paper Label
label_x, label_y = 100, 720
label_w, label_h = 360, 250

# Paper Card with subtle drop shadow
p_shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
ps_draw = ImageDraw.Draw(p_shadow)
ps_draw.rounded_rectangle([label_x + 12, label_y + 12, label_x + label_w + 12, label_y + label_h + 12], radius=12, fill=(0, 0, 0, 110))
p_shadow = p_shadow.filter(ImageFilter.GaussianBlur(10))
img = Image.alpha_composite(img, p_shadow)
draw = ImageDraw.Draw(img)

# Kraft Cream Paper Card
draw.rounded_rectangle([label_x, label_y, label_x + label_w, label_y + label_h], radius=10, fill=(250, 246, 238, 255), outline=(220, 210, 195, 255), width=2)

# Semi-translucent Washi Tape Strip across top edge
tape_poly = [(label_x + 110, label_y - 25), (label_x + 250, label_y - 20), (label_x + 248, label_y + 24), (label_x + 108, label_y + 18)]
draw.polygon(tape_poly, fill=(235, 205, 120, 215), outline=(210, 175, 90, 230))

# Paper Card Editorial Typography
try:
    f_tag = ImageFont.truetype("courbd.ttf", 16)
    f_title = ImageFont.truetype("arialbd.ttf", 26)
    f_body = ImageFont.truetype("arial.ttf", 17)
    f_stamp = ImageFont.truetype("courbd.ttf", 14)
except:
    f_tag = f_title = f_body = f_stamp = None

draw.text((label_x + 24, label_y + 36), "DIORAMA EXHIBIT // 01", fill=(217, 93, 57, 255), font=f_tag)
draw.text((label_x + 24, label_y + 68), "MINIATURE STAGE", fill=(24, 26, 27, 255), font=f_title)
draw.text((label_x + 24, label_y + 112), "• Stylized Blocky Geometry", fill=(60, 68, 76, 255), font=f_body)
draw.text((label_x + 24, label_y + 140), "• Matte Plastic & Soft Clay", fill=(60, 68, 76, 255), font=f_body)
draw.text((label_x + 24, label_y + 168), "• Static Macro Theatrical Rig", fill=(60, 68, 76, 255), font=f_body)
draw.text((label_x + 24, label_y + 208), "AUDIRA MOTION © 2026", fill=(140, 148, 156, 255), font=f_stamp)

# 9. Top Editorial Header Bar
header_y = 120
try:
    f_kicker = ImageFont.truetype("courbd.ttf", 16)
    f_hero = ImageFont.truetype("arialbd.ttf", 36)
    f_badge = ImageFont.truetype("arialbd.ttf", 16)
except:
    f_kicker = f_hero = f_badge = None

draw.text((64, header_y), "● AUDIRA 3D TOY DIORAMA", fill=(243, 201, 105, 255), font=f_kicker)
draw.text((64, header_y + 30), "THEATRICAL MINIATURE", fill=(255, 255, 255, 255), font=f_hero)

# Taped Category Badge
draw.rounded_rectangle([WIDTH - 260, header_y + 6, WIDTH - 64, header_y + 54], radius=6, fill=(250, 246, 238, 255), outline=(229, 169, 60, 255), width=2)
draw.text((WIDTH - 240, header_y + 18), "PBR // STYLE 31", fill=(24, 26, 27, 255), font=f_badge)

# 10. Bottom Editorial Specs Bar
specs_y = 1720
specs = ["MATTE PLASTIC", "SOFT CLAY", "STATIC RIG", "THEATER STAGE"]
start_x = 64
for spec in specs:
    w = len(spec) * 11 + 32
    draw.rounded_rectangle([start_x, specs_y, start_x + w, specs_y + 44], radius=22, fill=(18, 26, 38, 210), outline=(255, 255, 255, 60), width=1)
    draw.text((start_x + 16, specs_y + 12), spec, fill=(244, 239, 234, 240), font=f_badge)
    start_x += w + 16

# Footer Credits
try:
    f_credit = ImageFont.truetype("arialbd.ttf", 20)
    f_credit_sub = ImageFont.truetype("arial.ttf", 18)
except:
    f_credit = f_credit_sub = None

draw.text((WIDTH // 2 - 110, 1820), "Creator: AUDIRA", fill=(255, 255, 255, 180), font=f_credit)
draw.text((WIDTH // 2 - 130, 1850), "Created by: Agus Dwi R.", fill=(243, 201, 105, 220), font=f_credit_sub)

# Ensure output directory exists
out_dir = "references/quality-bar"
os.makedirs(out_dir, exist_ok=True)
output_path = os.path.join(out_dir, "toydiorama.png")

# Also save showcase copy
os.makedirs("out", exist_ok=True)
out_copy = os.path.join("out", "toydiorama-showcase.png")

img.save(output_path, "PNG", optimize=True)
img.save(out_copy, "PNG", optimize=True)

print(f"[SUCCESS] High-fidelity PNG generated at: {output_path}")
print(f"[SUCCESS] Showcase copy saved at: {out_copy}")

