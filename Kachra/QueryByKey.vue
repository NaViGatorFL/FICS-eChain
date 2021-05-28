<template>
  <div class="posts">
    <br>
    <br>
    <h2>Query By Key</h2>
    <br>
    <form v-on:submit="queryByKey">
      <input id = "mnsd" type="text" v-model="input.key" placeholder="Enter Key to Query">
      <br>
      <br>

      <input type="submit" value="Query">
      <br>
      <br>
      <span v-if="input">
        <b>{{ input.data }}</b>
      </span>  
      <br>
    </form>

    <br>
      <vue-instant-loading-spinner id='loader' ref="Spinner"></vue-instant-loading-spinner>
  </div>
</template>

<script>
import PostsService from "@/services/apiService";

export default {
  name: "response",
  data() {
    return {
     input: {
        data: ""
      }
    };
  },
  components: {

  },
  methods: {
    async queryByKey() {
      console.log('this.input: ');
      console.log(this.input);
      if (!this.input.key) {
        console.log('this.input$#: ');
        let response = 'Please enter a Key to query for.';
        this.input.data = response;
      } else {
        const apiResponse = await PostsService.queryByKey(this.input.key);
        console.log(apiResponse);
        this.input = apiResponse;
      }
    }
  }
};
</script>

<style>
#mnsd{
  text-align:  center;
  border: #222222;
}
</style>