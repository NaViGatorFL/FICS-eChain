
<template>
  <div>
    <h1>IC Distributor 1(Current Role)</h1>

    <router-link class="btn btn-light btn-lg active mr-3 ml-2 pl-4 pr-4" role="button" aria-pressed="true" to="ICDistributor1Sell">Ownership Transfer</router-link>
    <router-link class="btn btn-light btn-lg active mr-5" role="button" aria-pressed="true" to="ICDistributor1Search" >Search</router-link>
    <router-view></router-view>

  </div>
</template>

<script>

export default {
  name: 'ICDistributor1'
}
</script>