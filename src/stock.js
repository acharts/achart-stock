var Chart = require('acharts')//window.AChart,
    Util = Chart.Util,
    Theme = Chart.Theme;

Theme.rangeSelector = {
    tooltip: null,
    legend: null,
    animate: false,
    title : {
        text : ''
    },
    subTitle : {
        text : ''
    },
    yAxis : {
        grid: null,
        labels: null,
        title : {
            text : '',
            rotate : -90
        }
    },
    xAxis : {
        type : 'time',
        grid: null,
        labels : null,
        autoAppend : 0
    },
    seriesOptions : {
        areaCfg : {
            markers: null,
            animate: false,
            area: {
             fill : 'rgb(245,247,250)',
             stroke : '#cccccc',
             'stroke-width': 1
            }
        }
    },

    sync: false,
    zoomChange: null,

    zoom: null
};

var Stock = function(cfg){
    this._attrs = Util.mix({},Stock.ATTRS,cfg);
    this.events = {};
};

Stock.ATTRS = {

    /**
     * 当前选择时间区域
     * @type {Object}
     */
    zoom: null,

    /**
     * 区域选择配置项
     * @type {Object}
     */
    rangeSelectorOption: null,

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
     * chart所在dom对象
     * @type {Object}
     */
    chartHtml: null,

    /**
     * rangeSelector所在dom对象
     * @type {Object}
     */
    rangeSelectorHtml: null,

    /**
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
        /*//添加滑动条
        _self._addAreaSelectShapes();
        //添加事件
        _self.dragEvents();*/
        //渲染chart
        _self._fixChartSeriesAndRender();
    },
    //数据修改
    changeData: function(data){
        var _self = this,
            rangeSelector = _self.get('rangeSelector'),
            zoom = rangeSelector.get('zoom') || _self.get('zoom'),
            originData = _self.get('originData');

        rangeSelector.changeData(data[0]);

        Util.each(originData,function(item,index){
            item.data = data[index];
        });

        !zoom ? _self.setZoom() : _self.setZoom(zoom[0],zoom[1]);
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
    },
    //初始化rangeSelector
    _initRangeSelector: function(){
        var _self = this,
            margin = _self.get('margin'),
            rangeSelectorHtml = _self.get('rangeSelectorHtml'),
            rangeSelectorId = _self.get('rangeSelectorHtmlId'),
            width = _self.get('width') || Util.getWidth(rangeSelectorHtml);

        var options = Util.mix({},Theme.rangeSelector,_self.get('rangeSelectorOption'));

        options = Util.mix({},options,{
            id: rangeSelectorId,
            animate: false,
            width: width,
            height: 55,
            plotCfg : {
                margin : [5,margin,15,margin] //画板的边距
            }
        });
        var rangeSelector = new Chart(options);

        _self.set('rangeSelector',rangeSelector);
    },
    //初始化cchart
    _initChart: function(){
        var _self = this,
            margin = _self.get('margin'),
            chartHtml = _self.get('chartHtml'),
            chartId = _self.get('chartHtmlId'),
            width = _self.get('width') || Util.getWidth(chartHtml),
            height = _self.get('height') || Util.getHeight(chartHtml);

        var chart = new Chart(Util.mix({},_self._attrs,{
            id: chartId,
            width: width,
            height: height - 70
        }))

        _self.set('chart',chart);
    },
    //修正series
    _fixChartSeriesAndRender: function(){
        var _self = this,
            chart = _self.get('chart'),
            rangeSelector = _self.get('rangeSelector'),
            chartSeries = chart.get('series'),
            zoom = rangeSelector.get('zoom') || _self.get('zoom');

        Util.each(chartSeries,function(item,index){
            item.data = [];
        });

        chart.render();

        !zoom ? _self.setZoom() : _self.setZoom(zoom[0],zoom[1]);
    },
    //修正series
    _fixRangeSelectorSeries: function(){
        var _self = this,
            rangeSelector = _self.get('rangeSelector'),
            chart = _self.get('chart');
        var series = chart.get('series'),
            newSeries = [];

        //数据缓存
        Object.prototype.clone = function() {
            var o = {};
            for (var i in this) {
                o[i] = this[i];
            }
            return o;
        };
        Array.prototype.clone = function() {
            var arr = [];
            for (var i = 0; i < this.length; i++)
                if (typeof this[i] !== 'object') {
                    arr.push(this[i]);
                } else {
                    arr.push(this[i].clone());
                }
            return arr;
        };
        var originData = series.clone();
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
    //添加滑动条等
    _addAreaSelectShapes: function(){
        var _self = this,
            margin  = _self.get('margin'),
            rangeSelector = _self.get('rangeSelector'),
            canvas = rangeSelector.get('canvas'),
            width = rangeSelector.get('width'),
            height = rangeSelector.get('height');

        //静默图形
        var static_group = canvas.addGroup();
        //可操作图形
        var navigator = canvas.addGroup();

        //下面滑动条
        scrollBar = navigator.addShape({
            type: 'rect',
            id: 'scrollBar',
            attrs: {
                x: margin,
                y: 39,
                width: width - (margin) * 2,
                height: 15,
                stroke: "",
                fill: '#eeeeee'
            }
        });

        _self.set('scrollBar',scrollBar);

        //上面线
        static_group.addShape('path',{
            path: 'M' + (margin - 15) + ',0L' + (width - margin + 15) + ',0',
            stroke: "#aaaaaa",
            'stroke-width': 2
        });

        //滑动条的两个button
        static_group.addShape('rect',{
            x : margin - 15,
            y : 39,
            width : 15,
            height : 15,
            stroke: "#bbbbbb",
            fill: '#ebe7e8'
        });

        var path = 'M' + (margin - 15 + 8) + ',45L' + (margin - 15 + 6) + ',47'
                  +'L' + (margin - 15 + 8) + ',49'
                  +'L' + (margin - 15 + 8) + ',45z';

        static_group.addShape('path',{
            path: path,
            stroke: "#666666",
            fill: '#666666'
        });

        static_group.addShape('rect',{
            x : width - margin,
            y : 39,
            width : 15,
            height : 15,
            stroke: "#bbbbbb",
            fill: '#ebe7e8'
        });

        var path = 'M' + (width - margin + 7) + ',45L' + (width - margin + 9) + ',47'
            +'L' + (width - margin + 7) + ',49'
            +'L' + (width - margin + 7) + ',45z';

        static_group.addShape('path',{
            path: path,
            stroke: "#666666",
            fill: '#666666'
        });

        var path = 'M' + (width/2 - 3) + ',44L' + (width/2 - 3) + ',49'
            +'M' + (width/2) + ',44L' + (width/2) + ',49'
            +'M' + (width/2 + 3) + ',44L' + (width/2 + 3) + ',49';

        var navigator_bottom_path = navigator.addShape({
            id: 'navigator_bottom_path',
            type: 'path',
            attrs: {
                path: path,
                stroke: "#aaaaaa"
            }
        });

        _self.set('navigator_bottom_path',navigator_bottom_path);

        var navigator_select_area = navigator.addShape({
            type: 'rect',
            id: 'navigator_select_area',
            attrs: {
                x : margin,
                y : 0,
                width: width - margin * 2,
                height: 54,
                fill: '#8cafda',
                stroke: "#bbbbbb",
                'fill-opacity': 0.2
            }
        });

        _self.set('navigator_select_area',navigator_select_area);

        var navigator_handle_left_path = navigator.addShape({
            id: 'navigator_handle_left_path',
            type: 'path',
            attrs: {
                path: _self._getHandlePath(margin - 5),
                stroke: "#000"
            }
        });

        _self.set('navigator_handle_left_path',navigator_handle_left_path);

        var navigator_handle_left = navigator.addShape({
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

        var navigator_handle_right_path = navigator.addShape({
            id: 'navigator_handle_right_path',
            type: 'path',
            attrs: {
                path: _self._getHandlePath(width - margin - 5),
                stroke: "#000"
            }
        });
        _self.set('navigator_handle_right_path',navigator_handle_right_path);

        var navigator_handle_right = navigator.addShape({
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
    _getHandlePath: function(x){
        var path = 'M' + (4 + x) + ',16L' + (4 + x ) + ',23'
            +'M' + (6 + x) + ',16L' + (6 + x ) + ',23';

        return path;
    },
    //设置时间区域
    setZoom: function(startTime,endTime){
        var _self = this;
        _self._setZoom(startTime,endTime);
        _self.setNavigatorByTime(startTime,endTime)
    },
    _setZoom: function(startTime,endTime){
        var _self = this,
            rangeSelector = _self.get('rangeSelector'),
        //是否异步
            sync = rangeSelector.get('sync'),
        //callback
            zoomChange = rangeSelector.get('zoomChange'),
            series = _self.get('originData'),
            chart =_self.get('chart'),
            chartSeries = chart.getSeries();

        if(!sync){
            Util.each(series,function(item, index){
                var data = item.data,
                    targetSeries = chartSeries[index],
                    pointStart = item.pointStart,
                    pointInterval = item.pointInterval;

                //存在pointStart
                if(pointStart && pointInterval){
                    var startIndex = startTime ? parseInt((startTime - pointStart) / pointInterval , 10) : 0,
                        endIndex = endTime ? Math.ceil((endTime - pointStart) / pointInterval) : data.length;

                    startIndex = startIndex < 0 ? 0 : startIndex;
                    var newData = data.slice(startIndex,endIndex + 1);
                    var start = parseInt((startTime || pointStart)/pointInterval) * pointInterval;
                    targetSeries.set('pointStart',start);
                    targetSeries.changeData(newData);

                }else{
                    var dataArr = [];
                    Util.each(data,function(model, i){
                        var dataTime = model[0];

                        //如果是flag  特殊处理
                        if(targetSeries.get('type') == 'flag'){
                            dataTime = model.x
                        }

                        if( (!startTime || startTime <= dataTime) && (!endTime || endTime >= dataTime)){
                            dataArr.push(model);
                        }
                    });
                    targetSeries.changeData(dataArr);
                }
            });

            chart.repaint();
        }

        _self.set('zoom',[startTime,endTime]);
        rangeSelector.set('zoom',[startTime,endTime]);

        //回调事件
        zoomChange && zoomChange(startTime,endTime);
    },
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

        var x = xAxis.getOffset(startTime) || (margin),
            end_x = xAxis.getOffset(endTime) || (width - margin),
            width = end_x - x;

        navigator_select_area.attr('width',width);

        _self._getAreaByX(x);
        _self._getHandleByArea();
        _self._changeBottomPath();
    },
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
    dragEvents: function(){
        var _self = this,
            margin = _self.get('margin'),
            rangeSelector = _self.get('rangeSelector'),
            width = rangeSelector.get('width'),
            canvas = rangeSelector.get('canvas'),
            navigator_select_area = _self.get('navigator_select_area'),
            navigator_handle_left = _self.get('navigator_handle_left'),
            navigator_handle_left_path = _self.get('navigator_handle_left_path'),
            navigator_handle_right = _self.get('navigator_handle_right'),
            navigator_handle_right_path = _self.get('navigator_handle_right_path'),
            navigator_bottom_path = _self.get('navigator_bottom_path'),
            scrollBar = _self.get('scrollBar'),
            xAxis = rangeSelector.get('xAxis'),
            yAxis = rangeSelector.get('yAxis');

        var xHandleBefore,xAreaBefore,widthAreaBefore;

        //区域拖拽事件
        navigator_select_area.drag(function(dx,dy,x,y,event){
            var currX = xAreaBefore + dx;

            _self._getAreaByX(currX);
            _self._getHandleByArea();
            _self._changeBottomPath();

            _self.getTimesByNavigator();
        },function(){
            xAreaBefore = navigator_select_area.attr('x');
        },function(){

        })

        //区域点击事件
        rangeSelector.on('plotclick',function(ev){
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
            if(currX >= rightLimit - 5){
                currX = rightLimit - 5;
                dx = rightLimit - 5 - xHandleBefore;
            }

            navigator_handle_left.attr('x',currX);
            var path = _self._getHandlePath(currX);
            navigator_handle_left_path.attr('path',path);

            navigator_select_area.attr('x',xAreaBefore + dx);
            navigator_select_area.attr('width',widthAreaBefore - dx);

            _self._changeBottomPath();

            _self.getTimesByNavigator();
        },function(x,y,event){
            xHandleBefore = navigator_handle_left.attr('x');

            xAreaBefore = navigator_select_area.attr('x');
            widthAreaBefore = navigator_select_area.attr('width');

        },function(event){

        })

        //右侧按钮拖拽事件
        navigator_handle_right.drag(function(dx,dy,x,y,event){
            var currX = xHandleBefore + dx;
            //左边边界
            var leftLimit = navigator_handle_left.attr('x');
            if(currX <= leftLimit + 5){
                currX = leftLimit + 5;
                dx = leftLimit + 5 - xHandleBefore;
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

            _self.getTimesByNavigator();
        },function(){
            xHandleBefore = navigator_handle_right.attr('x');

            xAreaBefore = navigator_select_area.attr('x');
            widthAreaBefore = navigator_select_area.attr('width');
        },function(){

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

        var path = 'M' + (width/2 - 3) + ',44L' + (width/2 - 3) + ',49'
            +'M' + (width/2) + ',44L' + (width/2) + ',49'
            +'M' + (width/2 + 3) + ',44L' + (width/2 + 3) + ',49';

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
        navigator_handle_right.attr('x',rightHandleX)
        navigator_handle_right_path.attr('path',_self._getHandlePath(rightHandleX));
    },
    //根据x重新划分区域
    _getAreaByX: function(currX){
        var _self = this,
            margin = _self.get('margin'),
            rangeSelector = _self.get('rangeSelector'),
            width = rangeSelector.get('width'),
            navigator_select_area = _self.get('navigator_select_area')

        var widthArea = navigator_select_area.attr('width');
        //左边边界
        if(currX <= margin){
            currX = margin;
        }
        else if(currX + widthArea >= width - margin){
            currX = width - margin - widthArea;
        }

        navigator_select_area.attr('x',currX);
    }
});

module.exports = Stock;