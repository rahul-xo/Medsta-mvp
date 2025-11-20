import { create } from 'zustand';

// Simple location store: asks for geolocation, reverse geocodes via OpenStreetMap Nominatim,
// and persists a small summary in localStorage so NavBar can display it.
export const useLocationStore = create((set) => ({
  coords: null, // { lat, lon }
  place: null, // e.g., "Bakshi Ka Talab, Lucknow"
  loading: false,
  error: null,

  initFromStorage: () => {
    try {
      const raw = localStorage.getItem('medsta.location');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.place || parsed.coords)) {
        set({ place: parsed.place || null, coords: parsed.coords || null });
      }
    } catch {
      // ignore
    }
  },

  requestLocation: async () => {
    if (!('geolocation' in navigator)) {
      set({ error: 'Geolocation not supported in this browser.' });
      return;
    }
    set({ loading: true, error: null });
    const getPosition = () =>
      new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60_000,
        }),
      );

    try {
      const pos = await getPosition();
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      let place = null;
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
        const res = await fetch(url, {
          headers: {
            // Public reverse geocoding; set an identifiable referer to be polite.
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          const a = data.address || {};
          // Prefer suburb/locality + city/state for compact display
          const locality = a.neighbourhood || a.suburb || a.village || a.town || a.city_district;
          const city = a.city || a.town || a.village || a.county;
          const state = a.state || a.region;
          const pieces = [locality || city, state].filter(Boolean);
          place = pieces.length ? pieces.join(', ') : (data.display_name?.split(',').slice(0,2).join(', ') || null);
        }
      } catch {
        // ignore reverse geocoding failure; fall back to coords
      }

      const coords = { lat, lon };
      const fallback = `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
      set({ coords, place: place || fallback, loading: false });
      try {
        localStorage.setItem('medsta.location', JSON.stringify({ coords, place: place || fallback }));
      } catch {
        // ignore storage write errors
      }
    } catch (err) {
      set({ loading: false, error: err?.message || 'Permission denied' });
    }
  },
}));
