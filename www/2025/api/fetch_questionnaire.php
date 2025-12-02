<?php
// CORS 허용 설정
header("Access-Control-Allow-Origin: https://pcikorea.com"); // 특정 도메인 허용
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // 허용할 HTTP 메서드
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // 허용할 헤더
header("Access-Control-Allow-Credentials: true"); // 쿠키 및 인증정보 포함 가능

// OPTIONS 요청 시 종료 (Preflight 요청 대응)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}
include 'db_connection.php';

// DB 연결
$conn = connect_db();

// 페이지네이션 변수
$page = isset($_GET['page']) ? intval($_GET['page']) : 1; // 현재 페이지 번호
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 15; // 페이지당 항목 수
$offset = ($page - 1) * $limit; // SQL OFFSET 계산
$search_school = isset($_GET['search_school']) ? trim($_GET['search_school']) : ''; // 검색어
$searchMode = isset($_GET['search_mode']) ? (int)$_GET['search_mode'] : 1; // 검색 모드

// WHERE 조건 설정
$whereClause = ""; // 기본값은 빈 문자열

if (empty($search_school)) {
    // 검색어가 비어 있을 경우 기본 조건만 적용
    $whereClause = "WHERE ch != 7 AND ch != 6";
} else {
    // 검색어가 있을 경우 검색 조건 설정
    if ($searchMode === 1) {
        // 정확히 일치
        $whereClause = "WHERE school1 = '" . $conn->real_escape_string($search_school) . "'";
    } elseif ($searchMode === 2) {
        // 포함 검색
        $whereClause = "WHERE school1 LIKE '%" . $conn->real_escape_string($search_school) . "%'";
    }
}

// 전체 데이터 개수 조회
$totalQuery = "SELECT COUNT(*) AS total FROM questionnaire $whereClause";
$totalResult = $conn->query($totalQuery);
$totalRow = $totalResult->fetch_assoc();
$total = $totalRow['total']; // 총 데이터 개수

// 데이터 조회 쿼리
$query = "SELECT *
          FROM questionnaire
          $whereClause
          ORDER BY num DESC
          LIMIT $offset, $limit";
$result = $conn->query($query);

$data = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// JSON으로 데이터 반환
header('Content-Type: application/json; charset=utf-8');
echo json_encode(array('data' => $data, 'total' => $total)); // PHP 5.3에서는 배열 선언에 array() 사용

$conn->close();
?>
