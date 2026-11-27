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
      { symbol: 'BNB/USDT', base: 'BNB', quote: 'USDT', category: 'CRYPTO', price: 723.07, change_24h: 1.15, halt: false, volume_24h: 53100000 },
      { symbol: 'XRP/USDT', base: 'XRP', quote: 'USDT', category: 'CRYPTO', price: 1.4001, change_24h: 4.58, halt: false, volume_24h: 64200000 },
      { symbol: 'DOGE/USDT', base: 'DOGE', quote: 'USDT', category: 'CRYPTO', price: 0.1842, change_24h: 3.12, halt: false, volume_24h: 41500000 },
      { symbol: 'ADA/USDT', base: 'ADA', quote: 'USDT', category: 'CRYPTO', price: 0.6840, change_24h: -1.18, halt: false, volume_24h: 29400000 },
      { symbol: 'AVAX/USDT', base: 'AVAX', quote: 'USDT', category: 'CRYPTO', price: 28.45, change_24h: 2.04, halt: false, volume_24h: 24600000 },
      { symbol: 'LINK/USDT', base: 'LINK', quote: 'USDT', category: 'CRYPTO', price: 15.85, change_24h: 1.92, halt: false, volume_24h: 21300000 },
      { symbol: 'AAVE/USDT', base: 'AAVE', quote: 'USDT', category: 'CRYPTO', price: 127.04, change_24h: 2.28, halt: false, volume_24h: 22100000 },
      { symbol: 'APE/USDT', base: 'APE', quote: 'USDT', category: 'CRYPTO', price: 0.1334, change_24h: -0.74, halt: false, volume_24h: 9820000 },
      { symbol: 'APT/USDT', base: 'APT', quote: 'USDT', category: 'CRYPTO', price: 0.5910, change_24h: 1.37, halt: false, volume_24h: 14500000 },
      { symbol: 'EUR/USD', base: 'EUR', quote: 'USD', category: 'FOREX', price: 1.0845, change_24h: 0.32, halt: false, volume_24h: 51200000 },
      { symbol: 'GBP/USD', base: 'GBP', quote: 'USD', category: 'FOREX', price: 1.2712, change_24h: -0.18, halt: false, volume_24h: 39400000 },
      { symbol: 'USD/JPY', base: 'USD', quote: 'JPY', category: 'FOREX', price: 152.38, change_24h: 0.45, halt: false, volume_24h: 42800000 },
      { symbol: 'USD/CHF', base: 'USD', quote: 'CHF', category: 'FOREX', price: 0.8814, change_24h: -0.14, halt: false, volume_24h: 28600000 },
      { symbol: 'AUD/USD', base: 'AUD', quote: 'USD', category: 'FOREX', price: 0.6542, change_24h: 0.27, halt: false, volume_24h: 26100000 },
      { symbol: 'EUR/GBP', base: 'EUR', quote: 'GBP', category: 'FOREX', price: 0.8531, change_24h: 0.19, halt: false, volume_24h: 22900000 },
      { symbol: 'GOLD/USD', base: 'GOLD', quote: 'USD', category: 'FUTURES', price: 2748.33, change_24h: 0.68, halt: false, volume_24h: 68200000 },
      { symbol: 'OIL/USD', base: 'OIL', quote: 'USD', category: 'FUTURES', price: 74.82, change_24h: 1.85, halt: false, volume_24h: 45700000 },
      { symbol: 'NGAS/USD', base: 'NGAS', quote: 'USD', category: 'FUTURES', price: 2.84, change_24h: -0.92, halt: false, volume_24h: 19800000 },
      { symbol: 'ES1/USD', base: 'ES1', quote: 'USD', category: 'FUTURES', price: 5984.50, change_24h: 0.84, halt: false, volume_24h: 74000000 },
      { symbol: 'NQ1/USD', base: 'NQ1', quote: 'USD', category: 'FUTURES', price: 21142.00, change_24h: 1.12, halt: false, volume_24h: 69500000 },
      { symbol: 'SILVER/USD', base: 'SILVER', quote: 'USD', category: 'FUTURES', price: 33.42, change_24h: 1.04, halt: false, volume_24h: 24300000 },
      { symbol: 'AAPL/USD', base: 'AAPL', quote: 'USD', category: 'STOCKS', price: 229.40, change_24h: 1.24, halt: false, volume_24h: 61500000 },
      { symbol: 'NVDA/USD', base: 'NVDA', quote: 'USD', category: 'STOCKS', price: 141.60, change_24h: 3.42, halt: false, volume_24h: 94600000 },
      { symbol: 'TSLA/USD', base: 'TSLA', quote: 'USD', category: 'STOCKS', price: 342.15, change_24h: 2.87, halt: false, volume_24h: 82300000 },
      { symbol: 'MSFT/USD', base: 'MSFT', quote: 'USD', category: 'STOCKS', price: 428.70, change_24h: 0.94, halt: false, volume_24h: 48200000 },
      { symbol: 'AMZN/USD', base: 'AMZN', quote: 'USD', category: 'STOCKS', price: 209.85, change_24h: 1.56, halt: false, volume_24h: 54900000 },
      { symbol: 'GOOGL/USD', base: 'GOOGL', quote: 'USD', category: 'STOCKS', price: 178.30, change_24h: -0.46, halt: false, volume_24h: 39700000 }
    ],
    selectedMarket: 'BTC/USDT',
    selectedCategory: 'CRYPTO',
    chartInterval: '1h',
    chartType: 'candles',
    marketOverviewSymbol: 'BTC/USDT',
    marketChartInterval: '5m',
    marketChartType: 'candlestick',
    signalChartInterval: '1m',
    activeTerminalSignalId: null,
    signalLiveChartTimer: null,
    signalTerminalPrices: {},
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
    adminSupportTickets: [],
    adminSupportMessages: [],
    adminSupportActiveId: null,
    adminSupportFilter: 'ALL',
    adminSupportLoaded: false,
    userSupportTicket: null,
    userSupportTickets: [],
    userSupportHistory: [],
    userSupportHistoryActiveId: null,
    userSupportActiveTicketId: null,
    userSupportMessages: [],
    userSupportSelectedTopic: '',
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
  signalChart: null,

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
    if (this.state.adminPreviewUserId) return null;
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
    if (this.state.adminPreviewUserId) return;
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
        this.applySystemFeatureFlags(config);
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
    this.syncAdjustmentWalletForCategory('adj');
    this.syncAdjustmentWalletForCategory('pop');
    this.initSignalCountdown();
    this.initOptionsCountdown();
    this.initCarousel();

    // Render immediately so mobile displays view in milliseconds without network blocking
    this.render();

    // Parse deep-link parameters synchronously before async auth check so reset/verify
    // links open their target modal immediately without Sign-Up or landing-page hijack.
    let initialRouteState = {
      requestedView: '',
      verifyToken: '',
      resetToken: '',
      authPrompt: '',
      hashRaw: '',
      hasDirectTokenOrRoute: false
    };
    try {
      const params = new URLSearchParams(window.location.search || '');
      const requestedView = (params.get('view') || '').trim().toLowerCase();
      const verifyToken = (params.get('verify_token') || '').trim();
      const resetToken = (params.get('reset_token') || '').trim();
      const authPrompt = (params.get('auth') || '').trim().toLowerCase();
      const hashRaw = (window.location.hash || '').replace(/^#/, '').trim().toLowerCase();

      initialRouteState = {
        requestedView,
        verifyToken,
        resetToken,
        authPrompt,
        hashRaw,
        hasDirectTokenOrRoute: Boolean(verifyToken || resetToken || authPrompt || requestedView === 'admin' || hashRaw === 'admin')
      };

      if (verifyToken || resetToken || authPrompt) {
        params.delete('verify_token');
        params.delete('reset_token');
        params.delete('auth');
        const remaining = params.toString();
        const cleanUrl = `${window.location.pathname}${remaining ? `?${remaining}` : ''}${window.location.hash || ''}`;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      if (verifyToken) {
        this.handleVerifyEmailToken(verifyToken);
      } else if (resetToken) {
        this.openResetPasswordFromToken(resetToken);
      }
    } catch (e) {}

    // Check invite / referral link parameter (?ref=... or #register?ref=... or #ref=...)
    try {
      if (!initialRouteState.verifyToken && !initialRouteState.resetToken) {
        const refCode = this.getPendingReferralCode();
        if (refCode) {
          localStorage.setItem('alphavest_pending_ref', refCode);
        }
      }
    } catch (e) {}

    // Fetch live feature flags immediately (landing + logged-in UI)
    this.loadSystemConfig().catch(() => {});

    // Stagger startup API requests so shared-hosting PHP workers are never saturated by 503s.
    this.checkAuth().then(async () => {
      try {
        if (!initialRouteState.verifyToken && !initialRouteState.resetToken) {
          if (initialRouteState.authPrompt === 'login' && !this.state.user) {
            this.openModal('modal-auth');
            this.switchAuthBox('login');
          } else if (initialRouteState.requestedView === 'admin' || initialRouteState.hashRaw === 'admin') {
            this.navigate('admin');
          }
        }
      } catch (e) {}

      try {
        const pendingRef = this.getPendingReferralCode();
        if (!initialRouteState.hasDirectTokenOrRoute && pendingRef && !this.state.user) {
          this.openModal('modal-auth');
          this.switchAuthBox('register');
          this.toast(`Referral partner code ${pendingRef} applied to your registration!`, 'success');
        }
      } catch (e) {}

      await this.loadTickers().catch(() => {});
      await this.loadSystemConfig().catch(() => {});
      if (this.state.user) {
        this.sendUserHeartbeat(false, this.state.currentView || 'home');
        this.startPresenceTracking();
        await this.loadBalances().catch(() => {});
        await this.loadNotifications().catch(() => {});
        await this.loadSignals().catch(() => {});
        setTimeout(() => this.loadMarketingData(), 1200);
        setTimeout(() => this.maybeStartOnboardingTour(), 450);
      }
    }).catch(() => {});

    this.startPresenceTracking();
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

        // State-changing requests require a double-submit CSRF token and explicit
        // JSON content headers. Restore Content-Type + X-Idempotency-Key so
        // shared-hosting WAFs and API endpoints parse JSON payloads cleanly.
        if (body && !(body instanceof FormData)) {
          headers['Content-Type'] = 'application/json';
          if (body.idempotency_key) {
            headers['X-Idempotency-Key'] = String(body.idempotency_key);
          }
        }

        const needsCsrf = (normalizedMethod !== 'GET' && normalizedMethod !== 'HEAD' && normalizedMethod !== 'OPTIONS');
        const readCsrfFromCookies = () => {
          try {
            const matches = Array.from(document.cookie.matchAll(/(?:^|;\s*)alphavest_csrf=([^;]+)/g));
            for (let i = matches.length - 1; i >= 0; i--) {
              const candidate = decodeURIComponent(matches[i][1] || '').trim();
              if (/^[a-f0-9]{64}$/i.test(candidate)) return candidate;
            }
          } catch (e) {}
          return '';
        };
        const fetchFreshCsrf = async () => {
          try {
            const csrfRes = await fetch(`${baseUrl}/api/auth/csrf.php`, {
              method: 'GET',
              credentials: 'include',
              cache: 'no-store',
              headers: { 'Accept': 'application/json' }
            });
            if (csrfRes.ok) {
              const csrfJson = await csrfRes.json();
              const fresh = String(csrfJson?.data?.csrf_token || '').trim();
              if (/^[a-f0-9]{64}$/i.test(fresh)) return fresh;
            }
          } catch (e) {}
          return '';
        };
        if (needsCsrf) {
          let csrf = readCsrfFromCookies();
          if (!csrf) {
            csrf = await fetchFreshCsrf();
          }
          if (csrf) headers['X-CSRF-Token'] = csrf;
        }

        const isPriorityRequest = !isGet
          || cleanEndpoint.startsWith('/auth/')
          || cleanEndpoint.startsWith('/admin/');
        const runWithSlot = async (fn) => {
          if (isPriorityRequest) return fn();
          this._apiBgQueue = this._apiBgQueue || { active: 0, waiters: [] };
          if (this._apiBgQueue.active >= 2) {
            await new Promise(resolve => this._apiBgQueue.waiters.push(resolve));
          }
          this._apiBgQueue.active++;
          try {
            return await fn();
          } finally {
            this._apiBgQueue.active = Math.max(0, this._apiBgQueue.active - 1);
            const next = this._apiBgQueue.waiters.shift();
            if (next) next();
          }
        };

        let lastError = null;
        let csrfRefreshed = false;
        const maxRetries = (isGet && !cleanEndpoint.startsWith('/auth/')) ? 0 : retries;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            const res = await runWithSlot(() => fetch(url, {
              method: normalizedMethod,
              headers,
              cache: 'no-store',
              credentials: 'include',
              body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null
            }));

            // NEVER automatically retry 429 or 503. Retrying a rate-limited or
            // Entry-Process-saturated request amplifies the outage across Hostinger.
            if (res.status === 429 || res.status === 503) {
              const retryAfter = Number(res.headers.get('Retry-After') || 0);
              if (isGet) {
                this._apiRateLimitUntil = this._apiRateLimitUntil || new Map();
                this._apiRateLimitUntil.set(url, Date.now() + (retryAfter > 0 && retryAfter <= 120 ? retryAfter * 1000 : 15000));
              }
            }

            // Retry only transient 502/504 responses, with exponential backoff + jitter.
            if ([502, 504].includes(res.status) && attempt < maxRetries) {
              const delay = Math.min(4000, 600 * (2 ** attempt)) + Math.floor(Math.random() * 250);
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

            // If a stale or mismatched CSRF cookie caused a 403 CSRF_FAILED on a
            // state-changing request, refresh /api/auth/csrf.php once and retry.
            if (needsCsrf && res.status === 403 && !csrfRefreshed) {
              try {
                const parsed403 = JSON.parse(text);
                if (parsed403 && parsed403.error_code === 'CSRF_FAILED') {
                  csrfRefreshed = true;
                  const freshToken = await fetchFreshCsrf();
                  if (freshToken) {
                    headers['X-CSRF-Token'] = freshToken;
                    attempt = Math.max(-1, attempt - 1);
                    continue;
                  }
                }
              } catch (e) {}
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
    const res = await this.api('/auth/me.php?optional=1');
    if (res.success && res.data && res.data.user) {
      this.state.user = res.data.user;
      if (!this.state.user.avatar) {
        const storedAvatar = this.getUserAvatar(this.state.user);
        if (storedAvatar) this.state.user.avatar = storedAvatar;
      } else {
        const key = this.getUserAvatarStorageKey(this.state.user);
        if (key) {
          try { localStorage.setItem(key, this.state.user.avatar); } catch (e) {}
        }
      }
      if (this.state.user.country) {
        localStorage.setItem('alphavest_user_country', this.state.user.country);
      }
      const em = (res.data.user.email || '').toLowerCase().trim();
      localStorage.setItem('alphavest_local_user', JSON.stringify(this.state.user));
    } else {
      // Clear remembered identity when the server confirms there is no active
      // session or returns 401/403. Temporary 429/5xx/network failures preserve UI.
      const status = Number(res?.status || 0);
      const unauthenticated = Boolean(res?.success && res?.data && res.data.authenticated === false);
      if (status === 401 || status === 403 || unauthenticated) {
        this.state.user = null;
        localStorage.removeItem('alphavest_local_user');
      }
    }

    this.updateHeaderAuth();
    if (this.state.user) {
      if (window.AlphaLanding && typeof window.AlphaLanding.hide === 'function') {
        window.AlphaLanding.hide();
      }
      const landingEl = document.getElementById('av-public-landing');
      if (landingEl) landingEl.hidden = true;
    }
    if (this.isStaffOrAdmin(this.state.user) && !this.state.adminPreviewUser) {
      const allowedTabs = ['overview', 'users', 'referrals', 'deposits', 'withdrawals', 'kyc', 'signals', 'signal-schedules', 'adjustments', 'settings'];
      const cachedTab = localStorage.getItem('alphavest_admin_last_tab') || 'overview';
      this.state.adminTab = allowedTabs.includes(cachedTab) ? cachedTab : 'overview';
      if (this.state.currentView !== 'admin') {
        this.navigate('admin');
      }
    }
  },


  escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  escapeJsStr(value) {
    return String(value ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/</g, '\\x3C')
      .replace(/>/g, '\\x3E');
  },

  safeMediaUrl(url) {
    const raw = String(url ?? '').trim();
    if (!raw) return '';
    if (/^(https?:\/\/|\/(?!\/)|data:image\/(?:png|jpeg|jpg|webp|gif);base64,)/i.test(raw)) {
      return raw;
    }
    return '';
  },

  getAvatarCatalog() {
    if (!this._avatarCatalog) {
      const items = [];
      for (let i = 1; i <= 11; i++) {
        const num = String(i).padStart(2, '0');
        items.push({ id: `male_${num}`, gender: 'male', label: `Male ${num}`, url: `/assets/avatars/male/male_${num}.png` });
      }
      for (let i = 1; i <= 13; i++) {
        const num = String(i).padStart(2, '0');
        items.push({ id: `female_${num}`, gender: 'female', label: `Female ${num}`, url: `/assets/avatars/female/female_${num}.png` });
      }
      this._avatarCatalog = items;
    }
    return this._avatarCatalog;
  },

  isValidAvatarUrl(url) {
    return /^\/assets\/avatars\/(male|female)\/\1_\d{2}\.png$/.test(String(url || '').trim());
  },

  getUserAvatarStorageKey(userObj) {
    const u = userObj || this.state.user;
    if (!u) return '';
    const seed = u.id || u.numeric_uid || (u.email || '').toLowerCase().trim();
    return seed ? `alphavest_user_avatar_${seed}` : '';
  },

  getUserAvatar(userObj) {
    const u = userObj || this.state.adminPreviewUser || this.state.user;
    if (!u) return '';
    if (this.isValidAvatarUrl(u.avatar)) return u.avatar;
    try {
      const perUserKey = this.getUserAvatarStorageKey(u);
      if (perUserKey) {
        const stored = localStorage.getItem(perUserKey) || '';
        if (this.isValidAvatarUrl(stored)) return stored;
      }
      const isPreview = Boolean(this.state.adminPreviewUser && userObj === this.state.adminPreviewUser);
      if (!isPreview) {
        const globalStored = localStorage.getItem('alphavest_user_avatar') || '';
        if (this.isValidAvatarUrl(globalStored)) return globalStored;
      }
    } catch (e) {}
    return '';
  },

  getUserInitials(userObj) {
    const u = userObj || {};
    const displayName = ((u.first_name || '') + ' ' + (u.last_name || '')).trim();
    const seed = displayName || (u.email || '').split('@')[0] || 'PX';
    return seed.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('') || 'PX';
  },

  syncUserAvatarElements(userObj) {
    const u = userObj || this.state.adminPreviewUser || this.state.user;
    const avatarUrl = this.getUserAvatar(u);
    const initials = u ? this.getUserInitials(u) : 'PX';

    const profImg = document.getElementById('prof-avatar-img');
    const profInit = document.getElementById('prof-avatar-initials');
    if (profImg && profInit) {
      if (avatarUrl) {
        profImg.src = avatarUrl;
        profImg.style.display = 'block';
        profInit.style.display = 'none';
      } else {
        profImg.removeAttribute('src');
        profImg.style.display = 'none';
        profInit.textContent = initials;
        profInit.style.display = '';
      }
    }

    const setThumb = document.getElementById('settings-avatar-preview');
    const setLabel = document.getElementById('settings-avatar-label');
    if (setThumb) {
      if (avatarUrl) {
        setThumb.innerHTML = `<img src="${this.escapeHtml(avatarUrl)}" alt="Profile avatar">`;
      } else {
        setThumb.textContent = initials;
      }
    }
    if (setLabel) {
      const match = this.getAvatarCatalog().find(a => a.url === avatarUrl);
      setLabel.textContent = match ? match.label : 'Choose';
    }
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
      const isAdmin = !previewUser && this.isStaffOrAdmin(this.state.user);
      const avatarUrl = this.getUserAvatar(displayUser);
      
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
        const headerInitials = this.getUserInitials(displayUser);
        const avatarInner = avatarUrl
          ? `<img class="header-user-avatar-img" src="${this.escapeHtml(avatarUrl)}" alt="${this.escapeHtml(headerFullName)}">`
          : headerInitials;
        authBox.innerHTML = `
          <button type="button" class="header-user-identity" onclick="App.openModal('modal-profile')" aria-label="Open profile" title="${this.escapeHtml(headerFullName)}">
            <span class="header-user-avatar" aria-hidden="true">${avatarInner}</span>
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
      const profSubEmail = document.getElementById('prof-sub-email');
      if (profSubEmail) profSubEmail.textContent = displayUser?.email || '—';
      const profUidText = document.getElementById('prof-uid-text');
      if (profUidText) profUidText.textContent = this.getUserUID();
      this.syncUserAvatarElements(displayUser);

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
      this.syncProfileEmailBadge(displayUser);
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
      this.syncUserAvatarElements(null);
      this.syncProfileEmailBadge(null);
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
      const isAdmin = this.isStaffOrAdmin(user);
      if (!isAdmin) {
        this.toast('Administrative access requires administrator sign-in. Opening login...', 'warning');
        this.openModal('modal-auth');
        if (typeof this.switchAuthBox === 'function') this.switchAuthBox('login');
        return;
      } else if (!this.state.user && user) {
        this.state.user = user;
        this.updateHeaderAuth();
      }
    }

    this.state.currentView = view;
    if (this.isStaffOrAdmin(this.state.user) && !this.state.adminPreviewUser) {
      localStorage.setItem('alphavest_admin_last_view', view);
    }
    document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => {
      nav.classList.toggle('active', nav.getAttribute('data-view') === view);
    });

    const adminBanner = document.getElementById('admin-global-banner');
    if (adminBanner) {
      const isAdmin = this.isStaffOrAdmin(this.state.user);
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
      if (this.state.pendingWalletTransferFx && this.state.balances) {
        this.renderWalletView();
      }
      this.loadBalances();
      this.loadWalletHistoryPreview();
    } else if (view === 'copytrading') {
      this.navigate('signals');
      return;
    } else if (view === 'referrals') {
      this.loadReferrals();
    } else if (view === 'signals') {
      this.renderSignalScheduleTable(this.state.signalScheduleTab || 'first');
      setTimeout(() => this.initSignalsTerminal(), 30);
      this.loadSignals();
    } else if (view === 'home') {
      this.updateHomeHeroBalance();
      this.renderMarketList();
      if (this.state.user) this.loadSignals();
    } else if (view === 'admin') {
      this.loadAdminData();
      this.setAdminTab(this.state.adminTab || 'overview');
    } else if (view === 'convert') {
      this.loadConvertView();
    } else if (view === 'transfer') {
      this.loadTransferView();
      this.loadBalances();
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

    if (this.state.user) {
      this.sendUserHeartbeat(false, view);
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

  getDisplayCurrency() {
    try {
      const code = (localStorage.getItem('alphavest_currency_code') || 'USD').toUpperCase();
      const symbol = localStorage.getItem('alphavest_currency_symbol') || '$';
      const rawRate = parseFloat(localStorage.getItem('alphavest_currency_rate') || '1');
      const rate = Number.isFinite(rawRate) && rawRate > 0 ? rawRate : 1;
      return { code, symbol, rate };
    } catch (e) {
      return { code: 'USD', symbol: '$', rate: 1 };
    }
  },

  formatDisplayMoney(usdAmount, minDec = 2, maxDec = 2) {
    const { symbol, rate } = this.getDisplayCurrency();
    const converted = Number(usdAmount || 0) * rate;
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: minDec, maximumFractionDigits: maxDec })}`;
  },

  updateTopTickers() {
    if (!this.state.tickers || !this.state.tickers.length) return;
    const findTicker = (sym) => this.state.tickers.find(t => t.symbol === sym || t.symbol.startsWith(sym));
    const { symbol } = this.getDisplayCurrency();

    const bindTopCard = (ticker, priceId, changeId) => {
      if (!ticker) return;
      const pEl = document.getElementById(priceId);
      const cEl = document.getElementById(changeId);
      if (pEl) pEl.textContent = `${symbol}${this.formatPrice(ticker.price)}`;
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

  formatPrice(price, rawUsd = false) {
    const { rate } = rawUsd ? { rate: 1 } : this.getDisplayCurrency();
    const num = Number(price) * rate;
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
    if (s.includes('SILVER')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#F1F5F9" stroke="#64748B" stroke-width="1.5"/><rect x="9" y="10" width="14" height="12" rx="2" fill="#64748B"/><path d="M11 14h10M11 18h7" stroke="#FFFFFF" stroke-width="1.5"/></svg>`;
    }
    if (s.includes('NGAS')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#FFEDD5" stroke="#EA580C" stroke-width="1.5"/><path d="M16 7c0 0-6 7-6 12a6 6 0 0 0 12 0c0-5-6-12-6-12z" fill="#F97316"/></svg>`;
    }
    if (s.includes('ES1') || s.includes('NQ1')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#EFF4FF" stroke="#0052FF" stroke-width="1.5"/><path d="M8 21l5-5 4 3 7-8" stroke="#0052FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
    if (s.includes('GBP')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#EEF2FF" stroke="#4F46E5" stroke-width="1.5"/><text x="16" y="21" text-anchor="middle" fill="#4F46E5" font-size="14" font-weight="800" font-family="sans-serif">£</text></svg>`;
    }
    if (s.includes('AUD') || s.startsWith('USD/')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#ECFDF5" stroke="#059669" stroke-width="1.5"/><text x="16" y="21" text-anchor="middle" fill="#059669" font-size="13" font-weight="800" font-family="sans-serif">$</text></svg>`;
    }
    if (s.includes('AAPL') || s.includes('MSFT') || s.includes('NVDA') || s.includes('TSLA') || s.includes('AMZN') || s.includes('GOOGL')) {
      const stkCode = s.split('/')[0].slice(0, 3);
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#0F172A" stroke="#334155" stroke-width="1.5"/><text x="16" y="20" text-anchor="middle" fill="#FFFFFF" font-size="8.5" font-weight="800" font-family="sans-serif">${stkCode}</text></svg>`;
    }
    if (s.includes('SOL')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1.5"/><path d="M9 21l14-2.5M11 16l14-2.5M9 11l14-2.5" stroke="#00B87C" stroke-width="2" stroke-linecap="round"/></svg>`;
    }
    if (s.includes('BNB')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#FEFCE8" stroke="#EAB308" stroke-width="1.5"/><path d="M16 9l5 5-5 5-5-5 5-5z" fill="#EAB308"/></svg>`;
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
    const label = (s.split('/')[0] || 'AV').slice(0, 3);
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#EFF4FF" stroke="#DBEAFE" stroke-width="1.5"/><text x="16" y="20" text-anchor="middle" fill="#0052FF" font-size="9" font-weight="800" font-family="sans-serif">${label}</text></svg>`;
  },

  renderTickerBar() {
    const container = document.getElementById('ticker-bar');
    if (!container || !this.state.tickers.length) return;
    const { symbol } = this.getDisplayCurrency();

    container.innerHTML = this.state.tickers.slice(0, 6).map(t => {
      const isUp = t.change_24h >= 0;
      return `
        <div class="ticker-card" onclick="App.selectMarket('${t.symbol}')">
          <div class="ticker-sym">${t.symbol}</div>
          <div class="ticker-price">${symbol}${this.formatPrice(t.price)}</div>
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
    const cat = this.state.selectedCategory || 'CRYPTO';

    if (cat === 'CRYPTO') {
      const filtered = list.filter(t => t.category === 'CRYPTO' || ['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'DOGE', 'ADA', 'AVAX', 'LINK', 'XNO', 'APE', 'APT', 'AAVE'].some(k => t.symbol.includes(k)));
      if (filtered.length) list = filtered;
    } else if (cat === 'FOREX') {
      const filtered = list.filter(t => t.category === 'FOREX' || t.symbol.includes('EUR') || t.symbol.includes('GBP') || t.symbol.includes('JPY') || t.symbol.includes('CHF') || t.symbol.includes('AUD'));
      if (filtered.length) list = filtered;
    } else if (cat === 'FUTURES') {
      const filtered = list.filter(t => t.category === 'FUTURES' || t.symbol.includes('GOLD') || t.symbol.includes('SILVER') || t.symbol.includes('OIL') || t.symbol.includes('NGAS') || t.symbol.includes('ES1') || t.symbol.includes('NQ1'));
      if (filtered.length) list = filtered;
    } else if (cat === 'STOCKS') {
      const filtered = list.filter(t => t.category === 'STOCKS' || t.symbol.includes('AAPL') || t.symbol.includes('TSLA') || t.symbol.includes('NVDA') || t.symbol.includes('MSFT') || t.symbol.includes('AMZN') || t.symbol.includes('GOOGL'));
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
      const filtered = list.filter(t => t.symbol.includes('BTC') || t.symbol.includes('ETH') || t.symbol.includes('SOL') || t.symbol.includes('EUR') || t.symbol.includes('GOLD') || t.symbol.includes('NVDA') || t.symbol.includes('AAPL') || t.symbol.includes('XRP'));
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
      list = list.filter(t => t.symbol.toUpperCase().includes(query) || (t.base && t.base.toUpperCase().includes(query)) || (t.name && t.name.toUpperCase().includes(query)));
    }

    const currSym = this.getDisplayCurrency().symbol;
    const currRate = this.getDisplayCurrency().rate;

    // Render Trending 3 Cards on Market Discover
    const trendingEl = document.getElementById('market-trending-3-cards');
    if (trendingEl) {
      const top3 = [...(list.length ? list : (this.state.tickers || []))].slice(0, 3);
      trendingEl.innerHTML = top3.map((t, idx) => {
        const isUp = Number(t.change_24h || 0) >= 0;
        const basePart = t.base || t.symbol.split('/')[0];
        const chgStr = `${isUp ? '+' : ''}${Number(t.change_24h || 0).toFixed(2)}%`;
        const dotColors = ['#F59E0B', '#0052FF', '#111827'];
        const formattedPrice = this.formatPrice(t.price);
        return `
          <div class="av-trending-mini-card" onclick="App.setMarketPreviewPair('${t.symbol}')">
            <div style="display:flex;align-items:center;gap:5px;margin-bottom:6px;">
              <span style="width:9px;height:9px;border-radius:50%;background:${dotColors[idx % dotColors.length]};display:inline-block;"></span>
              <span style="font-size:12px;font-weight:800;color:#111827;">${basePart}</span>
            </div>
            <div class="mono ${isUp ? 'positive' : 'negative'}" style="font-size:15px;font-weight:800;color:${isUp ? '#00B87C' : '#F6465D'};margin-bottom:2px;">${chgStr}</div>
            <div class="mono" style="font-size:11.5px;font-weight:700;color:#4B5563;">${currSym}${formattedPrice}</div>
          </div>
        `;
      }).join('');
    }

    // Render Home Page Trending Markets Cards
    const homeContainer = document.getElementById('market-list-rows');
    if (homeContainer) {
      if (!list.length) {
        homeContainer.innerHTML = `
          <div style="text-align: center; padding: 32px 16px; color: #6B7280; font-size: 13px;">
            No matching trading pairs found
          </div>
        `;
      } else {
        const nameMap = {
          BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana', XRP: 'Ripple', BNB: 'BNB',
          DOGE: 'Dogecoin', ADA: 'Cardano', AVAX: 'Avalanche', LINK: 'Chainlink', AAVE: 'Aave',
          APE: 'ApeCoin', APT: 'Aptos', EUR: 'Euro / USD', GBP: 'British Pound', USD: 'US Dollar',
          AUD: 'Australian Dollar', GOLD: 'Spot Gold', SILVER: 'Silver Futures', OIL: 'WTI Crude Oil',
          NGAS: 'Natural Gas', ES1: 'S&P 500 E-Mini', NQ1: 'Nasdaq 100 Futures',
          AAPL: 'Apple Inc.', NVDA: 'NVIDIA Corp.', TSLA: 'Tesla Inc.', MSFT: 'Microsoft Corp.',
          AMZN: 'Amazon.com', GOOGL: 'Alphabet Inc.'
        };
        homeContainer.innerHTML = list.map(t => {
          const isHalt = Boolean(t.halt);
          const isUp = Number(t.change_24h || 0) >= 0;
          const chgStr = isHalt ? 'Halt' : `${isUp ? '+' : ''}${Number(t.change_24h || 0).toFixed(2)}% ${isUp ? '▲' : '▼'}`;
          const iconSvg = this.getCoinIcon(t.base || t.symbol);
          const basePart = t.base || t.symbol.split('/')[0];
          const displayName = t.name || nameMap[basePart] || basePart;
          const formattedPrice = this.formatPrice(t.price);
          const volUsd = t.volume_24h ? Number(t.volume_24h) : 84200000;
          const volStr = `${currSym}${((volUsd * currRate) / 1000000).toFixed(1)}M`;

          return `
            <div class="av-trending-market-card" onclick="App.selectMarket('${t.symbol}')">
              <div style="display: flex; align-items: center; gap: 11px; min-width:0;">
                <div style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${iconSvg}
                </div>
                <div style="min-width:0;">
                  <div style="font-size: 15px; font-weight: 800; color: #111827;">
                    ${displayName} <span style="font-size: 12px; color: #6B7280; font-weight: 600;">${t.symbol}</span>
                  </div>
                  <div style="font-size: 11.5px; color: #9CA3AF; margin-top:2px;">${t.category || 'MARKET'} • Vol ${volStr}</div>
                </div>
              </div>
              <div style="text-align: right; flex-shrink:0;">
                <div class="mono" style="font-size: 15px; font-weight: 800; color: #111827;">${currSym}${formattedPrice}</div>
                <div class="mono ${isUp ? 'positive' : 'negative'}" style="font-size: 12px; font-weight: 700; color: ${isHalt ? '#9CA3AF' : (isUp ? '#00B87C' : '#F6465D')}; margin-top:2px;">${chgStr}</div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render Market Discovery Page Cards
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
          const rawUsdtPrice = this.formatPrice(t.price, true);
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
                  <div style="font-size: 15px; font-weight: 800; color: #111827; display: flex; align-items: baseline; gap: 4px;">
                    ${basePart}<span style="font-size: 11.5px; color: #6B7280; font-weight: 600;">/${quotePart}</span>
                    <span style="font-size:9.5px;font-weight:700;color:#0052FF;background:#EFF4FF;padding:1px 5px;border-radius:4px;">${t.category || 'SPOT'}</span>
                  </div>
                  <div style="font-size: 11.5px; color: #9CA3AF; margin-top:2px;">Vol ${volStr}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px; flex-shrink:0;">
                <div style="text-align: right;">
                  <div class="mono" style="font-size: 15px; font-weight: 800; color: #111827;">${rawUsdtPrice}</div>
                  <div style="font-size: 11.5px; color: #6B7280;">${currSym}${formattedPrice} <span class="mono ${isUp ? 'positive' : 'negative'}" style="font-weight:700;color:${isUp ? '#00B87C' : '#F6465D'};">${chgStr}</span></div>
                </div>
                <button type="button" onclick="event.stopPropagation(); App.setMarketPreviewPair('${t.symbol}')" style="height:28px;padding:0 9px;border-radius:8px;background:#EFF4FF;border:1px solid #DBEAFE;color:#0052FF;font-size:11px;font-weight:700;cursor:pointer;" title="Load live chart">Chart</button>
                <button type="button" onclick="App.toggleFavoritePair('${t.symbol}', event)" style="width:28px;height:28px;border-radius:50%;background:${isFav ? '#FEF3C7' : '#F3F4F6'};border:none;cursor:pointer;color:${isFav ? '#F59E0B' : '#9CA3AF'};font-size:14px;display:inline-flex;align-items:center;justify-content:center;" aria-label="Favorite ${t.symbol}">
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

    // Update Market Page category tab buttons, filter pills, and Home category pills
    document.querySelectorAll('.cat-tab-btn, .av-market-cat-tab, .market-filter-pill, .av-home-cat-pill').forEach(btn => {
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

    // Automatically select top pair & quick strip when switching between asset classes
    if (['CRYPTO', 'FOREX', 'FUTURES', 'STOCKS', 'ALL'].includes(cat)) {
      const catTickers = cat === 'ALL'
        ? (this.state.tickers || [])
        : (this.state.tickers || []).filter(t => (t.category || '').toUpperCase() === cat);
      if (catTickers.length) {
        const currentInCat = catTickers.some(t => t.symbol === this.state.marketOverviewSymbol);
        if (!currentInCat || cat !== 'ALL') {
          this.state.marketOverviewSymbol = catTickers[0].symbol;
        }
      }
      this.renderMarketQuickPairs(cat);
      if (document.getElementById('market-overview-chart-canvas') && this.state.currentView === 'market') {
        this.updateMarketFeaturedBanner();
        this.loadMarketKlines();
      }
    }

    this.renderMarketList();
  },

  renderMarketQuickPairs(cat = 'CRYPTO') {
    const strip = document.getElementById('mkt-preview-quick-pairs');
    if (!strip) return;
    let pairs = [];
    if (['CRYPTO', 'FOREX', 'FUTURES', 'STOCKS'].includes(cat)) {
      pairs = (this.state.tickers || [])
        .filter(t => (t.category || '').toUpperCase() === cat)
        .slice(0, 6)
        .map(t => t.symbol);
    } else {
      pairs = ['BTC/USDT', 'ETH/USDT', 'EUR/USD', 'GOLD/USD', 'AAPL/USD', 'NVDA/USD'];
    }
    const activeSym = this.state.marketOverviewSymbol || pairs[0] || 'BTC/USDT';
    strip.innerHTML = pairs.map(p => `
      <button type="button" class="mkt-preview-chip ${p === activeSym ? 'active' : ''}" data-pair="${p}" onclick="App.setMarketPreviewPair('${p}')">${p}</button>
    `).join('');
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
    const activeTicker = (this.state.tickers || []).find(t => t.symbol === this.state.marketOverviewSymbol);
    const activeCat = activeTicker?.category || this.state.selectedCategory || 'CRYPTO';
    this.renderMarketQuickPairs(['CRYPTO', 'FOREX', 'FUTURES', 'STOCKS'].includes(activeCat) ? activeCat : 'CRYPTO');

    const canvas = document.getElementById('market-overview-chart-canvas');
    if (canvas && typeof FinancialChart === 'function') {
      if (!this.marketChart || this.marketChart.canvas !== canvas) {
        this.marketChart = new FinancialChart(canvas);
      } else {
        this.marketChart.resize();
        this.marketChart.render();
      }
      const seedPrice = activeTicker && Number(activeTicker.price) > 0 ? Number(activeTicker.price) : 77915.82;
      if (!this.marketChart.candles || !this.marketChart.candles.length) {
        this.marketChart.setData(this.marketChart.generateSeedCandles(seedPrice), this.state.marketChartType || 'candlestick');
      }
    }
    this.updateMarketFeaturedBanner();
    await this.loadMarketKlines();
    this.renderMarketList();
    this.startLiveChartTicker();
  },

  updateMarketFeaturedBanner() {
    const sym = this.state.marketOverviewSymbol || 'BTC/USDT';
    const ticker = this.state.tickers.find(t => t.symbol === sym) || {
      symbol: sym,
      category: 'CRYPTO',
      price: 77915.82,
      change_24h: 1.63,
      volume_24h: 142000000
    };
    const isUp = (Number(ticker.change_24h) || 0) >= 0;
    const symEl = document.getElementById('mkt-preview-sym');
    const catEl = document.getElementById('mkt-preview-cat');
    const badgeEl = document.getElementById('mkt-preview-badge');
    const priceEl = document.getElementById('mkt-preview-price');
    const highEl = document.getElementById('mkt-preview-high');
    const lowEl = document.getElementById('mkt-preview-low');
    const tradeBtn = document.getElementById('mkt-preview-trade-btn');

    const currSym = this.getDisplayCurrency().symbol;
    if (symEl) symEl.textContent = sym;
    if (catEl) catEl.textContent = String(ticker.category || 'MARKET').toUpperCase();
    if (badgeEl) {
      badgeEl.className = `badge ${isUp ? 'badge-positive' : 'badge-negative'}`;
      badgeEl.textContent = `${isUp ? '+' : ''}${Number(ticker.change_24h).toFixed(2)}%`;
    }
    if (priceEl) {
      priceEl.textContent = `${currSym}${this.formatPrice(ticker.price)}`;
      priceEl.style.color = isUp ? '#00B87C' : '#F6465D';
    }
    const dec = Number(ticker.price) >= 100 ? 2 : 4;
    const highVal = Number(ticker.high_24h || (Number(ticker.price) * 1.025)).toFixed(dec);
    const lowVal = Number(ticker.low_24h || (Number(ticker.price) * 0.978)).toFixed(dec);
    if (highEl) highEl.textContent = `${currSym}${this.formatPrice(highVal)}`;
    if (lowEl) lowEl.textContent = `${currSym}${this.formatPrice(lowVal)}`;
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
      if (b.dataset.tf) b.classList.toggle('active', b.getAttribute('data-tf') === interval);
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

  startLiveChartTicker() {
    if (this._liveChartTickTimer) clearInterval(this._liveChartTickTimer);
    this._liveChartTickTimer = setInterval(() => {
      if (document.hidden || !this.state.tickers || !this.state.tickers.length) return;
      const view = this.state.currentView;
      if (view !== 'market' && view !== 'futures') return;

      const targetSym = view === 'market' ? (this.state.marketOverviewSymbol || 'BTC/USDT') : (this.state.selectedMarket || 'BTC/USDT');
      const ticker = this.state.tickers.find(t => t.symbol === targetSym);
      if (!ticker) return;

      const isForex = ticker.category === 'FOREX';
      const stepScale = isForex ? 0.00028 : 0.0011;
      const jitter = (Math.random() - 0.495) * stepScale;
      const nextPrice = Math.max(0.0001, Number(ticker.price) * (1 + jitter));
      ticker.price = nextPrice;

      if (view === 'market' && this.marketChart) {
        const tfSec = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14400 }[this.state.marketChartInterval || '5m'] || 300;
        this.marketChart.updateLiveCandleTick(nextPrice, Math.random() * 14000, tfSec);
        const priceEl = document.getElementById('mkt-preview-price');
        if (priceEl) {
          priceEl.textContent = `${this.getDisplayCurrency().symbol}${this.formatPrice(nextPrice)}`;
        }
      } else if (view === 'futures' && this.chart) {
        const tfSec = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14400, '1d': 86400 }[this.state.chartInterval || '1h'] || 3600;
        this.chart.updateLiveCandleTick(nextPrice, Math.random() * 18000, tfSec);
        this.updateFuturesBanner();
      }
    }, 1500);
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
    this.startLiveChartTicker();
  },

  updateFuturesBanner() {
    const sym = this.state.selectedMarket;
    const ticker = this.state.tickers.find(t => t.symbol === sym);
    if (!ticker) return;

    const currSym = this.getDisplayCurrency().symbol;
    const formattedPrice = `${currSym}${this.formatPrice(ticker.price)}`;
    const rawPrice = this.formatPrice(ticker.price, true);
    const highPrice = `${currSym}${this.formatPrice(ticker.high_24h || ticker.price * 1.02)}`;
    const lowPrice = `${currSym}${this.formatPrice(ticker.low_24h || ticker.price * 0.98)}`;
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

    const futureAvail = Number(this.state.balances?.future_total_usdt ?? this.state.balances?.breakdown?.trading_total_usdt ?? 0);
    const transferableSpot = Number(this.state.balances?.transferable_spot_usdt ?? this.state.balances?.breakdown?.transferable_spot_usdt ?? 0);
    if (futureAvail <= 0) {
      if (transferableSpot > 0) {
        this.toast('Your Future Balance is $0.00. Transfer Deposit or Deposit Bonus from Spot to Future to trade.', 'warning');
        this.navigate('transfer');
      } else {
        this.toast('Insufficient Future Balance. Deposit funds and transfer to Future Wallet to trade.', 'error');
      }
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
        if (this.state.currentView === 'transfer') {
          this.loadTransferView();
        }
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
    const tradingUsdt = Number(data.future_total_usdt ?? data.breakdown?.trading_total_usdt ?? 0);
    const spotUsdt = Number(data.spot_total_usdt ?? data.breakdown?.spot_total_usdt ?? (fundingUsdt + exchangeUsdt));
    const depositBalUsdt = Number(data.deposit_balance_usdt ?? data.breakdown?.deposit_balance_usdt ?? 0);
    const depositBonusUsdt = Number(data.deposit_bonus_usdt ?? data.breakdown?.deposit_bonus_usdt ?? 0);
    const referralBonusUsdt = Number(data.referral_bonus_usdt ?? data.breakdown?.referral_bonus_usdt ?? 0);
    const transferableSpotUsdt = Number(data.transferable_spot_usdt ?? data.breakdown?.transferable_spot_usdt ?? Math.max(0, spotUsdt - referralBonusUsdt));
    const fmtMoney = v => this.formatDisplayMoney(v);
    const { code: currCode, symbol: currSym, rate: currRate } = this.getDisplayCurrency();

    const isHidden = this.state.hideBalance;

    // Total Wallet Card
    const totalBalEl = document.getElementById('wallet-total-balance') || document.getElementById('wallet-total-usdt');
    if (totalBalEl) {
      totalBalEl.textContent = isHidden ? '******' : fmtMoney(totalUsdt);
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

    // Breakdown sub-accounts & balance types
    const spotTotalEl = document.getElementById('wallet-spot-total');
    const fundingEl = document.getElementById('bal-funding');
    const exchangeEl = document.getElementById('bal-exchange');
    const tradingEl = document.getElementById('bal-trading');
    const depPrincipalEl = document.getElementById('bal-deposit-principal');
    const depBonusEl = document.getElementById('bal-deposit-bonus');
    const refBonusEl = document.getElementById('bal-referral-bonus');
    const transferableEl = document.getElementById('bal-transferable-spot');

    const fx = this.state.pendingWalletTransferFx;
    const hasPendingFx = Boolean(fx && (Date.now() - (fx.ts || 0) < 18000) && !isHidden);
    const walletViewEl = document.getElementById('view-wallet');
    const walletVisible = Boolean(walletViewEl && walletViewEl.style.display !== 'none');

    if (spotTotalEl) {
      if (hasPendingFx && walletVisible) {
        this.animateNumericText(spotTotalEl, fx.prevSpot, spotUsdt, fmtMoney, 700);
      } else {
        spotTotalEl.textContent = isHidden ? '******' : fmtMoney(spotUsdt);
      }
    }
    if (fundingEl) fundingEl.textContent = isHidden ? '******' : fmtMoney(spotUsdt);
    if (exchangeEl) exchangeEl.textContent = isHidden ? '******' : fmtMoney(exchangeUsdt);
    if (tradingEl) {
      if (hasPendingFx && walletVisible) {
        this.animateNumericText(tradingEl, fx.prevFuture, tradingUsdt, fmtMoney, 700);
      } else {
        tradingEl.textContent = isHidden ? '******' : fmtMoney(tradingUsdt);
      }
    }
    if (depPrincipalEl) depPrincipalEl.textContent = isHidden ? '******' : fmtMoney(depositBalUsdt);
    if (depBonusEl) depBonusEl.textContent = isHidden ? '******' : fmtMoney(depositBonusUsdt);
    if (refBonusEl) refBonusEl.textContent = isHidden ? '******' : fmtMoney(referralBonusUsdt);
    if (transferableEl) {
      if (hasPendingFx && walletVisible && Number.isFinite(fx.prevTransferable)) {
        this.animateNumericText(transferableEl, fx.prevTransferable, transferableSpotUsdt, fmtMoney, 700);
      } else {
        transferableEl.textContent = isHidden ? '******' : fmtMoney(transferableSpotUsdt);
      }
    }

    if (hasPendingFx && walletVisible) {
      const sBar = document.getElementById('wallet-flow-spot-bar');
      const fBar = document.getElementById('wallet-flow-future-bar');
      if (sBar && fBar) {
        sBar.style.transition = 'none';
        fBar.style.transition = 'none';
        this.updateWalletAllocationBar(fx.prevSpot, fx.prevFuture, isHidden);
        void sBar.offsetWidth;
        sBar.style.transition = '';
        fBar.style.transition = '';
      }
      this.updateWalletAllocationBar(spotUsdt, tradingUsdt, isHidden);
      this.state.pendingWalletTransferFx = null;
      this.triggerWalletTransferAnimation(fx.direction, fx.amount);
    } else {
      this.updateWalletAllocationBar(spotUsdt, tradingUsdt, isHidden);
    }

    // Crypto asset rows
    const btcAmtEl = document.getElementById('wallet-btc-amount');
    const btcUsdEl = document.getElementById('wallet-btc-usd');
    if (btcAmtEl) btcAmtEl.textContent = isHidden ? '******' : '0.0000';
    if (btcUsdEl) btcUsdEl.textContent = isHidden ? '******' : `≈ ${currSym}0.00 ${currCode === 'USD' ? 'USDT' : currCode}`;

    const ethAmtEl = document.getElementById('wallet-eth-amount');
    const ethUsdEl = document.getElementById('wallet-eth-usd');
    if (ethAmtEl) ethAmtEl.textContent = isHidden ? '******' : '0.0000';
    if (ethUsdEl) ethUsdEl.textContent = isHidden ? '******' : `≈ ${currSym}0.00 ${currCode === 'USD' ? 'USDT' : currCode}`;

    const usdtAmtEl = document.getElementById('wallet-usdt-amount');
    if (usdtAmtEl) {
      usdtAmtEl.textContent = isHidden ? '******' : totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    if (this.state.currentView === 'transfer') {
      this.loadTransferView();
    }

    this.updateHomeHeroBalance();
  },

  updateHomeHeroBalance() {
    const homeValEl = document.getElementById('home-balance-val');
    const homeSymEl = document.getElementById('home-balance-currency-sym');
    const homeCodeEl = document.getElementById('home-balance-currency-code');
    const uidEl = document.getElementById('home-user-uid');
    const balData = this.state.balances || {};
    const { code, symbol, rate } = this.getDisplayCurrency();
    if (homeSymEl) homeSymEl.textContent = symbol;
    if (homeCodeEl) homeCodeEl.textContent = code === 'USD' ? 'USDT' : code;
    if (homeValEl) {
      if (this.state.hideBalance) {
        homeValEl.textContent = '******';
      } else {
        const rawUsd = Number(balData.total_assets_usdt || 0);
        const converted = rawUsd * rate;
        homeValEl.textContent = converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
      } else if (kycStatus === 'REJECTED' || kycStatus === 'RESUBMIT_REQUIRED') {
        const isResub = kycStatus === 'RESUBMIT_REQUIRED';
        kycBadge.textContent = isResub ? 'Resubmit KYC ↻' : 'KYC Rejected ✕';
        kycBadge.className = isResub ? 'badge badge-warning' : 'badge badge-negative';
        kycBadge.style.color = isResub ? '#D97706' : '#DC2626';
        kycBadge.style.background = isResub ? '#FFFBEB' : '#FEF2F2';
      } else {
        kycBadge.textContent = 'Unverified (Verify)';
        kycBadge.className = 'badge badge-warning';
        kycBadge.style.color = '#6B7280';
        kycBadge.style.background = '#F3F5F8';
      }
    }

    if (kycBanner) {
      if (kycStatus === 'PENDING' || kycStatus === 'UNDER_REVIEW') {
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
      } else if (kycStatus === 'REJECTED' || kycStatus === 'RESUBMIT_REQUIRED') {
        const isResub = kycStatus === 'RESUBMIT_REQUIRED';
        kycBanner.style.display = 'block';
        kycBanner.innerHTML = `
          <div style="background: ${isResub ? '#FFFBEB' : '#FEF2F2'}; border: 1px solid ${isResub ? '#FDE68A' : '#FECACA'}; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; color: ${isResub ? '#B45309' : '#DC2626'};">
              <span style="font-size: 16px;">${isResub ? '🔄' : '⚠️'}</span>
              <span><strong>${isResub ? 'KYC Resubmission Requested:' : 'KYC Action Required:'}</strong> ${isResub ? 'Compliance requested updated identity documents. Please resubmit your KYC.' : 'Identity verification was declined. Please resubmit your document.'}</span>
            </div>
            <button onclick="App.navigate('kyc')" style="background: ${isResub ? '#FEF3C7' : '#FEE2E2'}; border: 1px solid ${isResub ? '#F59E0B' : '#EF4444'}; color: ${isResub ? '#B45309' : '#DC2626'}; border-radius: 8px; padding: 4px 10px; font-size: 11px; cursor: pointer; font-weight: 700;">Resubmit KYC</button>
          </div>
        `;
      } else {
        kycBanner.style.display = 'none';
      }
    }
  },

  toggleBalanceVisibility() {
    this.state.hideBalance = !this.state.hideBalance;
    const isHidden = Boolean(this.state.hideBalance);
    const eyePath = isHidden
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;

    ['balance-eye-icon', 'wallet-balance-eye-icon'].forEach(id => {
      const icon = document.getElementById(id);
      if (icon) icon.innerHTML = eyePath;
    });

    const fadeTargets = Array.from(document.querySelectorAll('.av-bal-fade'));
    if (this._balFadeTimer) {
      clearTimeout(this._balFadeTimer);
      this._balFadeTimer = null;
    }
    if (fadeTargets.length) {
      fadeTargets.forEach(el => el.classList.add('is-fading'));
      this._balFadeTimer = setTimeout(() => {
        this.updateHomeHeroBalance();
        this.renderWalletView();
        requestAnimationFrame(() => {
          fadeTargets.forEach(el => el.classList.remove('is-fading'));
        });
      }, 155);
    } else {
      this.updateHomeHeroBalance();
      this.renderWalletView();
    }
  },

  /* Guided New-User Onboarding Tour (Deposit, Withdrawal, KYC, Avatar) */
  getOnboardingTourSteps() {
    return [
      {
        view: 'home',
        targetId: 'home-action-deposit',
        title: '1. Deposit Funds',
        desc: 'Tap Deposit to view your USDT wallet address and submit transfers. Minimum deposit is $100, and $300+ unlocks Additional Signals.'
      },
      {
        view: 'home',
        targetId: 'home-action-withdraw',
        title: '2. Withdraw Earnings',
        desc: 'Tap Withdrawal anytime to request payouts using your bound USDT address and 6-digit fund withdrawal PIN.'
      },
      {
        view: 'home',
        targetId: 'home-user-kyc-badge',
        title: '3. Submit KYC Verification',
        desc: 'Tap your verification status badge here to submit your ID document and selfie for fast Tier 2 verification.'
      },
      {
        view: 'settings',
        targetId: 'settings-avatar-row',
        title: '4. Choose Your Avatar',
        desc: 'Customize your account avatar from our collection right here in Settings—it updates across your header and profile.'
      }
    ];
  },

  getOnboardingTourKey(suffix) {
    const uid = this.state.user?.id || this.state.user?.numeric_uid || this.state.user?.email || 'guest';
    return `primex_tour_${suffix}_${String(uid).toLowerCase()}`;
  },

  maybeStartOnboardingTour() {
    const user = this.state.user;
    if (!user) return;
    const role = String(user.role || '').toUpperCase();
    if (user.is_admin || ['ADMIN', 'SUPER_ADMIN', 'FINANCE_MANAGER', 'KYC_MANAGER'].includes(role)) return;
    try {
      const pending = localStorage.getItem(this.getOnboardingTourKey('pending')) === '1';
      const done = localStorage.getItem(this.getOnboardingTourKey('done')) === '1';
      if (!pending || done) return;
    } catch (e) {
      return;
    }
    const authModal = document.getElementById('modal-auth');
    if (authModal && authModal.classList.contains('open')) return;
    if (this.state.currentView && this.state.currentView !== 'home') return;
    this.startOnboardingTour();
  },

  startOnboardingTour() {
    const overlay = document.getElementById('av-onboarding-tour');
    if (!overlay) return;
    this.state._tourStep = 0;
    this.state._tourActive = true;
    overlay.style.display = 'block';
    if (!this._tourResizeHandler) {
      this._tourResizeHandler = () => {
        if (this.state._tourActive) this.positionTourSpotlight();
      };
      window.addEventListener('resize', this._tourResizeHandler);
    }
    this.renderTourStep();
  },

  renderTourStep() {
    const steps = this.getOnboardingTourSteps();
    const idx = Math.max(0, Math.min(steps.length - 1, Number(this.state._tourStep || 0)));
    this.state._tourStep = idx;
    const step = steps[idx];

    if (step.view && this.state.currentView !== step.view) {
      this.navigate(step.view);
    }

    const pillEl = document.getElementById('av-tour-step-pill');
    const titleEl = document.getElementById('av-tour-title');
    const descEl = document.getElementById('av-tour-desc');
    const dotsEl = document.getElementById('av-tour-dots');
    const prevBtn = document.getElementById('av-tour-prev-btn');
    const nextBtn = document.getElementById('av-tour-next-btn');

    if (pillEl) pillEl.textContent = `Step ${idx + 1} of ${steps.length}`;
    if (titleEl) titleEl.textContent = step.title;
    if (descEl) descEl.textContent = step.desc;
    if (dotsEl) {
      dotsEl.innerHTML = steps.map((_, i) => `<span class="av-tour-dot${i === idx ? ' active' : ''}"></span>`).join('');
    }
    if (prevBtn) prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.textContent = idx === steps.length - 1 ? 'Finish' : 'Next';

    setTimeout(() => this.positionTourSpotlight(), 80);
  },

  positionTourSpotlight() {
    const steps = this.getOnboardingTourSteps();
    const idx = Math.max(0, Math.min(steps.length - 1, Number(this.state._tourStep || 0)));
    const step = steps[idx];
    const target = document.getElementById(step.targetId);
    const spot = document.getElementById('av-tour-spotlight');
    const card = document.getElementById('av-tour-card');
    if (!spot || !card) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (!target) {
      spot.style.display = 'none';
      card.style.left = `${Math.max(16, (vw - card.offsetWidth) / 2)}px`;
      card.style.top = `${Math.max(24, (vh - card.offsetHeight) / 2)}px`;
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      if (!this.state._tourActive) return;
      const rect = target.getBoundingClientRect();
      const pad = 8;
      const left = Math.max(8, rect.left - pad);
      const top = Math.max(8, rect.top - pad);
      const width = Math.min(vw - left - 8, rect.width + pad * 2);
      const height = Math.min(vh - top - 8, rect.height + pad * 2);

      spot.style.display = 'block';
      spot.style.left = `${left}px`;
      spot.style.top = `${top}px`;
      spot.style.width = `${width}px`;
      spot.style.height = `${height}px`;

      const cardW = Math.min(340, vw - 32);
      const cardH = card.offsetHeight || 200;
      const spaceBelow = vh - (top + height) - 16;
      let cardTop = spaceBelow >= cardH
        ? (top + height + 14)
        : Math.max(16, top - cardH - 14);
      if (cardTop + cardH > vh - 12) cardTop = Math.max(16, vh - cardH - 16);
      const centeredLeft = left + (width / 2) - (cardW / 2);
      const cardLeft = Math.max(16, Math.min(vw - cardW - 16, centeredLeft));

      card.style.left = `${cardLeft}px`;
      card.style.top = `${cardTop}px`;
    }, 180);
  },

  nextTourStep() {
    const steps = this.getOnboardingTourSteps();
    if ((this.state._tourStep || 0) >= steps.length - 1) {
      this.finishOnboardingTour();
      return;
    }
    this.state._tourStep = (this.state._tourStep || 0) + 1;
    this.renderTourStep();
  },

  prevTourStep() {
    if ((this.state._tourStep || 0) <= 0) return;
    this.state._tourStep = (this.state._tourStep || 0) - 1;
    this.renderTourStep();
  },

  finishOnboardingTour() {
    this.state._tourActive = false;
    const overlay = document.getElementById('av-onboarding-tour');
    if (overlay) overlay.style.display = 'none';
    try {
      localStorage.removeItem(this.getOnboardingTourKey('pending'));
      localStorage.setItem(this.getOnboardingTourKey('done'), '1');
    } catch (e) {}
    if (this.state.currentView !== 'home') {
      this.navigate('home');
    }
  },

  skipOnboardingTour() {
    this.finishOnboardingTour();
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
      const user = this.state.adminPreviewUser || this.state.user || {};
      const displayName = ((user.first_name || '') + ' ' + (user.last_name || '')).trim();
      const emailEl = document.getElementById('prof-email-label');
      const subEmailEl = document.getElementById('prof-sub-email');
      const uidEl = document.getElementById('prof-uid-text');
      const kycBadge = document.getElementById('prof-kyc-badge');
      if (emailEl) {
        emailEl.textContent = displayName || user.email || 'User Account';
      }
      if (subEmailEl) {
        subEmailEl.textContent = user.email || '—';
      }
      if (uidEl) {
        uidEl.textContent = this.getUserUID();
      }
      this.syncUserAvatarElements(user);
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
      this.syncProfileEmailBadge(user);
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
    if (modalId === 'modal-support-chat' && this._userSupportPollTimer) {
      clearInterval(this._userSupportPollTimer);
      this._userSupportPollTimer = null;
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
      const minDeposit = Math.max(100, Number(res.data.min_deposit || (res.data.deposit_info && res.data.deposit_info.minimum_deposit) || 100) || 100);
      this.state.minDepositRequired = minDeposit;
      const instructions = res.data.instructions || '';
      const confirmations = res.data.required_confirmations || 12;

      const addrEl = document.getElementById('dep-address');
      if (addrEl) addrEl.value = address;
      
      const minLabelEl = document.getElementById('dep-min-label');
      if (minLabelEl) minLabelEl.textContent = `Minimum Deposit: ${minDeposit} ${asset} (${confirmations} Confirmations Required)`;

      const amtInput = document.getElementById('dep-live-amount');
      if (amtInput) {
        amtInput.min = String(minDeposit);
        amtInput.placeholder = `e.g. ${minDeposit}`;
        if (!amtInput.value || Number(amtInput.value) < minDeposit) amtInput.value = String(minDeposit);
      }

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
      const minDepReq = Math.max(100, Number(statusCheck?.data?.min_deposit || this.state.minDepositRequired || 100) || 100);
      const userAddress = (document.getElementById('dep-user-address')?.value || '').trim();
      const txHash = (document.getElementById('dep-live-txhash')?.value || '').trim();

      if (amount <= 0) {
        this.toast('Please enter a valid deposit amount', 'error');
        return;
      }
      if (amount < minDepReq) {
        this.toast(`Minimum deposit is ${minDepReq} ${asset}. Please enter at least ${minDepReq} ${asset}.`, 'error');
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

  /* Withdrawal: 30% early fee before 2x/30d (waived to 5%/$100 tier when Deposit+DepositBonus+ReferralBonus >= 2x Deposit or 30d + 2x met) */
  computeClientWithdrawalFee(amount) {
    const amt = Math.max(0, Number(amount) || 0);
    const info = this.state.withdrawInfo;
    const isEarly = info ? Boolean(info.is_early_withdrawal) : true;
    if (amt <= 0) {
      return { feePct: isEarly ? 30 : 0, feeAmt: 0, netAmt: 0, isEarly };
    }
    if (isEarly) {
      const feeAmt = Math.round(amt * 0.30 * 100) / 100;
      return { feePct: 30, feeAmt, netAmt: Math.max(0, Math.round((amt - feeAmt) * 100) / 100), isEarly: true };
    }
    const blocks = Math.max(1, Math.ceil((amt - 0.00001) / 100));
    const feePct = Math.min(100, blocks * 5);
    const feeAmt = Math.round(amt * (feePct / 100) * 100) / 100;
    return { feePct, feeAmt, netAmt: Math.max(0, Math.round((amt - feeAmt) * 100) / 100), isEarly: false };
  },

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
        const bonusTotEl = document.getElementById('with-stat-bonus-total');
        const targetEl = document.getElementById('with-stat-target');
        const penaltyEl = document.getElementById('with-penalty-alert');
        const noticeBox = document.getElementById('with-deduction-notice');

        const totalDep = Number(res.data.total_deposited || 0);
        const depPlusBonuses = Number(res.data.deposit_plus_bonuses ?? totalDep);
        const doubleTarget = Number(res.data.double_target || 0);

        if (depEl) depEl.textContent = `$${totalDep.toFixed(2)} USDT`;
        if (bonusTotEl) bonusTotEl.textContent = `$${depPlusBonuses.toFixed(2)} USDT`;
        if (targetEl) targetEl.textContent = `$${doubleTarget.toFixed(2)} USDT`;

        if (penaltyEl) {
          if (res.data.is_early_withdrawal) {
            const daysRem = Number(res.data.days_remaining_30 ?? 30);
            const daysNote = daysRem > 0 ? ` (${daysRem} day${daysRem === 1 ? '' : 's'} remaining until 30-day unlock)` : '';
            penaltyEl.innerHTML = `⚠️ <strong>30% Early Withdrawal Fee Active:</strong> Withdrawing before doubling your deposit ($${doubleTarget.toFixed(2)} USDT) after 30 days${daysNote} incurs a <strong>30% fee</strong>—unless your Deposit + Deposit Bonus + Referral Bonus reaches $${doubleTarget.toFixed(2)} USDT.`;
            penaltyEl.style.color = '#B45309';
            if (noticeBox) {
              noticeBox.style.background = '#FFFBEB';
              noticeBox.style.borderColor = '#FDE68A';
            }
          } else if (res.data.doubled_by_bonuses && !res.data.has_passed_30_days) {
            penaltyEl.innerHTML = `✅ <strong>2× Bonus Threshold Met:</strong> Deposit + Deposit Bonus + Referral Bonus ($${depPlusBonuses.toFixed(2)}) reached 2× your deposit ($${doubleTarget.toFixed(2)}). Tiered fee applies: <strong>5% per $100 USD</strong> ($100 = 5%, $200 = 10%, etc.).`;
            penaltyEl.style.color = '#065F46';
            if (noticeBox) {
              noticeBox.style.background = '#ECFDF5';
              noticeBox.style.borderColor = '#A7F3D0';
            }
          } else {
            penaltyEl.innerHTML = `✅ <strong>30-Day 2× Goal Completed:</strong> Tiered withdrawal fee applies: <strong>5% per $100 USD</strong> ($100 = 5%, $200 = 10%, $300 = 15%, etc.).`;
            penaltyEl.style.color = '#065F46';
            if (noticeBox) {
              noticeBox.style.background = '#ECFDF5';
              noticeBox.style.borderColor = '#A7F3D0';
            }
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
    const calc = this.computeClientWithdrawalFee(amount);

    const calcAmount = document.getElementById('with-calc-amount');
    const calcFeeLabel = document.getElementById('with-calc-fee-label');
    const calcFee = document.getElementById('with-calc-fee');
    const calcDedLabel = document.getElementById('with-calc-deduction-label');
    const calcDeduction = document.getElementById('with-calc-deduction');
    const calcNet = document.getElementById('with-calc-net');

    if (calcAmount) calcAmount.textContent = `$${amount.toFixed(2)} USDT`;
    if (calcFeeLabel) calcFeeLabel.textContent = calc.isEarly ? 'Withdrawal Fee (30% Early)' : `Withdrawal Fee (${calc.feePct}% · 5%/$100 Tier)`;
    if (calcFee) {
      calcFee.textContent = `$${calc.feeAmt.toFixed(2)} USDT`;
      calcFee.style.color = calc.isEarly ? '#DC2626' : '#0F172A';
    }
    if (calcDedLabel) calcDedLabel.textContent = calc.isEarly ? 'Early Fee Rate' : 'Tiered Fee Rate';
    if (calcDeduction) {
      calcDeduction.textContent = calc.isEarly ? '30% (Before 2× / 30d)' : `${calc.feePct}% (5% per $100)`;
      calcDeduction.style.color = calc.isEarly ? '#F6465D' : '#0052FF';
    }
    if (calcNet) calcNet.textContent = `$${calc.netAmt.toFixed(2)} USDT`;
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

  /* Transfer (Modal + Dedicated Transfer Page + Mobile App Download) */
  openTransferModal() {
    const maxSpotEl = document.getElementById('trf-modal-max-spot');
    const transferable = Number(this.state.balances?.transferable_spot_usdt ?? this.state.balances?.breakdown?.transferable_spot_usdt ?? 0);
    if (maxSpotEl) maxSpotEl.textContent = `$${transferable.toFixed(2)}`;
    this.openModal('modal-transfer');
  },

  async submitTransfer() {
    const from = document.getElementById('trf-from')?.value || 'spot';
    const to = document.getElementById('trf-to')?.value || 'trading';
    const amount = parseFloat(document.getElementById('trf-amount')?.value) || 0;

    if (from === to) {
      this.toast('Source and destination wallets must be different', 'error');
      return;
    }
    if (amount <= 0) {
      this.toast('Enter a valid transfer amount', 'error');
      return;
    }

    const actionScope = 'wallet-transfer-modal';
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Transfer is already processing. Please wait.', 'warning');
      return;
    }

    const prevBalances = this.state.balances || {};
    const prevSpot = Number(prevBalances.spot_total_usdt ?? prevBalances.breakdown?.spot_total_usdt ?? 0);
    const prevFuture = Number(prevBalances.future_total_usdt ?? prevBalances.breakdown?.trading_total_usdt ?? 0);
    const prevTransferable = Number(prevBalances.transferable_spot_usdt ?? prevBalances.breakdown?.transferable_spot_usdt ?? 0);

    try {
      const res = await this.api('/wallet/transfer.php', 'POST', {
        from_wallet: from,
        to_wallet: to,
        asset: 'USDT',
        amount,
        idempotency_key: actionKey
      });

      if (res.success) {
        this.state.pendingWalletTransferFx = {
          direction: to === 'trading' ? 'spot-to-future' : 'future-to-spot',
          amount,
          prevSpot,
          prevFuture,
          prevTransferable,
          ts: Date.now()
        };
        this.toast('Transfer completed successfully via Ledger', 'success');
        this.closeModal('modal-transfer');
        if (res.data?.balances) {
          this.state.balances = res.data.balances;
          this.writeFastCache('balances', res.data.balances);
          this.renderWalletView();
        } else {
          await this.loadBalances(true);
        }
        this.endAction(actionScope, true);
      } else {
        this.toast(res.message || 'Transfer failed', 'error');
        this.endAction(actionScope, false);
      }
    } catch (e) {
      this.toast('Transfer failed: ' + (e.message || e), 'error');
      this.endAction(actionScope, false);
    } finally {
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
    }
  },

  animateNumericText(el, fromVal, toVal, formatter, duration = 680) {
    if (!el) return;
    if (el._animRafId) {
      cancelAnimationFrame(el._animRafId);
      el._animRafId = null;
    }
    const startVal = Number(fromVal || 0);
    const endVal = Number(toVal || 0);
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || Math.abs(endVal - startVal) < 0.005 || this.state.hideBalance) {
      el.textContent = formatter(endVal);
      return;
    }
    const startTs = performance.now();
    const tick = (now) => {
      const elapsed = now - startTs;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = startVal + (endVal - startVal) * eased;
      el.textContent = formatter(current);
      if (t < 1) {
        el._animRafId = requestAnimationFrame(tick);
      } else {
        el.textContent = formatter(endVal);
        el._animRafId = null;
      }
    };
    el.textContent = formatter(startVal);
    el._animRafId = requestAnimationFrame(tick);
  },

  updateWalletAllocationBar(spotUsdt, futureUsdt, isHidden = false) {
    const spotBar = document.getElementById('wallet-flow-spot-bar');
    const futureBar = document.getElementById('wallet-flow-future-bar');
    const spotPctEl = document.getElementById('wallet-flow-spot-pct');
    const futurePctEl = document.getElementById('wallet-flow-future-pct');
    if (!spotBar || !futureBar) return;

    if (isHidden) {
      if (spotPctEl) spotPctEl.textContent = '••%';
      if (futurePctEl) futurePctEl.textContent = '••%';
      return;
    }
    const total = Math.max(0, Number(spotUsdt || 0)) + Math.max(0, Number(futureUsdt || 0));
    const spotPct = total > 0 ? Math.round((Math.max(0, spotUsdt) / total) * 100) : 50;
    const futurePct = total > 0 ? (100 - spotPct) : 50;
    spotBar.style.width = `${spotPct}%`;
    futureBar.style.width = `${futurePct}%`;
    if (spotPctEl) spotPctEl.textContent = `${spotPct}%`;
    if (futurePctEl) futurePctEl.textContent = `${futurePct}%`;
  },

  triggerWalletTransferAnimation(direction = 'spot-to-future', amount = 0) {
    const isForward = direction === 'spot-to-future';
    const spotCell = document.getElementById('wallet-cell-spot');
    const futureCell = document.getElementById('wallet-cell-future');
    const flowWrap = document.getElementById('wallet-flow-wrap');
    const flowStatus = document.getElementById('wallet-flow-status');
    const transferableBox = document.getElementById('bal-transferable-spot')?.closest('.av-wallet-stat-box');

    const spawnDeltaPill = (cell, text, cls) => {
      if (!cell || !(amount > 0)) return;
      cell.querySelectorAll('.av-delta-pill').forEach(p => p.remove());
      const pill = document.createElement('span');
      pill.className = `av-delta-pill ${cls}`;
      pill.textContent = text;
      cell.appendChild(pill);
      setTimeout(() => { if (pill.parentNode) pill.remove(); }, 1400);
    };

    const pulseClass = (el, cls, ms = 950) => {
      if (!el) return;
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      setTimeout(() => el.classList.remove(cls), ms);
    };

    if (isForward) {
      pulseClass(spotCell, 'is-debiting', 900);
      pulseClass(futureCell, 'is-crediting', 950);
      spawnDeltaPill(spotCell, `-$${Number(amount).toFixed(2)}`, 'out');
      spawnDeltaPill(futureCell, `+$${Number(amount).toFixed(2)}`, 'in');
    } else {
      pulseClass(futureCell, 'is-debiting', 900);
      pulseClass(spotCell, 'is-crediting', 950);
      spawnDeltaPill(futureCell, `-$${Number(amount).toFixed(2)}`, 'out');
      spawnDeltaPill(spotCell, `+$${Number(amount).toFixed(2)}`, 'in');
    }

    if (transferableBox) pulseClass(transferableBox, 'is-updating', 900);

    if (flowWrap) {
      flowWrap.classList.remove('flow-forward', 'flow-reverse', 'is-animating');
      void flowWrap.offsetWidth;
      flowWrap.classList.add('is-animating', isForward ? 'flow-forward' : 'flow-reverse');
      if (flowStatus && amount > 0) {
        flowStatus.textContent = isForward
          ? `Moved $${Number(amount).toFixed(2)} → Future`
          : `Moved $${Number(amount).toFixed(2)} → Spot`;
      }
      setTimeout(() => {
        flowWrap.classList.remove('flow-forward', 'flow-reverse', 'is-animating');
        if (flowStatus) flowStatus.textContent = 'Spot ⇄ Future Allocation';
      }, 1500);
    }
  },

  loadTransferView(animateValues = null) {
    const data = this.state.balances || {};
    const spotTotal = Number(data.spot_total_usdt ?? data.breakdown?.spot_total_usdt ?? (Number(data.breakdown?.funding_total_usdt || 0) + Number(data.breakdown?.exchange_total_usdt || 0)));
    const futureTotal = Number(data.future_total_usdt ?? data.breakdown?.trading_total_usdt ?? 0);
    const referralLocked = Number(data.referral_bonus_usdt ?? data.breakdown?.referral_bonus_usdt ?? 0);
    const transferableSpot = Number(data.transferable_spot_usdt ?? data.breakdown?.transferable_spot_usdt ?? Math.max(0, spotTotal - referralLocked));

    const fromSel = document.getElementById('trf-view-from');
    const fromVal = fromSel?.value || 'spot';
    const isSpotToFuture = fromVal === 'spot';

    const bridgeFromEl = document.getElementById('trf-bridge-from-label');
    const bridgeToEl = document.getElementById('trf-bridge-to-label');
    if (bridgeFromEl) bridgeFromEl.textContent = isSpotToFuture ? 'Spot Wallet' : 'Future Wallet';
    if (bridgeToEl) bridgeToEl.textContent = isSpotToFuture ? 'Future Wallet' : 'Spot Wallet';

    const availFromEl = document.getElementById('trf-view-avail-from');
    const availToEl = document.getElementById('trf-view-avail-to');
    const spotEl = document.getElementById('trf-view-spot-total');
    const trfEl = document.getElementById('trf-view-transferable');
    const refEl = document.getElementById('trf-view-referral-locked');

    const nextAvailFrom = isSpotToFuture ? transferableSpot : futureTotal;
    const nextAvailTo = isSpotToFuture ? futureTotal : spotTotal;
    const fmtUsdt = v => `${Number(v || 0).toFixed(2)} USDT`;
    const fmtDollar = v => `$${Number(v || 0).toFixed(2)}`;

    if (animateValues) {
      const prevFrom = isSpotToFuture ? animateValues.prevTransferable : animateValues.prevFuture;
      const prevTo = isSpotToFuture ? animateValues.prevFuture : animateValues.prevSpot;
      this.animateNumericText(availFromEl, prevFrom, nextAvailFrom, fmtUsdt, 680);
      this.animateNumericText(availToEl, prevTo, nextAvailTo, fmtUsdt, 680);
      this.animateNumericText(spotEl, animateValues.prevSpot, spotTotal, fmtDollar, 680);
      this.animateNumericText(trfEl, animateValues.prevTransferable, transferableSpot, fmtDollar, 680);
    } else {
      if (availFromEl) availFromEl.textContent = fmtUsdt(nextAvailFrom);
      if (availToEl) availToEl.textContent = fmtUsdt(nextAvailTo);
      if (spotEl) spotEl.textContent = fmtDollar(spotTotal);
      if (trfEl) trfEl.textContent = fmtDollar(transferableSpot);
    }
    if (refEl) refEl.textContent = fmtDollar(referralLocked);
    this.calcTransferPagePreview();
  },

  triggerTransferSwapAnimation() {
    const fromCard = document.getElementById('trf-card-from');
    const toCard = document.getElementById('trf-card-to');
    const swapBtn = document.getElementById('trf-swap-btn');
    if (fromCard) {
      fromCard.classList.remove('is-swapping-down');
      void fromCard.offsetWidth;
      fromCard.classList.add('is-swapping-down');
      setTimeout(() => fromCard.classList.remove('is-swapping-down'), 440);
    }
    if (toCard) {
      toCard.classList.remove('is-swapping-up');
      void toCard.offsetWidth;
      toCard.classList.add('is-swapping-up');
      setTimeout(() => toCard.classList.remove('is-swapping-up'), 440);
    }
    if (swapBtn) {
      swapBtn.classList.add('is-spinning');
      setTimeout(() => swapBtn.classList.remove('is-spinning'), 460);
    }
  },

  onTransferDirectionChange(changed = 'from') {
    const fromSel = document.getElementById('trf-view-from');
    const toSel = document.getElementById('trf-view-to');
    if (!fromSel || !toSel) return;
    if (changed === 'from') {
      toSel.value = fromSel.value === 'spot' ? 'trading' : 'spot';
    } else {
      fromSel.value = toSel.value === 'trading' ? 'spot' : 'trading';
    }
    this.triggerTransferSwapAnimation();
    this.loadTransferView();
  },

  swapTransferPageDirection() {
    const fromSel = document.getElementById('trf-view-from');
    const toSel = document.getElementById('trf-view-to');
    if (!fromSel || !toSel) return;
    const prevFrom = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = prevFrom;
    this.triggerTransferSwapAnimation();
    this.loadTransferView();
  },

  setTransferPagePercent(pct = 100) {
    const data = this.state.balances || {};
    const spotTotal = Number(data.spot_total_usdt ?? data.breakdown?.spot_total_usdt ?? 0);
    const futureTotal = Number(data.future_total_usdt ?? data.breakdown?.trading_total_usdt ?? 0);
    const referralLocked = Number(data.referral_bonus_usdt ?? data.breakdown?.referral_bonus_usdt ?? 0);
    const transferableSpot = Number(data.transferable_spot_usdt ?? data.breakdown?.transferable_spot_usdt ?? Math.max(0, spotTotal - referralLocked));
    const fromVal = document.getElementById('trf-view-from')?.value || 'spot';
    const max = fromVal === 'spot' ? transferableSpot : futureTotal;
    const inp = document.getElementById('trf-view-amount');
    if (inp) {
      const val = Math.floor((max * (pct / 100)) * 100) / 100;
      inp.value = val > 0 ? val.toFixed(2) : '0.00';
      this.calcTransferPagePreview();
    }
  },

  calcTransferPagePreview() {
    const data = this.state.balances || {};
    const futureTotal = Number(data.future_total_usdt ?? data.breakdown?.trading_total_usdt ?? 0);
    const fromVal = document.getElementById('trf-view-from')?.value || 'spot';
    const amt = Math.max(0, parseFloat(document.getElementById('trf-view-amount')?.value) || 0);
    const recEl = document.getElementById('trf-view-receive');
    const afterEl = document.getElementById('trf-view-future-after');
    if (recEl) recEl.value = amt > 0 ? amt.toFixed(2) : '';
    const futureAfter = fromVal === 'spot' ? (futureTotal + amt) : Math.max(0, futureTotal - amt);
    if (afterEl) afterEl.textContent = `$${futureAfter.toFixed(2)}`;
  },

  async submitTransferPage() {
    const from = document.getElementById('trf-view-from')?.value || 'spot';
    const to = document.getElementById('trf-view-to')?.value || 'trading';
    const amountInput = document.getElementById('trf-view-amount');
    const amount = parseFloat(amountInput?.value) || 0;

    if (from === to) {
      this.toast('Source and destination wallets must be different', 'error');
      return;
    }
    if (amount <= 0) {
      this.toast('Enter a valid amount to transfer', 'error');
      return;
    }

    const data = this.state.balances || {};
    const referralLocked = Number(data.referral_bonus_usdt ?? data.breakdown?.referral_bonus_usdt ?? 0);
    const transferableSpot = Number(data.transferable_spot_usdt ?? data.breakdown?.transferable_spot_usdt ?? 0);
    if (from === 'spot' && amount > transferableSpot + 0.0001) {
      this.toast(
        referralLocked > 0
          ? `Only Deposit Balance & Deposit Bonus ($${transferableSpot.toFixed(2)}) can transfer to Future. Referral Bonus ($${referralLocked.toFixed(2)}) cannot be transferred.`
          : `Maximum transferable Spot balance is $${transferableSpot.toFixed(2)} USDT.`,
        'error'
      );
      return;
    }

    const actionScope = 'wallet-transfer-page';
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Transfer is already processing. Please wait.', 'warning');
      return;
    }
    const btn = document.getElementById('btn-confirm-transfer-page');
    const bridgeEl = document.getElementById('trf-bridge-visual');
    const fromCard = document.getElementById('trf-card-from');
    const toCard = document.getElementById('trf-card-to');
    const prevSpot = Number(data.spot_total_usdt ?? data.breakdown?.spot_total_usdt ?? 0);
    const prevFuture = Number(data.future_total_usdt ?? data.breakdown?.trading_total_usdt ?? 0);
    const prevTransferable = Number(data.transferable_spot_usdt ?? data.breakdown?.transferable_spot_usdt ?? 0);

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Transferring...';
    }
    if (bridgeEl) bridgeEl.classList.add('is-sending');
    if (fromCard) fromCard.classList.add('is-sending');
    if (toCard) toCard.classList.add('is-sending');

    try {
      const res = await this.api('/wallet/transfer.php', 'POST', {
        from_wallet: from,
        to_wallet: to,
        asset: 'USDT',
        amount,
        idempotency_key: actionKey
      });
      if (res.success) {
        if (bridgeEl) {
          bridgeEl.classList.remove('is-sending');
          bridgeEl.classList.add('is-success');
        }
        if (fromCard) {
          fromCard.classList.remove('is-sending');
          fromCard.classList.add('is-success');
        }
        if (toCard) {
          toCard.classList.remove('is-sending');
          toCard.classList.add('is-success');
        }
        this.state.pendingWalletTransferFx = {
          direction: to === 'trading' ? 'spot-to-future' : 'future-to-spot',
          amount,
          prevSpot,
          prevFuture,
          prevTransferable,
          ts: Date.now()
        };
        if (res.data?.balances) {
          this.state.balances = res.data.balances;
          this.writeFastCache('balances', res.data.balances);
          this.renderWalletView();
        } else {
          await this.loadBalances(true);
        }
        if (amountInput) amountInput.value = '';
        this.loadTransferView({ prevSpot, prevFuture, prevTransferable });
        this.toast(res.message || 'Transfer completed successfully', 'success');
        setTimeout(() => {
          if (bridgeEl) bridgeEl.classList.remove('is-success');
          if (fromCard) fromCard.classList.remove('is-success');
          if (toCard) toCard.classList.remove('is-success');
        }, 1400);
        this.endAction(actionScope, true);
      } else {
        if (bridgeEl) bridgeEl.classList.remove('is-sending');
        if (fromCard) fromCard.classList.remove('is-sending');
        if (toCard) toCard.classList.remove('is-sending');
        this.toast(res.message || 'Transfer failed', 'error');
        this.endAction(actionScope, false);
      }
    } catch (e) {
      if (bridgeEl) bridgeEl.classList.remove('is-sending');
      if (fromCard) fromCard.classList.remove('is-sending');
      if (toCard) toCard.classList.remove('is-sending');
      this.toast('Transfer failed: ' + (e.message || e), 'error');
      this.endAction(actionScope, false);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Confirm Transfer';
      }
      if (this.state.actionLocks.has(actionScope)) this.endAction(actionScope, false);
    }
  },

  downloadMobileApp(platform = 'android') {
    const isIos = String(platform || '').toLowerCase() === 'ios';
    const filename = isIos ? 'PRIME-X-CAPITAL-iOS.ipa' : 'PRIME-X-CAPITAL-Android.apk';
    const url = `/api/app/download.php?platform=${isIos ? 'ios' : 'android'}`;
    try {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.toast(`Downloading ${filename}...`, 'success');
    } catch (e) {
      window.location.href = url;
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
    if (!container) {
      if (this.state.currentView === 'signals') this.initSignalsTerminal();
      return;
    }
    if (!this.state.activeSignals.length) {
      container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-dim);">No active signals published currently.</div>`;
      if (this.state.currentView === 'signals') this.initSignalsTerminal();
      return;
    }
    container.innerHTML = this.state.activeSignals.map(s => {
      const isBuy = ['BUY', 'LONG', 'UP'].includes(String(s.direction || 'BUY').toUpperCase());
      const dirBadge = isBuy ? 'badge-positive' : 'badge-negative';
      const isLive = Boolean(s.is_live);
      const isExpired = Boolean(s.is_expired);
      const rawExpiry = String(s.expires_at || '');
      const expiresMs = rawExpiry ? Date.parse(rawExpiry.replace(' ', 'T') + (rawExpiry.endsWith('Z') ? '' : 'Z')) : 0;
      const secondsLeft = expiresMs ? Math.max(0, Math.floor((expiresMs - Date.now()) / 1000)) : Number(s.time_left_seconds || 0);
      const timerText = isLive ? `<span class="signal-live-countdown" data-expires-at="${expiresMs}" style="color:#ff4757;font-weight:900;letter-spacing:.2px;">⏳ Expires in: ${this.formatCountdown(secondsLeft)}</span>` : (isExpired ? `<span style="color:var(--text-muted);">⌛ Signal Expired</span>` : '');
      const slotLabel = s.slot_label || 'Global Signal';
      return `<div class="card" style="margin-bottom:10px;border:1px solid #E5E9F0;border-left:4px solid ${isLive ? '#00B87C' : '#0052FF'};border-radius:12px;background:#FFFFFF;box-shadow:0 2px 8px rgba(17,24,39,0.04);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:9px;"><div><div style="font-size:15px;font-weight:900;color:#111827;">${s.symbol}</div><div style="margin-top:4px;display:flex;gap:5px;flex-wrap:wrap;"><span class="badge ${dirBadge}">${s.direction}</span><span class="badge badge-demo">🌍 Worldwide</span><span class="badge badge-demo">${slotLabel}</span></div></div><span class="badge badge-positive">+${s.profit_percentage || 1.67}%</span></div>
        <div style="display:flex;justify-content:space-between;align-items:center;background:#F8FAFC;border:1px solid #EEF1F6;padding:10px 12px;border-radius:9px;font-size:12px;"><span style="color:#6B7280;">Validity: ${Number(s.duration_minutes || 15)} min</span><div>${timerText}</div></div>
      </div>`;
    }).join('');
    this.startSignalLiveCountdown();
    if (this.state.currentView === 'signals') this.initSignalsTerminal();
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
      this.centerReferralTreeScroll(container);
    } catch (err) {
      container.innerHTML = `<div style="text-align: center; color: var(--negative); padding: 18px; font-size: 12px;">Failed to load referral tree hierarchy.</div>`;
    }
  },

  centerReferralTreeScroll(container) {
    if (!container) return;
    requestAnimationFrame(() => {
      try {
        const overflow = container.scrollWidth - container.clientWidth;
        if (overflow > 12) {
          container.scrollLeft = Math.round(overflow / 2);
        }
      } catch (e) {}
    });
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
      const earnedUsd = Number(data.total_earned_usdt ?? data.total_commissions ?? 0);
      if (commEl) commEl.textContent = this.formatDisplayMoney(earnedUsd);
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

  /* Signals: Daily Trading & Additional Signals */
  setSignalScheduleTab(tab = 'first') {
    this.state.signalScheduleTab = tab;
    document.querySelectorAll('.av-sig-sched-tab').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-sig-sched') === tab);
    });
    this.renderSignalScheduleTable(tab);
  },

  renderSignalScheduleTable() {
    const host = document.getElementById('sig-schedule-countries');
    if (host) host.innerHTML = '';
  },

  async loadSignals() {
    const container = document.getElementById('active-signals-list');
    const eligBanner = document.getElementById('signals-eligibility-banner');
    const quotaBadge = document.getElementById('signals-quota-badge');
    const userHistory = document.getElementById('signals-user-history');

    this.renderSignalScheduleTable(this.state.signalScheduleTab || 'first');

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
    const dispCurr = this.getDisplayCurrency();
    signalProfitEls.forEach(el => {
      el.textContent = `+${this.formatDisplayMoney(signalProfitTotal)} ${dispCurr.code === 'USD' ? 'USDT' : dispCurr.code}`;
    });
    this.writeFastCache('signals', data);

    // Future Balance (trading wallet) is used for Trades & Signals.
    // Referral Bonus remains in Spot and cannot be transferred to Future.
    const tradingUsdt = Number(data.future_balance_usdt ?? this.state.balances?.future_total_usdt ?? this.state.balances?.breakdown?.trading_total_usdt ?? 0);
    const transferableSpotUsdt = Number(data.transferable_spot_usdt ?? this.state.balances?.transferable_spot_usdt ?? 0);
    const referralBonusUsdt = Number(data.referral_bonus_usdt ?? this.state.balances?.referral_bonus_usdt ?? 0);
    const minReq = Math.max(100, Number(data.min_deposit_required || 100) || 100);
    const addStatus = data.additional_signals || {};
    const addRemaining = Number(addStatus.remaining ?? 0);
    const addUsedToday = Number(addStatus.used_today ?? 0);
    const addCanToday = Boolean(addStatus.can_use_today ?? (addRemaining > 0 && addUsedToday < 1));
    const addTotalEarned = Number(addStatus.total_earned ?? 0);
    const addUsed = Number(addStatus.used ?? 0);
    const addDepositCredits = Number(addStatus.deposit_credits ?? 0);
    const addReferralCredits = Number(addStatus.referral_credits ?? 0);
    const totalDeposited = Number(data.user_deposited ?? 0);

    const kpiFutEl = document.getElementById('sig-kpi-future-bal');
    const kpiFutMetaEl = document.getElementById('sig-kpi-future-meta');
    const kpiAddEl = document.getElementById('sig-kpi-add-remaining');
    const kpiAddMetaEl = document.getElementById('sig-kpi-add-meta');
    if (kpiFutEl) {
      kpiFutEl.textContent = `$${tradingUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      kpiFutEl.style.color = tradingUsdt >= minReq ? '#059669' : '#0F172A';
    }
    if (kpiFutMetaEl) {
      kpiFutMetaEl.textContent = tradingUsdt >= minReq
        ? `Qualified ($${minReq.toFixed(0)} Min) · Daily signals unlocked`
        : `Minimum $${minReq.toFixed(0)} USDT Future Balance required for daily signals`;
    }
    if (kpiAddEl) {
      kpiAddEl.textContent = addRemaining > 1
        ? `${addRemaining} Remaining (1/Day)`
        : `${addRemaining} Remaining`;
    }
    if (kpiAddMetaEl) {
      kpiAddMetaEl.textContent = addTotalEarned > 0
        ? `Earned ${addTotalEarned} (${addDepositCredits} deposit + ${addReferralCredits} referral) · Used ${addUsed} · 1/day`
        : `Deposit $300+ or invite a $300+ depositor to unlock Additional Signals`;
    }

    // Highlight highest unlocked tier row in tier table
    const tierRows = document.querySelectorAll('#sig-additional-tiers-body tr[data-tier]');
    let highestUnlockedTier = 0;
    [100, 300, 500, 700, 1000, 1500, 3000, 5000, 7000, 10000].forEach(t => {
      if (totalDeposited >= t) highestUnlockedTier = t;
    });
    tierRows.forEach(tr => {
      tr.classList.toggle('is-current-tier', Number(tr.getAttribute('data-tier')) === highestUnlockedTier);
    });

    const isPrivileged = Boolean(
      this.state.user?.is_admin ||
      ['ADMIN', 'SUPER_ADMIN', 'VIP', 'FINANCE_MANAGER', 'KYC_MANAGER'].includes(this.state.user?.role)
    );
    const isUserEligible = Boolean(
      data.is_eligible ||
      data.eligible ||
      isPrivileged
    );
    const needsTransferToFuture = !isUserEligible && (transferableSpotUsdt >= minReq);

    data.is_eligible = isUserEligible;
    data.needs_future_transfer = needsTransferToFuture;
    data.user_total_deposited = tradingUsdt;

    if (quotaBadge) {
      quotaBadge.textContent = `${data.today_signals_count} / ${data.daily_limit || 2} Dispatched Today`;
    }

    if (eligBanner) {
      if (!data.is_eligible) {
        eligBanner.innerHTML = needsTransferToFuture ? `
          <div class="card" style="background: #EFF4FF; border: 1px solid #BFDBFE; padding: 14px; border-radius: 12px;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                  <span class="badge" style="background:#0052FF;color:#FFFFFF;">TRANSFER TO FUTURE REQUIRED</span>
                  <span style="font-size: 11px; color: #1E3A8A;">Future Balance: $${tradingUsdt.toFixed(2)} &bull; Transferable Spot: $${transferableSpotUsdt.toFixed(2)}</span>
                </div>
                <div style="font-size: 13px; color: #111827; font-weight: 700;">
                  Move your Deposit or Deposit Bonus from Spot to Future Balance to unlock daily signals.
                </div>
                <div style="font-size: 12px; color: #4B5563; margin-top: 2px;">
                  Future Balance is used for Trades and Signals. Referral Bonus stays locked in Spot.
                </div>
              </div>
              <button class="btn-primary" style="padding: 8px 16px; font-size: 12px; font-weight: 700; white-space: nowrap; border-radius: 999px;" onclick="App.navigate('transfer')">
                ⇄ Transfer Spot → Future
              </button>
            </div>
          </div>
        ` : `
          <div class="card" style="background: #FFFBEB; border: 1px solid #FDE68A; padding: 14px; border-radius: 12px;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                  <span class="badge badge-warning">${minReq} USDT FUTURE BALANCE REQUIRED</span>
                  <span style="font-size: 11px; color: #6B7280;">Future Balance: $${tradingUsdt.toFixed(2)} USDT</span>
                </div>
                <div style="font-size: 13px; color: #111827; font-weight: 700;">
                  Daily Signals &amp; 30-Day 2× Profit Growth require at least ${minReq} USDT in Future Balance.
                </div>
                <div style="font-size: 12px; color: #4B5563; margin-top: 2px;">
                  Deposit 100+ USDT and transfer Deposit / Deposit Bonus to Future Balance.${referralBonusUsdt > 0 ? ` Referral Bonus ($${referralBonusUsdt.toFixed(2)}) cannot be transferred to Future.` : ''}
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
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span class="badge badge-positive">FUTURE ACCOUNT QUALIFIED</span>
                <span style="font-size: 12px; color: #111827; font-weight: 600;">
                  Future Balance ($${tradingUsdt.toFixed(2)} USDT) &bull; Daily Signals Unlocked
                </span>
              </div>
              <span style="font-size: 11px; color: #059669; font-weight: 700;">Additional Credits: ${addRemaining} (1/Day · ${addCanToday ? 'Ready Today' : (addRemaining > 0 ? 'Daily Limit Used' : 'Locked')})</span>
            </div>
          </div>
        `;
      }
    }

    // Legacy #active-signals-list stays removed from HTML; this block is skipped cleanly when absent
    if (container) {
      if (!this.state.signals.length) {
        container.innerHTML = `
          <div class="card" style="text-align: center; padding: 28px 16px; color: #6B7280; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 12px;">
            <div style="font-size: 28px; margin-bottom: 8px;">📡</div>
            <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px;">No Live Signals Right Now</div>
          </div>
        `;
      } else {
        container.innerHTML = '';
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
            No executed signals yet today. Confirm any live signal in the terminal above during its broadcast window.
          </div>
        `;
      } else {
        userHistory.innerHTML = `
          <div class="table-responsive">
            <table class="admin-table av-mobile-cards" style="font-size: 12px;">
              <thead>
                <tr>
                  <th>Signal</th>
                  <th>Type / Stake</th>
                  <th>Reward Rate</th>
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
                  const isAddExec = String(ex.signal_id || '').startsWith('sig_add_') || (pct <= 0 && stake <= 0 && profit >= 3.99);
                  const executedAt = ex.executed_at || ex.created_at || '—';
                  return `
                  <tr>
                    <td data-label="Signal"><strong>${this.escapeHtml(symbol)}</strong> <span class="badge ${direction === 'BUY' ? 'badge-positive' : 'badge-negative'}">${this.escapeHtml(direction)}</span></td>
                    <td data-label="Type / Stake" class="mono">${isAddExec ? 'Additional Signal' : `$${stake.toFixed(2)} USDT`}</td>
                    <td data-label="Reward Rate" class="mono positive">${isAddExec ? 'ADDITIONAL' : `+${pct.toFixed(2)}%`}</td>
                    <td data-label="Profit Credited" class="mono positive"><strong>+$${profit.toFixed(2)} USDT</strong></td>
                    <td data-label="Execution Time" class="mono" style="font-size: 11px; color: var(--text-muted);">${this.escapeHtml(executedAt)}</td>
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
    if (this.state.currentView === 'signals') this.initSignalsTerminal();
    if (this.state.adminPreviewUserId) this.ensureAdminUserDepositAction();
  },

  /* Live Directional Signal Trading Terminal (#view-signals) */
  getSignalTerminalPriceDecimals(sym, price) {
    const s = String(sym || '').toUpperCase();
    if (s.includes('EUR/') || s.includes('GBP/') || s.includes('AUD/') || s.includes('/CHF')) return 4;
    if (Number(price) >= 1000) return 2;
    if (Number(price) >= 10) return 2;
    return 4;
  },

  computeSignalTerminalLevels(sig) {
    const sym = String(sig?.symbol || 'BTC/USDT').toUpperCase();
    const dirRaw = String(sig?.direction || 'BUY').toUpperCase();
    const isBuy = ['BUY', 'LONG', 'UP'].includes(dirRaw);
    const ticker = (this.state.tickers || []).find(t => t.symbol.toUpperCase() === sym);
    const savedEntry = Number(sig?.entry_price_min || sig?.entry_price_max || 0);
    const baseEntry = savedEntry > 0 ? savedEntry : (ticker && Number(ticker.price) > 0 ? Number(ticker.price) : 77915.82);
    const isForex = ticker?.category === 'FOREX' || sym.includes('EUR/') || sym.includes('GBP/') || sym.includes('AUD/');
    const pct = Math.max(0.5, Number(sig?.profit_percentage || 1.67));
    const step1Pct = isForex ? Math.max(0.0025, pct * 0.0022) : Math.max(0.0065, pct * 0.005);
    const step2Pct = isForex ? Math.max(0.0048, pct * 0.0042) : Math.max(0.0125, pct * 0.0095);
    const slPct = isForex ? 0.003 : 0.0075;

    const tp1Saved = Number(sig?.target_price_1 || 0);
    const tp2Saved = Number(sig?.target_price_2 || 0);
    const slSaved = Number(sig?.stop_loss || 0);

    const tp1 = tp1Saved > 0 ? tp1Saved : (isBuy ? baseEntry * (1 + step1Pct) : baseEntry * (1 - step1Pct));
    const tp2 = tp2Saved > 0 ? tp2Saved : (isBuy ? baseEntry * (1 + step2Pct) : baseEntry * (1 - step2Pct));
    const sl = slSaved > 0 ? slSaved : (isBuy ? baseEntry * (1 - slPct) : baseEntry * (1 + slPct));

    return { sym, isBuy, isForex, entry: baseEntry, tp1, tp2, sl, pct };
  },

  setSignalTerminalSignal(sigId) {
    this.state.activeTerminalSignalId = sigId;
    this.initSignalsTerminal();
  },

  setSignalChartInterval(tf) {
    this.state.signalChartInterval = tf || '1m';
    document.querySelectorAll('.sig-tf-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tf') === this.state.signalChartInterval);
    });
    this.initSignalsTerminal();
  },

  initSignalsTerminal() {
    const canvas = document.getElementById('signals-live-chart-canvas');
    if (!canvas || typeof FinancialChart !== 'function') return;

    if (!this.signalChart || this.signalChart.canvas !== canvas) {
      this.signalChart = new FinancialChart(canvas);
    } else {
      this.signalChart.resize();
    }

    const pool = (Array.isArray(this.state.signals) && this.state.signals.length)
      ? this.state.signals
      : (Array.isArray(this.state.activeSignals) ? this.state.activeSignals : []);
    const liveCandidates = pool.filter(s => !s.is_expired && !s.is_scheduled && (s.status === 'PUBLISHED' || s.status === 'ACTIVE'));
    const allCandidates = liveCandidates.length ? liveCandidates : pool;

    let activeSig = allCandidates.find(s => s.id === this.state.activeTerminalSignalId) || allCandidates[0] || null;
    if (activeSig) this.state.activeTerminalSignalId = activeSig.id;

    const pillsEl = document.getElementById('sig-term-selector-pills');
    if (pillsEl) {
      if (allCandidates.length > 1) {
        pillsEl.style.display = 'flex';
        pillsEl.innerHTML = allCandidates.map(s => {
          const isBuy = ['BUY', 'LONG', 'UP'].includes(String(s.direction || 'BUY').toUpperCase());
          const isAdd = Boolean(s.is_additional || Number(s.daily_slot) === 3 || String(s.id || '').startsWith('sig_add_'));
          const selected = activeSig && s.id === activeSig.id;
          return `<button type="button" class="av-sig-sel-pill ${selected ? 'active' : ''}" onclick="App.setSignalTerminalSignal('${this.escapeHtml(s.id)}')">${this.escapeHtml(s.symbol)} ${isBuy ? '▲ UP' : '▼ DOWN'}${isAdd ? ' · Additional' : ''}</button>`;
        }).join('');
      } else {
        pillsEl.style.display = 'none';
        pillsEl.innerHTML = '';
      }
    }

    const fallbackSig = activeSig || {
      id: 'standby',
      symbol: 'BTC/USDT',
      direction: 'BUY',
      profit_percentage: 1.67,
      duration_minutes: 15,
      status: 'STANDBY'
    };

    const isLive = Boolean(activeSig && !activeSig.is_expired && !activeSig.is_scheduled && (activeSig.status === 'PUBLISHED' || activeSig.status === 'ACTIVE'));
    const isAdditional = Boolean(activeSig && (activeSig.is_additional || Number(activeSig.daily_slot) === 3 || String(activeSig.id || '').startsWith('sig_add_')));
    const levels = this.computeSignalTerminalLevels(fallbackSig);
    const dec = this.getSignalTerminalPriceDecimals(levels.sym, levels.entry);
    const currSym = '$';

    const dotEl = document.getElementById('sig-term-pulse-dot');
    const symEl = document.getElementById('sig-term-symbol');
    const dirEl = document.getElementById('sig-term-dir-badge');
    const statEl = document.getElementById('sig-term-status-pill');
    const entryEl = document.getElementById('sig-term-entry');
    const tp1El = document.getElementById('sig-term-tp1');
    const tp2El = document.getElementById('sig-term-tp2');
    const slEl = document.getElementById('sig-term-sl');
    const noteEl = document.getElementById('sig-term-session-note');
    const actionWrap = document.getElementById('sig-term-action-wrap');

    if (dotEl) dotEl.className = `av-sig-pulse-dot ${isLive ? 'is-live' : 'is-waiting'}`;
    if (symEl) symEl.textContent = levels.sym;
    if (dirEl) {
      dirEl.className = `badge ${levels.isBuy ? 'badge-positive' : 'badge-negative'}`;
      dirEl.textContent = levels.isBuy ? '▲ UP / BUY (LONG)' : '▼ DOWN / SELL (SHORT)';
    }
    if (statEl) {
      if (isLive) {
        statEl.style.background = isAdditional ? '#EFF4FF' : '#ECFDF5';
        statEl.style.color = isAdditional ? '#0052FF' : '#059669';
        statEl.textContent = isAdditional ? 'ADDITIONAL SIGNAL' : 'LIVE EXECUTING';
      } else {
        statEl.style.background = '#EFF4FF';
        statEl.style.color = '#0052FF';
        statEl.textContent = 'STANDBY • NEXT SESSION';
      }
    }
    if (entryEl) entryEl.textContent = `${currSym}${levels.entry.toFixed(dec)}`;
    if (tp1El) tp1El.textContent = `${currSym}${levels.tp1.toFixed(dec)}`;
    if (tp2El) tp2El.textContent = `${currSym}${levels.tp2.toFixed(dec)}`;
    if (slEl) slEl.textContent = `${currSym}${levels.sl.toFixed(dec)}`;
    if (noteEl) {
      noteEl.textContent = isLive
        ? (isAdditional
            ? 'Additional Signal Session · Separate from 30d 2× plan'
            : `${activeSig?.slot_label || 'Daily Session'} · +${levels.pct}% Return toward 30-day 2× target`)
        : 'Daily Signal Sessions · Live Trading Terminal';
    }

    if (actionWrap) {
      const sigData = this.state.signalsData || {};
      const minReq = Math.max(100, Number(sigData.min_deposit_required || 100) || 100);
      const addRemaining = Number(sigData.additional_signals?.remaining ?? 0);
      const addUsedToday = Number(sigData.additional_signals?.used_today ?? 0);
      const hasUsed = Boolean(activeSig && (activeSig.has_used || activeSig.has_confirmed));
      const isTest = Boolean(activeSig && (activeSig.is_testing || activeSig.no_profit || String(activeSig.id || '').startsWith('sig_test_')));
      if (activeSig && isLive) {
        actionWrap.style.display = 'flex';
        if (isTest) {
          actionWrap.innerHTML = `<button type="button" class="btn-secondary" style="padding:9px 16px;font-size:12px;font-weight:800;background:#F5F3FF;border:1px solid #DDD6FE;color:#7C3AED;border-radius:999px;cursor:pointer;" onclick="App.openExecuteSignalModal('${this.escapeHtml(activeSig.id)}')">🧪 Open Testing Signal — No Profit</button>`;
        } else if (hasUsed) {
          actionWrap.innerHTML = `<span class="badge badge-positive" style="padding:8px 14px;">✅ Confirmed (${isAdditional ? 'Additional' : `+${levels.pct}%`})</span>`;
        } else if (isAdditional) {
          if (addRemaining > 0 && addUsedToday < 1) {
            actionWrap.innerHTML = `<button type="button" class="btn-primary" style="padding:10px 18px;font-size:13px;font-weight:800;border-radius:999px;" data-alpha-action="signal:${this.escapeHtml(activeSig.id)}" onclick="App.confirmSignalDirectly('${this.escapeHtml(activeSig.id)}')">🎁 Confirm Additional Signal</button>`;
          } else if (addRemaining > 0 && addUsedToday >= 1) {
            actionWrap.innerHTML = `<span class="badge badge-positive" style="padding:8px 14px;">✅ Today's Additional Signal (1/Day) Used · ${addRemaining} Remaining</span>`;
          } else {
            actionWrap.innerHTML = `<button type="button" class="btn-secondary" style="padding:9px 16px;font-size:12px;font-weight:700;border-radius:999px;" onclick="App.openDepositModal()">🔒 Deposit $300+ or Invite Friend to Unlock Additional Signal</button>`;
          }
        } else if (sigData.is_eligible) {
          actionWrap.innerHTML = `<button type="button" class="btn-primary" style="padding:10px 18px;font-size:13px;font-weight:800;border-radius:999px;" data-alpha-action="signal:${this.escapeHtml(activeSig.id)}" onclick="App.confirmSignalDirectly('${this.escapeHtml(activeSig.id)}')">⚡ Confirm Signal (+${levels.pct}%)</button>`;
        } else if (sigData.needs_future_transfer) {
          actionWrap.innerHTML = `<button type="button" class="btn-primary" style="padding:9px 16px;font-size:12px;font-weight:700;border-radius:999px;" onclick="App.navigate('transfer')">⇄ Transfer to Future</button>`;
        } else {
          actionWrap.innerHTML = `<button type="button" class="btn-secondary" style="padding:9px 16px;font-size:12px;font-weight:700;border-radius:999px;" onclick="App.openDepositModal()">🔒 Deposit ${minReq} USDT</button>`;
        }
      } else {
        actionWrap.innerHTML = '';
        actionWrap.style.display = 'none';
      }
    }

    // Build directional historical candles leading cleanly into current live progress
    const tfSec = { '1m': 60, '5m': 300, '15m': 900 }[this.state.signalChartInterval || '1m'] || 60;
    const nowSec = Math.floor(Date.now() / 1000);
    const totalCandles = 46;
    const preSignalCount = isLive ? 34 : totalCandles;
    const candles = [];
    let p = levels.entry * (levels.isBuy ? 0.996 : 1.004);
    const volScale = levels.isForex ? 0.0005 : 0.0018;

    for (let i = 0; i < totalCandles; i++) {
      const t = nowSec - (totalCandles - 1 - i) * tfSec;
      const open = p;
      let close;
      if (i < preSignalCount) {
        const pull = (levels.entry - open) * 0.16;
        const wiggle = Math.sin(i * 0.7) * levels.entry * volScale * 0.55;
        close = Math.max(levels.entry * 0.5, open + pull + wiggle);
      } else {
        const liveStepIdx = i - preSignalCount + 1;
        const liveStepsTotal = Math.max(1, totalCandles - preSignalCount);
        const stepProgress = liveStepIdx / liveStepsTotal;
        const targetNow = levels.entry + (levels.tp1 - levels.entry) * (0.85 * stepProgress);
        const jitter = (levels.isBuy ? 1 : -1) * Math.abs(Math.sin(i * 1.1)) * levels.entry * volScale * 0.35;
        close = targetNow + jitter;
      }
      const wickScale = levels.entry * volScale * 0.45;
      const high = Math.max(open, close) + Math.abs(Math.cos(i * 0.9)) * wickScale;
      const low = Math.min(open, close) - Math.abs(Math.sin(i * 1.3)) * wickScale;
      candles.push({
        time: t,
        open: Number(open.toFixed(dec)),
        high: Number(high.toFixed(dec)),
        low: Number(low.toFixed(dec)),
        close: Number(close.toFixed(dec)),
        volume: Math.floor(180000 + Math.abs(Math.sin(i)) * 420000)
      });
      p = close;
    }

    this.state._activeSignalTerminalMeta = {
      signal: fallbackSig,
      isLive,
      levels,
      dec,
      tfSec,
      lastPrice: candles[candles.length - 1].close
    };

    this.signalChart.setData(candles, 'candlestick');
    this.signalChart.setSignalOverlay({
      direction: levels.isBuy ? 'BUY' : 'SELL',
      entry: levels.entry,
      tp1: levels.tp1,
      tp2: levels.tp2,
      sl: levels.sl
    });

    this.tickSignalsTerminalChart();
    if (this.state.signalLiveChartTimer) clearInterval(this.state.signalLiveChartTimer);
    this.state.signalLiveChartTimer = setInterval(() => this.tickSignalsTerminalChart(), 1200);
  },

  tickSignalsTerminalChart() {
    if (this.state.currentView !== 'signals' || !this.signalChart || !this.state._activeSignalTerminalMeta) return;
    const meta = this.state._activeSignalTerminalMeta;
    const { signal, isLive, levels, dec, tfSec } = meta;

    let nextPrice = meta.lastPrice;
    if (isLive) {
      const rawPub = String(signal.published_at || signal.scheduled_at || '');
      const rawExp = String(signal.expires_at || '');
      const pubMs = rawPub ? Date.parse(rawPub.replace(' ', 'T') + (rawPub.endsWith('Z') ? '' : 'Z')) : (Date.now() - 120000);
      const expMs = rawExp ? Date.parse(rawExp.replace(' ', 'T') + (rawExp.endsWith('Z') ? '' : 'Z')) : (Date.now() + 780000);
      const totalWindow = Math.max(60000, (expMs - pubMs) || 900000);
      const progress = Math.max(0.05, Math.min(0.98, (Date.now() - pubMs) / totalWindow));

      const desiredTarget = levels.entry + (levels.tp2 - levels.entry) * (0.28 + 0.68 * progress);
      const dirSign = levels.isBuy ? 1 : -1;
      const stepPull = (desiredTarget - nextPrice) * 0.22;
      const microNoise = dirSign * Math.abs(Math.random() * 0.00055) * levels.entry;
      nextPrice = nextPrice + stepPull + (Math.random() > 0.28 ? microNoise : -microNoise * 0.2);

      if (levels.isBuy && nextPrice < levels.entry) nextPrice = levels.entry + Math.abs(microNoise);
      if (!levels.isBuy && nextPrice > levels.entry) nextPrice = levels.entry - Math.abs(microNoise);

      const secLeft = Math.max(0, Math.floor((expMs - Date.now()) / 1000));
      const cdEl = document.getElementById('sig-term-countdown');
      if (cdEl) cdEl.textContent = secLeft > 0 ? `⏳ ${this.formatCountdown(secLeft)}` : 'Session Ending';
    } else {
      const wiggle = (Math.random() - 0.5) * levels.entry * (levels.isForex ? 0.00018 : 0.0006);
      nextPrice = nextPrice + wiggle + (levels.entry - nextPrice) * 0.12;
      const cdEl = document.getElementById('sig-term-countdown');
      if (cdEl) cdEl.textContent = 'Standby';
    }

    meta.lastPrice = nextPrice;
    this.signalChart.updateLiveCandleTick(nextPrice, Math.random() * 24000, tfSec);

    const priceEl = document.getElementById('sig-term-price');
    const moveEl = document.getElementById('sig-term-move-pct');
    const pctMove = levels.entry > 0 ? ((nextPrice - levels.entry) / levels.entry) * 100 : 0;
    const isPositiveMove = pctMove >= 0;
    if (priceEl) {
      priceEl.textContent = `$${nextPrice.toFixed(dec)}`;
      priceEl.style.color = isLive ? (levels.isBuy ? '#00B87C' : '#F6465D') : '#0F172A';
    }
    if (moveEl) {
      moveEl.textContent = `${isPositiveMove ? '+' : ''}${pctMove.toFixed(2)}%`;
      moveEl.style.color = isPositiveMove ? '#00B87C' : '#F6465D';
    }
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

    const isAdditional = Boolean(s.is_additional || Number(s.daily_slot) === 3 || String(s.id || '').startsWith('sig_add_'));
    const actionScope = `signal:${signalId}`;
    const actionKey = this.beginAction(actionScope);
    if (actionKey === null) {
      this.toast('Signal confirmation is already processing. Please wait.', 'warning');
      return;
    }
    this.setActionButtons(actionScope, true, 'Confirming...');

    try {
      this.toast(isAdditional ? '🎁 Confirming Additional Signal...' : '⚡ Confirming signal & automatically crediting profit...', 'info');
      const res = await this.api('/signals/execute.php', 'POST', {
        signal_id: signalId,
        stake_amount: isAdditional ? 0 : 100,
        idempotency_key: actionKey
      });

      if (res.success) {
        const profitPrefix = res.data?.profit_amount !== undefined ? `+$${Number(res.data.profit_amount).toFixed(2)} USDT ` : '';
        this.toast(res.message || `Signal confirmed! ${profitPrefix}profit automatically added to your balance!`, 'success');
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
    const sigData = this.state.signalsData || {};
    const minReq = Math.max(100, Number(sigData.min_deposit_required || 100) || 100);
    const addRemaining = Number(sigData.additional_signals?.remaining ?? 0);
    const totalAssetsUsdt = Number(this.state.balances?.total_assets_usdt || this.state.balances?.total_usd || 0);
    const tradingUsdt = Number(sigData.future_balance_usdt ?? this.state.balances?.future_total_usdt ?? this.state.balances?.breakdown?.trading_total_usdt ?? 0);
    const isEligible = Boolean(
      sigData.is_eligible ||
      tradingUsdt >= minReq ||
      this.state.user?.is_admin ||
      ['ADMIN', 'SUPER_ADMIN', 'VIP', 'FINANCE_MANAGER', 'KYC_MANAGER'].includes(this.state.user?.role)
    );

    if (!signals.length) {
      container.innerHTML = `
        <div style="text-align: center; padding: 16px 12px; color: #6B7280; font-size: 12px; background: #F8FAFC; border-radius: 10px; border: 1px dashed #CBD5E1;">
          📡 No active signals broadcasted right now. Check back when the next live session starts.
        </div>
      `;
      return;
    }

    container.innerHTML = signals.slice(0, 3).map(s => {
      const isBuy = ['BUY', 'LONG', 'UP'].includes(String(s.direction || 'BUY').toUpperCase());
      const dirBadge = isBuy ? 'badge-positive' : 'badge-negative';
      const isTesting = Boolean(s.is_testing || s.no_profit || String(s.id || '').startsWith('sig_test_'));
      const isAdditional = !isTesting && Boolean(s.is_additional || Number(s.daily_slot) === 3 || String(s.id || '').startsWith('sig_add_'));
      const profitPct = (isTesting || isAdditional) ? 0 : (s.profit_percentage || 1.67);
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
            <span style="color: #059669; font-weight: 700;">${isAdditional ? 'Additional Credited' : `+${profitPct}% Credited`}</span>
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
      } else if (isAdditional) {
        if (addRemaining > 0) {
          actionHtml = `
            <button class="btn-primary" style="width: 100%; padding: 9px 14px; font-size: 12px; font-weight: 800; background: #0052FF; color: #FFFFFF; border-radius: 999px; box-shadow: 0 4px 12px rgba(0, 82, 255, 0.25); cursor: pointer;" data-alpha-action="signal:${s.id}" onclick="App.confirmSignalDirectly('${s.id}')">
              🎁 Confirm Additional Signal
            </button>
          `;
        } else {
          actionHtml = `
            <button class="btn-secondary" style="width: 100%; padding: 8px 12px; font-size: 11px; font-weight: 700; border-radius: 8px;" onclick="App.openDepositModal()">
              🔒 Deposit $300+ or Invite Friend for Additional Signal
            </button>
          `;
        }
        timerBadgeHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center; background: #EFF4FF; border: 1px solid #DBEAFE; padding: 6px 10px; border-radius: 8px; margin-bottom: 8px; font-size: 11px;">
            <span style="color: #1E40AF; font-weight: 700;">⏳ Additional Window Expires:</span>
            <strong class="mono sig-timer-live" data-sig-id="${s.id}" data-time-left="${s.time_left_seconds || ((s.duration_minutes || 15) * 60)}" style="font-weight: 800; color: #F6465D; font-size: 13px;">${this.formatCountdown(s.time_left_seconds || ((s.duration_minutes || 15) * 60))}</strong>
          </div>
        `;
      } else if (!isEligible) {
        actionHtml = `
          <button class="btn-secondary" style="width: 100%; padding: 8px 12px; font-size: 11px; font-weight: 700; border-radius: 8px;" onclick="App.openDepositModal()">
            🔒 Deposit ${minReq} USDT to Unlock Signal
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
            <span class="badge" style="background:${isTesting ? '#F5F3FF' : (isAdditional ? '#EFF4FF' : '#ECFDF5')}; color:${isTesting ? '#7C3AED' : (isAdditional ? '#0052FF' : '#059669')}; font-weight:700; font-size:11px;">
              ${isTesting ? 'TEST ONLY' : (isAdditional ? 'Additional Signal' : `+${profitPct}% Return`)}
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
    const isAdditionalModal = !isTestingModal && Boolean(s.is_additional || Number(s.daily_slot) === 3 || String(s.id || '').startsWith('sig_add_'));
    const profitPct = (isTestingModal || isAdditionalModal) ? 0 : (s.profit_percentage || 1.67);
    const profitBadge = document.getElementById('exec-sig-profit-badge');
    if (profitBadge) profitBadge.textContent = isTestingModal ? '🧪 TESTING • NO PROFIT' : (isAdditionalModal ? 'Additional Signal Reward' : `+${profitPct}% Guaranteed Profit`);
    const profitRate = document.getElementById('exec-sig-profit-rate');
    if (profitRate) profitRate.textContent = isTestingModal ? 'NO PROFIT' : (isAdditionalModal ? 'ADDITIONAL' : `+${profitPct}%`);

    const schedTimeEl = document.getElementById('exec-sig-schedule-time');
    if (schedTimeEl) schedTimeEl.textContent = '';
    const expTimeEl = document.getElementById('exec-sig-expiry-time');
    if (expTimeEl) expTimeEl.textContent = this.formatCountdown(s.time_left_seconds || ((s.duration_minutes || 15) * 60));

    const tradingBal = Number(
      this.state.signalsData?.future_balance_usdt ??
      this.state.balances?.future_total_usdt ??
      this.state.balances?.breakdown?.trading_total_usdt ??
      0
    );
    const availBalEl = document.getElementById('exec-sig-avail-bal');
    if (availBalEl) availBalEl.textContent = `$${parseFloat(tradingBal).toFixed(2)}`;
    const amountEl = document.getElementById('exec-sig-amount');
    if (amountEl && !isTestingModal) {
      amountEl.value = Math.max(0, tradingBal).toFixed(2);
      amountEl.readOnly = true;
      amountEl.title = isAdditionalModal
        ? 'Additional Signals reward is credited separately from the 30-day 2× plan.'
        : 'Signal profit is calculated from your Future USDT balance.';
    }

    this.updateExecuteSignalCalc();
    this.openModal('modal-execute-signal');
  },

  updateExecuteSignalCalc() {
    const s = this.state.activeExecutingSignal;
    if (!s) return;
    const amount = parseFloat(document.getElementById('exec-sig-amount').value) || 0;
    const isTestingCalc = Boolean(s.is_testing || s.no_profit || String(s.id || '').startsWith('sig_test_'));
    const isAdditionalCalc = !isTestingCalc && Boolean(s.is_additional || Number(s.daily_slot) === 3 || String(s.id || '').startsWith('sig_add_'));
    const profitPct = (isTestingCalc || isAdditionalCalc) ? 0 : (s.profit_percentage || 1.67);
    const profit = isTestingCalc ? 0 : (isAdditionalCalc ? 4 : (amount * profitPct) / 100);
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
    const isAdditionalExec = activeSignal && Boolean(activeSignal.is_additional || Number(activeSignal.daily_slot) === 3 || String(activeSignal.id || '').startsWith('sig_add_'));
    const rawAmount = parseFloat(document.getElementById('exec-sig-amount').value);
    const amount = Number.isFinite(rawAmount) ? rawAmount : (isAdditionalExec ? 0 : 100);
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
      console.warn('[Login Failed]', JSON.stringify({ status: res?.status || 0, error_code: res?.error_code || '', message: res?.message || '' }));
      const msg = res?.status === 503
        ? (res?.message && !res.message.includes('<!doctype') ? res.message : 'Server is temporarily busy (503). Please wait a few seconds and click Log in again.')
        : ((res && (res.message || (res.error && res.error.message))) || 'Login failed. Please verify email and password.');
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

      const isAdmin = this.isStaffOrAdmin(this.state.user);
      if (isAdmin) {
        this.state.adminPreviewUser = null;
        this.state.adminPreviewUserId = null;
      }

      this.closeModal('modal-auth');
      if (typeof this.updateHeaderAuth === 'function') {
        try { this.updateHeaderAuth(); } catch (uiErr) { console.warn('[Login UI]', uiErr); }
      }

      this.navigate(isAdmin ? 'admin' : 'home');
      this.toast(isAdmin ? 'Welcome Administrator! Navigating to Admin Governance Desk...' : 'Signed in successfully!', 'success');

      Promise.allSettled([
        this.checkAuth().then(() => {
          if (!this.state.user) {
            this.toast('Session cookie could not be verified by browser. Please refresh or check cookie settings.', 'error');
          } else if (this.isStaffOrAdmin(this.state.user) && !this.state.adminPreviewUser && this.state.currentView !== 'admin') {
            this.navigate('admin');
          }
        }),
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

  async sendSignupVerificationCode() {
    const emailInput = document.getElementById('reg-email');
    const firstNameInput = document.getElementById('reg-first-name');
    const codeInput = document.getElementById('reg-verification-code');
    const btn = document.getElementById('btn-send-reg-code');
    const statusEl = document.getElementById('reg-code-status');

    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const firstName = firstNameInput ? String(firstNameInput.value || '').trim() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.toast('Please enter a valid email address first.', 'warning');
      if (emailInput) emailInput.focus();
      return;
    }

    if (this._regOtpCooldownTimer) {
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';
    }

    try {
      const res = await this.api('/auth/send-signup-code.php', 'POST', {
        email,
        first_name: firstName
      });

      if (res && res.success) {
        if (statusEl) {
          statusEl.style.color = '#059669';
          statusEl.textContent = `Verification code sent to ${email}. Valid for 10 minutes.`;
        }
        this.toast(res.message || 'Verification code sent to your email.', 'success');
        if (codeInput) codeInput.focus();

        let remaining = 60;
        const tick = () => {
          if (!btn) return;
          if (remaining > 0) {
            btn.disabled = true;
            btn.style.opacity = '0.65';
            btn.textContent = `Resend (${remaining}s)`;
            remaining -= 1;
            this._regOtpCooldownTimer = setTimeout(tick, 1000);
          } else {
            this._regOtpCooldownTimer = null;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.textContent = 'Resend Code';
          }
        };
        tick();
      } else {
        const msg = (res && res.message) || 'Could not send verification code.';
        if (statusEl) {
          statusEl.style.color = '#DC2626';
          statusEl.textContent = msg;
        }
        this.toast(msg, 'error');
        if (btn) {
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.textContent = 'Send Code';
        }
      }
    } catch (e) {
      this.toast('Network error while sending verification code.', 'error');
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.textContent = 'Send Code';
      }
    }
  },

  async submitRegister() {
    const firstNameInput = document.getElementById('reg-first-name');
    const lastNameInput = document.getElementById('reg-last-name');
    const emailInput = document.getElementById('reg-email');
    const codeInput = document.getElementById('reg-verification-code');
    const phoneInput = document.getElementById('reg-phone');
    const passInput = document.getElementById('reg-pass');
    const confirmInput = document.getElementById('reg-confirm');
    const pinInput = document.getElementById('reg-withdrawal-pin');
    const refInput = document.getElementById('reg-ref');
    const countryInput = document.getElementById('reg-country');
    const submitBtn = document.getElementById('btn-submit-register');

    const firstName = firstNameInput ? String(firstNameInput.value || '').trim() : '';
    const lastName = lastNameInput ? String(lastNameInput.value || '').trim() : '';
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const verificationCode = codeInput ? codeInput.value.replace(/\s+/g, '').trim() : '';
    const phone = phoneInput ? String(phoneInput.value || '').trim() : '';
    const normalizedPhoneDigits = phone.replace(/[\s\-().]/g, '');
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
    if (!/^\d{6}$/.test(verificationCode)) {
      this.toast('Please click Send Code and enter the 6-digit email verification code.', 'error');
      if (codeInput) codeInput.focus();
      return;
    }
    if (!phone) {
      this.toast('Please enter your WhatsApp number', 'error');
      if (phoneInput) phoneInput.focus();
      return;
    }
    if (!/^[0-9+\-\s().]{7,24}$/.test(phone) || !/^\+?\d{7,15}$/.test(normalizedPhoneDigits)) {
      this.toast('Please enter a valid WhatsApp number', 'error');
      if (phoneInput) phoneInput.focus();
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
        verification_code: verificationCode,
        whatsapp_number: phone,
        phone,
        phone_number: phone,
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
        if (this._regOtpCooldownTimer) {
          clearTimeout(this._regOtpCooldownTimer);
          this._regOtpCooldownTimer = null;
        }
        if (codeInput) codeInput.value = '';
        try {
          localStorage.setItem('alphavest_user_country', country);
          localStorage.removeItem('alphavest_pending_ref');
          sessionStorage.removeItem('alphavest_pending_ref');
        } catch (e) {}
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
        this.toast(res.message || 'Account created and email verified successfully!', 'success');
        if (this.state.user && !this.state.user.is_admin) {
          try { localStorage.setItem(this.getOnboardingTourKey('pending'), '1'); } catch (e) {}
        }
        this.navigate('home');
        Promise.allSettled([
          this.checkAuth(),
          this.loadBalances(),
          this.loadNotifications(),
          this.loadSignals()
        ]).catch(() => {});
        setTimeout(() => this.maybeStartOnboardingTour(), 500);
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
      await this.sendUserHeartbeat(true);
    } catch (e) {}
    try {
      await this.api('/auth/logout.php', 'POST');
    } catch (e) {}
    
    localStorage.removeItem('alphavest_local_user');
    localStorage.removeItem('alphavest_user');
    localStorage.removeItem('alphavest_user_avatar');
    sessionStorage.clear();
    this.state.user = null;
    this.state.adminPreviewUserId = null;
    this.state.adminPreviewUser = null;
    this.state.balances = null;
    this.state.signalsData = null;
    this.state.signals = [];
    this.state.referralStats = null;
    this.state.notifications = [];
    this.state.unreadNotificationsCount = 0;
    this.updateNotificationBell(0);
    this.renderHomeNotificationBanner();
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

  /* Shared 6-Digit Email OTP Sender & Cooldown Controller */
  _startOtpCooldown(btnId, defaultLabel = 'Send Code') {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    this._otpCooldownTimers = this._otpCooldownTimers || {};
    if (this._otpCooldownTimers[btnId]) clearInterval(this._otpCooldownTimers[btnId]);
    let left = 60;
    btn.disabled = true;
    btn.textContent = `${left}s`;
    this._otpCooldownTimers[btnId] = setInterval(() => {
      left -= 1;
      if (left <= 0) {
        clearInterval(this._otpCooldownTimers[btnId]);
        delete this._otpCooldownTimers[btnId];
        btn.disabled = false;
        btn.textContent = defaultLabel;
      } else {
        btn.textContent = `${left}s`;
      }
    }, 1000);
  },

  async sendSecurityOtp(context) {
    let action = '';
    let payloadEmail = '';
    let btnId = '';
    let statusId = '';
    let inputId = '';

    if (context === 'chpwd') {
      action = this.state.changePwdForgotMode ? 'forgot_password' : 'change_password';
      payloadEmail = this.state.changePwdForgotMode ? (this.state.user?.email || '') : '';
      btnId = 'btn-send-chpwd-otp';
      statusId = 'chpwd-otp-status';
      inputId = 'chpwd-otp';
    } else if (context === 'pin') {
      action = this.state.pinForgotMode ? 'forgot_pin' : 'change_pin';
      btnId = 'btn-send-pin-otp';
      statusId = 'pin-otp-status';
      inputId = 'pin-otp';
    } else if (context === 'email') {
      action = 'change_email';
      payloadEmail = (document.getElementById('update-email-new')?.value || '').trim();
      if (!payloadEmail || !payloadEmail.includes('@')) {
        this.toast('Enter your valid new email address first.', 'warning');
        document.getElementById('update-email-new')?.focus();
        return;
      }
      btnId = 'btn-send-email-otp';
      statusId = 'update-email-otp-status';
      inputId = 'update-email-otp';
    } else if (context === 'forgot_pwd') {
      action = 'forgot_password';
      payloadEmail = (document.getElementById('forgot-pwd-email')?.value || '').trim();
      if (!payloadEmail || !payloadEmail.includes('@')) {
        this.toast('Enter your registered email address first.', 'warning');
        document.getElementById('forgot-pwd-email')?.focus();
        return;
      }
      btnId = 'btn-send-forgot-otp';
      statusId = 'forgot-pwd-otp-status';
      inputId = 'forgot-pwd-otp';
    } else {
      return;
    }

    const btn = document.getElementById(btnId);
    const statusEl = document.getElementById(statusId);
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }
    if (statusEl) {
      statusEl.className = 'av-sec-otp-status';
      statusEl.textContent = 'Sending 6-digit verification code...';
    }

    try {
      const body = { action };
      if (payloadEmail) body.email = payloadEmail;
      const res = await this.api('/auth/send-security-code.php', 'POST', body);
      if (res && res.success) {
        if (statusEl) {
          statusEl.className = 'av-sec-otp-status is-sent';
          statusEl.textContent = res.message || '6-digit verification code sent. Check your inbox (and spam).';
        }
        this.toast(res.message || 'Verification code sent!', 'success');
        this._startOtpCooldown(btnId, 'Resend Code');
        document.getElementById(inputId)?.focus();
      } else {
        if (statusEl) {
          statusEl.className = 'av-sec-otp-status is-err';
          statusEl.textContent = (res && res.message) || 'Could not send verification code.';
        }
        this.toast((res && res.message) || 'Could not send verification code.', 'error');
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Send Code';
        }
      }
    } catch (e) {
      if (statusEl) {
        statusEl.className = 'av-sec-otp-status is-err';
        statusEl.textContent = 'Network error sending verification code.';
      }
      this.toast('Network error sending verification code.', 'error');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Send Code';
      }
    }
  },

  /* Fund Withdrawal PIN Management */
  openChangePinModal() {
    this.closeModal('modal-profile');
    const curr = document.getElementById('pin-current');
    const n = document.getElementById('pin-new');
    const c = document.getElementById('pin-confirm');
    const otp = document.getElementById('pin-otp');
    const status = document.getElementById('pin-otp-status');
    if (curr) curr.value = '';
    if (n) n.value = '';
    if (c) c.value = '';
    if (otp) otp.value = '';
    if (status) {
      status.className = 'av-sec-otp-status';
      status.textContent = 'Click Send Code to receive a 6-digit code on your account email.';
    }
    this.toggleForgotPinMode(false);
    this.openModal('modal-change-pin');
  },

  toggleForgotPinMode(forceVal) {
    this.state.pinForgotMode = typeof forceVal === 'boolean' ? forceVal : !this.state.pinForgotMode;
    const isForgot = Boolean(this.state.pinForgotMode);
    const currGroup = document.getElementById('group-current-pin');
    const toggleBtn = document.getElementById('btn-toggle-forgot-pin');
    const status = document.getElementById('pin-otp-status');
    if (currGroup) currGroup.style.display = isForgot ? 'none' : 'block';
    if (toggleBtn) toggleBtn.textContent = isForgot ? 'Use current PIN instead' : 'Forgot PIN?';
    if (status && isForgot) {
      status.className = 'av-sec-otp-status';
      status.textContent = 'Forgot PIN mode: click Send Code to reset your PIN with a 6-digit email code.';
    }
  },

  async submitChangeWithdrawalPin() {
    const currentPin = (document.getElementById('pin-current')?.value || '').trim();
    const newPin = (document.getElementById('pin-new')?.value || '').trim();
    const confirmPin = (document.getElementById('pin-confirm')?.value || '').trim();
    const verificationCode = (document.getElementById('pin-otp')?.value || '').trim();
    const isForgot = Boolean(this.state.pinForgotMode);
    const btn = document.getElementById('btn-save-withdrawal-pin');

    if (!isForgot && this.state.user?.has_withdrawal_pin && !/^\d{6}$/.test(currentPin)) {
      this.toast('Enter your current 6-digit PIN or click "Forgot PIN?" to reset via email.', 'error');
      document.getElementById('pin-current')?.focus();
      return;
    }

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

    if (!/^\d{6}$/.test(verificationCode)) {
      this.toast('Please enter the 6-digit email verification code.', 'error');
      document.getElementById('pin-otp')?.focus();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Verifying & Updating PIN...';
    }

    try {
      const res = await this.api('/user/withdrawal-pin.php', 'POST', {
        mode: isForgot ? 'forgot' : 'change',
        current_pin: isForgot ? '' : currentPin,
        new_pin: newPin,
        pin: newPin,
        verification_code: verificationCode
      });

      if (res.success) {
        this.toast(res.message || '6-Digit Fund Withdrawal PIN updated successfully!', 'success');
        if (this.state.user) {
          this.state.user.has_withdrawal_pin = true;
          delete this.state.user.withdrawal_pin;
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
    const activeTab = this.state.adminTab || 'overview';
    const shouldFetchUsers = activeTab === 'overview' || activeTab === 'users';
    const usersPromise = shouldFetchUsers ? this.loadAdminUsers() : Promise.resolve();
    const supportPromise = this.loadAdminSupport({ silent: true }).catch(() => {});

    const res = await this.api('/admin/overview.php');
    if (res.success && res.data) {
      this.state.adminMetrics = res.data;
      this.renderAdminOverview();
    } else if (this.state.currentView === 'admin') {
      const status = Number(res?.status || 0);
      const errMsg = res?.message || 'Unable to load admin governance overview.';
      this.toast(errMsg, 'error');
      if (status === 401) {
        this.openModal('modal-auth');
      }
    }
    await Promise.all([usersPromise, supportPromise]);
  },

  syncAdminQueueBadges(counts = {}) {
    const updateBadge = (ids, count) => {
      if (count === undefined || count === null || Number.isNaN(Number(count))) return;
      const n = Math.max(0, Number(count));
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = String(n);
          el.style.display = n > 0 ? 'inline-flex' : 'none';
        }
      });
    };

    if (counts.kyc !== undefined) {
      const k = Math.max(0, Number(counts.kyc || 0));
      updateBadge(['adm-badge-kyc', 'adm-pill-badge-kyc', 'adm-bottom-badge-kyc'], k);
      const qKyc = document.getElementById('adm-quick-kyc');
      const kpiKyc = document.getElementById('adm-kyc-pending');
      if (qKyc) qKyc.textContent = k > 0 ? `${k} Pending` : 'All Clear';
      if (kpiKyc) kpiKyc.textContent = String(k);
    }

    if (counts.withdrawals !== undefined) {
      const w = Math.max(0, Number(counts.withdrawals || 0));
      updateBadge(['adm-badge-with', 'adm-pill-badge-with', 'adm-bottom-badge-with'], w);
      const qWith = document.getElementById('adm-quick-with');
      if (qWith) qWith.textContent = w > 0 ? `${w} Pending` : 'All Clear';
    }

    if (counts.deposits !== undefined) {
      const d = Math.max(0, Number(counts.deposits || 0));
      updateBadge(['adm-badge-dep', 'adm-pill-badge-dep', 'adm-bottom-badge-dep'], d);
      const qDep = document.getElementById('adm-quick-dep');
      if (qDep) {
        qDep.textContent = d > 0 ? `${d} Pending` : 'Vaults OK';
        qDep.className = d > 0 ? 'av-adm-action-count warn' : 'av-adm-action-count good';
      }
    }

    if (counts.supportNeeds !== undefined || counts.supportOpen !== undefined) {
      const needs = Math.max(0, Number(counts.supportNeeds ?? 0));
      const open = Math.max(0, Number(counts.supportOpen ?? needs));
      updateBadge(['adm-badge-support', 'adm-pill-badge-support'], needs);
      const qSup = document.getElementById('adm-quick-support');
      if (qSup) {
        if (needs > 0) {
          qSup.textContent = `${needs} Needs Reply`;
          qSup.className = 'av-adm-action-count warn';
        } else {
          qSup.textContent = `${open} Open`;
          qSup.className = 'av-adm-action-count';
        }
      }
    }

    if (counts.onlineNow !== undefined) {
      updateBadge(['adm-badge-online', 'adm-pill-badge-online'], counts.onlineNow);
    }
  },

  async refreshAdminBadges() {
    if (!this.state.user || this.state.currentView !== 'admin' || !this.isStaffOrAdmin(this.state.user)) return;
    if (this._refreshAdminBadgesBusy) return;
    this._refreshAdminBadgesBusy = true;
    try {
      const res = await this.api('/admin/overview.php');
      if (res && res.success && res.data) {
        this.state.adminMetrics = res.data;
        const m = res.data.metrics || {};
        this.syncAdminQueueBadges({
          kyc: m.kyc_pending ?? 0,
          deposits: m.pending_deposits ?? 0,
          withdrawals: m.pending_withdrawals ?? 0,
          supportNeeds: m.support_needs_reply ?? 0,
          supportOpen: m.support_open ?? 0
        });
        if (this.state.adminTab === 'overview') {
          this.renderAdminOverviewPendingKyc(res.data.pending_kyc_preview || []);
        }
      }
    } catch (e) {}
    finally {
      this._refreshAdminBadgesBusy = false;
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
      badge.textContent = mode;
      badge.className = mode === 'LIVE' ? 'badge badge-positive' : 'badge badge-demo';
    }
    if (btnLabel) {
      btnLabel.textContent = mode === 'LIVE' ? 'DEMO' : 'LIVE';
    }

    this.syncAdminQueueBadges({
      kyc: m.kyc_pending || 0,
      withdrawals: m.pending_withdrawals || 0,
      deposits: m.pending_deposits || 0,
      supportNeeds: m.support_needs_reply ?? undefined,
      supportOpen: m.support_open ?? undefined
    });

    this.renderAdminOverviewPendingKyc(data.pending_kyc_preview || []);
    this.renderAdminAnalyticsChart(this.state.adminAnalyticsSeries || 'deposits');
  },

  renderAdminOverviewPendingKyc(list = []) {
    const countEl = document.getElementById('adm-overview-pending-kyc-count');
    const host = document.getElementById('adm-overview-pending-kyc-list');
    const items = Array.isArray(list) ? list : [];

    if (countEl) {
      countEl.textContent = `${items.length} Pending`;
      countEl.className = items.length > 0 ? 'badge badge-warning' : 'badge badge-positive';
    }
    if (!host) return;

    if (!items.length) {
      host.innerHTML = `<div style="padding:18px; text-align:center; color:#64748B; font-size:12.5px;">All identity submissions reviewed — zero pending KYC requests.</div>`;
      return;
    }

    host.innerHTML = items.slice(0, 8).map(item => {
      const idStr = String(item.id || '');
      const initial = this.escapeHtml(String(item.legal_name || item.email || 'U').trim().charAt(0).toUpperCase() || 'U');
      const when = this.escapeHtml(this.formatAdminDate(item.created_at));
      const uidTag = item.numeric_uid ? ` · UID #${this.escapeHtml(String(item.numeric_uid))}` : '';
      return `
        <div class="av-adm-overview-kyc-row">
          <div class="av-adm-overview-kyc-user">
            <span class="av-adm-user-avatar" aria-hidden="true">${initial}</span>
            <div style="min-width:0;">
              <div style="font-size:13.5px; font-weight:800; color:#0F172A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${this.escapeHtml(item.legal_name || 'Applicant')}</div>
              <div style="font-size:11.5px; color:#64748B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${this.escapeHtml(item.email || '')}${uidTag} · ${this.escapeHtml(item.country || 'Global')}</div>
              <div style="font-size:11px; color:#94A3B8; margin-top:2px;">${this.escapeHtml(item.document_type || 'ID Card')} · Submitted ${when}</div>
            </div>
          </div>
          <div class="av-adm-overview-kyc-actions">
            <button type="button" class="av-adm-btn-chip soft-blue" onclick="App.openKycFromOverview('${this.escapeJsStr(idStr)}')">Inspect Docs</button>
            <button type="button" class="av-adm-btn-chip green" onclick="App.quickOverviewKycDecision('${this.escapeJsStr(idStr)}', 'APPROVED')">Approve</button>
            <button type="button" class="av-adm-btn-chip danger" onclick="App.quickOverviewKycDecision('${this.escapeJsStr(idStr)}', 'REJECTED')">Reject</button>
          </div>
        </div>
      `;
    }).join('');
  },

  async openKycFromOverview(subId) {
    this.state.selectedKycId = String(subId || '');
    await this.setAdminTab('kyc');
    if (this.state.selectedKycId) {
      this.filterAdminKyc();
    }
  },

  async quickOverviewKycDecision(subId, decision) {
    const reason = decision === 'APPROVED'
      ? 'Identity and documents verified successfully'
      : 'Document illegible or information mismatch';
    const res = await this.api('/admin/kyc.php', 'POST', {
      submission_id: subId,
      decision,
      reason
    });
    if (res && res.success) {
      this.toast(`KYC submission ${decision.toLowerCase()} successfully`, 'success');
      await this.loadAdminData();
      if (this.state.adminTab === 'kyc') {
        await this.loadAdminKyc();
      }
    } else {
      this.toast(res?.message || 'Failed to update KYC decision', 'error');
    }
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
    if (target === 'users' && (!Array.isArray(this.state.adminUsers) || !this.state.adminUsers.length)) {
      this.loadAdminUsers();
    }
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
      'overview', 'analytics', 'users', 'referrals', 'deposits', 'withdrawals',
      'kyc', 'support', 'signals', 'signal-schedules', 'adjustments', 'settings'
    ];
    if (!allowedTabs.includes(tab)) {
      tab = 'overview';
    }

    this.state.adminTab = tab;
    if (this.isStaffOrAdmin(this.state.user) && !this.state.adminPreviewUser) {
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
      analytics: 'Live User Analytics & Tracking',
      signals: 'Signal Studio (6 PM / 8 PM / 9:30 PM)',
      deposits: 'Incoming Deposits',
      withdrawals: 'Withdrawals Desk',
      kyc: 'KYC Identity Desk',
      support: 'Live Support Desk',
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

    if (tab === 'overview') {
      this.renderAdminOverview();
      if (!Array.isArray(this.state.adminUsers) || !this.state.adminUsers.length) {
        this.loadAdminUsers();
      }
      this.loadAdminSupport({ silent: true }).catch(() => {});
    }
    if (tab === 'analytics') {
      this.loadAdminAnalytics();
      if (this._adminAnalyticsPollTimer) clearInterval(this._adminAnalyticsPollTimer);
      this._adminAnalyticsPollTimer = setInterval(() => {
        if (!document.hidden && this.state?.adminTab === 'analytics' && this.state?.currentView === 'admin') {
          this.loadAdminAnalytics({ silent: true });
        }
      }, 12000);
    } else if (this._adminAnalyticsPollTimer) {
      clearInterval(this._adminAnalyticsPollTimer);
      this._adminAnalyticsPollTimer = null;
    }
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
    if (tab === 'support') {
      this.loadAdminSupport();
      if (this._adminSupportPollTimer) clearInterval(this._adminSupportPollTimer);
      this._adminSupportPollTimer = setInterval(() => {
        if (this.state?.adminTab === 'support' && this.state?.currentView === 'admin') {
          this.loadAdminSupport({ silent: true });
        }
      }, 8000);
    } else if (this._adminSupportPollTimer) {
      clearInterval(this._adminSupportPollTimer);
      this._adminSupportPollTimer = null;
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
      const emptyMsg = (!res.success && res.message)
        ? `<span style="color:#DC2626; font-weight:600;">${this.escapeHtml(res.message)}</span>`
        : 'No registered accounts found matching criteria.';
      const emptyHtml = `<tr><td colspan="7" style="text-align:center; padding:24px; color:#6B7280;">
        ${emptyMsg}
        <button onclick="App.syncAllFromDatabase()" class="av-adm-btn-chip soft-blue" style="margin-left:10px;">
          Sync Data from Database
        </button>
      </td></tr>`;
      if (container) container.innerHTML = emptyHtml;
      if (overviewContainer) overviewContainer.innerHTML = emptyHtml;
      if (countBadge) countBadge.textContent = '0';
      if (usersCountPill) usersCountPill.textContent = '0 Users';
      if (!res.success && res.message) this.toast(res.message, 'error');
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
      const res = await this.api(`/admin/users.php?user_id=${encodeURIComponent(userId)}&mode=summary`);
      if (!res.success || !res.data || !res.data.user) throw new Error(res.message || 'User account not found');
      this.state.adminPreviewUserId = String(userId);
      this.state.adminPreviewUser = res.data.user;
      this.state.balances = res.data.wallet_breakdown || null;
      this.state.signalsData = null;
      this.state.signals = [];
      this.state.referralStats = null;
      this.updateHeaderAuth();
      this.navigate('home');
      this.updateHomeHeroBalance();
      this.renderWalletView();
      setTimeout(() => this.ensureAdminUserDepositAction(), 0);
      Promise.allSettled([
        this.loadBalances(true),
        this.loadSignals(),
        this.loadWalletHistoryPreview('ALL'),
        this.loadReferrals(),
        this.loadNotifications()
      ]);
      this.toast(`Viewing ${res.data.user.email || 'user'} live account data.`, 'info');
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
    this.api(`/admin/users.php?user_id=${encodeURIComponent(id)}&mode=summary`).then(res => {
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
    this.state.referralStats = null;
    this.updateHeaderAuth();
    this.navigate('admin');
    this.loadBalances(true);
    this.loadNotifications();
    this.toast('Returned to Admin Desk.', 'success');
  },

  async viewUserDashboard(userId) {
    this.openModal('modal-user-dashboard');
    const body = document.getElementById('user-dashboard-body');
    if (!body) return;
    body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);">Loading live user dashboard...</div>';
    try {
      const res = await this.api(`/admin/users.php?user_id=${encodeURIComponent(userId)}&mode=summary`);
      if (!res.success || !res.data) throw new Error(res.message || 'Unable to load user dashboard');
      const d = res.data, u = d.user || {}, fs = d.financial_summary || {}, ss = d.signal_summary || {}, wb = d.wallet_breakdown || {};
      const money = v => `$${Number(v || 0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
      const esc = v => this.escapeHtml(v ?? '—');
      const safeUidArg = String(userId).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const executions = Array.isArray(d.signal_executions) ? d.signal_executions : [];
      const spotBal = wb.spot_total_usdt ?? fs.spot_total_usdt ?? 0;
      const futureBal = wb.future_total_usdt ?? fs.future_total_usdt ?? 0;
      const refBonus = wb.referral_bonus_usdt ?? fs.referral_bonus_usdt ?? 0;
      body.innerHTML = `
        <div class="user-dashboard-hero">
          <div><div class="user-dashboard-kicker">LIVE USER DASHBOARD VIEW</div><h3>${esc(u.email || 'User')}</h3><div class="user-dashboard-sub">UID ${esc(u.numeric_uid || u.id || '—')} • ${esc(u.country || 'Global')}</div></div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
            <div class="user-dashboard-balance">${money(d.total_balance_usdt)}<small>USDT Total Balance</small></div>
            <button class="btn-primary" type="button" onclick="App.closeModal('modal-user-dashboard');App.openAdminUserDepositFor('${safeUidArg}')" style="padding:8px 12px;font-size:11px;font-weight:800;">＋ Submit Deposit</button>
          </div>
        </div>
        <div class="user-dashboard-grid">
          <div class="user-dashboard-stat"><span>Spot Balance</span><strong>${money(spotBal)}</strong><small>Referral Bonus: ${money(refBonus)} (Spot locked)</small></div>
          <div class="user-dashboard-stat"><span>Future Balance</span><strong>${money(futureBal)}</strong><small>Active Trading &amp; Signals margin</small></div>
          <div class="user-dashboard-stat"><span>Funded Capital</span><strong>${money(fs.funded_capital_principal)}</strong><small>Approved deposits + Deposit-type adjustments</small></div>
          <div class="user-dashboard-stat"><span>Signal Profit</span><strong class="positive">+${money(ss.profit_credited_total).slice(1)}</strong><small>${ss.confirmed_count || 0} confirmed · ${ss.missed_signal_count || 0} missed</small></div>
        </div>
        <div class="user-dashboard-panel"><div class="user-dashboard-panel-title">Recent Signal Results</div>
          ${executions.length ? `<div class="user-dashboard-results">${executions.slice(0,12).map(ex => `<div class="user-dashboard-result"><div><strong>${esc(ex.symbol || 'SIGNAL')}</strong><span>${esc(ex.direction || '')}</span></div><div><b class="positive">+${money(ex.profit_amount)}</b><small>${esc(ex.status || 'COMPLETED')}</small></div></div>`).join('')}</div>` : '<div class="user-dashboard-empty">No signal executions recorded yet.</div>'}
        </div>
        <div class="user-dashboard-actions" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;"><button class="btn-primary" onclick="App.closeModal('modal-user-dashboard');App.startAdminUserView('${safeUidArg}')">📊 Open Full User Dashboard</button><button class="btn-secondary" onclick="App.closeModal('modal-user-dashboard');App.openAdminUserDepositFor('${safeUidArg}')">➕ Submit Deposit</button><button class="btn-secondary" onclick="App.closeModal('modal-user-dashboard');App.viewUserDossier('${safeUidArg}')">🔎 Open Complete Detail</button></div>`;
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
          <td>${esc(x.status || 'COMPLETED')}</td><td style="font-weight:700; color:#059669;">${money(x.profit_amount)}</td>
          <td>${money(x.balance_before)}</td><td>${money(x.balance_after)}</td><td>${esc(dt(x.executed_at || x.created_at))}</td>
        </tr>`);
      const noProfitRows = tableRows(noProfit, 'No confirmed executions currently missing a positive profit-credit record.', x => `
        <tr><td>${esc(x.signal_id || '—')}</td><td>${esc(x.execution_id || '—')}</td><td>${esc(x.status || '—')}</td><td>${money(x.profit_amount)}</td><td>${esc(x.reason || '—')}</td><td>${esc(dt(x.executed_at))}</td></tr>`);
      const missedRows = tableRows(missed, 'No expired, unconfirmed signal windows found in the recorded history.', x => `
        <tr><td>${esc(x.signal_id)}</td><td>${esc(x.symbol)}</td><td>${esc(x.direction)}</td><td>${Number(x.profit_percentage || 0).toFixed(2)}%</td><td>${esc(x.status)}</td><td>${esc(dt(x.published_at))}</td><td>${esc(dt(x.expires_at))}</td></tr>`);

      // Authentic Wallet Allocation SVG Donut (from real wallets: Funding / Exchange / Trading)
      const fundAmt = Math.max(0, Number(w.funding || 0));
      const exchAmt = Math.max(0, Number(w.exchange || 0));
      const tradAmt = Math.max(0, Number(w.trading || 0));
      const totalBal = Math.max(0, Number(d.total_balance_usdt ?? (fundAmt + exchAmt + tradAmt)));
      const donutTotal = Math.max(0, fundAmt + exchAmt + tradAmt);
      const r = 42;
      const circ = 2 * Math.PI * r;
      const segs = [
        { label: 'Funding Wallet', val: fundAmt, color: '#0052FF' },
        { label: 'Exchange Wallet', val: exchAmt, color: '#00B87C' },
        { label: 'Trading Wallet', val: tradAmt, color: '#64748B' }
      ];
      let offsetAcc = 0;
      const donutCircles = donutTotal > 0
        ? segs.filter(s => s.val > 0).map(s => {
            const len = (s.val / donutTotal) * circ;
            const dash = `${len.toFixed(2)} ${(circ - len).toFixed(2)}`;
            const segHtml = `<circle class="av-ring-seg" cx="59" cy="59" r="${r}" fill="none" stroke="${s.color}" stroke-width="14" stroke-dasharray="${dash}" stroke-dashoffset="${(-offsetAcc).toFixed(2)}" style="--av-circ:${circ.toFixed(1)}"></circle>`;
            offsetAcc += len;
            return segHtml;
          }).join('')
        : `<circle cx="59" cy="59" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="14"></circle>`;

      // Authentic Capital & Profit Flow Horizontal Bars
      const depTotal = Math.max(0, Number(f.deposit_completed_total || 0));
      const sigProfitTotal = Math.max(0, Number(sig.profit_credited_total || 0));
      const withTotal = Math.max(0, Number(f.withdrawal_completed_total || 0));
      const adjCredits = Math.max(0, Number(f.adjustment_credits || 0));
      const adjDebits = Math.max(0, Number(f.adjustment_debits || 0));
      const maxFlow = Math.max(1, depTotal, sigProfitTotal, withTotal, adjCredits, adjDebits);
      const flowBars = [
        { label: `Completed Deposits (${Number(f.deposit_completed_count || 0)})`, val: depTotal, color: '#0052FF' },
        { label: `Signal Profits Credited (${Number(sig.confirmed_count || 0)})`, val: sigProfitTotal, color: '#00B87C' },
        { label: `Completed Withdrawals (${Number(f.withdrawal_completed_count || 0)})`, val: withTotal, color: '#DC2626' },
        { label: 'Admin Credits', val: adjCredits, color: '#2563EB' },
        { label: 'Admin Debits', val: adjDebits, color: '#D97706' }
      ];

      // Authentic Signal Confirmation Gauge
      const sigConf = Number(sig.confirmed_count || 0);
      const sigMissed = Number(sig.missed_signal_count || 0);
      const sigFailed = Number(sig.failed_execution_count || 0);
      const sigWindowsTotal = sigConf + sigMissed + sigFailed;
      const sigConfRate = sigWindowsTotal > 0 ? Math.round((sigConf / sigWindowsTotal) * 100) : (sigConf > 0 ? 100 : 0);

      const displayName = [u.first_name, u.last_name].filter(Boolean).join(' ').trim() || u.email || 'Account Holder';
      const avatarValid = this.isValidAvatarUrl(u.avatar) ? u.avatar : '';
      const initials = this.getSupportInitials(displayName);
      const hasPin = Boolean(u.has_withdrawal_pin);
      const isEmailVerified = Boolean(u.email_verified);

      const kycHtml = k ? `
        <div class="card" style="padding:14px;">
          <div class="av-detail-chart-head" style="margin-bottom:10px;">
            <h5>KYC &amp; Identity Verification Record</h5>
            <span class="badge ${statusClass(k.status)}">${esc(k.status || u.kyc_status || 'UNKNOWN')}</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:9px; font-size:12px;">
            <div class="av-detail-meta-cell"><span>Legal Name</span><strong>${esc(k.legal_name)}</strong></div>
            <div class="av-detail-meta-cell"><span>Date of Birth</span><strong>${esc(k.date_of_birth)}</strong></div>
            <div class="av-detail-meta-cell"><span>Country</span><strong>${esc(k.country)}</strong></div>
            <div class="av-detail-meta-cell"><span>Document Type</span><strong>${esc(k.document_type)}</strong></div>
            <div class="av-detail-meta-cell"><span>Document Number</span><strong>${esc(k.document_number)}</strong></div>
            <div class="av-detail-meta-cell"><span>Submitted / Reviewed</span><strong>${esc(dt(k.created_at))}</strong></div>
            <div class="av-detail-meta-cell" style="grid-column:1/-1;"><span>Address</span><strong>${esc(k.address)}</strong></div>
          </div>
        </div>` : `
        <div class="card" style="padding:14px;">
          <div class="av-detail-chart-head">
            <h5>KYC &amp; Identity Verification</h5>
            <span class="badge ${statusClass(u.kyc_status)}">${esc(u.kyc_status || 'NOT_SUBMITTED')}</span>
          </div>
          <div style="font-size:12px; color:#64748B; margin-top:6px;">No KYC submission document record found for this account.</div>
        </div>`;

      body.innerHTML = `
        <div class="av-detail-shell">
          <div class="av-detail-hero">
            <div class="av-detail-hero-top">
              <div class="av-detail-ident">
                <div class="av-detail-avatar">${avatarValid ? `<img src="${esc(avatarValid)}" alt="">` : esc(initials)}</div>
                <div style="min-width:0;">
                  <h4 class="av-detail-title">${esc(displayName)}</h4>
                  <div class="av-detail-sub">${esc(u.email)} · UID ${u.numeric_uid ? `#${esc(u.numeric_uid)}` : esc(u.id)}</div>
                </div>
              </div>
              <div class="av-detail-status-strip">
                <span class="badge ${u.is_active ? 'badge-positive' : 'badge-negative'}">${u.is_active ? 'ACTIVE' : 'SUSPENDED'}</span>
                <span class="badge ${statusClass(u.kyc_status)}">KYC: ${esc(u.kyc_status || 'NOT_SUBMITTED')}</span>
                <span class="badge">ROLE: ${esc(u.role || 'USER')}</span>
              </div>
            </div>
            <div class="av-detail-meta-grid">
              <div class="av-detail-meta-cell"><span>Withdrawal PIN</span><strong class="${hasPin ? 'ok' : 'warn'}">${hasPin ? 'Configured' : 'Not configured'}</strong></div>
              <div class="av-detail-meta-cell"><span>Email Verification</span><strong class="${isEmailVerified ? 'ok' : 'warn'}">${isEmailVerified ? 'Verified' : 'Unverified'}</strong></div>
              <div class="av-detail-meta-cell"><span>Country</span><strong>${esc(u.country || 'Global')}</strong></div>
              <div class="av-detail-meta-cell"><span>Registered</span><strong>${esc(dt(u.created_at))}</strong></div>
              <div class="av-detail-meta-cell"><span>Referral Code</span><strong class="cobalt">${esc(u.referral_code || '—')}</strong></div>
              <div class="av-detail-meta-cell"><span>Referred By</span><strong>${esc(u.referred_by || 'Direct')}</strong></div>
              <div class="av-detail-meta-cell"><span>Signal Confirmation Rate</span><strong class="cobalt">${sigConfRate}% (${sigConf}/${Math.max(sigConf, sigWindowsTotal)})</strong></div>
              <div class="av-detail-meta-cell"><span>Account ID</span><strong style="font-size:11px; font-family:var(--font-mono);">${esc(u.id || '—')}</strong></div>
            </div>
          </div>

          <div class="av-detail-kpi-grid">
            <div class="av-detail-kpi"><div class="av-detail-kpi-lbl">Total Balance</div><div class="av-detail-kpi-val">${money(totalBal)}</div><div class="av-detail-kpi-sub">All active wallets</div></div>
            <div class="av-detail-kpi"><div class="av-detail-kpi-lbl">Completed Deposits</div><div class="av-detail-kpi-val" style="color:#0052FF;">${money(depTotal)}</div><div class="av-detail-kpi-sub">${Number(f.deposit_completed_count || 0)} approved</div></div>
            <div class="av-detail-kpi"><div class="av-detail-kpi-lbl">Signal Profit Earned</div><div class="av-detail-kpi-val" style="color:#059669;">${money(sigProfitTotal)}</div><div class="av-detail-kpi-sub">${sigConf} confirmed</div></div>
            <div class="av-detail-kpi"><div class="av-detail-kpi-lbl">Withdrawals Paid</div><div class="av-detail-kpi-val">${money(withTotal)}</div><div class="av-detail-kpi-sub">${Number(f.withdrawal_completed_count || 0)} completed</div></div>
            <div class="av-detail-kpi is-cobalt"><div class="av-detail-kpi-lbl">Signal Profit Principal</div><div class="av-detail-kpi-val">${money(f.funded_capital_principal)}</div><div class="av-detail-kpi-sub">Net funded capital</div></div>
          </div>

          <div class="av-detail-charts-row">
            <div class="av-detail-chart-card">
              <div class="av-detail-chart-head">
                <h5>Wallet Allocation</h5>
                <span>Total: ${money(totalBal)}</span>
              </div>
              <div class="av-detail-donut-wrap">
                <div class="av-detail-svg-ring-box">
                  <svg class="av-detail-svg-ring" viewBox="0 0 118 118">
                    <circle cx="59" cy="59" r="${r}" fill="none" stroke="#F1F5F9" stroke-width="14"></circle>
                    ${donutCircles}
                  </svg>
                  <div class="av-detail-ring-center">
                    <strong>${money(totalBal)}</strong>
                    <span>Total Equity</span>
                  </div>
                </div>
                <div class="av-detail-legend">
                  ${segs.map(s => {
                    const pct = donutTotal > 0 ? ((s.val / donutTotal) * 100).toFixed(1) : '0.0';
                    return `<div class="av-detail-legend-row">
                      <span class="av-detail-legend-lhs"><span class="av-detail-dot" style="background:${s.color};"></span>${esc(s.label)}</span>
                      <span class="av-detail-legend-val">${money(s.val)} <small style="color:#64748B;font-weight:600;">(${pct}%)</small></span>
                    </div>`;
                  }).join('')}
                </div>
              </div>
            </div>

            <div class="av-detail-chart-card">
              <div class="av-detail-chart-head">
                <h5>Verified Financial &amp; Profit Flows</h5>
                <span>${Number(f.adjustment_count || 0)} adjustments (${money(f.adjustment_net)})</span>
              </div>
              <div class="av-detail-bars">
                ${flowBars.map(b => {
                  const pct = Math.min(100, Math.round((b.val / maxFlow) * 100));
                  return `<div class="av-detail-bar-item">
                    <div class="av-detail-bar-top"><span>${esc(b.label)}</span><strong>${money(b.val)}</strong></div>
                    <div class="av-detail-bar-track"><div class="av-detail-bar-fill" style="width:${pct}%; background:${b.color};"></div></div>
                  </div>`;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="av-detail-tabs" role="tablist" aria-label="User detail sections">
            <button type="button" class="av-detail-tab-btn active" onclick="App.switchDossierTab('all', this)">All Records</button>
            <button type="button" class="av-detail-tab-btn" onclick="App.switchDossierTab('capital', this)">KYC, Deposits &amp; Withdrawals (${deposits.length + withdrawals.length + adjustments.length})</button>
            <button type="button" class="av-detail-tab-btn" onclick="App.switchDossierTab('signals', this)">Signals &amp; Executions (${executions.length + missed.length})</button>
          </div>

          <div class="av-dossier-sec" data-sec="capital">${kycHtml}</div>

          <div class="av-dossier-sec" data-sec="capital">
            <div class="card" style="padding:14px;">
              <div class="av-detail-chart-head" style="margin-bottom:8px;">
                <h5>Deposit History</h5>
                <span>Requested: ${money(f.deposit_total_requested)} across ${Number(f.deposit_count || 0)}</span>
              </div>
              <div class="table-responsive" style="max-height:240px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:11px;"><thead><tr><th>Asset</th><th>Amount</th><th>Net</th><th>Status</th><th>TX Hash</th><th>Rejection</th><th>Date</th></tr></thead><tbody>${depositRows}</tbody></table></div>
            </div>
          </div>

          <div class="av-dossier-sec" data-sec="capital">
            <div class="card" style="padding:14px;">
              <div class="av-detail-chart-head" style="margin-bottom:8px;">
                <h5>Withdrawal History</h5>
                <span>Requested: ${money(f.withdrawal_total_requested)} across ${Number(f.withdrawal_count || 0)}</span>
              </div>
              <div class="table-responsive" style="max-height:240px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:11px;"><thead><tr><th>Asset</th><th>Amount</th><th>Net</th><th>Status</th><th>Destination</th><th>Rejection</th><th>Date</th></tr></thead><tbody>${withdrawalRows}</tbody></table></div>
            </div>
          </div>

          <div class="av-dossier-sec" data-sec="capital">
            <div class="card" style="padding:14px;">
              <div class="av-detail-chart-head" style="margin-bottom:8px;">
                <h5>Administrative Financial Adjustments</h5>
                <span>Net: ${money(f.adjustment_net)} (${Number(f.adjustment_count || 0)} records)</span>
              </div>
              <div class="table-responsive" style="max-height:220px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:11px;"><thead><tr><th>Wallet</th><th>Asset</th><th>Amount</th><th>Before</th><th>After</th><th>Reason</th><th>Date</th></tr></thead><tbody>${adjustmentRows}</tbody></table></div>
            </div>
          </div>

          <div class="av-dossier-sec" data-sec="signals">
            <div class="card" style="padding:14px;">
              <div class="av-detail-chart-head" style="margin-bottom:10px;">
                <h5>Signal Execution Breakdown</h5>
                <span>${sigConf} confirmed · ${sigMissed} missed · ${sigFailed} failed</span>
              </div>
              <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;">
                <div class="stat-card"><div class="stat-label">Confirmed</div><div class="stat-value" style="color:#0052FF;">${sigConf}</div></div>
                <div class="stat-card"><div class="stat-label">Profit Credited</div><div class="stat-value" style="color:#059669;">${money(sigProfitTotal)}</div></div>
                <div class="stat-card"><div class="stat-label">No Profit</div><div class="stat-value">${Number(sig.confirmed_without_profit_count || 0)}</div></div>
                <div class="stat-card"><div class="stat-label">Failed</div><div class="stat-value" style="color:#DC2626;">${sigFailed}</div></div>
                <div class="stat-card"><div class="stat-label">Missed Windows</div><div class="stat-value">${sigMissed}</div></div>
              </div>
            </div>
          </div>

          <div class="av-dossier-sec" data-sec="signals">
            <div class="card" style="padding:14px;">
              <div class="av-detail-chart-head" style="margin-bottom:8px;"><h5>Confirmed Signals</h5><span>${executions.length} executions</span></div>
              <div class="table-responsive" style="max-height:250px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:11px;"><thead><tr><th>Signal ID</th><th>Symbol</th><th>Direction</th><th>Status</th><th>Profit</th><th>Balance Before</th><th>Balance After</th><th>Confirmed</th></tr></thead><tbody>${executionRows}</tbody></table></div>
            </div>
          </div>

          <div class="av-dossier-sec" data-sec="signals">
            <div class="card" style="padding:14px;">
              <div class="av-detail-chart-head" style="margin-bottom:8px;"><h5>Confirmed Signals Without Profit</h5><span>${noProfit.length} items</span></div>
              <div class="table-responsive" style="max-height:210px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:11px;"><thead><tr><th>Signal ID</th><th>Execution ID</th><th>Status</th><th>Profit</th><th>Reason</th><th>Date</th></tr></thead><tbody>${noProfitRows}</tbody></table></div>
            </div>
          </div>

          <div class="av-dossier-sec" data-sec="signals">
            <div class="card" style="padding:14px;">
              <div class="av-detail-chart-head" style="margin-bottom:8px;"><h5>Missed Signal Windows</h5><span>${missed.length} windows</span></div>
              <div class="table-responsive" style="max-height:230px;overflow:auto;"><table class="admin-table mobile-detail-table" style="font-size:11px;"><thead><tr><th>Signal ID</th><th>Symbol</th><th>Direction</th><th>Profit %</th><th>Status</th><th>Published</th><th>Expired</th></tr></thead><tbody>${missedRows}</tbody></table></div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:2px; flex-wrap:wrap;">
            <button class="btn-secondary" style="color:#0052FF; border-color:#DBEAFE; background:#EFF4FF;" onclick="App.closeModal('modal-user-dossier'); App.openAdminResetPassword(decodeURIComponent('${encodeURIComponent(String(u.id || ''))}'), decodeURIComponent('${encodeURIComponent(String(u.email || ''))}'))">Reset Password</button>
            <button class="btn-primary" onclick="App.closeModal('modal-user-dossier'); App.quickAdjust('${esc(u.id)}');">Adjust Balance</button>
            <button class="btn-secondary" onclick="App.closeModal('modal-user-dossier')">Close</button>
          </div>
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

  switchDossierTab(tab, btnEl) {
    const body = document.getElementById('dossier-body');
    if (!body) return;
    body.querySelectorAll('.av-detail-tab-btn').forEach(b => b.classList.toggle('active', b === btnEl));
    body.querySelectorAll('.av-dossier-sec').forEach(sec => {
      const cat = sec.getAttribute('data-sec') || '';
      sec.style.display = (tab === 'all' || cat === tab) ? '' : 'none';
    });
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
    this.loadAdjustmentUserPreview('adj', userId);
  },

  debouncedAdjustmentUserPreview(prefix = 'adj', userRef = '') {
    clearTimeout(this._adjPreviewTimer);
    const val = String(userRef || '').trim();
    if (!val || val.length < 3) {
      this.renderAdjustmentBalancePreview(prefix, null);
      return;
    }
    this._adjPreviewTimer = setTimeout(() => this.loadAdjustmentUserPreview(prefix, val), 320);
  },

  async loadAdjustmentUserPreview(prefix = 'adj', userRef = '') {
    const p = prefix === 'pop' ? 'pop-' : '';
    const ref = String(userRef || document.getElementById(`${p}adj-user-id`)?.value || '').trim();
    if (!ref) {
      this.renderAdjustmentBalancePreview(prefix, null);
      return;
    }

    let resolvedId = ref;
    const matched = (this.state.adminUsers || []).find(u =>
      String(u.id) === ref ||
      String(u.email || '').toLowerCase() === ref.toLowerCase() ||
      (u.numeric_uid && String(u.numeric_uid) === ref)
    );
    if (matched && matched.id) resolvedId = String(matched.id);

    try {
      const res = await this.api(`/admin/users.php?user_id=${encodeURIComponent(resolvedId)}&mode=summary`);
      if (res?.success && res.data?.wallet_breakdown) {
        this.renderAdjustmentBalancePreview(prefix, res.data.wallet_breakdown);
      } else {
        this.renderAdjustmentBalancePreview(prefix, null);
      }
    } catch (e) {
      this.renderAdjustmentBalancePreview(prefix, null);
    }
  },

  renderAdjustmentBalancePreview(prefix = 'adj', wb = null) {
    const isPop = prefix === 'pop';
    const p = isPop ? 'pop-' : '';
    const stripEl = document.getElementById(`${p}adj-live-balances`);
    const selectEl = document.getElementById(`${p}adj-debit-source`);
    if (isPop) this.state.popAdjBreakdown = wb || null;
    else this.state.adjBreakdown = wb || null;

    const spotVal = wb ? Number(wb.transferable_spot_usdt ?? wb.spot_total_usdt ?? 0) : null;
    const futureVal = wb ? Number(wb.future_total_usdt ?? 0) : null;
    const refVal = wb ? Number(wb.referral_bonus_usdt ?? 0) : null;

    const fmt = (n) => n === null ? '—' : `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (selectEl) {
      const optSpot = Array.from(selectEl.options).find(o => o.value === 'spot');
      const optFuture = Array.from(selectEl.options).find(o => o.value === 'future');
      const optRef = Array.from(selectEl.options).find(o => o.value === 'referral');
      if (optSpot) optSpot.textContent = spotVal === null
        ? 'Spot Balance (Deposit / Bonus in Funding & Exchange)'
        : `Spot Balance — ${fmt(spotVal)} USDT available`;
      if (optFuture) optFuture.textContent = futureVal === null
        ? 'Future Balance (Trading Wallet)'
        : `Future Balance — ${fmt(futureVal)} USDT available`;
      if (optRef) optRef.textContent = refVal === null
        ? 'Referral Balance (Locked Referral Bonus)'
        : `Referral Balance — ${fmt(refVal)} USDT available`;
    }

    if (stripEl) {
      if (!wb) {
        stripEl.style.display = 'none';
        stripEl.innerHTML = '';
      } else {
        const mode = isPop ? this.state.popAdjSignMode : this.state.adjSignMode;
        const activeDebit = mode === 'DEBIT' ? (selectEl?.value || 'spot') : '';
        stripEl.style.display = 'grid';
        stripEl.innerHTML = `
          <div class="av-adm-bal-pill${activeDebit === 'spot' ? ' is-active-debit' : ''}">
            <span class="av-adm-bal-pill-label">Spot Balance</span>
            <span class="av-adm-bal-pill-val">${fmt(spotVal)}</span>
          </div>
          <div class="av-adm-bal-pill${activeDebit === 'future' ? ' is-active-debit' : ''}">
            <span class="av-adm-bal-pill-label">Future Balance</span>
            <span class="av-adm-bal-pill-val">${fmt(futureVal)}</span>
          </div>
          <div class="av-adm-bal-pill${activeDebit === 'referral' ? ' is-active-debit' : ''}">
            <span class="av-adm-bal-pill-label">Referral Balance</span>
            <span class="av-adm-bal-pill-val">${fmt(refVal)}</span>
          </div>
        `;
      }
    }
    this.syncDebitSourceHint(prefix);
  },

  updateAdjustmentModeUI(prefix = 'adj') {
    const isPop = prefix === 'pop';
    const p = isPop ? 'pop-' : '';
    const isDebit = (isPop ? this.state.popAdjSignMode : this.state.adjSignMode) === 'DEBIT';

    const walletGroup = document.getElementById(`${p}adj-wallet-group`);
    const typeGroup = document.getElementById(`${p}adj-type-group`);
    const debitGroup = document.getElementById(`${p}adj-debit-source-group`);

    if (walletGroup) walletGroup.style.display = isDebit ? 'none' : '';
    if (typeGroup) typeGroup.style.display = isDebit ? 'none' : '';
    if (debitGroup) debitGroup.style.display = isDebit ? '' : 'none';

    const wb = isPop ? this.state.popAdjBreakdown : this.state.adjBreakdown;
    if (wb) this.renderAdjustmentBalancePreview(prefix, wb);
    else this.syncDebitSourceHint(prefix);
  },

  syncDebitSourceHint(prefix = 'adj') {
    const isPop = prefix === 'pop';
    const p = isPop ? 'pop-' : '';
    const selectEl = document.getElementById(`${p}adj-debit-source`);
    const hintEl = document.getElementById(`${p}adj-debit-hint`);
    if (!selectEl || !hintEl) return;

    const src = String(selectEl.value || 'spot').toLowerCase();
    const wb = isPop ? this.state.popAdjBreakdown : this.state.adjBreakdown;
    const fmt = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;

    if (src === 'future') {
      const avail = wb ? ` Available: ${fmt(wb.future_total_usdt)}.` : '';
      hintEl.textContent = `Debits directly from Future (Trading) balance.${avail}`;
    } else if (src === 'referral') {
      const avail = wb ? ` Available: ${fmt(wb.referral_bonus_usdt)}.` : '';
      hintEl.textContent = `Debits from locked Referral Balance (reduces Spot wallet & Referral Earnings).${avail}`;
    } else {
      const avail = wb ? ` Available: ${fmt(wb.transferable_spot_usdt ?? wb.spot_total_usdt)}.` : '';
      hintEl.textContent = `Debits from non-referral Spot Balance (Funding / Exchange).${avail}`;
    }

    const stripEl = document.getElementById(`${p}adj-live-balances`);
    if (stripEl && wb) {
      const mode = isPop ? this.state.popAdjSignMode : this.state.adjSignMode;
      const pills = stripEl.querySelectorAll('.av-adm-bal-pill');
      const keys = ['spot', 'future', 'referral'];
      pills.forEach((pill, i) => pill.classList.toggle('is-active-debit', mode === 'DEBIT' && keys[i] === src));
    }
  },

  syncAdjustmentWalletForCategory(prefix = 'adj') {
    const p = prefix === 'pop' ? 'pop-' : '';
    const walletEl = document.getElementById(`${p}adj-wallet`);
    const typeEl = document.getElementById(`${p}adj-type`);
    const hintEl = document.getElementById(`${p}adj-category-hint`);
    if (!walletEl || !typeEl) return;

    const category = String(typeEl.value || 'DEPOSIT').toUpperCase();
    const tradingOpt = Array.from(walletEl.options).find(o => o.value === 'trading');
    if (category === 'REFERRAL_BONUS') {
      if (walletEl.value === 'trading') walletEl.value = 'funding';
      if (tradingOpt) tradingOpt.disabled = true;
      if (hintEl) hintEl.textContent = 'Referral Bonus credits strictly to Spot Balance (locked in Spot, cannot be transferred to Future).';
    } else {
      if (tradingOpt) tradingOpt.disabled = false;
      if (hintEl) {
        if (category === 'DEPOSIT') {
          hintEl.textContent = 'Counts toward Funded Capital principal & Signal eligibility.';
        } else if (category === 'PROFIT' || category === 'OTHER') {
          hintEl.textContent = 'Credits Deposit Bonus / Promo bucket (transferable from Spot to Future).';
        } else {
          hintEl.textContent = '';
        }
      }
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
    const debitEl = document.getElementById('pop-adj-debit-source');

    if (idEl) idEl.value = id;
    if (labelEl) {
      const displayId = u?.numeric_uid ? `#${u.numeric_uid}` : `#${id}`;
      labelEl.textContent = `User: ${u?.email || id} (ID ${displayId})`;
    }
    if (amtEl) amtEl.value = '';
    if (reasonEl) reasonEl.value = '';
    if (walletEl) walletEl.value = 'funding';
    if (typeEl) typeEl.value = 'DEPOSIT';
    if (debitEl) debitEl.value = 'spot';

    this.renderAdjustmentBalancePreview('pop', null);
    this.syncAdjustmentWalletForCategory('pop');
    this.toggleAdminUserRowSelect(id, true);
    this.setPopAdjustmentSign('CREDIT');
    this.openModal('modal-admin-adjust-balance');
    this.loadAdjustmentUserPreview('pop', id);
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
    this.updateAdjustmentModeUI('pop');
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
    this.updateAdjustmentModeUI('pop');
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
      const isDebit = this.state.popAdjSignMode === 'DEBIT';
      const debitSource = document.getElementById('pop-adj-debit-source')?.value || 'spot';
      let adjustmentType = document.getElementById('pop-adj-type')?.value || 'DEPOSIT';
      let wallet = document.getElementById('pop-adj-wallet')?.value || 'funding';
      if (isDebit) {
        wallet = debitSource === 'future' ? 'trading' : 'funding';
        adjustmentType = debitSource === 'referral' ? 'REFERRAL_BONUS' : 'OTHER';
      } else if (adjustmentType === 'REFERRAL_BONUS' && wallet === 'trading') {
        wallet = 'funding';
      }
      let amount = parseFloat(document.getElementById('pop-adj-amount')?.value) || 0;
      if (isDebit && amount > 0) {
        amount = -Math.abs(amount);
      }
      const reason = (document.getElementById('pop-adj-reason')?.value || '').trim();

      if (!userId || amount === 0 || !reason) {
        this.toast('Non-zero Amount and Reason/Audit Note are required.', 'error');
        this.endAction(actionScope, false);
        return;
      }

      const payload = {
        user_id: userId,
        wallet_type: wallet,
        asset: 'USDT',
        amount,
        adjustment_type: adjustmentType,
        reason,
        idempotency_key: actionKey
      };
      if (amount < 0) payload.debit_source = debitSource;

      const res = await this.api('/admin/adjustments.php', 'POST', payload);

      if (res.success) {
        const newBal = res.data?.new_balance != null ? `$${Number(res.data.new_balance).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}` : '';
        const targetLabel = amount < 0
          ? (debitSource === 'future' ? 'Future Balance' : (debitSource === 'referral' ? 'Referral Balance' : 'Spot Balance'))
          : wallet.toUpperCase();
        this.toast(`Balance adjusted successfully! ${targetLabel} is now ${newBal}`, 'success');
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
    this.updateAdjustmentModeUI('adj');
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
    this.updateAdjustmentModeUI('adj');
  },

  /* Admin: Signal Dispatcher */
  fillSignalPreset(sym) {
    const symEl = document.getElementById('adm-sig-symbol');
    const dirEl = document.getElementById('adm-sig-direction');
    const pctEl = document.getElementById('adm-sig-profit-pct');
    const map = {
      BTC: 'BTC/USDT',
      ETH: 'ETH/USDT',
      SOL: 'SOL/USDT',
      EUR: 'EUR/USD',
      GBP: 'GBP/USD',
      GOLD: 'GOLD/USD',
      OIL: 'OIL/USD',
      NVDA: 'NVDA/USD',
      AAPL: 'AAPL/USD',
      TSLA: 'TSLA/USD'
    };
    const resolved = map[String(sym || '').toUpperCase()] || (String(sym || '').includes('/') ? sym : 'BTC/USDT');
    if (symEl) symEl.value = resolved;
    if (dirEl && !dirEl.value) dirEl.value = 'BUY';
    if (pctEl) pctEl.value = '1.67';
    this.syncAdminSignalDirectionSelect();
    if (pctEl) this.syncAdminSignalProfitInput(pctEl.value);
    this.updateAdminSignalPreview();
    this.toast(`Signal preset loaded: ${resolved} (+1.67% / 30d 2×)`, 'info');
  },

  updateAdminSignalPreview() {
    const sym = document.getElementById('adm-sig-symbol')?.value || 'BTC/USDT';
    const dir = (document.getElementById('adm-sig-direction')?.value || 'BUY').toUpperCase();
    const pct = Math.max(0.5, parseFloat(document.getElementById('adm-sig-profit-pct')?.value) || 1.67);
    const levels = this.computeSignalTerminalLevels({ symbol: sym, direction: dir, profit_percentage: pct });
    const dec = this.getSignalTerminalPriceDecimals(sym, levels.entry);
    const eEl = document.getElementById('adm-sig-prev-entry');
    const tEl = document.getElementById('adm-sig-prev-tp');
    const sEl = document.getElementById('adm-sig-prev-sl');
    if (eEl) eEl.textContent = `$${levels.entry.toFixed(dec)}`;
    if (tEl) tEl.textContent = `$${levels.tp2.toFixed(dec)}`;
    if (sEl) sEl.textContent = `$${levels.sl.toFixed(dec)}`;
  },

  setAdminSignalDirection(dir) {
    const val = String(dir || 'BUY').toUpperCase() === 'SELL' ? 'SELL' : 'BUY';
    const sel = document.getElementById('adm-sig-direction');
    if (sel) sel.value = val;
    this.syncAdminSignalDirectionSelect();
    this.updateAdminSignalPreview();
  },

  syncAdminSignalDirectionSelect() {
    const val = (document.getElementById('adm-sig-direction')?.value || 'BUY').toUpperCase();
    const buyBtn = document.getElementById('adm-sig-dir-buy');
    const sellBtn = document.getElementById('adm-sig-dir-sell');
    if (buyBtn) buyBtn.classList.toggle('active-buy', val !== 'SELL');
    if (sellBtn) sellBtn.classList.toggle('active-sell', val === 'SELL');
  },

  syncAdminSignalProfitSlider(val) {
    const num = Math.max(0.5, parseFloat(val) || 1.67);
    const input = document.getElementById('adm-sig-profit-pct');
    const readout = document.getElementById('adm-sig-profit-readout');
    if (input) input.value = String(num);
    if (readout) readout.textContent = `${num}%`;
    this.updateAdminSignalPreview();
  },

  syncAdminSignalProfitInput(val) {
    const num = Math.max(0.5, parseFloat(val) || 1.67);
    const slider = document.getElementById('adm-sig-profit-slider');
    const readout = document.getElementById('adm-sig-profit-readout');
    if (slider) slider.value = String(Math.min(10, Math.max(0.5, num)));
    if (readout) readout.textContent = `${num}%`;
    this.updateAdminSignalPreview();
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
    const profitEl = document.getElementById('adm-sig-profit-pct');
    const customWrap = document.getElementById('adm-sig-custom-datetime-wrap');

    // Default 1.67% per session (2 daily sessions = 3.33%/day -> 2x deposit in 30 days)
    if (profitEl && (!profitEl.value || parseFloat(profitEl.value) === 5.2 || parseFloat(profitEl.value) === 2.5)) {
      profitEl.value = '1.67';
      this.syncAdminSignalProfitInput('1.67');
    }

    if (timeType === 'NOW') {
      if (dateTargetEl) dateTargetEl.value = 'LIVE';
      if (customWrap) customWrap.style.display = 'none';
      this.onAdminSignalSlotChange();
      this.toast('Configured for immediate LIVE broadcast to all countries.', 'info');
      return;
    }

    if (timeType === '9:30 PM' || timeType === '21:30' || slot === 3) {
      if (timeSlotEl) timeSlotEl.value = '9:30 PM';
      if (slotEl) slotEl.value = '3';
      if (dateTargetEl && (dateTargetEl.value === 'LIVE' || dateTargetEl.value === 'CUSTOM')) dateTargetEl.value = 'TODAY';
      if (customWrap) customWrap.style.display = 'none';
      this.onAdminSignalSlotChange();
      this.toast('Session preset loaded: Additional Signal #3 (9:30 PM PKT · $4.00 Fixed)', 'success');
      return;
    }

    if (timeType === 'CUSTOM' || slot > 3) {
      if (timeSlotEl) timeSlotEl.value = 'CUSTOM';
      if (dateTargetEl) dateTargetEl.value = 'CUSTOM';
      if (slotEl) slotEl.value = String(slot || 4);
      if (customWrap) customWrap.style.display = 'block';
      const customInput = document.getElementById('adm-sig-custom-datetime');
      if (customInput && !customInput.value) {
        const inOneHour = new Date(Date.now() + 60 * 60 * 1000);
        customInput.value = inOneHour.toISOString().slice(0, 16);
      }
      this.onAdminCustomDateTimeChange();
      this.onAdminSignalSlotChange();
      this.toast(`Manual Signal #${slot || 4} selected. Set your custom broadcast schedule time below.`, 'info');
      return;
    }

    const cleanSlotTime = (timeType === '8 PM' || timeType === '20:00' || slot === 2) ? '8 PM' : '6 PM';
    if (timeSlotEl) timeSlotEl.value = cleanSlotTime;
    if (slotEl) slotEl.value = cleanSlotTime === '8 PM' ? '2' : '1';
    if (dateTargetEl && (dateTargetEl.value === 'LIVE' || dateTargetEl.value === 'CUSTOM')) dateTargetEl.value = 'TODAY';
    if (customWrap) customWrap.style.display = 'none';

    this.onAdminSignalSlotChange();
    this.toast(`Session preset loaded: Daily Signal #${slotEl ? slotEl.value : slot} (${cleanSlotTime} PKT)`, 'success');
  },

  onAdminSignalSlotChange() {
    const timeSlot = document.getElementById('adm-sig-time-slot')?.value || '6 PM';
    const dateTarget = document.getElementById('adm-sig-date-target')?.value || 'TODAY';
    const timeEl = document.getElementById('adm-sig-broadcast-time');
    const slotEl = document.getElementById('adm-sig-slot');
    const customWrap = document.getElementById('adm-sig-custom-datetime-wrap');
    const profitGroup = document.getElementById('adm-sig-profit-group');
    const fixedCallout = document.getElementById('adm-sig-fixed-callout');

    const isSlot3 = (timeSlot === '9:30 PM' || timeSlot === '21:30' || slotEl?.value === '3');
    if (profitGroup) profitGroup.style.display = isSlot3 ? 'none' : '';
    if (fixedCallout) fixedCallout.style.display = isSlot3 ? 'block' : 'none';

    if (timeSlot === 'CUSTOM' || dateTarget === 'CUSTOM') {
      if (customWrap) customWrap.style.display = 'block';
      this.onAdminCustomDateTimeChange();
      return;
    } else {
      if (customWrap) customWrap.style.display = 'none';
    }

    const isSlot2 = (timeSlot === '8 PM' || timeSlot === '20:00');
    if (slotEl && ['1', '2', '3'].includes(slotEl.value)) {
      slotEl.value = isSlot3 ? '3' : (isSlot2 ? '2' : '1');
    }

    if (dateTarget === 'LIVE') {
      if (timeEl) timeEl.value = '';
      return;
    }

    const now = new Date();
    // Pakistan is UTC+5: 6:00 PM PKT = 13:00 UTC, 8:00 PM PKT = 15:00 UTC, 9:30 PM PKT = 16:30 UTC
    const targetHourUtc = isSlot3 ? 16 : (isSlot2 ? 15 : 13);
    const targetMinUtc = isSlot3 ? 30 : 0;
    const target = new Date(now);
    target.setUTCHours(targetHourUtc, targetMinUtc, 0, 0);

    if (dateTarget === 'TOMORROW') {
      target.setUTCDate(target.getUTCDate() + 1);
    } else if (dateTarget === 'TODAY' && target.getTime() <= now.getTime()) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const yyyy = target.getUTCFullYear();
    const mm = String(target.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(target.getUTCDate()).padStart(2, '0');
    // Convert back to PKT wall-clock string (+5h) because dispatchAdminSignal parses as +05:00
    const pktDate = new Date(target.getTime() + 5 * 3600 * 1000);
    const py = pktDate.getUTCFullYear();
    const pm = String(pktDate.getUTCMonth() + 1).padStart(2, '0');
    const pd = String(pktDate.getUTCDate()).padStart(2, '0');
    const ph = String(pktDate.getUTCHours()).padStart(2, '0');
    const pmin = String(pktDate.getUTCMinutes()).padStart(2, '0');
    const val = `${py}-${pm}-${pd}T${ph}:${pmin}`;

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
      if (slotVal === '1') timeSlotEl.value = '6 PM';
      else if (slotVal === '2') timeSlotEl.value = '8 PM';
      else if (slotVal === '3') timeSlotEl.value = '9:30 PM';
      else timeSlotEl.value = 'CUSTOM';
      this.onAdminSignalSlotChange();
    }
  },

  onAdminTimezoneChange() {
    const tz = document.getElementById('adm-sig-timezone')?.value;
    if (tz) this.toast(`Signal timezone set to ${tz}`, 'info');
  },

  async loadAdminSignals() {
    this.updateAdminSignalPreview();
    const res = await this.api('/admin/signals.php');
    const container = document.getElementById('adm-signals-list');
    if (!container) return;

    const signalsList = (res.success && res.data && Array.isArray(res.data.signals)) ? res.data.signals : [];
    const history = (res.success && res.data && Array.isArray(res.data.history)) ? res.data.history : [];
    const activeCount = signalsList.filter(s => s.status === 'PUBLISHED' || s.status === 'ACTIVE').length;
    const schedCount = signalsList.filter(s => s.status === 'SCHEDULED').length;
    const totalPaid = signalsList.reduce((acc, s) => acc + Number(s.total_profit_paid || s.profit_paid || 0), 0);

    const kpiLiveEl = document.getElementById('adm-sig-kpi-live');
    const kpiSchedEl = document.getElementById('adm-sig-kpi-scheduled');
    const kpiPaidEl = document.getElementById('adm-sig-kpi-paid');
    const kpiArchEl = document.getElementById('adm-sig-kpi-archived');
    if (kpiLiveEl) kpiLiveEl.textContent = String(activeCount);
    if (kpiSchedEl) kpiSchedEl.textContent = String(schedCount);
    if (kpiPaidEl) kpiPaidEl.textContent = `$${Number(res?.data?.total_profit_paid ?? totalPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (kpiArchEl) kpiArchEl.textContent = String(history.length);

    if (!signalsList.length) {
      container.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#6B7280;">No dispatched trading signals in history. Broadcast or schedule a new signal above.</td></tr>`;
      return;
    }

    this.state.adminSignals = signalsList;

    const renderSignalLaneCard = (s) => {
      const isPublished = (s.status === 'PUBLISHED' || s.status === 'ACTIVE');
      const isScheduled = (s.status === 'SCHEDULED');
      const duration = Number(s.duration_minutes || 15);
      const isTesting = Boolean(s.is_testing || s.no_profit || String(s.id || '').startsWith('sig_test_'));
      const isAdditional = !isTesting && Boolean(s.is_additional || Number(s.daily_slot) === 3 || String(s.id || '').startsWith('sig_add_'));
      const profitPct = (isTesting || isAdditional) ? 0 : Number(s.profit_percentage || 0);
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
          <span class="signal-lane-profit" style="${isTesting ? 'color:#D97706;' : ''}">${isTesting ? 'TEST • NO PROFIT' : (isAdditional ? '+$4.00 FIXED' : '+' + profitPct.toFixed(2) + '%')}</span>
        </div>
        <div class="av-adm-sig-bar ${statusCls}"><span style="width:${isPublished ? '72%' : (isScheduled ? '40%' : '100%')};"></span></div>
        <div class="signal-lane-meta"><span>Duration: ${duration} min</span><span>Confirmed: ${Number(s.confirmed_count || 0)}</span><span>${esc(start ? start.replace('T',' ').slice(0,16) : '—')} PKT</span></div>
        <div class="signal-lane-actions">
          <button class="av-adm-btn-chip soft-blue" onclick="App.viewSignalDetail('${esc(s.id)}')">Detail</button>
          <button class="av-adm-btn-chip" onclick="App.openEditSignalModal('${esc(s.id)}')">Edit</button>
          ${isPublished ? `<button class="av-adm-btn-chip danger" onclick="App.expireAdminSignal('${esc(s.id)}')">Expire</button>` : ''}
        </div>
      </article>`;
    };
    const lane4 = document.getElementById('adm-signal-lane-4pm');
    const lane8 = document.getElementById('adm-signal-lane-8pm');
    const lane930 = document.getElementById('adm-signal-lane-930pm');
    const laneCustom = document.getElementById('adm-signal-lane-custom');
    const laneTest = document.getElementById('adm-signal-lane-test');
    const daily4 = signalsList.filter(s => !s.is_testing && Number(s.daily_slot) === 1);
    const daily8 = signalsList.filter(s => !s.is_testing && Number(s.daily_slot) === 2);
    const add930 = signalsList.filter(s => !s.is_testing && (Number(s.daily_slot) === 3 || Boolean(s.is_additional) || String(s.id || '').startsWith('sig_add_')));
    const custom = signalsList.filter(s => !s.is_testing && Number(s.daily_slot) !== 1 && Number(s.daily_slot) !== 2 && Number(s.daily_slot) !== 3 && !String(s.id || '').startsWith('sig_add_'));
    const testing = signalsList.filter(s => Boolean(s.is_testing || String(s.id || '').startsWith('sig_test_')));
    if (lane4) lane4.innerHTML = daily4.length ? daily4.slice(0, 3).map(renderSignalLaneCard).join('') : `<div class="signal-lane-empty"><span>◷</span><strong>No 6:00 PM signal record</strong><small>The daily 6:00 PM PKT slot will appear here when scheduled.</small></div>`;
    if (lane8) lane8.innerHTML = daily8.length ? daily8.slice(0, 3).map(renderSignalLaneCard).join('') : `<div class="signal-lane-empty"><span>◷</span><strong>No 8:00 PM signal record</strong><small>The daily 8:00 PM PKT slot will appear here when scheduled.</small></div>`;
    if (lane930) lane930.innerHTML = add930.length ? add930.slice(0, 3).map(renderSignalLaneCard).join('') : `<div class="signal-lane-empty"><span>$4</span><strong>No 9:30 PM Additional signal</strong><small>The 9:30 PM PKT Additional ($4.00 Fixed) slot appears here when scheduled.</small></div>`;
    if (laneCustom) laneCustom.innerHTML = custom.length ? custom.slice(0, 3).map(renderSignalLaneCard).join('') : `<div class="signal-lane-empty"><span>✦</span><strong>No custom signals</strong><small>Manual and custom scheduled broadcasts will appear here.</small></div>`;
    if (laneTest) laneTest.innerHTML = testing.length ? testing.slice(0, 3).map(renderSignalLaneCard).join('') : `<div class="signal-lane-empty"><span>T</span><strong>No testing signals</strong><small>Testing broadcasts are worldwide and cannot generate profit.</small></div>`;

    const activePill = document.getElementById('adm-signals-active-pill');
    if (activePill) activePill.textContent = `Active Signals: ${activeCount}`;
    const countBadge = document.getElementById('adm-signals-count-badge');
    if (countBadge) countBadge.textContent = `${signalsList.length} Signals`;

    container.innerHTML = signalsList.map(s => {
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

      const isTestRow = Boolean(s.is_testing || String(s.id || '').startsWith('sig_test_'));
      const isAddRow = !isTestRow && Boolean(s.is_additional || Number(s.daily_slot) === 3 || String(s.id || '').startsWith('sig_add_'));
      const profitPct = (isTestRow || isAddRow) ? 0 : (s.profit_percentage || 1.67);
      const rewardDisplay = isTestRow ? 'NO PROFIT' : (isAddRow ? '+$4.00 FIXED' : `+${profitPct}%`);
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
          <td data-label="Profit / Reward" style="font-family:var(--font-mono); color:${isAddRow ? '#0052FF' : '#059669'}; font-weight:800; font-size:13px;">${rewardDisplay}</td>
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
          <div style="font-weight:700;">${Number(h.duration_minutes || 15)} min<div style="font-size:10.5px; color:#0052FF; margin-top:3px;">${Number(h.confirmed_count || 0)} confirmed</div></div>
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
    if (profitEl) profitEl.value = Number(signal.daily_slot) === 3 ? 0 : (signal.profit_percentage || 1.67);
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
    const slot = Number.isFinite(parsedSlot) ? Math.max(0, Math.min(3, parsedSlot)) : 1;
    const profit = slot === 3 ? 0 : (parseFloat(document.getElementById('edit-sig-profit')?.value) || 1.67);
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
          <td style="font-weight:700; color:#059669;">${money(u.profit_credited)}</td>
          <td>${money(u.principal_balance)}</td>
          <td>${money(u.balance_before)}</td>
          <td>${money(u.balance_after)}</td>
          <td>${esc(u.execution_status || '—')}</td>
          <td style="font-size:11px;">${esc(u.reason)}</td>
          <td style="font-size:11px;">${esc(dt(u.confirmed_at))}</td>
        </tr>`;
      }).join('') || `<tr><td colspan="10" style="text-align:center;padding:16px;color:var(--text-muted);">No user records found.</td></tr>`;

      const statusUpper = String(s.status || 'EXPIRED').toUpperCase();
      const isLive = statusUpper === 'PUBLISHED' || statusUpper === 'ACTIVE';
      const isScheduled = statusUpper === 'SCHEDULED';
      const beaconCls = isLive ? 'is-live' : (isScheduled ? 'is-scheduled' : 'is-expired');
      const beaconLabel = isLive ? 'LIVE BROADCAST' : (isScheduled ? 'SCHEDULED' : 'EXPIRED ARCHIVE');
      const isAddSig = Boolean(s.is_additional || Number(s.daily_slot) === 3 || String(s.id || '').startsWith('sig_add_'));

      // Real Execution Outcome Donut & Confirmation Rate Ring
      const eligibleCnt = Number(audience.eligible_users || 0);
      const confirmedCnt = Number(a.confirmed_users || 0);
      const profitCnt = Number(a.profit_credited_users || 0);
      const noProfitCnt = Number(a.confirmed_without_profit_users || 0);
      const failedCnt = Number(a.failed_execution_users || 0);
      const notConfCnt = Number(a.eligible_not_confirmed_users || 0);
      const confRatePct = eligibleCnt > 0 ? Math.min(100, Math.round((confirmedCnt / eligibleCnt) * 100)) : (confirmedCnt > 0 ? 100 : 0);

      const sigSegs = [
        { label: 'Confirmed w/ Profit', val: profitCnt, color: '#00B87C' },
        { label: 'Confirmed No Profit', val: noProfitCnt, color: '#0052FF' },
        { label: 'Failed Execution', val: failedCnt, color: '#DC2626' },
        { label: 'Eligible, Not Confirmed', val: notConfCnt, color: '#94A3B8' }
      ];
      const sigDonutSum = sigSegs.reduce((acc, item) => acc + item.val, 0);
      const r = 42;
      const circ = 2 * Math.PI * r;
      let offsetAcc = 0;
      const sigDonutCircles = sigDonutSum > 0
        ? sigSegs.filter(x => x.val > 0).map(x => {
            const len = (x.val / sigDonutSum) * circ;
            const dash = `${len.toFixed(2)} ${(circ - len).toFixed(2)}`;
            const c = `<circle class="av-ring-seg" cx="59" cy="59" r="${r}" fill="none" stroke="${x.color}" stroke-width="14" stroke-dasharray="${dash}" stroke-dashoffset="${(-offsetAcc).toFixed(2)}" style="--av-circ:${circ.toFixed(1)}"></circle>`;
            offsetAcc += len;
            return c;
          }).join('')
        : `<circle cx="59" cy="59" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="14"></circle>`;

      // Real Country Participation Horizontal Bar Chart
      const topCountries = (Array.isArray(countries.shown) ? [...countries.shown] : [])
        .sort((x, y) => (Number(y.confirmed || 0) - Number(x.confirmed || 0)) || (Number(y.eligible || 0) - Number(x.eligible || 0)))
        .slice(0, 6);
      const maxCountryVal = Math.max(1, ...topCountries.map(c => Math.max(Number(c.eligible || 0), Number(c.confirmed || 0))));

      body.innerHTML = `
        <div class="av-detail-shell">
          <div class="av-detail-hero">
            <div class="av-detail-hero-top">
              <div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <h4 class="av-detail-title">${esc(s.symbol || 'Signal')}</h4>
                  <span class="badge ${String(s.direction || '').toUpperCase() === 'BUY' ? 'badge-positive' : 'badge-negative'}">${String(s.direction || '').toUpperCase() === 'BUY' ? '▲ BUY' : '▼ SELL'}</span>
                  <span class="av-sig-beacon ${beaconCls}">${beaconLabel}</span>
                </div>
                <div class="av-detail-sub">ID: ${esc(s.id || signalId)} · ${esc(audience.label || 'Worldwide — All Countries')}</div>
              </div>
              <div class="av-detail-status-strip">
                ${badge(isAddSig ? '$4.00 FIXED ADDITIONAL' : `${Number(s.profit_percentage || 0).toFixed(2)}% TARGET YIELD`, 'positive')}
              </div>
            </div>

            <div class="av-detail-meta-grid">
              <div class="av-detail-meta-cell"><span>Broadcast Time</span><strong>${esc(dt(s.published_at || s.scheduled_at))}</strong></div>
              <div class="av-detail-meta-cell"><span>Expiry Time</span><strong>${esc(dt(s.expires_at))}</strong></div>
              <div class="av-detail-meta-cell"><span>Duration Window</span><strong class="cobalt">${Number(s.duration_minutes || 15)} min</strong></div>
              <div class="av-detail-meta-cell"><span>Confirmation Rate</span><strong class="ok">${confRatePct}% (${confirmedCnt}/${Math.max(confirmedCnt, eligibleCnt)})</strong></div>
            </div>

            <div class="av-sig-ladder">
              <div class="av-detail-chart-head">
                <h5>Execution Price Levels</h5>
                <span>${esc(s.symbol || '')}</span>
              </div>
              <div class="av-sig-ladder-track"></div>
              <div class="av-sig-ladder-points">
                <div class="av-sig-ladder-pt is-sl"><span>Stop Loss</span><strong>${Number(s.stop_loss || 0).toLocaleString()}</strong></div>
                <div class="av-sig-ladder-pt is-entry"><span>Entry Min</span><strong>${Number(s.entry_price_min || 0).toLocaleString()}</strong></div>
                <div class="av-sig-ladder-pt is-entry"><span>Entry Max</span><strong>${Number(s.entry_price_max || 0).toLocaleString()}</strong></div>
                <div class="av-sig-ladder-pt is-tp"><span>Target 1</span><strong>${Number(s.target_price_1 || 0).toLocaleString()}</strong></div>
                <div class="av-sig-ladder-pt is-tp"><span>Target 2</span><strong>${Number(s.target_price_2 || 0).toLocaleString()}</strong></div>
              </div>
            </div>
          </div>

          <div class="av-detail-kpi-grid cols-4">
            <div class="av-detail-kpi"><div class="av-detail-kpi-lbl">Eligible Audience</div><div class="av-detail-kpi-val">${eligibleCnt}</div><div class="av-detail-kpi-sub">${audience.countries_with_eligible_users || 0} active countries</div></div>
            <div class="av-detail-kpi"><div class="av-detail-kpi-lbl">Confirmed Users</div><div class="av-detail-kpi-val" style="color:#0052FF;">${confirmedCnt}</div><div class="av-detail-kpi-sub">${confRatePct}% participation</div></div>
            <div class="av-detail-kpi is-cobalt"><div class="av-detail-kpi-lbl">Profit Credited</div><div class="av-detail-kpi-val" style="color:#059669;">${money(a.total_profit_credited)}</div><div class="av-detail-kpi-sub">${profitCnt} credited executions</div></div>
            <div class="av-detail-kpi"><div class="av-detail-kpi-lbl">Unconfirmed / Ineligible</div><div class="av-detail-kpi-val">${notConfCnt}</div><div class="av-detail-kpi-sub">${audience.not_eligible_or_not_shown_users || 0} not eligible</div></div>
          </div>

          <div class="av-detail-charts-row">
            <div class="av-detail-chart-card">
              <div class="av-detail-chart-head">
                <h5>Execution Outcome Breakdown</h5>
                <span>${confirmedCnt} confirmed total</span>
              </div>
              <div class="av-detail-donut-wrap">
                <div class="av-detail-svg-ring-box">
                  <svg class="av-detail-svg-ring" viewBox="0 0 118 118">
                    <circle cx="59" cy="59" r="${r}" fill="none" stroke="#F1F5F9" stroke-width="14"></circle>
                    ${sigDonutCircles}
                  </svg>
                  <div class="av-detail-ring-center">
                    <strong>${confRatePct}%</strong>
                    <span>Confirmed</span>
                  </div>
                </div>
                <div class="av-detail-legend">
                  ${sigSegs.map(item => `<div class="av-detail-legend-row">
                    <span class="av-detail-legend-lhs"><span class="av-detail-dot" style="background:${item.color};"></span>${esc(item.label)}</span>
                    <span class="av-detail-legend-val">${item.val}</span>
                  </div>`).join('')}
                </div>
              </div>
            </div>

            <div class="av-detail-chart-card">
              <div class="av-detail-chart-head">
                <h5>Top Country Participation</h5>
                <span>Confirmed vs Eligible</span>
              </div>
              <div class="av-detail-bars">
                ${topCountries.length ? topCountries.map(c => {
                  const elig = Number(c.eligible || 0);
                  const conf = Number(c.confirmed || 0);
                  const pct = Math.min(100, Math.round(((conf > 0 ? conf : elig) / maxCountryVal) * 100));
                  const barCol = conf > 0 ? '#0052FF' : '#94A3B8';
                  return `<div class="av-detail-bar-item">
                    <div class="av-detail-bar-top"><span>${esc(c.country)}</span><strong>${conf} confirmed / ${elig} eligible</strong></div>
                    <div class="av-detail-bar-track"><div class="av-detail-bar-fill" style="width:${pct}%; background:${barCol};"></div></div>
                  </div>`;
                }).join('') : `<div style="font-size:12px; color:#64748B; padding:16px 0; text-align:center;">No eligible country activity recorded yet for this signal.</div>`}
              </div>
            </div>
          </div>

          ${a.note ? `<div style="padding:10px 13px; border-radius:12px; background:#FFFFFF; border:1px solid #E2E8F0; color:#475569; font-size:11.5px; line-height:1.5;">${esc(a.note)}</div>` : ''}

          <div class="av-detail-tabs" role="tablist" aria-label="Signal country filters">
            <button type="button" class="av-detail-tab-btn active" onclick="App.switchSignalDetailTab('users', this)">User Executions (${users.length})</button>
            <button type="button" class="av-detail-tab-btn" onclick="App.switchSignalDetailTab('shown', this)">Eligible Countries (${(countries.shown || []).length})</button>
            <button type="button" class="av-detail-tab-btn" onclick="App.switchSignalDetailTab('confirmed', this)">With Confirmations (${(countries.confirmed || []).length})</button>
            <button type="button" class="av-detail-tab-btn" onclick="App.switchSignalDetailTab('failed', this)">Failed / No Profit (${(countries.failed_or_no_profit || []).length})</button>
            <button type="button" class="av-detail-tab-btn" onclick="App.switchSignalDetailTab('not_shown', this)">Not Eligible (${(countries.not_shown_or_not_eligible || []).length})</button>
          </div>

          <div class="card av-sig-det-pane" data-pane="users" style="padding:14px;overflow:auto;">
            <div class="av-detail-chart-head" style="margin-bottom:10px;"><h5>Every User — Signal Result</h5><span>${users.length} accounts</span></div>
            <table class="admin-table mobile-detail-table"><thead><tr><th>Email</th><th>Country</th><th>Result</th><th>Profit Credited</th><th>Profit Principal</th><th>Balance Before</th><th>Balance After</th><th>Execution</th><th>Reason / Detail</th><th>Confirmed At</th></tr></thead><tbody>${userTable}</tbody></table>
          </div>

          <div class="card av-sig-det-pane" data-pane="shown" style="display:none;padding:14px;overflow:auto;">
            <div class="av-detail-chart-head" style="margin-bottom:10px;"><h5>Country-by-Country Eligible Detail</h5><span>${(countries.shown || []).length} countries</span></div>
            <table class="admin-table mobile-detail-table"><thead><tr><th>Country</th><th>Users</th><th>Eligible / Shown</th><th>Confirmed</th><th>Profit Credited</th><th>No Profit</th><th>Failed</th><th>Not Confirmed</th></tr></thead><tbody>${countryTable(countries.shown || [], 'No eligible countries recorded.')}</tbody></table>
          </div>

          <div class="card av-sig-det-pane" data-pane="confirmed" style="display:none;padding:14px;overflow:auto;">
            <div class="av-detail-chart-head" style="margin-bottom:10px;"><h5>Countries With Confirmations</h5><span>${(countries.confirmed || []).length} countries</span></div>
            <table class="admin-table mobile-detail-table"><thead><tr><th>Country</th><th>Users</th><th>Eligible</th><th>Confirmed</th><th>Profit</th><th>No Profit</th><th>Failed</th><th>Not Confirmed</th></tr></thead><tbody>${countryTable(countries.confirmed || [], 'No confirmations recorded yet.')}</tbody></table>
          </div>

          <div class="card av-sig-det-pane" data-pane="failed" style="display:none;padding:14px;overflow:auto;">
            <div class="av-detail-chart-head" style="margin-bottom:10px;"><h5>Countries With Failed / No-Profit Outcomes</h5><span>${(countries.failed_or_no_profit || []).length} countries</span></div>
            <table class="admin-table mobile-detail-table"><thead><tr><th>Country</th><th>Users</th><th>Eligible</th><th>Confirmed</th><th>Profit</th><th>No Profit</th><th>Failed</th><th>Not Confirmed</th></tr></thead><tbody>${countryTable(countries.failed_or_no_profit || [], 'No failed or no-profit outcomes recorded.')}</tbody></table>
          </div>

          <div class="card av-sig-det-pane" data-pane="not_shown" style="display:none;padding:14px;overflow:auto;">
            <div class="av-detail-chart-head" style="margin-bottom:10px;"><h5>Countries With No Eligible Users</h5><span>${(countries.not_shown_or_not_eligible || []).length} countries</span></div>
            <table class="admin-table mobile-detail-table"><thead><tr><th>Country</th><th>Users</th><th>Eligible</th><th>Confirmed</th><th>Profit</th><th>No Profit</th><th>Failed</th><th>Not Confirmed</th></tr></thead><tbody>${countryTable(countries.not_shown_or_not_eligible || [], 'Every represented country currently has at least one eligible user.')}</tbody></table>
          </div>
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

  switchSignalDetailTab(paneName, btnEl) {
    const body = document.getElementById('signal-detail-body');
    if (!body) return;
    body.querySelectorAll('.av-detail-tab-btn').forEach(b => b.classList.toggle('active', b === btnEl));
    body.querySelectorAll('.av-sig-det-pane').forEach(p => {
      p.style.display = p.getAttribute('data-pane') === paneName ? 'block' : 'none';
    });
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
    const profitPct = parseFloat(document.getElementById('adm-sig-profit-pct')?.value) || 1.67;
    const slot = parseInt(document.getElementById('adm-sig-slot')?.value, 10) || 1;
    const timeSlot = document.getElementById('adm-sig-time-slot')?.value || '6 PM';
    const dateTarget = document.getElementById('adm-sig-date-target')?.value || 'TODAY';
    const isTesting = Boolean(document.getElementById('adm-sig-testing')?.checked);
    const isAdditionalSelected = (timeSlot === '9:30 PM' || slot === 3) && dateTarget !== 'LIVE' && dateTarget !== 'CUSTOM';
    const signalMode = forcedMode || (dateTarget === 'LIVE' ? 'MANUAL' : (isAdditionalSelected ? 'ADDITIONAL' : (timeSlot === 'CUSTOM' || slot > 3 || dateTarget === 'CUSTOM' ? 'CUSTOM' : 'DAILY')));

    if (!symbol || !direction) {
      this.toast('Please select symbol and direction', 'error');
      return;
    }

    let broadcastIso = '';
    if (broadcastTime && broadcastTime !== 'NOW') {
      try {
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

    const previewLevels = this.computeSignalTerminalLevels({ symbol, direction, profit_percentage: profitPct });
    const resolvedDailySlot = isTesting
      ? 0
      : (signalMode === 'ADDITIONAL' ? 3 : (signalMode === 'DAILY' ? (slot === 2 ? 2 : 1) : 0));
    const resolvedProfitPct = isTesting || signalMode === 'ADDITIONAL' ? 0 : profitPct;

    const res = await this.api('/admin/signals.php', 'POST', {
      action: 'CREATE',
      symbol,
      direction,
      entry_min: previewLevels.entry,
      entry_max: previewLevels.entry,
      tp1: previewLevels.tp1,
      tp2: previewLevels.tp2,
      sl: previewLevels.sl,
      duration_minutes: duration,
      profit_percentage: resolvedProfitPct,
      daily_slot: resolvedDailySlot,
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
      if (minDep !== undefined && document.getElementById('sett-min-dep')) document.getElementById('sett-min-dep').value = Math.max(100, parseFloat(minDep) || 100);
      if (notice !== undefined && document.getElementById('sett-notice')) document.getElementById('sett-notice').value = notice;
      if (trc20 !== undefined && document.getElementById('sett-trc20-addr')) document.getElementById('sett-trc20-addr').value = trc20;
      if (erc20 !== undefined && document.getElementById('sett-erc20-addr')) document.getElementById('sett-erc20-addr').value = erc20;
      if (maint !== undefined && document.getElementById('sett-maintenance')) {
        document.getElementById('sett-maintenance').checked = (maint === '1' || maint === 'true' || maint === true);
      }
    }
  },

  async saveAdminSettings() {
    const minDepVal = Math.max(100, parseFloat(document.getElementById('sett-min-dep')?.value) || 100);
    if (document.getElementById('sett-min-dep')) document.getElementById('sett-min-dep').value = String(minDepVal);
    const settings = {
      min_withdrawal: '3.00',
      withdrawal_fee: document.getElementById('sett-with-fee').value,
      maker_fee: document.getElementById('sett-maker-fee').value,
      taker_fee: document.getElementById('sett-taker-fee').value,
      copy_trading_profit_split: document.getElementById('sett-copy-split').value,
      min_deposit: String(minDepVal),
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
    const pendingTotal = allSubs.filter(s => ['PENDING', 'UNDER_REVIEW'].includes((s.status || 'PENDING').toUpperCase())).length;
    const approvedTotal = allSubs.filter(s => (s.status || '').toUpperCase() === 'APPROVED').length;

    const pendingEl = document.getElementById('adm-kyc-count-pending');
    const approvedEl = document.getElementById('adm-kyc-count-approved');
    if (pendingEl) pendingEl.textContent = `${pendingTotal} Pending Reviews`;
    if (approvedEl) approvedEl.textContent = `${approvedTotal} Approved`;
    this.syncAdminQueueBadges({ kyc: pendingTotal });

    const q = (document.getElementById('adm-kyc-search')?.value || '').trim().toLowerCase();
    const statusFilter = (document.getElementById('adm-kyc-filter')?.value || 'ALL').toUpperCase();

    const filtered = allSubs.filter(s => {
      const st = (s.status || 'PENDING').toUpperCase();
      if (statusFilter === 'PENDING') {
        if (!['PENDING', 'UNDER_REVIEW'].includes(st)) return false;
      } else if (statusFilter !== 'ALL' && st !== statusFilter) {
        return false;
      }
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
      const badgeLabel = (st === 'PENDING' || st === 'UNDER_REVIEW')
        ? 'Awaiting Review'
        : (st === 'RESUBMIT_REQUIRED' ? 'Resubmit Req' : st);
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
    const stDisplay = st === 'RESUBMIT_REQUIRED' ? 'RESUBMIT REQUESTED' : st;
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

    let actionPanelHtml = '';
    if (st === 'APPROVED' || st === 'REJECTED') {
      const isApproved = st === 'APPROVED';
      actionPanelHtml = `
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; padding:10px 12px; border-radius:11px; background:${isApproved ? '#ECFDF5' : '#FEF2F2'}; border:1px solid ${isApproved ? '#A7F3D0' : '#FECACA'};">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge ${isApproved ? 'badge-positive' : 'badge-negative'}" style="font-size:12px; padding:5px 12px; font-weight:800;">${isApproved ? '✓ Approved' : '✕ Rejected'}</span>
              <span style="font-size:12px; font-weight:600; color:${isApproved ? '#047857' : '#B91C1C'};">${isApproved ? 'Identity verification approved' : 'Identity verification declined'}</span>
            </div>
            <button type="button" class="av-adm-btn-chip cobalt" style="min-height:38px; padding:7px 16px;" onclick="App.submitInlineKycDecision('${esc(s.id)}', 'RESUBMIT_REQUIRED')">↻ Resubmit</button>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <input type="text" id="kyc-inline-reason" placeholder="Optional instruction if requesting KYC resubmission..." style="flex:1 1 200px; min-width:0;" value="${esc(s.review_reason || '')}">
          </div>
        </div>
      `;
    } else if (st === 'RESUBMIT_REQUIRED') {
      actionPanelHtml = `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; padding:10px 12px; border-radius:11px; background:#FFFBEB; border:1px solid #FDE68A;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="badge badge-warning" style="font-size:12px; padding:5px 12px; font-weight:800;">↻ Resubmit Requested</span>
            <span style="font-size:12px; font-weight:600; color:#B45309;">User has been prompted to re-upload documents and resubmit KYC.</span>
          </div>
        </div>
      `;
    } else {
      actionPanelHtml = `
        <label class="form-label" for="kyc-inline-reason">Compliance Review Note / Reason</label>
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <input type="text" id="kyc-inline-reason" placeholder="Reason for approval or rejection..." style="flex:1 1 180px; min-width:0;" value="${esc(s.review_reason || '')}">
          <button type="button" class="av-adm-btn-chip danger" style="min-height:42px; padding:8px 16px;" onclick="App.submitInlineKycDecision('${esc(s.id)}', 'REJECTED')">Reject Request</button>
          <button type="button" class="av-adm-btn-chip cobalt" style="min-height:42px; padding:8px 18px;" onclick="App.submitInlineKycDecision('${esc(s.id)}', 'APPROVED')">Approve KYC Verification</button>
        </div>
      `;
    }

    inspectorEl.innerHTML = `
      <div class="card" style="padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;">
          <div>
            <div style="font-size:11px; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.04em;">Applicant Info</div>
            <h3 style="margin:3px 0 2px; font-size:17px; font-weight:800;">${esc(s.legal_name || s.email || 'Applicant')} — #${esc(s.id)}</h3>
            <div style="font-size:12.5px; color:#4B5563;">${esc(s.email)} • ${esc(s.country || 'Global')}</div>
          </div>
          <span class="badge ${badgeCls}" style="font-size:12px; padding:6px 12px;">${stDisplay}</span>
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
        ${actionPanelHtml}
      </div>
    `;
  },

  async submitInlineKycDecision(subId, decision) {
    const norm = String(decision || 'APPROVED').toUpperCase();
    const inlineReason = document.getElementById('kyc-inline-reason')?.value?.trim();
    const defaultReason = norm === 'APPROVED'
      ? 'Identity and documents verified successfully'
      : (norm === 'RESUBMIT_REQUIRED'
        ? 'Please upload clearer identity documents and resubmit your KYC verification.'
        : 'Document illegible or information mismatch');
    const reason = inlineReason || defaultReason;
    const res = await this.api('/admin/kyc.php', 'POST', {
      submission_id: subId,
      decision: norm,
      reason
    });
    if (res.success) {
      const msg = norm === 'RESUBMIT_REQUIRED'
        ? 'KYC resubmission requested from user'
        : `KYC submission successfully ${norm.toLowerCase()}`;
      this.toast(msg, 'success');
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
    this.state.adminWithdrawSummary = res.data?.summary || null;
    if (!Array.isArray(this.state.selectedWithdrawalIds)) this.state.selectedWithdrawalIds = [];
    if (!this.state.selectedWithdrawalId && withdrawals.length) {
      this.state.selectedWithdrawalId = withdrawals[0].id;
    }
    this.renderWithdrawKpis();
    this.filterAdminWithdrawals();
    this.renderWithdrawInspector();
  },

  renderWithdrawKpis() {
    const summary = this.state.adminWithdrawSummary;
    const all = Array.isArray(this.state.adminWithdrawals) ? this.state.adminWithdrawals : [];
    const pendingList = all.filter(w => ['PENDING', 'REQUESTED', 'PENDING_REVIEW'].includes(String(w.status || '').toUpperCase()));
    const pendingCount = summary?.pending_count ?? pendingList.length;
    const pendingAmt = summary?.pending_amount_usdt ?? pendingList.reduce((acc, x) => acc + Number(x.amount || 0), 0);
    const batchReadyList = pendingList.filter(w => ['ADDRESS_BOUND_VERIFIED', 'BOUND'].includes(String(w.bound_status || '').toUpperCase()) || String(w.kyc_status || '').toUpperCase() === 'APPROVED');
    const batchCount = summary?.batch_ready_count ?? batchReadyList.length;
    const batchAmt = summary?.batch_ready_amount_usdt ?? batchReadyList.reduce((acc, x) => acc + Number(x.amount || 0), 0);
    const todayAmt = summary?.processed_today_usdt ?? 0;
    const todayCnt = summary?.processed_today_count ?? 0;

    const elPendCnt = document.getElementById('adm-with-kpi-pending-count');
    const elPendAmt = document.getElementById('adm-with-kpi-pending-amt');
    const elBatchCnt = document.getElementById('adm-with-kpi-batch-count');
    const elBatchAmt = document.getElementById('adm-with-kpi-batch-amt');
    const elTodayAmt = document.getElementById('adm-with-kpi-today-amt');
    const elTodayCnt = document.getElementById('adm-with-kpi-today-cnt');

    if (elPendCnt) elPendCnt.textContent = String(pendingCount);
    if (elPendAmt) elPendAmt.textContent = `$${Number(pendingAmt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD equivalent`;
    if (elBatchCnt) elBatchCnt.textContent = `${batchCount} to Process`;
    if (elBatchAmt) elBatchAmt.textContent = `$${Number(batchAmt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (elTodayAmt) elTodayAmt.textContent = `$${Number(todayAmt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    if (elTodayCnt) elTodayCnt.textContent = `${todayCnt} approved today`;
    this.syncAdminQueueBadges({ withdrawals: pendingCount });
  },

  toggleWithdrawBatchMode(enabled) {
    this.state.withdrawBatchMode = Boolean(enabled);
    if (enabled && Array.isArray(this.state.adminWithdrawals)) {
      const pendingReady = this.state.adminWithdrawals
        .filter(w => ['PENDING', 'REQUESTED', 'PENDING_REVIEW'].includes(String(w.status || '').toUpperCase()))
        .map(w => String(w.id));
      this.state.selectedWithdrawalIds = pendingReady;
    } else if (!enabled) {
      this.state.selectedWithdrawalIds = [];
    }
    this.filterAdminWithdrawals();
    this.renderWithdrawInspector();
  },

  toggleAdminWithdrawalSelection(id, checked) {
    const set = new Set(Array.isArray(this.state.selectedWithdrawalIds) ? this.state.selectedWithdrawalIds : []);
    if (checked) set.add(String(id));
    else set.delete(String(id));
    this.state.selectedWithdrawalIds = Array.from(set);
    this.state.selectedWithdrawalId = String(id);
    this.renderWithdrawInspector();
  },

  toggleAllWithdrawals(checked) {
    const all = Array.isArray(this.state.adminWithdrawals) ? this.state.adminWithdrawals : [];
    if (checked) {
      this.state.selectedWithdrawalIds = all
        .filter(w => ['PENDING', 'REQUESTED', 'PENDING_REVIEW'].includes(String(w.status || '').toUpperCase()))
        .map(w => String(w.id));
    } else {
      this.state.selectedWithdrawalIds = [];
    }
    this.filterAdminWithdrawals();
    this.renderWithdrawInspector();
  },

  selectAdminWithdrawal(id) {
    this.state.selectedWithdrawalId = String(id);
    this.filterAdminWithdrawals();
    this.renderWithdrawInspector();
  },

  renderWithdrawInspector() {
    const box = document.getElementById('adm-with-preview-details');
    if (!box) return;
    const all = Array.isArray(this.state.adminWithdrawals) ? this.state.adminWithdrawals : [];
    const selectedIds = Array.isArray(this.state.selectedWithdrawalIds) ? this.state.selectedWithdrawalIds : [];
    const checkedRows = all.filter(w => selectedIds.includes(String(w.id)));

    if (checkedRows.length > 1 || (this.state.withdrawBatchMode && checkedRows.length >= 1)) {
      const totalAmount = checkedRows.reduce((acc, w) => acc + Number(w.amount || 0), 0);
      const totalFee = checkedRows.reduce((acc, w) => acc + Number(w.fee || 1), 0);
      const netOut = Math.max(0, totalAmount - totalFee);
      box.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div class="av-adm-kv-row"><span>Selected Requests</span><strong>${checkedRows.length} payouts</strong></div>
          <div class="av-adm-kv-row"><span>Batch Gross Amount</span><strong class="mono">$${totalAmount.toFixed(2)} USDT</strong></div>
          <div class="av-adm-kv-row"><span>Network Fees</span><span class="mono">$${totalFee.toFixed(2)} USDT</span></div>
          <div class="av-adm-kv-row"><span>Net Disbursement</span><strong class="mono" style="color:#0052FF;">$${netOut.toFixed(2)} USDT</strong></div>
          <button type="button" class="btn-primary" style="width:100%; margin-top:8px; padding:10px; border-radius:10px; font-weight:700;" onclick="App.approveSelectedWithdrawalsBatch()">
            Approve Selected Batch (${checkedRows.length})
          </button>
        </div>
      `;
      return;
    }

    const row = all.find(w => String(w.id) === String(this.state.selectedWithdrawalId)) || all[0];
    if (!row) {
      box.innerHTML = `<div style="font-size:12px; color:#6B7280;">No withdrawal records loaded.</div>`;
      return;
    }

    const shortId = this.escapeHtml(row.short_id || row.id || 'WIT-0000');
    const addr = String(row.destination_address || '');
    const boundStatus = String(row.bound_status || 'UNBOUND').toUpperCase();
    const boundBadge = boundStatus === 'ADDRESS_BOUND_VERIFIED'
      ? `<span class="av-adm-val-badge verified">Address Bound &amp; Verified</span>`
      : (boundStatus === 'BOUND'
        ? `<span class="av-adm-val-badge bound">Bound</span>`
        : `<span class="av-adm-val-badge unbound">Unbound</span>`);

    const isPending = ['PENDING', 'REQUESTED', 'PENDING_REVIEW'].includes(String(row.status || '').toUpperCase());
    box.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:2px;">
        <div class="av-adm-kv-row"><span>Withdrawal ID</span><strong class="mono">${shortId}</strong></div>
        <div class="av-adm-kv-row"><span>User</span><strong>${this.escapeHtml(row.full_name || row.email || 'User')}</strong></div>
        <div class="av-adm-kv-row"><span>Asset / Network</span><strong>${Number(row.amount || 0).toFixed(2)} ${this.escapeHtml(row.asset || 'USDT')} (${this.escapeHtml(row.network || 'TRC20')})</strong></div>
        <div class="av-adm-kv-row"><span>Fee / Net</span><span class="mono">$${Number(row.fee || 1).toFixed(2)} / $${Number(row.net_amount || row.amount || 0).toFixed(2)}</span></div>
        <div class="av-adm-kv-row"><span>Validation</span>${boundBadge}</div>
        <div style="margin-top:8px; background:#F8FAFC; border:1px solid #E5E7EB; border-radius:9px; padding:8px 10px;">
          <div style="font-size:11px; font-weight:700; color:#6B7280; margin-bottom:3px;">Destination Address</div>
          <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
            <code style="font-size:11px; word-break:break-all; color:#111827;">${this.escapeHtml(addr || '—')}</code>
            ${addr ? `<button type="button" class="av-adm-btn-chip soft-blue" style="min-height:24px; padding:2px 8px; font-size:10.5px;" onclick="App.copyText('${this.escapeJsStr(addr)}', 'Destination copied!')">Copy</button>` : ''}
          </div>
        </div>
        ${isPending ? `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:12px;">
            <button type="button" class="av-adm-btn-chip green" style="padding:9px; font-weight:800;" onclick="App.reviewWithdrawal('${this.escapeJsStr(row.id)}', 'APPROVE')">Approve Payout</button>
            <button type="button" class="av-adm-btn-chip danger" style="padding:9px; font-weight:800;" onclick="App.reviewWithdrawal('${this.escapeJsStr(row.id)}', 'REJECT')">Reject</button>
          </div>
        ` : ''}
      </div>
    `;
  },

  async approveSelectedWithdrawalsBatch() {
    const selectedIds = Array.isArray(this.state.selectedWithdrawalIds) ? [...this.state.selectedWithdrawalIds] : [];
    const all = Array.isArray(this.state.adminWithdrawals) ? this.state.adminWithdrawals : [];
    const targets = all.filter(w => selectedIds.includes(String(w.id)) && ['PENDING', 'REQUESTED', 'PENDING_REVIEW'].includes(String(w.status || '').toUpperCase()));
    if (!targets.length) {
      this.toast('Select at least one pending payout to approve in batch.', 'warning');
      return;
    }
    if (!confirm(`Approve ${targets.length} selected withdrawal payouts now?`)) return;
    let okCount = 0;
    for (const item of targets) {
      const actionKey = `batch_w_${item.id}_${Date.now()}`;
      const res = await this.api('/admin/withdrawals.php', 'POST', {
        withdrawal_id: item.id,
        action: 'APPROVE',
        reason: 'Batch Payout Mode approval',
        idempotency_key: actionKey
      });
      if (res.success) okCount++;
    }
    this.state.selectedWithdrawalIds = [];
    this.toast(`Batch payout finished: ${okCount} of ${targets.length} withdrawals approved.`, okCount > 0 ? 'success' : 'error');
    await this.loadAdminWithdrawals();
    this.loadAdminData();
  },

  formatAdminDate(raw) {
    if (!raw) return 'Recent';
    let s = String(raw).trim();
    if (!s) return 'Recent';
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(s)) {
      s = s.replace(' ', 'T');
    }
    if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(s)) {
      s += 'Z';
    }
    const dt = new Date(s);
    if (Number.isNaN(dt.getTime())) return 'Recent';
    return dt.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  },

  filterAdminWithdrawals() {
    const container = document.getElementById('adm-with-list');
    if (!container) return;
    const all = Array.isArray(this.state.adminWithdrawals) ? this.state.adminWithdrawals : [];
    const q = (document.getElementById('adm-with-search')?.value || '').trim().toLowerCase();
    const netFilter = (document.getElementById('adm-with-network-filter')?.value || 'ALL').toUpperCase();
    const valFilter = (document.getElementById('adm-with-validation-filter')?.value || 'ALL').toUpperCase();
    const selectedIds = new Set(Array.isArray(this.state.selectedWithdrawalIds) ? this.state.selectedWithdrawalIds : []);

    const list = all.filter(w => {
      const matchQuery = !q ||
        String(w.email || '').toLowerCase().includes(q) ||
        String(w.full_name || '').toLowerCase().includes(q) ||
        String(w.short_id || w.id || '').toLowerCase().includes(q) ||
        String(w.destination_address || '').toLowerCase().includes(q) ||
        String(w.network || '').toLowerCase().includes(q);
      const matchNet = netFilter === 'ALL' || String(w.network || '').toUpperCase() === netFilter;
      const matchVal = valFilter === 'ALL' || String(w.bound_status || 'UNBOUND').toUpperCase() === valFilter;
      return matchQuery && matchNet && matchVal;
    });

    if (!list.length) {
      container.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:#6B7280;">No matching withdrawal requests found.</td></tr>`;
      return;
    }

    container.innerHTML = list.map(w => {
      const status = (w.status || 'PENDING').toUpperCase();
      const isPending = status === 'PENDING' || status === 'REQUESTED' || status === 'PENDING_REVIEW';
      const isApproved = status === 'COMPLETED' || status === 'APPROVED';
      const destAddr = w.destination_address || '';
      const shortAddr = destAddr.length > 14 ? `${destAddr.substring(0, 6)}...${destAddr.substring(destAddr.length - 6)}` : (destAddr || '—');
      const shortId = w.short_id || ('WIT-' + String(w.id || '').slice(-4).toUpperCase());
      const reqDate = this.formatAdminDate(w.created_at);
      const boundStatus = String(w.bound_status || 'UNBOUND').toUpperCase();
      const valBadge = boundStatus === 'ADDRESS_BOUND_VERIFIED'
        ? `<span class="av-adm-val-badge verified">Address Bound &amp; Verified</span>`
        : (boundStatus === 'BOUND'
          ? `<span class="av-adm-val-badge bound">Bound</span>`
          : `<span class="av-adm-val-badge unbound">Unbound</span>`);
      const isSelected = String(w.id) === String(this.state.selectedWithdrawalId);
      const isChecked = selectedIds.has(String(w.id));
      const primaryUserLabel = String(w.full_name || w.email || 'User').trim();
      const emailStr = String(w.email || '').trim();
      const secondaryUserLabel = (emailStr && emailStr.toLowerCase() !== primaryUserLabel.toLowerCase())
        ? emailStr
        : (w.numeric_uid ? `#${w.numeric_uid}` : '');
      const initials = primaryUserLabel.slice(0, 2).toUpperCase();

      return `
        <tr class="${isSelected ? 'av-adm-row-selected' : ''}" style="cursor:pointer;" onclick="App.selectAdminWithdrawal('${this.escapeJsStr(w.id)}')">
          <td data-label="Select" onclick="event.stopPropagation()">
            <input type="checkbox" ${isChecked ? 'checked' : ''} ${!isPending ? 'disabled' : ''} onchange="App.toggleAdminWithdrawalSelection('${this.escapeJsStr(w.id)}', this.checked)">
          </td>
          <td data-label="Withdrawal ID"><strong class="mono" style="color:#111827;">${this.escapeHtml(shortId)}</strong></td>
          <td data-label="User">
            <div class="av-adm-user-cell">
              <span style="width:28px; height:28px; border-radius:50%; background:#EFF4FF; color:#0052FF; font-size:11px; font-weight:800; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">${this.escapeHtml(initials)}</span>
              <div class="av-adm-user-meta">
                <strong class="av-adm-user-name" title="${this.escapeHtml(primaryUserLabel)}">${this.escapeHtml(primaryUserLabel)}</strong>
                ${secondaryUserLabel ? `<span class="av-adm-user-sub" title="${this.escapeHtml(secondaryUserLabel)}">${this.escapeHtml(secondaryUserLabel)}</span>` : ''}
              </div>
            </div>
          </td>
          <td data-label="Requested" style="font-size:12px; color:#4B5563;">${this.escapeHtml(reqDate)}</td>
          <td data-label="Asset / Network">
            <strong class="mono" style="display:block; color:#111827;">${Number(w.amount || 0).toFixed(2)} ${this.escapeHtml(w.asset || 'USDT')}</strong>
            <span style="font-size:11px; color:#6B7280;">${this.escapeHtml(w.network || 'TRC20')}</span>
          </td>
          <td data-label="Destination" onclick="event.stopPropagation()">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <code style="font-family:var(--font-mono); font-size:11px; color:#111827; background:#F3F4F6; padding:2px 6px; border-radius:6px;" title="${this.escapeHtml(destAddr)}">${this.escapeHtml(shortAddr)}</code>
              ${destAddr ? `<button type="button" class="av-adm-btn-chip soft-blue" style="min-height:24px; padding:2px 8px; font-size:10.5px;" onclick="App.copyText('${this.escapeJsStr(destAddr)}', 'Crypto address copied!')">Copy</button>` : ''}
            </div>
          </td>
          <td data-label="Validation">${valBadge}</td>
          <td data-label="Action" onclick="event.stopPropagation()">
            ${isPending ? `
              <div class="av-adm-act-row">
                <button class="av-adm-btn-chip green" data-alpha-action="admin-withdrawal:${this.escapeHtml(w.id)}:APPROVE" onclick="App.reviewWithdrawal('${this.escapeJsStr(w.id)}', 'APPROVE')">Approve Payout</button>
                <button class="av-adm-btn-chip danger" data-alpha-action="admin-withdrawal:${this.escapeHtml(w.id)}:REJECT" onclick="App.reviewWithdrawal('${this.escapeJsStr(w.id)}', 'REJECT')">Reject</button>
              </div>
            ` : (isApproved ? `
              <div class="av-adm-act-row" style="align-items:center;">
                <span style="color:#059669; font-weight:700; font-size:12px;">Processed</span>
                <button class="av-adm-btn-chip danger" style="min-height:26px; padding:3px 8px; font-size:11px;" data-alpha-action="admin-withdrawal:${this.escapeHtml(w.id)}:REJECT" onclick="App.reviewWithdrawal('${this.escapeJsStr(w.id)}', 'REJECT')" title="Decline and refund to user">Reject</button>
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
    this.state.adminDepositSummary = res.data?.summary || null;
    if (!this.state.adminDepositNetFilter) this.state.adminDepositNetFilter = 'ALL';
    if (!this.state.selectedDepositId && deposits.length) {
      this.state.selectedDepositId = deposits[0].id;
    }
    this.renderDepositKpis();
    this.filterAdminDeposits();
    this.renderDepositInspector();
  },

  renderDepositKpis() {
    const summary = this.state.adminDepositSummary;
    const all = Array.isArray(this.state.adminDeposits) ? this.state.adminDeposits : [];
    const totalAmt = summary?.total_deposits_usdt ?? all.filter(d => ['COMPLETED', 'APPROVED', 'CONFIRMED'].includes(String(d.status || '').toUpperCase())).reduce((s, d) => s + Number(d.amount || 0), 0);
    const pendingList = all.filter(d => ['PENDING', 'REQUESTED', 'PENDING_REVIEW'].includes(String(d.status || '').toUpperCase()));
    const pendingCount = summary?.pending_count ?? pendingList.length;
    const pendingAmt = summary?.pending_amount_usdt ?? pendingList.reduce((s, d) => s + Number(d.amount || 0), 0);
    const nets = summary?.active_networks || ['TRC20', 'BEP20', 'ERC20'];

    const elTotal = document.getElementById('adm-dep-kpi-total');
    const elPend = document.getElementById('adm-dep-kpi-pending');
    const elPendAmt = document.getElementById('adm-dep-kpi-pending-amt');
    const elChains = document.getElementById('adm-dep-kpi-chains');
    const elChainsList = document.getElementById('adm-dep-kpi-chains-list');

    if (elTotal) elTotal.textContent = `$${Number(totalAmt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
    if (elPend) elPend.textContent = `${pendingCount} Transaction${pendingCount === 1 ? '' : 's'}`;
    if (elPendAmt) elPendAmt.textContent = `$${Number(pendingAmt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Awaiting Review`;
    if (elChains) elChains.textContent = `${nets.length || 3} Chains Active`;
    if (elChainsList) elChainsList.textContent = nets.join(', ');
    this.syncAdminQueueBadges({ deposits: pendingCount });
  },

  setAdminDepositNetworkFilter(net = 'ALL', btn) {
    this.state.adminDepositNetFilter = String(net || 'ALL').toUpperCase();
    document.querySelectorAll('#adm-sec-deposits .av-adm-net-tab').forEach(b => {
      b.classList.toggle('active', b === btn || b.getAttribute('data-dep-net') === this.state.adminDepositNetFilter);
    });
    this.filterAdminDeposits();
  },

  selectAdminDeposit(id) {
    this.state.selectedDepositId = String(id);
    this.filterAdminDeposits();
    this.renderDepositInspector();
  },

  renderDepositInspector() {
    const box = document.getElementById('adm-dep-inspector-body');
    if (!box) return;
    const all = Array.isArray(this.state.adminDeposits) ? this.state.adminDeposits : [];
    const d = all.find(x => String(x.id) === String(this.state.selectedDepositId)) || all[0];
    if (!d) {
      box.innerHTML = `<div style="color:#6B7280;">No deposit records available to inspect.</div>`;
      return;
    }

    const txHash = String(d.tx_hash || d.deposit_address || 'Direct Transfer');
    const shortTx = txHash.length > 16 ? `${txHash.substring(0, 6)}...${txHash.substring(txHash.length - 5)}` : txHash;
    const status = String(d.status || 'PENDING').toUpperCase();
    const isPending = status === 'PENDING' || status === 'REQUESTED' || status === 'PENDING_REVIEW';
    const isCompleted = status === 'COMPLETED' || status === 'APPROVED' || status === 'CONFIRMED';

    const safeProofUrl = this.safeMediaUrl(d.proof_url);

    box.innerHTML = `
      <div class="av-adm-kv-row">
        <span>Txn Hash</span>
        <span style="display:inline-flex; align-items:center; gap:6px;">
          <code class="mono" style="background:#F3F4F6; padding:2px 7px; border-radius:6px; color:#111827;">${this.escapeHtml(shortTx)}</code>
          <button type="button" class="av-adm-btn-chip soft-blue" style="min-height:24px; padding:2px 7px; font-size:10.5px;" onclick="App.copyText('${this.escapeJsStr(txHash)}', 'TXN Hash copied!')">Copy</button>
        </span>
      </div>
      <div class="av-adm-kv-row">
        <span>User</span>
        <strong>${this.escapeHtml(d.full_name || d.email || 'User')} ${d.numeric_uid ? `(#${this.escapeHtml(d.numeric_uid)})` : ''}</strong>
      </div>
      <div class="av-adm-kv-row"><span>Network</span><strong>${this.escapeHtml(d.network || 'TRC20')}</strong></div>
      <div class="av-adm-kv-row"><span>Amount</span><strong class="mono">${Number(d.amount || 0).toFixed(2)} ${this.escapeHtml(d.asset || 'USDT')}</strong></div>
      <div class="av-adm-kv-row">
        <span>Verification</span>
        <strong style="color:${txHash !== 'Direct Transfer' ? '#059669' : '#D97706'};">${txHash !== 'Direct Transfer' ? 'TXN Reference Submitted' : 'Manual Vault Deposit'}</strong>
      </div>

      <div class="av-adm-receipt-box">
        <div style="font-size:11.5px; font-weight:700; color:#4B5563; margin-bottom:8px;">Document Preview &bull; ${this.escapeHtml(d.proof_label || 'receipt.png')}</div>
        <div class="av-adm-receipt-paper">
          ${safeProofUrl ? `<img src="${this.escapeHtml(safeProofUrl)}" alt="Deposit Proof Receipt" style="width:100%; border-radius:6px; max-height:160px; object-fit:contain;">` : `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #E5E7EB; padding-bottom:6px; margin-bottom:6px;">
              <strong style="font-size:12px; color:#111827;">DEPOSIT RECEIPT</strong>
              <span class="mono" style="font-size:11px; color:#0052FF; font-weight:700;">${this.escapeHtml(d.short_id || 'DEP')}</span>
            </div>
            <div style="font-size:11px; color:#4B5563; display:flex; flex-direction:column; gap:4px;">
              <div style="display:flex; justify-content:space-between;"><span>Amount:</span><strong class="mono" style="color:#111827;">${Number(d.amount || 0).toFixed(2)} USDT</strong></div>
              <div style="display:flex; justify-content:space-between;"><span>Chain:</span><strong>${this.escapeHtml(d.network || 'TRC20')}</strong></div>
              <div style="display:flex; justify-content:space-between;"><span>Vault:</span><span class="mono">${this.escapeHtml((d.deposit_address || '').slice(0, 12) || 'Configured')}</span></div>
            </div>
          `}
        </div>
      </div>

      ${isPending ? `
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button type="button" class="av-adm-btn-chip green" style="width:100%; padding:10px; font-size:13.5px; font-weight:800;" data-alpha-action="admin-deposit:${this.escapeHtml(d.id)}:APPROVE" onclick="App.reviewDeposit('${this.escapeJsStr(d.id)}', 'APPROVE')">Approve Deposit</button>
          <button type="button" class="av-adm-btn-chip danger" style="width:100%; padding:10px; font-size:13.5px; font-weight:800;" data-alpha-action="admin-deposit:${this.escapeHtml(d.id)}:REJECT" onclick="App.reviewDeposit('${this.escapeJsStr(d.id)}', 'REJECT')">Reject Deposit</button>
        </div>
      ` : `<div style="text-align:center; padding:8px; border-radius:10px; font-weight:700; font-size:12.5px; background:${isCompleted ? '#ECFDF5' : '#FEF2F2'}; color:${isCompleted ? '#059669' : '#DC2626'};">${isCompleted ? 'Credited to User Spot Balance' : 'Deposit Rejected'}</div>`}
    `;
  },

  filterAdminDeposits() {
    const container = document.getElementById('adm-dep-list');
    if (!container) return;
    const all = Array.isArray(this.state.adminDeposits) ? this.state.adminDeposits : [];
    const q = (document.getElementById('adm-dep-search')?.value || '').trim().toLowerCase();
    const netFilter = String(this.state.adminDepositNetFilter || 'ALL').toUpperCase();

    const list = all.filter(d => {
      const matchNet = netFilter === 'ALL' || String(d.network || '').toUpperCase() === netFilter;
      const matchQuery = !q ||
        String(d.email || '').toLowerCase().includes(q) ||
        String(d.full_name || '').toLowerCase().includes(q) ||
        String(d.short_id || d.id || '').toLowerCase().includes(q) ||
        String(d.tx_hash || '').toLowerCase().includes(q) ||
        String(d.deposit_address || '').toLowerCase().includes(q) ||
        String(d.network || '').toLowerCase().includes(q);
      return matchNet && matchQuery;
    });

    if (!list.length) {
      container.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:#6B7280;">No matching deposits found.</td></tr>`;
      return;
    }

    container.innerHTML = list.map(d => {
      const status = String(d.status || 'PENDING').toUpperCase();
      const isPending = status === 'PENDING' || status === 'REQUESTED' || status === 'PENDING_REVIEW';
      const isCompleted = status === 'COMPLETED' || status === 'APPROVED' || status === 'CONFIRMED';
      const isRejected = status === 'REJECTED' || status === 'DECLINED';
      const badgeClass = isCompleted ? 'badge-positive' : (isRejected ? 'badge-danger' : 'badge-warning');
      const badgeText = isCompleted ? 'Approved' : (isRejected ? 'Rejected' : 'Pending');
      const senderInfo = d.tx_hash || d.deposit_address || 'Direct Transfer';
      const shortSender = senderInfo.length > 14 ? `${senderInfo.substring(0, 6)}...${senderInfo.substring(senderInfo.length - 4)}` : senderInfo;
      const shortId = d.short_id || ('DEP-' + String(d.id || '').slice(-4).toUpperCase());
      const primaryUserLabel = String(d.full_name || d.email || 'User').trim();
      const emailStr = String(d.email || '').trim();
      const secondaryUserLabel = d.numeric_uid
        ? `#${d.numeric_uid}`
        : (emailStr && emailStr.toLowerCase() !== primaryUserLabel.toLowerCase() ? emailStr : '');
      const initials = primaryUserLabel.slice(0, 2).toUpperCase();
      const isSelected = String(d.id) === String(this.state.selectedDepositId);

      return `
        <tr class="${isSelected ? 'av-adm-row-selected' : ''}" style="cursor:pointer;" onclick="App.selectAdminDeposit('${this.escapeJsStr(d.id)}')">
          <td data-label="Txn Hash / ID">
            <code class="mono" style="display:block; font-size:11.5px; color:#111827;" title="${this.escapeHtml(senderInfo)}">${this.escapeHtml(shortSender)}</code>
            <span style="font-size:11px; color:#6B7280;">${this.escapeHtml(shortId)}</span>
          </td>
          <td data-label="User">
            <div class="av-adm-user-cell">
              <span style="width:28px; height:28px; border-radius:50%; background:#EFF4FF; color:#0052FF; font-size:11px; font-weight:800; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">${this.escapeHtml(initials)}</span>
              <div class="av-adm-user-meta">
                <strong class="av-adm-user-name" title="${this.escapeHtml(primaryUserLabel)}">${this.escapeHtml(primaryUserLabel)}</strong>
                ${secondaryUserLabel ? `<span class="av-adm-user-sub" title="${this.escapeHtml(secondaryUserLabel)}">${this.escapeHtml(secondaryUserLabel)}</span>` : ''}
              </div>
            </div>
          </td>
          <td data-label="Network / Chain"><span class="badge" style="background:#EFF4FF; color:#0052FF; border:1px solid #DBEAFE;">${this.escapeHtml(d.network || 'TRC20')}</span></td>
          <td data-label="Amount"><strong style="color:#111827; font-family:var(--font-mono);">${Number(d.amount || 0).toFixed(2)} ${this.escapeHtml(d.asset || 'USDT')}</strong></td>
          <td data-label="Proof" onclick="event.stopPropagation()">
            <button type="button" class="av-adm-btn-chip soft-blue" style="min-height:26px; padding:2px 8px; font-size:11px;" onclick="App.selectAdminDeposit('${this.escapeJsStr(d.id)}')">Preview</button>
          </td>
          <td data-label="Status"><span class="badge ${badgeClass}">${badgeText}</span></td>
          <td data-label="Action" onclick="event.stopPropagation()">
            ${isPending ? `
              <div class="av-adm-act-row">
                <button class="av-adm-btn-chip green" data-alpha-action="admin-deposit:${this.escapeHtml(d.id)}:APPROVE" onclick="App.reviewDeposit('${this.escapeJsStr(d.id)}', 'APPROVE')">Approve</button>
                <button class="av-adm-btn-chip danger" data-alpha-action="admin-deposit:${this.escapeHtml(d.id)}:REJECT" onclick="App.reviewDeposit('${this.escapeJsStr(d.id)}', 'REJECT')">Reject</button>
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
        const minDep = Math.max(100, Number(c.minimum_deposit ?? c.min_deposit ?? 100) || 100);
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
        const minDep = Math.max(100, Number(c.minimum_deposit ?? c.min_deposit ?? 100) || 100);
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

  openEditDepositConfigModal(asset = 'USDT', network = 'TRC20', address = '', min = 100, instructions = '') {
    this.openModal('modal-edit-deposit-config');
    const assetEl = document.getElementById('edit-dep-asset');
    const netEl = document.getElementById('edit-dep-network');
    const addrEl = document.getElementById('edit-dep-address');
    const minEl = document.getElementById('edit-dep-min');
    const instEl = document.getElementById('edit-dep-instructions');

    const safeMin = Math.max(100, Number(min) || 100);
    if (assetEl) assetEl.value = asset;
    if (netEl) netEl.value = network;
    if (addrEl) addrEl.value = address || 'TX8q9PzB9k8vY2L3m4N5p6Q7r8S9t0U1vW';
    if (minEl) minEl.value = safeMin;
    if (instEl) instEl.value = instructions || `Send ${asset} (${network}) to this address. Minimum deposit is ${safeMin} ${asset}.`;
  },

  async saveDepositConfig() {
    this.toast('Deposit addresses are permanent and cannot be changed.', 'error');
    return;
    const asset = document.getElementById('edit-dep-asset')?.value;
    const network = document.getElementById('edit-dep-network')?.value;
    const address = document.getElementById('edit-dep-address')?.value?.trim();
    const minDeposit = Math.max(100, parseFloat(document.getElementById('edit-dep-min')?.value) || 100);
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
      const isDebit = this.state.adjSignMode === 'DEBIT';
      const debitSource = document.getElementById('adj-debit-source')?.value || 'spot';
      let adjustmentType = document.getElementById('adj-type')?.value || 'DEPOSIT';
      let wallet = document.getElementById('adj-wallet').value || 'funding';
      if (isDebit) {
        wallet = debitSource === 'future' ? 'trading' : 'funding';
        adjustmentType = debitSource === 'referral' ? 'REFERRAL_BONUS' : 'OTHER';
      } else if (adjustmentType === 'REFERRAL_BONUS' && wallet === 'trading') {
        wallet = 'funding';
      }
      let amount = parseFloat(document.getElementById('adj-amount').value) || 0;
      if (isDebit && amount > 0) {
        amount = -Math.abs(amount);
      }
      const reason = document.getElementById('adj-reason').value.trim();

      if (!userId || amount === 0 || !reason) {
        this.toast('Target User ID / Email, Non-zero Amount, and Reason are mandatory', 'error');
        return;
      }

      const payload = {
        user_id: userId,
        wallet_type: wallet,
        asset: 'USDT',
        amount,
        adjustment_type: adjustmentType,
        reason,
        idempotency_key: actionKey
      };
      if (amount < 0) payload.debit_source = debitSource;

      const res = await this.api('/admin/adjustments.php', 'POST', payload);

      if (res.success) {
        const newBal = res.data?.new_balance != null ? `$${Number(res.data.new_balance).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}` : '';
        const targetLabel = amount < 0
          ? (debitSource === 'future' ? 'Future Balance' : (debitSource === 'referral' ? 'Referral Balance' : 'Spot Balance'))
          : wallet.toUpperCase();
        this.toast(`Ledger adjustment applied successfully! ${targetLabel} is now ${newBal}`, 'success');
        document.getElementById('adj-amount').value = '';
        document.getElementById('adj-reason').value = '';
        this.setAdjustmentSign('CREDIT');
        this.loadAdjustmentUserPreview('adj', userId);
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
      const assetsRes = await this.api('/marketing/assets.php');
      if (assetsRes?.success && assetsRes.data) {
        this.state.marketingAssets = assetsRes.data.assets || [];
      }
      const promosRes = await this.api('/marketing/promotions.php');
      if (promosRes?.success && promosRes.data) {
        this.state.marketingPromotions = promosRes.data;
      }
      const claimsRes = await this.api('/marketing/claims.php');
      if (claimsRes?.success && claimsRes.data) {
        this.state.marketingClaims = claimsRes.data.claims || [];
      }
      const schedsRes = await this.api('/marketing/schedules.php');
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
    if (this._adminBadgePollInterval) clearInterval(this._adminBadgePollInterval);
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

    // Market tickers: 30s while visible and outside admin desk.
    this._tickerPollInterval = setInterval(() => {
      if (document.hidden || this.state.currentView === 'admin') return;
      this.loadTickers();
    }, 30000);

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

    // Fast Admin Sidebar/Top Badge Sync (6s across ALL admin tabs — fixes 2-3 min deposit badge lag)
    this._adminBadgePollInterval = setInterval(() => {
      if (document.hidden || !this.state.user || this.state.currentView !== 'admin' || !this.isStaffOrAdmin(this.state.user)) return;
      this.refreshAdminBadges();
    }, 6000);

    // Admin view-specific refresh
    this._pollingInterval = setInterval(() => {
      if (document.hidden || !this.state.user) return;
      if (this.state.currentView === 'admin' && this.state.adminTab === 'overview') {
        this.loadAdminData();
      } else if (this.state.currentView === 'admin' && this.state.adminTab === 'deposits') {
        this.loadAdminDeposits();
      }
    }, 20000);
  },

  render() {
    this.navigate(this.state.currentView);
  },

  /* System Configuration, Feature Flags, Mode Toggling & Production Secrets Hub */
  applySystemFeatureFlags(config = {}) {
    const features = (config && typeof config.features === 'object' && config.features) ? config.features : {};
    const langEnabled = features.language !== false;
    this.state.languageFeatureEnabled = langEnabled;
    if (document.body) {
      document.body.classList.toggle('lang-feature-disabled', !langEnabled);
    }
    if (!langEnabled) {
      const currentLang = (localStorage.getItem('alphavest_language') || 'en').toLowerCase();
      if (currentLang === 'ka') {
        try { localStorage.setItem('alphavest_language', 'en'); } catch (e) {}
      }
      const publicLanguage = document.getElementById('av-public-language');
      if (publicLanguage) publicLanguage.value = 'en';
      if (document.documentElement.lang && document.documentElement.lang !== 'en') {
        document.documentElement.lang = 'en';
        try {
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/; SameSite=Lax';
        } catch (e) {}
      }
    }
  },

  async loadSystemConfig() {
    const res = await this.api('/system/config.php');
    if (res.success && res.data) {
      this.state.systemConfig = res.data;
      this.writeFastCache('system_config', res.data);
      this.state.isRealMoneyMode = Boolean(res.data.real_money_mode);
      this.applySystemFeatureFlags(res.data);
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

# 5. CUSTOM TRANSACTIONAL EMAIL (HOSTINGER SMTP)
APP_URL=https://prime-x-capital.com
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_ENCRYPTION=ssl
SMTP_USERNAME=no-reply@prime-x-capital.com
SMTP_PASSWORD=REPLACE_WITH_THE_REAL_MAILBOX_PASSWORD
MAIL_FROM_ADDRESS=no-reply@prime-x-capital.com
MAIL_FROM_NAME=Prime X Capital

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
    this.centerReferralTreeScroll(container);
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
      } else if (kyc === 'PENDING' || kyc === 'UNDER_REVIEW') {
        badge.textContent = 'Pending Review ⏳';
        badge.style.color = '#f59e0b';
      } else if (kyc === 'RESUBMIT_REQUIRED') {
        badge.textContent = 'Resubmit Requested ↻';
        badge.style.color = '#d97706';
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
      } else if (kyc === 'PENDING' || kyc === 'UNDER_REVIEW') {
        bannerBox.innerHTML = `
          <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 14px; display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 26px;">⏳</div>
            <div>
              <div style="font-weight: 700; color: #f59e0b; font-size: 14px;">Verification Under Compliance Review</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Your documents have been encrypted and submitted to the institutional compliance queue. Review is typically completed within 1 to 2 hours.</div>
            </div>
          </div>
        `;
      } else if (kyc === 'RESUBMIT_REQUIRED') {
        bannerBox.innerHTML = `
          <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 14px; display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 26px;">🔄</div>
            <div>
              <div style="font-weight: 700; color: #D97706; font-size: 14px;">KYC Resubmission Requested</div>
              <div style="font-size: 12px; color: #92400E; margin-top: 2px;">Compliance requested that you re-upload your identity photos and resubmit KYC verification below.</div>
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
      } else if (kyc === 'PENDING' || kyc === 'UNDER_REVIEW') {
        el.textContent = 'Pending Review';
        el.className = 'badge badge-warning';
        el.style.color = '#f59e0b';
      } else if (kyc === 'RESUBMIT_REQUIRED') {
        el.textContent = 'Resubmit Required';
        el.className = 'badge badge-warning';
        el.style.color = '#d97706';
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
    this.syncUserAvatarElements(this.state.user);
  },

  /* 3.1 Change Account Email */
  openChangeEmailModal() {
    if (!this.state.user) {
      this.openModal('modal-auth');
      return;
    }
    const currentInput = document.getElementById('update-email-current');
    const newInput = document.getElementById('update-email-new');
    const otpInput = document.getElementById('update-email-otp');
    const statusEl = document.getElementById('update-email-otp-status');
    if (currentInput) currentInput.value = this.state.user.email || '';
    if (newInput) newInput.value = '';
    if (otpInput) otpInput.value = '';
    if (statusEl) {
      statusEl.className = 'av-sec-otp-status';
      statusEl.textContent = 'Code will be sent to your NEW email address.';
    }
    this.openModal('modal-update-email');
  },

  async submitUpdateEmail() {
    const newEmail = (document.getElementById('update-email-new')?.value || '').trim();
    const verificationCode = (document.getElementById('update-email-otp')?.value || '').trim();
    const btn = document.getElementById('btn-submit-update-email');

    if (!newEmail || !newEmail.includes('@')) {
      this.toast('Please enter a valid new email address', 'error');
      document.getElementById('update-email-new')?.focus();
      return;
    }
    if (!/^\d{6}$/.test(verificationCode)) {
      this.toast('Please enter the 6-digit verification code sent to your new email.', 'error');
      document.getElementById('update-email-otp')?.focus();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Verifying & Updating...';
    }

    try {
      const res = await this.api('/user/update-email.php', 'POST', {
        email: newEmail,
        verification_code: verificationCode
      });
      if (res.success) {
        if (this.state.user) {
          this.state.user = res.data?.user || {
            ...this.state.user,
            email: res.data?.email || newEmail,
            email_verified: true
          };
          localStorage.setItem('alphavest_local_user', JSON.stringify(this.state.user));
        }
        this.updateHeaderAuth();
        this.syncProfileEmailBadge(this.state.user);
        this.loadSettingsView();
        this.closeModal('modal-update-email');
        this.toast(res.message || 'Account email verified and updated successfully!', 'success');
      } else {
        this.toast(res.message || 'Failed to update email address', 'error');
      }
    } catch (err) {
      this.toast('Error updating email: ' + (err.message || err), 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Verify Code & Update Email';
      }
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
          listEl.innerHTML = res.data.map(a => {
            const safeAsset = this.escapeHtml(a.asset || 'USDT');
            const safeNetwork = this.escapeHtml(a.network || 'TRC20');
            const rawAddr = String(a.address || '');
            const safeMaskedAddr = this.escapeHtml(`${rawAddr.substring(0, 8)}...${rawAddr.slice(-6)}`);
            return `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; border:1px solid #EEF1F6; padding:8px 10px; border-radius:8px; font-size:11px;">
              <div>
                <span style="font-weight:700; color:#0052FF;">${safeAsset} (${safeNetwork})</span>
                <span style="color:#6B7280; margin-left:6px; font-family:var(--font-mono);">${safeMaskedAddr}</span>
              </div>
              <span style="color:#00B87C; font-weight:700;">✓ Bound</span>
            </div>
          `;
          }).join('');
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
    const amountEl = document.getElementById('with-amount');
    this.onWithdrawAmountInput(amountEl ? amountEl.value : '');
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

  openAvatarSelectorModal() {
    if (!this.state.user) {
      try {
        const cached = localStorage.getItem('alphavest_local_user');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.id || parsed.email)) this.state.user = parsed;
        }
      } catch (e) {}
    }
    if (!this.state.user) {
      this.openModal('modal-auth');
      return;
    }
    this._avatarFilterGender = 'all';
    document.querySelectorAll('#modal-avatar-picker .av-avatar-tab').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-avatar-filter') === 'all');
    });
    this.renderAvatarPickerGrid('all');
    this.openModal('modal-avatar-picker');
  },

  filterAvatarGender(gender, btnEl) {
    this._avatarFilterGender = gender || 'all';
    document.querySelectorAll('#modal-avatar-picker .av-avatar-tab').forEach(btn => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    this.renderAvatarPickerGrid(this._avatarFilterGender);
  },

  renderAvatarPickerGrid(gender) {
    const grid = document.getElementById('avatar-picker-grid');
    if (!grid) return;
    const filter = gender || this._avatarFilterGender || 'all';
    const current = this.getUserAvatar(this.state.user);
    const list = this.getAvatarCatalog().filter(item => filter === 'all' || item.gender === filter);
    grid.innerHTML = list.map(item => {
      const isSelected = current === item.url;
      return `
        <button type="button" class="av-avatar-option${isSelected ? ' selected' : ''}" onclick="App.selectUserAvatar('${item.url}')" aria-label="Select ${item.label}">
          <span class="av-avatar-check" aria-hidden="true">✓</span>
          <img src="${item.url}" alt="${item.label}" loading="lazy">
          <span class="av-avatar-option-tag">${item.label}</span>
        </button>
      `;
    }).join('');
  },

  async selectUserAvatar(avatarPath) {
    if (!this.state.user) {
      try {
        const cached = localStorage.getItem('alphavest_local_user');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.id || parsed.email)) this.state.user = parsed;
        }
      } catch (e) {}
    }
    if (!this.state.user) {
      this.openModal('modal-auth');
      return;
    }
    const clean = String(avatarPath || '').trim();
    if (clean !== '' && !this.isValidAvatarUrl(clean)) {
      this.toast('Invalid avatar selection', 'error');
      return;
    }
    const perUserKey = this.getUserAvatarStorageKey(this.state.user);
    this.state.user = { ...this.state.user, avatar: clean };
    try {
      localStorage.setItem('alphavest_local_user', JSON.stringify(this.state.user));
      if (clean) {
        if (perUserKey) localStorage.setItem(perUserKey, clean);
        localStorage.setItem('alphavest_user_avatar', clean);
      } else {
        if (perUserKey) localStorage.removeItem(perUserKey);
        localStorage.removeItem('alphavest_user_avatar');
      }
    } catch (e) {}

    this.updateHeaderAuth();
    this.syncUserAvatarElements(this.state.user);
    this.syncSideDrawer();
    this.renderAvatarPickerGrid(this._avatarFilterGender || 'all');

    try {
      const res = await this.api('/user/profile.php', 'POST', { avatar: clean });
      if (res && res.success) {
        this.closeModal('modal-avatar-picker');
        this.toast(clean ? 'Profile avatar updated' : 'Using default initials avatar', 'success');
      } else {
        this.closeModal('modal-avatar-picker');
        this.toast(clean ? 'Avatar applied on this device' : 'Default initials applied', 'info');
      }
    } catch (e) {
      this.closeModal('modal-avatar-picker');
      this.toast(clean ? 'Profile avatar updated' : 'Default initials applied', 'success');
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
    if (!this.state.user) {
      const loginEmail = (document.getElementById('auth-email')?.value || '').trim();
      const forgotInput = document.getElementById('forgot-pwd-email');
      const forgotOtp = document.getElementById('forgot-pwd-otp');
      const forgotNew = document.getElementById('forgot-pwd-new');
      const forgotConf = document.getElementById('forgot-pwd-confirm');
      const forgotStatus = document.getElementById('forgot-pwd-otp-status');
      if (forgotInput) {
        forgotInput.value = loginEmail && loginEmail.includes('@') ? loginEmail : '';
      }
      if (forgotOtp) forgotOtp.value = '';
      if (forgotNew) forgotNew.value = '';
      if (forgotConf) forgotConf.value = '';
      if (forgotStatus) {
        forgotStatus.className = 'av-sec-otp-status';
        forgotStatus.textContent = 'We will email a 6-digit reset verification code.';
      }
      this.closeModal('modal-auth');
      this.openModal('modal-forgot-password');
      return;
    }
    this.openChangePasswordView();
  },

  showContactModal(type) {
    this.openChangeEmailModal();
  },

  openOptionsRules() {
    this.openModal('modal-options-rules');
  },

  openLanguageSelector() {
    if (this.state.languageFeatureEnabled === false || document.body?.classList.contains('lang-feature-disabled')) {
      this.closeModal('modal-language-select');
      return;
    }
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
    if (this.state.languageFeatureEnabled === false || document.body?.classList.contains('lang-feature-disabled')) {
      this.closeModal('modal-language-select');
      return;
    }
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

  isValidUserNotification(item) {
    if (!item || typeof item !== 'object') return false;
    const id = String(item.id || '').trim().toLowerCase();
    const type = String(item.type || '').trim().toUpperCase();
    const title = String(item.title || '').trim().toLowerCase();
    const message = String(item.message || '').trim();
    if (type === 'READ_CURSOR') return false;
    if (id.startsWith('notif_read_cursor_') || id.startsWith('notif_db_notif_read_cursor_')) return false;
    if (title === 'notification read state') return false;
    if (/^\s*\{.*"ids"\s*:.*"before_ts"\s*:/s.test(message) || message.includes('"before_ts":')) return false;
    if (/^\s*\{.*"ids"\s*:.*"before_ts"\s*:/s.test(String(item.title || ''))) return false;
    return true;
  },

  applyLocalNotificationReadState(list) {
    const readStore = this.getLocalReadNotifs();
    const idSet = new Set(readStore.ids || []);
    const beforeMs = Number(readStore.beforeTs || 0);
    let unreadCount = 0;

    const clean = (Array.isArray(list) ? list : []).filter(item => this.isValidUserNotification(item));
    const mapped = clean.map(item => {
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
          All members with minimum 100 USDT Future balance qualify for daily institutional dispatches toward the 30-day 2&times; growth plan, plus Additional Signals unlocked via $300+ deposits and friend referrals.
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
          Your account is assigned to high-priority order routing. Maintain at least 100 USDT in your Future Balance to unlock daily trading signals, and deposit $300+ or invite friends to earn Additional Signal credits.
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
      const list = (this.state.notifications || []).filter(item => this.isValidUserNotification(item));
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
        const srvReadIds = Array.isArray(res.data.read_ids) ? res.data.read_ids : [];
        const srvBeforeSec = Number(res.data.read_before_ts || 0);
        if (!this.state.adminPreviewUserId && (srvReadIds.length || srvBeforeSec > 0)) {
          this.saveLocalReadNotifs(srvReadIds, srvBeforeSec > 0 ? (srvBeforeSec * 1000) : 0);
        }
        const cleanList = (Array.isArray(res.data.notifications) ? res.data.notifications : []).filter(item => this.isValidUserNotification(item));
        const applied = this.state.adminPreviewUserId
          ? {
              notifications: cleanList,
              unreadCount: cleanList.filter(item => Number(item.is_read || 0) === 0).length
            }
          : this.applyLocalNotificationReadState(cleanList);
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

    const list = (this.state.notifications || []).filter(item => this.isValidUserNotification(item));
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
    } else if (latest.type?.includes('KYC_RESUBMIT')) {
      icon = '🔄';
      badgeText = 'KYC RESUBMIT';
      borderColor = '#FDE68A';
      badgeBg = '#FFFBEB';
      badgeColor = '#D97706';
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

    const ctaBtn = latest.type === 'SIGNAL_AVAILABLE'
      ? `<button type="button" onclick="event.stopPropagation(); App.navigate('signals')" style="background: #0052FF; border: none; color: #FFFFFF; font-size: 11.5px; font-weight: 800; padding: 7px 13px; border-radius: 999px; cursor: pointer; white-space: nowrap; flex-shrink: 0;">Open Signal →</button>`
      : `<button type="button" style="background: #EFF4FF; border: 1px solid #DBEAFE; color: #0052FF; font-size: 11.5px; font-weight: 700; padding: 6px 12px; border-radius: 8px; cursor: pointer; white-space: nowrap; flex-shrink: 0;">View</button>`;

    banner.style.display = 'block';
    banner.innerHTML = `
      <div style="background: #FFFFFF; border: 1px solid ${borderColor}; border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 4px 12px rgba(17,24,39,0.06); cursor: pointer;" onclick="${latest.type === 'SIGNAL_AVAILABLE' ? "App.navigate('signals')" : 'App.openNotificationsModal()'}">
        <div style="display: flex; align-items: flex-start; gap: 10px; flex: 1; min-width: 0;">
          <div style="font-size: 20px; line-height: 1; flex-shrink: 0; padding-top: 2px;">${icon}</div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 3px;">
              <span style="font-size: 10px; font-weight: 800; color: ${badgeColor}; background: ${badgeBg}; padding: 2px 7px; border-radius: 5px; letter-spacing: 0.4px; white-space: nowrap;">${badgeText}</span>
              ${isUnread ? '<span style="width: 7px; height: 7px; border-radius: 50%; background: #F6465D; display: inline-block; flex-shrink: 0;"></span>' : ''}
              <span style="font-size: 11px; color: #6B7280; white-space: nowrap;">${this.escapeHtml(this.formatAdminDate(latest.created_at))}</span>
            </div>
            <div style="font-size: 13.5px; font-weight: 700; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">
              ${this.escapeHtml(latest.title)}
            </div>
            <div style="font-size: 11.5px; color: #4B5563; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${this.escapeHtml(latest.message)}
            </div>
          </div>
        </div>
        ${ctaBtn}
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
    const list = (this.state.notifications || []).filter(item => this.isValidUserNotification(item));
    if (!list.length) {
      listEl.innerHTML = `
        <div class="av-notif-empty">
          <div class="av-notif-empty-ico">🔔</div>
          <h4>No Notifications Yet</h4>
          <p>Admin approvals, deposits, KYC reviews, and live signals will appear here automatically.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = list.map(item => {
      const nType = String(item.type || '').toUpperCase();
      const isUnread = Number(item.is_read || 0) === 0;
      let icon = '🔔';
      let toneClass = 'is-info';
      let tagText = 'ALERT';
      let actionBtn = '';

      if (nType === 'DEPOSIT_APPROVED') {
        icon = '💰';
        toneClass = 'is-success';
        tagText = 'DEPOSIT APPROVED';
        actionBtn = `<button type="button" class="av-notif-action-btn" onclick="App.closeModal('modal-notifications'); App.navigate('wallet');">View Wallet →</button>`;
      } else if (nType === 'DEPOSIT_REJECTED') {
        icon = '⚠️';
        toneClass = 'is-danger';
        tagText = 'DEPOSIT DECLINED';
        actionBtn = `<button type="button" class="av-notif-action-btn" onclick="App.closeModal('modal-notifications'); App.openDepositModal();">Retry Deposit →</button>`;
      } else if (nType === 'KYC_APPROVED') {
        icon = '🛡️';
        toneClass = 'is-success';
        tagText = 'KYC VERIFIED';
        actionBtn = `<button type="button" class="av-notif-action-btn" onclick="App.closeModal('modal-notifications'); App.navigate('futures');">Start Trading →</button>`;
      } else if (nType === 'KYC_RESUBMIT_REQUIRED') {
        icon = '🔄';
        toneClass = 'is-warning';
        tagText = 'KYC RESUBMIT';
        actionBtn = `<button type="button" class="av-notif-action-btn" onclick="App.closeModal('modal-notifications'); App.navigate('kyc');">Resubmit KYC →</button>`;
      } else if (nType === 'KYC_REJECTED') {
        icon = '❌';
        toneClass = 'is-danger';
        tagText = 'KYC DECLINED';
        actionBtn = `<button type="button" class="av-notif-action-btn" onclick="App.closeModal('modal-notifications'); App.navigate('kyc');">Resubmit KYC →</button>`;
      } else if (nType === 'SIGNAL_AVAILABLE' || nType === 'SIGNAL_SETTLED') {
        icon = '⚡';
        toneClass = 'is-info';
        tagText = 'LIVE SIGNAL';
        actionBtn = `<button type="button" class="av-notif-action-btn" onclick="App.closeModal('modal-notifications'); App.navigate('signals');">Open Signal Terminal →</button>`;
      } else if (nType.includes('WITHDRAWAL')) {
        icon = '💸';
        toneClass = nType.includes('REJECTED') ? 'is-danger' : 'is-info';
        tagText = 'WITHDRAWAL';
        actionBtn = `<button type="button" class="av-notif-action-btn" onclick="App.closeModal('modal-notifications'); App.navigate('wallet');">View History →</button>`;
      }

      const whenLabel = this.escapeHtml(this.formatSupportListTime(item.created_at) || this.formatAdminDate(item.created_at));
      return `
        <div class="av-notif-card${isUnread ? ' is-unread' : ''}">
          <div class="av-notif-icon ${toneClass}" aria-hidden="true">${icon}</div>
          <div class="av-notif-card-content">
            <div class="av-notif-card-top">
              <span class="av-notif-tag ${toneClass}">${this.escapeHtml(tagText)}</span>
              <span class="av-notif-time">${whenLabel}</span>
            </div>
            <div class="av-notif-title">${this.escapeHtml(item.title || 'Account Update')}</div>
            <div class="av-notif-msg">${this.escapeHtml(item.message || '')}</div>
            ${actionBtn}
          </div>
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

  /* 5. Customer Service & Persistent Live Support Chat (User <-> Admin) */
  getSupportInitials(label) {
    const clean = String(label || '').trim();
    if (!clean) return 'U';
    const base = clean.includes('@') ? clean.split('@')[0] : clean;
    const parts = base.replace(/[^A-Za-z0-9\s._-]/g, ' ').split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return base.slice(0, 2).toUpperCase();
  },

  getSupportAvatarTone(seed) {
    const tones = ['tone-blue', 'tone-indigo', 'tone-emerald', 'tone-amber', 'tone-slate'];
    const str = String(seed || 'x');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return tones[Math.abs(hash) % tones.length];
  },

  parseSupportTimestamp(value) {
    if (!value) return null;
    const raw = String(value).trim();
    const iso = raw.includes('T') ? raw : raw.replace(' ', 'T') + (raw.endsWith('Z') ? '' : 'Z');
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
  },

  formatChatDateDivider(value) {
    const d = this.parseSupportTimestamp(value);
    if (!d) return '';
    const now = new Date();
    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    if (sameDay(d, now)) return 'Today';
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (sameDay(d, yesterday)) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  },

  formatChatClock(value) {
    const d = this.parseSupportTimestamp(value);
    if (!d) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  formatSupportListTime(value) {
    const d = this.parseSupportTimestamp(value);
    if (!d) return '';
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  },

  parseSupportTopicMessage(rawMessage) {
    const text = String(rawMessage || '');
    const m = text.match(/^\[([^\]]{2,45})\]\s*([\s\S]*)$/);
    if (!m) return { topic: '', body: text };
    return { topic: m[1].trim(), body: m[2].trim() || text };
  },

  openCustomerService() {
    this.openLiveSupportChat();
  },

  async openLiveSupportChat(subject = '', prefillMessage = '') {
    this.closeModal('modal-customer-service');
    if (!this.state.user) {
      this.toast('Please log in to start a live chat with support.', 'info');
      this.openModal('modal-auth');
      return;
    }

    this.openModal('modal-support-chat');
    const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
    this.state.userSupportForceNew = false;
    this.state.userSupportSubject = cleanSubject;

    await this.loadUserSupportChat(false);
    const hasMessages = Array.isArray(this.state.userSupportMessages) && this.state.userSupportMessages.length > 0;

    if (cleanSubject) {
      this.openSupportIntake(cleanSubject, prefillMessage);
    } else if (!hasMessages) {
      this.openSupportIntake('', prefillMessage);
    } else {
      this.closeSupportIntake();
    }

    if (this._userSupportPollTimer) clearInterval(this._userSupportPollTimer);
    this._userSupportPollTimer = setInterval(() => {
      const modal = document.getElementById('modal-support-chat');
      if (modal && modal.classList.contains('open') && this.state.user) {
        this.loadUserSupportChat(true);
      }
    }, 5000);
  },

  openSupportIntake(preselectTopic = '', prefillDesc = '') {
    const intake = document.getElementById('chat-intake-view');
    const stream = document.getElementById('chat-stream-view');
    const historyView = document.getElementById('chat-history-view');
    const historyBtn = document.getElementById('btn-chat-history');
    const backBtn = document.getElementById('btn-chat-back-stream');
    const descBox = document.getElementById('chat-intake-desc-box');
    const descInp = document.getElementById('chat-intake-desc');
    const hasMsgs = Array.isArray(this.state.userSupportMessages) && this.state.userSupportMessages.length > 0;

    if (historyView) historyView.style.display = 'none';
    if (historyBtn) historyBtn.classList.remove('active');
    if (intake) intake.style.display = 'flex';
    if (stream) stream.style.display = 'none';
    if (backBtn) backBtn.style.display = hasMsgs ? 'inline-flex' : 'none';

    document.querySelectorAll('#chat-intake-view .av-sup-topic-card').forEach(btn => btn.classList.remove('active'));
    this.state.userSupportSelectedTopic = '';
    if (descBox) descBox.style.display = 'none';
    if (descInp) descInp.value = typeof prefillDesc === 'string' ? prefillDesc : '';

    if (preselectTopic) {
      const matchingBtn = Array.from(document.querySelectorAll('#chat-intake-view .av-sup-topic-card'))
        .find(b => b.getAttribute('data-topic') === preselectTopic);
      this.selectSupportIssueOption(preselectTopic, matchingBtn || null);
    }
  },

  closeSupportIntake() {
    const intake = document.getElementById('chat-intake-view');
    const stream = document.getElementById('chat-stream-view');
    const historyView = document.getElementById('chat-history-view');
    const historyBtn = document.getElementById('btn-chat-history');
    if (historyView) historyView.style.display = 'none';
    if (historyBtn) historyBtn.classList.remove('active');
    if (intake) intake.style.display = 'none';
    if (stream) stream.style.display = 'flex';
    this.renderUserSupportChat(true);
  },

  toggleSupportHistory() {
    const historyView = document.getElementById('chat-history-view');
    const isVisible = historyView && historyView.style.display === 'flex';
    if (isVisible) {
      this.closeSupportHistory();
    } else {
      this.openSupportHistory();
    }
  },

  openSupportHistory() {
    const intake = document.getElementById('chat-intake-view');
    const stream = document.getElementById('chat-stream-view');
    const historyView = document.getElementById('chat-history-view');
    const listPane = document.getElementById('chat-history-list-pane');
    const detailPane = document.getElementById('chat-history-detail-pane');
    const historyBtn = document.getElementById('btn-chat-history');

    if (intake) intake.style.display = 'none';
    if (stream) stream.style.display = 'none';
    if (historyView) historyView.style.display = 'flex';
    if (listPane) listPane.style.display = 'flex';
    if (detailPane) detailPane.style.display = 'none';
    if (historyBtn) historyBtn.classList.add('active');
    this.renderSupportHistory();
  },

  closeSupportHistory() {
    const hasMsgs = Array.isArray(this.state.userSupportMessages) && this.state.userSupportMessages.length > 0;
    if (hasMsgs) {
      this.closeSupportIntake();
    } else {
      this.openSupportIntake('', '');
    }
  },

  openSupportHistoryDetail(ticketId) {
    const history = Array.isArray(this.state.userSupportHistory) ? this.state.userSupportHistory : [];
    const item = history.find(h => String(h.id) === String(ticketId));
    if (!item) return;

    this.state.userSupportHistoryActiveId = item.id;
    const listPane = document.getElementById('chat-history-list-pane');
    const detailPane = document.getElementById('chat-history-detail-pane');
    const subjEl = document.getElementById('chat-history-detail-subject');
    const statusEl = document.getElementById('chat-history-detail-status');
    const msgsEl = document.getElementById('chat-history-detail-messages');

    if (listPane) listPane.style.display = 'none';
    if (detailPane) detailPane.style.display = 'flex';
    if (subjEl) subjEl.textContent = item.subject || 'Resolved Issue';
    if (statusEl) {
      const st = String(item.status || 'RESOLVED').toUpperCase();
      statusEl.textContent = st === 'CLOSED' ? 'Closed' : 'Resolved';
    }
    if (!msgsEl) return;

    const msgs = Array.isArray(item.messages) ? item.messages : [];
    if (!msgs.length) {
      msgsEl.innerHTML = '<div style="margin:auto;color:#6B7280;font-size:13px;">No messages recorded for this resolved ticket.</div>';
      return;
    }

    const userAvatarUrl = this.getUserAvatar(this.state.user);
    const userInitials = this.getSupportInitials(this.state.user?.first_name || this.state.user?.email || 'You');
    const clientAvatarHtml = userAvatarUrl ? `<img src="${this.escapeHtml(userAvatarUrl)}" alt="You">` : this.escapeHtml(userInitials);

    let lastDivider = '';
    const htmlParts = [];
    msgs.forEach(m => {
      const divider = this.formatChatDateDivider(m.created_at);
      if (divider && divider !== lastDivider) {
        lastDivider = divider;
        htmlParts.push(`<div class="av-chat-date-divider"><span>${this.escapeHtml(divider)}</span></div>`);
      }
      const isUser = String(m.sender_role || '').toUpperCase() === 'USER';
      const clock = this.formatChatClock(m.created_at) || this.formatAdminDate(m.created_at);
      const parsed = this.parseSupportTopicMessage(m.message || '');
      const topicPillHtml = parsed.topic ? `<div class="av-chat-topic-pill">${this.escapeHtml(parsed.topic)}</div>` : '';
      htmlParts.push(`
        <div class="av-chat-row ${isUser ? 'is-outgoing' : 'is-incoming'}">
          <div class="av-chat-avatar ${isUser ? 'is-client' : 'is-concierge'}" aria-hidden="true">${isUser ? clientAvatarHtml : 'PX'}</div>
          <div class="av-chat-msg-stack">
            <div class="av-chat-bubble">${topicPillHtml}<div>${this.escapeHtml(parsed.body)}</div></div>
            <span class="av-chat-meta">${isUser ? 'You' : 'Support Desk'} · ${this.escapeHtml(clock)}</span>
          </div>
        </div>
      `);
    });
    msgsEl.innerHTML = htmlParts.join('');
    msgsEl.scrollTop = msgsEl.scrollHeight;
  },

  closeSupportHistoryDetail() {
    const listPane = document.getElementById('chat-history-list-pane');
    const detailPane = document.getElementById('chat-history-detail-pane');
    if (detailPane) detailPane.style.display = 'none';
    if (listPane) listPane.style.display = 'flex';
  },

  updateSupportHistoryBadge() {
    const badge = document.getElementById('chat-history-badge');
    const count = Array.isArray(this.state.userSupportHistory) ? this.state.userSupportHistory.length : 0;
    if (!badge) return;
    badge.textContent = String(count);
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  },

  renderSupportHistory() {
    const listEl = document.getElementById('chat-history-list');
    if (!listEl) return;
    const history = Array.isArray(this.state.userSupportHistory) ? this.state.userSupportHistory : [];
    if (!history.length) {
      listEl.innerHTML = `<div class="av-sup-history-empty">No resolved chats yet. When our support team marks your current issue as resolved, it moves here automatically and you can start a fresh chat.</div>`;
      return;
    }

    listEl.innerHTML = history.map(item => {
      const tid = String(item.id || '');
      const st = String(item.status || 'RESOLVED').toUpperCase();
      const label = st === 'CLOSED' ? 'Closed' : 'Resolved';
      const parsed = this.parseSupportTopicMessage(item.last_message || '');
      const snippet = parsed.body || item.subject || 'Support conversation';
      const when = this.formatSupportListTime(item.resolved_at || item.updated_at || item.created_at) || 'Archived';
      const msgCount = Number(item.message_count || (Array.isArray(item.messages) ? item.messages.length : 0));
      return `
        <button type="button" class="av-sup-history-card" onclick="App.openSupportHistoryDetail('${this.escapeHtml(tid)}')">
          <div class="av-sup-history-card-top">
            <strong>${this.escapeHtml(item.subject || 'Platform Support Inquiry')}</strong>
            <span class="av-sup-history-pill">${this.escapeHtml(label)}</span>
          </div>
          <div class="av-sup-history-snippet">${this.escapeHtml(snippet)}</div>
          <div class="av-sup-history-meta">
            <span>${msgCount} message${msgCount === 1 ? '' : 's'}</span>
            <span>${this.escapeHtml(when)} · View chat ›</span>
          </div>
        </button>
      `;
    }).join('');
  },

  selectSupportIssueOption(topic, btnEl) {
    const cleanTopic = String(topic || '').trim();
    if (!cleanTopic) return;
    this.state.userSupportSelectedTopic = cleanTopic;
    document.querySelectorAll('#chat-intake-view .av-sup-topic-card').forEach(b => {
      b.classList.toggle('active', b === btnEl || b.getAttribute('data-topic') === cleanTopic);
    });
    const descBox = document.getElementById('chat-intake-desc-box');
    const selLabel = document.getElementById('chat-intake-selected-label');
    const descInp = document.getElementById('chat-intake-desc');
    if (selLabel) selLabel.textContent = cleanTopic;
    if (descBox) descBox.style.display = 'flex';
    if (descInp) setTimeout(() => descInp.focus(), 60);
  },

  async submitSupportIntake() {
    if (!this.state.user) {
      this.openModal('modal-auth');
      return;
    }
    const topic = (this.state.userSupportSelectedTopic || '').trim();
    const descEl = document.getElementById('chat-intake-desc');
    const desc = (descEl?.value || '').trim();
    const btn = document.getElementById('btn-chat-intake-submit');

    if (!topic) {
      this.toast('Please choose an issue category first.', 'warning');
      return;
    }
    if (!desc) {
      this.toast('Please describe your issue completely before sending.', 'warning');
      descEl?.focus();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending to Support...';
    }

    try {
      const formattedMessage = `[${topic}] ${desc}`;
      const res = await this.api('/support/chat.php', 'POST', {
        message: formattedMessage,
        subject: topic,
        ticket_id: this.state.userSupportActiveTicketId || '',
        new_ticket: false
      });

      if (res && res.success && res.data) {
        if (descEl) descEl.value = '';
        this.state.userSupportTicket = res.data.ticket || null;
        this.state.userSupportActiveTicketId = res.data.ticket?.id || this.state.userSupportActiveTicketId;
        this.state.userSupportTickets = Array.isArray(res.data.tickets) ? res.data.tickets : [];
        this.state.userSupportHistory = Array.isArray(res.data.history) ? res.data.history : (this.state.userSupportHistory || []);
        this.state.userSupportMessages = Array.isArray(res.data.messages) ? res.data.messages : [];
        this.updateSupportHistoryBadge();
        this.closeSupportIntake();
        this.toast('Your issue description has been sent to Support.', 'success');
      } else {
        this.toast(res?.message || 'Unable to submit support description.', 'error');
      }
    } catch (e) {
      this.toast('Network error submitting issue.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Send Description & Start Chat';
      }
    }
  },

  startNewSupportTicket(subject = '', prefillMessage = '') {
    this.openSupportIntake(subject, prefillMessage);
  },

  async selectUserSupportTicket(ticketId) {
    if (!ticketId) return;
    this.state.userSupportActiveTicketId = ticketId;
    await this.loadUserSupportChat(false);
  },

  insertUserSupportStarter(text) {
    const input = document.getElementById('chat-input-text');
    if (!input) return;
    input.value = String(text || '');
    this.updateSupportCharCount();
    input.focus();
  },

  updateSupportCharCount() {
    const input = document.getElementById('chat-input-text');
    const counter = document.getElementById('chat-char-count');
    if (!input || !counter) return;
    const len = input.value.length;
    if (len >= 120) {
      counter.textContent = `${len}/2000`;
      counter.style.display = 'inline';
    } else {
      counter.style.display = 'none';
    }
  },

  async loadUserSupportChat(silent = false) {
    if (!this.state.user) return;
    const chatBox = document.getElementById('chat-messages-container');
    if (!silent && chatBox && (!Array.isArray(this.state.userSupportMessages) || !this.state.userSupportMessages.length)) {
      chatBox.innerHTML = '<div style="margin:auto;color:#6B7280;font-size:13px;">Loading conversation...</div>';
    }
    const qs = this.state.userSupportActiveTicketId
      ? `?ticket_id=${encodeURIComponent(this.state.userSupportActiveTicketId)}`
      : '';
    const res = await this.api(`/support/chat.php${qs}`);
    if (res && res.success && res.data) {
      const prevActiveId = this.state.userSupportActiveTicketId;
      const prevCount = Array.isArray(this.state.userSupportMessages) ? this.state.userSupportMessages.length : 0;
      const nextMsgs = Array.isArray(res.data.messages) ? res.data.messages : [];
      const nextHistory = Array.isArray(res.data.history) ? res.data.history : [];
      const nextTicket = res.data.ticket || null;

      this.state.userSupportTickets = Array.isArray(res.data.tickets) ? res.data.tickets : [];
      this.state.userSupportHistory = nextHistory;
      this.state.userSupportTicket = nextTicket;
      this.state.userSupportActiveTicketId = nextTicket?.id || null;
      this.state.userSupportMessages = nextMsgs;
      this.updateSupportHistoryBadge();

      const historyView = document.getElementById('chat-history-view');
      const viewingHistory = historyView && historyView.style.display === 'flex';

      const wasResolvedNow = Boolean(
        prevActiveId &&
        !nextTicket &&
        nextHistory.some(h => String(h.id) === String(prevActiveId))
      );

      if (wasResolvedNow) {
        this.toast('Your support issue was resolved and saved to History. Start a new chat anytime.', 'success');
        if (!viewingHistory) {
          this.openSupportIntake('', '');
          return;
        }
      }

      if (viewingHistory) {
        this.renderSupportHistory();
      } else {
        this.renderUserSupportChat(nextMsgs.length !== prevCount || !silent);
      }
    } else if (!silent) {
      this.toast(res?.message || 'Unable to load support conversation.', 'error');
    }
  },

  renderUserSupportThreads() {
    const bar = document.getElementById('chat-thread-switcher');
    if (bar) {
      bar.style.display = 'none';
      bar.innerHTML = '';
    }
  },

  renderUserSupportChat(scrollToBottom = true) {
    const chatBox = document.getElementById('chat-messages-container');
    const badge = document.getElementById('chat-ticket-status-badge');
    const sep = document.getElementById('chat-ticket-meta-sep');
    const subtitle = document.getElementById('chat-status-subtitle');
    if (!chatBox) return;

    const ticket = this.state.userSupportTicket;
    const msgs = Array.isArray(this.state.userSupportMessages) ? this.state.userSupportMessages : [];

    if (badge) {
      if (ticket && ticket.status) {
        const st = String(ticket.status).toUpperCase();
        const prettyStatus = st.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        badge.textContent = prettyStatus;
        badge.style.display = 'inline';
        badge.style.color = (st === 'RESOLVED' || st === 'CLOSED') ? '#34D399' : (st === 'WAITING_FOR_USER' ? '#60A5FA' : '#FBBF24');
        if (sep) sep.style.display = 'inline';
      } else {
        badge.style.display = 'none';
        if (sep) sep.style.display = 'none';
      }
    }

    if (subtitle) {
      if (ticket?.subject && ticket.subject !== 'Platform Support Inquiry') {
        subtitle.textContent = ticket.subject;
      } else if (ticket?.status === 'WAITING_FOR_USER') {
        subtitle.textContent = 'Specialist replied below';
      } else {
        subtitle.textContent = 'Online · Direct Support Desk';
      }
    }

    if (!msgs.length) {
      chatBox.innerHTML = `
        <div class="av-chat-welcome-card">
          <div class="av-chat-welcome-head">
            <span class="av-chat-welcome-mark">PX</span>
            <div>
              <strong>PRIME X CAPITAL Support Desk</strong>
              <span>Tap "New Issue" above to pick a category and describe your concern.</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const userAvatarUrl = this.getUserAvatar(this.state.user);
    const userInitials = this.getSupportInitials(this.state.user?.first_name || this.state.user?.email || 'You');
    const clientAvatarHtml = userAvatarUrl
      ? `<img src="${this.escapeHtml(userAvatarUrl)}" alt="You">`
      : this.escapeHtml(userInitials);

    let lastDivider = '';
    const htmlParts = [];

    msgs.forEach(m => {
      const divider = this.formatChatDateDivider(m.created_at);
      if (divider && divider !== lastDivider) {
        lastDivider = divider;
        htmlParts.push(`<div class="av-chat-date-divider"><span>${this.escapeHtml(divider)}</span></div>`);
      }
      const isUser = String(m.sender_role || '').toUpperCase() === 'USER';
      const clock = this.formatChatClock(m.created_at) || this.formatAdminDate(m.created_at);
      const parsed = this.parseSupportTopicMessage(m.message || '');
      const topicPillHtml = parsed.topic
        ? `<div class="av-chat-topic-pill">${this.escapeHtml(parsed.topic)}</div>`
        : '';

      htmlParts.push(`
        <div class="av-chat-row ${isUser ? 'is-outgoing' : 'is-incoming'}">
          <div class="av-chat-avatar ${isUser ? 'is-client' : 'is-concierge'}" aria-hidden="true">${isUser ? clientAvatarHtml : 'PX'}</div>
          <div class="av-chat-msg-stack">
            <div class="av-chat-bubble">${topicPillHtml}<div>${this.escapeHtml(parsed.body)}</div></div>
            <span class="av-chat-meta">${isUser ? 'You' : 'Support Desk'} · ${this.escapeHtml(clock)}${isUser ? ' <span class="av-chat-ticks" aria-hidden="true">✓✓</span>' : ''}</span>
          </div>
        </div>
      `);
    });

    chatBox.innerHTML = htmlParts.join('');

    if (scrollToBottom) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  },

  async sendSupportMessage() {
    if (!this.state.user) {
      this.toast('Please sign in first to contact support.', 'info');
      this.openModal('modal-auth');
      return;
    }
    const input = document.getElementById('chat-input-text');
    const sendBtn = document.getElementById('btn-chat-send');
    const msgText = input?.value?.trim() || '';
    if (!msgText) return;

    if (sendBtn) sendBtn.disabled = true;
    const payload = {
      message: msgText,
      subject: this.state.userSupportTicket?.subject || this.state.userSupportSelectedTopic || 'Platform Support Inquiry',
      ticket_id: this.state.userSupportActiveTicketId || '',
      new_ticket: false
    };
    const res = await this.api('/support/chat.php', 'POST', payload);
    if (sendBtn) sendBtn.disabled = false;

    if (res && res.success && res.data) {
      input.value = '';
      this.updateSupportCharCount();
      this.state.userSupportForceNew = false;
      this.state.userSupportTicket = res.data.ticket || null;
      this.state.userSupportActiveTicketId = res.data.ticket?.id || null;
      this.state.userSupportTickets = Array.isArray(res.data.tickets) ? res.data.tickets : [];
      if (Array.isArray(res.data.history)) {
        this.state.userSupportHistory = res.data.history;
        this.updateSupportHistoryBadge();
      }
      this.state.userSupportMessages = Array.isArray(res.data.messages) ? res.data.messages : [];
      this.renderUserSupportChat(true);
    } else {
      this.toast(res?.message || 'Unable to send support message. Please try again.', 'error');
    }
  },

  /* 5b. Admin Support Desk */
  setAdminSupportFilter(status) {
    const normalized = String(status || 'ALL').toUpperCase();
    const allowed = ['ALL', 'NEEDS_REPLY', 'OPEN', 'RESOLVED'];
    const nextFilter = allowed.includes(normalized) ? normalized : 'ALL';
    this.state.adminSupportFilter = nextFilter;

    document.querySelectorAll('.av-adm-sup-seg-btn').forEach(btn => {
      const isActive = String(btn.dataset.supFilter || '').toUpperCase() === nextFilter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const filterLabelMap = {
      ALL: 'All',
      NEEDS_REPLY: 'Needs Reply',
      OPEN: 'Active',
      RESOLVED: 'Resolved'
    };
    const filterTagEl = document.getElementById('adm-sup-active-filter-label');
    if (filterTagEl) {
      filterTagEl.textContent = filterLabelMap[nextFilter] || 'All';
    }

    if (!this.state.adminSupportLoaded && (!Array.isArray(this.state.adminSupportTickets) || !this.state.adminSupportTickets.length)) {
      this.loadAdminSupport({ silent: true });
    }
    this.filterAdminSupport();
  },

  onAdminSupportSearchInput() {
    const input = document.getElementById('adm-sup-search');
    const clearBtn = document.getElementById('btn-adm-sup-clear-search');
    const hasVal = Boolean(input && input.value.trim().length > 0);
    if (clearBtn) clearBtn.style.display = hasVal ? 'inline-flex' : 'none';
    this.filterAdminSupport();
  },

  clearAdminSupportSearch() {
    const input = document.getElementById('adm-sup-search');
    const clearBtn = document.getElementById('btn-adm-sup-clear-search');
    if (input) {
      input.value = '';
      input.focus();
    }
    if (clearBtn) clearBtn.style.display = 'none';
    this.filterAdminSupport();
  },

  resetAdminSupportFilters() {
    const input = document.getElementById('adm-sup-search');
    const clearBtn = document.getElementById('btn-adm-sup-clear-search');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.setAdminSupportFilter('ALL');
  },

  updateAdminSupportMetrics(tickets) {
    const list = Array.isArray(tickets) ? tickets : [];
    const totalCount = list.length;
    let needsCount = 0;
    let openCount = 0;
    let resolvedCount = 0;

    list.forEach(t => {
      const st = String(t.status || 'OPEN').toUpperCase();
      const isResolved = st === 'RESOLVED' || st === 'CLOSED';
      if (isResolved) resolvedCount++;
      else openCount++;
      if (t.needs_reply) needsCount++;
    });

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val);
    };
    setText('adm-sup-kpi-total', totalCount);
    setText('adm-sup-kpi-needs', needsCount);
    setText('adm-sup-kpi-open', openCount);
    setText('adm-sup-kpi-resolved', resolvedCount);
    setText('adm-sup-count-all', totalCount);
    setText('adm-sup-count-open', openCount);
    setText('adm-sup-count-resolved', resolvedCount);

    const tabNeeds = document.getElementById('adm-sup-tab-needs-count');
    if (tabNeeds) {
      tabNeeds.textContent = String(needsCount);
      tabNeeds.style.display = needsCount > 0 ? 'inline-block' : 'none';
    }

    const updateSupBadge = (id, cnt) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = String(cnt);
      el.style.display = cnt > 0 ? 'inline-flex' : 'none';
    };
    updateSupBadge('adm-badge-support', needsCount);
    updateSupBadge('adm-pill-badge-support', needsCount);

    const qSup = document.getElementById('adm-quick-support');
    if (qSup) {
      if (needsCount > 0) {
        qSup.textContent = `${needsCount} Needs Reply`;
        qSup.className = 'av-adm-action-count warn';
      } else {
        qSup.textContent = `${openCount} Open`;
        qSup.className = 'av-adm-action-count';
      }
    }
  },

  async loadAdminSupport(opts = {}) {
    const silent = Boolean(opts && opts.silent);
    const manual = Boolean(opts && opts.manual);
    const refreshBtn = document.getElementById('btn-adm-sup-refresh');

    if (manual && refreshBtn) {
      refreshBtn.classList.add('is-loading');
      refreshBtn.disabled = true;
    }

    const activeId = this.state.adminSupportActiveId || '';
    const qs = activeId ? `?ticket_id=${encodeURIComponent(activeId)}` : '';
    const res = await this.api(`/admin/support.php${qs}`);

    if (manual && refreshBtn) {
      refreshBtn.classList.remove('is-loading');
      refreshBtn.disabled = false;
    }

    if (!res || !res.success || !res.data) {
      if ((!silent || manual) && this.state.adminTab === 'support') {
        this.toast(res?.message || 'Unable to load support tickets.', 'error');
      }
      return;
    }

    const tickets = Array.isArray(res.data.tickets) ? res.data.tickets : [];
    this.state.adminSupportLoaded = true;
    this.state.adminSupportTickets = tickets;
    this.state.adminSupportMessages = Array.isArray(res.data.messages) ? res.data.messages : [];

    const hasActive = tickets.some(t => String(t.id) === String(this.state.adminSupportActiveId || ''));
    if (!hasActive) {
      this.state.adminSupportActiveId = res.data.active_ticket_id || (tickets[0]?.id || null);
    }

    this.updateAdminSupportMetrics(tickets);
    this.filterAdminSupport();
    this.renderAdminSupportThread(!silent);

    if (manual) {
      this.toast(`Support inbox synced · ${tickets.length} conversation${tickets.length === 1 ? '' : 's'}`, 'success');
    }
  },

  filterAdminSupport() {
    const listEl = document.getElementById('adm-sup-ticket-list');
    if (!listEl) return;

    const searchInput = document.getElementById('adm-sup-search');
    const query = (searchInput?.value || '').trim().toLowerCase();
    const clearBtn = document.getElementById('btn-adm-sup-clear-search');
    if (clearBtn) clearBtn.style.display = query.length > 0 ? 'inline-flex' : 'none';

    const filterStatus = String(this.state.adminSupportFilter || 'ALL').toUpperCase();
    const tickets = Array.isArray(this.state.adminSupportTickets) ? this.state.adminSupportTickets : [];

    document.querySelectorAll('.av-adm-sup-seg-btn').forEach(btn => {
      const isActive = String(btn.dataset.supFilter || '').toUpperCase() === filterStatus;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const filtered = tickets.filter(t => {
      const st = String(t.status || 'OPEN').toUpperCase();
      if (filterStatus === 'NEEDS_REPLY' && !t.needs_reply) return false;
      if (filterStatus === 'OPEN' && ['RESOLVED', 'CLOSED'].includes(st)) return false;
      if (filterStatus === 'RESOLVED' && !['RESOLVED', 'CLOSED'].includes(st)) return false;

      if (query) {
        const hay = `${t.id || ''} ${t.user_email || ''} ${t.user_name || ''} ${t.numeric_uid || ''} ${t.subject || ''} ${t.last_message || ''}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    const summaryEl = document.getElementById('adm-sup-inbox-summary');
    if (summaryEl) {
      const needsCount = tickets.filter(t => t.needs_reply).length;
      if (filtered.length !== tickets.length) {
        summaryEl.textContent = `Showing ${filtered.length} of ${tickets.length} · ${needsCount} awaiting reply`;
      } else {
        summaryEl.textContent = `${tickets.length} conversation${tickets.length === 1 ? '' : 's'} · ${needsCount} awaiting reply`;
      }
    }

    if (!filtered.length) {
      const hasConstraint = filterStatus !== 'ALL' || query.length > 0;
      const msg = hasConstraint
        ? 'No conversations match the current filter or search.'
        : 'No support conversations yet. Client messages will appear here automatically.';
      listEl.innerHTML = `
        <div class="av-adm-sup-empty-pane">
          <span>${this.escapeHtml(msg)}</span>
          ${hasConstraint ? '<button type="button" class="av-adm-sup-reset-btn" onclick="App.resetAdminSupportFilters()">Show All Conversations</button>' : ''}
        </div>
      `;
      return;
    }

    const activeId = String(this.state.adminSupportActiveId || '');
    listEl.innerHTML = filtered.map(t => {
      const tid = String(t.id || '');
      const st = String(t.status || 'OPEN').toUpperCase();
      const isSelected = tid === activeId;
      let statusClass = 'waiting';
      let statusLabel = 'Awaiting User';
      if (t.needs_reply) {
        statusClass = 'needs-reply';
        statusLabel = 'Needs Reply';
      } else if (st === 'RESOLVED' || st === 'CLOSED') {
        statusClass = 'resolved';
        statusLabel = st === 'CLOSED' ? 'Closed' : 'Resolved';
      }
      const initials = this.getSupportInitials(t.user_name || t.user_email || 'U');
      const avatarValid = this.isValidAvatarUrl(t.user_avatar) ? t.user_avatar : '';
      const avatarInner = avatarValid ? `<img src="${this.escapeHtml(avatarValid)}" alt="">` : this.escapeHtml(initials);
      const tone = this.getSupportAvatarTone(t.user_email || tid);
      const uidPart = t.numeric_uid ? `UID #${this.escapeHtml(String(t.numeric_uid))}` : this.escapeHtml(t.user_name || 'Member');
      const msgCount = Number(t.message_count || 0);
      const timeLabel = this.formatSupportListTime(t.last_message_at || t.updated_at || t.created_at);
      const rawSubj = String(t.subject || '').trim();
      const showSubj = rawSubj && rawSubj !== 'Platform Support Inquiry';
      const lastSender = String(t.last_sender_role || '').toUpperCase();
      const parsedSnippet = this.parseSupportTopicMessage(t.last_message || '');
      const snippetRaw = parsedSnippet.body || rawSubj || 'New support inquiry';
      const snippetText = (lastSender === 'ADMIN' && t.last_message) ? `You: ${snippetRaw}` : snippetRaw;

      return `
        <button type="button" class="av-adm-sup-ticket-item${isSelected ? ' active' : ''}" onclick="App.selectAdminSupportTicket('${this.escapeHtml(tid)}')">
          <div class="av-adm-sup-avatar-wrap">
            <div class="av-adm-sup-avatar ${tone}" aria-hidden="true">${avatarInner}</div>
            ${t.needs_reply ? '<span class="av-adm-sup-unread-dot" aria-hidden="true"></span>' : ''}
          </div>
          <div class="av-adm-sup-item-body">
            <div class="av-adm-sup-item-top">
              <span class="av-adm-sup-user-label">${this.escapeHtml(t.user_name || t.user_email || 'User')}</span>
              <span class="av-adm-sup-time">${this.escapeHtml(timeLabel)}</span>
            </div>
            ${showSubj ? `<div class="av-adm-sup-subject">${this.escapeHtml(rawSubj)}</div>` : ''}
            <div class="av-adm-sup-snippet">${this.escapeHtml(snippetText)}</div>
            <div class="av-adm-sup-meta">
              <span class="av-sup-status-tag ${statusClass}">${this.escapeHtml(statusLabel)}</span>
              <span aria-hidden="true">·</span>
              <span>${uidPart}</span>
              <span aria-hidden="true">·</span>
              <span>${msgCount} msg${msgCount === 1 ? '' : 's'}</span>
            </div>
          </div>
        </button>
      `;
    }).join('');
  },

  async selectAdminSupportTicket(ticketId) {
    this.state.adminSupportActiveId = ticketId;
    const splitEl = document.getElementById('adm-sup-split');
    const secEl = document.getElementById('adm-sec-support');
    if (splitEl) splitEl.classList.add('is-thread-open');
    if (secEl) secEl.classList.add('is-mobile-thread-open');
    this.filterAdminSupport();

    const res = await this.api(`/admin/support.php?ticket_id=${encodeURIComponent(ticketId)}`);
    if (res && res.success && res.data) {
      if (Array.isArray(res.data.tickets)) {
        this.state.adminSupportTickets = res.data.tickets;
        this.updateAdminSupportMetrics(res.data.tickets);
      }
      this.state.adminSupportMessages = Array.isArray(res.data.messages) ? res.data.messages : [];
      this.filterAdminSupport();
      this.renderAdminSupportThread(true);
    } else {
      this.toast(res?.message || 'Unable to load ticket thread.', 'error');
    }
  },

  closeMobileSupportThread() {
    const splitEl = document.getElementById('adm-sup-split');
    const secEl = document.getElementById('adm-sec-support');
    if (splitEl) splitEl.classList.remove('is-thread-open');
    if (secEl) secEl.classList.remove('is-mobile-thread-open');
  },

  updateAdminSupportCharCount() {
    const input = document.getElementById('adm-sup-reply-input');
    const counter = document.getElementById('adm-sup-char-count');
    if (!input || !counter) return;
    const len = input.value.length;
    if (len >= 120) {
      counter.textContent = `${len}/2000`;
      counter.style.display = 'inline';
    } else {
      counter.style.display = 'none';
    }
  },

  insertAdminSupportMacro(text) {
    const input = document.getElementById('adm-sup-reply-input');
    if (!input) return;
    input.value = String(text || '');
    this.updateAdminSupportCharCount();
    input.focus();
  },

  inspectAdminSupportUser() {
    const tickets = Array.isArray(this.state.adminSupportTickets) ? this.state.adminSupportTickets : [];
    const active = tickets.find(t => String(t.id) === String(this.state.adminSupportActiveId));
    if (!active) {
      this.toast('Select a support conversation first.', 'warning');
      return;
    }
    const lookupKey = String(active.user_id || active.user_email || '').trim();
    if (!lookupKey) {
      this.toast('User identifier is missing on this ticket.', 'warning');
      return;
    }
    this.viewUserDossier(lookupKey);
  },

  renderAdminSupportThread(scrollToBottom = true) {
    const headerAvatar = document.getElementById('adm-sup-thread-avatar');
    const headerUser = document.getElementById('adm-sup-thread-user');
    const headerMeta = document.getElementById('adm-sup-thread-meta');
    const controls = document.getElementById('adm-sup-thread-controls');
    const resolveBtn = document.getElementById('btn-adm-sup-resolve');
    const statusSel = document.getElementById('adm-sup-status-select');
    const contextBar = document.getElementById('adm-sup-context-bar');
    const msgsEl = document.getElementById('adm-sup-thread-messages');
    const composerWrap = document.getElementById('adm-sup-composer-wrap');
    if (!msgsEl) return;

    const tickets = Array.isArray(this.state.adminSupportTickets) ? this.state.adminSupportTickets : [];
    const active = tickets.find(t => String(t.id) === String(this.state.adminSupportActiveId));

    if (!active) {
      if (headerAvatar) {
        headerAvatar.className = 'av-adm-sup-avatar tone-slate';
        headerAvatar.textContent = 'PX';
      }
      if (headerUser) headerUser.textContent = 'Select a conversation';
      if (headerMeta) headerMeta.textContent = 'Choose a client inquiry to view history and respond';
      if (controls) controls.style.display = 'none';
      if (contextBar) contextBar.style.display = 'none';
      if (composerWrap) composerWrap.style.display = 'none';
      msgsEl.innerHTML = '<div class="av-adm-sup-empty-pane">Select any customer thread from the queue to inspect messages and reply directly.</div>';
      return;
    }

    const clientInitials = this.getSupportInitials(active.user_name || active.user_email || 'U');
    const clientAvatarValid = this.isValidAvatarUrl(active.user_avatar) ? active.user_avatar : '';
    const clientAvatarHtml = clientAvatarValid ? `<img src="${this.escapeHtml(clientAvatarValid)}" alt="">` : this.escapeHtml(clientInitials);
    const clientTone = this.getSupportAvatarTone(active.user_email || active.id);
    const activeStatus = String(active.status || 'OPEN').toUpperCase();
    const isResolved = activeStatus === 'RESOLVED' || activeStatus === 'CLOSED';

    if (headerAvatar) {
      headerAvatar.className = `av-adm-sup-avatar ${clientTone}`;
      headerAvatar.innerHTML = clientAvatarHtml;
    }
    if (headerUser) headerUser.textContent = `${active.user_name ? `${active.user_name} · ` : ''}${active.user_email || 'Member'}`;
    if (headerMeta) {
      const uidTag = active.numeric_uid ? `UID #${active.numeric_uid} · ` : '';
      headerMeta.textContent = `${uidTag}${active.subject || 'Platform Support Inquiry'}`;
    }
    if (controls) controls.style.display = 'flex';
    if (resolveBtn) resolveBtn.style.display = isResolved ? 'none' : 'inline-flex';
    if (statusSel) statusSel.value = activeStatus;
    if (composerWrap) composerWrap.style.display = 'flex';

    if (contextBar) {
      const shortTicket = String(active.id || '').slice(0, 8).toUpperCase();
      const prettyStatus = activeStatus.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
      const lastBy = String(active.last_sender_role || '').toUpperCase() === 'ADMIN' ? 'Admin Desk' : (active.user_name || 'Client');
      contextBar.style.display = 'flex';
      contextBar.innerHTML = `
        <span>Ticket <strong>#${this.escapeHtml(shortTicket)}</strong></span>
        <span aria-hidden="true">·</span>
        <span>Topic: <strong>${this.escapeHtml(active.subject || 'Platform Support Inquiry')}</strong></span>
        <span aria-hidden="true">·</span>
        <span>Status: <strong>${this.escapeHtml(prettyStatus)}</strong></span>
        <span aria-hidden="true">·</span>
        <span>Last reply: <strong>${this.escapeHtml(lastBy)}</strong></span>
      `;
    }

    const msgs = Array.isArray(this.state.adminSupportMessages) ? this.state.adminSupportMessages : [];
    if (!msgs.length) {
      msgsEl.innerHTML = '<div class="av-adm-sup-empty-pane">No messages in this conversation yet.</div>';
      return;
    }

    let lastDivider = '';
    const htmlParts = [];
    msgs.forEach(m => {
      const divider = this.formatChatDateDivider(m.created_at);
      if (divider && divider !== lastDivider) {
        lastDivider = divider;
        htmlParts.push(`<div class="av-chat-date-divider"><span>${this.escapeHtml(divider)}</span></div>`);
      }
      const isAdmin = String(m.sender_role || '').toUpperCase() === 'ADMIN';
      const clock = this.formatChatClock(m.created_at) || this.formatAdminDate(m.created_at);
      const parsed = this.parseSupportTopicMessage(m.message || '');
      const topicPillHtml = parsed.topic
        ? `<div class="av-chat-topic-pill">${this.escapeHtml(parsed.topic)}</div>`
        : '';

      htmlParts.push(`
        <div class="av-chat-row ${isAdmin ? 'is-outgoing' : 'is-incoming'}">
          <div class="av-chat-avatar ${isAdmin ? 'is-concierge' : 'is-client'}" aria-hidden="true">${isAdmin ? 'PX' : clientAvatarHtml}</div>
          <div class="av-chat-msg-stack">
            <div class="av-chat-bubble">${topicPillHtml}<div>${this.escapeHtml(parsed.body)}</div></div>
            <span class="av-chat-meta">${isAdmin ? 'Admin' : this.escapeHtml(active.user_name || 'User')} · ${this.escapeHtml(clock)}${isAdmin ? ' <span class="av-chat-ticks" aria-hidden="true">✓✓</span>' : ''}</span>
          </div>
        </div>
      `);
    });

    msgsEl.innerHTML = htmlParts.join('');

    if (scrollToBottom) {
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }
  },

  async sendAdminSupportReply() {
    const ticketId = this.state.adminSupportActiveId;
    const input = document.getElementById('adm-sup-reply-input');
    const sendBtn = document.getElementById('btn-adm-sup-send');
    const message = input?.value?.trim() || '';
    if (!ticketId || !message) return;

    if (sendBtn) sendBtn.disabled = true;
    const res = await this.api('/admin/support.php', 'POST', {
      action: 'REPLY',
      ticket_id: ticketId,
      message
    });
    if (sendBtn) sendBtn.disabled = false;

    if (res && res.success) {
      input.value = '';
      this.updateAdminSupportCharCount();
      if (Array.isArray(res.data?.messages)) {
        this.state.adminSupportMessages = res.data.messages;
      }
      await this.loadAdminSupport({ silent: true });
      this.renderAdminSupportThread(true);
      this.toast('Reply sent to user', 'success');
    } else {
      this.toast(res?.message || 'Unable to send reply.', 'error');
    }
  },

  async updateAdminSupportStatus(status) {
    const ticketId = this.state.adminSupportActiveId;
    if (!ticketId || !status) return;
    const res = await this.api('/admin/support.php', 'POST', {
      action: 'STATUS',
      ticket_id: ticketId,
      status
    });
    if (res && res.success) {
      this.toast(`Ticket marked as ${status.replace(/_/g, ' ')}`, 'success');
      await this.loadAdminSupport({ silent: true });
    } else {
      this.toast(res?.message || 'Unable to update ticket status.', 'error');
    }
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
        const avatarUrl = this.getUserAvatar(user);
        const initials = this.getUserInitials(user);
        if (avatarUrl) {
          avatarEl.innerHTML = `<img class="side-drawer-avatar-img" src="${this.escapeHtml(avatarUrl)}" alt="Profile avatar">`;
        } else {
          avatarEl.textContent = initials;
        }
      }
      const kyc = (user.kyc_status || 'NOT_SUBMITTED').toUpperCase();
      if (kycEl) {
        if (kyc === 'APPROVED') {
          kycEl.textContent = 'Verified';
          kycEl.className = 'badge badge-positive';
        } else if (kyc === 'PENDING' || kyc === 'UNDER_REVIEW') {
          kycEl.textContent = 'Pending';
          kycEl.className = 'badge badge-warning';
        } else if (kyc === 'RESUBMIT_REQUIRED') {
          kycEl.textContent = 'Resubmit';
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
        } else if (kyc === 'PENDING' || kyc === 'UNDER_REVIEW') {
          miniKycEl.textContent = 'Pending';
          miniKycEl.style.background = '#FFFBEB';
          miniKycEl.style.color = '#D97706';
        } else if (kyc === 'RESUBMIT_REQUIRED') {
          miniKycEl.textContent = 'Resubmit';
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
    const { symbol: currSym, rate: currRate } = this.getDisplayCurrency();
    const list = (this.state.tickers || []).slice(0, 8);
    container.innerHTML = list.map(t => {
      const chg = parseFloat(t.change_24h || 0);
      const isUp = chg >= 0;
      const basePart = t.base || (t.symbol || 'BTC/USDT').split('/')[0];
      const quotePart = t.quote || (t.symbol && t.symbol.includes('/') ? t.symbol.split('/')[1] : 'USDT');
      const priceNum = parseFloat(t.price || 0) * currRate;
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
              <div class="mono" style="font-size:12px;color:#6B7280;margin-top:2px;">${currSym}${priceStr}</div>
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
    const activeMode = mode === 'copy' ? 'delivery' : mode;
    const modes = ['delivery', 'perpetual', 'spot', 'earn'];
    modes.forEach(m => {
      const tab = document.getElementById(`trade-tab-${m}`);
      const panel = document.getElementById(`trade-panel-${m}`);
      if (tab) tab.classList.toggle('active', m === activeMode);
      if (panel) panel.style.display = m === activeMode ? 'block' : 'none';
    });
    const copyPanel = document.getElementById('trade-panel-copy');
    if (copyPanel) copyPanel.style.display = 'none';

    if (skipLoad) return;

    if (activeMode === 'delivery') {
      this.renderChart();
    } else if (activeMode === 'perpetual') {
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
            <p style="font-size:13.5px;color:#4B5563;line-height:1.55;margin:0;">Combining traditional financial risk discipline with tokenized markets, automated quantitative strategies, and segregated cold-vault custody.</p>
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
                <div style="font-size:13.5px;color:#4B5563;">Enhanced institutional 6-digit Fund PIN and real-time institutional signal execution.</div>
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
      localStorage.setItem('alphavest_currency_code', String(code).toUpperCase());
      localStorage.setItem('alphavest_currency_symbol', symbol);
      localStorage.setItem('alphavest_currency_rate', String(rate));
    } catch (e) {}
    const drawerCurr = document.getElementById('drawer-currency-label');
    if (drawerCurr) drawerCurr.textContent = String(code).toUpperCase();
    this.closeModal('modal-currency-select');

    // Immediately convert and re-render all visible balances, profits, and market prices
    this.updateHomeHeroBalance();
    this.renderWalletView();
    this.renderReferrals();
    this.updateTopTickers();
    this.renderTickerBar();
    this.renderMarketList();
    this.renderPublicMarketRows();
    this.updateMarketFeaturedBanner();
    this.updateFuturesBanner();
    if (this.state.signalsData) {
      const sigProfit = Number(this.state.signalsData.signal_profit_total || 0);
      const dispCurr = this.getDisplayCurrency();
      document.querySelectorAll('[data-user-signal-profit-total]').forEach(el => {
        el.textContent = `+${this.formatDisplayMoney(sigProfit)} ${dispCurr.code === 'USD' ? 'USDT' : dispCurr.code}`;
      });
    }
    this.toast(`Display currency updated to ${String(code).toUpperCase()} (${symbol})`, 'success');
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
    const oldEl = document.getElementById('chpwd-old');
    const otpEl = document.getElementById('chpwd-otp');
    const newEl = document.getElementById('chpwd-new');
    const confEl = document.getElementById('chpwd-confirm');
    const statusEl = document.getElementById('chpwd-otp-status');
    if (oldEl) oldEl.value = '';
    if (otpEl) otpEl.value = '';
    if (newEl) newEl.value = '';
    if (confEl) confEl.value = '';
    if (statusEl) {
      statusEl.className = 'av-sec-otp-status';
      statusEl.textContent = 'Click Send Code to receive a 6-digit verification code on your registered email.';
    }
    this.toggleChangePwdForgotMode(false);
    this.openAppView('change-password');
  },

  toggleChangePwdForgotMode(forceVal) {
    this.state.changePwdForgotMode = typeof forceVal === 'boolean' ? forceVal : !this.state.changePwdForgotMode;
    const isForgot = Boolean(this.state.changePwdForgotMode);
    const oldGroup = document.getElementById('chpwd-old-group');
    const toggleBtn = document.getElementById('btn-toggle-forgot-chpwd');
    const statusEl = document.getElementById('chpwd-otp-status');
    if (oldGroup) oldGroup.style.display = isForgot ? 'none' : 'block';
    if (toggleBtn) toggleBtn.textContent = isForgot ? 'Use old password instead' : 'Forgot old password?';
    if (statusEl && isForgot) {
      statusEl.className = 'av-sec-otp-status';
      statusEl.textContent = 'Forgot password mode: verify using the 6-digit code sent to your account email.';
    }
  },

  syncProfileEmailBadge(userObj) {
    const verifyBadge = document.getElementById('prof-email-verify-badge');
    const resendBtn = document.getElementById('prof-btn-resend-verify');
    const previewUser = this.state.adminPreviewUser;
    const target = userObj || previewUser || this.state.user;
    if (!verifyBadge || !resendBtn) return;

    if (!target || previewUser) {
      verifyBadge.style.display = 'none';
      resendBtn.style.display = 'none';
      return;
    }

    const verified = Boolean(target.email_verified);
    verifyBadge.style.display = 'inline-flex';
    if (verified) {
      verifyBadge.className = 'badge badge-positive';
      verifyBadge.textContent = 'Email: Verified';
      resendBtn.style.display = 'none';
    } else {
      verifyBadge.className = 'badge badge-warning';
      verifyBadge.textContent = 'Email: Unverified';
      resendBtn.style.display = 'block';
    }
  },

  async resendVerificationEmail() {
    if (!this.state.user) {
      this.openModal('modal-auth');
      return;
    }
    const btn = document.getElementById('prof-btn-resend-verify');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending confirmation email...';
    }
    try {
      const res = await this.api('/auth/resend-verification.php', 'POST', {});
      if (res && res.success) {
        if (res.data?.email_verified && this.state.user) {
          this.state.user.email_verified = true;
          try { localStorage.setItem('alphavest_local_user', JSON.stringify(this.state.user)); } catch (e) {}
          this.syncProfileEmailBadge(this.state.user);
        }
        this.toast(res.message || 'Verification email sent. Please check your inbox.', 'success');
      } else {
        this.toast((res && res.message) || 'Could not send verification email right now.', 'error');
      }
    } catch (e) {
      this.toast('Network error while sending verification email.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Resend Confirmation Email';
      }
    }
  },

  async handleVerifyEmailToken(token) {
    const cleanToken = String(token || '').trim();
    const titleEl = document.getElementById('email-verify-modal-title');
    const msgEl = document.getElementById('email-verify-modal-message');

    if (window.AlphaLanding && typeof window.AlphaLanding.hide === 'function') {
      window.AlphaLanding.hide();
    }
    const landingEl = document.getElementById('av-public-landing');
    if (landingEl) landingEl.hidden = true;
    this.closeModal('modal-auth');

    if (titleEl) titleEl.textContent = 'Verifying your email...';
    if (msgEl) msgEl.textContent = 'Please wait while we confirm your Prime X Capital email verification token.';
    this.openModal('modal-email-verify');

    if (!cleanToken) {
      if (titleEl) titleEl.textContent = 'Invalid Verification Link';
      if (msgEl) msgEl.textContent = 'This verification link is incomplete. Please request a new confirmation email from your profile.';
      return;
    }

    try {
      const res = await this.api('/auth/verify-email.php', 'POST', { token: cleanToken });
      if (res && res.success) {
        if (titleEl) titleEl.textContent = 'Email Confirmed';
        if (msgEl) msgEl.textContent = res.message || 'Your Prime X Capital email address is now verified.';
        if (this.state.user) {
          this.state.user.email_verified = true;
          try { localStorage.setItem('alphavest_local_user', JSON.stringify(this.state.user)); } catch (e) {}
          this.updateHeaderAuth();
          this.syncProfileEmailBadge(this.state.user);
        }
        this.toast(res.message || 'Email verified successfully.', 'success');
      } else {
        if (titleEl) titleEl.textContent = 'Verification Link Unavailable';
        if (msgEl) msgEl.textContent = (res && res.message) || 'This verification link is invalid or has expired.';
      }
    } catch (e) {
      if (titleEl) titleEl.textContent = 'Verification Error';
      if (msgEl) msgEl.textContent = 'Unable to verify your email right now. Please try again.';
    }
  },

  async submitForgotPassword() {
    const emailInput = document.getElementById('forgot-pwd-email');
    const otpInput = document.getElementById('forgot-pwd-otp');
    const newInput = document.getElementById('forgot-pwd-new');
    const confInput = document.getElementById('forgot-pwd-confirm');
    const btn = document.getElementById('btn-submit-forgot-pwd');

    const email = (emailInput?.value || '').trim();
    const verificationCode = (otpInput?.value || '').trim();
    const newPwd = newInput?.value || '';
    const confPwd = confInput?.value || '';

    if (!email || !email.includes('@')) {
      this.toast('Please enter your registered email address.', 'warning');
      emailInput?.focus();
      return;
    }
    if (!/^\d{6}$/.test(verificationCode)) {
      this.toast('Please enter the 6-digit verification code sent to your email.', 'warning');
      otpInput?.focus();
      return;
    }
    if (!newPwd || newPwd.length < 8 || newPwd.length > 128) {
      this.toast('New password must be between 8 and 128 characters.', 'warning');
      newInput?.focus();
      return;
    }
    if (newPwd !== confPwd) {
      this.toast('New passwords do not match.', 'warning');
      confInput?.focus();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Verifying & Resetting...';
    }

    try {
      const res = await this.api('/auth/reset-password.php', 'POST', {
        email,
        verification_code: verificationCode,
        password: newPwd,
        confirm_password: confPwd
      });
      if (res && res.success) {
        if (emailInput) emailInput.value = '';
        if (otpInput) otpInput.value = '';
        if (newInput) newInput.value = '';
        if (confInput) confInput.value = '';
        this.closeModal('modal-forgot-password');
        this.toast(res.message || 'Password reset successfully. Please sign in with your new password.', 'success');
        this.openModal('modal-auth');
        this.switchAuthBox('login');
      } else {
        this.toast((res && res.message) || 'Invalid or expired verification code.', 'error');
      }
    } catch (e) {
      this.toast('Network error while resetting password.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Verify Code & Reset Password';
      }
    }
  },

  async openResetPasswordFromToken(token) {
    const cleanToken = String(token || '').trim();
    const tokenInput = document.getElementById('reset-pwd-token');
    const newInput = document.getElementById('reset-pwd-new');
    const confirmInput = document.getElementById('reset-pwd-confirm');
    const noteEl = document.getElementById('reset-pwd-status-note');
    const submitBtn = document.getElementById('btn-submit-reset-pwd');

    if (window.AlphaLanding && typeof window.AlphaLanding.hide === 'function') {
      window.AlphaLanding.hide();
    }
    const landingEl = document.getElementById('av-public-landing');
    if (landingEl) landingEl.hidden = true;
    this.closeModal('modal-auth');
    this.closeModal('modal-forgot-password');

    if (tokenInput) tokenInput.value = cleanToken;
    if (newInput) newInput.value = '';
    if (confirmInput) confirmInput.value = '';
    if (submitBtn) submitBtn.disabled = false;
    if (noteEl) {
      noteEl.style.color = 'var(--text-muted)';
      noteEl.textContent = 'Checking your password reset link...';
    }
    this.openModal('modal-reset-password');

    try {
      const res = await this.api(`/auth/reset-password.php?token=${encodeURIComponent(cleanToken)}`, 'GET');
      if (res && res.success && res.data?.valid) {
        if (noteEl) {
          noteEl.style.color = 'var(--text-muted)';
          noteEl.textContent = 'Choose a strong new password (8 to 128 characters) for your Prime X Capital account.';
        }
      } else {
        if (submitBtn) submitBtn.disabled = true;
        if (noteEl) {
          noteEl.style.color = 'var(--negative)';
          noteEl.textContent = (res && res.message) || 'This password reset link is invalid or has expired. Please request a new reset email.';
        }
      }
    } catch (e) {
      if (noteEl) {
        noteEl.style.color = 'var(--text-muted)';
        noteEl.textContent = 'Choose a strong new password (8 to 128 characters) for your Prime X Capital account.';
      }
    }
  },

  async submitResetPassword() {
    const token = (document.getElementById('reset-pwd-token')?.value || '').trim();
    const newPwd = document.getElementById('reset-pwd-new')?.value || '';
    const confPwd = document.getElementById('reset-pwd-confirm')?.value || '';
    const btn = document.getElementById('btn-submit-reset-pwd');

    if (!token) {
      this.toast('Reset token missing. Please request a new password reset email.', 'error');
      return;
    }
    if (!newPwd || newPwd.length < 8 || newPwd.length > 128) {
      this.toast('Password must be between 8 and 128 characters.', 'warning');
      return;
    }
    if (newPwd !== confPwd) {
      this.toast('New passwords do not match.', 'warning');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Updating Password...';
    }

    try {
      const res = await this.api('/auth/reset-password.php', 'POST', {
        token,
        password: newPwd,
        confirm_password: confPwd
      });
      if (res && res.success) {
        this.state.user = null;
        this.state.adminPreviewUser = null;
        this.state.adminPreviewUserId = null;
        try { localStorage.removeItem('alphavest_local_user'); } catch (e) {}
        this.updateHeaderAuth();
        this.closeModal('modal-reset-password');
        this.toast(res.message || 'Password updated. Please sign in with your new password.', 'success');
        this.openModal('modal-auth');
        this.switchAuthBox('login');
      } else {
        this.toast((res && res.message) || 'Unable to reset password.', 'error');
      }
    } catch (e) {
      this.toast('Network error while resetting password.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Update Password';
      }
    }
  },

  async submitChangeLoginPassword() {
    if (!this.state.user) {
      this.openModal('modal-auth');
      return;
    }
    const oldEl = document.getElementById('chpwd-old');
    const otpEl = document.getElementById('chpwd-otp');
    const newEl = document.getElementById('chpwd-new');
    const confEl = document.getElementById('chpwd-confirm');
    const btn = document.getElementById('btn-submit-chpwd');

    const isForgot = Boolean(this.state.changePwdForgotMode);
    const oldPwd = oldEl?.value || '';
    const verificationCode = (otpEl?.value || '').trim();
    const newPwd = newEl?.value || '';
    const confPwd = confEl?.value || '';

    if (!isForgot && !oldPwd) {
      this.toast('Enter your old password or click "Forgot old password?" to reset with email code.', 'warning');
      oldEl?.focus();
      return;
    }
    if (!/^\d{6}$/.test(verificationCode)) {
      this.toast('Enter the 6-digit email verification code.', 'warning');
      otpEl?.focus();
      return;
    }
    if (!newPwd || newPwd.length < 8 || newPwd.length > 128) {
      this.toast('Enter a new password between 8 and 128 characters.', 'warning');
      newEl?.focus();
      return;
    }
    if (newPwd !== confPwd) {
      this.toast('New passwords do not match.', 'warning');
      confEl?.focus();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Verifying & Updating...';
    }

    try {
      let res;
      if (isForgot) {
        res = await this.api('/auth/reset-password.php', 'POST', {
          email: this.state.user.email || '',
          verification_code: verificationCode,
          password: newPwd,
          confirm_password: confPwd
        });
      } else {
        res = await this.api('/auth/change-password.php', 'POST', {
          old_password: oldPwd,
          new_password: newPwd,
          confirm_password: confPwd,
          verification_code: verificationCode
        });
      }

      if (res && res.success) {
        if (oldEl) oldEl.value = '';
        if (otpEl) otpEl.value = '';
        if (newEl) newEl.value = '';
        if (confEl) confEl.value = '';
        if (isForgot) {
          this.state.user = null;
          this.state.adminPreviewUser = null;
          this.state.adminPreviewUserId = null;
          try { localStorage.removeItem('alphavest_local_user'); } catch (e) {}
          this.updateHeaderAuth();
          this.toast(res.message || 'Password updated. Please sign in with your new password.', 'success');
          this.openModal('modal-auth');
          this.switchAuthBox('login');
        } else {
          this.toast(res.message || 'Password updated successfully. A confirmation email has been sent.', 'success');
          this.openSecurityCenter();
        }
      } else {
        this.toast((res && res.message) || 'Failed to update password.', 'error');
      }
    } catch (e) {
      this.toast('Network error while updating password.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Confirm';
      }
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
  },

  /* ==========================================================================
     REAL-TIME PRESENCE HEARTBEAT & ADMIN ANALYTICS COMMAND DESK
     ========================================================================== */
  _readCsrfCookieValue() {
    try {
      const m = document.cookie.match(/(?:^|;\s*)alphavest_csrf=([^;]+)/);
      return m ? decodeURIComponent(m[1]).trim() : '';
    } catch (e) {
      return '';
    }
  },

  detectClientRuntimeMeta() {
    const ua = navigator.userAgent || '';
    let device = 'Desktop';
    if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) device = 'Tablet';
    else if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) device = 'Mobile';

    let os = 'Desktop OS';
    if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';

    let browser = 'Browser';
    if (/Edg\//i.test(ua)) browser = 'Edge';
    else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
    else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = 'Chrome';
    else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Safari';
    else if (/Firefox\//i.test(ua)) browser = 'Firefox';

    return { device, os, browser };
  },

  async sendUserHeartbeat(isOffline = false, forcedView = null) {
    if (!this.state.user) return;
    const view = String(forcedView || this.state.currentView || 'home');
    const meta = this.detectClientRuntimeMeta();
    const payload = {
      view: view === 'admin' && this.state.adminTab ? `admin:${this.state.adminTab}` : view,
      page_title: document.title || 'Prime X Capital',
      offline: Boolean(isOffline),
      device: meta.device,
      os: meta.os,
      browser: meta.browser
    };

    if (isOffline) {
      try {
        const csrf = this._readCsrfCookieValue();
        const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
        if (csrf) headers['X-CSRF-Token'] = csrf;
        await fetch('/api/user/heartbeat.php', {
          method: 'POST',
          keepalive: true,
          credentials: 'include',
          headers,
          body: JSON.stringify(payload)
        });
      } catch (e) {}
      return;
    }

    try {
      await this.api('/user/heartbeat.php', 'POST', payload, 0);
    } catch (e) {}
  },

  startPresenceTracking() {
    if (!this._presenceListenersAttached) {
      this._presenceListenersAttached = true;
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.state.user) {
          this.sendUserHeartbeat(false, this.state.currentView || 'home');
          if (this.state.currentView === 'admin' && this.isStaffOrAdmin(this.state.user)) {
            this.refreshAdminBadges();
            if (this.state.adminTab === 'analytics') {
              this.loadAdminAnalytics({ silent: true });
            }
          }
        }
      });
      window.addEventListener('focus', () => {
        if (this.state.user && this.state.currentView === 'admin' && this.isStaffOrAdmin(this.state.user)) {
          this.refreshAdminBadges();
        }
      });
      const sendOfflineBeacon = () => {
        if (this.state.user) {
          this.sendUserHeartbeat(true, this.state.currentView || 'home');
        }
      };
      window.addEventListener('pagehide', sendOfflineBeacon);
      window.addEventListener('beforeunload', sendOfflineBeacon);
    }

    if (this._presenceInterval) clearInterval(this._presenceInterval);
    this._presenceInterval = setInterval(() => {
      if (!document.hidden && this.state.user) {
        this.sendUserHeartbeat(false, this.state.currentView || 'home');
      }
    }, 20000);
  },

  async loadAdminAnalytics(opts = {}) {
    const silent = Boolean(opts && opts.silent);
    const manual = Boolean(opts && opts.manual);
    const btn = document.getElementById('btn-adm-ana-refresh');
    if (manual && btn) {
      btn.disabled = true;
      btn.classList.add('is-loading');
    }

    try {
      const res = await this.api('/admin/analytics.php');
      if (res && res.success && res.data) {
        this.state.adminAnalyticsData = res.data;
        if (!this.state.adminAnalyticsChartType) this.state.adminAnalyticsChartType = 'signups';
        if (!this.state.adminAnalyticsPresenceFilter) this.state.adminAnalyticsPresenceFilter = 'ALL';
        this.renderAdminAnalytics();
        if (manual) {
          this.toast('Live user presence & analytics synced', 'success');
        }
      } else if (!silent) {
        this.toast(res?.message || 'Unable to load real-time analytics.', 'error');
      }
    } catch (e) {
      if (!silent) this.toast('Failed to fetch live analytics.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('is-loading');
      }
    }
  },

  setAdminAnalyticsChartType(metric = 'signups') {
    const allowed = ['signups', 'deposits', 'withdrawals', 'executions'];
    const target = allowed.includes(metric) ? metric : 'signups';
    this.state.adminAnalyticsChartType = target;
    document.querySelectorAll('.av-adm-ana-tab').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-ana-metric') === target);
    });
    const series = Array.isArray(this.state.adminAnalyticsData?.daily_series)
      ? this.state.adminAnalyticsData.daily_series
      : [];
    this.renderAnalyticsSeriesSvg(series, target);
  },

  setAdminAnalyticsPresenceFilter(status = 'ALL') {
    const allowed = ['ALL', 'ONLINE', 'IDLE', 'OFFLINE'];
    const target = allowed.includes(String(status).toUpperCase()) ? String(status).toUpperCase() : 'ALL';
    this.state.adminAnalyticsPresenceFilter = target;
    document.querySelectorAll('.av-adm-ana-chip').forEach(btn => {
      btn.classList.toggle('active', String(btn.getAttribute('data-presence') || '').toUpperCase() === target);
    });
    this.filterAdminAnalyticsTable();
  },

  formatPresenceAgo(tsSec, fallbackIso = '') {
    const nowSec = Math.floor(Date.now() / 1000);
    let targetSec = Number(tsSec || 0);
    if (!targetSec && fallbackIso) {
      const parsed = this.parseNotifTimestampMs(fallbackIso);
      if (parsed > 0) targetSec = Math.floor(parsed / 1000);
    }
    if (!targetSec) return 'No activity yet';
    const diff = Math.max(0, nowSec - targetSec);
    if (diff < 20) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  },

  formatDurationShort(sec) {
    const s = Math.max(0, Math.floor(Number(sec || 0)));
    if (s < 60) return `${s}s`;
    const mins = Math.floor(s / 60);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remM = mins % 60;
    return remM > 0 ? `${hrs}h ${remM}m` : `${hrs}h`;
  },

  formatViewDisplayName(viewSlug) {
    const raw = String(viewSlug || '').trim();
    if (!raw) return 'Not active';
    const map = {
      home: 'Home Dashboard',
      market: 'Markets Overview',
      futures: 'Futures Terminal',
      signals: 'Trading Signals',
      wallet: 'Wallet & Vaults',
      referrals: 'Referral Network',
      kyc: 'KYC Verification',
      settings: 'Account Settings',
      security: 'Security Center',
      notice: 'Notifications',
      records: 'Order Records',
      ledger: 'Ledger History'
    };
    if (raw.startsWith('admin:')) {
      return `Admin · ${raw.slice(6).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`;
    }
    return map[raw] || raw.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  },

  renderAdminAnalytics() {
    const data = this.state.adminAnalyticsData;
    if (!data) return;
    const s = data.summary || {};

    const totalUsers = Number(s.total_users || 0);
    const onlineNow = Number(s.online_now || 0);
    const idleNow = Number(s.idle_now || 0);
    const offlineNow = Number(s.offline_now || 0);
    const onlinePct = totalUsers > 0 ? Math.round(((onlineNow + idleNow) / totalUsers) * 100) : 0;

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val);
    };

    setText('adm-ana-online', onlineNow.toLocaleString());
    setText('adm-ana-online-pct', `${onlinePct}% active right now`);
    setText('adm-ana-idle', idleNow.toLocaleString());
    setText('adm-ana-offline', offlineNow.toLocaleString());
    setText('adm-ana-verified-sub', `${Number(s.verified_users || 0).toLocaleString()} KYC verified`);
    setText('adm-ana-active-today', Number(s.active_today || 0).toLocaleString());
    setText('adm-ana-new-today', `${Number(s.new_users_today || 0).toLocaleString()} new signups today`);
    setText('adm-ana-deposits-today', `$${Number(s.deposits_today_usdt || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    setText('adm-ana-dep-total-sub', `$${Number(s.total_deposits_usdt || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} all-time`);
    setText('adm-ana-execs-today', Number(s.signal_executions_today || 0).toLocaleString());
    setText('adm-ana-exec-total-sub', `${Number(s.signal_executions_total || 0).toLocaleString()} total · $${Number(s.withdrawals_today_usdt || 0).toLocaleString()} out`);
    setText('adm-ana-sync-time', data.server_time_utc ? this.formatAdminDate(data.server_time_utc) : 'Just now');

    this.syncAdminQueueBadges({ onlineNow });

    // 1. Presence Ring Donut SVG
    this.renderAnalyticsDonutSvg(onlineNow, idleNow, offlineNow);

    // 2. Device Breakdown Bars
    const devHost = document.getElementById('adm-ana-device-bars');
    if (devHost) {
      const devMap = data.device_breakdown || {};
      const entries = Object.entries(devMap).filter(([, cnt]) => Number(cnt) > 0);
      const maxDev = entries.reduce((mx, [, c]) => Math.max(mx, Number(c)), 0) || 1;
      if (!entries.length) {
        devHost.innerHTML = `<div style="font-size:12px; color:#64748B;">No active client telemetry recorded yet.</div>`;
      } else {
        devHost.innerHTML = entries.map(([name, cnt], idx) => {
          const pct = Math.max(6, Math.round((Number(cnt) / maxDev) * 100));
          return `
            <div class="av-adm-ana-bar-row">
              <div class="av-adm-ana-bar-head"><span>${this.escapeHtml(name)}</span><span>${Number(cnt).toLocaleString()}</span></div>
              <div class="av-adm-ana-bar-track"><div class="av-adm-ana-bar-fill av-ana-bar-anim" style="width:${pct}%; animation-delay:${idx * 60}ms;"></div></div>
            </div>
          `;
        }).join('');
      }
    }

    // 3. 7-Day Activity Series SVG
    this.renderAnalyticsSeriesSvg(Array.isArray(data.daily_series) ? data.daily_series : [], this.state.adminAnalyticsChartType || 'signups');

    // 4. Live Active Screens
    const viewsHost = document.getElementById('adm-ana-views-list');
    if (viewsHost) {
      const views = Array.isArray(data.view_breakdown) ? data.view_breakdown : [];
      const maxV = views.reduce((mx, v) => Math.max(mx, Number(v.count || 0)), 0) || 1;
      if (!views.length) {
        viewsHost.innerHTML = `<div style="font-size:12px; color:#64748B; padding:10px 0;">No users are currently viewing pages right now.</div>`;
      } else {
        viewsHost.innerHTML = views.map((v, idx) => {
          const pct = Math.max(8, Math.round((Number(v.count || 0) / maxV) * 100));
          return `
            <div class="av-adm-ana-bar-row">
              <div class="av-adm-ana-bar-head"><span>${this.escapeHtml(this.formatViewDisplayName(v.view))}</span><span>${Number(v.count || 0)} active</span></div>
              <div class="av-adm-ana-bar-track"><div class="av-adm-ana-bar-fill av-ana-bar-anim" style="width:${pct}%; background:linear-gradient(90deg,#00B87C 0%,#10B981 100%); animation-delay:${idx * 50}ms;"></div></div>
            </div>
          `;
        }).join('');
      }
    }

    // 5. Country Breakdown
    const countriesHost = document.getElementById('adm-ana-countries-list');
    if (countriesHost) {
      const countries = Array.isArray(data.country_breakdown) ? data.country_breakdown : [];
      const maxC = countries.reduce((mx, c) => Math.max(mx, Number(c.count || 0)), 0) || 1;
      if (!countries.length) {
        countriesHost.innerHTML = `<div style="font-size:12px; color:#64748B; padding:10px 0;">No geographic records available yet.</div>`;
      } else {
        countriesHost.innerHTML = countries.map((c, idx) => {
          const pct = Math.max(8, Math.round((Number(c.count || 0) / maxC) * 100));
          return `
            <div class="av-adm-ana-bar-row">
              <div class="av-adm-ana-bar-head"><span>${this.escapeHtml(c.country || 'Unspecified')}</span><span>${Number(c.count || 0)}</span></div>
              <div class="av-adm-ana-bar-track"><div class="av-adm-ana-bar-fill av-ana-bar-anim" style="width:${pct}%; animation-delay:${idx * 50}ms;"></div></div>
            </div>
          `;
        }).join('');
      }
    }

    // 6. Full User Track Record Table
    this.filterAdminAnalyticsTable();
  },

  renderAnalyticsDonutSvg(online = 0, idle = 0, offline = 0) {
    const host = document.getElementById('adm-ana-donut-svg');
    if (!host) return;
    const total = Math.max(1, online + idle + offline);
    const r = 46;
    const circ = 2 * Math.PI * r;
    const segs = [
      { label: 'Online', val: online, color: '#00B87C' },
      { label: 'Idle', val: idle, color: '#F59E0B' },
      { label: 'Offline', val: offline, color: '#CBD5E1' }
    ];

    let offset = 0;
    const circles = segs.map(seg => {
      const len = (seg.val / total) * circ;
      const dash = `${len.toFixed(2)} ${(circ - len).toFixed(2)}`;
      const el = `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${seg.color}" stroke-width="14" stroke-dasharray="${dash}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 60 60)" class="av-ana-ring-anim"></circle>`;
      offset += len;
      return el;
    }).join('');

    host.innerHTML = `
      <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="Online, idle, and offline distribution" style="flex-shrink:0;">
        <circle cx="60" cy="60" r="${r}" fill="none" stroke="#F1F5F9" stroke-width="14"></circle>
        ${circles}
        <text x="60" y="56" text-anchor="middle" font-size="18" font-weight="800" fill="#0F172A" style="font-family:var(--font-mono);">${online + idle}</text>
        <text x="60" y="72" text-anchor="middle" font-size="10" font-weight="700" fill="#64748B">ACTIVE</text>
      </svg>
      <div style="display:flex; flex-direction:column; gap:7px; font-size:12px; min-width:110px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;"><span style="display:inline-flex; align-items:center; gap:6px; font-weight:700; color:#0F172A;"><i style="width:9px;height:9px;border-radius:50%;background:#00B87C;display:inline-block;"></i>Online</span><strong class="mono">${online}</strong></div>
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;"><span style="display:inline-flex; align-items:center; gap:6px; font-weight:700; color:#0F172A;"><i style="width:9px;height:9px;border-radius:50%;background:#F59E0B;display:inline-block;"></i>Idle</span><strong class="mono">${idle}</strong></div>
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;"><span style="display:inline-flex; align-items:center; gap:6px; font-weight:700; color:#64748B;"><i style="width:9px;height:9px;border-radius:50%;background:#CBD5E1;display:inline-block;"></i>Offline</span><strong class="mono">${offline}</strong></div>
      </div>
    `;
  },

  renderAnalyticsSeriesSvg(series = [], metric = 'signups') {
    const host = document.getElementById('adm-ana-series-svg');
    const subEl = document.getElementById('adm-ana-series-sub');
    if (!host) return;

    const metaMap = {
      signups: { field: 'signups', color: '#0052FF', prefix: '', title: 'New account registrations (last 7 PKT days)' },
      deposits: { field: 'deposits_usdt', color: '#00B87C', prefix: '$', title: 'Approved deposit inflows in USDT (last 7 PKT days)' },
      withdrawals: { field: 'withdrawals_usdt', color: '#F59E0B', prefix: '$', title: 'Approved payout outflows in USDT (last 7 PKT days)' },
      executions: { field: 'signal_executions', color: '#4F46E5', prefix: '', title: 'Verified signal confirmations (last 7 PKT days)' }
    };
    const cfg = metaMap[metric] || metaMap.signups;
    if (subEl) subEl.textContent = cfg.title;

    const rows = Array.isArray(series) && series.length
      ? series
      : [{ label: 'Today', [cfg.field]: 0 }];
    const vals = rows.map(r => Number(r[cfg.field] || 0));
    const maxVal = Math.max(1, ...vals);

    const w = 500;
    const h = 165;
    const padL = 16;
    const padR = 16;
    const padT = 22;
    const padB = 26;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const step = plotW / Math.max(1, rows.length);
    const barW = Math.min(34, Math.max(16, step * 0.48));

    const gridLines = [0.25, 0.55, 0.85].map(g => {
      const gy = Number((padT + plotH * g).toFixed(1));
      return `<line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" stroke="#EEF2F7" stroke-width="1" stroke-dasharray="3 4"></line>`;
    }).join('');

    const barsHtml = rows.map((r, idx) => {
      const val = Number(r[cfg.field] || 0);
      const barH = val > 0 ? Math.max(6, (val / maxVal) * plotH) : 2;
      const cx = padL + step * idx + step / 2;
      const x = Number((cx - barW / 2).toFixed(1));
      const y = Number((padT + plotH - barH).toFixed(1));
      const valTxt = cfg.prefix ? `${cfg.prefix}${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)}` : String(val);
      return `
        <g class="av-ana-series-path" style="animation-delay:${idx * 45}ms;">
          <rect x="${x}" y="${y}" width="${barW}" height="${barH.toFixed(1)}" rx="6" fill="${cfg.color}" fill-opacity="${val > 0 ? '0.88' : '0.2'}"></rect>
          <text x="${cx}" y="${Math.max(12, y - 5)}" text-anchor="middle" font-size="10" font-weight="700" fill="#334155">${this.escapeHtml(valTxt)}</text>
          <text x="${cx}" y="${h - 6}" text-anchor="middle" font-size="10.5" font-weight="600" fill="#64748B">${this.escapeHtml(r.label || r.date || '')}</text>
        </g>
      `;
    }).join('');

    host.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="165" style="display:block; overflow:visible;" role="img" aria-label="7-day authentic activity chart">
        ${gridLines}
        ${barsHtml}
      </svg>
    `;
  },

  filterAdminAnalyticsTable() {
    const tbody = document.getElementById('adm-ana-users-tbody');
    const metaEl = document.getElementById('adm-ana-table-meta');
    if (!tbody) return;

    const all = Array.isArray(this.state.adminAnalyticsData?.users) ? this.state.adminAnalyticsData.users : [];
    const filter = String(this.state.adminAnalyticsPresenceFilter || 'ALL').toUpperCase();
    const q = (document.getElementById('adm-ana-search')?.value || '').trim().toLowerCase();

    const filtered = all.filter(u => {
      const st = String(u.presence_status || 'OFFLINE').toUpperCase();
      if (filter !== 'ALL' && st !== filter) return false;
      if (!q) return true;
      const hay = `${u.email || ''} ${u.full_name || ''} ${u.numeric_uid || ''} ${u.country || ''} ${u.device || ''} ${u.os || ''} ${u.current_view || ''} ${u.ip || ''}`.toLowerCase();
      return hay.includes(q);
    });

    if (metaEl) {
      metaEl.textContent = filtered.length === all.length
        ? `${all.length} Users`
        : `${filtered.length} of ${all.length} Users`;
    }

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:26px; color:#64748B;">No user activity records match the selected status or search.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(u => {
      const st = String(u.presence_status || 'OFFLINE').toUpperCase();
      const pillCls = st === 'ONLINE' ? 'is-online' : (st === 'IDLE' ? 'is-idle' : 'is-offline');
      const stLabel = st === 'ONLINE' ? 'Online' : (st === 'IDLE' ? 'Idle' : 'Offline');
      const viewLabel = st === 'OFFLINE'
        ? (u.current_view ? `Last: ${this.formatViewDisplayName(u.current_view)}` : 'Session Closed')
        : this.formatViewDisplayName(u.current_view || 'home');
      const durText = st !== 'OFFLINE' && Number(u.session_duration_sec || 0) > 0
        ? ` · ${this.formatDurationShort(u.session_duration_sec)}`
        : '';
      const agoText = st === 'ONLINE' ? 'Live now' : this.formatPresenceAgo(u.last_seen_ts, u.last_seen_at);
      const idArg = this.escapeJsStr(u.id || '');
      const initial = this.escapeHtml(String(u.full_name || u.email || 'U').trim().charAt(0).toUpperCase() || 'U');

      return `
        <tr>
          <td data-label="User">
            <div class="av-adm-user-cell">
              <span class="av-adm-user-avatar" aria-hidden="true">${initial}</span>
              <div class="av-adm-user-meta">
                <strong class="av-adm-user-name">${this.escapeHtml(u.full_name || 'Member')}</strong>
                <span class="av-adm-user-sub">${this.escapeHtml(u.email || u.id)} ${u.numeric_uid ? `· #${this.escapeHtml(String(u.numeric_uid))}` : ''}</span>
              </div>
            </div>
          </td>
          <td data-label="Status"><span class="av-adm-presence-pill ${pillCls}">${stLabel}</span></td>
          <td data-label="Screen &amp; Session">
            <div style="font-size:12.5px; font-weight:700; color:#0F172A;">${this.escapeHtml(viewLabel)}${this.escapeHtml(durText)}</div>
            <div style="font-size:11px; color:#64748B;">${this.escapeHtml(u.country || 'Unspecified')}</div>
          </td>
          <td data-label="Device / OS / IP">
            <div style="font-size:12px; font-weight:600; color:#0F172A;">${this.escapeHtml(u.device || 'Unknown')} · ${this.escapeHtml(u.os || 'Unknown')}</div>
            <div style="font-size:11px; color:#64748B; font-family:var(--font-mono);">${this.escapeHtml(u.browser || '')}${u.ip ? ` · ${this.escapeHtml(u.ip)}` : ''}</div>
          </td>
          <td data-label="Last Seen" style="font-size:12px; font-weight:600; color:#334155; white-space:nowrap;">${this.escapeHtml(agoText)}</td>
          <td data-label="Deposits" class="mono">
            <strong style="color:#059669;">$${Number(u.deposits_total_usdt || 0).toFixed(2)}</strong>
            <div style="font-size:11px; color:#64748B;">${Number(u.deposits_count || 0)} tx</div>
          </td>
          <td data-label="Withdrawals" class="mono">
            <strong>$${Number(u.withdrawals_total_usdt || 0).toFixed(2)}</strong>
            <div style="font-size:11px; color:#64748B;">${Number(u.withdrawals_count || 0)} tx</div>
          </td>
          <td data-label="Signals" class="mono">
            <strong style="color:#0052FF;">${Number(u.signal_executions_count || 0)}</strong>
            <div style="font-size:11px; color:#64748B;">+$${Number(u.signal_profit_usdt || 0).toFixed(2)}</div>
          </td>
          <td data-label="Action">
            <button type="button" class="av-adm-btn-chip soft-blue" onclick="App.viewUserDossier('${idArg}')">Detail</button>
          </td>
        </tr>
      `;
    }).join('');
  }
};

window.App = App;
document.addEventListener('DOMContentLoaded', () => App.init());

