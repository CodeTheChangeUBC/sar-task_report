// Commonly shared elements/tasks

function createNavbar(navbar) {
  $.get('../templates/navbar.mst', (template) => {
    var nav = Mustache.render(template, navbar);
    $('.app').html(nav);
    $('#activities').click(navbar.target1);
    $('#attendance').click(navbar.target2);
    $('#repairs').click(navbar.target3);
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
  });
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

function buildReportForm(formObject) {
  $.get('../templates/report-form.mst', (template) => {
    var form = Mustache.render(template, formObject);
    $('.app').append(form);
    if (localStorage.getItem("inputDescription")) {
      $('#inputDescription').val(localStorage.getItem("inputDescription"));
    }
    if (localStorage.getItem("inputAddress")) {
      $('#inputAddress').val(localStorage.getItem("inputAddress"));
    }
    if (localStorage.getItem("inputCity")) {
      $('#inputCity').val(localStorage.getItem("inputCity"));
    }
    if (localStorage.getItem("inputProvince")) {
      $('#inputProvince').val(localStorage.getItem("inputProvince"));
    }
    if (localStorage.getItem("inputPostal")) {
      $('#inputPostal').val(localStorage.getItem("inputPostal"));
    }
    if (localStorage.getItem("inputCountry")) {
      $('#inputCountry').val(localStorage.getItem("inputCountry"));
    }
    if (localStorage.getItem("inputLat")) {
      $('#inputLat').val(localStorage.getItem("inputLat"));
    }
    if (localStorage.getItem("inputLon")) {
      $('#inputLon').val(localStorage.getItem("inputLon"));
    }
  });
}

function storeIncidentDetails() {
  var incidentTitle = document.getElementById("incidentTitle");
  var incidentStartDate = document.getElementById("incidentStartDate");
  var incidentEndDate = document.getElementById("incidentEndDate");
  localStorage.setItem("incidentTitle", incidentTitle.value);
  localStorage.setItem("incidentStartDate", incidentStartDate.value);
  localStorage.setItem("incidentEndDate", incidentEndDate.value);
  Views.Members();
}

function storeIncidentReportDetails() {
  var description = document.getElementById("inputDescription");
  var streetAddress = document.getElementById("inputAddress");
  var city = document.getElementById("inputCity");
  var province = document.getElementById("inputProvince");
  var postalCode = document.getElementById("inputPostal");
  var country = document.getElementById("inputCountry");
  var lat = document.getElementById("inputLat");
  var lon = document.getElementById("inputLon");

  localStorage.setItem("description", description.value);
  localStorage.setItem("streetAddress", streetAddress.value);
  localStorage.setItem("city", city.value);
  localStorage.setItem("province", province.value);
  localStorage.setItem("postalCode", postalCode.value);
  localStorage.setItem("country", country.value);
  localStorage.setItem("lat", lat.value);
  localStorage.setItem("lon", lon.value);
}

function submitReport() {
  // submit report if online and clear local storage
  // otherwise display try again later error

}

function buildTable(tableObject) {
  // tableObject = { DOMid: ...., title: ... , data-list: [...]}
  $.get('../templates/table.mst', (template) => {
    var table = Mustache.render(template, tableObject );
    $('.app').append(table);
  });
}

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
  });
}

function createErrorMessage(messageObject) {
  $.get('../templates/error-message.mst', (template) => {
    var message = Mustache.render(template, messageObject);
    $('.app').append(message);
  });
}

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
