## Backend Apileri
# Login Backend
POST /auth/login
Gidecek Veri
{
  "email": "ahmet@ornek.com",
  "password": "cokgizlisifre123"
}
Gelecek Veri
{
  "success": true / false,
  "user": {
    "id": "64f1a2c...",
    "name": "Mehmet",
    "isTechnician": true / false
  }
}
Gelecek Header
Set-Cookie: access_token=xyz...;

# Register Backend
POST /auth/register
Gidecek Veri
{
  "name": "Mehmet",
  "surname": "Demir",
  "email": "mehmet@ornek.com",
  "password": "yenisifre456",
  "phone": "05551234567",
  "address": "Atatürk Mah. Çiçek Sok. No:5 İstanbul",
  "isTechnician": true
}
Gelecek Veri
{
  "success": true / false,
   "user": {
    "id": "64f1a2c...",
    "name": "Mehmet",
    "isTechnician": true / false
  }
}

# Cookie hala geçerli mi kontrol
GET /auth/me
Gidecek Veri
<< BOŞ HEADER ile Cookie gönderilecek >>
Gelecek Veri
{
  "isAuthenticated": true,
   "user": {
    "id": "64f1a2c...",
    "name": "Mehmet",
    "isTechnician": true / false
  }
}
veya
{
  "isAuthenticated": false
}

# Logout
POST /auth/logout
Gidecek Veri
<< BOŞ HEADER ile Cookie gönderilecek Cookie databasede devre dışı bırakılmalı>>
Gelecek Veri
{
  "success": true / false
}