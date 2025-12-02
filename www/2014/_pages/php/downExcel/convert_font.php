<?php
// 나눔고딕 폰트 변환 스크립트
require_once __DIR__ . "/vendor/autoload.php";

// makefont.php가 있는 경우
if (file_exists(__DIR__ . "/makefont/makefont.php")) {
    require(__DIR__ . "/makefont/makefont.php");
    
    // TTF 파일이 있는 경우 변환
    if (file_exists(__DIR__ . "/NanumGothic.ttf")) {
        MakeFont(__DIR__ . "/NanumGothic.ttf", "cp1252");
        echo "나눔고딕 폰트 변환 완료\n";
    } else {
        echo "NanumGothic.ttf 파일이 없습니다.\n";
    }
} else {
    echo "makefont.php가 없습니다.\n";
}
?>