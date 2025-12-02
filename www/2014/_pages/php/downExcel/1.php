<?php
ob_start();

// 테스트 코드...
try {
    ob_clean();
    
    $pdf = new setasign\Fpdi\Fpdi();
    $pdf->AddPage();
    
    // 한글 지원 폰트 설정
    $pdf->AddFont('malgun', '', 'malgun.php');  // 맑은고딕
    $pdf->SetFont('malgun', '', 12);
    
    // 또는 DejaVu 폰트 사용 (무료, 한글 지원)
    // $pdf->SetFont('dejavusans', '', 12);
    
    $pdf->Text(10, 10, 'Hello World 오성준');
    $pdf->Output('I', 'test.pdf');
    
} catch (Exception $e) {
    ob_end_clean();
    echo "PDF 생성 오류: " . $e->getMessage() . "\n";
}
?>