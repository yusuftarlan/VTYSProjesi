import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import './complaints.css';

const ComplaintsScreen = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('dark');
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleTheme = () => {
        setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
    };

    const handleBack = () => {
        navigate(-1);
    };

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const data = await requestService.getCustomerComplaints();
            setComplaints(data);
        } catch (error) {
            console.error("Şikayetler çekilemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <div className={`home-page ${theme === 'dark' ? 'dark-mode' : ''} complaints-page`}>

            {/* --- HEADER --- */}
            <header className="home-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={handleBack} className="theme-btn-fixed" title="Geri">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="home-title">Şikayetlerim</h1>
                </div>

                <div className="header-actions">
                    <button onClick={toggleTheme} className="theme-btn-fixed" title="Tema">
                        {theme === 'light' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        )}
                    </button>
                </div>
            </header>

            {/* --- CONTENT --- */}
            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>Yükleniyor...</div>
            ) : (
                <div className="requests-container">

                    <section className="request-section">
                        <h2 className="section-title">Şikayet Geçmişi</h2>
                        {complaints.length === 0 ? (
                            <p className="empty-msg">Herhangi bir şikayet kaydınız bulunmuyor.</p>
                        ) : (
                            complaints.map(comp => (
                                <ComplaintCard key={comp.id} complaint={comp} />
                            ))
                        )}
                    </section>

                </div>
            )}
        </div>
    );
};

const ComplaintCard = ({ complaint }) => {
    const getStatusStyle = (status) => {
        if (status === 'Çözüldü') return 'status-success';
        if (status === 'İnceleniyor') return 'status-warning';
        return 'status-neutral';
    };

    return (
        <div className="request-card complaint-card">
            <div className="req-header">
                <div>
                    <h3>{complaint.technician_name}</h3>
                    <span className="req-sub">Talep No: #{complaint.request_id}</span>
                </div>
                <span className="req-date">{complaint.date}</span>
            </div>

            <div className="req-body">
                <div className="complaint-text">
                    <strong>Şikayetiniz:</strong>
                    <p>{complaint.message}</p>
                </div>

                {complaint.response && (
                    <div className="response-box">
                        <div className="response-header">
                            <strong>Destek Ekibi Yanıtı</strong>
                            {complaint.resolved_date && <span>{complaint.resolved_date}</span>}
                        </div>
                        <p>{complaint.response}</p>
                    </div>
                )}
            </div>

            <div className="req-footer info-only">
                <span className={`status-badge ${getStatusStyle(complaint.status)}`}>
                    {complaint.status}
                </span>
            </div>
        </div>
    );
};

export default ComplaintsScreen;