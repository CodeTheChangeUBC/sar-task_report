// Commonly shared elements/tasks

function buildTable(tableObject) {
  // tableObject = { DOMid: ...., title: ... , data-list: [...]}
  $.get('../templates/table.mst', (template) => {
    var table = Mustache.render(template, tableObject );
    $('.app').html(table);
  })
};

function buildButton(buttonObject) {
  $.get('../templates/button.mst', (template) => {
    var button = Mustache.render(template, buttonObject );
    $(buttonObject.parentSelector).append(button);
    $('#' + buttonObject.id).click(buttonObject.target);
  })
};

function searchBarUpdate() {
    var input, filter, table, tr, label, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table= document.getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        label = tr[i].getElementsByTagName("label")[0];
        if (label.textContent.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";

        }
    }
}
