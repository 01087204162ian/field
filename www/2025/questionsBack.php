<?php
session_start();
if (!isset($_SESSION['dnum']) || $_SESSION['user_level'] != 5) {
    // 관리자 권한 확인
    header("Location: login.php");
    exit();
}

// 로그인한 대상자의 이름 가져오기
$userName = $_SESSION['userName'];
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>질문서 관리</title>
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
        margin: 0;
    }
    .menu {
    background-color: #34495e;
    display: flex;
    padding: 10px;
    justify-content: center;
}

.menu-item {
    color: #fff;
    text-decoration: none;
    margin: 0 15px;
    font-size: 16px;
    padding: 5px 10px;
    border-radius: 5px;
    transition: color 0.3s, background-color 0.3s;
}

.menu-item:hover {
    background-color: #1abc9c;
    color: #ffffff;
}

.menu-item.active {
    background-color: #1abc9c;
    color: #ffffff;
    font-weight: bold;
}

.sidebar {
    width: 250px; /* 메뉴 폭을 넓힘 */
    background-color: #f4f4f4; /* 배경색 */
    padding: 10px 15px; /* 여백 조정 */
    border-right: 1px solid #ddd; /* 우측 경계선 */
    box-sizing: border-box; /* 패딩 포함 크기 계산 */
}

#left-menu {
    list-style-type: none; /* 기본 리스트 스타일 제거 */
    padding: 0; /* 리스트 여백 제거 */
    margin: 0;
}

#left-menu li {
    margin-bottom: 8px; /* 리스트 항목 간 간격 */
}

#left-menu li a {
    display: block; /* 블록 레벨로 처리 */
    padding: 10px 15px; /* 버튼 크기 조정 */
    background-color: #3498db; /* 기본 배경색 */
    color: #fff; /* 텍스트 색상 */
    text-decoration: none; /* 밑줄 제거 */
    border-radius: 4px; /* 모서리 둥글게 */
    font-size: 14px; /* 글자 크기 */
    text-align: center; /* 텍스트 가운데 정렬 */
    transition: background-color 0.3s, transform 0.2s; /* 효과 추가 */
}

#left-menu li a:hover {
    background-color: #2980b9; /* 호버 시 색상 */
    transform: scale(1.05); /* 약간 확대 효과 */
}

#left-menu li a.active {
    background-color: #1abc9c; /* 활성화된 항목 색상 */
    font-weight: bold; /* 굵게 표시 */
}
  .content {
    display: flex; /* Flexbox를 사용하여 레이아웃 설정 */
    flex-direction: row; /* 가로 방향으로 배치 */
}

.sidebar {
    width: 250px; /* 좌측 메뉴 폭을 넓게 조정 */
    background-color: #f4f4f4; /* 배경색 */
    padding: 15px; /* 여백 조정 */
    border-right: 1px solid #ddd; /* 우측 경계선 */
    box-sizing: border-box; /* 패딩 포함한 크기 계산 */
}

.main-content {
    flex-grow: 1; /* 나머지 공간을 차지 */
    padding: 20px;
    background-color: #ffffff;
}
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 0;
    }
    table, th, td {
        border: 1px solid #ddd;
    }
    th, td {
        padding: 10px;
        text-align: center;
    }
    th {
        background-color: #3498db;
        color: white;
    }
 .pagination {
    margin: 20px 0;
    text-align: center;
}

.pagination a {
    margin: 0 5px;
    padding: 5px 10px;
    text-decoration: none;
    color: #3498db;
    border: 1px solid #ddd;
    border-radius: 3px;
    cursor: pointer;
}

.pagination a.active {
    background-color: #3498db;
    color: #fff;
    border-color: #3498db;
}

.pagination a:hover {
    background-color: #2980b9;
    color: #fff;
}

	.modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background: #fff;
            border-radius: 10px;
            padding: 20px;
            max-width: 800px;
            width: 90%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            overflow-y: auto;
            max-height: 90%;
        }

        .modal-header {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .close-modal {
            background-color: #e74c3c;
            color: #fff;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            float: right;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 14px;
        }

         td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: center;
        }

        th {
		 border: 1px solid #ddd;
            padding: 8px;
            background-color: #3498db;
            color: white;
			text-align: center;
        }

        h5 {
            margin-top: 20px;
            font-size: 16px;
            color: #2c3e50;
        }

        input, textarea {
            width: 100%;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }

        input[type="text"] {
            font-size: 14px;
        }

        textarea {
            resize: none;
            font-size: 14px;
        }

        input[type="radio"] {
            margin-right: 10px;
        }

        .btn-primary {
            background-color: #1abc9c;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }

        .btn-primary:hover {
            background-color: #16a085;
        }
		.walign{
			text-align: center;
		}

	

    .info-table label {
        margin-right: 15px;
        font-size: 14px;
    }

    .date-input {
        width: 150px;
        padding: 5px;
        margin: 0 5px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 5px;
        text-align: center;
    }

    
	.radio-group {
        display: flex; /* 한 줄로 정렬 */
        gap: 20px; /* 각 항목 간 간격 설정 */
		justify-content: center; /* 수평 중앙 정렬 */
        align-items: center; /* 수직 중앙 정렬 */
        align-items: center; /* 버튼과 텍스트 수직 정렬 */
        flex-wrap: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
    }

    .radio-label {
        display: flex; /* 버튼과 텍스트를 수평 정렬 */
        align-items: center; /* 수직 정렬 */
        font-size: 14px; /* 텍스트 크기 */
        cursor: pointer; /* 클릭 가능한 커서 표시 */
        white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
        min-width: 70px; /* 텍스트 공간 확대 */
    }

    .radio-label input[type="radio"] {
        margin-right: 5px; /* 라디오 버튼과 텍스트 간 간격 */
    }

	.etc-input {
        text-align: left; /* 값 오른쪽 정렬 */
        border: 1px solid #ffffff; /* 테두리 회색 */
        background-color: #ffffff; /* 배경 흰색 */
        padding: 5px; /* 안쪽 여백 */
        border-radius: 4px; /* 둥근 테두리 */
        color: #333; /* 텍스트 색상 */
        font-size: 14px; /* 텍스트 크기 */
    }

    .etc-input:focus {
        outline: none; /* 포커스 시 파란 테두리 제거 */
        border: 1px solid #1abc9c; /* 포커스 시 테두리 색 변경 */
    }
    .week-input {
        text-align: right; /* 값 오른쪽 정렬 */
        border: 1px solid #ffffff; /* 테두리 회색 */
        background-color: #ffffff; /* 배경 흰색 */
        padding: 5px; /* 안쪽 여백 */
        border-radius: 4px; /* 둥근 테두리 */
        color: #333; /* 텍스트 색상 */
        font-size: 14px; /* 텍스트 크기 */
    }

    .week-input:focus {
        outline: none; /* 포커스 시 파란 테두리 제거 */
        border: 1px solid #1abc9c; /* 포커스 시 테두리 색 변경 */
    }
	/*아이디 select*/
	.styled-select {
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 14px;
        background: linear-gradient(to bottom, #fff, #f9f9f9);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .styled-select:hover {
        border-color: #1abc9c;
    }

    .styled-select:focus {
        outline: none;
        border-color: #3498db;
        background: #eaf6fd;
    }
	/*가입설계 번호 입력*/
	/* 테이블 스타일 */
    .styled-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 16px;
        background-color: #f9f9f9;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .styled-table td {
        padding: 15px;
        border-bottom: 1px solid #ddd;
        vertical-align: middle;
    }

    .label-cell {
        background-color: #3498db;
        color: #fff;
        font-weight: bold;
        text-align: center;
        width: 20%;
    }

    /* 입력 필드 스타일 */
    .styled-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 14px;
        box-sizing: border-box;
    }

    .styled-input:focus {
        outline: none;
        border-color: #3498db;
        background: #f0f8ff;
    }

    /* 버튼 스타일 */
    .btn-primary {
        background-color: #1abc9c;
        color: white;
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        display: inline-block;
        transition: all 0.3s ease;
    }

    .btn-primary:hover {
        background-color: #16a085;
    }

	/*번호와 사업자 번호 링크*/
		.btn-link {
			display: inline-block;
			padding: 2px 6px; /* 작은 패딩 */
			font-size: 11px; /* 작은 글씨 크기 */
			color: #fff; /* 텍스트 색상 */
			background-color: #6c757d; /* 기본 버튼 색상 (회색) */
			text-decoration: none;
			border-radius: 2px; /* 약간 둥근 모서리 */
			transition: background-color 0.3s, box-shadow 0.3s;
			text-align: center;
		}

		.btn-link:hover {
			background-color: #5a6268; /* 호버 상태 색상 (더 어두운 회색) */
			box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		}

		.btn-link:active {
			background-color: #343a40; /* 활성 상태 색상 (짙은 회색) */
			box-shadow: none;
		}


		@media (max-width: 768px) {
			.content {
				flex-direction: column; /* 세로 방향으로 배치 */
			}

			.sidebar {
				width: 100%; /* 전체 너비 차지 */
				border-right: none; /* 경계선 제거 */
				border-bottom: 1px solid #ddd; /* 하단 경계선 추가 */
			}

			.main-content {
				padding-top: 10px; /* 상단 여백 추가 */
			}
		}
</style>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(document).ready(function () {


			const menus = {
            "현장실습보험": [
                { name: "질문서", link: "questions.php" },
                { name: "아이디", link: "user_management.php" },
                { name: "학교", link: "schools.php" },
                { name: "사고처리", link: "incident_handling.php" },
                { name: "처리절차안내", link: "procedure_guide.php" },
                { name: "자주묻는질문", link: "faq.php" },
                { name: "보상안내", link: "compensation.php" },
                { name: "공지사항", link: "notices.php" }
            ],
            "kj대리": [],
            "das대리": [],
            "약국": [],
            "여행자배상책임": []
        };

        // 상단 메뉴 클릭 이벤트
        $(".menu-item").on("click", function (e) {
            e.preventDefault();
            $(".menu-item").removeClass("active");
            $(this).addClass("active");

            const section = $(this).data("section");
            updateLeftMenu(section);
        });

        // 좌측 메뉴 업데이트 함수
        function updateLeftMenu(section) {
            const menuList = menus[section] || [];
            const $menu = $("#left-menu");
            $menu.empty();

            menuList.forEach(item => {
                $menu.append(`<li><a href="${item.link}">${item.name}</a></li>`);
            });

            if (menuList.length === 0) {
                $menu.append("<li>메뉴가 없습니다</li>");
            }
        }

        // 초기 로드: 첫 번째 메뉴 활성화 및 좌측 메뉴 업데이트
        const initialSection = $(".menu-item.active").data("section");
        updateLeftMenu(initialSection);



            const itemsPerPage = 15;

            function loadTable(page = 1) {
                $.ajax({
                    url: "_db/fetch_questionnaire.php",
                    method: "GET",
                    data: { page, limit: itemsPerPage },
                    dataType: "json",
                    success: function (response) {
                        let rows = "";
                        response.data.forEach((item, index) => {
                            const formattedPreiminum = item.preiminum
                                ? parseFloat(item.preiminum).toLocaleString("en-US")
                                : "0";

                            const insuranceOptions = `
                                <select class="insurance-select" data-id="${item.num}">
                                    <option value="-1" ${item.inscompany == -1 ? "selected" : ""}>선택</option>
                                    <option value="1" ${item.inscompany == 1 ? "selected" : ""}>한화</option>
                                    <option value="2" ${item.inscompany == 2 ? "selected" : ""}>Meritz</option>
                                </select>
                            `;

                            const statusOptions = `
                                <select class="status-select" data-id="${item.num}">
                                    <option value="1" ${item.ch == 1 ? "selected" : ""}>접수</option>
                                    <option value="2" ${item.ch == 2 ? "selected" : ""}>보험료 안내중</option>
                                    <option value="3" ${item.ch == 3 ? "selected" : ""}>청약서</option>
                                    <option value="4" ${item.ch == 4 ? "selected" : ""}>입금대기중</option>
                                    <option value="5" ${item.ch == 5 ? "selected" : ""}>입금확인</option>
                                    <option value="6" ${item.ch == 6 ? "selected" : ""}>증권 발급</option>
                                    <option value="12" ${item.ch == 12 ? "selected" : ""}>수정요청</option>
                                    <option value="7" ${item.ch == 7 ? "selected" : ""}>보류</option>
                                    <option value="8" ${item.ch == 8 ? "selected" : ""}>카드</option>
                                    <option value="9" ${item.ch == 9 ? "selected" : ""}>스캔</option>
                                    <option value="10" ${item.ch == 10 ? "selected" : ""}>수납대기</option>
                                    <option value="11" ${item.ch == 11 ? "selected" : ""}>재심사</option>
                                </select>
                            `;

                            rows += `<tr>
                                <td><a href="#" class="btn-link open-second-modal"  data-num="${item.num}">${(page - 1) * itemsPerPage + index + 1}</a></td>
                                <td><a href="#" class="btn-link open-modal"  data-num="${item.num}">${item.school2}</a></td>
                                <td>${item.school1}</td>
                                <td>${item.week_total}</td>
                                <td>${item.school4}</td>
                                <td>${item.wdate}</td>
                                <td>${item.certi || item.gabunho || ""}</td>
                                <td class="preiminum">${formattedPreiminum}</td>
                                <td>${insuranceOptions}</td>
                                <td>${statusOptions}</td>
                                <td>${item.school5}</td>
                                <td>${item.memo}</td>
                                <td>${item.manager}</td>
                            </tr>`;
                        });

                        $("#questionnaire-table tbody").html(rows);

                        // 페이지네이션 생성
                     // 페이지네이션 생성
						const totalItems = response.total;
						const totalPages = Math.ceil(totalItems / itemsPerPage);
						renderPagination(page, totalPages);

                       /* $(".open-modal").click(function (e) {
                            e.preventDefault();
                            const num = $(this).data("num");
                            alert(`Modal for number: ${num}`);
                        });*/
                    },
                    error: function () {
                        alert("데이터를 불러오는 중 오류가 발생했습니다.");
                    },
                });
            }
			  function renderPagination(currentPage, totalPages) {
        const maxPagesToShow = 5; // 한 번에 표시할 최대 페이지 수
        const $pagination = $(".pagination");
        $pagination.empty();

        // 이전 버튼
        if (currentPage > 1) {
            $pagination.append(`<a href="#" class="page-link" data-page="${currentPage - 1}">이전</a>`);
        }

        // 페이지 번호 계산
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // 페이지 번호 추가
        for (let i = startPage; i <= endPage; i++) {
            $pagination.append(
                `<a href="#" class="page-link ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</a>`
            );
        }

        // 다음 버튼
        if (currentPage < totalPages) {
            $pagination.append(`<a href="#" class="page-link" data-page="${currentPage + 1}">다음</a>`);
        }

        // 페이지 이동 이벤트
        $(".page-link").click(function (e) {
            e.preventDefault();
            const page = parseInt($(this).data("page"));
            loadTable(page);
        });
    }
            loadTable();
        });
    </script>
</head>
<body>
  <!-- 상단 메뉴 -->
    <div class="top-bar">
        <div class="welcome">환영합니다, <strong><?php echo htmlspecialchars($userName); ?></strong>님</div>
        <form action="logout.php" method="POST" class="logout-form">
            <button type="submit" class="logout-btn">로그아웃</button>
        </form>
    </div>
    <div class="menu">
        <a href="#" class="menu-item active" data-section="현장실습보험">현장실습보험</a>
        <a href="#" class="menu-item" data-section="kj대리">KJ대리</a>
        <a href="#" class="menu-item" data-section="das대리">DAS대리</a>
        <a href="#" class="menu-item" data-section="약국">약국</a>
        <a href="#" class="menu-item" data-section="여행자배상책임">여행자배상책임</a>
    </div>

    <!-- 좌측 메뉴 -->
    <div class="content">
        <div class="sidebar">
			<ul id="left-menu">
				<li><a href="questions.php" class="active">질문서</a></li>
				<li><a href="user_management.php">아이디</a></li>
				<li><a href="schools.php">학교</a></li>
				<li><a href="incident_handling.php">사고처리</a></li>
				<li><a href="procedure_guide.php">처리절차안내</a></li>
				<li><a href="faq.php">자주묻는질문</a></li>
				<li><a href="compensation.php">보상안내</a></li>
				<li><a href="notices.php">공지사항</a></li>
			</ul>
		</div>
        <div class="main-content">
            <!-- 여기에 메인 콘텐츠가 표시됩니다 -->

					<table id="questionnaire-table">
					<thead>
						<tr>
							<th>순번</th>
							<th>사업자번호</th>
							<th>계약자</th>
							<th>총 주수</th>
							<th>연락처</th>
							<th>등록일</th>
							<th>증권(설계)번호</th>
							<th>보험료</th>
							<th>보험사</th>
							<th>상태</th>
							<th>이메일</th>
							<th>메모</th>
							<th>담당자</th>
						</tr>
					</thead>
					<tbody>
						<!-- AJAX로 데이터 로드 -->
					</tbody>
				</table>
				<div class="pagination"></div>

		<!-- 여기에 메인 콘텐츠가 표시됩니다 -->
        </div>
    </div>







     


    <div id="modal" class="modal">
        <div class="modal-content">
            <button class="close-modal">X</button>
            <div id="modal-body">
                <!-- 계약자 정보 -->
				<input type='hidden' id='questionwareNum'><!--questonware-->
				<input type='hidden' id='school9'>
				<input type='hidden' id='inscompany'>
                <h5>1. 계약자 정보</h5>
                <table>
                    <tr>
                        <th>사업자번호</th>
                        <td><input class='etc-input' type="text" id="school2" ></td>
                        <th>계약자</th>
                        <td><input class='etc-input' type="text" id="school1" ></td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td colspan="3"><textarea class='etc-input'  id="school3" rows="2" ></textarea></td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td><input class='etc-input'  type="text" id="school4" ></td>
                        <th>이메일</th>
                        <td><input class='etc-input'  type="text" id="school5" ></td>
                    </tr>
                </table>

                <!-- 현장실습 관련 사항 -->
                <h5>2. 현장실습 관련 사항</h5>
				<table class="info-table">
					<tr>
						<th>현장실습시기</th>
						<td >
						   <div class="radio-group">
								<label class="radio-label"><input type="radio" name="school6" value="1"> 1학기</label>
								<label class="radio-label"><input type="radio" name="school6" value="2"> 하계계절</label>
								<label class="radio-label"><input type="radio" name="school6" value="3"> 2학기</label>
								<label class="radio-label"><input type="radio" name="school6" value="4"> 동계계절</label>
							</div>

						</td>
					</tr>
					<tr>
						<th>실습기간(보험기간)</th>
						<td>
							<input type="text" id="school7" class="date-input etc-input" placeholder="보험시작일" > ~ 
							<input type="text" id="school8" class="date-input etc-input" placeholder="보험종료일" >
						</td>
					</tr>
				</table>
				<h5>3. 가입유형</h5>
				<table >

				  <tr>
					<th width='25%' rowspan='2'>보장내용</th>
					
					<th width='75%' colspan='2'>가입유형선택</th>
				  </tr>
					<tr>
					 <th><div class="radio-group"><label class="radio-label"><input type="radio" class='plan' name='plan' value="1"> PLAN A</label></div></th>
					
					<th><div class="radio-group"><label class="radio-label"><input type="radio" class='plan' name='plan' value="2"> PLAN B</label></div></th>
				  </tr>
				   <tr>
					<th>대인 및 대물 보상 </th>
					<td>1사고당 <span id='daein1'></span>억원</td><!--2-->
					<td>1사고당 <span id='daein2'></span>억원</td><!--3-->
				  </tr>
				   <tr>
					<th>산재보험 초과 <br>사용자배상 </th>
					<td>1사고당 <span id='daein3'></span>억원</td><!--2-->
					<td>1사고당 <span id='daein4'></span>억원</td><!--3-->
				  </tr>
				  <tr>
					<th>배상책임 자기부담금 </th>
					<td>1십만원</td>
					<td>1십만원</td>
				  </tr>
				  <tr>
					<th>실습 중 치료비 </th>
					<td>1인당 및 1사고당 : 1천만원</td>
					<td>1인당 및 1사고당 : 1천만원</td>
				  </tr>

				</table>
                <!-- 참여인원 -->
                <h5>4. 실습기간 별 참여인원</h5>
                <table>
                    <tr>
                        <th>실습기간</th>
                        <th>참여인원</th>
                        <th>실습기간</th>
                        <th>참여인원</th>
                    </tr>
                    <!-- 반복 생성된 주차와 참여인원 -->
                    <script>
                        for (let i = 4; i <= 14; i ++) {
							let j=i + 12;
							
                            document.write(`
                                <tr>
                                    <td class='walign'>${i}주</td>
                                    <td><input  type="text" class="week-input" id="week${i}" ></td>
                                    <td class='walign'>${j}주</td>
                                    <td ><input class="week-input" type="text" id="week${j}" ></td>
                                </tr>
                            `);
                        }
                    </script>

					<tr>
						<td class='walign'>15주</td>
						<td><input  type="text" class="week-input" id="week15" ></td>
						<td class='walign'>대인보험료 <span id='daein'></td>
						<td >대물보험료 <span id='daemool'></td>
					</tr>
					<tr>
					<td colspan='2'>총 참여인원 수 </td>
					<td><span id='week_total' >명</td>
					<td>보험료계 <span id='totalP'></td>
				  </tr>
				  <tr>
					<td colspan='4'><input type="submit"  id="write_" class="btn btn-primary" value="작성완료"/></td>
				  </tr>
                </table>
            </div>
        </div>
    </div>
    
	<!-- 두 번째 모달 -->
    <div id="second-modal" class="modal">
        <div class="modal-content">
            <button class="close-modal">X</button>
            <div id="second-modal-body">
                <input type='hidden' id='questionwareNum_'><!--questionware-->
				<input type='hidden' id='school9_'>
				<input type='hidden' id='inscompany_'>
				<input type='hidden' id='cNum_' /><!--아이디-->
				<input type='hidden' id='userName' value='<?=$userName?>'>
				 <!-- 두 번째 모달 내용 -->
				<div style="display: flex; align-items: center; justify-content: space-between;">
					<span id="beforegabunho"></span>
					<select id="mem-id-select" class="styled-select"></select>
				</div>
                <table>

					 <tr> 
						<td width='12%'>사업자번호</td>
						<td width='38%'><span id='school_2'></span></td>
						<td width='12%'>계약자</td>
						<td width='38%'><span id='school_1'></span></td>
					  </tr>
					 <tr> 
						<td>주소</td>
						<td colspan='3'><span id='school_3'></span></td>
					 </tr>
					  <tr> 
						<td>연락처</td>
						<td><span id='school_4'></span></td>
						<td>이메일</td>
						<td><span id='school_5'></span></td>
					  </tr>
					 <tr> 
						<td>시기</td>
						<td><span id='school_6'></span></td>
						<td>실습기간</td>
						<td><span id='school_7'></span>~<span id='school_8'></span></td>
					   </tr>
					   <tr> 
						<td>가입유형</td>
						<td colspan='3'><span id='school_9'></span>    대인대물 한도<span id='daein1_'></span>  산재초과 대인대물<span id='daein2_'></span></td>
					   </tr>
					    <td colspan='4'><span id='inwon'></span></td>
					   <tr> 
						<td colspan='4'>  대인보험료: <span id='daein_'></span> 대물보험료 : <span id='daemool_'></span>합계보험료 :<span id='totalP_'></span></td>
					   </tr>
					</table>
					<table class="styled-table">
					<tr>
						<td class="label-cell">가입 설계번호</td>
						<td colspan="2">
							<input type="text" id="gabunho-input" class="styled-input" placeholder="가입 설계번호를 입력하세요" />
						</td>
						<td>
							<button id="save-gabunho-btn" class="btn-primary">저장</button>
						</td>
					</tr>
				</table>
            </div>
        </div>
    </div>
     <!-- 두번째 모달-->
	<script>
        $(document).on('click', '.open-modal', function (e) {
				e.preventDefault();
                const num = $(this).data('num');
                $.ajax({
                    url: '_db/get_questionnaire_details.php',
                    method: 'GET',
                    data: { id: num },
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            // 데이터를 채움
							console.log(response.daeinP+'/'+response.daemoolP+'/'+response.data.week_total)
							$('#questionwareNum').val(response.data.num);

							if(response.data.num){
								$('#write_').val('수정');
							}
                            $('#school1').val(response.data.school1);
                            $('#school2').val(response.data.school2);
                            $('#school3').val(response.data.school3);
                            $('#school4').val(response.data.school4);
                            $('#school5').val(response.data.school5);
						    $("input[name='school6'][value='" + response.data.school6 + "']").prop("checked", true);
                            $('#school7').val(response.data.school7); //보험기간
                            $('#school8').val(response.data.school8);
							$('#school9').val(response.data.school9);
							$("input[name='plan'][value='" + response.data.school9 + "']").prop("checked", true);
							if(response.data.directory==2){  //고등학교 1억, 2억, 대학교2억,3억

									$("#daein1_").html('1');
									$("#daein2_").html('2');
									$("#daein3").html('1');
									$("#daein4").html('2');
								}else{

									$("#daein1").html('2');
									$("#daein2").html('3');
									$("#daein3").html('2');
									$("#daein4").html('3');

								}
							$('#daein').html(response.daeinP);
							$('#daemool').html(response.daemoolP);

							$('#week_total').html(response.data.week_total);
							$('#totalP').html(response.preiminum);
							for (let i = 4; i <= 26; i++) {
								//console.log(response.data.week5);
                                $(`#week${i}`).val(response.data[`week${i}`] || '0');
                            }
                            $('#modal').fadeIn();
							 const inputs = document.querySelectorAll(".week-input");

							// 모든 입력 필드에 대해 숫자 형식 적용
							inputs.forEach(input => {
								// 초기 값에 콤마 추가
								input.value = formatNumber(input.value);

								// 천 단위로 포맷하는 함수
								function formatNumber(value) {
									return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
								}
							});
                        } else {
                            alert(response.error);
                        }
                    },
                    error: function () {
                        alert('데이터 로드 실패.');
                    }
                });

				       // 모달 닫기
				$('.close-modal').on('click', function () {
					$('#modal').fadeOut();
				});

				// 모달 외부를 클릭하면 닫기
				$('#modal').on('click', function (e) {
					if ($(e.target).is('#modal')) {
						$(this).fadeOut();
					}
				});

	
            });//modal 끝

            $(document).on('click', '#write_', function (e) {
				e.preventDefault();				// 수정 버튼 클릭
			//$('#write_').on('click', function () {
				
				$('#daein').html('');
				$('#daemool').html('');

				$('#week_total').html('');
				$('#totalP').html('');
				const formData = {
					id:$('#questionwareNum').val(),
					school1: $('#school1').val(),
					school2: $('#school2').val(),
					school3: $('#school3').val(),
					school4: $('#school4').val(),
					school5: $('#school5').val(),
					school6: $('input[name="school6"]:checked').val(),
					school7: $('#school7').val(),
					school8: $('#school8').val(),
					school9: $('#school9').val(),
					plan: $('input[name="plan"]:checked').val(),
					totalP:$('#totalP').html().replace(/,/g, '')
				};

				// 주차별 참여인원 데이터를 추가
				for (let i = 4; i <= 26; i++) {
					formData[`week${i}`] = $(`#week${i}`).val().replace(/,/g, ''); // 숫자에서 콤마 제거
				}

				    
				// AJAX 요청으로 데이터 전송
				$.ajax({
					url: '_db/update_questionnaire.php', // 수정 요청을 처리하는 서버 스크립트
					method: 'POST',
					data: formData,
					dataType: 'json',
					success: function (response) {
						if (response.success) {
							alert('수정되었습니다.');

							$('#daein').html(response.daeinP);
							$('#daemool').html(response.daemoolP);

							$('#week_total').html(response.week_total);
							$('#totalP').html(response.Preminum);
							//$('#modal').fadeOut(); // 성공 후 모달 닫기
						} else {
							alert(response.error || '수정에 실패했습니다.');
						}
					},
					error: function () {
						alert('수정 요청 중 오류가 발생했습니다.');
					}
				});
			});
           

		   $(document).on('click', '.open-second-modal', function (e) {
				e.preventDefault();

				const num = $(this).data('num');
				$.ajax({
					url: '_db/get_questionnaire_details.php',
					method: 'GET',
					data: { id: num },
					dataType: 'json',
					success: function (response) {
						if (response.success) {
							// 전 설계번호 및 모달 열기
							if(response.beforeGabunho){
								$('#beforegabunho').html("전 설계번호:"+response.beforeGabunho);
							}else{
								$('#beforegabunho').html("신규");
							}
							$('#second-modal').fadeIn();
							$('#questionwareNum_').val(response.data.num);  // 현재 questionware num값이
							$('#school9_').val(response.data.school9);
							// 계약자 정보 설정
							const fields = ['school1', 'school2', 'school3', 'school4', 'school5', 'school7', 'school8'];
							fields.forEach(field => {
								$(`#${field.replace('school', 'school_')}`).html(response.data[field]);
							});

							// 현장실습 시기
							const periods = { "1": "1학기", "2": "하계", "3": "2학기", "4": "동계" };
							$('#school_6').html(periods[response.data.school6] || "알 수 없음");

							// 가입유형
							const joinType = response.data.school9 == 1 ? "가입유형 A" : "가입유형 B";
							$('#school_9').html(joinType);

							// 대인대물 설정
							const limits = response.data.directory == 2 ? { A: "2 억", B: "3 억" } : { A: "2 억", B: "3 억" };
							$("#daein1_").html(limits[response.data.school9 == 1 ? 'A' : 'B']);
							$("#daein2_").html(limits[response.data.school9 == 1 ? 'A' : 'B']);

							// 보험료 정보
							$('#daein_').html(response.daeinP);
							$('#daemool_').html(response.daemoolP);
							$('#totalP_').html(response.preiminum);




							// 참여인원 정보
							let inwons = "";
							for (let i = 4; i <= 26; i++) {
								if (response.data[`week${i}`] != 0) {
									inwons += `<span id="week_${i}">${i} 주</span> <span id="week_inwon${i}">${response.data[`week${i}`]} </span> 명, `;
								}
							}
							inwons += `총인원 : <span id="week_total_"></span>`;
							$('#inwon').html(inwons);
							$('#week_total_').html(response.data.week_total);

							$('#gabunho-input').val(response.data.gabunho);
							// mem_id 동적 로드
							$.ajax({
								url: '_db/get_idList.php',
								method: 'GET',
								dataType: 'json',
								success: function (memData) {
									const select = $('#mem-id-select');
									select.empty(); // 기존 옵션 초기화
									memData.forEach(item => {
										select.append(`<option value="${item.num}">${item.mem_id}</option>`);
									});
									select.append(`<option value="신규 id">신규ID</option>`);
									$('#mem-id-select').val(response.data.cNum); // 현재 선택된 값 설정
								},
								error: function () {
									alert('mem_id 데이터를 가져오는 데 실패했습니다.');
								}
							});
						} else {
							alert(response.error);
						}
					},
					error: function () {
						alert('두 번째 데이터 로드 실패.');
					}


				});

				// 모달 닫기
				$('.close-modal').on('click', function () {
					$(this).closest('.modal').fadeOut();
				});

				// 모달 외부를 클릭하면 닫기
				$('.modal').on('click', function (e) {
					if ($(e.target).is('.modal')) {
						$(this).fadeOut();
					}
				});
		   });


		   //가입설계번호 입력
			 $(document).on('click', '#save-gabunho-btn', function (e) {
				e.preventDefault();				// 수정 버튼 클릭
					const gabunho = $('#gabunho-input').val(); // 가입 설계번호 입력 값
					const num = $('#questionwareNum_').val(); // questionware num값
					const userName=$('#userName').val();

					if (!gabunho.trim()) {
						alert('가입 설계번호를 입력하세요.');
						return;
					}

					$.ajax({
						url: '_db/update_gabunho.php', // 업데이트 처리용 PHP 스크립트
						method: 'POST',
						data: { gabunho: gabunho, num: num,userName:userName },
						dataType: 'json',
						success: function (response) {
							if (response.success) {
								alert('가입 설계번호가 성공적으로 저장되었습니다.');
								//$('#beforegabunho').html(gabunho); // UI 업데이트
							} else {
								alert('저장 실패: ' + response.error);
							}
						},
						error: function () {
							alert('가입 설계번호 저장 중 오류가 발생했습니다.');
						}
					});
				});
    </script>
</body>
</html>
