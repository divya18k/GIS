import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SurveyForm from './SurveyForm';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import axios from 'axios';

// --- ICONS ---
const DefaultIcon = L.icon({ 
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", 
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", 
    iconSize: [25, 41], 
    iconAnchor: [12, 41], 
    popupAnchor: [1, -34] 
});
L.Marker.prototype.options.icon = DefaultIcon;

const SurveyIcon = L.divIcon({ 
    className: 'custom-survey-icon', 
    html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', 
    iconSize: [16, 16] 
});

// --- CONSTANTS ---
const DATA_HIERARCHY = { 
    districts: ['VARANASI', 'Hyderabad'], 
    blocks: { 
        'Hyderabad': ['Central', 'North'], 
        'VARANASI': ['Badagon', 'City'] 
    }, 
    spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, 
    rings: { 'Span-Uppal': ['Ring-01'] } 
};

const SPAN_COORDS = { 
    'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 
    'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } 
};

const TYPE_CODES = {
    "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
    "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
    "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
};

const API_BASE = 'http://localhost:4000';

// --- HELPER FUNCTIONS ---
const getRingPath = (start, end, offsetFactor) => { 
    const midLat = (start.lat + end.lat) / 2; 
    const midLng = (start.lng + end.lng) / 2; 
    return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; 
};

const generatePointsOnPath = (path, count) => { 
    const points = []; 
    for (let i = 1; i <= count; i++) { 
        const ratio = i / (count + 1); 
        points.push({ 
            lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, 
            lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, 
            id: `SP-${i}` 
        }); 
    } 
    return points; 
};

const getSessionDuration = (str) => { 
    if (!str) return '-'; 
    const diff = new Date() - new Date(str); 
    return `${Math.floor(diff/60000)} mins`; 
};

const isRecent = (timestamp) => {
    if (!timestamp) return false;
    const now = new Date();
    const surveyDate = new Date(timestamp);
    const diffHours = Math.abs(now - surveyDate) / 36e5;
    return diffHours < 24;
};

const getBSNLTimestamp = (dateString) => {
    const d = dateString ? new Date(dateString) : new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}${month}${year}`;
};

// --- COMPONENTS ---
const ModalWrapper = ({ children, title, onClose }) => ( 
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
        <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> 
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> 
                <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> 
                <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> 
            </div> 
            <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> 
        </div> 
    </div> 
);

const MapPickHandler = ({ isPicking, onPick }) => { 
    useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); 
    useEffect(() => { 
        const el=document.querySelector('.leaflet-container'); 
        if(el) el.style.cursor=isPicking?'crosshair':'grab'; 
    }, [isPicking]); 
    return null; 
};

const MapUpdater = ({ center }) => { 
    const map = useMap(); 
    useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); 
    return null; 
};

const Dashboard = ({ user, role, onLogout, logAction }) => {
    // 1. STATE DEFINITIONS
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedSpan, setSelectedSpan] = useState('');
    const [selectedRing, setSelectedRing] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [displayPath, setDisplayPath] = useState([]);
    const [isRingView, setIsRingView] = useState(false);
    const [diggingPoints, setDiggingPoints] = useState([]);
    
    const [submittedSurveys, setSubmittedSurveys] = useState([]);
    const [filteredSurveys, setFilteredSurveys] = useState([]);
    const [userRoutes, setUserRoutes] = useState([]);
    
    const [userStatuses, setUserStatuses] = useState([]);
    const [logs, setLogs] = useState([]);
    
    const [showSurveyForm, setShowSurveyForm] = useState(false);
    const [editingSurvey, setEditingSurvey] = useState(null);
    
    // --- NEW STATE FOR VIEW/EDIT MODE ---
    const [isViewMode, setIsViewMode] = useState(false);

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

    useEffect(() => {
        if (!selectedSpan) { 
            setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); 
            return; 
        }
        const data = SPAN_COORDS[selectedSpan];
        if(data) {
            setStartPoint(data.start); 
            setEndPoint(data.end);
            if (selectedRing) {
                const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
                const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
                setIsRingView(true); 
                setDisplayPath(path); 
                setDiggingPoints(generatePointsOnPath(path, 4));
            } else {
                setIsRingView(false); 
                setDisplayPath([data.start, data.end]); 
                setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
            }
        }
    }, [selectedSpan, selectedRing]);

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
        const response = await axios.get(`${API_BASE}/surveys/all`, { 
            params: { page: currentPage, limit: 10 }
        });
        
        const { surveys, pagination } = response.data;
        
        if (Array.isArray(surveys)) {
            const mergedData = surveys.map(s => {
                // 1. Get the media array from backend
                const mFiles = s.mediaFiles || [];

                // 2. Helper to create the View URL
                const getProxyUrl = (path) => {
                    if (!path) return null;
                    return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(path)}&mode=open`;
                };

                // 3. Extract specific files from the array
                const sitePhotoObj = mFiles.find(f => f.type === 'photo');
                const liveVideoObj = mFiles.find(f => f.type === 'video');
                const selfieObj = mFiles.find(f => f.type === 'selfie');
                const goproObj = mFiles.find(f => f.type === 'gopro');

                // 4. Create the object for the Form
                return {
                    ...s,
                    id: s.id,
                    
                    // Map Database Snake_case to CamelCase
                    routeName: s.routeName || s.route_name,
                    locationType: s.locationType || s.location_type,
                    shotNumber: s.shotNumber || s.shot_number,
                    ringNumber: s.ringNumber || s.ring_number,
                    startLocName: s.startLocName || s.start_location,
                    endLocName: s.endLocName || s.end_location,
                    surveyorName: s.surveyor_name,
                    surveyorMobile: s.surveyor_mobile,
                    dateTime: s.survey_date,
                    generatedFileName: s.generated_filename || `SURVEY_${s.id}`,
                    
                    // Parse Coordinates
                    latitude: parseFloat(s.latitude || 0),
                    longitude: parseFloat(s.longitude || 0),

                    // --- CRITICAL FIX: Assign extracted URLs to these exact names ---
                    sitePhoto: sitePhotoObj ? getProxyUrl(sitePhotoObj.url) : null,
                    liveVideo: liveVideoObj ? getProxyUrl(liveVideoObj.url) : null,
                    selfie: selfieObj ? getProxyUrl(selfieObj.url) : null,
                    goproVideo: goproObj ? getProxyUrl(goproObj.url) : null,
                    
                    // Keep original array
                    mediaFiles: mFiles
                };
            });

            console.log("Processed Data:", mergedData); // CHECK THIS IN CONSOLE
            
            const sorted = mergedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setSubmittedSurveys(sorted);
            applyFilters(sorted);
            
            if (pagination) setTotalPages(pagination.totalPages);
            
            // Map Lines
            const lines = [];
            sorted.forEach(s => {
                if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) {
                    const lat = parseFloat(s.latitude);
                    const lng = parseFloat(s.longitude);
                    if (lat && lng) {
                         lines.push({ start: {lat, lng}, end: {lat: lat+0.0001, lng: lng+0.0001}, name: s.routeName });
                    }
                }
            });
            setUserRoutes(lines);
        }
    } catch(e) { console.error("Fetch Error", e); }
}, [applyFilters, currentPage]);
    useEffect(() => {
        refreshData(); 
        if (role === 'admin') {
            setUserStatuses([{ username: 'admin', status: 'Online', loginTime: new Date().toISOString() }]);
            setLogs([{ displayTime: new Date().toLocaleString(), username: 'admin', action: 'LOGIN', details: 'System Access' }]);
        }
    }, [refreshData, role]);

    // const handleSurveySubmit = async (formData) => {
    //     if (!formData || !formData.district) {
    //         alert("District is required");
    //         return;
    //     }

    //     try {
    //         const apiData = new FormData();

    //         const append = (key, value) => {
    //             if (value !== null && value !== undefined && value !== '') {
    //                 apiData.append(key, value);
    //             }
    //         };

    //         append('district', formData.district);
    //         append('block', formData.block);
    //         append('routeName', formData.routeName);
    //         append('locationType', formData.locationType);
    //         append('shotNumber', formData.shotNumber || '0'); 
    //         append('ringNumber', formData.ringNumber || '0');
    //         append('startLocName', formData.startLocName);
    //         append('endLocName', formData.endLocName);
            
    //         let finalFileName = formData.generatedFileName;
    //         if (!finalFileName && formData.district) {
    //              const d = (formData.district || 'UNK').substring(0,3).toUpperCase();
    //              const b = (formData.block || 'UNK').substring(0,3).toUpperCase();
    //              const t = TYPE_CODES[formData.locationType] || 'OTH';
    //              const s = (formData.shotNumber || '1').toString().padStart(2, '0');
    //              finalFileName = `${d}_${b}_${t}_SHOT${s}`;
    //         }
    //         append('fileNamePrefix', finalFileName); 

    //         const userName = (typeof user === 'object' && user.username) ? user.username : user;
    //         const submittedBy = userName || 'admin';
            
    //         append('surveyorName', formData.surveyorName || submittedBy);
    //         append('surveyorMobile', formData.surveyorMobile);
    //         append('submittedBy', submittedBy);
    //         append('dateTime', formData.dateTime || new Date().toISOString());
    //         append('remarks', formData.remarks || '');
    //         append('latitude', formData.latitude);
    //         append('longitude', formData.longitude);

    //         if (formData.sitePhotoBlob instanceof Blob) {
    //             apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
    //         }

    //         if (formData.liveVideoBlob instanceof Blob) {
    //             const ext = formData.liveVideoBlob.type.includes('mp4') ? 'mp4' : 'webm';
    //             apiData.append('videos', formData.liveVideoBlob, `live_video.${ext}`);
    //         }

    //         if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) {
    //             apiData.append('videos', formData.goproBlob, 'gopro_video.mp4');
    //         }

    //         if (formData.selfieBlob instanceof Blob) {
    //             apiData.append('selfie', formData.selfieBlob, 'selfie.jpg');
    //         }

    //         const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    //         let response;

    //         if (editingSurvey && editingSurvey.id) {
    //             // EDIT
    //             response = await axios.put(`${API_BASE}/surveys/${editingSurvey.id}`, apiData, config);
    //         } else {
    //             // CREATE
    //             response = await axios.post(`${API_BASE}/surveys`, apiData, config);
    //         }

    //         if (response.data.success) {
    //             alert("Saved Successfully!");
    //             setShowSurveyForm(false);
    //             setEditingSurvey(null);
    //             refreshData(); 
    //         }

    //     } catch (e) {
    //         console.error("FULL ERROR:", e);
    //         const serverMessage = e.response?.data?.message || e.response?.statusText || "Server Error";
    //         alert(`Failed to save: ${serverMessage}`);
    //     }
    // };
// In Dashboard.js

const handleSurveySubmit = async (formData) => {
    if (!formData || !formData.district) {
        alert("District is required");
        return;
    }

    try {
        const apiData = new FormData();

        // Helper to append data
        const append = (key, value) => {
            if (value !== null && value !== undefined && value !== '') {
                apiData.append(key, value);
            }
        };

        // Append all text fields
        append('district', formData.district);
        append('block', formData.block);
        append('routeName', formData.routeName);
        append('locationType', formData.locationType);
        append('shotNumber', formData.shotNumber || '0'); 
        append('ringNumber', formData.ringNumber || '0');
        append('startLocName', formData.startLocName);
        append('endLocName', formData.endLocName);
        append('fileNamePrefix', formData.generatedFileName); 
        append('surveyorName', formData.surveyorName);
        append('surveyorMobile', formData.surveyorMobile);
        append('submittedBy', user.username || user || 'admin');
        append('dateTime', formData.dateTime || new Date().toISOString());
        append('latitude', formData.latitude);
        append('longitude', formData.longitude);

        // Append Files (Only if they are new Blobs/Files)
        if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
        if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');
        if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) apiData.append('videos', formData.goproBlob, 'gopro_video.mp4');
        if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'selfie.jpg');

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        let response;

        // --- THE FIX IS HERE ---
        // We check if formData has an ID. If yes, it's an UPDATE.
        if (formData.id) {
            console.log("📝 Updating Survey ID:", formData.id);
            response = await axios.put(`${API_BASE}/surveys/${formData.id}`, apiData, config);
        } else {
            console.log("✨ Creating New Survey");
            response = await axios.post(`${API_BASE}/surveys`, apiData, config);
        }

        if (response.data.success) {
            alert("Saved Successfully!");
            setShowSurveyForm(false);
            setEditingSurvey(null);
            refreshData(); // Refresh list to see changes
        }

    } catch (e) {
        console.error("FULL ERROR:", e);
        const serverMessage = e.response?.data?.message || e.response?.statusText || "Server Error";
        alert(`Failed to save: ${serverMessage}`);
    }
};
    const handleDeleteSurvey = async (id) => {
        if(window.confirm("Admin: Permanently delete this record?")) {
            try {
                await axios.delete(`${API_BASE}/surveys/${id}/cancel`); 
                if (typeof logAction === 'function') logAction(user, 'DELETED_DATA', `ID: ${id}`);
                refreshData();
            } catch (e) { console.error(e); alert("Failed to delete."); }
        }
    };

    const fetchBackendFile = async (path, mode = 'open') => {
        try {
            const response = await axios.get(`${API_BASE}/surveys/read-file?path=${encodeURIComponent(path)}&mode=${mode}`, { responseType: 'blob' });
            return response.data; 
        } catch (error) { console.error("File Fetch Error:", error); return null; }
    };

    const handleViewMedia = async (type, survey) => {
        if (!survey.mediaFiles || survey.mediaFiles.length === 0) { alert("No media found on server."); return; }
        const targetType = (type === 'gopro' || type === 'video') ? 'video' : 'photo';
        const fileObj = survey.mediaFiles.find(m => m.type === targetType);
        if (fileObj && fileObj.url) {
            const blob = await fetchBackendFile(fileObj.url, 'open');
            if (blob) {
                const objectUrl = URL.createObjectURL(blob);
                setCurrentMedia({ type, url: objectUrl, blob: blob, filename: `file.${targetType === 'video'?'mp4':'jpg'}`, meta: survey });
            } else { alert("Failed to load file."); }
        } else { alert(`No ${type} found for this survey.`); }
    };

    const handleGoProUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !uploadModalId) return;
        const formData = new FormData();
        formData.append('videos', file); 
        try {
            await axios.put(`${API_BASE}/surveys/${uploadModalId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert("GoPro Uploaded Successfully!");
            setUploadModalId(null);
            refreshData(); 
        } catch (error) { console.error("Upload failed", error); alert("Upload Failed"); }
    };

    const getDetailedFilename = () => {
        if (!currentMedia || !currentMedia.meta) return 'BSNL_Download';
        const { district, block, locationType, shotNumber, dateTime } = currentMedia.meta;
        const d = (district || 'UNK').substring(0, 3).toUpperCase();
        const b = (block || 'UNK').substring(0, 3).toUpperCase();
        const t = TYPE_CODES[locationType] || "OTH";
        const date = getBSNLTimestamp(dateTime);
        return `${d}_${b}_${t}_SHOTNO${shotNumber || '1'}_${date}`;
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
        const metaInfo = `Filename: ${finalName}\nSurveyor: ${currentMedia.meta.surveyorName}`;
        zip.file("details.txt", metaInfo);
        const content = await zip.generateAsync({type:"blob"});
        saveAs(content, `${finalName}.zip`);
    };

    const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
    const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
    const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

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
                    {/* NEW BUTTON: Mode is Edit (false), but Survey is null (new) */}
                    <button onClick={() => { setEditingSurvey(null); setIsViewMode(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
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
                                    {s.mediaFiles?.some(m => m.type === 'video') && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
                                    {s.mediaFiles?.some(m => m.type === 'photo') && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
                                </div>
                            </div>
                        </Popup>
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                            <div style={{textAlign:'left', minWidth: '150px'}}>
                                {isRecent(s.survey_date) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>RECENT</div>}
                                <div style={{fontWeight:'bold', fontSize:'13px', color: '#1a237e'}}>{s.locationType}</div>
                                <div style={{fontSize:'12px', fontWeight:'bold', color:'#007bff', margin: '2px 0'}}>{s.generatedFileName || "No Filename"}</div>
                                <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
                                <div style={{fontSize:'11px', color:'#555'}}>Date: {getBSNLTimestamp(s.survey_date)}</div>
                                <div style={{marginTop:'6px', paddingTop:'4px', borderTop:'1px solid #eee', display:'flex', gap:'8px', fontSize:'11px', fontWeight:'bold'}}>
                                    {s.mediaFiles?.some(m => m.type === 'photo') && <span style={{color:'#2e7d32'}}>[Photo]</span>}
                                    {s.mediaFiles?.some(m => m.type === 'video') && <span style={{color:'#d32f2f'}}>[Video]</span>}
                                    {s.mediaFiles?.some(m => m.type === 'selfie') && <span style={{color:'#f57c00'}}>[Selfie]</span>}
                                </div>
                            </div>
                        </Tooltip>
                    </Marker>
                ))}
                {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
            </MapContainer>

            {showSurveyForm && (
                <SurveyForm 
                    onClose={() => { setShowSurveyForm(false); refreshData(); }} 
                    pickedCoords={pickedCoords} 
                     districts={DATA_HIERARCHY.districts} 
                     blocks={Object.values(DATA_HIERARCHY.blocks)} 
                     onSubmitData={handleSurveySubmit} 
                    user={user} 
                     onPickLocation={handlePickLocationStart} 
                    initialData={editingSurvey} 
                    // PASS VIEW ONLY MODE PROP
                    viewOnly={isViewMode}
                />
            )}
            
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
                        <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b></td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
                            {s.mediaFiles?.some(m => m.type === 'video') && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
                            {s.mediaFiles?.some(m => m.type === 'photo') && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
                        </td><td style={styles.td}>
                            
                            {/* --- UPDATED VIEW BUTTON --- */}
                            <button style={{...styles.actionBtn, background:'#eee', color:'#333'}} 
                                onClick={()=>{ 
                                    setEditingSurvey(s); 
                                    setIsViewMode(true); // SET VIEW MODE
                                    setShowSurveyTable(false); 
                                    setShowSurveyForm(true); 
                                }}>
                                View
                            </button>
                            
                            {/* --- UPDATED EDIT BUTTON --- */}
                            {(role === 'admin' || s.submittedBy === user) && 
                                <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} 
                                    onClick={()=>{ 
                                        setEditingSurvey(s); 
                                        setIsViewMode(false); // SET EDIT MODE
                                        setShowSurveyTable(false); 
                                        setShowSurveyForm(true); 
                                    }}>
                                    Edit
                                </button>
                            }
                            
                            {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}
                        
                        </td></tr>))}</tbody>
                    </table>
                    <div style={{display:'flex', justifyContent:'flex-end', gap:'10px', padding:'15px', alignItems:'center', borderTop:'1px solid #eee'}}>
                        <button style={styles.btnWhite} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
                        <span style={{fontSize:'13px', fontWeight:'bold'}}>Page {currentPage} of {totalPages}</span>
                        <button style={styles.btnWhite} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
                    </div>
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
                                    <tbody>{userStatuses.map((u, i) => (<tr key={i} style={{borderBottom:'1px solid #eee'}}><td style={{padding:'10px', fontWeight:'bold'}}>{u.username}</td><td><span style={{...styles.statusDot, background: u.status==='Online'?'#4caf50':'#9e9e9e'}}></span>{u.status}</td><td style={{fontSize:'12px', color:'#666'}}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                        <div style={{flex:2}}>
                            <div style={styles.adminCard}>
                                <div style={{...styles.adminHeader, display:'flex', justifyContent:'space-between', alignItems:'center'}}><span>System Logs</span><div style={{fontSize:'12px', fontWeight:'normal'}}>Filter: <input type="date" onChange={e => setFilterStart(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/> to <input type="date" onChange={e => setFilterEnd(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/></div></div>
                                <div style={{maxHeight:'400px', overflowY:'auto'}}>
                                    <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
                                        <thead style={{position:'sticky', top:0, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}}><tr><th style={{padding:'10px', textAlign:'left'}}>Time</th><th style={{textAlign:'left'}}>User</th><th style={{textAlign:'left'}}>Action</th><th style={{textAlign:'left'}}>Details</th></tr></thead>
                                        <tbody>{getFilteredLogs().map((l,i) => (<tr key={i} style={{borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa'}}><td style={{padding:'8px', color:'#666', whiteSpace:'nowrap'}}>{l.displayTime}</td><td style={{fontWeight:'bold', color:'#333'}}>{l.username}</td><td style={{color: l.action.includes('DELETED')?'red':'#1565c0'}}>{l.action}</td><td style={{color:'#555'}}>{l.details}</td></tr>))}</tbody>
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
                        {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (<video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />) : (<img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />)}
                        <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
                            <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
                            <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>Download ZIP</button>
                        </div>
                    </div>
                </ModalWrapper>
            )}

            {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>PICKING MODE ACTIVE - Click map</div>}
        </div>
    );
};

export default Dashboard;