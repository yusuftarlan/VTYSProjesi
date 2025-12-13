import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import './admin_home.css';

const AdminComplaints = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('dark');
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleBack = () => navigate(-1);

    const fetchAllComplaints = async () => {
        setLoading(true);
        try {
            const data = await requestService.getAllComplaintsForAdmin();
            setComplaints(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllComplaints();
    }, []);

    return (
        <div className={`home-page ${theme === 'dark' ? 'dark-mode' : ''} admin-page`}>

            <header className="home-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={handleBack} className="theme-btn-fixed" title="Geri">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="home-title">Şikayet Yönetimi</h1>
                </div>
                {/* Theme toggle buraya eklenebilir */}
            </header>

            {loading ? <div style={{ textAlign: 'center' }}>Yükleniyor...</div> : (
                <div className="requests-container">
                    {complaints.length === 0 ? <p className="empty-msg">Henüz şikayet yok.</p> :
                        complaints.map(comp => (
                            <AdminComplaintCard
                                key={comp.id}
                                complaint={comp}
                                onRefresh={fetchAllComplaints}
                            />
                        ))
                    }
                </div>
            )}
        </div>
    );
};

// Alt Bileşen: Şikayet Kartı ve Cevap Formu
const AdminComplaintCard = ({ complaint, onRefresh }) => {
    const [response, setResponse] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isResolved = complaint.status === 'Çözüldü';

    const handleResolve = async () => {
        if (!response.trim()) return alert("Lütfen bir yanıt yazınız.");

        setIsSubmitting(true);
        try {
            await requestService.resolveComplaint(complaint.id, response);
            alert("Şikayet cevaplandı ve çözüldü olarak işaretlendi.");
            onRefresh();
        } catch (error) {
            alert("Hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`request-card complaint-card ${isResolved ? 'resolved-border' : 'active-border'}`}>
            <div className="req-header">
                <div>
                    <h3>{complaint.technician_name} <span style={{ fontSize: '0.8rem', color: 'var(--sub-text)' }}>(Usta)</span></h3>
                    <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>Müşteri: {complaint.customer_name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="req-date">{complaint.date}</span>
                    <div className={`status-badge ${isResolved ? 'status-success' : 'status-warning'}`} style={{ marginTop: '5px', display: 'inline-block' }}>
                        {complaint.status}
                    </div>
                </div>
            </div>

            <div className="req-body">
                <div className="complaint-text">
                    <strong>Şikayet Detayı:</strong>
                    <p>"{complaint.message}"</p>
                </div>

                {/* Eğer çözüldüyse Adminin eski cevabını göster */}
                {isResolved ? (
                    <div className="response-box">
                        <div className="response-header">
                            <strong>Yönetici Yanıtı</strong>
                            <span>{complaint.resolved_date}</span>
                        </div>
                        <p>{complaint.response}</p>
                    </div>
                ) : (
                    // Çözülmediyse Cevaplama Alanı Göster
                    <div className="admin-response-area">
                        <textarea
                            className="response-input"
                            placeholder="Müşteriye yanıtınız ve çözüm detayınız..."
                            rows="3"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                        ></textarea>
                        <button
                            className="btn-resolve"
                            onClick={handleResolve}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Gönderiliyor...' : 'Yanıtla & Kapat'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminComplaints;