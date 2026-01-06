# 🔍 LinkedIn Content Filter

LinkedIn'de istenmeyen anahtar kelimeleri içeren postları otomatik olarak filtreleyen modern bir Chrome eklentisi.

## ✨ Özellikler

- 🎯 **Anahtar Kelime Bazlı Filtreleme:** İstemediğiniz konulardaki postları gizler
- 🔄 **Infinite Scroll Desteği:** Yeni yüklenen postları da otomatik filtreler
- 💾 **Lokal Veri Saklama:** Tüm verileriniz sadece tarayıcınızda saklanır
- ⚡ **Hızlı ve Performanslı:** Sayfayı yavaşlatmaz
- 🎨 **Modern Arayüz:** Kullanıcı dostu ve şık tasarım
- 🔒 **Gizlilik:** Hiçbir veri dışarı gönderilmez

## 📦 Kurulum

### Chrome Web Store'dan (Henüz Mevcut Değil)
Eklenti henüz mağazada yayınlanmamıştır. Developer mode ile yükleyebilirsiniz.

### Developer Mode ile Yükleme

1. Chrome tarayıcınızda `chrome://extensions` adresine gidin
2. Sağ üst köşedeki **"Developer mode"** (Geliştirici modu) seçeneğini aktif edin
3. **"Load unpacked"** (Paketlenmemiş uzantı yükle) butonuna tıklayın
4. Bu proje klasörünü (`Linkedin_Content_Filter`) seçin
5. Eklenti yüklendi! 🎉

## 🚀 Kullanım

### Anahtar Kelime Ekleme

1. Tarayıcı toolbar'ındaki eklenti ikonuna tıklayın
2. Açılan popup'ta filtrelemek istediğiniz kelimeyi yazın
3. **"Ekle"** butonuna tıklayın veya Enter'a basın
4. Kelime listeye eklenir ve LinkedIn feed'inizde otomatik filtreleme başlar

### Anahtar Kelime Silme

1. Popup'ı açın
2. Silmek istediğiniz kelimenin yanındaki **×** butonuna tıklayın
3. Kelime listeden kaldırılır ve filtreleme güncellenir

### İpuçları

- Anahtar kelime eşleşmesi büyük/küçük harf duyarsızdır (case-insensitive)
- Tam kelime eşleşmesi kullanılır (partial match değil)
- Örneğin: "kripto" kelimesi "Kripto", "KRİPTO" varyantlarını bulur
- Infinite scroll ile yeni yüklenen postlar da otomatik filtrelenir

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler

- **Manifest Version:** 3 (En güncel Chrome extension standardı)
- **Permissions:** `storage`, `activeTab`
- **Content Script:** LinkedIn'de çalışan filtreleme mantığı
- **MutationObserver:** Infinite scroll için DOM değişikliklerini izler
- **Chrome Storage API:** Anahtar kelimeleri saklar

### Dosya Yapısı

```
Linkedin_Content_Filter/
├── manifest.json          # Extension yapılandırması
├── content.js            # LinkedIn'de çalışan filtreleme script'i
├── popup.html            # Popup arayüzü
├── popup.css             # Popup stilleri
├── popup.js              # Popup mantığı
├── icons/                # Extension ikonları
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Bu dosya
```

## 🔐 Gizlilik

- ✅ Tüm verileriniz sadece **tarayıcınızda** saklanır
- ✅ Hiçbir veri **dışarı gönderilmez**
- ✅ Sadece **linkedin.com** domain'inde çalışır
- ✅ **Açık kaynak** - kodları inceleyebilirsiniz

## 🤝 Katkıda Bulunma

Bu proje açık kaynak değildir ancak önerilerinizi paylaşabilirsiniz.

## 📝 Lisans

Bu proje kişisel kullanım içindir.

## 💡 Önerilen Filtreler

Bazı popüler filtre önerileri:

- **Kripto/NFT:** kripto, bitcoin, NFT, blockchain
- **Webinar/Etkinlik:** webinar, seminer, etkinlik
- **Kendini geliştir:** motivasyon, hustle, mindset
- **Politika:** siyaset, seçim

## 🐛 Sorun Bildirimi

Herhangi bir sorunla karşılaşırsanız lütfen bildirin.

---

**Made with ❤️ by Yaşar Abi**
