// // // // // // // // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // // // // // // // import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline, useMap, LayersControl, useMapEvents } from 'react-leaflet';
// // // // // // // // // // // // // import 'leaflet/dist/leaflet.css';
// // // // // // // // // // // // // import L from 'leaflet';
// // // // // // // // // // // // // import SurveyForm from './SurveyForm';
// // // // // // // // // // // // // import { 
// // // // // // // // // // // // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // // // // // // // // // // // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // // // // // // // // // // // } from './db';

// // // // // // // // // // // // // // --- Icons ---
// // // // // // // // // // // // // const DefaultIcon = L.icon({
// // // // // // // // // // // // //     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
// // // // // // // // // // // // //     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// // // // // // // // // // // // //     iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
// // // // // // // // // // // // // });
// // // // // // // // // // // // // L.Marker.prototype.options.icon = DefaultIcon;

// // // // // // // // // // // // // const SurveyIcon = L.divIcon({
// // // // // // // // // // // // //     className: 'custom-survey-icon',
// // // // // // // // // // // // //     html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>',
// // // // // // // // // // // // //     iconSize: [16, 16]
// // // // // // // // // // // // // });

// // // // // // // // // // // // // // --- Constants ---
// // // // // // // // // // // // // const DATA_HIERARCHY = {
// // // // // // // // // // // // //     districts: ['VARANASI', 'Hyderabad'],
// // // // // // // // // // // // //     blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] },
// // // // // // // // // // // // //     spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] },
// // // // // // // // // // // // //     rings: { 'Span-Uppal': ['Ring-01'] }
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const SPAN_COORDS = {
// // // // // // // // // // // // //     'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } },
// // // // // // // // // // // // //     'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } }
// // // // // // // // // // // // // };

// // // // // // // // // // // // // // --- Helpers ---
// // // // // // // // // // // // // const getRingPath = (start, end, offsetFactor) => {
// // // // // // // // // // // // //     const midLat = (start.lat + end.lat) / 2;
// // // // // // // // // // // // //     const midLng = (start.lng + end.lng) / 2;
// // // // // // // // // // // // //     return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end];
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const generatePointsOnPath = (path, count) => {
// // // // // // // // // // // // //     const points = [];
// // // // // // // // // // // // //     for (let i = 1; i <= count; i++) {
// // // // // // // // // // // // //         const ratio = i / (count + 1);
// // // // // // // // // // // // //         points.push({
// // // // // // // // // // // // //             lat: path[0].lat + (path[1].lat - path[0].lat) * ratio,
// // // // // // // // // // // // //             lng: path[0].lng + (path[1].lng - path[0].lng) * ratio,
// // // // // // // // // // // // //             id: `SP-${i}`
// // // // // // // // // // // // //         });
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //     return points;
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const ModalWrapper = ({ children, title, onClose }) => (
// // // // // // // // // // // // //     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
// // // // // // // // // // // // //         <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}>
// // // // // // // // // // // // //             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}>
// // // // // // // // // // // // //                 <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3>
// // // // // // // // // // // // //                 <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button>
// // // // // // // // // // // // //             </div>
// // // // // // // // // // // // //             <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div>
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //     </div>
// // // // // // // // // // // // // );

// // // // // // // // // // // // // const MapPickHandler = ({ isPicking, onPick }) => {
// // // // // // // // // // // // //     useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } });
// // // // // // // // // // // // //     useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]);
// // // // // // // // // // // // //     return null;
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const MapUpdater = ({ center }) => {
// // // // // // // // // // // // //     const map = useMap();
// // // // // // // // // // // // //     useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]);
// // // // // // // // // // // // //     return null;
// // // // // // // // // // // // // };

// // // // // // // // // // // // // // --- MAIN DASHBOARD ---
// // // // // // // // // // // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // // // // // // // // // // //     // Dropdowns
// // // // // // // // // // // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // // // // // // // // // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // // // // // // // // // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // // // // // // // // // // //     const [selectedRing, setSelectedRing] = useState('');
    
// // // // // // // // // // // // //     // GIS
// // // // // // // // // // // // //     const [startPoint, setStartPoint] = useState(null);
// // // // // // // // // // // // //     const [endPoint, setEndPoint] = useState(null);
// // // // // // // // // // // // //     const [displayPath, setDisplayPath] = useState([]);
// // // // // // // // // // // // //     const [isRingView, setIsRingView] = useState(false);
// // // // // // // // // // // // //     const [diggingPoints, setDiggingPoints] = useState([]);
    
// // // // // // // // // // // // //     // Data
// // // // // // // // // // // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // // // // // // // // // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // // // // // // // // // // //     const [logs, setLogs] = useState([]);
// // // // // // // // // // // // //     const [userRoutes, setUserRoutes] = useState([]);
    
// // // // // // // // // // // // //     // UI
// // // // // // // // // // // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // // // // // // // // // // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // // // // // // // // // // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // // // // // // // // // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // // // // // // // // // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // // // // // // // // // // //     const [showUserStatus, setShowUserStatus] = useState(false);
    
// // // // // // // // // // // // //     // Media
// // // // // // // // // // // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // // // // // // // // // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // // // // // // // // // // //     // Filters
// // // // // // // // // // // // //     const [filterStart, setFilterStart] = useState('');
// // // // // // // // // // // // //     const [filterEnd, setFilterEnd] = useState('');

// // // // // // // // // // // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // // // // // // // // // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // // // // // // // // // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // // // // // // // // // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // // // // // // // // // // //     const refreshData = useCallback(async () => {
// // // // // // // // // // // // //         try {
// // // // // // // // // // // // //             const surveys = await getAllSurveys();
// // // // // // // // // // // // //             setSubmittedSurveys(surveys || []);
// // // // // // // // // // // // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // // // // // // // // // // // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);

// // // // // // // // // // // // //             const routes = {};
// // // // // // // // // // // // //             if(surveys) {
// // // // // // // // // // // // //                 surveys.forEach(s => {
// // // // // // // // // // // // //                     if (!routes[s.routeName]) routes[s.routeName] = {};
// // // // // // // // // // // // //                     if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // // // // // // //                     if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // // // // // // //                     routes[s.routeName].name = s.routeName;
// // // // // // // // // // // // //                 });
// // // // // // // // // // // // //             }
// // // // // // // // // // // // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // // // // // // // // // // // //             setUserRoutes(lines);
// // // // // // // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // // // // // // //     }, []);

// // // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // // //         refreshData();
// // // // // // // // // // // // //         const interval = setInterval(refreshData, 5000); 
// // // // // // // // // // // // //         return () => clearInterval(interval);
// // // // // // // // // // // // //     }, [refreshData]);

// // // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // // // // // // // // // // // //         const data = SPAN_COORDS[selectedSpan];
// // // // // // // // // // // // //         if(data) {
// // // // // // // // // // // // //             setStartPoint(data.start); setEndPoint(data.end);
// // // // // // // // // // // // //             if (selectedRing) {
// // // // // // // // // // // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // // // // // // // // // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // // // // // // // // // // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // // // // // // // // // // // //             } else {
// // // // // // // // // // // // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // // // // // // // // // // //             }
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //     }, [selectedSpan, selectedRing]);

// // // // // // // // // // // // //     const handleSurveySubmit = async (formData) => {
// // // // // // // // // // // // //         try {
// // // // // // // // // // // // //             const timestamp = Date.now();
// // // // // // // // // // // // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // // // // // // // // // // // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // // // // // // // // // // // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // // // // // // // // // // // //             const enrichedData = {
// // // // // // // // // // // // //                 ...formData,
// // // // // // // // // // // // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // // // // // // // // // // // //                 submittedBy: user,
// // // // // // // // // // // // //                 timestamp: new Date().toLocaleString(),
// // // // // // // // // // // // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // // // // // // // // // // // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // // // // // // // // // // // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // // // // // // // // // // // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // // // // // // // // // // // //             };
// // // // // // // // // // // // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // // // // // // // // // // // //             if (editingSurvey) {
// // // // // // // // // // // // //                 await updateSurveyInDB(enrichedData);
// // // // // // // // // // // // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // // // // // // //                 alert("Updated!");
// // // // // // // // // // // // //             } else {
// // // // // // // // // // // // //                 await saveSurveyToDB(enrichedData);
// // // // // // // // // // // // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // // // // // // //                 alert(`Saved!`);
// // // // // // // // // // // // //             }
// // // // // // // // // // // // //             setShowSurveyForm(false);
// // // // // // // // // // // // //             setEditingSurvey(null);
// // // // // // // // // // // // //             refreshData();
// // // // // // // // // // // // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const handleDeleteSurvey = async (id) => {
// // // // // // // // // // // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // // // // // // // // // // //             await deleteSurveyFromDB(id);
// // // // // // // // // // // // //             await deleteMediaFromDisk(`video_${id}`);
// // // // // // // // // // // // //             await deleteMediaFromDisk(`photo_${id}`);
// // // // // // // // // // // // //             await deleteMediaFromDisk(`gopro_${id}`);
// // // // // // // // // // // // //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // // // // // // // // // // //             refreshData();
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const handleGoProUpload = async (e) => {
// // // // // // // // // // // // //         if(e.target.files[0]) {
// // // // // // // // // // // // //             const file = e.target.files[0];
// // // // // // // // // // // // //             const url = URL.createObjectURL(file); 
// // // // // // // // // // // // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // // // // // // // // // // // //             if (survey) {
// // // // // // // // // // // // //                 const mediaId = `gopro_${survey.id}`;
// // // // // // // // // // // // //                 await saveMediaToDisk(mediaId, file);
// // // // // // // // // // // // //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// // // // // // // // // // // // //                 await updateSurveyInDB(updatedSurvey);
// // // // // // // // // // // // //                 alert("GoPro Uploaded!");
// // // // // // // // // // // // //                 setUploadModalId(null);
// // // // // // // // // // // // //                 refreshData();
// // // // // // // // // // // // //             }
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const handleViewMedia = async (type, id) => {
// // // // // // // // // // // // //         if (!id) return;
// // // // // // // // // // // // //         try {
// // // // // // // // // // // // //             const blob = await getMediaFromDisk(id);
// // // // // // // // // // // // //             if (blob) {
// // // // // // // // // // // // //                 const url = URL.createObjectURL(blob);
// // // // // // // // // // // // //                 setCurrentMedia({ type, url, filename: type==='video'?'video.webm':'photo.jpg' });
// // // // // // // // // // // // //             } else { alert("Media file not in DB."); }
// // // // // // // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // // // // // // // // // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };

// // // // // // // // // // // // //     const getSessionDuration = (loginTimeStr) => {
// // // // // // // // // // // // //         if (!loginTimeStr) return '-';
// // // // // // // // // // // // //         const diffMs = new Date() - new Date(loginTimeStr);
// // // // // // // // // // // // //         return `${Math.floor(diffMs / 60000)} mins`;
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const getFilteredLogs = () => {
// // // // // // // // // // // // //         if (!filterStart && !filterEnd) return logs;
// // // // // // // // // // // // //         const start = filterStart ? new Date(filterStart).getTime() : 0;
// // // // // // // // // // // // //         const end = filterEnd ? new Date(filterEnd).getTime() + 86400000 : 9999999999999;
// // // // // // // // // // // // //         return logs.filter(log => {
// // // // // // // // // // // // //             const logTime = new Date(log.isoTime).getTime();
// // // // // // // // // // // // //             return logTime >= start && logTime <= end;
// // // // // // // // // // // // //         });
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const styles = {
// // // // // // // // // // // // //         container: { display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif' },
// // // // // // // // // // // // //         header: { padding: '10px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:20 },
// // // // // // // // // // // // //         controls: { display:'flex', gap:'12px', alignItems:'center' },
// // // // // // // // // // // // //         select: { padding: '8px 12px', borderRadius: '4px', minWidth: '140px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // // // // // // // // // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '10px', border:'1px solid rgba(255,255,255,0.3)' },
// // // // // // // // // // // // //         btnGreen: { padding: '8px 16px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'13px', boxShadow:'0 2px 4px rgba(0,0,0,0.2)' },
// // // // // // // // // // // // //         btnWhite: { padding: '8px 16px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'13px', boxShadow:'0 2px 4px rgba(0,0,0,0.2)' },
// // // // // // // // // // // // //         btnRed: { padding: '8px 16px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'13px' },
// // // // // // // // // // // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // // // // // // // // // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // // // // // // // // // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // // // // // // // // // // //         actionBtn: { padding:'4px 8px', borderRadius:'3px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px' },
// // // // // // // // // // // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // // // // // // // // // // //         downloadBtn: { display:'inline-block', marginTop:'10px', padding:'10px 20px', background:'#2196f3', color:'white', textDecoration:'none', borderRadius:'5px', fontWeight:'bold' },
// // // // // // // // // // // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //         <div style={styles.container}>
// // // // // // // // // // // // //             <div style={styles.header}>
// // // // // // // // // // // // //                 <div style={{display:'flex', alignItems:'center'}}>
// // // // // // // // // // // // //                     <strong style={{fontSize:'22px'}}>GIS</strong>
// // // // // // // // // // // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
                    
// // // // // // // // // // // // //                     <div style={{marginLeft:'30px', display:'flex', gap:'10px'}}>
// // // // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring (Opt)</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // // // // // // // // // // //                     </div>
// // // // // // // // // // // // //                 </div>
                
// // // // // // // // // // // // //                 <div style={styles.controls}>
// // // // // // // // // // // // //                     <button onClick={() => { setEditingSurvey(null); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New Survey</button>
// // // // // // // // // // // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>View Data ({submittedSurveys.length})</button>
// // // // // // // // // // // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs & Status</button>}
// // // // // // // // // // // // //                     <button onClick={onLogout} style={styles.btnRed}>LOGOUT</button>
// // // // // // // // // // // // //                 </div>
// // // // // // // // // // // // //             </div>

// // // // // // // // // // // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // // // // // // // // // // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // // // // // // // // // // //                 <LayersControl position="topright">
// // // // // // // // // // // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // // // // // // // // // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // // // // // // // // // // //                 </LayersControl>
                
// // // // // // // // // // // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // // // // // // // // // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // // // // // // // // // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // // // // // // // // // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // // // // // // // // // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // // // // // // // // // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}

// // // // // // // // // // // // //                 {submittedSurveys.map(s => s.latitude && (
// // // // // // // // // // // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // // // // // // // // // // //                         {/* --- UPDATED DETAILED POPUP --- */}
// // // // // // // // // // // // //                         <Popup minWidth={250}>
// // // // // // // // // // // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // // // // // // // // // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>
// // // // // // // // // // // // //                                     {s.locationType}
// // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // // // // // // // // // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // // // // // // // // // // //                                 <div><b>Shot:</b> {s.shotNumber}</div>
// // // // // // // // // // // // //                                 <div><b>Loc:</b> {s.startLocName} ➝ {s.endLocName}</div>
// // // // // // // // // // // // //                                 <hr style={{border:'0', borderTop:'1px solid #ddd', margin:'8px 0'}}/>
// // // // // // // // // // // // //                                 <div style={{color:'#555', fontSize:'11px'}}>
// // // // // // // // // // // // //                                     <b>GPS:</b> {s.latitude}, {s.longitude}<br/>
// // // // // // // // // // // // //                                     <b>Date:</b> {s.timestamp}<br/>
// // // // // // // // // // // // //                                     <b>By:</b> {s.surveyorName}
// // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // //                                 <div style={{marginTop:'10px', display:'flex', gap:'5px'}}>
// // // // // // // // // // // // //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s.videoId)}>Video</button>}
// // // // // // // // // // // // //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // // // // // // // //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button>}
// // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // //                         </Popup>
                        
// // // // // // // // // // // // //                         {/* --- HOVER TOOLTIP --- */}
// // // // // // // // // // // // //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// // // // // // // // // // // // //                             <span style={{fontWeight:'bold'}}>{s.locationType}</span><br/>
// // // // // // // // // // // // //                             {s.routeName}
// // // // // // // // // // // // //                         </Tooltip>
// // // // // // // // // // // // //                     </Marker>
// // // // // // // // // // // // //                 ))}
// // // // // // // // // // // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // // // // // // // // // // //             </MapContainer>

// // // // // // // // // // // // //             {showSurveyForm && <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} />}

// // // // // // // // // // // // //             {/* DATABASE TABLE */}
// // // // // // // // // // // // //             {showSurveyTable && (
// // // // // // // // // // // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // // // // // // // // // // //                     <table style={styles.table}>
// // // // // // // // // // // // //                         <thead>
// // // // // // // // // // // // //                             <tr style={{textAlign:'left', background:'#f9f9f9'}}>
// // // // // // // // // // // // //                                 <th style={styles.th}>Filename</th>
// // // // // // // // // // // // //                                 <th style={styles.th}>Shot</th>
// // // // // // // // // // // // //                                 <th style={styles.th}>Type</th>
// // // // // // // // // // // // //                                 <th style={styles.th}>Media</th>
// // // // // // // // // // // // //                                 <th style={styles.th}>Action</th>
// // // // // // // // // // // // //                             </tr>
// // // // // // // // // // // // //                         </thead>
// // // // // // // // // // // // //                         <tbody>
// // // // // // // // // // // // //                             {submittedSurveys.map(s => {
// // // // // // // // // // // // //                                 const tooltip = `Filename: ${s.generatedFileName}\nDistrict: ${s.district}\nBlock: ${s.block}\nRoute: ${s.routeName}\nType: ${s.locationType}\nLat: ${s.latitude}\nLng: ${s.longitude}\nDate: ${s.timestamp}`;

// // // // // // // // // // // // //                                 return (
// // // // // // // // // // // // //                                     <tr key={s.id} title={tooltip} style={{cursor:'help', borderBottom:'1px solid #f0f0f0', background: s.id % 2 === 0 ? '#fff' : '#fafafa'}}>
// // // // // // // // // // // // //                                         <td style={styles.td}><b>{s.generatedFileName}</b> <span style={{fontSize:'14px'}}>ℹ️</span></td>
// // // // // // // // // // // // //                                         <td style={styles.td}>{s.shotNumber}</td>
// // // // // // // // // // // // //                                         <td style={styles.td}>{s.locationType}</td>
// // // // // // // // // // // // //                                         <td style={styles.td}>
// // // // // // // // // // // // //                                             {s.videoId ? <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s.videoId)}>Live Vid</button> : null}
// // // // // // // // // // // // //                                             {s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}
// // // // // // // // // // // // //                                             {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // // // // // // // //                                         </td>
// // // // // // // // // // // // //                                         <td style={styles.td}>
// // // // // // // // // // // // //                                             {(role === 'admin' || s.submittedBy === user) && <button style={styles.actionBtn} onClick={()=>{setEditingSurvey(s); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}
// // // // // // // // // // // // //                                             {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}
// // // // // // // // // // // // //                                         </td>
// // // // // // // // // // // // //                                     </tr>
// // // // // // // // // // // // //                                 );
// // // // // // // // // // // // //                             })}
// // // // // // // // // // // // //                         </tbody>
// // // // // // // // // // // // //                     </table>
// // // // // // // // // // // // //                 </ModalWrapper>
// // // // // // // // // // // // //             )}

// // // // // // // // // // // // //             {/* ADMIN LOGS */}
// // // // // // // // // // // // //             {showUserStatus && role === 'admin' && (
// // // // // // // // // // // // //                 <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
// // // // // // // // // // // // //                     <div style={{display:'flex', gap:'20px', height:'100%'}}>
// // // // // // // // // // // // //                         <div style={{flex:1, borderRight:'1px solid #eee'}}>
// // // // // // // // // // // // //                             <h4 style={{margin:'0 0 10px 0', color:'#2e7d32'}}>Live User Status</h4>
// // // // // // // // // // // // //                             <table style={styles.table}>
// // // // // // // // // // // // //                                 <thead><tr><th style={styles.th}>User</th><th style={styles.th}>Status</th><th style={styles.th}>Duration</th></tr></thead>
// // // // // // // // // // // // //                                 <tbody>{userStatuses.map((u, i) => <tr key={i}><td style={styles.td}><b>{u.username}</b></td><td style={styles.td}><span style={{...styles.statusDot, background: u.status==='Online'?'green':'grey'}}></span>{u.status}</td><td style={styles.td}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>)}</tbody>
// // // // // // // // // // // // //                             </table>
// // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // //                         <div style={{flex:2}}>
// // // // // // // // // // // // //                             <h4 style={{margin:'0 0 10px 0', color:'#1565c0'}}>System Logs</h4>
// // // // // // // // // // // // //                             <div style={{marginBottom:'10px', background:'#f5f5f5', padding:'10px', borderRadius:'4px'}}>From <input type="date" onChange={e => setFilterStart(e.target.value)}/> To <input type="date" onChange={e => setFilterEnd(e.target.value)}/></div>
// // // // // // // // // // // // //                             <div style={{maxHeight:'300px', overflowY:'auto'}}>
// // // // // // // // // // // // //                                 <table style={styles.table}><thead><tr><th style={styles.th}>Time</th><th style={styles.th}>User</th><th style={styles.th}>Action</th><th style={styles.th}>Details</th></tr></thead><tbody>{getFilteredLogs().map((l,i) => <tr key={i}><td style={{padding:'8px', fontSize:'11px', color:'#666'}}>{l.displayTime}</td><td style={styles.td}><b>{l.username}</b></td><td style={styles.td}>{l.action}</td><td style={styles.td}><small>{l.details}</small></td></tr>)}</tbody></table>
// // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // //                     </div>
// // // // // // // // // // // // //                 </ModalWrapper>
// // // // // // // // // // // // //             )}

// // // // // // // // // // // // //             {uploadModalId && <ModalWrapper title="Upload GoPro Video" onClose={()=>setUploadModalId(null)}>
// // // // // // // // // // // // //                 <div style={{padding:'40px', textAlign:'center', border:'2px dashed #ccc', borderRadius:'8px', margin:'20px'}}>
// // // // // // // // // // // // //                     <p style={{marginBottom:'15px', color:'#666'}}>Select the GoPro video file for this survey record.</p>
// // // // // // // // // // // // //                     <input type="file" accept="video/*" onChange={handleGoProUpload} />
// // // // // // // // // // // // //                 </div>
// // // // // // // // // // // // //             </ModalWrapper>}

// // // // // // // // // // // // //             {currentMedia && (
// // // // // // // // // // // // //                 <ModalWrapper title="Media Viewer" onClose={() => setCurrentMedia(null)}>
// // // // // // // // // // // // //                     <div style={{textAlign:'center', background:'black', padding:'10px', borderRadius:'4px'}}>
// // // // // // // // // // // // //                         {currentMedia.type === 'video' ? <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} /> : <img src={currentMedia.url} alt="Evd" style={{width:'100%', maxHeight:'500px'}} />}
// // // // // // // // // // // // //                         <div style={{marginTop:'15px'}}>
// // // // // // // // // // // // //                             <a href={currentMedia.url} download={currentMedia.filename} style={styles.downloadBtn}>⬇ Download Media</a>
// // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // //                     </div>
// // // // // // // // // // // // //                 </ModalWrapper>
// // // // // // // // // // // // //             )}

// // // // // // // // // // // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map to select location (Click here to cancel)</div>}
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export default Dashboard;



// // // // // // // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // // // // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents } from 'react-leaflet';
// // // // // // // // // // // // import 'leaflet/dist/leaflet.css';
// // // // // // // // // // // // import L from 'leaflet';
// // // // // // // // // // // // import SurveyForm from './SurveyForm';
// // // // // // // // // // // // import { 
// // // // // // // // // // // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // // // // // // // // // // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // // // // // // // // // // } from './db';

// // // // // // // // // // // // const DefaultIcon = L.icon({
// // // // // // // // // // // //     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
// // // // // // // // // // // //     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// // // // // // // // // // // //     iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
// // // // // // // // // // // // });
// // // // // // // // // // // // L.Marker.prototype.options.icon = DefaultIcon;

// // // // // // // // // // // // const SurveyIcon = L.divIcon({
// // // // // // // // // // // //     className: 'custom-survey-icon',
// // // // // // // // // // // //     html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>',
// // // // // // // // // // // //     iconSize: [16, 16]
// // // // // // // // // // // // });

// // // // // // // // // // // // const DATA_HIERARCHY = {
// // // // // // // // // // // //     districts: ['VARANASI', 'Hyderabad'],
// // // // // // // // // // // //     blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] },
// // // // // // // // // // // //     spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] },
// // // // // // // // // // // //     rings: { 'Span-Uppal': ['Ring-01'] }
// // // // // // // // // // // // };

// // // // // // // // // // // // const SPAN_COORDS = {
// // // // // // // // // // // //     'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } },
// // // // // // // // // // // //     'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } }
// // // // // // // // // // // // };

// // // // // // // // // // // // const getRingPath = (start, end, offsetFactor) => {
// // // // // // // // // // // //     const midLat = (start.lat + end.lat) / 2;
// // // // // // // // // // // //     const midLng = (start.lng + end.lng) / 2;
// // // // // // // // // // // //     return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end];
// // // // // // // // // // // // };

// // // // // // // // // // // // const generatePointsOnPath = (path, count) => {
// // // // // // // // // // // //     const points = [];
// // // // // // // // // // // //     for (let i = 1; i <= count; i++) {
// // // // // // // // // // // //         const ratio = i / (count + 1);
// // // // // // // // // // // //         points.push({
// // // // // // // // // // // //             lat: path[0].lat + (path[1].lat - path[0].lat) * ratio,
// // // // // // // // // // // //             lng: path[0].lng + (path[1].lng - path[0].lng) * ratio,
// // // // // // // // // // // //             id: `SP-${i}`
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }
// // // // // // // // // // // //     return points;
// // // // // // // // // // // // };

// // // // // // // // // // // // const ModalWrapper = ({ children, title, onClose }) => (
// // // // // // // // // // // //     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
// // // // // // // // // // // //         <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}>
// // // // // // // // // // // //             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}>
// // // // // // // // // // // //                 <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3>
// // // // // // // // // // // //                 <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button>
// // // // // // // // // // // //             </div>
// // // // // // // // // // // //             <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //     </div>
// // // // // // // // // // // // );

// // // // // // // // // // // // const MapPickHandler = ({ isPicking, onPick }) => {
// // // // // // // // // // // //     useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } });
// // // // // // // // // // // //     useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]);
// // // // // // // // // // // //     return null;
// // // // // // // // // // // // };

// // // // // // // // // // // // const MapUpdater = ({ center }) => {
// // // // // // // // // // // //     const map = useMap();
// // // // // // // // // // // //     useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]);
// // // // // // // // // // // //     return null;
// // // // // // // // // // // // };

// // // // // // // // // // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // // // // // // // // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // // // // // // // // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // // // // // // // // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // // // // // // // // // //     const [selectedRing, setSelectedRing] = useState('');
    
// // // // // // // // // // // //     const [startPoint, setStartPoint] = useState(null);
// // // // // // // // // // // //     const [endPoint, setEndPoint] = useState(null);
// // // // // // // // // // // //     const [displayPath, setDisplayPath] = useState([]);
// // // // // // // // // // // //     const [isRingView, setIsRingView] = useState(false);
// // // // // // // // // // // //     const [diggingPoints, setDiggingPoints] = useState([]);
    
// // // // // // // // // // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // // // // // // // // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // // // // // // // // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // // // // // // // // // //     const [logs, setLogs] = useState([]);
// // // // // // // // // // // //     const [userRoutes, setUserRoutes] = useState([]);
    
// // // // // // // // // // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // // // // // // // // // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // // // // // // // // // // //     const [isViewOnly, setIsViewOnly] = useState(false);
// // // // // // // // // // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // // // // // // // // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // // // // // // // // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // // // // // // // // // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // // // // // // // // // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // // // // // // // // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // // // // // // // // // //     // CORRECTED STATE NAMES
// // // // // // // // // // // //     const [searchDist, setSearchDist] = useState('');
// // // // // // // // // // // //     const [searchBlock, setSearchBlock] = useState('');
// // // // // // // // // // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // // // // // // // // // //     const [searchDateTo, setSearchDateTo] = useState('');
// // // // // // // // // // // //     const [filterStart, setFilterStart] = useState('');
// // // // // // // // // // // //     const [filterEnd, setFilterEnd] = useState('');

// // // // // // // // // // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // // // // // // // // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // // // // // // // // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // // // // // // // // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // // // // // // // // // //     const applyFilters = useCallback((data) => {
// // // // // // // // // // // //         let filtered = data;
// // // // // // // // // // // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // // // // // // // // // // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // // // // // // // // // // //         if (searchDateFrom && searchDateTo) {
// // // // // // // // // // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // // // // // // // // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // // // // // // // // // //             filtered = filtered.filter(s => {
// // // // // // // // // // // //                 const sDate = new Date(s.id).getTime(); 
// // // // // // // // // // // //                 return sDate >= from && sDate <= to;
// // // // // // // // // // // //             });
// // // // // // // // // // // //         }
// // // // // // // // // // // //         setFilteredSurveys(filtered);
// // // // // // // // // // // //     }, [searchDist, searchBlock, searchDateFrom, searchDateTo]);

// // // // // // // // // // // //     const refreshData = useCallback(async () => {
// // // // // // // // // // // //         try {
// // // // // // // // // // // //             const surveys = await getAllSurveys();
// // // // // // // // // // // //             const allSurveys = surveys || [];
// // // // // // // // // // // //             setSubmittedSurveys(allSurveys);
// // // // // // // // // // // //             applyFilters(allSurveys);

// // // // // // // // // // // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // // // // // // // // // // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);

// // // // // // // // // // // //             const routes = {};
// // // // // // // // // // // //             allSurveys.forEach(s => {
// // // // // // // // // // // //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// // // // // // // // // // // //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // // // // // //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // // // // // //                 routes[s.routeName].name = s.routeName;
// // // // // // // // // // // //             });
// // // // // // // // // // // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // // // // // // // // // // //             setUserRoutes(lines);
// // // // // // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // // // // // //     }, [applyFilters]);

// // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // //         refreshData();
// // // // // // // // // // // //         const interval = setInterval(refreshData, 5000); 
// // // // // // // // // // // //         return () => clearInterval(interval);
// // // // // // // // // // // //     }, [refreshData]);

// // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // //         applyFilters(submittedSurveys);
// // // // // // // // // // // //     }, [searchDist, searchBlock, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // // // // // // // // // // //         const data = SPAN_COORDS[selectedSpan];
// // // // // // // // // // // //         if(data) {
// // // // // // // // // // // //             setStartPoint(data.start); setEndPoint(data.end);
// // // // // // // // // // // //             if (selectedRing) {
// // // // // // // // // // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // // // // // // // // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // // // // // // // // // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // // // // // // // // // //             }
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }, [selectedSpan, selectedRing]);

// // // // // // // // // // // //     const handleSurveySubmit = async (formData) => {
// // // // // // // // // // // //         try {
// // // // // // // // // // // //             const timestamp = Date.now();
// // // // // // // // // // // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // // // // // // // // // // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // // // // // // // // // // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // // // // // // // // // // //             const enrichedData = {
// // // // // // // // // // // //                 ...formData,
// // // // // // // // // // // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // // // // // // // // // // //                 submittedBy: user,
// // // // // // // // // // // //                 timestamp: new Date().toLocaleString(),
// // // // // // // // // // // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // // // // // // // // // // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // // // // // // // // // // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // // // // // // // // // // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // // // // // // // // // // //             };
// // // // // // // // // // // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // // // // // // // // // // //             if (editingSurvey) {
// // // // // // // // // // // //                 await updateSurveyInDB(enrichedData);
// // // // // // // // // // // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // // // // // //                 alert("Updated!");
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 await saveSurveyToDB(enrichedData);
// // // // // // // // // // // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // // // // // //                 alert(`Saved!`);
// // // // // // // // // // // //             }
// // // // // // // // // // // //             setShowSurveyForm(false);
// // // // // // // // // // // //             setEditingSurvey(null);
// // // // // // // // // // // //             setIsViewOnly(false);
// // // // // // // // // // // //             refreshData();
// // // // // // // // // // // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const handleDeleteSurvey = async (id) => {
// // // // // // // // // // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // // // // // // // // // //             await deleteSurveyFromDB(id);
// // // // // // // // // // // //             await deleteMediaFromDisk(`video_${id}`);
// // // // // // // // // // // //             await deleteMediaFromDisk(`photo_${id}`);
// // // // // // // // // // // //             await deleteMediaFromDisk(`gopro_${id}`);
// // // // // // // // // // // //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // // // // // // // // // //             refreshData();
// // // // // // // // // // // //         }
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const handleGoProUpload = async (e) => {
// // // // // // // // // // // //         if(e.target.files[0]) {
// // // // // // // // // // // //             const file = e.target.files[0];
// // // // // // // // // // // //             const url = URL.createObjectURL(file); 
// // // // // // // // // // // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // // // // // // // // // // //             if (survey) {
// // // // // // // // // // // //                 const mediaId = `gopro_${survey.id}`;
// // // // // // // // // // // //                 await saveMediaToDisk(mediaId, file);
// // // // // // // // // // // //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// // // // // // // // // // // //                 await updateSurveyInDB(updatedSurvey);
// // // // // // // // // // // //                 alert("GoPro Uploaded!");
// // // // // // // // // // // //                 setUploadModalId(null);
// // // // // // // // // // // //                 refreshData();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         }
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const handleViewMedia = async (type, id) => {
// // // // // // // // // // // //         if (!id) return;
// // // // // // // // // // // //         try {
// // // // // // // // // // // //             const blob = await getMediaFromDisk(id);
// // // // // // // // // // // //             if (blob) {
// // // // // // // // // // // //                 const url = URL.createObjectURL(blob);
// // // // // // // // // // // //                 setCurrentMedia({ type, url, filename: type==='video'?'video.webm':'photo.jpg' });
// // // // // // // // // // // //             } else { alert("Media file not in DB."); }
// // // // // // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // // // // // // // // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };

// // // // // // // // // // // //     const getSessionDuration = (loginTimeStr) => {
// // // // // // // // // // // //         if (!loginTimeStr) return '-';
// // // // // // // // // // // //         const diffMs = new Date() - new Date(loginTimeStr);
// // // // // // // // // // // //         return `${Math.floor(diffMs / 60000)} mins`;
// // // // // // // // // // // //     };

// // // // // // // // // // // //     // FIXED: Using filterStart / filterEnd here
// // // // // // // // // // // //     const getFilteredLogs = () => {
// // // // // // // // // // // //         if (!filterStart && !filterEnd) return logs;
// // // // // // // // // // // //         const start = filterStart ? new Date(filterStart).getTime() : 0;
// // // // // // // // // // // //         const end = filterEnd ? new Date(filterEnd).getTime() + 86400000 : 9999999999999;
// // // // // // // // // // // //         return logs.filter(log => {
// // // // // // // // // // // //             const logTime = new Date(log.isoTime).getTime();
// // // // // // // // // // // //             return logTime >= start && logTime <= end;
// // // // // // // // // // // //         });
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const styles = {
// // // // // // // // // // // //         container: { display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif' },
// // // // // // // // // // // //         header: { padding: '10px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:20 },
// // // // // // // // // // // //         controls: { display:'flex', gap:'12px', alignItems:'center' },
// // // // // // // // // // // //         select: { padding: '8px 12px', borderRadius: '4px', minWidth: '140px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // // // // // // // // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '10px', border:'1px solid rgba(255,255,255,0.3)' },
// // // // // // // // // // // //         btnGreen: { padding: '8px 16px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'13px', boxShadow:'0 2px 4px rgba(0,0,0,0.2)' },
// // // // // // // // // // // //         btnWhite: { padding: '8px 16px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'13px', boxShadow:'0 2px 4px rgba(0,0,0,0.2)' },
// // // // // // // // // // // //         btnRed: { padding: '8px 16px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'13px' },
// // // // // // // // // // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // // // // // // // // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // // // // // // // // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // // // // // // // // // //         actionBtn: { padding:'4px 10px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // // // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // // // // // // // // // //         downloadBtn: { display:'inline-block', marginTop:'10px', padding:'10px 20px', background:'#2196f3', color:'white', textDecoration:'none', borderRadius:'5px', fontWeight:'bold' },
// // // // // // // // // // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // // // // // // // // // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap'}
// // // // // // // // // // // //     };

// // // // // // // // // // // //     return (
// // // // // // // // // // // //         <div style={styles.container}>
// // // // // // // // // // // //             <div style={styles.header}>
// // // // // // // // // // // //                 <div style={{display:'flex', alignItems:'center'}}>
// // // // // // // // // // // //                     <strong style={{fontSize:'22px'}}>GIS</strong>
// // // // // // // // // // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
                    
// // // // // // // // // // // //                     <div style={{marginLeft:'30px', display:'flex', gap:'10px'}}>
// // // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring (Opt)</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                 </div>
                
// // // // // // // // // // // //                 <div style={styles.controls}>
// // // // // // // // // // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New Survey</button>
// // // // // // // // // // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>View Data ({filteredSurveys.length})</button>
// // // // // // // // // // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs & Status</button>}
// // // // // // // // // // // //                     <button onClick={onLogout} style={styles.btnRed}>LOGOUT</button>
// // // // // // // // // // // //                 </div>
// // // // // // // // // // // //             </div>

// // // // // // // // // // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // // // // // // // // // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // // // // // // // // // //                 <LayersControl position="topright">
// // // // // // // // // // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // // // // // // // // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // // // // // // // // // //                 </LayersControl>
                
// // // // // // // // // // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // // // // // // // // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // // // // // // // // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // // // // // // // // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // // // // // // // // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // // // // // // // // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}

// // // // // // // // // // // //                 {submittedSurveys.map(s => s.latitude && (
// // // // // // // // // // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // // // // // // // // // //                         <Popup minWidth={250}>
// // // // // // // // // // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // // // // // // // // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>
// // // // // // // // // // // //                                     {s.locationType}
// // // // // // // // // // // //                                 </div>
// // // // // // // // // // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // // // // // // // // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // // // // // // // // // //                                 <div><b>Shot:</b> {s.shotNumber}</div>
// // // // // // // // // // // //                                 <div><b>Loc:</b> {s.startLocName} ➝ {s.endLocName}</div>
// // // // // // // // // // // //                                 <hr style={{border:'0', borderTop:'1px solid #ddd', margin:'8px 0'}}/>
// // // // // // // // // // // //                                 <div style={{color:'#555', fontSize:'11px'}}>
// // // // // // // // // // // //                                     <b>GPS:</b> {s.latitude}, {s.longitude}<br/>
// // // // // // // // // // // //                                     <b>Date:</b> {s.timestamp}<br/>
// // // // // // // // // // // //                                     <b>By:</b> {s.surveyorName}
// // // // // // // // // // // //                                 </div>
// // // // // // // // // // // //                                 <div style={{marginTop:'10px', display:'flex', gap:'5px'}}>
// // // // // // // // // // // //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s.videoId)}>Video</button>}
// // // // // // // // // // // //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // // // // // // //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button>}
// // // // // // // // // // // //                                 </div>
// // // // // // // // // // // //                             </div>
// // // // // // // // // // // //                         </Popup>
// // // // // // // // // // // //                     </Marker>
// // // // // // // // // // // //                 ))}
// // // // // // // // // // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // // // // // // // // // //             </MapContainer>

// // // // // // // // // // // //             {showSurveyForm && (
// // // // // // // // // // // //                 <SurveyForm 
// // // // // // // // // // // //                     onClose={() => setShowSurveyForm(false)} 
// // // // // // // // // // // //                     pickedCoords={pickedCoords} 
// // // // // // // // // // // //                     districts={DATA_HIERARCHY.districts} 
// // // // // // // // // // // //                     blocks={Object.values(DATA_HIERARCHY.blocks)} 
// // // // // // // // // // // //                     onSubmitData={handleSurveySubmit} 
// // // // // // // // // // // //                     user={user} 
// // // // // // // // // // // //                     onPickLocation={handlePickLocationStart} 
// // // // // // // // // // // //                     initialData={editingSurvey} 
// // // // // // // // // // // //                     viewOnly={isViewOnly} 
// // // // // // // // // // // //                 />
// // // // // // // // // // // //             )}

// // // // // // // // // // // //             {showSurveyTable && (
// // // // // // // // // // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // // // // // // // // // //                     {/* FILTERS */}
// // // // // // // // // // // //                     <div style={styles.filterBox}>
// // // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}>
// // // // // // // // // // // //                             <option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}
// // // // // // // // // // // //                         </select>
// // // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}>
// // // // // // // // // // // //                             <option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}
// // // // // // // // // // // //                         </select>
// // // // // // // // // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} />
// // // // // // // // // // // //                         <span style={{display:'flex', alignItems:'center'}}>to</span>
// // // // // // // // // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // // // // // // // // // // //                     </div>

// // // // // // // // // // // //                     <table style={styles.table}>
// // // // // // // // // // // //                         <thead>
// // // // // // // // // // // //                             <tr style={{textAlign:'left', background:'#f9f9f9'}}>
// // // // // // // // // // // //                                 <th style={styles.th}>Filename</th>
// // // // // // // // // // // //                                 <th style={styles.th}>Shot</th>
// // // // // // // // // // // //                                 <th style={styles.th}>Type</th>
// // // // // // // // // // // //                                 <th style={styles.th}>Media</th>
// // // // // // // // // // // //                                 <th style={styles.th}>Action</th>
// // // // // // // // // // // //                             </tr>
// // // // // // // // // // // //                         </thead>
// // // // // // // // // // // //                         <tbody>
// // // // // // // // // // // //                             {filteredSurveys.map(s => {
// // // // // // // // // // // //                                 const tooltip = `Route: ${s.routeName}\nDist: ${s.district}, Blk: ${s.block}\nLoc: ${s.startLocName} -> ${s.endLocName}\nGPS: ${s.latitude}, ${s.longitude}\nDate: ${s.timestamp}`;

// // // // // // // // // // // //                                 return (
// // // // // // // // // // // //                                     <tr key={s.id} title={tooltip} style={{cursor:'help', borderBottom:'1px solid #f0f0f0', background: s.id % 2 === 0 ? '#fff' : '#fafafa'}}>
// // // // // // // // // // // //                                         <td style={styles.td}><b>{s.generatedFileName}</b> <span style={{fontSize:'14px'}}>ℹ️</span></td>
// // // // // // // // // // // //                                         <td style={styles.td}>{s.shotNumber}</td>
// // // // // // // // // // // //                                         <td style={styles.td}>{s.locationType}</td>
// // // // // // // // // // // //                                         <td style={styles.td}>
// // // // // // // // // // // //                                             {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s.videoId)}>Live Vid</button>}
                                            
// // // // // // // // // // // //                                             {s.goproId ? 
// // // // // // // // // // // //                                                 <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button> 
// // // // // // // // // // // //                                                 : 
// // // // // // // // // // // //                                                 <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>
// // // // // // // // // // // //                                             }
                                            
// // // // // // // // // // // //                                             {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // // // // // // //                                         </td>
// // // // // // // // // // // //                                         <td style={styles.td}>
// // // // // // // // // // // //                                             {/* View Button */}
// // // // // // // // // // // //                                             <button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>
                                            
// // // // // // // // // // // //                                             {/* Edit Button */}
// // // // // // // // // // // //                                             {(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}
                                            
// // // // // // // // // // // //                                             {/* Delete Button */}
// // // // // // // // // // // //                                             {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}
// // // // // // // // // // // //                                         </td>
// // // // // // // // // // // //                                     </tr>
// // // // // // // // // // // //                                 );
// // // // // // // // // // // //                             })}
// // // // // // // // // // // //                         </tbody>
// // // // // // // // // // // //                     </table>
// // // // // // // // // // // //                 </ModalWrapper>
// // // // // // // // // // // //             )}

// // // // // // // // // // // //             {/* ADMIN LOGS */}
// // // // // // // // // // // //             {showUserStatus && role === 'admin' && (
// // // // // // // // // // // //                 <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
// // // // // // // // // // // //                     <div style={{display:'flex', gap:'20px', height:'100%'}}>
// // // // // // // // // // // //                         <div style={{flex:1, borderRight:'1px solid #eee'}}>
// // // // // // // // // // // //                             <h4 style={{margin:'0 0 10px 0', color:'#2e7d32'}}>Live User Status</h4>
// // // // // // // // // // // //                             <table style={styles.table}>
// // // // // // // // // // // //                                 <thead><tr><th style={styles.th}>User</th><th style={styles.th}>Status</th><th style={styles.th}>Duration</th></tr></thead>
// // // // // // // // // // // //                                 <tbody>{userStatuses.map((u, i) => <tr key={i}><td style={styles.td}><b>{u.username}</b></td><td style={styles.td}><span style={{...styles.statusDot, background: u.status==='Online'?'green':'grey'}}></span>{u.status}</td><td style={styles.td}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>)}</tbody>
// // // // // // // // // // // //                             </table>
// // // // // // // // // // // //                         </div>
// // // // // // // // // // // //                         <div style={{flex:2}}>
// // // // // // // // // // // //                             <h4 style={{margin:'0 0 10px 0', color:'#1565c0'}}>System Logs</h4>
// // // // // // // // // // // //                             {/* FIXED: Used setFilterStart/End correctly */}
// // // // // // // // // // // //                             <div style={{marginBottom:'10px', background:'#f5f5f5', padding:'10px', borderRadius:'4px'}}>From <input type="date" onChange={e => setFilterStart(e.target.value)}/> To <input type="date" onChange={e => setFilterEnd(e.target.value)}/></div>
// // // // // // // // // // // //                             <div style={{maxHeight:'300px', overflowY:'auto'}}>
// // // // // // // // // // // //                                 <table style={styles.table}><thead><tr><th style={styles.th}>Time</th><th style={styles.th}>User</th><th style={styles.th}>Action</th><th style={styles.th}>Details</th></tr></thead><tbody>{getFilteredLogs().map((l,i) => <tr key={i}><td style={{padding:'8px', fontSize:'11px', color:'#666'}}>{l.displayTime}</td><td style={styles.td}><b>{l.username}</b></td><td style={styles.td}>{l.action}</td><td style={styles.td}><small>{l.details}</small></td></tr>)}</tbody></table>
// // // // // // // // // // // //                             </div>
// // // // // // // // // // // //                         </div>
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                 </ModalWrapper>
// // // // // // // // // // // //             )}

// // // // // // // // // // // //             {uploadModalId && <ModalWrapper title="Upload GoPro Video" onClose={()=>setUploadModalId(null)}>
// // // // // // // // // // // //                 <div style={{padding:'40px', textAlign:'center', border:'2px dashed #ccc', borderRadius:'8px', margin:'20px'}}>
// // // // // // // // // // // //                     <p style={{marginBottom:'15px', color:'#666'}}>Select the GoPro video file for this survey record.</p>
// // // // // // // // // // // //                     <input type="file" accept="video/*" onChange={handleGoProUpload} />
// // // // // // // // // // // //                 </div>
// // // // // // // // // // // //             </ModalWrapper>}

// // // // // // // // // // // //             {currentMedia && (
// // // // // // // // // // // //                 <ModalWrapper title="Media Viewer" onClose={() => setCurrentMedia(null)}>
// // // // // // // // // // // //                     <div style={{textAlign:'center', background:'black', padding:'10px', borderRadius:'4px'}}>
// // // // // // // // // // // //                         {currentMedia.type === 'video' ? <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} /> : <img src={currentMedia.url} alt="Evd" style={{width:'100%', maxHeight:'500px'}} />}
// // // // // // // // // // // //                         <div style={{marginTop:'15px'}}>
// // // // // // // // // // // //                             <a href={currentMedia.url} download={currentMedia.filename} style={styles.downloadBtn}>Download Media</a>
// // // // // // // // // // // //                         </div>
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                 </ModalWrapper>
// // // // // // // // // // // //             )}

// // // // // // // // // // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map to select location (Click here to cancel)</div>}
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //     );
// // // // // // // // // // // // };

// // // // // // // // // // // // export default Dashboard;



// // // // // // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // // // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // // // // // // // // // // import 'leaflet/dist/leaflet.css';
// // // // // // // // // // // import L from 'leaflet';
// // // // // // // // // // // import SurveyForm from './SurveyForm';
// // // // // // // // // // // import { 
// // // // // // // // // // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // // // // // // // // // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // // // // // // // // // } from './db';

// // // // // // // // // // // // --- Icons ---
// // // // // // // // // // // const DefaultIcon = L.icon({
// // // // // // // // // // //     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
// // // // // // // // // // //     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// // // // // // // // // // //     iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
// // // // // // // // // // // });
// // // // // // // // // // // L.Marker.prototype.options.icon = DefaultIcon;

// // // // // // // // // // // const SurveyIcon = L.divIcon({
// // // // // // // // // // //     className: 'custom-survey-icon',
// // // // // // // // // // //     html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>',
// // // // // // // // // // //     iconSize: [16, 16]
// // // // // // // // // // // });

// // // // // // // // // // // // --- Constants ---
// // // // // // // // // // // const DATA_HIERARCHY = {
// // // // // // // // // // //     districts: ['VARANASI', 'Hyderabad'],
// // // // // // // // // // //     blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] },
// // // // // // // // // // //     spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] },
// // // // // // // // // // //     rings: { 'Span-Uppal': ['Ring-01'] }
// // // // // // // // // // // };

// // // // // // // // // // // const SPAN_COORDS = {
// // // // // // // // // // //     'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } },
// // // // // // // // // // //     'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } }
// // // // // // // // // // // };

// // // // // // // // // // // // --- Helpers ---
// // // // // // // // // // // const getRingPath = (start, end, offsetFactor) => {
// // // // // // // // // // //     const midLat = (start.lat + end.lat) / 2;
// // // // // // // // // // //     const midLng = (start.lng + end.lng) / 2;
// // // // // // // // // // //     return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end];
// // // // // // // // // // // };

// // // // // // // // // // // const ModalWrapper = ({ children, title, onClose }) => (
// // // // // // // // // // //     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
// // // // // // // // // // //         <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}>
// // // // // // // // // // //             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}>
// // // // // // // // // // //                 <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3>
// // // // // // // // // // //                 <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button>
// // // // // // // // // // //             </div>
// // // // // // // // // // //             <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div>
// // // // // // // // // // //         </div>
// // // // // // // // // // //     </div>
// // // // // // // // // // // );

// // // // // // // // // // // const MapPickHandler = ({ isPicking, onPick }) => {
// // // // // // // // // // //     useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } });
// // // // // // // // // // //     useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]);
// // // // // // // // // // //     return null;
// // // // // // // // // // // };

// // // // // // // // // // // const MapUpdater = ({ center }) => {
// // // // // // // // // // //     const map = useMap();
// // // // // // // // // // //     useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]);
// // // // // // // // // // //     return null;
// // // // // // // // // // // };

// // // // // // // // // // // // --- MAIN DASHBOARD ---
// // // // // // // // // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // // // // // // // // //     // Dropdown States
// // // // // // // // // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // // // // // // // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // // // // // // // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // // // // // // // // //     const [selectedRing, setSelectedRing] = useState('');
    
// // // // // // // // // // //     // GIS Logic States
// // // // // // // // // // //     const [startPoint, setStartPoint] = useState(null);
// // // // // // // // // // //     const [endPoint, setEndPoint] = useState(null);
// // // // // // // // // // //     const [displayPath, setDisplayPath] = useState([]);
// // // // // // // // // // //     const [isRingView, setIsRingView] = useState(false);
    
// // // // // // // // // // //     // Data States
// // // // // // // // // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // // // // // // // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // // // // // // // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // // // // // // // // //     const [logs, setLogs] = useState([]);
// // // // // // // // // // //     const [userRoutes, setUserRoutes] = useState([]);
    
// // // // // // // // // // //     // UI States
// // // // // // // // // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // // // // // // // // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // // // // // // // // // //     const [isViewOnly, setIsViewOnly] = useState(false);
// // // // // // // // // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // // // // // // // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // // // // // // // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // // // // // // // // //     const [showUserStatus, setShowUserStatus] = useState(false);
    
// // // // // // // // // // //     // Media & Uploads
// // // // // // // // // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // // // // // // // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // // // // // // // // //     // Filters
// // // // // // // // // // //     const [searchDist, setSearchDist] = useState('');
// // // // // // // // // // //     const [searchBlock, setSearchBlock] = useState('');
// // // // // // // // // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // // // // // // // // //     const [searchDateTo, setSearchDateTo] = useState('');
// // // // // // // // // // //     const [filterStart, setFilterStart] = useState('');
// // // // // // // // // // //     const [filterEnd, setFilterEnd] = useState('');

// // // // // // // // // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // // // // // // // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // // // // // // // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // // // // // // // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // // // // // // // // //     const applyFilters = useCallback((data) => {
// // // // // // // // // // //         let filtered = data;
// // // // // // // // // // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // // // // // // // // // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // // // // // // // // // //         if (searchDateFrom && searchDateTo) {
// // // // // // // // // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // // // // // // // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // // // // // // // // //             filtered = filtered.filter(s => {
// // // // // // // // // // //                 const sDate = new Date(s.id).getTime(); 
// // // // // // // // // // //                 return sDate >= from && sDate <= to;
// // // // // // // // // // //             });
// // // // // // // // // // //         }
// // // // // // // // // // //         setFilteredSurveys(filtered);
// // // // // // // // // // //     }, [searchDist, searchBlock, searchDateFrom, searchDateTo]);

// // // // // // // // // // //     const refreshData = useCallback(async () => {
// // // // // // // // // // //         try {
// // // // // // // // // // //             const surveys = await getAllSurveys();
// // // // // // // // // // //             const allSurveys = surveys || [];
// // // // // // // // // // //             setSubmittedSurveys(allSurveys);
// // // // // // // // // // //             applyFilters(allSurveys);

// // // // // // // // // // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // // // // // // // // // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);

// // // // // // // // // // //             const routes = {};
// // // // // // // // // // //             allSurveys.forEach(s => {
// // // // // // // // // // //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// // // // // // // // // // //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // // // // //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // // // // //                 routes[s.routeName].name = s.routeName;
// // // // // // // // // // //             });
// // // // // // // // // // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // // // // // // // // // //             setUserRoutes(lines);
// // // // // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // // // // //     }, [applyFilters]);

// // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // //         refreshData();
// // // // // // // // // // //         const interval = setInterval(refreshData, 5000); 
// // // // // // // // // // //         return () => clearInterval(interval);
// // // // // // // // // // //     }, [refreshData]);

// // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // //         applyFilters(submittedSurveys);
// // // // // // // // // // //     }, [searchDist, searchBlock, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); return; }
// // // // // // // // // // //         const data = SPAN_COORDS[selectedSpan];
// // // // // // // // // // //         if(data) {
// // // // // // // // // // //             setStartPoint(data.start); setEndPoint(data.end);
// // // // // // // // // // //             if (selectedRing) {
// // // // // // // // // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // // // // // // // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // // // // // // // // //                 setIsRingView(true); setDisplayPath(path); 
// // // // // // // // // // //             } else {
// // // // // // // // // // //                 setIsRingView(false); setDisplayPath([data.start, data.end]);
// // // // // // // // // // //             }
// // // // // // // // // // //         }
// // // // // // // // // // //     }, [selectedSpan, selectedRing]);

// // // // // // // // // // //     const handleSurveySubmit = async (formData) => {
// // // // // // // // // // //         try {
// // // // // // // // // // //             const timestamp = Date.now();
// // // // // // // // // // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // // // // // // // // // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // // // // // // // // // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // // // // // // // // // //             const enrichedData = {
// // // // // // // // // // //                 ...formData,
// // // // // // // // // // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // // // // // // // // // //                 submittedBy: user,
// // // // // // // // // // //                 timestamp: new Date().toLocaleString(),
// // // // // // // // // // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // // // // // // // // // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // // // // // // // // // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // // // // // // // // // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // // // // // // // // // //             };
// // // // // // // // // // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // // // // // // // // // //             if (editingSurvey) {
// // // // // // // // // // //                 await updateSurveyInDB(enrichedData);
// // // // // // // // // // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // // // // //                 alert("Updated!");
// // // // // // // // // // //             } else {
// // // // // // // // // // //                 await saveSurveyToDB(enrichedData);
// // // // // // // // // // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // // // // //                 alert(`Saved!`);
// // // // // // // // // // //             }
// // // // // // // // // // //             setShowSurveyForm(false);
// // // // // // // // // // //             setEditingSurvey(null);
// // // // // // // // // // //             setIsViewOnly(false);
// // // // // // // // // // //             refreshData();
// // // // // // // // // // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleDeleteSurvey = async (id) => {
// // // // // // // // // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // // // // // // // // //             await deleteSurveyFromDB(id);
// // // // // // // // // // //             await deleteMediaFromDisk(`video_${id}`);
// // // // // // // // // // //             await deleteMediaFromDisk(`photo_${id}`);
// // // // // // // // // // //             await deleteMediaFromDisk(`gopro_${id}`);
// // // // // // // // // // //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // // // // // // // // //             refreshData();
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleGoProUpload = async (e) => {
// // // // // // // // // // //         if(e.target.files[0]) {
// // // // // // // // // // //             const file = e.target.files[0];
// // // // // // // // // // //             const url = URL.createObjectURL(file); 
// // // // // // // // // // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // // // // // // // // // //             if (survey) {
// // // // // // // // // // //                 const mediaId = `gopro_${survey.id}`;
// // // // // // // // // // //                 await saveMediaToDisk(mediaId, file);
// // // // // // // // // // //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// // // // // // // // // // //                 await updateSurveyInDB(updatedSurvey);
// // // // // // // // // // //                 alert("GoPro Uploaded!");
// // // // // // // // // // //                 setUploadModalId(null);
// // // // // // // // // // //                 refreshData();
// // // // // // // // // // //             }
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleViewMedia = async (type, id) => {
// // // // // // // // // // //         if (!id) return;
// // // // // // // // // // //         try {
// // // // // // // // // // //             const blob = await getMediaFromDisk(id);
// // // // // // // // // // //             if (blob) {
// // // // // // // // // // //                 const url = URL.createObjectURL(blob);
// // // // // // // // // // //                 setCurrentMedia({ type, url, filename: type==='video'?'video.webm':'photo.jpg' });
// // // // // // // // // // //             } else { alert("Media file not in DB."); }
// // // // // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // // // // //     };

// // // // // // // // // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // // // // // // // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };

// // // // // // // // // // //     const getSessionDuration = (loginTimeStr) => {
// // // // // // // // // // //         if (!loginTimeStr) return '-';
// // // // // // // // // // //         const diffMs = new Date() - new Date(loginTimeStr);
// // // // // // // // // // //         return `${Math.floor(diffMs / 60000)} mins`;
// // // // // // // // // // //     };

// // // // // // // // // // //     const getFilteredLogs = () => {
// // // // // // // // // // //         if (!filterStart && !filterEnd) return logs;
// // // // // // // // // // //         const start = filterStart ? new Date(filterStart).getTime() : 0;
// // // // // // // // // // //         const end = filterEnd ? new Date(filterEnd).getTime() + 86400000 : 9999999999999;
// // // // // // // // // // //         return logs.filter(log => {
// // // // // // // // // // //             const logTime = new Date(log.isoTime).getTime();
// // // // // // // // // // //             return logTime >= start && logTime <= end;
// // // // // // // // // // //         });
// // // // // // // // // // //     };

// // // // // // // // // // //     const styles = {
// // // // // // // // // // //         container: { 
// // // // // // // // // // //             display: 'flex', 
// // // // // // // // // // //             flexDirection: 'column', 
// // // // // // // // // // //             height: '100dvh', // Dynamic Viewport Height (Fixes mobile browser bar issue)
// // // // // // // // // // //             width: '100vw',
// // // // // // // // // // //             fontFamily: 'Arial, sans-serif',
// // // // // // // // // // //             overflow: 'hidden', // Prevent outer scrolling
// // // // // // // // // // //             position: 'fixed'   // Lock to screen
// // // // // // // // // // //         },
// // // // // // // // // // //         header: { 
// // // // // // // // // // //             padding: '10px', 
// // // // // // // // // // //             background: '#1a237e', 
// // // // // // // // // // //             color: 'white', 
// // // // // // // // // // //             display: 'flex', 
// // // // // // // // // // //             justifyContent: 'space-between', 
// // // // // // // // // // //             alignItems: 'center',
// // // // // // // // // // //             flexShrink: 0 // Prevent header from shrinking
// // // // // // // // // // //         },
// // // // // // // // // // //         // Controls Group
// // // // // // // // // // //         controlsLeft: { display:'flex', alignItems:'center', gap:'15px' },
// // // // // // // // // // //         controlsRight: { display:'flex', gap:'10px', alignItems:'center' },
        
// // // // // // // // // // //         select: { padding: '6px 8px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // // // // // // // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px', border:'1px solid rgba(255,255,255,0.3)' },
        
// // // // // // // // // // //         btnGreen: { padding: '6px 12px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px' },
// // // // // // // // // // //         btnWhite: { padding: '6px 12px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px' },
// // // // // // // // // // //         btnRed: { padding: '6px 12px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px' },
        
// // // // // // // // // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // // // // // // // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // // // // // // // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // // // // // // // // //         actionBtn: { padding:'4px 10px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // // // // // // // // //         downloadBtn: { display:'inline-block', marginTop:'10px', padding:'10px 20px', background:'#2196f3', color:'white', textDecoration:'none', borderRadius:'5px', fontWeight:'bold' },
// // // // // // // // // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // // // // // // // // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'}
// // // // // // // // // // //     };

// // // // // // // // // // //     return (
// // // // // // // // // // //         <div style={styles.container}>
// // // // // // // // // // //             <div style={styles.header}>
// // // // // // // // // // //                 <div style={styles.controlsLeft}>
// // // // // // // // // // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // // // // // // // // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
                    
// // // // // // // // // // //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // // // // // // //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // // // // // // //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // // // // // // // // //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring (Opt)</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // // // // // // // // //                 </div>
                
// // // // // // // // // // //                 <div style={styles.controlsRight}>
// // // // // // // // // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New Survey</button>
// // // // // // // // // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>View Data ({submittedSurveys.length})</button>
// // // // // // // // // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // // // // // // // // // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // // // // // // // // // //                 </div>
// // // // // // // // // // //             </div>

// // // // // // // // // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // // // // // // // // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // // // // // // // // //                 <LayersControl position="topright">
// // // // // // // // // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // // // // // // // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // // // // // // // // //                 </LayersControl>
                
// // // // // // // // // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // // // // // // // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // // // // // // // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // // // // // // // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
                
// // // // // // // // // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
                
// // // // // // // // // // //                 {submittedSurveys.map(s => s.latitude && (
// // // // // // // // // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // // // // // // // // //                         <Popup minWidth={250}>
// // // // // // // // // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // // // // // // // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>
// // // // // // // // // // //                                     {s.locationType}
// // // // // // // // // // //                                 </div>
// // // // // // // // // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // // // // // // // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // // // // // // // // //                                 <div><b>Loc:</b> {s.startLocName} ➝ {s.endLocName}</div>
// // // // // // // // // // //                                 <div style={{marginTop:'10px'}}>
// // // // // // // // // // //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s.videoId)}>Video</button>}
// // // // // // // // // // //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // // // // // //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button>}
// // // // // // // // // // //                                 </div>
// // // // // // // // // // //                             </div>
// // // // // // // // // // //                         </Popup>
                        
// // // // // // // // // // //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// // // // // // // // // // //                             <span style={{fontWeight:'bold'}}>{s.locationType}</span><br/>
// // // // // // // // // // //                             {s.routeName}
// // // // // // // // // // //                         </Tooltip>
// // // // // // // // // // //                     </Marker>
// // // // // // // // // // //                 ))}
// // // // // // // // // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // // // // // // // // //             </MapContainer>

// // // // // // // // // // //             {showSurveyForm && (
// // // // // // // // // // //                 <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />
// // // // // // // // // // //             )}

// // // // // // // // // // //             {showSurveyTable && (
// // // // // // // // // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // // // // // // // // //                     <div style={styles.filterBox}>
// // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // // // // // // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // // // // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} />
// // // // // // // // // // //                         <span style={{display:'flex', alignItems:'center'}}>to</span>
// // // // // // // // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // // // // // // // // // //                     </div>

// // // // // // // // // // //                     <table style={styles.table}>
// // // // // // // // // // //                         <thead>
// // // // // // // // // // //                             <tr style={{textAlign:'left', background:'#f9f9f9'}}>
// // // // // // // // // // //                                 <th style={styles.th}>Filename</th>
// // // // // // // // // // //                                 <th style={styles.th}>Shot</th>
// // // // // // // // // // //                                 <th style={styles.th}>Type</th>
// // // // // // // // // // //                                 <th style={styles.th}>Media</th>
// // // // // // // // // // //                                 <th style={styles.th}>Action</th>
// // // // // // // // // // //                             </tr>
// // // // // // // // // // //                         </thead>
// // // // // // // // // // //                         <tbody>
// // // // // // // // // // //                             {filteredSurveys.map(s => (
// // // // // // // // // // //                                 <tr key={s.id} title={`Route: ${s.routeName}\nDist: ${s.district}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0', background: s.id % 2 === 0 ? '#fff' : '#fafafa'}}>
// // // // // // // // // // //                                     <td style={styles.td}><b>{s.generatedFileName}</b> <span style={{fontSize:'14px'}}>ℹ️</span></td>
// // // // // // // // // // //                                     <td style={styles.td}>{s.shotNumber}</td>
// // // // // // // // // // //                                     <td style={styles.td}>{s.locationType}</td>
// // // // // // // // // // //                                     <td style={styles.td}>
// // // // // // // // // // //                                         {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s.videoId)}>Live Vid</button>}
                                        
// // // // // // // // // // //                                         {s.goproId ? 
// // // // // // // // // // //                                             <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button> 
// // // // // // // // // // //                                             : 
// // // // // // // // // // //                                             <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>
// // // // // // // // // // //                                         }
                                        
// // // // // // // // // // //                                         {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // // // // // //                                     </td>
// // // // // // // // // // //                                     <td style={styles.td}>
// // // // // // // // // // //                                         <button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>
// // // // // // // // // // //                                         {(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}
// // // // // // // // // // //                                         {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}
// // // // // // // // // // //                                     </td>
// // // // // // // // // // //                                 </tr>
// // // // // // // // // // //                             ))}
// // // // // // // // // // //                         </tbody>
// // // // // // // // // // //                     </table>
// // // // // // // // // // //                 </ModalWrapper>
// // // // // // // // // // //             )}

// // // // // // // // // // //             {showUserStatus && role === 'admin' && (
// // // // // // // // // // //                 <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
// // // // // // // // // // //                     <div style={{display:'flex', gap:'20px', height:'100%'}}>
// // // // // // // // // // //                         <div style={{flex:1, borderRight:'1px solid #eee'}}>
// // // // // // // // // // //                             <h4 style={{margin:'0 0 10px 0', color:'#2e7d32'}}>Live User Status</h4>
// // // // // // // // // // //                             <table style={styles.table}>
// // // // // // // // // // //                                 <thead><tr><th style={styles.th}>User</th><th style={styles.th}>Status</th><th style={styles.th}>Duration</th></tr></thead>
// // // // // // // // // // //                                 <tbody>{userStatuses.map((u, i) => <tr key={i}><td style={styles.td}><b>{u.username}</b></td><td style={styles.td}><span style={{...styles.statusDot, background: u.status==='Online'?'green':'grey'}}></span>{u.status}</td><td style={styles.td}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>)}</tbody>
// // // // // // // // // // //                             </table>
// // // // // // // // // // //                         </div>
// // // // // // // // // // //                         <div style={{flex:2}}>
// // // // // // // // // // //                             <h4 style={{margin:'0 0 10px 0', color:'#1565c0'}}>System Logs</h4>
// // // // // // // // // // //                             <div style={{marginBottom:'10px', background:'#f5f5f5', padding:'10px', borderRadius:'4px'}}>From <input type="date" onChange={e => setFilterStart(e.target.value)}/> To <input type="date" onChange={e => setFilterEnd(e.target.value)}/></div>
// // // // // // // // // // //                             <div style={{maxHeight:'300px', overflowY:'auto'}}>
// // // // // // // // // // //                                 <table style={styles.table}><thead><tr><th style={styles.th}>Time</th><th style={styles.th}>User</th><th style={styles.th}>Action</th><th style={styles.th}>Details</th></tr></thead><tbody>{getFilteredLogs().map((l,i) => <tr key={i}><td style={{padding:'8px', fontSize:'11px', color:'#666'}}>{l.displayTime}</td><td style={styles.td}><b>{l.username}</b></td><td style={styles.td}>{l.action}</td><td style={styles.td}><small>{l.details}</small></td></tr>)}</tbody></table>
// // // // // // // // // // //                             </div>
// // // // // // // // // // //                         </div>
// // // // // // // // // // //                     </div>
// // // // // // // // // // //                 </ModalWrapper>
// // // // // // // // // // //             )}

// // // // // // // // // // //             {uploadModalId && <ModalWrapper title="Upload GoPro Video" onClose={()=>setUploadModalId(null)}><div style={{padding:'40px', textAlign:'center', border:'2px dashed #ccc', borderRadius:'8px', margin:'20px'}}><p style={{marginBottom:'15px', color:'#666'}}>Select the GoPro video file for this survey record.</p><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
// // // // // // // // // // //             {currentMedia && <ModalWrapper title="Media Viewer" onClose={() => setCurrentMedia(null)}><div style={{textAlign:'center', background:'black', padding:'10px', borderRadius:'4px'}}>{currentMedia.type === 'video' ? <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} /> : <img src={currentMedia.url} alt="Evd" style={{width:'100%', maxHeight:'500px'}} />}<div style={{marginTop:'15px'}}><a href={currentMedia.url} download={currentMedia.filename} style={styles.downloadBtn}>Download Media</a></div></div></ModalWrapper>}
// // // // // // // // // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map to select location (Click here to cancel)</div>}
// // // // // // // // // // //         </div>
// // // // // // // // // // //     );
// // // // // // // // // // // };

// // // // // // // // // // // export default Dashboard;









// // // // // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents } from 'react-leaflet';
// // // // // // // // // // import 'leaflet/dist/leaflet.css';
// // // // // // // // // // import L from 'leaflet';
// // // // // // // // // // import SurveyForm from './SurveyForm';
// // // // // // // // // // import { 
// // // // // // // // // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // // // // // // // // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // // // // // // // // } from './db';

// // // // // // // // // // // --- Icons ---
// // // // // // // // // // const DefaultIcon = L.icon({
// // // // // // // // // //     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
// // // // // // // // // //     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// // // // // // // // // //     iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
// // // // // // // // // // });
// // // // // // // // // // L.Marker.prototype.options.icon = DefaultIcon;

// // // // // // // // // // const SurveyIcon = L.divIcon({
// // // // // // // // // //     className: 'custom-survey-icon',
// // // // // // // // // //     html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>',
// // // // // // // // // //     iconSize: [16, 16]
// // // // // // // // // // });

// // // // // // // // // // const DATA_HIERARCHY = {
// // // // // // // // // //     districts: ['VARANASI', 'Hyderabad'],
// // // // // // // // // //     blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] },
// // // // // // // // // //     spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] },
// // // // // // // // // //     rings: { 'Span-Uppal': ['Ring-01'] }
// // // // // // // // // // };

// // // // // // // // // // const SPAN_COORDS = {
// // // // // // // // // //     'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } },
// // // // // // // // // //     'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } }
// // // // // // // // // // };

// // // // // // // // // // const getRingPath = (start, end, offsetFactor) => {
// // // // // // // // // //     const midLat = (start.lat + end.lat) / 2;
// // // // // // // // // //     const midLng = (start.lng + end.lng) / 2;
// // // // // // // // // //     return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end];
// // // // // // // // // // };

// // // // // // // // // // const generatePointsOnPath = (path, count) => {
// // // // // // // // // //     const points = [];
// // // // // // // // // //     for (let i = 1; i <= count; i++) {
// // // // // // // // // //         const ratio = i / (count + 1);
// // // // // // // // // //         points.push({
// // // // // // // // // //             lat: path[0].lat + (path[1].lat - path[0].lat) * ratio,
// // // // // // // // // //             lng: path[0].lng + (path[1].lng - path[0].lng) * ratio,
// // // // // // // // // //             id: `SP-${i}`
// // // // // // // // // //         });
// // // // // // // // // //     }
// // // // // // // // // //     return points;
// // // // // // // // // // };

// // // // // // // // // // const ModalWrapper = ({ children, title, onClose }) => (
// // // // // // // // // //     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
// // // // // // // // // //         <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}>
// // // // // // // // // //             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}>
// // // // // // // // // //                 <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3>
// // // // // // // // // //                 <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button>
// // // // // // // // // //             </div>
// // // // // // // // // //             <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div>
// // // // // // // // // //         </div>
// // // // // // // // // //     </div>
// // // // // // // // // // );

// // // // // // // // // // const MapPickHandler = ({ isPicking, onPick }) => {
// // // // // // // // // //     useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } });
// // // // // // // // // //     useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]);
// // // // // // // // // //     return null;
// // // // // // // // // // };

// // // // // // // // // // const MapUpdater = ({ center }) => {
// // // // // // // // // //     const map = useMap();
// // // // // // // // // //     useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]);
// // // // // // // // // //     return null;
// // // // // // // // // // };

// // // // // // // // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // // // // // // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // // // // // // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // // // // // // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // // // // // // // //     const [selectedRing, setSelectedRing] = useState('');
    
// // // // // // // // // //     const [startPoint, setStartPoint] = useState(null);
// // // // // // // // // //     const [endPoint, setEndPoint] = useState(null);
// // // // // // // // // //     const [displayPath, setDisplayPath] = useState([]);
// // // // // // // // // //     const [isRingView, setIsRingView] = useState(false);
// // // // // // // // // //     const [diggingPoints, setDiggingPoints] = useState([]);
    
// // // // // // // // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // // // // // // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // // // // // // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // // // // // // // //     const [logs, setLogs] = useState([]);
// // // // // // // // // //     const [userRoutes, setUserRoutes] = useState([]);
    
// // // // // // // // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // // // // // // // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // // // // // // // // //     const [isViewOnly, setIsViewOnly] = useState(false);
// // // // // // // // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // // // // // // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // // // // // // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // // // // // // // //     const [showUserStatus, setShowUserStatus] = useState(false);
    
// // // // // // // // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // // // // // // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // // // // // // // //     const [searchDist, setSearchDist] = useState('');
// // // // // // // // // //     const [searchBlock, setSearchBlock] = useState('');
// // // // // // // // // //     const [searchGeneric, setSearchGeneric] = useState('');
// // // // // // // // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // // // // // // // //     const [searchDateTo, setSearchDateTo] = useState('');
// // // // // // // // // //     const [filterStart, setFilterStart] = useState('');
// // // // // // // // // //     const [filterEnd, setFilterEnd] = useState('');

// // // // // // // // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // // // // // // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // // // // // // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // // // // // // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // // // // // // // //     const applyFilters = useCallback((data) => {
// // // // // // // // // //         let filtered = data;
// // // // // // // // // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // // // // // // // // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // // // // // // // // //         if (searchGeneric) {
// // // // // // // // // //             const lowerTerm = searchGeneric.toLowerCase();
// // // // // // // // // //             filtered = filtered.filter(s => 
// // // // // // // // // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(lowerTerm)) ||
// // // // // // // // // //                 (s.routeName && s.routeName.toLowerCase().includes(lowerTerm)) ||
// // // // // // // // // //                 (s.locationType && s.locationType.toLowerCase().includes(lowerTerm))
// // // // // // // // // //             );
// // // // // // // // // //         }
// // // // // // // // // //         if (searchDateFrom && searchDateTo) {
// // // // // // // // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // // // // // // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // // // // // // // //             filtered = filtered.filter(s => {
// // // // // // // // // //                 const sDate = new Date(s.id).getTime(); 
// // // // // // // // // //                 return sDate >= from && sDate <= to;
// // // // // // // // // //             });
// // // // // // // // // //         }
// // // // // // // // // //         setFilteredSurveys(filtered);
// // // // // // // // // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // // // // // // // // //     const refreshData = useCallback(async () => {
// // // // // // // // // //         try {
// // // // // // // // // //             const surveys = await getAllSurveys();
// // // // // // // // // //             const allSurveys = surveys || [];
// // // // // // // // // //             setSubmittedSurveys(allSurveys);
// // // // // // // // // //             applyFilters(allSurveys);

// // // // // // // // // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // // // // // // // // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);

// // // // // // // // // //             const routes = {};
// // // // // // // // // //             allSurveys.forEach(s => {
// // // // // // // // // //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// // // // // // // // // //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // // // //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // // // //                 routes[s.routeName].name = s.routeName;
// // // // // // // // // //             });
// // // // // // // // // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // // // // // // // // //             setUserRoutes(lines);
// // // // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // // // //     }, [applyFilters]);

// // // // // // // // // //     useEffect(() => {
// // // // // // // // // //         refreshData();
// // // // // // // // // //         const interval = setInterval(refreshData, 5000); 
// // // // // // // // // //         return () => clearInterval(interval);
// // // // // // // // // //     }, [refreshData]);

// // // // // // // // // //     useEffect(() => {
// // // // // // // // // //         applyFilters(submittedSurveys);
// // // // // // // // // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// // // // // // // // // //     useEffect(() => {
// // // // // // // // // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // // // // // // // // //         const data = SPAN_COORDS[selectedSpan];
// // // // // // // // // //         if(data) {
// // // // // // // // // //             setStartPoint(data.start); setEndPoint(data.end);
// // // // // // // // // //             if (selectedRing) {
// // // // // // // // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // // // // // // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // // // // // // // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // // // // // // // // //             } else {
// // // // // // // // // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // // // // // // // //             }
// // // // // // // // // //         }
// // // // // // // // // //     }, [selectedSpan, selectedRing]);

// // // // // // // // // //     const handleSurveySubmit = async (formData) => {
// // // // // // // // // //         try {
// // // // // // // // // //             const timestamp = Date.now();
// // // // // // // // // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // // // // // // // // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // // // // // // // // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // // // // // // // // //             const enrichedData = {
// // // // // // // // // //                 ...formData,
// // // // // // // // // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // // // // // // // // //                 submittedBy: user,
// // // // // // // // // //                 timestamp: new Date().toLocaleString(),
// // // // // // // // // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // // // // // // // // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // // // // // // // // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // // // // // // // // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // // // // // // // // //             };
// // // // // // // // // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // // // // // // // // //             if (editingSurvey) {
// // // // // // // // // //                 await updateSurveyInDB(enrichedData);
// // // // // // // // // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // // // //                 alert("Updated!");
// // // // // // // // // //             } else {
// // // // // // // // // //                 await saveSurveyToDB(enrichedData);
// // // // // // // // // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // // // //                 alert(`Saved!`);
// // // // // // // // // //             }
// // // // // // // // // //             setShowSurveyForm(false);
// // // // // // // // // //             setEditingSurvey(null);
// // // // // // // // // //             setIsViewOnly(false);
// // // // // // // // // //             refreshData();
// // // // // // // // // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // // // // // // // // //     };

// // // // // // // // // //     const handleDeleteSurvey = async (id) => {
// // // // // // // // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // // // // // // // //             await deleteSurveyFromDB(id);
// // // // // // // // // //             await deleteMediaFromDisk(`video_${id}`);
// // // // // // // // // //             await deleteMediaFromDisk(`photo_${id}`);
// // // // // // // // // //             await deleteMediaFromDisk(`gopro_${id}`);
// // // // // // // // // //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // // // // // // // //             refreshData();
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     const handleGoProUpload = async (e) => {
// // // // // // // // // //         if(e.target.files[0]) {
// // // // // // // // // //             const file = e.target.files[0];
// // // // // // // // // //             const url = URL.createObjectURL(file); 
// // // // // // // // // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // // // // // // // // //             if (survey) {
// // // // // // // // // //                 const mediaId = `gopro_${survey.id}`;
// // // // // // // // // //                 await saveMediaToDisk(mediaId, file);
// // // // // // // // // //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// // // // // // // // // //                 await updateSurveyInDB(updatedSurvey);
// // // // // // // // // //                 alert("GoPro Uploaded!");
// // // // // // // // // //                 setUploadModalId(null);
// // // // // // // // // //                 refreshData();
// // // // // // // // // //             }
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     const handleViewMedia = async (type, id) => {
// // // // // // // // // //         if (!id) return;
// // // // // // // // // //         try {
// // // // // // // // // //             const blob = await getMediaFromDisk(id);
// // // // // // // // // //             if (blob) {
// // // // // // // // // //                 const url = URL.createObjectURL(blob);
// // // // // // // // // //                 setCurrentMedia({ type, url, filename: type==='video'?'video.webm':'photo.jpg' });
// // // // // // // // // //             } else { alert("Media file not in DB."); }
// // // // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // // // //     };

// // // // // // // // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // // // // // // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };

// // // // // // // // // //     const getSessionDuration = (loginTimeStr) => {
// // // // // // // // // //         if (!loginTimeStr) return '-';
// // // // // // // // // //         const diffMs = new Date() - new Date(loginTimeStr);
// // // // // // // // // //         return `${Math.floor(diffMs / 60000)} mins`;
// // // // // // // // // //     };

// // // // // // // // // //     const getFilteredLogs = () => {
// // // // // // // // // //         if (!filterStart && !filterEnd) return logs;
// // // // // // // // // //         const start = new Date(filterStart).getTime();
// // // // // // // // // //         const end = new Date(filterEnd).getTime() + 86400000;
// // // // // // // // // //         return logs.filter(log => {
// // // // // // // // // //             const logTime = new Date(log.isoTime).getTime();
// // // // // // // // // //             return logTime >= start && logTime <= end;
// // // // // // // // // //         });
// // // // // // // // // //     };

// // // // // // // // // //     // --- FIXED MOBILE STYLES ---
// // // // // // // // // //     const styles = {
// // // // // // // // // //         container: { 
// // // // // // // // // //             display: 'flex', 
// // // // // // // // // //             flexDirection: 'column', 
// // // // // // // // // //             height: '100dvh', // Use Dynamic Viewport Height for mobile browsers
// // // // // // // // // //             width: '100vw',
// // // // // // // // // //             fontFamily: 'Arial, sans-serif',
// // // // // // // // // //             overflow: 'hidden',
// // // // // // // // // //             position: 'fixed', // LOCKS THE SCREEN
// // // // // // // // // //             top: 0, left: 0
// // // // // // // // // //         },
// // // // // // // // // //         header: { 
// // // // // // // // // //             padding: '10px', 
// // // // // // // // // //             background: '#1a237e', 
// // // // // // // // // //             color: 'white', 
// // // // // // // // // //             display: 'flex', 
// // // // // // // // // //             alignItems: 'center',
// // // // // // // // // //             justifyContent: 'space-between', 
// // // // // // // // // //             boxShadow:'0 2px 5px rgba(0,0,0,0.2)', 
// // // // // // // // // //             zIndex: 2000,
// // // // // // // // // //             whiteSpace: 'nowrap', 
// // // // // // // // // //             overflowX: 'auto', // Enable HORIZONTAL SCROLLING for header only
// // // // // // // // // //             flexShrink: 0,
// // // // // // // // // //             gap: '15px',
// // // // // // // // // //             // Hide scrollbar for cleaner look
// // // // // // // // // //             scrollbarWidth: 'none', 
// // // // // // // // // //             msOverflowStyle: 'none'
// // // // // // // // // //         },
        
// // // // // // // // // //         // Grouping controls to keep them inline
// // // // // // // // // //         headerGroup: { display: 'flex', gap: '10px', alignItems: 'center' },

// // // // // // // // // //         select: { padding: '6px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // // // // // // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '5px', border:'1px solid rgba(255,255,255,0.3)' },
        
// // // // // // // // // //         btnGreen: { padding: '6px 12px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace: 'nowrap' },
// // // // // // // // // //         btnWhite: { padding: '6px 12px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace: 'nowrap' },
// // // // // // // // // //         btnRed: { padding: '6px 12px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace: 'nowrap' },
        
// // // // // // // // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // // // // // // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // // // // // // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // // // // // // // //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // // // // // // // //         downloadBtn: { display:'inline-block', marginTop:'10px', padding:'10px 20px', background:'#2196f3', color:'white', textDecoration:'none', borderRadius:'5px', fontWeight:'bold' },
// // // // // // // // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer', whiteSpace: 'nowrap' },
// // // // // // // // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // // // // // // // // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'200px' }
// // // // // // // // // //     };

// // // // // // // // // //     return (
// // // // // // // // // //         <div style={styles.container}>
// // // // // // // // // //             <div style={styles.header}>
// // // // // // // // // //                 {/* Left Group: Logo + Dropdowns */}
// // // // // // // // // //                 <div style={styles.headerGroup}>
// // // // // // // // // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // // // // // // // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // // // // // // // // //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // // // // // //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // // // // // //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // // // // // // // //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // // // // // // // //                 </div>
                
// // // // // // // // // //                 {/* Right Group: Buttons */}
// // // // // // // // // //                 <div style={styles.headerGroup}>
// // // // // // // // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// // // // // // // // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// // // // // // // // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // // // // // // // // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // // // // // // // // //                 </div>
// // // // // // // // // //             </div>

// // // // // // // // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1, zIndex: 1 }}>
// // // // // // // // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // // // // // // // //                 <LayersControl position="topright">
// // // // // // // // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // // // // // // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // // // // // // // //                 </LayersControl>
                
// // // // // // // // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // // // // // // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // // // // // // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // // // // // // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // // // // // // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // // // // // // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}

// // // // // // // // // //                 {submittedSurveys.map(s => s.latitude && (
// // // // // // // // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // // // // // // // //                         <Popup minWidth={250}>
// // // // // // // // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // // // // // // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>
// // // // // // // // // //                                     {s.locationType}
// // // // // // // // // //                                 </div>
// // // // // // // // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // // // // // // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // // // // // // // //                                 <div><b>Loc:</b> {s.startLocName} ➝ {s.endLocName}</div>
// // // // // // // // // //                                 <div style={{marginTop:'10px'}}>
// // // // // // // // // //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s.videoId)}>Video</button>}
// // // // // // // // // //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // // // // //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button>}
// // // // // // // // // //                                 </div>
// // // // // // // // // //                             </div>
// // // // // // // // // //                         </Popup>
// // // // // // // // // //                     </Marker>
// // // // // // // // // //                 ))}
// // // // // // // // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // // // // // // // //             </MapContainer>

// // // // // // // // // //             {showSurveyForm && (
// // // // // // // // // //                 <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />
// // // // // // // // // //             )}

// // // // // // // // // //             {showSurveyTable && (
// // // // // // // // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // // // // // // // //                     <div style={styles.filterBox}>
// // // // // // // // // //                         <input type="text" style={styles.searchInput} placeholder="Search filename, route, type..." onChange={e=>setSearchGeneric(e.target.value)} />
// // // // // // // // // //                         <input list="distList" style={styles.select} placeholder="Search District..." onChange={e=>setSearchDist(e.target.value)} />
// // // // // // // // // //                         <datalist id="distList">{visibleDistricts.map(d=><option key={d} value={d} />)}</datalist>
// // // // // // // // // //                         <input list="blkList" style={styles.select} placeholder="Search Block..." onChange={e=>setSearchBlock(e.target.value)} />
// // // // // // // // // //                         <datalist id="blkList">{blockOptions.map(b=><option key={b} value={b} />)}</datalist>
// // // // // // // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} />
// // // // // // // // // //                         <span>to</span>
// // // // // // // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // // // // // // // // //                     </div>

// // // // // // // // // //                     <table style={styles.table}>
// // // // // // // // // //                         <thead>
// // // // // // // // // //                             <tr style={{textAlign:'left', background:'#f9f9f9'}}>
// // // // // // // // // //                                 <th style={styles.th}>Filename</th>
// // // // // // // // // //                                 <th style={styles.th}>Shot</th>
// // // // // // // // // //                                 <th style={styles.th}>Type</th>
// // // // // // // // // //                                 <th style={styles.th}>Media</th>
// // // // // // // // // //                                 <th style={styles.th}>Action</th>
// // // // // // // // // //                             </tr>
// // // // // // // // // //                         </thead>
// // // // // // // // // //                         <tbody>
// // // // // // // // // //                             {filteredSurveys.map(s => {
// // // // // // // // // //                                 const tooltip = `Route: ${s.routeName}\nDist: ${s.district}, Blk: ${s.block}\nLoc: ${s.startLocName} -> ${s.endLocName}\nGPS: ${s.latitude}, ${s.longitude}\nDate: ${s.timestamp}`;
// // // // // // // // // //                                 return (
// // // // // // // // // //                                     <tr key={s.id} title={tooltip} style={{cursor:'help', borderBottom:'1px solid #f0f0f0', background: s.id % 2 === 0 ? '#fff' : '#fafafa'}}>
// // // // // // // // // //                                         <td style={styles.td}><b>{s.generatedFileName}</b> <span style={{fontSize:'14px'}}>ℹ️</span></td>
// // // // // // // // // //                                         <td style={styles.td}>{s.shotNumber}</td>
// // // // // // // // // //                                         <td style={styles.td}>{s.locationType}</td>
// // // // // // // // // //                                         <td style={styles.td}>
// // // // // // // // // //                                             {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s.videoId)}>Live Vid</button>}
// // // // // // // // // //                                             {s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}
// // // // // // // // // //                                             {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // // // // //                                         </td>
// // // // // // // // // //                                         <td style={styles.td}>
// // // // // // // // // //                                             <button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>
// // // // // // // // // //                                             {(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}
// // // // // // // // // //                                             {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}
// // // // // // // // // //                                         </td>
// // // // // // // // // //                                     </tr>
// // // // // // // // // //                                 );
// // // // // // // // // //                             })}
// // // // // // // // // //                         </tbody>
// // // // // // // // // //                     </table>
// // // // // // // // // //                 </ModalWrapper>
// // // // // // // // // //             )}

// // // // // // // // // //             {showUserStatus && role === 'admin' && (
// // // // // // // // // //                 <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}>
// // // // // // // // // //                     <div style={{display:'flex', gap:'20px', height:'100%', flexDirection: 'column'}}>
// // // // // // // // // //                          {/* Updated to Column for Mobile */}
// // // // // // // // // //                         <div style={{flex:1, borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
// // // // // // // // // //                             <h4 style={{margin:'0 0 10px 0', color:'#2e7d32'}}>Live User Status</h4>
// // // // // // // // // //                             <table style={styles.table}>
// // // // // // // // // //                                 <thead><tr><th style={styles.th}>User</th><th style={styles.th}>Status</th><th style={styles.th}>Duration</th></tr></thead>
// // // // // // // // // //                                 <tbody>{userStatuses.map((u, i) => <tr key={i}><td style={styles.td}><b>{u.username}</b></td><td style={styles.td}><span style={{...styles.statusDot, background: u.status==='Online'?'green':'grey'}}></span>{u.status}</td><td style={styles.td}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>)}</tbody>
// // // // // // // // // //                             </table>
// // // // // // // // // //                         </div>
// // // // // // // // // //                         <div style={{flex:2}}>
// // // // // // // // // //                             <h4 style={{margin:'0 0 10px 0', color:'#1565c0'}}>System Logs</h4>
// // // // // // // // // //                             <div style={{marginBottom:'10px', background:'#f5f5f5', padding:'10px', borderRadius:'4px'}}>From <input type="date" onChange={e => setFilterStart(e.target.value)}/> To <input type="date" onChange={e => setFilterEnd(e.target.value)}/></div>
// // // // // // // // // //                             <div style={{maxHeight:'300px', overflowY:'auto'}}>
// // // // // // // // // //                                 <table style={styles.table}><thead><tr><th style={styles.th}>Time</th><th style={styles.th}>User</th><th style={styles.th}>Action</th><th style={styles.th}>Details</th></tr></thead><tbody>{getFilteredLogs().map((l,i) => <tr key={i}><td style={{padding:'8px', fontSize:'11px', color:'#666'}}>{l.displayTime}</td><td style={styles.td}><b>{l.username}</b></td><td style={styles.td}>{l.action}</td><td style={styles.td}><small>{l.details}</small></td></tr>)}</tbody></table>
// // // // // // // // // //                             </div>
// // // // // // // // // //                         </div>
// // // // // // // // // //                     </div>
// // // // // // // // // //                 </ModalWrapper>
// // // // // // // // // //             )}

// // // // // // // // // //             {uploadModalId && <ModalWrapper title="Upload GoPro Video" onClose={()=>setUploadModalId(null)}><div style={{padding:'40px', textAlign:'center', border:'2px dashed #ccc', borderRadius:'8px', margin:'20px'}}><p style={{marginBottom:'15px', color:'#666'}}>Select the GoPro video file for this survey record.</p><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
// // // // // // // // // //             {currentMedia && <ModalWrapper title="Media Viewer" onClose={() => setCurrentMedia(null)}><div style={{textAlign:'center', background:'black', padding:'10px', borderRadius:'4px'}}>{currentMedia.type === 'video' ? <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} /> : <img src={currentMedia.url} alt="Evd" style={{width:'100%', maxHeight:'500px'}} />}<div style={{marginTop:'15px'}}><a href={currentMedia.url} download={currentMedia.filename} style={styles.downloadBtn}>Download Media</a></div></div></ModalWrapper>}
// // // // // // // // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map to select location (Click here to cancel)</div>}
// // // // // // // // // //         </div>
// // // // // // // // // //     );
// // // // // // // // // // };

// // // // // // // // // // export default Dashboard;



// // // // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents } from 'react-leaflet';
// // // // // // // // // import 'leaflet/dist/leaflet.css';
// // // // // // // // // import L from 'leaflet';
// // // // // // // // // import SurveyForm from './SurveyForm';
// // // // // // // // // import { 
// // // // // // // // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // // // // // // // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // // // // // // // } from './db';

// // // // // // // // // const DefaultIcon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
// // // // // // // // // L.Marker.prototype.options.icon = DefaultIcon;
// // // // // // // // // const SurveyIcon = L.divIcon({ className: 'custom-survey-icon', html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', iconSize: [16, 16] });

// // // // // // // // // const DATA_HIERARCHY = {
// // // // // // // // //     districts: ['VARANASI', 'Hyderabad'],
// // // // // // // // //     blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] },
// // // // // // // // //     spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] },
// // // // // // // // //     rings: { 'Span-Uppal': ['Ring-01'] }
// // // // // // // // // };

// // // // // // // // // const SPAN_COORDS = { 'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } };

// // // // // // // // // const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// // // // // // // // // const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };

// // // // // // // // // const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
// // // // // // // // // const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
// // // // // // // // // const MapUpdater = ({ center }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; };

// // // // // // // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // // // // // // //     // Main Controls
// // // // // // // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // // // // // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // // // // // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // // // // // // //     const [selectedRing, setSelectedRing] = useState('');
    
// // // // // // // // //     // GIS
// // // // // // // // //     const [startPoint, setStartPoint] = useState(null);
// // // // // // // // //     const [endPoint, setEndPoint] = useState(null);
// // // // // // // // //     const [displayPath, setDisplayPath] = useState([]);
// // // // // // // // //     const [isRingView, setIsRingView] = useState(false);
// // // // // // // // //     const [diggingPoints, setDiggingPoints] = useState([]);
    
// // // // // // // // //     // Data
// // // // // // // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // // // // // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // // // // // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // // // // // // //     const [logs, setLogs] = useState([]);
// // // // // // // // //     const [userRoutes, setUserRoutes] = useState([]);
    
// // // // // // // // //     // UI
// // // // // // // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // // // // // // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // // // // // // // //     const [isViewOnly, setIsViewOnly] = useState(false);
// // // // // // // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // // // // // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // // // // // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // // // // // // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // // // // // // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // // // // // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // // // // // // //     // Table Filters
// // // // // // // // //     const [searchDist, setSearchDist] = useState('');
// // // // // // // // //     const [searchBlock, setSearchBlock] = useState('');
// // // // // // // // //     const [searchGeneric, setSearchGeneric] = useState('');
// // // // // // // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // // // // // // //     const [searchDateTo, setSearchDateTo] = useState('');
    
// // // // // // // // //     // Log Filters
// // // // // // // // //     const [filterStart, setFilterStart] = useState('');
// // // // // // // // //     const [filterEnd, setFilterEnd] = useState('');

// // // // // // // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // // // // // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // // // // // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // // // // // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // // // // // // //     const applyFilters = useCallback((data) => {
// // // // // // // // //         let filtered = data;
// // // // // // // // //         // --- NEW FILTERS ---
// // // // // // // // //         if (searchDist && searchDist !== 'All Districts') filtered = filtered.filter(s => s.district === searchDist);
// // // // // // // // //         if (searchBlock && searchBlock !== 'All Blocks') filtered = filtered.filter(s => s.block === searchBlock);
// // // // // // // // //         // -------------------
        
// // // // // // // // //         if (searchGeneric) {
// // // // // // // // //             const term = searchGeneric.toLowerCase();
// // // // // // // // //             filtered = filtered.filter(s => 
// // // // // // // // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// // // // // // // // //                 (s.routeName && s.routeName.toLowerCase().includes(term)) ||
// // // // // // // // //                 (s.locationType && s.locationType.toLowerCase().includes(term))
// // // // // // // // //             );
// // // // // // // // //         }
// // // // // // // // //         if (searchDateFrom && searchDateTo) {
// // // // // // // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // // // // // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // // // // // // //             filtered = filtered.filter(s => {
// // // // // // // // //                 const sDate = new Date(s.id).getTime(); 
// // // // // // // // //                 return sDate >= from && sDate <= to;
// // // // // // // // //             });
// // // // // // // // //         }
// // // // // // // // //         setFilteredSurveys(filtered);
// // // // // // // // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // // // // // // // //     const refreshData = useCallback(async () => {
// // // // // // // // //         try {
// // // // // // // // //             const surveys = await getAllSurveys();
// // // // // // // // //             const allSurveys = surveys || [];
// // // // // // // // //             setSubmittedSurveys(allSurveys);
// // // // // // // // //             applyFilters(allSurveys);
// // // // // // // // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // // // // // // // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);
            
// // // // // // // // //             const routes = {};
// // // // // // // // //             allSurveys.forEach(s => {
// // // // // // // // //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// // // // // // // // //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // // //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // // //                 routes[s.routeName].name = s.routeName;
// // // // // // // // //             });
// // // // // // // // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // // // // // // // //             setUserRoutes(lines);
// // // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // // //     }, [applyFilters]);

// // // // // // // // //     useEffect(() => { refreshData(); const interval = setInterval(refreshData, 5000); return () => clearInterval(interval); }, [refreshData]);
// // // // // // // // //     useEffect(() => { applyFilters(submittedSurveys); }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// // // // // // // // //     useEffect(() => {
// // // // // // // // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // // // // // // // //         const data = SPAN_COORDS[selectedSpan];
// // // // // // // // //         if(data) {
// // // // // // // // //             setStartPoint(data.start); setEndPoint(data.end);
// // // // // // // // //             if (selectedRing) {
// // // // // // // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // // // // // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // // // // // // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // // // // // // // //             } else {
// // // // // // // // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // // // // // // //             }
// // // // // // // // //         }
// // // // // // // // //     }, [selectedSpan, selectedRing]);

// // // // // // // // //     const handleSurveySubmit = async (formData) => {
// // // // // // // // //         try {
// // // // // // // // //             const timestamp = Date.now();
// // // // // // // // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // // // // // // // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // // // // // // // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // // // // // // // //             const enrichedData = {
// // // // // // // // //                 ...formData,
// // // // // // // // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // // // // // // // //                 submittedBy: user,
// // // // // // // // //                 timestamp: new Date().toLocaleString(),
// // // // // // // // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // // // // // // // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // // // // // // // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // // // // // // // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // // // // // // // //             };
// // // // // // // // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // // // // // // // //             if (editingSurvey) {
// // // // // // // // //                 await updateSurveyInDB(enrichedData);
// // // // // // // // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // // //                 alert("Updated!");
// // // // // // // // //             } else {
// // // // // // // // //                 await saveSurveyToDB(enrichedData);
// // // // // // // // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // // //                 alert(`Saved!`);
// // // // // // // // //             }
// // // // // // // // //             setShowSurveyForm(false); setEditingSurvey(null); setIsViewOnly(false); refreshData();
// // // // // // // // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // // // // // // // //     };

// // // // // // // // //     const handleDeleteSurvey = async (id) => {
// // // // // // // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // // // // // // //             await deleteSurveyFromDB(id);
// // // // // // // // //             await deleteMediaFromDisk(`video_${id}`); await deleteMediaFromDisk(`photo_${id}`); await deleteMediaFromDisk(`gopro_${id}`);
// // // // // // // // //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // // // // // // //             refreshData();
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const handleGoProUpload = async (e) => {
// // // // // // // // //         if(e.target.files[0]) {
// // // // // // // // //             const file = e.target.files[0];
// // // // // // // // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // // // // // // // //             if (survey) {
// // // // // // // // //                 const mediaId = `gopro_${survey.id}`;
// // // // // // // // //                 await saveMediaToDisk(mediaId, file);
// // // // // // // // //                 const updatedSurvey = { ...survey, goproId: mediaId };
// // // // // // // // //                 await updateSurveyInDB(updatedSurvey);
// // // // // // // // //                 alert("GoPro Uploaded!"); setUploadModalId(null); refreshData();
// // // // // // // // //             }
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const handleViewMedia = async (type, id) => {
// // // // // // // // //         if (!id) return;
// // // // // // // // //         try {
// // // // // // // // //             const blob = await getMediaFromDisk(id);
// // // // // // // // //             if (blob) {
// // // // // // // // //                 const url = URL.createObjectURL(blob);
// // // // // // // // //                 setCurrentMedia({ type, url, filename: type==='video'?'video.webm':'photo.jpg' });
// // // // // // // // //             } else { alert("Media file not in DB."); }
// // // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // // //     };

// // // // // // // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // // // // // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// // // // // // // // //     const getSessionDuration = (loginTimeStr) => { if (!loginTimeStr) return '-'; const diffMs = new Date() - new Date(loginTimeStr); return `${Math.floor(diffMs / 60000)} mins`; };
    
// // // // // // // // //     const getFilteredLogs = () => {
// // // // // // // // //         if (!filterStart && !filterEnd) return logs;
// // // // // // // // //         const start = new Date(filterStart).getTime();
// // // // // // // // //         const end = new Date(filterEnd).getTime() + 86400000;
// // // // // // // // //         return logs.filter(log => { const t = new Date(log.isoTime).getTime(); return t >= start && t <= end; });
// // // // // // // // //     };

// // // // // // // // //     // Dynamic Options for Database Filter
// // // // // // // // //     const dbDistricts = [...new Set(submittedSurveys.map(s => s.district))];
// // // // // // // // //     // Get blocks based on selected search district (or all if none selected)
// // // // // // // // //     const dbBlocks = [...new Set(submittedSurveys.filter(s => searchDist ? s.district === searchDist : true).map(s => s.block))];

// // // // // // // // //     const styles = {
// // // // // // // // //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0, width:'100%' },
// // // // // // // // //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, overflowX:'auto', whiteSpace:'nowrap', flexShrink:0, gap:'20px' },
// // // // // // // // //         controls: { display:'flex', gap:'8px', alignItems:'center' },
// // // // // // // // //         headerLeft: { display:'flex', gap:'15px', alignItems:'center' },
// // // // // // // // //         select: { padding: '6px', borderRadius: '4px', minWidth: '110px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // // // // // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// // // // // // // // //         btnGreen: { padding: '6px 12px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px' },
// // // // // // // // //         btnWhite: { padding: '6px 12px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px' },
// // // // // // // // //         btnRed: { padding: '6px 12px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px' },
// // // // // // // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // // // // // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // // // // // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // // // // // // //         actionBtn: { padding:'4px 10px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // // // // // // //         downloadBtn: { display:'inline-block', marginTop:'10px', padding:'10px 20px', background:'#2196f3', color:'white', textDecoration:'none', borderRadius:'5px', fontWeight:'bold' },
// // // // // // // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // // // // // // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // // // // // // // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'200px' }
// // // // // // // // //     };

// // // // // // // // //     return (
// // // // // // // // //         <div style={styles.container}>
// // // // // // // // //             <div style={styles.header}>
// // // // // // // // //                 <div style={styles.headerLeft}>
// // // // // // // // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // // // // // // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // // // // // // // //                     <div style={{display:'flex', gap:'8px'}}>
// // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring (Opt)</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // // // // // // //                     </div>
// // // // // // // // //                 </div>
// // // // // // // // //                 <div style={styles.controls}>
// // // // // // // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// // // // // // // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// // // // // // // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // // // // // // // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // // // // // // // //                 </div>
// // // // // // // // //             </div>

// // // // // // // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1, zIndex: 1 }}>
// // // // // // // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // // // // // // //                 <LayersControl position="topright">
// // // // // // // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // // // // // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // // // // // // //                 </LayersControl>
// // // // // // // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // // // // // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // // // // // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // // // // // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // // // // // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // // // // // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
// // // // // // // // //                 {submittedSurveys.map(s => s.latitude && (
// // // // // // // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // // // // // // //                         <Popup minWidth={250}>
// // // // // // // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // // // // // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// // // // // // // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // // // // // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // // // // // // //                                 <div><b>Loc:</b> {s.startLocName} ➝ {s.endLocName}</div>
// // // // // // // // //                                 <div style={{marginTop:'10px'}}>
// // // // // // // // //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s.videoId)}>Video</button>}
// // // // // // // // //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // // // //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button>}
// // // // // // // // //                                 </div>
// // // // // // // // //                             </div>
// // // // // // // // //                         </Popup>
// // // // // // // // //                     </Marker>
// // // // // // // // //                 ))}
// // // // // // // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // // // // // // //             </MapContainer>

// // // // // // // // //             {showSurveyForm && (
// // // // // // // // //                 <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />
// // // // // // // // //             )}

// // // // // // // // //             {showSurveyTable && (
// // // // // // // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // // // // // // //                     {/* --- NEW FILTERS: DISTRICT & BLOCK DROPDOWNS --- */}
// // // // // // // // //                     <div style={styles.filterBox}>
// // // // // // // // //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
                        
// // // // // // // // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}>
// // // // // // // // //                             <option value="">All Districts</option>
// // // // // // // // //                             {dbDistricts.map(d=><option key={d}>{d}</option>)}
// // // // // // // // //                         </select>
                        
// // // // // // // // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}>
// // // // // // // // //                             <option value="">All Blocks</option>
// // // // // // // // //                             {dbBlocks.map(b=><option key={b}>{b}</option>)}
// // // // // // // // //                         </select>

// // // // // // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} />
// // // // // // // // //                         <span>to</span>
// // // // // // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // // // // // // // //                     </div>

// // // // // // // // //                     <table style={styles.table}>
// // // // // // // // //                         <thead>
// // // // // // // // //                             <tr style={{textAlign:'left', background:'#f9f9f9'}}>
// // // // // // // // //                                 <th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th>
// // // // // // // // //                             </tr>
// // // // // // // // //                         </thead>
// // // // // // // // //                         <tbody>
// // // // // // // // //                             {filteredSurveys.map(s => (
// // // // // // // // //                                 <tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}>
// // // // // // // // //                                     <td style={styles.td}><b>{s.generatedFileName}</b> ℹ️</td>
// // // // // // // // //                                     <td style={styles.td}>{s.shotNumber}</td>
// // // // // // // // //                                     <td style={styles.td}>{s.locationType}</td>
// // // // // // // // //                                     <td style={styles.td}>
// // // // // // // // //                                         {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s.videoId)}>Live Vid</button>}
// // // // // // // // //                                         {s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}
// // // // // // // // //                                         {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // // // //                                     </td>
// // // // // // // // //                                     <td style={styles.td}>
// // // // // // // // //                                         <button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>
// // // // // // // // //                                         {(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}
// // // // // // // // //                                         {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}
// // // // // // // // //                                     </td>
// // // // // // // // //                                 </tr>
// // // // // // // // //                             ))}
// // // // // // // // //                         </tbody>
// // // // // // // // //                     </table>
// // // // // // // // //                 </ModalWrapper>
// // // // // // // // //             )}

// // // // // // // // //             {/* ADMIN LOGS... (Same as before) */}
// // // // // // // // //             {showUserStatus && role === 'admin' && (
// // // // // // // // //                 <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
// // // // // // // // //                     <div style={{display:'flex', gap:'20px', height:'100%'}}>
// // // // // // // // //                         <div style={{flex:1, borderRight:'1px solid #eee'}}>
// // // // // // // // //                             <h4 style={{margin:'0 0 10px 0', color:'#2e7d32'}}>Live User Status</h4>
// // // // // // // // //                             <table style={styles.table}><thead><tr><th style={styles.th}>User</th><th style={styles.th}>Status</th><th style={styles.th}>Duration</th></tr></thead><tbody>{userStatuses.map((u, i) => <tr key={i}><td style={styles.td}><b>{u.username}</b></td><td style={styles.td}><span style={{...styles.statusDot, background: u.status==='Online'?'green':'grey'}}></span>{u.status}</td><td style={styles.td}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>)}</tbody></table>
// // // // // // // // //                         </div>
// // // // // // // // //                         <div style={{flex:2}}>
// // // // // // // // //                             <h4 style={{margin:'0 0 10px 0', color:'#1565c0'}}>System Logs</h4>
// // // // // // // // //                             <div style={{marginBottom:'10px', background:'#f5f5f5', padding:'10px', borderRadius:'4px'}}>From <input type="date" onChange={e => setFilterStart(e.target.value)}/> To <input type="date" onChange={e => setFilterEnd(e.target.value)}/></div>
// // // // // // // // //                             <div style={{maxHeight:'300px', overflowY:'auto'}}><table style={styles.table}><thead><tr><th style={styles.th}>Time</th><th style={styles.th}>User</th><th style={styles.th}>Action</th><th style={styles.th}>Details</th></tr></thead><tbody>{getFilteredLogs().map((l,i) => <tr key={i}><td style={{padding:'8px', fontSize:'11px', color:'#666'}}>{l.displayTime}</td><td style={styles.td}><b>{l.username}</b></td><td style={styles.td}>{l.action}</td><td style={styles.td}><small>{l.details}</small></td></tr>)}</tbody></table></div>
// // // // // // // // //                         </div>
// // // // // // // // //                     </div>
// // // // // // // // //                 </ModalWrapper>
// // // // // // // // //             )}

// // // // // // // // //             {uploadModalId && <ModalWrapper title="Upload GoPro Video" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
// // // // // // // // //             {currentMedia && <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}><div style={{textAlign:'center', background:'black', padding:'10px', borderRadius:'4px'}}>{currentMedia.type === 'video' ? <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} /> : <img src={currentMedia.url} alt="Evd" style={{width:'100%', maxHeight:'500px'}} />}<div style={{marginTop:'15px'}}><a href={currentMedia.url} download={currentMedia.filename} style={styles.downloadBtn}>Download Media</a></div></div></ModalWrapper>}
// // // // // // // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map to select location</div>}
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };

// // // // // // // // // export default Dashboard;


// // // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents } from 'react-leaflet';
// // // // // // // // import 'leaflet/dist/leaflet.css';
// // // // // // // // import L from 'leaflet';
// // // // // // // // import SurveyForm from './SurveyForm';
// // // // // // // // import { 
// // // // // // // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // // // // // // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // // // // // // } from './db';

// // // // // // // // const DefaultIcon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
// // // // // // // // L.Marker.prototype.options.icon = DefaultIcon;
// // // // // // // // const SurveyIcon = L.divIcon({ className: 'custom-survey-icon', html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', iconSize: [16, 16] });

// // // // // // // // const DATA_HIERARCHY = { districts: ['VARANASI', 'Hyderabad'], blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] }, spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, rings: { 'Span-Uppal': ['Ring-01'] } };
// // // // // // // // const SPAN_COORDS = { 'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } };

// // // // // // // // const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// // // // // // // // const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };
// // // // // // // // const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
// // // // // // // // const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
// // // // // // // // const MapUpdater = ({ center }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; };

// // // // // // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // // // // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // // // // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // // // // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // // // // // //     const [selectedRing, setSelectedRing] = useState('');
// // // // // // // //     const [startPoint, setStartPoint] = useState(null);
// // // // // // // //     const [endPoint, setEndPoint] = useState(null);
// // // // // // // //     const [displayPath, setDisplayPath] = useState([]);
// // // // // // // //     const [isRingView, setIsRingView] = useState(false);
// // // // // // // //     const [diggingPoints, setDiggingPoints] = useState([]);
// // // // // // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // // // // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // // // // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // // // // // //     const [logs, setLogs] = useState([]);
// // // // // // // //     const [userRoutes, setUserRoutes] = useState([]);
// // // // // // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // // // // // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // // // // // // //     const [isViewOnly, setIsViewOnly] = useState(false);
// // // // // // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // // // // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // // // // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // // // // // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // // // // // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // // // // // //     const [uploadModalId, setUploadModalId] = useState(null);
// // // // // // // //     const [searchDist, setSearchDist] = useState('');
// // // // // // // //     const [searchBlock, setSearchBlock] = useState('');
// // // // // // // //     const [searchGeneric, setSearchGeneric] = useState('');
// // // // // // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // // // // // //     const [searchDateTo, setSearchDateTo] = useState('');
// // // // // // // //     const [filterStart, setFilterStart] = useState('');
// // // // // // // //     const [filterEnd, setFilterEnd] = useState('');

// // // // // // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // // // // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // // // // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // // // // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // // // // // //     const applyFilters = useCallback((data) => {
// // // // // // // //         let filtered = data;
// // // // // // // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // // // // // // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // // // // // // //         if (searchGeneric) {
// // // // // // // //             const term = searchGeneric.toLowerCase();
// // // // // // // //             filtered = filtered.filter(s => 
// // // // // // // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// // // // // // // //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// // // // // // // //             );
// // // // // // // //         }
// // // // // // // //         if (searchDateFrom && searchDateTo) {
// // // // // // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // // // // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // // // // // //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// // // // // // // //         }
// // // // // // // //         setFilteredSurveys(filtered);
// // // // // // // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // // // // // // //     const refreshData = useCallback(async () => {
// // // // // // // //         try {
// // // // // // // //             const surveys = await getAllSurveys();
// // // // // // // //             const allSurveys = surveys || [];
// // // // // // // //             setSubmittedSurveys(allSurveys);
// // // // // // // //             applyFilters(allSurveys);
// // // // // // // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // // // // // // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);
// // // // // // // //             const routes = {};
// // // // // // // //             allSurveys.forEach(s => {
// // // // // // // //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// // // // // // // //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // // //             });
// // // // // // // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // // // // // // //             setUserRoutes(lines);
// // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // //     }, [applyFilters]);

// // // // // // // //     useEffect(() => { refreshData(); const interval = setInterval(refreshData, 5000); return () => clearInterval(interval); }, [refreshData]);
// // // // // // // //     useEffect(() => { applyFilters(submittedSurveys); }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// // // // // // // //     useEffect(() => {
// // // // // // // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // // // // // // //         const data = SPAN_COORDS[selectedSpan];
// // // // // // // //         if(data) {
// // // // // // // //             setStartPoint(data.start); setEndPoint(data.end);
// // // // // // // //             if (selectedRing) {
// // // // // // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // // // // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // // // // // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // // // // // // //             } else {
// // // // // // // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // // // // // //             }
// // // // // // // //         }
// // // // // // // //     }, [selectedSpan, selectedRing]);

// // // // // // // //     const handleSurveySubmit = async (formData) => {
// // // // // // // //         try {
// // // // // // // //             const timestamp = Date.now();
// // // // // // // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // // // // // // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // // // // // // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // // // // // // //             const enrichedData = {
// // // // // // // //                 ...formData,
// // // // // // // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // // // // // // //                 submittedBy: user,
// // // // // // // //                 timestamp: new Date().toLocaleString(),
// // // // // // // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // // // // // // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // // // // // // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // // // // // // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // // // // // // //             };
// // // // // // // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // // // // // // //             if (editingSurvey) {
// // // // // // // //                 await updateSurveyInDB(enrichedData);
// // // // // // // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // //             } else {
// // // // // // // //                 await saveSurveyToDB(enrichedData);
// // // // // // // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // // //             }
// // // // // // // //             setShowSurveyForm(false); setEditingSurvey(null); setIsViewOnly(false); refreshData();
// // // // // // // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // // // // // // //     };

// // // // // // // //     const handleDeleteSurvey = async (id) => {
// // // // // // // //         if(window.confirm("Admin: Delete record?")) {
// // // // // // // //             await deleteSurveyFromDB(id); await deleteMediaFromDisk(`video_${id}`); await deleteMediaFromDisk(`photo_${id}`); await deleteMediaFromDisk(`gopro_${id}`);
// // // // // // // //             logAction(user, 'DELETED_DATA', `ID: ${id}`); refreshData();
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const handleGoProUpload = async (e) => {
// // // // // // // //         if(e.target.files[0]) {
// // // // // // // //             const file = e.target.files[0];
// // // // // // // //             const url = URL.createObjectURL(file); 
// // // // // // // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // // // // // // //             if (survey) {
// // // // // // // //                 const mediaId = `gopro_${survey.id}`;
// // // // // // // //                 await saveMediaToDisk(mediaId, file);
// // // // // // // //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// // // // // // // //                 await updateSurveyInDB(updatedSurvey);
// // // // // // // //                 alert("GoPro Uploaded!"); setUploadModalId(null); refreshData();
// // // // // // // //             }
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const handleViewMedia = async (type, id) => {
// // // // // // // //         if (!id) return;
// // // // // // // //         try {
// // // // // // // //             const blob = await getMediaFromDisk(id);
// // // // // // // //             if (blob) {
// // // // // // // //                 const url = URL.createObjectURL(blob);
// // // // // // // //                 setCurrentMedia({ type, url, filename: type==='video'?'video.webm':'photo.jpg' });
// // // // // // // //             } else { alert("Media file not in DB."); }
// // // // // // // //         } catch(e) { console.error(e); }
// // // // // // // //     };

// // // // // // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // // // // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// // // // // // // //     const getSessionDuration = (loginTimeStr) => { if (!loginTimeStr) return '-'; const diffMs = new Date() - new Date(loginTimeStr); return `${Math.floor(diffMs / 60000)} mins`; };
// // // // // // // //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const start = new Date(filterStart).getTime(); const end = new Date(filterEnd).getTime() + 86400000; return logs.filter(log => { const t = new Date(log.isoTime).getTime(); return t >= start && t <= end; }); };

// // // // // // // //     const styles = {
// // // // // // // //         container: { display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif' },
// // // // // // // //         header: { padding: '10px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:20 },
// // // // // // // //         controls: { display:'flex', gap:'12px', alignItems:'center' },
// // // // // // // //         select: { padding: '8px 12px', borderRadius: '4px', minWidth: '140px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // // // // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '10px', border:'1px solid rgba(255,255,255,0.3)' },
// // // // // // // //         btnGreen: { padding: '8px 16px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'13px', boxShadow:'0 2px 4px rgba(0,0,0,0.2)' },
// // // // // // // //         btnWhite: { padding: '8px 16px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'13px', boxShadow:'0 2px 4px rgba(0,0,0,0.2)' },
// // // // // // // //         btnRed: { padding: '8px 16px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'13px' },
// // // // // // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // // // // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // // // // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // // // // // //         actionBtn: { padding:'4px 10px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // // // // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // // // // // //         downloadBtn: { display:'inline-block', marginTop:'10px', padding:'10px 20px', background:'#2196f3', color:'white', textDecoration:'none', borderRadius:'5px', fontWeight:'bold' },
// // // // // // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // // // // // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // // // // // // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'200px' }
// // // // // // // //     };

// // // // // // // //     return (
// // // // // // // //         <div style={styles.container}>
// // // // // // // //             <div style={styles.header}>
// // // // // // // //                 <div style={{display:'flex', alignItems:'center'}}>
// // // // // // // //                     <strong style={{fontSize:'22px'}}>GIS</strong>
// // // // // // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // // // // // // //                     <div style={{marginLeft:'30px', display:'flex', gap:'10px'}}>
// // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // // // // // //                         <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring (Opt)</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // // // // // //                     </div>
// // // // // // // //                 </div>
// // // // // // // //                 <div style={styles.controls}>
// // // // // // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New Survey</button>
// // // // // // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>View Data ({filteredSurveys.length})</button>
// // // // // // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs & Status</button>}
// // // // // // // //                     <button onClick={onLogout} style={styles.btnRed}>LOGOUT</button>
// // // // // // // //                 </div>
// // // // // // // //             </div>
// // // // // // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // // // // // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // // // // // //                 <LayersControl position="topright"><LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer><LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer></LayersControl>
// // // // // // // //                 {startPoint && <MapUpdater center={startPoint} />} {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>} {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // // // // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // // // // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // // // // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
// // // // // // // //                 {submittedSurveys.map(s => s.latitude && (<Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}><Popup minWidth={250}><div style={{fontSize:'13px', lineHeight:'1.6'}}><div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div><div><b>File:</b> {s.generatedFileName}</div><div><b>Route:</b> {s.routeName}</div><div><b>Loc:</b> {s.startLocName} ➝ {s.endLocName}</div><div style={{marginTop:'10px'}}>{s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s.videoId)}>Video</button>}{s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}</div></div></Popup></Marker>))}
// // // // // // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // // // // // //             </MapContainer>
// // // // // // // //             {showSurveyForm && <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />}
// // // // // // // //             {showSurveyTable && <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}><div style={styles.filterBox}><input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} /><select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select><select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select><input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} /></div><table style={styles.table}><thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead><tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0', background: s.id % 2 === 0 ? '#fff' : '#fafafa'}}><td style={styles.td}><b>{s.generatedFileName}</b> ℹ️</td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>{s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s.videoId)}>Live Vid</button>}{s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}{s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}</td><td style={styles.td}><button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>{(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}{role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}</td></tr>))}</tbody></table></ModalWrapper>}
// // // // // // // //             {showUserStatus && role === 'admin' && <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}><div style={{display:'flex', gap:'20px'}}><div style={{flex:1}}><h4>User Status</h4><table style={styles.table}><thead><tr><th>User</th><th>Status</th><th>Duration</th></tr></thead><tbody>{userStatuses.map((u, i) => <tr key={i}><td style={styles.td}><b>{u.username}</b></td><td style={styles.td}><span style={{...styles.statusDot, background: u.status==='Online'?'green':'grey'}}></span>{u.status}</td><td style={styles.td}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>)}</tbody></table></div><div style={{flex:2}}><h4>Logs</h4><div style={{marginBottom:'10px'}}>From <input type="date" onChange={e => setFilterStart(e.target.value)}/> To <input type="date" onChange={e => setFilterEnd(e.target.value)}/></div><div style={{maxHeight:'300px', overflowY:'auto'}}><table style={styles.table}><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>{getFilteredLogs().map((l,i) => <tr key={i}><td style={{padding:'8px', fontSize:'11px', color:'#666'}}>{l.displayTime}</td><td style={styles.td}><b>{l.username}</b></td><td style={styles.td}>{l.action}</td><td style={styles.td}><small>{l.details}</small></td></tr>)}</tbody></table></div></div></div></ModalWrapper>}
// // // // // // // //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'40px', textAlign:'center', border:'2px dashed #ccc', borderRadius:'8px', margin:'20px'}}><p>Select GoPro Video</p><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
// // // // // // // //             {currentMedia && <ModalWrapper title="Media Viewer" onClose={() => setCurrentMedia(null)}><div style={{textAlign:'center', background:'black', padding:'10px', borderRadius:'4px'}}>{currentMedia.type === 'video' ? <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} /> : <img src={currentMedia.url} alt="Evd" style={{width:'100%', maxHeight:'500px'}} />}<div style={{marginTop:'15px'}}><a href={currentMedia.url} download={currentMedia.filename} style={styles.downloadBtn}>Download Media</a></div></div></ModalWrapper>}
// // // // // // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map to select location</div>}
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };

// // // // // // // // export default Dashboard;





// // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // // // // // // import 'leaflet/dist/leaflet.css';
// // // // // // // import L from 'leaflet';
// // // // // // // import SurveyForm from './SurveyForm';
// // // // // // // import { 
// // // // // // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // // // // // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // // // // // } from './db';

// // // // // // // // Icons
// // // // // // // const DefaultIcon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
// // // // // // // L.Marker.prototype.options.icon = DefaultIcon;
// // // // // // // const SurveyIcon = L.divIcon({ className: 'custom-survey-icon', html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', iconSize: [16, 16] });

// // // // // // // const DATA_HIERARCHY = { districts: ['VARANASI', 'Hyderabad'], blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] }, spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, rings: { 'Span-Uppal': ['Ring-01'] } };
// // // // // // // const SPAN_COORDS = { 'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } };

// // // // // // // const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// // // // // // // const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };
// // // // // // // const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
// // // // // // // const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
// // // // // // // const MapUpdater = ({ center }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; };

// // // // // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // // // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // // // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // // // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // // // // //     const [selectedRing, setSelectedRing] = useState('');
    
// // // // // // //     const [startPoint, setStartPoint] = useState(null);
// // // // // // //     const [endPoint, setEndPoint] = useState(null);
// // // // // // //     const [displayPath, setDisplayPath] = useState([]);
// // // // // // //     const [isRingView, setIsRingView] = useState(false);
// // // // // // //     const [diggingPoints, setDiggingPoints] = useState([]);
    
// // // // // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // // // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // // // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // // // // //     const [logs, setLogs] = useState([]);
// // // // // // //     const [userRoutes, setUserRoutes] = useState([]);
    
// // // // // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // // // // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // // // // // //     const [isViewOnly, setIsViewOnly] = useState(false);
// // // // // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // // // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // // // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // // // // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // // // // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // // // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // // // // //     const [searchDist, setSearchDist] = useState('');
// // // // // // //     const [searchBlock, setSearchBlock] = useState('');
// // // // // // //     const [searchGeneric, setSearchGeneric] = useState('');
// // // // // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // // // // //     const [searchDateTo, setSearchDateTo] = useState('');
// // // // // // //     const [filterStart, setFilterStart] = useState('');
// // // // // // //     const [filterEnd, setFilterEnd] = useState('');

// // // // // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // // // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // // // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // // // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // // // // //     const applyFilters = useCallback((data) => {
// // // // // // //         let filtered = data;
// // // // // // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // // // // // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // // // // // //         if (searchGeneric) {
// // // // // // //             const term = searchGeneric.toLowerCase();
// // // // // // //             filtered = filtered.filter(s => 
// // // // // // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// // // // // // //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// // // // // // //             );
// // // // // // //         }
// // // // // // //         if (searchDateFrom && searchDateTo) {
// // // // // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // // // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // // // // //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// // // // // // //         }
// // // // // // //         setFilteredSurveys(filtered);
// // // // // // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // // // // // //     const refreshData = useCallback(async () => {
// // // // // // //         try {
// // // // // // //             const surveys = await getAllSurveys();
// // // // // // //             const allSurveys = surveys || [];
// // // // // // //             setSubmittedSurveys(allSurveys);
// // // // // // //             applyFilters(allSurveys);
// // // // // // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // // // // // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);
            
// // // // // // //             const routes = {};
// // // // // // //             allSurveys.forEach(s => {
// // // // // // //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// // // // // // //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // // //                 routes[s.routeName].name = s.routeName;
// // // // // // //             });
// // // // // // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // // // // // //             setUserRoutes(lines);
// // // // // // //         } catch(e) { console.error(e); }
// // // // // // //     }, [applyFilters]);

// // // // // // //     useEffect(() => { refreshData(); const interval = setInterval(refreshData, 5000); return () => clearInterval(interval); }, [refreshData]);
// // // // // // //     useEffect(() => { applyFilters(submittedSurveys); }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// // // // // // //     useEffect(() => {
// // // // // // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // // // // // //         const data = SPAN_COORDS[selectedSpan];
// // // // // // //         if(data) {
// // // // // // //             setStartPoint(data.start); setEndPoint(data.end);
// // // // // // //             if (selectedRing) {
// // // // // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // // // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // // // // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // // // // // //             } else {
// // // // // // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // // // // //             }
// // // // // // //         }
// // // // // // //     }, [selectedSpan, selectedRing]);

// // // // // // //     const handleSurveySubmit = async (formData) => {
// // // // // // //         try {
// // // // // // //             const timestamp = Date.now();
// // // // // // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // // // // // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // // // // // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // // // // // //             const enrichedData = {
// // // // // // //                 ...formData,
// // // // // // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // // // // // //                 submittedBy: user,
// // // // // // //                 timestamp: new Date().toLocaleString(),
// // // // // // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // // // // // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // // // // // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // // // // // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // // // // // //             };
// // // // // // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // // // // // //             if (editingSurvey) {
// // // // // // //                 await updateSurveyInDB(enrichedData);
// // // // // // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // //                 alert("Updated!");
// // // // // // //             } else {
// // // // // // //                 await saveSurveyToDB(enrichedData);
// // // // // // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // // //                 alert(`Saved!`);
// // // // // // //             }
// // // // // // //             setShowSurveyForm(false); setEditingSurvey(null); setIsViewOnly(false); refreshData();
// // // // // // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // // // // // //     };

// // // // // // //     const handleDeleteSurvey = async (id) => {
// // // // // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // // // // //             await deleteSurveyFromDB(id);
// // // // // // //             await deleteMediaFromDisk(`video_${id}`); await deleteMediaFromDisk(`photo_${id}`); await deleteMediaFromDisk(`gopro_${id}`);
// // // // // // //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // // // // //             refreshData();
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const handleGoProUpload = async (e) => {
// // // // // // //         if(e.target.files[0]) {
// // // // // // //             const file = e.target.files[0];
// // // // // // //             const url = URL.createObjectURL(file); 
// // // // // // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // // // // // //             if (survey) {
// // // // // // //                 const mediaId = `gopro_${survey.id}`;
// // // // // // //                 await saveMediaToDisk(mediaId, file);
// // // // // // //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// // // // // // //                 await updateSurveyInDB(updatedSurvey);
// // // // // // //                 alert("GoPro Uploaded!"); setUploadModalId(null); refreshData();
// // // // // // //             }
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const handleViewMedia = async (type, id) => {
// // // // // // //         if (!id) return;
// // // // // // //         try {
// // // // // // //             const blob = await getMediaFromDisk(id);
// // // // // // //             if (blob) {
// // // // // // //                 const url = URL.createObjectURL(blob);
// // // // // // //                 setCurrentMedia({ type, url, filename: type==='video'?'video.webm':'photo.jpg' });
// // // // // // //             } else { alert("Media file not in DB."); }
// // // // // // //         } catch(e) { console.error(e); }
// // // // // // //     };

// // // // // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // // // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// // // // // // //     const getSessionDuration = (loginTimeStr) => { if (!loginTimeStr) return '-'; const diffMs = new Date() - new Date(loginTimeStr); return `${Math.floor(diffMs / 60000)} mins`; };
// // // // // // //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const start = new Date(filterStart).getTime(); const end = new Date(filterEnd).getTime() + 86400000; return logs.filter(log => { const t = new Date(log.isoTime).getTime(); return t >= start && t <= end; }); };

// // // // // // //     // --- FIXED MOBILE LAYOUT STYLES ---
// // // // // // //     const styles = {
// // // // // // //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
        
// // // // // // //         // Header: Always Row, Scrollable if narrow
// // // // // // //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
        
// // // // // // //         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // // // // //         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
        
// // // // // // //         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // // // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// // // // // // //         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // // // //         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // // // //         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
        
// // // // // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // // // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // // // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // // // // //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // // // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // // // // //         downloadBtn: { display:'inline-block', marginTop:'10px', padding:'10px 20px', background:'#2196f3', color:'white', textDecoration:'none', borderRadius:'5px', fontWeight:'bold' },
// // // // // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // // // // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // // // // // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' }
// // // // // // //     };

// // // // // // //     return (
// // // // // // //         <div style={styles.container}>
// // // // // // //             <div style={styles.header}>
// // // // // // //                 <div style={styles.headerLeft}>
// // // // // // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // // // // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // // // // // //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // // //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // // //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // // // // //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // // // // //                 </div>
// // // // // // //                 <div style={styles.controls}>
// // // // // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// // // // // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// // // // // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // // // // // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // // // // // //                 </div>
// // // // // // //             </div>

// // // // // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // // // // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // // // // //                 <LayersControl position="topright">
// // // // // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // // // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // // // // //                 </LayersControl>
// // // // // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // // // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // // // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // // // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // // // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // // // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
                
// // // // // // //                 {submittedSurveys.map(s => s.latitude && (
// // // // // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // // // // //                         <Popup minWidth={250}>
// // // // // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // // // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// // // // // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // // // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // // // // //                                 <div><b>Loc:</b> {s.startLocName} ➝ {s.endLocName}</div>
// // // // // // //                                 <div style={{marginTop:'10px'}}>
// // // // // // //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s.videoId)}>Video</button>}
// // // // // // //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}
// // // // // // //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button>}
// // // // // // //                                 </div>
// // // // // // //                             </div>
// // // // // // //                         </Popup>
// // // // // // //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}><span style={{fontWeight:'bold'}}>{s.locationType}</span><br/>{s.routeName}</Tooltip>
// // // // // // //                     </Marker>
// // // // // // //                 ))}
// // // // // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // // // // //             </MapContainer>

// // // // // // //             {showSurveyForm && <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />}
            
// // // // // // //             {showSurveyTable && (
// // // // // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // // // // //                     <div style={styles.filterBox}>
// // // // // // //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
// // // // // // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // // // // // //                     </div>
// // // // // // //                     <table style={styles.table}>
// // // // // // //                         <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
// // // // // // //                         <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b> ℹ️</td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>{s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s.videoId)}>Live Vid</button>}{s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('video', s.goproId)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}{s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('img', s.photoId)}>Photo</button>}</td><td style={styles.td}><button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>{(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}{role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}</td></tr>))}</tbody>
// // // // // // //                     </table>
// // // // // // //                 </ModalWrapper>
// // // // // // //             )}
            
// // // // // // //             {showUserStatus && role === 'admin' && (
// // // // // // //                 <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}>
// // // // // // //                     <div style={{display:'flex', gap:'20px', flexDirection:'column'}}>
// // // // // // //                         <div style={{flex:1}}><h4>User Status</h4><table style={styles.table}><thead><tr><th>User</th><th>Status</th><th>Duration</th></tr></thead><tbody>{userStatuses.map((u, i) => <tr key={i}><td style={styles.td}><b>{u.username}</b></td><td style={styles.td}><span style={{...styles.statusDot, background: u.status==='Online'?'green':'grey'}}></span>{u.status}</td><td style={styles.td}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>)}</tbody></table></div>
// // // // // // //                         <div style={{flex:2}}><h4>Logs</h4><div style={{marginBottom:'10px'}}>From <input type="date" onChange={e => setFilterStart(e.target.value)}/> To <input type="date" onChange={e => setFilterEnd(e.target.value)}/></div><div style={{maxHeight:'300px', overflowY:'auto'}}><table style={styles.table}><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>{getFilteredLogs().map((l,i) => <tr key={i}><td style={{padding:'5px', fontSize:'11px'}}>{l.displayTime}</td><td>{l.username}</td><td>{l.action}</td><td style={{fontSize:'11px'}}>{l.details}</td></tr>)}</tbody></table></div></div>
// // // // // // //                     </div>
// // // // // // //                 </ModalWrapper>
// // // // // // //             )}
            
// // // // // // //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
// // // // // // //             {currentMedia && <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}><div style={{textAlign:'center', background:'black', padding:'10px', borderRadius:'4px'}}>{currentMedia.type === 'video' ? <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} /> : <img src={currentMedia.url} alt="Evd" style={{width:'100%', maxHeight:'500px'}} />}<div style={{marginTop:'15px'}}><a href={currentMedia.url} download={currentMedia.filename} style={styles.downloadBtn}>Download</a></div></div></ModalWrapper>}
// // // // // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map</div>}
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // };

// // // // // // // export default Dashboard;




// // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // // // // // import 'leaflet/dist/leaflet.css';
// // // // // // import L from 'leaflet';
// // // // // // import SurveyForm from './SurveyForm';
// // // // // // // IMPORT ZIP LIBRARIES
// // // // // // import JSZip from 'jszip';
// // // // // // import { saveAs } from 'file-saver';
// // // // // // import { 
// // // // // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // // // // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // // // // } from './db';

// // // // // // // Icons
// // // // // // const DefaultIcon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
// // // // // // L.Marker.prototype.options.icon = DefaultIcon;
// // // // // // const SurveyIcon = L.divIcon({ className: 'custom-survey-icon', html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', iconSize: [16, 16] });

// // // // // // const DATA_HIERARCHY = { districts: ['VARANASI', 'Hyderabad'], blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] }, spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, rings: { 'Span-Uppal': ['Ring-01'] } };
// // // // // // const SPAN_COORDS = { 'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } };

// // // // // // const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// // // // // // const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };

// // // // // // const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
// // // // // // const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
// // // // // // const MapUpdater = ({ center }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; };

// // // // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // // // //     const [selectedRing, setSelectedRing] = useState('');
    
// // // // // //     const [startPoint, setStartPoint] = useState(null);
// // // // // //     const [endPoint, setEndPoint] = useState(null);
// // // // // //     const [displayPath, setDisplayPath] = useState([]);
// // // // // //     const [isRingView, setIsRingView] = useState(false);
// // // // // //     const [diggingPoints, setDiggingPoints] = useState([]);
    
// // // // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // // // //     const [logs, setLogs] = useState([]);
// // // // // //     const [userRoutes, setUserRoutes] = useState([]);
    
// // // // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // // // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // // // // //     const [isViewOnly, setIsViewOnly] = useState(false);
// // // // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // // // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // // // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // // // //     const [searchDist, setSearchDist] = useState('');
// // // // // //     const [searchBlock, setSearchBlock] = useState('');
// // // // // //     const [searchGeneric, setSearchGeneric] = useState('');
// // // // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // // // //     const [searchDateTo, setSearchDateTo] = useState('');
// // // // // //     const [filterStart, setFilterStart] = useState('');
// // // // // //     const [filterEnd, setFilterEnd] = useState('');

// // // // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // // // //     const applyFilters = useCallback((data) => {
// // // // // //         let filtered = data;
// // // // // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // // // // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // // // // //         if (searchGeneric) {
// // // // // //             const term = searchGeneric.toLowerCase();
// // // // // //             filtered = filtered.filter(s => 
// // // // // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// // // // // //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// // // // // //             );
// // // // // //         }
// // // // // //         if (searchDateFrom && searchDateTo) {
// // // // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // // // //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// // // // // //         }
// // // // // //         setFilteredSurveys(filtered);
// // // // // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // // // // //     const refreshData = useCallback(async () => {
// // // // // //         try {
// // // // // //             const surveys = await getAllSurveys();
// // // // // //             const allSurveys = surveys || [];
// // // // // //             setSubmittedSurveys(allSurveys);
// // // // // //             applyFilters(allSurveys);
// // // // // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // // // // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);
            
// // // // // //             const routes = {};
// // // // // //             allSurveys.forEach(s => {
// // // // // //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// // // // // //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // // //                 routes[s.routeName].name = s.routeName;
// // // // // //             });
// // // // // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // // // // //             setUserRoutes(lines);
// // // // // //         } catch(e) { console.error(e); }
// // // // // //     }, [applyFilters]);

// // // // // //     useEffect(() => { refreshData(); const interval = setInterval(refreshData, 5000); return () => clearInterval(interval); }, [refreshData]);
// // // // // //     useEffect(() => { applyFilters(submittedSurveys); }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// // // // // //     useEffect(() => {
// // // // // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // // // // //         const data = SPAN_COORDS[selectedSpan];
// // // // // //         if(data) {
// // // // // //             setStartPoint(data.start); setEndPoint(data.end);
// // // // // //             if (selectedRing) {
// // // // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // // // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // // // // //             } else {
// // // // // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // // // //             }
// // // // // //         }
// // // // // //     }, [selectedSpan, selectedRing]);

// // // // // //     const handleSurveySubmit = async (formData) => {
// // // // // //         try {
// // // // // //             const timestamp = Date.now();
// // // // // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // // // // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // // // // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // // // // //             const enrichedData = {
// // // // // //                 ...formData,
// // // // // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // // // // //                 submittedBy: user,
// // // // // //                 timestamp: new Date().toLocaleString(),
// // // // // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // // // // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // // // // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // // // // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // // // // //             };
// // // // // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // // // // //             if (editingSurvey) {
// // // // // //                 await updateSurveyInDB(enrichedData);
// // // // // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // //                 alert("Updated!");
// // // // // //             } else {
// // // // // //                 await saveSurveyToDB(enrichedData);
// // // // // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // // //                 alert(`Saved!`);
// // // // // //             }
// // // // // //             setShowSurveyForm(false); setEditingSurvey(null); setIsViewOnly(false); refreshData();
// // // // // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // // // // //     };

// // // // // //     const handleDeleteSurvey = async (id) => {
// // // // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // // // //             await deleteSurveyFromDB(id);
// // // // // //             await deleteMediaFromDisk(`video_${id}`); await deleteMediaFromDisk(`photo_${id}`); await deleteMediaFromDisk(`gopro_${id}`);
// // // // // //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // // // //             refreshData();
// // // // // //         }
// // // // // //     };

// // // // // //     const handleGoProUpload = async (e) => {
// // // // // //         if(e.target.files[0]) {
// // // // // //             const file = e.target.files[0];
// // // // // //             const url = URL.createObjectURL(file); 
// // // // // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // // // // //             if (survey) {
// // // // // //                 const mediaId = `gopro_${survey.id}`;
// // // // // //                 await saveMediaToDisk(mediaId, file);
// // // // // //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// // // // // //                 await updateSurveyInDB(updatedSurvey);
// // // // // //                 alert("GoPro Uploaded!"); setUploadModalId(null); refreshData();
// // // // // //             }
// // // // // //         }
// // // // // //     };

// // // // // //     // --- ENHANCED VIEWER HANDLER ---
// // // // // //     const handleViewMedia = async (type, survey) => {
// // // // // //         const id = type === 'video' ? survey.videoId : (type === 'gopro' ? survey.goproId : survey.photoId);
// // // // // //         if (!id) return;
// // // // // //         try {
// // // // // //             const blob = await getMediaFromDisk(id);
// // // // // //             if (blob) {
// // // // // //                 const url = URL.createObjectURL(blob);
// // // // // //                 setCurrentMedia({ 
// // // // // //                     type, 
// // // // // //                     url, 
// // // // // //                     blob, 
// // // // // //                     filename: `${survey.generatedFileName}_${type}`,
// // // // // //                     meta: survey 
// // // // // //                 });
// // // // // //             } else { alert("Media file not in DB."); }
// // // // // //         } catch(e) { console.error(e); }
// // // // // //     };

// // // // // //     // --- 1. DIRECT FILE DOWNLOAD (Forces .mp4 / .jpg) ---
// // // // // //     const handleDirectDownload = () => {
// // // // // //         if (!currentMedia || !currentMedia.blob) return;
// // // // // //         const ext = currentMedia.type === 'photo' ? 'jpg' : 'mp4';
        
// // // // // //         // This forces the file to save as "Filename.mp4", even if the blob is webm
// // // // // //         saveAs(currentMedia.blob, `${currentMedia.filename}.${ext}`);
// // // // // //     };

// // // // // //     // --- 2. ZIP DOWNLOAD LOGIC ---
// // // // // //     const handleDownloadZip = async () => {
// // // // // //         if (!currentMedia || !currentMedia.blob) return;

// // // // // //         const zip = new JSZip();
// // // // // //         // Force extension inside ZIP as well
// // // // // //         const ext = currentMedia.type === 'photo' ? 'jpg' : 'mp4';
        
// // // // // //         // Add Media File
// // // // // //         zip.file(`${currentMedia.filename}.${ext}`, currentMedia.blob);
        
// // // // // //         // Add Metadata Text File
// // // // // //         const metaInfo = `
// // // // // // SURVEY METADATA
// // // // // // ----------------
// // // // // // Filename: ${currentMedia.filename}
// // // // // // Date: ${currentMedia.meta.timestamp}
// // // // // // Route: ${currentMedia.meta.routeName}
// // // // // // Latitude: ${currentMedia.meta.latitude}
// // // // // // Longitude: ${currentMedia.meta.longitude}
// // // // // // Surveyor: ${currentMedia.meta.surveyorName}
// // // // // // Location Type: ${currentMedia.meta.locationType}
// // // // // //         `;
// // // // // //         zip.file("details.txt", metaInfo);

// // // // // //         // Generate and Save
// // // // // //         const content = await zip.generateAsync({type:"blob"});
// // // // // //         saveAs(content, `${currentMedia.filename}.zip`);
// // // // // //     };

// // // // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// // // // // //     const getSessionDuration = (loginTimeStr) => { if (!loginTimeStr) return '-'; const diffMs = new Date() - new Date(loginTimeStr); return `${Math.floor(diffMs / 60000)} mins`; };
// // // // // //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const start = new Date(filterStart).getTime(); const end = new Date(filterEnd).getTime() + 86400000; return logs.filter(log => { const t = new Date(log.isoTime).getTime(); return t >= start && t <= end; }); };

// // // // // //     // --- STYLES ---
// // // // // //     const styles = {
// // // // // //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
// // // // // //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
// // // // // //         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // // // //         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // // // //         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// // // // // //         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // // //         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // // //         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // // // //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // // // //         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
// // // // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // // // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // // // // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' }
// // // // // //     };

// // // // // //     return (
// // // // // //         <div style={styles.container}>
// // // // // //             <div style={styles.header}>
// // // // // //                 <div style={styles.headerLeft}>
// // // // // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // // // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // // // // //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // // // //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // // // //                 </div>
// // // // // //                 <div style={styles.controls}>
// // // // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// // // // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// // // // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // // // // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // // // // //                 </div>
// // // // // //             </div>

// // // // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // // // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // // // //                 <LayersControl position="topright">
// // // // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // // // //                 </LayersControl>
// // // // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
                
// // // // // //                 {submittedSurveys.map(s => s.latitude && (
// // // // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // // // //                         <Popup minWidth={250}>
// // // // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// // // // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // // // //                                 <div><b>Loc:</b> {s.startLocName} ➝ {s.endLocName}</div>
// // // // // //                                 <div style={{marginTop:'10px'}}>
// // // // // //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
// // // // // //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // // // // //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
// // // // // //                                 </div>
// // // // // //                             </div>
// // // // // //                         </Popup>
                        
// // // // // //                         {/* --- UPDATED TOOLTIP WITH DETAILS --- */}
// // // // // //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// // // // // //                             <div style={{textAlign:'left'}}>
// // // // // //                                 <span style={{fontWeight:'bold', fontSize:'13px'}}>{s.locationType}</span><br/>
// // // // // //                                 Route: {s.routeName}<br/>
// // // // // //                                 Lat: {parseFloat(s.latitude).toFixed(5)}<br/>
// // // // // //                                 Lng: {parseFloat(s.longitude).toFixed(5)}<br/>
// // // // // //                                 Date: {s.timestamp ? s.timestamp.split(',')[0] : '-'}
// // // // // //                             </div>
// // // // // //                         </Tooltip>
// // // // // //                     </Marker>
// // // // // //                 ))}
// // // // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // // // //             </MapContainer>

// // // // // //             {showSurveyForm && <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />}
            
// // // // // //             {showSurveyTable && (
// // // // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // // // //                     <div style={styles.filterBox}>
// // // // // //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
// // // // // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // // // // //                     </div>
// // // // // //                     <table style={styles.table}>
// // // // // //                         <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
// // // // // //                         <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b> ℹ️</td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
// // // // // //                             {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
// // // // // //                             {s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}
// // // // // //                             {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // // // // //                         </td><td style={styles.td}><button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>{(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}{role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}</td></tr>))}</tbody>
// // // // // //                     </table>
// // // // // //                 </ModalWrapper>
// // // // // //             )}
            
// // // // // //             {showUserStatus && role === 'admin' && (
// // // // // //                 <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}>
// // // // // //                     <div style={{display:'flex', gap:'20px', flexDirection:'column'}}>
// // // // // //                         <div style={{flex:1}}><h4>User Status</h4><table style={styles.table}><thead><tr><th>User</th><th>Status</th><th>Duration</th></tr></thead><tbody>{userStatuses.map((u, i) => <tr key={i}><td style={styles.td}><b>{u.username}</b></td><td style={styles.td}><span style={{...styles.statusDot, background: u.status==='Online'?'green':'grey'}}></span>{u.status}</td><td style={styles.td}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>)}</tbody></table></div>
// // // // // //                         <div style={{flex:2}}><h4>Logs</h4><div style={{marginBottom:'10px'}}>From <input type="date" onChange={e => setFilterStart(e.target.value)}/> To <input type="date" onChange={e => setFilterEnd(e.target.value)}/></div><div style={{maxHeight:'300px', overflowY:'auto'}}><table style={styles.table}><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>{getFilteredLogs().map((l,i) => <tr key={i}><td style={{padding:'5px', fontSize:'11px'}}>{l.displayTime}</td><td>{l.username}</td><td>{l.action}</td><td style={{fontSize:'11px'}}>{l.details}</td></tr>)}</tbody></table></div></div>
// // // // // //                     </div>
// // // // // //                 </ModalWrapper>
// // // // // //             )}
            
// // // // // //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
            
// // // // // //             {/* --- UPDATED VIEWER MODAL WITH DUAL DOWNLOAD BUTTONS --- */}
// // // // // //             {currentMedia && (
// // // // // //                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
// // // // // //                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
                        
// // // // // //                         {/* Display Content */}
// // // // // //                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (
// // // // // //                             <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />
// // // // // //                         ) : (
// // // // // //                             <img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />
// // // // // //                         )}

// // // // // //                         {/* Download Buttons Row */}
// // // // // //                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
// // // // // //                             {/* Button 1: Direct File Download (Forces MP4/JPG) */}
// // // // // //                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>
// // // // // //                                 ⬇ Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}
// // // // // //                             </button>

// // // // // //                             {/* Button 2: ZIP Download */}
// // // // // //                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>
// // // // // //                                 📦 Download ZIP (with Data)
// // // // // //                             </button>
// // // // // //                         </div>
// // // // // //                     </div>
// // // // // //                 </ModalWrapper>
// // // // // //             )}

// // // // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map</div>}
// // // // // //         </div>
// // // // // //     );
// // // // // // };

// // // // // // export default Dashboard;


// // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // // // // import 'leaflet/dist/leaflet.css';
// // // // // import L from 'leaflet';
// // // // // import SurveyForm from './SurveyForm';
// // // // // import JSZip from 'jszip';
// // // // // import { saveAs } from 'file-saver';
// // // // // import { 
// // // // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // // // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // // // } from './db';

// // // // // // Icons
// // // // // const DefaultIcon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
// // // // // L.Marker.prototype.options.icon = DefaultIcon;
// // // // // const SurveyIcon = L.divIcon({ className: 'custom-survey-icon', html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', iconSize: [16, 16] });

// // // // // const DATA_HIERARCHY = { districts: ['VARANASI', 'Hyderabad'], blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] }, spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, rings: { 'Span-Uppal': ['Ring-01'] } };
// // // // // const SPAN_COORDS = { 'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } };

// // // // // const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// // // // // const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };

// // // // // // Helper to identify new data (within last 24 hours)
// // // // // const isRecent = (timestamp) => {
// // // // //     if (!timestamp) return false;
// // // // //     const now = new Date();
// // // // //     const surveyDate = new Date(timestamp);
// // // // //     const diffHours = Math.abs(now - surveyDate) / 36e5;
// // // // //     return diffHours < 24;
// // // // // };

// // // // // const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
// // // // // const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
// // // // // const MapUpdater = ({ center }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; };

// // // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // // //     const [selectedRing, setSelectedRing] = useState('');
    
// // // // //     const [startPoint, setStartPoint] = useState(null);
// // // // //     const [endPoint, setEndPoint] = useState(null);
// // // // //     const [displayPath, setDisplayPath] = useState([]);
// // // // //     const [isRingView, setIsRingView] = useState(false);
// // // // //     const [diggingPoints, setDiggingPoints] = useState([]);
    
// // // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // // //     const [logs, setLogs] = useState([]);
// // // // //     const [userRoutes, setUserRoutes] = useState([]);
    
// // // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // // // //     const [isViewOnly, setIsViewOnly] = useState(false);
// // // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // // //     const [searchDist, setSearchDist] = useState('');
// // // // //     const [searchBlock, setSearchBlock] = useState('');
// // // // //     const [searchGeneric, setSearchGeneric] = useState('');
// // // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // // //     const [searchDateTo, setSearchDateTo] = useState('');
// // // // //     const [filterStart, setFilterStart] = useState('');
// // // // //     const [filterEnd, setFilterEnd] = useState('');

// // // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // // //     const applyFilters = useCallback((data) => {
// // // // //         let filtered = data;
// // // // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // // // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // // // //         if (searchGeneric) {
// // // // //             const term = searchGeneric.toLowerCase();
// // // // //             filtered = filtered.filter(s => 
// // // // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// // // // //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// // // // //             );
// // // // //         }
// // // // //         if (searchDateFrom && searchDateTo) {
// // // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // // //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// // // // //         }
// // // // //         setFilteredSurveys(filtered);
// // // // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // // // //     const refreshData = useCallback(async () => {
// // // // //         try {
// // // // //             const surveys = await getAllSurveys();
// // // // //             const allSurveys = surveys || [];
            
// // // // //             // --- FIX: SORT BY ID DESC (NEWEST FIRST) ---
// // // // //             const sortedSurveys = allSurveys.sort((a, b) => b.id - a.id);
// // // // //             setSubmittedSurveys(sortedSurveys);
// // // // //             applyFilters(sortedSurveys);

// // // // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // // // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);
            
// // // // //             const routes = {};
// // // // //             sortedSurveys.forEach(s => {
// // // // //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// // // // //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // // //                 routes[s.routeName].name = s.routeName;
// // // // //             });
// // // // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // // // //             setUserRoutes(lines);
// // // // //         } catch(e) { console.error(e); }
// // // // //     }, [applyFilters]);

// // // // //     useEffect(() => { refreshData(); const interval = setInterval(refreshData, 5000); return () => clearInterval(interval); }, [refreshData]);
// // // // //     useEffect(() => { applyFilters(submittedSurveys); }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// // // // //     useEffect(() => {
// // // // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // // // //         const data = SPAN_COORDS[selectedSpan];
// // // // //         if(data) {
// // // // //             setStartPoint(data.start); setEndPoint(data.end);
// // // // //             if (selectedRing) {
// // // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // // // //             } else {
// // // // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // // //             }
// // // // //         }
// // // // //     }, [selectedSpan, selectedRing]);

// // // // //     const handleSurveySubmit = async (formData) => {
// // // // //         try {
// // // // //             const timestamp = Date.now();
// // // // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // // // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // // // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // // // //             const enrichedData = {
// // // // //                 ...formData,
// // // // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // // // //                 submittedBy: user,
// // // // //                 timestamp: new Date().toLocaleString(),
// // // // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // // // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // // // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // // // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // // // //             };
// // // // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // // // //             if (editingSurvey) {
// // // // //                 await updateSurveyInDB(enrichedData);
// // // // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // //                 alert("Updated!");
// // // // //             } else {
// // // // //                 await saveSurveyToDB(enrichedData);
// // // // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // // //                 alert(`Saved!`);
// // // // //             }
// // // // //             setShowSurveyForm(false); setEditingSurvey(null); setIsViewOnly(false); refreshData();
// // // // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // // // //     };

// // // // //     const handleDeleteSurvey = async (id) => {
// // // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // // //             await deleteSurveyFromDB(id);
// // // // //             await deleteMediaFromDisk(`video_${id}`); await deleteMediaFromDisk(`photo_${id}`); await deleteMediaFromDisk(`gopro_${id}`);
// // // // //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // // //             refreshData();
// // // // //         }
// // // // //     };

// // // // //     const handleGoProUpload = async (e) => {
// // // // //         if(e.target.files[0]) {
// // // // //             const file = e.target.files[0];
// // // // //             const url = URL.createObjectURL(file); 
// // // // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // // // //             if (survey) {
// // // // //                 const mediaId = `gopro_${survey.id}`;
// // // // //                 await saveMediaToDisk(mediaId, file);
// // // // //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// // // // //                 await updateSurveyInDB(updatedSurvey);
// // // // //                 alert("GoPro Uploaded!"); setUploadModalId(null); refreshData();
// // // // //             }
// // // // //         }
// // // // //     };

// // // // //     const handleViewMedia = async (type, survey) => {
// // // // //         const id = type === 'video' ? survey.videoId : (type === 'gopro' ? survey.goproId : survey.photoId);
// // // // //         if (!id) return;
// // // // //         try {
// // // // //             const blob = await getMediaFromDisk(id);
// // // // //             if (blob) {
// // // // //                 const url = URL.createObjectURL(blob);
// // // // //                 setCurrentMedia({ 
// // // // //                     type, 
// // // // //                     url, 
// // // // //                     blob, 
// // // // //                     filename: `${survey.generatedFileName}_${type}`,
// // // // //                     meta: survey 
// // // // //                 });
// // // // //             } else { alert("Media file not in DB."); }
// // // // //         } catch(e) { console.error(e); }
// // // // //     };

// // // // //     const handleDirectDownload = () => {
// // // // //         if (!currentMedia || !currentMedia.blob) return;
// // // // //         const ext = currentMedia.type === 'photo' ? 'jpg' : 'mp4';
// // // // //         saveAs(currentMedia.blob, `${currentMedia.filename}.${ext}`);
// // // // //     };

// // // // //     const handleDownloadZip = async () => {
// // // // //         if (!currentMedia || !currentMedia.blob) return;
// // // // //         const zip = new JSZip();
// // // // //         const ext = currentMedia.type === 'photo' ? 'jpg' : 'mp4';
// // // // //         zip.file(`${currentMedia.filename}.${ext}`, currentMedia.blob);
// // // // //         const metaInfo = `SURVEY METADATA\n----------------\nFilename: ${currentMedia.filename}\nDate: ${currentMedia.meta.timestamp}\nRoute: ${currentMedia.meta.routeName}\nLatitude: ${currentMedia.meta.latitude}\nLongitude: ${currentMedia.meta.longitude}\nSurveyor: ${currentMedia.meta.surveyorName}\nLocation Type: ${currentMedia.meta.locationType}`;
// // // // //         zip.file("details.txt", metaInfo);
// // // // //         const content = await zip.generateAsync({type:"blob"});
// // // // //         saveAs(content, `${currentMedia.filename}.zip`);
// // // // //     };

// // // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// // // // //     const getSessionDuration = (loginTimeStr) => { if (!loginTimeStr) return '-'; const diffMs = new Date() - new Date(loginTimeStr); return `${Math.floor(diffMs / 60000)} mins`; };
// // // // //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const start = new Date(filterStart).getTime(); const end = new Date(filterEnd).getTime() + 86400000; return logs.filter(log => { const t = new Date(log.isoTime).getTime(); return t >= start && t <= end; }); };

// // // // //     const styles = {
// // // // //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
// // // // //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
// // // // //         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // // //         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // // //         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// // // // //         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // //         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // //         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // // //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // // //         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
// // // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // // // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
// // // // //         // ADMIN LOGS STYLES
// // // // //         adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
// // // // //         adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
// // // // //     };

// // // // //     return (
// // // // //         <div style={styles.container}>
// // // // //             <div style={styles.header}>
// // // // //                 <div style={styles.headerLeft}>
// // // // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // // // //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // // //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // // //                 </div>
// // // // //                 <div style={styles.controls}>
// // // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// // // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// // // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // // // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // // // //                 </div>
// // // // //             </div>

// // // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // // //                 <LayersControl position="topright">
// // // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // // //                 </LayersControl>
// // // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
                
// // // // //                 {submittedSurveys.map(s => s.latitude && (
// // // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // // //                         <Popup minWidth={250}>
// // // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// // // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // // //                                 <div><b>Loc:</b> {s.startLocName} ➝ {s.endLocName}</div>
// // // // //                                 <div style={{marginTop:'10px'}}>
// // // // //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
// // // // //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // // // //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         </Popup>
                        
// // // // //                         {/* --- FIX: TOOLTIP SHOWS 'NEW' & DETAILS --- */}
// // // // //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// // // // //                             <div style={{textAlign:'left'}}>
// // // // //                                 {isRecent(s.timestamp) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>🆕 RECENT</div>}
// // // // //                                 <div style={{fontWeight:'bold', fontSize:'13px', marginBottom:'2px'}}>{s.locationType}</div>
// // // // //                                 <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
// // // // //                                 <div style={{fontSize:'11px', color:'#555'}}>{s.timestamp}</div>
// // // // //                             </div>
// // // // //                         </Tooltip>
// // // // //                     </Marker>
// // // // //                 ))}
// // // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // // //             </MapContainer>

// // // // //             {showSurveyForm && <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />}
            
// // // // //             {showSurveyTable && (
// // // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // // //                     <div style={styles.filterBox}>
// // // // //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
// // // // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // // // //                     </div>
// // // // //                     <table style={styles.table}>
// // // // //                         <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
// // // // //                         <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b> ℹ️</td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
// // // // //                             {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
// // // // //                             {s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}
// // // // //                             {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // // // //                         </td><td style={styles.td}><button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>{(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}{role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}</td></tr>))}</tbody>
// // // // //                     </table>
// // // // //                 </ModalWrapper>
// // // // //             )}
            
// // // // //             {/* --- FIX: REDESIGNED ADMIN LOGS --- */}
// // // // //             {showUserStatus && role === 'admin' && (
// // // // //                 <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
// // // // //                     <div style={{display:'flex', gap:'20px', height:'100%', flexDirection:'row'}}>
// // // // //                         {/* LEFT: USER STATUS */}
// // // // //                         <div style={{flex:1, minWidth:'300px'}}>
// // // // //                             <div style={styles.adminCard}>
// // // // //                                 <div style={styles.adminHeader}>Live User Status</div>
// // // // //                                 <table style={styles.table}>
// // // // //                                     <thead><tr style={{background:'#f9f9f9'}}><th style={{padding:'10px'}}>User</th><th>Status</th><th>Time</th></tr></thead>
// // // // //                                     <tbody>
// // // // //                                         {userStatuses.map((u, i) => (
// // // // //                                             <tr key={i} style={{borderBottom:'1px solid #eee'}}>
// // // // //                                                 <td style={{padding:'10px', fontWeight:'bold'}}>{u.username}</td>
// // // // //                                                 <td><span style={{...styles.statusDot, background: u.status==='Online'?'#4caf50':'#9e9e9e'}}></span>{u.status}</td>
// // // // //                                                 <td style={{fontSize:'12px', color:'#666'}}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td>
// // // // //                                             </tr>
// // // // //                                         ))}
// // // // //                                     </tbody>
// // // // //                                 </table>
// // // // //                             </div>
// // // // //                         </div>

// // // // //                         {/* RIGHT: SYSTEM LOGS */}
// // // // //                         <div style={{flex:2}}>
// // // // //                             <div style={styles.adminCard}>
// // // // //                                 <div style={{...styles.adminHeader, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
// // // // //                                     <span>System Logs</span>
// // // // //                                     <div style={{fontSize:'12px', fontWeight:'normal'}}>
// // // // //                                         Filter: <input type="date" onChange={e => setFilterStart(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/> to <input type="date" onChange={e => setFilterEnd(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/>
// // // // //                                     </div>
// // // // //                                 </div>
// // // // //                                 <div style={{maxHeight:'400px', overflowY:'auto'}}>
// // // // //                                     <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
// // // // //                                         <thead style={{position:'sticky', top:0, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}}>
// // // // //                                             <tr><th style={{padding:'10px', textAlign:'left'}}>Time</th><th style={{textAlign:'left'}}>User</th><th style={{textAlign:'left'}}>Action</th><th style={{textAlign:'left'}}>Details</th></tr>
// // // // //                                         </thead>
// // // // //                                         <tbody>
// // // // //                                             {getFilteredLogs().map((l,i) => (
// // // // //                                                 <tr key={i} style={{borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa'}}>
// // // // //                                                     <td style={{padding:'8px', color:'#666', whiteSpace:'nowrap'}}>{l.displayTime}</td>
// // // // //                                                     <td style={{fontWeight:'bold', color:'#333'}}>{l.username}</td>
// // // // //                                                     <td style={{color: l.action.includes('DELETED')?'red':'#1565c0'}}>{l.action}</td>
// // // // //                                                     <td style={{color:'#555'}}>{l.details}</td>
// // // // //                                                 </tr>
// // // // //                                             ))}
// // // // //                                         </tbody>
// // // // //                                     </table>
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </ModalWrapper>
// // // // //             )}
            
// // // // //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
            
// // // // //             {currentMedia && (
// // // // //                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
// // // // //                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
// // // // //                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (
// // // // //                             <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />
// // // // //                         ) : (
// // // // //                             <img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />
// // // // //                         )}
// // // // //                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
// // // // //                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>⬇ Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
// // // // //                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>📦 Download ZIP (with Data)</button>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </ModalWrapper>
// // // // //             )}

// // // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map</div>}
// // // // //         </div>
// // // // //     );
// // // // // };

// // // // // export default Dashboard;


// // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // // // import 'leaflet/dist/leaflet.css';
// // // // import L from 'leaflet';
// // // // import SurveyForm from './SurveyForm';
// // // // import JSZip from 'jszip';
// // // // import { saveAs } from 'file-saver';
// // // // import { 
// // // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // // } from './db';

// // // // // Icons
// // // // const DefaultIcon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
// // // // L.Marker.prototype.options.icon = DefaultIcon;
// // // // const SurveyIcon = L.divIcon({ className: 'custom-survey-icon', html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', iconSize: [16, 16] });

// // // // const DATA_HIERARCHY = { districts: ['VARANASI', 'Hyderabad'], blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] }, spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, rings: { 'Span-Uppal': ['Ring-01'] } };
// // // // const SPAN_COORDS = { 'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } };

// // // // const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// // // // const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };

// // // // const isRecent = (timestamp) => {
// // // //     if (!timestamp) return false;
// // // //     const now = new Date();
// // // //     const surveyDate = new Date(timestamp);
// // // //     const diffHours = Math.abs(now - surveyDate) / 36e5;
// // // //     return diffHours < 24;
// // // // };

// // // // const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
// // // // const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
// // // // const MapUpdater = ({ center }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; };

// // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // //     const [selectedRing, setSelectedRing] = useState('');
    
// // // //     const [startPoint, setStartPoint] = useState(null);
// // // //     const [endPoint, setEndPoint] = useState(null);
// // // //     const [displayPath, setDisplayPath] = useState([]);
// // // //     const [isRingView, setIsRingView] = useState(false);
// // // //     const [diggingPoints, setDiggingPoints] = useState([]);
    
// // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // //     const [logs, setLogs] = useState([]);
// // // //     const [userRoutes, setUserRoutes] = useState([]);
    
// // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // // //     const [isViewOnly, setIsViewOnly] = useState(false);
// // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // //     const [searchDist, setSearchDist] = useState('');
// // // //     const [searchBlock, setSearchBlock] = useState('');
// // // //     const [searchGeneric, setSearchGeneric] = useState('');
// // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // //     const [searchDateTo, setSearchDateTo] = useState('');
// // // //     const [filterStart, setFilterStart] = useState('');
// // // //     const [filterEnd, setFilterEnd] = useState('');

// // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // //     const applyFilters = useCallback((data) => {
// // // //         let filtered = data;
// // // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // // //         if (searchGeneric) {
// // // //             const term = searchGeneric.toLowerCase();
// // // //             filtered = filtered.filter(s => 
// // // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// // // //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// // // //             );
// // // //         }
// // // //         if (searchDateFrom && searchDateTo) {
// // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// // // //         }
// // // //         setFilteredSurveys(filtered);
// // // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // // //     const refreshData = useCallback(async () => {
// // // //         try {
// // // //             const surveys = await getAllSurveys();
// // // //             const allSurveys = surveys || [];
// // // //             const sortedSurveys = allSurveys.sort((a, b) => b.id - a.id);
// // // //             setSubmittedSurveys(sortedSurveys);
// // // //             applyFilters(sortedSurveys);
// // // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);
// // // //             const routes = {};
// // // //             sortedSurveys.forEach(s => {
// // // //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// // // //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // // //                 routes[s.routeName].name = s.routeName;
// // // //             });
// // // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // // //             setUserRoutes(lines);
// // // //         } catch(e) { console.error(e); }
// // // //     }, [applyFilters]);

// // // //     useEffect(() => { refreshData(); const interval = setInterval(refreshData, 5000); return () => clearInterval(interval); }, [refreshData]);
// // // //     useEffect(() => { applyFilters(submittedSurveys); }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// // // //     useEffect(() => {
// // // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // // //         const data = SPAN_COORDS[selectedSpan];
// // // //         if(data) {
// // // //             setStartPoint(data.start); setEndPoint(data.end);
// // // //             if (selectedRing) {
// // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // // //             } else {
// // // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // //             }
// // // //         }
// // // //     }, [selectedSpan, selectedRing]);

// // // //     const handleSurveySubmit = async (formData) => {
// // // //         try {
// // // //             const timestamp = Date.now();
// // // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // // //             const enrichedData = {
// // // //                 ...formData,
// // // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // // //                 submittedBy: user,
// // // //                 timestamp: new Date().toLocaleString(),
// // // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // // //             };
// // // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // // //             if (editingSurvey) {
// // // //                 await updateSurveyInDB(enrichedData);
// // // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // //                 alert("Updated!");
// // // //             } else {
// // // //                 await saveSurveyToDB(enrichedData);
// // // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // // //                 alert(`Saved!`);
// // // //             }
// // // //             setShowSurveyForm(false); setEditingSurvey(null); setIsViewOnly(false); refreshData();
// // // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // // //     };

// // // //     const handleDeleteSurvey = async (id) => {
// // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // //             await deleteSurveyFromDB(id);
// // // //             await deleteMediaFromDisk(`video_${id}`); 
// // // //             await deleteMediaFromDisk(`photo_${id}`); 
// // // //             await deleteMediaFromDisk(`gopro_${id}`);
// // // //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // //             refreshData();
// // // //         }
// // // //     };

// // // //     const handleGoProUpload = async (e) => {
// // // //         if(e.target.files[0]) {
// // // //             const file = e.target.files[0];
// // // //             const url = URL.createObjectURL(file); 
// // // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // // //             if (survey) {
// // // //                 const mediaId = `gopro_${survey.id}`;
// // // //                 await saveMediaToDisk(mediaId, file);
// // // //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// // // //                 await updateSurveyInDB(updatedSurvey);
// // // //                 alert("GoPro Uploaded!"); setUploadModalId(null); refreshData();
// // // //             }
// // // //         }
// // // //     };

// // // //     const handleViewMedia = async (type, survey) => {
// // // //         const id = type === 'video' ? survey.videoId : (type === 'gopro' ? survey.goproId : survey.photoId);
// // // //         if (!id) return;
// // // //         try {
// // // //             const blob = await getMediaFromDisk(id);
// // // //             if (blob) {
// // // //                 const url = URL.createObjectURL(blob);
// // // //                 setCurrentMedia({ type, url, blob, filename: `${survey.generatedFileName}_${type}`, meta: survey });
// // // //             } else { alert("Media file not in DB."); }
// // // //         } catch(e) { console.error(e); }
// // // //     };

// // // //     const handleDirectDownload = () => {
// // // //         if (!currentMedia || !currentMedia.blob) return;
// // // //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// // // //         const safeFilename = currentMedia.filename.replace(/\.(webm|mp4|jpg|png)$/i, '');
// // // //         saveAs(currentMedia.blob, `${safeFilename}.${ext}`);
// // // //     };

// // // //     const handleDownloadZip = async () => {
// // // //         if (!currentMedia || !currentMedia.blob) return;
// // // //         const zip = new JSZip();
// // // //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// // // //         const safeFilename = currentMedia.filename.replace(/\.(webm|mp4|jpg|png)$/i, '');

// // // //         zip.file(`${safeFilename}.${ext}`, currentMedia.blob);
// // // //         const metaInfo = `SURVEY METADATA\n----------------\nFilename: ${safeFilename}.${ext}\nDate: ${currentMedia.meta.timestamp}\nRoute: ${currentMedia.meta.routeName}\nLatitude: ${currentMedia.meta.latitude}\nLongitude: ${currentMedia.meta.longitude}\nSurveyor: ${currentMedia.meta.surveyorName}`;
// // // //         zip.file("details.txt", metaInfo);

// // // //         const content = await zip.generateAsync({type:"blob"});
// // // //         saveAs(content, `${safeFilename}.zip`);
// // // //     };

// // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// // // //     const getSessionDuration = (str) => { if (!str) return '-'; const diff = new Date() - new Date(str); return `${Math.floor(diff/60000)} mins`; };
// // // //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

// // // //     const styles = {
// // // //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
// // // //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
// // // //         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // //         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // //         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// // // //         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // //         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // //         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // //         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
// // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
// // // //         adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
// // // //         adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
// // // //     };

// // // //     return (
// // // //         <div style={styles.container}>
// // // //             <div style={styles.header}>
// // // //                 <div style={styles.headerLeft}>
// // // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // // //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // //                 </div>
// // // //                 <div style={styles.controls}>
// // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // // //                 </div>
// // // //             </div>

// // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // //                 <LayersControl position="topright">
// // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // //                 </LayersControl>
// // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
                
// // // //                 {submittedSurveys.map(s => s.latitude && (
// // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // //                         <Popup minWidth={250}>
// // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // //                                 <div style={{marginTop:'10px'}}>
// // // //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
// // // //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // // //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
// // // //                                 </div>
// // // //                             </div>
// // // //                         </Popup>
// // // //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// // // //                             <div style={{textAlign:'left'}}>
// // // //                                 {isRecent(s.timestamp) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>🆕 RECENT</div>}
// // // //                                 <div style={{fontWeight:'bold', fontSize:'13px'}}>{s.locationType}</div>
// // // //                                 <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
// // // //                                 <div style={{fontSize:'11px', color:'#555'}}>{s.timestamp}</div>
// // // //                             </div>
// // // //                         </Tooltip>
// // // //                     </Marker>
// // // //                 ))}
// // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // //             </MapContainer>

// // // //             {showSurveyForm && <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />}
            
// // // //             {showSurveyTable && (
// // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // //                     <div style={styles.filterBox}>
// // // //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
// // // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // // //                     </div>
// // // //                     <table style={styles.table}>
// // // //                         <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
// // // //                         <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b> ℹ️</td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
// // // //                             {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
// // // //                             {s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}
// // // //                             {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // // //                         </td><td style={styles.td}><button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>{(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}{role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}</td></tr>))}</tbody>
// // // //                     </table>
// // // //                 </ModalWrapper>
// // // //             )}
            
// // // //             {showUserStatus && role === 'admin' && (
// // // //                 <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
// // // //                     <div style={{display:'flex', gap:'20px', height:'100%', flexDirection:'row'}}>
// // // //                         <div style={{flex:1, minWidth:'300px'}}>
// // // //                             <div style={styles.adminCard}>
// // // //                                 <div style={styles.adminHeader}>Live User Status</div>
// // // //                                 <table style={styles.table}>
// // // //                                     <thead><tr style={{background:'#f9f9f9'}}><th style={{padding:'10px'}}>User</th><th>Status</th><th>Time</th></tr></thead>
// // // //                                     <tbody>
// // // //                                         {userStatuses.map((u, i) => (
// // // //                                             <tr key={i} style={{borderBottom:'1px solid #eee'}}>
// // // //                                                 <td style={{padding:'10px', fontWeight:'bold'}}>{u.username}</td>
// // // //                                                 <td><span style={{...styles.statusDot, background: u.status==='Online'?'#4caf50':'#9e9e9e'}}></span>{u.status}</td>
// // // //                                                 <td style={{fontSize:'12px', color:'#666'}}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td>
// // // //                                             </tr>
// // // //                                         ))}
// // // //                                     </tbody>
// // // //                                 </table>
// // // //                             </div>
// // // //                         </div>
// // // //                         <div style={{flex:2}}>
// // // //                             <div style={styles.adminCard}>
// // // //                                 <div style={{...styles.adminHeader, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
// // // //                                     <span>System Logs</span>
// // // //                                     <div style={{fontSize:'12px', fontWeight:'normal'}}>
// // // //                                         Filter: <input type="date" onChange={e => setFilterStart(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/> to <input type="date" onChange={e => setFilterEnd(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/>
// // // //                                     </div>
// // // //                                 </div>
// // // //                                 <div style={{maxHeight:'400px', overflowY:'auto'}}>
// // // //                                     <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
// // // //                                         <thead style={{position:'sticky', top:0, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}}>
// // // //                                             <tr><th style={{padding:'10px', textAlign:'left'}}>Time</th><th style={{textAlign:'left'}}>User</th><th style={{textAlign:'left'}}>Action</th><th style={{textAlign:'left'}}>Details</th></tr>
// // // //                                         </thead>
// // // //                                         <tbody>
// // // //                                             {getFilteredLogs().map((l,i) => (
// // // //                                                 <tr key={i} style={{borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa'}}>
// // // //                                                     <td style={{padding:'8px', color:'#666', whiteSpace:'nowrap'}}>{l.displayTime}</td>
// // // //                                                     <td style={{fontWeight:'bold', color:'#333'}}>{l.username}</td>
// // // //                                                     <td style={{color: l.action.includes('DELETED')?'red':'#1565c0'}}>{l.action}</td>
// // // //                                                     <td style={{color:'#555'}}>{l.details}</td>
// // // //                                                 </tr>
// // // //                                             ))}
// // // //                                         </tbody>
// // // //                                     </table>
// // // //                                 </div>
// // // //                             </div>
// // // //                         </div>
// // // //                     </div>
// // // //                 </ModalWrapper>
// // // //             )}
            
// // // //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
            
// // // //             {currentMedia && (
// // // //                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
// // // //                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
// // // //                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (
// // // //                             <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />
// // // //                         ) : (
// // // //                             <img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />
// // // //                         )}
// // // //                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
// // // //                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>⬇ Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
// // // //                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>📦 Download ZIP (with Data)</button>
// // // //                         </div>
// // // //                     </div>
// // // //                 </ModalWrapper>
// // // //             )}

// // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map</div>}
// // // //         </div>
// // // //     );
// // // // };

// // // // export default Dashboard;



// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // // import 'leaflet/dist/leaflet.css';
// // // import L from 'leaflet';
// // // import SurveyForm from './SurveyForm';
// // // import JSZip from 'jszip';
// // // import { saveAs } from 'file-saver';
// // // import { 
// // //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// // //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // // } from './db';

// // // // Icons
// // // const DefaultIcon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
// // // L.Marker.prototype.options.icon = DefaultIcon;
// // // const SurveyIcon = L.divIcon({ className: 'custom-survey-icon', html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', iconSize: [16, 16] });

// // // const DATA_HIERARCHY = { districts: ['VARANASI', 'Hyderabad'], blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] }, spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, rings: { 'Span-Uppal': ['Ring-01'] } };
// // // const SPAN_COORDS = { 'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } };

// // // const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// // // const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };

// // // const isRecent = (timestamp) => {
// // //     if (!timestamp) return false;
// // //     const now = new Date();
// // //     const surveyDate = new Date(timestamp);
// // //     const diffHours = Math.abs(now - surveyDate) / 36e5;
// // //     return diffHours < 24;
// // // };

// // // const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
// // // const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
// // // const MapUpdater = ({ center }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; };

// // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // //     const [selectedBlock, setSelectedBlock] = useState('');
// // //     const [selectedSpan, setSelectedSpan] = useState('');
// // //     const [selectedRing, setSelectedRing] = useState('');
    
// // //     const [startPoint, setStartPoint] = useState(null);
// // //     const [endPoint, setEndPoint] = useState(null);
// // //     const [displayPath, setDisplayPath] = useState([]);
// // //     const [isRingView, setIsRingView] = useState(false);
// // //     const [diggingPoints, setDiggingPoints] = useState([]);
    
// // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // //     const [userStatuses, setUserStatuses] = useState([]);
// // //     const [logs, setLogs] = useState([]);
// // //     const [userRoutes, setUserRoutes] = useState([]);
    
// // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // //     const [isViewOnly, setIsViewOnly] = useState(false);
// // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // //     const [pickedCoords, setPickedCoords] = useState(null);
// // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // //     const [currentMedia, setCurrentMedia] = useState(null);
// // //     const [uploadModalId, setUploadModalId] = useState(null);

// // //     const [searchDist, setSearchDist] = useState('');
// // //     const [searchBlock, setSearchBlock] = useState('');
// // //     const [searchGeneric, setSearchGeneric] = useState('');
// // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // //     const [searchDateTo, setSearchDateTo] = useState('');
// // //     const [filterStart, setFilterStart] = useState('');
// // //     const [filterEnd, setFilterEnd] = useState('');

// // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // //     const applyFilters = useCallback((data) => {
// // //         let filtered = data;
// // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // //         if (searchGeneric) {
// // //             const term = searchGeneric.toLowerCase();
// // //             filtered = filtered.filter(s => 
// // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// // //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// // //             );
// // //         }
// // //         if (searchDateFrom && searchDateTo) {
// // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// // //         }
// // //         setFilteredSurveys(filtered);
// // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // //     const refreshData = useCallback(async () => {
// // //         try {
// // //             const surveys = await getAllSurveys();
// // //             const allSurveys = surveys || [];
// // //             const sortedSurveys = allSurveys.sort((a, b) => b.id - a.id);
// // //             setSubmittedSurveys(sortedSurveys);
// // //             applyFilters(sortedSurveys);
// // //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// // //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);
// // //             const routes = {};
// // //             sortedSurveys.forEach(s => {
// // //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// // //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// // //                 routes[s.routeName].name = s.routeName;
// // //             });
// // //             const lines = Object.values(routes).filter(r => r.start && r.end);
// // //             setUserRoutes(lines);
// // //         } catch(e) { console.error(e); }
// // //     }, [applyFilters]);

// // //     useEffect(() => { refreshData(); const interval = setInterval(refreshData, 5000); return () => clearInterval(interval); }, [refreshData]);
// // //     useEffect(() => { applyFilters(submittedSurveys); }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// // //     useEffect(() => {
// // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // //         const data = SPAN_COORDS[selectedSpan];
// // //         if(data) {
// // //             setStartPoint(data.start); setEndPoint(data.end);
// // //             if (selectedRing) {
// // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // //             } else {
// // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // //             }
// // //         }
// // //     }, [selectedSpan, selectedRing]);

// // //     const handleSurveySubmit = async (formData) => {
// // //         try {
// // //             const timestamp = Date.now();
// // //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// // //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// // //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// // //             const enrichedData = {
// // //                 ...formData,
// // //                 id: editingSurvey ? editingSurvey.id : timestamp,
// // //                 submittedBy: user,
// // //                 timestamp: new Date().toLocaleString(),
// // //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// // //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// // //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// // //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// // //             };
// // //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// // //             if (editingSurvey) {
// // //                 await updateSurveyInDB(enrichedData);
// // //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // //                 alert("Updated!");
// // //             } else {
// // //                 await saveSurveyToDB(enrichedData);
// // //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// // //                 alert(`Saved!`);
// // //             }
// // //             setShowSurveyForm(false); setEditingSurvey(null); setIsViewOnly(false); refreshData();
// // //         } catch (e) { console.error(e); alert("Error saving data."); }
// // //     };

// // //     const handleDeleteSurvey = async (id) => {
// // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // //             await deleteSurveyFromDB(id);
// // //             await deleteMediaFromDisk(`video_${id}`); 
// // //             await deleteMediaFromDisk(`photo_${id}`); 
// // //             await deleteMediaFromDisk(`gopro_${id}`);
// // //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // //             refreshData();
// // //         }
// // //     };

// // //     const handleGoProUpload = async (e) => {
// // //         if(e.target.files[0]) {
// // //             const file = e.target.files[0];
// // //             const url = URL.createObjectURL(file); 
// // //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// // //             if (survey) {
// // //                 const mediaId = `gopro_${survey.id}`;
// // //                 await saveMediaToDisk(mediaId, file);
// // //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// // //                 await updateSurveyInDB(updatedSurvey);
// // //                 alert("GoPro Uploaded!"); setUploadModalId(null); refreshData();
// // //             }
// // //         }
// // //     };

// // //     const handleViewMedia = async (type, survey) => {
// // //         const id = type === 'video' ? survey.videoId : (type === 'gopro' ? survey.goproId : survey.photoId);
// // //         if (!id) return;
// // //         try {
// // //             const blob = await getMediaFromDisk(id);
// // //             if (blob) {
// // //                 const url = URL.createObjectURL(blob);
// // //                 setCurrentMedia({ type, url, blob, filename: `${survey.generatedFileName}_${type}`, meta: survey });
// // //             } else { alert("Media file not in DB."); }
// // //         } catch(e) { console.error(e); }
// // //     };

// // //     // --- FIX: FORCE .MP4 EXTENSION ---
// // //     const handleDirectDownload = () => {
// // //         if (!currentMedia || !currentMedia.blob) return;
        
// // //         // Force proper extension
// // //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
        
// // //         // Remove existing extension (like .webm) and append new one
// // //         const safeFilename = currentMedia.filename.replace(/\.(webm|mp4|jpg|png|jpeg)$/i, '');
        
// // //         saveAs(currentMedia.blob, `${safeFilename}.${ext}`);
// // //     };

// // //     const handleDownloadZip = async () => {
// // //         if (!currentMedia || !currentMedia.blob) return;
// // //         const zip = new JSZip();
// // //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// // //         const safeFilename = currentMedia.filename.replace(/\.(webm|mp4|jpg|png|jpeg)$/i, '');

// // //         zip.file(`${safeFilename}.${ext}`, currentMedia.blob);
// // //         const metaInfo = `SURVEY METADATA\n----------------\nFilename: ${safeFilename}.${ext}\nDate: ${currentMedia.meta.timestamp}\nRoute: ${currentMedia.meta.routeName}\nLatitude: ${currentMedia.meta.latitude}\nLongitude: ${currentMedia.meta.longitude}\nSurveyor: ${currentMedia.meta.surveyorName}`;
// // //         zip.file("details.txt", metaInfo);

// // //         const content = await zip.generateAsync({type:"blob"});
// // //         saveAs(content, `${safeFilename}.zip`);
// // //     };

// // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// // //     const getSessionDuration = (str) => { if (!str) return '-'; const diff = new Date() - new Date(str); return `${Math.floor(diff/60000)} mins`; };
// // //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

// // //     const styles = {
// // //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
// // //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
// // //         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // //         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // //         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// // //         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // //         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // //         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // //         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
// // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
// // //         adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
// // //         adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
// // //     };

// // //     return (
// // //         <div style={styles.container}>
// // //             <div style={styles.header}>
// // //                 <div style={styles.headerLeft}>
// // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // //                 </div>
// // //                 <div style={styles.controls}>
// // //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // //                 </div>
// // //             </div>

// // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // //                 <LayersControl position="topright">
// // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // //                 </LayersControl>
// // //                 {startPoint && <MapUpdater center={startPoint} />}
// // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
                
// // //                 {submittedSurveys.map(s => s.latitude && (
// // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // //                         <Popup minWidth={250}>
// // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // //                                 <div><b>Route:</b> {s.routeName}</div>
// // //                                 <div style={{marginTop:'10px'}}>
// // //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
// // //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
// // //                                 </div>
// // //                             </div>
// // //                         </Popup>
// // //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// // //                             <div style={{textAlign:'left'}}>
// // //                                 {isRecent(s.timestamp) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>🆕 RECENT</div>}
// // //                                 <div style={{fontWeight:'bold', fontSize:'13px'}}>{s.locationType}</div>
// // //                                 <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
// // //                                 <div style={{fontSize:'11px', color:'#555'}}>{s.timestamp}</div>
// // //                             </div>
// // //                         </Tooltip>
// // //                     </Marker>
// // //                 ))}
// // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // //             </MapContainer>

// // //             {showSurveyForm && <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />}
            
// // //             {showSurveyTable && (
// // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // //                     <div style={styles.filterBox}>
// // //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
// // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // //                     </div>
// // //                     <table style={styles.table}>
// // //                         <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
// // //                         <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b> ℹ️</td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
// // //                             {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
// // //                             {s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}
// // //                             {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // //                         </td><td style={styles.td}><button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>{(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}{role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}</td></tr>))}</tbody>
// // //                     </table>
// // //                 </ModalWrapper>
// // //             )}
            
// // //             {showUserStatus && role === 'admin' && (
// // //                 <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
// // //                     <div style={{display:'flex', gap:'20px', height:'100%', flexDirection:'row'}}>
// // //                         <div style={{flex:1, minWidth:'300px'}}>
// // //                             <div style={styles.adminCard}>
// // //                                 <div style={styles.adminHeader}>Live User Status</div>
// // //                                 <table style={styles.table}>
// // //                                     <thead><tr style={{background:'#f9f9f9'}}><th style={{padding:'10px'}}>User</th><th>Status</th><th>Time</th></tr></thead>
// // //                                     <tbody>
// // //                                         {userStatuses.map((u, i) => (
// // //                                             <tr key={i} style={{borderBottom:'1px solid #eee'}}>
// // //                                                 <td style={{padding:'10px', fontWeight:'bold'}}>{u.username}</td>
// // //                                                 <td><span style={{...styles.statusDot, background: u.status==='Online'?'#4caf50':'#9e9e9e'}}></span>{u.status}</td>
// // //                                                 <td style={{fontSize:'12px', color:'#666'}}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td>
// // //                                             </tr>
// // //                                         ))}
// // //                                     </tbody>
// // //                                 </table>
// // //                             </div>
// // //                         </div>
// // //                         <div style={{flex:2}}>
// // //                             <div style={styles.adminCard}>
// // //                                 <div style={{...styles.adminHeader, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
// // //                                     <span>System Logs</span>
// // //                                     <div style={{fontSize:'12px', fontWeight:'normal'}}>
// // //                                         Filter: <input type="date" onChange={e => setFilterStart(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/> to <input type="date" onChange={e => setFilterEnd(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/>
// // //                                     </div>
// // //                                 </div>
// // //                                 <div style={{maxHeight:'400px', overflowY:'auto'}}>
// // //                                     <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
// // //                                         <thead style={{position:'sticky', top:0, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}}>
// // //                                             <tr><th style={{padding:'10px', textAlign:'left'}}>Time</th><th style={{textAlign:'left'}}>User</th><th style={{textAlign:'left'}}>Action</th><th style={{textAlign:'left'}}>Details</th></tr>
// // //                                         </thead>
// // //                                         <tbody>
// // //                                             {getFilteredLogs().map((l,i) => (
// // //                                                 <tr key={i} style={{borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa'}}>
// // //                                                     <td style={{padding:'8px', color:'#666', whiteSpace:'nowrap'}}>{l.displayTime}</td>
// // //                                                     <td style={{fontWeight:'bold', color:'#333'}}>{l.username}</td>
// // //                                                     <td style={{color: l.action.includes('DELETED')?'red':'#1565c0'}}>{l.action}</td>
// // //                                                     <td style={{color:'#555'}}>{l.details}</td>
// // //                                                 </tr>
// // //                                             ))}
// // //                                         </tbody>
// // //                                     </table>
// // //                                 </div>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 </ModalWrapper>
// // //             )}
            
// // //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
            
// // //             {currentMedia && (
// // //                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
// // //                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
// // //                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (
// // //                             <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />
// // //                         ) : (
// // //                             <img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />
// // //                         )}
// // //                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
// // //                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>⬇ Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
// // //                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>📦 Download ZIP (with Data)</button>
// // //                         </div>
// // //                     </div>
// // //                 </ModalWrapper>
// // //             )}

// // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map</div>}
// // //         </div>
// // //     );
// // // };

// // // export default Dashboard;



// // // ... existing imports ...
// // import React, { useState, useEffect, useCallback } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import L from 'leaflet';
// // import SurveyForm from './SurveyForm';
// // import JSZip from 'jszip';
// // import { saveAs } from 'file-saver';
// // import { 
// //     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
// //     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// // } from './db';

// // // ... existing icon constants ...
// // const DefaultIcon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
// // L.Marker.prototype.options.icon = DefaultIcon;
// // const SurveyIcon = L.divIcon({ className: 'custom-survey-icon', html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', iconSize: [16, 16] });

// // const DATA_HIERARCHY = { districts: ['VARANASI', 'Hyderabad'], blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] }, spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, rings: { 'Span-Uppal': ['Ring-01'] } };
// // const SPAN_COORDS = { 'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } };

// // const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// // const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };

// // const isRecent = (timestamp) => {
// //     if (!timestamp) return false;
// //     const now = new Date();
// //     const surveyDate = new Date(timestamp);
// //     const diffHours = Math.abs(now - surveyDate) / 36e5;
// //     return diffHours < 24;
// // };

// // const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
// // const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
// // const MapUpdater = ({ center }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; };

// // const Dashboard = ({ user, role, onLogout, logAction }) => {
// //     // ... all states remain same ...
// //     const [selectedDistrict, setSelectedDistrict] = useState('');
// //     const [selectedBlock, setSelectedBlock] = useState('');
// //     const [selectedSpan, setSelectedSpan] = useState('');
// //     const [selectedRing, setSelectedRing] = useState('');
    
// //     const [startPoint, setStartPoint] = useState(null);
// //     const [endPoint, setEndPoint] = useState(null);
// //     const [displayPath, setDisplayPath] = useState([]);
// //     const [isRingView, setIsRingView] = useState(false);
// //     const [diggingPoints, setDiggingPoints] = useState([]);
    
// //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// //     const [userStatuses, setUserStatuses] = useState([]);
// //     const [logs, setLogs] = useState([]);
// //     const [userRoutes, setUserRoutes] = useState([]);
    
// //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// //     const [editingSurvey, setEditingSurvey] = useState(null);
// //     const [isViewOnly, setIsViewOnly] = useState(false);
// //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// //     const [pickedCoords, setPickedCoords] = useState(null);
// //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// //     const [showUserStatus, setShowUserStatus] = useState(false);
// //     const [currentMedia, setCurrentMedia] = useState(null);
// //     const [uploadModalId, setUploadModalId] = useState(null);

// //     const [searchDist, setSearchDist] = useState('');
// //     const [searchBlock, setSearchBlock] = useState('');
// //     const [searchGeneric, setSearchGeneric] = useState('');
// //     const [searchDateFrom, setSearchDateFrom] = useState('');
// //     const [searchDateTo, setSearchDateTo] = useState('');
// //     const [filterStart, setFilterStart] = useState('');
// //     const [filterEnd, setFilterEnd] = useState('');

// //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// //     const applyFilters = useCallback((data) => {
// //         let filtered = data;
// //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// //         if (searchGeneric) {
// //             const term = searchGeneric.toLowerCase();
// //             filtered = filtered.filter(s => 
// //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// //             );
// //         }
// //         if (searchDateFrom && searchDateTo) {
// //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// //         }
// //         setFilteredSurveys(filtered);
// //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// //     const refreshData = useCallback(async () => {
// //         try {
// //             const surveys = await getAllSurveys();
// //             const allSurveys = surveys || [];
// //             const sortedSurveys = allSurveys.sort((a, b) => b.id - a.id);
// //             setSubmittedSurveys(sortedSurveys);
// //             applyFilters(sortedSurveys);
// //             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
// //             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);
// //             const routes = {};
// //             sortedSurveys.forEach(s => {
// //                 if (!routes[s.routeName]) routes[s.routeName] = {};
// //                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// //                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
// //                 routes[s.routeName].name = s.routeName;
// //             });
// //             const lines = Object.values(routes).filter(r => r.start && r.end);
// //             setUserRoutes(lines);
// //         } catch(e) { console.error(e); }
// //     }, [applyFilters]);

// //     useEffect(() => { refreshData(); const interval = setInterval(refreshData, 5000); return () => clearInterval(interval); }, [refreshData]);
// //     useEffect(() => { applyFilters(submittedSurveys); }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

// //     useEffect(() => {
// //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// //         const data = SPAN_COORDS[selectedSpan];
// //         if(data) {
// //             setStartPoint(data.start); setEndPoint(data.end);
// //             if (selectedRing) {
// //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// //             } else {
// //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// //             }
// //         }
// //     }, [selectedSpan, selectedRing]);

// //     const handleSurveySubmit = async (formData) => {
// //         try {
// //             const timestamp = Date.now();
// //             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
// //             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
// //             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

// //             const enrichedData = {
// //                 ...formData,
// //                 id: editingSurvey ? editingSurvey.id : timestamp,
// //                 submittedBy: user,
// //                 timestamp: new Date().toLocaleString(),
// //                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
// //                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
// //                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
// //                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
// //             };
// //             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

// //             if (editingSurvey) {
// //                 await updateSurveyInDB(enrichedData);
// //                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// //                 alert("Updated!");
// //             } else {
// //                 await saveSurveyToDB(enrichedData);
// //                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
// //                 alert(`Saved!`);
// //             }
// //             setShowSurveyForm(false); setEditingSurvey(null); setIsViewOnly(false); refreshData();
// //         } catch (e) { console.error(e); alert("Error saving data."); }
// //     };

// //     const handleDeleteSurvey = async (id) => {
// //         if(window.confirm("Permanently delete this record?")) {
// //             await deleteSurveyFromDB(id);
// //             await deleteMediaFromDisk(`video_${id}`); 
// //             await deleteMediaFromDisk(`photo_${id}`); 
// //             await deleteMediaFromDisk(`gopro_${id}`);
// //             logAction(user, 'DELETED_DATA', `ID: ${id}`);
// //             refreshData();
// //         }
// //     };

// //     const handleGoProUpload = async (e) => {
// //         if(e.target.files[0]) {
// //             const file = e.target.files[0];
// //             const url = URL.createObjectURL(file); 
// //             const survey = submittedSurveys.find(s => s.id === uploadModalId);
// //             if (survey) {
// //                 const mediaId = `gopro_${survey.id}`;
// //                 await saveMediaToDisk(mediaId, file);
// //                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
// //                 await updateSurveyInDB(updatedSurvey);
// //                 alert("GoPro Uploaded!"); setUploadModalId(null); refreshData();
// //             }
// //         }
// //     };

// //     const handleViewMedia = async (type, survey) => {
// //         const id = type === 'video' ? survey.videoId : (type === 'gopro' ? survey.goproId : survey.photoId);
// //         if (!id) return;
// //         try {
// //             const blob = await getMediaFromDisk(id);
// //             if (blob) {
// //                 const url = URL.createObjectURL(blob);
// //                 setCurrentMedia({ type, url, blob, filename: `${survey.generatedFileName}_${type}`, meta: survey });
// //             } else { alert("Media file not in DB."); }
// //         } catch(e) { console.error(e); }
// //     };

// //     const handleDirectDownload = () => {
// //         if (!currentMedia || !currentMedia.blob) return;
// //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// //         const safeFilename = currentMedia.filename.replace(/\.(webm|mp4|jpg|png)$/i, '');
// //         saveAs(currentMedia.blob, `${safeFilename}.${ext}`);
// //     };

// //     const handleDownloadZip = async () => {
// //         if (!currentMedia || !currentMedia.blob) return;
// //         const zip = new JSZip();
// //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// //         const safeFilename = currentMedia.filename.replace(/\.(webm|mp4|jpg|png)$/i, '');

// //         zip.file(`${safeFilename}.${ext}`, currentMedia.blob);
// //         const metaInfo = `SURVEY METADATA\n----------------\nFilename: ${safeFilename}.${ext}\nDate: ${currentMedia.meta.timestamp}\nRoute: ${currentMedia.meta.routeName}\nLatitude: ${currentMedia.meta.latitude}\nLongitude: ${currentMedia.meta.longitude}\nSurveyor: ${currentMedia.meta.surveyorName}`;
// //         zip.file("details.txt", metaInfo);

// //         const content = await zip.generateAsync({type:"blob"});
// //         saveAs(content, `${safeFilename}.zip`);
// //     };

// //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// //     const getSessionDuration = (str) => { if (!str) return '-'; const diff = new Date() - new Date(str); return `${Math.floor(diff/60000)} mins`; };
// //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

// //     // Styles (Same as before)
// //     const styles = {
// //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
// //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
// //         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// //         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// //         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// //         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// //         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// //         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// //         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
// //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
// //         adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
// //         adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
// //     };

// //     return (
// //         <div style={styles.container}>
// //             <div style={styles.header}>
// //                 <div style={styles.headerLeft}>
// //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// //                 </div>
// //                 <div style={styles.controls}>
// //                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// //                 </div>
// //             </div>

// //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// //                 <LayersControl position="topright">
// //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// //                 </LayersControl>
// //                 {startPoint && <MapUpdater center={startPoint} />}
// //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
                
// //                 {submittedSurveys.map(s => s.latitude && (
// //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// //                         <Popup minWidth={250}>
// //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// //                                 <div><b>File:</b> {s.generatedFileName}</div>
// //                                 <div><b>Route:</b> {s.routeName}</div>
// //                                 <div style={{marginTop:'10px'}}>
// //                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
// //                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// //                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
// //                                 </div>
// //                             </div>
// //                         </Popup>
// //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// //                             <div style={{textAlign:'left'}}>
// //                                 {isRecent(s.timestamp) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>🆕 RECENT</div>}
// //                                 <div style={{fontWeight:'bold', fontSize:'13px'}}>{s.locationType}</div>
// //                                 <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
// //                                 <div style={{fontSize:'11px', color:'#555'}}>{s.timestamp}</div>
// //                             </div>
// //                         </Tooltip>
// //                     </Marker>
// //                 ))}
// //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// //             </MapContainer>

// //             {showSurveyForm && <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />}
            
// //             {showSurveyTable && (
// //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// //                     <div style={styles.filterBox}>
// //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
// //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// //                     </div>
// //                     <table style={styles.table}>
// //                         <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
// //                         <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b> ℹ️</td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
// //                             {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
// //                             {s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}
// //                             {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// //                         </td>
// //                         <td style={styles.td}>
// //                             <button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>
                            
// //                             {/* --- FIX: ENABLE EDIT FOR USER --- */}
// //                             {(role === 'admin' || s.submittedBy === user) && (
// //                                 <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>
// //                             )}
                            
// //                             {/* --- FIX: ENABLE DELETE FOR USER --- */}
// //                             {(role === 'admin' || s.submittedBy === user) && (
// //                                 <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>
// //                             )}
// //                         </td>
// //                         </tr>))}</tbody>
// //                     </table>
// //                 </ModalWrapper>
// //             )}
            
// //             {showUserStatus && role === 'admin' && (
// //                 <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
// //                     <div style={{display:'flex', gap:'20px', height:'100%', flexDirection:'row'}}>
// //                         <div style={{flex:1, minWidth:'300px'}}>
// //                             <div style={styles.adminCard}>
// //                                 <div style={styles.adminHeader}>Live User Status</div>
// //                                 <table style={styles.table}>
// //                                     <thead><tr style={{background:'#f9f9f9'}}><th style={{padding:'10px'}}>User</th><th>Status</th><th>Time</th></tr></thead>
// //                                     <tbody>
// //                                         {userStatuses.map((u, i) => (
// //                                             <tr key={i} style={{borderBottom:'1px solid #eee'}}>
// //                                                 <td style={{padding:'10px', fontWeight:'bold'}}>{u.username}</td>
// //                                                 <td><span style={{...styles.statusDot, background: u.status==='Online'?'#4caf50':'#9e9e9e'}}></span>{u.status}</td>
// //                                                 <td style={{fontSize:'12px', color:'#666'}}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td>
// //                                             </tr>
// //                                         ))}
// //                                     </tbody>
// //                                 </table>
// //                             </div>
// //                         </div>
// //                         <div style={{flex:2}}>
// //                             <div style={styles.adminCard}>
// //                                 <div style={{...styles.adminHeader, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
// //                                     <span>System Logs</span>
// //                                     <div style={{fontSize:'12px', fontWeight:'normal'}}>
// //                                         Filter: <input type="date" onChange={e => setFilterStart(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/> to <input type="date" onChange={e => setFilterEnd(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/>
// //                                     </div>
// //                                 </div>
// //                                 <div style={{maxHeight:'400px', overflowY:'auto'}}>
// //                                     <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
// //                                         <thead style={{position:'sticky', top:0, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}}>
// //                                             <tr><th style={{padding:'10px', textAlign:'left'}}>Time</th><th style={{textAlign:'left'}}>User</th><th style={{textAlign:'left'}}>Action</th><th style={{textAlign:'left'}}>Details</th></tr>
// //                                         </thead>
// //                                         <tbody>
// //                                             {getFilteredLogs().map((l,i) => (
// //                                                 <tr key={i} style={{borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa'}}>
// //                                                     <td style={{padding:'8px', color:'#666', whiteSpace:'nowrap'}}>{l.displayTime}</td>
// //                                                     <td style={{fontWeight:'bold', color:'#333'}}>{l.username}</td>
// //                                                     <td style={{color: l.action.includes('DELETED')?'red':'#1565c0'}}>{l.action}</td>
// //                                                     <td style={{color:'#555'}}>{l.details}</td>
// //                                                 </tr>
// //                                             ))}
// //                                         </tbody>
// //                                     </table>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </ModalWrapper>
// //             )}
            
// //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
            
// //             {currentMedia && (
// //                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
// //                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
// //                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (
// //                             <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />
// //                         ) : (
// //                             // --- FIX: ADD FULLSCREEN ICON OVERLAY ---
// //                             <div style={{position:'relative', display:'inline-block'}}>
// //                                 <img id="viewerImage" src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />
// //                                 <div 
// //                                     onClick={() => {
// //                                         const elem = document.getElementById('viewerImage');
// //                                         if (elem.requestFullscreen) elem.requestFullscreen();
// //                                         else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen(); // Safari
// //                                     }}
// //                                     style={{
// //                                         position:'absolute', top:'10px', right:'10px', 
// //                                         background:'rgba(0,0,0,0.6)', color:'white', 
// //                                         padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontSize:'12px', fontWeight:'bold'
// //                                     }}
// //                                 >
// //                                     ⛶ Fullscreen
// //                                 </div>
// //                             </div>
// //                         )}
// //                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
// //                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>⬇ Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
// //                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>📦 Download ZIP (with Data)</button>
// //                         </div>
// //                     </div>
// //                 </ModalWrapper>
// //             )}

// //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map</div>}
// //         </div>
// //     );
// // };

// // export default Dashboard;



// import React, { useState, useEffect, useCallback } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import SurveyForm from './SurveyForm';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
// import { 
//     saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
//     saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
// } from './db';

// const DefaultIcon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
// L.Marker.prototype.options.icon = DefaultIcon;
// const SurveyIcon = L.divIcon({ className: 'custom-survey-icon', html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', iconSize: [16, 16] });

// const DATA_HIERARCHY = { districts: ['VARANASI', 'Hyderabad'], blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] }, spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, rings: { 'Span-Uppal': ['Ring-01'] } };
// const SPAN_COORDS = { 'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } };

// const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };

// const isRecent = (timestamp) => {
//     if (!timestamp) return false;
//     const now = new Date();
//     const surveyDate = new Date(timestamp);
//     const diffHours = Math.abs(now - surveyDate) / 36e5;
//     return diffHours < 24;
// };

// const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
// const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
// const MapUpdater = ({ center }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; };

// const Dashboard = ({ user, role, onLogout, logAction }) => {
//     const [selectedDistrict, setSelectedDistrict] = useState('');
//     const [selectedBlock, setSelectedBlock] = useState('');
//     const [selectedSpan, setSelectedSpan] = useState('');
//     const [selectedRing, setSelectedRing] = useState('');
    
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [displayPath, setDisplayPath] = useState([]);
//     const [isRingView, setIsRingView] = useState(false);
//     const [diggingPoints, setDiggingPoints] = useState([]);
    
//     const [submittedSurveys, setSubmittedSurveys] = useState([]);
//     const [filteredSurveys, setFilteredSurveys] = useState([]);
//     const [userStatuses, setUserStatuses] = useState([]);
//     const [logs, setLogs] = useState([]);
//     const [userRoutes, setUserRoutes] = useState([]);
    
//     const [showSurveyForm, setShowSurveyForm] = useState(false);
//     const [editingSurvey, setEditingSurvey] = useState(null);
//     const [isViewOnly, setIsViewOnly] = useState(false);
//     const [isPickingLocation, setIsPickingLocation] = useState(false);
//     const [pickedCoords, setPickedCoords] = useState(null);
//     const [showSurveyTable, setShowSurveyTable] = useState(false);
//     const [showUserStatus, setShowUserStatus] = useState(false);
//     const [currentMedia, setCurrentMedia] = useState(null);
//     const [uploadModalId, setUploadModalId] = useState(null);

//     const [searchDist, setSearchDist] = useState('');
//     const [searchBlock, setSearchBlock] = useState('');
//     const [searchGeneric, setSearchGeneric] = useState('');
//     const [searchDateFrom, setSearchDateFrom] = useState('');
//     const [searchDateTo, setSearchDateTo] = useState('');
//     const [filterStart, setFilterStart] = useState('');
//     const [filterEnd, setFilterEnd] = useState('');

//     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
//     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
//     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
//     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

//     const applyFilters = useCallback((data) => {
//         let filtered = data;
//         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
//         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
//         if (searchGeneric) {
//             const term = searchGeneric.toLowerCase();
//             filtered = filtered.filter(s => 
//                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
//                 (s.routeName && s.routeName.toLowerCase().includes(term))
//             );
//         }
//         if (searchDateFrom && searchDateTo) {
//             const from = new Date(searchDateFrom).setHours(0,0,0,0);
//             const to = new Date(searchDateTo).setHours(23,59,59,999);
//             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
//         }
//         setFilteredSurveys(filtered);
//     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

//     const refreshData = useCallback(async () => {
//         try {
//             const surveys = await getAllSurveys();
//             const allSurveys = surveys || [];
//             const sortedSurveys = allSurveys.sort((a, b) => b.id - a.id);
//             setSubmittedSurveys(sortedSurveys);
//             applyFilters(sortedSurveys);
//             setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
//             setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);
//             const routes = {};
//             sortedSurveys.forEach(s => {
//                 if (!routes[s.routeName]) routes[s.routeName] = {};
//                 if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
//                 if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
//                 routes[s.routeName].name = s.routeName;
//             });
//             const lines = Object.values(routes).filter(r => r.start && r.end);
//             setUserRoutes(lines);
//         } catch(e) { console.error(e); }
//     }, [applyFilters]);

//     useEffect(() => { refreshData(); const interval = setInterval(refreshData, 5000); return () => clearInterval(interval); }, [refreshData]);
//     useEffect(() => { applyFilters(submittedSurveys); }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

//     useEffect(() => {
//         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
//         const data = SPAN_COORDS[selectedSpan];
//         if(data) {
//             setStartPoint(data.start); setEndPoint(data.end);
//             if (selectedRing) {
//                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
//                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
//                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
//             } else {
//                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
//             }
//         }
//     }, [selectedSpan, selectedRing]);

//     const handleSurveySubmit = async (formData) => {
//         try {
//             const timestamp = Date.now();
//             if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
//             if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
//             if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

//             const enrichedData = {
//                 ...formData,
//                 id: editingSurvey ? editingSurvey.id : timestamp,
//                 submittedBy: user,
//                 timestamp: new Date().toLocaleString(),
//                 generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
//                 videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
//                 photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
//                 goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
//             };
//             delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

//             if (editingSurvey) {
//                 await updateSurveyInDB(enrichedData);
//                 logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
//                 alert("Updated!");
//             } else {
//                 await saveSurveyToDB(enrichedData);
//                 logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
//                 alert(`Saved!`);
//             }
//             setShowSurveyForm(false); setEditingSurvey(null); setIsViewOnly(false); refreshData();
//         } catch (e) { console.error(e); alert("Error saving data."); }
//     };

//     const handleDeleteSurvey = async (id) => {
//         if(window.confirm("Admin: Permanently delete this record?")) {
//             await deleteSurveyFromDB(id);
//             await deleteMediaFromDisk(`video_${id}`); 
//             await deleteMediaFromDisk(`photo_${id}`); 
//             await deleteMediaFromDisk(`gopro_${id}`);
//             logAction(user, 'DELETED_DATA', `ID: ${id}`);
//             refreshData();
//         }
//     };

//     const handleGoProUpload = async (e) => {
//         if(e.target.files[0]) {
//             const file = e.target.files[0];
//             const url = URL.createObjectURL(file); 
//             const survey = submittedSurveys.find(s => s.id === uploadModalId);
//             if (survey) {
//                 const mediaId = `gopro_${survey.id}`;
//                 await saveMediaToDisk(mediaId, file);
//                 const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
//                 await updateSurveyInDB(updatedSurvey);
//                 alert("GoPro Uploaded!"); setUploadModalId(null); refreshData();
//             }
//         }
//     };

//     const handleViewMedia = async (type, survey) => {
//         const id = type === 'video' ? survey.videoId : (type === 'gopro' ? survey.goproId : survey.photoId);
//         if (!id) return;
//         try {
//             const blob = await getMediaFromDisk(id);
//             if (blob) {
//                 const url = URL.createObjectURL(blob);
//                 setCurrentMedia({ type, url, blob, filename: `${survey.generatedFileName}_${type}`, meta: survey });
//             } else { alert("Media file not in DB."); }
//         } catch(e) { console.error(e); }
//     };

//     // --- FIX: ENHANCED DOWNLOAD LOGIC ---
//     // This creates a filename like: Route_Lat_17.123_Lon_78.123.mp4
//     // This is the "Property Details" workaround for Video
//     const getDetailedFilename = () => {
//         if (!currentMedia || !currentMedia.meta) return 'Download';
//         const { routeName, latitude, longitude } = currentMedia.meta;
//         const cleanRoute = routeName ? routeName.replace(/[^a-zA-Z0-9]/g, '_') : 'Route';
//         // Clean lat/lon to avoid too many decimals in filename
//         const lat = parseFloat(latitude).toFixed(5);
//         const lon = parseFloat(longitude).toFixed(5);
//         return `${cleanRoute}_Lat_${lat}_Lon_${lon}`;
//     };

//     const handleDirectDownload = () => {
//         if (!currentMedia || !currentMedia.blob) return;
        
//         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
//         const finalName = `${getDetailedFilename()}.${ext}`;
        
//         saveAs(currentMedia.blob, finalName);
//     };

//     const handleDownloadZip = async () => {
//         if (!currentMedia || !currentMedia.blob) return;
//         const zip = new JSZip();
        
//         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
//         const finalName = getDetailedFilename();

//         zip.file(`${finalName}.${ext}`, currentMedia.blob);
        
//         const metaInfo = `SURVEY METADATA\n----------------\nFilename: ${finalName}\nDate: ${currentMedia.meta.timestamp}\nRoute: ${currentMedia.meta.routeName}\nLatitude: ${currentMedia.meta.latitude}\nLongitude: ${currentMedia.meta.longitude}\nSurveyor: ${currentMedia.meta.surveyorName}`;
//         zip.file("details.txt", metaInfo);

//         const content = await zip.generateAsync({type:"blob"});
//         saveAs(content, `${finalName}.zip`);
//     };

//     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
//     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
//     const getSessionDuration = (str) => { if (!str) return '-'; const diff = new Date() - new Date(str); return `${Math.floor(diff/60000)} mins`; };
//     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

//     // Styles
//     const styles = {
//         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
//         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
//         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
//         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
//         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
//         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
//         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
//         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
//         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
//         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
//         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
//         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
//         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
//         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
//         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
//         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
//         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
//         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
//         adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
//         adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <div style={styles.headerLeft}>
//                     <strong style={{fontSize:'20px'}}>GIS</strong>
//                     <span style={styles.badge}>{role.toUpperCase()}</span>
//                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
//                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
//                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
//                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
//                 </div>
//                 <div style={styles.controls}>
//                     <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
//                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
//                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
//                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
//                 </div>
//             </div>

//             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
//                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
//                 <LayersControl position="topright">
//                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
//                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
//                 </LayersControl>
//                 {startPoint && <MapUpdater center={startPoint} />}
//                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
//                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
//                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
//                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
                
//                 {submittedSurveys.map(s => s.latitude && (
//                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
//                         <Popup minWidth={250}>
//                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
//                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
//                                 <div><b>File:</b> {s.generatedFileName}</div>
//                                 <div><b>Route:</b> {s.routeName}</div>
//                                 <div style={{marginTop:'10px'}}>
//                                     {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
//                                     {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
//                                     {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
//                                 </div>
//                             </div>
//                         </Popup>
//                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
//                             <div style={{textAlign:'left'}}>
//                                 {isRecent(s.timestamp) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>🆕 RECENT</div>}
//                                 <div style={{fontWeight:'bold', fontSize:'13px'}}>{s.locationType}</div>
//                                 <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
//                                 <div style={{fontSize:'11px', color:'#555'}}>{s.timestamp}</div>
//                             </div>
//                         </Tooltip>
//                     </Marker>
//                 ))}
//                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
//             </MapContainer>

//             {showSurveyForm && <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />}
            
//             {showSurveyTable && (
//                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
//                     <div style={styles.filterBox}>
//                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
//                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
//                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
//                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
//                     </div>
//                     <table style={styles.table}>
//                         <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
//                         <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b> ℹ️</td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
//                             {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
//                             {s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}
//                             {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
//                         </td><td style={styles.td}><button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>{(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}{role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}</td></tr>))}</tbody>
//                     </table>
//                 </ModalWrapper>
//             )}
            
//             {showUserStatus && role === 'admin' && (
//                 <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
//                     <div style={{display:'flex', gap:'20px', height:'100%', flexDirection:'row'}}>
//                         <div style={{flex:1, minWidth:'300px'}}>
//                             <div style={styles.adminCard}>
//                                 <div style={styles.adminHeader}>Live User Status</div>
//                                 <table style={styles.table}>
//                                     <thead><tr style={{background:'#f9f9f9'}}><th style={{padding:'10px'}}>User</th><th>Status</th><th>Time</th></tr></thead>
//                                     <tbody>
//                                         {userStatuses.map((u, i) => (
//                                             <tr key={i} style={{borderBottom:'1px solid #eee'}}>
//                                                 <td style={{padding:'10px', fontWeight:'bold'}}>{u.username}</td>
//                                                 <td><span style={{...styles.statusDot, background: u.status==='Online'?'#4caf50':'#9e9e9e'}}></span>{u.status}</td>
//                                                 <td style={{fontSize:'12px', color:'#666'}}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                         <div style={{flex:2}}>
//                             <div style={styles.adminCard}>
//                                 <div style={{...styles.adminHeader, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
//                                     <span>System Logs</span>
//                                     <div style={{fontSize:'12px', fontWeight:'normal'}}>
//                                         Filter: <input type="date" onChange={e => setFilterStart(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/> to <input type="date" onChange={e => setFilterEnd(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/>
//                                     </div>
//                                 </div>
//                                 <div style={{maxHeight:'400px', overflowY:'auto'}}>
//                                     <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
//                                         <thead style={{position:'sticky', top:0, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}}>
//                                             <tr><th style={{padding:'10px', textAlign:'left'}}>Time</th><th style={{textAlign:'left'}}>User</th><th style={{textAlign:'left'}}>Action</th><th style={{textAlign:'left'}}>Details</th></tr>
//                                         </thead>
//                                         <tbody>
//                                             {getFilteredLogs().map((l,i) => (
//                                                 <tr key={i} style={{borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa'}}>
//                                                     <td style={{padding:'8px', color:'#666', whiteSpace:'nowrap'}}>{l.displayTime}</td>
//                                                     <td style={{fontWeight:'bold', color:'#333'}}>{l.username}</td>
//                                                     <td style={{color: l.action.includes('DELETED')?'red':'#1565c0'}}>{l.action}</td>
//                                                     <td style={{color:'#555'}}>{l.details}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </ModalWrapper>
//             )}
            
//             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
            
//             {currentMedia && (
//                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
//                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
//                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (
//                             <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />
//                         ) : (
//                             <img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />
//                         )}
//                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
//                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>
//                                 ⬇ Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}
//                             </button>
//                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>
//                                 📦 Download ZIP
//                             </button>
//                         </div>
//                     </div>
//                 </ModalWrapper>
//             )}

//             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map</div>}
//         </div>
//     );
// };

// export default Dashboard;


import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SurveyForm from './SurveyForm';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
    saveSurveyToDB, deleteSurveyFromDB, updateSurveyInDB, getAllSurveys, 
    saveMediaToDisk, getMediaFromDisk, deleteMediaFromDisk 
} from './db';

const DefaultIcon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
L.Marker.prototype.options.icon = DefaultIcon;
const SurveyIcon = L.divIcon({ className: 'custom-survey-icon', html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', iconSize: [16, 16] });

const DATA_HIERARCHY = { districts: ['VARANASI', 'Hyderabad'], blocks: { 'Hyderabad': ['Central'], 'VARANASI': ['Badagon'] }, spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, rings: { 'Span-Uppal': ['Ring-01'] } };
const SPAN_COORDS = { 'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } };

const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };

const isRecent = (timestamp) => {
    if (!timestamp) return false;
    const now = new Date();
    const surveyDate = new Date(timestamp);
    const diffHours = Math.abs(now - surveyDate) / 36e5;
    return diffHours < 24;
};

const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
const MapUpdater = ({ center }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; };

const Dashboard = ({ user, role, onLogout, logAction }) => {
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedSpan, setSelectedSpan] = useState('');
    const [selectedRing, setSelectedRing] = useState('');
    
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [displayPath, setDisplayPath] = useState([]);
    const [isRingView, setIsRingView] = useState(false);
    const [diggingPoints, setDiggingPoints] = useState([]);
    
    const [submittedSurveys, setSubmittedSurveys] = useState([]);
    const [filteredSurveys, setFilteredSurveys] = useState([]);
    const [userStatuses, setUserStatuses] = useState([]);
    const [logs, setLogs] = useState([]);
    const [userRoutes, setUserRoutes] = useState([]);
    
    const [showSurveyForm, setShowSurveyForm] = useState(false);
    const [editingSurvey, setEditingSurvey] = useState(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [isPickingLocation, setIsPickingLocation] = useState(false);
    const [pickedCoords, setPickedCoords] = useState(null);
    const [showSurveyTable, setShowSurveyTable] = useState(false);
    const [showUserStatus, setShowUserStatus] = useState(false);
    const [currentMedia, setCurrentMedia] = useState(null);
    const [uploadModalId, setUploadModalId] = useState(null);

    const [searchDist, setSearchDist] = useState('');
    const [searchBlock, setSearchBlock] = useState('');
    const [searchGeneric, setSearchGeneric] = useState('');
    const [searchDateFrom, setSearchDateFrom] = useState('');
    const [searchDateTo, setSearchDateTo] = useState('');
    const [filterStart, setFilterStart] = useState('');
    const [filterEnd, setFilterEnd] = useState('');

    const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
    const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
    const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
    const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

    const applyFilters = useCallback((data) => {
        let filtered = data;
        if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
        if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
        if (searchGeneric) {
            const term = searchGeneric.toLowerCase();
            filtered = filtered.filter(s => 
                (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
                (s.routeName && s.routeName.toLowerCase().includes(term))
            );
        }
        if (searchDateFrom && searchDateTo) {
            const from = new Date(searchDateFrom).setHours(0,0,0,0);
            const to = new Date(searchDateTo).setHours(23,59,59,999);
            filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
        }
        setFilteredSurveys(filtered);
    }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

    const refreshData = useCallback(async () => {
        try {
            const surveys = await getAllSurveys();
            const allSurveys = surveys || [];
            const sortedSurveys = allSurveys.sort((a, b) => b.id - a.id);
            setSubmittedSurveys(sortedSurveys);
            applyFilters(sortedSurveys);
            setLogs(JSON.parse(localStorage.getItem('bsnl_logs')) || []);
            setUserStatuses(JSON.parse(localStorage.getItem('bsnl_users')) || []);
            const routes = {};
            sortedSurveys.forEach(s => {
                if (!routes[s.routeName]) routes[s.routeName] = {};
                if (s.locationType === 'HDD Start Point') routes[s.routeName].start = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
                if (s.locationType === 'HDD End Point') routes[s.routeName].end = { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) };
                routes[s.routeName].name = s.routeName;
            });
            const lines = Object.values(routes).filter(r => r.start && r.end);
            setUserRoutes(lines);
        } catch(e) { console.error(e); }
    }, [applyFilters]);

    useEffect(() => { refreshData(); const interval = setInterval(refreshData, 5000); return () => clearInterval(interval); }, [refreshData]);
    useEffect(() => { applyFilters(submittedSurveys); }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, submittedSurveys, applyFilters]);

    useEffect(() => {
        if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
        const data = SPAN_COORDS[selectedSpan];
        if(data) {
            setStartPoint(data.start); setEndPoint(data.end);
            if (selectedRing) {
                const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
                const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
                setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
            } else {
                setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
            }
        }
    }, [selectedSpan, selectedRing]);

    const handleSurveySubmit = async (formData) => {
        try {
            const timestamp = Date.now();
            if(formData.liveVideoBlob) await saveMediaToDisk(`video_${formData.id || timestamp}`, formData.liveVideoBlob);
            if(formData.sitePhotoBlob) await saveMediaToDisk(`photo_${formData.id || timestamp}`, formData.sitePhotoBlob);
            if(formData.goproBlob) await saveMediaToDisk(`gopro_${formData.id || timestamp}`, formData.goproBlob);

            const enrichedData = {
                ...formData,
                id: editingSurvey ? editingSurvey.id : timestamp,
                submittedBy: user,
                timestamp: new Date().toLocaleString(),
                generatedFileName: formData.generatedFileName || `FILE_${timestamp}`,
                videoId: formData.liveVideoBlob ? `video_${formData.id || timestamp}` : (editingSurvey?.videoId || null),
                photoId: formData.sitePhotoBlob ? `photo_${formData.id || timestamp}` : (editingSurvey?.photoId || null),
                goproId: formData.goproBlob ? `gopro_${formData.id || timestamp}` : (editingSurvey?.goproId || null)
            };
            delete enrichedData.liveVideoBlob; delete enrichedData.sitePhotoBlob; delete enrichedData.goproBlob;

            if (editingSurvey) {
                await updateSurveyInDB(enrichedData);
                logAction(user, 'EDITED_SURVEY', `File: ${enrichedData.generatedFileName}`);
                alert("Updated!");
            } else {
                await saveSurveyToDB(enrichedData);
                logAction(user, 'SUBMITTED_SURVEY', `File: ${enrichedData.generatedFileName}`);
                alert(`Saved!`);
            }
            setShowSurveyForm(false); setEditingSurvey(null); setIsViewOnly(false); refreshData();
        } catch (e) { console.error(e); alert("Error saving data."); }
    };

    const handleDeleteSurvey = async (id) => {
        if(window.confirm("Admin: Permanently delete this record?")) {
            await deleteSurveyFromDB(id);
            await deleteMediaFromDisk(`video_${id}`); 
            await deleteMediaFromDisk(`photo_${id}`); 
            await deleteMediaFromDisk(`gopro_${id}`);
            logAction(user, 'DELETED_DATA', `ID: ${id}`);
            refreshData();
        }
    };

    const handleGoProUpload = async (e) => {
        if(e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file); 
            const survey = submittedSurveys.find(s => s.id === uploadModalId);
            if (survey) {
                const mediaId = `gopro_${survey.id}`;
                await saveMediaToDisk(mediaId, file);
                const updatedSurvey = { ...survey, goproVideo: url, goproId: mediaId };
                await updateSurveyInDB(updatedSurvey);
                alert("GoPro Uploaded!"); setUploadModalId(null); refreshData();
            }
        }
    };

    const handleViewMedia = async (type, survey) => {
        const id = type === 'video' ? survey.videoId : (type === 'gopro' ? survey.goproId : survey.photoId);
        if (!id) return;
        try {
            const blob = await getMediaFromDisk(id);
            if (blob) {
                const url = URL.createObjectURL(blob);
                setCurrentMedia({ type, url, blob, filename: `${survey.generatedFileName}_${type}`, meta: survey });
            } else { alert("Media file not in DB."); }
        } catch(e) { console.error(e); }
    };

    // --- FIX: ENHANCED DOWNLOAD LOGIC ---
    // This creates a filename like: Route_Lat_17.123_Lon_78.123.mp4
    // This is the "Property Details" workaround for Video
    const getDetailedFilename = () => {
        if (!currentMedia || !currentMedia.meta) return 'Download';
        const { routeName, latitude, longitude } = currentMedia.meta;
        const cleanRoute = routeName ? routeName.replace(/[^a-zA-Z0-9]/g, '_') : 'Route';
        // Clean lat/lon to avoid too many decimals in filename
        const lat = parseFloat(latitude).toFixed(5);
        const lon = parseFloat(longitude).toFixed(5);
        return `${cleanRoute}_Lat_${lat}_Lon_${lon}`;
    };

    const handleDirectDownload = () => {
        if (!currentMedia || !currentMedia.blob) return;
        
        const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
        const finalName = `${getDetailedFilename()}.${ext}`;
        
        saveAs(currentMedia.blob, finalName);
    };

    const handleDownloadZip = async () => {
        if (!currentMedia || !currentMedia.blob) return;
        const zip = new JSZip();
        
        const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
        const finalName = getDetailedFilename();

        zip.file(`${finalName}.${ext}`, currentMedia.blob);
        
        const metaInfo = `SURVEY METADATA\n----------------\nFilename: ${finalName}\nDate: ${currentMedia.meta.timestamp}\nRoute: ${currentMedia.meta.routeName}\nLatitude: ${currentMedia.meta.latitude}\nLongitude: ${currentMedia.meta.longitude}\nSurveyor: ${currentMedia.meta.surveyorName}`;
        zip.file("details.txt", metaInfo);

        const content = await zip.generateAsync({type:"blob"});
        saveAs(content, `${finalName}.zip`);
    };

    const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
    const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
    const getSessionDuration = (str) => { if (!str) return '-'; const diff = new Date() - new Date(str); return `${Math.floor(diff/60000)} mins`; };
    const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

    // Styles
    const styles = {
        container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
        header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
        controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
        headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
        select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
        badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
        btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
        btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
        btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
        table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
        th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
        td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
        actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
        statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
        downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
        pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
        filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
        searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
        adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
        adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <strong style={{fontSize:'20px'}}>GIS</strong>
                    <span style={styles.badge}>{role.toUpperCase()}</span>
                    <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
                    <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
                    <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
                    <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
                </div>
                <div style={styles.controls}>
                    <button onClick={() => { setEditingSurvey(null); setIsViewOnly(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
                    <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
                    {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
                    <button onClick={onLogout} style={styles.btnRed}>Logout</button>
                </div>
            </div>

            <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
                <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
                </LayersControl>
                {startPoint && <MapUpdater center={startPoint} />}
                {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
                {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
                {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
                {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
                {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
                
                {submittedSurveys.map(s => s.latitude && (
                    <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
                        <Popup minWidth={250}>
                            <div style={{fontSize:'13px', lineHeight:'1.6'}}>
                                <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
                                <div><b>File:</b> {s.generatedFileName}</div>
                                <div><b>Route:</b> {s.routeName}</div>
                                <div style={{marginTop:'10px'}}>
                                    {s.videoId && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
                                    {s.photoId && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
                                    {s.goproId && <button style={{...styles.actionBtn, background:'#0288d1', color:'white'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
                                </div>
                            </div>
                        </Popup>
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                            <div style={{textAlign:'left'}}>
                                {isRecent(s.timestamp) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>🆕 RECENT</div>}
                                <div style={{fontWeight:'bold', fontSize:'13px'}}>{s.locationType}</div>
                                <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
                                <div style={{fontSize:'11px', color:'#555'}}>{s.timestamp}</div>
                            </div>
                        </Tooltip>
                    </Marker>
                ))}
                {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
            </MapContainer>

            {showSurveyForm && <SurveyForm onClose={() => setShowSurveyForm(false)} pickedCoords={pickedCoords} districts={DATA_HIERARCHY.districts} blocks={Object.values(DATA_HIERARCHY.blocks)} onSubmitData={handleSurveySubmit} user={user} onPickLocation={handlePickLocationStart} initialData={editingSurvey} viewOnly={isViewOnly} />}
            
            {showSurveyTable && (
                <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
                    <div style={styles.filterBox}>
                        <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
                        <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
                        <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
                        <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
                    </div>
                    <table style={styles.table}>
                        <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
                        <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b> ℹ️</td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
                            {s.videoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
                            {s.goproId ? <button style={{...styles.actionBtn, color:'#333'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button> : <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>setUploadModalId(s.id)}>+ Upload</button>}
                            {s.photoId && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
                        </td><td style={styles.td}><button style={{...styles.actionBtn, background:'#eee', color:'#333'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(true); setShowSurveyTable(false); setShowSurveyForm(true)}}>View</button>{(role === 'admin' || s.submittedBy === user) && <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} onClick={()=>{setEditingSurvey(s); setIsViewOnly(false); setShowSurveyTable(false); setShowSurveyForm(true)}}>Edit</button>}{role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}</td></tr>))}</tbody>
                    </table>
                </ModalWrapper>
            )}
            
            {showUserStatus && role === 'admin' && (
                <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
                    <div style={{display:'flex', gap:'20px', height:'100%', flexDirection:'row'}}>
                        <div style={{flex:1, minWidth:'300px'}}>
                            <div style={styles.adminCard}>
                                <div style={styles.adminHeader}>Live User Status</div>
                                <table style={styles.table}>
                                    <thead><tr style={{background:'#f9f9f9'}}><th style={{padding:'10px'}}>User</th><th>Status</th><th>Time</th></tr></thead>
                                    <tbody>
                                        {userStatuses.map((u, i) => (
                                            <tr key={i} style={{borderBottom:'1px solid #eee'}}>
                                                <td style={{padding:'10px', fontWeight:'bold'}}>{u.username}</td>
                                                <td><span style={{...styles.statusDot, background: u.status==='Online'?'#4caf50':'#9e9e9e'}}></span>{u.status}</td>
                                                <td style={{fontSize:'12px', color:'#666'}}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style={{flex:2}}>
                            <div style={styles.adminCard}>
                                <div style={{...styles.adminHeader, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                    <span>System Logs</span>
                                    <div style={{fontSize:'12px', fontWeight:'normal'}}>
                                        Filter: <input type="date" onChange={e => setFilterStart(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/> to <input type="date" onChange={e => setFilterEnd(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/>
                                    </div>
                                </div>
                                <div style={{maxHeight:'400px', overflowY:'auto'}}>
                                    <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
                                        <thead style={{position:'sticky', top:0, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}}>
                                            <tr><th style={{padding:'10px', textAlign:'left'}}>Time</th><th style={{textAlign:'left'}}>User</th><th style={{textAlign:'left'}}>Action</th><th style={{textAlign:'left'}}>Details</th></tr>
                                        </thead>
                                        <tbody>
                                            {getFilteredLogs().map((l,i) => (
                                                <tr key={i} style={{borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa'}}>
                                                    <td style={{padding:'8px', color:'#666', whiteSpace:'nowrap'}}>{l.displayTime}</td>
                                                    <td style={{fontWeight:'bold', color:'#333'}}>{l.username}</td>
                                                    <td style={{color: l.action.includes('DELETED')?'red':'#1565c0'}}>{l.action}</td>
                                                    <td style={{color:'#555'}}>{l.details}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            )}
            
            {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
            
            {currentMedia && (
                <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
                    <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
                        {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (
                            <video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />
                        ) : (
                            <img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />
                        )}
                        <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
                            <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>
                                ⬇ Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}
                            </button>
                            <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>
                                📦 Download ZIP
                            </button>
                        </div>
                    </div>
                </ModalWrapper>
            )}

            {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>📍 PICKING MODE ACTIVE - Click map</div>}
        </div>
    );
};

export default Dashboard;