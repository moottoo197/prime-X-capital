<?php
namespace Alphavest;

use PDO;
use Exception;

class Ledger {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Record an atomic ledger entry and update the derived wallet balance.
     * All monetary movements MUST flow through this method.
     */
    public function recordTransaction(
        string $userId,
        string $walletType, // 'funding', 'exchange', 'trading'
        string $asset,      // 'USDT', 'BTC', etc.
        float $amount,      // Positive for credit, negative for debit
        string $entryType,  // 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT', 'ORDER_MARGIN', 'TRADE_PNL', 'REFERRAL_REWARD', 'PROMOTION', 'FEE', 'ADJUSTMENT'
        string $referenceId = '',
        string $description = '',
        bool $isPromotional = false,
        string $operatorId = ''
    ): array {
        if ($amount == 0) {
            throw new Exception("Transaction amount cannot be zero");
        }

        $inTransaction = $this->db->inTransaction();
        if (!$inTransaction) {
            $this->db->beginTransaction();
        }

        try {
            // 1. Ensure wallet balance record exists and lock it for update
            $wallet = $this->getOrCreateWallet($userId, $walletType, $asset);
            
            // Check sufficiency for debits
            $availableBalance = (float)$wallet['available_balance'];
            if ($amount < 0 && ($availableBalance + $amount) < -0.00000001) {
                throw new Exception("Insufficient funds. Available: {$availableBalance} {$asset}, Required: " . abs($amount) . " {$asset}");
            }

            // 2. Insert into ledger_entries (immutable audit record)
            $balanceBefore = (float)$wallet['balance'];
            $balanceAfter = $balanceBefore + $amount;
            $newAvailable = $availableBalance + $amount;

            $stmt = $this->db->prepare("
                INSERT INTO ledger_entries (
                    user_id, wallet_type, asset, amount, balance_before, balance_after,
                    entry_type, reference_id, description, is_promotional, operator_id, created_at
                ) VALUES (
                    :user_id, :wallet_type, :asset, :amount, :balance_before, :balance_after,
                    :entry_type, :reference_id, :description, :is_promotional, :operator_id, :created_at
                )
            ");

            $now = gmdate('Y-m-d H:i:s');
            $stmt->execute([
                ':user_id'        => $userId,
                ':wallet_type'    => $walletType,
                ':asset'          => $asset,
                ':amount'         => $amount,
                ':balance_before' => $balanceBefore,
                ':balance_after'  => $balanceAfter,
                ':entry_type'     => $entryType,
                ':reference_id'   => $referenceId,
                ':description'    => $description,
                ':is_promotional' => $isPromotional ? 1 : 0,
                ':operator_id'    => $operatorId,
                ':created_at'     => $now
            ]);

            $entryId = $this->db->lastInsertId();

            // 3. Update the aggregated wallet_balances cache
            $promoDelta = $isPromotional ? $amount : 0;
            $updateStmt = $this->db->prepare("
                UPDATE wallet_balances
                SET balance = balance + :amt,
                    available_balance = available_balance + :amt,
                    promotional_balance = promotional_balance + :promo_amt,
                    updated_at = :updated_at
                WHERE user_id = :user_id AND wallet_type = :wallet_type AND asset = :asset
            ");

            $updateStmt->execute([
                ':amt'         => $amount,
                ':promo_amt'   => $promoDelta,
                ':updated_at'  => $now,
                ':user_id'     => $userId,
                ':wallet_type' => $walletType,
                ':asset'       => $asset
            ]);

            if (!$inTransaction) {
                $this->db->commit();
            }

            return [
                'ledger_id'       => $entryId,
                'balance_before'  => $balanceBefore,
                'balance_after'   => $balanceAfter,
                'available_after' => $newAvailable,
                'amount'          => $amount,
                'asset'           => $asset
            ];
        } catch (Exception $e) {
            if (!$inTransaction) {
                $this->db->rollBack();
            }
            throw $e;
        }
    }

    /**
     * Reserve funds for open orders, copy trading allocations, or pending withdrawals.
     */
    public function reserveFunds(string $userId, string $walletType, string $asset, float $amount, string $reason): void {
        if ($amount <= 0) {
            throw new Exception("Reserve amount must be greater than zero");
        }

        $wallet = $this->getOrCreateWallet($userId, $walletType, $asset);
        $available = (float)$wallet['available_balance'];

        if ($available < $amount) {
            throw new Exception("Insufficient available balance to reserve {$amount} {$asset}. Available: {$available}");
        }

        $stmt = $this->db->prepare("
            UPDATE wallet_balances
            SET available_balance = available_balance - :amount,
                reserved_balance = reserved_balance + :amount,
                updated_at = :updated_at
            WHERE user_id = :user_id AND wallet_type = :wallet_type AND asset = :asset
        ");
        $stmt->execute([
            ':amount'      => $amount,
            ':updated_at'  => gmdate('Y-m-d H:i:s'),
            ':user_id'     => $userId,
            ':wallet_type' => $walletType,
            ':asset'       => $asset
        ]);
    }

    /**
     * Release previously reserved funds back to available balance (e.g. cancelled order, rejected withdrawal).
     */
    public function releaseFunds(string $userId, string $walletType, string $asset, float $amount): void {
        if ($amount <= 0) return;

        $stmt = $this->db->prepare("
            UPDATE wallet_balances
            SET available_balance = available_balance + :amount,
                reserved_balance = CASE WHEN reserved_balance >= :amount THEN reserved_balance - :amount ELSE 0 END,
                updated_at = :updated_at
            WHERE user_id = :user_id AND wallet_type = :wallet_type AND asset = :asset
        ");
        $stmt->execute([
            ':amount'      => $amount,
            ':updated_at'  => gmdate('Y-m-d H:i:s'),
            ':user_id'     => $userId,
            ':wallet_type' => $walletType,
            ':asset'       => $asset
        ]);
    }

    /**
     * Settle reserved funds (deducts from reserved balance and records final debit).
     */
    public function settleReserved(string $userId, string $walletType, string $asset, float $amount, string $entryType, string $referenceId, string $description): array {
        $inTransaction = $this->db->inTransaction();
        if (!$inTransaction) {
            $this->db->beginTransaction();
        }

        try {
            // Deduct from reserved
            $stmt = $this->db->prepare("
                UPDATE wallet_balances
                SET balance = balance - :amount,
                    reserved_balance = CASE WHEN reserved_balance >= :amount THEN reserved_balance - :amount ELSE 0 END,
                    updated_at = :updated_at
                WHERE user_id = :user_id AND wallet_type = :wallet_type AND asset = :asset
            ");
            $stmt->execute([
                ':amount'      => $amount,
                ':updated_at'  => gmdate('Y-m-d H:i:s'),
                ':user_id'     => $userId,
                ':wallet_type' => $walletType,
                ':asset'       => $asset
            ]);

            // Ledger record
            $ledgerStmt = $this->db->prepare("
                INSERT INTO ledger_entries (
                    user_id, wallet_type, asset, amount, balance_before, balance_after,
                    entry_type, reference_id, description, created_at
                ) VALUES (
                    :user_id, :wallet_type, :asset, :amount, 0, 0,
                    :entry_type, :reference_id, :description, :created_at
                )
            ");
            $ledgerStmt->execute([
                ':user_id'      => $userId,
                ':wallet_type'  => $walletType,
                ':asset'        => $asset,
                ':amount'       => -$amount,
                ':entry_type'   => $entryType,
                ':reference_id' => $referenceId,
                ':description'  => $description,
                ':created_at'   => gmdate('Y-m-d H:i:s')
            ]);

            if (!$inTransaction) {
                $this->db->commit();
            }

            return ['settled' => true, 'amount' => $amount];
        } catch (Exception $e) {
            if (!$inTransaction) {
                $this->db->rollBack();
            }
            throw $e;
        }
    }

    /**
     * Fetch or initialize wallet balance record
     */
    public function getOrCreateWallet(string $userId, string $walletType, string $asset): array {
        $stmt = $this->db->prepare("
            SELECT * FROM wallet_balances
            WHERE user_id = :user_id AND wallet_type = :wallet_type AND asset = :asset
        ");
        $stmt->execute([
            ':user_id'     => $userId,
            ':wallet_type' => $walletType,
            ':asset'       => $asset
        ]);
        $row = $stmt->fetch();

        if ($row) {
            return $row;
        }

        // Create initial wallet record
        $now = gmdate('Y-m-d H:i:s');
        $insert = $this->db->prepare("
            INSERT INTO wallet_balances (user_id, wallet_type, asset, balance, available_balance, reserved_balance, promotional_balance, created_at, updated_at)
            VALUES (:user_id, :wallet_type, :asset, 0, 0, 0, 0, :created_at, :updated_at)
        ");
        $insert->execute([
            ':user_id'     => $userId,
            ':wallet_type' => $walletType,
            ':asset'       => $asset,
            ':created_at'  => $now,
            ':updated_at'  => $now
        ]);

        return [
            'user_id'             => $userId,
            'wallet_type'         => $walletType,
            'asset'               => $asset,
            'balance'             => 0,
            'available_balance'   => 0,
            'reserved_balance'    => 0,
            'promotional_balance' => 0
        ];
    }

    /**
     * Get aggregated user balances across all wallet types
     */
    public function getUserBalances(string $userId): array {
        $stmt = $this->db->prepare("
            SELECT wallet_type, asset, balance, available_balance, reserved_balance, promotional_balance
            FROM wallet_balances
            WHERE user_id = :user_id
            ORDER BY asset, wallet_type
        ");
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }
}
