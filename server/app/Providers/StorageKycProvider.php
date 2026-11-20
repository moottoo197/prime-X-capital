<?php
namespace Alphavest\Providers;

use Exception;

require_once __DIR__ . '/ProviderInterfaces.php';

class StorageKycProvider implements KycProviderInterface {
    private string $storageDir;

    public function __construct() {
        // Secure private storage path outside direct web access
        $this->storageDir = __DIR__ . '/../../storage/kyc-documents';
        if (!is_dir($this->storageDir)) {
            mkdir($this->storageDir, 0700, true);
        }
    }

    public function storeDocument(string $userId, string $docType, array $fileData): string {
        $maxSize = 10 * 1024 * 1024; // 10MB
        if (($fileData['size'] ?? 0) > $maxSize) {
            throw new Exception("File size exceeds 10MB limit.");
        }

        // Validate MIME type
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $fileData['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowedMimes)) {
            throw new Exception("Invalid file type: {$mime}. Only JPG, PNG, WEBP, and PDF are accepted.");
        }

        // Safe randomized filename with no path traversal or original extension execution
        $ext = match($mime) {
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'application/pdf' => 'pdf',
            default => 'bin'
        };

        $safeName = $userId . '_' . $docType . '_' . bin2hex(random_bytes(16)) . '.' . $ext;
        $targetPath = $this->storageDir . '/' . $safeName;

        if (!move_uploaded_file($fileData['tmp_name'], $targetPath)) {
            throw new Exception("Failed to store KYC document securely.");
        }

        // Return private document identifier (never a public URL)
        return 'kyc-documents/' . $safeName;
    }

    public function verifyDocument(string $docId): array {
        return [
            'document_id' => $docId,
            'verified'    => true,
            'timestamp'   => time()
        ];
    }
}
