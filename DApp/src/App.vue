<template>
  <div id="app">
    <Navbar />
<!--    <img alt="Hyper" src="./assets/hyper.png">-->
    <HelloWorld msg="ASSET TRANSACTION CENTER"/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Navbar from "@/components/Navbar";
export default {
  name: 'App', // This is home page.
  components: {
    HelloWorld,
    Navbar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
