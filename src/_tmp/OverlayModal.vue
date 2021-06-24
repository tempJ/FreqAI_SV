<template>
  <v-overlay
  :value="alert"
  >
    <v-expand-transition>
      <v-alert
      dense
      dismissible
      class="modal"
      border="left"
      :type="type"
      elevation="2"
      v-model="alert"
      
      >
      <!-- v-if="isShow" -->
        {{ msg }}
      </v-alert>
    </v-expand-transition>
  </v-overlay>
</template>

<script>
  export default {
    props: {
      show: Boolean,
      type: String,
      msg: String
    },
    name: 'OverlayModal',

    data: () => ({
      // isShow: false
      alert: false,
    }),

    methods: {
      // displayModal(){
      //   this.modal.type = type;
      //   this.modal.msg = msg;
      //   this.show = !this.show;
      //   this.overlay = !this.overlay;
      //   return -1;
      // },

      // disableModal(){
      //   setTimeout(() => { this.show = false; }, 3000);
      // },
    },

    watch: {
      show(val){
        console.log(val)
        if(val){
          // this.isShow = true;
          this.alert = true;
          setTimeout(() => {
            this.alert = false;
            // this.isShow = false;
          }, 3000);
        }
      },
      alert(val){
        setTimeout(() => {
          this.alert = false;
          // this.isShow = false;
        }, 3000);
        // if(!)
      }
      // overlay(val){
      //   val && setTimeout(() => {
      //     this.overlay = false;
      //   }, 3000);
      // },
    },
  }
</script>

<style scoped>
  .modal{
    width: 30vw;
    position: fixed;
    z-index: 2048;
    left: 40vw;
    bottom: 10px;
  }
</style>