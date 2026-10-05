'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href.endsWith('/') ? false : pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              height: 40,
              padding: '0 12px',
              borderRadius: 10,
              color: isActive ? '#ffffff' : '#8E8B93',
              background: isActive ? '#26262C' : 'transparent',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {item.icon && (
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {item.icon}
              </span>
            )}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge != null && (
              <span style={{
                background: '#6C47FF',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 999,
                padding: '1px 7px',
                lineHeight: '18px',
              }}>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
