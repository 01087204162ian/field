$(document).on('click', '#claimStore', function (e) {
    e.preventDefault();
	const certi = $('#certi__').html();
    if (!certi) {
        alert('증권번호가 없습니다. 저장할 수 없습니다.');
        return; // 값이 없으면 함수 종료
    }

	const accidentDescription = $('#accidentDescription').val();
    if (!accidentDescription) {
        alert('사고경위는 필수 입력입니다.');
        return; // 값이 없으면 함수 종료
    }
    // 데이터 수집
    const claimData = {
		school1:$('#school_1_').html(),			//questionnaire school1 학교명
		qNum:$('#questionNum__').val(),			//questionnaire Table num
		cNum:$('#cNum__').val(),					//2014Costmer Table num
		claimNum__:$('#claimNum__').val(),		//claim Table 의 num값
        certi: $('#certi__').html(),			// 증권번호
        claimNumber: $('#claimNumber').val(),	// 사고 접수번호
        wdate_2: $('#wdate_2').val(),			// 보험금지급일
		wdate_3: $('#wdate_3').val(),			// 사고일자
        claimAmout: $('#claimAmout').val().replace(/,/g, ''), // 보험금에서 천 단위 컴머 제거
        student: $('#student').val(),					// 학생명
        accidentDescription: $('#accidentDescription').val(), // 사고경위
        manager: $('#userName__').val(),		// 담당 매니저
        damdanga: $('#damdanga_').val(),		// 학교 선생님
        damdangat: $('#damdangat_').val()		// 학교 선생님 연락처
    };

    // 데이터 전송
    $.ajax({
        url: 'api/claim/claim_store.php', // 데이터를 처리할 PHP 파일
        method: 'POST',
        data: claimData,
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                // num 값을 받아와 claimNum__ 업데이트
                const num = response.num;
                $('#claimNum__').val(num);

                // claimStore 버튼의 레이블 변경
                $('#claimStore').text('클레임수정');

                // 성공 메시지
                alert(response.message);
            } else {
                alert('오류 발생: ' + response.error);
            }
        },
        error: function () {
            alert('데이터 저장에 실패했습니다.');
        }
    });
});
$(document).on('input', '#damdangat_', function () {
    let input = $(this).val().replace(/\D/g, ''); // 숫자만 남기기

    // 11자리 번호 형식 (010-0000-0000)
    if (input.length === 11) {
        input = input.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 10자리 번호 형식 (010-000-0000)
    else if (input.length === 10) {
        input = input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    // 9자리 번호 형식 (00-000-0000)
    else if (input.length === 9) {
        input = input.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }

    // 입력값 업데이트
    $(this).val(input);
});
// 클릭하면 하이픈 제거
$(document).on('focus', '#damdangat_', function () {
    const rawValue = $(this).val().replace(/-/g, ''); // 하이픈 제거
    $(this).val(rawValue);
});
document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#wdate_2", {
        dateFormat: "Y-m-d", // 날짜 형식 (YYYY-MM-DD)
        allowInput: true // 직접 입력 허용
    });
})
document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#wdate_3", {
        dateFormat: "Y-m-d", // 날짜 형식 (YYYY-MM-DD)
        allowInput: true // 직접 입력 허용
    });
});