<?php
namespace Alphavest\Providers;

interface PaymentProviderInterface {
    public function generateDepositAddress(string $asset, string $network, string $userId): array;
    public function verifyDepositTransaction(string $txHash, string $asset, string $network): ?array;
    public function submitWithdrawal(string $asset, string $network, string $destination, float $amount, string $referenceId): array;
    public function getWithdrawalStatus(string $providerTxId): string;
}

interface TradingProviderInterface {
    public function executeOrder(string $symbol, string $side, string $orderType, float $quantity, ?float $price, int $leverage): array;
    public function cancelOrder(string $providerOrderId): bool;
    public function getOpenPositions(string $accountId): array;
    public function closePosition(string $symbol, string $positionId): array;
}

interface MarketDataProviderInterface {
    public function getTickers(): array;
    public function getKlines(string $symbol, string $interval = '1h', int $limit = 100): array;
    public function getOrderBook(string $symbol, int $limit = 20): array;
}

interface KycProviderInterface {
    public function storeDocument(string $userId, string $docType, array $fileData): string;
    public function verifyDocument(string $docId): array;
}

interface EmailProviderInterface {
    public function sendEmail(string $to, string $subject, string $htmlBody): bool;
}
