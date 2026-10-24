export const PERMISSIONS_GROUPS = [
  {
    key: 'pedidos',
    label: 'Pedidos',
    permissions: [
      { key: 'pedidos.ver', label: 'Ver pedidos' },
      { key: 'pedidos.crear', label: 'Crear pedido' },
      { key: 'pedidos.cancelar', label: 'Cancelar pedido' },
      { key: 'pedidos.ver_historial', label: 'Ver historial de pedidos' },
    ],
  },
  {
    key: 'empleados',
    label: 'Empleados',
    permissions: [
      { key: 'empleados.ver', label: 'Ver empleados' },
      { key: 'empleados.invitar', label: 'Invitar empleados' },
      { key: 'empleados.gestionar', label: 'Desactivar y eliminar empleados' },
      { key: 'empleados.permisos', label: 'Gestionar permisos y roles' },
    ],
  },
  {
    key: 'configuracion',
    label: 'Configuracion',
    permissions: [
      { key: 'configuracion.ver', label: 'Ver configuracion del negocio' },
      { key: 'configuracion.editar', label: 'Editar nombre, logo y datos' },
    ],
  },
  {
    key: 'facturacion',
    label: 'Facturacion',
    permissions: [
      { key: 'facturacion.ver', label: 'Ver plan y facturacion' },
      { key: 'facturacion.gestionar', label: 'Cambiar plan y metodo de pago' },
    ],
  },
];

export const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
  owner: [
    'pedidos.ver', 'pedidos.crear', 'pedidos.cancelar', 'pedidos.ver_historial',
    'empleados.ver', 'empleados.invitar', 'empleados.gestionar', 'empleados.permisos',
    'configuracion.ver', 'configuracion.editar',
    'facturacion.ver', 'facturacion.gestionar',
  ],
  manager: [
    'pedidos.ver', 'pedidos.crear', 'pedidos.cancelar', 'pedidos.ver_historial',
    'empleados.ver', 'empleados.invitar', 'empleados.gestionar',
    'configuracion.ver', 'configuracion.editar',
    'facturacion.ver',
  ],
  staff: [
    'pedidos.ver', 'pedidos.crear', 'pedidos.cancelar', 'pedidos.ver_historial',
    'empleados.ver',
    'configuracion.ver',
  ],
  counter: [
    'pedidos.ver', 'pedidos.crear',
  ],
};

export function getEffectivePermissions(role: string, overrides: string[]): string[] {
  const rolePerms = ROLE_DEFAULT_PERMISSIONS[role] ?? [];
  return [...new Set([...rolePerms, ...overrides])];
}

export const ROLE_LABELS: Record<string, string> = {
  owner: 'Propietario',
  manager: 'Gerente',
  staff: 'Empleado',
  counter: 'Mostrador',
};
