$(document).ready(function () {
    const itemsPerPage = 15;
    let searchSchool = ''; // 검색 조건
    let searchMode = 1; // 검색 모드 (1: 정확히 일치, 2: 포함 검색)

    // 테이블 로드
      function loadTable(page = 1, searchSchool = '', searchMode = 1) {
        const $tableBody = $("#questionnaire-table tbody");
        const $pagination = $(".pagination");

        // 로딩 표시
        $tableBody.html('<tr><td colspan="14" class="loading">데이터 로드 중...</td></tr>');
        $pagination.empty();

        $.ajax({
            url: "api/fetch_questionnaire.php",
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
												<td><a href="#" class="btn-link open-second-modal" data-num="${item.num}">${(page - 1) * itemsPerPage + index + 1}</a></td>
												<td><a href="#" class="btn-link open-modal" data-num="${item.num}">${item.school2}</a></td>
												<td>${item.school1}</td>
												<td>${item.week_total}</td>
												<td>${item.school4}</td>
												<td>${item.wdate}</td>
												<td>${item.certi || item.gabunho || ""}</td>
												<td class="preiminum">${formattedPreiminum}</td>
												<td>${insuranceOptions}</td>
												<td>${statusOptions}</td>
												<td>${item.school5}</td>
												<td><a href="#" class="btn-link upload-modal" data-num="${item.num}">업로드</a></td>
												<td>${item.certi ? `<a href="#" class="btn-link open-claim-modal" data-num="${item.num}">클레임</a>` : ''}</td>
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
    $(document).on('click', '#search-btn', function (e) {
        e.preventDefault();
        searchSchool = $("#search-school").val().trim();
        searchMode = parseInt($("input[name='search-mode']:checked").val()); // 검색 모드 가져오기

        if (!searchSchool) {
            alert("학교명을 입력하세요");
            $("#search-school").focus();
            return;
        }

        $("#questionnaire-table tbody").html('');
        $(".pagination").empty();

        loadTable(1, searchSchool, searchMode);
    });
    

    // 검색 필드 blur 및 Enter 이벤트
    $(document).on('blur keyup', '#search-school', function (e) {
        if (e.type === 'blur' || (e.type === 'keyup' && e.key === 'Enter')) {
            searchSchool = $(this).val().trim();
			searchMode = parseInt($("input[name='search-mode']:checked").val()); // 검색 모드 가져오기
            if (!searchSchool) {
                alert("학교명을 입력하세요");
                $(this).focus();
                return;
            }

            $("#questionnaire-table tbody").html('');
            $(".pagination").empty();

             loadTable(1, searchSchool, searchMode);
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
