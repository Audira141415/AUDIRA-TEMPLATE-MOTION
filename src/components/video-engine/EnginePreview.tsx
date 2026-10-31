'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Storyboard } from '@/types/motion';
import { composeReel, estimateTimeline } from '../../../engine/compose.mjs';

// Seeks the paused GSAP timeline to whatever time the parent player posts.
const PLAYER = `<script>
addEventListener("message", function (e) {
  var tl = window.__timelines && window.__timelines.main;
  if (tl && e.data && typeof e.data.t === "number") tl.seek(e.data.t);
});
</script>`;

interface Props {
  storyboard: Storyboard;
  currentTime: number;
}

// The same composition the MP4 render uses, shown in a scaled iframe with estimated timings.
export const EnginePreview: React.FC<Props> = ({ storyboard, currentTime }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.3);

  const html = useMemo(
    () => composeReel(storyboard, estimateTimeline(storyboard), { preview: true }).replace('</body>', `${PLAYER}</body>`),
    [storyboard],
  );

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1080));
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage({ t: currentTime }, '*');
  }, [currentTime, html]);

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden bg-black">
      <iframe
        ref={frameRef}
        title={`Preview ${storyboard.title}`}
        srcDoc={html}
        sandbox="allow-scripts"
        className="pointer-events-none origin-top-left border-0"
        style={{ width: 1080, height: 1920, transform: `scale(${scale})` }}
      />
    </div>
  );
};
