<?

 $data[school1]=iconv("utf-8","euc-kr",$row[school1]); //계약자

 $sigi=explode("-",$row[school7]);
 $data[school7]=iconv("utf-8","euc-kr",$sigi[0].".".$sigi[1].".".$sigi[2]." 00:00"); //보험시작일]


 $end=explode("-",$row[nschool8]);
 $data[school8]=iconv("utf-8","euc-kr",$end[0].".".$end[1].".".$end[2]." 00:00"); //보험 종기일

if($row[directory]==2){//고등학교
	switch($row[school9]){
		case 1 :
			$dambo1_1="1사고당 1억원";
			$dambo1_2="1인당 및 1사고당 : 1천만원";
			break;
		case 2 :
			$dambo1_1="1사고당 2억원";
			$dambo1_2="1인당 및 1사고당 : 1천만원";
			break;
	 }

}else{ 
	 switch($row[school8]){
		case 1 :
			$dambo1_1="1사고당 2억원";
			$dambo1_2="1인당 및 1사고당 : 1천만원";
			break;
		case 2 :
			$dambo1_1="1사고당 3억원";
			$dambo1_2="1인당 및 1사고당 : 1천만원";
			break;
	 }
}
$data[dambo1_1]=iconv("utf-8","euc-kr",$dambo1_1); //보상한도
$data[dambo1_3]=iconv("utf-8","euc-kr",$dambo1_1); //보상한도
$data[dambo1_2]=iconv("utf-8","euc-kr",$dambo1_2); //보상한도


$data[week4]=iconv("utf-8","euc-kr",$row[week4]);
 $data[week5]=iconv("utf-8","euc-kr",$row[week5]);
 $data[week6]=iconv("utf-8","euc-kr",$row[week6]);
 $data[week7]=iconv("utf-8","euc-kr",$row[week7]);
 $data[week8]=iconv("utf-8","euc-kr",$row[week8]);


 
 $data[week9]=iconv("utf-8","euc-kr",$row[week9]);
 $data[week10]=iconv("utf-8","euc-kr",$row[week10]);
 $data[week11]=iconv("utf-8","euc-kr",$row[week11]);
 $data[week12]=iconv("utf-8","euc-kr",$row[week12]);
 $data[week13]=iconv("utf-8","euc-kr",$row[week13]);


 $data[week14]=iconv("utf-8","euc-kr",$row[week14]);
 $data[week15]=iconv("utf-8","euc-kr",$row[week15]);
 $data[week16]=iconv("utf-8","euc-kr",$row[week16]);
 $data[week17]=iconv("utf-8","euc-kr",$row[week17]);
 $data[week18]=iconv("utf-8","euc-kr",$row[week18]);
 $data[week19]=iconv("utf-8","euc-kr",$row[week19]);
 $data[week20]=iconv("utf-8","euc-kr",$row[week20]);



 $data[week21]=iconv("utf-8","euc-kr",$row[week21]);
 $data[week22]=iconv("utf-8","euc-kr",$row[week22]);
 $data[week23]=iconv("utf-8","euc-kr",$row[week23]);
 $data[week24]=iconv("utf-8","euc-kr",$row[week24]);
 $data[week25]=iconv("utf-8","euc-kr",$row[week25]);
 $data[week26]=iconv("utf-8","euc-kr",$row[week26]);



 $data[week_total]=iconv("utf-8","euc-kr",$row[week_total]);



 
 $data[Preminum]=iconv("utf-8","euc-kr",number_format($Preminum));



   // 템플릿 파일명  
  $tpl_file = './frm/20200905_02.frm'; 
    
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