<?
//2018-01 클릭하면 20017-01//
//$s_sigi=$now_time;

	  $start=$_POST['start'];
	  $end=$_POST['end'];

$gigan=$start."~".$end;
$firstDate  = new DateTime($start);
$secondDate = new DateTime($end);
$intvl = $firstDate->diff($secondDate);

$diffDay=($intvl->days)+1;;//날자 차이

//$s_sigi=($sigi[0])."-".$sigi[1];
//$sigi2=($sigi[0]-1)."-".$sigi[1];

if($firstDate>$secondDate){
	$i__=1;
	$sql ="SELECT * FROM  questionnaire WHERE wdate_3<='$start' and wdate_3>='$end' and ch=6  order by wdate_3 desc";
	$gigan=$end."~".$start;
}else{
	$i__=2;
	$sql ="SELECT * FROM  questionnaire WHERE wdate_3<='$end' and wdate_3>='$start' and ch=6  order by wdate_3 desc";
	$gigan=$start."~".$end;
}

//echo $i__;

//청약중
//$sSql="SELECT * FROM 2014DaeriMember WHERE  push='1' $where1  $where2 $where3 order by jumin asc";
//echo "sSql $sql <Br>";
$srs=mysql_query($sql,$connect);
$sNUM=mysql_num_rows($srs);


//echo $sNUM;
//for($_j=0;$_j<$sNUM;$_j++){

		
		
//}





//echo $output_file_name;
header( "Content-type: application/vnd.ms-excel" );   
header( "Content-type: application/vnd.ms-excel; charset=utf-8");  
header( "Content-Disposition: attachment; filename = {$gigan}.xls" );   
header( "Content-Description: PHP4 Generated Data" );




// Add some data
$EXCEL_STR = "  
<table border='1'>  
<tr style=\"text-align:center;mso-number-format:'\@';\">  
   <td>구분</td> 
   <td>영수일</td>
   <td>계약자</td>  
   <td>주소</td>
   <td>연락처</td>
   <td>이메일</td>
   <td>보험료</td>
   <td>신청일</td>
   <td>보험시기</td>
   <td>증권번호</td>
 
	
</tr>";
for ($_j = 0; $_j <$sNUM; $_j++) {
	
	
	$sRow=mysql_fetch_array($srs);
		
		$m=$_j+1;
		$school1[$_j]=$sRow['school1']; //계약자
		$school2[$_j]=$sRow['school2'];
		

		$school6[$_j]=$sRow['school6']; //학기

		$school7[$_j]=$sRow['school7']; //시기
		$school9[$_j]=$sRow['nschool8']; //종기



		$certi[$_j]=$sRow['certi']; //증권번호
		

		$inscompany[$_j]=$sRow['inscompany']; //보험회사


		switch($inscompany[$_j]){


			case 1 :

					$inscompany[$_j]='한화';
				break;
		    case 2 :
					$inscompany[$_j]='메리츠';

				break;


		}
		
		$preiminum[$_j]=$sRow['preiminum']; //보험료

		$email[$_j]=$sRow['school5']; //이메일

		$preminumTotal+=$sRow['preiminum'];
		//
	$EXCEL_STR .= "  
   <tr >  
       <td style=\"text-align:center;mso-number-format:'\@';\">".$m."</td> 
	   <td style=\"text-align:center;mso-number-format:'\@';\">".$sRow['wdate_3']."</td> 
       <td style=\"text-align:center;mso-number-format:'\@';\">".$sRow['school1']."</td> 
       <td style=\"text-align:center;mso-number-format:'\@';\">".$sRow['school3']."</td> 
	   <td style=\"text-align:center;mso-number-format:'\@';\">".$sRow['school4']."</td>
	   <td style=\"text-align:center;mso-number-format:'\@';\">".$sRow['school5']."</td>   
	   <td style=\"text-align:right;mso-number-format:'\@';\">".number_format($sRow['preiminum'])."</td>
	    <td style=\"text-align:center;mso-number-format:'\@';\">".substr($sRow[wdate],0,10)."</td> 
		<td style=\"text-align:center;mso-number-format:'\@';\">".$sRow['school7']."</td> 
        <td style=\"text-align:right;mso-number-format:'\@';\">".$sRow['certi']."</td> 
   </tr>  
   ";  

   $m2='';
	
 
}  
   $EXCEL_STR .= "  
   <tr >  
       <td colspan='6' style=\"text-align:center;mso-number-format:'\@';\">"."보험료계"."</td>  
        <td  style=\"text-align:right;mso-number-format:'\@';\">".number_format($preminumTotal)."</td>  
   </tr>  
   ";  
   
$EXCEL_STR .= "</table>";   
 
 



echo "<meta content=\"application/vnd.ms-excel; charset=UTF-8\" name=\"Content-type\"> ";  
echo $EXCEL_STR;  

 



?>
