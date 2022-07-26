 (function (W, D, $) {
  // bjlee, IE 10 부터 지원하는 strict mode 선언. 안전하지 않은 액션들에 대해 예외를 발생시킴
  'use strict';

  W.$report = W.$report || {};

  var arg  = {};
  var dsStatusList = null; // 상태
  var telecom  = null;   // 단말기 통신사
  var market_ty_cd  = null;   // 중고거래 유형
  var market_complete_cd  = null;   // 중고거래 완료여부
  var updateData = null; // 업데이트용 데이타 (선택한 글)

  $(document).ready(function() {
      $report.ui.pageLoad();
      $report.ui.insertPopLoad();
      
      $report.ui.carRegSearch();
      $report.event.setUIEvent();
      $report.event.setUIEnter();
  });


  // jQuery custom function
  // 라이브러리를 사용하는 외부에서 접근할 수 있도록(전역함수) encapsulation
  // 객체 메소드는 jQuery.fn($.fn)으로 정의하여 사용함. jQuery.prototype 의 별칭
  $report.ui = {

      // 고장불편신고 목록
      reportList : [],

      // 검색한 그리드 데이터 목록
      dataList : [],
      /**
       *
       * @description  : 최초 페이지 로드 시 코드 데이터 로드
       */
      pageLoad : function() {
          // 대분류
          getCodeData('TELECOM_CD', function(data) {
              if (data != null) { 
                  telecom = data.result; 
                  getCodeData('MARKET_TY_CD', function(data) {
                      if (data != null) { 
                          market_ty_cd = data.result; 
                          getCodeData('MARKET_COMPLETE_CD', function(data) {
                              if (data != null) { 
                                  market_complete_cd = data.result; 
                                  $report.ui.dataLoad();
                              }
                          });
                      }
                  });
              }
          });
      },
      
      /**
       * @description  : 코드 데이터 로드 후 UI 적용
       */
      dataLoad : function() {
          // 통신사
          $('#srchTelecom').kendoDropDownList({
              dataSource : telecom,
              autoWidth: true,
              optionLabel: "전체",
              dataTextField: "cdNm",
              dataValueField: "cdId"
          }),

          // 판매여부
          $("#srchEndYn").kendoDropDownList({
              dataSource: market_complete_cd,
              dataTextField:  "cdNm",
              dataValueField: "cdId",
              optionLabel:    "전체",
          });
          
          $("#srchTransTy").kendoDropDownList({
              dataSource: market_ty_cd,
              dataTextField:  "cdNm",
              dataValueField: "cdId",
              optionLabel:    "전체",
          });
          
          // 조회조건 날짜 기본값 세팅
          var srchDtEnd = new Date();
          $('#stdrDeEnd').data("kendoDatePicker").value(srchDtEnd);
          
          var srchDtSt = new Date();
          srchDtSt.setMonth(srchDtSt.getMonth() - 1);
          $('#stdrDeBegin').data("kendoDatePicker").value(srchDtSt);

          // 조회일자 조건 검증
          $('#stdrDeBegin').on('change', function(){
              var stDt = $(this).val();
              var enDt = $('#stdrDeEnd').val();
              if (stDt == '' || enDt == '') {
              } else if(enDt < stDt) {
                  alert("시작일자는 종료일자보다 이후 일 수 없습니다.");
                  $(this).val('');
              }
          });
          
          $('#stdrDeEnd').on('change', function(){
              var enDt = $(this).val();
              var stDt = $('#stdrDeBegin').val();
              if (enDt == '' || stDt == '') {
              } else if(stDt > enDt) {
                  alert("종료일자는 시작일자보다 이전 일 수 없습니다.");
                  $(this).val('');
              }
          });

          $('#dialogDetail').kendoDialog({
              width: "700px",
              title: "상세 내역",
              closable: true,
              visible: false,
              modal: true
          });
          
          $('#dialogDetailUpdate').kendoDialog({
              width: "700px",
              title: "수정",
              closable: true,
              visible: false,
              modal: true
          });
              
          // 그리드 조회
          $("#grid").kendoGrid({
              dataSource: {
                  data: null,
                  transport: {
                      read:{
                          dataType: "json",
                          contentType: "application/json; charset=utf-8",

                          //쿼리부분 그리드목록
                          url: contextPath+'/os/market/listView',
                          type: "POST",
                          beforeSend: function(xhr) {
                              xhr.setRequestHeader($("meta[name='_csrf_header']").attr("content"), $("meta[name='_csrf']").attr("content"));
                          }
                      },
                      parameterMap: function(data, type){
                          var param = fn_getFormData($("#searchForm"), data);
                          
                          return JSON.stringify(param);
                      }
                  },
                  schema: {
                      data: "data",
                      total: "total",
                  },
                  pageSize: 10,
                  serverPaging: true,
                  change: function(e) {
                  }
              },
              noRecords: {
                  template: "데이터가 없습니다."
              },
              pageable: {
                  pageSize: 10,
                  serverPaging: true,
                  pageSizes: [5, 10, 20],
                  buttonCount: 5
              },
              navigatable: true,
              selectable: "row",
              change: $report.ui.rowClickEvent,
              rowTemplate: kendo.template($("#rowTemplate").html()),
              editable    : false,
              resizable   : false,
          });
          
          $(window).resize(function(){
              $("#grid").data("kendoGrid").resize();
          });
          
          $report.ui.startPopLoad();
      },
      
      rowClickEvent : function(arg){

          var asNo;
          var data = {};

          $.map(this.select(), function(item){
              asNo = $(item).data('uid');
              data.asNo = asNo; 
              item.lastElementChild.innerText = Number(item.lastElementChild.textContent) + 1 // 클릭할 때 조회수 올림
          });

          ajax(false, contextPath+'/os/market/detailView', 'body', '처리중입니다.', data, function (data) {
              if (data != null) {
                      $report.ui.detailPopLoad(data);
              } else {
                  alert("상세 정보를 수신할 수 없습니다.");
              }
          });

      },

      detailPopLoad : function(data){
          updateData = data;
          var dialog = $('#dialogDetail');
          $(dialog).empty();
          var dialoaCont = "";
          if (data[0].editor == 'O') {
              dialoaCont += '<button id="usedDelete" style="float:right; padding: 10px; margin: 0px; margin: 5px;">글삭제</button>';
              $("#dialogDetail").css("padding-top", "0px");
              if (data[0].endYn == '거래중') {
                  dialoaCont += '<button id="usedUpdate" style="float:right; padding: 10px; margin: 0px; margin: 5px;">글수정</button>';
                  dialoaCont += '<button id="usedComplete" style="float:right; padding: 10px; margin: 0px; margin: 5px;">거래완료</button>';
              }
          } else {
              $("#dialogDetail").css("padding-top", "14px");
          }
          dialoaCont += '<table class="wTable ">';
          dialoaCont += '<colgroup><col width="110" /><col width="" /><col width="110" /><col width="" /></colgroup><input type="hidden" id="choiceNtceNo" value="'+data[0].ntceNo+'"/>';
          dialoaCont += '<tr>';
          dialoaCont += '<th>글번호</th><td>'+data[0].ntceNo+'</td><th>작성자</th><td>'+data[0].regId+'</td>'
          dialoaCont += '</tr><tr>';
          dialoaCont += '<tr>';
          dialoaCont += '<th>등록일시</th><td>'+data[0].regDt+'</td><th>수정일시</th><td>'+data[0].updDt+'</td>'
          dialoaCont += '</tr><tr>';
          dialoaCont += '<tr>';
          dialoaCont += '<th>거래여부</th><td>'+data[0].endYn+'</td><th>조회수</th><td>'+data[0].inqireCo+'</td>'
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>유형</th>';
          dialoaCont += '<td colspan="3">';
          dialoaCont += data[0].transTy==null?"":data[0].transTy;
          dialoaCont += '</td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>단말기 통신사</th>';
          dialoaCont += '<td colspan="3">';
          dialoaCont += data[0].telecom==null?"":data[0].telecom;
          dialoaCont += '</td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>구매일자</th>';
          dialoaCont += '<td colspan="3">';
          dialoaCont += data[0].buyDt==null?"":data[0].buyDt;
          dialoaCont += '</td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>가격</th>';
          dialoaCont += '<td colspan="3">';
          dialoaCont += data[0].price==null?"":data[0].price;
          dialoaCont += '</td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>연락처</th>';
          dialoaCont += '<td colspan="3">';
          dialoaCont += data[0].telno==null?"":data[0].telno;
          dialoaCont += '</td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>제목</th>';
          dialoaCont += '<td colspan="3">';
          dialoaCont += data[0].title==null?"":data[0].title;
          dialoaCont += '</td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>내용</th>';
          dialoaCont += '<td colspan="3">';
          dialoaCont += data[0].cn==null?"":data[0].cn;
    dialoaCont += '</td>';
          dialoaCont += '</tr><tr>';
    dialoaCont += '<th>첨부파일</th>';
        dialoaCont += '<td colspan="3">';
      if(data[0].atchFileSn1==null){
        dialoaCont += '<span class="t01" id="file-name1">파일없음</span>';
      }else{
        dialoaCont += '<a href="javascript:fileDownload(\'' + data[0].atchFileSn1 + '\',\'' + data[0].atchFileNm1 + '\')" id="file1">';
        dialoaCont += '<span class="t01" id="file-name1">';
        dialoaCont += data[0].atchFileSn1==null?"파일없음":data[0].atchFileRm1;
        dialoaCont += '</span>';
              dialoaCont += '</a>';
      }
          dialoaCont += '</td>';
          dialoaCont += '</tr>';
          dialoaCont += '</table>';
          
          // 덧글부분
          dialoaCont += '<p style="padding-top: 15px;">덧글</p>';
          dialoaCont += '<div style="max-height:300px; overflow: auto;"><table class="wTable">';
          dialoaCont += '<colgroup><col width="110" /><col width="" /><col width="110" /><col width="130" /></colgroup>';
          dialoaCont += '<tr>';
          dialoaCont += '<th style="text-align:center;padding-left:0px;">작성자</th>';
          dialoaCont += '<th colspan="2" style="text-align:center;padding-left:0px;">';
          dialoaCont += '내용';
          dialoaCont += '</th>';
          dialoaCont += '<th style="text-align:center;padding-left:0px;">작성일시</th>';
          dialoaCont += '</tr>';
          
          if (data[1].detailReplay.length != 0) {
              data[1].detailReplay.forEach(function(item) {
                  dialoaCont += '<tr>';
                  dialoaCont += '<td style="text-align: center;">'+item.regId+'</td>';
                  dialoaCont += '<td colspan="2" style="text-align: left;">'+item.cn;
                  if (item.editor == 'O') {
                      dialoaCont += '　<button style="color:red;" id="replyDelete" data-sn="'+item.sn+'">x</button>'
                  }
                  dialoaCont += '</td>';
                  dialoaCont += '<td style="text-align: center;">'+item.regDt+'</td>';
                  dialoaCont += '</tr>';
              });
          } else {
              dialoaCont += '<td colspan="4" style="text-align: center;">등록된 덧글이 없습니다.</td>';
          }
          
          dialoaCont += '<tr>';
          dialoaCont += '<th style="padding: 0px; text-align: center;">덧글작성</th>';
          dialoaCont += '<th colspan="2" style="padding: 1px;"><input type="textarea" id="replyCn" style="padding: 10px; width: 94%;"/></th>';
          dialoaCont += '<th style="padding: 0px; text-align: center;"><button type="button" id="replyInsert" style="width: 98%; height: 95%;">등록</button></th>';
          dialoaCont += '</tr>';
          dialoaCont += '</table></div>';
          
          $("#dialogDetail").html(dialoaCont);

          var popupAdd = $("#dialogDetail").data('kendoDialog');
          popupAdd.center();
          popupAdd.open();

          $(document).on('click','#file_name1',function(){
              if (result.atchFileSn1 != null && result.atchFileSn1 != ""&& result.saveFileNm1 != null && result.saveFileNm1 != "") {
                  fileDownload(result.atchFileSn1, result.saveFileNm1);
              }
          })
          $(document).on('click','#file_name2',function(){
              if (result.atchFileSn2 != null && result.atchFileSn2 != ""&& result.saveFileNm2 != null && result.saveFileNm2 != "") {
                  fileDownload(result.atchFileSn2, result.saveFileNm2);
              }
          })
          $(document).on('click','#file_name3',function(){
              if (result.atchFileSn3 != null && result.atchFileSn3 != ""&& result.saveFileNm3 != null && result.saveFileNm3 != "") {
                  fileDownload(result.atchFileSn3, result.saveFileNm3);
              }
          })
          $(document).on("click", "#closeBtDetail", function() {
              dialog.data("kendoDialog").close();
          });
      },
      
      // 글 수정
      detailPopLoadUpdate : function(data){
          var dialog = $('#dialogDetailUpdate');
          
          var dialoaCont = "";
          dialoaCont += '<table class="wTable ">';
          dialoaCont += '<colgroup><col width="110" /><col width="" /><col width="110" /><col width="" /></colgroup>';
          dialoaCont += '<tr>';
          dialoaCont += '<th>글번호</th><td>'+updateData[0].ntceNo+'</td><th>작성자</th><td>'+updateData[0].regId+'</td>'
          dialoaCont += '</tr><tr>';
          dialoaCont += '<td style="display: none;"><input type="hidden" id="updateNtceNo" name="updateNtceNo" value="'+updateData[0].ntceNo+'"></td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>유형</th>';
          dialoaCont += '<td colspan="3" style="vertical-align: middle;"><div class="inpSearch" style="height:auto; margin:5px;">';
          if (updateData[0].transTy == '삽니다') {
              dialoaCont += '<input type="radio" name="updateTransTy" value="SELL"/>팝니다　';
              dialoaCont += '<input type="radio" name="updateTransTy" value="BUY" checked/>삽니다';
          } else {
              dialoaCont += '<input type="radio" name="updateTransTy" value="SELL" checked/>팝니다　';
              dialoaCont += '<input type="radio" name="updateTransTy" value="BUY"/>삽니다';
          }
          dialoaCont += '</div></td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>단말기 통신사</th>';
          dialoaCont += '<td colspan="3"><div class="inpSearch">';
          dialoaCont += '<input class="select" id="updateTelecom" name="updateTelecom" />';
          dialoaCont += '</div></td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>구매일자</th>';
          dialoaCont += '<td colspan="3"><input type="text" class="inp datepicker ndate" id="updateBuyDt" name="updateBuyDt" maxlength="0" style="width: calc(96%);"/></td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>가격</th>';
          dialoaCont += '<td colspan="3"><input type="text" class="inp" id="updatePrice" name="updatePrice" value="'+updateData[0].price+'" maxlength="9" /></td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>연락처</th>';
          dialoaCont += '<td colspan="3"><input type="text" class="inp" id="updateTelno" name="updateTelno" value="'+updateData[0].telno+'" maxlength="60" /></td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>제목</th>';
          dialoaCont += '<td colspan="3"><input type="text" class="inp" id="updateTitle" name="updateTitle" value="'+updateData[0].title+'" maxlength="80" /></td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>내용</th>';
          dialoaCont += '<td colspan="3"><textarea style="height: 82px; margin-top: 5px; margin-bottom: 5px; resize: none; padding: 10px;" class="inp" id="updateCn" name="updateCn" maxlength="1300" >'+updateData[0].cn+'</textarea></td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>첨부파일</th>';
          dialoaCont += '<td colspan="3">';
          dialoaCont += '<div class="inpSearch">';
          dialoaCont += '<input type="text" class="inp filetype" disabled="disabled"  style="border: none;"/>';
          dialoaCont += '<a href="javascript:void(0)"><label for="file1" class="btnFile"><img src="' + contextPath + '/images/ico/ico_search01.png" /></a>';
          dialoaCont += '<input type="file" id="file1" name="file1" class="upload-hidden" style="display: none;" />';
          dialoaCont += '</div>';
          dialoaCont += '</td>';
          dialoaCont += '</tr><tr>';
          dialoaCont += '<th>기존첨부파일</th>';
          dialoaCont += '<td colspan="3">';
    dialoaCont += '<span class="t01">';
    dialoaCont += updateData[0].atchFileSn1==null?"파일없음":updateData[0].atchFileRm1;
    dialoaCont += '</span>';
          dialoaCont += '</td>';
          dialoaCont += '</tr>';
          dialoaCont += '</table>';
          
          $("#dialogDetailUpdate2").html(dialoaCont);
          
          // 통신사
          $("#updateTelecom").kendoDropDownList({
              dataSource: telecom,
              dataTextField:  "cdNm",
              dataValueField: "cdId",
              optionLabel:    "선택안함"
          });
          var dropdownlist = $("#updateTelecom").data("kendoDropDownList");
          dropdownlist.select(function(dataItem) {
              return dataItem.cdNm === updateData[0].telecom;
          });
          
          // 구매일자
          $("#updateBuyDt").kendoDatePicker();
          var datepicker = $("#updateBuyDt").data("kendoDatePicker");
          datepicker.value(updateData[0].buyDt);

          var popupAdd = $("#dialogDetailUpdate").data('kendoDialog');
          popupAdd.center();
          popupAdd.open();

      },
      
      /**
       * @description  : 검색한 결과 데이터 그리드에 반영
       */
      search : function() {
          var grid = $('#grid').data('kendoGrid');
          grid.dataSource.page(1);
      },
      
      search2 : function() {
          var grid = $('#carRegList').data('kendoGrid');
          grid.dataSource.page(1);
      },
      /*
       * 등록 팝업(수정)
       * */

      insertPopLoad : function() {
          var dialog = $('#dialog');
          dialog.kendoDialog({
              width: "700px",
              title: "등록",
              visible: false,
              closable: true,
              modal: true,
              close: function (e) {
              }
          })
          
          $(document).on('click','#openPopup',function() {
              $("#insertTransTy").val("");
              $("#insertTelecom").val("");
              $("#insertBuyDt").val("");
              $("#insertPrice").val("");
              $("#insertTelno").val("");
              $("#insertTitle").val("");
              $("#insertCn").val("");

              var popupAdd = $("#dialog").data('kendoDialog');
              popupAdd.center();
              popupAdd.open();
          });
      },
      
      startPopLoad : function() {
          var temp = '';

          var chDCont='<colgroup><col width="110" /><col width="" /><col width="110" /><col width="" /></colgroup>';

          chDCont += '<tr>';
          chDCont += '<th>유형</th>';
          chDCont += '<td colspan="3" style="vertical-align: middle;"><div class="inpSearch" style="height:auto; margin:5px;">';
          chDCont += '<input type="radio" name="insertTransTy" value="SELL"/>팝니다　';
          chDCont += '<input type="radio" name="insertTransTy" value="BUY"/>삽니다';
          chDCont += '</div></td>';
          chDCont += '</tr><tr>';
          chDCont += '<th>단말기 통신사</th>';
          chDCont += '<td colspan="3"><div class="inpSearch">';
          chDCont += '<input class="select" id="insertTelecom" name="insertTelecom"/>';
          chDCont += '</div></td>';
          chDCont += '</tr><tr>';
          chDCont += '<th>구매일자</th>';
          chDCont += '<td colspan="3"><input type="text" class="inp datepicker ndate" id="insertBuyDt" name="insertBuyDt" maxlength="0" style="width: calc(99%);"/></td>';
          chDCont += '</tr><tr>';
          chDCont += '<th>가격</th>';
          chDCont += '<td colspan="3"><input type="text" class="inp" id="insertPrice" name="insertPrice" maxlength="9" /></td>';
          chDCont += '</tr><tr>';
          chDCont += '<th>연락처</th>';
          chDCont += '<td colspan="3"><input type="text" class="inp" id="insertTelno" name="insertTelno" maxlength="60" /></td>';
          chDCont += '</tr><tr>';
          chDCont += '<th>제목</th>';
          chDCont += '<td colspan="3"><input type="text" class="inp" id="insertTitle" name="insertTitle" maxlength="80" /></td>';
          chDCont += '</tr><tr>';
          chDCont += '<th>내용</th>';
          chDCont += '<td colspan="3"><textarea style="height: 82px; margin-top: 5px; margin-bottom: 5px; resize: none; padding: 10px;" class="inp" id="insertCn" name="insertCn" maxlength="1300" /></td>';
          chDCont += '</tr><tr>';
          chDCont += '<th>첨부파일</th>';
          chDCont += '<td colspan="3">';
          chDCont += '<div class="inpSearch">';
          chDCont += '<input type="text" class="inp filetype" disabled="disabled" style="border: none;"/>';
          chDCont += '<a href="javascript:void(0)"><label for="file1" class="btnFile"><img src="' + contextPath + '/images/ico/ico_search01.png" /></a>';
          chDCont += '<input type="file" id="file1" name="file1" class="upload-hidden" style="display: none;" />';
          chDCont += '</div>';
          chDCont += '</td>';
    chDCont += '</tr>';
          
          $('#chContent').html(chDCont);

          // 통신사 드롭박스 초기화
          $("#insertTelecom").kendoDropDownList({
              dataSource: telecom,
              dataTextField:  "cdNm",
              dataValueField: "cdId",
              optionLabel:    "선택안함"
          });
          
          $('#insertBuyDt').kendoDatePicker();
          
          $(document).on("click", "#carRegSearch", function() {
              var popupAdd = $("#carsearch").data('kendoDialog');
              popupAdd.center();
              popupAdd.open();
          });
      },

      closePopupDialog : function () {
          var dialog = $('#dialog');
          dialog.data("kendoDialog").close();
          $('#file1').val("");
          $('#file2').val("");
          $('#file3').val("");
      },
      
      // 글 수정 취소
      closeDialogDetailUpdate : function () {
          var dialog = $('#dialogDetailUpdate');
          dialog.data("kendoDialog").close();
          var dialog = $('#dialogDetail');
          dialog.data("kendoDialog").open();
      },


      /**
       * @description  : 차량정보 검색
       */
      carRegSearch : function() {
          var dialog = $('#carsearch');

          dialog.kendoDialog({
              width: "650px",
              //타이틀명 확인
              title: "차량검색",
              closable: true,
              visible: false,
              modal: true,
              content: function(e){
              },
              close: function(e){
              }
          });
      },
  };

  //이벤트 정의
  $report.event = {
  
      /**
       * @description  : 엑셀 업로드 팝업창 핸들러
       */
      btnExcelDown : function() {
          $("#searchForm").attr("action", contextPath + "/os/report/excelView").submit();
      },
          
      /**
       * @description  : 초기 이벤트 세팅
       */
      setUIEnter: function () {
          
          // 거래게시판 거래완료 처리
          $(document).on("click", "#usedComplete", function(e) {
              var choiceNtceNo = $("#choiceNtceNo").val(); // 선택한 글 번호
              if(confirm("거래완료를 하시면 수정이 불가능해집니다. \n거래완료처리 하시겠습니까?")) {
                  var params = {};
                  params.asNo = choiceNtceNo;
                  ajax(true, contextPath + '/os/market/updateComplete', 'body', '거래완료처리 중입니다.', params, function(data) {
                      if (data != null) {
                          
                          var data = {};
                          data.asNo = choiceNtceNo;
                          data.reply = '1';
              
                          ajax(false, contextPath+'/os/market/detailView', 'body', '처리중입니다.', data, function (data) {
                              if (data != null) {
                                      $report.ui.detailPopLoad(data);
                              } else {
                                  alert("상세 정보를 수신할 수 없습니다.");
                              }
                          });
                          
                          alert("처리완료.");
                      }
                  });
              }
          });
          
          // 거래게시판 글 수정
          $(document).on("click", "#usedUpdate", function(e) {
              var dialog = $('#dialogDetail');
              dialog.data("kendoDialog").close();
              
              $report.ui.detailPopLoadUpdate();
              
          });
          
          $(document).on("click", "#usedDelete", function(e) {
              if (confirm("게시글을 삭제하시겠습니까?")) {
                  var choiceNtceNo = $("#choiceNtceNo").val(); // 선택한 글 번호
                  var params = {};
                  params.ntceNo = choiceNtceNo;
                  ajax(true, contextPath + '/os/market/deleteUsed', 'body', '삭제중입니다.', params, function(data) {
                      if (data != null) {
                          
                          var dialog = $('#dialogDetail');
                          dialog.data("kendoDialog").close();
                          $("#grid").data("kendoGrid").dataSource.read();
                          
                          alert("삭제완료.");
                      }
                  });
              }
          });
          
          $(document).on("click", "#replyDelete", function(e) {
              if (confirm("덧글을 삭제하시겠습니까?")) {
                  var choiceNtceNo = $("#choiceNtceNo").val(); // 선택한 글 번호
                  var choiceReplyNo = e.currentTarget.dataset.sn; // 선택한 덧글 번호
                  var params = {};
                  params.ntceNo = choiceNtceNo;
                  params.sn = choiceReplyNo;
                  ajax(true, contextPath + '/os/market/deleteReply', 'body', '삭제중입니다.', params, function(data) {
                      if (data != null) {
                          
                          var data = {};
                          data.asNo = choiceNtceNo;
                          data.reply = '1';
              
                          ajax(false, contextPath+'/os/market/detailView', 'body', '처리중입니다.', data, function (data) {
                              if (data != null) {
                                      $report.ui.detailPopLoad(data);
                              } else {
                                  alert("상세 정보를 수신할 수 없습니다.");
                              }
                          });
                          
                          alert("삭제완료.");
                      }
                  });
              }
          });
          
          $(document).on('click', '#replyInsert', function() {
             var choiceNtceNo = $("#choiceNtceNo").val(); // 선택한 글번호
             var replyCn = $("#replyCn").val(); // 덧글 내용
             if (replyCn == null || replyCn == '') {
                  alert("내용을 입력해 주세요.");
                  return;
             }
             var params = {};
             params.ntceNo = choiceNtceNo;
             params.cn = replyCn;
             ajax(true, contextPath + '/os/market/insertReply', 'body', '저장중입니다.', params, function(data) {
                  
                  var data = {};
                  data.asNo = choiceNtceNo;
                  data.reply = '1';
      
                  ajax(false, contextPath+'/os/market/detailView', 'body', '처리중입니다.', data, function (data) {
                      if (data != null) {
                              $report.ui.detailPopLoad(data);
                      } else {
                          alert("상세 정보를 수신할 수 없습니다.");
                      }
                  });
                  
                  alert("덧글 등록완료");
                  
             });
          });

    // 1, 3, 6개월 버튼 컬러 이벤트 추가. 2022/05/29
    $(document).on("click", ".btncolor1", function(e) {
      function clearColor(){
        [...$(".btncolor1")].forEach(item => {
          item.style.backgroundColor="inherit";
        })
      }
      clearColor();
      e.target.style.backgroundColor="salmon";
    });
    $(document).on("click", ".btncolor2", function(e) {
      function clearColor(){
        [...$(".btncolor2")].forEach(item => {
          item.style.backgroundColor="inherit";
        })
      }
      clearColor();
      e.target.style.backgroundColor="salmon";
    });
    
    // 1, 3, 6개월 클릭 이벤트
    // 2월달 일수에 따른 검색 오류 수정(일괄 28일 지정). 2022/05/30
    $(document).on("click", "#btnOneMonth", function() {
      var date = new Date();
      
      // 종료일 (오늘)
      date.setMonth(date.getMonth()+1);
      var getDate = date.getDate();
      var getMonth = date.getMonth();
      var getYear = date.getFullYear();
      
      var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
      var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
      
      var endDay = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
      
      // 시작일
      date.setMonth(date.getMonth()-1);
      var getDate = date.getDate();
      var getMonth = date.getMonth();
      var getYear = date.getFullYear();
      
      if(getMonth == 2){
        getDate = 28;
      }
      
      var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
      var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
      
      var oneMonth = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
      
      
      $("#stdrDeBegin").val(oneMonth);
      $("#stdrDeEnd").val(endDay);
    });
    $(document).on("click", "#btnThreeMonth", function() {
      var date = new Date();
      
      // 종료일 (오늘)
      date.setMonth(date.getMonth()+1);
      var getDate = date.getDate();
      var getMonth = date.getMonth();
      var getYear = date.getFullYear();
      
      var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
      var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
      
      var endDay = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
      
      // 시작일
      date.setMonth(date.getMonth()-3);
      var getDate = date.getDate();
      var getMonth = date.getMonth();
      var getYear = date.getFullYear();
      
      if(getMonth == 2){
        getDate = 28;
      }
      
      var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
      var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
      
      var oneMonth = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
      
      $("#stdrDeBegin").val(oneMonth);
      $("#stdrDeEnd").val(endDay);
    });
    $(document).on("click", "#btnSixMonth", function() {
      var date = new Date();
      
      // 종료일 (오늘)
      date.setMonth(date.getMonth()+1);
      var getDate = date.getDate();
      var getMonth = date.getMonth();
      var getYear = date.getFullYear();
      
      var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
      var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
      
      var endDay = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
      
      // 시작일
      date.setMonth(date.getMonth()-6);
      var getDate = date.getDate();
      var getMonth = date.getMonth();
      var getYear = date.getFullYear();
      
      if(getMonth == 2){
        getDate = 28;
      }
      
      var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
      var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
      
      var oneMonth = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
      
      $("#stdrDeBegin").val(oneMonth);
      $("#stdrDeEnd").val(endDay);
    });
    
          // 구매일자 1,3,6 개월 버튼
          $(document).on("click", "#btnOneMonth2", function() {
              var date = new Date();
              
              // 종료일 (오늘)
              date.setMonth(date.getMonth()+1);
              var getDate = date.getDate();
              var getMonth = date.getMonth();
              var getYear = date.getFullYear();
              
              var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
              var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
              
              var endDay = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
              
              // 시작일
              date.setMonth(date.getMonth()-1);
              var getDate = date.getDate();
              var getMonth = date.getMonth();
              var getYear = date.getFullYear();
              
              var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
              var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
              
              var oneMonth = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
              $("#stBuyDt").val(oneMonth);
              $("#enBuyDt").val(endDay);
          });
          $(document).on("click", "#btnThreeMonth2", function() {
              var date = new Date();
              
              // 종료일 (오늘)
              date.setMonth(date.getMonth()+1);
              var getDate = date.getDate();
              var getMonth = date.getMonth();
              var getYear = date.getFullYear();
              
              var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
              var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
              
              var endDay = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
              
              // 시작일
              date.setMonth(date.getMonth()-3);
              var getDate = date.getDate();
              var getMonth = date.getMonth();
              var getYear = date.getFullYear();
              
              var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
              var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
              
              var oneMonth = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
              
              $("#stBuyDt").val(oneMonth);
              $("#enBuyDt").val(endDay);
          });
          $(document).on("click", "#btnSixMonth2", function() {
              var date = new Date();
              
              // 종료일 (오늘)
              date.setMonth(date.getMonth()+1);
              var getDate = date.getDate();
              var getMonth = date.getMonth();
              var getYear = date.getFullYear();
              
              var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
              var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
              
              var endDay = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
              
              // 시작일
              date.setMonth(date.getMonth()-6);
              var getDate = date.getDate();
              var getMonth = date.getMonth();
              var getYear = date.getFullYear();
              
              var zeroAddDate = getDate < 10 ? "0" + getDate : getDate; 
              var zeroAddMonth = getMonth < 10 ? "0" + getMonth : getMonth; 
              
              var oneMonth = getYear + "-" + zeroAddMonth + "-" + zeroAddDate;
              
              $("#stBuyDt").val(oneMonth);
              $("#enBuyDt").val(endDay);
          });
    
          $('#popSrchCarRegNo :input').on('keydown', function (e) {
              if (e.which == 13 || e.keyCode == 13) {
                  $report.ui.search2();
              }
          });
          
          $('#btnExcelDown').on('click', $report.event.btnExcelDown);  // 엑셀 다운로드

          $(document).on("change", "#file1", function(e){
              var ext = $("#file1").val().split(".").pop().toLowerCase();
      var filev = $("#file1").val();
              if(ext.length > 0){
                  var valickExt = ["zip","hwp","doc","docx","ppt","pptx","xls","xlsx","txt","bmp","jpg","jpeg","gif","png"]; // 파일가능 확장자
                  if($.inArray(ext, valickExt) == -1) {
                      alert("첨부할 수 없는 파일입니다.");
                      $("#file1").val("");
                      $("#file1").parent().find(".filetype").val("");
                      return false;
                  }
              }
      console.log(filev);
              $(".filetype").val($("#file1").val());
          });
      },
      
      /**
       * @description  : UI에서 사용하는 이벤트 및 초기설정을 수행한다.
       */
      setUIEvent : function() {

          $("#btnApply").on("click", function(){
              $report.event.btnApplyClickHandler();
          });
          $("#btnApply2").on("click", function(){
              $report.ui.search2();
          });
      },

      /**
       * @description  : 거래게시판 등록 메서드
       */
      insertCode : function() {
          
          var param = fn_getFormData($("#insertForm"));
          param.insertBuyDt = param.insertBuyDt.replaceAll("-", "");

          $report.event.paramVerification(param);
      },
      
      /**
       * @description  : 유효성 검증
       */
      paramVerification : function(params) {
          if(params.insertTransTy == '' || params.insertTransTy == null){
                  alert("유형을 선택하세요.");
                  return
          }
          if(params.insertPrice == '' || params.insertPrice == null){
                  alert("가격을 입력하세요.");
                  return
          }
          if(params.insertTelno == '' || params.insertTelno == null){
                  alert("연락처를 입력하세요.");
                  return
          }
          if(params.insertTitle == '' || params.insertTitle == null){
                  alert("제목을 입력하세요.");
                  return
          }
          if (params.insertCn == '' || params.insertCn == null) {
              alert("내용을 입력해주세요.");
              return
          } else {
              var flagIncl = false;
              var pJumin = /(\d{6}[ ,-]-?[1-4]\d{6})|(\d{6}[ ,-]?[1-4])/;
              var pCert  = /(\d{2}-\d{2}-\d{6}-\d{2})/;
              var pTelNum = /(\d{2,3}[ ,-]-?\d{2,4}[ ,-]-?\d{4})/;
              var pAddr = /((([가-힣]+(\d{1,5}|\d{1,5}(,|.)\d{1,5})+(읍|면|동|가|리))(^구|)((\d{1,5}(~|-)\d{1,5}|\d{1,5})(가|리|)|))([](산(\d{1,5}(~|-)\d{1,5}|\d{1,5}))|)|(([가-힣]|(\d{1,5}(~|-)\d{1,5})|\d{1,5})+(로|길)))/;
              var pCard = /[34569][0-9]{3}[-~.[ ]][0-9]{4}[-~.[ ]][0-9]{4}[-~.[ ]][0-9]{4}/;
              var pPort = /([a-zA-Z]{1}|[a-zA-Z]{2})\d{8}/;
              var pForg = /([01][0-9]{5}[[:space:]~-]+[1-8][0-9]{6}|[2-9][0-9]{5}[[:space:]~-]+[1256][0-9]{6})/;
            //var pAge = /(\d{0,4}(년생|월생|세|살))/;
              
              if (pJumin.test(params.cn) || pCert.test(params.cn) || pTelNum.test(params.cn) || pAddr.test(params.cn) || pCard.test(params.cn) || pPort.test(params.cn) || pForg.test(params.cn)) {
                  alert("내용에 개인식별정보(주민번호, 외국인번호, 면허번호, 여권번호, 전화번호, 주소, 카드번호)가 포함되어 있습니다.\n개인 식별정보를 제거 후 등록해주세요.");
                  return ;
              }
          }
          
          if (confirm("저장 하시겠습니까?")) {
              // 파일 전송 후 내용 저장 처리
              if(($('#file1').val() != null && $('#file1').val() != '') == true) {
                  var formData = new FormData();
                  
                  formData.append('files', document.getElementById('file1').files[0]);
                  $report.event.fileAjax(contextPath + '/file/uploadFile', formData, function (response) {
                      if (response != null && response.atchFileSn != null) {
                          params.atchFileSn1 = response.atchFileSn;
                              ajax(true, contextPath + '/os/market/insertUsed', 'body', '저장중입니다.', params, function(data) {
                                  alert('등록이 완료되었습니다.');
                                  $report.ui.closePopupDialog();
                                  $report.ui.search();
                              }, function(xhr, status) {
                                  $report.ui.closePopupDialog();
                                  $report.ui.search();
                              });
                    }
                      
                  });
              } else {
                  //첨부파일이 없으면 내용 저장 처리
                  ajax(true, contextPath + '/os/market/insertUsed', 'body', '저장중입니다.', params, function(data) {
                      alert('등록이 완료되었습니다.');
                      $report.ui.closePopupDialog();
                      $report.ui.search();
                  }, function(xhr, status) {
                      $report.ui.closePopupDialog();
                      $report.ui.search();
                  });
              }
          }
      },

      fileAjax : function(url, formData, fn_success, fn_complete){
          var loader = isLoading($('body')[0], {
              type: "overlay",
              class : "fa fa-refresh fa-spin",
              text: "파일업로드중입니다."
          });

          var token = $("meta[name='_csrf']").attr("content");
          var header = $("meta[name='_csrf_header']").attr("content");

          $.ajax({
              url : url,
              type: 'POST',
              dataType: 'json',
              data: formData,
              async: false,
              processData: false,
              contentType: false,
              beforeSend : function(xhr) {
                  loader.loading();
                  xhr.setRequestHeader(header, token);
              },
              success : function(data) {
                  if(fn_success != null || fn_success != undefined){
                      fn_success(data);
                  }else{

                  }
              },
              error : function(jxhr, textStatus) {
                  alert("처리중 에러가 발생하였습니다.");
              },
              complete : function(xhr, status) {

                  loader.remove();

                  if(fn_complete != null || fn_complete != undefined){
                      fn_complete(xhr);
                  }
              }
          });
      },

      ajax : function(isLodingBool, url, isLodingElement, beforeSendText, ajaxParam, fn_success, fn_complete) {

          var loader = isLoading($(isLodingElement)[0], {
              type: "overlay",
              class: "fa fa-refresh fa-spin",
              text: beforeSendText
          });

          var header = $("meta[name='_csrf_header']").attr("content");
          var token = $("meta[name='_csrf']").attr("content");

          $.ajax({
              url: url,
              type: 'POST',
              contentType: "application/json",
              async: false,
              data: JSON.stringify(ajaxParam),
              dataType: "json",
              beforeSend: function (xhr) {
                  xhr.setRequestHeader(header, token);

                  if (isLodingBool) {
                      loader.loading();
                  }
              },
              success: function (data) {
                  if (fn_success != null || fn_complete != undefined) {
                      fn_success(data);
                  }
              },
              error: function (xhr, textStatus) {
                  if (xhr.status == 401) {
                      alert("권한이 없습니다. 사용자 인증이 필요합니다.");
                  } else if (xhr.status == 403) {
                      alert("세션이 만료되었습니다. 다시 로그인하세요.");
                      location.href = "/";
                  } else {
                      alert("처리 중 에러가 발생하였습니다.");
                  }
              },
              complete: function (xhr, status) {

                  if (isLodingBool) {
                      loader.remove();
                  }

                  if (fn_complete != null || fn_complete != undefined) {
                      fn_complete(xhr);
                  }
              }
          });
      },
      
      /**
       * @description  : 거래게시판 글 수정
       */
       updateCode : function() {
          var param = fn_getFormData($("#updateForm"));
          param.updateBuyDt = param.updateBuyDt.replaceAll("-", "");
          $report.event.paramVerificationUpdate(param);
      },
      
      /**
       * @description  : 유효성 검증
       */
      paramVerificationUpdate : function(params) {
          if(params.updateTransTy == '' || params.updateTransTy == null){
                  alert("유형을 선택하세요.");
                  return
          }
          if(params.updatePrice == '' || params.updatePrice == null){
                  alert("가격을 입력하세요.");
                  return
          }
          if(params.updateTelno == '' || params.updateTelno == null){
                  alert("연락처를 입력하세요.");
                  return
          }
          if(params.updateTitle == '' || params.updateTitle == null){
                  alert("제목을 입력하세요.");
                  return
          }
          if (params.updateCn == '' || params.updateCn == null) {
              alert("내용을 입력해주세요.");
              return
          } else {
              var flagIncl = false;
              var pJumin = /(\d{6}[ ,-]-?[1-4]\d{6})|(\d{6}[ ,-]?[1-4])/;
              var pCert  = /(\d{2}-\d{2}-\d{6}-\d{2})/;
              var pTelNum = /(\d{2,3}[ ,-]-?\d{2,4}[ ,-]-?\d{4})/;
              var pAddr = /((([가-힣]+(\d{1,5}|\d{1,5}(,|.)\d{1,5})+(읍|면|동|가|리))(^구|)((\d{1,5}(~|-)\d{1,5}|\d{1,5})(가|리|)|))([](산(\d{1,5}(~|-)\d{1,5}|\d{1,5}))|)|(([가-힣]|(\d{1,5}(~|-)\d{1,5})|\d{1,5})+(로|길)))/;
              var pCard = /[34569][0-9]{3}[-~.[ ]][0-9]{4}[-~.[ ]][0-9]{4}[-~.[ ]][0-9]{4}/;
              var pPort = /([a-zA-Z]{1}|[a-zA-Z]{2})\d{8}/;
              var pForg = /([01][0-9]{5}[[:space:]~-]+[1-8][0-9]{6}|[2-9][0-9]{5}[[:space:]~-]+[1256][0-9]{6})/;
              if (pJumin.test(params.cn) || pCert.test(params.cn) || pTelNum.test(params.cn) || pAddr.test(params.cn) || pCard.test(params.cn) || pPort.test(params.cn) || pForg.test(params.cn)) {
                  alert("내용에 개인식별정보(주민번호, 외국인번호, 면허번호, 여권번호, 전화번호, 주소, 카드번호)가 포함되어 있습니다.\n개인 식별정보를 제거 후 등록해주세요.");
                  return ;
              }
          }

          if (confirm("수정 하시겠습니까?")) {
              // 파일전송 후 내용 저장 처리
              if(($('#file1').val() != null && $('#file1').val() != '') == true) {
                  var formData = new FormData();
                  formData.append('files', document.getElementById('file1').files[0]);
                  $report.event.fileAjax(contextPath + '/file/uploadFile', formData, function (response) {
                      if (response != null && response.atchFileSn != null) {
                          params.atchFileSn1 = response.atchFileSn;
                              ajax(true, contextPath + '/os/market/updateUsed', 'body', '저장중입니다.', params, function(data) {
                                  alert('수정이 완료되었습니다.');
                                  $report.ui.closeDialogDetailUpdate();
                                  $report.ui.search();
                              }, function(xhr, status) {
                                  $report.ui.closeDialogDetailUpdate();
                                  $report.ui.search();
                              });
                      }
                  });
              } else {
                  // 첨부파일이 없으면 내용 저장 처리
                  ajax(true, contextPath + '/os/market/updateUsed', 'body', '저장중입니다.', params, function(data) {
                      var dialog = $('#dialogDetailUpdate');
                      dialog.data("kendoDialog").close();
                      
                      var data = {};
                      data.asNo = $("#choiceNtceNo").val(); 
                      data.reply = '1';
                      ajax(false, contextPath+'/os/market/detailView', 'body', '처리중입니다.', data, function (data) {
                          if (data != null) {
                                  $report.ui.detailPopLoad(data);
                                  $("#grid").data("kendoGrid").dataSource.read();
                          } else {
                              alert("상세 정보를 수신할 수 없습니다.");
                          }
                      });
                      
                      alert('수정이 완료되었습니다.');
                  }, function(xhr, status) {
                  });
              }
          }
      },

      fileAjax : function(url, formData, fn_success, fn_complete){
          var loader = isLoading($('body')[0], {
              type: "overlay",
              class : "fa fa-refresh fa-spin",
              text: "파일업로드중입니다."
          });

          var token = $("meta[name='_csrf']").attr("content");
          var header = $("meta[name='_csrf_header']").attr("content");

          $.ajax({
              url : url,
              type: 'POST',
              dataType: 'json',
              data: formData,
              async: false,
              processData: false,
              contentType: false,
              beforeSend : function(xhr) {
                  loader.loading();
                  xhr.setRequestHeader(header, token);
              },
              success : function(data) {
                  if(fn_success != null || fn_success != undefined){
                      fn_success(data);
                  }else{

                  }
              },
              error : function(jxhr, textStatus) {
                  alert("처리중 에러가 발생하였습니다.");
              },
              complete : function(xhr, status) {

                  loader.remove();

                  if(fn_complete != null || fn_complete != undefined){
                      fn_complete(xhr);
                  }
              }
          });
      },

      ajax : function(isLodingBool, url, isLodingElement, beforeSendText, ajaxParam, fn_success, fn_complete) {

          var loader = isLoading($(isLodingElement)[0], {
              type: "overlay",
              class: "fa fa-refresh fa-spin",
              text: beforeSendText
          });

          var header = $("meta[name='_csrf_header']").attr("content");
          var token = $("meta[name='_csrf']").attr("content");

          $.ajax({
              url: url,
              type: 'POST',
              contentType: "application/json",
              async: false,
              data: JSON.stringify(ajaxParam),
              dataType: "json",
              beforeSend: function (xhr) {
                  xhr.setRequestHeader(header, token);

                  if (isLodingBool) {
                      loader.loading();
                  }
              },
              success: function (data) {
                  if (fn_success != null || fn_complete != undefined) {
                      fn_success(data);
                  }
              },
              error: function (xhr, textStatus) {
                  if (xhr.status == 401) {
                      alert("권한이 없습니다. 사용자 인증이 필요합니다.");
                  } else if (xhr.status == 403) {
                      alert("세션이 만료되었습니다. 다시 로그인하세요.");
                      location.href = "/";
                  } else {
                      alert("처리 중 에러가 발생하였습니다.");
                  }
              },
              complete: function (xhr, status) {

                  if (isLodingBool) {
                      loader.remove();
                  }

                  if (fn_complete != null || fn_complete != undefined) {
                      fn_complete(xhr);
                  }
              }
          });
      },

      /**
       * @description  : 필터 적용 버튼 클릭 핸들러
       */
      btnApplyClickHandler : function(e) {
          $report.ui.search();
      },
  };

}(window, document, jQuery));