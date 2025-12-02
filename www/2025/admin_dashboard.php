<?php
session_start();
if (!isset($_SESSION['dnum']) || $_SESSION['user_level'] != 5) {
    // 관리자 권한 확인
    header("Location: login.php");
    exit();
}

// 로그인한 대상자의 이름 가져오기
$userName = $_SESSION['userName'];

// 현재 페이지 설정
$currentPage = basename($_SERVER['PHP_SELF']); // 현재 파일 이름 가져오기
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>관리자 대시보드</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .top-bar {
            background-color: #2c3e50;
            color: #fff;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .top-bar .welcome {
            font-size: 16px;
        }
        .top-bar .logout-form {
            margin: 0;
        }
        .top-bar .logout-btn {
            background-color: #e74c3c;
            color: #fff;
            border: none;
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        .top-bar .logout-btn:hover {
            background-color: #c0392b;
        }
        .menu {
            background-color: #34495e;
            display: flex;
            padding: 10px;
            justify-content: center;
        }
        .menu a {
            color: #fff;
            text-decoration: none;
            margin: 0 15px;
            font-size: 16px;
            transition: color 0.3s, background-color 0.3s;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .menu a:hover {
            color: #1abc9c;
        }
        .menu a.active {
            background-color: #1abc9c;
            color: #ffffff;
            font-weight: bold;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- 상단바 -->
    <div class="top-bar">
        <div class="welcome">
            환영합니다, <strong><?php echo htmlspecialchars($userName); ?></strong>님
        </div>
        <form action="logout.php" method="POST" class="logout-form">
            <button type="submit" class="logout-btn">로그아웃</button>
        </form>
    </div>

    <!-- 메뉴 -->
    <div class="menu">
        <a href="questions.php" class="<?php echo $currentPage == 'questions.php' ? 'active' : ''; ?>">질문서</a>
        <a href="user_management.php" class="<?php echo $currentPage == 'user_management.php' ? 'active' : ''; ?>">아이디</a>
        <a href="schools.php" class="<?php echo $currentPage == 'schools.php' ? 'active' : ''; ?>">학교</a>
        <a href="incident_handling.php" class="<?php echo $currentPage == 'incident_handling.php' ? 'active' : ''; ?>">사고처리</a>
        <a href="procedure_guide.php" class="<?php echo $currentPage == 'procedure_guide.php' ? 'active' : ''; ?>">처리절차안내</a>
        <a href="faq.php" class="<?php echo $currentPage == 'faq.php' ? 'active' : ''; ?>">자주 묻는 질문</a>
        <a href="compensation.php" class="<?php echo $currentPage == 'compensation.php' ? 'active' : ''; ?>">보상 안내</a>
        <a href="notices.php" class="<?php echo $currentPage == 'notices.php' ? 'active' : ''; ?>">공지사항</a>
    </div>

    <!-- 콘텐츠 -->
    <div class="content">
        <p>관리자 작업을 진행하세요.</p>
    </div>
</body>
</html>
