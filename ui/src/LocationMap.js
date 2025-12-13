import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMap = ({ lat, lng }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        // If invalid coords, do nothing (component renders "No GPS" below)
        if (isNaN(latitude) || isNaN(longitude) || (latitude === 0 && longitude === 0)) {
            return;
        }

        // --- CLEANUP FUNCTION ---
        const cleanupMap = () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            // CRITICAL FIX: If the DOM element thinks it still has a map, strip the ID.
            if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
                mapContainerRef.current._leaflet_id = null;
            }
        };

        // 1. Clean up any existing instance before creating a new one
        cleanupMap();

        // 2. Initialize Map with a slight delay to allow Modal to render
        const timer = setTimeout(() => {
            if (!mapContainerRef.current) return;

            try {
                const map = L.map(mapContainerRef.current, {
                    center: [latitude, longitude],
                    zoom: 16,
                    attributionControl: false
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                }).addTo(map);

                L.marker([latitude, longitude]).addTo(map);

                mapInstanceRef.current = map;

                // 3. Fix "Grey Box" issue by refreshing size
                setTimeout(() => {
                    map.invalidateSize();
                }, 300);

            } catch (err) {
                console.warn("Map Init Warning:", err.message);
            }
        }, 100);

        // Cleanup on unmount
        return () => {
            clearTimeout(timer);
            cleanupMap();
        };
    }, [lat, lng]);

    // --- RENDER ---
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude) || (latitude === 0 && longitude === 0)) {
        return (
            <div style={{ height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize:'12px' }}>
                No GPS
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#e5e3df' }} />
        </div>
    );
};

export default LocationMap;



// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix for default Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//     iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const LocationMap = ({ lat, lng }) => {
//     const mapContainerRef = useRef(null);
//     const mapInstanceRef = useRef(null);
//     const markerInstanceRef = useRef(null);

//     // 1. Initialize Map (Runs once)
//     useEffect(() => {
//         if (!mapContainerRef.current) return;
//         if (mapInstanceRef.current) return; // Prevent double init

//         try {
//             const map = L.map(mapContainerRef.current, {
//                 center: [0, 0],
//                 zoom: 16,
//                 attributionControl: false,
//                 zoomControl: false 
//             });

//             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                 maxZoom: 19,
//             }).addTo(map);

//             mapInstanceRef.current = map;

//             // Fix grey box issue
//             setTimeout(() => {
//                 map.invalidateSize();
//             }, 300);

//         } catch (error) {
//             console.error("Map Init Error:", error);
//         }

//         return () => {
//             if (mapInstanceRef.current) {
//                 mapInstanceRef.current.remove();
//                 mapInstanceRef.current = null;
//                 markerInstanceRef.current = null;
//             }
//         };
//     }, []);

//     // 2. Update View when Lat/Lng changes (Real-time updates)
//     useEffect(() => {
//         const latitude = parseFloat(lat);
//         const longitude = parseFloat(lng);
//         const map = mapInstanceRef.current;

//         if (map && !isNaN(latitude) && !isNaN(longitude) && (latitude !== 0 || longitude !== 0)) {
            
//             // Fly to new location
//             map.setView([latitude, longitude], 18); 

//             // Update Marker
//             if (markerInstanceRef.current) {
//                 markerInstanceRef.current.setLatLng([latitude, longitude]);
//             } else {
//                 const marker = L.marker([latitude, longitude]).addTo(map);
//                 markerInstanceRef.current = marker;
//             }
            
//             map.invalidateSize();
//         }
//     }, [lat, lng]);

//     return (
//         <div style={{ width: '100%', height: '100%', position: 'relative' }}>
//             <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#e5e3df' }} />
            
//             {(!lat || !lng || parseFloat(lat) === 0) && (
//                 <div style={{
//                     position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
//                     background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     zIndex: 1000, pointerEvents: 'none', color: '#555', fontWeight: 'bold', fontSize: '12px'
//                 }}>
//                     Waiting for GPS...
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LocationMap;