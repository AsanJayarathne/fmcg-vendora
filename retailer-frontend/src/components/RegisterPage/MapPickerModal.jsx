import { useEffect, useRef, useState } from "react";
import L from "leaflet";

// Fix default marker icon issue with Leaflet in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapPickerModal({ isOpen, onClose, onConfirm, initialLat, initialLng }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const defaultLat = parseFloat(initialLat) || 6.9271;
  const defaultLng = parseFloat(initialLng) || 79.8612;

  const [selectedLat, setSelectedLat] = useState(defaultLat);
  const [selectedLng, setSelectedLng] = useState(defaultLng);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const startLat = parseFloat(initialLat) || 6.9271;
    const startLng = parseFloat(initialLng) || 79.8612;

    setSelectedLat(startLat);
    setSelectedLng(startLng);

    // Give DOM time to render container
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      // Clean up previous map instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current).setView([startLat, startLng], 14);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const marker = L.marker([startLat, startLng], { draggable: true }).addTo(map);
      markerRef.current = marker;

      // Update position on marker drag
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setSelectedLat(pos.lat);
        setSelectedLng(pos.lng);
      });

      // Update position on map click
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setSelectedLat(lat);
        setSelectedLng(lng);
      });

      map.invalidateSize();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, initialLat, initialLng]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setSelectedLat(lat);
        setSelectedLng(lng);
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15);
          markerRef.current.setLatLng([lat, lng]);
        }
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("Unable to fetch current location.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedLat.toFixed(6), selectedLng.toFixed(6));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Pick Shop Location</h2>
            <p className="text-xs text-slate-300">
              Click on the map or drag the pin to set your exact shop location
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-slate-100 flex items-center justify-between border-b border-slate-200">
          <div className="text-sm font-semibold text-slate-700">
            Selected: <span className="text-blue-700">{selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}</span>
          </div>
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={locating}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            {locating ? "Locating..." : "🎯 Center on My Location"}
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 min-h-[380px] relative">
          <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-md transition cursor-pointer"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
