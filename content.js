// LinkedIn Content Filter - Content Script
// Bu script LinkedIn sayfasında çalışır ve postları filtreler

let keywords = [];
let filteredCount = 0;
let keywordStats = {}; // Her keyword için kaç post filtrelendiği
let lifetimeTotal = 0; // Tüm zamanlarda toplam filtrelenen post sayısı

// Storage'dan anahtar kelimeleri ve istatistikleri yükle
function loadKeywords() {
  chrome.storage.sync.get(['keywords'], (result) => {
    keywords = result.keywords || [];

    // Her keyword için stats object'i oluştur
    keywords.forEach(kw => {
      if (!keywordStats[kw]) {
        keywordStats[kw] = 0;
      }
    });

    console.log('LinkedIn Content Filter: Loaded keywords:', keywords);
    filterPosts();

    // Widget varsa güncelle
    const widget = document.getElementById('lcf-sidebar-widget');
    if (widget) {
      updateWidgetList();
    }
  });
}

// Lifetime stats'i yükle
function loadLifetimeStats() {
  chrome.storage.local.get(['lifetimeTotal'], (result) => {
    lifetimeTotal = result.lifetimeTotal || 0;
    console.log('LinkedIn Content Filter: Lifetime total:', lifetimeTotal);
  });
}

// Lifetime stats'i kaydet
function saveLifetimeStats() {
  chrome.storage.local.set({ lifetimeTotal }, () => {
    console.log('LinkedIn Content Filter: Saved lifetime total:', lifetimeTotal);
  });
}

// Post'un text içeriğini al
function getPostText(postElement) {
  // Tüm post içeriğini al (innerText)
  // toLocaleLowerCase('tr') Türkçe karakter sorunu olmaması için önemli
  return postElement.innerText.toLocaleLowerCase('tr').trim();
}

// Anahtar kelime ile eşleşme kontrolü
function containsKeyword(text, keyword) {
  const lowerKeyword = keyword.toLocaleLowerCase('tr');
  // Tam kelime eşleşmesi için regex kullan
  const regex = new RegExp('\\b' + lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
  return regex.test(text);
}

// Postları filtrele
function filterPosts() {
  if (keywords.length === 0) {
    // Anahtar kelime yoksa tüm postları göster
    const allPosts = document.querySelectorAll('.feed-shared-update-v2, .occludable-update, [data-urn]');
    allPosts.forEach(post => {
      post.style.display = '';
    });
    return;
  }

  // Daha geniş kapsamlı selector
  const posts = document.querySelectorAll('.feed-shared-update-v2, .occludable-update, [data-urn]');
  let newFilteredCount = 0;

  posts.forEach(post => {
    // Kendi dataset'imiz değilse ve görünür bir updatese
    if (post.dataset.filtered === 'true') return;

    // Bazı container'lar iç içe olabilir, en dıştaki wrapper'ı bulmaya çalış
    // Ama şimdilik hepsini kontrol edelim, performans sorunu olursa optimize ederiz

    const text = getPostText(post);
    let shouldHide = false;
    let matchedKeyword = null;

    for (const keyword of keywords) {
      if (containsKeyword(text, keyword)) {
        shouldHide = true;
        matchedKeyword = keyword;
        break;
      }
    }

    if (shouldHide) {
      if (post.style.display !== 'none') {
        post.style.display = 'none';
        post.dataset.filtered = 'true';
        post.dataset.matchedKeyword = matchedKeyword;
        newFilteredCount++;

        // Keyword istatistiğini güncelle
        if (matchedKeyword && keywordStats[matchedKeyword] !== undefined) {
          keywordStats[matchedKeyword]++;
        }
      }
    } else {
      // Sadece bizim gizlediklerimizi aç
      if (post.dataset.filtered === 'true') {
        post.style.display = '';
        post.dataset.filtered = 'false';
      }
    }
  });

  filteredCount += newFilteredCount;
  if (newFilteredCount > 0) {
    lifetimeTotal += newFilteredCount;
    saveLifetimeStats();
    console.log(`LinkedIn Content Filter: ${newFilteredCount} yeni post filtrelendi (Oturum: ${filteredCount}, Toplam: ${lifetimeTotal})`);
  }

  // Widget sayacını güncelle
  updateWidgetCounter();
}

// Sidebar widget'ındaki sayacı ve keyword istatistiklerini güncelle
function updateWidgetCounter() {
  const widget = document.getElementById('lcf-sidebar-widget');
  if (!widget) return;

  // Stats kısmını güncelle
  const statsDiv = widget.querySelector('#lcf-stats');
  if (statsDiv) {
    statsDiv.innerHTML = `
      <div style="font-size: 12px; color: #666;">
        <span style="font-weight: 600;">${filteredCount}</span> this session
      </div>
      <div style="font-size: 11px; color: #999;">
        <span style="font-weight: 600;">${lifetimeTotal}</span> total hidden
      </div>
    `;
  }

  // Keyword badge'lerini güncelle
  updateWidgetList();
}

// Widget keyword listesini güncelle (ayrı fonksiyon olarak)
function updateWidgetList() {
  const widget = document.getElementById('lcf-sidebar-widget');
  if (!widget) return;

  const list = widget.querySelector('#lcf-list');
  if (!list) return;

  list.innerHTML = '';
  if (keywords.length === 0) {
    list.innerHTML = '<div style="color: #666; font-size: 13px; text-align: center; padding: 8px;">No keywords</div>';
  } else {
    keywords.forEach((keyword, index) => {
      const item = document.createElement('div');
      item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 6px 10px; border-radius: 4px; font-size: 14px;';

      const leftSide = document.createElement('div');
      leftSide.style.cssText = 'display: flex; align-items: center; gap: 6px; flex: 1;';

      const text = document.createElement('span');
      text.textContent = keyword;
      text.style.cssText = 'font-weight: 500;';

      const count = keywordStats[keyword] || 0;
      const badge = document.createElement('span');
      badge.textContent = count;
      badge.style.cssText = 'background: #B02A69; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600; min-width: 18px; text-align: center;';

      leftSide.appendChild(text);
      leftSide.appendChild(badge);

      const delBtn = document.createElement('button');
      delBtn.innerHTML = '×';
      delBtn.style.cssText = 'border: none; background: none; color: #d32f2f; font-weight: bold; font-size: 18px; cursor: pointer; padding: 0 4px;';
      delBtn.onclick = () => {
        keywords.splice(index, 1);
        delete keywordStats[keyword];
        chrome.storage.sync.set({ keywords }, () => {
          updateWidgetList();
          filterPosts();
        });
      };

      item.appendChild(leftSide);
      item.appendChild(delBtn);
      list.appendChild(item);
    });
  }
}

// Debounce fonksiyonu (performans için)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Yeni postları izlemek için MutationObserver
const debouncedFilter = debounce(filterPosts, 500); // 300->500ms biraz daha bekleyelim content dolsun

const observer = new MutationObserver((mutations) => {
  // Kendi widget'ımızdaki değişiklikleri ignore et (sonsuz döngü önleme)
  const isWidgetMutation = mutations.some(mutation => {
    const target = mutation.target;
    // Eğer mutation bizim widget içindeyse ignore et
    return target.id === 'lcf-sidebar-widget' ||
      target.closest('#lcf-sidebar-widget') ||
      (mutation.addedNodes && Array.from(mutation.addedNodes).some(node =>
        node.id === 'lcf-sidebar-widget'
      ));
  });

  if (!isWidgetMutation) {
    debouncedFilter();
  }
});

// Feed container'ı izle
function startObserving() {
  const feedContainer = document.querySelector('.scaffold-layout__main') ||
    document.querySelector('main') ||
    document.body;

  if (feedContainer) {
    observer.observe(feedContainer, {
      childList: true,
      subtree: true
    });
    console.log('LinkedIn Content Filter: Feed observer started');
  }

  // Sidebar widget'ı başlat
  initSidebarWidget();
}

// Sidebar Widget Logic
function initSidebarWidget() {
  // Sidebar'ı bul
  const sidebar = document.querySelector('.scaffold-layout__aside');
  if (!sidebar) return;

  // Widget zaten varsa tekrar ekleme
  if (document.getElementById('lcf-sidebar-widget')) return;

  // Widget HTML'ini oluştur
  const widget = document.createElement('div');
  widget.id = 'lcf-sidebar-widget';
  widget.className = 'artdeco-card scaffold-layout__sticky-content'; // LinkedIn'in kendi sticky class'ı
  widget.style.cssText = `
    margin-bottom: 8px;
    padding: 12px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  `;

  // İçerik (Popup HTML'inin basitleştirilmiş hali)
  widget.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
      <div style="background: #B02A69; color: white; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold;">F</div>
      <h2 style="font-size: 16px; font-weight: 600; margin: 0; color: rgba(0,0,0,0.9);">Feed Cleaner For LinkedIn</h2>
    </div>
    
    <div style="display: flex; gap: 8px; margin-bottom: 12px;">
      <input type="text" id="lcf-input" placeholder="Keyword..." style="flex: 1; padding: 6px 8px; border: 1px solid rgba(0,0,0,0.6); border-radius: 4px; font-size: 14px;">
      <button id="lcf-add-btn" style="background: #B02A69; color: white; border: none; padding: 6px 12px; border-radius: 16px; font-weight: 600; cursor: pointer;">Add</button>
    </div>

    <div id="lcf-list" style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;">
      <!-- Keywords will be loaded here -->
    </div>

    <div id="lcf-stats" style="text-align: center; border-top: 1px solid #eee; padding-top: 8px; display: flex; flex-direction: column; gap: 4px;">
      <div style="font-size: 12px; color: #666;">
        <span style="font-weight: 600;">${filteredCount}</span> this session
      </div>
      <div style="font-size: 11px; color: #999;">
        <span style="font-weight: 600;">${lifetimeTotal}</span> total hidden
      </div>
    </div>
  `;

  // Widget'ı ad-banner-container içine ekle (LinkedIn'in native sticky container'ı)
  const adBannerContainer = sidebar.querySelector('.ad-banner-container');

  if (adBannerContainer) {
    // ad-banner-container içine, ilk element olarak ekle
    adBannerContainer.insertBefore(widget, adBannerContainer.firstChild);
  } else {
    // ad-banner-container yoksa sidebar'ın başına ekle
    sidebar.prepend(widget);
  }

  // Event Listeners
  const input = widget.querySelector('#lcf-input');
  const addBtn = widget.querySelector('#lcf-add-btn');
  const list = widget.querySelector('#lcf-list');

  // Widget'ı ilk başlatıldığında liste yükle
  updateWidgetList();

  // Ekleme fonksiyonu
  addBtn.onclick = () => {
    const val = input.value.trim();

    // Validasyon: Min 3 karakter
    if (val.length < 3) {
      input.style.borderColor = '#d32f2f';
      input.placeholder = 'Min 3 characters...';
      setTimeout(() => {
        input.style.borderColor = 'rgba(0,0,0,0.6)';
        input.placeholder = 'Keyword...';
      }, 1500);
      return;
    }

    // Duplicate kontrolü
    if (keywords.includes(val)) {
      input.style.borderColor = '#ff9800';
      input.placeholder = 'Already exists...';
      setTimeout(() => {
        input.style.borderColor = 'rgba(0,0,0,0.6)';
        input.placeholder = 'Keyword...';
      }, 1500);
      return;
    }

    if (val) {
      keywords.push(val);
      chrome.storage.sync.set({ keywords }, () => {
        updateWidgetList();
        filterPosts();
        input.value = '';
      });
    }
  };

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
  });
}

// Popup'tan mesaj dinle (anahtar kelime güncellendiğinde)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateKeywords') {
    // Tüm filtreleri sıfırla
    document.querySelectorAll('.feed-shared-update-v2').forEach(post => {
      delete post.dataset.filtered;
    });
    filteredCount = 0;

    // Keywords'ü yeniden yükle ve widget'ı güncelle
    chrome.storage.sync.get(['keywords'], (result) => {
      keywords = result.keywords || [];
      filterPosts();
      // Widget varsa listeyi güncelle
      const widget = document.getElementById('lcf-sidebar-widget');
      if (widget) {
        // initSidebarWidget içindeki updateList fonksiyonuna erişemiyoruz
        // bu yüzden sayfayı yenilemek yerine, 
        // basitçe remove edip tekrar init edebiliriz veya 
        // DOM'u manuel güncelleyebiliriz.
        // Şimdilik basitlik adına widget'ı silip tekrar oluşturmak (yanıp sönme yapar ama çalışır)
        widget.remove();
        initSidebarWidget();
      }
    });

    sendResponse({ success: true });
  }
});


// Sayfa yüklendiğinde başlat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadLifetimeStats(); // Lifetime stats'i yükle
    loadKeywords();
    startObserving();
  });
} else {
  loadLifetimeStats(); // Lifetime stats'i yükle
  loadKeywords();
  startObserving();
}

// Sayfa görünür olduğunda tekrar kontrol et
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    filterPosts();
  }
});
