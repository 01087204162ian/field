<?include '../../../../dbcon.php';

//echo $claimNum;
include "./query/claimQuery.php";
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
$pageS=1;
  for($_p=0;$_p<$pageS;$_p++){
   // 한페이지를 추가 
   $pdf->AddPage(); 
    
   // 기존 pdf파일의 경로를 설정 
   switch($_p){
	   case 0 :
          $pdf->setSourceFile('./certi.pdf'); 
	   break;
	    case 1 :
          $pdf->setSourceFile('./claim_2.pdf'); 
	   break;
	    case 2 :
          $pdf->setSourceFile('./claim_3.pdf'); 
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
if($_p==0){

   $data[school1]=iconv("utf-8","euc-kr",$row[school1]); //계약자
   //$data[school2]=iconv("utf-8","euc-kr",$row[school2]);
   //$data[school3]=iconv("utf-8","euc-kr",$row[school3]);
   //$data[school4]=iconv("utf-8","euc-kr",$row[school4]);
   
	$pibo=$row[school1]."/ 현장실습 참여학생 / 실습기관 ";
   $data[school5]=iconv("utf-8","euc-kr",$pibo);
  // $data[ghphone]=$dRow[Hphone];
  //$row[school6]=4;
  
		 
	//보험시기
	$sigi_=explode("-",$row[school7]);
	$sigi_2=$sigi_[0]."년".$sigi_[1]."월".$sigi_[2]."일 부터";
	$data[school7]=iconv("utf-8","euc-kr",$sigi_2);
	$sigi_=explode("-",$row[nschool8]);
	$sigi_2=$sigi_[0]."년".$sigi_[1]."월".$sigi_[2]."일 까지";
	$data[school8]=iconv("utf-8","euc-kr",$sigi_2);

//증권번호
	$data[certi]=$row[certi];

	//보험료
	$damb01="KRW";
	$data[preiminum]=$damb01.number_format($row[preiminum]);

	$pibo=$row[school1]."의 교육부 고시 대학생 현장실습 활동 중";
	$pibo2="발생하는제3자에 대한 배상책임 위험 ";
	$data[school9]=iconv("utf-8","euc-kr",$pibo);
	$data[school10]=iconv("utf-8","euc-kr",$pibo2);

	

//$row[school9]=2;
switch($row[school9]){
	  case 1 :
	    $damb01="KRW";
		$data[dambo1]=iconv("utf-8","euc-kr",$damb01);
		$damb02="100,000,000";
		$data[dambo2]=iconv("utf-8","euc-kr",$damb02);

		$damb03="KRW";
		$data[dambo3]=iconv("utf-8","euc-kr",$damb03);
		$damb04="100,000";
		$data[dambo4]=iconv("utf-8","euc-kr",$damb04);


		$damb05="KRW";
		$data[dambo5]=iconv("utf-8","euc-kr",$damb05);
		$damb06="100,000,000";
		$data[dambo6]=iconv("utf-8","euc-kr",$damb06);

		$damb07="KRW";
		$data[dambo7]=iconv("utf-8","euc-kr",$damb07);
		$damb08="100,000";
		$data[dambo8]=iconv("utf-8","euc-kr",$damb08);


		$damb09="KRW";
		$data[dambo9]=iconv("utf-8","euc-kr",$damb09);
		$damb10="10,000,000";
		$data[dambo10]=iconv("utf-8","euc-kr",$damb10);
	  break;

	  case 2 :
		$damb01="KRW";
		$data[dambo1]=iconv("utf-8","euc-kr",$damb01);
		$damb02="200,000,000";
		$data[dambo2]=iconv("utf-8","euc-kr",$damb02);

		$damb03="KRW";
		$data[dambo3]=iconv("utf-8","euc-kr",$damb03);
		$damb04="100,000";
		$data[dambo4]=iconv("utf-8","euc-kr",$damb04);


		$damb05="KRW";
		$data[dambo5]=iconv("utf-8","euc-kr",$damb05);
		$damb06="200,000,000";
		$data[dambo6]=iconv("utf-8","euc-kr",$damb06);

		$damb07="KRW";
		$data[dambo7]=iconv("utf-8","euc-kr",$damb07);
		$damb08="100,000";
		$data[dambo8]=iconv("utf-8","euc-kr",$damb08);


		$damb09="KRW";
		$data[dambo9]=iconv("utf-8","euc-kr",$damb09);
		$damb10="10,000,000";
		$data[dambo10]=iconv("utf-8","euc-kr",$damb10);
		//$pdf->Image('../../../../2012/img/check.png',213,204,4);//이미지 부분	
	  break;
}

$printDay=$toyear."년".$tomonth."월".$today."일".$s;
$data[today]=iconv("utf-8","euc-kr",$printDay);


   // 템플릿 파일명  
  $tpl_file = './frm/claim_4.frm'; 
    
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
	} //$_p==0

   $data[dongbuCerti]=''; 
   $data[gname]='';
   $data[gjumin]='';//$jumin;
   $data[ghphone]='';


   $data[name]='';
   $data[jumin]='';
   $data[hphone]='';

   $data[job]='';	
   $data[stime]='';		//사고일시
   $data[jangso]='';		//사고장소
   $data[reason]='';		//사고경위
   $data[hospital]='';   //병원명
   $data[ssort]='';			//진료과목
   $data[bank]='';			//은행명
   $data[banknumber]='';  //계좌번호
   $data[bankname]='';  //계좌주
	$data[year]='';  //년도
   $data[month]='';  //월
   $data[day]='';  //일

   $data[name2]='';  //청구인
if($_p==2){



   $m=explode('-',$now_time);
   $data[year_3]=iconv("utf-8","euc-kr",$m[0]);  //년도
   $data[month_3]=iconv("utf-8","euc-kr",$m[1]);  //월
   $data[day__3]=iconv("utf-8","euc-kr",$m[2]);  //일

   $data[name3]=iconv("utf-8","euc-kr",$dName);  //청구인



 


  

   



   // 템플릿 파일명  
  $tpl_file = './frm/claim_1.frm'; 
    
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
	} //$_p==0
  }
   $pdf->Output();  
?> 