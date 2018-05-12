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
      $('#back-button').hide();
    }
  })
}

function createIncident(incidentObject) {
  $.get('../templates/create-activity-form.mst', (template) => {
    var form = Mustache.render(template, incidentObject);
    $('.app').append(form);
    if (localStorage.getItem("incidentTitle")) {
      $('#incidentTitle').val(localStorage.getItem("incidentTitle"));
    }
    if (localStorage.getItem("incidentStartDate")) {
      $('#incidentStartDate').val(localStorage.getItem("incidentStartDate"));
    }
    if (localStorage.getItem("incidentEndDate")) {
      $('#incidentEndDate').val(localStorage.getItem("incidentEndDate"));
    }
  });
}

function myFunction() {
  var incidentTitle = document.getElementById("incidentTitle");
  var incidentStartDate = document.getElementById("incidentStartDate");
  var incidentEndDate = document.getElementById("incidentEndDate");
  localStorage.setItem("incidentTitle", incidentTitle.value);
  localStorage.setItem("incidentStartDate", incidentStartDate.value);
  localStorage.setItem("incidentEndDate", incidentEndDate.value);
  Views.Members();
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
    $('#submit-incident').click(function() {
      localStorage.removeItem("incidentTitle");
      localStorage.removeItem("incidentStartDate");
      localStorage.removeItem("incidentEndDate");
    });
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
