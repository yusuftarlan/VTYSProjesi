import React, { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import { technicianService } from '../../services/technicianService';
import './appintment_popup.css';

const AppointmentPopup = ({ technician, onClose, onSuccess }) => {
    // Form Verileri
    const [formData, setFormData] = useState({
        brand: '',
        productName: '',
        description: '',
        offerPrice: '',
        model: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Listeler
    const [productList, setProductList] = useState([]);
    const [brandList, setBrandList] = useState([]); // Başlangıçta boş

    // Manuel Giriş Kontrolleri
    const [isCustomBrand, setIsCustomBrand] = useState(false);
    const [isCustomProduct, setIsCustomProduct] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 1. Sayfa açılınca sadece Ürünleri yükle
    useEffect(() => {
        const initData = async () => {
            try {
                const productsData = await technicianService.getProducts();
                if (Array.isArray(productsData)) {
                    setProductList(productsData);
                }
            } catch (err) {
                console.error("Ürünler yüklenemedi", err);
            }
        };
        initData();
    }, []);

    // 2. Ürün Seçimi Değiştiğinde
    const handleProductSelect = async (e) => {
        const selectedName = e.target.value;
        const isOther = selectedName === 'OTHER_OPTION';

        setBrandList([]);
        setIsCustomBrand(false);
        setFormData(prev => ({
            ...prev,
            productName: isOther ? '' : selectedName,
            brand: '', // Seçili markayı temizle
            model: ''  // Modeli temizle
        }));
        setIsCustomProduct(isOther);

        // Eğer "Seçiniz" veya "Diğer" değilse, servisten markaları çek
        if (selectedName && !isOther) {
            try {
                // Servise git ve ürün adına göre modelleri çek
                const data = await technicianService.getModels(selectedName);

                // Gelen modellerden sadece markaları ayıkla (Unique)
                const brands = [...new Set(data.map(m => m.brand))];
                setBrandList(brands.sort());
            } catch (error) {
                console.error("Markalar getirilemedi:", error);
            }
        }
    };

    // 3. Marka Seçimi
    const handleBrandSelect = (e) => {
        const value = e.target.value;
        const isOther = value === 'OTHER_OPTION';

        if (isOther) {
            setIsCustomBrand(true);
            setFormData(prev => ({ ...prev, brand: '' }));
        } else {
            setIsCustomBrand(false);
            setFormData(prev => ({ ...prev, brand: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.productName || !formData.brand || !formData.model || !formData.description || !formData.offerPrice) {
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
                    <h3>Randevu Oluştur</h3>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                <div className="popup-tech-info">
                    <span className="tech-name">{technician.first_name} {technician.surname}</span>
                    <span className="tech-prof">{technician.profession}</span>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>

                    {/* ÜRÜN TÜRÜ */}
                    <div className="form-group">
                        <label>Ürün Türü</label>
                        <select
                            className="form-input"
                            onChange={handleProductSelect}
                            value={isCustomProduct ? 'OTHER_OPTION' : formData.productName}
                            style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
                        >
                            <option value="">Seçiniz...</option>
                            {productList.map((product, idx) => {
                                const pName = typeof product === 'object' ? product.product_name : product;
                                return <option key={idx} value={pName}>{pName}</option>;
                            })}
                            <option value="OTHER_OPTION">Diğer (Listede Yok)</option>
                        </select>

                        {isCustomProduct && (
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                placeholder="Ürün türünü yazınız"
                                style={{ marginTop: '5px' }}
                            />
                        )}
                    </div>

                    {/* MARKA */}
                    <div className="form-group">
                        <label>Marka</label>
                        <select
                            className="form-input"
                            onChange={handleBrandSelect}
                            value={isCustomBrand ? 'OTHER_OPTION' : formData.brand}
                            disabled={!formData.productName || isCustomProduct || brandList.length === 0}
                            style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
                        >
                            <option value="">
                                {brandList.length === 0 && !isCustomProduct && formData.productName
                                    ? "Bu ürüne ait marka bulunamadı"
                                    : "Seçiniz..."}
                            </option>
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

                    {/* MODEL */}
                    <div className="form-group">
                        <label>Model</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="Örn: S23 Ultra, 14 Pro Max"
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