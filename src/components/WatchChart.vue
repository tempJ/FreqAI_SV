<template>
  <!-- <v-container> -->
    <v-card
    flat
    tile
    >
      <div class="chart" :id="chartId"></div>
    </v-card>
  <!-- </v-container> -->
</template>

<script>
import {
  lightningChart,
  // FontSettings,
  SolidLine, SolidFill, ColorRGBA, Themes
} from '@arction/lcjs';

// const size = 2048;
const colorSet = [
  ColorRGBA(255, 23, 68),
  ColorRGBA(0, 191, 165),
  ColorRGBA(170, 0, 255),
  ColorRGBA(84, 110, 122),
  ColorRGBA(255, 143, 0)
];

  export default {
    props: {
      data: Array,
    },
    name: 'WatchChart',

    data: () => ({
      chartId: null,
      db: null,
      chart: null,
      series: new Array(5),
      strokeTheme: [],

      // themeList: [Themes.light, Themes.light]
    }),

    methods: {
      resetChartID(){
        this.chartId = Math.trunc(Math.random() * 1000000);
      },
      createDb(){
        this.db = lightningChart().Dashboard({
          container: `${this.chartId}`,
          theme: Themes.light,
          numberOfColumns: 1,
          numberOfRows: 1,
        });

        this.createChart();
      },
      createChart(){
        this.chart = this.db.createChartXY({
          columnIndex: 0,
          rowIndex: 0,
        })
          .disableAnimations(false)
          .setTitle('');

        const xAxis = this.chart.getDefaultAxisX();
        xAxis.setChartInteractionPanByDrag(false);
        xAxis.setChartInteractionZoomByWheel(false);

        // const yAxis = this.chart.getDefaultAxisY();
        // yAxis.setChartInteractionFitByDrag(false);
        // yAxis.setChartInteractionZoomByDrag(false);
        // yAxis.setChartInteractionPanByDrag(false);
        // yAxis.setChartInteractionZoomByWheel(false);
        // yAxis.setMouseInteractions(false);

        this.createSeries();
      },
      createSeries(){
        for(let i=0; i<5; i++){
          this.strokeTheme.push(new SolidLine({
            fillStyle: new SolidFill({ color: colorSet[i] }),
            thickness: 1
          }));
          this.series[i] = this.chart.addLineSeries().setStrokeStyle(this.strokeTheme[i]);
        }
        
        // console.log(this.sIdx)
        // console.log(this.waveData)
      },
      
      // renderChart(){
      //   // console.log(this.waveData[this.sIdx])
      //   if(this.timeData.length < 2){
      //     return -1;
      //   }
      //   for(let i=0; i<5; i++){
      //     if(this.waveData[i].length > 0){
      //       this.series[i].clear();
      //       this.series[i].add(this.genDataObj(this.timeData, this.waveData[i]));
            
      //     }
      //   }
      //   // console.log(this.genDataObj(this.timeData, this.waveData[0]))
      //   // this.series.clear();
      //   // this.series[0].add(this.genDataObj(this.timeData, this.waveData[0]));
      //   // this.series[1].add(this.genDataObj(this.timeData, this.waveData[1]));
      //   // this.series[2].add(this.genDataObj(this.timeData, this.waveData[2]));
      //   // this.series[3].add(this.genDataObj(this.timeData, this.waveData[3]));
      //   // this.series[4].add(this.genDataObj(this.timeData, this.waveData[4]));
      // },

      // genDataObj(xArr, yArr){
      //   const tmp = [];
      //   const lenX = xArr.length;
      //   // const lenY = yArr.length;
      //   // const interval = lenX - lenY;

      //   for(let i=0; i<lenX; i++){
      //     const item = new Object();
      //     item.x = xArr[i];
      //     // if(i >= interval){
      //     //   item.y = yArr[i-interval];
      //     // }
      //     item.y = yArr[i];
      //     // item.y = parseInt(yArr[i]);
      //     tmp.push(item);
      //   }
      //   return tmp;
      // },
    },

    watch: {
      // 'waveData': 'renderChart',
      // 'waveData1': 'renderChart1',
      data: {
        deep: true,

        handler(){
          this.data.forEach((el, i) => {
            this.series[i].clear();
            this.series[i].add(el);
          })
          // for(let i=0; i<5; i++){
          //   if(this.data[i].length < 1){ continue; }

          //   this.series[i].clear();
          //   this.series[i].add(this.data[i]);
          // }
        }
      }
    },

    computed: {
    },

    beforeMount(){
      this.resetChartID();
    },

    mounted() {
      this.createDb();
      // this.createChart();
      // this.createSeries();
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