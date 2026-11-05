import 'server-only';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { randomBytes, randomUUID } from 'node:crypto';

export type OrderStatus = 'pending' | 'verified' | 'sent' | 'completed' | 'cancelled';

export interface OrderRecord {
  id: string;
  customerName: string;
  customerWhatsApp: string;
  customerEmail: string;
  tier: string;
  tierName: string;
  amount: string;
  paymentMethod: string;
  status: OrderStatus;
  licenseKey: string;
  createdAt: string;
  notes?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-2026-001',
    customerName: 'Budi Santoso (Studio Kreasi)',
    customerWhatsApp: '6281234567890',
    customerEmail: 'budi@studiokreasi.id',
    tier: 'lab',
    tierName: 'Creator Lab Ultimate',
    amount: 'Rp499.000',
    paymentMethod: 'QRIS',
    status: 'verified',
    licenseKey: 'AUD-LAB-2026-9A82F1',
    createdAt: '2026-11-04T10:15:00.000Z',
    notes: 'Lisensi Creator Lab lengkap dengan source code + MCP Mesh'
  },
  {
    id: 'ORD-2026-002',
    customerName: 'Siti Rahma (Agency Digital)',
    customerWhatsApp: '6285698765432',
    customerEmail: 'siti@agencydigital.com',
    tier: 'dfy_bundle',
    tierName: 'Jasa DFY : Paket 5 Video Reels',
    amount: 'Rp1.399.000',
    paymentMethod: 'BCA Transfer',
    status: 'completed',
    licenseKey: 'AUD-DFY-2026-44B12C',
    createdAt: '2026-11-05T08:30:00.000Z',
    notes: '3 video explainer, 2 video 3D gadget, hasil sudah dikirim ke WA'
  },
  {
    id: 'ORD-2026-003',
    customerName: 'Dimas Aditya (Freelance 3D)',
    customerWhatsApp: '6287811223344',
    customerEmail: 'dimas@motion.dev',
    tier: 'master',
    tierName: 'Master Director Pack',
    amount: 'Rp299.000',
    paymentMethod: 'QRIS',
    status: 'sent',
    licenseKey: 'AUD-MAS-2026-7E33D8',
    createdAt: '2026-11-05T12:00:00.000Z',
    notes: 'Akses 29 Kit + MCP Mesh terkirim'
  }
];

export function generateLicenseKey(tier: string): string {
  const prefix = tier.toUpperCase().includes('LAB') ? 'AUD-LAB' :
                 tier.toUpperCase().includes('MASTER') ? 'AUD-MAS' :
                 tier.toUpperCase().includes('DFY') ? 'AUD-DFY' : 'AUD-STR';
  const year = '2026';
  const randomHex = randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${year}-${randomHex}`;
}

export function readOrders(): OrderRecord[] {
  if (!existsSync(ORDERS_FILE)) {
    writeOrders(INITIAL_ORDERS);
    return INITIAL_ORDERS;
  }
  try {
    const raw = readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(raw) as OrderRecord[];
  } catch (err) {
    console.error('Error reading orders.json:', err);
    return INITIAL_ORDERS;
  }
}

export function writeOrders(orders: OrderRecord[]) {
  mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${ORDERS_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(orders, null, 2));
  renameSync(tmp, ORDERS_FILE);
}

export function createOrder(data: {
  customerName: string;
  customerWhatsApp: string;
  customerEmail: string;
  tier: string;
  tierName: string;
  amount: string;
  paymentMethod: string;
  status?: OrderStatus;
  notes?: string;
}): OrderRecord {
  const orders = readOrders();
  const nextNum = (orders.length + 1).toString().padStart(3, '0');
  const newOrder: OrderRecord = {
    id: `ORD-2026-${nextNum}`,
    customerName: data.customerName.trim(),
    customerWhatsApp: data.customerWhatsApp.replace(/\D/g, ''),
    customerEmail: data.customerEmail.trim().toLowerCase(),
    tier: data.tier,
    tierName: data.tierName,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    status: data.status || 'pending',
    licenseKey: generateLicenseKey(data.tier),
    createdAt: new Date().toISOString(),
    notes: data.notes
  };

  writeOrders([newOrder, ...orders]);
  return newOrder;
}

export function updateOrder(id: string, updates: Partial<OrderRecord>): OrderRecord | null {
  const orders = readOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...updates,
    id: orders[index].id, // protect ID
  };

  writeOrders(orders);
  return orders[index];
}

export function deleteOrder(id: string): boolean {
  const orders = readOrders();
  const filtered = orders.filter(o => o.id !== id);
  if (filtered.length === orders.length) return false;
  writeOrders(filtered);
  return true;
}
