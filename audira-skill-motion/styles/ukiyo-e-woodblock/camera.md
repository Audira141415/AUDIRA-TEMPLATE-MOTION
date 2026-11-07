# STYLE DNA: Ukiyo-e Woodblock — Camera & Optical Framing
# AUDIRA STYLE DNA LIBRARY

---

## 1. Camera Specifications & Optics
- **Rig Type:** **Trough-to-Print-Eye Rig** (`getUkiyoCamera`).
- **Print Eye:** `[0, 0, 9]` looking at `[0, 0, -6]`, FOV 46°. From here every sheet aligns into one flat print (`depthScale`).
- **Hook Pose:** `[1.5, -1.7, 2.9]` looking up at `[0.85, 0.6, -1.0]`, FOV 58°.
- **Glide Pose:** `[-1.2, -1.8, 4.4]` looking at `[-0.5, -1.0, -8.5]`, FOV 50°.

---

## 2. Movement Grammar
- **Under the Crest (0–1.8 s):** low and close, the claw foam towers overhead.
- **Parallax Glide (1.8–8.4 s):** ease-in-out move left and back; nearer sheets slide faster than far ones, revealing boats between waves.
- **Lock to Print (8.2–10.6 s):** ease into the print eye; parallax collapses and the composition becomes one woodblock image, which is the visual payoff.
- **Breathing Push-In (10.5–12 s):** 0.5 m forward.
- **Constraint:** keep yaw within about ±35° of the print axis so sheet edges stay hidden.
