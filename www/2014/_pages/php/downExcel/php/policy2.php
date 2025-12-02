<?

$data[certi]=$row[certi];  //증권번호

//echo $row[certi_wdate];
$printDay=$toyear."/".$tomonth."/".$today; //2017-03-23 전선양 팀장의 요청에 의해 청약일로 변경함
$data[today]=iconv("utf-8","euc-kr",$row[school7]);  //청약일을 보험시작일로 정함


$data[school1]=iconv("utf-8","euc-kr",$row[school1]); //계약자
$data[juso]=iconv("utf-8","euc-kr",$row[school3]); //주소


//피보험자 
$pibo2="참여학생 / 실습기관 ";
$pibo=$row[school1]."현장실습 ".$pibo2;
$data[school5]=iconv("utf-8","euc-kr",$pibo); 

//보장내용
$business="의 교육부 고시 대학생 현장실습 활동";
$data[school2]=iconv("utf-8","euc-kr",$row[school1].$business);//보장내용
//산출기초수
$data[week_total]=number_format($row[week_total]).iconv("utf-8","euc-kr","명");
//보험시기
	$sigi_=explode("-",$row[school7]);
	$sigi_2=$sigi_[0]."년".$sigi_[1]."월".$sigi_[2]."일";
	$sigi2_=explode("-",$row[nschool8]);
	$sigi_3=$sigi2_[0]."년".$sigi2_[1]."월".$sigi2_[2]."일";
	$data[ysigi]=iconv("utf-8","euc-kr",$sigi_2."부터  ".$sigi_3);

switch($row[school9]){
	  case 1 :
	    //$damb01="KRW";
		//$data[dambo1]=iconv("utf-8","euc-kr",$damb01);
		$damb02="100,000,000";
		$data[dambo2]=iconv("utf-8","euc-kr",$damb02);
		$data[dambo3]=$row[school9]; // 1억원

        //실습중 치료비 
		$damb04="10,000,000";
		$data[dambo5]=iconv("utf-8","euc-kr",$damb04);
		$damb06="1";
		$data[dambo6]=iconv("utf-8","euc-kr",$damb06);

		

	  break;

	  case 2 :
		//$damb01="KRW";
		//$data[dambo1]=iconv("utf-8","euc-kr",$damb01);
		$damb02="200,000,000";
		$data[dambo2]=iconv("utf-8","euc-kr",$damb02);
		$data[dambo3]=$row[school9]; // 2억원

		 //실습중 치료비 
		$damb04="10,000,000";
		$data[dambo5]=iconv("utf-8","euc-kr",$damb04);

		$damb06="1";
		$data[dambo6]=iconv("utf-8","euc-kr",$damb06);
	  break;
}
$damb07="1,000,000,000";
$data[dambo7]=iconv("utf-8","euc-kr",$damb07);

$damb08="10";
$data[dambo8]=iconv("utf-8","euc-kr",$damb08);


$damb09="100,000";
$data[dambo9]=iconv("utf-8","euc-kr",$damb09);

$damb10="10만원";
$data[dambo10]=iconv("utf-8","euc-kr",$damb10);


//보험료 
$data[preiminum]=number_format($Preminum);





   // 템플릿 파일명  
  $tpl_file = './frm/policy_2page.frm'; 
    
   // 파일 불러오기 
   $list = file($tpl_file); 
    
   // 폼의 총 줄수 구하기 
   $count = count($list); 
    
    for($i=0;$i<$count;$i++){ 
        // 자료분리 
        $tmp = explode("|",$list[$i]); 
         
        // 자료가 없으면 다음자료로 이동 
        if(!$tmp[0]) continue; 
         
        $cur_data = $data[$tmp[0]];  // $data[cno1]; 
        if(!$cur_data) continue;  
         
        //     0   1 2  3       4       5     6 
        // |변수명|x|y|글씨체|글자크기|자간|STRPAD값| 
        // frm에서 지정된 곳에 값을 출력  
         
        // strpad값이 있을경우 일정칸을 확보하고 우측부터 글씨를 기재  
        if($tmp[6]){ 
          $cur_data = str_pad($cur_data,$tmp[6]," ",STR_PAD_LEFT);  
        } 
         
        $pdf->setFont($tmp[3],'',$tmp[4]); 
        $pdf->SetCharSpacing($tmp[5]); 
        $pdf->SetXY($tmp[1],$tmp[2]); 
        $pdf->Write(0,$cur_data);  
         
        // 하단의 사본부분 채우기  
       // $pdf->SetXY($tmp[1],$tmp[2]+138); 
       // $pdf->Write(0,$cur_data);  
          
       
      } 


?>