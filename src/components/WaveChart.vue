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
      data: Array,
    },
    name: 'WaveChart',

    data: () => ({
      chartId: null,
      db: null,
      chart: null,
      series: null,
      strokeTheme: [],
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

        this.chart.onSeriesBackgroundMouseClick(this.getWavePoint);

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
        this.strokeTheme.push(new SolidLine({
          fillStyle: new SolidFill({ color: colorSet[0] }),
          thickness: 1
        }));

        this.series = this.chart.addLineSeries().setStrokeStyle(this.strokeTheme[0]);
        // console.log(this.data)
        // this.series.add(this.data);
        // console.log(this.data)
        // this.series.add(this.genDataObj(this.xData, this.yData));
      },

      getWavePoint(obj, e){
        const cursor = obj.engine.clientLocation2Engine(e.clientX, e.clientY);
        const near = obj.solveNearest(cursor);
        if(near !== undefined){
          const onScale = near.location;
          this.$emit("wave", Math.floor(onScale.x));
        }
      },
      
      // renderChart(){
      //   this.series.clear();
      //   // this.series.add(this.genDataObj(this.xData, this.yData));
      //   this.series.add(this.data);
      // },

      // genDataObj(xArr, yArr){
      //   const tmp = [];
      //   const len = xArr.length;
      //   for(let i=0; i<len; i++){
      //     const item = new Object();
      //     item.x = xArr[i];
      //     item.y = parseInt(yArr[i]);
      //     tmp.push(item);
      //   }
      //   return tmp;
      // },
    },

    watch: {
      // 'yData': 'renderChart',
      data: {
        deep: true,

        handler(){
          this.series.clear();
          this.series.add(this.data);
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