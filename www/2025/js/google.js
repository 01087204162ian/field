const URL = "https://script.google.com/macros/s/AKfycbxHrnV1-n0ttkpvSVMoiMjAZ7yttgMu3Hj2vWhvYu52TGdhjd3R4P4koA6vEoONPLKeyw/exec";
const ROWS_PER_PAGE = 10; // 페이지당 표시할 행 수
let currentPage = 1; // 현재 페이지
let allData = []; // 전체 데이터 저장

const loaderContainer = document.getElementById("loader-container");

// 로딩바 표시
function showLoader() {
    loaderContainer.style.display = "flex";
}

// 로딩바 숨기기
function hideLoader() {
    loaderContainer.style.display = "none";
}

// 사고일자 변환
function mergeAccidentDate(row, yearIndex, monthIndex, dayIndex) {
    const year = row[yearIndex];
    const month = row[monthIndex];
    const day = row[dayIndex];

    if (year && month && day) {
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
    return ""; // 빈 값 처리
}

// 접수일자 병합
function mergeReceptionDate(row, yearIndex, monthIndex, dayIndex) {
    const year = row[yearIndex];
    const month = row[monthIndex];
    const day = row[dayIndex];

    if (year && month && day) {
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
    return ""; // 빈 값 처리
}

// ISO 날짜를 "YYYY-MM-DD" 형식으로 변환
function formatDate(isoDate) {
    if (!isoDate || typeof isoDate !== "string") return isoDate; // 유효하지 않은 데이터는 그대로 반환
    const date = new Date(isoDate);
    if (isNaN(date)) return isoDate; // 변환 실패 시 원래 값을 반환
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD" 형식으로 변환
}

// 데이터 로드 및 페이지네이션 적용
showLoader();
fetch(URL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.length === 0) {
            throw new Error("스프레드시트에 데이터가 없습니다.");
        }

        // 첫 번째 행(헤더) 확인 및 "사고일자" 및 "접수일자" 추가
        const headerRow = data[0];
        const accidentYearIndex = headerRow.indexOf("사고년");
        const accidentMonthIndex = headerRow.indexOf("사고월");
        const accidentDayIndex = headerRow.indexOf("사고일");

        const receptionDateIndex = headerRow.indexOf("접수일자");

        if (accidentYearIndex >= 0 && accidentMonthIndex >= 0 && accidentDayIndex >= 0) {
            headerRow.splice(accidentYearIndex, 3, "사고일자"); // 기존 컬럼 제거 및 새 컬럼 추가
        }

        const tableHead = document.querySelector("#data-table thead");
        const theadRow = document.createElement("tr");
        headerRow.forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            theadRow.appendChild(th);
        });
        tableHead.appendChild(theadRow);

        // 나머지 데이터: 빈 행 제거 + 사고일자 병합 + 접수일자 변환 + 역순 정렬
        allData = data.slice(1)
            .filter(row => row.some(cell => cell !== "")) // 빈 행 제거
            .map(row => {
                if (accidentYearIndex >= 0 && accidentMonthIndex >= 0 && accidentDayIndex >= 0) {
                    const accidentDate = mergeAccidentDate(row, accidentYearIndex, accidentMonthIndex, accidentDayIndex);
                    row.splice(accidentYearIndex, 3, accidentDate); // 기존 컬럼 제거 및 새 값 추가
                }

                if (receptionDateIndex >= 0) {
                    row[receptionDateIndex] = formatDate(row[receptionDateIndex]); // 접수일자 변환
                }

                return row;
            })
            .reverse(); // 역순 정렬

        displayPage(1); // 첫 페이지 표시
    })
    .catch(err => {
        console.error(err);
        document.getElementById("error-message").textContent = "데이터를 불러오는 데 문제가 발생했습니다.";
    })
    .finally(() => {
        hideLoader(); // 로딩바 숨기기
    });

// 페이지 표시
/*
function displayPage(page) {
    currentPage = page; // 현재 페이지 업데이트
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = ""; // 기존 데이터 초기화

    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    const pageData = allData.slice(start, end);

    pageData.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell || ""; // 빈 셀 처리
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    updatePagination(page);
}*/
function displayPage(page) {
    currentPage = page; // 현재 페이지 업데이트
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = ""; // 기존 데이터 초기화

    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    const pageData = allData.slice(start, end);

    pageData.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
            const td = document.createElement("td");
            td.textContent = cell || ""; // 빈 셀 처리
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    // 순번 클릭 이벤트 추가
    addRowClickEvents(tableBody, pageData);
}


// 페이지네이션 버튼 업데이트
function updatePagination(page) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // 기존 버튼 초기화

    const totalPages = Math.ceil(allData.length / ROWS_PER_PAGE);
    const pagesToShow = 5; // 한 번에 표시할 페이지 번호 수
    const startPage = Math.floor((page - 1) / pagesToShow) * pagesToShow + 1;
    const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

    // 페이지 번호 버튼 생성
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.disabled = i === page; // 현재 페이지는 비활성화
        button.onclick = () => {
            showLoader();
            setTimeout(() => {
                displayPage(i);
                hideLoader();
            }, 300); // 약간의 지연 추가
        };
        pagination.appendChild(button);
    }

    // 다음 버튼 생성
    if (endPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "다음";
        nextButton.onclick = () => {
            showLoader();
            setTimeout(() => {
                displayPage(endPage + 1);
                hideLoader();
            }, 300); // 약간의 지연 추가
        };
        pagination.appendChild(nextButton);
    }
}
const URL2 = "https://script.google.com/macros/s/AKfycbyNHJz6b_Q4ScDSWpepfrJMDJUec2NqoW_n3mMRpdIh1QrlobmX-hyH8WZ0Y7-GCDlN0g/exec";
					
// 모달 DOM 요소
const modalContainer = document.getElementById("modal-container");
const modalData = document.getElementById("modal-data");






// 순번 클릭 이벤트 추가
function addRowClickEvents(tableBody) {
    Array.from(tableBody.querySelectorAll("tr")).forEach((rowElement) => {
        const firstCell = rowElement.cells[0]; // 순번 셀(첫 번째 셀)
        if (firstCell) {
            const cellValue = firstCell.textContent.trim(); // 순번 셀의 값 가져오기
            firstCell.style.cursor = "pointer"; // 클릭 가능한 스타일 적용
            firstCell.onclick = () => {
                fetchRowData(cellValue); // 클릭된 값으로 데이터 요청
            };
        }
    });
}

// Google 스프레드시트와 통신하여 데이터 가져오기
function fetchRowData(cellValue) {
    if (!cellValue) {
        console.error("Cell Value is empty!"); // 빈 값 확인
        alert("유효하지 않은 요청입니다."); // 알림 표시
        return;
    }

    const fetchUrl = `${URL2}?value=${encodeURIComponent(cellValue)}`; // A열 값으로 요청
    console.log("Request URL:", fetchUrl); // 요청 URL 확인

    fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Response Data:", data); // 응답 확인
            if (data.error) {
                console.error("Error:", data.error);
                alert(data.error); // 에러 메시지 표시
            } else {
                showModal(data); // 가져온 데이터를 모달에 표시
            }
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            alert("데이터를 가져오는 중 오류가 발생했습니다."); // 에러 알림
        });
}



// 모달 표시
function showModal(data) {
    const modalData = document.getElementById("modal-data");
    modalData.textContent = JSON.stringify(data, null, 2); // 데이터를 JSON 형식으로 표시
    const modalContainer = document.getElementById("modal-container");
    modalContainer.style.display = "flex"; // 모달 표시
}

// 모달 숨기기
function hideModal() {
    const modalContainer = document.getElementById("modal-container");
    modalContainer.style.display = "none"; // 모달 숨기기
}
