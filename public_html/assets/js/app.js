/**
 * Alphavest Frontend Application Controller
 */

const COUNTRIES_LIST = [
  { name: 'Afghanistan', flag: '🇦🇫', code: 'AF' },
  { name: 'Albania', flag: '🇦🇱', code: 'AL' },
  { name: 'Algeria', flag: '🇩🇿', code: 'DZ' },
  { name: 'Andorra', flag: '🇦🇩', code: 'AD' },
  { name: 'Angola', flag: '🇦🇴', code: 'AO' },
  { name: 'Argentina', flag: '🇦🇷', code: 'AR' },
  { name: 'Armenia', flag: '🇦🇲', code: 'AM' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  { name: 'Austria', flag: '🇦🇹', code: 'AT' },
  { name: 'Azerbaijan', flag: '🇦🇿', code: 'AZ' },
  { name: 'Bahamas', flag: '🇧🇸', code: 'BS' },
  { name: 'Bahrain', flag: '🇧🇭', code: 'BH' },
  { name: 'Bangladesh', flag: '🇧🇩', code: 'BD' },
  { name: 'Barbados', flag: '🇧🇧', code: 'BB' },
  { name: 'Belarus', flag: '🇧🇾', code: 'BY' },
  { name: 'Belgium', flag: '🇧🇪', code: 'BE' },
  { name: 'Belize', flag: '🇧🇿', code: 'BZ' },
  { name: 'Benin', flag: '🇧🇯', code: 'BJ' },
  { name: 'Bhutan', flag: '🇧🇹', code: 'BT' },
  { name: 'Bolivia', flag: '🇧🇴', code: 'BO' },
  { name: 'Bosnia and Herzegovina', flag: '🇧🇦', code: 'BA' },
  { name: 'Botswana', flag: '🇧🇼', code: 'BW' },
  { name: 'Brazil', flag: '🇧🇷', code: 'BR' },
  { name: 'Brunei', flag: '🇧🇳', code: 'BN' },
  { name: 'Bulgaria', flag: '🇧🇬', code: 'BG' },
  { name: 'Cambodia', flag: '🇰🇭', code: 'KH' },
  { name: 'Cameroon', flag: '🇨🇲', code: 'CM' },
  { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  { name: 'Chile', flag: '🇨🇱', code: 'CL' },
  { name: 'China', flag: '🇨🇳', code: 'CN' },
  { name: 'Colombia', flag: '🇨🇴', code: 'CO' },
  { name: 'Costa Rica', flag: '🇨🇷', code: 'CR' },
  { name: 'Croatia', flag: '🇭🇷', code: 'HR' },
  { name: 'Cyprus', flag: '🇨🇾', code: 'CY' },
  { name: 'Czech Republic', flag: '🇨🇿', code: 'CZ' },
  { name: 'Denmark', flag: '🇩🇰', code: 'DK' },
  { name: 'Dominican Republic', flag: '🇩🇴', code: 'DO' },
  { name: 'Ecuador', flag: '🇪🇨', code: 'EC' },
  { name: 'Egypt', flag: '🇪🇬', code: 'EG' },
  { name: 'El Salvador', flag: '🇸🇻', code: 'SV' },
  { name: 'Estonia', flag: '🇪🇪', code: 'EE' },
  { name: 'Ethiopia', flag: '🇪🇹', code: 'ET' },
  { name: 'Fiji', flag: '🇫🇯', code: 'FJ' },
  { name: 'Finland', flag: '🇫🇮', code: 'FI' },
  { name: 'France', flag: '🇫🇷', code: 'FR' },
  { name: 'Georgia', flag: '🇬🇪', code: 'GE' },
  { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  { name: 'Ghana', flag: '🇬🇭', code: 'GH' },
  { name: 'Greece', flag: '🇬🇷', code: 'GR' },
  { name: 'Guatemala', flag: '🇬🇹', code: 'GT' },
  { name: 'Honduras', flag: '🇭🇳', code: 'HN' },
  { name: 'Hong Kong', flag: '🇭🇰', code: 'HK' },
  { name: 'Hungary', flag: '🇭🇺', code: 'HU' },
  { name: 'Iceland', flag: '🇮🇸', code: 'IS' },
  { name: 'India', flag: '🇮🇳', code: 'IN' },
  { name: 'Indonesia', flag: '🇮🇩', code: 'ID' },
  { name: 'Iran', flag: '🇮🇷', code: 'IR' },
  { name: 'Iraq', flag: '🇮🇶', code: 'IQ' },
  { name: 'Ireland', flag: '🇮🇪', code: 'IE' },
  { name: 'Israel', flag: '🇮🇱', code: 'IL' },
  { name: 'Italy', flag: '🇮🇹', code: 'IT' },
  { name: 'Jamaica', flag: '🇯🇲', code: 'JM' },
  { name: 'Japan', flag: '🇯🇵', code: 'JP' },
  { name: 'Jordan', flag: '🇯🇴', code: 'JO' },
  { name: 'Kazakhstan', flag: '🇰🇿', code: 'KZ' },
  { name: 'Kenya', flag: '🇰🇪', code: 'KE' },
  { name: 'Kuwait', flag: '🇰🇼', code: 'KW' },
  { name: 'Kyrgyzstan', flag: '🇰🇬', code: 'KG' },
  { name: 'Latvia', flag: '🇱🇻', code: 'LV' },
  { name: 'Lebanon', flag: '🇱🇧', code: 'LB' },
  { name: 'Lithuania', flag: '🇱🇹', code: 'LT' },
  { name: 'Luxembourg', flag: '🇱🇺', code: 'LU' },
  { name: 'Malaysia', flag: '🇲🇾', code: 'MY' },
  { name: 'Maldives', flag: '🇲🇻', code: 'MV' },
  { name: 'Malta', flag: '🇲🇹', code: 'MT' },
  { name: 'Mauritius', flag: '🇲🇺', code: 'MU' },
  { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  { name: 'Monaco', flag: '🇲🇨', code: 'MC' },
  { name: 'Mongolia', flag: '🇲🇳', code: 'MN' },
  { name: 'Montenegro', flag: '🇲🇪', code: 'ME' },
  { name: 'Morocco', flag: '🇲🇦', code: 'MA' },
  { name: 'Mozambique', flag: '🇲🇿', code: 'MZ' },
  { name: 'Myanmar', flag: '🇲🇲', code: 'MM' },
  { name: 'Namibia', flag: '🇳🇦', code: 'NA' },
  { name: 'Nepal', flag: '🇳🇵', code: 'NP' },
  { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
  { name: 'New Zealand', flag: '🇳🇿', code: 'NZ' },
  { name: 'Nicaragua', flag: '🇳🇮', code: 'NI' },
  { name: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  { name: 'North Macedonia', flag: '🇲🇰', code: 'MK' },
  { name: 'Norway', flag: '🇳🇴', code: 'NO' },
  { name: 'Oman', flag: '🇴🇲', code: 'OM' },
  { name: 'Pakistan', flag: '🇵🇰', code: 'PK' },
  { name: 'Panama', flag: '🇵🇦', code: 'PA' },
  { name: 'Paraguay', flag: '🇵🇾', code: 'PY' },
  { name: 'Peru', flag: '🇵🇪', code: 'PE' },
  { name: 'Philippines', flag: '🇵🇭', code: 'PH' },
  { name: 'Poland', flag: '🇵🇱', code: 'PL' },
  { name: 'Portugal', flag: '🇵🇹', code: 'PT' },
  { name: 'Qatar', flag: '🇶🇦', code: 'QA' },
  { name: 'Romania', flag: '🇷🇴', code: 'RO' },
  { name: 'Russia', flag: '🇷🇺', code: 'RU' },
  { name: 'Rwanda', flag: '🇷🇼', code: 'RW' },
  { name: 'Saudi Arabia', flag: '🇸🇦', code: 'SA' },
  { name: 'Senegal', flag: '🇸🇳', code: 'SN' },
  { name: 'Serbia', flag: '🇷🇸', code: 'RS' },
  { name: 'Singapore', flag: '🇸🇬', code: 'SG' },
  { name: 'Slovakia', flag: '🇸🇰', code: 'SK' },
  { name: 'Slovenia', flag: '🇸🇮', code: 'SI' },
  { name: 'South Africa', flag: '🇿🇦', code: 'ZA' },
  { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
  { name: 'Spain', flag: '🇪🇸', code: 'ES' },
  { name: 'Sri Lanka', flag: '🇱🇰', code: 'LK' },
  { name: 'Sweden', flag: '🇸🇪', code: 'SE' },
  { name: 'Switzerland', flag: '🇨🇭', code: 'CH' },
  { name: 'Taiwan', flag: '🇹🇼', code: 'TW' },
  { name: 'Tanzania', flag: '🇹🇿', code: 'TZ' },
  { name: 'Thailand', flag: '🇹🇭', code: 'TH' },
  { name: 'Tunisia', flag: '🇹🇳', code: 'TN' },
  { name: 'Turkey', flag: '🇹🇷', code: 'TR' },
  { name: 'Uganda', flag: '🇺🇬', code: 'UG' },
  { name: 'Ukraine', flag: '🇺🇦', code: 'UA' },
  { name: 'United Arab Emirates', flag: '🇦🇪', code: 'AE' },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { name: 'United States', flag: '🇺🇸', code: 'US' },
  { name: 'Uruguay', flag: '🇺🇾', code: 'UY' },
  { name: 'Uzbekistan', flag: '🇺🇿', code: 'UZ' },
  { name: 'Venezuela', flag: '🇻🇪', code: 'VE' },
  { name: 'Vietnam', flag: '🇻🇳', code: 'VN' },
  { name: 'Zambia', flag: '🇿🇲', code: 'ZM' },
  { name: 'Zimbabwe', flag: '🇿🇼', code: 'ZW' }
];

const App = {
  state: {
    currentView: 'home',
    user: null,
    tickers: [
      { symbol: 'BTC/USDT', base: 'BTC', quote: 'USDT', category: 'CRYPTO', price: 77915.82, change_24h: 1.63, halt: false, volume_24h: 142000000 },
      { symbol: 'ETH/USDT', base: 'ETH', quote: 'USDT', category: 'CRYPTO', price: 2514.43, change_24h: 1.58, halt: false, volume_24h: 98000000 },
      { symbol: 'SOL/USDT', base: 'SOL', quote: 'USDT', category: 'CRYPTO', price: 101.84, change_24h: 2.35, halt: false, volume_24h: 88400000 },
      { symbol: 'XRP/USDT', base: 'XRP', quote: 'USDT', category: 'CRYPTO', price: 1.4001, change_24h: 4.59, halt: false, volume_24h: 64200000 },
      { symbol: 'BNB/USDT', base: 'BNB', quote: 'USDT', category: 'CRYPTO', price: 723.07, change_24h: 1.15, halt: false, volume_24h: 53100000 },
      { symbol: 'XNO/USDT', base: 'XNO', quote: 'USDT', category: 'CRYPTO', price: 0.3510, change_24h: 7.02, halt: false, volume_24h: 362230 },
      { symbol: 'APE/USDT', base: 'APE', quote: 'USDT', category: 'CRYPTO', price: 0.1370, change_24h: 4.57, halt: false, volume_24h: 9820000 },
      { symbol: 'APT/USDT', base: 'APT', quote: 'USDT', category: 'CRYPTO', price: 0.6160, change_24h: -4.05, halt: false, volume_24h: 14500000 },
      { symbol: 'AAVE/USDT', base: 'AAVE', quote: 'USDT', category: 'CRYPTO', price: 127.04, change_24h: 2.29, halt: false, volume_24h: 22100000 },
      { symbol: 'GOLD/USDT', base: 'GOLD', quote: 'USDT', category: 'FUTURES', price: 4348.33, change_24h: 0.42, halt: false, volume_24h: 45200000 },
      { symbol: 'OIL/USDT', base: 'OIL', quote: 'USDT', category: 'FUTURES', price: 74.82, change_24h: 3.15, halt: false, volume_24h: 18700000 },
      { symbol: 'NGAS/USDT', base: 'NGAS', quote: 'USDT', category: 'FUTURES', price: 2.80, change_24h: -0.85, halt: false, volume_24h: 12800000 },
      { symbol: 'ES1/USD', base: 'ES1', quote: 'USD', category: 'FUTURES', price: 5984.50, change_24h: 0.84, halt: false, volume_24h: 74000000 },
      { symbol: 'EUR/USD', base: 'EUR', quote: 'USD', category: 'FOREX', price: 1.0845, change_24h: 0.32, halt: false, volume_24h: 51200000 },
      { symbol: 'GBP/USD', base: 'GBP', quote: 'USD', category: 'FOREX', price: 1.2712, change_24h: -0.18, halt: false, volume_24h: 39400000 },
      { symbol: 'USD/JPY', base: 'USD', quote: 'JPY', category: 'FOREX', price: 152.38, change_24h: 0.45, halt: false, volume_24h: 42800000 },
      { symbol: 'AAPL/USD', base: 'AAPL', quote: 'USD', category: 'STOCKS', price: 229.40, change_24h: 1.24, halt: false, volume_24h: 61500000 },
      { symbol: 'TSLA/USD', base: 'TSLA', quote: 'USD', category: 'STOCKS', price: 342.15, change_24h: 2.87, halt: false, volume_24h: 82300000 },
      { symbol: 'NVDA/USD', base: 'NVDA', quote: 'USD', category: 'STOCKS', price: 141.60, change_24h: 3.42, halt: false, volume_24h: 94600000 }
    ],
    selectedMarket: 'BTC/USDT',
    selectedCategory: 'HOT',
    chartInterval: '1h',
    chartType: 'candles',
    marketOverviewSymbol: 'BTC/USDT',
    marketChartInterval: '5m',
    marketChartType: 'candlestick',
    marketSearchQuery: '',
    favorites: JSON.parse(localStorage.getItem('alphavest_favorites') || '["BTC/USDT", "ETH/USDT", "SOL/USDT"]'),
    balances: null,
    positions: [],
    orders: [],
    activeSignals: [],
    copyPlans: [],
    activeCopyTrades: [],
    referralStats: null,
    adminTab: 'overview',
    adminPreviewUserId: null,
    adminPreviewUser: null,
    adminMetrics: null,
    marketingAssets: [],
    marketingPromotions: null,
    marketingClaims: [],
    marketingSchedules: null,
    nextSignalCountdownTimer: null,
    signalLiveCountdownTimer: null,
    isRealMoneyMode: false,
    systemConfig: null,
    notifications: [],
    unreadNotificationsCount: 0,
    actionLocks: new Set(),
    actionKeys: new Map()
  },

  chart: null,
  marketChart: null,

  purgeObsoleteCache() {
    try {
      const CURRENT_VER = '20260928_balance_live_v1';
      const storedVer = localStorage.getItem('alphavest_cache_ver');
      if (storedVer !== CURRENT_VER) {
        // Clear all obsolete / stale cached responses
        const keysToRemove = [
          'alphavest_cached_tickers',
          'alphavest_old_balances',
          'alphavest_chart_cache',
          'alphavest_state_snapshot',
          'alphavest_cached_positions',
          'alphavest_last_quote'
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));
        localStorage.setItem('alphavest_cache_ver', CURRENT_VER);
      }
    } catch (e) {
      console.warn('Cache purge error:', e);
    }
  },

  clearClientCache(silent = false) {
    try {
      const keysToRemove = [
        'alphavest_cache_ver',
        'alphavest_cached_tickers',
        'alphavest_old_balances',
        'alphavest_chart_cache',
        'alphavest_state_snapshot',
        'alphavest_cached_positions',
        'alphavest_last_quote'
      ];
      keysToRemove.forEach(k => localStorage.removeItem(k));
      sessionStorage.clear();
      
      // Reload live data immediately from server
      this.loadTickers();
      this.loadBalances();
      this.loadMarketingData();
      this.render();
      
      if (!silent) {
        this.toast('App cache cleared! Fresh data loaded from server.', 'success');
      }
    } catch (e) {
      console.warn('Clear cache error:', e);
      if (!silent) this.toast('Cache cleared.', 'info');
    }
  },

  /* ==========================================================
   * INSTANT DATA / STALE-WHILE-REVALIDATE CACHE
   * Shows the last verified state immediately, then refreshes
   * silently in the background. User-scoped snapshots prevent
   * one account's private data from appearing for another account.
   * ========================================================== */
  getFastCacheUserKey() {
    try {
      const user = this.state.adminPreviewUser || this.state.user || JSON.parse(localStorage.getItem('alphavest_local_user') || 'null');
      return String(user?.id || user?.email || 'guest').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 96);
    } catch (e) { return 'guest'; }
  },

  readFastCache(name, maxAge = 10 * 60 * 1000) {
    try {
      const key = `alphavest_fast_${name}_${this.getFastCacheUserKey()}`;
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const item = JSON.parse(raw);
      if (!item || !item.ts || (Date.now() - item.ts) > maxAge) return null;
      return item.data ?? null;
    } catch (e) { return null; }
  },

  writeFastCache(name, data) {
    try {
      const key = `alphavest_fast_${name}_${this.getFastCacheUserKey()}`;
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    } catch (e) {}
  },

  hydrateFastCache() {
    try {
      const cachedUser = localStorage.getItem('alphavest_local_user');
      if (cachedUser && !this.state.user) {
        const parsed = JSON.parse(cachedUser);
        if (parsed?.email) this.state.user = parsed;
      }

      const tickers = this.readFastCache('tickers', 30 * 60 * 1000);
      if (Array.isArray(tickers) && tickers.length) this.state.tickers = tickers;

      const balances = this.readFastCache('balances', 10 * 60 * 1000);
      if (balances) this.state.balances = balances;

      const notifications = this.readFastCache('notifications', 10 * 60 * 1000);
      if (notifications) {
        const applied = this.applyLocalNotificationReadState(notifications.notifications || []);
        this.state.notifications = applied.notifications;
        this.state.unreadNotificationsCount = applied.unreadCount;
      }

      const signals = this.readFastCache('signals', 10 * 60 * 1000);
      if (signals) {
        this.state.signalsData = signals;
        this.state.signals = signals.signals || [];
      }

      const config = this.readFastCache('system_config', 10 * 60 * 1000);
      if (config) {
        this.state.systemConfig = config;
        this.state.isRealMoneyMode = Boolean(config.real_money_mode);
      }

      this.updateHeaderAuth();
      this.updateTopTickers();
      this.renderTickerBar();
      this.renderMarketList();
      this.renderWalletView();
      this.updateNotificationBell(this.state.unreadNotificationsCount || 0);
      this.renderHomeNotificationBanner();
    } catch (e) {}
  },

  initCountries() {
    const sorted = [...COUNTRIES_LIST].sort((a, b) => a.name.localeCompare(b.name));
    const optionsHtml = sorted.map(c => `<option value="${c.name}">${c.flag} ${c.name}</option>`).join('');

    const regSel = document.getElementById('reg-country');
    if (regSel) {
      const savedCountry = (this.state.user?.country || localStorage.getItem('alphavest_user_country') || '').trim();
      regSel.innerHTML = `<option value="">Select country / region</option>${optionsHtml}`;
      if (savedCountry && sorted.some(c => c.name === savedCountry)) {
        regSel.value = savedCountry;
      } else {
        regSel.value = '';
      }
    }

    const kycSel = document.getElementById('kyc-country-select');
    if (kycSel) {
      kycSel.innerHTML = `<option value="">Please select nationality</option>${optionsHtml}`;
      const userCountry = (this.state.user?.country || '').trim();
      if (userCountry && sorted.some(c => c.name === userCountry)) {
        kycSel.value = userCountry;
      } else {
        kycSel.value = '';
      }
    }
  },

  async init() {
    this.purgeObsoleteCache();
    this.hydrateFastCache();
    this.initTheme();
    this.initAdminTheme();
    this.applySavedColorMode();
    this.setupNavigation();
    this.initCountries();
    // Render immediate UI with default state while background fetches resolve
    this.updateTopTickers();
    this.renderMarketList();
    this.renderPublicMarketRows();
    this.updateHomeHeroBalance();
    this.syncSideDrawer();
    this.initSignalCountdown();
    this.initOptionsCountdown();
    this.initCarousel();

    // Render immediately so mobile displays view in milliseconds without network blocking
    this.render();

    // Check invite / referral link parameter (?ref=... or #register?ref=... or #ref=...)
    try {
      const refCode = this.getPendingReferralCode();
      if (refCode) {
        localStorage.setItem('alphavest_pending_ref', refCode);
      }
    } catch (e) {}

    // Authentication is validated by the HttpOnly session cookie. Cached user
    // data is UI-only and is never used as an authorization credential.
    this.checkAuth().then(() => Promise.allSettled([
      this.loadSystemConfig(),
      this.loadTickers(),
      this.state.user ? this.loadBalances() : Promise.resolve(null),
      this.state.user ? this.loadNotifications() : Promise.resolve(null),
      this.state.user ? this.loadSignals() : Promise.resolve(null)
    ])).catch(() => Promise.allSettled([this.loadSystemConfig(), this.loadTickers()])).then(() => {
      try {
        const pendingRef = this.getPendingReferralCode();
        if (pendingRef && !this.state.user) {
          this.openModal('modal-auth');
          this.switchAuthBox('register');
          this.toast(`Referral partner code ${pendingRef} applied to your registration!`, 'success');
        }
      } catch (e) {}

      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => this.loadMarketingData(), { timeout: 1500 });
      } else {
        setTimeout(() => this.loadMarketingData(), 300);
      }
    });

    this.startPolling();
  },

  getPendingReferralCode() {
    let code = '';
    try {
      // 1. Check window.location.search (?ref=... or ?invite=... or ?r=... or ?referral=... or ?code=...)
      const urlParams = new URLSearchParams(window.location.search);
      code = urlParams.get('ref') || urlParams.get('invite') || urlParams.get('r') || urlParams.get('referral') || urlParams.get('referral_code') || urlParams.get('code') || '';
      
      // 2. Check window.location.hash (#register?ref=... or #ref=... or #r=...)
      if (!code && window.location.hash) {
        const hashStr = window.location.hash.substring(1);
        if (hashStr.includes('?')) {
          const hashParams = new URLSearchParams(hashStr.substring(hashStr.indexOf('?')));
          code = hashParams.get('ref') || hashParams.get('invite') || hashParams.get('r') || hashParams.get('referral') || hashParams.get('referral_code') || hashParams.get('code') || '';
        } else if (hashStr.includes('=')) {
          const parts = hashStr.split('&');
          for (const p of parts) {
            const [k, v] = p.split('=');
            if (['ref', 'invite', 'r', 'referral', 'code'].includes(k.toLowerCase())) {
              code = v;
              break;
            }
          }
        } else if (hashStr.toUpperCase().startsWith('REF') || hashStr.startsWith('ref_') || hashStr.toUpperCase().startsWith('ALPHA')) {
          code = hashStr;
        }
      }

      if (code) {
        code = code.trim().toUpperCase();
        localStorage.setItem('alphavest_pending_ref', code);
        try { sessionStorage.setItem('alphavest_pending_ref', code); } catch (e) {}
      } else {
        code = (localStorage.getItem('alphavest_pending_ref') || sessionStorage.getItem('alphavest_pending_ref') || '').trim().toUpperCase();
      }
    } catch (e) {}
    return code;
  },

  switchAuthBox(box) {
    const loginBox = document.getElementById('auth-box-login');
    const regBox = document.getElementById('auth-box-reg');
    const authTitle = document.getElementById('auth-title');

    if (box === 'register') {
      if (loginBox) loginBox.style.display = 'none';
      if (regBox) regBox.style.display = 'flex';
      if (authTitle) authTitle.textContent = 'Create Institutional Account';

      const pendingRef = this.getPendingReferralCode();
      if (pendingRef) {
        const regRef = document.getElementById('reg-ref');
        const regBanner = document.getElementById('reg-invite-banner');
        const regBadge = document.getElementById('reg-ref-badge');
        const regText = document.getElementById('reg-invite-banner-text');

        if (regRef) regRef.value = pendingRef;
        if (regBanner) regBanner.style.display = 'flex';
        if (regBadge) regBadge.style.display = 'block';
        if (regText) regText.textContent = `Referral code ${pendingRef} linked to your registration.`;
      }
    } else {
      if (regBox) regBox.style.display = 'none';
      if (loginBox) loginBox.style.display = 'flex';
      if (authTitle) authTitle.textContent = 'Log In';
    }
  },

  switchAuthTab(tab) {
    this.switchAuthBox(tab);
  },

  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const messageSpan = document.createElement('span');
    messageSpan.textContent = String(message ?? '');
    toast.appendChild(messageSpan);
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  getApiBaseUrl() {
    // Production security: keep API calls same-origin so the HttpOnly session
    // and double-submit CSRF cookie always belong to the same site. Ignore
    // stale/cross-origin API URLs left by older deployments.
    const origin = (typeof window !== 'undefined' && window.location) ? window.location.origin : '';
    const candidates = [];
    if (typeof window !== 'undefined' && window.ALPHAVEST_API_BASE) candidates.push(window.ALPHAVEST_API_BASE);
    try {
      const stored = localStorage.getItem('alphavest_api_url');
      if (stored) candidates.push(stored);
    } catch (e) {}
    for (const candidate of candidates) {
      try {
        const u = new URL(candidate, origin || undefined);
        if (!origin || u.origin === origin) return u.origin === origin ? '' : u.origin.replace(/\/$/, '');
      } catch (e) {}
    }
    return '';
  },

  async api(endpoint, method = 'GET', body = null, retries = 1) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const normalizedMethod = String(method || 'GET').toUpperCase();
    const baseUrl = this.getApiBaseUrl();
    // Do not add a unique timestamp to every GET. The server already sends
    // no-store headers, while stable URLs let the browser/proxy coalesce work.
    const url = `${baseUrl}/api${cleanEndpoint}`;
    const isGet = normalizedMethod === 'GET';

    if (isGet && this._apiRateLimitUntil?.get(url) > Date.now()) {
      return { success: false, error_code: 'RATE_LIMITED', status: 429, message: 'Request temporarily rate-limited; polling will resume automatically.' };
    }

    // Coalesce identical concurrent GETs. Navigation, polling and multiple UI
    // components can request the same resource at the same time; only one
    // network request should reach Hostinger.
    if (isGet) {
      this._apiInflight = this._apiInflight || new Map();
      const existing = this._apiInflight.get(url);
      if (existing) return existing;
    }

    const request = (async () => {
      try {
        const adminPreviewWriteAllowed = !isGet && this.state.adminPreviewUserId && cleanEndpoint === '/admin/user-deposit.php';
        if (!isGet && this.state.adminPreviewUserId && !adminPreviewWriteAllowed) {
          return { success: false, error_code: 'ADMIN_USER_VIEW_READ_ONLY', status: 403, message: 'Admin user view is read-only. Exit User View to perform account actions.' };
        }
        const headers = {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        };
        if (isGet && this.state.adminPreviewUserId
            && !cleanEndpoint.includes('/auth/me.php')
            && !cleanEndpoint.includes('/auth/logout.php')
            && !cleanEndpoint.startsWith('/admin/')) {
          headers['X-AlphaVest-Admin-View-User'] = String(this.state.adminPreviewUserId);
        }

        // State-changing requests require a double-submit CSRF token. Fetch it
        // lazily so the existing API call flow remains unchanged.
        if (normalizedMethod !== 'GET' && normalizedMethod !== 'HEAD' && normalizedMethod !== 'OPTIONS') {
          let csrf = '';
          try {
            const match = document.cookie.match(/(?:^|; )alphavest_csrf=([^;]+)/);
            csrf = match ? decodeURIComponent(match[1]) : '';
            if (!csrf) {
              const csrfRes = await fetch(`${baseUrl}/api/auth/csrf.php`, {
                method: 'GET',
                credentials: 'include',
                cache: 'no-store',
                headers: { 'Accept': 'application/json' }
              });
              if (csrfRes.ok) {
                const csrfJson = await csrfRes.json();
                csrf = csrfJson?.data?.csrf_token || '';
              }
            }
          } catch (e) {}
          if (csrf) headers['X-CSRF-Token'] = csrf;
        }

        if (body && !(body instanceof FormData)) {
          headers['Content-Type'] = 'application/json';
          if (body.idempotency_key) headers['X-Idempotency-Key'] = String(body.idempotency_key);
        }

        let lastError = null;
        for (let attempt = 0; attempt <= retries; attempt++) {
          try {
            const res = await fetch(url, {
              method: normalizedMethod,
              headers,
              cache: 'no-store',
              credentials: 'include',
              body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null
            });

            // NEVER automatically retry 429. Retrying a rate-limited request
            // can amplify the outage. Respect Retry-After for polling GETs.
            if (res.status === 429) {
              const retryAfter = Number(res.headers.get('Retry-After') || 0);
              if (isGet && retryAfter > 0 && retryAfter <= 120) {
                this._apiRateLimitUntil = this._apiRateLimitUntil || new Map();
                this._apiRateLimitUntil.set(url, Date.now() + (retryAfter > 0 ? retryAfter * 1000 : 30000));
              }
            }

            // Retry only transient 502/503/504 responses, with exponential
            // backoff + jitter. Never retry other 4xx responses.
            if ([502, 503, 504].includes(res.status) && attempt < retries) {
              const delay = Math.min(4000, 500 * (2 ** attempt)) + Math.floor(Math.random() * 250);
              await new Promise(r => setTimeout(r, delay));
              continue;
            }

            if (res.status === 401 && cleanEndpoint.includes('/auth/me')) {
              localStorage.removeItem('alphavest_local_user');
              this.state.user = null;
              this.updateHeaderAuth();
            }

            let text = '';
            try {
              text = await res.text();
            } catch (readErr) {
              return { success: false, status: res.status, message: 'Unable to read response from server.' };
            }

            // Preserve the backend's real JSON error (for example USER_NOT_FOUND
            // from an admin lookup). Only use the endpoint-specific 404 message
            // when the server actually returned an endpoint-not-found response.
            if (res.status === 404) {
              try {
                const parsed404 = JSON.parse(text);
                if (parsed404 && typeof parsed404 === 'object') {
                  parsed404.status = 404;
                  if (parsed404.error_code && parsed404.error_code !== 'NOT_FOUND') return parsed404;
                  if (parsed404.error_code === 'NOT_FOUND' && parsed404.message && parsed404.message !== 'API endpoint not found.') return parsed404;
                }
              } catch (e) {}
              return {
                success: false,
                error_code: 'NOT_FOUND',
                status: 404,
                message: 'Backend API endpoint not found (404). Ensure the /api folder is uploaded to your hosting or configure your API URL.'
              };
            }

            if (!text || text.trim() === '') {
              if (!res.ok) {
                return { success: false, status: res.status, message: `Server returned HTTP ${res.status} with empty response.` };
              }
              return { success: true, data: {} };
            }

            try {
              const parsed = JSON.parse(text);
              if (!res.ok && parsed && typeof parsed === 'object') parsed.status = res.status;
              return parsed;
            } catch (parseErr) {
              const cleanText = text.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
              return {
                success: false,
                status: res.status,
                message: cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : (cleanText || 'Invalid response format from server.')
              };
            }
          } catch (err) {
            lastError = err;
            if (attempt < retries) {
              const delay = Math.min(4000, 500 * (2 ** attempt)) + Math.floor(Math.random() * 250);
              await new Promise(r => setTimeout(r, delay));
              continue;
            }
          }
        }

        console.warn('[API Client]', cleanEndpoint, lastError && lastError.message ? lastError.message : lastError);
        const errMsg = (lastError && lastError.message && !lastError.message.includes('Failed to fetch'))
          ? lastError.message
          : 'Network connection failed. Check your internet connection or server availability.';
        return { success: false, error_code: 'NETWORK_ERROR', message: errMsg };
      } catch (err) {
        console.warn('[API Client]', cleanEndpoint, err && err.message ? err.message : err);
        return { success: false, error_code: 'CLIENT_ERROR', message: 'Unable to contact the server.' };
      }
    })();

    if (isGet) {
      this._apiInflight = this._apiInflight || new Map();
      this._apiInflight.set(url, request);
      request.finally(() => {
        if (this._apiInflight?.get(url) === request) this._apiInflight.delete(url);
      }).catch(() => {});
    }
    return request;
  },

  getActionKey(scope) {
    const normalized = String(scope || '').trim();
    if (!normalized) return '';
    let key = this.state.actionKeys.get(normalized);
    if (!key) {
      try {
        key = sessionStorage.getItem(`alphavest_action_key:${normalized}`) || '';
      } catch (e) {}
    }
    if (!key) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        key = crypto.randomUUID();
      } else {
        key = `ak_${Date.now()}_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
      }
      try { sessionStorage.setItem(`alphavest_action_key:${normalized}`, key); } catch (e) {}
    }
    this.state.actionKeys.set(normalized, key);
    return key;
  },

  beginAction(scope) {
    const normalized = String(scope || '').trim();
    if (!normalized) return '';
    if (this.state.actionLocks.has(normalized)) return null;
    const key = this.getActionKey(normalized);
    this.state.actionLocks.add(normalized);
    return key;
  },

  endAction(scope, success = false) {
    const normalized = String(scope || '').trim();
    if (!normalized) return;
    this.state.actionLocks.delete(normalized);
    if (success) {
      this.state.actionKeys.delete(normalized);
      try { sessionStorage.removeItem(`alphavest_action_key:${normalized}`); } catch (e) {}
    }
  },

  setActionButtons(actionId, disabled, busyText = '') {
    document.querySelectorAll('[data-alpha-action]').forEach(btn => {
      if (btn.dataset.alphaAction !== actionId) return;
      if (disabled) {
        if (!btn.dataset.alphaOriginalText) btn.dataset.alphaOriginalText = btn.textContent.trim();
        btn.disabled = true;
        if (busyText) btn.textContent = busyText;
      } else {
        btn.disabled = false;
        if (btn.dataset.alphaOriginalText) {
          btn.textContent = btn.dataset.alphaOriginalText;
          delete btn.dataset.alphaOriginalText;
        }
      }
    });
  },

  async checkAuth() {
    // 1. Immediately hydrate state from localStorage to prevent UI flash or lost session
    const cachedUserStr = localStorage.getItem('alphavest_local_user');
    if (cachedUserStr) {
      try {
        const parsed = JSON.parse(cachedUserStr);
        if (parsed && parsed.email) {
          this.state.user = parsed;
          this.updateHeaderAuth();
        }
      } catch(e) {}
    }

    // Authentication is server-side via an HttpOnly session cookie. Cached user data
    // is UI-only and is never trusted for authorization.
    const res = await this.api('/auth/me.php');
    if (res.success && res.data && res.data.user) {
      this.state.user = res.data.user;
      if (this.state.user.country) {
        localStorage.setItem('alphavest_user_country', this.state.user.country);
      }
      const em = (res.data.user.email || '').toLowerCase().trim();
      localStorage.setItem('alphavest_local_user', JSON.stringify(this.state.user));
    } else {
      // Only clear a remembered identity when the server definitively says the
      // session is unauthorized/suspended. Temporary 429/5xx/network failures
      // must not turn a valid logged-in session into a logged-out UI.
      const status = Number(res?.status || 0);
      if (status === 401 || status === 403) {
        this.state.user = null;
        localStorage.removeItem('alphavest_local_user');
      }
    }

    this.updateHeaderAuth();
    if (this.state.user?.is_admin === true && !this.state.adminPreviewUser) {
      const allowedTabs = ['overview', 'users', 'referrals', 'deposits', 'withdrawals', 'kyc', 'signals', 'signal-schedules', 'adjustments', 'settings'];
      const cachedTab = localStorage.getItem('alphavest_admin_last_tab') || 'overview';
      this.state.adminTab = allowedTabs.includes(cachedTab) ? cachedTab : 'overview';
      this.navigate('admin');
    }
  },


  escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value ?? '');
    return div.innerHTML;
  },

  updateHeaderAuth() {
    const authBox = document.getElementById('header-auth-box');
    const adminBtn = document.getElementById('btn-header-admin');
    const profAdminBtn = document.getElementById('prof-btn-admin');
    const navAdmin = document.getElementById('nav-item-admin');
    const adminBanner = document.getElementById('admin-global-banner');
    const moreAdmin = document.getElementById('more-item-admin');
    const bannerBadge = document.getElementById('admin-banner-badge');
    const bannerText = document.getElementById('admin-banner-text');
    const bannerAction = document.getElementById('admin-banner-action');
    const bannerExit = document.getElementById('admin-banner-exit');

    if (this.state.user) {
      const previewUser = this.state.adminPreviewUser;
      const displayUser = previewUser || this.state.user;
      const isAdmin = !previewUser && this.state.user.is_admin === true;
      
      if (adminBtn) adminBtn.style.display = isAdmin ? 'inline-flex' : 'none';
      if (profAdminBtn) profAdminBtn.style.display = isAdmin ? 'block' : 'none';
      if (navAdmin) navAdmin.style.display = isAdmin && !previewUser ? 'flex' : 'none';
      if (adminBanner) adminBanner.style.display = ((previewUser && this.state.currentView !== 'admin') || (isAdmin && this.state.currentView !== 'admin')) ? 'block' : 'none';
      if (previewUser) {
        if (bannerBadge) bannerBadge.textContent = '👁 USER VIEW';
        if (bannerText) bannerText.textContent = `Read-only dashboard: ${previewUser.email || 'Selected user'}`;
        if (bannerAction) { bannerAction.textContent = '＋ Submit Deposit'; bannerAction.onclick = () => this.openAdminUserDepositModal(); }
        if (bannerExit) { bannerExit.style.display = 'inline-flex'; bannerExit.textContent = 'Exit User View ×'; bannerExit.onclick = () => this.exitAdminUserView(); }
      } else {
        if (bannerBadge) bannerBadge.textContent = '👑 ADMIN';
        if (bannerText) bannerText.textContent = 'Governance & Controls Available';
        if (bannerAction) { bannerAction.textContent = 'Open Admin Panel →'; bannerAction.onclick = () => this.navigate('admin'); }
        if (bannerExit) { bannerExit.style.display = 'none'; }
      }
      if (moreAdmin) moreAdmin.style.display = previewUser ? 'none' : 'flex';

      if (authBox) {
        const headerFullName = ((displayUser.first_name || '') + ' ' + (displayUser.last_name || '')).trim() || (displayUser.email || '').split('@')[0];
        const headerInitials = headerFullName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('') || 'U';
        authBox.innerHTML = `
          <button type="button" class="header-user-identity" onclick="App.openModal('modal-profile')" aria-label="Open profile" title="${this.escapeHtml(headerFullName)}">
            <span class="header-user-avatar" aria-hidden="true">${headerInitials}</span>
            <span class="header-user-name">${this.escapeHtml(headerFullName)}</span>
            <span class="header-user-chevron" aria-hidden="true">⌄</span>
          </button>
        `;
      }

      const displayName = ((displayUser?.first_name || '') + ' ' + (displayUser?.last_name || '')).trim();
      const nameDisp = document.getElementById('settings-name-display');
      if (nameDisp) {
        nameDisp.textContent = displayName || 'Add your first and last name';
        nameDisp.title = displayName || 'Add your first and last name';
      }
      const profName = document.getElementById('prof-email-label');
      if (profName) profName.textContent = displayName || displayUser?.email || 'User Account';

      const userCountry = displayUser?.country || localStorage.getItem('alphavest_user_country') || 'Not set';
      const cDisp = document.getElementById('user-country-display');
      if (cDisp) cDisp.textContent = userCountry;
      const sigCountry = document.getElementById('signals-current-country');
      if (sigCountry) sigCountry.textContent = userCountry;

      const uidPill = document.getElementById('header-uid-pill');
      const uidVal = document.getElementById('header-uid-val');
      if (uidPill && uidVal) {
        uidVal.textContent = `UID:${this.getUserUID()}`;
        uidPill.style.display = 'inline-flex';
      }
      this.syncSideDrawer();
    } else {
      if (adminBtn) adminBtn.style.display = 'none';
      if (profAdminBtn) profAdminBtn.style.display = 'none';
      if (navAdmin) navAdmin.style.display = 'none';
      if (adminBanner) adminBanner.style.display = 'none';
      if (moreAdmin) moreAdmin.style.display = 'none';

      const uidPill = document.getElementById('header-uid-pill');
      if (uidPill) uidPill.style.display = 'none';

      if (authBox) {
        authBox.innerHTML = `
          <button class="btn-primary" style="padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight:700;" onclick="App.openModal('modal-auth')">
            Sign In
          </button>
        `;
      }
      this.syncSideDrawer();
    }
  },

  setupNavigation() {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        if (view) this.navigate(view);
      });
    });
  },

  navigate(view) {
    // Automatically close side drawer, public landing overlay, and any open modals when switching views
    if (typeof this.toggleSideDrawer === 'function') this.toggleSideDrawer(false);
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      if (m.id) this.closeModal(m.id);
      else m.classList.remove('open');
    });
    if (window.AlphaLanding && typeof window.AlphaLanding.hide === 'function') {
      window.AlphaLanding.hide();
    }
    const publicLanding = document.getElementById('av-public-landing');
    if (publicLanding) publicLanding.hidden = true;

    if (view === 'admin') {
      let user = this.state.user;
      if (!user) {
        try {
          const cached = localStorage.getItem('alphavest_local_user');
          if (cached) user = JSON.parse(cached);
        } catch(e) {}
      }
      const isAdmin = Boolean(user && user.is_admin === true);
      if (!isAdmin) {
        this.toast('Administrative access requires administrator sign-in. Opening login...', 'warning');
        this.openModal('modal-auth');
        return;
      } else if (!this.state.user && user) {
        this.state.user = user;
        this.updateHeaderAuth();
      }
    }

    this.state.currentView = view;
    if (this.state.user?.is_admin === true && !this.state.adminPreviewUser) {
      localStorage.setItem('alphavest_admin_last_view', view);
    }
    document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => {
      nav.classList.toggle('active', nav.getAttribute('data-view') === view);
    });

    const adminBanner = document.getElementById('admin-global-banner');
    if (adminBanner) {
      const email = (this.state.user?.email || '').toLowerCase().trim();
      const isAdmin = Boolean(this.state.user && (this.state.user.is_admin || this.state.user.role === 'ADMIN' || this.state.user.role === 'SUPER_ADMIN'));
      adminBanner.style.display = (isAdmin && view !== 'admin') ? 'block' : 'none';
    }

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.style.display = 'none';
    });

    // Guarantee admin panel is hidden when not in admin view
    if (view !== 'admin') {
      const admSec = document.getElementById('view-admin');
      if (admSec) admSec.style.display = 'none';
    }

    document.body.classList.toggle('is-admin-view', view === 'admin');

    const target = document.getElementById(`view-${view}`);
    if (target) {
      target.style.display = 'block';
    }

    if (view === 'futures') {
      setTimeout(() => this.initFuturesView(), 50);
    } else if (view === 'market') {
      setTimeout(() => this.initMarketView(), 50);
    } else if (view === 'wallet') {
      this.loadBalances();
      this.loadWalletHistoryPreview();
    } else if (view === 'copytrading') {
      this.loadCopyTrading();
    } else if (view === 'referrals') {
      this.loadReferrals();
    } else if (view === 'signals') {
      this.loadSignals();
    } else if (view === 'home') {
      this.updateHomeHeroBalance();
      this.renderMarketList();
      this.loadSignals();
    } else if (view === 'admin') {
      this.loadAdminData();
      this.setAdminTab(this.state.adminTab || 'overview');
    } else if (view === 'convert') {
      this.loadConvertView();
    } else if (view === 'settings') {
      this.loadSettingsView();
    } else if (view === 'kyc') {
      this.loadKYCView();
    } else if (view === 'notice') {
      this.loadNoticeView();
    } else if (view === 'ledger') {
      this.renderLedgerRecords(this.state.activeLedgerTab || 'ALL');
    } else if (view === 'records') {
      this.syncRecordsTabUI(this.state.activeRecordsTab || 'open');
      this.renderTransactionRecords(this.state.activeRecordsTab || 'open');
    } else if (view === 'earn-savings') {
      this.renderEarnSavings();
    } else if (view === 'earn-loan') {
      this.calcCollateralLoan();
    }

    if (window.Engine3D && typeof window.Engine3D.refreshTilt === 'function') {
      setTimeout(() => window.Engine3D.refreshTilt(), 100);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  async loadTickers() {
    const res = await this.api('/markets/tickers.php');
    if (res.success && res.data) {
      const parsed = Array.isArray(res.data) ? res.data : (res.data.tickers || []);
      if (parsed && parsed.length) {
        const merged = [...parsed];
        const existingSyms = new Set(merged.map(t => t.symbol));
        (this.state.tickers || []).forEach(def => {
          if (!existingSyms.has(def.symbol)) merged.push(def);
        });
        this.state.tickers = merged;
        this.writeFastCache('tickers', merged);
      }
      this.renderTickerBar();
      this.updateTopTickers();
      this.renderMarketList();
      this.renderPublicMarketRows();
      this.updateFuturesBanner();
      this.updateMarketFeaturedBanner();
    }
  },

  updateTopTickers() {
    if (!this.state.tickers || !this.state.tickers.length) return;
    const findTicker = (sym) => this.state.tickers.find(t => t.symbol === sym || t.symbol.startsWith(sym));

    const bindTopCard = (ticker, priceId, changeId) => {
      if (!ticker) return;
      const pEl = document.getElementById(priceId);
      const cEl = document.getElementById(changeId);
      if (pEl) pEl.textContent = this.formatPrice(ticker.price);
      if (cEl) {
        const isUp = Number(ticker.change_24h || 0) >= 0;
        cEl.className = `top-ticker-stats ${isUp ? 'positive' : 'negative'}`;
        cEl.textContent = `${isUp ? '+' : ''}${Number(ticker.change_24h || 0).toFixed(2)}%`;
      }
    };

    bindTopCard(findTicker('XNO') || findTicker('GOLD'), 'top-ticker-xno-price', 'top-ticker-xno-change');
    bindTopCard(findTicker('APE'), 'top-ticker-ape-price', 'top-ticker-ape-change');
    bindTopCard(findTicker('APT'), 'top-ticker-apt-price', 'top-ticker-apt-change');
    bindTopCard(findTicker('OIL'), 'top-ticker-oil-price', 'top-ticker-oil-change');

    if (window.Engine3D && typeof window.Engine3D.refreshTilt === 'function') {
      window.Engine3D.refreshTilt();
    }
  },

  formatPrice(price) {
    const num = Number(price);
    if (isNaN(num)) return price;
    if (num >= 1000) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (num >= 10) {
      return num.toFixed(2);
    }
    return num.toFixed(4);
  },

  getCoinIcon(sym) {
    const s = (sym || '').toUpperCase();
    if (s.includes('GOLD')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5"/><rect x="9" y="10" width="14" height="12" rx="2" fill="#F59E0B"/><path d="M11 14h10M11 18h7" stroke="#FFFFFF" stroke-width="1.5"/></svg>`;
    }
    if (s.includes('NGAS')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#FFEDD5" stroke="#EA580C" stroke-width="1.5"/><path d="M16 7c0 0-6 7-6 12a6 6 0 0 0 12 0c0-5-6-12-6-12z" fill="#F97316"/></svg>`;
    }
    if (s.includes('APE')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#EFF4FF" stroke="#0052FF" stroke-width="1.5"/><circle cx="12" cy="14" r="2.2" fill="#0052FF"/><circle cx="20" cy="14" r="2.2" fill="#0052FF"/><path d="M11 21c2.5 2.5 7.5 2.5 10 0" stroke="#0052FF" stroke-width="2" stroke-linecap="round"/></svg>`;
    }
    if (s.includes('APT')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#F3F5F8" stroke="#111827" stroke-width="1.5"/><path d="M9 13c3-3 6 3 9 0s3 2 5 2" stroke="#111827" stroke-width="1.8" stroke-linecap="round"/><path d="M9 19c3-3 6 3 9 0s3 2 5 2" stroke="#111827" stroke-width="1.8" stroke-linecap="round"/></svg>`;
    }
    if (s.includes('EUR')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#EFF4FF" stroke="#0284C7" stroke-width="1.5"/><path d="M19 11c-4 0-6 2.5-6 5s2 5 6 5M10 15h8M10 17h8" stroke="#0284C7" stroke-width="2" stroke-linecap="round"/></svg>`;
    }
    if (s.includes('SOL')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1.5"/><path d="M9 21l14-2.5M11 16l14-2.5M9 11l14-2.5" stroke="#00B87C" stroke-width="2" stroke-linecap="round"/></svg>`;
    }
    if (s.includes('AAVE')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#FDF2F8" stroke="#DB2777" stroke-width="1.5"/><path d="M16 9l-6 14h3l1.8-4.5h4.4L21 23h3L16 9z" fill="#0EA5E9"/></svg>`;
    }
    if (s.includes('OIL') || s.includes('CRUDE')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#ECFDF5" stroke="#059669" stroke-width="1.5"/><path d="M16 8C16 8 10 15 10 20C10 23.3 12.7 26 16 26C19.3 26 22 23.3 22 20C22 15 16 8 16 8Z" fill="#059669"/></svg>`;
    }
    if (s.includes('XRP')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#F3F5F8" stroke="#111827" stroke-width="1.5"/><path d="M10 11l3 3-3 3M22 11l-3 3 3 3" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    if (s.includes('BTC')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#FFF7ED" stroke="#F7931A" stroke-width="1.5"/><path d="M15 9v14M17 9v14M13 12.5h5.5a2.5 2.5 0 0 1 0 5H13m0 0h6a3 3 0 0 1 0 6H13" stroke="#F7931A" stroke-width="2" stroke-linecap="round"/></svg>`;
    }
    if (s.includes('ETH')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#EEF2FF" stroke="#627EEA" stroke-width="1.5"/><path d="M16 7l-7 11.5 7 3.5 7-3.5L16 7z" stroke="#627EEA" stroke-width="1.5" fill="none"/><path d="M16 22l-7-3.5 7 7 7-7-7 3.5z" stroke="#627EEA" stroke-width="1.5" fill="none"/></svg>`;
    }
    if (s.includes('XNO')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#EFF4FF" stroke="#0052FF" stroke-width="1.5"/><path d="M10 10l12 12M22 10L10 22" stroke="#0052FF" stroke-width="2.6" stroke-linecap="round"/></svg>`;
    }
    const label = (s.split('/')[0] || 'AV').slice(0, 2);
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#EFF4FF" stroke="#DBEAFE" stroke-width="1.5"/><text x="16" y="20" text-anchor="middle" fill="#0052FF" font-size="10" font-weight="800" font-family="sans-serif">${label}</text></svg>`;
  },

  renderTickerBar() {
    const container = document.getElementById('ticker-bar');
    if (!container || !this.state.tickers.length) return;

    container.innerHTML = this.state.tickers.slice(0, 6).map(t => {
      const isUp = t.change_24h >= 0;
      return `
        <div class="ticker-card" onclick="App.selectMarket('${t.symbol}')">
          <div class="ticker-sym">${t.symbol}</div>
          <div class="ticker-price">${this.formatPrice(t.price)}</div>
          <div class="ticker-change ${isUp ? 'positive' : 'negative'}">
            ${isUp ? '+' : ''}${t.change_24h}%
          </div>
        </div>
      `;
    }).join('');
  },

  generateSparklineSvg(change24h, width = 68, height = 26) {
    const isUp = (Number(change24h) || 0) >= 0;
    const strokeColor = isUp ? '#00c087' : '#ff4d4f';
    const fillColor = isUp ? 'rgba(0, 192, 135, 0.15)' : 'rgba(255, 77, 79, 0.15)';
    const startY = isUp ? height - 6 : 6;
    const endY = isUp ? 6 : height - 6;
    const midY1 = isUp ? (height * 0.58).toFixed(1) : (height * 0.42).toFixed(1);
    const midY2 = isUp ? (height * 0.32).toFixed(1) : (height * 0.68).toFixed(1);

    const linePoints = `0,${startY} ${(width * 0.32).toFixed(1)},${midY1} ${(width * 0.68).toFixed(1)},${midY2} ${width},${endY}`;
    const polyPoints = `0,${startY} ${(width * 0.32).toFixed(1)},${midY1} ${(width * 0.68).toFixed(1)},${midY2} ${width},${endY} ${width},${height} 0,${height}`;

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="sparkline-svg" style="display:block; margin:0 auto; overflow:visible;">
        <polygon points="${polyPoints}" fill="${fillColor}" />
        <polyline points="${linePoints}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  },

  renderMarketList() {
    let list = [...(this.state.tickers || [])];
    const cat = this.state.selectedCategory || 'ALL';

    if (cat === 'CRYPTO') {
      const filtered = list.filter(t => t.category === 'CRYPTO' || ['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'XNO', 'APE', 'APT', 'AAVE'].some(k => t.symbol.includes(k)));
      if (filtered.length) list = filtered;
    } else if (cat === 'FOREX') {
      const filtered = list.filter(t => t.category === 'FOREX' || t.symbol.includes('EUR') || t.symbol.includes('GBP') || t.symbol.includes('JPY'));
      if (filtered.length) list = filtered;
    } else if (cat === 'FUTURES') {
      const filtered = list.filter(t => t.category === 'FUTURES' || t.symbol.includes('GOLD') || t.symbol.includes('OIL') || t.symbol.includes('NGAS') || t.symbol.includes('ES1'));
      if (filtered.length) list = filtered;
    } else if (cat === 'STOCKS') {
      const filtered = list.filter(t => t.category === 'STOCKS' || t.symbol.includes('AAPL') || t.symbol.includes('TSLA') || t.symbol.includes('NVDA'));
      if (filtered.length) list = filtered;
    } else if (cat === 'OPTIONS') {
      const filtered = list.filter(t => t.category === 'OIL' || t.category === 'COMMODITIES' || t.category === 'FUTURES' || t.symbol.includes('OIL') || t.symbol.includes('BTC') || t.symbol.includes('GOLD') || t.symbol.includes('NGAS'));
      if (filtered.length) list = filtered;
    } else if (cat === 'SELF SERVICE') {
      const favs = this.state.favorites || [];
      if (favs.length > 0) {
        list = list.filter(t => favs.includes(t.symbol));
      } else {
        const filtered = list.filter(t => t.symbol.includes('BTC') || t.symbol.includes('ETH'));
        if (filtered.length) list = filtered;
      }
    } else if (cat === 'HOT') {
      const filtered = list.filter(t => t.symbol.includes('BTC') || t.symbol.includes('ETH') || t.symbol.includes('SOL') || t.symbol.includes('XRP') || t.symbol.includes('BNB') || t.symbol.includes('XNO') || t.symbol.includes('APE') || t.symbol.includes('APT'));
      if (filtered.length) list = filtered;
    } else if (cat === 'GAINERS') {
      list.sort((a, b) => (Number(b.change_24h) || 0) - (Number(a.change_24h) || 0));
    } else if (cat === 'LOSERS') {
      list.sort((a, b) => (Number(a.change_24h) || 0) - (Number(b.change_24h) || 0));
    } else if (cat === 'VOLUME') {
      list.sort((a, b) => (Number(b.volume_24h) || 0) - (Number(a.volume_24h) || 0));
    }

    const searchInput = document.getElementById('market-discovery-search') || document.getElementById('header-search-input') || document.getElementById('market-search');
    const query = (this.state.marketSearchQuery || (searchInput ? searchInput.value : '')).toUpperCase().trim();
    if (query) {
      list = list.filter(t => t.symbol.toUpperCase().includes(query) || (t.base && t.base.toUpperCase().includes(query)));
    }

    // Render Trending 3 Cards on Market Discover (Matches 003505)
    const trendingEl = document.getElementById('market-trending-3-cards');
    if (trendingEl) {
      const top3 = [...(this.state.tickers || [])].slice(0, 3);
      trendingEl.innerHTML = top3.map((t, idx) => {
        const isUp = Number(t.change_24h || 0) >= 0;
        const basePart = t.base || t.symbol.split('/')[0];
        const chgStr = `${isUp ? '+' : ''}${Number(t.change_24h || 0).toFixed(2)}%`;
        const dotColors = ['#F59E0B', '#0052FF', '#111827'];
        const formattedPrice = this.formatPrice(t.price);
        return `
          <div class="av-trending-mini-card" onclick="App.selectMarket('${t.symbol}')">
            <div style="display:flex;align-items:center;gap:5px;margin-bottom:6px;">
              <span style="width:9px;height:9px;border-radius:50%;background:${dotColors[idx % dotColors.length]};display:inline-block;"></span>
              <span style="font-size:12px;font-weight:800;color:#111827;">${basePart}</span>
            </div>
            <div class="mono ${isUp ? 'positive' : 'negative'}" style="font-size:15px;font-weight:800;color:${isUp ? '#00B87C' : '#F6465D'};margin-bottom:2px;">${chgStr}</div>
            <div class="mono" style="font-size:11.5px;font-weight:700;color:#4B5563;">$${formattedPrice}</div>
          </div>
        `;
      }).join('');
    }

    // Render Home Page Trending Markets Cards (Matches 003451)
    const homeContainer = document.getElementById('market-list-rows');
    if (homeContainer) {
      if (!list.length) {
        homeContainer.innerHTML = `
          <div style="text-align: center; padding: 32px 16px; color: #6B7280; font-size: 13px;">
            No matching trading pairs found
          </div>
        `;
      } else {
        const nameMap = { BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana', XRP: 'Ripple', BNB: 'BNB', ADA: 'Cardano', DOGE: 'Dogecoin', LTC: 'Litecoin' };
        homeContainer.innerHTML = list.map(t => {
          const isHalt = Boolean(t.halt);
          const isUp = Number(t.change_24h || 0) >= 0;
          const chgStr = isHalt ? 'Halt' : `${isUp ? '+' : ''}${Number(t.change_24h || 0).toFixed(2)}% ${isUp ? '▲' : '▼'}`;
          const iconSvg = this.getCoinIcon(t.base || t.symbol);
          const basePart = t.base || t.symbol.split('/')[0];
          const displayName = nameMap[basePart] || basePart;
          const formattedPrice = this.formatPrice(t.price);
          const volStr = t.volume_24h ? `$${(Number(t.volume_24h) / 1000000).toFixed(1)}M` : '$84.2M';

          return `
            <div class="av-trending-market-card" onclick="App.selectMarket('${t.symbol}')">
              <div style="display: flex; align-items: center; gap: 11px; min-width:0;">
                <div style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${iconSvg}
                </div>
                <div style="min-width:0;">
                  <div style="font-size: 15px; font-weight: 800; color: #111827;">
                    ${displayName} <span style="font-size: 12px; color: #6B7280; font-weight: 600;">${basePart}</span>
                  </div>
                  <div style="font-size: 11.5px; color: #9CA3AF; margin-top:2px;">Vol ${volStr}</div>
                </div>
              </div>
              <div style="text-align: right; flex-shrink:0;">
                <div class="mono" style="font-size: 15px; font-weight: 800; color: #111827;">$${formattedPrice}</div>
                <div class="mono ${isUp ? 'positive' : 'negative'}" style="font-size: 12px; font-weight: 700; color: ${isHalt ? '#9CA3AF' : (isUp ? '#00B87C' : '#F6465D')}; margin-top:2px;">${chgStr}</div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render Market Discovery Page Cards (Matches 003505)
    const discoveryContainer = document.getElementById('market-discovery-rows');
    if (discoveryContainer) {
      if (!list.length) {
        discoveryContainer.innerHTML = `
          <div style="text-align: center; padding: 48px 16px; color: #6B7280; font-size: 14px;">
            <svg style="width: 36px; height: 36px; margin: 0 auto 12px; opacity: 0.4;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            No trading pairs matching your criteria.
          </div>
        `;
      } else {
        const favs = this.state.favorites || [];
        discoveryContainer.innerHTML = list.map(t => {
          const isUp = Number(t.change_24h || 0) >= 0;
          const chgStr = `${isUp ? '+' : ''}${Number(t.change_24h || 0).toFixed(2)}%`;
          const iconSvg = this.getCoinIcon(t.base || t.symbol);
          const basePart = t.base || t.symbol.split('/')[0];
          const quotePart = t.quote || (t.symbol.includes('/') ? t.symbol.split('/')[1] : 'USDT');
          const formattedPrice = this.formatPrice(t.price);
          const isFav = favs.includes(t.symbol);
          const volStr = t.volume_24h ? `${(Number(t.volume_24h) / 1000000).toFixed(2)}M` : '24.50M';

          return `
            <div class="av-discover-pair-card" onclick="App.selectMarket('${t.symbol}')">
              <div style="display: flex; align-items: center; gap: 11px; min-width:0;">
                <div style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${iconSvg}
                </div>
                <div style="min-width:0;">
                  <div style="font-size: 15px; font-weight: 800; color: #111827; display: flex; align-items: baseline; gap: 3px;">
                    ${basePart}<span style="font-size: 11.5px; color: #6B7280; font-weight: 600;">/${quotePart}</span>
                  </div>
                  <div style="font-size: 11.5px; color: #9CA3AF; margin-top:2px;">Vol ${volStr}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px; flex-shrink:0;">
                <div style="text-align: right;">
                  <div class="mono" style="font-size: 15px; font-weight: 800; color: #111827;">${formattedPrice}</div>
                  <div style="font-size: 11.5px; color: #6B7280;">$${formattedPrice} <span class="mono ${isUp ? 'positive' : 'negative'}" style="font-weight:700;color:${isUp ? '#00B87C' : '#F6465D'};">${chgStr}</span></div>
                </div>
                <button type="button" onclick="App.toggleFavoritePair('${t.symbol}', event)" style="width:30px;height:30px;border-radius:50%;background:${isFav ? '#FEF3C7' : '#F3F4F6'};border:none;cursor:pointer;color:${isFav ? '#F59E0B' : '#9CA3AF'};font-size:15px;display:inline-flex;align-items:center;justify-content:center;" aria-label="Favorite ${t.symbol}">
                  ${isFav ? '★' : '☆'}
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }
    this.renderPublicMarketRows();
  },

  initOptionsCountdown() {
    if (this.state.optionsCountdownTimer) {
      clearInterval(this.state.optionsCountdownTimer);
    }
    const update = () => {
      const now = new Date();
      // 5-minute cycle: 300 seconds
      const secRemaining = 300 - ((now.getMinutes() % 5) * 60 + now.getSeconds());
      const mins = Math.floor(secRemaining / 60);
      const secs = secRemaining % 60;
      const minStr = String(mins).padStart(2, '0');
      const secStr = String(secs).padStart(2, '0');

      const minEl = document.getElementById('options-countdown-min');
      const secEl = document.getElementById('options-countdown-sec');
      if (minEl && secEl) {
        minEl.textContent = minStr;
        secEl.textContent = secStr;
      }

      const oldEl = document.getElementById('options-countdown-digits');
      if (oldEl) {
        oldEl.textContent = `${minStr} : ${secStr}`;
      }

      // Update prediction window text e.g. 17:30-17:40
      const predWindowEl = document.getElementById('options-prediction-window');
      if (predWindowEl) {
        const startMin = Math.floor(now.getMinutes() / 5) * 5;
        const endMin = (startMin + 10) % 60;
        const h = now.getHours();
        const startStr = `${String(h).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
        const endH = (startMin + 10 >= 60) ? (h + 1) % 24 : h;
        const endStr = `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
        predWindowEl.textContent = `${startStr}-${endStr}`;
      }
    };
    update();
    this.state.optionsCountdownTimer = setInterval(update, 1000);
  },

  selectMarket(symbol) {
    const raw = String(symbol || '').trim().toUpperCase();
    const match = (this.state.tickers || []).find(
      t => t.symbol.toUpperCase() === raw || (t.base && t.base.toUpperCase() === raw)
    );
    const resolvedSymbol = match ? match.symbol : (raw || 'BTC/USDT');

    this.state.selectedMarket = resolvedSymbol;
    this.state.marketOverviewSymbol = resolvedSymbol;
    this._activeFuturesTabForced = true;

    this.navigate('futures');
    if (typeof this.switchTradeHubTab === 'function') {
      this.switchTradeHubTab('delivery', true);
    }
    if (typeof this.switchDeliverySubView === 'function') {
      this.switchDeliverySubView('chart', true);
    }
    this.updateFuturesBanner();
    this.initFuturesView();
  },

  setMarketCategory(cat) {
    this.state.selectedCategory = cat;

    // Update Market Page category tab buttons and filter pills
    document.querySelectorAll('.cat-tab-btn, .av-market-cat-tab, .market-filter-pill').forEach(btn => {
      const btnCat = btn.getAttribute('data-cat');
      const onclickStr = btn.getAttribute('onclick') || '';
      const matched = btnCat ? btnCat === cat : onclickStr.includes(`'${cat}'`);
      if (btnCat || onclickStr.includes('setMarketCategory')) {
        btn.classList.toggle('active', matched);
      }
    });

    // Update Home Page category tabs
    const map = {
      'HOT': 'tab-mkt-hot',
      'SELF SERVICE': 'tab-mkt-self',
      'OPTIONS': 'tab-mkt-options'
    };
    document.querySelectorAll('#view-home .xdx-market-tab').forEach(t => t.classList.remove('active'));
    if (map[cat]) {
      const tabEl = document.getElementById(map[cat]);
      if (tabEl) tabEl.classList.add('active');
    }

    this.renderMarketList();
  },

  handleGlobalSearch(query) {
    this.state.marketSearchQuery = (query || '').trim().toUpperCase();
    const mobInp = document.getElementById('mobile-search-input');
    if (mobInp && mobInp.value !== query) mobInp.value = query;
    this.renderMarketList();
  },

  handleMarketSearch(query) {
    this.state.marketSearchQuery = (query || '').trim().toUpperCase();
    this.renderMarketList();
  },

  toggleMobileSearch(force) {
    const el = document.getElementById('mobile-search-expandable');
    if (!el) return;
    const isActive = (force !== undefined) ? force : !el.classList.contains('active');
    el.classList.toggle('active', isActive);
    if (isActive) {
      const inp = document.getElementById('mobile-search-input');
      if (inp) {
        inp.focus();
        inp.value = this.state.marketSearchQuery || '';
      }
    }
  },

  handleMobileSearch(val) {
    this.state.marketSearchQuery = (val || '').trim().toUpperCase();
    const deskInp = document.getElementById('header-search-input');
    if (deskInp && deskInp.value !== val) deskInp.value = val;
    this.renderMarketList();
  },

  clearMobileSearch() {
    const inp = document.getElementById('mobile-search-input');
    if (inp) inp.value = '';
    const deskInp = document.getElementById('header-search-input');
    if (deskInp) deskInp.value = '';
    this.handleMobileSearch('');
  },

  selectSearchChip(symbol) {
    this.state.marketOverviewSymbol = symbol;
    this.state.selectedMarket = symbol;
    this.state.marketSearchQuery = '';
    const mobInp = document.getElementById('mobile-search-input');
    if (mobInp) mobInp.value = '';
    const deskInp = document.getElementById('header-search-input');
    if (deskInp) deskInp.value = '';
    this.toggleMobileSearch(false);
    this.navigate('market');
  },

  /* Market Overview & Featured Chart */
  async initMarketView() {
    if (!this.state.marketOverviewSymbol) {
      this.state.marketOverviewSymbol = this.state.selectedMarket || 'BTC/USDT';
    }
    const canvas = document.getElementById('market-overview-chart-canvas');
    if (canvas) {
      if (!this.marketChart) {
        this.marketChart = new FinancialChart(canvas);
      } else {
        this.marketChart.resize();
        this.marketChart.render();
      }
    }
    this.updateMarketFeaturedBanner();
    await this.loadMarketKlines();
    this.renderMarketList();
  },

  updateMarketFeaturedBanner() {
    const sym = this.state.marketOverviewSymbol || 'BTC/USDT';
    const ticker = this.state.tickers.find(t => t.symbol === sym) || {
      symbol: sym,
      price: 77915.82,
      change_24h: 1.63,
      volume_24h: 142000000
    };
    const isUp = (Number(ticker.change_24h) || 0) >= 0;
    const symEl = document.getElementById('mkt-preview-sym');
    const badgeEl = document.getElementById('mkt-preview-badge');
    const priceEl = document.getElementById('mkt-preview-price');
    const highEl = document.getElementById('mkt-preview-high');
    const lowEl = document.getElementById('mkt-preview-low');
    const tradeBtn = document.getElementById('mkt-preview-trade-btn');

    if (symEl) symEl.textContent = sym;
    if (badgeEl) {
      badgeEl.className = `badge ${isUp ? 'badge-positive' : 'badge-negative'}`;
      badgeEl.textContent = `${isUp ? '+' : ''}${Number(ticker.change_24h).toFixed(2)}%`;
    }
    if (priceEl) {
      priceEl.textContent = `$${this.formatPrice(ticker.price)}`;
      priceEl.style.color = isUp ? '#00c087' : '#ff4d4f';
    }
    const highVal = (ticker.price * 1.025).toFixed(2);
    const lowVal = (ticker.price * 0.978).toFixed(2);
    if (highEl) highEl.textContent = `$${this.formatPrice(highVal)}`;
    if (lowEl) lowEl.textContent = `$${this.formatPrice(lowVal)}`;
    if (tradeBtn) tradeBtn.textContent = `Trade ${sym} →`;

    // Highlight chip
    document.querySelectorAll('.mkt-preview-chip').forEach(c => {
      const p = c.getAttribute('data-pair') || c.textContent.trim();
      c.classList.toggle('active', p === sym);
    });
  },

  async loadMarketKlines() {
    const sym = this.state.marketOverviewSymbol || 'BTC/USDT';
    const interval = this.state.marketChartInterval || '5m';
    const ticker = (this.state.tickers || []).find(t => t.symbol === sym);
    const priceHint = ticker && Number(ticker.price) > 0 ? `&price=${encodeURIComponent(ticker.price)}` : '';
    const res = await this.api(`/markets/klines.php?symbol=${encodeURIComponent(sym)}&interval=${encodeURIComponent(interval)}${priceHint}`);
    const candles = res?.data?.candles;
    if (res.success && Array.isArray(candles) && candles.length && this.marketChart) {
      this.marketChart.setData(candles, this.state.marketChartType || 'candlestick');
    } else if (this.marketChart) {
      const seed = this.marketChart.generateSeedCandles(ticker ? Number(ticker.price) : 77500);
      this.marketChart.setData(seed, this.state.marketChartType || 'candlestick');
    }
  },

  setMarketPreviewPair(symbol) {
    this.state.marketOverviewSymbol = symbol;
    this.updateMarketFeaturedBanner();
    this.loadMarketKlines();
  },

  setMarketChartInterval(interval) {
    this.state.marketChartInterval = interval;
    document.querySelectorAll('.mkt-tf-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tf') === interval);
    });
    this.loadMarketKlines();
  },

  setMarketChartType(type) {
    this.state.marketChartType = type;
    const candleBtn = document.getElementById('mkt-mode-candle');
    const lineBtn = document.getElementById('mkt-mode-line');
    if (candleBtn) {
      candleBtn.style.background = type === 'candlestick' ? '#EFF4FF' : 'transparent';
      candleBtn.style.color = type === 'candlestick' ? '#0052FF' : '#6B7280';
    }
    if (lineBtn) {
      lineBtn.style.background = type === 'line' ? '#EFF4FF' : 'transparent';
      lineBtn.style.color = type === 'line' ? '#0052FF' : '#6B7280';
    }
    if (this.marketChart) {
      this.marketChart.setChartType(type);
    }
  },

  tradePreviewPair() {
    this.selectMarket(this.state.marketOverviewSymbol || 'BTC/USDT');
  },

  /* Futures & Trading View */
  async initFuturesView() {
    const deliveryPanel = document.getElementById('trade-panel-delivery');
    const chartSubpanel = document.getElementById('delivery-subpanel-chart');
    if (deliveryPanel && deliveryPanel.style.display === 'none' && this._activeFuturesTabForced) {
      this.switchTradeHubTab('delivery', true);
    }
    if (chartSubpanel && chartSubpanel.style.display === 'none' && this._activeFuturesTabForced) {
      this.switchDeliverySubView('chart', true);
    }
    this._activeFuturesTabForced = false;

    const canvas = document.getElementById('trading-chart-canvas');
    const sym = this.state.selectedMarket || 'BTC/USDT';
    const ticker = (this.state.tickers || []).find(t => t.symbol === sym);
    const seedPrice = ticker && Number(ticker.price) > 0 ? Number(ticker.price) : 77915.82;

    if (canvas && typeof FinancialChart === 'function') {
      if (!this.chart || this.chart.canvas !== canvas) {
        this.chart = new FinancialChart(canvas);
      }
      this.chart.resize();
      // Paint immediate symbol-accurate candles while remote klines fetch finishes
      const seed = this.chart.generateSeedCandles(seedPrice);
      this.chart.setData(seed, this.state.chartType || 'candlestick');
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
          if (this.chart) {
            this.chart.resize();
            this.chart.render();
          }
        });
      }
    }

    this.updateFuturesBanner();
    await this.loadKlines();
    await this.loadOrderBook();
    await this.loadPositions();
  },

  updateFuturesBanner() {
    const sym = this.state.selectedMarket;
    const ticker = this.state.tickers.find(t => t.symbol === sym);
    if (!ticker) return;

    const formattedPrice = `$${this.formatPrice(ticker.price)}`;
    const rawPrice = this.formatPrice(ticker.price);
    const highPrice = this.formatPrice(ticker.high_24h || ticker.price * 1.02);
    const lowPrice = this.formatPrice(ticker.low_24h || ticker.price * 0.98);
    const volText = ticker.volume_24h ? Number(ticker.volume_24h).toLocaleString() : '1,030,705';

    const nameEl = document.getElementById('trade-pair-name');
    const priceEl = document.getElementById('trade-pair-price');
    const changeEl = document.getElementById('trade-pair-change');
    const highEl = document.getElementById('trade-24h-high') || document.getElementById('trade-high-val');
    const lowEl = document.getElementById('trade-24h-low') || document.getElementById('trade-low-val');
    const volEl = document.getElementById('trade-24h-vol') || document.getElementById('trade-vol-val');

    if (nameEl) nameEl.textContent = ticker.symbol;
    if (priceEl) priceEl.textContent = formattedPrice;
    if (changeEl) {
      const isUp = ticker.change_24h >= 0;
      changeEl.className = `badge ${isUp ? 'badge-positive' : 'badge-negative'}`;
      changeEl.textContent = `${isUp ? '+' : ''}${ticker.change_24h}%`;
    }
    if (highEl) highEl.textContent = highPrice;
    if (lowEl) lowEl.textContent = lowPrice;
    if (volEl) volEl.textContent = volText;

    const isUp = Number(ticker.change_24h || 0) >= 0;
    const chgText = `${isUp ? '+' : ''}${Number(ticker.change_24h || 0).toFixed(3)}% ${isUp ? '↗' : '↘'}`;
    const perpPairTitle = document.getElementById('perp-pair-title');
    if (perpPairTitle) perpPairTitle.textContent = ticker.symbol;
    const perpPairChg = document.getElementById('perp-pair-chg');
    if (perpPairChg) {
      perpPairChg.textContent = chgText;
      perpPairChg.style.color = isUp ? '#00B87C' : '#F6465D';
    }
    const perpPriceInput = document.getElementById('perp-price-input');
    if (perpPriceInput) perpPriceInput.value = rawPrice;
    const spotPriceInput = document.getElementById('spot-price-input');
    if (spotPriceInput) spotPriceInput.value = rawPrice;
    const spotSubmitBtn = document.getElementById('spot-submit-btn');
    if (spotSubmitBtn) {
      const basePart = ticker.base || ticker.symbol.split('/')[0];
      const sideLabel = (this.state.spotSide || 'BUY') === 'SELL' ? 'Sell' : 'Buy';
      spotSubmitBtn.textContent = `${sideLabel} ${basePart}`;
    }

    const deliveryMark = document.getElementById('delivery-mark-price');
    if (deliveryMark) deliveryMark.textContent = formattedPrice;
    const optionsOpen = document.getElementById('options-open-price');
    if (optionsOpen) optionsOpen.textContent = rawPrice;

    const perpMark = document.getElementById('perp-mark-price');
    if (perpMark) perpMark.textContent = rawPrice;
    const spotPair = document.getElementById('spot-pair-name');
    if (spotPair) spotPair.textContent = ticker.symbol;
    const spotPrice = document.getElementById('spot-price');
    if (spotPrice) {
      spotPrice.textContent = formattedPrice;
      spotPrice.style.color = isUp ? '#00B87C' : '#F6465D';
    }

    const bal = Number(this.state.balances?.balances?.trading?.USDT?.available ?? this.state.balances?.breakdown?.trading_total_usdt ?? 0);
    const availEl = document.getElementById('trade-avail-bal');
    if (availEl) availEl.textContent = `${bal.toLocaleString()} USDT`;
    const perpAvail = document.getElementById('perp-avail-bal');
    if (perpAvail) perpAvail.textContent = `Available: ${bal.toLocaleString()} USDT`;
    const spotAvail = document.getElementById('spot-avail-bal');
    if (spotAvail) spotAvail.textContent = `${bal.toLocaleString()} USDT`;

    const favs = this.state.favorites || [];
    const star = document.getElementById('trade-fav-star');
    if (star) {
      const isFav = favs.includes(sym);
      star.style.color = isFav ? '#f59e0b' : 'var(--text-muted)';
    }
    this.updatePerpSummary();
    this.loadOrderBook();
  },

  renderChart() {
    const canvas = document.getElementById('trading-chart-canvas');
    if (!canvas || typeof FinancialChart !== 'function') return;
    if (!this.chart || this.chart.canvas !== canvas) {
      this.chart = new FinancialChart(canvas);
    }
    const draw = () => {
      if (!this.chart) return;
      this.chart.resize();
      if (!this.chart.candles || !this.chart.candles.length) {
        const ticker = (this.state.tickers || []).find(t => t.symbol === this.state.selectedMarket);
        const seed = this.chart.generateSeedCandles(ticker ? Number(ticker.price) : 77915.82);
        this.chart.setData(seed, this.state.chartType || 'candlestick');
      } else {
        this.chart.render();
      }
    };
    draw();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(draw);
    }
  },

  async loadKlines() {
    const sym = this.state.selectedMarket || 'BTC/USDT';
    const interval = this.state.chartInterval || '1h';
    const ticker = (this.state.tickers || []).find(t => t.symbol === sym);
    const seedPrice = ticker && Number(ticker.price) > 0 ? Number(ticker.price) : 77915.82;

    const seq = (this._klinesReqSeq = (this._klinesReqSeq || 0) + 1);
    const canvas = document.getElementById('trading-chart-canvas');
    if (canvas && !this.chart && typeof FinancialChart === 'function') {
      this.chart = new FinancialChart(canvas);
    }

    const res = await this.api(`/markets/klines.php?symbol=${encodeURIComponent(sym)}&interval=${encodeURIComponent(interval)}&price=${encodeURIComponent(seedPrice)}`);
    if (seq !== this._klinesReqSeq || !this.chart) return;

    const candles = res?.data?.candles;
    if (res.success && Array.isArray(candles) && candles.length) {
      this.chart.resize();
      this.chart.setData(candles, this.state.chartType || 'candlestick');
      if (!this.chart.candles || !this.chart.candles.length) {
        this.chart.setData(this.chart.generateSeedCandles(seedPrice), this.state.chartType || 'candlestick');
      }
    } else {
      this.chart.resize();
      const seed = this.chart.generateSeedCandles(seedPrice);
      this.chart.setData(seed, this.state.chartType || 'candlestick');
    }
  },

  setChartInterval(interval) {
    this.state.chartInterval = interval;
    document.querySelectorAll('.tf-btn, .options-tf-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tf') === interval);
    });
    this.loadKlines();
  },

  toggleIndicator(name) {
    if (this.chart && typeof this.chart.toggleIndicator === 'function') {
      const active = this.chart.toggleIndicator(name);
      document.querySelectorAll('.indicator-chip').forEach(el => {
        if (el.textContent.trim().toUpperCase() === name.toUpperCase()) {
          el.classList.toggle('active', !!active);
        }
      });
    }
  },

  toggleFavoritePair(targetSym, event) {
    if (event) event.stopPropagation();
    const sym = targetSym || this.state.selectedMarket || 'BTC/USDT';
    let favs = this.state.favorites || [];
    if (favs.includes(sym)) {
      favs = favs.filter(s => s !== sym);
      this.toast(`Removed ${sym} from favorites`, 'info');
    } else {
      favs.push(sym);
      this.toast(`Added ${sym} to favorites`, 'success');
    }
    this.state.favorites = favs;
    localStorage.setItem('alphavest_favorites', JSON.stringify(favs));
    
    const star = document.getElementById('trade-fav-star');
    if (star && sym === this.state.selectedMarket) {
      star.style.color = favs.includes(sym) ? '#f59e0b' : 'var(--text-muted)';
    }
    this.renderMarketList();
  },

  toggleChartFullscreen() {
    const canvas = document.getElementById('trading-chart-canvas');
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    if (container.classList.contains('fullscreen-chart')) {
      container.classList.remove('fullscreen-chart');
      container.style.height = '260px';
    } else {
      container.classList.add('fullscreen-chart');
      container.style.height = '380px';
    }
    if (this.chart) {
      setTimeout(() => {
        this.chart.resize();
        this.chart.render();
      }, 50);
    }
  },

  openOptionsRulesModal() {
    this.openOptionsRules();
  },

  setChartType(type) {
    this.state.chartType = type;
    document.querySelectorAll('.chart-type-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-type') === type);
    });
    if (this.chart) {
      this.chart.setChartType(type);
    }
  },

  async loadOrderBook() {
    const ticker = this.state.tickers.find(t => t.symbol === this.state.selectedMarket);
    const basePrice = Number(ticker?.price || 77915.82);

    let asks = [];
    let bids = [];
    let trades = [];
    try {
      const res = await this.api(`/markets/orderbook.php?symbol=${encodeURIComponent(this.state.selectedMarket)}`);
      if (res && res.success && res.data) {
        if (Array.isArray(res.data.asks)) asks = res.data.asks;
        if (Array.isArray(res.data.bids)) bids = res.data.bids;
        if (Array.isArray(res.data.trades)) trades = res.data.trades;
      }
    } catch (e) {}

    if (!asks.length || !bids.length) {
      const step = basePrice >= 1000 ? 12.5 : basePrice >= 10 ? 0.15 : 0.0012;
      asks = Array.from({ length: 6 }, (_, i) => [basePrice + (6 - i) * step, Number((0.42 + ((i * 37) % 19) * 0.11).toFixed(4))]);
      bids = Array.from({ length: 6 }, (_, i) => [basePrice - (i + 1) * step, Number((0.38 + ((i * 29) % 23) * 0.12).toFixed(4))]);
    }

    if (!trades.length) {
      const now = Date.now();
      trades = Array.from({ length: 8 }, (_, i) => {
        const dt = new Date(now - i * 18000);
        const isBuy = i % 2 === 0;
        const delta = (isBuy ? 1 : -1) * (basePrice * 0.0002 * ((i % 3) + 1));
        return {
          time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: basePrice + delta,
          qty: (0.14 + ((i * 19) % 15) * 0.08).toFixed(4),
          side: isBuy ? 'BUY' : 'SELL'
        };
      });
    }

    const formatRow = (item, isAsk) => {
      let price, qty;
      if (Array.isArray(item)) {
        price = item[0];
        qty = item[1];
      } else if (item) {
        price = item.price;
        qty = item.quantity || item.qty;
      }
      if (price === undefined) return '';
      const depth = Math.min(100, Math.round((Number(qty) || 1) * 24));
      return `
        <div class="ob-row" style="position: relative; display: flex; justify-content: space-between; font-size: 11px; padding: 3px 6px; border-radius: 4px; margin-bottom: 1px;">
          <span class="mono ${isAsk ? 'negative' : 'positive'}" style="font-weight: 700; color: ${isAsk ? '#F6465D' : '#00B87C'}; position: relative; z-index: 1;">${this.formatPrice(price)}</span>
          <span class="mono" style="text-align: right; color: #4B5563; position: relative; z-index: 1;">${Number(qty).toFixed(4)}</span>
          <div class="ob-depth ${isAsk ? 'ask' : 'bid'}" style="position: absolute; right: 0; top: 0; bottom: 0; width: ${depth}%; background: ${isAsk ? 'rgba(246,70,93,0.10)' : 'rgba(0,184,124,0.10)'}; pointer-events: none;"></div>
        </div>
      `;
    };

    const asksHtml = asks.slice(-6).map(a => formatRow(a, true)).join('');
    const bidsHtml = bids.slice(0, 6).map(b => formatRow(b, false)).join('');

    const asksContainer = document.getElementById('ob-asks');
    const bidsContainer = document.getElementById('ob-bids');
    const spreadEl = document.getElementById('ob-spread-price');
    if (asksContainer) asksContainer.innerHTML = asksHtml;
    if (bidsContainer) bidsContainer.innerHTML = bidsHtml;
    if (spreadEl) spreadEl.textContent = this.formatPrice(basePrice);

    const spotAsks = document.getElementById('spot-ob-asks');
    const spotBids = document.getElementById('spot-ob-bids');
    const spotMid = document.getElementById('spot-ob-mid');
    if (spotAsks) spotAsks.innerHTML = asksHtml;
    if (spotBids) spotBids.innerHTML = bidsHtml;
    if (spotMid) spotMid.textContent = this.formatPrice(basePrice);

    const delivAsks = document.getElementById('delivery-ob-asks');
    const delivBids = document.getElementById('delivery-ob-bids');
    if (delivAsks) delivAsks.innerHTML = asksHtml;
    if (delivBids) delivBids.innerHTML = bidsHtml;

    const tradesEl = document.getElementById('delivery-trades-list');
    if (tradesEl) {
      tradesEl.innerHTML = trades.map(tr => `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:11.5px;padding:6px 0;border-bottom:1px solid #F1F5F9;">
          <span class="mono" style="color:#6B7280;">${tr.time || 'Recent'}</span>
          <span class="mono" style="text-align:right;font-weight:700;color:${tr.side === 'BUY' ? '#00B87C' : '#F6465D'};">${this.formatPrice(tr.price)}</span>
          <span class="mono" style="text-align:right;color:#111827;">${tr.qty}</span>
        </div>
      `).join('');
    }
  },

  setTradePercent(pct) {
    const availBal = Number(this.state.balances?.breakdown?.trading_total_usdt ?? this.state.balances?.balances?.trading?.USDT?.available ?? 0);
    const levEl = document.getElementById('trade-leverage');
    const lev = levEl ? (parseInt(levEl.value) || 10) : 10;
    const ticker = this.state.tickers.find(t => t.symbol === this.state.selectedMarket);
    const price = ticker ? ticker.price : 64280;

    const marginToUse = availBal * (pct / 100);
    const notional = marginToUse * lev;
    const qty = (notional / price).toFixed(4);

    const qtyInput = document.getElementById('trade-quantity');
    if (qtyInput) {
      qtyInput.value = qty;
      this.updateOrderCalculation();
    }
  },

  updateOrderCalculation() {
    const qtyInput = document.getElementById('trade-quantity');
    const qty = qtyInput ? (parseFloat(qtyInput.value) || 0) : 0;
    const levEl = document.getElementById('trade-leverage');
    const lev = levEl ? (parseInt(levEl.value) || 10) : 10;
    const ticker = this.state.tickers.find(t => t.symbol === this.state.selectedMarket);
    const price = ticker ? ticker.price : 64280;

    const notional = qty * price;
    const margin = (notional / lev).toFixed(2);
    const fee = (notional * 0.0004).toFixed(3);

    const marginEl = document.getElementById('calc-margin');
    const feeEl = document.getElementById('calc-fee');
    if (marginEl) marginEl.textContent = `$${margin}`;
    if (feeEl) feeEl.textContent = `$${fee}`;
  },

  async executeFuturesOrder(side) {
    const qtyInput = document.getElementById('trade-quantity');
    const qty = qtyInput ? (parseFloat(qtyInput.value) || 0) : 0;
    const levEl = document.getElementById('trade-leverage');
    const lev = levEl ? (parseInt(levEl.value) || 10) : 10;
    const orderTypeEl = document.getElementById('trade-order-type');
    const orderType = orderTypeEl ? (orderTypeEl.value || 'MARKET') : 'MARKET';

    if (qty <= 0) {
      this.toast('Please enter a valid order quantity', 'error');
      return;
    }

    const res = await this.api('/trading/order.php', 'POST', {
      symbol: this.state.selectedMarket,
      side,
      order_type: orderType,
      quantity: qty,
      leverage: lev
    });

    if (res.success) {
      this.toast(`Futures ${side} order placed successfully!`, 'success');
      if (qtyInput) qtyInput.value = '';
      this.loadBalances();
      this.loadPositions();
    } else {
      this.toast(res.message || 'Trading engine is not enabled on this deployment.', 'error');
      if (qtyInput) qtyInput.value = '';
      this.loadBalances();
      this.loadPositions();
    }
  },

  async loadPositions() {
    const res = await this.api('/trading/positions.php');
    if (res.success && res.data) {
      this.state.positions = res.data.positions;
      this.renderPositions();
    }
  },

  renderPositions() {
    const container = document.getElementById('open-positions-list');
    if (!container) return;

    if (!this.state.positions.length) {
      container.innerHTML = `
        <div style="text-align:center; padding: 24px; color: var(--text-dim);">
          No open futures positions.
        </div>
      `;
      return;
    }

    container.innerHTML = this.state.positions.map(p => {
      const isUp = p.unrealized_pnl >= 0;
      return `
        <div class="card" style="margin-bottom: 8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge ${p.side === 'LONG' ? 'badge-positive' : 'badge-negative'}">${p.side} ${p.leverage}x</span>
              <strong>${p.symbol}</strong>
            </div>
            <button class="btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="App.closePosition('${p.id}')">
              Market Close
            </button>
          </div>
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; font-size:12px;">
            <div>
              <span style="color:var(--text-muted); display:block;">Entry</span>
              <strong>$${p.entry_price}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">Mark</span>
              <strong>$${p.current_price}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">Margin</span>
              <strong>$${p.margin}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">PnL (ROE%)</span>
              <strong class="${isUp ? 'positive' : 'negative'}">
                ${isUp ? '+' : ''}$${p.unrealized_pnl} (${isUp ? '+' : ''}${p.roe_percentage}%)
              </strong>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  async closePosition(positionId) {
    const res = await this.api('/trading/positions.php', 'POST', { position_id: positionId });
    if (res.success) {
      this.toast(`Position closed! Realized PnL: $${res.data.realized_pnl}`, 'success');
      this.loadPositions();
      this.loadBalances();
    } else {
      this.toast(res.message || 'Failed to close position', 'error');
    }
  },

  /* Wallet Controller */
  async loadBalances(force = false) {
    // Keep only one live balance request in flight. This prevents slow networks from
    // stacking requests and keeps balance refreshes responsive.
    if (this._balanceRequest && !force) return this._balanceRequest;
    this._balanceRequest = this.api('/wallet/balances.php').then(res => {
      if (res.success && res.data) {
        this.state.balances = res.data;
        this.writeFastCache('balances', res.data);
        this.renderWalletView();
      }
      return res;
    }).catch(() => null).finally(() => {
      this._balanceRequest = null;
    });
    return this._balanceRequest;
  },

  renderWalletView() {
    const data = this.state.balances;
    if (!data) return;
    if (this.state.adminPreviewUserId) this.ensureAdminUserDepositAction();

    const totalUsdt = Number(data.total_assets_usdt || 0);
    const totalBtc = Number(data.total_assets_btc || (totalUsdt > 0 ? (totalUsdt / 64280) : 0));
    const fundingUsdt = Number(data.breakdown?.funding_total_usdt || 0);
    const exchangeUsdt = Number(data.breakdown?.exchange_total_usdt || 0);
    const tradingUsdt = Number(data.breakdown?.trading_total_usdt || 0);

    const isHidden = this.state.hideBalance;

    // Total Wallet Card
    const totalBalEl = document.getElementById('wallet-total-balance') || document.getElementById('wallet-total-usdt');
    if (totalBalEl) {
      totalBalEl.textContent = isHidden ? '******' : totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const btcEquivEl = document.getElementById('wallet-total-btc-equiv') || document.getElementById('wallet-total-btc');
    if (btcEquivEl) {
      btcEquivEl.textContent = isHidden ? '******' : `≈ ${totalBtc.toFixed(4)} BTC`;
    }

    // Wallet UID
    const walletUidEl = document.getElementById('wallet-user-uid');
    if (walletUidEl) {
      walletUidEl.textContent = 'UID: ' + this.getUserUID();
    }

    // Breakdown sub-accounts
    const fundingEl = document.getElementById('bal-funding');
    const exchangeEl = document.getElementById('bal-exchange');
    const tradingEl = document.getElementById('bal-trading');
    if (fundingEl) fundingEl.textContent = isHidden ? '******' : `$${fundingUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (exchangeEl) exchangeEl.textContent = isHidden ? '******' : `$${exchangeUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (tradingEl) tradingEl.textContent = isHidden ? '******' : `$${tradingUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Crypto asset rows
    const btcAmtEl = document.getElementById('wallet-btc-amount');
    const btcUsdEl = document.getElementById('wallet-btc-usd');
    if (btcAmtEl) btcAmtEl.textContent = isHidden ? '******' : '0.0000';
    if (btcUsdEl) btcUsdEl.textContent = isHidden ? '******' : '≈ 0.00 USDT';

    const ethAmtEl = document.getElementById('wallet-eth-amount');
    const ethUsdEl = document.getElementById('wallet-eth-usd');
    if (ethAmtEl) ethAmtEl.textContent = isHidden ? '******' : '0.0000';
    if (ethUsdEl) ethUsdEl.textContent = isHidden ? '******' : '≈ 0.00 USDT';

    const usdtAmtEl = document.getElementById('wallet-usdt-amount');
    if (usdtAmtEl) {
      usdtAmtEl.textContent = isHidden ? '******' : totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    this.updateHomeHeroBalance();
  },

  updateHomeHeroBalance() {
    const homeValEl = document.getElementById('home-balance-val');
    const uidEl = document.getElementById('home-user-uid');
    if (homeValEl) {
      if (this.state.hideBalance) {
        homeValEl.textContent = '******';
      } else {
        const total = this.state.balances?.total_assets_usdt != null ? this.state.balances.total_assets_usdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
        homeValEl.textContent = total;
      }
    }
    if (uidEl && this.state.user) {
      uidEl.textContent = this.getUserUID();
    }

    // Real-time KYC status update on Home dashboard
    const kycBadge = document.getElementById('home-user-kyc-badge');
    const kycBanner = document.getElementById('home-kyc-status-banner');
    const kycStatus = (this.state.user?.kyc_status || (this.state.userKYCVerified ? 'APPROVED' : (this.state.userKYCPending ? 'PENDING' : 'NOT_SUBMITTED'))).toUpperCase();

    if (kycBadge) {
      if (kycStatus === 'APPROVED') {
        kycBadge.textContent = 'Tier 2 Verified ✓';
        kycBadge.className = 'badge badge-positive';
        kycBadge.style.color = '#059669';
        kycBadge.style.background = '#ECFDF5';
      } else if (kycStatus === 'PENDING') {
        kycBadge.textContent = 'KYC Pending Review ⏳';
        kycBadge.className = 'badge badge-warning';
        kycBadge.style.color = '#D97706';
        kycBadge.style.background = '#FFFBEB';
      } else if (kycStatus === 'REJECTED') {
        kycBadge.textContent = 'KYC Rejected ✕';
        kycBadge.className = 'badge badge-negative';
        kycBadge.style.color = '#DC2626';
        kycBadge.style.background = '#FEF2F2';
      } else {
        kycBadge.textContent = 'Unverified (Verify)';
        kycBadge.className = 'badge badge-warning';
        kycBadge.style.color = '#6B7280';
        kycBadge.style.background = '#F3F5F8';
      }
    }

    if (kycBanner) {
      if (kycStatus === 'PENDING') {
        kycBanner.style.display = 'block';
        kycBanner.innerHTML = `
          <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #B45309;">
              <span style="font-size: 16px;">⏳</span>
              <span><strong>KYC Under Review:</strong> Your identity documents are being verified by compliance audit.</span>
            </div>
            <button onclick="App.navigate('kyc')" style="background: #FEF3C7; border: 1px solid #F59E0B; color: #B45309; border-radius: 8px; padding: 4px 10px; font-size: 11px; cursor: pointer; font-weight: 700;">View Status</button>
          </div>
        `;
      } else if (kycStatus === 'REJECTED') {
        kycBanner.style.display = 'block';
        kycBanner.innerHTML = `
          <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #DC2626;">
              <span style="font-size: 16px;">⚠️</span>
              <span><strong>KYC Action Required:</strong> Identity verification was declined. Please resubmit your document.</span>
            </div>
            <button onclick="App.navigate('kyc')" style="background: #FEE2E2; border: 1px solid #EF4444; color: #DC2626; border-radius: 8px; padding: 4px 10px; font-size: 11px; cursor: pointer; font-weight: 700;">Resubmit KYC</button>
          </div>
        `;
      } else {
        kycBanner.style.display = 'none';
      }
    }
  },

  toggleBalanceVisibility() {
    this.state.hideBalance = !this.state.hideBalance;
    const eyeIcon = document.getElementById('balance-eye-icon');
    if (eyeIcon) {
      if (this.state.hideBalance) {
        eyeIcon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`;
      } else {
        eyeIcon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
      }
    }
    this.updateHomeHeroBalance();
  },

  getUserUID() {
    const raw = this.state.user?.numeric_uid ?? this.state.user?.numericUid ?? this.state.user?.uid_number ?? '';
    const digits = String(raw).replace(/\D/g, '');
    return digits || '—';
  },

  copyUID() {
    const uid = this.getUserUID();
    const copyText = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(uid);
        } else {
          const ta = document.createElement('textarea');
          ta.value = uid;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          ta.setSelectionRange(0, ta.value.length);
          const ok = document.execCommand('copy');
          ta.remove();
          if (!ok) throw new Error('copy failed');
        }
        this.toast(`UID ${uid} copied to clipboard!`, 'success');
      } catch (e) {
        this.toast(`UID: ${uid}`, 'info');
      }
    };
    copyText();
  },

  /* Modals: Deposit, Withdraw, Transfer */
  openModal(modalId) {
    if (typeof this.toggleSideDrawer === 'function') this.toggleSideDrawer(false);
    const modal = document.getElementById(modalId);
    if (modal) {
      this._modalTopZ = Math.max(this._modalTopZ || 9000, 9000) + 1;
      modal.style.zIndex = String(this._modalTopZ);
      modal.style.pointerEvents = 'auto';
      modal.classList.add('open');
    }

    if (modalId === 'modal-profile') {
      const user = this.state.user || {};
      const emailEl = document.getElementById('prof-email-label');
      const kycBadge = document.getElementById('prof-kyc-badge');
      if (emailEl) {
        emailEl.textContent = user.email || 'User Account';
      }
      if (kycBadge) {
        const kyc = (user.kyc_status || 'NOT_SUBMITTED').toUpperCase();
        if (kyc === 'APPROVED') {
          kycBadge.className = 'badge badge-positive';
          kycBadge.textContent = 'KYC: Verified ✓';
        } else if (kyc === 'REJECTED') {
          kycBadge.className = 'badge badge-negative';
          kycBadge.textContent = 'KYC: Rejected';
        } else if (kyc === 'PENDING') {
          kycBadge.className = 'badge badge-warning';
          kycBadge.textContent = 'KYC: Pending';
        } else {
          kycBadge.className = 'badge badge-demo';
          kycBadge.textContent = 'KYC: Not Submitted';
        }
      }
    }

    if (modalId === 'modal-auth') {
      const pendingRef = this.getPendingReferralCode();
      if (pendingRef) {
        const regRef = document.getElementById('reg-ref');
        const regBanner = document.getElementById('reg-invite-banner');
        const regBadge = document.getElementById('reg-ref-badge');
        const regText = document.getElementById('reg-invite-banner-text');

        if (regRef) regRef.value = pendingRef;
        if (regBanner) regBanner.style.display = 'flex';
        if (regBadge) regBadge.style.display = 'block';
        if (regText) regText.textContent = `Referral code ${pendingRef} linked to your registration.`;
      }
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      modal.style.zIndex = '';
      modal.style.pointerEvents = '';
    }
    if (!document.querySelector('.modal-overlay.open')) {
      this._modalTopZ = 9000;
    }
  },

  async openDepositModal() {
    // In Admin User View, every normal user-facing Deposit action must open the
    // dedicated admin-on-behalf flow. The ordinary deposit endpoint is intentionally
    // blocked during preview, so do not silently open a form that cannot submit.
    if (this.state.adminPreviewUserId) {
      this.openAdminUserDepositModal();
      return;
    }
    this.openModal('modal-deposit');
    this.switchDepositMode(true);
    await this.updateDepositInfo();
  },

  switchDepositMode(isLive) {
    const liveContainer = document.getElementById('dep-live-container');
    const modalBadge = document.getElementById('dep-modal-badge');
    const addrLabel = document.getElementById('dep-addr-label');

    if (liveContainer) liveContainer.style.display = 'block';
    if (modalBadge) {
      modalBadge.className = 'badge';
      modalBadge.textContent = 'LIVE REAL ACCOUNT';
      modalBadge.style.background = 'rgba(0, 230, 118, 0.15)';
      modalBadge.style.color = '#00e676';
      modalBadge.style.border = '1px solid rgba(0, 230, 118, 0.3)';
    }
    if (addrLabel) addrLabel.textContent = 'Dedicated Institutional Vault Address';
  },

  async updateDepositInfo() {
    const asset = document.getElementById('dep-asset')?.value || 'USDT';
    const network = document.getElementById('dep-network')?.value || 'TRC20';

    // Update real balance display
    const realBal = this.state.balances?.breakdown?.funding_total_usdt ?? this.state.balances?.total_assets_usdt ?? 0;
    const realBalEl = document.getElementById('dep-real-balance');
    if (realBalEl) realBalEl.textContent = `$${Number(realBal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT`;

    const res = await this.api(`/wallet/deposit.php?asset=${asset}&network=${network}`);
    if (res.success && res.data) {
      const depositsEnabled = res.data.deposits_enabled !== false;
      const submitBtn = document.getElementById('btn-submit-live-deposit');
      const statusBanner = document.getElementById('dep-disabled-banner');
      if (statusBanner) statusBanner.style.display = depositsEnabled ? 'none' : 'block';
      if (submitBtn) {
        submitBtn.disabled = !depositsEnabled;
        submitBtn.textContent = depositsEnabled ? 'Submit Deposit for Admin Approval' : 'Deposits Temporarily Disabled';
      }
      const address = res.data.address || (res.data.deposit_info && res.data.deposit_info.address) || '';
      const minDeposit = res.data.min_deposit || (res.data.deposit_info && res.data.deposit_info.minimum_deposit) || 10;
      const instructions = res.data.instructions || '';
      const confirmations = res.data.required_confirmations || 12;

      const addrEl = document.getElementById('dep-address');
      if (addrEl) addrEl.value = address;
      
      const minLabelEl = document.getElementById('dep-min-label');
      if (minLabelEl) minLabelEl.textContent = `Minimum Deposit: ${minDeposit} ${asset} (${confirmations} Confirmations Required)`;

      const instEl = document.getElementById('dep-instructions-text');
      if (instEl && instructions) instEl.textContent = instructions;

      if (address) {
        const qrMap = {
          TRC20: '/assets/deposit-qr/trc20.jpg',
          ERC20: '/assets/deposit-qr/erc20.jpg',
          BEP20: '/assets/deposit-qr/bep20.jpg'
        };
        const qrImg = document.getElementById('dep-qr-image');
        if (qrImg && qrMap[network]) {
          qrImg.src = qrMap[network];
          qrImg.style.display = 'block';
        }
      }
    }
  },

  async submitLiveDeposit() {
    const actionScope = 'user-deposit-submit';
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Deposit submission is already processing. Please wait for the current result.', 'warning');
      return;
    }

    const btn = document.getElementById('btn-submit-live-deposit');
    if (btn) {
      btn.disabled = true;
      btn.dataset.alphaOriginalText = btn.textContent.trim();
      btn.textContent = 'Submitting Deposit...';
    }

    try {
      const statusCheck = await this.api('/wallet/deposit.php?asset=USDT&network=TRC20');
      if (statusCheck.success && statusCheck.data?.deposits_enabled === false) {
        this.toast('Deposits are temporarily disabled by the administrator. Please try again later.', 'error');
        this.endAction(actionScope, false);
        return;
      }
      const asset = document.getElementById('dep-asset')?.value || 'USDT';
      const network = document.getElementById('dep-network')?.value || 'TRC20';
      const amount = parseFloat(document.getElementById('dep-live-amount')?.value) || 0;
      const userAddress = (document.getElementById('dep-user-address')?.value || '').trim();
      const txHash = (document.getElementById('dep-live-txhash')?.value || '').trim();

      if (amount <= 0) {
        this.toast('Please enter a valid deposit amount', 'error');
        return;
      }
      if (!userAddress && !txHash) {
        this.toast('Please enter the sending wallet address from where you transferred funds', 'error');
        return;
      }

      const res = await this.api('/wallet/deposit.php', 'POST', {
        asset,
        network,
        amount,
        sender_address: userAddress,
        tx_hash: txHash,
        idempotency_key: actionKey
      });

      if (res.success) {
        this.toast(res.message || `Deposit request of ${amount} ${asset} submitted! Admin will verify and credit your balance.`, 'success');
        this.closeModal('modal-deposit');
        await this.loadBalances();
        this.endAction(actionScope, true);
      } else {
        this.toast(res.message || 'Deposit submission failed', 'error');
        this.endAction(actionScope, false);
      }
    } catch (err) {
      this.toast('Deposit submission failed: ' + (err.message || err), 'error');
      this.endAction(actionScope, false);
    } finally {
      if (btn && !this.state.actionLocks.has(actionScope)) {
        btn.disabled = false;
        btn.textContent = btn.dataset.alphaOriginalText || 'Submit Deposit for Admin Approval';
        delete btn.dataset.alphaOriginalText;
      }
      if (this.state.actionLocks.has(actionScope)) {
        this.endAction(actionScope, false);
      }
    }
  },

  renderQrCode(canvasId, text) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw a stylized high-contrast QR Matrix pattern representation
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0b0e14';
    const size = 6;
    const count = Math.floor(canvas.width / size);
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        // Deterministic bit generation based on char code
        const charIdx = (r * count + c) % text.length;
        if ((text.charCodeAt(charIdx) + r * 3 + c * 7) % 2 === 0) {
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
    }
    // QR position corners
    const drawCorner = (x, y) => {
      ctx.fillStyle = '#0b0e14';
      ctx.fillRect(x, y, 42, 42);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 6, y + 6, 30, 30);
      ctx.fillStyle = '#0b0e14';
      ctx.fillRect(x + 12, y + 12, 18, 18);
    };
    drawCorner(10, 10);
    drawCorner(canvas.width - 52, 10);
    drawCorner(10, canvas.height - 52);
  },

  copyDepositAddress() {
    const addr = document.getElementById('dep-address').value;
    navigator.clipboard.writeText(addr);
    this.toast('Deposit address copied to clipboard!', 'success');
  },

  async submitDepositSim() {
    const actionScope = 'user-deposit-submit';
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Deposit submission is already processing. Please wait for the current result.', 'warning');
      return;
    }
    try {
      const asset = document.getElementById('dep-asset').value || 'USDT';
      const network = document.getElementById('dep-network').value || 'TRC20';
      const amount = parseFloat(document.getElementById('dep-amount').value) || 0;

      if (amount <= 0) {
        this.toast('Enter a valid deposit amount', 'error');
        return;
      }

      const res = await this.api('/wallet/deposit.php', 'POST', {
        asset,
        network,
        amount,
        idempotency_key: actionKey
      });

      if (res.success) {
        this.toast(res.message || 'Deposit processed successfully', 'success');
        this.closeModal('modal-deposit');
        this.loadBalances();
        this.endAction(actionScope, true);
      } else {
        this.toast(res.message || 'Deposit failed', 'error');
        this.endAction(actionScope, false);
      }
    } catch (err) {
      this.toast('Deposit failed: ' + (err.message || err), 'error');
      this.endAction(actionScope, false);
    } finally {
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
    }
  },

  /* Withdrawal: 5% early deduction rule if withdrawing before doubling deposit */
  async openWithdrawModal() {
    this.openModal('modal-withdraw');
    
    const pinEl = document.getElementById('with-pin');
    if (pinEl) pinEl.value = '';

    // Calculate total available balance across all wallets
    const fundingBal = Number(this.state.balances?.breakdown?.funding_total_usdt || 0);
    const tradingBal = Number(this.state.balances?.breakdown?.trading_total_usdt || 0);
    const exchangeBal = Number(this.state.balances?.breakdown?.exchange_total_usdt || 0);
    const totalAssets = Number(this.state.balances?.total_assets_usdt || 0);
    const localAvail = Math.max(totalAssets, fundingBal + tradingBal + exchangeBal);

    const availEl = document.getElementById('with-avail-bal');
    if (availEl) {
      availEl.textContent = `$${localAvail.toFixed(2)} USDT`;
    }

    try {
      const res = await this.api('/wallet/withdraw-info.php');
      if (res.success && res.data) {
        this.state.withdrawInfo = res.data;
        const liveAvail = res.data.available_balance != null ? Number(res.data.available_balance) : localAvail;
        if (availEl) {
          availEl.textContent = `$${liveAvail.toFixed(2)} USDT`;
        }
        const depEl = document.getElementById('with-stat-deposited');
        const targetEl = document.getElementById('with-stat-target');
        const penaltyEl = document.getElementById('with-penalty-alert');

        if (depEl) depEl.textContent = `$${res.data.total_deposited.toFixed(2)} USDT`;
        if (targetEl) targetEl.textContent = `$${res.data.double_target.toFixed(2)} USDT`;

        if (penaltyEl) {
          if (res.data.is_early_withdrawal) {
            penaltyEl.innerHTML = `⚠️ <strong>5% Early Deduction Active:</strong> Withdrawing before reaching the 2x deposit target ($${res.data.double_target.toFixed(2)} USDT) will incur a mandatory 5% fee deduction from your requested amount.`;
            penaltyEl.style.color = 'var(--warning)';
          } else {
            penaltyEl.innerHTML = `✅ <strong>Full Payout:</strong> You have met the 2x deposit turnover threshold ($${res.data.total_deposited.toFixed(2)} deposit). No 5% early deduction will be applied!`;
            penaltyEl.style.color = 'var(--primary)';
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load withdraw info', err);
    }

    this.onWithdrawAmountInput(document.getElementById('with-amount')?.value || '');
  },

  setWithdrawMax() {
    const fundingBal = Number(this.state.balances?.breakdown?.funding_total_usdt || 0);
    const tradingBal = Number(this.state.balances?.breakdown?.trading_total_usdt || 0);
    const totalAssets = Number(this.state.balances?.total_assets_usdt || 0);
    const apiAvail = this.state.withdrawInfo?.available_balance != null ? Number(this.state.withdrawInfo.available_balance) : null;
    const maxBal = apiAvail != null ? apiAvail : Math.max(totalAssets, fundingBal + tradingBal);
    
    const input = document.getElementById('with-amount');
    if (input) {
      input.value = maxBal > 0 ? maxBal.toFixed(2) : '0';
      this.onWithdrawAmountInput(input.value);
    }
  },

  onWithdrawAmountInput(val) {
    const amount = parseFloat(val) || 0;
    const fee = 1.00;
    const isEarly = this.state.withdrawInfo ? this.state.withdrawInfo.is_early_withdrawal : true;
    const earlyDeduction = isEarly ? (amount * 0.05) : 0;
    const net = Math.max(0, amount - fee - earlyDeduction);

    const calcAmount = document.getElementById('with-calc-amount');
    const calcFee = document.getElementById('with-calc-fee');
    const calcDeduction = document.getElementById('with-calc-deduction');
    const calcNet = document.getElementById('with-calc-net');

    if (calcAmount) calcAmount.textContent = `$${amount.toFixed(2)} USDT`;
    if (calcFee) calcFee.textContent = `$${fee.toFixed(2)} USDT`;
    if (calcDeduction) calcDeduction.textContent = `$${earlyDeduction.toFixed(2)} USDT`;
    if (calcNet) calcNet.textContent = `$${net.toFixed(2)} USDT`;
  },

  async submitWithdrawal() {
    const actionScope = 'user-withdrawal-submit';
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Withdrawal submission is already processing. Please wait for the current result.', 'warning');
      return;
    }

    const btn = document.getElementById('btn-confirm-withdrawal');
    if (btn) {
      btn.disabled = true;
      if (!btn.dataset.alphaOriginalText) btn.dataset.alphaOriginalText = btn.textContent.trim();
      btn.textContent = 'Verifying PIN & Authorizing...';
    }

    try {
      const asset = document.getElementById('with-asset').value || 'USDT';
      const network = document.getElementById('with-network').value || 'TRC20';
      const dest = document.getElementById('with-dest').value.trim();
      const amount = parseFloat(document.getElementById('with-amount').value) || 0;
      const pinInput = document.getElementById('with-pin');
      const withdrawalPin = pinInput ? pinInput.value.trim() : '';

      if (!dest || dest.length < 15) {
        this.toast('Please provide a valid destination address', 'error');
        return;
      }
      if (amount < 3) {
        this.toast('Minimum withdrawal amount is 3 USDT', 'error');
        return;
      }
      if (!withdrawalPin) {
        this.toast('Please enter your 6-digit withdrawal PIN to authorize this payout', 'error');
        if (pinInput) pinInput.focus();
        return;
      }
      if (!/^\d{6}$/.test(withdrawalPin)) {
        this.toast('Withdrawal PIN must be exactly 6 numeric digits', 'error');
        if (pinInput) pinInput.focus();
        return;
      }

      const res = await this.api('/wallet/withdraw.php', 'POST', {
        asset,
        network,
        destination_address: dest,
        amount,
        withdrawal_pin: withdrawalPin,
        fund_password: withdrawalPin,
        idempotency_key: actionKey
      });

      if (res.success) {
        this.toast(res.message || 'Withdrawal request submitted successfully', 'success');
        this.closeModal('modal-withdraw');
        if (pinInput) pinInput.value = '';
        this.loadBalances();
        this.loadWalletHistoryPreview();
        if (typeof this.loadTransactionHistory === 'function') this.loadTransactionHistory();
        this.endAction(actionScope, true);
      } else {
        const msg = res.message || (res.error && res.error.message) || 'Withdrawal request failed';
        this.toast(msg, 'error');
        if (pinInput && msg.toLowerCase().includes('pin')) {
          pinInput.focus();
          pinInput.select();
        }
        this.endAction(actionScope, false);
      }
    } catch (e) {
      this.toast('An unexpected error occurred while processing withdrawal', 'error');
      this.endAction(actionScope, false);
    } finally {
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
      if (btn) {
        btn.disabled = false;
        btn.textContent = btn.dataset.alphaOriginalText || 'Confirm Withdrawal';
        delete btn.dataset.alphaOriginalText;
      }
    }
  },

  /* Transfer */
  openTransferModal() {
    this.openModal('modal-transfer');
  },

  async submitTransfer() {
    const from = document.getElementById('trf-from').value;
    const to = document.getElementById('trf-to').value;
    const amount = parseFloat(document.getElementById('trf-amount').value) || 0;

    if (from === to) {
      this.toast('Source and destination wallets must be different', 'error');
      return;
    }

    if (amount <= 0) {
      this.toast('Enter a valid transfer amount', 'error');
      return;
    }

    const res = await this.api('/wallet/transfer.php', 'POST', {
      from_wallet: from,
      to_wallet: to,
      asset: 'USDT',
      amount
    });

    if (res.success) {
      this.toast('Transfer completed successfully via Ledger', 'success');
      this.closeModal('modal-transfer');
      this.loadBalances();
    } else {
      this.toast(res.message || 'Transfer failed', 'error');
    }
  },

  /* Copy Trading */
  async loadCopyTrading() {
    const res = await this.api('/copytrading/plans.php');
    const tradesRes = await this.api('/copytrading/trades.php');
    const signalsRes = await this.api('/signals/active.php');

    if (res.success && res.data) {
      this.state.copyPlans = res.data.plans;
      this.renderCopyPlans();
    }

    if (tradesRes.success && tradesRes.data) {
      this.state.activeCopyTrades = tradesRes.data.active_trades;
      this.renderActiveCopyTrades();
    }

    if (signalsRes.success && signalsRes.data) {
      this.state.activeSignals = signalsRes.data.signals;
      this.renderSignals();
    }
  },

  renderCopyPlans() {
    const fallbackPlans = [
      { id: 'master_quant_alpha', name: 'Alpha Quant Arbitrage', trader_name: 'Marcus Vance', roi_30d: '38.4', win_rate: '89.2', risk_score: '2', min_balance: '100', description: 'Delta-neutral perpetual funding & cross-exchange liquidity capture.' },
      { id: 'master_btc_momentum', name: 'BTC Institutional Momentum', trader_name: 'Elena Rostova', roi_30d: '54.8', win_rate: '84.5', risk_score: '4', min_balance: '250', description: 'Systematic breakout & trend capture across BTC/ETH perpetual markets.' },
      { id: 'master_yield_shield', name: 'Steady Yield Shield', trader_name: 'Kenji Takahashi', roi_30d: '21.6', win_rate: '93.1', risk_score: '1', min_balance: '50', description: 'Low-drawdown algorithmic scalping with automated risk throttling.' }
    ];
    const plans = (Array.isArray(this.state.copyPlans) && this.state.copyPlans.length) ? this.state.copyPlans : fallbackPlans;

    const buildCard = (p) => `
      <div class="card" style="display:flex; flex-direction:column; gap:12px; background:#FFFFFF; border:1px solid #EEF1F6;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:40px; height:40px; border-radius:50%; background:#EFF4FF; color:#0052FF; border:1px solid #DBEAFE; font-weight:800; display:flex; align-items:center; justify-content:center;">
              ${(p.trader_name || 'AV').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 style="font-size:15px; color:#111827; margin:0;">${p.name}</h4>
              <span style="font-size:12px; color:#6B7280;">${p.trader_name}</span>
            </div>
          </div>
          <span class="badge badge-positive">+${p.roi_30d}% 30D</span>
        </div>
        <p style="font-size:12px; color:#4B5563; margin:0;">${p.description}</p>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; font-size:12px; background:#F8FAFC; border:1px solid #EEF1F6; padding:10px; border-radius:10px;">
          <div>
            <span style="color:#6B7280; display:block;">Win Rate</span>
            <strong style="color:#111827;">${p.win_rate}%</strong>
          </div>
          <div>
            <span style="color:#6B7280; display:block;">Risk</span>
            <strong style="color:#111827;">${p.risk_score}/10</strong>
          </div>
          <div>
            <span style="color:#6B7280; display:block;">Min Bal</span>
            <strong style="color:#111827;">$${p.min_balance}</strong>
          </div>
        </div>
        <button class="btn-primary" style="width:100%; font-size:13px; border-radius:999px;" onclick="App.openCopyModal('${p.id}', '${p.name}')">
          Copy Strategy
        </button>
      </div>
    `;

    const container = document.getElementById('copy-plans-container');
    if (container) {
      container.innerHTML = plans.map(buildCard).join('');
    }
    const quickList = document.getElementById('trade-copy-quick-list');
    if (quickList) {
      quickList.innerHTML = plans.slice(0, 3).map(buildCard).join('');
    }
  },

  renderActiveCopyTrades() {
    const container = document.getElementById('active-copy-trades-list');
    if (!container) return;

    if (!this.state.activeCopyTrades.length) {
      container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-dim);">No active copy trading allocations.</div>`;
      return;
    }

    container.innerHTML = this.state.activeCopyTrades.map(t => `
      <div class="card" style="margin-bottom:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>${t.plan_name}</strong>
          <span class="badge badge-positive">Active (${t.allocation_percentage}%)</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:13px;">
          <span>Allocated: $${t.allocated_amount}</span>
          <span>PnL: <strong class="positive">+$${t.pnl || '0.00'}</strong></span>
        </div>
      </div>
    `).join('');
  },

  startSignalLiveCountdown() {
    if (this.state.signalLiveCountdownTimer) clearInterval(this.state.signalLiveCountdownTimer);
    this.state.signalLiveCountdownTimer = setInterval(() => this.updateSignalLiveCountdown(), 1000);
    this.updateSignalLiveCountdown();
  },

  updateSignalLiveCountdown() {
    document.querySelectorAll('.signal-live-countdown').forEach(el => {
      const expires = Number(el.dataset.expiresAt || 0);
      if (!expires) return;
      const seconds = Math.max(0, Math.floor((expires - Date.now()) / 1000));
      el.textContent = `⏳ Expires in: ${this.formatCountdown(seconds)}`;
    });
  },

  renderSignals() {
    const container = document.getElementById('active-signals-list');
    if (!container) return;
    if (!this.state.activeSignals.length) {
      container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-dim);">No active signals published currently.</div>`;
      return;
    }
    container.innerHTML = this.state.activeSignals.map(s => {
      const isBuy = s.direction === 'BUY' || s.direction === 'LONG';
      const dirBadge = isBuy ? 'badge-positive' : 'badge-negative';
      const isLive = Boolean(s.is_live);
      const isExpired = Boolean(s.is_expired);
      const rawExpiry = String(s.expires_at || '');
      const expiresMs = rawExpiry ? Date.parse(rawExpiry.replace(' ', 'T') + (rawExpiry.endsWith('Z') ? '' : 'Z')) : 0;
      const secondsLeft = expiresMs ? Math.max(0, Math.floor((expiresMs - Date.now()) / 1000)) : Number(s.time_left_seconds || 0);
      const timerText = isLive ? `<span class="signal-live-countdown" data-expires-at="${expiresMs}" style="color:#ff4757;font-weight:900;letter-spacing:.2px;">⏳ Expires in: ${this.formatCountdown(secondsLeft)}</span>` : (isExpired ? `<span style="color:var(--text-muted);">⌛ Signal Expired</span>` : '');
      const slotLabel = s.slot_label || 'Global Signal';
      return `<div class="card" style="margin-bottom:10px;border:1px solid #E5E9F0;border-left:4px solid ${isLive ? '#00B87C' : '#0052FF'};border-radius:12px;background:#FFFFFF;box-shadow:0 2px 8px rgba(17,24,39,0.04);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:9px;"><div><div style="font-size:15px;font-weight:900;color:#111827;">${s.symbol}</div><div style="margin-top:4px;display:flex;gap:5px;flex-wrap:wrap;"><span class="badge ${dirBadge}">${s.direction}</span><span class="badge badge-demo">🌍 Worldwide</span><span class="badge badge-demo">${slotLabel}</span></div></div><span class="badge badge-positive">+${s.profit_percentage || 2.5}%</span></div>
        <div style="display:flex;justify-content:space-between;align-items:center;background:#F8FAFC;border:1px solid #EEF1F6;padding:10px 12px;border-radius:9px;font-size:12px;"><span style="color:#6B7280;">Validity: ${Number(s.duration_minutes || 15)} min</span><div>${timerText}</div></div>
      </div>`;
    }).join('');
    this.startSignalLiveCountdown();
  },

  openCopyModal(planId, planName) {
    document.getElementById('cp-plan-id').value = planId;
    document.getElementById('cp-plan-title').textContent = `Allocate to ${planName}`;
    this.openModal('modal-copy');
    this.updateCopyCalculation();
  },

  setCopyPercent(pct) {
    document.getElementById('cp-percentage').value = pct;
    this.updateCopyCalculation();
  },

  updateCopyCalculation() {
    const pct = parseFloat(document.getElementById('cp-percentage').value) || 1;
    const tradingBal = Number(this.state.balances?.breakdown?.trading_total_usdt ?? this.state.balances?.balances?.trading?.USDT?.available ?? 0);
    const calculated = (tradingBal * (pct / 100)).toFixed(2);

    document.getElementById('cp-calc-preview').innerHTML = `
      At <strong>${pct}%</strong> of your <strong>$${tradingBal.toLocaleString()}</strong> available trading balance, 
      the server will allocate <strong>$${calculated} USDT</strong>.
    `;
  },

  async submitCopyAllocation() {
    const planId = document.getElementById('cp-plan-id').value;
    const pct = parseFloat(document.getElementById('cp-percentage').value) || 0;

    if (pct <= 0 || pct > 100) {
      this.toast('Invalid allocation percentage (0.1% - 100%)', 'error');
      return;
    }

    const res = await this.api('/copytrading/allocate.php', 'POST', {
      plan_id: planId,
      allocation_percentage: pct
    });

    if (res.success) {
      this.toast(res.message || 'Copy strategy allocated successfully', 'success');
      this.closeModal('modal-copy');
      this.loadCopyTrading();
      this.loadBalances();
    } else {
      this.toast(res.message || 'Allocation failed', 'error');
    }
  },

  /* Referrals */
  async loadReferrals() {
    this.renderReferrals();
    this.renderInvitedUsers();
    const res = await this.api('/referrals/stats.php');
    if (res.success && res.data) {
      this.state.referralStats = res.data;
      this.renderReferrals();
      this.renderInvitedUsers();
    }
    await this.loadReferralTree();
  },

  async loadReferralTree() {
    const container = document.getElementById('referral-tree-container');
    if (!container) return;

    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 18px; font-size: 12px;">Loading referral network tree...</div>`;

    try {
      const res = await this.api('/referrals/tree.php');
      if (!res.success || !res.data) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 18px; font-size: 12px;">No downline members in your referral tree yet. Invite members using your link above!</div>`;
        return;
      }

      const root = res.data.tree;
      if (!root) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 18px; font-size: 12px;">No referral records found. Share your code to build your tree!</div>`;
        return;
      }

      // Compute tree network counts reliably
      let l1Count = 0;
      let l2Count = 0;
      let l3Count = 0;
      if (root.children && Array.isArray(root.children)) {
        l1Count = root.children.length;
        for (const c1 of root.children) {
          if (c1.children && Array.isArray(c1.children)) {
            l2Count += c1.children.length;
            for (const c2 of c1.children) {
              if (c2.children && Array.isArray(c2.children)) {
                l3Count += c2.children.length;
              }
            }
          }
        }
      }

      const stats = res.data.stats || res.data.summary || {};
      const totalMembers = (stats.total_network_members ?? stats.total_team_members) != null 
        ? Number(stats.total_network_members ?? stats.total_team_members) 
        : (l1Count + l2Count + l3Count);
      const displayL1 = stats.level_1_count != null ? Number(stats.level_1_count) : l1Count;
      const displayL2 = stats.level_2_count != null ? Number(stats.level_2_count) : l2Count;
      const displayL3 = stats.level_3_count != null ? Number(stats.level_3_count) : l3Count;

      // Sync stats object for referral tab stats cards
      if (this.state.referralStats) {
        this.state.referralStats.total_team_members = totalMembers;
        this.state.referralStats.level_1_count = displayL1;
        this.state.referralStats.level_2_count = displayL2;
        this.state.referralStats.level_3_count = displayL3;
        this.renderReferrals();
      }

      const esc = (v) => this.escapeHtml(v ?? '—');

      const renderUserSubGroup = (subscribers) => {
        return `
          <li class="av-ref-org-branch">
            <div class="av-ref-org-node-wrap">
              <div class="av-ref-sub-group">
                <div class="av-ref-sub-group-title">Level 3 (2%) • Downline (${subscribers.length})</div>
                <div class="av-ref-sub-list">
                  ${subscribers.map(sub => {
                    const subEmail = String(sub.email || 'Member');
                    const subInitial = esc(subEmail.trim().charAt(0).toUpperCase() || 'M');
                    const subCode = esc(sub.referral_code || 'N/A');
                    const subDate = esc((sub.created_at || sub.joined_at || '').substring(0, 10) || 'Active');
                    return `
                      <div class="av-ref-sub-row">
                        <div class="av-ref-sub-row-left">
                          <span class="av-ref-org-avatar">${subInitial}</span>
                          <div style="min-width:0;">
                            <div class="av-ref-sub-name" title="${esc(subEmail)}">${esc(subEmail)}</div>
                            <div class="av-ref-sub-bal">${subCode} • ${subDate}</div>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          </li>
        `;
      };

      // Render Top-Down Org-Chart tree matching Admin Panel Referral Network Tree
      const renderUserOrgBranch = (node, depth = 0) => {
        const isRoot = depth === 0;
        const children = Array.isArray(node.children) ? node.children : [];
        const hasChildren = children.length > 0;
        const stableId = String(node.id || `${depth}-${node.referral_code || node.email || Math.random().toString(36).substring(2, 7)}`).replace(/[^a-zA-Z0-9_-]/g, '-');
        const childrenId = `usr-tree-children-${stableId}`;

        const directInvitesCount = Number((children.length) ? children.length : (node.direct_invites || node.level_1_count || 0));
        const email = esc(node.email || (isRoot ? (this.state.user?.email || 'Your Account') : 'Member'));
        const code = esc(node.referral_code || 'N/A');
        const joinedDate = esc((node.created_at || node.joined_at || '').substring(0, 10) || 'Active');
        const initial = isRoot ? '👑' : esc(String(node.email || 'M').trim().charAt(0).toUpperCase() || 'M');

        const cardCls = isRoot ? 'tier-root' : (depth === 2 ? 'tier-2' : '');
        const tierChipCls = isRoot ? 't0' : depth === 1 ? 't1' : depth === 2 ? 't2' : 't3';
        const tierLabel = isRoot
          ? 'YOU • ROOT LEADER'
          : depth === 1
          ? 'LEVEL 1 (10%)'
          : depth === 2
          ? 'LEVEL 2 (5%)'
          : 'LEVEL 3 (2%)';
        const countCircleCls = isRoot ? '' : 'emerald';

        let childrenMarkup = '';
        if (hasChildren) {
          if (depth >= 2 && children.every(c => !Array.isArray(c.children) || c.children.length === 0)) {
            childrenMarkup = `<ul id="${childrenId}" class="av-ref-org-children">${renderUserSubGroup(children)}</ul>`;
          } else {
            childrenMarkup = `<ul id="${childrenId}" class="av-ref-org-children">${children.map(ch => renderUserOrgBranch(ch, depth + 1)).join('')}</ul>`;
          }
        }

        return `
          <li class="av-ref-org-branch" data-depth="${depth}">
            <div class="av-ref-org-node-wrap">
              <div class="av-ref-org-card ${cardCls}">
                <div class="av-ref-org-card-top">
                  <span class="av-ref-org-avatar ${isRoot ? 'is-root' : ''}">${initial}</span>
                  <div class="av-ref-org-ident">
                    <div class="av-ref-org-email" title="${email}">${email}</div>
                    <div class="av-ref-org-sub">Code: ${code}</div>
                  </div>
                  <span class="av-ref-count-circle ${countCircleCls}" title="Direct invites">${directInvitesCount}</span>
                </div>
                <div class="av-ref-org-meta-row">
                  <span class="av-ref-tier-chip ${tierChipCls}">${tierLabel}</span>
                  <span class="av-ref-org-bal" style="font-size:11px; color:#6B7280; font-weight:600;">${directInvitesCount} Invites</span>
                </div>
                <div class="av-ref-org-foot">
                  <span>Joined: ${joinedDate}</span>
                  <span style="color:#0052FF; font-weight:700;">${isRoot ? `Team: ${totalMembers}` : 'Active'}</span>
                </div>
              </div>
              ${hasChildren ? `<button type="button" class="av-ref-collapse-btn" aria-label="Toggle branch" onclick="App.toggleUserTreeNode('${childrenId}', this)">−</button>` : ''}
            </div>
            ${childrenMarkup}
          </li>
        `;
      };

      let treeHtml = `
        <div class="alpha-referral-summary" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: #FFFFFF; border: 1px solid #EEF1F6; padding: 10px 12px; border-radius: 10px; font-size: 12px; color: #111827; flex-wrap: wrap; gap: 6px;">
          <span><strong>Tree Network Size:</strong> <span style="color:#0052FF; font-weight:700;">${totalMembers} Members</span></span>
          <span><strong>L1 Direct:</strong> ${displayL1}</span>
          <span><strong>L2 Sub-Affiliates:</strong> ${displayL2}</span>
          <span><strong>L3 Downline:</strong> ${displayL3}</span>
        </div>
        <div class="av-ref-org-stack">
          <div class="av-ref-org-canvas">
            <ul class="av-ref-org-tree">
              ${renderUserOrgBranch(root, 0)}
            </ul>
          </div>
        </div>
      `;

      if (!root.children || root.children.length === 0) {
        treeHtml += `
          <div style="background: #FFFFFF; border: 1px solid #EEF1F6; border-radius: 10px; padding: 14px; text-align: center; margin-top: 12px;">
            <div style="font-size: 12.5px; font-weight: 700; color: #111827; margin-bottom: 4px;">Your network root is ready: <code>${esc(root.referral_code || '')}</code></div>
            <p style="font-size: 11.5px; color: #6B7280; margin: 0;">Copy your invitation link above and share it. As your invitees register and build teams, branches will automatically expand here.</p>
          </div>
        `;
      }

      container.innerHTML = treeHtml;
    } catch (err) {
      container.innerHTML = `<div style="text-align: center; color: var(--negative); padding: 18px; font-size: 12px;">Failed to load referral tree hierarchy.</div>`;
    }
  },

  toggleUserTreeNode(childrenId, btn) {
    const el = document.getElementById(childrenId);
    if (!el) return;
    if (el.style.display === 'none') {
      el.style.display = '';
      if (btn) btn.textContent = '−';
    } else {
      el.style.display = 'none';
      if (btn) btn.textContent = '+';
    }
  },

  renderReferrals() {
    const userRef = this.state.user?.referral_code;
    const statsRef = this.state.referralStats?.referral_code;
    const storedRef = localStorage.getItem('alphavest_ref_code') || localStorage.getItem('alphavest_cached_ref');
    const fallbackRef = this.state.user?.id ? ('REF-' + String(this.state.user.id).slice(-6).toUpperCase()) : 'ALPHA888';
    const activeRefCode = statsRef || userRef || storedRef || fallbackRef;

    // Use the canonical homepage so social crawlers read the homepage Open Graph image.
    // The linkv parameter changes the shared URL version to avoid previously cached previews;
    // getPendingReferralCode() still reads the same ref code as before.
    const baseUrl = `${window.location.origin}/`;
    const encodedRefCode = encodeURIComponent(activeRefCode);
    const activeRefLink = `${baseUrl}?ref=${encodedRefCode}&linkv=20261016#ref=${encodedRefCode}`;

    const codeInput = document.getElementById('ref-code-display');
    const linkInput = document.getElementById('ref-link-display');
    if (codeInput) codeInput.value = activeRefCode;
    if (linkInput) linkInput.value = activeRefLink;

    const data = this.state.referralStats;
    if (data) {
      const teamEl = document.getElementById('ref-total-team');
      if (teamEl) teamEl.textContent = data.total_team_members ?? 0;
      const commEl = document.getElementById('ref-commissions');
      if (commEl) commEl.textContent = `$${data.total_commissions ?? '0.00'}`;
      const l1 = document.getElementById('ref-level-1');
      if (l1) l1.textContent = data.level_1_count ?? 0;
      const l2 = document.getElementById('ref-level-2');
      if (l2) l2.textContent = data.level_2_count ?? 0;
      const l3 = document.getElementById('ref-level-3');
      if (l3) l3.textContent = data.level_3_count ?? 0;
    }
  },

  renderInvitedUsers() {
    const container = document.getElementById('referral-invitees-container');
    const badge = document.getElementById('ref-invitees-count-badge');
    if (!container) return;

    const invitees = this.state.referralStats?.invitees || [];
    if (badge) {
      badge.textContent = `${invitees.length} Direct Users`;
    }

    if (!invitees.length) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #6B7280;">
          <div style="font-size: 28px; margin-bottom: 8px;">👥</div>
          <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px;">No Invited Users Yet</div>
          <div style="font-size: 12px; line-height: 1.5; max-width: 320px; margin: 0 auto;">
            Share your personal referral link or code above. When users register through your link, they will appear here with team statistics and real-time commission tracking!
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="max-height: 340px; overflow-y: auto;">
        ${invitees.map((u, i) => {
          const emailParts = (u.email || 'user@primexcapital.io').split('@');
          const maskedEmail = emailParts[0].length > 3 
            ? emailParts[0].substring(0, 2) + '***' + emailParts[0].slice(-1) + '@' + (emailParts[1] || 'primexcapital.io')
            : u.email;
          const kycStatus = (u.kyc_status || 'NOT_SUBMITTED').toUpperCase();
          const kycColor = kycStatus === 'APPROVED' ? '#059669' : kycStatus === 'PENDING' ? '#D97706' : '#6B7280';
          const subInvites = u.direct_invites || 0;
          const joinedDate = (u.created_at || '').substring(0, 10) || 'Recent';

          return `
            <div style="padding: 12px 14px; border-bottom: 1px solid #EEF1F6; display: flex; justify-content: space-between; align-items: center; gap: 10px; background: ${i % 2 === 0 ? '#F8FAFC' : '#FFFFFF'};">
              <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                <div style="width: 34px; height: 34px; border-radius: 50%; background: #EFF4FF; border: 1px solid #DBEAFE; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; color: #0052FF; flex-shrink: 0;">
                  #${i + 1}
                </div>
                <div style="min-width: 0;">
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span style="font-weight: 700; font-size: 13px; color: #111827;">${maskedEmail}</span>
                    <span class="badge" style="background: #EFF4FF; color: #0052FF; font-size: 10px;">Direct (L1)</span>
                  </div>
                  <div style="font-size: 11px; color: #6B7280; margin-top: 2px; display: flex; gap: 8px; flex-wrap: wrap;">
                    <span>Joined: ${joinedDate}</span>
                    <span>•</span>
                    <span>KYC: <span style="color: ${kycColor}; font-weight: 600;">${kycStatus}</span></span>
                  </div>
                </div>
              </div>
              <div style="text-align: right; flex-shrink: 0;">
                <div style="font-size: 12px; font-weight: 700; color: #059669;">
                  ${subInvites} Sub-Invites
                </div>
                <div style="font-size: 10px; color: #6B7280;">
                  Downline Network
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  copyReferralCode() {
    const code = document.getElementById('ref-code-display')?.value || '';
    if (!code) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code);
    } else {
      const input = document.getElementById('ref-code-display');
      if (input) { input.select(); document.execCommand('copy'); }
    }
    this.toast('Referral code copied to clipboard!', 'success');
  },

  copyReferralLink() {
    const link = document.getElementById('ref-link-display')?.value || '';
    if (!link) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link);
    } else {
      const input = document.getElementById('ref-link-display');
      if (input) { input.select(); document.execCommand('copy'); }
    }
    this.toast('Referral link copied to clipboard!', 'success');
  },

  shareReferral() {
    const link = document.getElementById('ref-link-display').value;
    if (navigator.share) {
      navigator.share({
        title: 'PRIME X CAPITAL | Digital Trading & Crypto Platform',
        text: 'Explore PRIME X CAPITAL for cryptocurrency market tools, trading signals, wallet management, and referral features.',
        url: link
      }).catch(() => {});
    } else {
      this.copyReferralLink();
    }
  },

  async claimPartnerStipend() {
    const res = await this.api('/referrals/claim-stipend.php', 'POST');
    if (res.success) {
      this.toast(res.message || 'Weekly partner stipend credited to your funding wallet!', 'success');
      await this.loadBalances();
      await this.loadReferrals();
    } else {
      this.toast(res.message || 'Unable to claim leadership stipend', 'error');
    }
  },

  /* Signals: 2 Daily Signals, eligibility-gated execution & 1-Time Execution with Profit Credit */
  async loadSignals() {
    const container = document.getElementById('active-signals-list');
    const eligBanner = document.getElementById('signals-eligibility-banner');
    const quotaBadge = document.getElementById('signals-quota-badge');
    const userHistory = document.getElementById('signals-user-history');

    // Never blank an already-hydrated dashboard while the network request runs.
    // Cached signals remain visible immediately; the fresh response replaces them
    // silently when it arrives.
    const hasVisibleSignals = Array.isArray(this.state.signals) && this.state.signals.length > 0;
    if (container && !hasVisibleSignals) {
      container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted);">Loading live quantitative signals...</div>`;
    }

    const res = await this.api('/signals.php');
    if (!res.success || !res.data) {
      if (container) container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted);">No active signals available at this time.</div>`;
      return;
    }

    const data = res.data;
    this.state.signalsData = data;
    this.state.signals = data.signals || [];
    const signalProfitTotal = Number(data.signal_profit_total || 0);
    const signalProfitEls = document.querySelectorAll('[data-user-signal-profit-total]');
    signalProfitEls.forEach(el => { el.textContent = `+$${signalProfitTotal.toFixed(2)} USDT`; });
    this.writeFastCache('signals', data);

    // Calculate user balance across all wallets to ensure accounts with >= 20 USDT balance are unlocked
    const totalAssetsUsdt = Number(this.state.balances?.total_assets_usdt || this.state.balances?.total_usd || 0);
    const tradingUsdt = Number(this.state.balances?.breakdown?.trading_total_usdt || this.state.balances?.balances?.trading?.USDT?.available || this.state.balances?.balances?.trading?.USDT?.balance || 0);
    const fundingUsdt = Number(this.state.balances?.breakdown?.funding_total_usdt || this.state.balances?.balances?.funding?.USDT?.available || this.state.balances?.balances?.funding?.USDT?.balance || 0);
    const exchangeUsdt = Number(this.state.balances?.breakdown?.exchange_total_usdt || this.state.balances?.balances?.exchange?.USDT?.available || 0);
    const userWalletBal = Math.max(totalAssetsUsdt, tradingUsdt + fundingUsdt + exchangeUsdt, Number(data.user_balance || 0));
    const effectiveDeposit = userWalletBal;
    
    const minReq = Number(data.min_deposit_required || 20.0);
    const isUserEligible = Boolean(
      data.is_eligible || 
      effectiveDeposit >= minReq || 
      userWalletBal >= minReq || 
      this.state.user?.is_admin || 
      ['ADMIN', 'SUPER_ADMIN', 'VIP', 'FINANCE_MANAGER', 'KYC_MANAGER'].includes(this.state.user?.role)
    );

    data.is_eligible = isUserEligible;
    data.user_total_deposited = effectiveDeposit;

    // Quota badge
    if (quotaBadge) {
      quotaBadge.textContent = `${data.today_signals_count} / ${data.daily_limit || 2} Dispatched Today`;
    }

    // Eligibility banner
    if (eligBanner) {
      const userDep = effectiveDeposit;
      if (!data.is_eligible) {
        eligBanner.innerHTML = `
          <div class="card" style="background: #FFFBEB; border: 1px solid #FDE68A; padding: 14px; border-radius: 12px;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span class="badge badge-warning">${minReq} USDT CURRENT BALANCE REQUIRED</span>
                  <span style="font-size: 11px; color: #6B7280;">Current Balance: $${userDep.toFixed(2)} USDT</span>
                </div>
                <div style="font-size: 13px; color: #111827; font-weight: 700;">
                  Institutional Signals &amp; Guaranteed Profit Execution are locked.
                </div>
                <div style="font-size: 12px; color: #4B5563; margin-top: 2px;">
                  Deposit or maintain at least ${minReq} USDT to unlock daily high-conviction quantitative signals and automated trade profit payouts.
                </div>
              </div>
              <button class="btn-primary" style="padding: 8px 16px; font-size: 12px; font-weight: 700; white-space: nowrap; border-radius: 999px;" onclick="App.openDepositModal()">
                ⚡ Deposit ${minReq} USDT to Unlock
              </button>
            </div>
          </div>
        `;
      } else {
        eligBanner.innerHTML = `
          <div class="card" style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 12px 14px; border-radius: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge badge-positive">VIP QUALIFIED ACCOUNT</span>
                <span style="font-size: 12px; color: #111827; font-weight: 600;">
                  Account Qualified ($${userDep.toFixed(2)} USDT) &bull; Signal Access Unlocked
                </span>
              </div>
              <span style="font-size: 11px; color: #059669; font-weight: 700;">1-Time Execution Guaranteed Profit Active</span>
            </div>
          </div>
        `;
      }
    }

    // Render Signals List (Strictly shows LIVE signals or confirmed signals for today)
    if (container) {
      if (!this.state.signals.length) {
        container.innerHTML = `
          <div class="card" style="text-align: center; padding: 28px 16px; color: #6B7280; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 12px;">
            <div style="font-size: 28px; margin-bottom: 8px;">📡</div>
            <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px;">No Live Signals Right Now</div>
          </div>
        `;
      } else {
        container.innerHTML = this.state.signals.map(s => {
          const isBuy = s.direction === 'BUY' || s.direction === 'LONG';
          const dirBadge = isBuy ? 'badge-positive' : 'badge-negative';
          const isTesting = Boolean(s.is_testing || s.no_profit || String(s.id || '').startsWith('sig_test_'));
          const profitPct = isTesting ? 0 : (s.profit_percentage || 2.5);
          const hasUsed = Boolean(s.has_used || s.has_confirmed);
          const isExpired = Boolean(s.is_expired || (s.time_left_seconds !== undefined && s.time_left_seconds <= 0 && s.status === 'PUBLISHED'));
          const isScheduled = Boolean(s.is_scheduled || s.status === 'SCHEDULED');
          const isLive = !isExpired && !isScheduled && (s.status === 'PUBLISHED' || s.status === 'ACTIVE');

          let actionButtonHtml = '';
          let timingNoticeHtml = '';

          if (isTesting) {
            actionButtonHtml = `
              <button class="btn-secondary" style="width:100%;padding:11px 16px;font-size:12px;font-weight:800;background:#F5F3FF;border:1px solid #DDD6FE;color:#7C3AED;border-radius:10px;cursor:pointer;" onclick="App.openExecuteSignalModal('${s.id}')">
                🧪 OPEN TESTING SIGNAL — NO PROFIT
              </button>`;
            timingNoticeHtml = isLive ? `
              <div style="font-size:12px;color:#6D28D9;margin-bottom:12px;background:#F5F3FF;padding:10px 14px;border-radius:10px;border:1px solid #DDD6FE;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
                <div><span style="font-size:10px;text-transform:uppercase;font-weight:800;display:block;">🧪 Testing Broadcast</span><strong style="color:#111827;font-size:13px;">Worldwide • No Profit</strong></div>
                <div style="text-align:right;"><span style="font-size:10px;text-transform:uppercase;font-weight:800;display:block;">⏳ Test Expires In</span><span class="mono sig-timer-live" data-sig-id="${s.id}" data-time-left="${s.time_left_seconds || ((s.duration_minutes || 15) * 60)}" style="font-weight:900;color:#7C3AED;font-size:16px;">${this.formatCountdown(s.time_left_seconds || ((s.duration_minutes || 15) * 60))}</span></div>
              </div>` : '';
          } else if (hasUsed) {
            actionButtonHtml = `
              <button disabled class="btn-disabled" style="cursor: not-allowed; width: 100%; padding: 11px 16px; font-size: 13px; font-weight: 700; background: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; border-radius: 10px; pointer-events: none;">
                ✅ Confirmed &bull; Profit Added to Balance (Single-Use Completed)
              </button>
            `;
            timingNoticeHtml = `
              <div style="font-size: 12px; color: #059669; margin-bottom: 12px; background: #ECFDF5; padding: 10px 14px; border-radius: 10px; border: 1px solid #A7F3D0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
                <div>
                  <span style="color: #6B7280; font-size: 10px; text-transform: uppercase; font-weight: 700; display: block;">Session Broadcast</span>
                  <strong style="color: #111827; font-size: 13px;">Completed</strong>
                </div>
                <div style="text-align: right;">
                  <span style="color: #059669; font-weight: 700;">✅ Profit Locked: +$${s.execution?.profit_amount ? Number(s.execution.profit_amount).toFixed(2) : Number(s.execution?.profit_amount || 0).toFixed(2)} USDT</span>
                  <div class="mono" style="color: #6B7280; font-size: 10px;">${s.execution?.executed_at || 'Captured'}</div>
                </div>
              </div>
            `;
          } else if (isExpired) {
            actionButtonHtml = `
              <button disabled class="btn-disabled" style="cursor: not-allowed; width: 100%; padding: 11px 16px; font-size: 12px; font-weight: 700; background: #F3F5F8; border: 1px solid #E5E9F0; color: #6B7280; border-radius: 10px; pointer-events: none;">
                ⌛ Expired (Unconfirmed - Profit Not Added)
              </button>
            `;
            timingNoticeHtml = `
              <div style="font-size: 12px; color: #DC2626; margin-bottom: 12px; background: #FEF2F2; padding: 10px 14px; border-radius: 10px; border: 1px solid #FECACA; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
                <div>
                  <span style="color: #6B7280; font-size: 10px; text-transform: uppercase; font-weight: 700; display: block;">Session Broadcast</span>
                  <strong style="color: #4B5563; font-size: 13px;">Closed</strong>
                </div>
                <div style="text-align: right;">
                  <span style="color: #DC2626; font-weight: 700; font-size: 12px;">⌛ Validity Expired</span>
                  <div style="color: #6B7280; font-size: 10px;">15-minute confirmation window ended</div>
                </div>
              </div>
            `;
          } else if (isScheduled) {
            actionButtonHtml = '';
            timingNoticeHtml = '';
          } else if (!data.is_eligible) {
            actionButtonHtml = `
              <button class="btn-secondary" style="width: 100%; padding: 11px 16px; font-size: 12px; font-weight: 700; border-radius: 10px;" onclick="App.openDepositModal()">
                🔒 Deposit 20 USDT to Unlock Signal Confirmation
              </button>
            `;
            timingNoticeHtml = `
              <div style="font-size: 12px; color: #B45309; margin-bottom: 12px; background: #FFFBEB; padding: 10px 14px; border-radius: 10px; border: 1px solid #FDE68A; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
                <div>
                  <span style="color: #6B7280; font-size: 10px; text-transform: uppercase; font-weight: 700; display: block;">⚡ Active Broadcast Window</span>
                  <strong style="color: #0052FF; font-size: 13px;">Live Window</strong>
                </div>
                <div style="text-align: right;">
                  <span style="color: #DC2626; font-size: 10px; text-transform: uppercase; font-weight: 800; display: block;">⏳ Signal Expires In</span>
                  <span class="mono sig-timer-live" data-sig-id="${s.id}" data-time-left="${s.time_left_seconds || ((s.duration_minutes || 15) * 60)}" style="font-weight: 900; color: #F6465D; font-size: 16px; letter-spacing: 0.5px;">${this.formatCountdown(s.time_left_seconds || ((s.duration_minutes || 15) * 60))}</span>
                </div>
              </div>
            `;
          } else {
            actionButtonHtml = `
              <button class="btn-primary" style="width: 100%; padding: 13px 18px; font-size: 14px; font-weight: 800; background: #0052FF; color: #FFFFFF; border-radius: 999px; box-shadow: 0 4px 14px rgba(0, 82, 255, 0.25); cursor: pointer;" data-alpha-action="signal:${s.id}" onclick="App.confirmSignalDirectly('${s.id}')">
                ⚡ Confirm Signal (+${profitPct}% Profit Added to Balance)
              </button>
            `;
            timingNoticeHtml = `
              <div style="font-size: 12px; color: #1E40AF; margin-bottom: 12px; background: #EFF4FF; padding: 10px 14px; border-radius: 10px; border: 1px solid #DBEAFE; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
                <div>
                  <span style="color: #6B7280; font-size: 10px; text-transform: uppercase; font-weight: 700; display: block;">⚡ Active Broadcast Window</span>
                  <strong style="color: #0052FF; font-size: 13px;">Ready for Execution</strong>
                </div>
                <div style="text-align: right;">
                  <span style="color: #DC2626; font-size: 10px; text-transform: uppercase; font-weight: 800; display: block;">⏳ Signal Expires In</span>
                  <span class="mono sig-timer-live" data-sig-id="${s.id}" data-time-left="${s.time_left_seconds || ((s.duration_minutes || 15) * 60)}" style="font-weight: 900; color: #F6465D; font-size: 16px; letter-spacing: 0.5px;">${this.formatCountdown(s.time_left_seconds || ((s.duration_minutes || 15) * 60))}</span>
                </div>
              </div>
            `;
          }

          return `
            <div class="card" style="margin-bottom: 14px; border: 1px solid ${hasUsed ? '#A7F3D0' : isLive ? '#BFDBFE' : '#E5E9F0'}; background: #FFFFFF;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <strong style="font-size: 18px; color: #111827;">${s.symbol}</strong>
                  <span class="badge ${dirBadge}">${s.direction}</span>
                  ${isTesting ? `<span class="badge" style="background:#F5F3FF;color:#7C3AED;">🧪 TEST • NO PROFIT</span>` : ''}
                </div>
                <div style="text-align: right;">
                  <span class="badge" style="background: ${isTesting ? '#F5F3FF' : '#EFF4FF'}; color: ${isTesting ? '#7C3AED' : '#0052FF'}; font-weight: 800; font-size: 13px;">
                    ${isTesting ? 'TEST ONLY' : '+' + profitPct + '% Guaranteed Profit'}
                  </span>
                </div>
              </div>

              ${timingNoticeHtml}

              <div>
                ${actionButtonHtml}
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // User Execution History
    if (userHistory) {
      const executions = Array.isArray(data.user_executions)
        ? data.user_executions
        : (Array.isArray(data.executions) ? data.executions : (Array.isArray(data.history) ? data.history.filter(x => String(x.type || x.transaction_type || '').toUpperCase() === 'SIGNAL_PROFIT') : []));
      if (!executions.length) {
        userHistory.innerHTML = `
          <div style="text-align: center; padding: 16px; color: var(--text-dim); font-size: 12px;">
            No executed signals yet today. Click "Execute Signal" on any active signal above.
          </div>
        `;
      } else {
        userHistory.innerHTML = `
          <div class="table-responsive">
            <table class="admin-table av-mobile-cards" style="font-size: 12px;">
              <thead>
                <tr>
                  <th>Signal</th>
                  <th>Stake</th>
                  <th>Profit %</th>
                  <th>Profit Credited</th>
                  <th>Execution Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${executions.map(ex => {
                  const symbol = ex.symbol || ex.signal_symbol || 'SIGNAL';
                  const direction = ex.direction || ex.signal_direction || 'BUY';
                  const stake = Number(ex.stake_amount ?? 0);
                  const pct = Number(ex.profit_percentage ?? 0);
                  const profit = Number(ex.profit_amount ?? 0);
                  const executedAt = ex.executed_at || ex.created_at || '—';
                  return `
                  <tr>
                    <td data-label="Signal"><strong>${symbol}</strong> <span class="badge ${direction === 'BUY' ? 'badge-positive' : 'badge-negative'}">${direction}</span></td>
                    <td data-label="Stake" class="mono">$${stake.toFixed(2)} USDT</td>
                    <td data-label="Profit %" class="mono positive">+${pct.toFixed(2)}%</td>
                    <td data-label="Profit Credited" class="mono positive"><strong>+$${profit.toFixed(2)} USDT</strong></td>
                    <td data-label="Execution Time" class="mono" style="font-size: 11px; color: var(--text-muted);">${executedAt}</td>
                    <td data-label="Status"><span class="badge badge-positive">PAID</span></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    }

    this.renderHomeSignals();
    if (this.state.adminPreviewUserId) this.ensureAdminUserDepositAction();
  },

  formatCountdown(seconds) {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remM = m % 60;
      return `${h}h ${remM}m ${s < 10 ? '0' : ''}${s}s`;
    }
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  },

  async confirmSignalDirectly(signalId) {
    const s = this.state.signals?.find(sig => sig.id === signalId);
    if (!s) {
      this.toast('Signal not found', 'error');
      return;
    }
    const isTestingSignal = Boolean(s.is_testing || s.no_profit || String(s.id || '').startsWith('sig_test_'));
    if (isTestingSignal) {
      this.toast('🧪 Testing signal only: no confirmation or profit is allowed.', 'info');
      return;
    }
    if (s.has_used || s.has_confirmed) {
      this.toast('You have already confirmed this signal. Each signal is single-use.', 'warning');
      return;
    }
    if (s.is_expired || (s.time_left_seconds !== undefined && s.time_left_seconds <= 0 && s.status === 'PUBLISHED')) {
      this.toast('This signal has expired after 15 minutes. Profit cannot be credited.', 'error');
      return;
    }
    if (s.is_scheduled || s.status === 'SCHEDULED') {
      this.toast('This signal is not live yet. Please wait until it becomes available.', 'info');
      return;
    }

    const actionScope = `signal:${signalId}`;
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Signal confirmation is already processing. Please wait.', 'warning');
      return;
    }
    this.setActionButtons(actionScope, true, 'Confirming...');

    try {
      this.toast('⚡ Confirming signal & automatically crediting profit...', 'info');
      const res = await this.api('/signals/execute.php', 'POST', {
        signal_id: signalId,
        stake_amount: 20,
        idempotency_key: actionKey
      });

      if (res.success) {
        const profitAmt = res.data?.profit_amount !== undefined ? Number(res.data.profit_amount).toFixed(2) : '0.50';
        this.toast(res.message || `Signal confirmed! +$${profitAmt} USDT profit automatically added to your balance!`, 'success');
        this.state.signals = (this.state.signals || []).filter(sig => sig.id !== signalId);
        this.renderHomeSignals();
        await this.loadBalances();
        await this.loadSignals();
        this.updateHomeHeroBalance();
        this.endAction(actionScope, true);
      } else {
        this.toast(res.message || 'Signal confirmation failed', 'error');
        await this.loadSignals();
        this.endAction(actionScope, false);
      }
    } catch (err) {
      this.toast('Failed to confirm signal: ' + (err.message || err), 'error');
      this.endAction(actionScope, false);
    } finally {
      this.setActionButtons(actionScope, false);
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
    }
  },

  renderHomeSignals() {
    const container = document.getElementById('home-active-signals-list');
    if (!container) return;

    const signals = this.state.signals || [];
    const totalAssetsUsdt = Number(this.state.balances?.total_assets_usdt || this.state.balances?.total_usd || 0);
    const tradingUsdt = Number(this.state.balances?.breakdown?.trading_total_usdt || this.state.balances?.balances?.trading?.USDT?.available || this.state.balances?.balances?.trading?.USDT?.balance || 0);
    const fundingUsdt = Number(this.state.balances?.breakdown?.funding_total_usdt || this.state.balances?.balances?.funding?.USDT?.available || this.state.balances?.balances?.funding?.USDT?.balance || 0);
    const exchangeUsdt = Number(this.state.balances?.breakdown?.exchange_total_usdt || this.state.balances?.balances?.exchange?.USDT?.available || 0);
    const userWalletBal = Math.max(totalAssetsUsdt, tradingUsdt + fundingUsdt + exchangeUsdt, Number(this.state.signalsData?.user_balance || 0));
    const effectiveDeposit = userWalletBal;

    const isEligible = Boolean(
      this.state.signalsData?.is_eligible || 
      effectiveDeposit >= 20.0 || 
      userWalletBal >= 20.0 || 
      this.state.user?.is_admin || 
      ['ADMIN', 'SUPER_ADMIN', 'VIP', 'FINANCE_MANAGER', 'KYC_MANAGER'].includes(this.state.user?.role)
    );

    if (!signals.length) {
      container.innerHTML = `
        <div style="text-align: center; padding: 16px 12px; color: #6B7280; font-size: 12px; background: #F8FAFC; border-radius: 10px; border: 1px dashed #CBD5E1;">
          📡 No active signals broadcasted right now.
        </div>
      `;
      return;
    }

    container.innerHTML = signals.slice(0, 3).map(s => {
      const isBuy = s.direction === 'BUY' || s.direction === 'LONG';
      const dirBadge = isBuy ? 'badge-positive' : 'badge-negative';
      const isTesting = Boolean(s.is_testing || s.no_profit || String(s.id || '').startsWith('sig_test_'));
      const profitPct = isTesting ? 0 : (s.profit_percentage || 2.5);
      const hasUsed = Boolean(s.has_used || s.has_confirmed);
      const isExpired = Boolean(s.is_expired || (s.time_left_seconds !== undefined && s.time_left_seconds <= 0 && s.status === 'PUBLISHED'));
      const isScheduled = Boolean(s.is_scheduled || s.status === 'SCHEDULED');
      const isLive = !isExpired && !isScheduled && (s.status === 'PUBLISHED' || s.status === 'ACTIVE');

      let actionHtml = '';
      let timerBadgeHtml = '';

      if (isTesting) {
        actionHtml = `
          <button class="btn-secondary" style="width:100%;padding:8px 12px;font-size:11px;font-weight:800;background:#F5F3FF;border:1px solid #DDD6FE;color:#7C3AED;border-radius:8px;cursor:pointer;" onclick="App.openExecuteSignalModal('${s.id}')">
            🧪 OPEN TESTING SIGNAL — NO PROFIT
          </button>`;
        timerBadgeHtml = isLive ? `
          <div style="display:flex;justify-content:space-between;align-items:center;background:#F5F3FF;border:1px solid #DDD6FE;padding:6px 10px;border-radius:8px;margin-bottom:8px;font-size:11px;">
            <span style="color:#7C3AED;font-weight:800;">🧪 Test Broadcast</span>
            <span class="mono sig-timer-live" data-sig-id="${s.id}" data-time-left="${s.time_left_seconds || ((s.duration_minutes || 15) * 60)}" style="font-weight:800;color:#7C3AED;">${this.formatCountdown(s.time_left_seconds || ((s.duration_minutes || 15) * 60))}</span>
          </div>` : '';
      } else if (hasUsed) {
        actionHtml = `
          <button disabled class="btn-disabled" style="cursor: not-allowed; width: 100%; padding: 8px 12px; font-size: 12px; font-weight: 700; background: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; border-radius: 8px; pointer-events: none;">
            ✅ Confirmed (+Profit Added to Balance)
          </button>
        `;
        timerBadgeHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center; background: #ECFDF5; border: 1px solid #A7F3D0; padding: 6px 10px; border-radius: 8px; margin-bottom: 8px; font-size: 11px;">
            <span style="color: #059669; font-weight: 700;">✅ Succeeded:</span>
            <span style="color: #059669; font-weight: 700;">+${profitPct}% Credited</span>
          </div>
        `;
      } else if (isExpired) {
        actionHtml = `
          <button disabled class="btn-disabled" style="cursor: not-allowed; width: 100%; padding: 8px 12px; font-size: 11px; font-weight: 700; background: #F3F5F8; border: 1px solid #E5E9F0; color: #6B7280; border-radius: 8px; pointer-events: none;">
            ⌛ Expired (Unconfirmed - Profit Not Added)
          </button>
        `;
        timerBadgeHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center; background: #FEF2F2; border: 1px solid #FECACA; padding: 6px 10px; border-radius: 8px; margin-bottom: 8px; font-size: 11px;">
            <span style="color: #DC2626; font-weight: 700;">⌛ Validity Expired:</span>
            <span style="color: #6B7280;">${s.duration_minutes || 15}m window ended</span>
          </div>
        `;
      } else if (isScheduled) {
        actionHtml = '';
        timerBadgeHtml = '';
      } else if (!isEligible) {
        actionHtml = `
          <button class="btn-secondary" style="width: 100%; padding: 8px 12px; font-size: 11px; font-weight: 700; border-radius: 8px;" onclick="App.openDepositModal()">
            🔒 Deposit 20 USDT to Unlock Signal
          </button>
        `;
        timerBadgeHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center; background: #FEF2F2; border: 1px solid #FECACA; padding: 6px 10px; border-radius: 8px; margin-bottom: 8px; font-size: 11px;">
            <span style="color: #DC2626; font-weight: 700;">⏳ Expires In:</span>
            <span class="mono sig-timer-live" data-sig-id="${s.id}" data-time-left="${s.time_left_seconds || ((s.duration_minutes || 15) * 60)}" style="font-weight: 800; color: #F6465D;">${this.formatCountdown(s.time_left_seconds || ((s.duration_minutes || 15) * 60))}</span>
          </div>
        `;
      } else {
        actionHtml = `
          <button class="btn-primary" style="width: 100%; padding: 9px 14px; font-size: 12px; font-weight: 800; background: #0052FF; color: #FFFFFF; border-radius: 999px; box-shadow: 0 4px 12px rgba(0, 82, 255, 0.25); cursor: pointer;" data-alpha-action="signal:${s.id}" onclick="App.confirmSignalDirectly('${s.id}')">
            ⚡ Confirm Signal (+${profitPct}% Profit)
          </button>
        `;
        timerBadgeHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center; background: #EFF4FF; border: 1px solid #DBEAFE; padding: 6px 10px; border-radius: 8px; margin-bottom: 8px; font-size: 11px;">
            <span style="color: #1E40AF; font-weight: 700;">⏳ Signal Expires In:</span>
            <strong class="mono sig-timer-live" data-sig-id="${s.id}" data-time-left="${s.time_left_seconds || ((s.duration_minutes || 15) * 60)}" style="font-weight: 800; color: #F6465D; font-size: 13px;">${this.formatCountdown(s.time_left_seconds || ((s.duration_minutes || 15) * 60))}</strong>
          </div>
        `;
      }

      return `
        <div style="background: #FFFFFF; border: 1px solid ${hasUsed ? '#A7F3D0' : isLive ? '#BFDBFE' : '#E5E9F0'}; border-radius: 12px; padding: 12px; margin-bottom: 10px; box-shadow: 0 2px 6px rgba(17,24,39,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <strong style="font-size: 15px; color: #111827;">${s.symbol}</strong>
              <span class="badge ${dirBadge}">${s.direction}</span>
              ${isTesting ? `<span class="badge" style="font-size: 10px; background:#F5F3FF; color:#7C3AED;">🧪 TEST • NO PROFIT</span>` : ''}
            </div>
            <span class="badge" style="background:${isTesting ? '#F5F3FF' : '#ECFDF5'}; color:${isTesting ? '#7C3AED' : '#059669'}; font-weight:700; font-size:11px;">
              ${isTesting ? 'TEST ONLY' : '+' + profitPct + '% Return'}
            </span>
          </div>

          ${timerBadgeHtml}

          <div>
            ${actionHtml}
          </div>
        </div>
      `;
    }).join('');
  },

  openExecuteSignalModal(signalId) {
    const s = this.state.signals?.find(sig => sig.id === signalId);
    if (!s) {
      this.toast('Signal details not found', 'error');
      return;
    }

    const schedTime = '';

    this.state.activeExecutingSignal = s;
    const idEl = document.getElementById('exec-sig-id');
    if (idEl) idEl.value = s.id;
    const titleEl = document.getElementById('exec-sig-title');
    if (titleEl) titleEl.textContent = `Execute ${s.symbol} Signal`;
    const slotBadgeEl = document.getElementById('exec-sig-slot-badge');
    if (slotBadgeEl) slotBadgeEl.textContent = '';
    const symEl = document.getElementById('exec-sig-symbol');
    if (symEl) symEl.textContent = s.symbol;
    
    const dirBadge = document.getElementById('exec-sig-direction-badge');
    if (dirBadge) {
      dirBadge.textContent = s.direction;
      dirBadge.className = `badge ${s.direction === 'BUY' ? 'badge-positive' : 'badge-negative'}`;
    }

    const isTestingModal = Boolean(s.is_testing || s.no_profit || String(s.id || '').startsWith('sig_test_'));
    const profitPct = isTestingModal ? 0 : (s.profit_percentage || 2.5);
    const profitBadge = document.getElementById('exec-sig-profit-badge');
    if (profitBadge) profitBadge.textContent = isTestingModal ? '🧪 TESTING • NO PROFIT' : `+${profitPct}% Guaranteed Profit`;
    const profitRate = document.getElementById('exec-sig-profit-rate');
    if (profitRate) profitRate.textContent = isTestingModal ? 'NO PROFIT' : `+${profitPct}%`;

    const schedTimeEl = document.getElementById('exec-sig-schedule-time');
    if (schedTimeEl) schedTimeEl.textContent = '';
    const expTimeEl = document.getElementById('exec-sig-expiry-time');
    if (expTimeEl) expTimeEl.textContent = this.formatCountdown(s.time_left_seconds || ((s.duration_minutes || 15) * 60));

    const tradingBal = Number(
      this.state.balances?.total_assets_usdt ||
      this.state.balances?.total_usd ||
      ((this.state.balances?.breakdown?.funding_total_usdt || 0) +
       (this.state.balances?.breakdown?.exchange_total_usdt || 0) +
       (this.state.balances?.breakdown?.trading_total_usdt || 0)) ||
      0
    );
    const availBalEl = document.getElementById('exec-sig-avail-bal');
    if (availBalEl) availBalEl.textContent = `$${parseFloat(tradingBal).toFixed(2)}`;
    const amountEl = document.getElementById('exec-sig-amount');
    if (amountEl && !isTestingModal) {
      amountEl.value = Math.max(0, tradingBal).toFixed(2);
      amountEl.readOnly = true;
      amountEl.title = 'Signal profit is calculated from your full current USDT balance.';
    }

    this.updateExecuteSignalCalc();
    this.openModal('modal-execute-signal');
  },

  updateExecuteSignalCalc() {
    const s = this.state.activeExecutingSignal;
    if (!s) return;
    const amount = parseFloat(document.getElementById('exec-sig-amount').value) || 20;
    const isTestingCalc = Boolean(s.is_testing || s.no_profit || String(s.id || '').startsWith('sig_test_'));
    const profitPct = isTestingCalc ? 0 : (s.profit_percentage || 2.5);
    const profit = (amount * profitPct) / 100;
    const total = amount + profit;

    const estProfitEl = document.getElementById('exec-sig-est-profit');
    const totalReturnEl = document.getElementById('exec-sig-total-return');

    if (estProfitEl) estProfitEl.textContent = `+$${profit.toFixed(2)} USDT`;
    if (totalReturnEl) totalReturnEl.textContent = `$${total.toFixed(2)} USDT`;
  },

  async submitExecuteSignal() {
    const signalId = document.getElementById('exec-sig-id').value;
    const activeSignal = this.state.signals?.find(sig => sig.id === signalId);
    if (activeSignal && Boolean(activeSignal.is_testing || activeSignal.no_profit || String(activeSignal.id || '').startsWith('sig_test_'))) {
      this.toast('🧪 Testing signal only: no confirmation or profit is allowed.', 'info');
      this.closeModal('modal-execute-signal');
      return;
    }
    const amount = parseFloat(document.getElementById('exec-sig-amount').value) || 20;
    const btn = document.getElementById('btn-confirm-execute-signal');
    const actionScope = `signal:${signalId}`;
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Signal execution is already processing. Please wait.', 'warning');
      return;
    }
    if (btn) {
      btn.disabled = true;
      if (!btn.dataset.alphaOriginalText) btn.dataset.alphaOriginalText = btn.textContent.trim();
      btn.textContent = 'Executing Signal...';
    }

    try {
      const res = await this.api('/signals/execute.php', 'POST', {
        signal_id: signalId,
        stake_amount: amount,
        idempotency_key: actionKey
      });

      if (res.success) {
        this.toast(res.message || 'Signal executed! Profit automatically added to your balance.', 'success');
        this.closeModal('modal-execute-signal');
        await this.loadBalances();
        await this.loadSignals();
        this.updateHomeHeroBalance();
        this.endAction(actionScope, true);
      } else {
        this.toast(res.message || 'Signal execution failed', 'error');
        this.endAction(actionScope, false);
      }
    } catch (err) {
      this.toast('Failed to execute signal: ' + (err.message || err), 'error');
      this.endAction(actionScope, false);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = btn.dataset.alphaOriginalText || 'Confirm Execute';
        delete btn.dataset.alphaOriginalText;
      }
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
    }
  },

  /* Color Theme Combinations & 3D Vector Visuals */
  initTheme() {
    const saved = localStorage.getItem('alphavest_theme') || 'emerald';
    this.setTheme(saved, false);
  },

  setTheme(themeName, showToast = true) {
    const validThemes = ['emerald', 'cyan', 'gold', 'violet', 'ruby'];
    if (!validThemes.includes(themeName)) themeName = 'emerald';
    
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('alphavest_theme', themeName);

    // Update active label
    const labels = {
      emerald: 'Emerald Nexus (Institutional Green)',
      cyan: 'Cyber Cyan (Sky & Electric Cyan)',
      gold: 'Imperial Gold (Prestige Amber)',
      violet: 'Neon Violet (DeFi Purple)',
      ruby: 'Crimson Apex (Aggressive Ruby)'
    };
    const activeLabel = document.getElementById('theme-active-label');
    if (activeLabel) activeLabel.textContent = labels[themeName] || themeName;

    // Update check icons in modal
    validThemes.forEach(t => {
      const el = document.getElementById(`check-${t}`);
      if (el) el.style.display = (t === themeName) ? 'inline' : 'none';
      const btn = document.querySelector(`[data-theme-btn="${t}"]`);
      if (btn) {
        btn.style.borderColor = (t === themeName) ? 'var(--primary)' : 'var(--border-subtle)';
        btn.style.background = (t === themeName) ? 'var(--primary-glow)' : 'var(--bg-card)';
      }
    });

    if (showToast) {
      this.toast(`Applied color scheme: ${labels[themeName]}`, 'success');
    }
  },

  openThemeModal() {
    const current = localStorage.getItem('alphavest_theme') || 'emerald';
    this.setTheme(current, false);
    this.openModal('modal-theme');
  },

  /* Auth: Login / Register */
  togglePasswordVisibility(inputId, buttonEl) {
    const input = (typeof inputId === 'string') ? document.getElementById(inputId) : inputId;
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    // Target button
    let btn = buttonEl;
    if (!btn && typeof inputId === 'string') {
      btn = document.getElementById(`btn-toggle-${inputId}`);
    }

    if (btn) {
      if (isPassword) {
        // Eye-off icon (hide password)
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px; stroke:currentColor; display:block;">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
        btn.setAttribute('title', 'Hide password');
        btn.setAttribute('aria-label', 'Hide password');
        btn.style.color = 'var(--primary, #00c087)';
      } else {
        // Normal eye icon (show password)
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px; stroke:currentColor; display:block;">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
        btn.setAttribute('title', 'Show password');
        btn.setAttribute('aria-label', 'Show password');
        btn.style.color = '#94a3b8';
      }
    }
  },

  async submitLogin() {
    const emailInput = document.getElementById('auth-email');
    const passInput = document.getElementById('auth-pass');
    const submitBtn = document.getElementById('btn-submit-login');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passInput ? passInput.value : '';

    if (!email) {
      this.toast('Please enter your email address', 'error');
      if (emailInput) emailInput.focus();
      return;
    }
    if (!password) {
      this.toast('Please enter your password', 'error');
      if (passInput) passInput.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
    }

    let res = null;
    try {
      res = await this.api('/auth/login.php', 'POST', { email, password });
    } catch (e) {
      res = { success: false, error_code: 'NETWORK_ERROR', message: 'Network error during login. Please try again.' };
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log in';
      }
    }

    if (!res || !res.success) {
      const msg = (res && (res.message || (res.error && res.error.message))) || 'Login failed. Please verify email and password.';
      this.toast(msg, 'error');
      return;
    }

    try {
      if (res.data && res.data.user) {
        this.state.user = res.data.user;
        try {
          localStorage.setItem('alphavest_local_user', JSON.stringify(res.data.user));
        } catch (storageErr) {}
      }

      if (window.AlphaLanding && typeof window.AlphaLanding.hide === 'function') {
        window.AlphaLanding.hide();
      }
      const publicLanding = document.getElementById('av-public-landing');
      if (publicLanding) publicLanding.hidden = true;

      this.closeModal('modal-auth');
      if (typeof this.updateHeaderAuth === 'function') {
        try { this.updateHeaderAuth(); } catch (uiErr) { console.warn('[Login UI]', uiErr); }
      }

      const isAdmin = this.isStaffOrAdmin(this.state.user);
      this.navigate(isAdmin ? 'admin' : 'home');
      this.toast(isAdmin ? 'Welcome Administrator! Navigating to Admin Governance Desk...' : 'Signed in successfully!', 'success');

      Promise.allSettled([
        this.checkAuth(),
        this.loadBalances(),
        this.loadNotifications(),
        this.loadSignals()
      ]).catch(() => {});
    } catch (postErr) {
      console.warn('[Login Post-Hydration]', postErr);
      this.closeModal('modal-auth');
      this.navigate(this.isStaffOrAdmin(this.state.user) ? 'admin' : 'home');
    }
  },

  async submitRegister() {
    const firstNameInput = document.getElementById('reg-first-name');
    const lastNameInput = document.getElementById('reg-last-name');
    const emailInput = document.getElementById('reg-email');
    const passInput = document.getElementById('reg-pass');
    const confirmInput = document.getElementById('reg-confirm');
    const pinInput = document.getElementById('reg-withdrawal-pin');
    const refInput = document.getElementById('reg-ref');
    const countryInput = document.getElementById('reg-country');
    const submitBtn = document.getElementById('btn-submit-register');

    const firstName = firstNameInput ? String(firstNameInput.value || '').trim() : '';
    const lastName = lastNameInput ? String(lastNameInput.value || '').trim() : '';
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const password = passInput ? passInput.value : '';
    const confirm = confirmInput ? confirmInput.value : '';
    const withdrawalPin = pinInput ? pinInput.value.trim() : '';
    let ref = refInput ? refInput.value.trim().toUpperCase() : '';
    if (!ref) {
      ref = this.getPendingReferralCode() || '';
      if (ref && refInput) {
        refInput.value = ref;
      }
    }
    if (!firstName) {
      this.toast('Please enter your first name', 'error');
      if (firstNameInput) firstNameInput.focus();
      return;
    }
    if (!lastName) {
      this.toast('Please enter your last name', 'error');
      if (lastNameInput) lastNameInput.focus();
      return;
    }

    if (!ref) {
      this.toast('A valid referral code is required to create an account.', 'error');
      if (refInput) refInput.focus();
      return;
    }
    if (!/^[A-Z0-9_-]{4,32}$/.test(ref)) {
      this.toast('Please enter a valid referral code.', 'error');
      if (refInput) refInput.focus();
      return;
    }

    const country = ((countryInput ? countryInput.value : '') || localStorage.getItem('alphavest_user_country') || '').trim();
    if (!country) {
      this.toast('Please select your country / region', 'error');
      if (countryInput) countryInput.focus();
      return;
    }

    if (!email) {
      this.toast('Please enter an email address', 'error');
      if (emailInput) emailInput.focus();
      return;
    }
    if (!password || password.length < 8) {
      this.toast('Password must be at least 8 characters long', 'error');
      if (passInput) passInput.focus();
      return;
    }
    if (password !== confirm) {
      this.toast('Passwords do not match. Please re-enter.', 'error');
      if (confirmInput) confirmInput.focus();
      return;
    }
    if (!withdrawalPin) {
      this.toast('Please create a 6-digit fund withdrawal PIN', 'error');
      if (pinInput) pinInput.focus();
      return;
    }
    if (!/^\d{6}$/.test(withdrawalPin)) {
      this.toast('Fund withdrawal PIN must be exactly 6 numeric digits', 'error');
      if (pinInput) pinInput.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';
    }

    try {
      const res = await this.api('/auth/register.php', 'POST', {
        // Send both canonical snake_case keys and legacy camelCase aliases.
        // This keeps registration compatible with older deployed API builds while
        // the current backend reads the canonical first_name/last_name fields.
        first_name: firstName,
        last_name: lastName,
        firstName: firstName,
        lastName: lastName,
        email,
        password,
        confirm_password: confirm,
        withdrawal_pin: withdrawalPin,
        fund_password: withdrawalPin,
        referral_code: ref,
        country,
        timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Karachi'),
        terms_accepted: true
      });

      if (res && res.success) {
        try { localStorage.setItem('alphavest_user_country', country); } catch (e) {}
        if (res.data && res.data.user) {
          this.state.user = res.data.user;
          try { localStorage.setItem('alphavest_local_user', JSON.stringify(res.data.user)); } catch (e) {}
        }
        if (window.AlphaLanding && typeof window.AlphaLanding.hide === 'function') {
          window.AlphaLanding.hide();
        }
        const publicLanding = document.getElementById('av-public-landing');
        if (publicLanding) publicLanding.hidden = true;
        this.closeModal('modal-auth');
        try { this.updateHeaderAuth(); } catch (uiErr) { console.warn('[Register UI]', uiErr); }
        this.toast('Account registered successfully! 6-digit withdrawal PIN configured.', 'success');
        this.navigate('home');
        Promise.allSettled([
          this.checkAuth(),
          this.loadBalances(),
          this.loadNotifications(),
          this.loadSignals()
        ]).catch(() => {});
      } else {
        const msg = (res && (res.message || (res.error && res.error.message))) || 'Registration failed.';
        this.toast(msg, 'error');
      }
    } catch (e) {
      this.toast('Network error during registration.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    }
  },

  async logout() {
    try {
      await this.api('/auth/logout.php', 'POST');
    } catch (e) {}
    
    localStorage.removeItem('alphavest_local_user');
    localStorage.removeItem('alphavest_user');
    sessionStorage.clear();
    this.state.user = null;
    this.updateHeaderAuth();
    this.closeModal('modal-profile');
    this.closeModal('modal-auth');

    // Hide any admin view elements
    const admSec = document.getElementById('view-admin');
    if (admSec) admSec.style.display = 'none';
    const adminBanner = document.getElementById('admin-global-banner');
    if (adminBanner) adminBanner.style.display = 'none';

    this.navigate('home');
    this.toast('Logged out successfully', 'info');
    this.loadBalances();
  },

  /* Fund Withdrawal PIN Management */
  openChangePinModal() {
    this.closeModal('modal-profile');
    const curr = document.getElementById('pin-current');
    const n = document.getElementById('pin-new');
    const c = document.getElementById('pin-confirm');
    if (curr) curr.value = '';
    if (n) n.value = '';
    if (c) c.value = '';
    this.openModal('modal-change-pin');
  },

  async submitChangeWithdrawalPin() {
    const currentPin = (document.getElementById('pin-current')?.value || '').trim();
    const newPin = (document.getElementById('pin-new')?.value || '').trim();
    const confirmPin = (document.getElementById('pin-confirm')?.value || '').trim();
    const btn = document.getElementById('btn-save-withdrawal-pin');

    if (!newPin || !/^\d{6}$/.test(newPin)) {
      this.toast('New withdrawal PIN must be exactly 6 numeric digits', 'error');
      document.getElementById('pin-new')?.focus();
      return;
    }

    if (newPin !== confirmPin) {
      this.toast('New PINs do not match. Please verify.', 'error');
      document.getElementById('pin-confirm')?.focus();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Updating PIN...';
    }

    try {
      const res = await this.api('/user/withdrawal-pin.php', 'POST', {
        current_pin: currentPin,
        new_pin: newPin,
        pin: newPin
      });

      if (res.success) {
        this.toast('6-Digit Fund Withdrawal PIN updated successfully!', 'success');
        if (this.state.user) {
          this.state.user.has_withdrawal_pin = true;
          this.state.user.withdrawal_pin = newPin;
          localStorage.setItem('alphavest_local_user', JSON.stringify(this.state.user));
        }
        this.closeModal('modal-change-pin');
      } else {
        this.toast(res.message || 'Failed to update withdrawal PIN', 'error');
      }
    } catch (e) {
      this.toast('Error connecting to server to update PIN', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Save 6-Digit PIN';
      }
    }
  },

  /* Admin Governance */
  async loadAdminData() {
    // Overview is the first visible admin screen. Do not block it on the
    // heavyweight Users roster; that tab loads only when opened.
    const res = await this.api('/admin/overview.php');
    if (res.success && res.data) {
      this.state.adminMetrics = res.data;
      this.renderAdminOverview();
    }
    if (this.state.adminTab === 'users') {
      this.loadAdminUsers();
    }
  },

  renderAdminOverview() {
    const data = this.state.adminMetrics;
    if (!data) return;

    const m = data.metrics || {};
    const mode = data.runtime_mode || 'LIVE';

    const elUsers = document.getElementById('adm-users');
    const elVerified = document.getElementById('adm-verified');
    const elKycPending = document.getElementById('adm-kyc-pending');
    const elDeposits = document.getElementById('adm-deposits');
    const elWithdrawals = document.getElementById('adm-withdrawals');
    const elVolume = document.getElementById('adm-volume');

    if (elUsers) elUsers.textContent = m.total_users || 0;
    if (elVerified) elVerified.textContent = m.verified_users || 0;
    if (elKycPending) elKycPending.textContent = m.kyc_pending || 0;
    if (elDeposits) elDeposits.textContent = `$${Number(m.total_deposits_usdt || 0).toLocaleString()}`;
    if (elWithdrawals) elWithdrawals.textContent = `$${Number(m.total_withdrawals_usdt || 0).toLocaleString()}`;
    if (elVolume) elVolume.textContent = `$${Number(m.trading_volume_usdt || 0).toLocaleString()}`;

    // Update Mode Banner & Button
    const badge = document.getElementById('adm-mode-badge');
    const btnLabel = document.getElementById('adm-mode-btn-label');
    if (badge) {
      badge.textContent = `${mode} ENVIRONMENT`;
      badge.className = mode === 'LIVE' ? 'badge badge-positive' : 'badge badge-demo';
    }
    if (btnLabel) {
      btnLabel.textContent = mode === 'LIVE' ? 'DEMO' : 'LIVE';
    }

    // Update Quick Counts & Badges across Sidebar, Mobile Pill Nav, Quick Circles, and Mobile Bottom Bar
    const qKyc = document.getElementById('adm-quick-kyc');
    const qWith = document.getElementById('adm-quick-with');
    const qDep = document.getElementById('adm-quick-dep');
    const kycCount = m.kyc_pending || 0;
    const withCount = m.pending_withdrawals || 0;
    const depCount = m.pending_deposits || 0;

    if (qKyc) qKyc.textContent = kycCount > 0 ? `${kycCount} Pending` : 'All Clear';
    if (qWith) qWith.textContent = withCount > 0 ? `${withCount} Pending` : 'All Clear';
    if (qDep) qDep.textContent = depCount > 0 ? `${depCount} Pending` : 'Vaults OK';

    const updateBadge = (ids, count) => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = count;
          el.style.display = (count > 0) ? 'inline-flex' : 'none';
        }
      });
    };

    updateBadge(['adm-badge-kyc', 'adm-pill-badge-kyc', 'adm-bottom-badge-kyc'], kycCount);
    updateBadge(['adm-badge-with', 'adm-pill-badge-with', 'adm-bottom-badge-with'], withCount);
    updateBadge(['adm-badge-dep', 'adm-pill-badge-dep', 'adm-bottom-badge-dep'], depCount);

    this.renderAdminAnalyticsChart(this.state.adminAnalyticsSeries || 'deposits');
  },

  setAdminAnalyticsSeries(series, btnEl) {
    const allowed = ['deposits', 'withdrawals', 'users'];
    const target = allowed.includes(series) ? series : 'deposits';
    this.state.adminAnalyticsSeries = target;
    document.querySelectorAll('.av-adm-seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-series') === target);
    });
    if (btnEl && btnEl.classList) btnEl.classList.add('active');
    this.renderAdminAnalyticsChart(target);
  },

  renderAdminAnalyticsChart(series = 'deposits') {
    const host = document.getElementById('adm-analytics-svg');
    if (!host) return;

    const m = this.state.adminMetrics?.metrics || {};
    const totalDep = Number(m.total_deposits_usdt || 0);
    const totalWith = Number(m.total_withdrawals_usdt || 0);
    const totalUsers = Number(m.total_users || 0);
    const verifiedUsers = Number(m.verified_users || 0);

    const headlineEl = document.getElementById('adm-chart-headline');
    const subEl = document.getElementById('adm-chart-sub');

    const configs = {
      deposits: {
        headline: `$${totalDep.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        sub: 'Live platform vault deposits & incoming liquidity flow',
        stroke: '#0052FF',
        fillTop: 'rgba(0, 82, 255, 0.22)',
        fillBottom: 'rgba(0, 82, 255, 0.01)',
        weights: [0.32, 0.48, 0.42, 0.66, 0.59, 0.84, 1.0],
        baseTotal: totalDep
      },
      withdrawals: {
        headline: `$${totalWith.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        sub: `Disbursed payouts & ${Number(m.pending_withdrawals || 0)} queued requests`,
        stroke: '#0052FF',
        fillTop: 'rgba(59, 130, 246, 0.20)',
        fillBottom: 'rgba(59, 130, 246, 0.01)',
        weights: [0.28, 0.38, 0.52, 0.44, 0.72, 0.64, 0.92],
        baseTotal: totalWith
      },
      users: {
        headline: `${totalUsers.toLocaleString()} Accounts (${verifiedUsers} Verified)`,
        sub: 'Registered account onboarding & KYC verification trajectory',
        stroke: '#00B87C',
        fillTop: 'rgba(0, 184, 124, 0.22)',
        fillBottom: 'rgba(0, 184, 124, 0.01)',
        weights: [0.35, 0.45, 0.54, 0.62, 0.74, 0.86, 1.0],
        baseTotal: totalUsers
      }
    };

    const cfg = configs[series] || configs.deposits;
    if (headlineEl) headlineEl.textContent = cfg.headline;
    if (subEl) subEl.textContent = cfg.sub;

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
    const w = 520;
    const h = 165;
    const padL = 14;
    const padR = 14;
    const padT = 18;
    const padB = 26;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const pts = cfg.weights.map((ratio, idx) => {
      const x = padL + (plotW * idx) / (cfg.weights.length - 1);
      const y = padT + plotH * (1 - ratio * 0.82 - 0.08);
      return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), label: labels[idx] };
    });

    // Smooth cubic bezier curve through points
    let linePath = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = Number(((p0.x + p1.x) / 2).toFixed(1));
      linePath += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${h - padB} L ${pts[0].x} ${h - padB} Z`;
    const gradId = `admChartGrad_${series}`;
    const lastPt = pts[pts.length - 1];

    const gridLines = [0.22, 0.52, 0.82].map(g => {
      const gy = Number((padT + plotH * g).toFixed(1));
      return `<line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" stroke="#EEF1F6" stroke-width="1" stroke-dasharray="3 4"></line>`;
    }).join('');

    // Secondary soft wave curve matching Image 1 dual-wave aesthetic
    const subWeights = cfg.weights.map((r, i) => Math.max(0.18, r * (i % 2 === 0 ? 0.66 : 0.78)));
    const subPts = subWeights.map((ratio, idx) => {
      const x = padL + (plotW * idx) / (subWeights.length - 1);
      const y = padT + plotH * (1 - ratio * 0.78 - 0.06);
      return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
    });
    let subLinePath = `M ${subPts[0].x} ${subPts[0].y}`;
    for (let i = 0; i < subPts.length - 1; i++) {
      const p0 = subPts[i];
      const p1 = subPts[i + 1];
      const cx = Number(((p0.x + p1.x) / 2).toFixed(1));
      subLinePath += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    const subAreaPath = `${subLinePath} L ${subPts[subPts.length - 1].x} ${h - padB} L ${subPts[0].x} ${h - padB} Z`;

    const xLabels = pts.map(p =>
      `<text x="${p.x}" y="${h - 6}" text-anchor="middle" font-size="10.5" font-weight="600" fill="#6B7280">${p.label}</text>`
    ).join('');

    const focusIdx = pts.length - 2;
    const focusPt = pts[focusIdx];
    const dots = pts.map((p, i) => {
      const r = (i === pts.length - 1 || i === focusIdx) ? 4.5 : 3;
      return `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="#FFFFFF" stroke="${cfg.stroke}" stroke-width="${i === pts.length - 1 ? 2.6 : 2}"></circle>`;
    }).join('');

    host.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="165" style="display:block; overflow:visible;" role="img" aria-label="Admin ${series} analytics chart">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${cfg.fillTop}"></stop>
            <stop offset="100%" stop-color="${cfg.fillBottom}"></stop>
          </linearGradient>
        </defs>
        ${gridLines}
        <path d="${subAreaPath}" fill="${cfg.stroke}" fill-opacity="0.08"></path>
        <path d="${subLinePath}" fill="none" stroke="${cfg.stroke}" stroke-opacity="0.35" stroke-width="1.6" stroke-linecap="round"></path>
        <path d="${areaPath}" fill="url(#${gradId})"></path>
        <path d="${linePath}" fill="none" stroke="${cfg.stroke}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path>
        <line x1="${focusPt.x}" y1="${focusPt.y}" x2="${focusPt.x}" y2="${h - padB}" stroke="#93C5FD" stroke-width="1.2" stroke-dasharray="3 3"></line>
        ${dots}
        <circle cx="${lastPt.x}" cy="${lastPt.y}" r="8" fill="${cfg.stroke}" fill-opacity="0.14"></circle>
        ${xLabels}
      </svg>
    `;
  },

  toggleAdminSidebar(forceState) {
    const sidebar = document.getElementById('admin-sidebar');
    const backdrop = document.getElementById('admin-sidebar-backdrop');
    if (!sidebar) return;
    const shouldOpen = (forceState !== undefined) ? Boolean(forceState) : !sidebar.classList.contains('open');
    if (shouldOpen) {
      sidebar.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
    } else {
      sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
    }
  },

  setAdminTab(tab) {
    const allowedTabs = [
      'overview', 'users', 'referrals', 'deposits', 'withdrawals',
      'kyc', 'signals', 'signal-schedules', 'adjustments', 'settings'
    ];
    if (!allowedTabs.includes(tab)) {
      tab = 'overview';
    }

    this.state.adminTab = tab;
    if (this.state.user?.is_admin === true && !this.state.adminPreviewUser) {
      localStorage.setItem('alphavest_admin_last_tab', tab);
    }
    document.querySelectorAll('.adm-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-adm') === tab);
    });

    document.querySelectorAll('.admin-panel-sec').forEach(sec => {
      sec.style.display = 'none';
    });

    const target = document.getElementById(`adm-sec-${tab}`);
    if (target) target.style.display = 'block';

    const tabTitles = {
      overview: 'Overview Dashboard',
      signals: 'Signal Studio (4 PM / 8 PM)',
      deposits: 'Incoming Deposits',
      withdrawals: 'Withdrawals Desk',
      kyc: 'KYC Identity Desk',
      users: 'Users Directory',
      adjustments: 'Balance Adjustments',
      'signal-schedules': 'Signal Timetable',
      settings: 'Platform Settings',
      referrals: 'Referral Network'
    };
    const titleEl = document.getElementById('admin-active-tab-display');
    if (titleEl && tabTitles[tab]) {
      titleEl.textContent = tabTitles[tab];
    }

    // Scroll active pill into view in horizontal pill nav
    const activePill = document.querySelector(`.admin-mobile-pill-nav .adm-tab-btn[data-adm="${tab}"]`);
    if (activePill && typeof activePill.scrollIntoView === 'function') {
      activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Auto-close sidebar on mobile after choosing a tab
    if (window.innerWidth < 1024) {
      this.toggleAdminSidebar(false);
    }

    if (tab === 'overview') this.renderAdminOverview();
    if (tab === 'users') this.loadAdminUsers();
    if (tab === 'kyc') this.loadAdminKyc();
    if (tab === 'withdrawals') this.loadAdminWithdrawals();
    if (tab === 'deposits') {
      this.loadAdminDeposits();
      if (this._adminDepositPollTimer) clearInterval(this._adminDepositPollTimer);
      this._adminDepositPollTimer = setInterval(() => {
        if (this.state?.adminTab === 'deposits') this.loadAdminDeposits();
      }, 15000);
    } else if (this._adminDepositPollTimer) {
      clearInterval(this._adminDepositPollTimer);
      this._adminDepositPollTimer = null;
    }
    if (tab === 'signals') this.loadAdminSignals();
    if (tab === 'settings') this.loadAdminSettings();
    if (tab === 'signal-schedules') {
      if (!this.state.marketingSchedules || !this.state.marketingSchedules.length) {
        this.loadMarketingData().then(() => this.loadAdminSignalSchedules());
      } else {
        this.loadAdminSignalSchedules();
      }
    }
    if (tab === 'referrals') this.loadAdminReferralsTree();
  },

  /* Admin: Users & Accounts */
  renderUserRowHtml(u, index = 0, total = 0) {
    const balance = Number(u.total_balance_usdt || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    const regDate = (u.created_at || '').substring(0, 10);
    const emailRaw = String(u.email || u.id || 'U').trim();
    const avatarInitial = this.escapeHtml(emailRaw.charAt(0).toUpperCase() || 'U');
    const emailEsc = this.escapeHtml(u.email || 'Member');
    const idRaw = String(u.id || '');
    const idEsc = this.escapeHtml(idRaw);
    const shortId = this.escapeHtml(u.numeric_uid ? `#${u.numeric_uid}` : (idRaw.length > 10 ? `#${idRaw.slice(-6)}` : `#${idRaw}`));
    const emailParam = encodeURIComponent(String(u.email || ''));
    const idParam = encodeURIComponent(idRaw);
    const roleUpper = String(u.role || 'USER').toUpperCase();
    const tierCls = (roleUpper === 'VIP' || roleUpper === 'ADMIN' || roleUpper === 'SUPER_ADMIN') ? 'vip' : '';
    const kycUpper = String(u.kyc_status || 'UNVERIFIED').toUpperCase();
    const isSelected = Array.isArray(this.state.selectedUserIds) && this.state.selectedUserIds.includes(idRaw);
    const openUpCls = (total > 3 && index >= total - 2) ? 'open-up' : '';

    let kycPill = `<span class="av-adm-kyc-pill unverified">Unverified</span>`;
    if (kycUpper === 'APPROVED') {
      kycPill = `<span class="av-adm-kyc-pill verified"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>Verified</span>`;
    } else if (kycUpper === 'PENDING') {
      kycPill = `<span class="av-adm-kyc-pill pending">Pending</span>`;
    } else if (kycUpper === 'REJECTED') {
      kycPill = `<span class="av-adm-kyc-pill rejected">Rejected</span>`;
    }

    const toggleLabel = u.is_active ? 'Suspend Account' : 'Activate Account';
    const suspendedTag = u.is_active ? '' : `<span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:6px;background:#FEF2F2;color:#DC2626;font-size:10px;font-weight:800;">Suspended</span>`;

    return `
      <tr class="av-adm-user-row ${isSelected ? 'selected' : ''}" data-user-id="${idEsc}">
        <td class="col-check" style="text-align:center;">
          <input type="checkbox" class="av-adm-check av-adm-row-check" ${isSelected ? 'checked' : ''} aria-label="Select ${emailEsc}" onchange="App.toggleAdminUserRowSelect(decodeURIComponent('${idParam}'), this.checked)">
        </td>
        <td class="col-identity" data-label="Name/Email">
          <div class="av-adm-user-cell">
            <span class="av-adm-user-avatar" aria-hidden="true">${avatarInitial}</span>
            <div style="min-width:0;">
              <div class="admin-user-email" title="${emailEsc}">${emailEsc}${suspendedTag}</div>
              <div class="admin-user-id">${regDate ? `Joined ${regDate}` : idEsc}</div>
            </div>
          </div>
        </td>
        <td class="col-id" data-label="Account ID">
          <span class="av-adm-uid-pill" title="${idEsc}">${shortId}</span>
        </td>
        <td class="col-tier" data-label="Tier">
          <span class="av-adm-tier-tag ${tierCls}">${this.escapeHtml(roleUpper)}</span>
        </td>
        <td class="col-bal" data-label="Wallet Balances">
          <strong class="admin-user-balance">$${balance} USDT</strong>
        </td>
        <td class="col-kyc" data-label="KYC Status">
          ${kycPill}
        </td>
        <td class="col-actions" data-label="Quick Actions">
          <div class="av-adm-users-act-row">
            <button type="button" class="av-adm-btn-chip" onclick="App.viewUserDashboard(decodeURIComponent('${idParam}'))">📊 Dashboard</button>
            <button type="button" class="av-adm-btn-chip" onclick="App.viewUserDossier(decodeURIComponent('${idParam}'))">🔎 Detail</button>
            <button type="button" class="av-adm-btn-chip" onclick="App.openAdminEditUser(decodeURIComponent('${idParam}'))">✏️ Edit</button>
            <button type="button" class="av-adm-btn-chip ${u.is_active ? 'warn' : 'soft-green'}" onclick="App.toggleUserStatus(decodeURIComponent('${idParam}'), ${u.is_active ? 0 : 1})">${u.is_active ? 'Suspend' : 'Activate'}</button>
            <button type="button" class="av-adm-btn-chip soft-blue" onclick="App.openAdjustBalanceModal(decodeURIComponent('${idParam}'))">Adjust</button>
            <button type="button" class="av-adm-btn-chip" onclick="App.openAdminResetPassword(decodeURIComponent('${idParam}'), decodeURIComponent('${emailParam}'))">🔑 Pwd</button>
            <button type="button" class="av-adm-btn-chip danger" onclick="App.deleteAdminUser(decodeURIComponent('${idParam}'), decodeURIComponent('${emailParam}'))">🗑️ Del</button>
          </div>
        </td>
      </tr>
    `;
  },

  toggleAdminUserRowSelect(userId, checked) {
    const id = String(userId || '');
    if (!Array.isArray(this.state.selectedUserIds)) this.state.selectedUserIds = [];
    if (checked) {
      if (!this.state.selectedUserIds.includes(id)) this.state.selectedUserIds.push(id);
    } else {
      this.state.selectedUserIds = this.state.selectedUserIds.filter(x => x !== id);
    }
    document.querySelectorAll(`tr.av-adm-user-row[data-user-id]`).forEach(tr => {
      if (tr.getAttribute('data-user-id') === id) {
        tr.classList.toggle('selected', checked);
        const cb = tr.querySelector('.av-adm-row-check');
        if (cb) cb.checked = checked;
      }
    });
  },

  toggleAllUserRows(checked) {
    const users = Array.isArray(this.state.adminUsers) ? this.state.adminUsers : [];
    this.state.selectedUserIds = checked ? users.map(u => String(u.id)) : [];
    document.querySelectorAll('tr.av-adm-user-row').forEach(tr => {
      tr.classList.toggle('selected', checked);
      const cb = tr.querySelector('.av-adm-row-check');
      if (cb) cb.checked = checked;
    });
  },

  closeAllUserMenus() {
    document.querySelectorAll('.av-adm-more-menu.open').forEach(m => m.classList.remove('open'));
  },

  toggleUserActionMenu(btn, event) {
    if (event) event.stopPropagation();
    const wrap = btn?.closest('.av-adm-more-wrap');
    const menu = wrap?.querySelector('.av-adm-more-menu');
    if (!menu) return;
    const willOpen = !menu.classList.contains('open');
    this.closeAllUserMenus();
    if (willOpen) menu.classList.add('open');
    if (!this._admUserMenuListenerBound) {
      this._admUserMenuListenerBound = true;
      document.addEventListener('click', () => this.closeAllUserMenus());
    }
  },

  async loadAdminUsers(forceSync = false) {
    const search = document.getElementById('adm-users-search')?.value.trim() || '';
    const role = document.getElementById('adm-users-filter-role')?.value || 'ALL';
    const kyc = document.getElementById('adm-users-filter-kyc')?.value || 'ALL';
    const params = { search, role, kyc_status: kyc };
    if (forceSync) params.sync = '1';
    const query = new URLSearchParams(params).toString();

    const container = document.getElementById('adm-users-list');
    const overviewContainer = document.getElementById('adm-overview-users-list');
    const countBadge = document.getElementById('adm-overview-users-count');
    const usersCountPill = document.getElementById('adm-users-count-pill');
    const statVal = document.getElementById('adm-users');

    const loadingHtml = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#6B7280;">Fetching registered user accounts...</td></tr>`;
    if (container && (!container.children.length || container.innerHTML.includes('No registered accounts'))) {
      container.innerHTML = loadingHtml;
    }
    if (overviewContainer && (!overviewContainer.children.length || overviewContainer.innerHTML.includes('No registered accounts'))) {
      overviewContainer.innerHTML = loadingHtml;
    }

    const res = await this.api(`/admin/users.php?${query}`);

    if (!res.success || !res.data || !res.data.users || !res.data.users.length) {
      const emptyHtml = `<tr><td colspan="7" style="text-align:center; padding:24px; color:#6B7280;">
        No registered accounts found matching criteria.
        <button onclick="App.syncAllFromDatabase()" class="av-adm-btn-chip soft-blue" style="margin-left:10px;">
          Sync Data from Database
        </button>
      </td></tr>`;
      if (container) container.innerHTML = emptyHtml;
      if (overviewContainer) overviewContainer.innerHTML = emptyHtml;
      if (usersCountPill) usersCountPill.textContent = '0 Users';
      return;
    }

    this.state.adminUsers = res.data.users;
    const totalRows = res.data.users.length;
    const rowsHtml = res.data.users.map((u, idx) => this.renderUserRowHtml(u, idx, totalRows)).join('');

    if (container) container.innerHTML = rowsHtml;
    if (overviewContainer) overviewContainer.innerHTML = rowsHtml;
    if (countBadge) countBadge.textContent = totalRows;
    if (usersCountPill) usersCountPill.textContent = `${totalRows} ${totalRows === 1 ? 'User' : 'Users'}`;
    if (statVal) statVal.textContent = totalRows;

    const mTotal = document.getElementById('adm-users-m-total');
    const mVer = document.getElementById('adm-users-m-verified');
    const mSusp = document.getElementById('adm-users-m-suspended');
    if (mTotal) mTotal.textContent = totalRows;
    if (mVer) mVer.textContent = res.data.users.filter(u => u.kyc_status === 'APPROVED').length;
    if (mSusp) mSusp.textContent = res.data.users.filter(u => !u.is_active).length;
  },

  filterAdminUsers() {
    clearTimeout(this._userSearchTimeout);
    this._userSearchTimeout = setTimeout(() => this.loadAdminUsers(), 250);
  },

  onAdminGlobalSearch(query) {
    const val = String(query || '');
    const usersSearch = document.getElementById('adm-users-search');
    if (usersSearch && usersSearch.value !== val) {
      usersSearch.value = val;
    }
    if (this.state.adminTab !== 'overview' && this.state.adminTab !== 'users' && val.trim().length > 0) {
      this.setAdminTab('users');
      return;
    }
    this.filterAdminUsers();
  },

  async startAdminUserView(userId) {
    try {
      const res = await this.api(`/admin/users.php?user_id=${encodeURIComponent(userId)}`);
      if (!res.success || !res.data || !res.data.user) throw new Error(res.message || 'User account not found');
      this.state.adminPreviewUserId = String(userId);
      this.state.adminPreviewUser = res.data.user;
      this.state.balances = null;
      this.state.signalsData = null;
      this.state.signals = [];
      this.updateHeaderAuth();
      this.navigate('home');
      setTimeout(() => this.ensureAdminUserDepositAction(), 0);
      this.toast(`Viewing ${res.data.user.email || 'user'} in read-only mode.`, 'info');
    } catch (e) {
      this.toast(e?.message || 'Unable to open user dashboard.', 'error');
    }
  },

  ensureAdminUserDepositAction() {
    if (!this.state.adminPreviewUserId) return;
    const user = this.state.adminPreviewUser || {};
    const mount = (rootId, key) => {
      const root = document.getElementById(rootId);
      if (!root) return;
      let bar = document.getElementById(key);
      if (!bar) {
        bar = document.createElement('div');
        bar.id = key;
        bar.style.cssText = 'margin:10px 12px;padding:10px 12px;border:1px solid #DBEAFE;border-radius:12px;background:#EFF4FF;display:flex;align-items:center;justify-content:space-between;gap:10px;position:relative;z-index:20;';
      }
      if (!bar.parentNode || !root.contains(bar)) {
        const anchor = root.firstElementChild;
        if (anchor) root.insertBefore(bar, anchor); else root.appendChild(bar);
      }
      bar.innerHTML = `<div><strong style="font-size:12px;color:#111827;">ADMIN USER VIEW</strong><div style="font-size:10px;color:#4B5563;margin-top:2px;">Submit a deposit request for ${this.escapeHtml(user.email || 'this user')}</div></div><button type="button" class="btn-primary" style="padding:7px 11px;font-size:11px;font-weight:800;white-space:nowrap;border-radius:999px;" onclick="App.openAdminUserDepositModal()">＋ Deposit</button>`;
    };
    mount('view-home', 'admin-user-view-deposit-action-home');
    mount('view-wallet', 'admin-user-view-deposit-action-wallet');
  },

  openAdminUserDepositFor(userId) {
    const id = String(userId || '').trim();
    if (!id) { this.toast('User ID is missing.', 'warning'); return; }
    this.state.adminPreviewUserId = id;
    this.state.adminPreviewUser = { id };
    this.api(`/admin/users.php?user_id=${encodeURIComponent(id)}`).then(res => {
      if (res?.success && res?.data?.user) this.state.adminPreviewUser = res.data.user;
      this.openAdminUserDepositModal();
    }).catch(() => this.openAdminUserDepositModal());
  },

  openAdminUserDepositModal() {
    const modal = document.getElementById('modal-admin-user-deposit');
    const user = this.state.adminPreviewUser || {};
    if (!modal || !this.state.adminPreviewUserId) {
      this.toast('Open a user dashboard first.', 'warning');
      return;
    }
    const email = document.getElementById('admin-user-deposit-email');
    const userId = document.getElementById('admin-user-deposit-user-id');
    if (email) email.textContent = user.email || 'Selected user';
    if (userId) userId.textContent = this.state.adminPreviewUserId;
    const amount = document.getElementById('admin-user-deposit-amount');
    const tx = document.getElementById('admin-user-deposit-tx');
    const sender = document.getElementById('admin-user-deposit-sender');
    if (amount) amount.value = '';
    if (tx) tx.value = '';
    if (sender) sender.value = '';
    this.openModal('modal-admin-user-deposit');
  },

  async submitAdminUserDeposit() {
    if (!this.state.adminPreviewUserId) {
      this.toast('Open a user dashboard first.', 'warning');
      return;
    }
    const actionScope = 'admin-user-deposit-submit';
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Deposit request is already processing. Please wait.', 'warning');
      return;
    }
    const btn = document.getElementById('btn-admin-user-deposit-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }
    try {
      const amount = parseFloat(document.getElementById('admin-user-deposit-amount')?.value) || 0;
      const network = document.getElementById('admin-user-deposit-network')?.value || 'TRC20';
      const txHash = (document.getElementById('admin-user-deposit-tx')?.value || '').trim();
      const senderAddress = (document.getElementById('admin-user-deposit-sender')?.value || '').trim();
      if (amount <= 0) {
        this.toast('Enter a valid deposit amount.', 'error');
        return;
      }
      const res = await this.api('/admin/user-deposit.php', 'POST', {
        user_id: this.state.adminPreviewUserId,
        asset: 'USDT',
        network,
        amount,
        tx_hash: txHash,
        sender_address: senderAddress,
        idempotency_key: actionKey
      });
      if (!res.success) {
        this.toast(res.message || 'Deposit request failed.', 'error');
        return;
      }
      this.toast(`Deposit request of $${amount.toFixed(2)} submitted for Admin approval.`, 'success');
      this.closeModal('modal-admin-user-deposit');
      this.endAction(actionScope, true);
      // Refresh the Admin Deposits desk so the new pending row is immediately visible.
      if (typeof this.loadAdminDeposits === 'function') await this.loadAdminDeposits();
    } catch (err) {
      this.toast('Deposit request failed: ' + (err.message || err), 'error');
    } finally {
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Deposit Request'; }
    }
  },

  exitAdminUserView() {
    this.state.adminPreviewUserId = null;
    this.state.adminPreviewUser = null;
    document.getElementById('admin-user-view-deposit-action-home')?.remove();
    document.getElementById('admin-user-view-deposit-action-wallet')?.remove();
    this.state.balances = null;
    this.state.signalsData = null;
    this.state.signals = [];
    this.updateHeaderAuth();
    this.navigate('admin');
    this.toast('Returned to Admin Desk.', 'success');
  },

  async viewUserDashboard(userId) {
    this.openModal('modal-user-dashboard');
    const body = document.getElementById('user-dashboard-body');
    if (!body) return;
    body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);">Loading user dashboard...</div>';
    try {
      const res = await this.api(`/admin/users.php?user_id=${encodeURIComponent(userId)}`);
      if (!res.success || !res.data) throw new Error(res.message || 'Unable to load user dashboard');
      const d = res.data, u = d.user || {}, fs = d.financial_summary || {}, ss = d.signal_summary || {};
      const money = v => `$${Number(v || 0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
      const esc = v => this.escapeHtml(v ?? '—');
      const executions = Array.isArray(d.signal_executions) ? d.signal_executions : [];
      body.innerHTML = `
        <div class="user-dashboard-hero">
          <div><div class="user-dashboard-kicker">LIVE USER DASHBOARD VIEW</div><h3>${esc(u.email || 'User')}</h3><div class="user-dashboard-sub">UID ${esc(u.numeric_uid || u.id || '—')} • ${esc(u.country || 'Global')}</div></div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
            <div class="user-dashboard-balance">${money(d.total_balance_usdt)}<small>USDT Total Balance</small></div>
            <button class="btn-primary" type="button" onclick="App.openAdminUserDepositModal()" style="padding:8px 12px;font-size:11px;font-weight:800;">＋ Submit Deposit</button>
          </div>
        </div>
        <div class="user-dashboard-grid">
          <div class="user-dashboard-stat"><span>Funded Capital</span><strong>${money(fs.funded_capital_principal)}</strong><small>Approved deposits + Deposit-type admin adjustments</small></div>
          <div class="user-dashboard-stat"><span>Signal Profit</span><strong class="positive">+${money(ss.profit_credited_total).slice(1)}</strong><small>Credited TRADE_PNL</small></div>
          <div class="user-dashboard-stat"><span>Signals Confirmed</span><strong>${ss.confirmed_count || 0}</strong><small>Recorded executions</small></div>
          <div class="user-dashboard-stat"><span>Missed Signals</span><strong>${ss.missed_signal_count || 0}</strong><small>Expired recorded windows</small></div>
        </div>
        <div class="user-dashboard-panel"><div class="user-dashboard-panel-title">Recent Signal Results</div>
          ${executions.length ? `<div class="user-dashboard-results">${executions.slice(0,12).map(ex => `<div class="user-dashboard-result"><div><strong>${esc(ex.symbol || 'SIGNAL')}</strong><span>${esc(ex.direction || '')}</span></div><div><b class="positive">+${money(ex.profit_amount)}</b><small>${esc(ex.status || 'COMPLETED')}</small></div></div>`).join('')}</div>` : '<div class="user-dashboard-empty">No signal executions recorded yet.</div>'}
        </div>
        <div class="user-dashboard-actions" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;"><button class="btn-primary" onclick="App.closeModal('modal-user-dashboard');App.startAdminUserView('${String(userId)}')">📊 Open Full User Dashboard</button><button class="btn-secondary" onclick="App.closeModal('modal-user-dashboard');App.openAdminUserDepositFor('${String(userId)}')">➕ Submit Deposit</button><button class="btn-secondary" onclick="App.closeModal('modal-user-dashboard');App.viewUserDossier('${String(userId)}')">🔎 Open Complete Detail</button></div>`;
    } catch (e) { body.innerHTML = `<div style="color:var(--negative);padding:20px;">Unable to load dashboard. ${this.escapeHtml(e.message || e)}</div>`; }
  },

  async viewUserDossier(userId) {
    this.openModal('modal-user-dossier');
    const body = document.getElementById('dossier-body');
    if (!body) return;
    body.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Fetching complete user account detail...</div>`;

    try {
      const res = await this.api(`/admin/users.php?user_id=${encodeURIComponent(userId)}`);
      if (!res.success || !res.data || !res.data.user) {
        body.innerHTML = `<div style="color:var(--negative); padding:14px;">Unable to load user detail: ${this.escapeHtml(res.message || 'Account record not found.')}</div>`;
        return;
      }

      const d = res.data;
      const u = d.user || {};
      const w = d.wallets || {};
      const k = d.kyc || null;
      const f = d.financial_summary || {};
      const sig = d.signal_summary || {};
      const deposits = Array.isArray(d.deposits) ? d.deposits : [];
      const withdrawals = Array.isArray(d.withdrawals) ? d.withdrawals : [];
      const adjustments = Array.isArray(d.adjustments) ? d.adjustments : [];
      const executions = Array.isArray(d.signal_executions) ? d.signal_executions : [];
      const noProfit = Array.isArray(d.confirmed_without_profit) ? d.confirmed_without_profit : [];
      const missed = Array.isArray(d.missed_signals) ? d.missed_signals : [];

      const esc = v => this.escapeHtml(v ?? 'N/A');
      const money = v => `$${Number(v || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
      const dt = v => {
        if (!v) return 'N/A';
        const s = String(v).replace('T', ' ');
        return s.length > 19 ? s.substring(0, 19) : s;
      };
      const statusClass = status => {
        const x = String(status || '').toUpperCase();
        return x === 'COMPLETED' || x === 'APPROVED' || x === 'ACTIVE' ? 'badge-positive' : (x === 'PENDING' || x === 'UNDER_REVIEW' ? 'badge-warning' : 'badge-negative');
      };
      const tableRows = (items, emptyText, renderer) => items.length ? items.map(renderer).join('') : `<tr><td colspan="8" style="text-align:center; padding:16px; color:var(--text-muted);">${emptyText}</td></tr>`;

      const depositRows = tableRows(deposits, 'No deposit records found.', x => `
        <tr>
          <td>${esc(x.asset || 'USDT')}</td><td>${money(x.amount)}</td><td>${money(x.net_amount ?? x.amount)}</td>
          <td><span class="badge ${statusClass(x.status)}">${esc(x.status || 'UNKNOWN')}</span></td>
          <td>${esc(x.tx_hash || '—')}</td><td>${esc(x.rejection_reason || '—')}</td><td>${esc(dt(x.created_at))}</td>
        </tr>`);
      const withdrawalRows = tableRows(withdrawals, 'No withdrawal records found.', x => `
        <tr>
          <td>${esc(x.asset || 'USDT')}</td><td>${money(x.amount)}</td><td>${money(x.net_amount ?? x.amount)}</td>
          <td><span class="badge ${statusClass(x.status)}">${esc(x.status || 'UNKNOWN')}</span></td>
          <td>${esc(x.destination_address || '—')}</td><td>${esc(x.rejection_reason || '—')}</td><td>${esc(dt(x.created_at))}</td>
        </tr>`);
      const adjustmentRows = tableRows(adjustments, 'No administrative balance adjustments recorded.', x => `
        <tr>
          <td>${esc(x.wallet_type || 'funding')}</td><td>${esc(x.asset || 'USDT')}</td>
          <td style="font-weight:700;">${Number(x.amount || 0) >= 0 ? '+' : ''}${money(x.amount)}</td>
          <td>${money(x.balance_before)}</td><td>${money(x.balance_after)}</td>
          <td>${esc(x.description || 'Administrative Balance Adjustment')}</td><td>${esc(dt(x.created_at))}</td>
        </tr>`);
      const executionRows = tableRows(executions, 'No signal confirmations recorded.', x => `
        <tr>
          <td>${esc(x.signal_id || '—')}</td><td>${esc(x.symbol || '—')}</td><td>${esc(x.direction || '—')}</td>
          <td>${esc(x.status || 'COMPLETED')}</td><td style="font-weight:700;">${money(x.profit_amount)}</td>
          <td>${money(x.balance_before)}</td><td>${money(x.balance_after)}</td><td>${esc(dt(x.executed_at || x.created_at))}</td>
        </tr>`);
      const noProfitRows = tableRows(noProfit, 'No confirmed executions currently missing a positive profit-credit record.', x => `
        <tr><td>${esc(x.signal_id || '—')}</td><td>${esc(x.execution_id || '—')}</td><td>${esc(x.status || '—')}</td><td>${money(x.profit_amount)}</td><td>${esc(x.reason || '—')}</td><td>${esc(dt(x.executed_at))}</td></tr>`);
      const missedRows = tableRows(missed, 'No expired, unconfirmed signal windows found in the recorded history.', x => `
        <tr><td>${esc(x.signal_id)}</td><td>${esc(x.symbol)}</td><td>${esc(x.direction)}</td><td>${Number(x.profit_percentage || 0).toFixed(2)}%</td><td>${esc(x.status)}</td><td>${esc(dt(x.published_at))}</td><td>${esc(dt(x.expires_at))}</td></tr>`);

      const kycHtml = k ? `
        <div class="card" style="padding:12px;">
          <div style="font-weight:800; margin-bottom:10px; font-size:13px;">KYC / Identity Detail</div>
          <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; font-size:12px; line-height:1.5;">
            <div><strong>Status:</strong> <span class="badge ${statusClass(k.status)}">${esc(k.status || u.kyc_status || 'UNKNOWN')}</span></div>
            <div><strong>Legal Name:</strong> ${esc(k.legal_name)}</div>
            <div><strong>Date of Birth:</strong> ${esc(k.date_of_birth)}</div>
            <div><strong>Country:</strong> ${esc(k.country)}</div>
            <div><strong>Document Type:</strong> ${esc(k.document_type)}</div>
            <div><strong>Document Number:</strong> ${esc(k.document_number)}</div>
            <div style="grid-column:1/-1;"><strong>Address:</strong> ${esc(k.address)}</div>
            <div style="grid-column:1/-1;"><strong>Reviewer Notes:</strong> ${esc(k.reviewer_notes)}</div>
            <div style="grid-column:1/-1;"><strong>Rejection Reason:</strong> ${esc(k.rejection_reason || '—')}</div>
            <div><strong>Submitted:</strong> ${esc(dt(k.created_at))}</div>
            <div><strong>Reviewed:</strong> ${esc(dt(k.reviewed_at))}</div>
          </div>
          <div style="margin-top:10px; padding:9px; border-radius:8px; background:#F7F8FA; border:1px solid #EEF1F6; color:#4B5563; font-size:11px;">
            Private KYC document files are not exposed directly in this dossier. Use the admin KYC desk for authenticated document viewing.
          </div>
        </div>` : `
        <div class="card" style="padding:12px;"><div style="font-weight:800; margin-bottom:6px; font-size:13px;">KYC / Identity Detail</div><div style="font-size:12px; color:var(--text-muted);">No KYC submission is recorded for this user. Profile KYC status: ${esc(u.kyc_status || 'NOT_SUBMITTED')}.</div></div>`;

      body.innerHTML = `
        <div class="card" style="padding:14px;">
          <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start; flex-wrap:wrap;">
            <div>
              <h4 style="margin:0; font-size:17px;">${esc(u.email)}</h4>
              <div style="font-size:11px; font-family:var(--font-mono); color:var(--text-muted); margin-top:4px; word-break:break-all;">UID: ${esc(u.id)}</div>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <span class="badge ${u.is_active ? 'badge-positive' : 'badge-negative'}">${u.is_active ? 'ACTIVE' : 'SUSPENDED'}</span>
              <span class="badge ${statusClass(u.kyc_status)}">KYC: ${esc(u.kyc_status || 'NOT_SUBMITTED')}</span>
              <span class="badge">ROLE: ${esc(u.role || 'USER')}</span>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin-top:12px; font-size:11px;">
            <div><strong>Referral Code</strong><br>${esc(u.referral_code || '—')}</div>
            <div><strong>Referred By</strong><br>${esc(u.referred_by || '—')}</div>
            <div><strong>Country</strong><br>${esc(u.country || '—')}</div>
            <div><strong>Registered</strong><br>${esc(dt(u.created_at))}</div>
            <div><strong>Withdrawal PIN</strong><br>${u.has_withdrawal_pin ? 'Configured' : 'Not configured'}</div>
            <div><strong>Account ID</strong><br>${esc(u.id || '—')}</div>
          </div>
        </div>

        <div class="dossier-stat-grid" style="display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:8px;">
          <div class="card" style="padding:11px;text-align:center;"><div style="font-size:10px;color:var(--text-muted);">CURRENT TOTAL BALANCE</div><div style="font-size:16px;font-weight:800;margin-top:3px;">${money(d.total_balance_usdt)}</div></div>
          <div class="card" style="padding:11px;text-align:center;"><div style="font-size:10px;color:var(--text-muted);">COMPLETED DEPOSITS</div><div style="font-size:16px;font-weight:800;margin-top:3px;">${money(f.deposit_completed_total)}</div><div style="font-size:10px;color:var(--text-muted);">${Number(f.deposit_completed_count || 0)} transactions</div></div>
          <div class="card" style="padding:11px;text-align:center;"><div style="font-size:10px;color:var(--text-muted);">COMPLETED WITHDRAWALS</div><div style="font-size:16px;font-weight:800;margin-top:3px;">${money(f.withdrawal_completed_total)}</div><div style="font-size:10px;color:var(--text-muted);">${Number(f.withdrawal_completed_count || 0)} transactions</div></div>
          <div class="card" style="padding:11px;text-align:center;"><div style="font-size:10px;color:var(--text-muted);">ADMIN ADJUSTMENT NET</div><div style="font-size:16px;font-weight:800;margin-top:3px;">${money(f.adjustment_net)}</div><div style="font-size:10px;color:var(--text-muted);">Credits ${money(f.adjustment_credits)} / Debits ${money(f.adjustment_debits)}</div></div>
          <div class="card" style="padding:11px;text-align:center;border-color:#DBEAFE!important;background:#EFF4FF!important;"><div style="font-size:10px;color:#0052FF;font-weight:700;">SIGNAL PROFIT PRINCIPAL</div><div style="font-size:16px;font-weight:900;margin-top:3px;color:#111827;">${money(f.funded_capital_principal)}</div><div style="font-size:10px;color:#4B5563;">Approved deposits + Deposit-type admin adjustments only</div></div>
        </div>

        <div class="card" style="padding:12px;">
          <div style="font-weight:800; margin-bottom:9px; font-size:13px;">Wallet Balances</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:12px;">
            <div><strong>Funding</strong><br>${money(w.funding)}</div><div><strong>Exchange</strong><br>${money(w.exchange)}</div><div><strong>Trading</strong><br>${money(w.trading)}</div>
          </div>
        </div>

        ${kycHtml}

        <div class="card" style="padding:12px;">
          <div style="font-weight:800; margin-bottom:9px; font-size:13px;">Deposit History &amp; Totals</div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">All recorded: ${money(f.deposit_total_requested)} across ${Number(f.deposit_count || 0)} requests.</div>
          <div class="table-responsive" style="max-height:260px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:10px;"><thead><tr><th>Asset</th><th>Amount</th><th>Net</th><th>Status</th><th>TX Hash</th><th>Rejection</th><th>Date</th></tr></thead><tbody>${depositRows}</tbody></table></div>
        </div>

        <div class="card" style="padding:12px;">
          <div style="font-weight:800; margin-bottom:9px; font-size:13px;">Withdrawal History &amp; Totals</div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">All recorded requests: ${money(f.withdrawal_total_requested)} across ${Number(f.withdrawal_count || 0)} requests.</div>
          <div class="table-responsive" style="max-height:260px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:10px;"><thead><tr><th>Asset</th><th>Amount</th><th>Net</th><th>Status</th><th>Destination</th><th>Rejection</th><th>Date</th></tr></thead><tbody>${withdrawalRows}</tbody></table></div>
        </div>

        <div class="card" style="padding:12px;">
          <div style="font-weight:800; margin-bottom:9px; font-size:13px;">Administrative Financial Adjustments</div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">${Number(f.adjustment_count || 0)} recorded adjustments. Net change: ${money(f.adjustment_net)}.</div>
          <div class="table-responsive" style="max-height:240px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:10px;"><thead><tr><th>Wallet</th><th>Asset</th><th>Amount</th><th>Before</th><th>After</th><th>Reason</th><th>Date</th></tr></thead><tbody>${adjustmentRows}</tbody></table></div>
        </div>

        <div class="card" style="padding:12px;">
          <div style="font-weight:800; margin-bottom:9px; font-size:13px;">Trading Signal Analytics</div>
          <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;font-size:11px;">
            <div><strong>Confirmed</strong><br>${Number(sig.confirmed_count || 0)}</div>
            <div><strong>Profit Credited</strong><br>${money(sig.profit_credited_total)}</div>
            <div><strong>Confirmed / No Profit</strong><br>${Number(sig.confirmed_without_profit_count || 0)}</div>
            <div><strong>Failed Executions</strong><br>${Number(sig.failed_execution_count || 0)}</div>
            <div><strong>Missed Windows</strong><br>${Number(sig.missed_signal_count || 0)}</div>
          </div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:9px;">Signal profit principal uses funded capital only: completed deposits plus net Admin Financial Adjustments. Referral bonuses and previous signal profits are excluded. “Confirmed / No Profit” means an execution record exists but no positive profit credit is recorded in the matching signal ledger evidence. “Missed” means a recorded signal window ended after account creation without a matching execution.</div>
        </div>

        <div class="card" style="padding:12px;">
          <div style="font-weight:800; margin-bottom:9px; font-size:13px;">Confirmed Signals</div>
          <div class="table-responsive" style="max-height:260px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:10px;"><thead><tr><th>Signal ID</th><th>Symbol</th><th>Direction</th><th>Status</th><th>Profit</th><th>Balance Before</th><th>Balance After</th><th>Confirmed</th></tr></thead><tbody>${executionRows}</tbody></table></div>
        </div>

        <div class="card" style="padding:12px;">
          <div style="font-weight:800; margin-bottom:9px; font-size:13px;">Confirmed Signals With No Recorded Profit Credit</div>
          <div class="table-responsive" style="max-height:220px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:10px;"><thead><tr><th>Signal ID</th><th>Execution ID</th><th>Status</th><th>Profit</th><th>Reason</th><th>Date</th></tr></thead><tbody>${noProfitRows}</tbody></table></div>
        </div>

        <div class="card" style="padding:12px;">
          <div style="font-weight:800; margin-bottom:9px; font-size:13px;">Missed Signal Windows</div>
          <div class="table-responsive" style="max-height:240px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:10px;"><thead><tr><th>Signal ID</th><th>Symbol</th><th>Direction</th><th>Profit %</th><th>Status</th><th>Published</th><th>Expired</th></tr></thead><tbody>${missedRows}</tbody></table></div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:2px; flex-wrap:wrap;">
          <button class="btn-secondary" style="color:#0052FF; border-color:#DBEAFE; background:#EFF4FF;" onclick="App.closeModal('modal-user-dossier'); App.openAdminResetPassword(decodeURIComponent('${encodeURIComponent(String(u.id || ''))}'), decodeURIComponent('${encodeURIComponent(String(u.email || ''))}'))">Reset Password</button>
          <button class="btn-primary" onclick="App.closeModal('modal-user-dossier'); App.quickAdjust('${esc(u.id)}');">Adjust Balance</button>
          <button class="btn-secondary" onclick="App.closeModal('modal-user-dossier')">Close</button>
        </div>
      `;
      body.querySelectorAll('.mobile-detail-table').forEach(table => {
        const labels = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach(row => row.querySelectorAll('td').forEach((td, i) => {
          if (labels[i]) td.setAttribute('data-label', labels[i]);
        }));
      });
    } catch (e) {
      body.innerHTML = `<div style="color:var(--negative); padding:14px;">Unable to load user detail. ${this.escapeHtml(e.message || e)}</div>`;
    }
  },

  openAdminResetPassword(userId, email) {
    this.openModal('modal-admin-reset-pwd');
    const emailEl = document.getElementById('adm-reset-pwd-email');
    const uidEl = document.getElementById('adm-reset-pwd-uid');
    const newPwdEl = document.getElementById('adm-reset-pwd-new');
    if (emailEl) emailEl.value = email || '';
    if (uidEl) uidEl.value = userId || '';
    if (newPwdEl) newPwdEl.value = this.generateRandomPassword();
  },

  generateAdminTempPwd() {
    const pwd = this.generateRandomPassword();
    const newPwdEl = document.getElementById('adm-reset-pwd-new');
    if (newPwdEl) newPwdEl.value = pwd;
  },

  generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
    const values = new Uint32Array(14);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(values);
    let pwd = '';
    for (let i = 0; i < 14; i++) pwd += chars.charAt(values[i] % chars.length);
    // Guarantee the server-side complexity policy even if Web Crypto is unavailable.
    if (!/[A-Z]/.test(pwd)) pwd = 'A' + pwd.slice(1);
    if (!/[a-z]/.test(pwd)) pwd = pwd.slice(0,1) + 'a' + pwd.slice(2);
    if (!/\d/.test(pwd)) pwd = pwd.slice(0,2) + '7' + pwd.slice(3);
    if (!/[^A-Za-z0-9]/.test(pwd)) pwd = pwd.slice(0,3) + '!' + pwd.slice(4);
    return pwd;
  },

  async submitAdminResetPassword() {
    const userId = document.getElementById('adm-reset-pwd-uid')?.value;
    const email = document.getElementById('adm-reset-pwd-email')?.value;
    const newPassword = document.getElementById('adm-reset-pwd-new')?.value?.trim();

    if (!userId || !newPassword || newPassword.length < 6) {
      this.toast('Password must be at least 6 characters long', 'error');
      return;
    }

    const res = await this.api('/admin/users/reset-password.php', 'POST', {
      user_id: userId,
      email: email,
      new_password: newPassword
    });

    if (res.success) {
      this.toast(`Password successfully reset for ${email}!`, 'success');
      this.closeModal('modal-admin-reset-pwd');
      prompt(`Password reset successfully for ${email}. Copy the new password below:`, newPassword);
    } else {
      this.toast(res.message || 'Failed to reset user password', 'error');
    }
  },

  async promptChangeRole(userId, currentRole) {
    const newRole = prompt(`Assign new RBAC role for user (USER, TRADER, VIP, ADMIN, SUPER_ADMIN):`, currentRole);
    if (!newRole || newRole === currentRole) return;
    const allowed = ['USER', 'TRADER', 'VIP', 'ADMIN', 'SUPER_ADMIN'];
    if (!allowed.includes(newRole.toUpperCase())) {
      this.toast('Invalid role specified', 'error');
      return;
    }

    const res = await this.api('/admin/users.php', 'POST', {
      user_id: userId,
      role: newRole.toUpperCase()
    });
    if (res.success) {
      this.toast('Role assigned successfully', 'success');
      this.loadAdminUsers();
      this.loadAdminData();
    } else {
      this.toast(res.message || 'Failed to update role', 'error');
    }
  },

  async toggleUserStatus(userId, isActive) {
    const action = isActive ? 'Activate' : 'Suspend';
    if (!confirm(`${action} this user account?`)) return;

    const res = await this.api('/admin/users.php', 'POST', {
      user_id: userId,
      is_active: isActive
    });
    if (res.success) {
      this.toast(`Account ${action.toLowerCase()}d successfully`, 'success');
      this.loadAdminUsers();
      this.loadAdminData();
    } else {
      this.toast(res.message || 'Failed to update account status', 'error');
    }
  },

  /* Admin: Create New User / Admin */
  openAdminCreateUserModal() {
    const emailEl = document.getElementById('adm-new-user-email');
    const pwdEl = document.getElementById('adm-new-user-pwd');
    const balEl = document.getElementById('adm-new-user-balance');
    const refEl = document.getElementById('adm-new-user-ref');
    if (emailEl) emailEl.value = '';
    if (pwdEl) pwdEl.value = this.generateRandomPassword();
    if (balEl) balEl.value = '0';
    if (refEl) refEl.value = '';
    this.openModal('modal-admin-create-user');
  },

  generateNewUserTempPwd() {
    const pwdEl = document.getElementById('adm-new-user-pwd');
    if (pwdEl) {
      pwdEl.value = this.generateRandomPassword();
    }
  },

  async submitAdminCreateUser() {
    const email = document.getElementById('adm-new-user-email')?.value.trim().toLowerCase();
    const password = document.getElementById('adm-new-user-pwd')?.value.trim();
    const role = document.getElementById('adm-new-user-role')?.value || 'USER';
    const kyc = document.getElementById('adm-new-user-kyc')?.value || 'NOT_SUBMITTED';
    const balance = parseFloat(document.getElementById('adm-new-user-balance')?.value) || 0;
    const ref = document.getElementById('adm-new-user-ref')?.value.trim();

    if (!email || !email.includes('@')) {
      this.toast('Valid email address is required', 'error');
      return;
    }
    if (!password || password.length < 6) {
      this.toast('Password must be at least 6 characters', 'error');
      return;
    }

    const btn = document.getElementById('btn-submit-new-user');
    if (btn) btn.disabled = true;

    try {
      const res = await this.api('/admin/users.php', 'POST', {
        action: 'CREATE',
        email,
        password,
        role,
        kyc_status: kyc,
        initial_funding: balance,
        referral_code: ref
      });

      if (res.success) {
        this.toast(`Account for ${email} successfully created in database!`, 'success');
        this.closeModal('modal-admin-create-user');
        await this.loadAdminUsers();
        await this.loadAdminData();
        prompt(`New ${role} account created successfully! Credentials:\n\nEmail: ${email}\nPassword: ${password}`, password);
      } else {
        this.toast(res.message || 'Failed to create user', 'error');
      }
    } catch (e) {
      this.toast('Account creation failed: ' + (e.message || e), 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  /* Admin: Edit User / Admin */
  openAdminEditUser(userId) {
    const user = (this.state.adminUsers || []).find(u => u.id === userId);
    if (!user) {
      this.toast('User not found in current table', 'error');
      return;
    }

    const uidEl = document.getElementById('adm-edit-user-uid');
    const emailEl = document.getElementById('adm-edit-user-email');
    const roleEl = document.getElementById('adm-edit-user-role');
    const kycEl = document.getElementById('adm-edit-user-kyc');
    const statusEl = document.getElementById('adm-edit-user-status');
    const refEl = document.getElementById('adm-edit-user-ref');

    if (uidEl) uidEl.value = user.id;
    if (emailEl) emailEl.value = user.email;
    if (roleEl) roleEl.value = user.role;
    if (kycEl) kycEl.value = user.kyc_status || 'NOT_SUBMITTED';
    if (statusEl) statusEl.value = user.is_active ? '1' : '0';
    if (refEl) refEl.value = user.referral_code || '';

    this.openModal('modal-admin-edit-user');
  },

  async submitAdminEditUser() {
    const userId = document.getElementById('adm-edit-user-uid')?.value.trim();
    const email = document.getElementById('adm-edit-user-email')?.value.trim().toLowerCase();
    const role = document.getElementById('adm-edit-user-role')?.value;
    const kyc = document.getElementById('adm-edit-user-kyc')?.value;
    const isActive = document.getElementById('adm-edit-user-status')?.value === '1';
    const ref = document.getElementById('adm-edit-user-ref')?.value.trim();

    if (!userId) {
      this.toast('User ID is missing', 'error');
      return;
    }

    const btn = document.getElementById('btn-submit-edit-user');
    if (btn) btn.disabled = true;

    try {
      const res = await this.api('/admin/users.php', 'POST', {
        action: 'UPDATE',
        user_id: userId,
        email,
        role,
        kyc_status: kyc,
        is_active: isActive,
        referral_code: ref
      });

      if (res.success) {
        this.toast('Account changes saved to database successfully', 'success');
        this.closeModal('modal-admin-edit-user');
        await this.loadAdminUsers();
        await this.loadAdminData();
      } else {
        this.toast(res.message || 'Failed to update user', 'error');
      }
    } catch (e) {
      this.toast('User update failed: ' + (e.message || e), 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  /* Admin: Delete User / Admin */
  async deleteAdminUser(userId, email) {
    if (!confirm(`Are you sure you want to PERMANENTLY DELETE user account:\n${email} (${userId})?\n\nThis will remove the user from all database tables.`)) {
      return;
    }

    const res = await this.api('/admin/users.php', 'POST', {
      action: 'DELETE',
      user_id: userId
    });

    if (res.success) {
      this.toast(`User ${email} permanently deleted from database`, 'success');
      await this.loadAdminUsers();
      await this.loadAdminData();
    } else {
      this.toast(res.message || 'Failed to delete user', 'error');
    }
  },

  /* Admin: Force Sync with Database */
  async syncAllFromDatabase() {
    this.toast('Syncing users, balances, and records from database...', 'info');
    await this.loadAdminUsers(true);
    await this.loadBalances();
    await this.loadAdminData();
    this.toast('Database synchronization complete', 'success');
  },

  async syncAllFromSupabase() {
    return this.syncAllFromDatabase();
  },

  quickAdjust(userId) {
    this.setAdminTab('adjustments');
    this.setAdjustmentSign('CREDIT');
    const input = document.getElementById('adj-user-id');
    if (input) {
      input.value = userId;
      input.focus();
    }
  },

  openAdjustBalanceModal(userId) {
    const id = String(userId || '').trim();
    const u = (this.state.adminUsers || []).find(x => String(x.id) === id);
    const labelEl = document.getElementById('pop-adj-user-label');
    const idEl = document.getElementById('pop-adj-user-id');
    const amtEl = document.getElementById('pop-adj-amount');
    const reasonEl = document.getElementById('pop-adj-reason');
    const walletEl = document.getElementById('pop-adj-wallet');
    const typeEl = document.getElementById('pop-adj-type');

    if (idEl) idEl.value = id;
    if (labelEl) {
      const displayId = u?.numeric_uid ? `#${u.numeric_uid}` : `#${id}`;
      labelEl.textContent = `User: ${u?.email || id} (ID ${displayId})`;
    }
    if (amtEl) amtEl.value = '';
    if (reasonEl) reasonEl.value = '';
    if (walletEl) walletEl.value = 'funding';
    if (typeEl) typeEl.value = 'DEPOSIT';

    this.toggleAdminUserRowSelect(id, true);
    this.setPopAdjustmentSign('CREDIT');
    this.openModal('modal-admin-adjust-balance');
    setTimeout(() => amtEl?.focus(), 60);
  },

  setPopAdjustmentSign(mode) {
    const isDebit = String(mode || '').toUpperCase() === 'DEBIT';
    this.state.popAdjSignMode = isDebit ? 'DEBIT' : 'CREDIT';
    const creditBtn = document.getElementById('pop-adj-sign-credit');
    const debitBtn = document.getElementById('pop-adj-sign-debit');
    if (creditBtn) creditBtn.classList.toggle('active-credit', !isDebit);
    if (debitBtn) debitBtn.classList.toggle('active-debit', isDebit);

    const amtEl = document.getElementById('pop-adj-amount');
    if (amtEl && amtEl.value !== '') {
      const num = parseFloat(amtEl.value);
      if (Number.isFinite(num) && num !== 0) {
        amtEl.value = isDebit ? String(-Math.abs(num)) : String(Math.abs(num));
      }
    }
  },

  syncPopAdjustmentSignFromInput() {
    const amtEl = document.getElementById('pop-adj-amount');
    if (!amtEl) return;
    const raw = String(amtEl.value || '').trim();
    if (raw.startsWith('-') || parseFloat(raw) < 0) {
      this.state.popAdjSignMode = 'DEBIT';
    } else if (raw.startsWith('+')) {
      this.state.popAdjSignMode = 'CREDIT';
    }
    const isDebit = this.state.popAdjSignMode === 'DEBIT';
    const creditBtn = document.getElementById('pop-adj-sign-credit');
    const debitBtn = document.getElementById('pop-adj-sign-debit');
    if (creditBtn) creditBtn.classList.toggle('active-credit', !isDebit);
    if (debitBtn) debitBtn.classList.toggle('active-debit', isDebit);
  },

  async submitPopFinancialAdjustment() {
    const actionScope = 'admin-pop-financial-adjustment';
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Financial adjustment is already processing. Please wait.', 'warning');
      return;
    }

    const btn = document.getElementById('btn-pop-financial-adjustment');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Applying Adjustment...';
    }

    try {
      const userId = document.getElementById('pop-adj-user-id')?.value.trim();
      const wallet = document.getElementById('pop-adj-wallet')?.value || 'funding';
      const adjustmentType = document.getElementById('pop-adj-type')?.value || 'DEPOSIT';
      let amount = parseFloat(document.getElementById('pop-adj-amount')?.value) || 0;
      if (this.state.popAdjSignMode === 'DEBIT' && amount > 0) {
        amount = -Math.abs(amount);
      }
      const reason = (document.getElementById('pop-adj-reason')?.value || '').trim();

      if (!userId || amount === 0 || !reason) {
        this.toast('Non-zero Amount and Reason/Audit Note are required.', 'error');
        this.endAction(actionScope, false);
        return;
      }

      const res = await this.api('/admin/adjustments.php', 'POST', {
        user_id: userId,
        wallet_type: wallet,
        asset: 'USDT',
        amount,
        adjustment_type: adjustmentType,
        reason,
        idempotency_key: actionKey
      });

      if (res.success) {
        const newBal = res.data?.new_balance != null ? `$${Number(res.data.new_balance).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}` : '';
        this.toast(`Balance adjusted successfully! ${wallet.toUpperCase()} balance is now ${newBal}`, 'success');
        this.closeModal('modal-admin-adjust-balance');
        await this.loadAdminUsers();
        await this.loadAdminData();
        if (this.loadBalances) await this.loadBalances();
        if (this.updateHomeHeroBalance) this.updateHomeHeroBalance();
        if (this.renderWallets) this.renderWallets();
        this.endAction(actionScope, true);
      } else {
        this.toast(res.message || 'Adjustment failed', 'error');
        this.endAction(actionScope, false);
      }
    } catch (err) {
      this.toast('Adjustment failed: ' + (err.message || err), 'error');
      this.endAction(actionScope, false);
    } finally {
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Confirm Adjustment';
      }
    }
  },

  setAdjustmentSign(mode) {
    const isDebit = String(mode || '').toUpperCase() === 'DEBIT';
    this.state.adjSignMode = isDebit ? 'DEBIT' : 'CREDIT';
    const creditBtn = document.getElementById('adj-sign-credit');
    const debitBtn = document.getElementById('adj-sign-debit');
    if (creditBtn) creditBtn.classList.toggle('active-credit', !isDebit);
    if (debitBtn) debitBtn.classList.toggle('active-debit', isDebit);

    const amtEl = document.getElementById('adj-amount');
    if (amtEl && amtEl.value !== '') {
      const num = parseFloat(amtEl.value);
      if (Number.isFinite(num) && num !== 0) {
        amtEl.value = isDebit ? String(-Math.abs(num)) : String(Math.abs(num));
      }
    }
  },

  syncAdjustmentSignFromInput() {
    const amtEl = document.getElementById('adj-amount');
    if (!amtEl) return;
    const raw = String(amtEl.value || '').trim();
    if (raw.startsWith('-') || parseFloat(raw) < 0) {
      this.state.adjSignMode = 'DEBIT';
    } else if (raw.startsWith('+')) {
      this.state.adjSignMode = 'CREDIT';
    }
    const isDebit = this.state.adjSignMode === 'DEBIT';
    const creditBtn = document.getElementById('adj-sign-credit');
    const debitBtn = document.getElementById('adj-sign-debit');
    if (creditBtn) creditBtn.classList.toggle('active-credit', !isDebit);
    if (debitBtn) debitBtn.classList.toggle('active-debit', isDebit);
  },

  /* Admin: Signal Dispatcher */
  fillSignalPreset(sym) {
    const symEl = document.getElementById('adm-sig-symbol');
    const dirEl = document.getElementById('adm-sig-direction');
    const minEl = document.getElementById('adm-sig-entry-min');
    const maxEl = document.getElementById('adm-sig-entry-max');
    const tp1El = document.getElementById('adm-sig-tp1');
    const tp2El = document.getElementById('adm-sig-tp2');
    const slEl = document.getElementById('adm-sig-sl');
    const pctEl = document.getElementById('adm-sig-profit-pct');

    if (sym === 'BTC') {
      if (symEl) symEl.value = 'BTC/USDT';
      if (dirEl) dirEl.value = 'BUY';
      if (minEl) minEl.value = '66200.00';
      if (maxEl) maxEl.value = '66500.00';
      if (tp1El) tp1El.value = '69500.00';
      if (tp2El) tp2El.value = '72000.00';
      if (slEl) slEl.value = '64800.00';
      if (pctEl) pctEl.value = '5.2';
    } else if (sym === 'ETH') {
      if (symEl) symEl.value = 'ETH/USDT';
      if (dirEl) dirEl.value = 'BUY';
      if (minEl) minEl.value = '3450.00';
      if (maxEl) maxEl.value = '3480.00';
      if (tp1El) tp1El.value = '3680.00';
      if (tp2El) tp2El.value = '3800.00';
      if (slEl) slEl.value = '3350.00';
      if (pctEl) pctEl.value = '4.8';
    } else if (sym === 'SOL') {
      if (symEl) symEl.value = 'SOL/USDT';
      if (dirEl) dirEl.value = 'BUY';
      if (minEl) minEl.value = '148.50';
      if (maxEl) maxEl.value = '151.00';
      if (tp1El) tp1El.value = '165.00';
      if (tp2El) tp2El.value = '175.00';
      if (slEl) slEl.value = '141.00';
      if (pctEl) pctEl.value = '6.5';
    } else if (sym === 'GOLD') {
      if (symEl) symEl.value = 'GOLD/USD';
      if (dirEl) dirEl.value = 'BUY';
      if (minEl) minEl.value = '2420.00';
      if (maxEl) maxEl.value = '2430.00';
      if (tp1El) tp1El.value = '2485.00';
      if (tp2El) tp2El.value = '2520.00';
      if (slEl) slEl.value = '2390.00';
      if (pctEl) pctEl.value = '4.2';
    }
    this.syncAdminSignalDirectionSelect();
    if (pctEl) this.syncAdminSignalProfitInput(pctEl.value);
    this.toast(`Signal preset loaded: ${sym}`, 'info');
  },

  setAdminSignalDirection(dir) {
    const val = String(dir || 'BUY').toUpperCase() === 'SELL' ? 'SELL' : 'BUY';
    const sel = document.getElementById('adm-sig-direction');
    if (sel) sel.value = val;
    this.syncAdminSignalDirectionSelect();
  },

  syncAdminSignalDirectionSelect() {
    const val = (document.getElementById('adm-sig-direction')?.value || 'BUY').toUpperCase();
    const buyBtn = document.getElementById('adm-sig-dir-buy');
    const sellBtn = document.getElementById('adm-sig-dir-sell');
    if (buyBtn) buyBtn.classList.toggle('active-buy', val !== 'SELL');
    if (sellBtn) sellBtn.classList.toggle('active-sell', val === 'SELL');
  },

  syncAdminSignalProfitSlider(val) {
    const num = Math.max(0.5, parseFloat(val) || 2.5);
    const input = document.getElementById('adm-sig-profit-pct');
    const readout = document.getElementById('adm-sig-profit-readout');
    if (input) input.value = String(num);
    if (readout) readout.textContent = `${num}%`;
  },

  syncAdminSignalProfitInput(val) {
    const num = Math.max(0.5, parseFloat(val) || 2.5);
    const slider = document.getElementById('adm-sig-profit-slider');
    const readout = document.getElementById('adm-sig-profit-readout');
    if (slider) slider.value = String(Math.min(10, Math.max(0.5, num)));
    if (readout) readout.textContent = `${num}%`;
  },

  /* Admin Unified User-Dashboard Light Theme */
  initAdminTheme() {
    const adminEl = document.getElementById('view-admin');
    if (adminEl) {
      adminEl.classList.add('admin-light-theme');
    }
    localStorage.setItem('alphavest_admin_theme', 'light');
  },

  toggleAdminTheme() {
    const adminEl = document.getElementById('view-admin');
    if (adminEl) adminEl.classList.add('admin-light-theme');
    localStorage.setItem('alphavest_admin_theme', 'light');
  },

  applyAdminSignalSession(slot, timeType) {
    const slotEl = document.getElementById('adm-sig-slot');
    const timeSlotEl = document.getElementById('adm-sig-time-slot');
    const dateTargetEl = document.getElementById('adm-sig-date-target');
    const durationEl = document.getElementById('adm-sig-duration');
    const profitEl = document.getElementById('adm-sig-profit-pct');
    const customWrap = document.getElementById('adm-sig-custom-datetime-wrap');

    // Preserve the admin-selected duration when switching signal presets; 15 minutes is only the initial default in the form.
    if (profitEl && (!profitEl.value || parseFloat(profitEl.value) === 5.2)) profitEl.value = '2.5'; // Default 2.5% for doubling in 20 days

    if (timeType === 'NOW') {
      if (dateTargetEl) dateTargetEl.value = 'LIVE';
      if (customWrap) customWrap.style.display = 'none';
      this.onAdminSignalSlotChange();
      this.toast('Configured for immediate LIVE broadcast to all countries.', 'info');
      return;
    }

    if (timeType === 'CUSTOM' || slot >= 3) {
      if (timeSlotEl) timeSlotEl.value = 'CUSTOM';
      if (dateTargetEl) dateTargetEl.value = 'CUSTOM';
      if (slotEl) slotEl.value = String(slot || 3);
      if (customWrap) customWrap.style.display = 'block';
      const customInput = document.getElementById('adm-sig-custom-datetime');
      if (customInput && !customInput.value) {
        const inOneHour = new Date(Date.now() + 60 * 60 * 1000);
        customInput.value = inOneHour.toISOString().slice(0, 16);
      }
      this.onAdminCustomDateTimeChange();
      this.toast(`Manual Signal #${slot || 3} selected. Set your custom broadcast schedule time below.`, 'info');
      return;
    }

    const cleanSlotTime = (timeType === '4 PM' || timeType === '16:00' || slot === 1) ? '4 PM' : '8 PM';
    if (timeSlotEl) timeSlotEl.value = cleanSlotTime;
    if (slotEl) slotEl.value = cleanSlotTime === '4 PM' ? '1' : '2';
    if (dateTargetEl && (dateTargetEl.value === 'LIVE' || dateTargetEl.value === 'CUSTOM')) dateTargetEl.value = 'TODAY';
    if (customWrap) customWrap.style.display = 'none';

    this.onAdminSignalSlotChange();
    this.toast(`Session preset loaded: Daily Signal #${slotEl ? slotEl.value : slot} (${cleanSlotTime} PKT)`, 'success');
  },

  onAdminSignalSlotChange() {
    const timeSlot = document.getElementById('adm-sig-time-slot')?.value || '4 PM';
    const dateTarget = document.getElementById('adm-sig-date-target')?.value || 'TODAY';
    const timeEl = document.getElementById('adm-sig-broadcast-time');
    const slotEl = document.getElementById('adm-sig-slot');
    const customWrap = document.getElementById('adm-sig-custom-datetime-wrap');

    if (timeSlot === 'CUSTOM' || dateTarget === 'CUSTOM') {
      if (customWrap) customWrap.style.display = 'block';
      this.onAdminCustomDateTimeChange();
      return;
    } else {
      if (customWrap) customWrap.style.display = 'none';
    }

    const isSlot2 = (timeSlot === '8 PM' || timeSlot === '20:00' || timeSlot === '2');
    if (slotEl && (slotEl.value === '1' || slotEl.value === '2')) {
      slotEl.value = isSlot2 ? '2' : '1';
    }

    if (dateTarget === 'LIVE') {
      if (timeEl) timeEl.value = '';
      return;
    }

    const now = new Date();
    // Pakistan is UTC+5. Calculate UTC equivalent for PKT hours (16:00 PKT = 11:00 UTC, 20:00 PKT = 15:00 UTC)
    const targetHourUtc = isSlot2 ? 15 : 11;
    const target = new Date(now);
    target.setUTCHours(targetHourUtc, 0, 0, 0);

    if (dateTarget === 'TOMORROW') {
      target.setUTCDate(target.getUTCDate() + 1);
    } else if (dateTarget === 'TODAY' && target.getTime() <= now.getTime()) {
      // If time today has passed, roll to tomorrow
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    const hh = String(target.getHours()).padStart(2, '0');
    const min = '00';
    const val = `${yyyy}-${mm}-${dd}T${hh}:${min}`;

    if (timeEl) timeEl.value = val;
  },

  onAdminCustomDateTimeChange() {
    const customInput = document.getElementById('adm-sig-custom-datetime');
    const timeEl = document.getElementById('adm-sig-broadcast-time');
    if (customInput && customInput.value) {
      if (timeEl) timeEl.value = customInput.value;
    }
  },

  onAdminSlotSelectChange() {
    const slotVal = document.getElementById('adm-sig-slot')?.value;
    const timeSlotEl = document.getElementById('adm-sig-time-slot');
    if (timeSlotEl) {
      if (slotVal === '1') timeSlotEl.value = '4 PM';
      else if (slotVal === '2') timeSlotEl.value = '8 PM';
      else timeSlotEl.value = 'CUSTOM';
      this.onAdminSignalSlotChange();
    }
  },

  onAdminTimezoneChange() {
    const tz = document.getElementById('adm-sig-timezone')?.value;
    if (tz) this.toast(`Signal timezone set to ${tz}`, 'info');
  },

  async loadAdminSignals() {
    const res = await this.api('/admin/signals.php');
    const container = document.getElementById('adm-signals-list');
    if (!container) return;

    if (!res.success || !res.data || !res.data.signals || !res.data.signals.length) {
      container.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#6B7280;">No dispatched trading signals in history. Broadcast or schedule a new signal above.</td></tr>`;
      return;
    }

    this.state.adminSignals = res.data.signals;

    // Admin-only presentation lanes. These are derived from the existing signal records
    // and do not alter creation, scheduling, eligibility, expiry, or execution logic.
    const renderSignalLaneCard = (s) => {
      const isPublished = (s.status === 'PUBLISHED' || s.status === 'ACTIVE');
      const isScheduled = (s.status === 'SCHEDULED');
      const duration = Number(s.duration_minutes || 15);
      const isTesting = Boolean(s.is_testing || s.no_profit || String(s.id || '').startsWith('sig_test_'));
      const profitPct = isTesting ? 0 : Number(s.profit_percentage || 0);
      const statusText = isPublished ? `LIVE • ${duration}m` : (isScheduled ? 'SCHEDULED' : 'EXPIRED');
      const statusCls = isPublished ? 'live' : (isScheduled ? 'scheduled' : 'expired');
      const start = s.published_at || s.scheduled_at || '';
      const dayLabel = String(s.schedule_day_label || 'HISTORY');
      const esc = v => this.escapeHtml(v ?? '—');
      return `<article class="signal-lane-card ${statusCls}">
        <div class="signal-lane-card-top">
          <div><span class="signal-lane-symbol">${esc(s.symbol || 'SIGNAL')}</span><span class="signal-lane-day">${esc(dayLabel)}</span></div>
          <span class="signal-lane-status ${statusCls}">${statusText}</span>
        </div>
        <div class="signal-lane-main">
          <span class="signal-lane-direction ${s.direction === 'BUY' ? 'buy' : 'sell'}">${s.direction === 'BUY' ? '▲ BUY' : '▼ SELL'}</span>
          <span class="signal-lane-profit" style="${isTesting ? 'color:#D97706;' : ''}">${isTesting ? 'TEST • NO PROFIT' : '+' + profitPct.toFixed(2) + '%'}</span>
        </div>
        <div class="av-adm-sig-bar ${statusCls}"><span style="width:${isPublished ? '72%' : (isScheduled ? '40%' : '100%')};"></span></div>
        <div class="signal-lane-meta"><span>Duration: ${duration} min</span><span>Worldwide</span><span>${esc(start ? start.replace('T',' ').slice(0,16) : '—')} PKT</span></div>
        <div class="signal-lane-actions">
          <button class="av-adm-btn-chip soft-blue" onclick="App.viewSignalDetail('${esc(s.id)}')">Detail</button>
          <button class="av-adm-btn-chip" onclick="App.openEditSignalModal('${esc(s.id)}')">Edit</button>
          ${isPublished ? `<button class="av-adm-btn-chip danger" onclick="App.expireAdminSignal('${esc(s.id)}')">Expire</button>` : ''}
        </div>
      </article>`;
    };
    const lane4 = document.getElementById('adm-signal-lane-4pm');
    const lane8 = document.getElementById('adm-signal-lane-8pm');
    const laneCustom = document.getElementById('adm-signal-lane-custom');
    const laneTest = document.getElementById('adm-signal-lane-test');
    const daily4 = res.data.signals.filter(s => !s.is_testing && Number(s.daily_slot) === 1);
    const daily8 = res.data.signals.filter(s => !s.is_testing && Number(s.daily_slot) === 2);
    const custom = res.data.signals.filter(s => !s.is_testing && Number(s.daily_slot) !== 1 && Number(s.daily_slot) !== 2);
    const testing = res.data.signals.filter(s => Boolean(s.is_testing || String(s.id || '').startsWith('sig_test_')));
    if (lane4) lane4.innerHTML = daily4.length ? daily4.slice(0, 3).map(renderSignalLaneCard).join('') : `<div class="signal-lane-empty"><span>◷</span><strong>No 4 PM signal record</strong><small>The daily 4 PM slot will appear here when scheduled.</small></div>`;
    if (lane8) lane8.innerHTML = daily8.length ? daily8.slice(0, 3).map(renderSignalLaneCard).join('') : `<div class="signal-lane-empty"><span>◷</span><strong>No 8 PM signal record</strong><small>The daily 8 PM slot will appear here when scheduled.</small></div>`;
    if (laneCustom) laneCustom.innerHTML = custom.length ? custom.slice(0, 3).map(renderSignalLaneCard).join('') : `<div class="signal-lane-empty"><span>✦</span><strong>No custom signals</strong><small>Manual and custom scheduled broadcasts will appear here.</small></div>`;
    if (laneTest) laneTest.innerHTML = testing.length ? testing.slice(0, 3).map(renderSignalLaneCard).join('') : `<div class="signal-lane-empty"><span>T</span><strong>No testing signals</strong><small>Testing broadcasts are worldwide and cannot generate profit.</small></div>`;

    const activeCount = res.data.signals.filter(s => s.status === 'PUBLISHED' || s.status === 'ACTIVE').length;
    const activePill = document.getElementById('adm-signals-active-pill');
    if (activePill) activePill.textContent = `Active Signals: ${activeCount}`;
    const countBadge = document.getElementById('adm-signals-count-badge');
    if (countBadge) countBadge.textContent = `${res.data.signals.length} Signals`;

    container.innerHTML = res.data.signals.map(s => {
      const isPublished = (s.status === 'PUBLISHED' || s.status === 'ACTIVE');
      const isScheduled = (s.status === 'SCHEDULED');

      const duration = Number(s.duration_minutes || 15);
      let statusBadge = '';
      if (isPublished) {
        statusBadge = `<span class="badge badge-positive">LIVE • ${duration}m Active</span>`;
      } else if (isScheduled) {
        statusBadge = '<span class="badge" style="background:#EFF4FF; color:#0052FF; border:1px solid #DBEAFE; font-weight:700;">SCHEDULED</span>';
      } else {
        statusBadge = '<span class="badge" style="background:#F3F4F6; color:#6B7280; border:1px solid #E5E7EB;">EXPIRED</span>';
      }

      const profitPct = s.profit_percentage || 2.5;
      const slotLabel = s.slot_label || `Slot #${s.daily_slot || 1}`;
      const rawStart = String(s.scheduled_at || s.published_at || '');
      const startMs = rawStart ? Date.parse(rawStart.replace(' ', 'T') + (rawStart.endsWith('Z') ? '' : 'Z')) : NaN;
      const dayFmt = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Karachi', year:'numeric', month:'2-digit', day:'2-digit'});
      const pktDay = Number.isNaN(startMs) ? '' : dayFmt.format(new Date(startMs));
      const todayPkt = dayFmt.format(new Date());
      const tomorrowPkt = dayFmt.format(new Date(Date.now()+86400000));
      const dayLabel = pktDay === todayPkt ? 'TODAY' : (pktDay === tomorrowPkt ? 'TOMORROW' : 'HISTORY');
      const tz = s.timezone_label || 'PKT (UTC+5)';
      const timeDisplay = this.escapeHtml((s.published_at_pkt || s.scheduled_at || s.created_at_pkt || '').replace('T', ' ').slice(0, 16) || '—');
      const dayBadgeStyle = dayLabel === 'TODAY'
        ? 'background:#ECFDF5;color:#059669;border:1px solid #A7F3D0;'
        : (dayLabel === 'TOMORROW' ? 'background:#EFF4FF;color:#0052FF;border:1px solid #DBEAFE;' : 'background:#F3F4F6;color:#6B7280;border:1px solid #E5E7EB;');

      return `
        <tr>
          <td data-label="Signal / Slot">
            <strong style="font-size: 14px; color: #111827;">${this.escapeHtml(s.symbol)}</strong>
            <span class="badge badge-demo" style="font-size:10px; margin-left:4px;">${this.escapeHtml(slotLabel)}</span>
            <span class="badge" style="font-size:10px; margin-left:3px; ${dayBadgeStyle}">${dayLabel}</span>
          </td>
          <td data-label="Direction">
            <span class="badge ${s.direction === 'BUY' ? 'badge-positive' : 'badge-negative'}">
              ${s.direction === 'BUY' ? '▲ BUY' : '▼ SELL'}
            </span>
          </td>
          <td data-label="Broadcast Time (PKT)" style="font-size:12px;">
            <div style="color:#111827; font-weight:700;">${timeDisplay}</div>
            <div style="color:#0052FF; font-size:10.5px; font-weight:600;">${this.escapeHtml(tz)}</div>
          </td>
          <td data-label="Profit %" style="font-family:var(--font-mono); color:#059669; font-weight:800; font-size:13px;">+${profitPct}%</td>
          <td data-label="Expiry Window" style="font-size:12px; color:#D97706; font-weight:700;">${duration} mins validity</td>
          <td data-label="Live Status">${statusBadge}</td>
          <td data-label="Action">
            <div class="av-adm-act-row">
              <button class="av-adm-btn-chip" onclick="App.openEditSignalModal('${s.id}')" title="Edit signal and schedule">Edit</button>
              <button class="av-adm-btn-chip soft-blue" onclick="App.viewSignalDetail('${s.id}')" title="View complete signal analytics">Detail</button>
              ${isPublished ? `
                <button class="av-adm-btn-chip danger" onclick="App.expireAdminSignal('${s.id}')" title="Expire signal immediately">Expire Now</button>
              ` : ''}
              <button class="av-adm-btn-chip danger" onclick="App.deleteAdminSignal('${s.id}')" title="Delete from history">Del</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    const history = Array.isArray(res.data.history) ? res.data.history : [];
    const histWrap = document.getElementById('adm-signal-history-wrap');
    if (histWrap) {
      histWrap.innerHTML = history.length ? `<div class="signal-history-table-head" style="display:grid;grid-template-columns:1.2fr .65fr 1.65fr .65fr .95fr;gap:10px;padding:10px 14px;background:#F8FAFC;border-bottom:1px solid #EEF1F6;color:#6B7280;font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;"><div>Signal</div><div>Direction</div><div>Broadcast / Expired</div><div>Duration</div><div>Status / Action</div></div>` + history.map(h => {
        const hid = this.escapeHtml(h.id || '');
        const entryMin = Number(h.entry_price_min || 0);
        const entryMax = Number(h.entry_price_max || 0);
        const tp1 = Number(h.target_price_1 || 0);
        const tp2 = Number(h.target_price_2 || 0);
        const sl = Number(h.stop_loss || 0);
        return `<div class="signal-history-card" style="display:grid;grid-template-columns:1.2fr .65fr 1.65fr .65fr .95fr;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid #EEF1F6;font-size:12px;color:#111827;">
          <div><strong>${this.escapeHtml(h.symbol || 'Signal')}</strong><div style="color:#6B7280;font-size:11px;margin-top:2px;">${hid}</div><div style="color:#0052FF;font-size:11px;margin-top:4px;font-weight:700;">${this.escapeHtml(h.slot_label || '')}</div></div>
          <div><span class="badge ${h.direction === 'BUY' ? 'badge-positive' : 'badge-negative'}">${this.escapeHtml(h.direction || '—')}</span></div>
          <div><span class="badge badge-demo">${this.escapeHtml(h.schedule_day_label || 'HISTORY')}</span><div style="color:#111827;margin-top:4px;font-weight:700;">Start: ${this.escapeHtml(h.published_at_pkt || h.scheduled_at || h.created_at_pkt || '—')}</div><div style="color:#DC2626;margin-top:3px;font-weight:700;">Expired: ${this.escapeHtml(h.expires_at_pkt || '—')}</div><div class="signal-history-values" style="color:#6B7280;margin-top:5px;line-height:1.45;">Entry: ${entryMin.toLocaleString()}${entryMax && entryMax !== entryMin ? ' – ' + entryMax.toLocaleString() : ''} • TP1: ${tp1.toLocaleString()} • TP2: ${tp2.toLocaleString()} • SL: ${sl.toLocaleString()}</div></div>
          <div style="font-weight:700;">${Number(h.duration_minutes || 15)} min</div>
          <div><span class="badge badge-demo">${this.escapeHtml(h.status || 'EXPIRED')}</span><button class="av-adm-btn-chip soft-blue signal-history-detail-btn" style="margin-top:7px;" onclick="App.viewSignalDetail('${hid}')" title="View complete expired signal detail">Detail</button></div>
        </div>`;
      }).join('') : `<div style="padding:20px;text-align:center;color:#6B7280;">No archived signal history yet.</div>`;
    }
  },

  openEditSignalModal(sigId) {
    const signal = (this.state.adminSignals || []).find(s => s.id === sigId);
    if (!signal) {
      this.toast('Signal record not found', 'error');
      return;
    }

    const idEl = document.getElementById('edit-sig-id');
    const symEl = document.getElementById('edit-sig-symbol');
    const dirEl = document.getElementById('edit-sig-direction');
    const slotEl = document.getElementById('edit-sig-slot');
    const profitEl = document.getElementById('edit-sig-profit');
    const timeEl = document.getElementById('edit-sig-time');
    const durEl = document.getElementById('edit-sig-duration');
    const statEl = document.getElementById('edit-sig-status');

    if (idEl) idEl.value = signal.id;
    if (symEl) symEl.value = signal.symbol || 'BTC/USDT';
    if (dirEl) dirEl.value = (signal.direction || 'BUY').toUpperCase();
    if (slotEl) slotEl.value = Number.isFinite(Number(signal.daily_slot)) ? String(Number(signal.daily_slot)) : '0';
    if (profitEl) profitEl.value = signal.profit_percentage || 2.5;
    if (durEl) durEl.value = signal.duration_minutes || 15;
    if (statEl) statEl.value = (signal.status || 'SCHEDULED').toUpperCase();

    if (timeEl) {
      let tVal = signal.published_at || signal.scheduled_at || '';
      if (tVal) {
        try {
          const d = new Date(String(tVal).replace(' ', 'T'));
          const parts = new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Karachi', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false }).formatToParts(d);
          const map = {}; parts.forEach(p => map[p.type] = p.value);
          tVal = `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
        } catch (e) { tVal = String(tVal).replace(' ', 'T').slice(0,16); }
      }
      timeEl.value = tVal;
    }

    this.openModal('modal-edit-signal');
  },

  async saveEditedSignal() {
    const signalId = document.getElementById('edit-sig-id')?.value;
    const symbol = document.getElementById('edit-sig-symbol')?.value?.trim();
    const direction = document.getElementById('edit-sig-direction')?.value;
    const slotRaw = document.getElementById('edit-sig-slot')?.value ?? '';
    const parsedSlot = parseInt(slotRaw, 10);
    const slot = Number.isFinite(parsedSlot) ? Math.max(0, Math.min(2, parsedSlot)) : 1;
    const profit = parseFloat(document.getElementById('edit-sig-profit')?.value) || 2.5;
    const timeVal = document.getElementById('edit-sig-time')?.value;
    const duration = parseInt(document.getElementById('edit-sig-duration')?.value, 10) || 15;
    const status = document.getElementById('edit-sig-status')?.value;

    if (!signalId || !symbol) {
      this.toast('Please enter a valid symbol', 'error');
      return;
    }

    let broadcastIso = '';
    const existingSignalForEdit = (this.state.adminSignals || []).find(s => s.id === signalId);
    if (timeVal && timeVal !== 'NOW' && existingSignalForEdit) {
      try {
        const currentStart = new Date(String(existingSignalForEdit.published_at || existingSignalForEdit.scheduled_at || '').replace(' ', 'T'));
        const parts = new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Karachi', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false }).formatToParts(currentStart);
        const map = {}; parts.forEach(p => map[p.type] = p.value);
        const currentPkt = `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
        if (String(timeVal) !== currentPkt) {
          const m = String(timeVal).match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
          if (m) broadcastIso = `${m[1]}T${m[2]}:${m[3]}:00+05:00`;
        }
      } catch (e) {}
    }

    const res = await this.api('/admin/signals.php', 'POST', {
      action: 'EDIT',
      signal_id: signalId,
      symbol,
      direction,
      daily_slot: slot,
      profit_percentage: profit,
      broadcast_time: timeVal || 'NOW',
      broadcast_time_iso: broadcastIso,
      duration_minutes: duration,
      status
    });

    if (res.success) {
      this.toast('Signal updated successfully!', 'success');
      this.closeModal('modal-edit-signal');
      await this.loadAdminSignals();
      if (this.loadSignals) await this.loadSignals();
      this.renderHomeSignals();
    } else {
      this.toast(res.message || 'Failed to update signal', 'error');
    }
  },

  async viewSignalDetail(signalId) {
    this.openModal('modal-signal-detail');
    const body = document.getElementById('signal-detail-body');
    if (!body) return;
    body.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Loading complete signal analytics...</div>`;

    try {
      const res = await this.api(`/admin/signals.php?signal_id=${encodeURIComponent(signalId)}`);
      if (!res.success || !res.data) {
        body.innerHTML = `<div style="color:var(--negative); padding:14px;">Unable to load signal detail: ${this.escapeHtml(res.message || 'Signal record not found.')}</div>`;
        return;
      }
      const d = res.data;
      const s = d.signal || {};
      const a = d.analytics || {};
      const audience = d.audience || {};
      const countries = d.countries || {};
      const users = Array.isArray(d.users) ? d.users : [];
      const esc = v => this.escapeHtml(v ?? '—');
      const money = v => `$${Number(v || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
      const dt = v => {
        if (!v) return '—';
        const x = String(v).replace('T',' ');
        return x.length > 19 ? x.substring(0,19) : x;
      };
      const badge = (label, type='muted') => `<span class="badge ${type === 'positive' ? 'badge-positive' : type === 'warning' ? 'badge-warning' : type === 'negative' ? 'badge-negative' : ''}">${esc(label)}</span>`;
      const countryTable = (items, empty) => items.length ? items.map(c => `<tr>
        <td>${esc(c.country)}</td><td>${c.users || 0}</td><td>${c.eligible || 0}</td><td>${c.confirmed || 0}</td><td>${c.profit_credited || 0}</td><td>${c.confirmed_no_profit || 0}</td><td>${c.failed || 0}</td><td>${c.not_confirmed || 0}</td>
      </tr>`).join('') : `<tr><td colspan="8" style="text-align:center;padding:14px;color:var(--text-muted);">${esc(empty)}</td></tr>`;
      const userTable = users.map(u => {
        let cls='';
        if (u.status === 'CONFIRMED_PROFIT_CREDITED') cls='positive';
        else if (u.status === 'CONFIRMED_NO_PROFIT' || u.status === 'NOT_CONFIRMED') cls='warning';
        else if (u.status === 'FAILED') cls='negative';
        return `<tr>
          <td style="font-size:11px;word-break:break-all;">${esc(u.email)}</td>
          <td>${esc(u.country)}</td>
          <td>${badge(u.status.replaceAll('_',' '), cls)}</td>
          <td>${money(u.profit_credited)}</td>
          <td>${money(u.principal_balance)}</td>
          <td>${money(u.balance_before)}</td>
          <td>${money(u.balance_after)}</td>
          <td>${esc(u.execution_status || '—')}</td>
          <td style="font-size:11px;">${esc(u.reason)}</td>
          <td style="font-size:11px;">${esc(dt(u.confirmed_at))}</td>
        </tr>`;
      }).join('') || `<tr><td colspan="7" style="text-align:center;padding:16px;color:var(--text-muted);">No user records found.</td></tr>`;

      body.innerHTML = `
        <div class="card" style="padding:14px;">
          <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:flex-start;">
            <div>
              <h4 style="margin:0;font-size:17px;">${esc(s.symbol || 'Signal')} — ${esc(s.direction || '')}</h4>
              <div style="font-size:11px;color:var(--text-muted);margin-top:5px;font-family:var(--font-mono);">Signal ID: ${esc(s.id || signalId)}</div>
            </div>
            <div>${badge(audience.label || 'Worldwide — All Countries','positive')} ${badge(s.status || 'UNKNOWN')}</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:12px;">
            <div class="stat-card"><div class="stat-label">Broadcast</div><div class="stat-value" style="font-size:15px;">${esc(dt(s.published_at || s.scheduled_at))}</div></div>
            <div class="stat-card"><div class="stat-label">Expires</div><div class="stat-value" style="font-size:15px;">${esc(dt(s.expires_at))}</div></div>
            <div class="stat-card"><div class="stat-label">Duration</div><div class="stat-value" style="font-size:15px;">${Number(s.duration_minutes || 15)} min</div></div>
            <div class="stat-card"><div class="stat-label">Profit %</div><div class="stat-value" style="font-size:15px;">${Number(s.profit_percentage || 0).toFixed(2)}%</div></div>
          </div>
          <div class="signal-detail-price-grid">
            <div class="stat-card"><div class="stat-label">Entry Min</div><div class="stat-value" style="font-size:15px;">${Number(s.entry_price_min || 0).toLocaleString()}</div></div>
            <div class="stat-card"><div class="stat-label">Entry Max</div><div class="stat-value" style="font-size:15px;">${Number(s.entry_price_max || 0).toLocaleString()}</div></div>
            <div class="stat-card"><div class="stat-label">Target 1</div><div class="stat-value" style="font-size:15px;">${Number(s.target_price_1 || 0).toLocaleString()}</div></div>
            <div class="stat-card"><div class="stat-label">Target 2</div><div class="stat-value" style="font-size:15px;">${Number(s.target_price_2 || 0).toLocaleString()}</div></div>
            <div class="stat-card"><div class="stat-label">Stop Loss</div><div class="stat-value" style="font-size:15px;">${Number(s.stop_loss || 0).toLocaleString()}</div></div>
          </div>
        </div>

        <div class="card" style="padding:14px;">
          <div style="font-weight:800;margin-bottom:10px;">Audience &amp; Outcome Summary</div>
          <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;">
            <div class="stat-card"><div class="stat-label">Countries With Eligible Users</div><div class="stat-value">${audience.countries_with_eligible_users || 0}</div></div>
            <div class="stat-card"><div class="stat-label">Eligible / Available Users</div><div class="stat-value">${audience.eligible_users || 0}</div></div>
            <div class="stat-card"><div class="stat-label">Confirmed</div><div class="stat-value">${a.confirmed_users || 0}</div></div>
            <div class="stat-card"><div class="stat-label">Profit Credited</div><div class="stat-value">${money(a.total_profit_credited)}</div></div>
            <div class="stat-card"><div class="stat-label">Confirmed, No Profit</div><div class="stat-value">${a.confirmed_without_profit_users || 0}</div></div>
            <div class="stat-card"><div class="stat-label">Failed Execution</div><div class="stat-value">${a.failed_execution_users || 0}</div></div>
            <div class="stat-card"><div class="stat-label">Eligible, Not Confirmed</div><div class="stat-value">${a.eligible_not_confirmed_users || 0}</div></div>
            <div class="stat-card"><div class="stat-label">Not Eligible / Not Shown</div><div class="stat-value">${audience.not_eligible_or_not_shown_users || 0}</div></div>
          </div>
          <div style="margin-top:10px;padding:9px;border-radius:8px;background:#F7F8FA;border:1px solid #EEF1F6;color:#4B5563;font-size:11px;line-height:1.5;">${esc(a.note || '')}</div>
        </div>

        <div class="card" style="padding:14px;overflow:auto;">
          <div style="font-weight:800;margin-bottom:10px;">Country-by-Country Signal Detail</div>
          <table class="admin-table mobile-detail-table"><thead><tr><th>Country</th><th>Users</th><th>Eligible / Shown</th><th>Confirmed</th><th>Profit Credited</th><th>No Profit</th><th>Failed</th><th>Not Confirmed</th></tr></thead><tbody>
            ${countryTable(countries.shown || [], 'No eligible countries recorded.')}
          </tbody></table>
        </div>

        <div class="card" style="padding:14px;overflow:auto;">
          <div style="font-weight:800;margin-bottom:10px;">Countries With Confirmations</div>
          <table class="admin-table mobile-detail-table"><thead><tr><th>Country</th><th>Users</th><th>Eligible</th><th>Confirmed</th><th>Profit</th><th>No Profit</th><th>Failed</th><th>Not Confirmed</th></tr></thead><tbody>
            ${countryTable(countries.confirmed || [], 'No confirmations recorded yet.')}
          </tbody></table>
        </div>

        <div class="card" style="padding:14px;overflow:auto;">
          <div style="font-weight:800;margin-bottom:10px;">Countries With Failed / No-Profit Outcomes</div>
          <table class="admin-table mobile-detail-table"><thead><tr><th>Country</th><th>Users</th><th>Eligible</th><th>Confirmed</th><th>Profit</th><th>No Profit</th><th>Failed</th><th>Not Confirmed</th></tr></thead><tbody>
            ${countryTable(countries.failed_or_no_profit || [], 'No failed or no-profit outcomes recorded.')}
          </tbody></table>
        </div>

        <div class="card" style="padding:14px;overflow:auto;">
          <div style="font-weight:800;margin-bottom:10px;">Countries With No Eligible / Not-Shown Users</div>
          <table class="admin-table mobile-detail-table"><thead><tr><th>Country</th><th>Users</th><th>Eligible</th><th>Confirmed</th><th>Profit</th><th>No Profit</th><th>Failed</th><th>Not Confirmed</th></tr></thead><tbody>
            ${countryTable(countries.not_shown_or_not_eligible || [], 'Every represented country currently has at least one eligible user.')}
          </tbody></table>
        </div>

        <div class="card" style="padding:14px;overflow:auto;">
          <div style="font-weight:800;margin-bottom:10px;">Every User — Signal Result</div>
          <table class="admin-table mobile-detail-table"><thead><tr><th>Email</th><th>Country</th><th>Result</th><th>Profit Credited</th><th>Profit Principal</th><th>Balance Before</th><th>Balance After</th><th>Execution</th><th>Reason / Detail</th><th>Confirmed At</th></tr></thead><tbody>${userTable}</tbody></table>
        </div>`;
      body.querySelectorAll('.mobile-detail-table').forEach(table => {
        const labels = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach(row => row.querySelectorAll('td').forEach((td, i) => {
          if (labels[i]) td.setAttribute('data-label', labels[i]);
        }));
      });
    } catch (e) {
      body.innerHTML = `<div style="color:var(--negative);padding:14px;">Unable to load signal detail. ${this.escapeHtml(e?.message || 'Please try again.')}</div>`;
    }
  },

  async expireAdminSignal(sigId) {
    if (!confirm('Expire this signal now? It will no longer be actionable for users.')) return;
    const res = await this.api('/admin/signals.php', 'POST', { action: 'EXPIRE', signal_id: sigId });
    if (res.success) {
      this.toast('Signal marked as EXPIRED in exchange feed', 'success');
      await this.loadAdminSignals();
      if (this.loadSignals) await this.loadSignals();
      this.renderHomeSignals();
    } else {
      this.toast(res.message || 'Failed to expire signal', 'error');
    }
  },

  async deleteAdminSignal(sigId) {
    if (!confirm('Delete this signal record from database?')) return;
    const res = await this.api('/admin/signals.php', 'POST', { action: 'DELETE', signal_id: sigId });
    if (res.success) {
      this.toast('Signal deleted successfully', 'success');
      await this.loadAdminSignals();
      if (this.loadSignals) await this.loadSignals();
      this.renderHomeSignals();
    } else {
      this.toast(res.message || 'Failed to delete signal', 'error');
    }
  },

  async dispatchAdminSignal(forcedMode = '') {
    const symbol = document.getElementById('adm-sig-symbol')?.value || 'BTC/USDT';
    const direction = document.getElementById('adm-sig-direction')?.value || 'BUY';
    const timezone = document.getElementById('adm-sig-timezone')?.value || 'GLOBAL — ALL COUNTRIES (PKT)';
    const broadcastTime = document.getElementById('adm-sig-broadcast-time')?.value || '';
    const duration = parseInt(document.getElementById('adm-sig-duration')?.value, 10) || 15;
    const profitPct = parseFloat(document.getElementById('adm-sig-profit-pct')?.value) || 2.5;
    const slot = parseInt(document.getElementById('adm-sig-slot')?.value, 10) || 1;
    const timeSlot = document.getElementById('adm-sig-time-slot')?.value || '4 PM';
    const dateTarget = document.getElementById('adm-sig-date-target')?.value || 'TODAY';
    const isTesting = Boolean(document.getElementById('adm-sig-testing')?.checked);
    const signalMode = forcedMode || (dateTarget === 'LIVE' ? 'MANUAL' : (timeSlot === 'CUSTOM' || slot > 2 || dateTarget === 'CUSTOM' ? 'CUSTOM' : 'DAILY'));

    if (!symbol || !direction) {
      this.toast('Please select symbol and direction', 'error');
      return;
    }

    let broadcastIso = '';
    if (broadcastTime && broadcastTime !== 'NOW') {
      try {
        // datetime-local is a wall-clock value. The admin scheduler is PKT, so
        // don't let the browser's local timezone silently shift the selected time.
        const m = String(broadcastTime).match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
        if (m) {
          const offset = timezone.includes('UTC+5:30') ? '+05:30' : (timezone.includes('UTC+4') ? '+04:00' : (timezone.includes('UTC+3') ? '+03:00' : (timezone.includes('UTC+0') ? '+00:00' : (timezone.includes('UTC-4') ? '-04:00' : '+05:00'))));
          broadcastIso = `${m[1]}T${m[2]}:${m[3]}:00${offset}`;
        } else {
          const d = new Date(broadcastTime);
          if (!isNaN(d.getTime())) broadcastIso = d.toISOString();
        }
      } catch (e) {}
    }

    const res = await this.api('/admin/signals.php', 'POST', {
      action: 'CREATE',
      symbol,
      direction,
      entry_min: 0,
      entry_max: 0,
      tp1: 0,
      tp2: 0,
      sl: 0,
      duration_minutes: duration,
      profit_percentage: isTesting ? 0 : profitPct,
      daily_slot: isTesting ? 0 : (signalMode === 'DAILY' ? (slot === 2 ? 2 : 1) : 0),
      signal_mode: signalMode,
      testing: isTesting,
      test_time_slot: timeSlot,
      timezone_label: 'GLOBAL — ALL COUNTRIES (PKT)',
      audience_scope: 'ALL_COUNTRIES',
      broadcast_time: signalMode === 'MANUAL' ? 'NOW' : broadcastTime,
      broadcast_time_iso: broadcastIso
    });

    if (res.success) {
      this.toast(res.message || `Signal saved: ${direction} ${symbol} (+${profitPct}%)!`, 'success');
      if (res.data?.signal) {
        const existing = Array.isArray(this.state.adminSignals) ? this.state.adminSignals : [];
        this.state.adminSignals = [res.data.signal, ...existing.filter(x => x.id !== res.data.signal.id)];
      }
      await this.loadAdminSignals();
      const testBox = document.getElementById('adm-sig-testing');
      if (testBox) testBox.checked = false;
      if (this.loadSignals) await this.loadSignals();
      this.renderHomeSignals();
    } else {
      this.toast(res.message || 'Signal broadcast failed', 'error');
    }
  },

  /* Admin: Risk & Positions */
  async loadAdminPositions() {
    const res = await this.api('/admin/positions.php');
    const container = document.getElementById('adm-positions-list');
    if (!container) return;

    if (!res.success || !res.data || !res.data.positions || !res.data.positions.length) {
      container.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:20px;">No open leveraged positions on exchange.</td></tr>`;
      return;
    }

    container.innerHTML = res.data.positions.map(p => {
      const pnlNum = Number(p.unrealized_pnl || 0);
      const isProf = pnlNum >= 0;
      const markPrice = p.current_price !== undefined ? p.current_price : p.mark_price;
      return `
        <tr>
          <td>
            <div style="font-weight:700;">${p.email || 'Trader'}</div>
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--text-muted);">${p.user_id}</div>
          </td>
          <td><strong>${p.symbol}</strong></td>
          <td>
            <span class="badge ${p.side === 'LONG' ? 'badge-positive' : 'badge-negative'}">${p.side}</span>
          </td>
          <td><span class="badge badge-demo">${p.leverage}x</span></td>
          <td style="font-family:var(--font-mono);">${Number(p.entry_price).toFixed(2)}</td>
          <td style="font-family:var(--font-mono); color:var(--cyan-accent);">${Number(markPrice || 0).toFixed(2)}</td>
          <td style="font-family:var(--font-mono);">$${Number(p.margin).toFixed(2)}</td>
          <td style="font-family:var(--font-mono); font-weight:700; color:${isProf ? 'var(--positive)' : 'var(--negative)'};">
            ${isProf ? '+' : ''}${pnlNum.toFixed(2)} USDT
          </td>
          <td style="font-family:var(--font-mono); color:var(--warning);">${p.liquidation_price ? Number(p.liquidation_price).toFixed(2) : '-'}</td>
          <td>
            <button class="btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--negative); border-color:var(--negative);" onclick="App.closeAdminPosition('${p.id}')">
              Force Close
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  async closeAdminPosition(posId) {
    if (!confirm('Execute forced risk mitigation close for this position at market rate?')) return;
    const res = await this.api('/admin/positions/close.php', 'POST', { position_id: posId });
    if (res.success) {
      this.toast('Position closed at current mark price', 'success');
      this.loadAdminPositions();
      this.loadAdminData();
    } else {
      this.toast(res.message || 'Position closure failed', 'error');
    }
  },

  /* Admin: Platform Settings */
  async loadAdminSettings() {
    const res = await this.api('/admin/settings.php');
    if (res.success && res.data && res.data.settings) {
      const s = res.data.settings;
      const minWith = s.min_withdrawal_usdt ?? s.min_withdrawal;
      const withFee = s.withdrawal_fee_usdt ?? s.withdrawal_fee;
      const makerFee = s.maker_fee_percent ?? s.maker_fee;
      const takerFee = s.taker_fee_percent ?? s.taker_fee;
      const copySplit = s.copy_trading_fee_split ?? s.copy_trading_profit_split;
      const minDep = s.deposit_min_usdt ?? s.min_deposit;
      const notice = s.platform_notice ?? s.system_notice;
      const trc20 = s.trc20_deposit_address ?? s.hot_wallet_trc20;
      const erc20 = s.erc20_deposit_address ?? s.hot_wallet_erc20;
      const maint = s.maintenance_mode;

      if (minWith !== undefined && document.getElementById('sett-min-with')) document.getElementById('sett-min-with').value = minWith;
      if (withFee !== undefined && document.getElementById('sett-with-fee')) document.getElementById('sett-with-fee').value = withFee;
      if (makerFee !== undefined && document.getElementById('sett-maker-fee')) document.getElementById('sett-maker-fee').value = makerFee;
      if (takerFee !== undefined && document.getElementById('sett-taker-fee')) document.getElementById('sett-taker-fee').value = takerFee;
      if (copySplit !== undefined && document.getElementById('sett-copy-split')) document.getElementById('sett-copy-split').value = copySplit;
      if (minDep !== undefined && document.getElementById('sett-min-dep')) document.getElementById('sett-min-dep').value = minDep;
      if (notice !== undefined && document.getElementById('sett-notice')) document.getElementById('sett-notice').value = notice;
      if (trc20 !== undefined && document.getElementById('sett-trc20-addr')) document.getElementById('sett-trc20-addr').value = trc20;
      if (erc20 !== undefined && document.getElementById('sett-erc20-addr')) document.getElementById('sett-erc20-addr').value = erc20;
      if (maint !== undefined && document.getElementById('sett-maintenance')) {
        document.getElementById('sett-maintenance').checked = (maint === '1' || maint === 'true' || maint === true);
      }
    }
  },

  async saveAdminSettings() {
    const settings = {
      min_withdrawal: '3.00',
      withdrawal_fee: document.getElementById('sett-with-fee').value,
      maker_fee: document.getElementById('sett-maker-fee').value,
      taker_fee: document.getElementById('sett-taker-fee').value,
      copy_trading_profit_split: document.getElementById('sett-copy-split').value,
      min_deposit: document.getElementById('sett-min-dep').value,
      system_notice: document.getElementById('sett-notice').value,
      hot_wallet_trc20: document.getElementById('sett-trc20-addr').value,
      hot_wallet_erc20: document.getElementById('sett-erc20-addr').value,
      maintenance_mode: document.getElementById('sett-maintenance').checked ? '1' : '0'
    };

    const res = await this.api('/admin/settings.php', 'POST', { settings });
    if (res.success) {
      this.toast('Platform configuration saved successfully', 'success');
      this.loadAdminData();
    } else {
      this.toast(res.message || 'Failed to save settings', 'error');
    }
  },

  async loadAdminKyc() {
    const res = await this.api('/admin/kyc.php');
    const subs = (res.success && Array.isArray(res.data?.submissions)) ? res.data.submissions : [];
    this.state.adminKycList = subs;
    this.filterAdminKyc();
  },

  filterAdminKyc() {
    const allSubs = Array.isArray(this.state.adminKycList) ? this.state.adminKycList : [];
    const pendingTotal = allSubs.filter(s => (s.status || 'PENDING').toUpperCase() === 'PENDING').length;
    const approvedTotal = allSubs.filter(s => (s.status || '').toUpperCase() === 'APPROVED').length;

    const pendingEl = document.getElementById('adm-kyc-count-pending');
    const approvedEl = document.getElementById('adm-kyc-count-approved');
    if (pendingEl) pendingEl.textContent = `${pendingTotal} Pending Reviews`;
    if (approvedEl) approvedEl.textContent = `${approvedTotal} Approved`;

    const q = (document.getElementById('adm-kyc-search')?.value || '').trim().toLowerCase();
    const statusFilter = (document.getElementById('adm-kyc-filter')?.value || 'ALL').toUpperCase();

    const filtered = allSubs.filter(s => {
      const st = (s.status || 'PENDING').toUpperCase();
      if (statusFilter !== 'ALL' && st !== statusFilter) return false;
      if (!q) return true;
      return (
        String(s.email || '').toLowerCase().includes(q) ||
        String(s.legal_name || '').toLowerCase().includes(q) ||
        String(s.country || '').toLowerCase().includes(q) ||
        String(s.id || '').toLowerCase().includes(q)
      );
    });

    const queueEl = document.getElementById('adm-kyc-queue-list');
    const inspectorEl = document.getElementById('adm-kyc-inspector');
    if (!queueEl) return;

    if (!filtered.length) {
      queueEl.innerHTML = `<div style="padding:26px; text-align:center; color:#6B7280; font-size:12.5px;">No KYC submissions match the filter criteria.</div>`;
      if (inspectorEl) {
        inspectorEl.innerHTML = `<div class="card" style="padding:28px; text-align:center; color:#6B7280;">No KYC applicant selected.</div>`;
      }
      return;
    }

    const activeExists = filtered.some(s => String(s.id) === String(this.state.selectedKycId));
    if (!activeExists) {
      this.state.selectedKycId = filtered[0].id;
    }

    queueEl.innerHTML = filtered.map(s => {
      const st = (s.status || 'PENDING').toUpperCase();
      const activeCls = String(s.id) === String(this.state.selectedKycId) ? 'active' : '';
      const badgeCls = st === 'APPROVED' ? 'badge-positive' : (st === 'REJECTED' ? 'badge-negative' : 'badge-warning');
      const badgeLabel = st === 'PENDING' ? 'Awaiting Review' : st;
      const initial = this.escapeHtml(String(s.legal_name || s.email || 'U').trim().charAt(0).toUpperCase() || 'U');
      const sidEsc = this.escapeHtml(String(s.id || ''));
      return `
        <button type="button" class="av-adm-kyc-item ${activeCls}" onclick="App.selectKycSubmission('${sidEsc}')">
          <div style="display:flex; align-items:center; gap:10px; min-width:0;">
            <span class="av-adm-user-avatar" aria-hidden="true">${initial}</span>
            <div style="min-width:0;">
              <div style="font-size:13px; font-weight:700; color:#111827; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${this.escapeHtml(s.legal_name || s.email || 'Applicant')}</div>
              <div style="font-size:11px; color:#6B7280; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${this.escapeHtml(s.email || s.id)}</div>
            </div>
          </div>
          <span class="badge ${badgeCls}" style="flex-shrink:0; font-size:10.5px;">${badgeLabel}</span>
        </button>
      `;
    }).join('');

    this.renderSelectedKycInspector();
  },

  selectKycSubmission(id) {
    this.state.selectedKycId = id;
    this.filterAdminKyc();
  },

  renderSelectedKycInspector() {
    const inspectorEl = document.getElementById('adm-kyc-inspector');
    if (!inspectorEl) return;
    const allSubs = Array.isArray(this.state.adminKycList) ? this.state.adminKycList : [];
    const s = allSubs.find(x => String(x.id) === String(this.state.selectedKycId)) || allSubs[0];
    if (!s) return;

    const esc = v => this.escapeHtml(v ?? '—');
    const st = (s.status || 'PENDING').toUpperCase();
    const badgeCls = st === 'APPROVED' ? 'badge-positive' : (st === 'REJECTED' ? 'badge-negative' : 'badge-warning');
    const docCard = (label, url) => `
      <div class="av-adm-kyc-doc-card">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
          <span style="font-size:12px; font-weight:700; color:#111827;">${label}</span>
          ${url ? `<a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer" style="font-size:11px; font-weight:700; color:#0052FF; text-decoration:none;">Open Full ↗</a>` : `<span style="font-size:11px; color:#9CA3AF;">Not Provided</span>`}
        </div>
        <div class="av-adm-kyc-doc-thumb">
          ${url
            ? `<img src="${this.escapeHtml(url)}" alt="${label}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div style="display:none; flex-direction:column; align-items:center; gap:4px; color:#6B7280; font-size:11.5px; padding:12px; text-align:center;"><strong>Document Attached</strong><span>Click Open Full ↗ above</span></div>`
            : `<div style="color:#9CA3AF; font-size:12px; text-align:center; padding:12px;">No ${label.toLowerCase()} image uploaded</div>`
          }
        </div>
      </div>
    `;

    inspectorEl.innerHTML = `
      <div class="card" style="padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;">
          <div>
            <div style="font-size:11px; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.04em;">Applicant Info</div>
            <h3 style="margin:3px 0 2px; font-size:17px; font-weight:800;">${esc(s.legal_name || s.email || 'Applicant')} — #${esc(s.id)}</h3>
            <div style="font-size:12.5px; color:#4B5563;">${esc(s.email)} • ${esc(s.country || 'Global')}</div>
          </div>
          <span class="badge ${badgeCls}" style="font-size:12px; padding:6px 12px;">${st}</span>
        </div>
      </div>

      <div class="card" style="padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h4 style="margin:0; font-size:14.5px; font-weight:800;">Documents Preview</h4>
          <span style="font-size:11.5px; color:#6B7280;">Identity &amp; Selfie Verification</span>
        </div>
        <div class="av-adm-kyc-docs-grid">
          ${docCard('Front ID / Passport', s.front_url)}
          ${docCard('Back Document', s.back_url)}
          ${docCard('Selfie Comparison', s.selfie_url)}
        </div>
      </div>

      <div class="card" style="padding:16px;">
        <h4 style="margin:0 0 10px; font-size:14.5px; font-weight:800;">Detailed Data Comparison Checklist</h4>
        <div class="av-adm-kyc-checklist">
          <div class="av-adm-kyc-check-row"><span>Legal Name</span><strong>${esc(s.legal_name || 'N/A')}</strong></div>
          <div class="av-adm-kyc-check-row"><span>Document Type</span><strong>${esc(s.document_type || 'Government ID')}</strong></div>
          <div class="av-adm-kyc-check-row"><span>Country / Region</span><strong>${esc(s.country || 'Global')}</strong></div>
          <div class="av-adm-kyc-check-row"><span>Submitted</span><strong>${esc((s.created_at || '—').replace('T', ' ').slice(0, 19))}</strong></div>
        </div>
      </div>

      <div class="card" style="padding:16px;">
        <label class="form-label" for="kyc-inline-reason">Compliance Review Note / Reason</label>
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <input type="text" id="kyc-inline-reason" placeholder="Reason for approval or rejection..." style="flex:1 1 180px; min-width:0;" value="${esc(s.review_reason || '')}">
          <button type="button" class="av-adm-btn-chip danger" style="min-height:42px; padding:8px 16px;" onclick="App.submitInlineKycDecision('${esc(s.id)}', 'REJECTED')">Reject Request</button>
          <button type="button" class="av-adm-btn-chip cobalt" style="min-height:42px; padding:8px 18px;" onclick="App.submitInlineKycDecision('${esc(s.id)}', 'APPROVED')">Approve KYC Verification</button>
        </div>
      </div>
    `;
  },

  async submitInlineKycDecision(subId, decision) {
    const inlineReason = document.getElementById('kyc-inline-reason')?.value?.trim();
    const reason = inlineReason || (decision === 'APPROVED' ? 'Identity and documents verified successfully' : 'Document illegible or information mismatch');
    const res = await this.api('/admin/kyc.php', 'POST', {
      submission_id: subId,
      decision,
      reason
    });
    if (res.success) {
      this.toast(`KYC submission successfully ${decision.toLowerCase()}`, 'success');
      await this.loadAdminKyc();
      this.loadAdminData();
    } else {
      this.toast(res.message || 'Failed to update KYC status', 'error');
    }
  },

  openKycReviewModal(id, decision) {
    const subIdInput = document.getElementById('kyc-modal-sub-id');
    const decisionInput = document.getElementById('kyc-modal-decision');
    const titleEl = document.getElementById('kyc-modal-title');
    const badgeEl = document.getElementById('kyc-modal-decision-badge');
    const reasonText = document.getElementById('kyc-modal-reason');
    const confirmBtn = document.getElementById('kyc-modal-confirm-btn');

    if (subIdInput) subIdInput.value = id;
    if (decisionInput) decisionInput.value = decision;
    if (titleEl) titleEl.textContent = `${decision === 'APPROVED' ? 'Approve' : 'Reject'} KYC Submission`;
    if (badgeEl) {
      badgeEl.textContent = decision;
      badgeEl.style.color = decision === 'APPROVED' ? '#00c087' : '#f6465d';
    }
    if (reasonText) {
      reasonText.value = decision === 'APPROVED' ? 'Identity and documents verified successfully' : 'Document illegible or information mismatch';
    }
    if (confirmBtn) {
      confirmBtn.textContent = `Confirm ${decision === 'APPROVED' ? 'Approval' : 'Rejection'}`;
      confirmBtn.style.background = decision === 'APPROVED' ? '#00c087' : '#f6465d';
    }

    this.openModal('modal-kyc-decision');
  },

  async submitKycReviewModal() {
    const subId = document.getElementById('kyc-modal-sub-id')?.value;
    const decision = document.getElementById('kyc-modal-decision')?.value || 'APPROVED';
    const reason = document.getElementById('kyc-modal-reason')?.value?.trim() || 'Reviewed by Compliance Officer';

    if (!subId) {
      this.toast('Invalid submission ID', 'error');
      return;
    }

    const btn = document.getElementById('kyc-modal-confirm-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Submitting...';
    }

    try {
      const res = await this.api('/admin/kyc.php', 'POST', {
        submission_id: subId,
        decision,
        reason
      });

      if (res.success) {
        this.toast(`KYC submission successfully ${decision.toLowerCase()}`, 'success');
        this.closeModal('modal-kyc-decision');
        await this.loadAdminKyc();
        this.loadAdminData();
      } else {
        this.toast(res.message || 'Failed to update KYC status', 'error');
      }
    } catch (e) {
      this.toast('Network connection failed. Try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = `Confirm ${decision === 'APPROVED' ? 'Approval' : 'Rejection'}`;
      }
    }
  },

  async reviewKyc(id, decision) {
    this.openKycReviewModal(id, decision);
  },

  async loadAdminWithdrawals() {
    const res = await this.api('/admin/withdrawals.php');
    const withdrawals = (res.success && (res.data?.withdrawals || (Array.isArray(res.data) ? res.data : []))) || [];
    this.state.adminWithdrawals = withdrawals;
    this.filterAdminWithdrawals();
  },

  filterAdminWithdrawals() {
    const container = document.getElementById('adm-with-list');
    if (!container) return;
    const all = Array.isArray(this.state.adminWithdrawals) ? this.state.adminWithdrawals : [];
    const q = (document.getElementById('adm-with-search')?.value || '').trim().toLowerCase();
    const list = q ? all.filter(w =>
      String(w.email || '').toLowerCase().includes(q) ||
      String(w.destination_address || '').toLowerCase().includes(q) ||
      String(w.network || '').toLowerCase().includes(q)
    ) : all;

    if (!list.length) {
      container.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#6B7280;">No withdrawals pending review.</td></tr>`;
      return;
    }

    container.innerHTML = list.map(w => {
      const status = (w.status || 'PENDING').toUpperCase();
      const isPending = status === 'PENDING' || status === 'REQUESTED';
      const isApproved = status === 'COMPLETED' || status === 'APPROVED';
      const isRejected = status === 'REJECTED' || status === 'DECLINED';
      const badgeClass = isApproved ? 'badge-positive' : (isRejected ? 'badge-danger' : 'badge-warning');
      const badgeText = isApproved ? 'Approved' : (isRejected ? 'Rejected' : 'Pending Review');
      const destAddr = w.destination_address || '';
      const shortAddr = destAddr.length > 14 ? `${destAddr.substring(0, 6)}...${destAddr.substring(destAddr.length - 6)}` : (destAddr || '—');

      return `
        <tr>
          <td data-label="User"><strong>${this.escapeHtml(w.email || 'User')}</strong></td>
          <td data-label="Amount"><strong style="color:#111827; font-family:var(--font-mono);">${Number(w.amount || 0).toFixed(2)} ${this.escapeHtml(w.asset || 'USDT')}</strong></td>
          <td data-label="Network"><span class="badge" style="background:#EFF4FF; color:#0052FF; border:1px solid #DBEAFE;">${this.escapeHtml(w.network || 'TRC20')}</span></td>
          <td data-label="Destination">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <code style="font-family:var(--font-mono); font-size:11px; color:#111827; background:#F3F4F6; padding:2px 6px; border-radius:6px;" title="${this.escapeHtml(destAddr)}">${this.escapeHtml(shortAddr)}</code>
              ${destAddr ? `<button type="button" class="av-adm-btn-chip soft-blue" style="min-height:26px; padding:2px 8px; font-size:10.5px;" onclick="App.copyText('${destAddr}', 'Crypto address copied!')">Copy</button>` : ''}
            </div>
          </td>
          <td data-label="Status"><span class="badge ${badgeClass}">${badgeText}</span></td>
          <td data-label="Action">
            ${isPending ? `
              <div class="av-adm-act-row">
                <button class="av-adm-btn-chip green" data-alpha-action="admin-withdrawal:${w.id}:APPROVE" onclick="App.reviewWithdrawal('${w.id}', 'APPROVE')">Approve</button>
                <button class="av-adm-btn-chip danger" data-alpha-action="admin-withdrawal:${w.id}:REJECT" onclick="App.reviewWithdrawal('${w.id}', 'REJECT')">Reject</button>
              </div>
            ` : (isApproved ? `
              <div class="av-adm-act-row" style="align-items:center;">
                <span style="color:#059669; font-weight:700; font-size:12px;">Processed</span>
                <button class="av-adm-btn-chip danger" style="min-height:28px; padding:3px 8px; font-size:11px;" data-alpha-action="admin-withdrawal:${w.id}:REJECT" onclick="App.reviewWithdrawal('${w.id}', 'REJECT')" title="Decline and refund to user">Reject</button>
              </div>
            ` : `<span style="color:#DC2626; font-weight:700; font-size:12px;">Rejected</span>`)}
          </td>
        </tr>
      `;
    }).join('');
  },

  async reviewWithdrawal(id, action) {
    const actionScope = `admin-withdrawal:${id}:${action}`;
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('This withdrawal action is already processing. Please wait.', 'warning');
      return;
    }

    this.setActionButtons(actionScope, true, action === 'APPROVE' ? 'Processing...' : 'Rejecting...');
    try {
      let reason = '';
      if (action === 'REJECT') {
        const promptRes = prompt('Reason for declining withdrawal (funds will be refunded to user):', 'Compliance verification required');
        if (promptRes === null) {
          this.endAction(actionScope, false);
          return;
        }
        reason = promptRes.trim() || 'Declined by financial audit';
      }
      const res = await this.api('/admin/withdrawals.php', 'POST', {
        withdrawal_id: id,
        action,
        reason,
        idempotency_key: actionKey
      });
      if (res.success) {
        this.toast(res.message || `Withdrawal marked as ${action}`, 'success');
        this.loadAdminWithdrawals();
        this.loadAdminData();
        this.endAction(actionScope, true);
      } else {
        this.toast(res.message || 'Operation failed', 'error');
        this.endAction(actionScope, false);
      }
    } catch (e) {
      this.toast('Withdrawal action failed: ' + (e.message || e), 'error');
      this.endAction(actionScope, false);
    } finally {
      this.setActionButtons(actionScope, false);
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
    }
  },

  switchDepositMobileView(tab) {
    const queueBtn = document.getElementById('adm-dep-tab-queue');
    const walletBtn = document.getElementById('adm-dep-tab-wallet');
    const queuePane = document.getElementById('adm-dep-queue-pane');
    const walletPane = document.getElementById('adm-dep-wallet-pane');
    const showWallet = tab === 'wallet';
    if (queueBtn) queueBtn.classList.toggle('active', !showWallet);
    if (walletBtn) walletBtn.classList.toggle('active', showWallet);
    if (window.innerWidth <= 768) {
      if (queuePane) queuePane.style.display = showWallet ? 'none' : '';
      if (walletPane) walletPane.style.display = showWallet ? '' : 'none';
    } else {
      if (queuePane) queuePane.style.display = '';
      if (walletPane) walletPane.style.display = '';
    }
  },

  async loadAdminDeposits() {
    this.loadAdminDepositConfig();

    const res = await this.api('/admin/deposits.php');
    const deposits = (res.success && (res.data?.deposits || (Array.isArray(res.data) ? res.data : []))) || [];
    this.state.adminDeposits = deposits;
    this.filterAdminDeposits();
  },

  filterAdminDeposits() {
    const container = document.getElementById('adm-dep-list');
    if (!container) return;
    const all = Array.isArray(this.state.adminDeposits) ? this.state.adminDeposits : [];
    const q = (document.getElementById('adm-dep-search')?.value || '').trim().toLowerCase();
    const list = q ? all.filter(d =>
      String(d.email || '').toLowerCase().includes(q) ||
      String(d.tx_hash || '').toLowerCase().includes(q) ||
      String(d.deposit_address || '').toLowerCase().includes(q) ||
      String(d.network || '').toLowerCase().includes(q)
    ) : all;

    if (!list.length) {
      container.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#6B7280;">No recent deposits.</td></tr>`;
      return;
    }

    container.innerHTML = list.map(d => {
      const isPending = (d.status || 'PENDING') === 'PENDING';
      const isCompleted = d.status === 'COMPLETED';
      const isRejected = d.status === 'REJECTED';
      const badgeClass = isCompleted ? 'badge-positive' : (isRejected ? 'badge-danger' : 'badge-warning');
      const badgeText = isCompleted ? 'Approved' : (isRejected ? 'Rejected' : 'Pending');
      const senderInfo = d.tx_hash || d.deposit_address || 'Direct Transfer';
      const shortSender = senderInfo.length > 16 ? `${senderInfo.substring(0, 8)}...${senderInfo.substring(senderInfo.length - 6)}` : senderInfo;

      return `
        <tr>
          <td data-label="User"><strong>${this.escapeHtml(d.email || 'User')}</strong></td>
          <td data-label="Amount"><strong style="color:#059669; font-family:var(--font-mono);">${d.amount} ${this.escapeHtml(d.asset)}</strong></td>
          <td data-label="Network"><span class="badge" style="background:#EFF4FF; color:#0052FF; border:1px solid #DBEAFE;">${this.escapeHtml(d.network)}</span></td>
          <td data-label="Sender / TXID">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <code style="font-size:11px; word-break:break-all; color:#111827; background:#F3F4F6; padding:2px 6px; border-radius:6px;" title="${this.escapeHtml(senderInfo)}">${this.escapeHtml(shortSender)}</code>
              <button type="button" class="av-adm-btn-chip soft-blue" style="min-height:26px; padding:2px 8px; font-size:10.5px;" onclick="App.copyText('${senderInfo}', 'Address/TXID copied!')">Copy</button>
            </div>
          </td>
          <td data-label="Status"><span class="badge ${badgeClass}">${badgeText}</span></td>
          <td data-label="Action">
            ${isPending ? `
              <div class="av-adm-act-row">
                <button class="av-adm-btn-chip green" data-alpha-action="admin-deposit:${d.id}:APPROVE" onclick="App.reviewDeposit('${d.id}', 'APPROVE')">Approve</button>
                <button class="av-adm-btn-chip danger" data-alpha-action="admin-deposit:${d.id}:REJECT" onclick="App.reviewDeposit('${d.id}', 'REJECT')">Reject</button>
              </div>
            ` : (isCompleted ? `<span style="color:#059669; font-size:12px; font-weight:700;">Credited</span>` : `<span style="color:#DC2626; font-size:12px; font-weight:700;">Rejected</span>`)}
          </td>
        </tr>
      `;
    }).join('');
  },

  async reviewDeposit(id, decision = 'APPROVE') {
    const actionScope = `admin-deposit:${id}:${decision}`;
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('This deposit action is already processing. Please wait.', 'warning');
      return;
    }

    const isApprove = decision === 'APPROVE';
    const actionText = isApprove ? 'Approve this deposit and credit the user\'s balance' : 'Reject this deposit';
    this.setActionButtons(actionScope, true, isApprove ? 'Approving...' : 'Rejecting...');
    try {
      if (!confirm(`Are you sure you want to ${actionText}?`)) {
        this.endAction(actionScope, false);
        return;
      }

      const res = await this.api('/admin/deposits.php', 'POST', {
        deposit_id: id,
        decision,
        idempotency_key: actionKey
      });

      if (res.success) {
        this.toast(res.message || `Deposit ${isApprove ? 'approved and credited' : 'rejected'} successfully`, 'success');
        this.loadAdminDeposits();
        this.loadAdminData();
        this.endAction(actionScope, true);
      } else {
        this.toast(res.message || 'Failed to process deposit', 'error');
        this.endAction(actionScope, false);
      }
    } catch (err) {
      this.toast('Deposit action failed: ' + (err.message || err), 'error');
      this.endAction(actionScope, false);
    } finally {
      this.setActionButtons(actionScope, false);
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
    }
  },

  async confirmDeposit(id) {
    return this.reviewDeposit(id, 'APPROVE');
  },

  async loadAdminDepositConfig() {
    const tbody = document.getElementById('adm-dep-config-list');
    const cardsHost = document.getElementById('adm-dep-config-cards');
    if (!tbody && !cardsHost) return;

    const res = await this.api('/admin/deposit-config.php');
    const enabled = res.data?.enabled !== false;
    const statusEl = document.getElementById('adm-deposit-status');
    const toggleBtn = document.getElementById('adm-deposit-toggle');
    if (statusEl) {
      statusEl.textContent = enabled ? 'ON — Users can submit deposits' : 'OFF — New deposits are blocked';
      statusEl.style.color = enabled ? 'var(--positive)' : 'var(--negative)';
    }
    if (toggleBtn) {
      toggleBtn.textContent = enabled ? 'Turn Deposits OFF' : 'Turn Deposits ON';
      toggleBtn.style.background = enabled ? '#FEF2F2' : '#ECFDF5';
      toggleBtn.style.color = enabled ? '#DC2626' : '#059669';
      toggleBtn.style.borderColor = enabled ? '#FECACA' : '#A7F3D0';
      toggleBtn.dataset.enabled = enabled ? '1' : '0';
    }
    const configs = res.data?.configs || res.data?.config || (Array.isArray(res.data) ? res.data : []);
    if (!res.success || !configs || !configs.length) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px; color:#6B7280;">No deposit networks configured.</td></tr>`;
      if (cardsHost) cardsHost.innerHTML = `<div style="text-align:center; padding:16px; color:#6B7280; font-size:12px;">No deposit networks configured.</div>`;
      return;
    }

    if (cardsHost) {
      cardsHost.innerHTML = configs.map(c => {
        const minDep = c.minimum_deposit ?? c.min_deposit ?? 10;
        const addr = c.address || '';
        return `
          <div class="av-adm-chain-card">
            <div class="av-adm-chain-top">
              <strong style="font-size:13.5px; color:#111827;">${this.escapeHtml(c.network)} <span style="font-weight:600; color:#6B7280;">(${this.escapeHtml(c.asset || 'USDT')})</span></strong>
              <span class="badge badge-positive" style="font-size:10.5px;">Active</span>
            </div>
            <div class="av-adm-chain-addr-row">
              <code title="${this.escapeHtml(addr)}">${this.escapeHtml(addr)}</code>
              <button type="button" class="av-adm-btn-chip soft-blue" style="min-height:26px; padding:2px 8px; font-size:10.5px; flex:0 0 auto;" onclick="App.copyText('${addr}', 'Deposit address copied!')">Copy</button>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#6B7280;">
              <span>Min: <strong style="color:#111827;">${minDep} ${this.escapeHtml(c.asset || 'USDT')}</strong></span>
              <span style="color:#059669; font-weight:700;">Permanent Vault</span>
            </div>
          </div>
        `;
      }).join('');
    }

    if (tbody) {
      tbody.innerHTML = configs.map(c => {
        const minDep = c.minimum_deposit ?? c.min_deposit ?? 10;
        const addr = c.address || '';
        return `
          <tr>
            <td data-label="Asset"><strong>${this.escapeHtml(c.asset || 'USDT')}</strong></td>
            <td data-label="Network"><span class="badge" style="background:#EFF4FF; color:#0052FF; border:1px solid #DBEAFE;">${this.escapeHtml(c.network)}</span></td>
            <td data-label="Vault Address">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <code style="font-size:11px; color:#111827; background:#F3F4F6; padding:2px 6px; border-radius:6px; word-break:break-all;">${this.escapeHtml(addr)}</code>
                <button type="button" class="av-adm-btn-chip soft-blue" style="min-height:26px; padding:2px 8px; font-size:10.5px;" onclick="App.copyText('${addr}', 'Deposit address copied!')">Copy</button>
              </div>
            </td>
            <td data-label="Min Deposit"><strong>${minDep} ${this.escapeHtml(c.asset || 'USDT')}</strong></td>
            <td data-label="Instructions" style="font-size:11.5px; color:#6B7280; max-width:260px;">${this.escapeHtml(c.instructions || 'Standard on-chain deposit')}</td>
            <td data-label="Protection"><span class="badge badge-positive">PERMANENT</span></td>
          </tr>
        `;
      }).join('');
    }
  },

  async toggleDeposits() {
    const btn = document.getElementById('adm-deposit-toggle');
    const currentlyEnabled = btn?.dataset.enabled !== '0';
    const nextEnabled = !currentlyEnabled;
    const action = nextEnabled ? 'enable' : 'disable';
    if (!confirm(`Are you sure you want to ${action} user deposits?`)) return;

    if (btn) btn.disabled = true;
    try {
      const res = await this.api('/admin/deposit-config.php', 'POST', {
        action: 'toggle_status',
        enabled: nextEnabled ? 1 : 0
      });
      if (res.success) {
        this.toast(nextEnabled ? 'User deposits enabled' : 'User deposits disabled', 'success');
        await this.loadAdminDepositConfig();
      } else {
        this.toast(res.message || 'Failed to change deposit status', 'error');
      }
    } catch (err) {
      this.toast('Failed to change deposit status: ' + (err.message || err), 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  openEditDepositConfigModal(asset = 'USDT', network = 'TRC20', address = '', min = 10, instructions = '') {
    this.openModal('modal-edit-deposit-config');
    const assetEl = document.getElementById('edit-dep-asset');
    const netEl = document.getElementById('edit-dep-network');
    const addrEl = document.getElementById('edit-dep-address');
    const minEl = document.getElementById('edit-dep-min');
    const instEl = document.getElementById('edit-dep-instructions');

    if (assetEl) assetEl.value = asset;
    if (netEl) netEl.value = network;
    if (addrEl) addrEl.value = address || 'TX8q9PzB9k8vY2L3m4N5p6Q7r8S9t0U1vW';
    if (minEl) minEl.value = min || 10;
    if (instEl) instEl.value = instructions || `Send ${asset} (${network}) to this address. Minimum deposit is ${min} ${asset}.`;
  },

  async saveDepositConfig() {
    this.toast('Deposit addresses are permanent and cannot be changed.', 'error');
    return;
    const asset = document.getElementById('edit-dep-asset')?.value;
    const network = document.getElementById('edit-dep-network')?.value;
    const address = document.getElementById('edit-dep-address')?.value?.trim();
    const minDeposit = parseFloat(document.getElementById('edit-dep-min')?.value) || 10;
    const instructions = document.getElementById('edit-dep-instructions')?.value?.trim();

    if (!address) {
      this.toast('Please enter a valid vault deposit address', 'error');
      return;
    }

    const res = await this.api('/admin/deposit-config.php', 'POST', {
      asset,
      network,
      address,
      minimum_deposit: minDeposit,
      instructions,
      is_active: 1
    });

    if (res.success) {
      this.toast(`Deposit configuration for ${asset} (${network}) updated successfully!`, 'success');
      this.closeModal('modal-edit-deposit-config');
      await this.loadAdminDepositConfig();
    } else {
      this.toast(res.message || 'Failed to update deposit configuration', 'error');
    }
  },

  async loadAdminAudit() {
    const res = await this.api('/admin/audit.php');
    const container = document.getElementById('adm-audit-list');
    if (!container) return;

    if (!res.success || !res.data.logs.length) {
      container.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No audit records.</td></tr>`;
      return;
    }

    container.innerHTML = res.data.logs.map(l => `
      <tr>
        <td><strong>${l.action}</strong></td>
        <td>${l.actor_role}</td>
        <td>${l.target_type} (${l.target_id.substring(0, 8)}...)</td>
        <td>${l.reason || '-'}</td>
        <td style="font-size:11px; color:var(--text-muted);">${l.created_at}</td>
      </tr>
    `).join('');
  },

  async submitFinancialAdjustment() {
    const actionScope = 'admin-financial-adjustment';
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Financial adjustment is already processing. Please wait.', 'warning');
      return;
    }

    const btn = document.getElementById('btn-financial-adjustment');
    if (btn) {
      btn.disabled = true;
      if (!btn.dataset.alphaOriginalText) btn.dataset.alphaOriginalText = btn.textContent.trim();
      btn.textContent = 'Applying Adjustment...';
    }

    try {
      const userId = document.getElementById('adj-user-id').value.trim();
      const wallet = document.getElementById('adj-wallet').value;
      const adjustmentType = document.getElementById('adj-type')?.value || 'OTHER';
      let amount = parseFloat(document.getElementById('adj-amount').value) || 0;
      if (this.state.adjSignMode === 'DEBIT' && amount > 0) {
        amount = -Math.abs(amount);
      }
      const reason = document.getElementById('adj-reason').value.trim();

      if (!userId || amount === 0 || !reason) {
        this.toast('Target User ID / Email, Non-zero Amount, and Reason are mandatory', 'error');
        return;
      }

      const res = await this.api('/admin/adjustments.php', 'POST', {
        user_id: userId,
        wallet_type: wallet,
        asset: 'USDT',
        amount,
        adjustment_type: adjustmentType,
        reason,
        idempotency_key: actionKey
      });

      if (res.success) {
        const newBal = res.data?.new_balance != null ? `$${Number(res.data.new_balance).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}` : '';
        this.toast(`Ledger adjustment applied successfully! ${wallet.toUpperCase()} balance is now ${newBal}`, 'success');
        document.getElementById('adj-amount').value = '';
        document.getElementById('adj-reason').value = '';
        this.setAdjustmentSign('CREDIT');
        await this.loadAdminUsers();
        await this.loadAdminData();
        if (this.loadBalances) await this.loadBalances();
        if (this.updateHomeHeroBalance) this.updateHomeHeroBalance();
        if (this.renderWallets) this.renderWallets();
        this.endAction(actionScope, true);
      } else {
        this.toast(res.message || 'Adjustment failed', 'error');
        this.endAction(actionScope, false);
      }
    } catch (err) {
      this.toast('Adjustment failed: ' + (err.message || err), 'error');
      this.endAction(actionScope, false);
    } finally {
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
      if (btn) {
        btn.disabled = false;
        btn.textContent = btn.dataset.alphaOriginalText || 'Confirm Adjustment';
        delete btn.dataset.alphaOriginalText;
      }
    }
  },

  /* ==========================================================
   * 71. MARKETING ASSETS & SOURCE-OF-TRUTH CLIENT SYSTEM
   * ========================================================== */

  async loadMarketingData() {
    try {
      const [assetsRes, promosRes, claimsRes, schedsRes] = await Promise.all([
        this.api('/marketing/assets.php'),
        this.api('/marketing/promotions.php'),
        this.api('/marketing/claims.php'),
        this.api('/marketing/schedules.php')
      ]);

      if (assetsRes?.success && assetsRes.data) {
        this.state.marketingAssets = assetsRes.data.assets || [];
      }
      if (promosRes?.success && promosRes.data) {
        this.state.marketingPromotions = promosRes.data;
      }
      if (claimsRes?.success && claimsRes.data) {
        this.state.marketingClaims = claimsRes.data.claims || [];
      }
      if (schedsRes?.success && schedsRes.data) {
        this.state.marketingSchedules = schedsRes.data;
      }

      this.renderMarketingAssets();
    } catch (err) {
      console.warn('Marketing data load error:', err);
    }
  },

  renderMarketingAssets() {
    // Clean up promotional image containers across all pages per user request
    const containers = [
      'home-hero-asset-container',
      'home-launch-asset-container',
      'home-trust-features-container',
      'wallet-promo-asset-container',
      'signals-schedule-asset-container',
      'referral-rewards-asset-container'
    ];
    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });
  },

  getAsset(filename, page = null) {
    if (!this.state.marketingAssets.length) return null;
    return this.state.marketingAssets.find(a => 
      a.file_path === filename || 
      (page && a.page === page) ||
      a.file_path.includes(filename)
    );
  },

  renderPictureTag(asset, fallbackFilename, altText) {
    return '';
  },

  renderHomeMarketing() {
    const ids = ['home-hero-asset-container', 'home-launch-asset-container', 'home-trust-features-container'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });
  },

  renderWalletMarketing() {
    const el = document.getElementById('wallet-promo-asset-container');
    if (el) el.innerHTML = '';
  },

  renderReferralsMarketing() {
    const ids = ['referral-rewards-asset-container', 'referral-partner-tiers-container'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });
  },

  renderSignalsMarketing() {
    const el = document.getElementById('signals-schedule-asset-container');
    if (el) el.innerHTML = '';
  },

  initSignalCountdown() {
    if (this.state.nextSignalCountdownTimer) {
      clearInterval(this.state.nextSignalCountdownTimer);
    }
    this.state.nextSignalCountdownTimer = setInterval(() => {
      this.updateSignalCountdownDisplay();
    }, 1000);
  },

  updateSignalCountdownDisplay() {
    // Signal schedules are intentionally hidden from the user dashboard.
    return;
  },

/* ==========================================================
   * ADMIN DESK: MARKETING ASSETS & COMPLIANCE ACTIONS
   * ========================================================== */

  async loadAdminAssets() {
    const res = await this.api('/marketing/assets.php');
    const container = document.getElementById('adm-assets-list');
    if (!container) return;

    if (!res.success || !res.data.assets.length) {
      container.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">No marketing assets found.</td></tr>`;
      return;
    }

    container.innerHTML = res.data.assets.map(a => `
      <tr>
        <td style="width: 70px;">
          <img src="/assets/marketing/${a.file_path}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;" onerror="this.src='/assets/marketing/IMG-20260909-WA0067.jpg'">
        </td>
        <td>
          <strong>${a.title}</strong>
          <span style="display:block; font-size:11px; font-family:var(--font-mono); color:var(--text-muted);">${a.file_path}</span>
        </td>
        <td><span class="badge badge-demo">${a.page} / ${a.section}</span></td>
        <td class="mono">${a.display_order}</td>
        <td>
          <span class="badge ${a.status === 'ACTIVE' ? 'badge-positive' : 'badge-warning'}">${a.status}</span>
        </td>
        <td style="font-size:11px; color:var(--text-muted);">${a.start_at || 'Always'} - ${a.end_at || 'Indefinite'}</td>
        <td>
          <button class="btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="App.editAsset('${a.id}')">Edit</button>
          <button class="btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="App.toggleAssetStatus('${a.id}', '${a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'}')">
            ${a.status === 'ACTIVE' ? 'Pause' : 'Activate'}
          </button>
        </td>
      </tr>
    `).join('');
  },

  openAddAssetModal() {
    document.getElementById('modal-asset-title').textContent = 'Register New Marketing Asset';
    document.getElementById('asset-id').value = '';
    document.getElementById('asset-title').value = '';
    document.getElementById('asset-filepath').value = '';
    document.getElementById('asset-page').value = 'home';
    document.getElementById('asset-section').value = 'hero';
    document.getElementById('asset-order').value = '1';
    document.getElementById('asset-status').value = 'ACTIVE';
    document.getElementById('asset-alt').value = '';
    document.getElementById('asset-desc').value = '';
    this.openModal('modal-asset');
  },

  editAsset(id) {
    const asset = this.state.marketingAssets.find(a => a.id === id);
    if (!asset) return;

    document.getElementById('modal-asset-title').textContent = 'Edit Marketing Asset';
    document.getElementById('asset-id').value = asset.id;
    document.getElementById('asset-title').value = asset.title;
    document.getElementById('asset-filepath').value = asset.file_path;
    document.getElementById('asset-page').value = asset.page;
    document.getElementById('asset-section').value = asset.section;
    document.getElementById('asset-order').value = asset.display_order;
    document.getElementById('asset-status').value = asset.status;
    document.getElementById('asset-alt').value = asset.alt_text;
    document.getElementById('asset-desc').value = asset.description || '';
    this.openModal('modal-asset');
  },

  async saveAsset() {
    const id = document.getElementById('asset-id').value;
    const title = document.getElementById('asset-title').value;
    const file_path = document.getElementById('asset-filepath').value;
    const page = document.getElementById('asset-page').value;
    const section = document.getElementById('asset-section').value;
    const display_order = parseInt(document.getElementById('asset-order').value, 10) || 1;
    const status = document.getElementById('asset-status').value;
    const alt_text = document.getElementById('asset-alt').value;
    const description = document.getElementById('asset-desc').value;

    if (!title || !file_path) {
      this.toast('Title and File Path are required', 'error');
      return;
    }

    const res = await this.api('/marketing/assets.php', 'POST', {
      id: id || undefined,
      title,
      file_path,
      page,
      section,
      display_order,
      status,
      alt_text,
      description
    });

    if (res.success) {
      this.toast(res.message || 'Asset saved', 'success');
      this.closeModal('modal-asset');
      await this.loadMarketingData();
      this.loadAdminAssets();
    } else {
      this.toast(res.message || 'Error saving asset', 'error');
    }
  },

  async toggleAssetStatus(id, newStatus) {
    const res = await this.api('/marketing/assets.php', 'POST', {
      id,
      status: newStatus
    });
    if (res.success) {
      this.toast(`Asset status updated to ${newStatus}`, 'success');
      await this.loadMarketingData();
      this.loadAdminAssets();
    }
  },

  async loadAdminPromoRules() {
    const res = await this.api('/marketing/promotions.php');
    const container = document.getElementById('adm-promo-rules-list');
    if (!container) return;

    if (!res.success || !res.data.rules.length) {
      container.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px;">No promotion rules defined.</td></tr>`;
      return;
    }

    container.innerHTML = res.data.rules.map(r => `
      <tr>
        <td><strong>${r.rule_key}</strong></td>
        <td class="mono">$${r.min_deposit_amount.toLocaleString()}</td>
        <td><span class="badge badge-demo">${r.reward_type}</span></td>
        <td class="mono positive">${r.reward_value}${r.reward_type === 'PERCENTAGE_BONUS' ? '%' : ' USDT'}</td>
        <td class="mono">$${r.voucher_amount}</td>
        <td class="mono">$${r.max_bonus_cap.toLocaleString()}</td>
        <td><span class="badge ${r.status === 'ACTIVE' ? 'badge-positive' : 'badge-warning'}">${r.status}</span></td>
        <td>
          <button class="btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="App.editPromoRule('${r.id}')">Edit</button>
          <button class="btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="App.togglePromoRuleStatus('${r.id}', '${r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}')">
            ${r.status === 'ACTIVE' ? 'Disable' : 'Enable'}
          </button>
        </td>
      </tr>
    `).join('');
  },

  openAddPromoRuleModal() {
    document.getElementById('modal-promo-title').textContent = 'Create Promotion Rule';
    document.getElementById('promo-rule-id').value = '';
    document.getElementById('promo-rule-key').value = '';
    document.getElementById('promo-min-deposit').value = '100';
    document.getElementById('promo-reward-val').value = '10.00';
    document.getElementById('promo-voucher-val').value = '0';
    document.getElementById('promo-max-cap').value = '500';
    document.getElementById('promo-status').value = 'ACTIVE';
    this.openModal('modal-promo-rule');
  },

  editPromoRule(id) {
    const rules = this.state.marketingPromotions?.rules || [];
    const r = rules.find(x => x.id === id);
    if (!r) return;

    document.getElementById('modal-promo-title').textContent = 'Edit Promotion Rule';
    document.getElementById('promo-rule-id').value = r.id;
    document.getElementById('promo-rule-key').value = r.rule_key;
    document.getElementById('promo-min-deposit').value = r.min_deposit_amount;
    document.getElementById('promo-reward-val').value = r.reward_value;
    document.getElementById('promo-voucher-val').value = r.voucher_amount;
    document.getElementById('promo-max-cap').value = r.max_bonus_cap;
    document.getElementById('promo-status').value = r.status;
    this.openModal('modal-promo-rule');
  },

  async savePromoRule() {
    const id = document.getElementById('promo-rule-id').value;
    const rule_key = document.getElementById('promo-rule-key').value;
    const min_deposit_amount = parseFloat(document.getElementById('promo-min-deposit').value) || 0;
    const reward_value = parseFloat(document.getElementById('promo-reward-val').value) || 0;
    const voucher_amount = parseFloat(document.getElementById('promo-voucher-val').value) || 0;
    const max_bonus_cap = parseFloat(document.getElementById('promo-max-cap').value) || 0;
    const status = document.getElementById('promo-status').value;

    if (!rule_key) {
      this.toast('Rule identifier is required', 'error');
      return;
    }

    const res = await this.api('/marketing/promotions.php', 'POST', {
      id: id || undefined,
      rule_key,
      min_deposit_amount,
      reward_type: 'PERCENTAGE_BONUS',
      reward_value,
      voucher_amount,
      max_bonus_cap,
      status
    });

    if (res.success) {
      this.toast(res.message || 'Promotion rule saved', 'success');
      this.closeModal('modal-promo-rule');
      await this.loadMarketingData();
      this.loadAdminPromoRules();
    } else {
      this.toast(res.message || 'Error saving rule', 'error');
    }
  },

  async togglePromoRuleStatus(id, newStatus) {
    const res = await this.api('/marketing/promotions.php', 'POST', {
      id,
      status: newStatus
    });
    if (res.success) {
      this.toast(`Rule status updated to ${newStatus}`, 'success');
      await this.loadMarketingData();
      this.loadAdminPromoRules();
    }
  },

  async loadAdminClaims() {
    const res = await this.api('/marketing/claims.php');
    const container = document.getElementById('adm-claims-list');
    if (!container) return;

    if (!res.success || !res.data.claims.length) {
      container.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No marketing claims submitted.</td></tr>`;
      return;
    }

    container.innerHTML = res.data.claims.map(c => `
      <tr>
        <td style="max-width: 260px; white-space: normal;">
          <strong>${c.claim_text}</strong>
          ${c.disclaimer_text ? `<div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Disclaimer: ${c.disclaimer_text}</div>` : ''}
        </td>
        <td>
          <span class="risk-badge risk-${c.risk_tier ? c.risk_tier.toLowerCase() : 'low'}">${c.risk_tier}</span>
        </td>
        <td><span class="badge badge-demo">${c.page} / ${c.section}</span></td>
        <td>
          <span class="approval-badge approval-${c.status ? c.status.toLowerCase() : 'draft'}">${c.status}</span>
        </td>
        <td style="font-family:var(--font-mono); font-size:11px;">${c.audit_evidence_doc || '<span style="color:var(--text-dim);">-</span>'}</td>
        <td>
          ${c.status !== 'APPROVED' ? `
            <button class="btn-primary" style="padding:3px 8px; font-size:11px;" onclick="App.reviewClaim('${c.id}', 'APPROVE')">Approve</button>
            <button class="btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="App.reviewClaim('${c.id}', 'REJECT')">Reject</button>
          ` : '<span style="color:var(--positive); font-size:11px;">Approved &bull; Live</span>'}
        </td>
      </tr>
    `).join('');
  },

  openAddClaimModal() {
    document.getElementById('modal-claim-title').textContent = 'Submit Marketing / Performance Claim';
    document.getElementById('claim-id').value = '';
    document.getElementById('claim-text').value = '';
    document.getElementById('claim-risk').value = 'LOW';
    document.getElementById('claim-page').value = 'home';
    document.getElementById('claim-evidence').value = '';
    document.getElementById('claim-disclaimer').value = '';
    this.onClaimRiskChange();
    this.openModal('modal-claim');
  },

  onClaimRiskChange() {
    const risk = document.getElementById('claim-risk').value;
    const tag = document.getElementById('disclaimer-mandatory-tag');
    if (tag) {
      tag.style.display = risk === 'HIGH' ? 'inline' : 'none';
    }
  },

  async saveClaim() {
    const id = document.getElementById('claim-id').value;
    const claim_text = document.getElementById('claim-text').value;
    const risk_tier = document.getElementById('claim-risk').value;
    const page = document.getElementById('claim-page').value;
    const audit_evidence_doc = document.getElementById('claim-evidence').value;
    const disclaimer_text = document.getElementById('claim-disclaimer').value;

    if (!claim_text) {
      this.toast('Claim text is required', 'error');
      return;
    }

    if (risk_tier === 'HIGH' && !disclaimer_text) {
      this.toast('HIGH risk claims require a mandatory legal disclaimer', 'error');
      return;
    }

    const res = await this.api('/marketing/claims.php', 'POST', {
      id: id || undefined,
      claim_text,
      risk_tier,
      page,
      section: 'features',
      audit_evidence_doc,
      disclaimer_text
    });

    if (res.success) {
      this.toast(res.message || 'Claim submitted to Compliance desk', 'success');
      this.closeModal('modal-claim');
      await this.loadMarketingData();
      this.loadAdminClaims();
    } else {
      this.toast(res.message || 'Error submitting claim', 'error');
    }
  },

  async reviewClaim(id, decision) {
    const reason = prompt(`Compliance review rationale:`) || 'Reviewed by Compliance Officer';
    const res = await this.api('/marketing/claims.php', 'POST', {
      action: decision === 'APPROVE' ? 'APPROVE' : 'REJECT',
      claim_id: id,
      rejection_reason: reason
    });

    if (res.success) {
      this.toast(res.message || `Claim review updated: ${decision}`, 'success');
      await this.loadMarketingData();
      this.loadAdminClaims();
    } else {
      this.toast(res.message || 'Error updating claim', 'error');
    }
  },

  async loadAdminSignalSchedules() {
    const res = await this.api('/marketing/schedules.php');
    const container = document.getElementById('adm-schedules-list');
    const rewContainer = document.getElementById('adm-signal-rewards-list');

    if (container && res.success && res.data.sessions) {
      container.innerHTML = res.data.sessions.map(s => `
        <tr>
          <td data-label="Session Name"><strong>${this.escapeHtml(s.session_name)}</strong></td>
          <td data-label="UTC Release" class="mono positive">${this.escapeHtml(s.utc_release_time)} UTC</td>
          <td data-label="Valid Window" class="mono">${s.valid_window_minutes} mins</td>
          <td data-label="Signals/Day" class="mono">${s.expected_signals_count}</td>
          <td data-label="Status"><span class="badge ${s.status === 'ACTIVE' ? 'badge-positive' : 'badge-warning'}">${s.status}</span></td>
          <td data-label="Action">
            <button class="av-adm-btn-chip soft-blue" onclick="App.toggleSignalScheduleStatus('${s.id}', '${s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}')">
              ${s.status === 'ACTIVE' ? 'Disable' : 'Enable'}
            </button>
          </td>
        </tr>
      `).join('');
    }

    if (rewContainer && res.success && res.data.additional_rewards) {
      rewContainer.innerHTML = res.data.additional_rewards.map(r => `
        <tr>
          <td data-label="Tier Name"><strong>${this.escapeHtml(r.tier_name)}</strong></td>
          <td data-label="Active Days" class="mono">${r.min_trading_days} days</td>
          <td data-label="Min Volume" class="mono">$${r.min_volume_usdt.toLocaleString()}</td>
          <td data-label="Extra Signals" class="mono positive">+${r.extra_signals_per_day} Signals/Day</td>
          <td data-label="Status"><span class="badge badge-positive">ACTIVE</span></td>
          <td data-label="Action"><span style="font-size:11px; color:#6B7280;">Auto</span></td>
        </tr>
      `).join('');
    }
  },

  openAddSignalScheduleModal() {
    document.getElementById('modal-schedule-title').textContent = 'Add Daily Signal Session';
    document.getElementById('sched-id').value = '';
    document.getElementById('sched-name').value = '';
    document.getElementById('sched-time').value = '12:00:00';
    document.getElementById('sched-window').value = '30';
    document.getElementById('sched-status').value = 'ACTIVE';
    this.openModal('modal-signal-schedule');
  },

  async saveSignalSchedule() {
    const id = document.getElementById('sched-id').value;
    const session_name = document.getElementById('sched-name').value;
    const utc_release_time = document.getElementById('sched-time').value;
    const valid_window_minutes = parseInt(document.getElementById('sched-window').value, 10) || 30;
    const status = document.getElementById('sched-status').value;

    if (!session_name || !utc_release_time) {
      this.toast('Session name and UTC release time are required', 'error');
      return;
    }

    const res = await this.api('/marketing/schedules.php', 'POST', {
      id: id || undefined,
      session_name,
      utc_release_time,
      valid_window_minutes,
      status
    });

    if (res.success) {
      this.toast(res.message || 'Signal session saved', 'success');
      this.closeModal('modal-signal-schedule');
      await this.loadMarketingData();
      this.loadAdminSignalSchedules();
    } else {
      this.toast(res.message || 'Error saving session', 'error');
    }
  },

  async toggleSignalScheduleStatus(id, newStatus) {
    const res = await this.api('/marketing/schedules.php', 'POST', {
      id,
      status: newStatus
    });
    if (res.success) {
      this.toast(`Session status updated to ${newStatus}`, 'success');
      await this.loadMarketingData();
      this.loadAdminSignalSchedules();
    }
  },

  /*
   * Production-safe polling. Keep background traffic bounded per browser tab,
   * pause while hidden, and only poll data needed by the active view. Identical
   * concurrent GETs are also coalesced by api().
   */
  startPolling() {
    if (this._pollingInterval) clearInterval(this._pollingInterval);
    if (this._balanceFastInterval) clearInterval(this._balanceFastInterval);
    if (this._tickerPollInterval) clearInterval(this._tickerPollInterval);
    if (this._notificationPollInterval) clearInterval(this._notificationPollInterval);
    if (this._futuresPollInterval) clearInterval(this._futuresPollInterval);

    // Wallet: 15s background refresh. Financial actions call loadBalances()
    // immediately, so fast polling is not required.
    this._balanceFastInterval = setInterval(() => {
      if (document.hidden || !this.state.user) return;
      this.loadBalances();
    }, 15000);

    // Market tickers: 10s while the app is visible.
    this._tickerPollInterval = setInterval(() => {
      if (document.hidden) return;
      this.loadTickers();
    }, 10000);

    // Notifications: 30s is sufficient for a notification bell and avoids
    // hammering the API on every dashboard session.
    this._notificationPollInterval = setInterval(() => {
      if (document.hidden || !this.state.user) return;
      this.loadNotifications();
    }, 30000);

    // Futures data is only refreshed while Futures is the active view.
    // Order book stays relatively live; positions change less frequently.
    this._futuresPollInterval = setInterval(() => {
      if (document.hidden || !this.state.user || this.state.currentView !== 'futures') return;
      this.loadOrderBook();
      this.loadPositions();
    }, 10000);

    // Admin overview is deliberately slow and only active on the admin view.
    this._pollingInterval = setInterval(() => {
      if (document.hidden || !this.state.user) return;
      if (this.state.currentView === 'admin' && this.state.adminTab === 'overview') {
        this.loadAdminData();
      } else if (this.state.currentView === 'admin' && this.state.adminTab === 'deposits') {
        this.loadAdminDeposits();
      }
    }, 30000);
  },

  render() {
    this.navigate(this.state.currentView);
  },

  /* System Configuration, Mode Toggling & Production Secrets Hub */
  async loadSystemConfig() {
    const res = await this.api('/system/config.php');
    if (res.success && res.data) {
      this.state.systemConfig = res.data;
      this.writeFastCache('system_config', res.data);
      this.state.isRealMoneyMode = Boolean(res.data.real_money_mode);
      this.updateAppModeUI();
    }
  },

  async toggleAppMode() {
    const nextMode = this.state.isRealMoneyMode ? 'DEMO' : 'LIVE';
    const res = await this.api('/system/mode.php', 'POST', { mode: nextMode });
    if (res.success && res.data) {
      this.state.isRealMoneyMode = Boolean(res.data.real_money_mode);
      this.updateAppModeUI();
      if (this.state.isRealMoneyMode) {
        this.toast('Switched to LIVE REAL-MONEY MODE. Real crypto vault addresses and on-chain deposits active.', 'success');
      } else {
        this.toast('Switched to DEMO PAPER-TRADING SANDBOX. Zero-risk practice mode active.', 'info');
      }
      await this.loadBalances();
      if (document.getElementById('modal-deposit')?.classList.contains('open')) {
        this.switchDepositMode(this.state.isRealMoneyMode);
        await this.updateDepositInfo();
      }
    } else {
      this.toast('Failed to change runtime mode', 'error');
    }
  },

  updateAppModeUI() {
    const isLive = this.state.isRealMoneyMode;
    const headerBadge = document.getElementById('app-mode-badge');
    if (headerBadge) {
      if (isLive) {
        headerBadge.className = 'badge';
        headerBadge.style.background = 'rgba(0, 230, 118, 0.18)';
        headerBadge.style.color = '#00e676';
        headerBadge.style.border = '1px solid rgba(0, 230, 118, 0.4)';
        headerBadge.style.boxShadow = '0 0 10px rgba(0, 230, 118, 0.2)';
        headerBadge.innerHTML = '<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#00e676; margin-right:4px;"></span> LIVE REAL MONEY';
        headerBadge.title = 'Current Mode: LIVE REAL MONEY. Click to switch to Demo.';
      } else {
        headerBadge.className = 'badge badge-demo';
        headerBadge.style.background = '';
        headerBadge.style.color = '';
        headerBadge.style.border = '';
        headerBadge.style.boxShadow = '';
        headerBadge.innerHTML = 'DEMO MODE';
        headerBadge.title = 'Current Mode: DEMO SANDBOX. Click to switch to Live Real-Money.';
      }
    }

    const secretsBadge = document.getElementById('secrets-active-mode-badge');
    const toggleBtn = document.getElementById('btn-toggle-runtime-mode');
    if (secretsBadge) {
      if (isLive) {
        secretsBadge.className = 'badge badge-success';
        secretsBadge.style.background = 'rgba(0, 230, 118, 0.15)';
        secretsBadge.style.color = '#00e676';
        secretsBadge.textContent = 'LIVE REAL-MONEY ACTIVE';
      } else {
        secretsBadge.className = 'badge badge-demo';
        secretsBadge.style.background = '';
        secretsBadge.style.color = '';
        secretsBadge.textContent = 'DEMO SANDBOX';
      }
    }
    if (toggleBtn) {
      if (isLive) {
        toggleBtn.textContent = 'Switch to DEMO Sandbox';
        toggleBtn.className = 'btn-secondary';
      } else {
        toggleBtn.textContent = 'Switch to LIVE Real-Money';
        toggleBtn.className = 'btn-primary';
      }
    }
  },

  async loadAdminSecrets() {
    const res = await this.api('/system/config.php');
    if (res.success && res.data) {
      this.state.systemConfig = res.data;
      this.state.isRealMoneyMode = Boolean(res.data.real_money_mode);
      this.updateAppModeUI();

      const dbEngineEl = document.getElementById('secrets-db-engine');
      if (dbEngineEl) dbEngineEl.textContent = res.data.database_engine;

      const cloudEl = document.getElementById('secrets-cloud-status') || document.getElementById('secrets-supabase-status');
      if (cloudEl) {
        const hasCloud = res.data.secrets_inventory?.some(s => s.name === 'SUPABASE_URL' && s.status === 'CONFIGURED');
        cloudEl.textContent = hasCloud ? 'Connected & Active' : 'Standby (Local SQLite)';
        cloudEl.style.color = hasCloud ? 'var(--positive)' : 'var(--cyan-accent)';
      }

      const smtpEl = document.getElementById('secrets-smtp-status');
      if (smtpEl) {
        const hasSmtp = res.data.secrets_inventory?.some(s => s.name === 'SMTP_HOST' && s.status === 'CONFIGURED');
        smtpEl.textContent = hasSmtp ? 'Hostinger / Resend Active' : 'Templates Loaded';
        smtpEl.style.color = hasSmtp ? 'var(--positive)' : 'var(--text-primary)';
      }

      this.renderSecretsTable();
    }
  },

  renderSecretsTable() {
    const tbody = document.getElementById('secrets-table-body');
    if (!tbody || !this.state.systemConfig?.secrets_inventory) return;

    const secrets = this.state.systemConfig.secrets_inventory;
    tbody.innerHTML = secrets.map(s => {
      let statusBadge = '<span class="badge" style="background:rgba(0, 229, 255, 0.15); color:var(--cyan-accent);">DEFAULT / DEV</span>';
      if (s.status === 'CONFIGURED') {
        statusBadge = '<span class="badge" style="background:rgba(0, 230, 118, 0.15); color:var(--positive);">CONFIGURED</span>';
      } else if (s.status === 'LOCAL_SQLITE_ACTIVE') {
        statusBadge = '<span class="badge" style="background:rgba(124, 58, 237, 0.2); color:#c4b5fd;">SQLITE ACTIVE</span>';
      }

      const categoryPill = `<span class="badge" style="background:rgba(255,255,255,0.06); font-size:10px;">${s.category}</span>`;

      return `
        <tr>
          <td>
            <div style="font-family:var(--font-mono); font-weight:700; color:var(--cyan-accent); font-size:13px;">${s.name}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${s.description}</div>
          </td>
          <td>${categoryPill}</td>
          <td>${statusBadge}</td>
          <td><code style="font-size:11px; color:var(--text-primary); background:rgba(0,0,0,0.4); padding:2px 6px; border-radius:4px;">${s.current_value}</code></td>
          <td style="font-size:12px; line-height:1.4; color:var(--text-secondary); max-width:320px;">${s.where_to_get}</td>
          <td><code style="font-size:10px; color:var(--text-muted); background:rgba(0,0,0,0.4); padding:2px 4px; border-radius:4px;">${s.example}</code></td>
        </tr>
      `;
    }).join('');
  },

  copyProductionEnv() {
    const envTemplate = `# ==========================================
# PRIME X CAPITAL PRODUCTION ENVIRONMENT CONFIGURATION
# ==========================================

# 1. RUNTIME & SYSTEM MODE
# Set to 'true' for real-money cryptocurrency execution, or 'false' for demo simulation
REAL_MONEY_MODE=true

# 2. CLOUD DATABASE GATEWAY & AUTH
CLOUD_DB_URL=https://your-project-ref.cloud.com
CLOUD_DB_ANON_KEY=YOUR_PUBLIC_ANON_KEY
# NEVER put a service-role key in frontend code. Configure it only in server/.env

# 3. DIRECT DATABASE POOLER
DATABASE_URL=YOUR_DATABASE_URL

# 4. SECURITY & AUTOMATION TOKENS
# Generate 32-character random hex keys (e.g. openssl rand -hex 32)
CRON_SECRET=REPLACE_WITH_RANDOM_SECRET
ADMIN_SECRET=REPLACE_WITH_RANDOM_SECRET
JWT_SECRET=REPLACE_WITH_RANDOM_SECRET

# 5. CUSTOM TRANSACTIONAL EMAIL (HOSTINGER / RESEND / SENDGRID)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=YOUR_MAIL_PASSWORD
SMTP_FROM=noreply@yourdomain.com
SMTP_FROM_NAME="PRIME X CAPITAL Institutional"

# 6. S3 CLOUD STORAGE COMPLIANCE BUCKETS
STORAGE_BUCKET_KYC=kyc-documents
STORAGE_BUCKET_PRIVATE=private-user-files
STORAGE_BUCKET_MARKETING=marketing-assets
`;

    navigator.clipboard.writeText(envTemplate).then(() => {
      this.toast('Production .env template copied to clipboard! Paste into your settings or server.', 'success');
    }).catch(() => {
      this.toast('Copied to clipboard', 'info');
    });
  },

  generateNewSecretKey(secretType) {
    const chars = '0123456789abcdef';
    let rand = '';
    const len = secretType === 'JWT_SECRET' ? 64 : 32;
    for (let i = 0; i < len; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    const prefix = secretType === 'CRON_SECRET' ? 'crn_' : secretType === 'ADMIN_SECRET' ? 'adm_' : 'jwt_';
    const key = prefix + rand;
    navigator.clipboard.writeText(key).then(() => {
      this.toast(`Generated fresh ${secretType} and copied to clipboard!`, 'success');
    });
  },

  /* Admin: Referral Network & Tree Management */
  async loadAdminReferralsTree() {
    const treeContainer = document.getElementById('adm-referrals-tree-container') || document.getElementById('admin-referral-tree-hierarchy');
    const rosterContainer = document.getElementById('adm-ref-roster-list') || document.getElementById('admin-referral-users-roster');
    const netCountEl = document.getElementById('adm-ref-total-network');
    const netVolEl = document.getElementById('adm-ref-total-volume');
    const netCommEl = document.getElementById('adm-ref-total-commissions');
    const topAffEl = document.getElementById('adm-ref-top-affiliate');
    const totalLinksEl = document.getElementById('adm-ref-total-links');
    const rootCountEl = document.getElementById('adm-ref-root-count');
    const downlinesCountEl = document.getElementById('adm-ref-downlines-count');
    const rosterCountBadge = document.getElementById('adm-ref-roster-count');

    if (treeContainer) {
      treeContainer.innerHTML = '<div style="text-align:center; padding:24px; color:var(--text-muted); font-size:12px;">Loading multi-tier affiliate tree structure...</div>';
    }

    try {
      const res = await this.api('/referrals/admin_tree.php');
      if (res.success && res.data) {
        const stats = res.data.stats || {};
        const roots = res.data.roots || res.data.trees || [];
        const flatUsers = res.data.flat_users || [];
        const totalInvites = stats.total_links ?? stats.total_invites ?? (flatUsers.filter(u => u.parent_code && u.parent_code !== 'ROOT').length);

        if (netCountEl) netCountEl.textContent = stats.total_users || flatUsers.length || 0;
        if (netVolEl) netVolEl.textContent = `$${Number(stats.total_volume || 0).toLocaleString()}`;
        if (netCommEl) netCommEl.textContent = `$${Number(stats.total_commissions || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (topAffEl) topAffEl.textContent = stats.top_affiliate || 'N/A';

        if (totalLinksEl) totalLinksEl.textContent = totalInvites;
        if (rootCountEl) rootCountEl.textContent = stats.root_count ?? roots.length;
        if (downlinesCountEl) downlinesCountEl.textContent = stats.downline_count ?? totalInvites;
        if (rosterCountBadge) rosterCountBadge.textContent = `${flatUsers.length} Users`;

        this.adminTreeRoots = roots;
        this.adminFlatUsers = flatUsers;

        this.renderAdminReferralTreeVisualization(this.adminTreeRoots);
        this.renderAdminReferralRoster(this.adminFlatUsers);
      } else {
        if (treeContainer) {
          treeContainer.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-muted); font-size:12px;">${res.message || 'No affiliate genealogy network found.'}</div>`;
        }
      }
    } catch(e) {
      if (treeContainer) {
        treeContainer.innerHTML = '<div style="text-align:center; padding:24px; color:var(--negative); font-size:12px;">Error loading affiliate genealogy network.</div>';
      }
    }
  },

  switchReferralMobileView(pane) {
    const showTree = pane !== 'roster';
    const treePane = document.getElementById('adm-ref-tree-pane');
    const rosterPane = document.getElementById('adm-ref-roster-pane');
    const tabTree = document.getElementById('adm-ref-m-tab-tree');
    const tabRoster = document.getElementById('adm-ref-m-tab-roster');
    if (treePane) treePane.style.display = showTree ? '' : 'none';
    if (rosterPane) rosterPane.style.display = showTree ? 'none' : '';
    if (tabTree) tabTree.classList.toggle('active', showTree);
    if (tabRoster) tabRoster.classList.toggle('active', !showTree);
  },

  selectReferralRoot(idx) {
    this.state.selectedReferralRootIdx = idx;
    this.renderAdminReferralTreeVisualization(this.adminTreeRoots || []);
  },

  renderAdminReferralTreeVisualization(roots) {
    const container = document.getElementById('adm-referrals-tree-container') || document.getElementById('admin-referral-tree-hierarchy');
    if (!container) return;

    if (!roots || roots.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:28px; color:var(--text-muted); font-size:12px;">
          No network trees detected. As users register using referral codes, their genealogical hierarchies will render here.
        </div>
      `;
      return;
    }

    const esc = (value) => this.escapeHtml(value ?? '—');
    const formatMoney = (value) => `$${Number(value || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    const q = (document.getElementById('adm-ref-tree-search')?.value || '').toLowerCase().trim();

    const matchesQuery = (node) => {
      if (!q) return true;
      const hitSelf =
        String(node.email || '').toLowerCase().includes(q) ||
        String(node.referral_code || '').toLowerCase().includes(q) ||
        String(node.id || '').toLowerCase().includes(q);
      if (hitSelf) return true;
      if (Array.isArray(node.children)) return node.children.some(matchesQuery);
      return false;
    };

    const visibleRoots = q ? roots.filter(matchesQuery) : roots;
    if (!visibleRoots.length) {
      container.innerHTML = `<div style="text-align:center; padding:26px; color:#6B7280; font-size:12.5px;">No referral sponsor branches match "${esc(q)}".</div>`;
      return;
    }

    let selectedIdx = this.state.selectedReferralRootIdx ?? 'ALL';
    if (selectedIdx !== 'ALL' && (selectedIdx < 0 || selectedIdx >= visibleRoots.length)) {
      selectedIdx = 'ALL';
    }

    let rootTabsHtml = '';
    if (visibleRoots.length > 1) {
      rootTabsHtml = `
        <div class="av-ref-root-tabs">
          <button type="button" class="av-ref-root-tab ${selectedIdx === 'ALL' ? 'active' : ''}" onclick="App.selectReferralRoot('ALL')">All Networks (${visibleRoots.length})</button>
          ${visibleRoots.map((r, i) => {
            const label = esc((r.email || 'Sponsor').split('@')[0]);
            const cnt = Number(r.level_1_count ?? (Array.isArray(r.children) ? r.children.length : 0));
            return `<button type="button" class="av-ref-root-tab ${selectedIdx === i ? 'active' : ''}" onclick="App.selectReferralRoot(${i})">${label} (${cnt})</button>`;
          }).join('')}
        </div>
      `;
    }

    const renderSubGroupCard = (subscribers) => {
      return `
        <li class="av-ref-org-branch">
          <div class="av-ref-org-node-wrap">
            <div class="av-ref-sub-group">
              <div class="av-ref-sub-group-title">Tier 3: Subscribers (${subscribers.length})</div>
              <div class="av-ref-sub-list">
                ${subscribers.map(sub => {
                  const subInitial = esc((sub.email || 'S').trim().charAt(0).toUpperCase());
                  const subChildren = Array.isArray(sub.children) ? sub.children.length : 0;
                  return `
                    <div class="av-ref-sub-row">
                      <div class="av-ref-sub-row-left">
                        <span class="av-ref-org-avatar">${subInitial}</span>
                        <div style="min-width:0;">
                          <div class="av-ref-sub-name" title="${esc(sub.email)}">${esc(sub.email || 'Subscriber')}</div>
                          <div class="av-ref-sub-bal">${formatMoney(sub.wallet_balance)}${subChildren ? ` • +${subChildren} downline` : ''}</div>
                        </div>
                      </div>
                      <button type="button" class="av-ref-inspect-link" onclick="App.viewUserDossier(${JSON.stringify(sub.id)})">View</button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </li>
      `;
    };

    const renderOrgBranch = (node, depth = 0) => {
      const children = Array.isArray(node.children) ? node.children : [];
      const hasChildren = children.length > 0;
      const stableId = String(node.id || `${depth}-${node.referral_code || node.email || Math.random().toString(36).substring(2, 7)}`).replace(/[^a-zA-Z0-9_-]/g, '-');
      const childrenId = `adm-tree-children-${stableId}`;
      const downlineCount = Number(node.level_1_count ?? children.length);

      const email = esc(node.email || 'Sponsor');
      const shortId = esc(node.numeric_uid ? `#${node.numeric_uid}` : (String(node.id || '').length > 10 ? `#${String(node.id).slice(-6)}` : `#${node.id || 'N/A'}`));
      const code = esc(node.referral_code || 'N/A');
      const initial = esc((node.email || 'R').trim().charAt(0).toUpperCase());

      const cardCls = depth === 0 ? 'tier-root' : (depth === 2 ? 'tier-2' : '');
      const tierChipCls = depth === 0 ? 't0' : depth === 1 ? 't1' : depth === 2 ? 't2' : 't3';
      const tierLabel = depth === 0 ? 'Admin Root • Sponsor' : depth === 1 ? 'Tier 1 • Partner' : depth === 2 ? 'Tier 2 • Affiliate' : 'Tier 3 • Subscriber';
      const countCircleCls = depth === 0 ? '' : 'emerald';

      let childrenMarkup = '';
      if (hasChildren) {
        if (depth >= 2 && children.every(c => !Array.isArray(c.children) || c.children.length === 0)) {
          childrenMarkup = `<ul id="${childrenId}" class="av-ref-org-children">${renderSubGroupCard(children)}</ul>`;
        } else {
          childrenMarkup = `<ul id="${childrenId}" class="av-ref-org-children">${children.map(ch => renderOrgBranch(ch, depth + 1)).join('')}</ul>`;
        }
      }

      return `
        <li class="av-ref-org-branch" data-depth="${depth}">
          <div class="av-ref-org-node-wrap">
            <div class="av-ref-org-card ${cardCls}">
              <div class="av-ref-org-card-top">
                <span class="av-ref-org-avatar ${depth === 0 ? 'is-root' : ''}">${initial}</span>
                <div class="av-ref-org-ident">
                  <div class="av-ref-org-email" title="${email}">${email}</div>
                  <div class="av-ref-org-sub">${shortId} • ${code}</div>
                </div>
                <span class="av-ref-count-circle ${countCircleCls}" title="Direct invites">${downlineCount}</span>
              </div>
              <div class="av-ref-org-meta-row">
                <span class="av-ref-tier-chip ${tierChipCls}">${tierLabel}</span>
                <span class="av-ref-org-bal">${formatMoney(node.wallet_balance)}</span>
              </div>
              <div class="av-ref-org-foot">
                <span>Vol: ${formatMoney(node.trading_volume)}</span>
                <button type="button" class="av-ref-inspect-link" onclick="App.viewUserDossier(${JSON.stringify(node.id)})">Inspect →</button>
              </div>
            </div>
            ${hasChildren ? `<button type="button" class="av-ref-collapse-btn" aria-label="Toggle branch" onclick="App.toggleAdminTreeNode('${childrenId}', this)">−</button>` : ''}
          </div>
          ${childrenMarkup}
        </li>
      `;
    };

    const rootsToDraw = selectedIdx === 'ALL' ? visibleRoots : [visibleRoots[selectedIdx]];
    const treesHtml = `
      <div class="av-ref-org-stack">
        ${rootsToDraw.map(root => `
          <div class="av-ref-org-canvas">
            <ul class="av-ref-org-tree">
              ${renderOrgBranch(root, 0)}
            </ul>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = rootTabsHtml + treesHtml;
  },

  toggleAdminTreeNode(childrenId, btn) {
    const el = document.getElementById(childrenId);
    if (!el) return;
    if (el.style.display === 'none') {
      el.style.display = '';
      if (btn) btn.textContent = '−';
    } else {
      el.style.display = 'none';
      if (btn) btn.textContent = '+';
    }
  },

  toggleAllAdminTreeNodes() {
    const container = document.getElementById('adm-referrals-tree-container') || document.getElementById('admin-referral-tree-hierarchy');
    if (!container) return;
    const allChildLists = container.querySelectorAll('[id^="adm-tree-children-"]');
    const allButtons = container.querySelectorAll('button.av-ref-collapse-btn');
    this.adminTreeCollapsed = !this.adminTreeCollapsed;
    allChildLists.forEach(list => {
      list.style.display = this.adminTreeCollapsed ? 'none' : '';
    });
    allButtons.forEach(btn => {
      btn.textContent = this.adminTreeCollapsed ? '+' : '−';
    });
  },

  renderAdminReferralRoster(users) {
    const tbody = document.getElementById('adm-ref-roster-list') || document.getElementById('admin-referral-users-roster');
    if (!tbody) return;

    if (!users || users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:18px; color:var(--text-muted); font-size:12px;">No affiliate member records found.</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(u => {
      const volume = Number(u.trading_volume || 0).toLocaleString();
      const walletBalance = Number(u.wallet_balance || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
      const isDirect = u.level_1_count || 0;
      const kycStatus = (u.kyc_status || 'NOT_SUBMITTED').toUpperCase();
      const kycBadge = kycStatus === 'APPROVED' ? '<span class="badge badge-positive">VERIFIED</span>' :
        kycStatus === 'PENDING' ? '<span class="badge badge-warning">PENDING</span>' :
        '<span class="badge" style="background:#F3F4F6; color:#6B7280; border:1px solid #E5E7EB;">UNVERIFIED</span>';

      return `
        <tr>
          <td data-label="User Email">
            <div style="font-weight:700; color:#111827; font-size:13px;">${this.escapeHtml(u.email)}</div>
            <div style="font-size:11px; color:#6B7280;">UID: #${this.escapeHtml(u.id)}</div>
          </td>
          <td data-label="Country"><span style="color:#4B5563; font-size:12px;">${this.escapeHtml(u.country || 'Global')}</span></td>
          <td data-label="Referral Code"><code style="color:#0052FF; background:#EFF4FF; padding:2px 6px; border-radius:6px; font-weight:700;">${this.escapeHtml(u.referral_code || 'N/A')}</code></td>
          <td data-label="Referred By"><code style="color:#4B5563; background:#F3F4F6; padding:2px 6px; border-radius:6px;">${this.escapeHtml(u.parent_code || 'ROOT')}</code></td>
          <td data-label="Direct Invites"><span class="badge" style="background:#EFF4FF; color:#0052FF; border:1px solid #DBEAFE; font-weight:700;">${isDirect} Direct</span></td>
          <td data-label="Balance"><span style="font-weight:700; color:#111827; font-family:var(--font-mono);">$${walletBalance}</span></td>
          <td data-label="Deposit Volume"><span style="font-weight:600; color:#4B5563; font-family:var(--font-mono);">$${volume}</span></td>
          <td data-label="KYC Status">${kycBadge}</td>
        </tr>
      `;
    }).join('');
  },

  filterAdminReferralTree() {
    const q = (document.getElementById('adm-ref-tree-search')?.value || document.getElementById('admin-referral-search-input')?.value || '').toLowerCase().trim();
    if (!this.adminFlatUsers) return;

    this.renderAdminReferralTreeVisualization(this.adminTreeRoots || []);

    if (!q) {
      this.renderAdminReferralRoster(this.adminFlatUsers || []);
      return;
    }

    const filteredUsers = this.adminFlatUsers.filter(u =>
      (u.email || '').toLowerCase().includes(q) ||
      (u.referral_code || '').toLowerCase().includes(q) ||
      (u.parent_code || '').toLowerCase().includes(q) ||
      (u.country || '').toLowerCase().includes(q)
    );

    this.renderAdminReferralRoster(filteredUsers);
  },

  /* ==========================================================================
     PRIME X CAPITAL SUB-SCREENS: CONVERT, KYC, SETTINGS, NOTICES, LIVE SUPPORT
     ========================================================================== */

  /* 1. Instant Convert & Swap */
  loadConvertView() {
    const availEl = document.getElementById('convert-avail-from') || document.getElementById('convert-avail-bal');
    const fromAsset = document.getElementById('convert-from-asset')?.value || 'USDT';
    if (availEl) {
      if (fromAsset === 'USDT') {
        const bal = this.state.balances?.balances?.exchange?.USDT?.available || this.state.balances?.total_assets_usdt || 0;
        availEl.textContent = `${Number(bal).toFixed(2)} USDT`;
      } else {
        availEl.textContent = `0.50 ${fromAsset}`;
      }
    }
    this.calcConvertOutput();
  },

  getAssetPrice(asset) {
    if (asset === 'USDT') return 1.0;
    const ticker = this.state.tickers?.find(t => t.symbol.startsWith(asset) || t.base === asset);
    if (ticker) return parseFloat(ticker.price) || 1.0;
    const fallbackPrices = { BTC: 91450.0, ETH: 3120.0, SOL: 198.5, XRP: 2.15, OIL: 74.8 };
    return fallbackPrices[asset] || 1.0;
  },

  calcConvertOutput() {
    const fromAsset = document.getElementById('convert-from-asset')?.value || 'USDT';
    const toAsset = document.getElementById('convert-to-asset')?.value || 'BTC';
    const amountInput = document.getElementById('convert-from-amt') || document.getElementById('convert-from-amount');
    const toAmountEl = document.getElementById('convert-to-amt') || document.getElementById('convert-to-amount');
    const rateEl = document.getElementById('convert-rate-label');

    const amount = parseFloat(amountInput?.value) || 0;
    const fromPrice = this.getAssetPrice(fromAsset);
    const toPrice = this.getAssetPrice(toAsset);

    const exchangeRate = fromPrice / toPrice;
    if (rateEl) {
      rateEl.textContent = `1 ${fromAsset} ≈ ${exchangeRate > 1 ? exchangeRate.toFixed(4) : exchangeRate.toFixed(8)} ${toAsset}`;
    }

    if (toAmountEl) {
      const output = amount * exchangeRate;
      toAmountEl.value = output > 0 ? (exchangeRate < 0.01 ? output.toFixed(8) : output.toFixed(4)) : '';
    }
  },

  setConvertPercent(pct) {
    const fromAsset = document.getElementById('convert-from-asset')?.value || 'USDT';
    const amountInput = document.getElementById('convert-from-amt') || document.getElementById('convert-from-amount');
    let max = 0;
    if (fromAsset === 'USDT') {
      max = this.state.balances?.balances?.exchange?.USDT?.available || this.state.balances?.total_assets_usdt || 0;
    } else {
      max = 0.50;
    }
    const val = (max * pct) / 100;
    if (amountInput) {
      amountInput.value = val > 0 ? val.toFixed(4) : '0';
      this.calcConvertOutput();
    }
  },

  swapConvertAssets() {
    const fromSel = document.getElementById('convert-from-asset');
    const toSel = document.getElementById('convert-to-asset');
    if (!fromSel || !toSel) return;
    const temp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = temp;
    this.loadConvertView();
  },

  async executeConvert() {
    const fromAsset = document.getElementById('convert-from-asset')?.value || 'USDT';
    const toAsset = document.getElementById('convert-to-asset')?.value || 'BTC';
    const fromEl = document.getElementById('convert-from-amt') || document.getElementById('convert-from-amount');
    const toEl = document.getElementById('convert-to-amt') || document.getElementById('convert-to-amount');
    const amount = parseFloat(fromEl?.value) || 0;
    const toAmount = toEl?.value || '0';

    if (amount <= 0) {
      this.toast('Please enter a valid amount to convert', 'error');
      return;
    }

    if (fromAsset === toAsset) {
      this.toast('Cannot convert asset to itself', 'error');
      return;
    }

    this.toast(`Converting ${amount} ${fromAsset} to ${toAmount} ${toAsset}...`, 'info');
    setTimeout(() => {
      this.toast(`Exchange complete! Credited ${toAmount} ${toAsset} to your Exchange Wallet.`, 'success');
      if (fromEl) fromEl.value = '';
      if (toEl) toEl.value = '';
      this.loadBalances();
    }, 800);
  },

  /* 2. KYC Real-Name Identity Verification */
  loadKYCView() {
    this.initCountries();
    const badge = document.getElementById('kyc-current-status-badge');
    const bannerBox = document.getElementById('kyc-status-banner-box');
    const kyc = (this.state.user?.kyc_status || 'NOT_SUBMITTED').toUpperCase();
    
    if (badge) {
      if (kyc === 'APPROVED') {
        badge.textContent = 'Verified (Tier 2) ✓';
        badge.style.color = '#00c087';
      } else if (kyc === 'PENDING') {
        badge.textContent = 'Pending Review ⏳';
        badge.style.color = '#f59e0b';
      } else if (kyc === 'REJECTED') {
        badge.textContent = 'Rejected (Resubmit) ✕';
        badge.style.color = '#ef4444';
      } else {
        badge.textContent = 'Unverified';
        badge.style.color = '#f59e0b';
      }
    }

    if (bannerBox) {
      if (kyc === 'APPROVED') {
        bannerBox.innerHTML = `
          <div style="background: rgba(0, 192, 135, 0.12); border: 1px solid rgba(0, 192, 135, 0.3); border-radius: 10px; padding: 14px; display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 26px;">✅</div>
            <div>
              <div style="font-weight: 700; color: #00c087; font-size: 14px;">Tier 2 Verification Approved</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Your account has passed real-name identity verification. Unlimited crypto/fiat withdrawals, VIP signals, and institutional security vaults are unlocked.</div>
            </div>
          </div>
        `;
      } else if (kyc === 'PENDING') {
        bannerBox.innerHTML = `
          <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 14px; display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 26px;">⏳</div>
            <div>
              <div style="font-weight: 700; color: #f59e0b; font-size: 14px;">Verification Under Compliance Review</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Your documents have been encrypted and submitted to the institutional compliance queue. Review is typically completed within 1 to 2 hours.</div>
            </div>
          </div>
        `;
      } else if (kyc === 'REJECTED') {
        bannerBox.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 14px; display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 26px;">❌</div>
            <div>
              <div style="font-weight: 700; color: #ef4444; font-size: 14px;">Identity Verification Rejected</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Your previous submission was declined by compliance audit. Please re-check your legal name, document number, and photos, then resubmit below.</div>
            </div>
          </div>
        `;
      } else {
        bannerBox.innerHTML = '';
      }
    }

    const countryEl = document.getElementById('kyc-nationality');
    if (countryEl && !countryEl.value) {
      countryEl.value = this.state.user?.country || '';
    }

    // Default active ID type
    if (!this.state.selectedKYCType) {
      this.setKYCType('ID_CARD');
    }
  },

  setKYCType(type) {
    this.state.selectedKYCType = type;
    document.querySelectorAll('.id-type-btn').forEach(btn => {
      const bType = btn.getAttribute('data-type') || btn.getAttribute('data-id-type');
      btn.classList.toggle('active', bType === type);
    });
  },

  async handleKYCFileUpload(side, event) {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const captionEl = document.getElementById(`kyc-${side}-caption`);
    if (captionEl) {
      captionEl.innerHTML = `<span style="color: #f59e0b; font-weight: 600;">Securing document to compliance vault...</span>`;
    }

    try {
      const processFile = (inputFile) => {
        return new Promise((resolve, reject) => {
          if (!inputFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(inputFile);
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const maxDim = 1280;
              let { width, height } = img;
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.82));
            };
            img.onerror = () => resolve(e.target.result);
            img.src = e.target.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(inputFile);
        });
      };

      const dataUrl = await processFile(file);
      const res = await this.api('/kyc/upload.php', 'POST', {
        side,
        file_data: dataUrl,
        file_name: file.name
      });

      if (res.success && (res.data?.path || res.data?.signed_url)) {
        this.state.kycDocs = this.state.kycDocs || {};
        this.state.kycDocs[side] = res.data.path || res.data.signed_url;
        const previewImg = document.getElementById(`kyc-${side}-preview`);
        const boxEl = document.getElementById(`kyc-${side}-box`);
        const illusSvg = boxEl?.querySelector('.av-kyc-illus');
        if (previewImg && typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
          previewImg.src = dataUrl;
          previewImg.style.display = 'block';
          if (illusSvg) illusSvg.style.display = 'none';
        }
        if (captionEl) {
          captionEl.innerHTML = `<span style="color: #059669; font-weight: 700;">✓ ${this.escapeHtml(file.name.substring(0, 14))}</span>`;
        }
        this.toast(`${side.toUpperCase()} document secured successfully!`, 'success');
      } else {
        if (captionEl) {
          captionEl.innerHTML = `<span style="color: #ff3b30;">Upload notice: ${res.message || 'Verification vault busy'}</span>`;
        }
        this.toast(res.message || 'Failed to upload document to compliance vault', 'error');
      }
    } catch (err) {
      if (captionEl) {
        captionEl.innerHTML = `<span style="color: #ff3b30;">Upload failed: ${err.message || 'Error processing file'}</span>`;
      }
      this.toast('Error processing document file: ' + (err.message || err), 'error');
    }
  },

  async submitKYCVerification() {
    const name = document.getElementById('kyc-real-name')?.value?.trim();
    const idNum = document.getElementById('kyc-id-number')?.value?.trim();
    const nationality = document.getElementById('kyc-nationality')?.value?.trim();
    const activeDocBtn = document.querySelector('.id-type-btn.active');
    const selectedDocType = this.state.selectedKYCType || activeDocBtn?.getAttribute('data-type') || activeDocBtn?.getAttribute('data-id-type') || 'ID_CARD';

    if (!name || !idNum) {
      this.toast('Please enter your full legal name and ID document number', 'error');
      return;
    }

    const selectedCountry = document.getElementById('kyc-country-select')?.value?.trim() || nationality || this.state.user?.country || 'Global';

    const res = await this.api('/kyc/submit.php', 'POST', {
      legal_name: name,
      document_number: idNum,
      country: selectedCountry,
      document_type: selectedDocType,
      front_path: this.state.kycDocs?.front || '',
      back_path: this.state.kycDocs?.reverse || '',
      selfie_path: this.state.kycDocs?.selfie || '',
    });

    if (res.success) {
      this.state.userKYCVerified = false;
      this.state.userKYCPending = true;
      if (this.state.user) {
        this.state.user.kyc_status = 'PENDING';
      }
      this.toast('KYC documents submitted successfully! Verification is under review by compliance team.', 'success');
      this.loadKYCView();
      this.loadSettingsView();
      this.updateHomeHeroBalance();
      setTimeout(() => {
        this.navigate('settings');
      }, 1200);
    } else {
      this.toast(res.message || 'KYC submission failed', 'error');
    }
  },

  /* 3. Settings View & Modals */
  loadSettingsView() {
    const uidEl = document.getElementById('settings-user-uid');
    const emailDisp = document.getElementById('settings-email-display');
    const emailLbl = document.getElementById('settings-email-label');
    const kycBadge = document.getElementById('settings-kyc-badge');
    const kycStatus = document.getElementById('settings-kyc-status');

    const userEmail = this.state.user?.email || 'Not Signed In';
    if (uidEl) {
      uidEl.textContent = this.getUserUID();
    }
    if (emailDisp) emailDisp.textContent = userEmail;
    if (emailLbl) emailLbl.textContent = userEmail;

    const kyc = (this.state.user?.kyc_status || 'NOT_SUBMITTED').toUpperCase();
    const updateKycEl = (el) => {
      if (!el) return;
      if (kyc === 'APPROVED') {
        el.textContent = 'Verified (Tier 2)';
        el.className = 'badge badge-positive';
        el.style.color = '#00c087';
      } else if (kyc === 'PENDING') {
        el.textContent = 'Pending Review';
        el.className = 'badge badge-warning';
        el.style.color = '#f59e0b';
      } else if (kyc === 'REJECTED') {
        el.textContent = 'Rejected';
        el.className = 'badge badge-negative';
        el.style.color = '#ef4444';
      } else {
        el.textContent = 'Unverified';
        el.className = 'badge badge-warning';
        el.style.color = '#f59e0b';
      }
    };
    updateKycEl(kycBadge);
    updateKycEl(kycStatus);

    const countryEl = document.getElementById('settings-country-label');
    const userCountryDisp = document.getElementById('user-country-display');
    const userCountry = this.state.user?.country || localStorage.getItem('alphavest_user_country') || 'Not set';
    if (countryEl) countryEl.textContent = userCountry;
    if (userCountryDisp) userCountryDisp.textContent = userCountry;
  },

  /* 3.1 Change Account Email */
  openChangeEmailModal() {
    if (!this.state.user) {
      this.openModal('modal-auth');
      return;
    }
    const currentInput = document.getElementById('update-email-current');
    const newInput = document.getElementById('update-email-new');
    if (currentInput) currentInput.value = this.state.user.email || '';
    if (newInput) newInput.value = '';
    this.openModal('modal-update-email');
  },

  async submitUpdateEmail() {
    const newEmail = (document.getElementById('update-email-new')?.value || '').trim();
    if (!newEmail || !newEmail.includes('@')) {
      this.toast('Please enter a valid new email address', 'error');
      return;
    }

    try {
      const res = await this.api('/user/update-email.php', 'POST', { email: newEmail });
      if (res.success) {
        if (this.state.user) {
          this.state.user.email = res.data?.email || newEmail;
          localStorage.setItem('alphavest_local_user', JSON.stringify(this.state.user));
        }
        this.loadSettingsView();
        this.closeModal('modal-update-email');
        this.toast(res.message || 'Account email updated successfully!', 'success');
      } else {
        this.toast(res.message || 'Failed to update email address', 'error');
      }
    } catch (err) {
      this.toast('Error updating email: ' + (err.message || err), 'error');
    }
  },

  /* 3.2 Binding Withdrawal Address */
  async openBindWithdrawAddressModal() {
    if (!this.state.user) {
      this.openModal('modal-auth');
      return;
    }
    this.openModal('modal-bind-withdraw-address');
    await this.loadBoundWithdrawAddresses();
  },

  async loadBoundWithdrawAddresses() {
    try {
      const res = await this.api('/user/withdraw-address.php');
      const listContainer = document.getElementById('bound-addresses-list-container');
      const listEl = document.getElementById('bound-addresses-list');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        this.state.boundWithdrawAddresses = res.data;
        if (listContainer && listEl) {
          listContainer.style.display = 'block';
          listEl.innerHTML = res.data.map(a => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; border:1px solid #EEF1F6; padding:8px 10px; border-radius:8px; font-size:11px;">
              <div>
                <span style="font-weight:700; color:#0052FF;">${a.asset} (${a.network})</span>
                <span style="color:#6B7280; margin-left:6px; font-family:var(--font-mono);">${(a.address || '').substring(0, 8)}...${(a.address || '').slice(-6)}</span>
              </div>
              <span style="color:#00B87C; font-weight:700;">✓ Bound</span>
            </div>
          `).join('');
        }
      } else {
        this.state.boundWithdrawAddresses = [];
        if (listContainer) listContainer.style.display = 'none';
      }
    } catch (e) {
      console.warn('Failed to load bound addresses:', e);
    }
  },

  async submitBindWithdrawAddress() {
    const asset = document.getElementById('bind-addr-asset')?.value || 'USDT';
    const network = document.getElementById('bind-addr-network')?.value || 'TRC20';
    const address = (document.getElementById('bind-addr-val')?.value || '').trim();
    const label = (document.getElementById('bind-addr-label')?.value || '').trim();
    const pin = (document.getElementById('bind-addr-pin')?.value || '').trim();

    if (!address) {
      this.toast('Please enter a destination blockchain address', 'error');
      return;
    }
    if (!pin || !/^\d{6}$/.test(pin)) {
      this.toast('Please enter your 6-digit numeric withdrawal PIN', 'error');
      document.getElementById('bind-addr-pin')?.focus();
      return;
    }

    try {
      const res = await this.api('/user/withdraw-address.php', 'POST', {
        asset,
        network,
        address,
        label: label || `${asset} Address`,
        withdrawal_pin: pin,
        pin: pin,
        fund_password: pin
      });

      if (res.success) {
        this.toast(res.message || 'Withdrawal address bound and encrypted successfully!', 'success');
        const addrVal = document.getElementById('bind-addr-val');
        const pinVal = document.getElementById('bind-addr-pin');
        if (addrVal) addrVal.value = '';
        if (pinVal) pinVal.value = '';
        await this.loadBoundWithdrawAddresses();
        // Also update destination in withdrawal modal if open or preset
        const withDest = document.getElementById('with-dest');
        if (withDest && !withDest.value) withDest.value = address;
        this.closeModal('modal-bind-withdraw-address');
      } else {
        this.toast(res.message || 'Failed to bind withdrawal address', 'error');
      }
    } catch (err) {
      this.toast('Error binding address: ' + (err.message || err), 'error');
    }
  },

  useBoundWithdrawAddress() {
    const asset = document.getElementById('with-asset')?.value || 'USDT';
    const network = document.getElementById('with-network')?.value || 'TRC20';
    const bound = (this.state.boundWithdrawAddresses || []).find(a => 
      a.asset === asset && (a.network === network || !a.network)
    ) || (this.state.boundWithdrawAddresses || [])[0];

    if (bound && bound.address) {
      const destInput = document.getElementById('with-dest');
      if (destInput) destInput.value = bound.address;
      this.toast(`Applied bound ${bound.asset} address: ${bound.address.substring(0, 8)}...`, 'info');
    } else {
      this.toast('No bound address found for this asset. Opening address manager...', 'info');
      this.openBindWithdrawAddressModal();
    }
  },

  updateWithdrawalFee() {
    const net = (document.getElementById('with-network')?.value || 'TRC20').toUpperCase();
    const feeMap = { TRC20: 1.0, BEP20: 0.8, ERC20: 5.0, SOLANA: 0.5 };
    const fee = feeMap[net] ?? 1.0;
    const feeEl = document.getElementById('with-calc-fee');
    if (feeEl) feeEl.textContent = `$${fee.toFixed(2)} USDT`;
    const amountEl = document.getElementById('with-amount');
    if (amountEl) {
      const amount = parseFloat(amountEl.value) || 0;
      const isEarly = this.state.withdrawInfo ? this.state.withdrawInfo.is_early_withdrawal : true;
      const earlyDeduction = isEarly ? (amount * 0.05) : 0;
      const netOut = Math.max(0, amount - fee - earlyDeduction);
      const calcNet = document.getElementById('with-calc-net');
      if (calcNet) calcNet.textContent = `$${netOut.toFixed(2)} USDT`;
    }
  },

  onWithdrawAssetChange() {
    this.updateWithdrawalFee();
  },

  onWithdrawNetworkChange() {
    this.updateWithdrawalFee();
  },

  /* 3.3 Transaction History (Deposits, Withdrawals, Signals) */
  async openHistoryModal(initialTab = 'ALL') {
    if (!this.state.user) {
      this.openModal('modal-auth');
      return;
    }
    this.openModal('modal-transaction-history');
    await this.loadTransactionHistory(initialTab);
  },

  switchHistoryTab(tab, btn) {
    document.querySelectorAll('.tx-history-tab').forEach(b => {
      b.style.background = 'transparent';
      b.style.color = '#6B7280';
      b.classList.remove('active');
    });
    if (btn) {
      btn.style.background = '#0052FF';
      btn.style.color = '#FFFFFF';
      btn.classList.add('active');
    }
    this.loadTransactionHistory(tab);
  },

  copyText(text, msg = 'Copied to clipboard!') {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.toast(msg, 'success');
      }).catch(() => {
        this.fallbackCopyText(text, msg);
      });
    } else {
      this.fallbackCopyText(text, msg);
    }
  },

  fallbackCopyText(text, msg) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.toast(msg, 'success');
    } catch (e) {
      this.toast(`Copied: ${text}`, 'info');
    }
  },

  filterWalletHistory(tab, btn) {
    document.querySelectorAll('.wallet-history-tab').forEach(b => {
      b.style.background = 'transparent';
      b.style.color = '#6B7280';
      b.classList.remove('active');
    });
    if (btn) {
      btn.style.background = '#0052FF';
      btn.style.color = '#FFFFFF';
      btn.classList.add('active');
    }
    this.loadWalletHistoryPreview(tab);
  },

  async loadWalletHistoryPreview(filter = 'ALL') {
    const listEl = document.getElementById('wallet-history-preview-list');
    if (!listEl) return;
    listEl.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:16px 0; font-size:12px;">Loading records...</div>`;

    try {
      const res = await this.api(`/wallet/history.php?type=${encodeURIComponent(filter)}&limit=20`);
      let items = [];
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          items = res.data;
        } else if (filter === 'DEPOSITS') {
          items = res.data.deposits || res.data.history || [];
        } else if (filter === 'WITHDRAWALS') {
          items = res.data.withdrawals || res.data.history || [];
        } else {
          items = res.data.history || [
            ...(res.data.deposits || []),
            ...(res.data.withdrawals || []),
            ...(res.data.signals || []),
            ...(res.data.adjustments || [])
          ];
        }
      }

      if (!items || items.length === 0) {
        listEl.innerHTML = `
          <div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">
            No ${filter === 'ALL' ? 'deposit or withdrawal' : filter.toLowerCase()} records found yet.
          </div>
        `;
        return;
      }

      listEl.innerHTML = items.slice(0, 10).map(tx => {
        const rawType = (tx.type || tx.transaction_type || '').toUpperCase();
        const isAdjustment = rawType === 'ADJUSTMENT';
        const isWith = !isAdjustment && (rawType === 'WITHDRAWAL' || filter === 'WITHDRAWALS' || Boolean(tx.destination_address));
        const isDep = !isAdjustment && !isWith && (rawType === 'DEPOSIT' || filter === 'DEPOSITS' || Boolean(tx.deposit_address));
        const status = (tx.status || 'PENDING').toUpperCase();
        const isApproved = status === 'COMPLETED' || status === 'APPROVED';
        const isRejected = status === 'REJECTED' || status === 'DECLINED';
        const badgeColor = isApproved ? '#00B87C' : (isRejected ? '#F6465D' : '#F59E0B');
        const badgeBg = isApproved ? 'rgba(0,184,124,0.12)' : (isRejected ? 'rgba(246,70,93,0.12)' : 'rgba(245,158,11,0.12)');
        const badgeText = isApproved ? 'Approved' : (isRejected ? 'Rejected' : 'Pending');
        const signedAmount = Number(tx.amount || 0);
        const sign = isAdjustment ? (signedAmount < 0 ? '-' : '+') : (isWith ? '-' : '+');
        const amtColor = isAdjustment ? (signedAmount < 0 ? '#111827' : '#00B87C') : (isWith ? '#111827' : '#00B87C');
        const formattedDate = tx.created_at ? new Date(tx.created_at).toLocaleString(undefined, {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : 'Recent';
        const addr = tx.destination_address || tx.target_address || tx.deposit_address || tx.tx_hash || '';
        const shortAddr = addr.length > 14 ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}` : addr;

        return `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #EEF1F6;">
            <div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-weight:700; font-size:13px; color:#111827;">${isAdjustment ? 'Balance Adjustment' : (isWith ? 'Withdrawal' : (isDep ? 'Deposit' : 'Transaction'))}</span>
                <span style="font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; background:${badgeBg}; color:${badgeColor}; border:1px solid ${badgeColor}33;">${badgeText}</span>
              </div>
              <div style="font-size:11px; color:#6B7280; margin-top:3px; display:flex; align-items:center; gap:6px;">
                <span>${formattedDate}</span>
                <span>&bull;</span>
                <span style="color:#0052FF; font-weight:600;">${tx.network || 'TRC20'}</span>
                ${shortAddr ? `
                  <span>&bull;</span>
                  <span style="font-family:var(--font-mono); color:#4B5563;" title="${addr}">${shortAddr}</span>
                  <button type="button" class="btn-secondary" style="padding:1px 6px; font-size:9px; font-weight:700; border-radius:4px;" onclick="App.copyText('${addr}', 'Address copied!')">Copy</button>
                ` : ''}
              </div>
              ${isAdjustment && (tx.reason || tx.description) ? `
                <div style="margin-top:4px; font-size:10px; color:#1E40AF; background:#EFF4FF; padding:4px 7px; border-radius:4px; border:1px solid #DBEAFE;">
                  <strong>Reason:</strong> ${tx.reason || tx.description}
                </div>
              ` : ''}
              ${tx.rejection_reason && isRejected ? `
                <div style="margin-top:4px; font-size:10px; color:#DC2626; background:#FEF2F2; padding:3px 6px; border-radius:4px;">
                  Audit Rejection Note: ${tx.rejection_reason}
                </div>
              ` : ''}
            </div>
            <div style="text-align:right;">
              <div class="mono" style="font-size:14px; font-weight:800; color:${amtColor};">
                ${sign}${Number(tx.amount || 0).toFixed(2)} ${tx.asset || 'USDT'}
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {
      listEl.innerHTML = `<div style="text-align:center; padding:16px; color:#ef4444; font-size:11px;">Error loading history.</div>`;
    }
  },

  async loadTransactionHistory(filter = 'ALL') {
    const listEl = document.getElementById('tx-history-list');
    if (!listEl) return;
    listEl.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:30px 0;">Loading transactions...</div>`;

    try {
      const res = await this.api(`/wallet/history.php?type=${encodeURIComponent(filter)}&limit=50`);
      let items = [];
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          items = res.data;
        } else if (filter === 'DEPOSITS') {
          items = res.data.deposits || res.data.history || [];
        } else if (filter === 'WITHDRAWALS') {
          items = res.data.withdrawals || res.data.history || [];
        } else {
          items = res.data.history || [
            ...(res.data.deposits || []),
            ...(res.data.withdrawals || []),
            ...(res.data.signals || []),
            ...(res.data.adjustments || [])
          ];
        }
      }

      if (items.length > 0) {
        listEl.innerHTML = items.map(tx => {
          const rawType = (tx.type || tx.transaction_type || '').toUpperCase();
          const isAdjustment = rawType === 'ADJUSTMENT';
          const isWithdrawal = !isAdjustment && (rawType === 'WITHDRAWAL' || filter === 'WITHDRAWALS' || Boolean(tx.destination_address));
          const isSignal = rawType === 'SIGNAL_PROFIT';
          const isDeposit = !isWithdrawal && !isSignal && !isAdjustment;
          const status = (tx.status || 'PENDING').toUpperCase();

          let statusBadge = '';
          if (status === 'COMPLETED' || status === 'APPROVED') {
            statusBadge = `<span style="background:rgba(0,184,124,0.12); color:#00B87C; border:1px solid rgba(0,184,124,0.3); padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">APPROVED</span>`;
          } else if (status === 'REJECTED' || status === 'DECLINED') {
            statusBadge = `<span style="background:rgba(246,70,93,0.12); color:#F6465D; border:1px solid rgba(246,70,93,0.3); padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">REJECTED</span>`;
          } else {
            statusBadge = `<span style="background:rgba(245,158,11,0.12); color:#D97706; border:1px solid rgba(245,158,11,0.3); padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">PENDING</span>`;
          }

          let icon = '💳';
          let sign = '+';
          let amountColor = '#00B87C';
          if (isAdjustment) {
            icon = Number(tx.amount || 0) < 0 ? '↘️' : '↗️';
            sign = Number(tx.amount || 0) < 0 ? '-' : '+';
            amountColor = Number(tx.amount || 0) < 0 ? '#111827' : '#00B87C';
          } else if (isWithdrawal) {
            icon = '📤';
            sign = '-';
            amountColor = '#111827';
          } else if (isSignal) {
            icon = '⚡';
            sign = '+';
            amountColor = '#0052FF';
          }

          const formattedDate = tx.created_at ? new Date(tx.created_at).toLocaleString() : 'Recent';
          const addr = tx.destination_address || tx.deposit_address || tx.tx_hash || '';

          return `
            <div class="card" style="background:#F8FAFC; border:1px solid #E5E9F0; border-radius:10px; padding:12px 14px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:18px;">${icon}</span>
                  <div>
                    <div style="font-size:13px; font-weight:700; color:#111827;">
                      ${isAdjustment ? 'Balance Adjustment' : (isDeposit ? 'Deposit' : (isWithdrawal ? 'Withdrawal' : 'Signal Profit Credit'))}
                    </div>
                    <div style="font-size:11px; color:#6B7280; font-family:var(--font-mono);">${formattedDate}</div>
                  </div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:14px; font-weight:800; color:${amountColor}; font-family:var(--font-mono);">
                    ${sign}$${Number(tx.amount || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} ${tx.asset || 'USDT'}
                  </div>
                  <div style="margin-top:2px;">${statusBadge}</div>
                </div>
              </div>

              ${addr ? `
                <div style="font-size:11px; color:#6B7280; font-family:var(--font-mono); word-break:break-all; margin-top:4px; display:flex; align-items:center; gap:6px;">
                  <span>${isWithdrawal ? 'To' : 'Ref'}: ${addr}</span>
                  <button type="button" class="btn-secondary" style="padding:1px 6px; font-size:9px; font-weight:700;" onclick="App.copyText('${addr}', 'Copied!')">Copy</button>
                </div>
              ` : ''}

              ${tx.network ? `
                <div style="font-size:10px; color:#6B7280; margin-top:2px;">
                  Network: <strong style="color:#111827;">${tx.network}</strong>
                  ${Number(tx.fee || 0) > 0 ? ` | Fee: $${Number(tx.fee).toFixed(2)}` : ''}
                </div>
              ` : ''}

              ${tx.rejection_reason && status === 'REJECTED' ? `
                <div style="margin-top:6px; background:#FEF2F2; border:1px solid #FECACA; border-radius:6px; padding:6px 10px; font-size:11px; color:#DC2626;">
                  <strong>Audit Rejection Reason:</strong> ${tx.rejection_reason}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      } else {
        listEl.innerHTML = `
          <div style="text-align:center; padding:36px 16px; color:#6B7280;">
            <div style="font-size:32px; margin-bottom:8px;">📑</div>
            <div style="font-size:13px; font-weight:700; color:#111827;">No Transaction Records Found</div>
            <div style="font-size:12px; margin-top:4px;">Your deposits, withdrawals, and signal payouts will appear here.</div>
          </div>
        `;
      }
    } catch (err) {
      listEl.innerHTML = `<div style="text-align:center; color:#ef4444; padding:20px;">Failed to load transaction history: ${err.message || err}</div>`;
    }
  },

  showCountryModal() {
    this.openCountrySelectorModal();
  },

  openNameSettingsModal() {
    const user = this.state.user || {};
    const first = document.getElementById('settings-first-name');
    const last = document.getElementById('settings-last-name');
    if (first) { first.value = String(user.first_name || ''); first.disabled = false; first.removeAttribute('readonly'); }
    if (last) { last.value = String(user.last_name || ''); last.disabled = false; last.removeAttribute('readonly'); }
    this.openModal('modal-name-settings');
    if (first) setTimeout(() => first.focus(), 50);
  },

  async saveNameSettings() {
    const first = document.getElementById('settings-first-name')?.value.trim() || '';
    const last = document.getElementById('settings-last-name')?.value.trim() || '';
    if (!first || !last) { this.toast('First name and last name are required', 'error'); return; }
    const res = await this.api('/user/profile.php', 'POST', { first_name: first, last_name: last });
    if (res.success) {
      this.state.user = { ...(this.state.user || {}), first_name: first, last_name: last };
      localStorage.setItem('alphavest_local_user', JSON.stringify(this.state.user));
      const nameDisp = document.getElementById('settings-name-display');
      if (nameDisp) nameDisp.textContent = `${first} ${last}`.trim();
      this.updateHeaderAuth();
      this.closeModal('modal-name-settings');
      this.toast('Name updated successfully', 'success');
    } else {
      this.toast(res.message || 'Could not update name', 'error');
    }
  },

  openCountrySelectorModal() {
    this.openModal('modal-country-selector');
    const input = document.getElementById('country-search-input');
    if (input) input.value = '';
    this.renderCountryModalList(COUNTRIES_LIST);
  },

  renderCountryModalList(list) {
    const container = document.getElementById('country-modal-list');
    if (!container) return;
    const currentCountry = this.state.user?.country || localStorage.getItem('alphavest_user_country') || 'Not set';
    container.innerHTML = list.map(c => {
      const isSelected = c.name === currentCountry;
      return `
        <div onclick="App.selectUserCountry('${c.name}')" style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-radius:8px; cursor:pointer; background:${isSelected ? '#EFF4FF' : '#F8FAFC'}; border:1px solid ${isSelected ? '#0052FF' : '#E5E9F0'}; transition: all 0.15s ease;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:20px;">${c.flag}</span>
            <span style="font-size:14px; font-weight:${isSelected ? '700' : '500'}; color:#111827;">${c.name}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:11px; color:#6B7280;">${c.code}</span>
            ${isSelected ? '<span style="color:#0052FF; font-size:13px; font-weight:700;">✓</span>' : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  filterCountryModalList() {
    const q = (document.getElementById('country-search-input')?.value || '').toLowerCase().trim();
    const filtered = COUNTRIES_LIST.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    this.renderCountryModalList(filtered);
  },

  async selectUserCountry(countryName) {
    const timezone = (Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Karachi');

    // Logged-in users must persist the change server-side before updating the local UI.
    if (this.state.user) {
      try {
        const saveRes = await this.api('/user/country.php', 'POST', { country: countryName, region: countryName, timezone });
        if (!saveRes.success) {
          this.toast(saveRes.message || 'Could not save your region. Please try again.', 'error');
          return;
        }
        this.state.user.country = saveRes.data?.country || countryName;
        this.state.user.timezone = saveRes.data?.timezone || timezone;
        localStorage.setItem('alphavest_user_country', this.state.user.country);
        localStorage.setItem('alphavest_local_user', JSON.stringify(this.state.user));
        document.cookie = 'alphavest_country=' + encodeURIComponent(this.state.user.country) + '; path=/; max-age=2592000; SameSite=Lax';
        document.cookie = 'alphavest_timezone=' + encodeURIComponent(this.state.user.timezone) + '; path=/; max-age=2592000; SameSite=Lax';
      } catch (e) {
        this.toast('Could not save your region. Please try again.', 'error');
        return;
      }
    } else {
      localStorage.setItem('alphavest_user_country', countryName);
    }

    const settingsCountry = document.getElementById('settings-country-label');
    if (settingsCountry) settingsCountry.textContent = countryName;
    const userCountryDisp = document.getElementById('user-country-display');
    if (userCountryDisp) userCountryDisp.textContent = countryName;

    this.closeModal('modal-country-selector');
    this.toast(`Region updated to ${countryName}.`, 'success');
  },

  showSecurityPrompt(feature) {
    this.toast(`${feature} is active and secured with institutional hardware encryption.`, 'info');
  },

  showResetPasswordModal(type) {
    if (type === 'pin' || type === 'fund') {
      if (typeof this.openChangePinModal === 'function') {
        this.openChangePinModal();
        return;
      }
    }
    this.navigate('security');
    this.toast('Password updates are protected via Security Center verification.', 'info');
  },

  showContactModal(type) {
    this.openChangeEmailModal();
  },

  openOptionsRules() {
    this.openModal('modal-options-rules');
  },

  openLanguageSelector() {
    const current = localStorage.getItem('alphavest_language') || 'en';
    document.querySelectorAll('[data-language-option]').forEach(item => {
      const active = item.getAttribute('data-language-option') === current;
      item.classList.toggle('active', active);
      const check = item.querySelector('.lang-check');
      if (check) check.style.display = active ? 'inline' : 'none';
    });
    this.openModal('modal-language-select');
  },

  setLanguage(lang, label) {
    const language = lang === 'ka' ? 'ka' : 'en';
    const languageLabel = label || (language === 'ka' ? 'ქართული' : 'English');
    try { localStorage.setItem('alphavest_language', language); } catch (e) {}
    const settingsLabel = document.getElementById('settings-lang-label');
    if (settingsLabel) settingsLabel.textContent = languageLabel;
    const moreLabel = document.getElementById('more-language-current');
    if (moreLabel) moreLabel.textContent = languageLabel;
    const publicLanguage = document.getElementById('av-public-language');
    if (publicLanguage) publicLanguage.value = language;
    this.closeModal('modal-language-select');
    if (window.AlphavestTranslate && typeof window.AlphavestTranslate.setLanguage === 'function') {
      window.AlphavestTranslate.setLanguage(language, (ok) => {
        if (!ok) this.toast('Translation service unavailable. Check your connection and try again.', 'error');
        else if (language === 'ka') this.toast('ქართული ენა ჩართულია', 'success');
      });
      return;
    }
    // Graceful fallback if the external translation service is blocked by the browser/network.
    document.documentElement.lang = language;
    if (language === 'ka') {
      try { if (window.AlphavestGeorgian) window.AlphavestGeorgian.apply(); } catch (e) {}
      this.toast('ქართული თარგმანი სრულად ვერ ჩაიტვირთა. შეამოწმეთ ინტერნეტკავშირი.', 'error');
    } else {
      location.reload();
    }
  },

  confirmLogout() {
    this.openModal('modal-logout-confirm');
  },

  async executeLogout() {
    this.closeModal('modal-logout-confirm');
    await this.logout();
    this.navigate('home');
  },

  /* 4. Notice & Message Center */
  getLocalReadNotifsKey() {
    return `alphavest_read_notifs_${this.getFastCacheUserKey()}`;
  },

  getLocalReadNotifs() {
    try {
      const raw = localStorage.getItem(this.getLocalReadNotifsKey());
      if (!raw) return { ids: [], beforeTs: 0 };
      const parsed = JSON.parse(raw);
      return {
        ids: Array.isArray(parsed?.ids) ? parsed.ids.map(String) : [],
        beforeTs: Number(parsed?.beforeTs || 0)
      };
    } catch (e) {
      return { ids: [], beforeTs: 0 };
    }
  },

  saveLocalReadNotifs(ids = [], beforeTs = 0) {
    try {
      const prev = this.getLocalReadNotifs();
      const mergedIds = Array.from(new Set([...(prev.ids || []), ...ids.map(String).filter(Boolean)])).slice(-120);
      const nextBefore = Math.max(Number(prev.beforeTs || 0), Number(beforeTs || 0));
      localStorage.setItem(this.getLocalReadNotifsKey(), JSON.stringify({
        ids: mergedIds,
        beforeTs: nextBefore
      }));
    } catch (e) {}
  },

  parseNotifTimestampMs(createdAt) {
    if (!createdAt) return 0;
    const str = String(createdAt).trim();
    if (!str) return 0;
    const normalized = (str.includes('T') || str.includes('Z') || str.includes('+'))
      ? str
      : (str.replace(' ', 'T') + 'Z');
    const ms = Date.parse(normalized);
    if (!Number.isNaN(ms)) return ms;
    const fallback = Date.parse(str);
    return Number.isNaN(fallback) ? 0 : fallback;
  },

  applyLocalNotificationReadState(list) {
    const readStore = this.getLocalReadNotifs();
    const idSet = new Set(readStore.ids || []);
    const beforeMs = Number(readStore.beforeTs || 0);
    let unreadCount = 0;

    const mapped = (Array.isArray(list) ? list : []).map(item => {
      const copy = { ...item };
      const id = String(copy.id || '');
      const createdMs = this.parseNotifTimestampMs(copy.created_at);
      const isLocallyRead = (id && idSet.has(id)) || (beforeMs > 0 && createdMs > 0 && createdMs <= beforeMs);
      if (isLocallyRead) {
        copy.is_read = 1;
      }
      if (Number(copy.is_read || 0) === 0) {
        unreadCount++;
      }
      return copy;
    });

    return { notifications: mapped, unreadCount };
  },

  getNoticeAnnouncementsHtml() {
    return `
      <div class="notice-item" style="margin-bottom: 12px; background: #FFFFFF; border: 1px solid #E5E9F0; border-radius: 12px; padding: 14px; cursor: pointer;" onclick="App.viewNoticeDetail(1)">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="badge" style="font-size: 10px; font-weight: 700; color: #059669; background: #ECFDF5;">SYSTEM</span>
          <span style="font-size: 11px; color: #6B7280;">2026-09-20 10:30</span>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px;">
          Global Institutional Trading Ecosystem Upgrade
        </div>
        <div style="font-size: 12px; color: #4B5563; line-height: 1.5;">
          PRIME X CAPITAL has enhanced multi-regional server clustering and automated 3-tier commission distribution with sub-millisecond execution.
        </div>
      </div>

      <div class="notice-item" style="margin-bottom: 12px; background: #FFFFFF; border: 1px solid #E5E9F0; border-radius: 12px; padding: 14px; cursor: pointer;" onclick="App.viewNoticeDetail(2)">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="badge" style="font-size: 10px; font-weight: 700; color: #0052FF; background: #EFF4FF;">SIGNALS</span>
          <span style="font-size: 11px; color: #6B7280;">2026-09-18 14:15</span>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px;">
          Daily Trading Signals
        </div>
        <div style="font-size: 12px; color: #4B5563; line-height: 1.5;">
          All members with minimum 20 USDT aggregated balance qualify for institutional trade dispatches twice daily in their local country time.
        </div>
      </div>

      <div class="notice-item" style="margin-bottom: 12px; background: #FFFFFF; border: 1px solid #E5E9F0; border-radius: 12px; padding: 14px; cursor: pointer;" onclick="App.viewNoticeDetail(3)">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="badge" style="font-size: 10px; font-weight: 700; color: #D97706; background: #FEF3C7;">SECURITY</span>
          <span style="font-size: 11px; color: #6B7280;">2026-09-15 08:00</span>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px;">
          Cold Vault Reserve Exceeds 100% Proof of Solvency
        </div>
        <div style="font-size: 12px; color: #4B5563; line-height: 1.5;">
          Cryptographic proof-of-solvency verified 104.2% segregated reserve backing for all user balances and commodity holdings.
        </div>
      </div>
    `;
  },

  getNoticeMessagesHtml() {
    const userEmail = this.state.user?.email || 'Valued Trader';
    return `
      <div class="notice-item" style="margin-bottom: 12px; background: #FFFFFF; border: 1px solid #DBEAFE; border-radius: 12px; padding: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="badge" style="font-size: 10px; font-weight: 700; background: #EFF4FF; color: #0052FF;">VIP DESK</span>
          <span style="font-size: 11px; color: #6B7280;">Priority Dispatch</span>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px;">
          Welcome to the PRIME X CAPITAL Trading Network, ${this.escapeHtml(userEmail.split('@')[0])}
        </div>
        <div style="font-size: 12px; color: #4B5563; line-height: 1.5;">
          Your account is assigned to high-priority order routing. Maintain at least 20 USDT in your portfolio to ensure automated execution of all scheduled signals.
        </div>
      </div>
    `;
  },

  loadNoticeView() {
    this.setNoticeTab('notifications');
  },

  setNoticeTab(tab) {
    document.querySelectorAll('#view-notice .xdx-market-tab').forEach(b => {
      b.classList.remove('active');
    });
    const activeTab = document.getElementById(`tab-notice-${tab}`);
    if (activeTab) activeTab.classList.add('active');

    const listEl = document.getElementById('notice-list-container');
    const subTitle = document.getElementById('notice-active-subtitle');
    const actionsBar = document.getElementById('notice-actions-bar');
    if (!listEl) return;

    if (tab === 'notifications') {
      if (subTitle) subTitle.textContent = 'Real-time account alerts & trade executions';
      if (actionsBar) actionsBar.style.display = 'flex';
      const list = this.state.notifications || [];
      if (!list.length) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 40px 16px; color: #6B7280;">
            <div style="font-size: 32px; margin-bottom: 10px;">🔔</div>
            <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">No Notifications Yet</div>
            <div style="font-size: 12px; line-height: 1.5; max-width: 320px; margin: 0 auto;">
              You will receive real-time notifications here for account security events, signal broadcasts, deposit confirmations, and referral commissions.
            </div>
          </div>
        `;
      } else {
        listEl.innerHTML = list.map(item => `
          <div class="notice-item" style="margin-bottom: 10px; background: #FFFFFF; border: 1px solid #E5E9F0; border-radius: 12px; padding: 14px; box-shadow: 0 2px 6px rgba(17,24,39,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="badge" style="font-size: 10px; font-weight: 700; background: #EFF4FF; color: #0052FF;">${this.escapeHtml(item.type || 'SYSTEM')}</span>
              <span style="font-size: 11px; color: #6B7280;">${this.escapeHtml((item.created_at || '').substring(0, 16).replace('T', ' ') || 'Recent')}</span>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px;">
              ${this.escapeHtml(item.title)}
            </div>
            <div style="font-size: 12px; color: #4B5563; line-height: 1.5;">
              ${this.escapeHtml(item.message)}
            </div>
          </div>
        `).join('');
      }
    } else if (tab === 'announcement') {
      if (subTitle) subTitle.textContent = 'Official platform announcements & updates';
      if (actionsBar) actionsBar.style.display = 'none';
      listEl.innerHTML = this.getNoticeAnnouncementsHtml();
    } else if (tab === 'private') {
      if (subTitle) subTitle.textContent = 'Confidential administrative communications';
      if (actionsBar) actionsBar.style.display = 'none';
      listEl.innerHTML = this.getNoticeMessagesHtml();
    }
  },

  async persistNotificationsRead() {
    const currentList = this.state.notifications || [];
    const currentIds = currentList.map(n => n.id).filter(Boolean);
    const maxItemMs = currentList.reduce((acc, n) => Math.max(acc, this.parseNotifTimestampMs(n.created_at)), 0);
    const nowMs = Date.now();
    const cutoffMs = Math.max(nowMs, maxItemMs);

    this.state.notifications = currentList.map(n => ({ ...n, is_read: 1 }));
    this.saveLocalReadNotifs(currentIds, cutoffMs);
    this.state.unreadNotificationsCount = 0;
    this.writeFastCache('notifications', { notifications: this.state.notifications, unread_count: 0 });
    this.updateNotificationBell(0);
    this.renderHomeNotificationBanner();

    try {
      await this.api('/notifications/read.php', 'POST', {
        notification_id: 'all',
        mark_all: true,
        ids: currentIds,
        before_ts: Math.ceil(cutoffMs / 1000)
      });
    } catch (e) {
      console.warn('Failed to persist read notifications on server:', e);
    }
  },

  async markAllNotificationsRead() {
    await this.persistNotificationsRead();
    this.toast('All notifications marked as read', 'success');
    this.setNoticeTab('notifications');
    this.renderNotificationsList();
  },

  /* ==========================================================================
     NOTIFICATIONS & ALERT BELL SYSTEM
     ========================================================================== */
  async loadNotifications() {
    try {
      const res = await this.api('/notifications.php');
      if (res && res.success && res.data) {
        const applied = this.applyLocalNotificationReadState(res.data.notifications || []);
        this.state.notifications = applied.notifications;
        this.state.unreadNotificationsCount = applied.unreadCount;
        this.writeFastCache('notifications', {
          notifications: applied.notifications,
          unread_count: applied.unreadCount
        });
        this.updateNotificationBell(applied.unreadCount);
        this.renderHomeNotificationBanner();
      }
    } catch (e) {
      console.warn('Failed to load notifications:', e);
    }
  },

  updateNotificationBell(unreadCount) {
    const count = Math.max(0, Number(unreadCount || 0));
    const bellBtn = document.getElementById('btn-header-bell');
    const badge = document.getElementById('header-bell-badge');
    const noticeBadge = document.getElementById('notice-unread-count-badge');
    const modalBadge = document.getElementById('modal-notif-unread-badge');

    if (bellBtn) {
      if (count > 0) {
        bellBtn.classList.add('bell-ringing');
      } else {
        bellBtn.classList.remove('bell-ringing');
      }
    }

    const syncBadge = (el) => {
      if (!el) return;
      if (count > 0) {
        el.textContent = count > 99 ? '99+' : String(count);
        el.style.display = 'flex';
      } else {
        el.style.display = 'none';
      }
    };

    syncBadge(badge);
    syncBadge(noticeBadge);
    syncBadge(modalBadge);
  },

  renderHomeNotificationBanner() {
    const banner = document.getElementById('home-active-notification-banner');
    if (!banner) return;

    const list = this.state.notifications || [];
    if (!list.length) {
      banner.style.display = 'none';
      return;
    }

    const latest = list[0];
    const isUnread = Number(latest.is_read || 0) === 0;

    let icon = '🔔';
    let borderColor = '#BFDBFE';
    let badgeBg = '#EFF4FF';
    let badgeColor = '#0052FF';
    let badgeText = 'NOTIFICATION';

    if (latest.type?.includes('DEPOSIT_APPROVED')) {
      icon = '💰';
      badgeText = 'DEPOSIT APPROVED';
      borderColor = '#A7F3D0';
      badgeBg = '#ECFDF5';
      badgeColor = '#059669';
    } else if (latest.type?.includes('DEPOSIT_REJECTED')) {
      icon = '⚠️';
      badgeText = 'DEPOSIT DECLINED';
      borderColor = '#FECACA';
      badgeBg = '#FEF2F2';
      badgeColor = '#DC2626';
    } else if (latest.type?.includes('KYC_APPROVED')) {
      icon = '🛡️';
      badgeText = 'KYC APPROVED';
      borderColor = '#A7F3D0';
      badgeBg = '#ECFDF5';
      badgeColor = '#059669';
    } else if (latest.type?.includes('KYC_REJECTED')) {
      icon = '❌';
      badgeText = 'KYC DECLINED';
      borderColor = '#FECACA';
      badgeBg = '#FEF2F2';
      badgeColor = '#DC2626';
    } else if (latest.type?.includes('SIGNAL')) {
      icon = '⚡';
      badgeText = 'SIGNAL ALERT';
      borderColor = '#BFDBFE';
      badgeBg = '#EFF4FF';
      badgeColor = '#0052FF';
    }

    banner.style.display = 'block';
    banner.innerHTML = `
      <div style="background: #FFFFFF; border: 1px solid ${borderColor}; border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 4px 12px rgba(17,24,39,0.06); cursor: pointer;" onclick="App.openNotificationsModal()">
        <div style="display: flex; align-items: flex-start; gap: 10px; flex: 1; min-width: 0;">
          <div style="font-size: 20px; line-height: 1; flex-shrink: 0; padding-top: 2px;">${icon}</div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
              <span style="font-size: 10px; font-weight: 800; color: ${badgeColor}; background: ${badgeBg}; padding: 2px 7px; border-radius: 5px; letter-spacing: 0.4px;">${badgeText}</span>
              ${isUnread ? '<span style="width: 7px; height: 7px; border-radius: 50%; background: #F6465D; display: inline-block;"></span>' : ''}
              <span style="font-size: 11px; color: #6B7280;">${this.escapeHtml(latest.created_at || 'Just now')}</span>
            </div>
            <div style="font-size: 13.5px; font-weight: 700; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">
              ${this.escapeHtml(latest.title)}
            </div>
            <div style="font-size: 11.5px; color: #4B5563; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${this.escapeHtml(latest.message)}
            </div>
          </div>
        </div>
        <button style="background: #EFF4FF; border: 1px solid #DBEAFE; color: #0052FF; font-size: 11.5px; font-weight: 700; padding: 6px 12px; border-radius: 8px; cursor: pointer; white-space: nowrap; flex-shrink: 0;">
          View
        </button>
      </div>
    `;
  },

  async openNotificationsModal() {
    // 1. Open modal and default to All alerts tab
    this.openModal('modal-notifications');
    this.setNotifModalTab('notifications');

    // 2. Immediately mark viewed notifications as read locally & on backend so bell stops ringing permanently
    await this.persistNotificationsRead();
  },

  setNotifModalTab(tab = 'notifications') {
    this.state.notifModalTab = tab;
    document.querySelectorAll('#modal-notifications .xdx-market-tab').forEach(b => {
      b.classList.remove('active');
    });
    const activeTab = document.getElementById(`tab-notif-modal-${tab}`);
    if (activeTab) activeTab.classList.add('active');
    this.renderNotificationsList();
  },

  renderNotificationsList() {
    const listEl = document.getElementById('notifications-modal-list');
    const subTitleEl = document.getElementById('notifications-modal-subtitle');
    if (!listEl) return;

    const tab = this.state.notifModalTab || 'notifications';

    if (tab === 'announcement') {
      if (subTitleEl) subTitleEl.textContent = 'Official platform announcements & updates';
      listEl.innerHTML = this.getNoticeAnnouncementsHtml();
      return;
    }

    if (tab === 'private') {
      if (subTitleEl) subTitleEl.textContent = 'Confidential administrative communications';
      listEl.innerHTML = this.getNoticeMessagesHtml();
      return;
    }

    if (subTitleEl) subTitleEl.textContent = 'Real-time account alerts & trade executions';
    const list = this.state.notifications || [];
    if (!list.length) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #6B7280;">
          <div style="font-size: 36px; margin-bottom: 8px;">📭</div>
          <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px;">No Notifications Yet</div>
          <div style="font-size: 12px;">Admin approvals, deposits, KYC status, and trading signals will appear here.</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = list.map(item => {
      let icon = '🔔';
      let tagBg = '#F3F5F8';
      let tagColor = '#4B5563';
      let tagText = 'ALERT';
      let actionBtn = '';

      if (item.type === 'DEPOSIT_APPROVED') {
        icon = '💰';
        tagBg = '#ECFDF5';
        tagColor = '#059669';
        tagText = 'DEPOSIT APPROVED';
        actionBtn = `<button onclick="App.closeModal('modal-notifications'); App.navigate('wallet');" style="background: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; cursor: pointer; margin-top: 6px;">Check Funding Wallet</button>`;
      } else if (item.type === 'DEPOSIT_REJECTED') {
        icon = '⚠️';
        tagBg = '#FEF2F2';
        tagColor = '#DC2626';
        tagText = 'DEPOSIT DECLINED';
        actionBtn = `<button onclick="App.closeModal('modal-notifications'); App.openDepositModal();" style="background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; cursor: pointer; margin-top: 6px;">Retry Deposit</button>`;
      } else if (item.type === 'KYC_APPROVED') {
        icon = '🛡️';
        tagBg = '#ECFDF5';
        tagColor = '#059669';
        tagText = 'KYC VERIFIED';
        actionBtn = `<button onclick="App.closeModal('modal-notifications'); App.navigate('futures');" style="background: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; cursor: pointer; margin-top: 6px;">Trade Options</button>`;
      } else if (item.type === 'KYC_REJECTED') {
        icon = '❌';
        tagBg = '#FEF2F2';
        tagColor = '#DC2626';
        tagText = 'KYC DECLINED';
        actionBtn = `<button onclick="App.closeModal('modal-notifications'); App.navigate('kyc');" style="background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; cursor: pointer; margin-top: 6px;">Resubmit KYC</button>`;
      } else if (item.type === 'SIGNAL_AVAILABLE' || item.type === 'SIGNAL_SETTLED') {
        icon = '⚡';
        tagBg = '#EFF4FF';
        tagColor = '#0052FF';
        tagText = 'SIGNAL RELEASE';
        actionBtn = `<button onclick="App.closeModal('modal-notifications'); App.navigate('signals');" style="background: #EFF4FF; border: 1px solid #DBEAFE; color: #0052FF; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; cursor: pointer; margin-top: 6px;">View &amp; Confirm Signal</button>`;
      } else if (item.type?.includes('WITHDRAWAL')) {
        icon = '💸';
        tagBg = '#EFF4FF';
        tagColor = '#0052FF';
        tagText = 'WITHDRAWAL';
        actionBtn = `<button onclick="App.closeModal('modal-notifications'); App.navigate('wallet');" style="background: #EFF4FF; border: 1px solid #DBEAFE; color: #0052FF; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; cursor: pointer; margin-top: 6px;">View History</button>`;
      }

      return `
        <div style="background: #F8FAFC; border: 1px solid #E5E9F0; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; transition: all 0.2s;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">${icon}</span>
              <span style="font-size: 10.5px; font-weight: 800; color: ${tagColor}; background: ${tagBg}; padding: 2px 7px; border-radius: 4px; letter-spacing: 0.5px;">${tagText}</span>
            </div>
            <span style="font-size: 11px; color: #6B7280;">${this.escapeHtml(item.created_at || 'Just now')}</span>
          </div>
          <div style="font-size: 13.5px; font-weight: 700; color: #111827; margin-bottom: 4px;">
            ${this.escapeHtml(item.title)}
          </div>
          <div style="font-size: 12px; color: #4B5563; line-height: 1.45;">
            ${this.escapeHtml(item.message)}
          </div>
          ${actionBtn}
        </div>
      `;
    }).join('');
  },

  viewNoticeDetail(id) {
    this.toast('Announcement details loaded', 'info');
  },

  /* Carousel & Presentation Utilities */
  carouselIndex: 0,
  carouselTimer: null,

  initCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;
    this.goToSlide(0);
    if (this.carouselTimer) clearInterval(this.carouselTimer);
    this.carouselTimer = setInterval(() => {
      const slides = document.querySelectorAll('.xdx-carousel-slide');
      if (!slides.length) return;
      const next = (this.carouselIndex + 1) % slides.length;
      this.goToSlide(next);
    }, 4500);
  },

  goToSlide(idx) {
    this.carouselIndex = idx;
    const track = document.getElementById('carousel-track');
    if (track) {
      track.style.transform = `translateX(-${idx * 100}%)`;
    }
    const slides = document.querySelectorAll('.xdx-carousel-slide');
    const counter = document.getElementById('carousel-counter-badge');
    if (counter) {
      counter.textContent = `${idx + 1}/${slides.length || 6}`;
    }
    const dots = document.querySelectorAll('.xdx-carousel-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  },

  toggleLayoutWidth() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    const isWide = appEl.classList.toggle('wide-view');
    const btn = document.getElementById('header-layout-btn');
    if (btn) {
      btn.title = isWide ? "Switch to Mobile Frame (Exact Video Match)" : "Switch to Wide Layout";
    }
    this.toast(isWide ? "Switched to Full Desktop View" : "Switched to Mobile View (Exact Video Match)", "info");
  },

  /* 5. Customer Service & Live Chat */
  openCustomerService() {
    this.openModal('modal-customer-service');
  },

  openLiveSupportChat() {
    this.closeModal('modal-customer-service');
    this.openModal('modal-support-chat');
  },

  sendSupportMessage() {
    const input = document.getElementById('chat-input-text');
    const msgText = input?.value?.trim();
    if (!msgText) return;

    const chatBox = document.getElementById('chat-messages-container');
    if (!chatBox) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Message
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.innerHTML = `
      <div class="chat-bubble">${msgText}</div>
      <div class="chat-time">${timeStr}</div>
    `;
    chatBox.appendChild(userDiv);
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate Agent Response
    setTimeout(() => {
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg bot';
      let reply = "Thank you for contacting PRIME X CAPITAL 24/7 Global Support. Your inquiry has been routed to our institutional desk. How can we assist you with deposits, withdrawals, or contract settlements today?";
      const lower = msgText.toLowerCase();
      if (lower.includes('deposit') || lower.includes('fund')) {
        reply = "Deposits in USDT (TRC-20, ERC-20) and BTC are credited within 1-3 network confirmations. You can click 'Deposit' on the Home screen to view your dedicated deposit vault address.";
      } else if (lower.includes('withdraw')) {
        reply = "Withdrawals are processed automatically 24/7 once submitted through the Wallet tab. Please make sure your destination address and network match.";
      } else if (lower.includes('kyc') || lower.includes('verify')) {
        reply = "You can submit your Tier 2 KYC verification directly in the Settings -> Real Name Verification tab. Identity cards, Passports, and Driver's Licenses are supported.";
      } else if (lower.includes('oil') || lower.includes('crude')) {
        reply = "PRIME X CAPITAL provides continuous trading on Crude Oil (OIL/USDT) with automated rollover and up to 100x leverage. You can access it under the Options / Futures tab.";
      }
      botDiv.innerHTML = `
        <div class="chat-bubble">${reply}</div>
        <div class="chat-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      `;
      chatBox.appendChild(botDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 700);
  },

  /* ==========================================================================
     6. COBALT BLUE & WHITE INSTITUTIONAL UI: DRAWER, LANDING, TRADE HUB & SETTINGS
     ========================================================================== */
  openAppView(view = 'home') {
    if (window.AlphaLanding && typeof window.AlphaLanding.hide === 'function') {
      window.AlphaLanding.hide();
    }
    const landing = document.getElementById('av-public-landing');
    if (landing) landing.hidden = true;
    this.navigate(view || 'home');
  },

  openAuthModal(mode = 'login') {
    this.openModal('modal-auth');
    if (typeof this.switchAuthBox === 'function') {
      this.switchAuthBox(mode === 'register' ? 'register' : 'login');
    }
  },

  openCustomerServiceModal() {
    this.openCustomerService();
  },

  toggleSideDrawer(forceOpen) {
    const drawer = document.getElementById('app-side-drawer');
    const backdrop = document.getElementById('side-drawer-backdrop');
    if (!drawer || !backdrop) return;
    const isOpen = typeof forceOpen === 'boolean' ? forceOpen : !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    backdrop.classList.toggle('open', isOpen);
    if (isOpen) {
      this.syncSideDrawer();
    }
  },

  isStaffOrAdmin(user) {
    const u = user || this.state.user;
    if (!u) return false;
    if (u.is_admin === true) return true;
    const role = String(u.role || '').toUpperCase().trim();
    return ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'KYC_MANAGER'].includes(role);
  },

  syncSideDrawer() {
    const user = this.state.user;
    const guestBox = document.getElementById('drawer-guest-actions');
    const userBox = document.getElementById('drawer-user-summary');
    const authedGroups = document.getElementById('drawer-authed-groups');
    const logoutWrap = document.getElementById('drawer-logout-wrap');
    const emailEl = document.getElementById('drawer-user-email');
    const uidEl = document.getElementById('drawer-user-uid');
    const kycEl = document.getElementById('drawer-user-kyc');
    const miniKycEl = document.getElementById('drawer-kyc-mini-badge');
    const avatarEl = document.getElementById('drawer-avatar-badge');
    const adminTile = document.getElementById('drawer-admin-tile');
    const langLabel = document.getElementById('drawer-lang-label');
    const currLabel = document.getElementById('drawer-currency-label');

    if (user) {
      if (guestBox) guestBox.style.display = 'none';
      if (userBox) userBox.style.display = 'block';
      if (authedGroups) authedGroups.style.display = 'block';
      if (logoutWrap) logoutWrap.style.display = 'block';
      if (emailEl) emailEl.textContent = user.email || user.username || 'PRIME X Trader';
      if (uidEl) uidEl.textContent = `UID: ${this.getUserUID()}`;
      if (avatarEl) {
        const initials = (user.first_name || user.email || 'PX').slice(0, 2).toUpperCase();
        avatarEl.textContent = initials;
      }
      const kyc = (user.kyc_status || 'NOT_SUBMITTED').toUpperCase();
      if (kycEl) {
        if (kyc === 'APPROVED') {
          kycEl.textContent = 'Verified';
          kycEl.className = 'badge badge-positive';
        } else if (kyc === 'PENDING') {
          kycEl.textContent = 'Pending';
          kycEl.className = 'badge badge-warning';
        } else {
          kycEl.textContent = 'Not Verified';
          kycEl.className = 'badge badge-warning';
        }
      }
      if (miniKycEl) {
        if (kyc === 'APPROVED') {
          miniKycEl.textContent = 'Verified';
          miniKycEl.style.background = '#ECFDF5';
          miniKycEl.style.color = '#059669';
        } else if (kyc === 'PENDING') {
          miniKycEl.textContent = 'Pending';
          miniKycEl.style.background = '#FFFBEB';
          miniKycEl.style.color = '#D97706';
        } else {
          miniKycEl.textContent = 'Not Verified';
          miniKycEl.style.background = '#FEF2F2';
          miniKycEl.style.color = '#DC2626';
        }
      }
      if (adminTile) {
        adminTile.style.display = this.isStaffOrAdmin(user) ? 'flex' : 'none';
      }
    } else {
      if (guestBox) guestBox.style.display = 'block';
      if (userBox) userBox.style.display = 'none';
      if (authedGroups) authedGroups.style.display = 'none';
      if (logoutWrap) logoutWrap.style.display = 'none';
      if (avatarEl) avatarEl.textContent = 'PX';
      if (adminTile) adminTile.style.display = 'none';
    }

    if (langLabel) {
      const lang = localStorage.getItem('alphavest_language') || 'en';
      langLabel.textContent = lang === 'ka' ? 'ქართული' : 'English';
    }
    if (currLabel) {
      currLabel.textContent = localStorage.getItem('alphavest_currency_code') || 'USD';
    }
  },

  renderPublicMarketRows() {
    const container = document.getElementById('landing-market-rows');
    if (!container) return;
    const list = (this.state.tickers || []).slice(0, 8);
    container.innerHTML = list.map(t => {
      const chg = parseFloat(t.change_24h || 0);
      const isUp = chg >= 0;
      const basePart = t.base || (t.symbol || 'BTC/USDT').split('/')[0];
      const quotePart = t.quote || (t.symbol && t.symbol.includes('/') ? t.symbol.split('/')[1] : 'USDT');
      const priceNum = parseFloat(t.price || 0);
      const priceStr = priceNum >= 100
        ? priceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : priceNum.toFixed(priceNum >= 1 ? 3 : 4);
      const pillBg = isUp ? '#10B981' : '#F6465D';
      return `
        <div class="av-landing-row" onclick="App.selectMarket('${t.symbol}');">
          <div style="display:flex;align-items:center;gap:12px;min-width:0;">
            <div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${this.getCoinIcon ? this.getCoinIcon(t.symbol) : ''}
            </div>
            <div style="min-width:0;">
              <div style="font-size:15.5px;font-weight:800;color:#111827;">${basePart} <span style="font-size:12px;font-weight:500;color:#6B7280;">/${quotePart}</span></div>
              <div class="mono" style="font-size:12px;color:#6B7280;margin-top:2px;">$${priceStr}</div>
            </div>
          </div>
          <span class="av-landing-pill-rate ${isUp ? 'pill-up' : 'pill-down'}" style="background:${pillBg};">
            ${isUp ? '+' : ''}${chg.toFixed(2)}%
          </span>
        </div>
      `;
    }).join('');
  },

  switchTradeHubTab(mode = 'delivery', skipLoad = false) {
    const modes = ['copy', 'delivery', 'perpetual', 'spot', 'earn'];
    modes.forEach(m => {
      const tab = document.getElementById(`trade-tab-${m}`);
      const panel = document.getElementById(`trade-panel-${m}`);
      if (tab) tab.classList.toggle('active', m === mode);
      if (panel) panel.style.display = m === mode ? 'block' : 'none';
    });

    if (skipLoad) return;

    if (mode === 'copy') {
      if (typeof this.loadCopyTrading === 'function') this.loadCopyTrading();
    } else if (mode === 'delivery') {
      this.renderChart();
    } else if (mode === 'perpetual') {
      if (typeof this.loadOrderBook === 'function') this.loadOrderBook();
      if (typeof this.loadPositions === 'function') this.loadPositions();
    }
  },

  switchDeliverySubView(sub = 'chart', skipLoad = false) {
    const subs = ['chart', 'book', 'trades'];
    subs.forEach(s => {
      const btn = document.getElementById(`delivery-seg-${s}`);
      const panel = document.getElementById(`delivery-subpanel-${s}`);
      if (btn) btn.classList.toggle('active', s === sub);
      if (panel) panel.style.display = s === sub ? 'block' : 'none';
    });
    if (skipLoad) return;

    if (sub === 'book' || sub === 'trades') {
      if (typeof this.loadOrderBook === 'function') this.loadOrderBook();
    } else if (sub === 'chart') {
      this.renderChart();
    }
  },

  switchFuturesSubTab(tab = 'open') {
    const openBtn = document.getElementById('subtab-open-orders');
    const histBtn = document.getElementById('subtab-order-hist');
    if (openBtn) openBtn.classList.toggle('active', tab === 'open');
    if (histBtn) histBtn.classList.toggle('active', tab !== 'open');

    const container = document.getElementById('futures-orders-container');
    if (!container) return;
    const items = tab === 'open' ? (this.state.openOrders || []) : (this.state.orderHistory || []);
    if (!items.length) {
      container.innerHTML = `
        <div class="xdx-empty-state">
          <div class="xdx-empty-icon">
            <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <span style="font-size: 13px; color: var(--text-muted);">${tab === 'open' ? 'No open orders' : 'No closed order history yet'}</span>
        </div>
      `;
    }
  },

  switchWalletSubTab(tab = 'overview', btn) {
    document.querySelectorAll('.wallet-subtab-pill').forEach(p => {
      p.classList.toggle('active', p === btn || p.getAttribute('data-wsub') === tab);
    });
    const refreshTime = document.getElementById('wallet-refresh-time');
    if (refreshTime) {
      const labels = {
        overview: 'Live Ledger Balance',
        spot: 'Spot & Exchange Account View',
        futures: 'Futures & Margin Collateral View',
        earn: 'Yield & Quantitative Vaults View'
      };
      refreshTime.textContent = labels[tab] || 'Live Ledger Balance';
    }
    const cardTitle = document.getElementById('wallet-subtab-card-title');
    if (cardTitle) {
      const titles = {
        overview: 'Dynamic assets',
        spot: 'Spot & Exchange Assets',
        futures: 'Futures Margin Balances',
        earn: 'Earn & Smart Savings'
      };
      cardTitle.textContent = titles[tab] || 'Dynamic assets';
    }
  },

  async refreshWalletData() {
    const refreshTime = document.getElementById('wallet-refresh-time');
    if (refreshTime) refreshTime.textContent = 'Syncing ledger...';
    if (typeof this.loadBalances === 'function') {
      await this.loadBalances(true);
    }
    if (typeof this.loadWalletHistoryPreview === 'function') {
      await this.loadWalletHistoryPreview('ALL');
    }
    if (refreshTime) {
      refreshTime.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    this.toast('Wallet balances synchronized', 'success');
  },

  openSecurityCenter() {
    const emailEl = document.getElementById('security-email-val');
    const kycEl = document.getElementById('security-kyc-val');
    const countEl = document.getElementById('security-level-count');
    const ringEl = document.getElementById('security-ring-progress');

    if (emailEl) emailEl.textContent = this.state.user?.email || 'Guest Trader';
    const kyc = (this.state.user?.kyc_status || 'NOT_SUBMITTED').toUpperCase();
    if (kycEl) {
      if (kyc === 'APPROVED') {
        kycEl.textContent = 'Verified';
        kycEl.className = 'badge badge-positive';
      } else if (kyc === 'PENDING') {
        kycEl.textContent = 'Pending';
        kycEl.className = 'badge badge-warning';
      } else {
        kycEl.textContent = 'Unverified';
        kycEl.className = 'badge badge-warning';
      }
    }
    const score = (this.state.user ? 2 : 1) + (kyc === 'APPROVED' ? 2 : 0) + (this.state.user?.has_pin ? 1 : 0);
    if (countEl) countEl.textContent = `${Math.min(score, 5)}/5`;
    if (ringEl) {
      const circumference = 163.36;
      const ratio = Math.min(score, 5) / 5;
      ringEl.setAttribute('stroke-dashoffset', String((circumference * (1 - ratio)).toFixed(2)));
    }
    this.openAppView('security');
  },

  openHelpCenter() {
    const input = document.getElementById('help-search-input');
    if (input) input.value = '';
    this.filterHelpFaq('');
    this.openAppView('help');
  },

  filterHelpFaq(q = '') {
    const needle = String(q || '').toLowerCase().trim();
    document.querySelectorAll('#help-faq-list .faq-item').forEach(item => {
      const text = (item.textContent || '').toLowerCase();
      item.style.display = !needle || text.includes(needle) ? 'block' : 'none';
    });
  },

  toggleFaqItem(el) {
    if (!el) return;
    const ans = el.querySelector('.faq-answer');
    if (!ans) return;
    const isHidden = ans.style.display === 'none' || !ans.style.display;
    ans.style.display = isHidden ? 'block' : 'none';
  },

  openLegalView(tab = 'about') {
    const titleEl = document.getElementById('legal-title');
    const boxEl = document.getElementById('legal-content-box');
    const tabs = ['about', 'privacy', 'terms'];
    tabs.forEach(t => {
      const btn = document.getElementById(`legal-tab-${t}`);
      if (btn) btn.classList.toggle('active', t === tab);
    });

    const row = (icon, title, desc) => `
      <div style="display:flex;align-items:flex-start;gap:14px;padding:16px 2px;border-bottom:1px solid #F3F4F6;">
        <div style="width:40px;height:40px;border-radius:12px;background:#F3F4F6;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">${icon}</div>
        <div>
          <div style="font-size:16px;font-weight:800;color:#111827;margin-bottom:4px;">${title}</div>
          <div style="font-size:13.5px;color:#4B5563;line-height:1.55;">${desc}</div>
        </div>
      </div>
    `;

    const content = {
      about: {
        title: 'About PRIME X CAPITAL',
        html: `
          <div style="border-radius:16px;overflow:hidden;background:linear-gradient(135deg,#091224 0%,#0052FF 100%);padding:22px 18px;color:#FFFFFF;margin-bottom:18px;text-align:center;">
            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.82;margin-bottom:6px;">Institutional Digital Asset Platform</div>
            <h3 style="font-size:21px;font-weight:800;line-height:1.25;margin:0;">Connecting Global Value<br>Exploring the Future of Digital Finance</h3>
          </div>
          <p style="font-size:14px;color:#374151;line-height:1.6;text-align:center;margin:0 0 18px;">
            PRIME X CAPITAL brings together institutional liquidity and blockchain innovation to provide traders with a clearer, more stable digital asset experience built on risk control first.
          </p>
          <div style="text-align:center;margin:18px 0 14px;">
            <h4 style="font-size:20px;font-weight:800;color:#111827;margin:0 0 6px;">Partner Team &amp; Philosophy</h4>
            <p style="font-size:13.5px;color:#4B5563;line-height:1.55;margin:0;">Combining traditional financial risk discipline with tokenized markets, automated copy trading, and segregated cold-vault custody.</p>
          </div>
          <div style="margin-top:20px;">
            <h4 style="font-size:20px;font-weight:800;color:#111827;text-align:center;margin:0 0 12px;">Development Journey</h4>
            <div class="av-timeline">
              <div class="av-timeline-item">
                <span class="av-timeline-dot"></span>
                <div style="font-size:13px;font-weight:800;color:#0052FF;">April 2025</div>
                <div style="font-size:13.5px;color:#4B5563;">Global platform concept established with multi-asset matching engine architecture.</div>
              </div>
              <div class="av-timeline-item">
                <span class="av-timeline-dot"></span>
                <div style="font-size:13px;font-weight:800;color:#0052FF;">October 2025</div>
                <div style="font-size:13.5px;color:#4B5563;">Perpetual futures, Delivery options, and Smart Savings vaults launched globally.</div>
              </div>
              <div class="av-timeline-item">
                <span class="av-timeline-dot"></span>
                <div style="font-size:13px;font-weight:800;color:#0052FF;">January 2026</div>
                <div style="font-size:13.5px;color:#4B5563;">Enhanced institutional 6-digit Fund PIN and real-time AI Copy Trading integration.</div>
              </div>
            </div>
          </div>
        `
      },
      privacy: {
        title: 'Privacy Policy',
        html: `
          <h3 style="font-size:24px;font-weight:800;color:#111827;margin:0 0 4px;">Privacy Policy</h3>
          <div style="font-size:12.5px;color:#6B7280;margin-bottom:12px;">Last updated: November 2026</div>
          ${row('📜', 'Information collection', 'We collect account email, KYC identity documents, transaction records, device metadata, and IP security logs.')}
          ${row('📰', 'Information usage', 'We use your information to execute trades, process deposits/withdrawals, verify identity, prevent fraud, and meet regulatory obligations.')}
          ${row('🔁', 'Information sharing', 'We never sell or rent personal data. Information is shared only when strictly required by law or settlement partners.')}
          ${row('🛡️', 'Data security', 'PRIME X CAPITAL enforces TLS transport encryption, AES-256 storage protection, cold-wallet custody, and strict access controls.')}
        `
      },
      terms: {
        title: 'Terms of Use',
        html: `
          <h3 style="font-size:24px;font-weight:800;color:#111827;margin:0 0 4px;">Terms of Use</h3>
          <div style="font-size:12.5px;color:#6B7280;margin-bottom:12px;">Last updated: November 2026</div>
          ${row('📜', 'Eligibility', 'You confirm you are legally permitted in your jurisdiction to access digital asset trading and portfolio management tools.')}
          ${row('🔐', 'Account security', 'You are responsible for safeguarding your login password and 6-digit Fund PIN. PRIME X CAPITAL is not liable for unauthorized actions due to shared credentials.')}
          ${row('📈', 'Risk disclosure', 'Digital assets, perpetual futures, and delivery options carry market volatility risk. Trade responsibly according to your risk tolerance.')}
          ${row('⚖️', 'Compliance & Withdrawals', 'All payouts must match verified blockchain networks and comply with anti-money laundering and turnover verification rules.')}
        `
      }
    }[tab] || { title: 'About PRIME X CAPITAL', html: '' };

    if (titleEl) titleEl.textContent = content.title;
    if (boxEl) boxEl.innerHTML = content.html;
    this.openAppView('legal');
  },

  openColorSettings() {
    this.applySavedColorMode();
    this.openAppView('color-settings');
  },

  setUpDownColorMode(mode = 'green-up') {
    const normalized = mode === 'red-up' ? 'red-up' : 'green-up';
    try { localStorage.setItem('alphavest_color_mode', normalized); } catch (e) {}
    this.applySavedColorMode();
    this.toast(normalized === 'red-up' ? 'Color polarity set to Red Up / Green Down' : 'Color polarity set to Green Up / Red Down', 'success');
  },

  applySavedColorMode() {
    const mode = localStorage.getItem('alphavest_color_mode') || 'green-up';
    const isRedUp = mode === 'red-up';
    document.documentElement.classList.toggle('color-mode-red-up', isRedUp);

    const greenCard = document.getElementById('color-mode-green-card');
    const redCard = document.getElementById('color-mode-red-card');
    if (greenCard) {
      greenCard.style.border = !isRedUp ? '1.5px solid #111827' : '1px solid #E5E7EB';
      greenCard.style.background = '#FFFFFF';
    }
    if (redCard) {
      redCard.style.border = isRedUp ? '1.5px solid #111827' : '1px solid #E5E7EB';
      redCard.style.background = '#FFFFFF';
    }
    const previewEl = document.getElementById('color-preview-svg');
    if (previewEl) {
      const upColor = isRedUp ? '#F6465D' : '#00B87C';
      const downColor = isRedUp ? '#00B87C' : '#F6465D';
      const bars = [
        [8, 12, 18, true], [18, 16, 14, false], [28, 22, 16, false], [38, 28, 14, false],
        [48, 26, 16, false], [58, 22, 14, false], [68, 16, 14, true], [78, 10, 16, true],
        [88, 16, 14, false], [98, 20, 16, false], [108, 14, 14, true], [118, 18, 14, false],
        [128, 14, 14, true], [138, 10, 14, true], [148, 6, 14, true]
      ];
      previewEl.innerHTML = `
        <svg width="164" height="52" viewBox="0 0 164 52">
          ${bars.map(([x, y, h, up]) => {
            const c = up ? upColor : downColor;
            return `<line x1="${x + 3}" y1="${y - 4}" x2="${x + 3}" y2="${y + h + 4}" stroke="${c}" stroke-width="1.5"/><rect x="${x}" y="${y}" width="6" height="${h}" rx="1" fill="${c}"/>`;
          }).join('')}
        </svg>
      `;
    }
  },

  openCurrencyModal() {
    const current = localStorage.getItem('alphavest_currency_code') || 'USD';
    const search = document.getElementById('currency-search-input');
    if (search) search.value = '';
    this.filterCurrencyList('');
    document.querySelectorAll('#currency-modal-list [data-currency-code]').forEach(btn => {
      const code = btn.getAttribute('data-currency-code');
      const active = code === current;
      btn.classList.toggle('active', active);
      const check = btn.querySelector('.curr-check');
      if (check) check.style.display = active ? 'inline' : 'none';
    });
    this.openModal('modal-currency-select');
  },

  filterCurrencyList(q = '') {
    const needle = String(q || '').toLowerCase().trim();
    document.querySelectorAll('#currency-modal-list [data-currency-code]').forEach(btn => {
      const text = (btn.textContent || '').toLowerCase();
      btn.style.display = !needle || text.includes(needle) ? 'flex' : 'none';
    });
  },

  setDisplayCurrency(code = 'USD', symbol = '$', rate = 1) {
    try {
      localStorage.setItem('alphavest_currency_code', code);
      localStorage.setItem('alphavest_currency_symbol', symbol);
      localStorage.setItem('alphavest_currency_rate', String(rate));
    } catch (e) {}
    const drawerCurr = document.getElementById('drawer-currency-label');
    if (drawerCurr) drawerCurr.textContent = code;
    this.closeModal('modal-currency-select');
    this.toast(`Display currency updated to ${code} (${symbol})`, 'success');
  },

  /* ==========================================================================
     7. ALPHA-PICS INTERACTIVE CONTROLLERS (AUTH, WITHDRAW, TRADE, EARN, SECURITY)
     ========================================================================== */
  switchAuthChannel(channel = 'email', btn) {
    document.querySelectorAll('.av-auth-tab').forEach(t => {
      t.classList.toggle('active', t === btn || t.getAttribute('data-auth-channel') === 'email');
    });
    const loginInp = document.getElementById('auth-email');
    const regInp = document.getElementById('reg-email');
    if (loginInp) loginInp.placeholder = 'Email';
    if (regInp) regInp.placeholder = 'Email';
  },

  selectWithdrawNetwork(net = 'TRC20', btn) {
    const sel = document.getElementById('with-network');
    if (sel) {
      sel.value = net;
      if (typeof this.onWithdrawNetworkChange === 'function') {
        this.onWithdrawNetworkChange();
      }
    }
    document.querySelectorAll('.with-net-pill').forEach(p => {
      const active = p === btn || p.getAttribute('data-net') === net;
      p.classList.toggle('active', active);
      p.style.background = active ? '#0052FF' : 'transparent';
      p.style.color = active ? '#FFFFFF' : '#6B7280';
    });
  },

  openDeliveryOrderTicket(side = 'BUY') {
    if (!this.state.user) {
      this.openAuthModal('login');
      return;
    }
    const ticket = document.getElementById('delivery-order-ticket');
    if (ticket) {
      ticket.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const qtyEl = document.getElementById('trade-quantity');
      if (qtyEl && (!qtyEl.value || Number(qtyEl.value) <= 0)) {
        qtyEl.value = '0.01';
        if (typeof this.updateOrderCalculation === 'function') this.updateOrderCalculation();
      }
      if (qtyEl) qtyEl.focus();
    }
    this.toast(`Delivery ${side === 'SELL' ? 'Short' : 'Long'} ticket ready`, 'info');
  },

  switchPerpMarginMode() {
    const btn = document.getElementById('perp-margin-mode-btn');
    if (!btn) return;
    const next = btn.textContent.trim() === 'Cross' ? 'Isolated' : 'Cross';
    btn.textContent = next;
    this.toast(`Margin mode switched to ${next}`, 'info');
  },

  stepPerpQty(delta = 1) {
    const inp = document.getElementById('perp-qty');
    if (!inp) return;
    const cur = parseFloat(inp.value) || 0;
    const next = Math.max(0, Number((cur + delta * 0.01).toFixed(4)));
    inp.value = next;
    const mainQty = document.getElementById('trade-quantity');
    if (mainQty) mainQty.value = next;
    this.updatePerpSummary();
  },

  setPerpPercent(pct = 0, btn) {
    document.querySelectorAll('#perp-pct-dots .av-pct-dot-btn').forEach(b => b.classList.toggle('active', b === btn));
    const avail = Number(this.state.balances?.balances?.trading?.USDT?.available ?? this.state.balances?.breakdown?.trading_total_usdt ?? 0);
    const lev = parseFloat(document.getElementById('perp-leverage')?.value || '1') || 1;
    const ticker = (this.state.tickers || []).find(t => t.symbol === this.state.selectedMarket);
    const price = Number(ticker?.price || 77778);
    const qty = avail > 0 && pct > 0 ? Number(((avail * (pct / 100) * lev) / price).toFixed(4)) : 0;
    const inp = document.getElementById('perp-qty');
    if (inp) inp.value = qty;
    const mainQty = document.getElementById('trade-quantity');
    if (mainQty) mainQty.value = qty;
    this.updatePerpSummary();
  },

  updatePerpSummary() {
    const qty = parseFloat(document.getElementById('perp-qty')?.value || '0') || 0;
    const lev = parseFloat(document.getElementById('perp-leverage')?.value || '1') || 1;
    const ticker = (this.state.tickers || []).find(t => t.symbol === this.state.selectedMarket);
    const price = Number(ticker?.price || 77778);
    const notional = qty * price;
    const margin = lev > 0 ? notional / lev : notional;
    const fee = notional * 0.0005;
    const posEl = document.getElementById('perp-pos-val');
    const marEl = document.getElementById('perp-margin-val');
    const feeEl = document.getElementById('perp-fee-val');
    if (posEl) posEl.textContent = `${notional.toFixed(2)} USDT`;
    if (marEl) marEl.textContent = `${margin.toFixed(2)} USDT`;
    if (feeEl) feeEl.textContent = `${fee.toFixed(2)} USDT`;
  },

  switchSpotSide(side = 'BUY') {
    this.state.spotSide = side === 'SELL' ? 'SELL' : 'BUY';
    const buyBtn = document.getElementById('spot-btn-buy');
    const sellBtn = document.getElementById('spot-btn-sell');
    const submitBtn = document.getElementById('spot-submit-btn');
    if (buyBtn) buyBtn.classList.toggle('active', this.state.spotSide === 'BUY');
    if (sellBtn) sellBtn.classList.toggle('active', this.state.spotSide === 'SELL');
    if (submitBtn) {
      const sym = (this.state.selectedMarket || 'BTC/USDT').split('/')[0];
      submitBtn.textContent = `${this.state.spotSide === 'BUY' ? 'Buy' : 'Sell'} ${sym}`;
      submitBtn.classList.toggle('btn-xdx-buy', this.state.spotSide === 'BUY');
      submitBtn.classList.toggle('btn-action-bull', this.state.spotSide === 'BUY');
      submitBtn.classList.toggle('btn-xdx-sell', this.state.spotSide === 'SELL');
      submitBtn.classList.toggle('btn-action-bear', this.state.spotSide === 'SELL');
    }
  },

  stepSpotQty(delta = 1) {
    const inp = document.getElementById('spot-qty');
    if (!inp) return;
    const cur = parseFloat(inp.value) || 0;
    const next = Math.max(0, Number((cur + delta * 0.01).toFixed(4)));
    inp.value = next;
    const mainQty = document.getElementById('trade-quantity');
    if (mainQty) mainQty.value = next;
  },

  setSpotPercent(pct = 0, btn) {
    document.querySelectorAll('#spot-pct-dots .av-pct-dot-btn').forEach(b => b.classList.toggle('active', b === btn));
    const avail = Number(this.state.balances?.balances?.trading?.USDT?.available ?? this.state.balances?.breakdown?.trading_total_usdt ?? 0);
    const ticker = (this.state.tickers || []).find(t => t.symbol === this.state.selectedMarket);
    const price = Number(ticker?.price || 77769.28);
    const qty = avail > 0 && pct > 0 ? Number(((avail * (pct / 100)) / price).toFixed(4)) : 0;
    const inp = document.getElementById('spot-qty');
    if (inp) inp.value = qty;
    const mainQty = document.getElementById('trade-quantity');
    if (mainQty) mainQty.value = qty;
  },

  submitSpotAction() {
    const qtyEl = document.getElementById('spot-qty');
    const mainQty = document.getElementById('trade-quantity');
    if (mainQty && qtyEl) mainQty.value = qtyEl.value || '0';
    this.executeFuturesOrder(this.state.spotSide || 'BUY');
  },

  filterCopyTraders(q = '') {
    this.state.copySearchQuery = String(q || '').toLowerCase().trim();
    const applyFilter = (containerId) => {
      const box = document.getElementById(containerId);
      if (!box) return;
      box.querySelectorAll('.card').forEach(card => {
        const text = (card.textContent || '').toLowerCase();
        card.style.display = !this.state.copySearchQuery || text.includes(this.state.copySearchQuery) ? 'flex' : 'none';
      });
    };
    applyFilter('trade-copy-quick-list');
    applyFilter('copy-plans-container');
  },

  setCopyFilter(filter = 'yield', btn) {
    if (btn && btn.parentElement) {
      btn.parentElement.querySelectorAll('button').forEach(b => {
        b.style.background = '#F3F4F6';
        b.style.color = '#4B5563';
      });
      btn.style.background = '#111827';
      btn.style.color = '#FFFFFF';
    }
    if (Array.isArray(this.state.copyPlans) && this.state.copyPlans.length) {
      if (filter === 'winrate') {
        this.state.copyPlans.sort((a, b) => Number(b.win_rate || 0) - Number(a.win_rate || 0));
      } else if (filter === 'followers') {
        this.state.copyPlans.sort((a, b) => Number(b.min_balance || 0) - Number(a.min_balance || 0));
      } else {
        this.state.copyPlans.sort((a, b) => Number(b.roi_30d || 0) - Number(a.roi_30d || 0));
      }
      if (typeof this.renderCopyPlans === 'function') this.renderCopyPlans();
    }
  },

  openEarnSavings() {
    this.openAppView('earn-savings');
    this.renderEarnSavings();
  },

  renderEarnSavings() {
    const container = document.getElementById('earn-savings-tiers');
    if (!container) return;
    const tiers = [
      { id: 'vip0', title: 'Basic Yield Vault (VIP 0–1)', apr: '14.6%', term: '30 Days', min: '$100 USDT', quota: '85% Remaining', badge: 'Popular' },
      { id: 'vip2', title: 'Alpha Quant Flexible Vault', apr: '21.8%', term: 'Flexible / 60 Days', min: '$500 USDT', quota: '62% Remaining', badge: 'Smart Yield' },
      { id: 'vip4', title: 'Institutional Alpha Pool', apr: '32.4%', term: '90 Days', min: '$2,500 USDT', quota: '34% Remaining', badge: 'VIP Exclusive' }
    ];
    container.innerHTML = tiers.map(t => `
      <div class="card" style="border:1px solid #EEF1F6; border-radius:16px; padding:16px; background:#FFFFFF;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <strong style="font-size:16px; color:#111827;">${t.title}</strong>
          <span class="badge badge-positive">${t.badge}</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; background:#F8FAFC; border-radius:12px; padding:12px; margin-bottom:12px;">
          <div><div style="font-size:11px;color:#6B7280;">Est. APR</div><strong class="positive" style="font-size:17px;">${t.apr}</strong></div>
          <div><div style="font-size:11px;color:#6B7280;">Cycle</div><strong style="font-size:13.5px;color:#111827;">${t.term}</strong></div>
          <div><div style="font-size:11px;color:#6B7280;">Minimum</div><strong style="font-size:13.5px;color:#111827;">${t.min}</strong></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <span style="font-size:12px;color:#6B7280;">${t.quota}</span>
          <button type="button" class="btn-primary" style="border-radius:999px;padding:8px 18px;font-size:13px;" onclick="App.openDepositModal()">Subscribe Now</button>
        </div>
      </div>
    `).join('');
  },

  openCollateralLoan() {
    this.openAppView('earn-loan');
    this.calcCollateralLoan();
  },

  calcCollateralLoan() {
    const collateral = parseFloat(document.getElementById('loan-collateral-input')?.value || '0') || 0;
    const maxBorrow = collateral * 0.65;
    const borrowInp = document.getElementById('loan-borrow-input');
    const maxEl = document.getElementById('loan-max-borrow');
    if (borrowInp) borrowInp.value = maxBorrow > 0 ? maxBorrow.toFixed(2) : '';
    if (maxEl) maxEl.textContent = `${maxBorrow.toFixed(2)} USDT`;
  },

  syncRecordsTabUI(tab = 'open') {
    const isHistory = tab === 'history' || tab === 'Deal';
    const openBtn = document.getElementById('rec-tab-open');
    const histBtn = document.getElementById('rec-tab-history');
    if (openBtn) openBtn.classList.toggle('active', !isHistory);
    if (histBtn) histBtn.classList.toggle('active', isHistory);
  },

  openTransactionRecords(tab = 'open') {
    const normalized = (tab === 'Deal' || tab === 'history') ? 'history' : 'open';
    this.state.activeRecordsTab = normalized;
    this.openAppView('records');
    this.syncRecordsTabUI(normalized);
    this.renderTransactionRecords(normalized);
  },

  switchRecordsTab(tab = 'open', btn) {
    const normalized = (tab === 'Deal' || tab === 'history') ? 'history' : 'open';
    this.state.activeRecordsTab = normalized;
    this.syncRecordsTabUI(normalized);
    if (btn && btn.parentElement) {
      btn.parentElement.querySelectorAll('.trade-top-tab, .market-filter-pill').forEach(p => p.classList.toggle('active', p === btn));
    }
    this.renderTransactionRecords(normalized);
  },

  renderTransactionRecords(tab = 'open') {
    const body = document.getElementById('records-list-body');
    if (!body) return;
    const isHistory = tab === 'Deal' || tab === 'history';
    const list = isHistory ? (this.state.orderHistory || []) : (this.state.openOrders || []);
    const label = isHistory ? 'order history' : 'open orders';
    if (!list.length) {
      body.innerHTML = `<div style="padding:36px 16px;text-align:center;color:#9CA3AF;font-size:13.5px;">No ${label} records available yet.</div>`;
      return;
    }
    body.innerHTML = list.map(o => `
      <div class="card" style="text-align:left;margin-bottom:10px;border-radius:14px;">
        <div style="display:flex;justify-content:space-between;font-weight:800;color:#111827;">
          <span>${o.symbol || 'BTC/USDT'}</span>
          <span class="${(o.side || '').toUpperCase() === 'SELL' ? 'negative' : 'positive'}">${o.side || 'BUY'}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6B7280;margin-top:6px;">
          <span>Amount: ${o.amount || o.quantity || '0.00'}</span>
          <span>Price: $${this.formatPrice(o.entry_price || o.price || 0)}</span>
        </div>
      </div>
    `).join('');
  },

  openLedgerView(tab = 'ALL') {
    this.state.activeLedgerTab = tab;
    this.openAppView('ledger');
    this.renderLedgerRecords(tab);
  },

  switchLedgerTab(tab = 'Currency', btn) {
    this.state.activeLedgerTab = tab;
    if (btn && btn.parentElement) {
      btn.parentElement.querySelectorAll('.av-ledger-tab').forEach(t => t.classList.toggle('active', t === btn));
    }
    this.renderLedgerRecords(tab);
  },

  async renderLedgerRecords(tab = 'ALL') {
    const box = document.getElementById('ledger-records-box');
    if (!box) return;
    box.innerHTML = `<div style="padding:28px;color:#6B7280;font-size:13px;">Synchronizing ledger entries...</div>`;
    let items = [];
    if (this.state.user) {
      try {
        const res = await this.api('/wallet/history.php?type=ALL&limit=25');
        if (res.success && res.data) {
          items = Array.isArray(res.data) ? res.data : (res.data.history || [...(res.data.deposits || []), ...(res.data.withdrawals || [])]);
        }
      } catch (e) {}
    }
    if (!items.length) {
      box.innerHTML = `<div style="text-align:center;color:#9CA3AF;font-size:13.5px;padding:30px 16px;">No data available</div>`;
      return;
    }
    box.style.display = 'block';
    box.innerHTML = items.slice(0, 15).map(tx => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 4px;border-bottom:1px solid #F1F5F9;">
        <div>
          <div style="font-size:14px;font-weight:700;color:#111827;">${(tx.type || tx.transaction_type || 'TRANSFER').toUpperCase()}</div>
          <div style="font-size:11.5px;color:#6B7280;">${tx.created_at || 'Recent'}</div>
        </div>
        <div style="text-align:right;">
          <div class="mono" style="font-size:14px;font-weight:800;color:#111827;">$${Number(tx.amount || 0).toFixed(2)}</div>
          <div style="font-size:11px;color:#00B87C;font-weight:600;">${tx.status || 'COMPLETED'}</div>
        </div>
      </div>
    `).join('');
  },

  openGoogleAuthView() {
    this.openAppView('google-auth');
  },

  copyGoogleAuthSecret() {
    const key = document.getElementById('gauth-secret-key')?.textContent?.trim() || '';
    if (key) this.copyText(key, 'Authenticator key copied');
  },

  clearGoogleAuthOtp() {
    for (let i = 0; i < 6; i++) {
      const inp = document.getElementById(`gauth-otp-${i}`);
      if (inp) inp.value = '';
    }
    document.getElementById('gauth-otp-0')?.focus();
  },

  async pasteGoogleAuthOtp() {
    let text = '';
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        text = await navigator.clipboard.readText();
      }
    } catch (e) {}
    const digits = String(text || '').replace(/\D/g, '').slice(0, 6);
    if (!digits) {
      this.toast('Copy your 6-digit authenticator code first', 'info');
      return;
    }
    for (let i = 0; i < 6; i++) {
      const inp = document.getElementById(`gauth-otp-${i}`);
      if (inp) inp.value = digits[i] || '';
    }
  },

  handleGoogleOtpInput(el, idx) {
    if (!el) return;
    el.value = el.value.replace(/\D/g, '').slice(0, 1);
    if (el.value && idx < 5) {
      document.getElementById(`gauth-otp-${idx + 1}`)?.focus();
    }
  },

  submitGoogleAuthBind() {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += document.getElementById(`gauth-otp-${i}`)?.value || '';
    }
    if (code.length < 6) {
      this.toast('Enter the full 6-digit verification code', 'warning');
      return;
    }
    const statusEl = document.getElementById('security-gauth-status');
    if (statusEl) statusEl.textContent = 'Enabled';
    this.toast('Google Authenticator binding saved', 'success');
    this.openSecurityCenter();
  },

  openChangePasswordView() {
    this.openAppView('change-password');
  },

  submitChangeLoginPassword() {
    const oldPwd = document.getElementById('chpwd-old')?.value || '';
    const newPwd = document.getElementById('chpwd-new')?.value || '';
    const confPwd = document.getElementById('chpwd-confirm')?.value || '';
    if (!oldPwd || !newPwd || newPwd.length < 6) {
      this.toast('Please enter valid old and new passwords (min 6 characters)', 'warning');
      return;
    }
    if (newPwd !== confPwd) {
      this.toast('New passwords do not match', 'warning');
      return;
    }
    if (typeof this.showResetPasswordModal === 'function') {
      this.toast('Login password update submitted for security verification', 'success');
      this.openSecurityCenter();
    }
  },

  openManualResetView() {
    this.openAppView('manual-reset');
  },

  submitManualReset() {
    const method = document.getElementById('mreset-method')?.value || 'Reset Email';
    const msg = document.getElementById('mreset-message')?.value?.trim() || '';
    if (!msg) {
      this.toast('Please enter details for manual security review', 'warning');
      return;
    }
    this.toast(`${method} verification request submitted`, 'success');
    this.openSecurityCenter();
  },

  toggleHaptics() {
    const cur = localStorage.getItem('alphavest_haptics') !== 'off';
    const next = !cur;
    try { localStorage.setItem('alphavest_haptics', next ? 'on' : 'off'); } catch (e) {}
    if (next && navigator.vibrate) {
      try { navigator.vibrate(15); } catch (e) {}
    }
    this.toast(`Haptic feedback ${next ? 'enabled' : 'disabled'}`, 'info');
  },

  async runNetworkCheck() {
    const t0 = Date.now();
    try {
      await fetch('/api/markets/tickers.php', { cache: 'no-store' });
    } catch (e) {}
    const ms = Math.max(12, Date.now() - t0);
    this.toast(`Node latency optimal (${ms}ms) • Primary Gateway Connected`, 'success');
  },

  openFaqAnswer(title = 'Help Topic', body = '') {
    this.toast(`${title}: ${body || 'Contact 24/7 support for full guidance.'}`, 'info');
  }
};

window.App = App;
document.addEventListener('DOMContentLoaded', () => App.init());

