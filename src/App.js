import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

export default function App() {
    const [currentUser, setCurrentUser] = useState(null);

    // --- INITIALIZE DATABASE ---
    useEffect(() => {
        if (!localStorage.getItem('bsnl_surveys')) localStorage.setItem('bsnl_surveys', JSON.stringify([]));
        if (!localStorage.getItem('bsnl_logs')) localStorage.setItem('bsnl_logs', JSON.stringify([]));
        
        const initialUsers = [
            { username: 'admin', status: 'Offline', lastAction: '-' },
            { username: 'user', status: 'Offline', lastAction: '-' }
        ];
        if (!localStorage.getItem('bsnl_users')) {
            localStorage.setItem('bsnl_users', JSON.stringify(initialUsers));
        }
    }, []);

    // --- LOGGER ---
    const logAction = (username, action, details = '') => {
        const logs = JSON.parse(localStorage.getItem('bsnl_logs')) || [];
        const now = new Date();
        const newLog = {
            id: Date.now(),
            username,
            action,
            details,
            isoTime: now.toISOString(), 
            displayTime: now.toLocaleString() 
        };
        logs.unshift(newLog); 
        if (logs.length > 50) logs.pop(); // Limit logs
        localStorage.setItem('bsnl_logs', JSON.stringify(logs));
    };

    const updateUserStatus = (username, status) => {
        const users = JSON.parse(localStorage.getItem('bsnl_users')) || [];
        const updatedUsers = users.map(u => 
            u.username === username 
            ? { ...u, status: status, lastAction: new Date().toLocaleString() } 
            : u
        );
        localStorage.setItem('bsnl_users', JSON.stringify(updatedUsers));
    };

    const handleLogin = (username) => {
        updateUserStatus(username, 'Online');
        logAction(username, 'LOGIN', 'Session Started');
        setCurrentUser(username);
    };

    const handleLogout = () => {
        updateUserStatus(currentUser, 'Offline');
        logAction(currentUser, 'LOGOUT', 'Session Ended');
        setCurrentUser(null);
    };

    return (
        <div className="App">
            {!currentUser ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Dashboard 
                    user={currentUser} 
                    role={currentUser} 
                    onLogout={handleLogout}
                    logAction={logAction} 
                />
            )}
        </div>
    );
}