<template>
  <v-container>
    <v-card
    tile>
      <div class="chart" :id="chartId"></div>
    </v-card>
      
  </v-container>
</template>

<script>
import {
  lightningChart,
  FontSettings,
  SolidLine, SolidFill, ColorRGBA, Themes
} from '@arction/lcjs';

const size = 2048;
const colorSet = [
  ColorRGBA(41, 121, 255),
  ColorRGBA(255, 23, 68),
  ColorRGBA(0, 191, 165),
  ColorRGBA(170, 0, 255),
  ColorRGBA(84, 110, 122),
  ColorRGBA(255, 143, 0)
];

  export default {
    props: {
      title: String,
      theme: Number,
      xData: Array,
      yData: Array,
      focus: Boolean
    },
    name: 'LineChart',

    data: () => ({
      chartId: null,
      db: null,
      chart: null,
      series: [],
      strokeTheme: [],

      themeList: [Themes.light, Themes.light]
      // legend: null,
      
    }),

    methods: {
      resetChartID(){
        this.chartId = Math.trunc(Math.random() * 1000000);
      },
      createDb(){
        this.db = lightningChart().Dashboard({
          container: `${this.chartId}`,
          theme: this.themeList[this.theme],
          numberOfColumns: 1,
          numberOfRows: 1,
        });
      },
      createChart(){
        this.chart = this.db.createChartXY({
          columnIndex: 0,
          rowIndex: 0,
          // columnSpan: 1,
          // rowSpan:1
        })
          .setTitle(this.title)
          .setTitleFont(new FontSettings({
            size: 16,
            family: 'Roboto Condensed',
            weight: '300'
          }));
        if(this.focus){ this.chart.onSeriesBackgroundMouseClick(this.getWavePoint); }
      },
      createSeries(){
        if(this.focus){
          this.strokeTheme.push(new SolidLine({
            fillStyle: new SolidFill({ color: colorSet[0] }),
            thickness: 2
          }));
        }
        else{
          this.strokeTheme.push(new SolidLine({
            fillStyle: new SolidFill({ color: colorSet[1] }),
            thickness: 2
          }));
        }
        this.series.push(this.chart.addLineSeries().setStrokeStyle(this.strokeTheme[0]));
        this.series[0].add(this.genDataObj(this.xData, this.yData));

        // if(this.focus){ this.series.onMouseClick(this.getPoint); }
      },
      getWavePoint(obj, e){
        const cursor = this.chart.engine.clientLocation2Engine(e.clientX, e.clientY);
        const near = this.chart.solveNearest(cursor);
        if(near === undefined) { return this.$emit("child", -1); };
        const onScale = near.location;
        this.$emit("child", onScale.x);
      },

      genDataObj(xArr, yArr){
        const tmp = [];
        const len = xArr.length;
        for(let i=0; i<len; i++){
          const item = new Object();
          item.x = xArr[i];
          item.y = parseInt(yArr[i]);
          tmp.push(item);
        }
        return tmp;
      },

      renderChart(){
        const len = this.series.length;

        if(this.focus) { this.series[0].clear(); }
        else if(len<5){
          this.strokeTheme.push(new SolidLine({
            fillStyle: new SolidFill({ color: colorSet[len] }),
            thickness: 2
          }));
          this.series.push(
            this.chart.addLineSeries()
              .setStrokeStyle(this.strokeTheme[len-1])
          );
          // console.log(this.strokeTheme);
        }
        else{}
        // this.series[0].add(this.genDataObj(this.xData, this.yData));
        
        // console.log(len)
        switch (len) {
          case 5:
            this.series[4].add(this.genDataObj(this.xData, this.yData[4]));
          case 4:
            this.series[3].add(this.genDataObj(this.xData, this.yData[3]));
          case 3:
            this.series[2].add(this.genDataObj(this.xData, this.yData[2]));
          case 2:
            this.series[1].add(this.genDataObj(this.xData, this.yData[1]));
          case 1:
            this.series[0].add(this.genDataObj(this.xData, this.yData[0]));
          default:
            break;
        }
      },

      pushData(data, item){
        if(data.length >= size){ data.shift(); }
        data.push(item);
      },
    },

    watch: {
      'yData': 'renderChart',
      // title: function(){
      //   this.chart.setTitle(this.title);
      // }
    },

    computed: {
    },

    beforeMount(){
      this.resetChartID();
    },

    mounted() {
      this.createDb();
      this.createChart();
      this.createSeries();
      // this.lightningChart = lightningChart();
      // this.chartXY = this.lightningChart.ChartXY({
      //   // chartContainer
      // });
      // this.series = this.chartXY.addLineSeries();
      // const tmp = this.genDataObj(this.xData, this.yData);
      // this.series.add(tmp);
    }
  }
</script>

<style scoped>
  .chart {
    height: 480px;
  }
</style>