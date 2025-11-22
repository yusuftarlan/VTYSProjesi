-- 1️⃣ Veritabanını oluştur
CREATE DATABASE IF NOT EXISTS test_db;
USE test_db;

-- 2️⃣ Tabloları oluştur
CREATE TABLE roles (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE users (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  surname VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  passwd VARCHAR(255) NOT NULL,
  tel_no VARCHAR(20) NOT NULL,
  home_address TEXT NOT NULL,
  role_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE technician_details (
  technician_id INT PRIMARY KEY NOT NULL,
  profession VARCHAR(100) NOT NULL,
  technician_score DECIMAL(4,2) NOT NULL,
  experience_years INT NOT NULL,
  availability_status BOOLEAN
);



CREATE TABLE products (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL
);

CREATE TABLE product_models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    brand VARCHAR(50),
    model_code VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) 
);

CREATE TABLE request_statuses (
  id TINYINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL
);

CREATE TABLE service_requests (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  customer_id INT NOT NULL,
  technician_id INT NOT NULL,
  model_id INT NOT NULL,
  request_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_date DATETIME NULL,
  request_status_id TINYINT NOT NULL,
  service_score DECIMAL(4,2) NULL DEFAULT NULL
);

CREATE TABLE request_details (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  request_id INT NOT NULL,
  detail TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE messages (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  request_id INT NOT NULL,
  sender_id INT NOT NULL,
  message TEXT NOT NULL,
  date DATETIME NOT NULL
);

CREATE TABLE complaints (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  request_id INT NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL,
  response TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  response_by INT
);

CREATE TABLE cookies (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  customer_id INT NOT NULL,
  cookie_info VARCHAR(255) NOT NULL,
  expiry_date DATETIME NOT NULL
);

-- 3️⃣ Foreign Key ekleme
ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES roles (id);
ALTER TABLE technician_details ADD FOREIGN KEY (technician_id) REFERENCES users (id);
ALTER TABLE service_requests ADD FOREIGN KEY (customer_id) REFERENCES users (id);
ALTER TABLE service_requests ADD FOREIGN KEY (technician_id) REFERENCES users (id);
ALTER TABLE service_requests ADD FOREIGN KEY (model_id) REFERENCES product_models (id);
ALTER TABLE service_requests ADD FOREIGN KEY (request_status_id) REFERENCES request_statuses (id);
ALTER TABLE request_details ADD FOREIGN KEY (request_id) REFERENCES service_requests (id);
ALTER TABLE complaints ADD FOREIGN KEY (request_id) REFERENCES service_requests (id);
ALTER TABLE complaints ADD FOREIGN KEY (response_by) REFERENCES users (id);
ALTER TABLE cookies ADD FOREIGN KEY (customer_id) REFERENCES users (id);
ALTER TABLE messages ADD FOREIGN KEY (request_id) REFERENCES service_requests (id);
ALTER TABLE messages ADD FOREIGN KEY (sender_id) REFERENCES users (id);

-- 4️⃣ Roller için örnek veri
INSERT INTO roles (name) VALUES 
('technician'),
('customer'),
('customer_support');

INSERT INTO request_statuses (name) VALUES
("Başvuru Alındı"),
("Hizmet verilecek"),
("Hizmet sağlandı");

-- 5️⃣ Users için örnek veri (role_id değerleri artık doğru)
INSERT INTO users (first_name, surname, email, passwd, tel_no, home_address, role_id) VALUES 
('yusuf','tarlan','yusuf@hotmail.com','1234','5321112233','İstanbul',3),
('Ahmet','Yılmaz','ahmet1@hotmail.com','pass123','5321110001','İstanbul',1),
('Ayşe','Kara','ayse2@gmail.com','pass234','5321110002','Ankara',1),
('Mehmet','Demir','mehmet3@yahoo.com','pass345','5321110003','İzmir',1),
('Elif','Çelik','elif4@hotmail.com','pass456','5321110004','Bursa',1),
('Ali','Şahin','ali5@gmail.com','pass567','5321110005','Adana',1),
('Fatma','Koç','fatma6@yahoo.com','pass568','5321110006','İstanbul',2),
('Cem','Ak','cem7@hotmail.com','pass568','5321110007','Ankara',2),
('Zeynep','Yıldız','zeynep8@gmail.com','pass568','5321110008','İzmir',2),
('Okan','Polat','okan9@yahoo.com','pass568','5321110009','Bursa',2),
('Selin','Arslan','selin10@hotmail.com','pass568','5321110010','Adana',2);

INSERT INTO technician_details 
(technician_id, profession, technician_score, experience_years, availability_status)
VALUES
(2, 'Elektrik Teknisyeni', 4.75, 8, TRUE),
(3, 'Klima Bakım Uzmanı', 4.20, 5, TRUE),
(4, 'Bilgisayar Teknisyeni', 3.90, 3, FALSE),
(5, 'Beyaz Eşya Servis Teknisyeni', 4.55, 10, TRUE),
(6, 'Güvenlik Sistemleri Teknisyeni', 4.10, 6, FALSE);


INSERT INTO products (product_name) VALUES ('Cep Telefonu'),
('Laptop'),
('Masa Üstü Bilgisayar'),
('Tablet'),
('Televizyon'),
('Klima'),
('Kamera'),
('Bulaşık Makinesi'),
('Çamaşır Makinesi'),
('Kombi'),
('Diğer');

-- Cep Telefonu (product_id = 1)
INSERT INTO product_models (product_id, brand, model_code) VALUES
(1, 'Apple', 'iPhone15ProMax'),
(1, 'Apple', 'iPhone14Pro'),
(1, 'Samsung', 'GalaxyS24Ultra'),
(1, 'Samsung', 'GalaxyS23Plus'),
(1, 'Xiaomi', '14Pro'),
(1, 'Xiaomi', 'RedmiNote13Pro'),
(1, 'Oppo', 'FindX6Pro'),
(1, 'OnePlus', '12Pro'),
(1, 'Google', 'Pixel8Pro'),
(1, 'Huawei', 'P60Pro');


-- Diğer product_id = 11
INSERT INTO product_models (product_id, brand, model_code) VALUES
(11, 'Diğer', 'Diğer');


-- Laptop (product_id = 2)
INSERT INTO product_models (product_id, brand, model_code) VALUES
(2, 'Dell', 'XPS13-9310'),
(2, 'HP', 'Pavilion15'),
(2, 'Lenovo', 'ThinkPadX1'),
(2, 'Asus', 'ZenBook14'),
(2, 'Apple', 'MacBookAirM2');

-- Masa Üstü Bilgisayar (product_id = 3)
INSERT INTO product_models (product_id, brand, model_code) VALUES
(3, 'Dell', 'OptiPlex7090'),
(3, 'HP', 'EliteDesk800'),
(3, 'Lenovo', 'IdeaCentre5'),
(3, 'Acer', 'VeritonX4660'),
(3, 'Apple', 'iMac24');

-- Tablet (product_id = 4)
INSERT INTO product_models (product_id, brand, model_code) VALUES
(4, 'Apple', 'iPadAir5'),
(4, 'Samsung', 'GalaxyTabS8'),
(4, 'Lenovo', 'TabP11Pro'),
(4, 'Huawei', 'MatePad11'),
(4, 'Microsoft', 'SurfaceGo3');

-- Televizyon (product_id = 5)
INSERT INTO product_models (product_id, brand, model_code) VALUES
(5, 'Samsung', 'QLED55Q80'),
(5, 'LG', 'OLED48C1'),
(5, 'Sony', 'BraviaX90J'),
(5, 'Philips', '55PUS8506'),
(5, 'Panasonic', 'TX-50JX800');

-- Klima (product_id = 6)
INSERT INTO product_models (product_id, brand, model_code) VALUES
(6, 'Mitsubishi', 'MSZ-AP25VGK'),
(6, 'LG', 'DualCool12'),
(6, 'Daikin', 'FTXM35R'),
(6, 'Samsung', 'AR12TXFYAWK'),
(6, 'Bosch', 'Climate5000');

-- Kamera (product_id = 7)
INSERT INTO product_models (product_id, brand, model_code) VALUES
(7, 'Canon', 'EOSR6'),
(7, 'Nikon', 'Z6II'),
(7, 'Sony', 'Alpha7IV'),
(7, 'Panasonic', 'LumixGH5'),
(7, 'GoPro', 'Hero11Black');

-- Bulaşık Makinesi (product_id = 8)
INSERT INTO product_models (product_id, brand, model_code) VALUES
(8, 'Bosch', 'Serie4SMV46'),
(8, 'Siemens', 'iQ300'),
(8, 'Arçelik', '9453'),
(8, 'Whirlpool', 'ADG959'),
(8, 'Samsung', 'DW60M5052FS');

-- Çamaşır Makinesi (product_id = 9)
INSERT INTO product_models (product_id, brand, model_code) VALUES
(9, 'Bosch', 'WAJ2806S'),
(9, 'Arçelik', '9123'),
(9, 'Samsung', 'WW90T554DAX'),
(9, 'LG', 'F4WV710P1'),
(9, 'Siemens', 'WM14URH0TR');

-- Kombi (product_id = 10)
INSERT INTO product_models (product_id, brand, model_code) VALUES
(10, 'Vaillant', 'ecoTECPlus'),
(10, 'Bosch', 'Condens5000W'),
(10, 'Ariston', 'ClasOne'),
(10, 'ECA', 'EcoLine'),
(10, 'Demirdöküm', 'Nitromix');


