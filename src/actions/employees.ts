'use server';

import { revalidatePath } from 'next/cache';
import { getServerClient } from '@/graphql/client';
import { redirect } from 'next/navigation';

const INVITE_MEMBER = `
  mutation inviteBusinessMember($email: String!, $role: String!) {
    inviteBusinessMember(email: $email, role: $role) {
      id
      role
      status
      invitation_email
      invitation_token
    }
  }
`;

const DEACTIVATE_MEMBER = `
  mutation deactivateBusinessMember($member_id: ID!) {
    deactivateBusinessMember(member_id: $member_id) {
      id
      status
    }
  }
`;

const REMOVE_MEMBER = `
  mutation removeBusinessMember($member_id: ID!) {
    removeBusinessMember(member_id: $member_id)
  }
`;

const SET_PIN = `
  mutation setBusinessPIN($current_password: String!, $pin: String!) {
    setBusinessPIN(current_password: $current_password, pin: $pin)
  }
`;

const ACCEPT_INVITATION = `
  mutation acceptBusinessInvitation($token: String!, $first_name: String!, $last_name: String!, $password: String!) {
    acceptBusinessInvitation(token: $token, first_name: $first_name, last_name: $last_name, password: $password) {
      token
      user
    }
  }
`;

export async function inviteMemberAction(
  negocio_slug: string,
  _prevState: { error?: string; success?: boolean; invitation_token?: string } | null,
  formData: FormData,
) {
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  if (!email || !role) return { error: 'Email y rol son requeridos' };

  try {
    const client = await getServerClient();
    const data = await client.request<{
      inviteBusinessMember: { id: string; invitation_token?: string };
    }>(INVITE_MEMBER, { email, role });
    revalidatePath(`/negocio/${negocio_slug}/empleados`);
    return { success: true, invitation_token: data.inviteBusinessMember.invitation_token };
  } catch (err: any) {
    return { error: err?.response?.errors?.[0]?.message ?? 'Error al invitar' };
  }
}

export async function deactivateMemberAction(memberId: string, negocio_slug: string) {
  try {
    const client = await getServerClient();
    await client.request(DEACTIVATE_MEMBER, { member_id: memberId });
    revalidatePath(`/negocio/${negocio_slug}/empleados`);
  } catch (err: any) {
    return { error: err?.response?.errors?.[0]?.message ?? 'Error al desactivar' };
  }
}

export async function removeMemberAction(memberId: string, negocio_slug: string) {
  try {
    const client = await getServerClient();
    await client.request(REMOVE_MEMBER, { member_id: memberId });
    revalidatePath(`/negocio/${negocio_slug}/empleados`);
  } catch (err: any) {
    return { error: err?.response?.errors?.[0]?.message ?? 'Error al eliminar' };
  }
}

export async function setPinAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const current_password = formData.get('current_password') as string;
  const pin = formData.get('pin') as string;

  try {
    const client = await getServerClient();
    await client.request(SET_PIN, { current_password, pin });
    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.errors?.[0]?.message ?? 'Error al configurar PIN' };
  }
}

export async function acceptInvitationAction(
  token: string,
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  const first_name = formData.get('first_name') as string;
  const last_name = formData.get('last_name') as string;
  const password = formData.get('password') as string;

  try {
    const { publicClient } = await import('@/graphql/client');
    const data = await publicClient.request<{
      acceptBusinessInvitation: { token: string; user: any };
    }>(ACCEPT_INVITATION, { token, first_name, last_name, password });

    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.set('businessToken', data.acceptBusinessInvitation.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      path: '/',
    });
  } catch (err: any) {
    return { error: err?.response?.errors?.[0]?.message ?? 'Error al activar cuenta' };
  }

  redirect('/negocio/');
}
