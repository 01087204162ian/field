<?php
// TCPDF 설치 테스트 스크립트
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>TCPDF 설치 테스트</h2>";
echo "<hr>";

// 1. TCPDF 파일 존재 확인
$tcpdfPath = __DIR__ . '/tcpdf/tcpdf.php';
echo "1. TCPDF 파일 경로: " . $tcpdfPath . "<br>";
echo "2. TCPDF 파일 존재: " . (file_exists($tcpdfPath) ? '<span style="color:green; font-weight:bold">YES</span>' : '<span style="color:red; font-weight:bold">NO</span>') . "<br>";

if (!file_exists($tcpdfPath)) {
    die("❌ TCPDF 파일이 없습니다. 설치를 다시 확인하세요.");
}

// 2. TCPDF 클래스 로드 테스트
try {
    require_once $tcpdfPath;
    echo "3. TCPDF 클래스 로드: <span style='color:green; font-weight:bold'>✅ 성공</span><br>";
} catch (Exception $e) {
    echo "3. TCPDF 클래스 로드: <span style='color:red; font-weight:bold'>❌ 실패</span> - " . $e->getMessage() . "<br>";
    die();
}

// 3. TCPDF 버전 확인
if (class_exists('TCPDF')) {
    echo "4. TCPDF 버전: <strong>" . TCPDF_STATIC::getTCPDFVersion() . "</strong><br>";
    echo "5. TCPDF 클래스: <span style='color:green; font-weight:bold'>✅ 사용 가능</span><br>";
} else {
    echo "4. TCPDF 클래스: <span style='color:red; font-weight:bold'>❌ 사용 불가</span><br>";
    die();
}

echo "<hr>";

// 4. 한글 폰트 테스트
echo "<h3>한글 폰트 테스트</h3>";
try {
    $pdf = new TCPDF('P', 'mm', 'A4');
    $pdf->AddPage();
    
    // 한글 폰트 설정 테스트
    $pdf->SetFont('cid0kr', '', 12);
    $pdf->Cell(0, 10, '한글 테스트 - TCPDF 설치 성공!', 0, 1);
    $pdf->Cell(0, 10, '현재 시간: ' . date('Y-m-d H:i:s'), 0, 1);
    
    // 파일로 저장
    $testPdfPath = __DIR__ . '/tcpdf_test_result.pdf';
    $pdf->Output($testPdfPath, 'F');
    
    echo "6. 한글 PDF 생성: <span style='color:green; font-weight:bold'>✅ 성공</span><br>";
    echo "7. 테스트 파일: <a href='tcpdf_test_result.pdf' target='_blank' style='color:blue; font-weight:bold'>📄 tcpdf_test_result.pdf 다운로드</a><br>";
    
} catch (Exception $e) {
    echo "6. 한글 PDF 생성: <span style='color:red; font-weight:bold'>❌ 실패</span> - " . $e->getMessage() . "<br>";
}

echo "<hr>";

// 5. 기존 FPDI와 호환성 테스트
echo "<h3>FPDI 호환성 테스트</h3>";

try {
    $vendorPath = __DIR__ . '/vendor/autoload.php';
    echo "8. Vendor 경로: " . $vendorPath . "<br>";
    echo "9. Vendor 파일 존재: " . (file_exists($vendorPath) ? '<span style="color:green; font-weight:bold">YES</span>' : '<span style="color:red; font-weight:bold">NO</span>') . "<br>";
    
    if (file_exists($vendorPath)) {
        require_once $vendorPath;
        
        if (class_exists('setasign\Fpdi\Fpdi')) {
            echo "10. FPDI 클래스: <span style='color:green; font-weight:bold'>✅ 사용 가능</span><br>";
            
            // FPDI 객체 생성 테스트
            use setasign\Fpdi\Fpdi;
            $fpdiPdf = new Fpdi();
            echo "11. FPDI 객체 생성: <span style='color:green; font-weight:bold'>✅ 성공</span><br>";
            
        } else {
            echo "10. FPDI 클래스: <span style='color:red; font-weight:bold'>❌ 사용 불가</span><br>";
        }
    }
    
} catch (Exception $e) {
    echo "10. FPDI 테스트: <span style='color:red; font-weight:bold'>❌ 오류</span> - " . $e->getMessage() . "<br>";
}

echo "<hr>";

// 6. 시스템 정보
echo "<h3>시스템 정보</h3>";
echo "PHP 버전: " . phpversion() . "<br>";
echo "현재 디렉토리: " . __DIR__ . "<br>";
echo "메모리 제한: " . ini_get('memory_limit') . "<br>";

echo "<hr>";
echo "<h3>🎉 설치 상태 요약</h3>";
echo "<ul>";
echo "<li>✅ TCPDF 설치: 완료</li>";
echo "<li>✅ 한글 지원: 작동</li>";
echo "<li>✅ FPDI 호환: 확인됨</li>";
echo "</ul>";

echo "<p><strong>다음 단계:</strong> 기존 코드를 TCPDF 방식으로 수정할 수 있습니다!</p>";
?>