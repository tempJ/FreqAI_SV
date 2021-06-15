<template droppable="true">
    <v-container>
      <overlay-modal
      :show="modal.show"
      :type="modal.type"
      :msg="modal.msg"
      />
        <tool-bar
        :channel="channel"
        :chList="chList"
        :save="save"
        @init="initCh"
        @get="getData"
        @save="saveData"
        @chIdx="getIdx"
        />

        <wave-chart
        :data="data2080"
        @wave="getWave"
        />

        <watch-chart
        :data="data5"
        />
    </v-container>
</template>

<script>
// component
import WaveChart from './WaveChart';
import WatchChart from './WatchChart';

import ToolBar from './ToolBar';
import ConfigSet from './ConfigSet';

import OverlayModal from './OverlayModal';

// module
import ffi from 'ffi-napi';
import ref from 'ref-napi';

// constant
const size = 2080;
const xArr = genSeqArr();

const shortPtr = ref.refType(ref.types.short);
const longPtr = ref.refType(ref.types.long);

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
});

function genSeqArr(){
  const tmp = [];
  for(let i=0; i<size; i++){
    tmp.push(i);
  }
  return tmp;
}
  export default {
    components: {
      WaveChart, WatchChart,
      ToolBar, ConfigSet,
      OverlayModal,
    },

    props: {
      config: Object,
    },
    
    name: 'DataChart',

    data: () => ({
      isSave: false,
      save: [],

      // chart
      data2080: null,
      data5: null,

      // interval: 100,
      // integration: 25,
      
      timeData: [],
      
      timeIdx: 0,
      // isWave: false,
      // wave5: new Array(5),
      // wave5: [new Array(2), new Array(2), new Array(2), new Array(2), new Array(2)],
      // wave5: [
      //   { view: false, start: 0, end: 0 },
      //   { view: false, start: 0, end: 0 },
      //   { view: false, start: 0, end: 0 },
      //   { view: false, start: 0, end: 0 },
      //   { view: false, start: 0, end: 0 },
      // ],

      // idx: null,

      // USB
      chIdx: null,
      channel: null,
      channels: null,
      chLabel: 'Channel',
      chList: [],

      timerId: null,

      // modal
      modal: {
        show: false,
        type: 'success',
        msg: ''
      },
    }),

    methods: {
      // Modal display and disable
      displayModal(type, msg){
        this.modal.show = true;
        this.modal.type = type;
        this.modal.msg = msg;

        this.modal.show = false;

        // return -1;
      },

      // Initialization
      initAll(isTimeClear = true){
        this.chIdx = null;
        this.channel = null;
        this.channels = null;
        this.chList = [];
        // 

        if(isTimeClear){
          clearInterval(this.timerId);
          this.timeIdx = 0;
          this.timeData = [];
          this.timerId = null;
        }
      },

      // Buffer
      allocBuffer(type, size){
        let buffer;

        switch (type) {
          case 'short':
            buffer = Buffer.alloc(size*2);
            break;
          case 'long':
            buffer = Buffer.alloc(size*4);
            break;
          default:
            break;
        }

        return buffer;
      },
      buff2Arr(buff, type){
        const size = buff.length;
        if(size < 2){ return -1; }
        if((size < 4) && (type === 'long')){ return -1; }
        let arr8 = new Uint8Array(buff);

        let arr;
        if(type === 'short'){
          arr = new Int16Array(arr8.buffer);
        }
        else if(type === 'long'){
          arr = new Int32Array(arr8.buffer);
        }
        else{
          return -1;
        }

        let ret = [];
        arr.forEach((el) => {
          ret.push(el);
        })

        return ret;
      },
      
      /////////////////////////////////////////////////////////////////////////////////////////
      // Toolbar
      async initCh(e){
        if(e){
          const slot = await this.testChannel();
          if(slot < 0){
            // this.initAll();
            return this.displayModal('error', `Failed check channel`);
          }

          const ch = this.allocBuffer('short', slot);
          
          await this.assignChannel(ch);
          this.channels = this.buff2Arr(ch, 'short');

          this.channels.forEach((el) => {
            this.chList.push('#ch' + el.toString());
          })
          this.channel = this.chList[0];
          // const ch = this.channels[e];
          
          // if(await this.setupChannel() < 0){
          //   this.initAll();
          //   return this.displayModal('error', `Failed communication via the USB port`);
          // }

          // if(await this.initChannel() < 0){
          //   this.initAll();
          //   return this.displayModal('error', `Failed initialization`);
          // }
        }
        else{
          const ch = this.channels[this.chIdx];
          if(await this.closeChannel(ch) >= 0){
            // console.log('ds')
            this.initAll();
            // console.log('dsf')
            this.displayModal('success', `Closed all channels`);
          }
        }
      },

      async getData(e, isRun = false){
        if(!isRun){
          const ch = this.channels[this.chIdx];

          if(await this.setupChannel(ch) < 0){
            return this.displayModal('error', `Failed communication via the USB port`);
          }

          if(await this.initChannel(ch) < 0){
            return this.displayModal('error', `Failed initialization`);
          }

          if(e >= 0){
            const ret = await this.setIntegration(ch);
            if(ret < 0){
              return this.displayModal('error', `Failed set integration time`);
            }
          }
        }

        if(e){
          // const ch = this.channels[this.chIdx];

          // if(await this.setupChannel(ch) < 0){
          //   return this.displayModal('error', `Failed communication via the USB port`);
          // }

          // if(await this.initChannel(ch) < 0){
          //   return this.displayModal('error', `Failed initialization`);
          // }

          // if(e >= 0){
          //   const ret = await this.setIntegration(ch);
          //   if(ret < 0){
          //     return this.displayModal('error', `Failed set integration time`);
          //   }
          // }

          this.timerId = setInterval(async () => {
            const data = this.allocBuffer('long', size);
            const ret = await this.readData(data, this.channels[this.chIdx]);
            if(ret < 0){
              return this.displayModal('error', `Failed get data`);
            }
            const yArr = this.buff2Arr(data, 'long');
            this.data2080 = this.genDataObj(xArr, yArr);

            if(this.isWave){ this.timeIdx++; }

            const wave = this.config.wave;
            const t = this.timeIdx;
            // for((w, i) in wave){
            //   if(w.view){
            //     const y = (yArr[w.start] + yArr[w.end]) / 2;
            //     const tmp = this.genDataObj([t], [y]);
            //     this.data5[i].push(tmp[0]);
            //   }
            // }
            wave.forEach((w, i) => {
              if(w.view){
                const y = (yArr[w.start] + yArr[w.end]) / 2;
                const tmp = this.genDataObj([t], [y]);
                this.data5[i].push(tmp[0]);
              }
            })

            // if(this.isSave){
            //   const timestamp = new Date().getTime();
            //   this.save.push(timestamp.toString() + ',' + yArr.join(','));
            // }
            if(this.isAutoSave && this.isHold){
              const date = new Date();
              this.save.push(this.makeDateFormat(date) + '0,0,' +
                this.makeWatchFormat() + ',' + yArr.join(','));
            }
            if(!this.isHold && this.save.length>0){
              const obj = new Object();
              obj.name = this.makeDateFormat(new Date(), true);
              obj.prefix = this.makeFileFormat1(this.config);
              obj.data = this.save;
              obj.isSave = !this.isHold;
              // obj.hold = this.isHold;

              this.$emit("save", obj);
              this.save = [];
            }
          }, this.config.interval);
        }
        else{
          clearInterval(this.timerId);
          this.timerId = null;
        }
      },

      saveData(e){
        // this.isSave = e;
        // if(e){
        //   this.save.push(this.makeSaveForm(this.config));
        // }
        // else{
        //   this.save = [];
        // }
      },

      // makeSaveForm(recipe){
      //   const prefix = 'Fileformat:1' + '\r\n'
      //     + 'HWType:SPdbUSBm' + '\r\n'
      //     + 'Start Time:' + date.toString() + '\r\n'
      //     + 'Integration Time:' + recipe.integration.toString() + ','
      //     + 'Interval:' + recipe.interval.toString() + ','
      //     + 'Sampling Time:' + recipe.sampling.toString() + '\r\n';
      //   return prefix;
      // },

      makeFileFormat1(recipe){
        const date = new Date();

        const wave = [];
        this.config.wave.forEach(w => {
          if(w.view){
            wave.push((w.start === w.end)?
              w.start.toString() : w.start.toString()+'~'+w.end.toString());
          }
        });

        const prefix = 'Fileformat:1' + '\r\n'
          + 'HWType:SPdbUSBm' + '\r\n'
          + 'Start Time:' + this.makeDateFormat(date) + '\r\n'
          + 'Integration Time:' + recipe.integration.toString() + ','
          + 'Interval:' + recipe.interval.toString() + ','
          + 'Sampling Time:' + recipe.sampling.toString() + '\r\n'
          + 'Time, VI 0, VI 1,' + wave.join(',');

        return prefix;
      },

      makeDateFormat(date, isFileName=false){
        if(isFileName){
          return date.getFullYear() + '_'
            + date.getMonth() + '_'
            + date.getDate() + '_'
            + date.getHours() + date.getMinutes() + date.getSeconds();
        }
        else{
          return date.getFullYear() + '/'
            + date.getMonth() + '/'
            + date.getDate() + ' '
            + date.getHours() + ':'
            + date.getMinutes() + ':'
            + date.getSeconds() + '.'
            + date.getMilliseconds() + '(ms)';
        }
      },

      makeWatchFormat(){
        const wave = this.config.wave;
        const idx = this.data5.length - 1;
        const ret = [];

        wave.forEach((w, i) => {
          if(w.view){
            // console.log(this.data5[i][idx])
            ret.push(this.data5[i][idx].y);
          }
        })
        
        return ret.join(',');
      },

      // SPdbUSBm.dll
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
        // const ret = await SPdbUSBm.spCloseAllChannels();
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

      async getIdx(e){
        this.chIdx = e;
        // const ch = this.channels[e];

        // if(await this.setupChannel(ch) < 0){
        //   return this.displayModal('error', `Failed communication via the USB port`);
        // }

        // if(await this.initChannel(ch) < 0){
        //   return this.displayModal('error', `Failed initialization`);
        // }

        // if(e >= 0){
        //   const ret = await this.setIntegration(ch);
        //   if(ret < 0){
        //     return this.displayModal('error', `Failed set integration time`);
        //   }
        // }
      },

      getWave(e){
        // const curr = e;
        // if(curr < 0 || curr >= size){
        //   return this.displayModal('warning', `Click invalid wave point`);
        // }
        // // this.wave5[this.sIdx] = curr;
        // if(!this.isWave){ this.isWave = true; }
      },

      // setWave(){

      // },

      genDataObj(xArr, yArr){
        const tmp = [];
        const len = xArr.length;
        for(let i=0; i<len; i++){
          const item = new Object();
          item.x = xArr[i];
          item.y = yArr[i];
          tmp.push(item);
        }
        return tmp;
      },
    },

    watch: {
      // 'config.interval': function(val){
      //   // const tId = this.timerId;
      //   console.log(val);
      //   if(this.timerId !== null){
      //     console.log(this.timerId);
      //     clearInterval(this.timerId);
      //     this.getData(true, true);
      //     console.log(this.timerId);
      //     // console.log
      //   }
      // },
      config: {
        deep: true,
        handler(val){
          // console.log('config');
          console.log(val);
        }
      },
      // interval: function(val){
      //   console.log('interval')
      //   console.log(val)
      // }
      // config: {
      //   deep: true,
      //   handler: function(){
      //     console.log(this.config)
      //   }
      // }
      // interval: function(){
      //   clearInterval(this.timerId);
      // },
      // integration: async function(){
      //   const ret = await this.setIntegration(this.channels[this.chIdx]);
      //   if(ret < 0){
      //     return this.displayModal('error', `Failed set integration time`);
      //   }
      //   console.log(this.integration);
      // }
      // setIntervalTime: function(){
      //   if(this.timerId === null){ return -1; }
      //   clearInterval(this.timerId);
      //   this.getData(true);
      // }
    },

    computed: {
      // interval: function (){
      //   return this.config.interval;
      //   // const tmp = this.config.interval;
      //   // console.log(tmp);
      //   // if(this.timerId !== null){ clearInterval(this.timerId); }

      //   // return tmp;
      // },
      // integration: async function (){
      //   return this.config.integration;
      //   // const tmp = this.config.integration;
      //   // console.log(tmp);

      //   // const ret = await this.setIntegration(this.channels[this.chIdx]);
      //   // if(ret < 0){
      //   //   return this.displayModal('error', `Failed set integration time`);
      //   // }

      //   // return tmp;
      // },
      // sampling: function (){
      //   return this.config.sampling;
      // },
      isAutoSave: function(){
        return this.config.auto.use;
      },
      isHold: function(){
        const auto = this.config.auto;
        // const isHold = (this.data2080[auto.start]+this.data2080[auto.end]/2 >= auto.threshold)?
        //   true : false;
        return (this.data2080[auto.start]+this.data2080[auto.end]/2 >= auto.threshold)?
          true : false;
      },
      isWave: function(){
        return this.config.wave.reduce((acc, cur) => {
          if(acc.view !== undefined){ acc = acc.view; }
          return acc || cur.view;
        });
        // this.config.wave.forEach((w) => {
        //   if(w.view) { return true; }
        // })
        // return false;
        // return this.config.wave[]
      }
    },

    // beforeCreate() {
    //   this.interval = 100;
    //   this.integration = 25;
    // },

    created() {
      this.data2080 = this.genDataObj(xArr, new Array(size));
      this.data5 = [[], [], [], [], []];
      // this.interval
      // this.wave5[3] = 1024;
    }
  }
</script>

<style scoped>
  #toolbar{
    /* position: fixed; */
    position: absolute;
    /* off */
    /* left: 30px;
    top: 100px; */
    z-index: 1022;
    background-color: rgba(255, 255, 255, 0);
  }

  .card {
    margin: 10px;
  }

  .body {
    padding: 20px;
  }

  .data {
    padding: 10px 23px 10px 23px;
  }

  .btn {
    padding: 10px;
    text-align: right;
  }

  /* .footer{
    margin-left: 50%;
  } */
</style>