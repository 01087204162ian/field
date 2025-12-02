<?include '../../../../dbcon.php';

//echo $claimNum;
include "./query/claimQuery.php";

//보험료 산출 하기 위해 
include "../../../../_db/php/preminum.php";


//$pageS=round(($pageCount/21));	
	//echo " dd $cRow[company] ";
// echo "_h $_h ";// echo "sql $sql <Br>";
   // 한글폰트/폰트의 디렉토리를 설정  
   define('FPDF_FONTPATH','./pdf_2/font/');  
    
   // 관련 라이브러리 파일을 호출 
   require('./pdf_2/fpdi.php'); 
   require('./pdf_2/korean.php'); 
  // require('./pdf_2/fpdf.php'); 
   //require('./pdf_2/pdf_parser.php');
   // require('./pdf_2/fpdf_tpl.php'); 
  // require('./pdf_2/fpdi_pdf_parser.php'); 
    
   // pdf라는 객체를 생성하는데, A4용지, 단위는 mm, 세로(P/L) 
   $pdf = new PDF_Korean('P','mm','A3'); 
    
   // 한글폰트 설정 H2hdrM -> HD  
   $pdf->AddUHCFont('HD', 'H2hdrM');  
    
   // PDF 파일을 오픈합니다.  
   $pdf->Open(); 
  //$Dnum=100;

 
  // echo " $Dnum/21 ";

//echo "$DNum pageS $pageS";
$pageS=2;
  for($_p=1;$_p<$pageS;$_p++){
   // 한페이지를 추가 
   $pdf->AddPage(); 
    
   // 기존 pdf파일의 경로를 설정 
   switch($_p){
	   case 1 :
          $pdf->setSourceFile('./sunab.pdf'); 
	   break;
	    case 2 :
          $pdf->setSourceFile('./policy2.pdf'); 
	   break;
	    case 3 :
          $pdf->setSourceFile('./policy3.pdf'); 
	   break;
	    case 4 :
          $pdf->setSourceFile('./policy4.pdf'); 
	   break;
   }


    
   // 한페이지를 가져옴 
   $tplIdx = $pdf->ImportPage(1); 
    
   // 현재의 pdf문서에 기존의 문서를 지정한 위치에 지정한 크기로 호출 
      // 현재의 pdf문서에 기존의 문서를 지정한 위치에 지정한 크기로 호출 
   $pdf->useTemplate($tplIdx,0,0,297); //가로
  // $pdf->useTemplate($tplIdx,0,0,210); //세로일대
    
   // 실제 데이타 설정 

   //증권번호
 //$_p==0
		
		if($_p==1){ include "./php/sunab.php"; }
		
		
  }
   $pdf->Output();  
?> 