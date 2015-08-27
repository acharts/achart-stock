var expect = require('expect.js');
var Chart = require('acharts');
var $ = require('jquery');
var sinon = require('sinon');
var simulate = require('event-simulate');
var AStock = require('../astock');

require('./dragSimulate');

var content = $('<div id="canvasM"></div>').prependTo('body');

var dataM = [[1415116800000,4.863864,6.1,4.5,4.812093,9546733.21],[1415203200000,4.812093,5,4.5,4.793475,8527337.07],[1415289600000,4.793475,6.1,4.5,4.80722,10611892.51],[1415376000000,4.80722,6.1,4.5,4.925811,494345.64],[1415462400000,4.925811,5,4.5,4.749874,819169.32],[1415548800000,4.749874,5,4.5,4.814465,4814869.22],[1415635200000,4.814465,5.4,4.5,4.812907,4783669.92],[1415721600000,4.812907,5.8,4.5,4.788796,8336048.73],[1415808000000,4.788796,5,4.5,4.801173,8817676.49],[1415894400000,4.801173,5.6,4.5,4.784967,4235102.45],[1415980800000,4.784967,5.8,4.5,4.814121,223581.42],[1416067200000,4.814121,5,4.5,4.844529,502914.12],[1416153600000,4.844529,5,4.5,4.793864,6333930.1],[1416240000000,4.793864,5.8,4.5,4.804466,4123493.25],[1416326400000,4.804466,5.22,4.5,4.854879,4738684.23],[1416412800000,4.854879,6,4.5,4.840364,6003432.2],[1416499200000,4.840364,5,4.5,4.79782,4946622.7],[1416585600000,4.79782,5,4.5,4.829075,716522.5],[1416672000000,4.829075,5.22,4.5,4.835012,828730.89],[1416758400000,4.835012,5.8,4.5,4.787897,7374640.96],[1416844800000,4.787897,5.22,4.5,4.788245,7190540.07],[1416931200000,4.788245,5.8,4.5,4.838448,3043656.85],[1417017600000,4.838448,7,4.5,5.190952,4228149.69],[1417104000000,5.190952,5,4.5,4.867353,9867980.71],[1417190400000,4.867353,5.5,4.5,4.810507,644870.87],[1417276800000,4.810507,5.5,4.5,4.829123,833342.55],[1417363200000,4.829123,5,4.5,4.836826,17008225],[1417449600000,4.836826,5,4.5,4.830091,16077989.76],[1417536000000,4.830091,6.5,4.5,4.858391,21353721.25],[1417622400000,4.858391,5.1,4.5,4.799642,13246132.89],[1417708800000,4.799642,5,4.5,4.683658,17552934.53],[1417795200000,4.683658,4.9,4.5,4.750925,1169134.01],[1417881600000,4.750925,5.5,4.5,4.827304,1179209.36],[1417968000000,4.827304,5,4.5,4.833975,9983115.69],[1418054400000,4.833975,5.3,4.5,4.819807,32587580.13],[1418140800000,4.819807,6,4.5,4.807794,32080969.77],[1418227200000,4.807794,10,4.5,4.861174,10219387.96],[1418313600000,4.861174,5.5,4.5,4.816396,37905684.88],[1418400000000,4.816396,5,4.5,4.971446,1315397.46],[1418486400000,4.971446,5.1,4.5,4.976029,857987.08],[1418572800000,4.976029,5.6,4.5,5.026504,42395737.95],[1418659200000,5.026504,8,4.5,5.484312,313616931.64],[1418745600000,5.484312,10,4.5,5.024319,20921509.62],[1418832000000,5.024319,6.3,4.5,5.466227,101107298.02],[1418918400000,5.466227,6,4.5,5.191585,7457658.81],[1419004800000,5.191585,5.5,4.5,4.999339,1370849.98],[1419091200000,4.999339,5.01,4.5,4.98194,1858408.67],[1419177600000,4.98194,6.6,4.5,5.632693,30190279.74],[1419264000000,5.632693,6,4.5,5.450696,49610014.21],[1419350400000,5.450696,5.5,4.5,5.349729,12752269.03],[1419436800000,5.349729,7,4.5,5.564758,42286506.34],[1419523200000,5.564758,6.2,4.5,5.132807,5072992.46],[1419609600000,5.132807,5.6,4.5,5.018601,2948609.98],[1419696000000,5.018601,5.5,4.5,4.967294,2171651.82],[1419782400000,4.967294,6,4.5,5.420573,11186160.81],[1419868800000,5.420573,10,4.5,5.437051,11774694.09],[1419955200000,5.437051,7.01,4.5,5.361375,1479784.29],[1420041600000,5.361375,5.5,4.5,5.31235,1098335.86],[1420128000000,5.31235,5.5,4.5,5.370282,1624805.2],[1420214400000,5.370282,6,4.5,5.344195,1400209.15],[1420300800000,5.344195,7.3,4.5,5.345369,2096852.59],[1420387200000,5.345369,6.2,4.5,5.171968,12672787.03],[1420473600000,5.171968,5.9,4.5,5.400294,24546976.97],[1420560000000,5.400294,5.5,3.3,5.365563,20373696.47],[1420646400000,5.365563,5.5,3.3,5.256511,11344556.17],[1420732800000,5.256511,10,3.3,5.467406,11940411.5],[1420819200000,5.467406,5.5,3.3,5.3255,1461870.26],[1420905600000,5.3255,5.7,3.3,5.17226,1793528.95],[1420992000000,5.17226,6,3.41,5.372452,7258365.33],[1421078400000,5.372452,5.5,3.41,5.448799,29516534.83],[1421164800000,5.448799,7,3.31,5.475264,9462254.53],[1421251200000,5.475264,6,3.3,5.414355,12560073.35],[1421337600000,5.414355,6,3.3,5.490879,8134444.94],[1421424000000,5.490879,6.4,3.3,5.314763,2174209.73],[1421510400000,5.314763,6.5,3.3,5.348529,3212909.3],[1421596800000,5.348529,6,3.3,5.436691,10856027.29],[1421683200000,5.436691,6.8,3.3,5.325685,16341524.29],[1421769600000,5.325685,7,3.5,5.38277,11206460.06],[1421856000000,5.38277,6.5,3.3,5.376517,19994551.25],[1421942400000,5.376517,7,3.3,5.368119,12613022.54],[1422028800000,5.368119,5.5,3.3,5.248031,1803318.49],[1422115200000,5.248031,5.5,3.3,5.275542,2279984],[1422201600000,5.275542,6,4,5.386694,22190836.31],[1422288000000,5.386694,6,3.3,5.431186,143863653.85],[1422374400000,5.431186,5.5,3.6,5.316883,13032259.19],[1422460800000,5.316883,6,3.3,5.362197,16351153.9],[1422547200000,5.362197,6,3.3,5.381193,24135517.53],[1422633600000,5.381193,6.3,3.3,5.239161,3363360.46],[1422720000000,5.239161,6,3.5,5.212548,3747114.72],[1422806400000,5.212548,6,3.3,5.253982,13951641.16]];

var stockM = new AStock({
    id : 'canvasM',
    width : 1300,
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
            return Chart.Date.format(new Date(value),'yyyy.mm.dd hh:MM:ss');
        },
        animate : false
    },
    yAxis : [{
        position: 'left',
        grid : {
            animate : false
        },
        animate : false
    },{
        position: 'right',
        grid : null,
        animate : false,
        labels :{
            label : {
                fill : '#333',
                'text-anchor' : 'end'
            }
        }
    },{
        position: 'left',
        grid : null,
        animate : false
    }],
    seriesOptions : { //设置多个序列共同的属性
        
    },
    rangeSelectorOption: {
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
        //zoom: [1318594140000,1318607940000],
        plots: [{
            height: 300
        },{
            height: 150
        }],
        dragRefresh: false,
        sampling: {
            enable: false,
            max: 200
        }
    },
    tooltip : {
        valueSuffix : '￥',
        shared: true,
        crosshairs:true
    },
    series : [{
        plotIndex: 0,
        dataIndex: 2,
        type: 'line',
        name: '股票',
        suffix: '元',
        animate: false,
        data: []
    },{
        plotIndex:1,
        yAxis : 1,
        onCandlestick:{
            riseCfg:{
                fill:'red'
            },
            fallCfg:{
                fill: 'green'
            }
        },
        type: 'column',
        name: '交易总额',
        dataIndex: 2,
        suffix: '万元',
        animate: false,
        pointRenderer: function(point){
            return point.value.toFixed(2);
        }
    }]
});

stockM.render();
describe('测试图生成',function(){
    it('change',function(){
    	stockM.changeData([dataM]);
    })
})