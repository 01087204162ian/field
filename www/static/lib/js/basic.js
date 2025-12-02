$(document).ready(function(){

	/*2019-06-11 inha 학교명단리스트 엑셀로 내리기*/
	$('#inhaexcel').click(function(){
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		//window.open('../pop_up/MemberEndorse.php?DaeriCompanyNum='+num+'&CertiTableNum='+certiNum+'&InsuraneCompany='+iNum+'&policyNum='+a9,'ppss','left='+winl+',top='+wint+',resizable=yes,width=640,height=600,scrollbars=no,status=yes')	
		window.open('/static/inhaexcel.php?','inhaexcel','left='+winl+',top='+wint+',resizable=yes,width=400,height=300,scrollbars=no,status=yes')	;
	});
	/*2019-06-11 inha 학교명단리스트 엑셀로 내리기*/
	$('#sjModal').on('show.bs.modal', function (event) {
		$("#day__").html('');
		$("#year_").children().remove();	
		$("#month_").children().remove();	
		$("#day_list").children().remove();	
		$("#changeP").children().remove();	
		perFormance();//일별실적조회
		
	});
	
	$('#member').click(function(){
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		//window.open('../pop_up/MemberEndorse.php?DaeriCompanyNum='+num+'&CertiTableNum='+certiNum+'&InsuraneCompany='+iNum+'&policyNum='+a9,'ppss','left='+winl+',top='+wint+',resizable=yes,width=640,height=600,scrollbars=no,status=yes')	
		window.open('/static/member.php?','member','left='+winl+',top='+wint+',resizable=yes,width=600,height=600,scrollbars=no,status=yes')	;
	});
	//새창 만들기 위해 

	// 아이디 
	
	$("#serch2").click(function(){
		if($("#q").val() == ''){
			alert('아이디를 입력해주세요.');
			return false;
		} else {
			var act = '/index2.php/rider_2/food/bike/page/2';
			$("#serch_f").attr('action', act).submit();
		}
	});

	$("#search_btn").click(function(){
		if($("#q").val() == ''){
			alert('검색어를 입력해주세요.');
			return false;
		} else {
			var act = '/index2.php/rider_2/linc/gets/q/'+$("#q").val()+'/page/1';
			$("#bd_search").attr('action', act).submit();
		}
	});
	$("#mid").change(function(){

			alert(this.value);

	});

	//id 만들기
	$("#idmake").click(function(){
		//alert('1');
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		//window.open('../pop_up/MemberEndorse.php?DaeriCompanyNum='+num+'&CertiTableNum='+certiNum+'&InsuraneCompany='+iNum+'&policyNum='+a9,'ppss','left='+winl+',top='+wint+',resizable=yes,width=640,height=600,scrollbars=no,status=yes')	
		window.open('/index2.php/rider_2/food/idmake?','idmake','left='+winl+',top='+wint+',resizable=yes,width=400,height=300,scrollbars=no,status=yes')	

	});

	
	

	//이미지 파일을 저장하기 위해 


	$("#istore").click(function(){
		//editor=CKEDITOR.replace( '_description');
		var value = editor.getData();
		
		//alert($('#qnum').val()+'/'+value+'/'+$("#kind").val()+'/'+$("#title2").val());

		var send_url = "/_db/_db_sql.php";
		$.ajax({
				type: "POST",
				url:send_url,
				dataType : "xml",
				data:{ proc:"image_store",
						 num:$('#qnum').val(),
						 kind: $("#kind").val(),
						 description2:value, 
					     title:$("#title2").val()

					}
			}).done(function( xml ) {

				
				$(xml).find('values').each(function(){

					$(xml).find('item').each(function() {
						
						//$("#count").val($(this).find('count').text());
						alert($(this).find('message').text());

					});	 
				});
	
			});

	});


	// 메모를 입력 하기위해 

	$(".memow").blur(function(){

		if(this.value.length>1){

		   //alert(this.value+'/'+this.id)
		   var send_url = "/_db/_db_sql.php";
		$.ajax({
				type: "POST",
				url:send_url,
				dataType : "xml",
				data:{ proc:"memo_input",
						 num:this.id,
						 memo: this.value
					}
			}).done(function( xml ) {

				
				$(xml).find('values').each(function(){

					$(xml).find('item').each(function() {
						//alert($(this).find('message').text());
					});	 
				});	
			});
		}
	});
	//처리 상황을 변경하기 위해
	$(".sj").change(function(){

		
		var send_url = "/_db/_db_sql.php";
		$.ajax({
				type: "POST",
				url:send_url,
				dataType : "xml",
				data:{ proc:"state_change",
						 num:this.id,
						 ch: this.value
					}
			}).done(function( xml ) {

				
				$(xml).find('values').each(function(){

					$(xml).find('item').each(function() {
						//alert($(this).find('message').text());
					});	 
				});	
			});
			
	});
	//진행 상황 체크 

	$(".pj").change(function(){

		
		var send_url = "/_db/_db_sql.php";
		$.ajax({
				type: "POST",
				url:send_url,
				dataType : "xml",
				data:{ proc:"insurance_change",
						 num:this.id,
						 ch: this.value
					}
			}).done(function( xml ) {

				
				$(xml).find('values').each(function(){

					$(xml).find('item').each(function() {
						alert($(this).find('message').text());
					});	 
				});	
			});
			
	});

	//보험회사 변경을 하기 위해 

	$("#chchange").change(function(){

		var act = '/index2.php/rider_2/linc/gets/ch/'+$("#chchange").val()+'/page/1';
		//var act ='/index2.php/rider_2/food/gets/1/3';
		  //$("#serch_f").attr('method',post);
		 
		  $("#serch_c").attr('action',act).submit();

	});
	//계약자 검색
	$("#serch1").click(function(){

		if(!$("#contents").val()){
			$("#contents").focus();
			alert('검색어 입력 하세요!');
			return false;
		}

		if($("#contents").val().length>=1){
		  //alert($("#contents").val());

		  var act ='/index2.php/rider_2/food/gets/1/2';
		  //$("#serch_f").attr('method',post);
		  $("#serch_f").attr('action',act).submit();
		}
	});


$("#school7").datepicker({
	  closeText: '닫기',
      prevText: '이전달', 
      nextText: '다음달', 
      currentText: '오늘', 
      monthNames: ['1월','2월','3월','4월','5월','6월', 
      '7월','8월','9월','10월','11월','12월'], 
      monthNamesShort: ['1월','2월','3월','4월','5월','6월', 
      '7월','8월','9월','10월','11월','12월'], 
      dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], 
      dayNamesShort: ['일','월','화','수','목','금','토'], 
      dayNamesMin: ['일','월','화','수','목','금','토'], 
      weekHeader: 'Wk', 
      dateFormat: 'yy-mm-dd', 
      firstDay: 0, 
      autoSize: false, 
      isRTL: false, 
      showMonthAfterYear: true, 
      yearSuffix: '년', 

	});
	$("#school8").datepicker({
	  closeText: '닫기', 
      prevText: '이전달', 
      nextText: '다음달', 
      currentText: '오늘', 
      monthNames: ['1월','2월','3월','4월','5월','6월', 
      '7월','8월','9월','10월','11월','12월'], 
      monthNamesShort: ['1월','2월','3월','4월','5월','6월', 
      '7월','8월','9월','10월','11월','12월'], 
      dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], 
      dayNamesShort: ['일','월','화','수','목','금','토'], 
      dayNamesMin: ['일','월','화','수','목','금','토'], 
      weekHeader: 'Wk', 
      dateFormat: 'yy-mm-dd', 
      firstDay: 0, 
      autoSize: false, 
      isRTL: false, 
      showMonthAfterYear: true, 
      yearSuffix: '년', 

	});
	

	stripeTables();
	stripeTables2();
	stripeTables3();
	
	//사업자 번호 조회
	$("#school2").blur(function(){

		if(this.value.length>1){
			if(this.value.length==10){
				var first=this.value.substring(0,3);
				var second=this.value.substring(3,5);
				var third=this.value.substring(5,10);

				this.value=first+"-"+second+"-"+third;

				//사업자 번호로 조회 //여기서는 조회 필요가 없다..2016-06-12
				//businessSerch(this.value);
					
			}else{

				alert('하이푼 없이 10자리만 !!');
				return false;
				$("#school2").focus();
			}
		}

	});

	$("#school2").click(function(){
		if(this.value.length==12){
			var first=this.value.substring(0,3);
				var second=this.value.substring(4,6);
				var third=this.value.substring(7,12);

				this.value=first+second+third;

		}
	});
	
	//핸드폰 번호 조회
	$("#school4").blur(function(){
		
		if(this.value.length>1){
			if(this.value.length==9){
				var first=this.value.substring(0,2);
				var second=this.value.substring(2,5);
				var third=this.value.substring(5,9);

				this.value=first+"-"+second+"-"+third;

			}else if(this.value.length==10){
				var first=this.value.substring(0,3);
				var second=this.value.substring(3,6);
				var third=this.value.substring(6,10);

				this.value=first+"-"+second+"-"+third;

			}else if(this.value.length==11){
				var first=this.value.substring(0,3);
				var second=this.value.substring(3,7);
				var third=this.value.substring(7,11);

				this.value=first+"-"+second+"-"+third;

			}else{

				alert('하이푼 없이 10자리만 !!');
				return false;
				$("#school4").focus();
			}
		}

	});

	$("#school4").click(function(){
		if(this.value.length==11){
			var first=this.value.substring(0,2);
				var second=this.value.substring(3,6);
				var third=this.value.substring(7,11);

				this.value=first+second+third;

		}else if(this.value.length==12){
			var first=this.value.substring(0,3);
				var second=this.value.substring(4,7);
				var third=this.value.substring(8,12);

				this.value=first+second+third;

		}else if(this.value.length==13){
			var first=this.value.substring(0,3);
				var second=this.value.substring(4,8);
				var third=this.value.substring(9,13);

				this.value=first+second+third;

		}
	});

	//저장하기 위해
	$("#write_").click(function(){

		//
		//alert($("#client").val() +'/'+ $("#bank").html())

		if($("#client").val()==1 && $("#certi").html()){

			alert('수정이 가능하지 않습니다 '+'\r\n'+'사무실로 연락 주셔요');

			return false;

		}

		
		if(!$("#school1").val()){

			alert("계약자를 입력하셔요");
			$("#school1").focus();
			return false;
		}
		if(!$("#school2").val()){

			alert("사업자번호를 입력하셔요");
			$("#school2").focus();
			return false;
		}
		if(!$("#school3").val()){

			alert("주소를 입력하셔요");
			$("#school3").focus();
			return false;
		}
		if(!$("#school4").val()){

			alert("연락처를 입력하셔요");
			$("#school4").focus();
			return false;
		}
		if(!$("#school5").val()){

			alert("이메일을 입력하셔요");
			$("#school5").focus();
			return false;
		}


		if(!$('input[name="season"]:checked').length){
			alert('학기중  하나는 반드시 선택하셔야 합니다');
				$('input[name="season"]').focus();
			return false;
		}
		if(!$("#school7").val()){

			alert("보험시기를 입력하셔요");
			$("#school7").focus();
			return false;
		}

		if(!$("#school8").val()){

			alert("보험종기를 입력하셔요");
			$("#school8").focus();
			return false;
		}


		if(!$('input[name="plan"]:checked').length){
			alert('plan A  또는 plan B 중에서 하나는 반드시 선택하셔야 합니다');
				$('input[name="plan"]').focus();
			return false;
		}


	


		var school1=$("#school1").val();   //계약자
		var school2=$("#school2").val();   //사업자번호
		var school3=$("#school3").val();   //주소
		var school4=$("#school4").val();   //연락처
		var school5=$("#school5").val();   //이메일
		var school6=$('input[name="season"]:checked').val();//학기

		var school7=$("#school7").val();   //보험시기
		var school8=$("#school8").val();   //보험종기

		var school9=$('input[name="plan"]:checked').val(); //풀랜

		var week4=numberWithCommas2($("#week4").val());
		var week5=numberWithCommas2($("#week5").val());
		var week6=numberWithCommas2($("#week6").val());
		var week7=numberWithCommas2($("#week7").val());
		var week8=numberWithCommas2($("#week8").val());
		var week9=numberWithCommas2($("#week9").val());
		var week10=numberWithCommas2($("#week10").val());
		var week11=numberWithCommas2($("#week11").val());
		var week12=numberWithCommas2($("#week12").val());
		var week13=numberWithCommas2($("#week13").val());

		var week14=numberWithCommas2($("#week14").val());
		var week15=numberWithCommas2($("#week15").val());
		var week16=numberWithCommas2($("#week16").val());
		var week17=numberWithCommas2($("#week17").val());
		var week18=numberWithCommas2($("#week18").val());
		var week19=numberWithCommas2($("#week19").val());
		var week20=numberWithCommas2($("#week20").val());

		var week21=numberWithCommas2($("#week21").val());
		var week22=numberWithCommas2($("#week22").val());
		var week23=numberWithCommas2($("#week23").val());
		var week24=numberWithCommas2($("#week24").val());
		var week25=numberWithCommas2($("#week25").val());
		var week26=numberWithCommas2($("#week26").val());
		var week_total=numberWithCommas2($("#week_total").html());

		
		if(!parseInt(week_total)){
			alert('인원은 1명 이상 이어야 합니다');
			$("#week4").focus();
			return false;
		}
		// 저장하기 위해 

		//배서일때는  num 값을 제외하여 
		//배서를 저장하고 
		//그이후에 endorse를 값을 제거하여 

		

		// 수정이 될 수 있도록 하기 위해
		var send_url = "/_db/_db_sql.php";
			$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"write_",
						   num:$("#num").val(),
						   cNum:$("#cNum").val(),// 학교에서 직접 신규 등록시 필요
						   endorse:$("#endorse").val(),//배서일때만 값이 있다
						   directory:$("#directory").val(), 
						   school1:school1,
						   school2:school2,
						   school3:school3,
						   school4:school4,
						   school5:school5,
						   school6:school6,
						   school7:school7,
						   school8:school8,
						   school9:school9,
						   week4:week4,
						   week5:week5,
						   week6:week6,
						   week7:week7,
						   week8:week8,
						   week9:week9,
						   week10:week10,
						   week11:week11,
						   week12:week12,
						   week13:week13,
						   week14:week14,
						   week15:week15,
						   week16:week16,
						   week17:week17,
						   week18:week18,
						   week19:week19,
						   week20:week20,
						   week21:week21,
						   week22:week22,
						   week23:week23,
						   week24:week24,
						   week25:week25,
						   week26:week26,
						   week_total:week_total
						}
				}).done(function( xml ) {

					values = new Array();
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {
							
							$("#count").val($(this).find('count').text());
							  alert($(this).find('message').text() );


							// 청약서 프린트 상태였다면 

								//청약서 버튼을 지운다

								//print2

								$("#gu").children().remove();

							///

							//배서가 있으면 
							//endorse 삭제하고 num 값을 
							//기록하여 다음에 다시 수정하기 위해 

							if($(this).find('endorse').text()==1){

								$("#num").val($(this).find('num').text());
								$("#endorse").val("");
								$("#write_").val("수정");
							}	

							
							
						});	 
		            });
						
					
				});


		//
		//alert(plan+'/'+season+'/'+school1+'/'+school2 );
	});
	$("#week4").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});

	$("#week5").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week6").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week7").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week8").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week9").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week10").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week11").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week12").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week13").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week14").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week15").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week16").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week17").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week18").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week19").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week20").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week21").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week22").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week23").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week24").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	$("#week25").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});
	
    $("#week26").blur(function(){
		if(!this.value){
			this.value='0';
		}else{
			inwonTotal();
			this.value=numberWithCommas(this.value);
		}
	});

	/* 공지사항 이메일 select 값 변환 */





	/*
	$("#week4").click(function(){
		this.value='0';
	});
	$("#week5").click(function(){
		this.value='0';
	});
	$("#week6").click(function(){
		this.value='0';
	});
	$("#week7").click(function(){
		this.value='0';
	});
	$("#week8").click(function(){
		this.value='0';
	});
	$("#week9").click(function(){
		this.value='0';
	});
	$("#week10").click(function(){
		this.value='0';
	});
	$("#week11").click(function(){
		this.value='0';
	});
	$("#week12").click(function(){
		this.value='0';
	});
	$("#week13").click(function(){
		this.value='0';
	});*/

	//질문서프린트 하기

	
	


	
	/*$("#preiminum").blur(function(){

		if(this.value.length>1){
			var send_url = "/_db/_db_sql.php";
				$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"perminum_",
						   num:$("#num").val(),
						   preiminum:this.value
						}
				}).done(function( xml ) {

					values = new Array();
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {							
							  alert($(this).find('message').text());

							  $("#preiminum").val($(this).find('preiminum').text());
						});	 
		            });
						
					
				});
		}
	});*/

});




	

	

	

	


	
	

function inwonTotal(){
		
	$("#week_total").html('');
		//alert(numberWithCommas2($("#week4").val()));

	var w_total=parseInt(numberWithCommas2($("#week4").val()))
			   +parseInt(numberWithCommas2($("#week5").val()))
			   +parseInt(numberWithCommas2($("#week6").val()))
			    +parseInt(numberWithCommas2($("#week7").val()))
			   +parseInt(numberWithCommas2($("#week8").val()))
			   +parseInt(numberWithCommas2($("#week9").val()))
			   +parseInt(numberWithCommas2($("#week10").val()))
			   +parseInt(numberWithCommas2($("#week11").val()))
			   +parseInt(numberWithCommas2($("#week12").val()))
			   +parseInt(numberWithCommas2($("#week13").val()))
			   +parseInt(numberWithCommas2($("#week14").val()))
			   +parseInt(numberWithCommas2($("#week15").val()))
		       +parseInt(numberWithCommas2($("#week16").val()))
		       +parseInt(numberWithCommas2($("#week17").val()))
		       +parseInt(numberWithCommas2($("#week18").val()))
			   +parseInt(numberWithCommas2($("#week19").val()))
		       +parseInt(numberWithCommas2($("#week20").val()))
				+parseInt(numberWithCommas2($("#week21").val()))
		       +parseInt(numberWithCommas2($("#week22").val()))
		       +parseInt(numberWithCommas2($("#week23").val()))
		       +parseInt(numberWithCommas2($("#week24").val()))
			   +parseInt(numberWithCommas2($("#week25").val()))
			   +parseInt(numberWithCommas2($("#week26").val()))
		       
			   
					   
	$("#week_total").html(numberWithCommas(w_total)+'명');

}
//컴마 제거 함수
function numberWithCommas2(x) {
    var str = String(x);
    return str.replace(/[^\d]+/g, '');
}
//컴머 찍기
function numberWithCommas(x) {
	 var str = String(x);
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function stripeTables(){
	//alert('1')
	if(!document.getElementsByTagName) return false;
	//var tables=document.getElementsByTagName("table");
	//alert($("#bike").val());
	var tables=$("#bike");
	
	//	var tables=document.getElementById("serchTable").value;
	for(var i=0;i<tables.length;i++){
		
		var odd=false;
		var rows=tables[i].getElementsByTagName("tr");
		for(var j=0;j<rows.length;j++){
			var columns=rows[j].getElementsByTagName("td");
			
		/*	for(var k=0;k<columns.length;k++){
				columns[0].onclick=function(){
					columns[0].style.cursor='hand';
				}
			}*/

			var k=j%4;

			//alert(k);

				rows[j].style.cursor='hand';

			if(k==0 || k==1){

				rows[j].style.backgroundColor="#f9f9f9";

			}else if(k==2 || k==3){

				rows[j].style.backgroundColor="#ffffff";
			}

		/*
			if(odd==true){
				
				rows[j].style.backgroundColor="#ffffff";
				odd=false;
				

			}else{
				//rows[j].style.backgroundColor="#f9f8f0";
				if(j==0){

					rows[j].style.backgroundColor="#f9f8f0";
					rows[j].style.align="center";					

				    odd=true;
				}else{

				rows[j].style.backgroundColor="#f9f8f0";
				   odd=true;
				}

			}*/
		}

		//var thd=tables[i].getElementsByTagName("thead");
		//alert( i+'번'+thd.length);
	}
	
}

function stripeTables2(){
	//alert('1')
	if(!document.getElementsByTagName) return false;
	//var tables=document.getElementsByTagName("table");
	
	var tables=$("#rider_");
	
	//	var tables=document.getElementById("serchTable").value;
	for(var i=0;i<tables.length;i++){
		
		var odd=false;
		var rows=tables[i].getElementsByTagName("tr");
		for(var j=0;j<rows.length;j++){
			var columns=rows[j].getElementsByTagName("td");
			
		/*	for(var k=0;k<columns.length;k++){
				columns[0].onclick=function(){
					columns[0].style.cursor='hand';
				}
			}*/

			

		
			if(odd==true){
				
				rows[j].style.backgroundColor="#ffffff";
				odd=false;
				

			}else{
				//rows[j].style.backgroundColor="#f9f8f0";
				if(j==0){

					rows[j].style.backgroundColor="#f9f9f9";
					//rows[j].style.align="center";					

				    odd=true;
				}else{

				rows[j].style.backgroundColor="#f9f9f9";
				   odd=true;
				}

			}
		}

		//var thd=tables[i].getElementsByTagName("thead");
		//alert( i+'번'+thd.length);
	}
	
}


function stripeTables3(){
	//alert('1')
	if(!document.getElementsByTagName) return false;
	//var tables=document.getElementsByTagName("table");
	
	var tables=$("#dambo_");
	
	//	var tables=document.getElementById("serchTable").value;
	for(var i=0;i<tables.length;i++){
		
		var odd=false;
		var rows=tables[i].getElementsByTagName("tr");
		for(var j=0;j<rows.length;j++){
			var columns=rows[j].getElementsByTagName("td");
			
		/*	for(var k=0;k<columns.length;k++){
				columns[0].onclick=function(){
					columns[0].style.cursor='hand';
				}
			}*/

			

		
			if(odd==true){
				
				rows[j].style.backgroundColor="#ffffff";
				odd=false;
				

			}else{
				//rows[j].style.backgroundColor="#f9f8f0";
				if(j==0){

					rows[j].style.backgroundColor="#f9f9f9";
					//rows[j].style.align="center";					

				    odd=true;
				}else{

				rows[j].style.backgroundColor="#f9f9f9";
				   odd=true;
				}

			}
		}

		//var thd=tables[i].getElementsByTagName("thead");
		//alert( i+'번'+thd.length);
	}
	
}
$('#myModal2').on('show.bs.modal', function (event) {

	
	 var button = $(event.relatedTarget)
	 var recipient = button.data('value');
	 var endorse=button.data('value2');  //배서 일때만
		 
	 //alert(recipient); //questionnaire num 값

	 //idSerch(recipient); //id 리스트 조히하기 위해

	// alert($("#client").val());

	//
		//alert(endorse);


	clearfunction();// 초기 화

	//alert($("#cNum").val());
	var send_url = "/_db/_db_sql.php";
	$.ajax({
			type: "POST",
			url:send_url,
			dataType : "xml",
			data:{ proc:"serch2_",
				   num:recipient,
				   cNum:$("#cNum_").val(),
				   endorse:endorse
				   
				}
		}).done(function( xml ) {

			values = new Array();
			$(xml).find('values').each(function(){
				businessValue = new Array();
				$(xml).find('item').each(function() {

						//alert($(this).find('directory').text());
						businessValue.push( {	"num":$(this).find('num').text(), 
										"school1":$(this).find('school1').text(),
										"school2":$(this).find('school2').text(),
										"school3":$(this).find('school3').text(),
										"school4":$(this).find('school4').text(),
										"school5":$(this).find('school5').text(),
										"school6":$(this).find('school6').text(),
										"school7":$(this).find('school7').text(),
										"school8":$(this).find('school8').text(),
										"school9":$(this).find('school9').text(),
										"inscompany":$(this).find('inscompany').text(),
										"week4":$(this).find('week4').text(),
										"week5":$(this).find('week5').text(),
										"week6":$(this).find('week6').text(),
										"week7":$(this).find('week7').text(),
										"week8":$(this).find('week8').text(),
										"week9":$(this).find('week9').text(),
										"week10":$(this).find('week10').text(),
										"week11":$(this).find('week11').text(),
										"week12":$(this).find('week12').text(),
										"week13":$(this).find('week13').text(),
										"week14":$(this).find('week14').text(),
							            "week15":$(this).find('week15').text(),
										"week16":$(this).find('week16').text(),
										"week17":$(this).find('week17').text(),
										"week18":$(this).find('week18').text(),
										"week19":$(this).find('week19').text(),
										"week20":$(this).find('week20').text(),
										"week21":$(this).find('week21').text(),
										 "week22":$(this).find('week22').text(),
							             "week23":$(this).find('week23').text(),
							             "week24":$(this).find('week24').text(),
							             "week25":$(this).find('week25').text(),
							             "week26":$(this).find('week26').text(),
										"week_total":$(this).find('week_total').text(),
										"certi":$(this).find('certi').text(),
										"wdate_3":$(this).find('wdate_3').text(),
										"preiminum":$(this).find('preminum').text(),
										"bank":$(this).find('bank').text(),
										"bankname":$(this).find('bankname').text(),
										"cNum":$(this).find('cNum').text(),

										"gabunho":$(this).find('gabunho').text(),
										"simbuho":$(this).find('simbuho').text(),
										"endorse":$(this).find('endorse').text(),


										"cardnum":$(this).find('cardnum').text(),
										"yymm":$(this).find('yymm').text(),
										"damdanga":$(this).find('damdanga').text(),
										"pMethod":$(this).find('pMethod').text(),
										"cardap":$(this).find('cardap').text(),
										"damdangat":$(this).find('damdangat').text(),
										"ch":$(this).find('ch').text(),

										"daeinP":$(this).find('daeinP').text(),
										"daemoolP":$(this).find('daemoolP').text(),
										"directory":$(this).find('directory').text()
										
									} );

								 maxT =	businessValue.length;

								//alert('');
								continue_1();

				});	 
			});
				
				
		});

 
});

function continue_1(){
	var str="";

	 $("#mr").children().remove();
	for(var i=0; i<businessValue.length; i++){
		//alert(businessValue[i].school1);
		//alert(businessValue[i].directory);
		$("#num").val(businessValue[i].num);
		$("#school1").val(businessValue[i].school1);
		$("#school2").val(businessValue[i].school2);
		$("#school3").val(businessValue[i].school3);
		$("#school4").val(businessValue[i].school4);
		$("#school5").val(businessValue[i].school5);
		

		//alert(businessValue[i].school6);
		
		$('input:radio[name=season]:input[value='+businessValue[i].school6+']').attr("checked", true);
		$("#school7").val(businessValue[i].school7);
		$("#school8").val(businessValue[i].school8);
		
		$('input:radio[name=plan]:input[value='+businessValue[i].school9+']').attr("checked", true);
		
		$("#week4").val(businessValue[i].week4);
		$("#week5").val(businessValue[i].week5);
		$("#week6").val(businessValue[i].week6);
		$("#week7").val(businessValue[i].week7);
		$("#week8").val(businessValue[i].week8);
		$("#week9").val(businessValue[i].week9);
		$("#week10").val(businessValue[i].week10);
		$("#week11").val(businessValue[i].week11);
		$("#week12").val(businessValue[i].week12);
		$("#week13").val(businessValue[i].week13);
		$("#week14").val(businessValue[i].week14);
		$("#week15").val(businessValue[i].week15);
		$("#week16").val(businessValue[i].week16);
		$("#week17").val(businessValue[i].week17);
		$("#week18").val(businessValue[i].week18);
		$("#week19").val(businessValue[i].week19);
		$("#week20").val(businessValue[i].week20);
		$("#week21").val(businessValue[i].week21);
		$("#week22").val(businessValue[i].week22);
		$("#week23").val(businessValue[i].week23);
		$("#week24").val(businessValue[i].week24);
		$("#week25").val(businessValue[i].week25);
		$("#week26").val(businessValue[i].week26);
		$("#week_total").html(businessValue[i].week_total+'명');
		//alert(businessValue[i].directory);
		if(businessValue[i].directory==2){  //고등학교 1억, 2억, 대학교2억,3억

				$("#daein1").html('1');
				$("#daein2").html('2');
				$("#daein3").html('1');
				$("#daein4").html('2');
			}else{

				$("#daein1").html('2');
				$("#daein2").html('3');
				$("#daein3").html('2');
				$("#daein4").html('3');

			}

			$('#directory').val(businessValue[i].directory);
		//if($("#client").val()==1){ //고객용// 
	 if(businessValue[i].num){

		//var gabunho="516000090"+
			var dt = new Date();
		var str="";
		// Display the month, day, and year. getMonth() returns a 0-based number.
			var bmonth=dt.getMonth();
			var month = dt.getMonth()+1;
			var day = dt.getDate();
			var year = dt.getFullYear();
			if(day<10){day="0"+day};
			if(month<10){month="0"+month;}
			if(bmonth<10){bmonth="0"+bmonth;}
			var today =year+'-'+month+'-'+day;
			
			
			if($("#client").val()==1){ //고객용// 

				if(businessValue[i].endorse==1){

					alert('배서 작성하셔요');
					str +="<blockquote>";
					  str +="<p>본 질문서는 보험료 산출을 위한 중요한 자료로 활용됩니다. </p>";
					  str +="<footer>사실과 다를 경우 보험금 지급 시  영향을 미칠 수 있사오니 정확하게 작성해 주시기 바랍니다. ";
					  str +=".. 파일을 올려주셔요";
					  str +="</footer>";
					 str +="</blockquote>";
			/**/

						$("#mr").append(str); 
						
						$("#endorse").val(businessValue[i].endorse);  //배서 인 경우만...
						
						$("#write_").val("배서저장"); 




				}else{
						alert('조회 되었습니다');
						str +="<blockquote>";
							  str +="<p>";

						if(businessValue[i].inscompany==2){  //메리츠 화재 일 경우
							  str +="<button type='button' class='btn btn-primary' id='chang' "+"onclick="+"fileis()"+">자료보기</button> ";
						}
							  str +="<button type='button' class='btn btn-info btn-sm' id='print' onclick="+"question1()"+">질문서Print</button>";
						if(businessValue[i].ch>2){  // 가게약번호가 입력 되었다면 청약서 프린트 되게 하기 위해 
							
						       str +="<span id='gu'></span>";
						}
						//	if(businessValue[i].certi){
						//	  str +="<button type='button' class='btn btn-danger btn-sm' id='print3' onclick="+"question3()"+">증명서Print</button>";
						//	  str +="<button type='button' class='btn btn-danger btn-sm' id='print4' onclick="+"question4()"+">Policy_Print</button>";
						//	}  증권발행은 앞화면에서 하기 위해 
							  str +="</p>";
						str +="</blockquote>";
						str +="<h5> <span class='label label-default'>계약내용</span> </span></h5>";
						str +=" <table class='table table-bordered contact1'>"
						  str +="<tr>";
							str +="<th width='10%'>보험료</th>";
							str +="<td width='10%'><span id='preiminum'></td>";
							str +="<td width='15%'>&nbsp;<span id='bankname'></td>";
							str +="<td width='25%'>&nbsp;<span id='bank'></td>";
							str +="<th width='15%'>증권번호</th>";
							str +="<td width='20%'>&nbsp;<span id='certi'></td>";
						  str +="</tr>";
						str +=" </table>";

					$("#mr").append(str);   
					$("#preiminum").html(businessValue[i].preiminum);	
					$("#certi").html(businessValue[i].certi);
					$("#bank").html(businessValue[i].bank);
					$("#bankname").html(businessValue[i].bankname);
					$("#write_").val("수정"); 

					var print;
					print='';
					print="<button type='button' class='btn btn-success btn-sm' id='print2' onclick="+'question2()'+">청약서Print</button>";
					if(businessValue[i].ch>2){
						if(businessValue[i].inscompany==2){ //메리츠 화재 일 경우
						   $("#gu").append(print); 
						}
					}

					
				}

			}else{
				alert('조회 되었습니다!!');
				str +="<blockquote>";
					  str +="<p>";
					  str +="<button type='button' class='btn btn-primary' id='chang' "+"onclick="+"fileis()"+">자료보기</button> ";
					  str +="<button type='button' class='btn btn-info btn-sm' id='print' onclick="+"question1()"+">질문서Print</button>";
					  str +="<button type='button' class='btn btn-success btn-sm' id='print2' onclick="+"question2()"+">청약서Print</button>";
					  str +="<button type='button' class='btn btn-info btn-sm' id='print4' onclick="+"question5()"+">공문</button>";
					  str +="<button type='button' class='btn btn-danger btn-sm' id='print3' onclick="+"question3()"+">증명서Print</button>";
					  str +="<button type='button' class='btn btn-danger btn-sm' id='print5' onclick="+"question4()"+">Policy_Print</button>";
					  str +="<button type='button' class='btn btn-danger btn-sm' id='print6' onclick="+"question6()"+">아이디메일</button>";
					  str +="<button type='button' class='btn btn-info btn-sm' id='print7' onclick="+"question7()"+">무사고 확인서</button>";
					 // str +="<button type='button' class='btn btn-info btn-sm' id='print4' onclick="+"question8()"+">가입안내문</button>";
					  str +="<button type='button' class='btn btn-info btn-sm' id='print8' onclick="+"question9()"+">가입안내문</button>";

					  //공지사항 메일 보내기 버튼 [2021.09.08 개발자 : 오정현]
				      str +="<button type='button' class='btn btn-info btn-sm' id='print10' data-toggle='modal' data-target='emailmodal' onclick="+"emailmodal()"+">메일공지</button>";
					  str +="<button type='button' class='btn btn-danger btn-sm' id='print11' onclick="+"question12()"+">비밀번호 초기화</button>";

					  str +="</p>";
				str +="</blockquote>";
				str +="<h5> <span class='label label-default'>계약내용</span> </span></h5>";
				str +=" <table class='table table-bordered contact1'>"
				  str +="<tr>";

					str +="<td width='16%'><input type='text' class='input' id='gabunho' placeholder='가계약번호' "+"onblur="+"gabunho()"+"></td>";
					str +="<td width='12%'><input type='text' class='input' id='simbuho' placeholder='인수심사번호' "+"onblur="+"simbunho()"+"></td>";
					str +="<td width='9%'><input type='text' class='inputR' id='preiminum' placeholder='보험료'></td>";
					str +="<td width='5%'><input type='text' class='input' id='bankname' placeholder='은행'></td>";
					str +="<td width='16%'><input type='text' class='input' id='bank' placeholder='가상계좌' "+"onblur="+"bank()"+"></td>";
					str +="<td width='17%'><input type='text' class='inputR' id='cardnum' placeholder='카드번호'></td>";
					str +="<td width='7%'> <input type='text' class='input' id='yymm' placeholder='유효기간' "+"onblur="+"card()"+"></td>";
					str +="<td width='10%'><select id='pmethod' onchange='pmethod()'>"
					    +"<option value='1'>결제방법</option>"
						+"<option value='2'>현금</option>"
						+"<option value='3'>카드</option>"
						+"</select></td>";
					str +="<td width='8%'><input type='text' class='input' id='cardap' placeholder='카드승인번호'  "+"onblur="+"cardapp()"+"></td>";
					
					
				  str +="</tr>";
				   str +="<tr>";
				   str +="<td><input type='text' class='input' id='damdanga' placeholder='담당자' "+"onblur="+"damdanga()"+"></td>";
					str +="<td colspan='2'><input type='text' class='input' id='damdangat' placeholder='담당자연락처' onblur=damdangatel() onclick=damdangatelC()"
					    +"></td>";

					
					str +="<td  colspan='2'><input type='text' class='input' id='certi' placeholder='증권번호'  "+"onblur="+"certi()"+"></td>";
					str +="<td colspan='2'><input type='text' class='input' id='wdate_3' placeholder='영수일'  "+"onblur="+"wdate_3()"+"></td>";

					str +="<td><input type='text' class='input' id='mem_idVal' disabled placeholder='ID발급이력없음'></td>"; // 등록된 메일로 이전에 등록된 아이디 출력
					str +="<td  colspan='2'><span id='kj'></span></td>";  //아이디 정하는 곳/ /** 아이디설정원본 **/



					// str +="<td><span id='kj'><input type='text' class='input' id='mids' placeholder='아이디설정' onblur='searchId_list()'></span></td>";  //아이디 정하는 곳/
				// str +="<td><span id='kj'><input type='text' class='input' id='mids' placeholder='아이디설정'></span></td>";  //아이디 정하는 곳/

					

				//	str +="<td><input type='text' class='input' id='bankname' placeholder='은행'></td>";
				//	str +="<td><input type='text' class='input' id='bank' placeholder='가상계좌' "+"onblur="+"bank()"+"></td>";
				//	str +="<td><input type='text' class='input' id='certi' placeholder='증권번호'  "+"onblur="+"certi()"+"></td>";
				//	str +="<td><span id='kj'></span></td>";  //아이디 정하는 곳/
				  str +="</tr>";
				str +=" </table>";


				$("#mr").append(str);   
				
				$("#wdate_3").datepicker({
				  closeText: '닫기',
				  prevText: '이전달', 
				  nextText: '다음달', 
				  currentText: '오늘', 
				  monthNames: ['1월','2월','3월','4월','5월','6월', 
				  '7월','8월','9월','10월','11월','12월'], 
				  monthNamesShort: ['1월','2월','3월','4월','5월','6월', 
				  '7월','8월','9월','10월','11월','12월'], 
				  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], 
				  dayNamesShort: ['일','월','화','수','목','금','토'], 
				  dayNamesMin: ['일','월','화','수','목','금','토'], 
				  weekHeader: 'Wk', 
				  dateFormat: 'yy-mm-dd', 
				  firstDay: 0, 
				  autoSize: false, 
				  isRTL: false, 
				  showMonthAfterYear: true, 
				  yearSuffix: '년', 

				});


				$("#preiminum").val(businessValue[i].preiminum);
				$("#gabunho").val(businessValue[i].gabunho);
				$("#simbuho").val(businessValue[i].simbuho);
				
				$("#certi").val(businessValue[i].certi);
				$("#wdate_3").val(businessValue[i].wdate_3);
				$("#bank").val(businessValue[i].bank);
				$("#bankname").val(businessValue[i].bankname);


				$("#cardnum").val(businessValue[i].cardnum);
				$("#yymm").val(businessValue[i].yymm);
				$("#damdanga").val(businessValue[i].damdanga);
				$("#pmethod").val(businessValue[i].pMethod);
				$("#cardap").val(businessValue[i].cardap);
				$("#damdangat").val(businessValue[i].damdangat)
				
				
				

				$("#daein").html(businessValue[i].daeinP);
				$("#daemool").html(businessValue[i].daemoolP);
				$("#totalP").html(businessValue[i].preiminum);



			/*	if(businessValue[i].directory==2){  //고등학교 1억, 2억, 대학교2억,3억

					$("#daein1").html('1');
					$("#daein2").html('2');
					$("#daein3").html('1');
					$("#daein4").html('2');
				}else{

					$("#daein1").html('1');
					$("#daein2").html('2');
					$("#daein3").html('1');
					$("#daein4").html('2');

				}*/

					$("#write_").val("수정"); 
			}

			
			
		}else{
			

		    alert('신규 질문서 작성하셔요');
			str +="<blockquote>";
			 str +="<p>본 질문서는 보험료 산출을 위한 중요한 자료로 활용됩니다. </p>";
			 str +="<footer>사실과 다를 경우 보험금 지급 시  영향을 미칠 수 있사오니 정확하게 작성해 주시기 바랍니다. </footer>";
			str +="</blockquote>";
			/**/

			$("#mr").append(str);   
			$("#write_").val("저장"); 
		}
		
		$("#cNum").val(businessValue[i].cNum); //아이디 설정
		
		
	}

		

	idSerch(); /** 아이디설정원본 **/
	idSerch2();
}

/**
 * 작성자 : 오정현
 * 작성일자 : 2022.12.20
 * 용도 : 아이디 조회 [ select mem_id from 2014Costmer where idmail = $school5 order by num DESC limit 1] -->  이메일 중복이 있을 수 있고, 가장 최근에 설정한 아이디로 한다.
 *
 *	아이디 부여시 [ select num from 2014Costmer where mem_id = $('#mids').val() ]
 *		쿼리 결과값(length) 가 0보다 크면 존재함
 *		존재하지 않을경우 ID 생성하라는 alert
 *
 *
 * 장팀장님 추가 요청 : 12.20 17시 50분.
 * --> 일단은 질문서에 등록된 이메일에 아이디가 부여된 이력이 있다면 현재 상태처럼 아이디가 보이는것은 good
 * but 질문서 신청은 현장실습홈페이지 / 선생님 어드민 홈페이지 두군데에서 신청하는데,
 * 구분 가능한 방법은 현장실습페이지에서 한거는 아이디가 부여되지 않고 오고,
 * 선생님 어드민에서 신청한것은 아이디가 부여되서 들어옴.
 * 하지만 선생님이 어드민에서 아닌 홈페이지에서 의뢰서신청할 경우(이미 등록되어있는 메일로 의뢰서 작성하는 경우),
 * 선생님께 부여한 기존 아이디가 질문서에 보이고, 아이디 선택(select)는 지정되지 않고 들어옴
 * ==> 이런 경우 선생님께 기존의 아이디 사용여부 확인이 필요하기때문에 팝업하나가 떴으면 한다.
 * ex) [ 기존아이디워딩 ] 로 아이디 지정된 이력이 있습니다. 해당 아이디로 아이디부여하시겠습니까? 계약자 연락 [ ]
 *
 *
 */
function idSerch2(){
	// console.log($(this).val());
	var send_url = "/_db/_db_sql.php";
	console.log('질문서 번호(questionnair_num) : ',$("#num").val());
	$.ajax({
		type: "POST",
		url:send_url,
		dataType : "xml",
		data:{ proc:"idSerch2",
			school5:$("#school5").val(),
			num:$("#num").val()

		}
		,success: function(data){	/** 데이터 불러오는데 성공한다면 **/
			console.log(data);
			// <value> 태그아래 <item> 태그아래 <mem_id> 태그안의 값을 텍스트 화함
			$(data).find('values').each(function(){
				$(data).find('item').each(function(){
					values = new Array();
					values.push({
						"mem_id": $(this).find('mem_id').text(),
						"cNum": $(this).find('cNum').text(),
						"num": $(this).find('num').text(),
						"message": $(this).find('message').text(),
						"register": $(this).find('register').text()
					});

					maxT = values.length;
					// console.log(values[0].mem_id);
					// console.log(values[0].cNum);
					$('#mem_idVal').val(values[0].mem_id);	// limit 1 한개만 불러오니까 그냥 넣음.
				})
			});
			/**
			 * 데이터베이스에서 아이디가 있는지 **모달이 열릴 때** 여부 확인..
			 *
			 * 0보다 크면 아이디 부여안해도됨. [ 아이디 부여 input hidden ]
			 * 열리는 모달의 questionnaire 의 num (PK) 의 cNum 값이 0이라면 아이디 부여 대상 [ 아이디 부여 input visiable ]
			 */
			var schoolNumber = $("#num").val();
			var schoolName = $("#school1").val();
			var schoolCell = $("#school4").val();
			var schholId = $("#mem_idVal").val();
			var register = values[0].register;
			var costmerPK = values[0].num;
			console.log($("#school1").val() , $("#school4").val());
			if(schholId.length > 0 && register == '2'){
				// console.log('아이디 부여되어있음');
				console.log('이 메일로 아이디가 존재하는데, 현재 이 질문서에는 발급하지 않음');
				var alertMSG = "질문서 [ " + schoolNumber + " ] - " + schoolName + "(" + schoolCell + ")의 등록된 아이디가 있습니다.\n등록된 아이디 : [" + schholId + "] \n위 아이디로 부여하시겠습니까?";
				if(confirm(alertMSG) == true){
					id_setting2(costmerPK);
				};
				//사용하지 않음
				// $("#mids").val('아이디있음');
				// $("#mids").attr('disabled', true);
			}else{
				// console.log('아이디 부여되어있지 않음');
				// $("#mids").remove(); // input 삭제
			}

		}
	});

}

//id 조회하기 위해
/** 아이디설정원본 **/
function idSerch(recipient){
		//alert('성준');
		var send_url = "/_db/_db_sql.php";
	$.ajax({
			type: "POST",
			url:send_url,
			dataType : "xml",
			data:{ proc:"idSerch",
				   num:$("#num").val()
				   
				}
		}).done(function( xml ) {
			console.log(xml);
			values = new Array();
			$(xml).find('values').each(function(){
				idValue = new Array();
				$(xml).find('item').each(function() {
						idValue.push( {	"num":$(this).find('num').text(),
										"mem_id":$(this).find('mem_id').text()
									} );

								 maxT =	idValue.length;

								//alert('조회 되었습니다');
								
				});	 

				continue_id();

			});
				
				
		});

}
/** 아이디설정원본 **/
function continue_id(){

	var str='';
// 아이디 select
    $("#kj").children().remove();
	str += "<tr>";
	   str += "<td>";
	   		 // str += "<input type='text' list='serchGet2()' id='mid'>"
			 // 	str += "<datalist id='serchGet2()'>"
	     str += "<select id='mid' onchange='serchGet2()'>";
		     str += "<option value='0'>" + "id선택"+"</option>";
	for(var i=0; i<idValue.length; i++){
		
		     str += "<option value='"+idValue[i].num+"'>" +idValue[i].mem_id +"</option>";

	}

			str += "<option value='신규 ID'>" + "신규 ID"+"</option>";
	    str += "</select>";
		// str += "</datalist>"
	  str += "</td>";
	str += "</tr>";

		//alert($("cNum").val());

	$("#kj").append(str);   
	//alert($("#cNum").val());
	$("#mid").val($("#cNum").val());

//alert($("cNum").val()+'//'+$("#mid").val())
	    
}


function searchId_list(){
	var send_url = "/_db/_db_sql.php";
	// console.log('배서번호 : ',$("#mid").val());
	console.log('조회할 아이디 : ', $("#mids").val());
	// console.log('조회되는 아이디 : ', $("#mem_idVal").val());

	// return;

	// 선택한 아이디가 사용중인 학교를 표시하고 그다음에 설정하도록 하자
	// if(confirm("해당 배서의 아이디를 [" + $('#mid').val() + "] 로 설정하시겠습니까?")){
	return;

	var send_url = "/_db/_db_sql.php";
	$.ajax({
		type: "POST",
		url:send_url,
		dataType : "xml",
		data:{ proc:"searchId_list",
			mids:$("#mids").val(),

			//qnum:$("#num").val()

		}
		,success: function(data){	/** 데이터 불러오는데 성공한다면 **/
		console.log(data);
			// <value> 태그아래 <item> 태그아래 <mem_id> 태그안의 값을 텍스트 화함
			$(data).find('values').each(function(){
				$(data).find('item').each(function(){
					values = new Array();
					values.push({
						"num": $(this).find('num').text()
					});

					maxT = values.length;
					console.log(values[0].num);
					// $('#mem_idVal').val(values[0].mem_id);	// limit 1 한개만 불러오니까 그냥 넣음.
					if( values[0].num > 0 ){	//2014Costmer 안에 있다면
						console.log("아이디 데이터 존재");
						console.log('업데이트될 아이디 : ', $("#mids").val());
						console.log('questionnaire 번호 : ',$("#num").val());
						console.log('directory val : ', $('#directory').val());
						// return;
						$.ajax({
							type: "POST",
							url:send_url,
							dataType : "xml",
							data:{ proc:"id_setting",
								idnum:values[0].num,
								qnum:$("#num").val(),
								directory_:$('#directory').val(),

							}
						}).done(function( xml ) {

							//values = new Array();
							$(xml).find('values').each(function(){
								//idValue = new Array();
								$(xml).find('item').each(function() {
									alert($(this).find('message').text());
								});
							});
						});
					}else{
						alert('해당 아이디는 존재하지 않습니다! 아이디를 생성해주세요!');
					}
				})
			});

		}
	})
	// 	.done(function( xml ) {
	// 	console.log(xml);
	// 	values = new Array();
	// 	$(xml).find('values').each(function(){
	// 		//idValue = new Array();
	// 		$(xml).find('item').each(function() {
	// 			$(this).find('num').text();
	//
	// 		});
	// 		console.log()
	// 	});
	// });
	// }
	// else{
	// 	return;
	// }


}


//id 설정
//
function serchGet2(){ // 

		// 선택한 아이디가 사용중인 학교를 표시하고 그다음에 설정하도록 하자
	// if(confirm("해당 배서의 아이디를 [" + $('#mid').val() + "] 로 설정하시겠습니까?")){
		var send_url = "/_db/_db_sql.php";

		// console.log("아이디 번호 : ",$("mid").val());
		$.ajax({
			type: "POST",
			url:send_url,
			dataType : "xml",
			data:{ proc:"id_serch2",
				idnum:$("#mid").val(),

				//qnum:$("#num").val()

			}
		}).done(function( xml ) {

			//values = new Array();
			$(xml).find('values').each(function(){
				//idValue = new Array();
				$(xml).find('item').each(function() {
					message=$(this).find('message').text();
					if(confirm(message)){

						id_setting();

					}
				});
			});
		});
	// }
	// else{
	// 	return;
	// }




	
	//alert($("#mid").val()+'/'+ $("#num").val());
}

function id_setting2(costmerPK){
	var send_url = "/_db/_db_sql.php";
	$.ajax({
		type: "POST",
		url:send_url,
		dataType : "xml",
		data:{ proc:"id_setting",
			idnum:costmerPK,
			qnum:$("#num").val(),
			directory_:$('#directory').val(),

		}
	}).done(function( xml ) {

		//values = new Array();
		$(xml).find('values').each(function(){
			//idValue = new Array();
			$(xml).find('item').each(function() {
				alert($(this).find('message').text());
			});
		});
		question6();	//아이디 전송
	});

}

function id_setting(){
	var send_url = "/_db/_db_sql.php";
		$.ajax({
				type: "POST",
				url:send_url,
				dataType : "xml",
				data:{ proc:"id_setting",
					   idnum:$("#mid").val(),
					   qnum:$("#num").val(),
					   directory_:$('#directory').val(),

					}
			}).done(function( xml ) {

				//values = new Array();
				$(xml).find('values').each(function(){
					//idValue = new Array();
					$(xml).find('item').each(function() {
						alert($(this).find('message').text());
					});
				});
			});

}


// 이미지 모달에서 이미지 조회 하기 위해

$('#exampleModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var recipient = button.data('whatever') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  //modal.find('.modal-title').text('New message to ' + recipient)
  modal.find('.modal-body input').val(recipient)
	//alert($('#num').val());

	  $('#qnum').val($('#num').val())


	  
	  var send_url = "/_db/_db_sql.php";
	   $.ajax({
			type: "POST",
			url:send_url,
			dataType : "xml",
			data:{ proc:"serch3_",
				   num:$('#num').val()
				   
				}
		}).done(function( xml ) {

			values = new Array();
			$(xml).find('values').each(function(){
				businessValue = new Array();
				$(xml).find('item').each(function() {
					
					modal.find('.modal-title').text($(this).find('school1').text())

						//alert($(this).find('description2').text());
								
					businessValue.push( {	"num":$(this).find('num').text(), 
											"title":$(this).find('title').text(),

											
											"description":$(this).find('description2').text()
									} );

								 maxT =	businessValue.length;
								 

								 //alert(maxT)
								 continue_2();

				});	 
			});
				
				
		});
})

function continue_2(){
	$("#sjo").children().remove();
	var str="";


	//	str +="<iframe>";
		// str +="<table>";
			str += "<tr>";
				//str += "<td width='25%'>"+"<img id='loading' src='/2014/ajax/loading.gif' style='display:none;'>"+"</td>\n";
				//str += "<td>"+"파일명 "+"</td>\n";
				//str += "<td class='center_td'>"  //증권시작일
				//	+"<input type='text' class='textareP' id='sigi'"
					//+"value='"+certiTableValue[i].certiTableNum
				//	+'"
				//	+" onBlur='cSigi()'"
				//	+" onClick='dSigi()'"
				//	+"></td>\n";
			
		//		str += "<td width='5%'>"+"<input id='fileToUpload' type='file' size='45' name='fileToUpload' class='fileinput'>"+"</td>\n";
		//		 str += "<td width='15%'>"+"<button class='btn-b' id='buttonUpload' onclick='return fileUP();'>Upload</button>"+"</td>\n";
			  // str += "<td width='15%'>"+"<button class='btn-b' id='buttonUpload' onclick='return ajaxFileUpload(2);'>Upload</button>"+"</td>\n";
		//	str += "</tr>\n";
		// str +="<table>";
	//str +="<iframe>";

		
	/*for(var i=0; i<maxT; i++){
		
		
		str += "<tr>";
			str += "<td>"
					+businessValue[i].title+"</td>\n";
			str += "<td>"
					+businessValue[i].description+"</td>\n";

			
		//
		 str += "</tr>";
		
		//alert(businessValue[i].title+'/'+businessValue[i].description);


	}*/
	$("#sjo").append(str);
}
function ajaxFileUpload(endorse) // endorse 2 배서 추가 이므로 시작이을 배서일기준으로 하기 위해
	{
		//alert(endorse)
		//$("#sj").children().remove();
		/*$("#loading")
		.ajaxStart(function(){
			$(this).show();
		})
		.ajaxComplete(function(){
			$(this).hide();
		});*/

		$.ajaxFileUpload
		(
			{
				url:'/static/doajaxfileupload.php',
				secureuri:false,
				fileElementId:'fileToUpload',
				dataType: 'json',
				data:{name:'logan', id:'id'},
				success: function (data, status)
				{
					if(typeof(data.error) != 'undefined')
					{
						if(data.error != '')
						{
							alert(data.error);
						}else
						{
							alert(data.msg);
						//	fileUploadAfter(data.msg,endorse);
						}
					}
				},
				error: function (data, status, e)
				{
					alert(e);
				}
			}
		)
		
		return false;

	}

//질문서 프린트 하기
function question1(){
		
		var claimNum=$("#num").val();
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/2014/_pages/php/downExcel/claim2.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	

}

	//청약서프린트 하기

function question2(){
		
		//alert('1')
		var claimNum=$("#num").val();
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/2014/_pages/php/downExcel/claim3.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	
}

//고객 화면에서 청약서 발급하기 위해 
function cPrint2(num){
	    var claimNum=num;
		//청약서를 프린트 할 수 있는 상태인지 학인하자
		var send_url = "/_db/_db_sql.php";
		$.ajax({
				type: "POST",
				url:send_url,
				dataType : "xml",
				data:{ proc:"print",
					   num:claimNum
					  
					}
			}).done(function( xml ) {

		
				$(xml).find('values').each(function(){
					//idValue = new Array();
					$(xml).find('item').each(function() {						
						alert($(this).find('message').text());

						if($(this).find('simbuho').text()){


							var claimNum=$(this).find('num').text()
							var winl = (screen.width - 1024) / 2
							var wint = (screen.height - 768) / 2
		
							window.open('/2014/_pages/php/downExcel/claim3.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	
						}
					});	 
				});
			});



}


	//가입증명서프린트하기

function question3(){
		
		
		var claimNum=$("#num").val();
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/2014/_pages/php/downExcel/claim4.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	

}

//고객 화면에서 증권발급하기 위해 
function cPrint(num){
	var claimNum=num;
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/2014/_pages/php/downExcel/claim5.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	
}
//고등학교 가입안내문 
function question8(num){
	var claimNum=$("#num").val();
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/2014/_pages/php/downExcel/claim8.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	
}
//고등학교 가입안내문 
function question9(num){
	var claimNum=$("#num").val();
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/2014/_pages/php/downExcel/claim9.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	
}
function question4(){
		
		
		var claimNum=$("#num").val();
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/2014/_pages/php/downExcel/claim5.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	

}
function question7(){ //무사고 확인서

		var claimNum=$("#num").val();
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2

		window.open('/2014/_pages/php/downExcel/claim7.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');

}

function question7_mail(){ //무사고 확인서

	var claimNum=$("#num").val();
	var winl = (screen.width - 1024) / 2
	var wint = (screen.height - 768) / 2

	// window.open('/2014/_pages/php/downExcel/claim7.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');
	var url = '/2014/_pages/php/downExcel/claim7.php?claimNum='+claimNum;
	return url;
}


function question5(){ //공문
		
		
		var claimNum=$("#num").val();
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/2014/_pages/php/downExcel/claim6.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	

}


function question6(){ //이메일 발송하기 위해 

		// console.log('아이이메일전송');
		if(confirm("[" + $('#school5').val() + "]의 메일로 아이디 / 비밀번호 전송하시겠습니까?") == true){
			var claimNum=$("#num").val();
			var send_url = "/_db/_db_sql.php";
			$.ajax({
				type: "POST",
				url:send_url,
				dataType : "xml",
				data:{ proc:"mail2_",
					qnum:claimNum


				}
			}).done(function( xml ) {

				values = new Array();
				$(xml).find('values').each(function(){

					$(xml).find('item').each(function() {
						alert($(this).find('message').text());
					});
				});


			});
		}else{
			return;
		}


		// question12();

}



function question11(){

	var noticeSelect = $("#noticeSelect option:selected").val();		//공지사항 select 값
	var email = $('#school5').val();			//받을 사람 이메일

	if(confirm("[" + email + "] 으로 해당 이메일을 발송 하시겠습니까?") == true){

			var title = "";		//메일 제목
			var content = "";		//메일 내용
			var attachfile = ""; 	//첨부파일

			if(noticeSelect == 1){
				title = "[한화 현장실습보험] 보험금 청구시 필요서류 안내";
				content = "<div>"
				content += "안녕하십니까.<br><br>";
				content += "현장실습보험 문의에 깊이 감사드립니다.<br><br>";
				content += "1. 보험금 청구서(+필수 동의서) 및 문답서 (첨부파일 참고)<br>";
				content +=	"  * 보험금 청구 기간은 최대 1년까지 가능합니다.<br><br>";
				content += "2. 신분증 및 통장사본<br><br>";
				content += "3. 진단서 또는 초진차트<br><br>";
				content += "4. 병원치료비 영수증(계산서)_치료비세부내역서, 약제비 영수증<br><br>";
				content += "5. 실습기관의 현장실습 출석부 사본 또는 실습일지<br><br>";
				content += "6. 학생 학적을 확인할 수 있는 학교 전산 캡처본<br><br>";
				content += "7. 보험금 청구서 밑의 법정대리인의 서명, 가족관계증명서, 보호자 신분증 및 통장사본<br>";
				content += "(고등학생 현장 실습 사고 접수 경우만 해당)<br><br>";
				content += "위 서류들을 구비하셔서 메일 답장으로 부탁드립니다.<br><br>"
				content += "자세한 사항은 현장실습 홈페이지(<a href='http://lincinsu.kr/'>http://lincinsu.kr/</a>)의 보상안내, 공지사항에서도 확인하실 수 있습니다.";
				content += "<br><br>감사합니다.<br><br><hr>";
				content += "<p style='font-size: 8px' style='color: #00A000'>이투엘보험대리점</p>";
				content += "<p style='font-size: 8px' style='color: #00A000'>현장실습보험지원팀</p>"
				content += "<p style='font-size: 8px' style='color: #00A000'>1533-5013</p><br>";
				content += "현장실습보험은 <span style='color: #FB2C10'>한화손해보험</span>에서 제공합니다.";
				content += "</div>"
				attachfile = "./static/lib/attachfile/보험금 청구서,동의서,문답서_2023.pdf";



			}else if(noticeSelect == 2){
				title = "[이용안내문]한화 현장실습 보험 이용 안내문";
				content = "<div>";
				content += "안녕하십니까.<br><br>";
				content += "현장실습보험 문의에 깊이 감사드립니다.<br><br>";
				content += "현장실습 이용밥법이 담긴 안내문 첨부파일로 전달드립니다.<br><br>";
				content += "현장실습 계약절차는 아래와 같습니다.<br><br>";
				content += "1. 견적의뢰 (견적 의뢰는 <a href='https://lincinsu.kr/'>http://lincinsu.kr/</a> 으로 접속 후 학교견적의뢰 메뉴<br><br>";
				content += "  - 계약자는 학교명으로 부탁드립니다.<br><br>";
				content += "2. 홈페이지를 이용할 수 있는 아이디와 패스워드 발급하여 메일로 안내드립니다.<br><br>";
				content += "3. 청약서 및 질문서 발행하여 메일로 안내드립니다.<br><br>"
				content += "4. 청약서 및 질문서에 직인 날인하여 회신 및 보험료 결제(법인카드 또는 가상계좌 입금)<br>"
				content += "  - 부여해드린 아이디 및 패스워드로 로그인 후 왼쪽의 질문서를 클릭하여 '자료보기'에 들어가면 관련 서류를 다운로드 받으실 수 있습니다.<br>";
	 			content += "  - 현장실습홈페이지는 크롬브라우저로 최적화되어 있습니다. 크롬으로 이용부탁드립니다.<br><br>";
				content += "5. 보험증권 발급<br><br>";
				content += "이렇게 진행됩니다.<br><br>";
				content += "견적의뢰 해주시면 청약서 발행하며 더욱 상세한 안내를 드리고 있으니 참고해주세요.<br><br>";
				content += "감사합니다.<br><br><hr>";
				content += "<p style='font-size: 8px' style='color: #00A000'>이투엘보험대리점</p>";
				content += "<p style='font-size: 8px' style='color: #00A000'>현장실습보험지원팀</p>"
				content += "<p style='font-size: 8px' style='color: #00A000'>1533-5013</p><br>";
				content += "현장실습보험은 <span style='color: #FB2C10'>한화손해보험</span>에서 제공합니다.";
				content += "</div>"
				attachfile = "./static/lib/attachfile/한화 현장실습 보험 안내 팜플렛.pdf";


			} else if(noticeSelect == 3){
				var musagourl = question7_mail();
				console.log(musagourl);
				title = "[한화 현장실습보험] 무사고 확인서 요청";
				content = "<div>";
				content += "안녕하십니까.<br><br>";
				content += "보험 시작일이 설계일보다 앞서 무사고 확인서를 전달드립니다.<br><br>";
				content += "첨부된 파일의 입금일에 입금 또는 카드결제하실 날짜 기입 후<br><br>";
				content += "하단에 명판직인 날인하여 회신 주시면 청약서 발급 후 전달드리겠습니다.<br><br>";
				content += "하기 링크 확인 부탁드립니다.<br><br>";
				content += "<a href='https://www.lincinsu.kr/" + musagourl + "'>무사고 확인서 링크</a><br><br>";
				content += "감사합니다.<br><br><hr>";
				content += "<p style='font-size: 8px; color: #00A000;'>이투엘보험대리점</p>";
				content += "<p style='font-size: 8px; color: #00A000;'>현장실습보험지원팀</p>";
				content += "<p style='font-size: 8px; color: #00A000;'>1533-5013</p><br>";
				content += "현장실습보험은 <span style='color: #FB2C10;'>한화손해보험</span>에서 제공합니다.";
				content += "</div>";

				attachfile = ".";

			}


		/*	console.log(email);
			console.log(noticeSelect);
			console.log(title);
		//	console.log(title);*/

			var form_data = new FormData();
			form_data.append('email', email);
			form_data.append('title', title);
			form_data.append('content', content);
			form_data.append('attachfile', attachfile);




			console.log(content);
			var url = "http://www.lincinsu.kr/index2.php/school/school/notice";		//ajax url
			if (noticeSelect == 3 ){
				url = "http://www.lincinsu.kr/index2.php/school/school/musagoNotice";
			}
			$.ajax({
				type: "POST",
				url: url,
				dataType : "text",
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				success: function(data){
					alert('데이터 전송 완료!');
					console.log('데이터 전송 완료');
				},
				error: function (request, error) {
			//		$('#msg').html(response); // display error response from the server
					alert("code:"+request.status+ "\n"+"message:"+request.responseText+"\n"+"error:"+error);
				}


			})
	}
}

function question12(){ //테스트
	//두가지 ajax를 수행해야하는 함수를 만들어야한다.
	//1. 현재 질문서의 전화번호(국번 또는 010을 제외한)에서 - 을 뺀 번호를 비밀번호로 Update
	//		필요한 값
	//			- 현재 질문서의 번호 num
	//			- 업데이트할 번호 passwd
	//		query문 : Update questionnaire set passwd = ? WHERE num = ?
	//2. 현재 질문서의 아이디값과 비밀번호에 대한 정보를 메일로 전달.question6() 에 이 함수 호출
	//
	var email = $('#school5').val();
	if(confirm("[" + email + "] 님의 비밀번호를 초기화하시겠습니까?")){
			var claimNum=$("#num").val();			//해당 질문서의 questionnaire 에 있는 num의 데이터
													//where절의 조건으로사용하기 위해서 사용

			var customerNum = $("#cNum").val();

			var ph = $("#school4").val();

			var pharray = ph.split('-');

			var passwd1 = pharray[1];
			var passwd2 = pharray[2];
			var passwdset = pharray[1] + pharray[2];
			// passwdset = '14361305';
		//	var passwdset = "23407529";
			console.log(ph);
			console.log(passwdset);
		/*	console.log("비밀번호 1 : " + passwd1);
			console.log("-----------------------");
			console.log("비밀번호 2 : " + passwd2);*/
		/*	console.log("-----------------------");
			console.log("최종 비밀번호 : " + passwdset);
			console.log("-----------------------");
			console.log("2014Costmer num : " + customerNum);
			console.log("-----------------------");
			console.log("questionnaire num :" + claimNum);*/
			var send_url = "/_db/_db_sql.php";

			$.ajax({
				type: "POST",
				url:send_url,
				dataType : "xml",
				data:{ proc:"mail3_",
					qnum:customerNum,				//2014Custmer의 num 값
					passwdset:passwdset			//변경될 비밀번호 값

				}
			}).done(function( xml ) {

				values = new Array();
				$(xml).find('values').each(function(){

					$(xml).find('item').each(function() {
						alert($(this).find('message').text());
					});
				});


			});


//			question6();
/*			var send_url = "/_db/_db_sql.php";
			$.ajax({
				type: "POST",
				url:send_url,
				dataType : "xml",
				data:{ proc:"mail2_",
					qnum:claimNum		//questionnarie의 num


				}
			}).done(function( xml ) {

				values = new Array();
				$(xml).find('values').each(function(){

					$(xml).find('item').each(function() {
						alert($(this).find('message').text());
					});
				});


			});*/
	}
}


function emailmodal(){
	$('#emailmodal').modal('show');
}

$("#emailContent").each(function(){
	this.contentEditable = true;
});



//카드 승인번호 입력
function cardapp(){
	if($("#mid").val()!=$("#cNum").val()){
		alert('id 설정이후 작업하세요');
		return false;

	}
	if($("#pmethod").val()!=3){
		alert('카드일때만 가능');
		return false;
	}
	var send_url = "/_db/_db_sql.php";
		$.ajax({
			type: "POST",
			url:send_url,
			dataType : "xml",
			data:{ proc:"cardap_",
				   num:$("#cNum").val(),
				   cardap:$("#cardap").val()
				 
				}
		}).done(function( xml ) {

			values = new Array();
			$(xml).find('values').each(function(){

				$(xml).find('item').each(function() {							
					  alert($(this).find('message').text());
				});	 
			});
				
			
		});


}
//결제방법
function pmethod(){
	if($("#mid").val()!=$("#cNum").val()){
		alert('id 설정이후 작업하세요');
		return false;

	}
		var send_url = "/_db/_db_sql.php";
				$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"pmethod_",
						   num:$("#cNum").val(),
						   pmethod:$("#pmethod").val()
						 
						}
				}).done(function( xml ) {

					values = new Array();
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {							
							  alert($(this).find('message').text());
						});	 
		            });
						
					
				});
	
}
function damdanga(){


	if($("#mid").val()!=$("#cNum").val()){
		alert('id 설정이후 작업하세요');
		return false;

	}
	if($("#damdanga").val().length>1){

			
			if(!$("#damdanga").val()){
				alert('담당자  !! ');

				$("#damdanga").focus();

				return false;

			}
			var send_url = "/_db/_db_sql.php";
				$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"damdanga_",
						   num:$("#cNum").val(),
						   damdanga:$("#damdanga").val()
						 
						}
				}).done(function( xml ) {

					values = new Array();
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {							
							  alert($(this).find('message').text());
						});	 
		            });
						
					
				});
		}

}

//카드번호
function card(){

	    if($("#mid").val()!=$("#cNum").val()){
			alert('id 설정이후 작업하세요');
			return false;

		}
		
		if($("#yymm").val().length>1){


			if(!$("#cardnum").val()){
				alert('카드번호  !! ');

				$("#cardnum").focus();

				return false;

			}
			var send_url = "/_db/_db_sql.php";
				$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"card_",
						   num:$("#cNum").val(),
						   cardnum:$("#cardnum").val(),
						   yymm:$("#yymm").val()
						}
				}).done(function( xml ) {

					values = new Array();
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {							
							  alert($(this).find('message').text());
						});	 
		            });
						
					
				});
		}
	}
//가상계좌 
function bank(){
	if($("#mid").val()!=$("#cNum").val()){
		alert('id 설정이후 작업하세요');
		return false;

	}
		if($("#bank").val().length>1){


			if(!$("#bankname").val()){
				alert('은행 명 !! ');

				$("#bankname").focus();

				return false;

			}
			var send_url = "/_db/_db_sql.php";
				$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"bank_",
						   num:$("#cNum").val(),
						   bankname:$("#bankname").val(),
						   bank:$("#bank").val()
						}
				}).done(function( xml ) {

					values = new Array();
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {							
							  alert($(this).find('message').text());
						});	 
		            });
						
					
				});
		}
	}
function certi(){ // 증권번호 입력과 동시에 영수일도 입력하고 증권번호 입력일과 영수일이 다른 경우는 별도로 영수일을 입력한다

		if($("#certi").val().length>1){
			var send_url = "/_db/_db_sql.php";
				$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"certi_",
						   num:$("#num").val(),
						   certi:$("#certi").val()
						}
				}).done(function( xml ) {

					values = new Array();
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {							
							  alert($(this).find('message').text());
							  $('#wdate_3').val($(this).find('wdate_3').text());
						});	 
		            });
						
					
				});
		}
}

function wdate_3(){ // 증권번호 입력과 동시에 영수일도 입력하고 증권번호 입력일과 영수일이 다른 경우는 별도로 영수일을 입력한다
		
		if($("#certi").val().length>1){
			var send_url = "/_db/_db_sql.php";
				$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"wdate_3_",
						   num:$("#num").val(),
						   wdate_3:$("#wdate_3").val()
						}
				}).done(function( xml ) {

					values = new Array();
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {							
							  alert($(this).find('message').text());
						});	 
		            });
						
					
				});
		}else{
			alert('증권번호 입력 후 영수일을 입력하세요 !!')

			$("#certi").focus();
			return false;
		}
}

//가계약 번호

function gabunho(){



	if($("#gabunho").val().length>1){
			var send_url = "/_db/_db_sql.php";
				$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"gabunho_",
						   num:$("#num").val(),
						   gabunho:$("#gabunho").val()
						}
				}).done(function( xml ) {

					values = new Array();
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {							
							  alert($(this).find('message').text());
						});	 
		            });
						
					
				});
		}

}

//인수심사 번호


function simbunho(){

	if($("#simbuho").val().length>1){
			var send_url = "/_db/_db_sql.php";
				$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"simbuho_",
						   num:$("#num").val(),
						   simbuho:$("#simbuho").val()
						}
				}).done(function( xml ) {

					values = new Array();
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {							
							  alert($(this).find('message').text());
						});	 
		            });
						
					
				});
		}

}
//자료보기
function fileis(){
		//alert($("#num").val());
		var num=$("#num").val()
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		//window.open('../pop_up/MemberEndorse.php?DaeriCompanyNum='+num+'&CertiTableNum='+certiNum+'&InsuraneCompany='+iNum+'&policyNum='+a9,'ppss','left='+winl+',top='+wint+',resizable=yes,width=640,height=600,scrollbars=no,status=yes')	
		window.open('/index2.php/rider_2/food/popup?num='+num,'ppss','left='+winl+',top='+wint+',resizable=yes,width=640,height=600,scrollbars=no,status=yes')	
}
// 한화손보 인 경우
function fileis2(num){
	
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/index2.php/school/school/popup?num='+num,'ppss','left='+winl+',top='+wint+',resizable=yes,width=640,height=600,scrollbars=no,status=yes')	
}

function clearfunction(){
		$("#num").val('');
		$("#school1").val('');
		$("#school2").val('');
		$("#school3").val('');
		$("#school4").val('');
		$("#school5").val('');
		

		//alert(businessValue[i].school6);
		
	/*	$('input:radio[name=season]:input[value=1]').attr("checked", false);
		$('input:radio[name=season]:input[value=2]').attr("checked", false);
		$('input:radio[name=season]:input[value=3]').attr("checked", false);
		$('input:radio[name=season]:input[value=4]').attr("checked", false);*/
		$("#school7").val('');
		$("#school8").val('');
		
	/*	$('input:radio[name=plan]:input[value=1]').attr("checked", false);
		$('input:radio[name=plan]:input[value=2]').attr("checked", false);*/
		
		$("#week4").val('');
		$("#week5").val('');
		$("#week6").val('');
		$("#week7").val('');
		$("#week8").val('');
		$("#week9").val('');
		$("#week10").val('');
		$("#week11").val('');
		$("#week12").val('');
		$("#week13").val('');
		$("#week14").val('');
		$("#week15").val('');
		$("#week16").val('');
		$("#week17").val('');
		$("#week18").val('');
		$("#week19").val('');
		$("#week20").val('');
		$("#week_total").html('');
		$('#directory').val('');
}

function damdangatel(){
		
		var dtel=$("#damdangat").val();

	      if(dtel.length==9){
				var first=dtel.substring(0,2);
				var second=dtel.substring(2,5);
				var third=dtel.substring(5,9);

				$("#damdangat").val(first+"-"+second+"-"+third);

				h_ajax();//담당자 핸드폰 저장

			}else if(dtel.length==10){
				var first=dtel.substring(0,3);
				var second=dtel.substring(3,6);
				var third=dtel.substring(6,10);

				$("#damdangat").val(first+"-"+second+"-"+third);

				h_ajax();//담당자 핸드폰 저장

			}else if(dtel.length==11){
				var first=dtel.substring(0,3);
				var second=dtel.substring(3,7);
				var third=dtel.substring(7,11);

				$("#damdangat").val(first+"-"+second+"-"+third);
				h_ajax();//담당자 핸드폰 저장

			}else{

				alert('하이푼 없이 10자리만 !!');
				return false;
				$("#damdangat").focus();
			}
		
}

function damdangatelC(){

	var dtel=$("#damdangat").val();
	if(dtel.length==11){
			var first=dtel.substring(0,2);
				var second=dtel.substring(3,6);
				var third=dtel.substring(7,11);

				$("#damdangat").val(first+second+third);

		}else if(dtel.length==12){
			var first=dtel.substring(0,3);
				var second=dtel.substring(4,7);
				var third=dtel.substring(8,12);

				$("#damdangat").val(first+second+third);

		}else if(dtel.length==13){
			var first=dtel.substring(0,3);
				var second=dtel.substring(4,8);
				var third=dtel.substring(9,13);

				$("#damdangat").val(first+second+third);

		}

}

function h_ajax(){//담당자 핸드폰 저장

	if($("#mid").val()!=$("#cNum").val()){
		alert('id 설정이후 작업하세요');
		return false;

	}
	if(!$("#damdangat").val()){
		alert('담당자 연락처  !! ');

		$("#damdangat").focus();

		return false;

	}
	var send_url = "/_db/_db_sql.php";
		$.ajax({
			type: "POST",
			url:send_url,
			dataType : "xml",
			data:{ proc:"dtel_",
				   num:$("#cNum").val(),
				   damdangat:$("#damdangat").val()
				 
				}
		}).done(function( xml ) {

			
			$(xml).find('values').each(function(){

				$(xml).find('item').each(function() {							
					  alert($(this).find('message').text());
				});	 
			});
				
			
		});

}

function board_search_enter(form) {
	var keycode = window.event.keyCode;
	if(keycode == 13) $("#search_btn").click();
}
function board_search_enter2(form) {
	var keycode = window.event.keyCode;
	if(keycode == 13) $("#serch2").click();
}
//삭제 

function perFormance(){
	
	var sigi='';
	var form_data = new FormData();
	if($('#month').val()>0){

		sigi=$('#year').val()+'-'+$('#month').val();
			form_data.append('sigi', sigi);

	}else{

		form_data.append('sigi','');

	}

			
		$.ajax({
			url: 'https:/index2.php/rider_2/linc/performance', // point to server-side controller method
			dataType: 'json', // what to expect back from the server
			cache: false,
			contentType: false,
			processData: false,
			data: form_data,
			type: 'post',
			success: function (data) {

					//alert(data+'/');
					member_data= new Array();
					$("#year_").children().remove();	
					$("#month_").children().remove();	
					$("#day_list").children().remove();	
					$.each(data, function(key, val){
							//alert(.val);
						member_data.push({
							"day_":val.key1,
							"yoil":val.key2,
							"day_sum":val.key3,
							"gunsu":val.key4,
							"start":val.key5,
							"total":val.key0,
							"tgunsu":val.key6,
						});
						
					});
					dataList(sigi); 
				//실행결과가 
					//alert(data);
					//$('#tour_preminum').val(data);
					
			
			},
			error: function (response) {
				$('#msg').html(response); // display error response from the server
			}
		});

}

function dataList(sigi){
	$("#changeP").children().remove();	

	$("#day__").html("일별실적");
	if(sigi){
		var sigi=sigi.split("-");		//alert(sigi[0]+'/'+sigi[1]+'/'+sigi[2]);
	}else{
		var sigi=[-1,-1];
	}
	var d=new Date();
	var y='';
	var jtr='';
	var k2='';
	jtr +="<select id='year' class='form-control' onChange='perFormance1()'>";
		jtr+="<option value='-1'>년도</option>";
		for(var k=0;k<10;k++){

			y=d.getFullYear()-k;
			jtr+="<option value="+y+">"+y+"</option>";
		}
    jtr +="</select>";
	$("#year_").append(jtr);
	var mtr='';
	mtr +="<select id='month' class='form-control'  onChange='perFormance1()'>";
		mtr+="<option value='-1'>월</option>";
		for(var k=1;k<13;k++){
			if(k<10){
				k2="0"+k;
			}else{
				k2=k;
			}
			mtr+="<option value="+k2+">"+k+"</option>";
		}
    mtr +="</select>";

	$("#month_").append(mtr);


	$('#year').val(sigi[0]);
	$('#month').val(sigi[1]);
	var k=member_data[0].start;

	var t_=member_data.length+k;
		
	//alert(t_);
	var str='';
	var j;
	var m=0;
	var n;
	var o=0;
	var rowlength='';
	str +="<table class='table table-bordered  siljek'  >";

	if(t_<33){
		rowlength=10;
	}else{
		rowlength=12;
	}
	
	for(var _i=0;_i<rowlength;_i++){

		/*if(m>29){

			member_data[m].day_='';
			member_data[m].yoil='';
			member_data[o].gunsu='';
			member_data[o].day_sum='';
		}*/
		j=_i+1;
		 str +=" <tr>";
		  n=_i%2;

		 

		 for(var _k=0;_k<7;_k++){
			if(n==0){
				
				//str +="<th>"+member_data[m].day_+"("+member_data[m].yoil+")"+"</th>";
				if(m==0){
					str +="<input type='hidden' id='s_sigi' >";  //최근 1개월 실적을 파악하기 위해 시지작일
					str +="<input type='hidden' id='e_sigi' >";
				}

				str +="<th>"+"<span id='date_"+m+"'"+"</th>";
			
				m++;
			}else{
				
				//str +="<td>"+member_data[o].day_sum+member_data[o].gunsu+"</td>";
				str +="<td>"+"<span id='gunsu"+o+"'"+"</td>";

				o++;
			}
		 }

			
		  str +="</tr>"

			

	}
	str +="  </table>";

	

	$("#day_list").append(str);
	
	for(var i=0;i<member_data.length;i++){
		
		if(member_data[i].day_sum==0){

			member_data[i].day_sum='';
			member_data[i].gunsu='';
		}else{
			member_data[i].gunsu="("+member_data[i].gunsu+")";

		}
	//	if(eval(member_data[i].start)==0 || eval(member_data[i].start)==6){

	//		$("#date_"+i).css("color","red");
	//	}
		$("#e_sigi").val(member_data[0].day_);
		$("#s_sigi").val(member_data[member_data.length-1].day_);
		//$("s_sigi").val((member_data.length-1).day);
		$("#date_"+k).html(member_data[i].day_+"("+member_data[i].yoil+")");
		$("#gunsu"+k).html(member_data[i].day_sum+member_data[i].gunsu);

		
		
		k++;
	}
		$("#date_"+k).html('합계');
		$("#gunsu"+k).html(member_data[member_data.length-1].total+"("+member_data[member_data.length-1].tgunsu+")");



	// 년도별 실적조회 화면 만들기 버튼 출력
	var ptr='';
	ptr+="<button type='button' class='btn btn-default' onClick='oneMonth()'> 최근1개월  실적</button>";
	ptr+="<button type='button' class='btn btn-default' onClick='yearPerFormance()'>월별 실적</button>";

	$("#changeP").append(ptr);
}	


//일별 실적조회//
//년도월별로 조회할 경우
function perFormance1(){
	var sigi='';
	var form_data = new FormData();
	if($('#month').val()>0){

		if($('#year').val() || $('#month').val()){


			if($('#year').val()<0){
				
				alert('년도를 설정하세요!');

				$('#year').focus();

				return false;

			}

			if($('#month').val()<0){
				
				alert('월을 설정하세요!');

				$('#month').focus();

				return false;

			}
			//sigi=$('#year').val()+'-'+$('#month').val()+'-'+'01';
			//form_data.append('sigi', sigi);
			perFormance();

		}
		
	}
	
}

//년실적조회

function yearPerFormance(){

	
	    $("#year_").children().remove();	
		$("#day__").html('');
		$("#year_").children().remove();	
		$("#month_").children().remove();	
		$("#day_list").children().remove();	
		$("#changeP").children().remove();	
		yearPerm();//일별실적조회

}

function yearPerm(){
	var sigi='';
	var form_data = new FormData();
/*	if($('#month').val()>0){

		sigi=$('#year').val()+'-'+$('#month').val();
			form_data.append('sigi', sigi);

	}else{

		form_data.append('sigi','');

	}*/
	form_data.append('sigi','');
	$.ajax({
			url: 'https:/index2.php/rider_2/linc/yearPerformance', // point to server-side controller method
			dataType: 'json', // what to expect back from the server
			cache: false,
			contentType: false,
			processData: false,
			data: form_data,
			type: 'post',
			success: function (data) {

					//alert(data+'/');
					member_data= new Array();
					$("#year_").children().remove();	
					$("#month_").children().remove();	
					$("#day_list").children().remove();	
					$.each(data, function(key, val){
							//alert(.val);
						member_data.push({
							"yyyymm":val.key0,
							"mpreminum":val.key1,
							"mgunsu":val.key2,
							
						});
						
					});
					dataYYList(sigi); 
				//실행결과가 
					//alert(data);
					//$('#tour_preminum').val(data);
					
			
			},
			error: function (response) {
				$('#msg').html(response); // display error response from the server
			}
		});

}

function dataYYList(sigi){


	var str='';

		//	alert(member_data[_i].yyyymm+'/'+member_data[_i].mpreminum);

	/*	for(var _i=0;_i<member_data.length;_i++){
			alert(member_data[_i].yyyymm+'/'+member_data[_i].mpreminum);
		}*/
   $("#day__").html("월별실적");
   
  
   str +="<table class='table table-bordered  siljek'  >";

	


	//for(var m=0;m

		var m=0;n=0;t=0;s=0;
	//alert(member_data.length);
	var cycle=Math.floor(member_data.length/2);

	//var yearTotal=[];
	var yearTotal='';
	var yearTotal1='';
	var yearGunsu='';
	var yearGunsu1='';
	
	//alert(cycle);
	for(var _i=0;_i<12;_i++){

	
		
		 str +=" <tr>";
		 for(var _k=0;_k<2;_k++){
			t=_k%2;
			if(t==0){
				m=s;

				yearTotal=parseInt(Number(yearTotal))+parseInt(Number(member_data[m].mpreminum));
				yearGunsu=parseInt(Number(yearGunsu))+parseInt(Number(member_data[m].mgunsu));
				
			}else{

				m=s+12;
				yearTotal1=parseInt(Number(yearTotal1))+parseInt(Number(member_data[m].mpreminum));
				yearGunsu1=parseInt(Number(yearGunsu1))+parseInt(Number(member_data[m].mgunsu));
			}
			//alert(m);
		
			
			str +="<th class='center_td'"
				    +"onMouseOver=\"style.backgroundColor='#cde2fd'; style.cursor='pointer';  self.status='';\""
					+ "onMouseOut =\"style.backgroundColor='';  self.status='';\""
					+ "onclick='qList("+_i+");'"
					+">"+member_data[m].yyyymm+"</th>";
			str +="<td >"+numberWithCommas(member_data[m].mpreminum)+"("+member_data[m].mgunsu+")"+"</td>";


			
			


		 }
		 s++;


		  str +="</tr>"

	}
	 str +=" <tr>";
	  
		str +="<th>"+"계"+"</th>";
		str +="<td>"+numberWithCommas(yearTotal)+"("+numberWithCommas(yearGunsu)+")"+"</td>";
		str +="<th>"+"계"+"</th>";
		str +="<td>"+numberWithCommas(yearTotal1)+"("+numberWithCommas(yearGunsu1)+")"+"</td>";


	    str +="</tr>"

	str +="  </table>";
	$("#day_list").append(str);

	var ptr='';
	   ptr+="<button type='button' class='btn btn-default' onClick='oneYear()'> 최근1년 실적</button>";
	   ptr+="<button type='button' class='btn btn-default' onClick='perFormance()'>일별 실적</button>";
	$("#changeP").append(ptr);

}

function qList(d1){ //실적리스트
	//alert(member_data[d1].yyyymm);

	var winl = (screen.width - 1024) / 2
	var wint = (screen.height - 768) / 2
		//window.open('../pop_up/MemberEndorse.php?DaeriCompanyNum='+num+'&CertiTableNum='+certiNum+'&InsuraneCompany='+iNum+'&policyNum='+a9,'ppss','left='+winl+',top='+wint+',resizable=yes,width=640,height=600,scrollbars=no,status=yes')	
	window.open('/_db/yymm.php?yymm='+member_data[d1].yyyymm,'yymm','left='+winl+',top='+wint+',resizable=yes,width=400,height=300,scrollbars=no,status=yes')	
}

function oneYear(){

	var winl = (screen.width - 1024) / 2
	var wint = (screen.height - 768) / 2
		//window.open('../pop_up/MemberEndorse.php?DaeriCompanyNum='+num+'&CertiTableNum='+certiNum+'&InsuraneCompany='+iNum+'&policyNum='+a9,'ppss','left='+winl+',top='+wint+',resizable=yes,width=640,height=600,scrollbars=no,status=yes')	
	window.open('/_db/oneyear.php?yymm=','yymm','left='+winl+',top='+wint+',resizable=yes,width=400,height=300,scrollbars=no,status=yes')
}

function oneMonth(){
	//alert(member_data.length);
	//alert($("#s_sigi").val()+'/'+$("#e_sigi").val());
	//return false;
	var bogosuForm = document.createElement("form");
    bogosuForm.name = "bogosuForm";
    // bogosuForm.target="bogosuForm";
    bogosuForm.method="POST";
    bogosuForm.action="/_db/onemonth.php";

    var s_sigiInput = document.createElement("input");
    s_sigiInput.type="text";
    s_sigiInput.name="start"
    s_sigiInput.value = $('#s_sigi').val();
    bogosuForm.appendChild(s_sigiInput);

    var s_sigi2Input = document.createElement("input");
    s_sigi2Input.type="text";
    s_sigi2Input.name="end";
    s_sigi2Input.value = $("#e_sigi").val();
    bogosuForm.appendChild(s_sigi2Input);

 /*  var accountInput = document.createElement("input");
    accountInput.type="text";
    accountInput.name="account";
    // accountInput.value = account;
    bogosuForm.appendChild(accountInput);*/

    document.body.appendChild(bogosuForm);

    bogosuForm.submit();
	document.body.removeChild(bogosuForm);

}

function id_pw_search(){
	console.log('test');
}