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

// TCPDF 및 FPDI 로드
require_once __DIR__ . '/tcpdf/tcpdf.php';
require_once __DIR__ . '/vendor/autoload.php';
use setasign\Fpdi\Fpdi;

// DB 및 데이터 쿼리 불러오기
include '../../../../dbcon.php';
include "./query/claimQuery.php";

// TCPDF와 FPDI를 결합한 클래스
class TcpdfKoreanPDF extends Fpdi
{
    public function __construct()
    {
        parent::__construct('P', 'mm', 'A3');
        
        // 자동 페이지 나누기 비활성화
        $this->SetAutoPageBreak(false);
    }
    
    // 한글 텍스트 안전 출력 메소드
    public function addKoreanText($x, $y, $text, $size = 10)
    {
        try {
            // 1차: TCPDF 내장 한글 폰트 시도
            if ($this->tryTcpdfKoreanFont($x, $y, $text, $size)) {
                return true;
            }
            
            // 2차: 기존 gulim 폰트 시도  
            if ($this->tryGulimFont($x, $y, $text, $size)) {
                return true;
            }
            
            error_log("한글 텍스트 출력 실패: $text");
            return false;
            
        } catch (Exception $e) {
            error_log("한글 텍스트 출력 오류: " . $e->getMessage());
            return false;
        }
    }
    
    // TCPDF 내장 한글 폰트 사용
    private function tryTcpdfKoreanFont($x, $y, $text, $size)
    {
        try {
            // UTF-8 인코딩 확인
            if (!mb_check_encoding($text, 'UTF-8')) {
                $text = mb_convert_encoding($text, 'UTF-8', 'auto');
            }
            
            $this->SetFont('cid0kr', '', $size);
            $this->SetXY($x, $y);
            $this->Cell(0, 0, $text, 0, 0, 'L');
            
            return true;
        } catch (Exception $e) {
            error_log("TCPDF 한글 폰트 실패: " . $e->getMessage());
            return false;
        }
    }
    
    // 기존 gulim 폰트 사용 (fallback)
    private function tryGulimFont($x, $y, $text, $size)
    {
        try {
            // UTF-8을 EUC-KR로 안전 변환
            $convertedText = $this->convertToEucKr($text);
            
            $this->SetFont('gulim', '', $size);
            $this->SetXY($x, $y);
            $this->Write(0, $convertedText);
            
            return true;
        } catch (Exception $e) {
            error_log("Gulim 폰트 실패: " . $e->getMessage());
            return false;
        }
    }
    
    // 안전한 인코딩 변환
    private function convertToEucKr($text)
    {
        if (empty($text)) return '';
        
        // 인코딩 감지
        $encoding = mb_detect_encoding($text, ['UTF-8', 'EUC-KR', 'CP949'], true);
        
        if ($encoding === 'UTF-8') {
            $result = iconv('UTF-8', 'EUC-KR//IGNORE', $text);
            return $result !== false ? $result : $text;
        }
        
        return $text;
    }
}

try {
    // PDF 객체 생성
    $pdf = new TcpdfKoreanPDF();
    
    // 기존 gulim 폰트 등록 (fallback용)
    $fontPath = __DIR__ . '/font/gulim.php';
    if (file_exists($fontPath)) {
        try {
            $pdf->AddFont('gulim', '', 'gulim.php');
            error_log("Gulim 폰트 등록 성공");
        } catch (Exception $e) {
            error_log("Gulim 폰트 등록 실패: " . $e->getMessage());
        }
    }
    
    $pdf->AddPage();
    
    // 템플릿 PDF 불러오기
    $pdfPath = './linc_0' . $row['inscompany'] . '.pdf';
    if (!file_exists($pdfPath)) {
        throw new Exception("PDF 템플릿 파일이 존재하지 않습니다: $pdfPath");
    }
    
    $pdf->setSourceFile($pdfPath);
    $tplIdx = $pdf->importPage(1);
    $pdf->useTemplate($tplIdx, 0, 0, 297); // A3 가로 폭 297mm
    
    // 텍스트 데이터 준비 (UTF-8 그대로 유지)
    $data = [
        'school1' => $row['school1'] ?? '',
        'school2' => $row['school2'] ?? '',
        'school3' => $row['school3'] ?? '',
        'school4' => $row['school4'] ?? '',
        'school5' => $row['school5'] ?? '',
        'school7' => $row['school7'] ?? '',
        'school8' => $row['nschool8'] ?? '',
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
        'sj' => $row['school1'] ?? '',
        'daein1' => $row['directory'] == 2 ? 1 : 2,
        'daein2' => $row['directory'] == 2 ? 1 : 2,
        'daein3' => $row['directory'] == 2 ? 2 : 3,
        'daein4' => $row['directory'] == 2 ? 2 : 3
    ];
    
    // 텍스트 삽입 (frm 파일 사용)
    $tpl_file = './frm/claim_1.frm';
    if (!file_exists($tpl_file)) {
        throw new Exception("텍스트 위치 파일이 없습니다: $tpl_file");
    }
    
    $list = file($tpl_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $successCount = 0;
    $totalCount = 0;
    
    foreach ($list as $line) {
        $tmp = explode("|", trim($line));
        
        // 최소 필수 필드 체크
        if (count($tmp) < 5 || !$tmp[0] || !isset($data[$tmp[0]])) {
            continue;
        }
        
        $totalCount++;
        $field = $tmp[0];
        $x = floatval($tmp[1]);
        $y = floatval($tmp[2]);
        $size = floatval($tmp[4]) ?: 10;
        $text = (string)$data[$field];
        
        // 숫자 패딩 처리
        if (isset($tmp[6]) && is_numeric($tmp[6]) && intval($tmp[6]) > 0) {
            $text = str_pad($text, intval($tmp[6]), " ", STR_PAD_LEFT);
        }
        
        // 개선된 한글 텍스트 출력
        if ($pdf->addKoreanText($x, $y, $text, $size)) {
            $successCount++;
            error_log("필드 '$field' 출력 성공: '$text'");
        } else {
            error_log("필드 '$field' 출력 실패: '$text'");
        }
    }
    
    error_log("텍스트 출력 완료: $successCount/$totalCount 성공");
    
    // PDF 출력
    $pdf->Output('claim_result.pdf', 'I');
    
} catch (Exception $e) {
    error_log("PDF 생성 오류: " . $e->getMessage());
    
    // 에러 발생 시 사용자에게 표시
    header('Content-Type: text/html; charset=utf-8');
    echo "<!DOCTYPE html>";
    echo "<html><head><meta charset='utf-8'><title>PDF 생성 오류</title></head>";
    echo "<body>";
    echo "<h2>PDF 생성 중 오류가 발생했습니다</h2>";
    echo "<p>오류 내용: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>관리자에게 문의하시기 바랍니다.</p>";
    echo "</body></html>";
}
?>