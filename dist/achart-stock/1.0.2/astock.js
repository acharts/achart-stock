!function(){var t,e,a;t=function(t){function e(t){e.superclass.constructor.call(this,t)}var a=window.AChart,r=a.Series.Cartesian,i=(a.Actived.Group,a.Flags),n=a.Candlesticks,o=a.Util;return e.ATTRS={type:"candlestick",elCls:"x-chart-candlestick-series",candlesticks:null,flags:{},zIndex:5,maxWidth:30},o.extend(e,r),o.augment(e,{renderUI:function(){var t=this;e.superclass.renderUI.call(t),t.processColor(),t.renderLabels(),t.renderMarkers(),t.get("autoPaint")&&t.paint(),t.set("candlesticksGroup",t.addGroup(n,t.get("candlesticks")))},changeShapes:function(t){var e=this,a=e.get("candlesticksGroup");t=t||this._getPoints(),e._setWidth(t.length);var r=[];o.each(t,function(t,a){var i=e.__getShapeCfg(t,a);r.push(i)}),a.change(r),e.set("items",r);var i=e._getFlagsCfg(t),n=e.get("flagGroup");n&&n.change(i)},_setWidth:function(t){var e=this,a=e.get("xAxis"),r=e.get("maxWidth"),i=a.get("plotRange"),n=i.getWidth()/(2*t);e.set("singleWidth",Math.min(n,r))},getTipInfo:function(t){for(var e=this,a=[],r=e.get("color"),i=e.get("tipNames")||["open","high","low","close"],n=e.get("tipColors")||[r,r,r,r],o=0;4>o;o++){var g={};g.name=i[o],g.value=t.arr[o+1].toFixed(2),g.color=n[o],g.suffix=e.get("suffix"),a.push(g)}return a},getData:function(t){var e=this,a=e.get("data"),r=[];return"xAxis"==t?r=o.map(a,function(t){return t[0]}):o.each(a,function(t){var e=t.slice(1,5);r.push(Math.max.apply(null,e)),r.push(Math.min.apply(null,e))}),r},draw:function(t,e){var a=this;a._setWidth(t.length);var r=[];o.each(t,function(t,e){var t=a._drawShape(t,e);r.push(t)}),a.set("items",r);var n=a.get("flagGroup"),g=a.get("flags");if(g&&!n){var r=a._getFlagsCfg(t);g.items=r,n=a.addGroup(i,g),a.set("flagGroup",n)}e&&e()},_drawShape:function(t,e){var a=this,r=a.get("candlesticksGroup"),i=a.__getShapeCfg(t,e);r||(r=a.addGroup(n,a.get("candlesticks")),a.set("candlesticksGroup",r));var o=r.addCandlestick(i);return o},__getShapeCfg:function(t){var e=this,a=e.get("singleWidth"),r=t.arr,i=[];i.push(t);var n=e.getPointByValue(r[0],r[2]);i.push(n);var o=e.getPointByValue(r[0],r[3]);i.push(o);var g=e.getPointByValue(r[0],r[4]);i.push(g);var s={points:i,singleWidth:a};return s},_getFlagsCfg:function(t){var e,a,r=this,i=[],n=r.get("flags");return n&&(o.each(t,function(t,r){var i=t.arr,n=i[2],o=i[3];if(0==r)e=a=t;else{var g=e.arr[2],s=a.arr[3];n>=g&&(e=t),s>=o&&(a=t)}}),n.max&&i.push(o.mix({},n.max,{point:r.getPointByValue(e.arr[0],e.arr[2])})),n.min&&i.push(o.mix({},n.min,{point:r.getPointByValue(a.arr[0],a.arr[2])}))),i}}),t=e}(),e=function(e){function a(t){var e={};for(var a in t)e[a]=t[a];return e}function r(t){for(var e=[],r=0;r<t.length;r++)e.push("object"!=typeof t[r]?t[r]:a(t[r]));return e}var i=window.AChart,n=i.Util,o=i.Tooltip,g=i.Theme;i.Series.Candlestick=t,g.rangeSelector={tooltip:null,legend:null,animate:!1,title:null,subTitle:null,yAxis:{grid:null,labels:null,title:null},xAxis:{type:"time",grid:null,labels:null,autoAppend:0},seriesOptions:{areaCfg:{markers:null,animate:!1,line:{stroke:"#ddd"},area:{"fill-opacity":.5,fill:"#efefef",stroke:"#ddd","stroke-width":1}}},hidden:!1,minZoomInterval:!1,realtime:!1,dragDelay:100,plots:null,dragRefresh:!0,autoRefresh:!0,zoomChange:null,sampling:{enable:!1,max:100},zoom:null,selectAreaCfg:{fill:"#717acb","fill-opacity":.4,stroke:"#bbbbbb"}};var s=function(t){this._attrs=n.mix({},s.ATTRS,t),this.events={}};return s.ATTRS={zoom:null,rangeSelectorOption:{},chart:null,rangeSelector:null,chartHtml:null,rangeSelectorHtml:null,margin:50},n.augment(s,{get:function(t){return this._attrs[t]},set:function(t,e){return this._attrs[t]=e,this},render:function(){var t=this;if(!t.get("id"))throw"You must assign id for the chart!";t.paint()},paint:function(){var t=this;t._initContainer(),t._initRangeSelector(),t._initChart(),t._fixRangeSelectorSeries(),t._fixChartSeriesAndRender(),t._renderTooltip()},getSeries:function(){return this.get("originData")},changeData:function(t){var e=this,a=e.get("rangeSelector"),r=a.get("realtime"),i=a.get("zoom")||e.get("zoom"),o=e.get("originData"),g=t[0];if(a.changeData(n.isArray(g[0])?t:t[0]),n.each(o,function(e,a){e.data=t[a]}),r){var s=e.get("navigator_select_area"),l=s.attr("x"),h=s.attr("width"),c=a.get("width"),d=e.get("margin");l+h+d==c?e.getTimesByNavigator():i?e.setZoom(i[0],i[1]):e.setZoom()}else i?e.setZoom(i[0],i[1]):e.setZoom()},_initContainer:function(){{var t=this;t.get("margin")}id=t.get("id")||t.get("render")||"",id=id.replace("#","");var e=document.getElementById(id),a=(t.get("width")||n.getWidth(e),t.get("height")||n.getHeight(e),"aChart-"+id+"-chart"),r="aChart-"+id+"-rangeSelector",i=n.createDom('<div id="'+a+'"></div>'),o=n.createDom('<div id="'+r+'"></div>');e.appendChild(i),e.appendChild(o),t.set("chartHtml",i),t.set("rangeSelectorHtml",o),t.set("chartHtmlId",a),t.set("rangeSelectorHtmlId",r);var g=t.get("rangeSelectorOption").plots;if(g&&g.length>0)for(var s=0;s<g.length;s++){var l=n.createDom('<div id="'+a+"-"+s+'" style="height:'+g[s].height+'px"></div>');i.appendChild(l)}},_initRangeSelector:function(){var t=this,e=t.get("margin"),a=t.get("rangeSelectorHtml"),r=t.get("rangeSelectorHtmlId"),o=t.get("width")||n.getWidth(a),s=n.mix({},g.rangeSelector,t.get("rangeSelectorOption")),s=n.mix({},s,{id:r,animate:!1,width:o,height:55,plotCfg:{margin:[5,e,17,e]}});t.get("xAxis")&&t.get("xAxis").type&&(s.xAxis.type=t.get("xAxis").type);var l=new i(s);t.set("rangeSelector",l)},_initChart:function(){var t=this,e=(t.get("margin"),t.get("chartHtml")),a=t.get("chartHtmlId"),r=t.get("width")||n.getWidth(e),o=t.get("height")||n.getHeight(e),g=t.get("rangeSelectorOption").plots;if(g&&g.length>0){for(var s=[],l=0;l<g.length;l++){var h=g[l],c=(t._attrs.xAxis,n.mix({},{id:a+"-"+l,width:r,legend:null,tooltip:null},h)),d=new i(n.mix({},t._attrs,c));s.push(d)}t.set("chart",s[0]),t.set("charts",s)}else{var d=new i(n.mix({},t._attrs,{id:a,width:r,height:o-70}));t.set("chart",d),t.set("charts",[d])}},_fixChartSeriesAndRender:function(){var t=this,e=t.get("charts"),r=t.get("originData"),i=t.get("rangeSelector"),o=i.get("zoom")||t.get("zoom");n.each(e,function(t,e){var i=[];n.each(r,function(t){t.plotIndex||(t.plotIndex=0),t.plotIndex==e&&i.push(a(t))}),t.set("series",i),n.each(i,function(t){t.data=[]}),t.render()}),o?t.setZoom(o[0],o[1]):t.setZoom()},_fixRangeSelectorSeries:function(){var t=this,e=t.get("rangeSelector"),a=t.get("chart"),i=a.get("series"),o=[],g=r(i);if(t.set("originData",g),i.length>0){var s=n.mix({},{type:"area",animate:!1},e.get("seriesOptions").areaCfg),l=n.mix({},i[0],s);o.push(l)}e.set("series",o),e.render(),t.get("rangeSelectorOption").hidden&&(e.get("canvas").get("node").style.display="none")},_renderTooltip:function(){var t=this,e=t.get("charts"),a=e[0],r=t.get("rangeSelectorOption").plots;if(r&&r.length>0&&t.get("tooltip")){var i=a.get("canvas"),g=a.get("plotRange"),s=n.mix({},t._attrs.tooltip||{},{plotRange:g});if(t.get("tooltip")&&t.get("tooltip").crosshairs){var l=[];n.each(e,function(e){var a,r,i=e.get("canvas"),o=e.get("plotRange");o?(a=o.bl.y,r=o.tl.y):(a=i.get("height"),r=0);var g=i.addShape({type:"line",visible:!1,zIndex:3,attrs:n.mix({},t.get("tooltip").crossLine||{},{x1:0,y1:a,x2:0,y2:r})});l.push(g)}),t.set("crosshairsGroup",l)}var h=i.addGroup(o,s);n.each(e,function(e){var a=e.get("canvas");a.on("mouseout",function(){h.hide(),l&&n.each(l,function(t){t.hide()})}),e.on("plotmove",function(e){var a=t.get("tooltip");a.tipmove&&a.tipmove(e),h.show();var r={x:e.x,y:e.y},i=t.get("crosshairsGroup"),o=t._getTipInfo(r);return 0==o.items.length?(h.hide(),h.setPosition(r.x,r.y),void n.each(i,function(t){t.attr({x1:e.x,x2:e.x}),t.hide()})):(h.setTitle(o.title),h.setItems(o.items),h.setPosition(r.x,r.y),void n.each(i,function(t){t.attr({x1:e.x,x2:e.x}),t.show()}))})})}},_getTipInfo:function(t){var e=this,a=e.get("charts"),r=[];n.each(a,function(t){var e=t.getSeries();n.each(e,function(t){r.push(t)})});var i=a[0].get("seriesGroup"),o=r[0],g=o.get("xAxis"),s=o.getTrackingInfo(t),l=i._getTipInfo(r,t);if("candlestick"==o.get("type")&&s&&s.xValue!=s.arr[5]&&o.get("isSimpling")){var h=g?g.formatPoint(s.arr[5]):s.arr[5];l.title=h+" ~ "+l.title}return l},_renderScrollGroup:function(){var t=this,e=t.get("margin"),a=t.get("scrollGroup"),r=t.get("rangeSelector"),i=r.get("width"),n=(r.get("height"),a.addShape({type:"rect",id:"scrollBar",attrs:{x:e,y:38,width:i-2*e,height:15,stroke:"",fill:"#eeeeee"}}));t.set("scrollBar",n),a.addShape("path",{path:"M"+(e-15)+",0L"+(i-e+15)+",0",stroke:"#aaaaaa","stroke-width":2});var o="M"+(e-15+8)+",44L"+(e-15+6)+",46L"+(e-15+8)+",48L"+(e-15+8)+",44z";a.addShape("path",{path:o,stroke:"#000",fill:"#000"});var g=a.addShape({type:"rect",attrs:{x:e-15,y:38,width:15,height:15,stroke:"#bbbbbb",fill:"#ebe7e8","fill-opacity":.6}});t.set("navigator_scroll_left",g);var o="M"+(i-e+7)+",44L"+(i-e+9)+",46L"+(i-e+7)+",48L"+(i-e+7)+",44z";a.addShape("path",{path:o,stroke:"#000",fill:"#000"});var s=a.addShape("rect",{x:i-e,y:38,width:15,height:15,stroke:"#bbbbbb",fill:"#ebe7e8","fill-opacity":.6});t.set("navigator_scroll_right",s);var o="M"+(i/2-3)+",43L"+(i/2-3)+",48M"+i/2+",43L"+i/2+",48M"+(i/2+3)+",43L"+(i/2+3)+",48",l=a.addShape({id:"navigator_bottom_path",type:"path",attrs:{path:o,stroke:"#aaaaaa"}});t.set("navigator_bottom_path",l)},_renderNavigatorGroup:function(){var t=this,e=t.get("margin"),a=t.get("navigatorGroup"),r=t.get("rangeSelector"),i=r.get("width"),o=r.get("selectAreaCfg"),g=(r.get("height"),a.addShape({type:"rect",id:"navigator_select_area",attrs:n.mix({},o,{x:e,y:0,width:i-2*e,height:53})}));t.set("navigator_select_area",g);var s=a.addShape({id:"navigator_handle_left_path",type:"path",attrs:{path:t._getHandlePath(e-5),stroke:"#000"}});t.set("navigator_handle_left_path",s);var l=a.addShape({type:"rect",id:"navigator_handle_left",attrs:{x:e-5,y:12,stroke:"#aaaaaa",fill:"#ebe7e8","fill-opacity":.8,width:10,height:15}});t.set("navigator_handle_left",l);var h=a.addShape({id:"navigator_handle_right_path",type:"path",attrs:{path:t._getHandlePath(i-e-5),stroke:"#000"}});t.set("navigator_handle_right_path",h);var c=a.addShape({type:"rect",id:"navigator_handle_right",attrs:{x:i-e-5,y:12,stroke:"#aaaaaa",fill:"#ebe7e8","fill-opacity":.8,width:10,height:15}});t.set("navigator_handle_right",c)},_addAreaSelectShapes:function(){var t=this,e=(t.get("margin"),t.get("rangeSelector")),a=e.get("canvas"),r=(e.get("width"),e.get("height"),a.addGroup({zIndex:6}));t.set("scrollGroup",r);var i=a.addGroup({zIndex:6});t.set("navigatorGroup",i),t._renderScrollGroup(),t._renderNavigatorGroup()},_getHandlePath:function(t){var e="M"+(4+t)+",16L"+(4+t)+",23M"+(6+t)+",16L"+(6+t)+",23";return e},setZoom:function(t,e){var a=this;a._setZoom(t,e),a.setNavigatorByTime(t,e)},_setZoom:function(t,e){var a=this,r=a.get("rangeSelector"),i=r.get("autoRefresh"),o=r.get("zoomChange"),g=r.get("sampling"),s=a.get("originData"),l=a.get("charts");i&&n.each(l,function(r,i){var o=r.getSeries(),h=[];n.each(s,function(t){t.plotIndex||(t.plotIndex=0),t.plotIndex==i&&h.push(t)}),n.each(h,function(r,i){var s=a.getPlotData(r),h=o[i],c=r.pointStart,d=r.pointInterval,u=[];if(c&&d){var p=t?parseInt((t-c)/d,10):0,v=e?Math.ceil((e-c)/d):s.length;p=0>p?0:p,u=s.slice(p,v+1);var f=t||c;h.set("pointStart",f)}else{if(n.each(s,function(a){var r=a[0];"flag"==h.get("type")&&(r=a.x),(!t||r>=t)&&(!e||e>=r)&&u.push(a)}),g&&g.enable&&u.length>g.max){var _=a.getSamplingType(h);u=a._simplingData(u,_),h.set("isSimpling",!0)}else h.set("isSimpling",!1);if(h.get("onCandlestick")){var m=h.get("onCandlestick"),x=l[0].getSeries()[0].get("data");n.each(x,function(t,e){var a=t[1],r=t[4],i=a>=r?m.fallCfg:m.riseCfg;if(i){var n=u[e][0],o=u[e][1];u[e]={x:n,y:o,attrs:i}}})}}u.length>0?h.show():h.hide(),h.changeData(u)}),r.repaint()}),a.set("zoom",[t,e]),r.set("zoom",[t,e]),o&&o(t,e)},getPlotData:function(t){var e=this,a=e.get("originData"),r=t.data;if(t.dataIndex){var i=t.dataIndex,o=a[0].data;o&&(r=[],n.each(o,function(t){var e=[];e[0]=t[0],n.isArray(i)?n.each(i,function(a,r){e[r+1]=t[a]}):e[1]=t[i],r.push(e)}))}return r},getSamplingType:function(t){var e=t.get("samplingType"),a=e||t.get("type");switch(a){case"candlestick":a="stock";break;case"column":a="sum"}return a},_simplingData:function(t,e){for(var a=this,i=a.get("rangeSelector"),n=i.get("sampling"),o=t.length-1,g=Math.ceil(o/n.max),s=parseInt(o/g,10),l=g*s,h=[],c=o==l?0:o-l,d=c;o-g>=d;d+=g){var u=d+1,p=r(t[u]),v=r(t[d+g]);if("sum"==e){for(var f=[v[0],p[1]],_=u+1;g+d>=_;_++){var m=t[_];f[1]+=m[1]}h.push(f)}else if("stock"==e){for(var f=[v[0],p[1],p[2],p[3],v[4],p[0]],_=u;g+d>=_;_++){var m=t[_];f[2]=Math.max(m[2],f[2]),f[3]=Math.min(m[3],f[3])}h.push(f)}else if("avg"==e){for(var f=[v[0],p[1]],_=u+1;g+d>=_;_++){var m=t[_];f[1]+=m[1]}h.push(f)}}return 0==h.length?t:h},setNavigatorByTime:function(t,e){var a=this,r=a.get("rangeSelector"),i=r.get("width"),n=a.get("margin"),o=(r.get("canvas"),r.get("seriesGroup").get("xAxis")),g=a.get("navigator_select_area");g||(a._addAreaSelectShapes(),a.dragEvents(),g=a.get("navigator_select_area"));var s=(t?o.getOffset(t):n)||n,l=(e?o.getOffset(e):i-n)||i-n,i=l-s;g.attr("width",i),a._getAreaByX(s),a._getHandleByArea(),a._changeBottomPath()},getTimesByNavigator:function(){var t=this,e=t.get("rangeSelector"),a=e.get("canvas"),r=a.getLast(),i=e.get("seriesGroup").get("xAxis"),n=r.find("navigator_select_area"),o=n.attr("x"),g=n.attr("x")+n.attr("width"),s=i.getValue(o),l=i.getValue(g);t._setZoom(s,l,!0)},dragEvents:function(){var t,e,a,r,i=this,n=1,o=i.get("margin"),g=i.get("rangeSelector"),s=g.get("dragRefresh"),l=g.get("minZoomInterval"),h=g.get("width"),c=(g.get("canvas"),i.get("navigator_select_area")),d=i.get("navigator_handle_left"),u=i.get("navigator_handle_left_path"),p=i.get("navigator_handle_right"),v=i.get("navigator_handle_right_path"),f=(i.get("navigator_bottom_path"),i.get("navigator_scroll_left")),_=i.get("navigator_scroll_right"),m=g.get("dragDelay"),x=i.get("scrollBar"),y=g.get("seriesGroup").get("xAxis");if(l&&l>0){var S=y.getValue(o),w=S+l;n=y.getOffset(w)-y.getOffset(S)}c.drag(function(t){var a=e+t;i._getAreaByX(a),i._getHandleByArea(),i._changeBottomPath(),s&&(r&&clearTimeout(r),r=setTimeout(function(){i.getTimesByNavigator()},m))},function(){e=c.attr("x"),c.attr("cursor","ew-resize"),i.set("onDrag",!0)},function(){s||i.getTimesByNavigator(),c.attr("cursor","default"),i.set("onDrag",!1)}),g.on("plotclick",function(t){if(!i.get("onDrag")){var e=c.attr("x"),a=c.attr("width");if((t.x<e||t.x>e+a)&&(t.shape&&"rect"!=t.shape.get("type")||!t.shape)){var r=(c.attr("x"),c.attr("width")),n=t.x-r/2;i._getAreaByX(n),i._getHandleByArea(),i._changeBottomPath(),i.getTimesByNavigator()}}}),f.on("click",function(){var t=h/20,e=c.attr("x"),a=e-t;i._getAreaByX(a),i._getHandleByArea(),i._changeBottomPath(),i.getTimesByNavigator()}),_.on("click",function(){var t=h/20,e=c.attr("x"),a=e+t;i._getAreaByX(a),i._getHandleByArea(),i._changeBottomPath(),i.getTimesByNavigator()}),x.on("click",function(t){var e=c.attr("x"),a=c.attr("width"),r=t.offsetX;r=r>e?a+e:e-a,i._getAreaByX(r),i._getHandleByArea(),i._changeBottomPath(),i.getTimesByNavigator()}),d.drag(function(g){var l=t+g;o-5>=l&&(l=o-5,g=o-5-t);var h=p.attr("x");l>=h-n&&(l=h-n,g=h-n-t),d.attr("x",l);var v=i._getHandlePath(l);u.attr("path",v),c.attr("x",e+g),c.attr("width",a-g),i._changeBottomPath(),s&&(r&&clearTimeout(r),r=setTimeout(function(){i.getTimesByNavigator()},m))},function(){t=d.attr("x"),e=c.attr("x"),a=c.attr("width"),d.attr("cursor","ew-resize"),i.set("onDrag",!0)},function(){s||i.getTimesByNavigator(),d.attr("cursor","default"),i.set("onDrag",!1)}),p.drag(function(e){var g=t+e,l=d.attr("x");l+n>=g&&(g=l+n,e=l+n-t),g>=h-o-5&&(g=h-o-5,e=h-o-5-t),p.attr("x",g);var u=i._getHandlePath(g);v.attr("path",u),c.attr("width",a+e),i._changeBottomPath(),s&&(r&&clearTimeout(r),r=setTimeout(function(){i.getTimesByNavigator()},m))},function(){t=p.attr("x"),e=c.attr("x"),a=c.attr("width"),p.attr("cursor","ew-resize"),i.set("onDrag",!0)},function(){s||i.getTimesByNavigator(),p.attr("cursor","default"),i.set("onDrag",!1)})},_changeBottomPath:function(){var t=this,e=t.get("navigator_handle_left"),a=t.get("navigator_handle_right"),r=t.get("navigator_bottom_path"),i=e.attr("x")+5,n=a.attr("x")+5,o=i+n;if(20>=n-i)return void r.attr("path","");var g="M"+(o/2-3)+",43L"+(o/2-3)+",48M"+o/2+",43L"+o/2+",48M"+(o/2+3)+",43L"+(o/2+3)+",48";r.attr("path",g)},_getHandleByArea:function(){var t=this,e=t.get("navigator_select_area"),a=t.get("navigator_handle_left"),r=t.get("navigator_handle_left_path"),i=t.get("navigator_handle_right"),n=t.get("navigator_handle_right_path"),o=e.attr("x"),g=e.attr("width"),s=o-5;a.attr("x",s),r.attr("path",t._getHandlePath(s));var l=s+g;i.attr("x",l),n.attr("path",t._getHandlePath(l))},_getAreaByX:function(t){var e=this,a=e.get("margin"),r=e.get("rangeSelector"),i=r.get("width"),n=e.get("navigator_select_area"),o=n.attr("width");a>=t?t=a:t+o>=i-a&&(t=i-a-o),n.attr("x",t)},clear:function(){var t=this,e=t.get("charts"),a=t.get("rangeSelector");n.each(e,function(t){t.clear()}),a.clear()}}),e=s}(),a=function(t){var a=e;return window.AStock=a,t=a}()}();