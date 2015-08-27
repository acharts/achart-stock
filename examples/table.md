# table

---

## Basic Type


````html
<style type="text/css">
  #canvas{
    position: relative;
  }
  table{
    width: 800px;
  }
  td,th{
    border: 1px solid #eee;
    text-align: center;
  }
  .ac-tooltip{
    position:absolute;
    visibility:hidden;
    border : 1px solid #efefef;
    background-color: white;
    opacity: .8;
    padding: 7px 20px;
    border-radius: 5px;
    transition: top 200ms,left 200ms;
    -moz-transition:  top 200ms,left 200ms;
    -webkit-transition:  top 200ms,left 200ms;
    -o-transition:  top 200ms,left 200ms;
    border-color: #888 !important;
  }
  .ac-tooltip .ac-title{
    margin: 0;
    padding: 5px 0;
    color: #888;
  }
  .ac-tooltip .ac-list{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .ac-tooltip li{
    line-height:  22px;
  }
</style>
<script src="http://g.tbcdn.cn/bui/acharts/1.0.33/acharts.js"></script>
<table>
  <thead>
    <tr>
      <th>#</th>
      <th style="width: 180px;">value</th>
      <th>chart</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td style="width: 180px;" id="value0"></td>
      <td  style="width: 180px;" rowspan="5" >
        <div id="canvas"></div>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td  style="width: 180px;"id="value1"></td>
    </tr>
    <tr>
      <td>3</td>
      <td  style="width: 180px;"id="value2"></td>
    </tr>
    <tr>
      <td>4</td>
      <td  style="width: 180px;"id="value3"></td>
    </tr>
    <tr>
      <td>5</td>
      <td  style="width: 180px;"id="value4"></td>
    </tr>
  </tbody>
</table>

````

````javascript
seajs.use('astock', function(AStock) {
  var data =
    [[1318600020000,418.33,418.48,418.26,418.43,836.66,1254.99],[1318600080000,418.367,418.53,418.34,418.47,836.734,1255.101],[1318600140000,418.4995,418.4995,418.3,418.34,836.999,1255.4985000000001],[1318600200000,418.34,418.4,418.23,418.26,836.68,1255.02],[1318600260000,418.31,418.35,418.23,418.307,836.62,1254.93],[1318600320000,418.31,418.32,418.18,418.32,836.62,1254.93],[1318600380000,418.34,418.5,418.29,418.5,836.68,1255.02],[1318600440000,418.41,418.55,418.36,418.51,836.82,1255.23],[1318600500000,418.52,418.8,418.52,418.7888,837.04,1255.56],[1318600560000,418.71,418.97,418.67,418.97,837.42,1256.1299999999999],[1318600620000,418.97,419.15,418.9,419.04,837.94,1256.91],[1318600680000,419.1,419.27,418.99,419.16,838.2,1257.3000000000002],[1318600740000,419.176,419.2274,419.05,419.115,838.352,1257.528],[1318600800000,419.1,419.18,418.94,419,838.2,1257.3000000000002],[1318600860000,418.99,419.25,418.92,419.238,837.98,1256.97],[1318600920000,419.2499,419.33,419.12,419.25,838.4998,1257.7497],[1318600980000,419.26,419.33,419.15,419.163,838.52,1257.78],[1318601040000,419.16,419.22,419.15,419.151,838.32,1257.48],[1318601100000,419.21,419.38,419.15,419.328,838.42,1257.6299999999999],[1318601160000,419.32,419.45,419.32,419.42,838.64,1257.96],[1318601220000,419.4108,419.57,419.39,419.538,838.8216,1258.2323999999999],[1318601280000,419.53,419.57,419.43,419.48,839.06,1258.59],[1318601340000,419.471,419.512,419.41,419.42,838.942,1258.413],[1318601400000,419.42,419.45,419.28,419.36,838.84,1258.26],[1318601460000,419.39,419.39,419.08,419.08,838.78,1258.17],[1318601520000,419.14,419.24,419.05,419.159,838.28,1257.42],[1318601580000,419.16,419.24,419.1,419.13,838.32,1257.48],[1318601640000,419.12,419.122,418.88,418.931,838.24,1257.3600000000001],[1318601700000,418.92,419.05,418.78,418.79,837.84,1256.76],[1318601760000,418.7801,419.07,418.7801,419.03,837.5602,1256.3403],[1318601820000,419.06,419.28,419.05,419.28,838.12,1257.18],[1318601880000,419.27,419.36,419.23,419.3,838.54,1257.81],[1318601940000,419.33,419.479,419.27,419.458,838.66,1257.99],[1318602000000,419.43,419.49,419.4,419.44,838.86,1258.29],[1318602060000,419.43,419.54,419.3,419.54,838.86,1258.29],[1318602120000,419.52,419.71,419.47,419.67,839.04,1258.56],[1318602180000,419.6888,419.71,419.591,419.6,839.3776,1259.0664000000002],[1318602240000,419.63,419.74,419.606,419.67,839.26,1258.8899999999999],[1318602300000,419.71,419.74,419.59,419.6,839.42,1259.1299999999999],[1318602360000,419.59,419.67,419.501,419.551,839.18,1258.77],[1318602420000,419.55,419.64,419.4,419.6,839.1,1258.65],[1318602480000,419.51,419.68,419.49,419.67,839.02,1258.53],[1318602540000,419.65,419.68,419.47,419.53,839.3,1258.9499999999998],[1318602600000,419.54,419.586,419.42,419.42,839.08,1258.6200000000001],[1318602660000,419.47,419.4901,419.27,419.4356,838.94,1258.41],[1318602720000,419.4317,419.444,419.25,419.4099,838.8634,1258.2950999999998],[1318602780000,419.38,419.41,419.23,419.33,838.76,1258.1399999999999],[1318602840000,419.38,419.45,419.31,419.33,838.76,1258.1399999999999],[1318602900000,419.345,419.55,419.3,419.55,838.69,1258.035],[1318602960000,419.55,419.55,419.35,419.45,839.1,1258.65],[1318603020000,419.52,419.67,419.458,419.63,839.04,1258.56],[1318603080000,419.65,419.65,419.42,419.506,839.3,1258.9499999999998],[1318603140000,419.48,419.69,419.4385,419.6112,838.96,1258.44],[1318603200000,419.64,419.68,419.54,419.656,839.28,1258.92],[1318603260000,419.6,419.72,419.6,419.66,839.2,1258.8000000000002],[1318603320000,419.71,419.86,419.7,419.83,839.42,1259.1299999999999],[1318603380000,419.83,419.87,419.65,419.65,839.66,1259.49],[1318603440000,419.65,419.8643,419.6418,419.79,839.3,1258.9499999999998],[1318603500000,419.79,419.85,419.72,419.77,839.58,1259.3700000000001],[1318603560000,419.7524,419.87,419.74,419.79,839.5048,1259.2572],[1318603620000,419.74,419.85,419.74,419.83,839.48,1259.22],[1318603680000,419.83,419.8462,419.75,419.83,839.66,1259.49],[1318603740000,419.85,419.93,419.83,419.85,839.7,1259.5500000000002],[1318603800000,419.85,419.95,419.8,419.94,839.7,1259.5500000000002],[1318603860000,419.95,420,419.87,419.93,839.9,1259.85],[1318603920000,419.9,419.96,419.88,419.94,839.8,1259.6999999999998],[1318603980000,419.92,420,419.77,419.848,839.84,1259.76],[1318604040000,419.87,419.96,419.82,419.88,839.74,1259.6100000000001],[1318604100000,419.88,419.95,419.83,419.94,839.76,1259.6399999999999],[1318604160000,419.94,419.95,419.82,419.82,839.88,1259.82],[1318604220000,419.84,420.09,419.82,420.02,839.68,1259.52],[1318604280000,420.08,420.2,419.86,420.18,840.16,1260.24],[1318604340000,420.18,420.28,420.13,420.21,840.36,1260.54],[1318604400000,420.21,420.27,419.92,419.98,840.42,1260.6299999999999],[1318604460000,420.01,420.07,419.84,419.88,840.02,1260.03],[1318604520000,419.84,419.92,419.48,419.53,839.68,1259.52],[1318604580000,419.53,419.62,419.16,419.37,839.06,1258.59],[1318604640000,419.37,419.47,419.31,419.36,838.74,1258.1100000000001],[1318604700000,419.366,419.68,419.366,419.671,838.732,1258.098],[1318604760000,419.66,419.8,419.57,419.71,839.32,1258.98],[1318604820000,419.694,419.719,419.61,419.62,839.388,1259.082],[1318604880000,419.678,419.77,419.57,419.659,839.356,1259.034],[1318604940000,419.64,419.64,419.34,419.3912,839.28,1258.92],[1318605000000,419.4,419.55,419.1,419.101,838.8,1258.1999999999998],[1318605060000,419.12,419.28,419.1,419.12,838.24,1257.3600000000001],[1318605120000,419.17,419.36,419.12,419.275,838.34,1257.51],[1318605180000,419.23,419.49,419.2,419.476,838.46,1257.69],[1318605240000,419.46,419.5526,419.21,419.22,838.92,1258.3799999999999],[1318605300000,419.216,419.3,419.08,419.28,838.432,1257.6480000000001],[1318605360000,419.27,419.29,418.87,418.9,838.54,1257.81],[1318605420000,418.89,418.95,418.64,418.92,837.78,1256.67],[1318605480000,418.893,419.2,418.87,419.17,837.786,1256.6789999999999],[1318605540000,419.189,419.38,419.11,419.28,838.378,1257.567],[1318605600000,419.29,419.44,419.2,419.39,838.58,1257.8700000000001],[1318605660000,419.4199,419.5499,419.3,419.5324,838.8398,1258.2597],[1318605720000,419.5,419.55,419.39,419.41,839,1258.5],[1318605780000,419.43,419.55,419.32,419.44,838.86,1258.29],[1318605840000,419.4476,419.5,419.29,419.5,838.8952,1258.3428000000001],[1318605900000,419.5,419.75,419.48,419.72,839,1258.5],[1318605960000,419.71,419.71,419.5,419.58,839.42,1259.1299999999999],[1318606020000,419.552,419.74,419.44,419.71,839.104,1258.656],[1318606080000,419.712,420.25,419.69,420.226,839.424,1259.136],[1318606140000,420.25,420.5,420.199,420.45,840.5,1260.75],[1318606200000,420.47,420.47,420,420.01,840.94,1261.41],[1318606260000,420.075,420.48,420.05,420.4412,840.15,1260.225],[1318606320000,420.44,420.77,420.39,420.4002,840.88,1261.32],[1318606380000,420.45,420.67,420.4,420.49,840.9,1261.35],[1318606440000,420.5,420.764,420.48,420.75,841,1261.5],[1318606500000,420.71,420.77,420.41,420.43,841.42,1262.1299999999999],[1318606560000,420.43,420.77,420.4,420.44,840.86,1261.29],[1318606620000,420.41,420.58,420.4,420.58,840.82,1261.23],[1318606680000,420.56,420.63,420.15,420.2,841.12,1261.68],[1318606740000,420.15,420.25,420,420.09,840.3,1260.4499999999998],[1318606800000,420.09,420.15,419.88,420.04,840.18,1260.27],[1318606860000,420.04,420.1,419.88,420.07,840.08,1260.1200000000001],[1318606920000,420.07,420.21,420.02,420.16,840.14,1260.21],[1318606980000,420.14,420.31,420.01,420.12,840.28,1260.42],[1318607040000,420.12,420.29,420.03,420.15,840.24,1260.3600000000001],[1318607100000,420.15,420.285,420.05,420.248,840.3,1260.4499999999998],[1318607160000,420.2588,420.38,420.11,420.2556,840.5176,1260.7764],[1318607220000,420.24,420.45,420.15,420.3601,840.48,1260.72],[1318607280000,420.4,420.43,420.15,420.24,840.8,1261.1999999999998],[1318607340000,420.26,420.319,420.05,420.12,840.52,1260.78],[1318607400000,420.13,420.23,420,420.05,840.26,1260.3899999999999],[1318607460000,420.05,420.29,420,420.27,840.1,1260.15],[1318607520000,420.258,420.35,420.17,420.21,840.516,1260.774],[1318607580000,420.2,420.35,420.18,420.28,840.4,1260.6],
    [1318607640000,420.3,420.6,420.29,420.5958,840.6,1260.9],
    [1318607700000,420.58,421.14,420.575,421.0975,841.16,1261.74],
    [1318607760000,421.07,421.49,420.7,421.46,842.14,1263.21],
    [1318607820000,421.4601,421.71,421.36,421.69,842.9202,1264.3803],
    [1318607880000,421.69,421.94,421.663,421.94,843.38,1265.07],
    [1318607940000,421.94,422,421.8241,422,843.88,1265.82]];

  var stock = new AStock({
      theme : AChart.Theme.SmoothBase,
      id : 'canvas',
      width : 450,
      height : 250,
      plotCfg : {
          margin : [0,0,0,0] //画板的边距
      },
      title : {
          text : ''
      },
      subTitle : {
          text : ''
      },
      xAxis : {//格式化时间
          type : 'time' ,
          tickLine : null,
          line:{
            stroke: '#eee'
          },
          labels: null,
          formatter : function(value)   {
              return Chart.Date.format(new Date(value),'yyyy-mm-dd hh:MM:ss');
          },
          animate : false
      },
      yAxis : [{ //设置多个y轴
          position: 'left',
          grid : {
              animate : false,
              line: {
                'stroke-width': 0
              }
          },
          labels: null,
          animate : false
      }],
      seriesOptions : {
        areaCfg : { //设置k线图的图形配置
          animate : false,
          area: {
            fill: '#6297de',
          },
          line: {
            'stroke-width': 0
          },
          lineActived: {
            'stroke-width': 0
          }
        }
      },
      xTickCounts : [1,3],//设置x轴tick最小数目和最大数目
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
            height: 50
        },{
            height: 50
        },{
            height: 50
        },{
            height: 50
        },{
            height: 50,
            xAxis: {
              line: null,
              type : 'time' ,
              formatter : function(value)   {
                return Chart.Date.format(new Date(value),'yyyy-mm');
              },
              animate : false
            }
        }],
        dragRefresh: false,
        sampling: { //由于数据过大，当超过200的时候进行采样合并处理
            enable: true,
            max: 200
        }
      },
      tooltip :{
          offset: 10,
          animate: false,
          crosshairs: false,
          shared: true,
          crosshairs:true,
          crossLine: {
            stroke: '#6297de'
          },
          custom: true,
          title: {
            y: 12,
            x: 8
          },
          itemTpl: '<li></li>',
          name: null,
          value: null,

          //鼠标移动回调
          tipmove: function(ev){
            //console.log('x坐标：',ev.x);
            var charts = stock.get('charts');
            for(var i = 0; i < charts.length; i ++){
              var chart = charts[i];
              //获取坐标轴
              var xAxis = chart.getXAxis();
              var x = xAxis.getValue(ev.x);
              //获取series
              var series = chart.getSeries();
              var point = series[0].findPointByValue(x);
              //填值
              var dom = document.getElementById('value' + i);
              if(point){
                dom.innerHTML = point.yValue;
              }
            }
          }
      },
      series : [{
          plotIndex: 0, //指定所处的屏幕的index索引
          type: 'area',
          name: '求助',
          dataIndex: 2, //指定数据为data的index索引
          data: data
      },{
          plotIndex: 1, //指定所处的屏幕的index索引
          type: 'area',
          name: '求助',
          dataIndex: 3, //指定数据为data的index索引
          data: data
      },{
          plotIndex: 2, //指定所处的屏幕的index索引
          type: 'area',
          name: '求助',
          dataIndex: 4, //指定数据为data的index索引
          data: data
      },{
          plotIndex: 3, //指定所处的屏幕的index索引
          type: 'area',
          name: '求助',
          dataIndex: 5, //指定数据为data的index索引
          data: data
      },{
          plotIndex: 4, //指定所处的屏幕的index索引
          type: 'area',
          name: '求助',
          dataIndex: 6, //指定数据为data的index索引
          data: data
      }]
  });


  stock.render();
});
````

