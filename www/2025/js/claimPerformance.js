//월별 실적//

function perFormance(){
	   // 연도 선택 드롭다운 동적 생성 (최근 5년)
		showSelectedYear();
		// 페이지 로딩 시 자동 실행 서버데이터 가져오기 
        fetchData();
		updateButtons(); // 버튼 정의 

}

// 연도 표현 함수

	function showSelectedYear(){

		   $("#yearContainer").children().remove();
		    const currentYear = new Date().getFullYear();
			const yearContainer = document.getElementById("yearContainer");
			

			// <select> 요소 동적 생성
			const yearSelect = document.createElement("select");
			yearSelect.id = "yearSelect";
			yearSelect.onchange = function() {
				fetchData(); // 데이터 로드 함수 호출
				
			};

			// 연도 옵션 추가 (최근 5년)
			for (let i = currentYear; i >= currentYear - 4; i--) {
				let option = document.createElement("option");
				option.value = i;
				option.textContent = i + "년"; // "2025년" 형식으로 표시
				 yearSelect.appendChild(option);
			}

			

			// 생성한 <select> 요소를 #yearContainer 안에 추가
			yearContainer.appendChild(yearSelect);

	}


	// 서버에서 연도별 데이터를 가져오기
        function fetchData() {
				
            let selectedYear = document.getElementById("yearSelect").value;
            fetch(`api/claim/get_claim_summary.php?year=${selectedYear}`)
                .then(response => response.json())
                .then(data => updateTable(data))
                .catch(error => console.error("데이터 로드 오류:", error));
        }

        function updateTable(jsonData) {
				let claimData = {};
				
				// 12개월 기본 구조 생성
				for (let i = 1; i <= 12; i++) {
					let month = `${yearSelect.value}-${String(i).padStart(2, '0')}`;
					claimData[month] = { 
						received: 0, pending: 0, completed: 0, exempted: 0, canceled: 0, 
						total: 0, claimAmount: 0, totalPremium: 0, lossRatio: 0 
					};
				}

				// "claims" 데이터 처리
				jsonData.claims.forEach(item => {
					let month = item.yearMonth;
					if (!claimData[month]) return;

					switch (parseInt(item.ch)) {
						case 1: claimData[month].received += parseInt(item.count); break;
						case 2: claimData[month].pending += parseInt(item.count); break;
						case 3:
							claimData[month].completed += parseInt(item.count);
							claimData[month].claimAmount += parseInt(item.total_claim_amount || 0); // 종결된 보험금 합산
							break;
						case 4: claimData[month].exempted += parseInt(item.count); break;
						case 5: claimData[month].canceled += parseInt(item.count); break;
					}
					claimData[month].total += parseInt(item.count);
				});

				// "premiums" 데이터 처리 (보험료 합산)
				jsonData.premiums.forEach(item => {
					let month = item.yearMonth;
					if (!claimData[month]) return;
					claimData[month].totalPremium += parseInt(item.total_premium || 0);
				});

				// 손해율 계산 (보험금 / 보험료 * 100)
				Object.keys(claimData).forEach(month => {
					let row = claimData[month];
					row.lossRatio = row.totalPremium > 0 ? ((row.claimAmount / row.totalPremium) * 100).toFixed(2) : "0.00";
				});

				// 테이블 업데이트
				let tbody = document.querySelector("#claimTable tbody");
				tbody.innerHTML = "";
				let totalReceived = 0, totalPending = 0, totalCompleted = 0, totalExempted = 0, 
					totalCanceled = 0, totalAll = 0, totalClaimAmount = 0, totalPremiumAmount = 0, totalLossRatio = 0;

				Object.keys(claimData).forEach(month => {
					let row = claimData[month];

					tbody.innerHTML += `
						<tr>
							<td>${month}</td>
							<td class='right-align'>${row.received}</td>
							<td class='right-align'>${row.pending}</td>
							<td class='right-align'>${row.completed}</td>
							<td class='right-align'>${row.exempted}</td>
							<td class='right-align'>${row.canceled}</td>
							<td class='right-align'>${row.total}</td>
							<td class='right-align'>${row.claimAmount.toLocaleString()}</td> <!-- 종결된 보험금 -->
							<td class='right-align'>${row.totalPremium.toLocaleString()}</td> <!-- 보험료 -->
							<td class='right-align'>${row.lossRatio}%</td> <!-- 손해율 -->
						</tr>
					`;

					totalReceived += row.received;
					totalPending += row.pending;
					totalCompleted += row.completed;
					totalExempted += row.exempted;
					totalCanceled += row.canceled;
					totalAll += row.total;
					totalClaimAmount += row.claimAmount;
					totalPremiumAmount += row.totalPremium;
				});

				// 전체 손해율 계산 (총 보험금 / 총 보험료 * 100)
				totalLossRatio = totalPremiumAmount > 0 ? ((totalClaimAmount / totalPremiumAmount) * 100).toFixed(2) : "0.00";

				// 소계 업데이트
				document.getElementById("totalReceived").textContent = totalReceived;
				document.getElementById("totalPending").textContent = totalPending;
				document.getElementById("totalCompleted").textContent = totalCompleted;
				document.getElementById("totalExempted").textContent = totalExempted;
				document.getElementById("totalCanceled").textContent = totalCanceled;
				document.getElementById("totalAll").textContent = totalAll;
				document.getElementById("totalClaimAmount").textContent = totalClaimAmount.toLocaleString();
				document.getElementById("totalPremiumAmount").textContent = totalPremiumAmount.toLocaleString();
				document.getElementById("totalLossRatio").textContent = totalLossRatio + "%"; // 손해율 표시
}

function updateButtons() {
	$("#changeP").children().remove();
	$("#sjTitle").html(''); // 
	let str ='';
	    str +="월별 실적";

	$("#sjTitle").append(str);
    $("#changeP").children().remove(); // 기존 버튼 제거

    var ptr = '';
    ptr += "<button type='button' class='btn btn-default' onClick='ContractorPerformance()'>계약자별 실적</button>";
    ptr += "<button type='button' class='btn btn-default' onClick='yearPerFormance()'>년도별 실적</button>";

    $("#changeP").append(ptr); // 새로운 버튼 추가
}
//년별 실적 //
function yearPerFormance(){
	showSelectedYear2()
	updateButtonsYear();  
	
	TableInit(); //소계부분 초기 
	fetchYearlyData();
}

function showSelectedYear2(){

	   $("#yearContainer").children().remove();
		const currentYear = new Date().getFullYear();
		const yearContainer = document.getElementById("yearContainer");
		

		// <select> 요소 동적 생성
		const yearSelect = document.createElement("select");
		yearSelect.id = "yearSelect";
		yearSelect.onchange = function() {
			fetchYearlyData(); // 데이터 로드 함수 호출
			
		};

		// 연도 옵션 추가 (최근 5년)
		for (let i = currentYear; i >= currentYear - 4; i--) {
			let option = document.createElement("option");
			option.value = i;
			option.textContent = i + "년"; // "2025년" 형식으로 표시
			 yearSelect.appendChild(option);
		}

		

		// 생성한 <select> 요소를 #yearContainer 안에 추가
		yearContainer.appendChild(yearSelect);

	}
function updateButtonsYear() {

	$("#changeP").children().remove();
	$("#sjTitle").html(''); // 
	let str ='';
	    str +="년도별 실적";

	$("#sjTitle").append(str);
    $("#changeP").children().remove(); // 기존 버튼 제거

    var ptr = '';
    ptr += "<button type='button' class='btn btn-default' onClick='ContractorPerformance()'>계약자별 실적</button>";
    ptr += "<button type='button' class='btn btn-default' onClick='perFormance()'>월별 실적</button>";

    $("#changeP").append(ptr); // 새로운 버튼 추가
}
function TableInit(){
	let tbody = document.querySelector("#claimTable tbody");
	tbody.innerHTML = "";
	document.getElementById("totalReceived").textContent = "";
	document.getElementById("totalPending").textContent = "";
	document.getElementById("totalCompleted").textContent = "";
	document.getElementById("totalExempted").textContent = "";
	document.getElementById("totalCanceled").textContent = "";
	document.getElementById("totalAll").textContent = "";;
	document.getElementById("totalClaimAmount").textContent = "";
	document.getElementById("totalPremiumAmount").textContent = "";;
	document.getElementById("totalLossRatio").textContent ="";; // 손해율 표시
}
function fetchYearlyData() {
    let selectedYear = document.getElementById("yearSelect").value; // 선택된 연도 가져오기

    fetch(`api/claim/get_yearly_summary.php?year=${selectedYear}`)
        .then(response => response.json())
        .then(data => updateYearlyTable(data))
        .catch(error => console.error("데이터 로드 오류:", error));

}

function updateYearlyTable(jsonData) {
    let yearData = {};
    let startYear = parseInt(document.getElementById("yearSelect").value) - 9; // 최근 10년

    // 소계 변수 초기화
    let totalReceived = 0, totalPending = 0, totalCompleted = 0, totalExempted = 0, totalCanceled = 0;
    let totalClaimAmount = 0, totalPremiumAmount = 0, totalLossRatio = 0, yearCount = 0;

    // 최근 10년 초기화
    for (let i = startYear; i <= parseInt(document.getElementById("yearSelect").value); i++) {
        yearData[i] = { 
            received: 0, pending: 0, completed: 0, exempted: 0, canceled: 0, 
            claimAmount: 0, totalPremium: 0, lossRatio: 0 
        };
    }

    // "claims" 데이터 처리
    jsonData.claims.forEach(item => {

		console.log(item.claimYear);
        let year = item.claimYear;
        if (!yearData[year]) return;

        switch (parseInt(item.ch)) {
            case 1: yearData[year].received += parseInt(item.count); break;
            case 2: yearData[year].pending += parseInt(item.count); break;
            case 3:
                yearData[year].completed += parseInt(item.count);
                yearData[year].claimAmount += parseInt(item.total_claim_amount || 0);
                break;
            case 4: yearData[year].exempted += parseInt(item.count); break;
            case 5: yearData[year].canceled += parseInt(item.count); break;
        }
    });

    // "premiums" 데이터 처리
    jsonData.premiums.forEach(item => {
        let year = item.premiumYear;
        if (!yearData[year]) return;
        yearData[year].totalPremium += parseInt(item.total_premium || 0);
    });

    // 손해율 계산 (보험금 / 보험료 * 100)
    Object.keys(yearData).forEach(year => {
        let row = yearData[year];
        row.lossRatio = row.totalPremium > 0 ? ((row.claimAmount / row.totalPremium) * 100).toFixed(2) : "0.00";

        // 소계 계산
        totalReceived += row.received;
        totalPending += row.pending;
        totalCompleted += row.completed;
        totalExempted += row.exempted;
        totalCanceled += row.canceled;
        totalClaimAmount += row.claimAmount;
        totalPremiumAmount += row.totalPremium;
        yearCount++;
    });

    // 전체 손해율 계산 (총 보험금 / 총 보험료 * 100)
    totalLossRatio = totalPremiumAmount > 0 ? ((totalClaimAmount / totalPremiumAmount) * 100).toFixed(2) : "0.00";
    let totalAll = totalReceived + totalPending + totalCompleted + totalExempted + totalCanceled; // 총합

    // 테이블 업데이트
    let tbody = document.querySelector("#claimTable tbody");
    tbody.innerHTML = "";

    Object.keys(yearData).forEach(year => {
        let row = yearData[year];

        tbody.innerHTML += `
            <tr>
                <td>${year}</td>
                <td class='right-align'>${row.received}</td>
                <td class='right-align'>${row.pending}</td>
                <td class='right-align'>${row.completed}</td>
                <td class='right-align'>${row.exempted}</td>
                <td class='right-align'>${row.canceled}</td>
                <td class='right-align'>${row.received + row.pending + row.completed + row.exempted + row.canceled}</td>
                <td class='right-align'>${row.claimAmount.toLocaleString()}</td>
                <td class='right-align'>${row.totalPremium.toLocaleString()}</td>
                <td class='right-align'>${row.lossRatio}%</td>
            </tr>
        `;
    });

    // 소계 추가
   

    // 합계 업데이트
    document.getElementById("totalReceived").textContent = totalReceived;
    document.getElementById("totalPending").textContent = totalPending;
    document.getElementById("totalCompleted").textContent = totalCompleted;
    document.getElementById("totalExempted").textContent = totalExempted;
    document.getElementById("totalCanceled").textContent = totalCanceled;
    document.getElementById("totalAll").textContent = totalAll;
    document.getElementById("totalClaimAmount").textContent = totalClaimAmount.toLocaleString();
    document.getElementById("totalPremiumAmount").textContent = totalPremiumAmount.toLocaleString();
    document.getElementById("totalLossRatio").textContent = totalLossRatio + "%"; // 손해율 표시
}


//계약자별 실적

function ContractorPerformance(){
	
	showSelectedYear3()
	contractorButtonsYear();  
	
	TableInit(); //소계부분 초기 
	fetchContractorData();
}

function showSelectedYear3() {

	 $("#yearContainer").children().remove();
		const currentYear = new Date().getFullYear();
		const yearContainer = document.getElementById("yearContainer");
		

		// <select> 요소 동적 생성
		const yearSelect = document.createElement("select");
		yearSelect.id = "yearSelect";
		yearSelect.onchange = function() {
			fetchContractorData(); // 데이터 로드 함수 호출
			
		};

		// 연도 옵션 추가 (최근 5년)
		for (let i = currentYear; i >= currentYear - 4; i--) {
			let option = document.createElement("option");
			option.value = i;
			option.textContent = i + "년"; // "2025년" 형식으로 표시
			 yearSelect.appendChild(option);
		}

		

		// 생성한 <select> 요소를 #yearContainer 안에 추가
		yearContainer.appendChild(yearSelect);
}

function contractorButtonsYear() {

	$("#changeP").children().remove();
	$("#sjTitle").html(''); // 
	let str ='';
	    str +="계약자별 실적";

	$("#sjTitle").append(str);
    $("#changeP").children().remove(); // 기존 버튼 제거

    var ptr = '';
    ptr += "<button type='button' class='btn btn-default' onClick='yearPerFormance()'>년도별실적</button>";
    ptr += "<button type='button' class='btn btn-default' onClick='perFormance()'>월별 실적</button>";

    $("#changeP").append(ptr); // 새로운 버튼 추가
}
function fetchContractorData() {
    let selectedYear = document.getElementById("yearSelect").value; // 선택된 연도 가져오기

    
	fetch(`api/claim/get_contractor_summary.php?year=${selectedYear}`)
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data)) {
            console.warn("🚨 서버 응답이 배열이 아닙니다. 빈 배열을 사용합니다.");
            data = []; // 배열이 아닌 경우 빈 배열로 설정
        }
        updateContractorPerformance(data);
    })
    .catch(error => {
        console.error("🚨 데이터 로드 오류:", error);
        updateContractorPerformance([]); // 오류 발생 시 빈 배열로 초기화
    });
}

function updateContractorPerformance(jsonData) {
    if (!Array.isArray(jsonData)) {
        console.warn("🚨 서버 응답이 배열이 아닙니다. 빈 배열을 사용합니다.");
        jsonData = []; // 배열이 아닌 경우 빈 배열로 설정
    }

    let tableBody = document.getElementById("claimTable").querySelector("tbody");
    tableBody.innerHTML = "";

    // 소계 변수 초기화
    let totalReceived = 0, totalPending = 0, totalCompleted = 0, totalExempted = 0, totalCanceled = 0;
    let totalClaimAmount = 0, totalPremiumAmount = 0, totalLossRatio = 0;

    jsonData.forEach(item => {
        let schoolName = item.school1 && item.school1.trim() !== "" ? item.school1 : "N/A"; // 빈 값 처리
        let received = parseInt(item.received) || 0;
        let pending = parseInt(item.pending) || 0;
        let completed = parseInt(item.completed) || 0;
        let exempted = parseInt(item.exempted) || 0;
        let canceled = parseInt(item.canceled) || 0;
        let totalClaimAmountValue = parseInt(item.total_claim_amount) || 0;
        let totalPremiumValue = parseInt(item.total_premium) || 0;
        let totalCases = received + pending + completed + exempted + canceled; // 총 건수 계산

        // 손해율 계산 (보험금 / 보험료 * 100)
        let lossRatio = totalPremiumValue > 0 ? ((totalClaimAmountValue / totalPremiumValue) * 100).toFixed(2) + "%" : "0.00%";

        // 소계 누적
        totalReceived += received;
        totalPending += pending;
        totalCompleted += completed;
        totalExempted += exempted;
        totalCanceled += canceled;
        totalClaimAmount += totalClaimAmountValue;
        totalPremiumAmount += totalPremiumValue;

        let row = `
            <tr>
                <td class='right-align'>${schoolName}</td>
                <td class='right-align'>${received}</td>
                <td class='right-align'>${pending}</td>
                <td class='right-align'>${completed}</td>
                <td class='right-align'>${exempted}</td>
                <td class='right-align'>${canceled}</td>
                <td class='right-align'>${totalCases}</td>
                <td class='right-align'>${totalClaimAmountValue.toLocaleString()}</td>
                <td class='right-align'>${totalPremiumValue.toLocaleString()}</td>
                <td class='right-align'>${lossRatio}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // 전체 손해율 계산
    totalLossRatio = totalPremiumAmount > 0 ? ((totalClaimAmount / totalPremiumAmount) * 100).toFixed(2) + "%" : "0.00%";
    let totalAll = totalReceived + totalPending + totalCompleted + totalExempted + totalCanceled; // 전체 총합

   

    // 합계 업데이트
    document.getElementById("totalReceived").textContent = totalReceived;
    document.getElementById("totalPending").textContent = totalPending;
    document.getElementById("totalCompleted").textContent = totalCompleted;
    document.getElementById("totalExempted").textContent = totalExempted;
    document.getElementById("totalCanceled").textContent = totalCanceled;
    document.getElementById("totalAll").textContent = totalAll;
    document.getElementById("totalClaimAmount").textContent = totalClaimAmount.toLocaleString();
    document.getElementById("totalPremiumAmount").textContent = totalPremiumAmount.toLocaleString();
    document.getElementById("totalLossRatio").textContent = totalLossRatio; // 손해율 추가
}







        

