<?php
include '../cors.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../db_connection.php';

try {
    $conn = connect_db();
    
    if (!$conn) {
        throw new Exception('데이터베이스 연결 실패');
    }
    
    // 입력값 검증 및 초기화
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(500, intval($_GET['limit']))) : 15; // ⭐ 최대 500
    $offset = ($page - 1) * $limit;
    $search_school = isset($_GET['search']) ? trim($_GET['search']) : '';
    $searchType = isset($_GET['searchType']) ? $_GET['searchType'] : 'contains';
    $searchField = isset($_GET['searchField']) ? $_GET['searchField'] : 'school1';
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';
    
    // 허용된 필드 검증
    $allowedFields = ['school1', 'school2', 'school4', 'school5', 'damdanga'];
    if (!in_array($searchField, $allowedFields)) {
        $searchField = 'school1';
    }
    
    // WHERE 조건 설정
    $whereConditions = array();
    $params = array();
    $types = "";
    
    // 기본 조건: 검색어도 없고 상태 필터도 없을 때만
    if (empty($search_school) && empty($status)) {
        $whereConditions[] = "q.ch != ?";
        $whereConditions[] = "q.ch != ?";
        $params[] = 7;
        $params[] = 6;
        $types .= "ii";
    }
    
    // 검색 조건
    if (!empty($search_school)) {
        switch ($searchType) {
            case 'exact':
                $whereConditions[] = "q.$searchField = ?";
                $params[] = $search_school;
                $types .= "s";
                break;
                
            case 'policy':
                $whereConditions[] = "q.certi = ?";
                $params[] = $search_school;
                $types .= "s";
                break;
                
            case 'contains':
            default:
                $whereConditions[] = "q.$searchField LIKE ?";
                $params[] = '%' . $search_school . '%';
                $types .= "s";
                break;
        }
    }
    
    // 상태 필터
    if (!empty($status) && $searchType !== 'policy') {
        $whereConditions[] = "q.ch = ?";
        $params[] = intval($status);
        $types .= "i";
    }
    
    // WHERE 절 생성
    $whereClause = "";
    if (!empty($whereConditions)) {
        $whereClause = "WHERE " . implode(" AND ", $whereConditions);
    }
    
    // 전체 데이터 개수 조회
    $totalQuery = "
        SELECT COUNT(*) AS total 
        FROM questionnaire q
        LEFT JOIN 2014Costmer c ON q.cNum = c.num
        $whereClause
    ";
    $totalStmt = $conn->prepare($totalQuery);
    
    if (!$totalStmt) {
        throw new Exception('쿼리 준비 실패: ' . $conn->error);
    }
    
    if (!empty($params)) {
        $totalStmt->bind_param($types, ...$params);
    }
    
    $totalStmt->execute();
    $totalResult = $totalStmt->get_result();
    $totalRow = $totalResult->fetch_assoc();
    $total = intval($totalRow['total']);
    $totalStmt->close();
    
    // ⭐⭐⭐ 데이터 조회 (mem_id 포함)
    $query = "
        SELECT 
            q.*,
            c.mem_id,
            c.schoolName as customer_school_name,
            c.damdanga as customer_damdanga
        FROM questionnaire q
        LEFT JOIN 2014Costmer c ON q.cNum = c.num
        $whereClause 
        ORDER BY q.num DESC 
        LIMIT ?, ?
    ";
    
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        throw new Exception('쿼리 준비 실패: ' . $conn->error);
    }
    
    $queryParams = array_merge($params, array($offset, $limit));
    $queryTypes = $types . "ii";
    
    $stmt->bind_param($queryTypes, ...$queryParams);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $data = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            if (isset($row['school1'])) {
                $row['school1'] = htmlspecialchars($row['school1'], ENT_QUOTES, 'UTF-8');
            }
            $data[] = $row;
        }
    }
    
    $stmt->close();
    
    // 페이지네이션 정보
    $totalPages = ceil($total / $limit);
    
    header('Content-Type: application/json; charset=utf-8');
    
    $response = array(
        'success' => true,
        'data' => $data,
        'pagination' => array(
            'total' => $total,
            'totalPages' => $totalPages,
            'currentPage' => $page,
            'limit' => $limit,
            'hasNext' => $page < $totalPages,
            'hasPrev' => $page > 1,
            'search' => $search_school,
        ),
        'debug' => array(
            'search' => $search_school,
            'searchType' => $searchType,
            'searchField' => $searchField,
            'status' => $status,
            'whereClause' => $whereClause,
            'params' => $params,
            'types' => $types
        )
    );
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    
    echo json_encode(array(
        'success' => false,
        'error' => array(
            'message' => '서버 에러가 발생했습니다.',
            'details' => $e->getMessage()
        )
    ), JSON_UNESCAPED_UNICODE);
    
    error_log("API Error: " . $e->getMessage());
    
} finally {
    if (isset($conn) && $conn) {
        $conn->close();
    }
}
?>