import React, { useState } from 'react';
import { requestService } from '../../services/requestService';
import './appintment_popup.css';

const AppointmentPopup = ({ technician, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        brand: '',
        productName: '',
        description: '',
        offerPrice: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basit validasyon
        if (!formData.brand || !formData.productName || !formData.description || !formData.offerPrice) {
            setError('Lütfen tüm alanları doldurunuz.');
            setLoading(false);
            return;
        }


        try {
            await requestService.createOrder({
                technician_id: technician.technician_id,
                brand: formData.brand,
                product_name: formData.productName,
                description: formData.description,
                price_offer: formData.offerPrice
            });

            // Başarılı olursa
            if (onSuccess) onSuccess();
            onClose(); // Popup'ı kapat
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
                    <h3>Randevu Oluştur</h3>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                <div className="popup-tech-info">
                    <span className="tech-name">{technician.first_name} {technician.surname}</span>
                    <span className="tech-prof">{technician.profession}</span>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ürün Markası</label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="Örn: Samsung, Bosch"
                        />
                    </div>

                    <div className="form-group">
                        <label>Ürün Modeli / İsmi</label>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            placeholder="Örn: Çamaşır Makinesi 9kg"
                        />
                    </div>

                    <div className="form-group">
                        <label>Sorun Açıklaması</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Cihazın sorunu nedir?"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Teklif Edilen Ücret (TL)</label>
                        <input
                            type="number"
                            name="offerPrice"
                            value={formData.offerPrice}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0"
                        />
                    </div>

                    <div className="popup-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">İptal</button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Gönderiliyor...' : 'Teklif Gönder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentPopup;