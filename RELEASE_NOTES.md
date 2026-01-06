# LinkedIn Content Filter v1.0.0 🎉

## What's New

LinkedIn Content Filter helps you take control of your LinkedIn feed by filtering posts containing unwanted keywords.

### ✨ Features

#### 🎯 Keyword-Based Filtering
- Add unlimited custom keywords (minimum 3 characters)
- Real-time filtering as you scroll through your feed
- Posts are hidden automatically when they match your keywords

#### 📊 Smart Statistics
- **Per-keyword tracking**: See how many posts each keyword has filtered (blue badges)
- **Session counter**: Track posts filtered in current session
- **Lifetime total**: Total posts hidden across all browsing sessions (stored permanently)

#### 🎨 Native LinkedIn Integration
- Seamlessly integrated sidebar widget
- Matches LinkedIn's design language
- Sticky positioning - stays visible as you scroll
- Custom purple/pink theme (#B02A69)

#### ✅ Smart Validation
- Minimum 3-character requirement prevents accidental short keywords
- Duplicate detection with visual feedback
- Visual error messages (red border for too short, orange for duplicates)

### 🛠️ Technical Highlights

- **Manifest V3** - Latest Chrome extension standard
- **Persistent Storage** - Keywords and stats saved across sessions
- **Performance Optimized** - Debounced filtering for smooth scrolling
- **Turkish Character Support** - Proper locale-aware filtering
- **Bug-Free** - Fixed all infinite loop and sync issues

### 📦 Installation

1. Download `linkedin-content-filter-v1.0.0.zip` from releases
2. Extract the ZIP file to a folder
3. Open Chrome and go to `chrome://extensions/`
4. Enable **Developer mode** (top right toggle)
5. Click **Load unpacked**
6. Select the extracted folder
7. Visit LinkedIn and start filtering!

### 🚀 Usage

**Two ways to manage keywords:**

1. **Extension Popup** (click extension icon in toolbar)
2. **Sidebar Widget** (appears on LinkedIn feed pages)

**To add keywords:**
- Type keyword in the input field (min 3 characters)
- Click "Add" button or press Enter
- Watch the filtering happen in real-time!

**Statistics:**
- Blue badges next to keywords show filter count
- Bottom section shows session and lifetime totals

### 🐛 Bug Fixes

- ✅ Fixed infinite loop in MutationObserver
- ✅ Resolved widget list not loading on initial page load
- ✅ Fixed sticky positioning using LinkedIn's native container
- ✅ Improved keyword stats synchronization

### 📸 Screenshots

![Feed Cleaner Widget](promo_banner.png)

### 🤝 Contributing

Found a bug? Have a feature idea? Open an issue on GitHub!

### 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

**Enjoy a cleaner LinkedIn feed!** 🎊
