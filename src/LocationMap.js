// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default Leaflet marker icons breaking in React
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//     iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const LocationMap = ({ lat, lng }) => {
//     if (!lat || !lng) return <div style={{background:'#f8f9fa', padding:'20px', textAlign:'center', border:'1px solid #ddd', borderRadius:'8px'}}>Loading Map...</div>;

//     return (
//         <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', marginTop: '15px', background:'white' }}>
            
//             {/* Header Details */}
//             <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
//                 <h4 style={{ margin: '0 0 10px 0', color: '#d35400', display:'flex', alignItems:'center', gap:'5px' }}>
//                     <span>📍</span> GPS Location
//                 </h4>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' }}>
//                     <div>
//                         <span style={{color:'#999'}}>Latitude</span><br/>
//                         <strong>{parseFloat(lat).toFixed(6)}</strong>
//                     </div>
//                     <div>
//                         <span style={{color:'#999'}}>Longitude</span><br/>
//                         <strong>{parseFloat(lng).toFixed(6)}</strong>
//                     </div>
//                 </div>
//             </div>

//             {/* The Map */}
//             <MapContainer center={[lat, lng]} zoom={15} style={{ height: '200px', width: '100%' }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
//                 <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; OpenStreetMap'
//                 />
//                 <Marker position={[lat, lng]}>
//                     <Popup>Recorded Location</Popup>
//                 </Marker>
//             </MapContainer>
//         </div>
//     );
// };

// export default LocationMap;




import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons breaking in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMap = ({ lat, lng }) => {
    // Basic validation
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        return (
            <div style={{background:'#f8f9fa', padding:'20px', textAlign:'center', border:'1px solid #ddd', borderRadius:'8px', color:'#777', fontSize:'13px'}}>
                📍 Map unavailable (No GPS data)
            </div>
        );
    }

    return (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', background:'white' }}>
            
            {/* Header Details */}
            <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', background: '#fafafa' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#d35400', fontSize:'14px', display:'flex', alignItems:'center', gap:'5px' }}>
                    <span>📍</span> GPS Location
                </h4>
                <div style={{ display: 'flex', gap:'20px', fontSize: '12px', color: '#555' }}>
                    <div>Lat: <strong>{parseFloat(lat).toFixed(6)}</strong></div>
                    <div>Lng: <strong>{parseFloat(lng).toFixed(6)}</strong></div>
                </div>
            </div>

            {/* The Map */}
            <MapContainer center={[lat, lng]} zoom={15} style={{ height: '200px', width: '100%' }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                />
                <Marker position={[lat, lng]}>
                    <Popup>Recorded Location</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LocationMap;