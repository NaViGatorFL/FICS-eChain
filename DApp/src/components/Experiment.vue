<template>
  <div >
<!--    <i class= "icon-plus-sign-alt" @click.prevent="show" id='clickableAwesomeFont'> Verify </i>-->
    <input type="button" @click.prevent="CreateTableFromJSON()" value="Create Table From JSON" />
    <p id="showData"></p>

  </div>
</template>



<style>
  th, td, p, input {
    font:14px Verdana;
  }
  table, th, td
  {
    border: solid 1px #DDD;
    border-collapse: collapse;
    padding: 2px 3px;
    text-align: center;
  }
  th {
    font-weight:bold;
  }
</style>


<script>
export default {
  name: "Experiment",

  methods: {

    // show() {
    //   this.$modal.show('ocm-verify')
    // },

    CreateTableFromJSON() {
      console.log("chirag")
  var myBooks = [
    {
      "Book ID": "1",
      "Book Name": "Computer Architecture",
      "Category": "Computers",
      "Price": "125.60"
    },
    {
      "Book ID": "2",
      "Book Name": "Asp.Net 4 Blue Book",
      "Category": "Programming",
      "Price": "56.00"
    },
    {
      "Book ID": "3",
      "Book Name": "Popular Science",
      "Category": "Science",
      "Price": "210.40"
    }
  ]

  // EXTRACT VALUE FOR HTML HEADER.
  // ('Book ID', 'Book Name', 'Category' and 'Price')
  var col = [];
  for (var i = 0; i < myBooks.length; i++) {
    for (var key in myBooks[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  var tr = table.insertRow(-1);                   // TABLE ROW.

  for ( i = 0; i < col.length; i++) {
    var th = document.createElement("th");      // TABLE HEADER.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for ( i = 0; i < myBooks.length; i++) {

    tr = table.insertRow(-1);

    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = myBooks[i][col[j]];
    }
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}
}
}
</script>