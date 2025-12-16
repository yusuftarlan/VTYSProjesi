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

    const handleDeleteTechnician = async (techId, techName) => {
        if (window.confirm(`${techName} isimli ustayı sistemden silmek/atmak istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
            try {
                console.log(techId);
                await technicianService.deleteTechnician(techId);
                // Listeden düşür
                setTechnicians(prev => prev.filter(t => t.id !== techId));
                alert("Usta başarıyla silindi.");
            } catch (error) {
                console.error("Silme hatası:", error);
                alert("Silme işlemi sırasında bir hata oluştu.");
            }
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

            {/* Liste  */}
            {loading ? <div style={{ textAlign: 'center', padding: '20px' }}>Yükleniyor...</div> : (
                <div className="tech-list-vertical">
                    {technicians.length === 0 ? <p className="empty-msg">Kayıt bulunamadı.</p> :
                        technicians.map(tech => (
                            <div key={tech.id} className="tech-row-card">
                                {/* Sol Taraf: Bilgiler */}
                                <div className="tech-info-section">
                                    <div className="tech-main-info">
                                        <h3>{tech.first_name} {tech.surname}</h3>
                                        <span className="profession-badge">{tech.profession || 'Belirsiz'}</span>
                                    </div>

                                    <div className="tech-mini-stats">
                                        <span title="Puan" className="stat-pill star">
                                            ★ {tech.technician_score}
                                        </span>
                                        <span title="Deneyim" className="stat-pill">
                                            {tech.experience_years} Yıl
                                        </span>
                                        <span title="Şikayet Sayısı" className={`stat-pill ${tech.complaint_count > 0 ? 'bad' : 'good'}`}>
                                            {tech.complaint_count} Şikayet
                                        </span>
                                    </div>
                                </div>

                                {/* Sağ Taraf: Aksiyonlar */}
                                <div className="tech-action-section">
                                    <button
                                        className="btn-ban"
                                        onClick={() => handleDeleteTechnician(tech.id, `${tech.first_name} ${tech.surname}`)}
                                    >
                                        Siteden At 🚫
                                    </button>
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