import fakeDb from './fake_db.json';

export const API_URL = import.meta.env.VITE_BACKEND_URL;
export const IS_DEV = import.meta.env.VITE_IS_DEV === 'true';

const getLocalOrSet = (key, defaultData) => {
    const localData = localStorage.getItem(key);
    if (localData) return JSON.parse(localData);
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
};

const saveLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// 1. Kullanıcılar
export const getMockUsers = () => getLocalOrSet('mock_db_users', fakeDb.users);
export const saveMockUsers = (users) => saveLocal('mock_db_users', users);

// 2. Detaylar
export const getMockDetails = () => getLocalOrSet('mock_db_details', fakeDb.technician_details);
export const saveMockDetails = (details) => saveLocal('mock_db_details', details);

// 3. Talepler
export const getMockRequests = () => getLocalOrSet('mock_db_requests', fakeDb.service_requests);
export const saveMockRequests = (data) => saveLocal('mock_db_requests', data);

// 4. Ürün Modelleri
export const getMockProducts = () => fakeDb.products;
export const getMockProductModels = () => fakeDb.product_models;

// 5. Fiyat ve Detaylar
export const getMockRequestDetails = () => getLocalOrSet('mock_db_request_details', fakeDb.request_details);

// 6. Mesajlar
export const getMockMessages = () => getLocalOrSet('mock_db_messages', fakeDb.messages);
export const saveMockMessages = (data) => saveLocal('mock_db_messages', data);

// 7. Şikayetler
export const getMockComplaints = () => getLocalOrSet('mock_db_complaints', fakeDb.complaints);
export const saveMockComplaints = (data) => saveLocal('mock_db_complaints', data);

