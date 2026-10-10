/* 테마 여행 (산·걷기길·온천 등). 시제품: 샘플 목록, 실제 정보·운영은 TourAPI 연동 후 */
const THEMES=[['mount','⛰️','산','산·트레킹','케이블카로 쉽게, 둘레길로 가볍게, 높은 산은 도전','#4F8E87','#1F4E55','난이도'],
['walk','🚶','걷기 길','걷기 좋은 길','골목·호수·성곽·해안, 천천히 걷는 길','#7CB083','#2F6B52','걷는 느낌'],
['spa','♨️','온천','온천·힐링','몸을 녹이고 쉬어 가는 여행','#E39A7B','#A9503A','종류'],
['temple','🛕','사찰·궁궐','사찰·궁궐·전통','세계유산과 고즈넉한 절, 한옥','#C9A06B','#7A4B2A','종류'],
['senior','🧓','어르신과','어르신과 편한 곳','평탄하고 쉬어 가기 좋은 곳 위주','#E8A16A','#B5612B','특징'],
['island','🏝️','섬','섬 여행','다리로 가는 섬, 배 타고 가는 섬','#4FA7C9','#1D6A93','가는 방법'],
['sun','🌅','일출·야경','일출·일몰·야경','해돋이, 낙조, 반짝이는 밤 풍경','#F08A5D','#6E3F7A','시간대'],
['fish','🎣','낚시·레저','낚시·레저','선상낚시, 방파제, 수상 레저 (안전·규정 확인)','#3E88B5','#1B4670','종류'],
['kids','🎡','아이와','아이와 체험','놀이공원, 과학관, 갯벌 체험','#F2B84B','#C46A1B','종류'],
['drive','🚗','드라이브','드라이브·기차 여행','해안도로와 기차로 떠나는 여행','#5DA0D8','#2B5C95','방식'],
['zoo','🐼','동물·수족관','동물원·수족관','아이가 좋아하는 동물 구경','#8FC46B','#3F7D3A','종류'],
['park','🎢','놀이공원','놀이공원·테마파크','하루 신나게 노는 곳','#F26D8B','#A02B6B','종류'],
['beach','🏖️','갯벌·해변','갯벌 체험·해변','발 담그고 조개 잡고 모래놀이','#59C0D0','#1E7C96','종류'],
['museum','🔬','과학·박물관','과학관·박물관','비 오는 날도 좋은 실내 체험','#7F8FD8','#3C4A9A','종류'],
['flower','🌸','꽃·정원','꽃·정원 구경','계절 꽃과 정원을 천천히 걷기','#F2A0B8','#B4507A','종류'],
['market','🛍️','시장·먹거리','전통시장·먹거리','시장 구경하고 맛있는 한 끼','#E9A44A','#B25A1C','종류'],
['view','🚠','전망·케이블카','전망대·케이블카','힘들이지 않고 높은 곳에서 보기','#6FB1E0','#2F6AA6','종류'],
['cafe','☕','카페·감성','카페·감성 거리','사진 찍고 쉬어 가는 거리','#C79A7A','#7A4A33','거리'],
['camp','⛺','캠핑','캠핑·글램핑','장비 없이도 떠나는 캠핑','#5E9E6E','#2A5A3C','종류'],
['bike','🚴','자전거·레일','자전거·레일바이크','강변과 바닷길을 달리는 즐거움','#6BC1A0','#2A7C66','종류'],
['food','🍜','맛집 투어','지역 먹거리 여행','그 지역에서만 맛볼 음식 따라가기','#E57A5A','#A33A2A','음식']];
/* [테마, 이름, 가까운 지역, 태그, 한 줄 설명] */
const TSPOTS=[
['mount','남산 둘레길·서울타워','seoul','쉬움','도심에서 가볍게 걷는 산책길'],['mount','북한산 둘레길','seoul','쉬움','구간별로 평탄한 길이 많아요'],['mount','북한산 백운대','seoul','힘듦','암릉 구간, 체력 필요'],['mount','광교산','suwon','보통','시내에서 가까운 산'],
['mount','오대산 선재길','gangneung','쉬움','계곡 따라 걷는 평탄한 숲길'],['mount','설악산 케이블카·권금성','sokcho','쉬움','케이블카로 쉽게 올라가요'],['mount','설악산 울산바위','sokcho','힘듦','계단이 많아요, 체력 필요'],['mount','춘천 삼악산 호수케이블카','chuncheon','쉬움','의암호 전망, 케이블카'],
['mount','계룡산 동학사 계곡길','daejeon','보통','사찰과 계곡을 함께'],['mount','대둔산 케이블카 (완주)','jeonju','쉬움','케이블카와 구름다리'],['mount','무등산 서석대','gwangju','보통','주상절리와 억새, 산행 준비'],['mount','월출산 (영암)','mokpo','힘듦','바위산, 산행 준비'],
['mount','지리산 노고단 (구례)','suncheon','힘듦','성삼재에서 오르는 코스, 날씨 확인'],['mount','금정산 산성마을 둘레길','busan','보통','산성 따라 걷는 길'],['mount','팔공산 케이블카','daegu','쉬움','케이블카로 전망대까지'],['mount','영남알프스 간월재','ulsan','힘듦','억새 능선, 체력 필요'],
['mount','내연산 12폭포','pohang','보통','폭포를 따라 걷는 계곡길'],['mount','주왕산 주산지 (청송)','andong','보통','계곡과 호수'],['mount','부소산성 산책','buyeo','쉬움','낙화암까지 완만한 길'],['mount','한라산 어리목·영실','jeju','힘듦','입산 통제와 날씨 확인'],
['walk','서울 한양도성길','seoul','성곽','성곽 따라 걷는 도심 산책'],['walk','북촌·서촌 골목길','seoul','골목','한옥 골목과 카페'],['walk','수원화성 성곽길','suwon','성곽','성곽 한 바퀴 약 5.7km'],['walk','송도 센트럴파크','incheon','공원','평탄한 공원 산책'],
['walk','경포호 둘레길','gangneung','호수','평지 호수 산책 약 4km'],['walk','강릉 바우길','gangneung','해안·숲','바다와 숲길 구간이 많아요'],['walk','춘천 소양강 스카이워크','chuncheon','호수','강 위 유리 전망대'],['walk','속초 아바이마을·갯배','sokcho','골목','갯배 타고 건너는 마을'],
['walk','태안 해변길','taean','해안·숲','바다 따라 걷는 길'],['walk','대전 계족산 황톳길','daejeon','해안·숲','맨발로 걷는 황톳길'],['walk','부여 백마강 낙화암길','buyeo','호수','강변과 유적 산책'],['walk','전주 한옥마을','jeonju','골목','골목 산책, 한복 체험'],
['walk','광주 양림동 근대문화길','gwangju','골목','골목과 카페'],['walk','목포 근대역사거리','mokpo','골목','근대 건물 거리 산책'],['walk','순천만 갈대길','suncheon','호수','데크 길이 평탄해요'],['walk','통영 동피랑·강구안','tongyeong','골목','벽화 골목과 항구'],
['walk','부산 해파랑길·갈맷길','busan','해안·숲','해안 따라 걷는 길'],['walk','울산 태화강 십리대숲','ulsan','공원','대숲 길 산책'],['walk','포항 환호공원 스페이스워크','pohang','해안·숲','바다 전망 산책'],['walk','대구 근대골목','daegu','골목','근대 건축 골목 투어'],
['walk','경주 대릉원·황리단길','gyeongju','골목','평탄한 고분 길과 골목'],['walk','안동 하회마을','andong','골목','마을 한 바퀴, 흙길'],['walk','제주 올레길','jeju','해안·숲','코스별 난이도가 달라요'],
['spa','유성온천','daejeon','온천','족욕 체험장과 온천 호텔'],['spa','덕산온천 (예산)','taean','온천','태안에서 약 1시간'],['spa','부곡온천 (창녕)','daegu','온천','대구에서 약 1시간'],['spa','해운대 온천','busan','온천','도심 온천과 바다'],
['spa','속초 설악워터피아','sokcho','스파','온천 워터파크'],['spa','속초 척산온천','sokcho','온천','설악산 가까운 온천'],['spa','서울 도심 스파·찜질방','seoul','스파','쉬어 가기 좋은 도심 스파'],['spa','숲속의 집 휴양림','chuncheon','숲 휴식','조용히 쉬는 숲속의 집'],
['temple','불국사·석굴암','gyeongju','세계유산','석굴암은 버스로 이동'],['temple','통도사 (양산)','ulsan','큰 절','울산·부산 사이, 산책로가 좋아요'],['temple','범어사','busan','템플스테이','금정산 자락 사찰'],['temple','해인사 (합천)','daegu','세계유산','팔만대장경, 대구에서 약 1시간'],
['temple','송광사·선암사','suncheon','템플스테이','조용한 사찰 숲길'],['temple','부석사 (영주)','andong','큰 절','무량수전과 전망, 계단이 있어요'],['temple','마곡사 (공주)','buyeo','템플스테이','솔바람길과 템플스테이'],['temple','낙산사','sokcho','바다','바다를 보는 사찰'],
['temple','월정사 전나무숲','gangneung','큰 절','전나무숲길이 평탄해요'],['temple','봉은사·조계사','seoul','도심 사찰','도심 속 사찰'],['temple','창덕궁·종묘','seoul','궁궐','세계유산, 관람 시간 확인'],['temple','경복궁','seoul','궁궐','휴관일 확인'],
['temple','수원화성','suwon','세계유산','성곽과 행궁'],['temple','공산성·무령왕릉 (공주)','buyeo','세계유산','백제 유적'],['temple','도산서원·하회마을','andong','세계유산','서원과 마을'],['temple','전주 경기전','jeonju','한옥','한옥마을 중심 유적'],
['senior','순천만국가정원','suncheon','평탄','넓고 평탄한 산책로'],['senior','서울 올림픽공원','seoul','평탄','넓은 평지 공원'],['senior','국립중앙박물관','seoul','실내','실내 전시, 쉬는 공간 많아요'],['senior','경포호 둘레길','gangneung','평탄','평지 호수 산책'],
['senior','제주 비자림','jeju','평탄','부드러운 흙길 숲'],['senior','대전 한밭수목원','daejeon','평탄','평지 수목원'],['senior','유성온천 족욕','daejeon','쉬어 가기','앉아서 쉬는 족욕'],['senior','국립아시아문화전당','gwangju','실내','실내 전시와 공원'],
['senior','경주 보문호 둘레','gyeongju','평탄','호수 따라 평탄한 길'],['senior','해운대 해변 산책','busan','평탄','평평한 해변 산책'],['senior','수원 화성행궁','suwon','실내·외','행궁 안은 비교적 평탄해요'],['senior','태화강 국가정원','ulsan','평탄','강변 평지 정원'],
['senior','영일대 해변','pohang','평탄','해변 산책로'],['senior','부여 궁남지','buyeo','평탄','연못 산책'],
['island','제주 우도','jeju','배 타고','성산항에서 배, 전기차·자전거 이동'],['island','통영 소매물도','tongyeong','배 타고','등대섬, 날씨에 따라 결항'],['island','거제 외도 보타니아 (거제)','tongyeong','배 타고','섬 정원, 배 시간 확인'],['island','무의도·실미도','incheon','차로','다리로 연결, 서울에서 가까워요'],
['island','영흥도','incheon','차로','다리로 연결된 서해 섬'],['island','강화도','incheon','차로','갯벌과 역사 유적'],['island','안면도','taean','차로','다리로 연결된 섬, 해변과 휴양림'],['island','여수 오동도','yeosu','걸어서','방파제로 걸어 들어가는 동백 섬'],
['island','여수 금오도 비렁길','yeosu','배 타고','절벽 따라 걷는 길, 배 시간 확인'],['island','홍도·흑산도','mokpo','배 타고','먼 섬 여행, 일정 여유 필요'],['island','울릉도','pohang','배 타고','포항에서 배, 날씨에 따라 결항이 잦아요'],
['sun','정동진 해돋이','gangneung','일출','기차역 앞 바다'],['sun','성산일출봉','jeju','일출','새벽 오름, 계단이 많아요'],['sun','호미곶','pohang','일출','상생의 손'],['sun','간절곶','ulsan','일출','해맞이 명소'],
['sun','속초 영금정','sokcho','일출','바다 위 정자에서 일출'],['sun','태안 꽃지해변','taean','일몰','할미·할아비 바위 사이로 지는 해'],['sun','목포 해상케이블카·유달산','mokpo','일몰·야경','낙조와 야경'],['sun','남산서울타워','seoul','야경','서울 전경 야경'],
['sun','수원화성 야경','suwon','야경','성곽 조명'],['sun','광안대교 야경','busan','야경','광안리에서 보는 야경'],['sun','여수 밤바다','yeosu','야경','포차 거리와 케이블카'],['sun','동궁과 월지','gyeongju','야경','연못 위 불빛'],
['sun','대구 83타워·이월드','daegu','야경','도시 야경'],['sun','월미도·차이나타운','incheon','야경','놀이공원과 바다'],
['fish','화천 얼음낚시 (겨울)','chuncheon','겨울','산천어축제 기간 얼음낚시'],['fish','의암호 붕어낚시','chuncheon','민물','호수 낚시, 허용 구간 확인'],['fish','통영 선상낚시','tongyeong','바다','배 예약 필요'],['fish','여수 돌산 선상낚시','yeosu','바다','선상 낚시 예약'],
['fish','안면도 방파제·선상낚시','taean','바다','물때 확인'],['fish','속초 방파제 낚시','sokcho','바다','방파제 낚시, 안전 주의'],['fish','인천 연안부두 선상낚시','incheon','바다','서울에서 가까운 선상낚시'],['fish','제주 한림·모슬포 선상낚시','jeju','바다','배 예약 필요'],
['fish','포항 구룡포 방파제','pohang','바다','방파제 낚시'],['fish','양양 죽도 서핑','sokcho','레저','속초에서 가까운 서핑 해변'],['fish','부산 수영만 요트','busan','레저','요트 체험'],['fish','의암호 카누·수상스키','chuncheon','레저','수상 레저 체험'],
['kids','롯데월드','seoul','놀이공원','실내·야외'],['kids','국립어린이박물관','seoul','체험','체험 전시, 예약 확인'],['kids','에버랜드 (용인)','suwon','놀이공원','수원에서 가까워요'],['kids','춘천 레고랜드','chuncheon','놀이공원','레고 테마파크'],
['kids','부산 아쿠아리움','busan','체험','해운대 해변 옆'],['kids','대전 국립중앙과학관','daejeon','과학','체험 전시'],['kids','경주월드','gyeongju','놀이공원','놀이기구와 물놀이'],['kids','순천만 습지·국가정원','suncheon','자연','걷기 좋은 습지와 정원'],
['kids','태안 갯벌 체험','taean','체험','물때 확인 필수'],['kids','제주 에코랜드','jeju','자연','기차 타고 숲을 둘러봐요'],['kids','울산 고래문화마을','ulsan','체험','고래 전시와 체험'],['kids','국립아시아문화전당 어린이문화원','gwangju','체험','어린이 체험 공간'],
['drive','동해안 7번 국도 (강릉~속초)','gangneung','드라이브','바다 따라 달리는 길'],['drive','제주 해안도로 일주','jeju','드라이브','협재·함덕 해안도로'],['drive','부산 해안 드라이브 (해운대~송정)','busan','드라이브','해안 카페 거리'],['drive','태안 해안도로','taean','드라이브','서해 노을 드라이브'],
['drive','울산 간절곶~대왕암','ulsan','드라이브','동해 해안'],['drive','순천~여수 해안 드라이브','yeosu','드라이브','남해 바다 풍경'],['drive','남해 독일마을 (남해)','tongyeong','드라이브','통영에서 약 1시간'],['drive','서울~강릉 KTX-이음','gangneung','기차','약 2시간, 서울에서 편해요'],
['drive','전주 KTX 당일 여행','jeonju','기차','서울에서 약 1시간 40분'],['drive','경주 KTX 신경주역','gyeongju','기차','서울에서 약 2시간 10분'],['drive','여수 KTX','yeosu','기차','서울에서 약 3시간'],['drive','강릉~삼척 바다열차','gangneung','기차','운행 일정 확인'],['zoo','서울대공원 동물원','seoul','동물원','과천, 서울에서 가까운 큰 동물원'],['zoo','대전 오월드','daejeon','동물원','동물원과 놀이시설을 함께'],['zoo','광주 우치공원','gwangju','동물원','공원 안 동물원 산책'],['zoo','부산 아쿠아리움(해운대)','busan','수족관','해변 앞 대형 수족관'],['zoo','여수 아쿠아플라넷','yeosu','수족관','여수 바다 옆 수족관'],['zoo','제주 아쿠아플라넷','jeju','수족관','성산 일출봉 가까운 곳'],
['park','롯데월드','seoul','놀이공원','실내·야외를 함께 즐기는 곳'],['park','에버랜드(용인)','suwon','놀이공원','수원에서 가까운 대형 테마파크'],['park','경주월드','gyeongju','놀이공원','경주 보문단지 근처'],['park','대구 이월드','daegu','놀이공원','타워와 야경이 유명'],['park','롯데월드 어드벤처 부산','busan','놀이공원','기장, 바다 가까운 테마파크'],
['beach','태안 갯벌 체험','taean','갯벌','물때 확인 후 조개·낙지 체험'],['beach','경포해변','gangneung','해변','넓은 모래사장과 호수'],['beach','해운대해수욕장','busan','해변','도심 속 대표 해변'],['beach','속초해수욕장','sokcho','해변','설악산과 바다를 함께'],['beach','을왕리해수욕장','incheon','해변','수도권에서 가까운 바다'],['beach','협재해수욕장','jeju','해변','맑은 바다와 비양도 풍경'],
['museum','국립중앙과학관','daejeon','과학관','아이와 하루 체험'],['museum','국립중앙박물관','seoul','박물관','실내라 날씨 걱정 없음'],['museum','국립경주박물관','gyeongju','박물관','신라 유물 감상'],['museum','국립부여박물관','buyeo','박물관','백제 유물과 금동대향로'],['museum','국립해양박물관','busan','박물관','배·바다 이야기 체험'],['museum','국립아시아문화전당','gwangju','박물관','전시와 어린이 공간'],
['flower','순천만국가정원','suncheon','정원','계절 꽃과 호수 산책'],['flower','서울숲','seoul','정원','도심 속 숲과 꽃'],['flower','경주 대릉원 일대','gyeongju','꽃','봄 벚꽃과 고분 산책'],['flower','태안 꽃 축제 지역(안면도)','taean','꽃','봄 튤립 등 꽃 구경'],['flower','하늘공원','seoul','꽃','억새와 노을 (가을)'],['flower','춘천 의암호 둘레','chuncheon','꽃','호수 따라 계절 꽃'],
['market','광장시장','seoul','시장','빈대떡·마약김밥 등 먹거리'],['market','전주 남부시장','jeonju','시장','한옥마을과 함께 둘러보기'],['market','부산 자갈치시장','busan','시장','신선한 해산물과 회'],['market','속초 중앙시장','sokcho','시장','닭강정·오징어순대'],['market','통영 중앙시장','tongyeong','시장','활어회와 충무김밥'],['market','대구 서문시장','daegu','시장','먹거리 골목과 야시장'],
['view','남산서울타워','seoul','전망대','서울 전경 한눈에'],['view','설악산 케이블카','sokcho','케이블카','권금성까지 쉽게 오르기'],['view','통영 케이블카','tongyeong','케이블카','미륵산에서 한려수도 전망'],['view','여수 해상케이블카','yeosu','케이블카','바다 위를 가로지르는 케이블카'],['view','목포 해상케이블카','mokpo','케이블카','유달산과 바다 전망'],['view','팔공산 케이블카','daegu','케이블카','가을 단풍 전망'],['view','소양강 스카이워크','chuncheon','전망대','강 위를 걷는 전망대'],
['cafe','강릉 안목 커피거리','gangneung','카페거리','바다 보며 커피 한 잔'],['cafe','부산 전포 카페거리','busan','카페거리','개성 있는 카페 골목'],['cafe','경주 황리단길','gyeongju','카페거리','한옥 카페와 사진 명소'],['cafe','전주 객리단길','jeonju','카페거리','한옥마을 옆 감성 거리'],['cafe','성수동 카페거리','seoul','카페거리','공장 개조 카페'],['cafe','제주 애월 카페거리','jeju','카페거리','바다 전망 카페'],
['camp','북한강변 오토캠핑','chuncheon','오토캠핑','강변 캠핑'],['camp','안면도 캠핑','taean','오토캠핑','바다와 소나무숲'],['camp','강릉 해변 캠핑','gangneung','오토캠핑','바다 소리 들으며'],['camp','제주 글램핑','jeju','글램핑','장비 없이 가볍게'],['camp','순천만 인근 캠핑','suncheon','오토캠핑','갈대밭 근처'],['camp','영종도 글램핑','incheon','글램핑','수도권에서 가까운 곳'],
['bike','의암호 자전거길','chuncheon','자전거','호수 따라 달리기'],['bike','정동진 레일바이크','gangneung','레일바이크','바다 옆 철길'],['bike','제주 환상자전거길','jeju','자전거','해안 따라 일주'],['bike','한강 자전거길','seoul','자전거','도심 강변 라이딩'],['bike','순천만 자전거 길','suncheon','자전거','갈대밭 사이 길'],['bike','대전 갑천 자전거길','daejeon','자전거','도심 하천 길'],
['food','전주 비빔밥·콩나물국밥','jeonju','한식','전주 대표 음식'],['food','통영 충무김밥·꿀빵·해산물','tongyeong','해산물','항구 도시 먹거리'],['food','속초 닭강정·오징어순대','sokcho','시장 음식','중앙시장 일대'],['food','부산 돼지국밥·밀면','busan','한식','부산 대표 음식'],['food','목포 홍어·세발낙지','mokpo','해산물','남도 맛'],['food','안동 찜닭·간고등어','andong','한식','안동 대표 음식'],['food','여수 게장·갓김치','yeosu','한식','남해 맛'],['food','대구 막창·찜갈비','daegu','한식','대구 대표 음식']];
const TH_ORDER=THEMES.map(t=>t[0]);
const TH_GRP=[['par','부모님과',['senior','spa','flower','temple','market','walk','drive','view','island','sun']],['kid','아이와',['kids','zoo','park','beach','museum','island','camp','bike','view','drive']],['cpl','부부·연인',['sun','cafe','drive','view','spa','flower','island','walk','temple','camp']],['fri','친구·혼자',['mount','camp','fish','bike','food','beach','sun','drive','walk','island']]];
/* 지금 계절에 어울리는 테마는 앞으로 (순서 점수 = 기본 순서 - 4) */
const TH_NOW={spring:['flower','walk'],summer:['beach','island'],autumn:['mount','walk'],winter:['spa','sun']};
function thOrder(ids){const now=TH_NOW[curSeason()]||[];return ids.map((id,i)=>[id,i-(now.includes(id)?4:0)]).sort((a,b)=>a[1]-b[1]||0).map(x=>x[0]);}
function themeRow(){const g=TH_GRP.find(x=>x[0]===UI.thg)||TH_GRP[0],now=TH_NOW[curSeason()]||[],b=id=>{const t=THEMES.find(x=>x[0]===id);return `<button data-act="theme" data-v="${id}" aria-label="${t[3]}"><i class="g3" style="background:radial-gradient(circle at 30% 22%,rgba(255,255,255,.42),transparent 58%),linear-gradient(150deg,${t[5]},${t[6]});box-shadow:0 5px 12px ${t[6]}59">${typeof thIcon==='function'?thIcon(id,t[6]):t[1]}${now.includes(id)?'<u>추천</u>':''}</i><span>${t[2]}</span></button>`;};
  return `<p class="hlab">누구와 가세요? <span class="meta">테마로 찾기</span></p><div class="thg">${TH_GRP.map(x=>`<button class="${x[0]===g[0]?'on':''}" data-act="thG" data-v="${x[0]}" aria-pressed="${x[0]===g[0]}">${x[1]}</button>`).join('')}</div><div class="hth">${thOrder(g[2]).map(b).join('')}</div>`;}
function thf(){return UI.th||(UI.th={k:'mount',t:'',rg:''});}
function thList(){const f=thf(),T=THEMES.find(x=>x[0]===f.k);
  let L=TSPOTS.filter(p=>p[0]===f.k&&CITIES[p[2]]&&(!f.t||p[3]===f.t)&&(!f.rg||(REG[p[2]]&&REG[p[2]][0]===f.rg)));
  return `<div class="rbar"><span class="hint">조건에 맞는 곳 ${L.length}곳</span>${f.t||f.rg?'<button class="lnk" data-act="thReset">조건 초기화</button>':''}</div>`+(L.length?'':'<p class="hint">조건에 맞는 곳이 없어요. 조건을 줄여 보세요.</p>')+
   L.map(p=>{const C=CITIES[p[2]],q=encodeURIComponent(p[1].replace(/\(.*\)/,'').trim()+' 운영 안내');
    return `<div class="stc"><div class="sth"><span class="stt">${esc(p[3])}</span><span class="meta">${esc(C.name)}${REG[p[2]]?' · '+REG[p[2]][0]:''}</span></div><b>${esc(p[1])} <span class="smp">샘플</span></b><span class="sub">${esc(p[4])}</span><div class="sta"><button class="btn sm" data-act="stayGo" data-c="${p[2]}">${esc(C.name)} 일정 만들기</button><a class="ol" href="https://search.naver.com/search.naver?query=${q}" target="_blank" rel="noopener noreferrer">운영·안내 확인</a></div></div>`;}).join('');}
function viewTheme(){const f=thf(),T=THEMES.find(x=>x[0]===f.k),tags=[...new Set(TSPOTS.filter(p=>p[0]===f.k).map(p=>p[3]))],ch=(k,arr,cur)=>arr.map(([v,l])=>`<button class="chip${cur===v?' on':''}" data-act="thSet" data-k="${k}" data-v="${v}" aria-pressed="${cur===v}">${l}</button>`).join(''),row=(l,h)=>`<div class="rr"><span class="rl">${l}</span><div class="rc wrap">${h}</div></div>`;
  return `${ART_DEFS}<div class="sthero th" style="background:linear-gradient(135deg,${T[5]},${T[6]})"><svg viewBox="0 0 360 84" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><circle cx="310" cy="38" r="52" fill="#fff" opacity=".1"/><circle cx="310" cy="38" r="34" fill="#fff" opacity=".12"/><path d="M0 62 C60 46 120 62 190 52 S310 44 360 54 V84 H0Z" fill="#fff" opacity=".14"/><path d="M0 72 C70 62 150 74 230 66 S330 62 360 68 V84 H0Z" fill="#000" opacity=".16"/></svg><span class="them" aria-hidden="true">${typeof thIcon==='function'?thIcon(f.k,T[6]):T[1]}</span><div class="sttx"><h1>${T[3]}</h1><span>${T[4]}</span></div></div>
<div class="thtabs">${(()=>{const g=(TH_GRP.find(x=>x[0]===UI.thg)||TH_GRP[0])[2];return thOrder(g.includes(f.k)?g:[f.k,...g]);})().map(id=>{const t=THEMES.find(x=>x[0]===id);return `<button class="chip${f.k===id?' on':''}" data-act="thSet" data-k="k" data-v="${id}" aria-pressed="${f.k===id}">${typeof thIcon==='function'?`<i class="tcb" style="background:linear-gradient(150deg,${t[5]},${t[6]})">${thIcon(id,t[6])}</i>`:t[1]} ${t[2]}</button>`;}).join('')}</div>
<div class="rf">${row(T[7],ch('t',[['','전체'],...tags.map(x=>[x,x])],f.t))}${row('지역',ch('rg',[['','전체'],...REGIONS.map(r=>[r,r])],f.rg))}</div>
<div id="thres">${thList()}</div>
<div class="msg" style="margin-top:14px">${f.k==='fish'?'낚시는 금지 구역·허가·안전 규정을 꼭 현지에서 확인해 주세요. ':f.k==='mount'?'산행은 날씨·입산 통제와 체력에 맞는 난이도를 확인해 주세요. ':''}목록은 <b>샘플</b>이며 운영 시간·요금은 "운영·안내 확인"으로 확인해 주세요. 실제 정보는 한국관광공사 TourAPI 연동 후 채워져요.</div>`;}
