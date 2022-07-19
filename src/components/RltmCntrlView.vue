<template>
	<div>
		<div class="container mapType" style="z-index:auto; overflow-y:hidden;"><!-- container start --> 
			<!-- 실시간 이동차량 -->
			<div class="mpop01">
				<div class="mpopHeader">
					<span title="긴급지도전환">실시간 이동차량</span>
					<div class="btnAlim" id="btnAlim">
					</div>
					<a href="javascript:void(0)" id="btnFilter" class="btnFilter">
						<img src="@/assets/images/ico/ico_filter01.png" />
					</a>
				</div>
				<div class="mpopCont">
					<div class="form">
						<div class="inpSearch" style="overflow:hidden;">
							<input type="text" class="inp" placeholder="차량번호"/>
						</div>
					</div>
					<div class="scrolls" id="carLists">
						<dl>
							<dt id="normalSub" @click="filterBtn()" ref="normalSub">운행 <strong>({{cardata.length+roopdata.length}})대</strong></dt>
							<dd>
								<ul id="normalCarList" ref="normalCarList">
									<li class="carli" v-for="(car, i) in cardata" :key="i" @click="carListBtn(i)" ref="carli">{{ car.carRegNo }}</li>
									<li class="carli" v-for="(car, i) in roopdata" :key="i" @click="roopListBtn(i)" ref="roopcarli">{{ car.carRegNo }}</li>
								</ul>
							</dd>
						</dl>
					</div>
				</div>
			</div>
			
			<div class="mpStatusBox">
				<div class="todStatus">
					<dl>
						<dt>오늘</dt>
						<dd>
							<div class="item">
								<span class="t01">운송계획</span>
								<span class="t02">건</span>
							</div>
							<div class="item">
								<span class="t01">운송중</span>
								<span class="t02">건</span>
							</div>
							<div class="item">
								<span class="t01">운송종료</span>
								<span class="t02">건</span>
							</div>
						</dd>
					</dl>
				</div>

				<div class="tomStatus">
					<dl>
						<dt>내일</dt>
						<dd>
							<div class="item">
								<span class="t01">운송계획</span>
								<span class="t02"><strong id="tomorrowCnt"></strong> 건</span>
							</div> 
						</dd>
					</dl>
				</div> 
			</div>
	
			<div class="mpZoominList">
				<a href="javascript:void(0)" class="btnPlus" id="zoomPlus"><img src="@/assets/images/ico/ico_plus01.png" /></a>
				<a href="javascript:void(0)" class="btnMius" id="zoomMius"><img src="@/assets/images/ico/ico_mius01.png" /></a>
			</div>

			<div class="mpBottomBox">
				<div class="box">
				<a href="javascrtip:void(0)" class="mpToggle on">&nbsp;</a>
				<div class="mpbHeader">
					<span class="tit"  style="line-height:30px;"><div style="line-height:20px; margin-top:12px;">운송등록번호: <span id="detlPlanNo"></span></div><div>이상운행유형: <span id="abnormalDetl"></span></div></span>
					<ul>
						<li v-for="(mpb, i) in mpb" :key="i">{{ mpb }}</li>
					</ul>
				</div>
				<div class="mpbCont">
					<a href="javascript:void(0)" class="btnMpbLeft">이전</a>
					<div class="sortArea">
						<ul id="sortable">
							<li>
								<div class="mpbItem">
									<p class="t01">차량</p> 
									<ul>
										<li><strong id="detl_car_reg_no"></strong></li>
										<li>차종: <span id="detl_vhcty" ref="detl_vhcty"></span></li>
										<li><span id="detl_yridnw" style="margin-left:25px;"></span></li>
										<li><span id="detl_brwdnm" style="margin-left:25px;"></span></li>
										<li>소유: <span id="detl_cmpny_nm" ref="detl_cmpny_nm"></span></li>
										<li>차대번호: <span id="detl_id" ref="detl_id"></span></li>
									</ul>
								</div> 
							</li>
							<li>
								<div class="mpbItem">
									<p class="t01">단말기</p>
									<ul>
										<li>통신사 : <span id="detl_telecomCd" ref="detl_telecomCd"></span></li>
										<li>단말 번호 : <span id="detl_trmnlNo" ref="detl_trmnlNo"></span></li>
										<li>제조사: <span id="detl_makr" ref="detl_makr"></span></li>
										<li>모델명: <span id="detl_model" ref="detl_model"></span></li> 
									</ul>
									<p class="t02" id="detl_onoff">엔진상태: </p>
								</div>
							</li>
							<li>
								<div class="mpbItem">
									<p class="t01">실시간 위치</p>
									<ul>
										<li>시간: <span id="detl_occ_dt" ref="detl_occ_dt"></span></li>
										<li>주소: <span id="detl_addr" ref="detl_addr"></span></li>
										<li>위도: <span id="detl_y" ref="detl_y"></span></li>
										<li>경도: <span id="detl_x" ref="detl_x"></span></li>
										<li>속도: <span id="detl_speed" ref="detl_speed"></span></li>
									</ul>
								</div>
							</li>
							<li>
								<div class="mpbPlanBox">
									<div class="mh">
										<span>(계획)운송물질</span>
										<a href="javascript:void(0)">방재정보조회</a> &nbsp;
										<a href="javascript:void(0)">운송계획이력</a>
									</div>
									<table>
										<colgroup>
											<col width="40" />
											<col width="60" />
											<col width="" />
											<col width="100" />
											<col width="100" />
											<col width="70" />
											<col width="70" />
										</colgroup>
										<tr>
											<th v-for="(th, i) in mattTh" :key="i">{{ th }}</th>
										</tr>
									</table>
									<div class="scrolls">
										<table id="matterTb"> 
										</table>
									</div>
								</div>
							</li>
							<li>
								<div class="mpbItem">
									<p class="t01">(계획) 운송사업자</p>
									<ul>
										<li><strong><span id="detl_cmpy"></span></strong></li>
										<li>담당자 : <span id="detl_chgrNm"></span></li>
										<li>담당자 연락처  :  <span id="detl_bsnmTel"></span></li>
										<li>사업자 주소  :  <span id="detl_bsnmAddr"></span></li>
									</ul> 
								</div>
							</li>
							<li>
								<div class="mpbPlanBox" style="width:370px;">
									<div class="mh">
										<span>(계획)운전자</span>
									</div>
									<table>
										<colgroup>
											<col width="40" />
											<col width="100" />
											<col width="100" />
										</colgroup>
										<tr>
											<th>순번</th>
											<th>이름</th>
											<th>휴대전화</th>
										</tr>
									</table>
									<div class="scrolls">
										<table id="driverInfoTb">
										</table>
									</div>
								</div>
							</li>
							<li>
								<div class="mpbItem">
									<p class="t01">(계획) 운송일시</p>
									<ul>
										<li>출발 : <span id="detl_startDt"></span></li>
										<li>도착 : <span id="detl_arvlDt"></span></li> 
									</ul> 
								</div>
							</li>
							<li>
								<div class="mpbItem"> 
									<div class="mh">
										<span>(계획) 운송경로</span>
										<a href="javascript:void(0)" id="routeBtn">경로보기</a>
									</div>
									<ul>
										<li>출발 : <span id="detl_startNm"></span></li>
										<li><span id="detl_startAddr"></span></li> 
										<li>도착 : <span id="detl_dstnNm"></span> </li>
										<li><span id="detl_dstnAddr"></span></li> 
									</ul> 
								</div>
							</li>
							<li>
								<div class="mpbItem">
									<p class="t01">경고 (이상알림)</p>
									<ul id="abnormalHisList" style="overflow-y:auto; height:60%;">
									</ul> 
								</div>
							</li>
						</ul>
					</div>
					<a href="javascript:void(0)" class="btnMpbRight">다음</a>
				</div>
			</div>
			</div>
		</div><!-- container end -->
	</div>
</template>

<script>
import '@/assets/css/default.css'
import '@/assets/css/common.css'
import '@/assets/css/custom.css'
import $ from 'jquery'
import nvl from 'nvl'

export default {
  name: 'RltmCntrlView',
  data() {
    return {
		map: null,
		mattTh: ['순번', '물질구분', '물질명', 'CAS no','UN no', '용량', '함량(%)'],
		mpb: ['단말기 알림', '운전자 통화', '상황 전파', '사고 전환', '사고 신고', '상황 종료'],
    }
  },
  props: {
		cardata: {
			type: Array
		},
		roopdata: {
			type: Array
		},
		randCoord: {
			type: Array
		}
  },
  setup() {
		return { }
  },
  methods: {
		filterBtn() {
			if (this.$refs.normalCarList.style.display == "none") {
				this.$refs.normalCarList.style.display = "block";
				this.$refs.normalSub.classList.remove('on');
			} else {
				this.$refs.normalCarList.style.display = "none";
				this.$refs.normalSub.classList.add('on');
			}
		},
		carListBtn(i) {
			if(this.cardata != null){
				// 실제 데이터 주입
				this.$refs.detl_vhcty.innerHTML = this.cardata[i].carRegNo;
				this.$refs.detl_id.innerHTML = this.cardata[i].id;
				var t = this.cardata[i].evtTime;
				this.$refs.detl_occ_dt.innerHTML = "20"+ t[0]+t[1] +" / "+ t[2]+t[3] +" / "+ t[4]+t[5]
				this.$refs.detl_addr.innerHTML = this.vcCoord2Addr(this.cardata[i].coord.x, this.cardata[i].coord.y);
				this.$refs.detl_y.innerHTML = this.cardata[i].coord.y;
				this.$refs.detl_x.innerHTML = this.cardata[i].coord.x;
				this.$refs.detl_speed.innerHTML = this.cardata[i].spd;

				var coordData = [this.cardata[i].coord.y, this.cardata[i].coord.x];
				this.$emit("rltm", coordData);
				// console.log(this.roopdata)
			}

			var cl = document.getElementsByClassName('carli');
			if(event.target.classList.contains('active')) {
				event.target.classList.remove('active');
			} else {
				for(var c=0; c<cl.length; c++){
					cl[c].classList.remove('active')
				}
				event.target.classList.add('active');
			}
		},
		roopListBtn(i) {
			if(this.roopdata != null){
				var randCoordData = [this.randCoord[i][0], this.randCoord[i][1]];
				// 뻥튀기 데이터 주입
				this.$refs.detl_vhcty.innerHTML = this.roopdata[i].carRegNo;
				this.$refs.detl_id.innerHTML = this.roopdata[i].id;
				var k = this.roopdata[i].evtTime;
				this.$refs.detl_occ_dt.innerHTML = "20"+ k[0]+k[1] +" / "+ k[2]+k[3] +" / "+ k[4]+k[5]
				this.$refs.detl_addr.innerHTML = this.vcCoord2Addr(this.randCoord[i][0], this.randCoord[i][1]);
				this.$refs.detl_y.innerHTML = this.randCoord[i][0];
				this.$refs.detl_x.innerHTML =this.randCoord[i][1];
				this.$refs.detl_speed.innerHTML = this.roopdata[i].spd;

				console.log(this.randCoord)
				this.$emit("rltm", randCoordData);
			}

			var cl = document.getElementsByClassName('carli');
			if(event.target.classList.contains('active')) {
				event.target.classList.remove('active');
			} else {
				for(var c=0; c<cl.length; c++){
					cl[c].classList.remove('active')
				}
				event.target.classList.add('active');
			}
		},
		vcCoord2Addr(x, y) {
			var deferred = $.Deferred();
			try {
				var data = {
					service: 'address',
					request: 'getAddress',
					key: 'ABB0EA1C-589F-3D7A-B4D4-AD66CA5F58B0',
					type: 'PARCEL',
					point: x + "," + y
				}
				$.ajax({
					url: "https://api.vworld.kr/req/address",
					cache: false,
					dataType: "jsonp",
					jsonp: "callback",
					contentType: "application/json",
					data: data,
					type: 'POST',
					success: function (jsonObj) {
						if (typeof jsonObj == "object" && jsonObj != null && jsonObj != "undefined") {
							$("#detl_addr").text(nvl(jsonObj.response.result[0].text, "-"));
						}
					},
					error: function (jxhr, textStatus) { // eslint-disable-line
						$("#detl_addr").text("-");
					}
				});
			} catch (err) {
				deferred.reject(err);
			}
			return deferred.promise();
		}
  },
}
</script>

<style scoped>
	.carli{
		text-align: center;
		color: white;
		font-weight: bold;
		background-color: yellowgreen;
	}
	.active {
		background-color: white;
		border: 2px solid yellowgreen;
		color: black
	}
</style>