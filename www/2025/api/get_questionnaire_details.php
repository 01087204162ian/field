<?php
include 'db_connection.php'; // DB 연결 파일 포함
// DB 연결
$connect = connect_db();
header('Content-Type: application/json; charset=UTF-8'); // JSON 응답 설정

$response = array();

if (isset($_GET['id'])) {
    $num = intval($_GET['id']);
    $query = "SELECT * FROM questionnaire WHERE num = $num"; 
    $result = mysqli_query($connect, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);

        // 데이터 배열에 추가
        $response['success'] = true;

	
		include "../php/preminum.php";

		$daeinP=round($pRow[daein]*$Preminum/100,-2);
		
		$response['daeinP'] = number_format($daeinP);
		
		$daemoolP=round($pRow[daemool]*$Preminum/100,-2);
		$response['daemoolP'] = number_format($daemoolP);
					
		$response['preiminum']=number_format($row[preiminum]);
       


		//전 증권의 설계번호를 찾기 위해 
		$school2 = mysqli_real_escape_string($connect, $row['school2']); // 안전하게 이스케이프 처리
			$query2 = "SELECT * FROM questionnaire WHERE school2 = '$school2' AND ch = 6";

			$result2 = mysqli_query($connect, $query2);

			if ($result2) {
				$row2 = mysqli_fetch_assoc($result2);
			} else {
				die("쿼리 실행 중 오류 발생: " . mysqli_error($connect));
			}

		/// echo $row2['gabunho'];
		if($row2['gabunho']){
			$response['beforeGabunho']=$row2['gabunho'];//전 증권의 설계번호를 찾기 위해 
		}else{
			$response['beforeGabunho']='';
		}

		/* questionnaire TABLE cNum 값이 없는 경우
		    // 등록된 고객사 id 즉 2014Costmer TABLE num 값이 없다 매칭 하기 위함 작업을 함
			school5(이메일) // 2014Costmer 에 신청한 이메일로 등록된 아이디가 있는지 조회하여 
			2014Costmer TABLE cNum 값을 questionnaire TABLE cNum업데이트 한다
		*/
		if(!$row['cNum']){ 

			include "../php/idJongLi.php";
		}else{
			//print_r($row2);
			//카드번호,유효기간,담당자,담당자 연락처 등을 
			$cSql = "SELECT * FROM `2014Costmer` WHERE num = '" . $row['cNum'] . "'";
			$cresult2 = mysqli_query($connect, $cSql);

			if ($cresult2) {
				$row3 = mysqli_fetch_assoc($cresult2);

				$response['cardnum']=$row3['cardnum'];                  //카드번호
				$response['yymm']=$row3['yymm'];                         //유효기간
				$response['cardap']=$row3['cardap'];                       //승인번호
				$response['damdanga']=$row3['damdanga'];             //담당자
				$response['damdangat']=$row3['damdangat'];		   // 담당자전화번호

				$response['bank']=$row3['bank'];								//계좌번호
				$response['bankname']=$row3['bankname'];				//은행명
			} else {	
				die("쿼리 실행 중 오류 발생: " . mysqli_error($connect));
			}

		
		
		}

		$response['data'] = $row; // 전체 row를 JSON으로 반환
		
    } else {
        $response['success'] = false;
        $response['error'] = '데이터를 찾을 수 없습니다.';
    }
} else {
    $response['success'] = false;
    $response['error'] = '잘못된 요청입니다.';
}

// JSON 형식으로 응답
echo json_encode($response);
?>
