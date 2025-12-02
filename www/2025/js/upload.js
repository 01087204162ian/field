 //업로드 버튼 모달

 $(document).on('click', '.upload-modal', function (e) {
			
				e.preventDefault();
                const  num = $(this).data('num');
				console.log(num);
				$('#qNum').val(num);

                $.ajax({
                    url: 'api/get_questionnaire_details.php',
                    method: 'GET',
                    data: { id: num },
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            // 데이터를 채움

							$('#uploadModal').fadeIn();
							
							
							$('#cName').html(response.data.school1);
      
							
							
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
					$('#uploadModal').fadeOut();
				});

				// 모달 외부를 클릭하면 닫기
				$('#uploadModal').on('click', function (e) {
					if ($(e.target).is('#uploadModal')) {
						$(this).fadeOut();
					}
				});
				//
				//  파일찾기
				const qnum = $('#qNum').val();
				
				fileSearch(qnum);


				//
	
            });//modal 끝

function fileSearch(qnum) {
	   $.ajax({
			url: 'api/get_filelist.php',
			method: 'GET',
			data: { id: qnum },
			dataType: 'json',
			success: function (fileData) {
				console.log(fileData);

				let rows = "";
				let i = 1;

				const kindMapping = {
					1: '카드전표',
					2: '영수증',
					3: '기타',
					4: '청약서',
					5: '과별인원',
					6: '보험사사업자등록증',
					7: '보험증권'
				};

				fileData.forEach((item) => {
					const filePath = item.description2;
					const fileName = filePath.split('/').pop();
					const kind = kindMapping[item.kind] || '알 수 없음';

					rows += `<tr>
								<td>${i}</td>
								<td>${kind}</td>
								<td>${item.bunho}</td>
								<td><a href="${filePath}" download target="_blank" class="file-link">${fileName}</a></td>
								<td>${item.wdate}</td>
								<td><button class='dButton' data-num="${item.num}">삭제</button></td>
							 </tr>`;
					i++;
				});

				$("#file_list").html(rows);
			},
			error: function () {
				alert('file 데이터를 가져오는 데 실패했습니다.');
				console.error('Ajax 호출 실패: api/get_filelist.php');
			}
		});
}

// 삭제 버튼 클릭 이벤트
$(document).on('click', '.dButton', function (e) {
    e.preventDefault();

    // `data-num` 속성에서 파일 번호 추출
    const fileNum = $(this).data('num');

    // 확인 메시지
    if (!confirm('정말로 이 파일을 삭제하시겠습니까?')) {
        return;
    }

    // Ajax 요청
    $.ajax({
        url: 'api/delete_file.php',
        method: 'POST',
        data: { num: fileNum },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                alert('파일이 성공적으로 삭제되었습니다.');
                
                // 파일 목록을 다시 불러옵니다.
                const qnum = $('#qNum').val();
                fileSearch(qnum);
            } else {
                alert(response.error || '파일 삭제 실패.');
            }
        },
        error: function () {
            alert('파일 삭제 요청 중 오류가 발생했습니다.');
        }
    });
});
 
function uploadFile() {
    const fileInput = document.getElementById('uploadedFile');
    const fileType = document.getElementById('fileType').value;
    const qNum = document.getElementById('qNum').value;

    // 동적 입력 필드 값 가져오기
    const dynamicInput = document.getElementById('dynamicInput').value;

    if (fileInput.files.length === 0) {
        alert('파일을 선택해주세요.');
        return;
    }

    if ((fileType === '4' || fileType === '7') && dynamicInput.trim() === '') {
        // 청약서(4) 또는 증권(7) 파일 유형일 경우 번호 확인
        alert(fileType === '4' ? '설계번호를 입력해주세요.' : '증권번호를 입력해주세요.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('fileType', fileType);
    formData.append('qNum', qNum);

    // 청약서(4) 또는 증권(7)일 때 번호 추가
    if (fileType === '4') {
        formData.append('designNumber', dynamicInput); // 설계번호 추가
    } else if (fileType === '7') {
        formData.append('certificateNumber', dynamicInput); // 증권번호 추가
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/upload.php', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('업로드 완료: ' + xhr.responseText);

            fileSearch(qNum); // 파일 목록 갱신
        } else {
            alert('업로드 실패.');
        }
    };

    xhr.send(formData);
}