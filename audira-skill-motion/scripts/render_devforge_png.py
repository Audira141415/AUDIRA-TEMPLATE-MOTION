"""
Script to render high-fidelity 3D PNG still of DEVFORGE (Style 30).
3D Spatial IDE Window, Syntax Typewriter Code, Game Asset Spawning, Revenue Metrics.
"""
import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

WIDTH, HEIGHT = 1080, 1920

# 1. Base Dark Cyberpunk Studio Void
img = Image.new("RGBA", (WIDTH, HEIGHT), (10, 13, 18, 255))
draw = ImageDraw.Draw(img)

# Radial gradient background
bg_np = np.zeros((HEIGHT, WIDTH, 4), dtype=np.float32)
y_indices, x_indices = np.indices((HEIGHT, WIDTH))
center_x, center_y = WIDTH / 2, HEIGHT * 0.46
dist_from_center = np.sqrt((x_indices - center_x) ** 2 + (y_indices - center_y) ** 2)
max_dist = np.sqrt(WIDTH**2 + HEIGHT**2) * 0.65
norm_dist = np.clip(dist_from_center / max_dist, 0.0, 1.0)

r_bg = 10 + (1 - norm_dist) * 16
g_bg = 13 + (1 - norm_dist) * 26
b_bg = 18 + (1 - norm_dist) * 55

bg_np[..., 0] = r_bg
bg_np[..., 1] = g_bg
bg_np[..., 2] = b_bg
bg_np[..., 3] = 255.0
img = Image.fromarray(bg_np.astype(np.uint8), "RGBA")
draw = ImageDraw.Draw(img)

# Neon Perspective Grid in background floor
for i in range(-10, 11):
    start_x = WIDTH // 2 + i * 35
    end_x = WIDTH // 2 + i * 160
    draw.line([(start_x, 1260), (end_x, 1920)], fill=(0, 240, 255, 18), width=1)
for y_line in [1300, 1370, 1460, 1580, 1720, 1880]:
    draw.line([(0, y_line), (WIDTH, y_line)], fill=(0, 240, 255, 12), width=1)

# 2. 3D Floating Spatial IDE Window (Perspective Tilted Glass)
# Window box coordinates (tilted slightly in perspective)
win_x, win_y = 90, 480
win_w, win_h = 900, 680

# Neon Frame Outer Glow
glow_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
g_draw = ImageDraw.Draw(glow_layer)
g_draw.rounded_rectangle([win_x - 4, win_y - 4, win_x + win_w + 4, win_y + win_h + 4], radius=24, outline=(0, 240, 255, 180), width=6)
glow_blur = glow_layer.filter(ImageFilter.GaussianBlur(14))
glow_blur_wide = glow_layer.filter(ImageFilter.GaussianBlur(32))
img = Image.alpha_composite(img, glow_blur_wide)
img = Image.alpha_composite(img, glow_blur)
draw = ImageDraw.Draw(img)

# Main IDE Window Background (Translucent Dark Obsidian Glass #0D1117)
draw.rounded_rectangle([win_x, win_y, win_x + win_w, win_y + win_h], radius=20, fill=(13, 17, 23, 240), outline=(0, 240, 255, 160), width=2)

# Window Header Bar (macOS style)
draw.rounded_rectangle([win_x, win_y, win_x + win_w, win_y + 60], radius=20, fill=(22, 27, 34, 255))
draw.rectangle([win_x, win_y + 40, win_x + win_w, win_y + 60], fill=(22, 27, 34, 255)) # Square bottom edge

# Traffic light buttons
draw.ellipse([win_x + 28, win_y + 22, win_x + 44, win_y + 38], fill=(255, 95, 86, 255)) # Red
draw.ellipse([win_x + 56, win_y + 22, win_x + 72, win_y + 38], fill=(255, 189, 46, 255)) # Yellow
draw.ellipse([win_x + 84, win_y + 22, win_x + 100, win_y + 38], fill=(39, 201, 63, 255)) # Green

# Tab Header
tab_x = win_x + 130
draw.rectangle([tab_x, win_y + 12, tab_x + 240, win_y + 60], fill=(13, 17, 23, 255))
draw.line([(tab_x, win_y + 12), (tab_x + 240, win_y + 12)], fill=(0, 240, 255, 255), width=3)

try:
    f_tab = ImageFont.truetype("courbd.ttf", 16)
    f_code = ImageFont.truetype("courbd.ttf", 18)
    f_comment = ImageFont.truetype("cour.ttf", 18)
except:
    f_tab = f_code = f_comment = None

draw.text((tab_x + 20, win_y + 26), "game_loop.luau", fill=(240, 246, 252, 255), font=f_tab)

# Line Numbers Gutter
gutter_x = win_x + 72
draw.line([(gutter_x, win_y + 60), (gutter_x, win_y + win_h)], fill=(48, 54, 61, 200), width=1)

# Syntax-Highlighted Code Lines
code_lines = [
    ("-- Roblox Luau // AI Monetization", "comment"),
    ("local Marketplace = game:GetService('Marketplace')", "code"),
    ("local Players = game:GetService('Players')", "code"),
    ("", "blank"),
    ("local PASS_ID = 84920194 -- Double Coins VIP", "code"),
    ("", "blank"),
    ("local function onPlayerTouch(hitPart)", "keyword"),
    ("    local char = hitPart.Parent", "code"),
    ("    local player = Players:GetPlayerFromCharacter(char)", "code"),
    ("    if player then", "keyword"),
    ("        local reward = 100 -- VIP Reward", "code"),
    ("        awardCoins(player, reward)", "func"),
    ("        spawnVisualReward(char.Position)", "func"),
    ("    end", "keyword"),
    ("end", "keyword"),
    ("", "blank"),
    ("print('[SUCCESS] Game monetization loop active!')", "string")
]

code_y = win_y + 90
for i, (text, kind) in enumerate(code_lines):
    # Line number
    draw.text((win_x + 24, code_y), f"{i+1:2d}", fill=(110, 118, 129, 255), font=f_code)
    
    # Syntax colors
    if kind == "comment":
        col = (139, 148, 158, 255)
    elif kind == "keyword":
        col = (255, 123, 114, 255) # Coral red keyword
    elif kind == "func":
        col = (210, 168, 255, 255) # Purple function
    elif kind == "string":
        col = (165, 214, 255, 255) # Soft blue
    else:
        col = (230, 237, 243, 255)
        
    draw.text((win_x + 94, code_y), text, fill=col, font=f_code)
    code_y += 32

# 3. 3D Golden Robux Coin & Game Asset Spawning Out of Screen (Code to Life)
coin_cx = win_x + win_w - 200
coin_cy = win_y + win_h - 160

# Spawning light halo
coin_halo = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
ch_draw = ImageDraw.Draw(coin_halo)
ch_draw.ellipse([coin_cx - 150, coin_cy - 150, coin_cx + 150, coin_cy + 150], fill=(245, 158, 11, 80))
ch_blur = coin_halo.filter(ImageFilter.GaussianBlur(30))
img = Image.alpha_composite(img, ch_blur)
draw = ImageDraw.Draw(img)

# 3D Cylinder Coin (Perspective front face and rim)
draw.ellipse([coin_cx - 110, coin_cy - 90, coin_cx + 110, coin_cy + 90], fill=(217, 119, 6, 255)) # Dark gold rim
draw.ellipse([coin_cx - 110, coin_cy - 110, coin_cx + 110, coin_cy + 70], fill=(251, 191, 36, 255)) # Shiny face
# Stud Center Node
draw.ellipse([coin_cx - 45, coin_cy - 40, coin_cx + 45, coin_cy + 20], fill=(245, 158, 11, 255), outline=(254, 240, 138, 255), width=3)
# Robux "R" Logo / Diamond cutout in center
diamond = [(coin_cx, coin_cy - 25), (coin_cx + 22, coin_cy - 10), (coin_cx, coin_cy + 5), (coin_cx - 22, coin_cy - 10)]
draw.polygon(diamond, fill=(255, 255, 255, 240))

# 4. Kinetic Revenue Badge (+ $1,250 ROBUX)
badge_x = coin_cx - 120
badge_y = coin_cy + 90
badge_w = 260
badge_h = 75

draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + badge_h], radius=16, fill=(16, 185, 129, 235), outline=(52, 211, 153, 255), width=2)

try:
    f_badge_sub = ImageFont.truetype("courbd.ttf", 14)
    f_badge_val = ImageFont.truetype("arialbd.ttf", 28)
except:
    f_badge_sub = f_badge_val = None

draw.text((badge_x + 18, badge_y + 12), "REVENUE PULSE // DAILY", fill=(6, 78, 59, 255), font=f_badge_sub)
draw.text((badge_x + 18, badge_y + 32), "+$1,250 ROBUX", fill=(255, 255, 255, 255), font=f_badge_val)

# 5. Top Editorial Header Bar
header_y = 120
try:
    f_head = ImageFont.truetype("arialbd.ttf", 36)
    f_kicker = ImageFont.truetype("courbd.ttf", 16)
    f_pill = ImageFont.truetype("arialbd.ttf", 15)
except:
    f_head = f_kicker = f_pill = None

draw.text((64, header_y), "● DEVFORGE // 3D SPATIAL IDE", fill=(0, 240, 255, 255), font=f_kicker)
draw.text((64, header_y + 30), "GAME DEV HUSTLE ENGINE", fill=(255, 255, 255, 255), font=f_head)

# Status Badge
draw.rounded_rectangle([WIDTH - 280, header_y + 6, WIDTH - 64, header_y + 54], radius=6, fill=(22, 27, 34, 240), outline=(0, 240, 255, 180), width=2)
draw.text((WIDTH - 258, header_y + 18), "LUAU // STYLE 30", fill=(0, 240, 255, 255), font=f_pill)

# 6. Bottom Explainer Card (Within Mobile Safe Zone)
bubble_y = 1450
draw.rounded_rectangle([64, bubble_y, WIDTH - 64, bubble_y + 200], radius=24, fill=(13, 17, 23, 240), outline=(0, 240, 255, 160), width=2)
draw.rounded_rectangle([64, bubble_y, 64 + 180, bubble_y + 6], radius=3, fill=(0, 240, 255, 255))

try:
    f_tag = ImageFont.truetype("courbd.ttf", 16)
    f_talk_title = ImageFont.truetype("arialbd.ttf", 32)
    f_talk_body = ImageFont.truetype("arial.ttf", 22)
except:
    f_tag = f_talk_title = f_talk_body = None

draw.text((96, bubble_y + 26), "AI CODE-TO-LIFE ENGINE", fill=(0, 240, 255, 255), font=f_tag)
draw.text((96, bubble_y + 60), "\"Bikin Game Roblox Pakai AI Tanpa Coding\"", fill=(255, 255, 255, 255), font=f_talk_title)
draw.text((96, bubble_y + 112), "Layar kode 3D melayang dengan typewriter syntax otomatis.", fill=(180, 192, 208, 255), font=f_talk_body)
draw.text((96, bubble_y + 144), "Koin 3D & game asset melompat keluar langsung ke layar.", fill=(140, 155, 175, 255), font=f_talk_body)

# 7. Closing Credit
try:
    f_credit = ImageFont.truetype("arialbd.ttf", 20)
    f_credit_sub = ImageFont.truetype("arial.ttf", 18)
except:
    f_credit = f_credit_sub = None

draw.text((WIDTH // 2 - 110, 1820), "Creator: AUDIRA", fill=(255, 255, 255, 180), font=f_credit)
draw.text((WIDTH // 2 - 130, 1850), "Created by: Agus Dwi R.", fill=(0, 240, 255, 200), font=f_credit_sub)

# Ensure output directory exists
out_dir = "references/quality-bar"
os.makedirs(out_dir, exist_ok=True)
output_path = os.path.join(out_dir, "devforge.png")

# Also save showcase copy
os.makedirs("out", exist_ok=True)
out_copy = os.path.join("out", "devforge-showcase.png")

img.save(output_path, "PNG", optimize=True)
img.save(out_copy, "PNG", optimize=True)

print(f"[SUCCESS] High-fidelity PNG generated at: {output_path}")
print(f"[SUCCESS] Showcase copy saved at: {out_copy}")

