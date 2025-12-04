// // // // // import React, { useState, useRef, useEffect } from "react";
// // // // // import { MapContainer, TileLayer, Marker } from "react-leaflet";
// // // // // import L from "leaflet";
// // // // // import html2canvas from "html2canvas";
// // // // // import 'leaflet/dist/leaflet.css';

// // // // // // Fix Icons
// // // // // delete L.Icon.Default.prototype._getIconUrl;
// // // // // L.Icon.Default.mergeOptions({
// // // // //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// // // // //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// // // // //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // // // // });

// // // // // const MiniMap = ({ lat, lon }) => {
// // // // //     if (!lat || !lon) return <div style={{background:'rgba(0,0,0,0.5)', width:'100%', height:'100%', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px'}}>Locating...</div>;
// // // // //     return (
// // // // //         <MapContainer center={[lat, lon]} zoom={16} zoomControl={false} dragging={false} scrollWheelZoom={false} attributionControl={false} style={{ width: "100%", height: "100%" }}>
// // // // //             <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
// // // // //             <Marker position={[lat, lon]} />
// // // // //         </MapContainer>
// // // // //     );
// // // // // };

// // // // // export default function GeoCamera({ mode, onCapture, onClose, metaData }) {
// // // // //   const captureRef = useRef(null);
// // // // //   const videoRef = useRef(null);
// // // // //   const canvasRef = useRef(null); 
// // // // //   const [stream, setStream] = useState(null);
// // // // //   const [coords, setCoords] = useState({ lat: 0, lon: 0 });
// // // // //   const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  
// // // // //   const [isRecording, setIsRecording] = useState(false);
// // // // //   const mediaRecorderRef = useRef(null);
// // // // //   const chunksRef = useRef([]);
// // // // //   const [timer, setTimer] = useState(0);
// // // // //   const timerIntervalRef = useRef(null);
// // // // //   const animationRef = useRef(null);

// // // // //   useEffect(() => {
// // // // //     const watchId = navigator.geolocation.watchPosition(
// // // // //       (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
// // // // //       (err) => console.error("GPS Error", err),
// // // // //       { enableHighAccuracy: true }
// // // // //     );
// // // // //     const timeInt = setInterval(() => setDateTime(new Date().toLocaleString()), 1000);
// // // // //     return () => { navigator.geolocation.clearWatch(watchId); clearInterval(timeInt); };
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     async function start() {
// // // // //       try {
// // // // //         const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: mode === 'video' });
// // // // //         setStream(s);
// // // // //         if (videoRef.current) videoRef.current.srcObject = s;
// // // // //       } catch (err) { alert("Camera Error: " + err.message); onClose(); }
// // // // //     }
// // // // //     start();
// // // // //     return () => {
// // // // //         if (stream) stream.getTracks().forEach(t => t.stop());
// // // // //         if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
// // // // //         if (animationRef.current) cancelAnimationFrame(animationRef.current);
// // // // //     };
// // // // //     // eslint-disable-next-line
// // // // //   }, []);

// // // // //   const handleCapturePhoto = async () => {
// // // // //     if (captureRef.current) {
// // // // //       try {
// // // // //         const canvas = await html2canvas(captureRef.current, { useCORS: true, allowTaint: true, logging: false, scale: 1 });
// // // // //         canvas.toBlob((blob) => {
// // // // //             const url = URL.createObjectURL(blob);
// // // // //             onCapture(url, blob); onClose();
// // // // //         }, 'image/jpeg', 0.9);
// // // // //       } catch (err) { alert("Capture failed"); }
// // // // //     }
// // // // //   };

// // // // //   const drawToCanvas = () => {
// // // // //     if (!videoRef.current || !canvasRef.current) return;
// // // // //     const vid = videoRef.current;
// // // // //     const canvas = canvasRef.current;
// // // // //     const ctx = canvas.getContext('2d');

// // // // //     if (canvas.width !== vid.videoWidth) { canvas.width = vid.videoWidth; canvas.height = vid.videoHeight; }

// // // // //     ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

// // // // //     ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
// // // // //     ctx.fillRect(0, 0, canvas.width, 140); 

// // // // //     ctx.shadowColor = "black"; ctx.shadowBlur = 4;
    
// // // // //     ctx.textAlign = "left";
// // // // //     ctx.fillStyle = "#FFD700"; 
// // // // //     ctx.font = "bold 24px Arial";
// // // // //     ctx.fillText(`Dist: ${metaData?.district || 'N/A'}`, 20, 40);
// // // // //     ctx.fillText(`Block: ${metaData?.block || 'N/A'}`, 20, 80);
// // // // //     ctx.fillText(`Route: ${metaData?.route || 'N/A'}`, 20, 120);

// // // // //     ctx.textAlign = "right";
// // // // //     ctx.fillStyle = "white";
// // // // //     ctx.font = "18px Arial";
// // // // //     ctx.fillText(`${new Date().toLocaleString()}`, canvas.width - 20, 40);
// // // // //     ctx.fillText(`Lat: ${coords.lat.toFixed(6)}`, canvas.width - 20, 80);
// // // // //     ctx.fillText(`Lon: ${coords.lon.toFixed(6)}`, canvas.width - 20, 120);

// // // // //     animationRef.current = requestAnimationFrame(drawToCanvas);
// // // // //   };

// // // // //   const handleStartRecord = () => {
// // // // //     if (!stream) return;
// // // // //     drawToCanvas();
    
// // // // //     const canvasStream = canvasRef.current.captureStream(30); 
// // // // //     stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));

// // // // //     const rec = new MediaRecorder(canvasStream, { mimeType: 'video/webm;codecs=vp8' });
// // // // //     chunksRef.current = [];
    
// // // // //     rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
// // // // //     rec.onstop = () => {
// // // // //         const blob = new Blob(chunksRef.current, { type: 'video/webm' });
// // // // //         const url = URL.createObjectURL(blob);
// // // // //         onCapture(url, blob); onClose();
// // // // //     };

// // // // //     rec.start();
// // // // //     mediaRecorderRef.current = rec;
// // // // //     setIsRecording(true);

// // // // //     setTimer(0);
// // // // //     timerIntervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
// // // // //   };

// // // // //   const handleStopRecord = () => {
// // // // //     if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
// // // // //     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
// // // // //     if (animationRef.current) cancelAnimationFrame(animationRef.current);
// // // // //     setIsRecording(false);
// // // // //   };

// // // // //   const styles = {
// // // // //       yellowText: { color: '#FFD700', fontSize: '16px', marginBottom: '4px', textShadow: '1px 1px 2px black', fontWeight: 'bold' },
// // // // //       whiteText: { color: 'white', fontSize: '14px', marginBottom: '2px', textShadow: '1px 1px 2px black' },
// // // // //   };

// // // // //   return (
// // // // //     <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "black", zIndex: 9999 }}>
// // // // //       <canvas ref={canvasRef} style={{display:'none'}} />

// // // // //       <div ref={captureRef} style={{ position: "relative", width: "100%", height: "100%", overflow:"hidden" }}>
// // // // //         <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />

// // // // //         <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, textAlign: 'left' }}>
// // // // //             <div style={styles.yellowText}>Dist: <span style={{color:'white'}}>{metaData?.district || 'N/A'}</span></div>
// // // // //             <div style={styles.yellowText}>Block: <span style={{color:'white'}}>{metaData?.block || 'N/A'}</span></div>
// // // // //             <div style={styles.yellowText}>Route: <span style={{color:'white'}}>{metaData?.route || 'N/A'}</span></div>
// // // // //         </div>

// // // // //         <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10, textAlign: 'right' }}>
// // // // //             <div style={styles.whiteText}>Lat: {coords.lat.toFixed(6)}</div>
// // // // //             <div style={styles.whiteText}>Lon: {coords.lon.toFixed(6)}</div>
// // // // //             <div style={styles.whiteText}>{dateTime}</div>
// // // // //         </div>

// // // // //         <div style={{ position: "absolute", bottom: 100, left: 10, width: "120px", height: "120px", border: "2px solid white", borderRadius: "4px", overflow: 'hidden', zIndex: 10 }}>
// // // // //             <MiniMap lat={coords.lat} lon={coords.lon} />
// // // // //         </div>
// // // // //       </div>

// // // // //       <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px", cursor: "pointer", zIndex: 20 }}>✖</button>

// // // // //       <div style={{ position: "absolute", bottom: 30, width: "100%", display: "flex", justifyContent: "center", zIndex: 20 }}>
// // // // //         {mode === 'photo' ? (
// // // // //             <button onClick={handleCapturePhoto} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "white", border: "5px solid #ccc", cursor:'pointer' }}></button>
// // // // //         ) : (
// // // // //             !isRecording ? 
// // // // //             <button onClick={handleStartRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "red", border: "5px solid white", cursor:'pointer' }}></button> :
// // // // //             <button onClick={handleStopRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "black", border: "4px solid red", cursor:'pointer', color:'white', fontWeight:'bold' }}>{timer}s</button>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }



// // // // import React, { useState, useRef, useEffect } from "react";
// // // // import { MapContainer, TileLayer, Marker } from "react-leaflet";
// // // // import L from "leaflet";
// // // // import html2canvas from "html2canvas";
// // // // import 'leaflet/dist/leaflet.css';

// // // // // Fix Icons
// // // // delete L.Icon.Default.prototype._getIconUrl;
// // // // L.Icon.Default.mergeOptions({
// // // //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// // // //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// // // //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // // // });

// // // // // --- MINI MAP COMPONENT (Bottom-Left Overlay) ---
// // // // const MiniMap = ({ lat, lon }) => {
// // // //     if (!lat || !lon) return <div style={{background:'rgba(0,0,0,0.5)', width:'100%', height:'100%', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px'}}>Locating...</div>;
// // // //     return (
// // // //         <MapContainer center={[lat, lon]} zoom={18} zoomControl={false} dragging={false} scrollWheelZoom={false} attributionControl={false} style={{ width: "100%", height: "100%" }}>
// // // //             <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
// // // //             <Marker position={[lat, lon]} />
// // // //         </MapContainer>
// // // //     );
// // // // };

// // // // export default function GeoCamera({ mode, onCapture, onClose, metaData }) {
// // // //   const captureRef = useRef(null);
// // // //   const videoRef = useRef(null);
// // // //   const canvasRef = useRef(null); 
// // // //   const [stream, setStream] = useState(null);
// // // //   const [coords, setCoords] = useState({ lat: 0, lon: 0 });
// // // //   const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  
// // // //   const [isRecording, setIsRecording] = useState(false);
// // // //   const mediaRecorderRef = useRef(null);
// // // //   const chunksRef = useRef([]);
// // // //   const [timer, setTimer] = useState(0);
// // // //   const timerIntervalRef = useRef(null);
// // // //   const animationRef = useRef(null);

// // // //   // 1. GPS
// // // //   useEffect(() => {
// // // //     const watchId = navigator.geolocation.watchPosition(
// // // //       (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
// // // //       (err) => console.error("GPS Error", err),
// // // //       { enableHighAccuracy: true }
// // // //     );
// // // //     const timeInt = setInterval(() => setDateTime(new Date().toLocaleString()), 1000);
// // // //     return () => { navigator.geolocation.clearWatch(watchId); clearInterval(timeInt); };
// // // //   }, []);

// // // //   // 2. Camera Start
// // // //   useEffect(() => {
// // // //     async function start() {
// // // //       try {
// // // //         const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: mode === 'video' });
// // // //         setStream(s);
// // // //         if (videoRef.current) videoRef.current.srcObject = s;
// // // //       } catch (err) { alert("Camera Error: " + err.message); onClose(); }
// // // //     }
// // // //     start();
// // // //     return () => {
// // // //         if (stream) stream.getTracks().forEach(t => t.stop());
// // // //         if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
// // // //         if (animationRef.current) cancelAnimationFrame(animationRef.current);
// // // //     };
// // // //     // eslint-disable-next-line
// // // //   }, []);

// // // //   // 3. Photo Capture
// // // //   const handleCapturePhoto = async () => {
// // // //     if (captureRef.current) {
// // // //       try {
// // // //         const canvas = await html2canvas(captureRef.current, { useCORS: true, allowTaint: true, logging: false, scale: 1 });
// // // //         canvas.toBlob((blob) => {
// // // //             const url = URL.createObjectURL(blob);
// // // //             onCapture(url, blob); onClose();
// // // //         }, 'image/jpeg', 0.9);
// // // //       } catch (err) { alert("Capture failed"); }
// // // //     }
// // // //   };

// // // //   // 4. Video Record
// // // //   const drawToCanvas = () => {
// // // //     if (!videoRef.current || !canvasRef.current) return;
// // // //     const vid = videoRef.current;
// // // //     const canvas = canvasRef.current;
// // // //     const ctx = canvas.getContext('2d');

// // // //     if (canvas.width !== vid.videoWidth) { canvas.width = vid.videoWidth; canvas.height = vid.videoHeight; }

// // // //     ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    
// // // //     // Burn Overlay Data
// // // //     ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
// // // //     ctx.fillRect(0, 0, canvas.width, 80); // Top Bar
    
// // // //     ctx.shadowColor = "black"; ctx.shadowBlur = 3;
// // // //     ctx.fillStyle = "#FFD700"; // Gold
// // // //     ctx.font = "bold 20px Arial";
// // // //     ctx.fillText(`Route: ${metaData?.route || 'N/A'}`, 20, 30);
    
// // // //     ctx.fillStyle = "white";
// // // //     ctx.font = "16px Arial";
// // // //     ctx.textAlign = "right";
// // // //     ctx.fillText(dateTime, canvas.width - 20, 30);
// // // //     ctx.fillText(`${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}`, canvas.width - 20, 55);
// // // //     ctx.textAlign = "left"; // Reset

// // // //     animationRef.current = requestAnimationFrame(drawToCanvas);
// // // //   };

// // // //   const handleStartRecord = () => {
// // // //     if (!stream) return;
// // // //     drawToCanvas();
    
// // // //     const canvasStream = canvasRef.current.captureStream(30); 
// // // //     stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));

// // // //     const rec = new MediaRecorder(canvasStream, { mimeType: 'video/webm;codecs=vp8' });
// // // //     chunksRef.current = [];
    
// // // //     rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
// // // //     rec.onstop = () => {
// // // //         const blob = new Blob(chunksRef.current, { type: 'video/webm' });
// // // //         const url = URL.createObjectURL(blob);
// // // //         onCapture(url, blob); onClose();
// // // //     };

// // // //     rec.start();
// // // //     mediaRecorderRef.current = rec;
// // // //     setIsRecording(true);

// // // //     setTimer(0);
// // // //     timerIntervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
// // // //   };

// // // //   const handleStopRecord = () => {
// // // //     if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
// // // //     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
// // // //     if (animationRef.current) cancelAnimationFrame(animationRef.current);
// // // //     setIsRecording(false);
// // // //   };

// // // //   const styles = {
// // // //       yellowText: { color: '#FFD700', fontSize: '16px', marginBottom: '4px', textShadow: '1px 1px 2px black', fontWeight: 'bold' },
// // // //       whiteText: { color: 'white', fontSize: '14px', marginBottom: '2px', textShadow: '1px 1px 2px black' },
// // // //   };

// // // //   return (
// // // //     <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "black", zIndex: 9999 }}>
// // // //       <canvas ref={canvasRef} style={{display:'none'}} />

// // // //       {/* --- CAPTURE AREA --- */}
// // // //       <div ref={captureRef} style={{ position: "relative", width: "100%", height: "100%", overflow:"hidden" }}>
// // // //         <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />

// // // //         {/* HEADER INFO */}
// // // //         <div style={{ position: "absolute", top: 0, left: 0, width: '100%', padding: '15px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', color: 'white', display:'flex', justifyContent:'space-between', zIndex: 10 }}>
// // // //             <div>
// // // //                 <div style={styles.yellowText}>Dist: {metaData?.district}</div>
// // // //                 <div style={{fontSize:'14px'}}>Block: {metaData?.block}</div>
// // // //             </div>
// // // //             <div style={{textAlign:'right'}}>
// // // //                 <div style={{fontSize:'14px'}}>{dateTime}</div>
// // // //                 <div style={{fontSize:'14px', fontWeight:'bold'}}>Lat: {coords.lat.toFixed(5)}</div>
// // // //                 <div style={{fontSize:'14px', fontWeight:'bold'}}>Lon: {coords.lon.toFixed(5)}</div>
// // // //             </div>
// // // //         </div>

// // // //         {/* BOTTOM LEFT MAP OVERLAY */}
// // // //         <div style={{ 
// // // //             position: "absolute", 
// // // //             bottom: '120px', 
// // // //             left: '20px', 
// // // //             width: "100px", 
// // // //             height: "100px", 
// // // //             border: "2px solid white", 
// // // //             borderRadius: "4px", 
// // // //             overflow: 'hidden', 
// // // //             zIndex: 10,
// // // //             boxShadow: "0 0 10px rgba(0,0,0,0.5)"
// // // //         }}>
// // // //             <MiniMap lat={coords.lat} lon={coords.lon} />
// // // //             <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'#2196f3', fontSize:'24px', textShadow:'0 0 3px white'}}>📍</div>
// // // //         </div>
// // // //       </div>

// // // //       <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", color: "white", border: "none", fontSize: "30px", cursor: "pointer", zIndex: 20 }}>✖</button>

// // // //       <div style={{ position: "absolute", bottom: 30, width: "100%", display: "flex", justifyContent: "center", zIndex: 20 }}>
// // // //         {mode === 'photo' ? (
// // // //             <button onClick={handleCapturePhoto} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "white", border: "5px solid #ccc", cursor:'pointer' }}></button>
// // // //         ) : (
// // // //             !isRecording ? 
// // // //             <button onClick={handleStartRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "red", border: "5px solid white", cursor:'pointer' }}></button> :
// // // //             <button onClick={handleStopRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "black", border: "4px solid red", cursor:'pointer', color:'white', fontWeight:'bold' }}>{timer}s</button>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }



// // // import React, { useState, useRef, useEffect } from "react";
// // // import { MapContainer, TileLayer, Marker } from "react-leaflet";
// // // import L from "leaflet";
// // // import html2canvas from "html2canvas";
// // // import 'leaflet/dist/leaflet.css';

// // // // Fix Icons
// // // delete L.Icon.Default.prototype._getIconUrl;
// // // L.Icon.Default.mergeOptions({
// // //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// // //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// // //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // // });

// // // const MiniMap = ({ lat, lon }) => {
// // //     if (!lat || !lon) return <div style={{background:'rgba(0,0,0,0.5)', width:'100%', height:'100%', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px'}}>Locating...</div>;
// // //     return (
// // //         <MapContainer center={[lat, lon]} zoom={18} zoomControl={false} dragging={false} scrollWheelZoom={false} attributionControl={false} style={{ width: "100%", height: "100%" }}>
// // //             <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
// // //             <Marker position={[lat, lon]} />
// // //         </MapContainer>
// // //     );
// // // };

// // // export default function GeoCamera({ mode, onCapture, onClose, metaData }) {
// // //   const captureRef = useRef(null);
// // //   const videoRef = useRef(null);
// // //   const canvasRef = useRef(null); 
// // //   const [stream, setStream] = useState(null);
// // //   const [coords, setCoords] = useState({ lat: 0, lon: 0 });
// // //   const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  
// // //   const [isRecording, setIsRecording] = useState(false);
// // //   const mediaRecorderRef = useRef(null);
// // //   const chunksRef = useRef([]);
// // //   const [timer, setTimer] = useState(0);
// // //   const timerIntervalRef = useRef(null);
// // //   const animationRef = useRef(null);

// // //   // 1. GPS
// // //   useEffect(() => {
// // //     const watchId = navigator.geolocation.watchPosition(
// // //       (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
// // //       (err) => console.error("GPS Error", err),
// // //       { enableHighAccuracy: true }
// // //     );
// // //     const timeInt = setInterval(() => setDateTime(new Date().toLocaleString()), 1000);
// // //     return () => { navigator.geolocation.clearWatch(watchId); clearInterval(timeInt); };
// // //   }, []);

// // //   // 2. Start Camera
// // //   useEffect(() => {
// // //     async function start() {
// // //       try {
// // //         // Use 'environment' for rear camera
// // //         const s = await navigator.mediaDevices.getUserMedia({ 
// // //             video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }, 
// // //             audio: mode === 'video' 
// // //         });
// // //         setStream(s);
// // //         if (videoRef.current) videoRef.current.srcObject = s;
// // //       } catch (err) { alert("Camera Error: " + err.message); onClose(); }
// // //     }
// // //     start();
// // //     return () => {
// // //         if (stream) stream.getTracks().forEach(t => t.stop());
// // //         if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
// // //         if (animationRef.current) cancelAnimationFrame(animationRef.current);
// // //     };
// // //     // eslint-disable-next-line
// // //   }, []);

// // //   // 3. Capture Photo (Snapshot)
// // //   const handleCapturePhoto = async () => {
// // //     if (captureRef.current) {
// // //       try {
// // //         const canvas = await html2canvas(captureRef.current, { useCORS: true, allowTaint: true, logging: false, scale: 1 });
// // //         canvas.toBlob((blob) => {
// // //             const url = URL.createObjectURL(blob);
// // //             onCapture(url, blob); // Returns URL and Blob
// // //         }, 'image/jpeg', 0.9);
// // //       } catch (err) { alert("Capture failed"); }
// // //     }
// // //   };

// // //   // 4. Record Video (Burn Text to Canvas)
// // //   const drawToCanvas = () => {
// // //     if (!videoRef.current || !canvasRef.current) return;
// // //     const vid = videoRef.current;
// // //     const canvas = canvasRef.current;
// // //     const ctx = canvas.getContext('2d');

// // //     if (canvas.width !== vid.videoWidth) { canvas.width = vid.videoWidth; canvas.height = vid.videoHeight; }

// // //     ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

// // //     // Overlay Background
// // //     ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
// // //     ctx.fillRect(0, 0, canvas.width, 100); 

// // //     ctx.shadowColor = "black"; ctx.shadowBlur = 4;
    
// // //     // Left Data (Yellow)
// // //     ctx.textAlign = "left";
// // //     ctx.fillStyle = "#FFD700"; 
// // //     ctx.font = "bold 20px Arial";
// // //     ctx.fillText(`Dist: ${metaData?.district || 'N/A'}`, 20, 30);
// // //     ctx.fillText(`Block: ${metaData?.block || 'N/A'}`, 20, 55);
// // //     ctx.fillText(`Route: ${metaData?.route || 'N/A'}`, 20, 80);

// // //     // Right Data (White)
// // //     ctx.textAlign = "right";
// // //     ctx.fillStyle = "white";
// // //     ctx.font = "16px Arial";
// // //     ctx.fillText(dateTime, canvas.width - 20, 30);
// // //     ctx.fillText(`${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}`, canvas.width - 20, 55);

// // //     animationRef.current = requestAnimationFrame(drawToCanvas);
// // //   };

// // //   const handleStartRecord = () => {
// // //     if (!stream) return;
// // //     drawToCanvas(); // Start visual burner
    
// // //     // Record the CANVAS (with overlays), not the raw video
// // //     const canvasStream = canvasRef.current.captureStream(30); 
// // //     stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));

// // //     const rec = new MediaRecorder(canvasStream, { mimeType: 'video/webm;codecs=vp8' });
// // //     chunksRef.current = [];
    
// // //     rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
// // //     rec.onstop = () => {
// // //         const blob = new Blob(chunksRef.current, { type: 'video/webm' });
// // //         const url = URL.createObjectURL(blob);
// // //         onCapture(url, blob); // Returns URL and Blob
// // //     };

// // //     rec.start();
// // //     mediaRecorderRef.current = rec;
// // //     setIsRecording(true);

// // //     setTimer(0);
// // //     timerIntervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
// // //   };

// // //   const handleStopRecord = () => {
// // //     if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
// // //     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
// // //     if (animationRef.current) cancelAnimationFrame(animationRef.current);
// // //     setIsRecording(false);
// // //   };

// // //   const styles = {
// // //       yellowText: { color: '#FFD700', fontSize: '14px', marginBottom: '4px', textShadow: '1px 1px 2px black', fontWeight: 'bold' },
// // //       whiteText: { color: 'white', fontSize: '12px', marginBottom: '2px', textShadow: '1px 1px 2px black' },
// // //   };

// // //   return (
// // //     <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "black", zIndex: 9999 }}>
// // //       <canvas ref={canvasRef} style={{display:'none'}} />

// // //       <div ref={captureRef} style={{ position: "relative", width: "100%", height: "100%", overflow:"hidden" }}>
// // //         <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />

// // //         {/* UI OVERLAY (Visible to User) */}
// // //         <div style={{ position: "absolute", top: 0, left: 0, width: '100%', padding: '10px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)', zIndex: 10, display:'flex', justifyContent:'space-between' }}>
// // //             <div>
// // //                 <div style={styles.yellowText}>Dist: {metaData?.district}</div>
// // //                 <div style={styles.yellowText}>Block: {metaData?.block}</div>
// // //                 <div style={styles.yellowText}>Route: {metaData?.route}</div>
// // //             </div>
// // //             <div style={{textAlign:'right'}}>
// // //                 <div style={styles.whiteText}>{dateTime}</div>
// // //                 <div style={styles.whiteText}>{coords.lat.toFixed(5)}</div>
// // //                 <div style={styles.whiteText}>{coords.lon.toFixed(5)}</div>
// // //             </div>
// // //         </div>

// // //         {/* BOTTOM LEFT MAP */}
// // //         <div style={{ position: "absolute", bottom: '100px', left: '20px', width: "100px", height: "100px", border: "2px solid white", borderRadius: "4px", overflow: 'hidden', zIndex: 10 }}>
// // //             <MiniMap lat={coords.lat} lon={coords.lon} />
// // //         </div>
// // //       </div>

// // //       {/* CONTROLS */}
// // //       <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px", cursor: "pointer", zIndex: 20 }}>✖</button>

// // //       <div style={{ position: "absolute", bottom: 30, width: "100%", display: "flex", justifyContent: "center", zIndex: 20 }}>
// // //         {mode === 'photo' ? (
// // //             <button onClick={handleCapturePhoto} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "white", border: "5px solid #ccc", cursor:'pointer' }}></button>
// // //         ) : (
// // //             !isRecording ? 
// // //             <button onClick={handleStartRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "red", border: "5px solid white", cursor:'pointer' }}></button> :
// // //             <button onClick={handleStopRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "black", border: "4px solid red", cursor:'pointer', color:'white', fontWeight:'bold' }}>{timer}s</button>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // import React, { useState, useRef, useEffect } from "react";
// // import { MapContainer, TileLayer, Marker } from "react-leaflet";
// // import L from "leaflet";
// // import html2canvas from "html2canvas";
// // import 'leaflet/dist/leaflet.css';

// // // Fix Icons
// // delete L.Icon.Default.prototype._getIconUrl;
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // });

// // // --- MINI MAP COMPONENT ---
// // const MiniMap = ({ lat, lon }) => {
// //     if (!lat || !lon) return <div style={{background:'rgba(0,0,0,0.5)', width:'100%', height:'100%', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px'}}>Locating...</div>;
// //     return (
// //         <MapContainer center={[lat, lon]} zoom={16} zoomControl={false} dragging={false} scrollWheelZoom={false} attributionControl={false} style={{ width: "100%", height: "100%" }}>
// //             <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
// //             <Marker position={[lat, lon]} />
// //         </MapContainer>
// //     );
// // };

// // export default function GeoCamera({ mode, onCapture, onClose, metaData }) {
// //   const captureRef = useRef(null);
// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null); 
// //   const [stream, setStream] = useState(null);
// //   const [coords, setCoords] = useState({ lat: 0, lon: 0 });
// //   const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  
// //   const [isRecording, setIsRecording] = useState(false);
// //   const mediaRecorderRef = useRef(null);
// //   const chunksRef = useRef([]);
// //   const [timer, setTimer] = useState(0);
// //   const timerIntervalRef = useRef(null);
// //   const animationRef = useRef(null);

// //   // 1. GPS
// //   useEffect(() => {
// //     const watchId = navigator.geolocation.watchPosition(
// //       (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
// //       (err) => console.error("GPS Error", err),
// //       { enableHighAccuracy: true }
// //     );
// //     const timeInt = setInterval(() => setDateTime(new Date().toLocaleString()), 1000);
// //     return () => { navigator.geolocation.clearWatch(watchId); clearInterval(timeInt); };
// //   }, []);

// //   // 2. Camera Start (Mobile Optimized)
// //   useEffect(() => {
// //     async function start() {
// //       try {
// //         // RELAXED CONSTRAINTS FOR MOBILE
// //         const constraints = {
// //             video: { facingMode: "environment" }, // Rear Camera
// //             audio: mode === 'video'
// //         };
        
// //         const s = await navigator.mediaDevices.getUserMedia(constraints);
// //         setStream(s);
// //         if (videoRef.current) {
// //             videoRef.current.srcObject = s;
// //             // Explicitly call play() for some Android devices
// //             videoRef.current.play().catch(e => console.log("Play error", e));
// //         }
// //       } catch (err) {
// //         alert("Camera Error: " + err.message + ". Ensure you are on HTTPS or Localhost.");
// //         onClose();
// //       }
// //     }
// //     start();
// //     return () => {
// //         if (stream) stream.getTracks().forEach(t => t.stop());
// //         if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
// //         if (animationRef.current) cancelAnimationFrame(animationRef.current);
// //     };
// //     // eslint-disable-next-line
// //   }, []);

// //   // 3. Photo Capture
// //   const handleCapturePhoto = async () => {
// //     if (captureRef.current) {
// //       try {
// //         const canvas = await html2canvas(captureRef.current, { useCORS: true, allowTaint: true, logging: false, scale: 1 });
// //         canvas.toBlob((blob) => {
// //             const url = URL.createObjectURL(blob);
// //             onCapture(url, blob); onClose();
// //         }, 'image/jpeg', 0.8); // 0.8 Quality
// //       } catch (err) { alert("Capture failed"); }
// //     }
// //   };

// //   // 4. Video Record
// //   const drawToCanvas = () => {
// //     if (!videoRef.current || !canvasRef.current) return;
// //     const vid = videoRef.current;
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext('2d');

// //     if (canvas.width !== vid.videoWidth) { canvas.width = vid.videoWidth; canvas.height = vid.videoHeight; }

// //     ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    
// //     // Overlay Background
// //     ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
// //     ctx.fillRect(0, 0, canvas.width, 120); 
    
// //     ctx.shadowColor = "black"; ctx.shadowBlur = 3;
// //     ctx.fillStyle = "#FFD700"; // Gold
// //     ctx.font = "bold 20px Arial";
// //     ctx.fillText(`Dist: ${metaData?.district || 'N/A'}`, 20, 30);
// //     ctx.fillText(`Block: ${metaData?.block || 'N/A'}`, 20, 60);
// //     ctx.fillText(`Route: ${metaData?.route || 'N/A'}`, 20, 90);
    
// //     ctx.fillStyle = "white";
// //     ctx.textAlign = "right";
// //     ctx.fillText(dateTime, canvas.width - 20, 30);
// //     ctx.fillText(`Lat: ${coords.lat.toFixed(5)}`, canvas.width - 20, 60);
// //     ctx.fillText(`Lon: ${coords.lon.toFixed(5)}`, canvas.width - 20, 90);
// //     ctx.textAlign = "left"; // Reset

// //     animationRef.current = requestAnimationFrame(drawToCanvas);
// //   };

// //   const handleStartRecord = () => {
// //     if (!stream) return;
// //     drawToCanvas(); // Start burning text
    
// //     // Use Canvas stream (30 FPS)
// //     const canvasStream = canvasRef.current.captureStream(30); 
// //     if(mode === 'video') {
// //         stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));
// //     }

// //     const rec = new MediaRecorder(canvasStream, { mimeType: 'video/webm' }); // 'video/webm' is most supported
// //     chunksRef.current = [];
    
// //     rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
// //     rec.onstop = () => {
// //         const blob = new Blob(chunksRef.current, { type: 'video/webm' });
// //         const url = URL.createObjectURL(blob);
// //         onCapture(url, blob); onClose();
// //     };

// //     rec.start();
// //     mediaRecorderRef.current = rec;
// //     setIsRecording(true);

// //     setTimer(0);
// //     timerIntervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
// //   };

// //   const handleStopRecord = () => {
// //     if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
// //     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
// //     if (animationRef.current) cancelAnimationFrame(animationRef.current);
// //     setIsRecording(false);
// //   };

// //   const styles = {
// //       yellowText: { color: '#FFD700', fontSize: '16px', marginBottom: '4px', textShadow: '1px 1px 2px black', fontWeight: 'bold' },
// //       whiteText: { color: 'white', fontSize: '14px', marginBottom: '2px', textShadow: '1px 1px 2px black' },
// //   };

// //   return (
// //     <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "black", zIndex: 9999 }}>
// //       <canvas ref={canvasRef} style={{display:'none'}} />

// //       <div ref={captureRef} style={{ position: "relative", width: "100%", height: "100%", overflow:"hidden" }}>
// //         {/* playsInline is MANDATORY for iOS */}
// //         <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />

// //         {/* HEADER INFO */}
// //         <div style={{ position: "absolute", top: 0, left: 0, width: '100%', padding: '15px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', color: 'white', display:'flex', justifyContent:'space-between', zIndex: 10 }}>
// //             <div>
// //                 <div style={styles.yellowText}>Dist: {metaData?.district}</div>
// //                 <div style={styles.yellowText}>Block: {metaData?.block}</div>
// //                 <div style={styles.yellowText}>Route: {metaData?.route}</div>
// //             </div>
// //             <div style={{textAlign:'right'}}>
// //                 <div style={styles.whiteText}>{dateTime}</div>
// //                 <div style={styles.whiteText}>Lat: {coords.lat.toFixed(5)}</div>
// //                 <div style={styles.whiteText}>Lon: {coords.lon.toFixed(5)}</div>
// //             </div>
// //         </div>

// //         {/* BOTTOM LEFT MAP */}
// //         <div style={{ 
// //             position: "absolute", 
// //             bottom: '120px', 
// //             left: '20px', 
// //             width: "100px", 
// //             height: "100px", 
// //             border: "2px solid white", 
// //             borderRadius: "4px", 
// //             overflow: 'hidden', 
// //             zIndex: 10,
// //             boxShadow: "0 0 10px rgba(0,0,0,0.5)"
// //         }}>
// //             <MiniMap lat={coords.lat} lon={coords.lon} />
// //             <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'#2196f3', fontSize:'24px', textShadow:'0 0 3px white'}}>📍</div>
// //         </div>
// //       </div>

// //       {/* CONTROLS */}
// //       <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px", cursor: "pointer", zIndex: 20 }}>✖</button>

// //       <div style={{ position: "absolute", bottom: 30, width: "100%", display: "flex", justifyContent: "center", zIndex: 20 }}>
// //         {mode === 'photo' ? (
// //             <button onClick={handleCapturePhoto} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "white", border: "5px solid #ccc", cursor:'pointer' }}></button>
// //         ) : (
// //             !isRecording ? 
// //             <button onClick={handleStartRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "red", border: "5px solid white", cursor:'pointer' }}></button> :
// //             <button onClick={handleStopRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "black", border: "4px solid red", cursor:'pointer', color:'white', fontWeight:'bold' }}>{timer}s</button>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }




// import React, { useState, useRef, useEffect } from "react";
// import { MapContainer, TileLayer, Marker } from "react-leaflet";
// import L from "leaflet";
// import html2canvas from "html2canvas";
// import 'leaflet/dist/leaflet.css';

// // Fix Icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // --- MINI MAP COMPONENT ---
// const MiniMap = ({ lat, lon }) => {
//     if (!lat || !lon) return <div style={{background:'rgba(0,0,0,0.5)', width:'100%', height:'100%', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px'}}>Locating...</div>;
//     return (
//         <MapContainer center={[lat, lon]} zoom={16} zoomControl={false} dragging={false} scrollWheelZoom={false} attributionControl={false} style={{ width: "100%", height: "100%" }}>
//             <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
//             <Marker position={[lat, lon]} />
//         </MapContainer>
//     );
// };

// export default function GeoCamera({ mode, onCapture, onClose, metaData }) {
//   const captureRef = useRef(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null); 
//   const [stream, setStream] = useState(null);
//   const [coords, setCoords] = useState({ lat: 0, lon: 0 });
//   const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);
//   const [timer, setTimer] = useState(0);
//   const timerIntervalRef = useRef(null);
//   const animationRef = useRef(null);

//   // 1. GPS
//   useEffect(() => {
//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
//       (err) => console.error("GPS Error", err),
//       { enableHighAccuracy: true }
//     );
//     const timeInt = setInterval(() => setDateTime(new Date().toLocaleString()), 1000);
//     return () => { navigator.geolocation.clearWatch(watchId); clearInterval(timeInt); };
//   }, []);

//   // 2. Camera Start (Mobile Optimized)
//   useEffect(() => {
//     async function start() {
//       try {
//         // RELAXED CONSTRAINTS FOR MOBILE
//         const constraints = {
//             video: { facingMode: "environment" }, // Rear Camera
//             audio: mode === 'video'
//         };
        
//         const s = await navigator.mediaDevices.getUserMedia(constraints);
//         setStream(s);
//         if (videoRef.current) {
//             videoRef.current.srcObject = s;
//             // Explicitly call play() for some Android devices
//             videoRef.current.play().catch(e => console.log("Play error", e));
//         }
//       } catch (err) {
//         alert("Camera Error: " + err.message + ". Ensure you are on HTTPS or Localhost.");
//         onClose();
//       }
//     }
//     start();
//     return () => {
//         if (stream) stream.getTracks().forEach(t => t.stop());
//         if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
//         if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//     // eslint-disable-next-line
//   }, []);

//   // 3. Photo Capture
//   const handleCapturePhoto = async () => {
//     if (captureRef.current) {
//       try {
//         const canvas = await html2canvas(captureRef.current, { useCORS: true, allowTaint: true, logging: false, scale: 1 });
//         canvas.toBlob((blob) => {
//             const url = URL.createObjectURL(blob);
//             onCapture(url, blob); onClose();
//         }, 'image/jpeg', 0.8); // 0.8 Quality
//       } catch (err) { alert("Capture failed"); }
//     }
//   };

//   // 4. Video Record
//   const drawToCanvas = () => {
//     if (!videoRef.current || !canvasRef.current) return;
//     const vid = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     if (canvas.width !== vid.videoWidth) { canvas.width = vid.videoWidth; canvas.height = vid.videoHeight; }

//     ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    
//     // Overlay Background
//     ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
//     ctx.fillRect(0, 0, canvas.width, 120); 
    
//     ctx.shadowColor = "black"; ctx.shadowBlur = 3;
//     ctx.fillStyle = "#FFD700"; // Gold
//     ctx.font = "bold 20px Arial";
//     ctx.fillText(`Dist: ${metaData?.district || 'N/A'}`, 20, 30);
//     ctx.fillText(`Block: ${metaData?.block || 'N/A'}`, 20, 60);
//     ctx.fillText(`Route: ${metaData?.route || 'N/A'}`, 20, 90);
    
//     ctx.fillStyle = "white";
//     ctx.textAlign = "right";
//     ctx.fillText(dateTime, canvas.width - 20, 30);
//     ctx.fillText(`Lat: ${coords.lat.toFixed(5)}`, canvas.width - 20, 60);
//     ctx.fillText(`Lon: ${coords.lon.toFixed(5)}`, canvas.width - 20, 90);
//     ctx.textAlign = "left"; // Reset

//     animationRef.current = requestAnimationFrame(drawToCanvas);
//   };

//   const handleStartRecord = () => {
//     if (!stream) return;
//     drawToCanvas(); // Start burning text
    
//     // Use Canvas stream (30 FPS)
//     const canvasStream = canvasRef.current.captureStream(30); 
//     if(mode === 'video') {
//         stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));
//     }

//     const rec = new MediaRecorder(canvasStream, { mimeType: 'video/webm' }); // 'video/webm' is most supported
//     chunksRef.current = [];
    
//     rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
//     rec.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: 'video/webm' });
//         const url = URL.createObjectURL(blob);
//         onCapture(url, blob); onClose();
//     };

//     rec.start();
//     mediaRecorderRef.current = rec;
//     setIsRecording(true);

//     setTimer(0);
//     timerIntervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
//   };

//   const handleStopRecord = () => {
//     if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
//     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
//     if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     setIsRecording(false);
//   };

//   const styles = {
//       yellowText: { color: '#FFD700', fontSize: '16px', marginBottom: '4px', textShadow: '1px 1px 2px black', fontWeight: 'bold' },
//       whiteText: { color: 'white', fontSize: '14px', marginBottom: '2px', textShadow: '1px 1px 2px black' },
//   };

//   return (
//     <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "black", zIndex: 9999 }}>
//       <canvas ref={canvasRef} style={{display:'none'}} />

//       <div ref={captureRef} style={{ position: "relative", width: "100%", height: "100%", overflow:"hidden" }}>
//         {/* playsInline is MANDATORY for iOS */}
//         <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />

//         {/* HEADER INFO */}
//         <div style={{ position: "absolute", top: 0, left: 0, width: '100%', padding: '15px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', color: 'white', display:'flex', justifyContent:'space-between', zIndex: 10 }}>
//             <div>
//                 <div style={styles.yellowText}>Dist: {metaData?.district}</div>
//                 <div style={styles.yellowText}>Block: {metaData?.block}</div>
//                 <div style={styles.yellowText}>Route: {metaData?.route}</div>
//             </div>
//             <div style={{textAlign:'right'}}>
//                 <div style={styles.whiteText}>{dateTime}</div>
//                 <div style={styles.whiteText}>Lat: {coords.lat.toFixed(5)}</div>
//                 <div style={styles.whiteText}>Lon: {coords.lon.toFixed(5)}</div>
//             </div>
//         </div>

//         {/* BOTTOM LEFT MAP */}
//         <div style={{ 
//             position: "absolute", 
//             bottom: '120px', 
//             left: '20px', 
//             width: "100px", 
//             height: "100px", 
//             border: "2px solid white", 
//             borderRadius: "4px", 
//             overflow: 'hidden', 
//             zIndex: 10,
//             boxShadow: "0 0 10px rgba(0,0,0,0.5)"
//         }}>
//             <MiniMap lat={coords.lat} lon={coords.lon} />
//             <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'#2196f3', fontSize:'24px', textShadow:'0 0 3px white'}}>📍</div>
//         </div>
//       </div>

//       {/* CONTROLS */}
//       <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px", cursor: "pointer", zIndex: 20 }}>✖</button>

//       <div style={{ position: "absolute", bottom: 30, width: "100%", display: "flex", justifyContent: "center", zIndex: 20 }}>
//         {mode === 'photo' ? (
//             <button onClick={handleCapturePhoto} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "white", border: "5px solid #ccc", cursor:'pointer' }}></button>
//         ) : (
//             !isRecording ? 
//             <button onClick={handleStartRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "red", border: "5px solid white", cursor:'pointer' }}></button> :
//             <button onClick={handleStopRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "black", border: "4px solid red", cursor:'pointer', color:'white', fontWeight:'bold' }}>{timer}s</button>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import html2canvas from "html2canvas";
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mini Map Component (Bottom-Left Overlay)
const MiniMap = ({ lat, lon }) => {
    if (!lat || !lon) return <div style={{background:'rgba(0,0,0,0.5)', width:'100%', height:'100%', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px'}}>Locating...</div>;
    return (
        <MapContainer center={[lat, lon]} zoom={16} zoomControl={false} dragging={false} scrollWheelZoom={false} attributionControl={false} style={{ width: "100%", height: "100%" }}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <Marker position={[lat, lon]} />
        </MapContainer>
    );
};

export default function GeoCamera({ mode, onCapture, onClose, metaData }) {
  const captureRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); 
  const [stream, setStream] = useState(null);
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [timer, setTimer] = useState(0);
  const timerIntervalRef = useRef(null);
  const animationRef = useRef(null);

  // 1. GPS Tracking
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => console.error("GPS Error", err),
      { enableHighAccuracy: true }
    );
    const timeInt = setInterval(() => setDateTime(new Date().toLocaleString()), 1000);
    return () => { navigator.geolocation.clearWatch(watchId); clearInterval(timeInt); };
  }, []);

  // 2. Start Camera (Mobile Compatible)
  useEffect(() => {
    async function start() {
      try {
        // Mobile-friendly constraints: Rear camera ('environment'), standard definition
        const constraints = { 
            video: { facingMode: "environment" }, 
            audio: mode === 'video' 
        };
        
        const s = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(s);
        if (videoRef.current) {
            videoRef.current.srcObject = s;
            // playsInline is mandatory for iOS to play video inline
            videoRef.current.play().catch(e => console.error("Play Error:", e));
        }
      } catch (err) {
        alert("Camera Error: " + err.message + "\nEnsure you are using HTTPS or Localhost.");
        onClose();
      }
    }
    start();
    
    return () => {
        if (stream) stream.getTracks().forEach(t => t.stop());
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line
  }, []);

  // 3. Capture Photo
  const handleCapturePhoto = async () => {
    if (captureRef.current) {
      try {
        const canvas = await html2canvas(captureRef.current, { useCORS: true, allowTaint: true, logging: false, scale: 1 });
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            onCapture(url, blob); onClose();
        }, 'image/jpeg', 0.8);
      } catch (err) { alert("Capture failed: " + err.message); }
    }
  };

  // 4. Video Recording (Burn Data to Canvas)
  const drawToCanvas = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const vid = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (canvas.width !== vid.videoWidth) { canvas.width = vid.videoWidth; canvas.height = vid.videoHeight; }

    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

    // Overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvas.width, 110); 

    ctx.shadowColor = "black"; ctx.shadowBlur = 3;
    
    // Left Data (Yellow)
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFD700"; // Gold
    ctx.font = "bold 20px Arial";
    ctx.fillText(`Dist: ${metaData?.district || 'N/A'}`, 20, 30);
    ctx.fillText(`Block: ${metaData?.block || 'N/A'}`, 20, 60);
    ctx.fillText(`Route: ${metaData?.route || 'N/A'}`, 20, 90);

    // Right Data (White)
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(dateTime, canvas.width - 20, 30);
    ctx.fillText(`Lat: ${coords.lat.toFixed(5)}`, canvas.width - 20, 60);
    ctx.fillText(`Lon: ${coords.lon.toFixed(5)}`, canvas.width - 20, 90);
    ctx.textAlign = "left";

    animationRef.current = requestAnimationFrame(drawToCanvas);
  };

  const handleStartRecord = () => {
    if (!stream) return;
    drawToCanvas(); // Start rendering canvas
    
    const canvasStream = canvasRef.current.captureStream(30); 
    // Add audio track if exists
    if(stream.getAudioTracks().length > 0) {
        canvasStream.addTrack(stream.getAudioTracks()[0]);
    }

    const rec = new MediaRecorder(canvasStream, { mimeType: 'video/webm' });
    chunksRef.current = [];
    
    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        onCapture(url, blob); onClose();
    };

    rec.start();
    mediaRecorderRef.current = rec;
    setIsRecording(true);

    setTimer(0);
    timerIntervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
  };

  const handleStopRecord = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsRecording(false);
  };

  const styles = {
      yellowText: { color: '#FFD700', fontSize: '16px', marginBottom: '4px', textShadow: '1px 1px 2px black', fontWeight: 'bold' },
      whiteText: { color: 'white', fontSize: '14px', marginBottom: '2px', textShadow: '1px 1px 2px black' },
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "black", zIndex: 9999 }}>
      <canvas ref={canvasRef} style={{display:'none'}} />

      <div ref={captureRef} style={{ position: "relative", width: "100%", height: "100%", overflow:"hidden" }}>
        {/* playsInline and muted are critical for mobile auto-play compatibility */}
        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />

        {/* HEADER OVERLAY */}
        <div style={{ position: "absolute", top: 0, left: 0, width: '100%', padding: '15px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)', zIndex: 10, display:'flex', justifyContent:'space-between' }}>
            <div>
                <div style={styles.yellowText}>Dist: {metaData?.district}</div>
                <div style={styles.yellowText}>Block: {metaData?.block}</div>
                <div style={styles.yellowText}>Route: {metaData?.route}</div>
            </div>
            <div style={{textAlign:'right'}}>
                <div style={styles.whiteText}>{dateTime}</div>
                <div style={styles.whiteText}>{coords.lat.toFixed(5)}</div>
                <div style={styles.whiteText}>{coords.lon.toFixed(5)}</div>
            </div>
        </div>

        {/* MAP OVERLAY (Bottom Left) */}
        <div style={{ 
            position: "absolute", 
            bottom: '120px', 
            left: '20px', 
            width: "100px", 
            height: "100px", 
            border: "2px solid white", 
            borderRadius: "4px", 
            overflow: 'hidden', 
            zIndex: 10,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}>
            <MiniMap lat={coords.lat} lon={coords.lon} />
            <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'#2196f3', fontSize:'24px', textShadow:'0 0 3px white'}}>📍</div>
        </div>
      </div>

      {/* CONTROLS */}
      <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", color: "white", border: "none", fontSize: "30px", cursor: "pointer", zIndex: 20 }}>✖</button>

      <div style={{ position: "absolute", bottom: 30, width: "100%", display: "flex", justifyContent: "center", zIndex: 20 }}>
        {mode === 'photo' ? (
            <button onClick={handleCapturePhoto} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "white", border: "5px solid #ccc", cursor:'pointer' }}></button>
        ) : (
            !isRecording ? 
            <button onClick={handleStartRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "red", border: "5px solid white", cursor:'pointer' }}></button> :
            <button onClick={handleStopRecord} style={{ width: "70px", height: "70px", borderRadius: "50%", background: "black", border: "4px solid red", cursor:'pointer', color:'white', fontWeight:'bold' }}>{timer}s</button>
        )}
      </div>
    </div>
  );
}