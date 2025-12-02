<?php
require_once('tcpdf/tcpdf.php');
require_once('tcpdi/tcpdi.php');
/*
class TemplatePDF extends TCPDI
{
    public function __construct()
    {
        parent::__construct();
    }
}

$pdf = new TemplatePDF();

// 템플릿 PDF 설정
$pdf->setSourceFile('template.pdf');
$templatePage = $pdf->importPage(1);

$pdf->AddPage();
$pdf->useTemplate($templatePage);

// 한글 폰트 및 텍스트 추가
$pdf->SetFont('cid0kr', '', 14);
$pdf->SetXY(100, 100);
$pdf->Write(0, '템플릿 위에 추가된 한글 텍스트');

$pdf->Output();*/
?>