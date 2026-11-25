<?php
require_once dirname(__DIR__) . '/bootstrap.php';

$baseTickers = [
    // CRYPTO
    ['symbol' => 'BTC/USDT',  'base' => 'BTC',  'quote' => 'USDT', 'name' => 'Bitcoin',       'category' => 'CRYPTO',  'price' => 77915.82, 'change_24h' => 1.63,  'halt' => false, 'volume_24h' => 142000000],
    ['symbol' => 'ETH/USDT',  'base' => 'ETH',  'quote' => 'USDT', 'name' => 'Ethereum',      'category' => 'CRYPTO',  'price' => 2514.43,  'change_24h' => 1.58,  'halt' => false, 'volume_24h' => 98000000],
    ['symbol' => 'SOL/USDT',  'base' => 'SOL',  'quote' => 'USDT', 'name' => 'Solana',        'category' => 'CRYPTO',  'price' => 101.84,   'change_24h' => 2.35,  'halt' => false, 'volume_24h' => 88400000],
    ['symbol' => 'BNB/USDT',  'base' => 'BNB',  'quote' => 'USDT', 'name' => 'BNB',           'category' => 'CRYPTO',  'price' => 723.07,   'change_24h' => 1.15,  'halt' => false, 'volume_24h' => 53100000],
    ['symbol' => 'XRP/USDT',  'base' => 'XRP',  'quote' => 'USDT', 'name' => 'Ripple',        'category' => 'CRYPTO',  'price' => 1.4001,   'change_24h' => 4.58,  'halt' => false, 'volume_24h' => 64200000],
    ['symbol' => 'DOGE/USDT', 'base' => 'DOGE', 'quote' => 'USDT', 'name' => 'Dogecoin',      'category' => 'CRYPTO',  'price' => 0.1842,   'change_24h' => 3.12,  'halt' => false, 'volume_24h' => 41500000],
    ['symbol' => 'ADA/USDT',  'base' => 'ADA',  'quote' => 'USDT', 'name' => 'Cardano',       'category' => 'CRYPTO',  'price' => 0.6840,   'change_24h' => -1.18, 'halt' => false, 'volume_24h' => 29400000],
    ['symbol' => 'AVAX/USDT', 'base' => 'AVAX', 'quote' => 'USDT', 'name' => 'Avalanche',     'category' => 'CRYPTO',  'price' => 28.45,    'change_24h' => 2.04,  'halt' => false, 'volume_24h' => 24600000],
    ['symbol' => 'LINK/USDT', 'base' => 'LINK', 'quote' => 'USDT', 'name' => 'Chainlink',     'category' => 'CRYPTO',  'price' => 15.85,    'change_24h' => 1.92,  'halt' => false, 'volume_24h' => 21300000],
    ['symbol' => 'AAVE/USDT', 'base' => 'AAVE', 'quote' => 'USDT', 'name' => 'Aave',          'category' => 'CRYPTO',  'price' => 127.04,   'change_24h' => 2.28,  'halt' => false, 'volume_24h' => 22100000],
    ['symbol' => 'APE/USDT',  'base' => 'APE',  'quote' => 'USDT', 'name' => 'ApeCoin',       'category' => 'CRYPTO',  'price' => 0.1334,   'change_24h' => -0.74, 'halt' => false, 'volume_24h' => 9820000],
    ['symbol' => 'APT/USDT',  'base' => 'APT',  'quote' => 'USDT', 'name' => 'Aptos',         'category' => 'CRYPTO',  'price' => 0.5910,   'change_24h' => 1.37,  'halt' => false, 'volume_24h' => 14500000],

    // FOREX
    ['symbol' => 'EUR/USD',   'base' => 'EUR',  'quote' => 'USD',  'name' => 'Euro / US Dollar',        'category' => 'FOREX', 'price' => 1.0845, 'change_24h' => 0.32,  'halt' => false, 'volume_24h' => 51200000],
    ['symbol' => 'GBP/USD',   'base' => 'GBP',  'quote' => 'USD',  'name' => 'British Pound / USD',     'category' => 'FOREX', 'price' => 1.2712, 'change_24h' => -0.18, 'halt' => false, 'volume_24h' => 39400000],
    ['symbol' => 'USD/JPY',   'base' => 'USD',  'quote' => 'JPY',  'name' => 'US Dollar / Yen',         'category' => 'FOREX', 'price' => 152.38, 'change_24h' => 0.45,  'halt' => false, 'volume_24h' => 42800000],
    ['symbol' => 'USD/CHF',   'base' => 'USD',  'quote' => 'CHF',  'name' => 'US Dollar / Swiss Franc', 'category' => 'FOREX', 'price' => 0.8814, 'change_24h' => -0.14, 'halt' => false, 'volume_24h' => 28600000],
    ['symbol' => 'AUD/USD',   'base' => 'AUD',  'quote' => 'USD',  'name' => 'Australian Dollar / USD', 'category' => 'FOREX', 'price' => 0.6542, 'change_24h' => 0.27,  'halt' => false, 'volume_24h' => 26100000],
    ['symbol' => 'EUR/GBP',   'base' => 'EUR',  'quote' => 'GBP',  'name' => 'Euro / British Pound',    'category' => 'FOREX', 'price' => 0.8531, 'change_24h' => 0.19,  'halt' => false, 'volume_24h' => 22900000],

    // FUTURES & COMMODITIES
    ['symbol' => 'GOLD/USD',   'base' => 'GOLD',   'quote' => 'USD', 'name' => 'Gold Spot Futures',      'category' => 'FUTURES', 'price' => 2748.33, 'change_24h' => 0.68,  'halt' => false, 'volume_24h' => 68200000],
    ['symbol' => 'OIL/USD',    'base' => 'OIL',    'quote' => 'USD', 'name' => 'WTI Crude Oil Futures',  'category' => 'FUTURES', 'price' => 74.82,   'change_24h' => 1.85,  'halt' => false, 'volume_24h' => 45700000],
    ['symbol' => 'NGAS/USD',   'base' => 'NGAS',   'quote' => 'USD', 'name' => 'Natural Gas Futures',    'category' => 'FUTURES', 'price' => 2.84,    'change_24h' => -0.92, 'halt' => false, 'volume_24h' => 19800000],
    ['symbol' => 'ES1/USD',    'base' => 'ES1',    'quote' => 'USD', 'name' => 'S&P 500 E-Mini Futures', 'category' => 'FUTURES', 'price' => 5984.50, 'change_24h' => 0.84,  'halt' => false, 'volume_24h' => 74000000],
    ['symbol' => 'NQ1/USD',    'base' => 'NQ1',    'quote' => 'USD', 'name' => 'Nasdaq 100 Futures',     'category' => 'FUTURES', 'price' => 21142.00,'change_24h' => 1.12,  'halt' => false, 'volume_24h' => 69500000],
    ['symbol' => 'SILVER/USD', 'base' => 'SILVER', 'quote' => 'USD', 'name' => 'Silver Futures',         'category' => 'FUTURES', 'price' => 33.42,   'change_24h' => 1.04,  'halt' => false, 'volume_24h' => 24300000],

    // STOCKS
    ['symbol' => 'AAPL/USD',  'base' => 'AAPL',  'quote' => 'USD', 'name' => 'Apple Inc.',     'category' => 'STOCKS', 'price' => 229.40, 'change_24h' => 1.24,  'halt' => false, 'volume_24h' => 61500000],
    ['symbol' => 'NVDA/USD',  'base' => 'NVDA',  'quote' => 'USD', 'name' => 'NVIDIA Corp.',   'category' => 'STOCKS', 'price' => 141.60, 'change_24h' => 3.42,  'halt' => false, 'volume_24h' => 94600000],
    ['symbol' => 'TSLA/USD',  'base' => 'TSLA',  'quote' => 'USD', 'name' => 'Tesla Inc.',     'category' => 'STOCKS', 'price' => 342.15, 'change_24h' => 2.87,  'halt' => false, 'volume_24h' => 82300000],
    ['symbol' => 'MSFT/USD',  'base' => 'MSFT',  'quote' => 'USD', 'name' => 'Microsoft Corp.','category' => 'STOCKS', 'price' => 428.70, 'change_24h' => 0.94,  'halt' => false, 'volume_24h' => 48200000],
    ['symbol' => 'AMZN/USD',  'base' => 'AMZN',  'quote' => 'USD', 'name' => 'Amazon.com Inc.','category' => 'STOCKS', 'price' => 209.85, 'change_24h' => 1.56,  'halt' => false, 'volume_24h' => 54900000],
    ['symbol' => 'GOOGL/USD', 'base' => 'GOOGL', 'quote' => 'USD', 'name' => 'Alphabet Inc.',  'category' => 'STOCKS', 'price' => 178.30, 'change_24h' => -0.46, 'halt' => false, 'volume_24h' => 39700000]
];

$nowBucket = (int)floor(time() / 3);
$liveTickers = [];
foreach ($baseTickers as $t) {
    $hash = crc32($t['symbol']);
    $phase = ($nowBucket * 0.45) + ($hash % 97);
    $jitterScale = ($t['category'] === 'FOREX') ? 0.00045 : 0.0018;
    $deltaRatio = (sin($phase) * 0.65 + cos($phase * 0.37) * 0.35) * $jitterScale;
    $basePrice = (float)$t['price'];
    $dec = $basePrice >= 1000 ? 2 : ($basePrice >= 10 ? 2 : 4);
    $livePrice = round(max(0.0001, $basePrice * (1.0 + $deltaRatio)), $dec);
    $chg = round((float)$t['change_24h'] + ($deltaRatio * 100), 2);
    $t['price'] = $livePrice;
    $t['change_24h'] = $chg;
    $t['high_24h'] = round($livePrice * ($t['category'] === 'FOREX' ? 1.004 : 1.024), $dec);
    $t['low_24h'] = round($livePrice * ($t['category'] === 'FOREX' ? 0.996 : 0.976), $dec);
    $liveTickers[] = $t;
}

sendSuccess([
    'tickers' => $liveTickers,
    'categories' => ['CRYPTO', 'FOREX', 'FUTURES', 'STOCKS', 'SELF SERVICE', 'ALL'],
    'timestamp' => time()
], 'Market tickers loaded');
