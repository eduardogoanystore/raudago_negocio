'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GraphQLClient } from 'graphql-request';
import { verifyCaptcha } from '@/utils/captcha';

const ENDPOINT = process.env.GRAPHQL_ENDPOINT ?? 'http://localhost:8787';

// AuthPayload devuelve { token: String!, user: JSON }
// loginBusiness → user: { id, email, first_name, last_name }
// signupBusiness → user: { id, email, first_name, last_name, business_id, business_slug }

const LOGIN_BUSINESS = `
  mutation loginBusiness($email: String!, $password: String!) {
    loginBusiness(email: $email, password: $password) {
      token
      user
    }
  }
`;

const SIGNUP_BUSINESS = `
  mutation signupBusiness(
    $email: String!
    $password: String!
    $first_name: String!
    $last_name: String!
    $business_name: String!
    $phone: String
  ) {
    signupBusiness(
      email: $email
      password: $password
      first_name: $first_name
      last_name: $last_name
      business_name: $business_name
      phone: $phone
    ) {
      token
      user
    }
  }
`;

// JWT expira en 24h según el backend (generateJWT hardcodea 24h)
// El token no incluye expiresAt en la respuesta — calculamos nosotros
const TOKEN_TTL_MS = 60 * 60 * 24 * 1000; // 24h en ms

export interface AuthActionState {
  error?: string;
}

export async function loginBusinessAction(
  captchaToken: string | null,
  formData: FormData
): Promise<AuthActionState> {
  if (!captchaToken) return { error: 'Verifica que no eres un bot' };
  const captcha = await verifyCaptcha(captchaToken);
  if (!captcha || !captcha.success || captcha.score < 0.5) {
    return { error: 'Verifica que no eres un bot' };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos' };
  }

  const client = new GraphQLClient(ENDPOINT);

  let data: { loginBusiness: { token: string; user: Record<string, unknown> & { id?: string } } };
  try {
    data = await client.request(LOGIN_BUSINESS, { email, password });
  } catch (err: unknown) {
    const gqlErr = err as { response?: { errors?: { message: string }[] } };
    const message =
      gqlErr?.response?.errors?.[0]?.message ?? 'Error al iniciar sesión. Intenta de nuevo.';
    return { error: message };
  }

  const { token, user } = data.loginBusiness;

  const cookieStore = await cookies();
  cookieStore.set('businessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + TOKEN_TTL_MS),
    path: '/',
  });

  // Persistir el account id para redirigir al NIP cuando el token expire
  if (user?.id) {
    cookieStore.set('business_account_id', user.id as string, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  // loginBusiness no devuelve slug → redirigir al dispatcher /negocio/
  redirect('/negocio/');
}

export async function signupBusinessAction(
  captchaToken: string | null,
  formData: FormData
): Promise<AuthActionState> {
  if (!captchaToken) return { error: 'Verifica que no eres un bot' };
  const captcha = await verifyCaptcha(captchaToken);
  if (!captcha || !captcha.success || captcha.score < 0.5) {
    return { error: 'Verifica que no eres un bot' };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const first_name = formData.get('first_name') as string;
  const last_name = formData.get('last_name') as string;
  const business_name = formData.get('business_name') as string;
  const phone = (formData.get('phone') as string) || undefined;

  if (!email || !password || !first_name || !last_name || !business_name) {
    return { error: 'Todos los campos obligatorios deben completarse' };
  }

  const client = new GraphQLClient(ENDPOINT);

  let data: {
    signupBusiness: {
      token: string;
      user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        business_id: string;
        business_slug: string;
      };
    };
  };
  try {
    data = await client.request(SIGNUP_BUSINESS, {
      email,
      password,
      first_name,
      last_name,
      business_name,
      phone,
    });
  } catch (err: unknown) {
    const gqlErr = err as { response?: { errors?: { message: string }[] } };
    const message =
      gqlErr?.response?.errors?.[0]?.message ?? 'Error al crear la cuenta. Intenta de nuevo.';
    return { error: message };
  }

  const { token, user } = data.signupBusiness;

  const cookieStore = await cookies();
  cookieStore.set('businessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + TOKEN_TTL_MS),
    path: '/',
  });

  // signupBusiness devuelve business_id y business_slug → guardar id y redirect directo
  if (user?.business_id) {
    cookieStore.set('business_id', user.business_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(Date.now() + TOKEN_TTL_MS),
    });
  }

  if (user?.business_slug) {
    redirect(`/negocio/${user.business_slug}/`);
  }

  redirect('/negocio/');
}

export async function logoutBusinessAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('businessToken');
  cookieStore.delete('business_id');
  redirect('/negocio/login');
}
