// JSON using AJAX
$.getJSON("database.json", function(data) {
    var items = [];
    $.each(data, function(key, val) {
        items.push("<tr id='" + key + "'>");
        items.push("<td>" + val["School Name"] + "</td>");
        items.push("<td>" + val["School Type"] + "</td>");
        items.push("<td>" + val["Starting Median Salary"] + "</td>");
        items.push("<td>" + val["Mid-Career Median Salary"] + "</td>");
        items.push("<td>" + val["Mid-Career 10th Percentile Salary"] + "</td>");
        items.push("<td>" + val["Mid-Career 25th Percentile Salary"] + "</td>");
        items.push("<td>" + val["Mid-Career 75th Percentile Salary"] + "</td>");
        items.push("<td>" + val["Mid-Career 90th Percentile Salary"] + "</td>");
        items.push("</tr>");
    });
    $("<tbody/>", {
        html: items.join("")
    }).appendTo("table");
});


$(document).ready(function() {

    // Get index of column clicked, and sort that column
    $("#table-header").on("click", "th", function() {
        var $num = $(this).index();
        sortTable($num);
    });

    // Filter search for...
    document.querySelector('#myInput').addEventListener('keyup', filterTable, false);
});


// Sorting function
function sortTable(num) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("table-info");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[num];
      y = rows[i + 1].getElementsByTagName("TD")[num];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

// Filter algorithm
function filterTable(event) {
    var filter = event.target.value.toUpperCase();
    var rows = document.querySelector("#myTable tbody").rows;

  for (var i = 0; i < rows.length; i++) {
        var col_0 = rows[i].cells[0].textContent.toUpperCase();
        var col_1 = rows[i].cells[1].textContent.toUpperCase();
        var col_2 = rows[i].cells[2].textContent.toUpperCase();
        var col_3 = rows[i].cells[3].textContent.toUpperCase();
        var col_4 = rows[i].cells[4].textContent.toUpperCase();
        var col_5 = rows[i].cells[5].textContent.toUpperCase();
        var col_6 = rows[i].cells[6].textContent.toUpperCase();
        var col_7 = rows[i].cells[7].textContent.toUpperCase();
        if (col_0.indexOf(filter) > -1 || col_1.indexOf(filter) > -1 || col_2.indexOf(filter) > -1 || col_3.indexOf(filter) > -1 ||
    col_4.indexOf(filter) > -1 || col_5.indexOf(filter) > -1 || col_6.indexOf(filter) > -1 || col_7.indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}
