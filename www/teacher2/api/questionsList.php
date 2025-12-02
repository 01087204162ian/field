<?php
// 에러 리포팅 설정 (개발 중에만 사용)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS 허용 설정
header("Access-Control-Allow-Origin: https://pcikorea.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=utf-8');

// OPTIONS 요청 시 종료 (Preflight 요청 대응)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// 데이터베이스 연결
if (file_exists('../../2025/api/db_connection.php')) {
    include '../../2025/api/db_connection.php';
} else {
    echo json_encode(['success' => false, 'message' => '데이터베이스 연결 파일을 찾을 수 없습니다.'], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    $conn = connect_db();
    
    // POST 데이터 처리
    $action = $_POST['action'] ?? 'list';
    $cNum = $_POST['cNum'] ?? null;
    
    // cNum 검증
    if (!$cNum) {
        throw new Exception('cNum이 필요합니다. 로그인 상태를 확인해주세요.');
    }
    
    $response = ['success' => false, 'message' => '', 'data' => null];
    
    switch ($action) {
        case 'list':
            // 질문서 목록 조회
            $page = (int)($_POST['page'] ?? 1);
            $limit = (int)($_POST['limit'] ?? 15);
            $offset = ($page - 1) * $limit;
            $search_school = trim($_POST['search_school'] ?? '');
            $searchMode = (int)($_POST['search_mode'] ?? 1);
            
            // WHERE 조건 설정
            $whereClause = "WHERE cNum = ?";
            $params = [$cNum];
            $types = "s";
            
            // 학교명 검색 조건
            if (!empty($search_school)) {
                if ($searchMode === 1) {
                    // 정확히 일치
                    $whereClause .= " AND school1 = ?";
                    $params[] = $search_school;
                    $types .= "s";
                } elseif ($searchMode === 2) {
                    // 포함 검색
                    $whereClause .= " AND school1 LIKE ?";
                    $params[] = "%{$search_school}%";
                    $types .= "s";
                }
            } else {
                // 기본 조건 추가 (ch가 7이 아닌 것들)
                $whereClause .= " AND ch != ?";
                $params[] = 7;
                $types .= "i";
            }
            
            // 전체 데이터 개수 조회
            $totalQuery = "SELECT COUNT(*) AS total FROM questionnaire {$whereClause}";
            $totalStmt = $conn->prepare($totalQuery);
            $totalStmt->bind_param($types, ...$params);
            $totalStmt->execute();
            $totalResult = $totalStmt->get_result();
            $totalRow = $totalResult->fetch_assoc();
            $total = $totalRow['total'];
            $totalStmt->close();
            
            // 데이터 조회
            $query = "SELECT school6,school7,school8,week_total,certi,preiminum,num,ch FROM questionnaire {$whereClause} 
                     ORDER BY num DESC LIMIT ?, ?";
            $stmt = $conn->prepare($query);
            
            $finalParams = $params;
            $finalParams[] = $offset;
            $finalParams[] = $limit;
            $finalTypes = $types . "ii";
            
            $stmt->bind_param($finalTypes, ...$finalParams);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $questions = [];
            while ($row = $result->fetch_assoc()) {
                // 각 질문서의 이미지 조회 (삭제되지 않은 것만)
                $imageQuery = "SELECT * FROM image WHERE qnum = ? AND deleteIs != '2'";
                $imageStmt = $conn->prepare($imageQuery);
                $imageStmt->bind_param("i", $row['num']);
                $imageStmt->execute();
                $imageResult = $imageStmt->get_result();
                
                $images = [];
                while ($imageRow = $imageResult->fetch_assoc()) {
                    // kind 값을 텍스트로 변환
                    $kindText = '';
                    switch($imageRow['kind']) {
                        case '1': $kindText = '카드전표'; break;
                        case '2': $kindText = '영수증'; break;
                        case '3': $kindText = '기타'; break;
                        case '4': $kindText = '청약서'; break;
                        case '5': $kindText = '과별인원'; break;
                        case '6': $kindText = '보험사사업자등록증'; break;
                        case '7': $kindText = '보험증권'; break;
						case '8': $kindText = '청약서날인본'; break;
						case '9': $kindText = '질문서날인본'; break;
						case '10': $kindText = '과별인원날인본'; break;
                        default: $kindText = '알 수 없음'; break;
                    }
                    $imageRow['kind_text'] = $kindText;
                    $images[] = $imageRow;
                }
                $imageStmt->close();
                
                // 질문서 데이터에 이미지 정보 추가
                $row['images'] = $images;
                $questions[] = $row;
            }
            $stmt->close();
            
            $response['success'] = true;
            $response['message'] = '질문서 목록을 성공적으로 조회했습니다.';
            $response['data'] = [
                'questions' => $questions,
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'total_pages' => ceil($total / $limit)
            ];
            break;
            
        case 'get':
            // 특정 질문서 조회 (이미지 포함)
            $id = (int)($_POST['id'] ?? 0);
            if (!$id) {
                throw new Exception('질문서 ID가 필요합니다.');
            }
            
            // 질문서 정보 조회
            $query = "SELECT * FROM questionnaire WHERE num = ? AND cNum = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("is", $id, $cNum);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($row = $result->fetch_assoc()) {
                // 관련 이미지 조회 (삭제되지 않은 것만)
                $imageQuery = "SELECT * FROM image WHERE qnum = ? AND deleteIs != '2'";
                $imageStmt = $conn->prepare($imageQuery);
                $imageStmt->bind_param("i", $id);
                $imageStmt->execute();
                $imageResult = $imageStmt->get_result();
                
                $images = [];
                while ($imageRow = $imageResult->fetch_assoc()) {
                    // kind 값을 텍스트로 변환
                    $kindText = '';
                    switch($imageRow['kind']) {
                        case '1': $kindText = '카드전표'; break;
                        case '2': $kindText = '영수증'; break;
                        case '3': $kindText = '기타'; break;
                        case '4': $kindText = '청약서'; break;
                        case '5': $kindText = '과별인원'; break;
                        case '6': $kindText = '보험사사업자등록증'; break;
                        case '7': $kindText = '보험증권'; break;
                        default: $kindText = '알 수 없음'; break;
                    }
                    $imageRow['kind_text'] = $kindText;
                    $images[] = $imageRow;
                }
                $imageStmt->close();
                
                // 질문서 데이터에 이미지 정보 추가
                $row['images'] = $images;
                
                $response['success'] = true;
                $response['message'] = '질문서를 성공적으로 조회했습니다.';
                $response['data'] = $row;
            } else {
                throw new Exception('질문서를 찾을 수 없습니다.');
            }
            $stmt->close();
            break;
            
        default:
            throw new Exception('지원하지 않는 작업입니다.');
    }
    
    $conn->close();
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    if (isset($conn)) {
        $conn->close();
    }
    
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
}
?>