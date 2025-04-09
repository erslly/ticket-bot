

```markdown
# Discord Ticket Sistemi

Discord.js kullanılarak oluşturulmuş, kullanıcıların ticket (destek talebi) oluşturmasını, destek personeliyle iletişim kurmasını ve ticket yaşam döngüsünü (açma, kapama, yeniden açma) yönetmesini sağlayan güçlü bir sistem. Ayrıca, ticket aktiviteleri ve kapanış detayları log kanalına aktarılır.

## Özellikler

- **Ticket Oluşturma**: Kullanıcılar, destek personeliyle iletişim kurabilecekleri bir ticket oluşturabilir.
- **Ticket Kapatma**: Ticket sahibi veya destek personeli ticket'ı kapatarak sorunun çözüldüğünü belirtebilir.
- **Ticket Yeniden Açma**: Kullanıcılar veya destek personeli, kapalı ticket'ı yeniden açabilir.
- **Aktivite Loglama**: Ticket aktiviteleri (ticket oluşturma, kapama, güncellemeler) loglanır ve kaydedilir.

## Kurulum

### Ön Koşullar

Başlamadan önce aşağıdaki gereksinimlerin karşılandığından emin olun:

- [Node.js](https://nodejs.org/en/) (v16 veya daha yeni)
- [Discord Bot Token](https://discord.com/developers/applications)
- Uygun izinlere sahip bir Discord sunucusu

### Kurulum Adımları

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/erslly/ticket-bot.git
   ```

2. Proje dizinine gidin:
   ```bash
   cd ticket-bot
   ```

3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

4. **config.json** dosyasındaki belirtilen yerleri düzenleyin:
   ```json
   {
       "token": "BOT TOKENİNİZ",
       "clientId": "BOT CLİENT ID'NİZ",
       "guildId": "SUNUCUNUZUN ID'Sİ",
       "ticketLogChannelId": "TİCKETLARIN LOG KANALI",
       "staffRoleId": "YETKİLİ ID",
       "ticketCategories": [
           {
               "name": "Ticket Oluştur",
               "value": "general_ticket",
               "description": "Ticket Oluşturmak için açınız.",
               "emoji": ":bust_in_silhouette:",
               "color": "#5865F2",
               "categoryId": "TİCKETIN AÇILACAĞI KATEGORI"
           },
           {
               "name": "Partnerlik",
               "value": "partnership",
               "description": "Partnerlik için açınız.",
               "emoji": ":handshake:",
               "color": "#57F287",
               "categoryId": "TİCKETIN AÇILACAĞI KATEGORI"
           },
           {
               "name": "Fiyat bilgisi almak istiyorum",
               "value": "pricing",
               "description": "Fiyat bilgisi almak için Ticket Açın.",
               "emoji": ":moneybag:",
               "color": "#FEE75C",
               "categoryId": "TİCKETIN AÇILACAĞI KATEGORI"
           },
           {
               "name": "Seçenek Sıfırla",
               "value": "reset_options",
               "description": "Seçenekleri Sıfırlamanıza Yarar.",
               "emoji": ":broom:",
               "color": "#ED4245",
               "categoryId": "TİCKETIN AÇILACAĞI KATEGORI"
           }
       ]
   }
   ```

5. Botu çalıştırın:
   ```bash
   npm start
   ```

## Kullanım

### Komutlar

- **/ticket-setup**: Ticket sistemini kurar.
- **/ticket-close**: Mevcut ticket'ı kapatır. Bir log kaydı oluşturulur ve log kanalına gönderilir.
- **/ticket-add**: Ticket'a bir kullanıcı ekler.
- **/ticket-remove**: Ticket'tan bir kullanıcı çıkarır.
- **/ticket-stats**: Destek talebi istatistiklerinizi görüntüler.

### Ticket Kapatma

Ticket kapatıldığında, bot ticket kanalına bir embed mesaj göndererek kullanıcının ticket'ının kapatıldığını bildirir. Aşağıdaki buton, ticket'ı yeniden açmak için kullanılabilir:

- **Yeniden Aç**: Bu buton, ticket'ı yeniden açarak konuşmaya devam edilmesini sağlar.

### Ticket Yeniden Açma

Ticket yeniden açıldığında, kullanıcı veya destek personeli konuşmayı kesintisiz şekilde devam ettirebilir.

## Özelleştirme

Sistemi aşağıdaki şekilde özelleştirebilirsiniz:

- **Log Kanalı**: Ticket aktivitelerinin kaydedileceği özel bir kanal belirleyin.
- **Embed Renkleri**: Bot mesajlarının embed renklerini özelleştirin.
- **İzinler**: Ticket oluşturma, kapama ve yeniden açma izinlerini kontrol ederek düzenlemeler yapabilirsiniz.

## Katkı Sağlama

Katkılarınız çok değerli! Projeye katkıda bulunmak isterseniz, lütfen repository'yi fork'layın ve bir pull request gönderin. Kodlama kurallarına uymanız ve mümkünse testler eklemeniz önerilir.

### Katkı Nasıl Sağlanır:

1. Depoyu fork'layın.
2. Yeni bir branch oluşturun: `git checkout -b feature/your-feature`.
3. Değişikliklerinizi yapın.
4. Değişikliklerinizi commit'leyin: `git commit -m 'Yeni özellik ekledim'`.
5. Branch'inizi push'layın: `git push origin feature/your-feature`.
6. Bir pull request gönderin.

> **Not**: Bu sistem, basitlik ve kullanım kolaylığı göz önünde bulundurularak tasarlanmıştır. Farklı kullanım senaryoları ve Discord sunucu yapılarına kolayca entegre edilebilir ve genişletilebilir.
