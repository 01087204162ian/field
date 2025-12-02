<?php
require_once '../DatabaseConnection.php';

$db = new DatabaseConnection();
$pdo = $db->pdo;

$stmt = $pdo->query("SELECT * FROM checklist");
$rows = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>보안 점검표</title>
</head>
<body>
<h1>보안 점검표</h1>
<table border="1">
    <tr>
        <th>구분</th>
        <th>유형</th>
        <th>점검 항목</th>
        <th>점검 결과</th>
    </tr>
    <?php foreach ($rows as $row): ?>
    <tr>
        <td><?= htmlspecialchars($row['system_area']) ?></td>
        <td><?= htmlspecialchars($row['category']) ?></td>
        <td><?= nl2br(htmlspecialchars($row['item'])) ?></td>
        <td><?= htmlspecialchars($row['result']) ?></td>
    </tr>
    <?php endforeach; ?>
</table>
</body>
</html>
