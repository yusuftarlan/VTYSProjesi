import React, { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import { technicianService } from '../../services/technicianService';
import './appintment_popup.css';

const AppointmentPopup = ({ technician, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        brand: '',
        productName: '',
        description: '',
        offerPrice: '',
        model: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [brandList, setBrandList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [allModels, setAllModels] = useState([]);

    // Other
    const [isCustomBrand, setIsCustomBrand] = useState(false);
    const [isCustomProduct, setIsCustomProduct] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Veriler yüklenir
    useEffect(() => {
        const initData = async () => {
            try {
                // Ürün Kategorilerini Çek (Cep Telefonu, Klima vs.)
                const productsData = await technicianService.getProducts();
                if (Array.isArray(productsData)) {
                    setProductList(productsData);
                }

                // Markaları Çek (Modellerden benzersiz markaları ayıkla)
                const modelsData = await technicianService.getModels();
                if (Array.isArray(modelsData)) {
                    setBrandList(modelsData);
                }
            } catch (err) {
                console.error("Liste verileri çekilemedi", err);
            }
        };
        initData();
    }, []);

    // Dinamik değişiklik algılar
    useEffect(() => {
        // Tüm ürünler
        if (isCustomProduct || !formData.productName) {
            const allBrands = [...new Set(allModels.map(m => m.brand))];
            setBrandList(allBrands.sort());
            return;
        }

        // Ürüne göre product idsi
        const selectedProductObj = productList.find(p => p.product_name === formData.productName);

        if (selectedProductObj) {
            // Bu ürün ID'sine ait modelleri filtrele
            const filteredModels = allModels.filter(m => m.product_id === selectedProductObj.id);

            // Filtrelenen modellerden markaları çıkar
            const filteredBrands = [...new Set(filteredModels.map(m => m.brand))];
            setBrandList(filteredBrands.sort());
        } else {
            setBrandList([]);
        }

    }, [formData.productName, productList, allModels, isCustomProduct]);

    const handleBrandSelect = (e) => {
        const value = e.target.value;
        if (value === 'OTHER_OPTION') {
            setIsCustomBrand(true);
            setFormData(prev => ({ ...prev, brand: '' }));
        } else {
            setIsCustomBrand(false);
            setFormData(prev => ({ ...prev, brand: value }));
        }
    };

    const handleProductSelect = (e) => {
        const value = e.target.value;

        // Marka sıfırlanır
        setFormData(prev => ({ ...prev, brand: '' }));
        setIsCustomBrand(false);

        if (value === 'OTHER_OPTION') {
            setIsCustomProduct(true);
            setFormData(prev => ({ ...prev, productName: '' }));
        } else {
            setIsCustomProduct(false);
            setFormData(prev => ({ ...prev, productName: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validasyon
        if (!formData.brand || !formData.productName || !formData.model || !formData.description || !formData.offerPrice) {
            setError('Lütfen tüm alanları doldurunuz.');
            setLoading(false);
            return;
        }

        try {
            await requestService.createOrder({
                technician_id: technician.id || technician.technician_id,
                brand: formData.brand,
                product_name: formData.productName,
                description: formData.description,
                price_offer: formData.offerPrice,
                model: formData.model,
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

                    {/* --- ÜRÜN SEÇİMİ (DROPDOWN + TEXT) --- */}
                    <div className="form-group">
                        <label>Ürün Türü</label>
                        <select
                            className="form-input"
                            onChange={handleProductSelect}
                            value={isCustomProduct ? 'OTHER_OPTION' : formData.productName}
                            style={{ width: '100%', padding: '10px', marginBottom: '5px', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
                        >
                            <option value="">Seçiniz...</option>
                            {productList.map((product , idx) => (
                                <option key={idx} value={product}>{product}</option>
                            ))}
                            <option value="OTHER_OPTION">Diğer (Listede Yok)</option>
                        </select>

                        {isCustomProduct && (
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                placeholder="Ürün türünü yazınız (Örn: Kahve Makinesi)"
                                autoFocus
                                style={{ marginTop: '5px' }}
                            />
                        )}
                    </div>

                    {/* --- MARKA SEÇİMİ (DROPDOWN + TEXT) --- */}
                    <div className="form-group">
                        <label>Marka</label>
                        <select
                            className="form-input"
                            onChange={handleBrandSelect}
                            value={isCustomBrand ? 'OTHER_OPTION' : formData.brand}
                            style={{ width: '100%', padding: '10px', marginBottom: '5px', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
                        >
                            <option value="">Seçiniz...</option>
                            {brandList.map((brand, idx) => (
                                <option key={idx} value={brand}>{brand}</option>
                            ))}
                            <option value="OTHER_OPTION">Diğer (Listede Yok)</option>
                        </select>

                        {isCustomBrand && (
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Markayı yazınız"
                                style={{ marginTop: '5px' }}
                            />
                        )}
                    </div>

                    <div className="form-group">
                        <label>Model</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="Örn: S23 Ultra, 14 Pro Max, AR12TX"
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