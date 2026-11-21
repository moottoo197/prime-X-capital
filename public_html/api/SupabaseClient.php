<?php
/**
 * Alphavest Centralized Supabase REST Client
 * 
 * Provides robust HTTPS REST API access to Supabase PostgreSQL, Auth, and Storage
 * without requiring pdo_pgsql or direct database TCP socket connections.
 * 
 * Fully compatible with Hostinger, InfinityFree, LiteSpeed, Apache, and Cloud hosting.
 */

if (!class_exists('SupabaseClient')) {
class SupabaseClient {
    private string $url;
    private string $serviceKey;
    private string $anonKey;
    private int $timeout;

    public function __construct(?string $url = null, ?string $serviceKey = null, ?string $anonKey = null, int $timeout = 15) {
        $this->url = rtrim($url ?? (defined('SUPABASE_URL') ? SUPABASE_URL : (getenv('SUPABASE_URL') ?: ($_ENV['SUPABASE_URL'] ?? ''))), '/');
        $this->serviceKey = $serviceKey ?? (defined('SUPABASE_SERVICE_ROLE_KEY') ? SUPABASE_SERVICE_ROLE_KEY : (getenv('SUPABASE_SERVICE_ROLE_KEY') ?: ($_ENV['SUPABASE_SERVICE_ROLE_KEY'] ?? '')));
        $this->anonKey = $anonKey ?? (defined('SUPABASE_ANON_KEY') ? SUPABASE_ANON_KEY : (getenv('SUPABASE_ANON_KEY') ?: ($_ENV['SUPABASE_ANON_KEY'] ?? '')));
        $this->timeout = $timeout;

        if (empty($this->serviceKey) && !empty($this->anonKey)) {
            $this->serviceKey = $this->anonKey;
        }
    }

    public function isConfigured(): bool {
        return !empty($this->url) && (!empty($this->serviceKey) || !empty($this->anonKey));
    }

    public function getUrl(): string {
        return $this->url;
    }

    public function getAnonKey(): string {
        return $this->anonKey;
    }

    /**
     * Query a table with filtering, ordering, and pagination
     */
    public function select(string $table, array $params = [], array $headers = [], ?string $jwt = null): array {
        if (!$this->isConfigured()) {
            return [
                'success' => false,
                'error' => 'SUPABASE_CONFIG_MISSING',
                'message' => 'Supabase URL or Service Role Key is missing in environment.'
            ];
        }

        $query = http_build_query($params);
        $endpoint = "{$this->url}/rest/v1/{$table}" . ($query ? "?{$query}" : '');

        $reqHeaders = array_merge([
            'Prefer: count=exact'
        ], $headers);

        return $this->request('GET', $endpoint, null, $reqHeaders, $jwt);
    }

    /**
     * Execute multiple Supabase REST SELECT requests concurrently.
     * This keeps the API response time close to the slowest query instead of
     * adding every remote round-trip together. Falls back to sequential selects
     * when curl_multi is unavailable.
     *
     * @param array $requests key => ['table'=>string, 'params'=>array, 'headers'=>array, 'jwt'=>?string]
     */
    public function selectMany(array $requests): array {
        if (!$this->isConfigured() || empty($requests)) return [];
        if (!function_exists('curl_multi_init') || !function_exists('curl_multi_add_handle') || !function_exists('curl_multi_exec') || !function_exists('curl_multi_select') || !function_exists('curl_multi_getcontent') || !function_exists('curl_multi_remove_handle') || !function_exists('curl_multi_close')) {
            $out = [];
            foreach ($requests as $key => $cfg) {
                $out[$key] = $this->select(
                    (string)($cfg['table'] ?? ''),
                    (array)($cfg['params'] ?? []),
                    (array)($cfg['headers'] ?? []),
                    $cfg['jwt'] ?? null
                );
            }
            return $out;
        }

        // Some shared-hosting PHP builds expose part of the cURL extension but
        // not the complete curl_multi API. Treat incomplete support as a normal
        // fallback case instead of throwing a PHP 500 and making the dashboard
        // appear empty.
        try {
            $multi = curl_multi_init();
            if ($multi === false) {
                throw new RuntimeException('curl_multi_init failed');
            }
            $handles = [];
            $meta = [];
            $authKey = !empty($this->serviceKey) ? $this->serviceKey : $this->anonKey;

            foreach ($requests as $key => $cfg) {
            $table = (string)($cfg['table'] ?? '');
            if ($table === '') continue;
            $params = (array)($cfg['params'] ?? []);
            $extraHeaders = array_merge(['Prefer: count=exact'], (array)($cfg['headers'] ?? []));
            $jwt = $cfg['jwt'] ?? null;
            $query = http_build_query($params);
            $url = "{$this->url}/rest/v1/{$table}" . ($query ? "?{$query}" : '');
            $authBearer = $jwt ?: $authKey;
            $headers = [
                "apikey: {$authKey}",
                "Authorization: Bearer {$authBearer}",
                "Content-Type: application/json",
                "Accept: application/json"
            ];
            $headers = array_merge($headers, $extraHeaders);

            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_TIMEOUT => $this->timeout,
                CURLOPT_CONNECTTIMEOUT => 4,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_HEADER => true
            ]);
            if (defined('CURL_IPRESOLVE_V4')) {
                curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
            }
            curl_multi_add_handle($multi, $ch);
            $handles[(string)$key] = $ch;
            $meta[(string)$key] = ['table' => $table];
        }

        $running = null;
        do {
            $status = curl_multi_exec($multi, $running);
            if ($running) {
                $selected = curl_multi_select($multi, 0.15);
                if ($selected === -1) usleep(1000);
            }
        } while ($running && $status === CURLM_OK);

        $out = [];
        foreach ($handles as $key => $ch) {
            $response = curl_multi_getcontent($ch);
            $curlError = curl_error($ch);
            $curlErrno = curl_errno($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

            if ($curlErrno !== 0) {
                $out[$key] = [
                    'success' => false,
                    'http_code' => 0,
                    'error' => 'CURL_REQUEST_FAILED',
                    'message' => "Connection to Supabase REST failed: {$curlError}"
                ];
            } else {
                $rawHeaders = substr($response, 0, $headerSize);
                $rawBody = substr($response, $headerSize);
                $parsedCount = null;
                if (preg_match('/content-range:\s*([^\r\n]+)/i', $rawHeaders, $matches)) {
                    $parts = explode('/', trim($matches[1]));
                    if (isset($parts[1]) && is_numeric($parts[1])) $parsedCount = (int)$parts[1];
                }
                $decoded = json_decode($rawBody, true);
                if ($httpCode >= 200 && $httpCode < 300) {
                    $out[$key] = [
                        'success' => true,
                        'http_code' => $httpCode,
                        'data' => $decoded,
                        'count' => $parsedCount ?? (is_array($decoded) ? count($decoded) : null),
                        'error' => null
                    ];
                } else {
                    $msg = is_array($decoded)
                        ? ($decoded['message'] ?? $decoded['msg'] ?? $decoded['error_description'] ?? $decoded['error'] ?? 'API request error')
                        : ($rawBody ?: "HTTP {$httpCode} error");
                    $code = is_array($decoded) && !empty($decoded['code']) ? 'SUPABASE_' . $decoded['code'] : 'SUPABASE_HTTP_' . $httpCode;
                    $out[$key] = ['success'=>false,'http_code'=>$httpCode,'error'=>$code,'message'=>$msg,'data'=>null];
                }
            }
            curl_multi_remove_handle($multi, $ch);
            curl_close($ch);
        }
            curl_multi_close($multi);
            return $out;
        } catch (Throwable $e) {
            // Never turn a performance optimization into a data outage.
            // Fall back to the original, known-good sequential implementation.
            if (!empty($handles) && isset($multi)) {
                foreach ($handles as $ch) {
                    @curl_multi_remove_handle($multi, $ch);
                    @curl_close($ch);
                }
                @curl_multi_close($multi);
            }
            $out = [];
            foreach ($requests as $key => $cfg) {
                $out[$key] = $this->select(
                    (string)($cfg['table'] ?? ''),
                    (array)($cfg['params'] ?? []),
                    (array)($cfg['headers'] ?? []),
                    $cfg['jwt'] ?? null
                );
            }
            return $out;
        }
    }

    /**
     * Fetch all records across all pages
     */
    public function selectAll(string $table, array $params = [], int $pageSize = 1000, ?string $jwt = null): array {
        $allData = [];
        $offset = 0;
        $totalCount = null;

        while (true) {
            $rangeEnd = $offset + $pageSize - 1;
            $res = $this->select($table, $params, ["Range: {$offset}-{$rangeEnd}"], $jwt);
            if (!$res['success']) {
                return $res;
            }

            $batch = $res['data'] ?? [];
            if (!is_array($batch) || empty($batch)) {
                break;
            }

            $allData = array_merge($allData, $batch);
            if ($totalCount === null && isset($res['count'])) {
                $totalCount = $res['count'];
            }

            if (count($batch) < $pageSize || ($totalCount !== null && count($allData) >= $totalCount)) {
                break;
            }
            $offset += $pageSize;
        }

        return [
            'success' => true,
            'data' => $allData,
            'count' => $totalCount ?? count($allData),
            'http_code' => 200,
            'error' => null
        ];
    }

    /**
     * Insert record(s) into a table
     */
    public function insert(string $table, array $data, array $headers = [], ?string $jwt = null): array {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SUPABASE_CONFIG_MISSING', 'message' => 'Supabase not configured'];
        }

        $endpoint = "{$this->url}/rest/v1/{$table}";
        $reqHeaders = array_merge([
            'Prefer: return=representation'
        ], $headers);

        return $this->request('POST', $endpoint, $data, $reqHeaders, $jwt);
    }

    /**
     * Upsert record(s) into a table with on_conflict resolution
     */
    public function upsert(string $table, array $data, string $onConflict = 'id', array $headers = [], ?string $jwt = null): array {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SUPABASE_CONFIG_MISSING', 'message' => 'Supabase not configured'];
        }

        $endpoint = "{$this->url}/rest/v1/{$table}?on_conflict=" . urlencode($onConflict);
        $reqHeaders = array_merge([
            'Prefer: return=representation,resolution=merge-duplicates'
        ], $headers);

        return $this->request('POST', $endpoint, $data, $reqHeaders, $jwt);
    }

    /**
     * Update record(s) matching query params
     */
    public function update(string $table, array $data, array $params = [], array $headers = [], ?string $jwt = null): array {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SUPABASE_CONFIG_MISSING', 'message' => 'Supabase not configured'];
        }

        $query = http_build_query($params);
        $endpoint = "{$this->url}/rest/v1/{$table}" . ($query ? "?{$query}" : '');
        $reqHeaders = array_merge([
            'Prefer: return=representation'
        ], $headers);

        return $this->request('PATCH', $endpoint, $data, $reqHeaders, $jwt);
    }

    /**
     * Delete record(s) matching query params
     */
    public function delete(string $table, array $params = [], array $headers = [], ?string $jwt = null): array {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SUPABASE_CONFIG_MISSING', 'message' => 'Supabase not configured'];
        }

        $query = http_build_query($params);
        $endpoint = "{$this->url}/rest/v1/{$table}" . ($query ? "?{$query}" : '');
        $reqHeaders = array_merge([
            'Prefer: return=representation'
        ], $headers);

        return $this->request('DELETE', $endpoint, null, $reqHeaders, $jwt);
    }

    /**
     * Execute remote procedure call (RPC)
     */
    public function rpc(string $functionName, array $params = [], ?string $jwt = null): array {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SUPABASE_CONFIG_MISSING', 'message' => 'Supabase not configured'];
        }

        $endpoint = "{$this->url}/rest/v1/rpc/{$functionName}";
        return $this->request('POST', $endpoint, $params, [], $jwt);
    }

    /**
     * Supabase Auth API: Authenticate user by email and password
     */
    public function authSignIn(string $email, string $password): array {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SUPABASE_CONFIG_MISSING'];
        }

        $endpoint = "{$this->url}/auth/v1/token?grant_type=password";
        $body = ['email' => $email, 'password' => $password];
        $authKey = !empty($this->anonKey) ? $this->anonKey : $this->serviceKey;
        return $this->request('POST', $endpoint, $body, [
            'apikey: ' . $authKey,
            'Authorization: Bearer ' . $authKey
        ]);
    }

    /**
     * Supabase Auth API: Admin create or invite user
     */
    public function authAdminCreateUser(string $email, string $password, array $metadata = []): array {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SUPABASE_CONFIG_MISSING'];
        }

        $endpoint = "{$this->url}/auth/v1/admin/users";
        $body = [
            'email' => $email,
            'password' => $password,
            'email_confirm' => true,
            'user_metadata' => $metadata
        ];
        return $this->request('POST', $endpoint, $body);
    }

    /**
     * Supabase Auth Admin API: permanently delete a user
     */
    public function authAdminDeleteUser(string $userId): array {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SUPABASE_CONFIG_MISSING', 'message' => 'Supabase not configured'];
        }
        $userId = trim($userId);
        if ($userId === '') {
            return ['success' => false, 'error' => 'INVALID_USER_ID', 'message' => 'User ID is required'];
        }
        $endpoint = "{$this->url}/auth/v1/admin/users/" . rawurlencode($userId);
        return $this->request('DELETE', $endpoint, null);
    }

    /**
     * Supabase Auth API: Get user from JWT
     */
    public function authGetUser(string $jwt): array {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SUPABASE_CONFIG_MISSING'];
        }

        $endpoint = "{$this->url}/auth/v1/user";
        return $this->request('GET', $endpoint, null, [
            'Authorization: Bearer ' . $jwt,
            'apikey: ' . ($this->anonKey ?: $this->serviceKey)
        ]);
    }

    /**
     * Underlying HTTP cURL execution engine
     */
    private function request(string $method, string $url, ?array $body = null, array $extraHeaders = [], ?string $jwt = null): array {
        if (!function_exists('curl_init')) {
            // Fallback to file_get_contents if curl extension is somehow disabled
            return $this->requestStream($method, $url, $body, $extraHeaders, $jwt);
        }

        $ch = curl_init();
        $authKey = !empty($this->serviceKey) ? $this->serviceKey : $this->anonKey;
        $authBearer = $jwt ?: $authKey;

        $defaultHeaders = [
            "apikey: {$authKey}",
            "Authorization: Bearer {$authBearer}",
            "Content-Type: application/json",
            "Accept: application/json"
        ];

        $headerMap = [];
        foreach ($defaultHeaders as $h) {
            $parts = explode(':', $h, 2);
            $headerMap[strtolower(trim($parts[0]))] = $h;
        }
        foreach ($extraHeaders as $h) {
            $parts = explode(':', $h, 2);
            $headerMap[strtolower(trim($parts[0]))] = $h;
        }
        $finalHeaders = array_values($headerMap);

        $maxAttempts = ($method === 'GET') ? 2 : 1;
        $response = false;
        $curlError = '';
        $curlErrno = 0;
        $httpCode = 0;
        $headerSize = 0;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_HTTPHEADER => $finalHeaders,
                CURLOPT_TIMEOUT => $this->timeout,
                CURLOPT_CONNECTTIMEOUT => 6,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_HEADER => true
            ]);
            if (defined('CURL_IPRESOLVE_V4')) {
                curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
            }

            if ($body !== null && in_array($method, ['POST', 'PATCH', 'PUT'])) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
            }

            $response = curl_exec($ch);
            $curlError = curl_error($ch);
            $curlErrno = curl_errno($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            curl_close($ch);

            $transient = ($curlErrno !== 0) || ($attempt < $maxAttempts && in_array($httpCode, [502, 503, 504], true));
            if (!$transient || $attempt >= $maxAttempts) {
                break;
            }
            usleep(150000);
        }

        if ($curlErrno !== 0) {
            return [
                'success' => false,
                'http_code' => 0,
                'error' => 'CURL_REQUEST_FAILED',
                'message' => "Connection to Supabase REST failed: {$curlError}"
            ];
        }

        $rawHeaders = substr($response, 0, $headerSize);
        $rawBody = substr($response, $headerSize);

        $parsedCount = null;
        if (preg_match('/content-range:\s*([^\r\n]+)/i', $rawHeaders, $matches)) {
            $rangeParts = explode('/', trim($matches[1]));
            if (isset($rangeParts[1]) && is_numeric($rangeParts[1])) {
                $parsedCount = (int)$rangeParts[1];
            }
        }

        $decodedBody = json_decode($rawBody, true);

        if ($httpCode >= 200 && $httpCode < 300) {
            return [
                'success' => true,
                'http_code' => $httpCode,
                'data' => $decodedBody,
                'count' => $parsedCount ?? (is_array($decodedBody) ? count($decodedBody) : null),
                'error' => null
            ];
        }

        $errorMessage = is_array($decodedBody)
            ? ($decodedBody['message'] ?? $decodedBody['msg'] ?? $decodedBody['error_description'] ?? $decodedBody['error'] ?? 'API request error')
            : ($rawBody ?: "HTTP {$httpCode} error");

        $errorCode = is_array($decodedBody) && !empty($decodedBody['code'])
            ? 'SUPABASE_' . $decodedBody['code']
            : 'SUPABASE_HTTP_' . $httpCode;

        return [
            'success' => false,
            'http_code' => $httpCode,
            'error' => $errorCode,
            'message' => $errorMessage,
            'data' => null
        ];
    }

    private function requestStream(string $method, string $url, ?array $body = null, array $extraHeaders = [], ?string $jwt = null): array {
        $authKey = !empty($this->serviceKey) ? $this->serviceKey : $this->anonKey;
        $authBearer = $jwt ?: $authKey;

        $headers = [
            "apikey: {$authKey}",
            "Authorization: Bearer {$authBearer}",
            "Content-Type: application/json",
            "Accept: application/json"
        ];
        $headers = array_merge($headers, $extraHeaders);

        $opts = [
            'http' => [
                'method' => $method,
                'header' => implode("\r\n", $headers),
                'timeout' => $this->timeout,
                'ignore_errors' => true
            ],
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true
            ]
        ];

        if ($body !== null && in_array($method, ['POST', 'PATCH', 'PUT'])) {
            $opts['http']['content'] = json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }

        $context = stream_context_create($opts);
        $result = @file_get_contents($url, false, $context);

        $httpCode = 200;
        if (isset($http_response_header) && is_array($http_response_header)) {
            foreach ($http_response_header as $hdr) {
                if (preg_match('#HTTP/\S+\s+(\d+)#', $hdr, $m)) {
                    $httpCode = (int)$m[1];
                }
            }
        }

        $decodedBody = json_decode($result ?: '', true);
        if ($httpCode >= 200 && $httpCode < 300) {
            return ['success' => true, 'http_code' => $httpCode, 'data' => $decodedBody, 'error' => null];
        }

        return ['success' => false, 'http_code' => $httpCode, 'error' => 'HTTP_' . $httpCode, 'message' => $result ?: 'Error'];
    }
}
}
