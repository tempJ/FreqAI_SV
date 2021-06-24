<template>
  <v-container>
    <v-card
    flat
    tile
    >
      <div class="chart" :id="chartId"></div>
    </v-card>
  </v-container>
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
      name: Array,
      data: Array,
      clear: Boolean,
    },
    name: 'WatchChart',

    data: () => ({
      chartId: null,
      db: null,
      chart: null,

      series: new Array(5),
      legend: null,
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

        this.legend = this.chart.addLegendBox();

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
      },
    },

    watch: {
      name: {
        deep: true,

        handler(val){
          console.log(val);
          this.legend.dispose();
          this.legend = this.chart.addLegendBox();

          this.series.forEach((s, i) => {
            s.setName(val[i]);
          });
          this.legend.add(this.chart);
        }
      },

      data: {
        deep: true,

        handler(val){
          console.log(val);
          if(val[0].length === 0){
            this.series.forEach((s) => {
              s.clear();
            });

            return -1;
          }
          val.forEach((el, i) => {
            this.series[i].clear();
            this.series[i].add(el);
          });
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
    }
  }
</script>

<style scoped>
  .chart {
    height: 480px;
  }
</style>