'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GraphQLClient } from 'graphql-request';

const ENDPOINT = process.env.GRAPHQL_ENDPOINT ?? 'http://localhost:8787';

const TOKEN_TTL_MS = 60 * 60 * 24 * 1000; // 24h
const SESSION_TTL_MS = 60 * 60 * 24 * 7 * 1000; // 7 days

// ─── GraphQL ──────────────────────────────────────────────────────────────────

// TODO: Confirmar que signupBusiness ya devuelve business_id, business_slug, trialDays.
// Actualmente en auth.ts se usa signupBusiness para el flujo de registro rápido.
// El onboarding de 3 pasos usa la misma mutation en W1.
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

// TODO: Verificar que el backend exponga createBranch con estos campos.
// Si la mutation no existe aún, este action guarda las cookies y redirige igualmente.
const CREATE_BRANCH = `
  mutation createBranch(
    $business_id: String!
    $name: String!
    $address: String!
    $city: String!
    $phone: String
  ) {
    createBranch(
      business_id: $business_id
      name: $name
      address: $address
      city: $city
      phone: $phone
    ) {
      id
    }
  }
`;

const CREATE_CHECKOUT = `
  mutation createSubscriptionCheckout($planId: String!, $interval: BillingInterval!) {
    createSubscriptionCheckout(planId: $planId, interval: $interval) {
      checkoutUrl
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OnboardingActionState {
  error?: string;
  redirectTo?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseGqlError(err: unknown, fallback: string): string {
  const gqlErr = err as { response?: { errors?: { message: string }[] } };
  const raw = gqlErr?.response?.errors?.[0]?.message ?? '';

  if (!raw) return fallback;

  const msg = raw.toLowerCase();
  if (msg.includes('email') && (msg.includes('registrado') || msg.includes('existe') || msg.includes('taken') || msg.includes('already'))) {
    return 'Este correo ya tiene una cuenta. Intenta con otro o inicia sesión.';
  }
  if (msg.includes('contraseña') || msg.includes('password')) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (msg.includes('teléfono') || msg.includes('phone')) {
    return 'El número de teléfono no es válido.';
  }

  return raw;
}

// ─── W1 — Datos del negocio ───────────────────────────────────────────────────

export async function registerNegocioStep1Action(
  formData: FormData
): Promise<OnboardingActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const first_name = formData.get('owner_first_name') as string;
  const last_name = formData.get('owner_last_name') as string;
  const business_name = formData.get('business_name') as string;
  const phone = (formData.get('phone') as string) || undefined;

  if (!email || !password || !first_name || !last_name || !business_name) {
    return { error: 'Todos los campos son requeridos' };
  }

  const client = new GraphQLClient(ENDPOINT);

  let data: {
    signupBusiness: {
      token: string;
      user: {
        id?: string;
        business_id?: string;
        business_slug?: string;
        trial_days?: number;
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
    return { error: parseGqlError(err, 'Error al crear la cuenta. Intenta de nuevo.') };
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

  if (user?.id) {
    cookieStore.set('business_account_id', user.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + SESSION_TTL_MS),
      path: '/',
    });
  }

  if (user?.business_id) {
    cookieStore.set('business_id', user.business_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + TOKEN_TTL_MS),
      path: '/',
    });
  }

  cookieStore.set('onboarding_step', 'sucursal', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + SESSION_TTL_MS),
    path: '/',
  });

  return { redirectTo: '/registro/sucursal' };
}

// ─── W2 — Sucursal ────────────────────────────────────────────────────────────

export async function registerNegocioStep2Action(
  formData: FormData
): Promise<OnboardingActionState> {
  const address = formData.get('address') as string;
  const referencia = (formData.get('referencia') as string) || undefined;
  const phone = (formData.get('phone') as string) || undefined;
  const lat = (formData.get('lat') as string) || undefined;
  const lng = (formData.get('lng') as string) || undefined;
  const city = (formData.get('city') as string) || 'Culiacán';

  if (!address) {
    return { error: 'La dirección de recolección es requerida.' };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('businessToken')?.value;
  const business_id = cookieStore.get('business_id')?.value;

  if (!token) {
    redirect('/registro');
  }

  // TODO: Descomentar cuando el backend exponga createBranch.
  /*
  const client = new GraphQLClient(ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let branchId: string | undefined;
  try {
    const data = await client.request<{ createBranch: { id: string } }>(CREATE_BRANCH, {
      business_id: business_id ?? '',
      name: address.split(',')[0] ?? address, // usar primera parte de la dirección como nombre
      address,
      city,
      phone,
      referencia,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
    });
    branchId = data.createBranch.id;
  } catch (err: unknown) {
    return { error: parseGqlError(err, 'Error al crear la sucursal. Intenta de nuevo.') };
  }

  if (branchId) {
    cookieStore.set('negocio_branch_id', branchId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + SESSION_TTL_MS),
      path: '/',
    });
  }
  */

  cookieStore.set('onboarding_step', 'plan', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + SESSION_TTL_MS),
    path: '/',
  });

  return { redirectTo: '/registro/plan' };
}

// ─── W3 — Checkout ────────────────────────────────────────────────────────────

export async function createNegocioCheckoutAction(
  planId: string,
  interval: string
): Promise<OnboardingActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get('businessToken')?.value;

  if (!token) {
    redirect('/registro');
  }

  const client = new GraphQLClient(ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let checkoutUrl: string;
  try {
    const data = await client.request<{
      createSubscriptionCheckout: { checkoutUrl: string };
    }>(CREATE_CHECKOUT, { planId, interval });
    checkoutUrl = data.createSubscriptionCheckout.checkoutUrl;
  } catch (err: unknown) {
    return { error: parseGqlError(err, 'Error al iniciar el pago. Intenta de nuevo.') };
  }

  // Onboarding completado — limpiar cookie de paso
  cookieStore.delete('onboarding_step');

  redirect(checkoutUrl);
}
