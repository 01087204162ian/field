<?php
include '../../../../dbcon.php';

echo "<meta charset='utf-8'>";
echo "<h2>DB 연결 및 문자셋 확인</h2>";

// 현재 연결 문자셋 확인
$charset = mysqli_character_set_name($connect);
echo "현재 MySQL 문자셋: " . $charset . "<br>";

// 직접 쿼리로 데이터 가져오기 (UTF-8 설정 후)
mysqli_set_charset($connect, 'utf8');
echo "UTF-8로 문자셋 변경 완료<br><br>";

$claimNum = $_GET['claimNum'] ?? '14125';
$query = "SELECT school1, school2, school3 FROM questionnaire WHERE num = $claimNum";
$result = mysqli_query($connect, $query);

if ($result && $row = mysqli_fetch_assoc($result)) {
    foreach ($row as $key => $value) {
        echo "<h3>$key</h3>";
        echo "값: " . htmlspecialchars($value) . "<br>";
        echo "길이: " . strlen($value) . "<br>";
        echo "UTF-8 체크: " . (mb_check_encoding($value, 'UTF-8') ? 'OK' : 'FAIL') . "<br>";
        echo "인코딩: " . mb_detect_encoding($value, ['UTF-8', 'EUC-KR', 'CP949'], true) . "<br>";
        echo "헥스: " . bin2hex(substr($value, 0, 20)) . "<br><hr>";
    }
} else {
    echo "데이터를 가져올 수 없습니다.";
}
?>