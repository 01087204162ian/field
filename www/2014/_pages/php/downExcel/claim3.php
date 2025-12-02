<?include '../../../../dbcon.php';

//echo $claimNum;
include "./query/claimQuery.php";

//보험료 산출 하기 위해 
include "../../../../_db/php/preminum.php";

include "./php/claim3contents0".$row[inscompany].".php";
   $pdf->Output();  
?> 