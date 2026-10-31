import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  if (!(await currentUser())) redirect('/login?next=/studio');
  return children;
}
