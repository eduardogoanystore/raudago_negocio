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

export function getEffectivePermissions(rolePermissions: string[], overrides: string[]): string[] {
  return [...new Set([...rolePermissions, ...overrides])];
}

export const ROLE_LABELS: Record<string, string> = {
  owner: 'Propietario',
  manager: 'Gerente',
  staff: 'Empleado',
  counter: 'Mostrador',
};
