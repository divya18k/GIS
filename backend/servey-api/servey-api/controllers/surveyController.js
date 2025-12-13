// // import { db } from '../config/db.js';
// // import fs from 'fs';
// // import path from 'path';
// // import { uploadToSynology, downloadFromSynology } from '../services/synologyService.js';

// // const TYPE_CODES = {
// //     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// //     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// //     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // };

// // const generateFilenameBase = (district, block, typeCode, shotNo) => {
// //     // const d = (district || 'UNK').substring(0, 3).toUpperCase();
// //     // const b = (block || 'UNK').substring(0, 3).toUpperCase();
// //     const d = (district || 'UNK');
// //     const b = (block || 'UNK');
// //     const s = String(shotNo || '1').padStart(2, '0'); 
// //     return `${d}_${b}_${typeCode}_SHOT${s}`;
// // };

// // // export const createSurvey = async (req, res) => {
// // //     try {
// // //         console.log("📥 Received Survey Submission...");
// // //         console.log("Files received:", req.files ? Object.keys(req.files) : "NONE");

// // //         const { 
// // //             district, block, routeName, locationType, 
// // //             shotNumber, ringNumber, startLocName, endLocName, 
// // //             latitude, longitude, surveyorName, surveyorMobile, remarks,
// // //             submittedBy, dateTime 
// // //         } = req.body;

// // //         const typeCode = TYPE_CODES[locationType] || 'OTH';
// // //         const baseFilename = generateFilenameBase(district, block, typeCode, shotNumber);
// // //         const metadata = { district, block, locationType, shotNumber, dateTime };

// // //         const photoPaths = [];
// // //         const videoPaths = [];
// // //         let selfiePath = null;

// // //         const processFile = async (file, suffix, index = '') => {
// // //             if (!file) return null;

// // //             let ext = path.extname(file.originalname);
// // //             if (!ext || ext === '.blob') {
// // //                 ext = file.mimetype.includes('image') ? '.jpg' : '.mp4';
// // //             }

// // //             const finalName = `${baseFilename}_${suffix}${index}${ext}`;
// // //             const nasPath = await uploadToSynology(file.path, metadata, finalName);
            
// // //             // Cleanup
// // //             if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            
// // //             return nasPath;
// // //         };

// // //         // Process Files
// // //         if (req.files['photos']) {
// // //             for (let i = 0; i < req.files['photos'].length; i++) {
// // //                 const path = await processFile(req.files['photos'][i], 'photo', i > 0 ? `_${i}` : '');
// // //                 if (path) photoPaths.push(path);
// // //             }
// // //         }

// // //         if (req.files['videos']) {
// // //             for (let i = 0; i < req.files['videos'].length; i++) {
// // //                 const tag = i === 0 ? 'video' : 'gopro';
// // //                 const path = await processFile(req.files['videos'][i], tag);
// // //                 if (path) videoPaths.push(path);
// // //             }
// // //         }

// // //         if (req.files['selfie']) {
// // //             selfiePath = await processFile(req.files['selfie'][0], 'selfie');
// // //         }

// // //         // --- CHECK IF UPLOAD FAILED ---
// // //         // If files were sent but paths are empty, upload failed.
// // //         if (req.files['photos'] && photoPaths.length === 0) {
// // //             console.error("⚠️ Photos were sent but Synology upload returned NULL");
// // //         }

// // //         const query = `
// // //             INSERT INTO surveys (
// // //                 district, block, route_name, location_type, 
// // //                 shot_number, ring_number, start_location, end_location, 
// // //                 latitude, longitude, surveyor_name, surveyor_mobile, 
// // //                 generated_filename, submitted_by, survey_date,
// // //                 photos, videos, selfie_path, remarks
// // //             ) 
// // //             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
// // //             RETURNING *`;

// // //         const values = [
// // //             district, block, routeName, locationType, 
// // //             shotNumber, ringNumber, startLocName, endLocName, 
// // //             parseFloat(latitude || 0), parseFloat(longitude || 0), 
// // //             surveyorName, surveyorMobile, baseFilename, submittedBy, dateTime,
// // //             JSON.stringify(photoPaths),
// // //             JSON.stringify(videoPaths), 
// // //             selfiePath, remarks
// // //         ];

// // //         const result = await db.query(query, values);
// // //         console.log("✅ DB Insert Success. ID:", result.rows[0].id);
// // //         res.json({ success: true, survey: result.rows[0] });

// // //     } catch (error) {
// // //         console.error("❌ Create Survey Error:", error);
// // //         res.status(500).json({ error: error.message });
// // //     }
// // // };

// // // ... keep your imports ...

// // export const createSurvey = async (req, res) => {
// //     try {
// //         console.log("📥 Received Survey Submission...");

// //         const { 
// //             district, block, routeName, locationType, 
// //             shotNumber, ringNumber, startLocName, endLocName, 
// //             latitude, longitude, surveyorName, surveyorMobile, remarks,
// //             submittedBy, dateTime 
// //         } = req.body;

// //         const typeCode = TYPE_CODES[locationType] || 'OTH';
// //         const baseFilename = generateFilenameBase(district, block, typeCode, shotNumber);
// //         const metadata = { district, block, locationType, shotNumber, dateTime };

// //         const photoPaths = [];
// //         const videoPaths = [];
// //         let selfiePath = null;

// //         // --- SAFE FILE PROCESSING ---
// //         const processFile = async (file, suffix, index = '') => {
// //             if (!file) return null;
            
// //             // Try uploading to NAS, but if it fails, just return the filename so DB saves anyway
// //             try {
// //                 let ext = path.extname(file.originalname);
// //                 if (!ext || ext === '.blob') ext = file.mimetype.includes('image') ? '.jpg' : '.mp4';
// //                 const finalName = `${baseFilename}_${suffix}${index}${ext}`;
                
// //                 // ATTEMPT UPLOAD
// //                 // If this fails (e.g., Render can't reach NAS), it jumps to catch
// //                 const nasPath = await uploadToSynology(file.path, metadata, finalName);
                
// //                 // Cleanup local file
// //                 if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                
// //                 return nasPath || finalName; // Return path if success, or name if failed

// //             } catch (uploadErr) {
// //                 console.error("⚠️ Synology Upload Failed (Skipping):", uploadErr.message);
// //                 return "UPLOAD_FAILED_" + file.originalname; // Save placeholder to DB
// //             }
// //         };

// //         // Process Files
// //         if (req.files['photos']) {
// //             for (let i = 0; i < req.files['photos'].length; i++) {
// //                 const path = await processFile(req.files['photos'][i], 'photo', i > 0 ? `_${i}` : '');
// //                 if (path) photoPaths.push(path);
// //             }
// //         }
// //         if (req.files['videos']) {
// //             for (let i = 0; i < req.files['videos'].length; i++) {
// //                 const path = await processFile(req.files['videos'][i], i === 0 ? 'video' : 'gopro');
// //                 if (path) videoPaths.push(path);
// //             }
// //         }
// //         if (req.files['selfie']) {
// //             selfiePath = await processFile(req.files['selfie'][0], 'selfie');
// //         }

// //         // --- DATABASE INSERT ---
// //         const query = `
// //             INSERT INTO surveys (
// //                 district, block, route_name, location_type, 
// //                 shot_number, ring_number, start_location, end_location, 
// //                 latitude, longitude, surveyor_name, surveyor_mobile, 
// //                 generated_filename, submitted_by, survey_date,
// //                 photos, videos, selfie_path, remarks
// //             ) 
// //             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
// //             RETURNING *`;

// //         const values = [
// //             district, block, routeName, locationType, 
// //             shotNumber, ringNumber, startLocName, endLocName, 
// //             parseFloat(latitude || 0), parseFloat(longitude || 0), 
// //             surveyorName, surveyorMobile, baseFilename, submittedBy, dateTime,
// //             JSON.stringify(photoPaths),
// //             JSON.stringify(videoPaths), 
// //             selfiePath, remarks
// //         ];

// //         const result = await db.query(query, values);
// //         console.log("✅ DB Insert Success. ID:", result.rows[0].id);
// //         res.json({ success: true, survey: result.rows[0] });

// //     } catch (error) {
// //         console.error("❌ Create Survey Error:", error);
// //         // Show exact error in the popup on phone
// //         res.status(500).json({ error: "DB Error: " + error.message }); 
// //     }
// // };

// // // ... keep getSurveys and other functions ...
// // export const getSurveys = async (req, res) => {
// //     try {
// //         const result = await db.query("SELECT * FROM surveys ORDER BY created_at DESC");
// //         const surveys = result.rows.map(s => {
// //             const mediaFiles = [];
// //             if (s.photos && Array.isArray(s.photos)) s.photos.forEach(p => mediaFiles.push({ type: 'photo', url: p }));
// //             else if (typeof s.photos === 'string') try { JSON.parse(s.photos).forEach(p => mediaFiles.push({ type: 'photo', url: p })); } catch(e){}
            
// //             if (s.videos && Array.isArray(s.videos)) s.videos.forEach(v => { const type = v.includes('gopro') ? 'gopro' : 'video'; mediaFiles.push({ type, url: v }); });
// //             else if (typeof s.videos === 'string') try { JSON.parse(s.videos).forEach(v => { const type = v.includes('gopro') ? 'gopro' : 'video'; mediaFiles.push({ type, url: v }); }); } catch(e){}

// //             if (s.selfie_path) mediaFiles.push({ type: 'selfie', url: s.selfie_path });

// //             return { ...s, shotNumber: s.shot_number, ringNumber: s.ring_number, startLocName: s.start_location, endLocName: s.end_location, routeName: s.route_name, locationType: s.location_type, mediaFiles };
// //         });
// //         res.json({ surveys });
// //     } catch (err) { res.status(500).json({ error: err.message }); }
// // };

// // export const cancelSurvey = async (req, res) => {
// //     try {
// //         const { id } = req.params;
// //         await db.query("DELETE FROM surveys WHERE id = $1", [id]);
// //         res.json({ success: true, message: "Survey deleted" });
// //     } catch (err) { res.status(500).json({ error: err.message }); }
// // };

// // // export const updateSurveyDetails = async (req, res) => {
// // //     try {
// // //         const { id } = req.params;
// // //         const { district, block, routeName, remarks, surveyorName, shotNumber, ringNumber } = req.body;
// // //         await db.query("UPDATE surveys SET district=$1, block=$2, route_name=$3, remarks=$4, surveyor_name=$5, shot_number=$6, ring_number=$7 WHERE id=$8", [district, block, routeName, remarks, surveyorName, shotNumber, ringNumber, id]);
// // //         res.json({ success: true });
// // //     } catch (err) { res.status(500).json({ error: err.message }); }
// // // };

// // export const updateSurveyDetails = async (req, res) => {
// //     try {
// //         const { id } = req.params;
        
// //         // 1. Destructure using the EXACT names sent by Dashboard.js (CamelCase)
// //         const { 
// //             district, 
// //             block, 
// //             routeName, 
// //             locationType, 
// //             shotNumber, 
// //             ringNumber, 
// //             startLocName, // Frontend sends 'startLocName'
// //             endLocName,   // Frontend sends 'endLocName'
// //             latitude, 
// //             longitude, 
// //             surveyorName, 
// //             surveyorMobile, 
// //             remarks,
// //             fileNamePrefix // Frontend sends 'fileNamePrefix'
// //         } = req.body;

// //         console.log(`🔄 Updating Survey ID: ${id}`);
// //         console.log(`Data received: Route=${routeName}, Lat=${latitude}, Lng=${longitude}`);

// //         // 2. Map these variables to the Database Columns (snake_case)
// //         const query = `
// //             UPDATE surveys 
// //             SET 
// //                 district = $1,
// //                 block = $2,
// //                 route_name = $3,
// //                 location_type = $4,
// //                 shot_number = $5,
// //                 ring_number = $6,
// //                 start_location = $7, 
// //                 end_location = $8,
// //                 latitude = $9,
// //                 longitude = $10,
// //                 surveyor_name = $11,
// //                 surveyor_mobile = $12,
// //                 generated_filename = $13,
// //                 remarks = $14,
// //                 updated_at = NOW()
// //             WHERE id = $15
// //         `;

// //         // 3. Prepare values array (handling potential nulls)
// //         const values = [
// //             district, 
// //             block, 
// //             routeName, 
// //             locationType, 
// //             shotNumber, 
// //             ringNumber, 
// //             startLocName, // Maps to start_location ($7)
// //             endLocName,   // Maps to end_location ($8)
// //             parseFloat(latitude || 0), 
// //             parseFloat(longitude || 0), 
// //             surveyorName, 
// //             surveyorMobile, 
// //             fileNamePrefix, // Maps to generated_filename ($13)
// //             remarks,
// //             id
// //         ];

// //         await db.query(query, values);
        
// //         console.log("Update Query Executed Successfully");
// //         res.json({ success: true });

// //     } catch (err) { 
// //         console.error(" Update Error:", err);
// //         res.status(500).json({ error: err.message }); 
// //     }
// // };
// // export const readFile = async (req, res) => {
// //     const filePath = req.query.path;
// //     if (!filePath) return res.status(400).send('No path provided');
// //     await downloadFromSynology(filePath, res);
// // };



// import { db } from '../config/db.js';
// import fs from 'fs';
// import path from 'path';
// import { uploadToSynology, downloadFromSynology } from '../services/synologyService.js';

// const TYPE_CODES = {
//     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
//     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
//     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// };

// const generateFilenameBase = (district, block, typeCode, shotNo) => {
//     const d = (district || 'UNK');
//     const b = (block || 'UNK');
//     const s = String(shotNo || '1').padStart(2, '0'); 
//     return `${d}_${b}_${typeCode}_SHOT${s}`;
// };

// export const createSurvey = async (req, res) => {
//     try {
//         console.log("📥 Received Survey Submission...");
        
//         const { 
//             district, block, routeName, locationType, 
//             shotNumber, ringNumber, startLocName, endLocName, 
//             latitude, longitude, surveyorName, surveyorMobile, remarks,
//             submittedBy, dateTime 
//         } = req.body;

//         const typeCode = TYPE_CODES[locationType] || 'OTH';
//         const baseFilename = generateFilenameBase(district, block, typeCode, shotNumber);
//         const metadata = { district, block, locationType, shotNumber, dateTime };

//         const photoPaths = [];
//         const videoPaths = [];
//         let selfiePath = null;

//         // --- SAFE FILE PROCESSING FUNCTION ---
//         const processFile = async (file, suffix, index = '') => {
//             if (!file) return null;
            
//             try {
//                 let ext = path.extname(file.originalname);
//                 if (!ext || ext === '.blob') {
//                     ext = file.mimetype.includes('image') ? '.jpg' : '.mp4';
//                 }
//                 const finalName = `${baseFilename}_${suffix}${index}${ext}`;
                
//                 // 1. ATTEMPT UPLOAD TO SYNOLOGY
//                 // This will use the Public IP you set in Render Environment variables
//                 const nasPath = await uploadToSynology(file.path, metadata, finalName);
                
//                 // 2. Cleanup local file after attempt
//                 if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                
//                 // 3. Return the Synology path if successful, otherwise return just filename
//                 return nasPath || finalName; 

//             } catch (uploadErr) {
//                 console.error(`⚠️ Synology Upload Failed for ${file.originalname}:`, uploadErr.message);
//                 // Return a placeholder so the Data is still saved in DB even if Image upload fails
//                 return "UPLOAD_FAILED_" + file.originalname; 
//             }
//         };

//         // --- PROCESS ALL FILES ---
//         if (req.files['photos']) {
//             for (let i = 0; i < req.files['photos'].length; i++) {
//                 const path = await processFile(req.files['photos'][i], 'photo', i > 0 ? `_${i}` : '');
//                 if (path) photoPaths.push(path);
//             }
//         }
//         if (req.files['videos']) {
//             for (let i = 0; i < req.files['videos'].length; i++) {
//                 const path = await processFile(req.files['videos'][i], i === 0 ? 'video' : 'gopro');
//                 if (path) videoPaths.push(path);
//             }
//         }
//         if (req.files['selfie']) {
//             selfiePath = await processFile(req.files['selfie'][0], 'selfie');
//         }

//         // --- DATABASE INSERT ---
//         const query = `
//             INSERT INTO surveys (
//                 district, block, route_name, location_type, 
//                 shot_number, ring_number, start_location, end_location, 
//                 latitude, longitude, surveyor_name, surveyor_mobile, 
//                 generated_filename, submitted_by, survey_date,
//                 photos, videos, selfie_path, remarks
//             ) 
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
//             RETURNING *`;

//         const values = [
//             district, block, routeName, locationType, 
//             shotNumber, ringNumber, startLocName, endLocName, 
//             parseFloat(latitude || 0), parseFloat(longitude || 0), 
//             surveyorName, surveyorMobile, baseFilename, submittedBy, dateTime,
//             JSON.stringify(photoPaths),
//             JSON.stringify(videoPaths), 
//             selfiePath, remarks
//         ];

//         const result = await db.query(query, values);
//         console.log("✅ DB Insert Success. ID:", result.rows[0].id);
//         res.json({ success: true, survey: result.rows[0] });

//     } catch (error) {
//         console.error("❌ Create Survey Error:", error);
//         res.status(500).json({ error: "DB Error: " + error.message });
//     }
// };

// export const getSurveys = async (req, res) => {
//     try {
//         const result = await db.query("SELECT * FROM surveys ORDER BY created_at DESC");
//         const surveys = result.rows.map(s => {
//             const mediaFiles = [];
            
//             // Helper to parse JSON or string paths
//             const parseMedia = (data, typePrefix) => {
//                 if (Array.isArray(data)) {
//                     data.forEach(url => mediaFiles.push({ type: typePrefix, url }));
//                 } else if (typeof data === 'string') {
//                     try {
//                         const parsed = JSON.parse(data);
//                         if (Array.isArray(parsed)) parsed.forEach(url => mediaFiles.push({ type: typePrefix, url }));
//                         else mediaFiles.push({ type: typePrefix, url: parsed });
//                     } catch (e) {
//                         // If not JSON, treat as single string path
//                         mediaFiles.push({ type: typePrefix, url: data });
//                     }
//                 }
//             };

//             parseMedia(s.photos, 'photo');
            
//             if (s.videos) {
//                 // Handle videos specifically to check for 'gopro'
//                 let videoData = s.videos;
//                 if (typeof videoData === 'string') {
//                     try { videoData = JSON.parse(videoData); } catch(e) {}
//                 }
//                 if (Array.isArray(videoData)) {
//                     videoData.forEach(v => {
//                         const type = v.includes('gopro') ? 'gopro' : 'video';
//                         mediaFiles.push({ type, url: v });
//                     });
//                 }
//             }

//             if (s.selfie_path) mediaFiles.push({ type: 'selfie', url: s.selfie_path });

//             return { 
//                 ...s, 
//                 shotNumber: s.shot_number, 
//                 ringNumber: s.ring_number, 
//                 startLocName: s.start_location, 
//                 endLocName: s.end_location, 
//                 routeName: s.route_name, 
//                 locationType: s.location_type, 
//                 mediaFiles 
//             };
//         });
//         res.json({ surveys });
//     } catch (err) { 
//         console.error("Get Surveys Error:", err);
//         res.status(500).json({ error: err.message }); 
//     }
// };

// export const cancelSurvey = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await db.query("DELETE FROM surveys WHERE id = $1", [id]);
//         res.json({ success: true, message: "Survey deleted" });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// };

// export const updateSurveyDetails = async (req, res) => {
//     try {
//         const { id } = req.params;
        
//         const { 
//             district, block, routeName, locationType, 
//             shotNumber, ringNumber, startLocName, endLocName, 
//             latitude, longitude, surveyorName, surveyorMobile, 
//             remarks, fileNamePrefix 
//         } = req.body;

//         console.log(`🔄 Updating Survey ID: ${id}`);

//         const query = `
//             UPDATE surveys 
//             SET 
//                 district = $1, block = $2, route_name = $3, location_type = $4,
//                 shot_number = $5, ring_number = $6, start_location = $7, end_location = $8,
//                 latitude = $9, longitude = $10, surveyor_name = $11, surveyor_mobile = $12,
//                 generated_filename = $13, remarks = $14, updated_at = NOW()
//             WHERE id = $15
//         `;

//         const values = [
//             district, block, routeName, locationType, 
//             shotNumber, ringNumber, startLocName, endLocName, 
//             parseFloat(latitude || 0), parseFloat(longitude || 0), 
//             surveyorName, surveyorMobile, fileNamePrefix, remarks, id
//         ];

//         await db.query(query, values);
//         res.json({ success: true });

//     } catch (err) { 
//         console.error("Update Error:", err);
//         res.status(500).json({ error: err.message }); 
//     }
// };

// export const readFile = async (req, res) => {
//     const filePath = req.query.path;
//     if (!filePath) return res.status(400).send('No path provided');
//     await downloadFromSynology(filePath, res);
// };


import { db } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { uploadToSynology, downloadFromSynology } from '../services/synologyService.js';

const TYPE_CODES = {
    "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
    "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
    "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
};

const generateFilenameBase = (district, block, typeCode, shotNo) => {
    const d = (district || 'UNK');
    const b = (block || 'UNK');
    const s = String(shotNo || '1').padStart(2, '0'); 
    return `${d}_${b}_${typeCode}_SHOT${s}`;
};

export const createSurvey = async (req, res) => {
    try {
        console.log("📥 Received Survey Submission...");
        
        const { 
            district, block, routeName, locationType, 
            shotNumber, ringNumber, startLocName, endLocName, 
            latitude, longitude, surveyorName, surveyorMobile, remarks,
            submittedBy, dateTime 
        } = req.body;

        const typeCode = TYPE_CODES[locationType] || 'OTH';
        const baseFilename = generateFilenameBase(district, block, typeCode, shotNumber);
        const metadata = { district, block, locationType, shotNumber, dateTime };

        const photoPaths = [];
        const videoPaths = [];
        let selfiePath = null;

        // --- SAFE FILE PROCESSING FUNCTION ---
        const processFile = async (file, suffix, index = '') => {
            if (!file) return null;
            
            try {
                let ext = path.extname(file.originalname);
                if (!ext || ext === '.blob') {
                    ext = file.mimetype.includes('image') ? '.jpg' : '.mp4';
                }
                const finalName = `${baseFilename}_${suffix}${index}${ext}`;
                
                console.log(`🚀 Attempting upload for: ${finalName}`);

                // 1. ATTEMPT UPLOAD TO SYNOLOGY
                const nasPath = await uploadToSynology(file.path, metadata, finalName);
                
                // 2. Cleanup local file after attempt
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                
                // 3. Return the Synology path if successful, otherwise return just filename
                return nasPath || finalName; 

            } catch (uploadErr) {
                console.error(`⚠️ Synology Upload Failed for ${file.originalname}:`, uploadErr.message);
                
                // Cleanup local file even if upload fails
                if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);

                // Return a placeholder so the Data is still saved in DB even if Image upload fails
                return "UPLOAD_FAILED_" + file.originalname; 
            }
        };

        // --- PROCESS ALL FILES (With Safety Checks) ---
        if (req.files) {
            if (req.files['photos']) {
                for (let i = 0; i < req.files['photos'].length; i++) {
                    const path = await processFile(req.files['photos'][i], 'photo', i > 0 ? `_${i}` : '');
                    if (path) photoPaths.push(path);
                }
            }
            if (req.files['videos']) {
                for (let i = 0; i < req.files['videos'].length; i++) {
                    const path = await processFile(req.files['videos'][i], i === 0 ? 'video' : 'gopro');
                    if (path) videoPaths.push(path);
                }
            }
            if (req.files['selfie']) {
                selfiePath = await processFile(req.files['selfie'][0], 'selfie');
            }
        }

        console.log("💾 Saving to Database...");

        // --- DATABASE INSERT ---
        const query = `
            INSERT INTO surveys (
                district, block, route_name, location_type, 
                shot_number, ring_number, start_location, end_location, 
                latitude, longitude, surveyor_name, surveyor_mobile, 
                generated_filename, submitted_by, survey_date,
                photos, videos, selfie_path, remarks
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
            RETURNING *`;

        const values = [
            district, block, routeName, locationType, 
            shotNumber, ringNumber, startLocName, endLocName, 
            parseFloat(latitude || 0), parseFloat(longitude || 0), 
            surveyorName, surveyorMobile, baseFilename, submittedBy, dateTime,
            JSON.stringify(photoPaths),
            JSON.stringify(videoPaths), 
            selfiePath, remarks
        ];

        const result = await db.query(query, values);
        console.log("✅ DB Insert Success. ID:", result.rows[0].id);
        res.json({ success: true, survey: result.rows[0] });

    } catch (error) {
        console.error("❌ Create Survey Error:", error);
        // Clean up files if DB insert crashes
        if (req.files) {
            Object.values(req.files).flat().forEach(f => {
                 if(fs.existsSync(f.path)) fs.unlinkSync(f.path);
            });
        }
        res.status(500).json({ error: "DB Error: " + error.message });
    }
};

export const getSurveys = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM surveys ORDER BY created_at DESC");
        const surveys = result.rows.map(s => {
            const mediaFiles = [];
            
            const parseMedia = (data, typePrefix) => {
                if (Array.isArray(data)) {
                    data.forEach(url => mediaFiles.push({ type: typePrefix, url }));
                } else if (typeof data === 'string') {
                    try {
                        const parsed = JSON.parse(data);
                        if (Array.isArray(parsed)) parsed.forEach(url => mediaFiles.push({ type: typePrefix, url }));
                        else mediaFiles.push({ type: typePrefix, url: parsed });
                    } catch (e) {
                        mediaFiles.push({ type: typePrefix, url: data });
                    }
                }
            };

            parseMedia(s.photos, 'photo');
            
            if (s.videos) {
                let videoData = s.videos;
                if (typeof videoData === 'string') {
                    try { videoData = JSON.parse(videoData); } catch(e) {}
                }
                const vArray = Array.isArray(videoData) ? videoData : [videoData];
                vArray.forEach(v => {
                    if(v) {
                        const type = v.includes('gopro') ? 'gopro' : 'video';
                        mediaFiles.push({ type, url: v });
                    }
                });
            }

            if (s.selfie_path) mediaFiles.push({ type: 'selfie', url: s.selfie_path });

            return { 
                ...s, 
                shotNumber: s.shot_number, 
                ringNumber: s.ring_number, 
                startLocName: s.start_location, 
                endLocName: s.end_location, 
                routeName: s.route_name, 
                locationType: s.location_type, 
                mediaFiles 
            };
        });
        res.json({ surveys });
    } catch (err) { 
        console.error("Get Surveys Error:", err);
        res.status(500).json({ error: err.message }); 
    }
};

export const cancelSurvey = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM surveys WHERE id = $1", [id]);
        res.json({ success: true, message: "Survey deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateSurveyDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { 
            district, block, routeName, locationType, 
            shotNumber, ringNumber, startLocName, endLocName, 
            latitude, longitude, surveyorName, surveyorMobile, 
            remarks, fileNamePrefix 
        } = req.body;

        console.log(`🔄 Updating Survey ID: ${id}`);

        const query = `
            UPDATE surveys 
            SET 
                district = $1, block = $2, route_name = $3, location_type = $4,
                shot_number = $5, ring_number = $6, start_location = $7, end_location = $8,
                latitude = $9, longitude = $10, surveyor_name = $11, surveyor_mobile = $12,
                generated_filename = $13, remarks = $14, updated_at = NOW()
            WHERE id = $15
        `;

        const values = [
            district, block, routeName, locationType, 
            shotNumber, ringNumber, startLocName, endLocName, 
            parseFloat(latitude || 0), parseFloat(longitude || 0), 
            surveyorName, surveyorMobile, fileNamePrefix, remarks, id
        ];

        await db.query(query, values);
        res.json({ success: true });

    } catch (err) { 
        console.error("Update Error:", err);
        res.status(500).json({ error: err.message }); 
    }
};

export const readFile = async (req, res) => {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).send('No path provided');
    await downloadFromSynology(filePath, res);
};