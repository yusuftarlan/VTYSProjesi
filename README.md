# VTYSProjesi
Veri tabanı projesi için MySQL tabanlı web projesi. 

**Projeyi Başlatma**

Projenin olduğu konumda 

```yaml
   node .\server.js
   ```
Daha sonra aşağıdaki gibi frontend kalsörüne girip

```yaml
   cd .\frontend\  
   npm run dev 
   ```

**Proje Mysql Ayarları**

Proje Dosya konumundaki .env dosyasını doldurunuz.

```yaml
  DB_HOST=
  DB_USER=
  DB_PASSWORD=
  DB_NAME=
  PORT=
  VITE_BACKEND_URL=http://localhost:5000/api
   ```

frontend  klasöründeki .env dosyasını doldurunuz.

```yaml
  VITE_IS_DEV=false
  VITE_BACKEND_URL=http://localhost:5000/api
   ```

 **Tabloları ve gerekli prosedürleri oluşturma**
   
   - main_db.sql dosyasında tablo oluşturma fonksiyonları ve örnek kullanıcı oluşturma sql komutları bulunmaktadır.
   
   - procedure_db.sql dosyasında uygulamanın çalışması için gerekli prosedürler bulunmaktadır. Doğru çalışması için bu sql komutları kesinlikle mysql'de çalıştırılmalıdır.
   
   - extra_inserts.sql dosyasında ekstra örnek veri insertleri bulunmakta isteğe bağlı kullanılabilir.

 
