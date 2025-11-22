
INSERT INTO technician_details (technician_id, profession, technician_score, 
experience_years, availability_status) VALUES (1, "pc", 0, 2, 0);
SELECT * FROM technician_details;INSERT INTO availability_statuses (id, _status)


SELECT * FROM users WHERE id=?
UPDATE technician_details SET availability_status=? WHERE technician_id=?

DELETE FROM users WHERE id = ?
INSERT INTO messages (request_id, sender_id, message, date)
VALUES (1, 7, 'Merhaba, cihazım için servis randevusu almak istiyorum.', NOW());


SELECT t.technician_id, count(service_requests.id) FROM service_requests as s JOIN technician_details as t ON s.technician_id = t.technician_id
GROUP BY t.technician_id 

SELECT u.name, u.surname, t.technician_score FROM technician_details as t JOIN users AS u
ON t.technician_id = u.id WHERE t.experience_years = ? ORDER BY t.technician_score DESC 

SELECT p.product_name
FROM service_requests AS s
JOIN product_models AS m
    ON m.id = s.model_id
JOIN products AS p
    ON p.id = m.product_id
WHERE s.id = ?;

UPDATE technician_details AS t
SET t.technician_score = (SELECT AVG(s.service_score) FROM service_requests as s WHERE s.technician_id = t.technician_id)  
WHERE t.technician_id = ?

SELECT * FROM users AS u WHERE NOT EXISTS (SELECT * FROM service_requests as s WHERE s.customer_id = u.id )

SELECT * FROM messages JOIN service_requests ON service_requests.id = messages.id

SELECT *
FROM cookies
WHERE expiry_date < NOW();

SELECT r.customer_id, COUNT(c.id) AS complaint_count
FROM complaints c
JOIN user u ON c.request_id = r.id
GROUP BY r.customer_id
HAVING COUNT(c.id) > 10;

SELECT 
    sr.technician_id,
    u.first_name,
    u.surname,
    COUNT(c.id) AS complaint_count
FROM complaints c
JOIN service_requests sr ON c.request_id = sr.id
JOIN users u ON sr.technician_id = u.id
GROUP BY sr.technician_id, u.first_name, u.surname
HAVING COUNT(c.id) > 10;

DELETE FROM cookies
WHERE expiry_date < NOW();
