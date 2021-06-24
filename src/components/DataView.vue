<template droppable="true">
  <v-container>
    <tool-bar
    :chList="chList"
    @init="initCh"
    @get="getData"
    @selCh="getCh"
    />

    <wave-chart
    :data="data2080"
    />

    <watch-chart
    :name="range"
    :data="data5"
    />
  </v-container>
</template>

<script>
// component
import WaveChart from './WaveChart';
import WatchChart from './WatchChart';

import ToolBar from './ToolBar';

// module
import ffi from 'ffi-napi';
import ref from 'ref-napi';

const shortPtr = ref.refType(ref.types.short);
const longPtr = ref.refType(ref.types.long);
const doublePtr = ref.refType(ref.types.double);

const snack = {
  'SPdbUSBm': {
    'table': { suc: -1, msg: 'Failed get wave length table.' },
    'test': { suc: -1, msg: 'Failed check channel.' },
    'close': { suc: 0, msg: 'Closed channel:' },
    'setup': { suc: -1, msg: '`Failed communication via the USB port.' },
    'init': { suc: -1, msg: 'Failed initialization.' },
    'setint': { suc: -1, msg: 'Failed set integration time.' },
    'ready': { suc: 1, msg: 'Ready to get data.' },
    'read': { suc: -1, msg: 'Failed get data.' }
  },

  'stop': { suc: 1, msg: 'Success stop.'},

  'interval': { suc: -1, msg: 'Undefined interval time.' },
  'integration': { suc: -1, msg: 'Undefined integration time.' },
};

// dll
const SPdbUSBm = ffi.Library('./src/libs/SPdbUSBm', {
  'spTestAllChannels': [ 'short', [ 'short' ] ],
  'spGetAssignedChannelID': [ 'void', [ shortPtr ] ],

  'spSetupAllChannels': [ 'short', [ ] ],
  'spSetupGivenChannel': [ 'short', [ 'short' ] ],

  'spInitAllChannels':  [ 'short', [ 'short' ] ],
  'spInitGivenChannel':  [ 'short', [ 'short', 'short' ] ],

  'spSetIntEx':  [ 'short', [ 'long', 'short' ] ],

  'spCloseAllChannels': [ 'short', [ ] ],
  'spCloseGivenChannel': [ 'short', [ 'short' ] ],

  'spReadDataEx':  [ 'short', [ longPtr, 'short' ] ],
  'spGetWLTable': [ 'short', [ doublePtr, 'short' ] ]
});

  export default {
    components: {
      WaveChart, WatchChart,
      ToolBar,
    },

    props: {
      config: Object,
    },
    
    name: 'DataView',

    data: () => ({
      save: [],

      waveTable: null,
      data2080: null,
      data5: null,

      timeData: [],
      time: 0,

      curCh: null,
      chList: [],
      timerId: null,
    }),

    methods: {
      initAll(isTimeClear = true){
        this.chIdx = null;
        this.curCh = null;
        this.chList = [];

        if(isTimeClear){
          clearInterval(this.timerId);
          this.time = 0;
          this.timeData = [];
          this.timerId = null;
        }
      },

      // Buffer
      allocBuffer(type, size){
        switch (type) {
          case 'short':
            return Buffer.alloc(size*2);

          case 'long':
            return Buffer.alloc(size*4);

          case 'double':
            return Buffer.alloc(size*8);

          default:
            return Buffer.alloc(size);
        }
      },

      buff2Arr(buff, type){
        const size = buff.length;
        if(size < 2){ return -1; }
        if((size < 4) && (type === 'long')){ return -1; }
        if((size < 8) && (type === 'double')){ return -1; }

        if(type === 'short'){
          return Array.from(new Int16Array(new Uint8Array(buff).buffer)
            .map((el) => { return el }));
        }
        else if(type === 'long'){
          return Array.from(new Int32Array(new Uint8Array(buff).buffer)
            .map((el) => { return el }));
        }
        else if(type === 'double'){
          return Array.from(new Float64Array(new Uint8Array(buff).buffer)
            .map((el) => { return el }));
        }
        else{
          return -1;
        }
      },
      
      /////////////////////////////////////////////////////////////////////////////////////////
      // Toolbar
      async createdWL(){
        const wave = this.allocBuffer('double', 2048);
        if(await this.getWLTable(wave, 0) < 0){
          this.$emit("snack", snack.table);
          return -1;
        }

        this.waveTable = this.buff2Arr(wave, 'double');
        this.$emit("table", this.waveTable);
      },

      getCh(e){
        console.log('channel: ', e);
        this.curCh = e;
      },

      async initCh(e){
        if(e){
          const slot = await this.testChannel();
          if(slot < 0){
            this.$emit("snack", snack.SPdbUSBm.test);
            return -1;
          }

          const ch = this.allocBuffer('short', slot);
          await this.assignChannel(ch);
          this.chList = this.buff2Arr(ch, 'short');

          this.$emit("snack", snack.SPdbUSBm.ready);
        }
        else{
          if(await this.closeChannel(this.chList[this.curCh]) >= 0){
            this.$emit("snack", snack.SPdbUSBm.close);
          }
        }
      },

      async getData(e){
        if(e){
          const cur = this.chList[this.curCh];

          if(await this.setupChannel(cur) < 0){
            this.$emit("snack", snack.SPdbUSBm.setup);
            return -1;
          }

          if(await this.initChannel(cur) < 0){
            this.$emit("snack", snack.SPdbUSBm.init);
            return -1;
          }
          
          if(this.config.integration === undefined){
            this.$emit("snack", snack.integration);
            return -1;
          }

          if(await this.setIntegration(cur) < 0){
            this.$emit("snack", snack.SPdbUSBm.setint);
            return -1;
          }

          if(this.config.interval === undefined){
            this.$emit("snack", snack.interval);
            return -1;
          }

          this.timerId = setInterval(async () => {
            const date = new Date(),
              data = this.allocBuffer('long', 2080);
            if(await this.readData(data, cur) < 0){
              this.$emit("snack", snack.SPdbUSBm.read);
              return -1;
            }

            const yArr = this.buff2Arr(data, 'long');
            this.data2080 = await this.genDataObj(this.waveTable, yArr);

            const wave = this.config.wave;
            const t = this.time;
            
            wave.forEach(async (w, i) => {
              if(w.view){
                const start = await this.wave2Idx(w.start),
                  end = await this.wave2Idx(w.end);
                const avg = await this.waveAverage(yArr, start, end);
                const tmp = await this.genDataObj(t, avg);

                this.data5[i].push(tmp);
              }
              else{ this.data5[i].push({ x: null, y: null }); }
            });

            if(this.isWave){ this.time += this.config.interval; }

            // console.log(this.data5, this.data5[0], this.data5[0].length);
            if(this.isSave){
            // if(this.isAutoSave && this.isHold){
              console.log('saving...');
              this.save.push(await this.makeDateFormat(date) + ',0,0,' +
                await this.makeWatchFormat(this.data5[0].length - 1) + ',' + yArr.join(','));
            }
            else{
              await this.sendSave();
            }

            if(this.isClear()){
              await this.sendSave();
              this.data5 = [[], [], [], [], []];
            }
          }, this.config.interval);

          this.$emit("run", true);
        }
        else{
          await this.sendSave();
          
          clearInterval(this.timerId);
          this.timerId = null;

          this.$emit("run", false);
          this.$emit("snack", snack.stop);
        }
      },

      waveAverage(wave, start, end){
        const len = end - start + 1;
        const range = wave.slice(start, end + 1);
        let ret = 0;

        range.forEach((w) => {
          if(w.y === undefined){ ret += w; }
          else{ ret += w.y; }
        });

        return ret / len;
      },

      idx2Wave(idx){
        return this.waveTable[idx];
      },

      wave2Idx(wave){
        return this.waveTable.indexOf(wave);
      },

      async sendSave(){
        if(this.save.length > 0){
          this.$emit("save", {
            'name': await this.makeDateFormat(new Date(), true),
            'prefix': await this.makeFileFormat1(this.config),
            'data': this.save,
          });

          this.save = [];
        }
      },

      isClear(){
        const rT = 10000; //10초 ms단위
        // const rT = 50000; //50초 ms단위
        // const rT = 100000; //100초 ms단위
        if(rT < this.time){
          this.time = 0;
          return true;
        }
        else{
          return false;
        }
      },

      async makeFileFormat1(recipe){
        const date = new Date();

        const wave = [];
        this.config.wave.forEach(w => {
          if(w.view){
            wave.push((w.start === w.end) ?
              w.start.toString() : w.start.toString() + '~' + w.end.toString());
          }
        });

        const prefix = 'Fileformat:1' + '\r\n'
          + 'HWType:SPdbUSBm' + '\r\n'
          + 'Start Time:' + await this.makeDateFormat(date) + '\r\n'
          + 'Integration Time:' + recipe.integration + ','
          + 'Interval:' + recipe.interval + ','
          + 'Sampling Time:' + recipe.sampling + '\r\n'
          + 'Time,VI 0,VI 1,' + wave.join(',') + ',' + this.waveTable.join(',');

        return prefix;
      },

      async makeDateFormat(date, isFileName=false){
        const yyyy = '' + date.getFullYear(),
          mm = ("0" + date.getMonth()).slice(-2),
          dd = ("0" + date.getDate()).slice(-2),
          hh = ("0" + date.getHours()).slice(-2),
          MM = ("0" + date.getMinutes()).slice(-2),
          ss = ("0" + date.getSeconds()).slice(-2),
          zzz = ("00" + date.getMilliseconds()).slice(-3);
        
        if(isFileName){
          return yyyy + mm + dd + '_' + hh + MM + ss;
        }
        else{
          return yyyy + '/' + mm + '/' + dd + ' '
            + hh + ':' + MM + ':' + ss + '.' + zzz + '(ms)';
        }
      },

      async makeWatchFormat(top){
        const data5 = this.data5;
        const wave = this.config.wave;

        const ret = [];
        data5.forEach((w, i) => {
          if(wave[i].view){
            ret.push(w[top].y);
          }
        });
        console.log(ret);

        return ret.join(',');
      },

      // SPdbUSBm.dll
      async getWLTable(p, ch){
        const ret = await SPdbUSBm.spGetWLTable(p, ch);
        console.log('getTable()');
        return ret;
      },

      async testChannel(){
        const ret = await SPdbUSBm.spTestAllChannels(1);
        console.log('testChannel()');
        return ret;
      },

      async assignChannel(p){
        const ret = await SPdbUSBm.spGetAssignedChannelID(p);
        console.log('assignChannel()');
        return ret;
      },

      async setupChannel(ch){
        const ret = await SPdbUSBm.spSetupGivenChannel(ch);
        console.log('setupChannel()');
        return ret;
      },

      async initChannel(ch){
        const ret = await SPdbUSBm.spInitGivenChannel(0, ch);
        console.log('initChannel()');
        return ret;
      },

      async closeChannel(ch){
        const ret = await SPdbUSBm.spCloseGivenChannel(ch);
        console.log('closeChannel()');
        return ret;
      },

      async setIntegration(ch){
        const ret = await SPdbUSBm.spSetIntEx(this.config.integration, ch);
        console.log('setIntegration()');
        return ret;
      },

      async readData(p, ch){
        const ret = await SPdbUSBm.spReadDataEx(p, ch);
        console.log('readData()');
        return ret;
      },

      async genDataObj(xArr, yArr){
        try{
          return xArr.map((el, i) => { return { 'x': el, 'y': yArr[i] }; });
        }
        catch{
          return { 'x': xArr, 'y': yArr };
        }
      },
    },

    watch: {
      config: {
        deep: true,

        handler(val){
          console.log(val);
        }
      },
    },

    computed: {
      range: function () {
        try{
          return this.config.wave.map((w) => {
            const start = w.start.toFixed(2),
              end = w.end.toFixed(2);
            console.log(start, end);
            return (start === end)? start.toString() : '' + start + '~' + end;
          });
        }
        catch(err){
          return new Array(5);
        }
      },
      // curCh: function(){
      //   return this.sel
      // },

      // isAutoSave: function(){
      //   return this.config.auto.use;
      // },

      isSave: function(){
        const auto = this.config.auto;
        const use = auto.use,
          start = this.wave2Idx(auto.start),
          end = this.wave2Idx(auto.end),
          avg = this.waveAverage(this.data2080, start, end);
        console.log(avg);

        return (avg >= auto.threshold)?
          use&&true : false;
      },

      isWave: function(){
        return this.config.wave.reduce((acc, cur) => {
          if(acc.view !== undefined){ acc = acc.view; }
          return acc || cur.view;
        });
      }
    },

    created() {
      console.log('> created DataView');
      this.data5 = [[], [], [], [], []];
      this.createdWL();
    },

    mounted() {
      console.log('> mounted DataView');
    }
  }
</script>

<style scoped>
</style>