<?php
echo "PHP 작동 테스트<br>";
echo "현재 시간: " . date('Y-m-d H:i:s') . "<br>";

// TCPDF 파일 존재 확인
$tcpdfPath = __DIR__ . '/tcpdf/tcpdf.php';
echo "TCPDF 경로: " . $tcpdfPath . "<br>";
echo "파일 존재: " . (file_exists($tcpdfPath) ? 'YES' : 'NO') . "<br>";

if (file_exists($tcpdfPath)) {
    echo "TCPDF 파일 크기: " . filesize($tcpdfPath) . " bytes<br>";
    
    // TCPDF 로드 시도
    try {
        require_once $tcpdfPath;
        echo "TCPDF 로드: 성공<br>";
        
        if (class_exists('TCPDF')) {
            echo "TCPDF 클래스: 존재<br>";
        } else {
            echo "TCPDF 클래스: 없음<br>";
        }
    } catch (Exception $e) {
        echo "TCPDF 로드 오류: " . $e->getMessage() . "<br>";
    }
} else {
    echo "TCPDF 파일이 없습니다!<br>";
}
?>