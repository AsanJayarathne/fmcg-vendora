import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { MapPin, RefreshCw, Navigation } from 'lucide-react';

const loadLeaflet = () => {
  return new Promise((resolve) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve(window.L);
    document.head.appendChild(script);
  });
};

function CashAudit() {
  const { auth } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/driver/deliveries.php", {
        headers: {
          "Authorization": `Bearer ${auth?.token}`
        }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const mappedRoutes = json.data.map(item => ({
          id: item.delivery_id,
          store: item.shop_name,
          address: item.city ? `${item.shop_address}, ${item.city}` : item.shop_address,
          amount: `Rs. ${parseFloat(item.order_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          status: item.status === 'CLAIMED' ? 'Pending' : (item.status === 'DELIVERED' ? 'Delivered' : 'Returned'),
          latitude: item.latitude ? parseFloat(item.latitude) : null,
          longitude: item.longitude ? parseFloat(item.longitude) : null
        }));
        setRoutes(mappedRoutes);
      }
    } catch (err) {
      console.error("Error loading route map data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchRoutes();
    } else {
      setLoading(false);
    }
  }, [auth]);

  // Leaflet Map integration effect
  useEffect(() => {
    let isMounted = true;
    const pendingRoutes = routes.filter(r => r.status === 'Pending' && r.latitude && r.longitude);

    if (pendingRoutes.length === 0 || loading) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      return;
    }

    loadLeaflet().then((L) => {
      if (!isMounted) return;
      const container = document.getElementById('map-container');
      if (!container) return;

      const center = [pendingRoutes[0].latitude, pendingRoutes[0].longitude];

      if (!mapRef.current) {
        mapRef.current = L.map('map-container').setView(center, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
      } else {
        mapRef.current.setView(center, 13);
      }

      // Clear old markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      // Add new markers
      const bounds = [];
      pendingRoutes.forEach(r => {
        const marker = L.marker([r.latitude, r.longitude])
          .addTo(mapRef.current)
          .bindPopup(`<div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 2px;">
            <b style="color: #0f172a; font-size: 13px;">${r.store}</b><br/>
            <span style="color: #64748b; font-size: 11px;">${r.address}</span><br/>
            <strong style="color: #ea580c; font-size: 12px;">${r.amount}</strong>
          </div>`);
        markersRef.current.push(marker);
        bounds.push([r.latitude, r.longitude]);
      });

      if (bounds.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [40, 40] });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [routes, loading]);

  const activeDeliveriesCount = routes.filter(r => r.status === 'Pending' && r.latitude && r.longitude).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Route Navigation Map</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Geographic view of picked up retail store destinations</p>
        </div>
        {!loading && (
          <button
            onClick={fetchRoutes}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <RefreshCw size={14} className="text-slate-500" />
            <span>Refresh Map</span>
          </button>
        )}
      </div>

      {/* Leaflet Map Card */}
      {!loading && activeDeliveriesCount > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                <Navigation size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Stop Pins ({activeDeliveriesCount})</h3>
                <p className="text-[11px] text-slate-400">Click any marker on map to view order details</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Route Active
            </div>
          </div>

          <div 
            id="map-container" 
            className="w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0"
            style={{ minHeight: '480px' }}
          />
        </div>
      ) : (
        !loading && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 shadow-sm">
            <MapPin size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Active Route Locations</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You currently have no picked-up orders with location coordinates. Claim and pick up orders to visualize your route map.
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default CashAudit;