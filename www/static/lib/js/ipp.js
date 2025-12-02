$(document).ready(function(){

	//새창 만들기 위해 

	// 아이디 

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

	
	//학교명을 동일한게 있는지 차자아 보기

	$('#school1').blur(function(){
		if($('#school1').val().length>1){ //길이가 1보다 클때
			//학교명으로 조회 하기 위해 

				var send_url = "/_db/_ipp_sql.php";
				$.ajax({
						type: "POST",
						url:send_url,
						dataType : "xml",
						data:{ proc:"schoolName",
							  school1:$('#school1').val()
							   
							}
					}).done(function( xml ) {

						values = new Array();
						$(xml).find('values').each(function(){
							businessValue = new Array();
							$(xml).find('item').each(function() {
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
												} );

											 maxT =	businessValue.length;

											
											continue_1();

							});	 
						});
				
				
				});


		}

	});

	//이미지 파일을 저장하기 위해 


	$("#istore").click(function(){
		//editor=CKEDITOR.replace( '_description');
		var value = editor.getData();
		
		//alert($('#qnum').val()+'/'+value+'/'+$("#kind").val()+'/'+$("#title2").val());

		var send_url = "/_db/_ipp_sql.php";
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
		   var send_url = "/_db/_ipp_sql.php";
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
						alert($(this).find('message').text());
					});	 
				});	
			});
		}
	});
	//처리 상황을 변경하기 위해
	$(".sj").change(function(){

		
		var send_url = "/_db/_ipp_sql.php";
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
						alert($(this).find('message').text());
					});	 
				});	
			});
			
	});
	//진행 상황 체크 

	$("#chchange").change(function(){
		var act ='/index2.php/rider_2/food/ippcenter/1/3';
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

		  var act ='/index2.php/rider_2/food/ippcenter/1/2';
		  //$("#serch_f").attr('method',post);
		  $("#serch_f").attr('action',act).submit();
		}
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
	
		if(!$("#school1").val()){

			alert("학교명을 입력하셔요");
			$("#school1").focus();
			return false;
		}

		

		var school1=$("#school1").val();   //학교명
		var school2=$("#school2").val();   //부서
		var school3=$("#school3").val();   //주소
		var school4=$("#school4").val();   //연락처
		var school5=$("#school5").val();   //이메일
		var school6=$("#school6").val();   //우편번호
		var school7=$("#school7").val();   //담당자
		var school8=$("#school8").val();   //약속
		var school9=$("#school9").val();;  //메모
		

		
		// 저장하기 위해 

		//배서일때는  num 값을 제외하여 
		//배서를 저장하고 
		//그이후에 endorse를 값을 제거하여 

		

		// 수정이 될 수 있도록 하기 위해
		var send_url = "/_db/_ipp_sql.php";
			$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"write_",
						   num:$("#num").val(),
						   
						   school1:school1,
						   school2:school2,
						   school3:school3,
						   school4:school4,
						   school5:school5,
						   school6:school6,
						   school7:school7,
						   school8:school8,
						   school9:school9
						   
						}
				}).done(function( xml ) {

					
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {
							
							  $("#num").val($(this).find('num').text());
							  $("#write_").val("수정");
							  alert($(this).find('message').text() );

						});	 
		            });
						
					
				});

	});
	

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
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
	var send_url = "/_db/_ipp_sql.php";
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
										
										
									} );

								 maxT =	businessValue.length;

								
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

		

	 if(businessValue[i].num){

		
		$("#num").val(businessValue[i].num);
		$("#school1").val(businessValue[i].school1);
		$("#school2").val(businessValue[i].school2);
		$("#school3").val(businessValue[i].school3);
		$("#school4").val(businessValue[i].school4);
		$("#school5").val(businessValue[i].school5);
		$("#school6").val(businessValue[i].school6);
		$("#school7").val(businessValue[i].school7);
		$("#school8").val(businessValue[i].school8);
		$("#school9").val(businessValue[i].school9);
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
			
			str +="<blockquote>";
			 str +="<p>IPP Center. </p>";
			 str +="<footer>.... </footer>";
			str +="</blockquote>";
			/**/

			$("#mr").append(str);   
			$("#write_").val("수정");
			
			
		}else{
			

		    alert('신규 질문서 작성하셔요');
			str +="<blockquote>";
			 str +="<p>IPP Center. </p>";
			 str +="<footer>.... </footer>";
			str +="</blockquote>";
			/**/

			$("#mr").append(str);   
			$("#write_").val("저장"); 
		}
		
	
		
		
	}

		


}
//id 조회하기 위해




//id 설정
//
function serchGet2(){ // 

		// 선택한 아이디가 사용중인 학교를 표시하고 그다음에 설정하도록 하자

		var send_url = "/_db/_ipp_sql.php";
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

	
	//alert($("#mid").val()+'/'+ $("#num").val());
}


function id_setting(){
	var send_url = "/_db/_ipp_sql.php";
		$.ajax({
				type: "POST",
				url:send_url,
				dataType : "xml",
				data:{ proc:"id_setting",
					   idnum:$("#mid").val(),
					   qnum:$("#num").val()
					   
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


	  
	  var send_url = "/_db/_ipp_sql.php";
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
		var send_url = "/_db/_ipp_sql.php";
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
function question4(){
		
		
		var claimNum=$("#num").val();
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/2014/_pages/php/downExcel/claim5.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	

}

function question5(){ //공문
		
		
		var claimNum=$("#num").val();
		var winl = (screen.width - 1024) / 2
		var wint = (screen.height - 768) / 2
		
		window.open('/2014/_pages/php/downExcel/claim6.php?claimNum='+claimNum,'claimPdf','left='+winl+',top='+wint+',resizable=yes,width=900,height=570,scrollbars=yes,status=yes');	

}
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
	var send_url = "/_db/_ipp_sql.php";
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
		var send_url = "/_db/_ipp_sql.php";
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
			var send_url = "/_db/_ipp_sql.php";
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
			var send_url = "/_db/_ipp_sql.php";
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
			var send_url = "/_db/_ipp_sql.php";
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
function certi(){

		if($("#certi").val().length>1){
			var send_url = "/_db/_ipp_sql.php";
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
						});	 
		            });
						
					
				});
		}
}

//가계약 번호

function gabunho(){



	if($("#gabunho").val().length>1){
			var send_url = "/_db/_ipp_sql.php";
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
			var send_url = "/_db/_ipp_sql.php";
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


function clearfunction(){
		$("#num").val('');
		$("#school1").val('');
		$("#school2").val('');
		$("#school3").val('');
		$("#school4").val('');
		$("#school5").val('');
		$("#school6").val('');
		$("#school7").val('');
		$("#school8").val('');
		$("#school9").val('');
		

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
	var send_url = "/_db/_ipp_sql.php";
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


