# Line

---

## Basic Type


````html
<script src="http://g.tbcdn.cn/bui/acharts/1.0.33/acharts.js"></script>
<div id="canvas"></div>
````

````javascript
seajs.use('astock', function(AStock) {
  var data =
    [[1318605300000,419.216,419.3,419.08,419.28,838.432,1257.6480000000001],
    [1318605360000,419.27,419.29,418.87,418.9,838.54,1257.81],
    [1318605420000,418.89,418.95,418.64,418.92,837.78,1256.67],
    [1318605480000,418.893,419.2,418.87,419.17,837.786,1256.6789999999999],
    [1318605540000,419.189,419.38,419.11,419.28,838.378,1257.567],
    [1318605600000,419.29,419.44,419.2,419.39,838.58,1257.8700000000001],
    [1318605660000,419.4199,419.5499,419.3,419.5324,838.8398,1258.2597],
    [1318605720000,419.5,419.55,419.39,419.41,839,1258.5],
    [1318605780000,419.43,419.55,419.32,419.44,838.86,1258.29],
    [1318605840000,419.4476,419.5,419.29,419.5,838.8952,1258.3428000000001],
    [1318605900000,419.5,419.75,419.48,419.72,839,1258.5],
    [1318605960000,419.71,419.71,419.5,419.58,839.42,1259.1299999999999],
    [1318606020000,419.552,419.74,419.44,419.71,839.104,1258.656],
    [1318606080000,419.712,420.25,419.69,420.226,839.424,1259.136],
    [1318606140000,420.25,420.5,420.199,420.45,840.5,1260.75],
    [1318606200000,420.47,420.47,420,420.01,840.94,1261.41],
    [1318606260000,420.075,420.48,420.05,420.4412,840.15,1260.225],
    [1318606320000,420.44,420.77,420.39,420.4002,840.88,1261.32],
    [1318606380000,420.45,420.67,420.4,420.49,840.9,1261.35],
    [1318606440000,420.5,420.764,420.48,420.75,841,1261.5],
    [1318606500000,420.71,420.77,420.41,420.43,841.42,1262.1299999999999],
    [1318606560000,420.43,420.77,420.4,420.44,840.86,1261.29],
    [1318606620000,420.41,420.58,420.4,420.58,840.82,1261.23],
    [1318606680000,420.56,420.63,420.15,420.2,841.12,1261.68],
    [1318606740000,420.15,420.25,420,420.09,840.3,1260.4499999999998],
    [1318606800000,420.09,420.15,419.88,420.04,840.18,1260.27]];

  var stock = new AStock({
      theme : AChart.Theme.SmoothBase,
      id : 'canvas',
      width : 950,
      height : 600,
      plotCfg : {
          margin : [10,50,20,50] //画板的边距
      },
      title : {
          text : ''
      },
      subTitle : {
          text : ''
      },
      xAxis : {//格式化时间
          type : 'time' ,
          formatter : function(value)   {
              return Chart.Date.format(new Date(value),'yyyy-mm-dd hh:MM:ss');
          },
          animate : false
      },
      yAxis : [{ //设置多个y轴
          position: 'left',
          grid : {
              animate : false
          },
          animate : false
      },{
        position: 'right',
        grid : {
            animate : false
        },
        labels : {
          label: {
            x: 30
          }
        },
        animate : false
      }],
      seriesOptions : {
          candlestickCfg : { //设置k线图的图形配置
              animate : false,
              candlesticks:{
                  candlestick:{
                      riseShape: {
                          fill : '#fff'
                      },
                      fallShape: {

                      }
                  }
              }
          }
      },
      xTickCounts : [1,5],//设置x轴tick最小数目和最大数目
      rangeSelectorOption: {
        hidden: true,
        xAxis: {
            grid : {
                line : {
                    stroke : '#ddd'
                }
            },
            labels : {
                label : {
                    'text-anchor' : 'middle',
                    y: -5
                }
            },
            formatter : function(value)   {
                return Chart.Date.format(new Date(value),'yyyy.mm.dd');
            }
        },
        plots: [{ //配置每个屏幕的配置项
            height: 300
        },{
            height: 300,
            xAxis: {
              type : 'time' ,
              formatter : function(value)   {
                return ' ';
              },
              position: 'top',
              animate : false
            },
            yAxis: {
              position: 'left'
            }
        }],
        dragRefresh: false,
        sampling: { //由于数据过大，当超过200的时候进行采样合并处理
            enable: true,
            max: 200
        }
      },
      tooltip : {
          offset: 10,
          animate: false,
          crosshairs: false,
          shared: true,
          crosshairs:true,
          crossLine: {
            stroke: '#ccc'
          },
          title: {
            y: 12,
            x: 8
          },
          //鼠标移动回调
          tipmove: function(ev){
            console.log('x坐标：',ev.x);
          }
      },
      series : [{
          plotIndex: 0, //指定所处的屏幕的index索引
          type: 'line',
          name: '求助',
          color: '#b1a3d8',
          dataIndex: 2, //指定数据为data的index索引
          data: data
      },{
          plotIndex:0,
          type: 'area',
          area: {
            fill: '#83dae0',
          },
          line: {
            'stroke-width': 0
          },
          lineActived: {
            'stroke-width': 0
          },
          yAxis: 1,
          name: '业务',
          dataIndex: 3,//指定数据为data的index索引
      },
      {
          plotIndex:1,
          type: 'column',
          name: '万人',
          dataIndex: 6,
          color: ['#a5e0ed'],
          pointRenderer: function(point){
              return point.value.toFixed(2);
          }
      }]
  });


  stock.render();

  //根据时间获取X坐标点

  //比如时间点1318605360000
  var sample = 1318605360000;
  var charts = stock.get('charts');
  //获取第一个图形对象
  var chart = charts[0];
  //获取坐标轴对象
  var xAxis = chart.getXAxis();
  //根据x轴获取数据
  var value = xAxis.getOffset(sample);
  console.log('时间'+ sample + '的对应坐标：' + value);
});
````


