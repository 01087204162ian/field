<? 
   // 한글폰트/폰트의 디렉토리를 설정  
   define('FPDF_FONTPATH','./pdf/font/');  
    
   // 관련 라이브러리 파일을 호출 
   require('./pdf/fpdi.php'); 
   require('./pdf/korean.php'); 
    
   // pdf라는 객체를 생성하는데, A4용지, 단위는 mm, 세로(P/L) 
   $pdf = new PDF_Korean('P','mm','A4'); 
    
   // 한글폰트 설정 H2hdrM -> HD  
   $pdf->AddUHCFont('HD', 'H2hdrM');  
    
   // PDF 파일을 오픈합니다.  
   $pdf->Open(); 
    
   // 한페이지를 추가 
   $pdf->AddPage(); 
    
   // 기존 pdf파일의 경로를 설정 
   $pdf->setSourceFile('./calc.pdf'); 
    
   // 한페이지를 가져옴 
   $tplIdx = $pdf->ImportPage(1); 
    
   // 현재의 pdf문서에 기존의 문서를 지정한 위치에 지정한 크기로 호출 
   $pdf->useTemplate($tplIdx,0,0,210); 
    
   // 실제 데이타 설정 
   $data[cno1] = "123-45-67890"; 
   $data[cname1] = "싱싱해"; 
   $data[caddress1] = "전남 여수시 돌산읍 우두리 백초 755-11"; 
   $data[cceo1] = "구명석"; 
   $data[ctype1] = "서비스"; 
   $data[citem1] = "SW개발및유지보수"; 
   $data[date] = "2008  08  18";  
   $data[blank] = "5"; 
   $data[price] = "10000"; 
   $data[tax] = 1000; 
   $data[list11] = "08  18"; 
    
    
   // 템플릿 파일명  
   $tpl_file = "calc.frm"; 
    
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
        $pdf->SetXY($tmp[1],$tmp[2]+138); 
        $pdf->Write(0,$cur_data);  
          
       
      } 
    
   
 /* 
  
   // 폰트를 설정    
   $pdf->setFont('HD','',13); 
  
   // 글씨의 자간을 설정 
   $pdf->SetCharSpacing(2.2); 
  
   // 글이 써질곳의 위치를 설정(x,y) - 단위 : mm   
   $pdf->SetXY(41, 35); 
  
   // 글씨를 쓰는 명령 0 : 줄간격    
   $pdf->Write(0,'123-45-67890'); 
*/ 
    
    
    
    
   // pdf파일을 생성  
   $pdf->Output();  
?> 
