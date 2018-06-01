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
    var incidentObj = Views.State.getItem('incidentDetails');
    if (incidentObj.title) {
      $('#incidentTitle').val(incidentObj.title);
    }
    if (incidentObj.startDate) {
      $('#incidentStartDate').val(incidentObj.startDate);
    }
    if (incidentObj.endDate) {
      $('#incidentEndDate').val(incidentObj.endDate);
    }
  });
}

function buildReportForm(formObject) {
  $.get('../templates/report-form.mst', (template) => {
    var form = Mustache.render(template, formObject);
    $('.app').append(form);
    var incidentReportObj = Views.State.getItem('incidentReportDetails')
    if (incidentReportObj.description) {
      $('#inputDescription').val(incidentReportObj.description);
    }
    if (incidentReportObj.streetAddress) {
      $('#inputAddress').val(incidentReportObj.streetAddress);
    }
    if (incidentReportObj.city) {
      $('#inputCity').val(incidentReportObj.city);
    }
    if (incidentReportObj.province) {
      $('#inputProvince').val(incidentReportObj.province);
    }
    if (incidentReportObj.postalCode) {
      $('#inputPostal').val(incidentReportObj.postalCode);
    }
    if (incidentReportObj.country) {
      $('#inputCountry').val(incidentReportObj.country);
    }
    if (incidentReportObj.lat) {
      $('#inputLat').val(incidentReportObj.lat);
    }
    if (incidentReportObj.lon) {
      $('#inputLon').val(incidentReportObj.lon);
    }
  });
}

function storeIncidentDetails() {
  var title = document.getElementById("incidentTitle").value;
  var startDate = document.getElementById("incidentStartDate").value;
  var endDate = document.getElementById("incidentEndDate").value;
  var incidentObj = { 
    title, 
    startDate,
    endDate
  }
  Views.State.setItem("incidentDetails", incidentObj)
  Views.Members();
  return
}

function storeIncidentReportDetails() {
  var description = document.getElementById("inputDescription").value;
  var streetAddress = document.getElementById("inputAddress").value;
  var city = document.getElementById("inputCity").value;
  var province = document.getElementById("inputProvince").value;
  var postalCode = document.getElementById("inputPostal").value;
  var country = document.getElementById("inputCountry").value;
  var lat = document.getElementById("inputLat").value;
  var lon = document.getElementById("inputLon").value;

  var incidentReportObj =  {
    description,
    streetAddress,
    city,
    province,
    postalCode,
    country,
    lat,
    lon  
  }
  Views.State.setItem("incidentReportDetails", incidentReportObj)
  return
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
      Views.State.removeItem("incidentDetails");
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
