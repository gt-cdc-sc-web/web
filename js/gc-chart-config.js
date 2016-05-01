window.GC=window.GC||{};function gc_chart_config_js($,GC){"use strict";var scratchpadData={fileRevision:4,medService:[],patientData:[]};var isSMART=GC.Util.urlParam("server")=="smart";var readOnlySettings={fileRevision:202,version:{major:0,minor:0,build:0,revision:0,state:"DEV",asString:function(){return this.major+"."+this.minor+"."+this.build+"-"+this.state}},appEnvironment:"PRODUCTION",timeLogsEnabled:false,mouseTrackingEnabled:false,patientFamilyHistoryEditable:false,patientDataEditable:false,role:GC.Util.urlParam("role")?GC.Util.urlParam("role"):"coordinator",serverBase:isSMART?"https://fhir-open-api-dstu2.smarthealthit.org":"http://52.72.172.54:8080/fhir/baseDstu2",defaultPatient:isSMART?"1137192":"18791941",defaultMessage:isSMART?"572205110cf20e9addb273c4":"19179016",defaultQuestionnaire:isSMART?"":"18791835",defaultReferralRequest:isSMART?"5721fc4d0cf20e9addb273b9":"19179006",defaultSelf:isSMART?"572201fc0cf20e9addb273c1":"19178873",serverSMART:isSMART};var settings={isParentTabShown:true,hidePatientHeader:true,defaultChart:"CDC",defaultBabyChart:"WHO",defaultPrematureChart:"FENTON",widthType:"auto",paperWidth:1200,maxWidth:1400,minWidth:1095,aspectRatio:0,fontSize:14,fontFamily:"'Roboto', 'Helvetica Neue', Arial, Helvetica, sans-serif",initialView:readOnlySettings.role=="coordinator"?"allmessages":"graphs",dateFormat:"ddMMMyyyy",timeFormat:"h:mm TT",timeInterval:{Years:"y",Year:"y",Months:"m",Month:"m",Weeks:"w",Week:"w",Days:"d",Day:"d",Hours:false,Hour:false,Minutes:false,Minute:false,Seconds:false,Second:false,Milliseconds:false,Millisecond:false,separator:" ",fractions:false,zeroFill:false,limit:2},heightEstimatesMinAge:12,percentiles:[.05,.15,.5,.85,.95],minTimeInterval:GC.Constants.TIME.WEEK*6,pctz:"pct",metrics:"metric",metricsPV:"eng",gestCorrectionTreshold:30,gestCorrectionType:"none",timeline:{snapDistance:2,interactive:false,showLabelsInterval:{days:{min:0,max:GC.Constants.TIME.MONTH*3},weeks:{min:GC.Constants.TIME.WEEK*2,max:GC.Constants.TIME.YEAR*2},months:{min:GC.Constants.TIME.MONTH*3,max:GC.Constants.TIME.YEAR*3},years:{min:GC.Constants.TIME.YEAR*2,max:GC.Constants.TIME.YEAR*150}}},nicu:false,roundPrecision:{length:{std:1,nicu:1},weight:{std:1,nicu:3},headc:{std:1,nicu:1},bmi:{std:1,nicu:1},percentile:{std:0,nicu:0},zscore:{std:2,nicu:2},velocity:{std:"year",nicu:"day"}},leftgutter:48,rightgutter:48,bottomgutter:20,topgutter:25,chartSpaceY:40,columnResizing:{enabled:false,minWidth:.25,maxWidth:.75},gridLineX:{stroke:"#000","stroke-width":1,"stroke-dasharray":"- ","stroke-opacity":.6},gridLineY:{stroke:"#EEE","stroke-width":1,"stroke-opacity":1},selectionLine:{"stroke-width":1,"stroke-opacity":1,stroke:"#575757"},hoverSelectionLine:{"stroke-width":1,"stroke-opacity":.3,stroke:"#858585"},todayLine:{"stroke-width":1,stroke:"#AAA"},todayDot:{fill:"#AAA",stroke:"none"},todayText:{fill:"#AAA",stroke:"none","text-anchor":"start","font-weight":"bold"},txtLabel:{font:"10px Helvetica, Arial",fill:"#000"},txtTitle:{font:"16px Helvetica, Arial",fill:"#000"},chartLabels:{attr:{"font-family":"sans-serif, Verdana, Arial","font-size":20,"font-weight":"normal","text-anchor":"end",stroke:"none"}},higlightTimelineRanges:false,pointDoubleClickEdit:false,primarySelectionEnabled:true,secondarySelectionEnabled:true,colorPrresets:{Default:{Length:"#5CB6D2",Weight:"#DDA750","Head C":"#97C04F",BMI:"#B09292","Primary selection":"#575757","Secondary selection":"#858585"},"Medium Contrast":{Length:"#25B3DF",Weight:"#EC9A16","Head C":"#87BD28",BMI:"#B26666","Primary selection":"#38434C","Secondary selection":"#61737F"},"High Contrast":{Length:"#0191BD",Weight:"#BD7400","Head C":"#639708",BMI:"#A52D2D","Primary selection":"#13202B","Secondary selection":"#30536A"},Greyscale:{Length:"#888",Weight:"#888","Head C":"#888",BMI:"#888","Primary selection":"#333","Secondary selection":"#999"},"Greyscale - Low Contrast":{Length:"#BBB",Weight:"#BBB","Head C":"#BBB",BMI:"#BBB","Primary selection":"#444","Secondary selection":"#AAA"},"Greyscale - High Contrast":{Length:"#444",Weight:"#444","Head C":"#444",BMI:"#444","Primary selection":"#000","Secondary selection":"#888"}},currentColorPreset:"Default",saturation:0,brightness:0,drawChartBackground:false,drawChartOutlines:false,verticalShift:{enabled:true,ticks:30,drawTicks:false},chartBackground:{fill:"#EEC","fill-opacity":.5,stroke:"none"},weightChart:{abbr:"W",shortName:"WEIGHT",shortNameId:"STR_6",color:"",lines:{stroke:"","stroke-width":1,"stroke-linejoin":"round"},axis:{stroke:"","stroke-width":1,"shape-rendering":"crispedges"},axisLabels:{fill:"","font-size":12},pointsColor:"",fillRegion:{fill:"","fill-opacity":.7,"stroke-width":0},problemRegion:{fillOpacity:.3,fillURL:"url(img/problem-pattern-orange.png)",fillColor:"",stroke:"none"}},lengthChart:{abbr:"L",shortName:"LENGTH",shortNameId:"STR_2",color:"",lines:{stroke:"","stroke-width":1,"stroke-linejoin":"round","stroke-opacity":.8},axis:{stroke:"","stroke-width":1,"shape-rendering":"crispedges"},axisLabels:{fill:"","font-size":12},pointsColor:"",fillRegion:{fill:"","fill-opacity":.5,"stroke-width":0},problemRegion:{fillOpacity:.3,fillColor:"",fillURL:"url(img/problem-pattern-blue.png)",stroke:"none"}},headChart:{abbr:"HC",shortName:"HEAD C",shortNameId:"STR_13",color:"",lines:{stroke:"","stroke-width":1,"stroke-linejoin":"round"},axis:{stroke:"","stroke-width":1,"shape-rendering":"crispedges"},axisLabels:{fill:"","font-size":12},pointsColor:"",fillRegion:{fill:"","fill-opacity":.7,"stroke-width":0},problemRegion:{fillOpacity:.3,fillColor:"",fillURL:"url(img/problem-pattern-green.png)",stroke:"none"}},bodyMassChart:{abbr:"BMI",shortName:"BMI",shortNameId:"STR_14",color:"",lines:{stroke:"","stroke-width":1,"stroke-linejoin":"round"},axis:{stroke:"","stroke-width":1,"shape-rendering":"crispedges"},axisLabels:{fill:"","font-size":12},pointsColor:"",fillRegion:{fill:"","fill-opacity":.75,"stroke-width":0},problemRegion:{fillOpacity:.3,fillColor:"",fillURL:"url(img/problem-pattern-orange.png)",stroke:"none"}},patientData:{points:{even:{stroke:"#FFF","stroke-width":4,"stroke-opacity":.9,"fill-opacity":1},odd:{stroke:"#FFF","stroke-width":4,"stroke-opacity":.9,"fill-opacity":1},firstMonth:{stroke:"#FFF","stroke-width":8,"stroke-opacity":.8,"fill-opacity":1},current:{stroke:"rgb(0,0,0)","stroke-width":2}},lines:{"stroke-width":1.5}},rightAxisInnerShadow:{width:20,attr:{"stroke-width":0,fill:"#E0E0E0","fill-opacity":1}},selectionRect:{fill:"#039","fill-opacity":.2,stroke:"#006","stroke-width":1,"stroke-opacity":.5,"stroke-dasharray":"- "}};function setChartSettingsColors(chartName,baseColor){settings[chartName].color=baseColor;settings[chartName].fillRegion.fill=baseColor;settings[chartName].lines.stroke=GC.Util.darken(baseColor,80);settings[chartName].axis.stroke=GC.Util.darken(baseColor,90);settings[chartName].axisLabels.fill=GC.Util.darken(baseColor,70);settings[chartName].pointsColor=GC.Util.darken(baseColor,70);settings[chartName].problemRegion.fillColor=baseColor}setChartSettingsColors("weightChart",settings.colorPrresets.Default["Weight"]);setChartSettingsColors("lengthChart",settings.colorPrresets.Default["Length"]);setChartSettingsColors("headChart",settings.colorPrresets.Default["Head C"]);setChartSettingsColors("bodyMassChart",settings.colorPrresets.Default["BMI"]);GC.chartSettings=$.extend(true,{},settings,readOnlySettings);GC.scratchpadData=$.extend(true,{},scratchpadData);GC.__INITIAL__chartSettings=$.extend(true,{},GC.chartSettings);if(localStorage.preferences){var pref=JSON.parse(localStorage.getItem("preferences"));switch(pref.initialView){case"allmessages":case"patients":if(readOnlySettings.role!=="coordinator"){pref.initialView="graphs";localStorage.setItem("preferences",JSON.stringify(pref))}break;default:break}}GC.Preferences=new GC.Model(GC.chartSettings,readOnlySettings);GC.Scratchpad=new GC.Model(GC.scratchpadData);GC.Scratchpad.autoCommit=true}gc_chart_config_js(jQuery,GC);