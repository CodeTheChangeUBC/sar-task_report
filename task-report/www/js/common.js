// Commonly shared elements/tasks

function createNavbar(navbar) {
  $.get('../templates/navbar.mst', (template) => {
    var nav = Mustache.render(template, navbar);
    $('.app').html(nav);
    $('#activities').click(navbar.target1);
    $('#repairs').click(navbar.target2);
    $('#resources').click(navbar.target3);
    $('#' + navbar.active).addClass("active");
  });
}

function buildHeader(headerObject) {
  $.get('../templates/header.mst', (template) => {
    var header = Mustache.render(template, headerObject );
    $('.app').append(header); // wipe all previous
    if (!headerObject.hideBackButton) {
      $('#back-button').click(headerObject.target)
    } else {
      $('#back-button').hide()
    }
  })
}

function buildTable(tableObject) {
  // tableObject = { DOMid: ...., title: ... , data-list: [...]}
  $.get('../templates/table.mst', (template) => {
    var table = Mustache.render(template, tableObject );
    $('.app').append(table);
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
    input = document.getElementById("search-bar");
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
