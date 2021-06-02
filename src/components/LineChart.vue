<template>
  <v-container>
    <v-card
    tile>
      <div class="chart" :id="chartId"></div>
    </v-card>
      
  </v-container>
</template>

<script>
import { FontSettings, lightningChart, Themes } from '@arction/lcjs';
// const chartContainer = document.getElementById('chart-container');
const size = 2048;

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
      series: null,

      themeList: [Themes.dark, Themes.light]
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
        this.series = this.chart.addLineSeries();
        this.series.add(this.genDataObj(this.xData, this.yData));
        // if(this.focus){ this.series.onMouseClick(this.getPoint); }
      },
      getWavePoint(obj, e){
        const cursor = this.chart.engine.clientLocation2Engine(e.clientX, e.clientY);
        const near = this.chart.solveNearest(cursor);
        if(near === undefined) { return this.$emit("child", -1); };
        const onScale = near.location;
        this.$emit("child", onScale.x);
      },
      // getPoint(obj, e){
      //   // console.log(obj);
      //   console.log(`series: ${e}`);
      // },

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
        if(this.focus) { this.series.clear(); }
        this.series.add(this.genDataObj(this.xData, this.yData));
      },

      pushData(data, item){
        if(data.length >= size){ data.shift(); }
        data.push(item);
      },
    },

    watch: {
      'yData': 'renderChart',
      title: function(){
        this.chart.setTitle(this.title);
      }
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
    height: 350px;
  }
</style>