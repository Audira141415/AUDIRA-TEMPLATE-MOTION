'use client';

import React, { useEffect, useRef, useState } from 'react';

// A muted looping reel that only loads and plays while it is on screen.
export const LazyVideo: React.FC<{ src: string; poster: string; label: string; className?: string }> = ({
  src,
  poster,
  label,
  className = '',
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible) el.play().catch(() => {});
    else el.pause();
  }, [visible]);

  return (
    <video
      ref={ref}
      src={visible ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className={`h-full w-full object-cover ${className}`}
    />
  );
};
