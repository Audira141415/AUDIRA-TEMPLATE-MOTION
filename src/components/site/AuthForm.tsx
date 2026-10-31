'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

type Mode = 'login' | 'register';

const COPY: Record<Mode, { title: string; lead: string; submit: string; switchText: string; switchLink: string; switchHref: string }> = {
  login: {
    title: 'Masuk',
    lead: 'Lanjutkan bikin reel dari ide kamu.',
    submit: 'Masuk',
    switchText: 'Belum punya akun?',
    switchLink: 'Daftar gratis',
    switchHref: '/register',
  },
  register: {
    title: 'Buat akun',
    lead: 'Satu akun untuk menyimpan ide, naskah, dan reel kamu.',
    submit: 'Daftar',
    switchText: 'Sudah punya akun?',
    switchLink: 'Masuk',
    switchHref: '/login',
  },
};

const inputClass =
  'w-full rounded-xl border border-[#2c2b28] bg-[#141413] px-4 py-3 text-[15px] text-[#f4f3f0] placeholder:text-[#6f6c66] focus:border-[#ea580c] focus:outline-none';

export const AuthForm: React.FC<{ mode: Mode }> = ({ mode }) => {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next')?.startsWith('/') ? params.get('next')! : '/studio';
  const copy = COPY[mode];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'register' ? { name, email, password } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Terjadi kesalahan. Coba lagi.');
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError('Tidak bisa terhubung ke server.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] rounded-3xl border border-[#2c2b28] bg-[#1c1c1a] p-6 sm:p-8">
      <h1 className="text-[36px] font-extrabold leading-none tracking-[-0.045em]">{copy.title}</h1>
      <p className="mt-3 text-[15px] text-[#b9b6ae]">{copy.lead}</p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4" noValidate>
        {mode === 'register' && (
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-[#d6d3cc]">Nama</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              minLength={2}
              maxLength={60}
              placeholder="Nama kamu"
              className={inputClass}
            />
          </label>
        )}
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-[#d6d3cc]">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            placeholder="nama@email.com"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-[#d6d3cc]">Kata sandi</span>
          <span className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              required
              minLength={8}
              placeholder={mode === 'register' ? 'Minimal 8 karakter' : 'Kata sandi'}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#8a8780] hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-xl border border-red-900 bg-red-950/50 px-4 py-3 text-[14px] text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#f06a1f] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {copy.submit}
          {!busy && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <p className="mt-6 text-center text-[14px] text-[#8a8780]">
        {copy.switchText}{' '}
        <Link
          href={next === '/studio' ? copy.switchHref : `${copy.switchHref}?next=${encodeURIComponent(next)}`}
          className="font-semibold text-white underline underline-offset-2 hover:text-[#ea580c]"
        >
          {copy.switchLink}
        </Link>
      </p>
    </div>
  );
};
