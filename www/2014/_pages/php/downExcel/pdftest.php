


<?php
echo "FPDF 설치 확인<br>";

if (file_exists('./pdf_2/fpdf.php')) {
    echo "FPDF 파일 존재<br>";
    
    require_once('./pdf_2/fpdf.php');
    
    if (class_exists('FPDF')) {
        echo "FPDF 클래스 로드 성공<br>";
    } else {
        echo "FPDF 클래스 로드 실패<br>";
    }
} else {
    echo "FPDF 파일 없음 - fpdf.php 파일을 ./pdf_2/ 폴더에 복사하세요<br>";
}
?>