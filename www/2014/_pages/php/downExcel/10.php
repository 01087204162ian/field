<?php
// 에러 출력 방지 및 로그 기록
while (ob_get_level()) ob_end_clean();
ob_start();
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/error.log');
error_reporting(E_ALL);

// 메모리 제한 증가
ini_set('memory_limit', '256M');

// UTF-8 설정
mb_internal_encoding('UTF-8');

// TCPDF 로드
require_once __DIR__ . '/tcpdf/tcpdf.php';

// DB 연결
include '../../../../dbcon.php';
mysqli_set_charset($connect, 'utf8');

// 파라미터 받기
$claimNum = $_GET['claimNum'] ?? $_POST['claimNum'] ?? null;
if (!$claimNum) {
    die("claimNum 파라미터가 필요합니다.");
}

// 데이터 조회
$query = "SELECT * FROM questionnaire WHERE num = " . intval($claimNum);
$result = mysqli_query($connect, $query);

if (!$result || !($row = mysqli_fetch_assoc($result))) {
    die("데이터를 찾을 수 없습니다. claimNum: $claimNum");
}

// 한글 지원 PDF 클래스
class KoreanFormPDF extends TCPDF
{
    private $koreanFont = 'cid0kr';
    
    public function __construct($orientation = 'P', $unit = 'mm', $size = 'A4')
    {
        parent::__construct($orientation, $unit, $size);
        $this->SetAutoPageBreak(false);
        $this->SetMargins(15, 15, 15);
        
        // 한글 폰트 설정
        $this->setupKoreanFont();
    }
    
    private function setupKoreanFont()
    {
        try {
            $this->SetFont($this->koreanFont, '', 10);
            error_log("한글 폰트 설정 성공: " . $this->koreanFont);
        } catch (Exception $e) {
            error_log("한글 폰트 설정 실패: " . $e->getMessage());
            // 대체 폰트로 설정
            $this->koreanFont = 'helvetica';
            $this->SetFont($this->koreanFont, '', 10);
        }
    }
    
    // 한글 텍스트 출력
    public function writeKorean($x, $y, $text, $size = 10, $style = '', $align = 'L')
    {
        if (empty($text)) return;
        
        try {
            $this->SetFont($this->koreanFont, $style, $size);
            $this->SetXY($x, $y);
            $this->Cell(0, 0, $text, 0, 0, $align);
        } catch (Exception $e) {
            error_log("한글 출력 실패: " . $e->getMessage());
        }
    }
    
    // 테이블 셀 그리기
    public function drawCell($x, $y, $width, $height, $text = '', $border = 1, $fill = false, $textSize = 9, $align = 'L')
    {
        // 셀 배경
        if ($fill) {
            $this->SetFillColor(240, 240, 240);
        } else {
            $this->SetFillColor(255, 255, 255);
        }
        
        // 테두리
        $this->SetLineWidth(0.3);
        $this->SetDrawColor(0, 0, 0);
        $this->Rect($x, $y, $width, $height, $fill ? 'DF' : 'D');
        
        // 텍스트
        if (!empty($text)) {
            $this->SetFont($this->koreanFont, '', $textSize);
            $this->SetXY($x + 1, $y + ($height - $textSize * 0.35) / 2);
            $this->Cell($width - 2, $textSize * 0.35, $text, 0, 0, $align);
        }
    }
    
    // 체크박스 그리기
    public function drawCheckbox($x, $y, $size = 3, $checked = false)
    {
        $this->SetLineWidth(0.3);
        $this->Rect($x, $y, $size, $size, 'D');
        
        if ($checked) {
            $this->SetFont($this->koreanFont, '', 8);
            $this->SetXY($x, $y);
            $this->Cell($size, $size, '√', 0, 0, 'C');
        }
    }
}

// PDF 생성
$pdf = new KoreanFormPDF('P', 'mm', 'A4');
$pdf->AddPage();

// 로고 영역 (우상단)
$pdf->SetFont('helvetica', 'B', 12);
$pdf->SetXY(150, 20);
$pdf->Cell(40, 8, '한화손해보험', 0, 0, 'R');

// 제목
$pdf->SetFont('cid0kr', 'B', 16);
$pdf->SetXY(15, 35);
$pdf->Cell(0, 10, '현장실습보험 질문서', 0, 1, 'C');

// 부제목
$pdf->SetFont('cid0kr', '', 9);
$pdf->SetXY(15, 45);
$pdf->Cell(0, 6, '사실과 다를 경우 보험금 지급 시 영향을 미칠 수 있사오니 정확하게 작성해 주시기 바랍니다.', 0, 1, 'C');

$currentY = 55;

// 1. 계약자 정보
$pdf->SetFont('cid0kr', 'B', 11);
$pdf->SetXY(15, $currentY);
$pdf->Cell(0, 8, '1. 계약자 정보(대학교 또는 산학협력단)', 0, 1, 'L');
$currentY += 10;

// 계약자 정보 테이블 (rowspan 구조)
// 1행: 사업자번호, 계약자 (4열)
$pdf->drawCell(15, $currentY, 35, 8, '사업자번호', 1, true, 9, 'C');
$pdf->drawCell(50, $currentY, 50, 8, $row['school2'] ?? '', 1, false, 9);
$pdf->drawCell(100, $currentY, 35, 8, '계약자', 1, true, 9, 'C');
$pdf->drawCell(135, $currentY, 60, 8, $row['school1'] ?? '', 1, false, 9);
$currentY += 8;

// 2행: 주소(rowspan=2), 담당자 연락처
$pdf->drawCell(15, $currentY, 35, 16, '주소', 1, true, 9, 'C'); // 높이 16 (2행 병합)
$pdf->drawCell(50, $currentY, 50, 16, $row['school3'] ?? '', 1, false, 9); // 높이 16 (2행 병합)
$pdf->drawCell(100, $currentY, 35, 8, '담당자 연락처', 1, true, 9, 'C');
$pdf->drawCell(135, $currentY, 60, 8, $row['school4'] ?? '', 1, false, 9);
$currentY += 8;

// 3행: 담당자 이메일 (주소는 위에서 rowspan으로 처리됨)
$pdf->drawCell(100, $currentY, 35, 8, '담당자 이메일', 1, true, 9, 'C');
$pdf->drawCell(135, $currentY, 60, 8, $row['school5'] ?? '', 1, false, 9);
$currentY += 8;

$currentY += 5;

// 2. 현장실습관련 사항
$pdf->SetFont('cid0kr', 'B', 11);
$pdf->SetXY(15, $currentY);
$pdf->Cell(0, 8, '2. 현장실습관련 사항', 0, 1, 'L');
$currentY += 10;

// 현장실습 테이블
$pdf->drawCell(15, $currentY, 40, 8, '구분', 1, true, 9, 'C');
$pdf->drawCell(55, $currentY, 140, 8, '내용', 1, true, 9, 'C');
$currentY += 8;

// 현장실습시기
$pdf->drawCell(15, $currentY, 40, 8, '현장실습시기 (√)', 1, true, 9, 'C');
$pdf->drawCell(55, $currentY, 140, 8, '', 1, false, 9);

// 체크박스들
$checkY = $currentY + 2;
$pdf->drawCheckbox(65, $checkY, 3, $row['semester'] == 1);
$pdf->writeKorean(70, $checkY, '1학기', 8);
$pdf->drawCheckbox(95, $checkY, 3, $row['semester'] == 'summer');
$pdf->writeKorean(100, $checkY, '하계계절', 8);
$pdf->drawCheckbox(125, $checkY, 3, $row['semester'] == 2);
$pdf->writeKorean(130, $checkY, '2학기', 8);
$pdf->drawCheckbox(155, $checkY, 3, $row['semester'] == 'winter');
$pdf->writeKorean(160, $checkY, '동계계절', 8);

$currentY += 8;

// 실습기간
$pdf->drawCell(15, $currentY, 40, 8, '실습기간(보험기간)', 1, true, 9, 'C');
$pdf->drawCell(55, $currentY, 140, 8, '', 1, false, 9);
$pdf->writeKorean(60, $currentY + 2, '보험시작일', 8);
$pdf->writeKorean(85, $currentY + 2, $row['school7'] ?? '', 8);
$pdf->writeKorean(125, $currentY + 2, '~', 8);
$pdf->writeKorean(135, $currentY + 2, '보험종료일', 8);
$pdf->writeKorean(160, $currentY + 2, $row['school8'] ?? '', 8);

$currentY += 15;

// 3. 보험가입 유형 선택
$pdf->SetFont('cid0kr', 'B', 11);
$pdf->SetXY(15, $currentY);
$pdf->Cell(0, 8, '3. 보험가입 유형 선택', 0, 1, 'L');
$currentY += 10;

// 보험 유형 테이블 헤더
$pdf->drawCell(15, $currentY, 60, 8, '보장내용', 1, true, 9);
$pdf->drawCell(75, $currentY, 60, 8, '가입유형 선택 (∨)', 1, true, 9);
$pdf->drawCell(135, $currentY, 60, 8, '', 1, true, 9);
$currentY += 8;

$pdf->drawCell(15, $currentY, 60, 8, '', 1, false, 9);
$pdf->drawCell(75, $currentY, 60, 8, 'PLAN A', 1, false, 9);
$pdf->drawCell(135, $currentY, 60, 8, 'PLAN B', 1, false, 9);

// PLAN 체크박스
$pdf->drawCheckbox(85, $currentY + 2, 3, $row['plan_type'] == 'A');
$pdf->drawCheckbox(145, $currentY + 2, 3, $row['plan_type'] == 'B');

$currentY += 8;

// 보장 내용들
$coverageItems = [
    ['대인 및 대물 배상', '1사고당 : 억원', '1사고당 : 억원'],
    ['산재보험 초과 사용자배상', '1사고당 : 억원', '1사고당 : 억원'],
    ['배상책임 자기부담금', '1십만원', '1십만원'],
    ['실습 중 치료비', '1인당 및 1사고당 : 1천만원', '1인당 및 1사고당 : 1천만원']
];

foreach ($coverageItems as $item) {
    $pdf->drawCell(15, $currentY, 60, 8, $item[0], 1, true, 8);
    $pdf->drawCell(75, $currentY, 60, 8, $item[1], 1, false, 8);
    $pdf->drawCell(135, $currentY, 60, 8, $item[2], 1, false, 8);
    $currentY += 8;
}

$currentY += 5;

// 4. 실습기간 별 참여인원
$pdf->SetFont('cid0kr', 'B', 11);
$pdf->SetXY(15, $currentY);
$pdf->Cell(0, 8, '4. 실습기간 별 참여인원', 0, 1, 'L');
$currentY += 10;

// 참여인원 테이블 (4열)
$weeks = [
    ['4주', '10주', '16주', '22주'],
    ['5주', '11주', '17주', '23주'],
    ['6주', '12주', '18주', '24주'],
    ['7주', '13주', '19주', '25주'],
    ['8주', '14주', '20주', '26주'],
    ['9주', '15주', '21주', '']
];

// 헤더
$headers = ['실습기간', '참여인원', '실습기간', '참여인원', '실습기간', '참여인원', '실습기간', '참여인원'];
$colWidth = 24;
for ($i = 0; $i < 8; $i++) {
    $pdf->drawCell(15 + $i * $colWidth, $currentY, $colWidth, 6, $headers[$i], 1, true, 8);
}
$currentY += 6;

// 데이터 행들
foreach ($weeks as $weekRow) {
    for ($i = 0; $i < 4; $i++) {
        if (!empty($weekRow[$i])) {
            // 실습기간
            $pdf->drawCell(15 + $i * $colWidth * 2, $currentY, $colWidth, 6, $weekRow[$i], 1, false, 8);
            // 참여인원 (데이터베이스에서 가져온 값)
            $weekNum = str_replace('주', '', $weekRow[$i]);
            $participantField = 'week' . $weekNum;
            $participants = isset($row[$participantField]) ? $row[$participantField] : '';
            $pdf->drawCell(15 + $i * $colWidth * 2 + $colWidth, $currentY, $colWidth, 6, $participants, 1, false, 8);
        } else {
            // 빈 셀
            $pdf->drawCell(15 + $i * $colWidth * 2, $currentY, $colWidth, 6, '', 1, false, 8);
            $pdf->drawCell(15 + $i * $colWidth * 2 + $colWidth, $currentY, $colWidth, 6, '', 1, false, 8);
        }
    }
    $currentY += 6;
}

// 총 참여 인원수
$pdf->drawCell(15, $currentY, 96, 6, '총 참여 인원수', 1, true, 9);
$pdf->drawCell(111, $currentY, 84, 6, $row['week_total'] ?? '', 1, false, 9);
$currentY += 15;

// 서명 부분
$pdf->SetFont('cid0kr', '', 10);
$pdf->SetXY(15, $currentY);
$pdf->Cell(0, 8, '본 질문서의 모든 기재사항이 사실과 다름이 없음을 확인합니다', 0, 1, 'C');

$currentY += 15;
$pdf->SetXY(15, $currentY);
$pdf->Cell(0, 8, '보험계약자 _________________________ (인)', 0, 1, 'C');

// 실제 데이터 입력 (데이터베이스 값들을 해당 위치에 출력)
// 계약자 정보
if (!empty($row['school1'])) {
    $pdf->writeKorean(60, 75, $row['school1'], 9); // 사업자번호
}
if (!empty($row['school2'])) {
    $pdf->writeKorean(120, 75, $row['school2'], 9); // 계약자
}
if (!empty($row['school3'])) {
    $pdf->writeKorean(60, 83, $row['school3'], 9); // 주소
}

// PDF 출력 (가장 안전한 방식)
try {
    // 출력 버퍼 정리
    if (ob_get_length()) {
        ob_end_clean();
    }
    
    // HTTP 헤더 설정
    header('Content-Type: application/pdf');
    header('Content-Disposition: inline; filename="questionnaire.pdf"');
    header('Cache-Control: private, max-age=0, must-revalidate');
    header('Pragma: public');
    
    // PDF 문자열로 생성 후 직접 출력
    $pdfString = $pdf->Output('S');
    echo $pdfString;
    
} catch (Exception $e) {
    error_log("PDF 출력 오류: " . $e->getMessage());
    
    // 최종 대체 방식: 기본 출력
    try {
        // 모든 출력 버퍼 정리
        while (ob_get_level()) {
            ob_end_clean();
        }
        
        // 가장 기본적인 출력
        echo $pdf->Output('', 'S');
        
    } catch (Exception $e2) {
        // HTML로 오류 메시지 출력
        header('Content-Type: text/html; charset=UTF-8');
        echo "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body>";
        echo "<h3>PDF 생성 오류</h3>";
        echo "<p>오류 메시지: " . htmlspecialchars($e2->getMessage()) . "</p>";
        echo "<p>첫 번째 오류: " . htmlspecialchars($e->getMessage()) . "</p>";
        echo "</body></html>";
    }
}
?>