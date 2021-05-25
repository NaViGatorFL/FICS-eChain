
<template>
  <div>
    <h1>System Integrator(Current Role)</h1>


    <router-link class="btn btn-light btn-lg active mr-3 ml-2 pl-4 pr-4" role="button" aria-pressed="true" to="SystemIntegratorSell">Ownership Transfer</router-link>
    <router-link class="btn btn-light btn-lg active mr-5 ml-3" role="button" aria-pressed="true" to="SystemIntegratorVerification" >Verification</router-link> &nbsp;&nbsp;
    <router-link class="btn btn-light btn-lg active mr-3 ml-2 pl-4 pr-4" role="button" aria-pressed="true" to="SystemIntegratorSearch">Search</router-link>
    <router-view></router-view>

  </div>
</template>

<script>

export default {
  name: 'SystemIntegrator'
}
</script>