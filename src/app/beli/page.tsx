import { redirect } from 'next/navigation';

export default async function BeliRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === 'string') qs.set(k, v);
  }
  const qStr = qs.toString();
  redirect(`/order${qStr ? `?${qStr}` : ''}`);
}
