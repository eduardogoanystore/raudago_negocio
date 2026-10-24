'use client';

import { useState } from 'react';

export function FaqSection() {
  const FAQS = [
    {
      q: '¿Tengo que dejar mi grupo de WhatsApp?',
      a: 'No. Puedes probar RaudaGo sin dejar nada. Muchos repartidores usan ambos al principio y terminan prefiriendo la app porque ven el precio antes de aceptar.',
    },
    {
      q: '¿Necesito vehículo propio?',
      a: 'Sí: moto, auto o bici. Lo que importa es que seas tú quien lo conduce y que puedas moverte dentro de Culiacán.',
    },
    {
      q: '¿Cómo y cuándo me pagan los pedidos?',
      a: 'Directo a ti. El negocio o el cliente te paga en efectivo o transferencia al momento de la entrega. RaudaGo no retiene ni distribuye el dinero.',
    },
    {
      q: '¿Y si no tengo pedidos suficientes?',
      a: 'Por eso empiezas gratis los primeros 7 días. Si en ese tiempo no ves un volumen que valga la pena, no pagas nada y sin complicaciones.',
    },
    {
      q: '¿Cuánto cobro por pedido?',
      a: 'Depende de los km: $50 hasta 3.4 km y $5 más por cada kilómetro adicional, hasta $100 a 13.4 km. Lo ves en la pantalla antes de aceptar, siempre.',
    },
  ];

  const [openFaq, setOpenFaq] = useState<number>(-1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {FAQS.map((faq, i) => {
        const isOpen = openFaq === i;
        return (
          <div
            key={i}
            style={{
              background: '#FFFDFA',
              border: '1px solid #DED7C9',
              borderRadius: 18,
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpenFaq(isOpen ? -1 : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '20px 24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#121214', lineHeight: 1.4 }}>
                {faq.q}
              </span>
              <div
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#6C47FF', display: 'grid', placeItems: 'center', flex: 'none',
                }}
              >
                {isOpen ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                )}
              </div>
            </button>
            {isOpen && (
              <div style={{ padding: '0 24px 20px' }}>
                <p style={{ fontSize: 15, color: '#57544f', lineHeight: 1.65, margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
