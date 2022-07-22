<template>
  <div>
    <!-- 현재시간 -->
			<div style="position: absolute; width: 240px; z-index: 20; top: 10px; left: 10px; color: #fff; text-align: center;">
				<div id="time" style="background: #f2f2f2; padding: 5px; max-height: 400px; overflow-y: auto; color: #000;">
				기준 : 0000-00-00 00:00:00
				</div>
				<!--  지도설정 -->
				<div class="legend set">
					<div class="legendCon">
						<div id="legendset" class="legendSet">
							<ul>
								<li id="satelliteMap">
									<a href="javascript:void(0)"></a>
									<p>위성지도</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<!--  지도설정 end-->
			</div>
			<!-- 실시간 이동차량 -->
			<div class="mpop03" id="opac">
				<div class="mpopHeader">
					<div class="mform">
            <p style="text-align:center;">투명도 조절</p>
            <div id="slider1" style="width:100%;"></div>
            <p id="opacv"></p>
						<div style="padding-bottom:10px; font-size:20px; text-align:center;">도로검색하기</div>
						<select class="select" id="roadTy" style="border-radius:17px; margin-bottom: 5px;"></select>
						<select class="select" id="roadGrad" style="border-radius:17px; margin-bottom: 5px;"></select>
						<div class="inpSearch ent1" style="overflow: hidden; margin-bottom: 5px;">
							<span tabindex="-1" role="presentation" class="k-widget k-autocomplete k-header inp k-autocomplete-clearable k-state-default" style="">
								<input type="text" class="inp k-input" id="dstrctCd" placeholder="권역코드" />
							</span>
							<span tabindex="-1" role="presentation" class="k-widget k-autocomplete k-header inp k-autocomplete-clearable k-state-default" style="">
                <input type="text" class="inp k-input" id="deptCd" placeholder="관리기관코드" />
							</span>
              <input type="text" class="inp" id="roadNm" name="roadNm" placeholder="도로명"/>
							<span tabindex="-1" role="presentation" class="k-widget k-autocomplete k-header inp k-autocomplete-clearable k-state-default" style="">
                <input type="text" class="inp k-input" id="linkId" placeholder="링크ID" />
							</span>
							<a href="javascript:$opratRcord.event.search();" class="k-icon k-i-search" style="top: 8px;">&nbsp;</a>
						</div>
            <div style="display: flex; align-items: center;">
              <table class="wTable" style="height: 100%; width: 100%; border-top: 0px;">
                <colgroup>
                  <col width="50%">
                  <col width="30%">
                  <col width="20%">
                </colgroup>
                <tbody>
                  <tr>
                    <th style="border: 0px; background: #f2f2f2;">조회건수</th>
                      <td id="roadCnt" style="text-align: right; border: 0px; background: #f2f2f2;">0</td>
                      <td style="border: 0px; background: #f2f2f2;">건</td>
                  </tr>
                </tbody>
              </table>
             </div>
					</div>	
				</div>
				<div class="mpopCont">
					<div class="mContForm">
						<div class="scrolls" id="carLists"></div>
					</div>
				</div>
			</div>
  </div>
</template>

<script>
import '@/assets/css/default.css'
import '@/assets/css/common.css'
import '@/assets/css/custom.css'

export default {
  name:'NodeBoxView',
  components: {},
  data() {
    return {
      sampleData: ''
    }
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    // 투명도 조절 추가
	// $(function(){
	// 	// 슬라이더 생성
	// 	$('#slider1').slider({
	// 		animate: true,
	// 		range: "min",
	// 		min : 40,
	// 		value: 100,
	// 		slide: function(event, ui){
	// 			// 투명도 조절
	// 			$('#opac').css('opacity', ui.value/100);
	// 			$('#opacv').text('투명도 : '+ui.value);
	// 		}
	// 	})
	// })
  }
}
</script>

<style scoped>
.wTable.t01 .k-dropdown.select {
	background: transparent;
}

.mpop03 {
    z-index: 20;
    width: 240px;
    height: auto;
    overflow: hidden;
    background: #fff;
    border: 1px solid #c9cfd0;
    position: absolute;
    right: 10px;
    top: 10px;
}

.mpop03 .mpopHeader {
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #fe5621;
}

.mpop03 .mpopHeader .mform {
	border-bottom: 1px solid #e5e5e5;
    width: calc( 100% - 40px );
    padding: 10px 20px;
    height: auto;
    background: #f2f2f2;
    overflow: hidden;
}

.mpop03 .mpopCont {
    width: 100%;
    height: auto;
    overflow: hidden;
}

.mpop03 .mpopCont .scrolls {
    width: 100%;
    height: 440px;
    overflow: hidden;
    overflow-y: auto;
}

.mpopCont .mContForm {
	padding: 15px;
}

#carLists .result {
	font-size: 14px;
	padding: 10px 0;
	text-align: center;
	margin-bottom: 5px;
}
.result.active {
    background: #4298b3;
}
.result {
	cursor:pointer; 
	background: #f2f2f2;
}
.tsmap-pane {
    z-index: 99;
}
</style>