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
class MusagoPDF extends TCPDF
{
    private $koreanFont = 'cid0kr';
    
    public function __construct($orientation = 'P', $unit = 'mm', $size = 'A4')
    {
        parent::__construct($orientation, $unit, $size);
        $this->SetAutoPageBreak(false);
        $this->SetMargins(20, 20, 20);
        
        // 헤더와 푸터 제거
        $this->SetPrintHeader(false);
        $this->SetPrintFooter(false);
        
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
    
    // 밑줄 그리기
    public function drawUnderline($x, $y, $width, $text = '', $textSize = 10)
    {
        // 밑줄 그리기
        $this->SetLineWidth(0.3);
        $this->Line($x, $y + 3, $x + $width, $y + 3);
        
        // 텍스트가 있으면 밑줄 위에 출력
        if (!empty($text)) {
            $this->SetFont($this->koreanFont, '', $textSize);
            $textWidth = $this->GetStringWidth($text);
            $textX = $x + ($width - $textWidth) / 2; // 중앙 정렬
            $this->SetXY($textX, $y - 2);
            $this->Cell(0, 0, $text, 0, 0, 'L');
        }
    }
}

// PDF 생성
$pdf = new MusagoPDF('P', 'mm', 'A4');
$pdf->AddPage();

// 로고 영역 (우상단)
if (file_exists(__DIR__ . '/hanwha.png')) {
    $pdf->Image(__DIR__ . '/hanwha.png', 150, 20, 40, 25);
} else {
    $pdf->SetFont('helvetica', 'B', 12);
    $pdf->SetXY(150, 25);
    $pdf->Cell(40, 8, '한화손해보험', 0, 0, 'R');
}

$currentY = 60;

// 제목
$pdf->SetFont('cid0kr', 'B', 20);
$pdf->SetXY(20, $currentY);
$pdf->Cell(0, 15, '무사고 확인서', 0, 1, 'C');

$currentY += 30;

// 보험계약자
$pdf->SetFont('cid0kr', '', 12);
$pdf->SetXY(20, $currentY);
$pdf->Cell(30, 8, '보험계약자 :', 0, 0, 'L');
$pdf->SetXY(55, $currentY);
$pdf->Cell(0, 8, $row['school1'] ?? '', 0, 0, 'L');

$currentY += 20;

// 피보험자
$pdf->SetXY(20, $currentY);
$pdf->Cell(30, 8, '피보험자 :', 0, 0, 'L');
$pdf->SetXY(55, $currentY);
$pdf->Cell(0, 8, '현장실습 참가자 및 실습기관', 0, 0, 'L');

$currentY += 20;

// 보험종목
$pdf->SetXY(20, $currentY);
$pdf->Cell(30, 8, '보험종목 :', 0, 0, 'L');
$pdf->SetXY(55, $currentY);
$pdf->Cell(0, 8, '영문영업배상책임보험(산학협력단)', 0, 0, 'L');

$currentY += 20;

// 설계(청약)번호
$pdf->SetXY(20, $currentY);
$pdf->Cell(35, 8, '설계(청약)번호 :', 0, 0, 'L');
$pdf->SetXY(65, $currentY);
$pdf->Cell(0, 8, $row['gabunho'] ?? '', 0, 0, 'L');

$currentY += 20;

// 보험기간
$pdf->SetXY(20, $currentY);
$pdf->Cell(25, 8, '보험기간 :', 0, 0, 'L');
$startDate = $row['school7'] ? str_replace('-', ' - ', $row['school7']) : '';
$endDate = $row['school8'] ? str_replace('-', ' - ', $row['school8']) : '';
$periodText = $startDate . '  ~  ' . $endDate;
$pdf->SetXY(50, $currentY);
$pdf->Cell(0, 8, $periodText, 0, 0, 'L');

$currentY += 20;

// 보험료
$pdf->SetXY(20, $currentY);
$pdf->Cell(20, 8, '보험료 :', 0, 0, 'L');
$premiumText = number_format($row['preiminum'] ?? 0) . '원';
$pdf->SetXY(45, $currentY);
$pdf->Cell(0, 8, $premiumText, 0, 0, 'L');

$currentY += 30;

// 확인 문구 (여러 줄)
$pdf->SetFont('cid0kr', '', 11);
$confirmText = [
    '상기 계약 체결에 있어 입금일(',
    ')현재까지 사고사항이 없으며, 보험기간에',
    '도 불구하고 보험계약상의 보장은 입금 이후에 개시됨을 인지하고 있음을 확인합니다.'
];

// 첫 번째 줄
$pdf->SetXY(20, $currentY);
$pdf->Cell(0, 8, $confirmText[0], 0, 0, 'L');
$inputDateX = 20 + $pdf->GetStringWidth($confirmText[0]);
// 입금일에서 날짜만 추출하고 포맷 변경
$wdateOnly = $row['wdate'] ? date('Y - m - d', strtotime($row['wdate'])) : '';
$pdf->SetXY($inputDateX, $currentY);
$pdf->Cell(0, 8, $wdateOnly, 0, 0, 'L');
$inputDateEndX = $inputDateX + $pdf->GetStringWidth($wdateOnly);
$pdf->SetXY($inputDateEndX, $currentY);
$pdf->Cell(0, 8, $confirmText[1], 0, 0, 'L');

$currentY += 15;

// 두 번째 줄
$pdf->SetXY(20, $currentY);
$pdf->Cell(0, 8, $confirmText[2], 0, 0, 'L');

$currentY += 40;

// 서명 부분
$pdf->SetFont('cid0kr', '', 12);
$pdf->SetXY(20, $currentY);
$pdf->Cell(0, 8, '(명판 + 날인)', 0, 0, 'R');

// 계약자명을 서명 위치에 출력
$pdf->SetFont('cid0kr', 'B', 14);
$pdf->SetXY(130, $currentY - 15);
$pdf->Cell(0, 8, $row['school1'] ?? '', 0, 0, 'C');

// 날짜 추가 (우하단)
$currentY += 20;
$pdf->SetFont('cid0kr', '', 10);
$today = date('Y년 m월 d일');
$pdf->SetXY(20, $currentY);
$pdf->Cell(0, 8, $today, 0, 0, 'R');

// PDF 출력
try {
    // 출력 버퍼 정리
    if (ob_get_length()) {
        ob_end_clean();
    }
    
    // HTTP 헤더 설정
    header('Content-Type: application/pdf');
    header('Content-Disposition: inline; filename="musago_confirmation.pdf"');
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