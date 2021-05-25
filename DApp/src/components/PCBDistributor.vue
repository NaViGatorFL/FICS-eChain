
<template>
  <div>
    <h1>PCB Distributor(Current Role)</h1>

    <router-link class="btn btn-light btn-lg active mr-3 ml-2 pl-4 pr-4" role="button" aria-pressed="true" to="PCBDistributorSell">Ownership Transfer</router-link>
    <router-link class="btn btn-light btn-lg active mr-3 ml-2 pl-4 pr-4" role="button" aria-pressed="true" to="PCBDistributorSearch">Search</router-link>

    <router-view></router-view>

  </div>
</template>

<script>

export default {
  name: 'SystemDistributor'
}
</script>