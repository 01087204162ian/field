<?

$pageS=round(($pageCount/21));	
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



	$pageS=4;//메리츠

  for($_p=0;$_p<$pageS;$_p++){
   // 한페이지를 추가 
   $pdf->AddPage(); 
    



	
   // 기존 pdf파일의 경로를 설정 
	   switch($_p){
		   case 0 :
			  $pdf->setSourceFile('./app1.pdf'); 
		   break;
			case 1 :
			  $pdf->setSourceFile('./app2.pdf'); 
		   break;
			case 2 :
			  $pdf->setSourceFile('./app3.pdf'); 
		   break;
			case 3 :
			  $pdf->setSourceFile('./app4.pdf'); 
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
	//납부 방법이 현금일 경우

	$cSql="SELECT * FROM 2014Costmer WHERE num='$row[cNum]'";
	//echo $cSql;
	$cRs=mysql_query($cSql,$connect);
	$cRow=mysql_fetch_array($cRs);

	$pMethod=$cRow[pMethod];


	//echo $pMethod;
	if($cRow[bankname]){ //현금일 경우만

		$bankname=$cRow[bankname]; //은행
		$bank=$cRow[bank];          //계좌번호

		$data[bankname]=iconv("utf-8","euc-kr",$bankname);
		$data[bank]=iconv("utf-8","euc-kr",$bank);

	}

	$data[gabunho]=$row[gabunho];	//가계약 번호 
	$data[simbuho]=$row[simbuho]; //심사번호
	$sabunho=explode("-",$row[school2]);
	$sabunho[2]=substr($sabunho[2], 0, 1); 
	$sabun=$sabunho[0]."-".$sabunho[1]."-".$sabunho[2]."xxxx";
    $data[school1]=iconv("utf-8","euc-kr",$row[school1])."(".$sabun.")"; //계약자


	$data[school2]=iconv("utf-8","euc-kr",$row[school1])."(".$sabun.")"; //계약자

	$data[hphone]=$row[school4];
	$data[email]=$row[school5];
    $data[juso]=iconv("utf-8","euc-kr",$row[school3]);
	
	//산출기초수
	$data[week_total]=number_format($row[week_total]);
	 
	//대인 보험료 
	$daeinP=round($pRow[daein]*$Preminum/100,-2);
	$data[daeinP]=number_format($daeinP);

	//
	$daemoolP=round($pRow[daemool]*$Preminum/100,-2);
	$data[daemoolP]=number_format($daemoolP);


	//보험료
	$data[preiminum]=number_format($Preminum);
	$data[preiminum2]=number_format($Preminum);
   //$data[school3]=iconv("utf-8","euc-kr",$row[school3]);
   //$data[school4]=iconv("utf-8","euc-kr",$row[school4]);
   
	$pibo=$row[school1]."/ 현장실습 ";
	$pibo2="참여학생 / 실습기관 ";
    $data[school5]=iconv("utf-8","euc-kr",$pibo);
    $data[school6]=iconv("utf-8","euc-kr",$pibo2);
  // $data[ghphone]=$dRow[Hphone];
  //$row[school6]=4;
  
		
	//보험시기
	$sigi_=explode("-",$row[school7]);
	$sigi_2=$sigi_[0]."년".$sigi_[1]."월".$sigi_[2]."일 00:01부터";


	$sigi2_=explode("-",$row[nschool8]);//+1일
	$sigi_3=$sigi2_[0]."년".$sigi2_[1]."월".$sigi2_[2]."일 00:01까지";
	$data[ysigi]=iconv("utf-8","euc-kr",$sigi_2.$sigi_3);
	
	//프린트 시간
	
	$data[today2]=iconv("utf-8","euc-kr",$todayfullTime);

	$damdanga="이투엘대리점";
	$data[damdanga]=iconv("utf-8","euc-kr",$damdanga);
	

//증권번호
//	$data[certi]=$row[certi];

	//보험료
	
	

	//$pibo=$row[school1]."의 교육부 고시 대학생 현장실습 활동 중";
	//$pibo2="발생하는제3자에 대한 배상책임 위험 ";
	//$data[school9]=iconv("utf-8","euc-kr",$pibo);
	//$data[school10]=iconv("utf-8","euc-kr",$pibo2);

	
	
//$row[school9]=2;
switch($row[school9]){
	  case 1 :
	    //$damb01="KRW";
		//$data[dambo1]=iconv("utf-8","euc-kr",$damb01);
		$damb02="100,000,000";
		$data[dambo2]=iconv("utf-8","euc-kr",$damb02);

		$damb03="10,000,000"; //구내치료비 1사고당
		$data[dambo3]=iconv("utf-8","euc-kr",$damb03);
		$damb04="10,000,000";    //구내치료비 1인당
		$data[dambo4]=iconv("utf-8","euc-kr",$damb04);


		$damb05="100,000"; // 공제금액
		$data[dambo5]=iconv("utf-8","euc-kr",$damb05);
		$damb06="100,000,000"; //총보상한도
		$data[dambo6]=iconv("utf-8","euc-kr",$damb06);

		$damb07="1,000,000,000"; //총보상한도
		$data[dambo7]=iconv("utf-8","euc-kr",$damb07);
		//$damb08="100,000";
		//$data[dambo8]=iconv("utf-8","euc-kr",$damb08);


		//$damb09="KRW";
		//$data[dambo9]=iconv("utf-8","euc-kr",$damb09);
		//$damb10="10,000,000";
		//$data[dambo10]=iconv("utf-8","euc-kr",$damb10);
	  break;

	  case 2 :
		//$damb01="KRW";
		//$data[dambo1]=iconv("utf-8","euc-kr",$damb01);
		$damb02="200,000,000";
		$data[dambo2]=iconv("utf-8","euc-kr",$damb02);

		$damb03="10,000,000"; //구내치료비 1사고당
		$data[dambo3]=iconv("utf-8","euc-kr",$damb03);
		$damb04="10,000,000";    //구내치료비 1인당
		$data[dambo4]=iconv("utf-8","euc-kr",$damb04);


		$damb05="100,000"; // 공제금액
		$data[dambo5]=iconv("utf-8","euc-kr",$damb05);
		$damb06="200,000,000"; //총보상한도
		$data[dambo6]=iconv("utf-8","euc-kr",$damb06);

		$damb07="1,000,000,000"; //총보상한도
		$data[dambo7]=iconv("utf-8","euc-kr",$damb07);
		//$damb08="100,000";
		//$data[dambo8]=iconv("utf-8","euc-kr",$damb08);


		//$damb09="KRW";
		//$data[dambo9]=iconv("utf-8","euc-kr",$damb09);
		//$damb10="10,000,000";
		//$data[dambo10]=iconv("utf-8","euc-kr",$damb10);
		//$pdf->Image('../../../../2012/img/check.png',213,204,4);//이미지 부분	
	  break;
}

$printDay=$toyear."년".$tomonth."월".$today."일".$s;
$data[today]=iconv("utf-8","euc-kr",$printDay);


   // 템플릿 파일명  
  $tpl_file = './frm/claim_3.frm'; 
    
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

    $data[school1]=''; //계약자


	$data[school2]=''; //계약자

	$data[hphone]='';
	$data[email]='';
    $data[juso]='';
	
	//산출기초수
	$data[week_total]='';
	 
	//보험료
	$data[preiminum]='';
	$data[preiminum2]='';
   //$data[school3]=iconv("utf-8","euc-kr",$row[school3]);
   //$data[school4]=iconv("utf-8","euc-kr",$row[school4]);
   
	
    $data[school5]='';
    $data[school6]='';
  // $data[ghphone]=$dRow[Hphone];
  //$row[school6]=4;
    $damdanga='';
	$damb02='';	 
	//보험시기
	$printDay='';
	$data[ysigi]='';
	
	//프린트 시간
	

if($_p==1){

	
	
	$data[today2]=iconv("utf-8","euc-kr",$todayfullTime);


   // 템플릿 파일명  
  $tpl_file = './frm/claim_2page.frm'; 
    
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
	} //$_p==1

	if($_p==2){

	
	
	$data[today2]=iconv("utf-8","euc-kr",$todayfullTime);


   // 템플릿 파일명  
  $tpl_file = './frm/claim_3page.frm'; 
    
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
	} //$_p==2

if($_p==3){

	
	
	$data[today2]=iconv("utf-8","euc-kr",$todayfullTime);


   // 템플릿 파일명  
  $tpl_file = './frm/claim_4page.frm'; 
    
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
	} //$_p==2
  }

?>