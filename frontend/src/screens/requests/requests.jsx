import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import ComplaintPopup from './complaint_popup';
import ChatPopup from '../widgets/chat_popup';
import './Requests.css';

const RequestsScreen = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('dark');
    const [activeRequests, setActiveRequests] = useState([]);
    const [completedRequests, setCompletedRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedChatRequest, setSelectedChatRequest] = useState(null);

    const toggleTheme = () => {
        setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
    };

    const handleBack = () => {
        navigate(-1);
    };

    const fetchRequests = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const data = await requestService.getCustomerRequests();
            setActiveRequests(data.filter(r => r.status !== 'completed'));
            setCompletedRequests(data.filter(r => r.status === 'completed'));
        } catch (error) {
            console.error("Talepler çekilemedi:", error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(true);
    }, []);

    const handleRefresh = () => {
        fetchRequests(false);
    };

    const openChat = (request) => {
        setSelectedChatRequest(request);
    };

    const closeChat = () => {
        setSelectedChatRequest(null);
        fetchRequests(false);
    };

    // Şikayet işlemleri
    const [selectedComplaintRequest, setSelectedComplaintRequest] = useState(null);

    const openComplaint = (request) => {
        setSelectedComplaintRequest(request);
    };
    const closeComplaint = () => {
        setSelectedComplaintRequest(null);
    };
    const handleComplaintSuccess = () => {
        alert("Şikayetiniz başarıyla oluşturuldu. En kısa sürede incelenecektir.");
    };

    return (
        <div className={`home-page ${theme === 'dark' ? 'dark-mode' : ''} requests-page`}>
            <header className="home-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={handleBack} className="theme-btn-fixed" title="Geri">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="home-title">Taleplerim</h1>
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

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>Yükleniyor...</div>
            ) : (
                <div className="requests-container">
                    <section className="request-section">
                        <h2 className="section-title">Devam Eden Talepler</h2>
                        {activeRequests.length === 0 ? (
                            <p className="empty-msg">Aktif talebiniz bulunmuyor.</p>
                        ) : (
                            activeRequests.map(req => (
                                <ActiveRequestCard
                                    key={req.id}
                                    request={req}
                                    onUpdate={handleRefresh}
                                    onOpenChat={() => openChat(req)}
                                />
                            ))
                        )}
                    </section>
                    <div className="divider"></div>
                    <section className="request-section">
                        <h2 className="section-title">Tamamlanmış Talepler</h2>
                        {completedRequests.length === 0 ? (
                            <p className="empty-msg">Tamamlanmış talebiniz bulunmuyor.</p>
                        ) : (
                            completedRequests.map(req => (
                                <CompletedRequestCard
                                    key={req.id}
                                    request={req}
                                    onUpdate={handleRefresh}
                                    onOpenComplaint={() => openComplaint(req)}
                                />
                            ))
                        )}
                    </section>
                </div>
            )}

            {/* CHAT POPUP */}
            {selectedChatRequest && (
                <ChatPopup
                    request={selectedChatRequest}
                    onClose={closeChat}
                />
            )}

            {/* ŞİKAYET POPUP */}
            {selectedComplaintRequest && (
                <ComplaintPopup
                    request={selectedComplaintRequest}
                    onClose={closeComplaint}
                    onSuccess={handleComplaintSuccess}
                />
            )}
        </div>
    );
};

const ActiveRequestCard = ({ request, onUpdate, onOpenChat }) => {
    const [priceInput, setPriceInput] = useState(request.price || '');
    const isPriceChanged = Number(priceInput) !== Number(request.price);

    const handleAcceptOrOffer = async () => {
        const action = isPriceChanged ? 'new_offer' : 'accept';
        try {
            await requestService.updateRequestStatus(request.id, action, priceInput);
            alert(isPriceChanged ? "Yeni teklif gönderildi." : "Teklif kabul edildi.");
            onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async () => {
        if (window.confirm("Bu teklifi reddetmek istediğinize emin misiniz?")) {
            await requestService.updateRequestStatus(request.id, 'reject');
            onUpdate();
        }
    };

    return (
        <div className="request-card active-card">
            <div className="req-header">
                <div>
                    <h3>{request.technician_name}</h3>
                    <span className="req-sub">{request.profession}</span>
                </div>
                <span className="req-date">{request.date}</span>
            </div>

            <div className="req-body">
                <p><strong>Detay:</strong> {request.details}</p>

                <div className="message-preview-area" onClick={onOpenChat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Mesajlar</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>Tümünü Gör &gt;</span>
                    </div>
                    {request.messages && request.messages.length > 0 ? (
                        <div className="last-msg-preview">
                            <span className="sender">{request.messages[request.messages.length - 1].senderName}: </span>
                            <span className="text">{request.messages[request.messages.length - 1].content.substring(0, 40)}...</span>
                        </div>
                    ) : (
                        <div className="last-msg-preview" style={{ fontStyle: 'italic', color: '#888' }}>
                            Henüz mesaj yok. Mesaj göndermek için tıklayın.
                        </div>
                    )}
                </div>
            </div>

            {request.status === 'waiting_offer' && (
                <div className="req-footer info-only">
                    <span className="status-badge warning">Usta Teklifi Bekleniyor</span>
                </div>
            )}

            {request.status === 'offer_received' && (
                <div className="req-footer action-mode">
                    <div className="price-control">
                        <label>Fiyat (TL):</label>
                        <input
                            type="number"
                            className="price-input"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                        />
                    </div>
                    <div className="btn-group">
                        <button className="btn-reject" onClick={handleReject}>Reddet</button>
                        <button
                            className={`btn-accept ${isPriceChanged ? 'btn-new-offer' : ''}`}
                            onClick={handleAcceptOrOffer}
                        >
                            {isPriceChanged ? 'Yeni Teklif Gönder' : 'Kabul Et'}
                        </button>
                    </div>
                </div>
            )}

            {request.status === 'agreed' && (
                <div className="req-footer info-only">
                    <div className="agreed-info">
                        <span className="status-badge success">Anlaşıldı</span>
                        <span className="fixed-price">{request.price} TL</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- ALT BİLEŞEN: TAMAMLANMIŞ TALEP KARTI ---
const CompletedRequestCard = ({ request, onUpdate, onOpenComplaint }) => {
    const [score, setScore] = useState(request.service_score || 0);
    const [hover, setHover] = useState(0);

    const handleRate = async (newScore) => {
        if (!request.service_score) {
            setScore(newScore);
            await requestService.rateTechnician(request.id, newScore);
        }
    };

    return (
        <div className="request-card completed-card">
            <div className="req-header">
                <div>
                    <h3>{request.technician_name}</h3>
                    <span className="req-sub">{request.profession}</span>
                </div>
                <div className="completed-badge">Tamamlandı</div>
            </div>

            <div className="req-body">
                <p><strong>Detay:</strong> {request.details}</p>
                <p><strong>Final Ücret:</strong> {request.price ? request.price + " TL" : "Ücretsiz / Belirsiz"}</p>

                {request.messages && request.messages.length > 0 && (
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888' }}>
                        <em>{request.messages.length} mesaj geçmişi var.</em>
                    </div>
                )}
            </div>

            <div className="req-footer completed-footer">
                <div className="rating-area">
                    <span>Puanla:</span>
                    {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                            <button
                                key={index}
                                type="button"
                                className={`star-btn ${index <= (hover || score) ? "on" : "off"}`}
                                onClick={() => handleRate(index)}
                                onMouseEnter={() => !request.service_score && setHover(index)}
                                onMouseLeave={() => !request.service_score && setHover(score)}
                                disabled={!!request.service_score}
                                style={{ cursor: request.service_score ? 'default' : 'pointer' }}
                            >
                                <span className="star">&#9733;</span>
                            </button>
                        );
                    })}
                </div>

                <button className="btn-complaint" onClick={onOpenComplaint}>
                    Şikayet Oluştur
                </button>
            </div>
        </div>
    );
};

export default RequestsScreen;