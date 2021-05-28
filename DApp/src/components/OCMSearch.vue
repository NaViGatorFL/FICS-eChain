<template>
<div>
<!--    <modal name="ocm-verify"  :adaptive="true" :height="550" :width="500">-->
<!--        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>-->
<!--      </label>-->
<h1 id = "head"> Search Asset History</h1>
<input onclick="document.getElementById('custom').disabled = false; document.getElementById('file').disabled = true;" type="radio" name="type" checked="checked" id = "radiobutton"> Search by ID
<input type="text" name="custom" id="custom" v-model="input.data" placeholder="Enter SI" >
<br><br>
<label>
  <input onclick="document.getElementById('custom').disabled = true; document.getElementById('file').disabled = false;" type="radio" name="type" value="customurl"  id = "buttonForFile"> Search by File
  <input
      name="file"
      id="file"
      type="file"
      ref="file"
      disabled="disabled"
      @change="handleFileUpload"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
</label>

<br>
<br>
<div class="flex items-center justify-between">
  <button class="btn btn-light btn-sm active mx-auto" v-on:click="submitFile()">Search</button>
</div>
<p id="showData"></p>
</div>
</template>

<script>
import PostsService from "@/services/apiService";
import XLSX from '../../node_modules/xlsx/dist/xlsx.full.min.js'



export default {
  name: "OCMVerification",
  /*
    Defines the data used by the component
  */
  data() {
    return {
      excelData: [],
      file: '',
      input: {
        data: ""
      }
    }
  },

  methods: {
    /*
      Submits the file to the server

    */
    close() {
      var modal = document.getElementById("myModal");
      console.log("closing");
      document.getElementById('generatedesponse').value = '';
      if (document.getElementById('PURVerificationField') != null)
        document.getElementById('PURVerificationField').value = '';
      // this.$modal.hide('ocm-verify')
      modal.style.display = "none";
    },
    show() {
      this.$modal.show('ocm-verify')
    },
    async submitFile() {
      console.log(this.input.data);
      /*
              Initialize the form data
          */
      // let formData = new FormData();

      /*
          Add the form data we need to submit
      */
      // formData.append('file', this.file);
      if (this.input.data != '') {
        this.excelData = [];
        this.excelData[0] = {serialNumber: this.input.data};
        // console.log(this.excelData[0])
        this.input.data = '';
      }
      console.log(this.input.data);
      /*
        Make the request to the POST /single-file URL
      */
      let printString;
      printString = await PostsService.getAssetHistory(this.excelData, "OCM");
      this.CreateTableFromJSON(printString.data)
      console.log(JSON.stringify(printString.data));
      this.excelData = [];
    },


    /*
      Handles a change on the file upload
    */
    handleFileUpload(event) {
      var input = event.target;
      var reader = new FileReader();
      reader.onload = () => {
        var fileData = reader.result;
        var wb = XLSX.read(fileData, {type: 'binary'});
        for (const sheetName of wb.SheetNames) {
          this.excelData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
          // console.log(this.excelData);
        }
      };
      reader.readAsBinaryString(input.files[0]);
    },

    CreateTableFromJSON(myJSONArray) {
      console.log(myJSONArray);
      // EXTRACT VALUE FOR HTML HEADER.
      var col = [];
      // for (var i = 0; i < myJSONArray.length; i++) {
      //   for (var key in myJSONArray[i]) {
      //     if (col.indexOf(key) === -1) {
      //       col.push(key);
      //     }
      //   }
      // }

      col.push("ECID");
      col.push("Serial Number");
      col.push("Provenance Records");

      // CREATE DYNAMIC TABLE.
      var table = document.createElement("table");
      table.id = "table";
      // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
      // var ti = table.insertRow(-1);
      // var the = document.createElement("the");
      // the.innerHTML = "Chirag";
      // ti.appendChild(the);


      var tr = table.insertRow(-1);                   // TABLE ROW.

      for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
      }


      // ADD JSON DATA TO THE TABLE AS ROWS.
      for (i = 0; i < myJSONArray.length ; i++) {
        //console.log(myJSONArray[i][2]);
        tr = table.insertRow(-1);
        var j;
        for (j = 0; j < 2; j++) {
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = myJSONArray[i][col[j]];
        }
        tabCell = tr.insertCell(-1);
        var prov;
        var xyz = document.createElement('span');

        xyz.value = "";
        // xyz.className = "badge bg-primary";
        for (prov = 0; prov < myJSONArray[i]["Provenance Records"].length; prov++) {
          console.log(myJSONArray[i]["Provenance Records"][prov].BlockType);
          xyz.value = xyz.value.concat("[Owner: " + myJSONArray[i]["Provenance Records"][prov].currOwnerName + ", BlockType: " + myJSONArray[i]["Provenance Records"][prov].BlockType + "]");
          if (prov != myJSONArray[i]["Provenance Records"].length - 1)
            xyz.value = xyz.value.concat(" -->>")
          tabCell.innerText = xyz.value;
        }


        // var cap = table.createCaption()
        // cap.innerHTML = "<b>Table Verification Results</b>";
        //
        //
        // cap.innerHTML = "<b>Table Verification Results</b>";```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
      }
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "<b>Search Results</b>";
    divContainer.appendChild(table);

  }
}
}
</script>

<style>
label {

  margin-left: 110px;
}

h {
  font:14px Verdana;
}

th, td, input {
  font:14px Verdana;
}

table, th, td
{
  border: solid 1px #DDD;
  border-collapse: collapse;
  padding: 2px 20px;
  text-align: center;
  position: center;
  /*margin-left: 400px;*/
  margin : auto;
  class : "table table-hover"
}

th {
  font-weight:bold;
}



/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close {
  color: black;
  float: right;
  font-size: 28px;
  font-weight: bold;
  text-align: right;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

#file {
  margin-left: 0px;
}
#custom {

  margin-left : 30px;
}

#showData {
  margin-top: 30px;
  /*border: 1px solid #888;*/
  position: center;
}

#radiobutton {
  margin-right: 0px;
}

#head {
  margin-top: 30px;
}

#buttonForFile {
  position: center;
}

#showPURResults {
  margin-top: 30px;
}
</style>