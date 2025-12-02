   /*



   /*/
   
   $(document).on('click', '.open-third-modal', function (e) {
		e.preventDefault();

		const num = $(this).data('num');
		$.ajax({
			url: 'api/claim/get_claim_details.php',
			method: 'GET',
			data: { id: num },
			dataType: 'json',
			success: function (response) {
				if (response.success) {
					
					
				    $('#certi__').html(response.data.certi);
					
						
					$('#third-modal').fadeIn();
					$('#claimNum__').val(response.data.num);  // 현재 questionware num값이
					//$('#school_9_').val(response.school9);

					
					// 계약자 정보 설정
					/*const fields = ['school1', 'school2', 'school3', 'school4', 'school5', 'school7', 'school8'];
					fields.forEach(field => {
						$(`#${field.replace('school', 'school_')}`).html(response[field]);
					});*/
					$('#school_1_').html(response.school1);
					$('#school_2_').html(response.school2);
					$('#school_3_').html(response.school3);
					$('#school_4_').html(response.school4);
					$('#school_5_').html(response.school5);
					
					$('#school_7_').html(response.school7);
					$('#school_8_').html(response.school8);
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

			

				

					$('#claimStore').text('클레임수정');
				

					$('#wdate_3').val(response.data.wdate_3);								//사고일자
					$('#claimNumber').val(response.data.claimNumber);					//사고접수번호

					$('#wdate_2').val(response.data.wdate_2);								//보험금 지급일
					const formattedPreiminum = response.data.claimAmout && !isNaN(parseFloat(response.data.claimAmout))
								? parseFloat(response.data.claimAmout).toLocaleString("en-US")
								: "";
					$('#claimAmout').val(formattedPreiminum);					//보험금
					$('#student').val(response.data.student);									//피해학생
					$('#accidentDescription').val(response.data.accidentDescription); //사고경위

					response.data.damdanga = (response.data.damdanga === `NULL`) ? "" : response.data.damdanga;
					$('#damdanga_').val(response.data.damdanga);
				
					response.data.damdangat = (response.data.damdangat === `NULL`) ? "" : response.data.damdangat;
					$('#damdangat_').val(response.data.damdangat);


					// mem_id 동적 로드
					
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

   // 천 단위 구분자가 포함된 입력 필드에서 클릭 시 제거
$(document).on('click', '#claimAmout', function () {
    const currentValue = $(this).val();
    // 천 단위 구분자를 제거하고 업데이트
    $(this).val(currentValue.replace(/,/g, ''));
});