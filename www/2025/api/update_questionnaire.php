<?php

	include 'db_connection.php'; // DB 연결 파일 포함
	$connect = connect_db();

	header('Content-Type: application/json; charset=UTF-8');

	$response = array();

	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		$school1 = isset($_POST['school1']) ? mysqli_real_escape_string($connect,$_POST['school1']) : '';
		$school2 = isset($_POST['school2']) ? mysqli_real_escape_string($connect,$_POST['school2']) : '';
		$school3 = isset($_POST['school3']) ? mysqli_real_escape_string($connect,$_POST['school3']) : '';
		$school4 = isset($_POST['school4']) ? mysqli_real_escape_string($connect,$_POST['school4']) : '';
		$school5 = isset($_POST['school5']) ? mysqli_real_escape_string($connect,$_POST['school5']) : '';
		$school6 = isset($_POST['school6']) ? intval($_POST['school6']) : 0;
		$school7 = isset($_POST['school7']) ? mysqli_real_escape_string($connect,$_POST['school7']) : '';
		$school8 = isset($_POST['school8']) ? mysqli_real_escape_string($connect,$_POST['school8']) : '';
		$school9 = isset($_POST['plan']) ? intval($_POST['plan']) : 0;

		$oldPreminum=isset($_POST['school8']) ? mysqli_real_escape_string($connect,$_POST['totalP']) : '';
		$inscompany = isset($_POST['inscompany']) ? intval($_POST['inscompany']) : 0;
		//echo $oldPreminum;
		// 주차별 참여인원 데이터
		$weeks = array();
		for ($i = 4; $i <= 26; $i++) {
			$weeks["week$i"] = isset($_POST["week$i"]) ? intval(str_replace(',', '', $_POST["week$i"])) : 0;
			$total+=$_POST["week$i"];
		}


		// 업데이트 SQL 구성
		$updateQuery = "UPDATE questionnaire SET 
			school1 = '$school1',
			school2 = '$school2',
			school3 = '$school3',
			school4 = '$school4',
			school5 = '$school5',
			school6 = $school6,
			school7 = '$school7',
			school8 = '$school8',
			school9 = '$school9',
			week_total='$total'
			";

		foreach ($weeks as $week => $value) {
			$updateQuery .= ", $week = $value";
		}

		if (isset($_POST['id'])) {
			$num = intval($_POST['id']);
			$updateQuery .= " WHERE num = $num";
		} else {
			$response['success'] = false;
			$response['error'] = 'ID가 누락되었습니다.';
			echo json_encode($response);
			exit;
		}
		//echo $updateQuery;
		// 데이터베이스 업데이트 실행
		$result = mysqli_query($connect,$updateQuery);
        include "../php/preminum2.php";

		$daeinP=round($pRow[daein]*$Preminum/100,-2);
		//$data[daeinP]=number_format($daeinP);
		$response['daeinP'] = number_format($daeinP);
		//
		$daemoolP=round($pRow[daemool]*$Preminum/100,-2);
		$response['daemoolP'] = number_format($daemoolP);
					//$data[daemoolP]=number_format($daemoolP);
		$response['Preminum']=number_format($Preminum);

		$response['week_total']=number_format($total);

		
		
		if ($result) {
			$response['success'] = true;
		} else {
			$response['success'] = false;
			$response['error'] = '데이터베이스 업데이트 실패: ' . mysql_error($connect);
		}
	} else {
		$response['success'] = false;
		$response['error'] = '잘못된 요청 방식입니다.';
	}

	// JSON 형식으로 응답
	echo json_encode($response);
?>
