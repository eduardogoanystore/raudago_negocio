'use client';

import { useEffect, useRef, useState } from 'react';

export interface PlaceResult {
  address: string;
  lat: number | null;
  lng: number | null;
  city: string;
}

interface Props {
  onSelect: (place: PlaceResult) => void;
  inputStyle: React.CSSProperties;
  placeholder?: string;
}

let isInitializing = false;
let isLoaded = false;
const loadCallbacks: (() => void)[] = [];

function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    if (isLoaded) {
      resolve();
      return;
    }

    loadCallbacks.push(() => resolve());

    if (isInitializing) return;
    isInitializing = true;

    (window as any).initGoogleMaps = () => {
      isLoaded = true;
      isInitializing = false;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };

    const script = document.createElement('script');
    // Añadimos &loading=async para cumplir con las mejores prácticas de Google Maps
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}

export function PlacesAutocomplete({ onSelect, inputStyle, placeholder }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setReady(true);
      return;
    }

    loadGoogleMaps(apiKey).then(() => {
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    let isMounted = true;
    let placeAutocomplete: any = null;

    const initNewAutocomplete = async () => {
      try {
        const { PlaceAutocompleteElement } = await (window.google.maps as any).importLibrary('places');

        if (!isMounted || !containerRef.current) return;

        // Configuramos las restricciones de país usando includedRegionCodes en lugar de componentRestrictions
        placeAutocomplete = new PlaceAutocompleteElement({
          includedRegionCodes: ['mx'], // Restringe a México de forma nativa en la nueva API
          placeholder: placeholder ?? 'Av. Álvaro Obregón 1840, Centro, Culiacán',
        });
        
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(placeAutocomplete);

        placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }: any) => {
          if (!placePrediction) return;

          const place = placePrediction.toPlace();
          
          await place.fetchFields({
            fields: ['formattedAddress', 'location', 'addressComponents'],
          });

          const address = place.formattedAddress ?? '';
          const lat = place.location?.lat() ?? null;
          const lng = place.location?.lng() ?? null;

          const cityComponent = place.addressComponents?.find(
            (c: any) => c.types.includes('locality') || c.types.includes('administrative_area_level_2')
          );
          const city = cityComponent?.longValue ?? cityComponent?.text ?? '';

          setValue(address);
          onSelect({ address, lat, lng, city });
        });
      } catch (error) {
        console.error('Error al inicializar Places API (New):', error);
      }
    };

    initNewAutocomplete();

    return () => {
      isMounted = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [ready, onSelect, placeholder]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? 'Av. Álvaro Obregón 1840, Centro, Culiacán'}
        required
        autoComplete="off"
        style={inputStyle}
      />
    );
  }

  return (
    <>
      <style>{`
        gmp-place-autocomplete {
          width: 100%;
          display: block;
          color-scheme: light;
          --gmp-place-autocomplete-background-color: #FFFDFA;
          --gmp-place-autocomplete-border-color: #DED7C9;
          --gmp-place-autocomplete-border-radius: 12px;
          --gmp-place-autocomplete-font-family: inherit;
          --gmp-place-autocomplete-font-size: 15px;
          --gmp-place-autocomplete-color: #121214;
          --gmp-place-autocomplete-placeholder-color: #aba79f;
          --gmp-place-autocomplete-input-height: 48px;
          --gmp-place-autocomplete-padding-x: 16px;
          --gmpx-color-surface: #FFFDFA;
          --gmpx-color-on-surface: #121214;
          --gmpx-color-on-surface-variant: #aba79f;
          --gmpx-color-primary: #6C47FF;
          --gmpx-font-family-base: inherit;
          --gmpx-font-size-base: 15px;
        }
        gmp-place-autocomplete:focus-within {
          --gmp-place-autocomplete-border-color: #6C47FF;
          --gmpx-color-primary: #6C47FF;
          outline: none;
        }
      `}</style>
      <div ref={containerRef} style={{ width: '100%' }} />
    </>
  );
}