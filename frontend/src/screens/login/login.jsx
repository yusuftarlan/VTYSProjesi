import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Login.css';

const LoginScreen = () => {
    const { t } = useTranslation();
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [theme, setTheme] = useState('dark');
    const [isLoginView, setIsLoginView] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [professionList, setProfessionList] = useState([]);

    const [formData, setFormData] = useState({
        email: '', password: '', name: '', surname: '', phone: '', address: '', isTechnician: false, profession: '',
        experience_years: ''
    });

    const toggleTheme = () => {
        setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            if (isLoginView) {
                await login(formData.email, formData.password);
                navigate('/');
            } else {
                const success = await register(formData);
                if (success) {
                    alert("Kayıt Başarılı! Giriş yapabilirsiniz.");
                    setIsLoginView(true);
                }
            }
        } catch (error) {
            setErrorMsg(error.message || "Bir hata oluştu.");
        }
    };

    // Sayfa yüklendiğinde uzmanlık alanlarını çek
    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                // getProductTypes yerine getProfessions kullanıyoruz
                const profs = await authService.getProfessions();
                if (Array.isArray(profs)) {
                    setProfessionList(profs);
                } else {
                    setProfessionList([]);
                }
            } catch (err) {
                console.error("Meslekler çekilemedi", err);
                setProfessionList([]);
            }
        };
        fetchProfessions();
    }, []);

    return (
        <div className={`login-page ${theme === 'dark' ? 'dark-mode' : ''}`}>

            <button onClick={toggleTheme} className="theme-toggle-btn" title="Temayı Değiştir">
                {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                )}
            </button>

            <div className="login-card">
                <h2 className="login-title">
                    {isLoginView ? t('login.title') : t('register.title')}
                </h2>

                {errorMsg && <div style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '1vh', fontSize: '0.9rem' }}>{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="form-group">

                    {!isLoginView && (
                        <>
                            <input type="text" name="name" placeholder={t('register.name')} onChange={handleChange} className="form-input" required />
                            <input type="text" name="surname" placeholder={t('register.surname')} onChange={handleChange} className="form-input" required />
                            <input type="tel" name="phone" placeholder={t('register.phone')} onChange={handleChange} className="form-input" />
                            <textarea name="address" placeholder={t('register.address')} onChange={handleChange} className="form-input" rows="3" />

                            <div className="checkbox-group">
                                <input type="checkbox" name="isTechnician" id="techCheck" checked={formData.isTechnician} onChange={handleChange} />
                                <label htmlFor="techCheck">{t('register.technician')}</label>
                            </div>

                            {formData.isTechnician && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh', marginTop: '0.5vh', marginBottom: '0.5vh', borderLeft: '3px solid #4a90e2', paddingLeft: '10px' }}>

                                    {/* DROPDOWN (SELECT) */}
                                    <select
                                        name="profession"
                                        className="form-input"
                                        onChange={handleChange}
                                        required
                                        value={formData.profession}
                                    >
                                        <option value="">{t('register.profession') || "Uzmanlık Seçiniz"}</option>

                                        {/* professionList artık string array olduğu için doğrudan map ediyoruz */}
                                        {professionList.map((prof, index) => (
                                            <option key={index} value={prof}>
                                                {prof}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        name="experience_years"
                                        placeholder={t('Deneyim yılınızı giriniz' )}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        min="0"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <input type="email" name="email" placeholder={isLoginView ? t('login.email') : t('register.email')} onChange={handleChange} className="form-input" required />
                    <input type="password" name="password" placeholder={isLoginView ? t('login.password') : t('register.password')} onChange={handleChange} className="form-input" required />

                    <button type="submit" className="submit-btn">
                        {isLoginView ? t('login.submitButton') : t('register.submitButton')}
                    </button>
                </form>

                <div className="toggle-container">
                    <span>{isLoginView ? t('login.toggleText') : t('register.toggleText')}</span>
                    <button onClick={() => {
                        setIsLoginView(!isLoginView);
                        setErrorMsg("");
                    }} className="toggle-btn">
                        {isLoginView ? t('login.toggleLink') : t('register.toggleLink')}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LoginScreen;