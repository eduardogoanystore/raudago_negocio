'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

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

let loaderInstance: Loader | null = null;

function getLoader() {
  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
      version: 'weekly',
      libraries: ['places'],
    });
  }
  return loaderInstance;
}

export function PlacesAutocomplete({ onSelect, inputStyle, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setReady(true); // fallback: plain text input
      return;
    }

    getLoader()
      .load()
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'mx' },
      fields: ['formatted_address', 'geometry', 'address_components'],
      types: ['address'],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location?.lat() ?? null;
      const lng = place.geometry.location?.lng() ?? null;

      // Extract city from address_components
      const cityComponent = place.address_components?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.types.includes('locality') || c.types.includes('administrative_area_level_2')
      );
      const city = cityComponent?.long_name ?? 'Culiacán';

      const address = place.formatted_address ?? inputRef.current?.value ?? '';
      setValue(address);
      onSelect({ address, lat, lng, city });
    });

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).google?.maps?.event?.clearInstanceListeners?.(autocomplete);
    };
  }, [ready, onSelect]);

  return (
    <input
      ref={inputRef}
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
