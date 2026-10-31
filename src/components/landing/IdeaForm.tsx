'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

const PLACEHOLDERS = [
  'Dita mau liburan ke Bali tapi cuma punya 1,5 juta dan nol rencana',
  'Ash mau resign jadi streamer padahal followers-nya baru 40',
  'Grup WA keluarga heboh gara-gara foto kulkas yang kosong',
];

export const IdeaForm: React.FC<{ variant?: number }> = ({ variant = 0 }) => {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const placeholder = PLACEHOLDERS[variant % PLACEHOLDERS.length];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = (idea.trim() || placeholder).slice(0, 600);
    router.push(`/studio?idea=${encodeURIComponent(text)}`);
  };

  return (
    <form onSubmit={submit} className="w-full max-w-[560px] flex flex-col gap-3">
      <div className="rounded-2xl border border-[#2c2b28] bg-[#1c1c1a] p-2">
        <label htmlFor={`idea-${variant}`} className="block px-3 pt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#8a8780]">
          Reel pertama yang mau kamu buat
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id={`idea-${variant}`}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder={placeholder}
            maxLength={600}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[15px] text-[#f4f3f0] placeholder:text-[#6f6c66] focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#f06a1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
          >
            Buat reel-nya
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-[13px] text-[#8a8780]">
        Kosongkan untuk mencoba contoh. Studio butuh akun gratis; kamu akan diminta masuk atau daftar dulu.
      </p>
    </form>
  );
};
