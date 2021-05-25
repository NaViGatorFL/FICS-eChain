
<template>
  <div>
    <h1>PCB Assembler(Current Role)</h1>

    <router-link class="btn btn-light btn-lg active mr-3 ml-2 pl-4 pr-4" role="button" aria-pressed="true" to="PCBAssemblerSell">Ownership Transfer</router-link>
    <router-link class="btn btn-light btn-lg active mr-5 ml-3" role="button" aria-pressed="true" to="PCBAssemblerVerification" >Verification</router-link> &nbsp;&nbsp;
    <router-link class="btn btn-light btn-lg active mr-3 ml-2 pl-4 pr-4" role="button" aria-pressed="true" to="PCBAssemblerSearch">Search</router-link>
    <router-view></router-view>

  </div>
</template>

<script>

export default {
  name: 'OCM'
}
</script>