<template>
  <div class="normal-case tracking-normal" >
    <i class= "icon-usd" @click.prevent="show" id='clickableAwesomeFont'> Delete </i>
    <modal name="ocm-delete"  :adaptive="true" :height="550" :width="500">
      <div class="px-10 py-8" id = "modalReg">
        <div>
          <h1 id="asd">Upload a xlsx file to delete assets</h1>
          <input
              id="dsa"
              type="file"
              @change="excelExport"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
        </div>
      </div>
    </modal>
  </div>
</template>



<script>
import XLSX from '/Users/chiragmaroke/Desktop/fics-ui/client/node_modules/xlsx/dist/xlsx.full.min.js'
import PostsService from "@/services/apiService";

export default {
  name : 'Delete',
  data() {
    return {
      excelData: []
    };
  },
  methods: {
    show() {
      this.$modal.show('ocm-delete')
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
          PostsService.sellAsset(this.excelData);
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
#dsa{
  color: #2c3e50;
  font-family: Avenir;
  margin-top: 30px;
  margin-left: 100px;
}

#clickableAwesomeFont {
  font-size: 50px;
  margin: 50px;
  margin-block: 30px;
  cursor: pointer
}

</style>