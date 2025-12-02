<?php
require_once __DIR__ . '/vendor/autoload.php';

use setasign\Fpdi\Fpdi;

// 새로운 PDF 객체 생성
$pdf = new Fpdi();
$pdf->AddPage();

// 기존 PDF 파일 경로 (같은 폴더에 위치해야 함)
$pdf->setSourceFile('linc_01.pdf');  // 예: claim_1.pdf → 있으면 바꾸세요
$templateId = $pdf->importPage(1);
$pdf->useTemplate($templateId, 0, 0, 210);  // A4 너비에 맞춰 사용

// 텍스트 추가
$pdf->SetFont('Arial', '', 12);
$pdf->SetXY(50, 50);
$pdf->Write(0, 'PDF 출력 테스트입니다.');

// 브라우저로 출력
$pdf->Output('I', 'result.pdf');
?>
