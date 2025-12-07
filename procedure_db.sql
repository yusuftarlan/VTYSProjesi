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
    
    -- 2️⃣ Ürün yoksa yeni ürün ekle
    IF v_product_id IS NULL THEN
        INSERT INTO products (product_name) 
        VALUES (p_product_name);
        
        SET v_product_id = LAST_INSERT_ID();
        SELECT CONCAT('Yeni ürün eklendi: ', p_product_name, ' (ID: ', v_product_id, ')') AS Bilgi;
    ELSE
        SELECT CONCAT('Mevcut ürün kullanılıyor: ', p_product_name, ' (ID: ', v_product_id, ')') AS Bilgi;
    END IF;
    
    -- 3️⃣ Ürün modeli var mı kontrol et
    SELECT id INTO v_model_id 
    FROM product_models 
    WHERE product_id = v_product_id 
      AND brand = p_brand 
      AND model_code = p_model_code 
    LIMIT 1;
    
    -- 4️⃣ Model yoksa yeni model ekle
    IF v_model_id IS NULL THEN
        INSERT INTO product_models (product_id, brand, model_code) 
        VALUES (v_product_id, p_brand, p_model_code);
        
        SET v_model_id = LAST_INSERT_ID();
        SELECT CONCAT('Yeni model eklendi: ', p_brand, ' ', p_model_code, ' (ID: ', v_model_id, ')') AS Bilgi;
    ELSE
        SELECT CONCAT('Mevcut model kullanılıyor (ID: ', v_model_id, ')') AS Bilgi;
    END IF;
    
    -- 5️⃣ Servis talebini oluştur
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
    
    -- 6️⃣ Talep detaylarını ekle
    INSERT INTO request_details (request_id, detail, price) 
    VALUES (v_request_id, p_request_detail, p_estimated_price);
    
    SELECT 'Talep detayları eklendi' AS Bilgi;
    
    -- Tüm işlemler başarılı, COMMIT yap
    COMMIT;
    
    SELECT 'BAŞARILI: Tüm işlemler tamamlandı (COMMIT)' AS Sonuc; 
END