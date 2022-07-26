<template>
  <div>
		<div class="container"><!-- container start -->
			<div> 
				<ul class="location">
					<li>운영현황</li> > 
					<li>거래게시판</li>
				</ul> 
				<form action="#" name="searchForm" id="searchForm" accept-charset="UTF-8" method="post">
					<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
					<div class="searchBox">
						<table class="wTable" style="border-top:none;">
							<tr>
								<th>등록일</th>
									<td colspan="2">
										<input type="text" class="inp01 datepicker" id="stdrDeBegin" name="stdrDeBegin" maxlength="0" style="width: calc( 40% - 25px );"/>
										<span style="float:left;padding: 8px;vertical-align: middle;"> ~ </span>
										<input type="text" class="inp01 datepicker" id="stdrDeEnd" name="stdrDeEnd" maxlength="0" style="width: calc( 40% - 25px );"/>
									</td>   
									<td colspan="1">
										<button type="button" class="btncolor1" id="btnOneMonth" style="height: 33px !important;border: 1px solid #e5e8ed;background: white;padding: 5px;margin-left: 5px;margin-top: 5px;">1개월</button>
										<button type="button" class="btncolor1" id="btnThreeMonth" style="height: 33px !important;border: 1px solid #e5e8ed;background: white;padding: 5px;margin-left: 5px;margin-top: 5px;">3개월</button>
										<button type="button" class="btncolor1" id="btnSixMonth" style="height: 33px !important;border: 1px solid #e5e8ed;background: white;padding: 5px;margin-left: 5px;margin-top: 5px;">6개월</button>
									</td>
								<th>구매일자</th>
									<td colspan="2">
										<input type="text" class="inp01 datepicker" id="stBuyDt" name="stBuyDt" maxlength="0" style="width: calc( 40% - 25px );"/>
										<span style="float:left;padding: 8px;vertical-align: middle;"> ~ </span>
										<input type="text" class="inp01 datepicker" id="enBuyDt" name="enBuyDt" maxlength="0" style="width: calc( 40% - 25px );"/>
									</td>   
									<td colspan="1">
										<button type="button" class="btncolor2" id="btnOneMonth2" style="height: 33px !important;border: 1px solid #e5e8ed;background: white;padding: 5px;margin-left: 5px;margin-top: 5px;">1개월</button>
										<button type="button" class="btncolor2" id="btnThreeMonth2" style="height: 33px !important;border: 1px solid #e5e8ed;background: white;padding: 5px;margin-left: 5px;margin-top: 5px;">3개월</button>
										<button type="button" class="btncolor2" id="btnSixMonth2" style="height: 33px !important;border: 1px solid #e5e8ed;background: white;padding: 5px;margin-left: 5px;margin-top: 5px;">6개월</button>
									</td>
							</tr>
							<tr> 
								<th>제목</th>
									<td colspan="3">
										<div class="inpSearch">
											<input type="text" class="inp" id="srchTitle" name="srchTitle"/>
										</div>
									</td>
								<th>작성자</th>
									<td colspan="3">
										<div class="inpSearch">
											<input type="text" class="inp" id="srchRegId" name="srchRegId"/>
										</div>
									</td>
							</tr>
								<tr>
									<th>유형</th>
										<td>
											<div class="inpSearch">
												<input class="select" id="srchTransTy" name="srchTransTy"/>
											</div>
										</td>
									<th>거래여부</th>
										<td>
											<div class="inpSearch">
												<input class="select" id="srchEndYn" name="srchEndYn"/>
											</div>
										</td>
									<th>단말기 통신사</th>
										<td>
											<div class="inpSearch">
												<input class="select" id="srchTelecom" name="srchTelecom"/>
											</div>
										</td>
									<th></th>
										<td>
											<div class="inpSearch">
												<a href="javascript:void(0)" class="btype02" id="btnApply">
													<img src="@/assets/images/ops/ico_search01.png" alt="검색"/>
												</a>
											</div>
										</td>
									</tr>
						</table>
					</div>
				</form>   
			</div>
			<div class="contBox">
				<div class="btnBox">
					<a id="openPopup" href="javascript:void(0)" class="btn01">등 록</a>
				</div>
				<table id="grid">
					<colgroup>
						<col width="7%" />
						<col width="7%" />
						<col width="7%" />
						<col width="10%" />
						<col width="7%" />
						<col width="30%" />
						<col width="10%" />
						<col width="8%" />
						<col width="7%" />
						<col width="7%" />
					</colgroup>
					<thead>
						<tr>
							<th v-for="(list, i) in ListNm" :key="i">{{ list }}</th>
						</tr>
					</thead>
					<tbody id="grid-body">
						<tr>
							<td colspan="12"></td>
						</tr>
					</tbody>
				</table>
				
				<script id="rowTemplate" type="text/x-kendo-tmpl">
					<tr data-uid="#: ntceNo #">
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</script>
			</div>
		</div><!-- container end -->
  </div>
</template>

<script>
import '@/assets/opscss/default.css'
import '@/assets/opscss/common.css'
import '@/assets/opscss/custom.css'
// import $ from 'jquery'
// import nvl from 'nvl'
// import marketJS from './market.js'

export default {
  name:'MarkerView',
  components: {},
  data() {
    return {
			ListNm: ['글번호', '유형', '단말기 통신사', '구매일자', '가격', '제목', '작성자', '등록일시', '거래여부', '조회수']
    }
  },
  mounted() {},
  methods: {}
}
</script>

