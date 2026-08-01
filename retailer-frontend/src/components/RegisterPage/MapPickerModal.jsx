import { useEffect, useRef, useState } from "react";
import { Crosshair } from "lucide-react";

const loadLeaflet = () => {
  return new Promise((resolve) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve(window.L);
    document.head.appendChild(script);
  });
};

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

    let isMounted = true;
    const startLat = parseFloat(initialLat) || 6.9271;
    const startLng = parseFloat(initialLng) || 79.8612;

    setSelectedLat(startLat);
    setSelectedLng(startLng);

    loadLeaflet().then((L) => {
      if (!isMounted) return;

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

      return () => clearTimeout(timer);
    });

    return () => {
      isMounted = false;
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
        {/* Retailer Style Header */}
        <div className="px-6 py-4.5 bg-blue-700 text-white flex items-center justify-between shadow-xs">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Pick Shop Location</h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Click on the map or drag the marker pin to set your exact shop location
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-800 transition cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3.5 bg-[#EEF2F6] flex items-center justify-between border-b border-slate-200">
          <div className="text-xs sm:text-sm font-medium text-slate-600 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-2xs">
            Coordinates: <span className="text-blue-700 font-bold">{selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}</span>
          </div>
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={locating}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-[0.98] disabled:opacity-50"
          >
            <Crosshair size={15} />
            <span>{locating ? "Locating..." : "Center on My Location"}</span>
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 min-h-[380px] relative">
          <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
        </div>

        {/* Retailer Style Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-blue-700 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-8 py-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-md transition cursor-pointer active:scale-[0.98]"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
