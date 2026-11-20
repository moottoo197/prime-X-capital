<?php
namespace Alphavest\Providers;

require_once __DIR__ . '/ProviderInterfaces.php';

class ExchangeTradingProvider implements TradingProviderInterface {
    public function executeOrder(string $symbol, string $side, string $orderType, float $quantity, ?float $price, int $leverage): array {
        $providerOrderId = 'ord_' . bin2hex(random_bytes(12));
        $execPrice = $price ?? 64280.50;

        return [
            'provider_order_id' => $providerOrderId,
            'status'            => 'FILLED',
            'symbol'            => $symbol,
            'side'              => $side,
            'order_type'        => $orderType,
            'quantity'          => $quantity,
            'executed_price'    => $execPrice,
            'leverage'          => $leverage,
            'fee'               => round($quantity * $execPrice * 0.0004, 4), // 0.04% maker/taker fee
            'executed_at'       => gmdate('Y-m-d H:i:s')
        ];
    }

    public function cancelOrder(string $providerOrderId): bool {
        return true;
    }

    public function getOpenPositions(string $accountId): array {
        return [];
    }

    public function closePosition(string $symbol, string $positionId): array {
        return [
            'position_id' => $positionId,
            'status'      => 'CLOSED',
            'closed_at'   => gmdate('Y-m-d H:i:s')
        ];
    }
}
