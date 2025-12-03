import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import AppointmentPopup from './appintment_popup';
import './Home.css';

const HomeScreen = () => {
    // Çeviri kütüphanesini başlatıyoruz
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [theme, setTheme] = useState('dark');
    const [searchQuery, setSearchQuery] = useState("");

    // Filtreleme koşulları
    const [filters, setFilters] = useState({
        minExp: "",
        maxExp: "",
        city: "",
        minScore: "",
        onlyAvailable: false,
        profession: ""
    });

    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(false);

    // Listeler
    const [professionList, setProfessionList] = useState([]);
    const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Adana"];

    const [selectedTech, setSelectedTech] = useState(null);

    // Tema
    const toggleTheme = () => {
        setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
    };

    // Çıkış yap
    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error("Çıkış yapılırken hata:", error);
        }
    };

    const handleGoToRequests = () => {
        navigate('/requests');
    };

    // Araama işlemi
    const fetchTechnicians = async () => {
        setLoading(true);
        try {
            const data = await authService.getTechnicians({
                q: searchQuery,
                minExp: filters.minExp,
                maxExp: filters.maxExp,
                city: filters.city,
                minScore: filters.minScore,
                onlyAvailable: filters.onlyAvailable,
                profession: filters.profession
            });
            setTechnicians(data);
        } catch (error) {
            console.error("Hata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTechnicians();
    };

    const handleFilterChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFilters({ ...filters, [e.target.name]: value });
    };

    const handleBookClick = (tech) => {
        setSelectedTech(tech);
    };

    const handleAppointmentSuccess = () => {
        alert("Teklifiniz başarıyla ustaya iletildi!");
    };

    // Sayfa ile uzmanlıkları yükle
    useEffect(() => {
        const initData = async () => {
            // 1. Ustaları Çek
            fetchTechnicians();

            // 2. Uzmanlık Listesini Çek
            try {
                const profs = await authService.getProfessions();
                if (Array.isArray(profs)) setProfessionList(profs);
            } catch (err) {
                console.error("Meslekler çekilemedi", err);
            }
        };
        initData();
    }, []);

    return (
        <div className={`home-page ${theme === 'dark' ? 'dark-mode' : ''}`}>

            <header className="home-header">
                <h1 className="home-title">{t('home.title')}</h1>
                <div className="header-actions">

                    {/* Taleplerim Butonu */}
                    <button onClick={handleGoToRequests} className="theme-btn-fixed" title="Taleplerim">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <line x1="10" y1="9" x2="8" y2="9"></line>
                        </svg>
                    </button>

                    {/* Tema Butonu */}
                    <button onClick={toggleTheme} className="theme-btn-fixed" title="Temayı Değiştir">
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        )}
                    </button>

                    {/* Çıkış Yap Butonu */}
                    <button onClick={handleLogout} className="theme-btn-fixed" title={t('home.logout')} style={{ color: '#ff4d4d', borderColor: '#ff4d4d' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </header>

            <section className="search-container">
                <form onSubmit={handleSearch}>
                    <div className="search-bar-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder={t('home.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-btn">{t('home.searchButton')}</button>
                    </div>

                    <div className="filters-wrapper">

                        {/* Uzmanlık Alanı Filtresi (Dropdown) */}
                        <div className="filter-group">
                            <span className="filter-label">Uzmanlık:</span>
                            <select
                                name="profession"
                                className="filter-select"
                                value={filters.profession}
                                onChange={handleFilterChange}
                                style={{ minWidth: '150px' }}
                            >
                                <option value="">Tümü</option>
                                {professionList.map((prof, idx) => (
                                    <option key={idx} value={prof}>{prof}</option>
                                ))}
                            </select>
                        </div>

                        {/* Deneyim Filtresi */}
                        <div className="filter-group">
                            <span className="filter-label">{t('home.filters.experience')}:</span>
                            <input
                                type="number"
                                name="minExp"
                                placeholder={t('home.filters.min')}
                                className="filter-input-small"
                                value={filters.minExp}
                                onChange={handleFilterChange}
                            />
                            <span className="filter-label">-</span>
                            <input
                                type="number"
                                name="maxExp"
                                placeholder={t('home.filters.max')}
                                className="filter-input-small"
                                value={filters.maxExp}
                                onChange={handleFilterChange}
                            />
                        </div>

                        {/* Şehir Filtresi */}
                        <div className="filter-group">
                            <span className="filter-label">{t('home.filters.city')}:</span>
                            <select
                                name="city"
                                className="filter-select"
                                value={filters.city}
                                onChange={handleFilterChange}
                            >
                                <option value="">{t('home.filters.allCities')}</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Puan Filtresi */}
                        <div className="filter-group">
                            <span className="filter-label">{t('home.filters.minScore')}:</span>
                            <input
                                type="number"
                                name="minScore"
                                placeholder="4.0"
                                step="0.1"
                                max="5"
                                className="filter-input-small"
                                value={filters.minScore}
                                onChange={handleFilterChange}
                            />
                        </div>

                        {/* Müsaitlik Filtresi */}
                        <div className="filter-group checkbox-filter">
                            <input
                                type="checkbox"
                                id="onlyAvailable"
                                name="onlyAvailable"
                                checked={filters.onlyAvailable}
                                onChange={handleFilterChange}
                            />
                            <label htmlFor="onlyAvailable" className="filter-label cursor-pointer">
                                {t('home.filters.onlyAvailable')}
                            </label>
                        </div>

                    </div>
                </form>
            </section>

            <section className="tech-list">
                {loading ? (
                    <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>{t('home.status.loading')}</p>
                ) : technicians.length === 0 ? (
                    <div style={{ textAlign: 'center', width: '100%', padding: '20px', color: 'var(--sub-text)' }}>
                        <h3>{t('home.status.notFoundTitle')}</h3>
                        <p>{t('home.status.notFoundDesc')}</p>
                    </div>
                ) : (
                    technicians.map((tech) => (
                        <div key={tech.id} className="tech-card">
                            <div className="tech-header">
                                <div>
                                    <h3 className="tech-name">{tech.first_name} {tech.surname}</h3>
                                    <p className="tech-profession">{tech.profession}</p>
                                </div>
                                <div className="tech-score">
                                    <span>★</span> {tech.technician_score}
                                </div>
                            </div>

                            <div className="tech-details">
                                <p>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    {tech.home_address || t('home.card.noAddress')}
                                </p>
                                <p>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    {tech.experience_years} {t('home.card.yearsExperience')}
                                </p>
                            </div>

                            <div className={`status-badge ${tech.availability_status ? 'status-available' : 'status-busy'}`}>
                                {tech.availability_status ? t('home.card.available') : t('home.card.busy')}
                            </div>

                            {tech.availability_status && (
                                <button
                                    className="book-btn"
                                    onClick={() => handleBookClick(tech)}
                                    style={{
                                        marginTop: '15px',
                                        width: '100%',
                                        padding: '10px',
                                        backgroundColor: 'var(--accent-color)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Randevu Oluştur
                                </button>
                            )}
                        </div>
                    ))
                )}
            </section>

            {/* --- SİPARİŞ POPUPU --- */}
            {selectedTech && (
                <AppointmentPopup
                    technician={selectedTech}
                    onClose={() => setSelectedTech(null)}
                    onSuccess={handleAppointmentSuccess}
                />
            )}
        </div>
    );
};

export default HomeScreen;