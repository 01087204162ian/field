<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>현장실습보험</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .login-container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
        }
        .login-container h1 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333333;
            text-align: center;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            font-size: 14px;
            color: #666666;
            margin-bottom: 5px;
        }
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #dddddd;
            border-radius: 5px;
            font-size: 14px;
        }
        .form-group input:focus {
            border-color: #3498db;
            outline: none;
        }
        .button-container {
            text-align: center; /* 버튼 중앙 정렬 */
        }
        .submit-btn {
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            display: inline-block;
        }
        .submit-btn:hover {
            background-color: #2980b9;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #888888;
        }
        .footer a {
            color: #3498db;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>회원 로그인</h1>
        <form action="api/login_process.php" method="POST">
            <div class="form-group">
                <label for="mem_id">아이디</label>
                <input type="text" name="mem_id" id="mem_id" required>
            </div>
            <div class="form-group">
                <label for="passwd">비밀번호</label>
                <input type="password" name="passwd" id="passwd" required>
            </div>
            <div class="button-container">
                <button type="submit" class="submit-btn">로그인</button>
            </div>
        </form>
        <div class="footer">
            <p>아이디를 잊으셨나요? <a href="#">아이디 찾기</a></p>
        </div>
    </div>
</body>
</html>
