
$(document).on('click', '.open-modal', function (e) {
	
		e.preventDefault();
		const num = $(this).data('num');

		$.ajax({
			url: 'api/get_questionnaire_details.php',
			method: 'GET',
			data: { id: num },
			dataType: 'json',
			success: function (response) {
				if (response.success) {
					// 데이터를 채움
					//console.log(response.daeinP+'/'+response.daemoolP+'/'+response.data.week_total)
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
			url: 'api/update_questionnaire.php', // 수정 요청을 처리하는 서버 스크립트
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
			url: 'api/get_questionnaire_details.php',
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

					$('#cNum_').val(response.data.cNum);
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
					$('#daein_').html(response.daeinP);  //대인보험료
					$('#daemool_').html(response.daemoolP);  //대물보험료
					$('#totalP_').html(response.preiminum);    //합계보험료




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

					$('#gabunho-input').val(response.data.gabunho);	//청약번호
					$('#certi_').val(response.data.certi);					//증권번호


					$('#card-number').val(response.cardnum);			//카드번호
					$('#card-expiry').val(response.yymm);					//유효기간
					//$('#card-expiry').val(response.data.cardap);		//승인번호
					$('#bank-name').val(response.bankname);			// 은행명
					$('#bank-account').val(response.bank);				//계좌번호
					$('#damdanga').val(response.damdanga);				//담당자
					$('#damdangat').val(response.damdangat);			//담당자 연락처

					// mem_id 동적 로드
					$.ajax({
						url: 'api/get_idList.php',
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
			// 가입 설계번호 저장 (클릭, blur, Enter 이벤트 처리)
	$(document).on('keyup', '#gabunho-input', function (e) {
		if ((e.type === 'keyup' && e.key === 'Enter')) {
			const gabunho = $('#gabunho-input').val(); // 가입 설계번호 입력 값
			const num = $('#questionwareNum_').val(); // questionware num값
			const userName = $('#userName').val();

			if (!gabunho.trim()) {
				alert('가입 설계번호를 입력하세요.');
				return;
			}

			$.ajax({
				url: 'api/update_gabunho.php', // 업데이트 처리용 PHP 스크립트
				method: 'POST',
				data: { gabunho: gabunho, num: num, userName: userName },
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
		}
	});

   // 가입 설계번호 저장 (클릭, blur, Enter 이벤트 처리)
	$(document).on('keyup', '#certi_', function (e) {
		if (e.type === 'keyup' && e.key === 'Enter') {
			const certi_ = $('#certi_').val(); // 가입 설계번호 입력 값
			const num = $('#questionwareNum_').val(); // questionware num값
			const userName = $('#userName').val();

			if (!certi_.trim()) {
				alert('증권번호를 입력하세요.');
				return;
			}

			$.ajax({
				url: 'api/update_certi_.php', // 업데이트 처리용 PHP 스크립트
				method: 'POST',
				data: { certi_: certi_, num: num, userName: userName },
				dataType: 'json',
				success: function (response) {
					if (response.success) {
						alert('증권번호가 성공적으로 저장되었습니다.');
						//$('#beforegabunho').html(gabunho); // UI 업데이트
					} else {
						alert('저장 실패: ' + response.error);
					}
				},
				error: function () {
					alert('증권번호 저장 중 오류가 발생했습니다.');
				}
			});
		}
	});

	//실적 
	$(document).on('click', '#performance', function (e) {
		e.preventDefault();
		$("#day__").html('');
		$("#year_").children().remove();	
		$("#month_").children().remove();	
		$("#day_list").children().remove();	
		$("#changeP").children().remove();	
		perFormance();//일별실적조회
		$('#sjModal').fadeIn();


		// 모달 닫기 버튼 클릭 시
			$('.close-modal').on('click', function () {
				$('#sjModal').fadeOut();
			});

			// 모달 외부를 클릭하면 닫기
			$(document).on('click', function (e) {
				// 클릭한 대상이 모달 자체이거나 모달 내부의 요소가 아니면 닫기
				if ($(e.target).is('#sjModal')) {
					$('#sjModal').fadeOut();
				}
			});
	});


	//카드번호 입력

	document.getElementById('card-number').addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				const cardNumber = this.value;
				const cNum_ = document.getElementById('cNum_').value;

				if (cardNumber && cNum_) {
					// AJAX 호출로 PHP 업데이트 실행
					const xhr = new XMLHttpRequest();
					xhr.open('POST', 'api/update_cardnum.php', true);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.onreadystatechange = function() {
						if (xhr.readyState === 4 && xhr.status === 200) {
							alert(xhr.responseText); // 응답 메시지 출력
						}
					};
					xhr.send('num=' + encodeURIComponent(cNum_) + '&cardnum=' + encodeURIComponent(cardNumber));
				} else {
					alert('카드 번호와 Num 값을 입력하세요.');
				}
			}
	});

	//유효기간 입력

	document.getElementById('card-expiry').addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				const card_expiry = this.value;
				const cNum_ = document.getElementById('cNum_').value;

				if (card_expiry && cNum_) {
					// AJAX 호출로 PHP 업데이트 실행
					const xhr = new XMLHttpRequest();
					xhr.open('POST', 'api/update_yymm.php', true);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.onreadystatechange = function() {
						if (xhr.readyState === 4 && xhr.status === 200) {
							alert(xhr.responseText); // 응답 메시지 출력
						}
					};
					xhr.send('num=' + encodeURIComponent(cNum_) + '&yymm=' + encodeURIComponent(card_expiry));
				} else {
					alert('카드 번호와 Num 값을 입력하세요.');
				}
			}
	});

	//은행명 입력

	document.getElementById('bank-name').addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				const bank_name = this.value;
				const cNum_ = document.getElementById('cNum_').value;

				if (bank_name && cNum_) {
					// AJAX 호출로 PHP 업데이트 실행
					const xhr = new XMLHttpRequest();
					xhr.open('POST', 'api/update_bank_name.php', true);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.onreadystatechange = function() {
						if (xhr.readyState === 4 && xhr.status === 200) {
							alert(xhr.responseText); // 응답 메시지 출력
						}
					};
					xhr.send('num=' + encodeURIComponent(cNum_) + '&bankName=' + encodeURIComponent(bank_name));
				} else {
					alert('카드 번호와 Num 값을 입력하세요.');
				}
			}
	});

	//계좌번호 입력

	document.getElementById('bank-account').addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				const bank_account = this.value;
				const cNum_ = document.getElementById('cNum_').value;

				if (bank_account && cNum_) {
					// AJAX 호출로 PHP 업데이트 실행
					const xhr = new XMLHttpRequest();
					xhr.open('POST', 'api/update_bank_account.php', true);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.onreadystatechange = function() {
						if (xhr.readyState === 4 && xhr.status === 200) {
							alert(xhr.responseText); // 응답 메시지 출력
						}
					};
					xhr.send('num=' + encodeURIComponent(cNum_) + '&bank=' + encodeURIComponent(bank_account));
				} else {
					alert('카드 번호와 Num 값을 입력하세요.');
				}
			}
	});

	//담당자 입력

	document.getElementById('damdanga').addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				const damdanga = this.value;
				const cNum_ = document.getElementById('cNum_').value;

				if (damdanga && cNum_) {
					// AJAX 호출로 PHP 업데이트 실행
					const xhr = new XMLHttpRequest();
					xhr.open('POST', 'api/update_damdanga.php', true);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.onreadystatechange = function() {
						if (xhr.readyState === 4 && xhr.status === 200) {
							alert(xhr.responseText); // 응답 메시지 출력
						}
					};
					xhr.send('num=' + encodeURIComponent(cNum_) + '&damdanga=' + encodeURIComponent(damdanga));
				} else {
					alert('카드 번호와 Num 값을 입력하세요.');
				}
			}
	});

	//담당자 연락처입력

document.getElementById('damdangat').addEventListener('keypress', function(event) {
		if (event.key === 'Enter') {	
			let input = this.value.replace(/\D/g, ''); // 숫자만 추출
			let formattedNumber = '';

			if (input.length === 11) {
				// 11자리 -> 000-0000-0000
				formattedNumber = input.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
			} else if (input.length === 10) {
				// 10자리 -> 000-000-0000
				formattedNumber = input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
			} else if (input.length === 9) {
				// 9자리 -> 00-000-7383
				formattedNumber = input.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
			} else {
				alert('9자리, 10자리, 또는 11자리 번호만 입력 가능합니다.');
				return;
			}

			this.value = formattedNumber; // 입력 필드에 형식화된 번호를 표시
			const damdangat = this.value;
			const cNum_ = document.getElementById('cNum_').value;

			if (damdangat && cNum_) {
				// AJAX 호출로 PHP 업데이트 실행
				const xhr = new XMLHttpRequest();
				xhr.open('POST', 'api/update_damdangat.php', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.onreadystatechange = function() {
					if (xhr.readyState === 4 && xhr.status === 200) {
						alert(xhr.responseText); // 응답 메시지 출력
					}
				};
				xhr.send('num=' + encodeURIComponent(cNum_) + '&damdangat=' + encodeURIComponent(damdangat));
			} else {
				alert('카드 번호와 Num 값을 입력하세요.');
			}
		}
});
document.getElementById('damdangat').addEventListener('click', function() {
    const inputField = this.value;
    this.value = inputField.replace(/-/g, ''); // 하이픈 제거
});
	//질문서 프린트
	document.getElementById('print-questionnaire').addEventListener('click', function () {
    // 전달할 변수 가져오기
			const questionwareNum = document.getElementById('questionwareNum_').value;

			// GET 요청 URL 생성
			const url = `/2014/_pages/php/downExcel/claim2.php?claimNum=${encodeURIComponent(questionwareNum)}`;

			// 새 창 열기
			window.open(url, '_blank');
		});

		//청약서 프린트
	document.getElementById('print-application').addEventListener('click', function () {
    // 전달할 변수 가져오기
			const questionwareNum = document.getElementById('questionwareNum_').value;

			// GET 요청 URL 생성
			const url = `/2014/_pages/php/downExcel/claim3.php?claimNum=${encodeURIComponent(questionwareNum)}`;

			// 새 창 열기
			window.open(url, '_blank');
		});

	//공문
	/*document.getElementById('print-application').addEventListener('click', function () {
    // 전달할 변수 가져오기
			const questionwareNum = document.getElementById('questionwareNum_').value;

			// GET 요청 URL 생성
			const url = `/2014/_pages/php/downExcel/claim6.phpp?claimNum=${encodeURIComponent(questionwareNum)}`;

			// 새 창 열기
			window.open(url, '_blank');
		}); */

	//무사고 확인서 
	document.getElementById('no-accident-check').addEventListener('click', function () {
    // 전달할 변수 가져오기
			const questionwareNum = document.getElementById('questionwareNum_').value;

			// GET 요청 URL 생성
			const url = `/2014/_pages/php/downExcel/claim7.php?claimNum=${encodeURIComponent(questionwareNum)}`;

			// 새 창 열기
			window.open(url, '_blank');
		});
	//가입안내문
	document.getElementById('send-guide').addEventListener('click', function () {
    // 전달할 변수 가져오기
			const questionwareNum = document.getElementById('questionwareNum_').value;

			// GET 요청 URL 생성
			const url = `/2014/_pages/php/downExcel/claim9.php?claimNum=${encodeURIComponent(questionwareNum)}`;

			// 새 창 열기
			window.open(url, '_blank');
		});

	//아이디 메일로 보내기 send-id-email
	document.getElementById('send-id-email').addEventListener('click', function () {
    // 전달할 변수 가져오기
			const questionwareNum = document.getElementById('questionwareNum_').value;

			$.ajax({
                url: 'api/email_send.php',
                method: 'POST',
                data: { num:questionwareNum},
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        alert('성공적 발송완료!!.');
                    } else {
                        alert('메일 발송 중 오류가 발생했습니다.');
                    }
                },
                error: function () {
                    alert('메모 업데이트 요청 실패.');
                }
            });
		});




			//공지 사항

			document.getElementById('noticeSelect').addEventListener('change', function () {
				const noticeSelect = this.value;
				console.log('Selected option:',noticeSelect);

				const email = document.getElementById('school_5').innerHTML;

				console.log('email',email); 

				 if (!email || noticeSelect == -1) {
						alert("이메일과 공지사항을 올바르게 선택하세요.");
						return;
					}

				if (!confirm(`[${email}] 으로 해당 이메일을 발송하시겠습니까?`)) {
					return;
				}


				// 공지사항 템플릿 설정
					const templates = {
							1: {
								title: "[한화 현장실습보험] 보험금 청구시 필요서류 안내",
								content: `
									<div>
										안녕하십니까.<br><br>
										현장실습보험 문의에 깊이 감사드립니다.<br><br>
										1. 보험금 청구서(+필수 동의서) 및 문답서 (첨부파일 참고)<br>
										* 보험금 청구 기간은 최대 1년까지 가능합니다.<br><br>
										2. 신분증 및 통장사본<br><br>
										3. 진단서 또는 초진차트<br><br>
										4. 병원치료비 영수증(계산서)_치료비세부내역서, 약제비 영수증<br><br>
										5. 실습기관의 현장실습 출석부 사본 또는 실습일지<br><br>
										6. 학생 학적을 확인할 수 있는 학교 전산 캡처본<br><br>
										7. 보험금 청구서 밑의 법정대리인의 서명, 가족관계증명서, 보호자 신분증 및 통장사본<br>
										(고등학생 현장 실습 사고 접수 경우만 해당)<br><br>
										위 서류들을 구비하셔서 메일 답장으로 부탁드립니다.<br><br>
										자세한 사항은 현장실습 홈페이지(<a href='http://lincinsu.kr/'>http://lincinsu.kr/</a>)의 보상안내, 공지사항에서도 확인하실 수 있습니다.
										<br><br>감사합니다.<br><br><hr>
										<p style='font-size: 8px; color: #00A000;'>이투엘보험대리점</p>
										<p style='font-size: 8px; color: #00A000;'>현장실습보험지원팀</p>
										<p style='font-size: 8px; color: #00A000;'>1533-5013</p><br>
										현장실습보험은 <span style='color: #FB2C10;'>한화손해보험</span>에서 제공합니다.
									</div>
								`,
								attachfile: "./static/lib/attachfile/보험금 청구서,동의서,문답서_2023.pdf",
							},
							2: {
								title: "[이용안내문] 한화 현장실습 보험 이용 안내문",
								content: `
									<div>
										안녕하십니까.<br><br>
										현장실습보험 문의에 깊이 감사드립니다.<br><br>
										현장실습 이용방법이 담긴 안내문 첨부파일로 전달드립니다.<br><br>
										<a href="http://lincinsu.kr/">현장실습 홈페이지 바로가기</a><br><br>
										감사합니다.<br><br><hr>
										<p style='font-size: 8px; color: #00A000;'>이투엘보험대리점</p>
										<p style='font-size: 8px; color: #00A000;'>현장실습보험지원팀</p>
										<p style='font-size: 8px; color: #00A000;'>1533-5013</p><br>
										현장실습보험은 <span style='color: #FB2C10;'>한화손해보험</span>에서 제공합니다.
									</div>
								`,
								attachfile: "./static/lib/attachfile/한화 현장실습 보험 안내 팜플렛.pdf",
							},
							3: {
								title: "[한화 현장실습보험] 무사고 확인서 요청",
								content: (() => {
									var musagourl = question7_mail();
									return `
										<div>
											안녕하십니까.<br><br>
											보험 시작일이 설계일보다 앞서 무사고 확인서를 전달드립니다.<br><br>
											첨부된 파일의 입금일에 입금 또는 카드결제하실 날짜 기입 후<br><br>
											하단에 명판직인 날인하여 회신 주시면 청약서 발급 후 전달드리겠습니다.<br><br>
											하기 링크 확인 부탁드립니다.<br><br>
											<a href='https://www.lincinsu.kr/${musagourl}'>무사고 확인서 링크</a><br><br>
											감사합니다.<br><br><hr>
											<p style='font-size: 8px; color: #00A000;'>이투엘보험대리점</p>
											<p style='font-size: 8px; color: #00A000;'>현장실습보험지원팀</p>
											<p style='font-size: 8px; color: #00A000;'>1533-5013</p><br>
											현장실습보험은 <span style='color: #FB2C10;'>한화손해보험</span>에서 제공합니다.
										</div>
									`;
								})(),
								attachfile: ".",
							},
						};



					// 템플릿 데이터 가져오기
					const selectedTemplate = templates[noticeSelect];
					//console.log("templates[noticeSelect]",templates[noticeSelect]);
					if (!selectedTemplate) {
						alert("유효하지 않은 공지사항입니다.");
						return;
					}

					//AJAX 요청 데이터 설정
						const formData = new FormData();
						formData.append("email", email);
						formData.append("title", selectedTemplate.title);
						formData.append("content", selectedTemplate.content);
						formData.append("attachfile", selectedTemplate.attachfile);

						// URL 결정
						const url =
							noticeSelect == 3
								? "api/musagoNotice.php"
								: "api/notice.php";

						// AJAX 요청
						$.ajax({
							type: "POST",
							url: url,
							dataType: "text",
							cache: false,
							contentType: false,
							processData: false,
							data: formData,
							success: function () {
								alert("메일이 성공적으로 발송되었습니다.");
							},
							error: function (request, error) {
								alert(
									`에러 발생: code=${request.status}, message=${request.responseText}, error=${error}`
								);
							},
						});
   
			});
		function question7_mail(){ //무사고 확인서

				var claimNum=document.getElementById('questionwareNum_').value;
				var winl = (screen.width - 1024) / 2
				var wint = (screen.height - 768) / 2

				// window.open('/2014/_pages/php/downExcel/claim7.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');
				var url = '/2014/_pages/php/downExcel/claim7.php?claimNum='+claimNum;
				return url;
			}
				

			

$(document).on('click', '.open-claim-modal', function (e) {
		e.preventDefault();
        const num = $(this).data('num');
		$('#questionNum__').val(num);
		$.ajax({
			url: 'api/get_questionnaire_details.php',
			method: 'GET',
			data: { id: num },
			dataType: 'json',
			success: function (response) {
				if (response.success) {
					
					$('#third-modal').fadeIn();
					$('#certi__').html(response.data.certi);
					//$('#questionwareNum_-').val(response.data.num);  // 현재 questionware num값이
					$('#school_1_').html(response.data.school1);   
					$('#school_2_').html(response.data.school2);
					$('#school_3_').html(response.data.school3);
					$('#school_4_').html(response.data.school4);
					$('#school_5_').html(response.data.school5);
					
					$('#school_7_').html(response.data.school7);
					$('#school_8_').html(response.data.school8);
					// 현장실습 시기
					const periods = { "1": "1학기", "2": "하계", "3": "2학기", "4": "동계" };
					$('#school_6_').html(periods[response.data.school6] || "알 수 없음");

					// 가입유형
					const joinType = response.data.school9 == 1 ? "가입유형 A" : "가입유형 B";
					$('#school_9_').html(joinType);

					// 대인대물 설정
					const limits = response.data.directory == 2 ? { A: "2 억", B: "3 억" } : { A: "2 억", B: "3 억" };
					$("#daein1__").html(limits[response.data.school9 == 1 ? 'A' : 'B']);
					$("#daein2__").html(limits[response.data.school9 == 1 ? 'A' : 'B']);

					$('#cNum__').val(response.data.cNum);
					//초기화 
					 $('#claimNum__').val(''),		//claim Table 의 num값 		
					 $('#claimNumber').val(''),	// 사고 접수번호
					 $('#claimAmout').val(''),		// 보험금
					 $('#student').val(''),					// 학생명
					 $('#accidentDescription').val(''), // 사고경위
					 $('#damdanga_').val(''),		// 학교 선생님
					 $('#damdanga_').val('')		// 학교 선생님 연락처


					

				

					
				} else {
					alert(response.error);
				}
			},
			error: function () {
				alert(' claim 로드 실패.');
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
 

