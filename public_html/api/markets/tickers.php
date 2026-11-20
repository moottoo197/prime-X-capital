<?php
require_once dirname(__DIR__) . '/bootstrap.php';

$defaultTickers = [
    ['symbol' => 'BTC/USDT', 'base' => 'BTC', 'quote' => 'USDT', 'price' => 77915.82, 'change_24h' => 1.63, 'halt' => false, 'volume_24h' => 142000000],
    ['symbol' => 'ETH/USDT', 'base' => 'ETH', 'quote' => 'USDT', 'price' => 2514.43, 'change_24h' => 1.58, 'halt' => false, 'volume_24h' => 98000000],
    ['symbol' => 'SOL/USDT', 'base' => 'SOL', 'quote' => 'USDT', 'price' => 101.84, 'change_24h' => 2.35, 'halt' => false, 'volume_24h' => 88400000],
    ['symbol' => 'BNB/USDT', 'base' => 'BNB', 'quote' => 'USDT', 'price' => 723.07, 'change_24h' => 1.15, 'halt' => false, 'volume_24h' => 53100000],
    ['symbol' => 'XRP/USDT', 'base' => 'XRP', 'quote' => 'USDT', 'price' => 1.4001, 'change_24h' => 4.58, 'halt' => false, 'volume_24h' => 64200000],
    ['symbol' => 'GOLD/USDT', 'base' => 'GOLD', 'quote' => 'USDT', 'price' => 4348.33, 'change_24h' => 0.0, 'halt' => true, 'volume_24h' => 45200000],
    ['symbol' => 'NGAS/USDT', 'base' => 'NGAS', 'quote' => 'USDT', 'price' => 2.80, 'change_24h' => 0.0, 'halt' => true, 'volume_24h' => 12800000],
    ['symbol' => 'APE/USDT', 'base' => 'APE', 'quote' => 'USDT', 'price' => 0.1334, 'change_24h' => -0.74, 'halt' => false, 'volume_24h' => 9820000],
    ['symbol' => 'APT/USDT', 'base' => 'APT', 'quote' => 'USDT', 'price' => 0.5910, 'change_24h' => 1.37, 'halt' => false, 'volume_24h' => 14500000],
    ['symbol' => 'EUR/USDT', 'base' => 'EUR', 'quote' => 'USDT', 'price' => 1.1545, 'change_24h' => -0.43, 'halt' => false, 'volume_24h' => 31200000],
    ['symbol' => 'AAVE/USDT', 'base' => 'AAVE', 'quote' => 'USDT', 'price' => 127.04, 'change_24h' => 2.28, 'halt' => false, 'volume_24h' => 22100000]
];

sendSuccess([
    'tickers' => $defaultTickers,
    'categories' => ['HOT', 'SELF SERVICE', 'OPTIONS', 'ALL'],
    'timestamp' => time()
], 'Market tickers loaded');
