/*
 *
 * @line图的tag
 *
 * */

var Cartesian = require('achart-series').Cartesian,
    ActiveGroup = require('achart-actived').Group,
    Flags = require('achart-flags'),
    Candlesticks = require('achart-candlesticks'),
    Util = require('achart-util');

/**
 * @class Chart.Series.Flag
 * 图列上面的标识
 * @extends Chart.Series.Cartesian
 */
function Candlestick(cfg){
    Candlestick.superclass.constructor.call(this,cfg);
}

Candlestick.ATTRS = {
    type : 'candlestick',

    elCls : 'x-chart-candlestick-series',
    /**
     * candlesticks 配置项
     * @type {Object}
     */
    candlesticks : null,

    /**
     * 最高和最低值flag的配置项
     * @type {Object}
     */
    flags: {
        /*flag:{
            distance: -10,
            line: {
                'stroke': '#ccc',
                'stroke-width': 1
            },
            shapeType: 'rect',
            shapeCfg: {
                width: 30,
                stroke: '#ccc'
            },
            title: 'B',
            titleCfg: {
                rotate : 90,
                fill : '#ccc',
                'font-size':12,
                'font-weight' : 'bold'
            }
        },
        max:{
            title: '最高'
        },
        min:{
            title: '最低'
        }*/
    },

    zIndex: 5,

    //每个蜡烛的最大宽度
    maxWidth: 30
};

Util.extend(Candlestick,Cartesian);
Util.mixin(Candlestick,[ActiveGroup]);

Util.augment(Candlestick,{
    renderUI: function(){
        var _self = this;
        Candlestick.superclass.renderUI.call(_self);

        _self.processColor();
        _self.renderLabels();
        _self.renderMarkers();
        if(_self.get('autoPaint')){
            _self.paint();
        }

        //添加Candlesticks
        _self.set('candlesticksGroup',_self.addGroup(Candlesticks,_self.get('candlesticks')));
    },
    /**
     *  @private
     *  重写legend导致的画面变动
     */
    changeShapes : function(points,animate){
        var _self = this,
            candlesticksGroup = _self.get('candlesticksGroup');

        points = points || this._getPoints();

        _self._setWidth(points.length);

        var newItems = [];

        Util.each(points, function (item, index) {
            var cfg = _self.__getShapeCfg(item, index)
            newItems.push(cfg);
        });

        candlesticksGroup.change(newItems);
        _self.set('items',newItems);

        //flag
        var items = _self._getFlagsCfg(points),
            flagGroup = _self.get('flagGroup');

        flagGroup && flagGroup.change(items);
    },
    //设置每个蜡烛的宽度
    _setWidth: function(pointNum){
        var _self = this,
            xAxis = _self.get('xAxis'),
            maxWidth = _self.get('maxWidth'),
            plotRange = xAxis.get('plotRange');

        var singleWidth = plotRange.getWidth()/(pointNum * 2);
        //宽度设置
        _self.set('singleWidth',Math.min(singleWidth,maxWidth));
    },
    /**
     * @protect
     * 获取提示信息
     * @return {*} 返回显示在上面的文本
     */
    getTipInfo : function(point){
        var _self = this,
            items = [];

        var seriesColor = _self.get('color'),
            tipNames = _self.get('tipNames') || ['open','high','low','close'],
            tipColors = _self.get('tipColors') || [seriesColor,seriesColor,seriesColor,seriesColor];

        for(var i = 0;i < 4; i ++){
            var item = {};
            item.name = tipNames[i];
            item.value = point.arr[i + 1].toFixed(2);
            item.color = tipColors[i];
            item.suffix = _self.get('suffix');

            items.push(item);
        }

        return items;
    },
    getData : function(type){
        var _self = this,
            data = _self.get('data'),
            rst = [];
        if(type == 'xAxis'){

            rst = Util.map(data,function(item){
                return item[0];
            });
        }else{
            Util.each(data,function(item){
                var tmp = item.slice(1,5);
                rst.push(Math.max.apply(null,tmp));
                rst.push(Math.min.apply(null,tmp));
            });
        }
        return rst;
    },
    //根据points画出标记
    draw : function(points,callback){
        var _self = this;

        _self._setWidth(points.length);
        var items = [];
        Util.each(points, function (item, index) {
            var item = _self._drawShape(item, index);
            items.push(item);
        });
        _self.set('items',items);

        //flag
        var flagGroup = _self.get('flagGroup'),
            flagsCfg = _self.get('flags');

        if(flagsCfg && !flagGroup){
            var items = _self._getFlagsCfg(points);

            flagsCfg.items = items;
            flagGroup = _self.addGroup(Flags,flagsCfg);
            _self.set('flagGroup',flagGroup);
        }

        callback && callback();
    },
    /**
     *  @private
     *  根据点绘制
     */
    _drawShape: function(point,index){
        var _self = this,
            candlesticksGroup = _self.get('candlesticksGroup');

        var cfg = _self.__getShapeCfg(point,index);
        if(!candlesticksGroup){
            //添加Candlesticks
            candlesticksGroup = _self.addGroup(Candlesticks,_self.get('candlesticks'))
            _self.set('candlesticksGroup',candlesticksGroup);
        }

        var candlestick = candlesticksGroup.addCandlestick(cfg);
        return candlestick;
    },
    //获取points信息 [open,high,low,close]
    __getShapeCfg: function(point,index){
        var _self = this,
            singleWidth = _self.get('singleWidth'),
            item = point.arr,
            points = [];

        points.push(point);
        var highPoint = _self.getPointByValue(item[0],item[2]);
        points.push(highPoint);
        var lowPoint = _self.getPointByValue(item[0],item[3]);
        points.push(lowPoint);
        var closePoint = _self.getPointByValue(item[0],item[4]);
        points.push(closePoint);

        //宽度设置
        var cfg = {
            points: points,
            singleWidth: singleWidth
        }

        return cfg;
    },
    //绘制最高点和最低点的flag
    _getFlagsCfg: function(points){
        var _self = this,
            items = [],
            flags = _self.get('flags'),
            maxPoint,minPoint;
        if(flags){
            Util.each(points,function(item,index){
                var point = item.arr,
                    max = point[2],min = point[3];
                if(index == 0){
                    maxPoint = minPoint = item;
                }else{
                    var selMax = maxPoint.arr[2],
                        selMin = minPoint.arr[3];

                    if(max >= selMax){
                        maxPoint = item;
                    }

                    if(min <= selMin){
                        minPoint = item;
                    }
                }
            });
            if(flags.max){
                items.push(Util.mix({},flags.max,{
                    point: _self.getPointByValue(maxPoint.arr[0],maxPoint.arr[2])
                }));
            }
            if(flags.min){
                items.push(Util.mix({},flags.min,{
                    point: _self.getPointByValue(minPoint.arr[0],minPoint.arr[2])
                }));
            }
        }
        return items;
    }
});

module.exports = Candlestick;