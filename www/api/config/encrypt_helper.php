<?php
/**
 * 양방향 암호화 함수 (PHP 8.2 호환)
 * OpenSSL 라이브러리 사용
 */

// 암호화 키 (실제 서비스에서는 외부 설정 파일에 저장하는 것이 좋습니다)
define('ENCRYPT_KEY', 'your_secret_key_here_change_this_to_random_string_32chars');
define('CIPHER_ALGO', 'AES-256-CBC');

/**
 * 문자열을 암호화하는 함수
 * 
 * @param string $plainText 암호화할 평문
 * @return string 암호화된 문자열 (base64 인코딩)
 */
function encryptData(string $plainText): string {
    // 빈 문자열이면 그대로 반환
    if (empty($plainText)) {
        return $plainText;
    }
    
    // 키 해싱 (고정된 길이의 키 생성)
    $key = hash('sha256', ENCRYPT_KEY, true);
    
    // 초기화 벡터(IV) 생성 - OpenSSL은 16바이트 IV 사용
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length(CIPHER_ALGO));
    
    // 암호화 수행
    $encrypted = openssl_encrypt(
        $plainText,
        CIPHER_ALGO,
        $key,
        OPENSSL_RAW_DATA,
        $iv
    );
    
    // IV와 암호화된 데이터 결합 후 base64 인코딩
    $encoded = base64_encode($iv . $encrypted);
    
    return $encoded;
}

/**
 * 암호화된 문자열을 복호화하는 함수
 * 
 * @param string $encryptedText 복호화할 암호문 (base64 인코딩)
 * @return string|false 복호화된 평문 또는 실패 시 false
 */
function decryptData(string $encryptedText): string|false {
    // 빈 문자열이면 그대로 반환
    if (empty($encryptedText)) {
        return $encryptedText;
    }
    
    // 키 해싱 (암호화와 동일한 방식)
    $key = hash('sha256', ENCRYPT_KEY, true);
    
    // base64 디코딩
    $decoded = base64_decode($encryptedText);
    if ($decoded === false) {
        return false;
    }
    
    // IV 크기 계산
    $iv_length = openssl_cipher_iv_length(CIPHER_ALGO);
    
    // IV 및 암호화된 데이터 추출
    $iv = substr($decoded, 0, $iv_length);
    $encrypted_data = substr($decoded, $iv_length);
    
    // 복호화 수행
    $decrypted = openssl_decrypt(
        $encrypted_data,
        CIPHER_ALGO,
        $key,
        OPENSSL_RAW_DATA,
        $iv
    );
    
    return $decrypted;
}

/**
 * 카드번호 마스킹 표시용 함수
 * 
 * @param string $cardNumber 카드번호 (평문 또는 암호화)
 * @return string 마스킹된 카드번호
 */
function maskCardNumber(string $cardNumber): string {
    if (empty($cardNumber)) {
        return '';
    }
    
    // 암호화된 데이터인지 확인 (base64)
    if (strlen($cardNumber) > 20 && preg_match('/^[A-Za-z0-9+\/=]+$/', $cardNumber)) {
        // 복호화 시도
        $decrypted = decryptData($cardNumber);
        if ($decrypted !== false) {
            $cardNumber = $decrypted;
        }
    }
    
    // 하이픈 제거
    $cleanNumber = str_replace('-', '', $cardNumber);
    
    if (strlen($cleanNumber) < 4) {
        return $cardNumber;
    }
    
    $lastFour = substr($cleanNumber, -4);
    $masked = str_repeat('*', strlen($cleanNumber) - 4);
    
    return $masked . $lastFour;
}

/**
 * 주민번호 마스킹 표시용 함수
 * 
 * @param string $jumin 주민번호 (평문 또는 암호화)
 * @return string 마스킹된 주민번호
 */
function maskJumin(string $jumin): string {
    if (empty($jumin)) {
        return '';
    }
    
    // 암호화된 데이터인지 확인
    if (strlen($jumin) > 20 && preg_match('/^[A-Za-z0-9+\/=]+$/', $jumin)) {
        // 복호화 시도
        $decrypted = decryptData($jumin);
        if ($decrypted !== false) {
            $jumin = $decrypted;
        }
    }
    
    // 하이픈 제거
    $cleanJumin = str_replace('-', '', $jumin);
    
    if (strlen($cleanJumin) !== 13) {
        return $jumin;
    }
    
    return substr($cleanJumin, 0, 6) . '-*******';
}
?>