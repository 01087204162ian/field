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
			url: 'api/performance.php', // point to server-side controller method
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
			url: 'api/yearPerformance.php', // point to server-side controller method
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
	   //ptr+="<button type='button' class='btn btn-default' onClick='oneYear()'> 최근1년 실적</button>";
	   ptr+="<button id='downloadExcel' class='btn btn-default'>최근 1년 실적 다운로드</button>";
	   ptr+="<button type='button' class='btn btn-default' onClick='perFormance()'>일별 실적</button>";
	$("#changeP").append(ptr);

}

function qList(d1){ //실적리스트

	var bogosuForm = document.createElement("form");
    bogosuForm.name = "bogosuForm";
    // bogosuForm.target="bogosuForm";
    bogosuForm.method="POST";
    bogosuForm.action="api/yymm.php";

	var s_sigiInput = document.createElement("input");
    s_sigiInput.type="text";
    s_sigiInput.name="yymm"
    s_sigiInput.value = member_data[d1].yyyymm;
    bogosuForm.appendChild(s_sigiInput);


	document.body.appendChild(bogosuForm);

    bogosuForm.submit();
	document.body.removeChild(bogosuForm);
	//alert(member_data[d1].yyyymm);

	/*var winl = (screen.width - 1024) / 2
	var wint = (screen.height - 768) / 2
		//window.open('../pop_up/MemberEndorse.php?DaeriCompanyNum='+num+'&CertiTableNum='+certiNum+'&InsuraneCompany='+iNum+'&policyNum='+a9,'ppss','left='+winl+',top='+wint+',resizable=yes,width=640,height=600,scrollbars=no,status=yes')	
	window.open('/api/yymm.php?yymm='+member_data[d1].yyyymm,'yymm','left='+winl+',top='+wint+',resizable=yes,width=400,height=300,scrollbars=no,status=yes')	*/
}

document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'downloadExcel') {
        window.location.href = 'api/oneYearExcel.php?action=download';
    }
});

/*function oneYear(){

	var winl = (screen.width - 1024) / 2
	var wint = (screen.height - 768) / 2
		//window.open('../pop_up/MemberEndorse.php?DaeriCompanyNum='+num+'&CertiTableNum='+certiNum+'&InsuraneCompany='+iNum+'&policyNum='+a9,'ppss','left='+winl+',top='+wint+',resizable=yes,width=640,height=600,scrollbars=no,status=yes')	
	window.open('/api/oneyear.php?yymm=','yymm','left='+winl+',top='+wint+',resizable=yes,width=400,height=300,scrollbars=no,status=yes')
}*/

function oneMonth(){
	//alert(member_data.length);
	//alert($("#s_sigi").val()+'/'+$("#e_sigi").val());
	//return false;
	var bogosuForm = document.createElement("form");
    bogosuForm.name = "bogosuForm";
    // bogosuForm.target="bogosuForm";
    bogosuForm.method="POST";
    bogosuForm.action="api/onemonth.php";

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