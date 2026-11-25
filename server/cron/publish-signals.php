<?php
/**
 * Protected Cron Job: Publish Scheduled Signals
 * Writes directly to Supabase REST
 */
if (php_sapi_name() !== 'cli') {
    $token = $_GET['token'] ?? $_SERVER['HTTP_X_CRON_TOKEN'] ?? '';
    $expected = getenv('CRON_SECRET') ?: 'alphavest_secure_cron_token_change_in_production';
    if (empty($token) || !hash_equals($expected, $token)) {
        http_response_code(403);
        die("Forbidden: Invalid cron authorization token\n");
    }
}

$bootstrapCandidates = [
    dirname(__DIR__, 2) . '/public_html/api/bootstrap.php',
    __DIR__ . '/../public_html/api/bootstrap.php',
    __DIR__ . '/../htdocs/api/bootstrap.php',
    dirname(__DIR__, 2) . '/htdocs/api/bootstrap.php',
    __DIR__ . '/../api/bootstrap.php',
];
$bootstrapped = false;
foreach ($bootstrapCandidates as $candidate) {
    if (file_exists($candidate)) {
        require_once $candidate;
        $bootstrapped = true;
        break;
    }
}
if (!$bootstrapped) {
    die("Error: Could not locate api/bootstrap.php\n");
}

echo "[" . gmdate('Y-m-d H:i:s') . "] Starting Signal Dispatcher Cron...\n";

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    die("Error: Supabase is not configured.\n");
}

$nowStr = gmdate('Y-m-d H:i:s');

// Expire outdated signals
$res = $supabase->update('trading_signals', [
    'status' => 'EXPIRED'
], [
    'status' => 'eq.PUBLISHED',
    'expires_at' => "lt.{$nowStr}"
]);


// AUTO-SCHEDULER: keep today's two daily sessions present without any admin action.
// The user-facing API also self-heals, so this cron is an additional server-side
// safety net for days when nobody opens the dashboard during the release window.
$tz = new DateTimeZone('Asia/Karachi');
$today = (new DateTime('now', $tz))->format('Y-m-d');
$nowLocal = new DateTime('now', $tz);
$all = $supabase->select('trading_signals', ['select'=>'*','order'=>'created_at.desc','limit'=>'500']);
$signals = ($all['success'] && is_array($all['data'])) ? $all['data'] : [];
for ($slot=1; $slot<=2; $slot++) {
    $hour = $slot===2 ? 20 : 16;
    $start = new DateTime($today . sprintf(' %02d:00:00',$hour), $tz);
    $end = (clone $start)->modify('+15 minutes');
    $exists = false;
    foreach ($signals as $row) {
        if ((int)($row['daily_slot'] ?? 0)!==$slot) continue;
        $raw=(string)($row['scheduled_at'] ?? $row['published_at'] ?? '');
        if ($raw==='') continue;
        try { $d=new DateTime($raw,new DateTimeZone('UTC')); $d->setTimezone($tz); if ($d->format('Y-m-d H:i')===$start->format('Y-m-d H:i')) {$exists=true; break;} } catch(Throwable $e) {}
    }
    if (!$exists) {
        $template=null;
        foreach($signals as $row){ if((int)($row['daily_slot']??0)===$slot){$template=$row;break;} }
        if($template===null) foreach($signals as $row){ if(in_array((int)($row['daily_slot']??0),[1,2],true)){$template=$row;break;} }
        $utcStart=(clone $start)->setTimezone(new DateTimeZone('UTC'));
        $utcEnd=(clone $end)->setTimezone(new DateTimeZone('UTC'));
        $live=$nowLocal >= $start && $nowLocal < $end;
        $payload=[
          'id'=>'sig_daily_'.$start->format('Ymd').'_'.$slot,
          'symbol'=>$template['symbol']??'BTC/USDT','direction'=>$template['direction']??'BUY',
          'entry_price_min'=>(float)($template['entry_price_min']??0),'entry_price_max'=>(float)($template['entry_price_max']??0),
          'target_price_1'=>(float)($template['target_price_1']??0),'target_price_2'=>(float)($template['target_price_2']??0),
          'stop_loss'=>(float)($template['stop_loss']??0),'status'=>$live?'PUBLISHED':'SCHEDULED',
          'duration_minutes'=>15,'daily_slot'=>$slot,'profit_percentage'=>1.67,
          'timezone_label'=>'GLOBAL — ALL COUNTRIES (PKT)','scheduled_at'=>$utcStart->format('Y-m-d H:i:sP'),'published_at'=>$utcStart->format('Y-m-d H:i:sP'),
          'expires_at'=>$utcEnd->format('Y-m-d H:i:sP'),'created_at'=>gmdate('Y-m-d H:i:s')
        ];
        $ins=$supabase->insert('trading_signals',[$payload]);
        if($ins['success']) $signals[]=$payload;
    }
}

// Promote any due SCHEDULED signal entering its live window and trigger email broadcast
$broadcastHelper = dirname(__DIR__, 2) . '/public_html/api/lib/signal_broadcast.php';
if (file_exists($broadcastHelper)) {
    require_once $broadcastHelper;
    $nowTs = time();
    foreach ($signals as $row) {
        $st = strtoupper((string)($row['status'] ?? ''));
        $pubRaw = (string)($row['published_at'] ?? $row['scheduled_at'] ?? '');
        $expRaw = (string)($row['expires_at'] ?? '');
        $pubTs = $pubRaw !== '' ? strtotime($pubRaw) : false;
        $expTs = $expRaw !== '' ? strtotime($expRaw) : false;
        if ($st === 'SCHEDULED' && $pubTs !== false && $nowTs >= $pubTs && ($expTs === false || $nowTs < $expTs)) {
            $supabase->update('trading_signals', ['status' => 'PUBLISHED'], ['id' => 'eq.' . (string)$row['id']]);
            $row['status'] = 'PUBLISHED';
        }
        if (function_exists('primex_broadcast_signal_live_if_needed')) {
            primex_broadcast_signal_live_if_needed($supabase, $row);
        }
    }
}

echo "[" . gmdate('Y-m-d H:i:s') . "] Signal Dispatcher Cron completed.\n";
