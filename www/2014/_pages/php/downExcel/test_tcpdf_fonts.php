<?php
require_once __DIR__ . '/tcpdf/tcpdf.php';

echo "<meta charset='utf-8'>";
echo "<h2>TCPDF 폰트 테스트</h2>";

try {
    $pdf = new TCPDF('P', 'mm', 'A4');
    $pdf->AddPage();
    
    // 1. cid0kr 폰트 테스트
    echo "1. cid0kr 폰트 테스트: ";
    try {
        $pdf->SetFont('cid0kr', '', 12);
        echo "<span style='color:green'>✅ 성공</span><br>";
    } catch (Exception $e) {
        echo "<span style='color:red'>❌ 실패: " . $e->getMessage() . "</span><br>";
    }
    
    // 2. 기본 한글 폰트들 테스트
    $koreanFonts = ['cid0kr', 'cid0jp', 'cid0cs', 'helvetica'];
    
    foreach ($koreanFonts as $font) {
        echo "폰트 '$font' 테스트: ";
        try {
            $pdf->SetFont($font, '', 12);
            echo "<span style='color:green'>✅ 사용 가능</span><br>";
        } catch (Exception $e) {
            echo "<span style='color:red'>❌ 사용 불가</span><br>";
        }
    }
    
    // 3. 실제 한글 출력 테스트
    echo "<br><h3>실제 한글 출력 테스트</h3>";
    
    $testText = "중앙고등학교";
    $yPos = 50;
    
    foreach ($koreanFonts as $font) {
        try {
            $pdf->SetFont($font, '', 12);
            $pdf->SetXY(20, $yPos);
            $pdf->Cell(0, 10, "[$font] $testText", 0, 1);
            $yPos += 15;
            echo "폰트 '$font'로 한글 출력: <span style='color:green'>✅ 성공</span><br>";
        } catch (Exception $e) {
            echo "폰트 '$font'로 한글 출력: <span style='color:red'>❌ 실패</span><br>";
        }
    }
    
    // PDF 저장
    $pdf->Output(__DIR__ . '/font_test_result.pdf', 'F');
    echo "<br><a href='font_test_result.pdf' target='_blank'>📄 테스트 결과 PDF 다운로드</a><br>";
    
} catch (Exception $e) {
    echo "전체 테스트 실패: " . $e->getMessage();
}
?>