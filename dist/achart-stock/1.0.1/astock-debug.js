;(function() {
var achart_stock_101_src_candlestick_debug, achart_stock_101_src_stock_debug, achart_stock_101_astock_debug;
achart_stock_101_src_candlestick_debug = function (exports) {
  /*
   *
   * @line图的tag
   *
   * */
  var AChart = window.AChart,
    //require('acharts'),//
    Cartesian = AChart.Series.Cartesian, ActiveGroup = AChart.Actived.Group, Flags = AChart.Flags, Candlesticks = AChart.Candlesticks, Util = AChart.Util;
  /**
   * @class Chart.Series.Flag
   * 图列上面的标识
   * @extends Chart.Series.Cartesian
   */
  function Candlestick(cfg) {
    Candlestick.superclass.constructor.call(this, cfg);
  }
  Candlestick.ATTRS = {
    type: 'candlestick',
    elCls: 'x-chart-candlestick-series',
    /**
     * candlesticks 配置项
     * @type {Object}
     */
    candlesticks: null,
    /**
     * 最高和最低值flag的配置项
     * @type {Object}
     */
    flags: {},
    zIndex: 5,
    //每个蜡烛的最大宽度
    maxWidth: 30
  };
  Util.extend(Candlestick, Cartesian);
  Util.augment(Candlestick, {
    renderUI: function () {
      var _self = this;
      Candlestick.superclass.renderUI.call(_self);
      _self.processColor();
      _self.renderLabels();
      _self.renderMarkers();
      if (_self.get('autoPaint')) {
        _self.paint();
      }
      //添加Candlesticks
      _self.set('candlesticksGroup', _self.addGroup(Candlesticks, _self.get('candlesticks')));
    },
    /**
     *  @private
     *  重写legend导致的画面变动
     */
    changeShapes: function (points, animate) {
      var _self = this, candlesticksGroup = _self.get('candlesticksGroup');
      points = points || this._getPoints();
      _self._setWidth(points.length);
      var newItems = [];
      Util.each(points, function (item, index) {
        var cfg = _self.__getShapeCfg(item, index);
        newItems.push(cfg);
      });
      candlesticksGroup.change(newItems);
      _self.set('items', newItems);
      //flag
      var items = _self._getFlagsCfg(points), flagGroup = _self.get('flagGroup');
      flagGroup && flagGroup.change(items);
    },
    //设置每个蜡烛的宽度
    _setWidth: function (pointNum) {
      var _self = this, xAxis = _self.get('xAxis'), maxWidth = _self.get('maxWidth'), plotRange = xAxis.get('plotRange');
      var singleWidth = plotRange.getWidth() / (pointNum * 2);
      //宽度设置
      _self.set('singleWidth', Math.min(singleWidth, maxWidth));
    },
    /**
     * @protect
     * 获取提示信息
     * @return {*} 返回显示在上面的文本
     */
    getTipInfo: function (point) {
      var _self = this, items = [];
      var seriesColor = _self.get('color'), tipNames = _self.get('tipNames') || [
          'open',
          'high',
          'low',
          'close'
        ], tipColors = _self.get('tipColors') || [
          seriesColor,
          seriesColor,
          seriesColor,
          seriesColor
        ];
      for (var i = 0; i < 4; i++) {
        var item = {};
        item.name = tipNames[i];
        item.value = point.arr[i + 1].toFixed(2);
        item.color = tipColors[i];
        item.suffix = _self.get('suffix');
        items.push(item);
      }
      return items;
    },
    getData: function (type) {
      var _self = this, data = _self.get('data'), rst = [];
      if (type == 'xAxis') {
        rst = Util.map(data, function (item) {
          return item[0];
        });
      } else {
        Util.each(data, function (item) {
          var tmp = item.slice(1, 5);
          rst.push(Math.max.apply(null, tmp));
          rst.push(Math.min.apply(null, tmp));
        });
      }
      return rst;
    },
    //根据points画出标记
    draw: function (points, callback) {
      var _self = this;
      _self._setWidth(points.length);
      var items = [];
      Util.each(points, function (item, index) {
        var item = _self._drawShape(item, index);
        items.push(item);
      });
      _self.set('items', items);
      //flag
      var flagGroup = _self.get('flagGroup'), flagsCfg = _self.get('flags');
      if (flagsCfg && !flagGroup) {
        var items = _self._getFlagsCfg(points);
        flagsCfg.items = items;
        flagGroup = _self.addGroup(Flags, flagsCfg);
        _self.set('flagGroup', flagGroup);
      }
      callback && callback();
    },
    /**
     *  @private
     *  根据点绘制
     */
    _drawShape: function (point, index) {
      var _self = this, candlesticksGroup = _self.get('candlesticksGroup');
      var cfg = _self.__getShapeCfg(point, index);
      if (!candlesticksGroup) {
        //添加Candlesticks
        candlesticksGroup = _self.addGroup(Candlesticks, _self.get('candlesticks'));
        _self.set('candlesticksGroup', candlesticksGroup);
      }
      var candlestick = candlesticksGroup.addCandlestick(cfg);
      return candlestick;
    },
    //获取points信息 [open,high,low,close]
    __getShapeCfg: function (point, index) {
      var _self = this, singleWidth = _self.get('singleWidth'), item = point.arr, points = [];
      points.push(point);
      var highPoint = _self.getPointByValue(item[0], item[2]);
      points.push(highPoint);
      var lowPoint = _self.getPointByValue(item[0], item[3]);
      points.push(lowPoint);
      var closePoint = _self.getPointByValue(item[0], item[4]);
      points.push(closePoint);
      //宽度设置
      var cfg = {
          points: points,
          singleWidth: singleWidth
        };
      return cfg;
    },
    //绘制最高点和最低点的flag
    _getFlagsCfg: function (points) {
      var _self = this, items = [], flags = _self.get('flags'), maxPoint, minPoint;
      if (flags) {
        Util.each(points, function (item, index) {
          var point = item.arr, max = point[2], min = point[3];
          if (index == 0) {
            maxPoint = minPoint = item;
          } else {
            var selMax = maxPoint.arr[2], selMin = minPoint.arr[3];
            if (max >= selMax) {
              maxPoint = item;
            }
            if (min <= selMin) {
              minPoint = item;
            }
          }
        });
        if (flags.max) {
          items.push(Util.mix({}, flags.max, { point: _self.getPointByValue(maxPoint.arr[0], maxPoint.arr[2]) }));
        }
        if (flags.min) {
          items.push(Util.mix({}, flags.min, { point: _self.getPointByValue(minPoint.arr[0], minPoint.arr[2]) }));
        }
      }
      return items;
    }
  });
  exports = Candlestick;
  return exports;
}();
achart_stock_101_src_stock_debug = function (exports) {
  var Chart = window.AChart, Util = Chart.Util, Tooltip = Chart.Tooltip, Theme = Chart.Theme;
  Chart.Series.Candlestick = achart_stock_101_src_candlestick_debug;
  Theme.rangeSelector = {
    tooltip: null,
    legend: null,
    animate: false,
    title: null,
    subTitle: null,
    yAxis: {
      grid: null,
      labels: null,
      title: null
    },
    xAxis: {
      type: 'time',
      grid: null,
      labels: null,
      autoAppend: 0
    },
    seriesOptions: {
      areaCfg: {
        markers: null,
        animate: false,
        line: { stroke: '#ddd' },
        area: {
          'fill-opacity': 0.5,
          fill: '#efefef',
          stroke: '#ddd',
          'stroke-width': 1
        }
      }
    },
    minZoomInterval: false,
    realtime: false,
    dragDelay: 100,
    plots: null,
    dragRefresh: true,
    autoRefresh: true,
    zoomChange: null,
    sampling: {
      enable: false,
      max: 100
    },
    zoom: null,
    selectAreaCfg: {
      fill: '#717acb',
      'fill-opacity': 0.4,
      stroke: '#bbbbbb'
    }
  };
  function cloneObject(object) {
    var o = {};
    for (var i in object) {
      o[i] = object[i];
    }
    return o;
  }
  function cloneArray(array) {
    var arr = [];
    for (var i = 0; i < array.length; i++) {
      if (typeof array[i] !== 'object') {
        arr.push(array[i]);
      } else {
        arr.push(cloneObject(array[i]));
      }
    }
    return arr;
  }
  var Stock = function (cfg) {
    this._attrs = Util.mix({}, Stock.ATTRS, cfg);
    this.events = {};
  };
  Stock.ATTRS = {
    zoom: null,
    rangeSelectorOption: {},
    chart: null,
    rangeSelector: null,
    chartHtml: null,
    rangeSelectorHtml: null,
    margin: 50
  };
  Util.augment(Stock, {
    get: function (name) {
      return this._attrs[name];
    },
    set: function (name, value) {
      this._attrs[name] = value;
      return this;
    },
    render: function () {
      var _self = this;
      if (!_self.get('id')) {
        throw 'You must assign id for the chart!';
      }
      _self.paint();
    },
    paint: function () {
      var _self = this;
      _self._initContainer();
      _self._initRangeSelector();
      _self._initChart();
      _self._fixRangeSelectorSeries();
      _self._fixChartSeriesAndRender();
      _self._renderTooltip();
    },
    getSeries: function () {
      return this.get('originData');
    },
    changeData: function (data) {
      var _self = this, rangeSelector = _self.get('rangeSelector'), realtime = rangeSelector.get('realtime'), zoom = rangeSelector.get('zoom') || _self.get('zoom'), originData = _self.get('originData');
      var firstSeriesData = data[0];
      if (Util.isArray(firstSeriesData[0])) {
        rangeSelector.changeData(data);
      } else {
        rangeSelector.changeData(data[0]);
      }
      Util.each(originData, function (item, index) {
        item.data = data[index];
      });
      if (realtime) {
        var navigator_select_area = _self.get('navigator_select_area'), currX = navigator_select_area.attr('x'), currWidth = navigator_select_area.attr('width'), width = rangeSelector.get('width'), margin = _self.get('margin');
        if (currX + currWidth + margin == width) {
          _self.getTimesByNavigator();
        } else {
          !zoom ? _self.setZoom() : _self.setZoom(zoom[0], zoom[1]);
        }
      } else {
        !zoom ? _self.setZoom() : _self.setZoom(zoom[0], zoom[1]);
      }
    },
    _initContainer: function () {
      var _self = this, margin = _self.get('margin');
      id = _self.get('id') || _self.get('render') || '';
      id = id.replace('#', '');
      var el = document.getElementById(id), width = _self.get('width') || Util.getWidth(el), height = _self.get('height') || Util.getHeight(el), chartId = 'aChart-' + id + '-chart', rangeSelectorId = 'aChart-' + id + '-rangeSelector', chartHtml = Util.createDom('<div id="' + chartId + '"></div>'), rangeSelectorHtml = Util.createDom('<div id="' + rangeSelectorId + '"></div>');
      el.appendChild(chartHtml);
      el.appendChild(rangeSelectorHtml);
      _self.set('chartHtml', chartHtml);
      _self.set('rangeSelectorHtml', rangeSelectorHtml);
      _self.set('chartHtmlId', chartId);
      _self.set('rangeSelectorHtmlId', rangeSelectorId);
      var plots = _self.get('rangeSelectorOption').plots;
      if (plots && plots.length > 0) {
        for (var i = 0; i < plots.length; i++) {
          var html = Util.createDom('<div id="' + chartId + '-' + i + '"></div>');
          chartHtml.appendChild(html);
        }
      }
    },
    _initRangeSelector: function () {
      var _self = this, margin = _self.get('margin'), rangeSelectorHtml = _self.get('rangeSelectorHtml'), rangeSelectorId = _self.get('rangeSelectorHtmlId'), width = _self.get('width') || Util.getWidth(rangeSelectorHtml);
      var options = Util.mix({}, Theme.rangeSelector, _self.get('rangeSelectorOption')), options = Util.mix({}, options, {
          id: rangeSelectorId,
          animate: false,
          width: width,
          height: 55,
          plotCfg: {
            margin: [
              5,
              margin,
              17,
              margin
            ]
          }
        });
      if (_self.get('xAxis') && _self.get('xAxis').type) {
        options.xAxis.type = _self.get('xAxis').type;
      }
      var rangeSelector = new Chart(options);
      _self.set('rangeSelector', rangeSelector);
    },
    _initChart: function () {
      var _self = this, margin = _self.get('margin'), chartHtml = _self.get('chartHtml'), chartId = _self.get('chartHtmlId'), width = _self.get('width') || Util.getWidth(chartHtml), height = _self.get('height') || Util.getHeight(chartHtml);
      var plots = _self.get('rangeSelectorOption').plots;
      if (plots && plots.length > 0) {
        var charts = [];
        for (var i = 0; i < plots.length; i++) {
          var plot = plots[i];
          var chart = new Chart(Util.mix({}, _self._attrs, {
              id: chartId + '-' + i,
              width: width,
              height: plot.height,
              legend: null,
              tooltip: null
            }));
          charts.push(chart);
        }
        _self.set('chart', charts[0]);
        _self.set('charts', charts);
      } else {
        var chart = new Chart(Util.mix({}, _self._attrs, {
            id: chartId,
            width: width,
            height: height - 70
          }));
        _self.set('chart', chart);
        _self.set('charts', [chart]);
      }
    },
    _fixChartSeriesAndRender: function () {
      var _self = this, charts = _self.get('charts'), originData = _self.get('originData'), rangeSelector = _self.get('rangeSelector'), zoom = rangeSelector.get('zoom') || _self.get('zoom');
      Util.each(charts, function (chart, index) {
        var series = [];
        Util.each(originData, function (item, order) {
          if (!item.plotIndex)
            item.plotIndex = 0;
          if (item.plotIndex == index) {
            series.push(cloneObject(item));
          }
        });
        chart.set('series', series);
        Util.each(series, function (item, index) {
          item.data = [];
        });
        chart.render();
      });
      !zoom ? _self.setZoom() : _self.setZoom(zoom[0], zoom[1]);
    },
    _fixRangeSelectorSeries: function () {
      var _self = this, rangeSelector = _self.get('rangeSelector'), chart = _self.get('chart');
      var series = chart.get('series'), newSeries = [];
      var originData = cloneArray(series);
      _self.set('originData', originData);
      if (series.length > 0) {
        var options = Util.mix({}, {
            type: 'area',
            animate: false
          }, rangeSelector.get('seriesOptions').areaCfg);
        var newItem = Util.mix({}, series[0], options);
        newSeries.push(newItem);
      }
      rangeSelector.set('series', newSeries);
      rangeSelector.render();
    },
    _renderTooltip: function () {
      var _self = this, charts = _self.get('charts'), chart = charts[0];
      var plots = _self.get('rangeSelectorOption').plots;
      if (plots && plots.length > 0) {
        var canvas = chart.get('canvas'), plotRange = chart.get('plotRange'), cfg = Util.mix({}, _self._attrs.tooltip || {}, {
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
        if (_self.get('tooltip') && _self.get('tooltip').crosshairs) {
          var crosshairsGroup = [];
          Util.each(charts, function (chart, index) {
            var canvas = chart.get('canvas'), stroke = '#C0C0C0', plotRange = chart.get('plotRange');
            var y1, y2;
            if (plotRange) {
              y1 = plotRange.bl.y;
              y2 = plotRange.tl.y;
            } else {
              y1 = canvas.get('height');
              y2 = 0;
            }
            var shape = canvas.addShape({
                type: 'line',
                visible: false,
                zIndex: 3,
                attrs: {
                  stroke: stroke,
                  x1: 0,
                  y1: y1,
                  x2: 0,
                  y2: y2
                }
              });
            crosshairsGroup.push(shape);
          });
          _self.set('crosshairsGroup', crosshairsGroup);
        }
        var tooltip = canvas.addGroup(Tooltip, cfg);
        Util.each(charts, function (chart, index) {
          chart.on('plotover', function (ev) {
            var crosshairsGroup = _self.get('crosshairsGroup');
            tooltip.show();
            if (crosshairsGroup) {
              Util.each(crosshairsGroup, function (item, index) {
                item.show();
              });
            }
          });
          chart.on('plotout', function (ev) {
            tooltip.hide();
            if (crosshairsGroup) {
              Util.each(crosshairsGroup, function (item, index) {
                item.hide();
              });
            }
          });
          chart.on('plotmove', function (ev) {
            tooltip.show();
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
            });
          });
        });
      }
    },
    _getTipInfo: function (point) {
      var _self = this, charts = _self.get('charts');
      var sArray = [];
      Util.each(charts, function (chart, index) {
        var chartSeries = chart.getSeries();
        Util.each(chartSeries, function (series, order) {
          sArray.push(series);
        });
      });
      var seriesGroup = charts[0].get('seriesGroup'), series = sArray[0], xAxis = series.get('xAxis'), info = series.getTrackingInfo(point);
      var rst = seriesGroup._getTipInfo(sArray, point);
      if (series.get('type') == 'candlestick' && info && info.xValue != info.arr[5] && series.get('isSimpling')) {
        var startTime = xAxis ? xAxis.formatPoint(info.arr[5]) : info.arr[5];
        rst.title = startTime + ' ~ ' + rst.title;
      }
      return rst;
    },
    _renderScrollGroup: function () {
      var _self = this, margin = _self.get('margin'), scrollGroup = _self.get('scrollGroup'), rangeSelector = _self.get('rangeSelector'), width = rangeSelector.get('width'), height = rangeSelector.get('height');
      var scrollBar = scrollGroup.addShape({
          type: 'rect',
          id: 'scrollBar',
          attrs: {
            x: margin,
            y: 38,
            width: width - margin * 2,
            height: 15,
            stroke: '',
            fill: '#eeeeee'
          }
        });
      _self.set('scrollBar', scrollBar);
      scrollGroup.addShape('path', {
        path: 'M' + (margin - 15) + ',0L' + (width - margin + 15) + ',0',
        stroke: '#aaaaaa',
        'stroke-width': 2
      });
      var path = 'M' + (margin - 15 + 8) + ',44L' + (margin - 15 + 6) + ',46' + 'L' + (margin - 15 + 8) + ',48' + 'L' + (margin - 15 + 8) + ',44z';
      scrollGroup.addShape('path', {
        path: path,
        stroke: '#000',
        fill: '#000'
      });
      var scroll_left = scrollGroup.addShape({
          type: 'rect',
          attrs: {
            x: margin - 15,
            y: 38,
            width: 15,
            height: 15,
            stroke: '#bbbbbb',
            fill: '#ebe7e8',
            'fill-opacity': 0.6
          }
        });
      _self.set('navigator_scroll_left', scroll_left);
      var path = 'M' + (width - margin + 7) + ',44L' + (width - margin + 9) + ',46' + 'L' + (width - margin + 7) + ',48' + 'L' + (width - margin + 7) + ',44z';
      scrollGroup.addShape('path', {
        path: path,
        stroke: '#000',
        fill: '#000'
      });
      var scroll_right = scrollGroup.addShape('rect', {
          x: width - margin,
          y: 38,
          width: 15,
          height: 15,
          stroke: '#bbbbbb',
          fill: '#ebe7e8',
          'fill-opacity': 0.6
        });
      _self.set('navigator_scroll_right', scroll_right);
      var path = 'M' + (width / 2 - 3) + ',43L' + (width / 2 - 3) + ',48' + 'M' + width / 2 + ',43L' + width / 2 + ',48' + 'M' + (width / 2 + 3) + ',43L' + (width / 2 + 3) + ',48';
      var navigator_bottom_path = scrollGroup.addShape({
          id: 'navigator_bottom_path',
          type: 'path',
          attrs: {
            path: path,
            stroke: '#aaaaaa'
          }
        });
      _self.set('navigator_bottom_path', navigator_bottom_path);
    },
    _renderNavigatorGroup: function () {
      var _self = this, margin = _self.get('margin'), navigatorGroup = _self.get('navigatorGroup'), rangeSelector = _self.get('rangeSelector'), width = rangeSelector.get('width'), selectAreaCfg = rangeSelector.get('selectAreaCfg'), height = rangeSelector.get('height');
      var navigator_select_area = navigatorGroup.addShape({
          type: 'rect',
          id: 'navigator_select_area',
          attrs: Util.mix({}, selectAreaCfg, {
            x: margin,
            y: 0,
            width: width - margin * 2,
            height: 53
          })
        });
      _self.set('navigator_select_area', navigator_select_area);
      var navigator_handle_left_path = navigatorGroup.addShape({
          id: 'navigator_handle_left_path',
          type: 'path',
          attrs: {
            path: _self._getHandlePath(margin - 5),
            stroke: '#000'
          }
        });
      _self.set('navigator_handle_left_path', navigator_handle_left_path);
      var navigator_handle_left = navigatorGroup.addShape({
          type: 'rect',
          id: 'navigator_handle_left',
          attrs: {
            x: margin - 5,
            y: 12,
            stroke: '#aaaaaa',
            fill: '#ebe7e8',
            'fill-opacity': 0.8,
            width: 10,
            height: 15
          }
        });
      _self.set('navigator_handle_left', navigator_handle_left);
      var navigator_handle_right_path = navigatorGroup.addShape({
          id: 'navigator_handle_right_path',
          type: 'path',
          attrs: {
            path: _self._getHandlePath(width - margin - 5),
            stroke: '#000'
          }
        });
      _self.set('navigator_handle_right_path', navigator_handle_right_path);
      var navigator_handle_right = navigatorGroup.addShape({
          type: 'rect',
          id: 'navigator_handle_right',
          attrs: {
            x: width - margin - 5,
            y: 12,
            stroke: '#aaaaaa',
            fill: '#ebe7e8',
            'fill-opacity': 0.8,
            width: 10,
            height: 15
          }
        });
      _self.set('navigator_handle_right', navigator_handle_right);
    },
    _addAreaSelectShapes: function () {
      var _self = this, margin = _self.get('margin'), rangeSelector = _self.get('rangeSelector'), canvas = rangeSelector.get('canvas'), width = rangeSelector.get('width'), height = rangeSelector.get('height');
      var scrollGroup = canvas.addGroup({ zIndex: 6 });
      _self.set('scrollGroup', scrollGroup);
      var navigatorGroup = canvas.addGroup({ zIndex: 6 });
      _self.set('navigatorGroup', navigatorGroup);
      _self._renderScrollGroup();
      _self._renderNavigatorGroup();
    },
    _getHandlePath: function (x) {
      var path = 'M' + (4 + x) + ',16L' + (4 + x) + ',23' + 'M' + (6 + x) + ',16L' + (6 + x) + ',23';
      return path;
    },
    setZoom: function (startTime, endTime) {
      var _self = this;
      _self._setZoom(startTime, endTime);
      _self.setNavigatorByTime(startTime, endTime);
    },
    _setZoom: function (startTime, endTime) {
      var _self = this, rangeSelector = _self.get('rangeSelector'), autoRefresh = rangeSelector.get('autoRefresh'), zoomChange = rangeSelector.get('zoomChange'), sampling = rangeSelector.get('sampling'), originData = _self.get('originData'), charts = _self.get('charts');
      if (autoRefresh) {
        Util.each(charts, function (chart, order) {
          var chartSeries = chart.getSeries();
          var series = [];
          Util.each(originData, function (item, index) {
            if (!item.plotIndex)
              item.plotIndex = 0;
            if (item.plotIndex == order) {
              series.push(item);
            }
          });
          Util.each(series, function (item, index) {
            var data = _self.getPlotData(item), targetSeries = chartSeries[index], pointStart = item.pointStart, pointInterval = item.pointInterval, newData = [];
            if (pointStart && pointInterval) {
              var startIndex = startTime ? parseInt((startTime - pointStart) / pointInterval, 10) : 0, endIndex = endTime ? Math.ceil((endTime - pointStart) / pointInterval) : data.length;
              startIndex = startIndex < 0 ? 0 : startIndex;
              newData = data.slice(startIndex, endIndex + 1);
              var start = startTime || pointStart;
              if (start != pointStart && start % pointInterval != 0) {
              }
              targetSeries.set('pointStart', start);
            } else {
              Util.each(data, function (model, i) {
                var dataTime = model[0];
                if (targetSeries.get('type') == 'flag') {
                  dataTime = model.x;
                }
                if ((!startTime || startTime <= dataTime) && (!endTime || endTime >= dataTime)) {
                  newData.push(model);
                }
              });
              if (sampling && sampling.enable && newData.length > sampling.max) {
                var samplingType = _self.getSamplingType(targetSeries);
                newData = _self._simplingData(newData, samplingType);
                targetSeries.set('isSimpling', true);
              } else {
                targetSeries.set('isSimpling', false);
              }
              if (targetSeries.get('onCandlestick')) {
                var onCandlestick = targetSeries.get('onCandlestick'), candleData = charts[0].getSeries()[0].get('data');
                Util.each(candleData, function (item, index) {
                  var openPoint = item[1], closePoint = item[4];
                  var cfg = openPoint >= closePoint ? onCandlestick.fallCfg : onCandlestick.riseCfg;
                  if (cfg) {
                    var time = newData[index][0], value = newData[index][1];
                    newData[index] = {
                      x: time,
                      y: value,
                      attrs: cfg
                    };
                  }
                });
              }
            }
            newData.length > 0 ? targetSeries.show() : targetSeries.hide();
            targetSeries.changeData(newData);
          });
          chart.repaint();
        });
      }
      _self.set('zoom', [
        startTime,
        endTime
      ]);
      rangeSelector.set('zoom', [
        startTime,
        endTime
      ]);
      zoomChange && zoomChange(startTime, endTime);
    },
    getPlotData: function (item) {
      var _self = this, originData = _self.get('originData');
      var data = item.data;
      if (item.dataIndex) {
        var dataIndex = item.dataIndex, origin = originData[0].data;
        if (origin) {
          data = [];
          Util.each(origin, function (item, index) {
            var arr = [];
            arr[0] = item[0];
            if (Util.isArray(dataIndex)) {
              Util.each(dataIndex, function (array, order) {
                arr[order + 1] = item[array];
              });
            } else {
              arr[1] = item[dataIndex];
            }
            data.push(arr);
          });
        }
      }
      return data;
    },
    getSamplingType: function (series) {
      var _self = this, samplingType = series.get('samplingType'), type = samplingType || series.get('type');
      switch (type) {
      case 'candlestick':
        type = 'stock';
        break;
      case 'column':
        type = 'sum';
        break;
      }
      return type;
    },
    _simplingData: function (data, type) {
      var _self = this, rangeSelector = _self.get('rangeSelector'), sampling = rangeSelector.get('sampling'), length = data.length - 1, avg = Math.ceil(length / sampling.max), interval = parseInt(length / avg, 10), finalLength = avg * interval, returnData = [];
      var startIndex = length == finalLength ? 0 : length - finalLength;
      for (var i = startIndex; i <= length - avg; i += avg) {
        var start = i + 1, startData = cloneArray(data[start]), endData = cloneArray(data[i + avg]);
        if (type == 'sum') {
          var conData = [
              endData[0],
              startData[1]
            ];
          for (var j = start + 1; j <= avg + i; j++) {
            var currData = data[j];
            conData[1] += currData[1];
          }
          returnData.push(conData);
        } else if (type == 'stock') {
          var conData = [
              endData[0],
              startData[1],
              startData[2],
              startData[3],
              endData[4],
              startData[0]
            ];
          for (var j = start; j <= avg + i; j++) {
            var currData = data[j];
            conData[2] = Math.max(currData[2], conData[2]);
            conData[3] = Math.min(currData[3], conData[3]);
          }
          returnData.push(conData);
        } else if (type == 'avg') {
          var conData = [
              endData[0],
              startData[1]
            ];
          for (var j = start + 1; j <= avg + i; j++) {
            var currData = data[j];
            conData[1] += currData[1];
          }
          returnData.push(conData);
        }
      }
      return returnData.length == 0 ? data : returnData;
    },
    setNavigatorByTime: function (startTime, endTime) {
      var _self = this, rangeSelector = _self.get('rangeSelector'), width = rangeSelector.get('width'), margin = _self.get('margin'), canvas = rangeSelector.get('canvas'), xAxis = rangeSelector.get('seriesGroup').get('xAxis'), navigator_select_area = _self.get('navigator_select_area');
      if (!navigator_select_area) {
        _self._addAreaSelectShapes();
        _self.dragEvents();
        navigator_select_area = _self.get('navigator_select_area');
      }
      var x = (startTime ? xAxis.getOffset(startTime) : margin) || margin, end_x = (endTime ? xAxis.getOffset(endTime) : width - margin) || width - margin, width = end_x - x;
      navigator_select_area.attr('width', width);
      _self._getAreaByX(x);
      _self._getHandleByArea();
      _self._changeBottomPath();
    },
    getTimesByNavigator: function () {
      var _self = this, rangeSelector = _self.get('rangeSelector'), canvas = rangeSelector.get('canvas'), navigator = canvas.getLast(), xAxis = rangeSelector.get('seriesGroup').get('xAxis'), navigator_select_area = navigator.find('navigator_select_area');
      var startValue = navigator_select_area.attr('x'), endValue = navigator_select_area.attr('x') + navigator_select_area.attr('width');
      var startValue_x = xAxis.getValue(startValue), endValue_x = xAxis.getValue(endValue);
      _self._setZoom(startValue_x, endValue_x, true);
    },
    dragEvents: function () {
      var _self = this, minInterval = 1, margin = _self.get('margin'), rangeSelector = _self.get('rangeSelector'), dragRefresh = rangeSelector.get('dragRefresh'), minZoomInterval = rangeSelector.get('minZoomInterval'), width = rangeSelector.get('width'), canvas = rangeSelector.get('canvas'), navigator_select_area = _self.get('navigator_select_area'), navigator_handle_left = _self.get('navigator_handle_left'), navigator_handle_left_path = _self.get('navigator_handle_left_path'), navigator_handle_right = _self.get('navigator_handle_right'), navigator_handle_right_path = _self.get('navigator_handle_right_path'), navigator_bottom_path = _self.get('navigator_bottom_path'), navigator_scroll_left = _self.get('navigator_scroll_left'), navigator_scroll_right = _self.get('navigator_scroll_right'), dragDelay = rangeSelector.get('dragDelay'), scrollBar = _self.get('scrollBar'), xAxis = rangeSelector.get('seriesGroup').get('xAxis');
      var xHandleBefore, xAreaBefore, widthAreaBefore, timeout;
      if (minZoomInterval && minZoomInterval > 0) {
        var startTime = xAxis.getValue(margin), endTime = startTime + minZoomInterval;
        minInterval = xAxis.getOffset(endTime) - xAxis.getOffset(startTime);
      }
      navigator_select_area.drag(function (dx, dy, x, y, event) {
        var currX = xAreaBefore + dx;
        _self._getAreaByX(currX);
        _self._getHandleByArea();
        _self._changeBottomPath();
        if (dragRefresh) {
          if (timeout)
            clearTimeout(timeout);
          timeout = setTimeout(function () {
            _self.getTimesByNavigator();
          }, dragDelay);
        }
      }, function () {
        xAreaBefore = navigator_select_area.attr('x');
        navigator_select_area.attr('cursor', 'ew-resize');
        _self.set('onDrag', true);
      }, function () {
        if (!dragRefresh) {
          _self.getTimesByNavigator();
        }
        navigator_select_area.attr('cursor', 'default');
        _self.set('onDrag', false);
      });
      rangeSelector.on('plotclick', function (ev) {
        if (_self.get('onDrag'))
          return;
        var areaX = navigator_select_area.attr('x'), areaWidth = navigator_select_area.attr('width');
        if (ev.x < areaX || ev.x > areaX + areaWidth) {
          if (ev.shape && ev.shape.get('type') != 'rect' || !ev.shape) {
            var xBefore = navigator_select_area.attr('x'), widthArea = navigator_select_area.attr('width');
            var currX = ev.x - widthArea / 2;
            _self._getAreaByX(currX);
            _self._getHandleByArea();
            _self._changeBottomPath();
            _self.getTimesByNavigator();
          }
        }
      });
      navigator_scroll_left.on('click', function (ev) {
        var eachTick = width / 20, areaX = navigator_select_area.attr('x');
        var offsetX = areaX - eachTick;
        _self._getAreaByX(offsetX);
        _self._getHandleByArea();
        _self._changeBottomPath();
        _self.getTimesByNavigator();
      });
      navigator_scroll_right.on('click', function (ev) {
        var eachTick = width / 20, areaX = navigator_select_area.attr('x');
        var offsetX = areaX + eachTick;
        _self._getAreaByX(offsetX);
        _self._getHandleByArea();
        _self._changeBottomPath();
        _self.getTimesByNavigator();
      });
      scrollBar.on('click', function (ev) {
        var xArea = navigator_select_area.attr('x'), widthArea = navigator_select_area.attr('width'), offsetX = ev.offsetX;
        offsetX = offsetX > xArea ? widthArea + xArea : xArea - widthArea;
        _self._getAreaByX(offsetX);
        _self._getHandleByArea();
        _self._changeBottomPath();
        _self.getTimesByNavigator();
      });
      navigator_handle_left.drag(function (dx, dy, x, y, event) {
        var currX = xHandleBefore + dx;
        if (currX <= margin - 5) {
          currX = margin - 5;
          dx = margin - 5 - xHandleBefore;
        }
        var rightLimit = navigator_handle_right.attr('x');
        if (currX >= rightLimit - minInterval) {
          currX = rightLimit - minInterval;
          dx = rightLimit - minInterval - xHandleBefore;
        }
        navigator_handle_left.attr('x', currX);
        var path = _self._getHandlePath(currX);
        navigator_handle_left_path.attr('path', path);
        navigator_select_area.attr('x', xAreaBefore + dx);
        navigator_select_area.attr('width', widthAreaBefore - dx);
        _self._changeBottomPath();
        if (dragRefresh) {
          if (timeout)
            clearTimeout(timeout);
          timeout = setTimeout(function () {
            _self.getTimesByNavigator();
          }, dragDelay);
        }
      }, function (x, y, event) {
        xHandleBefore = navigator_handle_left.attr('x');
        xAreaBefore = navigator_select_area.attr('x');
        widthAreaBefore = navigator_select_area.attr('width');
        navigator_handle_left.attr('cursor', 'ew-resize');
        _self.set('onDrag', true);
      }, function (event) {
        if (!dragRefresh) {
          _self.getTimesByNavigator();
        }
        navigator_handle_left.attr('cursor', 'default');
        _self.set('onDrag', false);
      });
      navigator_handle_right.drag(function (dx, dy, x, y, event) {
        var currX = xHandleBefore + dx;
        var leftLimit = navigator_handle_left.attr('x');
        if (currX <= leftLimit + minInterval) {
          currX = leftLimit + minInterval;
          dx = leftLimit + minInterval - xHandleBefore;
        }
        if (currX >= width - margin - 5) {
          currX = width - margin - 5;
          dx = width - margin - 5 - xHandleBefore;
        }
        navigator_handle_right.attr('x', currX);
        var path = _self._getHandlePath(currX);
        navigator_handle_right_path.attr('path', path);
        navigator_select_area.attr('width', widthAreaBefore + dx);
        _self._changeBottomPath();
        if (dragRefresh) {
          if (timeout)
            clearTimeout(timeout);
          timeout = setTimeout(function () {
            _self.getTimesByNavigator();
          }, dragDelay);
        }
      }, function () {
        xHandleBefore = navigator_handle_right.attr('x');
        xAreaBefore = navigator_select_area.attr('x');
        widthAreaBefore = navigator_select_area.attr('width');
        navigator_handle_right.attr('cursor', 'ew-resize');
        _self.set('onDrag', true);
      }, function () {
        if (!dragRefresh) {
          _self.getTimesByNavigator();
        }
        navigator_handle_right.attr('cursor', 'default');
        _self.set('onDrag', false);
      });
    },
    _changeBottomPath: function () {
      var _self = this, navigator_handle_left = _self.get('navigator_handle_left'), navigator_handle_right = _self.get('navigator_handle_right'), navigator_bottom_path = _self.get('navigator_bottom_path');
      var left = navigator_handle_left.attr('x') + 5, right = navigator_handle_right.attr('x') + 5, width = left + right;
      if (right - left <= 20) {
        navigator_bottom_path.attr('path', '');
        return;
      }
      var path = 'M' + (width / 2 - 3) + ',43L' + (width / 2 - 3) + ',48' + 'M' + width / 2 + ',43L' + width / 2 + ',48' + 'M' + (width / 2 + 3) + ',43L' + (width / 2 + 3) + ',48';
      navigator_bottom_path.attr('path', path);
    },
    _getHandleByArea: function () {
      var _self = this, navigator_select_area = _self.get('navigator_select_area'), navigator_handle_left = _self.get('navigator_handle_left'), navigator_handle_left_path = _self.get('navigator_handle_left_path'), navigator_handle_right = _self.get('navigator_handle_right'), navigator_handle_right_path = _self.get('navigator_handle_right_path');
      var currX = navigator_select_area.attr('x'), widthArea = navigator_select_area.attr('width');
      var leftHandleX = currX - 5;
      navigator_handle_left.attr('x', leftHandleX);
      navigator_handle_left_path.attr('path', _self._getHandlePath(leftHandleX));
      var rightHandleX = leftHandleX + widthArea;
      navigator_handle_right.attr('x', rightHandleX);
      navigator_handle_right_path.attr('path', _self._getHandlePath(rightHandleX));
    },
    _getAreaByX: function (currX) {
      var _self = this, margin = _self.get('margin'), rangeSelector = _self.get('rangeSelector'), width = rangeSelector.get('width'), navigator_select_area = _self.get('navigator_select_area');
      var widthArea = navigator_select_area.attr('width');
      if (currX <= margin) {
        currX = margin;
      } else if (currX + widthArea >= width - margin) {
        currX = width - margin - widthArea;
      }
      navigator_select_area.attr('x', currX);
    },
    clear: function () {
      var _self = this;
      var charts = _self.get('charts');
      var rangeSelector = _self.get('rangeSelector');
      Util.each(charts, function (chart) {
        chart.clear();
      });
      rangeSelector.clear();
    }
  });
  exports = Stock;
  return exports;
}();
achart_stock_101_astock_debug = function (exports) {
  var astock = achart_stock_101_src_stock_debug;
  window.AStock = astock;
  exports = astock;
  return exports;
}();
}());