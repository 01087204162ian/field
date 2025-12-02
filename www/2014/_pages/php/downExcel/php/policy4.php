<?


//증권발급일



$cp=explode("-",$row[certi_wdate]);

	
$data[cpday]=$cp[2];

$data[month]=date(F,strtotime($row[certi_wdate])).",".$cp[0];

//echo date(F,$row[certi_wdate]);

   // 템플릿 파일명  
  $tpl_file = './frm/policy_4page.frm'; 
    
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