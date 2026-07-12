import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';

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

      const defaultCenter = [6.9271, 79.8612]; // Colombo
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
          .bindPopup(`<b>${r.store}</b><br>${r.address}<br>${r.amount}`);
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

  return (
    <div className="bg-white min-h-screen p-6 font-sans">

      {/* Title */}
      <div className="mb-8 flex items-center justify-between max-w-6xl">
        <div>
          <h2 className="text-4xl font-bold text-gray-900">My Route</h2>
          <p className="text-sm text-gray-400 mt-1">Interactive map of picked up orders</p>
        </div>
        {!loading && (
          <button
            onClick={fetchRoutes}
            className="text-xs px-4 py-2 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-50 transition-all font-medium cursor-pointer"
          >
            Refresh Route
          </button>
        )}
      </div>

      {/* Leaflet Map Card */}
      {!loading && routes.some(r => r.status === 'Pending' && r.latitude && r.longitude) ? (
        <div className="mb-6 max-w-6xl bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            Route Locations Map
          </h3>
          <div 
            id="map-container" 
            className="w-full h-[550px] rounded-xl overflow-hidden border border-gray-200 shadow-inner z-0"
            style={{ minHeight: '500px' }}
          />
        </div>
      ) : (
        !loading && (
          <div className="mb-6 max-w-6xl text-center py-12 text-sm text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
            No picked up orders found. Claim orders to view your route map!
          </div>
        )
      )}

    </div>
  );
}

export default CashAudit;