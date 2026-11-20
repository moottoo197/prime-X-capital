<?php
/**
 * Market Order Book Endpoint
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$symbol = strtoupper(trim((string)($_GET['symbol'] ?? 'BTC/USDT')));
$priceMap = [
    'BTC' => 77915.82,
    'ETH' => 2514.43,
    'SOL' => 101.84,
    'BNB' => 723.07,
    'XRP' => 1.4001,
    'XNO' => 0.3510,
    'APE' => 0.1370,
    'APT' => 0.6160,
    'AAVE' => 127.04,
    'DOGE' => 0.1842,
    'ADA' => 0.6840,
    'AVAX' => 28.45,
    'DOT' => 6.42,
    'LINK' => 15.85,
    'LTC' => 84.20,
    'MATIC' => 0.4820,
    'POL' => 0.4820,
    'GOLD' => 4348.33,
    'OIL' => 74.82,
    'NGAS' => 2.80,
    'ES1' => 5984.50,
    'EUR' => 1.0845,
    'GBP' => 1.2712,
    'USD' => 152.38,
    'AAPL' => 229.40,
    'TSLA' => 342.15,
    'NVDA' => 141.60
];

$baseAsset = explode('/', $symbol)[0] ?: 'BTC';
$mid = $priceMap[$baseAsset] ?? 125.50;
$decimals = $mid >= 1000 ? 2 : ($mid >= 1 ? 4 : ($mid >= 0.01 ? 5 : 6));

$bids = [];
$asks = [];
for ($i = 1; $i <= 10; $i++) {
    $bids[] = [round($mid * (1 - ($i * 0.0003)), $decimals), round(mt_rand(10, 150) / 100, 4)];
    $asks[] = [round($mid * (1 + ($i * 0.0003)), $decimals), round(mt_rand(10, 150) / 100, 4)];
}

sendSuccess(['bids' => $bids, 'asks' => $asks, 'symbol' => $symbol], 'Order book loaded');
