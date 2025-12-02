
$(document).on('click', '.open-modal', function (e) {
	
		e.preventDefault();
		const num = $(this).data('num');

		$.ajax({
			url: 'api/claim/get_claim_details.php',
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
					$('#school1').val(response.school1);
					$('#school2').val(response.school2);
					$('#school3').val(response.school3);
					$('#school4').val(response.school4);
					$('#school5').val(response.school5);
					$("input[name='school6'][value='" + response.school6 + "']").prop("checked", true);
					$('#school7').val(response.school7); //보험기간
					$('#school8').val(response.school8);
					$('#school9').val(response.school9);
					$("input[name='plan'][value='" + response.school9 + "']").prop("checked", true);
					if(response.directory==2){  //고등학교 1억, 2억, 대학교2억,3억

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
   




   

	//실적 
	$(document).on('click', '#performance', function (e) {
		e.preventDefault();
	/*$("#day__").html('');
		$("#year_").children().remove();	
		$("#month_").children().remove();	
		$("#day_list").children().remove();	*/
		
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


      

	


	




	

	

	

	


	



			
				

			




