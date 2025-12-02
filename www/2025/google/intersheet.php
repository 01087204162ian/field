<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Sheets Integration</title>
	<style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 20px;
        }

        h1 {
            text-align: center;
            color: #333;
        }

        table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        thead {
            background-color: #4CAF50;
            color: white;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #e0f7fa;
        }

        th {
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
    </style>
    <script>
        const URL = "https://script.google.com/macros/s/AKfycbxHrnV1-n0ttkpvSVMoiMjAZ7yttgMu3Hj2vWhvYu52TGdhjd3R4P4koA6vEoONPLKeyw/exec"; // Apps Script 웹 앱 URL 입력

        fetch(URL)
            .then(response => response.json())
            .then(data => {
                const table = document.getElementById("data-table");

                data.forEach(row => {
                    const tr = document.createElement("tr");
                    row.forEach(cell => {
                        const td = document.createElement("td");
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    table.appendChild(tr);
                });
            })
            .catch(err => console.error(err));
    </script>
</head>
<body>
    <h1>Google Sheets Data</h1>
    <table id="data-table" border="1">
     
        <tbody>
            <!-- 데이터가 여기에 삽입됩니다. -->
        </tbody>
    </table>
</body>
</html>