import { NextResponse } from 'next/server';
import { confirmPairCode } from '@/lib/server/admin-auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; code?: string } | null;
  const email = body?.email?.trim();
  const code = body?.code?.trim();

  if (!email || !code) {
    return NextResponse.json({ error: 'Informe o e-mail e o código.' }, { status: 400 });
  }

  const session = confirmPairCode(email, code);
  if (!session) {
    return NextResponse.json({ error: 'Código inválido ou expirado.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true, session });
}
