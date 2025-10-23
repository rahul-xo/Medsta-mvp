import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapClick({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const AddressPicker = ({
  label = 'Address',
  placeholder = 'Full address',
  address,
  onChange, // function(nextAddress)
  lat,
  lng,
  onLocationChange, // function({lat, lng})
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(lat && lng ? [lat, lng] : null);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
      const data = await res.json();
      return data?.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch {
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  const useCurrent = () => {
    if (!navigator.geolocation) return alert('Geolocation is not supported');
    navigator.geolocation.getCurrentPosition(async (gps) => {
      const { latitude, longitude } = gps.coords;
      onLocationChange?.({ lat: latitude, lng: longitude });
      const addr = await reverseGeocode(latitude, longitude);
      onChange?.(addr);
      setPos([latitude, longitude]);
    }, () => alert('Unable to fetch current location'));
  };

  const openMap = () => {
    setOpen(true);
    setPos(pos || (lat && lng ? [lat, lng] : [20.5937, 78.9629]));
  };

  const confirmMap = async () => {
    if (!pos) return;
    const [latitude, longitude] = pos;
    onLocationChange?.({ lat: latitude, lng: longitude });
    const addr = await reverseGeocode(latitude, longitude);
    onChange?.(addr);
    setOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
        <button type="button" className="inline-flex items-center gap-2 hover:text-slate-800" onClick={openMap}>
          <span role="img" aria-label="map">🗺️</span> Choose on Map
        </button>
        <button type="button" className="inline-flex items-center gap-2 hover:text-slate-800" onClick={useCurrent}>
          <span role="img" aria-label="pin">📍</span> Use Current Location
        </button>
      </div>
      <textarea
        value={address || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md h-24"
      />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-[90vw] max-w-2xl p-4">
            <h3 className="text-lg font-semibold mb-2">Pick location</h3>
            <div className="h-80 rounded overflow-hidden border border-slate-200">
              <MapContainer center={pos || [20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                {pos && <Marker position={pos} />}
                <MapClick onSelect={setPos} />
              </MapContainer>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button className="px-4 py-2 rounded-md border border-slate-200" onClick={() => setOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-md bg-green-600 text-white disabled:opacity-50" disabled={!pos} onClick={confirmMap}>Use this location</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPicker;
