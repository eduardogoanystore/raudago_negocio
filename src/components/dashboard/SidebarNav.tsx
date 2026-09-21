'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav>
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href.endsWith('/') ? false : pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'block',
              padding: '0.6rem 0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '0.25rem',
              color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
              background: isActive ? 'rgba(108,71,255,0.35)' : 'transparent',
              fontSize: '0.9rem',
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
