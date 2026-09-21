import type { Metadata } from 'next';
import { Poppins, Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'RaudaGo — Reparto para negocios en Culiacán',
  description:
    'Publica el pedido en 15 segundos y el repartidor más cercano lo toma solo. Sin WhatsApp, sin negociar precios, sin perder el hilo.',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'RaudaGo — Reparto para negocios en Culiacán',
    description:
      'Publica el pedido en 15 segundos y el repartidor más cercano lo toma solo. Sin WhatsApp, sin negociar precios, sin perder el hilo.',
    url: 'https://raudago-negocio.vercel.app',
    siteName: 'RaudaGo',
    images: [
      {
        url: 'https://raudago-negocio.vercel.app/raudagoRedes.png',
        width: 1080,
        height: 1080,
        alt: 'RaudaGo — Reparto para negocios en Culiacán',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RaudaGo — Reparto para negocios en Culiacán',
    description:
      'Publica el pedido en 15 segundos y el repartidor más cercano lo toma solo. Sin WhatsApp, sin negociar precios, sin perder el hilo.',
    images: ['https://raudago-negocio.vercel.app/raudagoRedes.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${poppins.variable} ${jakarta.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
