
    <h1>현장실습보험 개발 결과 정리</h1>
    <h2>1. 프로젝트 개요</h2>
    <ul>
        <li><strong>프로젝트명:</strong> 현장실습보험 관리 시스템 개발</li>
        <li><strong>목적:</strong> 현장실습생의 보험 계약 및 관리 프로세스를 디지털화하여 효율성과 데이터 정확성 향상</li>
        <li><strong>기간:</strong> 202X.XX.XX ~ 202X.XX.XX</li>
        <li><strong>기술 스택:</strong>
            <ul>
                <li>서버: PHP 5.3</li>
                <li>데이터베이스: MySQL</li>
                <li>프론트엔드: HTML, CSS, JavaScript (Vanilla JS)</li>
                <li>버전 관리: Git</li>
            </ul>
        </li>
    </ul>



    <h4>2. 업무 프로세스</h4>
    <h5>1. 신청 리스트 확인 및 고객 데이터 조회</h5>
    <ul>
        <li>대리점 담당자는 신청 리스트를 확인하고 보험료를 검토.</li>
        <li>고객 데이터가 없을 경우 <code>2014Costmer</code> 테이블에 삽입.</li>
        <li>삽입된 <code>num</code> 값을 신청 데이터의 <code>cNum</code>에 업데이트.</li>
    </ul>
    <h5>2. 로그인 정보 이메일 발송</h5>
    <ul>
        <li>고객에게 ID와 비밀번호 정보를 포함한 이메일을 발송.</li>
        <li>발송된 이메일 내용:
            <ul>
                <li>로그인 정보(ID 및 초기 비밀번호).</li>
                <li>현장실습보험 지원 사이트 링크.</li>
                <li>질문서 및 청약서 작성 절차.</li>
                <li>결제 정보(법인카드/가상계좌) 안내.</li>
            </ul>
        </li>
    </ul>
    <h5>3. 한화 손보 전산에서 청약서 발행</h5>
    <h5>4. 대리점 담당자의 청약서 업로드</h5>
    <ul>
        <li>청약서와 청약번호를 업로드.</li>
        <li>업로드 시 청약 관련 메일이 발송됨.</li>
    </ul>
    <h5>5. 신청자의 서류 처리</h5>
    <ul>
        <li>신청자는 어드민에 로그인하여 질문서 및 청약서를 다운로드.</li>
        <li>날인 후 서류를 업로드.</li>
    </ul>
    <h5>6. 보험대리점 담당자의 처리</h5>
    <ul>
        <li>날인된 청약서를 다운로드 후 한화손해보험 전산에 업로드.</li>
        <li>보험료 입금 또는 카드 승인 후 증권을 발행.</li>
    </ul>
    <h5>7. 보험대리점 담당자의 추가 작업</h5>
    <ul>
        <li>업로드 버튼을 클릭하여 보험증권 및 증권번호 입력.</li>
        <li>영수증 및 카드전표도 업로드.</li>
        <li>"현장실습보험 증권 발급 안내" 메일 발송.</li>
    </ul>

	<h2>3. DB 구조</h2>
    <h3>3.1 테이블 구조</h3>

    <h4>1. questionnaire 테이블</h4>
    <p>현장실습보험 신청 데이터를 저장하는 주요 테이블. 학교, 보험 기간, 신청 인원 등의 정보를 기록.</p>
    <pre><code>CREATE TABLE IF NOT EXISTS `questionnaire` (
  `num` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `school1` varchar(20) NOT NULL COMMENT '계약자',
  `school2` varchar(20) NOT NULL COMMENT '사업자번호',
  `school3` varchar(100) NOT NULL COMMENT '주소',
  `school4` varchar(20) NOT NULL COMMENT '연락처',
  `school5` varchar(100) NOT NULL COMMENT '이메일',
  `school6` char(2) NOT NULL COMMENT '학기',
  `school7` date NOT NULL COMMENT '보험시기',
  `school8` date NOT NULL COMMENT '보험종기',
  `school9` char(2) NOT NULL COMMENT '플랜',
  `week4` int(11) DEFAULT NULL COMMENT '4주인원',
  `week5` int(11) DEFAULT NULL COMMENT '5주인원',
  `week6` int(11) DEFAULT NULL COMMENT '6주인원',
  `week7` int(11) DEFAULT NULL COMMENT '7주인원',
  `week8` int(11) DEFAULT NULL COMMENT '8주인원',
  `week9` varchar(20) DEFAULT NULL COMMENT '9주인원',
  `week10` varchar(20) DEFAULT NULL COMMENT '10주인원',
  `week11` varchar(20) DEFAULT NULL COMMENT '11주인원',
  `week12` varchar(20) DEFAULT NULL COMMENT '12주인원',
  `week13` varchar(20) DEFAULT NULL COMMENT '13주인원',
  `week_total` int(11) NOT NULL COMMENT '전체인원',
  `preiminum` varchar(10) NOT NULL COMMENT '보험료',
  PRIMARY KEY (`num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;</code></pre>

    <h4>2. 2012Member 테이블</h4>
    <p>현장실습보험 관리 대리점 직원의 정보를 저장.</p>
    <pre><code>CREATE TABLE IF NOT EXISTS `2012Member` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `mem_id` varchar(15) NOT NULL COMMENT '직원 ID',
  `passwd` varchar(32) NOT NULL COMMENT '비밀번호',
  `name` varchar(30) NOT NULL COMMENT '직원 이름',
  `hphone` varchar(14) NOT NULL COMMENT '핸드폰 번호',
  `email` varchar(40) NOT NULL COMMENT '이메일 주소',
  `level` char(2) NOT NULL COMMENT '직원 권한 등급',
  `wdate` date NOT NULL DEFAULT '0000-00-00' COMMENT '등록일',
  PRIMARY KEY (`num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;</code></pre>

    <h4>3. 2014Costmer 테이블</h4>
    <p>신청자의 이메일과 기타 정보를 저장. <code>questionnaire</code>의 데이터를 참조하여 신청 데이터를 생성.</p>
    <pre><code>CREATE TABLE IF NOT EXISTS `2014Costmer` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `mem_id` varchar(20) NOT NULL,
  `passwd` varchar(100) NOT NULL,
  `idmail` varchar(100) NOT NULL COMMENT '메일 발송 여부',
  PRIMARY KEY (`num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;</code></pre>

    <h4>4. preiminum 테이블</h4>
    <p>보험료 계산에 필요한 플랜과 기간별 데이터를 저장.</p>
    <pre><code>CREATE TABLE IF NOT EXISTS `preiminum` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `a1` varchar(10) DEFAULT NULL COMMENT 'planA1~4',
  `a2` varchar(10) DEFAULT NULL COMMENT 'planA5~8',
  `b1` varchar(10) DEFAULT NULL COMMENT 'planB1~4',
  `b2` varchar(10) DEFAULT NULL COMMENT 'planB5~8',
  `sigi` date DEFAULT NULL,
  `end` date DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;</code></pre>

    <h4>5. image 테이블</h4>
    <p>청약서, 영수증 등의 이미지 파일 정보를 저장.</p>
    <pre><code>CREATE TABLE IF NOT EXISTS `image` (
  `num` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `qnum` int(11) DEFAULT NULL COMMENT 'questionnaire',
  `kind` char(2) DEFAULT NULL COMMENT '영수증1,카드전표2',
  `title` varchar(20) DEFAULT NULL,
  `description2` text COMMENT 'image경로',
  `wdate` date DEFAULT NULL COMMENT '등록일',
  `deleteIs` varchar(1) NOT NULL COMMENT '2삭제',
  PRIMARY KEY (`num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;</code></pre>
</div>
