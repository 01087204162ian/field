<?php 
include '../cors.php';
include '../db_connection.php';

// DB 연결
$conn = connect_db();

// 페이지네이션 변수
$page = isset($_GET['page']) ? intval($_GET['page']) : 1; // 현재 페이지 번호
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 15; // 페이지당 항목 수
$offset = ($page - 1) * $limit; // SQL OFFSET 계산

// 검색 조건 추가
$searchSchool = isset($_GET['search_school']) ? trim($_GET['search_school']) : '';
$searchMode = isset($_GET['search_mode']) ? intval($_GET['search_mode']) : -1; // 검색 모드 (-1: 전체 검색)

// 상태 필터 추가
$statusFilter = isset($_GET['status']) ? intval($_GET['status']) : 0; // 0: 전체, 1-5: 각 상태

// 기본 쿼리
$query = "SELECT * FROM claimList";
$whereClauses = [];

// 검색 모드 적용
if ($searchMode == 1 && !empty($searchSchool)) {
    $whereClauses[] = "certi LIKE '%" . mysqli_real_escape_string($conn, $searchSchool) . "%'";
} elseif ($searchMode == 2 && !empty($searchSchool)) {
    $whereClauses[] = "claimNumber LIKE '%" . mysqli_real_escape_string($conn, $searchSchool) . "%'";
} elseif ($searchMode == 3 && !empty($searchSchool)) {
    $whereClauses[] = "student LIKE '%" . mysqli_real_escape_string($conn, $searchSchool) . "%'";
} elseif ($searchMode == 4 && !empty($searchSchool)) {
    $whereClauses[] = "school1 LIKE '%" . mysqli_real_escape_string($conn, $searchSchool) . "%'";
}

// 상태 필터 적용 (1: 접수, 2: 미결, 3: 종결, 4: 면책, 5: 취소)
if ($statusFilter > 0 && $statusFilter <= 5) {
    $whereClauses[] = "ch = " . intval($statusFilter);
}

// WHERE 조건 추가
if (!empty($whereClauses)) {
    $query .= " WHERE " . implode(" AND ", $whereClauses);
}

// 데이터 정렬 및 페이지네이션 추가
$query .= " ORDER BY ch ASC, wdate DESC LIMIT $offset, $limit";

// 쿼리 실행
$result = mysqli_query($conn, $query);

// 데이터 저장
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $row['wdate_2'] = ($row['wdate_2'] == "0000-00-00") ? '' : $row['wdate_2'];
    $row['claimAmout'] = ($row['claimAmout'] == "0" || $row['claimAmout'] == "null") ? '' : $row['claimAmout'];
    $row['claimNumber'] = ($row['claimNumber'] == "null") ? '' : $row['claimNumber'];
    $data[] = $row;
}

// 전체 데이터 개수 조회 (검색 조건 반영)
$totalQuery = "SELECT COUNT(*) AS total FROM claimList";
if (!empty($whereClauses)) {
    $totalQuery .= " WHERE " . implode(" AND ", $whereClauses);
}
$totalResult = mysqli_query($conn, $totalQuery);
$totalRow = mysqli_fetch_assoc($totalResult);
$total = $totalRow['total'];

// JSON으로 데이터 반환
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['data' => $data, 'total' => $total], JSON_UNESCAPED_UNICODE);

// DB 연결 종료
mysqli_close($conn);
?>