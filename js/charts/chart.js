function Chart(pane){this.id=Raphael.createUUID();this.pane=null;this._nodes=[];this.settings=GC.chartSettings;this.__CACHE__={};if(pane){this.init(pane)}}Chart.prototype={width:300,height:200,minWidth:100,minHeight:200,x:0,y:0,dataSet:"",problemDataSet:"",isInLastRow:true,title:"Chart",init:function(pane){this.pane=pane;this.__CACHE__={};this._nodes=[];this._selectionNodes={selected:[],hover:[]};this.ID=Raphael.createUUID();this._titleSet=this.pane.paper.set();this._axisSet=this.pane.paper.set()},clear:function(){this.__CACHE__={};var i;function removeElem(elem){try{elem.remove()}catch(ex){if(elem.node.parentNode){elem.node.parentNode.removeChild(elem.node)}}}for(i=this._nodes.length-1;i>=0;i--){if(this._nodes[i].type=="set"){this._nodes[i].forEach(removeElem);this._nodes[i].clear()}else if(this._nodes[i].remove){removeElem(this._nodes[i])}else if(this._nodes[i].parentNode){this._nodes[i].parentNode.removeChild(this._nodes[i])}}this._nodes=[];this.unsetSelection();return this},get:function(key,args){if(this.__CACHE__[key]===undefined){var getter="_get_"+key;this.__CACHE__[key]=this[getter](args)}return this.__CACHE__[key]},css:function(elem,selector){if(!this.svgCss){this.svgCss={".axis":this.settings.axis,".fill-region":this.settings.fillRegion||{"stroke-width":0,fill:this.settings.lines.stroke,"fill-opacity":.3},".label-glow":{"text-anchor":"start",stroke:GC.Util.brighten(this.settings.lines.stroke,.7),"stroke-width":3,"stroke-opacity":.9},".label-dot":{fill:this.settings.lines.stroke,"stroke-width":0},".label-text":{"text-anchor":"start",fill:GC.Util.darken(this.settings.lines.stroke,.6)},".region-shadow":{"stroke-width":3,"stroke-opacity":.2,stroke:"#000","-webkit-transform":"translateY(2px)","-moz-transform":"translateY(2px)","-o-transform":"translateY(2px)","-ms-transform":"translateY(2px)",transform:Raphael.vml?"t0,2":"translateY(2px)"},".chart-lines":this.settings.lines};var id=this.ID;$.each(this.svgCss,function(selector,style){$.each(style,function(k,v){style[$.camelCase(k)]=v});$.helperStyle(selector+"-"+id,style)})}if(Raphael.vml){elem.attr(this.svgCss[selector])}else{elem.addClass(selector.replace(/^\s*\.\s*/,"")+"-"+this.ID)}},isVisible:function(){if(GC.App.getViewType()!="graphs"){return false}if(this.stack&&this.stack.getCurrentChart()!==this){return false}return true},_get_hasData:function(){var pts=this.getPatientDataPoints();return pts&&pts._length},_get_primaryCurvesData:function(){return GC.Util.cropCurvesDataX(GC.Util.getCurvesData(this.dataSet),GC.App.getStartAgeMos(),GC.App.getEndAgeMos())},_get_primaryCurvesDataScaled:function(){var inst=this,data=this.get("primaryCurvesData");$.each(data,function(i,line){$.each(line.data,function(j,p){p.chartX=inst._scaleX(p.x);p.chartY=inst._scaleY(p.y)})});return data},_get_secondaryCurvesDataScaled:function(){var inst=this,data=this.get("secondaryCurvesData");$.each(data,function(i,line){$.each(line.data,function(j,p){p.chartX=inst._scaleX(p.x);p.chartY=inst._scaleY(p.y)})});return data},_get_secondaryCurvesData:function(){return GC.Util.cropCurvesDataX(GC.Util.getCurvesData(this.problemDataSet),GC.App.getStartAgeMos(),GC.App.getEndAgeMos())},_get_primaryCurvesDataRaw:function(){return GC.Util.getCurvesData(this.dataSet)},_get_secondaryCurvesDataRaw:function(){return GC.Util.getCurvesData(this.problemDataSet)},_get_primaryDataRange:function(){return this._getDataRange(this.get("primaryCurvesData"))},_get_secondaryDataRange:function(){return this._getDataRange(this.get("secondaryCurvesData"))},_get_dataBounds:function(){var out={minX:[Number.MAX_VALUE],maxX:[Number.MIN_VALUE],minY:[Number.MAX_VALUE],maxY:[Number.MIN_VALUE]},range,points,bounds;points=this.getPatientDataPoints();if(points&&points._length){bounds=points.getBounds();out.minX.push(bounds.agemos.min);out.minY.push(bounds.value.min);out.maxX.push(bounds.agemos.max);out.maxY.push(bounds.value.max)}if(this.dataSet){range=this.get("primaryDataRange");out.minX.push(range.minX);out.minY.push(range.minY);out.maxX.push(range.maxX);out.maxY.push(range.maxY)}if(this.problemDataSet){range=this.get("secondaryDataRange");out.minX.push(range.minX);out.minY.push(range.minY);out.maxX.push(range.maxX);out.maxY.push(range.maxY)}out.minX=Math.min.apply({},out.minX);out.minY=Math.min.apply({},out.minY);out.maxX=Math.max.apply({},out.maxX);out.maxY=Math.max.apply({},out.maxY);return out},_get_bounds:function(){var out={topLeft:{x:this.x,y:this.y},topRight:{x:this.x+this.width,y:this.y},bottomRight:{x:this.x+this.width,y:this.y+this.height},bottomLeft:{x:this.x,y:this.y+this.height}},range,points;points=this.getPatientDataPoints();if(points&&points._length){out.topLeft.y=this._scaleY(points._data[0].value);out.bottomLeft.y=this._scaleY(points._data[0].value);out.topRight.y=this._scaleY(points._data[points._length-1].value);out.bottomRight.y=this._scaleY(points._data[points._length-1].value)}if(this.dataSet){range=this._get_primaryDataRange();out.bottomLeft.y=this._scaleY(range.minYstart);out.bottomRight.y=this._scaleY(range.minYend);out.topLeft.y=this._scaleY(range.maxYstart);out.topRight.y=this._scaleY(range.maxYend)}if(this.problemDataSet){range=this._get_secondaryDataRange();if(range.minYstart>Number.MIN_VALUE){out.bottomLeft.y=Math.max(out.bottomLeft.y,this._scaleY(range.minYstart))}if(range.minYend>Number.MIN_VALUE){out.bottomRight.y=Math.max(out.bottomRight.y,this._scaleY(range.minYend))}if(range.maxYstart<Number.MAX_VALUE){out.topLeft.y=Math.min(out.topLeft.y,this._scaleY(range.maxYstart))}if(range.maxYend<Number.MAX_VALUE){out.topRight.y=Math.min(out.topRight.y,this._scaleY(range.maxYend))}}return out},_get_topOutline:function(){var line=$.extend(true,[],this.get("topBoundary")),len=line.length,startX=this.x,endX=this.x+this.width,axisCoordinates;if(len){if(line[0][0]>startX){line.unshift([startX,line[0][1]])}if(line[line.length-1][0]<endX){line.push([endX,line[line.length-1][1]])}axisCoordinates=this.get("axisCoordinates");line.unshift([axisCoordinates.pA.x,axisCoordinates.pA.y]);line.push([axisCoordinates.pB.x,axisCoordinates.pB.y])}return line},_get_bottomOutline:function(){var line=$.extend(true,[],this.get("bottomBoundary")),len=line.length,startX=this.x,endX=this.x+this.width,axisCoordinates;if(len){if(line[0][0]>startX){line.unshift([startX,line[0][1]])}if(line[line.length-1][0]<endX){line.push([endX,line[line.length-1][1]])}axisCoordinates=this.get("axisCoordinates");line.unshift([axisCoordinates.pD.x,axisCoordinates.pD.y]);line.push([axisCoordinates.pC.x,axisCoordinates.pC.y])}return line},_get_bottomBoundary:function(args){var out=null,inst=this,lines=[],l1=[],l2=[],l3=[],points=this.getPatientDataPoints(),data,linesLen,pointsLen,p,i;data=this.get("primaryCurvesDataScaled");linesLen=data.length;if(linesLen){pointsLen=data[0].data.length;if(pointsLen){for(i=0;i<pointsLen;i++){p=data[0].data[i];l2[i]=[p.chartX,p.chartY]}lines.push(l2)}}if(this.problemDataSet){data=this.get("secondaryCurvesDataScaled");linesLen=data.length;if(linesLen){pointsLen=data[0].data.length;if(pointsLen){for(i=0;i<pointsLen;i++){p=data[0].data[i];l3[i]=[p.chartX,p.chartY]}lines.push(l3)}}}$.each(lines,function(i,l){if(i===0){out=l}else{out=GC.Util.sumLinesY(out,l,"max",100)}});return out&&out.length?out:[[this.x,this.y+this.height],[this.x+this.width,this.y+this.height]]},_get_topBoundary:function(){var out=null,inst=this,lines=[],l1=[],l2=[],l3=[],data,linesLen,pointsLen,line,p,i;data=this.get("primaryCurvesDataScaled");linesLen=data.length;if(linesLen){line=data[linesLen-1].data;pointsLen=line.length;if(pointsLen){for(i=0;i<pointsLen;i++){p=line[i];l2[i]=[p.chartX,p.chartY]}lines.push(l2)}}if(this.problemDataSet){data=this.get("secondaryCurvesDataScaled");linesLen=data.length;if(linesLen){line=data[linesLen-1].data;pointsLen=line.length;if(pointsLen){for(i=0;i<pointsLen;i++){p=line[i];l3[i]=[p.chartX,p.chartY]}lines.push(l3)}}}$.each(lines,function(i,l){if(i===0){out=l}else{out=GC.Util.sumLinesY(out,l,"min",100)}});return out&&out.length?out:[[this.x,this.y],[this.x+this.width,this.y]]},_get_dataPoints:function(dataType){var lines={};$.each(["lengthAndStature","weight","headc","bmi"],function(j,type){if(dataType&&dataType!=type){return true}var points=GC.App.getPatient().data[type],len=points.length,out=[],min=Math.max(GC.App.getStartAgeMos(),0),max=Math.min(GC.App.getEndAgeMos(),250),ptPrev=null,ptNext=null,i;for(i=0;i<len;i++){if(points[i].agemos<min){if(!ptPrev||ptPrev[0]<points[i].agemos){ptPrev=[points[i].agemos,points[i].value]}}else if(points[i].agemos>max){if(!ptNext||ptNext[0]>points[i].agemos){ptNext=[points[i].agemos,points[i].value]}}else{out.push([points[i].agemos,points[i].value])}}if(ptPrev){out.unshift(ptPrev)}if(ptNext){out.push(ptNext)}lines[type]=out});return lines},_get_axisCoordinates:function(){var bounds=this.get("bounds"),startYleft=bounds.topLeft.y,startYright=bounds.topRight.y,endYleft=bounds.bottomLeft.y,endYright=bounds.bottomRight.y,left=this.x,right=this.x+this.width;if(this.rowIndex===0){startYleft=startYright=this.y}else{if(startYleft>startYright){startYleft=Math.floor(startYleft)-30;startYright=this.y}else{startYright=Math.floor(startYright)-30;startYleft=this.y}}if(this.isInLastRow){endYleft=endYright=Math.ceil(this.y+this.height)}else{endYleft=Math.ceil(endYleft)+30;endYright=Math.ceil(endYright)+30}return new GC.Rect(left,startYleft,right,startYright,right,endYright,left,endYleft)},_getDataRange:function(data){var l1=data.length,out={minX:Number.MAX_VALUE,maxX:Number.MIN_VALUE,minY:Number.MAX_VALUE,maxY:Number.MIN_VALUE,minYstart:Number.MAX_VALUE,maxYstart:Number.MIN_VALUE,minYend:Number.MAX_VALUE,maxYend:Number.MIN_VALUE,rangeX:0,rangeY:0},i,j=0,x,y,l2,left=[],right=[];for(i=0;i<l1;i++){if(data[i].data){l2=data[i].data.length;for(j=0;j<l2;j++){x=data[i].data[j].x;y=data[i].data[j].y;out.minX=Math.min(out.minX,x);out.minY=Math.min(out.minY,y);out.maxX=Math.max(out.maxX,x);out.maxY=Math.max(out.maxY,y);if(j===0){left.push(data[i].data[j])}if(j===l2-1){right.push(data[i].data[j])}}}}$.each(left,function(i,o){out.minYstart=Math.min(out.minYstart,o.y);out.maxYstart=Math.max(out.maxYstart,o.y)});$.each(right,function(i,o){out.minYend=Math.min(out.minYend,o.y);out.maxYend=Math.max(out.maxYend,o.y)});out.rangeX=out.maxX-out.minX;out.rangeY=out.maxY-out.minY;return out},getPatientDataPoints:function(){if(this.patientDataType){var patient=GC.App.getPatient(),pointSet=new PointSet(patient.data[this.patientDataType],"agemos","value");pointSet.clip(GC.App.getStartAgeMos(),GC.App.getEndAgeMos()-this.getInnerAxisShadowWidth()/this.pane.pixelsPerMonth(this.colIndex));return pointSet.compact()}return null},getInnerAxisShadowWidth:function(){return GC.App.getPCTZ()=="z"?34:20},setWidth:function(w){this.width=Math.max(w,this.minWidth);this.setHeight(this.width*3/5);return this},setHeight:function(h){this.height=Math.max(h,this.minHeight);return this},getHeight:function(){return this.height},setX:function(x){this.x=x;return this},setY:function(y){this.y=y;return this},_setDataSource:function(type,src,dataType){var ds=GC.getDataSet(src,dataType,GC.App.getGender(),GC.App.getStartAgeMos(),GC.App.getEndAgeMos());if(type=="primary"){this.dataSet=ds?ds.name:""}else if(type=="secondary"){this.problemDataSet=ds?ds.name:""}return this},setDataSource:function(src){return this},setProblem:function(){return this},getUnits:function(){throw"Please implement the 'getUnits' method"},getMetrics:function(){if(this.dataSet){return GC.DATA_SETS[this.dataSet].measurement}return GC.App.getMetrics()},_scaleX:function(n){return GC.Util.scale(n,GC.App.getStartAgeMos(),GC.App.getEndAgeMos(),this.x,this.x+this.width)},_scaleY:function(n){var titleHeight=GC.chartSettings.chartLabels.attr["font-size"]*1.3,curvesTop=this.y+titleHeight,dataBounds=this.get("dataBounds");return GC.Util.scale(n,dataBounds.minY,dataBounds.maxY,this.y+this.height-30,curvesTop)},unsetSelection:function(type){if(this._selectionNodes){$.each(this._selectionNodes,function(id,elems){if(!type||type===id){$.map(elems,function(o){o.remove();return null})}});GC.Tooltip.reorder()}},getLocalizedValue:function(val){return GC.Util.format(val,{type:this.patientDataType})},drawSelectionPoints:function(ageWeeks,type){this.unsetSelection(type);var pts=this.getDataPointsAtMonth(GC.Util.weeks2months(ageWeeks)),l=pts.length,pctz=GC.App.getPCTZ(),metrics=GC.App.getMetrics(),arrowType=false,text2,tmp,bg,i;function hasSamePoint(point){return function(pt){return pt.data&&Math.abs(pt.data("x")-point.x)<1&&Math.abs(pt.data("y")-point.y)<1}}bg=Raphael.color(this.settings.color);bg.s=Math.min(1,bg.s*1.1);bg.l=Math.max(0,bg.l/1.1);bg=Raphael.hsl(bg.h,bg.s,bg.l);for(i=0;i<l;i++){if(type=="selected"||!$.grep(this._selectionNodes.selected,hasSamePoint(pts[i])).length){text2=pctz=="pct"&&pts[i].data.pct!==undefined?GC.Util.format(pts[i].data.pct*100,{type:"percentile"}):pctz=="z"&&pts[i].data.z!==undefined?GC.Util.format(pts[i].data.z,{type:"zscore"}):"N/A";if(type=="hover"){var selected=GC.SELECTION.selected;if(selected&&selected.age){var patient=GC.App.getPatient(),selectedRecord=patient.getModelEntryAtAgemos(selected.age.getMonths());if(selectedRecord&&selectedRecord[this.patientDataType]!==undefined){var atRecord={agemos:pts[i].data.agemos};atRecord[this.patientDataType]=pts[i].data.value;var v=GC.App.getPatient().getVelocity(this.patientDataType,atRecord,selectedRecord);if(v!==null&&this.getLocalizedValue){tmp=this.getLocalizedValue(v.value);if(tmp){text2+=" | "+tmp+v.suffix;arrowType=true}}}}}this._selectionNodes[type].push(this.pane.paper.circle(pts[i].x,pts[i].y,5).attr({fill:"#000",stroke:"none"}).data("x",pts[i].x).data("y",pts[i].y).addClass("tooltip-point").toggleClass("hover",type=="hover").toggleClass("selected",type=="selected").toFront(),GC.tooltip(this.pane.paper,{x:pts[i].x,y:pts[i].y,shiftY:30,shadowOffsetX:-15,shadowOffsetY:5,bg:type=="selected"?GC.chartSettings.selectionLine.stroke:GC.chartSettings.hoverSelectionLine.stroke,text:pts[i].data.label===undefined?"No data":pts[i].data.label,text2:text2,text2bg:bg,arrowType:arrowType}))}}return pts},getDataPointsAtMonth:function(m){var lines=this.get("dataPoints"),out=[],type="",inst=this,colWidth=this.pane.getColumnWidth(this.colIndex,true),gender=GC.App.getGender(),point=null,pxMonth=this.pane.pixelsPerMonth(this.colIndex),pct,z,data,o;function forEachPoint(i,p){var dX=Math.abs(p[0]-m)*pxMonth;if(dX<GC.chartSettings.timeline.snapDistance*colWidth/100){if(!point||Math.abs(point[0]-m)*pxMonth>dX){point=p}}}for(type in lines){if(lines[type]){o=lines[type];point=null;$.each(o,forEachPoint);if(point){pct=this.dataSet?GC.findPercentileFromX(point[1],GC.DATA_SETS[this.dataSet],gender,point[0]):null;z=this.dataSet?GC.findZFromX(point[1],GC.DATA_SETS[this.dataSet],gender,point[0]):null;data={agemos:point[0],value:point[1],color:this.settings.color,label:this.getTooltipLabel(point[1]),isLast:point===lines[type][lines[type].length-1]};if(pct!==null&&!isNaN(pct)&&isFinite(pct)){data.pct=pct}if(z!==null&&!isNaN(z)&&isFinite(z)){data.z=z}out.push(new GC.Point(this._scaleX(point[0]),this._scaleY(point[1]),data))}}}return out},getTooltipLabel:function(val){return this.getLocalizedValue(val)},getValueAtX:function(x){if(!this.dataSet){return[]}var data=this.get("primaryCurvesData"),linesLen=data.length,out=[],before,after,ptA,ptB,points,pointsLen,i,j,val;if(linesLen<1){return out}x/=this.pane.pixelsPerMonth(this.colIndex);x+=GC.App.getStartAgeMos();for(i=0;i<linesLen;i++){points=data[i].data;pointsLen=points.length;if(pointsLen){ptA=points[0];ptB=points[pointsLen-1];before={x:GC.Util.findMinMax(points,"x").min,y:ptA.y};after={x:GC.Util.findMinMax(points,"x").max,y:ptB.y};for(j=0;j<pointsLen;j++){if(points[j].x<x&&points[j].x>before.x){before=points[j]}if(points[j].x>x&&points[j].x<after.x){after=points[j]}}val=GC.Util.getYatX(x,before.x,before.y,after.x,after.y);if(!isNaN(val)&&isFinite(val)){out[i]=GC.Util.getYatX(x,before.x,before.y,after.x,after.y)}}}return out},_get_verticalGridPlaces:function(){var inst=this,type=this.pane.getVerticalGridIntervalType(),out=[],points,left,x;if(type){points=this.pane.getIntervalPoints(type,this.colIndex);left=GC.chartSettings.leftgutter;$.each(points,function(j,point){x=inst.x+point.x-left;if(x>inst.x&&x<inst.x+inst.width){out.push(x)}})}return out},drawChartBackground:function(){this._nodes.push(this.pane.paper.rect(this.x,this.y,this.width,this.height).attr(GC.chartSettings.chartBackground).toBack())},drawVerticalGrid:function(){var pts=this.get("verticalGridPlaces"),axis=this.get("axisCoordinates"),y1=Math.min(axis.pA.y,axis.pB.y),y2=Math.max(axis.pC.y,axis.pD.y),inst=this;$.each(pts,function(j,x){inst._nodes.push(inst.pane.paper.path("M"+x+","+y1+"V"+y2).attr(GC.chartSettings.gridLineY).addClass("grid-line-y").toBack())})},draw:function(){if(!this.isVisible()){return}this.clear();if(GC.chartSettings.drawChartBackground){this.drawChartBackground()}this.drawInnerAxisShadow();this.drawAxis();this.drawWaterMark();this.drawVerticalGrid();this.drawTitle();if(!this.dataSet){this.drawNoData(GC.str("STR_6046"))}else{if(GC.chartSettings.drawChartOutlines){this.drawOutlines()}var data=this.get("primaryCurvesDataScaled"),len=data.length,pcts=GC.Preferences.prop("percentiles"),rShWidth=this.getInnerAxisShadowWidth(),point,txt,p=[],n=0,elem,i,j,l,x=0,y=0,_x,_y,x2=this.x+this.width-rShWidth;if(len<2){this.drawNoData(GC.str("STR_6046"))}else{this.drawFillChartRegion(data);for(j=0;j<len;j++){l=data[j].data.length;for(i=0;i<l;i++){point=data[j].data[i];_x=point.chartX;_y=point.chartY;if(_x>x2){_y=GC.Util.getYatX(x2,x,y,_x,_y);_x=x2}x=_x;y=_y;p[n++]=(!i?"M":"L")+x+","+y;if(i===l-1){this.drawDataLineLabel(x,y,pcts[j])}}}if(n>1){elem=this.pane.paper.path(p).attr(this.settings.lines);this._nodes.push(elem)}}}this.drawProblemRegion();if(this.labels){this.labels.toFront()}this.drawPatientData();return this},drawDataLineLabel:function(x,y,percentile){var elem,txt=GC.App.getPCTZ()=="z"?GC.Util.roundToPrecision(Math.normsinv(percentile),2):String(Number(percentile).toFixed(2)).replace("0.","");this.labels=this.pane.paper.set();this._nodes.push(this.labels);this.labels.push(this.pane.paper.circle(x,y,2.5).attr({fill:this.settings.lines.stroke,"stroke-width":0}));this.labels.push(this.pane.paper.text(x+5,y,txt).attr({"text-anchor":"start",stroke:GC.Util.brighten(this.settings.lines.stroke,.7),"stroke-width":3,"stroke-opacity":.9}));this.labels.push(this.pane.paper.text(x+5,y,txt).attr({"text-anchor":"start",fill:GC.Util.darken(this.settings.lines.stroke,.7)}))},drawInnerAxisShadow:function(){var w=this.getInnerAxisShadowWidth(),a=this.get("axisCoordinates");this._nodes.push(this.pane.paper.rect(this.x+this.width-w,a.pB.y,w,a.pC.y-a.pB.y).attr(GC.chartSettings.rightAxisInnerShadow.attr).toBack())},drawNoData:function(msg,fontSize){this._nodes.push(this.pane.paper.text(this.x+this.width/2,this.y+this.height/2,msg||GC.str("STR_6045")).attr({"font-size":fontSize||30,fill:"#A60","fill-opacity":.4}))},drawTitle:function(){if(this.stack&&this.stack.getCurrentChart()!==this){return}if(this._titleSet){this._titleSet.remove()}var titleText=this.getTitle(),color=GC.Util.darken(this.settings.color,.85),titleAttr=$.extend({},GC.chartSettings.chartLabels.attr,{fill:color}),doRotate=Raphael.vml,doCurve=Raphael.svg,refPoints=this.get("topBoundary"),l=refPoints.length,ps,p,i,refId,path,txt,attr,vals,box,p1,p2,angle;if(!l||!this.dataSet&&!this.problemDataSet||refPoints[l-1][0]<this.x+this.width*.85){doRotate=false;doCurve=false}if(!this.dataSet||this.dataSet&&this.problemDataSet&&this.dataSet!=this.problemDataSet){doRotate=false;doCurve=false}if(doCurve){if(!this.dataSet&&!this.problemDataSet){ps=new PointSet(refPoints,0,1);ps.smooth(2);ps.forEach(function(point){point[this.dimensionY]-=10});refPoints=ps._data}p="";for(i=0;i<l;i++){p+=(i&&i%2?" L ":" ")+refPoints[i][0]+", "+refPoints[i][1]}if(p){refId=this.id+"titlepath";path=document.getElementById(refId);if(!path){path=document.createElementNS("http://www.w3.org/2000/svg","path");path.id=refId;path.setAttribute("transform","translate(0, -12)");path.setAttribute("d","M "+p);this.pane.paper.defs.appendChild(path)}txt=document.createElementNS("http://www.w3.org/2000/svg","text");for(attr in titleAttr){txt.setAttribute(attr,titleAttr[attr])}txt.setAttribute("class","chart-title-curved");path=document.createElementNS("http://www.w3.org/2000/svg","textPath");path.setAttributeNS("http://www.w3.org/1999/xlink","href","#"+refId);path.setAttribute("startOffset","90%");path.appendChild(document.createTextNode(titleText));this.pane.paper.canvas.appendChild(txt);txt.appendChild(path);this._titleSet.push(new Raphael.el.constructor(txt,this.pane.paper));this._nodes.push(this._titleSet);return}}txt=this.pane.paper.text().attr(titleAttr).attr({x:this.x+(this.width-this.getInnerAxisShadowWidth())*.9,y:this.y+GC.chartSettings.chartLabels.attr["font-size"]/2,text:titleText});if(doRotate){box=txt.getBBox();vals=this.getValueAtX(box.x);p1={x:box.x,y:this._scaleY(vals[vals.length-1])};vals=this.getValueAtX(box.x2);p2={x:box.x2,y:this._scaleY(vals[vals.length-1])};angle=360-Raphael.angle(p2.x,p2.y,p1.x,p1.y);vals=this.getValueAtX(box.x+box.width/2);txt.attr({transform:"r-"+angle,y:this._scaleY(vals[vals.length-1])-GC.chartSettings.chartLabels.attr["font-size"]*2/3})}this._titleSet.push(txt);this._nodes.push(this._titleSet)},drawAxis:function(){if(this._axisSet){this._axisSet.remove()}var bounds=this.get("dataBounds"),minY=bounds.minY,maxY=bounds.maxY,axis=this.get("axisCoordinates"),topOutline=this.get("topOutline"),bottomOutline=this.get("bottomOutline"),currentMeasurementSystem=GC.App.getMetrics(),sourceMeasurementSystem=this.getMetrics(),currentUnits=this.getUnits(),sourceUnits=this.dataSet?GC.DATA_SETS[this.dataSet].units||"":"",prefSteps=[1,2,5,10,20,50,100,200,500,1e3],q=1,range=0,i,y,x,r,node,step,val,precision,intersectTop,intersectBottom;if(currentMeasurementSystem!==sourceMeasurementSystem){switch(sourceUnits){case"cm":q=GC.Constants.METRICS.INCHES_IN_CENTIMETER;break;case"kg":q=GC.Constants.METRICS.POUNDS_IN_KILOGRAM;break}}minY*=q;maxY*=q;range=Math.ceil(maxY-minY);if(!range){return this}node=this.pane.paper.path("M"+axis.pA.x+","+axis.pA.y+"L"+axis.pD.x+","+axis.pD.y+"M"+axis.pB.x+","+axis.pB.y+"L"+axis.pC.x+","+axis.pC.y+"M"+(axis.pA.x-2.5)+","+axis.pA.y+"h5"+"M"+(axis.pD.x-2.5)+","+axis.pD.y+"h5"+"M"+(axis.pB.x-2.5)+","+axis.pB.y+"h5"+"M"+(axis.pC.x-2.5)+","+axis.pC.y+"h5").attr(this.settings.axis).addClass("crispedges");this._axisSet.push(node);this._axisSet.push(this.pane.paper.text(axis.pA.x-4,axis.pA.y+3,currentUnits).attr(this.settings.axisLabels).attr({"text-anchor":"end","font-weight":"bold"}));this._axisSet.push(this.pane.paper.text(axis.pB.x+4,axis.pB.y+3,currentUnits).attr(this.settings.axisLabels).attr({"text-anchor":"start","font-weight":"bold"}));step=range/8;if(range>1){step=Math.ceil(step);minY=Math.ceil(minY);$.each(prefSteps,function(i,n){if(i>0&&step>prefSteps[i-1]&&step<=n){step=n;minY=step;return false}})}if(axis.pA.y===axis.pB.y){this._axisSet.push(this.pane.paper.path("M"+axis.pA.x+","+axis.pA.y+"H"+axis.pB.x).attr(GC.chartSettings.gridLineX).addClass("grid-line-x"))}if(axis.pC.y===axis.pD.y){this._axisSet.push(this.pane.paper.path("M"+axis.pD.x+","+axis.pD.y+"H"+axis.pC.x).attr(GC.chartSettings.gridLineX).addClass("grid-line-x"))}for(i=Math.round(minY);i<=maxY;i=range<=1?i+step:Math.ceil(i+step)){precision=range<=1?2:0;y=GC.Util.roundToPrecision(this._scaleY(i/q),precision);val=GC.Util.roundToPrecision(i,precision);intersectTop=GC.Util.getLineXatY(topOutline,y)-20;intersectBottom=GC.Util.getLineXatY(bottomOutline,y)+20;intersectTop=Math.min(Math.max(intersectTop,this.x),this.x+this.width);intersectBottom=Math.min(Math.max(intersectBottom,this.x),this.x+this.width);this._axisSet.push(this.pane.paper.path("M"+intersectTop+","+y+"H"+intersectBottom).attr(GC.chartSettings.gridLineX).addClass("grid-line-x"));if(intersectTop>axis.pA.x&&y>axis.pA.y&&y<axis.pD.y){this._axisSet.push(this.pane.paper.path("M"+intersectTop+","+y+"H"+(axis.pA.x-2)).attr(GC.chartSettings.gridLineX).addClass("grid-line-x"))}if(intersectBottom<axis.pC.x&&y>axis.pB.y&&y<axis.pC.y){this._axisSet.push(this.pane.paper.path("M"+intersectBottom+","+y+"H"+(axis.pB.x+2)).attr(GC.chartSettings.gridLineX).addClass("grid-line-x"))}if(y>axis.pB.y+16&&y<=axis.pC.y){this._axisSet.push(this.pane.paper.text(axis.pB.x+6,y,val).attr("text-anchor","start").attr(this.settings.axisLabels))}if(y>axis.pA.y+16&&y<=axis.pD.y){this._axisSet.push(this.pane.paper.text(axis.pA.x-6,y,val).attr("text-anchor","end").attr(this.settings.axisLabels))}}this._nodes.push(this._axisSet);return this},drawRegion:function(data){var l=data.length,path=this.pane.paper.path(),i,p=[],n=0,line;this._nodes.push(path);if(!l||!data[0].data.length){return path}line=data[0].data;for(i=line.length-1;i>=0;i--){p[n++]=[line[i].chartX,line[i].chartY]}line=data[l-1].data;for(i=0;i<line.length;i++){p[n++]=[line[i].chartX,line[i].chartY]}p=$.map(p,function(item,index){return(index?"L":"M")+item.join(",")}).join("");return path.attr("path",p+"Z")},drawOutlines:function(){var line=this.get("topOutline"),len=line.length;if(len){line="M"+line.join("L");this._nodes.push(this.pane.paper.path(line).attr({"stroke-width":5,stroke:"blue","stroke-opacity":.4,"stroke-linecap":"round","stroke-linejoin":"round"}))}line=this.get("bottomOutline");len=line.length;if(len){line="M"+line.join("L");this._nodes.push(this.pane.paper.path(line).attr({"stroke-width":5,stroke:"blue","stroke-opacity":.4,"stroke-linecap":"round","stroke-linejoin":"round"}))}},drawProblemRegion:function(){if(!GC.App.getCorrectionalChartType()){return}if(this.problemDataSet){var data=this.get("secondaryCurvesDataScaled");if(data.length>1&&data[0].data.length){Chart.fillAsSecondaryRegion(this.drawRegion(data),this.settings.problemRegion,this.id)}}},drawFillChartRegion:function(data){this.drawRegion(data).attr(this.settings.fillRegion)},drawPatientData:function(){var pointSet=this.getPatientDataPoints(),patient,lastPoint,p,dots,inst,elem,x,y,entry;if(!pointSet||!pointSet._length){return}patient=GC.App.getPatient();lastPoint=pointSet._originalData[pointSet._originalData.length-1];p=[];dots=[];inst=this;pointSet.forEach(function(point,i,points){x=inst._scaleX(point.agemos);y=inst._scaleY(point.value);p[i]=[x,y];if(point.virtual){return true}inst.drawGestArrow({startX:x,startY:y,curAgemos:point.agemos,curValue:point.value,isLastPoint:point===lastPoint});entry=patient.getModelEntryAtAgemos(point.agemos);elem=inst.drawDot(x,y,{firstMonth:point.agemos<=1,annotation:entry.annotation,point:point,record:entry}).toFront();inst._nodes.push(elem);dots.push(elem)});if(pointSet._length>1){if(pointSet._data[pointSet._length-1].virtual){this._nodes.push(this._drawGradientLine(p.pop(),p[p.length-1],GC.chartSettings.patientData.lines["stroke-width"],"#000",GC.Util.mixColors(this.settings.fillRegion.fill,"#FFF",this.settings.fillRegion["fill-opacity"])))}p="M"+p.join("L");elem=this.pane.paper.path(p).attr(GC.chartSettings.patientData.lines);this._nodes.push(elem.toFront())}$.each(dots,function(){this.toFront()});return this},_drawGradientLine:function(p1,p2,h,c1,c2){return this.pane.paper.path("M"+p1[0]+","+(p1[1]-h/2)+"L"+p2[0]+","+(p2[1]-h/2)+"v"+h+"L"+p1[0]+","+(p1[1]+h/2)+"Z").attr({fill:"0-"+c1+"-"+c2,stroke:"none"})},drawGestArrow:function(cfg){function getCorrectionMonths(weeker){return(weeker<GC.Preferences.prop("gestCorrectionTreshold")?2:1)*12}var weeker=GC.App.getPatient().weeker,caFixed=weeker?Math.min(0,(40-weeker||0)*-1):0,correctUntil=getCorrectionMonths(weeker),arrowType=GC.chartSettings.gestCorrectionType,canDraw=arrowType!="none"&&!GC.DATA_SETS[this.dataSet].isPremature,startX=cfg.startX,startY=cfg.startY,caDeclining,xDeclining,xFixed,drawBigCrop,drawSmallCrop,drawEndDot,drawSmallArrow,colorLight,colorDark,endX,elem,x,a2,a3;if(caFixed&&canDraw&&cfg.curAgemos<correctUntil){caDeclining=caFixed-caFixed*(cfg.curAgemos/correctUntil);xFixed=this._scaleX(cfg.curAgemos+caFixed/GC.Constants.TIME_INTERVAL.WEEKS_IN_MONTH);xDeclining=this._scaleX(cfg.curAgemos+caDeclining/GC.Constants.TIME_INTERVAL.WEEKS_IN_MONTH);xDeclining=Math.min(Math.max(xDeclining,this.x),this.x+this.width);xFixed=Math.min(Math.max(xFixed,this.x),this.x+this.width);drawBigCrop=arrowType=="both"&&(xFixed===this.x||xFixed===this.x+this.width);drawSmallCrop=arrowType=="declining"&&(xDeclining===this.x||xDeclining===this.x+this.width)||arrowType=="fixed"&&(xFixed===this.x||xFixed===this.x+this.width);drawEndDot=arrowType=="both"&&!drawBigCrop;drawSmallArrow=arrowType!="both";colorLight=this.settings.lines.stroke;colorDark=GC.Util.darken(this.settings.lines.stroke,.6);if(arrowType!="both"){xFixed-=2*(caFixed<0?-1:1);xDeclining-=2*(caFixed<0?-1:1)}else{xDeclining-=6*(caFixed<0?-1:1)}endX=arrowType=="declining"?xDeclining:xFixed;this._nodes.push(this.pane.paper.path().attr({path:"M"+startX+","+startY+"H"+endX,stroke:cfg.isLastPoint?colorDark:colorLight,"stroke-width":cfg.isLastPoint?1:2}).addClass("crispedges"));if(drawSmallArrow){this._nodes.push(this.pane.paper.path().attr({path:"M"+(endX-10*(caFixed<0?-1:1))+","+(startY-4)+"L"+endX+","+startY+"L"+(endX-10*(caFixed<0?-1:1))+","+(startY+4)+"L"+(endX-7*(caFixed<0?-1:1))+","+startY+"Z",stroke:colorDark,fill:colorLight,"stroke-width":1}))}if(drawSmallCrop){x=caFixed<0?this.x:this.x+this.width;elem=this.pane.paper.rect(x-1,startY-5,2,10).attr({fill:colorLight,stroke:GC.Util.darken(this.settings.lines.stroke,.9)}).addClass("crispedges");this._nodes.push(elem)}if(drawEndDot){this._nodes.push(this.pane.paper.circle(endX,startY,4).attr({fill:colorLight,stroke:colorDark}))}if(drawBigCrop){elem=this.pane.paper.path().attr({path:"M"+endX+","+(startY-8)+"v16",stroke:colorDark,"stroke-width":5,"stroke-linecap":"round"});this._nodes.push(elem);elem=elem.clone().attr({stroke:colorLight,"stroke-width":4});this._nodes.push(elem)}if(arrowType=="both"){a2=this.pane.paper.path().attr({path:"M"+startX+","+startY+"H"+xDeclining+"M"+(xDeclining-12*(caFixed<0?-1:1))+","+(startY-8)+"L"+xDeclining+","+startY+"L"+(xDeclining-12*(caFixed<0?-1:1))+","+(startY+8),stroke:colorDark,"stroke-width":5,"stroke-linecap":"round"});this._nodes.push(a2);a3=a2.clone().attr({stroke:colorLight,"stroke-width":4});this._nodes.push(a3)}}},drawDot:function(cx,cy,settings){var cfg=$.extend({firstMonth:false,annotation:""},settings),title="",set=this.pane.paper.set(),currentMeasurementSystem=GC.App.getMetrics(),sourceMeasurementSystem=this.getMetrics(),currentUnits=this.getUnits(),sourceUnits=this.dataSet?GC.DATA_SETS[this.dataSet].units||"":currentUnits;if(!cfg.firstMonth){set.push(this.pane.paper.circle(cx,cy+.5,cfg.firstMonth?6:5).attr({blur:Raphael.svg?1:0,fill:"#000"}).addClass("point"))}set.push(this.pane.paper.circle(cx,cy,cfg.firstMonth?5:4).attr({stroke:"#FFF","stroke-opacity":cfg.firstMonth?.75:1,"stroke-width":cfg.firstMonth?4:2}).addClass("point"),this.pane.paper.circle(cx,cy,3).attr({fill:cfg.annotation?this.settings.pointsColor:GC.Util.brighten(this.settings.pointsColor),stroke:"none"}).addClass("point"));this._nodes.push(set);return set},drawWaterMark:function(){if(this.rowIndex>0&&!this.isInLastRow){return}var patient=GC.App.getPatient(),life1=new GC.TimeInterval,life2=new GC.TimeInterval,start=GC.App.getStartAgeMos(),end=GC.App.getEndAgeMos(),txt1="",txt2="",txt3=[],posY="top",posX="left",hasDs2=this.problemDataSet||GC.App.getCorrectionalChartType(),x,y1,y2,y,w,h,box,box2,box3,attrBigFont={fill:"#333","fill-opacity":.4,"font-size":20},attrSmallFont={fill:"#333","fill-opacity":.4,"font-size":12};txt1+=this.dataSet?GC.DATA_SETS[this.dataSet].source:GC.App.getPrimaryChartType();if(hasDs2){txt1+=" / ";txt2+=this.problemDataSet?GC.DATA_SETS[this.problemDataSet].source:GC.App.getCorrectionalChartType()}life1.setMonths(start);life2.setMonths(end);txt3.push(GC.Util.ucfirst(GC.str("STR_SMART_GENDER_"+patient.gender))+", ");txt3.push((start===0?"0":life1.toString(GC.chartSettings.timeInterval))+" - "+life2.toString(GC.chartSettings.timeInterval));

txt3=txt3.join("");if(this.stack||this.isInLastRow){posX="right";posY="bottom"}x=posX=="right"?this.x+this.width-this.getInnerAxisShadowWidth()-16:this.x+10;y1=posY=="top"?this.y+20:this.y+this.height-20;y2=y1;if(txt1&&txt3){if(posY=="top"){y2+=22}else{y1-=22}}txt1=this.pane.paper.text(x,y1,txt1).attr(attrBigFont).attr("text-anchor",posX=="right"?"end":"start");this._nodes.push(txt1);box=txt1.getBBox();if(txt2){txt2=this.pane.paper.text(box.x2+10,y1,txt2).attr(attrBigFont).attr("text-anchor",posX=="right"?"end":"start");this._nodes.push(txt1);box2=txt2.getBBox();if(posX=="right"){txt1.attr("x",box2.x-10)}}if(txt3){txt3=this.pane.paper.text(x,y2,txt3).attr(attrSmallFont).attr("text-anchor",posX=="right"?"end":"start");this._nodes.push(txt3);box3=txt3.getBBox()}if(txt2){this._nodes.push(this.pane.paper.rect(box2.x-5,box2.y-2,box2.width+10,box2.height+4).attr({fill:$("html").is(".before-print")?"#EEE":"url(img/dash-dark.png)",stroke:"none","fill-opacity":.7}));this._nodes.push(txt2.clone().attr({"text-anchor":posX=="right"?"end":"start",fill:"#FFF",stroke:"#FFF","stroke-width":4}))}txt1.toFront();if(txt2){txt2.toFront()}if(txt3){txt3.toFront()}}};Chart.fillAsSecondaryRegion=function(elem,settings,id){var refId,pattern,path;if($("html").is(".before-print")){elem.attr({stroke:GC.Util.mixColors("#000",settings.fillColor,.4),fill:GC.Util.mixColors("#000",settings.fillColor,.33),"fill-opacity":.3,"stroke-width":1,"stroke-opacity":.3})}else if(Raphael.svg){refId="secondary-region-pattern-"+id;pattern=document.getElementById(refId);if(!pattern){pattern=document.createElementNS("http://www.w3.org/2000/svg","pattern");pattern.id=refId;pattern.setAttribute("patternUnits","userSpaceOnUse");pattern.setAttribute("x","0");pattern.setAttribute("y","0");pattern.setAttribute("width","5");pattern.setAttribute("height","5");pattern.setAttribute("viewBox","0 0 5 5");path=document.createElementNS("http://www.w3.org/2000/svg","path");path.setAttribute("d","M 0 0 L 5 0 L 5 5 L 0 5 Z");path.setAttribute("fill",settings.fillColor);path.setAttribute("fill-opacity",settings.fillOpacity);pattern.appendChild(path);path=document.createElementNS("http://www.w3.org/2000/svg","path");path.setAttribute("d","M 5 0 L 0 5");path.setAttribute("stroke","#000");path.setAttribute("stroke-opacity",settings.fillOpacity);pattern.appendChild(path);elem.paper.defs.appendChild(pattern)}elem.attr("stroke",settings.stroke).addClass("pattern-fill").node.setAttribute("fill","url(#"+refId+")")}else{elem.attr({stroke:settings.stroke,fill:settings.fillURL||settings.fillColor,"fill-opacity":1})}};