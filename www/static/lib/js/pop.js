$(document).ready(function(){

	//새창 만들기 위해 

	//코드이그나이터 이용하지 않고 아이디 등록
	/*$("#idbutton").click(function(){

	alert($("#register").val())
		 //alert($("#id_").val());
		if($("#register").val()==1){
		  var act ='/index2.php/rider_2/food/idmake';
		  //$("#serch_f").attr('method',post);
		  $("#serch_f").attr('action',act).submit();
		}
		
	});*/

	$("#id_").focus(function(){

		$("#id_").val('');
		$("#help-block").html('');
		$("#register").val('');
	});
	//아이디 조회 
	$("#id_").blur(function(){
		var send_url = "/_db/_db_sql.php";

		//alert($("#id_").val().length);
		if($("#id_").val().length>3){
			$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"id_serch",
							 id:$("#id_").val()
							
						}
				}).done(function( xml ) {
					
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {
													
							if($(this).find('register').text()==2){
								$("#help-block").css("color","red");
								$("#idbutton").val('비번변경');
							}
							$("#help-block").html($(this).find('message').text());
							$("#register").val($(this).find('register').text());

						});	 
					});
						
					
				});
		}else if($("#id_").val().length>1 && $("#id_").val().length<=3){

			alert('아이디는 4자리 이상 입니다');
			    $("#id_").focus();

				return false;

		}
		
	});


	$("#password").blur(function(){
		if($("#register").val()==1 || $("#register").val()==2){
			if($("#password").val().length>1 && $("#password").val().length<8){
				alert('비밀번호는 8자리 , 업체 담당자 전화번호 8자리를 추천합니다!!');
				$("#password").focus();
				return false;
			}else if($("#password").val().length>8){
				alert('비밀번호는 8자리 , 업체 담당자 전화번호 8자리를 추천합니다!!');
				$("#password").focus();
				return false;

			}
		}
	});
	//
	$("#idbutton").click(function(){
			
			if($("#register").val() && $("#id_").val() ){

				if($("#password").val().length==8){
					var send_url = "/_db/_db_sql.php";
					//////////DB에 저장하기 위해
					$.ajax({
					type: "POST",
					url:send_url,
					dataType : "xml",
					data:{ proc:"id_store",
							 id:$("#id_").val(),
							 pass:$("#password").val()
							
						}
				}).done(function( xml ) {
					
					$(xml).find('values').each(function(){

						$(xml).find('item').each(function() {
													
							alert($(this).find('message').text());
							$("#id_").val('');
							$("#help-block").html('');
							$("#register").val('');
							$("#password").val('');
							$("#idbutton").val('등록');

						});	 
					});
						
					
				});

				  //////////DB에 저장하기 위해
				}else{

					alert('비밀번호는 8자리 , 업체 담당자 전화번호 8자리를 추천합니다!!');
					 $("#password").focus();

						return false;


				}

				

			}else{

				alert('아이디가 없습니다');
			    $("#id_").focus();

				return false;


			}

	});

});



function delete_(num){

	//alert(num+'/'+ $('#num').val());

}
	

	

	

	


	
	

