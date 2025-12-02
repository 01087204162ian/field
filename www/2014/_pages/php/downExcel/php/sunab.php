<?
$mertiz="박아해님/ 마경리주임님";

$data[mertiz]=iconv("utf-8","euc-kr",$mertiz);


$damdanga="이투엘대리점/박종민/070-7813-1675/010-6221-7275";

$data[damdanga]=iconv("utf-8","euc-kr",$damdanga);


$data[gabunho]=$row[gabunho];	//가계약 번호 
	$sabunho=explode("-",$row[school2]);
    $sabunho[2]=substr($sabunho[2], 0, 1); 
	$sabun=$sabunho[0]."-".$sabunho[1]."-".$sabunho[2]."xxxx";
    $data[school1]=iconv("utf-8","euc-kr",$row[school1]); //계약자





if($row[pMethod]==2){
	$pMethod="현금";
	$data[sunab1]=iconv("utf-8","euc-kr",$pMethod); ////결재 방법
	$data[sunab]=$row[bank]." (".  iconv("utf-8","euc-kr",$row[bankname]) .")"; ////은행 계좌번호
}else{
	$pMethod="카드결재";
	$data[sunab1]=iconv("utf-8","euc-kr",$pMethod); ////결재 방법;
	$data[sunab]=$row[cardnum]." (".  $row[yymm] .")"; ////카드번호유효기간

	$cardap1="승인번호";
	$data[cardap1]=iconv("utf-8","euc-kr",$cardap1); ////승인번호
	$data[cardap]=iconv("utf-8","euc-kr",$row[cardap]); ////승인번호
}

	$data[preiminum]=number_format($Preminum);


$data[policy]=$row[certi];

   // 템플릿 파일명  
  $tpl_file = './frm/sunab.frm'; 
    
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