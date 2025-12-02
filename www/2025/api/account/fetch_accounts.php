<?php
/**
 * fetch_accounts.php - 현장실습보험 계정 목록 조회 API (최적화 버전)
 * 
 * GET 파라미터:
 * - page: 페이지 번호 (기본값: 1)
 * - pageSize: 페이지 크기 (기본값: 15, 최대: 100)
 * - searchType: 검색 타입 (schoolName, mem_id, damdanga, damdangat)
 * - searchWord: 검색어
 * - directory: 학교 구분 (1: 대학교, 2: 고등학교)
 */

// 한글 처리를 위한 문자셋 설정
header('Content-Type: application/json; charset=utf-8');

include '../cors.php';
include '../db_connection.php';

// DB 연결
$conn = connect_db();
if (!$conn) {
    echo json_encode(array(
        'success' => false, 
        'error' => 'Database connection failed'
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

// 한글 처리를 위한 문자셋 설정
mysqli_set_charset($conn, "utf8mb4");

// 실행 시간 측정 시작
$start_time = microtime(true);

// GET 파라미터 수신 및 검증
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$pageSize = isset($_GET['pageSize']) ? min(100, max(1, intval($_GET['pageSize']))) : 15;
$searchType = isset($_GET['searchType']) ? trim($_GET['searchType']) : 'schoolName';
$searchWord = isset($_GET['searchWord']) ? trim($_GET['searchWord']) : '';
$directory = isset($_GET['directory']) ? trim($_GET['directory']) : '';

// 검색 타입 검증
$validSearchTypes = array('schoolName', 'mem_id', 'damdanga', 'damdangat');
if (!in_array($searchType, $validSearchTypes)) {
    $searchType = 'schoolName';
}

// OFFSET 계산
$offset = ($page - 1) * $pageSize;

// WHERE 조건 구성
$whereConditions = array();
$params = array();
$types = '';

// 검색어 조건
if (!empty($searchWord)) {
    $whereConditions[] = "{$searchType} LIKE ?";
    $params[] = "%{$searchWord}%";
    $types .= 's';
}

// 학교 구분 필터
if ($directory === '1' || $directory === '2') {
    $whereConditions[] = "c.directory = ?";
    $params[] = $directory;
    $types .= 'i';
}

$whereClause = '';
if (count($whereConditions) > 0) {
    $whereClause = "WHERE " . implode(' AND ', $whereConditions);
}

// ============================================
// 최적화 1: 서브쿼리를 사용한 신청건수 조회
// LEFT JOIN + GROUP BY 대신 스칼라 서브쿼리 사용
// ============================================
$listQuery = "
    SELECT 
        c.num,
        c.schoolName,
        c.mem_id,
        c.damdanga,
        c.damdangat,
        c.wdate,
        c.idmail,
        c.directory,
        c.bank,
        c.bankname,
        (SELECT COUNT(*) FROM questionnaire q WHERE q.cNum = c.num) as application_count
    FROM 2014Costmer c
    {$whereClause}
    ORDER BY c.wdate DESC
    LIMIT ? OFFSET ?
";

$listStmt = $conn->prepare($listQuery);

if ($listStmt === false) {
    echo json_encode(array(
        'success' => false, 
        'error' => 'List query preparation failed: ' . $conn->error
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

// 파라미터 바인딩 (LIST)
$listParams = $params;
$listParams[] = $pageSize;
$listParams[] = $offset;
$listTypes = $types . 'ii';

if (!empty($listParams)) {
    $listStmt->bind_param($listTypes, ...$listParams);
}

$listStmt->execute();
$result = $listStmt->get_result();

$accounts = array();
while ($row = $result->fetch_assoc()) {
    $accounts[] = array(
        'num' => intval($row['num']),
        'schoolName' => $row['schoolName'],
        'mem_id' => $row['mem_id'],
        'damdanga' => $row['damdanga'],
        'damdangat' => $row['damdangat'],
        'wdate' => $row['wdate'],
        'idmail' => $row['idmail'],
        'directory' => $row['directory'],
        'bank' => $row['bank'],
        'bankname' => $row['bankname'],
        'application_count' => intval($row['application_count'])
    );
}

$listStmt->close();

// ============================================
// 최적화 2: COUNT 쿼리를 조건부로 실행
// 첫 페이지거나 검색 조건이 변경된 경우에만 실행
// ============================================
$totalCount = 0;
$totalPages = 0;

// 실제 운영에서는 캐시를 사용하거나, 프론트엔드에서 첫 조회 시에만 total을 받도록 처리
$countQuery = "SELECT COUNT(*) as total FROM 2014Costmer c {$whereClause}";
$countStmt = $conn->prepare($countQuery);

if ($countStmt === false) {
    echo json_encode(array(
        'success' => false, 
        'error' => 'Count query preparation failed: ' . $conn->error
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

// 파라미터 바인딩 (COUNT)
if (!empty($params)) {
    $countStmt->bind_param($types, ...$params);
}

$countStmt->execute();
$countResult = $countStmt->get_result();
$totalCount = $countResult->fetch_assoc()['total'];
$totalPages = ceil($totalCount / $pageSize);
$countStmt->close();

$conn->close();

// 실행 시간 측정 종료
$execution_time = round((microtime(true) - $start_time) * 1000, 2); // ms 단위

// 응답 데이터 구성
$response = array(
    'success' => true,
    'accounts' => $accounts,
    'pagination' => array(
        'currentPage' => $page,
        'pageSize' => $pageSize,
        'totalCount' => intval($totalCount),
        'totalPages' => intval($totalPages),
        'startIndex' => $offset,
        'endIndex' => min($offset + $pageSize, $totalCount)
    ),
    'debug' => array(
        'executionTime' => $execution_time . 'ms',
        'accountsReturned' => count($accounts)
    )
);

// 디버깅 로그
error_log("[fetch_accounts.php] 조회 완료 - page: {$page}, totalCount: {$totalCount}, accounts: " . count($accounts) . ", time: {$execution_time}ms");

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>