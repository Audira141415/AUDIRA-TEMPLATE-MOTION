# Audira Skill Motion — Project Starter

Created by Claude from the `audira-motion` skill. Remotion 4 + React Three Fiber; 9:16 vertical 60 FPS.  
Author: **AUDIRA (Agus Dwi R)**

```bash
npm ci                 # install dependencies (once)
npm run check-env      # check computer hardware & GPU capability
npm run smoke          # proves 3D rendering works → out/smoke/_sheet.jpg
npm run dev            # launch Remotion Studio
npm run vo -- public/audio/vo.mp3                    # analyze voice-over timing
npm run stills -- out/qa 0.5s,3s,6s <Composition>    # export QA stills
npm run render:final -- --comp=<FinalComposition> --out=out/final.mp4 --vo=public/audio/vo.mp3 --offset=0.4
```

`src/core` is the shared Audira Motion core 3D library (see the skill's `references/production-kit.md`).  
`src/scenes/showcase` is an environment check — custom films live in their respective kits or scene folders.
