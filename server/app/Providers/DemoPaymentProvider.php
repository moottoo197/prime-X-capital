<?php
namespace Alphavest\Providers;

require_once __DIR__ . '/ProviderInterfaces.php';

class DemoPaymentProvider implements PaymentProviderInterface {
    public function generateDepositAddress(string $asset, string $network, string $userId): array {
        // Deterministic address generation for demo/custody routing
        $prefix = match(strtoupper($network)) {
            'TRC20'   => 'TX',
            'ERC20', 'BEP20' => '0x',
            'SOLANA'  => 'Sol',
            'BITCOIN' => 'bc1q',
            default   => '0x'
        };

        $hash = substr(hash('sha256', $userId . $asset . $network . 'alphavest_salt'), 0, 36);
        $address = $prefix . $hash;

        return [
            'asset'              => $asset,
            'network'            => $network,
            'address'            => $address,
            'memo'               => in_array($asset, ['XRP', 'EOS', 'BNB']) ? substr(crc32($userId), 0, 6) : null,
            'minimum_deposit'    => match($asset) {
                'USDT', 'USDC' => 10.0,
                'BTC'          => 0.0005,
                'ETH'          => 0.01,
                'SOL'          => 0.1,
                default        => 5.0
            },
            'confirmations_req'  => match($network) {
                'TRC20' => 1,
                'ERC20' => 12,
                'BEP20' => 15,
                default => 10
            }
        ];
    }

    public function verifyDepositTransaction(string $txHash, string $asset, string $network): ?array {
        return [
            'tx_hash'       => $txHash,
            'status'        => 'COMPLETED',
            'confirmations' => 15,
            'block_time'    => gmdate('Y-m-d H:i:s')
        ];
    }

    public function submitWithdrawal(string $asset, string $network, string $destination, float $amount, string $referenceId): array {
        $providerTxId = 'tx_' . bin2hex(random_bytes(16));
        return [
            'provider_tx_id' => $providerTxId,
            'status'         => 'PROCESSING',
            'network_fee'    => match($network) {
                'TRC20'   => 1.0,
                'ERC20'   => 5.0,
                'BEP20'   => 0.5,
                'SOLANA'  => 0.1,
                default   => 1.0
            }
        ];
    }

    public function getWithdrawalStatus(string $providerTxId): string {
        return 'COMPLETED';
    }
}
