$(document).ready(function () {
    const menus = {
            "현장실습보험": [
                { name: "질문서", link: "questions.php" },
				{ name: "claimList", link: "claimList2.php" },
				//{ name: "claimList2", link: "claimList.php" },
                { name: "아이디", link: "user_management.php" },
                { name: "학교", link: "schools.php" },
                { name: "사고처리", link: "incident_handling.php" },
                { name: "처리절차안내", link: "procedure_guide.php" },
                { name: "자주묻는질문", link: "faq.php" },
                { name: "보상안내", link: "compensation.php" },
                { name: "공지사항", link: "notices.php" },
			     { name: "개발정리", link: "developmentSummary.php" }
            ],
            "kj대리": [],
            "das대리": [],
            "약국": [],
            "여행자배상책임": []
        };

    $(".menu-item").on("click", function (e) {
        e.preventDefault();
        $(".menu-item").removeClass("active");
        $(this).addClass("active");

        const section = $(this).data("section");
        updateLeftMenu(section);
    });

    function updateLeftMenu(section) {
        const menuList = menus[section] || [];
        const $menu = $("#left-menu");
        $menu.empty();

        menuList.forEach(item => {
            $menu.append(`<li><a href="${item.link}">${item.name}</a></li>`);
        });

        if (menuList.length === 0) {
            $menu.append("<li>메뉴가 없습니다</li>");
        }

		const currentUrl = window.location.pathname.split("/").pop();
		$menu.find("a").each(function () {
			if ($(this).attr("href") === currentUrl) {
				$(this).addClass("active");
			}
		});
    }

   updateLeftMenu("현장실습보험");
	
	$(document).on('click', '.logout-btn', function (e) {
			e.preventDefault();
					if (confirm('정말 로그아웃하시겠습니까?')) {
						window.location.href = '_db/logout.php'; // 로그아웃 처리를 담당하는 PHP로 이동
					}
	});
});

