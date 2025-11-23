# Backend API Dokümantasyonu
## Login Backend
**Endpoint:** `POST /auth/login`
**Gidecek Veri (Body):**
```json
{
  "email": "ahmet@ornek.com",
  "password": "cokgizlisifre123"
}
```
**Gelecek Veri:**
```json
{
  "success": true / false,
  "user": {
    "id": "64f1a2c...",
    "name": "Mehmet",
    "isTechnician": true / false
  }
}
```
**Gelecek Veri (Header):**
```
Set-Cookie: access_token=xyz...;
```
## Register Backend
POST /auth/register
**Gidecek Veri (Body):**
```json
{
  "name": "Mehmet",
  "surname": "Demir",
  "email": "mehmet@ornek.com",
  "password": "yenisifre456",
  "phone": "05551234567",
  "address": "Atatürk Mah. Çiçek Sok. No:5 İstanbul",
  "isTechnician": true
}
```
**Gelecek Veri:**
```json
{
  "success": true / false,
   "user": {
    "id": "64f1a2c...",
    "name": "Mehmet",
    "isTechnician": true / false
  }
}
```
## Cookie hala geçerli mi kontrol
GET /auth/me
**Gidecek Veri (Body):**
```
<< BOŞ HEADER ile Cookie gönderilecek >>
```
**Gelecek Veri:**
```json
{
  "isAuthenticated": true,
   "user": {
    "id": "64f1a2c...",
    "name": "Mehmet",
    "isTechnician": true / false
  }
}
```
veya
```json
{
  "isAuthenticated": false
}
```
## Logout
POST /auth/logout
**Gidecek Veri (Body):**
```
<< BOŞ HEADER ile Cookie gönderilecek Cookie databasede devre dışı bırakılmalı>>
```
**Gelecek Veri:**
```json
{
  "success": true / false
}
```