# Changelog — Audira Skill Motion 3D

## v3.0.0 (Official Rebrand & Commercial Release)
- **Transformasi & Rebranding Menjadi Audira Skill Motion (By Agus Dwi Rianto):**
  - Rebranding resmi seluruh ekosistem animasi 3D sinematik dari VOYNANN Motion menjadi **Audira Skill Motion** di bawah kepemilikan dan arsitektur **AUDIRA (Agus Dwi R)**.
  - Penerbitan **Lisensi Komersial Berbayar Resmi (EULA)** di `LICENSE.md` dan pembaruan `LICENSE_AND_REQUIREMENTS.md`. Memberikan hak penuh kepada pemegang lisensi berbayar untuk memproduksi dan memonetisasi video komersial tanpa batas, sekaligus menegakkan perlindungan hak cipta anti-resale dan anti-pembajakan.
  - Perintah pemanggilan skill resmi diperbarui ke `/audira-motion` (dengan dukungan backward compatibility alias `/voynann-motion`).
  - Pembaruan sistem identitas brand terintegrasi `audira-brand.json` (mendukung deteksi otomatis rasio kontras WCAG).
  - Sinkronisasi penuh 20 signature styles mandiri di 5 pilar industri, seluruh file referensi dokumentasi, starter project, serta panduan `README.md`.

## v2.1.0
- **Penambahan Style ke-19: BRICKCRAFT (Tactile Plastic Bricks, Interlocking Stud Geometry & Macro Toy Stop-Motion):**
  - Diadaptasi dan dielevasi dari konsep *brick-toy* (Lemo-Opuscar) menjadi mesin 3D balok mainan plastik ber-stud fotorealistik.
  - Komponen prosedural: `StudBrick` (balok plastik ABS parametrik dengan silinder stud atas berpitch 1.0, bevel tepi, dan kontak oklusi gelap), `ToyCharacter` (figur mini terbuat dari balok dengan artikulasi ayunan langkah kaki/tangan dan ekspresi senyum cetak), `ToyRoomStage` (meja kayu asli dengan baseplate hijau dan latar belakang blur makro), serta `BrickOverlay` (kartu header dengan aksen stud merah dan kapsul narasi playful).
  - Dilengkapi fisika snap elastis `snapOvershoot`, stepping karakter 15 FPS di atas pergerakan kamera halus 60 FPS, contoh teknis `BrickcraftExample.tsx` (8 detik 60 FPS), dan referensi `references/brickcraft.md`.
- **Penambahan Style ke-20: URBANFORGE (Architectural White Model, Real Sun Shadows & Dynamic Data Projection):**
  - Diadaptasi dan dielevasi dari konsep *white-model* (Lemo-Opuscar) menjadi mesin maket arsitektur kota putih monokrom dengan simulasi matahari nyata dan pemetaan proyeksi cahaya.
  - Komponen prosedural: `BuildingMassing` (massa bangunan arsitektur parametrik dengan ketinggian bervariasi dan lorong jalan presisi), `DataProjection` (sapuan gelombang data bercahaya cyan/amber yang menerangi fasad dan atap), `ArchitecturalPlinth` (plinth obsidian pameran dengan potongan sungai satin gelap dan grid jalan), serta `UrbanOverlay` (HUD telemetri arsitektur skala 1:1000, jam posisi surya matahari, hitungan blok gedung, dan pembacaan puncak elevasi).
  - Dilengkapi rotasi lintasan matahari `getSolarPosition` dengan bayangan tajam dinamis, contoh teknis `UrbanforgeExample.tsx` (8 detik 60 FPS), dan referensi `references/urbanforge.md`.
- **Milestone 20 Signature Styles:**
  - Melengkapi ekosistem ke 20 signature style mandiri di 5 kategori industri.
  - Seluruh 20 style memiliki folder mandiri di `kits/` dan `starter/src/kits/`, lengkap dengan `KIT.md`, contoh teknis, registrasi di `Root.tsx`, dan referensi dokumentasi.

## v2.0.0
- **Penambahan Style ke-17: LIDARFORGE (3D Point Cloud Aerial Survey, Bathymetry & Laser Sweep):**
  - Diadaptasi dan dielevasi dari konsep *lidar-survey* (Lemo-Opuscar) menjadi mesin 3D volumetrik 60 FPS asli VOYNANN Motion.
  - Komponen prosedural: `PointCloudTerrain` (8.400+ titik survei berkode warna elevasi dinamis dari palung laut hingga puncak pegunungan dengan highlight sapuan laser), `LaserScanPlane` (tirai laser vertikal pemindai topografi dengan berkas sensor sensorik overhead), `SurveyWorld` (bounding box survei dengan grid koordinat presisi), dan `SurveyOverlay` (telemetri GPS WGS84, altimeter AMSL, frekuensi pulsa 400 kHz, point counter, dan ramp elevasi ilmiah).
- **Penambahan Style ke-18: CIRCUITFORGE (3D PCB Electronics, SMT Microchips & Copper Electron Currents):**
  - Diadaptasi dan dielevasi dari konsep *circuit-board* (Lemo-Opuscar) menjadi arsitektur motherboard mikro 3D 60 FPS fotorealistik.
  - Komponen prosedural: `PcbSubstrate` (papan FR-4 matte dengan routing tembaga oktilinear sudut 45°/90°, via plating ENIG gold, test pads, dan sablon silkscreen), `MicrochipBga` (prosesor silikon BGA sentral dengan pelindung panas nikel, penanda Pin 1, dan kapasitor keramik decoupling 0603 SMT), `ElectronPulse` (aliran elektron daya amber dan sinyal bus jam/data cyan berkecepatan tinggi), dan `CircuitOverlay` (HUD diagnostik BIOS/hardware: jam 4.8 GHz, VDD 1.15V, arus ampere, dan pinout telemetri).

## v1.9.0
- **Penambahan Style ke-15: NANOFORGE & Style ke-16: INKSTORY.**

## v1.8.0
- **Penambahan Style ke-14: GLASSCRAFT & Standardisasi Folder Mandiri.**

## v1.0 - v1.7.0
- Fondasi awal rilis arsitektur procedural motion.
