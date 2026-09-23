import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RaudaGo Repartidores — Todos los pedidos de Culiacán en un solo lugar',
  description:
    'Ves el precio, la distancia y el destino antes de aceptar. Sin regatear, sin grupos de WhatsApp, sin sorpresas.',
  openGraph: {
    title: 'RaudaGo Repartidores — Todos los pedidos de Culiacán en un solo lugar',
    description:
      'Ves el precio, la distancia y el destino antes de aceptar. Sin regatear, sin grupos de WhatsApp, sin sorpresas.',
    url: 'https://raudago.com/repartidor',
    siteName: 'RaudaGo',
    images: [
      {
        url: 'https://raudago.com/images/repartidor.png',
        width: 1456,
        height: 816,
        alt: 'Repartidor RaudaGo en moto en Culiacán',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RaudaGo Repartidores — Todos los pedidos de Culiacán en un solo lugar',
    description:
      'Ves el precio, la distancia y el destino antes de aceptar. Sin regatear, sin grupos de WhatsApp, sin sorpresas.',
    images: ['https://raudago.com/images/repartidor.png'],
  },
};

export default function RepartidorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
