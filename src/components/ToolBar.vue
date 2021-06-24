<template droppable="true">
    <v-container>
      <v-card
      id="toolbar"
      flat
      tile
      width="320px"
      :draggable="draggable"
      @dragstart="dragStart"
      >
        <v-toolbar
        elevation="1"
        >
          <v-btn
          icon
          plain
          width="20px"
          color="secondary"
          draggable="true"
          @dragstart="draggable = true"
          @drag="draggable = true"
          @dragend="draggable = false"
          >
            <v-icon>drag_indicator</v-icon>
          </v-btn>

          <v-select
          class="select"
          dense
          outlined
          prefix="Channel:"
          draggable="false"
          :disabled="ready"
          :items="chList"
          v-model="selCh"
          ></v-select>

          <v-btn
          icon
          :color="initColor"
          @click="initChannel"
          >
            <v-icon>power_settings_new</v-icon>
          </v-btn>

          <v-btn
          icon
          :color="getColor"
          :disabled="ready"
          @click="getData"
          >
            <v-icon>{{ getIcon }}</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-container>
</template>

<script>
  export default {
    props: {
      chList: Array,
    },

    name: 'ToolBar',

    data: () => ({
      draggable: false,
      ready: true,

      initColor: 'success',
      
      getColor: 'success',
      getIcon: 'play_arrow',

      selCh: null,
    }),

    methods: {
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

      // Initialization
      initToolbar(isTrue = true){
        if(isTrue){
          this.initColor = 'success';
        }
        else{
          this.initColor = 'error';
        }
        this.ready = isTrue;
      },

      initChannel(){
        if(this.initColor === 'success'){
          this.$emit("init", true);
          this.initToolbar(false);
        }
        else{
          this.$emit("init", false);
          this.initToolbar();
        }
      },

      startGet(isStop = true){
        if(isStop){
          this.getColor = 'error';
          this.getIcon = 'stop';
        }
        else{
          this.getColor = 'success';
          this.getIcon = 'play_arrow';
        }
      },

      getData(){
        if(this.getColor === 'error'){
          this.$emit("get", false);
          this.startGet(false);
        }
        else{
          this.$emit("get", true);
          this.startGet();
        }
      },
    },

    watch: {
      chList: {
        deep: true,

        handler(val){
          if(val.length > 0) {
            this.selCh = val[0];
          }
        }
      },

      selCh(val){
        this.$emit("selCh", this.chList.indexOf(val));
      }
    },
  }
</script>

<style scoped>
  #toolbar{
    position: fixed;
    left: 340px;
    top: 10px;
    z-index: 1022;
    background-color: rgba(255, 255, 255, 0);
  }
  .select{
    font-size: 15px;
    margin: 10px;
    height: 24px;
  }
</style>