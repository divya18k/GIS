// // // // import React, { useState, useEffect } from 'react';
// // // // import GeoCamera from './GeoCamera';

// // // // const LOCATION_TYPES = [
// // // //     "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
// // // //     "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
// // // // ];

// // // // const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

// // // // const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData }) => {
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
// // // //         if (pickedCoords) setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // // //     }, [pickedCoords]);

// // // //     const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

// // // //     const handleCameraCapture = (url, blob) => {
// // // //         if (cameraMode === 'video') setFormData(prev => ({ ...prev, liveVideo: url, liveVideoBlob: blob }));
// // // //         else if (cameraMode === 'photo') setFormData(prev => ({ ...prev, sitePhoto: url, sitePhotoBlob: blob }));
// // // //         else if (cameraMode === 'selfie') setFormData(prev => ({ ...prev, selfie: url, selfieBlob: blob }));
// // // //         setShowGeoCamera(false);
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
// // // //         navigator.geolocation.getCurrentPosition((pos) => {
// // // //             setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), dateTime: new Date().toLocaleString() }));
// // // //             alert("GPS Captured!");
// // // //         });
// // // //     };

// // // //     const generateFileName = () => {
// // // //         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
// // // //         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
// // // //         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
// // // //     };

// // // //     const handleSubmit = async (e) => {
// // // //         e.preventDefault();
// // // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // // //         const generatedFileName = generateFileName();
// // // //         onSubmitData({ ...formData, generatedFileName });
// // // //     };

// // // //     const getBtnStyle = (file, isMandatory) => {
// // // //         if (file) return { background: '#2e7d32', color: 'white', border:'1px solid green' }; 
// // // //         if (isMandatory) return { background: '#d32f2f', color: 'white', border:'1px solid red' }; 
// // // //         return { background: '#1976d2', color: 'white', border:'1px solid blue' }; 
// // // //     };

// // // //     const styles = {
// // // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // // //         col: { flex: 1, minWidth:'200px' },
// // // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background:'white', fontSize:'14px', boxSizing:'border-box' },
// // // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background:'white', fontSize:'14px', boxSizing:'border-box' },
// // // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // // //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// // // //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// // // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
// // // //     };

// // // //     return (
// // // //         <div style={styles.overlay}>
// // // //             {showGeoCamera && (
// // // //                 <GeoCamera 
// // // //                     mode={cameraMode} 
// // // //                     onCapture={handleCameraCapture} 
// // // //                     onClose={() => setShowGeoCamera(false)} 
// // // //                     metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} 
// // // //                 />
// // // //             )}
            
// // // //             <div style={styles.container}>
// // // //                 <div style={styles.header}>
// // // //                     <h3 style={{margin:0}}>Field Execution Survey</h3>
// // // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // // //                 </div>
                
// // // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}>
// // // //                             <label style={styles.label}>1. District</label>
// // // //                             <select name="district" value={formData.district} style={styles.select} onChange={handleChange} required>
// // // //                                 <option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}
// // // //                             </select>
// // // //                         </div>
// // // //                         <div style={styles.col}>
// // // //                             <label style={styles.label}>2. Block</label>
// // // //                             <select name="block" value={formData.block} style={styles.select} onChange={handleChange} required>
// // // //                                 <option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}
// // // //                             </select>
// // // //                         </div>
// // // //                     </div>

// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}>
// // // //                             <label style={styles.label}>3. Route Name</label>
// // // //                             <input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} placeholder="Enter Route" required />
// // // //                         </div>
// // // //                         <div style={styles.col}>
// // // //                             <label style={styles.label}>4. Date (GPS)</label>
// // // //                             <input value={formData.dateTime} readOnly placeholder="Click Get GPS" style={{...styles.input, background:'#f0f0f0', color:'#666'}} />
// // // //                         </div>
// // // //                     </div>

// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}><label style={styles.label}>5. Start Location</label><input name="startLocName" style={styles.input} onChange={handleChange} required /></div>
// // // //                         <div style={styles.col}><label style={styles.label}>6. End Location</label><input name="endLocName" style={styles.input} onChange={handleChange} required /></div>
// // // //                     </div>

// // // //                     <div style={styles.row}>
// // // //                         <div style={styles.col}><label style={styles.label}>7. Ring Number</label><input name="ringNumber" style={styles.input} onChange={handleChange} required placeholder="e.g. Ring-01" /></div>
// // // //                         <div style={styles.col}><label style={styles.label}>Shot Number</label><input name="shotNumber" style={styles.input} onChange={handleChange} required placeholder="1" /></div>
// // // //                     </div>

// // // //                     <div style={styles.locSection}>
// // // //                         <label style={styles.label}>8. Location Point</label>
// // // //                         <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
// // // //                             <button type="button" onClick={handleGetGPS} style={styles.gpsBtn}>Get GPS</button>
// // // //                             <button type="button" onClick={onPickLocation} style={styles.pickBtn}>Map Pick</button>
// // // //                         </div>
// // // //                         <div style={{display:'flex', gap:'10px'}}>
// // // //                             <input value={formData.latitude} readOnly placeholder="Lat" style={{...styles.input, background:'#f0f0f0'}} />
// // // //                             <input value={formData.longitude} readOnly placeholder="Lng" style={{...styles.input, background:'#f0f0f0'}} />
// // // //                         </div>
// // // //                     </div>

// // // //                     <div style={styles.locSection}>
// // // //                         <label style={styles.label}>9. Location Type</label>
// // // //                         <select name="locationType" style={styles.select} onChange={handleChange} required>
// // // //                             <option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
// // // //                         </select>
// // // //                     </div>

// // // //                     <div style={styles.locSection}>
// // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
// // // //                         <div style={styles.row}>
// // // //                             <div style={styles.col}>
// // // //                                 <div style={{...styles.mediaBtn, ...getBtnStyle(formData.sitePhoto, true)}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>
// // // //                                     <i className="fa-solid fa-camera"></i> {formData.sitePhoto ? "Photo Captured" : "Capture Live Photo"}
// // // //                                 </div>
// // // //                             </div>
// // // //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // //                                 <div style={styles.col}>
// // // //                                     <div style={{...styles.mediaBtn, ...getBtnStyle(formData.liveVideo, true)}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>
// // // //                                         <i className="fa-solid fa-video"></i> {formData.liveVideo ? "Video Recorded" : "Record Live Video"}
// // // //                                     </div>
// // // //                                 </div>
// // // //                             )}
// // // //                         </div>
// // // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // // //                             <div style={styles.row}>
// // // //                                 <div style={styles.col}>
// // // //                                     <label style={{...styles.mediaBtn, ...getBtnStyle(formData.goproVideo, false)}}>
// // // //                                         <i className="fa-solid fa-upload"></i> {formData.goproVideo ? "GoPro Uploaded" : "Upload GoPro (Later)"}
// // // //                                         <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // // //                                     </label>
// // // //                                 </div>
// // // //                             </div>
// // // //                         )}
// // // //                     </div>

// // // //                     <div style={styles.locSection}>
// // // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Surveyor Details</h4>
// // // //                         <div style={styles.row}>
// // // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} required /></div>
// // // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" style={styles.input} onChange={handleChange} required /></div>
// // // //                         </div>
// // // //                         <div style={styles.row}>
// // // //                             <div style={styles.col}>
// // // //                                 <div style={{...styles.mediaBtn, ...getBtnStyle(formData.selfie, true)}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>
// // // //                                     <i className="fa-solid fa-user"></i> {formData.selfie ? "Selfie Taken" : "Take Team Selfie"}
// // // //                                 </div>
// // // //                             </div>
// // // //                         </div>
// // // //                     </div>

// // // //                 </form>
// // // //                 <button onClick={handleSubmit} style={styles.submitBtn}>SUBMIT SURVEY</button>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };

// // // // export default SurveyForm;


// // // import React, { useState, useEffect } from 'react';
// // // import GeoCamera from './GeoCamera';
// // // import { saveMediaToDisk } from './db';

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

// // //     // If viewing existing data, ensure Lat/Lng are populated
// // //     useEffect(() => {
// // //         if (pickedCoords && !viewOnly) {
// // //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// // //         }
// // //     }, [pickedCoords, viewOnly]);

// // //     const handleChange = (e) => {
// // //         if (viewOnly) return; // Prevent editing in View Mode
// // //         const { name, value } = e.target; 
// // //         setFormData(prev => ({ ...prev, [name]: value })); 
// // //     };

// // //     const handleCameraCapture = (url, blob) => {
// // //         if (cameraMode === 'video') setFormData(prev => ({ ...prev, liveVideo: url, liveVideoBlob: blob }));
// // //         else if (cameraMode === 'photo') setFormData(prev => ({ ...prev, sitePhoto: url, sitePhotoBlob: blob }));
// // //         else if (cameraMode === 'selfie') setFormData(prev => ({ ...prev, selfie: url, selfieBlob: blob }));
// // //         setShowGeoCamera(false);
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

// // //     const generateFileName = () => {
// // //         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
// // //         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
// // //         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
// // //     };

// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();
// // //         if (viewOnly) return;

// // //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// // //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// // //         const generatedFileName = formData.generatedFileName || generateFileName();
// // //         onSubmitData({ ...formData, generatedFileName });
// // //     };

// // //     // Styles
// // //     const styles = {
// // //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// // //         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// // //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// // //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// // //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// // //         col: { flex: 1, minWidth:'200px' },
// // //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// // //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// // //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// // //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// // //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
// // //     };

// // //     return (
// // //         <div style={styles.overlay}>
// // //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// // //             <div style={styles.container}>
// // //                 <div style={styles.header}>
// // //                     <h3 style={{margin:0}}>{viewOnly ? "View Survey Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// // //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// // //                 </div>
                
// // //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// // //                     <div style={styles.row}>
// // //                         <div style={styles.col}>
// // //                             <label style={styles.label}>1. District</label>
// // //                             <select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // //                                 <option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}
// // //                             </select>
// // //                         </div>
// // //                         <div style={styles.col}>
// // //                             <label style={styles.label}>2. Block</label>
// // //                             <select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// // //                                 <option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}
// // //                             </select>
// // //                         </div>
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
// // //                                 <button type="button" onClick={handleGetGPS} style={{...styles.btn, background:'#333'}}>Get GPS</button>
// // //                                 <button type="button" onClick={onPickLocation} style={{...styles.btn, background:'#0288d1'}}>Map Pick</button>
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

// // //                     {/* MEDIA SECTION */}
// // //                     <div style={styles.locSection}>
// // //                         <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
// // //                         <div style={styles.row}>
// // //                             {/* Photo */}
// // //                             <div style={styles.col}>
// // //                                 {formData.sitePhoto ? (
// // //                                     <button type="button" style={{...styles.btn, background:'green'}}>Photo Captured ✅</button>
// // //                                 ) : (
// // //                                     !viewOnly && !initialData && <button type="button" style={{...styles.btn, background:'#d32f2f'}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>Capture Live Photo</button>
// // //                                 )}
// // //                             </div>

// // //                             {/* Video (Only for required types) */}
// // //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // //                                 <div style={styles.col}>
// // //                                     {formData.liveVideo ? (
// // //                                         <button type="button" style={{...styles.btn, background:'green'}}>Video Recorded ✅</button>
// // //                                     ) : (
// // //                                         // If editing, hide record button. If new, show it.
// // //                                         !viewOnly && !initialData && <button type="button" style={{...styles.btn, background:'#d32f2f'}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>Record Live Video</button>
// // //                                     )}
// // //                                 </div>
// // //                             )}
// // //                         </div>

// // //                         {/* GoPro (Editable in Edit Mode) */}
// // //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// // //                             <div style={styles.row}>
// // //                                 <div style={styles.col}>
// // //                                     {viewOnly ? (
// // //                                         <button type="button" style={{...styles.btn, background: formData.goproVideo ? 'green' : 'grey'}}>GoPro: {formData.goproVideo ? "Uploaded" : "Pending"}</button>
// // //                                     ) : (
// // //                                         <label style={{...styles.btn, background: formData.goproVideo ? 'green' : '#0288d1'}}>
// // //                                             {formData.goproVideo ? "GoPro Uploaded ✅" : "Upload GoPro"}
// // //                                             <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// // //                                         </label>
// // //                                     )}
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     {/* Surveyor */}
// // //                     <div style={styles.locSection}>
// // //                         <div style={styles.row}>
// // //                             <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                             <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
// // //                         </div>
// // //                         {!viewOnly && !initialData && (
// // //                             <div style={styles.row}>
// // //                                 <div style={styles.col}>
// // //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>
// // //                                         {formData.selfie ? "Selfie Taken ✅" : "Take Team Selfie"}
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}

// // //                 </form>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default SurveyForm;



// // import React, { useState, useEffect } from 'react';
// // import GeoCamera from './GeoCamera';

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
// //             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
// //         }
// //     }, [pickedCoords, viewOnly]);

// //     const handleChange = (e) => {
// //         if (viewOnly) return;
// //         const { name, value } = e.target; 
// //         setFormData(prev => ({ ...prev, [name]: value })); 
// //     };

// //     const handleCameraCapture = (url, blob) => {
// //         if (cameraMode === 'video') setFormData(prev => ({ ...prev, liveVideo: url, liveVideoBlob: blob }));
// //         else if (cameraMode === 'photo') setFormData(prev => ({ ...prev, sitePhoto: url, sitePhotoBlob: blob }));
// //         else if (cameraMode === 'selfie') setFormData(prev => ({ ...prev, selfie: url, selfieBlob: blob }));
// //         setShowGeoCamera(false);
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

// //     const generateFileName = () => {
// //         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
// //         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
// //         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         if (viewOnly) return;

// //         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
// //         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
// //         const generatedFileName = formData.generatedFileName || generateFileName();
// //         onSubmitData({ ...formData, generatedFileName });
// //     };

// //     const getBtnStyle = (file, isMandatory) => {
// //         if (file) return { background: '#2e7d32', color: 'white', border:'1px solid green' }; 
// //         if (isMandatory) return { background: '#d32f2f', color: 'white', border:'1px solid red' }; 
// //         return { background: '#1976d2', color: 'white', border:'1px solid blue' }; 
// //     };

// //     const styles = {
// //         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
// //         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
// //         header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// //         body: { flex: 1, overflowY: 'auto', padding: '20px' },
// //         row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
// //         col: { flex: 1, minWidth:'200px' },
// //         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
// //         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// //         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
// //         locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
// //         btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
// //         gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// //         pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
// //         mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
// //         submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
// //     };

// //     return (
// //         <div style={styles.overlay}>
// //             {showGeoCamera && <GeoCamera mode={cameraMode} onCapture={handleCameraCapture} onClose={() => setShowGeoCamera(false)} metaData={{ district: formData.district, block: formData.block, route: formData.routeName }} />}
            
// //             <div style={styles.container}>
// //                 <div style={styles.header}>
// //                     <h3 style={{margin:0}}>{viewOnly ? "View Survey Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
// //                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
// //                 </div>
                
// //                 <form style={styles.body} onSubmit={handleSubmit}>
                    
// //                     <div style={styles.row}>
// //                         <div style={styles.col}>
// //                             <label style={styles.label}>1. District</label>
// //                             <select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// //                                 <option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select>
// //                         </div>
// //                         <div style={styles.col}>
// //                             <label style={styles.label}>2. Block</label>
// //                             <select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
// //                                 <option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select>
// //                         </div>
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
                        
// //                         <div style={styles.row}>
// //                             <div style={styles.col}>
// //                                 {formData.sitePhoto ? (
// //                                     <button type="button" style={{...styles.btn, background:'green', cursor:'default'}}>Photo Captured ✅</button>
// //                                 ) : (
// //                                     !viewOnly && !initialData && <button type="button" style={{...styles.mediaBtn, ...getBtnStyle(formData.sitePhoto, true)}} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}><i className="fa-solid fa-camera"></i> Capture Live Photo</button>
// //                                 )}
// //                             </div>
// //                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// //                                 <div style={styles.col}>
// //                                     {formData.liveVideo ? (
// //                                         <button type="button" style={{...styles.btn, background:'green', cursor:'default'}}>Video Recorded ✅</button>
// //                                     ) : (
// //                                         !viewOnly && !initialData && <button type="button" style={{...styles.mediaBtn, ...getBtnStyle(formData.liveVideo, true)}} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}><i className="fa-solid fa-video"></i> Record Live Video</button>
// //                                     )}
// //                                 </div>
// //                             )}
// //                         </div>

// //                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
// //                             <div style={styles.row}>
// //                                 <div style={styles.col}>
// //                                     {viewOnly ? (
// //                                         <button type="button" style={{...styles.btn, background: formData.goproVideo ? 'green' : 'grey'}}>GoPro: {formData.goproVideo ? "Uploaded" : "Pending"}</button>
// //                                     ) : (
// //                                         <label style={{...styles.mediaBtn, ...getBtnStyle(formData.goproVideo, false)}}>
// //                                             <i className="fa-solid fa-upload"></i> {formData.goproVideo ? "GoPro Uploaded ✅" : "Upload GoPro"}
// //                                             <input type="file" accept="video/*" style={{display:'none'}} onChange={handleFileChange} />
// //                                         </label>
// //                                     )}
// //                                 </div>
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
// //                                     <button type="button" style={{...styles.btn, background: formData.selfie ? 'green' : '#0288d1'}} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}><i className="fa-solid fa-user"></i> {formData.selfie ? "Selfie Taken ✅" : "Take Team Selfie"}</button>
// //                                 </div>
// //                             </div>
// //                         )}
// //                     </div>

// //                     {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}

// //                 </form>
// //             </div>
// //         </div>
// //     );
// // };

// // export default SurveyForm;


// import React, { useState, useEffect } from 'react';
// // Removed GeoCamera import to use Native Phone Camera instead

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

//     useEffect(() => {
//         if (pickedCoords && !viewOnly) {
//             setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
//         }
//     }, [pickedCoords, viewOnly]);

//     const handleChange = (e) => {
//         if (viewOnly) return;
//         const { name, value } = e.target; 
//         setFormData(prev => ({ ...prev, [name]: value })); 
//     };

//     // Generic File Handler
//     const handleFileChange = (e, fieldName) => {
//         const file = e.target.files[0];
//         if (file) {
//             setFormData(prev => ({ 
//                 ...prev, 
//                 [fieldName]: URL.createObjectURL(file), // Preview URL
//                 [`${fieldName}Blob`]: file // Actual File for DB
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

//     const generateFileName = () => {
//         const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
//         const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
//         return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (viewOnly) return;

//         if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
//         if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
//         const generatedFileName = formData.generatedFileName || generateFileName();
//         onSubmitData({ ...formData, generatedFileName });
//     };

//     // Styles
//     const styles = {
//         overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
//         container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '90%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         header: { padding: '15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//         body: { flex: 1, overflowY: 'auto', padding: '15px' },
//         row: { display: 'flex', gap: '10px', marginBottom: '15px' },
//         col: { flex: 1 },
//         label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
//         input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', boxSizing:'border-box' },
//         select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', boxSizing:'border-box' },
//         section: { background: 'white', padding: '10px', borderRadius: '6px', marginBottom: '10px', border:'1px solid #ddd' },
//         btn: { padding:'10px', borderRadius:'4px', width:'100%', textAlign:'center', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', fontSize:'13px' },
//         // Native File Input Styling
//         fileLabel: {
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             padding: '12px', borderRadius: '4px', width: '100%', 
//             cursor: viewOnly ? 'default' : 'pointer', 
//             fontWeight: 'bold', fontSize: '13px', boxSizing: 'border-box',
//             textAlign: 'center'
//         }
//     };

//     return (
//         <div style={styles.overlay}>
//             <div style={styles.container}>
//                 <div style={styles.header}>
//                     <h3 style={{margin:0}}>{viewOnly ? "View Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
//                     <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px'}}>×</button>
//                 </div>
                
//                 <form style={styles.body} onSubmit={handleSubmit}>
//                     {/* Fields */}
//                     <div style={styles.section}>
//                         <div style={styles.row}>
//                             <div style={styles.col}><label style={styles.label}>District</label><select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
//                             <div style={styles.col}><label>Block</label><select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}</select></div>
//                         </div>
//                         <div style={styles.row}>
//                             <div style={styles.col}><label style={styles.label}>Route Name</label><input name="routeName" value={formData.routeName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                             <div style={styles.col}><label style={styles.label}>Date</label><input value={formData.dateTime} readOnly style={{...styles.input, background:'#e9ecef'}} /></div>
//                         </div>
//                     </div>

//                     {/* Location */}
//                     <div style={styles.section}>
//                         <div style={styles.row}>
//                             <div style={styles.col}><label style={styles.label}>Start Loc</label><input name="startLocName" value={formData.startLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                             <div style={styles.col}><label style={styles.label}>End Loc</label><input name="endLocName" value={formData.endLocName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
//                         </div>
//                         <div style={styles.row}><div style={styles.col}><label style={styles.label}>Ring No</label><input name="ringNumber" value={formData.ringNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div><div style={styles.col}><label style={styles.label}>Shot No</label><input name="shotNumber" value={formData.shotNumber} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div></div>
                        
//                         <label style={styles.label}>Location Point</label>
//                         {!viewOnly && <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
//                             <button type="button" onClick={handleGetGPS} style={{...styles.btn, background:'#333'}}>Get GPS</button>
//                             <button type="button" onClick={onPickLocation} style={{...styles.btn, background:'#0288d1'}}>Map Pick</button>
//                         </div>}
//                         <div style={styles.row}><input value={formData.latitude} readOnly style={{...styles.input, background:'#eee'}} placeholder="Lat" /><input value={formData.longitude} readOnly style={{...styles.input, background:'#eee'}} placeholder="Lng" /></div>
//                         <label style={styles.label}>Location Type</label>
//                         <select name="locationType" value={formData.locationType} style={styles.select} onChange={handleChange} disabled={viewOnly} required><option value="">Select Type</option>{LOCATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
//                     </div>

//                     {/* MEDIA SECTION (Native Inputs) */}
//                     <div style={styles.section}>
//                         <h4 style={{marginTop:0, color:'#1565c0'}}>Media Evidence</h4>
                        
//                         <div style={styles.row}>
//                             {/* PHOTO - Required for ALL */}
//                             <div style={styles.col}>
//                                 <label style={{...styles.fileLabel, background: formData.sitePhoto ? 'green' : '#d32f2f', color:'white'}}>
//                                     {formData.sitePhoto ? "Photo Captured ✅" : "📸 Capture Photo"}
//                                     {!viewOnly && (
//                                         // No 'capture' attribute allows choosing Gallery or Camera App
//                                         <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'sitePhoto')} style={{display:'none'}} />
//                                     )}
//                                 </label>
//                             </div>

//                             {/* VIDEO - Required for HDD/Blowing */}
//                             {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
//                                 <div style={styles.col}>
//                                     <label style={{...styles.fileLabel, background: formData.liveVideo ? 'green' : '#d32f2f', color:'white'}}>
//                                         {formData.liveVideo ? "Video Recorded ✅" : "🎥 Record Video"}
//                                         {!viewOnly && (
//                                             // capture="environment" forces Rear Camera video
//                                             // Remove 'capture' if you want to allow choosing 'GPS Video' app from files
//                                             <input type="file" accept="video/*" capture="environment" onChange={(e) => handleFileChange(e, 'liveVideo')} style={{display:'none'}} />
//                                         )}
//                                     </label>
//                                 </div>
//                             )}
//                         </div>

//                         {/* GoPro - Optional */}
//                         {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
//                             <div style={styles.row}>
//                                 <div style={styles.col}>
//                                     <label style={{...styles.fileLabel, background: formData.goproVideo ? 'green' : '#0288d1', color:'white'}}>
//                                         {formData.goproVideo ? "GoPro Uploaded ✅" : "📁 Upload GoPro (Opt)"}
//                                         {!viewOnly && (
//                                             <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'goproVideo')} style={{display:'none'}} />
//                                         )}
//                                     </label>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Surveyor */}
//                     <div style={styles.section}>
//                         <div style={styles.row}><div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div><div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div></div>
//                         {!viewOnly && !initialData && (
//                             <div style={styles.row}>
//                                 <div style={styles.col}>
//                                     <label style={{...styles.fileLabel, background: formData.selfie ? 'green' : '#0288d1', color:'white'}}>
//                                         {formData.selfie ? "Selfie Taken ✅" : "🤳 Take Team Selfie"}
//                                         {/* capture="user" forces Front Camera */}
//                                         <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileChange(e, 'selfie')} style={{display:'none'}} />
//                                     </label>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {!viewOnly && <button type="submit" style={{...styles.btn, background:'#e65100', padding:'15px', fontSize:'16px'}}>SUBMIT SURVEY</button>}
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SurveyForm;




import React, { useState, useEffect } from 'react';

const LOCATION_TYPES = [
    "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location", 
    "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
];

const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

const SurveyForm = ({ onClose, onPickLocation, pickedCoords, districts, blocks, onSubmitData, user, initialData, viewOnly }) => {
    const [formData, setFormData] = useState(initialData || {
        district: '', block: '', routeName: '', dateTime: '', 
        startLocName: '', endLocName: '', ringNumber: '', 
        latitude: '', longitude: '', locationType: '', shotNumber: '', 
        surveyorName: user || '', surveyorMobile: '',
        liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
        liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
    });

    useEffect(() => {
        if (pickedCoords && !viewOnly) {
            setFormData(prev => ({ ...prev, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
        }
    }, [pickedCoords, viewOnly]);

    const handleChange = (e) => {
        if (viewOnly) return;
        const { name, value } = e.target; 
        setFormData(prev => ({ ...prev, [name]: value })); 
    };

    // Handle Native File Input (Camera/Files)
    const handleNativeFile = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ 
                ...prev, 
                [fieldName]: URL.createObjectURL(file),
                [`${fieldName}Blob`]: file
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

    const generateFileName = () => {
        const d = formData.district ? formData.district.substring(0,3).toUpperCase() : "DST";
        const t = formData.locationType ? formData.locationType.substring(0,3).toUpperCase() : "TSK";
        return `${d}_${t}_SHOT${formData.shotNumber}_${new Date().getDate()}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (viewOnly) return;

        if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo && !initialData) { alert("⚠️ Live Video Required"); return; }
        // Photo is now required for ALL types as requested
        if (!formData.sitePhoto && !initialData) { alert("⚠️ Live Photo Required"); return; }
        
        const generatedFileName = formData.generatedFileName || generateFileName();
        onSubmitData({ ...formData, generatedFileName });
    };

    // Button Styles
    const getBtnStyle = (file, isMandatory) => {
        if (file) return { background: '#2e7d32', color: 'white', border:'1px solid green' }; 
        if (isMandatory) return { background: '#d32f2f', color: 'white', border:'1px solid red' }; 
        return { background: '#1976d2', color: 'white', border:'1px solid blue' }; 
    };

    const styles = {
        overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
        container: { background: '#f4f6f8', width: '95%', maxWidth: '800px', maxHeight: '95%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' },
        header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        body: { flex: 1, overflowY: 'auto', padding: '20px' },
        row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap:'wrap' },
        col: { flex: 1, minWidth:'200px' },
        label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color:'#333' },
        input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
        select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: viewOnly ? '#e9ecef' : 'white', fontSize:'14px', boxSizing:'border-box' },
        locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
        btn: { padding:'10px', borderRadius:'4px', cursor: viewOnly ? 'not-allowed' : 'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box', border:'none', color:'white' },
        gpsBtn: { padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
        pickBtn: { padding: '8px 12px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'12px', fontWeight:'bold' },
        mediaBtn: { padding:'12px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', width:'100%', textAlign:'center', fontWeight:'bold', display:'block', boxSizing:'border-box' },
        submitBtn: { width: '100%', padding: '15px', background: '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h3 style={{margin:0}}>{viewOnly ? "View Survey Details" : (initialData ? "Edit Survey" : "New Survey")}</h3>
                    <button onClick={onClose} style={{background:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>×</button>
                </div>
                
                <form style={styles.body} onSubmit={handleSubmit}>
                    
                    <div style={styles.row}>
                        <div style={styles.col}>
                            <label style={styles.label}>1. District</label>
                            <select name="district" value={formData.district} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
                                <option value="">Select</option>{districts.map(d=><option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div style={styles.col}>
                            <label style={styles.label}>2. Block</label>
                            <select name="block" value={formData.block} style={styles.select} onChange={handleChange} disabled={viewOnly} required>
                                <option value="">Select</option>{blocks.flat().map(b=><option key={b}>{b}</option>)}
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

                    {/* MEDIA SECTION */}
                    <div style={styles.locSection}>
                        <h4 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Media Evidence</h4>
                        
                        <div style={styles.row}>
                            {/* Photo for EVERYONE */}
                            <div style={styles.col}>
                                <label style={{...styles.mediaBtn, ...getBtnStyle(formData.sitePhoto, true)}}>
                                    {formData.sitePhoto ? "Photo Captured ✅" : "Capture Live Photo"}
                                    {!viewOnly && <input type="file" accept="image/*" onChange={(e) => handleNativeFile(e, 'sitePhoto')} style={{display:'none'}} />}
                                </label>
                            </div>

                            {/* Video only for specific types */}
                            {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
                                <div style={styles.col}>
                                    <label style={{...styles.mediaBtn, ...getBtnStyle(formData.liveVideo, true)}}>
                                        {formData.liveVideo ? "Video Recorded ✅" : "Record Live Video"}
                                        {!viewOnly && <input type="file" accept="video/*" onChange={(e) => handleNativeFile(e, 'liveVideo')} style={{display:'none'}} />}
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* GoPro */}
                        {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
                            <div style={styles.row}>
                                <div style={styles.col}>
                                    <label style={{...styles.mediaBtn, background: formData.goproVideo ? 'green' : (viewOnly ? 'grey' : '#0288d1'), color:'white'}}>
                                        {formData.goproVideo ? "GoPro Uploaded ✅" : (viewOnly ? "GoPro: Pending" : "Upload GoPro")}
                                        {!viewOnly && <input type="file" accept="video/*" style={{display:'none'}} onChange={(e) => handleNativeFile(e, 'goproVideo')} />}
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={styles.locSection}>
                        <div style={styles.row}>
                            <div style={styles.col}><label style={styles.label}>Name</label><input name="surveyorName" value={formData.surveyorName} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                            <div style={styles.col}><label style={styles.label}>Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile} style={styles.input} onChange={handleChange} readOnly={viewOnly} required /></div>
                        </div>
                        {!viewOnly && !initialData && (
                            <div style={styles.row}>
                                <div style={styles.col}>
                                    <label style={{...styles.mediaBtn, ...getBtnStyle(formData.selfie, true)}}>
                                        {formData.selfie ? "Selfie Taken ✅" : "Take Team Selfie"}
                                        <input type="file" accept="image/*" onChange={(e) => handleNativeFile(e, 'selfie')} style={{display:'none'}} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {!viewOnly && <button type="submit" style={styles.submitBtn}>{initialData ? "UPDATE SURVEY" : "SUBMIT SURVEY"}</button>}
                </form>
            </div>
        </div>
    );
};

export default SurveyForm;