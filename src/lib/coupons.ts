import 'server-only';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percent' | 'nominal';
  value: number; // e.g. 20 (20%) or 50000 (Rp 50.000)
  minAmount?: number; // Minimum purchase amount
  maxUses?: number; // Unlimited if undefined
  usedCount: number;
  expiryDate?: string; // ISO date string
  isActive: boolean;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const COUPONS_FILE = path.join(DATA_DIR, 'coupons.json');

const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'AUDIRABARU',
    description: 'Diskon 20% Sambutan Pelanggan Baru AUDIRA Motion',
    discountType: 'percent',
    value: 20,
    minAmount: 100000,
    maxUses: 100,
    usedCount: 7,
    isActive: true,
    createdAt: '2026-11-01T00:00:00.000Z'
  },
  {
    code: 'SUPERCREATOR',
    description: 'Potongan Langsung Rp100.000 untuk Paket Creator Lab & DFY',
    discountType: 'nominal',
    value: 100000,
    minAmount: 400000,
    maxUses: 50,
    usedCount: 12,
    isActive: true,
    createdAt: '2026-11-02T00:00:00.000Z'
  },
  {
    code: 'PROMO3D',
    description: 'Promo Spesial 15% Semua Lisensi Remotion 3D',
    discountType: 'percent',
    value: 15,
    minAmount: 140000,
    maxUses: 200,
    usedCount: 23,
    isActive: true,
    createdAt: '2026-11-03T00:00:00.000Z'
  }
];

export function readCoupons(): Coupon[] {
  if (!existsSync(COUPONS_FILE)) {
    writeCoupons(INITIAL_COUPONS);
    return INITIAL_COUPONS;
  }
  try {
    const raw = readFileSync(COUPONS_FILE, 'utf8');
    return JSON.parse(raw) as Coupon[];
  } catch (err) {
    console.error('Error reading coupons.json:', err);
    return INITIAL_COUPONS;
  }
}

export function writeCoupons(coupons: Coupon[]) {
  mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${COUPONS_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(coupons, null, 2));
  renameSync(tmp, COUPONS_FILE);
}

export function validateCoupon(
  code: string, 
  rawAmount: number
): { valid: boolean; discount: number; finalAmount: number; coupon?: Coupon; error?: string } {
  const coupons = readCoupons();
  const c = coupons.find(item => item.code.toUpperCase() === code.trim().toUpperCase());

  if (!c) {
    return { valid: false, discount: 0, finalAmount: rawAmount, error: 'Kode kupon tidak ditemukan' };
  }

  if (!c.isActive) {
    return { valid: false, discount: 0, finalAmount: rawAmount, error: 'Kode kupon sudah tidak aktif' };
  }

  if (c.expiryDate && new Date(c.expiryDate) < new Date()) {
    return { valid: false, discount: 0, finalAmount: rawAmount, error: 'Kode kupon sudah kedaluwarsa' };
  }

  if (c.maxUses && c.usedCount >= c.maxUses) {
    return { valid: false, discount: 0, finalAmount: rawAmount, error: 'Kuota pemakaian kupon sudah habis' };
  }

  if (c.minAmount && rawAmount < c.minAmount) {
    return { 
      valid: false, 
      discount: 0, 
      finalAmount: rawAmount, 
      error: `Minimal transaksi untuk kupon ini adalah Rp${c.minAmount.toLocaleString('id-ID')}` 
    };
  }

  let discount = 0;
  if (c.discountType === 'percent') {
    discount = Math.round((rawAmount * c.value) / 100);
  } else {
    discount = Math.min(c.value, rawAmount);
  }

  const finalAmount = Math.max(0, rawAmount - discount);

  return {
    valid: true,
    discount,
    finalAmount,
    coupon: c
  };
}

export function incrementCouponUsage(code: string): boolean {
  const coupons = readCoupons();
  const index = coupons.findIndex(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (index === -1) return false;

  coupons[index].usedCount = (coupons[index].usedCount || 0) + 1;
  writeCoupons(coupons);
  return true;
}

export function saveCoupon(coupon: Coupon): Coupon {
  const coupons = readCoupons();
  const normCode = coupon.code.trim().toUpperCase();
  const index = coupons.findIndex(c => c.code.toUpperCase() === normCode);

  const updated: Coupon = {
    ...coupon,
    code: normCode,
    usedCount: index >= 0 ? coupons[index].usedCount : 0,
    createdAt: index >= 0 ? coupons[index].createdAt : new Date().toISOString()
  };

  if (index >= 0) {
    coupons[index] = updated;
  } else {
    coupons.unshift(updated);
  }

  writeCoupons(coupons);
  return updated;
}

export function deleteCoupon(code: string): boolean {
  const coupons = readCoupons();
  const normCode = code.trim().toUpperCase();
  const filtered = coupons.filter(c => c.code.toUpperCase() !== normCode);
  if (filtered.length === coupons.length) return false;
  writeCoupons(filtered);
  return true;
}
