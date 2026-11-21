<?php
/**
 * Alphavest Centralized Supabase REST Client
 * 
 * Provides robust HTTPS REST API access to Supabase PostgreSQL, Auth, and Storage
 * without requiring pdo_pgsql or direct database TCP socket connections.
 * 
 * Fully compatible with Hostinger, InfinityFree, LiteSpeed, Apache, and Cloud hosting.
 */

class SupabaseClient {
    private string $url;
    private string $serviceKey;
    private string $anonKey;
    private int $timeout;

    public function __construct(?string $url = null, ?string $serviceKey = null, ?string $anonKey = null, int $timeout = 15) {
        $this->url = rtrim($url ?? getenv('SUPABASE_URL') ?: (defined('SUPABASE_URL') ? SUPABASE_URL : ($_ENV['SUPABASE_URL'] ?? '')), '/');
        $this->serviceKey = $serviceKey ?? getenv('SUPABASE_SERVICE_ROLE_KEY') ?: (defined('SUPABASE_SERVICE_ROLE_KEY') ? SUPABASE_SERVICE_ROLE_KEY : ($_ENV['SUPABASE_SERVICE_ROLE_KEY'] ?? ''));
        $this->anonKey = $anonKey ?? getenv('SUPABASE_ANON_KEY') ?: (defined('SUPABASE_ANON_KEY') ? SUPABASE_ANON_KEY : ($_ENV['SUPABASE_ANON_KEY'] ?? ''));
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
     *
     * @param string $table Table name
     * @param array $params Query string parameters (e.g., ['select' => '*', 'status' => 'eq.APPROVED', 'order' => 'created_at.desc'])
     * @param array $headers Additional headers (e.g., ['Range: 0-99', 'Prefer: count=exact'])
     * @param string|null $jwt Optional user JWT token for RLS
     * @return array ['success' => bool, 'data' => array|null, 'count' => int|null, 'http_code' => int, 'error' => string|null, 'message' => string|null]
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
        $ch = curl_init();

        $authKey = !empty($this->serviceKey) ? $this->serviceKey : $this->anonKey;
        $authBearer = $jwt ?: $authKey;

        $defaultHeaders = [
            "apikey: {$authKey}",
            "Authorization: Bearer {$authBearer}",
            "Content-Type: application/json",
            "Accept: application/json"
        ];

        // Filter and merge headers
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

        if ($body !== null && in_array($method, ['POST', 'PATCH', 'PUT'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        }

        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        $curlErrno = curl_errno($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        curl_close($ch);

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
}
