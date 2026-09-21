import { cookies } from 'next/headers';

interface BusinessTokenPayload {
  sub: string;   // business_account_id
  type: string;  // 'business'
  email: string;
  exp: number;
}

export async function validateSession(): Promise<BusinessTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('businessToken')?.value;
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as BusinessTokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
