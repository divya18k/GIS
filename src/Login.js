import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock Credentials
        if ((username === 'admin' && password === '123') || (username === 'user' && password === '123')) {
            onLogin(username);
        } else {
            setError('Invalid Credentials. Try admin/123 or user/123');
        }
    };

    const styles = {
        container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
        card: { background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', width: '380px' },
        header: { textAlign: 'center', color: '#2A4480', marginBottom: '25px', borderBottom: '2px solid #2A4480', paddingBottom: '15px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555', fontWeight: 'bold' },
        input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
        button: { width: '100%', padding: '12px', background: '#2A4480', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', transition: '0.3s' },
        error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>LOGIN</h2>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username ID</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={styles.input} placeholder="Enter Username" />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} placeholder="Enter Password" />
                    </div>
                    <button type="submit" style={styles.button}>SECURE LOGIN</button>
                </form>
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
                    Authorized Personnel Only | v2.0
                </div>
            </div>
        </div>
    );
};

export default Login;