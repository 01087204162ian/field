$(document).ready(function () {
    const itemsPerPage = 15;
    let searchSchool = ''; // 검색 조건
    let searchMode = 1; // 검색 모드 (1: 증권번호, 2: 사고접수번호ㄹ, 3: 학생명)

    // 테이블 로드
	 
  
      function loadTable(page = 1, searchSchool = '', searchMode = 1) {
        const $tableBody = $("#claim-table tbody");
        const $pagination = $(".pagination");

        // 로딩 표시
        $tableBody.html('<tr><td colspan="14" class="loading">데이터 로드 중...</td></tr>');
        $pagination.empty();

        $.ajax({
            url: "api/claim/fetch_claim.php",
            method: "GET",
			data: { page, limit: itemsPerPage, search_school: searchSchool, search_mode: searchMode },
            dataType: "json",
            success: function (response) {
                let rows = "";
				// 데이터 존재 여부 확인
				if (response.status === "no_results" || !response.data || response.data.length === 0) {
					rows = `<tr>
								<td colspan="13" style="text-align: center;">검색 결과가 없습니다.</td>
							</tr>`;
				} else {
							  // accidentDescription 글자 수 제한
							
							response.data.forEach((item, index) => {

								const truncatedAccidentDescription = item.accidentDescription
								? item.accidentDescription.substring(0,30)
								: "";

								const formattedPreiminum = item.claimAmout && !isNaN(parseFloat(item.claimAmout))
								? parseFloat(item.claimAmout).toLocaleString("en-US")
								: "";

						

								const statusOptions = `
									<select class="status-select" data-id="${item.num}">
										<option value="1" ${item.ch == 1 ? "selected" : ""}>접수</option>
										<option value="2" ${item.ch == 2 ? "selected" : ""}>미결</option>
										<option value="3" ${item.ch == 3 ? "selected" : ""}>종결</option>
										<option value="4" ${item.ch == 4 ? "selected" : ""}>면책</option>
										<option value="5" ${item.ch == 5 ? "selected" : ""}>취소</option>
									</select>
								`;
								item.claimNumber = (item.claimNumber === null) ? "" : item.claimNumber;
								rows += `<tr>
									<td><a href="#" class="btn-link open-third-modal" data-num="${item.num}">${(page - 1) * itemsPerPage + index + 1}</a></td>
									<td><a href="#" class="btn-link open-modal" data-num="${item.num}">${item.wdate}</a></td>
									<td>${item.school1}</td>
								     <td>${item.certi}</td>
									<td>${item.claimNumber}</td>
									<td>${statusOptions}</td>
									<td>${item.wdate_2}</td>
									<td class="preiminum">${formattedPreiminum}</td>
									<td>${item.student}</td>
									<td>${item.wdate_3}</td>
									<td>${truncatedAccidentDescription}</td>
									<td><a href="#" class="btn-link upload-modal" data-num="${item.num}">업로드</a></td>
									<td><input class='mText' type='text' value='${item.memo}' data-num="${item.num}"></td>
									<td>${item.manager}</td>
								</tr>`;
							});
				}

                $tableBody.html(rows);

                // 페이지네이션 생성
                const totalItems = response.total;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                renderPagination(page, totalPages);
            },
            error: function () {
                alert("데이터를 불러오는 중 오류가 발생했습니다.");
            }
        });
    }

    // 페이지네이션 렌더링
    function renderPagination(currentPage, totalPages) {
        const maxPagesToShow = 5;
        const $pagination = $(".pagination");
        $pagination.empty();

        if (currentPage > 1) {
            $pagination.append(`<a href="#" class="page-link" data-page="${currentPage - 1}">이전</a>`);
        }

        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            $pagination.append(
                `<a href="#" class="page-link ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</a>`
            );
        }

        if (currentPage < totalPages) {
            $pagination.append(`<a href="#" class="page-link" data-page="${currentPage + 1}">다음</a>`);
        }

        $(".page-link").click(function (e) {
            e.preventDefault();
            const page = parseInt($(this).data("page"));
            loadTable(page, searchSchool);
        });
    }

    // 초기 테이블 로드
    loadTable();

    // 검색 버튼 클릭

	// 검색 버튼 클릭 이벤트
     // 검색 버튼 클릭 이벤트
    $(document).on('click', '#search-btn', function (e) {
        e.preventDefault();
        searchSchool = $("#search-school").val().trim();
        searchMode = parseInt($("#cSelect").val()); // 검색 모드 가져오기 (학교명, 증권번호, 학생명,학교명)

        if (searchMode === -1) {
            alert("검색 조건을 먼저 선택하세요.");
            $("#cSelect").focus();
            return;
        }

        $("#claim-table tbody").html('');
        $(".pagination").empty();

        loadTable(1, searchSchool, searchMode);
    });

	// 검색 유형 선택 시 placeholder 변경
    $("#cSelect").change(function () {
        const selectedValue = $(this).val();
        let placeholderText = "";

        switch (selectedValue) {
            case "1":
                placeholderText = "증권번호를 입력하세요";
                break;
            case "2":
                placeholderText = "사고접수번호를 입력하세요";
                break;
            case "3":
                placeholderText = "학생명을 입력하세요";
                break;
			case "4":
                placeholderText = "학교명을 정확히 입력하세요";
                break;
            default:
                placeholderText = "검색어를 입력하세요";
        }

        $("#search-school").attr("placeholder", placeholderText);
    });
    

   $(document).on('blur keyup', '#search-school', function (e) {
    if (e.type === 'blur' || (e.type === 'keyup' && e.key === 'Enter')) {
        searchSchool = $(this).val().trim();
        searchMode = parseInt($("#cSelect").val()); // 검색 모드 가져오기

        if (!searchSchool) {
            alert("검색어를 입력하세요");
            $(this).focus();
            return;
        }

        $("#claim-table tbody").html(''); // 테이블 초기화
        $(".pagination").empty(); // 페이지네이션 초기화

        loadTable(1, searchSchool, searchMode); // 검색 실행
    }
});

    // 메모 업데이트 (blur 및 Enter)
    $(document).on('blur keyup', '.mText', function (e) {
        if (e.type === 'blur' || (e.type === 'keyup' && e.key === 'Enter')) {
            const memo = $(this).val().trim();
            const num = $(this).data('num');

            if (!memo) {
                alert('메모를 입력해주세요.');
                return;
            }

            $.ajax({
                url: 'api/update_memo.php',
                method: 'POST',
                data: { num, memo },
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        alert('메모가 성공적으로 수정되었습니다.');
                    } else {
                        alert('메모 수정 중 오류가 발생했습니다.');
                    }
                },
                error: function () {
                    alert('메모 업데이트 요청 실패.');
                }
            });
        }
    });

});
