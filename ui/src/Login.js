// import React, { useState } from 'react';
// import axios from 'axios';

// const Login = ({ onLogin }) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); // Clear previous errors

//     try {
//         // WARNING: This URL is for creating surveys, not logging in.
//         // If you intended to login, you should create a '/login' endpoint in your backend.
//         const response = await axios.post('http://localhost:4000/users/login', {
//             email: username,
//             password: password
//         });

//         // Assuming your API returns { success: true } on success
//         localStorage.setItem("token", response.data.token);
//         if (response.data.token) {
//             onLogin(username);
//         } else {
//             setError('Login failed: Server rejected credentials');
//         }

//     } catch (err) {
//         console.error("API Call Error:", err);
//         // Check if the server sent a specific error message
//         const message = err.response?.data?.error || 'Connection failed or Invalid Credentials';
//         setError(message);
//     }
// };

//     const styles = {
//         container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
//         card: { background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', width: '380px' },
//         header: { textAlign: 'center', color: '#2A4480', marginBottom: '25px', borderBottom: '2px solid #2A4480', paddingBottom: '15px' },
//         inputGroup: { marginBottom: '15px' },
//         label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555', fontWeight: 'bold' },
//         input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
//         button: { width: '100%', padding: '12px', background: '#2A4480', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', transition: '0.3s' },
//         error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.card}>
//                 <h2 style={styles.header}>LOGIN</h2>
//                 {error && <div style={styles.error}>{error}</div>}
//                 <form onSubmit={handleSubmit}>
//                     <div style={styles.inputGroup}>
//                         <label style={styles.label}>Username ID</label>
//                         <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={styles.input} placeholder="Enter Username" />
//                     </div>
//                     <div style={styles.inputGroup}>
//                         <label style={styles.label}>Password</label>
//                         <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} placeholder="Enter Password" />
//                     </div>
//                     <button type="submit" style={styles.button}>SECURE LOGIN</button>
//                 </form>
//                 <div style={{ marginTop: '20px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
//                     Authorized Personnel Only | v2.0
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;



import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    // State to switch between Login and Register views
    const [isLoginMode, setIsLoginMode] = useState(true);

    // Form Fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role
    
    // UI Feedback
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // 1. Determine URL based on mode
        const endpoint = isLoginMode ? '/login' : '/register';
        // const url = `http://localhost:4000/users${endpoint}`;
        const url = `https://gis-backend-9ajk.onrender.com/users${endpoint}`;
        // 2. Prepare Data (Match exactly what you did in Postman)
        const payload = { 
            username: username, 
            password: password 
        };

        // Only add 'role' if we are Registering
        if (!isLoginMode) {
            payload.role = role;
        }

        try {
            const response = await axios.post(url, payload);

            if (isLoginMode) {
                // --- LOGIN LOGIC ---
                if (response.data.success) {
                    // Save token for future requests
                    localStorage.setItem("token", response.data.token);
                    
                    // Notify App.js that login succeeded
                    onLogin(response.data.user.username, response.data.user.role);
                }
            } else {
                // --- REGISTER LOGIC ---
                // If register worked (Status 200), show message and switch to login
                setSuccessMsg("Registration Successful! Please log in now.");
                setIsLoginMode(true); // Switch view to Login
                setPassword(''); // Clear password for security
            }

        } catch (err) {
            console.error("Auth Error:", err);
            // Show error message from Backend or default
            const message = err.response?.data?.error || 'Connection failed or Invalid Credentials';
            setError(message);
        }
    };

    // --- STYLES ---
    const styles = {
        container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
        card: { background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', width: '380px' },
        header: { textAlign: 'center', color: '#2A4480', marginBottom: '25px', borderBottom: '2px solid #2A4480', paddingBottom: '15px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555', fontWeight: 'bold' },
        input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
        select: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', background: 'white' },
        button: { width: '100%', padding: '12px', background: '#2A4480', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', transition: '0.3s' },
        toggleLink: { display: 'block', width: '100%', textAlign: 'center', marginTop: '15px', background: 'none', border: 'none', color: '#2A4480', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' },
        error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' },
        success: { background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>
                    {isLoginMode ? 'SECURE LOGIN' : 'NEW REGISTRATION'}
                </h2>

                {error && <div style={styles.error}>{error}</div>}
                {successMsg && <div style={styles.success}>{successMsg}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            style={styles.input} 
                            placeholder="Enter Username" 
                            required 
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            style={styles.input} 
                            placeholder="Enter Password" 
                            required 
                        />
                    </div>

                    {/* Show Role Dropdown ONLY when Registering */}
                    {!isLoginMode && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Role</label>
                            <select 
                                value={role} 
                                onChange={e => setRole(e.target.value)} 
                                style={styles.select}
                            >
                                <option value="user">User (Surveyor)</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" style={styles.button}>
                        {isLoginMode ? 'LOGIN' : 'REGISTER'}
                    </button>
                </form>

                {/* Switch between Login and Register */}
                <button 
                    onClick={() => {
                        setIsLoginMode(!isLoginMode);
                        setError('');
                        setSuccessMsg('');
                    }} 
                    style={styles.toggleLink}
                >
                    {isLoginMode 
                        ? "Don't have an account? Sign Up" 
                        : "Already have an account? Login"}
                </button>

                <div style={{ marginTop: '20px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
                    Authorized Personnel Only | v2.0
                </div>
            </div>
        </div>
    );
};

export default Login;