   <div id="loader-container">
        <div class="loader"></div>
    </div>
 <h1>Google Sheets Data</h1>
    <table id="data-table">
        <thead>
            <!-- 첫 번째 행이 여기에 삽입됩니다. -->
        </thead>
        <tbody>
            <!-- 나머지 데이터가 여기에 삽입됩니다. -->
        </tbody>
    </table>
	<div class="pagination" id="pagination">
        <!-- 페이지네이션 버튼이 여기에 추가됩니다. -->
    </div>
    <div id="error-message" class="error"></div>

<div id="modal-container" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:1000;">
    <div id="modal-content" style="background-color:white; padding:20px; border-radius:10px; max-width:500px; width:90%; box-shadow:0 4px 8px rgba(0,0,0,0.2);">
        <h2>데이터 정보</h2>
        <pre id="modal-data" style="background-color:#f9f9f9; padding:10px; border-radius:5px; border:1px solid #ddd;"></pre>
        <button onclick="hideModal()" style="margin-top:20px; padding:10px 20px; background-color:#3498db; color:white; border:none; border-radius:5px; cursor:pointer;">닫기</button>
    </div>
</div>

