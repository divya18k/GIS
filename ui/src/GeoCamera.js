import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import html2canvas from "html2canvas";
import piexif from "piexifjs";
import 'leaflet/dist/leaflet.css';

// --- STANDARD BLUE POINTER ICON ---
const pointerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- HELPER: EXIF Data ---
const toRational = (num) => {
    const m = 10000;
    return [Math.round(num * m), m];
};

const getGpsData = (lat, lng) => {
    const latAbs = Math.abs(lat);
    const lngAbs = Math.abs(lng);
    const latDeg = Math.floor(latAbs);
    const latMin = Math.floor((latAbs - latDeg) * 60);
    const latSec = ((latAbs - latDeg) * 60 - latMin) * 60;
    const lngDeg = Math.floor(lngAbs);
    const lngMin = Math.floor((lngAbs - lngDeg) * 60);
    const lngSec = ((lngAbs - lngDeg) * 60 - lngMin) * 60;

    return {
        lat: [[latDeg, 1], [latMin, 1], toRational(latSec)],
        lng: [[lngDeg, 1], [lngMin, 1], toRational(lngSec)],
        latRef: lat < 0 ? "S" : "N",
        lngRef: lng < 0 ? "W" : "E"
    };
};

// --- COMPONENT: FORCE MAP TO FOLLOW USER INSTANTLY ---
const RecenterAutomatically = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    if(lat && lon && lat !== 0) {
        map.setView([lat, lon], map.getZoom(), { animate: false }); 
    }
  }, [lat, lon, map]);
  return null;
};

// --- COMPONENT: MINI MAP (Satellite + Blue Line) ---
const MiniMap = React.forwardRef(({ lat, lon, path }, ref) => {
    if (!lat || !lon) return <div style={{color:'white', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>Locating...</div>;
    
    return (
        <div ref={ref} style={{width:'100%', height:'100%'}}>
            <MapContainer 
                center={[lat, lon]} 
                zoom={19} 
                zoomControl={false} 
                dragging={false} 
                scrollWheelZoom={false} 
                attributionControl={false} 
                style={{ width: "100%", height: "100%", background: 'transparent' }}
            >
                {/* SATELLITE TILES (ArcGIS) for the Video Overlay */}
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                
                {/* BLUE LINE TRACKING MOVEMENT */}
                <Polyline positions={path} color="#00BFFF" weight={5} opacity={0.9} />
                
                {/* BLUE POINTER */}
                <Marker position={[lat, lon]} icon={pointerIcon} />
                
                <RecenterAutomatically lat={lat} lon={lon} />
            </MapContainer>
        </div>
    );
});

export default function GeoCamera({ mode, onCapture, onClose, metaData }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const captureRef = useRef(null);
  const mapContainerRef = useRef(null);
  
  // LIVE REFS
  const gpsRef = useRef({ lat: 0, lon: 0 });
  const mapSnapshotRef = useRef(null);
  const isRecordingRef = useRef(false);

  // STATE
  const [uiGps, setUiGps] = useState({ lat: 0, lon: 0 });
  const [path, setPath] = useState([]); 
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerInterval = useRef(null);
  const mapUpdateInterval = useRef(null);
  const animationRef = useRef(null);

  // 1. GET LIVE GPS
  useEffect(() => {
    if (!navigator.geolocation) return;
    
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
          const { latitude, longitude } = pos.coords;
          
          // 1. Update Refs
          gpsRef.current = { lat: latitude, lon: longitude };
          
          // 2. Update UI
          setUiGps({ lat: latitude, lon: longitude });
          
          // 3. Track Path (Always track to show movement history)
          if (isRecordingRef.current) {
               setPath(prev => [...prev, [latitude, longitude]]);
          }
      },
      (err) => console.warn("GPS Error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 2000 }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 2. Start Camera
  useEffect(() => {
    let localStream = null;
    async function startCam() {
      try {
        const constraints = {
            video: { facingMode: mode === 'selfie' ? 'user' : 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false 
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStream = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error(e));
        }
      } catch (err) {
        alert("Camera Error: " + err.message);
        onClose();
      }
    }
    startCam();
    return () => {
        if (localStream) localStream.getTracks().forEach(t => t.stop());
        if(timerInterval.current) clearInterval(timerInterval.current);
        if(mapUpdateInterval.current) clearInterval(mapUpdateInterval.current);
        if(animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line
  }, [mode]);

  // 3. Map Snapshot Loop
  useEffect(() => {
      if (mode === 'selfie') return;
      mapUpdateInterval.current = setInterval(() => {
          if(mapContainerRef.current) {
              html2canvas(mapContainerRef.current, { 
                  useCORS: true, 
                  scale: 0.8, 
                  logging: false, 
                  backgroundColor: null 
              }).then(canvas => {
                  mapSnapshotRef.current = canvas;
              });
          }
      }, 500); 
      return () => clearInterval(mapUpdateInterval.current);
  }, [mode]);

  // 4. DRAW LOOP (The Overlay Logic)
  const drawToCanvas = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }

    // A. Draw Camera Video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (mode !== 'selfie') {
        const gps = gpsRef.current;
        const now = new Date();
        const dateTimeStr = now.toLocaleString('en-IN', { hour12: true });

        // B. Gradient for text readability
        const grad = ctx.createLinearGradient(0, 0, 0, 180);
        grad.addColorStop(0, "rgba(0,0,0,0.9)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, 180);

        // --- C. TEXT OVERLAYS ---
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.lineWidth = 3;

        const leftX = 30;
        const rightX = canvas.width - 30;
        const startY = 50;
        const lineHeight = 40;

        // === LEFT SIDE (Yellow Labels) ===
        ctx.textAlign = "left";
        ctx.font = "bold 26px Arial";

        // District
        ctx.fillStyle = "#FFD700"; // Yellow
        ctx.fillText("District:", leftX, startY);
        ctx.fillStyle = "white";
        ctx.fillText(metaData.district || '-', leftX + 110, startY);

        // Block
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Block:", leftX, startY + lineHeight);
        ctx.fillStyle = "white";
        ctx.fillText(metaData.block || '-', leftX + 110, startY + lineHeight);

        // Span ID
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Span ID:", leftX, startY + (lineHeight * 2));
        ctx.fillStyle = "white";
        ctx.fillText(metaData.route || '-', leftX + 110, startY + (lineHeight * 2));


        // === RIGHT SIDE (White Data) ===
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        
        // Date Time
        ctx.font = "bold 22px Arial";
        ctx.fillText(dateTimeStr, rightX, startY);

        // Latitude
        ctx.font = "bold 22px Arial";
        ctx.fillText(`Lat: ${gps.lat.toFixed(6)}`, rightX, startY + lineHeight);

        // Longitude
        ctx.font = "bold 22px Arial";
        ctx.fillText(`Lon: ${gps.lon.toFixed(6)}`, rightX, startY + (lineHeight * 2));


        // --- D. MINI MAP (Bottom Left) ---
        if (mapSnapshotRef.current) {
            const mapW = 160;
            const mapH = 160;
            const mapX = 20;
            const mapY = canvas.height - mapH - 20;

            // Black Border Background
            ctx.fillStyle = "white";
            ctx.fillRect(mapX - 3, mapY - 3, mapW + 6, mapH + 6);
            
            // Map Image
            ctx.drawImage(mapSnapshotRef.current, mapX, mapY, mapW, mapH);
        }
    }

    animationRef.current = requestAnimationFrame(drawToCanvas);
  };

  // 5. Capture Photo
//   const takePhoto = () => {
//     if (mode === 'selfie') {
//         const canvas = canvasRef.current;
//         drawToCanvas(); 
//         canvas.toBlob(blob => {
//             onCapture(URL.createObjectURL(blob), blob, gpsRef.current);
//             onClose();
//         }, 'image/jpeg', 0.9);
//         return;
//     }
//     if(mapContainerRef.current) {
//         html2canvas(mapContainerRef.current, {useCORS:true}).then(mapCanvas => {
//             mapSnapshotRef.current = mapCanvas;
//             drawToCanvas();
//             setTimeout(async () => {
//                 if(canvasRef.current) {
//                     const jpegDataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
//                     const currentGps = gpsRef.current;
//                     const gpsInfo = getGpsData(currentGps.lat, currentGps.lon);
//                     const exifObj = { "GPS": { 
//                         [piexif.GPSIFD.GPSLatitudeRef]: gpsInfo.latRef,
//                         [piexif.GPSIFD.GPSLatitude]: gpsInfo.lat,
//                         [piexif.GPSIFD.GPSLongitudeRef]: gpsInfo.lngRef,
//                         [piexif.GPSIFD.GPSLongitude]: gpsInfo.lng
//                     }};
//                     const exifBytes = piexif.dump(exifObj);
//                     const newJpegUrl = piexif.insert(exifBytes, jpegDataUrl);
//                     const res = await fetch(newJpegUrl);
//                     const blob = await res.blob();
//                     onCapture(newJpegUrl, blob, currentGps);
//                     onClose();
//                 }
//             }, 50);
//         });
//     }
//   };


const takePhoto = () => {
    if (mode === 'selfie') {
        const canvas = canvasRef.current;
        drawToCanvas(); 
        // Selfie: Just save as standard blob (no EXIF needed usually)
        canvas.toBlob(blob => {
            onCapture(URL.createObjectURL(blob), blob, gpsRef.current);
            onClose();
        }, 'image/jpeg', 0.9);
        return;
    }

    if(mapContainerRef.current) {
        // Use html2canvas to grab the map
        html2canvas(mapContainerRef.current, {useCORS:true, allowTaint: true}).then(mapCanvas => {
            mapSnapshotRef.current = mapCanvas;
            drawToCanvas(); // Draw map + video + text to main canvas

            setTimeout(async () => {
                if(canvasRef.current) {
                    // Force JPEG format
                    const jpegDataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);

                    // FIX: Check if it actually is a JPEG before inserting EXIF
                    if (jpegDataUrl.startsWith("data:image/jpeg")) {
                        try {
                            const currentGps = gpsRef.current;
                            const gpsInfo = getGpsData(currentGps.lat, currentGps.lon);
                            const exifObj = { "GPS": { 
                                [piexif.GPSIFD.GPSLatitudeRef]: gpsInfo.latRef,
                                [piexif.GPSIFD.GPSLatitude]: gpsInfo.lat,
                                [piexif.GPSIFD.GPSLongitudeRef]: gpsInfo.lngRef,
                                [piexif.GPSIFD.GPSLongitude]: gpsInfo.lng
                            }};
                            const exifBytes = piexif.dump(exifObj);
                            const newJpegUrl = piexif.insert(exifBytes, jpegDataUrl);
                            
                            // Convert back to blob for upload
                            const res = await fetch(newJpegUrl);
                            const blob = await res.blob();
                            onCapture(newJpegUrl, blob, currentGps);
                            onClose();
                        } catch (e) {
                            console.error("EXIF Error (falling back to plain image):", e);
                            // Fallback: Save without EXIF if piexif fails
                            canvasRef.current.toBlob(blob => {
                                onCapture(URL.createObjectURL(blob), blob, gpsRef.current);
                                onClose();
                            }, 'image/jpeg', 0.9);
                        }
                    } else {
                        // If browser gave us a PNG (rare), just save it
                        canvasRef.current.toBlob(blob => {
                            onCapture(URL.createObjectURL(blob), blob, gpsRef.current);
                            onClose();
                        });
                    }
                }
            }, 50);
        });
    }
};

  // 6. Record Video
  const startRecording = () => {
    setPath([]); 
    isRecordingRef.current = true;
    setIsRecording(true);
    drawToCanvas(); 

    const stream = canvasRef.current.captureStream(30); 
    
    let mimeType = 'video/webm';
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) mimeType = 'video/webm;codecs=vp9';
    else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) mimeType = 'video/webm;codecs=vp8';

    const recorder = new MediaRecorder(stream, { mimeType });
    chunksRef.current = [];
    
    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType }); 
        const url = URL.createObjectURL(blob);
        onCapture(url, blob, gpsRef.current);
        onClose();
    };

    recorder.start(1000); 
    mediaRecorderRef.current = recorder;
    setTimer(0);
    timerInterval.current = setInterval(() => setTimer(t => t + 1), 1000);
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsRecording(false);
    clearInterval(timerInterval.current);
    clearInterval(mapUpdateInterval.current);
    cancelAnimationFrame(animationRef.current);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'black', zIndex: 9999 }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} />

        <div ref={captureRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: mode === 'selfie' ? 'scaleX(-1)' : 'none' }} />
            
            {mode !== 'selfie' && (
                <>
                    {/* User HUD - TOP LEFT (Yellow Labels) */}
                    <div style={{position:'absolute', top:30, left:20, textAlign:'left', textShadow:'1px 1px 2px black'}}>
                        <div style={{color:'#FFD700', fontSize:'20px', fontWeight:'bold'}}>District: <span style={{color:'white'}}>{metaData.district}</span></div>
                        <div style={{color:'#FFD700', fontSize:'20px', fontWeight:'bold', marginTop:'5px'}}>Block: <span style={{color:'white'}}>{metaData.block}</span></div>
                        <div style={{color:'#FFD700', fontSize:'20px', fontWeight:'bold', marginTop:'5px'}}>Span ID: <span style={{color:'white'}}>{metaData.route}</span></div>
                    </div>

                    {/* User HUD - TOP RIGHT (White Data) */}
                    <div style={{position:'absolute', top:30, right:20, textAlign:'right', textShadow:'1px 1px 2px black'}}>
                        <div style={{color:'white', fontSize:'18px', fontWeight:'bold', marginBottom:'5px'}}>
                            {new Date().toLocaleString('en-IN', { hour12: true })}
                        </div>
                        <div style={{color:'white', fontSize:'18px', fontFamily:'Arial', fontWeight:'bold'}}>
                            Lat: {uiGps.lat.toFixed(6)}
                        </div>
                        <div style={{color:'white', fontSize:'18px', fontFamily:'Arial', fontWeight:'bold', marginTop:'2px'}}>
                            Lon: {uiGps.lon.toFixed(6)}
                        </div>
                    </div>

                    {/* MINI MAP (Visible for HTML2Canvas) */}
                    <div style={{ position: 'absolute', bottom: '120px', left: '20px', width: '150px', height: '150px', border: '3px solid white', borderRadius: '4px', overflow:'hidden', zIndex:10, boxShadow:'0 0 10px black' }}>
                        <MiniMap ref={mapContainerRef} lat={uiGps.lat} lon={uiGps.lon} path={path} />
                    </div>
                </>
            )}
        </div>

        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '30px', background: 'none', border: 'none', color: 'white', cursor:'pointer', zIndex: 20 }}>✖</button>

        <div style={{ position: 'absolute', bottom: '30px', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
            {(mode === 'photo' || mode === 'selfie') ? (
                <button onClick={takePhoto} style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'white', border: '5px solid #ccc', cursor:'pointer' }}></button>
            ) : (
                !isRecording ? 
                <button onClick={startRecording} style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'red', border: '5px solid white', cursor:'pointer', boxShadow:'0 0 15px red' }}></button> :
                <div style={{textAlign:'center'}}>
                    <button onClick={stopRecording} style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'black', border: '4px solid red', cursor:'pointer' }}>
                        <div style={{width:'25px', height:'25px', background:'red', margin:'20px auto', borderRadius:'4px'}}></div>
                    </button>
                    <div style={{color:'white', marginTop:'10px', fontWeight:'bold', fontSize:'18px', textShadow:'0 0 5px black'}}>{timer}s</div>
                </div>
            )}
        </div>
    </div>
  );
}