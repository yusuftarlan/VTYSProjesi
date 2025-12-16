-- Teknisyen 2 (Ahmet Yılmaz - Elektrik Teknisyeni) için 5 yeni kayıt
INSERT INTO service_requests (customer_id, technician_id, model_id, request_date, completed_date, request_status_id, service_score)
VALUES 
  (7, 2, 2, '2025-10-01 09:00:00', '2025-10-03 15:00:00', 3, 4.80),
  (8, 2, 5, '2025-10-10 11:30:00', '2025-10-12 14:00:00', 3, 4.60),
  (9, 2, 8, '2025-10-20 14:00:00', '2025-10-22 16:30:00', 3, 4.90),
  (10, 2, 3, '2025-11-05 10:00:00', '2025-11-07 12:00:00', 3, 4.70),
  (11, 2, 10, '2025-12-10 08:30:00', NULL, 2, NULL);

-- Teknisyen 3 (Ayşe Kara - Klima Bakım Uzmanı) için 5 yeni kayıt
INSERT INTO service_requests (customer_id, technician_id, model_id, request_date, completed_date, request_status_id, service_score)
VALUES 
  (7, 3, 31, '2025-09-15 10:00:00', '2025-09-17 14:00:00', 3, 4.50),
  (8, 3, 32, '2025-10-05 09:30:00', '2025-10-07 11:00:00', 3, 4.30),
  (9, 3, 33, '2025-10-25 13:00:00', '2025-10-27 15:30:00', 3, 4.00),
  (10, 3, 34, '2025-11-12 11:00:00', '2025-11-14 13:00:00', 3, 4.20),
  (11, 3, 35, '2025-12-08 09:00:00', NULL, 1, NULL);

-- Teknisyen 4 (Mehmet Demir - Bilgisayar Teknisyeni) için 5 yeni kayıt
INSERT INTO service_requests (customer_id, technician_id, model_id, request_date, completed_date, request_status_id, service_score)
VALUES 
  (7, 4, 13, '2025-09-20 14:00:00', '2025-09-22 16:00:00', 3, 3.80),
  (8, 4, 14, '2025-10-08 10:30:00', '2025-10-10 12:30:00', 3, 4.00),
  (9, 4, 15, '2025-10-28 09:00:00', '2025-10-30 11:00:00', 3, 3.90),
  (10, 4, 16, '2025-11-15 13:30:00', '2025-11-17 15:00:00', 3, 4.10),
  (11, 4, 17, '2025-12-12 10:00:00', NULL, 1, NULL);

-- Teknisyen 5 (Elif Çelik - Beyaz Eşya Servis Teknisyeni) için 5 yeni kayıt
INSERT INTO service_requests (customer_id, technician_id, model_id, request_date, completed_date, request_status_id, service_score)
VALUES 
  (7, 5, 42, '2025-09-10 08:00:00', '2025-09-12 10:30:00', 3, 4.70),
  (8, 5, 43, '2025-10-02 11:00:00', '2025-10-04 13:00:00', 3, 4.50),
  (9, 5, 44, '2025-10-22 14:30:00', '2025-10-24 16:00:00', 3, 4.60),
  (10, 5, 45, '2025-11-08 09:30:00', '2025-11-10 11:30:00', 3, 4.40),
  (11, 5, 46, '2025-12-14 10:00:00', NULL, 2, NULL);

-- Teknisyen 6 (Ali Şahin - Güvenlik Sistemleri Teknisyeni) için 5 yeni kayıt
INSERT INTO service_requests (customer_id, technician_id, model_id, request_date, completed_date, request_status_id, service_score)
VALUES 
  (7, 6, 26, '2025-09-05 10:00:00', '2025-09-07 12:00:00', 3, 4.20),
  (8, 6, 28, '2025-09-25 13:00:00', '2025-09-27 15:00:00', 3, 4.00),
  (9, 6, 29, '2025-10-15 09:00:00', '2025-10-17 11:30:00', 3, 4.30),
  (10, 6, 30, '2025-11-02 14:00:00', '2025-11-04 16:00:00', 3, 3.90),
  (11, 6, 26, '2025-12-15 11:00:00', NULL, 1, NULL);

-- ============================================================
-- YENİ REQUEST_DETAILS KAYITLARI (Yukarıdaki servisler için)
-- ============================================================

-- Teknisyen 2 servisleri için detaylar (request_id: 6-10)
INSERT INTO request_details (request_id, detail, price)
VALUES 
  (6, 'iPhone ekran cam değişimi yapıldı', 1800.00),
  (7, 'Xiaomi batarya değişimi ve yazılım güncellemesi', 950.00),
  (8, 'OnePlus şarj soketi tamiri', 450.00),
  (9, 'Samsung Galaxy kamera modülü değişimi', 1200.00),
  (10, 'Huawei anakart tamiri devam ediyor', 2200.00);

-- Teknisyen 3 servisleri için detaylar (request_id: 11-15)
INSERT INTO request_details (request_id, detail, price)
VALUES 
  (11, 'Klima gaz dolumu ve filtre temizliği', 800.00),
  (12, 'Klima kompresör tamiri', 2500.00),
  (13, 'Klima iç ünite fan motoru değişimi', 1100.00),
  (14, 'Klima dış ünite temizliği ve bakım', 600.00),
  (15, 'Klima montaj ve kurulum bekliyor', 1500.00);

-- Teknisyen 4 servisleri için detaylar (request_id: 16-20)
INSERT INTO request_details (request_id, detail, price)
VALUES 
  (16, 'Laptop RAM yükseltme 8GB to 16GB', 1400.00),
  (17, 'Laptop SSD değişimi 512GB', 1800.00),
  (18, 'Masaüstü bilgisayar format ve kurulum', 500.00),
  (19, 'Laptop ekran menteşe tamiri', 750.00),
  (20, 'Tablet ekran değişimi bekleniyor', 1600.00);

-- Teknisyen 5 servisleri için detaylar (request_id: 21-25)
INSERT INTO request_details (request_id, detail, price)
VALUES 
  (21, 'Bulaşık makinesi pompa değişimi', 1300.00),
  (22, 'Çamaşır makinesi rulman değişimi', 900.00),
  (23, 'Bulaşık makinesi kapak kilidi tamiri', 450.00),
  (24, 'Çamaşır makinesi kayış değişimi', 350.00),
  (25, 'Kombi eşanjör temizliği devam ediyor', 700.00);

-- Teknisyen 6 servisleri için detaylar (request_id: 26-30)
INSERT INTO request_details (request_id, detail, price)
VALUES 
  (26, 'Güvenlik kamerası kurulumu 4 adet', 3500.00),
  (27, 'Kamera DVR cihazı değişimi', 2800.00),
  (28, 'Kamera kablo ve bağlantı tamiri', 600.00),
  (29, 'Gece görüş kamera modülü değişimi', 1200.00),
  (30, 'Yeni güvenlik sistemi kurulumu bekliyor', 4500.00);



  -- Ek şikayetler (farklı ustalar için)
INSERT INTO complaints (
    request_id,
    message,
    status,
    response,
    created_at,
    resolved_at,
    response_by
  )
VALUES 
  -- Teknisyen 2 (Ahmet Yılmaz) hakkında ek şikayet
  (
    1,
    'Teknisyen çok geç geldi, söylenen saatten 1 saat sonra ulaştı.',
    'Çözüldü',
    'Teknisyen ile görüşüldü, bundan sonra zamanında geleceği taahhüt edildi.',
    '2025-11-18 14:00:00',
    '2025-11-19 10:00:00',
    1
  ),
  -- Teknisyen 3 (Ayşe Kara) hakkında şikayet
  (
    2,
    'Klima tamirinden sonra ses yapıyor, önceden bu kadar gürültülü değildi.',
    'İnceleniyor',
    NULL,
    '2025-11-25 09:30:00',
    NULL,
    NULL
  ),
  -- Teknisyen 4 (Mehmet Demir) hakkında şikayetler
  (
    3,
    'Teknisyen işini yarım bıraktı, programları yüklemedi.',
    'Çözüldü',
    'Teknisyen tekrar gönderildi, eksik programlar yüklendi.',
    '2025-12-01 11:00:00',
    '2025-12-02 15:00:00',
    1
  ),
  (
    3,
    'Laptop formatından sonra lisanslı Windows yerine korsan yüklenmiş.',
    'Beklemede',
    NULL,
    '2025-12-05 10:00:00',
    NULL,
    NULL
  ),
  -- Teknisyen 5 (Elif Çelik) hakkında şikayet
  (
    4,
    'Verilen fiyat ile faturadaki fiyat uyuşmuyor, 200 TL fazla alındı.',
    'İnceleniyor',
    NULL,
    '2025-12-03 16:00:00',
    NULL,
    NULL
  ),
  -- Teknisyen 6 (Ali Şahin) hakkında şikayetler
  (
    5,
    'Kamera montajı düzgün yapılmamış, 3 gün sonra düştü.',
    'Çözüldü',
    'Montaj ücretsiz tekrar yapıldı ve duvar desteği güçlendirildi.',
    '2025-12-06 09:00:00',
    '2025-12-07 14:00:00',
    1
  ),
  (
    5,
    'Teknisyen evde sigara içti, bu kabul edilemez.',
    'Çözüldü',
    'Teknisyen ile görüşüldü, yazılı uyarı verildi. Özür diliyoruz.',
    '2025-12-08 11:30:00',
    '2025-12-09 09:00:00',
    1
  );