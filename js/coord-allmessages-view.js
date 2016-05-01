(function(NS,$){"use strict";var selectedIndex=-1,metrics=null,PRINT_MODE=$("html").is(".before-print"),EMPTY_MARK=PRINT_MODE?"":"&#8212;",MILISECOND=1,SECOND=MILISECOND*1e3,MINUTE=SECOND*60,HOUR=MINUTE*60,DAY=HOUR*24,WEEK=DAY*7,MONTH=WEEK*4.348214285714286,YEAR=MONTH*12,shortDateFormat={Years:"y",Year:"y",Months:"m",Month:"m",Weeks:"w",Week:"w",Days:"d",Day:"d",separator:" "};function isAllMessagesViewVisible(){return GC.App.getViewType()=="allmessages"}function retrieveTableData(somedatatable,sometabledata){console.log("sometabledata "+sometabledata.length);console.log(sometabledata);var somedataset=JSON.parse(sometabledata);console.log("somedataset "+somedataset.length);console.log(somedataset);for(var ind=0;ind<somedataset.length;ind++){somedatatable.row.add(somedataset[ind])}somedatatable.draw(false)}function renderAllMessagesView(container){$(container).empty();var loadingdiv=$("<div><div class='spinner'></div></div>").addClass("table-loading-spinner").hide();$(container).append(loadingdiv);var thetable=$("<table></table>").addClass("stripe hover");thetable.prop("id","allmessages-table").prop("width","100%");$(container).append(thetable);var thedatatable=$("#allmessages-table").DataTable({columns:[{title:"Message ID"},{title:"From"},{title:"To"},{title:"Concerning"},{title:"Detail"},{title:"Sent"}]});$("<div>Reload Message List From Server</div>").addClass("btn btn-info").prop("style","margin-left:100px").click(function(){window.sessionStorage.removeItem("allmessagestable");renderAllMessagesView(container)}).appendTo("div.dataTables_length");$("#allmessages-table tbody").on("click","tr",function(){window.sessionStorage.setItem("message_id",thedatatable.row(this).data()[0]);GC.App.messageDetail()});var thedataset=[];var tabledata=window.sessionStorage.getItem("allmessagestable");if(tabledata){retrieveTableData(thedatatable,tabledata);return}var todayDateStr=moment().startOf("day").format("YYYY-MM-DD");loadingdiv.show();$.ajax({url:GC.chartSettings.serverBase+"/Communication"+"?sent=%3C%3D"+todayDateStr+"&_count=50",dataType:"json",success:function(allMessagesResult){mergeHTML(allMessagesResult,true)},complete:function(){loadingdiv.hide()}});function mergeHTML(allMessagesResult,initialCall){if(!allMessagesResult)return;if(allMessagesResult.data){allMessagesResult=allMessagesResult.data}console.log(allMessagesResult.entry);if(allMessagesResult.total>0){for(var i=0;i<allMessagesResult.entry.length;i++){var p=allMessagesResult.entry[i];if(Date.parse(p.resource.sent)>moment()){continue}var rdata=[p.resource.id?p.resource.id:"",p.resource.sender?p.resource.sender.display?p.resource.sender.display:p.resource.sender.reference?p.resource.sender.reference:"":"",p.resource.recipient?p.resource.recipient[0].display?p.resource.recipient[0].display:p.resource.recipient[0].reference?p.resource.recipient[0].reference:"":"",p.resource.subject?p.resource.subject.display?p.resource.subject.display:p.resource.subject.reference?p.resource.subject.reference:"":"",p.resource.category?p.resource.category.text?p.resource.category.text:p.resource.category.coding?(p.resource.category.coding.system?p.resource.category.coding.system+" - ":"")+(p.resource.category.coding.code?p.resource.category.coding.code:""):"":"",p.resource.sent?moment(p.resource.sent).format("ll"):p.resource.received?moment(p.resource.received).format("ll"):""];thedatatable.row.add(rdata);thedataset.push(rdata)}}thedatatable.draw(false);window.sessionStorage.setItem("allmessagestable",JSON.stringify(thedataset));console.log("links "+allMessagesResult.link.length);if(initialCall){getMultiResults(allMessagesResult)}}function getMultiResults(allMessagesResult){var nResults=allMessagesResult.total;for(var ind=0;ind<(allMessagesResult.link?allMessagesResult.link.length:0);ind++){if(allMessagesResult.link[ind].relation=="next"){var theURL=allMessagesResult.link[ind].url;console.log("url "+theURL);var a=$("<a>",{href:theURL})[0];var que=a.search.substring(1);var quedata=que.split("&");for(var qind=0;qind<quedata.length;qind++){var item=quedata[qind].split("=");if(item[0]==="_getpagesoffset"&&parseInt(item[1])<nResults){var nRequests=0;for(var offsetResults=parseInt(item[1]);offsetResults<nResults;offsetResults+=50){var newURL=theURL.replace(/(_getpagesoffset=)(\d+)/,"$1"+offsetResults.toString());console.log("rewritten to "+newURL);nRequests++;$.ajax({dataType:"json",url:newURL,success:function(newResult){console.log(newResult);mergeHTML(newResult,false)}})}}}break}}}}NS.AllMessagesView={render:function(){renderAllMessagesView("#view-messages")}};$(function(){if(!PRINT_MODE){$("html").bind("set:viewType set:language",function(e){if(isAllMessagesViewVisible()){renderAllMessagesView("#view-messages")}});GC.Preferences.bind("set:metrics set:nicu set:currentColorPreset",function(e){if(isAllMessagesViewVisible()){renderAllMessagesView("#view-messages")}});GC.Preferences.bind("set",function(e){if(e.data.path=="roundPrecision.velocity.nicu"||e.data.path=="roundPrecision.velocity.std"){if(isAllMessagesViewVisible()){renderAllMessagesView("#view-messages")}}});GC.Preferences.bind("set:timeFormat",function(e){renderAllMessagesView("#view-messages")})}})})(GC,jQuery);