<?php
//플랜 A  a $row['school9'] =1;
// 플랜 B b $row['school9'] =2;
//1~4주  1
//5~8주  2
//9~12주 3
//12~16주4
//17~20주5
//보험료 산출 
$pSql="SELECT * FROM preiminum WHERE sigi<='".$row['school7']."' and end>='".$row['school7']."'";
//echo $pSql;
$prs=mysqli_query($connect,$pSql);
$pRow=mysqli_fetch_assoc($prs);
//echo "18주 ".$row['week18']." "; echo "보험료  ".$pRow['b5'];
//echo "22주 ".$row['week22']." "; echo "보험료  ".$pRow['b5'];
//echo "26주 ".$row['week26']." "; echo "보험료  ".$pRow['b5'];
//echo "5주 ".$row['week5']." "; echo "보험료  ".$pRow['a2'];

switch($row['school9']){  //플랜 1,2 
	case 1 :
		$Preminum=$row['week4']*$pRow['a1']
		   +$row['week5']*$pRow['a2']+$row['week6']*$pRow['a2']+$row['week7']*$pRow['a2']+$row['week8']*$pRow['a2']
		   +$row['week9']*$pRow['a3']+$row['week10']*$pRow['a3']+$row['week11']*$pRow['a3']+$row['week12']*$pRow['a3']
		   +$row['week13']*$pRow['a4']+$row['week14']*$pRow['a4']+$row['week15']*$pRow['a4']+$row['week16']*$pRow['a4']
		   +$row['week17']*$pRow['a5']+$row['week18']*$pRow['a5']+$row['week19']*$pRow['a5']+$row['week20']*$pRow['a5']	
		   +$row['week21']*$pRow['a6']+$row['week22']*$pRow['a6']+$row['week23']*$pRow['a6']+$row['week24']*$pRow['a6']	
		   +$row['week25']*$pRow['a7']+$row['week26']*$pRow['a7'];
		   
	break;
	case 2 :
		$Preminum=$row['week4']*$pRow['b1']
		   +$row['week5']*$pRow['b2']+$row['week6']*$pRow['b2']+$row['week7']*$pRow['b2']+$row['week8']*$pRow['b2']
		   +$row['week9']*$pRow['b3']+$row['week10']*$pRow['b3']+$row['week11']*$pRow['b3']+$row['week12']*$pRow['b3']
		   +$row['week13']*$pRow['b4']+$row['week14']*$pRow['b4']+$row['week15']*$pRow['b4']+$row['week16']*$pRow['b4']
		   +$row['week17']*$pRow['b5']+$row['week18']*$pRow['b5']+$row['week19']*$pRow['b5']+$row['week20']*$pRow['b5']
		   +$row['week21']*$pRow['b6']+$row['week22']*$pRow['b6']+$row['week23']*$pRow['b6']+$row['week24']*$pRow['b6']	
		   +$row['week25']*$pRow['b7']+$row['week26']*$pRow['b7'];
	break;
}

//보험료 산출 때 마다 
$table ="questionnaire";
$sql2 =" UPDATE  ".$table . "  SET ";
$sql2 .="preiminum='".$Preminum."' ";
		
$sql2 .="WHERE  num='".$num."'";
//echo "sql $sql2 ";
mysqli_query($connect,$sql2);
?>