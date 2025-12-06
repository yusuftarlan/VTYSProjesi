import React, { useState } from 'react';
import { authService } from '../../services/authService';
import './complaint_popup.css';

const ComplaintPopup = ({ request, onClose, onSuccess }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!message.trim()) {
            setError('Lütfen şikayet detayını yazınız.');
            setLoading(false);
            return;
        }

        try {
            await authService.createComplaint(request.id, message);

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message || 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <h3>Şikayet Oluştur</h3>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                <div className="popup-tech-info">
                    <span className="tech-name">{request.technician_name}</span>
                    <span className="tech-prof">Hizmet: {request.details}</span>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Şikayet Detayı</label>
                        <textarea
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="5"
                            placeholder="Yaşadığınız sorunu detaylı bir şekilde anlatınız..."
                        ></textarea>
                    </div>

                    <div className="popup-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">İptal</button>
                        <button type="submit" className="submit-btn delete-style" disabled={loading}>
                            {loading ? 'Gönderiliyor...' : 'Şikayet Oluştur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintPopup;