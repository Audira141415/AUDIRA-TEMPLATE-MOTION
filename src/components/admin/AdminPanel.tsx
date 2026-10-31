'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Download, Loader2, RefreshCw } from 'lucide-react';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'superadmin';
  createdAt: string;
  disabled: boolean;
  renders: number;
};

type AdminRender = {
  id: string;
  ownerEmail: string;
  state: string;
  title: string;
  format: string;
  createdAt: string;
  hasFile: boolean;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATE_STYLE: Record<string, string> = {
  done: 'bg-emerald-950 text-emerald-300 border-emerald-900',
  error: 'bg-red-950 text-red-300 border-red-900',
};

export const AdminPanel: React.FC<{ meId: string }> = ({ meId }) => {
  const [tab, setTab] = useState<'users' | 'renders'>('users');
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [renders, setRenders] = useState<AdminRender[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: 'error' | 'ok'; text: string } | null>(null);

  const load = useCallback(async () => {
    const [u, r] = await Promise.all([
      fetch('/api/admin/users').then((res) => res.json()),
      fetch('/api/admin/renders').then((res) => res.json()),
    ]);
    setUsers(u.users ?? []);
    setRenders(r.renders ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (user: AdminUser, method: 'PATCH' | 'DELETE', body?: object, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyId(user.id);
    setMessage(null);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    setBusyId(null);
    setMessage(res.ok ? { tone: 'ok', text: `Perubahan untuk ${user.email} disimpan.` } : { tone: 'error', text: data.error });
    if (res.ok) load();
  };

  const stats = [
    { label: 'Pengguna', value: users?.length ?? '–' },
    { label: 'Superadmin', value: users?.filter((u) => u.role === 'superadmin').length ?? '–' },
    { label: 'Nonaktif', value: users?.filter((u) => u.disabled).length ?? '–' },
    { label: 'Render', value: renders?.length ?? '–' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#2c2b28] bg-[#1c1c1a] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8780]">{s.label}</p>
            <p className="mt-2 text-[34px] font-extrabold tracking-[-0.04em]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div role="tablist" className="flex gap-1 rounded-xl border border-[#2c2b28] bg-[#1c1c1a] p-1">
          {(['users', 'renders'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === t ? 'bg-[#f4f3f0] text-[#141413]' : 'text-[#b9b6ae] hover:text-white'}`}
            >
              {t === 'users' ? 'Pengguna' : 'Render'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-[#2c2b28] px-3 py-2 text-sm text-[#d6d3cc] hover:text-white"
        >
          <RefreshCw className="h-4 w-4" /> Muat ulang
        </button>
      </div>

      {message && (
        <p
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.tone === 'error' ? 'border-red-900 bg-red-950/50 text-red-200' : 'border-emerald-900 bg-emerald-950/40 text-emerald-200'
          }`}
        >
          {message.text}
        </p>
      )}

      {tab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-[#2c2b28]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#1c1c1a] font-mono text-[11px] uppercase tracking-[0.12em] text-[#8a8780]">
              <tr>
                <th className="px-4 py-3 font-medium">Pengguna</th>
                <th className="px-4 py-3 font-medium">Peran</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Render</th>
                <th className="px-4 py-3 font-medium">Bergabung</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users === null && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#8a8780]">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </td>
                </tr>
              )}
              {users?.map((u) => {
                const isMe = u.id === meId;
                const busy = busyId === u.id;
                return (
                  <tr key={u.id} className="border-t border-[#2c2b28]">
                    <td className="px-4 py-3">
                      <p className="font-semibold">
                        {u.name} {isMe && <span className="text-[#8a8780]">(kamu)</span>}
                      </p>
                      <p className="text-[13px] text-[#8a8780]">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md border px-2 py-1 font-mono text-[11px] uppercase ${
                          u.role === 'superadmin' ? 'border-[#ea580c]/50 bg-[#ea580c]/15 text-[#f08a4b]' : 'border-[#2c2b28] text-[#b9b6ae]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.disabled ? <span className="text-red-300">Nonaktif</span> : <span className="text-emerald-300">Aktif</span>}</td>
                    <td className="px-4 py-3 font-mono">{u.renders}</td>
                    <td className="px-4 py-3 text-[#b9b6ae]">{fmtDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      {isMe ? (
                        <p className="text-right text-[13px] text-[#6f6c66]">Akun sendiri</p>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => act(u, 'PATCH', { role: u.role === 'superadmin' ? 'user' : 'superadmin' })}
                            className="rounded-lg border border-[#2c2b28] px-3 py-1.5 text-[13px] font-semibold hover:border-[#4a4843] disabled:opacity-50"
                          >
                            {u.role === 'superadmin' ? 'Jadikan user' : 'Jadikan admin'}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => act(u, 'PATCH', { disabled: !u.disabled })}
                            className="rounded-lg border border-[#2c2b28] px-3 py-1.5 text-[13px] font-semibold hover:border-[#4a4843] disabled:opacity-50"
                          >
                            {u.disabled ? 'Aktifkan' : 'Nonaktifkan'}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => act(u, 'DELETE', undefined, `Hapus akun ${u.email}? Tindakan ini tidak bisa dibatalkan.`)}
                            className="rounded-lg border border-red-900 px-3 py-1.5 text-[13px] font-semibold text-red-300 hover:bg-red-950 disabled:opacity-50"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'renders' && (
        <div className="overflow-x-auto rounded-2xl border border-[#2c2b28]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#1c1c1a] font-mono text-[11px] uppercase tracking-[0.12em] text-[#8a8780]">
              <tr>
                <th className="px-4 py-3 font-medium">Reel</th>
                <th className="px-4 py-3 font-medium">Pemilik</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Dibuat</th>
                <th className="px-4 py-3 font-medium text-right">File</th>
              </tr>
            </thead>
            <tbody>
              {renders?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[#8a8780]">
                    Belum ada render dari studio.
                  </td>
                </tr>
              )}
              {renders?.map((r) => (
                <tr key={r.id} className="border-t border-[#2c2b28]">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{r.title}</p>
                    <p className="font-mono text-[12px] text-[#8a8780]">
                      {r.id} · {r.format}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[#b9b6ae]">{r.ownerEmail}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md border px-2 py-1 font-mono text-[11px] uppercase ${STATE_STYLE[r.state] ?? 'border-[#2c2b28] text-[#b9b6ae]'}`}>
                      {r.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#b9b6ae]">{fmtDate(r.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {r.hasFile ? (
                      <a
                        href={`/api/render/${r.id}/file?download=1`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#2c2b28] px-3 py-1.5 text-[13px] font-semibold hover:border-[#4a4843]"
                      >
                        <Download className="h-3.5 w-3.5" /> MP4
                      </a>
                    ) : (
                      <span className="text-[#6f6c66]">–</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
