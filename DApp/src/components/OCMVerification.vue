<template>
  <div>
    <!--    <modal name="ocm-verify"  :adaptive="true" :height="550" :width="500">-->
    <!--        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>-->
    <!--      </label>-->
    <h1 id = "head"> Find Asset In BlockChain</h1>
    <input onclick="document.getElementById('custom').disabled = false; document.getElementById('file').disabled = true;" type="radio" name="type" checked="checked" id = "radiobutton"> Search by ID
    <input type="text" name="custom" id="custom" v-model="input.data" placeholder="Enter ECID" >
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
      <button class="btn btn-light btn-sm active mx-auto" v-on:click="submitFile()">Verify On Ledger</button>
    </div>
    <p id="showData"></p>
    <div id="myModal" class="modal">
      <!--      <button class="btn btn-default" data-dismiss="modal" aria-label="Close">Cancel</button>-->
      <!-- Modal content -->
      <div class="modal-content">
        <!--        <button class="btn btn-default" data-dismiss="modal" aria-label="Close">Cancel</button>-->
        <span class="close" @click = "close">&times;</span>
        <h1>PUF Verification</h1>
        <form v-on:submit="verifyPUFResponse">
          <div class="row mb-3">
            <label for="ecidValue" class="col-sm-2 col-form-label mx-auto">ECID</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="ecidValue" disabled>
            </div>
          </div>
          <div class="row mb-3">
            <label for="challengeValue" class="col-sm-2 col-form-label mx-auto">Challenge</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="challengeValue" disabled>
            </div>
          </div>
          <div class="row mb-3">
            <label for="challengeValue" class="col-sm-2 col-form-label mx-auto">Generated Response</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="generatedesponse" placeholder="Input the number" required>
            </div>
          </div>
          <br>
          <button type = "button" @click="verifyPUFResponse"> Verify PUF Response</button>
<!--          <input type="submit" value="Verify PUF Response" class = "btn btn-light btn-sm active mx-auto" @click="verifyPUFResponse">-->
        </form>
        <br>
        <p id="showPURResults"></p>
        <br>

      </div>
      <!--    </modal>-->
    </div>
  </div>
</template>

<script>
import PostsService from "@/services/apiService";
import XLSX from '../../node_modules/xlsx/dist/xlsx.full.min.js'


async function getChallenge(r) {
  // console.log("chirag")
  var rowId =
      r.id;
  // console.log(rowId);
  var ecid =
      document.getElementById(rowId).parentNode.parentNode.firstChild.textContent;

  var modal = document.getElementById("myModal");

  // var btn = document.getElementById(rowId);
  // console.log(btn);
  var span = document.getElementsByClassName("close")[0];
  // console.log(span);
  modal.style.display = "block";

  document.getElementById('ecidValue').value = ecid;
  let variable = await PostsService.getChallenge(ecid, "OCM");
  // console.log(variable)
  document.getElementById('challengeValue').value = variable.data.challenge;
  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }


}

export default {
  name: "OCMVerification",
  /*
    Defines the data used by the component
  */
  data(){
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
    close(){
      var modal = document.getElementById("myModal");
      console.log("closing");
      document.getElementById('generatedesponse').value ='';
      if(document.getElementById('PURVerificationField') != null)
      document.getElementById('PURVerificationField').value = '';
      // this.$modal.hide('ocm-verify')
      modal.style.display = "none";
    },
    show() {
      this.$modal.show('ocm-verify')
    },
    async verifyPUFResponse() {
      let generatedResponse = document.getElementById('generatedesponse').value;
      let ecidValue = document.getElementById('ecidValue').value;
      let challengeValue = document.getElementById('challengeValue').value;
      let response;
      response = await PostsService.pufVerify(ecidValue,challengeValue,generatedResponse,"OCM");
      // console.log(response.data.result);
      var input = document.createElement("input");
      input.type = "text";
      input.value = response.data.result;
      input.id = "PURVerificationField";
      input.disabled = true;
      input.className = "form-label col-md-2"; // set the CSS class
      var divContainer = document.getElementById("showPURResults");
      divContainer.innerHTML = "PUF Verification : ";
      divContainer.appendChild(input);


    },
    getChallenge()  {

    },
    async submitFile() {
  //console.log(this.input.data);
      /*
              Initialize the form data
          */
      // let formData = new FormData();

      /*
          Add the form data we need to submit
      */
      // formData.append('file', this.file);
      if(this.input.data != ''){
       // console.log("MAROKE")
        this.excelData = [];
        this.excelData[0]= {ECID : this.input.data};
        this.input.data = '';
      }
      /*
        Make the request to the POST /single-file URL
      */
      let printString;
      printString = await PostsService.verifyOnLedger(this.excelData, "OCM");
      //console.log(JSON.stringify(printString).data.provenanceRecords);
      this.CreateTableFromJSON(printString.data)
      //console.log(printString.data[1].provenanceRecords);
      this.excelData = [];
    },


    /*
      Handles a change on the file upload
    */
    handleFileUpload(event){
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

      col.push("ecid");
      col.push("serialNumber");
      col.push("Verification Results");
      col.push("Provenance Records");
      col.push("PUF Verification");

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

      var id = 1;
      // ADD JSON DATA TO THE TABLE AS ROWS.
      for (i = 0; i < myJSONArray.length; i++) {
        //console.log(myJSONArray[i][2]);
        tr = table.insertRow(-1);
        var j;
        for (j = 0; j < 3; j++) {
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = myJSONArray[i][col[j]];
        }

        // console.log(printString.data[1].provenanceRecords);

        tabCell = tr.insertCell(-1);
        var prov;
        var xyz = document.createElement('span');

        xyz.value = "";
        // xyz.className = "badge bg-primary";
        for(prov = 0; myJSONArray[i] !== undefined && myJSONArray[i]["Provenance Records"] !== undefined && prov < myJSONArray[i]["Provenance Records"].length; prov++){
          //console.log(myJSONArray[i]["Provenance Records"][prov].BlockType);
          xyz.value = xyz.value.concat("[Owner: " + myJSONArray[i]["Provenance Records"][prov].currOwnerName + ", BlockType: " + myJSONArray[i]["Provenance Records"][prov].BlockType + "]");
          if(prov != myJSONArray[i]["Provenance Records"].length - 1)
          xyz.value = xyz.value.concat(" -->>")
          tabCell.innerText = xyz.value;
        }


        // console.log(xyz.value);


        tabCell = tr.insertCell(-1);
        var btn = document.createElement('input');
        btn.type = "button";
        btn.className = "btn";
        btn.value = "Get Challenge";
        btn.id = id;
        btn.className = "btn btn-light btn-sm active mx-auto";
        id = id + 1;
        // var ecid = myJSONArray[i][col[1]];
        // console.log(ecid);
        // console.log(myJSONArray[i][col[1]]);
        btn.onclick = (function() {getChallenge(this)});
        tabCell.appendChild(btn);
         // tabCell.innerHTML = "asdada";
      }


      // var cap = table.createCaption()
      // cap.innerHTML = "<b>Table Verification Results</b>";
      //
      //
      //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      // cap.innerHTML = "<b>Table Verification Results</b>";```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

      // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
      var divContainer = document.getElementById("showData");
      divContainer.innerHTML = "<b>Table Verification Results</b>";
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