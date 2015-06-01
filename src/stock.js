var Chart = window.AChart,//require('acharts'),//
    Util = Chart.Util,
    Tooltip = Chart.Tooltip,
    Theme = Chart.Theme;

Chart.Series.Candlestick = require('./candlestick');

Theme.rangeSelector = {
    tooltip: null,
    legend: null,
    animate: false,
    title : null,
    subTitle : null,
    yAxis : {
        grid: null,
        labels: null,
        title : null
    },
    xAxis : {
        type : 'time',
        grid : null,
        labels : null,
        autoAppend : 0
    },
    seriesOptions : {
        areaCfg : {
            markers: null,
            animate: false,
            line: {
              stroke : '#ddd'
            },
            area: {
             'fill-opacity': 0.5,
             fill : '#efefef',
             stroke : '#ddd',
             'stroke-width': 1
            }
        }
    },
    //最小区间
    minZoomInterval:false,
    //是否实时数据
    realtime: false,
    //拖动时候的延迟
    dragDelay: 100,
    //是否多屏展示
    plots: null,
    //是否拖动中刷新数据
    dragRefresh:true,
    //是否自动刷新数据
    autoRefresh: true,
    //选择区域修改时候的回调函数
    zoomChange: null,
    //是否采样数据
    sampling: {
        enable: false,
        max: 100
    },
    //当前的选择的范围
    zoom: null,
    //拖动条的配置项
    selectAreaCfg: {
        fill: '#717acb',
        'fill-opacity': .4,
        stroke: '#bbbbbb'
    }
};

//数据缓存
function cloneObject(object){
    var o = {};
    for (var i in object) {
        o[i] = object[i];
    }
    return o;
}
function cloneArray(array){
    var arr = [];
    for (var i = 0; i < array.length; i++){
        if (typeof array[i] !== 'object') {
            arr.push(array[i]);
        } else {
            arr.push(cloneObject(array[i]));
        }
    }
    return arr;
}

/**
 * @class Stock
 * 大数据图形
 */

var Stock = function(cfg){
    this._attrs = Util.mix({},Stock.ATTRS,cfg);
    this.events = {};
};

Stock.ATTRS = {

    /**
     * 当前选择时间区域
     * @type {Array}
     */
    zoom: null,

    /**
     * 区域选择配置项
     * @type {Object}
     */
    rangeSelectorOption: {},

    /**
     * chart对象
     * @type {Object}
     */
    chart: null,

    /**
     * 下面区域选择对象
     * @type {Object}
     */
    rangeSelector: null,

    /**
     * @private
     * chart所在dom对象
     * @type {Object}
     */
    chartHtml: null,

    /**
     * @private
     * rangeSelector所在dom对象
     * @type {Object}
     */
    rangeSelectorHtml: null,

    /**
     * @private
     * 选择区域左右边界
     * @type {Number}
     */
    margin: 50
}

Util.augment(Stock,{
    get : function(name){
        return this._attrs[name];
    },
    set : function(name,value){
        this._attrs[name] = value;
        return this;
    },
    render : function(){
        var _self = this;
        if(!_self.get('id')){
            throw 'You must assign id for the chart!';
        }
        _self.paint();
    },
    //入口函数
    paint: function(){
        var _self = this;

        //初始化container
        _self._initContainer();
        //初始化rangeSelector
         _self._initRangeSelector();
        //初始化chart
        _self._initChart();
        //修正rangeSelector的series
        _self._fixRangeSelectorSeries();
        //渲染chart
        _self._fixChartSeriesAndRender();

        //渲染tooltip
        _self._renderTooltip();
    },
    /**
     * 获取图表的series
     */
    getSeries: function(){
      return this.get('originData');
    },
    /**
     * 修改数据
     * @param  {Array} data 新的数据源
     */
    changeData: function(data){
        var _self = this,
            rangeSelector = _self.get('rangeSelector'),
            realtime = rangeSelector.get('realtime'),
            zoom = rangeSelector.get('zoom') || _self.get('zoom'),
            originData = _self.get('originData');

        //控制区域数据修改
        //多个plot
        var firstSeriesData = data[0];
        if(Util.isArray(firstSeriesData[0])){
            rangeSelector.changeData(data);
        }else{
            rangeSelector.changeData(data[0]);
        }
        
        Util.each(originData,function(item,index){
            item.data = data[index];
        });
        //实时数据
        if(realtime){
            var navigator_select_area = _self.get('navigator_select_area'),
                currX = navigator_select_area.attr('x'),
                currWidth = navigator_select_area.attr('width'),
                width = rangeSelector.get('width'),
                margin = _self.get('margin');

            if(currX + currWidth + margin == width){
                _self.getTimesByNavigator();
            }else{
                !zoom ? _self.setZoom() : _self.setZoom(zoom[0],zoom[1]);
            }
        }else{
            !zoom ? _self.setZoom() : _self.setZoom(zoom[0],zoom[1]);
        }
    },
    //初始化dom
    _initContainer: function(){
        var _self = this,
            margin = _self.get('margin')
        id = _self.get('id') || _self.get('render') || '';
        id = id.replace('#','');

        var el = document.getElementById(id),
            width = _self.get('width') || Util.getWidth(el),
            height = _self.get('height') || Util.getHeight(el),
            chartId = 'aChart-' + id + '-chart',
            rangeSelectorId = 'aChart-' + id + '-rangeSelector',
            chartHtml = Util.createDom('<div id="'+ chartId +'"></div>'),
            rangeSelectorHtml = Util.createDom('<div id="'+ rangeSelectorId +'"></div>');

        el.appendChild(chartHtml);
        el.appendChild(rangeSelectorHtml);

        _self.set('chartHtml',chartHtml);
        _self.set('rangeSelectorHtml',rangeSelectorHtml);

        _self.set('chartHtmlId',chartId);
        _self.set('rangeSelectorHtmlId',rangeSelectorId);

        //多个plot
        var plots = _self.get('rangeSelectorOption').plots;
        if(plots && plots.length > 0){
            for(var i = 0;i < plots.length;i ++){
                var html =  Util.createDom('<div id="'+ chartId +'-'+ i +'"></div>');
                chartHtml.appendChild(html);
            }
        }
    },
    //初始化rangeSelector
    _initRangeSelector: function(){
        var _self = this,
            margin = _self.get('margin'),
            rangeSelectorHtml = _self.get('rangeSelectorHtml'),
            rangeSelectorId = _self.get('rangeSelectorHtmlId'),
            width = _self.get('width') || Util.getWidth(rangeSelectorHtml);

        var options = Util.mix({},Theme.rangeSelector,_self.get('rangeSelectorOption')),


        options = Util.mix({},options,{
            id: rangeSelectorId,
            animate: false,
            width: width,
            height: 55,
            plotCfg : {
                margin : [5,margin,17,margin] //画板的边距
            }
        });

        //x轴类型特殊处理
        if(_self.get('xAxis') && _self.get('xAxis').type){
            options.xAxis.type = _self.get('xAxis').type;
        }

        var rangeSelector = new Chart(options);

        _self.set('rangeSelector',rangeSelector);
    },
    //初始化chart
    _initChart: function(){
        var _self = this,
            margin = _self.get('margin'),
            chartHtml = _self.get('chartHtml'),
            chartId = _self.get('chartHtmlId'),
            width = _self.get('width') || Util.getWidth(chartHtml),
            height = _self.get('height') || Util.getHeight(chartHtml);

        //多个plot
        var plots = _self.get('rangeSelectorOption').plots;
        if(plots && plots.length > 0){
            var charts = [];
            for(var i = 0;i < plots.length;i ++){
                var plot = plots[i];
                var chart = new Chart(Util.mix({},_self._attrs,{
                    id: chartId + '-' + i,
                    width: width,
                    height: plot.height,
                    legend: null,
                    tooltip: null
                }));
                charts.push(chart);
            }
            _self.set('chart',charts[0]);
            _self.set('charts',charts);
        }else{
            var chart = new Chart(Util.mix({},_self._attrs,{
                id: chartId,
                width: width,
                height: height - 70
            }));

            _self.set('chart',chart);
            _self.set('charts',[chart]);
        }
    },
    //修正series
    _fixChartSeriesAndRender: function(){
        var _self = this,
            charts = _self.get('charts'),
            originData = _self.get('originData'),
            rangeSelector = _self.get('rangeSelector'),
            zoom = rangeSelector.get('zoom') || _self.get('zoom');

        //render所有chart
        Util.each(charts,function(chart,index){
            var series = [];
            Util.each(originData,function(item,order){
                if(!item.plotIndex) item.plotIndex = 0;

                if(item.plotIndex == index){
                    series.push(cloneObject(item));
                }
            });
            chart.set('series',series);
            Util.each(series,function(item,index){
                item.data = [];
            });
            chart.render();
        });

        !zoom ? _self.setZoom() : _self.setZoom(zoom[0],zoom[1]);
    },
    //修正series
    _fixRangeSelectorSeries: function(){
        var _self = this,
            rangeSelector = _self.get('rangeSelector'),
            chart = _self.get('chart');
        var series = chart.get('series'),
            newSeries = [];

        var originData = cloneArray(series);//.clone();
        _self.set('originData',originData);

        if(series.length > 0){
            //强制属性
            var options = Util.mix({},{
                type: 'area',
                animate: false
            },rangeSelector.get('seriesOptions').areaCfg);
            var newItem = Util.mix({},series[0],options);
            newSeries.push(newItem);
        }
        rangeSelector.set('series',newSeries);

        rangeSelector.render();
    },
    //对于多个chart stock上面渲染一个tooltip
    _renderTooltip: function(){
        var _self = this,
            charts = _self.get('charts'),
            chart = charts[0];

        //Util.each(charts,function(chart,index){
        //多个plot
        var plots = _self.get('rangeSelectorOption').plots;
        if(plots && plots.length > 0) {
            var canvas = chart.get('canvas'),
                plotRange = chart.get('plotRange'),
                cfg = Util.mix({}, _self._attrs.tooltip || {}, {
                    title: {
                        y: 12,
                        x: 8
                    },
                    offset: 10,
                    animate: false,
                    plotRange: plotRange,
                    crosshairs: false,
                    visible: false
                });

            //绘制crosshairs
            if(_self.get('tooltip') && _self.get('tooltip').crosshairs){
                var crosshairsGroup = [];
                Util.each(charts,function(chart,index){
                    var canvas = chart.get('canvas'),
                        stroke = "#C0C0C0",
                        plotRange = chart.get('plotRange');

                    var y1,
                        y2;
                    if(plotRange){
                        y1 = plotRange.bl.y;
                        y2 = plotRange.tl.y;
                    }else{
                        y1 = canvas.get('height');
                        y2 = 0;
                    }
                    var shape = canvas.addShape({
                        type : 'line',
                        visible : false,
                        zIndex : 3,
                        attrs : {
                            stroke : stroke,
                            x1 : 0,
                            y1 : y1,
                            x2 : 0,
                            y2 : y2
                        }
                    });
                    crosshairsGroup.push(shape);
                });

                _self.set('crosshairsGroup',crosshairsGroup)
            }

            var tooltip = canvas.addGroup(Tooltip, cfg);

            Util.each(charts,function(chart,index) {
                chart.on('plotover', function (ev) {
                    var crosshairsGroup = _self.get('crosshairsGroup');
                    tooltip.show()
                    if (crosshairsGroup) {
                        Util.each(crosshairsGroup, function (item, index) {
                            item.show();
                        })
                    }
                });

                chart.on('plotout', function (ev) {
                    tooltip.hide();
                    if (crosshairsGroup) {
                        Util.each(crosshairsGroup, function (item, index) {
                            item.hide();
                        })
                    }
                });

                chart.on('plotmove', function (ev) {
                    tooltip.show()
                    var point = {
                        x: ev.x,
                        y: ev.y
                    }, crosshairsGroup = _self.get('crosshairsGroup');

                    var tipInfo = _self._getTipInfo(point);

                    tooltip.setTitle(tipInfo.title);
                    tooltip.setItems(tipInfo.items);
                    tooltip.setPosition(point.x, point.y);

                    Util.each(crosshairsGroup, function (item, index) {
                        item.attr({
                            x1: ev.x,
                            x2: ev.x
                        });
                        item.show();
                    })
                });
            });
        }
        //})
    },
    //获取显示tooltip的内容
    _getTipInfo: function(point){
        var _self = this,
            charts = _self.get('charts');

        var sArray = [];
        Util.each(charts,function(chart,index){
            var chartSeries = chart.getSeries();
            Util.each(chartSeries,function(series,order){
                sArray.push(series);
            });
        });
        var seriesGroup = charts[0].get('seriesGroup'),
            series = sArray[0],
            xAxis = series.get('xAxis'),
            info = series.getTrackingInfo(point);

        //获取
        var rst = seriesGroup._getTipInfo(sArray,point);

        //特殊处理采样title
        if(series.get('type') == 'candlestick' && info && info.xValue != info.arr[5] && series.get('isSimpling')){
            var startTime = xAxis ? xAxis.formatPoint(info.arr[5]) : info.arr[5];
            rst.title = startTime + ' ~ ' + rst.title;
        }
        return rst;
    },
    //添加滚动条
    _renderScrollGroup: function(){
        var _self = this,
            margin  = _self.get('margin'),
            scrollGroup = _self.get('scrollGroup'),
            rangeSelector = _self.get('rangeSelector'),
            width = rangeSelector.get('width'),
            height = rangeSelector.get('height');

        //下面滑动条
        var scrollBar = scrollGroup.addShape({
            type: 'rect',
            id: 'scrollBar',
            attrs: {
                x: margin,
                y: 38,
                width: width - (margin) * 2,
                height: 15,
                stroke: "",
                fill: '#eeeeee'
            }
        });

        _self.set('scrollBar',scrollBar);

        //上面线
        scrollGroup.addShape('path',{
            path: 'M' + (margin - 15) + ',0L' + (width - margin + 15) + ',0',
            stroke: "#aaaaaa",
            'stroke-width': 2
        });

        //滑动条的两个button
        var path = 'M' + (margin - 15 + 8) + ',44L' + (margin - 15 + 6) + ',46'
            +'L' + (margin - 15 + 8) + ',48'
            +'L' + (margin - 15 + 8) + ',44z';

        scrollGroup.addShape('path',{
            path: path,
            stroke: "#000",
            fill: '#000'
        });

        var scroll_left = scrollGroup.addShape({
            type: 'rect',
            attrs: {
                x: margin - 15,
                y: 38,
                width: 15,
                height: 15,
                stroke: "#bbbbbb",
                fill: '#ebe7e8',
                'fill-opacity': 0.6
            }
        });
        _self.set('navigator_scroll_left',scroll_left);

        var path = 'M' + (width - margin + 7) + ',44L' + (width - margin + 9) + ',46'
            +'L' + (width - margin + 7) + ',48'
            +'L' + (width - margin + 7) + ',44z';

        scrollGroup.addShape('path',{
            path: path,
            stroke: "#000",
            fill: '#000'
        });


        var scroll_right = scrollGroup.addShape('rect',{
            x : width - margin,
            y : 38,
            width : 15,
            height : 15,
            stroke: "#bbbbbb",
            fill: '#ebe7e8',
            'fill-opacity':0.6
        });
        _self.set('navigator_scroll_right',scroll_right);


        var path = 'M' + (width/2 - 3) + ',43L' + (width/2 - 3) + ',48'
            +'M' + (width/2) + ',43L' + (width/2) + ',48'
            +'M' + (width/2 + 3) + ',43L' + (width/2 + 3) + ',48';

        var navigator_bottom_path = scrollGroup.addShape({
            id: 'navigator_bottom_path',
            type: 'path',
            attrs: {
                path: path,
                stroke: "#aaaaaa"
            }
        });

        _self.set('navigator_bottom_path',navigator_bottom_path);
    },
    //添加选择区域
    _renderNavigatorGroup: function(){
        var _self = this,
            margin  = _self.get('margin'),
            navigatorGroup = _self.get('navigatorGroup'),
            rangeSelector = _self.get('rangeSelector'),
            width = rangeSelector.get('width'),
            selectAreaCfg = rangeSelector.get('selectAreaCfg'),
            height = rangeSelector.get('height');

        var navigator_select_area = navigatorGroup.addShape({
            type: 'rect',
            id: 'navigator_select_area',
            attrs: Util.mix({},selectAreaCfg,{
                x : margin,
                y : 0,
                width: width - margin * 2,
                height: 53
            })
        });

        _self.set('navigator_select_area',navigator_select_area);

        var navigator_handle_left_path = navigatorGroup.addShape({
            id: 'navigator_handle_left_path',
            type: 'path',
            attrs: {
                path: _self._getHandlePath(margin - 5),
                stroke: "#000"
            }
        });

        _self.set('navigator_handle_left_path',navigator_handle_left_path);

        var navigator_handle_left = navigatorGroup.addShape({
            type: 'rect',
            id: 'navigator_handle_left',
            attrs: {
                x: margin - 5,
                y: 12,
                stroke: "#aaaaaa",
                fill: '#ebe7e8',
                'fill-opacity': 0.8,
                width: 10,
                height: 15
            }
        });

        _self.set('navigator_handle_left',navigator_handle_left);

        var navigator_handle_right_path = navigatorGroup.addShape({
            id: 'navigator_handle_right_path',
            type: 'path',
            attrs: {
                path: _self._getHandlePath(width - margin - 5),
                stroke: "#000"
            }
        });
        _self.set('navigator_handle_right_path',navigator_handle_right_path);

        var navigator_handle_right = navigatorGroup.addShape({
            type: 'rect',
            id: 'navigator_handle_right',
            attrs: {
                x: width - margin - 5,
                y: 12,
                stroke: "#aaaaaa",
                fill: '#ebe7e8',
                'fill-opacity': 0.8,
                width: 10,
                height: 15
            }
        });

        _self.set('navigator_handle_right',navigator_handle_right);
    },
    //添加图形
    _addAreaSelectShapes: function(){
        var _self = this,
            margin  = _self.get('margin'),
            rangeSelector = _self.get('rangeSelector'),
            canvas = rangeSelector.get('canvas'),
            width = rangeSelector.get('width'),
            height = rangeSelector.get('height');

        //滚动条group
        var scrollGroup = canvas.addGroup({
            zIndex: 6
        });
        _self.set('scrollGroup',scrollGroup);
        //选择区域group
        var navigatorGroup = canvas.addGroup({
            zIndex: 6
        });
        _self.set('navigatorGroup',navigatorGroup);

        _self._renderScrollGroup();
        _self._renderNavigatorGroup();

    },
    _getHandlePath: function(x){
        var path = 'M' + (4 + x) + ',16L' + (4 + x ) + ',23'
            +'M' + (6 + x) + ',16L' + (6 + x ) + ',23';

        return path;
    },
    /**
     * 设置选中的时间区间
     * @param  {Number} startTime  时间的毫秒数
     * @param  {Number} endTime 时间的毫秒数
     */
    setZoom: function(startTime,endTime){
        var _self = this;
        _self._setZoom(startTime,endTime);
        _self.setNavigatorByTime(startTime,endTime)
    },
    //根据时间选中选择区域
    _setZoom: function(startTime,endTime){
        var _self = this,
            rangeSelector = _self.get('rangeSelector'),
            //是否自动刷新数据
            autoRefresh = rangeSelector.get('autoRefresh'),
            //callback
            zoomChange = rangeSelector.get('zoomChange'),
            //sampling 是否采样
            sampling = rangeSelector.get('sampling'),
            originData = _self.get('originData'),
            charts =_self.get('charts');

        if(autoRefresh){
            Util.each(charts,function(chart,order){
                var chartSeries = chart.getSeries();

                //获取当前chart的原始数据
                var series = [];
                Util.each(originData,function(item,index){
                    if(!item.plotIndex) item.plotIndex = 0;
                    if(item.plotIndex == order){
                        series.push(item);
                    }
                });

                Util.each(series,function(item, index){
                    var data = _self.getPlotData(item),
                        targetSeries = chartSeries[index],
                        pointStart = item.pointStart,
                        pointInterval = item.pointInterval,
                        newData = [];
                    //存在pointStart
                    if(pointStart && pointInterval){
                        var startIndex = startTime ? parseInt((startTime - pointStart) / pointInterval , 10) : 0,
                            endIndex = endTime ? Math.ceil((endTime - pointStart) / pointInterval) : data.length;

                        startIndex = startIndex < 0 ? 0 : startIndex;
                        newData = data.slice(startIndex,endIndex + 1);
                        var start = (startTime || pointStart);
                        if(start != pointStart && start % pointInterval != 0){
                            //start = parseInt((startTime || pointStart)/pointInterval) * pointInterval;
                        }
                        targetSeries.set('pointStart',start);
                    }else{
                        Util.each(data,function(model, i){
                            var dataTime = model[0];

                            //如果是flag  特殊处理
                            if(targetSeries.get('type') == 'flag'){
                                dataTime = model.x
                            }

                            if( (!startTime || startTime <= dataTime) && (!endTime || endTime >= dataTime)){
                                newData.push(model);
                            }
                        });

                        //取样
                        if(sampling && sampling.enable && newData.length > sampling.max){
                            var samplingType = _self.getSamplingType(targetSeries);
                            newData = _self._simplingData(newData,samplingType);
                            targetSeries.set('isSimpling',true);
                        }else{
                            targetSeries.set('isSimpling',false);
                        }

                        //k线图 柱状图颜色变更
                        if(targetSeries.get('onCandlestick')){
                            var onCandlestick = targetSeries.get('onCandlestick'),
                                candleData = charts[0].getSeries()[0].get('data');

                            Util.each(candleData,function(item,index){
                                var openPoint = item[1],
                                    closePoint = item[4];

                                var cfg = openPoint >= closePoint ? onCandlestick.fallCfg : onCandlestick.riseCfg;
                                if(cfg){
                                    var time = newData[index][0],
                                        value = newData[index][1];
                                    newData[index] = {
                                        x: time,
                                        y: value,
                                        attrs: cfg
                                    }
                                }
                            });
                        }

                    }
                    //数据空的时候隐藏
                    newData.length > 0 ? targetSeries.show() : targetSeries.hide();

                    targetSeries.changeData(newData);
                });
                chart.repaint();
            });
        }

        _self.set('zoom',[startTime,endTime]);
        rangeSelector.set('zoom',[startTime,endTime]);

        //回调事件
        zoomChange && zoomChange(startTime,endTime);
    },
    //获取data
    getPlotData: function(item){
        var _self = this,
            originData = _self.get('originData');

        var data = item.data;
        if(item.dataIndex){
            var dataIndex = item.dataIndex,
                origin = originData[0].data;

            if(origin){
                data = [];
                Util.each(origin,function(item,index){
                    var arr = [];
                    arr[0] = item[0];
                    if(Util.isArray(dataIndex)){
                        Util.each(dataIndex,function(array,order){
                            arr[order + 1] = item[array];
                        });
                    }else{
                        arr[1] = item[dataIndex];
                    }
                    data.push(arr);
                });
            }
        }
        return data;
    },
    //获取采样类型
    getSamplingType: function(series){
        var _self = this,
            samplingType = series.get('samplingType'),
            type = samplingType || series.get('type');

        switch (type){
            case "candlestick":
                type = 'stock';
                break;
            case "column":
                type = 'sum';
                break;
        }

        return type;
    },
    //数据采样
    _simplingData: function(data,type){
        var _self = this,
            rangeSelector = _self.get('rangeSelector'),
            sampling = rangeSelector.get('sampling'),
            length = data.length - 1,
            avg = Math.ceil(length/sampling.max),
            interval = parseInt(length/avg, 10),
            finalLength = avg * interval,
            returnData = [];

        var startIndex = length == finalLength ? 0 :  length - finalLength;
        //k线图的合并采样
        for(var i = startIndex;i <= length - avg; i += avg){
            var start = i + 1,
                startData = cloneArray(data[start]),
                endData = cloneArray(data[i + avg]);

            if(type == 'sum'){
                var conData = [
                    endData[0],
                    startData[1]
                ];
                for(var j = start + 1; j <= avg + i; j ++){
                    var currData = data[j];
                    //sum
                    conData[1] += currData[1];
                }
                returnData.push(conData);
            }else if(type == 'stock'){
                var conData = [
                    endData[0],
                    startData[1],
                    startData[2],
                    startData[3],
                    endData[4],
                    startData[0]
                ];
                for(var j = start; j <= avg + i; j ++){
                    var currData = data[j];
                    //high
                    conData[2] = Math.max(currData[2],conData[2]);
                    //low
                    conData[3] = Math.min(currData[3],conData[3]);
                }
                returnData.push(conData);
            }else if(type == 'avg'){
                var conData = [
                    endData[0],
                    startData[1]
                ];
                for(var j = start + 1; j <= avg + i; j ++){
                    var currData = data[j];
                    //avg
                    conData[1] += currData[1];
                }
                returnData.push(conData);
            }
        }

        return returnData.length == 0 ? data : returnData;
    },
    //根据时间重新设置navigator
    setNavigatorByTime: function(startTime,endTime){
        var _self = this,
            rangeSelector = _self.get('rangeSelector'),
            width = rangeSelector.get('width'),
            margin = _self.get('margin'),
            canvas = rangeSelector.get('canvas'),
            xAxis = rangeSelector.get('seriesGroup').get('xAxis'),
            navigator_select_area = _self.get('navigator_select_area');

        if(!navigator_select_area){
            //添加滑动条
             _self._addAreaSelectShapes();
             //添加事件
             _self.dragEvents();

            navigator_select_area = _self.get('navigator_select_area');
        }

        var x = (startTime ? xAxis.getOffset(startTime) : (margin)) || margin,
            end_x = (endTime ? xAxis.getOffset(endTime) : (width - margin)) || (width - margin),
            width = end_x - x;

        navigator_select_area.attr('width',width);

        _self._getAreaByX(x);
        _self._getHandleByArea();
        _self._changeBottomPath();
    },
    //根据选中时间选择区间
    getTimesByNavigator: function(){
        var _self = this,
            rangeSelector = _self.get('rangeSelector'),
            canvas = rangeSelector.get('canvas'),
            navigator = canvas.getLast(),
            xAxis = rangeSelector.get('seriesGroup').get('xAxis'),
            navigator_select_area = navigator.find('navigator_select_area');

        var startValue = navigator_select_area.attr('x'),
            endValue = navigator_select_area.attr('x') + navigator_select_area.attr('width');

        var startValue_x = xAxis.getValue(startValue),
            endValue_x = xAxis.getValue(endValue);

        _self._setZoom((startValue_x),(endValue_x),true);
    },
    //绑定事件
    dragEvents: function(){
        var _self = this,
            minInterval = 1,//左右按钮距离限制
            margin = _self.get('margin'),
            rangeSelector = _self.get('rangeSelector'),
            //是否拖动刷新数据
            dragRefresh = rangeSelector.get('dragRefresh'),
            //可拖动的最小时间间距
            minZoomInterval = rangeSelector.get('minZoomInterval'),
            width = rangeSelector.get('width'),
            canvas = rangeSelector.get('canvas'),
            navigator_select_area = _self.get('navigator_select_area'),
            navigator_handle_left = _self.get('navigator_handle_left'),
            navigator_handle_left_path = _self.get('navigator_handle_left_path'),
            navigator_handle_right = _self.get('navigator_handle_right'),
            navigator_handle_right_path = _self.get('navigator_handle_right_path'),
            navigator_bottom_path = _self.get('navigator_bottom_path'),
            navigator_scroll_left = _self.get('navigator_scroll_left'),
            navigator_scroll_right = _self.get('navigator_scroll_right'),
            dragDelay = rangeSelector.get('dragDelay'),
            scrollBar = _self.get('scrollBar'),
            xAxis = rangeSelector.get('seriesGroup').get('xAxis');

        var xHandleBefore,xAreaBefore,widthAreaBefore,timeout;


        //有最小限制
        if(minZoomInterval && minZoomInterval > 0){
            var startTime = xAxis.getValue(margin),
                endTime = startTime + minZoomInterval;

            minInterval = xAxis.getOffset(endTime) - xAxis.getOffset(startTime);
        }

        //区域拖拽事件
        navigator_select_area.drag(function(dx,dy,x,y,event){
            var currX = xAreaBefore + dx;

            _self._getAreaByX(currX);
            _self._getHandleByArea();
            _self._changeBottomPath();

            if(dragRefresh){
                if(timeout) clearTimeout(timeout);
                timeout = setTimeout(function(){
                    _self.getTimesByNavigator();
                },dragDelay);
            }
        },function(){
            xAreaBefore = navigator_select_area.attr('x');
            navigator_select_area.attr('cursor','ew-resize');
            _self.set('onDrag',true);
        },function(){
            if(!dragRefresh){
                _self.getTimesByNavigator();
            }
            navigator_select_area.attr('cursor','default');
            _self.set('onDrag',false);
        })

        //区域点击事件
        rangeSelector.on('plotclick',function(ev){
            //拖拽中
            if(_self.get('onDrag')) return;

            var areaX = navigator_select_area.attr('x'),
                areaWidth = navigator_select_area.attr('width');
            if(ev.x < areaX || ev.x > areaX + areaWidth) {
                if ((ev.shape && ev.shape.get('type') != 'rect') || !ev.shape) {
                    var xBefore = navigator_select_area.attr('x'),
                        widthArea = navigator_select_area.attr('width');

                    var currX = ev.x - widthArea / 2;

                    _self._getAreaByX(currX);
                    _self._getHandleByArea();
                    _self._changeBottomPath();

                    _self.getTimesByNavigator();
                }
            }
        })

        //滚动条左右按钮点击事件
        navigator_scroll_left.on('click',function(ev){
            var eachTick = width/20,
                areaX = navigator_select_area.attr('x');

            var offsetX = areaX - eachTick;

            _self._getAreaByX(offsetX);
            _self._getHandleByArea();
            _self._changeBottomPath();

            _self.getTimesByNavigator();
        })

        navigator_scroll_right.on('click',function(ev){
            var eachTick = width/20,
                areaX = navigator_select_area.attr('x');

            var offsetX = areaX + eachTick;

            _self._getAreaByX(offsetX);
            _self._getHandleByArea();
            _self._changeBottomPath();

            _self.getTimesByNavigator();
        })

        //滚动条点击事件
        scrollBar.on('click',function(ev){
            var xArea = navigator_select_area.attr('x'),
                widthArea = navigator_select_area.attr('width'),
                offsetX = ev.offsetX;

            offsetX = offsetX > xArea ?  (widthArea + xArea) : ( xArea - widthArea);

            _self._getAreaByX(offsetX);
            _self._getHandleByArea();
            _self._changeBottomPath();

            _self.getTimesByNavigator();
        });

        //左边按钮拖拽事件
        navigator_handle_left.drag(function(dx,dy,x,y,event){
            var currX = xHandleBefore + dx;
            //左边边界
            if(currX <= (margin - 5)){
                currX = margin - 5;
                dx = margin - 5 - xHandleBefore;
            }
            //右边边界
            var rightLimit = navigator_handle_right.attr('x');
            if(currX >= rightLimit - minInterval){
                currX = rightLimit - minInterval;
                dx = rightLimit - minInterval - xHandleBefore;
            }

            navigator_handle_left.attr('x',currX);
            var path = _self._getHandlePath(currX);
            navigator_handle_left_path.attr('path',path);

            navigator_select_area.attr('x',xAreaBefore + dx);
            navigator_select_area.attr('width',widthAreaBefore - dx);

            _self._changeBottomPath();
            if(dragRefresh){
                if(timeout) clearTimeout(timeout);
                timeout = setTimeout(function(){
                    _self.getTimesByNavigator();
                },dragDelay);
            }
        },function(x,y,event){
            xHandleBefore = navigator_handle_left.attr('x');

            xAreaBefore = navigator_select_area.attr('x');
            widthAreaBefore = navigator_select_area.attr('width');
            navigator_handle_left.attr('cursor','ew-resize');

            _self.set('onDrag',true);
        },function(event){
            if(!dragRefresh){
                _self.getTimesByNavigator();
            }
            navigator_handle_left.attr('cursor','default');
            _self.set('onDrag',false);
        })

        //右侧按钮拖拽事件
        navigator_handle_right.drag(function(dx,dy,x,y,event){
            var currX = xHandleBefore + dx;
            //左边边界
            var leftLimit = navigator_handle_left.attr('x');
            if(currX <= leftLimit + minInterval){
                currX = leftLimit + minInterval;
                dx = leftLimit + minInterval - xHandleBefore;
            }
            //右边边界
            if(currX >= width - margin - 5){
                currX = width - margin - 5;
                dx = width - margin - 5 - xHandleBefore;
            }

            navigator_handle_right.attr('x',currX);
            var path = _self._getHandlePath(currX);
            navigator_handle_right_path.attr('path',path);

            navigator_select_area.attr('width',widthAreaBefore + dx);
            _self._changeBottomPath();
            if(dragRefresh){
                if(timeout) clearTimeout(timeout);
                timeout = setTimeout(function(){
                    _self.getTimesByNavigator();
                },dragDelay);
            }
        },function(){
            xHandleBefore = navigator_handle_right.attr('x');

            xAreaBefore = navigator_select_area.attr('x');
            widthAreaBefore = navigator_select_area.attr('width');
            navigator_handle_right.attr('cursor','ew-resize');

            _self.set('onDrag',true);
        },function(){
            if(!dragRefresh){
                _self.getTimesByNavigator();
            }
            navigator_handle_right.attr('cursor','default');

            _self.set('onDrag',false);
        })
    },
    //下侧button定位
    _changeBottomPath: function(){
        var _self = this,
            navigator_handle_left = _self.get('navigator_handle_left'),
            navigator_handle_right = _self.get('navigator_handle_right'),
            navigator_bottom_path = _self.get('navigator_bottom_path');

        var left = navigator_handle_left.attr('x') + 5,
            right = navigator_handle_right.attr('x') + 5,
            width = left + right;

        if(right - left <= 20){
            navigator_bottom_path.attr('path','');
            return ;
        }

        var path = 'M' + (width/2 - 3) + ',43L' + (width/2 - 3) + ',48'
            +'M' + (width/2) + ',43L' + (width/2) + ',48'
            +'M' + (width/2 + 3) + ',43L' + (width/2 + 3) + ',48';

        navigator_bottom_path.attr('path',path);
    },
    //根据选择区域 获取左右拖动按钮的位置
    _getHandleByArea: function(){
        var _self = this,
            navigator_select_area = _self.get('navigator_select_area'),
            navigator_handle_left = _self.get('navigator_handle_left'),
            navigator_handle_left_path = _self.get('navigator_handle_left_path'),
            navigator_handle_right = _self.get('navigator_handle_right'),
            navigator_handle_right_path = _self.get('navigator_handle_right_path');

        var currX = navigator_select_area.attr('x'),
            widthArea = navigator_select_area.attr('width');

        var leftHandleX = currX - 5;
        navigator_handle_left.attr('x',leftHandleX);
        navigator_handle_left_path.attr('path',_self._getHandlePath(leftHandleX));

        var rightHandleX = leftHandleX + widthArea;
        navigator_handle_right.attr('x',rightHandleX);
        navigator_handle_right_path.attr('path',_self._getHandlePath(rightHandleX));
    },
    //根据x重新划分区域
    _getAreaByX: function(currX){
        var _self = this,
            margin = _self.get('margin'),
            rangeSelector = _self.get('rangeSelector'),
            width = rangeSelector.get('width'),
            navigator_select_area = _self.get('navigator_select_area');

        var widthArea = navigator_select_area.attr('width');
        //左边边界
        if(currX <= margin){
            currX = margin;
        }
        else if(currX + widthArea >= width - margin){
            currX = width - margin - widthArea;
        }

        navigator_select_area.attr('x',currX);
    },
    //clear canvas
    clear: function(){
        var _self = this;
        var charts = _self.get('charts');
        var rangeSelector = _self.get('rangeSelector');

        Util.each(charts,function(chart){
            chart.clear();
        });
        rangeSelector.clear();
    }
});

module.exports = Stock;