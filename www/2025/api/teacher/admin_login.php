<?php
// admin_login.php - 관리자 로그인 처리 (서버 측 해싱)
// CORS 헤더 설정
header("Access-Control-Allow-Origin: https://www.silbo.kr");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
session_start();

// JSON 응답 헤더 설정
header('Content-Type: application/json; charset=utf-8');

// POST 데이터 받기
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input) {
        // JSON 방식
        $adminId = isset($input['mem_id']) ? trim($input['mem_id']) : '';
        $password = isset($input['passwd']) ? trim($input['passwd']) : '';
    } else {
        // 기존 폼 방식
        $adminId = isset($_POST['adminId']) ? trim($_POST['adminId']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => '잘못된 요청 방법입니다.'
    ]);
    exit();
}

// 입력 데이터 검증
if (empty($adminId) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => '아이디와 비밀번호를 모두 입력해주세요.'
    ]);
    exit();
}

// 서버에서 비밀번호 MD5 해싱 (일관된 처리)
$hashedPassword = md5($password);

// 데이터베이스 연결
try {
    include '../db_connection.php';
    $connect = connect_db();
    
    // Prepared Statement 사용하여 SQL 인젝션 방지
    if (function_exists('mysqli_prepare')) {
        // MySQLi 방식 (권장)
        $stmt = mysqli_prepare($connect, "SELECT * FROM `2014Costmer` WHERE mem_id = ? AND passwd = ? LIMIT 1");
        mysqli_stmt_bind_param($stmt, "ss", $adminId, $hashedPassword);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            
            // 로그인 성공 - 세션 설정
            $_SESSION['cNum'] = $row['num'];
            $_SESSION['schoolName'] = $row['schoolName'];
            $_SESSION['mem_id'] = $row['mem_id'];
            $_SESSION['damdanga'] = $row['damdanga'];
            $_SESSION['damdangat'] = $row['damdangat'];
			$_SESSION['directory'] = $row['directory'];  //1이면 대학교 ,2이면 고등학교
            $_SESSION['login_time'] = date('Y-m-d H:i:s');
            
            // 세션 보안 강화
            session_regenerate_id(true);
            
            // 성공 응답
            echo json_encode([
                'success' => true,
                'message' => '로그인 성공',
                'data' => [
                    'cNum' => $row['num'],
                    'schoolName' => $row['schoolName'],
                    'damdanga' => $row['damdanga'],
                    'redirectUrl' => 'main.html',
			        'directory'=>$row['directory']
                ]
            ]);
            
        } else {
            // 로그인 실패
            echo json_encode([
                'success' => false,
                'message' => '아이디 또는 비밀번호가 올바르지 않습니다.'
            ]);
        }
        
        mysqli_stmt_close($stmt);
        
    } else {
        // 기존 방식 (MySQLi escape 사용)
        $adminId = mysqli_real_escape_string($connect, $adminId);
        $hashedPassword = mysqli_real_escape_string($connect, $hashedPassword);
        
        $sql = "SELECT * FROM `2014Costmer` WHERE mem_id = '$adminId' AND passwd = '$hashedPassword' LIMIT 1";
        $result = mysqli_query($connect, $sql);
        
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            
            // 로그인 성공 처리
            $_SESSION['cNum'] = $row['num'];
            $_SESSION['schoolName'] = $row['schoolName'];
            $_SESSION['mem_id'] = $row['mem_id'];
            $_SESSION['damdanga'] = $row['damdanga'];
            $_SESSION['damdangat'] = $row['damdangat'];
            $_SESSION['login_time'] = date('Y-m-d H:i:s');
            $_SESSION['directory'] = $row['directory'];  //1이면 대학교 ,2이면 고등학교
            session_regenerate_id(true);
            
            echo json_encode([
                'success' => true,
                'message' => '로그인 성공',
                'data' => [
                    'cNum' => $row['num'],
                    'schoolName' => $row['schoolName'],
                    'damdanga' => $row['damdanga'],
                    'redirectUrl' => 'main.html',
				    'directory'=>$row['directory']
                ]
            ]);
            
        } else {
            echo json_encode([
                'success' => false,
                'message' => '아이디 또는 비밀번호가 올바르지 않습니다.'
            ]);
        }
    }

} catch (Exception $e) {
    // 오류 처리
    error_log("로그인 처리 오류: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'message' => '시스템 오류가 발생했습니다.'
    ]);
}

// 기존 세션 체크 함수들
function isAdminLoggedIn() {
    return isset($_SESSION['cNum']) && isset($_SESSION['schoolName']);
}

function getAdminInfo() {
    if (!isAdminLoggedIn()) {
        return null;
    }
    
    return [
        'cNum' => $_SESSION['cNum'],
        'schoolName' => $_SESSION['schoolName'],
        'mem_id' => $_SESSION['mem_id'] ?? '',
        'damdanga' => $_SESSION['damdanga'] ?? '',
        'damdangat' => $_SESSION['damdangat'] ?? '',
		'directory' => $_SESSION['directory'] ?? ''
    ];
}

function adminLogout() {
    session_start();
    
    // 세션 데이터 모두 삭제
    $_SESSION = array();
    
    // 세션 쿠키 삭제
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // 세션 파괴
    session_destroy();
    
    return true;
}

// 관리자 권한 체크 함수
function requireAdminLogin() {
    if (!isAdminLoggedIn()) {
        header('Location: admin_login.html');
        exit();
    }
}

// 세션 타임아웃 체크 (2시간)
function checkAdminSessionTimeout($timeout = 7200) {
    if (isset($_SESSION['login_time'])) {
        $login_time = strtotime($_SESSION['login_time']);
        if (time() - $login_time > $timeout) {
            adminLogout();
            return false;
        }
    }
    return true;
}
?>