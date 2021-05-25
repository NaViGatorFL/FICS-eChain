<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>CHOOSE ROLE:</h3><br>
        <select class="btn btn-light dropdown-toggle w-50" v-model="selected"  >
          <option disabled selected value = "">Please select one</option>
          <option >OCM</option>
          <option >ICDistributor1</option>
          <option >ICDistributor2</option>
          <option >PCB Assembler</option>
          <option >PCB Distributor</option>
          <option >System Integrator</option>
          <option >System Distributor</option>
        </select>
    <br>
    <br>
    <button class="btn btn-light btn-sm active mx-auto" role="button" aria-pressed="true" v-on:click="loadRole()">Submit Role</button>
    <br>
    <br>
    <div v-if= "response === 'ICDistributor1'">
      <ICDistributor1 />
    </div>
    <div v-else-if= "response === 'OCM'">
      <OCM />
    </div>
    <div v-else-if= "response === 'ICDistributor2'">
      <ICDistributor2 />
    </div>
    <div v-else-if= "response === 'PCB Assembler'">
      <PCBAssembler />
    </div>
    <div v-else-if= "response === 'PCB Distributor'">
      <PCBDistributor />
    </div>
    <div v-else-if= "response === 'System Distributor'">
      <SystemDistributor />
    </div>
    <div v-else-if= "response === 'System Integrator'">
      <SystemIntegrator />
    </div>
  </div>
</template>

<script>

import OCM from "@/components/OCM";
import ICDistributor1 from "@/components/ICDistributor1";
import ICDistributor2 from "@/components/ICDistributor2";
import PCBDistributor from "@/components/PCBDistributor";
import PCBAssembler from "@/components/PCBAssembler";
import SystemIntegrator from "@/components/SystemIntegrator";
import SystemDistributor from "@/components/SystemDistributor";



export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    ICDistributor1,
    ICDistributor2,
    OCM,
    PCBDistributor,
    PCBAssembler,
    SystemIntegrator,
    SystemDistributor
  },
  data() {
    return {
      selected: {
        data: ""
      },
      response: null
    };
  },
  methods: {
    async loadRole() {
      this.response = null;
      //check to make sure the user selected something
      if (this.selected != 'OCM' && this.selected != 'ICDistributor1'
          && this.selected != 'ICDistributor2' && this.selected != 'PCB Assembler'
          && this.selected != 'PCB Distributor' && this.selected != 'System Integrator'
          && this.selected != 'System Distributor') {
        let result = `Please select a correct type of object!`;
        this.response = result;
        console.log(this.response);
      } else if (this.selected === 'OCM') {
        let result = `OCM`;
        this.response = result;
      } else if (this.selected === 'ICDistributor1') {
        let result = `ICDistributor1`;
        this.response = result;
      } else if (this.selected === 'ICDistributor2') {
        let result = `ICDistributor2`;
        this.response = result;
      } else if (this.selected === 'PCB Assembler') {
        let result = `PCB Assembler`;
        this.response = result;
      } else if (this.selected === 'PCB Distributor') {
        let result = `PCB Distributor`;
        this.response = result;
      } else if (this.selected === 'System Integrator') {
        let result = `System Integrator`;
        this.response = result;
      } else if (this.selected === 'System Distributor') {
        let result = `System Distributor`;
        this.response = result;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>
