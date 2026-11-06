"""
Script to render high-fidelity 3D PNG still of WATERCOLOR (Style 33).
European Children's Tale, 3D Cold-Press Paper Diorama, Layered Pigment Washes, Hand-Drawn Pencil Lines.
"""
import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

WIDTH, HEIGHT = 1080, 1920

# 1. Base Cold-Press Rag Paper Canvas with Subtle Texture
img = Image.new("RGBA", (WIDTH, HEIGHT), (250, 246, 239, 255))
draw = ImageDraw.Draw(img)

# Paper grain subtle noise
paper_np = np.full((HEIGHT, WIDTH, 4), [250, 246, 239, 255], dtype=np.float32)
# Add subtle paper fiber noise
noise = (np.random.RandomState(42).randn(HEIGHT, WIDTH) * 3.5)
paper_np[..., 0] = np.clip(paper_np[..., 0] + noise, 240, 255)
paper_np[..., 1] = np.clip(paper_np[..., 1] + noise, 236, 252)
paper_np[..., 2] = np.clip(paper_np[..., 2] + noise, 228, 246)
img = Image.fromarray(paper_np.astype(np.uint8), "RGBA")
draw = ImageDraw.Draw(img)

# Deckled paper margin border
draw.rectangle([32, 32, WIDTH - 32, HEIGHT - 32], outline=(236, 228, 214, 255), width=2)

# 2. Distant Cobalt Blue Mountain Wash Flat (#4E7B9C)
mtn_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
m_draw = ImageDraw.Draw(mtn_layer)
m_poly = [(WIDTH//2 - 420, 940), (WIDTH//2 - 60, 420), (WIDTH//2 + 380, 940)]
m_draw.polygon(m_poly, fill=(78, 123, 156, 180)) # Semi-transparent wash
# Bleeding wet edge
m_draw.line(m_poly + [m_poly[0]], fill=(55, 95, 125, 210), width=4)
mtn_blur = mtn_layer.filter(ImageFilter.GaussianBlur(3))
img = Image.alpha_composite(img, mtn_blur)
draw = ImageDraw.Draw(img)

# 3. Soft Sage Green Middleground Rolling Pasture (#6F9779)
hill1_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
h1_draw = ImageDraw.Draw(hill1_layer)
h1_draw.pieslice([WIDTH//2 - 580, 720, WIDTH//2 + 240, 1420], start=180, end=360, fill=(111, 151, 121, 205))
# Pencil contour sketch line along hill crest
h1_draw.arc([WIDTH//2 - 580, 720, WIDTH//2 + 240, 1420], start=180, end=360, fill=(59, 55, 51, 190), width=3)
hill1_blur = hill1_layer.filter(ImageFilter.GaussianBlur(2))
img = Image.alpha_composite(img, hill1_blur)
draw = ImageDraw.Draw(img)

# 4. Warm Ochre Sunlight Foreground Hill (#E8AB48)
hill2_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
h2_draw = ImageDraw.Draw(hill2_layer)
h2_draw.pieslice([WIDTH//2 - 140, 960, WIDTH//2 + 640, 1560], start=180, end=360, fill=(232, 171, 72, 185))
h2_draw.arc([WIDTH//2 - 140, 960, WIDTH//2 + 640, 1560], start=180, end=360, fill=(60, 55, 50, 180), width=3)
hill2_blur = hill2_layer.filter(ImageFilter.GaussianBlur(2))
img = Image.alpha_composite(img, hill2_blur)
draw = ImageDraw.Draw(img)

# 5. Whimsical Watercolor Oak Tree (Left Foreground)
tree_x, tree_y = 220, 1020

# Tree Trunk (Earth Umber #7B5943)
draw.polygon([(tree_x - 22, tree_y + 120), (tree_x - 12, tree_y - 80), (tree_x + 12, tree_y - 80), (tree_x + 24, tree_y + 120)], fill=(123, 89, 67, 240), outline=(59, 55, 51, 200))
# Tree Trunk bark lines
draw.line([(tree_x - 4, tree_y + 90), (tree_x - 2, tree_y - 50)], fill=(80, 55, 40, 180), width=2)
draw.line([(tree_x + 6, tree_y + 80), (tree_x + 4, tree_y - 40)], fill=(80, 55, 40, 180), width=2)

# Fluffy Foliage Washes (Layered Pine & Sage Greens)
tree_leaf_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
tl_draw = ImageDraw.Draw(tree_leaf_layer)

tl_draw.ellipse([tree_x - 140, tree_y - 240, tree_x + 140, tree_y + 20], fill=(63, 100, 73, 200))
tl_draw.ellipse([tree_x - 100, tree_y - 280, tree_x + 110, tree_y - 50], fill=(111, 151, 121, 210))
tl_draw.ellipse([tree_x - 50, tree_y - 310, tree_x + 150, tree_y - 90], fill=(140, 175, 140, 190))

# Pencil sketch foliage scalloped rim
for angle_deg in range(0, 360, 24):
    rad = math.radians(angle_deg)
    px = tree_x + int(math.cos(rad) * 125)
    py = tree_y - 140 + int(math.sin(rad) * 125)
    tl_draw.arc([px - 20, py - 20, px + 20, py + 20], start=angle_deg - 40, end=angle_deg + 40, fill=(59, 55, 51, 180), width=2)

tree_leaf_blur = tree_leaf_layer.filter(ImageFilter.GaussianBlur(2))
img = Image.alpha_composite(img, tree_leaf_blur)
draw = ImageDraw.Draw(img)

# 6. Whimsical Storybook Bear / Little Character (Center-Right on Ochre Hill)
char_cx, char_cy = 640, 1020

# Soft Watercolor Contact Shadow
c_shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
cs_draw = ImageDraw.Draw(c_shadow)
cs_draw.ellipse([char_cx - 110, char_cy + 130, char_cx + 110, char_cy + 180], fill=(160, 140, 120, 130))
c_shadow = c_shadow.filter(ImageFilter.GaussianBlur(8))
img = Image.alpha_composite(img, c_shadow)
draw = ImageDraw.Draw(img)

# Character Body / Coat (Soft Rose Dust Wash #D7837C)
body_box = [char_cx - 95, char_cy - 60, char_cx + 95, char_cy + 130]
draw.rounded_rectangle(body_box, radius=32, fill=(215, 131, 124, 230), outline=(59, 55, 51, 210), width=3)
# Coat Button Details
draw.ellipse([char_cx - 6, char_cy - 10, char_cx + 6, char_cy + 2], fill=(59, 55, 51, 230))
draw.ellipse([char_cx - 6, char_cy + 30, char_cx + 6, char_cy + 42], fill=(59, 55, 51, 230))
draw.ellipse([char_cx - 6, char_cy + 70, char_cx + 6, char_cy + 82], fill=(59, 55, 51, 230))

# Character Head (Pale Cream Wash #FCECE6 with 2B Pencil Outline)
head_box = [char_cx - 105, char_cy - 240, char_cx + 105, char_cy - 50]
draw.ellipse(head_box, fill=(252, 236, 230, 245), outline=(59, 55, 51, 210), width=3)

# Bear Ears
draw.ellipse([char_cx - 105, char_cy - 250, char_cx - 45, char_cy - 190], fill=(215, 131, 124, 230), outline=(59, 55, 51, 210), width=3)
draw.ellipse([char_cx + 45, char_cy - 250, char_cx + 105, char_cy - 190], fill=(215, 131, 124, 230), outline=(59, 55, 51, 210), width=3)

# Cobalt Blue Beret Hat (#4E7B9C)
draw.ellipse([char_cx - 85, char_cy - 265, char_cx + 85, char_cy - 205], fill=(78, 123, 156, 240), outline=(59, 55, 51, 210), width=3)
draw.ellipse([char_cx - 12, char_cy - 280, char_cx + 12, char_cy - 260], fill=(232, 171, 72, 255)) # Gold tassel

# Hand-Drawn Pencil Eyes & Rosy Watercolor Blush Cheeks
draw.ellipse([char_cx - 44, char_cy - 148, char_cx - 32, char_cy - 134], fill=(59, 55, 51, 255)) # Left eye
draw.ellipse([char_cx + 32, char_cy - 148, char_cx + 44, char_cy - 134], fill=(59, 55, 51, 255)) # Right eye

# Rose Blush Washes
draw.ellipse([char_cx - 75, char_cy - 135, char_cx - 45, char_cy - 105], fill=(215, 131, 124, 180))
draw.ellipse([char_cx + 45, char_cy - 135, char_cx + 75, char_cy - 105], fill=(215, 131, 124, 180))

# Friendly Snout & Smile
draw.ellipse([char_cx - 18, char_cy - 125, char_cx + 18, char_cy - 105], fill=(59, 55, 51, 240)) # Nose
draw.arc([char_cx - 20, char_cy - 115, char_cx + 20, char_cy - 90], start=20, end=160, fill=(59, 55, 51, 255), width=3)

# Little Waving Arm
draw.line([(char_cx + 95, char_cy - 20), (char_cx + 165, char_cy - 70)], fill=(215, 131, 124, 230), width=28)
draw.ellipse([char_cx + 150, char_cy - 95, char_cx + 185, char_cy - 60], fill=(252, 236, 230, 255), outline=(59, 55, 51, 200), width=2) # Little paw

# Character Boots
draw.rounded_rectangle([char_cx - 75, char_cy + 120, char_cx - 20, char_cy + 165], radius=12, fill=(78, 123, 156, 255), outline=(59, 55, 51, 200), width=2)
draw.rounded_rectangle([char_cx + 20, char_cy + 120, char_cx + 75, char_cy + 165], radius=12, fill=(78, 123, 156, 255), outline=(59, 55, 51, 200), width=2)

# 7. Floating Whimsical Dandelion Pollen / Rose Petals
pollen_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
pol_draw = ImageDraw.Draw(pollen_layer)
pollen_pts = [(450, 840), (520, 760), (380, 680), (620, 620), (480, 560), (740, 790), (320, 860)]
for px, py in pollen_pts:
    pol_draw.ellipse([px - 8, py - 8, px + 8, py + 8], fill=(232, 171, 72, 170))
    pol_draw.ellipse([px + 14, py + 22, px + 22, py + 30], fill=(215, 131, 124, 180))
pollen_blur = pollen_layer.filter(ImageFilter.GaussianBlur(1))
img = Image.alpha_composite(img, pollen_blur)
draw = ImageDraw.Draw(img)

# 8. Editorial Storybook Typography Overlay
header_y = 120
try:
    f_kicker = ImageFont.truetype("courbd.ttf", 16)
    f_hero = ImageFont.truetype("georgiab.ttf", 36)
    f_badge = ImageFont.truetype("courbd.ttf", 15)
    f_quote = ImageFont.truetype("georgiai.ttf", 22)
    f_sub = ImageFont.truetype("cour.ttf", 14)
except:
    f_kicker = f_hero = f_badge = f_quote = f_sub = None

draw.text((64, header_y), "● CHAPTER I // THE WHISPERING OAK", fill=(232, 171, 72, 255), font=f_kicker)
draw.text((64, header_y + 30), "A Storybook Journey", fill=(44, 39, 35, 255), font=f_hero)

# Gold Foil Stamp Badge
draw.rounded_rectangle([WIDTH - 280, header_y + 6, WIDTH - 64, header_y + 54], radius=8, fill=(255, 252, 247, 240), outline=(232, 171, 72, 255), width=2)
draw.text((WIDTH - 256, header_y + 18), "AQUARELLE // 33", fill=(78, 123, 156, 255), font=f_badge)

# Bottom Story Card
card_y = 1560
draw.rounded_rectangle([64, card_y, WIDTH - 64, card_y + 160], radius=16, fill=(255, 252, 247, 245), outline=(232, 171, 72, 160), width=2)

draw.text((96, card_y + 24), "\"Once upon a quiet morning, the sun dipped its brush in golden light...\"", fill=(44, 39, 35, 255), font=f_quote)
draw.text((96, card_y + 78), "HAND-CRAFTED 3D WATERCOLOR WASH // PENCIL OUTLINE // 300GSM RAG", fill=(123, 89, 67, 255), font=f_sub)

# Closing Credit
try:
    f_credit = ImageFont.truetype("georgiab.ttf", 20)
    f_credit_sub = ImageFont.truetype("georgia.ttf", 18)
except:
    f_credit = f_credit_sub = None

draw.text((WIDTH // 2 - 110, 1820), "Creator: AUDIRA", fill=(44, 39, 35, 210), font=f_credit)
draw.text((WIDTH // 2 - 130, 1850), "Created by: Agus Dwi R.", fill=(215, 131, 124, 255), font=f_credit_sub)

# Ensure output directory exists
out_dir = "references/quality-bar"
os.makedirs(out_dir, exist_ok=True)
output_path = os.path.join(out_dir, "watercolor.png")

# Also save showcase copy
os.makedirs("out", exist_ok=True)
out_copy = os.path.join("out", "watercolor-showcase.png")

img.save(output_path, "PNG", optimize=True)
img.save(out_copy, "PNG", optimize=True)

print(f"[SUCCESS] High-fidelity PNG generated at: {output_path}")
print(f"[SUCCESS] Showcase copy saved at: {out_copy}")

