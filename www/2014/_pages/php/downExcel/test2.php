<?php
// 기존 FPDI 코드에서 인코딩 부분만 수정한 버전
// 추가 패키지 설치 없이 사용 가능

// 에러 출력 방지 및 로그 기록
while (ob_get_level()) ob_end_clean();
ob_start();
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/error.log');
error_reporting(E_ALL);

// 오토로더
require_once __DIR__ . '/vendor/autoload.php';
use setasign\Fpdi\Fpdi;

// 한글 폰트 경로 등록
if (!defined('FPDF_FONTPATH')) {
    define('FPDF_FONTPATH', __DIR__ . '/font/');
}
 
// DB 및 데이터 쿼리 불러오기
include '../../../../dbcon.php';
include "./query/claimQuery.php";

// PDF 생성 (A3 세로)
$pdf = new Fpdi('P', 'mm', 'A3');

// 한글 폰트 파일 존재 확인
$fontPath = __DIR__ . '/font/gulim.php';
$fontZPath = __DIR__ . '/font/gulim.z';

if (!file_exists($fontPath)) {
    die("한글 폰트 파일이 존재하지 않습니다: $fontPath");
}
if (!file_exists($fontZPath)) {
    die("한글 폰트 데이터 파일이 존재하지 않습니다: $fontZPath");
}

// 한글 폰트 등록
try {
    $pdf->AddFont('gulim', '', 'gulim.php');
    error_log("한글 폰트 등록 성공");
} catch (Exception $e) {
    error_log("한글 폰트 등록 실패: " . $e->getMessage());
    die("한글 폰트 등록에 실패했습니다.");
}

$pdf->AddPage();
$pdf->SetFont('gulim', '', 12);

// 템플릿 PDF 불러오기
$pdfPath = './linc_0' . $row['inscompany'] . '.pdf';
if (!file_exists($pdfPath)) {
    die("PDF 템플릿 파일이 존재하지 않습니다: $pdfPath");
}

$pdf->setSourceFile($pdfPath);
$tplIdx = $pdf->importPage(1);
$pdf->useTemplate($tplIdx, 0, 0, 297);

// 한글 텍스트 처리 함수
function processKoreanText($text) {
    if (empty($text)) return '';
    
    // 현재 인코딩 감지
    $currentEncoding = mb_detect_encoding($text, ['UTF-8', 'EUC-KR', 'CP949'], true);
    
    if ($currentEncoding === false) {
        // 인코딩을 감지할 수 없는 경우, UTF-8로 가정
        return $text;
    }
    
    // FPDI에서 사용할 인코딩으로 변환 (gulim 폰트의 인코딩에 맞춰)
    if ($currentEncoding !== 'EUC-KR') {
        $converted = iconv($currentEncoding, 'EUC-KR//IGNORE', $text);
        return $converted !== false ? $converted : $text;
    }
    
    return $text;
}

// 텍스트 데이터 준비 (개선된 한글 처리)
$data = [
    'school1' => processKoreanText($row['school1'] ?? ''),
    'school2' => processKoreanText($row['school2'] ?? ''),
    'school3' => processKoreanText($row['school3'] ?? ''),
    'school4' => processKoreanText($row['school4'] ?? ''),
    'school5' => processKoreanText($row['school5'] ?? ''),
    'school7' => processKoreanText($row['school7'] ?? ''),
    'school8' => processKoreanText($row['nschool8'] ?? ''),
    'week4' => $row['week4'] ?? '',
    'week5' => $row['week5'] ?? '',
    'week6' => $row['week6'] ?? '',
    'week7' => $row['week7'] ?? '',
    'week8' => $row['week8'] ?? '',
    'week9' => $row['week9'] ?? '',
    'week10' => $row['week10'] ?? '',
    'week11' => $row['week11'] ?? '',
    'week12' => $row['week12'] ?? '',
    'week13' => $row['week13'] ?? '',
    'week14' => $row['week14'] ?? '',
    'week15' => $row['week15'] ?? '',
    'week16' => $row['week16'] ?? '',
    'week17' => $row['week17'] ?? '',
    'week18' => $row['week18'] ?? '',
    'week19' => $row['week19'] ?? '',
    'week20' => $row['week20'] ?? '',
    'week21' => $row['week21'] ?? '',
    'week22' => $row['week22'] ?? '',
    'week23' => $row['week23'] ?? '',
    'week24' => $row['week24'] ?? '',
    'week25' => $row['week25'] ?? '',
    'week26' => $row['week26'] ?? '',
    'week_total' => $row['week_total'] ?? '',
    'sj' => processKoreanText($row['school1'] ?? ''),
    'daein1' => $row['directory'] == 2 ? 1 : 2,
    'daein2' => $row['directory'] == 2 ? 1 : 2,
    'daein3' => $row['directory'] == 2 ? 2 : 3,
    'daein4' => $row['directory'] == 2 ? 2 : 3
];

// 텍스트 삽입 (개선된 에러 처리)
$tpl_file = './frm/claim_1.frm';
if (!file_exists($tpl_file)) {
    die("텍스트 위치 파일이 없습니다: $tpl_file");
}

$list = file($tpl_file);
foreach ($list as $line) {
    $tmp = explode("|", trim($line));
    if (count($tmp) < 5 || !$tmp[0] || !isset($data[$tmp[0]])) continue;
    
    $field = $tmp[0];
    $x = floatval($tmp[1]);
    $y = floatval($tmp[2]);
    $size = floatval($tmp[4]) ?: 10;
    $text = $data[$field];
    
    // 숫자 패딩 처리
    if (isset($tmp[6]) && is_numeric($tmp[6])) {
        $text = str_pad($text, intval($tmp[6]), " ", STR_PAD_LEFT);
    }
    
    // 텍스트 출력 (개선된 에러 처리)
    try {
        $pdf->SetFont('gulim', '', $size);
        $pdf->SetXY($x, $y);
        
        if (!empty($text)) {
            // 텍스트가 비어있지 않은 경우에만 출력
            $pdf->Write(0, $text);
        }
        
        error_log("필드 '$field' 출력 성공: '$text'");
        
    } catch (Exception $e) {
        error_log("텍스트 출력 오류 ($field): " . $e->getMessage());
        
        // 폰트 재설정 후 재시도
        try {
            $pdf->SetFont('gulim', '', 10); // 기본 크기로 재시도
            $pdf->SetXY($x, $y);
            $pdf->Write(0, $text);
        } catch (Exception $e2) {
            error_log("재시도도 실패 ($field): " . $e2->getMessage());
        }
    }
}

// 출력
try {
    $pdf->Output('I', 'claim_result.pdf');
} catch (Exception $e) {
    error_log("PDF 출력 오류: " . $e->getMessage());
    die("PDF 생성에 실패했습니다.");
}
?>