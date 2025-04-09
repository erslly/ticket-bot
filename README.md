# Discord Ticket Sistemi

Discord.js kullanılarak oluşturulmuş, kullanıcıların ticket (destek talebi) oluşturmasını, destek personeliyle iletişim kurmasını ve ticket yaşam döngüsünü (açma, kapama, yeniden açma) yönetmesini sağlayan güçlü bir sistem. Tüm ticket aktiviteleri ve detayları belirlediğiniz log kanalına aktarılır.

## Özellikler

- **Ticket Oluşturma:** Kullanıcılar, destek personeliyle iletişim kurabilecekleri özel bir kanal oluşturabilir
- **Ticket Kategorileri:** Farklı konular için özelleştirilebilir ticket türleri (genel destek, partnerlik, fiyatlandırma vb.)
- **Ticket Yönetimi:** Kullanıcı ekleme/çıkarma, kapatma ve yeniden açma seçenekleri
- **Detaylı Loglama:** Tüm ticket aktiviteleri (oluşturma, kapama, güncelleme) kaydedilir ve arşivlenir
- **İstatistikler:** Ticket kullanım istatistiklerini görüntüleme imkanı

## Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/en/) (v16 veya daha yeni)
- [Discord Bot Token](https://discord.com/developers/applications)
- Gerekli izinlere sahip Discord sunucusu

### Adım Adım Kurulum

1. Projeyi bilgisayarınıza indirin:
   ```bash
   git clone https://github.com/erslly/ticket-bot.git
   cd ticket-bot
   ```

2. Gerekli paketleri yükleyin:
   ```bash
   npm install
   ```

3. `config.json` dosyasını düzenleyin:
   ```json
   {
       "token": "BOT_TOKENİNİZ",
       "clientId": "BOT_CLIENT_ID",
       "guildId": "SUNUCU_ID",
       "ticketLogChannelId": "LOG_KANAL_ID",
       "staffRoleId": "YETKİLİ_ROL_ID",
       "ticketCategories": [
           {
               "name": "Genel Destek",
               "value": "general_ticket",
               "description": "Genel sorularınız için destek talebi oluşturun",
               "emoji": ":bust_in_silhouette:",
               "color": "#5865F2",
               "categoryId": "KATEGORİ_ID_1"
           },
           {
               "name": "Partnerlik",
               "value": "partnership",
               "description": "Partnerlik başvuruları için bu seçeneği kullanın",
               "emoji": ":handshake:",
               "color": "#57F287",
               "categoryId": "KATEGORİ_ID_2"
           },
           {
               "name": "Fiyatlandırma",
               "value": "pricing",
               "description": "Hizmetlerimizin fiyatları hakkında bilgi alın",
               "emoji": ":moneybag:",
               "color": "#FEE75C",
               "categoryId": "KATEGORİ_ID_3"
           },
           {
               "name": "Seçenek Sıfırla",
               "value": "reset_options",
               "description": "Seçimleri sıfırla",
               "emoji": ":broom:",
               "color": "#ED4245",
               "categoryId": "KATEGORİ_ID_4"
           }
       ]
   }
   ```

4. Botu başlatın:
   ```bash
   npm start
   ```

## Kullanım Kılavuzu

### Bot Komutları

| Komut | Açıklama |
|-------|----------|
| `/ticket-setup` | Ticket sistemini kurar ve menü oluşturur |
| `/ticket-close` | Mevcut destek talebini kapatır |
| `/ticket-add @kullanıcı` | Belirtilen kullanıcıyı ticket'a ekler |
| `/ticket-remove @kullanıcı` | Belirtilen kullanıcıyı ticket'tan çıkarır |
| `/ticket-stats` | Destek talebi istatistiklerini gösterir |

### Kullanıcı İşlemleri

1. **Ticket Oluşturma:** 
   - Ticket menüsünden uygun kategoriyi seçin
   - Bot otomatik olarak kategori altında özel bir kanal oluşturacaktır

2. **Ticket Kapatma:**
   - `/ticket-close` komutunu kullanın veya kapatma butonuna tıklayın
   - Kapatılan ticket içeriği log kanalına kaydedilir

3. **Ticket Yeniden Açma:**
   - Kapatılmış bir tickettaki "Yeniden Aç" butonuna tıklayın
   - Ticket kanalı ve konuşma geçmişi yeniden erişilebilir hale gelir

## Özelleştirme Seçenekleri

### Görünüm Ayarları
- **Embed Renkleri:** Her ticket kategorisi için farklı renk tanımlayabilirsiniz
- **Emojiler:** Kategorilere özel emoji ekleyebilirsiniz

### Fonksiyonel Ayarlar
- **Kategoriler:** İhtiyacınıza göre yeni ticket kategorileri ekleyebilirsiniz
- **İzinler:** Rollere ve kullanıcılara göre ticket açma/kapama izinlerini düzenleyebilirsiniz
- **Otomatik Kapanma:** Belirli bir süre aktif olmayan ticket'ların otomatik kapatılması için ayar yapabilirsiniz

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| Bot çevrimiçi olmuyor | Token doğruluğunu ve bot izinlerini kontrol edin |
| Ticket oluşturulmuyor | Kategori ID'lerinin doğru girildiğinden emin olun |
| Log mesajları gelmiyor | Log kanal ID'sini ve bot izinlerini kontrol edin |

## Projeye Katkı Sağlama

Bu projeye katkıda bulunmak isterseniz:

1. GitHub'da projeyi fork'layın
2. Yeni bir branch oluşturun: `git checkout -b yeni-ozellik`
3. Değişikliklerinizi commit'leyin: `git commit -m 'Yeni özellik eklendi'`
4. Branch'inizi push'layın: `git push origin yeni-ozellik`
5. Pull request oluşturun

## İletişim ve Destek

Sorularınız veya önerileriniz için GitHub üzerinden issue açabilir veya iletişime geçebilirsiniz.

---

**Not:** Bu sistem, çeşitli Discord sunucu yapılarına kolayca entegre edilebilecek şekilde tasarlanmıştır. Sunucunuzun ihtiyaçlarına göre özelleştirebilirsiniz.
