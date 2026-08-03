import { NextResponse } from 'next/server';
import { createPairCode } from '@/lib/server/admin-auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim();

  if (!email) {
    return NextResponse.json({ error: 'Informe o e-mail.' }, { status: 400 });
  }

  const code = createPairCode(email);
  return NextResponse.json({ ok: true, ...code });
}
