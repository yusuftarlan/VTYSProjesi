CREATE PROCEDURE CreateServiceRequestWithNewProduct(
    IN p_customer_id INT,
    IN p_technician_id INT,
    IN p_product_name VARCHAR(50),
    IN p_brand VARCHAR(50),
    IN p_model_code VARCHAR(50),
    IN p_request_detail TEXT,
    IN p_estimated_price DECIMAL(10,2)
)
BEGIN
    -- Değişkenler
    DECLARE v_product_id INT DEFAULT NULL;
    DECLARE v_model_id INT DEFAULT NULL;
    DECLARE v_request_id INT DEFAULT NULL;
    
    -- Hata yakalama için handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Hata olursa tüm işlemleri geri al
        ROLLBACK;
        SELECT 'HATA: İşlem geri alındı (ROLLBACK)' AS Sonuc;
    END;
    
    -- Transaction başlat
    START TRANSACTION;
    
    -- 1️⃣ Ürün var mı kontrol et
    SELECT id INTO v_product_id 
    FROM products 
    WHERE product_name = p_product_name 
    LIMIT 1;
    
    -- Ürün yoksa yeni ürün ekle
    IF v_product_id IS NULL THEN
        INSERT INTO products (product_name) 
        VALUES (p_product_name);
        
        SET v_product_id = LAST_INSERT_ID();
        SELECT CONCAT('Yeni ürün eklendi: ', p_product_name, ' (ID: ', v_product_id, ')') AS Bilgi;
    ELSE
        SELECT CONCAT('Mevcut ürün kullanılıyor: ', p_product_name, ' (ID: ', v_product_id, ')') AS Bilgi;
    END IF;
    
    --  Ürün modeli var mı kontrol et
    SELECT id INTO v_model_id 
    FROM product_models 
    WHERE product_id = v_product_id 
      AND brand = p_brand 
      AND model_code = p_model_code 
    LIMIT 1;
    
    -- Model yoksa yeni model ekle
    IF v_model_id IS NULL THEN
        INSERT INTO product_models (product_id, brand, model_code) 
        VALUES (v_product_id, p_brand, p_model_code);
        
        SET v_model_id = LAST_INSERT_ID();
        SELECT CONCAT('Yeni model eklendi: ', p_brand, ' ', p_model_code, ' (ID: ', v_model_id, ')') AS Bilgi;
    ELSE
        SELECT CONCAT('Mevcut model kullanılıyor (ID: ', v_model_id, ')') AS Bilgi;
    END IF;
    
    -- Servis talebini oluştur
    INSERT INTO service_requests (
        customer_id, 
        technician_id, 
        model_id, 
        request_date, 
        request_status_id
    ) VALUES (
        p_customer_id, 
        p_technician_id, 
        v_model_id, 
        NOW(), 
        1
    );
    
    SET v_request_id = LAST_INSERT_ID();
    SELECT CONCAT('Servis talebi oluşturuldu (ID: ', v_request_id, ')') AS Bilgi;
    
    -- Talep detaylarını ekle
    INSERT INTO request_details (request_id, detail, price) 
    VALUES (v_request_id, p_request_detail, p_estimated_price);
    
    SELECT 'Talep detayları eklendi' AS Bilgi;
    
    -- Tüm işlemler başarılı, COMMIT yap
    COMMIT;
    
    SELECT 'BAŞARILI: Tüm işlemler tamamlandı (COMMIT)' AS Sonuc; 
END

CREATE VIEW vw_service_requests_summary AS
SELECT 
    sr.id AS talep_id,
    CONCAT(c.first_name, ' ', c.surname) AS musteri_adi,
    CONCAT(t.first_name, ' ', t.surname) AS teknisyen_adi,
    p.product_name AS urun,
    pm.brand AS marka,
    pm.model_code AS model,
    rs.name AS durum,
    rd.detail AS yapilan_islem,
    rd.price AS ucret,
    sr.request_date AS talep_tarihi,
    sr.service_score AS puan
FROM service_requests sr
JOIN users c ON sr.customer_id = c.id
JOIN users t ON sr.technician_id = t.id
JOIN product_models pm ON sr.model_id = pm.id
JOIN products p ON pm.product_id = p.id
JOIN request_statuses rs ON sr.request_status_id = rs.id
LEFT JOIN request_details rd ON sr.id = rd.request_id;


-- SELECT * FROM vw_service_requests_summary;


CREATE PROCEDURE sp_update_technician_score(
    IN p_technician_id INT
)
BEGIN
    DECLARE v_avg_score DECIMAL(4,2);
    
    -- Teknisyenin tüm servislerinin ortalama puanını hesapla
    SELECT AVG(service_score) INTO v_avg_score
    FROM service_requests
    WHERE technician_id = p_technician_id 
      AND service_score IS NOT NULL;
    
    -- Teknisyen detaylarını güncelle
    UPDATE technician_details
    SET technician_score = IFNULL(v_avg_score, 0)
    WHERE technician_id = p_technician_id;
    
    -- Sonucu göster
    SELECT CONCAT('Teknisyen ID: ', p_technician_id, ' - Yeni Puan: ', IFNULL(v_avg_score, 0)) AS Sonuc;
END;

-- CALL sp_update_technician_score(2)