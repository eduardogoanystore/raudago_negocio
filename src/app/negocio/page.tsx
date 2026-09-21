import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { validateSession } from '@/utils/auth/validateSession';
import { getServerClient } from '@/graphql/client';

const MY_BUSINESS_QUERY = `
  query myBusiness {
    myBusiness {
      id
      slug
    }
  }
`;

export default async function NegocioIndexPage() {
  const session = await validateSession();
  if (!session) redirect('/negocio/login');

  try {
    const client = await getServerClient();
    const data = await client.request<{ myBusiness: { id: string; slug: string } | null }>(
      MY_BUSINESS_QUERY
    );
    const business = data.myBusiness;
    if (business?.slug) {
      const cookieStore = await cookies();
      cookieStore.set('business_id', business.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      redirect(`/negocio/${business.slug}/`);
    }
  } catch {
    // Si falla la query, mandamos a login
  }

  redirect('/negocio/login');
}
