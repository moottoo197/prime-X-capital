<?php
/**
 * AlphaVest signal lifecycle helpers.
 * Expired signal records are archived to trading_signal_history before removal
 * from the live trading_signals table. This helper is intentionally idempotent:
 * the database scheduler remains the primary path, and this request-time fallback
 * only handles records still left in the live table after their expiry time.
 */
if (!function_exists('alphavest_archive_expired_signals')) {
    function alphavest_archive_expired_signals($supabase): int {
        if (!$supabase || !method_exists($supabase, 'select')) return 0;

        $nowUtc = gmdate('Y-m-d H:i:sP');
        $expiredRes = $supabase->select('trading_signals', [
            'status' => 'in.(PUBLISHED,ACTIVE,SCHEDULED)',
            'expires_at' => 'lte.' . $nowUtc,
            'select' => '*',
            'order' => 'expires_at.asc',
            'limit' => '500'
        ]);
        if (!$expiredRes['success'] || !is_array($expiredRes['data'])) return 0;

        $archived = 0;
        foreach ($expiredRes['data'] as $signal) {
            $signalId = trim((string)($signal['id'] ?? ''));
            if ($signalId === '') continue;

            // If the archive already contains this signal, simply remove the live
            // copy. This makes retries safe after a partially completed operation.
            $historyExisting = $supabase->select('trading_signal_history', [
                'id' => 'eq.' . $signalId,
                'select' => 'id',
                'limit' => '1'
            ]);
            if ($historyExisting['success'] && !empty($historyExisting['data'][0])) {
                $del = $supabase->delete('trading_signals', ['id' => 'eq.' . $signalId]);
                if ($del['success']) $archived++;
                continue;
            }

            $historyPayload = $signal;
            $historyPayload['status'] = 'EXPIRED';
            $historyPayload['archived_at'] = gmdate('Y-m-d H:i:sP');

            // Prefer the complete original row. If an older history schema does not
            // have archived_at, retry with the exact live-signal columns only.
            $historyWrite = $supabase->upsert('trading_signal_history', [$historyPayload], 'id');
            if (!$historyWrite['success']) {
                unset($historyPayload['archived_at']);
                $historyWrite = $supabase->upsert('trading_signal_history', [$historyPayload], 'id');
            }
            if (!$historyWrite['success']) {
                $historyPayload = [];
                foreach ([
                    'id','symbol','direction','entry_price_min','entry_price_max',
                    'target_price_1','target_price_2','stop_loss','status',
                    'duration_minutes','daily_slot','profit_percentage',
                    'timezone_label','scheduled_at','published_at','expires_at','created_at'
                ] as $column) {
                    if (array_key_exists($column, $signal)) $historyPayload[$column] = $signal[$column];
                }
                $historyPayload['status'] = 'EXPIRED';
                $historyWrite = $supabase->upsert('trading_signal_history', [$historyPayload], 'id');
            }

            if ($historyWrite['success']) {
                $del = $supabase->delete('trading_signals', ['id' => 'eq.' . $signalId]);
                if ($del['success']) {
                    $archived++;
                    continue;
                }
            }

            // Even if archival is temporarily unavailable, mark the signal expired
            // so it can never reappear in the live list. The next request retries
            // archival while the record remains outside the active UI.
            $supabase->update('trading_signals', ['status' => 'EXPIRED'], ['id' => 'eq.' . $signalId]);
        }

        return $archived;
    }
}

if (!function_exists('alphavest_pkt_datetime')) {
    function alphavest_pkt_datetime($value): string {
        $raw = trim((string)$value);
        if ($raw === '') return '';
        try {
            $dt = new DateTime($raw);
            $dt->setTimezone(new DateTimeZone('Asia/Karachi'));
            return $dt->format('d M Y, h:i A') . ' PKT';
        } catch (Throwable $e) {
            return $raw;
        }
    }
}
