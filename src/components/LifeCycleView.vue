<template>
  <div>
    <h1>this is Home page</h1>
    <p>{{names}}</p>
    <button v-on:click="dateupdate()">click</button>
  </div>
</template>

<script>
export default{
  data(){
   return{
     names:"balmostory"
    }
  },
  beforeCreate(){
    console.log("beforeCreate",this.names)
  },
  created(){
    console.log("created",this.names)
  },
  beforeMount(){
    alert("beforeMount")
  },
  mounted(){
    alert("mounted")
  },
  beforeUpdate(){
    alert("beforeUpdate")
  },
  updated(){
    alert("updated")
  },
  beforeDestroy(){
    alert("beforeDestroy")
  },
  destroyed(){
    alert("destroyed")
  },
  methods:{
    dateupdate(){
      this.names="hihihi";
    }
  }
}
</script>


<style scoped>
h1{
  color: red;
  font-size: 20px;
}
</style>