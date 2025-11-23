import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
    const { user, logout } = useAuth();

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'white'
    };

    const buttonStyle = {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#ff4d4d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    };

    return (
        <div style={containerStyle}>
            <h1>Hoşgeldin, {user?.name}</h1>
            <p>{user?.isTechnician ? "Teknisyen Hesabı" : "Kullanıcı Hesabı"}</p>

            <button onClick={logout} style={buttonStyle}>
                Çıkış Yap (Logout)
            </button>
        </div>
    );
};

export default Home;