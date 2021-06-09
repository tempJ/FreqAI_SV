<template droppable="true">
    <v-container>
      <overlay-modal
      :show="modal.show"
      :type="modal.type"
      :msg="modal.msg"
      />
      <!-- <div
      @dragover="dragOver"
      @drop="dropOn"
      > -->
        <tool-bar
        :channel="channel"
        :chList="chList"
        :saveDatas="saveDatas"
        @init="initCh"
        @get="getData"
        @gets="getDatas"
        @save="saveData"
        @chIdx="getIdx"
        />

        <line-chart
        :xData="xData"
        :yData="yData"
        @child="getWave"
        />
        
        <wave-chart
        :sIdx="sIdx"
        :timeData="timeData"
        :waveData="waveData"
        />

    <!-- <v-row>
      <v-col cols="6">
        <v-card
        class="card"
        tile
        > -->
          <!-- <div class="btn">
            <v-btn
            color="primary"
            icon
            :disabled="disabled.usb"
            @click="openUsb"
            >
              <v-icon>usb</v-icon>
            </v-btn>
          </div> -->

          <!-- <div class="btn">
            <v-btn
            color="primary"
            icon
            @click="openUsb"
            >
              <v-icon>usb</v-icon>
            </v-btn>
            <v-btn
            color="success"
            icon
            :disabled="disabled.open"
            @click="openSocket"
            >
              <v-icon>login</v-icon>
            </v-btn>
            <v-btn
            color="error"
            icon
            :disabled="disabled.close"
            @click="closeSocket"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </div>
        </v-card> -->

        <!-- <v-card
        class="card"
        tile
        >
          <div class="body">
            <v-text-field
            label="Port"
            :rules="rules.port"
            v-model="vPort"
            >{{ vPort }}
            </v-text-field>
            <v-text-field
            label="Host"
            :rules="rules.host"
            v-model="vHost"
            >{{ vHost }}
            </v-text-field>
          </div>
        </v-card> -->
      <!-- </v-col> -->
      <!-- <v-col>
        <v-card
        class="card"
        tile
        > -->
          <!-- <div class="data" v-for="w in wavePoint" :key="w">{{ w }}, </div> -->

          <!-- <v-expansion-panels accordion><v-expansion-panel>
          <v-expansion-panel-header>Recive Data</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-simple-table>

                  <tbody>
                    <tr
                    v-for="(item, idx) in yData"
                    :key="idx"
                    >
                      <td :style="{'fontSize': '12px'}">{{ item }}</td>
                    </tr>
                  </tbody>

              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel></v-expansion-panels> -->
        <!-- </v-card>
      </v-col> -->
    <!-- </v-row> -->
    
      
      <!-- </div> -->

      <template>
        <v-footer
        fixed
        color="rgba(255, 255, 255, 0)"
        :style="{'padding': '0px'}"
        >
        
          <div class="footer">
            <config-set
            @config="setConfig"
            />
          </div>
          <!-- <v-spacer></v-spacer> -->
          
        </v-footer>
      </template>
      
      
    </v-container>
  
</template>

<script>
// component
import ConfigSet from './ConfigSet';
import LineChart from './LineChart';
import WaveChart from './WaveChart';
import OverlayModal from './OverlayModal';
import ToolBar from './ToolBar';

// module
import ffi from 'ffi-napi';
import ref from 'ref-napi';

// back
// const remote = window.electron.remote;
// const { Socket } = remote.getGlobal('net');

// constant
const size = 2080;

const shortPtr = ref.refType(ref.types.short);
const longPtr = ref.refType(ref.types.long);

// dll
const SPdbUSBm = ffi.Library('./src/libs/SPdbUSBm', {
  'spTestAllChannels': [ 'short', [ 'short' ] ],
  'spGetAssignedChannelID': [ 'void', [ shortPtr ] ],
  'spSetupAllChannels': [ 'short', [ ] ],
  'spInitAllChannels':  [ 'short', [ 'short' ] ],
  'spSetIntEx':  [ 'short', [ 'long', 'short' ] ],
  'spCloseAllChannels': [ 'short', [ ] ],
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
    components: { ToolBar, LineChart, WaveChart, ConfigSet, OverlayModal },
    
    name: 'DataChart',

    data: () => ({
      isSave: false,

      // chart
      xData: genSeqArr(),
      yData: new Array(size), 
      timeData: [],
      saveDatas: [],
      // waveData1: [],
      timeIdx: 0,
      isWave: false,
      waveData: [[], [], [], [], []],
      wave: new Array(5),
      idx: null,

      setIntervalTime: 100,

      // socket
      // port: null,
      // host: null,
      
      // socket: null,

      // USB
      // slotNum: null,
      sIdx: 0,
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
        // return -1;
      },

      // Toolbar drag and drop
      dragOver(e){
        e.preventDefault();
      },
      dropOn(e){
        const targetId = e.dataTransfer.getData('targetId');
        const shiftX = e.dataTransfer.getData('shiftX');
        const shiftY = e.dataTransfer.getData('shiftY');

        e.preventDefault();
        this.moveAt(targetId, shiftX, shiftY, e.pageX, e.pageY);
      },
      moveAt(targetId, shiftX, shiftY, pageX, pageY){
        const obj = document.getElementById(targetId);
        
        obj.style.left = pageX - shiftX + 'px';
        obj.style.top = pageY - shiftY + 'px';
      },

      // Initialization
      initAll(){
        // this.slotNum = null;
        this.channel = null;
        this.channels = null;
        this.chList = [];
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
            this.initAll();
            return this.displayModal('error', `Failed check channel`);
          }

          const ch = this.allocBuffer('short', slot);
          
          await this.assignChannel(ch);
          this.channels = this.buff2Arr(ch, 'short');
          
          // if(this.channels.length <= 0){
          //   this.initAll();
          //   return this.displayModal('error', `Not found any channel`);
          // }

          this.channels.forEach((el) => {
            this.chList.push('#ch' + el.toString());
          })
          this.channel = this.chList[0];
          
          if(await this.setupChannel() < 0){
            this.initAll();
            return this.displayModal('error', `Failed communication via the USB port`);
          }

          if(await this.initChannel() < 0){
            this.initAll();
            return this.displayModal('error', `Failed initialization`);
          }
        }
        else{
          if(await this.closeChannel() >= 0){
            this.initAll();
            return this.displayModal('success', `Closed all channels`);
          }
        }
      },

      async getData(){
        if(e){
          const data = this.allocBuffer('long', size);
          const ret = await this.readData(data, this.channels[this.chIdx]);
          if(ret < 0){
            return this.displayModal('error', `Failed get data`);
          }
          this.yData = this.buff2Arr(data, 'long');
        }
      },

      async getDatas(e){
        if(e){
          this.timerId = setInterval(async () => {
            const data = this.allocBuffer('long', size);
            const ret = await this.readData(data, this.channels[this.chIdx]);
            if(ret < 0){
              return this.displayModal('error', `Failed get data`);
            }
            this.yData = this.buff2Arr(data, 'long');

            if(this.isWave){
              this.timeIdx++;
              this.timeData.push(this.timeIdx);
              // this.wave.forEach((w) => {
              //   if(Number.isInteger(w)){}
              // })
              // for(let i=0; i<5; i++){
              //   if(Number.isInteger(this.wave[i])){
              //     this.waveData[i].push(this.yData[this.wave[i]]);
              //   }
              // }
              this.waveData[0].push(this.yData[this.wave[0]]);
              this.waveData[1].push(this.yData[this.wave[1]]);
              this.waveData[2].push(this.yData[this.wave[2]]);
              this.waveData[3].push(this.yData[this.wave[3]]);
              this.waveData[4].push(this.yData[this.wave[4]]);
            }
            // this.wave.forEach((w) => {
            //   if(Number.isInteger(w)){}
            // })
            // if(this.wave.length > 0){
            //   this.timeIdx++;
              // this.timeData = new Date().getTime() / (this.setIntervalTime * 1000);
              this.timeData.push(this.timeIdx);
              this.waveData[0].push(this.yData[this.wave[0]]);
              // console.log(this.timeData)
              // console.log(this.waveData)
            // }

            if(this.isSave){
              const timestamp = new Date().getTime();
              this.saveDatas.push(timestamp.toString() + '\n' + this.yData.join('\n'));
              // console.log(this.saveDatas[this.saveDatas.length - 1].length)
            }
          }, this.setIntervalTime);
        }
        else{
          clearInterval(this.timerId);
          this.timerId = null;
        }
      },

      saveData(e){
        this.isSave = e;
        if(!e){
          this.saveDatas = [];
        }
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

      async setupChannel(){
        const ret = await SPdbUSBm.spSetupAllChannels();
        console.log('setupChannel()');
        return ret;
      },

      async initChannel(){
        const ret = await SPdbUSBm.spInitAllChannels(0);
        console.log('initChannel()');
        return ret;
      },

      async closeChannel(){
        const ret = await SPdbUSBm.spCloseAllChannels();
        console.log('closeChannel()');
        return ret;
      },

      async setIntegration(ch){
        const ret = await SPdbUSBm.spSetIntEx(25, ch);
        console.log('setIntegration()');
        return ret;
      },

      async readData(p, ch){
        const ret = await SPdbUSBm.spReadDataEx(p, ch);
        console.log('readData()');
        return ret;
      },

      // Socket method
      // async openSocket(){
      //   if(this.socket !== null){
      //     return this.displayModal('error', `Current port: ${this.port}`);
      //   }

      //   if(this.vPort.length !== 4 || isNaN(this.vPort * 1)){
      //     return this.displayModal('error', `Input valid port(4 digit): ${this.vPort}`);
      //   }
        
      //   this.port = this.vPort * 1;
      //   this.host = this.vHost;

      //   // this.modal.show = false;
      //   this.disabledBtn(true);

      //   this.socket = new Socket();
      //   this.socket.connect(this.port, this.host);

      //   this.socket.on('connect', () => {
      //     this.displayModal('success', `Success open port: ${this.vPort}`);
      //     this.socket.write('true');

      //     this.socket.on('data', (msg) => {
      //       this.yData = msg.toString().split('\n');
      //       this.pushSwitchLen(this.waveData, this.yData, this.wave);
      //     })
      //   });

      //   this.socket.on('error', (err) => {
      //     this.displayModal('error', err);
      //     this.closeSocket();
      //   });

      //   this.socket.on('timeout', () => {
      //     this.displayModal('warning', `Socket timeout`);
      //     this.closeSocket();
      //   });
      // },

      // closeSocket(){
      //   if(this.socket === null){
      //     return this.displayModal('error', `Current port is undefined`);
      //   }

      //   this.socket.end();
      //   this.socket = null;

      //   this.disabledBtn(false);
      // },

      // pushData(data, item){
      //   if(data.length >= size){ data.shift(); }
      //   data.push(item);
      // },

      ///////////////////////////////////////////////////////////////////////////////////////
      setConfig(e){
        this.setIntervalTime = e;
      },
      async getIdx(e){
        this.chIdx = e;

        // if(e < 0){
        //   return this.displayModal('error', `Not found ${this.channel}`);
        // }
        if(e >= 0){
          const ret = await this.setIntegration(this.channels[e]);
          if(ret < 0){
            return this.displayModal('error', `Failed set integration time`);
          }
        }
      },
      getWave(e){
        const curr = e;
        if(curr < 0 || curr >= size){
          return this.displayModal('warning', `Click invalid wave point`);
        }
        this.wave[this.sIdx] = curr;
        this.isWave = true;
        // if(this.wave.length < 5){
        //   this.wave.push(curr);
        // }
        // else{
        //   this.wave[0] = curr;
        // }
        // console.log(this.wave)
        // this.pushSwitchLen(this.waveData, this.yData, this.wave);
      },
      // pushSwitchLen(arr, data, idx){
      //   const len = arr.length;
      //   switch (len) {
      //     case 5:
      //       arr[4].push(data[idx[4]]);
      //     case 4:
      //       arr[3].push(data[idx[3]]);
      //     case 3:
      //       arr[2].push(data[idx[2]]);
      //     case 2:
      //       arr[1].push(data[idx[1]]);
      //     case 1:
      //       arr[0].push(data[idx[0]]);
      //     default:
      //       break;
      //   }
      // },
    },

    watch: {
    },

    computed: {
      // wavePoint: function(){
      //   const idx = this.wave;
      //   const tmp = this.yData[idx];
      //   this.pushData(this.waveData, tmp);
      //   return tmp;
      // }
    },

    mounted() {
      // this.wave[0] = 1024;
      // this.vPort = '1024';
      // this.vHost = 'localhost';
      // this.title[1] = 'Focus: ' + this.wave.toString();
    }
  }
</script>

<style scoped>
  #toolbar{
    position: fixed;
    left: 30px;
    top: 100px;
    z-index: 1022;
    background-color: rgba(255, 255, 255, 0);
  }

  /* #select{
    padding: 10px 10px 0px 0px;
    width: 120px;
  } */

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

  .footer{
    margin-left: 50%;
  }
</style>