// // // // // // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // // // // // import GeoCamera from './GeoCamera';

// // // // // // // // // // // // // // // const LOCATION_TYPES = [
// // // // // // // // // // // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // // // // // // // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // // // // // // // // // // ];

// // // // // // // // // // // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // // // // // // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData }) => {
// // // // // // // // // // // // // // //     const [formData, setFormData] = useState(initialData || {
// // // // // // // // // // // // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // // // // // // // // // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // // // // // // // // // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // // // // // // // // // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // // // // // // // // // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // // // // // // // // // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // // // // // // // // // // // //     });

// // // // // // // // // // // // // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // // // // // // // // // // // // //     const [cameraMode, setCameraMode] = useState(null);

// // // // // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // // // // //         if (pickedCoords) setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // // // // // // // // // // // //     }, [pickedCoords]);

// // // // // // // // // // // // // // //     const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

// // // // // // // // // // // // // // //     const handleCameraCapture = (url, blob) => {
// // // // // // // // // // // // // // //         if (cameraMode === 'video') setFormData(prev => ({ ...prev, liveVideo: url, liveVideoBlob: blob }));
// // // // // // // // // // // // // // //         else if (cameraMode === 'photo') setFormData(prev => ({ ...prev, sitePhoto: url, sitePhotoBlob: blob }));
// // // // // // // // // // // // // // //         else if (cameraMode === 'selfie') setFormData(prev => ({ ...prev, selfie: url, selfieBlob: blob }));
// // // // // // // // // // // // // // //         setShowGeoCamera(false);
// // // // // // // // // // // // // // //     };

// // // // // // // // // // // // // // //     const handleFileChange = (e) => {
// // // // // // // // // // // // // // //         if (e.target.files[0]) {
// // // // // // // // // // // // // // //             setFormData(prev => ({ 
// // // // // // // // // // // // // // //                 ...prev, 
// // // // // // // // // // // // // // //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// // // // // // // // // // // // // // //                 goproBlob: e.target.files[0] 
// // // // // // // // // // // // // // //             }));
// // // // // // // // // // // // // // //         }
// // // // // // // // // // // // // // //     };

// // // // // // // // // // // // // // //     const handleGetGPS = () => {
// // // // // // // // // // // // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // // // // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // // // // // // // // // // // //             alert("GPS Captured!");
// // // // // // // // // // // // // // //         });
// // // // // // // // // // // // // // //     };

// // // // // // // // // // // // // // //     const generateFileName = () => {
// // // // // // // // // // // // // // //         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
// // // // // // // // // // // // // // //         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
// // // // // // // // // // // // // // //         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
// // // // // // // // // // // // // // //     };

// // // // // // // // // // // // // // //     const handleSubmit = async (e) => {
// // // // // // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // // // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // // // // // // // // // // // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // // // // // // // // // // // // //         const generatedFileName = generateFileName();
// // // // // // // // // // // // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // // // // // // // // // // // //     };

// // // // // // // // // // // // // // //     const getBtnStyle = (file, isMandatory) => {
// // // // // // // // // // // // // // //         if (file) return { background: '#2e7d32', color: 'white', border:'1px solid green' }; 
// // // // // // // // // // // // // // //         if (isMandatory) return { background: '#d32f2f', color: 'white', border:'1px solid red' }; 
// // // // // // // // // // // // // // //         return { background: '#1976d2', color: 'white', border:'1px solid blue' }; 
// // // // // // // // // // // // // // //     };

// // // // // // // // // // // // // // //     const styles = {
// // // // // // // // // // // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // // // // // // // // // // // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // // // // // // // // // // // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // // // // // // // // // // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // // // // // // // // // // // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // // // // // // // // // // // // //         col: { flex: 1, minWidth:'200px' },
// // // // // // // // // // // // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // // // // // // // // // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background:'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // // // // // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background:'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // // // // // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // // // // // // // // // // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // // // // // // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // // // // // // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // // // // // // // // // // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
// // // // // // // // // // // // // // //     };

// // // // // // // // // // // // // // //     return (
// // // // // // // // // // // // // // //         <div style={styles.overlay}>
// // // // // // // // // // // // // // //             {showGeoCamera && (
// // // // // // // // // // // // // // //                 <GeoCamera 
// // // // // // // // // // // // // // //                     mode={cameraMode} 
// // // // // // // // // // // // // // //                     onCapture={handleCameraCapture} 
// // // // // // // // // // // // // // //                     onClose={() => setShowGeoCamera(false)} 
// // // // // // // // // // // // // // //                     metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} 
// // // // // // // // // // // // // // //                 />
// // // // // // // // // // // // // // //             )}
            
// // // // // // // // // // // // // // //             <div style={styles.container}>
// // // // // // // // // // // // // // //                 <div style={styles.header}>
// // // // // // // // // // // // // // //                     <h3 style={{margin:0}}>Field Execution Survey</h3>
// // // // // // // // // // // // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // // // // // // // // // // // //                 </div>
                
// // // // // // // // // // // // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // // // //                         <div style={styles.col}>
// // // // // // // // // // // // // // //                             <label style={styles.label}>1. District</label>
// // // // // // // // // // // // // // //                             <select name="district" value={formData.district} style={styles.select} onChange={handleChange} required>
// // // // // // // // // // // // // // //                                 <option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}
// // // // // // // // // // // // // // //                             </select>
// // // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // // //                         <div style={styles.col}>
// // // // // // // // // // // // // // //                             <label style={styles.label}>2. Block</label>
// // // // // // // // // // // // // // //                             <select name="block" value={formData.block} style={styles.select} onChange={handleChange} required>
// // // // // // // // // // // // // // //                                 <option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}
// // // // // // // // // // // // // // //                             </select>
// // // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // // // //                         <div style={styles.col}>
// // // // // // // // // // // // // // //                             <label style={styles.label}>3. Route Name</label>
// // // // // // // // // // // // // // //                             <input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} placeholder="Enter Route" required />
// // // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // // //                         <div style={styles.col}>
// // // // // // // // // // // // // // //                             <label style={styles.label}>4. Date (GPS)</label>
// // // // // // // // // // // // // // //                             <input value={formData.dateTime} readOnly placeholder="Click Get GPS" style={{...styles.input, background:'#f0f0f0', color:'#666'}} />
// // // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>5. Start Location</label><input name="startLocName" style={styles.input} onChange={handleChange} required /></div>
// // // // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>6. End Location</label><input name="endLocName" style={styles.input} onChange={handleChange} required /></div>
// // // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>7. Ring Number</label><input name="ringNumber" style={styles.input} onChange={handleChange} required placeholder="e.g. Ring-01" /></div>
// // // // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Shot Number</label><input name="shotNumber" style={styles.input} onChange={handleChange} required placeholder="1" /></div>
// // // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // // // //                         <label style={styles.label}>8. Location Point</label>
// // // // // // // // // // // // // // //                         <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // // // // // // // // // // // // //                             <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // // // // // // // // // // // // //                             <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // // // // // // // // // // // // //                             <input value={formData.latitude} readOnly placeholder="Lat" style={{...styles.input, background:'#f0f0f0'}} />
// // // // // // // // // // // // // // //                             <input value={formData.longitude} readOnly placeholder="Lng" style={{...styles.input, background:'#f0f0f0'}} />
// // // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // // // //                         <label style={styles.label}>9. Location Type</label>
// // // // // // // // // // // // // // //                         <select name="locationType" style={styles.select} onChange={handleChange} required>
// // // // // // // // // // // // // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // // // // // // // // // // // // //                         </select>
// // // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
// // // // // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // // // // //                             <div style={styles.col}>
// // // // // // // // // // // // // // //                                 <div style={{...styles.mediaBtn, ...getBtnStyle(formData.sitePhoto, true)}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>
// // // // // // // // // // // // // // //                                     <i className="fa-solid fa-camera"></i> {formData.sitePhoto ? "Photo Captured" : "Capture Live Photo"}
// // // // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // // // //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // // // // //                                     <div style={{...styles.mediaBtn, ...getBtnStyle(formData.liveVideo, true)}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>
// // // // // // // // // // // // // // //                                         <i className="fa-solid fa-video"></i> {formData.liveVideo ? "Video Recorded" : "Record Live Video"}
// // // // // // // // // // // // // // //                                     </div>
// // // // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // // // //                             )}
// // // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // // // // //                                     <label style={{...styles.mediaBtn, ...getBtnStyle(formData.goproVideo, false)}}>
// // // // // // // // // // // // // // //                                         <i className="fa-solid fa-upload"></i> {formData.goproVideo ? "GoPro Uploaded" : "Upload GoPro (Later)"}
// // // // // // // // // // // // // // //                                         <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // // // // // // // // // // // // //                                     </label>
// // // // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // // // //                         )}
// // // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Surveyor Details</h4>
// // // // // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} required /></div>
// // // // // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" style={styles.input} onChange={handleChange} required /></div>
// // // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // // // // //                             <div style={styles.col}>
// // // // // // // // // // // // // // //                                 <div style={{...styles.mediaBtn, ...getBtnStyle(formData.selfie, true)}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>
// // // // // // // // // // // // // // //                                     <i className="fa-solid fa-user"></i> {formData.selfie ? "Selfie Taken" : "Take Team Selfie"}
// // // // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // // //                 </form>
// // // // // // // // // // // // // // //                 <button onClick={handleSubmit} style={styles.submitBtn}>SUBMIT SURVEY</button>
// // // // // // // // // // // // // // //             </div>
// // // // // // // // // // // // // // //         </div>
// // // // // // // // // // // // // // //     );
// // // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // export default SurveyForm;


// // // // // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // // // // import GeoCamera from './GeoCamera';
// // // // // // // // // // // // // // import { saveMediaToDisk } from './db';

// // // // // // // // // // // // // // const LOCATION_TYPES = [
// // // // // // // // // // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // // // // // // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // // // // // // // // // ];

// // // // // // // // // // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // // // // // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// // // // // // // // // // // // // //     const [formData, setFormData] = useState(initialData || {
// // // // // // // // // // // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // // // // // // // // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // // // // // // // // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // // // // // // // // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // // // // // // // // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // // // // // // // // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // // // // // // // // // // //     });

// // // // // // // // // // // // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // // // // // // // // // // // //     const [cameraMode, setCameraMode] = useState(null);

// // // // // // // // // // // // // //     // If viewing existing data, ensure Lat/Lng are populated
// // // // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // // // //         if (pickedCoords && !viewOnly) {
// // // // // // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // // // // // // // // // // //         }
// // // // // // // // // // // // // //     }, [pickedCoords, viewOnly]);

// // // // // // // // // // // // // //     const handleChange = (e) => {
// // // // // // // // // // // // // //         if (viewOnly) return; // Prevent editing in View Mode
// // // // // // // // // // // // // //         const { name, value } = e.target; 
// // // // // // // // // // // // // //         setFormData(prev => ({ ...prev, [name]: value })); 
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     const handleCameraCapture = (url, blob) => {
// // // // // // // // // // // // // //         if (cameraMode === 'video') setFormData(prev => ({ ...prev, liveVideo: url, liveVideoBlob: blob }));
// // // // // // // // // // // // // //         else if (cameraMode === 'photo') setFormData(prev => ({ ...prev, sitePhoto: url, sitePhotoBlob: blob }));
// // // // // // // // // // // // // //         else if (cameraMode === 'selfie') setFormData(prev => ({ ...prev, selfie: url, selfieBlob: blob }));
// // // // // // // // // // // // // //         setShowGeoCamera(false);
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     const handleFileChange = (e) => {
// // // // // // // // // // // // // //         if (e.target.files[0]) {
// // // // // // // // // // // // // //             setFormData(prev => ({ 
// // // // // // // // // // // // // //                 ...prev, 
// // // // // // // // // // // // // //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// // // // // // // // // // // // // //                 goproBlob: e.target.files[0] 
// // // // // // // // // // // // // //             }));
// // // // // // // // // // // // // //         }
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     const handleGetGPS = () => {
// // // // // // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // // // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // // // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // // // // // // // // // // //             alert("GPS Captured!");
// // // // // // // // // // // // // //         });
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     const generateFileName = () => {
// // // // // // // // // // // // // //         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
// // // // // // // // // // // // // //         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
// // // // // // // // // // // // // //         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     const handleSubmit = async (e) => {
// // // // // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // // // // //         if (viewOnly) return;

// // // // // // // // // // // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // // // // // // // // // // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // // // // // // // // // // // //         const generatedFileName = formData.generatedFileName || generateFileName();
// // // // // // // // // // // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     // Styles
// // // // // // // // // // // // // //     const styles = {
// // // // // // // // // // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // // // // // // // // // // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // // // // // // // // // // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // // // // // // // // // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // // // // // // // // // // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // // // // // // // // // // // //         col: { flex: 1, minWidth:'200px' },
// // // // // // // // // // // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // // // // // // // // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // // // // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // // // // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // // // // // // // // // // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // // // // // // // // // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     return (
// // // // // // // // // // // // // //         <div style={styles.overlay}>
// // // // // // // // // // // // // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // // // // // // // // // // // // //             <div style={styles.container}>
// // // // // // // // // // // // // //                 <div style={styles.header}>
// // // // // // // // // // // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Survey Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // // // // // // // // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // // // // // // // // // // //                 </div>
                
// // // // // // // // // // // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // // //                         <div style={styles.col}>
// // // // // // // // // // // // // //                             <label style={styles.label}>1. District</label>
// // // // // // // // // // // // // //                             <select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // // // // // // // // // //                                 <option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}
// // // // // // // // // // // // // //                             </select>
// // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // //                         <div style={styles.col}>
// // // // // // // // // // // // // //                             <label style={styles.label}>2. Block</label>
// // // // // // // // // // // // // //                             <select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // // // // // // // // // //                                 <option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}
// // // // // // // // // // // // // //                             </select>
// // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // // //                         <label style={styles.label}>8. Location Point</label>
// // // // // // // // // // // // // //                         {!viewOnly && (
// // // // // // // // // // // // // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // // // // // // // // // // // //                                 <button type="button" onClick={handleGetGPS} style={{...styles.btn, background:'#333'}}>Get GPS</button>
// // // // // // // // // // // // // //                                 <button type="button" onClick={onPickLocation} style={{...styles.btn, background:'#0288d1'}}>Map Pick</button>
// // // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // // //                         )}
// // // // // // // // // // // // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // // // // // // // // // // // //                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
// // // // // // // // // // // // // //                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
// // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // // //                         <label style={styles.label}>9. Location Type</label>
// // // // // // // // // // // // // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // // // // // // // // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // // // // // // // // // // // //                         </select>
// // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // //                     {/* MEDIA SECTION */}
// // // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // // // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // // // //                             {/* Photo */}
// // // // // // // // // // // // // //                             <div style={styles.col}>
// // // // // // // // // // // // // //                                 {formData.sitePhoto ? (
// // // // // // // // // // // // // //                                     <button type="button" style={{...styles.btn, background:'green'}}>Photo Captured ✅</button>
// // // // // // // // // // // // // //                                 ) : (
// // // // // // // // // // // // // //                                     !viewOnly && !initialData && <button type="button" style={{...styles.btn, background:'#d32f2f'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>Capture Live Photo</button>
// // // // // // // // // // // // // //                                 )}
// // // // // // // // // // // // // //                             </div>

// // // // // // // // // // // // // //                             {/* Video (Only for required types) */}
// // // // // // // // // // // // // //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // // // //                                     {formData.liveVideo ? (
// // // // // // // // // // // // // //                                         <button type="button" style={{...styles.btn, background:'green'}}>Video Recorded ✅</button>
// // // // // // // // // // // // // //                                     ) : (
// // // // // // // // // // // // // //                                         // If editing, hide record button. If new, show it.
// // // // // // // // // // // // // //                                         !viewOnly && !initialData && <button type="button" style={{...styles.btn, background:'#d32f2f'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>Record Live Video</button>
// // // // // // // // // // // // // //                                     )}
// // // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // // //                             )}
// // // // // // // // // // // // // //                         </div>

// // // // // // // // // // // // // //                         {/* GoPro (Editable in Edit Mode) */}
// // // // // // // // // // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // // // //                                     {viewOnly ? (
// // // // // // // // // // // // // //                                         <button type="button" style={{...styles.btn, background: formData.goproVideo ? 'green' : 'grey'}}>GoPro: {formData.goproVideo ? "Uploaded" : "Pending"}</button>
// // // // // // // // // // // // // //                                     ) : (
// // // // // // // // // // // // // //                                         <label style={{...styles.btn, background: formData.goproVideo ? 'green' : '#0288d1'}}>
// // // // // // // // // // // // // //                                             {formData.goproVideo ? "GoPro Uploaded ✅" : "Upload GoPro"}
// // // // // // // // // // // // // //                                             <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // // // // // // // // // // // //                                         </label>
// // // // // // // // // // // // // //                                     )}
// // // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // // //                         )}
// // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // //                     {/* Surveyor */}
// // // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // // //                         {!viewOnly && !initialData && (
// // // // // // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // // // //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>
// // // // // // // // // // // // // //                                         {formData.selfie ? "Selfie Taken ✅" : "Take Team Selfie"}
// // // // // // // // // // // // // //                                     </button>
// // // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // // //                         )}
// // // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}

// // // // // // // // // // // // // //                 </form>
// // // // // // // // // // // // // //             </div>
// // // // // // // // // // // // // //         </div>
// // // // // // // // // // // // // //     );
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // export default SurveyForm;



// // // // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // // // import GeoCamera from './GeoCamera';

// // // // // // // // // // // // // const LOCATION_TYPES = [
// // // // // // // // // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // // // // // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // // // // // // // // ];

// // // // // // // // // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // // // // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// // // // // // // // // // // // //     const [formData, setFormData] = useState(initialData || {
// // // // // // // // // // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // // // // // // // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // // // // // // // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // // // // // // // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // // // // // // // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // // // // // // // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // // // // // // // // // //     });

// // // // // // // // // // // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // // // // // // // // // // //     const [cameraMode, setCameraMode] = useState(null);

// // // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // // //         if (pickedCoords && !viewOnly) {
// // // // // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //     }, [pickedCoords, viewOnly]);

// // // // // // // // // // // // //     const handleChange = (e) => {
// // // // // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // // // // //         const { name, value } = e.target; 
// // // // // // // // // // // // //         setFormData(prev => ({ ...prev, [name]: value })); 
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const handleCameraCapture = (url, blob) => {
// // // // // // // // // // // // //         if (cameraMode === 'video') setFormData(prev => ({ ...prev, liveVideo: url, liveVideoBlob: blob }));
// // // // // // // // // // // // //         else if (cameraMode === 'photo') setFormData(prev => ({ ...prev, sitePhoto: url, sitePhotoBlob: blob }));
// // // // // // // // // // // // //         else if (cameraMode === 'selfie') setFormData(prev => ({ ...prev, selfie: url, selfieBlob: blob }));
// // // // // // // // // // // // //         setShowGeoCamera(false);
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const handleFileChange = (e) => {
// // // // // // // // // // // // //         if (e.target.files[0]) {
// // // // // // // // // // // // //             setFormData(prev => ({ 
// // // // // // // // // // // // //                 ...prev, 
// // // // // // // // // // // // //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// // // // // // // // // // // // //                 goproBlob: e.target.files[0] 
// // // // // // // // // // // // //             }));
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const handleGetGPS = () => {
// // // // // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // // // // // // // // // //             alert("GPS Captured!");
// // // // // // // // // // // // //         });
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const generateFileName = () => {
// // // // // // // // // // // // //         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
// // // // // // // // // // // // //         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
// // // // // // // // // // // // //         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const handleSubmit = async (e) => {
// // // // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // // // //         if (viewOnly) return;

// // // // // // // // // // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // // // // // // // // // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // // // // // // // // // // //         const generatedFileName = formData.generatedFileName || generateFileName();
// // // // // // // // // // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const getBtnStyle = (file, isMandatory) => {
// // // // // // // // // // // // //         if (file) return { background: '#2e7d32', color: 'white', border:'1px solid green' }; 
// // // // // // // // // // // // //         if (isMandatory) return { background: '#d32f2f', color: 'white', border:'1px solid red' }; 
// // // // // // // // // // // // //         return { background: '#1976d2', color: 'white', border:'1px solid blue' }; 
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     const styles = {
// // // // // // // // // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // // // // // // // // // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // // // // // // // // // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // // // // // // // // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // // // // // // // // // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // // // // // // // // // // //         col: { flex: 1, minWidth:'200px' },
// // // // // // // // // // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // // // // // // // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // // // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // // // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // // // // // // // // // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // // // // // // // // // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // // // // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // // // // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // // // // // // // // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //         <div style={styles.overlay}>
// // // // // // // // // // // // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // // // // // // // // // // // //             <div style={styles.container}>
// // // // // // // // // // // // //                 <div style={styles.header}>
// // // // // // // // // // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Survey Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // // // // // // // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // // // // // // // // // //                 </div>
                
// // // // // // // // // // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // //                         <div style={styles.col}>
// // // // // // // // // // // // //                             <label style={styles.label}>1. District</label>
// // // // // // // // // // // // //                             <select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // // // // // // // // //                                 <option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select>
// // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // //                         <div style={styles.col}>
// // // // // // // // // // // // //                             <label style={styles.label}>2. Block</label>
// // // // // // // // // // // // //                             <select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // // // // // // // // //                                 <option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select>
// // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // //                         <label style={styles.label}>8. Location Point</label>
// // // // // // // // // // // // //                         {!viewOnly && (
// // // // // // // // // // // // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // // // // // // // // // // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // // // // // // // // // // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // //                         )}
// // // // // // // // // // // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // // // // // // // // // // //                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
// // // // // // // // // // // // //                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
// // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // //                         <label style={styles.label}>9. Location Type</label>
// // // // // // // // // // // // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // // // // // // // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // // // // // // // // // // //                         </select>
// // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // // //                             <div style={styles.col}>
// // // // // // // // // // // // //                                 {formData.sitePhoto ? (
// // // // // // // // // // // // //                                     <button type="button" style={{...styles.btn, background:'green', cursor:'default'}}>Photo Captured ✅</button>
// // // // // // // // // // // // //                                 ) : (
// // // // // // // // // // // // //                                     !viewOnly && !initialData && <button type="button" style={{...styles.mediaBtn, ...getBtnStyle(formData.sitePhoto, true)}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}><i className="fa-solid fa-camera"></i> Capture Live Photo</button>
// // // // // // // // // // // // //                                 )}
// // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // // //                                     {formData.liveVideo ? (
// // // // // // // // // // // // //                                         <button type="button" style={{...styles.btn, background:'green', cursor:'default'}}>Video Recorded ✅</button>
// // // // // // // // // // // // //                                     ) : (
// // // // // // // // // // // // //                                         !viewOnly && !initialData && <button type="button" style={{...styles.mediaBtn, ...getBtnStyle(formData.liveVideo, true)}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}><i className="fa-solid fa-video"></i> Record Live Video</button>
// // // // // // // // // // // // //                                     )}
// // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // //                             )}
// // // // // // // // // // // // //                         </div>

// // // // // // // // // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // // //                                     {viewOnly ? (
// // // // // // // // // // // // //                                         <button type="button" style={{...styles.btn, background: formData.goproVideo ? 'green' : 'grey'}}>GoPro: {formData.goproVideo ? "Uploaded" : "Pending"}</button>
// // // // // // // // // // // // //                                     ) : (
// // // // // // // // // // // // //                                         <label style={{...styles.mediaBtn, ...getBtnStyle(formData.goproVideo, false)}}>
// // // // // // // // // // // // //                                             <i className="fa-solid fa-upload"></i> {formData.goproVideo ? "GoPro Uploaded ✅" : "Upload GoPro"}
// // // // // // // // // // // // //                                             <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // // // // // // // // // // //                                         </label>
// // // // // // // // // // // // //                                     )}
// // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // //                         )}
// // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // // //                         </div>
// // // // // // // // // // // // //                         {!viewOnly && !initialData && (
// // // // // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // // //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}><i className="fa-solid fa-user"></i> {formData.selfie ? "Selfie Taken ✅" : "Take Team Selfie"}</button>
// // // // // // // // // // // // //                                 </div>
// // // // // // // // // // // // //                             </div>
// // // // // // // // // // // // //                         )}
// // // // // // // // // // // // //                     </div>

// // // // // // // // // // // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}

// // // // // // // // // // // // //                 </form>
// // // // // // // // // // // // //             </div>
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export default SurveyForm;


// // // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // // // Removed GeoCamera import to use Native Phone Camera instead

// // // // // // // // // // // // const LOCATION_TYPES = [
// // // // // // // // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // // // // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // // // // // // // ];

// // // // // // // // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // // // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// // // // // // // // // // // //     const [formData, setFormData] = useState(initialData || {
// // // // // // // // // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // // // // // // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // // // // // // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // // // // // // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // // // // // // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // // // // // // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // // // // // // // // //     });

// // // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // // //         if (pickedCoords && !viewOnly) {
// // // // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }, [pickedCoords, viewOnly]);

// // // // // // // // // // // //     const handleChange = (e) => {
// // // // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // // // //         const { name, value } = e.target; 
// // // // // // // // // // // //         setFormData(prev => ({ ...prev, [name]: value })); 
// // // // // // // // // // // //     };

// // // // // // // // // // // //     // Generic File Handler
// // // // // // // // // // // //     const handleFileChange = (e, fieldName) => {
// // // // // // // // // // // //         const file = e.target.files[0];
// // // // // // // // // // // //         if (file) {
// // // // // // // // // // // //             setFormData(prev => ({ 
// // // // // // // // // // // //                 ...prev, 
// // // // // // // // // // // //                 [fieldName]: URL.createObjectURL(file), // Preview URL
// // // // // // // // // // // //                 [`${fieldName}Blob`]: file // Actual File for DB
// // // // // // // // // // // //             }));
// // // // // // // // // // // //         }
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const handleGetGPS = () => {
// // // // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // // // // // // // // //             alert("GPS Captured!");
// // // // // // // // // // // //         });
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const generateFileName = () => {
// // // // // // // // // // // //         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
// // // // // // // // // // // //         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
// // // // // // // // // // // //         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
// // // // // // // // // // // //     };

// // // // // // // // // // // //     const handleSubmit = async (e) => {
// // // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // // //         if (viewOnly) return;

// // // // // // // // // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // // // // // // // // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // // // // // // // // // //         const generatedFileName = formData.generatedFileName || generateFileName();
// // // // // // // // // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // // // // // // // // //     };

// // // // // // // // // // // //     // Styles
// // // // // // // // // // // //     const styles = {
// // // // // // // // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
// // // // // // // // // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '90%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// // // // // // // // // // // //         header: { padding: '15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // // // // // // // // // //         body: { flex: 1, overflowY: 'auto', padding: '15px' },
// // // // // // // // // // // //         row: { display: 'flex', gap: '10px', marginBottom: '15px' },
// // // // // // // // // // // //         col: { flex: 1 },
// // // // // // // // // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // // // // // // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', boxSizing:'border-box' },
// // // // // // // // // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', boxSizing:'border-box' },
// // // // // // // // // // // //         section: { background: 'white', padding: '10px', borderRadius: '6px', marginBottom: '10px', border:'1px solid #ddd' },
// // // // // // // // // // // //         btn: { padding:'10px', borderRadius:'4px', width:'100%', textAlign:'center', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', fontSize:'13px' },
// // // // // // // // // // // //         // Native File Input Styling
// // // // // // // // // // // //         fileLabel: {
// // // // // // // // // // // //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// // // // // // // // // // // //             padding: '12px', borderRadius: '4px', width: '100%', 
// // // // // // // // // // // //             cursor: viewOnly ? 'default' : 'pointer', 
// // // // // // // // // // // //             fontWeight: 'bold', fontSize: '13px', boxSizing: 'border-box',
// // // // // // // // // // // //             textAlign: 'center'
// // // // // // // // // // // //         }
// // // // // // // // // // // //     };

// // // // // // // // // // // //     return (
// // // // // // // // // // // //         <div style={styles.overlay}>
// // // // // // // // // // // //             <div style={styles.container}>
// // // // // // // // // // // //                 <div style={styles.header}>
// // // // // // // // // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // // // // // // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px'}}>×</button>
// // // // // // // // // // // //                 </div>
                
// // // // // // // // // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
// // // // // // // // // // // //                     {/* Fields */}
// // // // // // // // // // // //                     <div style={styles.section}>
// // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // // // // // // // // // //                             <div style={styles.col}><label>Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
// // // // // // // // // // // //                         </div>
// // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Date</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // // // // // // // // // // //                         </div>
// // // // // // // // // // // //                     </div>

// // // // // // // // // // // //                     {/* Location */}
// // // // // // // // // // // //                     <div style={styles.section}>
// // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // // //                         </div>
// // // // // // // // // // // //                         <div style={styles.row}><div style={styles.col}><label style={styles.label}>Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div><div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div></div>
                        
// // // // // // // // // // // //                         <label style={styles.label}>Location Point</label>
// // // // // // // // // // // //                         {!viewOnly && <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // // // // // // // // // //                             <button type="button" onClick={handleGetGPS} style={{...styles.btn, background:'#333'}}>Get GPS</button>
// // // // // // // // // // // //                             <button type="button" onClick={onPickLocation} style={{...styles.btn, background:'#0288d1'}}>Map Pick</button>
// // // // // // // // // // // //                         </div>}
// // // // // // // // // // // //                         <div style={styles.row}><input value={formData.latitude} readOnly style={{...styles.input, background:'#eee'}} placeholder="Lat" /><input value={formData.longitude} readOnly style={{...styles.input, background:'#eee'}} placeholder="Lng" /></div>
// // // // // // // // // // // //                         <label style={styles.label}>Location Type</label>
// // // // // // // // // // // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
// // // // // // // // // // // //                     </div>

// // // // // // // // // // // //                     {/* MEDIA SECTION (Native Inputs) */}
// // // // // // // // // // // //                     <div style={styles.section}>
// // // // // // // // // // // //                         <h4 style={{marginTop:0, color:'#1565c0'}}>Media Evidence</h4>
                        
// // // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // // //                             {/* PHOTO - Required for ALL */}
// // // // // // // // // // // //                             <div style={styles.col}>
// // // // // // // // // // // //                                 <label style={{...styles.fileLabel, background: formData.sitePhoto ? 'green' : '#d32f2f', color:'white'}}>
// // // // // // // // // // // //                                     {formData.sitePhoto ? "Photo Captured ✅" : "📸 Capture Photo"}
// // // // // // // // // // // //                                     {!viewOnly && (
// // // // // // // // // // // //                                         // No 'capture' attribute allows choosing Gallery or Camera App
// // // // // // // // // // // //                                         <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'sitePhoto')} style={{display:'none'}} />
// // // // // // // // // // // //                                     )}
// // // // // // // // // // // //                                 </label>
// // // // // // // // // // // //                             </div>

// // // // // // // // // // // //                             {/* VIDEO - Required for HDD/Blowing */}
// // // // // // // // // // // //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // //                                     <label style={{...styles.fileLabel, background: formData.liveVideo ? 'green' : '#d32f2f', color:'white'}}>
// // // // // // // // // // // //                                         {formData.liveVideo ? "Video Recorded ✅" : "🎥 Record Video"}
// // // // // // // // // // // //                                         {!viewOnly && (
// // // // // // // // // // // //                                             // capture="environment" forces Rear Camera video
// // // // // // // // // // // //                                             // Remove 'capture' if you want to allow choosing 'GPS Video' app from files
// // // // // // // // // // // //                                             <input type="file" accept="video/*" capture="environment" onChange={(e) => handleFileChange(e, 'liveVideo')} style={{display:'none'}} />
// // // // // // // // // // // //                                         )}
// // // // // // // // // // // //                                     </label>
// // // // // // // // // // // //                                 </div>
// // // // // // // // // // // //                             )}
// // // // // // // // // // // //                         </div>

// // // // // // // // // // // //                         {/* GoPro - Optional */}
// // // // // // // // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // //                                     <label style={{...styles.fileLabel, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
// // // // // // // // // // // //                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro (Opt)"}
// // // // // // // // // // // //                                         {!viewOnly && (
// // // // // // // // // // // //                                             <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'goproVideo')} style={{display:'none'}} />
// // // // // // // // // // // //                                         )}
// // // // // // // // // // // //                                     </label>
// // // // // // // // // // // //                                 </div>
// // // // // // // // // // // //                             </div>
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                     </div>

// // // // // // // // // // // //                     {/* Surveyor */}
// // // // // // // // // // // //                     <div style={styles.section}>
// // // // // // // // // // // //                         <div style={styles.row}><div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div><div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div></div>
// // // // // // // // // // // //                         {!viewOnly && !initialData && (
// // // // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // // //                                     <label style={{...styles.fileLabel, background: formData.selfie ? 'green' : '#0288d1', color:'white'}}>
// // // // // // // // // // // //                                         {formData.selfie ? "Selfie Taken ✅" : "🤳 Take Team Selfie"}
// // // // // // // // // // // //                                         {/* capture="user" forces Front Camera */}
// // // // // // // // // // // //                                         <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileChange(e, 'selfie')} style={{display:'none'}} />
// // // // // // // // // // // //                                     </label>
// // // // // // // // // // // //                                 </div>
// // // // // // // // // // // //                             </div>
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                     </div>

// // // // // // // // // // // //                     {!viewOnly && <button type="submit" style={{...styles.btn, background:'#e65100', padding:'15px', fontSize:'16px'}}>SUBMIT SURVEY</button>}
// // // // // // // // // // // //                 </form>
// // // // // // // // // // // //             </div>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //     );
// // // // // // // // // // // // };

// // // // // // // // // // // // export default SurveyForm;




// // // // // // // // // // // import React, { useState, useEffect } from 'react';

// // // // // // // // // // // const LOCATION_TYPES = [
// // // // // // // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // // // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // // // // // // ];

// // // // // // // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// // // // // // // // // // //     const [formData, setFormData] = useState(initialData || {
// // // // // // // // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // // // // // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // // // // // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // // // // // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // // // // // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // // // // // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // // // // // // // //     });

// // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // //         if (pickedCoords && !viewOnly) {
// // // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // // // // // // // //         }
// // // // // // // // // // //     }, [pickedCoords, viewOnly]);

// // // // // // // // // // //     const handleChange = (e) => {
// // // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // // //         const { name, value } = e.target; 
// // // // // // // // // // //         setFormData(prev => ({ ...prev, [name]: value })); 
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleNativeFile = (e, fieldName) => {
// // // // // // // // // // //         const file = e.target.files[0];
// // // // // // // // // // //         if (file) {
// // // // // // // // // // //             setFormData(prev => ({ 
// // // // // // // // // // //                 ...prev, 
// // // // // // // // // // //                 [fieldName]: URL.createObjectURL(file),
// // // // // // // // // // //                 [`${fieldName}Blob`]: file
// // // // // // // // // // //             }));
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleGetGPS = () => {
// // // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // // // // // // // //             alert("GPS Captured!");
// // // // // // // // // // //         });
// // // // // // // // // // //     };

// // // // // // // // // // //     const generateFileName = () => {
// // // // // // // // // // //         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
// // // // // // // // // // //         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
// // // // // // // // // // //         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleSubmit = async (e) => {
// // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // // // // // // // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // // // // // // // // //         const generatedFileName = formData.generatedFileName || generateFileName();
// // // // // // // // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // // // // // // // //     };

// // // // // // // // // // //     const getBtnStyle = (file, isMandatory) => {
// // // // // // // // // // //         if (file) return { background: '#2e7d32', color: 'white', border:'1px solid green' }; 
// // // // // // // // // // //         if (isMandatory) return { background: '#d32f2f', color: 'white', border:'1px solid red' }; 
// // // // // // // // // // //         return { background: '#1976d2', color: 'white', border:'1px solid blue' }; 
// // // // // // // // // // //     };

// // // // // // // // // // //     const styles = {
// // // // // // // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // // // // // // // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // // // // // // // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // // // // // // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
        
// // // // // // // // // // //         // FORCED ROW LAYOUT
// // // // // // // // // // //         row: { display: 'flex', gap: '10px', marginBottom: '15px', flexDirection: 'row' },
// // // // // // // // // // //         col: { flex: 1 }, // Each column takes equal width
        
// // // // // // // // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // // // // // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // // // // // // // //         gpsBtn: { padding: '10px', width:'100%', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // // // //         pickBtn: { padding: '10px', width:'100%', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
        
// // // // // // // // // // //         fileLabel: {
// // // // // // // // // // //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// // // // // // // // // // //             padding: '12px', borderRadius: '4px', width: '100%', 
// // // // // // // // // // //             cursor: viewOnly ? 'default' : 'pointer', 
// // // // // // // // // // //             fontWeight: 'bold', fontSize: '13px', boxSizing: 'border-box',
// // // // // // // // // // //             textAlign: 'center'
// // // // // // // // // // //         },
// // // // // // // // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
// // // // // // // // // // //     };

// // // // // // // // // // //     return (
// // // // // // // // // // //         <div style={styles.overlay}>
// // // // // // // // // // //             <div style={styles.container}>
// // // // // // // // // // //                 <div style={styles.header}>
// // // // // // // // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // // // // // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // // // // // // // //                 </div>
                
// // // // // // // // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // // // // // // // //                     {/* ROW 1 */}
// // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
// // // // // // // // // // //                     </div>

// // // // // // // // // // //                     {/* ROW 2 */}
// // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // // // // // // // // // //                     </div>

// // // // // // // // // // //                     {/* ROW 3 */}
// // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // //                     </div>

// // // // // // // // // // //                     {/* ROW 4 */}
// // // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // //                     </div>

// // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // //                         <label style={styles.label}>Location Point</label>
// // // // // // // // // // //                         {!viewOnly && (
// // // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // // //                                 <div style={styles.col}><button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button></div>
// // // // // // // // // // //                                 <div style={styles.col}><button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button></div>
// // // // // // // // // // //                             </div>
// // // // // // // // // // //                         )}
// // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // //                             <div style={styles.col}><input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" /></div>
// // // // // // // // // // //                             <div style={styles.col}><input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" /></div>
// // // // // // // // // // //                         </div>
// // // // // // // // // // //                     </div>

// // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // //                         <label style={styles.label}>Location Type</label>
// // // // // // // // // // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
// // // // // // // // // // //                     </div>

// // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
// // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // //                             <div style={styles.col}>
// // // // // // // // // // //                                 <label style={{...styles.fileLabel, ...getBtnStyle(formData.sitePhoto, true)}}>
// // // // // // // // // // //                                     {formData.sitePhoto ? "Photo Captured ✅" : "📸 Capture Photo"}
// // // // // // // // // // //                                     {!viewOnly && <input type="file" accept="image/*" onChange={(e) => handleNativeFile(e, 'sitePhoto')} style={{display:'none'}} />}
// // // // // // // // // // //                                 </label>
// // // // // // // // // // //                             </div>
// // // // // // // // // // //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // //                                     <label style={{...styles.fileLabel, ...getBtnStyle(formData.liveVideo, true)}}>
// // // // // // // // // // //                                         {formData.liveVideo ? "Video Recorded ✅" : "🎥 Record Video"}
// // // // // // // // // // //                                         {!viewOnly && <input type="file" accept="video/*" onChange={(e) => handleNativeFile(e, 'liveVideo')} style={{display:'none'}} />}
// // // // // // // // // // //                                     </label>
// // // // // // // // // // //                                 </div>
// // // // // // // // // // //                             )}
// // // // // // // // // // //                         </div>
// // // // // // // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // //                                     <label style={{...styles.fileLabel, background: formData.goproVideo ? 'green' : (viewOnly ? '#9e9e9e' : '#0288d1'), color:'white'}}>
// // // // // // // // // // //                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro (Opt)"}
// // // // // // // // // // //                                         {!viewOnly && <input type="file" accept="video/*" onChange={(e) => handleNativeFile(e, 'goproVideo')} style={{display:'none'}} />}
// // // // // // // // // // //                                     </label>
// // // // // // // // // // //                                 </div>
// // // // // // // // // // //                             </div>
// // // // // // // // // // //                         )}
// // // // // // // // // // //                     </div>

// // // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // // //                         </div>
// // // // // // // // // // //                         {!viewOnly && !initialData && (
// // // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // // //                                     <label style={{...styles.fileLabel, ...getBtnStyle(formData.selfie, true)}}>
// // // // // // // // // // //                                         {formData.selfie ? "Selfie Taken ✅" : "🤳 Take Team Selfie"}
// // // // // // // // // // //                                         <input type="file" accept="image/*" capture="user" onChange={(e) => handleNativeFile(e, 'selfie')} style={{display:'none'}} />
// // // // // // // // // // //                                     </label>
// // // // // // // // // // //                                 </div>
// // // // // // // // // // //                             </div>
// // // // // // // // // // //                         )}
// // // // // // // // // // //                     </div>

// // // // // // // // // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE" : "SUBMIT"}</button>}
// // // // // // // // // // //                 </form>
// // // // // // // // // // //             </div>
// // // // // // // // // // //         </div>
// // // // // // // // // // //     );
// // // // // // // // // // // };

// // // // // // // // // // // export default SurveyForm;


// // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // import GeoCamera from './GeoCamera';

// // // // // // // // // // const LOCATION_TYPES = [
// // // // // // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // // // // // ];

// // // // // // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// // // // // // // // // //     const [formData, setFormData] = useState(initialData || {
// // // // // // // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // // // // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // // // // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // // // // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // // // // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // // // // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // // // // // // //     });

// // // // // // // // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // // // // // // // //     const [cameraMode, setCameraMode] = useState(null);

// // // // // // // // // //     useEffect(() => {
// // // // // // // // // //         if (pickedCoords && !viewOnly) {
// // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // // // // // // //         }
// // // // // // // // // //     }, [pickedCoords, viewOnly]);

// // // // // // // // // //     const handleChange = (e) => {
// // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // //         const { name, value } = e.target; 
// // // // // // // // // //         setFormData(prev => ({ ...prev, [name]: value })); 
// // // // // // // // // //     };

// // // // // // // // // //     // --- CAPTURE FROM GEO CAMERA ---
// // // // // // // // // //     const handleCameraCapture = (url, blob) => {
// // // // // // // // // //         if (cameraMode === 'video') setFormData(prev => ({ ...prev, liveVideo: url, liveVideoBlob: blob }));
// // // // // // // // // //         else if (cameraMode === 'photo') setFormData(prev => ({ ...prev, sitePhoto: url, sitePhotoBlob: blob }));
// // // // // // // // // //         setShowGeoCamera(false);
// // // // // // // // // //     };

// // // // // // // // // //     // --- FILE INPUT (Native) ---
// // // // // // // // // //     const handleFileChange = (e, fieldName) => {
// // // // // // // // // //         if (e.target.files[0]) {
// // // // // // // // // //             const file = e.target.files[0];
// // // // // // // // // //             const url = URL.createObjectURL(file);
// // // // // // // // // //             setFormData(prev => ({ ...prev, [fieldName]: url, [`${fieldName}Blob`]: file }));
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     const handleGetGPS = () => {
// // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // // // // // // //             alert("GPS Captured!");
// // // // // // // // // //         });
// // // // // // // // // //     };

// // // // // // // // // //     const generateFileName = () => {
// // // // // // // // // //         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
// // // // // // // // // //         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
// // // // // // // // // //         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
// // // // // // // // // //     };

// // // // // // // // // //     const handleSubmit = async (e) => {
// // // // // // // // // //         e.preventDefault();
// // // // // // // // // //         if (viewOnly) return;
// // // // // // // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // // // // // // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // // // // // // // //         const generatedFileName = formData.generatedFileName || generateFileName();
// // // // // // // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // // // // // // //     };

// // // // // // // // // //     const getBtnStyle = (file, isMandatory) => {
// // // // // // // // // //         if (file) return { background: '#2e7d32', color: 'white', border:'1px solid green' }; 
// // // // // // // // // //         if (isMandatory) return { background: '#d32f2f', color: 'white', border:'1px solid red' }; 
// // // // // // // // // //         return { background: '#1976d2', color: 'white', border:'1px solid blue' }; 
// // // // // // // // // //     };

// // // // // // // // // //     const styles = {
// // // // // // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // // // // // // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // // // // // // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // // // // // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // // // // // // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // // // // // // // //         col: { flex: 1, minWidth:'200px' },
// // // // // // // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // // // // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // // // // // // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // // // // // // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // // // // // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
// // // // // // // // // //     };

// // // // // // // // // //     return (
// // // // // // // // // //         <div style={styles.overlay}>
// // // // // // // // // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // // // // // // // // //             <div style={styles.container}>
// // // // // // // // // //                 <div style={styles.header}>
// // // // // // // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Survey Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // // // // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // // // // // // //                 </div>
                
// // // // // // // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // // // // // // //                     {/* Basic Info */}
// // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
// // // // // // // // // //                     </div>

// // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // // // // // // // // //                     </div>

// // // // // // // // // //                     {/* Location Details */}
// // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // //                     </div>

// // // // // // // // // //                     <div style={styles.row}>
// // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // //                     </div>

// // // // // // // // // //                     {/* Location Point */}
// // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // //                         <label style={styles.label}>8. Location Point</label>
// // // // // // // // // //                         {!viewOnly && (
// // // // // // // // // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // // // // // // // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // // // // // // // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // // // // // // // //                             </div>
// // // // // // // // // //                         )}
// // // // // // // // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // // // // // // // //                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
// // // // // // // // // //                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
// // // // // // // // // //                         </div>
// // // // // // // // // //                     </div>

// // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // //                         <label style={styles.label}>9. Location Type</label>
// // // // // // // // // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // // // // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // // // // // // // //                         </select>
// // // // // // // // // //                     </div>

// // // // // // // // // //                     {/* MEDIA SECTION */}
// // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // //                             {/* Photo for EVERYONE */}
// // // // // // // // // //                             <div style={styles.col}>
// // // // // // // // // //                                 {formData.sitePhoto ? (
// // // // // // // // // //                                     <button type="button" style={{...styles.btn, background:'green', color:'white', cursor:'default'}}>Photo Captured ✅</button>
// // // // // // // // // //                                 ) : (
// // // // // // // // // //                                     !viewOnly && !initialData && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}><i className="fa-solid fa-camera"></i> Capture Live Photo</button>
// // // // // // // // // //                                 )}
// // // // // // // // // //                             </div>

// // // // // // // // // //                             {/* Video (Specific Types) */}
// // // // // // // // // //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // //                                     {formData.liveVideo ? (
// // // // // // // // // //                                         <button type="button" style={{...styles.btn, background:'green', color:'white', cursor:'default'}}>Video Recorded ✅</button>
// // // // // // // // // //                                     ) : (
// // // // // // // // // //                                         !viewOnly && !initialData && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}><i className="fa-solid fa-video"></i> Record Live Video</button>
// // // // // // // // // //                                     )}
// // // // // // // // // //                                 </div>
// // // // // // // // // //                             )}
// // // // // // // // // //                         </div>

// // // // // // // // // //                         {/* GoPro Upload (Always File Picker) */}
// // // // // // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // //                                     {viewOnly ? (
// // // // // // // // // //                                         <button type="button" style={{...styles.btn, background: formData.goproVideo ? 'green' : 'grey', color:'white'}}>GoPro: {formData.goproVideo ? "Uploaded" : "Pending"}</button>
// // // // // // // // // //                                     ) : (
// // // // // // // // // //                                         <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : 'grey', color:'white'}}>
// // // // // // // // // //                                             <i className="fa-solid fa-upload"></i> {formData.goproVideo ? "GoPro Uploaded ✅" : "Upload GoPro (Pending)"}
// // // // // // // // // //                                             <input type="file" accept="video/*" style={{display:'none'}} onChange={(e) => handleFileChange(e, 'goproVideo')} />
// // // // // // // // // //                                         </label>
// // // // // // // // // //                                     )}
// // // // // // // // // //                                 </div>
// // // // // // // // // //                             </div>
// // // // // // // // // //                         )}
// // // // // // // // // //                     </div>

// // // // // // // // // //                     {/* Surveyor */}
// // // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // // //                         <div style={styles.row}>
// // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // // //                         </div>
// // // // // // // // // //                         {!viewOnly && !initialData && (
// // // // // // // // // //                             <div style={styles.row}>
// // // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // // //                                     <label style={{...styles.mediaBtn, ...getBtnStyle(formData.selfie, true)}}>
// // // // // // // // // //                                         {formData.selfie ? "Selfie Taken ✅" : "🤳 Take Team Selfie"}
// // // // // // // // // //                                         <input type="file" accept="image/*" capture="user" style={{display:'none'}} onChange={(e) => handleFileChange(e, 'selfie')} />
// // // // // // // // // //                                     </label>
// // // // // // // // // //                                 </div>
// // // // // // // // // //                             </div>
// // // // // // // // // //                         )}
// // // // // // // // // //                     </div>

// // // // // // // // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}

// // // // // // // // // //                 </form>
// // // // // // // // // //             </div>
// // // // // // // // // //         </div>
// // // // // // // // // //     );
// // // // // // // // // // };

// // // // // // // // // // export default SurveyForm;


// // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // import GeoCamera from './GeoCamera';

// // // // // // // // // const LOCATION_TYPES = [
// // // // // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // // // // ];

// // // // // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// // // // // // // // //     const [formData, setFormData] = useState(initialData || {
// // // // // // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // // // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // // // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // // // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // // // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // // // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // // // // // //     });

// // // // // // // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // // // // // // //     const [cameraMode, setCameraMode] = useState(null);

// // // // // // // // //     useEffect(() => {
// // // // // // // // //         if (pickedCoords && !viewOnly) {
// // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // // // // // //         }
// // // // // // // // //     }, [pickedCoords, viewOnly]);

// // // // // // // // //     const handleChange = (e) => {
// // // // // // // // //         if (viewOnly) return;
// // // // // // // // //         const { name, value } = e.target; 
// // // // // // // // //         setFormData(prev => ({ ...prev, [name]: value })); 
// // // // // // // // //     };

// // // // // // // // //     const handleCameraCapture = (url, blob) => {
// // // // // // // // //         if (cameraMode === 'video') setFormData(prev => ({ ...prev, liveVideo: url, liveVideoBlob: blob }));
// // // // // // // // //         else if (cameraMode === 'photo') setFormData(prev => ({ ...prev, sitePhoto: url, sitePhotoBlob: blob }));
// // // // // // // // //         else if (cameraMode === 'selfie') setFormData(prev => ({ ...prev, selfie: url, selfieBlob: blob }));
// // // // // // // // //         setShowGeoCamera(false);
// // // // // // // // //     };

// // // // // // // // //     const handleFileChange = (e) => {
// // // // // // // // //         if (e.target.files[0]) {
// // // // // // // // //             setFormData(prev => ({ 
// // // // // // // // //                 ...prev, 
// // // // // // // // //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// // // // // // // // //                 goproBlob: e.target.files[0] 
// // // // // // // // //             }));
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const handleGetGPS = () => {
// // // // // // // // //         if (viewOnly) return;
// // // // // // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // // // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // // // // // //             alert("GPS Captured!");
// // // // // // // // //         });
// // // // // // // // //     };

// // // // // // // // //     const generateFileName = () => {
// // // // // // // // //         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
// // // // // // // // //         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
// // // // // // // // //         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
// // // // // // // // //     };

// // // // // // // // //     const handleSubmit = async (e) => {
// // // // // // // // //         e.preventDefault();
// // // // // // // // //         if (viewOnly) return;

// // // // // // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // // // // // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // // // // // // //         const generatedFileName = formData.generatedFileName || generateFileName();
// // // // // // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // // // // // //     };

// // // // // // // // //     const styles = {
// // // // // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // // // // // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // // // // // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // // // // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // // // // // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // // // // // // //         col: { flex: 1, minWidth:'200px' },
// // // // // // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // // // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // // // // // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // // // // // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // // // // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
// // // // // // // // //     };

// // // // // // // // //     return (
// // // // // // // // //         <div style={styles.overlay}>
// // // // // // // // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // // // // // // // //             <div style={styles.container}>
// // // // // // // // //                 <div style={styles.header}>
// // // // // // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // // // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // // // // // //                 </div>
                
// // // // // // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // // // // // //                     <div style={styles.row}>
// // // // // // // // //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // // // // // // //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
// // // // // // // // //                     </div>

// // // // // // // // //                     <div style={styles.row}>
// // // // // // // // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // //                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // // // // // // // //                     </div>

// // // // // // // // //                     <div style={styles.row}>
// // // // // // // // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // //                     </div>

// // // // // // // // //                     <div style={styles.row}>
// // // // // // // // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // //                     </div>

// // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // //                         <label style={styles.label}>8. Location Point</label>
// // // // // // // // //                         {!viewOnly && (
// // // // // // // // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // // // // // // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // // // // // // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // // // // // // //                             </div>
// // // // // // // // //                         )}
// // // // // // // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // // // // // // //                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
// // // // // // // // //                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
// // // // // // // // //                         </div>
// // // // // // // // //                     </div>

// // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // //                         <label style={styles.label}>9. Location Type</label>
// // // // // // // // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // // // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // // // // // // //                         </select>
// // // // // // // // //                     </div>

// // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
// // // // // // // // //                         <div style={styles.row}>
// // // // // // // // //                             <div style={styles.col}>
// // // // // // // // //                                 {formData.sitePhoto ? (
// // // // // // // // //                                     <button type="button" style={{...styles.btn, background:'green', cursor:'default'}}>Photo Captured ✅</button>
// // // // // // // // //                                 ) : (
// // // // // // // // //                                     !viewOnly && !initialData && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>Capture Live Photo</button>
// // // // // // // // //                                 )}
// // // // // // // // //                             </div>
// // // // // // // // //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // //                                     {formData.liveVideo ? (
// // // // // // // // //                                         <button type="button" style={{...styles.btn, background:'green', cursor:'default'}}>Video Recorded ✅</button>
// // // // // // // // //                                     ) : (
// // // // // // // // //                                         !viewOnly && !initialData && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>Record Live Video</button>
// // // // // // // // //                                     )}
// // // // // // // // //                                 </div>
// // // // // // // // //                             )}
// // // // // // // // //                         </div>
// // // // // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // // // //                             <div style={styles.row}>
// // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // //                                     {viewOnly ? (
// // // // // // // // //                                         <button type="button" style={{...styles.btn, background: formData.goproVideo ? 'green' : 'grey', color:'white'}}>GoPro: {formData.goproVideo ? "Uploaded" : "Pending"}</button>
// // // // // // // // //                                     ) : (
// // // // // // // // //                                         <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
// // // // // // // // //                                             {formData.goproVideo ? "GoPro Uploaded ✅" : "Upload GoPro (Opt)"}
// // // // // // // // //                                             <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // // // // // // //                                         </label>
// // // // // // // // //                                     )}
// // // // // // // // //                                 </div>
// // // // // // // // //                             </div>
// // // // // // // // //                         )}
// // // // // // // // //                     </div>

// // // // // // // // //                     <div style={styles.locSection}>
// // // // // // // // //                         <div style={styles.row}>
// // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // // // //                         </div>
// // // // // // // // //                         {!viewOnly && !initialData && (
// // // // // // // // //                             <div style={styles.row}>
// // // // // // // // //                                 <div style={styles.col}>
// // // // // // // // //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>Take Team Selfie</button>
// // // // // // // // //                                 </div>
// // // // // // // // //                             </div>
// // // // // // // // //                         )}
// // // // // // // // //                     </div>

// // // // // // // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE" : "SUBMIT"}</button>}
// // // // // // // // //                 </form>
// // // // // // // // //             </div>
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };

// // // // // // // // // export default SurveyForm;


// // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // import GeoCamera from './GeoCamera';

// // // // // // // // const LOCATION_TYPES = [
// // // // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // // // ];

// // // // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// // // // // // // //     const [formData, setFormData] = useState(initialData || {
// // // // // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // // // // //     });

// // // // // // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // // // // // //     const [cameraMode, setCameraMode] = useState(null);

// // // // // // // //     useEffect(() => {
// // // // // // // //         if (pickedCoords && !viewOnly) {
// // // // // // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // // // // //         }
// // // // // // // //     }, [pickedCoords, viewOnly]);

// // // // // // // //     const handleChange = (e) => {
// // // // // // // //         if (viewOnly) return;
// // // // // // // //         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
// // // // // // // //     };

// // // // // // // //     // Capture Callback
// // // // // // // //     const handleCameraCapture = (url, blob) => {
// // // // // // // //         if (cameraMode === 'video') setFormData(prev => ({ ...prev, liveVideo: url, liveVideoBlob: blob }));
// // // // // // // //         else if (cameraMode === 'photo') setFormData(prev => ({ ...prev, sitePhoto: url, sitePhotoBlob: blob }));
// // // // // // // //         else if (cameraMode === 'selfie') setFormData(prev => ({ ...prev, selfie: url, selfieBlob: blob }));
// // // // // // // //         setShowGeoCamera(false);
// // // // // // // //     };

// // // // // // // //     const handleFileChange = (e) => {
// // // // // // // //         if (e.target.files[0]) {
// // // // // // // //             setFormData(prev => ({ 
// // // // // // // //                 ...prev, 
// // // // // // // //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// // // // // // // //                 goproBlob: e.target.files[0] 
// // // // // // // //             }));
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const handleGetGPS = () => {
// // // // // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // // // // //             alert("GPS Captured!");
// // // // // // // //         });
// // // // // // // //     };

// // // // // // // //     const handleSubmit = async (e) => {
// // // // // // // //         e.preventDefault();
// // // // // // // //         const generatedFileName = `${formData.district.substring(0,3)}_${formData.locationType.substring(0,3)}_SHOT${formData.shotNumber}`;
// // // // // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // // // // //     };

// // // // // // // //     const styles = {
// // // // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
// // // // // // // //         container: { background: 'white', width: '95%', maxWidth: '600px', height: '90%', overflowY: 'auto', padding: '20px', borderRadius: '8px' },
// // // // // // // //         row: { display: 'flex', gap: '10px', marginBottom: '10px' },
// // // // // // // //         col: { flex: 1 },
// // // // // // // //         input: { width: '100%', padding: '8px', marginBottom: '5px', boxSizing:'border-box' },
// // // // // // // //         btn: { width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginTop:'5px' }
// // // // // // // //     };

// // // // // // // //     return (
// // // // // // // //         <div style={styles.overlay}>
// // // // // // // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // // // // // // //             <div style={styles.container}>
// // // // // // // //                 <h3>{initialData ? "Edit" : "New"} Survey</h3>
// // // // // // // //                 <form onSubmit={handleSubmit}>
// // // // // // // //                     <div style={styles.row}>
// // // // // // // //                         <div style={styles.col}><label>District</label><select name="district" value={formData.district} onChange={handleChange} style={styles.input} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // // // // // //                         <div style={styles.col}><label>Block</label><select name="block" value={formData.block} onChange={handleChange} style={styles.input} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
// // // // // // // //                     </div>
                    
// // // // // // // //                     <label>Route Name</label><input name="routeName" value={formData.routeName} onChange={handleChange} style={styles.input} required />
                    
// // // // // // // //                     <div style={styles.row}>
// // // // // // // //                         <div style={styles.col}><label>Start Loc</label><input name="startLocName" value={formData.startLocName} onChange={handleChange} style={styles.input} required /></div>
// // // // // // // //                         <div style={styles.col}><label>End Loc</label><input name="endLocName" value={formData.endLocName} onChange={handleChange} style={styles.input} required /></div>
// // // // // // // //                     </div>

// // // // // // // //                     <div style={styles.row}>
// // // // // // // //                         <div style={styles.col}><label>Ring No</label><input name="ringNumber" value={formData.ringNumber} onChange={handleChange} style={styles.input} required /></div>
// // // // // // // //                         <div style={styles.col}><label>Shot No</label><input name="shotNumber" value={formData.shotNumber} onChange={handleChange} style={styles.input} required /></div>
// // // // // // // //                     </div>

// // // // // // // //                     <div style={{background:'#eee', padding:'10px', marginBottom:'10px'}}>
// // // // // // // //                         <label>Location (Lat/Lng)</label>
// // // // // // // //                         {!viewOnly && <div style={{display:'flex', gap:'5px', marginBottom:'5px'}}><button type="button" onClick={handleGetGPS} style={{...styles.btn, background:'green'}}>Get GPS</button><button type="button" onClick={onPickLocation} style={styles.btn}>Map Pick</button></div>}
// // // // // // // //                         <div style={{display:'flex', gap:'5px'}}><input value={formData.latitude} readOnly style={styles.input} /><input value={formData.longitude} readOnly style={styles.input} /></div>
// // // // // // // //                     </div>

// // // // // // // //                     <label>Location Type</label>
// // // // // // // //                     <select name="locationType" value={formData.locationType} onChange={handleChange} style={styles.input} required><option value="">Select</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>

// // // // // // // //                     <div style={{border:'1px solid #ccc', padding:'10px', marginTop:'10px'}}>
// // // // // // // //                         <h4>Media</h4>
// // // // // // // //                         <div style={styles.row}>
// // // // // // // //                             <button type="button" style={{...styles.btn, background: formData.sitePhoto ? 'green':'#d32f2f'}} onClick={()=>{setCameraMode('photo'); setShowGeoCamera(true)}}>Capture Photo</button>
// // // // // // // //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && <button type="button" style={{...styles.btn, background: formData.liveVideo ? 'green':'#d32f2f'}} onClick={()=>{setCameraMode('video'); setShowGeoCamera(true)}}>Record Video</button>}
// // // // // // // //                         </div>
// // // // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && <div style={{marginTop:'5px'}}><label>Upload GoPro (Opt)</label><input type="file" onChange={handleFileChange} /></div>}
// // // // // // // //                     </div>

// // // // // // // //                     <div style={styles.row}><div style={styles.col}><label>Surveyor</label><input name="surveyorName" value={formData.surveyorName} onChange={handleChange} style={styles.input} required /></div><div style={styles.col}><label>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} onChange={handleChange} style={styles.input} required /></div></div>
// // // // // // // //                     {!viewOnly && <button type="button" style={{...styles.btn, background: formData.selfie ? 'green':'blue'}} onClick={()=>{setCameraMode('selfie'); setShowGeoCamera(true)}}>Take Selfie</button>}

// // // // // // // //                     <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
// // // // // // // //                         {!viewOnly && <button type="submit" style={{...styles.btn, background:'#e65100', fontSize:'16px'}}>SUBMIT</button>}
// // // // // // // //                         <button type="button" onClick={onClose} style={{...styles.btn, background:'#555'}}>CANCEL</button>
// // // // // // // //                     </div>
// // // // // // // //                 </form>
// // // // // // // //             </div>
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };

// // // // // // // // export default SurveyForm;









// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import JSZip from 'jszip';
// // // // // // // import { saveAs } from 'file-saver';
// // // // // // // import GeoCamera from './GeoCamera';
// // // // // // // import LocationMap from './LocationMap';

// // // // // // // const LOCATION_TYPES = [
// // // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // // ];

// // // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// // // // // // //     // 1. Maintain existing state structure
// // // // // // //     const [formData, setFormData] = useState(initialData || {
// // // // // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // // // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // // // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // // // // //         surveyorName: user || '', surveyorMobile: '',
// // // // // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // // // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // // // // //     });

// // // // // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // // // // //     const [cameraMode, setCameraMode] = useState(null);

// // // // // // //     // 2. Handle GPS updates from Map Pick
// // // // // // //     useEffect(() => {
// // // // // // //         if (pickedCoords && !viewOnly) {
// // // // // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // // // //         }
// // // // // // //     }, [pickedCoords, viewOnly]);

// // // // // // //     const handleChange = (e) => {
// // // // // // //         if (viewOnly) return;
// // // // // // //         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
// // // // // // //     };

// // // // // // //     // 3. NEW: Enhanced Capture Handler (Handles Blob + Coordinates from GeoCamera)
// // // // // // //     const handleCameraCapture = (blob, coords) => {
// // // // // // //         const url = URL.createObjectURL(blob);
        
// // // // // // //         // Update Form Data with Media AND the specific GPS coords where video was taken
// // // // // // //         if (cameraMode === 'video') {
// // // // // // //             setFormData(prev => ({ 
// // // // // // //                 ...prev, 
// // // // // // //                 liveVideo: url, 
// // // // // // //                 liveVideoBlob: blob,
// // // // // // //                 // Optional: Update global lat/long to match where video was taken
// // // // // // //                 latitude: coords.lat.toFixed(6),
// // // // // // //                 longitude: coords.lon.toFixed(6)
// // // // // // //             }));
// // // // // // //         } 
// // // // // // //         else if (cameraMode === 'photo') {
// // // // // // //             setFormData(prev => ({ 
// // // // // // //                 ...prev, 
// // // // // // //                 sitePhoto: url, 
// // // // // // //                 sitePhotoBlob: blob,
// // // // // // //                 latitude: coords.lat.toFixed(6),
// // // // // // //                 longitude: coords.lon.toFixed(6)
// // // // // // //             }));
// // // // // // //         } 
// // // // // // //         else if (cameraMode === 'selfie') {
// // // // // // //             setFormData(prev => ({ ...prev, selfie: url, selfieBlob: blob }));
// // // // // // //         }
// // // // // // //         setShowGeoCamera(false);
// // // // // // //     };

// // // // // // //     // 4. NEW: Download Functions (ZIP & MP4)
// // // // // // //     const downloadMedia = (type, isZip) => {
// // // // // // //         const blob = type === 'video' ? formData.liveVideoBlob : formData.sitePhotoBlob;
// // // // // // //         if (!blob) return;

// // // // // // //         const filename = `Survey_${formData.routeName}_${type}`;
        
// // // // // // //         if (isZip) {
// // // // // // //             const zip = new JSZip();
// // // // // // //             const ext = type === 'video' ? 'mp4' : 'jpg';
// // // // // // //             zip.file(`${filename}.${ext}`, blob);
            
// // // // // // //             // Add text metadata
// // // // // // //             const meta = `Date: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}`;
// // // // // // //             zip.file("details.txt", meta);

// // // // // // //             zip.generateAsync({ type: "blob" }).then(content => {
// // // // // // //                 saveAs(content, `${filename}.zip`);
// // // // // // //             });
// // // // // // //         } else {
// // // // // // //             // Direct Download
// // // // // // //             const ext = type === 'video' ? 'mp4' : 'jpg';
// // // // // // //             saveAs(blob, `${filename}.${ext}`);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     // Standard File Upload Handler
// // // // // // //     const handleFileChange = (e) => {
// // // // // // //         if (e.target.files[0]) {
// // // // // // //             setFormData(prev => ({ 
// // // // // // //                 ...prev, 
// // // // // // //                 goproVideo: URL.createObjectURL(e.target.files[0]), 
// // // // // // //                 goproBlob: e.target.files[0] 
// // // // // // //             }));
// // // // // // //         }
// // // // // // //     };

// // // // // // //     // Standard GPS Handler
// // // // // // //     const handleGetGPS = () => {
// // // // // // //         if (viewOnly) return;
// // // // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // // // //             alert("GPS Captured!");
// // // // // // //         });
// // // // // // //     };

// // // // // // //     const handleSubmit = async (e) => {
// // // // // // //         e.preventDefault();
// // // // // // //         if (viewOnly) return;
// // // // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // // // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // // // // //         const generatedFileName = `${formData.district.substring(0,3)}_${formData.locationType.substring(0,3)}_SHOT${formData.shotNumber}`;
// // // // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // // // //     };

// // // // // // //     // STYLES
// // // // // // //     const styles = {
// // // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // // // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // // // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // // // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // // // // //         col: { flex: 1, minWidth:'200px' },
// // // // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // // // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // // // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
        
// // // // // // //         // NEW STYLES FOR PREVIEW CARD
// // // // // // //         previewCard: { marginTop:'10px', background:'#f8f9fa', padding:'10px', borderRadius:'8px', border:'1px solid #ddd' },
// // // // // // //         downloadRow: { display:'flex', gap:'5px', marginTop:'10px' },
// // // // // // //         downBtn: { flex:1, padding:'8px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white' }
// // // // // // //     };

// // // // // // //     return (
// // // // // // //         <div style={styles.overlay}>
// // // // // // //             {/* The Camera Component */}
// // // // // // //             {showGeoCamera && (
// // // // // // //                 <GeoCamera 
// // // // // // //                     mode={cameraMode} 
// // // // // // //                     onCapture={handleCameraCapture} 
// // // // // // //                     onClose={() => setShowGeoCamera(false)} 
// // // // // // //                     metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} 
// // // // // // //                 />
// // // // // // //             )}
            
// // // // // // //             <div style={styles.container}>
// // // // // // //                 <div style={styles.header}>
// // // // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // // // //                 </div>
                
// // // // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // // // //                     {/* --- STANDARD FORM FIELDS (UNCHANGED) --- */}
// // // // // // //                     <div style={styles.row}>
// // // // // // //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // // // // //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
// // // // // // //                     </div>

// // // // // // //                     <div style={styles.row}>
// // // // // // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // //                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // // // // // //                     </div>

// // // // // // //                     <div style={styles.row}>
// // // // // // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // //                     </div>

// // // // // // //                     <div style={styles.row}>
// // // // // // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // //                     </div>

// // // // // // //                     <div style={styles.locSection}>
// // // // // // //                         <label style={styles.label}>8. Location Point</label>
// // // // // // //                         {!viewOnly && (
// // // // // // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // // // // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // // // // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // // // // //                             </div>
// // // // // // //                         )}
// // // // // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // // // // //                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
// // // // // // //                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
// // // // // // //                         </div>
// // // // // // //                     </div>

// // // // // // //                     <div style={styles.locSection}>
// // // // // // //                         <label style={styles.label}>9. Location Type</label>
// // // // // // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // // // // //                         </select>
// // // // // // //                     </div>

// // // // // // //                     {/* --- UPDATED MEDIA EVIDENCE SECTION --- */}
// // // // // // //                     <div style={styles.locSection}>
// // // // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // // // // // //                         {/* PHOTO SECTION */}
// // // // // // //                         <div style={{marginBottom:'15px'}}>
// // // // // // //                             <label style={styles.label}>Site Photo</label>
// // // // // // //                             {formData.sitePhoto ? (
// // // // // // //                                 <div style={styles.previewCard}>
// // // // // // //                                     <img src={formData.sitePhoto} alt="Site" style={{width:'100%', borderRadius:'4px', maxHeight:'200px', objectFit:'cover'}} />
                                    
// // // // // // //                                     {/* Map underneath photo */}
// // // // // // //                                     <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
                                    
// // // // // // //                                     <div style={styles.downloadRow}>
// // // // // // //                                         <button type="button" onClick={()=>downloadMedia('photo', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
// // // // // // //                                         <button type="button" onClick={()=>downloadMedia('photo', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // // // // // //                                         {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, sitePhoto:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // // // // // //                                     </div>
// // // // // // //                                 </div>
// // // // // // //                             ) : (
// // // // // // //                                 !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>📷 Capture Photo (Required)</button>
// // // // // // //                             )}
// // // // // // //                         </div>

// // // // // // //                         {/* VIDEO SECTION */}
// // // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // //                             <div style={{marginBottom:'15px'}}>
// // // // // // //                                 <label style={styles.label}>Live Video</label>
// // // // // // //                                 {formData.liveVideo ? (
// // // // // // //                                     <div style={styles.previewCard}>
// // // // // // //                                         <video src={formData.liveVideo} controls style={{width:'100%', borderRadius:'4px', maxHeight:'200px', background:'black'}} />
                                        
// // // // // // //                                         {/* Map underneath video */}
// // // // // // //                                         <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
                                        
// // // // // // //                                         <div style={styles.downloadRow}>
// // // // // // //                                             <button type="button" onClick={()=>downloadMedia('video', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ MP4</button>
// // // // // // //                                             <button type="button" onClick={()=>downloadMedia('video', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // // // // // //                                             {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, liveVideo:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // // // // // //                                         </div>
// // // // // // //                                     </div>
// // // // // // //                                 ) : (
// // // // // // //                                     !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>🎥 Record Video (Required)</button>
// // // // // // //                                 )}
// // // // // // //                             </div>
// // // // // // //                         )}

// // // // // // //                         {/* GOPRO UPLOAD */}
// // // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // // //                             <div style={{marginTop:'10px'}}>
// // // // // // //                                 <label style={styles.label}>GoPro Upload (Optional)</label>
// // // // // // //                                 {viewOnly ? (
// // // // // // //                                     <button type="button" style={{...styles.btn, background: formData.goproVideo ? 'green' : 'grey', color:'white'}}>GoPro: {formData.goproVideo ? "Uploaded" : "Pending"}</button>
// // // // // // //                                 ) : (
// // // // // // //                                     <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
// // // // // // //                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro File"}
// // // // // // //                                         <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // // // // //                                     </label>
// // // // // // //                                 )}
// // // // // // //                             </div>
// // // // // // //                         )}
// // // // // // //                     </div>

// // // // // // //                     {/* SURVEYOR */}
// // // // // // //                     <div style={styles.locSection}>
// // // // // // //                         <div style={styles.row}>
// // // // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // // //                         </div>
// // // // // // //                         {!viewOnly && !initialData && (
// // // // // // //                             <div style={styles.row}>
// // // // // // //                                 <div style={styles.col}>
// // // // // // //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>🤳 Take Team Selfie</button>
// // // // // // //                                 </div>
// // // // // // //                             </div>
// // // // // // //                         )}
// // // // // // //                     </div>

// // // // // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
// // // // // // //                 </form>
// // // // // // //             </div>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // };

// // // // // // // export default SurveyForm;





// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import JSZip from 'jszip';
// // // // // // import { saveAs } from 'file-saver';
// // // // // // import GeoCamera from './GeoCamera';
// // // // // // import LocationMap from './LocationMap'; // Ensure you have the LocationMap file from previous step

// // // // // // const LOCATION_TYPES = [
// // // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // // ];

// // // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
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

// // // // // //     useEffect(() => {
// // // // // //         if (pickedCoords && !viewOnly) {
// // // // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // // //         }
// // // // // //     }, [pickedCoords, viewOnly]);

// // // // // //     const handleChange = (e) => {
// // // // // //         if (viewOnly) return;
// // // // // //         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
// // // // // //     };

// // // // // //     // --- CAPTURE HANDLER ---
// // // // // //     const handleCameraCapture = (url, blob) => {
// // // // // //         // Update Form Data
// // // // // //         if (cameraMode === 'video') {
// // // // // //             setFormData(prev => ({ ...prev, liveVideo: url, liveVideoBlob: blob }));
// // // // // //         } 
// // // // // //         else if (cameraMode === 'photo') {
// // // // // //             // URL here is the DataURL with EXIF injected
// // // // // //             setFormData(prev => ({ ...prev, sitePhoto: url, sitePhotoBlob: blob }));
// // // // // //         } 
// // // // // //         else if (cameraMode === 'selfie') {
// // // // // //             setFormData(prev => ({ ...prev, selfie: url, selfieBlob: blob }));
// // // // // //         }
// // // // // //         setShowGeoCamera(false);
// // // // // //     };

// // // // // //     // --- DOWNLOAD LOGIC (ZIP & FILE) ---
// // // // // //     const downloadMedia = (type, isZip) => {
// // // // // //         const blob = type === 'video' ? formData.liveVideoBlob : formData.sitePhotoBlob;
// // // // // //         if (!blob) return;

// // // // // //         const ext = type === 'video' ? 'mp4' : 'jpg'; // Ensure JPG extension
// // // // // //         const filename = `Survey_${formData.routeName}_${type}`;
        
// // // // // //         if (isZip) {
// // // // // //             const zip = new JSZip();
// // // // // //             zip.file(`${filename}.${ext}`, blob);
            
// // // // // //             // Add metadata text file
// // // // // //             const meta = `Date: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}\nSurveyor: ${formData.surveyorName}`;
// // // // // //             zip.file("details.txt", meta);

// // // // // //             zip.generateAsync({ type: "blob" }).then(content => {
// // // // // //                 saveAs(content, `${filename}.zip`);
// // // // // //             });
// // // // // //         } else {
// // // // // //             saveAs(blob, `${filename}.${ext}`);
// // // // // //         }
// // // // // //     };

// // // // // //     // Standard Handlers
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
        
// // // // // //         const generatedFileName = `${formData.district.substring(0,3)}_${formData.locationType.substring(0,3)}_SHOT${formData.shotNumber}`;
// // // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // // //     };

// // // // // //     const styles = {
// // // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // // // //         col: { flex: 1, minWidth:'200px' },
// // // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
        
// // // // // //         previewCard: { marginTop:'10px', background:'#fff', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 1px 3px rgba(0,0,0,0.1)' },
// // // // // //         downloadRow: { display:'flex', gap:'5px', marginTop:'10px' },
// // // // // //         downBtn: { flex:1, padding:'8px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white' }
// // // // // //     };

// // // // // //     return (
// // // // // //         <div style={styles.overlay}>
// // // // // //             {showGeoCamera && (
// // // // // //                 <GeoCamera 
// // // // // //                     mode={cameraMode} 
// // // // // //                     onCapture={handleCameraCapture} 
// // // // // //                     onClose={() => setShowGeoCamera(false)} 
// // // // // //                     metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} 
// // // // // //                 />
// // // // // //             )}
            
// // // // // //             <div style={styles.container}>
// // // // // //                 <div style={styles.header}>
// // // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // // //                 </div>
                
// // // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // // //                     {/* STANDARD FIELDS */}
// // // // // //                     <div style={styles.row}>
// // // // // //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // // // //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
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

// // // // // //                     {/* MEDIA EVIDENCE - PREVIEW SECTION */}
// // // // // //                     <div style={styles.locSection}>
// // // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // // // // //                         {/* PHOTO */}
// // // // // //                         <div style={{marginBottom:'15px'}}>
// // // // // //                             <label style={styles.label}>Site Photo</label>
// // // // // //                             {formData.sitePhoto ? (
// // // // // //                                 <div style={styles.previewCard}>
// // // // // //                                     <img src={formData.sitePhoto} alt="Site" style={{width:'100%', borderRadius:'4px', maxHeight:'250px', objectFit:'contain', background:'black'}} />
                                    
// // // // // //                                     {/* Map Preview */}
// // // // // //                                     <div style={{marginTop:'5px', height:'150px'}}>
// // // // // //                                         <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
// // // // // //                                     </div>

// // // // // //                                     <div style={styles.downloadRow}>
// // // // // //                                         <button type="button" onClick={()=>downloadMedia('photo', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
// // // // // //                                         <button type="button" onClick={()=>downloadMedia('photo', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // // // // //                                         {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, sitePhoto:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // // // // //                                     </div>
// // // // // //                                 </div>
// // // // // //                             ) : (
// // // // // //                                 !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>📷 Capture Photo</button>
// // // // // //                             )}
// // // // // //                         </div>

// // // // // //                         {/* VIDEO */}
// // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // //                             <div style={{marginBottom:'15px'}}>
// // // // // //                                 <label style={styles.label}>Live Video</label>
// // // // // //                                 {formData.liveVideo ? (
// // // // // //                                     <div style={styles.previewCard}>
// // // // // //                                         <video src={formData.liveVideo} controls style={{width:'100%', borderRadius:'4px', maxHeight:'250px', background:'black'}} />
                                        
// // // // // //                                         <div style={{marginTop:'5px', height:'150px'}}>
// // // // // //                                             <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
// // // // // //                                         </div>

// // // // // //                                         <div style={styles.downloadRow}>
// // // // // //                                             <button type="button" onClick={()=>downloadMedia('video', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ MP4</button>
// // // // // //                                             <button type="button" onClick={()=>downloadMedia('video', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // // // // //                                             {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, liveVideo:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // // // // //                                         </div>
// // // // // //                                     </div>
// // // // // //                                 ) : (
// // // // // //                                     !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>🎥 Record Video</button>
// // // // // //                                 )}
// // // // // //                             </div>
// // // // // //                         )}

// // // // // //                         {/* GOPRO UPLOAD */}
// // // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // // //                             <div style={{marginTop:'10px'}}>
// // // // // //                                 <label style={styles.label}>GoPro Upload (Optional)</label>
// // // // // //                                 {viewOnly ? (
// // // // // //                                     <button type="button" style={{...styles.btn, background: formData.goproVideo ? 'green' : 'grey', color:'white'}}>GoPro: {formData.goproVideo ? "Uploaded" : "Pending"}</button>
// // // // // //                                 ) : (
// // // // // //                                     <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
// // // // // //                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro File"}
// // // // // //                                         <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // // // //                                     </label>
// // // // // //                                 )}
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                     </div>

// // // // // //                     {/* SURVEYOR */}
// // // // // //                     <div style={styles.locSection}>
// // // // // //                         <div style={styles.row}>
// // // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // // //                         </div>
// // // // // //                         {!viewOnly && !initialData && (
// // // // // //                             <div style={styles.row}>
// // // // // //                                 <div style={styles.col}>
// // // // // //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>🤳 Take Team Selfie</button>
// // // // // //                                 </div>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                     </div>

// // // // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
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
// // // // // import LocationMap from './LocationMap';

// // // // // const LOCATION_TYPES = [
// // // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // // ];

// // // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
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

// // // // //     useEffect(() => {
// // // // //         if (pickedCoords && !viewOnly) {
// // // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // // //         }
// // // // //     }, [pickedCoords, viewOnly]);

// // // // //     const handleChange = (e) => {
// // // // //         if (viewOnly) return;
// // // // //         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); 
// // // // //     };

// // // // //     // --- CAPTURE HANDLER (FIXED: Uses captured Coords) ---
// // // // //     const handleCameraCapture = (url, blob, capturedCoords) => {
// // // // //         const updates = {};
        
// // // // //         // If the camera returned valid coordinates, update the form location!
// // // // //         if (capturedCoords && capturedCoords.lat && capturedCoords.lon) {
// // // // //             updates.latitude = capturedCoords.lat.toFixed(6);
// // // // //             updates.longitude = capturedCoords.lon.toFixed(6);
// // // // //             // Also update datetime
// // // // //             updates.dateTime = new Date().toLocaleString();
// // // // //         }

// // // // //         if (cameraMode === 'video') {
// // // // //             updates.liveVideo = url;
// // // // //             updates.liveVideoBlob = blob;
// // // // //         } 
// // // // //         else if (cameraMode === 'photo') {
// // // // //             updates.sitePhoto = url;
// // // // //             updates.sitePhotoBlob = blob;
// // // // //         } 
// // // // //         else if (cameraMode === 'selfie') {
// // // // //             updates.selfie = url;
// // // // //             updates.selfieBlob = blob;
// // // // //         }

// // // // //         setFormData(prev => ({ ...prev, ...updates }));
// // // // //         setShowGeoCamera(false);
// // // // //     };

// // // // //     // --- DOWNLOAD LOGIC ---
// // // // //     const downloadMedia = (type, isZip) => {
// // // // //         const blob = type === 'video' ? formData.liveVideoBlob : formData.sitePhotoBlob;
// // // // //         if (!blob) return;

// // // // //         const ext = type === 'video' ? 'mp4' : 'jpg'; 
// // // // //         const filename = `Survey_${formData.routeName}_${type}`;
        
// // // // //         if (isZip) {
// // // // //             const zip = new JSZip();
// // // // //             zip.file(`${filename}.${ext}`, blob);
            
// // // // //             const meta = `Date: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}\nSurveyor: ${formData.surveyorName}`;
// // // // //             zip.file("details.txt", meta);

// // // // //             zip.generateAsync({ type: "blob" }).then(content => {
// // // // //                 saveAs(content, `${filename}.zip`);
// // // // //             });
// // // // //         } else {
// // // // //             saveAs(blob, `${filename}.${ext}`);
// // // // //         }
// // // // //     };

// // // // //     // Standard Handlers
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
// // // // //         if (viewOnly) return;
// // // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // // //             alert("GPS Captured!");
// // // // //         });
// // // // //     };

// // // // //     const handleSubmit = async (e) => {
// // // // //         e.preventDefault();
// // // // //         if (viewOnly) return;
// // // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // // //         const generatedFileName = `${formData.district.substring(0,3)}_${formData.locationType.substring(0,3)}_SHOT${formData.shotNumber}`;
// // // // //         onSubmitData({ ...formData, generatedFileName });
// // // // //     };

// // // // //     const styles = {
// // // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // // //         col: { flex: 1, minWidth:'200px' },
// // // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
        
// // // // //         previewCard: { marginTop:'10px', background:'#fff', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 1px 3px rgba(0,0,0,0.1)' },
// // // // //         downloadRow: { display:'flex', gap:'5px', marginTop:'10px' },
// // // // //         downBtn: { flex:1, padding:'8px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white' }
// // // // //     };

// // // // //     return (
// // // // //         <div style={styles.overlay}>
// // // // //             {showGeoCamera && (
// // // // //                 <GeoCamera 
// // // // //                     mode={cameraMode} 
// // // // //                     onCapture={handleCameraCapture} 
// // // // //                     onClose={() => setShowGeoCamera(false)} 
// // // // //                     metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} 
// // // // //                 />
// // // // //             )}
            
// // // // //             <div style={styles.container}>
// // // // //                 <div style={styles.header}>
// // // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // // //                 </div>
                
// // // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // // //                     {/* STANDARD FIELDS */}
// // // // //                     <div style={styles.row}>
// // // // //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // // //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
// // // // //                     </div>

// // // // //                     <div style={styles.row}>
// // // // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // // // //                     </div>

// // // // //                     <div style={styles.row}>
// // // // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                     </div>

// // // // //                     <div style={styles.row}>
// // // // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                     </div>

// // // // //                     <div style={styles.locSection}>
// // // // //                         <label style={styles.label}>8. Location Point</label>
// // // // //                         {!viewOnly && (
// // // // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // // //                             </div>
// // // // //                         )}
// // // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // // //                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
// // // // //                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
// // // // //                         </div>
// // // // //                     </div>

// // // // //                     <div style={styles.locSection}>
// // // // //                         <label style={styles.label}>9. Location Type</label>
// // // // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // // //                         </select>
// // // // //                     </div>

// // // // //                     {/* MEDIA EVIDENCE - PREVIEW SECTION */}
// // // // //                     <div style={styles.locSection}>
// // // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // // // //                         {/* PHOTO */}
// // // // //                         <div style={{marginBottom:'15px'}}>
// // // // //                             <label style={styles.label}>Site Photo</label>
// // // // //                             {formData.sitePhoto ? (
// // // // //                                 <div style={styles.previewCard}>
// // // // //                                     <img src={formData.sitePhoto} alt="Site" style={{width:'100%', borderRadius:'4px', maxHeight:'250px', objectFit:'contain', background:'black'}} />
                                    
// // // // //                                     {/* Map Preview: Uses the latitude from form data which is now auto-updated */}
// // // // //                                     <div style={{marginTop:'5px', height:'150px'}}>
// // // // //                                         <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
// // // // //                                     </div>

// // // // //                                     <div style={styles.downloadRow}>
// // // // //                                         <button type="button" onClick={()=>downloadMedia('photo', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
// // // // //                                         <button type="button" onClick={()=>downloadMedia('photo', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // // // //                                         {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, sitePhoto:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // // // //                                     </div>
// // // // //                                 </div>
// // // // //                             ) : (
// // // // //                                 !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>📷 Capture Photo</button>
// // // // //                             )}
// // // // //                         </div>

// // // // //                         {/* VIDEO */}
// // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // //                             <div style={{marginBottom:'15px'}}>
// // // // //                                 <label style={styles.label}>Live Video</label>
// // // // //                                 {formData.liveVideo ? (
// // // // //                                     <div style={styles.previewCard}>
// // // // //                                         <video src={formData.liveVideo} controls style={{width:'100%', borderRadius:'4px', maxHeight:'250px', background:'black'}} />
                                        
// // // // //                                         <div style={{marginTop:'5px', height:'150px'}}>
// // // // //                                             <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
// // // // //                                         </div>

// // // // //                                         <div style={styles.downloadRow}>
// // // // //                                             <button type="button" onClick={()=>downloadMedia('video', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ MP4</button>
// // // // //                                             <button type="button" onClick={()=>downloadMedia('video', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // // // //                                             {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, liveVideo:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // // // //                                         </div>
// // // // //                                     </div>
// // // // //                                 ) : (
// // // // //                                     !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>🎥 Record Video</button>
// // // // //                                 )}
// // // // //                             </div>
// // // // //                         )}

// // // // //                         {/* GOPRO UPLOAD */}
// // // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // // //                             <div style={{marginTop:'10px'}}>
// // // // //                                 <label style={styles.label}>GoPro Upload (Optional)</label>
// // // // //                                 {viewOnly ? (
// // // // //                                     <button type="button" style={{...styles.btn, background: formData.goproVideo ? 'green' : 'grey', color:'white'}}>GoPro: {formData.goproVideo ? "Uploaded" : "Pending"}</button>
// // // // //                                 ) : (
// // // // //                                     <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
// // // // //                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro File"}
// // // // //                                         <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // // //                                     </label>
// // // // //                                 )}
// // // // //                             </div>
// // // // //                         )}
// // // // //                     </div>

// // // // //                     {/* SURVEYOR */}
// // // // //                     <div style={styles.locSection}>
// // // // //                         <div style={styles.row}>
// // // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // // //                         </div>
// // // // //                         {!viewOnly && !initialData && (
// // // // //                             <div style={styles.row}>
// // // // //                                 <div style={styles.col}>
// // // // //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>🤳 Take Team Selfie</button>
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         )}
// // // // //                     </div>

// // // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
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
// // // // import LocationMap from './LocationMap';

// // // // const LOCATION_TYPES = [
// // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // ];

// // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// // // //     const [formData, setFormData] = useState(initialData || {
// // // //         district: '', block: '', routeName: '', dateTime: '', 
// // // //         startLocName: '', endLocName: '', ringNumber: '', 
// // // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // // //         surveyorName: user || '', surveyorMobile: '',
// // // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // // //     });

// // // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // // //     const [cameraMode, setCameraMode] = useState(null);

// // // //     useEffect(() => {
// // // //         if (pickedCoords && !viewOnly) {
// // // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // //         }
// // // //     }, [pickedCoords, viewOnly]);

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
// // // //         const blob = type === 'video' ? formData.liveVideoBlob : formData.sitePhotoBlob;
// // // //         if (!blob) return;
// // // //         const ext = type === 'video' ? 'mp4' : 'jpg'; 
// // // //         const filename = `Survey_${formData.routeName}_${type}`;
        
// // // //         if (isZip) {
// // // //             const zip = new JSZip();
// // // //             zip.file(`${filename}.${ext}`, blob);
// // // //             const meta = `Date: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}`;
// // // //             zip.file("details.txt", meta);
// // // //             zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${filename}.zip`));
// // // //         } else {
// // // //             saveAs(blob, `${filename}.${ext}`);
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
// // // //         if (viewOnly) return;
// // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // //             alert("GPS Captured!");
// // // //         });
// // // //     };

// // // //     const handleSubmit = async (e) => {
// // // //         e.preventDefault();
// // // //         if (viewOnly) return;
// // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // //         const generatedFileName = `${formData.district.substring(0,3)}_${formData.locationType.substring(0,3)}_SHOT${formData.shotNumber}`;
// // // //         onSubmitData({ ...formData, generatedFileName });
// // // //     };

// // // //     const styles = {
// // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
// // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
// // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' }, // Enables scrolling inside modal
// // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // //         col: { flex: 1, minWidth:'200px' },
// // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
        
// // // //         // --- FIXED PREVIEW CARD STYLE ---
// // // //         previewCard: { 
// // // //             marginTop:'10px', 
// // // //             background:'#fff', 
// // // //             padding:'15px', 
// // // //             borderRadius:'8px', 
// // // //             border:'1px solid #ddd', 
// // // //             boxShadow:'0 2px 5px rgba(0,0,0,0.05)',
// // // //             display: 'flex',
// // // //             flexDirection: 'column',
// // // //             gap: '15px' // Adds space between Image -> Map -> Buttons
// // // //         },
        
// // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // //         downloadRow: { display:'flex', gap:'10px' },
// // // //         downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white' },
        
// // // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' }
// // // //     };

// // // //     return (
// // // //         <div style={styles.overlay}>
// // // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // // //             <div style={styles.container}>
// // // //                 <div style={styles.header}>
// // // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // //                 </div>
                
// // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // //                     {/* STANDARD FIELDS */}
// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // // //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
// // // //                     </div>

// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // // //                     </div>

// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                     </div>

// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                     </div>

// // // //                     <div style={styles.locSection}>
// // // //                         <label style={styles.label}>8. Location Point</label>
// // // //                         {!viewOnly && (
// // // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // //                             </div>
// // // //                         )}
// // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // //                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
// // // //                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
// // // //                         </div>
// // // //                     </div>

// // // //                     <div style={styles.locSection}>
// // // //                         <label style={styles.label}>9. Location Type</label>
// // // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // //                         </select>
// // // //                     </div>

// // // //                     {/* --- MEDIA EVIDENCE (FIXED LAYOUT) --- */}
// // // //                     <div style={styles.locSection}>
// // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // // //                         {/* PHOTO SECTION */}
// // // //                         <div style={{marginBottom:'20px'}}>
// // // //                             <label style={styles.label}>Site Photo</label>
// // // //                             {formData.sitePhoto ? (
// // // //                                 <div style={styles.previewCard}>
// // // //                                     <img src={formData.sitePhoto} alt="Site" style={{width:'100%', borderRadius:'4px', maxHeight:'300px', objectFit:'contain', background:'black'}} />
                                    
// // // //                                     {/* Map Component - No fixed wrapper height */}
// // // //                                     <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
                                    
// // // //                                     <div style={styles.downloadRow}>
// // // //                                         <button type="button" onClick={()=>downloadMedia('photo', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
// // // //                                         <button type="button" onClick={()=>downloadMedia('photo', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // // //                                         {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, sitePhoto:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // // //                                     </div>
// // // //                                 </div>
// // // //                             ) : (
// // // //                                 !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>📷 Capture Photo</button>
// // // //                             )}
// // // //                         </div>

// // // //                         {/* VIDEO SECTION */}
// // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // //                             <div style={{marginBottom:'20px'}}>
// // // //                                 <label style={styles.label}>Live Video</label>
// // // //                                 {formData.liveVideo ? (
// // // //                                     <div style={styles.previewCard}>
// // // //                                         <video src={formData.liveVideo} controls style={{width:'100%', borderRadius:'4px', maxHeight:'300px', background:'black'}} />
                                        
// // // //                                         {/* Map Component - No fixed wrapper height */}
// // // //                                         <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
                                        
// // // //                                         <div style={styles.downloadRow}>
// // // //                                             <button type="button" onClick={()=>downloadMedia('video', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ MP4</button>
// // // //                                             <button type="button" onClick={()=>downloadMedia('video', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // // //                                             {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, liveVideo:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // // //                                         </div>
// // // //                                     </div>
// // // //                                 ) : (
// // // //                                     !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>🎥 Record Video</button>
// // // //                                 )}
// // // //                             </div>
// // // //                         )}

// // // //                         {/* GOPRO UPLOAD */}
// // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // //                             <div style={{marginTop:'15px'}}>
// // // //                                 <label style={styles.label}>GoPro Upload (Optional)</label>
// // // //                                 {viewOnly ? (
// // // //                                     <button type="button" style={{...styles.btn, background: formData.goproVideo ? 'green' : 'grey', color:'white'}}>GoPro: {formData.goproVideo ? "Uploaded" : "Pending"}</button>
// // // //                                 ) : (
// // // //                                     <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
// // // //                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro File"}
// // // //                                         <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // //                                     </label>
// // // //                                 )}
// // // //                             </div>
// // // //                         )}
// // // //                     </div>

// // // //                     {/* SURVEYOR */}
// // // //                     <div style={styles.locSection}>
// // // //                         <div style={styles.row}>
// // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // // //                         </div>
// // // //                         {!viewOnly && !initialData && (
// // // //                             <div style={styles.row}>
// // // //                                 <div style={styles.col}>
// // // //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>🤳 Take Team Selfie</button>
// // // //                                 </div>
// // // //                             </div>
// // // //                         )}
// // // //                     </div>

// // // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
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

// // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// // //     const [formData, setFormData] = useState(initialData || {
// // //         district: '', block: '', routeName: '', dateTime: '', 
// // //         startLocName: '', endLocName: '', ringNumber: '', 
// // //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// // //         surveyorName: user || '', surveyorMobile: '',
// // //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// // //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// // //     });

// // //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// // //     const [cameraMode, setCameraMode] = useState(null);

// // //     useEffect(() => {
// // //         if (pickedCoords && !viewOnly) {
// // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // //         }
// // //     }, [pickedCoords, viewOnly]);

// // //     const handleChange = (e) => {
// // //         if (viewOnly) return; // Prevent editing
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
// // //         const blob = type === 'video' ? formData.liveVideoBlob : formData.sitePhotoBlob;
// // //         if (!blob) return; // If coming from DB, we might need to handle URL download differently (not covered here for simplicity)

// // //         const ext = type === 'video' ? 'mp4' : 'jpg'; 
// // //         const filename = `Survey_${formData.routeName}_${type}`;
        
// // //         if (isZip) {
// // //             const zip = new JSZip();
// // //             zip.file(`${filename}.${ext}`, blob);
// // //             const meta = `Date: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}`;
// // //             zip.file("details.txt", meta);
// // //             zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${filename}.zip`));
// // //         } else {
// // //             saveAs(blob, `${filename}.${ext}`);
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
// // //         if (viewOnly) return;
// // //         navigator.geolocation.getCurrentPosition((pos) => {
// // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // //             alert("GPS Captured!");
// // //         });
// // //     };

// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();
// // //         if (viewOnly) return; // Prevent submission in view mode
        
// // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // //         const generatedFileName = `${formData.district.substring(0,3)}_${formData.locationType.substring(0,3)}_SHOT${formData.shotNumber}`;
// // //         onSubmitData({ ...formData, generatedFileName });
// // //     };

// // //     const styles = {
// // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
// // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
// // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // //         col: { flex: 1, minWidth:'200px' },
// // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // //         // Greyed out background for viewOnly
// // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', color: viewOnly ? '#555' : 'black', fontSize:'14px', boxSizing:'border-box' },
// // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', color: viewOnly ? '#555' : 'black', fontSize:'14px', boxSizing:'border-box' },
// // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
        
// // //         previewCard: { 
// // //             marginTop:'10px', 
// // //             background:'#fff', 
// // //             padding:'15px', 
// // //             borderRadius:'8px', 
// // //             border:'1px solid #ddd', 
// // //             boxShadow:'0 2px 5px rgba(0,0,0,0.05)',
// // //             display: 'flex',
// // //             flexDirection: 'column',
// // //             gap: '15px'
// // //         },
        
// // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // //         downloadRow: { display:'flex', gap:'10px' },
// // //         downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white' },
        
// // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' }
// // //     };

// // //     return (
// // //         <div style={styles.overlay}>
// // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // //             <div style={styles.container}>
// // //                 <div style={styles.header}>
// // //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // //                 </div>
                
// // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // //                     {/* STANDARD FIELDS - ALL DISABLED IN VIEW MODE */}
// // //                     <div style={styles.row}>
// // //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// // //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
// // //                     </div>

// // //                     <div style={styles.row}>
// // //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// // //                     </div>

// // //                     <div style={styles.row}>
// // //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                     </div>

// // //                     <div style={styles.row}>
// // //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                     </div>

// // //                     <div style={styles.locSection}>
// // //                         <label style={styles.label}>8. Location Point</label>
// // //                         {!viewOnly && (
// // //                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // //                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // //                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // //                             </div>
// // //                         )}
// // //                         <div style={{display:'flex', gap:'10px'}}>
// // //                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
// // //                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
// // //                         </div>
// // //                     </div>

// // //                     <div style={styles.locSection}>
// // //                         <label style={styles.label}>9. Location Type</label>
// // //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // //                         </select>
// // //                     </div>

// // //                     {/* --- MEDIA EVIDENCE SECTION --- */}
// // //                     <div style={styles.locSection}>
// // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // //                         {/* PHOTO SECTION */}
// // //                         <div style={{marginBottom:'20px'}}>
// // //                             <label style={styles.label}>Site Photo</label>
// // //                             {formData.sitePhoto ? (
// // //                                 <div style={styles.previewCard}>
// // //                                     <img src={formData.sitePhoto} alt="Site" style={{width:'100%', borderRadius:'4px', maxHeight:'300px', objectFit:'contain', background:'black'}} />
                                    
// // //                                     {/* Map Component */}
// // //                                     <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
                                    
// // //                                     <div style={styles.downloadRow}>
// // //                                         <button type="button" onClick={()=>downloadMedia('photo', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
// // //                                         <button type="button" onClick={()=>downloadMedia('photo', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // //                                         {/* HIDE DELETE BUTTON IN VIEW ONLY MODE */}
// // //                                         {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, sitePhoto:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // //                                     </div>
// // //                                 </div>
// // //                             ) : (
// // //                                 // HIDE CAPTURE BUTTON IN VIEW ONLY MODE
// // //                                 !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>📷 Capture Photo</button>
// // //                             )}
// // //                         </div>

// // //                         {/* VIDEO SECTION */}
// // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // //                             <div style={{marginBottom:'20px'}}>
// // //                                 <label style={styles.label}>Live Video</label>
// // //                                 {formData.liveVideo ? (
// // //                                     <div style={styles.previewCard}>
// // //                                         <video src={formData.liveVideo} controls style={{width:'100%', borderRadius:'4px', maxHeight:'300px', background:'black'}} />
                                        
// // //                                         {/* Map Component */}
// // //                                         <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
                                        
// // //                                         <div style={styles.downloadRow}>
// // //                                             <button type="button" onClick={()=>downloadMedia('video', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ MP4</button>
// // //                                             <button type="button" onClick={()=>downloadMedia('video', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// // //                                             {/* HIDE DELETE BUTTON IN VIEW ONLY MODE */}
// // //                                             {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, liveVideo:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// // //                                         </div>
// // //                                     </div>
// // //                                 ) : (
// // //                                     // HIDE RECORD BUTTON IN VIEW ONLY MODE
// // //                                     !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>🎥 Record Video</button>
// // //                                 )}
// // //                             </div>
// // //                         )}

// // //                         {/* GOPRO UPLOAD */}
// // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // //                             <div style={{marginTop:'15px'}}>
// // //                                 <label style={styles.label}>GoPro Upload</label>
// // //                                 {viewOnly ? (
// // //                                     // READ ONLY STATUS
// // //                                     <div style={{padding:'10px', background:'#e9ecef', borderRadius:'4px', color:'#555', fontSize:'13px', textAlign:'center'}}>
// // //                                         {formData.goproVideo ? "✅ GoPro Video Available" : "No GoPro Video Uploaded"}
// // //                                     </div>
// // //                                 ) : (
// // //                                     <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
// // //                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro File"}
// // //                                         <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // //                                     </label>
// // //                                 )}
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     {/* SURVEYOR */}
// // //                     <div style={styles.locSection}>
// // //                         <div style={styles.row}>
// // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                         </div>
// // //                         {!viewOnly && !initialData && (
// // //                             <div style={styles.row}>
// // //                                 <div style={styles.col}>
// // //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>🤳 Take Team Selfie</button>
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     {/* SUBMIT BUTTON HIDDEN IN VIEW ONLY */}
// // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
                    
// // //                     {/* CLOSE BUTTON */}
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

// // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
// //     const [formData, setFormData] = useState(initialData || {
// //         district: '', block: '', routeName: '', dateTime: '', 
// //         startLocName: '', endLocName: '', ringNumber: '', 
// //         latitude: '', longitude: '', locationType: '', shotNumber: '', 
// //         surveyorName: user || '', surveyorMobile: '',
// //         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
// //         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
// //     });

// //     const [showGeoCamera, setShowGeoCamera] = useState(false);
// //     const [cameraMode, setCameraMode] = useState(null);

// //     useEffect(() => {
// //         if (pickedCoords && !viewOnly) {
// //             setFormData(prev => ({ 
// //                 ...prev, 
// //                 latitude: pickedCoords.lat.toFixed(6), 
// //                 longitude: pickedCoords.lng.toFixed(6),
// //                 dateTime: new Date().toLocaleString() 
// //             }));
// //         }
// //     }, [pickedCoords, viewOnly]);

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
// //         const blob = type === 'video' ? formData.liveVideoBlob : formData.sitePhotoBlob;
// //         if (!blob) return;

// //         const ext = type === 'video' ? 'mp4' : 'jpg'; 
// //         const filename = `Survey_${formData.routeName}_${type}`;
        
// //         if (isZip) {
// //             const zip = new JSZip();
// //             zip.file(`${filename}.${ext}`, blob);
// //             const meta = `Date: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}`;
// //             zip.file("details.txt", meta);
// //             zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${filename}.zip`));
// //         } else {
// //             saveAs(blob, `${filename}.${ext}`);
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
// //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// //         const generatedFileName = `${formData.district.substring(0,3)}_${formData.locationType.substring(0,3)}_SHOT${formData.shotNumber}`;
// //         onSubmitData({ ...formData, generatedFileName });
// //     };

// //     const styles = {
// //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
// //         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
// //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// //         col: { flex: 1, minWidth:'200px' },
// //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// //         previewCard: { marginTop:'10px', background:'#fff', padding:'15px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
// //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// //         downloadRow: { display:'flex', gap:'10px' },
// //         downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white' },
// //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' }
// //     };

// //     return (
// //         <div style={styles.overlay}>
// //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// //             <div style={styles.container}>
// //                 <div style={styles.header}>
// //                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// //                 </div>
                
// //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// //                     <div style={styles.row}>
// //                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
// //                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
// //                     </div>

// //                     <div style={styles.row}>
// //                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
// //                     </div>

// //                     <div style={styles.row}>
// //                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                     </div>

// //                     <div style={styles.row}>
// //                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
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
// //                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
// //                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
// //                         </div>
// //                     </div>

// //                     <div style={styles.locSection}>
// //                         <label style={styles.label}>9. Location Type</label>
// //                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// //                         </select>
// //                     </div>

// //                     <div style={styles.locSection}>
// //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// //                         <div style={{marginBottom:'20px'}}>
// //                             <label style={styles.label}>Site Photo</label>
// //                             {formData.sitePhoto ? (
// //                                 <div style={styles.previewCard}>
// //                                     <img src={formData.sitePhoto} alt="Site" style={{width:'100%', borderRadius:'4px', maxHeight:'300px', objectFit:'contain', background:'black'}} />
// //                                     <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
// //                                     <div style={styles.downloadRow}>
// //                                         <button type="button" onClick={()=>downloadMedia('photo', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
// //                                         <button type="button" onClick={()=>downloadMedia('photo', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// //                                         {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, sitePhoto:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// //                                     </div>
// //                                 </div>
// //                             ) : (
// //                                 !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>📷 Capture Photo</button>
// //                             )}
// //                         </div>

// //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// //                             <div style={{marginBottom:'20px'}}>
// //                                 <label style={styles.label}>Live Video</label>
// //                                 {formData.liveVideo ? (
// //                                     <div style={styles.previewCard}>
// //                                         <video src={formData.liveVideo} controls style={{width:'100%', borderRadius:'4px', maxHeight:'300px', background:'black'}} />
// //                                         <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
// //                                         <div style={styles.downloadRow}>
// //                                             <button type="button" onClick={()=>downloadMedia('video', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ MP4</button>
// //                                             <button type="button" onClick={()=>downloadMedia('video', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
// //                                             {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, liveVideo:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
// //                                         </div>
// //                                     </div>
// //                                 ) : (
// //                                     !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>🎥 Record Video</button>
// //                                 )}
// //                             </div>
// //                         )}

// //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// //                             <div style={{marginTop:'15px'}}>
// //                                 <label style={styles.label}>GoPro Upload (Optional)</label>
// //                                 {viewOnly ? (
// //                                     <div style={{padding:'10px', background:'#e9ecef', borderRadius:'4px', color:'#555', fontSize:'13px', textAlign:'center'}}>{formData.goproVideo ? "✅ GoPro Video Available" : "No GoPro Video Uploaded"}</div>
// //                                 ) : (
// //                                     <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
// //                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro File"}
// //                                         <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// //                                     </label>
// //                                 )}
// //                             </div>
// //                         )}
// //                     </div>

// //                     <div style={styles.locSection}>
// //                         <div style={styles.row}>
// //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// //                         </div>
// //                         {!viewOnly && !initialData && (
// //                             <div style={styles.row}>
// //                                 <div style={styles.col}>
// //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>🤳 Take Team Selfie</button>
// //                                 </div>
// //                             </div>
// //                         )}
// //                     </div>

// //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
                    
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

// const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
//     const [formData, setFormData] = useState(initialData || {
//         district: '', block: '', routeName: '', dateTime: '', 
//         startLocName: '', endLocName: '', ringNumber: '', 
//         latitude: '', longitude: '', locationType: '', shotNumber: '', 
//         surveyorName: user || '', surveyorMobile: '',
//         liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
//         liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
//     });

//     const [showGeoCamera, setShowGeoCamera] = useState(false);
//     const [cameraMode, setCameraMode] = useState(null);

//     useEffect(() => {
//         if (pickedCoords && !viewOnly) {
//             setFormData(prev => ({ 
//                 ...prev, 
//                 latitude: pickedCoords.lat.toFixed(6), 
//                 longitude: pickedCoords.lng.toFixed(6),
//                 dateTime: new Date().toLocaleString() 
//             }));
//         }
//     }, [pickedCoords, viewOnly]);

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
//         // FIX: Handle 'selfie' type for blob selection
//         let blob;
//         if (type === 'video') blob = formData.liveVideoBlob;
//         else if (type === 'selfie') blob = formData.selfieBlob;
//         else blob = formData.sitePhotoBlob;

//         if (!blob) return;

//         const ext = type === 'video' ? 'mp4' : 'jpg'; 
//         const filename = `Survey_${formData.routeName}_${type}`;
        
//         if (isZip) {
//             const zip = new JSZip();
//             zip.file(`${filename}.${ext}`, blob);
//             const meta = `Date: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}`;
//             zip.file("details.txt", meta);
//             zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${filename}.zip`));
//         } else {
//             saveAs(blob, `${filename}.${ext}`);
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
//         navigator.geolocation.getCurrentPosition((pos) => {
//             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
//             alert("GPS Captured!");
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (viewOnly) return;
//         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
//         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
//         const generatedFileName = `${formData.district.substring(0,3)}_${formData.locationType.substring(0,3)}_SHOT${formData.shotNumber}`;
//         onSubmitData({ ...formData, generatedFileName });
//     };

//     const styles = {
//         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
//         container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
//         body: { flex: 1, overflowY: 'auto', padding: '20px' },
//         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
//         col: { flex: 1, minWidth:'200px' },
//         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
//         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
//         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
//         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
//         previewCard: { marginTop:'10px', background:'#fff', padding:'15px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
//         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
//         downloadRow: { display:'flex', gap:'10px' },
//         downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white' },
//         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
//         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
//         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
//         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' }
//     };

//     return (
//         <div style={styles.overlay}>
//             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
//             <div style={styles.container}>
//                 <div style={styles.header}>
//                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
//                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
//                 </div>
                
//                 <form style={styles.body} onSubmit={handleSubmit}>
                    
//                     {/* STANDARD FIELDS */}
//                     <div style={styles.row}>
//                         <div style={styles.col}><label style={styles.label}>1. District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
//                         <div style={styles.col}><label style={styles.label}>2. Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
//                     </div>

//                     <div style={styles.row}>
//                         <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                         <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
//                     </div>

//                     <div style={styles.row}>
//                         <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                         <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                     </div>

//                     <div style={styles.row}>
//                         <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                         <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                     </div>

//                     <div style={styles.locSection}>
//                         <label style={styles.label}>8. Location Point</label>
//                         {!viewOnly && (
//                             <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
//                                 <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
//                                 <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
//                             </div>
//                         )}
//                         <div style={{display:'flex', gap:'10px'}}>
//                             <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
//                             <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
//                         </div>
//                     </div>

//                     <div style={styles.locSection}>
//                         <label style={styles.label}>9. Location Type</label>
//                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
//                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
//                         </select>
//                     </div>

//                     <div style={styles.locSection}>
//                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
//                         <div style={{marginBottom:'20px'}}>
//                             <label style={styles.label}>Site Photo</label>
//                             {formData.sitePhoto ? (
//                                 <div style={styles.previewCard}>
//                                     <img src={formData.sitePhoto} alt="Site" style={{width:'100%', borderRadius:'4px', maxHeight:'300px', objectFit:'contain', background:'black'}} />
//                                     <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
//                                     <div style={styles.downloadRow}>
//                                         <button type="button" onClick={()=>downloadMedia('photo', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
//                                         <button type="button" onClick={()=>downloadMedia('photo', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
//                                         {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, sitePhoto:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
//                                     </div>
//                                 </div>
//                             ) : (
//                                 !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>📷 Capture Photo</button>
//                             )}
//                         </div>

//                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
//                             <div style={{marginBottom:'20px'}}>
//                                 <label style={styles.label}>Live Video</label>
//                                 {formData.liveVideo ? (
//                                     <div style={styles.previewCard}>
//                                         <video src={formData.liveVideo} controls style={{width:'100%', borderRadius:'4px', maxHeight:'300px', background:'black'}} />
//                                         <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
//                                         <div style={styles.downloadRow}>
//                                             <button type="button" onClick={()=>downloadMedia('video', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ MP4</button>
//                                             <button type="button" onClick={()=>downloadMedia('video', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
//                                             {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, liveVideo:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>🎥 Record Video</button>
//                                 )}
//                             </div>
//                         )}

//                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
//                             <div style={{marginTop:'15px'}}>
//                                 <label style={styles.label}>GoPro Upload (Optional)</label>
//                                 {viewOnly ? (
//                                     <div style={{padding:'10px', background:'#e9ecef', borderRadius:'4px', color:'#555', fontSize:'13px', textAlign:'center'}}>{formData.goproVideo ? "✅ GoPro Video Available" : "No GoPro Video Uploaded"}</div>
//                                 ) : (
//                                     <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
//                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro File"}
//                                         <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
//                                     </label>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     <div style={styles.locSection}>
//                         <div style={styles.row}>
//                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                         </div>
                        
//                         {/* --- FIX: SELFIE PREVIEW & DOWNLOAD --- */}
//                         <div style={{marginTop:'15px'}}>
//                             <label style={styles.label}>Team Selfie</label>
//                             {formData.selfie ? (
//                                 <div style={styles.previewCard}>
//                                     <img src={formData.selfie} alt="Selfie" style={{width:'100%', borderRadius:'4px', maxHeight:'250px', objectFit:'cover'}} />
//                                     <div style={styles.downloadRow}>
//                                         <button type="button" onClick={()=>downloadMedia('selfie', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
//                                         <button type="button" onClick={()=>downloadMedia('selfie', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
//                                         {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, selfie:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
//                                     </div>
//                                 </div>
//                             ) : (
//                                 !viewOnly && !initialData && <button type="button" style={{...styles.btn, background: '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>🤳 Take Team Selfie</button>
//                             )}
//                         </div>
//                     </div>

//                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
                    
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

// FIX: Added default empty arrays for districts and blocks to prevent 'map' undefined error
const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts = [], blocks = [], onSubmitData, user, initialData, viewOnly }) => {
    const [formData, setFormData] = useState(initialData || {
        district: '', block: '', routeName: '', dateTime: '', 
        startLocName: '', endLocName: '', ringNumber: '', 
        latitude: '', longitude: '', locationType: '', shotNumber: '', 
        surveyorName: user || '', surveyorMobile: '',
        liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
        liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
    });

    const [showGeoCamera, setShowGeoCamera] = useState(false);
    const [cameraMode, setCameraMode] = useState(null);

    useEffect(() => {
        if (pickedCoords && !viewOnly) {
            setFormData(prev => ({ 
                ...prev, 
                latitude: pickedCoords.lat.toFixed(6), 
                longitude: pickedCoords.lng.toFixed(6),
                dateTime: new Date().toLocaleString() 
            }));
        }
    }, [pickedCoords, viewOnly]);

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
        if (type === 'video') blob = formData.liveVideoBlob;
        else if (type === 'selfie') blob = formData.selfieBlob;
        else blob = formData.sitePhotoBlob;

        if (!blob) return;

        const ext = type === 'video' ? 'mp4' : 'jpg'; 
        
        // Clean Filename with GPS
        const lat = parseFloat(formData.latitude).toFixed(5);
        const lon = parseFloat(formData.longitude).toFixed(5);
        const cleanRoute = formData.routeName ? formData.routeName.replace(/[^a-zA-Z0-9]/g, '_') : 'Route';
        const filename = `${cleanRoute}_Lat_${lat}_Lon_${lon}_${type}`;
        
        if (isZip) {
            const zip = new JSZip();
            zip.file(`${filename}.${ext}`, blob);
            const meta = `Date: ${new Date().toLocaleString()}\nLat: ${formData.latitude}\nLon: ${formData.longitude}\nRoute: ${formData.routeName}`;
            zip.file("details.txt", meta);
            zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${filename}.zip`));
        } else {
            saveAs(blob, `${filename}.${ext}`);
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
        navigator.geolocation.getCurrentPosition((pos) => {
            setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
            alert("GPS Captured!");
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (viewOnly) return;
        if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
        if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
        const generatedFileName = `${formData.district.substring(0,3)}_${formData.locationType.substring(0,3)}_SHOT${formData.shotNumber}`;
        onSubmitData({ ...formData, generatedFileName });
    };

    const requestFullscreen = (id) => {
        const elem = document.getElementById(id);
        if (elem) {
            if (elem.requestFullscreen) elem.requestFullscreen();
            else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        }
    };

    const styles = {
        overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
        container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
        body: { flex: 1, overflowY: 'auto', padding: '20px' },
        row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
        col: { flex: 1, minWidth:'200px' },
        label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
        input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
        select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
        locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
        previewCard: { marginTop:'10px', background:'#fff', padding:'15px', borderRadius:'8px', border:'1px solid #ddd', boxShadow:'0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
        mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
        downloadRow: { display:'flex', gap:'10px' },
        downBtn: { flex:1, padding:'10px', fontSize:'12px', borderRadius:'4px', border:'none', cursor:'pointer', fontWeight:'bold', color:'white' },
        btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
        gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
        pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
        submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop:'10px' },
        fullScreenBtn: { position:'absolute', top:'10px', right:'10px', background:'rgba(0,0,0,0.6)', color:'white', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontSize:'12px', fontWeight:'bold', zIndex:10 }
    };

    // Helper to safely flatten blocks if it's an array of arrays
    const flatBlocks = Array.isArray(blocks) ? blocks.flat() : [];

    return (
        <div style={styles.overlay}>
            {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
            <div style={styles.container}>
                <div style={styles.header}>
                    <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
                    <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
                </div>
                
                <form style={styles.body} onSubmit={handleSubmit}>
                    
                    <div style={styles.row}>
                        <div style={styles.col}>
                            <label style={styles.label}>1. District</label>
                            <select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
                                <option value="">Select</option>
                                {/* SAFE MAPPING */}
                                {districts && districts.map(d=><option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div style={styles.col}>
                            <label style={styles.label}>2. Block</label>
                            <select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
                                <option value="">Select</option>
                                {/* SAFE MAPPING */}
                                {flatBlocks.map(b=><option key={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                        <div style={styles.col}><label style={styles.label}>4. Date (GPS)</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>5. Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                        <div style={styles.col}><label style={styles.label}>6. End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>7. Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                        <div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                    </div>

                    <div style={styles.locSection}>
                        <label style={styles.label}>8. Location Point</label>
                        {!viewOnly && (
                            <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                                <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
                                <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
                            </div>
                        )}
                        <div style={{display:'flex', gap:'10px'}}>
                            <input value={formData.latitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lat" />
                            <input value={formData.longitude} readOnly style={{...styles.input, background:'#e9ecef'}} placeholder="Lng" />
                        </div>
                    </div>

                    <div style={styles.locSection}>
                        <label style={styles.label}>9. Location Type</label>
                        <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
                            <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div style={styles.locSection}>
                        <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
                        <div style={{marginBottom:'20px'}}>
                            <label style={styles.label}>Site Photo</label>
                            {formData.sitePhoto ? (
                                <div style={styles.previewCard}>
                                    <div style={{position:'relative'}}>
                                        <img id="sitePhotoImg" src={formData.sitePhoto} alt="Site" style={{width:'100%', borderRadius:'4px', maxHeight:'300px', objectFit:'contain', background:'black'}} />
                                        <div onClick={() => requestFullscreen('sitePhotoImg')} style={styles.fullScreenBtn}>⛶ Fullscreen</div>
                                    </div>
                                    <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
                                    <div style={styles.downloadRow}>
                                        <button type="button" onClick={()=>downloadMedia('photo', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
                                        <button type="button" onClick={()=>downloadMedia('photo', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
                                        {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, sitePhoto:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
                                    </div>
                                </div>
                            ) : (
                                !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>📷 Capture Photo</button>
                            )}
                        </div>

                        {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
                            <div style={{marginBottom:'20px'}}>
                                <label style={styles.label}>Live Video</label>
                                {formData.liveVideo ? (
                                    <div style={styles.previewCard}>
                                        <video src={formData.liveVideo} controls style={{width:'100%', borderRadius:'4px', maxHeight:'300px', background:'black'}} />
                                        <LocationMap lat={parseFloat(formData.latitude)} lng={parseFloat(formData.longitude)} />
                                        <div style={styles.downloadRow}>
                                            <button type="button" onClick={()=>downloadMedia('video', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ MP4</button>
                                            <button type="button" onClick={()=>downloadMedia('video', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
                                            {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, liveVideo:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
                                        </div>
                                    </div>
                                ) : (
                                    !viewOnly && <button type="button" style={{...styles.mediaBtn, background:'#d32f2f', color:'white'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>🎥 Record Video</button>
                                )}
                            </div>
                        )}

                        {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
                            <div style={{marginTop:'15px'}}>
                                <label style={styles.label}>GoPro Upload (Optional)</label>
                                {viewOnly ? (
                                    <div style={{padding:'10px', background:'#e9ecef', borderRadius:'4px', color:'#555', fontSize:'13px', textAlign:'center'}}>{formData.goproVideo ? "✅ GoPro Video Available" : "No GoPro Video Uploaded"}</div>
                                ) : (
                                    <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
                                        {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro File"}
                                        <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={styles.locSection}>
                        <div style={styles.row}>
                            <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                            <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                        </div>
                        
                        <div style={{marginTop:'15px'}}>
                            <label style={styles.label}>Team Selfie</label>
                            {formData.selfie ? (
                                <div style={styles.previewCard}>
                                    <div style={{position:'relative'}}>
                                        <img id="selfieImg" src={formData.selfie} alt="Selfie" style={{width:'100%', borderRadius:'4px', maxHeight:'250px', objectFit:'cover'}} />
                                        <div onClick={() => requestFullscreen('selfieImg')} style={styles.fullScreenBtn}>⛶ Fullscreen</div>
                                    </div>
                                    <div style={styles.downloadRow}>
                                        <button type="button" onClick={()=>downloadMedia('selfie', false)} style={{...styles.downBtn, background:'#43a047'}}>⬇ JPG</button>
                                        <button type="button" onClick={()=>downloadMedia('selfie', true)} style={{...styles.downBtn, background:'#1e88e5'}}>📦 ZIP</button>
                                        {!viewOnly && <button type="button" onClick={()=>setFormData({...formData, selfie:null})} style={{...styles.downBtn, background:'#d32f2f'}}>🗑 Delete</button>}
                                    </div>
                                </div>
                            ) : (
                                !viewOnly && <button type="button" style={{...styles.btn, background: '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>🤳 Take Team Selfie</button>
                            )}
                        </div>
                    </div>

                    {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
                    
                    <button type="button" onClick={onClose} style={{...styles.btn, background:'#555', marginTop:'10px'}}>CLOSE</button>
                </form>
            </div>
        </div>
    );
};

export default SurveyForm;