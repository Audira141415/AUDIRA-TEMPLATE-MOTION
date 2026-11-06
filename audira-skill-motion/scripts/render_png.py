"""
Script to render high-fidelity 3D PNG still of AUDIRABOT.
"""
import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

WIDTH, HEIGHT = 1080, 1920

# 1. Base Studio Void Canvas with deep cyber gradient and subtle floor grid
img = Image.new("RGBA", (WIDTH, HEIGHT), (8, 11, 17, 255))
draw = ImageDraw.Draw(img)

# Radial background gradient (subtle spotlight in center behind robot)
bg_np = np.zeros((HEIGHT, WIDTH, 4), dtype=np.float32)
y_indices, x_indices = np.indices((HEIGHT, WIDTH))
center_x, center_y = WIDTH / 2, HEIGHT * 0.48
dist_from_center = np.sqrt((x_indices - center_x) ** 2 + (y_indices - center_y) ** 2)
max_dist = np.sqrt(WIDTH**2 + HEIGHT**2) * 0.65
norm_dist = np.clip(dist_from_center / max_dist, 0.0, 1.0)

# Deep obsidian to midnight navy gradient
r_bg = 8 + (1 - norm_dist) * 14
g_bg = 11 + (1 - norm_dist) * 22
b_bg = 17 + (1 - norm_dist) * 45

bg_np[..., 0] = r_bg
bg_np[..., 1] = g_bg
bg_np[..., 2] = b_bg
bg_np[..., 3] = 255.0
img = Image.fromarray(bg_np.astype(np.uint8), "RGBA")
draw = ImageDraw.Draw(img)

# Perspective Cyber Floor Grid lines in the bottom section
for i in range(-12, 13):
    start_x = WIDTH // 2 + i * 25
    end_x = WIDTH // 2 + i * 140
    draw.line([(start_x, 1280), (end_x, 1920)], fill=(0, 240, 255, 18), width=1)
for y_line in [1320, 1380, 1460, 1560, 1680, 1820]:
    draw.line([(0, y_line), (WIDTH, y_line)], fill=(0, 240, 255, 14), width=1)

# Plasma light bounce on floor
draw.ellipse([WIDTH//2 - 260, 1340, WIDTH//2 + 260, 1480], fill=(0, 200, 255, 30))

# 2. Render 3D Plasma Thruster Cone (Volumetric Bloom)
thruster_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
th_draw = ImageDraw.Draw(thruster_layer)

cx, cy = WIDTH // 2, int(HEIGHT * 0.52)
# Inverted cone of intense cyan plasma
th_poly = [(cx - 95, cy + 220), (cx + 95, cy + 220), (cx + 40, cy + 420), (cx, cy + 450), (cx - 40, cy + 420)]
th_draw.polygon(th_poly, fill=(0, 200, 255, 200))
# Inner white-hot core
th_draw.polygon([(cx - 45, cy + 220), (cx + 45, cy + 220), (cx, cy + 360)], fill=(220, 250, 255, 240))
thruster_layer = thruster_layer.filter(ImageFilter.GaussianBlur(16))
img = Image.alpha_composite(img, thruster_layer)

# 3. Render 3D Robot Geometry with Physical Surface Normals
robot_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
body_np = np.zeros((HEIGHT, WIDTH, 4), dtype=np.uint8)

# Parameters for egg body
rx, ry = 230, 280
bcx, bcy = WIDTH // 2, int(HEIGHT * 0.48)

# Compute 3D sphere/ellipsoid coordinates
y_grid, x_grid = np.ogrid[:HEIGHT, :WIDTH]
dx = (x_grid - bcx) / rx
dy = (y_grid - bcy) / ry
dist_sq = dx**2 + dy**2
mask = dist_sq <= 1.0

# Surface normal components
nz = np.sqrt(np.maximum(0.0, 1.0 - dist_sq))
nx = dx
ny = dy
norm_len = np.sqrt(nx**2 + ny**2 + nz**2)
norm_len[norm_len == 0] = 1.0
nx, ny, nz = nx / norm_len, ny / norm_len, nz / norm_len

# Lighting vectors
# Key light from top-right
l1x, l1y, l1z = 0.5, -0.7, 0.5
l1_len = math.sqrt(l1x**2 + l1y**2 + l1z**2)
l1x, l1y, l1z = l1x/l1_len, l1y/l1_len, l1z/l1_len
diff1 = np.maximum(0.0, nx * l1x + ny * l1y + nz * l1z)

# Specular highlight (Blinn-Phong)
vx, vy, vz = 0.0, 0.0, 1.0
hx, hy, hz = l1x + vx, l1y + vy, l1z + vz
h_len = math.sqrt(hx**2 + hy**2 + hz**2)
hx, hy, hz = hx/h_len, hy/h_len, hz/h_len
spec1 = np.maximum(0.0, nx * hx + ny * hy + nz * hz) ** 28

# Rim light from bottom (plasma bounce)
diff_plasma = np.maximum(0.0, ny * 0.9 + nz * 0.2)

# Fresnel edge glow: (1 - dot(N, V))^3
fresnel = (1.0 - nz) ** 2.8

# Ceramic White porcelain base color: #F0F4F8
base_r, base_g, base_b = 240, 244, 248

body_r = np.clip(base_r * (0.25 + 0.65 * diff1) + spec1 * 140 + fresnel * 60, 0, 255)
body_g = np.clip(base_g * (0.25 + 0.65 * diff1) + spec1 * 140 + fresnel * 120 + diff_plasma * 40, 0, 255)
body_b = np.clip(base_b * (0.28 + 0.62 * diff1) + spec1 * 150 + fresnel * 200 + diff_plasma * 110, 0, 255)

body_np[mask, 0] = body_r[mask].astype(np.uint8)
body_np[mask, 1] = body_g[mask].astype(np.uint8)
body_np[mask, 2] = body_b[mask].astype(np.uint8)
body_np[mask, 3] = 255

robot_layer = Image.fromarray(body_np, "RGBA")
img = Image.alpha_composite(img, robot_layer)
draw = ImageDraw.Draw(img)

# 4. Render Curved Obsidian Visor Faceplate
vx_r, vy_r = 175, 140
vcx, vcy = bcx, bcy - 20
v_mask = ((x_grid - vcx) / vx_r)**2 + ((y_grid - vcy) / vy_r)**2 <= 1.0

visor_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
visor_np = np.zeros((HEIGHT, WIDTH, 4), dtype=np.uint8)

# Visor surface normal
v_dx = (x_grid - vcx) / vx_r
v_dy = (y_grid - vcy) / vy_r
v_dist_sq = v_dx**2 + v_dy**2
v_nz = np.sqrt(np.maximum(0.0, 1.0 - v_dist_sq))
v_fresnel = (1.0 - v_nz) ** 2.2

# Glossy black glass with specular streak
visor_r = np.clip(12 + v_fresnel * 40, 0, 255)
visor_g = np.clip(16 + v_fresnel * 90, 0, 255)
visor_b = np.clip(24 + v_fresnel * 160, 0, 255)

visor_np[v_mask, 0] = visor_r[v_mask].astype(np.uint8)
visor_np[v_mask, 1] = visor_g[v_mask].astype(np.uint8)
visor_np[v_mask, 2] = visor_b[v_mask].astype(np.uint8)
visor_np[v_mask, 3] = 245

visor_img = Image.fromarray(visor_np, "RGBA")
# Add curved glass specular streak
v_streak = ImageDraw.Draw(visor_img)
v_streak.arc([vcx - 160, vcy - 120, vcx + 160, vcy + 100], start=210, end=330, fill=(255, 255, 255, 75), width=8)

img = Image.alpha_composite(img, visor_img)
draw = ImageDraw.Draw(img)

# 5. Glowing Digital OLED Eyes (Cyan)
eye_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
eye_draw = ImageDraw.Draw(eye_layer)

eye_w, eye_h = 32, 68
left_eye_x = bcx - 68
right_eye_x = bcx + 68
eye_y = vcy - 10

# Draw crisp OLED eye capsules
for ex in [left_eye_x, right_eye_x]:
    eye_draw.rounded_rectangle([ex - eye_w//2, eye_y - eye_h//2, ex + eye_w//2, eye_y + eye_h//2], radius=16, fill=(0, 240, 255, 255))
    # Inner white specular pupil core
    eye_draw.rounded_rectangle([ex - eye_w//4, eye_y - eye_h//4, ex + eye_w//4, eye_y + eye_h//4], radius=8, fill=(210, 255, 255, 255))

# Multi-pass Bloom Glow for OLED Eyes
eye_glow = eye_layer.filter(ImageFilter.GaussianBlur(18))
eye_glow_wide = eye_layer.filter(ImageFilter.GaussianBlur(42))
img = Image.alpha_composite(img, eye_glow_wide)
img = Image.alpha_composite(img, eye_glow)
img = Image.alpha_composite(img, eye_layer)
draw = ImageDraw.Draw(img)

# 6. Golden Metallic Audio Ears / Antennae
ear_w, ear_h = 42, 70
# Left Ear
draw.rounded_rectangle([bcx - rx - 24, bcy - 60, bcx - rx + 16, bcy + 25], radius=12, fill=(212, 175, 55, 255), outline=(255, 220, 110, 255), width=2)
# Right Ear
draw.rounded_rectangle([bcx + rx - 16, bcy - 60, bcx + rx + 24, bcy + 25], radius=12, fill=(212, 175, 55, 255), outline=(255, 220, 110, 255), width=2)

# 7. Articulated Floating Gesturing Arm (Pointing Right)
# Upper Arm
draw.rounded_rectangle([bcx + 230, bcy - 10, bcx + 290, bcy + 130], radius=24, fill=(235, 240, 246, 255), outline=(0, 240, 255, 120), width=2)
# Articulated Gold Elbow Joint
draw.ellipse([bcx + 250, bcy + 120, bcx + 295, bcy + 165], fill=(212, 175, 55, 255))
# Forearm angled upwards pointing to HUD
arm_poly = [(bcx + 270, bcy + 145), (bcx + 360, bcy + 105), (bcx + 375, bcy + 135), (bcx + 285, bcy + 175)]
draw.polygon(arm_poly, fill=(240, 245, 250, 255))
# Gold Pointing Hand Node
draw.ellipse([bcx + 355, bcy + 95, bcx + 395, bcy + 135], fill=(212, 175, 55, 255))

# Left Arm (Resting)
draw.rounded_rectangle([bcx - 290, bcy + 20, bcx - 230, bcy + 160], radius=24, fill=(235, 240, 246, 255), outline=(0, 240, 255, 80), width=2)

# 8. Floating Holographic Halo Ring
halo_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
h_draw = ImageDraw.Draw(halo_layer)
h_draw.ellipse([bcx - 140, bcy - ry - 70, bcx + 140, bcy - ry - 25], outline=(0, 240, 255, 220), width=6)
halo_glow = halo_layer.filter(ImageFilter.GaussianBlur(14))
img = Image.alpha_composite(img, halo_glow)
img = Image.alpha_composite(img, halo_layer)
draw = ImageDraw.Draw(img)

# 9. 3D World-Space Tracking Callout Pin
# Target point on chest
tx, ty = bcx, bcy + 110

# Concentric pulse radar rings
draw.ellipse([tx - 10, ty - 10, tx + 10, ty + 10], fill=(0, 240, 255, 255))
draw.ellipse([tx - 26, ty - 26, tx + 26, ty + 26], outline=(0, 240, 255, 160), width=2)
draw.ellipse([tx - 44, ty - 44, tx + 44, ty + 44], outline=(0, 240, 255, 90), width=2)

# Angled Leader Line (Target -> Elbow -> Card)
card_x, card_y = bcx + 180, bcy - 220
elbow_x, elbow_y = tx + 140, ty - 120

draw.line([(tx, ty), (elbow_x, elbow_y)], fill=(0, 240, 255, 220), width=3)
draw.line([(elbow_x, elbow_y), (card_x, card_y + 60)], fill=(0, 240, 255, 220), width=3)
draw.ellipse([elbow_x - 5, elbow_y - 5, elbow_x + 5, elbow_y + 5], fill=(0, 255, 200, 255))

# Glassmorphic Telemetry Card
card_w, card_h = 320, 160
card_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
c_draw = ImageDraw.Draw(card_layer)

# Semi-transparent dark glass fill
c_draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=16, fill=(10, 14, 22, 230), outline=(0, 240, 255, 255), width=2)
# Accent indicator bar on left
c_draw.rounded_rectangle([card_x, card_y, card_x + 10, card_y + card_h], radius=4, fill=(0, 240, 255, 255))

# Card Typography
try:
    font_mono = ImageFont.truetype("courbd.ttf", 16)
    font_bold = ImageFont.truetype("arialbd.ttf", 24)
    font_stat = ImageFont.truetype("arialbd.ttf", 36)
except:
    font_mono = font_bold = font_stat = None

c_draw.text((card_x + 24, card_y + 18), "NEURAL COMPANION // TIER 1", fill=(0, 240, 255, 255), font=font_mono)
c_draw.text((card_x + 24, card_y + 44), "COGNITION CORE", fill=(255, 255, 255, 255), font=font_bold)
c_draw.line([(card_x + 24, card_y + 80), (card_x + card_w - 24, card_y + 80)], fill=(255, 255, 255, 50), width=1)
c_draw.text((card_x + 24, card_y + 95), "4.80 GHz", fill=(0, 255, 200, 255), font=font_stat)
c_draw.text((card_x + 180, card_y + 110), "ACTIVE", fill=(37, 244, 130, 255), font=font_mono)

img = Image.alpha_composite(img, card_layer)
draw = ImageDraw.Draw(img)

# 10. Top HUD Telemetry Header
header_y = 120
draw.ellipse([60, header_y + 4, 76, header_y + 20], fill=(0, 240, 255, 255))
try:
    font_head = ImageFont.truetype("arialbd.ttf", 26)
    font_sub = ImageFont.truetype("courbd.ttf", 18)
except:
    font_head = font_sub = None

draw.text((92, header_y), "AUDIRA-BOT  //  COMPANION OS v3.2", fill=(255, 255, 255, 255), font=font_head)
# Status Pill
draw.rounded_rectangle([WIDTH - 240, header_y - 4, WIDTH - 60, header_y + 32], radius=18, fill=(26, 29, 36, 200), outline=(0, 240, 255, 120), width=1)
draw.text((WIDTH - 215, header_y + 2), "STATE: CURIOUS", fill=(0, 240, 255, 255), font=font_sub)

# 11. Bottom Dialogue / Speech Card (Within Mobile Safe Zone)
bubble_y = 1420
draw.rounded_rectangle([70, bubble_y, WIDTH - 70, bubble_y + 200], radius=24, fill=(10, 13, 20, 240), outline=(0, 240, 255, 180), width=2)
# Glowing top accent stripe
draw.rounded_rectangle([70, bubble_y, 70 + 200, bubble_y + 6], radius=3, fill=(0, 240, 255, 255))

try:
    font_tag = ImageFont.truetype("courbd.ttf", 18)
    font_talk_title = ImageFont.truetype("arialbd.ttf", 34)
    font_talk_body = ImageFont.truetype("arial.ttf", 24)
except:
    font_tag = font_talk_title = font_talk_body = None

draw.text((105, bubble_y + 26), "AI AUTONOMOUS 3D GUIDE", fill=(0, 240, 255, 255), font=font_tag)
draw.text((105, bubble_y + 62), "\"Halo! Saya AUDIRA-BOT.\"", fill=(255, 255, 255, 255), font=font_talk_title)
draw.text((105, bubble_y + 116), "Maskot 3D resmi pendamping video Anda.", fill=(180, 192, 208, 255), font=font_talk_body)
draw.text((105, bubble_y + 152), "Siap memandu pemirsa & menunjuk komponen teknologi.", fill=(140, 155, 175, 255), font=font_talk_body)

# 12. Elegant Footer Branding Contract (Closing Credit)
try:
    font_credit = ImageFont.truetype("arialbd.ttf", 20)
    font_credit_sub = ImageFont.truetype("arial.ttf", 18)
except:
    font_credit = font_credit_sub = None

draw.text((WIDTH // 2 - 110, 1820), "Creator: AUDIRA", fill=(255, 255, 255, 180), font=font_credit)
draw.text((WIDTH // 2 - 130, 1850), "Created by: Agus Dwi R.", fill=(0, 240, 255, 200), font=font_credit_sub)

# Ensure output directory exists
out_dir = "references/quality-bar"
os.makedirs(out_dir, exist_ok=True)
output_path = os.path.join(out_dir, "audirabot.png")

# Also save a copy in out/ for deliverables
os.makedirs("out", exist_ok=True)
out_copy = os.path.join("out", "audirabot-showcase.png")

img.save(output_path, "PNG", optimize=True)
img.save(out_copy, "PNG", optimize=True)

print(f"[SUCCESS] High-fidelity PNG generated at: {output_path}")
print(f"[SUCCESS] Showcase copy saved at: {out_copy}")
