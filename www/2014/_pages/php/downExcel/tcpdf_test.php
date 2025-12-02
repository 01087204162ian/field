<?php
// TCPDF를 사용한 한글 PDF 생성
require_once __DIR__ . "/vendor/autoload.php";

// TCPDF 사용
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);

// 문서 정보 설정
$pdf->SetCreator("PDF Creator");
$pdf->SetTitle("한글 PDF 테스트");

// 폰트 설정 (TCPDF는 기본적으로 한글 지원)
$pdf->SetFont("kozminproregular", "", 12); // 일본어 폰트지만 한글도 표시 가능
// 또는
// $pdf->SetFont("cid0kr", "", 12); // 한글 전용

// 페이지 추가
$pdf->AddPage();

// 한글 텍스트 출력
$pdf->Cell(0, 10, "한글 테스트: 중앙고등학교", 0, 1);
$pdf->Cell(0, 10, "Korean Test: " . date("Y-m-d"), 0, 1);

// PDF 출력
$pdf->Output("korean_test.pdf", "I");
?>