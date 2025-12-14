import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { authService } from '../../services/authService';
import ChatPopup from '../widgets/chat_popup';
import './technician_home.css';

const TechnicianHome = () => {
    const navigate = useNavigate();

    const [theme, setTheme] = useState('dark');
    const [loading, setLoading] = useState(true);

    // Veriler
    const [incomingJobs, setIncomingJobs] = useState([]); // Status 1
    const [ongoingJobs, setOngoingJobs] = useState([]);   // Status 2
    const [completedJobs, setCompletedJobs] = useState([]); // Status 3

    const [isAvailable, setIsAvailable] = useState(false);
    const [selectedChatRequest, setSelectedChatRequest] = useState(null);

    const toggleTheme = () => {
        setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
    };

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await requestService.getTechnicianRequests();
            setIsAvailable(data.isAvailable);

            // İşleri statülerine göre ayır
            setIncomingJobs(data.jobs.filter(j => j.status_id === 1 || j.status_id === 4));
            setOngoingJobs(data.jobs.filter(j => j.status_id === 2));
            setCompletedJobs(data.jobs.filter(j => j.status_id === 3));

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Müsaitlik Değiştirme
    const handleToggleAvailability = async () => {
        try {
           
            const newStatus = !isAvailable ? 1 : 0;
            await requestService.toggleAvailability(newStatus);
            setIsAvailable(newStatus);
        } catch (error) {
            console.error("Durum güncellenemedi", error);
        }
    };

    // Fiyat Teklifi Ver
    const handleGiveOffer = async (id, price) => {
        if (!price) return alert("Lütfen bir fiyat giriniz.");
        try {
            await requestService.updateRequestStatus(id, 'new_offer', price);
            alert("Teklif iletildi, müşteri onayı bekleniyor.");
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    // İşi Tamamla
    const handleCompleteJob = async (id) => {
        if (window.confirm("Bu işi tamamlandı olarak işaretlemek istiyor musunuz?")) {
            try {
                await requestService.updateRequestStatus(id, 'complete_job');
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className={`home-page ${theme === 'dark' ? 'dark-mode' : ''} technician-page`}>

            <header className="home-header">
                <div>
                    <h1 className="home-title">Usta Paneli</h1>
                    <span className="welcome-sub">İşlerini buradan yönetebilirsin.</span>
                </div>

                <div className="header-actions">
                    {/* Müsaitlik Butonu */}
                    <div
                        className={`availability-toggle ${isAvailable ? 'avail-on' : 'avail-off'}`}
                        onClick={handleToggleAvailability}
                        title="Müsaitlik Durumu"
                    >
                        <div className="dot"></div>
                        <span>{isAvailable ? "MÜSAİT" : "MEŞGUL"}</span>
                    </div>

                    <button onClick={toggleTheme} className="theme-btn-fixed">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    <button onClick={handleLogout} className="theme-btn-fixed logout-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </button>
                </div>
            </header>

            {loading ? <div className="loading-state">Yükleniyor...</div> : (
                <div className="dashboard-grid">

                    {/* 1. GELEN TEKLİFLER / YENİ İŞLER */}
                    <section className="dash-section">
                        <h2 className="dash-title title-new">Gelen Talepler ({incomingJobs.length})</h2>
                        <div className="card-list">
                            {incomingJobs.length === 0 ? <p className="empty-txt">Yeni talep yok.</p> :
                                incomingJobs.map(job => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        type="new"
                                        onOffer={handleGiveOffer}
                                        onChat={() => setSelectedChatRequest({ ...job, technician_name: job.customer_name })}
                                    />
                                ))
                            }
                        </div>
                    </section>

                    {/* 2. DEVAM EDEN İŞLER */}
                    <section className="dash-section">
                        <h2 className="dash-title title-ongoing">Devam Edenler ({ongoingJobs.length})</h2>
                        <div className="card-list">
                            {ongoingJobs.length === 0 ? <p className="empty-txt">Aktif işiniz yok.</p> :
                                ongoingJobs.map(job => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        type="ongoing"
                                        onComplete={handleCompleteJob}
                                        onChat={() => setSelectedChatRequest({ ...job, technician_name: job.customer_name })}
                                    />
                                ))
                            }
                        </div>
                    </section>

                    {/* 3. TAMAMLANANLAR */}
                    <section className="dash-section">
                        <h2 className="dash-title title-completed">Geçmiş İşler ({completedJobs.length})</h2>
                        <div className="card-list">
                            {completedJobs.length === 0 ? <p className="empty-txt">Henüz tamamlanan iş yok.</p> :
                                completedJobs.map(job => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        type="completed"
                                        onChat={() => setSelectedChatRequest({ ...job, technician_name: job.customer_name })}
                                    />
                                ))
                            }
                        </div>
                    </section>
                </div>
            )}

            {/* Chat Popup */}
            {selectedChatRequest && (
                <ChatPopup
                    request={selectedChatRequest}
                    onClose={() => {
                        setSelectedChatRequest(null);
                        fetchData(); // Mesaj atınca listeyi yenile
                    }}
                />
            )}
        </div>
    );
};

const JobCard = ({ job, type, onOffer, onComplete, onChat }) => {
    const [offerPrice, setOfferPrice] = useState(job.price_offer || '');

    return (
        <div className={`job-card border-${type}`}>
            <div className="job-header">
                <span className="job-customer">{job.customer_name}</span>
                <span className="job-date">{job.date}</span>
            </div>

            <p className="job-detail"><strong>Sorun:</strong> {job.details}</p>

            {/* Adres sadece devam eden işlerde açık görünsün veya teklif aşamasında ilçe görünsün (Basit tuttum) */}
            <p className="job-address">📍 {job.customer_address || "Adres Gizli"}</p>

            {/* Mesaj Butonu */}
            <div className="msg-preview" onClick={onChat}>
                <span>💬 Mesajlar ({job.messages.length})</span>
            </div>

            {/* Duruma Göre Aksiyonlar */}
            <div className="job-actions">
                {type === 'new' && (
                    <div className="offer-box">
                        <input
                            type="number"
                            placeholder="Fiyat (TL)"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            disabled={job.status_id === 4} // Fiyat verildiyse kitleyelim
                        />
                        <button
                            className="btn-action btn-offer"
                            onClick={() => onOffer(job.id, offerPrice)}
                            disabled={job.status_id === 4}
                        >
                            {job.status_id === 4 ? 'Teklif İletildi' : 'Teklif Ver'}
                        </button>
                    </div>
                )}

                {type === 'ongoing' && (
                    <div className="ongoing-box">
                        <div className="price-tag">Anlaşılan: {job.price_offer} TL</div>
                        <button className="btn-action btn-finish" onClick={() => onComplete(job.id)}>
                            ✅ İşi Tamamla
                        </button>
                    </div>
                )}

                {type === 'completed' && (
                    <div className="completed-box">
                        <span>Kazanç: {job.price_offer} TL</span>
                        <span className="badge-done">Tamamlandı</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianHome;