// LinkedIn Content Filter - Popup Script
// Anahtar kelimeleri yönetir

const keywordInput = document.getElementById('keywordInput');
const addButton = document.getElementById('addButton');
const keywordsList = document.getElementById('keywordsList');
const emptyState = document.getElementById('emptyState');
const keywordCount = document.getElementById('keywordCount');

// Storage'dan anahtar kelimeleri yükle
function loadKeywords() {
    chrome.storage.sync.get(['keywords'], (result) => {
        const keywords = result.keywords || [];
        displayKeywords(keywords);
    });
}

// Anahtar kelimeleri listele
function displayKeywords(keywords) {
    keywordsList.innerHTML = '';

    if (keywords.length === 0) {
        emptyState.classList.add('visible');
        keywordCount.textContent = '0';
    } else {
        emptyState.classList.remove('visible');
        keywordCount.textContent = keywords.length;

        keywords.forEach((keyword, index) => {
            const item = createKeywordItem(keyword, index);
            keywordsList.appendChild(item);
        });
    }
}

// Anahtar kelime item elementi oluştur
function createKeywordItem(keyword, index) {
    const item = document.createElement('div');
    item.className = 'keyword-item';

    const text = document.createElement('span');
    text.className = 'keyword-text';
    text.textContent = keyword;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Sil';
    deleteBtn.onclick = () => deleteKeyword(index);

    item.appendChild(text);
    item.appendChild(deleteBtn);

    return item;
}

// Yeni anahtar kelime ekle
function addKeyword() {
    const keyword = keywordInput.value.trim();

    if (!keyword) {
        keywordInput.focus();
        return;
    }

    chrome.storage.sync.get(['keywords'], (result) => {
        const keywords = result.keywords || [];

        // Duplicate kontrolü (case-insensitive)
        const exists = keywords.some(k => k.toLowerCase() === keyword.toLowerCase());
        if (exists) {
            keywordInput.value = '';
            keywordInput.placeholder = 'Bu kelime zaten mevcut!';
            setTimeout(() => {
                keywordInput.placeholder = 'Anahtar kelime girin...';
            }, 2000);
            return;
        }

        keywords.push(keyword);

        chrome.storage.sync.set({ keywords }, () => {
            displayKeywords(keywords);
            keywordInput.value = '';
            keywordInput.focus();

            // Content script'e güncelleme bildir
            notifyContentScript();
        });
    });
}

// Anahtar kelime sil
function deleteKeyword(index) {
    chrome.storage.sync.get(['keywords'], (result) => {
        const keywords = result.keywords || [];
        keywords.splice(index, 1);

        chrome.storage.sync.set({ keywords }, () => {
            displayKeywords(keywords);

            // Content script'e güncelleme bildir
            notifyContentScript();
        });
    });
}

// Content script'e güncelleme mesajı gönder
function notifyContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url?.includes('linkedin.com')) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'updateKeywords' }, (response) => {
                // Response opsiyonel, hata kontrolü yapma
                if (chrome.runtime.lastError) {
                    console.log('Content script not ready yet');
                }
            });
        }
    });
}

// Event listeners
addButton.addEventListener('click', addKeyword);

keywordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addKeyword();
    }
});

// Sayfa yüklendiğinde anahtar kelimeleri yükle
document.addEventListener('DOMContentLoaded', () => {
    loadKeywords();
    keywordInput.focus();
});
