<?php
/**
 * Market Order Book Endpoint
 * Supports Crypto, Forex, Futures, and Stocks pairs.
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$symbol = strtoupper(trim((string)($_GET['symbol'] ?? 'BTC/USDT')));
$pairMap = [
    'EUR/USD'   => 1.0845,
    'EUR/USDT'  => 1.0845,
    'GBP/USD'   => 1.2712,
    'USD/JPY'   => 152.38,
    'USD/CHF'   => 0.8814,
    'AUD/USD'   => 0.6542,
    'EUR/GBP'   => 0.8531,
    'GOLD/USD'  => 2748.33,
    'GOLD/USDT' => 2748.33,
    'OIL/USD'   => 74.82,
    'OIL/USDT'  => 74.82,
    'NGAS/USD'  => 2.84,
    'NGAS/USDT' => 2.84,
    'ES1/USD'   => 5984.50,
    'NQ1/USD'   => 21142.00,
    'SILVER/USD'=> 33.42,
    'AAPL/USD'  => 229.40,
    'NVDA/USD'  => 141.60,
    'TSLA/USD'  => 342.15,
    'MSFT/USD'  => 428.70,
    'AMZN/USD'  => 209.85,
    'GOOGL/USD' => 178.30
];
$priceMap = [
    'BTC' => 77915.82,
    'ETH' => 2514.43,
    'SOL' => 101.84,
    'BNB' => 723.07,
    'XRP' => 1.4001,
    'XNO' => 0.3510,
    'APE' => 0.1334,
    'APT' => 0.5910,
    'AAVE' => 127.04,
    'DOGE' => 0.1842,
    'ADA' => 0.6840,
    'AVAX' => 28.45,
    'DOT' => 6.42,
    'LINK' => 15.85,
    'LTC' => 84.20,
    'MATIC' => 0.4820,
    'POL' => 0.4820,
    'GOLD' => 2748.33,
    'SILVER' => 33.42,
    'OIL' => 74.82,
    'NGAS' => 2.84,
    'ES1' => 5984.50,
    'NQ1' => 21142.00,
    'EUR' => 1.0845,
    'GBP' => 1.2712,
    'AUD' => 0.6542,
    'USD' => 152.38,
    'AAPL' => 229.40,
    'TSLA' => 342.15,
    'NVDA' => 141.60,
    'MSFT' => 428.70,
    'AMZN' => 209.85,
    'GOOGL' => 178.30
];

$baseAsset = explode('/', $symbol)[0] ?: 'BTC';
$mid = $pairMap[$symbol] ?? ($priceMap[$baseAsset] ?? 125.50);
$decimals = $mid >= 1000 ? 2 : ($mid >= 10 ? 2 : ($mid >= 1 ? 4 : ($mid >= 0.01 ? 5 : 6)));

$bids = [];
$asks = [];
for ($i = 1; $i <= 10; $i++) {
    $bids[] = [round($mid * (1 - ($i * 0.0003)), $decimals), round(mt_rand(10, 150) / 100, 4)];
    $asks[] = [round($mid * (1 + ($i * 0.0003)), $decimals), round(mt_rand(10, 150) / 100, 4)];
}

sendSuccess(['bids' => $bids, 'asks' => $asks, 'symbol' => $symbol], 'Order book loaded');
