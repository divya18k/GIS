
// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import JSZip from 'jszip';
// // // // // // import { saveAs } from 'file-saver';
// // // // // // import GeoCamera from './GeoCamera';
// // // // // // import LocationMap from './LocationMap';

// // // // // // const LOCATION_TYPES = [
// // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // ];

// // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // // --- ABBREVIATION MAPPING ---
// // // // // // const TYPE_CODES = {
// // // // // //     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// // // // // //     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// // // // // //     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // // // // // };

// // // // // // // --- FILENAME GENERATOR (Fixed Backticks) ---
// // // // // // const generateBSNLName = (district, block, type, shotNo) => {
// // // // // //     if (!district || !block || !type) return "BSNL_FILE";

// // // // // //     const distCode = district.substring(0, 3).toUpperCase();
// // // // // //     const blockCode = block.substring(0, 3).toUpperCase();
// // // // // //     const typeCode = TYPE_CODES[type] || "OTH";
    
// // // // // //     const d = new Date();
// // // // // //     // FIXED: Added backticks below
// // // // // //     const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
    
// // // // // //     // FIXED: Added backticks below
// // // // // //     return `${distCode}_${blockCode}_${typeCode}_SHOTNO${shotNo}_${dateStr}`;
// // // // // // };

// // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts = [], blocks = [], onSubmitData, user, initialData, viewOnly }) => {
// // // // // //     const [formData, setFormData] = useState(initialData || {
// // // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // // //     });

// // // // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // // // //     const [cameraMode, setCameraMode] = useState(null);

// // // // // //     // --- STYLES DEFINED INSIDE COMPONENT ---
// // // // // //     const styles = {
// // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
// // // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// // // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
// // // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // // // //         col: { flex: 1, minWidth:'200px' },
// // // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // // //         previewCard: { marginTop:'10px', background:'#fff', padding:'15px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
// // // // // //         mediaWrapper: { position: 'relative', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', marginBottom:'15px' },
// // // // // //         mediaContent: { width: '100%', maxHeight: '350px', objectFit: 'contain', display:'block', background:'#000' },
// // // // // //         fsBtnOverlay: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border:'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 20 },
// // // // // //         gpsInfoSection: { marginBottom: '10px' },
// // // // // //         gpsHeader: { fontSize: '14px', fontWeight: 'bold', color: '#d84315', marginBottom: '4px', display:'flex', alignItems:'center', gap:'5px' },
// // // // // //         gpsValues: { fontSize: '13px', color: '#555', fontFamily: 'monospace', marginLeft:'20px' },
// // // // // //         mapContainer: { height: '200px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd', marginBottom: '15px' },
// // // // // //         downloadRow: { display:'flex', gap:'10px', marginTop:'10px' },
// // // // // //         downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' },
// // // // // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' },
// // // // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' }
// // // // // //     };

// // // // // //     useEffect(() => {
// // // // // //         if (pickedCoords && !viewOnly) {
// // // // // //             setFormData(prev => ({ 
// // // // // //                 ...prev, 
// // // // // //                 latitude: pickedCoords.lat.toFixed(6), 
// // // // // //                 longitude: pickedCoords.lng.toFixed(6),
// // // // // //                 dateTime: new Date().toLocaleString() 
// // // // // //             }));
// // // // // //         }
// // // // // //     }, [pickedCoords, viewOnly]);

// // // // // //     const handleChange = (e) => {
// // // // // //         if (viewOnly) return;
// // // // // //         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
// // // // // //     };

// // // // // //     const handleCameraCapture = (url, blob, capturedCoords) => {
// // // // // //         const updates = {};
// // // // // //         if (capturedCoords && capturedCoords.lat) {
// // // // // //             updates.latitude = capturedCoords.lat.toFixed(6);
// // // // // //             updates.longitude = capturedCoords.lon.toFixed(6);
// // // // // //             updates.dateTime = new Date().toLocaleString();
// // // // // //         }

// // // // // //         if (cameraMode === 'video') {
// // // // // //             updates.liveVideo = url;
// // // // // //             updates.liveVideoBlob = blob;
// // // // // //         } else if (cameraMode === 'photo') {
// // // // // //             updates.sitePhoto = url;
// // // // // //             updates.sitePhotoBlob = blob;
// // // // // //         } else if (cameraMode === 'selfie') {
// // // // // //             updates.selfie = url;
// // // // // //             updates.selfieBlob = blob;
// // // // // //         }
// // // // // //         setFormData(prev => ({ ...prev, ...updates }));
// // // // // //         setShowGeoCamera(false);
// // // // // //     };

// // // // // //     const downloadMedia = (type, isZip) => {
// // // // // //         let blob;
// // // // // //         if (type === 'video') blob = formData.liveVideoBlob;
// // // // // //         else if (type === 'selfie') blob = formData.selfieBlob;
// // // // // //         else blob = formData.sitePhotoBlob;

// // // // // //         if (!blob) { alert("No file to download"); return; }

// // // // // //         const ext = type === 'video' ? 'mp4' : 'jpg'; 
// // // // // //         const finalName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
// // // // // //         const fileNameWithExt = `${finalName}_${type}.${ext}`;

// // // // // //         if (isZip) {
// // // // // //             const zip = new JSZip();
// // // // // //             zip.file(fileNameWithExt, blob);
// // // // // //             const meta = `FILENAME: ${finalName}\nDate: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}\nSurveyor: ${formData.surveyorName}`;
// // // // // //             zip.file("details.txt", meta);
// // // // // //             zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${finalName}.zip`));
// // // // // //         } else {
// // // // // //             saveAs(blob, fileNameWithExt);
// // // // // //         }
// // // // // //     };

// // // // // //     const handleFileChange = (e) => {
// // // // // //         if (e.target.files[0]) {
// // // // // //             setFormData(prev => ({ 
// // // // // //                 ...prev, 
// // // // // //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// // // // // //                 goproBlob: e.target.files[0] 
// // // // // //             }));
// // // // // //         }
// // // // // //     };

// // // // // //     const handleGetGPS = () => {
// // // // // //         if (viewOnly) return;
// // // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // // //             alert("GPS Captured!");
// // // // // //         });
// // // // // //     };

// // // // // //     const handleSubmit = async (e) => {
// // // // // //         e.preventDefault();
// // // // // //         if (viewOnly) return;
// // // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // // // //         const finalFileName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
// // // // // //         onSubmitData({ ...formData, generatedFileName: finalFileName });
// // // // // //     };

// // // // // //     const requestFullscreen = (id) => {
// // // // // //         const elem = document.getElementById(id);
// // // // // //         if (elem) {
// // // // // //             if (elem.requestFullscreen) elem.requestFullscreen();
// // // // // //             else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
// // // // // //         }
// // // // // //     };

// // // // // //     const renderMediaCard = (type, src, blob) => {
// // // // // //         const isVideo = type === 'video';
// // // // // //         const label = isVideo ? "Live Video" : "Site Photo";
// // // // // //         const elementId = `media_${type}`;

// // // // // //         return (
// // // // // //             <div style={styles.previewCard}>
// // // // // //                 <div style={styles.mediaWrapper}>
// // // // // //                     {isVideo ? (
// // // // // //                         <video 
// // // // // //                             id={elementId} 
// // // // // //                             src={src} 
// // // // // //                             controls 
// // // // // //                             playsInline
// // // // // //                             style={styles.mediaContent} 
// // // // // //                         />
// // // // // //                     ) : (
// // // // // //                         <img id={elementId} src={src} alt={label} style={styles.mediaContent} />
// // // // // //                     )}
                    
// // // // // //                     <button type="button" onClick={() => requestFullscreen(elementId)} style={styles.fsBtnOverlay}>
// // // // // //                         <i className="fa-solid fa-expand"></i> Fullscreen
// // // // // //                     </button>
// // // // // //                 </div>

// // // // // //                 <div style={styles.gpsInfoSection}>
// // // // // //                     <div style={styles.gpsHeader}>
// // // // // //                         <i className="fa-solid fa-location-dot"></i> GPS Location
// // // // // //                     </div>
// // // // // //                     <div style={styles.gpsValues}>
// // // // // //                         Lat: {formData.latitude} &nbsp; Lng: {formData.longitude}
// // // // // //                     </div>
// // // // // //                 </div>

// // // // // //                 <div style={styles.mapContainer}>
// // // // // //                     <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
// // // // // //                 </div>

// // // // // //                 <div style={styles.downloadRow}>
// // // // // //                     <button type="button" onClick={()=>downloadMedia(type, false)} style={{...styles.downBtn, background:'#43a047'}}>
// // // // // //                         <i className="fa-solid fa-download"></i> &nbsp; {isVideo ? 'Video' : 'JPG'}
// // // // // //                     </button>
// // // // // //                     <button type="button" onClick={()=>downloadMedia(type, true)} style={{...styles.downBtn, background:'#1976d2'}}>
// // // // // //                         <i className="fa-solid fa-file-zipper"></i> &nbsp; ZIP
// // // // // //                     </button>
// // // // // //                     {!viewOnly && (
// // // // // //                         <button type="button" onClick={()=>setFormData(prev => ({...prev, [isVideo ? 'liveVideo' : 'sitePhoto']: null}))} style={{...styles.downBtn, background:'#d32f2f'}}>
// // // // // //                             <i className="fa-solid fa-trash"></i> &nbsp; Delete
// // // // // //                         </button>
// // // // // //                     )}
// // // // // //                 </div>
// // // // // //             </div>
// // // // // //         );
// // // // // //     };

// // // // // //     const flatBlocks = Array.isArray(blocks) ? blocks.flat() : [];

// // // // // //     return (
// // // // // //         <div style={styles.overlay}>
// // // // // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // // // // //             <div style={styles.container}>
// // // // // //                 <div style={styles.header}>
// // // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // // //                 </div>
                
// // // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // // //                     <div style={styles.row}>
// // // // // //                         <div style={styles.col}>
// // // // // //                             <label style={styles.label}>1. District</label>
// // // // // //                             <select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // //                                 <option value="">Select</option>{districts && districts.map(d=><option key={d}>{d}</option>)}
// // // // // //                             </select>
// // // // // //                         </div>
// // // // // //                         <div style={styles.col}>
// // // // // //                             <label style={styles.label}>2. Block</label>
// // // // // //                             <select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // //                                 <option value="">Select</option>{flatBlocks.map(b=><option key={b}>{b}</option>)}
// // // // // //                             </select>
// // // // // //                         </div>
// // // // // //                     </div>

// // // // // //                     <div style={styles.row}>
// // // // // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // //                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // // // // //                     </div>

// // // // // //                     <div style={styles.row}>
// // // // // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // //                     </div>

// // // // // //                     <div style={styles.row}>
// // // // // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // //                     </div>

// // // // // //                     <div style={styles.locSection}>
// // // // // //                         <label style={styles.label}>8. Location Point</label>
// // // // // //                         {!viewOnly && (
// // // // // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // // // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // // // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // // // //                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
// // // // // //                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
// // // // // //                         </div>
// // // // // //                     </div>

// // // // // //                     <div style={styles.locSection}>
// // // // // //                         <label style={styles.label}>9. Location Type</label>
// // // // // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // // // //                         </select>
// // // // // //                     </div>

// // // // // //                     {/* FILENAME PREVIEW */}
// // // // // //                     <div style={{textAlign:'center', padding:'10px', background:'#e3f2fd', borderRadius:'4px', marginBottom:'15px', border:'1px dashed #2196f3'}}>
// // // // // //                         <small style={{fontWeight:'bold', color:'#1565c0'}}>File Name Preview:</small><br/>
// // // // // //                         <code style={{fontSize:'14px', color:'#333'}}>
// // // // // //                             {generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber)}
// // // // // //                         </code>
// // // // // //                     </div>

// // // // // //                     <div style={styles.locSection}>
// // // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // // // // //                         <div style={{marginBottom:'20px'}}>
// // // // // //                             <label style={styles.label}>Site Photo</label>
// // // // // //                             {formData.sitePhoto ? renderMediaCard('photo', formData.sitePhoto, formData.sitePhotoBlob) : (
// // // // // //                                 !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>📷 Capture Photo</button>
// // // // // //                             )}
// // // // // //                         </div>

// // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // //                             <div style={{marginBottom:'20px'}}>
// // // // // //                                 <label style={styles.label}>Live Video</label>
// // // // // //                                 {formData.liveVideo ? renderMediaCard('video', formData.liveVideo, formData.liveVideoBlob) : (
// // // // // //                                     !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>🎥 Record Video</button>
// // // // // //                                 )}
// // // // // //                             </div>
// // // // // //                         )}

// // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // //                             <div style={{marginTop:'15px'}}>
// // // // // //                                 <label style={styles.label}>GoPro Upload (Optional)</label>
// // // // // //                                 {viewOnly ? (
// // // // // //                                     <div style={{padding:'10px', background:'#e9ecef', borderRadius:'4px', color:'#555', fontSize:'13px', textAlign:'center'}}>{formData.goproVideo ? "✅ GoPro Video Available" : "No GoPro Video Uploaded"}</div>
// // // // // //                                 ) : (
// // // // // //                                     <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
// // // // // //                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro File"}
// // // // // //                                         <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // // // //                                     </label>
// // // // // //                                 )}
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                     </div>

// // // // // //                     <div style={styles.locSection}>
// // // // // //                         <div style={styles.row}>
// // // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // //                         </div>
                        
// // // // // //                         <div style={{marginTop:'15px'}}>
// // // // // //                             <label style={styles.label}>Team Selfie</label>
// // // // // //                             {formData.selfie ? (
// // // // // //                                 <div style={styles.previewCard}>
// // // // // //                                     <div style={{position:'relative'}}>
// // // // // //                                         <img id="selfieImg" src={formData.selfie} alt="Selfie" style={{width:'100%', borderRadius:'4px', maxHeight:'180px', objectFit:'cover'}} />
// // // // // //                                         <div onClick={() => requestFullscreen('selfieImg')} style={styles.fullScreenBtn}>⛶ Fullscreen</div>
// // // // // //                                     </div>
// // // // // //                                     <div style={styles.downloadRow}>
// // // // // //                                         <button type="button" onClick={()=>downloadMedia('selfie', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
// // // // // //                                         <button type="button" onClick={()=>downloadMedia('selfie', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // // // // //                                         {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, selfie:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // // // // //                                     </div>
// // // // // //                                 </div>
// // // // // //                             ) : (
// // // // // //                                 !viewOnly && <button type="button" style={{...styles.btn, background: '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>🤳 Take Team Selfie</button>
// // // // // //                             )}
// // // // // //                         </div>
// // // // // //                     </div>

// // // // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
                    
// // // // // //                     <button type="button" onClick={onClose} style={{...styles.btn, background:'#555', marginTop:'10px'}}>CLOSE</button>
// // // // // //                 </form>
// // // // // //             </div>
// // // // // //         </div>
// // // // // //     );
// // // // // // };

// // // // // // export default SurveyForm;


// // // // // import React, { useState, useEffect } from 'react';
// // // // // import JSZip from 'jszip';
// // // // // import { saveAs } from 'file-saver';
// // // // // import GeoCamera from './GeoCamera';
// // // // // import LocationMap from './LocationMap'; // Ensure this is the file I provided previously

// // // // // const LOCATION_TYPES = [
// // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // ];

// // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // const TYPE_CODES = {
// // // // //     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// // // // //     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// // // // //     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // // // // };

// // // // // const generateBSNLName = (district, block, type, shotNo) => {
// // // // //     if (!district || !block || !type) return "BSNL_FILE";
// // // // //     const distCode = district.substring(0, 3).toUpperCase();
// // // // //     const blockCode = block.substring(0, 3).toUpperCase();
// // // // //     const typeCode = TYPE_CODES[type] || "OTH";
// // // // //     const d = new Date();
// // // // //     const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
// // // // //     return `${distCode}_${blockCode}_${typeCode}_SHOTNO${shotNo}_${dateStr}`;
// // // // // };

// // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts = [], blocks = [], onSubmitData, user, initialData, viewOnly }) => {
// // // // //     const [formData, setFormData] = useState(initialData || {
// // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // //     });

// // // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // // //     const [cameraMode, setCameraMode] = useState(null);

// // // // //     const isEditMode = !viewOnly && !!initialData;

// // // // //     // --- STYLES ---
// // // // //     const styles = {
// // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
// // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
// // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // // //         col: { flex: 1, minWidth:'200px' },
// // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // //         readOnlyInput: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#e9ecef', fontSize:'14px', boxSizing:'border-box', color: '#555' },
// // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // //         previewCard: { marginTop:'10px', background:'#fff', padding:'15px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
// // // // //         mediaWrapper: { position: 'relative', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', marginBottom:'5px' },
// // // // //         mediaContent: { width: '100%', maxHeight: '350px', objectFit: 'contain', display:'block', background:'#000' },
// // // // //         fsBtnOverlay: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border:'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 20 },
// // // // //         mapContainer: { height: '250px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd', marginTop: '15px' },
// // // // //         downloadRow: { display:'flex', gap:'10px', marginTop:'5px' },
// // // // //         downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' },
// // // // //         btn: { padding:'10px', borderRadius:'4px', cursor: 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' },
// // // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // // //         emptyBox: { padding: '30px', textAlign: 'center', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '4px', color: '#888', fontStyle: 'italic' }
// // // // //     };

// // // // //     useEffect(() => {
// // // // //         if (pickedCoords && !viewOnly && !isEditMode) {
// // // // //             setFormData(prev => ({ 
// // // // //                 ...prev, 
// // // // //                 latitude: pickedCoords.lat.toFixed(6), 
// // // // //                 longitude: pickedCoords.lng.toFixed(6),
// // // // //                 dateTime: new Date().toLocaleString() 
// // // // //             }));
// // // // //         }
// // // // //     }, [pickedCoords, viewOnly, isEditMode]);

// // // // //     const handleChange = (e) => {
// // // // //         if (viewOnly) return;
// // // // //         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
// // // // //     };

// // // // //     const handleCameraCapture = (url, blob, capturedCoords) => {
// // // // //         const updates = {};
// // // // //         if (capturedCoords && capturedCoords.lat) {
// // // // //             updates.latitude = capturedCoords.lat.toFixed(6);
// // // // //             updates.longitude = capturedCoords.lon.toFixed(6);
// // // // //             updates.dateTime = new Date().toLocaleString();
// // // // //         }

// // // // //         if (cameraMode === 'video') {
// // // // //             updates.liveVideo = url;
// // // // //             updates.liveVideoBlob = blob;
// // // // //         } else if (cameraMode === 'photo') {
// // // // //             updates.sitePhoto = url;
// // // // //             updates.sitePhotoBlob = blob;
// // // // //         } else if (cameraMode === 'selfie') {
// // // // //             updates.selfie = url;
// // // // //             updates.selfieBlob = blob;
// // // // //         }
// // // // //         setFormData(prev => ({ ...prev, ...updates }));
// // // // //         setShowGeoCamera(false);
// // // // //     };

// // // // //     const downloadMedia = (type, isZip) => {
// // // // //         let blob;
// // // // //         if (type === 'video') blob = formData.liveVideoBlob;
// // // // //         else if (type === 'selfie') blob = formData.selfieBlob;
// // // // //         else blob = formData.sitePhotoBlob;

// // // // //         // If no blob (view mode from server), we can't zip easily on client without fetching, 
// // // // //         // so for view mode we rely on direct download if blob is missing, or alert.
// // // // //         if (!blob && !initialData) { alert("No file to download"); return; }

// // // // //         // If we have a URL but no Blob (View Mode), standard saveAs handles URL
// // // // //         const url = type === 'video' ? formData.liveVideo : (type === 'selfie' ? formData.selfie : formData.sitePhoto);

// // // // //         if (!blob && url) {
// // // // //             saveAs(url, `download.${type === 'video' ? 'mp4' : 'jpg'}`);
// // // // //             return;
// // // // //         }

// // // // //         const ext = type === 'video' ? 'mp4' : 'jpg'; 
// // // // //         const finalName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
// // // // //         const fileNameWithExt = `${finalName}_${type}.${ext}`;

// // // // //         if (isZip) {
// // // // //             const zip = new JSZip();
// // // // //             zip.file(fileNameWithExt, blob);
// // // // //             const meta = `FILENAME: ${finalName}\nDate: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}\nSurveyor: ${formData.surveyorName}`;
// // // // //             zip.file("details.txt", meta);
// // // // //             zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${finalName}.zip`));
// // // // //         } else {
// // // // //             saveAs(blob, fileNameWithExt);
// // // // //         }
// // // // //     };

// // // // //     const handleFileChange = (e) => {
// // // // //         if (e.target.files[0]) {
// // // // //             setFormData(prev => ({ 
// // // // //                 ...prev, 
// // // // //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// // // // //                 goproBlob: e.target.files[0] 
// // // // //             }));
// // // // //         }
// // // // //     };

// // // // //     const handleGetGPS = () => {
// // // // //         if (viewOnly || isEditMode) return; 
// // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // //             alert("GPS Captured!");
// // // // //         });
// // // // //     };

// // // // //     const handleSubmit = async (e) => {
// // // // //         e.preventDefault();
// // // // //         if (viewOnly) return;
// // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("Live Video Required"); return; }
// // // // //         if (!formData.sitePhoto && !initialData) { alert("Live Photo Required"); return; }
        
// // // // //         const finalFileName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
// // // // //         onSubmitData({ ...formData, generatedFileName: finalFileName });
// // // // //     };

// // // // //     const requestFullscreen = (id) => {
// // // // //         const elem = document.getElementById(id);
// // // // //         if (elem) {
// // // // //             if (elem.requestFullscreen) elem.requestFullscreen();
// // // // //             else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
// // // // //         }
// // // // //     };

// // // // //     const renderMediaCard = (type, src) => {
// // // // //         const isVideo = type === 'video';
// // // // //         const label = isVideo ? "Live Video" : "Site Photo";
// // // // //         const elementId = `media_${type}`;
// // // // //         const canDelete = !viewOnly && !isEditMode;

// // // // //         return (
// // // // //             <div style={styles.previewCard}>
// // // // //                 <div style={styles.mediaWrapper}>
// // // // //                     {isVideo ? (
// // // // //                         <video id={elementId} src={src} controls playsInline style={styles.mediaContent} />
// // // // //                     ) : (
// // // // //                         <img id={elementId} src={src} alt={label} style={styles.mediaContent} />
// // // // //                     )}
// // // // //                     <button type="button" onClick={() => requestFullscreen(elementId)} style={styles.fsBtnOverlay}>Fullscreen</button>
// // // // //                 </div>
                
// // // // //                 <div style={styles.downloadRow}>
// // // // //                     <button type="button" onClick={()=>downloadMedia(type, false)} style={{...styles.downBtn, background:'#43a047'}}>Download</button>
// // // // //                     {!viewOnly && <button type="button" onClick={()=>downloadMedia(type, true)} style={{...styles.downBtn, background:'#1976d2'}}>ZIP</button>}
// // // // //                     {canDelete && (
// // // // //                         <button type="button" onClick={()=>setFormData(prev => ({...prev, [isVideo ? 'liveVideo' : 'sitePhoto']: null}))} style={{...styles.downBtn, background:'#d32f2f'}}>Delete</button>
// // // // //                     )}
// // // // //                 </div>
// // // // //             </div>
// // // // //         );
// // // // //     };

// // // // //     const flatBlocks = Array.isArray(blocks) ? blocks.flat() : [];

// // // // //     return (
// // // // //         <div style={styles.overlay}>
// // // // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // // // //             <div style={styles.container}>
// // // // //                 <div style={styles.header}>
// // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // //                 </div>
                
// // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // //                     {/* ... (Fields 1-7 same as before) ... */}
// // // // //                     <div style={styles.row}>
// // // // //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={viewOnly || isEditMode ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditMode} required><option value="">Select</option>{districts && districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // // //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={viewOnly || isEditMode ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditMode} required><option value="">Select</option>{flatBlocks.map(b=><option key={b}>{b}</option>)}</select></div>
// // // // //                     </div>
// // // // //                     <div style={styles.row}>
// // // // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                         <div style={styles.col}><label style={styles.label}>4. Date</label><input value={formData.dateTime} readOnly style={styles.readOnlyInput} /></div>
// // // // //                     </div>
// // // // //                     <div style={styles.row}>
// // // // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                     </div>
// // // // //                     <div style={styles.row}>
// // // // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                     </div>

// // // // //                     {/* MOVED MAP HERE SO IT ALWAYS SHOWS */}
// // // // //                     <div style={styles.locSection}>
// // // // //                         <label style={styles.label}>8. Location Point</label>
// // // // //                         {!viewOnly && !isEditMode && (
// // // // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // // //                             </div>
// // // // //                         )}
// // // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // // //                             <input value={formData.latitude} readOnly style={styles.readOnlyInput} placeholder="Lat" />
// // // // //                             <input value={formData.longitude} readOnly style={styles.readOnlyInput} placeholder="Lng" />
// // // // //                         </div>
                        
// // // // //                         {/* MAP IS NOW HERE - VISIBLE EVEN WITHOUT PHOTO */}
// // // // //                         <div style={styles.mapContainer}>
// // // // //                 <LocationMap 
// // // // //                     lat={parseFloat(formData.latitude || 0)} 
// // // // //                     lng={parseFloat(formData.longitude || 0)} 
// // // // //                 />
// // // // //             </div>
// // // // //                     </div>

// // // // //                     <div style={styles.locSection}>
// // // // //                         <label style={styles.label}>9. Location Type</label>
// // // // //                         <select name="locationType" value={formData.locationType} style={viewOnly ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // // //                         </select>
// // // // //                     </div>

// // // // //                     <div style={{textAlign:'center', padding:'10px', background:'#e3f2fd', borderRadius:'4px', marginBottom:'15px', border:'1px dashed #2196f3'}}>
// // // // //                         <small style={{fontWeight:'bold', color:'#1565c0'}}>File Name Preview:</small><br/>
// // // // //                         <code style={{fontSize:'14px', color:'#333'}}>
// // // // //                             {generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber)}
// // // // //                         </code>
// // // // //                     </div>

// // // // //                     <div style={styles.locSection}>
// // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // // // //                         <div style={{marginBottom:'20px'}}>
// // // // //                             <label style={styles.label}>Site Photo</label>
// // // // //                             {formData.sitePhoto ? renderMediaCard('photo', formData.sitePhoto) : (
// // // // //                                 !viewOnly && !isEditMode ? 
// // // // //                                 <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>Capture Photo</button>
// // // // //                                 : <div style={styles.emptyBox}>No Site Photo Available</div>
// // // // //                             )}
// // // // //                         </div>

// // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // //                             <div style={{marginBottom:'20px'}}>
// // // // //                                 <label style={styles.label}>Live Video</label>
// // // // //                                 {formData.liveVideo ? renderMediaCard('video', formData.liveVideo) : (
// // // // //                                     !viewOnly && !isEditMode ?
// // // // //                                     <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>Record Video</button>
// // // // //                                     : <div style={styles.emptyBox}>No Live Video Available</div>
// // // // //                                 )}
// // // // //                             </div>
// // // // //                         )}

// // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // //                             <div style={{marginTop:'15px'}}>
// // // // //                                 <label style={styles.label}>GoPro Upload</label>
// // // // //                                 {formData.goproVideo ? (
// // // // //                                     <div style={{padding:'10px', background:'#e8f5e9', border:'1px solid #c8e6c9', borderRadius:'4px', color:'#2e7d32'}}>
// // // // //                                         ✅ GoPro Video Available
// // // // //                                     </div>
// // // // //                                 ) : (
// // // // //                                     !viewOnly ? (
// // // // //                                         <label style={{...styles.mediaBtn, background:'#0288d1', color:'white'}}>
// // // // //                                             Upload GoPro File <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // // //                                         </label>
// // // // //                                     ) : <div style={styles.emptyBox}>No GoPro Video</div>
// // // // //                                 )}
// // // // //                             </div>
// // // // //                         )}
// // // // //                     </div>

// // // // //                     <div style={styles.locSection}>
// // // // //                         <div style={styles.row}>
// // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                         </div>
                        
// // // // //                         <div style={{marginTop:'15px'}}>
// // // // //                             <label style={styles.label}>Team Selfie</label>
// // // // //                             {formData.selfie ? (
// // // // //                                 <div style={styles.previewCard}>
// // // // //                                     <img src={formData.selfie} alt="Selfie" style={{width:'100%', borderRadius:'4px', maxHeight:'200px', objectFit:'contain'}} />
// // // // //                                     {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, selfie:null})} style={{...styles.downBtn, background:'#d32f2f', marginTop:'5px'}}>Delete</button>}
// // // // //                                 </div>
// // // // //                             ) : (
// // // // //                                 !viewOnly ? 
// // // // //                                 <button type="button" style={{...styles.btn, background: '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>Take Team Selfie</button>
// // // // //                                 : <div style={styles.emptyBox}>No Selfie Available</div>
// // // // //                             )}
// // // // //                         </div>
// // // // //                     </div>

// // // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
// // // // //                     <button type="button" onClick={onClose} style={{...styles.btn, background:'#555', marginTop:'10px'}}>CLOSE</button>
// // // // //                 </form>
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };

// // // // // export default SurveyForm;

// // // // import React, { useState, useEffect } from 'react';
// // // // import JSZip from 'jszip';
// // // // import { saveAs } from 'file-saver';
// // // // import GeoCamera from './GeoCamera';
// // // // import LocationMap from './LocationMap'; // Ensure this file exists

// // // // const LOCATION_TYPES = [
// // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // ];

// // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // const TYPE_CODES = {
// // // //     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// // // //     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// // // //     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // // // };

// // // // const generateBSNLName = (district, block, type, shotNo) => {
// // // //     if (!district || !block || !type) return "BSNL_FILE";
// // // //     const distCode = district.substring(0, 3).toUpperCase();
// // // //     const blockCode = block.substring(0, 3).toUpperCase();
// // // //     const typeCode = TYPE_CODES[type] || "OTH";
// // // //     const d = new Date();
// // // //     const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
// // // //     return `${distCode}_${blockCode}_${typeCode}_SHOTNO${shotNo}_${dateStr}`;
// // // // };

// // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts = [], blocks = [], onSubmitData, user, initialData, viewOnly }) => {
// // // //     const [formData, setFormData] = useState(initialData || {
// // // //         id: null,
// // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // //         surveyorName: user || '', surveyorMobile: '',
// // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // //     });

// // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // //     const [cameraMode, setCameraMode] = useState(null);

// // // //     const isEditMode = !viewOnly && !!initialData;

// // // //     // --- STYLES ---
// // // //     const styles = {
// // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
// // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
// // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // //         col: { flex: 1, minWidth:'200px' },
// // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
// // // //         readOnlyInput: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#e9ecef', fontSize:'14px', boxSizing:'border-box', color: '#555' },
// // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
// // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // //         previewCard: { marginTop:'10px', background:'#fff', padding:'15px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
// // // //         mediaWrapper: { position: 'relative', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', marginBottom:'5px' },
// // // //         mediaContent: { width: '100%', maxHeight: '350px', objectFit: 'contain', display:'block', background:'#000' },
// // // //         fsBtnOverlay: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border:'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 20 },
// // // //         mapContainer: { height: '250px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd', marginTop: '15px' },
// // // //         downloadRow: { display:'flex', gap:'10px', marginTop:'5px' },
// // // //         downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' },
// // // //         btn: { padding:'10px', borderRadius:'4px', cursor: 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' },
// // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // //         emptyBox: { padding: '30px', textAlign: 'center', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '4px', color: '#888', fontStyle: 'italic' }
// // // //     };

// // // //     useEffect(() => {
// // // //         if (pickedCoords && !viewOnly && !isEditMode) {
// // // //             setFormData(prev => ({ 
// // // //                 ...prev, 
// // // //                 latitude: pickedCoords.lat.toFixed(6), 
// // // //                 longitude: pickedCoords.lng.toFixed(6),
// // // //                 dateTime: new Date().toLocaleString() 
// // // //             }));
// // // //         }
// // // //     }, [pickedCoords, viewOnly, isEditMode]);

// // // //     const handleChange = (e) => {
// // // //         if (viewOnly) return;
// // // //         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
// // // //     };

// // // //     const handleCameraCapture = (url, blob, capturedCoords) => {
// // // //         const updates = {};
// // // //         if (capturedCoords && capturedCoords.lat) {
// // // //             updates.latitude = capturedCoords.lat.toFixed(6);
// // // //             updates.longitude = capturedCoords.lon.toFixed(6);
// // // //             updates.dateTime = new Date().toLocaleString();
// // // //         }

// // // //         if (cameraMode === 'video') {
// // // //             updates.liveVideo = url;
// // // //             updates.liveVideoBlob = blob;
// // // //         } else if (cameraMode === 'photo') {
// // // //             updates.sitePhoto = url;
// // // //             updates.sitePhotoBlob = blob;
// // // //         } else if (cameraMode === 'selfie') {
// // // //             updates.selfie = url;
// // // //             updates.selfieBlob = blob;
// // // //         }
// // // //         setFormData(prev => ({ ...prev, ...updates }));
// // // //         setShowGeoCamera(false);
// // // //     };

// // // //     const downloadMedia = (type, isZip) => {
// // // //         let blob;
// // // //         let url;

// // // //         if (type === 'video') { blob = formData.liveVideoBlob; url = formData.liveVideo; }
// // // //         else if (type === 'gopro') { blob = formData.goproBlob; url = formData.goproVideo; }
// // // //         else if (type === 'selfie') { blob = formData.selfieBlob; url = formData.selfie; }
// // // //         else { blob = formData.sitePhotoBlob; url = formData.sitePhoto; }

// // // //         if (!blob && !url) { alert("No file to download"); return; }

// // // //         const isVideo = (type === 'video' || type === 'gopro');
// // // //         const ext = isVideo ? 'mp4' : 'jpg'; 
// // // //         const finalName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
        
// // // //         let suffix = "";
// // // //         if (type === 'gopro') suffix = "_GOPRO";
// // // //         else if (type === 'selfie') suffix = "_SELFIE";
        
// // // //         const fileNameWithExt = `${finalName}${suffix}.${ext}`;

// // // //         if (isZip) {
// // // //             const zip = new JSZip();
// // // //             if (blob) {
// // // //                 zip.file(fileNameWithExt, blob);
// // // //             } else {
// // // //                 saveAs(url, fileNameWithExt);
// // // //                 return;
// // // //             }
// // // //             const meta = `FILENAME: ${finalName}\nDate: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}\nSurveyor: ${formData.surveyorName}`;
// // // //             zip.file("details.txt", meta);
// // // //             zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${finalName}.zip`));
// // // //         } else {
// // // //             if (blob) saveAs(blob, fileNameWithExt);
// // // //             else saveAs(url, fileNameWithExt);
// // // //         }
// // // //     };

// // // //     const handleFileChange = (e) => {
// // // //         if (e.target.files[0]) {
// // // //             setFormData(prev => ({ 
// // // //                 ...prev, 
// // // //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// // // //                 goproBlob: e.target.files[0] 
// // // //             }));
// // // //         }
// // // //     };

// // // //     const handleGetGPS = () => {
// // // //         if (viewOnly || isEditMode) return; 
// // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // //             alert("GPS Captured!");
// // // //         });
// // // //     };

// // // //     const handleSubmit = async (e) => {
// // // //         e.preventDefault();
// // // //         if (viewOnly) return;
// // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("Live Video Required"); return; }
// // // //         if (!formData.sitePhoto && !initialData) { alert("Live Photo Required"); return; }
        
// // // //         const finalFileName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
// // // //         onSubmitData({ ...formData, generatedFileName: finalFileName,
// // // //         id: initialData ? initialData.id : null });
// // // //     };

// // // //     const requestFullscreen = (id) => {
// // // //         const elem = document.getElementById(id);
// // // //         if (elem) {
// // // //             if (elem.requestFullscreen) elem.requestFullscreen();
// // // //             else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
// // // //         }
// // // //     };

// // // //     // --- RENDER MEDIA CARD ---
// // // //     const renderMediaCard = (type, src) => {
// // // //         const isVideo = (type === 'video' || type === 'gopro');
// // // //         const label = type === 'video' ? "Live Video" : (type === 'gopro' ? "GoPro Video" : (type === 'selfie' ? "Team Selfie" : "Site Photo"));
// // // //         const elementId = `media_${type}`;
// // // //         const canDelete = !viewOnly && !isEditMode;
        
// // // //         // LOGIC: Show Map only for Site Photo ('photo') and Live Video ('video')
// // // //         // Hide map for GoPro ('gopro') and Selfie ('selfie')
// // // //         const showPreviewMap = type !== 'gopro' && type !== 'selfie';

// // // //         return (
// // // //             <div style={styles.previewCard}>
// // // //                 {/* 1. MEDIA DISPLAY */}
// // // //                 <div style={styles.mediaWrapper}>
// // // //                     {isVideo ? (
// // // //                         <video id={elementId} src={src} controls playsInline style={styles.mediaContent} />
// // // //                     ) : (
// // // //                         <img id={elementId} src={src} alt={label} style={styles.mediaContent} />
// // // //                     )}
// // // //                     <button type="button" onClick={() => requestFullscreen(elementId)} style={styles.fsBtnOverlay}>Fullscreen</button>
// // // //                 </div>

// // // //                 {/* 2. PREVIEW MAP INSIDE THE CARD (Conditional) */}
// // // //                 {showPreviewMap && (
// // // //                     <div style={{ marginTop: '10px', marginBottom: '5px' }}>
// // // //                         <div style={{fontSize:'11px', fontWeight:'bold', color:'#555', marginBottom:'3px'}}>Captured Location:</div>
// // // //                         <div style={{ height: '150px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
// // // //                             <LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} />
// // // //                         </div>
// // // //                     </div>
// // // //                 )}
                
// // // //                 {/* 3. DOWNLOAD BUTTONS */}
// // // //                 <div style={styles.downloadRow}>
// // // //                     <button type="button" onClick={()=>downloadMedia(type, false)} style={{...styles.downBtn, background:'#43a047'}}>
// // // //                          Download {isVideo ? 'MP4' : 'JPG'}
// // // //                     </button>
                    
// // // //                     <button type="button" onClick={()=>downloadMedia(type, true)} style={{...styles.downBtn, background:'#1976d2'}}>
// // // //                          Download ZIP
// // // //                     </button>
                    
// // // //                     {canDelete && (
// // // //                         <button type="button" onClick={()=>setFormData(prev => ({...prev, [type === 'video' ? 'liveVideo' : (type === 'gopro' ? 'goproVideo' : (type === 'selfie' ? 'selfie' : 'sitePhoto'))]: null}))} style={{...styles.downBtn, background:'#d32f2f'}}>
// // // //                             Delete
// // // //                         </button>
// // // //                     )}
// // // //                 </div>
// // // //             </div>
// // // //         );
// // // //     };

// // // //     const flatBlocks = Array.isArray(blocks) ? blocks.flat() : [];

// // // //     return (
// // // //         <div style={styles.overlay}>
// // // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // // //             <div style={styles.container}>
// // // //                 <div style={styles.header}>
// // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // //                 </div>
                
// // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={viewOnly || isEditMode ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditMode} required><option value="">Select</option>{districts && districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={viewOnly || isEditMode ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditMode} required><option value="">Select</option>{flatBlocks.map(b=><option key={b}>{b}</option>)}</select></div>
// // // //                     </div>
// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                         <div style={styles.col}><label style={styles.label}>4. Date</label><input value={formData.dateTime} readOnly style={styles.readOnlyInput} /></div>
// // // //                     </div>
// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                     </div>
// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                     </div>

// // // //                     <div style={styles.locSection}>
// // // //                         <label style={styles.label}>8. Location Point</label>
// // // //                         {!viewOnly && !isEditMode && (
// // // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // //                             </div>
// // // //                         )}
// // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // //                             <input value={formData.latitude} readOnly style={styles.readOnlyInput} placeholder="Lat" />
// // // //                             <input value={formData.longitude} readOnly style={styles.readOnlyInput} placeholder="Lng" />
// // // //                         </div>
// // // //                         <div style={styles.mapContainer}>
// // // //                             <LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} />
// // // //                         </div>
// // // //                     </div>

// // // //                     <div style={styles.locSection}>
// // // //                         <label style={styles.label}>9. Location Type</label>
// // // //                         <select name="locationType" value={formData.locationType} style={viewOnly ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // //                         </select>
// // // //                     </div>

// // // //                     <div style={{textAlign:'center', padding:'10px', background:'#e3f2fd', borderRadius:'4px', marginBottom:'15px', border:'1px dashed #2196f3'}}>
// // // //                         <small style={{fontWeight:'bold', color:'#1565c0'}}>File Name Preview:</small><br/>
// // // //                         <code style={{fontSize:'14px', color:'#333'}}>
// // // //                             {generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber)}
// // // //                         </code>
// // // //                     </div>

// // // //                     <div style={styles.locSection}>
// // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // // //                         <div style={{marginBottom:'20px'}}>
// // // //                             <label style={styles.label}>Site Photo</label>
// // // //                             {formData.sitePhoto ? renderMediaCard('photo', formData.sitePhoto) : (
// // // //                                 !viewOnly && !isEditMode ? 
// // // //                                 <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>Capture Photo</button>
// // // //                                 : <div style={styles.emptyBox}>No Site Photo Available</div>
// // // //                             )}
// // // //                         </div>

// // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // //                             <div style={{marginBottom:'20px'}}>
// // // //                                 <label style={styles.label}>Live Video</label>
// // // //                                 {formData.liveVideo ? renderMediaCard('video', formData.liveVideo) : (
// // // //                                     !viewOnly && !isEditMode ?
// // // //                                     <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>Record Video</button>
// // // //                                     : <div style={styles.emptyBox}>No Live Video Available</div>
// // // //                                 )}
// // // //                             </div>
// // // //                         )}

// // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // //                             <div style={{marginTop:'15px'}}>
// // // //                                 <label style={styles.label}>GoPro Upload</label>
// // // //                                 {formData.goproVideo ? (
// // // //                                     renderMediaCard('gopro', formData.goproVideo)
// // // //                                 ) : (
// // // //                                     !viewOnly ? (
// // // //                                         <label style={{...styles.mediaBtn, background:'#0288d1', color:'white'}}>
// // // //                                             Upload GoPro File <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // //                                         </label>
// // // //                                     ) : <div style={styles.emptyBox}>No GoPro Video Available</div>
// // // //                                 )}
// // // //                             </div>
// // // //                         )}
// // // //                     </div>

// // // //                     <div style={styles.locSection}>
// // // //                         <div style={styles.row}>
// // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                         </div>
                        
// // // //                         <div style={{marginTop:'15px'}}>
// // // //                             <label style={styles.label}>Team Selfie</label>
// // // //                             {formData.selfie ? (
// // // //                                 renderMediaCard('selfie', formData.selfie)
// // // //                             ) : (
// // // //                                 !viewOnly ? 
// // // //                                 <button type="button" style={{...styles.btn, background: '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>Take Team Selfie</button>
// // // //                                 : <div style={styles.emptyBox}>No Selfie Available</div>
// // // //                             )}
// // // //                         </div>
// // // //                     </div>

// // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
// // // //                     <button type="button" onClick={onClose} style={{...styles.btn, background:'#555', marginTop:'10px'}}>CLOSE</button>
// // // //                 </form>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };

// // // // export default SurveyForm;



// // // import React, { useState, useEffect } from 'react';
// // // import JSZip from 'jszip';
// // // import { saveAs } from 'file-saver';
// // // import GeoCamera from './GeoCamera';
// // // import LocationMap from './LocationMap'; 

// // // const LOCATION_TYPES = [
// // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // ];

// // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // const TYPE_CODES = {
// // //     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// // //     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// // //     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // // };

// // // const generateBSNLName = (district, block, type, shotNo) => {
// // //     if (!district || !block || !type) return "BSNL_FILE";
// // //     const distCode = district.substring(0, 3).toUpperCase();
// // //     const blockCode = block.substring(0, 3).toUpperCase();
// // //     const typeCode = TYPE_CODES[type] || "OTH";
// // //     const d = new Date();
// // //     const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
// // //     return `${distCode}_${blockCode}_${typeCode}_SHOTNO${shotNo}_${dateStr}`;
// // // };

// // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts = [], blocks = [], onSubmitData, user, initialData, viewOnly }) => {
// // //     const [formData, setFormData] = useState(initialData || {
// // //         id: null,
// // //         district: '', block: '', routeName: '', dateTime: '', 
// // //         startLocName: '', endLocName: '', ringNumber: '', 
// // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // //         surveyorName: user || '', surveyorMobile: '',
// // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // //     });

// // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // //     const [cameraMode, setCameraMode] = useState(null);

// // //     // --- MODES ---
// // //     // 1. New Entry: Not View Only AND No Initial Data
// // //     const isNewEntry = !viewOnly && !initialData;
// // //     // 2. Edit Existing: Not View Only BUT Has Initial Data
// // //     const isEditExisting = !viewOnly && !!initialData;

// // //     const styles = {
// // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
// // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
// // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // //         col: { flex: 1, minWidth:'200px' },
// // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
// // //         readOnlyInput: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#e9ecef', fontSize:'14px', boxSizing:'border-box', color: '#555' },
// // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
// // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // //         previewCard: { marginTop:'10px', background:'#fff', padding:'15px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
// // //         mediaWrapper: { position: 'relative', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', marginBottom:'5px' },
// // //         mediaContent: { width: '100%', maxHeight: '350px', objectFit: 'contain', display:'block', background:'#000' },
// // //         fsBtnOverlay: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border:'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 20 },
// // //         mapContainer: { height: '250px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd', marginTop: '15px' },
// // //         downloadRow: { display:'flex', gap:'10px', marginTop:'5px' },
// // //         downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' },
// // //         btn: { padding:'10px', borderRadius:'4px', cursor: 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' },
// // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // //         emptyBox: { padding: '30px', textAlign: 'center', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '4px', color: '#888', fontStyle: 'italic' }
// // //     };

// // //     // 1. Handle Map Picking
// // //     useEffect(() => {
// // //         if (pickedCoords && isNewEntry) {
// // //             setFormData(prev => ({ 
// // //                 ...prev, 
// // //                 latitude: pickedCoords.lat.toFixed(6), 
// // //                 longitude: pickedCoords.lng.toFixed(6),
// // //                 dateTime: new Date().toLocaleString() 
// // //             }));
// // //         }
// // //     }, [pickedCoords, isNewEntry]);

// // //     // 2. AUTO-GET REAL TIME LOCATION (Only for New Entry & if empty)
// // //     useEffect(() => {
// // //         if (isNewEntry && !formData.latitude && !pickedCoords) {
// // //             navigator.geolocation.getCurrentPosition((pos) => {
// // //                 setFormData(prev => ({ 
// // //                     ...prev, 
// // //                     latitude: pos.coords.latitude.toFixed(6), 
// // //                     longitude: pos.coords.longitude.toFixed(6), 
// // //                     dateTime: new Date().toLocaleString() 
// // //                 }));
// // //             }, (err) => console.warn("Auto GPS failed", err));
// // //         }
// // //     }, [isNewEntry]);

// // //     const handleChange = (e) => {
// // //         if (viewOnly) return;
// // //         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
// // //     };

// // //     const handleCameraCapture = (url, blob, capturedCoords) => {
// // //         const updates = {};
// // //         if (capturedCoords && capturedCoords.lat) {
// // //             updates.latitude = capturedCoords.lat.toFixed(6);
// // //             updates.longitude = capturedCoords.lon.toFixed(6);
// // //             updates.dateTime = new Date().toLocaleString();
// // //         }

// // //         if (cameraMode === 'video') {
// // //             updates.liveVideo = url;
// // //             updates.liveVideoBlob = blob;
// // //         } else if (cameraMode === 'photo') {
// // //             updates.sitePhoto = url;
// // //             updates.sitePhotoBlob = blob;
// // //         } else if (cameraMode === 'selfie') {
// // //             updates.selfie = url;
// // //             updates.selfieBlob = blob;
// // //         }
// // //         setFormData(prev => ({ ...prev, ...updates }));
// // //         setShowGeoCamera(false);
// // //     };

// // //     const downloadMedia = (type, isZip) => {
// // //         let blob;
// // //         let url;

// // //         if (type === 'video') { blob = formData.liveVideoBlob; url = formData.liveVideo; }
// // //         else if (type === 'gopro') { blob = formData.goproBlob; url = formData.goproVideo; }
// // //         else if (type === 'selfie') { blob = formData.selfieBlob; url = formData.selfie; }
// // //         else { blob = formData.sitePhotoBlob; url = formData.sitePhoto; }

// // //         if (!blob && !url) { alert("No file to download"); return; }

// // //         const isVideo = (type === 'video' || type === 'gopro');
// // //         const ext = isVideo ? 'mp4' : 'jpg'; 
// // //         const finalName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
        
// // //         let suffix = "";
// // //         if (type === 'gopro') suffix = "_GOPRO";
// // //         else if (type === 'selfie') suffix = "_SELFIE";
        
// // //         const fileNameWithExt = `${finalName}${suffix}.${ext}`;

// // //         if (isZip) {
// // //             const zip = new JSZip();
// // //             if (blob) zip.file(fileNameWithExt, blob);
// // //             else { saveAs(url, fileNameWithExt); return; }
            
// // //             const meta = `FILENAME: ${finalName}\nDate: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}`;
// // //             zip.file("details.txt", meta);
// // //             zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${finalName}.zip`));
// // //         } else {
// // //             if (blob) saveAs(blob, fileNameWithExt);
// // //             else saveAs(url, fileNameWithExt);
// // //         }
// // //     };

// // //     const handleFileChange = (e) => {
// // //         if (e.target.files[0]) {
// // //             setFormData(prev => ({ 
// // //                 ...prev, 
// // //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// // //                 goproBlob: e.target.files[0] 
// // //             }));
// // //         }
// // //     };

// // //     const handleGetGPS = () => {
// // //         // Allow GPS update in New OR Edit mode
// // //         if (viewOnly) return; 
// // //         navigator.geolocation.getCurrentPosition((pos) => {
// // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // //             alert("GPS Captured!");
// // //         });
// // //     };

// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();
// // //         if (viewOnly) return;
        
// // //         // Validation: Only required for NEW entries or if fields are empty
// // //         if (isNewEntry) {
// // //             if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo) { alert("Live Video Required"); return; }
// // //             if (!formData.sitePhoto) { alert("Live Photo Required"); return; }
// // //         }
        
// // //         const finalFileName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
        
// // //         onSubmitData({ 
// // //             ...formData, 
// // //             generatedFileName: finalFileName,
// // //             id: initialData ? initialData.id : null 
// // //         });
// // //     };

// // //     const requestFullscreen = (id) => {
// // //         const elem = document.getElementById(id);
// // //         if (elem) {
// // //             if (elem.requestFullscreen) elem.requestFullscreen();
// // //             else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
// // //         }
// // //     };

// // //     // --- RENDER MEDIA CARD ---
// // //     const renderMediaCard = (type, src) => {
// // //         const isVideo = (type === 'video' || type === 'gopro');
// // //         const label = type === 'video' ? "Live Video" : (type === 'gopro' ? "GoPro Video" : (type === 'selfie' ? "Team Selfie" : "Site Photo"));
// // //         const elementId = `media_${type}`;
        
// // //         // --- LOGIC FOR DELETE BUTTON ---
// // //         // 1. Live Video & Site Photo: ONLY delete/retake in NEW Mode. (Locked in Edit/View)
// // //         // 2. GoPro & Selfie: Delete allowed in NEW or EDIT mode. (Locked in View)
// // //         let canDelete = false;
// // //         if (type === 'video' || type === 'photo') {
// // //             canDelete = isNewEntry; // Strict lock for live evidence
// // //         } else {
// // //             canDelete = !viewOnly; // Allow editing for secondary media
// // //         }

// // //         const showPreviewMap = type !== 'gopro' && type !== 'selfie';

// // //         return (
// // //             <div style={styles.previewCard}>
// // //                 <div style={styles.mediaWrapper}>
// // //                     {isVideo ? (
// // //                         <video id={elementId} src={src} controls playsInline style={styles.mediaContent} />
// // //                     ) : (
// // //                         <img id={elementId} src={src} alt={label} style={styles.mediaContent} />
// // //                     )}
// // //                     <button type="button" onClick={() => requestFullscreen(elementId)} style={styles.fsBtnOverlay}>Fullscreen</button>
// // //                 </div>

// // //                 {showPreviewMap && (
// // //                     <div style={{ marginTop: '10px', marginBottom: '5px' }}>
// // //                         <div style={{fontSize:'11px', fontWeight:'bold', color:'#555', marginBottom:'3px'}}>Captured Location:</div>
// // //                         <div style={{ height: '150px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
// // //                             <LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} />
// // //                         </div>
// // //                     </div>
// // //                 )}
                
// // //                 <div style={styles.downloadRow}>
// // //                     <button type="button" onClick={()=>downloadMedia(type, false)} style={{...styles.downBtn, background:'#43a047'}}>Download {isVideo ? 'MP4' : 'JPG'}</button>
// // //                     <button type="button" onClick={()=>downloadMedia(type, true)} style={{...styles.downBtn, background:'#1976d2'}}>Download ZIP</button>
                    
// // //                     {canDelete && (
// // //                         <button type="button" onClick={()=>setFormData(prev => ({...prev, [type === 'video' ? 'liveVideo' : (type === 'gopro' ? 'goproVideo' : (type === 'selfie' ? 'selfie' : 'sitePhoto'))]: null}))} style={{...styles.downBtn, background:'#d32f2f'}}>Delete</button>
// // //                     )}
// // //                 </div>
// // //             </div>
// // //         );
// // //     };

// // //     const flatBlocks = Array.isArray(blocks) ? blocks.flat() : [];

// // //     return (
// // //         <div style={styles.overlay}>
// // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // //             <div style={styles.container}>
// // //                 <div style={styles.header}>
// // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (isEditExisting ? "Edit Survey" : "New Survey")}</h3>
// // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // //                 </div>
                
// // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // //                     {/* FIELDS 1-7 */}
// // //                     <div style={styles.row}>
// // //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={viewOnly || isEditExisting ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditExisting} required><option value="">Select</option>{districts && districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={viewOnly || isEditExisting ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditExisting} required><option value="">Select</option>{flatBlocks.map(b=><option key={b}>{b}</option>)}</select></div>
// // //                     </div>
// // //                     <div style={styles.row}>
// // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                         <div style={styles.col}><label style={styles.label}>4. Date</label><input value={formData.dateTime} readOnly style={styles.readOnlyInput} /></div>
// // //                     </div>
// // //                     <div style={styles.row}>
// // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                     </div>
// // //                     <div style={styles.row}>
// // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                     </div>

// // //                     {/* FIELD 8: Location Point (Auto-updates for New, Manually updateable for Edit) */}
// // //                     <div style={styles.locSection}>
// // //                         <label style={styles.label}>8. Location Point</label>
// // //                         {!viewOnly && (
// // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // //                             </div>
// // //                         )}
// // //                         <div style={{display:'flex', gap:'10px'}}>
// // //                             <input value={formData.latitude} readOnly style={styles.readOnlyInput} placeholder="Lat" />
// // //                             <input value={formData.longitude} readOnly style={styles.readOnlyInput} placeholder="Lng" />
// // //                         </div>
// // //                         <div style={styles.mapContainer}>
// // //                             <LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} />
// // //                         </div>
// // //                     </div>

// // //                     <div style={styles.locSection}>
// // //                         <label style={styles.label}>9. Location Type</label>
// // //                         <select name="locationType" value={formData.locationType} style={viewOnly ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly} required>
// // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // //                         </select>
// // //                     </div>

// // //                     <div style={{textAlign:'center', padding:'10px', background:'#e3f2fd', borderRadius:'4px', marginBottom:'15px', border:'1px dashed #2196f3'}}>
// // //                         <small style={{fontWeight:'bold', color:'#1565c0'}}>File Name Preview:</small><br/>
// // //                         <code style={{fontSize:'14px', color:'#333'}}>
// // //                             {generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber)}
// // //                         </code>
// // //                     </div>

// // //                     <div style={styles.locSection}>
// // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // //                         {/* SITE PHOTO (Locked in Edit Mode) */}
// // //                         <div style={{marginBottom:'20px'}}>
// // //                             <label style={styles.label}>Site Photo</label>
// // //                             {formData.sitePhoto ? renderMediaCard('photo', formData.sitePhoto) : (
// // //                                 isNewEntry ? 
// // //                                 <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>Capture Photo</button>
// // //                                 : <div style={styles.emptyBox}>No Site Photo Available</div>
// // //                             )}
// // //                         </div>

// // //                         {/* LIVE VIDEO (Locked in Edit Mode) */}
// // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // //                             <div style={{marginBottom:'20px'}}>
// // //                                 <label style={styles.label}>Live Video</label>
// // //                                 {formData.liveVideo ? renderMediaCard('video', formData.liveVideo) : (
// // //                                     isNewEntry ?
// // //                                     <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>Record Video</button>
// // //                                     : <div style={styles.emptyBox}>No Live Video Available</div>
// // //                                 )}
// // //                             </div>
// // //                         )}

// // //                         {/* GOPRO UPLOAD (Editable in Edit Mode) */}
// // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // //                             <div style={{marginTop:'15px'}}>
// // //                                 <label style={styles.label}>GoPro Upload</label>
// // //                                 {formData.goproVideo ? (
// // //                                     renderMediaCard('gopro', formData.goproVideo)
// // //                                 ) : (
// // //                                     !viewOnly ? (
// // //                                         <label style={{...styles.mediaBtn, background:'#0288d1', color:'white'}}>
// // //                                             Upload GoPro File <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // //                                         </label>
// // //                                     ) : <div style={styles.emptyBox}>No GoPro Video Available</div>
// // //                                 )}
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     <div style={styles.locSection}>
// // //                         <div style={styles.row}>
// // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                         </div>
                        
// // //                         {/* SELFIE (Editable in Edit Mode) */}
// // //                         <div style={{marginTop:'15px'}}>
// // //                             <label style={styles.label}>Team Selfie</label>
// // //                             {formData.selfie ? (
// // //                                 renderMediaCard('selfie', formData.selfie)
// // //                             ) : (
// // //                                 !viewOnly ? 
// // //                                 <button type="button" style={{...styles.btn, background: '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>Take Team Selfie</button>
// // //                                 : <div style={styles.emptyBox}>No Selfie Available</div>
// // //                             )}
// // //                         </div>
// // //                     </div>

// // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{isEditExisting ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
// // //                     <button type="button" onClick={onClose} style={{...styles.btn, background:'#555', marginTop:'10px'}}>CLOSE</button>
// // //                 </form>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default SurveyForm;




// // import React, { useState, useEffect } from 'react';
// // import JSZip from 'jszip';
// // import { saveAs } from 'file-saver';
// // import GeoCamera from './GeoCamera';
// // import LocationMap from './LocationMap'; 

// // const LOCATION_TYPES = [
// //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // ];

// // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // const TYPE_CODES = {
// //     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// //     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// //     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // };

// // const generateBSNLName = (district, block, type, shotNo) => {
// //     if (!district || !block || !type) return "BSNL_FILE";
// //     const distCode = district.substring(0, 3).toUpperCase();
// //     const blockCode = block.substring(0, 3).toUpperCase();
// //     const typeCode = TYPE_CODES[type] || "OTH";
// //     const d = new Date();
// //     const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
// //     return `${distCode}_${blockCode}_${typeCode}_SHOTNO${shotNo}_${dateStr}`;
// // };

// // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts = [], blocks = [], onSubmitData, user, initialData, viewOnly }) => {
// //     const [formData, setFormData] = useState(initialData || {
// //         id: null,
// //         district: '', block: '', routeName: '', dateTime: '', 
// //         startLocName: '', endLocName: '', ringNumber: '', 
// //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// //         surveyorName: user || '', surveyorMobile: '',
// //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// //     });

// //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// //     const [cameraMode, setCameraMode] = useState(null);

// //     // --- MODES ---
// //     // 1. New Entry: Not View Only AND No Initial Data
// //     const isNewEntry = !viewOnly && !initialData;
// //     // 2. Edit Existing: Not View Only BUT Has Initial Data
// //     const isEditExisting = !viewOnly && !!initialData;

// //     const styles = {
// //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
// //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
// //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// //         col: { flex: 1, minWidth:'200px' },
// //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
// //         readOnlyInput: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#e9ecef', fontSize:'14px', boxSizing:'border-box', color: '#555' },
// //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
// //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// //         previewCard: { marginTop:'10px', background:'#fff', padding:'15px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
// //         mediaWrapper: { position: 'relative', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', marginBottom:'5px' },
// //         mediaContent: { width: '100%', maxHeight: '350px', objectFit: 'contain', display:'block', background:'#000' },
// //         fsBtnOverlay: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border:'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 20 },
// //         mapContainer: { height: '250px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd', marginTop: '15px' },
// //         downloadRow: { display:'flex', gap:'10px', marginTop:'5px' },
// //         downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' },
// //         btn: { padding:'10px', borderRadius:'4px', cursor: 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' },
// //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// //         emptyBox: { padding: '30px', textAlign: 'center', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '4px', color: '#888', fontStyle: 'italic' }
// //     };

// //     // 1. Handle Map Picking
// //     useEffect(() => {
// //         if (pickedCoords && isNewEntry) {
// //             setFormData(prev => ({ 
// //                 ...prev, 
// //                 latitude: pickedCoords.lat.toFixed(6), 
// //                 longitude: pickedCoords.lng.toFixed(6),
// //                 dateTime: new Date().toLocaleString() 
// //             }));
// //         }
// //     }, [pickedCoords, isNewEntry]);

// //     // 2. AUTO-GET REAL TIME LOCATION (Only for New Entry & if empty)
// //     useEffect(() => {
// //         if (isNewEntry && !formData.latitude && !pickedCoords) {
// //             navigator.geolocation.getCurrentPosition((pos) => {
// //                 setFormData(prev => ({ 
// //                     ...prev, 
// //                     latitude: pos.coords.latitude.toFixed(6), 
// //                     longitude: pos.coords.longitude.toFixed(6), 
// //                     dateTime: new Date().toLocaleString() 
// //                 }));
// //             }, (err) => console.warn("Auto GPS failed", err));
// //         }
// //     }, [isNewEntry, formData.latitude, pickedCoords]);

// //     const handleChange = (e) => {
// //         if (viewOnly) return;
// //         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
// //     };

// //     const handleCameraCapture = (url, blob, capturedCoords) => {
// //         const updates = {};
// //         if (capturedCoords && capturedCoords.lat) {
// //             updates.latitude = capturedCoords.lat.toFixed(6);
// //             updates.longitude = capturedCoords.lon.toFixed(6);
// //             updates.dateTime = new Date().toLocaleString();
// //         }

// //         if (cameraMode === 'video') {
// //             updates.liveVideo = url;
// //             updates.liveVideoBlob = blob;
// //         } else if (cameraMode === 'photo') {
// //             updates.sitePhoto = url;
// //             updates.sitePhotoBlob = blob;
// //         } else if (cameraMode === 'selfie') {
// //             updates.selfie = url;
// //             updates.selfieBlob = blob;
// //         }
// //         setFormData(prev => ({ ...prev, ...updates }));
// //         setShowGeoCamera(false);
// //     };

// //     const downloadMedia = (type, isZip) => {
// //         let blob;
// //         let url;

// //         if (type === 'video') { blob = formData.liveVideoBlob; url = formData.liveVideo; }
// //         else if (type === 'gopro') { blob = formData.goproBlob; url = formData.goproVideo; }
// //         else if (type === 'selfie') { blob = formData.selfieBlob; url = formData.selfie; }
// //         else { blob = formData.sitePhotoBlob; url = formData.sitePhoto; }

// //         if (!blob && !url) { alert("No file to download"); return; }

// //         const isVideo = (type === 'video' || type === 'gopro');
// //         const ext = isVideo ? 'mp4' : 'jpg'; 
// //         const finalName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
        
// //         let suffix = "";
// //         if (type === 'gopro') suffix = "_GOPRO";
// //         else if (type === 'selfie') suffix = "_SELFIE";
        
// //         const fileNameWithExt = `${finalName}${suffix}.${ext}`;

// //         if (isZip) {
// //             const zip = new JSZip();
// //             if (blob) zip.file(fileNameWithExt, blob);
// //             else { saveAs(url, fileNameWithExt); return; }
            
// //             const meta = `FILENAME: ${finalName}\nDate: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}`;
// //             zip.file("details.txt", meta);
// //             zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${finalName}.zip`));
// //         } else {
// //             if (blob) saveAs(blob, fileNameWithExt);
// //             else saveAs(url, fileNameWithExt);
// //         }
// //     };

// //     const handleFileChange = (e) => {
// //         if (e.target.files[0]) {
// //             setFormData(prev => ({ 
// //                 ...prev, 
// //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// //                 goproBlob: e.target.files[0] 
// //             }));
// //         }
// //     };

// //     const handleGetGPS = () => {
// //         if (viewOnly) return; 
// //         navigator.geolocation.getCurrentPosition((pos) => {
// //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// //             alert("GPS Captured!");
// //         });
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         if (viewOnly) return;
        
// //         if (isNewEntry) {
// //             if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo) { alert("Live Video Required"); return; }
// //             if (!formData.sitePhoto) { alert("Live Photo Required"); return; }
// //         }
        
// //         const finalFileName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
        
// //         onSubmitData({ 
// //             ...formData, 
// //             generatedFileName: finalFileName,
// //             id: initialData ? initialData.id : null 
// //         });
// //     };

// //     const requestFullscreen = (id) => {
// //         const elem = document.getElementById(id);
// //         if (elem) {
// //             if (elem.requestFullscreen) elem.requestFullscreen();
// //             else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
// //         }
// //     };

// //     // --- RENDER MEDIA CARD ---
// //     const renderMediaCard = (type, src) => {
// //         const isVideo = (type === 'video' || type === 'gopro');
// //         const label = type === 'video' ? "Live Video" : (type === 'gopro' ? "GoPro Video" : (type === 'selfie' ? "Team Selfie" : "Site Photo"));
// //         const elementId = `media_${type}`;
        
// //         // --- LOGIC FOR DELETE/EDIT ---
// //         // 1. Live Video & Site Photo: ONLY editable in NEW Mode. (Locked in Edit)
// //         // 2. GoPro & Selfie: Editable in NEW or EDIT mode. (Locked in View)
// //         let canDelete = false;
// //         if (type === 'video' || type === 'photo') {
// //             canDelete = isNewEntry; 
// //         } else {
// //             canDelete = !viewOnly; 
// //         }

// //         // Show preview map only for live evidence
// //         const showPreviewMap = type !== 'gopro' && type !== 'selfie';

// //         return (
// //             <div style={styles.previewCard}>
// //                 <div style={styles.mediaWrapper}>
// //                     {isVideo ? (
// //                         <video id={elementId} src={src} controls playsInline style={styles.mediaContent} />
// //                     ) : (
// //                         <img id={elementId} src={src} alt={label} style={styles.mediaContent} />
// //                     )}
// //                     <button type="button" onClick={() => requestFullscreen(elementId)} style={styles.fsBtnOverlay}>Fullscreen</button>
// //                 </div>

// //                 {showPreviewMap && (
// //                     <div style={{ marginTop: '10px', marginBottom: '5px' }}>
// //                         <div style={{fontSize:'11px', fontWeight:'bold', color:'#555', marginBottom:'3px'}}>Captured Location:</div>
// //                         <div style={{ height: '150px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
// //                             <LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} />
// //                         </div>
// //                     </div>
// //                 )}
                
// //                 <div style={styles.downloadRow}>
// //                     <button type="button" onClick={()=>downloadMedia(type, false)} style={{...styles.downBtn, background:'#43a047'}}>Download {isVideo ? 'MP4' : 'JPG'}</button>
// //                     <button type="button" onClick={()=>downloadMedia(type, true)} style={{...styles.downBtn, background:'#1976d2'}}>Download ZIP</button>
                    
// //                     {canDelete && (
// //                         <button type="button" onClick={()=>setFormData(prev => ({...prev, [type === 'video' ? 'liveVideo' : (type === 'gopro' ? 'goproVideo' : (type === 'selfie' ? 'selfie' : 'sitePhoto'))]: null}))} style={{...styles.downBtn, background:'#d32f2f'}}>Delete</button>
// //                     )}
// //                 </div>
// //             </div>
// //         );
// //     };

// //     const flatBlocks = Array.isArray(blocks) ? blocks.flat() : [];

// //     return (
// //         <div style={styles.overlay}>
// //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// //             <div style={styles.container}>
// //                 <div style={styles.header}>
// //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (isEditExisting ? "Edit Survey" : "New Survey")}</h3>
// //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// //                 </div>
                
// //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// //                     <div style={styles.row}>
// //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={viewOnly || isEditExisting ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditExisting} required><option value="">Select</option>{districts && districts.map(d=><option key={d}>{d}</option>)}</select></div>
// //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={viewOnly || isEditExisting ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditExisting} required><option value="">Select</option>{flatBlocks.map(b=><option key={b}>{b}</option>)}</select></div>
// //                     </div>
// //                     <div style={styles.row}>
// //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                         <div style={styles.col}><label style={styles.label}>4. Date</label><input value={formData.dateTime} readOnly style={styles.readOnlyInput} /></div>
// //                     </div>
// //                     <div style={styles.row}>
// //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                     </div>
// //                     <div style={styles.row}>
// //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                     </div>

// //                     <div style={styles.locSection}>
// //                         <label style={styles.label}>8. Location Point</label>
// //                         {!viewOnly && (
// //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// //                             </div>
// //                         )}
// //                         <div style={{display:'flex', gap:'10px'}}>
// //                             <input value={formData.latitude} readOnly style={styles.readOnlyInput} placeholder="Lat" />
// //                             <input value={formData.longitude} readOnly style={styles.readOnlyInput} placeholder="Lng" />
// //                         </div>
// //                         {/* Map Updates in Real Time based on formData lat/lng */}
// //                         <div style={styles.mapContainer}>
// //                             <LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} />
// //                         </div>
// //                     </div>

// //                     <div style={styles.locSection}>
// //                         <label style={styles.label}>9. Location Type</label>
// //                         <select name="locationType" value={formData.locationType} style={viewOnly ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly} required>
// //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// //                         </select>
// //                     </div>

// //                     <div style={{textAlign:'center', padding:'10px', background:'#e3f2fd', borderRadius:'4px', marginBottom:'15px', border:'1px dashed #2196f3'}}>
// //                         <small style={{fontWeight:'bold', color:'#1565c0'}}>File Name Preview:</small><br/>
// //                         <code style={{fontSize:'14px', color:'#333'}}>
// //                             {generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber)}
// //                         </code>
// //                     </div>

// //                     <div style={styles.locSection}>
// //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// //                         <div style={{marginBottom:'20px'}}>
// //                             <label style={styles.label}>Site Photo</label>
// //                             {formData.sitePhoto ? renderMediaCard('photo', formData.sitePhoto) : (
// //                                 isNewEntry ? 
// //                                 <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>Capture Photo</button>
// //                                 : <div style={styles.emptyBox}>No Site Photo Available</div>
// //                             )}
// //                         </div>

// //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// //                             <div style={{marginBottom:'20px'}}>
// //                                 <label style={styles.label}>Live Video</label>
// //                                 {formData.liveVideo ? renderMediaCard('video', formData.liveVideo) : (
// //                                     isNewEntry ?
// //                                     <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>Record Video</button>
// //                                     : <div style={styles.emptyBox}>No Live Video Available</div>
// //                                 )}
// //                             </div>
// //                         )}

// //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// //                             <div style={{marginTop:'15px'}}>
// //                                 <label style={styles.label}>GoPro Upload</label>
// //                                 {formData.goproVideo ? (
// //                                     renderMediaCard('gopro', formData.goproVideo)
// //                                 ) : (
// //                                     !viewOnly ? (
// //                                         <label style={{...styles.mediaBtn, background:'#0288d1', color:'white'}}>
// //                                             Upload GoPro File <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// //                                         </label>
// //                                     ) : <div style={styles.emptyBox}>No GoPro Video Available</div>
// //                                 )}
// //                             </div>
// //                         )}
// //                     </div>

// //                     <div style={styles.locSection}>
// //                         <div style={styles.row}>
// //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                         </div>
                        
// //                         <div style={{marginTop:'15px'}}>
// //                             <label style={styles.label}>Team Selfie</label>
// //                             {formData.selfie ? (
// //                                 renderMediaCard('selfie', formData.selfie)
// //                             ) : (
// //                                 !viewOnly ? 
// //                                 <button type="button" style={{...styles.btn, background: '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>Take Team Selfie</button>
// //                                 : <div style={styles.emptyBox}>No Selfie Available</div>
// //                             )}
// //                         </div>
// //                     </div>

// //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{isEditExisting ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
// //                     <button type="button" onClick={onClose} style={{...styles.btn, background:'#555', marginTop:'10px'}}>CLOSE</button>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // };

// // export default SurveyForm;



// import React, { useState, useEffect } from 'react';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
// import GeoCamera from './GeoCamera';
// import LocationMap from './LocationMap'; 

// const LOCATION_TYPES = [
//     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
//     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// ];

// const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// const TYPE_CODES = {
//     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
//     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
//     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// };

// // --- DATE FORMATTER HELPER ---
// const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return dateString; 
//     return date.toLocaleString('en-IN', { 
//         day: '2-digit', month: '2-digit', year: 'numeric', 
//         hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
//     });
// };

// const generateBSNLName = (district, block, type, shotNo) => {
//     if (!district || !block || !type) return "BSNL_FILE";
//     const distCode = district.substring(0, 3).toUpperCase();
//     const blockCode = block.substring(0, 3).toUpperCase();
//     const typeCode = TYPE_CODES[type] || "OTH";
//     const d = new Date();
//     const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
//     return `${distCode}_${blockCode}_${typeCode}_SHOTNO${shotNo}_${dateStr}`;
// };

// const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts = [], blocks = [], onSubmitData, user, initialData, viewOnly }) => {
//     const [formData, setFormData] = useState(initialData || {
//         id: null,
//         district: '', block: '', routeName: '', dateTime: '', 
//         startLocName: '', endLocName: '', ringNumber: '', 
//         latitude: '', longitude: '', locationType: '', shotNumber: '', 
//         surveyorName: user || '', surveyorMobile: '',
//         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
//         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
//     });

//     const [showGeoCamera, setShowGeoCamera] = useState(false);
//     const [cameraMode, setCameraMode] = useState(null);
//     const [gpsLoading, setGpsLoading] = useState(false);

//     // --- MODES ---
//     // isNewEntry: True if creating a brand new survey
//     const isNewEntry = !viewOnly && !initialData;
    
//     // isEditExisting: True if editing a saved survey
//     const isEditExisting = !viewOnly && !!initialData;

//     const styles = {
//         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
//         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
//         body: { flex: 1, overflowY: 'auto', padding: '20px' },
//         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
//         col: { flex: 1, minWidth:'200px' },
//         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
//         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
//         readOnlyInput: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#e9ecef', fontSize:'14px', boxSizing:'border-box', color: '#555' },
//         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
//         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
//         previewCard: { marginTop:'10px', background:'#fff', padding:'15px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
//         mediaWrapper: { position: 'relative', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', marginBottom:'5px' },
//         mediaContent: { width: '100%', maxHeight: '350px', objectFit: 'contain', display:'block', background:'#000' },
//         fsBtnOverlay: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border:'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 20 },
//         mapContainer: { height: '250px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd', marginTop: '15px' },
//         downloadRow: { display:'flex', gap:'10px', marginTop:'5px' },
//         downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' },
//         btn: { padding:'10px', borderRadius:'4px', cursor: 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
//         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
//         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
//         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' },
//         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
//         emptyBox: { padding: '30px', textAlign: 'center', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '4px', color: '#888', fontStyle: 'italic' }
//     };

//     // --- GPS LOGIC ---
//     const fetchHighAccuracyGPS = () => {
//         if (!navigator.geolocation) {
//             alert("Geolocation is not supported");
//             return;
//         }
//         setGpsLoading(true);
//         navigator.geolocation.getCurrentPosition(
//             (pos) => {
//                 setFormData(prev => ({ 
//                     ...prev, 
//                     latitude: pos.coords.latitude.toFixed(6), 
//                     longitude: pos.coords.longitude.toFixed(6), 
//                     dateTime: new Date().toLocaleString()
//                 }));
//                 setGpsLoading(false);
//             }, 
//             (err) => {
//                 console.warn("GPS Error:", err);
//                 setGpsLoading(false);
//             },
//             { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//         );
//     };

//     // 1. Handle Map Picking
//     useEffect(() => {
//         if (pickedCoords && isNewEntry) {
//             setFormData(prev => ({ 
//                 ...prev, 
//                 latitude: pickedCoords.lat.toFixed(6), 
//                 longitude: pickedCoords.lng.toFixed(6),
//                 dateTime: new Date().toLocaleString() 
//             }));
//         }
//     }, [pickedCoords, isNewEntry]);

//     // 2. Auto-Get GPS on New Entry
//     useEffect(() => {
//         if (isNewEntry && !pickedCoords && !formData.latitude) {
//             fetchHighAccuracyGPS();
//         }
//         // eslint-disable-next-line
//     }, [isNewEntry]);

//     const handleChange = (e) => {
//         if (viewOnly) return;
//         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
//     };

//     const handleCameraCapture = (url, blob, capturedCoords) => {
//         const updates = {};
//         if (capturedCoords && capturedCoords.lat) {
//             updates.latitude = capturedCoords.lat.toFixed(6);
//             updates.longitude = capturedCoords.lon.toFixed(6);
//             updates.dateTime = new Date().toLocaleString();
//         }

//         if (cameraMode === 'video') {
//             updates.liveVideo = url;
//             updates.liveVideoBlob = blob;
//         } else if (cameraMode === 'photo') {
//             updates.sitePhoto = url;
//             updates.sitePhotoBlob = blob;
//         } else if (cameraMode === 'selfie') {
//             updates.selfie = url;
//             updates.selfieBlob = blob;
//         }
//         setFormData(prev => ({ ...prev, ...updates }));
//         setShowGeoCamera(false);
//     };

//     const downloadMedia = (type, isZip) => {
//         let blob;
//         let url;

//         if (type === 'video') { blob = formData.liveVideoBlob; url = formData.liveVideo; }
//         else if (type === 'gopro') { blob = formData.goproBlob; url = formData.goproVideo; }
//         else if (type === 'selfie') { blob = formData.selfieBlob; url = formData.selfie; }
//         else { blob = formData.sitePhotoBlob; url = formData.sitePhoto; }

//         if (!blob && !url) { alert("No file to download"); return; }

//         const isVideo = (type === 'video' || type === 'gopro');
//         const ext = isVideo ? 'mp4' : 'jpg'; 
//         const finalName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
        
//         let suffix = "";
//         if (type === 'gopro') suffix = "_GOPRO";
//         else if (type === 'selfie') suffix = "_SELFIE";
        
//         const fileNameWithExt = `${finalName}${suffix}.${ext}`;

//         if (isZip) {
//             const zip = new JSZip();
//             if (blob) zip.file(fileNameWithExt, blob);
//             else { saveAs(url, fileNameWithExt); return; }
            
//             const meta = `FILENAME: ${finalName}\nDate: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}`;
//             zip.file("details.txt", meta);
//             zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${finalName}.zip`));
//         } else {
//             if (blob) saveAs(blob, fileNameWithExt);
//             else saveAs(url, fileNameWithExt);
//         }
//     };

//     const handleFileChange = (e) => {
//         if (e.target.files[0]) {
//             setFormData(prev => ({ 
//                 ...prev, 
//                 goproVideo: URL.createObjectURL(e.target.files[0]), 
//                 goproBlob: e.target.files[0] 
//             }));
//         }
//     };

//     const handleGetGPS = () => {
//         if (viewOnly) return;
//         fetchHighAccuracyGPS();
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (viewOnly) return;
        
//         if (isNewEntry) {
//             if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo) { alert("Live Video Required"); return; }
//             if (!formData.sitePhoto) { alert("Live Photo Required"); return; }
//         }
        
//         const finalFileName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
        
//         onSubmitData({ 
//             ...formData, 
//             generatedFileName: finalFileName,
//             id: initialData ? initialData.id : null 
//         });
//     };

//     const requestFullscreen = (id) => {
//         const elem = document.getElementById(id);
//         if (elem) {
//             if (elem.requestFullscreen) elem.requestFullscreen();
//             else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
//         }
//     };

//     // --- RENDER MEDIA CARD ---
//     const renderMediaCard = (type, src) => {
//         const isVideo = (type === 'video' || type === 'gopro');
//         const label = type === 'video' ? "Live Video" : (type === 'gopro' ? "GoPro Video" : (type === 'selfie' ? "Team Selfie" : "Site Photo"));
//         const elementId = `media_${type}`;
        
//         // RULES: 
//         // - Live Video/Photo: Only delete in NEW mode.
//         // - GoPro/Selfie: Delete in NEW or EDIT mode.
//         let canDelete = false;
//         if (type === 'video' || type === 'photo') {
//             canDelete = isNewEntry; 
//         } else {
//             canDelete = !viewOnly; 
//         }

//         const showPreviewMap = type !== 'gopro' && type !== 'selfie';

//         return (
//             <div style={styles.previewCard}>
//                 <div style={styles.mediaWrapper}>
//                     {isVideo ? (
//                         <video id={elementId} src={src} controls playsInline style={styles.mediaContent} />
//                     ) : (
//                         <img id={elementId} src={src} alt={label} style={styles.mediaContent} />
//                     )}
//                     <button type="button" onClick={() => requestFullscreen(elementId)} style={styles.fsBtnOverlay}>Fullscreen</button>
//                 </div>

//                 {showPreviewMap && (
//                     <div style={{ marginTop: '10px', marginBottom: '5px' }}>
//                         <div style={{fontSize:'11px', fontWeight:'bold', color:'#555', marginBottom:'3px'}}>Captured Location:</div>
//                         <div style={{ height: '150px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
//                             <LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} />
//                         </div>
//                     </div>
//                 )}
                
//                 <div style={styles.downloadRow}>
//                     <button type="button" onClick={()=>downloadMedia(type, false)} style={{...styles.downBtn, background:'#43a047'}}>Download {isVideo ? 'MP4' : 'JPG'}</button>
//                     <button type="button" onClick={()=>downloadMedia(type, true)} style={{...styles.downBtn, background:'#1976d2'}}>Download ZIP</button>
                    
//                     {canDelete && (
//                         <button type="button" onClick={()=>setFormData(prev => ({...prev, [type === 'video' ? 'liveVideo' : (type === 'gopro' ? 'goproVideo' : (type === 'selfie' ? 'selfie' : 'sitePhoto'))]: null}))} style={{...styles.downBtn, background:'#d32f2f'}}>Delete</button>
//                     )}
//                 </div>
//             </div>
//         );
//     };

//     const flatBlocks = Array.isArray(blocks) ? blocks.flat() : [];

//     return (
//         <div style={styles.overlay}>
//             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
//             <div style={styles.container}>
//                 <div style={styles.header}>
//                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (isEditExisting ? "Edit Survey" : "New Survey")}</h3>
//                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
//                 </div>
                
//                 <form style={styles.body} onSubmit={handleSubmit}>
                    
//                     <div style={styles.row}>
//                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={viewOnly || isEditExisting ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditExisting} required><option value="">Select</option>{districts && districts.map(d=><option key={d}>{d}</option>)}</select></div>
//                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={viewOnly || isEditExisting ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditExisting} required><option value="">Select</option>{flatBlocks.map(b=><option key={b}>{b}</option>)}</select></div>
//                     </div>
//                     <div style={styles.row}>
//                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                         <div style={styles.col}>
//                             <label style={styles.label}>4. Date</label>
//                             <input value={formatDate(formData.dateTime)} readOnly style={styles.readOnlyInput} />
//                         </div>
//                     </div>
//                     <div style={styles.row}>
//                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                     </div>
//                     <div style={styles.row}>
//                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                     </div>

//                     <div style={styles.locSection}>
//                         <label style={styles.label}>8. Location Point</label>
//                         {!viewOnly && (
//                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
//                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>
//                                     {gpsLoading ? "Getting Location..." : "Get GPS"}
//                                 </button>
//                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
//                             </div>
//                         )}
//                         <div style={{display:'flex', gap:'10px'}}>
//                             <input value={formData.latitude} readOnly style={styles.readOnlyInput} placeholder="Lat" />
//                             <input value={formData.longitude} readOnly style={styles.readOnlyInput} placeholder="Lng" />
//                         </div>
//                         <div style={styles.mapContainer}>
//                             <LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} />
//                         </div>
//                     </div>

//                     <div style={styles.locSection}>
//                         <label style={styles.label}>9. Location Type</label>
//                         <select name="locationType" value={formData.locationType} style={viewOnly ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly} required>
//                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
//                         </select>
//                     </div>

//                     <div style={{textAlign:'center', padding:'10px', background:'#e3f2fd', borderRadius:'4px', marginBottom:'15px', border:'1px dashed #2196f3'}}>
//                         <small style={{fontWeight:'bold', color:'#1565c0'}}>File Name Preview:</small><br/>
//                         <code style={{fontSize:'14px', color:'#333'}}>
//                             {generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber)}
//                         </code>
//                     </div>

//                     <div style={styles.locSection}>
//                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
//                         <div style={{marginBottom:'20px'}}>
//                             <label style={styles.label}>Site Photo</label>
//                             {formData.sitePhoto ? renderMediaCard('photo', formData.sitePhoto) : (
//                                 isNewEntry ? 
//                                 <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>Capture Photo</button>
//                                 : <div style={styles.emptyBox}>No Site Photo Available</div>
//                             )}
//                         </div>

//                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
//                             <div style={{marginBottom:'20px'}}>
//                                 <label style={styles.label}>Live Video</label>
//                                 {formData.liveVideo ? renderMediaCard('video', formData.liveVideo) : (
//                                     isNewEntry ?
//                                     <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>Record Video</button>
//                                     : <div style={styles.emptyBox}>No Live Video Available</div>
//                                 )}
//                             </div>
//                         )}

//                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
//                             <div style={{marginTop:'15px'}}>
//                                 <label style={styles.label}>GoPro Upload</label>
//                                 {formData.goproVideo ? (
//                                     renderMediaCard('gopro', formData.goproVideo)
//                                 ) : (
//                                     !viewOnly ? (
//                                         <label style={{...styles.mediaBtn, background:'#0288d1', color:'white'}}>
//                                             Upload GoPro File <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
//                                         </label>
//                                     ) : <div style={styles.emptyBox}>No GoPro Video Available</div>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     <div style={styles.locSection}>
//                         <div style={styles.row}>
//                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                         </div>
                        
//                         <div style={{marginTop:'15px'}}>
//                             <label style={styles.label}>Team Selfie</label>
//                             {formData.selfie ? (
//                                 renderMediaCard('selfie', formData.selfie)
//                             ) : (
//                                 !viewOnly ? 
//                                 <button type="button" style={{...styles.btn, background: '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>Take Team Selfie</button>
//                                 : <div style={styles.emptyBox}>No Selfie Available</div>
//                             )}
//                         </div>
//                     </div>

//                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{isEditExisting ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
//                     <button type="button" onClick={onClose} style={{...styles.btn, background:'#555', marginTop:'10px'}}>CLOSE</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SurveyForm;

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import GeoCamera from './GeoCamera';
import LocationMap from './LocationMap'; 

const LOCATION_TYPES = [
    "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
    "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
];

const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

const TYPE_CODES = {
    "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
    "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
    "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
};

// --- DATE FORMATTER HELPER ---
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 
    return date.toLocaleString('en-IN', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
    });
};

const generateBSNLName = (district, block, type, shotNo) => {
    if (!district || !block || !type) return "BSNL_FILE";
    const distCode = district.substring(0, 3).toUpperCase();
    const blockCode = block.substring(0, 3).toUpperCase();
    const typeCode = TYPE_CODES[type] || "OTH";
    const d = new Date();
    const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
    return `${distCode}_${blockCode}_${typeCode}_SHOTNO${shotNo}_${dateStr}`;
};

const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts = [], blocks = [], onSubmitData, user, initialData, viewOnly }) => {
    const [formData, setFormData] = useState(initialData || {
        id: null,
        district: '', block: '', routeName: '', dateTime: '', 
        startLocName: '', endLocName: '', ringNumber: '', 
        latitude: '', longitude: '', locationType: '', shotNumber: '', 
        surveyorName: user || '', surveyorMobile: '',
        liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
        liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
    });

    const [showGeoCamera, setShowGeoCamera] = useState(false);
    const [cameraMode, setCameraMode] = useState(null);
    const [gpsLoading, setGpsLoading] = useState(false);

    // --- MODES ---
    // isNewEntry: True if creating a brand new survey
    const isNewEntry = !viewOnly && !initialData;
    
    // isEditExisting: True if editing a saved survey
    const isEditExisting = !viewOnly && !!initialData;

    const styles = {
        overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
        container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
        body: { flex: 1, overflowY: 'auto', padding: '20px' },
        row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
        col: { flex: 1, minWidth:'200px' },
        label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
        input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
        readOnlyInput: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#e9ecef', fontSize:'14px', boxSizing:'border-box', color: '#555' },
        select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize:'14px', boxSizing:'border-box' },
        locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
        previewCard: { marginTop:'10px', background:'#fff', padding:'15px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
        mediaWrapper: { position: 'relative', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', marginBottom:'5px' },
        mediaContent: { width: '100%', maxHeight: '350px', objectFit: 'contain', display:'block', background:'#000' },
        fsBtnOverlay: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border:'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 20 },
        mapContainer: { height: '250px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd', marginTop: '15px' },
        downloadRow: { display:'flex', gap:'10px', marginTop:'5px' },
        downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' },
        btn: { padding:'10px', borderRadius:'4px', cursor: 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
        gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
        pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
        submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' },
        mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
        emptyBox: { padding: '30px', textAlign: 'center', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '4px', color: '#888', fontStyle: 'italic' }
    };

    // --- GPS LOGIC ---
    const fetchHighAccuracyGPS = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported");
            return;
        }
        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({ 
                    ...prev, 
                    latitude: pos.coords.latitude.toFixed(6), 
                    longitude: pos.coords.longitude.toFixed(6), 
                    dateTime: new Date().toLocaleString()
                }));
                setGpsLoading(false);
            }, 
            (err) => {
                console.warn("GPS Error:", err);
                setGpsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // 1. Handle Map Picking
    useEffect(() => {
        if (pickedCoords && isNewEntry) {
            setFormData(prev => ({ 
                ...prev, 
                latitude: pickedCoords.lat.toFixed(6), 
                longitude: pickedCoords.lng.toFixed(6),
                dateTime: new Date().toLocaleString() 
            }));
        }
    }, [pickedCoords, isNewEntry]);

    // 2. Auto-Get GPS on New Entry
    useEffect(() => {
        if (isNewEntry && !pickedCoords && !formData.latitude) {
            fetchHighAccuracyGPS();
        }
        // eslint-disable-next-line
    }, [isNewEntry]);

    const handleChange = (e) => {
        if (viewOnly) return;
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
    };

    const handleCameraCapture = (url, blob, capturedCoords) => {
        const updates = {};
        if (capturedCoords && capturedCoords.lat) {
            updates.latitude = capturedCoords.lat.toFixed(6);
            updates.longitude = capturedCoords.lon.toFixed(6);
            updates.dateTime = new Date().toLocaleString();
        }

        if (cameraMode === 'video') {
            updates.liveVideo = url;
            updates.liveVideoBlob = blob;
        } else if (cameraMode === 'photo') {
            updates.sitePhoto = url;
            updates.sitePhotoBlob = blob;
        } else if (cameraMode === 'selfie') {
            updates.selfie = url;
            updates.selfieBlob = blob;
        }
        setFormData(prev => ({ ...prev, ...updates }));
        setShowGeoCamera(false);
    };

    const downloadMedia = (type, isZip) => {
        let blob;
        let url;

        if (type === 'video') { blob = formData.liveVideoBlob; url = formData.liveVideo; }
        else if (type === 'gopro') { blob = formData.goproBlob; url = formData.goproVideo; }
        else if (type === 'selfie') { blob = formData.selfieBlob; url = formData.selfie; }
        else { blob = formData.sitePhotoBlob; url = formData.sitePhoto; }

        if (!blob && !url) { alert("No file to download"); return; }

        const isVideo = (type === 'video' || type === 'gopro');
        const ext = isVideo ? 'mp4' : 'jpg'; 
        const finalName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
        
        let suffix = "";
        if (type === 'gopro') suffix = "_GOPRO";
        else if (type === 'selfie') suffix = "_SELFIE";
        
        const fileNameWithExt = `${finalName}${suffix}.${ext}`;

        if (isZip) {
            const zip = new JSZip();
            if (blob) zip.file(fileNameWithExt, blob);
            else { saveAs(url, fileNameWithExt); return; }
            
            const meta = `FILENAME: ${finalName}\nDate: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}`;
            zip.file("details.txt", meta);
            zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${finalName}.zip`));
        } else {
            if (blob) saveAs(blob, fileNameWithExt);
            else saveAs(url, fileNameWithExt);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData(prev => ({ 
                ...prev, 
                goproVideo: URL.createObjectURL(e.target.files[0]), 
                goproBlob: e.target.files[0] 
            }));
        }
    };

    const handleGetGPS = () => {
        if (viewOnly) return;
        fetchHighAccuracyGPS();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (viewOnly) return;
        
        if (isNewEntry) {
            if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo) { alert("Live Video Required"); return; }
            if (!formData.sitePhoto) { alert("Live Photo Required"); return; }
        }
        
        const finalFileName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
        
        onSubmitData({ 
            ...formData, 
            generatedFileName: finalFileName,
            id: initialData ? initialData.id : null 
        });
    };

    const requestFullscreen = (id) => {
        const elem = document.getElementById(id);
        if (elem) {
            if (elem.requestFullscreen) elem.requestFullscreen();
            else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        }
    };

    // --- RENDER MEDIA CARD ---
    const renderMediaCard = (type, src) => {
        const isVideo = (type === 'video' || type === 'gopro');
        const label = type === 'video' ? "Live Video" : (type === 'gopro' ? "GoPro Video" : (type === 'selfie' ? "Team Selfie" : "Site Photo"));
        const elementId = `media_${type}`;
        
        let canDelete = false;
        if (type === 'video' || type === 'photo') {
            canDelete = isNewEntry; 
        } else {
            canDelete = !viewOnly; 
        }

        const showPreviewMap = type !== 'gopro' && type !== 'selfie';

        return (
            <div style={styles.previewCard}>
                <div style={styles.mediaWrapper}>
                    {isVideo ? (
                        <video id={elementId} src={src} controls playsInline style={styles.mediaContent} />
                    ) : (
                        <img id={elementId} src={src} alt={label} style={styles.mediaContent} />
                    )}
                    <button type="button" onClick={() => requestFullscreen(elementId)} style={styles.fsBtnOverlay}>Fullscreen</button>
                </div>

                {showPreviewMap && (
                    <div style={{ marginTop: '10px', marginBottom: '5px' }}>
                        <div style={{fontSize:'11px', fontWeight:'bold', color:'#555', marginBottom:'3px'}}>Captured Location:</div>
                        <div style={{ height: '150px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
                            <LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} />
                        </div>
                    </div>
                )}
                
                <div style={styles.downloadRow}>
                    <button type="button" onClick={()=>downloadMedia(type, false)} style={{...styles.downBtn, background:'#43a047'}}>Download {isVideo ? 'MP4' : 'JPG'}</button>
                    <button type="button" onClick={()=>downloadMedia(type, true)} style={{...styles.downBtn, background:'#1976d2'}}>Download ZIP</button>
                    
                    {canDelete && (
                        <button type="button" onClick={()=>setFormData(prev => ({...prev, [type === 'video' ? 'liveVideo' : (type === 'gopro' ? 'goproVideo' : (type === 'selfie' ? 'selfie' : 'sitePhoto'))]: null}))} style={{...styles.downBtn, background:'#d32f2f'}}>Delete</button>
                    )}
                </div>
            </div>
        );
    };

    const flatBlocks = Array.isArray(blocks) ? blocks.flat() : [];

    return (
        <div style={styles.overlay}>
            {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
            <div style={styles.container}>
                <div style={styles.header}>
                    <h3 style={{margin:0}}>{viewOnly ? "View Details" : (isEditExisting ? "Edit Survey" : "New Survey")}</h3>
                    <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
                </div>
                
                <form style={styles.body} onSubmit={handleSubmit}>
                    
                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={viewOnly || isEditExisting ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditExisting} required><option value="">Select</option>{districts && districts.map(d=><option key={d}>{d}</option>)}</select></div>
                        <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={viewOnly || isEditExisting ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly || isEditExisting} required><option value="">Select</option>{flatBlocks.map(b=><option key={b}>{b}</option>)}</select></div>
                    </div>
                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                        <div style={styles.col}>
                            <label style={styles.label}>4. Date</label>
                            <input value={formatDate(formData.dateTime)} readOnly style={styles.readOnlyInput} />
                        </div>
                    </div>
                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                        <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                    </div>
                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                        <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                    </div>

                    <div style={styles.locSection}>
                        <label style={styles.label}>8. Location Point</label>
                        {!viewOnly && (
                            <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                                <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>
                                    {gpsLoading ? "Getting Location..." : "Get GPS"}
                                </button>
                                <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
                            </div>
                        )}
                        <div style={{display:'flex', gap:'10px'}}>
                            <input value={formData.latitude} readOnly style={styles.readOnlyInput} placeholder="Lat" />
                            <input value={formData.longitude} readOnly style={styles.readOnlyInput} placeholder="Lng" />
                        </div>
                        <div style={styles.mapContainer}>
                            <LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} />
                        </div>
                    </div>

                    <div style={styles.locSection}>
                        <label style={styles.label}>9. Location Type</label>
                        <select name="locationType" value={formData.locationType} style={viewOnly ? styles.readOnlyInput : styles.select} onChange={handleChange} disabled={viewOnly} required>
                            <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div style={{textAlign:'center', padding:'10px', background:'#e3f2fd', borderRadius:'4px', marginBottom:'15px', border:'1px dashed #2196f3'}}>
                        <small style={{fontWeight:'bold', color:'#1565c0'}}>File Name Preview:</small><br/>
                        <code style={{fontSize:'14px', color:'#333'}}>
                            {generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber)}
                        </code>
                    </div>

                    <div style={styles.locSection}>
                        <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
                        <div style={{marginBottom:'20px'}}>
                            <label style={styles.label}>Site Photo</label>
                            {formData.sitePhoto ? renderMediaCard('photo', formData.sitePhoto) : (
                                isNewEntry ? 
                                <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>Capture Photo</button>
                                : <div style={styles.emptyBox}>No Site Photo Available</div>
                            )}
                        </div>

                        {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
                            <div style={{marginBottom:'20px'}}>
                                <label style={styles.label}>Live Video</label>
                                {formData.liveVideo ? renderMediaCard('video', formData.liveVideo) : (
                                    isNewEntry ?
                                    <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>Record Video</button>
                                    : <div style={styles.emptyBox}>No Live Video Available</div>
                                )}
                            </div>
                        )}

                        {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
                            <div style={{marginTop:'15px'}}>
                                <label style={styles.label}>GoPro Upload</label>
                                {formData.goproVideo ? (
                                    renderMediaCard('gopro', formData.goproVideo)
                                ) : (
                                    !viewOnly ? (
                                        <label style={{...styles.mediaBtn, background:'#0288d1', color:'white'}}>
                                            Upload GoPro File <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
                                        </label>
                                    ) : <div style={styles.emptyBox}>No GoPro Video Available</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={styles.locSection}>
                        <div style={styles.row}>
                            <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                            <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={viewOnly ? styles.readOnlyInput : styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                        </div>
                        
                        <div style={{marginTop:'15px'}}>
                            <label style={styles.label}>Team Selfie</label>
                            {formData.selfie ? (
                                renderMediaCard('selfie', formData.selfie)
                            ) : (
                                !viewOnly ? 
                                <button type="button" style={{...styles.btn, background: '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>Take Team Selfie</button>
                                : <div style={styles.emptyBox}>No Selfie Available</div>
                            )}
                        </div>
                    </div>

                    {!viewOnly && <button type="submit" style={styles.submitBtn}>{isEditExisting ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
                    <button type="button" onClick={onClose} style={{...styles.btn, background:'#555', marginTop:'10px'}}>CLOSE</button>
                </form>
            </div>
        </div>
    );
};

export default SurveyForm;