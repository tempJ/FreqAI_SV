<template droppable="true">
  
    <v-container>
      
      <div
      @dragover="dragOver"
      @drop="dropOn"
      >
      <v-card
      id="toolbar"
      flat
      tile
      :draggable="draggable"
      @dragstart="dragStart"
      >
      <!-- @drag="dragOn" -->
        <v-toolbar
        elevation="2"
        dense
        floating
        >
          <v-btn
          icon
          draggable="true"
          @dragstart="draggable = true"
          @drag="draggable = true"
          @dragend="draggable = false"
          >
            <v-icon>open_with</v-icon>
          </v-btn>

          <v-btn
          color="primary"
          icon
          @click="checkChannel"
          >
            <v-icon>settings_power</v-icon>
          </v-btn>

          <v-btn
          color="success"
          icon
          @click="getData"
          >
            <v-icon>slideshow</v-icon>
          </v-btn>
          <!-- <v-btn
          color="primary"
          icon
          >
            <v-icon>usb</v-icon>
          </v-btn>
          <v-btn
          color="primary"
          icon
          @click="dataSave"
          >
            <v-icon>save</v-icon>
          </v-btn> -->
          
        </v-toolbar>
      </v-card>
      

      <line-chart id="chart" :title="title[0]" :theme="0" :xData="xData" :yData="yData" :focus="true" @child="getWave"/>
      <line-chart id="chart" :title="title[1]" :theme="1" :xData="xData" :yData="waveData" :focus="false"/>

    

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
    
      <v-overlay :value="overlay">
        <v-expand-transition>
          <v-alert
          class="modal"
          border="left"
          :type="modal.type"
          elevation="2"
          tile
          v-if="show"
          >
            {{ modal.msg }}
          </v-alert>
        </v-expand-transition>
      </v-overlay>
      </div>
    </v-container>
  
</template>

<script>
// front
import LineChart from './LineChart';
// import ToolBar from './ToolBar';
import ffi from 'ffi-napi';
import ref from 'ref-napi';

// back
// const remote = window.electron.remote;
// const { Socket } = remote.getGlobal('net');
// const ffi = require('ffi-napi');

// constant
const size = 2048;
// const slot;

const shortPtr = ref.refType(ref.types.short);
const longPtr = ref.refType(ref.types.long);
// const shortPtr = ref.refType(short);
const SPdbUSBm = ffi.Library('./src/libs/SPdbUSBm', {
  'spTestAllChannels': [ 'short', [ 'short' ] ],
  'spGetAssignedChannelID': [ 'void', [ shortPtr ] ],
  'spSetupGivenChannel': [ 'short', [ 'short' ] ],

  // 'spReadChannelID': [ 'short', [ 'pointer', 'short' ] ],
  
  'spReadChannelID': [ 'short', [ shortPtr, 'short' ] ],
  

  'spCloseGivenChannel': [ 'short', [ 'short' ] ],
  'spReadDataEx':  [ 'short', [ longPtr, 'short' ] ],
  
});

function genRanArr(){
  const tmp = [];
  for(;;){
    tmp.push(Math.round(Math.random()*10000)/100);
    if(tmp.length === size) break;
  }
  return tmp;
}
function genZeroArr(){
  const tmp = [];
  for(let i=0; i<size; i++){
    tmp.push(0);
  }
  return tmp;
}
function genSeqArr(){
  const tmp = [];
  for(let i=0; i<size; i++){
    tmp.push(i);
  }
  return tmp;
}

  export default {
    components: { LineChart },
    
    name: 'DataChart',

    data: () => ({
      // chart
      title: ['Whole Wave', 'Focus'],
      xData: genSeqArr(),
      yData: genRanArr(),
      timeData: [0],
      waveData: [[], [], [], [], []],
      wave: [],
      idx: null,

      // socket
      // port: null,
      // host: null,
      
      // socket: null,

      // USB
      slotNum: null,
      channel: null,
      channelID: null,

      // GUI
      show: false,
      overlay: false,
      draggable: false,
      // droppable: false,
      // vPort: null,
      // vHost: null,

      // disabled: {
      //   open: false,
      //   close: true
      // },
      

      modal: {
        type: 'success',
        msg: ''
      },

      // rules
      rules: {
        // port: [
        //   value => !!value || 'Required',
        //   value => (value && value.length === 4 && !isNaN(value*1)) || 'Input valid port number',
        // ],
        // host: [
        //   value => !!value || 'Required',
        //   value => (value && value.length < 16 && isNaN(value*1)) || 'Input valid host address',
        // ]
      }
    }),

    methods: {
      // GUI method
      // disabledBtn(isOpen){
      //   this.disabled.open = isOpen;
      //   this.disabled.close = !isOpen;
      // },
      displayModal(type, msg){
        this.modal.type = type;
        this.modal.msg = msg;
        this.show = !this.show;
        this.overlay = !this.overlay;
      },
      disableModal(){
        setTimeout(() => { this.modal.show = false; }, 3000);
      },
      dragStart(e){
        const target = e.target.parentElement.parentElement.parentElement;
        const targetId = target.id;
        e.dataTransfer.setDragImage(target, 27, 25);
        e.dataTransfer.setData('targetId', targetId);

        const obj = document.getElementById(targetId);
        const shiftX = e.clientX - obj.getBoundingClientRect().left;
        const shiftY = e.clientY - obj.getBoundingClientRect().top;
        e.dataTransfer.setData('shiftX', shiftX);
        e.dataTransfer.setData('shiftY', shiftY);
      },
      // dragOn(e){
        
      // },
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

      getWave(e){
        const curr = Math.round(e);
        if(curr === -1){
          this.displayModal('warning', `Click invalid wave point`);
          return -1;
        }
        if(this.wave.length < 5){
          this.wave.push(curr);
        }
        else{
          this.wave[0] = curr;
        }
        this.pushSwitchLen(this.waveData, this.yData, this.wave);
      },

      async checkChannel(){

        // new Promise((resolve, reject) => {
        //   this.slotNum = SPdbUSBm.spTestAllChannels(1);
        //   resolve(this.slotNum);
        // })
        // .then((res) => {
        //   if(res < 0){
        //     return this.displayModal('error', `Failed check channel`);
        //   }
        //   this.channel = Buffer.alloc(res);
        //   SPdbUSBm.spGetAssignedChannelID(this.channel);
        //   console.log(this.channel);
        // })

        this.slotNum = await this.testChannel();
        if(this.slotNum === -1){
          return this.displayModal('error', `Failed check channel`);
        }

        this.channel = Buffer.alloc(this.slotNum);
        await this.assignChannel(this.channel);
        console.log(this.channel);

        // for(const ch in this.channel)
        // const len = this.channel.length;
        for(let i=0; i<this.slotNum; i++){
          console.log(this.channel[i])
          let ret = await this.setupChannel(this.channel[i]);
          if(ret < 0){
            return this.displayModal('error', `Failed communication via the USB port`);
          }
          console.log(`ret: ${ret}`)

          const tmp = Buffer.alloc(1);
          ret = this.readChannel(tmp, this.channel[i]);
          if(ret < 0){
            return this.displayModal('error', `Failed communication via the USB port`);
          }
          // console.log(tmp);
        }
      },

      async getData(){
        // console.log(this.slotNum);
        // console.log(this.channel);
        if(this.slotNum === null){
          return this.displayModal('error', `Plz get channel ID`);
        }

        let data = Buffer.alloc(size);
        const ret = await this.readData(data, this.channel[0]);
        if(ret < 0){
          return this.displayModal('error', `Failed get data`);
        }

        console.log(data);
      },

      async testChannel(){
        console.log('testChannel()');
        return await SPdbUSBm.spTestAllChannels(1);
      },

      async assignChannel(p){
        console.log('assignChannel()');
        return await SPdbUSBm.spGetAssignedChannelID(p);
      },

      async setupChannel(ch){
        const ret = await SPdbUSBm.spSetupGivenChannel(ch);
        console.log('setupChannel()');
        return ret;
      },

      async readChannel(p, ch){
        const ret = await SPdbUSBm.spReadChannelID(p, ch);
        console.log('readChannel()');
        return console.log({ r, ret });
      },

      async readData(p, ch){
        const ret = await SPdbUSBm.spReadDataEx(p, ch);
        console.log('readData()');
        return ret;
      },

      // async delay(){
      //   const ret = await setTimeout(() => {
      //     console.log('delay()');
      //     // resolve(0);
      //     // return 0;
      //   }, 3000);
      //   // console.log(ret);
      //   return ret;
      // },

      // testChannel(){
      //   return new Promise((resolve, reject) => {
      //     const ret = SPdbUSBm.spTestAllChannels(1);
      //     if(ret < 0){ reject(-1); }
      //     else{ resolve(ret); }
      //   })
      // },

      // assignChannel(p){
      //   return new Promise((resolve) => {
      //     SPdbUSBm.spGetAssignedChannelID(p);
      //     resolve(1);
      //   })
      // },

      // setupChannel(ch){
      //   return new Promise((resolve, reject) => {
      //     const r = this.delay();
      //     console.log('setup');
      //     const ret = SPdbUSBm.spSetupGivenChannel(ch);
      //     if(ret < 0){ reject(-1); }
      //     else{ resolve(ret, r); }
      //   })
      // },

      // readChannel(p, ch){
      //   return new Promise((resolve, reject) => {
      //     console.log('read');
      //     const ret = SPdbUSBm.spReadChannelID(p, ch);
      //     if(ret < 0){ reject(-1); }
      //     else{ resolve(ret); }
      //   })
      // },

      // readData(p, ch){
      //   return new Promise((resolve, reject) => {
      //     const ret = SPdbUSBm.spReadDataEx(p, ch);
      //     resolve(ret);
      //   })
      // },

      dataSave(){

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
      pushSwitchLen(arr, data, idx){
        const len = arr.length;
        switch (len) {
          case 5:
            arr[4].push(data[idx[4]]);
          case 4:
            arr[3].push(data[idx[3]]);
          case 3:
            arr[2].push(data[idx[2]]);
          case 2:
            arr[1].push(data[idx[1]]);
          case 1:
            arr[0].push(data[idx[0]]);
          default:
            break;
        }
      },
    },

    watch: {
      show(val){
        // console.log('w')
        // console.log(val);
        val && setTimeout(() => {
          this.show = false;
        }, 3000);
      },
      // : 'disableModal',
      overlay(val){
        // console.log(val);
        val && setTimeout(() => {
          this.overlay = false;
        }, 3000);
      },
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
    z-index: 1024;
    background-color: rgba(255, 255, 255, 0);
  }
  #chart{
    /* z-index: 1; */
  }
  .modal{
    width: 90vw;
    position: fixed;
    /* align: center; */
    /* left: 50%; */
    left: 4vw;
    bottom: 10px;
  }
  .card {
    margin: 10px;
  }

  .body {
    padding: 20px;
  }

  .data {
    padding: 10px 23px 10px 23px;
    /* padding-left: 20px; */
  }

  .btn {
    padding: 10px;
    text-align: right;
  }
</style>