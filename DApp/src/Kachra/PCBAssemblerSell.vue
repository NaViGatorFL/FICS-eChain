<template>
  <div class="normal-case tracking-normal" >

    <div class="px-10 py-8" id = "modalReg">
      <div>
        <h1 id="asd">Upload a xlsx file to <b>Transfer</b> assets</h1>
      </div>
    </div>


    <div class="input-group w-50 mx-auto">
      <div class="custom-file w-25">
        <input
            id="inputGroupFile04" aria-describedby="inputGroupFileAddon04"
            class="custom-file-input w-25"
            type="file"
            @change="excelExport"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
        <label class="custom-file-label" for="inputGroupFile04">Choose file</label>
      </div>
      <div class="input-group-append w-25">
        <button class="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04" v-on:click="submitFile()">Transfer</button>
      </div>
    </div>

    <p id="showTransferStatus"> </p>
  </div>
</template>



<script>
import XLSX from '../../node_modules/xlsx/dist/xlsx.full.min.js'
import PostsService from "@/services/apiService";

export default {
  name : 'PCBAssemblerSell',
  data() {
    return {
      excelData: [],
      newOwnerName : "PCB-Distributor",
      newOwnerMSPID : "PCB-Distributor-MSPID"
    };
  },
  methods: {

    async submitFile(){

      var response = await PostsService.sellAsset(this.excelData, this.newOwnerName, this.newOwnerMSPID, "PCB-Assembler");
      console.log(response.data)
      var divContainer = document.getElementById("showTransferStatus");
      divContainer.innerHTML = "<br>" + "<br>" + "Total number of assets submitted for enrollment : " + response.data.Submitted +
          "<br>" + "<br>" + "Number of newly transferred assets : " + response.data.Transfered + "<br>" + "<br>" + "Number of submitted assets that do not exist : " + response.data.Rejected;
      //    divContainer.innerHTML = "<br>" + "<br>" + "Number of newly enrolled assets : " + response.data.Enrolled;
      //  divContainer.innerHTML = "<br>" + "<br>" + "Number of enrolled assets that already existed : " + response.data.Rejected;
    },
    excelExport(event) {
      var input = event.target;
      var reader = new FileReader();
      reader.onload = () => {
        var fileData = reader.result;
        var wb = XLSX.read(fileData, {type: 'binary'});
        wb.SheetNames.forEach((sheetName) => {
          this.excelData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
          console.log(this.excelData);
        })
      };
      reader.readAsBinaryString(input.files[0]);
    }

  }
};
</script>


<style>

#asd{
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-top: 30px;
}

</style>