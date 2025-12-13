import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { technicianService } from '../../services/technicianService';
import { authService } from '../../services/authService';
import './admin_home.css';

const AdminHome = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('dark');
    const [technicians, setTechnicians] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const toggleTheme = () => {
        setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
    };

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    const fetchTechs = async () => {
        setLoading(true);
        try {
            const data = await technicianService.getTechniciansWithStats({ q: searchQuery });
            setTechnicians(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechs();
    }, [searchQuery]); // Arama değişince tetikle

    return (
        <div className={`home-page ${theme === 'dark' ? 'dark-mode' : ''} admin-page`}>

            {/* Header */}
            <header className="home-header">
                <div>
                    <h1 className="home-title">Yönetici Paneli</h1>
                    <span style={{ color: 'var(--sub-text)' }}>Usta Performans & Şikayet Takibi</span>
                </div>

                <div className="header-actions">
                    <button
                        className="theme-btn-fixed btn-primary-outline"
                        onClick={() => navigate('/admin-complaints')}
                        title="Şikayet Yönetimi"
                    >
                        ⚠️ Şikayetleri Yönet
                    </button>

                    <button onClick={toggleTheme} className="theme-btn-fixed">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    <button onClick={handleLogout} className="theme-btn-fixed" style={{ color: '#e74c3c', borderColor: '#e74c3c' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </button>
                </div>
            </header>

            {/* Arama */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Usta ara (İsim, Meslek)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Liste */}
            {loading ? <div style={{ textAlign: 'center' }}>Yükleniyor...</div> : (
                <div className="tech-list-admin">
                    {technicians.length === 0 ? <p className="empty-msg">Kayıt bulunamadı.</p> :
                        technicians.map(tech => (
                            <div key={tech.id} className="tech-card admin-card">
                                <div className="admin-card-header">
                                    <h3>{tech.first_name} {tech.surname}</h3>
                                    <span className="profession-badge">{tech.profession || 'Belirsiz'}</span>
                                </div>

                                <div className="admin-stats">
                                    <div className="stat-box">
                                        <span className="stat-label">Puan</span>
                                        <span className="stat-val star-color">★ {tech.technician_score}</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-label">Deneyim</span>
                                        <span className="stat-val">{tech.experience_years} Yıl</span>
                                    </div>
                                    <div className={`stat-box ${tech.complaint_count > 0 ? 'alert-box' : 'safe-box'}`}>
                                        <span className="stat-label">Şikayet Sayısı</span>
                                        <span className="stat-val">{tech.complaint_count}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
};

export default AdminHome;